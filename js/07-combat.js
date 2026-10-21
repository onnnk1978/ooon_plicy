/* ── トラップ・ダンジョンイベント・キーボード操作・NPC能力値型戦闘 ── */

// ══════════════════════════════════════════
//  TRAP SYSTEM
// ══════════════════════════════════════════
const TRAP_TABLE = [
 {
 id:'pit',
 name:'落とし穴',
 icon:'️',
 desc:'足元の石畳が突然崩れ、深い穴が口を開けた！',
 attr:'lk', level:2,
 onFail: (pc)=>{
 const dmg = Nd6(2);
 pc.con = Math.max(0, pc.con - dmg);
 return `穴に落ちた！ 体力-${dmg}（落下ダメージ）`;
 },
 onPass: ()=>'間一髪で飛び退いた！',
 },
 {
 id:'dart',
 name:'毒矢の罠',
 icon:'',
 desc:'壁の小穴から鋭い矢が飛び出した！',
 attr:'dex', level:2,
 onFail: (pc)=>{
 const dmg = Nd6(1);
 pc.con = Math.max(0, pc.con - dmg);
 pc._poisoned = true;
 return `矢が刺さった！ 体力-${dmg}、毒状態になった（毎ターン体力-1）`;
 },
 onPass: ()=>'矢をかわした！',
 },
 {
 id:'rockfall',
 name:'石落とし',
 icon:'',
 desc:'天井から大きな石が降ってきた！',
 attr:'spd', level:1,
 onFail: (pc)=>{
 const dmg = Nd6(2) + 2;
 const armor = effectiveArmor();
 const actual = Math.max(1, dmg - armor);
 pc.con = Math.max(0, pc.con - actual);
 return `石に当たった！ ${dmg}ダメージ（防具-${armor}）→ 体力-${actual}`;
 },
 onPass: ()=>'間に合った！石を避けた！',
 },
 {
 id:'magetrap',
 name:'魔法の罠',
 icon:'',
 desc:'床に刻まれた魔法陣が突然光り輝いた！',
 attr:'lk', level:3,
 onFail: (pc)=>{
 const dmg = pc.type==='wizard' ? Nd6(1) : Nd6(2)+1;
 pc.con = Math.max(0, pc.con - dmg);
 if(pc.type==='wizard') pc.st = Math.max(0, pc.st - Nd6(1));
 return pc.type==='wizard'
 ? `魔力が逆流した！ 体力-${dmg}、ST -${Nd6(1)}（魔法使いは影響大）`
 : `魔法の雷撃を受けた！ 体力-${dmg}`;
 },
 onPass: ()=>'魔法陣を踏み越えた！なぜか発動しなかった…',
 },
 {
 id:'chain',
 name:'拘束の罠',
 icon:'️',
 desc:'床から鎖が飛び出し、足首に絡みついた！',
 attr:'dex', level:2,
 onFail: (pc)=>{
 applyChainedEffect(pc, 2);
 return `鎖に絡めとられた！ 次の2ターン、器用さが半減する`;
 },
 onPass: ()=>'素早く跳び退き、鎖をかわした！',
 },
];

function rollTrap(){
 if(Math.random() >= 0.12) return null; // 12%
 return TRAP_TABLE[Math.floor(Math.random()*TRAP_TABLE.length)];
}

// トラップSaving Roll処理
function startTrap(trap){
 const story = document.getElementById('story');
 story.innerHTML += `<div style="border-top:1px solid #6b4c2a;margin-top:10px;padding-top:8px;color:#e8e0d0;font-size:calc(var(--font-sm) + 1px)">
 ${trap.icon} <b>${trap.name}</b><br>
 <span style="font-size:var(--font-sm);color:#e0d8c8">${trap.desc}</span>
 </div>`;

 // パーティがいれば誰が挑むか選ばせる
 selectActorForSR(trap.attr, trap.level, (actor)=>{
  setupSavingRollFor(actor, {
   attr: trap.attr,
   level: trap.level,
   label: `${trap.name}回避`,
   onSuccess(){ applyTrapResult(trap, true, actor); },
   onFail(){ applyTrapResult(trap, false, actor); },
  });
 });
 renderChoices([]);
 scrollToTop();
}

// 指定キャラでSRを設定（APはそのキャラに加算）
function setupSavingRollFor(actor, sr){
 const isPC = actor === PC;
 // rollPendingにactorを持たせる
 const srWithActor = {...sr, _actor: actor};
 rollPending = srWithActor;
 const attrNames={st:'強さ',iq:'知力',lk:'運',con:'体力',dex:'器用さ',chr:'魅力',spd:'素早さ'};
 const target = sr.level*5+15;
 const attrVal = actor[sr.attr] || 0;
 const actorLabel = isPC ? PC.name : actor.name;
 document.getElementById('dd').innerHTML =
  `<span style="color:#e8e0d8">${actorLabel}</span>　<span style="color:var(--white)">Lv${sr.level} ${attrNames[sr.attr]||sr.attr}(${attrVal})</span><br>目標: 2D6+${attrVal} ≥ <span style="color:var(--white)">${target}</span>`;
 document.getElementById('dres').textContent='──  ──';
 _activateDiceUI(srWithActor, actor);
 scrollToTop();
}

function applyTrapResult(trap, passed, actor){
 actor = actor || PC;
 const story = document.getElementById('story');
 if(passed){
 const msg = trap.onPass(actor);
 story.innerHTML += `<div style="color:#f0ece0;font-size:calc(var(--font-sm) + 1px);margin-top:6px"> ${msg}</div>`;
 } else {
 const msg = trap.onFail(actor);
 story.innerHTML += `<div style="color:#f0ddd8;font-size:calc(var(--font-sm) + 1px);margin-top:6px"> ${msg}</div>`;
 updateHUD();
 if(PC.con <= 0){
 setTimeout(()=>go('DEAD'), 1200);
 return;
 }
 }
 // 通常の選択肢を復元
 setTimeout(()=>_restoreNodeChoices(), 400);
}

// ══════════════════════════════════════════
//  DUNGEON EVENT SYSTEM
// ══════════════════════════════════════════
const DUNGEON_EVENTS = [
 // ① 清らかな湧き水
 {
 id: 'spring',
 icon: '',
 title: '清らかな湧き水',
 desc: '壁の割れ目から、澄んだ水が静かに湧き出ている。飲んでみるか？',
 choices: (ev) => [
 {
 label: ' 水を飲む',
 fn: () => {
 const roll = Math.random();
 const story = document.getElementById('story');
 if(roll < 0.05){
 PC.st += 10; PC.maxSt = (PC.maxSt||PC.st) + 10;
 story.innerHTML += `<div style="color:#f0ece0;font-size:calc(var(--font-sm) + 1px);margin-top:8px"> <b>力の泉だった！</b> ST が永続的に +10！（ST ${PC.st}）</div>`;
 } else if(roll < 0.10){
 gainIQ(10, PC);
 story.innerHTML += `<div style="color:#e8e0d8;font-size:calc(var(--font-sm) + 1px);margin-top:8px"> <b>知恵の泉だった！</b> IQ が永続的に +10！（IQ ${PC.iq}）</div>`;
 } else if(roll < 0.15){
 PC.lk += 10;
 story.innerHTML += `<div style="color:#f0ece0;font-size:calc(var(--font-sm) + 1px);margin-top:8px"> <b>幸運の泉だった！</b> LK が永続的に +10！（LK ${PC.lk}）</div>`;
 } else if(roll < 0.20){
 PC.st = Math.max(1, Math.floor(PC.st / 2));
 PC.con = Math.max(1, Math.floor(PC.con / 2));
 PC.maxSt = Math.max(1, Math.floor((PC.maxSt||PC.st) / 2));
 PC.maxCon = Math.max(1, Math.floor(PC.maxCon / 2));
 story.innerHTML += `<div style="color:#e0d0d0;font-size:calc(var(--font-sm) + 1px);margin-top:8px"> <b>毒の泉だった！</b> ST と CON が永続的に 1/2 になった…（ST ${PC.st} / CON ${PC.con}）</div>`;
 } else {
 story.innerHTML += `<div style="color:#e0d8c8;font-size:calc(var(--font-sm) + 1px);margin-top:8px"> 冷たく澄んだ水だった。特に何も感じない。</div>`;
 }
 story.innerHTML += `<div style="color:#c0b098;font-size:var(--font-sm);margin-top:4px">水はもう湧いていない。</div>`;
 updateHUD();
 _restoreNodeChoices();
 },
 },
 {
 label: ' 飲まずに立ち去る',
 fn: () => {
 const story = document.getElementById('story');
 story.innerHTML += `<div style="color:#c0b098;font-size:var(--font-sm);margin-top:8px">立ち去ろうとすると、水はすでに消えていた。</div>`;
 _restoreNodeChoices();
 },
 },
 ],
 },

 // ② 砂の壁画（砂漠ダンジョン用・全ダンジョン共通テーブルに追加）
 {
 id: 'sandwriting',
 icon: '',
 title: '砂岩に刻まれた古代文字',
 desc: '壁一面に砂岩の古代文字が刻まれている。読み解けそうだが時間がかかる。',
 choices: (ev) => [
 {
 label: ' 解読を試みる（知力 Lv2 能力値テスト）',
 fn: () => {
 setupSavingRoll({
  attr:'iq', level:2,
  onSuccess:()=>{
   const story = document.getElementById('story');
   const ap2 = 20 + Math.floor(Math.random()*21);
   gainAPAll(ap2); updateHUD();
   const msgs = [
   '「この廟に眠る者に触れるな。怒りは砂嵐となって降り注ぐだろう」',
   '「南の扉の先に、かつての王の財宝が眠る。ただし試練を越えた者だけが手にできる」',
   '「光なき者よ、引き返せ。暗闇は死の使者である」',
   '「力ある者よ、この印を覚えよ。扉の前で唱えれば道が開く」',
   ];
   story.innerHTML += `<div style="color:#f0ece0;font-size:calc(var(--font-sm) + 1px);margin-top:8px"> 解読成功！<br><span style="color:#f0ece0;font-size:var(--font-sm)">「${msgs[Math.floor(Math.random()*msgs.length)]}」</span><br><span style="color:#f0ece0">経験値+${ap2}</span></div>`;
   _restoreNodeChoices();
  },
  onFail:()=>{
   const story = document.getElementById('story');
   story.innerHTML += `<div style="color:#e0d0d0;font-size:calc(var(--font-sm) + 1px);margin-top:8px"> 解読失敗。古代語は難解すぎた。</div>`;
   _restoreNodeChoices();
  },
 });
 },
 },
 {
 label: ' 立ち去る',
 fn: () => {
 const story = document.getElementById('story');
 story.innerHTML += `<div style="color:#c0b098;font-size:var(--font-sm);margin-top:8px">文字を残して先へ進んだ。</div>`;
 _restoreNodeChoices();
 },
 },
 ],
 },

 // ③ 乾燥した骨壺（砂漠ダンジョン固有）
 {
 id: 'urn',
 icon: '',
 title: '砂に埋もれた骨壺',
 desc: '床の砂の中に、装飾された骨壺が半分埋もれている。中に何か入っているかもしれない。',
 choices: (ev) => [
 {
 label: ' 骨壺を開ける（運 Lv1 能力値テスト）',
 fn: () => {
 setupSavingRoll({
  attr:'lk', level:1,
  onSuccess:()=>{
   const story = document.getElementById('story');
   const gp = 10 + Math.floor(Math.random()*41);
   gainGPAll(gp); updateHUD();
   story.innerHTML += `<div style="color:#f0ece0;font-size:calc(var(--font-sm) + 1px);margin-top:8px"> 中から金貨が出てきた！<br><span style="color:#f0ece0">+${gp}GP</span></div>`;
   _restoreNodeChoices();
  },
  onFail:()=>{
   const story = document.getElementById('story');
   const dmg = 1 + Math.floor(Math.random()*4);
   PC.con = Math.max(1, PC.con - dmg); updateHUD();
   story.innerHTML += `<div style="color:#e0d0d0;font-size:calc(var(--font-sm) + 1px);margin-top:8px"> 呪いの煙が噴き出した！<br><span style="color:#e0d0d0">体力-${dmg}（残り${PC.con}）</span></div>`;
   _restoreNodeChoices();
  },
 });
 },
 },
 {
 label: ' 触らずに立ち去る',
 fn: () => {
 const story = document.getElementById('story');
 story.innerHTML += `<div style="color:#c0b098;font-size:var(--font-sm);margin-top:8px">骨壺をそのままにして立ち去った。</div>`;
 _restoreNodeChoices();
 },
 },
 ],
 },

 // ④ 魔法の指輪
 {
 id: 'ring',
 icon: '',
 title: '魔法の指輪',
 desc: '石畳の上に、鈍く光る指輪が転がっている。',
 choices: (ev) => {
 const hasRing = PC._magicRing;
 return [
 !hasRing ? {
 label: ' 指輪を身につける（LK +10）',
 fn: () => {
 PC._magicRing = true;
 PC.lk += 10;
 const story = document.getElementById('story');
 story.innerHTML += `<div style="color:#f0ece0;font-size:calc(var(--font-sm) + 1px);margin-top:8px"> 指輪をはめた。不思議な温かみを感じる。LK +10（つけている間）</div>`;
 updateHUD();
 _restoreNodeChoices();
 },
 } : {
 label: ' すでに指輪をしている（拾えない）',
 fn: () => {
 const story = document.getElementById('story');
 story.innerHTML += `<div style="color:#b8a890;font-size:var(--font-sm);margin-top:8px">すでに指輪をしているため、これ以上身につけられない。</div>`;
 _restoreNodeChoices();
 },
 },
 {
 label: ' 無視して通り過ぎる',
 fn: () => {
 const story = document.getElementById('story');
 story.innerHTML += `<div style="color:#c0b098;font-size:var(--font-sm);margin-top:8px">指輪を残して立ち去った。</div>`;
 _restoreNodeChoices();
 },
 },
 ];
 },
 },

 // ⑤ 松明の揺らぎ
 {
 id: 'torch_flicker',
 icon: '',
 title: '突然の松明の揺らぎ',
 desc: '松明の炎が急に大きく揺れ、不自然に弱くなる。まるで周囲の空気が一瞬だけ吸い取られたようだ。',
 choices: (ev) => [{
  label: ' 様子を見る',
  fn: () => {
   const story = document.getElementById('story');
   const roll = d6();
   if(roll <= 2){
    // 地下の風穴：松明が消える
    const torchMsg = extinguishTorch();
    story.innerHTML += `<div style="color:#f0ddd8;font-size:calc(var(--font-sm) + 1px);margin-top:8px"> <b>地下の風穴</b>：強い風が吹き抜けた。松明の火が消えてしまった！<br><span style="color:#f0ddd0;font-size:var(--font-sm)">${torchMsg}</span></div>`;
   } else if(roll <= 4){
    story.innerHTML += `<div style="color:#c8b8a0;font-size:var(--font-sm);margin-top:8px"> 炎はやがて落ち着いた。特に何も起こらなかった。</div>`;
   } else {
    // 炎の精の気まぐれ：松明100ターン分
    PC._torchTurns = Math.max(PC._torchTurns||0, 100);
    story.innerHTML += `<div style="color:#f0ece0;font-size:calc(var(--font-sm) + 1px);margin-top:8px"> <b>炎の精の気まぐれ</b>：松明が青白い炎に変わった。不思議な力でずっと燃え続けそうだ！（残り${PC._torchTurns}ターン）</div>`;
   }
   updateHUD();
   _restoreNodeChoices();
  },
 }],
 },

 // ⑥ 転がってきたコイン
 {
 id: 'rolling_coin',
 icon: '',
 title: 'どこからか転がってきたコイン',
 desc: '足元で「カラン…」と音がして、古びた金貨が1枚転がってくる。通路の奥から転がってきたようだが、誰かの気配はない。',
 choices: (ev) => [
  {
  label: ' 拾う',
  fn: () => {
   const roll = d6();
   if(roll <= 2){
    // 罠のコイン：耐久SR
    setupSavingRoll({
     attr:'con', level:1,
     onFail:()=>{
      const story = document.getElementById('story');
      const torchMsg2 = extinguishTorch();
      story.innerHTML += `<div style="color:#e0d0d0;font-size:calc(var(--font-sm) + 1px);margin-top:8px"> <b>罠のコイン！</b>触れた瞬間に粉状の毒が舞った。気絶した。<br><span style="color:#f0ddd0;font-size:var(--font-sm)">${torchMsg2}</span></div>`;
      updateHUD();
      _restoreNodeChoices();
     },
     onSuccess:()=>{
      const story = document.getElementById('story');
      story.innerHTML += `<div style="color:#f0ece0;font-size:calc(var(--font-sm) + 1px);margin-top:8px"> <b>罠のコインだった！</b>毒粉が舞ったが、耐えた。</div>`;
      updateHUD();
      _restoreNodeChoices();
     },
    });
    return;
   }
   const story = document.getElementById('story');
   if(roll <= 4){
    gainGPAll(1); updateHUD();
    story.innerHTML += `<div style="color:#f0ece0;font-size:calc(var(--font-sm) + 1px);margin-top:8px"> <b>ただの落とし物。</b>普通の金貨だった。+1GP</div>`;
   } else if(roll === 5){
    const treasure = generateTreasure(20);
    story.innerHTML += `<div style="color:#f0ece0;font-size:calc(var(--font-sm) + 1px);margin-top:8px"> <b>冒険者の痕跡！</b>少し先で古いバックパックを発見した。<br>${treasure}</div>`;
   } else {
    PC.lk += 5;
    story.innerHTML += `<div style="color:#f0ece0;font-size:calc(var(--font-sm) + 1px);margin-top:8px"> <b>幸運のコイン！</b>持つと温かくなる気がする。LK +5（永続）（LK ${PC.lk}）</div>`;
   }
   updateHUD();
   _restoreNodeChoices();
  },
  },
  {
  label: ' 転がってきた方向を調べる',
  fn: () => {
   const story = document.getElementById('story');
   story.innerHTML += `<div style="color:#c8b8a0;font-size:var(--font-sm);margin-top:8px">奥を調べたが、薄暗い通路が続くだけで何も見つからなかった。コインはいつの間にか消えていた。</div>`;
   _restoreNodeChoices();
  },
  },
  {
  label: ' 無視して進む',
  fn: () => {
   const story = document.getElementById('story');
   story.innerHTML += `<div style="color:#c0b098;font-size:var(--font-sm);margin-top:8px">コインを無視して先へ進んだ。</div>`;
   _restoreNodeChoices();
  },
  },
 ],
 },

 // ⑦ 落ちてくる小石
 {
 id: 'falling_stones',
 icon: '',
 title: 'どこからか落ちてくる小石',
 desc: '静かに進んでいると、天井のどこかから小石が一つ落ちてくる。「コツ…コツ…」と小さな石が転がる音がする。',
 choices: (ev) => [{
  label: ' 様子を見る',
  fn: () => {
   const roll = d6();
   if(roll <= 2){
    // 崩落：敏捷SR
    setupSavingRoll({
     attr:'dex', level:1,
     onFail:()=>{
      const story = document.getElementById('story');
      const dmg = d6();
      PC.con = Math.max(0, PC.con - dmg); updateHUD();
      story.innerHTML += `<div style="color:#e0d0d0;font-size:calc(var(--font-sm) + 1px);margin-top:8px"> <b>小規模な崩落！</b>天井の一部が崩れた。体力-${dmg}（残り${PC.con}）</div>`;
      _restoreNodeChoices();
     },
     onSuccess:()=>{
      const story = document.getElementById('story');
      story.innerHTML += `<div style="color:#f0ece0;font-size:calc(var(--font-sm) + 1px);margin-top:8px"> 天井が少し崩れたが、素早く避けた。</div>`;
      _restoreNodeChoices();
     },
    });
    return;
   } else if(roll <= 4){
    const story = document.getElementById('story');
    // モンスター出現
    story.innerHTML += `<div style="color:#f0ddd8;font-size:calc(var(--font-sm) + 1px);margin-top:8px"> <b>上の通路で何かが動いた！</b>すぐに足音が近づいてくる……</div>`;
    renderChoices([{label:'▶ OK', fn:()=>{
     startCombat({ name:'地下の徘徊者', mr:20, armor:2, isHuman:false, canFlee:true, win:'__noop__', lose:'DEAD',
       onWin:()=>{ document.getElementById('cbt-area').classList.add('hidden'); document.getElementById('scroll-area').classList.remove('in-combat'); document.getElementById('text-win').style.display=''; cbtState=null; _restoreNodeChoices(); }
      });
     renderChoices([]); scrollToTop();
    }}]);
    scrollToTop();
    return;
   } else {
    const story = document.getElementById('story');
    story.innerHTML += `<div style="color:#c8b8a0;font-size:var(--font-sm);margin-top:8px"> 古いダンジョンの天井が少し崩れただけ。何も起こらなかった。</div>`;
    updateHUD();
    _restoreNodeChoices();
   }
  },
 }],
 },

 // ⑧ 背後の気配
 {
 id: 'presence',
 icon: '',
 title: '背後の気配',
 desc: 'ふとした瞬間、誰かに見られているような気配を感じる。振り返っても誰もいないが、確かに何かがいた気がする。',
 choices: (ev) => [{
  label: ' 警戒する',
  fn: () => {
   const roll = d6();
   if(roll <= 2){
    const story = document.getElementById('story');
    // 追跡者：即戦闘
    story.innerHTML += `<div style="color:#e0d0d0;font-size:calc(var(--font-sm) + 1px);margin-top:8px"> <b>追跡者！</b>背後から足音が迫ってくる——!</div>`;
    renderChoices([{label:'▶ OK', fn:()=>{
     startCombat({ name:'追跡者', mr:30, armor:3, isHuman:false, canFlee:true, win:'__noop__', lose:'DEAD',
       onWin:()=>{ document.getElementById('cbt-area').classList.add('hidden'); document.getElementById('scroll-area').classList.remove('in-combat'); document.getElementById('text-win').style.display=''; cbtState=null; _restoreNodeChoices(); }
      });
     renderChoices([]); scrollToTop();
    }}]);
    scrollToTop();
    return;
   } else if(roll <= 4){
    // 幻覚：幸運SR、失敗で強さ-3
    setupSavingRoll({
     attr:'lk', level:1,
     onFail:()=>{
      const story = document.getElementById('story');
      applyDungeonStPenalty(PC, 3);
      story.innerHTML += `<div style="color:#c8b8a0;font-size:calc(var(--font-sm) + 1px);margin-top:8px"> <b>幻覚・神経の緊張。</b>ダンジョンを出るまで強さ-3（残り${PC.st}）</div>`;
      updateHUD();
      _restoreNodeChoices();
     },
     onSuccess:()=>{
      const story = document.getElementById('story');
      story.innerHTML += `<div style="color:#c8b8a0;font-size:var(--font-sm);margin-top:8px"> 神経が張り詰めたが、気のせいだった。</div>`;
      updateHUD();
      _restoreNodeChoices();
     },
    });
    return;
   } else {
    const story = document.getElementById('story');
    story.innerHTML += `<div style="color:#c8b8a0;font-size:var(--font-sm);margin-top:8px"> 小さな地下生物がそっと逃げていった。何も起こらなかった。</div>`;
    updateHUD();
    _restoreNodeChoices();
   }
  },
 }],
 },

 // ⑨ 壁にもたれた死体
 {
 id: 'corpse',
 icon: '',
 title: '壁にもたれた死体',
 desc: '壁にもたれかかるように座った冒険者の死体を見つける。装備は壊れ、比較的新しいようにも見える。',
 choices: (ev) => [
  {
  label: ' 近づいて調べる',
  fn: () => {
   const roll = d6();
   if(roll <= 2){
    const story = document.getElementById('story');
    // アンデッド
    story.innerHTML += `<div style="color:#e0d0d0;font-size:calc(var(--font-sm) + 1px);margin-top:8px"> <b>まだ死んでいなかった！</b>近づくと突然動き出した——アンデッドだ！</div>`;
    renderChoices([{label:'▶ OK', fn:()=>{
     startCombat({ name:'不死の冒険者', mr:35, armor:2, isHuman:false, canFlee:true,
      win:'__noop__', lose:'DEAD',
      onWin:()=>{
       document.getElementById('cbt-area').classList.add('hidden'); document.getElementById('scroll-area').classList.remove('in-combat');
       document.getElementById('text-win').style.display='';
       cbtState=null;
       document.getElementById('story').innerHTML += `<div style="color:#f0ece0;font-size:calc(var(--font-sm) + 1px);margin-top:8px"> アンデッドを倒した。</div>`;
       _restoreNodeChoices();
      },
     });
     renderChoices([]); scrollToTop();
    }}]);
    scrollToTop();
    return;
   } else if(roll <= 4){
    const story = document.getElementById('story');
    const msgs = ['「戻れ」','「光を消すな」','「奴らは壁の中にいる」','「信用するな」','「北の扉は開けるな」'];
    story.innerHTML += `<div style="color:#c8b8a0;font-size:calc(var(--font-sm) + 1px);margin-top:8px"> <b>最後のメモ。</b>死体の近くに血で書かれたメッセージがある：<span style="color:#f0ece0">${msgs[Math.floor(Math.random()*msgs.length)]}</span></div>`;
    updateHUD();
    _restoreNodeChoices();
   } else if(roll === 5){
    const story = document.getElementById('story');
    const treasure = generateTreasure(25);
    story.innerHTML += `<div style="color:#f0ece0;font-size:calc(var(--font-sm) + 1px);margin-top:8px"> <b>遺品発見。</b>袋の中に宝物が残っていた。<br>${treasure}</div>`;
    updateHUD();
    _restoreNodeChoices();
   } else {
    setupSavingRoll({
     attr:'lk', level:1,
     onFail:()=>{
      const story = document.getElementById('story');
      PC.lk = Math.max(1, PC.lk - 5);
      story.innerHTML += `<div style="color:#e0d8c8;font-size:calc(var(--font-sm) + 1px);margin-top:8px"> <b>呪いの残滓。</b>この場に死の気配が漂う。LK -5（残り${PC.lk}）</div>`;
      updateHUD();
      _restoreNodeChoices();
     },
     onSuccess:()=>{
      const story = document.getElementById('story');
      story.innerHTML += `<div style="color:#c8b8a0;font-size:var(--font-sm);margin-top:8px">冷たい気配を感じたが、何も起こらなかった。</div>`;
      updateHUD();
      _restoreNodeChoices();
     },
    });
   }
  },
  },
  {
  label: ' 無視して進む',
  fn: () => {
   const story = document.getElementById('story');
   story.innerHTML += `<div style="color:#c0b098;font-size:var(--font-sm);margin-top:8px">目を背けて先へ進んだ。</div>`;
   _restoreNodeChoices();
  },
  },
 ],
 },

 // ⑩ 通路をふさぐ腐臭
 {
 id: 'stench',
 icon: '',
 title: '通路をふさぐ腐臭',
 desc: '突然強い腐臭が漂ってくる。まるで大量の腐った肉がどこかにあるような匂いだ。',
 choices: (ev) => [
  {
  label: ' 臭いの元を調べる',
  fn: () => {
   const roll = d6();
   if(roll <= 2){
    const story = document.getElementById('story');
    story.innerHTML += `<div style="color:#e0d0d0;font-size:calc(var(--font-sm) + 1px);margin-top:8px"> <b>食事中のモンスター！</b>近くで何かが死体を食べていた——気づかれた！</div>`;
    renderChoices([{label:'▶ OK', fn:()=>{
     startCombat({ name:'腐肉食い', mr:28, armor:1, isHuman:false, canFlee:true,
      win:'__noop__', lose:'DEAD',
      onWin:()=>{
       document.getElementById('cbt-area').classList.add('hidden'); document.getElementById('scroll-area').classList.remove('in-combat');
       document.getElementById('text-win').style.display='';
       cbtState=null;
       document.getElementById('story').innerHTML += `<div style="color:#f0ece0;font-size:calc(var(--font-sm) + 1px);margin-top:8px"> 腐肉食いを倒した。</div>`;
       _restoreNodeChoices();
      },
     });
     renderChoices([]); scrollToTop();
    }}]);
    scrollToTop();
    return;
   } else if(roll <= 4){
    const story = document.getElementById('story');
    const treasure = generateTreasure(20);
    story.innerHTML += `<div style="color:#c8b8a0;font-size:calc(var(--font-sm) + 1px);margin-top:8px"> <b>腐乱死体。</b>古い死体が転がっていた。探索すると装備が見つかった。<br>${treasure}</div>`;
    updateHUD();
    _restoreNodeChoices();
   } else if(roll === 5){
    setupSavingRoll({
     attr:'con', level:2,
     onFail:()=>{
      const story = document.getElementById('story');
      applyDungeonConPenalty(PC, 5); updateHUD();
      story.innerHTML += `<div style="color:#e0d0d0;font-size:calc(var(--font-sm) + 1px);margin-top:8px"> <b>毒性のガス！</b>腐敗した空気が溜まっていた。ダンジョンを出るまで体力-5（残り${PC.con}）</div>`;
      _restoreNodeChoices();
     },
     onSuccess:()=>{
      const story = document.getElementById('story');
      story.innerHTML += `<div style="color:#c8b8a0;font-size:var(--font-sm);margin-top:8px"> 腐敗ガスを吸ったが、耐えた。</div>`;
      _restoreNodeChoices();
     },
    });
   } else {
    const story = document.getElementById('story');
    story.innerHTML += `<div style="color:#c8b8a0;font-size:var(--font-sm);margin-top:8px"> <b>死の痕跡。</b>最近何かが殺されたらしい。床に血や骨が散乱している。</div>`;
    updateHUD();
    _restoreNodeChoices();
   }
  },
  },
  {
  label: ' 臭いを避けて通り過ぎる',
  fn: () => {
   const story = document.getElementById('story');
   story.innerHTML += `<div style="color:#c0b098;font-size:var(--font-sm);margin-top:8px">息を止めて臭いの元を避け、先へ進んだ。</div>`;
   _restoreNodeChoices();
  },
  },
 ],
 },

 // ⑪ 閉じない傷
 {
 id: 'wound',
 icon: '',
 title: '閉じない傷',
 desc: '気づかないうちに浅い切り傷を負っていることに気づく。鋭い刃物で切られたようだが、周囲に罠や敵の気配はない。奇妙なことに、傷はなかなか血が止まらない。',
 choices: (ev) => [{
  label: ' 傷を確認する',
  fn: () => {
   const roll = d6();
   if(roll <= 2){
    setupSavingRoll({
     attr:'dex', level:1,
     onFail:()=>{
      const story = document.getElementById('story');
      PC.con = Math.max(0, PC.con - 1); updateHUD();
      story.innerHTML += `<div style="color:#e0d0d0;font-size:calc(var(--font-sm) + 1px);margin-top:8px"> <b>見えない刃。</b>空間に見えない罠の残骸がある。追加でCON -1（残り${PC.con}）</div>`;
      _restoreNodeChoices();
     },
     onSuccess:()=>{
      const story = document.getElementById('story');
      story.innerHTML += `<div style="color:#c8b8a0;font-size:var(--font-sm);margin-top:8px"> 見えない刃の残骸があったが、素早く避けた。</div>`;
      _restoreNodeChoices();
     },
    });
   } else if(roll <= 4){
    const story = document.getElementById('story');
    story.innerHTML += `<div style="color:#c8b8a0;font-size:var(--font-sm);margin-top:8px"> 床や壁に埋まっていた金属片で切っただけ。布で縛れば問題ない。</div>`;
    updateHUD();
    _restoreNodeChoices();
   } else if(roll === 5){
    setupSavingRoll({
     attr:'lk', level:1,
     onFail:()=>{
      const story = document.getElementById('story');
      PC.lk = Math.max(1, PC.lk - 5);
      story.innerHTML += `<div style="color:#e0d8c8;font-size:calc(var(--font-sm) + 1px);margin-top:8px"> <b>呪われた傷。</b>傷口が黒ずんでくる。LK -5（残り${PC.lk}）</div>`;
      updateHUD();
      _restoreNodeChoices();
     },
     onSuccess:()=>{
      const story = document.getElementById('story');
      story.innerHTML += `<div style="color:#c8b8a0;font-size:var(--font-sm);margin-top:8px">傷は気になるが、呪いは感じない。</div>`;
      updateHUD();
      _restoreNodeChoices();
     },
    });
   } else {
    const story = document.getElementById('story');
    PC.lk += 5;
    story.innerHTML += `<div style="color:#f0ece0;font-size:calc(var(--font-sm) + 1px);margin-top:8px"> <b>奇妙な感覚。</b>傷はすぐ止まったが、危険を察知する感覚が研ぎ澄まされた気がする。LK +5（永続）（LK ${PC.lk}）</div>`;
    updateHUD();
    _restoreNodeChoices();
   }
  },
 }],
 },

 // ⑫ 壁の中から叩く音
 {
 id: 'wall_knock',
 icon: '',
 title: '壁の中から叩く音',
 desc: '壁の内側から「ドン……ドン……」と鈍い叩く音が聞こえる。まるで誰かが中から壁を叩いているようだ。',
 choices: (ev) => [
  {
  label: ' 壁を壊して助ける（強さ Lv1 能力値テスト）',
  fn: () => {
   setupSavingRoll({
    attr:'st', level:1,
    onFail:()=>{
     const story = document.getElementById('story');
     story.innerHTML += `<div style="color:#f0ddd8;font-size:calc(var(--font-sm) + 1px);margin-top:8px"> 壁を叩いたが壊せなかった。音は次第に消えていった。</div>`;
     _restoreNodeChoices();
    },
    onSuccess:()=>{
     const story = document.getElementById('story');
     const roll = d6();
     if(roll <= 2){
      story.innerHTML += `<div style="color:#e0d0d0;font-size:calc(var(--font-sm) + 1px);margin-top:8px"> <b>封じられたもの！</b>壁を壊すと中から危険なモンスターが解放された——！</div>`;
      renderChoices([{label:'▶ OK', fn:()=>{
       startCombat({ name:'封印されていた怪物', mr:45, armor:4, isHuman:false, canFlee:false, win:'__noop__', lose:'DEAD',
         onWin:()=>{ document.getElementById('cbt-area').classList.add('hidden'); document.getElementById('scroll-area').classList.remove('in-combat'); document.getElementById('text-win').style.display=''; cbtState=null; _restoreNodeChoices(); }
        });
       renderChoices([]); scrollToTop();
      }}]);
      scrollToTop();
      return;
     } else if(roll <= 4){
      const treasure = generateTreasure(30);
      story.innerHTML += `<div style="color:#c8b8a0;font-size:calc(var(--font-sm) + 1px);margin-top:8px"> <b>閉じ込められた冒険者の死体。</b>古い空洞で飢えて死んだ冒険者の遺体。装備や袋から宝物を得た。<br>${treasure}</div>`;
      updateHUD();
      _restoreNodeChoices();
     } else {
      setupSavingRoll({
       attr:'lk', level:1,
       onFail:()=>{
        const story2 = document.getElementById('story');
        PC.lk = Math.max(1, PC.lk - 5);
        story2.innerHTML += `<div style="color:#e0d8c8;font-size:calc(var(--font-sm) + 1px);margin-top:8px"> <b>呪われた空洞。</b>中には何もない。しかし不吉な気配に取り憑かれた。LK -5（残り${PC.lk}）</div>`;
        updateHUD();
        _restoreNodeChoices();
       },
       onSuccess:()=>{
        const story2 = document.getElementById('story');
        story2.innerHTML += `<div style="color:#c8b8a0;font-size:var(--font-sm);margin-top:8px">空洞には何もなかった。不思議な冷気が漂うだけだ。</div>`;
        updateHUD();
        _restoreNodeChoices();
       },
      });
     }
    },
   });
  },
  },
  {
  label: ' 無視して進む（魅力-1）',
  fn: () => {
   PC.chr = Math.max(1, PC.chr - 1);
   const story = document.getElementById('story');
   story.innerHTML += `<div style="color:#b8a890;font-size:var(--font-sm);margin-top:8px">心を鬼にして通り過ぎた。冒険者らしくない振る舞いに後悔が残る。CHR -1（残り${PC.chr}）</div>`;
   updateHUD();
   _restoreNodeChoices();
  },
  },
 ],
 },

 // ⑬ 誰かの祈り
 {
 id: 'prayer',
 icon: '',
 title: '誰かの祈り',
 desc: '低く震えるような祈りの声がどこからか聞こえてくる。言葉は古い言語のようで、はっきりとは理解できない。祈りは断続的に続き、やがて突然止まる。',
 choices: (ev) => [{
  label: ' 声の方向を調べる',
  fn: () => {
   const story = document.getElementById('story');
   const roll = d6();
   if(roll <= 2){
    story.innerHTML += `<div style="color:#e0d0d0;font-size:calc(var(--font-sm) + 1px);margin-top:8px"> <b>狂信者の儀式！</b>近くで邪悪な儀式が行われていた——!</div>`;
    renderChoices([{label:'▶ OK', fn:()=>{
     startCombat({ name:'邪教の信徒', mr:32, armor:2, isHuman:true, canFlee:true, win:'__noop__', lose:'DEAD',
       onWin:()=>{ document.getElementById('cbt-area').classList.add('hidden'); document.getElementById('scroll-area').classList.remove('in-combat'); document.getElementById('text-win').style.display=''; cbtState=null; _restoreNodeChoices(); }
      });
     renderChoices([]); scrollToTop();
    }}]);
    scrollToTop();
    return;
   } else if(roll <= 4){
    // 聖なる護符：重量1、売値200GP
    PC.invEquip = PC.invEquip || [];
    PC.invEquip.push('聖なる護符');
    PC.con = Math.min(PC.maxCon, PC.con + 10);
    story.innerHTML += `<div style="color:#f0ece0;font-size:calc(var(--font-sm) + 1px);margin-top:8px"> <b>死者の祈り。</b>古い祭壇と朽ちた死体のそばに聖なる護符を見つけた。護符を手に入れた（重量1、売値200GP）。CON +10（残り${PC.con}/${PC.maxCon}）</div>`;
   } else if(roll === 5){
    story.innerHTML += `<div style="color:#c8b8a0;font-size:var(--font-sm);margin-top:8px">残響：昔この場所で行われた祈りが奇妙な形で残っているだけ。何も起こらないが、空気は重い。</div>`;
   } else {
    PC.lk += 5;
    story.innerHTML += `<div style="color:#f0ece0;font-size:calc(var(--font-sm) + 1px);margin-top:8px"> <b>守護の気配。</b>祈りを聞いた者の心が落ち着く。LK +5（永続）（LK ${PC.lk}）</div>`;
   }
   updateHUD();
   _restoreNodeChoices();
  },
 }],
 },

 // ⑭ 黄金の山
 {
 id: 'gold_pile',
 icon: '',
 title: '黄金の山',
 desc: '通路の先に、無造作に積み上げられた黄金の山を見つける。金貨、杯、宝石、装飾品が床一面に散らばっている。しかし守りが見えない。空気は重く、何かがおかしい。',
 choices: (ev) => [
  {
  label: ' 手を出す',
  fn: () => {
   const roll = d6();
   if(roll <= 2){
    const story = document.getElementById('story');
    story.innerHTML += `<div style="color:#e0d0d0;font-size:calc(var(--font-sm) + 1px);margin-top:8px"> <b>守護者の目覚め！</b>財宝に触れた瞬間、眠っていた守護者が現れた——！</div>`;
    renderChoices([{label:'▶ OK', fn:()=>{
     startCombat({ name:'財宝の守護者', mr:60, armor:6, isHuman:false, canFlee:false, win:'__noop__', lose:'DEAD',
       onWin:()=>{ document.getElementById('cbt-area').classList.add('hidden'); document.getElementById('scroll-area').classList.remove('in-combat'); document.getElementById('text-win').style.display=''; cbtState=null; _restoreNodeChoices(); }
      });
     renderChoices([]); scrollToTop();
    }}]);
    scrollToTop();
    return;
   } else if(roll <= 4){
    setupSavingRoll({
     attr:'con', level:2,
     onFail:()=>{
      const story = document.getElementById('story');
      PC.lk = Math.max(1, PC.lk - 5);
      const torchMsg3 = extinguishTorch();
      story.innerHTML += `<div style="color:#e0d0d0;font-size:calc(var(--font-sm) + 1px);margin-top:8px"> <b>崩れる宝と毒ガス！</b>黄金の山が崩れ、毒ガスが噴き出した。気絶した。宝も消えた。LK -5（残り${PC.lk}）<br><span style="color:#f0ddd0;font-size:var(--font-sm)">${torchMsg3}</span></div>`;
      updateHUD();
      _restoreNodeChoices();
     },
     onSuccess:()=>{
      const story = document.getElementById('story');
      PC.lk = Math.max(1, PC.lk - 5);
      story.innerHTML += `<div style="color:#e8e0d0;font-size:calc(var(--font-sm) + 1px);margin-top:8px"> 毒ガスが噴き出したが耐えた。宝は消えた。LK -5（残り${PC.lk}）</div>`;
      updateHUD();
      _restoreNodeChoices();
     },
    });
   } else if(roll === 5){
    const story = document.getElementById('story');
    const gp = 200 + Math.floor(Math.random()*301);
    gainGPAll(gp); updateHUD();
    story.innerHTML += `<div style="color:#f0ece0;font-size:calc(var(--font-sm) + 1px);margin-top:8px"> <b>本物の財宝！</b>罠はなかった。大量の金貨を手に入れた！+${gp}GP</div>`;
    _restoreNodeChoices();
   } else {
    const story = document.getElementById('story');
    const gp = 500 + Math.floor(Math.random()*501);
    const jewel = { name:'伝説の宝石', priceGP: 1000 };
    PC.invJewels = PC.invJewels || [];
    PC.invJewels.push(jewel);
    gainGPAll(gp); updateHUD();
    story.innerHTML += `<div style="color:#ff88ff;font-size:calc(var(--font-sm) + 1px);margin-top:8px"> <b>伝説級の戦利品！</b>財宝の中から特別に高価な宝石を見つけた！+${gp}GP ＋ 伝説の宝石（売値1000GP）</div>`;
    _restoreNodeChoices();
   }
  },
  },
  {
  label: ' 危険を感じて立ち去る',
  fn: () => {
   const story = document.getElementById('story');
   story.innerHTML += `<div style="color:#c0b098;font-size:var(--font-sm);margin-top:8px">本能的な危機感を信じ、財宝に手を出さずに立ち去った。賢明な判断かもしれない。</div>`;
   _restoreNodeChoices();
  },
  },
 ],
 },

 // ⑮ 黒い泉
 {
 id: 'black_spring',
 icon: '',
 title: '黒い泉',
 desc: '行く先に小さな黒い泉を見つける。水は静かで鏡のように暗く、底が見えない。奇妙なことに、水面には自分の姿が少し違って映る。まるで別の自分を見ているようだ。',
 choices: (ev) => [
  {
  label: ' 水を飲む・触れる',
  fn: () => {
   const story = document.getElementById('story');
   const roll = d6();
   const effects = [
    ()=>{ PC.con = Math.max(1, Math.floor(PC.con/2)); PC.maxCon = Math.max(1, Math.floor(PC.maxCon/2)); return `<span style="color:#e0d0d0"> <b>生命の吸収。</b>体力が奪われる。体力 1/2（残り${PC.con}/${PC.maxCon}）</span>`; },
    ()=>{ PC.st = Math.max(1, Math.floor(PC.st/2)); PC.maxSt = Math.max(1, Math.floor((PC.maxSt||PC.st)/2)); return `<span style="color:#e0d0d0"> <b>弱体化。</b>体が重くなる。ST 1/2（残り${PC.st}）</span>`; },
    ()=>{ PC.iq = Math.max(1, Math.floor(PC.iq/2)); return `<span style="color:#e0d0d0"> <b>精神の揺らぎ。</b>不安と幻覚。IQ 1/2（残り${PC.iq}）</span>`; },
    ()=>{ PC.dex *= 2; return `<span style="color:#f0ece0"> <b>奇妙な活力。</b>体が軽くなる。DEX ×2（${PC.dex}）</span>`; },
    ()=>{ PC.st *= 2; PC.maxSt = (PC.maxSt||PC.st)*2; return `<span style="color:#f0ece0"> <b>強化。</b>肉体が強くなる。ST ×2（${PC.st}）</span>`; },
    ()=>{
     // プレイヤーが選択
     story.innerHTML += `<div style="color:#e8e0d8;font-size:calc(var(--font-sm) + 1px);margin-top:8px"> <b>深い覚醒。</b>精神が研ぎ澄まされる。どちらを強化する？</div>`;
     renderChoices([
      { label:` IQ ×2（現在${PC.iq}→${PC.iq*2}）`, fn:()=>{ PC.iq *= 2; document.getElementById('story').innerHTML += `<div style="color:#f0ece0">IQ ×2（${PC.iq}）</div>`; updateHUD(); _restoreNodeChoices(); } },
      { label:` LK ×2（現在${PC.lk}→${PC.lk*2}）`, fn:()=>{ PC.lk *= 2; document.getElementById('story').innerHTML += `<div style="color:#f0ece0">LK ×2（${PC.lk}）</div>`; updateHUD(); _restoreNodeChoices(); } },
     ]);
     return null; // 選択肢を出したので処理継続しない
    },
   ];
   const resultHtml = effects[roll-1]();
   if(resultHtml !== null){
    story.innerHTML += `<div style="font-size:calc(var(--font-sm) + 1px);margin-top:8px">${resultHtml}<br><span style="color:#c0b098;font-size:calc(var(--font-sm) - 1px)">※能力値の変化は恒久的</span></div>`;
    updateHUD();
    _restoreNodeChoices();
   }
  },
  },
  {
  label: ' 無視して進む',
  fn: () => {
   const story = document.getElementById('story');
   story.innerHTML += `<div style="color:#c0b098;font-size:var(--font-sm);margin-top:8px">黒い泉を避けて先へ進んだ。</div>`;
   _restoreNodeChoices();
  },
  },
 ],
 },
];

