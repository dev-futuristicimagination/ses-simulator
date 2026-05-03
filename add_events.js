// Rewrite hire channel modal in ui.js
const fs = require('fs');
const file = 'js/ui.js';
let c = fs.readFileSync(file, 'utf8');

// Find the hire channel modal section
const startMark = 'const bp=s.brandPoints||0;';
const endMark = "return`<div class=\"modal-overlay\"><div class=\"modal modal-wide\"><h2>";

const startIdx = c.indexOf(startMark);
// Find the return line (end of cards building)
let searchFrom = startIdx;
let endIdx = c.indexOf(endMark, searchFrom);
if (endIdx < 0) { console.log('END NOT FOUND'); process.exit(1); }
// Find end of that return statement (next ;})
const lineEnd = c.indexOf('\n', endIdx);
const endFinal = lineEnd + 1;

console.log('Section:', startIdx, '->', endFinal);
console.log('End snippet:', JSON.stringify(c.substring(endFinal - 30, endFinal + 20)));

const newSection = `const bp=s.brandPoints||0;
const cred=s.credibility||0;

const cards=HIRING_CHANNELS.map(ch=>{
  let dispRate,rateNote='',locked=false;
  if(ch.id==='direct'){
    locked=cred<(ch.credRequirement||30);
    dispRate=locked?0:Math.round(Math.min(85,40+(cred-30)*0.9));
    rateNote=locked
      ?'<div style="font-size:10px;color:#e94560;margin-top:3px">\u26a0 \u4fe1\u7528\u529b'+cred+'pt / \u5fc5\u8981'+(ch.credRequirement||30)+'pt\u4ee5\u4e0a</div>'
      :'<div style="font-size:10px;color:#7c86a2;margin-top:3px">\u2b50 \u4fe1\u7528\u529b'+cred+'pt\u9023\u52d5\uff08\u9ad8\u3044\u307b\u3069\u4e0a\u4f4d\u5c64\uff09</div>';
  }else if(ch.id==='agent'){
    dispRate=Math.round(ch.successRate*100);
    rateNote='<div style="font-size:10px;color:#7c86a2;margin-top:3px">\ud83e\udd1d \u30b9\u30af\u30ea\u30fc\u30cb\u30f3\u30b0\u6e08\u307f\u30fb\u5b89\u5b9a\u898b\u8fbc\u3081</div>';
  }else{
    dispRate=Math.round(ch.successRate*100);
    rateNote='<div style="font-size:10px;color:#7c86a2;margin-top:3px">\ud83d\udccb \u5f53\u305f\u308a\u5916\u308c\u3042\u308a\u30fb\u6570\u306f\u591a\u3081</div>';
  }
  const rateColor=dispRate>=70?'#00d4aa':dispRate>=40?'#f7971e':'#e94560';
  const costStr=ch.cost===0?'\u2713 \u7121\u6599':'\xa5'+Math.round(ch.cost/10000)+'\u4e07';
  const [lo,hi]=ch.skillRange||[0,5];
  const lvLabels=['Lv0','Lv1','Lv2','Lv3','Lv4','Lv5'];
  const skillBar=lvLabels.map((l,i)=>'<span style="padding:1px 5px;border-radius:3px;font-size:9px;background:'+(i>=lo&&i<=hi?'rgba(0,212,170,0.25)':'rgba(255,255,255,0.05)')+';color:'+(i>=lo&&i<=hi?'#00d4aa':'#555')+'">'+l+'</span>').join('');

  return '<div class="ch-card'+(locked?' ch-locked':'')+'" data-ch="'+ch.id+'" style="'+(locked?'opacity:0.5;pointer-events:none':'')+'">'+
    '<div class="chc-name">'+ch.name+'</div>'+
    '<div class="chc-cost'+(ch.cost===0?' free':'')+'">'+costStr+'</div>'+
    '<div style="margin:6px 0">'+skillBar+'</div>'+
    '<div style="background:rgba(0,212,170,0.07);border:1px solid rgba(0,212,170,0.2);border-radius:6px;padding:6px 8px;font-size:11px;color:#a0aec0;margin:6px 0">'+(ch.candidateHint||'')+'</div>'+
    '<div class="chc-rate-wrap"><div class="chc-rate-label" style="color:'+rateColor+'">\u5019\u88dc\u8005\u767a\u898b\u7387 <b>'+(locked?'\u2014':dispRate+'%')+'</b></div>'+
    '<div class="chc-rate-bar-bg"><div class="chc-rate-bar-fill" style="width:'+dispRate+'%;background:linear-gradient(90deg,'+rateColor+'88,'+rateColor+')"></div></div>'+
    rateNote+'</div>'+
    '<div class="chc-desc">'+ch.desc+'</div>'+
    '</div>';
}).join('');

`;

c = c.substring(0, startIdx) + newSection + c.substring(startIdx + (endIdx - startIdx));
fs.writeFileSync(file, c, 'utf8');
console.log('OK - hire modal rewritten');

const vm = require('vm');
try { new vm.Script(fs.readFileSync(file,'utf8')); console.log('Syntax: OK'); }
catch(e) { console.log('Syntax ERR: ' + e.message); }
