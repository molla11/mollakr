'use strict';
/* Cell-centred surface heights on a rectangular tank, with zero normal slope at its walls. */
function createCaustics({SurfaceMesh, rasterize}) {
  const NX = 134, NY = 70, DX = 0.009, SPEED = 0.19, DT = 1 / 240;
  const SCALE = 9, WIDTH = NX*SCALE, HEIGHT = NY*SCALE, PITCH = DX/SCALE;
  const SOURCE_HEIGHT = 0.40, ETA = 1.0003 / 1.333;
  const CENTER_X = WIDTH * PITCH / 2, CENTER_Y = HEIGHT * PITCH / 2;
  // Normalize the lamp to its flat-floor irradiance directly underneath, at 25 cm depth.
  const LAMP_POWER = (SOURCE_HEIGHT + 0.25 * ETA) ** 2;
  const DEFAULTS = Object.freeze({depth: 25, angle: 0, amplitude: 5, damping: 0.03,
    source: 'parallel', lampX: -15, lampY: 8});
  function centerAngle(p) {
    if (p.source !== 'point') return p.angle;
    return Math.atan2(Math.hypot(p.lampX,p.lampY) / 100, SOURCE_HEIGHT) * 180 / Math.PI;
  }
  function generator() {
    let state = 143159;
    return () => ((state = (Math.imul(1664525, state) + 1013904223) >>> 0) / 4294967296);
  }
  class Wave {
    constructor() {
      this.h = new Float64Array(NX * NY);
      this.prev = new Float64Array(NX * NY);
      this.reset();
    }
    reset(initialWave = 'interference') {
      this.surfaceDirty = true;
      this.time = 0;
      this.initialWave = initialWave;
      this.h.fill(0);
      this.prev.fill(0);
      if (initialWave === 'pulse') {
        this.disturb(0.5, 0.5);
        return;
      }
      // Reflecting-wall eigenmodes supply only the initial displacement and velocity.
      const rng = generator();
      for (let m = 0; m < 96; m++) {
        const a = rng() * Math.PI / 2;
        const fine = m >= 70;
        const k = (fine ? 9.5 + 5.5 * rng() : 3.5 + 5.5 * rng()) * 2 * Math.PI;
        const weight = fine ? 0.48 : 1;
        const kx = Math.round(Math.cos(a) * k * (NX * DX) / Math.PI) * Math.PI / (NX * DX);
        const ky = Math.round(Math.sin(a) * k * (NY * DX) / Math.PI) * Math.PI / (NY * DX);
        const p = rng() * Math.PI * 2, w = SPEED * Math.hypot(kx, ky);
        const a0 = weight * Math.cos(p), a1 = weight * Math.cos(p - w * DT);
        const xx = Array.from({length: NX}, (_, x) => Math.cos(kx * (x + 0.5) * DX));
        for (let y = 0; y < NY; y++) {
          const yy = Math.cos(ky * (y + 0.5) * DX);
          for (let x = 0; x < NX; x++) {
            const i = y * NX + x, shape = xx[x] * yy;
            this.h[i] += a0 * shape;
            this.prev[i] += a1 * shape;
          }
        }
      }
      const rms = Math.sqrt(this.h.reduce((s, x) => s + x*x, 0) / this.h.length);
      for (let i = 0; i < this.h.length; i++) { this.h[i] /= rms; this.prev[i] /= rms; }
    }
    step(gamma) {
      const r2 = (SPEED * DT / DX) ** 2, g = gamma * DT;
      const h = this.h, dest = this.prev;
      for (let y = 0; y < NY; y++) {
        const top = y ? -NX : 0, bottom = y < NY - 1 ? NX : 0;
        for (let x = 0, i = y * NX; x < NX; x++, i++) {
          const lap = h[i + top] + h[i + bottom] + h[x ? i-1 : i] + h[x < NX-1 ? i+1 : i] - 4*h[i];
          dest[i] = (2*h[i] - (1-g)*dest[i] + r2*lap) / (1+g);
        }
      }
      this.prev = h; this.h = dest; this.time += DT; this.surfaceDirty = true;
    }
    disturb(xFraction, yFraction) {
      this.surfaceDirty = true;
      const radius = 0.045 / DX, extent = 0.144 / DX;
      const cx = (WIDTH * PITCH * xFraction) / DX - 0.5;
      const cy = (HEIGHT * PITCH * yFraction) / DX - 0.5;
      for (let y = Math.max(0, Math.floor(cy-extent)); y <= Math.min(NY-1, Math.ceil(cy+extent)); y++) {
        for (let x = Math.max(0, Math.floor(cx-extent)); x <= Math.min(NX-1, Math.ceil(cx+extent)); x++) {
          const r = ((x-cx)**2 + (y-cy)**2) / (radius*radius);
          const pulse = 4.2 * (1-r) * Math.exp(-r);
          this.h[y*NX+x] += pulse; this.prev[y*NX+x] += pulse;
        }
      }
    }
    copyFrom(wave) {
      this.h.set(wave.h);
      this.prev.set(wave.prev);
      this.time=wave.time;
      this.initialWave=wave.initialWave;
      this.surfaceDirty=true;
    }
  }
  class Tank extends Wave {
    constructor() {
      super();
      this.mesh = new SurfaceMesh(NX,NY,DX);
      this.u = new Float64Array(this.mesh.height.length);
      this.v = new Float64Array(this.u.length);
      this.j = new Float64Array(this.u.length);
      this.flux = new Float64Array(this.u.length);
      this.radiance = new Float64Array(this.u.length);
      this.raw = new Float32Array(WIDTH * HEIGHT);
      this.scratch = new Float32Array(WIDTH * HEIGHT);
      this.light = new Float32Array(WIDTH * HEIGHT);
    }
    trace(params) {
      const z = params.amplitude * 0.001, depth = params.depth * 0.01;
      const a = params.angle * Math.PI / 180, beamX = Math.sin(a), beamZ = -Math.cos(a);
      const point = params.source === 'point';
      const lampX = CENTER_X + params.lampX / 100, lampY = CENTER_Y - params.lampY / 100;
      const eta = ETA, u=this.u, v=this.v, flux=this.flux, mesh=this.mesh;
      const {cols,rows}=mesh;
      if(this.surfaceDirty){mesh.update(this.h);this.surfaceDirty=false;}
      for (let y=0; y<rows; y++) {
        for (let x=0, i=y*cols; x<cols; x++, i++) {
          const gx=mesh.gx[i]*z, gy=mesh.gy[i]*z;
          const nz=1/Math.sqrt(1+gx*gx+gy*gy), nx=-gx*nz, ny=-gy*nz;
          const px=x*DX*.5, py=y*DX*.5, height=mesh.height[i]*z;
          let ix = beamX, iy = 0, iz = beamZ, power = 1 / -beamZ;
          if (point) {
            const rx = px-lampX, ry = py-lampY, rz = height-SOURCE_HEIGHT;
            const r2 = rx*rx + ry*ry + rz*rz, invR = 1 / Math.sqrt(r2);
            ix = rx*invR; iy = ry*invR; iz = rz*invR;
            power = LAMP_POWER / r2;
          }
          const cosI = -(ix*nx + iy*ny + iz*nz);
          const bend = eta*cosI - Math.sqrt(1 - eta*eta*(1 - cosI*cosI));
          const tz = eta*iz + bend*nz;
          const distance = -(depth + height) / tz;
          u[i] = (px + distance*(eta*ix+bend*nx)) / PITCH - 0.5;
          v[i] = (py + distance*(eta*iy+bend*ny)) / PITCH - 0.5;
          flux[i] = Math.max(0, cosI) * power / nz;
        }
      }
      for(let y=0;y<rows;y++)for(let x=0,i=y*cols;x<cols;x++,i++){
        const l=x?i-1:i,r=x<cols-1?i+1:i,t=y?i-cols:i,b=y<rows-1?i+cols:i;
        const area=(r-l)*(b-t)/cols*(SCALE/2)**2;
        this.j[i]=((u[r]-u[l])*(v[b]-v[t])-(v[r]-v[l])*(u[b]-u[t]))/area;
        this.radiance[i]=flux[i]/Math.max(1e-9,Math.abs(this.j[i]));
      }
      const out = this.raw;
      rasterize(out,WIDTH,HEIGHT,u,v,flux,this.j,this.radiance,cols,rows,(SCALE/2)**2/2);
      // Finite detector response: separable [1,2,1]/4 filter, with reflecting edges.
      const tmp = this.scratch, light = this.light;
      for (let y=0; y<HEIGHT; y++) for (let x=0,i=y*WIDTH; x<WIDTH; x++,i++)
        tmp[i] = (out[x?i-1:i]+2*out[i]+out[x<WIDTH-1?i+1:i])*0.25;
      let sum=0, sum2=0, max=0;
      const bins = new Uint32Array(37);
      for (let y=0; y<HEIGHT; y++) for (let x=0,i=y*WIDTH; x<WIDTH; x++,i++) {
        const n = (tmp[y?i-WIDTH:i]+2*tmp[i]+tmp[y<HEIGHT-1?i+WIDTH:i])*0.25;
        light[i]=n; sum+=n; sum2+=n*n; max=Math.max(max,n);
        bins[Math.min(36, Math.floor(n*9))]++;
      }
      const mean = sum/light.length;
      return {mean, max, contrast: Math.sqrt(Math.max(0,sum2/light.length-mean*mean)) / mean, bins};
    }
    sourceValue(field, x, y) {
      const xx=Math.max(0,Math.min(NX-1,(x+.5)/SCALE-.5)), yy=Math.max(0,Math.min(NY-1,(y+.5)/SCALE-.5));
      const sx=Math.min(NX-2,Math.floor(xx)), sy=Math.min(NY-2,Math.floor(yy)), fx=xx-sx, fy=yy-sy, i=sy*NX+sx;
      return (field[i]*(1-fx)+field[i+1]*fx)*(1-fy)+(field[i+NX]*(1-fx)+field[i+NX+1]*fx)*fy;
    }
  }
  return {Tank, Wave, WIDTH, HEIGHT, NX, NY, PITCH, DT, SPEED, DX, SOURCE_HEIGHT, ETA, centerAngle, DEFAULTS};
}
if (typeof module !== 'undefined' && module.exports) module.exports = createCaustics(require('./optics.js'));
else globalThis.Caustics = createCaustics(globalThis.WaterOptics);
