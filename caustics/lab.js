(() => {
  'use strict';
  const {Tank, WIDTH, HEIGHT, PITCH, DT, SOURCE_HEIGHT, ETA, centerAngle, DEFAULTS} = window.Caustics;
  const $ = id => document.getElementById(id);
  const drawings = {
    book:'<path d="M3 4.5c3.4-.8 6.4-.1 9 2 2.6-2.1 5.6-2.8 9-2v14c-3.4-.8-6.4-.1-9 2-2.6-2.1-5.6-2.8-9-2zM12 6.5v14"/>',
    scan:'<path d="M9 4H5a1 1 0 0 0-1 1v4m11-5h4a1 1 0 0 1 1 1v4M4 15v4a1 1 0 0 0 1 1h4m6 0h4a1 1 0 0 0 1-1v-4M7 13c2.2 0 2.7-4 5-3s2.3 3.7 5 .8"/>',
    sliders:'<path d="M3 7h5m4 0h9M3 17h10m4 0h4"/><circle cx="10" cy="7" r="2.2"/><circle cx="15" cy="17" r="2.2"/>',
    reset:'<path d="M3.5 10A8.5 8.5 0 1 1 5 17M3 4v6h6"/>',
    rewind:'<path d="m9 4-5 4 5 4M4 8h9a6 6 0 0 1 0 12h-3"/>',
    pulse:'<circle cx="12" cy="12" r="2" fill="currentColor"/><circle cx="12" cy="12" r="6"/><path d="M5 5a10 10 0 0 0 0 14M19 5a10 10 0 0 1 0 14"/>',
    pause:'<path d="M8.5 5v14m7-14v14" stroke-width="3.8"/>',
    play:'<path d="m7 4 12 8-12 8z" fill="currentColor" stroke="none"/>',
    pointer:'<path d="m4 3 6 17 2.8-7 6.6-3z"/>',
    chevron:'<path d="m6 9 6 6 6-6"/>',
    grid:'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18m6-18v18"/>',
    expand:'<path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/>',
    collapse:'<path d="M3 8h5V3m8 0v5h5M3 16h5v5m8 0v-5h5"/>',
    sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>',
    wave:'<path d="M2 13h3c2.1 0 2.9-8 5-8s2.3 14 5 14c1.5 0 2.1-6 4-6h3"/>',
    capture:'<path d="M8 6l2-2h4l2 2h4a1 1 0 0 1 1 1v12H3V7a1 1 0 0 1 1-1z"/><circle cx="12" cy="12.5" r="3.3"/>',
    activity:'<path d="M2 13h5l3-8 4 15 3-9 2 2h3"/>',
    layers:'<path d="m3 8 9-5 9 5-9 5zM3 12l9 5 9-5M3 16l9 5 9-5"/>',
    download:'<path d="M12 3v12m-5-5 5 5 5-5M4 16v4h16v-4"/>',
    flask:'<path d="M9 3h6m-5 0v6l-6 10a1.2 1.2 0 0 0 1 2h14a1.2 1.2 0 0 0 1-2L14 9V3M7 15h10"/>',
    close:'<path d="m5 5 14 14M19 5 5 19"/>',external:'<path d="M13 4h7v7m0-7L10 14m7-1v7H4V7h7"/>'
  };
  const icon = key => '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">'+drawings[key]+'</svg>';
  document.querySelectorAll('[data-icon]').forEach(el=>el.outerHTML=icon(el.dataset.icon));
  const tank=new Tank(), params={...DEFAULTS}, ctx=$('field').getContext('2d',{alpha:false});
  ctx.canvas.width=WIDTH;ctx.canvas.height=HEIGHT;
  const image=ctx.createImageData(WIDTH,HEIGHT), rgba=new Uint32Array(image.data.buffer);
  const history=new ContrastHistory(), records=[];
  let mode='floor',grid=false,playing=!matchMedia('(prefers-reduced-motion: reduce)').matches;
  const queue=new FrameQueue(window.Caustics), interval=1000/60;
  let speed=1, metrics, sampleAt=0, accumulated=0, lastTime=0, nextDraw=0, toastTimer;
  let fpsSince=0, frameCount=0, exact=true, generation=-1, targetTime=0;
  const units={depth:'cm',angle:'°',amplitude:'mm',damping:'s⁻¹',lampX:'cm'};
  const sliders=['depth','angle','amplitude','damping'];
  const spanX=WIDTH*PITCH*100, spanY=HEIGHT*PITCH*100;
  let opticsDirty=false;
  const {render,palette}=createTankColors(window.Caustics,tank.mesh.cols,tank.mesh.rows);
  function paint(){
    render(tank,params,mode,grid,rgba);
    present(image);
  }
  function present(frame){
    ctx.putImageData(frame,0,0);
    $('clock-value').textContent=tank.time.toFixed(2);
  }
  function chart(id) {
    const c=$(id),rect=c.getBoundingClientRect(), dpr=Math.min(window.devicePixelRatio || 1,2);
    const w=Math.max(1,rect.width),h=Math.max(1,rect.height);
    if(c.width!==Math.round(w*dpr)||c.height!==Math.round(h*dpr)) {
      c.width=Math.round(w*dpr);c.height=Math.round(h*dpr);
    }
    const g=c.getContext('2d');g.setTransform(dpr,0,0,dpr,0,0);g.clearRect(0,0,w,h);
    return {g,w,h};
  }
  function guides({g,w,h}) {
    g.strokeStyle='#2a343c';g.lineWidth=.8;g.setLineDash([2,4]);
    for(const f of [.12,.52,.96]) {g.beginPath();g.moveTo(0,Math.round(h*f)+.5);g.lineTo(w,Math.round(h*f)+.5);g.stroke();}
    g.setLineDash([]);
  }
  function drawHistory(){
    const {g,w,h}=chart('history-chart');
    const left=43, right=w-5, top=8, bottom=h-7;
    const last=history.last, duration=last?.time ?? 0;
    const upper=Math.max(.05,Math.ceil(history.peak*1.05*20)/20);
    const x=t=>left+t/(duration || 1)*(right-left);
    const y=c=>bottom-c/upper*(bottom-top);
    g.font='11px system-ui';g.textAlign='right';g.textBaseline='middle';
    g.strokeStyle='#35434d';g.lineWidth=.8;g.setLineDash([2,4]);g.fillStyle='#a5b1ba';
    for(const value of [0,upper/2,upper]){
      const row=y(value);
      g.fillText(String(Number(value.toFixed(3))),left-7,row);
      g.beginPath();g.moveTo(left,row);g.lineTo(right,row);g.stroke();
    }
    g.setLineDash([]);
    const points=history.vertices(right-left);
    if(points.length){
      g.beginPath();g.moveTo(x(points[0].time),y(points[0].c));
      for(let i=1;i<points.length;i++)g.lineTo(x(points[i].time),y(points[i].c));
      g.lineWidth=1.8;g.strokeStyle='#71dfbf';g.stroke();
      g.lineTo(x(last.time),bottom);g.lineTo(x(points[0].time),bottom);g.closePath();
      const gradient=g.createLinearGradient(0,top,0,bottom);
      gradient.addColorStop(0,'#6ee2c338');gradient.addColorStop(1,'#6ee2c304');
      g.fillStyle=gradient;g.fill();g.fillStyle='#90f0d5';
      g.beginPath();g.arc(x(last.time),y(last.c),2.5,0,Math.PI*2);g.fill();
    }
    $('history-mid').textContent=duration>0?(duration/2).toFixed(2)+' s':'';
    $('history-end').textContent=duration.toFixed(2)+' s';
  }
  function drawAnalytics(){
    $('contrast').textContent=metrics.contrast.toFixed(3);
    drawHistory();
    const hist=chart('hist-chart');guides(hist);
    const hi=Math.max(...metrics.bins),bw=hist.w/metrics.bins.length;
    metrics.bins.forEach((n,i)=>{hist.g.fillStyle=i<9?'#659fbd':'#79b6d1';const height=(hist.h-3)*n/hi;hist.g.fillRect(i*bw+1,hist.h-height,Math.max(1,bw-2),height);});
    const a=centerAngle(params)*Math.PI/180, b=Math.asin(ETA*Math.sin(a));
    $('ref-angle').textContent=(b*180/Math.PI).toFixed(1)+'°';
    const ray=chart('ray-chart'),r=ray.g,cx=ray.w*.49,cy=ray.h*.47;
    r.fillStyle='#15292e';r.fillRect(0,cy,ray.w,ray.h-cy);
    function line(x1,y1,x2,y2,col,width=1,dash=[]) {r.beginPath();r.strokeStyle=col;r.lineWidth=width;r.setLineDash(dash);r.moveTo(x1,y1);r.lineTo(x2,y2);r.stroke();r.setLineDash([]);}
    line(0,cy,ray.w,cy,'#477078');line(cx,0,cx,ray.h,'#697c89',1,[3,4]);
    function arrow(x1,y1,x2,y2,color) {
      line(x1,y1,x2,y2,color,1.8);const p=Math.atan2(y2-y1,x2-x1),ax=x1+(x2-x1)*.70,ay=y1+(y2-y1)*.70;
      for(const s of [-1,1]) line(ax,ay,ax-5*Math.cos(p+s*.5),ay-5*Math.sin(p+s*.5),color,1.5);
    }
    const rise=Math.min(cy-3,(cx-3)/Math.tan(a)),fall=Math.min(ray.h-cy-3,(ray.w-cx-3)/Math.tan(b));
    arrow(cx-Math.tan(a)*rise,cy-rise,cx,cy,'#efc67d');
    arrow(cx,cy,cx+Math.tan(b)*fall,cy+fall,'#74e4cb');
    r.fillStyle='#94a7b2';r.font='12px sans-serif';r.fillText('공기',5,cy-5);r.fillText('물',5,cy+12);
  }
  function addSample(){
    history.add(tank.time,metrics.contrast);
  }
  function measure(){
    queue.reset(tank);opticsDirty=false;
    metrics=tank.trace(params);exact=true;
    addSample();paint();drawAnalytics();
  }
  function currentLight(){
    if(opticsDirty){measure();return;}
    if(!exact){
      metrics=tank.trace(params);
      exact=true;opticsDirty=false;
    }
  }
  function resetTiming(){
    accumulated=0;lastTime=0;nextDraw=0;fpsSince=0;frameCount=0;
    $('fps').textContent='—';
  }
  function setPlaying(next){
    playing=next;resetTiming();
    if(!playing && (!exact || opticsDirty))measure();
    else queue.reset(tank);
    const label=playing?'일시정지':'재생';$('play').title=label;$('play').setAttribute('aria-label',label);$('play').innerHTML=icon(playing?'pause':'play');
  }
  document.addEventListener('visibilitychange',()=>{resetTiming();queue.reset(tank);});
  function animate(now){
    requestAnimationFrame(animate);
    if(document.hidden)return;
    if(!playing){if(opticsDirty)measure();return;}
    const steps=Math.round(speed/(60*DT));
    const changed=opticsDirty;
    const elapsed=lastTime ? Math.min(.125,(now-lastTime)/1000)*speed : 0;
    lastTime=now;
    if(queue.available){
      if(generation!==queue.generation){
        generation=queue.generation;targetTime=tank.time;
      }else targetTime+=elapsed;
      queue.fill(params,mode,grid,steps,targetTime);
    }else accumulated+=elapsed;
    if(now+.8<nextDraw)return;
    if(queue.available){
      const frame=queue.take(targetTime+speed*.002);
      if(!frame)return;
      tank.copyFrom(frame);metrics=frame.metrics;exact=false;
      present(new ImageData(new Uint8ClampedArray(frame.buffer),WIDTH,HEIGHT));
      queue.release(frame);
    }else{
      if(accumulated<DT && !changed)return;
      while(accumulated>=DT){tank.step(params.damping);accumulated-=DT;}
      metrics=tank.trace(params);exact=true;paint();
    }
    nextDraw=nextDraw && now-nextDraw<interval ? nextDraw+interval : now+interval;
    if(!fpsSince)fpsSince=now;
    else{
      frameCount++;
      if(now-fpsSince>=1000){
        $('fps').textContent=String(Math.round(1000*frameCount/(now-fpsSince)));
        fpsSince=now;frameCount=0;
      }
    }
    const sampleDue=tank.time>=sampleAt-1e-8;
    if(sampleDue){addSample();sampleAt=Math.floor(tank.time*4+1e-6)/4+.25;}
    if(changed || sampleDue)drawAnalytics();
    opticsDirty=false;
  }
  const lamp=$('lamp'),lampPad=$('lamp-pad');
  function positionLamp(){
    lamp.style.left=(.5+params.lampX/spanX)*100+'%';
    lamp.style.top=(.5-params.lampY/spanY)*100+'%';
    $('lamp-x').value=params.lampX;$('lamp-y').value=params.lampY;
    lamp.setAttribute('aria-label','점광원 이동, X '+params.lampX+' cm, Y '+params.lampY+' cm');
  }
  function moveLamp(x,y){
    if(!Number.isFinite(x)||!Number.isFinite(y))return;
    const rounded=(value,span)=>Math.round(10*Math.min(span/2,Math.max(-span/2,value)))/10;
    const nextX=rounded(x,spanX),nextY=rounded(y,spanY);
    if(params.lampX===nextX && params.lampY===nextY){positionLamp();return;}
    params.lampX=nextX;params.lampY=nextY;positionLamp();opticsDirty=true;exact=false;
  }
  let drag=null;
  lampPad.addEventListener('pointerdown',event=>{
    if(event.button!==0 || drag)return;
    event.preventDefault();lamp.focus({preventScroll:true});
    const rect=lampPad.getBoundingClientRect();
    drag={id:event.pointerId,offsetX:(event.clientX-rect.left)/rect.width-(.5+params.lampX/spanX),
      offsetY:(event.clientY-rect.top)/rect.height-(.5-params.lampY/spanY)};
    if(!lamp.contains(event.target)){drag.offsetX=0;drag.offsetY=0;dragTo(event);}
    lamp.setPointerCapture(event.pointerId);lamp.classList.add('dragging');
  });
  function dragTo(event){
    if(!drag || event.pointerId!==drag.id)return;
    const box=lampPad.getBoundingClientRect();
    const x=(event.clientX-box.left)/box.width-drag.offsetX;
    const y=(event.clientY-box.top)/box.height-drag.offsetY;
    moveLamp((x-.5)*spanX,(.5-y)*spanY);
  }
  function finishDrag(event){
    if(!drag || event.pointerId!==drag.id)return;
    if(event.type==='pointerup')dragTo(event);
    drag=null;lamp.classList.remove('dragging');
    if(lamp.hasPointerCapture(event.pointerId))lamp.releasePointerCapture(event.pointerId);
  }
  document.addEventListener('pointermove',dragTo);
  for(const type of ['pointerup','pointercancel'])document.addEventListener(type,finishDrag);
  lamp.addEventListener('lostpointercapture',finishDrag);
  lamp.addEventListener('keydown',event=>{
    const directions={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,1],ArrowDown:[0,-1]};
    const delta=directions[event.key];if(!delta)return;
    event.preventDefault();const step=event.shiftKey?5:1;
    moveLamp(params.lampX+step*delta[0],params.lampY+step*delta[1]);
  });
  for(const id of ['lamp-x','lamp-y'])$(id).onchange=()=>{
    const x=$('lamp-x').valueAsNumber,y=$('lamp-y').valueAsNumber;
    if(Number.isFinite(x) && Number.isFinite(y))moveLamp(x,y);else positionLamp();
  };
  function setControls(){
    const point=params.source==='point';
    $('source-type').value=params.source;lamp.hidden=!point;$('lamp-coordinates').hidden=!point;
    $('angle-control').hidden=point;
    const xOption=$('variable').querySelector('[value=lampX]');xOption.hidden=!point;xOption.disabled=!point;
    if(!point && $('variable').value==='lampX')$('variable').value='angle';
    positionLamp();note();
    for(const key of sliders) {
      const el=$(key),val=params[key];el.value=val;el.style.setProperty('--fill',100*(val-Number(el.min))/(Number(el.max)-Number(el.min))+'%');
      const shown=key==='damping'?val.toFixed(2):String(val);
      $(key+'-value').innerHTML=shown+(key==='angle'?'':' ')+'<small>'+units[key]+'</small>';
      el.setAttribute('aria-valuetext',shown+' '+units[key]);
    }
  }
  function toast(msg){$('toast').textContent=msg;$('toast').classList.add('on');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').classList.remove('on'),2300);}
  sliders.forEach(key=>$(key).addEventListener('input',e=>{params[key]=Number(e.target.value);setControls();measure();}));
  $('source-type').onchange=e=>{params.source=e.target.value;setControls();measure();};
  document.querySelectorAll('[data-mode]').forEach(btn=>btn.onclick=()=>{
    mode=btn.dataset.mode;document.querySelectorAll('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',b===btn));
    const floor=mode==='floor';
    $('map-key').textContent={floor:'수광면 · 상대 밝기 I/I₀',surface:'수면 높이 · 검정 −15 mm / 흰색 +15 mm',jacobian:'출발 수면 · 밝을수록 |J| ≈ 0'}[mode];
    $('field').setAttribute('aria-label',btn.textContent+' 지도. 누른 곳의 수면에 파동을 추가합니다. Enter 키는 중앙 파동입니다.');
    $('grid').disabled=!floor;measure();
  });
  $('play').onclick=()=>setPlaying(!playing);$('speed').onchange=e=>{speed=Number(e.target.value);queue.reset(tank);};
  function startWave(initialWave){
    const pulse=initialWave==='pulse';
    tank.reset(initialWave);
    history.clear();
    sampleAt=.25;
    setPlaying(pulse || playing);
    measure();
    if(pulse && params.amplitude===0)toast('진폭을 높이면 펄스가 보입니다.');
    if(!pulse)toast('초기 간섭파로 돌아왔습니다.');
  }
  $('burst').onclick=()=>startWave('pulse');
  $('restart').onclick=()=>startWave('interference');
  $('restore').onclick=()=>{Object.assign(params,DEFAULTS);setControls();measure();toast('매개변수 기본값을 복원했습니다.');};
  $('grid').onclick=()=>{grid=!grid;$('grid').setAttribute('aria-pressed',grid);measure();};
  function disturb(x,y){
    tank.disturb(x,y);measure();const el=$('ripple');el.style.left=x*100+'%';el.style.top=y*100+'%';el.classList.remove('flash');void el.offsetWidth;el.classList.add('flash');
    if(params.amplitude===0)toast('진폭을 높이면 파동이 나타납니다.');
  }
  $('field').onclick=e=>{const rect=e.currentTarget.getBoundingClientRect();disturb((e.clientX-rect.left)/rect.width,(e.clientY-rect.top)/rect.height);};
  $('field').onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();disturb(.5,.5);}};
  function expanded(){return Boolean(document.fullscreenElement || $('viewer').classList.contains('expanded'));}
  function sizeView(){
    const label=expanded()?'뷰포트 축소':'뷰포트 확대';$('expand').innerHTML=icon(expanded()?'collapse':'expand');$('expand').title=label;$('expand').setAttribute('aria-label',label);
    const rect=ctx.canvas.getBoundingClientRect();
    $('scale-line').style.width=rect.width*.1/(WIDTH*PITCH)+'px';

  }
  $('expand').onclick=async()=>{
    if(document.fullscreenElement)await document.exitFullscreen();
    else if($('viewer').classList.contains('expanded'))$('viewer').classList.remove('expanded');
    else {try{await $('viewer').requestFullscreen();}catch{$('viewer').classList.add('expanded');}}
    sizeView();
  };
  document.addEventListener('fullscreenchange',sizeView);
  document.addEventListener('keydown',e=>{if(e.key==='Escape' && $('viewer').classList.contains('expanded')){$('viewer').classList.remove('expanded');sizeView();}});
  const dialog=$('guide-dialog');let guideTrigger;
  let checkText;
  document.querySelectorAll('[data-guide]').forEach(b=>b.onclick=()=>{
    if(!checkText){
      const test=new Tank();test.trace({...DEFAULTS,source:'parallel',amplitude:0.5,angle:0});
      let sum=0,count=0;
      for(let i=0;i<test.u.length;i++){
        const x=test.u[i],y=test.v[i],bx=Math.floor(x),by=Math.floor(y);
        if(bx<1 || bx>=WIDTH-2 || by<1 || by>=HEIGHT-2 || test.j[i]<=0)continue;
        const fx=x-bx,fy=y-by,at=by*WIDTH+bx,L=test.light;
        const measured=(L[at]*(1-fx)+L[at+1]*fx)*(1-fy)+(L[at+WIDTH]*(1-fx)+L[at+WIDTH+1]*fx)*fy;
        sum+=Math.abs(measured*test.j[i]-1);count++;
      }
      checkText='평행광과 초기 수면에서 진폭 0.5 mm, 수심 25 cm, 수직 입사를 적용한 약한 굴절 검산입니다. 관측 영역 내부의 격자점 '+count.toLocaleString('ko-KR')+'개에서 광선 밀도와 1/|J| 예측값 사이의 평균 상대 오차는 '+(100*sum/count).toFixed(2)+'%입니다.';
    }
    $('jacobian-check').textContent=checkText;guideTrigger=b;dialog.showModal();
  });
  $('close-guide').onclick=()=>dialog.close();dialog.onclick=e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}};
  dialog.addEventListener('close',()=>guideTrigger?.focus());
  const levels={depth:[10,25,50],angle:[0,15,30,45],amplitude:[2,5,10],damping:[0,.1,.3],lampX:[-40,0,40]};
  const names={depth:'수심',angle:'중앙 입사각',amplitude:'진폭',damping:'감쇠',lampX:'광원 X 위치'};
  function note(){
    const key=$('variable').value;
    if(key==='angle' && params.source==='point'){
      $('exp-note').textContent='광원의 방위각을 고정하고 중앙 입사각을 0°, 15°, 30°, 45°로 바꿉니다. 광원이 중앙에 있으면 +X 방향을 사용합니다.';return;
    }
    $('exp-note').textContent=key==='damping'?'동일 수면에서 각각 3초간 진행한 뒤 감쇠 계수 0, 0.10, 0.30 s⁻¹의 결과를 비교합니다.':names[key]+' '+levels[key].join(', ')+' '+units[key]+'에서 바닥 밝기를 비교합니다.';
  }
  $('variable').onchange=note;
  function newRecord(name,time,conditions,m,light=tank.light){
    const point=conditions.source==='point';
    if(tank.initialWave==='pulse')name+=' (초기 펄스)';
    const row={name,time,...conditions,source:point?'점광원':'평행광',angle:centerAngle(conditions),lampX:point?conditions.lampX:'',
      lampY:point?conditions.lampY:'',lampHeight:point?SOURCE_HEIGHT*100:'',contrast:m.contrast,mean:m.mean};records.push(row);
    const tr=document.createElement('tr');
    const preview=document.createElement('canvas');preview.width=264;preview.height=Math.round(264*HEIGHT/WIDTH);preview.className='snapshot';
    preview.setAttribute('aria-label','기록 시점의 바닥 상대 밝기');
    const thumb=preview.getContext('2d'), img=thumb.createImageData(preview.width,preview.height);
    for(let y=0,k=0;y<preview.height;y++)for(let x=0;x<preview.width;x++,k+=4){
      const x0=Math.round(x*WIDTH/preview.width),x1=Math.round((x+1)*WIDTH/preview.width);
      const y0=Math.round(y*HEIGHT/preview.height),y1=Math.round((y+1)*HEIGHT/preview.height);
      let sum=0;
      for(let row=y0;row<y1;row++)for(let col=x0;col<x1;col++)sum+=light[row*WIDTH+col];
      const mean=sum/((x1-x0)*(y1-y0)),q=Math.min(2047,Math.round(mean/8*2047))*3;
      img.data[k]=palette.floor[q];img.data[k+1]=palette.floor[q+1];img.data[k+2]=palette.floor[q+2];img.data[k+3]=255;
    }
    thumb.putImageData(img,0,0);const cell=document.createElement('td');cell.append(preview);tr.append(cell);
    [name,time.toFixed(2),row.source,point?row.lampX.toFixed(1):'—',point?row.lampY.toFixed(1):'—',row.depth,row.angle.toFixed(1),row.amplitude,row.damping.toFixed(2),row.contrast.toFixed(4),row.mean.toFixed(4)].forEach(v=>{const td=document.createElement('td');td.textContent=v;tr.append(td);});
    $('rows').append(tr);$('records').hidden=false;$('download').disabled=false;return row;
  }
  $('record').onclick=()=>{currentLight();newRecord('개별 기록',tank.time,params,metrics);toast('현재 조건과 밝기를 비교 실험 표에 기록했습니다.');};
  let batch=0;
  $('sweep').onclick=()=>{
    currentLight();
    const key=$('variable').value, values=levels[key], results=[];
    const experiment=key==='damping'?new Tank():tank;
    batch++;
    for(const value of values){
      const condition={...params,[key]:value};
      if(key==='angle' && params.source==='point'){
        const bearing=Math.atan2(params.lampY,params.lampX);
        const radius=SOURCE_HEIGHT*100*Math.tan(value*Math.PI/180);
        condition.lampX=radius*Math.cos(bearing);condition.lampY=radius*Math.sin(bearing);
      }
      if(key==='damping'){experiment.h.set(tank.h);experiment.prev.set(tank.prev);experiment.time=tank.time;for(let i=0;i<Math.round(3/DT);i++)experiment.step(value);}
      const observed=experiment.trace(condition);
      results.push(newRecord(names[key]+' 비교 '+batch,experiment.time,condition,observed,experiment.light));
    }
    measure();
    const cs=results.map(r=>r.contrast),max=Math.max(...cs),min=Math.min(...cs);
    const winner=results[cs.indexOf(max)];
    $('interpretation').textContent=max-min<.0001?'기록한 정밀도에서 모든 조건의 밝기 대비가 같습니다.':
      '이번 비교에서 '+names[key]+' '+Number(winner[key].toFixed(2))+' '+units[key]+'일 때 대비가 가장 큽니다 (C = '+max.toFixed(4)+').';
    toast(values.length+'개 조건의 비교를 완료했습니다.');
  };
  $('download').onclick=()=>{
    const cols=['name','time','source','lampX','lampY','lampHeight','depth','angle','amplitude','damping','contrast','mean'];
    const content=['실험,시간_s,광원,광원_X_cm,광원_Y_cm,광원_높이_cm,수심_cm,중앙_입사각_deg,진폭_mm,감쇠_s^-1,변동계수_C,평균_상대밝기',...records.map(r=>cols.map(k=>r[k]).join(','))].join('\r\n');
    const url=URL.createObjectURL(new Blob(['\uFEFF'+content],{type:'text/csv;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='caustica-experiments.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  };
  function navState(){const isComparison=location.hash==='#experiments';$('nav-lab').classList.toggle('active',!isComparison);$('nav-compare').classList.toggle('active',isComparison);}
  window.addEventListener('hashchange',navState);navState();
  // Retain the opening wave phase and measure its first two seconds, too.
  const warmupSteps=Math.round(2/DT), sampleSteps=Math.round(.25/DT);
  for(let k=0;k<warmupSteps;k++){
    if(k%sampleSteps===0){metrics=tank.trace(params);addSample();}
    tank.step(params.damping);
  }
  metrics=tank.trace(params);addSample();
  sampleAt=tank.time+.25;setControls();setPlaying(playing);paint();drawAnalytics();sizeView();
  const resize=new ResizeObserver(()=>{sizeView();drawAnalytics();});
  resize.observe($('stage'));resize.observe(document.querySelector('.analysis-grid'));
  function watchDpr(){
    matchMedia('(resolution: '+window.devicePixelRatio+'dppx)').addEventListener('change',()=>{
      sizeView();drawAnalytics();watchDpr();
    },{once:true});
  }
  watchDpr();
  requestAnimationFrame(animate);
})();
