(function() {
  function showErr(e) {
    var app = document.getElementById('app');
    if (app) app.innerHTML = '<div style="color:#ff4444;background:#111;padding:30px;font-family:monospace;white-space:pre-wrap;font-size:13px"><b>ERROR</b><br>' + (e.message||e) + '<br><br>' + (e.stack||'') + '</div>';
  }
  window.addEventListener('DOMContentLoaded', function() {
    try {
      if (typeof UI === 'undefined') throw new Error('UI is not defined - ui.js parse error');
      if (typeof SESGame === 'undefined') throw new Error('SESGame is not defined - engine.js parse error');
      if (typeof ROLES === 'undefined') throw new Error('ROLES is not defined - data.js parse error');
      var game = new SESGame();
      UI.render(game);
    } catch(e) {
      showErr(e);
    }
  });
})();