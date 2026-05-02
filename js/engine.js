// ============================================================
// engine.js - ゲームロジック
// ============================================================

class SESGame {
  constructor() {
    this.state = {
      phase: 'title',
      month: 1, year: 1,
      money: 0,
      role: null, funding: null, location: null,
      companyName: 'SES会社',
      engineers: [],
      activeCases: [],
      availableCases: [],
      actionsRemaining: 0, actionsPerMonth: 0,
      monthlyRevenue: 0, monthlyExpenses: 0,
      totalRevenue: 0, targetRevenue: 100000000,
      cumulativeRevenue: 0,
      marketCondition: ['normal','boom','recession'][Math.floor(Math.random()*3)],
      hasDispatchLicense: false,
      licenseApplied: false,
      salesBoostThisMonth: 0,
      educationCostThisMonth: 0,
      brandPoints: 0,
      completedCasesCount: 0,
      snsPostsThisMonth: 0,
      pendingEvent: null,
      log: [],
      funding_constraint: null,
      bankRepayment: 0,
      vcQuarterlyTarget: 5000000,
      idCounter: 1,
      monthEndSummary: null,
      eventOutcome: null,
      seenEducation: new Set(),
      hiringChannel: null,
      hiringCandidates: [],
      // ─── 財務グラフ用履歴 ───
      finHistory: [],  // [{month, year, revenue, expenses, profit, headcount}]
    };
  }

  // ─── ID ───
  nextId() { return this.state.idCounter++; }

  // ─── NAMES ───
  randomName() {
    const s = JAPANESE_SURNAMES[Math.floor(Math.random()*JAPANESE_SURNAMES.length)];
    const f = JAPANESE_GIVEN[Math.floor(Math.random()*JAPANESE_GIVEN.length)];
    return s + ' ' + f;
  }

  // ─── START GAME ───
  startGame() {
    const st = this.state;
    const roleData = ROLES[st.role];
    const locData  = LOCATIONS[st.location];
    st.locationData = locData;
    st.actionsPerMonth   = roleData.actionsPerMonth;
    st.actionsRemaining  = roleData.actionsPerMonth;

    if (st.role === 'engineer-ceo') {
      st.money = roleData.startMoney;
    } else {
      const f = FUNDINGS[st.funding];
      st.money = f.amount;
      st.bankRepayment = f.monthlyDebt;
      st.funding_constraint = f.constraint;
    }

    // If engineer-ceo, add self as engineer
    if (st.role === 'engineer-ceo') {
      const self = {
        id: this.nextId(), name: '自分（経営者）', isSelf: true,
        type: 'senior', typeName: 'SE（兼経営者）', skill: 4,
        salary: roleData.selfSalary, billingRate: roleData.selfBilling,
        exp: 5, status: 'waiting', dissatisfaction: 0,
        traits: [], monthsWorked: 0,
        skillTags: ['Java', 'Spring', 'SQL']
      };
      st.engineers.push(self);
    }

    this.generateAvailableCases();

    // Auto-assign self engineer to best case at game start
    if (st.role === 'engineer-ceo') {
      const self = st.engineers.find(e => e.isSelf);
      if (self) {
        // Find best matching case (highest billing that they qualify for)
        const match = st.availableCases
          .filter(c => self.skill >= (c.requiredSkill??0))
          .sort((a, b) => b.billingCurrent - a.billingCurrent)[0];
        if (match) {
          self.status = 'working';
          match.assignedEngineerId = self.id;
          st.activeCases.push({ ...match, monthsLeft: match.dur });
          st.availableCases = st.availableCases.filter(c => c.id !== match.id);
          this.addLog('good', `自分（${self.typeName}）を「${match.desc}」に自動アサインしました。`);
        }
      }
    }

    st.phase = 'game';
    this.addLog('neutral', `${st.companyName}を設立しました。${LOCATIONS[st.location].name}からスタート。`);
  }

  // ─── 技術力計算 ───
  getTechPower() {
    const st = this.state;
    return st.engineers
      .filter(e => e.status !== 'gone')
      .reduce((sum, e) => sum + (e.skill || 0), 0);
  }

  // ─── 信用力計算 ───
  getCredibility() {
    const st = this.state;
    const loc = LOCATIONS[st.location] || {};
    const locBase = (loc.trust || 1) * 5;                       // 立地信頼度×5
    const caseBase = Math.min(40, (st.completedCasesCount||0) * 4); // 案件完了×4 (max40)
    const brandBase = Math.min(30, Math.floor((st.brandPoints||0) / 3)); // ブランド(max30)
    const licenseBonus = st.hasDispatchLicense ? 10 : 0;
    return Math.min(100, locBase + caseBase + brandBase + licenseBonus);
  }

  // ─── クラウドソーシング ───
  doCloudWork() {
    const st = this.state;
    if (st.actionsRemaining <= 0) return {ok:false, msg:'\u30a2\u30af\u30b7\u30e7\u30f3\u304c\u4e0d\u8db3'};
    st.actionsRemaining--;
    const tech = this.getTechPower();
    // 技術力が高いほど成功しやすい 30〝75%
    const successChance = 0.30 + Math.min(0.45, tech * 0.05);
    const success = Math.random() < successChance;
    const tasks = [
      '\u30e9\u30f3\u30b5\u30fc\u30ba\u98a8LP\u5236\u4f5c', '\u30b3\u30b3\u30ca\u30e9\u98a8\u30b7\u30b9\u30c6\u30e0\u8a2d\u8a08',
      '\u30af\u30e9\u30a6\u30c9\u30ef\u30fc\u30af\u98a8\u30c7\u30fc\u30bf\u5206\u6790', '\u30b3\u30fc\u30c9\u30ef\u30fc\u30af\u98a8\u30a2\u30d7\u30ea\u958b\u767a',
      '\u30e9\u30f3\u30b5\u30fc\u30ba\u98a8API\u9023\u643a', '\u30b3\u30b3\u30ca\u30e9\u98a8\u30b3\u30fc\u30c9\u30ec\u30d3\u30e5\u30fc'
    ];
    const task = tasks[Math.floor(Math.random()*tasks.length)];
    if (success) {
      const baseEarn = 30000 + tech * 8000;
      const earn = Math.floor(baseEarn * (0.7 + Math.random() * 0.6));
      st.money += earn;
      st.cumulativeRevenue = (st.cumulativeRevenue||0) + earn;
      this.addLog('good', `\ud83d\udcbb ${task}\u6848\u4ef6\u6210\u529f\uff01+${Math.round(earn/10000)}\u4e07\u5186`);
      return {ok:true, success:true, earn};
    } else {
      // 失\u6557: \u30af\u30e9\u30a4\u30a2\u30f3\u30c8\u4e0d\u6210\u7acb\u3001\u308f\u305a\u304b\u306a\u8fd4\u91d1
      const consolation = Math.floor(5000 + Math.random() * 10000);
      st.money += consolation;
      this.addLog('neutral', `\ud83d\udcbb ${task}\u2026\u30af\u30e9\u30a4\u30a2\u30f3\u30c8\u4e0d\u6210\u7acb\u3002\u6280\u8853\u529b\u4e0d\u8db3\u304b\u3082\u3002\u7279\u5225\u5831\u916c+${Math.round(consolation/1000)}\u5343\u5186`);
      return {ok:true, success:false, earn:consolation};
    }
  }

  // ─── SNS投稿 ───
  doSNSPost() {
    const st = this.state;
    if (st.actionsRemaining <= 0) return {ok:false, msg:'\u30a2\u30af\u30b7\u30e7\u30f3\u304c\u4e0d\u8db3\u3057\u3066\u3044\u307e\u3059'};
    if ((st.snsPostsThisMonth||0) >= 2) return {ok:false, msg:'\u4eca\u6708\u306eSNS\u6295\u7a3f\u306f2\u56de\u307e\u3067\u3067\u3059'};
    st.actionsRemaining--;
    st.snsPostsThisMonth = (st.snsPostsThisMonth||0) + 1;
    const bp = 8 + Math.floor(Math.random()*7);
    st.brandPoints = Math.min(100, (st.brandPoints||0) + bp);
    const posts = [
      '\u30dd\u30b9\u30c8X\u306b\u6280\u8853\u30c4\u30a4\u30fc\u30c8', '\u30ad\u30fc\u30bf\u306b\u8a18\u4e8b\u6295\u7a3f',
      '\u30ea\u30f3\u30af\u30c9\u30a4\u30f3\u3067\u5b9f\u7e3e\u3092\u30a2\u30d4\u30fc\u30eb', '\u30c7\u30d6\u30bc\u30f3\u306b\u30a2\u30fc\u30ad\u8a18\u4e8b\u6295\u7a3f',
      'N\u00f8te\u3067\u5c40\u671f\u52d9\u516c\u958b', '\u30c6\u30c3\u30af\u30c1\u30e5\u30fc\u30d6\u306b\u52d5\u753b\u6295\u7a3f'
    ];
    const p = posts[Math.floor(Math.random()*posts.length)];
    this.addLog('good', `\ud83d\udce3 ${p}\uff01\u30d6\u30e9\u30f3\u30c9+${bp}pt \u30fb \u8a8d\u77e5\u5ea6UP`);
    return {ok:true, bp, brandPoints: st.brandPoints};
  }

