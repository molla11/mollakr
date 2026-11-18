// Each level groups four consecutive entries of the level below. Store both
// extrema so even a one-sample peak survives when many samples share a pixel.
class ContrastHistory {
  constructor() { this.clear(); }

  clear() {
    this.levels=[[]];
    this.first=null;
    this.last=null;
  }

  add(time,c) {
    const point={time,c};
    const samples=this.levels[0];
    const replace=this.last && Math.abs(time-this.last.time)<1e-7;
    let i=replace ? samples.length-1 : samples.length;
    samples[i]={low:point,high:point};
    if(i===0)this.first=point;
    this.last=point;
    let level=0;
    while(this.levels[level].length>1){
      const children=this.levels[level++];
      const parents=this.levels[level] ?? (this.levels[level]=[]);
      i=Math.floor(i/4);
      const start=i*4, end=Math.min(start+4,children.length);
      let {low,high}=children[start];
      for(let k=start+1;k<end;k++){
        if(children[k].low.c<low.c)low=children[k].low;
        if(children[k].high.c>high.c)high=children[k].high;
      }
      parents[i]={low,high};
    }
  }

  get peak() { return this.levels.at(-1)[0]?.high.c ?? 0; }

  // At normal density each vertex is a measured sample. For dense histories
  // draw the minimum and maximum of each group in their original time order.
  vertices(width) {
    if(!this.first)return [];
    const level=this.levels.find(entries=>entries.length<=Math.max(1,width));
    const points=[this.first];
    function append(point){if(point!==points.at(-1))points.push(point);}
    for(const {low,high} of level){
      if(low.time<=high.time){append(low);append(high);}
      else {append(high);append(low);}
    }
    append(this.last);
    return points;
  }
}
if(typeof module!=='undefined' && module.exports)module.exports=ContrastHistory;
