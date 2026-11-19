'use strict';
function createTankColors({WIDTH,HEIGHT,PITCH},cols,rows) {
  const stages={
    floor:[[0,5,33,51],[.25,6,58,77],[.5,12,89,108],[.78,24,121,137],[1.05,42,151,159],[1.5,75,182,181],[2.15,131,213,199],[3.25,198,238,217],[5.5,244,255,236],[9,253,255,244]],
    jacobian:[[0,5,36,55],[.35,16,73,91],[.65,45,130,139],[.86,116,201,186],[.98,243,252,211]]
  };
  function ramp(stops,value){
    let j=1;while(j<stops.length-1 && value>stops[j][0]) j++;
    const a=stops[j-1], b=stops[j], t=Math.max(0,Math.min(1,(value-a[0])/(b[0]-a[0])));
    return [1,2,3].map(k=>Math.round(a[k]+(b[k]-a[k])*t));
  }
  function lookup(stops,min,max) {
    const lut=new Uint8Array(2048*3);
    for(let i=0;i<2048;i++) lut.set(ramp(stops,min+(max-min)*i/2047),i*3);
    return lut;
  }
  const palette={floor:lookup(stages.floor,0,8),jacobian:lookup(stages.jacobian,0,1)};
  function pack(r,g,b){return (255<<24)|(b<<16)|(g<<8)|r;}
  const floorColors=new Uint32Array(2048), jacColors=new Uint32Array(2048);
  for(let i=0;i<2048;i++){
    const k=3*i;
    floorColors[i]=pack(palette.floor[k],palette.floor[k+1],palette.floor[k+2]);
    jacColors[i]=pack(palette.jacobian[k],palette.jacobian[k+1],palette.jacobian[k+2]);
  }
  // Reconstruct signed heights and determinants before applying their colour scales.
  function cubicAxis(length,nodes){
    const index=new Int32Array(length*4),weight=new Float32Array(length*4);
    for(let i=0;i<length;i++){
      const x=(i+.5)*(nodes-1)/length,cell=Math.floor(x),t=x-cell,t2=t*t,t3=t2*t;
      weight.set([(-t+2*t2-t3)/2,1-2.5*t2+1.5*t3,(t+4*t2-3*t3)/2,(-t2+t3)/2],4*i);
      for(let j=0;j<4;j++)index[4*i+j]=Math.min(nodes-1,Math.max(0,cell+j-1));
    }
    return {index,weight};
  }
  const xMesh=cubicAxis(WIDTH,cols),yMesh=cubicAxis(HEIGHT,rows);
  const scan=new Float32Array(cols);
  function paintMap(tank,params,mode,rgba){
    const surface=mode==='surface',values=surface?tank.mesh.height:tank.j,cols=tank.mesh.cols;
    for(let y=0;y<HEIGHT;y++){
      const yi=y*4;
      for(let col=0;col<cols;col++){
        let v=0;for(let k=yi;k<yi+4;k++)v+=yMesh.weight[k]*values[yMesh.index[k]*cols+col];
        scan[col]=v;
      }
      for(let x=0,i=y*WIDTH;x<WIDTH;x++,i++){
        const k=x*4,w=xMesh.weight,ix=xMesh.index;
        const v=w[k]*scan[ix[k]]+w[k+1]*scan[ix[k+1]]+w[k+2]*scan[ix[k+2]]+w[k+3]*scan[ix[k+3]];
        if(surface){
          const gray=Math.min(255,Math.max(0,Math.round(127.5+v*params.amplitude*8.5)));
          rgba[i]=pack(gray,gray,gray);
        }else rgba[i]=jacColors[Math.round(2047/(1+2.8*Math.abs(v)))];
      }
    }
  }
  let tile;
  function tileMaterial(){
    const material=new Float32Array(WIDTH*HEIGHT),size=.12/PITCH;
    for(let y=0,i=0;y<HEIGHT;y++)for(let x=0;x<WIDTH;x++,i++){
      const sx=(x+.5)/size,sy=(y+.5)/size;
      const d=Math.min(Math.abs(sx-Math.round(sx)),Math.abs(sy-Math.round(sy)))*size;
      material[i]=1-.25*Math.exp(-d*d/1.1)+.015*Math.sin(Math.floor(sx)*72.7+Math.floor(sy)*113.3);
    }
    return material;
  }
  function render(tank,params,mode,grid,rgba){
    if(mode==='floor'){
      if(grid && !tile)tile=tileMaterial();
      if(!grid){
        for(let i=0;i<rgba.length;i++)rgba[i]=floorColors[Math.min(2047,Math.round(tank.light[i]*2047/8))];
      }else for(let i=0;i<rgba.length;i++){
          const q=Math.min(2047,Math.round(tank.light[i]*2047/8));
          const k=q*3,g=tile[i],lut=palette.floor;
          rgba[i]=pack(Math.min(255,Math.round(lut[k]*g)),Math.min(255,Math.round(lut[k+1]*g)),Math.min(255,Math.round(lut[k+2]*g)));
      }
    }else paintMap(tank,params,mode,rgba);
  }
  return {render,palette};
}