  // ─── ブログ投稿 ───
  doBlogPost() {
    const st = this.state;
    if (st.actionsRemaining <= 0) return {ok:false, msg:'\u30a2\u30af\u30b7\u30e7\u30f3\u304c\u4e0d\u8db3\u3057\u3066\u3044\u307e\u3059'};
    st.actionsRemaining--;
    const tech = this.getTechPower();
    const bp = 15 + Math.floor(tech * 0.5) + Math.floor(Math.random()*10);
    st.brandPoints = Math.min(100, (st.brandPoints||0) + bp);
    // 高技術力ならインバウンド引き寄せ効果
    let inboundBonus = false;
    if (tech >= 6 && Math.random() < 0.4) {
      st.salesBoostThisMonth = (st.salesBoostThisMonth||0) + 1;
      inboundBonus = true;
    }
    this.addLog('good', `\u270d\ufe0f \u6280\u8853\u30d6\u30ed\u30b0\u3092\u516c\u958b\uff01\u30d6\u30e9\u30f3\u30c9+${bp}pt${inboundBonus?' (\u6848\u4ef6\u5f15\u304d\u5bc4\u305b\u52b9\u679c\uff01)':''}`);
    return {ok:true, bp, brandPoints: st.brandPoints, inboundBonus};
  }

  // ─── 業界交流会（営業力+信用力UP）───
  doNetworkEvent() {
    const st = this.state;
    if (st.actionsRemaining <= 0) return {ok:false, msg:'\u30a2\u30af\u30b7\u30e7\u30f3\u304c\u4e0d\u8db3'};
    const cost = 50000;
    if (st.money < cost) return {ok:false, msg:'\u8cc7\u91d1\u4e0d\u8db3\uff085\u4e07\u5186\u5fc5\u8981\uff09'};
    st.actionsRemaining--;
    st.money -= cost;
    const cred = this.getCredibility();
    const successChance = 0.45 + Math.min(0.35, cred * 0.004);
    const success = Math.random() < successChance;
    const events = ['SES\u696d\u754c\u306e\u98f2\u307f\u4f1a','IT\u30a8\u30f3\u30b8\u30cb\u30a2\u4ea4\u6d41\u4f1a','\u30c6\u30c3\u30af\u30df\u30fc\u30c8\u30a2\u30c3\u30d7','\u696d\u754c\u52d5\u5411\u52c9\u5f37\u4f1a','\u30cd\u30c3\u30c8\u30ef\u30fc\u30af\u30a4\u30d9\u30f3\u30c8'];
    const ev = events[Math.floor(Math.random()*events.length)];
    if (success) {
      // 営業力: 今月のsalesBoostを+1（案件発見数増加）
      st.salesBoostThisMonth = (st.salesBoostThisMonth||0) + 1;
      // 信用力: 恒久的にcredibilityをUP
      const credGain = 4 + Math.floor(Math.random()*8);
      st.credibility = Math.min(100, (st.credibility||0) + credGain);
      let inbound = false;
      if (Math.random() < 0.3) { st.salesBoostThisMonth++; inbound = true; }
      this.addLog('good', `\ud83e\udd1d ${ev}\u3067\u826f\u3044\u4eba\u8108\u3092\u5f97\u305f\uff01\u55b6\u696d\u529bUP \u4fe1\u7528\u529b+${credGain}pt${inbound?' \ud83d\udce8 \u6848\u4ef6\u5f15\u304d\u5bc4\u305b':''}`);
      return {ok:true, success:true, credGain, inbound, cost, event:ev};
    } else {
      this.addLog('neutral', `\ud83c\udf7a ${ev}\u53c2\u52a0\u3002\u76ee\u7acb\u3063\u305f\u6210\u679c\u306a\u3057\u3002\u30b3\u30b9\u30c85\u4e07\u304b\u304b\u3063\u305f\u3002`);
      return {ok:true, success:false, cost, event:ev};
    }
  }

  // ─── 展示会/名刺交換会（営業力UP）───
  doExhibition() {
    const st = this.state;
    if (st.actionsRemaining <= 0) return {ok:false, msg:'\u30a2\u30af\u30b7\u30e7\u30f3\u304c\u4e0d\u8db3'};
    const cost = 30000;
    if (st.money < cost) return {ok:false, msg:'\u8cc7\u91d1\u4e0d\u8db3\uff083\u4e07\u5186\u5fc5\u8981\uff09'};
    st.actionsRemaining--;
    st.money -= cost;
    const successChance = 0.55 + Math.min(0.25, (st.brandPoints||0)*0.003);
    const success = Math.random() < successChance;
    if (success) {
      // 営業力: 今月+1〜2ブースト
      const salesBoost = Math.random() < 0.4 ? 2 : 1;
      st.salesBoostThisMonth = (st.salesBoostThisMonth||0) + salesBoost;
      // ブランドPtも少し
      const bpGain = 5 + Math.floor(Math.random()*8);
      st.brandPoints = Math.min(100, (st.brandPoints||0) + bpGain);
      this.addLog('good', `\ud83d\udcbc \u5c55\u793a\u4f1a\u6210\u529f\uff01\u55b6\u696d\u529b+${salesBoost} \u30d6\u30e9\u30f3\u30c9+${bpGain}pt`);
      return {ok:true, success:true, salesBoost, bpGain, cost};
    } else {
      const bpGain = 2 + Math.floor(Math.random()*4);
      st.brandPoints = Math.min(100, (st.brandPoints||0) + bpGain);
      this.addLog('neutral', `\ud83d\udcbc \u5c55\u793a\u4f1a\u53c2\u52a0\u3002\u30d6\u30e9\u30f3\u30c9+${bpGain}pt\uff08\u55b6\u696d\u6210\u679c\u306a\u3057\uff09`);
      return {ok:true, success:false, bpGain, cost};
    }
  }

  // ─── 営業力計算 ───
  getSalesPower() {
    const st = this.state;
    const roleBase = { 'engineer-ceo': 1, 'ceo': 4 }[st.role] ?? 2;
    // 営業担当エンジニアのボーナス
    const salesBonus = st.engineers
      .filter(e => e.status !== 'gone' && (e.traits||[]).includes('sales-power'))
      .reduce((sum, e) => sum + (e.salesBonus || 2), 0);
    // 立地ボーナス
    const loc = LOCATIONS[st.location] || {};
    const locBonus = loc.trust >= 4 ? 1 : 0;
    // 当月の営業活動ブースト
    const boost = st.salesBoostThisMonth || 0;
    return Math.max(1, roleBase + salesBonus + locBonus + boost);
  }

  generateAvailableCases() {
    const st = this.state;
    const loc = LOCATIONS[st.location];
    const sales = this.getSalesPower();
    // 案件数 = 営業力 + ランダム揺れ ±1
    const count = Math.max(1, sales + (Math.random() < 0.5 ? 1 : 0));
    const newCases = [];

    // 技術力によるインバウンドオファー（クライアントからの依頼）
    const tech = this.getTechPower();
    if (tech >= 5) {
      const inboundChance = Math.min(0.9, tech * 0.06); // 5→30%, 10→60%, 15→90%
      if (Math.random() < inboundChance) {
        // 技術力が高いほど良い案件（primary以上）
        const inboundPool = CASE_TEMPLATES.filter(t =>
          (tech >= 12 ? t.type === 'direct' : t.type === 'primary' || t.type === 'direct')
          && t.contractType !== 'disguised'
          && (!loc || loc.trust >= (t.type === 'direct' ? 4 : 2))
        );
        if (inboundPool.length > 0) {
          const tpl = inboundPool[Math.floor(Math.random() * inboundPool.length)];
          newCases.push({
            id: this.nextId(), ...tpl,
            status: 'available', monthsLeft: tpl.dur,
            assignedEngineerId: null, billingCurrent: tpl.billing,
            riskFlag: false, isInbound: true
          });
          this.addLog('good', `📨 技術力が評価されました！「${tpl.client}」から直接依頼が届きました。`);
        }
      }
    }

    for (let i=0; i<count; i++) {
      const salesPow = this.getSalesPower();
      const eligible = CASE_TEMPLATES.filter(t => {
        if (t.type==='direct'  && loc.trust < 4) return false;
        if (t.type==='primary' && loc.trust < 2) return false;
        if (t.contractType==='dispatch' && loc.trust < 3) return false;
        // ─── 営業力で案件単価をフィルタ ───
        const b = t.billing || 0;
        if (b >= 950000) { // 95万以上: 営業6+必要
          if (salesPow < 6 && Math.random() > salesPow * 0.09) return false;
        } else if (b >= 700000) { // 70万以上: 営業3+推奨
          if (salesPow < 3 && Math.random() > salesPow * 0.28) return false;
        } else if (b >= 500000) { // 50万以上: 営業2+推奨
          if (salesPow < 2 && Math.random() > 0.38) return false;
        }
        return Math.random() < loc.caseRate;
      });
      if (!eligible.length) continue;
      const tpl = eligible[Math.floor(Math.random()*eligible.length)];
      newCases.push({
        id: this.nextId(),
        ...tpl,
        status: 'available',
        monthsLeft: tpl.dur,
        assignedEngineerId: null,
        billingCurrent: tpl.billing,
        riskFlag: false
      });
    }
    st.availableCases = newCases;
  }

  // 営業活動アクション（成功/失敗あり）
  doSalesActivity() {
    const st = this.state;
    if (st.actionsRemaining <= 0) return {ok:false, msg:'\u30a2\u30af\u30b7\u30e7\u30f3\u304c\u4e0d\u8db3'};
    st.actionsRemaining--;
    const sales = this.getSalesPower();
    // 営業力が高いほど成功しやすい 50〝85%
    const successChance = 0.50 + Math.min(0.35, (sales - 1) * 0.05);
    const success = Math.random() < successChance;
    if (success) {
      const boostAmount = Math.random() < 0.3 ? 3 : 2;
      st.salesBoostThisMonth = (st.salesBoostThisMonth || 0) + boostAmount;
      this.generateAvailableCases();
      this.addLog('good', `\ud83d\udce3 \u55b6\u696d\u6210\u529f\uff01\u4eca\u6708\u306e\u6848\u4ef6+${boostAmount}\uff08\u55b6\u696d\u529b: ${this.getSalesPower()}\uff09`);
      return {ok:true, success:true, salesPower: this.getSalesPower()};
    } else {
      // 失敗: アポがおれた/歋切れ/タイミング悪い
      const excuses = ['\u5148\u65b9\u306e\u30bf\u30a4ミングが合わず', '資料準備が足りなかった', 'アポが上手くいかなかった', '競合他社に先を越された'];
      const ex = excuses[Math.floor(Math.random()*excuses.length)];
      this.generateAvailableCases();
      this.addLog('neutral', `\ud83d\udce3 \u55b6\u696d\u6d3b\u52d5\u5b9f\u65bd\u3002${ex}\u3002\u6848\u4ef6\u306f通常通り。`);
      return {ok:true, success:false, salesPower: this.getSalesPower()};
    }
  }

