const Illust = {
  hasTag(cas,...ts){return(cas.requiredTags||[]).some(t=>ts.includes(t));},
  getTheme(cas){
    if(this.hasTag(cas,'COBOL','JCL','PL/SQL','\u57fa\u5e79\u4fdd\u5b88'))return{bg:'#120e04',ac:'#c8960c',label:'\u30ec\u30ac\u30b7\u30fc'};
    if(this.hasTag(cas,'AWS','GCP','Docker','Terraform','Linux'))return{bg:'#04101e',ac:'#00a8e8',label:'\u30af\u30e9\u30a6\u30c9'};
    if(this.hasTag(cas,'React','Vue','TypeScript','Node.js'))return{bg:'#0c0a1a',ac:'#8b5cf6',label:'\u30d5\u30ed\u30f3\u30c8\u30a8\u30f3\u30c9'};
    if(this.hasTag(cas,'\u30c6\u30b9\u30c8','\u30c6\u30b9\u30c8\u8a2d\u8a08','\u30de\u30cb\u30e5\u30a2\u30eb\u4f5c\u696d'))return{bg:'#081408',ac:'#22c55e',label:'QA'};
    if(this.hasTag(cas,'PM','\u8981\u4ef6\u5b9a\u7fa9','\u30a6\u30a9\u30fc\u30bf\u30fc\u30d5\u30a9\u30fc\u30eb'))return{bg:'#180d00',ac:'#f97316',label:'PM'};
    if(this.hasTag(cas,'PHP','Laravel','SQL'))return{bg:'#0a0e18',ac:'#6366f1',label:'Web\u958b\u767a'};
    if(cas.type==='direct')return{bg:'#04081c',ac:'#3b82f6',label:'\u5927\u624b\u30a8\u30f3\u30c9'};
    if(cas.type==='primary')return{bg:'#080c1a',ac:'#6366f1',label:'\u4e00\u6b21\u8acb\u3051'};
    if(cas.type==='secondary')return{bg:'#0c0c14',ac:'#64748b',label:'\u4e8c\u6b21\u8acb\u3051'};
    return{bg:'#1a0808',ac:'#ef4444',label:'\u4e09\u6b21\u4ee5\u4e0b'};
  },
  scene(cas){
    if(this.hasTag(cas,'COBOL','JCL','\u57fa\u5e79\u4fdd\u5b88'))return this.mainframe();
    if(this.hasTag(cas,'AWS','GCP','Docker','Linux'))return this.cloud();
    if(this.hasTag(cas,'React','Vue','TypeScript'))return this.frontend();
    if(this.hasTag(cas,'\u30c6\u30b9\u30c8','\u30c6\u30b9\u30c8\u8a2d\u8a08'))return this.qa();
    if(this.hasTag(cas,'PM','\u8981\u4ef6\u5b9a\u7fa9'))return this.pm();
    if(cas.type==='direct')return this.tower();
    return this.office();
  },
  mainframe(){return`<svg viewBox="0 0 120 60" xmlns="http://www.w3.org/2000/svg">
<rect width="120" height="60" fill="#120e04"/>
<rect x="8" y="12" width="20" height="40" rx="2" fill="#1e1608"/><rect x="9" y="14" width="18" height="8" rx="1" fill="#c8960c" opacity=".7"/><circle cx="13" cy="26" r="2" fill="#ff4400"/><circle cx="13" cy="32" r="2" fill="#00ff88"/><rect x="13" y="36" width="10" height="1.5" rx=".5" fill="#555"/><rect x="13" y="39" width="8" height="1.5" rx=".5" fill="#555"/>
<rect x="34" y="8" width="20" height="44" rx="2" fill="#1e1608"/><rect x="35" y="10" width="18" height="8" rx="1" fill="#c8960c" opacity=".9"/><circle cx="39" cy="24" r="2" fill="#ffcc00"/><rect x="37" y="30" width="12" height="1.5" rx=".5" fill="#c8960c" opacity=".5"/><rect x="37" y="33" width="10" height="1.5" rx=".5" fill="#c8960c" opacity=".4"/>
<rect x="60" y="12" width="20" height="40" rx="2" fill="#1e1608"/><rect x="61" y="14" width="18" height="8" rx="1" fill="#c8960c" opacity=".6"/><circle cx="65" cy="26" r="2" fill="#00ff88"/>
<rect x="86" y="32" width="26" height="20" rx="1" fill="#1a1200"/><rect x="86" y="22" width="26" height="12" rx="2" fill="#1e1608"/><rect x="87" y="23" width="24" height="10" rx="1" fill="#050300"/><rect x="89" y="25" width="8" height="1.5" rx=".5" fill="#00ff88" opacity=".9"/><rect x="89" y="28" width="14" height="1.5" rx=".5" fill="#00ff88" opacity=".6"/><rect x="89" y="31" width="6" height="1.5" rx=".5" fill="#00ff88" opacity=".7"/>
<path d="M28 30 Q31 30 34 28" stroke="#444" stroke-width="1.5" fill="none"/><path d="M54 28 Q57 28 60 26" stroke="#444" stroke-width="1.5" fill="none"/>
</svg>`;},
  cloud(){return`<svg viewBox="0 0 120 60" xmlns="http://www.w3.org/2000/svg">
<rect width="120" height="60" fill="#04101e"/>
<rect x="4" y="10" width="22" height="42" rx="2" fill="#0a1e36"/><rect x="4" y="12" width="22" height="5" rx="1" fill="#0d2a50"/><rect x="6" y="13.5" width="5" height="2" rx=".5" fill="#00a8e8"/><circle cx="23" cy="14.5" r="1.5" fill="#00ff88" opacity=".8"/>
<rect x="4" y="19" width="22" height="5" rx="1" fill="#0d2a50"/><rect x="6" y="20.5" width="5" height="2" rx=".5" fill="#00ff88"/><circle cx="23" cy="21.5" r="1.5" fill="#ffcc00" opacity=".8"/>
<rect x="4" y="26" width="22" height="5" rx="1" fill="#0d2a50"/><rect x="6" y="27.5" width="5" height="2" rx=".5" fill="#00a8e8" opacity=".7"/>
<rect x="4" y="33" width="22" height="5" rx="1" fill="#0d2a50"/><rect x="6" y="34.5" width="5" height="2" rx=".5" fill="#ffcc00" opacity=".9"/>
<rect x="30" y="10" width="22" height="42" rx="2" fill="#0a1e36"/><rect x="30" y="12" width="22" height="5" rx="1" fill="#0d2a50"/><rect x="32" y="13.5" width="5" height="2" rx=".5" fill="#00ff88"/><rect x="30" y="19" width="22" height="5" rx="1" fill="#0d2a50"/><rect x="32" y="20.5" width="5" height="2" rx=".5" fill="#00a8e8"/>
<ellipse cx="88" cy="26" rx="22" ry="14" fill="#061830" stroke="#00a8e8" stroke-width="1.5"/>
<ellipse cx="72" cy="32" rx="12" ry="8" fill="#061830" stroke="#00a8e8" stroke-width="1"/>
<ellipse cx="104" cy="32" rx="12" ry="8" fill="#061830" stroke="#00a8e8" stroke-width="1"/>
<polygon points="89,18 84,28 89,28 87,36 94,24 89,24" fill="#00a8e8" opacity=".9"/>
<line x1="26" y1="30" x2="72" y2="28" stroke="#00a8e8" stroke-width=".8" stroke-dasharray="3,2" opacity=".4"/>
<line x1="52" y1="28" x2="72" y2="29" stroke="#00a8e8" stroke-width=".8" stroke-dasharray="3,2" opacity=".4"/>
</svg>`;},
  frontend(){return`<svg viewBox="0 0 120 60" xmlns="http://www.w3.org/2000/svg">
<rect width="120" height="60" fill="#0c0a1a"/>
<rect x="10" y="6" width="100" height="44" rx="3" fill="#16143a"/>
<rect x="12" y="8" width="96" height="40" rx="2" fill="#0f0e28"/>
<rect x="12" y="8" width="96" height="8" rx="2" fill="#1e1c42"/>
<circle cx="18" cy="12" r="2.5" fill="#e94560" opacity=".8"/><circle cx="25" cy="12" r="2.5" fill="#ffcc00" opacity=".8"/><circle cx="32" cy="12" r="2.5" fill="#22c55e" opacity=".8"/>
<rect x="38" y="10" width="50" height="4" rx="2" fill="#2a2848"/>
<rect x="12" y="16" width="32" height="32" fill="#0a0920"/>
<rect x="15" y="19" width="12" height="2" rx=".5" fill="#8b5cf6" opacity=".9"/>
<rect x="15" y="23" width="22" height="2" rx=".5" fill="#06b6d4" opacity=".8"/>
<rect x="17" y="27" width="16" height="2" rx=".5" fill="#f59e0b" opacity=".8"/>
<rect x="17" y="31" width="18" height="2" rx=".5" fill="#86efac" opacity=".7"/>
<rect x="15" y="35" width="12" height="2" rx=".5" fill="#8b5cf6" opacity=".9"/>
<rect x="15" y="39" width="20" height="2" rx=".5" fill="#06b6d4" opacity=".6"/>
<rect x="46" y="16" width="60" height="32" fill="#100f2a"/>
<rect x="49" y="20" width="52" height="8" rx="2" fill="#8b5cf6" opacity=".25"/>
<rect x="50" y="23" width="24" height="2" rx="1" fill="#c4b5fd" opacity=".8"/>
<rect x="49" y="30" width="24" height="6" rx="1" fill="#1e1c42"/>
<rect x="75" y="30" width="24" height="6" rx="1" fill="#1e1c42"/>
<rect x="49" y="38" width="52" height="4" rx="1" fill="#1e1c42"/>
<rect x="55" y="50" width="10" height="5" rx="1" fill="#16143a"/><rect x="44" y="54" width="32" height="3" rx="2" fill="#16143a"/>
</svg>`;},
  qa(){return`<svg viewBox="0 0 120 60" xmlns="http://www.w3.org/2000/svg">
<rect width="120" height="60" fill="#081408"/>
<rect x="8" y="6" width="46" height="50" rx="3" fill="#102010"/>
<rect x="20" y="3" width="22" height="8" rx="4" fill="#1a301a"/>
<rect x="12" y="18" width="7" height="7" rx="1" fill="#0a1a0a"/><rect x="12.5" y="18.5" width="6" height="6" rx=".5" fill="#22c55e" opacity=".8"/><path d="M14 21.5 L16 23 L18.5 19.5" stroke="#fff" stroke-width="1.2" fill="none"/>
<rect x="22" y="19" width="26" height="2" rx=".5" fill="#22c55e" opacity=".5"/>
<rect x="12" y="28" width="7" height="7" rx="1" fill="#0a1a0a"/><rect x="12.5" y="28.5" width="6" height="6" rx=".5" fill="#22c55e" opacity=".8"/><path d="M14 31.5 L16 33 L18.5 29.5" stroke="#fff" stroke-width="1.2" fill="none"/>
<rect x="22" y="29" width="20" height="2" rx=".5" fill="#22c55e" opacity=".5"/>
<rect x="12" y="38" width="7" height="7" rx="1" fill="#0a1a0a" stroke="#333" stroke-width=".5"/>
<rect x="22" y="39" width="24" height="2" rx=".5" fill="#333" opacity=".7"/>
<rect x="12" y="47" width="7" height="7" rx="1" fill="#0a1a0a" stroke="#333" stroke-width=".5"/>
<rect x="22" y="48" width="18" height="2" rx=".5" fill="#333" opacity=".5"/>
<rect x="62" y="10" width="50" height="44" rx="3" fill="#0d200d"/>
<rect x="62" y="10" width="50" height="10" rx="3" fill="#1a3a1a"/>
<circle cx="69" cy="15" r="2" fill="#e94560" opacity=".7"/><circle cx="76" cy="15" r="2" fill="#ffcc00" opacity=".7"/><circle cx="83" cy="15" r="2" fill="#22c55e" opacity=".7"/>
<rect x="66" y="24" width="14" height="2" rx=".5" fill="#22c55e" opacity=".9"/>
<rect x="66" y="28" width="38" height="2" rx=".5" fill="#22c55e" opacity=".7"/>
<rect x="66" y="32" width="30" height="2" rx=".5" fill="#22c55e" opacity=".6"/>
<rect x="66" y="36" width="8" height="2" rx=".5" fill="#e94560" opacity=".9"/>
<rect x="66" y="40" width="22" height="2" rx=".5" fill="#e94560" opacity=".7"/>
<rect x="66" y="44" width="34" height="2" rx=".5" fill="#22c55e" opacity=".6"/>
<rect x="72" y="48" width="28" height="6" rx="2" fill="#22c55e" opacity=".15" stroke="#22c55e" stroke-width=".5"/>
</svg>`;},
  pm(){return`<svg viewBox="0 0 120 60" xmlns="http://www.w3.org/2000/svg">
<rect width="120" height="60" fill="#180d00"/>
<rect x="4" y="4" width="72" height="50" rx="2" fill="#1f1200"/>
<rect x="5" y="5" width="70" height="48" rx="1" fill="#221500"/>
<rect x="8" y="10" width="62" height="1.5" fill="#333" opacity=".8"/>
<rect x="22" y="14" width="34" height="4" rx="1" fill="#f97316" opacity=".8"/>
<rect x="8" y="20" width="52" height="4" rx="1" fill="#f97316" opacity=".6"/>
<rect x="34" y="26" width="28" height="4" rx="1" fill="#f97316" opacity=".7"/>
<rect x="14" y="32" width="42" height="4" rx="1" fill="#f97316" opacity=".5"/>
<rect x="8" y="38" width="62" height="4" rx="1" fill="#f97316" opacity=".4"/>
<line x1="22" y1="8" x2="22" y2="50" stroke="#333" stroke-width=".5"/>
<line x1="36" y1="8" x2="36" y2="50" stroke="#333" stroke-width=".5"/>
<line x1="50" y1="8" x2="50" y2="50" stroke="#333" stroke-width=".5"/>
<line x1="64" y1="8" x2="64" y2="50" stroke="#333" stroke-width=".5"/>
<rect x="8" y="14" width="12" height="4" rx="1" fill="#2a1800"/>
<rect x="8" y="20" width="12" height="4" rx="1" fill="#2a1800"/>
<rect x="80" y="6" width="18" height="18" rx="1" fill="#f97316" opacity=".8"/>
<rect x="100" y="6" width="16" height="18" rx="1" fill="#fbbf24" opacity=".8"/>
<rect x="80" y="26" width="18" height="18" rx="1" fill="#f97316" opacity=".6"/>
<rect x="100" y="26" width="16" height="18" rx="1" fill="#ef4444" opacity=".7"/>
<rect x="82" y="11" width="14" height="2" rx=".5" fill="#7c3a00" opacity=".7"/>
<rect x="82" y="15" width="10" height="2" rx=".5" fill="#7c3a00" opacity=".5"/>
</svg>`;},
  tower(){return`<svg viewBox="0 0 120 60" xmlns="http://www.w3.org/2000/svg">
<rect width="120" height="60" fill="#04081c"/>
<circle cx="12" cy="8" r="1" fill="#fff" opacity=".5"/><circle cx="40" cy="5" r="1" fill="#fff" opacity=".4"/><circle cx="100" cy="9" r="1" fill="#fff" opacity=".6"/><circle cx="110" cy="4" r="1" fill="#fff" opacity=".3"/>
<rect x="30" y="6" width="60" height="48" rx="1" fill="#0c1430"/>
<rect x="32" y="10" width="8" height="6" rx=".5" fill="#3b82f6" opacity=".9"/>
<rect x="42" y="10" width="8" height="6" rx=".5" fill="#3b82f6" opacity=".7"/>
<rect x="52" y="10" width="8" height="6" rx=".5" fill="#3b82f6" opacity=".8"/>
<rect x="62" y="10" width="8" height="6" rx=".5" fill="#1a3060" opacity=".5"/>
<rect x="72" y="10" width="8" height="6" rx=".5" fill="#3b82f6" opacity=".9"/>
<rect x="32" y="18" width="8" height="6" rx=".5" fill="#3b82f6" opacity=".6"/>
<rect x="42" y="18" width="8" height="6" rx=".5" fill="#3b82f6" opacity=".9"/>
<rect x="52" y="18" width="8" height="6" rx=".5" fill="#1a3060" opacity=".4"/>
<rect x="62" y="18" width="8" height="6" rx=".5" fill="#3b82f6" opacity=".8"/>
<rect x="72" y="18" width="8" height="6" rx=".5" fill="#3b82f6" opacity=".7"/>
<rect x="32" y="26" width="8" height="6" rx=".5" fill="#1a3060" opacity=".4"/>
<rect x="42" y="26" width="8" height="6" rx=".5" fill="#3b82f6" opacity=".7"/>
<rect x="52" y="26" width="8" height="6" rx=".5" fill="#3b82f6" opacity=".8"/>
<rect x="62" y="26" width="8" height="6" rx=".5" fill="#3b82f6" opacity=".6"/>
<rect x="72" y="26" width="8" height="6" rx=".5" fill="#1a3060" opacity=".3"/>
<rect x="32" y="34" width="8" height="6" rx=".5" fill="#3b82f6" opacity=".5"/>
<rect x="42" y="34" width="8" height="6" rx=".5" fill="#1a3060" opacity=".4"/>
<rect x="52" y="34" width="8" height="6" rx=".5" fill="#3b82f6" opacity=".9"/>
<rect x="62" y="34" width="8" height="6" rx=".5" fill="#3b82f6" opacity=".6"/>
<rect x="72" y="34" width="8" height="6" rx=".5" fill="#3b82f6" opacity=".8"/>
<rect x="46" y="42" width="28" height="12" rx="0" fill="#0a1228"/>
<rect x="56" y="44" width="8" height="10" rx="1" fill="#1a3060"/>
<rect x="0" y="52" width="120" height="8" fill="#080c1e"/>
<rect x="0" y="50" width="28" height="10" rx="1" fill="#0a1228"/><rect x="2" y="42" width="26" height="10" rx="1" fill="#0c1430"/>
<rect x="94" y="44" width="26" height="16" rx="1" fill="#0c1430"/>
</svg>`;},
  office(){return`<svg viewBox="0 0 120 60" xmlns="http://www.w3.org/2000/svg">
<rect width="120" height="60" fill="#0c0c14"/>
<rect x="0" y="36" width="120" height="24" fill="#0a0a12"/>
<rect x="4" y="14" width="26" height="30" rx="1" fill="#14142a"/>
<rect x="5" y="15" width="24" height="12" rx=".5" fill="#1a1a36"/>
<rect x="7" y="17" width="6" height="8" rx=".5" fill="#0a0a20"/><rect x="15" y="17" width="6" height="8" rx=".5" fill="#0a0a20"/>
<rect x="6" y="29" width="22" height="1" fill="#1a1a36"/>
<rect x="6" y="32" width="22" height="8" rx=".5" fill="#0a0a1a"/>
<rect x="36" y="8" width="48" height="40" rx="1" fill="#14142a"/>
<rect x="37" y="9" width="46" height="24" rx=".5" fill="#1a1a36"/>
<rect x="38" y="10" width="12" height="10" rx=".5" fill="#0a0a20"/><rect x="52" y="10" width="12" height="10" rx=".5" fill="#0a0a20"/><rect x="66" y="10" width="12" height="10" rx=".5" fill="#0a0a20"/>
<rect x="38" y="21" width="12" height="10" rx=".5" fill="#0a0a20"/><rect x="52" y="21" width="12" height="10" rx=".5" fill="#6366f1" opacity=".3"/><rect x="66" y="21" width="12" height="10" rx=".5" fill="#0a0a20"/>
<rect x="37" y="34" width="46" height="12" rx=".5" fill="#0a0a1a"/>
<rect x="90" y="14" width="26" height="30" rx="1" fill="#14142a"/>
<rect x="91" y="15" width="24" height="12" rx=".5" fill="#1a1a36"/>
<rect x="93" y="17" width="6" height="8" rx=".5" fill="#6366f1" opacity=".3"/><rect x="101" y="17" width="6" height="8" rx=".5" fill="#0a0a20"/>
<rect x="91" y="29" width="22" height="8" rx=".5" fill="#0a0a1a"/>
</svg>`;}
};
