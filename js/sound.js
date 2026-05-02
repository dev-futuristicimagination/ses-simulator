const Sound = {
  ctx: null, enabled: true,
  init() { if(this.ctx)return; try{this.ctx=new(window.AudioContext||window.webkitAudioContext)();}catch(e){} },
  async play(type) {
    if(!this.enabled)return; this.init(); if(!this.ctx)return;
    if(this.ctx.state==='suspended') await this.ctx.resume();
    try{ this[type]&&this[type](); }catch(e){}
  },
  _tone(freq,dur,type='sine',vol=0.15,atk=0.01){
    const o=this.ctx.createOscillator(),g=this.ctx.createGain();
    o.connect(g);g.connect(this.ctx.destination);o.type=type;
    o.frequency.setValueAtTime(freq,this.ctx.currentTime);
    g.gain.setValueAtTime(0,this.ctx.currentTime);
    g.gain.linearRampToValueAtTime(vol,this.ctx.currentTime+atk);
    g.gain.exponentialRampToValueAtTime(0.001,this.ctx.currentTime+dur);
    o.start(this.ctx.currentTime);o.stop(this.ctx.currentTime+dur+0.05);
  },
  _sweep(f1,f2,dur,type='sine',vol=0.12){
    const o=this.ctx.createOscillator(),g=this.ctx.createGain();
    o.connect(g);g.connect(this.ctx.destination);o.type=type;
    o.frequency.setValueAtTime(f1,this.ctx.currentTime);
    o.frequency.linearRampToValueAtTime(f2,this.ctx.currentTime+dur);
    g.gain.setValueAtTime(vol,this.ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001,this.ctx.currentTime+dur);
    o.start(this.ctx.currentTime);o.stop(this.ctx.currentTime+dur+0.05);
  },
  click()  { this._tone(800,0.06,'square',0.08,0.005); },
  select() { this._sweep(500,800,0.10,'sine',0.12); this._tone(900,0.08,'sine',0.07,0.005); },
  success(){ this._tone(880,0.1,'sine',0.12,0.01);setTimeout(()=>this._tone(1320,0.15,'sine',0.1,0.01),100); },
  alert()  { this._sweep(400,180,0.3,'sawtooth',0.1); },
  cash()   { [0,60,120].forEach((d,i)=>setTimeout(()=>this._tone(1200-i*100,0.08,'square',0.1),d)); },
  good()   { [523,659,784].forEach((f,i)=>setTimeout(()=>this._tone(f,0.15,'sine',0.1),i*80)); },
  next()   { this._sweep(450,650,0.12,'sine',0.1); },
  defeat() { [523,415,330,262].forEach((f,i)=>setTimeout(()=>this._tone(f,0.25,'sine',0.12),i*150)); },
  victory(){ [523,659,784,1047].forEach((f,i)=>setTimeout(()=>this._tone(f,0.3,'sine',0.15),i*100)); setTimeout(()=>this._tone(1047,0.6,'sine',0.18),500); },
  warn()   { this._sweep(440,330,0.2,'triangle',0.1); },
  hover()  { this._tone(600,0.04,'sine',0.04,0.002); },
  roll()    { [0,40,80,120,160].forEach(d=>setTimeout(()=>this._tone(300+Math.random()*200,0.05,'square',0.06),d)); },
  event_win(){
    [523,659,784,1047].forEach((f,i)=>setTimeout(()=>this._tone(f,0.18,'sine',0.13),i*70));
    setTimeout(()=>{this._tone(1047,0.1,'sine',0.16);this._tone(1319,0.25,'sine',0.12,0.01);},300);
  },
  event_lose(){
    [494,440,392,330].forEach((f,i)=>setTimeout(()=>this._tone(f,0.22,'triangle',0.11),i*100));
    setTimeout(()=>this._sweep(330,180,0.4,'sawtooth',0.1),400);
  },
  rollEnd(success){ if(success){this._tone(1047,0.1,'sine',0.15,0.01);setTimeout(()=>this._tone(1319,0.2,'sine',0.12,0.01),120);}
               else{this._sweep(400,200,0.3,'sawtooth',0.1);} }
};