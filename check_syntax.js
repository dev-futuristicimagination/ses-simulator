const fs = require('fs'); const vm = require('vm');
['js/engine.js','js/data.js','js/ui.js'].forEach(f=>{
  const code = fs.readFileSync(f,'utf8');
  try { new vm.Script(code); console.log(f + ': OK'); }
  catch(e) { console.log(f + ' ERROR: ' + e.message + ' line ' + e.lineNumber); }
});