  // ─── 技術研修アクション（成功/失敗あり）───
  doTechTraining() {
    const st = this.state;
    if (st.actionsRemaining <= 0) return {ok:false, msg:'\u30a2\u30af\u30b7\u30e7\u30f3\u304c\u4e0d\u8db3'};
    const cost = 300000;
    if (st.money < cost) return {ok:false, msg:'\u8cc7\u91d1\u4e0d\u8db3\uff0830\u4e07\u5186\u5fc5\u8981\uff09'};
    const targets = st.engineers.filter(e => e.status !== 'gone' && !e.isSelf);
    if (targets.length === 0) return {ok:false, msg:'\u7814\u4fee\u5bfe\u8c61\u306e\u30a8\u30f3\u30b8\u30cb\u30a2\u304c\u3044\u307e\u305b\u3093'};
    st.money -= cost;
    st.actionsRemaining--;
    // 技術力が低いほど研修が有効だが、露骨なエンジニアは不満を持ちやすい
    const tech = this.getTechPower();
    const successChance = 0.60 + Math.min(0.30, (5 - Math.min(5, tech * 0.3)) * 0.06);
    const success = Math.random() < successChance;
    const levelUps = [];
    if (success) {
      targets.forEach(e => {
        const pt = e.status === 'waiting' ? 28 : 12;
        e.trainingProgress = (e.trainingProgress || 0) + pt;
        if (e.trainingProgress >= 100) {
          e.trainingProgress -= 100;
          e.skill = Math.min(5, (e.skill || 0) + 1);
          const up = {1:['\u30c6\u30b9\u30c8','SQL'],2:['Java','Git'],3:['Spring','AWS'],4:['Docker','Terraform']}[e.skill]||[];
          up.forEach(t => { if (!(e.skillTags||[]).includes(t))(e.skillTags=e.skillTags||[]).push(t); });
          levelUps.push(e);
          this.addLog('good', `\ud83c\udf93 ${e.name}\u306e\u30b9\u30ad\u30ebLv${e.skill}\u306b\u30a2\u30c3\u30d7\uff01`);
        }
      });
      this.addLog('good', `\ud83d\udd2c \u6280\u8853\u7814\u4fee\u6210\u529f\uff01\u5168${targets.length}\u540d\u306b\u30b9\u30ad\u30eb\u30dd\u30a4\u30f3\u30c8\u4ed8\u4e0e\u3002`);
      return {ok:true, success:true, levelUps};
    } else {
      // 失敗: エンジニアが興味を持たず/内容が適切でなかった
      targets.forEach(e => {
        e.trainingProgress = (e.trainingProgress || 0) + 5; // 少しだけ踏み出し
      });
      this.addLog('neutral', `\ud83d\udd2c \u7814\u4fee\u5b9f\u65bd\u304c\u30a8\u30f3\u30b8\u30cb\u30a2\u306e\u53cd\u5fdc\u8584\u3080\u2026\u8ca0\u60f3\u304c\u5de6\u53f3\u3057\u305f\u304b\u3002\u6210\u679c\u306f\u6b21\u56de\u4ee5\u964d\u306b\u671f\u5f85\u3002`);
      return {ok:true, success:false, levelUps:[]};
    }
  }
  // ─── 育成アクション ───
  trainEngineer(engineerId) {
    const st = this.state;
    const eng = st.engineers.find(e => e.id === engineerId);
    if (!eng) return {ok:false, msg:'エンジニアが見つかりません'};
    if (eng.status === 'gone') return {ok:false, msg:'退職済みです'};
    if (eng.skill >= 3) return {ok:false, msg:'このエンジニアはすでに中級以上です（育成不要）'};
    if (st.actionsRemaining <= 0) return {ok:false, msg:'アクションが不足しています'};
    const cost = 50000; // 5万円/回
    if (st.money < cost) return {ok:false, msg:'資金不足（教育費 5万円必要）'};
    st.money -= cost;
    st.actionsRemaining--;
    st.educationCostThisMonth = (st.educationCostThisMonth || 0) + cost;
    eng.trainingProgress = (eng.trainingProgress || 0) + 20; // +20pt
    let leveled = false;
    if (eng.trainingProgress >= 100) {
      eng.trainingProgress -= 100;
      eng.skill = Math.min(5, (eng.skill || 0) + 1);
      // スキルアップに伴いskillTagsを強化
      const upgradeTags = { 1: ['テスト','SQL'], 2: ['Java','Git'], 3: ['Spring','AWS'] };
      const newTags = upgradeTags[eng.skill] || [];
      newTags.forEach(t => { if (!(eng.skillTags||[]).includes(t)) (eng.skillTags = eng.skillTags||[]).push(t); });
      leveled = true;
      this.addLog('good', `🎓 ${eng.name}のスキルがLv${eng.skill}にアップ！`);
    } else {
      this.addLog('neutral', `📚 ${eng.name}を育成中（${eng.trainingProgress}/100pt）。教育費 5万。`);
    }
    return {ok:true, leveled, progress: eng.trainingProgress, skill: eng.skill};
  }


  generateCandidates(channelId) {
    const ch = HIRING_CHANNELS.find(c=>c.id===channelId);
    if (!ch) return;
    const count = 2 + Math.floor(Math.random()*3);
    const st = this.state;
    const bp = st.brandPoints || 0;

    // ダイレクトスカウト・X採用はブランド力で候補者数が変動
    let actualCount;
    if (ch.id === 'direct') {
      if (bp < 15) {
        actualCount = 0;
        this.addLog('bad', `📵 ダイレクトスカウト：ブランド力が低すぎて誰も見てくれません（必要: ブランド15pt以上）`);
      } else if (bp < 35) { actualCount = 1; }
      else if (bp < 65) { actualCount = 2; }
      else { actualCount = 2 + Math.floor(Math.random()*2); }
    } else if (ch.id === 'x_sns') {
      if (bp < 10) {
        actualCount = Math.random() < 0.3 ? 1 : 0;
        if (actualCount === 0) this.addLog('bad', `📵 X採用：フォロワーが少なく反応なし（SNS投稿でブランド力を上げましょう）`);
      } else {
        actualCount = 1 + Math.floor((bp / 100) * 3);
      }
    } else {
      actualCount = count;
    }

    // Collect skill tags needed by available cases
    const neededTags = new Set();
    const neededSkills = new Set();
    st.availableCases.forEach(c => {
      (c.requiredTags||[]).forEach(t => neededTags.add(t));
      neededSkills.add(c.requiredSkill||0);
    });

    // Build pools
    const allPool = ENGINEER_TEMPLATES.filter(t => t.skill <= ch.quality + 1);
    const matchPool = allPool.filter(t =>
      (t.skillTags||[]).some(tag => neededTags.has(tag)) ||
      neededSkills.has(t.skill)
    );
    const workPool = allPool.length > 0 ? allPool : ENGINEER_TEMPLATES;
    const mPool = matchPool.length > 0 ? matchPool : workPool;

    // Match probability by channel quality: 0→15%, 1→25%, 2→35%, 3→60%, 4→75%, 5→92%
    // 有料チャンネル(quality>=3)且つ案件ありの場合、スキルマッチ確率を強化
    const baseMatchBias = [0.15, 0.25, 0.35, 0.60, 0.75, 0.92][Math.min(ch.quality, 5)];
    const matchBias = (ch.quality >= 3 && neededTags.size > 0 && matchPool.length > 0)
      ? Math.min(0.95, baseMatchBias + 0.22)
      : baseMatchBias;

    // Build candidate list with match bias
    const selected = [];
    const usedTypes = new Set();
    for (let i = 0; i < actualCount * 5 && selected.length < actualCount; i++) {
      const useMatch = Math.random() < matchBias;
      const pool = useMatch ? mPool : workPool;
      const tpl = pool[Math.floor(Math.random() * pool.length)];
      if (!usedTypes.has(tpl.type) || selected.length < 2) {
        selected.push(tpl);
        usedTypes.add(tpl.type);
      }
    }
    // actualCount=0（ブランド力不足）の場合は候補者なし
    if (actualCount > 0 && selected.length === 0) selected.push(workPool[0] || ENGINEER_TEMPLATES[0]);

    const makeCandidate = tpl => {
      const salary = tpl.salaryBase + Math.floor((Math.random()-0.5)*40000);
      const age = (tpl.ageBase||28) + Math.floor((Math.random()-0.5)*4);
      const pool = tpl.personalityPool || ['easygoing','cautious','optimistic'];
      const personality = pool[Math.floor(Math.random()*pool.length)];
      return {
        id: this.nextId(), ...tpl,
        name: this.randomName(),
        salary, age, personality,
        salaryAsk: salary,
        salaryMin: Math.floor(salary*0.85),
        billingRate: tpl.billingBase + Math.floor((Math.random()-0.5)*50000),
        status: 'waiting',
        dissatisfaction: Math.floor(Math.random()*20),
        stress: 0,
        negotiationResult: null,
        monthsWorked: 0, isSelf: false
      };
    };
    this.state.hiringCandidates = selected.map(makeCandidate);
    this.state.hiringChannel = channelId;
  }

