// append long_wait event to data.js
const fs = require('fs');
const file = 'js/data.js';
let c = fs.readFileSync(file, 'utf8');

// Build the new event as raw string (avoid template literal issues)
const lines = [
  ",",
  "  { id:'long_wait_burnout', type:'bad', title:'\u{1F4BC} \u8ee2\u8077\u6d3b\u52d5\u306e\u6c17\u914d\uff01',",
  "    getDesc:(e)=>`${e?e.name:'\u30a8\u30f3\u30b8\u30cb\u30a2'}\u304c\u6848\u4ef6\u306b\u30a2\u30b5\u30a4\u30f3\u3055\u308c\u306a\u3044\u65e5\u3005\u304c\u7d9a\u304d\u3001\u8ee2\u8077\u30a8\u30fc\u30b8\u30a7\u30f3\u30c8\u306b\u767b\u9332\u3057\u305f\u3088\u3046\u3067\u3059\u3002\u3053\u306e\u307e\u307e\u3060\u3068\u5931\u3063\u3066\u3057\u307e\u3044\u307e\u3059\u3002`,",
  "    choices:[",
  "      {text:'1on1\u9762\u8ac7\u3067\u6b63\u76f4\u306b\u8a71\u3059\uff08\u30a2\u30af\u30b7\u30e7\u30f3\u6d88\u8cbb\uff09', effect:'one_on_one_event', outcome:'\u9762\u8ac7\u3057\u305f\u3002\u4e0d\u6e80\u304c\u5c11\u3057\u6e1b\u3063\u305f\u304c\u3001\u6848\u4ef6\u304c\u306a\u3044\u3053\u3068\u306f\u5909\u308f\u3089\u306a\u3044\u3002'},",
  "      {text:'\u6607\u7d66\u3067\u5f15\u304d\u7559\u3081\u308b\uff08\u6708+3\u4e07\uff09', effect:'retention_raise_event', outcome:'\u5f15\u304d\u7559\u3081\u6210\u529f\uff01\u305f\u3060\u3057\u56fa\u5b9a\u8cbb\u304c\u4e0a\u304c\u308b\u3002\u6848\u4ef6\u3092\u78ba\u4fdd\u3057\u306a\u3044\u3068\u8d64\u5b57\u306b\u306a\u308b\u306e\u3067\u8981\u6ce8\u610f\u3002'},",
  "      {text:'\u81ea\u4e3b\u9000\u8077\u3092\u53d7\u3051\u5165\u308c\u308b', effect:'lose_engineer', outcome:'\u8f9e\u8868\u3092\u53d7\u3051\u53d6\u3063\u305f\u3002\u7a4d\u7d20\u306a\u96e2\u5e2d\u3060\u3063\u305f\u304c\u3001\u4e00\u4eba\u5c11\u306a\u304f\u306a\u308b\u3002'}",
  "    ],",
  "    condition:s=>s.engineers.some(e=>!e.isSelf&&e.status==='waiting'&&(e.monthsWaiting||0)>=3),",
  "    needsEngineer:true, needsActiveCase:false,",
  "    weight:0, dynamicWeight:(st)=>{",
  "      const cnt = st.engineers.filter(e=>!e.isSelf&&e.status==='waiting'&&(e.monthsWaiting||0)>=3).length;",
  "      return cnt > 0 ? cnt * 25 : 0;",
  "    }",
  "  }"
];
const newEvent = lines.join('\r\n');

const marker = 'needsActiveCase:false }\r\n];';
if (c.includes(marker)) {
  c = c.replace(marker, 'needsActiveCase:false }' + newEvent + '\r\n];');
  fs.writeFileSync(file, c, 'utf8');
  console.log('OK - long_wait event added');
  const vm = require('vm');
  try { new vm.Script(fs.readFileSync(file,'utf8')); console.log('Syntax: OK'); }
  catch(e) { console.log('Syntax ERR: ' + e.message); }
} else {
  console.log('MARKER NOT FOUND - last 80: ' + JSON.stringify(c.slice(-80)));
}
