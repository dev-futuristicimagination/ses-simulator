// portrait.js - SVGキャラポートレート自動生成
const Portrait = {
  seed(name) {
    let h = 0;
    for (let i = 0; i < name.length; i++) h = (Math.imul(31, h) + name.charCodeAt(i)) | 0;
    return Math.abs(h);
  },
  typeConfig: {
    'inexperienced': { hair:'short',  acc:'none',       cloth:'#4a90d9' },
    'tester':        { hair:'short',  acc:'none',       cloth:'#7b5ea7' },
    'junior':        { hair:'medium', acc:'none',       cloth:'#2d8a4e' },
    'junior-hw':     { hair:'short',  acc:'none',       cloth:'#c0392b' },
    'mid':           { hair:'medium', acc:'none',       cloth:'#1a6b8a' },
    'mid-amb':       { hair:'long',   acc:'none',       cloth:'#e67e22' },
    'senior':        { hair:'short',  acc:'glasses',    cloth:'#2c3e50' },
    'cobol':         { hair:'bald',   acc:'glasses',    cloth:'#5d4037' },
    'cloud':         { hair:'medium', acc:'headphones', cloth:'#00838f' },
    'pm':            { hair:'short',  acc:'glasses',    cloth:'#880e4f' },
  },
  hColors: ['#2c1810','#1a0a00','#8B6914','#d4af37','#b5651d','#6b2737','#1b2a5e','#333333'],
  sColors: ['#fad4b4','#f0c090','#d4956a','#c68642','#a0522d'],
  eColors: ['#2c5f8a','#3d5a24','#8b4513','#4a4a4a','#6b2d6b'],
  skColors:['#546e7a','#2e7d32','#1565c0','#6a1b9a','#e65100'],
  generate(eng) {
    const s  = this.seed(eng.name || 'x');
    const cf = this.typeConfig[eng.type] || { hair:'short', acc:'none', cloth:'#37474f' };
    const sk = this.sColors[s % 5];
    const hr = this.hColors[(s>>3) % 8];
    const ey = this.eColors[(s>>5) % 5];
    const d  = eng.dissatisfaction || 0;
    const fe = s % 3 === 0;
    const ck = this.skColors[Math.min((eng.skill||1)-1, 4)];
    // Hair
    let hair = '';
    if (cf.hair === 'bald') {
      hair = '<ellipse cx="40" cy="22" rx="22" ry="5" fill="' + hr + '" opacity="0.3"/>';
    } else if (cf.hair === 'long') {
      hair = '<ellipse cx="40" cy="22" rx="22" ry="16" fill="' + hr + '"/><rect x="18" y="28" width="7" height="28" rx="3" fill="' + hr + '"/><rect x="55" y="28" width="7" height="28" rx="3" fill="' + hr + '"/>';
    } else if (cf.hair === 'medium') {
      hair = '<ellipse cx="40" cy="22" rx="22" ry="14" fill="' + hr + '"/><rect x="18" y="28" width="7" height="16" rx="3" fill="' + hr + '"/><rect x="55" y="28" width="7" height="16" rx="3" fill="' + hr + '"/>';
    } else {
      hair = '<ellipse cx="40" cy="22" rx="22" ry="13" fill="' + hr + '"/>';
    }
    // Eyes
    const ey2 = d >= 70
      ? '<line x1="28" y1="38" x2="36" y2="44" stroke="' + ey + '" stroke-width="2"/><line x1="36" y1="38" x2="28" y2="44" stroke="' + ey + '" stroke-width="2"/><line x1="44" y1="38" x2="52" y2="44" stroke="' + ey + '" stroke-width="2"/><line x1="52" y1="38" x2="44" y2="44" stroke="' + ey + '" stroke-width="2"/>'
      : '<ellipse cx="32" cy="41" rx="4" ry="' + (d>=40?3:4) + '" fill="' + ey + '"/><circle cx="33" cy="40" r="1.5" fill="white" opacity="0.7"/><ellipse cx="48" cy="41" rx="4" ry="' + (d>=40?3:4) + '" fill="' + ey + '"/><circle cx="49" cy="40" r="1.5" fill="white" opacity="0.7"/>';
    // Mouth
    const mouth = d >= 70
      ? '<path d="M30 58 Q40 53 50 58" stroke="#b00" stroke-width="2" fill="none"/>'
      : d >= 40
        ? '<line x1="30" y1="56" x2="50" y2="56" stroke="#888" stroke-width="2"/>'
        : '<path d="M30 54 Q40 61 50 54" stroke="#e8a87c" stroke-width="2" fill="none"/>';
    // Eyebrows
    const bY = d >= 50 ? 35 : 37;
    const brows = '<line x1="26" y1="' + (d>=50?37:bY) + '" x2="37" y2="' + (d>=50?bY:bY-1) + '" stroke="' + hr + '" stroke-width="2" stroke-linecap="round"/><line x1="43" y1="' + (d>=50?bY:bY-1) + '" x2="54" y2="' + (d>=50?37:bY) + '" stroke="' + hr + '" stroke-width="2" stroke-linecap="round"/>';
    // Accessory
    let acc = '';
    if (cf.acc === 'glasses') {
      acc = '<rect x="24" y="37" width="13" height="9" rx="3" fill="none" stroke="#aaa" stroke-width="1.5" opacity="0.8"/><rect x="43" y="37" width="13" height="9" rx="3" fill="none" stroke="#aaa" stroke-width="1.5" opacity="0.8"/><line x1="37" y1="42" x2="43" y2="42" stroke="#aaa" stroke-width="1.5"/>';
    } else if (cf.acc === 'headphones') {
      acc = '<path d="M18 42 Q20 24 40 24 Q60 24 62 42" stroke="#222" stroke-width="3" fill="none"/><rect x="14" y="39" width="8" height="12" rx="4" fill="#00838f"/><rect x="58" y="39" width="8" height="12" rx="4" fill="#00838f"/>';
    }
    const sweat = d >= 60 ? '<text x="60" y="26" font-size="11">&#x1F4A6;</text>' : '';
    const crown = eng.isSelf ? '<text x="58" y="18" font-size="13">&#x1F451;</text>' : '';
    const glow = d >= 80 ? '<rect x="0" y="0" width="80" height="80" rx="10" fill="red" opacity="0.07"/>' : '';
    return '<svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">'
      + '<rect width="80" height="80" rx="10" fill="' + ck + '" opacity="0.25"/>'
      + '<ellipse cx="40" cy="85" rx="28" ry="20" fill="' + ck + '"/>'
      + '<rect x="33" y="60" width="14" height="12" rx="5" fill="' + sk + '"/>'
      + '<ellipse cx="40" cy="42" rx="22" ry="' + (fe?24:22) + '" fill="' + sk + '"/>'
      + hair + ey2 + brows + mouth + acc + sweat + crown + glow
      + '</svg>';
  }
};