  // offerType: 'full'(希望額) / 'negotiate'(-15%) / 'lowball'(-30%)
  negotiateHire(candidateId, offerType) {
    const st = this.state;
    const candidate = st.hiringCandidates.find(c=>c.id===candidateId);
    if (!candidate) return {ok:false, reason:'not_found'};
    const ch = HIRING_CHANNELS.find(c=>c.id===st.hiringChannel);
    if (!ch) return {ok:false, reason:'no_channel'};
    if (st.money < ch.cost) return {ok:false, reason:'no_money'};
    const mul = offerType==='full' ? 1.0 : offerType==='negotiate' ? 0.85 : 0.70;
    const offered = Math.round(candidate.salaryAsk * mul);
    if (offered < candidate.salaryMin) return {ok:false, reason:'too_low', minSalary: candidate.salaryMin};
    // 交渉結果の確率判定
    const acceptRate = offerType==='full' ? 1.0 : offerType==='negotiate' ? 0.80 : 0.40;
    if (Math.random() > acceptRate) return {ok:false, reason:'refused'};
    // 採用確定
    const dissBonus = offerType==='full' ? 0 : offerType==='negotiate' ? 15 : 35;
    st.money -= ch.cost;
    const hired = {...candidate, salary: offered, dissatisfaction: (candidate.dissatisfaction||0)+dissBonus};
    st.engineers.push(hired);
    st.actionsRemaining--;
    this.addLog('good', `${hired.name}（${hired.typeName}）採用。月給¥${fmt(hired.salary)}${offerType!=='full'?'（交渉成立）':''}`);
    this.checkEducation('first_hire');
    return {ok:true, hired};
  }
  hireEngineer(candidateId) {
    const r = this.negotiateHire(candidateId, 'full');
    return r.ok;
  }

  // ─── ASSIGN CASE ───
  acquireDispatchLicense() {
    const st = this.state;
    if (st.hasDispatchLicense) return {ok:false, msg:'すでに派遣業許可を取得しています'};
    const loc = LOCATIONS[st.location] || {};
    const nonSelfEngineers = st.engineers.filter(e => e.status !== 'gone' && !e.isSelf);
    const conditions = [
      { label:'手元資金200万以上', met: st.money >= 2000000 },
      { label:'エンジニア1名以上在籍', met: nonSelfEngineers.length >= 1 },
      { label:'事務所（在宅・バーチャル不可）', met: !!loc.licenseOk },
    ];
    const unmet = conditions.filter(c => !c.met);
    if (unmet.length > 0) {
      return {ok:false, conditions, unmet, msg:'申請条件を満たしていません'};
    }
    if (st.actionsRemaining <= 0) return {ok:false, msg:'アクションが不足しています'};
    const cost = 500000;
    if (st.money < cost) return {ok:false, msg:'資金不足（申請費用 50万円必要）'};
    st.money -= cost;
    st.actionsRemaining--;
    st.licenseApplied = true;
    this.addLog('neutral', '派遣業許可を申請しました（来月交付予定）。申請費 50万。');
    return {ok:true, granted:false, conditions};
  }

  getLicenseConditions() {
    const st = this.state;
    const loc = LOCATIONS[st.location] || {};
    const nonSelfEngineers = st.engineers.filter(e => e.status !== 'gone' && !e.isSelf);
    return [
      { label:'手元資金200万以上', met: st.money >= 2000000, current: `現在 ${Math.round(st.money/10000)}万` },
      { label:'エンジニア1名以上在籍', met: nonSelfEngineers.length >= 1, current: `現在 ${nonSelfEngineers.length}名` },
      { label:'事務所（在宅・バーチャル不可）', met: !!loc.licenseOk, current: loc.name || '' },
    ];
  }

  relocate(locationId) {
    const st = this.state;
    const target = LOCATIONS[locationId];
    if (!target) return {ok:false, msg:'不明な拠点です'};
    if (locationId === st.location) return {ok:false, msg:'現在地と同じ拠点です'};
    if (st.actionsRemaining <= 0) return {ok:false, msg:'アクションが不足しています'};
    const cost = target.moveCost || 0;
    if (st.money < cost) return {ok:false, msg:`資金不足（移転費用 ${Math.round(cost/10000)}万円必要）`};
    st.money -= cost;
    st.actionsRemaining--;
    const oldLoc = LOCATIONS[st.location]?.name || st.location;
    st.location = locationId;
    // If moving away from licenseOk location, suspend license application
    if (st.licenseApplied && !target.licenseOk) {
      st.licenseApplied = false;
      st.money += 500000; // refund application fee
      this.addLog('bad', '⚠ 申請中の派遣業許可が取り消されました（事務所要件不足）。申請費を返金。');
    }
    this.addLog('good', `拠点を「${oldLoc}」→「${target.name}」に移転しました。移転費 ${Math.round(cost/10000)}万。`);
    // Regenerate cases based on new location
    this.generateAvailableCases();
    return {ok:true, target};
  }


  assignCase(caseId, engineerId) {
    const st = this.state;
    const cas = st.availableCases.find(c=>c.id===caseId);
    const eng = st.engineers.find(e=>e.id===engineerId);
    if (!cas || !eng) return false;
    if (eng.status === 'working') return false;
    // 営業担当は案件にアサインできない（営業専門職）
    if (['sales_rep','senior_sales'].includes(eng.type)) return 'sales_role';

    // スキル差による確率アサイン（ハードブロックでなく確率）
    const skillDiff = (cas.requiredSkill || 1) - (eng.skill || 0);
    const skillPass = skillDiff <= 0 ? 1.0
      : skillDiff === 1 ? 0.65
      : skillDiff === 2 ? 0.35
      : 0.15;
    if (Math.random() > skillPass) {
      this.addLog('bad', `「${cas.client}」に${eng.name}を提案しましたがスキル不足で試験落ち。（必要Lv${cas.requiredSkill||1} → 現在Lv${eng.skill||0}）`);
      return 'skill_rejected';
    }
    // 案件先信頼度チェック
    const trust = cas.clientTrust || 3;
    const trustPass = trust >= 4 ? 1.0 : trust === 3 ? 0.80 : trust === 2 ? 0.55 : 0.30;
    if (Math.random() > trustPass) {
      this.addLog('bad', `「${cas.client}」から書類審査で見送りの連絡。（信頼度${trust}/5）`);
      return 'trust_rejected';
    }

    cas.assignedEngineerId = engineerId;
    cas.status = 'active';
    eng.status = 'working';
    st.availableCases = st.availableCases.filter(c=>c.id!==caseId);
    st.activeCases.push(cas);
    st.actionsRemaining--;

    // 信頼度の高いクライアントの案件を受注すると会社の信頼力UP
    if (trust >= 5) {
      st.brandPoints = Math.min(100, (st.brandPoints||0) + 10);
      this.addLog('good', `🌟 信頼度MAX「${cas.client}」から受注！会社の信用力+10pt`);
    } else if (trust >= 4) {
      st.brandPoints = Math.min(100, (st.brandPoints||0) + 5);
      this.addLog('good', `⭐ 高信頼クライアント「${cas.client}」から受注！信用力+5pt`);
    } else {
      this.addLog('good', `${eng.name}を「${cas.client}」にアサインしました。月額¥${fmt(cas.billingCurrent)}。`);
    }
    this.checkEducation('first_case');
    if (cas.type==='tertiary') this.checkEducation('tertiary_warning');
    return true;
  }

  // オファーを断る（信頼度の高い案件を断ると信用力DOWN）
  declineCase(caseId) {
    const st = this.state;
    const cas = st.availableCases.find(c=>c.id===caseId);
    if (!cas) return;
    const trust = cas.clientTrust || 3;
    st.availableCases = st.availableCases.filter(c=>c.id!==caseId);
    if (trust >= 5) {
      const penalty = 12;
      st.brandPoints = Math.max(0, (st.brandPoints||0) - penalty);
      this.addLog('bad', `😰 信頼度MAX「${cas.client}」のオファーを断りました。信用力-${penalty}pt。業界での評判が下がっています。`);
    } else if (trust >= 4) {
      const penalty = 7;
      st.brandPoints = Math.max(0, (st.brandPoints||0) - penalty);
      this.addLog('bad', `😟 高信頼「${cas.client}」のオファーを断りました。信用力-${penalty}pt。`);
    } else {
      this.addLog('neutral', `「${cas.client}」のオファーを断りました。`);
    }
  }

  // ─── 退プロ（稼働中に途中撤退）───
  leaveProject(caseId) {
    const st = this.state;
    const cas = st.activeCases.find(c => c.id === caseId);
    if (!cas) return { ok: false };
    const eng = st.engineers.find(e => e.id === cas.assignedEngineerId);
    const trust = cas.clientTrust || 3;
    // クライアント信頼度を大幅に低下（最低1）
    const trustLoss = trust >= 5 ? 3 : trust >= 4 ? 2 : 1;
    cas.clientTrust = Math.max(1, trust - trustLoss);
    // 会社の信用力（brandPoints）を大幅に低下
    const brandLoss = trust >= 4 ? 25 : 15;
    st.brandPoints = Math.max(0, (st.brandPoints || 0) - brandLoss);
    // エンジニアを待機に戻す
    if (eng) { eng.status = 'waiting'; eng.monthsWorked = 0; }
    // 案件を削除
    st.activeCases = st.activeCases.filter(c => c.id !== caseId);
    this.addLog('bad', `🚨 「${cas.client}」から退プロ。信頼度${trust}→${cas.clientTrust}、信用力-${brandLoss}pt。業界ネットワークでの評判が大幅低下。`);
    return { ok: true, trustLoss, brandLoss, newTrust: cas.clientTrust };
  }