function rollDungeonEvent(){
 if(Math.random() >= 0.03) return null; // 3%
 return DUNGEON_EVENTS[Math.floor(Math.random() * DUNGEON_EVENTS.length)];
}

function startDungeonEvent(ev){
 const story = document.getElementById('story');
 story.innerHTML += `
 <div style="border-top:1px solid var(--info-border);margin-top:10px;padding-top:8px">
 <div style="color:#ece8e0;font-size:calc(var(--font-sm) + 1px)">${ev.icon} <b>${ev.title}</b></div>
 <div style="color:var(--white2);font-size:var(--font-sm);margin-top:4px">${ev.desc}</div>
 </div>`;
 const choices = typeof ev.choices === 'function' ? ev.choices(ev) : ev.choices;
 renderChoices(choices.map(c => ({
 label: c.label,
 fn: c.fn,
 go: '__travel__', // fn処理後はgo不要
 })));
 scrollToTop();
}

// イベント後に通常の選択肢を復元するヘルパー
// 気絶・強制消灯時に予備松明を自動点火するヘルパー
function extinguishTorch(){
 PC._torchTurns = 0;
 if((PC._torchStock||0) > 0){
  PC._torchTurns = 10;
  return ' 気絶している間に松明が消えたが、目が覚めてすぐ予備の松明に火をつけた。（残り' + PC._torchStock + '本）';
 }
 return ' 松明が消え、予備もない。暗闇が広がる……';
}

function _restoreNodeChoices(){
 // OKボタンを挟んでから選択肢を復元（表示を読む時間を確保）
 // YDダンジョン内なら nodeId/floor をスナップショットして保持
 const _snap = (PC._yeldunDungeon && _ydState)
  ? { nodeId: _ydState.nodeId, floor: _ydState.floor }
  : null;

 const okBtn = document.createElement('button');
 okBtn.className = 'choice-btn';
 okBtn.style.cssText = 'margin-top:10px;border-color:#b0a080;color:#f0ece0';
 okBtn.textContent = '▶ OK';
 okBtn.onclick = ()=>{
  if(_snap && PC._yeldunDungeon){
   // 松明消費をスキップして現ノードをそのまま再描画
   const dung = PC._yeldunDungeon;
   const floor = _snap.floor;
   const nodeId = _snap.nodeId;
   dung.currentFloor = floor;
   const node = ydGetNode(floor, nodeId);
   if(node){
    document.getElementById('cbt-area').classList.add('hidden'); document.getElementById('scroll-area').classList.remove('in-combat');
    document.getElementById('text-win').style.display = '';
    const _ok = document.getElementById('cbt-ok-area');
    if(_ok){ _ok.innerHTML=''; _ok.style.display='none'; }
    document.getElementById('story').innerHTML = ydNodeTxt(node, floor);
    const _restoreActionCh = ydActionChoices(node, floor);
    const _restoreMoveChRaw = ydMoveChoices(node, floor);
    const _restoreSuppressMove = _restoreActionCh.length > 0 && node.type !== 'stairs';
    const _ydChoices = [
     ..._restoreActionCh,
     ...(_restoreSuppressMove ? _restoreMoveChRaw.filter(c=>c._alwaysShow) : _restoreMoveChRaw),
    ];
    if(_eligibleOutOfCombatCasters(nodeId).length && !cbtState){
     _ydChoices.push({ label:' 魔法を使う', fn:()=>openSpellModal('', null, nodeId), _isMagicBtn:true });
    }
    renderChoices(_ydChoices);
    updateHUD();
   }
   return;
  }
  const node = NODES[currentNodeId];
  if(node){
   const _nc = typeof node.choices==='function' ? node.choices() : node.choices||[];
   renderChoices(_appendMagicChoice(_nc, node, currentNodeId));
  }
  updateHUD();
 };
 // 既存の選択肢をOKボタンのみに差し替え
 const choicesEl = document.getElementById('choices');
 choicesEl.innerHTML = '';
 choicesEl.appendChild(okBtn);
}

function removeRing(){
 if(!PC._magicRing) return;
 PC._magicRing = false;
 PC.lk = Math.max(1, PC.lk - 10);
 showSaveToast(' 指輪を外した。LK -10');
 renderStatusPanel();
}

function confirmRetire(){
 const hasProp = PC.properties && Object.keys(PC.properties).length > 0;
 if(hasProp){
  // 拠点あり：選択肢を表示
  const story = document.getElementById('story');
  story.innerHTML = `<span style="color:#f0ece0"> ${PC.name}を引退させますか？</span><br><br>`
   +`<span style="color:#c0b098">拠点を持っています。次の冒険者に引き継ぐことができます。</span>`;
  renderChoices([
   {label:' 拠点に住んで引退（拠点・住人として登録）', fn:()=>{
    if(!confirm(`${PC.name}を拠点に住まわせて引退しますか？`)) return;
    archiveCurrentPC('retire_to_property');
    closeInventory();
    go('RETIRE');
   }},
   {label:' そのまま引退（拠点のみ引き継ぎ）', fn:()=>{
    if(!confirm(`${PC.name}を引退させますか？`)) return;
    archiveCurrentPC('retire');
    closeInventory();
    go('RETIRE');
   }},
   {label:'← キャンセル', fn:()=>go(currentNodeId)},
  ]);
 } else {
  if(!confirm(`${PC.name}を引退させますか？\nこの冒険者のプレイは終了します。`)) return;
  archiveCurrentPC('retire');
  closeInventory();
  go('RETIRE');
 }
}

// エンディング画面の「続ける」HTML（仲間NPC一覧）
// 今回死亡・引退したPC自身のパーティメンバーのみに絞り込む（別のセーブデータ由来のNPCを混在させないため）
function buildContinueHtml(reason){
 const ws = loadWorldState();
 if(!ws || !ws.knownNPCs || ws.knownNPCs.length === 0) return '';
 const ownNpcIds = new Set((PC.party||[]).filter(n=>n.con>0).map(n=>n._npcId));
 // {候補NPC, ws.knownNPCsでの元のインデックス} のペアに絞り込む（startAsNPCがインデックスを使うため）
 const candidates = ws.knownNPCs
  .map((n,i)=>({npc:n, idx:i}))
  .filter(c=>ownNpcIds.has(c.npc._npcId));
 if(!candidates.length) return '';
 const raceJa = r=>({human:'人間',elf:'エルフ',dwarf:'ドワーフ',halfling:'ハーフリング',fairy:'フェアリー',leprechaun:'レプラコーン',troll:'トロール',ogre:'オーガ',orc:'オーク',goblin:'ゴブリン'}[r]||r);
 const typeJa = t=>({warrior:'戦士',rogue:'盗賊',wizard:'魔法使い'}[t]||t);
 const rows = candidates.map(({npc:n, idx:i})=>`
 <div style="background:var(--panel);border:1px solid var(--panel2);border-radius:3px;padding:8px;margin-bottom:5px;display:flex;justify-content:space-between;align-items:center">
 <div>
 <span style="color:#f0ece0;font-size:var(--font-sm)">${n.name}</span>
 <span style="color:var(--white2);font-size:calc(var(--font-sm) - 2px);margin-left:6px">${raceJa(n.race)}の${typeJa(n.type)} Lv${n.level||1}</span>
 <div style="font-size:calc(var(--font-sm) - 2px);color:#d8d0c0;margin-top:2px">CON ${n.con}/${n.maxCon}　ST ${n.st}　IQ ${n.iq}</div>
 </div>
 <button onclick="startAsNPC(${i})"
 style="font-size:calc(var(--font-sm) - 3px);padding:6px 10px;background:var(--ink);border:1px solid var(--bark);color:#f0ece0;font-family:system-ui,sans-serif;cursor:pointer;border-radius:2px">
 この者で<br>プレイ
 </button>
 </div>`).join('');
 return `<div style="margin-top:14px;border-top:1px solid var(--void);padding-top:10px">
 <div style="font-size:calc(var(--font-sm) - 2px);color:#e8e0d8;margin-bottom:8px"> 仲間だった者でプレイを続ける</div>
 ${rows}
 </div>`;
}

// エンディング共通選択肢
// 全スロット中、最も新しいセーブデータを読み込む
function loadMostRecentSave(){
 let bestSlot = null, bestTime = -1, useAutoSave = false;
 for(let s=1; s<=SAVE_SLOT_COUNT; s++){
  const raw = localStorage.getItem(getSaveKey(s));
  if(!raw) continue;
  try{
   const d = JSON.parse(raw);
   if(d.savedAt > bestTime){ bestTime = d.savedAt; bestSlot = s; useAutoSave = false; }
  }catch(e){}
 }
 // 自動セーブも比較対象に含める
 {
  const asRaw = localStorage.getItem(AUTOSAVE_KEY);
  if(asRaw){
   try{
    const d = JSON.parse(asRaw);
    if(d.savedAt > bestTime){ bestTime = d.savedAt; useAutoSave = true; }
   }catch(e){}
  }
 }
 if(useAutoSave){ loadAutoSave(); return; }
 if(bestSlot == null){ showSaveToast('セーブデータが見つかりません'); return; }
 loadGame(bestSlot);
}

// いずれかのスロット、または自動セーブにデータが存在するか
function hasAnySave(){
 for(let s=1; s<=SAVE_SLOT_COUNT; s++){
  if(localStorage.getItem(getSaveKey(s))) return true;
 }
 if(localStorage.getItem(AUTOSAVE_KEY)) return true;
 return false;
}

function buildEndChoices(){
 return [
 ...(hasAnySave() ? [{label:' 直近のセーブデータをロードする', fn:()=>loadMostRecentSave(), go:'__travel__'}] : []),
 {label:' 新しいPCを作る（暦を引き継ぐ）', fn:()=>startNewPCInherit(), go:'__travel__'},
 {label:' NEW GAME（最初から）', fn:()=>startNewGame(), go:'__travel__'},
 ];
}

// 仲間NPCをPCとして引き継ぎ開始
function startAsNPC(npcIdx){
 const ws = loadWorldState();
 if(!ws) return;
 const npc = ws.knownNPCs[npcIdx];
 if(!npc) return;

 // 前のキャラクターが最後にいた町を引き継ぐ（Object.assign前に確保しておく）
 const lastTown = PC.town || ws.lastTown || 'khazan';
 // 爵位は血縁の子にのみ引き継がせるため、クリアされる前に確保しておく
 const inheritedNobilityTitle = PC._nobilityTitle || null;

 // GAME_TIMEを引き継ぐ
 GAME_TIME.totalDays = ws.totalDays;

 // NPCのデータをPCに転写
 Object.assign(PC, JSON.parse(JSON.stringify(npc)));
 PC.town = lastTown;
 // PCとして不要なNPC固有フィールドをクリア
 PC.party = [];
 PC.quests = [];
 PC.lifeEvents = []; // ライフイベントは新PCのものからスタート
 PC.spdBase = PC.spd;
 // 前PCの_フラグ類をクリア（世界状態はworldStateから引き継ぐ）
 const keepFlags = new Set(['_startTown','_npcId','_fiefCharters']);
 Object.keys(PC).filter(k=>k.startsWith('_') && !keepFlags.has(k)).forEach(k=>{ delete PC[k]; });
 // 年齢・誕生日を、後継NPC自身のデータから算出し直す
 // （NPCのbirthDayは起点からの経過日数、PCのbirthDay/Month/Yearは暦の年月日で意味が異なるため、
 //   Object.assignで混同されないよう、旧PCの暦データを使わず必ずここで作り直す）
 {
  const npcBirthDay = npc.birthDay; // Object.assign前のnpc本体の値（=経過日数ベース）を参照
  const ageYears = npcBirthDay != null
   ? Math.max(0, Math.floor((GAME_TIME.totalDays - npcBirthDay) / 365))
   : (npc.age || 20);
  const curDate = getCurrentDate();
  PC.age = ageYears;
  PC.birthYear = curDate.year - ageYears;
  PC.birthMonth = Math.floor(Math.random() * 12) + 1;
  PC.birthDay = Math.floor(Math.random() * 30) + 1;
 }
 if(PC.lifespan == null) PC.lifespan = rollLifespan(PC.race);

 // 前PCの子として生まれた後継者の場合、出自にその血縁を明記する
 if(PC.parents && PC.parents.pc){
  const parentName = PC.parents.pc;
  const parentGone = ws.lastReason === 'dead';
  const HEIR_MOTIVE_DEAD = [
   '親が命を落とした真相を、この目で確かめたい。',
   '親が果たせなかった夢を、代わりに叶えたい。',
   '親のように名を残す冒険者になりたい。',
   '親を弔うため、その足跡をたどる旅に出た。',
   '親が遺した借りを、自分の手で返したい。',
  ];
  const HEIR_MOTIVE_RETIRED = [
   '隠居した親を、いつか超えてみせたい。',
   '幼い頃に聞いた親の武勇伝に、ずっと憧れていた。',
   '親のような一人前の冒険者だと、自分の力で示したい。',
   '親の名を汚さぬよう、恥じない生き方をしたい。',
   '親が引退してなお語り継がれる逸話に、自分も並びたい。',
  ];
  PC.background = {
   family: `冒険者「${parentName}」の子として生まれ育った。${parentGone ? '親の背中を追い、自らも剣を取ることを決めた。' : '親から冒険の心得を受け継ぎ、自らも旅立つことにした。'}`,
   motive: (PC.background && PC.background.motive) || pick(parentGone ? HEIR_MOTIVE_DEAD : HEIR_MOTIVE_RETIRED)
  };
  // 爵位は血縁の子にのみ引き継がれる（ゲーム内世代交代でも家督として継承される扱い）
  if(inheritedNobilityTitle){
   PC._nobilityTitle = inheritedNobilityTitle;
   addLifeEvent('', `親より「${inheritedNobilityTitle}」の爵位を継いだ。`);
  }
 }

 // ワールドからこのNPCを除去
 ws.knownNPCs.splice(npcIdx, 1);
 // 拠点を引き継ぎ（worldStateの最新データを使用）
 if(ws.properties) PC.properties = JSON.parse(JSON.stringify(ws.properties));
 // 混沌・飢饉の引き継ぎ
 if(ws.chaosNest) PC._chaosNest = JSON.parse(JSON.stringify(ws.chaosNest));
 if(ws.famineYear) PC._famineYear = ws.famineYear;
 if(ws.famineHeroName) PC._famineHeroName = ws.famineHeroName;
 // 地方英雄・英雄フラグは引き継がない（新しいキャラクターが自分で獲得する必要がある）
 if(ws.regionLegends) PC._regionLegends = JSON.parse(JSON.stringify(ws.regionLegends)); // 地方伝説の英雄（歴代）は引き継ぐ
 PC.food = 0; // 前の代の食料は引き継がない
 rollLanguages(PC); // 後継キャラクターも新たにモンスター語の習得判定を行う
 PC.spouse = []; // 前の代の配偶者記録は引き継がない
 initTrust(lastTown); // 前の代の信頼度は引き継がない（新PCは自分の町の信頼度から再スタート）
 PC.wanted = {}; // 前の代の手配度は引き継がない
 // 農業豊凶の引き継ぎ
 if(ws.harvestYear) PC._harvestYear = ws.harvestYear;
 if(ws.harvestResult) PC._harvestResult = ws.harvestResult;
 if(ws.foodPriceMult) PC._foodPriceMult = ws.foodPriceMult;
 if(ws.harvestPriceApplied) PC._harvestPriceApplied = ws.harvestPriceApplied;
 // 地方状態システムの引き継ぎ（世界に残る記録なので、世代交代しても地方ごとに引き継がれる）
 if(ws.regionCondition) PC._regionCondition = JSON.parse(JSON.stringify(ws.regionCondition));
 if(ws.regionConditionAmbient) PC._regionConditionAmbient = JSON.parse(JSON.stringify(ws.regionConditionAmbient));
 // 危機的状況からのPC主導の回復の記録も引き継ぐ（記録自体は先代のものとして残り、未回復の「危機的に達した」フラグも持ち越す）
 if(ws.regionWasCrisis) PC._regionWasCrisis = JSON.parse(JSON.stringify(ws.regionWasCrisis));
 if(ws.regionCrisisRecord) PC._regionCrisisRecord = JSON.parse(JSON.stringify(ws.regionCrisisRecord));
 PC._regionConditionLastKey = undefined; // 新PCの最初のtickで現在月を基準に取り直す
 // 2026年10月4日：巣窟ダンジョン（全箇所）の状態を引き継ぐ（世代交代しても「空／稼働中」や
 // 次回再湧き予定日がリセットされないようにする）
 if(ws.lairDungeons){
  Object.entries(LAIR_DUNGEON_REG).forEach(([key, def])=>{
   if(ws.lairDungeons[key]) PC[def.stateProp] = JSON.parse(JSON.stringify(ws.lairDungeons[key]));
  });
 }
 saveWorldState(ws);

 // ゲーム画面へ
 ['title-screen','chargen','shop-area'].forEach(id => document.getElementById(id)?.classList.add('hidden'));
 const g = document.getElementById('game');
 g.classList.remove('hidden'); g.style.display = 'flex';
 updateHUD(); updateTimebar();
 go('TOWN_' + lastTown.toUpperCase());
 showSaveToast(` ${PC.name}として冒険が始まった！`);
}

// 新PCを作成・暦は引き継ぐ
function startNewPCInherit(){
 const ws = loadWorldState();
 if(ws) GAME_TIME.totalDays = ws.totalDays;
 if(ws && ws.properties) PC._inheritedProperties = JSON.parse(JSON.stringify(ws.properties));
 if(ws && ws.chaosNest) PC._inheritedChaosNest = JSON.parse(JSON.stringify(ws.chaosNest));
 if(ws && ws.famineYear){ PC._inheritedFamineYear = ws.famineYear; PC._inheritedFamineHeroName = ws.famineHeroName||''; }
 if(ws && ws.heroRegions) PC._inheritedHeroRegions = JSON.parse(JSON.stringify(ws.heroRegions));
 if(ws && ws.heroTowns) PC._inheritedHeroTowns = JSON.parse(JSON.stringify(ws.heroTowns));
 if(ws && ws.regionLegends) PC._inheritedRegionLegends = JSON.parse(JSON.stringify(ws.regionLegends));
 if(ws && ws.harvestYear){ PC._inheritedHarvestYear = ws.harvestYear; PC._inheritedHarvestResult = ws.harvestResult; PC._inheritedFoodPriceMult = ws.foodPriceMult; PC._inheritedHarvestPriceApplied = ws.harvestPriceApplied; }
 if(ws && ws.regionCondition) PC._inheritedRegionCondition = JSON.parse(JSON.stringify(ws.regionCondition));
 if(ws && ws.regionConditionAmbient) PC._inheritedRegionConditionAmbient = JSON.parse(JSON.stringify(ws.regionConditionAmbient));
 if(ws && ws.regionWasCrisis) PC._inheritedRegionWasCrisis = JSON.parse(JSON.stringify(ws.regionWasCrisis));
 if(ws && ws.regionCrisisRecord) PC._inheritedRegionCrisisRecord = JSON.parse(JSON.stringify(ws.regionCrisisRecord));
 if(ws && ws.lairDungeons) PC._inheritedLairDungeons = JSON.parse(JSON.stringify(ws.lairDungeons));
 ['title-screen','shop-area','game'].forEach(id=>{
 const el = document.getElementById(id);
 if(el){ el.classList.add('hidden'); if(id==='game') el.style.display='none'; }
 });
 document.getElementById('chargen').classList.remove('hidden');
 setTimeout(showTitleImage, 0);
 PC._inheritTime = true;
}

// 完全新規（暦リセット）
function startNewGame(){
 if(!confirm('暦をリセットして最初から始めますか？')) return;
 clearWorldState();
 location.reload();
}



// ══════════════════════════════════════════
//  TORCH SYSTEM
// _torchStock: 手持ち松明の総本数（点灯中の1本を含む）
// _torchTurns: 現在点灯中の残りターン（0=消灯）
//
// 購入時: _torchStock += 3
// 入場時: _torchStock>0 なら点火（_torchTurns=10）
// 移動時: _torchTurns-- → 0になったら次の1本を点火
// 入口表示: _torchStock をそのまま表示
// ══════════════════════════════════════════

function countTorches(){
 return PC._torchStock || 0;
}

// 入場ボタン押下時に呼ぶ
function initTorch(){
 PC._torchStock = PC._torchStock || 0;
 // 消灯中なら1本点火
 if(PC._torchTurns <= 0){
 if(PC._torchStock > 0){
 PC._torchTurns = 10;
 // stockは点灯中も含むのでここでは減らさない
 }
 }
}

// 松明インジケータHTML
function torchIndicator(){
 const stock = PC._torchStock || 0;
 const poisonBadge = PC._poisoned
 ? `<div style="font-family:monospace;font-size:calc(var(--font-sm) - 1px);color:var(--white);margin-bottom:4px;padding:4px 6px;background:#110c06;border:1px solid #585858;border-radius:3px"> 毒状態 ── 移動ごとに体力-1　治療: 宿屋で休む</div>`
 : '';
 const frostLvl = getFrostbiteLevel();
 const frostBadge = frostLvl > 0
 ? `<div style="font-family:monospace;font-size:calc(var(--font-sm) - 1px);color:${frostLvl>=4?'var(--danger)':frostLvl>=3?'var(--torch)':'var(--ice)'};margin-bottom:4px;padding:4px 6px;background:var(--ink);border:1px solid #484848;border-radius:3px"> ${FROSTBITE_EFFECTS[frostLvl].label}（SPD${FROSTBITE_EFFECTS[frostLvl].spd} DEX${FROSTBITE_EFFECTS[frostLvl].dex}）　治療: 宿屋で休む</div>`
 : '';
 const blindBadge = (PC._blindSpotRounds||0) > 0
 ? `<div style="font-family:monospace;font-size:calc(var(--font-sm) - 1px);color:#c8b8a0;margin-bottom:4px;padding:4px 6px;background:#0a0a12;border:1px solid #484858;border-radius:3px"> Blind Spot 有効　残り${PC._blindSpotRounds}ノード</div>`
 : '';
 if(PC._torchTurns > 0){
 const pct = Math.min(PC._torchTurns, 10) / 10;
 const filled = Math.min(PC._torchTurns, 10);
 const bar = '█'.repeat(filled) + '░'.repeat(10 - filled);
 const col = 'var(--white)';
 return poisonBadge + frostBadge + blindBadge + `<div style="font-family:monospace;font-size:calc(var(--font-sm) - 1px);color:${col};margin-bottom:8px;padding:4px 6px;background:#0a0800;border:1px solid #332200;border-radius:3px"> 松明 [${bar}] 残り${PC._torchTurns}ターン　残${stock}本</div>`;
 } else {
 return poisonBadge + frostBadge + blindBadge + `<div style="font-family:monospace;font-size:calc(var(--font-sm) - 1px);color:#e0d0d0;margin-bottom:8px;padding:4px 6px;background:#0a0000;border:1px solid #440000;border-radius:3px">️ 松明なし ── 真っ暗だ　残${stock}本</div>`;
 }
}

// 暗闇時の部屋テキスト
function darkRoomTxt(nodeId){
 const darks = [
 '何も見えない。足元の石畳だけが感触でわかる。壁に手を当てて立っている。',
 '完全な暗闇だ。どこに何があるかわからない。自分の手さえ見えない。',
 '漆黒の闇が広がっている。遠くから水の滴る音だけが聞こえる。',
 ];
 const d = darks[Math.abs(nodeId.length) % darks.length];
 return `<span style="color:#d8d0c0"></span><br><br>
 <span style="color:var(--white2)">${d}</span><br><br>
 <span style="color:#e0d0d0">松明がなければ進めない。このまま出口を探すか、引き返すか…</span>`;
}

// 暗闇時の選択肢（脱出SRか引き返す）
function darkRoomChoices(nodeId){
 // ノードIDのプレフィクスから正しい脱出ノードを決定
 const escapeMap = [
  { prefix:'SHRINE_',       escape:'SHRINE_DARK_ESCAPE' },
  { prefix:'SHR2_',         escape:'SHR2_DARK_ESCAPE' },
  { prefix:'CRYPT3_',       escape:'CRYPT3_DARK_ESCAPE' },
  { prefix:'CRYPT2_',       escape:'CRYPT2_DARK_ESCAPE' },
  { prefix:'CRYPT_',        escape:'CRYPT_DARK_ESCAPE' },
  { prefix:'ISKALD_',       escape:'ISKALD_DARK_ESCAPE' },
  { prefix:'SHM3_',         escape:'RUIN_DARK_ESCAPE' },
  { prefix:'SHM2_',         escape:'RUIN_DARK_ESCAPE' },
  { prefix:'AL_DNG_',       escape:'RUIN_DARK_ESCAPE' },
  { prefix:'AL_W_',         escape:'RUIN_DARK_ESCAPE' },
  { prefix:'AL_',           escape:'RUIN_DARK_ESCAPE' },
  { prefix:'FP_B2_',        escape:'FP_B2_ENTRANCE' },
  { prefix:'FP_',           escape:'FP_ENTRANCE' },
  { prefix:'NIFLAIR_',      escape:'NIFLAIR_DARK_ESCAPE' },
  { prefix:'LAIR2_',        escape:'LAIR2_DARK_ESCAPE' },
  { prefix:'LAIR3_B2_',     escape:'LAIR3_B2_DARK_ESCAPE' },
  { prefix:'LAIR3_B3_',     escape:'LAIR3_B3_DARK_ESCAPE' },
  { prefix:'LAIR3_',        escape:'LAIR3_DARK_ESCAPE' },
  { prefix:'LAIR4_',        escape:'LAIR4_DARK_ESCAPE' },
  { prefix:'LAIR5_B2_',     escape:'LAIR5_B2_DARK_ESCAPE' },
  { prefix:'LAIR5_B3_',     escape:'LAIR5_B3_DARK_ESCAPE' },
  { prefix:'LAIR5_B4_',     escape:'LAIR5_B4_DARK_ESCAPE' },
  { prefix:'LAIR5_',        escape:'LAIR5_DARK_ESCAPE' },
  { prefix:'LAIR6_',        escape:'LAIR6_DARK_ESCAPE' },
  { prefix:'LAIR7_',        escape:'LAIR7_DARK_ESCAPE' },
  { prefix:'OUTPOST_',      escape:'OUTPOST_DARK_ESCAPE' },
  { prefix:'HRUIN_',        escape:'HRUIN_DARK_ESCAPE' },
  { prefix:'LAIR_',         escape:'LAIR_DARK_ESCAPE' },
  { prefix:'RUIN_',         escape:'RUIN_DARK_ESCAPE' },
 ];
 let escapeNode = 'RUIN_DARK_ESCAPE';
 for(const {prefix, escape} of escapeMap){
  if(nodeId.startsWith(prefix)){ escapeNode = escape; break; }
 }
 return [
  {label:' 暗闇の中を出口へ向かう（運 Lv3 能力値テスト）', go:escapeNode},
 ];
}

