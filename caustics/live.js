'use strict';

// On a local file the same functions are passed to a Blob worker, since a
// relative worker URL requires an HTTP origin in many browsers.
function renderWorker(model) {
  const tank=new model.Tank();
  const colors=createTankColors(model,tank.mesh.cols,tank.mesh.rows);
  self.onmessage=({data})=>{
    const {height,params,mode,grid}=data;
    const pixels=data.buffer ? new Uint32Array(data.buffer) : new Uint32Array(model.WIDTH*model.HEIGHT);
    tank.h.set(height);
    tank.surfaceDirty=true;
    const metrics=tank.trace(params);
    colors.render(tank,params,mode,grid,pixels);
    self.postMessage({buffer:pixels.buffer,metrics},[pixels.buffer]);
  };
}

if(typeof document==='undefined'){
  importScripts('optics.js','physics.js','colors.js');
  renderWorker(self.Caustics);
}

class FrameQueue {
  constructor(model){
    this.wave=new model.Wave();
    this.dt=model.DT;
    this.workers=[];
    this.freeFrames=[];
    this.freePixels=[];
    this.pending=new Map();
    this.first=0;
    this.next=0;
    this.generation=0;
    this.available=true;
    try{
      const count=Math.min(4,Math.max(2,(navigator.hardwareConcurrency || 4)-1));
      let url='live.js';
      if(location.protocol==='file:'){
        const source=[createWaterOptics,createCaustics,createTankColors,renderWorker].map(fn=>fn.toString()).join('\n');
        url=this.blobURL=URL.createObjectURL(new Blob([source,'\nrenderWorker(createCaustics(createWaterOptics()));'],{type:'text/javascript'}));
      }
      for(let i=0;i<count;i++){
        const worker=new Worker(url);
        worker.onmessage=({data})=>this.receive(worker,data);
        worker.onerror=()=>this.close();
        this.workers.push(worker);
      }
    }catch{this.close();}
  }
  reset(wave){
    for(const frame of this.pending.values())this.release(frame);
    this.pending.clear();
    this.generation++;
    this.first=this.next=0;
    this.wave.copyFrom(wave);
  }
  close(){
    this.available=false;
    for(const worker of this.workers)worker.terminate();
    this.workers.length=0;
    if(this.blobURL){URL.revokeObjectURL(this.blobURL);this.blobURL=null;}
  }
  fill(params,mode,grid,steps,targetTime){
    for(const worker of this.workers){
      if(worker.frame || this.next-this.first>=this.workers.length+2)continue;
      const frame=this.freeFrames.pop() || {h:new Float64Array(this.wave.h.length),prev:new Float64Array(this.wave.h.length)};
      // If rendering falls behind, advance the wave at its physical timestep
      // and project the next current state without rendering the missed states.
      const skip=Math.max(0,Math.floor((targetTime-this.wave.time)/this.dt));
      for(let i=0;i<skip+steps;i++)this.wave.step(params.damping);
      frame.h.set(this.wave.h);frame.prev.set(this.wave.prev);frame.time=this.wave.time;
      frame.initialWave=this.wave.initialWave;
      frame.generation=this.generation;frame.index=this.next++;
      worker.frame=frame;
      const buffer=this.freePixels.pop();
      worker.postMessage({height:frame.h,params,mode,grid,buffer},buffer?[buffer]:[]);
    }
  }
  receive(worker,data){
    const frame=worker.frame;
    worker.frame=null;
    frame.buffer=data.buffer;
    frame.metrics=data.metrics;
    if(frame.generation===this.generation && frame.index>=this.first)this.pending.set(frame.index,frame);
    else this.release(frame);
  }
  take(targetTime){
    let next=null;
    for(const candidate of this.pending.values()){
      if(candidate.time<=targetTime && (!next || candidate.index>next.index))next=candidate;
    }
    if(!next)return null;
    this.first=next.index+1;
    for(const frame of this.pending.values()){
      if(frame.index>=this.first)continue;
      this.pending.delete(frame.index);
      if(frame!==next)this.release(frame);
    }
    return next;
  }
  release(frame){
    if(frame.buffer)this.freePixels.push(frame.buffer);
    frame.buffer=null;
    this.freeFrames.push(frame);
  }
}
