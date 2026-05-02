const fs = require('fs');
const vm = require('vm');
['js/ui.js','js/engine.js'].forEach(f => {
  const code = fs.readFileSync(f, 'utf8');
  try { new vm.Script(code); console.log(f + ': OK'); }
  catch(e) { console.log(f + ': ERROR ' + e.message); }
});