const ELMARIA_NODES = new Set([
 'TOWN_ELSIA','TRAVEL_FROM_ELSIA','SHOP_ELSIA','TAVERN_ELSIA','RECRUIT_ELSIA',
 'TOWN_VERDA','TRAVEL_FROM_VERDA','SHOP_VERDA','TAVERN_VERDA','RECRUIT_VERDA',
 'TOWN_RIMHOLM','TRAVEL_FROM_RIMHOLM','SHOP_RIMHOLM','TAVERN_RIMHOLM','RECRUIT_RIMHOLM',
 'TOWN_MARAKAI','TRAVEL_FROM_MARAKAI','SHOP_MARAKAI','TAVERN_MARAKAI','RECRUIT_MARAKAI',
]);
const ZAHARA_NODES = new Set([
 'TOWN_AL_RASHID','TRAVEL_FROM_AL_RASHID','SHOP_AL_RASHID','TAVERN_AL_RASHID','RECRUIT_AL_RASHID',
 'TOWN_OASIS_FORT','TRAVEL_FROM_OASIS','SHOP_OASIS','TAVERN_OASIS','RECRUIT_OASIS',
 'TOWN_SAROON','TRAVEL_FROM_SAROON','SHOP_SAROON','TAVERN_SAROON','RECRUIT_SAROON',
 'TOWN_DUNA','TRAVEL_FROM_DUNA','SHOP_DUNA','TAVERN_DUNA','RECRUIT_DUNA',
]);
const DRAKLIM_NODES = new Set([
 'TOWN_YELDUN','TRAVEL_FROM_YELDUN','SHOP_YELDUN','TAVERN_YELDUN','RECRUIT_YELDUN',
 'TOWN_FROSTPEAK','TRAVEL_FROM_FROSTPEAK','SHOP_FROSTPEAK','TAVERN_FROSTPEAK','RECRUIT_FROSTPEAK',
 'TOWN_ASHVEIL','TRAVEL_FROM_ASHVEIL','SHOP_ASHVEIL','TAVERN_ASHVEIL','RECRUIT_ASHVEIL',
]);

function setRegionTheme(nodeId){
 const root = document.documentElement;
 if(ELMARIA_NODES.has(nodeId)){
 document.documentElement.style.setProperty('--bg','#0d0a07');
 document.documentElement.style.setProperty('--screen','#130f0a');
 } else if(ZAHARA_NODES.has(nodeId)){
 document.documentElement.style.setProperty('--bg','#0d0a07');
 document.documentElement.style.setProperty('--screen','#130f0a');
 } else if(DRAKLIM_NODES.has(nodeId)){
 document.documentElement.style.setProperty('--bg','#0d0a07');
 document.documentElement.style.setProperty('--screen','#130f0a');
 } else {
 document.documentElement.style.setProperty('--bg','#0d0a07');
 document.documentElement.style.setProperty('--screen','#130f0a');
 }
}

function go(nodeId){
 if(nodeId==='RESTART'){location.reload();return;}
 if(nodeId==='__travel__') return;
 if(nodeId==='__hunt_room__') return;
 if(nodeId==='__yd_win__') return;
 // 酒場パネルが開いていれば閉じる
 const _pp = document.getElementById('patron-panel');
 if(_pp && !_pp.classList.contains('hidden')) _pp.classList.add('hidden');

 // 町ノードに入るたびに、チュートリアルの死亡イベントの噂をチェックする
 if(typeof nodeId==='string' && nodeId.startsWith('TOWN_')){
  checkTutorialDeathRumors();
  // 旅芸人の一座との護衛契約中：給金・満了・出発時刻の超過を処理する（画面を引き取ったらここで終わる）
  if(troupeTownHook(nodeId)) return;
 }

 if(nodeId==='__bounty_win__'){
 // 賞金首討伐勝利 → 衛兵に報告する画面
 const bq = window._bountyQ;
 const backNode = window._bountyBackNode || 'TOWN_KHAZAN';
 if(!bq){ go(backNode); return; }
 const storyEl = document.getElementById('story');
 const npcName = bq.targetName || '賞金首';
 storyEl.innerHTML = ` <span style="color:#f0ece0">賞金首討伐</span><br><br>`
  +`<span style="color:#e8e4d8"> ${npcName}を捕縛・討伐した！</span><br><br>`
  +`<span style="color:#c0b098">衛兵に報告して報酬を受け取ろう。</span>`;
 renderChoices([{label:' 衛兵に報告する', fn:()=>{
  // 報酬付与（一度だけ）
  if(!window._bountyQ) return;
  const reward = bq.reward||0;
  const fromTownId = bq.fromTownId;
  PC.quests = (PC.quests||[]).filter(qq=>qq.id!==bq.id);
  window._bountyQ = null;
  window._bountyBackNode = null;
  gainGPAll(reward); updateHUD();
  addLifeEvent('',`賞金首${npcName}を討伐。報酬${reward}GP。`);
  changeTrust(fromTownId, 5);
  clearTavernBoard(fromTownId);
  const trustNow = getTrust(fromTownId);
  const _brPartyCount = 1 + (PC.party||[]).filter(n=>n.con>0).length;
  const _brShare = Math.floor(reward / _brPartyCount);
  // 結果をグローバルに保存してノード遷移
  window._bountyResult = {npcName, reward, trustNow, backNode, partyCount: _brPartyCount, share: _brShare};
  go('__bounty_report__');
 }}]);
 return;
 }

 if(nodeId==='__bounty_report__'){
 // 賞金首討伐報告完了画面
 const r = window._bountyResult || {};
 window._bountyResult = null;
 const storyEl2 = document.getElementById('story');
 storyEl2.innerHTML = ` <span style="color:#f0ece0">賞金首討伐完了</span><br><br>`
  +`<span style="color:#e8e4d8"> ${r.npcName||''}の討伐を報告した。</span><br><br>`
  +`<div style="background:#0a1008;border:1px solid #505050;border-radius:4px;padding:10px;margin:6px 0">`
  +`<div style="color:#f0ece0;font-size:var(--font-sm)"> 報酬</div>`
  +`<div style="color:#f0ece0;font-size:calc(var(--font-lg) + 2px);margin-top:4px">${r.reward||0} GP</div>`
  +`${(r.partyCount||1) > 1 ? `<div style="color:#c8b8a0;font-size:calc(var(--font-sm) - 1px);margin-top:2px">${r.partyCount}人で山分け：${r.share}GP/人</div>` : ''}`
  +`<div style="color:#ece8d8;font-size:calc(var(--font-sm) - 1px);margin-top:4px">信頼度+5（→${r.trustNow||0}）</div>`
  +`</div>`;
 renderChoices([{label:'← 街に戻る', go: r.backNode||'TOWN_KHAZAN'}]);
 return;
 }


 if(nodeId==='__explore_win__'){
 // 散策戦闘勝利：戦利品表示してから街に戻る
 const ret = window._exploreReturnNode || 'TOWN_KHAZAN';
 const winFn = window._exploreCombatWin;
 window._exploreReturnNode = null;
 window._exploreCombatWin = null;
 const storyEl = document.getElementById('story');
 let extra = '';
 if(typeof winFn === 'function'){ extra = winFn(); }
 if(storyEl) storyEl.innerHTML = `<span class="dim" style="font-size:calc(var(--font-sm) - 1px)">── 戦闘終了 ──</span><br><br>
 <span style="color:#f0ece0"> 勝利！</span><br><br>
 ${extra}<br><br>
 `;
 renderChoices([{label:'← 街に戻る', go:ret}]);
 return;
 }
 if(nodeId==='WILDERNESS' && !NODES.WILDERNESS) wildInstallNode();
 const node=NODES[nodeId];
 if(!node){console.warn('Node not found:',nodeId);return;}
 // 両替所のある街に到着した瞬間、同行中の仲間が自分の判断で資産を預け入れる（同じ町の再描画では発動しない）
 if(nodeId.startsWith('TOWN_') && currentNodeId!==nodeId){
  const _bTownId = nodeId.slice(5).toLowerCase();
  if(EXCHANGE_BANK_NAMES[_bTownId]){
   const npcLogs = autoDepositNPCAssets(_bTownId);
   if(npcLogs.length){
    showSaveToast(npcLogs.length===1 ? npcLogs[0] : `仲間${npcLogs.length}人が両替所に資産を預けた`);
   }
  }
 }
 // 手配度：町に新しく入る瞬間の衛兵遭遇チェック（同じ町の再描画では発動しない）
 // ※ここでcurrentNodeIdを先に更新しておかないと、遭遇戦に勝利してgo()で同じ町へ戻った際に
 //   「まだ町に到着していない」と誤判定されて衛兵遭遇が無限に再発生してしまう
 if(nodeId.startsWith('TOWN_') && currentNodeId!==nodeId){
  const _wTownId = nodeId.slice(5).toLowerCase();
  if(TOWNS[_wTownId] && checkWantedAmbush(_wTownId)){ currentNodeId = nodeId; return; }
  if(TOWNS[_wTownId] && checkAdmirerEvent(_wTownId)){ currentNodeId = nodeId; return; }
 }
 // 死亡到達時：ダンジョン画像・旅イメージ画像の消し忘れ防止（YD/討伐ダンジョン等、独自の画像管理を行うものも含む）
 if(nodeId==='DEAD'){
 hideDungeonImage();
 hideTravelImage();
 hideTravelProgress();
 PC._yeldunDungeon = null;
 _huntState = null;
 travelState = null;
 }
 const _isDungeonLikeNode = id => DUNGEON_NODES.has(id) || (typeof id==='string' && /^TUTORIAL_HUNT_\d+$/.test(id));
 const _prevWasDungeon = _isDungeonLikeNode(currentNodeId);
 _lastNodeId = currentNodeId;
 currentNodeId = nodeId;
 setRegionTheme(nodeId);

 // 街ノード到着時に配達チェック
 const townNodeMap = {
 TOWN_KHAZAN:'khazan', TOWN_PORT_ARGON:'port_argon', TOWN_STONEHIEM:'stonehiem', TOWN_ELSIA:'elsia',
 TOWN_VERDA:'verda', TOWN_RIMHOLM:'rimholm', TOWN_MARAKAI:'marakai',
 TOWN_AL_RASHID:'al_rashid', TOWN_OASIS_FORT:'oasis_fort', TOWN_SAROON:'saroon', TOWN_DUNA:'duna',
 TOWN_YELDUN:'yeldun', TOWN_FROSTPEAK:'frostpeak', TOWN_ASHVEIL:'ashveil',
 TOWN_VALDHEIM:'valdheim', TOWN_NIFURVIK:'nifurvik', TOWN_ISKALD:'iskald',
 TOWN_NERIA:'neria', TOWN_DORUA:'dorua', TOWN_SARPE:'sarpe', TOWN_NEBRA:'nebra', TOWN_KALVO:'kalvo'
 };
 if(townNodeMap[nodeId]) checkAllDeliveries(townNodeMap[nodeId]);
 if(townNodeMap[nodeId]) autoSave();

 // 酒場ノード到着時にペナルティチェック
 const tavernTownMap = {
  TAVERN_KHAZAN:'khazan', TAVERN_PORT:'port_argon', TAVERN_STONE:'stonehiem',
  TAVERN_ELSIA:'elsia', TAVERN_VERDA:'verda', TAVERN_RIMHOLM:'rimholm',
  TAVERN_MARAKAI:'marakai', TAVERN_AL_RASHID:'al_rashid', TAVERN_OASIS:'oasis_fort',
  TAVERN_SAROON:'saroon', TAVERN_DUNA:'duna', TAVERN_YELDUN:'yeldun',
  TAVERN_FROSTPEAK:'frostpeak', TAVERN_ASHVEIL:'ashveil', TAVERN_VALDHEIM:'valdheim',
  TAVERN_NIFURVIK:'nifurvik', TAVERN_ISKALD:'iskald',
  TAVERN_NERIA:'neria', TAVERN_DORUA:'dorua', TAVERN_SARPE:'sarpe', TAVERN_NEBRA:'nebra', TAVERN_KALVO:'kalvo',
 };
 if(tavernTownMap[nodeId] && (PC._questPenalties||{})[tavernTownMap[nodeId]] > 0){
  checkQuestPenalty(tavernTownMap[nodeId], ()=>go(nodeId));
  return;
 }

 checkChaosNestTick();

 // ── 松明ターン消費（ダンジョン内移動） ──
 if((DUNGEON_NODES.has(nodeId) && !DUNGEON_SAFE_NODES.has(nodeId)) || (typeof nodeId==='string' && /^TUTORIAL_HUNT_\d+$/.test(nodeId) && nodeId!=='TUTORIAL_HUNT_1')){
 PC._torchStock = PC._torchStock || 0;
 if(PC._torchTurns == null) PC._torchTurns = 0;
 // 重量オーバーなら1回の移動で松明の消費が2倍（2ターン分）かかる
 const _wpOverDng = checkWeightPenalty().over;
 const _torchConsume = _wpOverDng ? 2 : 1;
 for(let _tc=0; _tc<_torchConsume; _tc++){
 if(PC._torchTurns > 0){
 PC._torchTurns--;
 if(PC._torchTurns === 0){
 // 在庫がある場合のみ消費
 if(PC._torchStock > 0){
 PC._torchStock--;
 updateHUD();
 if(PC._torchStock > 0){
 // 次の1本を点火
 PC._torchTurns = 10;
 PC._pendingMsg = (PC._pendingMsg||'') + `<div style="color:#f0ddd0;font-size:var(--font-sm);margin-top:8px"> 松明が燃え尽きた。新しい松明に火をつけた。（残り${PC._torchStock}本）</div>`;
 } else {
 PC._pendingMsg = (PC._pendingMsg||'') + `<div style="color:#e0d0d0;font-size:var(--font-sm);margin-top:8px">️ 松明が燃え尽きた。暗闇に包まれた…</div>`;
 }
 }
 // 在庫0の場合（魔法の明かりが消えた）はそのままターンを0に
 }
 } else {
 break; // 既にターン0（魔法の明かり切れ）ならこれ以上は減らない
 }
 }
 if(_wpOverDng && _torchConsume>1 && PC._torchTurns>0){
 PC._pendingMsg = (PC._pendingMsg||'') + `<div style="color:#e0a060;font-size:calc(var(--font-sm) - 2px);margin-top:4px"> 重量オーバーのため松明の消費が2倍になっている</div>`;
 }
 }

 // Enchant Weapon/Fortify Armorの残りターンは、ダンジョン内外・松明の有無に関わらずノード移動1回につき1回だけ減らす
 _decrementWizardBuffTurns();
 _decrementChainedTurns();

 // Blind Spot カウントダウン
 if(DUNGEON_NODES.has(nodeId) && !DUNGEON_SAFE_NODES.has(nodeId)){
 if(PC._blindSpotRounds > 0){
  PC._blindSpotRounds--;
  if(PC._blindSpotRounds === 0){
  PC._pendingMsg = (PC._pendingMsg||'') + `<div style="color:#c8b8a0;font-size:var(--font-sm);margin-top:8px"> Blind Spotの効果が切れた。</div>`;
  }
 }
 }

 // 毒ダメージ（移動ごとに体力-1）
 if(PC._poisoned){
 PC.con = Math.max(0, PC.con - 1);
 if(PC.con <= 0){
 PC._pendingMsg = (PC._pendingMsg||'') + `<div style="color:#e0d8c8;font-size:var(--font-sm);margin-top:8px"> 毒が回り…意識が途絶えた。</div>`;
 // 死亡はテキスト表示後にgo()内で処理
 PC._poisonKill = true;
 } else {
 PC._pendingMsg = (PC._pendingMsg||'') + `<div style="color:#e0d8c8;font-size:var(--font-sm);margin-top:8px"> 毒が体を蝕む… CON -1（${PC.con}/${PC.maxCon}）</div>`;
 }
 }

 // モンスターエンカウント（暗闇中は判定しない）
 // 専用エンカウント関数を持つダンジョンはスキップ
 const _skipGenericEnc = nodeId.startsWith('RUIN_P') || nodeId.startsWith('RUIN_ROOM') || nodeId.startsWith('RUIN_TJUNC')
  || nodeId.startsWith('LAIR_') || nodeId.startsWith('LAIR2_') || nodeId.startsWith('LAIR3_') || nodeId.startsWith('LAIR4_') || nodeId.startsWith('LAIR5_') || nodeId.startsWith('NIFLAIR_') || nodeId.startsWith('LAIR6_') || nodeId.startsWith('LAIR7_') || nodeId.startsWith('OUTPOST_') || nodeId.startsWith('HRUIN_');
 if(PC._torchTurns > 0 && !_skipGenericEnc){
 const dungeonFloor = nodeId.startsWith('CRYPT3_') ? 3 : nodeId.startsWith('CRYPT2_') ? 2 : nodeId.startsWith('SHR2_') ? 2 : 1;
 const enc = rollEncounter(dungeonFloor);
 if(enc){
 PC._pendingEncounter = enc;
 } else {
 // モンスターなし → トラップ判定
 const trap = rollTrap();
 if(trap){
 PC._pendingTrap = trap;
 } else {
 // トラップなし → ダンジョンイベント判定
 const ev = rollDungeonEvent();
 if(ev) PC._pendingEvent = ev;
 }
 }
 }

 // Reset UI
 document.getElementById('dice-area').classList.add('hidden');
 document.getElementById('cbt-area').classList.add('hidden'); document.getElementById('scroll-area').classList.remove('in-combat');
 hideMagicArea();
 document.getElementById('text-win').style.display = ''; // 戦闘中に隠したtext-winを復元
 if(window.innerWidth < 860) document.getElementById('inv-panel').classList.add('hidden');
 if(_shopActor) closeIngameShop(); // ノード遷移時、装備屋が実際に開いていれば閉じる
 rollPending=null;cbtState=null;multiRollState=null;

 // Scene
 drawScene((typeof node.scene==='function'?node.scene():node.scene)||'dungeon');

 // ── ダンジョン画像制御 ──
 const _nowDungeon = _isDungeonLikeNode(nodeId);
 if(!_prevWasDungeon && _nowDungeon){
  // 入場：画像を表示してカウンターリセット
  _dngStepCount = 0;
  showDungeonImage(nodeId);
 } else if(_prevWasDungeon && _nowDungeon){
  // ダンジョン内移動：5ステップごとにランダム切り替え
  _dngStepCount++;
  if(_dngStepCount % 5 === 0) rotateDungeonImage();
 } else if(_prevWasDungeon && !_nowDungeon){
  // 退場：画像を非表示
  hideDungeonImage();
 }
 // Label
 document.getElementById('node-label').textContent=''; // ノードIDは非表示
 // Text
 let txt=typeof node.txt==='function'?node.txt():node.txt;

 // 暗闇オーバーライド
 if(DUNGEON_NODES.has(nodeId) && !DUNGEON_SAFE_NODES.has(nodeId) && PC._torchTurns === 0){
 txt = darkRoomTxt(nodeId);
 }

 // 松明メッセージを先頭に追加
 if(PC._pendingMsg){
 txt = PC._pendingMsg + (txt||'');
 PC._pendingMsg = '';
 }
 // 町に旅芸人の一座がいれば、本文に一行足す
 txt = troupeInsertBlurb(txt||'', troupeNodeBlurb(nodeId));

 // 毒による死亡チェック
 if(PC._poisonKill){
 PC._poisonKill = false;
 document.getElementById('story').innerHTML = txt||'';
 updateHUD();
 setTimeout(()=>go('DEAD'), 1500);
 return;
 }

 // 松明残量インジケータ
 if(DUNGEON_NODES.has(nodeId) && !DUNGEON_SAFE_NODES.has(nodeId)){
 txt = torchIndicator() + (txt||'');
 }

 document.getElementById('story').innerHTML=txt||'';

 updateHUD();

 // ダンジョン外なら、万一残っている保留状態はここで破棄して漏れ出しを防ぐ
 if(!DUNGEON_NODES.has(nodeId)){
 PC._pendingEncounter = null;
 PC._pendingTrap = null;
 PC._pendingEvent = null;
 // ダンジョン内で受けた一時的CON減少（毒性ガス等）をここで全回復する
 _restoreDungeonConPenalty();
 // ダンジョン内で受けた一時的ST減少（幻覚・神経の緊張等）をここで全回復する
 _restoreDungeonStPenalty();
 }

 // モンスターエンカウント発動
 if(DUNGEON_NODES.has(nodeId) && PC._pendingEncounter){
 const enc = PC._pendingEncounter;
 PC._pendingEncounter = null;
 const story = document.getElementById('story');
 const mrList = '';
 story.innerHTML += `<div style="border-top:1px solid #440000;margin-top:10px;padding-top:8px;color:#e0d0d0;font-size:calc(var(--font-sm) + 1px)">
  <b>${enc.label}</b>が現れた！
 </div>`;
 startCombat({
 enemies: enc.enemies,
 win: currentNodeId,
 lose: 'DEAD',
 canFlee: true,
 });
 renderChoices([]);
 scrollToTop();
 return;
 }

 // トラップ発動
 if(DUNGEON_NODES.has(nodeId) && PC._pendingTrap){
 const trap = PC._pendingTrap;
 PC._pendingTrap = null;
 startTrap(trap);
 return;
 }

 // ダンジョンイベント発動
 if(DUNGEON_NODES.has(nodeId) && PC._pendingEvent){
 const ev = PC._pendingEvent;
 PC._pendingEvent = null;
 startDungeonEvent(ev);
 return;
 }

 // What to show next?
 if(node.combat){
 startCombat(node.combat);
 renderChoices([]);
 scrollToTop();return;
 }
 if(node.savingRoll){
 setupSavingRoll(node.savingRoll);
 renderChoices([]);
 scrollToTop();return;
 }
 if(node.multiSR){
 setupMultiSR(node.multiSR);
 renderChoices([]);
 scrollToTop();return;
 }
 if(node.magic&&(PC.type==='wizard'||PC.type==='rogue')&&PC.spells.length){
 showMagic(node.magic);
 renderChoices(node.choices||[]);
 scrollToTop();return;
 }

 // 暗闇中は通常選択肢を暗闇専用に差し替え（安全地帯ノードは対象外。でないと
 // 入口など安全地帯に辿り着いても、暗闇のままなら延々と脱出選択肢が出続けてしまう）
 // ウィザードなら明かり魔法（Wisp/Blind Spot）のボタンも追加
 if(DUNGEON_NODES.has(nodeId) && !DUNGEON_SAFE_NODES.has(nodeId) && PC._torchTurns === 0){
 let darkChoices = darkRoomChoices(nodeId);
 {
  const hasWisp = _partyHasSpellFn('wisp');
  const hasBlindSpot = _partyHasSpellFn('blindSpot');
  if(hasWisp || hasBlindSpot){
  const lightOpts = {};
  if(hasWisp) lightOpts.wisp = { desc:'指先を1ターン照らす', fn:()=>{ PC._torchTurns=Math.max(PC._torchTurns||0,1); _redrawDungeonNode(currentNodeId); return true; }};
  if(hasBlindSpot) lightOpts.blindSpot = { desc:'Blind Spotで3ターン安全に進む', fn:()=>{ PC._torchTurns=Math.max(PC._torchTurns||0,3); _redrawDungeonNode(currentNodeId); return true; }};
  darkChoices = [...darkChoices, {
   label: ' 明かりの魔法を使う',
   fn: ()=> openSpellModal('暗闇の中で明かりを灯す', lightOpts),
  }];
  }
 }
 renderChoices(darkChoices);
 scrollToTop();return;
 }

 const ch = typeof node.choices==='function' ? node.choices() : (node.choices||[]);
 // ウィザードなら「魔法を使う」ボタンを追加（戦闘外・暗闇外・特殊ノード外）
 const chWithMagic = _appendMagicChoice(ch, node, nodeId);
 renderChoices(chWithMagic);   // 旅芸人の一座のボタンは「その他の行動」の中にある
 scrollToTop();
}

// 固定ダンジョン内で松明消費・エンカウントなしに描写だけ再描画（灯り魔法使用後）
function _redrawDungeonNode(nodeId){
 const node = NODES[nodeId];
 if(!node) return;
 let txt = typeof node.txt==='function' ? node.txt() : node.txt;
 txt = torchIndicator() + (txt||'');
 document.getElementById('story').innerHTML = txt;
 const ch = typeof node.choices==='function' ? node.choices() : (node.choices||[]);
 renderChoices(_appendMagicChoice(ch, node, nodeId));
 scrollToTop();
 updateHUD();
}

// 通常ノードのchoices配列にウィザード用魔法ボタンを末尾追加
// 戦闘外で呪文を唱えられる候補（PC＋パーティNPC）を返す
// 魔法使い・盗賊とも場所を問わない（盗賊のダンジョン限定という制約は、クラス説明文にも根拠がなかったため撤廃）
// 呪文を持たない・生存していない者は除外
// パーティ（PC＋生存NPC）の誰かが、その呪文を使えるか（暗闇時の明かり魔法ボタンの出し分け用）
function _partyHasSpellFn(fn){
 return _eligibleOutOfCombatCasters().some(c=>(c.spells||[]).some(sp=>sp.fn===fn));
}
function _eligibleOutOfCombatCasters(nodeId){
 const isEligible = (c) => {
  if(!c || !c.spells || !c.spells.length) return false;
  return c.type === 'wizard' || c.type === 'rogue';
 };
 const list = [];
 if(isEligible(PC)) list.push(PC);
 (PC.party||[]).forEach(n=>{
  if(n.con > 0 && isEligible(n)) list.push(n);
 });
 return list;
}

function _appendMagicChoice(choices, node, nodeId){
 const casters = _eligibleOutOfCombatCasters(nodeId);
 if(!casters.length) return choices;
 if(cbtState) return choices; // 戦闘中は追加しない
 // 特殊ノードや装備屋・旅中は追加しない
 const skip = ['DEAD','RESTART','START'].some(s=>nodeId===s)
  || nodeId.startsWith('TRAVEL_FROM') || nodeId.startsWith('SHOP_')
  || nodeId.startsWith('TAVERN_') || nodeId.startsWith('RECRUIT_')
  || nodeId.startsWith('WIZARDS_GUILD')
  || nodeId.startsWith('ROGUES_GUILD')
  || nodeId.startsWith('TOWN_');
 if(skip) return choices;
 const spellEffects = node.spellEffects || null;
 const context = node.spellContext || '';
 return [...choices, {
  label: ' 魔法を使う',
  fn: () => openSpellModal(context, spellEffects, nodeId),
  _isMagicBtn: true,
 }];
}

function renderChoices(choices){
 const el=document.getElementById('choices');el.innerHTML='';
 // 戦闘が終了している（cbtStateがnull）のに、NPC行動選択パネル（TTYFレベル選択等）が
 // 残っていることがあるため、通常の選択肢を描画する際は念のため消しておく
 if(typeof cbtState !== 'undefined' && !cbtState){
  const actionPanel = document.getElementById('npc-action-panel');
  if(actionPanel && actionPanel.style.display !== 'none'){
   const actionTitle = document.getElementById('npc-action-title');
   const actionBtns  = document.getElementById('npc-action-btns');
   if(actionTitle) actionTitle.innerHTML = '';
   if(actionBtns)  actionBtns.innerHTML = '';
   actionPanel.style.display = 'none';
  }
 }
 let arr=typeof choices==='function'?choices():choices;
 // 荒野の移動は、方位ボタン（3×3）にまとめて表示する
 if((arr||[]).some(c=>c && c._wildCi!==undefined)){
  el.appendChild(wildBuildGrid(arr.filter(c=>c._wildCi!==undefined)));
  arr = arr.filter(c=>c._wildCi===undefined);
 }
 let visibleIdx = 0;
 (arr||[]).forEach(c=>{
 // show関数がある場合、falseなら非表示
 if(c.show && !c.show()) return;
 const b=document.createElement('button');b.className='choice-btn';
 const kbNum = visibleIdx < 9 ? (visibleIdx+1) : null;
 if(c.labelHtml){
  b.innerHTML = (kbNum ? `<span class="kb-num">[${kbNum}]</span> ` : '') + '▶ ' + c.labelHtml;
 } else if(kbNum){
  const numSpan=document.createElement('span');
  numSpan.className='kb-num';
  numSpan.textContent=`[${kbNum}]`;
  b.appendChild(numSpan);
  b.appendChild(document.createTextNode(' '+c.label));
 } else {
  b.textContent=c.label;
 }
 visibleIdx++;
 const dest = typeof c.go==='function' ? c.go() : c.go;
 b.onclick=()=>{if(c.fn)c.fn();if(dest)go(dest);};
 el.appendChild(b);
 });
}

// 移動プログレスバーを非表示にする
function hideTravelProgress(){
 const el = document.getElementById('travel-progress-wrap');
 if(el) el.style.display = 'none';
 hideTravelImage();
}

// ── 移動シーン画像 表示／非表示 ──
let _trvImgs = null;   // 現在の移動で使う画像配列
let _trvImgIdx = 0;    // 現在表示中のインデックス

function hideTravelImage(){
 const w = document.getElementById('travel-img-area');
 if(w) w.style.display = 'none';
 _trvImgs = null;
 _trvImgIdx = 0;
}

function showTravelImage(method, fromId, toId){
 const wrap = document.getElementById('travel-img-area');
 const img  = document.getElementById('travel-img');
 if(!wrap || !img) return;

 const ISLANDS   = new Set([]); // マレア地方は専用画像を使用
 const VALDHEIM  = new Set(['valdheim','nifurvik','iskald']);
 const DRACKRIM  = new Set(['yeldun','frostpeak','ashveil']);
 const ZAHARA    = new Set(['al_rashid','oasis_fort','saroon','duna']);
 const ELMARIA   = new Set(['elsia','verda','rimholm','marakai']);

 // 地方→画像キー
 function regionKey(id){
  if(['neria','dorua','sarpe','nebra','kalvo'].includes(id)) return 'marea';
  if(ISLANDS.has(id))  return 'sea';
  if(VALDHEIM.has(id)) return 'snow';
  if(DRACKRIM.has(id)) return 'mountain';
  if(ZAHARA.has(id))   return 'desert';
  if(ELMARIA.has(id))  return 'forest';
  return 'road';
 }

 let imgs;
 // 船 or マレア諸島関連 → seaのみ
 if(method==='ship' || ISLANDS.has(fromId) || ISLANDS.has(toId)){
  imgs = TRAVEL_IMGS['sea'] || [];
 } else {
  // 出発地と目的地の画像を結合
  const fromKey = regionKey(fromId);
  const toKey   = regionKey(toId);
  const fromImgs = (TRAVEL_IMGS[fromKey] || []).filter(Boolean);
  const toImgs   = fromKey === toKey ? [] : (TRAVEL_IMGS[toKey] || []).filter(Boolean);
  imgs = [...fromImgs, ...toImgs];
 }

 if(!imgs || !imgs.length){
  imgs = TRAVEL_IMGS.road || [];
 }
 imgs = imgs.filter(Boolean);
 if(!imgs.length){ wrap.style.display='none'; return; }

 // モジュール変数に保存（travelTickで参照）
 _trvImgs   = imgs;
 _trvImgIdx = Math.floor(Math.random() * imgs.length);

 img.style.opacity = '1';
 img.src = _trvImgs[_trvImgIdx];
 wrap.classList.remove('active');
 void wrap.offsetWidth;
 wrap.classList.add('active');
 wrap.style.display = '';
}

// 10日ごとに次の画像へ切り替え（travelTickから呼ぶ）
function rotateTravelImage(){
 if(!_trvImgs || _trvImgs.length < 2) return;
 const img = document.getElementById('travel-img');
 if(!img) return;
 img.style.opacity = '0';
 setTimeout(()=>{
  if(!_trvImgs || !_trvImgs.length) return; // 切り替え待ちの間に到着して画像が片付けられた場合は何もしない
  _trvImgIdx = (_trvImgIdx + 1) % _trvImgs.length;
  img.src = _trvImgs[_trvImgIdx];
  img.style.opacity = '1';
 }, 600);
}

// ── ダンジョンシーン画像 ──
let _dngStepCount = 0;   // ダンジョン内移動ステップ数

function showTitleImage(){
 const wrap = document.getElementById('title-img-area');
 const img  = document.getElementById('title-img');
 if(!wrap || !img || !TITLE_IMGS.length) return;
 img.src = TITLE_IMGS[Math.floor(Math.random() * TITLE_IMGS.length)];
 wrap.style.display = '';
}

function showDungeonImage(nodeId){
 if(!DUNGEON_IMGS.length) return;
 const wrap = document.getElementById('dungeon-img-area');
 const img  = document.getElementById('dungeon-img');
 if(!wrap || !img) return;
 const src = DUNGEON_IMGS[Math.floor(Math.random() * DUNGEON_IMGS.length)];
 img.src = src;
 img.style.opacity = '1';
 wrap.classList.remove('active');
 void wrap.offsetWidth;
 wrap.classList.add('active');
 wrap.style.display = '';
 const label = document.getElementById('dungeon-img-label');
 if(label) label.textContent = ' 探索中…';
}

function hideDungeonImage(){
 const wrap = document.getElementById('dungeon-img-area');
 if(wrap) wrap.style.display = 'none';
 _dngStepCount = 0;
}

function rotateDungeonImage(){
 if(!DUNGEON_IMGS.length) return;
 const img = document.getElementById('dungeon-img');
 if(!img) return;
 img.style.opacity = '0';
 setTimeout(()=>{
  img.src = DUNGEON_IMGS[Math.floor(Math.random() * DUNGEON_IMGS.length)];
  img.style.opacity = '1';
 }, 600);
}

// ── ダンジョン画像データ（base64埋め込み） ──
// 世界地図画像（data:image/jpeg;base64,xxx の形式）
const WORLD_MAP_IMG = 'img/worldmap.jpg';

// タイトル画面用画像（data:image/jpeg;base64,xxx の形式で追加）
const TITLE_IMGS = [
  'img/title_01.webp',
  'img/title_02.webp',
  'img/title_03.webp',
  'img/title_04.webp',
];
showTitleImage(); // ページロード時に実行

