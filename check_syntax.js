const fs = require('fs'); const vm = require('vm');
const code = fs.readFileSync('js/ui.js', 'utf8');
try { new vm.Script(code); console.log('OK'); }
catch(e) { console.log('ERROR: ' + e.message); }
