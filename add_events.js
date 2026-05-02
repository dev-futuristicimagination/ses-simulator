// Helper script to append SNS events to data.js
const fs = require('fs');
const file = 'js/data.js';
let c = fs.readFileSync(file, 'utf8');

const newEvents = `,\r\n  { id:'sns_bad_rep', type:'bad', title:'\ud83d\udca2 SNS\u306b\u60aa\u53e3\u3092\u66f8\u304b\u308c\u305f\uff01',\r\n    getDesc:()=>'\u5143\u5f93\u696d\u54e1\u3089\u3057\u304d\u4eba\u7269\u304c\u300c\u3042\u306e\u4f1a\u793e\u306f\u30d6\u30e9\u30c3\u30af\uff01\u301d\u3068\u6295\u7a3f\u3002\u4f1a\u793e\u540d\u5165\u308a\u3067\u66f8\u304b\u308c\u696d\u754c\u306b\u5e83\u307e\u308a\u307e\u3057\u305f\u3002',\r\n    choices:[\r\n      {text:'\u516c\u5f0f\u306b\u5bfe\u5fdc\u8868\u660e\u3092\u51fa\u3059', effect:'credibility_recover', outcome:'\u5bfe\u5fdc\u8868\u660e\u3067\u4fe1\u7528\u529b\u5c0f\u5e45\u56de\u5fa9\u3002\u4e2b\u512a\u3057\u306e\u8a55\u5224\u306b\u306f\u6642\u9593\u304c\u304b\u304b\u308b\u3002'},\r\n      {text:'\u30b9\u30eb\u30fc\u3059\u308b\uff08\u7121\u8996\uff09', effect:'credibility_loss_sns', outcome:'\u4f55\u3082\u3057\u306a\u304b\u3063\u305f\u304c\u3001\u30b9\u30ec\u304c\u62e1\u6563\u3002'}\r\n    ], weight:12, needsEngineer:false, needsActiveCase:false },\r\n  { id:'sns_viral', type:'good', title:'\ud83c\udf1f SNS\u304c\u30d0\u30ba\u3063\u305f\uff01',\r\n    getDesc:()=>'\u6295\u7a3f\u3057\u305f\u30c6\u30c3\u30af\u30d6\u30ed\u30b0\u304c\u62e1\u6563\u3002DM\u304c\u6bb5\u3005\u5c4a\u3044\u3066\u3044\u307e\u3059\u3002',\r\n    choices:[\r\n      {text:'\u5fdc\u52df\u30a8\u30f3\u30b8\u30cb\u30a2\u306b\u8fd4\u4fe1\u3059\u308b', effect:'sns_brand_boost', outcome:'\u30d6\u30e9\u30f3\u30c9\u529b\u5927\u5e45UP\uff01\u5c06\u6765\u7684\u306b\u60aa\u53e3\u3078\u306e\u66ff\u3048\u306b\u306a\u308b\u3002'},\r\n      {text:'\u6a19\u6e96\u63a1\u7528\u30d7\u30ed\u30bb\u30b9\u3078\u8fba\u308a\u8fbc\u3080', effect:'sns_brand_big_boost', outcome:'\u30d6\u30e9\u30f3\u30c9\u529b\u5927\u5e45UP\u304b\u3064\u4e00\u6642\u7684\u306b\u4fe1\u7528\u529b\u3082\u4e0a\u6607\u3002'}\r\n    ], weight:10, needsEngineer:false, needsActiveCase:false }`;

// Find the marker: "needsActiveCase:false }" + CRLF + "];"
const marker = 'needsActiveCase:false }\r\n];';
if (c.includes(marker)) {
  c = c.replace(marker, 'needsActiveCase:false }' + newEvents + '\r\n];');
  fs.writeFileSync(file, c, 'utf8');
  console.log('OK - SNS events appended');
  // Validate
  const vm = require('vm');
  try { new vm.Script(fs.readFileSync(file,'utf8')); console.log('Syntax: OK'); }
  catch(e) { console.log('Syntax ERR: ' + e.message); }
} else {
  console.log('MARKER NOT FOUND - last 80 chars: ' + JSON.stringify(c.slice(-80)));
}
