// data.js
const LOCATIONS = {
  home:        { name:'\u5728\u5b85\u30fb\u30ea\u30e2\u30fc\u30c8',           icon:'\ud83c\udfe0', rent:0,       caseRate:0.20, hiringRate:0.30, trust:1, moveCost:0,       licenseOk:false, desc:'\u521d\u671f\u8cc7\u91d1\u6e29\u5b58\u3002\u6d3e\u9063\u696d\u8a31\u53ef\u306f\u53d6\u308c\u306a\u3044\u3002' },
  virtual:     { name:'\u30d0\u30fc\u30c1\u30e3\u30eb\u30aa\u30d5\u30a3\u30b9', icon:'\ud83d\udcbb', rent:20000,   caseRate:0.40, hiringRate:0.45, trust:2, moveCost:80000,   licenseOk:false, desc:'\u90fd\u5185\u4f4f\u6240\u3060\u3051\u6301\u3066\u308b\u3002\u6d3e\u9063\u696d\u8a31\u53ef\u306f\u53d6\u308c\u306a\u3044\u3002' },
  localRental: { name:'\u30ec\u30f3\u30bf\u30eb\u30aa\u30d5\u30a3\u30b9\uff08\u5730\u65b9\uff09',icon:'\ud83c\udfe2', rent:80000,   caseRate:0.55, hiringRate:0.55, trust:3, moveCost:200000,  licenseOk:true,  desc:'\u30d0\u30e9\u30f3\u30b9\u578b\u3002\u6d3e\u9063\u696d\u8a31\u53ef\u7533\u8acb\u53ef\u80fd\u3002' },
  urbanRental: { name:'\u30ec\u30f3\u30bf\u30eb\u30aa\u30d5\u30a3\u30b9\uff08\u90fd\u5fc3\uff09',icon:'\ud83c\udfd9', rent:250000,  caseRate:0.75, hiringRate:0.75, trust:4, moveCost:500000,  licenseOk:true,  desc:'\u6a19\u6e96\u30b3\u30fc\u30b9\u3002\u6d3e\u9063\u696d\u8a31\u53ef\u7533\u8acb\u53ef\u80fd\u3002' },
  urbanOwn:    { name:'\u81ea\u793e\u30aa\u30d5\u30a3\u30b9\uff08\u516d\u672c\u6728/\u6e0b\u8c37\uff09',icon:'\ud83c\udfe9', rent:500000,  caseRate:0.95, hiringRate:0.90, trust:5, moveCost:2000000, licenseOk:true,  desc:'\u5927\u624b\u76f4\u6848\u4ef6\u306e\u9375\u3002\u6d3e\u9063\u696d\u8a31\u53ef\u7533\u8acb\u53ef\u80fd\u3002' },
  rural:       { name:'\u7530\u820e\uff08\u5b8c\u5168\u30ea\u30e2\u30fc\u30c8\uff01\uff09',icon:'\ud83c\udf3e', rent:20000,   caseRate:0.15, hiringRate:0.15, trust:1, moveCost:150000,  licenseOk:false, desc:'\u8d85\u30cf\u30fc\u30c9\u30e2\u30fc\u30c9\u3002\u6848\u4ef6\u3082\u4eba\u3082\u96c6\u307e\u308a\u306b\u304f\u3044\u3002\u6d3e\u9063\u696d\u8a31\u53ef\u4e0d\u53ef\u3002' }
};
const ROLES = {
  'engineer-ceo': { name:'\u30a8\u30f3\u30b8\u30cb\u30a2\u5c45\u7d4c\u55b6\u8005', icon:'\ud83d\udc68\u200d\ud83d\udcbb', desc:'\u81ea\u5206\u3082\u73fe\u5834\u306b\u5165\u308a\u306a\u304c\u3089\u7d4c\u55b6\u3002\u6708\u30a2\u30af\u30b7\u30e7\u30f3\u306f\u5c11\u306a\u3044\u304c\u81ea\u5206\u306e\u7a3c\u50cd\u3067\u53ce\u5165\u3092\u78ba\u4fdd\u3002', actionsPerMonth:2, selfBilling:700000, selfSalary:450000, startMoney:1000000 },
  ceo:            { name:'\u7d4c\u55b6\u5c02\u5ff5\u578b', icon:'\ud83d\udc54', desc:'\u7d4c\u55b6\u306b\u5c02\u5ff5\u3002\u73fe\u5834\u306b\u306f\u5165\u3089\u306a\u3044\u3002\u30a2\u30af\u30b7\u30e7\u30f3\u6570\u304c\u591a\u304f\u6226\u7565\u3092\u7acb\u3066\u3084\u3059\u3044\u304c\u521d\u671f\u53ce\u5165\u306f\u30bc\u30ed\u3002', actionsPerMonth:4, selfBilling:0, selfSalary:0, startMoney:0 }
};
const FUNDINGS = {
  self: { name:'\u81ea\u5df1\u8cc7\u91d1', icon:'\ud83d\udcb0', amount:3000000,  monthlyDebt:0,      desc:'300\u4e07\u30b9\u30bf\u30fc\u30c8\u3002\u5b8c\u5168\u81ea\u7531\u3060\u304c\u5c11\u306a\u3044\u3002', constraint:null },
  vc:   { name:'VC/\u30a8\u30f3\u30b8\u30a7\u30eb\u8abf\u9054', icon:'\ud83d\ude80', amount:30000000, monthlyDebt:0,      desc:'3,000\u4e07\u8cc7\u91d1\u3002\u56db\u534a\u671f\u76ee\u6a19\u3042\u308a\u3002', constraint:'quarterly_target' },
  bank: { name:'\u9280\u884c\u878d\u8cc7', icon:'\ud83c\udfe6', amount:10000000, monthlyDebt:277778, desc:'1,000\u4e07\u30013\u5e74\u8fd4\u6e08\uff08\u67088\u4e07\u5186\uff09\u3002', constraint:'monthly_repayment' }
};const HIRING_CHANNELS = [
  { id:'hellowork', name:'\u30cf\u30ed\u30fc\u30ef\u30fc\u30af',         cost:0,      successRate:0.18, quality:1, desc:'\u7121\u6599\u3002\u672a\u7d4c\u9a13\u30fb\u7b2c\u4e8c\u65b0\u5352\u304c\u591a\u3044\u3002\u8cea\u306e\u3070\u3089\u3064\u304d\u5927\u3002' },
  { id:'indeed',    name:'Indeed\u5fdc\u52df',          cost:0,      successRate:0.28, quality:2, desc:'\u7121\u6599\u30022\u301c3\u5e74\u76ee\u4e2d\u5fc3\u3002\u6570\u306f\u96c6\u307e\u308b\u3002' },
  { id:'x_sns',     name:'X\uff08\u65e7Twitter\uff09\u63a1\u7528',  cost:0,      successRate:0.08, quality:3, desc:'\u7121\u6599\u3002\u30d6\u30e9\u30f3\u30c9\u529b\u306b\u5fdc\u3058\u3066\u5019\u88dc\u8005\u6570\u304c\u5927\u304d\u304f\u5909動\u3002\u5f71響力が高いほど優秀人材が集まる。' },
  { id:'linkedin',  name:'LinkedIn\u30b9\u30ab\u30a6\u30c8',       cost:50000,  successRate:0.65, quality:4, desc:'\u67085\u4e07\u3002\u30c0\u30a4\u30ec\u30af\u30c8\u30b9\u30ab\u30a6\u30c8\u3002\u5916\u8cc7\u30fb\u4e0a\u7d1a\u8005\u306b\u5f37\u3044\u3002' },
  { id:'wantedly',  name:'Wantedry',            cost:30000,  successRate:0.60, quality:3, desc:'\u67083\u4e07\u3002\u30d3\u30b8\u30e7\u30f3\u63a1\u7528\u3002\u82e5\u624b\u30a8\u30f3\u30b8\u30cb\u30a2\u306b\u5f37\u3044\u3002' },
  { id:'green',     name:'Green\uff08IT\u8ee2\u8077\uff09',    cost:300000, successRate:0.80, quality:3, desc:'\u6210\u529f\u5831\u916c30\u4e07\u3002IT\u7279\u5316\u3002\u5373\u6226\u529b\u304c\u6765\u3084\u3059\u3044\u3002' },
  { id:'direct',    name:'\u30c0\u30a4\u30ec\u30af\u30c8\u30b9\u30ab\u30a6\u30c8',  cost:0,      successRate:0.10, quality:4, desc:'GitHub\u30fbQiita\u3067\u76f4\u63a5\u30b9\u30ab\u30a6\u30c8\u3002\u7121\u6599\u3060\u304c\u30d6\u30e9\u30f3\u30c9\u529b次第で候補者数が大きく変動。' },
  { id:'doda',      name:'do\u0434a/\u30ea\u30afNavi',    cost:500000, successRate:0.88, quality:4, desc:'\u6210\u529f\u5831\u916c50\u4e07\u3002\u5927\u624b\u5a92\u4f53\u3002\u8cea\u306f\u9ad8\u3044\u3002' },
  { id:'agent',     name:'\u4eba\u6750\u30a8\u30fc\u30b8\u30a7\u30f3\u30c8',    cost:800000, successRate:0.95, quality:5, desc:'\u6210\u529f\u5831\u916c80\u4e07\u3002\u30d9\u30c6\u30e9\u30f3\u3092\u78ba\u5b9f\u306b\u63a1\u7528\u3002' }
];
const ENGINEER_TEMPLATES = [
  { type:'sales_rep', personalityPool:['extroverted','optimistic','easygoing'],    typeName:'営業担当',                skill:0, salaryBase:220000, billingBase:0,       exp:2,  ageBase:28, skillTags:['法人営業','提案書','連絡調整'],           traits:['sales-power','stable'],              salesBonus:2 },
  { type:'senior_sales', personalityPool:['extroverted','ambitious','cautious'], typeName:'シニア営業',              skill:0, salaryBase:350000, billingBase:0,       exp:8,  ageBase:35, skillTags:['法人営業','エンド営業','契約交渉'],       traits:['sales-power','expensive','stable'],   salesBonus:4 },
  { type:'novice_hd', personalityPool:['easygoing','optimistic','introverted'],    typeName:'IT未経験（HD希望）',      skill:0, salaryBase:170000, billingBase:270000,  exp:0,  ageBase:23, skillTags:['ヘルプデスク','PC操作','電話対応'],       traits:['unstable','backtrack-risk'] },
  { type:'novice_sales', personalityPool:['extroverted','easygoing','optimistic'], typeName:'IT未経験（販売系）',      skill:0, salaryBase:180000, billingBase:285000,  exp:0,  ageBase:24, skillTags:['データ入力','PC操作','コールセンター'],   traits:['unstable','backtrack-risk'] },
  { type:'inexperienced', personalityPool:['optimistic','ambitious','easygoing'],typeName:'未経験（スクール卒）',    skill:1, salaryBase:200000, billingBase:300000,  exp:0,  ageBase:24, skillTags:['テスト','データ入力','Git'],              traits:['backtrack-risk','unstable'] },
  { type:'tester', personalityPool:['perfectionist','cautious','introverted'],       typeName:'QAエンジニア',            skill:1, salaryBase:220000, billingBase:380000,  exp:1,  ageBase:25, skillTags:['テスト','テスト設計','Selenium'],         traits:['unstable'] },
  { type:'junior', personalityPool:['ambitious','perfectionist','easygoing'],       typeName:'プログラマー（初級）',    skill:2, salaryBase:270000, billingBase:470000,  exp:2,  ageBase:26, skillTags:['Java','TypeScript','SQL','Git'],          traits:[] },
  { type:'junior-hw', personalityPool:['perfectionist','ambitious','passionate'],    typeName:'プログラマー（勤勉型）',  skill:2, salaryBase:280000, billingBase:480000,  exp:2,  ageBase:26, skillTags:['Python','React','SQL','Git'],             traits:['hard-worker'] },
  { type:'mid', personalityPool:['cautious','easygoing','perfectionist'],          typeName:'プログラマー（中級）',    skill:3, salaryBase:380000, billingBase:650000,  exp:5,  ageBase:30, skillTags:['Go','REST API','PostgreSQL','Docker'],    traits:[] },
  { type:'mid-amb', personalityPool:['ambitious','passionate','extroverted'],      typeName:'フロントエンドエンジニア',skill:3, salaryBase:400000, billingBase:700000,  exp:5,  ageBase:29, skillTags:['React','TypeScript','Next.js','GraphQL'], traits:['ambitious','freelance-risk'] },
  { type:'ml_engineer', personalityPool:['ambitious','perfectionist','introverted'],  typeName:'AIエンジニア',            skill:3, salaryBase:450000, billingBase:800000,  exp:4,  ageBase:30, skillTags:['Python','OpenAI','LangChain','機械学習'], traits:['ambitious','expensive'] },
  { type:'senior', personalityPool:['cautious','easygoing','perfectionist'],       typeName:'シニアエンジニア',        skill:4, salaryBase:550000, billingBase:900000,  exp:8,  ageBase:33, skillTags:['Java','AWS','Kubernetes','Spring'],       traits:['expensive'] },
  { type:'sf_engineer', personalityPool:['perfectionist','easygoing','cautious'],  typeName:'Salesforceエンジニア',    skill:3, salaryBase:430000, billingBase:750000,  exp:4,  ageBase:31, skillTags:['Salesforce','Apex','Lightning','CRM'],    traits:['niche'] },
  { type:'mobile_eng', personalityPool:['ambitious','easygoing','passionate'],   typeName:'モバイルエンジニア',      skill:3, salaryBase:420000, billingBase:730000,  exp:4,  ageBase:29, skillTags:['Flutter','Dart','React Native','iOS'],    traits:['ambitious'] },
  { type:'security_eng', personalityPool:['perfectionist','cautious','introverted'], typeName:'セキュリティエンジニア',  skill:4, salaryBase:580000, billingBase:950000,  exp:6,  ageBase:32, skillTags:['セキュリティ','SASE','ゼロトラスト','WAF'],traits:['expensive','niche'] },
  { type:'cobol', personalityPool:['cautious','easygoing','optimistic'],        typeName:'レガシーエンジニア',      skill:3, salaryBase:450000, billingBase:800000,  exp:15, ageBase:45, skillTags:['COBOL','PL/SQL','JCL','基幹保守'],       traits:['niche','stable'] },
  { type:'cloud', personalityPool:['ambitious','perfectionist','passionate'],        typeName:'クラウドエンジニア',      skill:4, salaryBase:600000, billingBase:950000,  exp:6,  ageBase:31, skillTags:['AWS','GCP','Kubernetes','Terraform'],     traits:['expensive','ambitious'] },
  { type:'pm', personalityPool:['extroverted','cautious','ambitious'],           typeName:'プロジェクトマネージャー',skill:5, salaryBase:700000, billingBase:1200000, exp:10, ageBase:38, skillTags:['PM','要件定義','ウォーターフォール','アジャイル'],traits:['expensive','stable'] }
];
const CASE_TEMPLATES = [
  // ─── エンド直（信頼度4-5）───
  { type:'direct',    typeName:'エンド直',          client:'不死テクノロジー株式会社',    contractType:'quasi',    requiredSkill:4, requiredTags:['Python','OpenAI','LangChain'],           clientTrust:5, billing:1200000, dur:6,  risk:'low',    desc:'生成AI RAGシステム構築・LLMエンジニア' },
  { type:'direct',    typeName:'エンド直',          client:'三ッ葉UFQ銀行グループ',       contractType:'dispatch', requiredSkill:5, requiredTags:['PM','要件定義','基幹保守'],              clientTrust:5, billing:1300000, dur:12, risk:'low',    desc:'基幹系刷新PM・ウォーターフォール' },
  { type:'direct',    typeName:'エンド直',          client:'ミクロソフト・ジャパン',       contractType:'dispatch', requiredSkill:4, requiredTags:['Azure','Kubernetes','Terraform'],        clientTrust:4, billing:1050000, dur:3,  risk:'medium', desc:'Azure移行・クラウドネイティブ化' },
  { type:'direct',    typeName:'エンド直',          client:'ポニーネットワーク株式会社',   contractType:'dispatch', requiredSkill:4, requiredTags:['React','TypeScript','Next.js'],          clientTrust:4, billing:1000000, dur:6,  risk:'low',    desc:'ECプラットフォーム刷新・Next.js/TypeScript' },
  { type:'direct',    typeName:'エンド直',          client:'データクラウド基盤株式会社',   contractType:'quasi',    requiredSkill:4, requiredTags:['Python','機械学習','データ分析'],        clientTrust:4, billing:980000,  dur:6,  risk:'low',    desc:'データエンジニアリング基盤・BigQuery/dbt' },
  // ─── 一次請け（信頼度3-4）───
  { type:'primary',   typeName:'一次請け',          client:'NTUデータソリューションズ',    contractType:'quasi',    requiredSkill:3, requiredTags:['Go','REST API','PostgreSQL'],            clientTrust:4, billing:780000,  dur:6,  risk:'low',    desc:'Goバックエンド・マイクロサービス開発' },
  { type:'primary',   typeName:'一次請け',          client:'日鋼ITコンサルティング',       contractType:'quasi',    requiredSkill:4, requiredTags:['AWS','Kubernetes','Terraform'],          clientTrust:3, billing:920000,  dur:12, risk:'medium', desc:'SRE・Kubernetes/ArgoCD運用' },
  { type:'primary',   typeName:'一次請け',          client:'不死ソフトウェア',             contractType:'quasi',    requiredSkill:2, requiredTags:['テスト','Selenium','テスト設計'],         clientTrust:4, billing:620000,  dur:3,  risk:'low',    desc:'QA自動化・Selenium/Playwright' },
  { type:'primary',   typeName:'一次請け',          client:'SFDCパートナー社',             contractType:'quasi',    requiredSkill:3, requiredTags:['Salesforce','Apex','Lightning'],        clientTrust:3, billing:760000,  dur:6,  risk:'low',    desc:'Salesforce開発・Apex/LWC' },
  { type:'primary',   typeName:'一次請け',          client:'セキュアテック株式会社',       contractType:'quasi',    requiredSkill:4, requiredTags:['セキュリティ','SASE','ゼロトラスト'],   clientTrust:4, billing:920000,  dur:6,  risk:'medium', desc:'ゼロトラスト設計・SASE導入支援' },
  { type:'primary',   typeName:'一次請け',          client:'TDQシステムズ',               contractType:'quasi',    requiredSkill:3, requiredTags:['COBOL','JCL','基幹保守'],               clientTrust:3, billing:720000,  dur:6,  risk:'low',    desc:'製造業向け基幹システム保守・COBOL' },
  // ─── 二次請け（信頼度2-3）───
  { type:'secondary', typeName:'二次請け',          client:'アルファテックSES経由',        contractType:'quasi',    requiredSkill:2, requiredTags:['テスト','Excel/VBA'],                   clientTrust:3, billing:550000,  dur:3,  risk:'medium', desc:'結合試験・Excelテスト管理' },
  { type:'secondary', typeName:'二次請け',          client:'ベータシステムズ経由',         contractType:'quasi',    requiredSkill:3, requiredTags:['Flutter','Dart'],                       clientTrust:2, billing:650000,  dur:6,  risk:'medium', desc:'Flutterアプリ開発（iOS/Android）' },
  { type:'secondary', typeName:'二次請け（炸上注意）', client:'ガンマコーポレーション経由', contractType:'quasi',   requiredSkill:2, requiredTags:['React','TypeScript'],                   clientTrust:1, billing:520000,  dur:3,  risk:'high',   desc:'React開発・要件曖昧で炸上リスクあり' },
  { type:'secondary', typeName:'二次請け',          client:'デルタIT経由',                contractType:'quasi',    requiredSkill:2, requiredTags:['COBOL','JCL','基幹保守'],               clientTrust:2, billing:580000,  dur:6,  risk:'medium', desc:'金融系スクラッチ開発・COBOL改修' },
  // ─── 三次請け以下（信頼度1-2）───
  { type:'tertiary',  typeName:'三次請け以下',      client:'イプシロンSES経由',            contractType:'quasi',    requiredSkill:1, requiredTags:['テスト','データ入力'],                  clientTrust:1, billing:350000,  dur:3,  risk:'high',   desc:'テスト作業・データ入力補助' },
  { type:'tertiary',  typeName:'三次請け以下',      client:'ゼータシステム経由',           contractType:'quasi',    requiredSkill:1, requiredTags:['COBOL','基幹保守'],                     clientTrust:2, billing:320000,  dur:3,  risk:'high',   desc:'COBOLバグ修正（緊急）' },
  { type:'tertiary',  typeName:'三次請け以下',      client:'エータエンジニアリング経由',   contractType:'quasi',    requiredSkill:1, requiredTags:['テスト','マニュアル作業'],              clientTrust:1, billing:300000,  dur:3,  risk:'high',   desc:'基幹システム保守・マニュアル作業' },
  // ─── IT名目・実態不明（disguised）───
  { type:'tertiary',  typeName:'🚨 IT名目・実態不明', client:'ガンマコーポレーション経由', requiredSkill:0, requiredTags:['ヘルプデスク','PC操作'], clientTrust:1, billing:280000, dur:3, risk:'high', desc:'ヘルプデスク業務（履歴書に「ITエンジニア」と書かれる）', contractType:'disguised', dark:true },
  { type:'tertiary',  typeName:'🚨 IT名目・実態不明', client:'アルファテックSES経由',     requiredSkill:0, requiredTags:['コールセンター','PC操作'], clientTrust:1, billing:310000, dur:3, risk:'high', desc:'コールセンター業務（「IT系」と言って担いで行かせる）', contractType:'disguised', dark:true },
  { type:'secondary', typeName:'⚠ 二次請け（炸上注意）', client:'イプシロンSES経由',    requiredSkill:1, requiredTags:['テスト','テスト設計'], clientTrust:2, billing:380000, dur:6, risk:'high', desc:'テスト工程専業（クリック繰り返し、スキルは一切つかない）', contractType:'disguised', dark:true }
];const PERSONALITY_TYPES = {
  perfectionist: { label:'几帳面',    icon:'📐', stressRate:1.3, color:'#7ab8f5', desc:'品質へのこだわりが強い。プレッシャーでストレスが溜まりやすい' },
  easygoing:     { label:'マイペース', icon:'🌊', stressRate:0.8, color:'#00d4aa', desc:'自分のペースを大切にする。急かされると不満が増す' },
  passionate:    { label:'熱血',      icon:'🔥', stressRate:1.1, color:'#f7971e', desc:'仕事に情熱的だが燃え尽きやすい' },
  introverted:   { label:'内向的',    icon:'🔇', stressRate:1.2, color:'#a78bfa', desc:'クライアント対応でストレスが溜まりやすい' },
  extroverted:   { label:'外向的',    icon:'📣', stressRate:0.9, color:'#34d399', desc:'人との仕事が好き。ストレスを発散しやすい' },
  cautious:      { label:'慎重派',    icon:'🧐', stressRate:1.0, color:'#94a3b8', desc:'変化には慎重。考えすぎることも' },
  optimistic:    { label:'楽観的',    icon:'😄', stressRate:0.7, color:'#ffd200', desc:'ストレスを感じにくい。でも危機感も薄め' },
  ambitious:     { label:'向上心旺盛', icon:'🚀', stressRate:1.0, color:'#60a5fa', desc:'スキルアップを重視。待機が続くと転職志向が高まる' },
};
const TRAIT_LABELS = {
  'backtrack-risk': { label:'\u30d0\u30c3\u30af\u30ec\u30ea\u30b9\u30af', class:'trait-bad' },
  'unstable':       { label:'\u4e0d\u5b89\u5b9a', class:'trait-bad' },
  'hard-worker':    { label:'\u52e4\u52c9\u5bb6', class:'trait-good' },
  'ambitious':      { label:'\u91ce\u5fc3\u5bb6', class:'trait-warn' },
  'freelance-risk': { label:'FL\u8ee2\u8edf\u30ea\u30b9\u30af', class:'trait-bad' },
  'expensive':      { label:'\u9ad8\u5358\u4fa1', class:'trait-warn' },
  'niche':          { label:'\u30cb\u30c3\u30c1\u30b9\u30ad\u30eb', class:'trait-good' },
  'stable':         { label:'\u5b89\u5b9a\u5fd7\u5411', class:'trait-good' }
};
const JAPANESE_SURNAMES = ['\u7530\u4e2d','\u9234\u6728','\u4f50\u85e4','\u9ad8\u6a4b','\u4f0a\u85e4','\u6e21\u8fba','\u5c71\u672c','\u4e2d\u6751','\u5c0f\u6797','\u52a0\u85e4','\u5409\u7530','\u5c71\u7530','\u4f50\u3005\u6728','\u677e\u672c','\u4e95\u4e0a','\u6728\u6751','\u6797','\u6589\u85e4','\u6e05\u6c34','\u5c71\u53e3'];
const JAPANESE_GIVEN = ['\u5065\u592a','\u6d77\u4eba','\u572d\u51c6','\u7d50\u8863','\u8eca','\u5948\u3005','\u518a\u592a','\u548c\u819c','\u7fd4','\u82b1\u9999','\u521d\u5b50','\u767b\u52df','\u660e\u65e5\u5c0f\u8868','\u6d77\u5fa1','\u6d77\u6597'];
const EDUCATION_TEXTS = {
  margin: { title:'SES\u306e\u30de\u30fc\u30b8\u30f3\u69cb\u9020', body:'\u5355\u4fa1\u2212\u7d66\u4e0e\u2212\u793e\u4fdd\u306e\u5dee\u5f15\u304d\u304c\u7c97\u5229\u3067\u3059\u3002\u696d\u754c\u5e73\u5747\u306f20\u301c30%\u3002\u5712\u306b\u5165\u308c\u306a\u3044\u30a8\u30f3\u30b8\u30cb\u30a2\u306b\u304a\u91d1\u3092\u6255\u3044\u7d9a\u3051\u3068\u30ad\u30e3\u30c3\u30b7\u30e5\u304c\u5e72\u3046\u3002' },
  backtrack: { title:'\u30d0\u30c3\u30af\u30ec\u306e\u30ea\u30a2\u30eb', body:'\u7279\u306b\u672a\u7d4c\u9a13\u8005\u306f\u8eab\u5206\u8a3c\u660e\u66f8\u306a\u3069\u306e\u66f8\u985e\u3092\u63d0\u51fa\u3057\u305f\u3042\u3068\u8eb8\u8dec\u3059\u308b\u30b1\u30fc\u30b9\u304c\u3042\u308a\u307e\u3059\u3002\u9375\u7dda\u3068\u306a\u308b\u30a8\u30f3\u30b8\u30cb\u30a2\u306e\u5c65\u6b74\u3092\u5fc5\u305a\u78ba\u8a8d\u3057\u307e\u3057\u3087\u3046\u3002' },
  hiring_cost: { title:'\u63a1\u7528\u30b3\u30b9\u30c8\u306e\u771f\u5b9f', body:'\u30a8\u30fc\u30b8\u30a7\u30f3\u30c8\u8a2d\u5c11\u306f\u5e74\u53ce\u306e30\u301c35%\u304c\u76f8\u5834\u3002\u6708\u60791\u5104\u306e\u30a8\u30f3\u30b8\u30cb\u30a2\u3092\u63a1\u7528\u3059\u308b\u3068\u5831\u916c\u306f200\u4e07\u5186\u4ee5\u4e0a\u306b\u306a\u308b\u3053\u3068\u3082\u3002' },
  subcontract: { title:'\u4e0b\u8acb\u3051\u69cb\u9020\u306e\u554f\u984c', body:'\u4e09\u6b21\u8acb\u3051\u4ee5\u4e0b\u306f\u5c11\u306a\u304f\u306a\u3044\u3002\u306a\u305c\u306a\u3089\u307e\u305a\u304a\u91d1\u304c\u6291\u5229\u3055\u308c\u308b\u304b\u3089\u3002\u30a8\u30f3\u30c9\u76f4\u6848\u4ef6\u3092\u5341\u5206\u306b\u78ba\u4fdd\u3067\u304d\u308b\u4f1a\u793e\u306f\u5c11\u306a\u3044\u304c\u72d9\u3046\u3079\u304d\u76ee\u6a19\u3002' },
  social_insurance: { title:'\u793e\u4fdd\u306e\u30a4\u30f3\u30d1\u30af\u30c8', body:'\u5f93\u696d\u54e1\u306e\u793e\u4fdd\u6599\u306e\u4f1a\u793e\u8ca0\u62c5\u5206\u306f\u7d0415%\u3002\u6708\u60793\u4e07\u306e\u30a8\u30f3\u30b8\u30cb\u30a2\u306b\u306f\u6bce\u6708\u77f35\u4e07\u8ffd\u52a0\u304c\u304b\u304b\u308b\u3002\u4eba\u6570\u304c\u5897\u3048\u308b\u307b\u3069\u91cd\u308f\u308b\u56fa\u5b9a\u8cbb\u3002' }
};const EVENTS_DATA = [
  { id:'backtrack', type:'bad', title:'\ud83d\udca8 \u30a8\u30f3\u30b8\u30cb\u30a2\u304c\u30d0\u30c3\u30af\u30ec\uff01',
    getDesc:(e,c)=>`${e?e.name:'\u30a8\u30f3\u30b8\u30cb\u30a2'}\u304c\u9023\u7d61\u3082\u306a\u304f\u6b8b\u3048\u305f\u307e\u307e\u5c71\u6710\u3057\u307e\u3057\u305f\u3002\u73fe\u5834\u304b\u3089\u3082\u9023\u7d61\u304c\u5165\u3063\u3066\u304a\u308a\u307e\u305b\u3093\u3002\u25bc`,
    choices:[
      {text:'\u7dca\u6025\u5bfe\u5fdc\uff01\u4ee3\u66ff\u8981\u54e1\u3092\u63a2\u3059', effect:'find_replacement', outcome:'\u4ee3\u66ff\u8981\u54e1\u3092\u7dca\u6025\u30a2\u30b5\u30a4\u30f3\u3002\u5831\u916c\u306f\u4e0b\u304c\u3063\u305f\u304c\u843d\u3061\u7740\u3044\u305f\u3002'},
      {text:'\u5148\u65b9\u306b\u8b1d\u308a\u306b\u884c\u304f', effect:'lose_case', outcome:'\u6848\u4ef6\u3092\u5931\u3063\u305f\u3002\u4fe1\u9803\u306b\u30c0\u30e1\u30fc\u30b8\u3002\u6b21\u306f\u5c65\u6b74\u3092\u3082\u3063\u3068\u78ba\u8a8d\u3057\u3088\u3046\u3002'}
    ], condition:s=>s.engineers.some(e=>e.traits&&e.traits.includes('backtrack-risk')), weight:15, needsEngineer:true, needsActiveCase:true },
  { id:'quit_notice', type:'bad', title:'\ud83d\udcdd \u9000\u8077\u5c4a\u304c\u51fa\u305f\uff01',
    getDesc:(e)=>`${e?e.name:'\u30a8\u30f3\u30b8\u30cb\u30a2'}\u304b\u3089\u9000\u8077\u5c4a\u304c\u51fa\u307e\u3057\u305f\u3002\u300c\u4ed6\u793e\u306b\u683c\u5b89\u3067\u53d7\u3051\u8cb7\u3063\u3066\u3082\u3089\u3044\u307e\u3059\u300d\u3068\u8a00\u3063\u3066\u3044\u307e\u3059\u3002`,
    choices:[
      {text:'\u5f15\u304d\u6b62\u3081\u3092\u8a66\u307f\u308b\uff08\u6708\u30015\u4e07\u5341\u3002\uff09', effect:'pay_50000', outcome:'\u7d66\u4e0e\u3092\u4e0a\u3052\u305f\u3002\u3068\u308a\u3042\u3048\u305a\u7559\u307e\u3063\u3066\u3082\u3089\u3063\u305f\u3002'},
      {text:'\u9000\u8077\u3092\u53d7\u5165\u308c\u308b', effect:'lose_engineer', outcome:'\u5c11\u3057\u6089\u3057\u3044\u30a8\u30f3\u30b8\u30cb\u30a2\u304c\u8fba\u308a\u307e\u3057\u305f\u3002'}
    ], condition:s=>s.engineers.filter(e=>e.status!=='gone'&&!e.isSelf).length>0, weight:20, needsEngineer:true, needsActiveCase:false },
  { id:'resign_agency', type:'bad', title:'\ud83d\udcde \u9000\u8077\u4ee3\u884c\u304b\u3089\u96fb\u8a71\u304c\uff01',
    getDesc:(e)=>`${e?e.name:'\u30a8\u30f3\u30b8\u30cb\u30a2'}\u306e\u4ee3\u308f\u308a\u306b\u9000\u8077\u4ee3\u884c\u696d\u8005\u304b\u3089\u9023\u7d61\u304c\u3042\u308a\u307e\u3057\u305f\u3002\u300c\u4eca\u65e5\u304b\u3089\u51fa\u793e\u3057\u307e\u305b\u3093\u300d\u3002${e&&(e.exp||0)<=2?'\uff08\u82e5\u624b\u306f\u9000\u8077\u4ee3\u884c\u3092\u4f7f\u3044\u3084\u3059\u3044\u3002\uff09':''}`,
    choices:[
      {text:'\u6cd5\u7684\u6cc9\u8def\u3092\u5f53\u305f\u308b', effect:'pay_200000', outcome:'\u5f01\u8b77\u58eb\u76f8\u8ac7\u3002\u90f7\u696d\u907f\u6b62\u5236\u7d04\u306b\u6cd5\u7684\u62d8\u675f\u529b\u306f\u306a\u304b\u3063\u305f\u3002'},
      {text:'\u5373\u5ea7\u30a2\u30c3\u30d7\u3092\u63d0\u793a\u3059\u308b', effect:'lose_engineer', outcome:'\u9000\u8077\u3092\u53d7\u5165\u308c\u305f\u3002\u4eba\u4e8b\u306f\u5e38\u306b\u30ea\u30b9\u30af\u3060\u3002'}
    ],
    condition:s=>s.engineers.filter(e=>e.status!=='gone'&&!e.isSelf).length>0,
    weight:10,
    dynamicWeight:(st)=>{
      const engineers = st.engineers.filter(e=>e.status!=='gone'&&!e.isSelf);
      const hasYoung   = engineers.some(e=>(e.exp||0)<=2&&(e.dissatisfaction||0)>=40);
      const hasStressed= engineers.some(e=>(e.stress||0)>=70);
      const hasHiStress= engineers.some(e=>(e.stress||0)>=85);
      const hasAny     = engineers.some(e=>(e.dissatisfaction||0)>=50);
      // ストレスが高いほど発生率UP（複合補正）
      if (hasHiStress) return 45;
      if (hasStressed && hasYoung) return 38;
      if (hasStressed) return 28;
      return hasYoung?32:hasAny?18:8;
    },

    needsEngineer:true, needsActiveCase:false },
  { id:'skill_fraud', type:'bad', title:'\ud83d\ude31 \u30b9\u30ad\u30eb\u5507\u5104\u304c\u5224\u660e\uff01',
    getDesc:(e,c)=>`${e?e.name:'\u30a8\u30f3\u30b8\u30cb\u30a2'}\u306e\u30b9\u30ad\u30eb\u304c\u5c65\u6b74\u66f8\u3068\u5168\u7136\u9055\u3046\u3053\u3068\u304c\u5224\u660e\u3057\u307e\u3057\u305f\u3002${c?c.client:'\u5148\u65b9'}\u304b\u3089\u30af\u30ec\u30fc\u30e0\u304c\u6765\u3066\u3044\u307e\u3059\u3002`,
    choices:[
      {text:'\u30a8\u30f3\u30b8\u30cb\u30a2\u3092\u5909\u66f4\u3059\u308b', effect:'lose_engineer', outcome:'\u30a8\u30f3\u30b8\u30cb\u30a2\u3092\u5909\u66f4\u3057\u305f\u3002\u5358\u4fa1\u306f\u4e0b\u304c\u3063\u305f\u3002'},
      {text:'\u30da\u30ca\u30eb\u30c6\u30a3\u3092\u6255\u3063\u3066\u94d6\u3092\u5207\u308b', effect:'pay_300000', outcome:'\u30da\u30ca\u30eb\u30c6\u30a3\u6255\u6e08\u3002\u95a2\u4fc2\u306f\u7dad\u6301\u3067\u304d\u305f\u3002'}
    ], condition:s=>s.activeCases.length>0, weight:12, needsEngineer:true, needsActiveCase:true },
  { id:'unit_cut', type:'bad', title:'\ud83d\udcc9 \u5358\u4fa1\u30ab\u30c3\u30c8\u306e\u901a\u544a\uff01',
    getDesc:(e,c)=>`${c?c.client:'\u30af\u30e9\u30a4\u30a2\u30f3\u30c8'}\u304b\u3089\u300c\u30b3\u30b9\u30c8\u524a\u6e1b\u306e\u305f\u3081\u5358\u4fa1\u3092\u5f15\u304d\u4e0b\u3052\u305f\u3044\u300d\u3068\u901a\u544a\u304c\u3042\u308a\u307e\u3057\u305f\u300210%\u5f15\u4e0b\u3052\u8981\u6c42\u3002`,
    choices:[
      {text:'\u53d7\u3051\u5165\u308c\u308b', effect:'unit_cut_10', outcome:'\u5358\u4fa1\u304c10%\u5f15\u304d\u4e0b\u3052\u3089\u308c\u305f\u3002\u8f9e\u9000\u3059\u308b\u3088\u308a\u30de\u30b7\u304b\u3002'},
      {text:'\u5c0f\u5dee\u3057\u3066\u5b89\u5b9a\u3092\u53d6\u308b', effect:'unit_cut_5', outcome:'\u4e0d\u6e80\u304c\u9ad8\u307e\u3063\u305f\u304c5%\u5897\u306e\u5024\u4e0b\u3052\u306b\u6291\u3048\u305f\u3002'},
      {text:'\u62d2\u5426\u3057\u3066\u5951\u7d04\u6253\u5207\u308a', effect:'lose_case', outcome:'\u6848\u4ef6\u3092\u5931\u3063\u305f\u304c\u8fd4\u3063\u3066\u3001\u5225\u306e\u6848\u4ef6\u3092\u63a2\u305d\u3046\u3002'}
    ], condition:s=>s.activeCases.length>0, weight:15, needsEngineer:false, needsActiveCase:true },
  { id:'headhunt', type:'bad', title:'\ud83c\udfaf \u5f15\u304d\u629c\u304d\u5de5\u4f5c\uff01',
    getDesc:(e)=>`${e?e.name:'\u30a8\u30f3\u30b8\u30cb\u30a2'}\u306b\u5225\u4f1a\u793e\u304b\u3089\u30b9\u30ab\u30a6\u30c8\u304c\u3044\u3063\u3066\u3044\u308b\u3088\u3046\u3067\u3059\u3002\u300c\u73fe\u5728\u306e1.5\u500d\u306e\u5e74\u53ce\u3092\u63d0\u793a\u3055\u308c\u305f\u300d\u3068\u8a00\u3063\u3066\u3044\u307e\u3059\u3002`,
    choices:[
      {text:'\u6708\u30018\u4e07\u30fb\u5168\u798f\u5229\u539a\u751f\u300d\u3067\u5f15\u304d\u6b62\u3081\u308b', effect:'pay_80000', outcome:'\u3068\u308a\u3042\u3048\u305a\u7559\u307e\u3063\u3066\u3082\u3089\u3063\u305f\u3002\u3057\u304b\u3057\u9577\u671f\u306f\u4e0d\u660e\u3002'},
      {text:'\u9000\u8077\u3092\u53d7\u5165\u308c\u308b', effect:'lose_engineer', outcome:'\u512a\u79c0\u306a\u30a8\u30f3\u30b8\u30cb\u30a2\u304c\u51fa\u3066\u3044\u3063\u305f\u3002\u4eba\u6750\u76e3\u5c40\u306e\u30b3\u30b9\u30c8\u304c\u9ad8\u3044\u7406\u7531\u3060\u3002'}
    ], condition:s=>s.engineers.filter(e=>e.status!=='gone'&&e.skill>=3).length>0, weight:12, needsEngineer:true, needsActiveCase:false },
  { id:'trouble_case', type:'bad', title:'\ud83d\udd25 \u6848\u4ef6\u70b8\u4e0a\u304c\u308a\uff01',
    getDesc:(e,c)=>`${c?c.client:'\u73fe\u5834'}\u306e\u30d7\u30ed\u30b8\u30a7\u30af\u30c8\u304c\u708e\u4e0a\u304c\u3063\u3066\u3044\u307e\u3059\u3002${e?e.name:'\u30a8\u30f3\u30b8\u30cb\u30a2'}\u304c\u600e\u72b4\u306b\u306a\u3063\u3066\u304a\u308a\u4e0d\u6e80\u5ea6\u304c\u5927\u5e45\u5897\u52a0\u3002`,
    choices:[
      {text:'\u5916\u6ce8\u3067\u652f\u63f4\u6dfb\u52a0\uff08\uff1e20\u4e07\uff09', effect:'pay_200000', outcome:'\u30b3\u30b9\u30c8\u3092\u304b\u3051\u3066\u70b8\u4e0a\u304c\u308a\u3092\u53ce\u6d88\u3057\u305f\u3002\u30a8\u30f3\u30b8\u30cb\u30a2\u306e\u4e0d\u6e80\u5ea6\u5c0f\u5e45\u6e1b\u3002'},
      {text:'\u30a8\u30f3\u30b8\u30cb\u30a2\u306b\u6307\u793a\u3057\u3066\u304a\u304f', effect:'diss_increase', outcome:'\u30a8\u30f3\u30b8\u30cb\u30a2\u306e\u4e0d\u6e80\u5ea6\u304c\u5897\u3048\u305f\u3002\u708e\u4e0a\u304c\u308a\u306e\u8ca0\u62c5\u3092\u62bc\u3057\u4ed8\u3051\u305f\u5f62\u3002'}
    ], condition:s=>s.activeCases.some(c=>c.risk==='high'), weight:20, needsEngineer:true, needsActiveCase:true },
  { id:'case_extended', type:'good', title:'\ud83d\ude4c \u6848\u4ef6\u671f\u9593\u5ef6\u9577\uff01',
    getDesc:(e,c)=>`${c?c.client:'\u30af\u30e9\u30a4\u30a2\u30f3\u30c8'}\u304b\u3089\u300c\u5c0e\u5165\u5f8c\u306e\u5b9f\u7e3e\u3092\u8a55\u4fa1\u3057\u3066\u3044\u307e\u3059\u3002\u5f15\u304d\u7d9a\u304d\u304a\u9858\u3044\u3067\u304d\u307e\u305b\u3093\u304b\uff1f\u300d\u3068\u9023\u7d61\u304c\u3042\u308a\u307e\u3057\u305f\u3002`,
    choices:[
      {text:'\u3059\u3050\u5ef6\u9577\u3059\u308b\uff083\u30f6\u6708\uff09', effect:'extend_case_3', outcome:'\u6848\u4ef6\u304c3\u30f6\u6708\u5ef6\u9577\uff01\u5b89\u5b9a\u53ce\u5165\u304c\u78ba\u4fdd\u3002'},
      {text:'\u5358\u4fa1\u30a2\u30c3\u30d7\u3092\u4ea4\u6e09\u3057\u3066\u5ef6\u9577', effect:'billing_up_5', outcome:'\u4ea4\u6e09\u6210\u529f\uff01\u5358\u4fa1\u304c5\uff05\u30a2\u30c3\u30d7\u3057\u305f\u3002'},
      {text:'\u304a\u65ad\u308a\u3057\u4ed6\u6848\u4ef6\u3092\u63a2\u3059', effect:'none', outcome:'\u5ef6\u9577\u3092\u65ad\u3063\u305f\u3002\u7a7a\u304d\u304c\u3067\u304d\u308b\u304c\u5e0c\u671b\u3092\u6301\u3066\u308b\u6848\u4ef6\u3092\u63a2\u305d\u3046\u3002'}],
    condition:s=>s.activeCases.length>0, weight:15, needsEngineer:false, needsActiveCase:true },
  { id:'referral', type:'good', title:'\ud83e\udd1d \u7d39\u4ecb\u6848\u4ef6\u304c\u6765\u305f\uff01',
    getDesc:()=>`\u4ee5\u524d\u53d6\u308a\u7d44\u3093\u3060\u6848\u4ef6\u5148\u304b\u3089\u7d39\u4ecb\u304c\u3042\u308a\u307e\u3057\u305f\u3002\u30a8\u30f3\u30c9\u76f4\u306e\u6848\u4ef6\u3067\u3059\u3002`,
    choices:[
      {text:'\u3059\u3050\u53d7\u3051\u308b\uff01', effect:'add_direct_case', outcome:'\u7d39\u4ecb\u6848\u4ef6\u3092\u7372\u5f97\uff01\u53e3\u30b3\u30df\u306e\u529b\u304c\u5c51\u3044\u3002'},
      {text:'\u5358\u4fa1\u4ea4\u6e09\u3057\u3066\u304b\u3089\u53d7\u3051\u308b', effect:'add_premium_case', outcome:'\u4ea4\u6e09\u6210\u529f\u3002\u5c11\u3057\u9ad8\u3081\u306e\u5358\u4fa1\u3067\u7d39\u4ecb\u6848\u4ef6\u3092\u7372\u5f97\u3002'},
      {text:'\u4eca\u306f\u4eba\u624b\u4e0d\u8db3\u3067\u304a\u65ad\u308a', effect:'none', outcome:'\u304a\u65ad\u308a\u3057\u305f\u3002\u30a8\u30f3\u30b8\u30cb\u30a2\u3092\u78ba\u4fdd\u3057\u3066\u304b\u3089\u52d5\u3053\u3046\u3002'}],
    condition:s=>s.month>=3&&s.activeCases.length>0, weight:12, needsEngineer:false, needsActiveCase:false },
  { id:'vc_pressure', type:'bad', title:'\ud83d\udcca VC\u304b\u3089\u547c\u3073\u51fa\u3057\uff01',
    getDesc:()=>`\u300c\u4eca\u56db\u534a\u671f\u306e\u76ee\u6a19\u3092\u9054\u6210\u3067\u304d\u3066\u3044\u307e\u305b\u3093\u3002\u4e8b\u696d\u8a08\u753b\u3092\u898b\u76f4\u3057\u3066\u304f\u3060\u3055\u3044\u300d\u3068\u6295\u8cc7\u5bb6\u304b\u3089\u9023\u7d61\u304c\u6765\u307e\u3057\u305f\u3002`,
    choices:[
      {text:'\u8a08\u753b\u3092\u4fee\u6b63\u3057\u3066\u8aac\u660e\u3059\u308b', effect:'none', outcome:'\u306a\u3093\u3068\u304b\u51cc\u3044\u3060\u3002\u6b21\u306e\u56db\u534a\u671f\u304c\u52dd\u8ca0\u3060\u3002'},
      {text:'\u6b63\u76f4\u306b\u73fe\u72b0\u3092\u5831\u544a\u3059\u308b', effect:'vc_pressure', outcome:'\u6295\u8cc7\u5bb6\u3068\u306e\u4fe1\u98c4\u95a2\u4fc2\u3092\u4fdd\u3063\u305f\u3002\u3067\u3082\u5727\u529b\u304c\u9ad8\u307e\u3063\u3066\u3044\u308b\u3002'}
    ], condition:s=>s.funding==='vc'&&s.month%3===0, weight:15, needsEngineer:false, needsActiveCase:false },
  { id:'disguised_audit', type:'bad', title:'\ud83d\udea8 \u52b4\u50cd\u5c40\u304c\u8abf\u67fb\u306b\u6765\u305f\uff01',
    getDesc:(e,c)=>`\u300c\u6e96\u59d4\u4efb\u5951\u7d04\u306e\u306f\u305a\u304c\u5b9f\u614b\u306f\u6d3e\u9063\u3060\u300d\u3068\u52b4\u50cd\u5c40\u304b\u3089\u6307\u6458\u3055\u308c\u307e\u3057\u305f\u3002\u507d\u88c5\u8acb\u8ca0\u306f\u9055\u6cd5\u3067\u3059\u3002`,
    choices:[
      {text:'\u7d20\u76f4\u306b\u8a8d\u3081\u3066\u662f\u6b63\u3059\u308b\uff08-30\u4e07\uff09', effect:'pay_300000', outcome:'\u662f\u6b63\u52e7\u544a\u3092\u53d7\u3051\u305f\u3002\u4fe1\u7528\u306b\u50b7\u304c\u3064\u3044\u305f\u3002'},
      {text:'\u300c\u6e96\u59d4\u4efb\u306e\u5b9f\u614b\u304c\u3042\u308b\u300d\u3068\u4e3b\u5f35\u3059\u308b', effect:'none', outcome:'\u4eca\u56de\u306f\u4e57\u308a\u5207\u3063\u305f\u304c\u3001\u76e3\u8996\u304c\u7d9a\u304f\u3002\u3044\u3064\u304b\u306f\u2026'}]
    , condition:s=>s.activeCases.some(c=>c.contractType==='disguised'), weight:20, needsEngineer:false, needsActiveCase:false },
  { id:'sns_bad_rep', type:'bad', title:'💢 SNSに悪口を書かれた！',
    getDesc:()=>'元従業員らしき人物が「あの会社はブラック！〝と投稿。会社名入りで書かれ業界に広まりました。',
    choices:[
      {text:'公式に対応表明を出す', effect:'credibility_recover', outcome:'対応表明で信用力小幅回復。丫優しの評判には時間がかかる。'},
      {text:'スルーする（無視）', effect:'credibility_loss_sns', outcome:'何もしなかったが、スレが拡散。'}
    ], weight:12, needsEngineer:false, needsActiveCase:false },
  { id:'sns_viral', type:'good', title:'🌟 SNSがバズった！',
    getDesc:()=>'投稿したテックブログが拡散。DMが段々届いています。',
    choices:[
      {text:'応募エンジニアに返信する', effect:'sns_brand_boost', outcome:'ブランド力大幅UP！将来的に悪口への替えになる。'},
      {text:'標準採用プロセスへ辺り込む', effect:'sns_brand_big_boost', outcome:'ブランド力大幅UPかつ一時的に信用力も上昇。'}
    ], weight:10, needsEngineer:false, needsActiveCase:false },
  { id:'long_wait_burnout', type:'bad', title:'💼 転職活動の気配！',
    getDesc:(e)=>`${e?e.name:'エンジニア'}が案件にアサインされない日々が続き、転職エージェントに登録したようです。このままだと失ってしまいます。`,
    choices:[
      {text:'1on1面談で正直に話す（アクション消費）', effect:'one_on_one_event', outcome:'面談した。不満が少し減ったが、案件がないことは変わらない。'},
      {text:'昇給で引き留める（月+3万）', effect:'retention_raise_event', outcome:'引き留め成功！ただし固定費が上がる。案件を確保しないと赤字になるので要注意。'},
      {text:'自主退職を受け入れる', effect:'lose_engineer', outcome:'辞表を受け取った。積素な離席だったが、一人少なくなる。'}
    ],
    condition:s=>s.engineers.some(e=>!e.isSelf&&e.status==='waiting'&&(e.monthsWaiting||0)>=3),
    needsEngineer:true, needsActiveCase:false,
    weight:0, dynamicWeight:(st)=>{
      const cnt = st.engineers.filter(e=>!e.isSelf&&e.status==='waiting'&&(e.monthsWaiting||0)>=3).length;
      return cnt > 0 ? cnt * 25 : 0;
    }
  }
];