// 画像を追加する場合はこの配列に 'data:image/jpeg;base64,xxx' の形式で追加してください
const DUNGEON_IMGS = [
  'img/dungeon_01.webp',
  'img/dungeon_02.webp',
  'img/dungeon_03.webp',
  'img/dungeon_04.webp',
  'img/dungeon_05.webp',
  'img/dungeon_06.webp',
  'img/dungeon_07.webp',
  'img/dungeon_08.webp',
  'img/dungeon_09.webp',
  'img/dungeon_10.webp',
];// 画像を追加する場合は TRAVEL_IMGS に対応キーを追加してください
// キー: road / sea / snow / desert / forest
const TRAVEL_IMGS = {
 swamp: [
  'img/travel/swamp_01.webp',
  'img/travel/swamp_02.webp',
  'img/travel/swamp_03.webp',
  'img/travel/swamp_04.webp',
 ],
 wasteland: [
  'img/travel/wasteland_01.webp',
  'img/travel/wasteland_02.webp',
  'img/travel/wasteland_03.webp',
  'img/travel/wasteland_04.webp',
 ],
 plain: [
  'img/travel/plain_01.webp',
  'img/travel/plain_02.webp',
  'img/travel/plain_03.webp',
  'img/travel/plain_04.webp',
  'img/travel/plain_05.webp',
 ],
 marea: [
  'img/travel/marea_01.webp',
  'img/travel/marea_02.webp',
  'img/travel/marea_03.webp',
  'img/travel/marea_04.webp',
 ],
 road: [
  'img/travel/road_01.webp',
  'img/travel/road_02.webp',
  'img/travel/road_03.webp',
  'img/travel/road_04.webp',
 ],
 sea: [
  'img/travel/sea_01.webp',
  'img/travel/sea_02.webp',
  'img/travel/sea_03.webp',
  'img/travel/sea_04.webp',
 ],
 snow: [
  'img/travel/snow_01.webp',
  'img/travel/snow_02.webp',
  'img/travel/snow_03.webp',
  'img/travel/snow_04.webp',
 ],
 mountain: [
  'img/travel/mountain_01.webp',
  'img/travel/mountain_02.webp',
  'img/travel/mountain_03.webp',
  'img/travel/mountain_04.webp',
 ],
 desert: [
  'img/travel/desert_01.webp',
  'img/travel/desert_02.webp',
  'img/travel/desert_03.webp',
  'img/travel/desert_04.webp',
 ],
 forest: [
  'img/travel/forest_01.webp',
  'img/travel/forest_02.webp',
  'img/travel/forest_03.webp',
  'img/travel/forest_04.webp',
 ],
};

function scrollToTop(){
 const sa=document.getElementById('scroll-area');
 if(sa) setTimeout(()=>sa.scrollTop=0,50);
}