  endMonth() {
    const st = this.state;
    let revenue = 0, expenses = 0;

    // Revenue from active cases
    st.activeCases.forEach(c => {
      revenue += c.billingCurrent;
      c.monthsLeft--;
    });

    // Engineer-CEO self billing
    if (st.role === 'engineer-ceo') {
      const self = st.engineers.find(e=>e.isSelf&&e.status==='working');
      if (self) revenue += self.billingRate;
    }

    // Expenses: salaries (all engineers, regardless of working status)
    let totalSalary = 0;
    st.engineers.filter(e=>e.status!=='gone').forEach(e => {
      if (!e.isSelf) totalSalary += e.salary;
    });
    expenses += totalSalary;

    // Office rent
    const rent = LOCATIONS[st.location].rent;
    expenses += rent;

    // Bank repayment
    if (st.bankRepayment > 0) expenses += st.bankRepayment;

    // Education cost (manual training actions this month)
    const eduCost = st.educationCostThisMonth || 0;
    // (Already deducted from st.money via action; track in expenses for P&L display)
    expenses += 0; // eduCost already deducted; just track it in summary

    // Social insurance (~15%)
    const socialIns = Math.floor(totalSalary * 0.15);
    expenses += socialIns;

    const profit = revenue - expenses;
    st.money += profit;
    st.totalRevenue += revenue;
    st.cumulativeRevenue = (st.cumulativeRevenue||0) + revenue;
    st.monthlyRevenue = revenue;
    st.monthlyExpenses = expenses + eduCost; // show edu cost in summary

    // Auto-training: skill<3 engineers gain +5pt/month passively
    let levelUps = [];
    st.engineers.filter(e => e.status !== 'gone' && !e.isSelf && (e.skill||0) < 3).forEach(e => {
      e.trainingProgress = (e.trainingProgress || 0) + 5;
      if (e.trainingProgress >= 100) {
        e.trainingProgress -= 100;
        e.skill = Math.min(5, (e.skill||0) + 1);
        const upgradeTags = { 1: ['\u30c6\u30b9\u30c8','SQL'], 2: ['Java','Git'], 3: ['Spring','AWS'] };
        (upgradeTags[e.skill]||[]).forEach(t => { if (!(e.skillTags||[]).includes(t)) (e.skillTags=e.skillTags||[]).push(t); });
        levelUps.push(e.name);
        this.addLog('good', `\ud83c\udf93 ${e.name}\u306e\u30b9\u30ad\u30eb\u304cLv${e.skill}\u306b\u30a2\u30c3\u30d7\uff01\uff08\u5b9f\u52d9\u7d4c\u9a13\u306b\u3088\u308b\u6210\u9577\uff09`);
      }
    });

    // Reset monthly trackers
    st.salesBoostThisMonth = 0;
    st.educationCostThisMonth = 0;
    st.snsPostsThisMonth = 0;

    // ─── 財務履歴を記録（グラフ用）───
    const headcount = st.engineers.filter(e=>e.status!=='gone').length;
    st.finHistory = st.finHistory || [];
    st.finHistory.push({
      month: st.month, year: st.year,
      revenue, expenses, profit,
      headcount
    });
    // 最大60ヶ月分保持
    if (st.finHistory.length > 60) st.finHistory.shift();

    // Grant pending dispatch license
    if (st.licenseApplied && !st.hasDispatchLicense) {
      st.hasDispatchLicense = true;
      st.licenseApplied = false;
      this.addLog('good', '\u2705 \u6d3e\u9063\u696d\u8a31\u53ef\u304c\u6b63\u5f0f\u306b\u4ea4\u4ed8\u3055\u308c\u307e\u3057\u305f\uff01\u6d3e\u9063\u5951\u7d04\u6848\u4ef6\u3092\u53d7\u6ce8\u3067\u304d\u307e\u3059\u3002');
    }

    // ─── 不満度100%自動退職チェック ───
    const autoFired = [];
    st.engineers.filter(e=>e.status!=='gone'&&!e.isSelf&&(e.dissatisfaction||0)>=100).forEach(e => {
      // 稼働中なら案件も終了
      const cas = st.activeCases.find(c=>c.assignedEngineerId===e.id);
      if (cas) {
        st.activeCases = st.activeCases.filter(c=>c.id!==cas.id);
        st.brandPoints = Math.max(0, (st.brandPoints||0) - 8);
      }
      e.status = 'gone';
      autoFired.push(e.name);
      this.addLog('bad', `\ud83d\udea8 ${e.name}\u304c\u4e0d\u6e80\u7206\u767a\uff01\u7a81\u7136\u9000\u8077\u3057\u307e\u3057\u305f\u3002\uff08\u4e0d\u6e80\u5ea6100%\uff09`);
    });

    // Update dissatisfaction & stress
    st.engineers.filter(e=>e.status!=='gone'&&!e.isSelf).forEach(e => {
      const pt = PERSONALITY_TYPES[e.personality];
      const stressRate = pt ? pt.stressRate : 1.0;
      let stressBase = 0;
      if (e.status === 'working') {
        // 稼働中：案件のリスクによってストレス増加
        const cas = st.activeCases.find(c=>c.assignedEngineerId===e.id);
        stressBase = cas?.risk==='high' ? 14 : cas?.risk==='medium' ? 9 : 5;
        e.monthsWorked = (e.monthsWorked||0) + 1;
        e.monthsWaiting = 0; // 稼働中はリセット
      } else if (e.status === 'waiting') {
        // 待機中：仕事がないストレス（月数に応じて加速）
        e.monthsWaiting = (e.monthsWaiting||0) + 1;
        const waitMo = e.monthsWaiting;
        stressBase = waitMo >= 4 ? 16 : waitMo >= 3 ? 13 : 10;
        e.dissatisfaction = Math.min(100, e.dissatisfaction + (waitMo >= 3 ? 20 : 15));
      }
      const stressInc = Math.round(stressBase * stressRate);
      e.stress = Math.min(100, (e.stress||0) + stressInc);
      // ストレス高いほど不満も加速
      if (e.stress >= 80) e.dissatisfaction = Math.min(100, e.dissatisfaction + 10);
      else if (e.stress >= 60) e.dissatisfaction = Math.min(100, e.dissatisfaction + 4);
    });

    // 契約満了チェック：即終了せず更新確認として保持
    const expiring = st.activeCases.filter(c => c.monthsLeft <= 0);
    const ongoing  = st.activeCases.filter(c => c.monthsLeft > 0);
    expiring.forEach(c => { c.monthsLeft = 0; c.contractExpiry = true; });
    st.activeCases = [...ongoing, ...expiring];

    // Bankrupt check
    if (st.money < 0) {
      st.monthEndSummary = { revenue, expenses, profit, socialIns, rent, totalSalary, bankrupt: true, contractReviews: expiring };
      st.phase = 'month-end'; return;
    }
    // Victory check
    if (st.totalRevenue >= st.targetRevenue) {
      st.monthEndSummary = { revenue, expenses, profit, socialIns, rent, totalSalary, victory: true, contractReviews: expiring };
      st.phase = 'month-end'; return;
    }
    // 契約更新がある場合はランダムイベントを来月に持ち越し
    const event = expiring.length === 0 ? this.pickEvent() : null;
    if (event) st.pendingEvent = event;
    st.monthEndSummary = { revenue, expenses, profit, socialIns, rent, totalSalary, contractReviews: expiring };
    st.phase = 'month-end';
  }

  // ─── 契約更新解決 ───
  // エンジニア解雇（待機中のみ）
  fireEngineer(engineerId) {
    const st = this.state;
    const eng = st.engineers.find(e => e.id === engineerId);
    if (!eng) return { ok: false, msg: '\u30a8\u30f3\u30b8\u30cb\u30a2\u304c\u898b\u3064\u304b\u308a\u307e\u305b\u3093' };
    if (eng.isSelf) return { ok: false, msg: '\u81ea\u5206\u81ea\u8eab\u306f\u89e3\u96c7\u3067\u304d\u307e\u305b\u3093' };
    if (eng.status === 'working') return { ok: false, msg: '\u7a3c\u50cd\u4e2d\u306e\u30a8\u30f3\u30b8\u30cb\u30a2\u306f\u89e3\u96c7\u3067\u304d\u307e\u305b\u3093\u3002\u5148\u306b\u9000\u30d7\u30ed\u3057\u3066\u304f\u3060\u3055\u3044' };
    const severance = eng.salary; // 1ヶ月分退職金
    st.money -= severance;
    // 解雇は業界口コミで信用力ダウン（スキルが高いほど影響大）
    const credLoss = 10 + Math.floor((eng.skill||0) * 1.5);
    st.credibility = Math.max(0, (st.credibility||0) - credLoss);
    eng.status = 'gone';
    this.addLog('bad', `\u2716 ${eng.name}\u3092\u89e3\u96c7\u3002\u9000\u8077\u91d1\u00a5${Math.round(severance/10000)}\u4e07 / \u4fe1\u7528\u529b-${credLoss}pt\uff08\u696d\u754c\u53e3\u30b3\u30df\uff09`);
    return { ok: true };
  }

  // ─── 1on1面談（不満・ストレス軽減）───
  doOneOnOne(engineerId) {
    const st = this.state;
    if (st.actionsRemaining <= 0) return { ok: false, msg: '\u30a2\u30af\u30b7\u30e7\u30f3\u304c\u8db3\u308a\u307e\u305b\u3093' };
    const eng = st.engineers.find(e => e.id === engineerId);
    if (!eng || eng.status === 'gone') return { ok: false, msg: '\u5bfe\u8c61\u304c\u898b\u3064\u304b\u308a\u307e\u305b\u3093' };
    st.actionsRemaining--;
    const dissReduce = 25 + Math.floor(Math.random() * 10);
    const stressReduce = 15 + Math.floor(Math.random() * 8);
    eng.dissatisfaction = Math.max(0, (eng.dissatisfaction || 0) - dissReduce);
    eng.stress = Math.max(0, (eng.stress || 0) - stressReduce);
    this.addLog('good', `\ud83d\udde3 ${eng.name}\u3068\u30671on1\u9762\u8ac7\u3002\u4e0d\u6e80-${dissReduce}pt\u30fb\u30b9\u30c8\u30ec\u30b9-${stressReduce}pt\u3002`);
    return { ok: true, dissReduce, stressReduce };
  }

