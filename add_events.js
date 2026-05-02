const fs = require('fs');
const file = 'js/data.js';
let c = fs.readFileSync(file, 'utf8');

// Build event strings carefully without template literal nesting issues
const ev1 = [
  "  { id:'direct_hire_offer', type:'bad', title:'\ud83c\udfe2 \u30af\u30e9\u30a4\u30a2\u30f3\u30c8\u304b\u3089\u5f15\u304d\u629c\u304d\u30aa\u30d5\u30a1\u30fc\uff01',",
  "    getDesc:(e,cas)=>(e?e.name:'\u30a8\u30f3\u30b8\u30cb\u30a2')+'\u304c'+(cas?cas.client:'\u30af\u30e9\u30a4\u30a2\u30f3\u30c8')+'\u304b\u3089\u300c\u3046\u3061\u306b\u76f4\u63a5\u6765\u307e\u305b\u3093\u304b\uff1f\u300d\u3068\u8a98\u308f\u308c\u3066\u3044\u307e\u3059\u3002\u9577\u671f\u53c2\u753b\u3067\u73fe\u5834\u306e\u8a55\u4fa1\u304c\u9ad8\u3044\u8a3c\u62e0\u3002',",
  "    choices:[",
  "      {text:'\u6708+5\u4e07\u30dc\u30fc\u30ca\u30b9\u3067\u5f15\u304d\u6b62\u3081\u308b', effect:'pay_50000', outcome:'\u5f15\u304d\u6b62\u3081\u6210\u529f\u3002\u305f\u3060\u3057\u8aa4\u9b54\u5316\u7b56\u3002\u77ed\u671f\u7684\u5b89\u5fc3\u3002'},",
  "      {text:'\u65ad\u3063\u3066\u5951\u7d04\u7d99\u7d9a\u3092\u4ea4\u6e09\u3059\u308b', effect:'lose_client_trust', outcome:'\u30a8\u30f3\u30b8\u30cb\u30a2\u306f\u6b8b\u3063\u305f\u304c\u30af\u30e9\u30a4\u30a2\u30f3\u30c8\u306e\u4fe1\u983c\u5ea6\u4f4e\u4e0b\u3002'},",
  "      {text:'\u672c\u4eba\u306e\u610f\u5fd7\u3092\u5c0a\u91cd\u3059\u308b', effect:'lose_engineer_and_case', outcome:'\u8ee2\u7c4d\u3002\u6848\u4ef6\u3082\u7d42\u4e86\u3002\u8a98\u5869\u306a\u5bfe\u5fdc\u3067\u696d\u754c\u8a55\u5224\u306f\u4e0a\u304c\u3063\u305f\u3002'}",
  "    ],",
  "    condition:s=>s.activeCases.some(c=>(c.dur-c.monthsLeft)>=6&&(c.clientTrust||3)>=4),",
  "    needsEngineer:true, needsActiveCase:true,",
  "    weight:0, dynamicWeight:(st)=>{const cnt=st.activeCases.filter(c=>(c.dur-c.monthsLeft)>=6&&(c.clientTrust||3)>=4).length;return cnt*10;}",
  "  }"
].join('\r\n');

const ev2 = [
  "  { id:'project_exit_request', type:'bad', title:'\ud83c\udfc3 \u73fe\u5834\u304b\u3089\u51fa\u3057\u3066\u307b\u3057\u3044\u2026',",
  "    getDesc:(e,cas)=>(e?e.name:'\u30a8\u30f3\u30b8\u30cb\u30a2')+'\u304c\u300c'+(cas?cas.client:'\u73fe\u5834')+'\u304c\u304d\u3064\u304f\u3066\u9650\u754c\u3002\u4ed6\u306e\u6848\u4ef6\u306b\u79fb\u3057\u3066\u300d\u3068\u76f8\u8ac7\u3002',",
  "    choices:[",
  "      {text:'\u5f85\u6a5f\u306b\u623b\u3059\uff08\u58f2\u4e0a\u6e1b\u308b\u304c\u672c\u4eba\u56de\u5fa9\uff09', effect:'move_to_waiting', outcome:'\u30a2\u30b5\u30a4\u30f3\u89e3\u9664\u3002\u30b9\u30c8\u30ec\u30b9\u5927\u5e45\u56de\u5fa9\u3002\u6848\u4ef6\u306f\u7d42\u4e86\u3002'},",
  "      {text:'\u6708+1\u4e07\u624b\u5f53\u3066\u3067\u5f15\u304d\u6b62\u3081\u308b', effect:'pay_10000_monthly', outcome:'\u624b\u5f53\u3066\u3067\u3057\u3070\u3089\u304f\u7dad\u6301\u3002\u6839\u672c\u89e3\u6c7a\u306b\u306f\u306a\u3089\u306a\u3044\u3002'},",
  "      {text:'\u4eca\u306f\u96e3\u3057\u3044\u3068\u65ad\u308b', effect:'stress_increase_big', outcome:'\u4e0d\u6e80\u5927\u5e45\u5897\u52a0\u3002\u9000\u8077\u30ea\u30b9\u30af\u4e0a\u6607\u3002'}",
  "    ],",
  "    condition:s=>s.activeCases.some(c=>{const elapsed=c.dur-c.monthsLeft;const eng=s.engineers.find(e=>e.id===c.assignedEngineerId);return elapsed>=4&&eng&&(eng.stress||0)>=60;}),",
  "    needsEngineer:true, needsActiveCase:true,",
  "    weight:0, dynamicWeight:(st)=>{const cnt=st.activeCases.filter(c=>{const e2=st.engineers.find(e=>e.id===c.assignedEngineerId);return(c.dur-c.monthsLeft)>=4&&e2&&(e2.stress||0)>=60;}).length;return cnt*20;}",
  "  }"
].join('\r\n');

