/* Cubic reconstruction of cell-centred water heights, and conservative light transport. */
function createWaterOptics() {
  'use strict';
  function splineAxis(size) {
    const inverse = new Float64Array(size);
    inverse[0] = 1/5;
    for (let i=1; i<size; i++) inverse[i] = 1/((i === size-1 ? 5 : 4)-inverse[i-1]);
    function solve(values, start, stride) {
      values[start] *= 6*inverse[0];
      for (let i=1, p=start+stride; i<size; i++, p+=stride)
        values[p] = (6*values[p]-values[p-stride])*inverse[i];
      for (let i=size-2, p=start+i*stride; i>=0; i--, p-=stride)
        values[p] -= inverse[i]*values[p+stride];
    }
    const count=2*size+1, indices=new Int32Array(count*4);
    const weights=new Float64Array(count*4), slopes=new Float64Array(count*4);
    for (let n=0; n<count; n++) {
      const x=(n-1)/2, cell=Math.floor(x), mid=x!==cell;
      const w=mid?[1/48,23/48,23/48,1/48]:[1/6,4/6,1/6,0];
      const d=mid?[-1/8,-5/8,5/8,1/8]:[-.5,0,.5,0];
      for(let k=0; k<4; k++){
        const j=cell+k-1;
        indices[4*n+k]=j<0?-1-j:(j>=size?2*size-1-j:j);
        weights[4*n+k]=w[k];slopes[4*n+k]=d[k];
      }
    }
    return {solve,indices,weights,slopes};
  }
  class SurfaceMesh {
    constructor(nx,ny,dx){
      this.nx=nx;this.ny=ny;this.dx=dx;this.cols=2*nx+1;this.rows=2*ny+1;
      this.xAxis=splineAxis(nx);this.yAxis=splineAxis(ny);
      this.coefficients=new Float64Array(nx*ny);
      this.xHeight=new Float64Array(this.cols*ny);this.xSlope=new Float64Array(this.cols*ny);
      this.height=new Float64Array(this.cols*this.rows);this.gx=new Float64Array(this.height.length);this.gy=new Float64Array(this.height.length);
    }
    update(heights){
      const {nx,ny,cols,rows,coefficients:c,xAxis:x,yAxis:y,xHeight,xSlope}=this;
      c.set(heights);
      for(let row=0;row<ny;row++)x.solve(c,row*nx,1);
      for(let col=0;col<nx;col++)y.solve(c,col,nx);
      for(let row=0;row<ny;row++)for(let col=0;col<cols;col++){
        let h=0,g=0;
        for(let k=4*col;k<4*col+4;k++){const value=c[row*nx+x.indices[k]];h+=x.weights[k]*value;g+=x.slopes[k]*value;}
        xHeight[row*cols+col]=h;xSlope[row*cols+col]=g;
      }
      for(let row=0;row<rows;row++)for(let col=0,i=row*cols;col<cols;col++,i++){
        let h=0,gx=0,gy=0;
        for(let k=row*4;k<row*4+4;k++){
          const j=y.indices[k]*cols+col;
          h+=y.weights[k]*xHeight[j];gx+=y.weights[k]*xSlope[j];gy+=y.slopes[k]*xHeight[j];
        }
        this.height[i]=h;this.gx[i]=gx/this.dx;this.gy[i]=gy/this.dx;
      }
    }
  }

  // Integrate a projected triangle in horizontal strips. Splitting at its middle
  // vertex keeps both edges linear and conserves its power even at a narrow fold.
  function rasterize(out,width,height,u,v,flux,jacobian,radiance,cols,rows,sourceArea){
    out.fill(0);
    let baseLight=0,lightX=0,lightY=0,originX=0,originY=0;
    function strip(y0,y1,left,right,leftSlope,rightSlope){
      const start=Math.max(0,y0),end=Math.min(height,y1);
      if(start>=end)return;
      for(let y=Math.floor(start);y<end;y++){
        const top=Math.max(y,start),bottom=Math.min(y+1,end);
        const offset=(top+bottom)*.5-y0;
        const l=Math.max(0,left+leftSlope*offset),r=Math.min(width,right+rightSlope*offset);
        if(l>=r)continue;
        const first=Math.floor(l),last=Math.ceil(r)-1,base=y*width,dy=bottom-top;
        const atLeft=baseLight+lightY*((top+bottom)*.5-originY)+lightX*(l-originX);
        if(first===last){out[base+first]+=(r-l)*dy*(atLeft+lightX*(r-l)*.5);continue;}
        out[base+first]+=(first+1-l)*dy*(atLeft+lightX*(first+1-l)*.5);
        let value=dy*(atLeft+lightX*(first+1.5-l));const step=dy*lightX;
        for(let x=first+1;x<last;x++,value+=step)out[base+x]+=value;
        out[base+last]+=(r-last)*dy*(atLeft+lightX*((last+r)*.5-l));
      }
    }
    function triangle(a,b,c,gain){
      if(v[a]>v[b]){const t=a;a=b;b=t;}
      if(v[b]>v[c]){const t=b;b=c;c=t;}
      if(v[a]>v[b]){const t=a;a=b;b=t;}
      const x0=u[a]+.5,y0=v[a]+.5,x1=u[b]+.5,y1=v[b]+.5,x2=u[c]+.5,y2=v[c]+.5;
      if(y2<=0 || y0>=height || Math.max(x0,x1,x2)<=0 || Math.min(x0,x1,x2)>=width)return;
      const det=(x1-x0)*(y2-y0)-(x2-x0)*(y1-y0),area=Math.abs(det)*.5;
      const mass=(flux[a]+flux[b]+flux[c])*sourceArea/3;
      if(area<1e-10){
        const x=Math.floor((x0+x1+x2)/3),y=Math.floor((y0+y1+y2)/3);
        if(x>=0 && x<width && y>=0 && y<height)out[y*width+x]+=mass;
        return;
      }
      originX=x0;originY=y0;
      if(gain>0){
        baseLight=gain*radiance[a];
        const db=gain*radiance[b]-baseLight,dc=gain*radiance[c]-baseLight;
        lightX=(db*(y2-y0)-dc*(y1-y0))/det;lightY=((x1-x0)*dc-(x2-x0)*db)/det;
      }else{baseLight=mass/area;lightX=0;lightY=0;}
      const longSlope=(x2-x0)/(y2-y0),cross=x0+longSlope*(y1-y0);
      const middleIsLeft=x1<cross;
      if(y1>y0){
        const shortSlope=(x1-x0)/(y1-y0);
        strip(y0,y1,x0,x0,middleIsLeft?shortSlope:longSlope,middleIsLeft?longSlope:shortSlope);
      }
      if(y2>y1){
        const shortSlope=(x2-x1)/(y2-y1);
        strip(y1,y2,Math.min(x1,cross),Math.max(x1,cross),middleIsLeft?shortSlope:longSlope,middleIsLeft?longSlope:shortSlope);
      }
    }
    for(let y=0;y<rows-1;y++)for(let x=0,i=y*cols;x<cols-1;x++,i++){
      const r=i+1,b=i+cols,d=b+1;
      const lo=Math.min(jacobian[i],jacobian[r],jacobian[b],jacobian[d]);
      const hi=Math.max(jacobian[i],jacobian[r],jacobian[b],jacobian[d]);
      let gain=0;
      // In a single-valued patch, interpolate flux/|J| and match the total
      // incident power of the quad. Keep finite footprints at sign-changing folds.
      if(lo>.035 || hi<-.035){
        const dx=u[d]-u[i],dy=v[d]-v[i];
        const a1=.5*Math.abs((u[r]-u[i])*dy-(v[r]-v[i])*dx);
        const a2=.5*Math.abs(dx*(v[b]-v[i])-dy*(u[b]-u[i]));
        const ends=radiance[i]+radiance[d];
        const estimate=(a1*(ends+radiance[r])+a2*(ends+radiance[b]))/3;
        if(estimate>1e-10)gain=(flux[i]+flux[r]+flux[b]+flux[d])*sourceArea*.5/estimate;
      }
      triangle(i,r,d,gain);triangle(i,d,b,gain);
    }
  }
  return {SurfaceMesh,rasterize};
}
if(typeof module!=='undefined' && module.exports)module.exports=createWaterOptics();
else globalThis.WaterOptics=createWaterOptics();