  // ─── 引き留め昇給（給与UP＋不満リセット）───
  doRetentionRaise(engineerId) {
    const st = this.state;
    const eng = st.engineers.find(e => e.id === engineerId);
    if (!eng || eng.status === 'gone') return { ok: false, msg: '\u5bfe\u8c61\u304c\u898b\u3064\u304b\u308a\u307e\u305b\u3093' };
    const raise = 30000;
    eng.salary += raise;
    eng.dissatisfaction = Math.max(0, (eng.dissatisfaction || 0) - 35);
    eng.stress = Math.max(0, (eng.stress || 0) - 10);
    this.addLog('good', `\ud83d\udcb8 ${eng.name}\u306b\u5f15\u304d\u7559\u3081\u6607\u7d66\uff01\u6708\u7d66+${Math.round(raise/10000)}\u4e07\u5186\u3002\u4e0d\u6e80-35pt`);
    return { ok: true };
  }

  resolveContractExpiry(caseId, choice, param = {}) {
    const st = this.state;
    const cas = st.activeCases.find(c => c.id === caseId && c.contractExpiry);
    if (!cas) return { ok: false };
    const eng = st.engineers.find(e => e.id === cas.assignedEngineerId);

    if (choice === 'end') {
      if (eng) { eng.status = 'waiting'; eng.monthsWorked = 0; }
      st.activeCases = st.activeCases.filter(c => c.id !== caseId);
      st.completedCasesCount = (st.completedCasesCount || 0) + 1;
      this.addLog('neutral', `「${cas.client}」との契約が満了。${eng ? eng.name + 'が待機に。' : ''}`);
      return { ok: true, ended: true };
    }

    if (choice === 'extend') {
      const months = param.months || 3;
      cas.monthsLeft = months; cas.dur = (cas.dur || 0) + months;
      delete cas.contractExpiry;
      // 延長期間に応じてクライアント信頼度UP
      const oldTrust = cas.clientTrust || 3;
      let trustGain = 0;
      if (months >= 12)      { trustGain = 2; }
      else if (months >= 6)  { trustGain = 1; }
      else if (months >= 3)  { trustGain = Math.random() < 0.5 ? 1 : 0; } // 3ヶ月は50%で+1
      if (trustGain > 0) {
        cas.clientTrust = Math.min(5, oldTrust + trustGain);
        st.brandPoints = Math.min(100, (st.brandPoints||0) + trustGain * 3);
        this.addLog('good', `📋 「${cas.client}」と${months}ヶ月延長！信頼度${oldTrust}→${cas.clientTrust}⬆️ (信用力+${trustGain*3}pt)`);
      } else {
        this.addLog('good', `📋 「${cas.client}」と${months}ヶ月延長！引き続き稼働中。`);
      }
      return { ok: true, extended: true, months, trustGain, newTrust: cas.clientTrust };
    }

    if (choice === 'priceUp') {
      const amount = param.amount || 50000;
      const trust  = cas.clientTrust || 3;
      const inc    = cas.priceIncreaseCount || 0;
      const base   = { 5: 0.80, 4: 0.65, 3: 0.45, 2: 0.25, 1: 0.10 }[trust] || 0.45;
      // 1年以上の長期取引で単価UP成功率ボーナス
      const durBonus = (cas.dur||0) >= 24 ? 0.20 : (cas.dur||0) >= 18 ? 0.15 : (cas.dur||0) >= 12 ? 0.10 : 0;
      const rate   = Math.max(0.05, Math.min(0.95, base + durBonus - inc * 0.15));
      const ok     = Math.random() < rate;
      if (ok) {
        cas.billingCurrent += amount;
        cas.priceIncreaseCount = inc + 1;
        if (inc >= 1) {
          cas.clientTrust = Math.max(1, (cas.clientTrust || 3) - 1);
          this.addLog('bad', `\ud83d\udcb0 \u5358\u4fa1UP\u6210\u529f\uff01\u305f\u3060\u3057\u300c${cas.client}\u300d\u306e\u4fe1\u983c\u5ea6\u4f4e\u4e0b(${cas.clientTrust}/5)\u3002`);
        } else {
          this.addLog('good', `\ud83d\udcb0 \u5358\u4fa1UP\u4ea4\u6e09\u6210\u529f\uff01\u300c${cas.client}\u300d\u6708\u984d+${Math.round(amount/10000)}\u4e07\u3002`);
        }
        cas.monthsLeft = 3; cas.dur += 3; delete cas.contractExpiry;
      } else {
        this.addLog('bad', `\u274c \u300c${cas.client}\u300d\u306b\u5358\u4fa1UP\u3092\u63d0\u6848\u3057\u307e\u3057\u305f\u304c\u65ad\u3089\u308c\u307e\u3057\u305f\u304c\u3002(\u6210\u529f\u7387${Math.round(rate*100)}%)`);
      }
      return { ok: true, priceUp: true, success: ok, rate: Math.round(rate*100), newBilling: cas.billingCurrent };
    }

    if (choice === 'addMember') {
      const newCase = { id: this.nextId(), ...cas, monthsLeft: cas.dur || 3, assignedEngineerId: null, status: 'available', priceIncreaseCount: 0, desc: `${cas.desc}（追加メンバー依頼）` };
      delete newCase.contractExpiry;
      st.availableCases.push(newCase);
      cas.monthsLeft = 3; cas.dur += 3; delete cas.contractExpiry;
      this.addLog('good', `\ud83d\udc65 \u300c${cas.client}\u300d\u304b\u3089\u8ffd\u52a0\u30e1\u30f3\u30d0\u30fc\u4f9d\u983c\uff01\u65b0\u898f\u6848\u4ef6\u304c\u8ffd\u52a0\u3055\u308c\u307e\u3057\u305f\u3002`);
      return { ok: true, addMember: true };
    }
    return { ok: false };
  }

  // 営業担当の育成（salesBonus・営業タグが成長 ※エンジニアと異なる系統）
  trainSales(engineerId) {
    const st = this.state;
    const eng = st.engineers.find(e => e.id === engineerId);
    if (!eng) return { ok: false, msg: '\u30a8\u30f3\u30b8\u30cb\u30a2\u304c\u898b\u3064\u304b\u308a\u307e\u305b\u3093' };
    if (eng.status === 'gone') return { ok: false, msg: '\u9000\u8077\u6e08\u3067\u3059' };
    if (!['sales_rep','senior_sales'].includes(eng.type)) return { ok: false, msg: '\u55b6\u696d\u62c5\u5f53\u306e\u307f\u80b2\u6210\u3067\u304d\u307e\u3059' };
    if (st.actionsRemaining <= 0) return { ok: false, msg: '\u30a2\u30af\u30b7\u30e7\u30f3\u304c\u4e0d\u8db3\u3057\u3066\u3044\u307e\u3059' };
    const cost = 50000;
    if (st.money < cost) return { ok: false, msg: '\u8cc7\u91d1\u4e0d\u8db3\uff085\u4e07\u5186\u5fc5\u8981\uff09' };
    st.money -= cost; st.actionsRemaining--;
    eng.trainingProgress = (eng.trainingProgress || 0) + 25;
    let leveled = false;
    if (eng.trainingProgress >= 100) {
      eng.trainingProgress -= 100;
      eng.salesBonus = (eng.salesBonus || 2) + 1;
      const tiers = [['エンド営業','提案書'],['法人営業','契約交渉'],['エンド開拓','クロージング']];
      const tier = Math.min(2, eng.salesLevel || 0);
      tiers[tier].forEach(t => { if (!(eng.skillTags||[]).includes(t))(eng.skillTags=eng.skillTags||[]).push(t); });
      eng.salesLevel = (eng.salesLevel || 0) + 1;
      leveled = true;
      this.addLog('good', `\ud83d\udce3 ${eng.name}\u306e\u55b6\u696d\u529bLv${eng.salesLevel}\u306b\u30a2\u30c3\u30d7\uff01\u55b6\u696d\u30dc\u30fc\u30ca\u30b9+1\u3002`);
    } else {
      this.addLog('neutral', `\ud83d\udce3 ${eng.name}\u3092\u55b6\u696d\u7814\u4fee\u4e2d\uff08${eng.trainingProgress}/100pt\uff09\u3002`);
    }
    return { ok: true, leveled, salesBonus: eng.salesBonus };
  }