// ══════════════════════════════════════════
// KEYBOARD NAVIGATION
// ══════════════════════════════════════════
(function(){
 // フォーカス可能なゲームボタンを取得（表示中・有効なものだけ）
 function getActionButtons(){
 const sel = [
 '#choices .choice-btn:not([disabled])',
 '#npc-action-btns .choice-btn:not([disabled])',
 '#rl-btn:not([disabled]):not(.hidden)',
 '#spell-list .spell-btn:not([disabled])',
 ].join(',');
 return Array.from(document.querySelectorAll(sel))
 .filter(b => b.offsetParent !== null); // 実際に表示されているもの
 }

 // スクロールエリア
 function getScrollArea(){
 // デスクトップ時は right-pane 内の scroll-area、モバイルは scroll-area
 return document.getElementById('scroll-area');
 }

 // kb-focusインデックスを管理
 let kbIdx = -1;

 function setKbFocus(idx){
 const btns = getActionButtons();
 if(!btns.length){ kbIdx = -1; return; }
 // 前のフォーカスを外す
 btns.forEach(b => b.classList.remove('kb-focus'));
 kbIdx = ((idx % btns.length) + btns.length) % btns.length;
 const target = btns[kbIdx];
 target.classList.add('kb-focus');
 target.scrollIntoView({ block:'nearest', behavior:'smooth' });
 }

 function clearKbFocus(){
 document.querySelectorAll('.kb-focus').forEach(b => b.classList.remove('kb-focus'));
 kbIdx = -1;
 }

 // ノード遷移時にフォーカスをリセット
 const origGo = window.go;
 // go()はスクリプト内に定義されているので後でパッチ
 // renderChoicesが呼ばれたときにkbIdxをリセット
 const origRenderChoices = window.renderChoices;

 document.addEventListener('keydown', function(e){
 // 入力欄にフォーカスがある場合はスキップ
 const tag = document.activeElement?.tagName;
 if(tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

 // ゲーム画面が表示中かチェック
 const game = document.getElementById('game');
 if(!game || game.classList.contains('hidden')) return;

 const btns = getActionButtons();
 const sa = getScrollArea();
 const scrollAmt = sa ? Math.floor(sa.clientHeight * 0.7) : 200;

 switch(e.key){
 // ── 選択肢移動 ──
 case 'ArrowDown':
 case 'j':
 e.preventDefault();
 if(btns.length) setKbFocus(kbIdx < 0 ? 0 : kbIdx + 1);
 break;
 case 'ArrowUp':
 case 'k':
 e.preventDefault();
 if(btns.length) setKbFocus(kbIdx < 0 ? btns.length - 1 : kbIdx - 1);
 break;

 // ── Tab で次、Shift+Tab で前 ──
 case 'Tab':
 if(!btns.length) break;
 e.preventDefault();
 setKbFocus(kbIdx < 0 ? 0 : (e.shiftKey ? kbIdx - 1 : kbIdx + 1));
 break;

 // ── 数字キーで直接選択 ──
 case '1': case '2': case '3': case '4': case '5':
 case '6': case '7': case '8': case '9':{
 const n = parseInt(e.key) - 1;
 if(n < btns.length){
 e.preventDefault();
 setKbFocus(n);
 setTimeout(() => btns[n].click(), 80);
 }
 break;
 }

 // ── Enter / Space でフォーカス中を実行 ──
 case 'Enter':{
 if(kbIdx >= 0 && btns[kbIdx]){
 e.preventDefault();
 const b = btns[kbIdx];
 b.classList.add('kb-focus');
 setTimeout(() => b.click(), 60);
 }
 break;
 }
 case ' ':{
 if(kbIdx >= 0 && btns[kbIdx]){
 e.preventDefault();
 btns[kbIdx].click();
 } else {
 // フォーカスなしのSpace → 下スクロール
 e.preventDefault();
 if(sa) sa.scrollBy({ top: scrollAmt, behavior:'smooth' });
 }
 break;
 }

 // ── スクロール ──
 case 'PageDown':
 e.preventDefault();
 if(sa) sa.scrollBy({ top: scrollAmt, behavior:'smooth' });
 break;
 case 'PageUp':
 e.preventDefault();
 if(sa) sa.scrollBy({ top: -scrollAmt, behavior:'smooth' });
 break;
 case 'Home':
 e.preventDefault();
 if(sa) sa.scrollTo({ top: 0, behavior:'smooth' });
 break;
 case 'End':
 e.preventDefault();
 if(sa) sa.scrollTo({ top: sa.scrollHeight, behavior:'smooth' });
 break;
 }
 });

 // マウスクリックでkbフォーカスをリセット
 document.addEventListener('mousedown', function(){
 clearKbFocus();
 });

 // go()後にkbIdxをリセットするためにMutationObserverで#choicesの変化を監視
 const choicesEl = document.getElementById('choices');
 if(choicesEl){
 new MutationObserver(() => {
 clearKbFocus();
 // 選択肢が1つだけなら自動フォーカス（Enter一発で進める）
 const btns = getActionButtons();
 if(btns.length === 1) setTimeout(() => setKbFocus(0), 100);
 }).observe(choicesEl, { childList: true });
 }
})();

// ──────────────────────────────────────
// SAVING ROLL UI
// ──────────────────────────────────────
function setupSavingRoll(sr){
 rollPending=sr;
 const attrNames={st:'強さ',iq:'知力',lk:'運',con:'体力',dex:'器用さ',chr:'魅力',spd:'素早さ'};
 const target=sr.level*5+15-(sr.targetAdjust||0);
 const attrVal=PC[sr.attr];
 document.getElementById('dd').innerHTML=
 `<span style="color:var(--white)">Lv${sr.level} ${attrNames[sr.attr]||sr.attr}(${attrVal})</span><br>目標: 2D6+${attrVal} ≥ <span style="color:var(--white)">${target}</span>`;
 document.getElementById('dres').textContent='──  ──';
 _activateDiceUI(sr, PC);
}

// パーティがいれば誰が挑むか選ばせてから共通SRUIへ
function setupSavingRollWithParty(sr){
 const aliveParty = (PC.party||[]).filter(n=>n.con>0);
 if(!aliveParty.length){ setupSavingRoll(sr); return; }
 const attrNames={st:'強さ',iq:'知力',lk:'運',con:'体力',dex:'器用さ',chr:'魅力',spd:'素早さ'};
 const attrLabel = attrNames[sr.attr]||sr.attr;
 const target = sr.level*5+15;
 const story = document.getElementById('story');
 story.innerHTML += `<div style="margin-top:10px;padding:8px;background:var(--info-bg);border:1px solid #484848;border-radius:4px;font-size:var(--font-sm);color:#e0d8c8"> <b>${attrLabel} 能力値テスト Lv${sr.level}</b>　誰が挑みますか？</div>`;
 const actors = [PC, ...aliveParty];
 renderChoices(actors.map(actor=>({
  label:`${actor.name}　${attrLabel} ${actor[sr.attr]||0}　（目標値 ${target}）`,
  fn:()=>{ setupSavingRollFor(actor, sr); },
 })));
}

function doRoll(){
 if(multiRollState){doMultiSRStep();return;}
 if(!rollPending)return;
 const sr=rollPending;rollPending=null;

 // Roll with doubles explode
 let a=d6(),b=d6();
 let diceArr=[a,b];
 while(a===b){a=d6();b=d6();diceArr.push(a,b);}

 _resolveSRRoll(sr, diceArr);
}

// SRの判定・演出・DONEボタンの処理（自動ロール／手動入力の両方から呼ばれる共通処理）
function _resolveSRRoll(sr, diceArr){
 // _actor が指定されていればそのキャラで判定、なければPC
 const actor = sr._actor || PC;
 const isPC = actor === PC;

 const target=sr.level*5+15-(sr.targetAdjust||0);
 const attrVal=actor[sr.attr] || 0;

 const rawTotal=diceArr.reduce((s,v)=>s+v,0);
 let doublesStr='';
 for(let i=2;i<diceArr.length;i+=2) doublesStr+=` +`;

 // 素早さテスト時、履いているブーツ・サンダルで出目にボーナス
 let footwearBonus = 0, footwearLabel = '';
 if(sr.attr === 'spd' && isPC && PC.equippedBoots){
  if(PC.invBootsName === 'サンダル'){ footwearBonus = 1; footwearLabel = 'サンダル'; }
  else { footwearBonus = 2; footwearLabel = 'ブーツ'; }
 }
 const rolledTotal = rawTotal + footwearBonus;
 const footwearStr = footwearBonus>0 ? `<span style="color:#c8b8a0">+${footwearBonus}(${footwearLabel})</span>` : '';

 const grandTotal=rolledTotal+attrVal;
 const success=rolledTotal>=5&&grandTotal>=target;
 const ap=rolledTotal*sr.level; // 成否問わず経験値加算

 // 経験値はアクターに加算（noAPフラグがある場合はスキップ）
 if(ap>0 && !sr.noAP){
  if(isPC){ gainAPAll(ap); }
  else { actor.ap=(actor.ap||0)+ap; }
 }

 const actorTag = isPC ? '' : `<span style="color:#e0d8c8">${actor.name}</span>　`;
 const apStr = sr.noAP ? '' : `　${success?`<span style="color:var(--white)"> 成功 経験値+${ap}</span>`:`<span style="color:var(--white)"> 失敗 経験値+${ap}</span>`}`;
 const resHtml = ` ${actorTag}<span style="color:#f0ece0;font-size:calc(var(--font-sm) - 1px)">${diceStr(diceArr)}</span>=<span style="color:#f0ece0">${rawTotal}</span>${footwearStr}${doublesStr}　合計: ${rolledTotal}+${attrVal}=<span style="color:#f0ece0">${grandTotal}</span>　${success?'<span style="color:var(--white)"> 成功</span>':'<span style="color:var(--white)"> 失敗</span>'}${apStr}`;
 document.getElementById('dres').innerHTML = resHtml;
 document.getElementById('rl-btn').classList.remove('hidden');
 document.getElementById('dice-manual-area').classList.add('hidden');
 document.getElementById('rl-btn').disabled=true;
 document.getElementById('rl-btn').textContent=' DONE';
 // 移動中なら travelLog にも結果を流す
 if(travelState) travelLog(`<span style="color:#ccccaa;font-size:calc(var(--font-sm) - 1px)">　${resHtml}</span>`);

 updateHUD();
 const rlBtn = document.getElementById('rl-btn');
 rlBtn.disabled = false;
 rlBtn.textContent = '▶ DONE';
 rlBtn.onclick = ()=>{
  rlBtn.disabled = true;
  rlBtn.onclick = doRoll; // デフォルトのROLL THE DICE動作に戻す
  document.getElementById('dice-area').classList.add('hidden');
  // 目標値・合計値をsr自身に記録しておく（目標値との差分をダメージ計算等に使いたい罠などのため）
  sr._srTarget = target;
  sr._srGrandTotal = grandTotal;
  if(success && typeof sr.onSuccess === 'function'){
   sr.onSuccess();
  } else if(!success && typeof sr.onFail === 'function'){
   sr.onFail();
  } else if(sr.autoAdvance){
   // autoAdvanceフラグがある場合はDONEボタンなしで即進行（onSuccess/onFail必須）
   if(success) sr.onSuccess && sr.onSuccess();
   else sr.onFail && sr.onFail();
  } else {
   go(success?sr.success:sr.fail);
  }
 };
}

// ── 手動ダイス入力モード ──
function isManualDiceMode(){ return !!PC._manualDiceMode; }

let _manualDiceState = null; // {sr, diceArr}

function _startManualDiceInput(sr){
 _manualDiceState = {sr, diceArr:[]};
 const hint = document.getElementById('dice-manual-hint');
 if(hint) hint.textContent = '2D6の出目を入力してください';
 const i1 = document.getElementById('dice-manual-1');
 const i2 = document.getElementById('dice-manual-2');
 if(i1) i1.value = '';
 if(i2) i2.value = '';
 document.getElementById('rl-btn').classList.add('hidden');
 document.getElementById('dice-manual-area').classList.remove('hidden');
 if(i1) i1.focus();
}

function _confirmManualDice(){
 const st = _manualDiceState;
 if(!st) return;
 const i1 = document.getElementById('dice-manual-1');
 const i2 = document.getElementById('dice-manual-2');
 const v1 = parseInt(i1.value, 10);
 const v2 = parseInt(i2.value, 10);
 if(!(v1>=1 && v1<=6 && v2>=1 && v2<=6)){ showSaveToast('1〜6の出目を入力してください'); return; }
 st.diceArr.push(v1, v2);
 if(v1 === v2){
  // ゾロ目：もう2つ入力させる（自動ロールのdoubles-explodeと同じルール）
  const hint = document.getElementById('dice-manual-hint');
  if(hint) hint.textContent = 'ゾロ目！ もう2つ出目を入力してください';
  i1.value = ''; i2.value = '';
  i1.focus();
  return;
 }
 document.getElementById('dice-manual-area').classList.add('hidden');
 const sr = st.sr;
 const diceArr = st.diceArr;
 _manualDiceState = null;
 _resolveSRRoll(sr, diceArr);
}

// SRのダイスUIを起動（自動ロール／手動入力を、対象がPCかどうかと設定に応じて出し分ける）
function _activateDiceUI(sr, actor){
 const isPC = (actor||PC) === PC;
 document.getElementById('dice-area').classList.remove('hidden');
 if(isPC && isManualDiceMode()){
  _startManualDiceInput(sr);
 } else {
  document.getElementById('dice-manual-area').classList.add('hidden');
  const btn=document.getElementById('rl-btn');
  btn.classList.remove('hidden');
  btn.disabled=false;
  btn.textContent='▶ ROLL THE DICE!';
  btn.onclick=doRoll;
 }
}

// ──────────────────────────────────────
// MULTI SAVING ROLL
// ──────────────────────────────────────
function setupMultiSR(msr){
 multiRollState={...msr,phase:0,results:[]};
 showMultiSRPhase();
}
function showMultiSRPhase(){
 const m=multiRollState;
 const r=m.rolls[m.phase];
 const attrNames={st:'強さ',iq:'知力',lk:'運',con:'体力',dex:'器用さ',chr:'魅力',spd:'素早さ'};
 const target=r.level*5+15;
 document.getElementById('dd').innerHTML=
 `[${m.phase+1}/${m.rolls.length}] Lv${r.level} <span style="color:var(--white)">${attrNames[r.attr]}(${PC[r.attr]})</span><br>目標 ≥ ${target}`;
 document.getElementById('dres').textContent='──  ──';
 const btn=document.getElementById('rl-btn');btn.disabled=false;btn.textContent='▶ ROLL!';
 document.getElementById('dice-area').classList.remove('hidden');
}
function doMultiSRStep(){
 const m=multiRollState;
 const r=m.rolls[m.phase];
 const target=r.level*5+15;
 const attrVal=PC[r.attr];
 let total=0,a=d6(),b=d6();total=a+b;
 let doublesStr='';
 while(a===b){doublesStr+=' +';a=d6();b=d6();total+=a+b;}
 const grand=total+attrVal;
 const success=total>=5&&grand>=target;
 const ap=total*r.level; // 成否問わずAP加算
 if(ap>0) gainAPAll(ap);
 m.results.push({attr:r.attr,success,rolled:total,total:grand,miss:success?0:target-grand});
 document.getElementById('dres').innerHTML=
 `${total}${doublesStr}+${attrVal}=<span style="font-size:calc(var(--font-lg) + 4px);color:#f0ece0">${grand}</span>　${success?` 経験値+${ap}`:` 経験値+${ap}`}`;
 document.getElementById('rl-btn').disabled=true;
 updateHUD();
 setTimeout(()=>{
 m.phase++;
 if(m.phase<m.rolls.length){showMultiSRPhase();return;}
 // Resolve
 multiRollState=null;
 document.getElementById('dice-area').classList.add('hidden');
 resolveMultiSR(m);
 },1000);
}
function resolveMultiSR(m){
 const allOk=m.results.every(r=>r.success);
 if(allOk){go(m.allSuccess);return;}
 const fails=m.results.filter(r=>!r.success);
 if(m.resolveWorst){
 const worst=fails.reduce((a,b)=>b.miss>a.miss?b:a);
 go(m['fail_'+worst.attr]||m.anyFail);
 } else {
 go(m['fail_'+fails[0].attr]||m.anyFail);
 }
}

// ──────────────────────────────────────
// COMBAT ENGINE
// ──────────────────────────────────────
function startCombat(en, winNode){
 // Overdriveが残っていればリセット
 [PC, ...(PC.party||[])].forEach(a=>{
  if(a._overdrivePending){ a[a._overdrivePending.key] = a._overdrivePending.orig; a._overdrivePending = null; }
  a._shapeshifted = false; // 前回の戦闘のShapeshiftをリセット
 });
 _restoreShapeshiftIfNeeded(); // PC自身が変身したままなら元に戻す
 // 前回の戦闘の召喚された悪魔が残っていれば取り除く
 PC.party = (PC.party||[]).filter(n=>!n._isSummonedDemon);
 // 第2引数でwinノードを上書き可能（後方互換）
 if(winNode) en = Object.assign({}, en, {win: winNode});
 // enemies配列を構築（単体 or 複数体）
 let enemies;
 if(en.enemies){
 // 複数体形式で渡された場合
 enemies = en.enemies.map(e=>({
 name: e.name,
 mr: e.mr,
 curMR: e.mr,
 armor: e.armor||0,
 magicOnly: e.magicOnly||false,
 }));
 } else {
 // 従来の単体形式
 enemies = [{
 name: en.name,
 mr: en.mr,
 curMR: en.mr,
 armor: en.armor||0,
 magicOnly: en.magicOnly||false,
 }];
 }

 cbtState={
 enemies,
 totalMR: enemies.reduce((s,e)=>s+e.mr,0), // AP計算用
 win: en.win || null,  // nullの場合は勝利後currentNodeIdに戻る
 lose: en.lose||'DEAD',
 fleeTo: en.fleeTo || null, // 逃走成功時にwinより優先して戻るノード（未指定ならwin/現在地を使用）
 onWin: en.onWin || null,
 onLose: en.onLose || null,
 isHunt: en.isHunt || false,
 isYD: en.isYD || false,
 turn: 0,
 vorpalActive: false,
 whammyActive: false,
 littleFeetsRounds: 0,
 sleeping: 0,
 canFlee: en.canFlee !== false,
 autoNPC: en.autoNPC || false, // trueならパーティNPCの行動（魔法・遠距離・近接）を全て自動決定し、選択UIを出さない
 // 後方互換（旧コードがcs.nameやcs.curMRを参照する箇所用）
 get name(){ return this.enemies.map(e=>e.name).join(' / '); },
 get curMR(){ return this.enemies.reduce((s,e)=>s+e.curMR,0); },
 get mr(){ return this.totalMR; },
 get armor(){ return this.enemies[0]?.armor||0; },
 };

 // 戦闘中はストーリーテキストを非表示にして戦闘UIを最上部に表示
 document.getElementById('text-win').style.display = 'none';
 document.getElementById('cbt-area').classList.remove('hidden'); document.getElementById('scroll-area').classList.add('in-combat');
 // 戦闘開始元のノードに残っていた選択肢を消す
 const _choicesEl2 = document.getElementById('choices');
 if(_choicesEl2) _choicesEl2.innerHTML = '';
 // OKエリアを必ずクリア
 const _okA = document.getElementById('cbt-ok-area');
 if(_okA){ _okA.innerHTML=''; _okA.style.display='none'; }
 updateCombatUI();
 document.getElementById('clog').innerHTML =
 `<span style="color:#ccccaa"> ${cbtState.name}との戦闘開始！</span><br>`;

 if((PC.type==='wizard'||PC.type==='rogue')&&PC.spells.length) showMagicInCombat();

 _startNewRound();
 scrollToTop();
}


// ── ラウンド開始処理 ──────────────────────────────────────────────
function _startNewRound(){
 if(!cbtState) return;
 // Overdrive能力値リセット（複数キャラが同時に使用していても全員分リセット）
 if(cbtState._overdriveList && cbtState._overdriveList.length){
  cbtState._overdriveList.forEach(od=>{
   const odActor = od.actor || PC;
   odActor[od.key] = od.orig;
   odActor._overdrivePending = null;
  });
  cbtState._overdriveList = [];
  updateHUD();
 }
 // 前ラウンドのフラグをリセット
 cbtState._pcDidCast   = false;
 cbtState._pcDidRanged = false;
 cbtState._pcRangedSkipped = false;
 cbtState._pcDaggerUsed = false;
 cbtState._pcDodgedRanged = false;
 cbtState._pcRangedDodgeCount = 0;
 cbtState._magicSkipRemainingPcParty = false;
 cbtState._pcAutoDefended = false;
 (PC.party||[]).forEach((_,i)=>{
  cbtState[`_npcDidCast_${i}`]    = false;
  cbtState[`_npcDidRanged_${i}`]  = false;
  cbtState[`_npcDaggerUsed_${i}`] = false;
 });
 // 討伐同行者募集・同行配達の戦闘：ラウンド開始時にリーダーが指示を飛ばす
 if(_isCompanionHuntCombat()){
  const dung = PC._yeldunDungeon;
  const q = (dung?.isHuntDungeon)
   ? (PC.quests||[]).find(qq=>qq.id===dung.huntQuestId)
   : _getActiveCompanionDeliveryQuest();
  if(q?.leaderPersonality){
   const fieldLines = q.leaderPersonality.field;
   const line = Array.isArray(fieldLines) ? fieldLines[Math.floor(Math.random()*fieldLines.length)] : fieldLines;
   const leaderName = q.leader ? q.leader.name : 'リーダー';
   const cl0 = document.getElementById('clog');
   if(cl0) cl0.innerHTML += `<span style="color:#c8e0a8">${leaderName}が指示を飛ばす。${line}</span><br>`;
  }
 }
 if(cbtState.isNPC) updateCombatUINPC(); else updateCombatUI();
 _startMagicPhase();
}

// ── 魔法フェーズ ─────────────────────────────────────────────────
function _startMagicPhase(){
 // NPC型戦闘は素早さ順の専用フローへ
 if(cbtState?.isNPC){ _startMagicPhaseNPC(); return; }
 // 魔法を使えるパーティNPC
 const magicParty = (PC.party||[]).filter((n,i)=>
  n.con>0 && (n.type==='wizard'||n.type==='rogue') && (n.spells||[]).length>0
 );
 _magicPhaseStep(0, magicParty);
}

// ── NPC型戦闘専用：対象の回避判定（TTYFのみ）──
// 対象がPCの場合はダイス演出あり、それ以外（敵・パーティNPC）は内部計算のみで演出なし
// ── 闘技場モード専用：PCの体力が0になった際の共通処理 ──
// 闘技場モードで生存パーティがいれば戦闘続行（PCは以後の行動不可）としてfalseを返す。
// それ以外（通常戦闘、または闘技場でもパーティ全滅）は敗北処理をここで完結させ、trueを返す（呼び出し元はreturnする）。
function _handlePCZeroCon(cl){
 if(cbtState?.arenaMode && (PC.party||[]).some(n=>n.con>0)){
  if(cl) cl.innerHTML += `<span class="red"> あなたは倒れた！しかし仲間たちが戦いを続けている……</span><br>`;
  updateHUD();
  return false;
 }
 if(cl) cl.innerHTML += `<span class="red"> 体力0！死亡！</span><br>`;
 updateHUD();
 const _enemyNameForSave = (cbtState?.enemies||[]).map(e=>e.name).join('・') || '敵';
 if(!cbtState?.skipLuckSave && offerLuckSave(_enemyNameForSave)) return true;
 showCombatOK(()=>{
  const _onLose = cbtState ? cbtState.onLose : null;
  const _lose   = cbtState ? (cbtState.lose||'DEAD') : 'DEAD';
  cbtState = null;
  if(_onLose){ _onLose(); } else { go(_lose); }
 });
 return true;
}


// 現在、討伐同行者募集ダンジョン内かどうかを直接判定する（cbtState.autoNPCの受け渡し漏れに備えた保険）
// Enchant Weapon / Fortify Armorの持続ターンを減らす（PC._torchTurns--と同じタイミングで呼ぶ）
function _decrementWizardBuffTurns(){
 if((PC._enchantWeaponTurns||0) > 0){
  PC._enchantWeaponTurns--;
  if(PC._enchantWeaponTurns === 0){
   PC._pendingMsg = (PC._pendingMsg||'') + `<div style="color:#c8b8a0;font-size:var(--font-sm);margin-bottom:8px"> Enchant Weaponの効果が切れた。</div>`;
  }
 }
 if((PC._fortifyArmorTurns||0) > 0){
  PC._fortifyArmorTurns--;
  if(PC._fortifyArmorTurns === 0){
   PC._pendingMsg = (PC._pendingMsg||'') + `<div style="color:#c8b8a0;font-size:var(--font-sm);margin-bottom:8px"> Fortify Armorの効果が切れた。</div>`;
  }
 }
}

// 拘束の罠（鎖）の効果を対象（PCまたは仲間）に適用する。器用さを半減させ、
// 半減前の値をactor._chainedDexBaseに退避しておく（多重発動時に二重で半減しないため）
function applyChainedEffect(actor, turns){
 if(!actor) return;
 if(!actor._chainedDexBase){
  actor._chainedDexBase = actor.dex;
  actor.dex = Math.max(1, Math.floor(actor.dex/2));
 }
 actor._chained = (actor._chained||0) + turns;
}

// ダンジョン内でのみ有効な一時的CON減少（毒性ガスなど）を適用する。
// ダンジョンを出た時点で全回復する（_restoreDungeonConPenaltyで処理）
function applyDungeonConPenalty(actor, amount){
 if(!actor) return;
 actor.con = Math.max(1, actor.con - amount);
 actor._dungeonConDebt = (actor._dungeonConDebt||0) + amount;
}

// ダンジョンを出た時点で、ダンジョン内で受けた一時的CON減少（毒性ガス等）をすべて回復する
function _restoreDungeonConPenalty(){
 [PC, ...(PC.party||[])].forEach(a=>{
  if((a._dungeonConDebt||0) > 0){
   a.con = Math.min(a.maxCon, a.con + a._dungeonConDebt);
   a._dungeonConDebt = 0;
  }
 });
}

// ダンジョン内でのみ有効な一時的ST減少（幻覚・神経の緊張など）を適用する。
// maxSTも同時に減らすが、ダンジョンを出た時点で両方とも全回復する（_restoreDungeonStPenaltyで処理）
function applyDungeonStPenalty(actor, amount){
 if(!actor) return;
 actor.st = Math.max(1, actor.st - amount);
 actor.maxSt = Math.max(1, (actor.maxSt||actor.st) - amount);
 actor._dungeonStDebt = (actor._dungeonStDebt||0) + amount;
}

// ダンジョンを出た時点で、ダンジョン内で受けた一時的ST減少（幻覚・神経の緊張等）をすべて回復する
function _restoreDungeonStPenalty(){
 [PC, ...(PC.party||[])].forEach(a=>{
  if((a._dungeonStDebt||0) > 0){
   const debt = a._dungeonStDebt;
   a.maxSt = (a.maxSt||a.st) + debt;
   a.st = Math.min(a.maxSt, a.st + debt);
   a._dungeonStDebt = 0;
  }
 });
}

// 拘束の残りターン（ノード移動数）を減らし、0になったら器用さを元に戻す
// （_decrementWizardBuffTurnsと同じタイミングで呼ぶ）
function _decrementChainedTurns(){
 [PC, ...(PC.party||[])].forEach(a=>{
  if((a._chained||0) > 0){
   a._chained--;
   if(a._chained === 0 && a._chainedDexBase){
    a.dex = a._chainedDexBase;
    a._chainedDexBase = null;
    PC._pendingMsg = (PC._pendingMsg||'') + `<div style="color:#c8b8a0;font-size:var(--font-sm);margin-bottom:8px">${a===PC?'':a.name+'の'}拘束が解け、器用さが元に戻った。</div>`;
   }
  }
 });
}

// Shapeshiftで変えたPC自身の能力値・名前を元に戻す
function _restoreShapeshiftIfNeeded(){
 [PC, ...(PC.party||[])].forEach(a=>{
  if(a._shapeshiftOriginal){
   a.name = a._shapeshiftOriginal.name;
   a._shapeshiftOriginal = null;
  }
  a._shapeshiftCR = null;
  a._shapeshifted = false;
 });
}

function _isCompanionHuntCombat(){
 const dung = PC._yeldunDungeon;
 if(dung?.isHuntDungeon){
  const q = (PC.quests||[]).find(qq=>qq.id===dung.huntQuestId);
  if(q?.isCompanionHunt) return true;
 }
 // 同行配達依頼で移動中（出発済み・経由町で足止め中でない）の戦闘も同じ自動化ロジックにする
 const hasActiveDelivery = (PC.quests||[]).some(q=>
  q.type==='companionDelivery' && q.status==='active' && q._started && !q.isPausedAt
 );
 if(hasActiveDelivery) return true;
 // チュートリアルの配達・討伐・帰郷フェーズも同じ自動化ロジックにする
 if(PC._tutorial && (
  (PC._tutorial.step==='delivery' && PC._tutorial.deliveryLeg!=='paused') ||
  PC._tutorial.step==='hunt' ||
  (PC._tutorial.step==='homecoming' && !PC._tutorial.homecomingPausedAt)
 )) return true;
 return false;
}

// NPCのタイプに応じた戦い方の描写（同行者募集の戦闘で、自動行動するNPCの動きを見せるため）
const NPC_COMBAT_STYLE_LINES = {
 warrior: ['大剣を大きく振りかぶる！', '盾で受け止めながら踏み込む！', '渾身の一撃を叩き込む！', '果敢に前へ出て斬りかかる！'],
 rogue:   ['素早く敵の隙を突く！', '影のように回り込み、急所を狙う！', '短剣を閃かせる！', '身をかがめて懐に飛び込む！'],
 wizard:  ['杖を構え、隙を窺う！', '呪文の詠唱に備えつつ立ち回る！', '距離を取りながら牽制する！'],
};
function _npcCombatStyleLine(npc){
 const pool = NPC_COMBAT_STYLE_LINES[npc.type] || NPC_COMBAT_STYLE_LINES.warrior;
 return pool[Math.floor(Math.random()*pool.length)];
}

// ── 各魔法の発動テキストのバリエーションプール ──
// {caster}={target}のプレースホルダを含む文字列を用意し、_spellFlavor()で置換する
const SPELL_EFFECT_FLAVOR = {
 ttyf_hit: [
  '{caster}の放ったMagic Boltが{target}を打ち据えた！',
  '閃光と共に、魔力の奔流が{target}の体を貫いた！',
  '{target}は避けきれず、{caster}の一撃をまともに受けた！',
  '空気を切り裂く光条が、容赦なく{target}に突き刺さる！',
  '{caster}の指先から放たれた光弾が、{target}を吹き飛ばした！',
 ],
 ttyf_dodge: [
  '{target}は寸前で身をひるがえし、光の奔流を躱した！',
  '{target}は間一髪で飛び退き、直撃を免れた！',
  '光条は{target}の脇をかすめ、地面を焦がしただけだった。',
  '{target}は本能的に体をひねり、致命の一撃を回避した！',
 ],
 detonate_cast: [
  '{caster}が手のひらに炎を凝縮させ、Detonateを解き放った！',
  '{caster}の周囲に熱気が渦巻き、爆炎の呪文が完成する！',
  '大気が震え、{caster}の詠唱と共に業火が渦を巻いた！',
 ],
 icebind_cast: [
  '{caster}の周囲の空気が急速に冷え込み、Ice Bindが編まれる！',
  '{caster}の詠唱と共に、鋭い氷片が虚空に生まれる！',
  '冷気が渦を巻き、{caster}の手から氷の刃が放たれる！',
 ],
 turnToStone_hit: [
  '{target}の体が、足先からゆっくりと石へと変わっていく……！',
  '灰色の波が{target}を包み込み、その動きを永遠に止めた！',
  '{target}は悲鳴を上げる間もなく、その場で石像と化した！',
  '呪文の余波を浴びた{target}の肌が、みるみる硬く冷たい石に変わった。',
 ],
 turnToStone_dodge: [
  '{target}は咄嗟に身をこわばらせ、石化の呪いを弾き返した！',
  '灰色の波が{target}に触れる寸前、意志の力でそれを振り払った！',
  '{target}の体に一瞬石の質感が走ったが、すぐに元に戻った。',
 ],
 atomization_hit: [
  '{target}の輪郭が光の粒となって崩れ、跡形もなく消え去った！',
  '一瞬の閃光の後、{target}がいた場所には何も残っていなかった。',
  '{target}の存在そのものが、原子の塵となって虚空へ散った！',
 ],
 atomization_dodge: [
  '{target}は間一髪でその場を離れ、分解の光を逃れた！',
  '{target}は虫の知らせのように飛びのき、消滅を免れた！',
  'すんでのところで{target}は身をかわしたが、周囲の空間は容赦なく分解された。',
 ],
 summon_cast: [
  '{caster}の足元に禍々しい魔法陣が浮かび上がり、悪魔が姿を現した！',
  '大気が裂け、{caster}の呼びかけに応じて悪魔が這い出てきた！',
  '硫黄の匂いと共に、{caster}の傍らに悪魔が降り立った！',
 ],
 shapeshift_cast: [
  '{caster}の体が軋み、骨格が悪魔のそれへと作り変えられていく……！',
  '{caster}の輪郭が歪み、獣じみた悪魔の姿へと変貌を遂げた！',
  '一陣の黒煙と共に、{caster}はもはや人ならざる悪魔の姿となった！',
 ],
};
function _spellFlavor(key, vars){
 const pool = SPELL_EFFECT_FLAVOR[key];
 if(!pool || !pool.length) return '';
 let line = pool[Math.floor(Math.random()*pool.length)];
 Object.keys(vars||{}).forEach(k=>{ line = line.split('{'+k+'}').join(vars[k]); });
 return line;
}

function _npcCombatTtyfDodge(casterLevel, target, onResult){
 if(target === PC){
  document.getElementById('npc-action-panel').style.display = 'none';
  document.getElementById('dice-area').classList.remove('hidden');
  document.getElementById('text-win').style.display = '';
  setupSavingRollFor(PC, {
   attr:'lk', level:casterLevel, label:'魔法回避',
   onSuccess(){
    document.getElementById('dice-area').classList.add('hidden');
    document.getElementById('text-win').style.display = 'none';
    onResult(true);
   },
   onFail(){
    document.getElementById('dice-area').classList.add('hidden');
    document.getElementById('text-win').style.display = 'none';
    onResult(false);
   },
  });
 } else {
  const targetVal = casterLevel*5+15;
  const diceA = d6(), diceB = d6();
  const roll = diceA + diceB;
  const grand = roll + (target.lk||0);
  const success = grand >= targetVal;
  const cl = document.getElementById('clog');
  if(cl){
   cl.innerHTML += `<span style="color:#c8b8a0;font-size:calc(var(--font-sm) - 1px)"> ${target.name}の回避判定：[${diceA},${diceB}]+運(${target.lk||0})=${grand} vs ${targetVal} → ${success?'<span style="color:var(--white)">回避成功</span>':'<span style="color:#e0a070">回避失敗</span>'}</span><br>`;
  }
  onResult(success);
 }
}

// ── NPC型戦闘専用：素早さ順の魔法フェーズ ──
function _startMagicPhaseNPC(){
 const casters = [];
 if((PC.type==='wizard'||PC.type==='rogue') && (PC.spells||[]).length>0 && PC.con>0 && !PC._shapeshifted){
  casters.push({ kind:'pc', actor:PC, spd:PC.spd||0 });
 }
 (PC.party||[]).forEach(npc=>{
  if(npc.con>0 && (npc.type==='wizard'||npc.type==='rogue') && (npc.spells||[]).length>0 && !npc._shapeshifted){
   casters.push({ kind:'party', actor:npc, spd:npc.spd||0 });
  }
 });
 (cbtState.enemies||[]).forEach(e=>{
  if(e.curCon>0 && e.type==='wizard' && !e._shapeshifted){
   casters.push({ kind:'enemy', actor:e, spd:e.spd||0 });
  }
 });
 casters.sort((a,b)=>(b.spd||0)-(a.spd||0));
 cbtState._npcMagicOrder = casters;
 cbtState._npcMagicIdx = 0;
 _magicPhaseStepNPC();
}

function _magicPhaseStepNPC(){
 const order = cbtState._npcMagicOrder || [];
 const idx = cbtState._npcMagicIdx || 0;
 const entry = order[idx];

 if(!entry){
  document.getElementById('npc-action-panel').style.display='none';
  if(cbtState.turn === 0){ _startRangedPhase(); } else { _showPCActionChoices(); }
  return;
 }

 if(entry.kind==='enemy'){
  cbtState._npcMagicIdx = idx+1;
  _enemyCastTtyfNPC(entry.actor, ()=>_magicPhaseStepNPC());
  return;
 }

 // 「近接攻撃フェーズへ」でPC・パーティNPCの残りをスキップした場合、自分の番は自動で飛ばす（敵は上のkind==='enemy'で引き続き処理される）
 if(cbtState._magicSkipRemainingPcParty){
  cbtState._npcMagicIdx = idx+1;
  _magicPhaseStepNPC();
  return;
 }

 // 闘技場モードでPCが倒れている場合、PCの詠唱順は自動でスキップする
 if(entry.kind==='pc' && cbtState.arenaMode && PC.con<=0){
  cbtState._npcMagicIdx = idx+1;
  _magicPhaseStepNPC();
  return;
 }

 const panel = document.getElementById('npc-action-panel');
 const title = document.getElementById('npc-action-title');
 const btns  = document.getElementById('npc-action-btns');
 panel.style.display='';
 btns.innerHTML='';

 if(entry.kind==='pc'){
  title.innerHTML=`<span style="color:#e0d8c8;font-size:var(--font-sm)"> 魔法フェーズ — ${PC.name}の詠唱</span>`;
  const castBtn = document.createElement('button');
  castBtn.className='choice-btn';
  castBtn.style.cssText='border-color:var(--white2);color:#e0d8c8';
  castBtn.textContent=' 魔法を詠唱する';
  castBtn.onclick=()=>{ _magicPhaseSpellSelectNPC(); };
  btns.appendChild(castBtn);
 } else {
  const npc = entry.actor;
  const typeJa={warrior:'戦士',rogue:'盗賊',wizard:'魔法使い'}[npc.type]||npc.type;
  title.innerHTML=`<span style="color:#e0d8c8;font-size:var(--font-sm)"> 魔法フェーズ — ${npc.name}（${typeJa}）の詠唱</span>`;
  const castBtn = document.createElement('button');
  castBtn.className='choice-btn';
  castBtn.style.cssText='border-color:var(--white2);color:#e0d8c8';
  castBtn.textContent=' 魔法を詠唱する';
  castBtn.onclick=()=>{ _magicPhaseNPCSpellSelectNPC(npc); };
  btns.appendChild(castBtn);
 }

 const skipBtn = document.createElement('button');
 skipBtn.className='choice-btn';
 skipBtn.textContent='スキップ';
 skipBtn.onclick=()=>{ cbtState._npcMagicIdx = idx+1; _magicPhaseStepNPC(); };
 btns.appendChild(skipBtn);

 const skipAllBtn = document.createElement('button');
 skipAllBtn.className='choice-btn';
 skipAllBtn.style.cssText='border-color:var(--white2);color:var(--white);font-size:calc(var(--font-sm) - 1px)';
 skipAllBtn.textContent='近接攻撃フェーズへ';
 skipAllBtn.onclick=()=>{
  panel.style.display='none';
  // PC・パーティNPCの残りはスキップするが、敵（wizard型）の残り分は自動処理を継続する
  cbtState._magicSkipRemainingPcParty = true;
  _magicPhaseStepNPC();
 };
 btns.appendChild(skipAllBtn);
}

function _magicPhaseSpellSelectNPC(){
 const title = document.getElementById('npc-action-title');
 const btns  = document.getElementById('npc-action-btns');
 title.innerHTML=`<span style="color:#e0d8c8;font-size:var(--font-sm)"> 呪文を選択</span>`;
 btns.innerHTML='';

 PC.spells.forEach(sp=>{
  if(['wisp','cateyes','blindSpot','enchantWeapon','fortifyArmor'].includes(sp.fn)) return;
  const canAfford = PC.st > sp.cost;
  const b = document.createElement('button');
  b.className='choice-btn';
  b.style.cssText='border-color:#d8d0c0;color:'+(canAfford?'var(--info2)':'var(--info-border)');
  b.innerHTML=`${sp.name} <span style="color:#e0d0d0;font-size:calc(var(--font-sm) - 1px)">強さ-${sp.cost}</span>`;
  b.disabled=!canAfford;
  b.onclick=()=>{
   document.getElementById('npc-action-panel').style.display='none';
   cbtState._pcDidCast = true;
   cbtState._magicPhaseNext = ()=>{
    cbtState._magicPhaseNext=null;
    cbtState._npcMagicIdx = (cbtState._npcMagicIdx||0) + 1;
    _magicPhaseStepNPC();
   };
   castSpell(sp,'combat');
  };
  btns.appendChild(b);
 });

 const back = document.createElement('button');
 back.className='choice-btn';
 back.textContent='← 戻る';
 back.onclick=()=>{ _magicPhaseStepNPC(); };
 btns.appendChild(back);
}

function _magicPhaseNPCSpellSelectNPC(npc){
 const panel = document.getElementById('npc-action-panel');
 const title = document.getElementById('npc-action-title');
 const btns  = document.getElementById('npc-action-btns');
 panel.style.display='';
 title.innerHTML=`<span style="color:#e0d8c8;font-size:var(--font-sm)"> ${npc.name}の呪文を選択</span>`;
 btns.innerHTML='';

 (npc.spells||[]).forEach(sp=>{
  const canAfford=(npc.st||0)>sp.cost;
  const b=document.createElement('button');
  b.className='choice-btn';
  b.style.cssText='border-color:#d8d0c0;color:'+(canAfford?'var(--info2)':'var(--info-border)');
  b.innerHTML=`${sp.name} <span style="color:#e0d0d0;font-size:calc(var(--font-sm) - 1px)">強さ-${sp.cost}</span>`;
  b.disabled=!canAfford;
  b.onclick=()=>{
   const partyIdx = (PC.party||[]).indexOf(npc);
   cbtState[`_npcDidCast_${partyIdx}`] = true;
   _npcCastSpellInPhase(npc, 0, [], sp, ()=>{
    cbtState._npcMagicIdx = (cbtState._npcMagicIdx||0) + 1;
    _magicPhaseStepNPC();
   });
  };
  btns.appendChild(b);
 });

 const back=document.createElement('button');
 back.className='choice-btn';
 back.textContent='← 戻る';
 back.onclick=()=>{ _magicPhaseStepNPC(); };
 btns.appendChild(back);
}

// ── NPC型戦闘専用：敵wizardの自動詠唱（毎ターン可能・対象は常にPC・使える攻撃魔法からランダム）──
function _enemyCastTtyfNPC(enemy, onDone){
 if(enemy._shapeshifted){ onDone(); return; }
 const npcLv = enemy.level || 1;
 const picked = _npcPickAttackSpell(enemy, NPC_ATTACK_SPELL_FNS_VS_PC);
 if(!picked){ onDone(); return; }
 enemy.st -= picked.cost;
 const cl = document.getElementById('clog');
 const spDisplayName = {ttyf:'Magic Bolt', blastingPower:'Detonate', freezePleeze:'Ice Bind', turnToStone:'Turn to Stone', atomization:'Atomization'}[picked.fn] || picked.name;

 // Detonate/Ice Bind：詠唱者のレベル数を攻撃ダイスとして近接判定の合計に上乗せするだけ（防護値無視の直接ダメージなし・PC側の回避判定も不要）
 if(picked.fn === 'blastingPower' || picked.fn === 'freezePleeze'){
  const dmg = Nd6(npcLv);
  enemy._castDetonateThisRound = true;
  enemy._detonateHitThisRound = dmg;
  const flavorKey = picked.fn==='blastingPower' ? 'detonate_cast' : 'icebind_cast';
  cl.innerHTML += `<span style="color:#e0d8c8"> ${_spellFlavor(flavorKey, {caster:enemy.name})}（${npcLv}D6=${dmg}を近接判定に上乗せ）</span><br>`;
  onDone();
  return;
 }

 const panel = document.getElementById('npc-action-panel');
 const title = document.getElementById('npc-action-title');
 const btns  = document.getElementById('npc-action-btns');
 panel.style.display='';
 title.innerHTML = `<span style="color:#e0d8c8;font-size:var(--font-sm)"> ${enemy.name}が${spDisplayName}を放とうとしている！</span>`;
 btns.innerHTML = '';
 const braceBtn = document.createElement('button');
 braceBtn.className='choice-btn';
 braceBtn.style.cssText='border-color:#c05040;color:#e0a070';
 braceBtn.textContent='▶ 続ける';
 braceBtn.onclick = ()=>{
  panel.style.display='none';
  cl.innerHTML += `<span style="color:#e0d8c8"> ${enemy.name}が${spDisplayName}を詠唱！</span><br>`;

  // Turn to Stone / Atomization：固定レベル（6/7）でPCの運の能力値テスト
  if(picked.fn === 'turnToStone' || picked.fn === 'atomization'){
   _npcCombatTtyfDodge(picked.fn==='atomization'?7:6, PC, (dodged)=>{
    if(picked.fn === 'atomization'){
     const heatDmg = Nd6(npcLv);
     enemy._castDetonateThisRound = true;
     enemy._detonateHitThisRound = (enemy._detonateHitThisRound||0) + heatDmg;
     if(dodged){
      cl.innerHTML += `<span style="color:#e8e0d8"> ${_spellFlavor('atomization_dodge', {target:'あなた'})}（発生した熱で近接判定に${heatDmg}上乗せ）</span><br>`;
      onDone();
      return;
     }
     cl.innerHTML += `<span class="red"> ${_spellFlavor('atomization_hit', {target:'あなた'})}（発生した熱で近接判定にも${heatDmg}上乗せ）</span><br>`;
     PC.con = 0;
     updateHUD();
     if(_handlePCZeroCon(cl)) return;
     onDone();
     return;
    }
    // turnToStone
    if(dodged){
     cl.innerHTML += `<span style="color:#e8e0d8"> ${_spellFlavor('turnToStone_dodge', {target:'あなた'})}</span><br>`;
     onDone();
     return;
    }
    cl.innerHTML += `<span class="red"> ${_spellFlavor('turnToStone_hit', {target:'あなた'})}</span><br>`;
    PC.con = 0;
    updateHUD();
    if(_handlePCZeroCon(cl)) return;
    onDone();
   });
   return;
  }

  // Magic Bolt（ttyf）
  _npcCombatTtyfDodge(npcLv, PC, (dodged)=>{
   if(dodged){
    cl.innerHTML += `<span style="color:#e8e0d8"> ${_spellFlavor('ttyf_dodge', {target:'あなた'})}</span><br>`;
    enemy._castTtyfThisRound = false;
    enemy._ttyfHitThisRound = 0;
    onDone();
    return;
   }
   const dmg = (enemy.iq||0)*npcLv;
   PC.con = Math.max(0, PC.con - dmg);
   updateHUD();
   cl.innerHTML += `<span class="red"> ${_spellFlavor('ttyf_hit', {caster:enemy.name, target:'あなた'})}（CON-${dmg}・防護値無視・残り${PC.con}）</span><br>`;
   enemy._castTtyfThisRound = true;
   enemy._ttyfHitThisRound = dmg;
   if(PC.con <= 0){
    if(_handlePCZeroCon(cl)) return;
   }
   onDone();
  });
 };
 btns.appendChild(braceBtn);
}

function _magicPhaseStep(npcIdx, magicParty, pcDone){
 // まずPC（pcDone=trueの場合はスキップ）
 if(npcIdx === 0 && !pcDone && !cbtState._pcDidCast && !PC._shapeshifted && (PC.type==='wizard'||PC.type==='rogue') && PC.spells.length>0){
  const panel = document.getElementById('npc-action-panel');
  const title = document.getElementById('npc-action-title');
  const btns  = document.getElementById('npc-action-btns');
  panel.style.display='';
  title.innerHTML=`<span style="color:#e0d8c8;font-size:var(--font-sm)"> 魔法フェーズ — ${PC.name}の詠唱</span>`;
  btns.innerHTML='';

  const castBtn = document.createElement('button');
  castBtn.className='choice-btn';
  castBtn.style.cssText='border-color:var(--white2);color:#e0d8c8';
  castBtn.textContent=' 魔法を詠唱する';
  castBtn.onclick=()=>{ _magicPhaseSpellSelect(npcIdx, magicParty); };
  btns.appendChild(castBtn);

  const skipBtn = document.createElement('button');
  skipBtn.className='choice-btn';
  skipBtn.textContent='スキップ';
  skipBtn.onclick=()=>{ panel.style.display='none'; _magicPhaseStep(0, magicParty, true); };
  btns.appendChild(skipBtn);

  const skipAllBtn = document.createElement('button');
  skipAllBtn.className='choice-btn';
  skipAllBtn.style.cssText='border-color:var(--white2);color:var(--white);font-size:calc(var(--font-sm) - 1px)';
  skipAllBtn.textContent='近接攻撃フェーズへ';
  skipAllBtn.onclick=()=>{ panel.style.display='none'; _skipToMeleePhase(); };
  btns.appendChild(skipAllBtn);
  return;
 }

 // 次にNPC順
 const npc = magicParty[npcIdx];
 if(!npc){
  // 全員完了→遠距離フェーズ（ターン1）or 近接フェーズ
  document.getElementById('npc-action-panel').style.display='none';
  if(cbtState.turn === 0){
   _startRangedPhase();
  } else {
   _showPCActionChoices();
  }
  return;
 }

 const partyIdx = (PC.party||[]).indexOf(npc);
 if(cbtState[`_npcDidCast_${partyIdx}`]){
  _magicPhaseStep(npcIdx+1, magicParty);
  return;
 }

 // autoNPCモード：UIを出さず自動で詠唱するか決める（使える攻撃魔法からランダム・対象はランダム）
 if(cbtState.autoNPC || _isCompanionHuntCombat()){
  if(npc._shapeshifted){ _magicPhaseStep(npcIdx+1, magicParty); return; }
  const alive = cbtState.enemies.filter(e=>(cbtState.isNPC?e.curCon:e.curMR)>0);
  const picked = _npcPickAttackSpell(npc, NPC_ATTACK_SPELL_FNS_VS_ENEMY);
  if(picked && alive.length>0){
   cbtState[`_npcDidCast_${partyIdx}`] = true;
   const target = alive[Math.floor(Math.random()*alive.length)];
   const onDone = ()=>_magicPhaseStep(npcIdx+1, magicParty);
   if(picked.fn==='ttyf'){
    _npcTtyfApply(npc, picked, 1, picked.cost, target, onDone);
   } else {
    _npcAttackSpellApply(npc, picked, target, onDone);
   }
  } else {
   _magicPhaseStep(npcIdx+1, magicParty);
  }
  return;
 }

 const panel = document.getElementById('npc-action-panel');
 const title = document.getElementById('npc-action-title');
 const btns  = document.getElementById('npc-action-btns');
 panel.style.display='';
 const typeJa={warrior:'戦士',rogue:'盗賊',wizard:'魔法使い'}[npc.type]||npc.type;
 title.innerHTML=`<span style="color:#e0d8c8;font-size:var(--font-sm)"> 魔法フェーズ — ${npc.name}（${typeJa}）の詠唱</span>`;
 btns.innerHTML='';

 const castBtn = document.createElement('button');
 castBtn.className='choice-btn';
 castBtn.style.cssText='border-color:var(--white2);color:#e0d8c8';
 castBtn.textContent=' 魔法を詠唱する';
 castBtn.onclick=()=>{ _magicPhaseNPCSpellSelect(npc, npcIdx, magicParty); };
 btns.appendChild(castBtn);

 const skipBtn = document.createElement('button');
 skipBtn.className='choice-btn';
 skipBtn.textContent='スキップ';
 skipBtn.onclick=()=>{ _magicPhaseStep(npcIdx+1, magicParty); };
 btns.appendChild(skipBtn);

 const skipAllBtn = document.createElement('button');
 skipAllBtn.className='choice-btn';
 skipAllBtn.style.cssText='border-color:var(--white2);color:var(--white);font-size:calc(var(--font-sm) - 1px)';
 skipAllBtn.textContent='近接攻撃フェーズへ';
 skipAllBtn.onclick=()=>{ document.getElementById('npc-action-panel').style.display='none'; _skipToMeleePhase(); };
 btns.appendChild(skipAllBtn);
}

function _skipToMeleePhase(){
 // 魔法フェーズを全員スキップして近接攻撃フェーズへ（遠距離はスキップ）
 document.getElementById('npc-action-panel').style.display='none';
 _showPCActionChoices();
}

function _magicPhaseSpellSelect(npcIdx, magicParty){
 const title = document.getElementById('npc-action-title');
 const btns  = document.getElementById('npc-action-btns');
 title.innerHTML=`<span style="color:#e0d8c8;font-size:var(--font-sm)"> 呪文を選択</span>`;
 btns.innerHTML='';

 PC.spells.forEach(sp=>{
  // 戦闘外専用呪文は除外
  if(['wisp','cateyes','blindSpot','enchantWeapon','fortifyArmor'].includes(sp.fn)) return;
  const canAfford = PC.st > sp.cost;
  const b = document.createElement('button');
  b.className='choice-btn';
  b.style.cssText='border-color:#d8d0c0;color:'+(canAfford?'var(--info2)':'var(--info-border)');
  b.innerHTML=`${sp.name} <span style="color:#e0d0d0;font-size:calc(var(--font-sm) - 1px)">強さ-${sp.cost}</span>`;
  b.disabled=!canAfford;
  b.onclick=()=>{
   document.getElementById('npc-action-panel').style.display='none';
   cbtState._pcDidCast = true;
   // 次フェーズへのコールバックを登録（TTYF等の追加インタラクション後に呼ばれる）
   cbtState._magicPhaseNext = ()=>{ cbtState._magicPhaseNext=null; _magicPhaseStep(0, magicParty, true); };
   castSpell(sp,'combat');
  };
  btns.appendChild(b);
 });

 const back = document.createElement('button');
 back.className='choice-btn';
 back.textContent='← 戻る';
 back.onclick=()=>{ _magicPhaseStep(0, magicParty); };
 btns.appendChild(back);
}

function _magicPhaseNPCSpellSelect(npc, npcIdx, magicParty){
 const partyIdx = (PC.party||[]).indexOf(npc);
 const panel = document.getElementById('npc-action-panel');
 const title = document.getElementById('npc-action-title');
 const btns  = document.getElementById('npc-action-btns');
 panel.style.display='';
 title.innerHTML=`<span style="color:#e0d8c8;font-size:var(--font-sm)"> ${npc.name}の呪文を選択</span>`;
 btns.innerHTML='';

 (npc.spells||[]).forEach(sp=>{
  const canAfford=(npc.st||0)>sp.cost;
  const b=document.createElement('button');
  b.className='choice-btn';
  b.style.cssText='border-color:#d8d0c0;color:'+(canAfford?'var(--info2)':'var(--info-border)');
  b.innerHTML=`${sp.name} <span style="color:#e0d0d0;font-size:calc(var(--font-sm) - 1px)">強さ-${sp.cost}</span>`;
  b.disabled=!canAfford;
  b.onclick=()=>{
   cbtState[`_npcDidCast_${partyIdx}`]=true;
   _npcCastSpellInPhase(npc, npcIdx, magicParty, sp);
  };
  btns.appendChild(b);
 });

 const back=document.createElement('button');
 back.className='choice-btn';
 back.textContent='← 戻る';
 back.onclick=()=>{ _magicPhaseStep(npcIdx, magicParty); };
 btns.appendChild(back);
}

// NPC呪文詠唱処理（レベル選択→対象選択→効果）
function _npcCastSpellInPhase(npc, npcIdx, magicParty, sp, customOnDone){
 const onDone = customOnDone || (()=>{ _magicPhaseStep(npcIdx+1, magicParty); });
 const cl = document.getElementById('clog');

 if(sp.fn === 'ttyf'){
  // TTYFのみレベル選択（盗賊はLv1固定）
  if(npc.type === 'rogue'){
   _npcTtyfCast(npc, npcIdx, magicParty, sp, 1, sp.cost, onDone);
  } else {
   _npcTtyfSelectLevel(npc, npcIdx, magicParty, sp, onDone);
  }
  return;
 }

 if(sp.fn === 'blastingPower' || sp.fn === 'freezePleeze'){
  npc.st = Math.max(0,(npc.st||0)-_applyStaffDiscount(npc, sp.cost));
  const dice = npc.level || 1;
  const adds = Math.max(0, calcAdds(npc));
  const dmg = Nd6(dice) + adds;
  cbtState._spellHitBonus = (cbtState._spellHitBonus||0) + dmg;
  cbtState._spellCaster = true;
  const spName = sp.fn==='blastingPower' ? 'Detonate' : 'Ice Bind';
  cl.innerHTML += `<span style="color:#e0d8c8"> ${npc.name}が${spName}を詠唱！${dice}D+${adds}=${dmg}ヒット追加！</span><br>`;
  onDone();
  return;
 }

 if(sp.fn === 'vorpal' || sp.fn === 'whammy'){
  npc.st = Math.max(0,(npc.st||0)-_applyStaffDiscount(npc, sp.cost));
  const cfg = sp.fn==='vorpal'
   ? {pcFlagKey:'vorpalActive', npcFlagKey:'_vorpalNext', effectLabel:'次のラウンド武器ダイス2倍！'}
   : {pcFlagKey:'whammyActive', npcFlagKey:'_whammyNext', effectLabel:'次のラウンド武器ダイス3倍！'};
  _npcBuffTargetSelect(npc, npcIdx, magicParty, sp, onDone, cfg);
  return;
 }

 if(sp.fn === 'overdrive'){
  npc.st = Math.max(0,(npc.st||0)-_applyStaffDiscount(npc, sp.cost));
  _npcOverdriveSelectTarget(npc, npcIdx, magicParty, sp, onDone);
  return;
 }

 if(sp.fn === 'poorBaby'){
  npc.st = Math.max(0,(npc.st||0)-_applyStaffDiscount(npc, sp.cost));
  if(npc.con >= npc.maxCon){
   npc.st += sp.cost; // 失敗時は返還
   cl.innerHTML += `<span style="color:#e0d8c8"> ${npc.name}が${sp.name}を詠唱したが、体力はすでに最大値だった。</span><br>`;
   onDone(); return;
  }
  let healed = 0;
  while(npc.st >= 2 && npc.con < npc.maxCon){ npc.st -= 2; npc.con++; healed++; }
  cl.innerHTML += `<span style="color:#e8e4d8"> ${npc.name}が${sp.name}を詠唱！体力+${healed}回復！（体力 ${npc.con}/${npc.maxCon}）</span><br>`;
  updateHUD();
  onDone(); return;
 }

 if(sp.fn === 'healingFeeling'){
  npc.st = Math.max(0,(npc.st||0)-_applyStaffDiscount(npc, sp.cost));
  npc._poisoned = false; npc._diseased = false;
  cl.innerHTML += `<span style="color:#e8e4d8"> ${npc.name}が${sp.name}を詠唱！体内の毒・病が浄化された！</span><br>`;
  onDone(); return;
 }

 if(sp.fn === 'rockABye'){
  npc.st = Math.max(0,(npc.st||0)-_applyStaffDiscount(npc, sp.cost));
  const power = (npc.st||0)+(npc.iq||0)+(npc.chr||0);
  const enemyMR = cbtState.enemies ? cbtState.enemies.reduce((s,e)=>s+(e.curMR||0),0) : (cbtState.curMR||0);
  if(power > enemyMR){
   const sleepTurns = Nd6(1);
   cbtState.sleeping = sleepTurns;
   cl.innerHTML += `<span style="color:#e8e4d8"> ${npc.name}が${sp.name}を詠唱！強さ+知力+魅力=${power} ＞ CombatRating ${enemyMR}。敵が${sleepTurns}ターン眠り込んだ！</span><br>`;
  } else {
   cl.innerHTML += `<span style="color:#f0ddd8"> ${npc.name}が${sp.name}を詠唱したが、強さ+知力+魅力=${power} ≤ CombatRating ${enemyMR}で効かなかった。</span><br>`;
  }
  updateCombatUI();
  onDone(); return;
 }

 if(sp.fn === 'blindSpot'){
  cl.innerHTML += `<span style="color:#f0ddd8"> ${npc.name}が${sp.name}を詠唱しようとしたが、戦闘中は効果がない。</span><br>`;
  onDone(); return;
 }

 if(sp.fn === 'enchantWeapon' || sp.fn === 'fortifyArmor'){
  cl.innerHTML += `<span style="color:#f0ddd8"> ${npc.name}が${sp.name}を詠唱しようとしたが、戦闘中は使えない呪文だった。</span><br>`;
  onDone(); return;
 }

 if(sp.fn === 'summon'){
  npc.st = Math.max(0,(npc.st||0)-_applyStaffDiscount(npc, sp.cost));
  const cr = (npc.iq||0)+(npc.lk||0)+(npc.chr||0);
  const demon = {
   name: '召喚された悪魔', type: 'warrior', race: 'demon',
   st: cr, iq: 8, lk: cr, con: cr, dex: cr, chr: 8, spd: 8,
   maxCon: cr, curCon: cr, maxSt: cr, level: npc.level||1,
   epithet: '', ap: 0, gold: 0, sp: 0, cp: 0,
   equippedWeapons: [{name:'鉤爪', dice:2, adds:0, twoHand:false}],
   equippedArmors: [], equippedBoots:false, equippedClothing:false,
   invWeapons: [], invArmors: [], spells: [],
   alignment_ethics:0, alignment_order:0,
   _isSummonedDemon: true,
  };
  PC.party = [...(PC.party||[]), demon];
  cl.innerHTML += `<span style="color:#e8e4d8"> ${_spellFlavor('summon_cast', {caster:npc.name})}（CombatRating ${cr}）パーティに加わった！</span><br>`;
  updateCombatUI();
  onDone(); return;
 }

 if(sp.fn === 'shapeshift'){
  npc.st = Math.max(0,(npc.st||0)-_applyStaffDiscount(npc, sp.cost));
  const cr = (npc.st||0)+(npc.iq||0)+(npc.lk||0)+(npc.con||0)+(npc.dex||0)+(npc.chr||0)+(npc.spd||0);
  const origName = npc.name;
  npc._shapeshiftOriginal = { name:npc.name };
  npc.name = `悪魔と化した${origName}`;
  npc._shapeshiftCR = cr; // 戦闘が終わるまで、近接判定は毎ラウンドこの値そのものを使う
  npc._shapeshifted = true;
  cl.innerHTML += `<span style="color:#e8e4d8"> ${_spellFlavor('shapeshift_cast', {caster:origName})}（CombatRating ${cr}）</span><br>`;
  updateCombatUI();
  onDone(); return;
 }

 if(sp.fn === 'turnToStone' || sp.fn === 'atomization'){
  npc.st = Math.max(0,(npc.st||0)-_applyStaffDiscount(npc, sp.cost));
  const isNPCCbt = cbtState.isNPC;
  const alive = cbtState.enemies.filter(e=>(isNPCCbt?e.curCon:e.curMR)>0);
  const applyOne = (target)=>{
   const dodgeLv = sp.fn==='atomization' ? 7 : 6;
   _npcCombatTtyfDodge(dodgeLv, target, (dodged)=>{
    if(sp.fn==='atomization'){
     const heatDmg = Nd6(npc.level||1);
     cbtState._spellHitBonus = (cbtState._spellHitBonus||0) + heatDmg;
     if(dodged){
      cl.innerHTML += `<span style="color:#e8e4d8"> ${npc.name}が${sp.name}を詠唱！${_spellFlavor('atomization_dodge', {target:target.name})}（熱で近接戦闘に${heatDmg}ヒット追加）</span><br>`;
     } else {
      if(isNPCCbt) target.curCon = 0; else target.curMR = 0;
      cl.innerHTML += `<span style="color:#e8e4d8"> ${npc.name}が${sp.name}を詠唱！${_spellFlavor('atomization_hit', {target:target.name})}（熱で近接戦闘に${heatDmg}ヒット追加）</span><br>`;
     }
    } else {
     if(dodged){
      cl.innerHTML += `<span style="color:#e8e4d8"> ${npc.name}が${sp.name}を詠唱！${_spellFlavor('turnToStone_dodge', {target:target.name})}</span><br>`;
     } else {
      if(isNPCCbt) target.curCon = 0; else target.curMR = 0;
      cl.innerHTML += `<span style="color:#e8e4d8"> ${npc.name}が${sp.name}を詠唱！${_spellFlavor('turnToStone_hit', {target:target.name})}</span><br>`;
     }
    }
    updateCombatUI();
    onDone();
   });
  };
  if(alive.length<=1){
   if(alive.length===1) applyOne(alive[0]); else onDone();
  } else {
   const panel = document.getElementById('npc-action-panel');
   const title = document.getElementById('npc-action-title');
   const btns  = document.getElementById('npc-action-btns');
   panel.style.display='';
   title.innerHTML=`<span style="color:#e0d8c8;font-size:var(--font-sm)"> ${npc.name}の${sp.name} — 対象を選択</span>`;
   btns.innerHTML='';
   alive.forEach(e=>{
    const b=document.createElement('button');
    b.className='choice-btn';
    b.style.cssText='border-color:#d8d0c0;color:#e0d8c8';
    b.textContent = `${e.name}（${isNPCCbt?`体力${e.curCon}`:`CombatRating${e.curMR}`}）`;
    b.onclick=()=>{ applyOne(e); };
    btns.appendChild(b);
   });
  }
  return;
 }

 // その他の呪文（未定義効果）：ST消費してログ出力のみ
 npc.st = Math.max(0,(npc.st||0)-_applyStaffDiscount(npc, sp.cost));
 cl.innerHTML += `<span style="color:#e0d8c8"> ${npc.name}が${sp.name}を詠唱した！（強さ-${sp.cost}）</span><br>`;
 onDone();
}

// ── NPC詠唱：バフ系呪文の対象選択（Keen Blade / Battle Surge） ──
function _npcBuffTargetSelect(npc, npcIdx, magicParty, sp, onDone, cfg){
 const aliveOthers = (PC.party||[]).filter(n=>n.con>0 && n!==npc);
 const targets = [npc, PC, ...aliveOthers];
 const panel = document.getElementById('npc-action-panel');
 const title = document.getElementById('npc-action-title');
 const btns  = document.getElementById('npc-action-btns');
 panel.style.display='';
 title.innerHTML=`<span style="color:#e0d8c8;font-size:var(--font-sm)"> ${npc.name}の${sp.name} — 誰にかけますか？</span>`;
 btns.innerHTML='';
 targets.forEach(actor=>{
  const b=document.createElement('button');
  b.className='choice-btn';
  b.style.cssText='border-color:#d8d0c0;color:#e0d8c8';
  b.textContent = actor===npc ? `${npc.name}（自分）` : actor===PC ? `${PC.name}（あなた）` : actor.name;
  b.onclick=()=>{
   if(actor===PC){ cbtState[cfg.pcFlagKey]=true; }
   else { actor[cfg.npcFlagKey]=true; }
   const cl=document.getElementById('clog');
   const targetLabel = actor===npc ? '自分' : actor===PC ? PC.name : actor.name;
   cl.innerHTML += `<span style="color:#e8e4d8"> ${npc.name}が${sp.name}を${targetLabel}にかけた！${cfg.effectLabel}</span><br>`;
   onDone();
  };
  btns.appendChild(b);
 });
}

// ── NPC詠唱：Overdrive 対象選択 ──
function _npcOverdriveSelectTarget(npc, npcIdx, magicParty, sp, onDone){
 const aliveOthers = (PC.party||[]).filter(n=>n.con>0 && n!==npc);
 const targets = [npc, PC, ...aliveOthers];
 const panel = document.getElementById('npc-action-panel');
 const title = document.getElementById('npc-action-title');
 const btns  = document.getElementById('npc-action-btns');
 panel.style.display='';
 title.innerHTML=`<span style="color:#e0d8c8;font-size:var(--font-sm)"> ${npc.name}のOverdrive — 誰にかけますか？</span>`;
 btns.innerHTML='';
 targets.forEach(actor=>{
  const b=document.createElement('button');
  b.className='choice-btn';
  b.style.cssText='border-color:#d8d0c0;color:#e0d8c8';
  b.textContent = actor===npc ? `${npc.name}（自分）` : actor===PC ? `${PC.name}（あなた）` : actor.name;
  b.onclick=()=>{ _npcOverdriveSelectAttr(npc, actor, onDone); };
  btns.appendChild(b);
 });
}

// ── NPC詠唱：Overdrive 能力値選択 ──
function _npcOverdriveSelectAttr(npc, actor, onDone){
 const attrNames = [
  {key:'st', label:'強さ'}, {key:'iq', label:'知力'}, {key:'lk', label:'運'},
  {key:'dex', label:'器用さ'}, {key:'chr', label:'魅力'}, {key:'spd', label:'素早さ'},
 ];
 const panel = document.getElementById('npc-action-panel');
 const title = document.getElementById('npc-action-title');
 const btns  = document.getElementById('npc-action-btns');
 panel.style.display='';
 const targetLabel = actor===PC ? `${PC.name}（あなた）` : actor===npc ? `${npc.name}（自分）` : actor.name;
 title.innerHTML=`<span style="color:#e0d8c8;font-size:var(--font-sm)"> ${targetLabel}のどの能力値を2倍にしますか？</span>`;
 btns.innerHTML='';
 attrNames.forEach(a=>{
  const val = actor[a.key];
  const b=document.createElement('button');
  b.className='choice-btn';
  b.style.cssText='border-color:#d8d0c0;color:#e0d8c8';
  b.innerHTML=`${a.label}（現在 ${val}）→ ${val*2}`;
  b.onclick=()=>{
   cbtState._overdriveList = cbtState._overdriveList || [];
   cbtState._overdriveList.push({actor, key:a.key, orig:actor[a.key]});
   actor._overdrivePending = {key:a.key, orig:actor[a.key]};
   actor[a.key] = actor[a.key]*2;
   const cl=document.getElementById('clog');
   cl.innerHTML += `<span style="color:#e8e4d8"> ${npc.name}のOverdrive：${targetLabel}の${a.label}が${val*2}に跳ね上がった！（1ラウンド）</span><br>`;
   updateHUD();
   onDone();
  };
  btns.appendChild(b);
 });
}

function _npcTtyfSelectLevel(npc, npcIdx, magicParty, sp, onDone){
 const maxLv = npc.level || 1;
 const panel = document.getElementById('npc-action-panel');
 const title = document.getElementById('npc-action-title');
 const btns  = document.getElementById('npc-action-btns');
 panel.style.display='';
 title.innerHTML=`<span style="color:#e0d8c8;font-size:var(--font-sm)"> ${npc.name}のTTYF — レベルを選択（最大Lv${maxLv}）</span>`;
 btns.innerHTML='';

 for(let lv=1; lv<=maxLv; lv++){
  const stCost = 6*lv;
  const discCost = _applyStaffDiscount(npc, stCost);
  if((npc.st||0) <= discCost) continue;
  const b=document.createElement('button');
  b.className='choice-btn';
  b.style.cssText='border-color:#d8d0c0;color:#e0d8c8';
  b.innerHTML=`Lv${lv} <span style="color:#e0d0d0;font-size:calc(var(--font-sm) - 1px)">強さ-${discCost}</span>`;
  b.onclick=()=>{ _npcTtyfCast(npc, npcIdx, magicParty, sp, lv, stCost, onDone); };
  btns.appendChild(b);
 }
}

function _npcTtyfCast(npc, npcIdx, magicParty, sp, lv, stCost, onDone){
 const isNPCCbt = cbtState.isNPC;
 const alive = cbtState.enemies.filter(e=>(isNPCCbt?e.curCon:e.curMR)>0);
 if(alive.length===1){
  _npcTtyfApply(npc, sp, lv, stCost, alive[0], onDone);
  return;
 }
 const panel = document.getElementById('npc-action-panel');
 const title = document.getElementById('npc-action-title');
 const btns  = document.getElementById('npc-action-btns');
 panel.style.display='';
 title.innerHTML=`<span style="color:#e0d8c8;font-size:var(--font-sm)"> ${npc.name}のTTYF Lv${lv} — 対象を選択</span>`;
 btns.innerHTML='';
 alive.forEach(e=>{
  const b=document.createElement('button');
  b.className='choice-btn';
  b.style.cssText='border-color:#d8d0c0;color:#e0d8c8';
  const hpVal = isNPCCbt ? e.curCon : e.curMR;
  const hpLabel = isNPCCbt ? '体力' : 'CombatRating';
  b.textContent=`${e.name}（${hpLabel} ${hpVal}）`;
  b.onclick=()=>{ _npcTtyfApply(npc, sp, lv, stCost, e, onDone); };
  btns.appendChild(b);
 });
}

function _npcTtyfApply(npc, sp, lv, stCost, target, onDone){
 const isNPCCbt = cbtState.isNPC;
 npc.st = Math.max(0,(npc.st||0)-_applyStaffDiscount(npc, stCost));
 const dmg = (npc.iq||10)*lv;
 const cl = document.getElementById('clog');
 cl.innerHTML+=`<span style="color:#e0d8c8"> ${npc.name}がMagic Bolt Lv${lv}を詠唱！</span><br>`;

 const doHit = ()=>{
  const prevHp = isNPCCbt ? target.curCon : target.curMR;
  if(isNPCCbt){ target.curCon = Math.max(0, target.curCon - dmg); }
  else { target.curMR = Math.max(0, target.curMR - dmg); }
  const afterHp = isNPCCbt ? target.curCon : target.curMR;
  const hpLabel = isNPCCbt ? '体力' : 'CombatRating';
  cl.innerHTML+=`<span style="color:var(--white)"> ${target.name}に${dmg}ダメージ！（IQ${npc.iq||10}×Lv${lv}）${hpLabel}: ${prevHp}→${afterHp}</span><br>`;
  cbtState._npcTtyfMagicHit = (cbtState._npcTtyfMagicHit||0) + dmg;
  // HPバーのみ更新（_showPCActionChoicesは呼ばない）
  _updateCombatBars();
  // 全滅チェック
  if(cbtState.enemies.every(e=>(isNPCCbt?e.curCon:e.curMR)<=0)){
   gainAPAll(cbtState.totalMR);
   const cs = cbtState; // onWin側でcbtStateがnullになっても参照がずれないようスナップショットを保持
   showCombatOK(()=>{
    if(cs.win==='__noop__'){
     document.getElementById('cbt-area').classList.add('hidden');
     document.getElementById('scroll-area').classList.remove('in-combat');
     document.getElementById('text-win').style.display='';
     cbtState=null; if(cs.onWin)cs.onWin();
    } else {
     if(cs.onWin) cs.onWin();
     go(cs.win||currentNodeId);
    }
   });
   return;
  }
  onDone();
 };

 // NPC型戦闘限定：対象（敵）の回避判定を挟む（内部計算のみ、演出なし）
 if(isNPCCbt){
  _npcCombatTtyfDodge(lv, target, (dodged)=>{
   if(dodged){
    cl.innerHTML += `<span style="color:#e8e0d8"> ${target.name}は咄嗟に身をかわし、魔法を回避した！</span><br>`;
    onDone();
    return;
   }
   doHit();
  });
  return;
 }
 doHit();
}

// 味方NPC・敵NPCが使える攻撃魔法のプール
const NPC_ATTACK_SPELL_FNS_VS_PC = ['ttyf','blastingPower','freezePleeze','turnToStone','atomization']; // 敵→PC（高レベル魔法も解禁）
const NPC_ATTACK_SPELL_FNS_VS_ENEMY = ['ttyf','blastingPower','freezePleeze','turnToStone','atomization']; // 味方→敵

// 攻撃魔法を1つランダムに選ぶ（使用可能なものがなければnull）
function _npcPickAttackSpell(npc, pool){
 const usable = (npc.spells||[]).filter(sp=>{
  if(!pool.includes(sp.fn)) return false;
  const cost = sp.fn==='ttyf' ? sp.cost : sp.cost; // ttyfもLv1固定なのでsp.costそのまま
  return (npc.st||0) > cost;
 });
 if(!usable.length) return null;
 return usable[Math.floor(Math.random()*usable.length)];
}

// ttyf以外の攻撃魔法（blastingPower/freezePleeze/turnToStone/atomization）をNPCが対象に適用する
function _npcAttackSpellApply(npc, sp, target, onDone){
 const isNPCCbt = cbtState.isNPC;
 npc.st = Math.max(0,(npc.st||0)-_applyStaffDiscount(npc, sp.cost));
 const cl = document.getElementById('clog');
 const npcLv = npc.level||1;

 const checkWipeAndDone = ()=>{
  _updateCombatBars();
  if(cbtState.enemies.every(e=>(isNPCCbt?e.curCon:e.curMR)<=0)){
   gainAPAll(cbtState.totalMR);
   const cs = cbtState;
   showCombatOK(()=>{
    if(cs.win==='__noop__'){
     document.getElementById('cbt-area').classList.add('hidden');
     document.getElementById('scroll-area').classList.remove('in-combat');
     document.getElementById('text-win').style.display='';
     cbtState=null; if(cs.onWin)cs.onWin();
    } else {
     if(cs.onWin) cs.onWin();
     go(cs.win||currentNodeId);
    }
   });
   return true;
  }
  onDone();
  return false;
 };

 if(sp.fn==='blastingPower' || sp.fn==='freezePleeze'){
  const spName = sp.fn==='blastingPower' ? 'Detonate' : 'Ice Bind';
  const flavorKey = sp.fn==='blastingPower' ? 'detonate_cast' : 'icebind_cast';
  // NPC型戦闘：詠唱者のレベル数を攻撃ダイスとして、対象の近接判定に上乗せするだけ（回避判定・直接ダメージなし）
  if(isNPCCbt){
   const dmg = Nd6(npcLv);
   target._castDetonateThisRound = true;
   target._detonateHitThisRound = (target._detonateHitThisRound||0) + dmg;
   cl.innerHTML += `<span style="color:#e0d8c8"> ${_spellFlavor(flavorKey, {caster:npc.name})}（${target.name}の近接判定に${npcLv}D6=${dmg}を上乗せ）</span><br>`;
   onDone();
   return;
  }
  // MR型戦闘：敵は個別ロールを持たないため、従来通り回避判定＋直接ダメージ
  cl.innerHTML += `<span style="color:#e0d8c8"> ${_spellFlavor(flavorKey, {caster:npc.name})}</span><br>`;
  _npcCombatTtyfDodge(npcLv, target, (dodged)=>{
   if(dodged){
    cl.innerHTML += `<span style="color:#e8e0d8"> ${target.name}は咄嗟に身をかわし、魔法を回避した！</span><br>`;
    onDone();
    return;
   }
   const dmg = Nd6(npcLv);
   const prevHp = target.curMR;
   target.curMR = Math.max(0, target.curMR - dmg);
   const afterHp = target.curMR;
   cl.innerHTML += `<span style="color:var(--white)"> ${target.name}に${dmg}ダメージ！ CombatRating: ${prevHp}→${afterHp}</span><br>`;
   checkWipeAndDone();
  });
  return;
 }
 if(sp.fn==='turnToStone'){
  cl.innerHTML += `<span style="color:#e0d8c8"> ${npc.name}がTurn to Stoneを詠唱！</span><br>`;
  _npcCombatTtyfDodge(6, target, (dodged)=>{
   if(dodged){
    cl.innerHTML += `<span style="color:#e8e0d8"> ${_spellFlavor('turnToStone_dodge', {target:target.name})}</span><br>`;
   } else {
    if(isNPCCbt) target.curCon = 0; else target.curMR = 0;
    cl.innerHTML += `<span style="color:var(--white)"> ${_spellFlavor('turnToStone_hit', {target:target.name})}</span><br>`;
   }
   checkWipeAndDone();
  });
  return;
 }
 if(sp.fn==='atomization'){
  cl.innerHTML += `<span style="color:#e0d8c8"> ${npc.name}がAtomizationを詠唱！</span><br>`;
  _npcCombatTtyfDodge(7, target, (dodged)=>{
   const heatDmg = Nd6(npcLv);
   cbtState._spellHitBonus = (cbtState._spellHitBonus||0) + heatDmg;
   if(dodged){
    cl.innerHTML += `<span style="color:#e8e0d8"> ${_spellFlavor('atomization_dodge', {target:target.name})}（発生した熱で近接戦闘に${heatDmg}ヒット追加）</span><br>`;
   } else {
    if(isNPCCbt) target.curCon = 0; else target.curMR = 0;
    cl.innerHTML += `<span style="color:var(--white)"> ${_spellFlavor('atomization_hit', {target:target.name})}（発生した熱で近接戦闘に${heatDmg}ヒット追加）</span><br>`;
   }
   checkWipeAndDone();
  });
  return;
 }
 onDone();
}


function _startRangedPhase(){
 // NPC型戦闘は素早さ順の専用フローへ
 if(cbtState?.isNPC){ _startRangedPhaseNPC(); return; }
 // 遠距離武器を持つパーティNPCのリスト
 const rangedParty = (PC.party||[]).filter((n,i)=>n.con>0 && isRangedWeapon(n.equippedRanged) && !cbtState[`_npcDidCast_${i}`]);

 // PCと遠距離NPCを順番に処理
 _rangedPhaseStep(0, rangedParty);
}

// ── NPC型戦闘専用：素早さ順の遠距離攻撃フェーズ（最初のラウンドのみ）──
function _startRangedPhaseNPC(){
 const casters = [];
 (cbtState.enemies||[]).forEach(e=>{ e._rangedDodgeCount = 0; });
 if(isRangedWeapon(PC.equippedRanged) && !cbtState._pcRangedSkipped && !cbtState._pcDidRanged){
  casters.push({ kind:'pc', actor:PC, spd:PC.spd||0 });
 }
 (PC.party||[]).forEach((npc,i)=>{
  if(npc.con>0 && isRangedWeapon(npc.equippedRanged) && !cbtState[`_npcDidCast_${i}`] && !cbtState[`_npcDidRanged_${i}`]){
   casters.push({ kind:'party', actor:npc, idx:i, spd:npc.spd||0 });
  }
 });
 (cbtState.enemies||[]).forEach(e=>{
  if(e.curCon>0 && isRangedWeapon(e.equippedRanged)){
   casters.push({ kind:'enemy', actor:e, spd:e.spd||0 });
  }
 });
 casters.sort((a,b)=>(b.spd||0)-(a.spd||0));
 cbtState._npcRangedOrder = casters;
 cbtState._npcRangedIdx = 0;
 _rangedPhaseStepNPC();
}

function _rangedPhaseStepNPC(){
 const order = cbtState._npcRangedOrder || [];
 const idx = cbtState._npcRangedIdx || 0;
 const entry = order[idx];

 if(!entry || cbtState.enemies.every(e=>e.curCon<=0)){
  document.getElementById('npc-action-panel').style.display = 'none';
  _showPCActionChoices();
  return;
 }

 if(entry.kind==='enemy'){
  cbtState._npcRangedIdx = idx+1;
  _enemyRangedAttackNPC(entry.actor, ()=>_rangedPhaseStepNPC());
  return;
 }

 // 闘技場モードでPCが倒れている場合、PCの遠距離攻撃の番は自動でスキップする
 if(entry.kind==='pc' && cbtState.arenaMode && PC.con<=0){
  cbtState._npcRangedIdx = idx+1;
  _rangedPhaseStepNPC();
  return;
 }

 const panel = document.getElementById('npc-action-panel');
 const title = document.getElementById('npc-action-title');
 const btns  = document.getElementById('npc-action-btns');
 panel.style.display = '';
 btns.innerHTML = '';

 if(entry.kind==='pc'){
  const w = PC.equippedRanged;
  const needsArrow = w.isRanged && !w.rangedOk;
  const daggerUsed = w.rangedOk && cbtState._pcDaggerUsed;
  const hasArrow = !needsArrow || (PC.arrows||0) > 0;
  const canRanged = hasArrow && !daggerUsed;
  title.innerHTML = `<span style="color:#e0d8c8;font-size:var(--font-sm)"> 遠距離攻撃フェーズ — ${PC.name}</span>`;
  const doRanged = document.createElement('button');
  doRanged.className = 'choice-btn';
  doRanged.style.cssText = `border-color:#d8d0c0;color:${hasArrow?'var(--info2)':'var(--info-border)'}`;
  doRanged.textContent = ` 遠距離攻撃（${w.name}）${needsArrow?` 矢:${PC.arrows||0}本`:daggerUsed?' （投擲済み）':''}`;
  doRanged.disabled = !canRanged;
  doRanged.onclick = ()=>{ _pcRangedSelectTarget(()=>{ cbtState._npcRangedIdx=(cbtState._npcRangedIdx||0)+1; _rangedPhaseStepNPC(); }); };
  btns.appendChild(doRanged);
  if(!canRanged){
   const warn = document.createElement('div');
   warn.style.cssText = 'font-size:calc(var(--font-sm) - 2px);color:#e0d0d0;padding:4px 0';
   warn.textContent = !hasArrow ? ' 矢がありません' : ' この戦闘では短剣を投擲済みです';
   btns.appendChild(warn);
  }
 } else {
  const npc = entry.actor;
  const typeJa = {warrior:'戦士',rogue:'盗賊',wizard:'魔法使い'}[npc.type]||npc.type;
  title.innerHTML = `<span style="color:#e0d8c8;font-size:var(--font-sm)"> ${npc.name}（${typeJa}）の遠距離攻撃</span>`;
  const nW = npc.equippedRanged;
  const nNeedsArrow = nW.isRanged && !nW.rangedOk;
  const nDaggerUsed = nW.rangedOk && cbtState[`_npcDaggerUsed_${entry.idx}`];
  const nHasArrow = !nNeedsArrow || (npc.arrows||0) > 0;
  const nCanRanged = nHasArrow && !nDaggerUsed;
  const doRanged = document.createElement('button');
  doRanged.className = 'choice-btn';
  doRanged.style.cssText = `border-color:#d8d0c0;color:${nHasArrow?'var(--info2)':'var(--info-border)'}`;
  doRanged.textContent = ` 遠距離攻撃（${nW.name}）${nNeedsArrow?` 矢:${npc.arrows||0}本`:nDaggerUsed?' （投擲済み）':''}`;
  doRanged.disabled = !nCanRanged;
  doRanged.onclick = ()=>{ _npcRangedSelectTarget(npc, entry.idx, [], ()=>{ cbtState._npcRangedIdx=(cbtState._npcRangedIdx||0)+1; _rangedPhaseStepNPC(); }); };
  btns.appendChild(doRanged);
  if(!nCanRanged){
   const warn = document.createElement('div');
   warn.style.cssText = 'font-size:calc(var(--font-sm) - 2px);color:#e0d0d0;padding:4px 0';
   warn.textContent = !nHasArrow ? ' 矢がありません' : ' この戦闘では短剣を投擲済みです';
   btns.appendChild(warn);
  }
 }

 const skip = document.createElement('button');
 skip.className = 'choice-btn';
 skip.textContent = 'スキップ';
 skip.onclick = ()=>{
  if(entry.kind==='pc') cbtState._pcRangedSkipped = true;
  cbtState._npcRangedIdx = idx+1;
  _rangedPhaseStepNPC();
 };
 btns.appendChild(skip);
}

// ── NPC型戦闘専用：敵の遠距離攻撃（弓装備時、最初のラウンドのみ・対象は常にPC）──
// 敵自身の命中判定なので、ダイス演出は無し。結果はログで確認できる
function _enemyRangedAttackNPC(enemy, onDone){
 const w = enemy.equippedRanged;
 const cl = document.getElementById('clog');
 if(w.isRanged && !w.rangedOk){ enemy.arrows = Math.max(0,(enemy.arrows||0)-1); }
 const sr = savingRoll('dex', 2, enemy);
 cl.innerHTML += `<span style="color:#e0d8c8"> ${enemy.name}が${w.name}で狙いを定めた——[${sr.rolled}]+DEX(${enemy.dex||0})=${sr.total} vs ${sr.target}</span><br>`;
 if(sr.success){
  const diceRoll = Nd6(w.dice);
  const dexAdd = enemy.dex > 12 ? (enemy.dex-12)*2 : (enemy.dex < 9 ? (enemy.dex-9)*2 : 0);
  const stAdd  = enemy.st  > 12 ? enemy.st  - 12 : (enemy.st  < 9 ? enemy.st  - 9 : 0);
  const lkAdd  = enemy.lk  > 12 ? enemy.lk  - 12 : (enemy.lk  < 9 ? enemy.lk  - 9 : 0);
  const rangedAdds = stAdd + lkAdd + dexAdd;
  const hit = diceRoll + (w.adds||0) + rangedAdds;
  const armor = effectiveArmor();
  const dmg = Math.max(0, hit - armor);
  const applyRangedHit = ()=>{
   PC.con = Math.max(0, PC.con - dmg);
   updateHUD();
   cl.innerHTML += `<span class="red"> 命中！${w.dice}D=${diceRoll} adds=${rangedAdds} hit=${hit} → PC 体力-${dmg}${armor>0?`（防護-${armor}）`:''}（残り${PC.con}）</span><br>`;
   if(PC.con <= 0){
    if(_handlePCZeroCon(cl)) return;
   }
   updateCombatUI();
   onDone();
  };
  // 狙われていることを知らせ、回避するか武器を構えるか選ばせる
  cl.innerHTML += `<span style="color:#f0ddd8"> ${w.name}の狙いがPCに定まった！</span><br>`;
  const panel = document.getElementById('npc-action-panel');
  const title = document.getElementById('npc-action-title');
  const btns  = document.getElementById('npc-action-btns');
  panel.style.display = '';
  title.innerHTML = `<span style="color:#e0d8c8;font-size:var(--font-sm)"> ${enemy.name}の${w.name}がPCを狙っている！</span>`;
  btns.innerHTML = '';
  const dodgeBtn = document.createElement('button');
  dodgeBtn.className = 'choice-btn';
  dodgeBtn.style.cssText = 'border-color:#c05040;color:#e0a070';
  dodgeBtn.textContent = ' 回避する';
  dodgeBtn.onclick = ()=>{
   panel.style.display = 'none';
   // PCに回避のチャンスを与える。回避を試みたキャラクターは今ラウンドの近接攻撃に参加できない
   cbtState._pcDodgedRanged = true;
   // このラウンド何回目の回避かに応じてレベルが上がる（1回目は加算なし、2回目は+1、3回目は+2…）
   cbtState._pcRangedDodgeCount = (cbtState._pcRangedDodgeCount||0) + 1;
   const dodgeLevel = (enemy.level||1) + (cbtState._pcRangedDodgeCount - 1);
   if(cbtState._pcRangedDodgeCount > 1){
    cl.innerHTML += `<span style="color:#c8b8a0;font-size:calc(var(--font-sm) - 1px)"> （このラウンド${cbtState._pcRangedDodgeCount}回目の回避のため、判定レベルが+${cbtState._pcRangedDodgeCount-1}される）</span><br>`;
   }
   _npcCombatTtyfDodge(dodgeLevel, PC, (dodged)=>{
    if(dodged){
     cl.innerHTML += `<span style="color:#e8e0d8"> とっさに身をかわし、${w.name}を回避した！</span><br>`;
     updateCombatUI();
     onDone();
     return;
    }
    applyRangedHit();
   });
  };
  btns.appendChild(dodgeBtn);
  const standBtn = document.createElement('button');
  standBtn.className = 'choice-btn';
  standBtn.textContent = ' 武器を構える（回避せず、近接攻撃に備える）';
  standBtn.onclick = ()=>{
   panel.style.display = 'none';
   cl.innerHTML += `<span style="color:#d8d0c0"> 回避を選ばず、武器を構えたまま矢を受けることにした。</span><br>`;
   applyRangedHit();
  };
  btns.appendChild(standBtn);
  return;
 } else {
  cl.innerHTML += `<span style="color:#d8d0c0"> 外れた。</span><br>`;
 }
 updateCombatUI();
 onDone();
}

function _rangedPhaseStep(npcIdx, rangedParty){
 // PC未攻撃かつ遠距離武器あり かつ 魔法未詠唱 かつ 敵が生存している場合にPCフェーズ
 if(npcIdx === 0 && !cbtState._pcDidRanged && !cbtState._pcRangedSkipped && isRangedWeapon(PC.equippedRanged) && !cbtState.enemies.every(e=>(cbtState.isNPC?e.curCon:e.curMR)<=0)){
  // PCの遠距離攻撃選択UI
  const panel = document.getElementById('npc-action-panel');
  const title = document.getElementById('npc-action-title');
  const btns = document.getElementById('npc-action-btns');
  panel.style.display = '';
  title.innerHTML = `<span style="color:#e0d8c8;font-size:var(--font-sm)"> 遠距離攻撃フェーズ（ターン1のみ）</span>`;
  btns.innerHTML = '';

  // 弓の場合は矢チェック、短剣は投擲済みチェック
  const _pcW = PC.equippedRanged;
  const _pcNeedsArrow = _pcW.isRanged && !_pcW.rangedOk;
  const _pcDaggerUsed = _pcW.rangedOk && cbtState._pcDaggerUsed;
  const _pcHasArrow = !_pcNeedsArrow || (PC.arrows||0) > 0;
  const _pcCanRanged = _pcHasArrow && !_pcDaggerUsed;
  const doRanged = document.createElement('button');
  doRanged.className = 'choice-btn';
  doRanged.style.cssText = `border-color:#d8d0c0;color:${_pcHasArrow?'var(--info2)':'var(--info-border)'}`;
  doRanged.textContent = ` 遠距離攻撃（${_pcW.name}）${_pcNeedsArrow?` 矢:${PC.arrows||0}本`:_pcDaggerUsed?' （投擲済み）':''}`;
  doRanged.disabled = !_pcCanRanged;
  doRanged.onclick = ()=>{ _pcRangedSelectTarget(()=>_rangedPhaseStep(0, rangedParty, true)); };
  btns.appendChild(doRanged);
  if(!_pcCanRanged){
   const warn = document.createElement('div');
   warn.style.cssText = 'font-size:calc(var(--font-sm) - 2px);color:#e0d0d0;padding:4px 0';
   warn.textContent = !_pcHasArrow ? ' 矢がありません' : ' この戦闘では短剣を投擲済みです';
   btns.appendChild(warn);
  }

  const skip = document.createElement('button');
  skip.className = 'choice-btn';
  skip.textContent = 'スキップ';
  skip.onclick = ()=>{ panel.style.display='none'; cbtState._pcRangedSkipped=true; _rangedPhaseStep(0, rangedParty); };
  btns.appendChild(skip);
  return;
 }

 // NPC順に処理
 const npc = rangedParty[npcIdx];
 if(!npc || cbtState.enemies.every(e=>(cbtState.isNPC?e.curCon:e.curMR)<=0)){
  // 全員完了→近接フェーズへ
  document.getElementById('npc-action-panel').style.display = 'none';
  _showPCActionChoices();
  return;
 }

 // autoNPCモード：UIを出さず自動で遠距離攻撃するか決める（対象はランダム）
 if(cbtState.autoNPC || _isCompanionHuntCombat()){
  const w = npc.equippedRanged;
  const needsArrow = w && w.isRanged && !w.rangedOk;
  const daggerUsed = w && w.rangedOk && cbtState[`_npcDaggerUsed_${npcIdx}`];
  const hasArrow = !needsArrow || (npc.arrows||0) > 0;
  const alive = cbtState.enemies.filter(e=>(cbtState.isNPC?e.curCon:e.curMR)>0);
  if(w && hasArrow && !daggerUsed && alive.length>0){
   const target = alive[Math.floor(Math.random()*alive.length)];
   _npcRangedAttack(npc, target, npcIdx, rangedParty, ()=>_rangedPhaseStep(npcIdx+1, rangedParty));
  } else {
   _rangedPhaseStep(npcIdx+1, rangedParty);
  }
  return;
 }

 const panel = document.getElementById('npc-action-panel');
 const title = document.getElementById('npc-action-title');
 const btns = document.getElementById('npc-action-btns');
 panel.style.display = '';
 const typeJa = {warrior:'戦士',rogue:'盗賊',wizard:'魔法使い'}[npc.type]||npc.type;
 title.innerHTML = `<span style="color:#e0d8c8;font-size:var(--font-sm)"> ${npc.name}（${typeJa}）の遠距離攻撃</span>`;
 btns.innerHTML = '';

 // 弓の場合は矢チェック、短剣は投擲済みチェック
 const _nW = npc.equippedRanged;
 const _nNeedsArrow = _nW.isRanged && !_nW.rangedOk;
 const _nDaggerUsed = _nW.rangedOk && (cbtState[`_npcDaggerUsed_${npcIdx}`]);
 const _nHasArrow = !_nNeedsArrow || (npc.arrows||0) > 0;
 const _nCanRanged = _nHasArrow && !_nDaggerUsed;
 const doRanged = document.createElement('button');
 doRanged.className = 'choice-btn';
 doRanged.style.cssText = `border-color:#d8d0c0;color:${_nHasArrow?'var(--info2)':'var(--info-border)'}`;
 doRanged.textContent = ` 遠距離攻撃（${_nW.name}）${_nNeedsArrow?` 矢:${npc.arrows||0}本`:_nDaggerUsed?' （投擲済み）':''}`;
 doRanged.disabled = !_nCanRanged;
 doRanged.onclick = ()=>{ _npcRangedSelectTarget(npc, npcIdx, rangedParty); };
 btns.appendChild(doRanged);
 if(!_nCanRanged){
  const warn = document.createElement('div');
  warn.style.cssText = 'font-size:calc(var(--font-sm) - 2px);color:#e0d0d0;padding:4px 0';
  warn.textContent = !_nHasArrow ? ' 矢がありません' : ' この戦闘では短剣を投擲済みです';
  btns.appendChild(warn);
 }

 const skip = document.createElement('button');
 skip.className = 'choice-btn';
 skip.textContent = 'スキップ';
 skip.onclick = ()=>{ _rangedPhaseStep(npcIdx+1, rangedParty); };
 btns.appendChild(skip);
}

function _npcRangedSelectTarget(npc, npcIdx, rangedParty, customOnDone){
 const alive = cbtState.enemies.filter(e=>(cbtState.isNPC?e.curCon:e.curMR)>0);
 if(alive.length === 1){ _npcRangedAttack(npc, alive[0], npcIdx, rangedParty, customOnDone); return; }

 const panel = document.getElementById('npc-action-panel');
 const title = document.getElementById('npc-action-title');
 const btns = document.getElementById('npc-action-btns');
 panel.style.display = '';
 title.innerHTML = `<span style="color:#e0d8c8;font-size:var(--font-sm)"> ${npc.name}の遠距離攻撃 — 対象を選択</span>`;
 btns.innerHTML = '';
 alive.forEach(e=>{
  const b = document.createElement('button');
  b.className = 'choice-btn';
  b.style.cssText = 'border-color:#d8d0c0;color:#e0d8c8';
  b.textContent = cbtState.isNPC ? `${e.name}（体力 ${e.curCon}）` : `${e.name}（CombatRating ${e.curMR}）`;
  b.onclick = ()=>{ _npcRangedAttack(npc, e, npcIdx, rangedParty, customOnDone); };
  btns.appendChild(b);
 });
}

function _npcRangedAttack(npc, target, npcIdx, rangedParty, customOnDone){
 const onDone = customOnDone || (()=>{ _rangedPhaseStep(npcIdx+1, rangedParty); });
 const w = npc.equippedRanged;
 const cl = document.getElementById('clog');
 // 弓の場合は矢を1本消費、短剣は投擲済みフラグ
 if(w.isRanged && !w.rangedOk){ npc.arrows = Math.max(0,(npc.arrows||0)-1); }
 else if(w.rangedOk){ cbtState[`_npcDaggerUsed_${npcIdx}`] = true; }
 cbtState[`_npcDidRanged_${npcIdx}`] = true;
 const sr = savingRoll('dex', 2, npc);
 if(sr.success){
  const diceRoll = Nd6(w.dice);
  const dexAdd = npc.dex > 12 ? (npc.dex-12)*2 : (npc.dex < 9 ? (npc.dex-9)*2 : 0);
  const stAdd  = npc.st  > 12 ? npc.st  - 12 : (npc.st  < 9 ? npc.st  - 9 : 0);
  const lkAdd  = npc.lk  > 12 ? npc.lk  - 12 : (npc.lk  < 9 ? npc.lk  - 9 : 0);
  const rangedAdds = stAdd + lkAdd + dexAdd;
  const hit = diceRoll + (w.adds||0) + rangedAdds;
  const armor = cbtState.isNPC ? calcNPCArmor(target) : (target.armor||0);
  const dmg = Math.max(0, hit - armor);
  const applyRangedHit = ()=>{
   if(cbtState.isNPC){ target.curCon=Math.max(0,target.curCon-dmg); } else { target.curMR=Math.max(0,target.curMR-dmg); }
   cbtState._rangedHitTotal = (cbtState._rangedHitTotal||0) + hit;
   cl.innerHTML += `<span style="color:#e0d8c8"> ${npc.name}の遠距離攻撃命中！${w.dice}D=${diceRoll} adds=${rangedAdds} hit=${hit} → ${target.name} CombatRating-${dmg}${armor>0?`（防護-${armor}）`:''}</span><br>`;
   updateCombatUI();
   onDone();
  };
  if(cbtState.isNPC){
   target._dodgedRangedThisRound = true;
   target._rangedDodgeCount = (target._rangedDodgeCount||0) + 1;
   const dodgeLevel = (npc.level||1) + (target._rangedDodgeCount - 1);
   if(target._rangedDodgeCount > 1){
    cl.innerHTML += `<span style="color:#c8b8a0;font-size:calc(var(--font-sm) - 1px)"> （${target.name}はこのラウンド${target._rangedDodgeCount}回目の回避のため、判定レベルが+${target._rangedDodgeCount-1}される）</span><br>`;
   }
   _npcCombatTtyfDodge(dodgeLevel, target, (dodged)=>{
    if(dodged){
     cl.innerHTML += `<span style="color:#e8e0d8"> ${target.name}は咄嗟に身をかわし、${npc.name}の${w.name}を回避した！</span><br>`;
     updateCombatUI();
     onDone();
     return;
    }
    applyRangedHit();
   });
   return;
  }
  applyRangedHit();
  return;
 } else {
  const hit = w.dice + (w.adds||0);
  cbtState._rangedHitTotal = (cbtState._rangedHitTotal||0) + hit;
  cl.innerHTML += `<span style="color:#d8d0c0"> ${npc.name}の遠距離攻撃が外れた。</span><br>`;
 }
 updateCombatUI();
 onDone();
}

function _pcRangedSelectTarget(onDone){
 const alive = cbtState.enemies.filter(e=>(cbtState.isNPC?e.curCon:e.curMR)>0);
 if(alive.length === 1){ _pcRangedAttack(alive[0], onDone); return; }

 const panel = document.getElementById('npc-action-panel');
 const title = document.getElementById('npc-action-title');
 const btns = document.getElementById('npc-action-btns');
 panel.style.display = '';
 title.innerHTML = `<span style="color:#e0d8c8;font-size:var(--font-sm)"> 対象を選択</span>`;
 btns.innerHTML = '';
 alive.forEach(e=>{
  const b = document.createElement('button');
  b.className = 'choice-btn';
  b.style.cssText = 'border-color:#d8d0c0;color:#e0d8c8';
  b.textContent = cbtState.isNPC ? `${e.name}（体力 ${e.curCon}）` : `${e.name}（CombatRating ${e.curMR}）`;
  b.onclick = ()=>{ _pcRangedAttack(e, onDone); };
  btns.appendChild(b);
 });
}

function _pcRangedAttack(target, onDone){
 document.getElementById('npc-action-panel').style.display = 'none';
 const w = PC.equippedRanged;
 const cl = document.getElementById('clog');

 // 戦闘中はSRダイスUIのためtext-winを一時的に表示
 document.getElementById('text-win').style.display = '';

 setupSavingRoll({
  attr:'dex', level:2,
  passTxt:`${w.name}が命中！`,
  failTxt:`${w.name}が外れた…`,
  onSuccess(){
   document.getElementById('text-win').style.display = 'none';
   document.getElementById('dice-area').classList.add('hidden');
   // 弓の場合は矢を1本消費、短剣の場合は投擲済みフラグ
   if(w.isRanged && !w.rangedOk){ PC.arrows = Math.max(0,(PC.arrows||0)-1); updateHUD(); }
   else if(w.rangedOk){ cbtState._pcDaggerUsed = true; }
   cbtState._pcDidRanged = true;
   const armor = cbtState.isNPC ? calcNPCArmor(target) : (target.armor||0);
   const diceRoll = Nd6(w.dice);
   const stAdd  = PC.st  > 12 ? PC.st  - 12 : (PC.st  < 9 ? PC.st  - 9 : 0);
   const lkAdd  = PC.lk  > 12 ? PC.lk  - 12 : (PC.lk  < 9 ? PC.lk  - 9 : 0);
   const dexAdd = PC.dex > 12 ? PC.dex - 12 : (PC.dex < 9 ? PC.dex - 9 : 0);
   const rangedAdds = stAdd + lkAdd + dexAdd * 2;
   const hit = diceRoll + (w.adds||0) + rangedAdds;
   const dmg = Math.max(0, hit - armor);
   const applyRangedHit = ()=>{
    if(cbtState.isNPC){ target.curCon=Math.max(0,target.curCon-dmg); } else { target.curMR=Math.max(0,target.curMR-dmg); }
    cbtState._rangedHitTotal = (cbtState._rangedHitTotal||0) + hit;
    cl.innerHTML += `<span style="color:#e0d8c8"> 命中！${w.dice}D=${diceRoll} adds=${rangedAdds}（DEX×2） hit=${hit} → ${target.name} ${cbtState.isNPC?'体力':'CombatRating'}-${dmg}${armor>0?`（防護-${armor}）`:''}</span><br>`;
    updateCombatUI();
    if(onDone) onDone(); else _showPCActionChoices();
   };
   if(cbtState.isNPC){
    // 対象（敵）に回避のチャンスを与える。回避を試みたキャラクターは今ラウンドの近接攻撃に参加できない
    target._dodgedRangedThisRound = true;
    target._rangedDodgeCount = (target._rangedDodgeCount||0) + 1;
    const dodgeLevel = (PC.level||1) + (target._rangedDodgeCount - 1);
    if(target._rangedDodgeCount > 1){
     cl.innerHTML += `<span style="color:#c8b8a0;font-size:calc(var(--font-sm) - 1px)"> （${target.name}はこのラウンド${target._rangedDodgeCount}回目の回避のため、判定レベルが+${target._rangedDodgeCount-1}される）</span><br>`;
    }
    _npcCombatTtyfDodge(dodgeLevel, target, (dodged)=>{
     if(dodged){
      cl.innerHTML += `<span style="color:#e8e0d8"> ${target.name}は咄嗟に身をかわし、${w.name}を回避した！</span><br>`;
      updateCombatUI();
      if(onDone) onDone(); else _showPCActionChoices();
      return;
     }
     applyRangedHit();
    });
   } else {
    applyRangedHit();
   }
  },
  onFail(){
   document.getElementById('text-win').style.display = 'none';
   document.getElementById('dice-area').classList.add('hidden');
   // 弓の場合は外れても矢を1本消費、短剣の場合は投擲済みフラグ
   if(w.isRanged && !w.rangedOk){ PC.arrows = Math.max(0,(PC.arrows||0)-1); updateHUD(); }
   else if(w.rangedOk){ cbtState._pcDaggerUsed = true; }
   cbtState._pcDidRanged = true;
   const hit = w.dice + (w.adds||0);
   cbtState._rangedHitTotal = (cbtState._rangedHitTotal||0) + hit;
   cl.innerHTML += `<span style="color:#d8d0c0"> 外れた。</span><br>`;
   updateCombatUI();
   if(onDone) onDone(); else _showPCActionChoices();
  },
 });
}

// ══════════════════════════════════════════
// NPC能力値型戦闘
// ══════════════════════════════════════════

// AP取得（NPC型戦闘用：敵のST+LK+DEX合計÷人数）
function gainAPCombatNPC(enemies){
 const base = enemies.reduce((s,e)=>s+((e.st||10)+(e.lk||10)+(e.dex||10)),0);
 const members = 1 + (PC.party||[]).filter(n=>n.con>0).length;
 const share = Math.max(1, Math.floor(base / members));
 gainAP(share);
 (PC.party||[]).forEach(n=>{ if(n.con>0) gainAPFor(n, share); });
 if(members > 1) changeNPCTrust(+1);
 return share;
}

function startCombatNPC(en){
 // 前回の戦闘のShapeshiftをリセット
 [PC, ...(PC.party||[])].forEach(a=>{ a._shapeshifted = false; });
 _restoreShapeshiftIfNeeded(); // PC自身が変身したままなら元に戻す
 // 前回の戦闘の召喚された悪魔が残っていれば取り除く
 PC.party = (PC.party||[]).filter(n=>!n._isSummonedDemon);
 // enemies: [{name, race, type, st, iq, lk, con, maxCon, dex, chr, spd,
 //            equippedWeapons:[{name,dice,adds}], equippedArmors:[{name,hits,isShield}]}]
 const enemies = (en.enemies||[]).map(e=>({
  ...e,
  maxCon: e.maxCon || e.con,
  curCon: e.curCon || e.con,
  equippedWeapons: e.equippedWeapons||[],
  equippedArmors:  e.equippedArmors||[],
 }));

 cbtState = {
  enemies,
  isNPC: true, // NPC型フラグ
  // AP計算用（totalMRの代わり）
  get totalMR(){ return this.enemies.reduce((s,e)=>s+((e.st||10)+(e.lk||10)+(e.dex||10)),0); },
  win:    en.win    || null,
  lose:   en.lose   || 'DEAD',
  fleeTo: en.fleeTo || null, // 逃走成功時にwinより優先して戻るノード（未指定ならwin/現在地を使用）
  onWin:  en.onWin  || null,
  onLose: en.onLose || null,
  isHunt: false,
  isYD:   en.isYD   || false,
  chaosMode: en.chaosMode || false,  // カオスSR必須フラグ
  skipLuckSave: en.skipLuckSave || false, // trueなら体力0時に九死に一生を挟まず直接lose先へ（例：衛兵に敗北→投獄）
 arenaMode: en.arenaMode || false, // trueならPC体力0でも生存パーティがいれば戦闘継続（PCは行動不可）
  // trueなら勝利時にNPC型の合計戦力（st+lk+dex）を基準に標準の宝物生成表で宝を自動生成する
  // （MR型は既存のstartCombat勝利処理で自動生成されるため、NPC型のみ個別にオプトインする）
  autoTreasure: en.autoTreasure || false,
  turn:   0,
  vorpalActive:      false,
  whammyActive:      false,
  littleFeetsRounds: 0,
  sleeping:          0,
  canFlee: en.canFlee !== false,
  // 後方互換ゲッター（MR型コードが参照する箇所用）
  get name(){ return this.enemies.map(e=>e.name).join(' / '); },
  get curMR(){ return this.enemies.reduce((s,e)=>s+(e.curCon>0?e.curCon:0),0); },
  get mr(){   return this.enemies.reduce((s,e)=>s+(e.maxCon||e.con),0); },
  get armor(){ return calcNPCArmor(this.enemies[0]||{}); },
 };

 document.getElementById('text-win').style.display = 'none';
 document.getElementById('cbt-area').classList.remove('hidden'); document.getElementById('scroll-area').classList.add('in-combat');
 // 戦闘開始元のノードに残っていた選択肢を消す（例：闘技場のランク選択ボタン等）
 const _choicesEl = document.getElementById('choices');
 if(_choicesEl) _choicesEl.innerHTML = '';
 // OKエリアを必ずクリア
 const _okArea = document.getElementById('cbt-ok-area');
 if(_okArea){ _okArea.innerHTML=''; _okArea.style.display='none'; }
 updateCombatUINPC();
 document.getElementById('clog').innerHTML =
  `<span style="color:#ccccaa"> ${cbtState.name}との戦闘！</span><br>`;
 if((PC.type==='wizard'||PC.type==='rogue')&&PC.spells.length) showMagicInCombat();
 _startNewRound();
 scrollToTop();
}

// NPC型戦闘UI更新
function updateCombatUINPC(){
 const cs = cbtState;
 document.getElementById('p-lbl').textContent = `YOU: 体力 ${Math.max(0,PC.con)}/${PC.maxCon}`;
 document.getElementById('p-bar').style.width = Math.max(0,PC.con/PC.maxCon*100)+'%';

 const party = (PC.party||[]).filter(n=>n.con>0);
 const partyHtml = party.map(n=>{
  const pct = Math.max(0,n.con/n.maxCon*100);
  const col = 'linear-gradient(90deg,var(--white2),var(--white))';
  return `<div style="margin-top:3px">
  <div class="hp-lbl" style="color:#e0d8c8;font-size:calc(var(--font-sm) - 2px)"> ${n.name}: 体力 ${n.con}/${n.maxCon}</div>
  <div class="hp-bar-wrap"><div class="hp-bar-fill" style="width:${pct}%;background:${col}"></div></div>
  </div>`;
 }).join('');
 const partyEl = document.getElementById('party-combat-ui');
 if(partyEl) partyEl.innerHTML = partyHtml;

 const eui = document.getElementById('enemies-ui');
 eui.innerHTML = cs.enemies.map(e=>{
  const pct = e.maxCon>0 ? Math.max(0, e.curCon/e.maxCon*100) : 0;
  const dead = e.curCon <= 0;
  const col  = dead ? '#a0a0a0' : 'var(--white)';
  // 1ターン目以降にCON表示
  const hpLabel = cs.turn>=1 ? `体力 ${Math.max(0,e.curCon)}/${e.maxCon}` : `体力 ?`;
  const typeJa  = {warrior:'戦士',rogue:'盗賊',wizard:'魔法使い'}[e.type]||'';
  const raceJa  = e.race ? ({human:'人間',elf:'エルフ',dwarf:'ドワーフ',halfling:'ハーフリング',fairy:'フェアリー',leprechaun:'レプラコーン',troll:'トロール',ogre:'オーガ',orc:'オーク',goblin:'ゴブリン'}[e.race]||e.race) : '';
  const subLabel = [raceJa, typeJa].filter(Boolean).join('・');
  const w = e.equippedWeapons?.[0];
  const wLabel = w ? w.name : '素手';
  return `<div style="margin-top:4px">
  <div class="hp-lbl" style="color:${dead?'#555':'var(--white)'}">${dead?'':''} ${e.name}${subLabel?' ('+subLabel+')':''}: ${hpLabel}</div>
  <div style="font-size:calc(var(--font-sm) - 3px);color:#c8b8a0;margin-bottom:2px">武器:${wLabel}　防護:${calcNPCArmor(e)}</div>
  <div class="hp-bar-wrap"><div class="hp-bar-fill enemy" style="width:${pct}%;background:${col}"></div></div>
  </div>`;
 }).join('');
}

// NPC型 FIGHT
function doFightNPC(){
 const cs=cbtState; cs.turn++;
 cs._pcDefending=false;

 // カオスモード：攻撃前にDEX/LK/IQランダムSR
 if(cs.chaosMode && !cs._spellCaster){
  const attrs = ['dex','lk','iq'];
  const attr = attrs[Math.floor(Math.random()*attrs.length)];
  const attrNames = {dex:'器用さ',lk:'運',iq:'知力'};
  const cl = document.getElementById('clog');
  cl.innerHTML += `<span style="color:#d8d0c0"> 時間の歪みを読む（${attrNames[attr]} 能力値テスト）——</span><br>`;
  _hidePCActionChoices();
  document.getElementById('dice-area').classList.remove('hidden');
  document.getElementById('text-win').style.display='';
  setupSavingRoll({
   attr, level:2, label:'カオス攻撃判定', noAP:true,
   onSuccess(){
    document.getElementById('dice-area').classList.add('hidden');
    document.getElementById('text-win').style.display='none';
    cl.innerHTML += `<span style="color:#f0ece0"> 歪みを見切った！攻撃が届く——</span><br>`;
    _pendingCombatResume = ()=>_doFightNPCCore(cs);
    _doFightNPCCore(cs);
   },
   onFail(){
    document.getElementById('dice-area').classList.add('hidden');
    document.getElementById('text-win').style.display='none';
    cl.innerHTML += `<span style="color:#e0d8c8"> 歪みに惑わされ、攻撃が空を切った。</span><br>`;
    cs._pDiceThisTurn=[]; cs._pRollThisTurn=0;
    const aliveParty=(PC.party||[]).filter(n=>n.con>0);
    if(aliveParty.length>0){
     _pendingCombatResume = ()=>{ _cbtNPCActions=[]; showNPCActionPhase(0,aliveParty); };
     _cbtNPCActions=[]; showNPCActionPhase(0,aliveParty);
    } else {
     _pendingCombatResume = null;
     resolveRoundNPC(0,[]);
    }
   },
  });
  return;
 }

 _doFightNPCCore(cs);
}

function _doFightNPCCore(cs){
 const adds=calcAdds();
 const cl=document.getElementById('clog');
 if(cs._spellCaster){
  const aliveParty=(PC.party||[]).filter(n=>n.con>0);
  if(aliveParty.length>0){
   _cbtNPCActions=[];
   showNPCActionPhase(0,aliveParty);
  } else resolveRoundNPC(0,[]);
  return;
 }
 const equipped=PC.equippedWeapons||[];
 let pRoll,pDice;
 if(PC._shapeshifted){
  // Shapeshift中は武器・能力値によるロールを一切行わず、CRのダイス数+戦闘修正で近接判定を行う
  const rv = monsterCombatRoll(PC._shapeshiftCR||0); pRoll = rv.total; pDice = rv.dice;
 } else if(!equipped.length){ const rv=rollNd6(1); pRoll=rv.total+adds; pDice=rv.dice; }
 else {
  // 全装備武器のダイスを合計（二刀流対応。addsは武器ごとに合算）
  let totalDice = 0; let totalWeaponAdds = 0;
  equipped.forEach((w,wi)=>{
   let dice = w.dice;
   if(wi===0 && cs.vorpalActive && !cs._pcDidCast){ dice*=2; }
   if(wi===0 && cs.whammyActive && !cs._pcDidCast){ dice*=3; }
   if((PC._enchantWeaponTurns||0) > 0){ dice*=3; }
   totalDice += dice;
   totalWeaponAdds += (w.adds||0);
  });
  if(cs.vorpalActive && !cs._pcDidCast) cs.vorpalActive=false;
  if(cs.whammyActive && !cs._pcDidCast) cs.whammyActive=false;
  const rv=rollNd6(totalDice); pRoll=rv.total+totalWeaponAdds+adds; pDice=rv.dice;
 }
 cs._pDiceThisTurn=pDice; cs._pRollThisTurn=pRoll;
 const aliveParty=(PC.party||[]).filter(n=>n.con>0);
 if(aliveParty.length>0){
  _cbtNPCActions=[];
  showNPCActionPhase(0,aliveParty);
 } else resolveRoundNPC(pRoll,[]);
}

// NPC型 DEFEND
function doDefendNPC(){
 const cs=cbtState; cs.turn++;
 cs._pcDefending=true; cs._pRollThisTurn=0;
 const cl=document.getElementById('clog');
 cl.innerHTML+=`<span style="color:#e0d8c8"> 様子を見ている…</span><br>`;
 const aliveParty=(PC.party||[]).filter(n=>n.con>0);
 if(aliveParty.length>0){
  _cbtNPCActions=[];
  showNPCActionPhase(0,aliveParty);
 } else resolveRoundNPC(0,[]);
}

// NPC型戦闘ラウンド解決
function resolveRoundNPC(pRoll, npcActions){
 const cs = cbtState;
 const cl = document.getElementById('clog');
 const pcDefending = !!cs._pcDefending;
 cs._pcDefending = false;

 const spellCaster   = !!cs._spellCaster;
 const spellHitBonus = cs._spellHitBonus || 0;
 const ttyfHit       = cs._ttyfHit || 0;
 cs._spellCaster = false; cs._spellHitBonus = 0;
 cs._ttyfHit = 0; cs._ttyfTarget = null; cs._ttyfPRoll = 0;

 // ── パーティロール ──
 let partyRoll = 0;
 const partyRolls = npcActions.map(({npc, action, spell, bonus})=>{
  let r = 0; let npcDice = [];
  if(action==='attack'){ const rv=calcNPCRoll(npc); r=rv.total; npcDice=rv.dice; }
  else if(action==='chaos_miss'){ r=0; } // カオス能力値テスト失敗による空振り
  else if(action==='spell' && bonus){
   if(bonus.type==='ttyf') r=bonus.value;
   else if(bonus.type==='vorpal'){ npc._vorpalNext=true; r=0; }
   else r=bonus.value;
  }
  partyRoll += r;
  return {npc, action, r, npcDice, spell, bonus};
 });

 const pcHit = spellCaster
  ? (ttyfHit>0?ttyfHit:0)+spellHitBonus
  : pRoll + spellHitBonus;
 // Summon/Shapeshiftは戦闘終了まで持続する加算（毎ラウンド反映）
 const summonBonus = (cs._summonCR||0) + (cs._shapeshiftCR||0);
 const totalPlayerRoll = pcHit + partyRoll + summonBonus;

 // ── 敵ロール（能力値型）──
 const aliveEnemies = cs.enemies.filter(e=>e.curCon>0);
 const eRolls = aliveEnemies.map(e=>{
  if(cs.sleeping>0) return {enemy:e, roll:0, dice:[], ttyf:0};
  // 魔法フェーズで詠唱済みなら、その結果（回避成功なら0）をそのまま使う。近接ロールはしない
  if(e._castTtyfThisRound){
   const ttyfVal = e._ttyfHitThisRound||0;
   e._castTtyfThisRound = false;
   e._ttyfHitThisRound = 0;
   return {enemy:e, roll:ttyfVal, dice:[], ttyf:ttyfVal};
  }
  // Detonate/Ice Bindで詠唱済みなら、そのダイス分を通常の近接ロールの代わりに使う（防護値を無視しない通常ヒットのため、ショック効果の控除対象にはしない＝ttyf:0）
  if(e._castDetonateThisRound){
   const bonusVal = e._detonateHitThisRound||0;
   e._castDetonateThisRound = false;
   e._detonateHitThisRound = 0;
   return {enemy:e, roll:bonusVal, dice:[], ttyf:0};
  }
  // 遠距離攻撃の回避を試みた敵は、今ラウンドの近接ロールに参加しない
  if(e._dodgedRangedThisRound){
   e._dodgedRangedThisRound = false;
   return {enemy:e, roll:0, dice:[], ttyf:0};
  }
  const rv = calcNPCRoll(e);
  return {enemy:e, roll:rv.total, dice:rv.dice, ttyf:0};
 });
 if(cs.sleeping>0) cs.sleeping--;
 const eTotalRoll = eRolls.reduce((s,r)=>s+r.roll, 0);

 // ── ログ ──
 const pDice = cs._pDiceThisTurn||[]; cs._pDiceThisTurn=[];
 const detailId = `cbt-detail-${cs.turn}-${Date.now()}`;
 let detail = '';
 if(spellCaster && ttyfHit>0){
  detail += `You <span style="color:#e8e0d0">TTYF=${ttyfHit}</span>`;
 } else if(spellCaster){
  detail += `You <span style="color:#e8e0d0">魔法+${spellHitBonus}</span>`;
 } else if(pcDefending){
  detail += `You <span style="color:#e0d8c8">様子を見る</span>`;
 } else {
  detail += `You <span style="color:#c8b8a0;font-size:calc(var(--font-sm) - 2px)">${diceStr(pDice)}</span>=<span style="color:#f0ece0">${pRoll}</span>`;
  if(spellHitBonus) detail += `+<span style="color:#e8e0d0">魔法+${spellHitBonus}</span>`;
 }
 partyRolls.forEach(({npc,action,r,npcDice,spell})=>{
  if(action==='attack') detail += `+${npc.name}<span style="color:#c8b8a0;font-size:calc(var(--font-sm) - 2px)">${diceStr(npcDice)}</span>=<span style="color:#e0d8c8">${r}</span>`;
  else if(action==='defend') detail += `+${npc.name}<span style="color:#e0d8c8"></span>`;
  else if(action==='chaos_miss') detail += `+${npc.name}<span style="color:#e0d8c8"> 空振り</span>`;
  else if(action==='spell') detail += `+${npc.name}<span style="color:#e0d8c8">${spell?.name}=${r}</span>`;
  else detail += `+${npc.name}<span style="color:#ffcc00"></span>`;
 });
 if(partyRolls.length) detail += `→<span style="color:#f0ece0">${totalPlayerRoll}</span>`;
 detail += ' vs ';
 if(aliveEnemies.length>1){
  detail += eRolls.map(r=>`${r.enemy.name}<span style="color:#c8b8a0;font-size:calc(var(--font-sm) - 2px)">${diceStr(r.dice)}</span>${r.ttyf>0?`+<span style="color:#e8e0d0">TTYF+${r.ttyf}</span>`:''}=<span class="ora">${r.roll}</span>`).join('+');
  detail += `→<span class="ora">${eTotalRoll}</span>`;
 } else {
  const _er0 = eRolls[0];
  detail += `${aliveEnemies[0]?.name} <span style="color:#c8b8a0;font-size:calc(var(--font-sm) - 2px)">${diceStr(_er0?.dice||[])}</span>${_er0?.ttyf>0?`+<span style="color:#e8e0d0">TTYF+${_er0.ttyf}</span>`:''} =<span class="ora">${eTotalRoll}</span>`;
 }

 // 敵の魔法フェーズでのTTYFは既にそちらで直接ダメージ適用・死亡判定済み。ここではショック効果の計算にのみ使う
 const ttyfRolls = eRolls.filter(r=>r.ttyf>0);
 const enemyTtyfTotal = ttyfRolls.reduce((s,r)=>s+r.ttyf, 0);
 // 判定にはTTYF込みの合計をそのまま使う（ショック効果はダメージ分配時にのみ反映する）
 const eTotalRollFinal = eTotalRoll;

 let log = `<span style="color:var(--white)">T${cs.turn}</span> `
  +`<span onclick="var d=document.getElementById('${detailId}');if(d){d.style.display=d.style.display==='none'?'':'none';}" `
  +`style="cursor:pointer;font-size:var(--font-sm);color:#d0c8b8;border:1px solid #c0b098;border-radius:2px;padding:1px 4px;margin-right:4px">詳細</span>`;

 if(totalPlayerRoll > eTotalRollFinal){
  const rawDmgBeforeTtyf = totalPlayerRoll - eTotalRollFinal;
  // 既に即時ダメージとして与えたTTYF分を差し引く（TTYFのショック効果）
  const rawDmg = Math.max(0, rawDmgBeforeTtyf - ttyfHit);
  const eNames = aliveEnemies.map(e=>e.name);
  log += _combatNarrative(rawDmg, totalPlayerRoll+eTotalRollFinal, true, eNames)+'<br>';
  detail += `<br><span style="color:#e8e4d8">→ 敵 -${rawDmg} ダメージ${ttyfHit>0?`（TTYF${ttyfHit}分は控除済み）`:''}</span><br>`;
  const perEnemy  = Math.floor(rawDmg/aliveEnemies.length);
  const remainder = rawDmg%aliveEnemies.length;
  aliveEnemies.forEach((e,idx)=>{
   const dmgRaw = perEnemy+(idx===0?remainder:0);
   const actualDmg = Math.max(0, dmgRaw - calcNPCArmor(e));
   e.curCon = Math.max(0, e.curCon - actualDmg);
   detail += `　<span style="color:#c0b098">→ ${e.name}: -${actualDmg} [残体力${e.curCon}]</span>${e.curCon<=0?' <span style="color:#e8e4d8"></span>':''}<br>`;
  });

 } else if(eTotalRollFinal > totalPlayerRoll){
  const totalDmgBeforeTtyf = eTotalRollFinal - totalPlayerRoll;
  // 敵側の即時ダメージ（TTYF）分を差し引く（TTYFのショック効果）
  const totalDmg = Math.max(0, totalDmgBeforeTtyf - enemyTtyfTotal);
  const eNames = aliveEnemies.map(e=>e.name);
  log += _combatNarrative(totalDmg, totalPlayerRoll+eTotalRollFinal, false, eNames)+'<br>';
  const targets = [
   {t:PC, armor:effectiveArmor()*(pcDefending?2:1), label:'You'},
   ...npcActions
    .filter(({action})=>action!=='flee')
    .map(({npc,action})=>({t:npc, armor:calcNPCArmor(npc)*(action==='defend'?2:1), label:npc.name})),
  ];
  if(totalDmg > 0){
   const perTarget  = Math.floor(totalDmg/targets.length);
   const remainder2 = totalDmg%targets.length;
   detail += `<br><span class="red">→ 味方 -${totalDmg} ダメージ（${targets.length}人で分担）${enemyTtyfTotal>0?`（TTYF${enemyTtyfTotal}分は控除済み）`:''}</span><br>`;
   targets.forEach(({t,armor,label},idx)=>{
    const dmg = Math.max(1, (perTarget+(idx===0?remainder2:0)) - armor);
    t.con = Math.max(0, t.con - dmg);
    detail += `　<span style="color:#c0b098">→ ${label}: -${dmg} [残CON${t.con}]</span><br>`;
   });
  } else if(enemyTtyfTotal>0){
   detail += `<br><span style="color:#c0b098">→ TTYFの即時ダメージのみで、追加のダメージ分配はなかった</span><br>`;
  }
  updateHUD();
 } else {
  log += `<span style="color:#c0b098">${ttyfHit>0||enemyTtyfTotal>0?'（TTYFの即時ダメージのみ）':'引き分け…'}</span><br>`;
  updateHUD();
 }

 // detailブロック挿入
 log += `<div id="${detailId}" style="display:none;font-size:calc(var(--font-sm) - 3px);color:#e8e0d0;margin:2px 0 4px 8px;line-height:1.8">${detail}</div>`;
 cl.innerHTML += log;
 cl.scrollTop = 9999;

 // ボタン無効化

 // 死亡チェック
 if(PC.con<=0){
  if(_handlePCZeroCon(cl)) return;
 }

 updateCombatUINPC();

 // 全滅チェック
 const allDead = cs.enemies.every(e=>e.curCon<=0);
 if(allDead){
  const share = gainAPCombatNPC(cs.enemies); updateHUD();
  const memberCount = 1+(PC.party||[]).filter(n=>n.con>0).length;
  let victoryMsg = `<span style="color:#ccccaa"> 全敵を倒した！ 経験値+${share}</span>`;
  if(cs.autoTreasure){
   // NPC型は通常の戦闘勝利処理でtotalMRが定義されないため、AP計算と同じ合計戦力（st+lk+dex）を基準に生成する
   const treasureDesc = generateTreasure(cs.totalMR);
   if(treasureDesc) victoryMsg += `<br><span style="color:#ccccaa">${treasureDesc}</span>`;
   updateHUD();
  }
  cl.innerHTML += victoryMsg+'<br>';
  _hidePCActionChoices();
  document.getElementById('npc-action-panel').style.display = 'none';
  showCombatOK(()=>{
   if(cs.win==='__noop__'){
    document.getElementById('cbt-area').classList.add('hidden'); document.getElementById('scroll-area').classList.remove('in-combat');
    document.getElementById('text-win').style.display='';
    cbtState=null;
    if(cs.onWin) cs.onWin();
   } else {
    if(cs.onWin) cs.onWin();
    go(cs.win||currentNodeId);
   }
  });
  return;
 }

 // 次ターンへ
 _hidePCActionChoices();
 document.getElementById('npc-action-panel').style.display = 'none';
 showCombatOK(()=>{ _startNewRound(); });
}

// 逃走：SPD Lv1 能力値テスト
function doFlee(){
 if(!cbtState || !cbtState.canFlee) return;
 const cl = document.getElementById('clog');
 cl.innerHTML += `<span style="color:#f0ece0"> 逃走を試みる…（素早さ Lv1 能力値テスト）</span><br>`;

 // cbt-areaを隠してtext-winを復元 → dice-areaが見えるようになる
 document.getElementById('cbt-area').classList.add('hidden'); document.getElementById('scroll-area').classList.remove('in-combat');
 document.getElementById('text-win').style.display = '';
 // 戦闘ログをスクロールした状態でも能力値テストのUIが見えるよう先頭へ戻す
 scrollToTop();

 setupSavingRoll({
 attr: 'spd', level: 1,
 onSuccess: ()=>{
 // SR完了後はcbt-areaを再表示してtext-winを戻す
 document.getElementById('text-win').style.display = 'none';
 document.getElementById('cbt-area').classList.remove('hidden'); document.getElementById('scroll-area').classList.add('in-combat');
 cl.innerHTML += `<span style="color:#e8e4d8"> 逃走成功！</span><br>`;
 showCombatOK(()=>{
 document.getElementById('cbt-area').classList.add('hidden'); document.getElementById('scroll-area').classList.remove('in-combat');
 document.getElementById('text-win').style.display = '';
 const savedState = cbtState;
 cbtState = null;
 if(travelState){
 const ts = travelState;
 drawScene('travel');
 renderChoices([]);
 if(ts.method === 'coach'){
 const remainRatio = (ts.totalDays - ts.daysDone) / ts.totalDays;
 const walkTotal = Math.ceil(ts.totalDays * (12/5) * remainRatio);
 ts.totalDays = ts.daysDone + walkTotal;
 ts.method = 'walk';
 PC.chr = Math.max(1, PC.chr - 1);
 updateHUD();
 travelLog(`<span style="color:#f0ece0"> ${ts.daysDone}日目：馬車を捨てて逃げ出した！</span><br><span style="color:#c0b098">ここからは徒歩になる… 残り約${walkTotal}日</span><br><span class="red"> 乗客たちに臆病な姿を見られた… CHR-1</span>`);
 } else {
 travelLog(`<span style="color:#f0ece0"> ${ts.daysDone}日目：間一髪で逃げ切った！</span>`);
 }
 ts._resumeWithoutIncrement = true;
 setTimeout(_travelTickSched(), ts.interval);
 } else {
 // YDダンジョン逃走 → 最優先でチェック
 if(savedState.isYD){
 const ydStory = document.getElementById('story');
 ydStory.innerHTML += `<div style="color:#f0ece0;font-size:var(--font-sm);margin-top:8px"> 命からがら入口まで逃げ帰った。</div>`;
 const dung = PC._yeldunDungeon;
 if(dung?.isHuntDungeon){
  const q = (PC.quests||[]).find(q=>q.id===dung.huntQuestId && q.status==='active');
  const backNode = q ? (Object.entries({
   khazan:'TOWN_KHAZAN',port_argon:'TOWN_PORT_ARGON',stonehiem:'TOWN_STONEHIEM',
   elsia:'TOWN_ELSIA',verda:'TOWN_VERDA',rimholm:'TOWN_RIMHOLM',marakai:'TOWN_MARAKAI',
   al_rashid:'TOWN_AL_RASHID',oasis_fort:'TOWN_OASIS_FORT',saroon:'TOWN_SAROON',
   duna:'TOWN_DUNA',yeldun:'TOWN_YELDUN',frostpeak:'TOWN_FROSTPEAK',ashveil:'TOWN_ASHVEIL',
   valdheim:'TOWN_VALDHEIM',nifurvik:'TOWN_NIFURVIK',iskald:'TOWN_ISKALD',
  }).find(([k])=>k===q.fromTownId)?.[1]||'TOWN_KHAZAN') : 'TOWN_KHAZAN';
  PC._yeldunDungeon = null;
  renderChoices([{label:'← 町に戻る', go: backNode}]);
 } else {
  const entryId = dung?.floors?.[dung.currentFloor]?.entryNodeId || (dung ? ('YD_F' + dung.currentFloor + '_entrance') : null);
  const fallbackTown = dung?.heroQuestBackNode || 'TOWN_KHAZAN';
  if(entryId) renderChoices([
   {label:' 入口へ戻る', fn:()=>{
    try{ ydGoNode(entryId, dung.currentFloor); }
    catch(e){ console.warn('YD entry return failed, falling back to town', e); PC._yeldunDungeon=null; hideDungeonImage(); go(fallbackTown); }
   }},
   {label:' （反応しない場合）諦めて地上へ戻る', fn:()=>{ PC._yeldunDungeon=null; hideDungeonImage(); go(fallbackTown); }},
  ]);
  else renderChoices([{label:' ダンジョンを出る', fn:()=>{ PC._yeldunDungeon=null; hideDungeonImage(); go(fallbackTown); }}]);
 }
 // ダンジョン内逃走 → 直前にいたノードに戻る・松明1本消費
 } else {
 const dungeonPrefixes = ['RUIN_','CRYPT_','CRYPT2_','CRYPT3_','SHR2_','SHM2_','SHM3_','AL_DNG_','AL_W_','AL_ROOM','AL_PASSAGE','ISKALD_','FP_'];
 const isDungeon = dungeonPrefixes.some(p => currentNodeId.startsWith(p)) ||
  (savedState.win && savedState.win.startsWith('RUIN_'));
 if(isDungeon){
 // 点灯中の松明を1本消耗（残りターンをリセット）
 // 予備があれば次の1本を点火、なければ暗闇
 if(PC._torchTurns > 0){
 // 点灯中の松明を1本消費
 PC._torchTurns = 0;
 PC._torchStock--;
 if(PC._torchStock > 0){
 PC._torchTurns = 10;
 PC._pendingMsg = `<div style="color:#f0ece0;font-size:var(--font-sm);margin-bottom:6px"> 逃げる際に松明を1本消耗した。新しい松明に火をつけた。（残り${PC._torchStock}本）</div>`;
 } else {
 PC._pendingMsg = `<div style="color:#f0ddd8;font-size:var(--font-sm);margin-bottom:6px"> 逃げる際に松明を1本消耗した。もう松明がない…</div>`;
 }
 }
 // 固定ダンジョンの戦闘はエンカウント発生時点でgo(dest)を呼ばずに戦闘へ入るため、
 // currentNodeIdは移動を試みる直前の（＝今いる）ノードのまま変化していない。
 // よってそこへ戻せば「直前にいたノードに戻る」ことになる
 go(currentNodeId);
 } else if(savedState.isNPC && savedState.win==='__noop__'){
 // NPC型戦闘（旅中）からの逃走成功 → 旅を再開
 if(travelState){
  const ts2 = travelState;
  drawScene('travel');
  renderChoices([]);
  travelLog(`<span style="color:#f0ece0"> ${ts2.daysDone}日目：間一髪で逃げ切った！</span>`);
  ts2._resumeWithoutIncrement = true;
  setTimeout(_travelTickSched(), ts2.interval);
 } else {
  go(currentNodeId);
 }
 } else if(savedState.isHunt){
 // 討伐クエスト中の逃走成功 → 中断して町に戻る
 _huntState = null;
 const huntStory = document.getElementById('story');
 huntStory.innerHTML += `<div style="color:#f0ece0;font-size:var(--font-sm);margin-top:8px"> 洞穴から逃げ出した。討伐依頼は受託したままだ。</div>`;
 renderChoices([{label:'← 町に戻る', go: currentNodeId}]);
 } else {
 // 汎用フォールバック：逃走成功なのでlose（敗北先）ではなく、fleeTo（1つ前のノード指定があればそちら）／win先／現在地の順で戻す
 go(savedState.fleeTo || savedState.win || currentNodeId);
 }
 } // end else（非YD）
 }
 });
 },
 onFail: ()=>{
 // SR完了後はcbt-areaを再表示してtext-winを戻す
 document.getElementById('text-win').style.display = 'none';
 document.getElementById('cbt-area').classList.remove('hidden'); document.getElementById('scroll-area').classList.add('in-combat');
 // 失敗：全生存敵のロール合計でダメージ
 const isNPCCombat = cbtState?.isNPC;
 const aliveEnemies = isNPCCombat
  ? cbtState.enemies.filter(e=>e.curCon>0)
  : cbtState.enemies.filter(e=>e.curMR>0);
 const eRolls = aliveEnemies.map(e=>{
  const rv = isNPCCombat ? calcNPCRoll(e) : monsterCombatRoll(e.curMR);
  return {name:e.name, total:rv.total, dice:rv.dice};
 });
 const eTotal = eRolls.reduce((s,r)=>s+r.total, 0);
 const myArmor = effectiveArmor();
 const dmg = Math.max(1, eTotal - myArmor);
 PC.con -= dmg;
 const rollDetail = eRolls.map(r=>`${r.name} <span style="color:#c8b8a0;font-size:calc(var(--font-sm) - 2px)">${diceStr(r.dice)}</span>=<span style="color:#f0ece0">${r.total}</span>`).join('、');
 cl.innerHTML += `<span class="red"> 逃走失敗！ 背中に攻撃を受けた！</span><br>
  <span style="color:#c8b8a0;font-size:calc(var(--font-sm) - 1px)">${rollDetail}　合計${eTotal} − 防護${myArmor} = <span class="red">体力-${dmg}</span></span><br>`;
 // HPバーのみ更新（行動選択パネルは死亡判定後まで再構築しない）
 _updateCombatBars(); updateHUD();
 if(PC.con <= 0){
 cl.innerHTML += `<span class="red"> 体力0！死亡！</span><br>`;
 _hidePCActionChoices();
 document.getElementById('npc-action-panel').style.display = 'none';
 const _enemyNameForSave = (cbtState?.enemies||[]).map(e=>e.name).join('・') || '敵';
 if(!cbtState?.skipLuckSave && offerLuckSave(_enemyNameForSave)) return;
 showCombatOK(()=>{
  const _onLose = cbtState ? cbtState.onLose : null;
  const _lose   = cbtState ? (cbtState.lose||'DEAD') : 'DEAD';
  cbtState = null;
  if(_onLose){ _onLose(); } else { go(_lose); }
 });
 } else {
 updateCombatUI();
 showCombatOK(()=>{
 });
 }
 },
 });
}

// HP/MRバーのみ更新（行動選択肢は再描画しない）
function _updateCombatBars(){
 if(cbtState?.isNPC){ updateCombatUINPC(); return; }
 const cs = cbtState;
 if(!cs) return;
 document.getElementById('p-lbl').textContent = `YOU: 体力 ${Math.max(0,PC.con)}/${PC.maxCon}`;
 document.getElementById('p-bar').style.width = Math.max(0,PC.con/PC.maxCon*100)+'%';
 const party = (PC.party||[]).filter(n=>n.con>0);
 const partyEl = document.getElementById('party-combat-ui');
 if(partyEl) partyEl.innerHTML = party.map(n=>{
  const pct = Math.max(0,n.con/n.maxCon*100);
  const col = 'linear-gradient(90deg,var(--white2),var(--white))';
  return `<div style="margin-top:3px">
  <div class="hp-lbl" style="color:#e0d8c8;font-size:calc(var(--font-sm) - 2px)"> ${n.name}: 体力 ${n.con}/${n.maxCon}</div>
  <div class="hp-bar-wrap"><div class="hp-bar-fill" style="width:${pct}%;background:${col}"></div></div>
  </div>`;
 }).join('');
 const eui = document.getElementById('enemies-ui');
 if(eui) eui.innerHTML = cs.enemies.map(e=>{
  const pct = e.mr > 0 ? Math.max(0, e.curMR/e.mr*100) : 0;
  const dead = e.curMR <= 0;
  const col = dead ? '#a0a0a0' : 'var(--white)';
  const mrLabel = cs.turn >= 1 ? `CombatRating ${Math.max(0,e.curMR)}` : `CombatRating ?`;
  return `<div style="margin-top:4px">
  <div class="hp-lbl" style="color:${dead?'#555':'var(--white)'}">${dead?'':''} ${e.name}: ${mrLabel}</div>
  <div class="hp-bar-wrap"><div class="hp-bar-fill enemy" style="width:${pct}%;background:${col}"></div></div>
  </div>`;
 }).join('');
}

function updateCombatUI(){
 if(cbtState?.isNPC){ updateCombatUINPC(); return; }
 const cs = cbtState;
 document.getElementById('p-lbl').textContent = `YOU: 体力 ${Math.max(0,PC.con)}/${PC.maxCon}`;
 document.getElementById('p-bar').style.width = Math.max(0,PC.con/PC.maxCon*100)+'%';

 // パーティNPCバー
 const party = (PC.party||[]).filter(n=>n.con>0);
 const partyHtml = party.map(n=>{
 const pct = Math.max(0,n.con/n.maxCon*100);
 const col = 'linear-gradient(90deg,var(--white2),var(--white))';
 return `<div style="margin-top:3px">
 <div class="hp-lbl" style="color:#e0d8c8;font-size:calc(var(--font-sm) - 2px)"> ${n.name}: 体力 ${n.con}/${n.maxCon}</div>
 <div class="hp-bar-wrap"><div class="hp-bar-fill" style="width:${pct}%;background:${col}"></div></div>
 </div>`;
 }).join('');
 const partyEl = document.getElementById('party-combat-ui');
 if(partyEl) partyEl.innerHTML = partyHtml;

 // 敵バーを動的生成
 const eui = document.getElementById('enemies-ui');
 eui.innerHTML = cs.enemies.map((e,i)=>{
 const pct = e.mr > 0 ? Math.max(0, e.curMR/e.mr*100) : 0;
 const dead = e.curMR <= 0;
 const col = dead ? '#a0a0a0' : 'var(--white)';
 const mrLabel = cs.turn >= 1 ? `CombatRating ${Math.max(0,e.curMR)}` : `CombatRating ?`;
 return `<div style="margin-top:4px">
 <div class="hp-lbl" style="color:${dead?'#555':'var(--white)'}">${dead?'':''} ${e.name}: ${mrLabel}</div>
 <div class="hp-bar-wrap"><div class="hp-bar-fill enemy" style="width:${pct}%;background:${col}"></div></div>
 </div>`;
 }).join('');

 // PC行動選択肢をパネルに描画
 _showPCActionChoices();
}

function _showPCActionChoices(){
 const panel = document.getElementById('npc-action-panel');
 const title = document.getElementById('npc-action-title');
 const btns  = document.getElementById('npc-action-btns');
 if(!panel) return;
 panel.style.display = '';

 // 闘技場モードでPCが倒れている場合は選択肢を出さず、自動的に「様子を見る」扱いにする
 // （このラウンドで既に自動処理済みなら、以後の再呼び出し（パーティ行動確定後の再表示等）では何もしない）
 if(cbtState?.arenaMode && PC.con<=0){
  if(cbtState._pcAutoDefended){
   panel.style.display = 'none';
   return;
  }
  if(cbtState._magicPhaseNext){
   cbtState._magicPhaseNext();
   return;
  }
  panel.style.display = 'none';
  cbtState._pcAutoDefended = true;
  doDefend();
  return;
 }

 // 魔法詠唱済みか遠距離攻撃済みかつターン1の場合、あるいは遠距離攻撃を回避した場合は様子を見るのみ
 if(cbtState?._pcDidCast || (cbtState?._pcDidRanged && cbtState.turn <= 1) || cbtState?._pcDodgedRanged){
  // 魔法フェーズ継続コールバックがあれば呼ぶ（NPC魔法フェーズへ）
  if(cbtState._magicPhaseNext){
   cbtState._magicPhaseNext();
   return;
  }
  title.innerHTML = `<span style="font-size:var(--font-sm);color:#f0ece0"> ${PC.name}（${cbtState?._pcDodgedRanged?'回避に専念':'遠距離攻撃済み'}）:</span>`;
  btns.innerHTML = '';
  const b = document.createElement('button');
  b.className = 'choice-btn';
  b.textContent = PC._shapeshifted ? ' 攻撃する' : ' 様子を見る';
  b.onclick = ()=>{ _hidePCActionChoices(); doDefend(); };
  btns.appendChild(b);
  return;
 }

 title.innerHTML = `<span style="font-size:var(--font-sm);color:#f0ece0"> ${PC.name}の行動を選択:</span>`;
 btns.innerHTML = '';

 const actions = [
  { label:' 戦う', fn: doFight, id:'ft-btn' },
  { label: PC._shapeshifted ? ' 攻撃する' : ' 様子を見る', fn: doDefend, id:'def-btn' },
 ];
 if(cbtState?.canFlee){
  actions.push({ label:' 逃走', fn: doFlee, id:'flee-btn' });
 }
 actions.forEach(act=>{
  const b = document.createElement('button');
  b.className = 'choice-btn';
  b.id = act.id;
  b.textContent = act.label;
  b.onclick = ()=>{
   _hidePCActionChoices();
   if(PC._deathKnellPanic && act.fn !== doDefend && Math.random() < 0.30){
    const cl = document.getElementById('clog');
    if(cl) cl.innerHTML += `<span style="color:#e0d0d0"> 突如、あの日の恐怖が蘇り、体が金縛りに遭ったように動かなくなった……！</span><br>`;
    doDefend();
    return;
   }
   act.fn();
  };
  btns.appendChild(b);
 });

 // 魔法はフェーズで処理済みのため近接フェーズでは表示しない
}

function _showSpellChoices(){
 const title = document.getElementById('npc-action-title');
 const btns  = document.getElementById('npc-action-btns');
 title.innerHTML = `<span style="font-size:var(--font-sm);color:#e0d8c8"> 呪文を選択:</span>`;
 btns.innerHTML = '';

 // 呪文ボタン
 PC.spells.forEach(sp=>{
  const canAfford = PC.st > sp.cost;
  const b = document.createElement('button');
  b.className = 'choice-btn';
  b.style.cssText = 'border-color:#d8d0c0;color:' + (canAfford ? 'var(--info2)' : 'var(--info-border)');
  b.innerHTML = `${sp.name} <span style="color:#e0d0d0;font-size:calc(var(--font-sm) - 1px)">強さ-${sp.cost}</span>`;
  b.disabled = !canAfford;
  b.onclick = ()=>{
   _hidePCActionChoices();
   document.getElementById('npc-action-panel').style.display = 'none';
   castSpell(sp, 'combat');
  };
  btns.appendChild(b);
 });

 // 戻るボタン
 const back = document.createElement('button');
 back.className = 'choice-btn';
 back.textContent = '← 戻る';
 back.onclick = ()=>{ _showPCActionChoices(); };
 btns.appendChild(back);
}

function _hidePCActionChoices(){
 const panel = document.getElementById('npc-action-panel');
 const title = document.getElementById('npc-action-title');
 const btns  = document.getElementById('npc-action-btns');
 if(title) title.innerHTML = '';
 if(btns)  btns.innerHTML = '';
 // パネルはNPC行動選択で再利用するため非表示にしない
}

// NPCの行動選択肢
const NPC_ACTIONS = [
 { key:'attack', label:' 攻撃' },
 { key:'defend', label:' 様子を見る' },
 { key:'flee', label:' 逃走' },
];

// 戦闘フェーズ管理
// phase: 'player'→FIGHTボタン表示 / 'npc_N'→NPC N番目の行動選択 / 'resolve'→敵ロール解決
let _cbtNPCActions = []; // 各NPCの選択した行動

function doDefend(){
 if(!cbtState) return;
 if(PC._shapeshifted){ doFight(); return; } // 変身中は様子を見ることができず、常にCRで戦う
 if(cbtState.isNPC){ doDefendNPC(); return; }
 const cs = cbtState; cs.turn++;
 cs._pcDefending = true;
 cs._pRollThisTurn = 0; // 防御時は攻撃しない

 const cl = document.getElementById('clog');
 cl.innerHTML += `<span style="color:#e0d8c8"> 様子を見ている…</span><br>`;

 const aliveParty = (PC.party||[]).filter(n=>n.con>0);
 if(aliveParty.length > 0){
 _cbtNPCActions = [];
 showNPCActionPhase(0, aliveParty);
 } else {
 resolveRound(0, []);
 }
}

function doFight(){
 if(!cbtState) return;
 // NPC能力値型戦闘はdoFightNPCへ
 if(cbtState.isNPC){ doFightNPC(); return; }
 const cs = cbtState; cs.turn++;
 cs._pcDefending = false;
 const adds = calcAdds();
 const cl = document.getElementById('clog');

 // 魔法詠唱済みの場合はPCの近接ロールをスキップ
 // （ttyf/blasting/freezeは既にcbtState._spellCaster=trueになっている）
 if(cs._spellCaster){
  // PCの近接なし → NPC行動フェーズ or resolve
  const aliveParty = (PC.party||[]).filter(n=>n.con>0);
  if(aliveParty.length > 0){
   _cbtNPCActions = [];
   showNPCActionPhase(0, aliveParty);
  } else {
   resolveRound(0, []);
  }
  return;
 }

 // ── プレイヤーロール ──
 let pRoll; let pDice=[];
 const equipped = PC.equippedWeapons||[];
 if(PC._shapeshifted){
  // Shapeshift中は武器・能力値によるロールを一切行わず、CRのダイス数+戦闘修正で近接判定を行う
  const rv = monsterCombatRoll(PC._shapeshiftCR||0); pRoll = rv.total; pDice = rv.dice;
 } else if(!equipped.length){
  const rv=rollNd6(1); pDice=rv.dice; pRoll=rv.total+adds;
 } else {
  // 全装備武器のダイスを合計（adds は1回のみ）
  let totalDice = 0; let totalWeaponAdds = 0;
  equipped.forEach((w,wi)=>{
   let dice = w.dice;
   if(wi===0 && cs.vorpalActive && !cs._pcDidCast){ dice*=2; }
   if(wi===0 && cs.whammyActive && !cs._pcDidCast){ dice*=3; }
   if((PC._enchantWeaponTurns||0) > 0){ dice*=3; }
   totalDice += dice;
   totalWeaponAdds += (w.adds||0);
  });
  if(cs.vorpalActive && !cs._pcDidCast) cs.vorpalActive=false;
  if(cs.whammyActive && !cs._pcDidCast) cs.whammyActive=false;
  const rv=rollNd6(totalDice); pDice=rv.dice; pRoll=rv.total+totalWeaponAdds+adds;
 }
 if(cs.littleFeetsRounds>0){ cs.littleFeetsRounds--; const totalD=equipped.reduce((s,w)=>s+(w.dice||1),0)||1; const rv2=rollNd6(totalD); pDice.push(...rv2.dice); pRoll+=rv2.total; }
 cs._pRollThisTurn = pRoll;
 cs._pDiceThisTurn = pDice;

 // パーティがいればNPC操作フェーズへ
 const aliveParty = (PC.party||[]).filter(n=>n.con>0);
 if(aliveParty.length > 0){
 _cbtNPCActions = [];
 showNPCActionPhase(0, aliveParty);
 } else {
 resolveRound(pRoll, []);
 }
}

function showNPCActionPhase(idx, aliveParty){
 if(idx >= aliveParty.length){
 // 全NPC行動確定→解決（NPC型とMR型で分岐）
 document.getElementById('npc-action-panel').style.display = 'none';
 // PCボタンを再表示（ただし解決後はすぐ非表示になる）
 _showPCActionChoices();
 if(cbtState?.isNPC){
  resolveRoundNPC(cbtState._pRollThisTurn, _cbtNPCActions);
 } else {
  resolveRound(cbtState._pRollThisTurn, _cbtNPCActions);
 }
 return;
 }
 const npc = aliveParty[idx];
 const _autoMode = cbtState?.autoNPC || _isCompanionHuntCombat();
 // 遠距離攻撃済みのNPCは自動で様子を見る（autoNPCモードでは「様子を見る」という受動的な表現を避ける）
 const npcPartyIdx = (PC.party||[]).indexOf(npc);
 if(cbtState?.[`_npcDidCast_${npcPartyIdx}`] || (cbtState?.[`_npcDidRanged_${npcPartyIdx}`] && cbtState.turn <= 1)){
  const cl = document.getElementById('clog');
  if(_autoMode){
   cl.innerHTML += `<span style="color:#e0d8c8"> ${npc.name}は既に武器を構え直している。</span><br>`;
  } else {
   cl.innerHTML += `<span style="color:#e0d8c8"> ${npc.name}（遠距離攻撃済み）様子を見た。</span><br>`;
  }
  _cbtNPCActions.push({npc, action:'defend'});
  showNPCActionPhase(idx+1, aliveParty);
  return;
 }
 // autoNPCモード：UIを出さず自動で「攻撃」を選び、戦い方を描写する
 if(_autoMode){
  _cbtNPCActions.push({npc, action:'attack'});
  const cl2 = document.getElementById('clog');
  if(cl2){
   const styleLine = _npcCombatStyleLine(npc);
   cl2.innerHTML += `<span style="color:#c8b8a0;font-size:calc(var(--font-sm) - 1px)">${npc.name}：${styleLine}</span><br>`;
  }
  showNPCActionPhase(idx+1, aliveParty);
  return;
 }
 const panel = document.getElementById('npc-action-panel');
 const title = document.getElementById('npc-action-title');
 const btns = document.getElementById('npc-action-btns');
 panel.style.display = '';
 // NPC行動選択中はPCボタンを隠す
 _hidePCActionChoices();
 const typeJa = {warrior:'戦士',rogue:'盗賊',wizard:'魔法使い'}[npc.type]||npc.type;
 title.innerHTML = `<span style="font-size:var(--font-sm)"> <span style="color:#e8e0d0">${npc.name}</span>（${typeJa} 体力:${npc.con}/${npc.maxCon}）の行動を選択:</span>`;
 btns.innerHTML = '';
 NPC_ACTIONS.forEach(act=>{
  const b = document.createElement('button');
  b.className = 'choice-btn';
  b.textContent = act.label;
  b.onclick = ()=>{
   // カオスモード：「戦う」選択時のみ能力値テスト
   if(cbtState?.chaosMode && act.key === 'attack'){
    const attrs = ['dex','lk','iq'];
    const attr = attrs[Math.floor(Math.random()*attrs.length)];
    const attrNames = {dex:'器用さ',lk:'運',iq:'知力'};
    const cl = document.getElementById('clog');
    cl.innerHTML += `<span style="color:#d8d0c0"> ${npc.name}：時間の歪みを読む（${attrNames[attr]} 能力値テスト）——</span><br>`;
    panel.style.display = 'none';
    document.getElementById('dice-area').classList.remove('hidden');
    document.getElementById('text-win').style.display = '';
    setupSavingRoll({
     attr, level:2, label:`${npc.name}カオス判定`, noAP:true,
     onSuccess(){
      document.getElementById('dice-area').classList.add('hidden');
      document.getElementById('text-win').style.display = 'none';
      cl.innerHTML += `<span style="color:#f0ece0"> 歪みを見切った！</span><br>`;
      _cbtNPCActions.push({npc, action:'fight'});
      if(idx+1 < aliveParty.length) _pendingCombatResume = ()=>showNPCActionPhase(idx+1, aliveParty);
      showNPCActionPhase(idx+1, aliveParty);
     },
     onFail(){
      document.getElementById('dice-area').classList.add('hidden');
      document.getElementById('text-win').style.display = 'none';
      cl.innerHTML += `<span style="color:#e0d8c8"> 歪みに惑わされ、${npc.name}の攻撃は空を切った。</span><br>`;
      _cbtNPCActions.push({npc, action:'chaos_miss'}); // 空振り専用アクション
      if(idx+1 < aliveParty.length) _pendingCombatResume = ()=>showNPCActionPhase(idx+1, aliveParty);
      showNPCActionPhase(idx+1, aliveParty);
     },
    });
    return;
   }
   _cbtNPCActions.push({npc, action: act.key});
   showNPCActionPhase(idx+1, aliveParty);
  };
  btns.appendChild(b);
 });
 // 魔法は魔法フェーズで処理済みのため近接フェーズでは表示しない
 // if((npc.spells||[]).length>0){ ... }
}

// NPC呪文のボーナス値を計算
function npcSpellBonus(npc, spell){
 const fn = spell.fn || '';
 if(fn==='ttyf'){
  return {type:'ttyf', value:(npc.iq||10)*(spell.level||1)};
 } else if(fn==='vorpal'){
  return {type:'vorpal', value:1};
 } else if(fn==='blastingPower' || fn==='freezePleeze'){
  // Lv×D6 + ADDS（ST・LK・DEXベース）
  const dice = npc.level || 1;
  const adds = Math.max(0, calcAdds(npc));
  const dmg = Nd6(dice) + adds;
  return {type:'ttyf', value:dmg};
 }
 // その他は通常攻撃ボーナス
 return {type:'bonus', value:(npc.iq||10)};
}

// 戦闘状況描写テキスト
function _combatNarrative(diff, totalRoll, playerWins, enemyNames){
 const bigHit = diff >= Math.max(8, Math.floor(totalRoll * 0.3));
 const eName = enemyNames.length===1 ? enemyNames[0] : '敵';
 if(playerWins){
  const big = [
   `${eName}に致命的な一撃を与えた！`,
   `${eName}の防御を完全に崩した！`,
   `${eName}を圧倒する猛攻を叩き込んだ！`,
   `${eName}に大打撃を与えた！`,
   `${eName}の急所を捉えた！`,
   `${eName}を吹き飛ばす一撃を放った！`,
   `${eName}が体勢を崩すほどの打撃を与えた！`,
   `${eName}の隙を突いて痛烈な一撃を決めた！`,
  ];
  const small = [
   `${eName}にかすり傷を負わせた。`,
   `${eName}の体勢をわずかに崩した。`,
   `${eName}に浅い傷を与えた。`,
   `${eName}の動きを少し鈍らせた。`,
   `${eName}への一撃は浅く、決定打にならなかった。`,
   `${eName}に小さなダメージを与えた。`,
   `${eName}をわずかに傷つけたが、まだ余裕がある。`,
   `${eName}に一撃を入れたが、大した傷ではない。`,
  ];
  const pick = arr=>arr[Math.floor(Math.random()*arr.length)];
  return `<span style="color:#ccccaa;font-size:var(--font-sm)"> ${pick(bigHit?big:small)}</span>`;
 } else {
  const big = [
   `${eName}から凄まじい打撃を受けた！`,
   `${eName}の一撃がもろに決まった！`,
   `${eName}に防御を突き破られた！`,
   `${eName}に大きなダメージを受けた！`,
   `${eName}の猛攻に押し切られた！`,
   `${eName}の強烈な一撃が直撃した！`,
   `${eName}に体ごと弾き飛ばされた！`,
   `${eName}の攻撃をまともに喰らった！`,
  ];
  const small = [
   `${eName}にかすり傷をつけられた。`,
   `${eName}の攻撃をほぼ防いだが、少し傷ついた。`,
   `${eName}の爪先が体をかすめた。`,
   `${eName}に小さな傷を負った。`,
   `${eName}の一撃を受け流したが、衝撃が残った。`,
   `${eName}の攻撃が掠め、じりじりと消耗する。`,
   `${eName}に軽い傷を負わされた。大事はない。`,
   `${eName}の牙が鎧を擦り、浅い傷をつけた。`,
  ];
  const pick = arr=>arr[Math.floor(Math.random()*arr.length)];
  return `<span style="color:#ccccaa;font-size:var(--font-sm)"> ${pick(bigHit?big:small)}</span>`;
 }
}

function resolveRound(pRoll, npcActions){
 if(cbtState?.isNPC){ resolveRoundNPC(pRoll, npcActions); return; }
 const cs = cbtState;
 const cl = document.getElementById('clog');
 const pcDefending = !!cs._pcDefending;
 cs._pcDefending = false;

 // ── 魔法詠唱フラグ取得・リセット ──
 const spellCaster  = !!cs._spellCaster;   // true = PC近接スキップ
 const spellHitBonus = cs._spellHitBonus || 0; // blasting/freeze加算ヒット
 const ttyfHit      = cs._ttyfHit || 0;    // ttyfヒット（PC側に計上済み）
 const ttyfTarget   = cs._ttyfTarget || null;
 cs._spellCaster = false;
 cs._spellHitBonus = 0;
 cs._ttyfHit = 0;
 cs._ttyfTarget = null;
 cs._ttyfPRoll = 0;
 cs._ttyfMagicPhase = false;
 // 遠距離攻撃フラグをリセット（次ラウンド以降は使用不可のまま保持）
 // ※遠距離はターン1のみなのでフラグはクリアしない（リセット不要）

 // ── NPCロール計算 ──
 let partyRoll = 0;
 const partyRolls = npcActions.map(({npc, action, spell, bonus})=>{
 let r = 0; let npcDice = [];
 if(action === 'attack'){
  const rv = calcNPCRoll(npc); r = rv.total; npcDice = rv.dice;
 } else if(action === 'defend'){
  r = 0;
 } else if(action === 'chaos_miss'){
  r = 0; // カオス能力値テスト失敗による空振り
 } else if(action === 'spell' && bonus){
  if(bonus.type==='ttyf'){
   r = bonus.value; // TTYFは直接ヒット値として加算
  } else if(bonus.type==='vorpal'){
   npc._vorpalNext = true; r = 0;
  } else {
   r = bonus.value;
  }
 }
 partyRoll += r;
 return {npc, action, r, npcDice, spell, bonus};
 });

 // PCのヒット：詠唱者ならttyfHit or 0（近接スキップ）、spellHitBonusは加算
 const pcHit = spellCaster
  ? (ttyfHit > 0 ? ttyfHit : 0) + spellHitBonus
  : pRoll + spellHitBonus;
 // 遠距離攻撃ヒット合計はパーティ攻撃合計に加算しない（直接ダメージのみ）
 cs._rangedHitTotal = 0;
 // NPC魔法フェーズTTYF分（ヒット比較には加算、差分ダメージには含めない）
 const npcTtyfMagicHit = cs._npcTtyfMagicHit || 0;
 cs._npcTtyfMagicHit = 0;
 const totalPlayerRoll = pcHit + partyRoll + npcTtyfMagicHit + (cs._summonCR||0) + (cs._shapeshiftCR||0);

 // ── 各敵ロール（ttyfでダメージ適用後のcurMRで計算）──
 const aliveEnemies = cs.enemies.filter(e=>e.curMR>0);
 if(cs.sleeping>0){ cs.sleeping--; }
 const eRolls = aliveEnemies.map(e=>{
 if(cs.sleeping>0) return {enemy:e, roll:0, dice:[]};
 const rv = monsterCombatRoll(e.curMR);
 return {enemy:e, roll: rv.total, dice:rv.dice};
 });
 const eTotalRoll = eRolls.reduce((s,r)=>s+r.roll, 0);

 // ── ラウンドログ ──
 const pDice = cs._pDiceThisTurn || [];
 cs._pDiceThisTurn = [];
 // 詳細ログ（折りたたみ用）
 const detailId = `cbt-detail-${cs.turn}-${Date.now()}`;
 let detail = ``;
 if(spellCaster && ttyfHit > 0){
  detail += `You <span style="color:#e8e0d0">TTYF=${ttyfHit}</span>`;
  if(spellHitBonus) detail += `+<span style="color:#e8e0d0">魔法+${spellHitBonus}</span>`;
 } else if(spellCaster){
  detail += `You <span style="color:#e8e0d0">魔法+${spellHitBonus}</span>`;
 } else if(pcDefending){
  detail += `You <span style="color:#e0d8c8">様子を見る</span>`;
 } else {
  detail += `You <span style="color:#c8b8a0;font-size:calc(var(--font-sm) - 2px)">${diceStr(pDice)}</span>=<span style="color:#f0ece0">${pRoll}</span>`;
  if(spellHitBonus) detail += `+<span style="color:#e8e0d0">魔法+${spellHitBonus}</span>`;
 }
 partyRolls.forEach(({npc,action,r,npcDice,spell})=>{
  if(action==='attack') detail += `+${npc.name}<span style="color:#c8b8a0;font-size:calc(var(--font-sm) - 2px)">${diceStr(npcDice)}</span>=<span style="color:#e0d8c8">${r}</span>`;
  else if(action==='defend') detail += `+${npc.name}<span style="color:#e0d8c8"></span>`;
  else if(action==='chaos_miss') detail += `+${npc.name}<span style="color:#e0d8c8"> 空振り</span>`;
  else if(action==='spell') detail += `+${npc.name}<span style="color:#e0d8c8">${spell?.name}=${r}</span>`;
  else detail += `+${npc.name}<span style="color:#ffcc00"></span>`;
 });
 if(partyRolls.length || spellCaster || spellHitBonus) detail += `→<span style="color:#f0ece0">${totalPlayerRoll}</span>`;
 detail += ' vs ';
 if(aliveEnemies.length > 1){
  detail += eRolls.map(r=>`${r.enemy.name}<span style="color:#c8b8a0;font-size:calc(var(--font-sm) - 2px)">${diceStr(r.dice)}</span>=<span class="ora">${r.roll}</span>`).join('+');
  detail += `→<span class="ora">${eTotalRoll}</span>`;
 } else {
  detail += `${aliveEnemies[0]?.name} <span style="color:#c8b8a0;font-size:calc(var(--font-sm) - 2px)">${diceStr(eRolls[0]?.dice||[])}</span>=<span class="ora">${eTotalRoll}</span>`;
 }

 // 概要ログ（ターン番号＋詳細トグルボタン）
 let log = `<span style="color:var(--white)">T${cs.turn}</span> `
  +`<span onclick="var d=document.getElementById('${detailId}');if(d){d.style.display=d.style.display==='none'?'':'none';}" `
  +`style="cursor:pointer;font-size:var(--font-sm);color:#d0c8b8;border:1px solid #c0b098;border-radius:2px;padding:1px 4px;margin-right:4px">詳細</span>`;

 if(totalPlayerRoll > eTotalRoll){
 const rawDmg = totalPlayerRoll - eTotalRoll;
 // 魔法フェーズで既に適用済みのTTYFダメージを差し引く
 const ttyfMagicTotal = (ttyfHit > 0 && cs._ttyfMagicPhase ? ttyfHit : 0) + npcTtyfMagicHit;
 const totalDmg = Math.max(0, rawDmg - ttyfMagicTotal);
 const perEnemy = Math.floor(totalDmg / aliveEnemies.length);
 const remainder = totalDmg % aliveEnemies.length;
 const eNames = aliveEnemies.map(e=>e.name);
 log += _combatNarrative(rawDmg, totalPlayerRoll+eTotalRoll, true, eNames)+'<br>';
 // ダメージ詳細はdetailへ
 detail += `<br><span style="color:#e8e4d8">→ 敵側 -${totalDmg} ダメージ</span><br>`;
 aliveEnemies.forEach((e,idx)=>{
  const dmgToThis = perEnemy + (idx===0?remainder:0);
  let actualDmg = Math.max(0, dmgToThis - (e.armor||0));
  const magicDealtThisRound = (ttyfHit>0) || (spellHitBonus>0) || (npcTtyfMagicHit>0);
  if(e.magicOnly && !magicDealtThisRound){
   actualDmg = 0;
  }
  e.curMR = Math.max(0, e.curMR - actualDmg);
  detail += `　<span style="color:#c0b098">→ ${e.name}: -${actualDmg} [残${e.curMR}]</span>${e.curMR<=0?' <span style="color:#e8e4d8"></span>':''}${e.magicOnly && !magicDealtThisRound ? ' <span style="color:#9988cc">（物理攻撃は無効）</span>':''}<br>`;
 });

 } else if(eTotalRoll > totalPlayerRoll){
 const totalDmg = eTotalRoll - totalPlayerRoll;
 const eNames = aliveEnemies.map(e=>e.name);
 log += _combatNarrative(totalDmg, totalPlayerRoll+eTotalRoll, false, eNames)+'<br>';
 const targets = [
  {t:PC, armor:effectiveArmor()*(pcDefending?2:1), label:'You'},
  ...npcActions
  .filter(({action})=>action!=='flee')
  .map(({npc,action})=>({t:npc, armor:calcNPCArmor(npc)*(action==='defend'?2:1), label:npc.name})),
 ];
 const perTarget = Math.floor(totalDmg / targets.length);
 const remainder = totalDmg % targets.length;
 // ダメージ詳細はdetailへ
 detail += `<br><span class="red">→ 味方 -${totalDmg} ダメージ（${targets.length}人で分担）</span><br>`;
 targets.forEach(({t,armor,label},idx)=>{
  const dmg = Math.max(1, (perTarget+(idx===0?remainder:0)) - armor);
  t.con = Math.max(0, t.con - dmg);
  if(t===PC){
   detail += `　<span class="red">→ You -${dmg} CON [${PC.con}/${PC.maxCon}]</span><br>`;
  } else {
   detail += `　<span style="color:#e0d8c8">→ ${label} -${dmg} CON [${t.con}/${t.maxCon}]</span>${t.con<=0?` <span class="red"> ${label}が倒れた！</span>`:''}<br>`;
  }
 });
 npcActions.filter(({action})=>action==='flee').forEach(({npc})=>{
  detail += `　<span style="color:#ffcc00">→ ${npc.name}が逃走を試みた（ダメージ回避）</span><br>`;
 });
 } else {
 const drawTexts = [
  '互いの攻撃が打ち消し合った。',
  '攻防が拮抗し、どちらも傷を負わなかった。',
  '激しく打ち合ったが、お互いに弾き飛ばされた。',
  '攻撃を読み合い、両者ともに完全に防いだ。',
  '激しい攻防が続いたが、互いに傷はない。',
  '一瞬の静寂——どちらの攻撃も届かなかった。',
  '互いに牽制し合い、勝負はつかなかった。',
  '紙一重の攻防。両者ともに無傷で距離を取った。',
 ];
 const drawTxt = drawTexts[Math.floor(Math.random()*drawTexts.length)];
 log += `<span style="color:#f0ece0"> ${drawTxt}</span><br>`;
 }

 log += `<div id="${detailId}" style="display:none;color:#b8a890;font-size:calc(var(--font-sm) - 2px);margin:1px 0 3px 0">${detail}</div>`;
 cl.innerHTML += log;
 cl.scrollTop = 9999;
 _updateCombatBars(); updateHUD();

 // 戦闘ボタンを無効化してOK待ち

 // 死亡チェック
 if(PC.con <= 0){
 cl.innerHTML += `<span class="red"> 体力0！死亡！</span><br>`;
 _hidePCActionChoices();
 document.getElementById('npc-action-panel').style.display = 'none';
 const _enemyNameForSave = (cs.enemies||[]).map(e=>e.name).join('・') || '敵';
 if(!cs.skipLuckSave && offerLuckSave(_enemyNameForSave)) return;
 showCombatOK(()=>{
  const _onLose = cs.onLose;
  cbtState = null;
  if(_onLose){ _onLose(); } else { go(cs.lose||'DEAD'); }
 });
 return;
 }

 // 全滅チェック
 const allDead = cs.enemies.every(e=>e.curMR<=0);
 if(allDead){
 const memberCount = 1 + (PC.party||[]).filter(n=>n.con>0).length;
 const share = gainAPCombat(cs.totalMR); updateHUD();
 // 旅中戦闘は onWin で宝物生成するのでここではスキップ
 const isTravelCombat = cs.win === '__noop__' && typeof cs.onWin === 'function' && cs._isTravelCombat;
 const treasureDesc = isTravelCombat ? null : generateTreasure(cs.totalMR);
 if(isTravelCombat) cs._treasureDesc = generateTreasure(cs.totalMR);
 let victoryMsg = memberCount > 1
  ? `<span style="color:#ccccaa"> 全敵を倒した！ 経験値+${share}（CombatRating${cs.totalMR}÷${memberCount}人）</span>`
  : `<span style="color:#ccccaa"> 全敵を倒した！ 経験値+${share}</span>`;
 if(treasureDesc) victoryMsg += `<br><span style="color:#ccccaa">${treasureDesc}</span>`;
 updateHUD();
 cl.innerHTML += victoryMsg+'<br>';
 _hidePCActionChoices();
 document.getElementById('npc-action-panel').style.display = 'none';
 showCombatOK(()=>{
  if(cs.win === '__noop__'){
   // onWinが独自にUIを制御する場合：cbt-areaを隠してtext-winを復元
   document.getElementById('cbt-area').classList.add('hidden'); document.getElementById('scroll-area').classList.remove('in-combat');
   document.getElementById('text-win').style.display = '';
   cbtState = null;
   if(cs.onWin) cs.onWin();
  } else {
   if(cs.onWin) cs.onWin();
   go(cs.win||currentNodeId);
  }
 });
 return;
 }

 // 次ターンへ
 _hidePCActionChoices();
 document.getElementById('npc-action-panel').style.display = 'none';
 showCombatOK(()=>{ _startNewRound(); });
}

// 戦闘ログ確認用OKボタンを表示
function showCombatOK(callback){
 const cl = document.getElementById('clog');
 cl.scrollTop = 9999;
 const area = document.getElementById('cbt-ok-area');
 const okBtn = document.createElement('button');
 okBtn.className = 'choice-btn';
 okBtn.style.cssText = 'width:100%;font-size:var(--font-sm);padding:10px;background:#150f06;border-color:#b0a080;color:#f0ece0';
 okBtn.textContent = '▶ OK';
 okBtn.onclick = ()=>{
 area.innerHTML = '';
 area.style.display = 'none';
 callback();
 };
 area.innerHTML = '';
 area.appendChild(okBtn);
 area.style.display = 'block';
 cl.scrollTop = 9999;
 okBtn.focus();
}

// ──────────────────────────────────────
// MAGIC ENGINE (in-game)
// ──────────────────────────────────────