const ev3 = [
  "  { id:'career_up_request', type:'bad', title:'\ud83d\ude80 \u3082\u3063\u3068\u4e0a\u6d41\u6848\u4ef6\u306b\u884c\u304d\u305f\u3044\uff01',",
  "    getDesc:(e)=>(e?e.name:'\u30a8\u30f3\u30b8\u30cb\u30a2')+'\u304c\u300c\u30b9\u30ad\u30eb\u30a2\u30c3\u30d7\u306b\u306a\u3089\u306a\u3044\u73fe\u5834\u306f\u9650\u754c\u3002\u4e0a\u6d41\u306b\u79fb\u308a\u305f\u3044\u300d\u3068\u76f8\u8ac7\u3002',",
  "    choices:[",
  "      {text:'\u3044\u3044\u6848\u4ef6\u3092\u63a2\u3059\u3068\u7d04\u675f\u3059\u308b', effect:'career_promise', outcome:'\u7d04\u675f\u3057\u305f\u3002\u65e9\u3081\u306b\u4e0a\u6d41\u6848\u4ef6\u3092\u63a2\u305d\u3046\u3002'},",
  "      {text:'1on1\u3067\u73fe\u72b6\u306e\u4fa1\u5024\u3092\u8aac\u660e\u3059\u308b', effect:'one_on_one_event', outcome:'\u5c11\u3057\u7d0d\u5f97\u3002\u4e0d\u6e80\u306f\u6b8b\u308b\u3002'},",
  "      {text:'\u81ea\u4e3b\u9000\u8077\u3092\u53d7\u3051\u5165\u308c\u308b', effect:'lose_engineer', outcome:'\u5186\u6e80\u9000\u8077\u3002\u6848\u4ef6\u306f\u7d99\u7d9a\u3067\u304d\u308b\u304c\u4eba\u624b\u304c\u6e1b\u308b\u3002'}",
  "    ],",
  "    condition:s=>s.activeCases.some(c=>{const elapsed=c.dur-c.monthsLeft;const eng=s.engineers.find(e=>e.id===c.assignedEngineerId);return elapsed>=6&&eng&&(eng.personality==='ambitious'||eng.personality==='passionate');}),",
  "    needsEngineer:true, needsActiveCase:true,",
  "    weight:0, dynamicWeight:(st)=>{const cnt=st.activeCases.filter(c=>{const e2=st.engineers.find(e=>e.id===c.assignedEngineerId);return(c.dur-c.monthsLeft)>=6&&e2&&(e2.personality==='ambitious'||e2.personality==='passionate');}).length;return cnt*12;}",
  "  }"
].join('\r\n');

// The current last event ends with: "    }\r\n  }\r\n];"
const marker = '    }\r\n  }\r\n];';
if (c.includes(marker)) {
  const newEnd = '    }\r\n  },\r\n' + ev1 + ',\r\n' + ev2 + ',\r\n' + ev3 + '\r\n];';
  c = c.replace(marker, newEnd);
  fs.writeFileSync(file, c, 'utf8');
  console.log('OK - 3 events added');
  const vm = require('vm');
  try { new vm.Script(fs.readFileSync(file,'utf8')); console.log('Syntax: OK'); }
  catch(e) { console.log('Syntax ERR: ' + e.message); }
} else {
  console.log('Marker not found. Last 60:', JSON.stringify(c.slice(-60)));
}