  nextMonth() {
    const st = this.state;
    st.month++;
    if (st.month > 12) { st.month = 1; st.year++; }
    st.actionsRemaining = st.actionsPerMonth;
    this.generateAvailableCases();
    // ブランド力高いとSNS経由で翁来応募者が自然流入
    const bp = st.brandPoints || 0;
    if (bp >= 50) {
      const inboundChance = Math.min(0.60, (bp - 50) * 0.015);
      if (Math.random() < inboundChance) {
        // \u30d6\u30e9\u30f3\u30c9\u529b\u306b\u5fdc\u3058\u305f\u30ec\u30d9\u30eb\u306e\u5019\u88dc\u8005\u3092\u30a4\u30f3\u30e9\u30a4\u30f3\u751f\u6210
        const lvPool = bp >= 80 ? [3,4] : bp >= 65 ? [2,3] : [1,2];
        const lv = lvPool[Math.floor(Math.random()*lvPool.length)];
        const pool = ENGINEER_TEMPLATES.filter(t => t.skill === lv);
        const tpl = pool.length ? pool[Math.floor(Math.random()*pool.length)] : ENGINEER_TEMPLATES[5];
        const sn = JAPANESE_SURNAMES[Math.floor(Math.random()*JAPANESE_SURNAMES.length)];
        const gn = JAPANESE_GIVEN[Math.floor(Math.random()*JAPANESE_GIVEN.length)];
        const cand = {
          id: this.nextId(), name: `${sn} ${gn}`, typeName: tpl.typeName, type: tpl.type,
          skill: tpl.skill, exp: tpl.exp + Math.floor(Math.random()*2), age: tpl.ageBase + Math.floor(Math.random()*5),
          salary: tpl.salaryBase, salaryAsk: Math.round(tpl.salaryBase*1.05), salaryMin: Math.round(tpl.salaryBase*0.88),
          billingRate: tpl.billingBase, skillTags:[...(tpl.skillTags||[])], traits:[...(tpl.traits||[])],
          personality: (tpl.personalityPool||['easygoing'])[Math.floor(Math.random()*(tpl.personalityPool?.length||1))],
          isInbound: true,
          inboundNote: 'SNS\u30fb\u30d6\u30ed\u30b0\u7d4c\u7531\u3067\u81ea\u7136\u5fdc\u52df\uff01\u30a2\u30af\u30b7\u30e7\u30f3\u6d88\u8cbb\u306a\u3057\u3067\u9762\u8ac7\u53ef\u80fd'
        };
        st.inboundApplicants = [...(st.inboundApplicants||[]), cand];
        this.addLog('good', `\ud83d\udcec SNS\u30fb\u30d6\u30ed\u30b0\u3092\u898b\u305f${cand.name}(Lv${cand.skill})\u304b\u3089\u81ea\u7136\u5fdc\u52df\uff01\u300c\u6700\u521d\u306e\u4f1a\u793e\u306f\u3053\u3053\u304c\u3044\u3044\u300d\ud83c\udf1f`);
      }
    }
    st.phase = 'game';
    st.monthEndSummary = null;
    st.eventOutcome = null;
  }

  // ─── EVENT ENGINE ───
  pickEvent() {
    const st = this.state;
    const eligible = EVENTS_DATA.filter(e => {
      if (e.condition && !e.condition(st)) return false;
      if (e.needsEngineer && !st.engineers.find(e2=>e2.status!=='gone'&&!e2.isSelf)) return false;
      if (e.needsActiveCase && st.activeCases.length===0) return false;
      return true;
    });
    if (!eligible.length) return null;
    // 確率ゲート：稼働規模に応じてイベント発生率を変動
    const activeCnt = st.activeCases.filter(c=>!c.contractExpiry).length;
    const eventRate = activeCnt >= 3 ? 0.65 : activeCnt >= 1 ? 0.45 : 0.20;
    if (Math.random() > eventRate) return null;

    // dynamicWeight対応（resign_agency等年齢補正）
    const totalWeight = eligible.reduce((s,e)=>s+(e.dynamicWeight?e.dynamicWeight(st):e.weight), 0);
    let r = Math.random() * totalWeight;
    for (const ev of eligible) {
      r -= (ev.dynamicWeight ? ev.dynamicWeight(st) : ev.weight);
      if (r <= 0) {
        // エンジニアターゲット: 不満高い順→ランダム
        let engPool = st.engineers.filter(e=>e.status!=='gone'&&!e.isSelf);
        if (ev.needsActiveCase) engPool = engPool.filter(e=>e.status==='working');
        engPool.sort((a,b)=>(b.dissatisfaction||0)-(a.dissatisfaction||0));
        const eng = ev.needsEngineer ? (engPool[0]||null) : null;
        const cas = ev.needsActiveCase
          ? st.activeCases[Math.floor(Math.random()*st.activeCases.length)]
          : null;
        return { ...ev, targetEngineer: eng||null, targetCase: cas||null };
      }
    }
    return null;
  }

