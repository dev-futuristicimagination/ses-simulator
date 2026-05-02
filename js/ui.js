// SES-SIM v1.4 build:202605030632
const UI={modal:null,selCase:null,selEng:null,selCand:null,
render(game){const s=game.state,app=document.getElementById("app");app.innerHTML="";
try{switch(s.phase){
case"title":app.innerHTML=this.title();this.bTitle(game);break;
case"setup-role":app.innerHTML=this.sRole(game);this.bRole(game);break;
case"setup-fund":app.innerHTML=this.sFund(game);this.bFund(game);break;
case"setup-loc":app.innerHTML=this.sLoc(game);this.bLoc(game);break;
case"setup-name":app.innerHTML=this.sName(game);this.bName(game);break;
case"game":app.innerHTML=this.game(game);this.bGame(game);break;
case"month-end":app.innerHTML=this.mEnd(game);this.bMEnd(game);break;
case"victory":app.innerHTML=this.end(game,true);this.bEnd(game);break;
case"bankrupt":app.innerHTML=this.end(game,false);this.bEnd(game);break;
}}catch(e){app.innerHTML="<div style=\"color:red;padding:20px\">ERROR: "+e.message+"<br>"+e.stack+"</div>";}},
m(n){return["1","2","3","4","5","6","7","8","9","10","11","12"][n-1]+"\u6708";},
title(){return`<div class="screen title-screen">
<div class="title-logo">\u25b6 SES SIMULATOR</div>
<h1 class="title-main">SES<span>\u793e\u9577</span><br>\u30b7\u30df\u30e5\u30ec\u30fc\u30bf\u30fc</h1>
<p class="title-sub">SES\u4f1a\u793e\u3092\u7d4c\u55b6\u3057\u3066\u5e74\u5546\uff11\u5104\u3092\u76ee\u6307\u305b</p>
<div class="title-cards">
<div class="title-feature-card"><div class="tfc-icon">\ud83d\udccb</div><div class="tfc-label">\u6708\u6b21\u30bf\u30fc\u30f3\u5236</div><div class="tfc-desc">\u30ea\u30a2\u30eb\u306a\u7d4c\u55b6\u5224\u65ad\u3092\u6bce\u6708\u7e70\u308a\u8fd4\u3059</div></div>
<div class="title-feature-card"><div class="tfc-icon">\u26a1</div><div class="tfc-label">13+\u306e\u30a4\u30d9\u30f3\u30c8</div><div class="tfc-desc">\u30d0\u30c3\u30af\u30ec\u30fb\u9000\u8077\u4ee3\u884c\u30fb\u5f15\u304d\u629c\u304d\u2026SES\u3042\u308b\u3042\u308b</div></div>
<div class="title-feature-card"><div class="tfc-icon">\ud83c\udfaf</div><div class="tfc-label">\u5e74\u5546\uff11\u5104</div><div class="tfc-desc">\u30de\u30fc\u30b8\u30f3\u69cb\u9020\u3092\u7406\u89e3\u3057\u3066\u9054\u6210\u305b\u3088</div></div>
</div>
<button id="btn-start" class="btn btn-primary btn-xl">\u25b6 \u30b2\u30fc\u30e0\u30b9\u30bf\u30fc\u30c8</button>
<div id="save-load-area" style="margin-top:12px;display:flex;gap:10px;justify-content:center"></div>
<p style="font-size:.72rem;color:var(--muted);margin-top:10px">\u5c31\u6d3b\u30fb\u8ee2\u8077\u30fbSES\u696d\u754c\u3092\u77e5\u308b\u3059\u3079\u3066\u306e\u4eba\u3078</p>
</div>`},
bTitle(game){
  document.getElementById('btn-start').onclick=()=>{Sound.play('click');game.state.phase='setup-role';this.render(game);};
  // セーブデータがあれば「続きから」ボタンを表示
  const area=document.getElementById('save-load-area');
  if(area&&game.hasSaveData()){
    try{
      const raw=localStorage.getItem('ses_save');
      const meta=raw?JSON.parse(raw):null;
      const savedAt=meta?._savedAt?new Date(meta._savedAt).toLocaleString('ja-JP',{month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'}):'';
      const info=meta?`${meta.companyName||'SES会社'} ${meta.year||1}年${meta.month||1}月 • ${savedAt}`:'';
      area.innerHTML=`
        <div style="display:flex;flex-direction:column;align-items:center;gap:6px;width:100%">
          <div style="font-size:11px;color:var(--muted)">\ud83d\udcbe セ\u30fc\u30d6デ\u30fc\u30bf: ${info}</div>
          <div style="display:flex;gap:8px">
            <button id="btn-load" class="btn btn-success" style="padding:8px 20px">▶ 続きからプレイ</button>
            <button id="btn-delete-save" class="btn btn-ghost" style="padding:8px 14px;font-size:11px;color:#e94560;border-color:rgba(233,69,96,0.3)">× データ削除</button>
          </div>
        </div>`;
      document.getElementById('btn-load').onclick=()=>{
        const r=game.loadGame();
        if(r.ok){Sound.play('success');this.render(game);}
        else{Sound.play('warn');alert('読み込み失敗: '+r.msg);}
      };
      document.getElementById('btn-delete-save').onclick=()=>{
        if(!confirm('セーブデータを削除しますか？'))return;
        game.deleteSave();
        Sound.play('click');
        this.render(game);
      };
    }catch(e){}
  }
},
bcDots(step,total){return Array.from({length:total},(_,i)=>`<div class="bc-dot${i<step?" filled":""}"></div>`).join("")},
sRole(game){const c=Object.entries(ROLES).map(([id,r])=>`<div class="setup-big-card" data-role="${id}"><div class="sbc-icon">${r.icon}</div><div class="sbc-name">${r.name}</div><div class="sbc-desc">${r.desc}</div><div class="sbc-stats"><div class="sbc-stat${id==="ceo"?" good":""}"><span class="sv">${r.actionsPerMonth}</span><span class="sl">アクション/月</span></div><div class="sbc-stat${id==="engineer-ceo"?" good":" muted"}"><span class="sv">${id==="engineer-ceo"?"¥70万":"¥0"}</span><span class="sl">初期月収</span></div></div></div>`).join("");
return`<div class="screen"><div class="setup-screen"><div class="setup-breadcrumb">${this.bcDots(1,4)}</div><div class="setup-step-label">STEP 1 / 4</div><h2 class="setup-heading">あなたは誰？</h2><p class="setup-desc">スタート時の役割でゲームスタイルが変わります</p><div class="setup-big-grid">${c}</div><div class="setup-nav"><div></div><button id="btn-role-next" class="btn btn-primary" disabled>次へ →</button></div></div></div>`},
bRole(game){document.querySelectorAll("[data-role]").forEach(el=>{el.onclick=()=>{Sound.play("select");document.querySelectorAll("[data-role]").forEach(e=>e.classList.remove("selected"));el.classList.add("selected");game.state.role=el.dataset.role;document.getElementById("btn-role-next").disabled=false;};});document.getElementById("btn-role-next").onclick=()=>{Sound.play("click");game.state.phase=game.state.role==="engineer-ceo"?"setup-loc":"setup-fund";this.render(game);};},
sFund(game){const c=Object.entries(FUNDINGS).map(([id,f])=>`<div class="setup-big-card" data-fund="${id}"><div class="sbc-icon">${f.icon}</div><div class="sbc-name">${f.name}</div><div class="sbc-desc">${f.desc}</div><div class="sbc-stats"><div class="sbc-stat good"><span class="sv">¥${(f.amount/10000).toFixed(0)}万</span><span class="sl">初期資金</span></div><div class="sbc-stat ${f.monthlyDebt>0?"bad":"good"}"><span class="sv">${f.monthlyDebt>0?"¥"+Math.round(f.monthlyDebt/10000)+"万":"なし"}</span><span class="sl">月返済</span></div></div></div>`).join("");
return`<div class="screen"><div class="setup-screen"><div class="setup-breadcrumb">${this.bcDots(2,4)}</div><div class="setup-step-label">STEP 2 / 4</div><h2 class="setup-heading">資金調達方法は？</h2><p class="setup-desc">初期資金と制約のトレードオフを選ぶ</p><div class="setup-big-grid">${c}</div><div class="setup-nav"><button id="btn-fund-back" class="btn btn-ghost">← 戻る</button><button id="btn-fund-next" class="btn btn-primary" disabled>次へ →</button></div></div></div>`},
bFund(game){document.querySelectorAll("[data-fund]").forEach(el=>{el.onclick=()=>{Sound.play("select");document.querySelectorAll("[data-fund]").forEach(e=>e.classList.remove("selected"));el.classList.add("selected");game.state.funding=el.dataset.fund;document.getElementById("btn-fund-next").disabled=false;};});document.getElementById("btn-fund-back").onclick=()=>{game.state.phase="setup-role";this.render(game);};document.getElementById("btn-fund-next").onclick=()=>{Sound.play("click");game.state.phase="setup-loc";this.render(game);};},
sLoc(game){
const bars=n=>[1,2,3,4,5].map(i=>`<div class="mini-bar${i<=Math.round(n*5)?" on":""}"></div>`).join("");
const c=Object.entries(LOCATIONS).map(([id,l])=>`<div class="setup-loc-card" data-loc="${id}"><div class="slc-icon">${l.icon}</div><div class="slc-name">${l.name}</div><div class="slc-cost${l.rent===0?" free":l.rent>=300000?" expensive":""}">${l.rent===0?"無料":"¥"+Math.round(l.rent/10000)+"万/月"}</div><div class="slc-bars"><div class="slc-bar-row"><span>案件</span><div class="mini-bars">${bars(l.caseRate)}</div></div><div class="slc-bar-row"><span>採用</span><div class="mini-bars">${bars(l.hiringRate)}</div></div></div><div class="slc-desc">${l.desc}</div></div>`).join("");
const step=game.state.role==="engineer-ceo"?2:3;
return`<div class="screen"><div class="setup-screen"><div class="setup-breadcrumb">${this.bcDots(step,4)}</div><div class="setup-step-label">STEP ${step} / 4</div><h2 class="setup-heading">拠点を選ぶ</h2><p class="setup-desc">案件獲得率・採用率・コストに影響します</p><div class="setup-loc-grid">${c}</div><div class="setup-nav"><button id="btn-loc-back" class="btn btn-ghost">← 戻る</button><button id="btn-loc-next" class="btn btn-primary" disabled>次へ →</button></div></div></div>`},
bLoc(game){const prev=game.state.role==="engineer-ceo"?"setup-role":"setup-fund";document.querySelectorAll("[data-loc]").forEach(el=>{el.onclick=()=>{Sound.play("select");document.querySelectorAll("[data-loc]").forEach(e=>e.classList.remove("selected"));el.classList.add("selected");game.state.location=el.dataset.loc;document.getElementById("btn-loc-next").disabled=false;};});document.getElementById("btn-loc-back").onclick=()=>{game.state.phase=prev;this.render(game);};document.getElementById("btn-loc-next").onclick=()=>{Sound.play("click");game.state.phase="setup-name";this.render(game);};},
sName(game){const _namPool=["\u682a\u5f0f\u4f1a\u793e\u30c6\u30c3\u30af\u30d6\u30ea\u30c3\u30b8","\u5408\u540c\u4f1a\u793e\u30bd\u30eb\u30d0\u30fc","\u682a\u5f0f\u4f1a\u793e\u30af\u30edXIT\u30bd\u30ea\u30e5\u30fc\u30b7\u30f3\u30ba","\u5408\u540c\u4f1a\u793e\u30a2\u30af\u30bb\u30eb\u30a8\u30f3\u30b8\u30cb\u30a2\u30ea\u30f3\u30b0","\u682a\u5f0f\u4f1a\u793e\u30cd\u30af\u30b9\u30c6\u30c3\u30af","\u682a\u5f0f\u4f1a\u793e\u30d6\u30ea\u30c3\u30b8\u30c6\u30af\u30ce","\u5408\u540c\u4f1a\u793e\u30a2\u30eb\u30d5\u30a1IT","\u682a\u5f0f\u4f1a\u793e\u30b0\u30ed\u30fc\u30d0\u30eb\u30a8\u30f3\u30b8\u30cb\u30a2\u30ea\u30f3\u30b0","\u682a\u5f0f\u4f1a\u793e\u30d7\u30e9\u30a4\u30e0\u30c6\u30c3\u30af","\u5408\u540c\u4f1a\u793e\u30c7\u30b8\u30bf\u30eb\u30d5\u30ed\u30f3\u30c6\u30a3\u30a2","\u682a\u5f0f\u4f1a\u793e\u30b9\u30ab\u30a4\u30c6\u30c3\u30af\u30bd\u30ea\u30e5\u30fc\u30b7\u30f3\u30ba","\u5408\u540c\u4f1a\u793e\u30a8\u30eb\u30c6\u30af\u30ce\u30ed\u30b8\u30fc","\u682a\u5f0f\u4f1a\u793e\u30b3\u30a2\u30c6\u30c3\u30af","\u5408\u540c\u4f1a\u793e\u30a4\u30ce\u30d9\u30fc\u30c8\u30a8\u30f3\u30b8\u30cb\u30a2\u30ea\u30f3\u30b0","\u682a\u5f0f\u4f1a\u793e\u30d5\u30a5\u30fc\u30c1\u30e3\u30fc\u30ea\u30f3\u30af","\u682a\u5f0f\u4f1a\u793e\u30bc\u30c6\u30a3\u30a2IT","\u5408\u540c\u4f1a\u793e\u30af\u30ea\u30a8\u30a4\u30c8\u30d6\u30ea\u30c3\u30b8","\u682a\u5f0f\u4f1a\u793e\u30aa\u30fc\u30d7\u30f3\u30c6\u30c3\u30af","\u682a\u5f0f\u4f1a\u793e\u30a2\u30c9\u30d0\u30f3\u30b9\u30c6\u30c3\u30af\u30cd\u30af\u30b9\u30c8","\u5408\u540c\u4f1a\u793e\u30d9\u30a4\u30b8\u30f3\u30b0\u30bd\u30ea\u30e5\u30fc\u30b7\u30f3\u30ba"];const sugg=_namPool.sort(()=>Math.random()-0.5).slice(0,4);const chips=sugg.map(s=>`<div class="name-chip" data-name="${s}">${s}</div>`).join("");
return`<div class="screen"><div class="setup-screen" style="max-width:520px"><div class="setup-step-label">STEP 4 / 4</div><h2 class="setup-heading">会社名を決める</h2><p class="setup-desc">あなたのSES会社の名前を入力してください</p><input id="co-name-in" class="company-input" type="text" placeholder="例：株式会社テックブリッジ" maxlength="30"><div class="name-suggestions">${chips}</div><div class="setup-nav"><button id="btn-name-back" class="btn btn-ghost">← 戻る</button><button id="btn-name-start" class="btn btn-success btn-xl">▶ 会社を設立する</button></div></div></div>`},
bName(game){const inp=document.getElementById("co-name-in");inp.value=game.state.companyName||"";inp.oninput=()=>{game.state.companyName=inp.value||"SES会社";};document.querySelectorAll("[data-name]").forEach(el=>{el.onclick=()=>{Sound.play("select");inp.value=el.dataset.name;game.state.companyName=el.dataset.name;};});document.getElementById("btn-name-back").onclick=()=>{game.state.phase="setup-loc";this.render(game);};document.getElementById("btn-name-start").onclick=()=>{Sound.play("success");game.startGame();this.render(game);};},game(game){const s=game.state,loc=LOCATIONS[s.location]||{icon:"",name:""},prog=Math.min(100,Math.round((s.cumulativeRevenue||s.totalRevenue||0)/s.targetRevenue*100)),wk=s.engineers.filter(e=>e.status==="working").length,tot=s.engineers.filter(e=>e.status!=="gone").length;
const engAll=s.engineers.filter(e=>e.status!=="gone");const engW=engAll.filter(e=>e.status==="working").length,engWt=engAll.filter(e=>e.status==="waiting").length;
const engs=engAll.map(e=>this.engRow(e,game)).join("")||`<div class="empty-state"><div class="ei">\uD83D\uDC64</div><div class="et">\u30A8\u30F3\u30B8\u30CB\u30A2\u304C\u3044\u307E\u305B\u3093<br><small>\u63A1\u7528\u3057\u3066\u304F\u3060\u3055\u3044</small></div></div>`;
const logs=s.log.slice(0,20).map(l=>`<div class="log-item log-${l.type}"><span class="log-mo">${this.m(l.month)}</span>${l.msg}</div>`).join("")||`<div class="log-item log-neutral">ログがありません</div>`;
const _csm=this._caseSortMode||"default";const sortedCases=[...s.availableCases].sort((a,b)=>{if(_csm==="billing")return(b.billingCurrent||b.billing||0)-(a.billingCurrent||a.billing||0);if(_csm==="margin"){const ma=(c.billingCurrent||c.billing||0)-Math.min(...s.engineers.filter(e=>e.status!=="gone").map(e=>e.salary||0).concat([0]));const mb=(b.billingCurrent||b.billing||0)-Math.min(...s.engineers.filter(e=>e.status!=="gone").map(e=>e.salary||0).concat([0]));return mb-ma;}return(b.clientTrust||0)-(a.clientTrust||0);});const avail=sortedCases.map(c=>this.caseCard(c,s,false)).join("")||`<div class="empty-state"><div class="ei">📭</div><div class="et">今月の案件はありません</div></div>`;
const active=s.activeCases.map(c=>this.caseCard(c,s,true)).join("")||`<div class="empty-state"><div class="ei">📋</div><div class="et">稼働中の案件なし</div></div>`;
const edu=s.pendingEducation?(()=>{const e=game.getEducationText(s.pendingEducation);return e?`<div class="edu-popup"><span class="edu-badge">💡 KNOWLEDGE</span> <strong>${e.title}</strong><p>${e.body}</p></div>`:""})():"";
const moneyDanger=s.money<500000;
const mkLabels={normal:'通常市場',boom:'🔥 好況期',recession:'📉 不況期'};
const mkColors={normal:'rgba(255,255,255,0.1)',boom:'rgba(255,100,0,0.2)',recession:'rgba(100,150,255,0.2)'};
const mkLabel=mkLabels[s.marketCondition||'normal'];
// ─ 各アクションの成功率計算 ─
const _tp=game.getTechPower(), _cr=game.getCredibility(), _bp=s.brandPoints||0;
const _snsRate  = Math.round((0.25+Math.min(0.4,_bp*0.004))*100);
const _blogRate = Math.round((0.3 +Math.min(0.5,_tp*0.04))*100);
const _netRate  = Math.round((0.45+Math.min(0.35,_cr*0.004))*100);
const _exRate   = Math.round((0.55+Math.min(0.25,_bp*0.003))*100);
// 成功率に応じた色分け関数
const _rc=p=>p>=70?'#00d4aa':p>=45?'#ffd200':'#e94560';
return`<div class="game-layout">
<header class="game-header" style="background:linear-gradient(180deg,rgba(6,8,18,.95) 0%,rgba(6,8,18,.88) 100%),url('img/office_bg.png') center/cover no-repeat;">
<div class="gh-top">
<div class="gh-left"><div class="co-name">${s.companyName} <span class="market-pill" style="background:${mkColors[s.marketCondition||'normal']}">${mkLabel}</span></div><div class="co-meta">${s.year}年${this.m(s.month)} · ${loc.icon}${loc.name}</div></div>
<div class="gh-right"><div class="actions-badge">残 <span>${s.actionsRemaining}</span>/${s.actionsPerMonth}</div><button id="btn-end-month" class="btn btn-primary${s.actionsRemaining===0?" btn-pulse-urgent":""}">月次決算 →</button></div>
</div>
<div class="gh-stats">
<div class="gh-stat${moneyDanger?" danger":""}"><div class="gsv">${moneyDanger?"⚠ ":""}¥${Math.round(s.money/10000)}万</div><div class="gsl">手元資金</div></div>
<div class="gh-stat"><div class="gsv text-green">¥${Math.round((s.cumulativeRevenue||0)/10000)}万</div><div class="gsl">累計売上</div></div>
<div class="gh-stat"><div class="gsv">${wk}/${tot}名</div><div class="gsl">稼働</div></div>
<div class="gh-power-bars">${this.statGauges(game)}</div>
<div class="gh-progress"><div class="gp-label"><span>年商1億目標</span><span class="gp-pct ${prog>=75?'gp-near':prog>=50?'gp-half':''}">${prog}%</span></div><div class="gp-bar"><div class="gp-fill" style="width:${prog}%"></div></div></div>
</div>
<div class="gh-actions">
<button id="btn-do-sales" class="gh-act-btn sales" title="\u55b6\u696d\u30a2\u30af\u30b7\u30e7\u30f3\uff081\u6d88\u8cbb\uff09">📣<span>\u55b6\u696d</span><small class="act-rate" style="color:${_rc(_salesRate)}">${_salesRate}%</small></button>
<button id="btn-cloud-work" class="gh-act-btn cloud" title="\u30af\u30e9\u30a6\u30c9\u30bd\u30fc\u30b7\u30f3\u30b0">💻<span>\u30af\u30e9\u30a6\u30c9</span><small class="act-rate" style="color:${_rc(_cloudRate)}">${_cloudRate}%</small></button>
<button id="btn-sns-post" class="gh-act-btn sns" title="SNS\u6295\u7a3f\uff082\u56de/\u6708\uff09\u2022\u30d0\u30ba\u308b\u304b\u3069\u3046\u304b">📢<span>SNS</span><small class="act-rate" style="color:${_rc(_snsRate)}">${_snsRate}%</small></button>
<button id="btn-blog-post" class="gh-act-btn blog" title="\u30d6\u30ed\u30b0\u8a18\u4e8b\u2022\u6280\u8853\u529b\u9ad8\u3044\u307b\u3069\u53cd\u97ff\u5927">✍<span>\u30d6\u30ed\u30b0</span><small class="act-rate" style="color:${_rc(_blogRate)}">${_blogRate}%</small></button>
<button id="btn-network" class="gh-act-btn network" title="\u696d\u754c\u4ea4\u6d41\u4f1a\u30fb\u98f2\u307f\u4f1a\uff085\u4e07\u5186\uff09">🍺<span>\u4ea4\u6d41\u4f1a</span><small class="act-rate" style="color:${_rc(_netRate)}">${_netRate}%</small></button>
<button id="btn-exhibition" class="gh-act-btn exhibition" title="\u5c55\u793a\u4f1a\u30fb\u540d\u523a\u4ea4\u63db\uff083\u4e07\u5186\uff09">💼<span>\u5c55\u793a\u4f1a</span><small class="act-rate" style="color:${_rc(_exRate)}">${_exRate}%</small></button>
<button id="btn-tech-train" class="gh-act-btn tech" title="\u5168\u30a8\u30f3\u30b8\u30cb\u30a2\u6280\u8853\u7814\u4fee\u300030\u4e07\u5186">🔬<span>\u6280\u8853\u7814\u4fee</span><small class="act-rate" style="color:${_rc(_trainRate)}">${_trainRate}%</small></button>
</div>
</header>
<div class="game-body">
<aside class="panel panel-eng"><div class="panel-header"><div class="panel-title">👥 エンジニア</div><button class="btn-hire-open" id="btn-open-hire">＋採用</button>${s.hasDispatchLicense?`<span class="license-ok-badge">✅ 派遣業許可</span>`:(s.licenseApplied?`<button class="btn btn-sm license-pending" id="btn-get-license">⏳ 許可申請中</button>`:`<button class="btn btn-sm btn-outline-warn" id="btn-get-license">📋 派遣許可申請</button>`)}</div><div class="eng-filter-tabs"><button class="eft active" data-ef="all">\u5168\u54E1(${engAll.length})</button><button class="eft" data-ef="working">\u7A3C\u50CD(${engW})</button><button class="eft" data-ef="waiting">\u5F85\u6A5F(${engWt})</button></div><div class="panel-body eng-list">${engs}</div></aside>
<main class="center-panel"><div class="tab-bar"><button class="tab-btn active" id="tab-avail">案件ボード(${s.availableCases.length})</button><button class="tab-btn" id="tab-active">稼働中(${s.activeCases.length})</button></div><div class="tab-content" id="tab-content">${edu}<div class="case-sort-bar"><span class="csb-label">\u4e26\u3073\u66ff\u3048:</span><button class="csb-btn active" data-sort="default">\u30c7\u30d5\u30a9\u30eb\u30c8</button><button class="csb-btn" data-sort="billing">\u5358\u4fa1\u9ad8\u3044\u9806</button></div><div class="section-title">\u4eca\u6708\u306e\u6848\u4ef6</div>${avail}</div></main>
<aside class="panel panel-log"><div class="panel-header"><div class="panel-title">📜 ログ</div><button id="btn-relocate" class="btn btn-sm" style="font-size:10px;border:1px solid rgba(255,255,255,.2);background:transparent;color:var(--text-secondary);padding:3px 8px;">🏢 引っ越し</button></div><div class="panel-body" style="padding:0">${logs}</div></aside>
</div></div>
${this.modal==="hire"?this.mHire(game):""}${this.modal==="assign"?this.mAssign(game):""}${this.modal==="relocate"?this.mRelocate(game):""}`;},
statGauges(game){
  const s=game.state;
  const sp=game.getSalesPower(), tp=game.getTechPower(), cr=game.getCredibility();
  const spMax=12, tpMax=20;
  const spPct=Math.min(100,Math.round(sp/spMax*100));
  const tpPct=Math.min(100,Math.round(tp/tpMax*100));
  const crPct=cr;
  const spLv=sp<=2?'Lv1 新人':sp<=4?'Lv2 見習':sp<=7?'Lv3 一般':sp<=10?'Lv4 ベテラン':'Lv5 プロ';
  const tpLv=tp<=3?'Lv1 入門':tp<=7?'Lv2 初中級':tp<=12?'Lv3 中級':tp<=17?'Lv4 上級':'Lv5 エキスパート';
  const crLv=cr<=20?'Lv1 無名':cr<=40?'Lv2 認知':cr<=60?'Lv3 信頼':cr<=80?'Lv4 実績':'Lv5 業界著名';
  return`<div class="stat-gauge"><div class="sg-label"><span>📣 営業力</span><span class="sg-lv">${spLv}</span></div><div class="sg-bar"><div class="sg-fill sales" style="width:${spPct}%"></div></div></div>
<div class="stat-gauge"><div class="sg-label"><span>🔬 技術力</span><span class="sg-lv">${tpLv}</span></div><div class="sg-bar"><div class="sg-fill tech" style="width:${tpPct}%"></div></div></div>
<div class="stat-gauge"><div class="sg-label"><span>⭐ 信用力</span><span class="sg-lv">${crLv}</span></div><div class="sg-bar"><div class="sg-fill trust" style="width:${crPct}%"></div></div></div>`;
},
engRow(eng,game){
  const s=game.state,d=eng.dissatisfaction||0;
  const dc=d>=70?"#e94560":d>=40?"#ffd600":"#00d4aa";
  const stress=eng.stress||0;
  const sc=stress>=80?"#e94560":stress>=60?"#f7971e":"#7c86a2";
  const cas=s.activeCases.find(c=>c.assignedEngineerId===eng.id);
  const pt=typeof PERSONALITY_TYPES!=="undefined"?PERSONALITY_TYPES[eng.personality]:null;
  const pBadge=pt?`<span style="font-size:9px;color:${pt.color};background:${pt.color}18;border:1px solid ${pt.color}33;border-radius:3px;padding:1px 4px;margin-left:3px">${pt.icon}${pt.label}</span>`:"";
  const por=`<div class="er-av">${Portrait.generate(eng)}</div>`;
  const sdot=eng.status==="working"?`<span class="er-sdot working">\u25cf\u7a3c\u50cd</span>`:eng.status==="waiting"?`<span class="er-sdot waiting">\u25cf\u5f85\u6a5f</span>`:"";
  const infoLine=cas?`<div class="er-info">\ud83d\udccb ${cas.desc||cas.client}\uff08\u6b8b${cas.monthsLeft}\u30f6\u6708\uff09</div>`:`<div class="er-info er-wait">\u23f3 \u5f85\u6a5f\u4e2d <span style="color:#e94560;font-size:9px">\u7d66\u4e0e\u767a\u751f\u4e2d</span></div>`;
  const canAct=s.actionsRemaining>0&&!eng.isSelf&&eng.status==="waiting";
  const acts=canAct?`<div class="er-acts"><button class="btn-eng-assign btn btn-xs btn-primary" data-eng-id="${eng.id}">\u2192\u6848\u4ef6</button>${(eng.skill||0)<3?`<button class="btn btn-xs btn-train" data-eng-id="${eng.id}" style="background:rgba(125,211,252,.1);border:1px solid rgba(125,211,252,.3);color:#7dd3fc">\ud83d\udcda\u80b2\u6210</button>`:""}</div>`:"";
  const dangerBadge=d>=70?`<div class="er-danger-label">\ud83d\udea8 \u9000\u8077\u5371\u967a</div>`:d>=50?`<div class="er-danger-label" style="color:#ffd600">\u26a0 \u96e2\u8077\u30ea\u30b9\u30af</div>`:"";
  const fireBtn=(!eng.isSelf&&eng.status==="waiting")?`<button class="btn-fire-eng btn btn-xs" data-eng-id="${eng.id}" style="background:rgba(233,69,96,.1);border:1px solid rgba(233,69,96,.3);color:#e94560;margin-top:4px">\ud83d\udd34 \u89e3\u96c7</button>`:"";
  return`<div class="eng-row${d>=70?" er-crit":""}" data-estatus="${eng.status}">
${por}<div class="er-body">
<div class="er-top"><span class="er-name">${eng.name}${eng.isSelf?`<span class='crown'>\ud83d\udc51</span>`:""}</span>${pBadge}${sdot}</div>
<div class="er-mid"><span class="er-type">${eng.typeName}</span><span class="er-sal">\u00a5${Math.round(eng.salary/10000)}\u4e07</span><span class="er-sk">${"\u2605".repeat(eng.skill||0)}${"\u2606".repeat(5-(eng.skill||0))}</span></div>
<div class="er-bars"><div class="er-dbar-wrap" title="\u4e0d\u6e80${d}%"><div class="er-dbar" style="width:${d}%;background:${dc}"></div></div><span class="er-stress" style="color:${sc}">\ud83d\ude24${stress}%</span></div>
${infoLine}${dangerBadge}${acts}${fireBtn}
</div></div>`},caseCard(cas,state,isActive){
const tc={direct:"type-direct",primary:"type-primary",secondary:"type-secondary",tertiary:"type-tertiary"}[cas.type]||"";
const pct=Math.min(100,Math.round(cas.billingCurrent/1300000*100));
const mg=Math.round(cas.billingCurrent*0.32/10000);
const eng=isActive?state.engineers.find(e=>e.id===cas.assignedEngineerId):null;
const waiting=state.engineers.filter(e=>e.status==="waiting"&&!e.isSelf&&e.skill>=(cas.requiredSkill??0));
const needsLicense=cas.contractType==='dispatch'&&!state.hasDispatchLicense;
const ctBadge=cas.contractType==='dispatch'?`<span class="ct-badge ct-dispatch">${state.hasDispatchLicense?'📋 派遣契約':'🔒 派遣契約（要許可）'}</span>`:cas.contractType==='disguised'?`<span class="ct-badge ct-disguised">⚠ 準委任（実態不明）</span>`:`<span class="ct-badge ct-quasi">📝 準委任契約</span>`;
const canAssign=!isActive&&waiting.length>0&&state.actionsRemaining>0&&!needsLicense;
const lyr={direct:"[エンド直]",primary:"SIer→[あなた]",secondary:"SIer→1次→[あなた]",tertiary:"SIer→1次→2次→[あなた]"}[cas.type]||"";
const ri=cas.risk==="high"?"🔴":cas.risk==="medium"?"🟡":"🟢";
const tagMatch=waiting.filter(e=>(cas.requiredTags||[]).length===0||(e.skillTags||[]).some(t=>(cas.requiredTags||[]).includes(t)));
const matchBadge=isActive?"":(tagMatch.length>0?`<span class="match-badge ok">✓ ${tagMatch.length}人アサイン可</span>`:(waiting.length>0?`<span class="match-badge partial">△ スキル不足</span>`:`<span class="match-badge none">人材なし</span>`));
// ── 信頼度バッジ ──
const trust=cas.clientTrust||3;
const trustPct={5:100,4:100,3:80,2:55,1:30}[trust]||80;
const trustRejectPct=100-trustPct;
const trustColor=trust>=4?'#00d4aa':trust===3?'#ffd600':trust===2?'#ff8c42':'#e94560';
const trustLabel=trust>=5?'★ 最高信頼':trust===4?'高':trust===3?'普通':trust===2?'低':'⚠ 危険';
const trustBadge=`<div class="cc-trust-badge" style="border-color:${trustColor};color:${trustColor}">
  <span class="ctb-stars">${'●'.repeat(trust)}${'○'.repeat(5-trust)}</span>
  <span class="ctb-label">信頼度${trust}/5 ${trustLabel}</span>
  ${trustRejectPct>0?`<span class="ctb-risk" style="color:${trustColor}">書類落ち${trustRejectPct}%</span>`:''}
</div>`;
const isRisky=trust<=2&&!isActive;
return`<div class="case-card${isActive?" cc-active":isRisky?" cc-risky cc-trust-danger":cas.risk==="high"?" cc-risky":" cc-avail"}">
<div class="cc-top"><div class="cc-client">${cas.desc}</div><div class="cc-badge-wrap"><div class="cc-badge ${tc}">${cas.typeName}</div>${ctBadge}${matchBadge}</div></div>
<div class="cc-layer">${lyr}</div><div class="cc-sub-client">${cas.client}</div>
<div class="cc-billing"><div class="ccb-label"><span>月額単価</span><strong>¥${Math.round(cas.billingCurrent/10000)}万</strong></div><div class="ccb-bar"><div class="ccb-fill ${cas.type}" style="width:${pct}%"></div></div></div>
<div class="cc-margin"><span>推定粗利</span><strong class="text-green">¥${mg}万/月</strong></div>
<div class="cc-meta"><span>${"★".repeat(cas.requiredSkill||cas.skill||1)}${"☆".repeat(5-(cas.requiredSkill||cas.skill||1))} スキル</span><span>${ri} ${cas.risk==="high"?"高":cas.risk==="medium"?"中":"低"}</span><span>⏱ ${isActive?cas.monthsLeft+"ヶ月残":cas.dur+"ヶ月"}</span></div>
${(cas.requiredTags&&cas.requiredTags.length>0)?`<div class="cc-tags">${cas.requiredTags.map(t=>`<span class="req-tag">${t}</span>`).join("")}</div>`:""}
${trustBadge}
${isActive&&eng?`<div class="cc-engineer">👤 ${eng.name}(${eng.typeName})</div>`:""}
${isActive&&!cas.contractExpiry?`<button class="btn btn-ghost btn-leave-project" data-leave-id="${cas.id}" data-trust="${trust}" data-client="${cas.client}" style="width:100%;margin-top:8px;color:#e94560;border-color:rgba(233,69,96,0.3);font-size:11px">⚠ 退プロ（契約期間中に撤退）${trust>=4?` ｜ 信頼度-${trust>=5?3:2} 信用力-${trust>=4?25:15}pt`:''}</button>`:""}
${!isActive?`<button class="btn ${canAssign?"btn-primary":"btn-ghost"} btn-assign" data-case-id="${cas.id}" ${canAssign?"":"disabled"} style="width:100%;margin-top:10px">${needsLicense?"🔒 派遣許可が必要（アクションから申請）":canAssign?`✦ アサインする（書類通過率${trustPct}%）→`:waiting.length===0?"⚠ 対応エンジニアなし":"アクション不足"}</button>
<button class="btn-decline btn btn-ghost" data-decline-id="${cas.id}" data-trust="${trust}" style="width:100%;margin-top:4px;font-size:11px;opacity:0.6">✕ この案件を断る${trust>=4?` ⚠ 信用力-${trust>=5?12:7}pt`:""}</button>`:""}
</div>`},

mRelocate(game){const s=game.state;
const cards=Object.entries(LOCATIONS).map(([id,loc])=>{
  const isCurrent=id===s.location;
  const canAfford=s.money>=loc.moveCost;
  const canAct=s.actionsRemaining>0;
  const canMove=!isCurrent&&canAfford&&canAct;
  return`<div class="loc-card${isCurrent?' loc-current':''}">
<div class="lc-header"><span class="lc-icon">${loc.icon}</span><strong>${loc.name}</strong>${isCurrent?'<span class="lc-tag">現在地</span>':''}${loc.licenseOk?'<span class="lc-tag lc-ok">派遣許可可</span>':'<span class="lc-tag lc-ng">派遣許可不可</span>'}</div>
<div class="lc-stats">
  <span>📋 案件${Math.round(loc.caseRate*100)}%</span>
  <span>👥 採用${Math.round(loc.hiringRate*100)}%</span>
  <span>🏢 信頼度${'★'.repeat(loc.trust)}${'☆'.repeat(5-loc.trust)}</span>
  <span>💴 月家賃 ¥${Math.round(loc.rent/10000)}万</span>
</div>
<div class="lc-desc">${loc.desc}</div>
${!isCurrent?`<button class="btn ${canMove?'btn-primary':'btn-ghost'} lc-move-btn" data-loc-id="${id}" ${canMove?'':'disabled'} style="width:100%;margin-top:8px">${!canAct?'アクション不足':!canAfford?`資金不足（移転費 ${Math.round(loc.moveCost/10000)}万）`:`🚛 ここに移転する（移転費 ${Math.round(loc.moveCost/10000)}万）`}</button>`:''}
</div>`;}).join('');
return`<div class="modal-overlay"><div class="modal-box" style="max-width:560px">
<div class="modal-header"><span>🏢 拠点の引っ越し</span><button id="btn-modal-close" class="btn-close">✕</button></div>
<div class="modal-body"><p style="color:var(--text-secondary);font-size:13px;margin-bottom:12px">移転後は案件獲得率・採用率・家賃が即時変更されます。アクション1消費。</p>
<div class="loc-grid">${cards}</div>
</div></div></div>`;},
mHire(game){const s=game.state;

if(s.hiringChannel){const ch=HIRING_CHANNELS.find(c=>c.id===s.hiringChannel)||{};
const items=s.hiringCandidates.length===0?`<div class="empty-state" style="padding:40px"><div class="ei">😔</div><div class="et">このチャンネルでは今月候補者が見つかりませんでした<br><small>別のチャンネルを試してみてください</small></div></div>`:s.hiringCandidates.map(c=>{const HIDDEN_T=["backtrack-risk"];const tr=(c.traits||[]).filter(t=>!HIDDEN_T.includes(t)).map(t=>{const tl=TRAIT_LABELS[t];return tl?`<span class="ctrait ${tl.class}">${tl.label}</span>`:""}).join("");const mg=c.billingRate-c.salary;const bilV=Math.round((c.billingRate||0)/10000),salV=Math.round(c.salary/10000),mgV=Math.round(mg/10000);const pt2=typeof PERSONALITY_TYPES!=="undefined"?PERSONALITY_TYPES[c.personality]:null;const pBadge=pt2?`<span class="ctrait" style="background:${pt2.color}18;color:${pt2.color};border:1px solid ${pt2.color}33">${pt2.icon} ${pt2.label}</span>`:"";
const tags=(c.skillTags||[]).map(t=>`<span class="cand-tag">${t}</span>`).join("");
const casesCanDo=(s.availableCases||[]).filter(cas=>c.skill>=(cas.requiredSkill||1)&&((cas.requiredTags||[]).length===0||(c.skillTags||[]).some(t=>(cas.requiredTags||[]).includes(t))));
const caseMatch=casesCanDo.length>0?`<div class="cand-case-match">📋 今月の案件 ${casesCanDo.length}件に対応可能</div>`:`<div class="cand-case-match warn">⚠ 今月の案件に対応できるものがありません</div>`;
return`<div class="cand-card ${c.negotiationResult==='refused'?'refused':''}" data-cid="${c.id}"><div class="cand-portrait">${Portrait.generate(c)}</div><div class="cand-info"><div class="cand-name">${c.name} <span class="cand-age">${c.age||"?"}歳</span></div><div class="cand-type">${c.typeName} / 経験${c.exp}年 / ${"★".repeat(c.skill)}</div><div class="cand-tags">${tags}</div><div class="cand-nums"><span class="cn blue">希望¥${Math.round(c.salaryAsk/10000)}万</span><span class="cn muted">最低¥${Math.round((c.salaryMin||c.salary*0.85)/10000)}万</span><span class="cn yellow"> 粗利<b>${Math.round(mg/10000)}万</b><span style="font-size:10px;color:rgba(255,255,255,.55);display:block">単価${Math.round((c.billingRate||0)/10000)}万−給与${Math.round(c.salary/10000)}万/月</span></span></div><div class="cand-traits">${pBadge}${tr}</div>${caseMatch}${c.negotiationResult==='refused'?`<div class="nego-refused">⚠ 交渉決裂 - 別の候補者を選んでください</div>`:""}</div></div>`;}).join("");
return`<div class="modal-overlay"><div class="modal"><h2>候補者を選ぶ</h2><p class="modal-sub">${ch.name||""} · ${ch.cost===0?"無料":"¥"+Math.round((ch.cost||0)/10000)+"万"}</p><div class="cand-list" id="cand-list">${items}</div><div class="modal-foot"><button id="btn-modal-close" class="btn btn-ghost">キャンセル</button><div class="nego-btns" id="nego-btns" style="display:none"><div class="nego-label">💼 給与交渉オプション</div><button id="btn-nego-full" class="btn btn-success nego-btn"><div class="nb-left"><span class="nbi">✓</span><span class="nbt">希望額で採用</span></div><span class="nbp" style="background:rgba(0,212,170,0.2);color:#00d4aa">確率 100%</span></button><button id="btn-nego-mid" class="btn btn-primary nego-btn"><div class="nb-left"><span class="nbi">⚡</span><span class="nbt">交渉する<small> (-15%)</small></span></div><span class="nbp" style="background:rgba(58,145,218,0.2);color:#7ab8f5">🎲 確率 80%</span></button><button id="btn-nego-low" class="btn nego-btn" style="background:rgba(255,165,0,0.1);border:1px solid rgba(255,165,0,0.3);color:#ffa500"><div class="nb-left"><span class="nbi">🎲</span><span class="nbt">低額オファー<small> (-30%)</small></span></div><span class="nbp" style="background:rgba(255,165,0,0.15);color:#ffa500">🎲 確率 40%</span></button></div></div><div id="dice-overlay" style="display:none;position:absolute;inset:0;background:rgba(6,8,18,0.92);display:none;flex-direction:column;align-items:center;justify-content:center;border-radius:16px;z-index:10"><div class="dice-label" id="dice-label">交渉中...</div><div class="dice-num" id="dice-num">??</div><div class="dice-bar-wrap"><div class="dice-bar" id="dice-bar"></div><div class="dice-threshold" id="dice-threshold"></div></div><div class="dice-result" id="dice-result"></div><button id="dice-close" class="btn btn-primary" style="display:none;margin-top:16px">続ける →</button></div></div></div>`;}

const bp=s.brandPoints||0;
const cred=Math.min(5,s.credibility||1); // 0-5スケール
const credScale=cred/5; // 0.0-1.0

// チャンネルごとの「無名時base」と「MAX到達率」を定義
const CH_CRED_SCALE={
  hellowork:   {min:12, max:28, factor:'free'},
  indeed:      {min:15, max:38, factor:'free'},
  x_sns:       {min:0,  max:0,  factor:'brand'},
  direct:      {min:0,  max:0,  factor:'brand'},
  linkedin:    {min:12, max:80, factor:'cred'},
  wantedly:    {min:18, max:68, factor:'cred_brand'},
  green:       {min:20, max:85, factor:'cred'},
  doda:        {min:18, max:88, factor:'cred'},
  agent:       {min:25, max:95, factor:'cred'},
};

const cards=HIRING_CHANNELS.map(ch=>{
  const cfg=CH_CRED_SCALE[ch.id]||{min:20,max:60,factor:'free'};
  let dispRate,rateNote='';

  if(cfg.factor==='brand'){
    // X採用・ダイレクトスカウト: ブランド力連動
    if(ch.id==='direct'){
      dispRate=bp<15?8:Math.min(88,12+Math.round((bp/100)*70));
    } else {
      dispRate=Math.min(82,10+Math.round((bp/100)*58));
    }
    rateNote=`<div style="font-size:10px;color:#7c86a2;margin-top:3px">\uD83D\uDCE3 \u30D6\u30E9\u30F3\u30C9\u529B${bp}pt\u9023\u52D5</div>`;

  } else if(cfg.factor==='cred'){
    // 有料エージェント系: 信用力が強く影響
    dispRate=Math.round(cfg.min+(cfg.max-cfg.min)*credScale);
    const credIcon=cred>=4?'\u2B50':cred>=3?'\uD83D\uDCA1':'\u26A0';
    rateNote=`<div style="font-size:10px;color:#7c86a2;margin-top:3px">${credIcon} \u4BF6\u7528\u529BLv${cred}\u9023\u52D5\uFF08\u7121\u540D\u6642${cfg.min}%\u2192\u4BF6\u7528\u529B\u9AD8\u3044\u3068${cfg.max}%\uFF09</div>`;

  } else if(cfg.factor==='cred_brand'){
    // Wantedly系: ブランド+信用力のミックス
    const brandPart=Math.round((bp/100)*20);
    const credPart=Math.round((cfg.max-cfg.min)*credScale);
    dispRate=Math.min(cfg.max, cfg.min+credPart+brandPart);
    rateNote=`<div style="font-size:10px;color:#7c86a2;margin-top:3px">\uD83D\uDCCA \u4BF6\u7528\u529BLv${cred}+\u30D6\u30E9\u30F3\u30C9${bp}pt</div>`;

  } else {
    // 無料媒体(HW/Indeed): 小さなブランドボーナスのみ
    const brandBonus=Math.round((bp/100)*8);
    dispRate=Math.min(cfg.max, cfg.min+brandBonus);
    rateNote=`<div style="font-size:10px;color:#7c86a2;margin-top:3px">\uD83D\uDCCB \u8AA4\u52DF\u62C5\u5F53\u8005\u30B9\u30AF\u30EA\u30FC\u30CB\u30F3\u30B0\u3042\u308A</div>`;
  }

  const rateLabel=dispRate>=75?'\u9AD8':dispRate>=50?'\u4E2D':'\u4F4E';
  const rateColor=dispRate>=75?'#00d4aa':dispRate>=50?'#f7971e':'#e94560';
  const rateBar=`<div class="chc-rate-wrap"><div class="chc-rate-label" style="color:${rateColor}">\u5019\u88DC\u8005\u767A\u898B\u7387 <b>${dispRate}%</b> <span class="chc-rate-tag" style="background:${rateColor}22;color:${rateColor};border:1px solid ${rateColor}44;border-radius:4px;padding:1px 5px;font-size:10px">${rateLabel}</span></div><div class="chc-rate-bar-bg"><div class="chc-rate-bar-fill" style="width:${dispRate}%;background:linear-gradient(90deg,${rateColor}88,${rateColor})"></div></div>${rateNote}</div>`;
  return`<div class="ch-card" data-ch="${ch.id}"><div class="chc-name">${ch.name}</div><div class="chc-cost${ch.cost===0?" free":""}"><${ch.cost===0?"\u2713 \u7121\u6599":"\u00A5"+Math.round(ch.cost/10000)+"\u4E07"}</div><div class="chc-qual">${"\u2605".repeat(ch.quality)}${"\u2606".repeat(5-ch.quality)}</div>${rateBar}<div class="chc-desc">${ch.desc}</div></div>`;
}).join("");

return`<div class="modal-overlay"><div class="modal modal-wide"><h2>採用チャネルを選ぶ</h2><p class="modal-sub">チャネルで費用と候補者品質が変わります</p><div class="ch-grid">${cards}</div><div class="modal-foot"><button id="btn-modal-close" class="btn btn-ghost">キャンセル</button><button id="btn-ch-next" class="btn btn-primary" disabled>候補者を見る →</button></div></div></div>`;},
mAssign(game){const s=game.state,cas=s.availableCases.find(c=>c.id===this.selCase);if(!cas)return"";
const sk=cas.requiredSkill||cas.skill||1,waiting=s.engineers.filter(e=>e.status==="waiting"&&!e.isSelf&&e.skill>=sk);
const items=waiting.map(e=>{const mg=cas.billingCurrent-e.salary;return`<div class="cand-card" data-eid="${e.id}"><div class="cand-portrait">${Portrait.generate(e)}</div><div class="cand-info"><div class="cand-name">${e.name}</div><div class="cand-type">${e.typeName} / ${"★".repeat(e.skill)}</div><div class="cand-nums"><span class="cn green">月給¥${Math.round(e.salary/10000)}万</span><span class="cn yellow">粗利¥${Math.round(mg/10000)}万/月</span></div></div></div>`;}).join("")||`<p style="color:var(--muted);text-align:center;padding:20px">スキル${sk}以上の待機エンジニアがいません</p>`;
return`<div class="modal-overlay"><div class="modal"><h2>${cas.client}にアサイン</h2><p class="modal-sub">単価¥${Math.round(cas.billingCurrent/10000)}万 / ${cas.dur}ヶ月 / 必要スキル${sk}以上</p><div class="cand-list" id="assign-list">${items}</div><div class="modal-foot"><button id="btn-modal-close" class="btn btn-ghost">キャンセル</button><button id="btn-assign-confirm" class="btn btn-success" disabled>アサイン ✓</button></div></div></div>`;},
bGame(game){const s=game.state;
// ヘッダー高さを計測してgame-bodyのheightを動的調整
requestAnimationFrame(()=>{const hdr=document.querySelector('.game-header');if(hdr){const h=hdr.getBoundingClientRect().height;document.documentElement.style.setProperty('--hh',h+'px');}});
const _cw=document.getElementById('btn-cloud-work');
if(_cw){_cw.onclick=()=>{const r=game.doCloudWork();if(r&&r.ok){Sound.play('cash');this.render(game);}else if(r){Sound.play('warn');alert(r.msg);}}}
const _sns=document.getElementById('btn-sns-post');
if(_sns){_sns.onclick=()=>{
  const r=game.doSNSPost();
  if(r&&r.ok){Sound.play(r.success?'success':'click');this.render(game);}
  else if(r){Sound.play('warn');alert(r.msg);}
}}
const _blog=document.getElementById('btn-blog-post');
if(_blog){_blog.onclick=()=>{
  const r=game.doBlogPost();
  if(r&&r.ok){
    Sound.play(r.success?'success':'click');
    if(r.inboundBonus)alert('\u270d\ufe0f \u30d6\u30ed\u30b0\u304c\u30d0\u30ba\u3063\u305f\uff01\u6848\u4ef6\u30a4\u30f3\u30d0\u30a6\u30f3\u30c9\u52b9\u679c');
    this.render(game);
  } else if(r){Sound.play('warn');alert(r.msg);}
}}
const _net=document.getElementById('btn-network');
if(_net){_net.onclick=()=>{
  const r=game.doNetworkEvent();
  if(r&&r.ok){
    Sound.play(r.success?'success':'click');
    this.render(game);
  } else if(r){Sound.play('warn');alert(r.msg);}
}}
const _ex=document.getElementById('btn-exhibition');
if(_ex){_ex.onclick=()=>{
  const r=game.doExhibition();
  if(r&&r.ok){
    Sound.play(r.success?'success':'click');
    this.render(game);
  } else if(r){Sound.play('warn');alert(r.msg);}
}}
const _tt=document.getElementById('btn-tech-train');
if(_tt){_tt.onclick=()=>{
  const r=game.doTechTraining();
  if(r&&r.ok){Sound.play('click');if(r.levelUps.length>0)alert('🎓 スキルアップ！\n'+r.levelUps.map(e=>e.name+'→Lv'+e.skill).join('\n'));this.render(game);}else if(r){Sound.play('warn');alert(r.msg);}
}}
const _sb=document.getElementById('btn-do-sales');
if(_sb){_sb.onclick=()=>{
  const r=game.doSalesActivity();
  if(r&&r.ok){
    Sound.play('click');
    // 案件ボードを即時更新
    const tab=document.getElementById('tab-content');
    if(tab){
      const edu=s.pendingEducation?(()=>{const e=game.getEducationText(s.pendingEducation);return e?`<div class="edu-popup"><span class="edu-badge">💡 KNOWLEDGE</span> <strong>${e.title}</strong><p>${e.body}</p></div>`:''})():'';
      tab.innerHTML=edu+`<div class="section-title">今月の案件</div>`+s.availableCases.map(c=>this.caseCard(c,s,false)).join('');
      this.bindCaseBtns(game);
    }
    this.render(game);
  } else if(r){Sound.play('warn');alert(r.msg);}
};}
document.getElementById("btn-end-month").onclick=()=>{Sound.play("cash");s.pendingEducation=null;game.endMonth();if(s.monthEndSummary?.victory){s.phase="victory";this.render(game);return;}if(s.monthEndSummary?.bankrupt){s.phase="bankrupt";this.render(game);return;}this.render(game);};

document.getElementById("tab-avail").onclick=()=>{document.querySelectorAll(".tab-btn").forEach(b=>b.classList.remove("active"));document.getElementById("tab-avail").classList.add("active");const edu=s.pendingEducation?(()=>{const e=game.getEducationText(s.pendingEducation);return e?`<div class="edu-popup"><span class="edu-badge">💡 KNOWLEDGE</span> <strong>${e.title}</strong><p>${e.body}</p></div>`:""})():"";const av=s.availableCases.map(c=>this.caseCard(c,s,false)).join("")||`<div class="empty-state"><div class="ei">📭</div><div class="et">今月の案件なし</div></div>`;document.getElementById("tab-content").innerHTML=edu+`<div class="section-title">今月の案件</div>`+av;this.bindCaseBtns(game);};
document.getElementById("tab-active").onclick=()=>{document.querySelectorAll(".tab-btn").forEach(b=>b.classList.remove("active"));document.getElementById("tab-active").classList.add("active");const ac=s.activeCases.map(c=>this.caseCard(c,s,true)).join("")||`<div class="empty-state"><div class="ei">📋</div><div class="et">稼働中なし</div></div>`;document.getElementById("tab-content").innerHTML=`<div class="section-title">稼働中</div>`+ac;};
document.querySelectorAll(".csb-btn").forEach(btn=>{btn.onclick=()=>{document.querySelectorAll(".csb-btn").forEach(b=>b.classList.remove("active"));btn.classList.add("active");this._caseSortMode=btn.dataset.sort;this.render(game);};});
document.querySelectorAll(".eft").forEach(btn=>{btn.onclick=()=>{document.querySelectorAll(".eft").forEach(b=>b.classList.remove("active"));btn.classList.add("active");const ef=btn.dataset.ef;document.querySelectorAll(".eng-row").forEach(row=>{row.style.display=(ef==="all"||row.dataset.estatus===ef)?"":"none";});};});
document.getElementById("btn-open-hire").onclick=()=>{if(s.actionsRemaining<=0){Sound.play("warn");alert("今月のアクションが残っていません");return;}Sound.play("click");s.hiringCandidates=[];s.hiringChannel=null;this.modal="hire";this.render(game);};
const _lb=document.getElementById("btn-get-license");
if(_lb&&!s.hasDispatchLicense){
  _lb.onclick=()=>{
    if(s.licenseApplied){alert("⏳ すでに申請中です。来月交付されます。");return;}
    const conds=game.getLicenseConditions();
    const unmet=conds.filter(c=>!c.met);
    const condMsg=conds.map(c=>(c.met?"✅":"❌")+" "+c.label+" ("+c.current+")").join("\n");
    if(unmet.length>0){Sound.play("warn");alert("【派遣業許可 申請条件】\n\n"+condMsg+"\n\n条件を満たしてから申請してください。");return;}
    if(s.actionsRemaining<=0){Sound.play("warn");alert("アクションが不足しています");return;}
    if(s.money<500000){Sound.play("warn");alert("資金不足（申請費用50万円必要）");return;}
    if(!confirm("【派遣業許可申請】\n\n"+condMsg+"\n\n申請費用：50万円\n翌月交付予定\n\n申請しますか？")){return;}
    const r=game.acquireDispatchLicense();
    if(r&&r.ok){Sound.play("click");alert("⏳ 申請完了！来月正式交付されます（申請費50万）");this.render(game);}
    else if(r){Sound.play("warn");alert(r.msg);}
  };
}
const _rb=document.getElementById("btn-relocate");
if(_rb){_rb.onclick=()=>{this.modal="relocate";this.render(game);};}
this.bindCaseBtns(game);},
bindCaseBtns(game){const s=game.state;
document.querySelectorAll(".btn-leave-project").forEach(btn=>{btn.onclick=()=>{
  const cid=parseInt(btn.dataset.leaveId);
  const trust=parseInt(btn.dataset.trust)||3;
  const client=btn.dataset.client||'';
  const trustLoss=trust>=5?3:trust>=4?2:1;
  const brandLoss=trust>=4?25:15;
  if(!confirm(`⚠⚠ 退プロ（契約期間中の撤退）\n\n「${client}」との契約を途中で打ち切ります。\n\nペナルティ:\n・クライアント信頼度 -${trustLoss}（最低1）\n・会社の信用力 -${brandLoss}pt\n・業界での評判が大幅に低下します\n\n本当に退プロしますか？`))return;
  Sound.play('warn');
  const r=game.leaveProject(cid);
  if(r&&r.ok){this.render(game);}else{alert('退プロできません。');}
};});

document.querySelectorAll(".btn-decline").forEach(btn=>{btn.onclick=()=>{
  const cid=parseInt(btn.dataset.declineId);
  const trust=parseInt(btn.dataset.trust)||3;
  if(trust>=5){
    if(!confirm(`⚠ 信頼度MAX「信用力-12pt」\n\nこのクライアントのオファーを断ると業界での評判が大きく下がります。\n本当に断りますか？`))return;
  }else if(trust>=4){
    if(!confirm(`⚠ 信頼度の高いオファー「信用力-7pt」\n\nこのオファーを断ると会社の信用力が少し下がります。\n本当に断りますか？`))return;
  }
  Sound.play("warn");
  game.declineCase(cid);
  this.render(game);
};});
document.querySelectorAll(".btn-fire-eng").forEach(btn=>{btn.onclick=()=>{const eid=parseInt(btn.dataset.engId);const eng=game.state.engineers.find(e=>e.id===eid);if(!eng)return;if(!confirm(`${eng.name}\u3092\u89e3\u96c7\u3057\u307e\u3059\u304b\uff1f\n\u9000\u8077\u91d1\uff1a\u00a5${Math.round(eng.salary/10000)}\u4e07\u5186\uff081\u304b\u6708\u5206\uff09`))return;const r=game.fireEngineer(eid);if(r&&r.ok){Sound.play("alert");this.render(game);}else if(r){Sound.play("warn");alert(r.msg);}};});
document.querySelectorAll(".btn-assign").forEach(btn=>{
  btn.onclick=()=>{
    if(btn.disabled)return;
    Sound.play("click");
    const cid=parseInt(btn.dataset.caseId);
    this.selCase=cid;
    this.selEng=null;
    this.modal="assign";
    this.render(game);
  };
});
document.querySelectorAll(".btn-eng-assign").forEach(btn=>{btn.onclick=()=>{Sound.play("click");const eid=parseInt(btn.dataset.engId);const avail=s.availableCases.filter(c=>{const e=s.engineers.find(x=>x.id===eid);return e&&e.skill>=(c.requiredSkill??0)&&(!c.requiredTags||c.requiredTags.length===0||(e.skillTags||[]).some(t=>c.requiredTags.includes(t)));});if(avail.length===0){Sound.play("warn");alert("この人材が担当できる案件が現在ありません");return;}this.selEng=eid;this.selCase=avail[0].id;this.modal="assign";this.render(game);};});
document.querySelectorAll(".lc-move-btn").forEach(btn=>{btn.onclick=()=>{const locId=btn.dataset.locId;const r=game.relocate(locId);if(r&&r.ok){Sound.play("click");this.modal=null;const t=r.target;alert("🚛 移転完了！「"+t.name+"」に引っ越しました。\n来月から家賃：¥"+Math.round(t.rent/10000)+"万\n案件獲得率："+Math.round(t.caseRate*100)+"%\n採用マッチ率："+Math.round(t.hiringRate*100)+"%");this.render(game);}else if(r){Sound.play("warn");alert(r.msg);}};});
document.querySelectorAll(".btn-train").forEach(btn=>{btn.onclick=()=>{const eid=parseInt(btn.dataset.engId);const r=game.trainEngineer(eid);if(r&&r.ok){Sound.play("click");if(r.leveled)alert("🎓 スキルアップ！ Lv"+r.skill+"になりました！");this.render(game);}else if(r){Sound.play("warn");alert(r.msg);}};});
const cl=document.getElementById("btn-modal-close");if(cl)cl.onclick=()=>{this.modal=null;this.selCase=null;this.selCand=null;s.hiringCandidates=[];s.hiringChannel=null;this.render(game);};
const cn=document.getElementById("btn-ch-next");if(cn){document.querySelectorAll("[data-ch]").forEach(el=>{el.onclick=()=>{Sound.play("select");document.querySelectorAll("[data-ch]").forEach(e=>{e.classList.remove("selected");delete e._selectedCh;});el.classList.add("selected");el._selectedCh=el.dataset.ch;cn.disabled=false;};});
cn.onclick=()=>{
  const selEl=document.querySelector("[data-ch].selected");
  if(!selEl)return;
  const chId=selEl.dataset.ch;
  const s=game.state;
  // アクション消費チェック
  if(s.actionsRemaining<=0){Sound.play("warn");alert("\u30a2\u30af\u30b7\u30e7\u30f3\u304c\u6b8b\u3063\u3066\u3044\u307e\u305b\u3093\u3002\u6708\u6b21\u6c7a\u7b97\u3078\u9032\u3093\u3067\u304f\u3060\u3055\u3044\u3002");return;}
  s.actionsRemaining--;
  Sound.play("roll");
  // 探索演出
  cn.disabled=true;cn.textContent="\ud83d\udcf1 \u30b9\u30ab\u30a6\u30c8\u4e2d\u2026";
  const overlay=document.createElement("div");
  overlay.style.cssText="position:fixed;inset:0;background:rgba(6,8,18,.7);z-index:9999;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:16px";
  overlay.innerHTML=`<div style="font-size:40px;animation:spin 1s linear infinite">\ud83d\udcf1</div><div style="color:#7ab8f5;font-size:18px;font-weight:700">\u5019\u88dc\u8005\u3092\u63a2\u3057\u3066\u3044\u307e\u3059\u2026</div><div style="color:var(--muted);font-size:12px">${chId==="direct"?"\ud83d\udce3 GitHub/Qiita\u3092\u30b9\u30ad\u30e3\u30f3\u4e2d":chId==="x_sns"?"\ud83d\udc26 X\u306e\u30a8\u30f3\u30b8\u30cb\u30a2\u30a2\u30ab\u30a6\u30f3\u30c8\u3092\u30c1\u30a7\u30c3\u30af\u4e2d":"\ud83d\udccb \u5fdc\u52df\u8005\u3092\u30b9\u30af\u30ea\u30fc\u30cb\u30f3\u30b0\u4e2d"}</div>`;
  document.body.appendChild(overlay);
  setTimeout(()=>{
    game.generateCandidates(chId);
    overlay.remove();
    const found=s.hiringCandidates.length;
    if(found===0){Sound.play("alert");}else{Sound.play("success");}
    this.render(game);
  },1400+Math.random()*600);
};}
const nb=document.getElementById("nego-btns");document.querySelectorAll("[data-cid]").forEach(el=>{el.onclick=()=>{Sound.play("select");document.querySelectorAll("[data-cid]").forEach(e=>e.classList.remove("selected"));el.classList.add("selected");this.selCand=parseInt(el.dataset.cid);if(nb)nb.style.display="flex";};});
const showReaction=(type,successRate,candidateId,onDone)=>{
  const cand=s.hiringCandidates.find(c=>c.id===candidateId)||{};
  const ov=document.getElementById("dice-overlay"),dc=document.getElementById("dice-close");
  if(!ov)return onDone();
  const success=Math.random()<(successRate/100);
  const offered=Math.round((cand.salaryAsk||0)*(type==="negotiate"?0.85:0.70)/10000);
  const quotes={
    negotiate:{
      ok:[`...考えました。月${offered}万なら、お世話になります。`,`正直もう少し欲しいですが...お受けします。`,`スキルを磨けそうな環境ですね。承諾します。`],
      ng:[`申し訳ありません、それでは生活が厳しくて。`,`少し考えさせてください...やはり難しいです。`,`他社さんとも話しているので、もう少し検討させてください。`]
    },
    lowball:{
      ok:[`...正直かなり厳しいですが、経験重視でお受けします。`,`うーん...まあ、最初だけなら。よろしくお願いします。`],
      ng:[`それはさすがに...失礼ですが、お断りします。`,`市場相場をご存知ですか？その額では無理です。`,`他からもっと良い条件をいただいています。`]
    }
  };
  const pool=success?quotes[type].ok:quotes[type].ng;
  const quote=pool[Math.floor(Math.random()*pool.length)];
  // ステージ1: 候補者が考え中
  ov.innerHTML=`<div class="react-face">${Portrait.generate(cand)}</div><div class="react-name">${cand.name||"候補者"}</div><div class="react-offer">提示額：<strong>月${offered}万円</strong></div><div class="react-thinking" id="react-thinking"><span class="think-dot">.</span><span class="think-dot">.</span><span class="think-dot">.</span> 検討中</div><div class="react-bubble" id="react-bubble" style="opacity:0"></div><button id="dice-close" class="btn btn-primary" style="display:none;margin-top:16px">続ける →</button>`;
  ov.style.display="flex";
  const rb=document.getElementById("react-bubble"),dc2=document.getElementById("dice-close"),th=document.getElementById("react-thinking");
  setTimeout(()=>{
    th.style.opacity="0";
    setTimeout(()=>{
      rb.innerHTML=`<div class="bubble-text">&ldquo;${quote}&rdquo;</div>`;
      rb.style.opacity="1";
      rb.style.borderColor=success?"#00d4aa":"#e94560";
      rb.style.background=success?"rgba(0,212,170,0.08)":"rgba(233,69,96,0.08)";
      setTimeout(()=>{
        rb.innerHTML+=`<div class="react-verdict ${success?'react-ok':'react-ng'}">${success?'✅ 承諾':'❌ 辞退'}</div>`;
        Sound.rollEnd(success);
        dc2.style.display="block";
        dc2.onclick=()=>{ov.style.display="none";onDone(success);};
      },700);
    },300);
  },1600);
};
const doNego=(type)=>{
  const successRate=type==="full"?100:type==="negotiate"?80:40;
  if(type==="full"){const r=game.negotiateHire(this.selCand,"full");if(!r.ok){Sound.play("warn");alert(r.reason==="no_money"?"資金不足":"採用失敗");return;}Sound.play("success");this.modal=null;this.selCand=null;s.hiringCandidates=[];s.hiringChannel=null;this.render(game);return;}
  const neg=document.getElementById("nego-btns");if(neg)neg.style.display="none";
  showReaction(type,successRate,this.selCand,(success)=>{
    if(success){const r=game.negotiateHire(this.selCand,type);if(!r.ok){const c2=s.hiringCandidates.find(x=>x.id===this.selCand);if(c2)c2.negotiationResult="refused";this.render(game);return;}Sound.play("success");this.modal=null;this.selCand=null;s.hiringCandidates=[];s.hiringChannel=null;this.render(game);}else{const c2=s.hiringCandidates.find(x=>x.id===this.selCand);if(c2)c2.negotiationResult="refused";this.render(game);}
  });
};
const bf=document.getElementById("btn-nego-full");if(bf)bf.onclick=()=>doNego("full");
const bm=document.getElementById("btn-nego-mid");if(bm)bm.onclick=()=>doNego("negotiate");
const bl=document.getElementById("btn-nego-low");if(bl)bl.onclick=()=>doNego("lowball");
const ab=document.getElementById("btn-assign-confirm");if(ab){document.querySelectorAll("[data-eid]").forEach(el=>{el.onclick=()=>{Sound.play("select");document.querySelectorAll("[data-eid]").forEach(e=>e.classList.remove("selected"));el.classList.add("selected");this.selEng=parseInt(el.dataset.eid);ab.disabled=false;};});ab.onclick=()=>{
  if(!this.selEng)return;
  const eng2=game.state.engineers.find(e=>e.id===this.selEng);
  const cas2=game.state.availableCases.find(c=>c.id===this.selCase);
  // アニメーション演出
  const modal=document.querySelector('.modal');
  if(!modal)return;
  const ov=document.createElement('div');
  ov.id='assign-anim-overlay';
  ov.style.cssText='position:absolute;inset:0;background:rgba(6,8,18,0.96);display:flex;flex-direction:column;align-items:center;justify-content:center;border-radius:16px;z-index:20;gap:12px;padding:24px';
  ov.innerHTML=`<div style="font-size:64px">${Portrait.generate(eng2||{})}</div><div style="font-weight:700;font-size:1.1rem">${eng2?eng2.name:'—'}</div><div style="color:var(--muted);font-size:0.85rem">「${cas2?cas2.client:'—'}」に書類提出中...</div><div id="assign-anim-dots" style="display:flex;gap:6px;margin:8px 0">${[0,200,400].map(d=>`<span class="think-d" style="animation:pulse 1s ${d}ms infinite;width:8px;height:8px;border-radius:50%;background:#7c86a2"></span>`).join('')}</div><div id="assign-anim-result" style="opacity:0;transition:opacity 0.4s;text-align:center;border-radius:12px;padding:16px 20px;border:1px solid transparent;width:100%"></div><button id="assign-anim-close" class="btn btn-primary" style="display:none;width:100%;margin-top:4px">続ける →</button>`;
  modal.style.position='relative';
  modal.appendChild(ov);
  setTimeout(()=>{
    const ar=game.assignCase(this.selCase,this.selEng);
    const dots=document.getElementById('assign-anim-dots');
    const res=document.getElementById('assign-anim-result');
    const cls=document.getElementById('assign-anim-close');
    if(dots)dots.style.opacity='0';
    setTimeout(()=>{
      let ok=false,msg='',detail='';
      if(ar===true){ok=true;msg='✅ アサイン成功！';const b=Math.round((cas2?.billingCurrent||0)/10000);detail=`月額¥${b}万で稼働開始 🎉`;Sound.play('success');}
      else if(ar==='skill_rejected'){const diff=(cas2?.requiredSkill||1)-(eng2?.skill||0);const pct=diff<=0?100:diff===1?65:diff===2?35:15;msg='❌ スキル不足で書類落ち';detail=`通過率 ${pct}% / 必要Lv${cas2?.requiredSkill||1}→現在Lv${eng2?.skill||0}`;Sound.play('warn');}
      else if(ar==='trust_rejected'){const t=cas2?.clientTrust||3;const p={5:100,4:100,3:80,2:55,1:30}[t]||55;msg='❌ 書類審査で見送り';detail=`クライアント信頼度 ${t}/5 の壁（通過率${p}%）`;if(cas2)cas2._trustRejected=(cas2._trustRejected||0)+1;Sound.play('warn');}
      else if(ar==='sales_role'){msg='🚫 営業担当は常駐できません';detail='案件現場には技術系エンジニアをアサインしてください';Sound.play('warn');}
      else{msg='⚠ アサインできません';detail='稼働中のエンジニアです';Sound.play('warn');}
      if(res){res.textContent='';res.style.opacity='1';res.style.background=ok?'rgba(0,212,170,0.1)':'rgba(233,69,96,0.1)';res.style.borderColor=ok?'#00d4aa':'#e94560';res.innerHTML=`<div style="font-size:1.1rem;font-weight:700;margin-bottom:6px">${msg}</div><div style="color:var(--muted);font-size:0.8rem">${detail}</div>`;}
      if(cls){cls.style.display='block';cls.textContent=ok?'稼働開始！→':'別の選択へ →';cls.onclick=()=>{if(ok){this.modal=null;this.selCase=null;this.selEng=null;this.render(game);}else{modal.removeChild(ov);}};}
    },350);
  },1800);
};}},mEnd(game){const s=game.state,sum=s.monthEndSummary,profit=sum.revenue-sum.expenses;
// 財務グラフ生成
const hist=s.finHistory||[];
const finGraph=(()=>{
  if(hist.length<2) return `<div style="color:var(--muted);font-size:11px;text-align:center;padding:8px">\u30b0\u30e9\u30d5\u306f2\u30f6\u6708\u76ee\u304b\u3089\u8868\u793a\u3055\u308c\u307e\u3059</div>`;
  const W=340,H=90,pad=30;
  const maxAbs=Math.max(...hist.map(h=>Math.max(Math.abs(h.revenue||0),Math.abs(h.expenses||0))),1);
  const yScale=(H-10)/maxAbs;
  // ゼロライン
  const zeroY=H-4;
  const xStep=(W-pad*2)/Math.max(hist.length-1,1);
  // 売上折れ線
  const rPts=hist.map((h,i)=>`${pad+i*xStep},${zeroY-(h.revenue||0)*yScale}`).join(' ');
  // 損益折れ線
  const pPts=hist.map((h,i)=>{
    const py=zeroY-(h.profit||0)*yScale;
    return `${pad+i*xStep},${Math.max(2,Math.min(H-2,py))}`;
  }).join(' ');
  // 最新月のラベル
  const lastH=hist[hist.length-1];
  const lastPY=Math.max(2,Math.min(H-2,zeroY-(lastH.profit||0)*yScale));
  const lastRY=Math.max(2,Math.min(H-2,zeroY-(lastH.revenue||0)*yScale));
  const profitColor=lastH.profit>=0?'#00d4aa':'#e94560';
  return `<div style="margin:12px 0 4px">
<svg width="${W}" height="${H}" style="overflow:visible;display:block;margin:0 auto">
  <defs>
    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#7ab8f5" stop-opacity="0.7"/><stop offset="100%" stop-color="#7ab8f5" stop-opacity="0.05"/></linearGradient>
  </defs>
  <!-- ゼロライン -->
  <line x1="${pad}" y1="${zeroY}" x2="${W-pad}" y2="${zeroY}" stroke="rgba(255,255,255,0.15)" stroke-width="1" stroke-dasharray="3,3"/>
  <!-- 売上エリア -->
  <polyline points="${rPts}" fill="none" stroke="#7ab8f5" stroke-width="1.5" opacity="0.7"/>
  <!-- 損益折れ線 -->
  <polyline points="${pPts}" fill="none" stroke="${profitColor}" stroke-width="2"/>
  <!-- 最新値ドット -->
  <circle cx="${pad+(hist.length-1)*xStep}" cy="${lastPY}" r="3.5" fill="${profitColor}"/>
  <circle cx="${pad+(hist.length-1)*xStep}" cy="${lastRY}" r="2.5" fill="#7ab8f5"/>
</svg>
<div style="display:flex;gap:14px;justify-content:center;font-size:10px;color:var(--muted);margin-top:2px">
  <span><span style="color:#7ab8f5">\u2014</span> \u58f2\u4e0a</span>
  <span><span style="color:${profitColor}">\u2014</span> \u640d\u76ca</span>
</div></div>`;
})();
return`<div class="screen" style="background:#060812"><div class="month-end-card">
<div class="me-label">MONTHLY REPORT</div>
<div class="me-heading">${s.year}\u5e74${this.m(s.month)} \u6708\u6b21\u6c7a\u7b97</div>
${finGraph}
<div class="pnl">
<div class="pnl-r"><span>\u58f2\u4e0a\uff08\u6848\u4ef6\uff09</span><span class="pos">+ \xa5${Math.round(sum.revenue/10000)}\u4e07</span></div>
<div class="pnl-r"><span>\u30a8\u30f3\u30b8\u30cb\u30a2\u7d66\u4e0e</span><span class="neg">\u2212 \xa5${Math.round(sum.totalSalary/10000)}\u4e07</span></div>
<div class="pnl-r"><span>\u793e\u4f1a\u4fdd\u967a\uff0815%\uff09</span><span class="neg">\u2212 \xa5${Math.round(sum.socialIns/10000)}\u4e07</span></div>
<div class="pnl-r"><span>\u30aa\u30d5\u30a3\u30b9\u8cce\u6599</span><span class="neg">\u2212 \xa5${Math.round(sum.rent/10000)}\u4e07</span></div>
${s.bankRepayment>0?`<div class="pnl-r"><span>\u9280\u884c\u8fd4\u6e08</span><span class="neg">\u2212 \xa5${Math.round(s.bankRepayment/10000)}\u4e07</span></div>`:""}
<div class="pnl-r pnl-total"><span>\u6708\u6b21\u640d\u76ca</span><span class="${profit>=0?"pos":"neg"}">${profit>=0?"\uff0b":"\uff0d"} \xa5${Math.round(Math.abs(profit)/10000)}\u4e07</span></div>
</div>
${profit<0?`<div class="me-warn">\u26a0 \u4eca\u6708\u306f\u8d64\u5b57\u3067\u3059</div>`:""}
${sum.bankrupt?`<div class="me-warn">\ud83d\udc80 \u8cc7\u91d1\u30bc\u30ed\u3067\u5012\u7523</div>`:""}
<div class="me-actions">
${sum.bankrupt?`<button id="btn-gameover" class="btn btn-primary">\u7d50\u679c\u3092\u898b\u308b</button>`:sum.contractReviews&&sum.contractReviews.length>0?`<button id="btn-contract-review" class="btn btn-primary" style="background:linear-gradient(135deg,#f7971e,#ffd200);color:#111">\ud83d\udccb \u5951\u7d04\u66f4\u65b0\u78ba\u8a8d (${sum.contractReviews.length}\u4ef6) \u2192</button>`:s.pendingEvent?`<button id="btn-show-event" class="btn btn-primary" style="background:linear-gradient(135deg,#e94560,#c0392b)">\u26a1 \u30a4\u30d9\u30f3\u30c8\u767a\u751f\uff01</button>`:`<button id="btn-next-month" class="btn btn-success">\u6765\u6708\u3078 \u2192</button>`}
</div></div></div>`},
bMEnd(game){const s=game.state,sum=s.monthEndSummary;
const nx=document.getElementById("btn-next-month");if(nx)nx.onclick=()=>{Sound.play("next");game.nextMonth();const _sv=game.saveGame();if(!_sv.ok)console.warn('\u30bb\u30fc\u30d6\u5931\u6557:',_sv.msg);this.render(game);};
const go=document.getElementById("btn-gameover");if(go)go.onclick=()=>{Sound.play("defeat");s.phase="bankrupt";this.render(game);};
const ev=document.getElementById("btn-show-event");if(ev)ev.onclick=()=>{Sound.play("alert");document.getElementById("app").innerHTML=this.evScreen(s.pendingEvent,game);this.bEvScreen(game);};
const cr=document.getElementById("btn-contract-review");
if(cr)cr.onclick=()=>{
  Sound.play("click");
  const cas=sum.contractReviews[0];
  const eng=s.engineers.find(e=>e.id===cas.assignedEngineerId);
  const trust=cas.clientTrust||3;
  const inc=cas.priceIncreaseCount||0;
  const upRate=Math.max(5,Math.round(({5:0.80,4:0.65,3:0.45,2:0.25,1:0.10}[trust]||0.45-inc*0.15)*100));
  const totalRev=Math.round((cas.billingCurrent||0)/10000);
  const monthlyProfit=Math.round((cas.billingCurrent-(eng?.salary||0))*0.85/10000);
  const trustPips='●'.repeat(trust)+'○'.repeat(5-trust);
  document.getElementById("app").innerHTML=`<div class="event-screen"><div class="event-card ev-neutral" style="max-width:520px">
<div class="ev-title">📋 契約更新確認</div>
<div class="ev-date">${cas.client}</div>
${eng?`<div class="ev-portrait">${Portrait.generate(eng)}</div>`:''}
<div class="ev-desc" style="text-align:left;background:rgba(255,255,255,0.03);border-radius:8px;padding:12px;margin:12px 0">
  <div>担当: <b>${eng?eng.name:'—'}</b> / ${eng?eng.typeName:'—'}</div>
  <div>月額単価: <b>¥${totalRev}万</b> / 粗利目安: <b>¥${monthlyProfit}万/月</b></div>
  <div>クライアント信頼度: <b>${trustPips}</b> (${trust}/5)</div>
  ${inc>0?`<div style="color:#f7971e">⚠ 単価UP履歴: ${inc}回（次回成功率: ${upRate}%）</div>`:''}
</div>
<div class="ev-choices">
  <button class="ev-choice cr-choice" data-cr="extend" data-months="3">📅 3ヶ月延長（現行単価）</button>
  <button class="ev-choice cr-choice" data-cr="extend" data-months="6">📅 6ヶ月延長（現行単価）</button>
  <button class="ev-choice cr-choice" data-cr="priceUp" data-amount="50000">💰 単価UP +5万/月（成功率${upRate}%）</button>
  <button class="ev-choice cr-choice" data-cr="addMember">👥 追加メンバー依頼（新案件追加）</button>
  <button class="ev-choice cr-choice" data-cr="end" style="color:#e94560;opacity:0.8">✕ 契約満了（終了）</button>
</div></div></div>`;
  document.querySelectorAll('.cr-choice').forEach(btn=>{
    btn.onclick=()=>{
      const choice=btn.dataset.cr;
      const param={months:parseInt(btn.dataset.months||3),amount:parseInt(btn.dataset.amount||50000)};
      if(choice==='end'&&!confirm('本当に契約満了にしますか？'))return;
      const r=game.resolveContractExpiry(cas.id,choice,param);
      Sound.play(choice==='end'?'warn':'success');
      if(r.priceUp&&!r.success){
        const remaining=sum.contractReviews.slice(1);
        sum.contractReviews=remaining;
        alert(`❌ 単価UP交渉に失敗しました（成功率${r.rate}%）\n現行単価でどうしますか？`);
      } else {
        sum.contractReviews=sum.contractReviews.slice(1);
      }
      if(sum.contractReviews.length>0){
        document.getElementById("btn-contract-review")?.click()||this.render(game);
        this.render(game);
        document.getElementById("btn-contract-review")?.click();
      } else {
        this.render(game);
        if(s.pendingEvent){const ev2=document.getElementById("btn-show-event");if(ev2)setTimeout(()=>ev2.click(),50);}
      }
    };
  });
};},
evScreen(ev,game){const s=game.state,eng=ev.targetEngineer?s.engineers.find(e=>e.id===ev.targetEngineer?.id)||ev.targetEngineer:null,cas=ev.targetCase,desc=ev.getDesc(eng,cas),por=eng?`<div class="ev-portrait">${Portrait.generate({...eng,dissatisfaction:Math.min(100,(eng.dissatisfaction||0)+20)})}</div>`:"";
const choices=(ev.choices||[]).map((c,i)=>`<button class="ev-choice" data-choice="${i}">${c.text}</button>`).join("");
const out=s.eventOutcome?`<div class="ev-outcome">→ ${s.eventOutcome}</div><button id="btn-after-event" class="btn btn-success" style="margin-top:16px;width:100%">来月へ →</button>`:`<div class="ev-choices">${choices}</div>`;
return`<div class="event-screen"><div class="event-card ev-${ev.type}">${por}<div class="ev-title">${ev.title}</div><div class="ev-date">${s.year}年${this.m(s.month)} / ${s.companyName}</div><div class="ev-desc">${desc}</div>${out}</div></div>`;},
bEvScreen(game){const s=game.state;document.querySelectorAll("[data-choice]").forEach(btn=>{btn.onclick=()=>{Sound.play("click");game.resolveEventChoice(parseInt(btn.dataset.choice));const _evRes=game.state.pendingEvent?._lastResult;if(_evRes){setTimeout(()=>Sound.play(_evRes.success?"event_win":"event_lose"),200);}else{setTimeout(()=>Sound.play("success"),200);}document.getElementById("app").innerHTML=`<div class="event-screen"><div class="event-card ev-neutral"><div class="ev-title">結果</div><div class="ev-outcome">→ ${s.eventOutcome}</div><button id="btn-after-event" class="btn btn-success" style="margin-top:16px;width:100%">来月へ →</button></div></div>`;document.getElementById("btn-after-event").onclick=()=>{Sound.play("next");game.nextMonth();this.render(game);};};});const af=document.getElementById("btn-after-event");if(af)af.onclick=()=>{Sound.play("next");game.nextMonth();this.render(game);};},
end(game,victory){const s=game.state,months=(s.year-1)*12+s.month;
return`<div class="screen end-screen"><div class="end-icon">${victory?"🏆":"💀"}</div><div class="end-title">${victory?"年商1億達成！":"倒産..."}</div><div class="end-sub">${victory?`おめでとう！${s.companyName}が年商1億を突破しました。`:`${s.companyName}は資金ゼロで倒産しました。でもSESの仕組みは理解できた。`}</div><div class="end-stats"><div class="end-stat"><div class="esv">${months}ヶ月</div><div class="esl">プレイ期間</div></div><div class="end-stat"><div class="esv">¥${Math.round(s.totalRevenue/10000)}万</div><div class="esl">累計売上</div></div><div class="end-stat"><div class="esv">${s.engineers.length}名</div><div class="esl">採用総数</div></div></div><button id="btn-restart" class="btn btn-primary btn-xl" style="margin-top:24px">もう一度プレイ</button></div>`;},
bEnd(game){const sound=document.getElementById("btn-restart");if(sound){document.getElementById("btn-restart").onclick=()=>window.location.reload();setTimeout(()=>{const s=game.state;if(s.phase==="victory")Sound.play("victory");else Sound.play("defeat");},300);}},
};