  resolveEventChoice(choiceIndex) {
    const st = this.state;
    const ev = st.pendingEvent;
    if (!ev) return;
    const choice = ev.choices[choiceIndex];
    const eng = ev.targetEngineer ? st.engineers.find(e=>e.id===ev.targetEngineer?.id) : null;
    const cas = ev.targetCase ? st.activeCases.find(c=>c.id===ev.targetCase?.id) : null;
    const eff = choice.effect;

    // ─── 確率計算ヘルパー（ストレス・性格で変動）───
    const calcRetainProb = (engineer) => {
      if (!engineer) return 0.65;
      let base = 0.65;
      const stress = engineer.stress || 0;
      const diss   = engineer.dissatisfaction || 0;
      const p      = engineer.personality || 'easygoing';
      // ストレス補正
      if (stress >= 85) base -= 0.35;
      else if (stress >= 70) base -= 0.22;
      else if (stress >= 50) base -= 0.10;
      // 不満補正
      if (diss >= 80) base -= 0.20;
      else if (diss >= 60) base -= 0.10;
      // 性格補正
      const pBonus = {optimistic:0.15,easygoing:0.10,cautious:0.05,extroverted:0.05,
                      introverted:-0.05,ambitious:-0.12,passionate:-0.08,perfectionist:-0.05};
      base += (pBonus[p] || 0);
      return Math.max(0.05, Math.min(0.95, base));
    };
    const calcHeadhuntProb = (engineer) => {
      if (!engineer) return 0.55;
      let base = 0.55;
      const stress = engineer.stress || 0;
      const p      = engineer.personality || 'easygoing';
      if (stress >= 80) base -= 0.25;
      else if (stress >= 60) base -= 0.15;
      const pBonus = {optimistic:0.12,easygoing:0.10,'stable':0.20,
                      ambitious:-0.20,passionate:-0.10,extroverted:-0.05};
      base += (pBonus[p] || 0);
      return Math.max(0.05, Math.min(0.92, base));
    };

    const endCase = (c) => {
      if (!c) return;
      const e2 = st.engineers.find(e=>e.id===c.assignedEngineerId);
      if (e2) e2.status = 'waiting';
      st.activeCases = st.activeCases.filter(x=>x.id!==c.id);
    };

    switch(eff) {
      // 支払いのみ（エンジニア継続）
            case 'pay_50000': {
        st.money -= 50000;
        const prob50 = calcRetainProb(eng);
        const roll50 = Math.random();
        if (roll50 < prob50) {
          if(eng){eng.salary+=5000; eng.dissatisfaction=Math.max(0,(eng.dissatisfaction||0)-20);}
          ev._lastResult = {success:true, prob:prob50, msg:'\u5f15\u304d\u6b62\u3081\u6210\u529f\uff01'};
        } else {
          if(eng) eng.status='gone';
          ev._lastResult = {success:false, prob:prob50, msg:'\u30b9\u30c8\u30ec\u30b9\u304c\u9ad8\u304f\u7d50\u5c40\u9000\u8077\u3057\u3066\u3057\u307e\u3063\u305f\u2026'};
        }
        break;
      }
      case 'pay_80000': {
        st.money -= 80000;
        const prob80 = calcHeadhuntProb(eng);
        const roll80 = Math.random();
        if (roll80 < prob80) {
          if(eng){eng.salary+=10000; eng.dissatisfaction=Math.max(0,(eng.dissatisfaction||0)-30);}
          ev._lastResult = {success:true, prob:prob80, msg:'\u6708+1\u4e07\u306e\u6607\u7d66\u3067\u5f15\u304d\u6b62\u3081\u6210\u529f\uff01'};
        } else {
          if(eng) eng.status='gone';
          ev._lastResult = {success:false, prob:prob80, msg:'\u8aac\u5f97\u3067\u304d\u305a\u5225\u4f1a\u793e\u306b\u79fb\u3063\u3066\u3057\u307e\u3063\u305f\u2026'};
        }
        break;
      }
      case 'pay_100000': st.money -= 100000; break;
      case 'pay_200000': st.money -= 200000; if(eng) eng.dissatisfaction=Math.max(0,(eng.dissatisfaction||0)-20); break;
      case 'pay_300000': st.money -= 300000; break;
      // エンジニア退職
      case 'lose_engineer':
      case 'lose_engineer_graceful':
        if(eng){eng.status='gone'; if(cas&&cas.assignedEngineerId===eng.id){st.activeCases=st.activeCases.filter(c=>c.id!==cas.id);}} break;
      // 代替要員で案件継続（単価10%ダウン）
      case 'find_replacement':
        if(cas) cas.billingCurrent=Math.floor(cas.billingCurrent*0.9);
        if(eng){eng.status='gone';} break;
      // 案件終了
      case 'lose_case':      endCase(cas); break;
      case 'case_end_early': endCase(cas); break;
      // 不満変化
      case 'diss_increase':         if(eng) eng.dissatisfaction=Math.min(100,(eng.dissatisfaction||0)+25); break;
      case 'dissatisfaction_down_30':if(eng) eng.dissatisfaction=Math.max(0,(eng.dissatisfaction||0)-30); break;
      case 'dissatisfaction_up_20': if(eng) eng.dissatisfaction=Math.min(100,(eng.dissatisfaction||0)+20); break;
      case 'dissatisfaction_up_30': if(eng) eng.dissatisfaction=Math.min(100,(eng.dissatisfaction||0)+30); break;
      // 単価カット
      case 'unit_cut_10': if(cas) cas.billingCurrent=Math.floor(cas.billingCurrent*0.90); break;
      case 'unit_cut_5':  if(cas) cas.billingCurrent=Math.floor(cas.billingCurrent*0.95); break;
      case 'billing_down_10': if(cas) cas.billingCurrent=Math.floor(cas.billingCurrent*0.90); break;
      case 'billing_down_5':  if(cas) cas.billingCurrent=Math.floor(cas.billingCurrent*0.95); break;
      // 単価アップ
      case 'billing_up_5':   if(cas){cas.billingCurrent=Math.floor(cas.billingCurrent*1.05);cas.monthsLeft=(cas.monthsLeft||0)+3;} break;
      // 給与アップ
      case 'salary_up_30000': if(eng){eng.salary+=30000;eng.dissatisfaction=Math.max(0,(eng.dissatisfaction||0)-30);} break;
      case 'salary_up_50000': if(eng){eng.salary+=50000;eng.dissatisfaction=Math.max(0,(eng.dissatisfaction||0)-40);} break;
      // 案件延長
      case 'extend_case_3': if(cas){cas.monthsLeft+=3;cas.dur=(cas.dur||0)+3;} break;
      // 案件追加
      case 'add_direct_case':
      case 'add_premium_case':
        st.availableCases.push({
          id:this.nextId(),type:'direct',typeName:'エンド直',client:'紹介案件（大手メーカー）',
          requiredSkill:4,billing:1100000,billingCurrent:1100000,dur:6,risk:'low',
          desc:'Java開発・直取引',status:'available',monthsLeft:6,assignedEngineerId:null,riskFlag:false
        }); break;
      case 'add_cobol_case':
        st.availableCases.push({
          id:this.nextId(),type:'secondary',typeName:'\u4e8c\u6b21\u8acb\u3051',client:'COBOL\u4fdd\u5b88\u6848\u4ef6',
          requiredSkill:1,billing:700000,billingCurrent:700000,dur:3,risk:'low',
          desc:'COBOL\u4fdd\u5b88\u30fb\u5b9a\u578b\u4f5c\u696d',status:'available',monthsLeft:3,assignedEngineerId:null,riskFlag:false
        }); break;
      case 'vc_pressure': st.vcQuarterlyTarget = Math.floor((st.vcQuarterlyTarget||0)*1.2); break;
      // SNS\u60aa\u53e3\u30a4\u30d9\u30f3\u30c8
      case 'credibility_loss_sns': {
        const loss = 15 + Math.floor(Math.random()*11);
        st.credibility = Math.max(0, (st.credibility||0) - loss);
        st.brandPoints = Math.max(0, (st.brandPoints||0) - 5);
        this.addLog('bad', `\ud83d\udca2 SNS\u60aa\u53e3\u30b9\u30ec\u304c\u62e1\u6563\u3002\u4fe1\u7528\u529b-${loss}pt`);
        break;
      }
      case 'credibility_recover': {
        const loss2 = 5 + Math.floor(Math.random()*6);
        st.credibility = Math.max(0, (st.credibility||0) - loss2);
        st.brandPoints = Math.min(100, (st.brandPoints||0) + 8);
        this.addLog('neutral', `\ud83d\udcac \u5bfe\u5fdc\u8868\u660e\u3067\u4fe1\u7528\u529b-${loss2}pt\u3060\u304c\u30d6\u30e9\u30f3\u30c9+8pt\u56de\u5fa9\u3002`);
        break;
      }
      // SNS\u30d0\u30ba\u30a4\u30d9\u30f3\u30c8
      case 'sns_brand_boost': {
        const bpGain = 18 + Math.floor(Math.random()*12);
        st.brandPoints = Math.min(100, (st.brandPoints||0) + bpGain);
        this.addLog('good', `\ud83c\udf1f SNS\u30d0\u30ba\uff01\u30d6\u30e9\u30f3\u30c9+${bpGain}pt\u3002\u6765\u6708\u4ee5\u964d\u5fdc\u52df\u304c\u5897\u3048\u308b\u304b\u3082\u3002`);
        break;
      }
      case 'sns_brand_big_boost': {
        const bpBig = 28 + Math.floor(Math.random()*12);
        const credGain = 6 + Math.floor(Math.random()*5);
        st.brandPoints = Math.min(100, (st.brandPoints||0) + bpBig);
        st.credibility = Math.min(100, (st.credibility||0) + credGain);
        this.addLog('good', `\ud83c\udf1f\ud83c\udf1f SNS\u5927\u30d0\u30ba\uff01\u30d6\u30e9\u30f3\u30c9+${bpBig}pt \u4fe1\u7528\u529b+${credGain}pt\u3002`);
        break;
      }
      // \u9577\u671f\u5f85\u6a5f\u30a4\u30d9\u30f3\u30c8\u306e\u5bfe\u5fdc
      case 'one_on_one_event': {
        const targetEng = eng || st.engineers.find(e=>!e.isSelf&&e.status==='waiting'&&(e.monthsWaiting||0)>=3);
        if (targetEng) {
          if (st.actionsRemaining > 0) st.actionsRemaining--;
          const dr = 25 + Math.floor(Math.random()*10);
          const sr = 15 + Math.floor(Math.random()*8);
          targetEng.dissatisfaction = Math.max(0, (targetEng.dissatisfaction||0) - dr);
          targetEng.stress = Math.max(0, (targetEng.stress||0) - sr);
          this.addLog('good', `\ud83d\udde3 ${targetEng.name}\u30671on1\u9762\u8ac7\u3002\u4e0d\u6e80-${dr}pt\u30fb\u30b9\u30c8\u30ec\u30b9-${sr}pt`);
        }
        break;
      }
      case 'retention_raise_event': {
        const targetEng2 = eng || st.engineers.find(e=>!e.isSelf&&e.status==='waiting'&&(e.monthsWaiting||0)>=3);
        if (targetEng2) {
          targetEng2.salary += 30000;
          targetEng2.dissatisfaction = Math.max(0, (targetEng2.dissatisfaction||0) - 35);
          targetEng2.stress = Math.max(0, (targetEng2.stress||0) - 10);
          this.addLog('good', `\ud83d\udcb8 ${targetEng2.name}\u306b\u5f15\u304d\u7559\u3081\u6607\u7d66\uff01\u6708\u7d66+3\u4e07\u3002\u4e0d\u6e80-35pt`);
        }
        break;
      }
      case 'none': default: break;
    }

    this.addLog(ev.type==='bad'?'bad':ev.type==='good'?'good':'neutral',
      `[イベント] ${ev.title} → ${choice.outcome}`);
    st.eventOutcome = choice.outcome;
    st.pendingEvent = null;
  }

  // ─── EDUCATION ───
  checkEducation(key) {
    const st = this.state;
    if (st.seenEducation.has(key)) return;
    st.seenEducation.add(key);
    st.pendingEducation = key;
  }

  getEducationText(key) {
    const texts = {
      first_hire: {
        title:'💡 採用コストと利益率',
        body:'エンジニアを採用すると<strong>稼働の有無に関係なく毎月給与を支払う</strong>義務があります。待機が続くと赤字が膨らむため、稼働率の管理がSES経営の核心です。'
      },
      first_case: {
        title:'💡 SESの仕組み',
        body:'案件単価の<strong>25〜35%がSES会社のマージン</strong>です。エンジニア1人を月80万で派遣し、給与30万を払えば差額50万が粗利。しかしオフィス代・社会保険・採用費を引くと実際の利益はずっと少なくなります。'
      },
      tertiary_warning: {
        title:'⚠️ 三次請けの罠',
        body:'三次請け案件は<strong>単価が著しく低く、利益がほとんど残りません</strong>。エンドクライアントが月150万で発注した案件が、一次・二次・三次と流れてくるたびに各社がマージンを取るためです。稼働率確保のための「つなぎ」としてのみ使いましょう。'
      }
    };
    return texts[key] || null;
  }

  // ─── LOG ───
  addLog(type, msg) {
    const st = this.state;
    st.log.unshift({ type, msg, month: st.month, year: st.year });
    if (st.log.length > 50) st.log.pop();
  }

  // ─── SAVE / LOAD ───
  saveGame() {
    try {
      const st = this.state;
      const data = JSON.stringify({
        ...st,
        seenEducation: Array.from(st.seenEducation || []),
        _savedAt: new Date().toISOString(),
        _version: 3
      });
      localStorage.setItem('ses_save', data);
      return { ok: true };
    } catch(e) {
      return { ok: false, msg: e.message };
    }
  }

  loadGame() {
    try {
      const raw = localStorage.getItem('ses_save');
      if (!raw) return { ok: false, msg: '\u30bb\u30fc\u30d6\u30c7\u30fc\u30bf\u304c\u3042\u308a\u307e\u305b\u3093' };
      const data = JSON.parse(raw);
      if (!data._version) return { ok: false, msg: '\u53e4\u3044\u30c7\u30fc\u30bf\u306f\u8aad\u307f\u8fbc\u3081\u307e\u305b\u3093' };
      // seenEducation を Set に戻す
      data.seenEducation = new Set(Array.isArray(data.seenEducation) ? data.seenEducation : []);
      // finHistory が無ければ初期化
      data.finHistory = data.finHistory || [];
      this.state = data;
      return { ok: true, savedAt: data._savedAt };
    } catch(e) {
      return { ok: false, msg: e.message };
    }
  }

  hasSaveData() {
    return !!localStorage.getItem('ses_save');
  }

  deleteSave() {
    localStorage.removeItem('ses_save');
  }
}

// ─── UTIL ───
function fmt(n) {
  if (n === undefined || n === null) return '0';
  const abs = Math.abs(n);
  if (abs >= 100000000) return (n < 0 ? '-' : '') + Math.round(abs/100000000) + '億';
  if (abs >= 10000)     return (n < 0 ? '-' : '') + Math.round(abs/10000) + '万';
  return (n < 0 ? '-' : '') + Math.round(abs/1000) + '千';
}
function fmtMoney(n) {
  if (!n) return '¥0';
  return '¥' + fmt(n);
}
function stars(n, max=5) {
  let s = '';
  for (let i=1;i<=max;i++) s += `<span class="${i<=n?'':'star-off'}">★</span>`;
  return `<span class="star-rating">${s}</span>`;
}
