/* ── NODESオブジェクト（ゲームノード定義） ── */






// ── アル・ラシード東方の地下迷宮 モンスターテーブル ──────────────



const FP_B3_MONSTER_TABLE = [
 {name:'山岳ゴーレム',     mr:180, armor:6, minApp:1, maxApp:1},
 {name:'古代の戦士霊',     mr:150, armor:4, minApp:1, maxApp:2},
 {name:'深山のドラゴン',   mr:250, armor:7, minApp:1, maxApp:1},
 {name:'岩の巨人',         mr:200, armor:5, minApp:1, maxApp:1},
 {name:'呪縛された番人',   mr:130, armor:3, minApp:1, maxApp:3},
 {name:'山岳オーガの長',   mr:160, armor:4, minApp:1, maxApp:2},
];

function fpB3Move(dest){ if(!fpB3CheckEncounter(dest)) go(dest); }

function fpB3CheckEncounter(returnNode){
 if(Math.random() >= 0.22) return false;
 const m = FP_B3_MONSTER_TABLE[Math.floor(Math.random()*FP_B3_MONSTER_TABLE.length)];
 const count = m.minApp + Math.floor(Math.random()*(m.maxApp - m.minApp + 1));
 const s = document.getElementById('story');
 s.innerHTML += `<br><br><span style="color:#f0ddd8"> ${m.name}が${count > 1 ? count+'体' : ''}姿を現した！</span>`;
 renderChoices([]);
 drawScene('combat');
 startCombat({
  name: m.name, mr: m.mr * count, armor: m.armor||0,
  canFlee: true, win:'__noop__', lose:'DEAD',
  onWin(){ document.getElementById('cbt-area').classList.add('hidden'); document.getElementById('scroll-area').classList.remove('in-combat'); document.getElementById('text-win').style.display=''; cbtState=null; go(returnNode); },
 });
 return true;
}

// B3テレポーター罠
function fpB3Teleporter(){
 const attrs = [{attr:'lk', name:'LK 運'}, {attr:'dex', name:'DEX 器用'}];
 const chosen = attrs[Math.floor(Math.random()*attrs.length)];
 const destinations = ['FP_B3_ROOM1','FP_B3_ROOM2','FP_B3_ROOM3','FP_B3_ROOM4'];
 const s = document.getElementById('story');
 s.innerHTML += `<br><br><span style="color:#e8e0d8"> 床の石に踏み込んだ瞬間、足元に古代の紋章が光り始めた！</span>`;
 setupSavingRoll({attr: chosen.attr, level:2,
  passTxt:'体を動かし、光の中から抜け出した。',
  failTxt:'光が全身を包み、気づくと別の場所に立っていた——',
  onSuccess(){ renderChoices([{label:'▶ 通路を進む', fn:()=>fpB3Move('FP_B3_ROOM4')}]); },
  onFail(){
   const dest = destinations[Math.floor(Math.random()*destinations.length)];
   renderChoices([{label:'▶ 目を開く', fn:()=>go(dest)}]);
  },
 });
}

const FP_B2_MONSTER_TABLE = [
 {name:'山岳オーガ',       mr:80,  armor:2, minApp:1, maxApp:2},
 {name:'廃坑の亡霊',       mr:100, armor:1, minApp:1, maxApp:3},
 {name:'岩石トロル',       mr:130, armor:4, minApp:1, maxApp:1},
 {name:'山岳熊（凶暴）',   mr:110, armor:2, minApp:1, maxApp:2},
 {name:'古代の番兵',       mr:160, armor:5, minApp:1, maxApp:1},
 {name:'山岳ゴブリン隊長', mr:70,  armor:2, minApp:2, maxApp:4},
];

function fpB2Move(dest){ if(!fpB2CheckEncounter(dest)) go(dest); }

function fpB2CheckEncounter(returnNode){
 if(Math.random() >= 0.20) return false;
 const m = FP_B2_MONSTER_TABLE[Math.floor(Math.random()*FP_B2_MONSTER_TABLE.length)];
 const count = m.minApp + Math.floor(Math.random()*(m.maxApp - m.minApp + 1));
 const s = document.getElementById('story');
 s.innerHTML += `<br><br><span style="color:#f0ddd8"> ${m.name}が${count > 1 ? count+'体' : ''}現れた！</span>`;
 renderChoices([]);
 drawScene('combat');
 startCombat({
  name: m.name, mr: m.mr * count, armor: m.armor||0,
  canFlee: true, win:'__noop__', lose:'DEAD',
  onWin(){ document.getElementById('cbt-area').classList.add('hidden'); document.getElementById('scroll-area').classList.remove('in-combat'); document.getElementById('text-win').style.display=''; cbtState=null; go(returnNode); },
 });
 return true;
}

// B2専用：警備モンスター出現（固定）
function fpB2Guard(returnNode){
 const m = FP_B2_MONSTER_TABLE[4]; // 古代の番兵
 const s = document.getElementById('story');
 s.innerHTML += `<br><br><span style="color:#f0ddd8"> 古代の番兵が現れた！扉に近づく者を排除せんとしている！</span>`;
 renderChoices([]);
 drawScene('combat');
 startCombat({
  name: m.name, mr: m.mr, armor: m.armor,
  canFlee: true, win:'__noop__', lose:'DEAD',
  onWin(){ document.getElementById('cbt-area').classList.add('hidden'); document.getElementById('scroll-area').classList.remove('in-combat'); document.getElementById('text-win').style.display=''; cbtState=null; go(returnNode); },
 });
}

const FP_MONSTER_TABLE = [
 {name:'山賊の見張り',     mr:25, armor:1, minApp:1, maxApp:3},
 {name:'岩トロル',         mr:60, armor:3, minApp:1, maxApp:2},
 {name:'山狼の群れ',       mr:35, armor:0, minApp:2, maxApp:4},
 {name:'廃坑の亡者',       mr:45, armor:1, minApp:1, maxApp:2},
 {name:'石の番人',         mr:90, armor:4, minApp:1, maxApp:1},
 {name:'山岳ゴブリン',     mr:20, armor:0, minApp:2, maxApp:5},
 {name:'古の山岳竜（幼体）',mr:150,armor:5, minApp:1, maxApp:1},
];

function fpMove(dest){ if(!fpCheckEncounter(dest)) go(dest); }

function fpCheckEncounter(returnNode){
 if(Math.random() >= 0.18) return false;
 const m = FP_MONSTER_TABLE[Math.floor(Math.random()*FP_MONSTER_TABLE.length)];
 const count = m.minApp + Math.floor(Math.random()*(m.maxApp - m.minApp + 1));
 const totalMR = m.mr * count;
 const s = document.getElementById('story');
 s.innerHTML += `<br><br><span style="color:#f0ddd8"> ${m.name}が${count}体、凍てつく暗闇から現れた！</span>`;
 renderChoices([]);
 drawScene('combat');
 startCombat({
  name: m.name, mr: totalMR, armor: m.armor||0,
  canFlee: true,
  win:'__noop__', lose:'DEAD',
  onWin(){
   document.getElementById('cbt-area').classList.add('hidden');
   document.getElementById('scroll-area').classList.remove('in-combat');
   document.getElementById('text-win').style.display = '';
   cbtState = null;
   go(returnNode);
  },
 });
 return true;
}



const AL_DNG_MONSTER_TABLE = [
 {name:'砂漠の亡者',    mr:15, minApp:3, maxApp:8, armor:1},
 {name:'盗賊の亡霊',    mr:20, minApp:2, maxApp:6, armor:1},
 {name:'遺跡の番人',    mr:30, minApp:2, maxApp:5, armor:3},
 {name:'砂の精霊',      mr:25, minApp:2, maxApp:4, armor:2},
 {name:'呪われた衛兵',  mr:45, minApp:1, maxApp:3, armor:3},
 {name:'古代の守護者',  mr:70, minApp:1, maxApp:2, armor:4},
];
function alCheckEncounter(returnNode){
 if(Math.random() >= 0.16) return false;
 const m = AL_DNG_MONSTER_TABLE[Math.floor(Math.random()*AL_DNG_MONSTER_TABLE.length)];
 const count = m.minApp + Math.floor(Math.random()*(m.maxApp-m.minApp+1));
 const s = document.getElementById('story');
 s.innerHTML += `<br><br><span style="color:#f0ddd8"> ${m.name}が${count}体、暗闇から現れた！</span>`;
 renderChoices([]);
 drawScene('combat');
 startCombat({
  name:m.name, mr:m.mr*count, armor:m.armor,
  canFlee:true, win:'__noop__', lose:'DEAD',
  onWin(){ document.getElementById('cbt-area').classList.add('hidden'); document.getElementById('scroll-area').classList.remove('in-combat'); document.getElementById('text-win').style.display=''; cbtState=null; go(returnNode); },
 });
 return true;
}
function alMove(dest){ if(!alCheckEncounter(dest)) go(dest); }

const NODES = {
 DEAD: DEAD_NODE,
 WANTED_ARREST_NODE: WANTED_ARREST_NODE,
 RESTART: {txt:'',choices:[{label:'▶ RESTART',go:'RESTART'}]},

 RETIRE:{
 scene:'town_khazan',
 txt:()=>{
 const age = calcAge();
 const params = AGING_PARAMS[PC.race] || AGING_PARAMS.human;
 const yearsAdventuring = Math.max(0, age - 20);
 const typeJa = {warrior:'戦士',rogue:'盗賊',wizard:'魔法使い'}[PC.type]||PC.type;
 const raceJa = {human:'人間',elf:'エルフ',dwarf:'ドワーフ',halfling:'ハーフリング',fairy:'フェアリー',leprechaun:'レプラコーン',troll:'トロール',ogre:'オーガ',orc:'オーク',goblin:'ゴブリン'}[PC.race]||PC.race;
 const gold = (PC.gold||0) + Object.values(PC.properties||{}).reduce((s,p)=>s+(p.storage?.gold||0),0);
 const wealth = gold>=1000?'大富豪として':gold>=500?'余裕のある暮らしで':gold>=100?'慎ましく':gold>0?'わずかな蓄えで':'無一文で';
 const partyNames = (PC.party||[]).filter(n=>n.con>0).map(n=>n.name).join('、');
 const partyLine = partyNames
 ? `仲間の${partyNames}とともに、穏やかな余生を送ることにした。`
 : '孤独だが、充実した日々を振り返りながら、静かな余生を選んだ。';
 // 実績スコアで形容を決定
 const heroTownCount = Object.keys(PC._heroTowns||{}).length;
 const heroRegionCount = Object.keys(PC._heroRegions||{}).length;
 // 2026年10月2日：攻略済みでも、それが「このPC自身」の功績の場合のみ実績に加点する（先代の功績を新PCの実績として数えないため）
 const chaosCleared = !!(PC._chaosNest?.cleared && PC._chaosNest?.clearedByPCName === PC.name);
 const famineHero = !!(PC._famineYear && PC._famineHeroName === PC.name);
 const achievementScore =
  heroTownCount +
  heroRegionCount * 3 +
  (chaosCleared ? 5 : 0) +
  (famineHero ? 4 : 0);

 let legacy;
 if(achievementScore >= 15 || (achievementScore >= 10 && PC.level >= 8)){
  legacy = '神々しい';
 } else if(achievementScore >= 8 || (achievementScore >= 5 && PC.level >= 6)){
  legacy = '伝説の';
 } else if(achievementScore >= 4 || (achievementScore >= 2 && PC.level >= 5)){
  legacy = '知らぬ者のいない';
 } else if(PC.level >= 6){
  legacy = '名高い';
 } else if(PC.level >= 2){
  legacy = '一人前の';
 } else {
  legacy = '駆け出しの';
 }

 return `<div style="text-align:center;margin-bottom:16px">
 <div style="font-size:calc(var(--font-lg) + 6px);color:#f0ece0;margin-bottom:6px"> 引退</div>
 <div style="font-size:calc(var(--font-sm) - 1px);color:#c8b8a0">RETIRED ADVENTURER</div>
 </div>
 <div style="background:#0a0a00;border:1px solid #443300;border-radius:4px;padding:12px;margin-bottom:12px;font-size:calc(var(--font-sm) + 1px);color:#e8e0d0;line-height:2.2">
 ${raceJa}の${legacy}${typeJa}、${PC.name}は${age}歳にして冒険者稼業に幕を下ろした。<br><br>
 ${wealth}${partyLine}
 </div>
 <div style="background:#0f0b07;border:1px solid #4a3520;border-radius:4px;padding:10px;margin-bottom:10px">
 <div style="font-size:calc(var(--font-sm) - 2px);color:var(--white2);margin-bottom:8px">── 冒険の記録 ──</div>
 <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;font-size:calc(var(--font-sm) - 1px)">
 <div style="background:#130e09;border:1px solid #3a2818;border-radius:3px;padding:6px;text-align:center">
 <div style="color:#c8b8a0;margin-bottom:3px">引退時の年齢</div>
 <div style="color:#ece8e0;font-size:var(--font-base)">${age}歳</div>
 </div>
 <div style="background:#130e09;border:1px solid #3a2818;border-radius:3px;padding:6px;text-align:center">
 <div style="color:#c8b8a0;margin-bottom:3px">冒険歴</div>
 <div style="color:#ece8e0;font-size:var(--font-base)">${yearsAdventuring}年</div>
 </div>
 <div style="background:#130e09;border:1px solid #3a2818;border-radius:3px;padding:6px;text-align:center">
 <div style="color:#c8b8a0;margin-bottom:3px">最終レベル</div>
 <div style="color:#f0ece0;font-size:var(--font-base)">Lv ${PC.level}</div>
 </div>
 <div style="background:#130e09;border:1px solid #3a2818;border-radius:3px;padding:6px;text-align:center">
 <div style="color:#c8b8a0;margin-bottom:3px">獲得AP</div>
 <div style="color:#e8e4d8;font-size:var(--font-base)">${PC.ap}</div>
 </div>
 <div style="background:#130e09;border:1px solid #3a2818;border-radius:3px;padding:6px;text-align:center">
 <div style="color:#c8b8a0;margin-bottom:3px">最終所持金</div>
 <div style="color:#f4ede0;font-size:var(--font-base)">${gold}GP</div>
 </div>
 <div style="background:#130e09;border:1px solid #3a2818;border-radius:3px;padding:6px;text-align:center">
 <div style="color:#c8b8a0;margin-bottom:3px">強さ / 体力</div>
 <div style="color:var(--text);font-size:var(--font-base)">${PC.st} / ${PC.con}</div>
 </div>
 </div>
 </div>
 <div style="font-size:calc(var(--font-sm) - 1px);color:#c8b8a0;text-align:center;margin-top:8px">
 また新しい冒険者の物語が始まる…
 </div>
 ${buildContinueHtml('retire')}`;
 },
 choices: buildEndChoices,
 },

 DEAD_OLDAGE:{
 scene:'town',
 txt:()=>{
 archiveCurrentPC('dead');
 return `<span class="red" style="font-size:calc(var(--font-lg) + 4px)"> 老衰 GAME OVER </span><br><br>
 ${PC.name}は${PC.age}歳でその生涯を終えた。<br><br>
 <span style="color:#c0b098">冒険の年月: ${PC.age-20}年<br>
 最終レベル: ${PC.level}<br>
 獲得AP: ${PC.ap}</span>
 ${buildContinueHtml('dead')}`;
 },
 choices: buildEndChoices,
 },

 // ══════════════════════════════════════════
 // TOWN NODES
 // ══════════════════════════════════════════

 BACKGROUND_REVEAL:{
 scene:()=>({khazan:'town_khazan',port_argon:'town_port',stonehiem:'town_stone',elsia:'town_elsia',verda:'town_village',rimholm:'town_village',marakai:'town_village',al_rashid:'town_desert_city',oasis_fort:'town_desert_village',saroon:'town_desert_village',duna:'town_desert_village',neria:'town_stone',dorua:'town_village',sarpe:'town_village',nebra:'town_village',yeldun:'town_mountain_city',frostpeak:'town_mountain_village',ashveil:'town_mountain_village'}[PC._startTown]||'town_khazan'),
 txt:()=>{
 const bg = PC.background || {};
 const params = AGING_PARAMS[PC.race] || AGING_PARAMS.human;
 const townNames = {khazan:'カザーヌ',port_argon:'ポートアルゴン',stonehiem:'ストーンヘイム',elsia:'エルマリア',verda:'ヴェルダ村',rimholm:'リムホルム',marakai:'マラカイ',al_rashid:'アル・ラシード',oasis_fort:'オアシス砦',saroon:'サルーン',duna:'デュナ',neria:'ネリア砦',dorua:'ドルアの村',sarpe:'サルペ',nebra:'ネブラ',yeldun:'イェルドゥン',frostpeak:'フロストピーク',ashveil:'アッシュヴェイル'};
 const startTownName = townNames[PC._startTown] || 'カザーヌ';
 return `<span class="gold" style="font-size:calc(var(--font-base) + 1px)">── ${PC.name}の生い立ち ──</span><br><br>
 <span class="dim" style="font-size:calc(var(--font-sm) - 1px)"> 家族・身分</span><br>
 ${bg.family||''}<br><br>
 <span class="dim" style="font-size:calc(var(--font-sm) - 1px)"> 冒険に出た理由</span><br>
 ${bg.motive||''}<br><br>
 <span class="dim" style="font-size:calc(var(--font-sm) - 1px)"> ${PC.age}歳　誕生: ${PC.birthYear}年 ${MONTHS_JP[PC.birthMonth-1]} ${PC.birthDay}日</span><br><br>
 <span class="cyn" style="font-size:var(--font-sm)"> 出発地：<b>${startTownName}</b></span>
 <div style="margin-top:14px;padding:10px;background:#0a0c0a;border:1px solid #585858;border-radius:4px;font-size:calc(var(--font-sm) - 1px);line-height:2;color:var(--white2)">
  <div style="color:var(--white);margin-bottom:6px"> はじめての冒険者へ</div>
  <div> 装備は丸腰からのスタートです。街の<b>武器屋・装備屋</b>で武器と防具を購入し、ステータス画面から装備してください。</div>
  <div style="margin-top:4px"> 街から街へ移動する際には<b>食料</b>が必要です。装備屋の消耗品から購入できます。食料が尽きると旅を続けられません。</div>
 </div>`;
 },
 choices:[
 {label:'▶ 冒険を始める', fn:()=>{
 const nodeMap = {khazan:'TOWN_KHAZAN',port_argon:'TOWN_PORT_ARGON',stonehiem:'TOWN_STONEHIEM',elsia:'TOWN_ELSIA',verda:'TOWN_VERDA',rimholm:'TOWN_RIMHOLM',marakai:'TOWN_MARAKAI',al_rashid:'TOWN_AL_RASHID',oasis_fort:'TOWN_OASIS_FORT',saroon:'TOWN_SAROON',duna:'TOWN_DUNA',neria:'TOWN_NERIA',dorua:'TOWN_DORUA',sarpe:'TOWN_SARPE',nebra:'TOWN_NEBRA',yeldun:'TOWN_YELDUN',frostpeak:'TOWN_FROSTPEAK',ashveil:'TOWN_ASHVEIL'};
 go(nodeMap[PC._startTown] || 'TOWN_KHAZAN');
 }, go:'__travel__'},
 {label:'▶ チュートリアルを始める', fn:()=>{ startTutorial(); }, go:'__travel__'},
 ]
 },

 TUTORIAL_INTRO:{
 scene:()=>({khazan:'town_khazan',port_argon:'town_port',stonehiem:'town_stone',elsia:'town_elsia',verda:'town_village',rimholm:'town_village',marakai:'town_village',al_rashid:'town_desert_city',oasis_fort:'town_desert_village',saroon:'town_desert_village',duna:'town_desert_village',neria:'town_stone',dorua:'town_village',sarpe:'town_village',nebra:'town_village',yeldun:'town_mountain_city',frostpeak:'town_mountain_village',ashveil:'town_mountain_village'}[PC._startTown]||'town_khazan'),
 txt:()=>{
  const t = PC._tutorial;
  return ` <span class="gold" style="font-size:calc(var(--font-base) + 1px)">── 酒場にて ──</span><br><br>
  <span style="color:#c0b098">酒場の片隅で一人、静かに酒を飲む老人がいた。旅装束は年季が入っているが、纏う空気はどこか只者ではない。ふと目が合うと、彼の方から声をかけてきた。</span><br><br>
  <div style="background:var(--panel);border:1px solid var(--panel2);border-radius:4px;padding:12px">
   <div style="color:#f0ece0;font-size:var(--font-sm);margin-bottom:6px"> ${t.oldNPC.name}</div>
   <div style="color:var(--white2);font-size:var(--font-sm);line-height:1.9">「おお、見ん顔じゃな。旅立ったばかりのようじゃが……よし、わしが少しばかり手ほどきをしてやろうかの。まずは腹ごしらえより先に、装備を整えることじゃ」</div>
  </div>`;
 },
 choices:[
  {label:'▶ 話を聞く', go:'TUTORIAL_EQUIP_INSTRUCT'},
 ],
 },

 TUTORIAL_EQUIP_INSTRUCT:{
 scene:()=>NODES.TUTORIAL_INTRO.scene(),
 txt:()=>{
  const t = PC._tutorial;
  return ` <span class="gold" style="font-size:calc(var(--font-base) + 1px)">── ${t.oldNPC.name}の指南 ──</span><br><br>
  <div style="color:var(--white2);font-size:var(--font-sm);line-height:1.9">「まずは<b>武器屋・装備屋</b>で、旅の基本を揃えてくるといい。<br>
  ・防寒着と荷物袋<br>
  ・ブーツ<br>
  ・食料は30日分<br>
  ・お前さんの得物と、身を守る防具を好きに選ぶといい<br>
  これだけあれば、当面は困らんはずじゃ。<br><br>
  防寒着は、極寒の地に踏み込んだときに持っておらんと凍傷になるでな。侮ってはいかん。<br>
  背負袋がなけりゃ、持てる荷物はほんのわずかじゃ。すぐに手一杯になってしまうぞ。<br>
  ブーツやサンダルは、いざというとき素早く動くために要るもんじゃ。裸足では話にならん。<br>
  それと、町を出てしまえば食料は手に入らん。旅立つ前には必ず買い足しておくことじゃ。<br>
  ……ああ、それと。買っただけで満足するでないぞ。ちゃんと<b>装備</b>せんことには、何の意味もないでな。<br><br>
  ……なに、懐具合と相談してくれて構わんよ」</div>`;
 },
 choices:()=>{
  const shopNode = TUTORIAL_SHOP_MAP[PC._startTown] || ('SHOP_'+PC._startTown.toUpperCase());
  return [{label:' 武器屋・装備屋へ行く', fn:()=>{
   PC._pendingMsg = `<span style="color:#c0b098">「ほれほれ、油売っとらんでさっさと行ってこい」と、${PC._tutorial.oldNPC.name}に背中を押されるようにして酒場を追い出された。</span><br><br>`;
   go(NODES[shopNode] ? shopNode : 'SHOP_KHAZAN');
  }}];
 },
 },

 TUTORIAL_DELIVERY_INTRO:{
 scene:()=>NODES.TUTORIAL_INTRO.scene(),
 txt:()=>{
  const t = PC._tutorial;
  const nearName = (TOWNS[t.nearTownId]||{}).name || t.nearTownId;
  return ` <span class="gold" style="font-size:calc(var(--font-base) + 1px)">── ${t.oldNPC.name}の指南 ──</span><br><br>
  <div style="color:var(--white2);font-size:var(--font-sm);line-height:1.9">「ほう、装備は揃ったようじゃな。次は<b>旅の基本</b>を教えてやろう。<br>
  お前さんもこれから生きていくには、金を稼がにゃならん。冒険者として真っ当に暮らすなら、酒場に貼り出された依頼を受けて、その報酬をもらうのが一番じゃ。<br>
  中でも一番簡単なのが<b>宅配の依頼</b>じゃ。荷物を目的の町まで運ぶだけで、ちゃんと金になる。まずはそいつで慣らしていくとしよう。<br>
  ちょうど${nearName}まで荷を届けてほしいという者がおる。一人で行かせるのも忍びない、酒場で仲間を紹介してやろう」<br><br>
  「ひとつ言っておくがの。道中で厄介ごとに出くわすこともあるじゃろうが、たとえ二人組でも、明らかに敵わない相手だと感じたら無理はするでないぞ。<b>逃げるのも冒険者の腕のうちじゃ</b>」</div>`;
 },
 choices:[
  {label:'▶ 仲間を紹介してもらう', fn:()=>{ tutorialIntroduceEscort(); }},
 ],
 },

 TUTORIAL_DELIVERY_MEET:{
 scene:()=>NODES.TUTORIAL_INTRO.scene(),
 txt:()=>{
  const t = PC._tutorial;
  const nearName = (TOWNS[t.nearTownId]||{}).name || t.nearTownId;
  return ` <span class="gold" style="font-size:calc(var(--font-base) + 1px)">── 顔合わせ ──</span><br><br>
  <span style="color:#c0b098">${t.oldNPC.name}に連れられて、一人の旅人が現れた。</span><br><br>
  <div style="background:var(--panel);border:1px solid var(--panel2);border-radius:4px;padding:12px">
   <div style="color:#f0ece0;font-size:var(--font-sm);margin-bottom:6px"> ${t.escortNPC.name}</div>
   <div style="color:var(--white2);font-size:var(--font-sm);line-height:1.9">「よろしく頼むよ。${nearName}まで、一緒に行ってくれるんだってな。心強い」</div>
  </div>`;
 },
 choices:[
  {label:'▶ 出発する', fn:()=>{ tutorialStartDelivery(); }},
 ],
 },

 TUTORIAL_HUNT_INTRO:{
 scene:()=>NODES.TUTORIAL_INTRO.scene(),
 txt:()=>{
  const t = PC._tutorial;
  const totalTorches = (PC._torchStock||0) + (PC._torchTurns>0?1:0);
  let msg = ` <span class="gold" style="font-size:calc(var(--font-base) + 1px)">── ${t.oldNPC.name}の指南 ──</span><br><br>
  <div style="color:var(--white2);font-size:var(--font-sm);line-height:1.9">「無事に届けられたようじゃな！　次は<b>戦いの基本</b>を教えてやろう。<br>
  酒場にはさっきの宅配のような依頼だけでなく、<b>討伐依頼</b>ってのも貼り出されておる。何かしらの脅威が棲み着いた場所に乗り込んで、そいつを排除してくるって依頼じゃ。<br>
  ちょうど郊外の洞穴にゴブリンの一団が棲み着いたと聞く。わしが魔法で援護してやるから、一緒に片付けに行こうかの」</div>`;
  if(totalTorches <= 0){
   msg += `<br><div style="color:var(--white2);font-size:var(--font-sm);line-height:1.9">「おっと、待った。<b>松明</b>を持っとらんな？　洞穴の中は真っ暗じゃ。先に買っておくといい」</div>`;
  }
  return msg;
 },
 choices:()=>{
  const totalTorches = (PC._torchStock||0) + (PC._torchTurns>0?1:0);
  const ch = [];
  if(totalTorches <= 0){
   const shopNode = TUTORIAL_SHOP_MAP[PC._startTown] || ('SHOP_'+PC._startTown.toUpperCase());
   ch.push({label:' 武器屋・装備屋へ松明を買いに行く', go: NODES[shopNode] ? shopNode : 'SHOP_KHAZAN'});
  }
  ch.push({label:'▶ 討伐に同行する', fn:()=>{ tutorialStartHunt(); }});
  return ch;
 },
 },

 TUTORIAL_HUNT_1:{
 scene:'dungeon',
 txt:()=>{
  const q = _tutorialHuntQuest();
  const tBar = torchIndicator ? torchIndicator() : '';
  return `${tBar} <span style="color:#e8e0d0;font-size:var(--font-base)">討伐出撃：${q.caveName}</span><br><br>
  <span style="color:#d0c8b8">薄暗い洞穴の入り口をくぐる。奥から獣臭い風が吹いてくる。</span><br><br>
  <span style="color:#d0c8b8">目標：${q.monsterName} ×3</span>`;
 },
 choices:[
  {label:'▶ 奥へ進む', go:'TUTORIAL_HUNT_2'},
 ],
 },

 TUTORIAL_HUNT_2:{
 scene:'dungeon',
 txt:()=>{
  const q = _tutorialHuntQuest();
  const tBar = torchIndicator ? torchIndicator() : '';
  const cleared = PC._tutorialHunt2Cleared;
  return `${tBar}<span style="color:#b8a890">狭い通路を進むと、少し開けた場所に出た。</span><br><br>
  ${cleared ? `<span style="color:#b0a080">（戦闘済みだ。先へ進める。）</span>` : `<span style="color:#f0ddd8"> <b>${q.monsterName}</b>が<b>1体</b>現れた！</span>`}`;
 },
 choices:()=>{
  if(PC._tutorialHunt2Cleared) return [{label:'▶ 奥へ進む', go:'TUTORIAL_HUNT_3'}];
  const q = _tutorialHuntQuest();
  return [{label:` 戦う（${q.monsterName} ×1）`, fn:()=>{
   if(q.leaderPersonality){
    const s = document.getElementById('story');
    if(s) s.innerHTML += `<br><span style="color:#c8e0a8">${q.leaderPersonality.field}</span><br>`;
   }
   startCombat({enemies:_tutorialHuntEnemies(1), canFlee:true, isHunt:true, autoNPC:true,
    onWin:()=>{ PC._tutorialHunt2Cleared=true; },
    win:'TUTORIAL_HUNT_2', lose:'DEAD',
   });
   renderChoices([]); scrollToTop();
  }}];
 },
 },

 TUTORIAL_HUNT_3:{
 scene:'dungeon',
 txt:()=>{
  const tBar = torchIndicator ? torchIndicator() : '';
  return `${tBar}<span style="color:#b8a890">戦いの痕を越え、さらに奥へと通路が続いている。</span>`;
 },
 choices:[
  {label:'▶ 奥へ進む', go:'TUTORIAL_HUNT_4'},
 ],
 },

 TUTORIAL_HUNT_4:{
 scene:'dungeon',
 txt:()=>{
  const q = _tutorialHuntQuest();
  const tBar = torchIndicator ? torchIndicator() : '';
  const cleared = PC._tutorialHunt4Cleared;
  return `${tBar}<span style="color:#b8a890">広間に出ると、複数の気配がこちらに気づいた。</span><br><br>
  ${cleared ? `<span style="color:#b0a080">（戦闘済みだ。先へ進める。）</span>` : `<span style="color:#f0ddd8"> <b>${q.monsterName}</b>が<b>2体</b>現れた！</span>`}`;
 },
 choices:()=>{
  if(PC._tutorialHunt4Cleared) return [{label:'▶ 奥へ進む', go:'TUTORIAL_HUNT_5'}];
  const q = _tutorialHuntQuest();
  return [{label:` 戦う（${q.monsterName} ×2）`, fn:()=>{
   if(q.leaderPersonality){
    const s = document.getElementById('story');
    if(s) s.innerHTML += `<br><span style="color:#c8e0a8">${q.leaderPersonality.field}</span><br>`;
   }
   startCombat({enemies:_tutorialHuntEnemies(2), canFlee:true, isHunt:true, autoNPC:true,
    onWin:()=>{ PC._tutorialHunt4Cleared=true; },
    win:'TUTORIAL_HUNT_4', lose:'DEAD',
   });
   renderChoices([]); scrollToTop();
  }}];
 },
 },

 TUTORIAL_HUNT_5:{
 scene:'dungeon',
 txt:()=>{
  const tBar = torchIndicator ? torchIndicator() : '';
  return `${tBar} <span style="color:#e8e0d0">最奥部</span><br><br>
  <span style="color:#f0ece0"> 討伐完了！出口へ向かおう。</span>`;
 },
 choices:[
  {label:' 洞穴を出る（討伐完了）', fn:()=>{
   const q = _tutorialHuntQuest();
   delete PC._tutorialHunt2Cleared;
   delete PC._tutorialHunt4Cleared;
   huntQuestComplete(q);
  }},
 ],
 },

 TUTORIAL_FAREWELL_AFTER_HUNT:{
 scene:()=>NODES.TUTORIAL_INTRO.scene(),
 txt:()=>{
  const t = PC._tutorial;
  return ` <span class="gold" style="font-size:calc(var(--font-base) + 1px)">── 別れ ──</span><br><br>
  <div style="background:var(--panel);border:1px solid var(--panel2);border-radius:4px;padding:12px">
   <div style="color:var(--white2);font-size:var(--font-sm);line-height:1.9">「装備の揃え方、旅の仕方、戦いの基本……これでひと通り教えられたはずじゃ。<br>
   あとはお前さん次第じゃな。気長に色んなところを見て回るといい。自分なりに好きなようにやってみることじゃ。<br>
   とにかく、生き延びればチャンスはある。じゃあ元気でな」</div>
  </div><br>
  <span style="color:#c8b8a0">${t.oldNPC.name}は軽く手を挙げると、そのまま去っていった。</span>`;
 },
 choices:[
  {label:'▶ 冒険へ出発する', fn:()=>{ tutorialFinish(); }},
 ],
 },

 TUTORIAL_HOMECOMING_ASK:{
 scene:()=>NODES.TUTORIAL_INTRO.scene(),
 txt:()=>{
  const t = PC._tutorial;
  const homeName = (TOWNS[t.homeRegionTownId]||{}).name || '故郷';
  let msg = ` <span class="gold" style="font-size:calc(var(--font-base) + 1px)">── ${t.oldNPC.name}の頼み ──</span><br><br>
  <div style="color:var(--white2);font-size:var(--font-sm);line-height:1.9">「ふう……歳のせいか、近頃はどうも故郷が恋しくてな。${homeName}まで、もう一度戻ってみたいんだ。<br>
  すまんが、もう少しだけ付き合ってくれんか？　<b>地方をまたぐ長旅</b>になるが、良い経験になるはずだ」</div>`;
  if((PC._food||0) < 30){
   msg += `<br><div style="color:var(--white2);font-size:var(--font-sm);line-height:1.9">「おっと、その前に食料を見てみろ。長旅にはとても足りねぇな。ほら、これで買っておけ」</div>`;
  }
  return msg;
 },
 choices:()=>{
  const ch = [];
  if((PC._food||0) < 30){
   const shopNode = TUTORIAL_SHOP_MAP[PC._startTown] || ('SHOP_'+PC._startTown.toUpperCase());
   ch.push({label:' 75GPを受け取り、食料を買いに行く', fn:()=>{
    gainGP(75, PC);
    updateHUD();
    go(NODES[shopNode] ? shopNode : 'SHOP_KHAZAN');
   }});
  }
  ch.push({label:'▶ 同行する', fn:()=>{ tutorialStartHomecoming(); }});
  return ch;
 },
 },

 TUTORIAL_FAREWELL:{
 scene:()=>({khazan:'town_khazan',port_argon:'town_port',stonehiem:'town_stone',elsia:'town_elsia',verda:'town_village',rimholm:'town_village',marakai:'town_village',al_rashid:'town_desert_city',oasis_fort:'town_desert_village',saroon:'town_desert_village',duna:'town_desert_village',neria:'town_stone',dorua:'town_village',sarpe:'town_village',nebra:'town_village',yeldun:'town_mountain_city',frostpeak:'town_mountain_village',ashveil:'town_mountain_village'}[PC._tutorial?.homeRegionTownId]||'town_khazan'),
 txt:()=>{
  const t = PC._tutorial;
  const homeName = (TOWNS[t.homeRegionTownId]||{}).name || '故郷';
  return ` <span class="gold" style="font-size:calc(var(--font-base) + 1px)">── ${homeName}にて ──</span><br><br>
  <span style="color:#c0b098">胸いっぱいに故郷の空気を吸い込み、${t.oldNPC.name}は目を細めた。</span><br><br>
  <div style="background:var(--panel);border:1px solid var(--panel2);border-radius:4px;padding:12px">
   <div style="color:var(--white2);font-size:var(--font-sm);line-height:1.9">「ここまで付き合わせて悪かったな。装備も、旅も、戦いも、これでひと通り分かったはずだ。<br>
   お前ならもう大丈夫だろう。……達者でな」</div>
  </div><br>
  <span style="color:#c8b8a0">${t.oldNPC.name}は振り返ることなく、故郷の町へ歩いていった。</span>`;
 },
 choices:[
  {label:'▶ 冒険へ出発する', fn:()=>{ tutorialFinish(); }},
 ],
 },

 TUTORIAL_FAREWELL_NO_HOMECOMING:{
 scene:()=>NODES.TUTORIAL_INTRO.scene(),
 txt:()=>{
  const t = PC._tutorial;
  return ` <span class="gold" style="font-size:calc(var(--font-base) + 1px)">── 別れ ──</span><br><br>
  <div style="background:var(--panel);border:1px solid var(--panel2);border-radius:4px;padding:12px">
   <div style="color:var(--white2);font-size:var(--font-sm);line-height:1.9">「これでひと通り、旅の基本は教えられたはずだ。……達者でな」</div>
  </div><br>
  <span style="color:#c8b8a0">${t.oldNPC.name}はそう言って去っていった。</span>`;
 },
 choices:[
  {label:'▶ 冒険へ出発する', fn:()=>{ tutorialFinish(); }},
 ],
 },

 TOWN_KHAZAN:{
 scene:'town_khazan',
 txt:()=>{
 const t=TOWNS.khazan;
 return `<span class="gold" style="font-size:calc(var(--font-base) + 1px)"> ${t.name}</span>　<span class="dim" style="font-size:calc(var(--font-lg) + 4px)">${t.size}</span>${popTimeOfDayMsg('khazan')}<br>
 ${popWeatherMsg('khazan')}
 ${popDeliveryMsg()}<br>
 <span style="color:#c0b098">${t.desc}</span><br>${popHeroMsg()}${popInfamyMsg()}${popRegionHeroMsg()}${popRegionInfamyMsg()}${popRegionEvalMsg()}${popRaidUnitMsg()}<br>${renderTrustBadge(PC.town)}${hasProperty(PC.town)?'　<span style="color:#f0ece0"> 拠点あり</span>':''}` ;
 },
 choices:[
 {label:' 武器屋・装備屋', go:'SHOP_KHAZAN'},
 {label:' 酒場', go:'TAVERN_KHAZAN'},
 {label:' 宿屋（5GP・1日休む）', fn:()=>{
 innRest(500);
 }, go:'TOWN_KHAZAN'},
 {label:' 旅に出る（移動）', go:'TRAVEL_FROM_KHAZAN'},
 {label:' その他の行動', fn:()=>goOtherActions('khazan')},
 ]
 },

 TRAVEL_FROM_KHAZAN:{
 scene:'travel',
 txt:()=>`<span style="color:#f0ece0">カザーヌ</span>からの旅立ち<br><br>
 
 <span style="color:#c0b098">どこへ向かいますか？</span>`,
 choices:()=>makeTravelChoices(PC.town||'khazan'),
 },

 TOWN_PORT_ARGON:{
 scene:'town_port',
 txt:()=>{
 const t=TOWNS.port_argon;
 return `<span class="cyn" style="font-size:calc(var(--font-base) + 1px)"> ${t.name}</span>　<span class="dim" style="font-size:calc(var(--font-lg) + 4px)">${t.size}</span>${popTimeOfDayMsg('port_argon')}<br>
 ${popWeatherMsg('port_argon')}
 ${popDeliveryMsg()}<br>
 <span style="color:#c0b098">${t.desc}</span><br>${popHeroMsg()}${popInfamyMsg()}${popRegionHeroMsg()}${popRegionInfamyMsg()}${popRegionEvalMsg()}${popRaidUnitMsg()}<br>${renderTrustBadge(PC.town)}${hasProperty(PC.town)?'　<span style="color:#f0ece0"> 拠点あり</span>':''}` ;
 },
 choices:[
  {label:' 武器屋・装備屋', go:'SHOP_PORT'},
  {label:' 酒場', go:'TAVERN_PORT'},
  {label:' 宿屋（5GP・1日休む）', fn:()=>{ innRest(500); }, go:'TOWN_PORT_ARGON'},
  {label:' 旅に出る（移動）', go:'TRAVEL_FROM_PORT'},
  {label:' その他の行動', fn:()=>goOtherActions('port_argon')},
 ]
 },

 TRAVEL_FROM_PORT:{
 scene:'travel',
 txt:()=>`<span style="color:#ece8e0">ポート・アルゴン</span>からの旅立ち<br><br>
 
 <span style="color:#c0b098">どこへ向かいますか？</span>`,
 choices:()=>makeTravelChoices(PC.town||'port_argon'),
 },


 TOWN_STONEHIEM:{
 scene:'town_stone',
 txt:()=>{
 const t=TOWNS.stonehiem;
 return `<span style="color:#e0d8c8;font-size:calc(var(--font-base) + 1px)"> ${t.name}</span>　<span class="dim" style="font-size:calc(var(--font-lg) + 4px)">${t.size}</span>${popTimeOfDayMsg('stonehiem')}<br>
 ${popWeatherMsg('stonehiem')}
 ${popDeliveryMsg()}<br>
 <span style="color:#c0b098">${t.desc}</span><br>${popHeroMsg()}${popInfamyMsg()}${popRegionHeroMsg()}${popRegionInfamyMsg()}${popRegionEvalMsg()}${popRaidUnitMsg()}<br>${renderTrustBadge(PC.town)}${hasProperty(PC.town)?'　<span style="color:#f0ece0"> 拠点あり</span>':''}` ;
 },
 choices:[
 {label:' 武器屋・装備屋', go:'SHOP_STONE'},
 {label:' 酒場', go:'TAVERN_STONE'},
 {label:' 宿屋（3GP・1日休む）', fn:()=>{ innRest(300); }, go:'TOWN_STONEHIEM'},
 {label:' 旅に出る（移動）', go:'TRAVEL_FROM_STONE'},
 {label:' その他の行動', fn:()=>goOtherActions('stonehiem')},
 ]
 },

 // ══════════════════════════════════════════
 //  エルマリア周辺の3村
 // ══════════════════════════════════════════
 TOWN_VERDA:{
 scene:'town_village',
 txt:()=>{
 const t=TOWNS.verda;
 return `<span style="color:#f0ece0;font-size:calc(var(--font-base) + 1px)"> ${t.name}</span>　<span class="dim" style="font-size:calc(var(--font-lg) + 4px)">${t.size}</span>${popTimeOfDayMsg('verda')}<br>
 ${popWeatherMsg('verda')}
 ${popDeliveryMsg()}<br>
 <span style="color:#c0b098">${t.desc}</span><br>${popHeroMsg()}${popInfamyMsg()}${popRegionHeroMsg()}${popRegionInfamyMsg()}${popRegionEvalMsg()}${popRaidUnitMsg()}<br>${renderTrustBadge(PC.town)}${hasProperty(PC.town)?'　<span style="color:#f0ece0"> 拠点あり</span>':''}` ;
 },
 choices:[
 {label:' 道具屋', go:'SHOP_VERDA'},
 {label:' 酒場', go:'TAVERN_VERDA'},
 {label:' 宿屋（2GP・1日休む）', fn:()=>innRest(200), go:'TOWN_VERDA'},
 {label:' 旅に出る（移動）', go:'TRAVEL_FROM_VERDA'},
 {label:' その他の行動', fn:()=>goOtherActions('verda')},
 ]
 },
 TRAVEL_FROM_VERDA:{
 scene:'travel',
 txt:()=>`<span style="color:#f0ece0">ヴェルダ村</span>からの旅立ち<br><br>
 
 <span style="color:#c0b098">どこへ向かいますか？</span>`,
 choices:()=>makeTravelChoices(PC.town||'verda'),
 },
 SHOP_VERDA:{
 scene:'town_village',
 txt:()=>` <span style="color:#f0ece0">ヴェルダ村の道具屋</span><br><br>
 <span style="color:#c0b098">猟師の小屋を兼ねた店。武具は一通り揃っている。</span>`,
 choices:[
 {label:' 買い物をする', fn:()=>showIngameShop('verda'), go:'__travel__'},
 {label:'← 戻る', go:'TOWN_VERDA'},
 ],
 },
 TAVERN_VERDA:{
 scene:'town_village',
 txt:()=>{
 const board=getTavernBoard('verda');
 const _hqOffer = checkHeroQuest('verda');
 const _hqHtml = renderHeroQuestOffer('verda', _hqOffer);
 const html=renderQuestBoard('verda',board);
 const partyHtml=renderPartyStatus();
 return ` <span style="color:#f0ece0">ヴェルダの酒場</span><br><br><span style="color:#c0b098">煙でくすんだ小さな酒場。狩人たちが獲物自慢に花を咲かせている。</span><br><br>${_tavernFlavorHtml}${partyHtml}${_hqHtml}${html}`;
 },
 choices:()=>[...getQuestBoardChoices('TOWN_VERDA'), {label:' 客に話しかける', fn:()=>talkToPatron('verda')}, ...fcTavernAskChoices('verda'), {label:' 仲間を探す',go:'RECRUIT_VERDA'}],
 },

 TOWN_RIMHOLM:{
 scene:'town_village',
 txt:()=>{
 const t=TOWNS.rimholm;
 return `<span style="color:#e8e0d0;font-size:calc(var(--font-base) + 1px)"> ${t.name}</span>　<span class="dim" style="font-size:calc(var(--font-lg) + 4px)">${t.size}</span>${popTimeOfDayMsg('rimholm')}<br>
 ${popWeatherMsg('rimholm')}
 ${popDeliveryMsg()}<br>
 <span style="color:#c0b098">${t.desc}</span><br>${popHeroMsg()}${popInfamyMsg()}${popRegionHeroMsg()}${popRegionInfamyMsg()}${popRegionEvalMsg()}${popRaidUnitMsg()}<br>${renderTrustBadge(PC.town)}${hasProperty(PC.town)?'　<span style="color:#f0ece0"> 拠点あり</span>':''}` ;
 },
 choices:[
 {label:' 武具屋', go:'SHOP_RIMHOLM'},
 {label:' 酒場', go:'TAVERN_RIMHOLM'},
 {label:' 宿屋（3GP・1日休む）', fn:()=>innRest(300), go:'TOWN_RIMHOLM'},
 {label:' 旅に出る（移動）', go:'TRAVEL_FROM_RIMHOLM'},
 {label:' その他の行動', fn:()=>goOtherActions('rimholm')},
 ]
 },
 TRAVEL_FROM_RIMHOLM:{
 scene:'travel',
 txt:()=>`<span style="color:#e8e0d0">リムホルム</span>からの旅立ち<br><br>
 
 <span style="color:#c0b098">どこへ向かいますか？</span>`,
 choices:()=>makeTravelChoices(PC.town||'rimholm'),
 },
 SHOP_RIMHOLM:{
 scene:'town_village',
 txt:()=>` <span style="color:#e8e0d0">リムホルムの武具屋</span><br><br>
 <span style="color:#c0b098">遺跡探索者向けの品が充実している。古代の武具の修理もここでできる。</span>`,
 choices:[
 {label:' 買い物をする', fn:()=>showIngameShop('rimholm'), go:'__travel__'},
 {label:'← 戻る', go:'TOWN_RIMHOLM'},
 ],
 },
 TAVERN_RIMHOLM:{
 scene:'town_village',
 txt:()=>{
 const board=getTavernBoard('rimholm');
 const _hqOffer = checkHeroQuest('rimholm');
 const _hqHtml = renderHeroQuestOffer('rimholm', _hqOffer);
 const html=renderQuestBoard('rimholm',board);
 const partyHtml=renderPartyStatus();
 return ` <span style="color:#e8e0d0">リムホルムの宿場酒場</span><br><br><span style="color:#c0b098">遺跡から戻った探索者たちが泥を落としながら飲んでいる。</span><br><br>${_tavernFlavorHtml}${partyHtml}${_hqHtml}${html}`;
 },
 choices:()=>[...getQuestBoardChoices('TOWN_RIMHOLM'), {label:' 客に話しかける', fn:()=>talkToPatron('rimholm')}, ...fcTavernAskChoices('rimholm'), {label:' 仲間を探す',go:'RECRUIT_RIMHOLM'}],
 },

 TOWN_MARAKAI:{
 scene:'town_village',
 txt:()=>{
 const t=TOWNS.marakai;
 return `<span style="color:#f0ece0;font-size:calc(var(--font-base) + 1px)"> ${t.name}</span>　<span class="dim" style="font-size:calc(var(--font-lg) + 4px)">${t.size}</span>${popTimeOfDayMsg('marakai')}<br>
 ${popWeatherMsg('marakai')}
 ${popDeliveryMsg()}<br>
 <span style="color:#c0b098">${t.desc}</span><br>${popHeroMsg()}${popInfamyMsg()}${popRegionHeroMsg()}${popRegionInfamyMsg()}${popRegionEvalMsg()}${popRaidUnitMsg()}<br>${renderTrustBadge(PC.town)}${hasProperty(PC.town)?'　<span style="color:#f0ece0"> 拠点あり</span>':''}` ;
 },
 choices:[
 {label:' 武器商', go:'SHOP_MARAKAI'},
 {label:' 酒場（傭兵亭）', go:'TAVERN_MARAKAI'},
 {label:' 宿屋（3GP・1日休む）', fn:()=>innRest(300), go:'TOWN_MARAKAI'},
 {label:' 旅に出る（移動）', go:'TRAVEL_FROM_MARAKAI'},
 {label:' その他の行動', fn:()=>goOtherActions('marakai')},
 ]
 },
 TRAVEL_FROM_MARAKAI:{
 scene:'travel',
 txt:()=>`<span style="color:#f0ece0">マラカイ</span>からの旅立ち<br><br>
 
 <span style="color:#c0b098">どこへ向かいますか？</span>`,
 choices:()=>makeTravelChoices(PC.town||'marakai'),
 },
 SHOP_MARAKAI:{
 scene:'town_village',
 txt:()=>` <span style="color:#f0ece0">マラカイの武器商</span><br><br>
 <span style="color:#c0b098">交易路の要衝らしく品揃えは豊富だ。傭兵が好む実戦的な武具が多い。</span>`,
 choices:[
 {label:' 買い物をする', fn:()=>showIngameShop('marakai'), go:'__travel__'},
 {label:'← 戻る', go:'TOWN_MARAKAI'},
 ],
 },
 TAVERN_MARAKAI:{
 scene:'town_village',
 txt:()=>{
 const board=getTavernBoard('marakai');
 const _hqOffer = checkHeroQuest('marakai');
 const _hqHtml = renderHeroQuestOffer('marakai', _hqOffer);
 const html=renderQuestBoard('marakai',board);
 const partyHtml=renderPartyStatus();
 return ` <span style="color:#f0ece0">マラカイの傭兵亭</span><br><br><span style="color:#c0b098">荒くれ傭兵と商人が入り混じる賑やかな酒場。依頼の掲示板は常に埋まっている。</span><br><br>${_tavernFlavorHtml}${partyHtml}${_hqHtml}${html}`;
 },
 choices:()=>[...getQuestBoardChoices('TOWN_MARAKAI'), {label:' 客に話しかける', fn:()=>talkToPatron('marakai')}, ...fcTavernAskChoices('marakai'), {label:' 仲間を探す',go:'RECRUIT_MARAKAI'}],
 },

 // ══════════════════════════════════════════
 //  ザハラ地方（砂漠）
 // ══════════════════════════════════════════
 TOWN_AL_RASHID:{
 scene:'town_desert_city',
 txt:()=>{
 const t=TOWNS.al_rashid;
 return `<span style="color:#f0ece0;font-size:calc(var(--font-base) + 1px)"> ${t.name}</span>　<span class="dim" style="font-size:calc(var(--font-lg) + 4px)">${t.size}</span>${popTimeOfDayMsg('al_rashid')}<br>
 ${popWeatherMsg('al_rashid')}
 ${popDeliveryMsg()}<br>
 <span style="color:#c0b098">${t.desc}</span><br>${popHeroMsg()}${popInfamyMsg()}${popRegionHeroMsg()}${popRegionInfamyMsg()}${popRegionEvalMsg()}${popRaidUnitMsg()}<br>${renderTrustBadge(PC.town)}${hasProperty(PC.town)?'　<span style="color:#f0ece0"> 拠点あり</span>':''}` ;
 },
 choices:[
 {label:' 武器屋・装備屋', go:'SHOP_AL_RASHID'},
 {label:' 酒場（隊商宿）', go:'TAVERN_AL_RASHID'},
 {label:' 宿屋（5GP・1日休む）', fn:()=>innRest(500), go:'TOWN_AL_RASHID'},
 {label:' 旅に出る（移動）', go:'TRAVEL_FROM_AL_RASHID'},
 {label:' その他の行動', fn:()=>goOtherActions('al_rashid')},
 ]
 },
 TRAVEL_FROM_AL_RASHID:{
 scene:'travel',
 txt:()=>`<span style="color:#f0ece0">アル・ラシード</span>からの旅立ち<br><br>
 
 <span style="color:#c0b098">砂漠の風が旅立ちを告げる…</span>`,
 choices:()=>makeTravelChoices(PC.town||'al_rashid'),
 },
 SHOP_AL_RASHID:{
 scene:'town_desert_city',
 txt:()=>` <span style="color:#f0ece0">アル・ラシードの武器屋</span><br><br>
 <span style="color:#c0b098">隊商の拠点らしく品揃えは充実している。砂漠向けの軽装備も多い。</span>`,
 choices:[
 {label:' 買い物をする', fn:()=>showIngameShop('al_rashid'), go:'__travel__'},
 {label:'← 戻る', go:'TOWN_AL_RASHID'},
 ],
 },
 TAVERN_AL_RASHID:{
 scene:'town_desert_city',
 txt:()=>{
 const board=getTavernBoard('al_rashid');
 const _hqOffer = checkHeroQuest('al_rashid');
 const _hqHtml = renderHeroQuestOffer('al_rashid', _hqOffer);
 const _smHtml = checkSpecialMissionBoard();
 const html=renderQuestBoard('al_rashid',board);
 const partyHtml=renderPartyStatus();
 return ` <span style="color:#f0ece0">隊商宿の酒場</span><br><br><span style="color:#c0b098">砂漠を渡ってきた商人や傭兵が羊乳の酒を飲みながら情報を交換している。</span><br><br>${_tavernFlavorHtml}${partyHtml}${_smHtml}${_hqHtml}${html}`;
 },
 choices:()=>[...getQuestBoardChoices('TOWN_AL_RASHID'), {label:' 客に話しかける', fn:()=>talkToPatron('al_rashid')}, ...fcTavernAskChoices('al_rashid'), {label:' 仲間を探す',go:'RECRUIT_AL_RASHID'}],
 },

 TOWN_OASIS_FORT:{
 scene:'town_desert_village',
 txt:()=>{
 const t=TOWNS.oasis_fort;
 return `<span style="color:#f0ece0;font-size:calc(var(--font-base) + 1px)"> ${t.name}</span>　<span class="dim" style="font-size:calc(var(--font-lg) + 4px)">${t.size}</span>${popTimeOfDayMsg('oasis_fort')}<br>
 ${popWeatherMsg('oasis_fort')}
 ${popDeliveryMsg()}<br>
 <span style="color:#c0b098">${t.desc}</span><br>${popHeroMsg()}${popInfamyMsg()}${popRegionHeroMsg()}${popRegionInfamyMsg()}${popRegionEvalMsg()}${popRaidUnitMsg()}<br>${renderTrustBadge(PC.town)}${hasProperty(PC.town)?'　<span style="color:#f0ece0"> 拠点あり</span>':''}` ;
 },
 choices:[
 {label:' 道具屋', go:'SHOP_OASIS'},
 {label:' 酒場', go:'TAVERN_OASIS'},
 {label:' 宿屋（3GP・1日休む）', fn:()=>innRest(300), go:'TOWN_OASIS_FORT'},
 {label:' 旅に出る（移動）', go:'TRAVEL_FROM_OASIS'},
 {label:' その他の行動', fn:()=>goOtherActions('oasis_fort')},
 ]
 },

 ARENA_OASIS:{
 scene:'town_desert_village',
 txt:()=>{
  const count = arenaPartySize();
  const cooldown = arenaCooldownRemaining();
  return ` <span style="color:#f0ece0">オアシス砦の闘技場</span><br><br>
  <span style="color:#c0b098">砂地を丸く囲っただけの、小さな闘技場だ。地元の荒くれ者たちが腕試しに集う。</span><br><br>
  <span style="color:#e0d8c8">パーティ人数：${count}人（対戦相手も同数）</span>
  ${cooldown>0?`<br><span style="color:#e0a070">前回の興行の疲れが残っており、あと${cooldown}日は次の試合を組めないようだ。</span>`:''}`;
 },
 choices:()=>{
  const count = arenaPartySize();
  const cooldown = arenaCooldownRemaining();
  const ch = [];
  ['warrior','swordmaster'].forEach(key=>{
   const rank = ARENA_RANKS[key];
   const fee = rank.feePerPerson*count;
   const prize = rank.prizeBase*count;
   const label = ` ${rank.name}クラスに挑戦（Lv${rank.minLv}-${rank.maxLv}・参加費${fee}GP・賞金${prize}GP）${cooldown>0?`（あと${cooldown}日）`:''}`;
   ch.push({label, fn:()=>arenaChallengeRank(key, 'ARENA_OASIS', 'オアシス砦の闘技場', 'oasis_fort')});
  });
  ch.push({label:' 殿堂の石碑を見る', go:'ARENA_OASIS_MONUMENT'});
  ch.push({label:' 試合を観覧する', go:'ARENA_OASIS_WATCH_SELECT'});
  ch.push({label:'← 戻る', go:'TOWN_OASIS_FORT'});
  return ch;
 },
 },

 ARENA_OASIS_WATCH_SELECT:{
 scene:'town_desert_village',
 txt:()=>` <span style="color:#f0ece0">オアシス砦の闘技場 — 観覧席</span><br><br>
 <span style="color:#c0b098">今日はどのクラスの興行を見る？　同格同士の対戦が組まれる。</span>`,
 choices:()=>{
  const ch = ['warrior','swordmaster'].map(key=>{
   const rank = ARENA_RANKS[key];
   return {label:` ${rank.name}クラスの試合（Lv${rank.minLv}-${rank.maxLv}同士）`, fn:()=>arenaStartWatch(key, 'oasis_fort', 'ARENA_OASIS', 'オアシス砦の闘技場', 'town_desert_village')};
  });
  ch.push({label:'← 戻る', go:'ARENA_OASIS'});
  return ch;
 },
 },

 ARENA_BET_SELECT:{
 scene:()=> (_arenaWatch && _arenaWatch.scene) || 'town_desert_village',
 txt:()=>{
  const w = _arenaWatch;
  if(!w) return ` <span style="color:#f0ece0">観覧席</span><br><br><span style="color:#c0b098">……特に見るべき試合はないようだ。</span>`;
  const sizeTxt = `東軍${w.sideEast.length}名 対 西軍${w.sideWest.length}名`;
  const flavorFn = ARENA_ODDS_FLAVOR_LINES[w.oddsFlavorIdx||0];
  return ` <span style="color:#f0ece0">${w.arenaTitle} — 賭け</span><br><br>
  <span style="color:#c0b098">${flavorFn(sizeTxt, w.odds.oddsEast, w.odds.oddsWest)}</span>`;
 },
 choices:()=>{
  const w = _arenaWatch;
  if(!w) return [{label:'← 戻る', go:'ARENA_OASIS'}];
  return [
   {label:` 東軍に賭ける（配当${w.odds.oddsEast}倍）`, fn:()=>{ w._betSideChoice='east'; }, go:'ARENA_BET_AMOUNT'},
   {label:` 西軍に賭ける（配当${w.odds.oddsWest}倍）`, fn:()=>{ w._betSideChoice='west'; }, go:'ARENA_BET_AMOUNT'},
   {label:'▶ 賭けずに観戦する', go:'ARENA_WATCH_MATCH'},
  ];
 },
 },

 ARENA_BET_AMOUNT:{
 scene:()=> (_arenaWatch && _arenaWatch.scene) || 'town_desert_village',
 txt:()=>{
  const w = _arenaWatch;
  if(!w) return ` <span style="color:#f0ece0">観覧席</span><br><br><span style="color:#c0b098">……特に見るべき試合はないようだ。</span>`;
  const sideJa = w._betSideChoice==='east' ? '東軍' : '西軍';
  const odds = w._betSideChoice==='east' ? w.odds.oddsEast : w.odds.oddsWest;
  return ` <span style="color:#f0ece0">${w.arenaTitle} — 賭け</span><br><br>
  <span style="color:#c0b098">${sideJa}に賭ける。いくら賭ける？（配当${odds}倍）</span><br><br>
  <span style="color:#e0d8c8">所持金：${PC.gold||0}GP</span>`;
 },
 choices:()=>{
  const w = _arenaWatch;
  if(!w) return [{label:'← 戻る', go:'ARENA_OASIS'}];
  const ch = [];
  [10, 50, 100].forEach(amt=>{
   if((PC.gold||0) < amt) return;
   ch.push({label:` ${amt}GP賭ける`, fn:()=>arenaPlaceBet(w._betSideChoice, amt), go:'ARENA_WATCH_MATCH'});
  });
  ch.push({label:'← 陣営選択に戻る', go:'ARENA_BET_SELECT'});
  return ch;
 },
 },

 ARENA_WATCH_MATCH:{
 scene:()=> (_arenaWatch && _arenaWatch.scene) || 'town_desert_village',
 txt:()=>{
  const w = _arenaWatch;
  if(!w) return ` <span style="color:#f0ece0">観覧席</span><br><br><span style="color:#c0b098">……特に見るべき試合はないようだ。</span>`;
  const weaponDesc = n => {
   const melee = (n.equippedWeapons||[]).map(x=>x.name).join('・') || '素手';
   const ranged = n.equippedRanged ? `＋${n.equippedRanged.name}` : '';
   return melee + ranged;
  };
  const raceJa = {human:'人間',elf:'エルフ',dwarf:'ドワーフ',halfling:'ハーフリング',fairy:'フェアリー',leprechaun:'レプラコーン',troll:'トロール',ogre:'オーガ',orc:'オーク',goblin:'ゴブリン'};
  const typeJa = {warrior:'戦士',rogue:'盗賊',wizard:'魔法使い'};
  const sidePanel = (side, bg, border, barCol) => {
   const rows = side.map(n=>{
    const pct = n.maxCon>0 ? Math.max(0, n.curCon/n.maxCon*100) : 0;
    const dead = n.curCon <= 0;
    const subLabel = [raceJa[n.race]||n.race, typeJa[n.type]||n.type].filter(Boolean).join('・');
    return `<div style="margin-top:4px">
     <div class="hp-lbl" style="color:${dead?'#666':'var(--white)'}">${n.name}${subLabel?`（${subLabel}）`:''}: 体力 ${Math.max(0,n.curCon)}/${n.maxCon}</div>
     <div style="font-size:calc(var(--font-sm) - 3px);color:#c8b8a0;margin-bottom:2px">武器:${weaponDesc(n)}　防護:${calcNPCArmor(n)}</div>
     <div class="hp-bar-wrap"><div class="hp-bar-fill" style="width:${pct}%;background:${dead?'#555':barCol}"></div></div>
    </div>`;
   }).join('');
   return `<div style="flex:1;background:${bg};border:1px solid ${border};border-radius:3px;padding:6px;min-width:0">${rows}</div>`;
  };
  const panels = `<div style="display:flex;gap:6px;margin:8px 0">
   ${sidePanel(w.sideEast, 'var(--ink)', '#484848', 'linear-gradient(90deg,var(--white2),var(--white))')}
   ${sidePanel(w.sideWest, '#180808', '#6a2020', 'var(--white)')}
  </div>`;
  return ` <span style="color:#f0ece0">${w.arenaTitle} — 観覧席</span><br><br>
  <div style="display:flex;gap:6px"><div style="flex:1;text-align:center;color:#e0d8c8">東軍</div><div style="flex:1;text-align:center;color:#e0d8c8">西軍</div></div>
  ${panels}
  ${w.log.join('')}
  ${w.finished ? `<br><span style="color:#ffcc88">${w.winner==='引き分け'?'両者相打ち。':`${w.winner}軍の勝利！`}</span>${w.betResultTxt?`<br>${w.betResultTxt}`:''}` : ''}`;
 },
 choices:()=>{
  const w = _arenaWatch;
  if(!w) return [{label:'← 戻る', go:'ARENA_OASIS'}];
  const backNode = w.returnNodeId || 'ARENA_OASIS';
  if(w.finished){
   return [{label:'▶ 観覧席を後にする', fn:()=>{ _arenaWatch=null; }, go:backNode}];
  }
  return [
   {label:'▶ 次のラウンドへ', fn:()=>arenaWatchResolveRound(), go:'ARENA_WATCH_MATCH'},
   {label:'席を立つ（観戦をやめる）', fn:()=>{ _arenaWatch=null; }, go:backNode},
  ];
 },
 },

 ARENA_OASIS_MONUMENT:{
 scene:'town_desert_village',
 txt:()=>{
  const list = arenaGetHallOfFame('oasis_fort');
  const rows = list.map(e=>
   `<span style="color:${e.isPC?'#ffe0a0':'#e0d8c8'}">${e.year}年${e.month}月${e.day}日　「${e.epithet}」${e.name}${e.isPC?'（あなた）':''}</span>`
  ).join('<br>');
  return ` <span style="color:#f0ece0">殿堂の石碑</span><br><br>
  <span style="color:#c0b098">古びた石碑に、剣豪クラス以上で名を上げた者たちの名が刻まれている。</span><br><br>
  ${rows}`;
 },
 choices:[
  {label:'← 戻る', go:'ARENA_OASIS'},
 ],
 },

 ARENA_NIFURVIK:{
 scene:'town_port',
 txt:()=>{
  const count = arenaPartySize();
  const cooldown = arenaCooldownRemaining();
  return ` <span style="color:#f0ece0">ニフルヴィクの闘技場</span><br><br>
  <span style="color:#c0b098">波止場の裏手に設けられた、木组みの簡素な闘技場だ。荒くれの漁師や船乗りたちが腕試しに集う。</span><br><br>
  <span style="color:#e0d8c8">パーティ人数：${count}人（対戦相手も同数）</span>
  ${cooldown>0?`<br><span style="color:#e0a070">前回の興行の疲れが残っており、あと${cooldown}日は次の試合を組めないようだ。</span>`:''}`;
 },
 choices:()=>{
  const count = arenaPartySize();
  const cooldown = arenaCooldownRemaining();
  const ch = [];
  ['warrior','swordmaster'].forEach(key=>{
   const rank = ARENA_RANKS[key];
   const fee = rank.feePerPerson*count;
   const prize = rank.prizeBase*count;
   const label = ` ${rank.name}クラスに挑戦（Lv${rank.minLv}-${rank.maxLv}・参加費${fee}GP・賞金${prize}GP）${cooldown>0?`（あと${cooldown}日）`:''}`;
   ch.push({label, fn:()=>arenaChallengeRank(key, 'ARENA_NIFURVIK', 'ニフルヴィクの闘技場', 'nifurvik')});
  });
  ch.push({label:' 殿堂の石碑を見る', go:'ARENA_NIFURVIK_MONUMENT'});
  ch.push({label:' 試合を観覧する', go:'ARENA_NIFURVIK_WATCH_SELECT'});
  ch.push({label:'← 戻る', go:'TOWN_NIFURVIK'});
  return ch;
 },
 },

 ARENA_NIFURVIK_WATCH_SELECT:{
 scene:'town_port',
 txt:()=>` <span style="color:#f0ece0">ニフルヴィクの闘技場 — 観覧席</span><br><br>
 <span style="color:#c0b098">今日はどのクラスの興行を見る？　同格同士の対戦が組まれる。</span>`,
 choices:()=>{
  const ch = ['warrior','swordmaster'].map(key=>{
   const rank = ARENA_RANKS[key];
   return {label:` ${rank.name}クラスの試合（Lv${rank.minLv}-${rank.maxLv}同士）`, fn:()=>arenaStartWatch(key, 'nifurvik', 'ARENA_NIFURVIK', 'ニフルヴィクの闘技場', 'town_port')};
  });
  ch.push({label:'← 戻る', go:'ARENA_NIFURVIK'});
  return ch;
 },
 },

 ARENA_NIFURVIK_MONUMENT:{
 scene:'town_port',
 txt:()=>{
  const list = arenaGetHallOfFame('nifurvik');
  const rows = list.map(e=>
   `<span style="color:${e.isPC?'#ffe0a0':'#e0d8c8'}">${e.year}年${e.month}月${e.day}日　「${e.epithet}」${e.name}${e.isPC?'（あなた）':''}</span>`
  ).join('<br>');
  return ` <span style="color:#f0ece0">殿堂の石碑</span><br><br>
  <span style="color:#c0b098">古びた石碑に、剣豪クラス以上で名を上げた者たちの名が刻まれている。</span><br><br>
  ${rows}`;
 },
 choices:[
  {label:'← 戻る', go:'ARENA_NIFURVIK'},
 ],
 },

 ARENA_MARAKAI:{
 scene:'town_village',
 txt:()=>{
  const count = arenaPartySize();
  const cooldown = arenaCooldownRemaining();
  return ` <span style="color:#f0ece0">マラカイの闘技場</span><br><br>
  <span style="color:#c0b098">港の外れに設けられた、砂地の闘技場だ。密漁者や荒くれの船乗りたちが腕試しに集う。</span><br><br>
  <span style="color:#e0d8c8">パーティ人数：${count}人（対戦相手も同数）</span>
  ${cooldown>0?`<br><span style="color:#e0a070">前回の興行の疲れが残っており、あと${cooldown}日は次の試合を組めないようだ。</span>`:''}`;
 },
 choices:()=>{
  const count = arenaPartySize();
  const cooldown = arenaCooldownRemaining();
  const ch = [];
  ['warrior','swordmaster'].forEach(key=>{
   const rank = ARENA_RANKS[key];
   const fee = rank.feePerPerson*count;
   const prize = rank.prizeBase*count;
   const label = ` ${rank.name}クラスに挑戦（Lv${rank.minLv}-${rank.maxLv}・参加費${fee}GP・賞金${prize}GP）${cooldown>0?`（あと${cooldown}日）`:''}`;
   ch.push({label, fn:()=>arenaChallengeRank(key, 'ARENA_MARAKAI', 'マラカイの闘技場', 'marakai')});
  });
  ch.push({label:' 殿堂の石碑を見る', go:'ARENA_MARAKAI_MONUMENT'});
  ch.push({label:' 試合を観覧する', go:'ARENA_MARAKAI_WATCH_SELECT'});
  ch.push({label:'← 戻る', go:'TOWN_MARAKAI'});
  return ch;
 },
 },

 ARENA_MARAKAI_WATCH_SELECT:{
 scene:'town_village',
 txt:()=>` <span style="color:#f0ece0">マラカイの闘技場 — 観覧席</span><br><br>
 <span style="color:#c0b098">今日はどのクラスの興行を見る？　同格同士の対戦が組まれる。</span>`,
 choices:()=>{
  const ch = ['warrior','swordmaster'].map(key=>{
   const rank = ARENA_RANKS[key];
   return {label:` ${rank.name}クラスの試合（Lv${rank.minLv}-${rank.maxLv}同士）`, fn:()=>arenaStartWatch(key, 'marakai', 'ARENA_MARAKAI', 'マラカイの闘技場', 'town_village')};
  });
  ch.push({label:'← 戻る', go:'ARENA_MARAKAI'});
  return ch;
 },
 },

 ARENA_MARAKAI_MONUMENT:{
 scene:'town_village',
 txt:()=>{
  const list = arenaGetHallOfFame('marakai');
  const rows = list.map(e=>
   `<span style="color:${e.isPC?'#ffe0a0':'#e0d8c8'}">${e.year}年${e.month}月${e.day}日　「${e.epithet}」${e.name}${e.isPC?'（あなた）':''}</span>`
  ).join('<br>');
  return ` <span style="color:#f0ece0">殿堂の石碑</span><br><br>
  <span style="color:#c0b098">古びた石碑に、剣豪クラス以上で名を上げた者たちの名が刻まれている。</span><br><br>
  ${rows}`;
 },
 choices:[
  {label:'← 戻る', go:'ARENA_MARAKAI'},
 ],
 },

 ARENA_ASHVEIL:{
 scene:'town_mountain_village',
 txt:()=>{
  const count = arenaPartySize();
  const cooldown = arenaCooldownRemaining();
  return ` <span style="color:#f0ece0">アッシュヴェイルの闘技場</span><br><br>
  <span style="color:#c0b098">灰にまみれた岩場を丸く囲っただけの、簡素な闘技場だ。過酷な労働に鍛えられた者たちが腕試しに集う。</span><br><br>
  <span style="color:#e0d8c8">パーティ人数：${count}人（対戦相手も同数）</span>
  ${cooldown>0?`<br><span style="color:#e0a070">前回の興行の疲れが残っており、あと${cooldown}日は次の試合を組めないようだ。</span>`:''}`;
 },
 choices:()=>{
  const count = arenaPartySize();
  const cooldown = arenaCooldownRemaining();
  const ch = [];
  ['warrior','swordmaster'].forEach(key=>{
   const rank = ARENA_RANKS[key];
   const fee = rank.feePerPerson*count;
   const prize = rank.prizeBase*count;
   const label = ` ${rank.name}クラスに挑戦（Lv${rank.minLv}-${rank.maxLv}・参加費${fee}GP・賞金${prize}GP）${cooldown>0?`（あと${cooldown}日）`:''}`;
   ch.push({label, fn:()=>arenaChallengeRank(key, 'ARENA_ASHVEIL', 'アッシュヴェイルの闘技場', 'ashveil')});
  });
  ch.push({label:' 殿堂の石碑を見る', go:'ARENA_ASHVEIL_MONUMENT'});
  ch.push({label:' 試合を観覧する', go:'ARENA_ASHVEIL_WATCH_SELECT'});
  ch.push({label:'← 戻る', go:'TOWN_ASHVEIL'});
  return ch;
 },
 },

 ARENA_ASHVEIL_WATCH_SELECT:{
 scene:'town_mountain_village',
 txt:()=>` <span style="color:#f0ece0">アッシュヴェイルの闘技場 — 観覧席</span><br><br>
 <span style="color:#c0b098">今日はどのクラスの興行を見る？　同格同士の対戦が組まれる。</span>`,
 choices:()=>{
  const ch = ['warrior','swordmaster'].map(key=>{
   const rank = ARENA_RANKS[key];
   return {label:` ${rank.name}クラスの試合（Lv${rank.minLv}-${rank.maxLv}同士）`, fn:()=>arenaStartWatch(key, 'ashveil', 'ARENA_ASHVEIL', 'アッシュヴェイルの闘技場', 'town_mountain_village')};
  });
  ch.push({label:'← 戻る', go:'ARENA_ASHVEIL'});
  return ch;
 },
 },

 ARENA_ASHVEIL_MONUMENT:{
 scene:'town_mountain_village',
 txt:()=>{
  const list = arenaGetHallOfFame('ashveil');
  const rows = list.map(e=>
   `<span style="color:${e.isPC?'#ffe0a0':'#e0d8c8'}">${e.year}年${e.month}月${e.day}日　「${e.epithet}」${e.name}${e.isPC?'（あなた）':''}</span>`
  ).join('<br>');
  return ` <span style="color:#f0ece0">殿堂の石碑</span><br><br>
  <span style="color:#c0b098">古びた石碑に、剣豪クラス以上で名を上げた者たちの名が刻まれている。</span><br><br>
  ${rows}`;
 },
 choices:[
  {label:'← 戻る', go:'ARENA_ASHVEIL'},
 ],
 },

 // ══════════════════════════════════════════
 // 中規模闘技場（アル・ラシード／エルシア／イェルダン／ヴァルドヘイム）
 // 現時点では観戦のみ。挑戦は未実装。
 // ══════════════════════════════════════════
 ARENA_AL_RASHID:{
 scene:'town_desert_city',
 txt:()=>{
  const recommended = !!(PC._arenaRecommended||{}).al_rashid;
  return ` <span style="color:#f0ece0">アル・ラシードの闘技場</span><br><br>
  <span style="color:#c0b098">石造りの観客席を備えた、地方でも有数の闘技場だ。剣豪クラスからチャンピオンクラスまでの猛者が名を連ねる。</span><br><br>
  ${recommended ? '' : '<span style="color:#c8b8a0">（現在は観戦のみ受け付けている）</span>'}`;
 },
 choices:()=>{
  const recommended = !!(PC._arenaRecommended||{}).al_rashid;
  const ch = [];
  if(recommended){
   const cooldown = arenaCooldownRemaining();
   const count = arenaPartySize();
   ['swordmaster','hero','champion'].forEach(key=>{
    const rank = ARENA_RANKS[key];
    const fee = rank.feePerPerson*count;
    const prize = rank.prizeBase*count;
    ch.push({label:` ${rank.name}クラスに挑戦（Lv${rank.minLv}-${rank.maxLv}・参加費${fee}GP・賞金${prize}GP）${cooldown>0?`（あと${cooldown}日）`:''}`, fn:()=>arenaChallengeRank(key, 'ARENA_AL_RASHID', 'アル・ラシードの闘技場', 'al_rashid')});
   });
  }
  ch.push({label:' 殿堂の石碑を見る', go:'ARENA_AL_RASHID_MONUMENT'});
  ch.push({label:' 試合を観覧する', go:'ARENA_AL_RASHID_WATCH_SELECT'});
  ch.push({label:'← 戻る', go:'TOWN_AL_RASHID'});
  return ch;
 },
 },
 ARENA_AL_RASHID_WATCH_SELECT:{
 scene:'town_desert_city',
 txt:()=>` <span style="color:#f0ece0">アル・ラシードの闘技場 — 観覧席</span><br><br>
 <span style="color:#c0b098">今日はどのクラスの興行を見る？　同格同士の対戦が組まれる。</span>`,
 choices:()=>{
  const ch = ['swordmaster','hero','champion'].map(key=>{
   const rank = ARENA_RANKS[key];
   return {label:` ${rank.name}クラスの試合（Lv${rank.minLv}-${rank.maxLv}同士）`, fn:()=>arenaStartWatch(key, 'al_rashid', 'ARENA_AL_RASHID', 'アル・ラシードの闘技場', 'town_desert_city')};
  });
  ch.push({label:'← 戻る', go:'ARENA_AL_RASHID'});
  return ch;
 },
 },
 ARENA_AL_RASHID_MONUMENT:{
 scene:'town_desert_city',
 txt:()=>{
  const list = arenaGetHallOfFame('al_rashid');
  const rows = list.map(e=>
   `<span style="color:${e.isPC?'#ffe0a0':'#e0d8c8'}">${e.year}年${e.month}月${e.day}日　「${e.epithet}」${e.name}${e.isPC?'（あなた）':''}</span>`
  ).join('<br>');
  return ` <span style="color:#f0ece0">殿堂の石碑</span><br><br>
  <span style="color:#c0b098">壮麗な石碑に、剣豪クラス以上で名を上げた者たちの名が刻まれている。</span><br><br>
  ${rows}`;
 },
 choices:[
  {label:'← 戻る', go:'ARENA_AL_RASHID'},
 ],
 },

 ARENA_ELSIA:{
 scene:'town_elsia',
 txt:()=>{
  const recommended = !!(PC._arenaRecommended||{}).elsia;
  return ` <span style="color:#f0ece0">エルシアの闘技場</span><br><br>
  <span style="color:#c0b098">木々に囲まれた円形の闘技場だ。剣豪クラスからチャンピオンクラスまでの猛者が名を連ねる。</span><br><br>
  ${recommended ? '' : '<span style="color:#c8b8a0">（現在は観戦のみ受け付けている）</span>'}`;
 },
 choices:()=>{
  const recommended = !!(PC._arenaRecommended||{}).elsia;
  const ch = [];
  if(recommended){
   const cooldown = arenaCooldownRemaining();
   const count = arenaPartySize();
   ['swordmaster','hero','champion'].forEach(key=>{
    const rank = ARENA_RANKS[key];
    const fee = rank.feePerPerson*count;
    const prize = rank.prizeBase*count;
    ch.push({label:` ${rank.name}クラスに挑戦（Lv${rank.minLv}-${rank.maxLv}・参加費${fee}GP・賞金${prize}GP）${cooldown>0?`（あと${cooldown}日）`:''}`, fn:()=>arenaChallengeRank(key, 'ARENA_ELSIA', 'エルシアの闘技場', 'elsia')});
   });
  }
  ch.push({label:' 殿堂の石碑を見る', go:'ARENA_ELSIA_MONUMENT'});
  ch.push({label:' 試合を観覧する', go:'ARENA_ELSIA_WATCH_SELECT'});
  ch.push({label:'← 戻る', go:'TOWN_ELSIA'});
  return ch;
 },
 },
 ARENA_ELSIA_WATCH_SELECT:{
 scene:'town_elsia',
 txt:()=>` <span style="color:#f0ece0">エルシアの闘技場 — 観覧席</span><br><br>
 <span style="color:#c0b098">今日はどのクラスの興行を見る？　同格同士の対戦が組まれる。</span>`,
 choices:()=>{
  const ch = ['swordmaster','hero','champion'].map(key=>{
   const rank = ARENA_RANKS[key];
   return {label:` ${rank.name}クラスの試合（Lv${rank.minLv}-${rank.maxLv}同士）`, fn:()=>arenaStartWatch(key, 'elsia', 'ARENA_ELSIA', 'エルシアの闘技場', 'town_elsia')};
  });
  ch.push({label:'← 戻る', go:'ARENA_ELSIA'});
  return ch;
 },
 },
 ARENA_ELSIA_MONUMENT:{
 scene:'town_elsia',
 txt:()=>{
  const list = arenaGetHallOfFame('elsia');
  const rows = list.map(e=>
   `<span style="color:${e.isPC?'#ffe0a0':'#e0d8c8'}">${e.year}年${e.month}月${e.day}日　「${e.epithet}」${e.name}${e.isPC?'（あなた）':''}</span>`
  ).join('<br>');
  return ` <span style="color:#f0ece0">殿堂の石碑</span><br><br>
  <span style="color:#c0b098">木漏れ日の差す石碑に、剣豪クラス以上で名を上げた者たちの名が刻まれている。</span><br><br>
  ${rows}`;
 },
 choices:[
  {label:'← 戻る', go:'ARENA_ELSIA'},
 ],
 },

 ARENA_YELDUN:{
 scene:'town_mountain_city',
 txt:()=>{
  const recommended = !!(PC._arenaRecommended||{}).yeldun;
  return ` <span style="color:#f0ece0">イェルダンの闘技場</span><br><br>
  <span style="color:#c0b098">山肌を削って作られた岩造りの闘技場だ。剣豪クラスからチャンピオンクラスまでの猛者が名を連ねる。</span><br><br>
  ${recommended ? '' : '<span style="color:#c8b8a0">（現在は観戦のみ受け付けている）</span>'}`;
 },
 choices:()=>{
  const recommended = !!(PC._arenaRecommended||{}).yeldun;
  const ch = [];
  if(recommended){
   const cooldown = arenaCooldownRemaining();
   const count = arenaPartySize();
   ['swordmaster','hero','champion'].forEach(key=>{
    const rank = ARENA_RANKS[key];
    const fee = rank.feePerPerson*count;
    const prize = rank.prizeBase*count;
    ch.push({label:` ${rank.name}クラスに挑戦（Lv${rank.minLv}-${rank.maxLv}・参加費${fee}GP・賞金${prize}GP）${cooldown>0?`（あと${cooldown}日）`:''}`, fn:()=>arenaChallengeRank(key, 'ARENA_YELDUN', 'イェルダンの闘技場', 'yeldun')});
   });
  }
  ch.push({label:' 殿堂の石碑を見る', go:'ARENA_YELDUN_MONUMENT'});
  ch.push({label:' 試合を観覧する', go:'ARENA_YELDUN_WATCH_SELECT'});
  ch.push({label:'← 戻る', go:'TOWN_YELDUN'});
  return ch;
 },
 },
 ARENA_YELDUN_WATCH_SELECT:{
 scene:'town_mountain_city',
 txt:()=>` <span style="color:#f0ece0">イェルダンの闘技場 — 観覧席</span><br><br>
 <span style="color:#c0b098">今日はどのクラスの興行を見る？　同格同士の対戦が組まれる。</span>`,
 choices:()=>{
  const ch = ['swordmaster','hero','champion'].map(key=>{
   const rank = ARENA_RANKS[key];
   return {label:` ${rank.name}クラスの試合（Lv${rank.minLv}-${rank.maxLv}同士）`, fn:()=>arenaStartWatch(key, 'yeldun', 'ARENA_YELDUN', 'イェルダンの闘技場', 'town_mountain_city')};
  });
  ch.push({label:'← 戻る', go:'ARENA_YELDUN'});
  return ch;
 },
 },
 ARENA_YELDUN_MONUMENT:{
 scene:'town_mountain_city',
 txt:()=>{
  const list = arenaGetHallOfFame('yeldun');
  const rows = list.map(e=>
   `<span style="color:${e.isPC?'#ffe0a0':'#e0d8c8'}">${e.year}年${e.month}月${e.day}日　「${e.epithet}」${e.name}${e.isPC?'（あなた）':''}</span>`
  ).join('<br>');
  return ` <span style="color:#f0ece0">殿堂の石碑</span><br><br>
  <span style="color:#c0b098">岩肌を削った石碑に、剣豪クラス以上で名を上げた者たちの名が刻まれている。</span><br><br>
  ${rows}`;
 },
 choices:[
  {label:'← 戻る', go:'ARENA_YELDUN'},
 ],
 },

 ARENA_VALDHEIM:{
 scene:'town_stone',
 txt:()=>{
  const recommended = !!(PC._arenaRecommended||{}).valdheim;
  return ` <span style="color:#f0ece0">ヴァルドヘイムの闘技場</span><br><br>
  <span style="color:#c0b098">石造りの重厚な闘技場だ。剣豪クラスからチャンピオンクラスまでの猛者が名を連ねる。</span><br><br>
  ${recommended ? '' : '<span style="color:#c8b8a0">（現在は観戦のみ受け付けている）</span>'}`;
 },
 choices:()=>{
  const recommended = !!(PC._arenaRecommended||{}).valdheim;
  const ch = [];
  if(recommended){
   const cooldown = arenaCooldownRemaining();
   const count = arenaPartySize();
   ['swordmaster','hero','champion'].forEach(key=>{
    const rank = ARENA_RANKS[key];
    const fee = rank.feePerPerson*count;
    const prize = rank.prizeBase*count;
    ch.push({label:` ${rank.name}クラスに挑戦（Lv${rank.minLv}-${rank.maxLv}・参加費${fee}GP・賞金${prize}GP）${cooldown>0?`（あと${cooldown}日）`:''}`, fn:()=>arenaChallengeRank(key, 'ARENA_VALDHEIM', 'ヴァルドヘイムの闘技場', 'valdheim')});
   });
  }
  ch.push({label:' 殿堂の石碑を見る', go:'ARENA_VALDHEIM_MONUMENT'});
  ch.push({label:' 試合を観覧する', go:'ARENA_VALDHEIM_WATCH_SELECT'});
  ch.push({label:'← 戻る', go:'TOWN_VALDHEIM'});
  return ch;
 },
 },
 ARENA_VALDHEIM_WATCH_SELECT:{
 scene:'town_stone',
 txt:()=>` <span style="color:#f0ece0">ヴァルドヘイムの闘技場 — 観覧席</span><br><br>
 <span style="color:#c0b098">今日はどのクラスの興行を見る？　同格同士の対戦が組まれる。</span>`,
 choices:()=>{
  const ch = ['swordmaster','hero','champion'].map(key=>{
   const rank = ARENA_RANKS[key];
   return {label:` ${rank.name}クラスの試合（Lv${rank.minLv}-${rank.maxLv}同士）`, fn:()=>arenaStartWatch(key, 'valdheim', 'ARENA_VALDHEIM', 'ヴァルドヘイムの闘技場', 'town_stone')};
  });
  ch.push({label:'← 戻る', go:'ARENA_VALDHEIM'});
  return ch;
 },
 },
 ARENA_VALDHEIM_MONUMENT:{
 scene:'town_stone',
 txt:()=>{
  const list = arenaGetHallOfFame('valdheim');
  const rows = list.map(e=>
   `<span style="color:${e.isPC?'#ffe0a0':'#e0d8c8'}">${e.year}年${e.month}月${e.day}日　「${e.epithet}」${e.name}${e.isPC?'（あなた）':''}</span>`
  ).join('<br>');
  return ` <span style="color:#f0ece0">殿堂の石碑</span><br><br>
  <span style="color:#c0b098">重厚な石碑に、剣豪クラス以上で名を上げた者たちの名が刻まれている。</span><br><br>
  ${rows}`;
 },
 choices:[
  {label:'← 戻る', go:'ARENA_VALDHEIM'},
 ],
 },

 // ══════════════════════════════════════════
 // 大規模闘技場（カザーヌ）
 // 中規模闘技場（アル・ラシード等）のいずれかで最高ランクの5連勝を達成すると挑戦可能になる
 // ══════════════════════════════════════════
 ARENA_KHAZAN:{
 scene:'town_khazan',
 txt:()=>{
  const recommended = !!(PC._arenaRecommended||{}).khazan;
  return ` <span style="color:#f0ece0">カザーヌの大闘技場</span><br><br>
  <span style="color:#c0b098">王都にふさわしい、幾重もの観客席を持つ壮大な大闘技場だ。剣豪クラスからロードクラスまで、各地の猛者が名を連ねる。</span><br><br>
  ${recommended ? '' : '<span style="color:#c8b8a0">（現在は観戦のみ受け付けている）</span>'}`;
 },
 choices:()=>{
  const recommended = !!(PC._arenaRecommended||{}).khazan;
  const ch = [];
  if(recommended){
   const cooldown = arenaCooldownRemaining();
   const count = arenaPartySize();
   ['swordmaster','hero','champion','grandhero','lord'].forEach(key=>{
    const rank = ARENA_RANKS[key];
    const fee = rank.feePerPerson*count;
    const prize = rank.prizeBase*count;
    ch.push({label:` ${rank.name}クラスに挑戦（Lv${rank.minLv}-${rank.maxLv}・参加費${fee}GP・賞金${prize}GP）${cooldown>0?`（あと${cooldown}日）`:''}`, fn:()=>arenaChallengeRank(key, 'ARENA_KHAZAN', 'カザーヌの大闘技場', 'khazan')});
   });
  }
  ch.push({label:' 殿堂の石碑を見る', go:'ARENA_KHAZAN_MONUMENT'});
  ch.push({label:' 試合を観覧する', go:'ARENA_KHAZAN_WATCH_SELECT'});
  ch.push({label:'← 戻る', go:'TOWN_KHAZAN'});
  return ch;
 },
 },
 ARENA_KHAZAN_WATCH_SELECT:{
 scene:'town_khazan',
 txt:()=>` <span style="color:#f0ece0">カザーヌの大闘技場 — 観覧席</span><br><br>
 <span style="color:#c0b098">今日はどのクラスの興行を見る？　同格同士の対戦が組まれる。</span>`,
 choices:()=>{
  const ch = ['swordmaster','hero','champion','grandhero','lord'].map(key=>{
   const rank = ARENA_RANKS[key];
   return {label:` ${rank.name}クラスの試合（Lv${rank.minLv}-${rank.maxLv}同士）`, fn:()=>arenaStartWatch(key, 'khazan', 'ARENA_KHAZAN', 'カザーヌの大闘技場', 'town_khazan')};
  });
  ch.push({label:'← 戻る', go:'ARENA_KHAZAN'});
  return ch;
 },
 },
 ARENA_KHAZAN_MONUMENT:{
 scene:'town_khazan',
 txt:()=>{
  const list = arenaGetHallOfFame('khazan');
  const rows = list.map(e=>
   `<span style="color:${e.isPC?'#ffe0a0':'#e0d8c8'}">${e.year}年${e.month}月${e.day}日　「${e.epithet}」${e.name}${e.isPC?'（あなた）':''}</span>`
  ).join('<br>');
  return ` <span style="color:#f0ece0">殿堂の石碑</span><br><br>
  <span style="color:#c0b098">王都の威信を示す巨大な石碑に、剣豪クラス以上で名を上げた者たちの名が刻まれている。</span><br><br>
  ${rows}`;
 },
 choices:[
  {label:'← 戻る', go:'ARENA_KHAZAN'},
 ],
 },

 TRAVEL_FROM_OASIS:{
 scene:'travel',
 txt:()=>`<span style="color:#f0ece0">オアシス砦</span>からの旅立ち<br><br>
 
 <span style="color:#c0b098">どこへ向かいますか？</span>`,
 choices:()=>makeTravelChoices(PC.town||'oasis_fort'),
 },
 SHOP_OASIS:{
 scene:'town_desert_village',
 txt:()=>` <span style="color:#f0ece0">オアシス砦の道具屋</span><br><br>
 <span style="color:#c0b098">水と食料の補給が何より重要なここでは、旅の必需品が揃っている。</span>`,
 choices:[
 {label:' 買い物をする', fn:()=>showIngameShop('oasis_fort'), go:'__travel__'},
 {label:'← 戻る', go:'TOWN_OASIS_FORT'},
 ],
 },
 TAVERN_OASIS:{
 scene:'town_desert_village',
 txt:()=>{
 const board=getTavernBoard('oasis_fort');
 const _hqOffer = checkHeroQuest('oasis_fort');
 const _hqHtml = renderHeroQuestOffer('oasis_fort', _hqOffer);
 const html=renderQuestBoard('oasis_fort',board);
 const partyHtml=renderPartyStatus();
 return ` <span style="color:#f0ece0">砦の休憩所</span><br><br><span style="color:#c0b098">砂漠の旅人たちが水を飲みながら憩う場所。傭兵と商人が混在している。</span><br><br>${_tavernFlavorHtml}${partyHtml}${_hqHtml}${html}`;
 },
 choices:()=>[...getQuestBoardChoices('TOWN_OASIS_FORT'), {label:' 客に話しかける', fn:()=>talkToPatron('oasis_fort')}, ...fcTavernAskChoices('oasis_fort'), {label:' 仲間を探す',go:'RECRUIT_OASIS'}],
 },

 TOWN_SAROON:{
 scene:'town_desert_village',
 txt:()=>{
 const t=TOWNS.saroon;
 return `<span style="color:#e8e0d0;font-size:calc(var(--font-base) + 1px)"> ${t.name}</span>　<span class="dim" style="font-size:calc(var(--font-lg) + 4px)">${t.size}</span>${popTimeOfDayMsg('saroon')}<br>
 ${popWeatherMsg('saroon')}
 ${popDeliveryMsg()}<br>
 <span style="color:#c0b098">${t.desc}</span><br>${popHeroMsg()}${popInfamyMsg()}${popRegionHeroMsg()}${popRegionInfamyMsg()}${popRegionEvalMsg()}${popRaidUnitMsg()}<br>${renderTrustBadge(PC.town)}${hasProperty(PC.town)?'　<span style="color:#f0ece0"> 拠点あり</span>':''}` ;
 },
 choices:[
 {label:' 道具屋', go:'SHOP_SAROON'},
 {label:' 酒場', go:'TAVERN_SAROON'},
 {label:' 宿屋（2GP・1日休む）', fn:()=>innRest(200), go:'TOWN_SAROON'},
 {label:' 旅に出る（移動）', go:'TRAVEL_FROM_SAROON'},
 {label:' その他の行動', fn:()=>goOtherActions('saroon')},
 ]
 },
 TRAVEL_FROM_SAROON:{
 scene:'travel',
 txt:()=>`<span style="color:#e8e0d0">サルーン</span>からの旅立ち<br><br>
 
 <span style="color:#c0b098">どこへ向かいますか？</span>`,
 choices:()=>makeTravelChoices(PC.town||'saroon'),
 },
 SHOP_SAROON:{
 scene:'town_desert_village',
 txt:()=>` <span style="color:#e8e0d0">サルーンの道具屋</span><br><br>
 <span style="color:#c0b098">鉱夫向けの実用的な品が中心。基本的な武具は一通り揃っている。</span>`,
 choices:[
 {label:' 買い物をする', fn:()=>showIngameShop('saroon'), go:'__travel__'},
 {label:'← 戻る', go:'TOWN_SAROON'},
 ],
 },
 TAVERN_SAROON:{
 scene:'town_desert_village',
 txt:()=>{
 const board=getTavernBoard('saroon');
 const _hqOffer = checkHeroQuest('saroon');
 const _hqHtml = renderHeroQuestOffer('saroon', _hqOffer);
 const html=renderQuestBoard('saroon',board);
 const partyHtml=renderPartyStatus();
 return ` <span style="color:#e8e0d0">鉱夫の酒場</span><br><br><span style="color:#c0b098">砂と岩塩で白くなった鉱夫たちが一日の疲れを癒している。</span><br><br>${_tavernFlavorHtml}${partyHtml}${_hqHtml}${html}`;
 },
 choices:()=>[...getQuestBoardChoices('TOWN_SAROON'), {label:' 客に話しかける', fn:()=>talkToPatron('saroon')}, ...fcTavernAskChoices('saroon'), {label:' 仲間を探す',go:'RECRUIT_SAROON'}],
 },


 // ══════════════════════════════════════════
 //  砂漠ダンジョン「ザハラの封印廟」(拡張版・18室)
 // デュナ近郊の岩場に埋もれた古代砂漠王の廟
 // 扉6種: Arch/Door/Locked/Trapped/Secret/Portcullis
 // ══════════════════════════════════════════

 TOMB_ENTRANCE:{
 scene:'dungeon',
 txt:()=>{
 const torches = countTorches();
 const torchMsg = torches > 0
 ? `<span style="color:#e8e4d8"> 松明を ${torches}本 持っている。</span>`
 : `<span class="red"> 松明を持っていない！暗闇の中を進むことになる。</span>`;
 return ` <span class="gold" style="font-size:var(--font-base)">古代砂漠廟「ザハラの封印廟」</span><br><br>
 デュナから半日ほど砂漠を歩いた岩場の奥。砂に半ば飲まれた石造りの入口がある。<br>
 砂岩に刻まれた守護神の像が左右に立ち、その間に熱気の滲む闇が広がっている。<br>
 砂漠の乾いた風が内部から吹き出し、香辛料と埃の匂いが漂う。<br><br>
 ${torchMsg}<br>
 <span style="color:#c0b098">入口の石板には古代ザハラ語で「封印を解く者よ、試練を越えよ」と刻まれている。</span>`;
 },
 choices:[
 {label:' 中に入る', fn:()=>initTorch(), go:'TOMB_1'},
 {label:'← デュナへ戻る', go:'TOWN_DUNA'},
 ],
 },

 TOMB_DARK_ESCAPE:{
 scene:'dungeon',
 txt:()=>`<span style="color:#e0d0d0"> 松明が切れた！</span><br><br>
 <span style="color:var(--white2)">完全な暗闇の中、壁を手探りで進む。出口まで帰り着けるか……</span>`,
 choices:()=>[{label:' 暗闇の中を出口へ向かう（運 Lv3 能力値テスト）', fn:()=>{
  setupSavingRoll({
   attr:'lk', level:3,
   onSuccess:()=>{
    const s = document.getElementById('story');
    s.innerHTML = `<span style="color:#f0ece0"></span><br><br>
     砂岩の壁を伝いながら必死に出口を探した。砂漠の熱気が強まる方向を頼りに、やっと入口へたどり着いた！`;
    renderChoices([{label:' 砂漠の光の方へ', go:'TOMB_ENTRANCE'}]);
    scrollToTop();
   },
   onFail:()=>{
    const dmg = 5;
    PC.con = Math.max(0, PC.con - dmg); updateHUD();
    const s = document.getElementById('story');
    if(PC.con <= 0){
     s.innerHTML = `<span style="color:#f0ece0"></span><br><br>砂の床に足を取られ倒れ込んだ。動けない……`;
     renderChoices([{label:'…（力尽きた）', go:'DEAD'}]);
    } else {
     s.innerHTML = `<span style="color:#f0ece0"></span><br><br>砂の段差に気づかず転倒した。砂岩に激しく打ちつける。<br><br>体力-${dmg}（残り${PC.con}）<br><br>痛みをこらえながら、また出口を探す…`;
     renderChoices([{label:' もう一度出口を探す（運 Lv3 能力値テスト）', go:'TOMB_DARK_ESCAPE'}]);
    }
    scrollToTop();
   },
  });
 }}],
 },

 // ── 1: 玄関の間（ROOM 1）── Arch入口
 TOMB_1:{
 scene:'dungeon',
 txt:`<span style="color:#f0ece0"></span><br><br>
 砂岩造りの高い天井に守護神の像が連なる。壁には色褪せた壁画が描かれ、かつての栄華を伝えている。<br>
 床には細かい砂が積もり、踏み込むたびに足跡が残る。<br><br>
 <span style="color:#c0b098">━ 出口: 北（入口）　東　南 ━</span>`,
 choices:[
 {label:' 東の扉', go:'TOMB_DOOR_12'},
 {label:'⬇ 南の錠前扉', go:'TOMB_LOCK_13'},
 {label:'⬆ 北（入口）へ', go:'TOMB_ENTRANCE'},
 ],
 },

 // ─ Door between 1-2 ─
 TOMB_DOOR_12:{
 scene:'dungeon',
 txt:`<span style="color:#f0ece0"></span>　<span style="color:#e0d8c8">── Door ──</span><br><br>
 砂岩を彫り抜いた重い扉。守護神の浮き彫りが施されているが、押せばすんなり開いた。`,
 choices:[
 {label:' 東へ進む', go:'TOMB_2'},
 {label:'⬅ 西へ進む', go:'TOMB_1'},
 ],
 },

 // ─ Locked between 1-3 ─
 TOMB_LOCK_13:{
 scene:'dungeon',
 txt:()=>{
 if(PC._tombLock13Open) return `<span style="color:#f0ece0"></span>　<span style="color:#ffcc44">── Locked ──</span><br><br>
 先ほど解錠した扉が開いている。`;
 return `<span style="color:#f0ece0"></span>　<span style="color:#ffcc44">── Locked ──</span><br><br>
 頑丈な錠前がかかった砂岩の石扉だ。鍵穴は細く精巧で、巧みに操作すれば開けられそうだ。<br>
 <span style="color:#c0b098">（器用さ Lv2 能力値テスト）</span>`;
 },

 spellContext:'ザール・カノン廟の錠前扉（1-3）',
 spellEffects:{
  knockKnock:{ desc:'魔法で錠前を開錠する',
   fn:()=>{ PC._tombLock13Open=true; return ' Knock Knock！錠前が弾け飛んだ。扉が開く！'; }},
 }, choices:()=>PC._tombLock13Open
 ? [{label:'⬇ 南へ進む', go:'TOMB_3'},{label:'⬆ 北へ進む', go:'TOMB_1'}]
 : [{label:' 解錠を試みる', go:'TOMB_LOCK_13_TRY'},{label:'⬆ 北へ進む', go:'TOMB_1'}],
 },
 TOMB_LOCK_13_TRY:{
 scene:'dungeon',
 txt:`<span style="color:#f0ece0"></span><br><br>
 細い石片で錠前を操作する。誰が挑みますか？`,
 choices:()=>{
  if(PC._tombLock13Open) return [{label:'⬇ 南へ進む', go:'TOMB_3'},{label:'⬆ 北へ進む', go:'TOMB_1'}];
  return [{label:' 解錠を試みる', fn:()=>selectActorForSR('dex',2,actor=>{
   setupSavingRollFor(actor,{attr:'dex',level:2,
    onSuccess(){
     const an=actor===PC?PC.name:actor.name;
     PC._tombLock13Open=true;
     document.getElementById('story').innerHTML+=`<div style="color:#f0ece0;margin-top:8px">${an}：カチリと音がして扉が開いた。</div>`;
     setTimeout(()=>go('TOMB_LOCK_13'),600);
    },
    onFail(){
     const dmg=1+Math.floor(Math.random()*3);
     const target=actor===PC?PC:actor; target.con=Math.max(1,target.con-dmg);
     const an=actor===PC?PC.name:actor.name;
     document.getElementById('story').innerHTML+=`<div style="color:#f0ddd8;margin-top:8px">${an}：仕掛けが弾けて手を傷つけた。体力-${dmg}</div>`;
     updateHUD(); setTimeout(()=>go('TOMB_LOCK_13_TRY'),600);
    },
   });
  })},{label:'⬆ 北へ進む', go:'TOMB_1'}];
 },
 },

 // ── 2: 碑文の間（ROOM 2）
 TOMB_2:{
 scene:'dungeon',
 txt:`<span style="color:#f0ece0"></span><br><br>
 四方の壁すべてに古代ザハラ語の碑文が刻まれている。戦いの記録か、あるいは呪文の一種か。<br>
 部屋の中央には砂岩の祭壇があり、黒いシミが広がっている。かつて生贄が捧げられた場所のようだ。<br><br>
 <span style="color:#c0b098">━ 出口: 西　南　東 ━</span>`,
 choices:[
 {label:'⬅ 西の扉', go:'TOMB_DOOR_12'},
 {label:'⬇ 南の扉', go:'TOMB_TRAP_25'},
 {label:' 東の壁を調べる', go:'TOMB_SECRET_24_SEARCH'},
 ],
 },

 // ─ Trapped between 2-5 ─
 TOMB_TRAP_25:{
 scene:'dungeon',
 txt:()=>{
  if(PC._tombTrap25Triggered) return `<span style="color:#f0ece0"></span>　<span style="color:#f0ddd8">── Trapped ──</span><br><br>すでに罠は作動した扉が開いている。`;
  return `<span style="color:#f0ece0"></span>　<span style="color:#f0ddd8">── Trapped ──</span><br><br>扉を開けようとすると、何か仕掛けがありそうだ。<span style="color:#c0b098">（素早さ Lv2 能力値テスト）</span>`;
 },
 choices:()=>{
  if(PC._tombTrap25Triggered) return [{label:'⬇ 南へ進む', go:'TOMB_5'},{label:'⬆ 北へ進む', go:'TOMB_2'}];
  return [{label:' 扉を開ける', fn:()=>selectActorForSR('spd',2,actor=>{
   PC._tombTrap25Triggered=true;
   setupSavingRollFor(actor,{attr:'spd',level:2,
    onSuccess(){
     const an=actor===PC?PC.name:actor.name;
     document.getElementById('story').innerHTML+=`<div style="color:#f0ece0;margin-top:8px">${an}：天井から砂が落ちてきた！素早く跳び退いて難を逃れた！</div>`;
     setTimeout(()=>go('TOMB_TRAP_25'),600);
    },
    onFail(){
     const dmg=Nd6(2); const target=actor===PC?PC:actor; target.con=Math.max(1,target.con-dmg);
     const an=actor===PC?PC.name:actor.name;
     document.getElementById('story').innerHTML+=`<div style="color:#f0ddd8;margin-top:8px">${an}：砂と石が直撃した！体力-${dmg}</div>`;
     updateHUD(); setTimeout(()=>go('TOMB_TRAP_25'),600);
    },
   });
  })},{label:'⬆ 北へ進む', go:'TOMB_2'}];
 },
 },

 // ─ Secret between 2-4 ─
 TOMB_SECRET_24_SEARCH:{
 scene:'dungeon',
 txt:()=>{
 if(PC._tombSecret24Found) return `<span style="color:#f0ece0"></span>　<span style="color:#f0ece0">── Secret ──</span><br><br>
 以前見つけた隠し扉が薄暗い壁に口を開けている。`;
 return `<span style="color:#f0ece0"></span><br><br>
 壁を注意深く調べると、砂岩のパターンがわずかに不自然な箇所がある。<br>
 隠し扉があるかもしれない。<br>
 <span style="color:#c0b098">（知力 能力値テスト Lv2）</span>`;
 },
 choices:()=>PC._tombSecret24Found
 ? [{label:' 東の隠し扉へ', go:'TOMB_4'},{label:'⬅ 西へ進む', go:'TOMB_2'}]
 : [{label:' 慎重に探す', go:'TOMB_SECRET_24_TRY'},{label:'⬅ 西へ進む', go:'TOMB_2'}],
 },
 TOMB_SECRET_24_TRY:{
 scene:'dungeon',
 txt:`<span style="color:#f0ece0"></span>　<span style="color:#f0ece0">── Secret ──</span><br><br>壁の砂岩を慎重に調べる。誰が探しますか？`,
 choices:()=>{
  if(PC._tombSecret24Found) return [{label:' 東の隠し扉へ', go:'TOMB_4'},{label:'⬅ 西へ進む', go:'TOMB_2'}];
  return [{label:' 慎重に探す', fn:()=>selectActorForSR('iq',2,actor=>{
   setupSavingRollFor(actor,{attr:'iq',level:2,
    onSuccess(){
     const an=actor===PC?PC.name:actor.name;
     PC._tombSecret24Found=true;
     document.getElementById('story').innerHTML+=`<div style="color:#f0ece0;margin-top:8px">${an}：壁の一部を押すと、音もなく奥へと開いた！</div>`;
     setTimeout(()=>go('TOMB_SECRET_24_SEARCH'),600);
    },
    onFail(){
     const an=actor===PC?PC.name:actor.name;
     document.getElementById('story').innerHTML+=`<div style="color:#d0c8b8;margin-top:8px">${an}：念入りに調べたが、何も見つからなかった。</div>`;
     setTimeout(()=>go('TOMB_SECRET_24_TRY'),600);
    },
   });
  })},{label:'⬅ 西へ進む', go:'TOMB_2'}];
 },
 },

 // ── 3: 副葬品の間（ROOM 3）── Locked from 1
 TOMB_3:{
 scene:'dungeon',
 txt:`<span style="color:#f0ece0"></span><br><br>
 低い天井の石室。壁際に並べられた骨壺と副葬品が保管されていた棚の跡が残る。<br>
 床の砂に金貨が数枚埋もれており、壁の割れ目から細い光が差し込んでいる。<br><br>
 <span style="color:#c0b098">━ 出口: 北　東 ━</span>`,
 choices:[
 {label:'⬆ 北の錠前扉', go:'TOMB_LOCK_13'},
 {label:' 東の通路', go:'TOMB_3_6'},
 ],
 },
 TOMB_3_6:{
 scene:'dungeon',
 txt:`<span style="color:#f0ece0"></span>　<span style="color:#d0c8b8">── Arch ──</span><br><br>
 低い砂岩の通路。天井から砂がさらさらと落ちている。`,
 choices:[
 {label:' 東へ進む', go:'TOMB_6'},
 {label:'⬅ 西へ進む', go:'TOMB_3'},
 ],
 },

 // ── 4: 隠し宝物庫（ROOM 4）── Secret from 2
 TOMB_4:{
 scene:'dungeon',
 txt:`<span style="color:#f0ece0"></span>　<span style="color:#f0ece0">── Secret Room ──</span><br><br>
 隠し扉の先に、一際豪華な小部屋がある。壁には砂金の装飾が施され、中央に台座が置かれていた。<br>
 台座の上はすでに空だが、床の砂の中に砂金と古い呪符が埋もれている。<br>
 <span style="color:#e8e4d8">砂金を発見した！ ──</span><br><br>
 <span style="color:#c0b098">━ 行き止まり ━</span>`,
 choices:()=>{
 if(!PC._tomb4Looted){
 PC._tomb4Looted = true;
 const gp = 30 + Math.floor(Math.random()*31);
 const ap = 20 + Math.floor(Math.random()*21);
 gainGPAll(gp); gainAPAll(ap); updateHUD();
 const n = document.getElementById('story');
 if(n) n.innerHTML += `<div style="color:#ffcc44;margin-top:8px"> 砂金 +${gp}GP　経験値+${ap}</div>`;
 }
 return [{label:'⬅ 西の壁へ進む', go:'TOMB_SECRET_24_SEARCH'}];
 },
 },

 // ── 5: 交差回廊（ROOM 5）
 TOMB_5:{
 scene:'dungeon',
 txt:`<span style="color:#f0ece0"></span><br><br>
 通路が十字に交わる広い回廊だ。天井の一部が崩れており、砂が絶え間なく降り注いでいる。<br>
 壁の松明台は空っぽだが、古い油の染みが残っている。<br><br>
 <span style="color:#c0b098">━ 出口: 北　西　東　南 ━</span>`,
 choices:[
 {label:'⬆ 北', go:'TOMB_TRAP_25'},
 {label:'⬅ 西', go:'TOMB_5_6'},
 {label:' 東の扉', go:'TOMB_DOOR_57'},
 {label:'⬇ 南の落とし格子', go:'TOMB_PORT_58'},
 ],
 },
 TOMB_5_6:{
 scene:'dungeon',
 txt:`<span style="color:#f0ece0"></span>　<span style="color:#d0c8b8">── Arch ──</span><br><br>
 砂岩の通路。足元にこまかい砂が積もっている。`,
 choices:[
 {label:'⬅ 西へ進む', go:'TOMB_6'},
 {label:' 東へ進む', go:'TOMB_5'},
 ],
 },

 // ─ Door between 5-7 ─
 TOMB_DOOR_57:{
 scene:'dungeon',
 txt:`<span style="color:#f0ece0"></span>　<span style="color:#e0d8c8">── Door ──</span><br><br>
 木製の古い扉。砂漠の乾燥で反り返っているが、引くと開いた。`,
 choices:[
 {label:' 東へ進む', go:'TOMB_7'},
 {label:'⬅ 西へ進む', go:'TOMB_5'},
 ],
 },

 // ─ Portcullis between 5-8 ─
 TOMB_PORT_58:{
 scene:'dungeon',
 txt:()=>{
 if(PC._tombPort58Open) return `<span style="color:#f0ece0"></span>　<span style="color:#f0e0e8">── Portcullis ──</span><br><br>
 持ち上げた格子が固定されている。通れる。`;
 return `<span style="color:#f0ece0"></span>　<span style="color:#f0e0e8">── Portcullis ──</span><br><br>
 床から天井まで届く重い鉄格子が通路を塞いでいる。格子の下端に指をかければ持ち上げられそうだが……<br>
 <span style="color:#c0b098">（強さ 能力値テスト Lv2）</span>`;
 },
 choices:()=>PC._tombPort58Open
 ? [{label:'⬇ 南へ進む', go:'TOMB_8'},{label:'⬆ 北へ進む', go:'TOMB_5'}]
 : [{label:' 格子を持ち上げる', go:'TOMB_PORT_58_TRY'},{label:'⬆ 北へ進む', go:'TOMB_5'}],
 },
 TOMB_PORT_58_TRY:{
 scene:'dungeon',
 txt:`<span style="color:#f0ece0"></span><br><br>重い鉄格子の下端に指をかける。誰が持ち上げますか？`,
 choices:()=>{
  if(PC._tombPort58Open) return [{label:'⬇ 南へ進む', go:'TOMB_8'},{label:'⬆ 北へ進む', go:'TOMB_5'}];
  return [{label:' 格子を持ち上げる', fn:()=>selectActorForSR('st',2,actor=>{
   setupSavingRollFor(actor,{attr:'st',level:2,
    onSuccess(){
     const an=actor===PC?PC.name:actor.name;
     PC._tombPort58Open=true;
     document.getElementById('story').innerHTML+=`<div style="color:#f0ece0;margin-top:8px">${an}：格子を押し上げ、砂で固定した！</div>`;
     setTimeout(()=>go('TOMB_PORT_58'),600);
    },
    onFail(){
     const dmg=1+Math.floor(Math.random()*4); const target=actor===PC?PC:actor; target.con=Math.max(1,target.con-dmg);
     const an=actor===PC?PC.name:actor.name;
     document.getElementById('story').innerHTML+=`<div style="color:#f0ddd8;margin-top:8px">${an}：格子はびくともしない。腕を傷めた。体力-${dmg}</div>`;
     updateHUD(); setTimeout(()=>go('TOMB_PORT_58_TRY'),600);
    },
   });
  })},{label:'⬆ 北へ進む', go:'TOMB_5'}];
 },
 },

 // ── 6: 衛兵の間（ROOM 6）
 TOMB_6:{
 scene:'dungeon',
 txt:`<span style="color:#f0ece0"></span><br><br>
 かつて廟の衛兵が詰めていた部屋。武器掛けの跡が壁に残り、骨が数体、壁に寄りかかるように座っている。<br>
 床の砂に古い硬貨が数枚散らばっている。<br><br>
 <span style="color:#c0b098">━ 出口: 東　南 ━</span>`,
 choices:[
 {label:' 東', go:'TOMB_3_6'},
 {label:'⬇ 南', go:'TOMB_5_6'},
 ],
 },

 // ── 7: 拷問の間（ROOM 7）
 TOMB_7:{
 scene:'dungeon',
 txt:`<span style="color:#f0ece0"></span><br><br>
 不穏な鉄製の器具が壁にかかっている。砂漠の王は罪人をここで裁いたのか。<br>
 壁の染みが嫌な想像を呼ぶ。部屋の奥に小さな石台があり、何かが置かれた跡がある。<br><br>
 <span style="color:#c0b098">━ 出口: 西　南 ━</span>`,
 choices:[
 {label:'⬅ 西の扉', go:'TOMB_DOOR_57'},
 {label:'⬇ 南の錠前扉', go:'TOMB_LOCK_79'},
 ],
 },

 // ─ Locked between 7-9 ─
 TOMB_LOCK_79:{
 scene:'dungeon',
 txt:()=>{
 if(PC._tombLock79Open) return `<span style="color:#f0ece0"></span>　<span style="color:#ffcc44">── Locked ──</span><br><br>
 解錠済みの扉が開いている。`;
 return `<span style="color:#f0ece0"></span>　<span style="color:#ffcc44">── Locked ──</span><br><br>
 重厚な錠前がついた石扉。扉の縁に「試練なき者、進む勿れ」と刻まれている。<br>
 <span style="color:#c0b098">（器用さ Lv3 能力値テスト）</span>`;
 },

 spellContext:'ザール・カノン廟の錠前扉（7-9）',
 spellEffects:{
  knockKnock:{ desc:'魔法で錠前を開錠する',
   fn:()=>{ PC._tombLock79Open=true; return ' Knock Knock！錠前が弾け飛んだ。扉が開く！'; }},
 }, choices:()=>PC._tombLock79Open
 ? [{label:'⬇ 南へ進む', go:'TOMB_9'},{label:'⬆ 北へ進む', go:'TOMB_7'}]
 : [{label:' 解錠を試みる', go:'TOMB_LOCK_79_TRY'},{label:'⬆ 北へ進む', go:'TOMB_7'}],
 },
 TOMB_LOCK_79_TRY:{
 scene:'dungeon',
 txt:`<span style="color:#f0ece0"></span><br><br>重厚な錠前を操作する。誰が挑みますか？`,
 choices:()=>{
  if(PC._tombLock79Open) return [{label:'⬇ 南へ進む', go:'TOMB_9'},{label:'⬆ 北へ進む', go:'TOMB_7'}];
  return [{label:' 解錠を試みる', fn:()=>selectActorForSR('dex',3,actor=>{
   setupSavingRollFor(actor,{attr:'dex',level:3,
    onSuccess(){
     const an=actor===PC?PC.name:actor.name;
     PC._tombLock79Open=true;
     document.getElementById('story').innerHTML+=`<div style="color:#f0ece0;margin-top:8px">${an}：粘り強く操作すると音を立てて開いた！</div>`;
     setTimeout(()=>go('TOMB_LOCK_79'),600);
    },
    onFail(){
     const dmg=1+Math.floor(Math.random()*4); const target=actor===PC?PC:actor; target.con=Math.max(1,target.con-dmg);
     const an=actor===PC?PC.name:actor.name;
     document.getElementById('story').innerHTML+=`<div style="color:#f0ddd8;margin-top:8px">${an}：仕掛けが跳ねて手を傷めた。体力-${dmg}</div>`;
     updateHUD(); setTimeout(()=>go('TOMB_LOCK_79_TRY'),600);
    },
   });
  })},{label:'⬆ 北へ進む', go:'TOMB_7'}];
 },
 },

 // ── 8: 罠の回廊（ROOM 8）── Portcullis from 5
 TOMB_8:{
 scene:'dungeon',
 txt:`<span style="color:#f0ece0"></span><br><br>
 落とし格子を抜けた先の細い回廊。足元の石板がわずかに浮いており、踏む場所によっては何かが起きそうな不気味さがある。<br>
 壁には「踏むな」という意味の古代文字が刻まれている（今は読めない）。<br><br>
 <span style="color:#c0b098">━ 出口: 北　南 ━</span>`,
 choices:[
 {label:'⬆ 北', go:'TOMB_PORT_58'},
 {label:'⬇ 南の扉', go:'TOMB_TRAP_810'},
 ],
 },

 // ─ Trapped between 8-10 ─
 TOMB_TRAP_810:{
 scene:'dungeon',
 txt:()=>{
  if(PC._tombTrap810Triggered) return `<span style="color:#f0ece0"></span>　<span style="color:#f0ddd8">── Trapped ──</span><br><br>罠はすでに作動している。扉は開いたままだ。`;
  return `<span style="color:#f0ece0"></span>　<span style="color:#f0ddd8">── Trapped ──</span><br><br>扉の前に立つと、壁の細い穴が目につく。何か仕掛けがありそうだ。<span style="color:#c0b098">（運 Lv2 能力値テスト）</span>`;
 },
 choices:()=>{
  if(PC._tombTrap810Triggered) return [{label:'⬇ 南へ進む', go:'TOMB_10'},{label:'⬆ 北へ進む', go:'TOMB_8'}];
  return [{label:' 扉を開ける', fn:()=>selectActorForSR('lk',2,actor=>{
   PC._tombTrap810Triggered=true;
   setupSavingRollFor(actor,{attr:'lk',level:2,
    onSuccess(){
     const an=actor===PC?PC.name:actor.name;
     document.getElementById('story').innerHTML+=`<div style="color:#f0ece0;margin-top:8px">${an}：壁から毒矢が飛び出したが、間一髪でかわした！</div>`;
     setTimeout(()=>go('TOMB_TRAP_810'),600);
    },
    onFail(){
     const dmg=Nd6(1); const target=actor===PC?PC:actor; target.con=Math.max(1,target.con-dmg); target._poisoned=true;
     const an=actor===PC?PC.name:actor.name;
     document.getElementById('story').innerHTML+=`<div style="color:#f0ddd8;margin-top:8px">${an}：毒矢が命中！体力-${dmg}、毒状態</div>`;
     updateHUD(); setTimeout(()=>go('TOMB_TRAP_810'),600);
    },
   });
  })},{label:'⬆ 北へ進む', go:'TOMB_8'}];
 },
 },

 // ── 9: 審判の間（ROOM 9）── Locked from 7
 TOMB_9:{
 scene:'dungeon',
 txt:`<span style="color:#f0ece0"></span><br><br>
 大きな石の椅子が中央に置かれており、その上に崩れかけた骨が座っている。かつての王か、裁き人か。<br>
 壁には天秤を持つ神の像が彫られており、「正しき者のみ進め」と刻まれている。<br><br>
 <span style="color:#c0b098">━ 出口: 北　東 ━</span>`,
 choices:[
 {label:'⬆ 北', go:'TOMB_LOCK_79'},
 {label:' 東の扉', go:'TOMB_DOOR_911'},
 ],
 },
 TOMB_DOOR_911:{
 scene:'dungeon',
 txt:`<span style="color:#f0ece0"></span>　<span style="color:#e0d8c8">── Door ──</span><br><br>
 天秤の紋章が刻まれた重厚な石扉。両手で押すと、低い音を立てて開いた。`,
 choices:[
 {label:' 東へ進む', go:'TOMB_11'},
 {label:'⬅ 西へ進む', go:'TOMB_9'},
 ],
 },

 // ── 10: 水の間（ROOM 10）── Trapped from 8
 TOMB_10:{
 scene:'dungeon',
 txt:`<span style="color:#f0ece0"></span><br><br>
 砂漠の廟にしては珍しく、壁の割れ目から細い水が湧き出している。かつては沐浴の場として使われたのだろうか。<br>
 床は湿っており、苔が生えている。水を飲むかどうか。<br><br>
 <span style="color:#c0b098">━ 出口: 北　東 ━</span>`,
 choices:[
 {label:'⬆ 北', go:'TOMB_TRAP_810'},
 {label:' 東', go:'TOMB_10_11'},
 {label:' 水を飲む', fn:()=>{
 const story=document.getElementById('story');
 const r=Math.random();
 if(r<0.15){ PC.con=Math.min(PC.maxCon||99,PC.con+5); updateHUD();
 story.innerHTML+=`<div style="color:#f0ece0;margin-top:8px"> 聖なる水だった！体力+5 回復</div>`; }
 else if(r<0.25){ PC.con=Math.max(1,PC.con-3); PC._poisoned=true; updateHUD();
 story.innerHTML+=`<div style="color:#f0ddd8;margin-top:8px"> 毒の水だった！体力-3、毒状態</div>`; }
 else { story.innerHTML+=`<div style="color:#e0d8c8;margin-top:8px"> 冷たく澄んだ水だった。特に何も感じない。</div>`; }
 updateHUD();
 }, go:'__travel__'},
 ],
 },
 TOMB_10_11:{
 scene:'dungeon',
 txt:`<span style="color:#f0ece0"></span>　<span style="color:#d0c8b8">── Arch ──</span><br><br>
 湿った砂岩の通路。足音が響く。`,
 choices:[
 {label:' 東へ進む', go:'TOMB_11'},
 {label:'⬅ 西へ進む', go:'TOMB_10'},
 ],
 },

 // ── 11: 大広間（ROOM 11）── 中央ハブ
 TOMB_11:{
 scene:'dungeon',
 txt:`<span style="color:#f0ece0"></span><br><br>
 廟最大の広間。天井には砂金と青い石が散りばめられており、かつては星空のように輝いていたのだろう。<br>
 中央に巨大な石棺が置かれており、蓋は半ば開いている。中は空だ。<br>
 四方の壁に砂漠の王の戦績を伝える壁画が連なる。<br><br>
 <span style="color:#c0b098">━ 出口: 西　北西　東　南東　南 ━</span>`,
 choices:[
 {label:'⬅ 西の扉', go:'TOMB_DOOR_911'},
 {label:'↖ 北西', go:'TOMB_10_11'},
 {label:' 東の扉', go:'TOMB_DOOR_1112'},
 {label:'↘ 南東', go:'TOMB_LOCK_1113'},
 {label:'⬇ 南の壁を調べる', go:'TOMB_SECRET_1114_SEARCH'},
 ],
 },

 // ─ Door between 11-12 ─
 TOMB_DOOR_1112:{
 scene:'dungeon',
 txt:`<span style="color:#f0ece0"></span>　<span style="color:#e0d8c8">── Door ──</span><br><br>
 砂岩の石扉。表面に蛇の文様が刻まれている。押すと重い音と共に開いた。`,
 choices:[
 {label:' 東へ進む', go:'TOMB_12'},
 {label:'⬅ 西へ進む', go:'TOMB_11'},
 ],
 },

 // ─ Locked between 11-13 ─
 TOMB_LOCK_1113:{
 scene:'dungeon',
 txt:()=>{
 if(PC._tombLock1113Open) return `<span style="color:#f0ece0"></span>　<span style="color:#ffcc44">── Locked ──</span><br><br>
 解錠済みの扉が開いている。`;
 return `<span style="color:#f0ece0"></span>　<span style="color:#ffcc44">── Locked ──</span><br><br>
 精緻な錠前の扉。砂漠の神の顔が扉全面に彫られており、目の部分が鍵穴になっている。<br>
 <span style="color:#c0b098">（器用さ Lv3 能力値テスト）</span>`;
 },

 spellContext:'ザール・カノン廟の錠前扉（11-13）',
 spellEffects:{
  knockKnock:{ desc:'魔法で錠前を開錠する',
   fn:()=>{ PC._tombLock1113Open=true; return ' Knock Knock！錠前が弾け飛んだ。扉が開く！'; }},
 }, choices:()=>PC._tombLock1113Open
 ? [{label:'↘ 南東へ進む', go:'TOMB_13'},{label:'↖ 北西へ進む', go:'TOMB_11'}]
 : [{label:' 解錠を試みる', go:'TOMB_LOCK_1113_TRY'},{label:'↖ 北西へ進む', go:'TOMB_11'}],
 },
 TOMB_LOCK_1113_TRY:{
 scene:'dungeon',
 txt:`<span style="color:#f0ece0"></span><br><br>神の目の鍵穴に指を近づける。誰が解錠に挑みますか？`,
 choices:()=>{
  if(PC._tombLock1113Open) return [{label:'↘ 南東へ進む', go:'TOMB_13'},{label:'↖ 北西へ進む', go:'TOMB_11'}];
  return [{label:' 解錠を試みる', fn:()=>selectActorForSR('dex',3,actor=>{
   setupSavingRollFor(actor,{attr:'dex',level:3,
    onSuccess(){
     const an=actor===PC?PC.name:actor.name;
     PC._tombLock1113Open=true;
     document.getElementById('story').innerHTML+=`<div style="color:#f0ece0;margin-top:8px">${an}：神の目の機構を操作すると、静かに扉が開いた！</div>`;
     setTimeout(()=>go('TOMB_LOCK_1113'),600);
    },
    onFail(){
     const dmg=1+Math.floor(Math.random()*4); const target=actor===PC?PC:actor; target.con=Math.max(1,target.con-dmg);
     const an=actor===PC?PC.name:actor.name;
     document.getElementById('story').innerHTML+=`<div style="color:#f0ddd8;margin-top:8px">${an}：神の目の仕掛けが弾けた。罰のように痛みが走った。体力-${dmg}</div>`;
     updateHUD(); setTimeout(()=>go('TOMB_LOCK_1113_TRY'),600);
    },
   });
  })},{label:'↖ 北西へ進む', go:'TOMB_11'}];
 },
 },

 // ─ Secret between 11-14 ─
 TOMB_SECRET_1114_SEARCH:{
 scene:'dungeon',
 txt:()=>{
 if(PC._tombSecret1114Found) return `<span style="color:#f0ece0"></span>　<span style="color:#f0ece0">── Secret ──</span><br><br>
 以前見つけた隠し扉が開いている。`;
 return `<span style="color:#f0ece0"></span><br><br>
 石棺の南側の壁。一見ただの石壁だが、砂のつき方がわずかに不自然だ。<br>
 <span style="color:#c0b098">（運 能力値テスト Lv2）</span>`;
 },
 choices:()=>PC._tombSecret1114Found
 ? [{label:'⬇ 南の隠し扉へ', go:'TOMB_14'},{label:'⬆ 北へ進む', go:'TOMB_11'}]
 : [{label:' 壁を調べる', go:'TOMB_SECRET_1114_TRY'},{label:'⬆ 北へ進む', go:'TOMB_11'}],
 },
 TOMB_SECRET_1114_TRY:{
 scene:'dungeon',
 txt:`<span style="color:#f0ece0"></span>　<span style="color:#f0ece0">── Secret ──</span><br><br>石棺の南側の壁を調べる。誰が探しますか？`,
 choices:()=>{
  if(PC._tombSecret1114Found) return [{label:'⬇ 南の隠し扉へ', go:'TOMB_14'},{label:'⬆ 北へ進む', go:'TOMB_11'}];
  return [{label:' 壁を調べる', fn:()=>selectActorForSR('lk',2,actor=>{
   setupSavingRollFor(actor,{attr:'lk',level:2,
    onSuccess(){
     const an=actor===PC?PC.name:actor.name;
     PC._tombSecret1114Found=true;
     document.getElementById('story').innerHTML+=`<div style="color:#f0ece0;margin-top:8px">${an}：石棺の後ろに隠し扉があった！</div>`;
     setTimeout(()=>go('TOMB_SECRET_1114_SEARCH'),600);
    },
    onFail(){
     const an=actor===PC?PC.name:actor.name;
     document.getElementById('story').innerHTML+=`<div style="color:#d0c8b8;margin-top:8px">${an}：壁を叩いてみたが、特に変わった手応えはなかった。</div>`;
     setTimeout(()=>go('TOMB_SECRET_1114_TRY'),600);
    },
   });
  })},{label:'⬆ 北へ進む', go:'TOMB_11'}];
 },
 },

 // ── 12: 供物の間（ROOM 12）
 TOMB_12:{
 scene:'dungeon',
 txt:`<span style="color:#f0ece0"></span><br><br>
 複数の低い石台が並び、かつて供物が捧げられた痕跡がある。台の上はすでに空だが、<br>
 一番奥の台の下に、砂に半ば埋もれた小さな骨壺がある。<br><br>
 <span style="color:#c0b098">━ 出口: 西　南 ━</span>`,
 choices:[
 {label:'⬅ 西の扉', go:'TOMB_DOOR_1112'},
 {label:'⬇ 南の扉', go:'TOMB_TRAP_1215'},
 ],
 },

 // ─ Trapped between 12-15 ─
 TOMB_TRAP_1215:{
 scene:'dungeon',
 txt:()=>{
  if(PC._tombTrap1215Triggered) return `<span style="color:#f0ece0"></span>　<span style="color:#f0ddd8">── Trapped ──</span><br><br>罠はすでに作動した扉が開いている。`;
  return `<span style="color:#f0ece0"></span>　<span style="color:#f0ddd8">── Trapped ──</span><br><br>扉の前の床がわずかに浮いているように見える。<span style="color:#c0b098">（器用さ Lv2 能力値テスト）</span>`;
 },
 choices:()=>{
  if(PC._tombTrap1215Triggered) return [{label:'⬇ 南へ進む', go:'TOMB_15'},{label:'⬆ 北へ進む', go:'TOMB_12'}];
  return [{label:' 扉を開ける', fn:()=>selectActorForSR('dex',2,actor=>{
   PC._tombTrap1215Triggered=true;
   setupSavingRollFor(actor,{attr:'dex',level:2,
    onSuccess(){
     const an=actor===PC?PC.name:actor.name;
     document.getElementById('story').innerHTML+=`<div style="color:#f0ece0;margin-top:8px">${an}：床から鎖が飛び出したが、素早く跳び退いて絡まれずに済んだ！</div>`;
     setTimeout(()=>go('TOMB_TRAP_1215'),600);
    },
    onFail(){
     const target=actor===PC?PC:actor; applyChainedEffect(target, 2);
     const an=actor===PC?PC.name:actor.name;
     document.getElementById('story').innerHTML+=`<div style="color:#f0ddd8;margin-top:8px">${an}：鎖が足首に絡みついた！ 拘束状態（2ターンDEX半減）</div>`;
     updateHUD(); setTimeout(()=>go('TOMB_TRAP_1215'),600);
    },
   });
  })},{label:'⬆ 北へ進む', go:'TOMB_12'}];
 },
 },

 // ── 13: 祭壇の間（ROOM 13）── Locked from 11
 TOMB_13:{
 scene:'dungeon',
 txt:`<span style="color:#f0ece0"></span><br><br>
 廟の中でも特に豪華な部屋。砂金で縁取られた大きな祭壇が中央を占めており、砂漠の神の石像が見下ろしている。<br>
 祭壇の上に砂に半ば埋もれた骨壺と、光る砂金の欠片が残されている。<br><br>
 <span style="color:#c0b098">━ 出口: 北西　南 ━</span>`,
 choices:[
 {label:'↖ 北西', go:'TOMB_LOCK_1113'},
 {label:'⬇ 南の落とし格子', go:'TOMB_PORT_1316'},
 ],
 },

 // ─ Portcullis between 13-16 ─
 TOMB_PORT_1316:{
 scene:'dungeon',
 txt:()=>{
 if(PC._tombPort1316Open) return `<span style="color:#f0ece0"></span>　<span style="color:#f0e0e8">── Portcullis ──</span><br><br>
 持ち上げた格子が固定されている。通れる。`;
 return `<span style="color:#f0ece0"></span>　<span style="color:#f0e0e8">── Portcullis ──</span><br><br>
 石造りの重い格子が道を塞いでいる。砂岩に傷をつけながら持ち上げれば何とかなりそうだ。<br>
 <span style="color:#c0b098">（強さ 能力値テスト Lv3）</span>`;
 },
 choices:()=>PC._tombPort1316Open
 ? [{label:'⬇ 南へ進む', go:'TOMB_16'},{label:'⬆ 北へ進む', go:'TOMB_13'}]
 : [{label:' 格子を持ち上げる', go:'TOMB_PORT_1316_TRY'},{label:'⬆ 北へ進む', go:'TOMB_13'}],
 },
 TOMB_PORT_1316_TRY:{
 scene:'dungeon',
 txt:`<span style="color:#f0ece0"></span><br><br>石造りの重い格子の前に立つ。誰が持ち上げますか？`,
 choices:()=>{
  if(PC._tombPort1316Open) return [{label:'⬇ 南へ進む', go:'TOMB_16'},{label:'⬆ 北へ進む', go:'TOMB_13'}];
  return [{label:' 格子を持ち上げる', fn:()=>selectActorForSR('st',3,actor=>{
   setupSavingRollFor(actor,{attr:'st',level:3,
    onSuccess(){
     const an=actor===PC?PC.name:actor.name;
     PC._tombPort1316Open=true;
     document.getElementById('story').innerHTML+=`<div style="color:#f0ece0;margin-top:8px">${an}：全力を振り絞って格子を押し上げ、固定した！</div>`;
     setTimeout(()=>go('TOMB_PORT_1316'),600);
    },
    onFail(){
     const dmg=2+Math.floor(Math.random()*4); const target=actor===PC?PC:actor; target.con=Math.max(1,target.con-dmg);
     const an=actor===PC?PC.name:actor.name;
     document.getElementById('story').innerHTML+=`<div style="color:#f0ddd8;margin-top:8px">${an}：格子は重すぎた。砂岩の縁で体を傷つけた。体力-${dmg}</div>`;
     updateHUD(); setTimeout(()=>go('TOMB_PORT_1316_TRY'),600);
    },
   });
  })},{label:'⬆ 北へ進む', go:'TOMB_13'}];
 },
 },

 // ── 14: 王の玄室（ROOM 14）── Secret from 11　最奥
 TOMB_14:{
 scene:'dungeon',
 txt:`<span style="color:#f0ece0"></span>　<span style="color:#f0ece0">── Secret Room ──</span><br><br>
 廟の真の最奥。砂岩の天井と壁は黄金の装飾で覆われており、かつては燦然と輝いていただろう。<br>
 中央に黄金の台座があるが、そこに置かれていたものはすでに失われている。<br>
 ただ、台座の下の砂に金貨と古い短剣、砂漠の王の印章が残されていた。<br><br>
 <span style="color:#c0b098">━ 行き止まり ── ここが廟の真の最奥だ ━</span>`,
 choices:()=>{
 if(!PC._tomb14Looted){
 PC._tomb14Looted = true;
 const gp = 50 + Math.floor(Math.random()*51);
 const ap = 40 + Math.floor(Math.random()*31);
 gainGPAll(gp); gainAPAll(ap); updateHUD();
 const n = document.getElementById('story');
 if(n) n.innerHTML += `<div style="color:#ffcc44;font-size:calc(var(--font-sm) + 1px);margin-top:8px"> 秘室の財宝: +${gp}GP　経験値+${ap}</div>`;
 }
 return [{label:'⬆ 北の大広間へ', go:'TOMB_SECRET_1114_SEARCH'}];
 },
 },

 // ── 15: 封印の回廊（ROOM 15）── Trapped from 12
 TOMB_15:{
 scene:'dungeon',
 txt:`<span style="color:#f0ece0"></span><br><br>
 天井から床まで、びっしりと封印の文字が刻まれた長い回廊だ。冷気が漂い、他の部屋とは異質な空気がある。<br>
 封印の文字の意味はわからないが、何かを封じ込めるために施されたのは明らかだ。<br><br>
 <span style="color:#c0b098">━ 出口: 北　南 ━</span>`,
 choices:[
 {label:'⬆ 北', go:'TOMB_TRAP_1215'},
 {label:'⬇ 南の扉', go:'TOMB_DOOR_1516'},
 ],
 },
 TOMB_DOOR_1516:{
 scene:'dungeon',
 txt:`<span style="color:#f0ece0"></span>　<span style="color:#e0d8c8">── Door ──</span><br><br>
 封印の文字で縁取られた石扉。冷気がこちら側に漏れてくる。押すと音もなく開いた。`,
 choices:[
 {label:'⬇ 南へ進む', go:'TOMB_16'},
 {label:'⬆ 北へ進む', go:'TOMB_15'},
 ],
 },

 // ── 16: 大封印の間（ROOM 16）── 最終エリア
 TOMB_16:{
 scene:'dungeon',
 txt:`<span style="color:#f0ece0"></span><br><br>
 廟の最下部。冷気の源はここだったようだ。中央に巨大な封印石が置かれており、砕かれた石板が周囲に散らばっている。<br>
 かつてここに封印されていた何かは、遠い昔にすでに逃げ出したようだ。<br>
 壁の隙間から、砂漠の外の光がわずかに見える。別の出口があるようだ。<br><br>
 <span style="color:#c0b098">━ 出口: 北　北西　東（脱出口） ━</span>`,
 choices:[
 {label:'⬆ 北', go:'TOMB_PORT_1316'},
 {label:'↖ 北西', go:'TOMB_DOOR_1516'},
 {label:' 東の脱出口', go:'TOMB_EXIT'},
 ],
 },

 // ── 脱出口
 TOMB_EXIT:{
 scene:'dungeon',
 txt:`<span style="color:#f0ece0"></span><br><br>
 砂岩の隙間を抜けると、岩の割れ目から砂漠の日差しが差し込んできた。<br>
 狭い通路を這い進むと、デュナの方角に開けた砂漠が広がっていた。<br>
 封印廟を踏破した達成感が体を満たす。`,
 choices:[
 {label:' 砂漠へ出る（デュナへ）', go:'TOWN_DUNA'},
 {label:'← 廟の奥へ', go:'TOMB_16'},
 ],
 },

 TOWN_DUNA:{
 scene:'town_desert_village',
 txt:()=>{
 const t=TOWNS.duna;
 return `<span style="color:#f0ece0;font-size:calc(var(--font-base) + 1px)"> ${t.name}</span>　<span class="dim" style="font-size:calc(var(--font-lg) + 4px)">${t.size}</span>${popTimeOfDayMsg('duna')}<br>
 ${popWeatherMsg('duna')}
 ${popDeliveryMsg()}<br>
 <span style="color:#c0b098">${t.desc}</span><br>${popHeroMsg()}${popInfamyMsg()}${popRegionHeroMsg()}${popRegionInfamyMsg()}${popRegionEvalMsg()}${popRaidUnitMsg()}<br>${renderTrustBadge(PC.town)}${hasProperty(PC.town)?'　<span style="color:#f0ece0"> 拠点あり</span>':''}` ;
 },
 choices:[
 {label:' 道具屋', go:'SHOP_DUNA'},
 {label:' 酒場（天幕）', go:'TAVERN_DUNA'},
 {label:' 宿屋（2GP・1日休む）', fn:()=>innRest(200), go:'TOWN_DUNA'},
 {label:' 旅に出る（移動）', go:'TRAVEL_FROM_DUNA'},
 {label:' その他の行動', fn:()=>goOtherActions('duna')},
 ]
 },
 TRAVEL_FROM_DUNA:{
 scene:'travel',
 txt:()=>`<span style="color:#f0ece0">デュナ</span>からの旅立ち<br><br>
 
 <span style="color:#c0b098">どこへ向かいますか？</span>`,
 choices:()=>makeTravelChoices(PC.town||'duna'),
 },
 SHOP_DUNA:{
 scene:'town_desert_village',
 txt:()=>` <span style="color:#f0ece0">デュナの道具屋</span><br><br>
 <span style="color:#c0b098">天幕の中に所狭しと商品が並ぶ。遊牧民の知恵が詰まった実用品が多い。</span>`,
 choices:[
 {label:' 買い物をする', fn:()=>showIngameShop('duna'), go:'__travel__'},
 {label:'← 戻る', go:'TOWN_DUNA'},
 ],
 },
 TAVERN_DUNA:{
 scene:'town_desert_village',
 txt:()=>{
 const board=getTavernBoard('duna');
 const _hqOffer = checkHeroQuest('duna');
 const _hqHtml = renderHeroQuestOffer('duna', _hqOffer);
 const html=renderQuestBoard('duna',board);
 const partyHtml=renderPartyStatus();
 return ` <span style="color:#f0ece0">デュナの天幕酒場</span><br><br><span style="color:#c0b098">星空の下、大きな天幕の中で遊牧民が独特の音楽を奏でている。</span><br><br>${_tavernFlavorHtml}${partyHtml}${_hqHtml}${html}`;
 },
 choices:()=>[...getQuestBoardChoices('TOWN_DUNA'), {label:' 客に話しかける', fn:()=>talkToPatron('duna')}, ...fcTavernAskChoices('duna'), {label:' 仲間を探す',go:'RECRUIT_DUNA'}],
 },

 // ══════════════════════════════════════════
 //  ウィザードズギルド
 // ══════════════════════════════════════════
 WIZARDS_GUILD:{
 scene:'town_khazan',
 txt:()=>{
 const actor = _guildActor || PC;
 const isWizard = actor.type==='wizard';
 const known = new Set((actor.spells||[]).map(s=>s.name));
 const okFor = lv => { const r=SPELL_LEVEL_REQS[lv]; return (actor.iq||0)>=r.iq && (actor.dex||0)>=r.dex; };
 const availFor = lv => isWizard ? SPELL_LEVEL_TABLES[lv].filter(s=>!known.has(s.name)) : [];

 let txt = ` <span class="gold" style="font-size:var(--font-base)">ウィザードズギルド</span>`;
 txt += actor !== PC ? ` <span style="color:#e0d8c8;font-size:calc(var(--font-sm) - 2px)">[${actor.name}]</span>` : '';
 txt += `<br><br><span style="color:#c0b098">魔法の書物が並ぶ静かな部屋。ギルドマスターが迎える。</span><br><br>`;
 txt += `<b>習得条件：</b><br>`;
 [2,3,4,5,6,7].forEach(lv=>{
  const r = SPELL_LEVEL_REQS[lv];
  const cost = SPELL_LEVEL_TABLES[lv][0]?.learnCost || 0;
  txt += `  Lv${lv}呪文: 知力≥${r.iq}・器用さ≥${r.dex}・各${cost}GP　${okFor(lv)?'<span style="color:#e8e4d8"> 条件達成</span>':'<span class="red"> 未達成</span>'}<br>\n`;
 });
 txt += `  所持金: ${actor.gold||0}GP ${actor.sp||0}SP ${actor.cp||0}CP<br><br>`;

 // 呪文一覧をtxt内に表示（choicesではなくstory内でスクロール可能に）
 const spellRow = (sp, lv, cost, canLearn) => {
  const req = SPELL_LEVEL_REQS[lv];
  const disabledReason = !canLearn ? (actor.iq<req.iq||actor.dex<req.dex?'能力値不足':'GP不足（両替所を含む）') : '';
  return `<div style="background:#110c06;border:1px solid ${canLearn?'var(--white2)':'var(--info-border)'};border-radius:3px;padding:8px;margin-bottom:5px;display:flex;justify-content:space-between;align-items:center;gap:8px">
   <div>
    <div style="font-size:calc(var(--font-sm) - 1px);color:${canLearn?'#e8e0d0':'var(--info-border)'}"> [Lv${lv}] ${sp.name}</div>
    <div style="font-size:calc(var(--font-sm) - 2px);color:#c8b8a0;margin-top:2px">${sp.desc}</div>
    ${disabledReason?`<div style="font-size:calc(var(--font-sm) - 3px);color:#f0ddd8;margin-top:2px"> ${disabledReason}</div>`:''}
   </div>
   <button onclick="learnSpell('${sp.name}',${lv})"
    style="flex-shrink:0;font-size:calc(var(--font-sm) - 3px);padding:6px 10px;background:${canLearn?'var(--ink)':'#110c06'};border:1px solid ${canLearn?'var(--white2)':'var(--info-border)'};color:${canLearn?'#e8e0d0':'var(--info-border)'};font-family:system-ui,sans-serif;cursor:${canLearn?'pointer':'default'};border-radius:2px">
    ${cost}GP
   </button>
  </div>`;
 };

 let anyAvail = false;
 [2,3,4,5,6,7].forEach(lv=>{
  const avail = availFor(lv);
  if(avail.length > 0){
   anyAvail = true;
   txt += `<div style="font-size:calc(var(--font-sm) - 2px);color:var(--white);margin-bottom:6px">── Level ${lv} 呪文 ──</div>`;
   avail.forEach(sp=>{
    const can = okFor(lv) && npcAvailableCP(actor, PC.town)>=sp.learnCost*100;
    txt += spellRow(sp, lv, sp.learnCost, can);
   });
   txt += '<br>';
  }
 });
 if(!anyAvail){
  txt += '<span style="color:#e8e4d8">習得可能な呪文はすべて習得済みです。</span>';
 }

 // actorがPCの場合のみパーティwizard NPCセクションを表示
 const wizNPCs = actor===PC ? (PC.party||[]).map((m,i)=>({m,i})).filter(({m})=>m.type==='wizard'&&m.con>0) : [];
 if(wizNPCs.length>0){
  txt += `<br><div style="font-size:calc(var(--font-sm) - 2px);color:var(--white);margin-bottom:6px;border-top:1px solid var(--white2);padding-top:8px">── 仲間の魔法使い ──</div>`;
  wizNPCs.forEach(({m,i})=>{
   const mKnown = new Set((m.spells||[]).map(s=>s.name));
   const mAvailFor = lv => SPELL_LEVEL_TABLES[lv].filter(s=>!mKnown.has(s.name));
   const mOkFor = lv => { const r=SPELL_LEVEL_REQS[lv]; return (m.iq||0)>=r.iq && (m.dex||0)>=r.dex; };
   const mAllAvail = [2,3,4,5,6,7].flatMap(lv=>mAvailFor(lv).map(sp=>({sp,lv})));
   txt += `<div style="background:#110c06;border:1px solid #585858;border-radius:4px;padding:8px;margin-bottom:8px">`;
   txt += `<div style="font-size:calc(var(--font-sm) - 1px);color:#e8e0d0;margin-bottom:6px"> ${m.name}（Lv${m.level||1}・知力${m.iq}・器用さ${m.dex}）</div>`;
   if(mAllAvail.length===0){
    txt += `<div style="font-size:calc(var(--font-sm) - 1px);color:#c8b8a0">習得可能な呪文はすべて習得済み</div>`;
   }
   mAllAvail.forEach(({sp,lv})=>{
    const can = mOkFor(lv) && npcAvailableCP(m, PC.town)>=sp.learnCost*100;
    const dis = can?'':'disabled';
    const r = SPELL_LEVEL_REQS[lv];
    txt += `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
    <div><div style="font-size:calc(var(--font-sm) - 1px);color:${can?'#e8e0d0':'var(--info-border)'}"> [Lv${lv}] ${sp.name}</div>
    <div style="font-size:calc(var(--font-sm) - 2px);color:#c8b8a0">${sp.desc}</div>
    ${!can?`<div style="font-size:calc(var(--font-sm) - 3px);color:#f0ddd8">${((m.iq||0)<r.iq||(m.dex||0)<r.dex)?'能力値不足':'GP不足（両替所を含む）'}</div>`:''}</div>
    <button onclick="npcLearnSpell(${i},'${sp.name}',${lv},false)" ${dis}
     style="font-size:calc(var(--font-sm) - 3px);padding:5px 8px;background:${can?'var(--ink)':'#110c06'};border:1px solid ${can?'var(--white2)':'var(--info-border)'};color:${can?'#e8e0d0':'var(--info-border)'};font-family:system-ui,sans-serif;cursor:${can?'pointer':'default'};border-radius:2px;opacity:${can?1:0.5}"
     >${sp.learnCost}GP</button></div>`;
   });
   txt += `</div>`;
  });
 }

 return txt;
 },
 choices:()=>[{label:'← 街に戻る', go:'TOWN_'+PC.town.toUpperCase()}],
 },


  ROGUES_GUILD:{
 scene:'town_khazan',
 txt:()=>{
  const actor = _guildActor || PC;
  if(actor.type !== 'rogue') return ` <span style="color:#f0ece0">盗賊ギルド</span><br><br><span class="red">盗賊のみ入会できます。</span>`;
  const known = new Set((actor.spells||[]).map(s=>s.name));
  const req1 = {iq:10, dex:8};
  const reqFor = lv => lv===1 ? req1 : SPELL_LEVEL_REQS[lv];
  const costFor = lv => lv===1 ? 500 : SPELL_LEVEL_TABLES[lv][0]?.learnCost*2;
  const availFor = lv => (lv===1?SPELLS_L1:SPELL_LEVEL_TABLES[lv]).filter(s=>!known.has(s.name));
  const okFor = lv => { const r=reqFor(lv); return (actor.iq||0)>=r.iq && (actor.dex||0)>=r.dex; };
  let txt = ` <span class="gold" style="font-size:var(--font-base)">盗賊ギルド</span>`;
  txt += actor !== PC ? ` <span style="color:#e0d8c8;font-size:calc(var(--font-sm) - 2px)">[${actor.name}]</span>` : '';
  txt += `<br><br><span style="color:#c0b098">薄暗い隠し部屋。ギルドマスターが低い声で迎える。「呪文の知識を売ろう——ただし二倍の値だ」</span><br><br>`;
  txt += `<b>習得費用：</b><br>`;
  [1,2,3,4].forEach(lv=>{
   const r = reqFor(lv);
   txt += `  Lv${lv}呪文: 知力≥${r.iq}・器用さ≥${r.dex}・各${costFor(lv)}GP　${okFor(lv)?'<span style="color:#e8e4d8"></span>':'<span class="red"></span>'}<br>\n`;
  });
  txt += `  所持金: ${actor.gold||0}GP ${actor.sp||0}SP ${actor.cp||0}CP<br><br>`;

  const spellRow = (sp, lv, cost, canLearn, reason) =>
   `<div style="background:#060e06;border:1px solid ${canLearn?'var(--nature-border)':'#221122'};border-radius:3px;padding:8px;margin-bottom:5px;display:flex;justify-content:space-between;align-items:center;gap:8px">
    <div>
     <div style="font-size:calc(var(--font-sm) - 1px);color:${canLearn?'#f0ece0':'#808080'}"> [Lv${lv}] ${sp.name}</div>
     <div style="font-size:calc(var(--font-sm) - 2px);color:#c8b8a0;margin-top:2px">${sp.desc}</div>
     ${reason?`<div style="font-size:calc(var(--font-sm) - 3px);color:#f0ddd8;margin-top:2px"> ${reason}</div>`:''}
    </div>
    <button onclick="learnSpellRogue('${sp.name}',${lv})"
     style="flex-shrink:0;font-size:calc(var(--font-sm) - 3px);padding:6px 10px;background:${canLearn?'var(--nature-bg)':'#060e06'};border:1px solid ${canLearn?'var(--nature-border)':'var(--nature-border)'};color:${canLearn?'#f0ece0':'#808080'};font-family:system-ui,sans-serif;cursor:${canLearn?'pointer':'default'};border-radius:2px">
     ${cost}GP
    </button>
   </div>`;

  let anyAvail = false;
  [1,2,3,4].forEach(lv=>{
   const avail = availFor(lv);
   if(avail.length>0){
    anyAvail = true;
    txt += `<div style="font-size:calc(var(--font-sm) - 2px);color:#f0ece0;margin-bottom:6px">── Level ${lv} 呪文 ──</div>`;
    avail.forEach(sp=>{
     const cost = costFor(lv);
     const can = okFor(lv) && npcAvailableCP(actor, PC.town)>=cost*100;
     const reason = !can?(!okFor(lv)?'能力値不足':'GP不足（両替所を含む）'):'';
     txt += spellRow(sp,lv,cost,can,reason);
    });
    txt += '<br>';
   }
  });
  if(!anyAvail){
   txt += '<span style="color:#e8e4d8">習得可能な呪文はすべて習得済みです。</span>';
  }

  // パーティのrogue NPCがいれば表示
  const rogueNPCs = actor===PC ? (PC.party||[]).map((m,i)=>({m,i})).filter(({m})=>m.type==='rogue'&&m.con>0) : [];
  if(rogueNPCs.length>0){
   txt += `<br><div style="font-size:calc(var(--font-sm) - 2px);color:#f0ece0;margin-bottom:6px;border-top:1px solid var(--nature-border);padding-top:8px">── 仲間の盗賊 ──</div>`;
   rogueNPCs.forEach(({m,i})=>{
    const mKnown = new Set((m.spells||[]).map(s=>s.name));
    const mAvailFor = lv => (lv===1?SPELLS_L1:SPELL_LEVEL_TABLES[lv]).filter(s=>!mKnown.has(s.name));
    const mAllAvail = [1,2,3,4].flatMap(lv=>mAvailFor(lv).map(sp=>({sp,lv})));
    txt += `<div style="background:#060e06;border:1px solid #505050;border-radius:4px;padding:8px;margin-bottom:8px">`;
    txt += `<div style="font-size:calc(var(--font-sm) - 1px);color:#f0ece0;margin-bottom:6px"> ${m.name}（Lv${m.level||1}・知力${m.iq}・器用さ${m.dex}）</div>`;
    if(mAllAvail.length===0){
     txt += `<div style="font-size:calc(var(--font-sm) - 1px);color:#c8b8a0">習得可能な呪文はすべて習得済み</div>`;
    }
    mAllAvail.forEach(({sp,lv})=>{
     const r = reqFor(lv);
     const cost = costFor(lv);
     const can=(m.iq||0)>=r.iq&&(m.dex||0)>=r.dex&&npcAvailableCP(m, PC.town)>=cost*100;
     const disR=can?'':'disabled';
     txt += `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
      <div><div style="font-size:calc(var(--font-sm) - 1px);color:${can?'#f0ece0':'#808080'}"> [Lv${lv}] ${sp.name}</div>
      <div style="font-size:calc(var(--font-sm) - 2px);color:#c8b8a0">${sp.desc}</div>
      ${!can?`<div style="font-size:calc(var(--font-sm) - 3px);color:#f0ddd8">${((m.iq||0)<r.iq||(m.dex||0)<r.dex)?'能力値不足':'GP不足（両替所を含む）'}</div>`:''}</div>
      <button onclick="npcLearnSpell(${i},'${sp.name}',${lv},true)" ${disR}
       style="font-size:calc(var(--font-sm) - 3px);padding:5px 8px;background:${can?'var(--nature-bg)':'#060e06'};border:1px solid ${can?'var(--nature-border)':'var(--nature-border)'};color:${can?'#f0ece0':'#808080'};font-family:system-ui,sans-serif;cursor:${can?'pointer':'default'};border-radius:2px;opacity:${can?1:0.5}"
       >${cost}GP</button></div>`;
    });
    txt += `</div>`;
   });
  }

  return txt;
 },
 choices:()=>[{label:'← 街に戻る', go:'TOWN_'+PC.town.toUpperCase()}],
 },

 // ══════════════════════════════════════════
 //  古代遺跡「ザール・カノンの墓所」
 // マップ構造：
 //
 // [入口]
 // |
 // [大部屋A: 北西] ──通常扉── [部屋B: 北東]
 // |
 // 通常扉
 // |
 // [小部屋C: 中央] ────────── [部屋D: 東]
 // | |
 // └──────────────────────────────┘
 // |
 // 通常扉
 // |
 // [鉄格子:西行き止まり] ── [大部屋E: 南西] ── 通常扉 ── [部屋F: 南東]
 // |
 // [鉄格子:南行き止まり]
 // ══════════════════════════════════════════

 RUIN_ENTRANCE:{
 scene:'dungeon',
 txt:()=>{
 const torches = countTorches();
 const torchMsg = torches > 0
 ? `<span style="color:#e8e4d8"> 松明を ${torches}本 持っている。</span>`
 : `<span class="red"> 松明を持っていない！暗闇の中を進むことになる。</span>`;
 return ` <span class="gold" style="font-size:var(--font-base)">古代遺跡「ザール・カノンの墓所」</span><br><br>
 ストーンヘイムから半日ほど歩いた山の中腹に、石造りの入口がある。<br>
 苔むした石柱が左右に立ち、その間に黒い闇が広がっている。<br>
 冷たい空気が漏れ出し、古代の埃の匂いがする。<br><br>
 ${torchMsg}<br>
 <span style="color:#c0b098">入口の石には読めない古代文字が刻まれている。</span>`;
 },
 choices:[
 {label:' 中に入る', fn:()=>{ initTorch(); ruinMove('RUIN_P1'); }},
 {label:'← ストーンヘイムへ戻る', go:'TOWN_STONEHIEM'},
 ],
 },

 // ── 暗闇脱出ノード ──────────────────────────
 RUIN_DARK_ESCAPE:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0"></span><br><br>
 <span style="color:var(--white2)">松明が切れた。完全な暗闇の中、壁を手探りで進む。出口まで帰り着けるか……</span>`,
 choices:()=>[{label:' もう一度出口を探す（運 Lv3 能力値テスト）', fn:()=>{
  setupSavingRoll({
   attr:'lk', level:3,
   onSuccess:()=>{
    const s = document.getElementById('story');
    s.innerHTML = `<span style="color:#f0ece0"></span><br><br>
     壁を伝いながら必死に出口を探した。冷や汗をかきながらも、かすかな外の光を頼りにやっと入口へたどり着いた！`;
    renderChoices([{label:' 入口の光の方へ歩いた', go:'RUIN_ENTRANCE'}]);
    scrollToTop();
   },
   onFail:()=>{
    const dmg = 5;
    PC.con -= dmg; updateHUD();
    const s = document.getElementById('story');
    if(PC.con <= 0){
     s.innerHTML = `<span style="color:#f0ece0"></span><br><br>闇の中で足を踏み外し、石の床に叩きつけられた。動けない……`;
     renderChoices([{label:'…（力尽きた）', go:'DEAD'}]);
    } else {
     s.innerHTML = `<span style="color:#f0ece0"></span><br><br>出口を探して歩いていると、段差に気づかず転倒した。石床に激しく打ちつける。<br><br>体力-${dmg}　（残り ${PC.con}）<br><br>痛みをこらえながら、また出口を探す…`;
     renderChoices([{label:' もう一度出口を探す（運 Lv3 能力値テスト）', go:'RUIN_DARK_ESCAPE'}]);
    }
    scrollToTop();
   },
  });
 }}],
 },

 // ── 大部屋A（北西）──────────────────────────
 RUIN_A:{
 scene:'dungeon',
 txt:`<span style="color:#f0ece0"></span><br><br>
 天井が高く、四方の壁に古代の壁画が描かれている。戦争と思われる場面が連続して刻まれており、甲冑を纏った兵士たちが行進している。<br>
 床には分厚く砂埃が積もり、長い年月の静寂が漂っている。<br><br>
 <span style="color:#c0b098">━ 出口: 北（入口）・東（扉）・南（扉） ━</span>`,
 choices:[
 {label:' 東の扉へ', go:'RUIN_AB_DOOR'},
 {label:'⬇ 南の扉へ', go:'RUIN_AC_DOOR'},
 {label:'⬆ 北（入口）へ', go:'RUIN_ENTRANCE'},
 ],
 },

 RUIN_AB_DOOR:{
 scene:'dungeon',
 txt:`<span style="color:#f0ece0"></span><br><br>
 重い石造りの扉だが、押すと軋みながら開いた。<br>
 向こうには通路が続いている。`,
 choices:[
 {label:' 東の通路', go:'RUIN_B'},
 {label:'⬅ 西の大広間へ', go:'RUIN_A'},
 ],
 },

 RUIN_AC_DOOR:{
 scene:'dungeon',
 txt:`<span style="color:#f0ece0"></span><br><br>
 鉄製の取っ手がついた石扉だ。引くと重い音を立てて開いた。<br>
 細い通路の先に小さな部屋が見える。`,
 choices:[
 {label:'⬇ 南の通路', go:'RUIN_C'},
 {label:'⬆ 北の大広間へ', go:'RUIN_A'},
 ],
 },

 // ── 部屋B（北東）──────────────────────────
 RUIN_B:{
 scene:'dungeon',
 txt:`<span style="color:#f0ece0"></span><br><br>
 壁一面に古代語の文字が刻まれている。図形と数字のようなものが混じっており、何かの記録か記念碑のようだ。中央には石造りの台座があるが、上に置かれていたものはすでに失われている。<br><br>
 `,
 choices:[
 {label:'⬅ 西の扉', go:'RUIN_AB_DOOR'},
 {label:'⬇ 南の通路', go:'RUIN_D'},
 ],
 },

 // ── 小部屋C（中央）──────────────────────────
 RUIN_C:{
 scene:'dungeon',
 txt:`<span style="color:#f0ece0"></span><br><br>
 天井が低く圧迫感のある小部屋だ。天井から水が滴り落ち、床は濡れている。壁には緑色の苔が生え、石の棚に陶器の破片が散らばっている。床の中央には古い魔法陣のような模様が刻まれている。<br><br>
 `,
 choices:[
 {label:'⬆ 北の扉', go:'RUIN_AC_DOOR'},
 {label:' 東の通路', go:'RUIN_D'},
 ],
 },

 // ── 部屋D（東）──────────────────────────
 RUIN_D:{
 scene:'dungeon',
 txt:`<span style="color:#f0ece0"></span><br><br>
 通路が十字に交わる広めの部屋だ。四方の壁に守護神と思われる浮き彫りが施されており、目の部分に赤い宝石が嵌め込まれている。暗闇の中でかすかに光って見える。床の一部が抜け落ちており、黒い穴から風の音が聞こえてくる。<br><br>
 `,
 choices:[
 {label:'⬆ 北の通路', go:'RUIN_B'},
 {label:'⬅ 西の通路', go:'RUIN_C'},
 {label:'⬇ 南の扉', go:'RUIN_DE_DOOR'},
 ],
 },

 RUIN_DE_DOOR:{
 scene:'dungeon',
 txt:`<span style="color:#f0ece0"></span><br><br>
 これまでの扉より明らかに重厚な石扉だ。<br>
 両手で押すと、石が石を削る轟音が響き渡り、ゆっくりと開いた。<br>
 先からひんやりとした空気が流れ込んでくる。`,
 choices:[
 {label:'⬇ 南へ進む', go:'RUIN_E'},
 {label:'⬆ 北の通路へ', go:'RUIN_D'},
 ],
 },

 // ── 大部屋E（南西）──────────────────────────
 RUIN_E:{
 scene:'dungeon',
 txt:`<span style="color:#f0ece0"></span><br><br>
 遺跡最大の広間だ。天井は高く、中央に巨大な石柱が4本そびえ立っている。柱には古代の戦士たちの像が刻まれており、今にも動き出しそうな迫力がある。床には大きな石板が敷き詰められており、中央部に古代文字で埋め尽くされた巨大な祭壇が置かれている。<br><br>
 <span style="color:#c0b098">━ 出口: 北（重扉・部屋Dへ）・西（鉄格子）・東（扉・部屋Fへ） ━</span>`,
 choices:[
 {label:'⬆ 北の重扉', go:'RUIN_DE_DOOR'},
 {label:'⬅ 西の鉄格子を調べる', go:'RUIN_E_WEST_GATE'},
 {label:' 東の扉', go:'RUIN_EF_DOOR'},
 ],
 },

 RUIN_E_WEST_GATE:{
 scene:'dungeon',
 txt:()=>{
 if(PC._ruinWestGateOpen){
 return `<span style="color:#f0ece0"></span><br><br>
 こじ開けた鉄格子の向こうに暗い小部屋がある。<br>
 `;
 }
 return `<span style="color:#f0ece0"></span><br><br>
 太い鉄の棒が格子状に組まれた扉だ。鍵穴はあるが、鍵はない。<br>
 格子の向こうに小さな部屋が見える。何か置かれているようだが暗くて見えない。<br><br>
 <span style="color:#c0b098">力ずくでこじ開けますか？（強さ Lv1 能力値テスト）</span>`;
 },
 choices:()=>[
 ...(PC._ruinWestGateOpen
 ? [{label:' 小部屋を調べる', go:'RUIN_E_WEST_ROOM'}]
 : [{label:' 力ずくでこじ開ける（強さ Lv1 能力値テスト）', fn:()=>dungeonTrySR({ attr:'st', level:1, flagKey:'_ruinWestGateOpen', successTxt:()=>`<b>鉄格子をこじ開けた</b><br>全体重をかけて押し続けると、錆びた蝶番が悲鳴を上げ、鉄格子がゆっくり倒れた。`, failFn:(actor)=>{ const dmg=Math.floor(Math.random()*4)+1; actor.con=Math.max(0,actor.con-dmg); if(actor===PC)PC.con=actor.con; updateHUD(); PC._westForceDmg=dmg; }, failTxt:()=>`<b>鉄格子は動かない</b><br>力いっぱい押したが、びくともしない。手を痛めた。CON -${PC._westForceDmg||0}`, choicesFn:(ok)=>ok?[{label:' 小部屋を調べる',go:'RUIN_E_WEST_ROOM'},{label:'⬅ 西の大広間へ',go:'RUIN_E'}]:[{label:' もう一度こじ開ける（強さ Lv1 能力値テスト）',fn:()=>dungeonTrySR({attr:'st',level:1,flagKey:'_ruinWestGateOpen',successTxt:()=>`<b>鉄格子をこじ開けた</b><br>倒れた。`,failFn:(actor)=>{const dmg=Math.floor(Math.random()*4)+1;actor.con=Math.max(0,actor.con-dmg);if(actor===PC)PC.con=actor.con;updateHUD();PC._westForceDmg=dmg;},failTxt:()=>`<b>まだ動かない</b><br>CON -${PC._westForceDmg||0}`,choicesFn:(ok)=>ok?[{label:' 小部屋を調べる',go:'RUIN_E_WEST_ROOM'},{label:'⬅ 大広間へ',go:'RUIN_E'}]:[{label:' 再挑戦',go:'RUIN_E_WEST_FORCE'},{label:'⬅ 大広間へ',go:'RUIN_E'}]}),},{label:'⬅ 西の大広間へ',go:'RUIN_E'}] })}]
 ),
 {label:'⬅ 西の大広間へ', go:'RUIN_E'},
 ],
 },

 RUIN_E_WEST_FORCE:{
 scene:'dungeon',
 txt:()=>{
  dungeonTrySR({
   attr:'st', level:1, flagKey:'_ruinWestGateOpen',
   successTxt:()=>`<span style="color:#f0ece0">鉄格子をこじ開けた</span><br><br>全体重をかけて押し続けると、錆びた蝶番が悲鳴を上げ、鉄格子がゆっくり倒れた。`,
   failFn:(actor)=>{ const dmg=Math.floor(Math.random()*4)+1; actor.con=Math.max(0,(actor===PC?PC.con:actor.con)-dmg); if(actor===PC)PC.con=actor.con; updateHUD(); PC._ruinWestDmg=dmg; },
   failTxt:()=>`<span style="color:#f0ece0">鉄格子は動かない</span><br><br>力いっぱい押したが、鉄格子はびくともしない。手を痛めてしまった。CON -${PC._ruinWestDmg||0}`,
   choicesFn:(ok)=> ok
    ? [{label:' 小部屋を調べる', go:'RUIN_E_WEST_ROOM'},{label:'⬅ 西の大広間へ', go:'RUIN_E'}]
    : [{label:' もう一度こじ開ける（強さ Lv1 能力値テスト）', fn:()=>dungeonTrySR({attr:'st',level:1,flagKey:'_ruinWestGateOpen',successTxt:()=>`<b>鉄格子をこじ開けた</b><br>全体重をかけると、錆びた蝶番が悲鳴を上げ、鉄格子が倒れた。`,failFn:(actor)=>{const dmg=Math.floor(Math.random()*4)+1;actor.con=Math.max(0,actor.con-dmg);if(actor===PC)PC.con=actor.con;updateHUD();PC._westForceDmg=dmg;},failTxt:()=>`<b>鉄格子は動かない</b><br>CON -${PC._westForceDmg||0}`,choicesFn:(ok)=>ok?[{label:' 小部屋を調べる',go:'RUIN_E_WEST_ROOM'},{label:'⬅ 西の大広間へ',go:'RUIN_E'}]:[{label:' もう一度こじ開ける（強さ Lv1 能力値テスト）',go:'RUIN_E_WEST_FORCE'},{label:'⬅ 西の大広間へ',go:'RUIN_E'}]})},{label:'⬅ 西の大広間へ', go:'RUIN_E'}],
  }); return '';
 },
 choices:()=>[
  ...(PC._ruinWestGateOpen
   ? [{label:' 小部屋を調べる', go:'RUIN_E_WEST_ROOM'}]
   : [{label:' もう一度こじ開ける', go:'RUIN_E_WEST_FORCE'}]
  ),
  {label:'⬅ 西の大広間へ', go:'RUIN_E'},
 ],
 },

 RUIN_E_WEST_ROOM:{
 scene:'dungeon',
 txt:`<span style="color:#f0ece0"></span><br><br>
 狭い石室だ。かつて武器庫として使われていたのか、武器掛けの跡が壁に残っている。床の隅に古びた兵士の骨が横たわっており、傍らに錆びた剣の残骸がある。出口はここまでだ。<br><br>
 <span style="color:#c0b098">━ 行き止まり ━</span>`,
 choices:[
 {label:'⬅ 西の鉄格子へ', go:'RUIN_E_WEST_GATE'},
 ],
 },

 RUIN_EF_DOOR:{
 scene:'dungeon',
 txt:`<span style="color:#f0ece0"></span><br><br>
 石造りだが比較的新しそうな扉だ。押すとすんなり開いた。<br>
 向こうには通路が伸びている。`,
 choices:[
 {label:' 東の通路へ', go:'RUIN_F'},
 {label:'⬅ 西の大広間へ', go:'RUIN_E'},
 ],
 },

 // ── 部屋F（南東）──────────────────────────
 RUIN_F:{
 scene:'dungeon',
 txt:`<span style="color:#f0ece0"></span><br><br>
 石壁に細かな幾何学模様が彫り込まれた部屋だ。床の石畳は丁寧に磨かれており、この部屋だけは他と比べて保存状態が良い。壁に沿って低い石の腰掛けが続いており、かつては多くの人が集まっていたのかもしれない。南の壁に鉄格子の扉がある。<br><br>
 <span style="color:#c0b098">━ 出口: 西（扉・大部屋Eへ）・南（鉄格子） ━</span>`,
 choices:[
 {label:'⬅ 西の扉', go:'RUIN_EF_DOOR'},
 {label:'⬇ 南の鉄格子を調べる', go:'RUIN_F_SOUTH_GATE'},
 ],
 },

 RUIN_F_SOUTH_GATE:{
 scene:'dungeon',
 txt:()=>{
 if(PC._ruinSouthGateOpen){
 return `<span style="color:#f0ece0"></span><br><br>
 こじ開けた格子の先に小さな石室が続いている。<br>
 `;
 }
 return `<span style="color:#f0ece0"></span><br><br>
 錆びた鉄格子がはまった扉だ。向こうに小さな石室が見える。<br>
 格子の間から冷たい風が吹いてくる。<br><br>
 <span style="color:#c0b098">力ずくでこじ開けますか？（強さ Lv1 能力値テスト）</span>`;
 },
 choices:()=>[
 ...(PC._ruinSouthGateOpen
 ? [{label:'⬇ 石室へ進む', go:'RUIN_F_SOUTH_ROOM'}]
 : [{label:' 力ずくでこじ開ける（強さ Lv1 能力値テスト）', fn:()=>dungeonTrySR({ attr:'st', level:1, flagKey:'_ruinSouthGateOpen', successTxt:()=>`<b>格子をこじ開けた</b><br>格子に肩を当てて体重をかけると、腐食した蝶番が外れ、扉が倒れた。`, failFn:(actor)=>{ const dmg=Math.floor(Math.random()*4)+1; actor.con=Math.max(0,actor.con-dmg); if(actor===PC)PC.con=actor.con; updateHUD(); PC._southForceDmg=dmg; }, failTxt:()=>`<b>格子は動かない</b><br>渾身の力で押したが、格子はびくともしない。CON -${PC._southForceDmg||0}`, choicesFn:(ok)=>ok?[{label:'⬇ 石室へ進む',go:'RUIN_F_SOUTH_ROOM'},{label:'⬆ 北の石室へ',go:'RUIN_F'}]:[{label:' もう一度こじ開ける（強さ Lv1 能力値テスト）',go:'RUIN_F_SOUTH_FORCE'},{label:'⬆ 北の石室へ',go:'RUIN_F'}] })}]
 ),
 {label:'⬆ 北の石室へ', go:'RUIN_F'},
 ],
 },

 RUIN_F_SOUTH_FORCE:{
 scene:'dungeon',
 txt:()=>{
  dungeonTrySR({
   attr:'st', level:1, flagKey:'_ruinSouthGateOpen',
   successTxt:()=>`<span style="color:#f0ece0">格子をこじ開けた</span><br><br>格子に肩を当てて体重をかけると、腐食した蝶番が外れ、扉が倒れた。`,
   failFn:(actor)=>{ const dmg=Math.floor(Math.random()*4)+1; actor.con=Math.max(0,(actor===PC?PC.con:actor.con)-dmg); if(actor===PC)PC.con=actor.con; updateHUD(); PC._ruinSouthDmg=dmg; },
   failTxt:()=>`<span style="color:#f0ece0">格子は動かない</span><br><br>渾身の力で押したが、格子はびくともしない。壁に手をぶつけてしまった。CON -${PC._ruinSouthDmg||0}`,
   choicesFn:(ok)=> ok
    ? [{label:'⬇ 石室へ進む', go:'RUIN_F_SOUTH_ROOM'},{label:'⬆ 北の石室へ', go:'RUIN_F'}]
    : [{label:' もう一度こじ開ける（強さ Lv1 能力値テスト）', fn:()=>dungeonTrySR({attr:'st',level:1,flagKey:'_ruinSouthGateOpen',successTxt:()=>`<b>格子をこじ開けた</b><br>格子に肩を当てると、腐食した蝶番が外れ、扉が倒れた。`,failFn:(actor)=>{const dmg=Math.floor(Math.random()*4)+1;actor.con=Math.max(0,actor.con-dmg);if(actor===PC)PC.con=actor.con;updateHUD();PC._southForceDmg=dmg;},failTxt:()=>`<b>格子は動かない</b><br>CON -${PC._southForceDmg||0}`,choicesFn:(ok)=>ok?[{label:'⬇ 石室へ進む',go:'RUIN_F_SOUTH_ROOM'},{label:'⬆ 北の石室へ',go:'RUIN_F'}]:[{label:' もう一度こじ開ける（強さ Lv1 能力値テスト）',go:'RUIN_F_SOUTH_FORCE'},{label:'⬆ 北の石室へ',go:'RUIN_F'}]})},{label:'⬆ 北の石室へ', go:'RUIN_F'}],
  }); return '';
 },
 choices:()=>[
  ...(PC._ruinSouthGateOpen
   ? [{label:'⬇ 石室へ進む', go:'RUIN_F_SOUTH_ROOM'}]
   : [{label:' もう一度こじ開ける', go:'RUIN_F_SOUTH_FORCE'}]
  ),
  {label:'⬆ 北の石室へ', go:'RUIN_F'},
 ],
 },

 RUIN_F_SOUTH_ROOM:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">石棺の間</span><br><br>
  奥行きのある細長い石室だ。最奥の壁に紋章が刻まれている。盾を持つ騎士の図で、この遺跡を建てた一族のものだろうか。<br>
  床の中央には大きな石棺が置かれており、蓋はずれて中は空だ。<br>
  よく見ると、石棺の脇の床石が他と微妙に色が違う。踏み込むと、かすかに沈む感触がある。<br><br>
  ${PC._shm2_b2_found ? '<span style="color:#e0d8c8"> 地下2Fへ続く石段が口を開けている。</span>' : '<span style="color:#c0b098">━ 出口: 北（鉄格子）━</span>'}`,
 choices:()=>{
  const ch = [];
  if(!PC._shm2_b2_found){
   ch.push({label:' 怪しい床石を踏み込む', fn:()=>{
    PC._shm2_b2_found = true;
    const s = document.getElementById('story');
    s.innerHTML = `<span style="color:#f0ece0">石棺の間 — 隠し階段</span><br><br>
     床石が音を立てて沈み込み、石棺が横にスライドした。その下に、下層へ続く急な石段が現れた。<br>
     冷たい空気が一気に吹き上がってくる。<br>
     <span style="color:#e0d8c8"> 地下2Fへの通路を発見した。</span>`;
    renderChoices([{label:'↓ 地下2Fへ', fn:()=>initTorch(), go:'SHM2_STAIRS'}, {label:'⬆ 北（鉄格子）へ戻る', go:'RUIN_F_SOUTH_GATE'}]);
    scrollToTop();
   }});
  } else {
   ch.push({label:'↓ 地下2Fへ', fn:()=>initTorch(), go:'SHM2_STAIRS'});
  }
  ch.push({label:'⬆ 北（鉄格子）へ戻る', go:'RUIN_F_SOUTH_GATE'});
  return ch;
 },
 },


 TRAVEL_FROM_STONE:{
 scene:'travel',
 txt:()=>`<span style="color:#e0d8c8">ストーンヘイム</span>からの旅立ち<br><br>
 
 <span style="color:#c0b098">どこへ向かいますか？</span>`,
 choices:()=>makeTravelChoices(PC.town||'stonehiem'),
 },

 // ══════════════════════════════════════════
 //  エルシア（魔法都市）
 // ══════════════════════════════════════════
 // ════════════════════════════════════════
 // ドラクリム山脈地方
 // ════════════════════════════════════════
 TOWN_YELDUN:{
 scene:'town_mountain_city',
 txt:()=>{
  const t=TOWNS.yeldun;
  return `<span style="color:#e0d8c8;font-size:calc(var(--font-base) + 1px)"> ${t.name}</span>　<span class="dim" style="font-size:calc(var(--font-lg) + 4px)">${t.size}</span>${popTimeOfDayMsg('yeldun')}<br>
  ${popWeatherMsg('yeldun')}
  ${popDeliveryMsg()}<br>
  <span style="color:#c0b098">${t.desc}</span><br>${popHeroMsg()}${popInfamyMsg()}${popRegionHeroMsg()}${popRegionInfamyMsg()}${popRegionEvalMsg()}${popRaidUnitMsg()}<br>${renderTrustBadge(PC.town)}${hasProperty(PC.town)?'　<span style="color:#f0ece0"> 拠点あり</span>':''}` ;
 },
 choices:[
  {label:' 武器屋・装備店', go:'SHOP_YELDUN'},
  {label:' 酒場（岩場酒場）', go:'TAVERN_YELDUN'},
  {label:' 宿屋（6GP・1日休む）', fn:()=>{ innRest(600); }, go:'TOWN_YELDUN'},
  {label:' 旅に出る（移動）', go:'TRAVEL_FROM_YELDUN'},
  {label:' その他の行動', fn:()=>goOtherActions('yeldun')},
 ]
 },

 TRAVEL_FROM_YELDUN:{
 scene:'travel',
 txt:()=>`<span style="color:#e0d8c8">イェルドゥン</span>からの旅立ち<br><br>
 
 <span style="color:#c0b098">山岳を越えていく旅路…</span>`,
 choices:()=>makeTravelChoices(PC.town||'yeldun'),
 },

 TOWN_FROSTPEAK:{
 scene:'town_mountain_village',
 txt:()=>{
  const t=TOWNS.frostpeak;
  return `<span style="color:#e0d8c8;font-size:calc(var(--font-base) + 1px)"> ${t.name}</span>　<span class="dim" style="font-size:calc(var(--font-lg) + 4px)">${t.size}</span>${popTimeOfDayMsg('frostpeak')}<br>
  ${popWeatherMsg('frostpeak')}
  ${popDeliveryMsg()}<br>
  <span style="color:#c0b098">${t.desc}</span><br>${popHeroMsg()}${popInfamyMsg()}${popRegionHeroMsg()}${popRegionInfamyMsg()}${popRegionEvalMsg()}${popRaidUnitMsg()}<br>${renderTrustBadge(PC.town)}${hasProperty(PC.town)?'　<span style="color:#f0ece0"> 拠点あり</span>':''}` ;
 },
 choices:[
  {label:' 道具屋（毛皮・山岳装備）', go:'SHOP_FROSTPEAK'},
  {label:' 酒場（霜峰の宿屋酒場）', go:'TAVERN_FROSTPEAK'},
  {label:' 宿屋（5GP・1日休む）', fn:()=>{ innRest(500); }, go:'TOWN_FROSTPEAK'},
   {label:' 旅に出る（移動）', go:'TRAVEL_FROM_FROSTPEAK'},
  {label:' その他の行動', fn:()=>goOtherActions('frostpeak')},
 ]
 },

 TRAVEL_FROM_FROSTPEAK:{
 scene:'travel',
 txt:()=>`<span style="color:#e0d8c8">フロストピーク</span>からの旅立ち<br><br>
 
 <span style="color:#c0b098">霧と雪の山道を行く…</span>`,
 choices:()=>makeTravelChoices(PC.town||'frostpeak'),
 },

 TOWN_ASHVEIL:{
 scene:'town_mountain_village',
 txt:()=>{
  const t=TOWNS.ashveil;
  return `<span style="color:#e0d8cc;font-size:calc(var(--font-base) + 1px)"> ${t.name}</span>　<span class="dim" style="font-size:calc(var(--font-lg) + 4px)">${t.size}</span>${popTimeOfDayMsg('ashveil')}<br>
  ${popWeatherMsg('ashveil')}
  ${popDeliveryMsg()}<br>
  <span style="color:#c0b098">${t.desc}</span><br>${popHeroMsg()}${popInfamyMsg()}${popRegionHeroMsg()}${popRegionInfamyMsg()}${popRegionEvalMsg()}${popRaidUnitMsg()}<br>${renderTrustBadge(PC.town)}${hasProperty(PC.town)?'　<span style="color:#f0ece0"> 拠点あり</span>':''}` ;
 },
 choices:[
  {label:' 鍛冶屋（黒曜石・鉄製品）', go:'SHOP_ASHVEIL'},
  {label:' 酒場（灰の村の鍛冶場酒場）', go:'TAVERN_ASHVEIL'},
  {label:' 宿屋（4GP・1日休む）', fn:()=>{ innRest(400); }, go:'TOWN_ASHVEIL'},
  {label:' 旅に出る（移動）', go:'TRAVEL_FROM_ASHVEIL'},
  {label:' その他の行動', fn:()=>goOtherActions('ashveil')},
 ]
 },

 TRAVEL_FROM_ASHVEIL:{
 scene:'travel',
 txt:()=>`<span style="color:#e0d8cc">アッシュヴェイル</span>からの旅立ち<br><br>
 
 <span style="color:#c0b098">硫黄の煙が漂う山道を出発する…</span>`,
 choices:()=>makeTravelChoices(PC.town||'ashveil'),
 },

 // ══ ヴァルドヘイム地方 ══════════════════════════
 TOWN_VALDHEIM:{
 scene:'town_stone',
 txt:()=>{
  const t=TOWNS.valdheim;
  const winterWarn = isWinter() ? `<br><span style="color:#e0d8c8;font-size:calc(var(--font-sm) - 1px)"> 冬期：エルマリアへのルートは雪で遮断されています</span>` : '';
  const frostLvl = getFrostbiteLevel();
  const frostWarn = frostLvl > 0 ? `<br><span style="color:${frostLvl>=3?'#ff6644':'var(--info2)'};font-size:calc(var(--font-sm) - 1px)"> 凍傷状態（${FROSTBITE_EFFECTS[frostLvl].label}）── 宿屋で回復できる</span>` : '';
  return `<span style="color:#e0d8c8;font-size:calc(var(--font-base) + 1px)"> ${t.name}</span>　<span class="dim" style="font-size:calc(var(--font-lg) + 4px)">${t.size}</span>${popTimeOfDayMsg('valdheim')}<br>
  ${popWeatherMsg('valdheim')}
  ${popDeliveryMsg()}<br>
  <span style="color:#c0b098">${t.desc}</span><br>${popHeroMsg()}${popInfamyMsg()}${popRegionHeroMsg()}${popRegionInfamyMsg()}${popRegionEvalMsg()}${popRaidUnitMsg()}<br>${renderTrustBadge(PC.town)}${hasProperty(PC.town)?'　<span style="color:#f0ece0"> 拠点あり</span>':''}${winterWarn}${frostWarn}`;
 },
 choices:[
  {label:' 武具店（高品質武器・防寒装備）', go:'SHOP_VALDHEIM'},
  {label:' 酒場（氷壁の砦酒場）', go:'TAVERN_VALDHEIM'},
  {label:' 宿屋（6GP・1日休む）', fn:()=>{ innRest(600); }, go:'TOWN_VALDHEIM'},
  {label:' 旅に出る（移動）', go:'TRAVEL_FROM_VALDHEIM'},
  {label:' その他の行動', fn:()=>goOtherActions('valdheim')},
 ]},

 TOWN_NIFURVIK:{
 scene:'town_port',
 txt:()=>{
  const t=TOWNS.nifurvik;
  const frostLvl = getFrostbiteLevel();
  const frostWarn = frostLvl > 0 ? `<br><span style="color:${frostLvl>=3?'#ff6644':'var(--info2)'};font-size:calc(var(--font-sm) - 1px)"> 凍傷状態（${FROSTBITE_EFFECTS[frostLvl].label}）── 宿屋で回復できる</span>` : '';
  return `<span style="color:#e0d8c8;font-size:calc(var(--font-base) + 1px)"> ${t.name}</span>　<span class="dim" style="font-size:calc(var(--font-lg) + 4px)">${t.size}</span>${popTimeOfDayMsg('nifurvik')}<br>
  ${popWeatherMsg('nifurvik')}
  ${popDeliveryMsg()}<br>
  <span style="color:#c0b098">${t.desc}</span><br>${popHeroMsg()}${popInfamyMsg()}${popRegionHeroMsg()}${popRegionInfamyMsg()}${popRegionEvalMsg()}${popRaidUnitMsg()}<br>${renderTrustBadge(PC.town)}${hasProperty(PC.town)?'　<span style="color:#f0ece0"> 拠点あり</span>':''}${frostWarn}`;
 },
 choices:[
  {label:' 交易所（毛皮・魚油）', go:'SHOP_NIFURVIK'},
  {label:' 酒場（凍海の船乗り酒場）', go:'TAVERN_NIFURVIK'},
  {label:' 宿屋（5GP・1日休む）', fn:()=>{ innRest(500); }, go:'TOWN_NIFURVIK'},
  {label:' 旅に出る（移動）', go:'TRAVEL_FROM_NIFURVIK'},
  {label:' その他の行動', fn:()=>goOtherActions('nifurvik')},
 ]},

 TOWN_ISKALD:{
 scene:'town_mountain_village',
 txt:()=>{
  const t=TOWNS.iskald;
  const frostLvl = getFrostbiteLevel();
  const frostWarn = frostLvl > 0 ? `<br><span style="color:${frostLvl>=3?'#ff6644':'var(--info2)'};font-size:calc(var(--font-sm) - 1px)"> 凍傷状態（${FROSTBITE_EFFECTS[frostLvl].label}）── 宿屋で回復できる</span>` : '';
  return `<span style="color:#e0d8c8;font-size:calc(var(--font-base) + 1px)"> ${t.name}</span>　<span class="dim" style="font-size:calc(var(--font-lg) + 4px)">${t.size}</span>${popTimeOfDayMsg('iskald')}<br>
  ${popWeatherMsg('iskald')}
  ${popDeliveryMsg()}<br>
  <span style="color:#c0b098">${t.desc}</span><br>${popHeroMsg()}${popInfamyMsg()}${popRegionHeroMsg()}${popRegionInfamyMsg()}${popRegionEvalMsg()}${popRaidUnitMsg()}<br>${renderTrustBadge(PC.town)}${hasProperty(PC.town)?'　<span style="color:#f0ece0"> 拠点あり</span>':''}${frostWarn}`;
 },
 choices:[
  {label:' 鉱山道具屋（希少鉱石・採掘具）', go:'SHOP_ISKALD'},
  {label:' 酒場（坑夫の溜まり場）', go:'TAVERN_ISKALD'},
  {label:' 宿屋（4GP・1日休む）', fn:()=>{ innRest(400); }, go:'TOWN_ISKALD'},
  {label:' 旅に出る（移動）', go:'TRAVEL_FROM_ISKALD'},
  {label:' その他の行動', fn:()=>goOtherActions('iskald')},
 ]},

 TRAVEL_FROM_VALDHEIM:{
 scene:'travel',
 txt:()=>{
  const warn = isWinter() ? `<br><span style="color:#e0d8c8"> 冬期：エルマリアへのルートは遮断されています</span>` : '';
  return `<span style="color:#e0d8c8">ヴァルドヘイム</span>からの旅立ち<br><br><span style="color:#c0b098">凍てついた石門をくぐり、北の荒野へ踏み出す…</span>${warn}`;
 },
 choices:()=>makeTravelChoices(PC.town||'valdheim'),
 },
 TRAVEL_FROM_NIFURVIK:{
 scene:'travel',
 txt:()=>`<span style="color:#e0d8c8">ニフルヴィク</span>からの旅立ち<br><br><span style="color:#c0b098">凍海の風が吹きつける港を後にする…</span>`,
 choices:()=>makeTravelChoices(PC.town||'nifurvik'),
 },
 TRAVEL_FROM_ISKALD:{
 scene:'travel',
 txt:()=>`<span style="color:#e0d8c8">イスカルド</span>からの旅立ち<br><br><span style="color:#c0b098">氷河の麓から雪道を踏み締めて出発する…</span>`,
 choices:()=>makeTravelChoices(PC.town||'iskald'),
 },

 SHOP_VALDHEIM:{
 scene:'town_stone',
 txt:()=>` <span style="color:#e0d8c8">ヴァルドヘイム武具店</span><br><br>軍属鍛冶師が打った高品質な武器と防寒装備が揃う。他地方では手に入らない逸品もある。`,
 choices:[{label:' 買い物をする', fn:()=>showIngameShop('valdheim'), go:'__travel__'},{label:'← 戻る', go:'TOWN_VALDHEIM'}],
 },
 SHOP_NIFURVIK:{
 scene:'town_port',
 txt:()=>` <span style="color:#e0d8c8">ニフルヴィク交易所</span><br><br>北方の毛皮と魚油が並ぶ。防寒具の品揃えは地方随一。`,
 choices:[{label:' 買い物をする', fn:()=>showIngameShop('nifurvik'), go:'__travel__'},{label:'← 戻る', go:'TOWN_NIFURVIK'}],
 },
 SHOP_ISKALD:{
 scene:'town_mountain_village',
 txt:()=>` <span style="color:#e0d8c8">イスカルドの道具屋</span><br><br>採掘道具と希少鉱石を扱う。坑道用の松明も豊富に揃っている。`,
 choices:[{label:' 買い物をする', fn:()=>showIngameShop('iskald'), go:'__travel__'},{label:'← 戻る', go:'TOWN_ISKALD'}],
 },

 TAVERN_VALDHEIM:{
 scene:'town_stone',
 txt:()=>{
  const board=getTavernBoard('valdheim');
 const _hqOffer = checkHeroQuest('valdheim');
 const _hqHtml = renderHeroQuestOffer('valdheim', _hqOffer);
 const _smHtml = checkSpecialMissionValdheimBoard();
  const html=renderQuestBoard('valdheim',board);
  const partyHtml=renderPartyStatus();
  return ` <span style="color:#e0d8c8">氷壁の砦酒場</span><br><br>鎧姿の兵士たちが酒を酌み交わす。討伐依頼の報酬は高いが、それだけ危険だ。<br><br>${_tavernFlavorHtml}${partyHtml}${_smHtml}${_hqHtml}${html}`;
 },
 choices:()=>[...getQuestBoardChoices('TOWN_VALDHEIM'), {label:' 客に話しかける', fn:()=>talkToPatron('valdheim')}, ...fcTavernAskChoices('valdheim'), {label:' 仲間を探す', go:'RECRUIT_VALDHEIM'}],
 },
 TAVERN_NIFURVIK:{
 scene:'town_port',
 txt:()=>{
  const board=getTavernBoard('nifurvik');
 const _hqOffer = checkHeroQuest('nifurvik');
 const _hqHtml = renderHeroQuestOffer('nifurvik', _hqOffer);
  const html=renderQuestBoard('nifurvik',board);
  const partyHtml=renderPartyStatus();
  return ` <span style="color:#e0d8c8">凍海の船乗り酒場</span><br><br>荒くれた漁師と傭兵が混在する酒場。北の海の話が聞けるかもしれない。<br><br>${_tavernFlavorHtml}${partyHtml}${_hqHtml}${html}`;
 },
 choices:()=>[...getQuestBoardChoices('TOWN_NIFURVIK'), {label:' 客に話しかける', fn:()=>talkToPatron('nifurvik')}, ...fcTavernAskChoices('nifurvik'), {label:' 仲間を探す', go:'RECRUIT_NIFURVIK'}],
 },
 TAVERN_ISKALD:{
 scene:'town_mountain_village',
 txt:()=>{
  const board=getTavernBoard('iskald');
 const _hqOffer = checkHeroQuest('iskald');
 const _hqHtml = renderHeroQuestOffer('iskald', _hqOffer);
  const html=renderQuestBoard('iskald',board);
  const partyHtml=renderPartyStatus();
  return ` <span style="color:#e0d8c8">坑夫の溜まり場</span><br><br>煤で汚れた坑夫たちが体を温めている。坑道の奥に何かがいるという噂が絶えない。<br><br>${_tavernFlavorHtml}${partyHtml}${_hqHtml}${html}`;
 },
 choices:()=>[...getQuestBoardChoices('TOWN_ISKALD'), {label:' 客に話しかける', fn:()=>talkToPatron('iskald')}, ...fcTavernAskChoices('iskald'), {label:' 仲間を探す', go:'RECRUIT_ISKALD'}],
 },

 SHOP_YELDUN:{
 scene:'town_mountain_city',
 txt:()=>` <span style="color:#e0d8c8">イェルドゥン装備店</span><br><br>山岳地方随一の品揃え。重装備から登山用具まで揃う。`,
 choices:[
  {label:' 買い物をする', fn:()=>showIngameShop('yeldun'), go:'__travel__'},
  {label:'← 戻る', go:'TOWN_YELDUN'},
 ],
 },

 SHOP_FROSTPEAK:{
 scene:'town_mountain_village',
 txt:()=>` <span style="color:#e0d8c8">霜峰の道具屋</span><br><br>毛皮の防寒具と山岳装備が並ぶ。傭兵御用達の武器も少々ある。`,
 choices:[
  {label:' 買い物をする', fn:()=>showIngameShop('frostpeak'), go:'__travel__'},
  {label:'← 戻る', go:'TOWN_FROSTPEAK'},
 ],
 },

 SHOP_ASHVEIL:{
 scene:'town_mountain_village',
 txt:()=>` <span style="color:#e0d8cc">灰の村の鍛冶屋</span><br><br>黒曜石の刃と火山鉄で鍛えた武器が特産。他では手に入らない品がある。`,
 choices:[
  {label:' 買い物をする', fn:()=>showIngameShop('ashveil'), go:'__travel__'},
  {label:'← 戻る', go:'TOWN_ASHVEIL'},
 ],
 },

 TAVERN_YELDUN:{
 scene:'town_mountain_city',
 txt:()=>{
  const board=getTavernBoard('yeldun');
 const _hqOffer = checkHeroQuest('yeldun');
 const _hqHtml = renderHeroQuestOffer('yeldun', _hqOffer);
  const html=renderQuestBoard('yeldun',board);
  const partyHtml=renderPartyStatus();
  return ` <span style="color:#e0d8c8">岩場酒場</span><br><br>鉱夫と行商人が肩を並べている。<br><br>${_tavernFlavorHtml}${partyHtml}${_hqHtml}${html}`;
 },
 choices:()=>[...getQuestBoardChoices('TOWN_YELDUN'), {label:' 客に話しかける', fn:()=>talkToPatron('yeldun')}, ...fcTavernAskChoices('yeldun'), {label:' 仲間を探す', go:'RECRUIT_YELDUN'}],
 },

 TAVERN_FROSTPEAK:{
 scene:'town_mountain_village',
 txt:()=>{
  const board=getTavernBoard('frostpeak');
 const _hqOffer = checkHeroQuest('frostpeak');
 const _hqHtml = renderHeroQuestOffer('frostpeak', _hqOffer);
  const html=renderQuestBoard('frostpeak',board);
  const partyHtml=renderPartyStatus();
  return ` <span style="color:#e0d8c8">霜峰の宿屋酒場</span><br><br>吹雪の夜、暖炉を囲んで訳ありの客が集まる。<br><br>${_tavernFlavorHtml}${partyHtml}${_hqHtml}${html}`;
 },
 choices:()=>[...getQuestBoardChoices('TOWN_FROSTPEAK'), {label:' 客に話しかける', fn:()=>talkToPatron('frostpeak')}, ...fcTavernAskChoices('frostpeak'), {label:' 仲間を探す', go:'RECRUIT_FROSTPEAK'}],
 },

 TAVERN_ASHVEIL:{
 scene:'town_mountain_village',
 txt:()=>{
  const board=getTavernBoard('ashveil');
 const _hqOffer = checkHeroQuest('ashveil');
 const _hqHtml = renderHeroQuestOffer('ashveil', _hqOffer);
  const html=renderQuestBoard('ashveil',board);
  const partyHtml=renderPartyStatus();
  return ` <span style="color:#e0d8cc">灰の村の鍛冶場酒場</span><br><br>灰くさい空気の中、無口な村人たちが飲んでいる。<br><br>${_tavernFlavorHtml}${partyHtml}${_hqHtml}${html}`;
 },
 choices:()=>[...getQuestBoardChoices('TOWN_ASHVEIL'), {label:' 客に話しかける', fn:()=>talkToPatron('ashveil')}, ...fcTavernAskChoices('ashveil'), {label:' 仲間を探す', go:'RECRUIT_ASHVEIL'}],
 },

 TOWN_ELSIA:{
 scene:'town_elsia',
 txt:()=>{
 const t=TOWNS.elsia;
 return `<span style="color:#f0ece0;font-size:calc(var(--font-base) + 1px)"> ${t.name}</span>　<span class="dim" style="font-size:calc(var(--font-lg) + 4px)">${t.size}</span>${popTimeOfDayMsg('elsia')}<br>
 ${popWeatherMsg('elsia')}
 ${popDeliveryMsg()}<br>
 <span style="color:#c0b098">${t.desc}</span><br>${popHeroMsg()}${popInfamyMsg()}${popRegionHeroMsg()}${popRegionInfamyMsg()}${popRegionEvalMsg()}${popRaidUnitMsg()}<br>${renderTrustBadge(PC.town)}${hasProperty(PC.town)?'　<span style="color:#f0ece0"> 拠点あり</span>':''}` ;
 },
 choices:[
 {label:' 道具屋（エルフ製品・遺物）', go:'SHOP_ELSIA'},
 {label:' 酒場（密林の番人亭）', go:'TAVERN_ELSIA'},
 {label:' 宿屋（4GP・1日休む）', fn:()=>{ innRest(400); }, go:'TOWN_ELSIA'},
 {label:' 旅に出る（移動）', go:'TRAVEL_FROM_ELSIA'},
 {label:' その他の行動', fn:()=>goOtherActions('elsia')},
 ]
 },

 TRAVEL_FROM_ELSIA:{
 scene:'travel',
 txt:()=>`<span style="color:#f0ece0">エルマリア</span>からの旅立ち<br><br>
 
 <span style="color:#c0b098">密林を抜けてストーンヘイムへ向かう道…</span>`,
 choices:()=>makeTravelChoices(PC.town||'elsia'),
 },

 // 仮の酒場・店ノード（後で拡張）
 TAVERN_KHAZAN:{
 scene:'town_khazan',
 txt:()=>{
 const board = getTavernBoard('khazan');
 const _hqOffer = checkHeroQuest('khazan');
 const _hqHtml = renderHeroQuestOffer('khazan', _hqOffer);
 const html = renderQuestBoard('khazan', board);
 const partyHtml = renderPartyStatus();
 return ` <span style="color:#f0ece0">カザーヌの大酒場</span><br><br>冒険者たちが賑わっている。<br><br>${_tavernFlavorHtml}${partyHtml}${_hqHtml}${html}`;
 },
 choices:()=>[...getQuestBoardChoices('TOWN_KHAZAN'), {label:' 客に話しかける', fn:()=>talkToPatron('khazan')}, ...fcTavernAskChoices('khazan'), {label:' 仲間を探す', go:'RECRUIT_KHAZAN'}],
 },

 TAVERN_PORT:{
 scene:'town_port',
 txt:()=>{
 const board = getTavernBoard('port_argon');
 const _hqOffer = checkHeroQuest('port_argon');
 const _hqHtml = renderHeroQuestOffer('port_argon', _hqOffer);
 const html = renderQuestBoard('port_argon', board);
 const partyHtml = renderPartyStatus();
 return ` <span style="color:#ece8e0">波止場の酒場</span><br><br>潮の香りがする賑やかな店だ。<br><br>${_tavernFlavorHtml}${partyHtml}${_hqHtml}${html}`;
 },
 choices:()=>[...getQuestBoardChoices('TOWN_PORT_ARGON'), {label:' 客に話しかける', fn:()=>talkToPatron('port_argon')}, ...fcTavernAskChoices('port_argon'), {label:' 仲間を探す', go:'RECRUIT_PORT'}],
 },

 TAVERN_STONE:{
 scene:'town_stone',
 txt:()=>{
 const board = getTavernBoard('stonehiem');
 const _hqOffer = checkHeroQuest('stonehiem');
 const _hqHtml = renderHeroQuestOffer('stonehiem', _hqOffer);
 const html = renderQuestBoard('stonehiem', board);
 const partyHtml = renderPartyStatus();
 return ` <span style="color:#e0d8c8">鉱夫の飲み屋</span><br><br>むさくるしい男たちが酒を飲んでいる。<br><br>${_tavernFlavorHtml}${partyHtml}${_hqHtml}${html}`;
 },
 choices:()=>[...getQuestBoardChoices('TOWN_STONEHIEM'), {label:' 客に話しかける', fn:()=>talkToPatron('stonehiem')}, ...fcTavernAskChoices('stonehiem'), {label:' 仲間を探す', go:'RECRUIT_STONE'}],
 },

 ...makeRecruitNodes(),

 SHOP_KHAZAN:{
 scene:'town_khazan',
 txt:()=>` <span style="color:#f0ece0">カザーヌ武器屋</span><br><br>王都随一の品揃えだ。珍しい武器や高品質な防具が並んでいる。`,
 choices:[
 {label:' 買い物をする', fn:()=>showIngameShop('khazan'), go:'__travel__'},
 {label:'← 戻る', go:'TOWN_KHAZAN'},
 ],
 },
 SHOP_PORT:{
 scene:'town_port',
 txt:()=>` <span style="color:#ece8e0">港の雑貨屋</span><br><br>海賊風の主人が迎えてくれた。基本的な品揃えだ。`,
 choices:[
 {label:' 買い物をする', fn:()=>showIngameShop('port_argon'), go:'__travel__'},
 {label:'← 戻る', go:'TOWN_PORT_ARGON'},
 ],
 },
 SHOP_STONE:{
 scene:'town_stone',
 txt:()=>` <span style="color:#e0d8c8">鍛冶屋</span><br><br>重厚な鉄製品が並んでいる。基本的な品揃えだ。`,
 choices:[
 {label:' 買い物をする', fn:()=>showIngameShop('stonehiem'), go:'__travel__'},
 {label:'← 戻る', go:'TOWN_STONEHIEM'},
 ],
 },
 SHOP_ELSIA:{
 scene:'town_elsia',
 txt:()=>` <span style="color:#f0ece0">エルマリアの道具屋</span><br><br>
 <span style="color:#c0b098">蔦の絡まる石造りの小屋。武具や冒険の備品が並んでいる。</span>`,
 choices:[
 {label:' 買い物をする', fn:()=>showIngameShop('elsia'), go:'__travel__'},
 {label:'← 戻る', go:'TOWN_ELSIA'},
 ],
 },
 TAVERN_ELSIA:{
 scene:'town_elsia',
 txt:()=>{
 const board = getTavernBoard('elsia');
 const _hqOffer = checkHeroQuest('elsia');
 const _hqHtml = renderHeroQuestOffer('elsia', _hqOffer);
 const html = renderQuestBoard('elsia', board);
 const partyHtml = renderPartyStatus();
 return ` <span style="color:#f0ece0">密林の番人亭</span><br><br><span style="color:#c0b098">エルフの弓士や遺跡探索者でにぎわう酒場。木の実の蒸留酒が名物だ。</span><br><br>${_tavernFlavorHtml}${partyHtml}${_hqHtml}${html}`;
 },
 choices:()=>[...getQuestBoardChoices('TOWN_ELSIA'), {label:' 客に話しかける', fn:()=>talkToPatron('elsia')}, ...fcTavernAskChoices('elsia'), {label:' 仲間を探す', go:'RECRUIT_ELSIA'}],
 },

 START:{
 scene:'town',
 txt:()=>`ようこそ、<span style="color:#f0ece0">${PC.name}</span>！<br><br>
 あなたは<span class="${PC.type==='warrior'?'warrior-c':PC.type==='rogue'?'warrior-c':'wizard-c'}">${PC.type==='warrior'?' 戦士':PC.type==='rogue'?' 盗賊':' 魔法使い'}</span>として冒険に出る。<br><br>
 <br>
 武器: <span style="color:#f0ece0">${(PC.equippedWeapons||[]).length?(PC.equippedWeapons).map(w=>w.name).join(', '):'なし（素手）'}</span><br>
 防具: <span style="color:#ece8e0">${effectiveArmor()>0?effectiveArmor()+'hits':'なし'}</span><br>
 <span style="color:#c0b098">ST:${PC.st} IQ:${PC.iq} LK:${PC.lk} CON:${PC.con} DEX:${PC.dex} CHR:${PC.chr} SPD:${PC.spd}</span><br>
 <span style="color:#c0b098">パーソナルアド: ${(calcAdds()>=0?'+':'')+calcAdds()}</span><br><br>
 <span style="color:#e8e4d8">── シナリオをロードしてください ──</span>`,
 choices:[
 {label:' テストバトル（ゴブリン）', go:'TEST_COMBAT'},
 {label:' 能力値テストテスト', go:'TEST_SR'},
 {label:` 魔法テスト${PC.type==='wizard'?' ':'（Wizard限定）'}`, go:'TEST_MAGIC'},
 {label:' 宿屋で1日休む', fn:()=>showTimePass(TIME_COST.rest, null), go:'START'},
 {label:' 1年早送り（加齢テスト）', fn:()=>showTimePass(360, null), go:'START'},
 {label:'⏩ 5年早送り（加齢テスト）', fn:()=>showTimePass(360*5, null), go:'START'},
 ]
 },

 TEST_COMBAT:{
 scene:'dungeon',
 txt:`暗い廊下の先からゴブリンが現れた！<br><br>
 <span class="red">ゴブリン</span> CombatRating:30（4D6+15）<br>防具なし`,
 combat:{
 name:'ゴブリン',mr:30,armor:0,isWarrior:false,
 win:'WIN_GOBLIN',lose:'DEAD'
 }
 },

 WIN_GOBLIN:{
 scene:'dungeon',
 txt:()=>{
 const gold=Nd6(1)*10;gainGPAll(gold);
 return`ゴブリンを倒した！<br><br>
 死体を調べると <span style="color:#f0ece0">${gold} GP</span> の財布を発見。<br><br>
 <span style="color:#f0ece0">AP獲得（MR30分）</span><br>
 現在AP: <span style="color:#e8e4d8">${PC.ap}</span>　レベル: <span style="color:#f0ece0">${PC.level}</span>`;
 },
 choices:[{label:'▶ 次へ進む',go:'START'}]
 },

 TEST_SR:{
 scene:'dungeon',
 txt:()=>`能力値テストのテストをしよう。<br><br>
 <span style="color:#f0ece0">LK Lv2能力値テスト！</span><br>
 あなたのLK: ${PC.lk}<br>
 目標: 2D6+${PC.lk} ≥ 25（Lv2×5+15）<br><br>
 <span style="color:#c0b098">ダブルスが出ると振り直してさらに加算される！</span>`,
 savingRoll:{attr:'lk',level:2,success:'SR_PASS',fail:'SR_FAIL'}
 },
 SR_PASS:{scene:'dungeon',txt:'<span style="color:#e8e4d8"> 能力値テスト成功！</span><br>運が味方した！',choices:[{label:'▶ 戻る',go:'START'}]},
 SR_FAIL:{scene:'dungeon',txt:'<span class="red"> 能力値テスト失敗...</span><br>次回は気をつけよう。',choices:[{label:'▶ 戻る',go:'START'}]},


 // ══════════════════════════════════════════════════════
 //  エルマリア「封じられた神殿」（リムホルム近郊）
 // マップ: 14348.png準拠
 // 部屋: 1〜11, A(隠し部屋), C, E, I
 // 入口: 北（Arch×2）/ 出口: 南（Arch）
 // ══════════════════════════════════════════════════════

 // ══════════════════════════════════════════════════════════
 // リムホルム：封じられた神殿 B1F（再設計版）
 // ══════════════════════════════════════════════════════════

 SHRINE_ENTRANCE:{
 scene:'dungeon',
 txt:()=>{
  const torches = countTorches();
  const torchMsg = torches > 0
   ? `<span style="color:#e8e4d8"> 松明を ${torches}本 持っている。</span>`
   : `<span class="red"> 松明を持っていない！暗闇の中を進むことになる。</span>`;
  const hiddenMsg = PC._shrHiddenPassageFound
   ? `<br><br><span style="color:#b0a080">南東の茂みの奥に、以前見つけた洞穴の入口がある。</span>`
   : '';
  return `<span class="gold" style="font-size:var(--font-base)">封じられた神殿</span><br><br>
   リムホルムから半日ほど密林を分け入った先、蔦に覆われた石造りの廃神殿が姿を現す。<br>
   風化した石段の先に重い石扉がそびえており、隙間から冷えた空気が流れ出している。<br>
   かつてエルフの神官が守ったとされるが、今では何かが棲みついているという。<br><br>
   ${torchMsg}${hiddenMsg}`;
 },
 choices:()=>{
  const ch = [
   {label:' 重い石扉を押し開けて入る', fn:()=>initTorch(), go:'SHRINE_P1'},
  ];
  if(PC._shrHiddenPassageFound){
   ch.push({label:' 南東の洞穴から入る（近道）', fn:()=>initTorch(), go:'SHR1_HIDDEN_R3'});
  }
  ch.push({label:'← リムホルムへ戻る', go:'TOWN_RIMHOLM'});
  return ch;
 },
 },

 SHRINE_DARK_ESCAPE:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0"></span><br><br>
  <span style="color:var(--white2)">松明が切れた。完全な暗闇の中、壁を手探りで進む。出口まで帰り着けるか……</span>`,
 choices:()=>[{label:' もう一度出口を探す（運 Lv3 能力値テスト）', fn:()=>{
  setupSavingRoll({
   attr:'lk', level:3,
   onSuccess:()=>{
    const s = document.getElementById('story');
    s.innerHTML = `<span style="color:#f0ece0"></span><br><br>壁を手探りで進み、かすかな外光を頼りになんとか入口へ辿り着いた！`;
    renderChoices([{label:' 外の光の方へ', go:'SHRINE_ENTRANCE'}]);
    scrollToTop();
   },
   onFail:()=>{
    const s = document.getElementById('story');
    s.innerHTML = `<span class="red"></span><br><br>暗闇の中で方向を失い、柱に何度もぶつかりながら彷徨い続けた。`;
    renderChoices([{label:' もう一度出口を探す（運 Lv3 能力値テスト）', go:'SHRINE_DARK_ESCAPE'}]);
    scrollToTop();
   },
  });
 }}],
 },

 SHRINE_P1:{
 scene:'dungeon',
 txt:()=>{
  return `<span style="color:#f0ece0">入口前の通路</span><br><br>
   南北に延びる15mほどの石造りの通路。壁には古エルフ語の碑文が刻まれているが、<br>
   長年の風化で読めなくなっている。床には細かな砂が積もり、足跡が残る。<br>
   北に石扉（入口）、南の先で十字路に出る。`;
 },
 choices:[
  {label:'⬆ 北へ戻る', go:'SHRINE_ENTRANCE'},
  {label:'⬇ 南へ進む', go:'SHRINE_CROSS1'},
 ],
 },

 SHRINE_CROSS1:{
 scene:'dungeon',
 txt:()=>{
  return `<span style="color:#f0ece0">十字路</span><br><br>
   四方に通路が延びる十字路。天井が高く、中央に割れた台座がある。<br>
   かつて何かが置かれていたようだが、今は空だ。`;
 },
 choices:[
  {label:'⬆ 北へ', go:'SHRINE_P1'},
  {label:'➡ 東へ', go:'SHRINE_P2'},
  {label:'⬇ 南へ', go:'SHRINE_P6'},
  {label:'⬅ 西へ', go:'SHRINE_P4'},
 ],
 },

 SHRINE_P2:{
 scene:'dungeon',
 txt:()=>{
  return `<span style="color:#f0ece0">装飾扉前の通路</span><br><br>
   東西10mの通路。東の突き当たりに豪華な装飾が施された石造りの扉がある。<br>
   蔓草の文様が彫り込まれ、取っ手は金属製で今も鈍く光を反射している。<br>
   鍵がかかっているようだ。`;
 },
 choices:()=>{
  const ch = [];
  if(PC._shrineN_p2_open){
   ch.push({label:'➡ 東へ入る', go:'SHRINE_ROOM1'});
  } else {
   ch.push({label:' 扉を解錠する（器用さ Lv2 能力値テスト）', fn:()=>{
    dungeonTrySR({
     attr:'dex', level:2,
     successTxt:'手先を器用に動かすと、複雑な錠前が外れた。扉が開く。',
     failTxt:'錠前を弄っていると物音に気づいた何かが近づいてきた！',
     successFn:()=>{ PC._shrineN_p2_open = true; },
     failFn:()=>{
      setTimeout(()=>startCombat({name:'神殿の守護者',enemies:[{name:'神殿の守護者',mr:28,curMR:28,armor:2}],canFlee:true,win:'SHRINE_P2',lose:'SHRINE_ENTRANCE'}),0);
      return true;
     },
     choicesFn:(ok)=>ok?[{label:'➡ 東へ入る',go:'SHRINE_ROOM1'}]:[{label:'⬅ 西へ戻る',go:'SHRINE_P2'}],
    });
   }});
  }
  ch.push({label:'⬅ 西へ戻る', go:'SHRINE_CROSS1'});
  return ch;
 },
 },

 SHRINE_ROOM1:{
 scene:'dungeon',
 txt:()=>{
  return `<span style="color:#f0ece0">礼拝の間</span><br><br>
   南北30m、東西20mの広大な礼拝の間。天井は高く、石柱が列を成して立ち並んでいる。<br>
   床には古い宗教画のモザイクが残り、かつての荘厳さを偲ばせる。<br>
   西壁北端から10mの位置に豪華な装飾扉、東壁北端から10mの位置に木製の扉。`;
 },
 choices:[
  {label:'⬅ 西の装飾扉へ戻る', go:'SHRINE_P2'},
  {label:'➡ 東の木扉を押す', go:'SHRINE_P3'},
 ],
 },

 SHRINE_P3:{
 scene:'dungeon',
 txt:()=>{
  return `<span style="color:#f0ece0">奥の通路</span><br><br>
   東西18mの通路。木造の扉は腐りかけているがまだ通れる。<br>
   東の突き当たりにアーチ形の入口が開いており、奥に部屋が見える。<br>
   かすかに石の焦げた臭いがする。`;
 },
 choices:[
  {label:'⬅ 西へ戻る', go:'SHRINE_ROOM1'},
  {label:'➡ 東のアーチへ進む', go:'SHRINE_ROOM2'},
 ],
 },

 SHRINE_ROOM2:{
 scene:'dungeon',
 txt:()=>{
  return `<span style="color:#f0ece0">彫像の間</span><br><br>
   9m四方の小部屋。中央に不気味な表情をした石造りの彫像が鎮座している。<br>
   目の部分に宝石が嵌め込まれており、こちらを見ているようだ。<br>
   彫像の台座には「汝の魂を試せ」と古エルフ語で刻まれている。`;
 },
 choices:[
  {label:' 彫像に触れてみる', go:'SHRINE_ROOM2_TELEPORT'},
  {label:'⬅ 西へ戻る', go:'SHRINE_P3'},
 ],
 },

 SHRINE_ROOM2_TELEPORT:{
 scene:'dungeon',
 txt:()=>{
  // ランダムなノードにテレポート
  const targets = [
   'SHRINE_P1','SHRINE_CROSS1','SHRINE_P6','SHRINE_P4',
   'SHRINE_ROOM5','SHRINE_P10','SHRINE_ROOM9','SHRINE_P11',
   'SHRINE_ROOM7','SHRINE_ROOM8','SHRINE_ROOM3','SHRINE_P5',
   'SHRINE_P8','SHRINE_ROOM10','SHRINE_P12',
  ];
  const dest = targets[Math.floor(Math.random()*targets.length)];
  setTimeout(()=>go(dest), 1200);
  return ` <span style="color:#f0ece0">転送！</span><br><br>
   彫像に手を触れた瞬間、目の宝石が眩く輝いた。<br>
   体が光に包まれ、気づけば全く別の場所に立っていた……。<br>
   <span style="color:#c0b098">（ダンジョン内のどこかへ転送された）</span>`;
 },
 choices:[],
 },

 SHRINE_P6:{
 scene:'dungeon',
 txt:()=>{
  return `<span style="color:#f0ece0">南の長い通路</span><br><br>
   南北に延びる30mの長い通路。天井は低く、等間隔に石柱の台座が並んでいる。<br>
   かつては松明が灯されていたのか、壁に煤の痕跡が残る。<br>
   北は十字路、南の突き当たりにはアーチがある。`;
 },
 choices:[
  {label:'⬆ 北へ戻る', go:'SHRINE_CROSS1'},
  {label:'⬇ 南のアーチへ進む', go:'SHRINE_ROOM5'},
 ],
 },

 SHRINE_ROOM5:{
 scene:'dungeon',
 txt:()=>{
  return `<span style="color:#f0ece0">中央の広間</span><br><br>
   南北15m、東西25mの広い部屋。石柱が四隅に立ち、床は磨かれた石板。<br>
   北壁にアーチ、西壁に石造りの扉、南壁にアーチ。<br>
   部屋の中央付近に床の色が微妙に異なる場所がある。`;
 },
 choices:()=>{
  const ch = [];
  if(!PC._shrineN_trap5){
   ch.push({label:' 中央を横切る', fn:()=>{
    PC._shrineN_trap5 = true;
    dungeonTrySR({
     attr:'lk', level:2,
     successTxt:'足元の床石がずれ、その下に深い穴が口を開けた。寸前で気づき飛び退いた！',
     failTxt:()=>{
      const dmg = 3 + Math.floor(Math.random()*4);
      PC.con = Math.max(0, PC.con - dmg);
      updateHUD();
      return `床石が崩れ、深い穴に落下した。なんとか這い上がったが体に応えた。<span class="red"> 体力-${dmg}</span>`;
     },
     choicesFn:()=>[{label:'⬇ 南へ戻る', go:'SHRINE_ROOM5'}],
    });
   }});
  }
  if(PC._shrineN_lever){
   ch.push({label:'➡ 東の石扉へ', go:'SHRINE_P7'});
  }
  ch.push({label:'⬅ 西の石扉へ', go:'SHRINE_P8'});
  ch.push({label:'⬇ 南のアーチへ', go:'SHRINE_P10'});
  ch.push({label:'⬆ 北のアーチへ戻る', go:'SHRINE_P6'});
  if(PC._shrineN_trap5){
   // 落とし穴は既に発見済みのため中央を避けて自由に移動できる
  }
  return ch;
 },
 },

 SHRINE_P7:{
 scene:'dungeon',
 txt:()=>{
  return `<span style="color:#f0ece0">東の石扉前の通路</span><br><br>
   南北10mの通路。北端の西壁に石造りの扉、南の突き当たりにアーチがある。<br>
   壁に小さな神像が並んでいるが、いくつかは首が落とされている。`;
 },
 choices:[
  {label:'⬆ 北の石扉へ', go:'SHRINE_ROOM5'},
  {label:'⬇ 南のアーチへ', go:'SHRINE_ROOM7'},
 ],
 },

 SHRINE_ROOM7:{
 scene:'dungeon',
 txt:()=>{
  return `<span style="color:#f0ece0">神官の控え室</span><br><br>
   南北6m、東西9mの小部屋。かつて神官の控え室だったのか、石造りの棚が壁に沿って並ぶ。<br>
   棚の上には壊れた器や腐った布の残骸。北壁にアーチがある。`;
 },
 choices:[
  {label:'⬆ 北のアーチへ戻る', go:'SHRINE_P7'},
 ],
 },

 SHRINE_P8:{
 scene:'dungeon',
 txt:()=>{
  return `<span style="color:#f0ece0">西の通路</span><br><br>
   南北12mの通路。北端の東壁には石造りの扉、南端にアーチ。<br>
   床が湿っており、壁に苔が生えている。水がどこかから滲み出しているようだ。`;
 },
 choices:[
  {label:'⬆ 北の石扉へ', go:'SHRINE_ROOM5'},
  {label:'⬇ 南のアーチへ', go:'SHRINE_ROOM8'},
 ],
 },

 SHRINE_ROOM8:{
 scene:'dungeon',
 txt:()=>{
  return `<span style="color:#f0ece0">錠前の部屋</span><br><br>
   6m四方の小部屋。北壁にアーチ、西壁に古びた石造りの扉がある。<br>
   扉の隙間から冷たい空気が流れてくる。`;
 },
 choices:()=>{
  const ch = [];
  if(PC._shrineN_room8_open){
   ch.push({label:'⬅ 西の扉へ', go:'SHRINE_P9'});
  } else {
   ch.push({label:' 扉を解錠する（器用さ Lv2 能力値テスト）', fn:()=>{
    dungeonTrySR({
     attr:'dex', level:2,
     successTxt:'鎖が床に落ちる音が響いた。扉が軋みながら開く。',
     failTxt:'音を立てすぎた！廊下から何かが近づいてくる！',
     successFn:()=>{ PC._shrineN_room8_open = true; },
     failFn:()=>{
      setTimeout(()=>startCombat({name:'廊下の亡者',enemies:[{name:'廊下の亡者',mr:22,curMR:22,armor:0}],canFlee:true,win:'SHRINE_ROOM8',lose:'SHRINE_ENTRANCE'}),0);
      return true;
     },
     choicesFn:(ok)=>ok?[{label:'⬅ 西へ',go:'SHRINE_P9'}]:[{label:'▶ 戻る',go:'SHRINE_ROOM8'}],
    });
   }});
  }
  ch.push({label:'⬆ 北のアーチへ戻る', go:'SHRINE_P8'});
  return ch;
 },
 },

 SHRINE_P9:{
 scene:'dungeon',
 txt:()=>{
  return `<span style="color:#f0ece0">錠前の先の通路</span><br><br>
   南北18mの通路。南端の東壁に扉、北端は行き止まり。<br>
   壁に沿って空の木箱や壊れた道具が積まれている。何かを隠す場所に使われていたのか。`;
 },
 choices:[
  {label:'⬇ 南の扉へ戻る', go:'SHRINE_ROOM8'},
 ],
 },

 SHRINE_P10:{
 scene:'dungeon',
 txt:()=>{
  return `<span style="color:#f0ece0">南の横通路</span><br><br>
   南北20mに延びる通路。北端の北壁にアーチ、南端の東壁にアーチ。<br>
   床に古い血痕のようなものが染みになっている。`;
 },
 choices:[
  {label:'⬆ 北のアーチへ', go:'SHRINE_ROOM5'},
  {label:'➡ 東のアーチへ', go:'SHRINE_ROOM9'},
 ],
 },

 SHRINE_ROOM9:{
 scene:'dungeon',
 txt:()=>{
  return `<span style="color:#f0ece0">壁画の部屋</span><br><br>
   南北9m、東西12mの部屋。壁に描かれた壁画が残るが、色は褪せている。<br>
   西壁にアーチ、南壁に扉、東壁にアーチがある。`;
 },
 choices:[
  {label:'⬅ 西のアーチへ', go:'SHRINE_P10'},
  {label:'⬇ 南の扉へ', go:'SHRINE_P12'},
  {label:'➡ 東のアーチへ', go:'SHRINE_P11'},
 ],
 },

 SHRINE_P11:{
 scene:'dungeon',
 txt:()=>{
  return `<span style="color:#f0ece0">奥の短い通路</span><br><br>
   東西9mの短い通路。通路の両端にアーチがある。<br>
   両側の壁に古代の文様が規則正しく刻まれている。`;
 },
 choices:[
  {label:'⬅ 西のアーチへ', go:'SHRINE_ROOM9'},
  {label:'➡ 東のアーチへ', go:'SHRINE_ROOM10'},
 ],
 },

 SHRINE_ROOM10:{
 scene:'dungeon',
 txt:()=>{
  return `<span style="color:#f0ece0">石棚の部屋</span><br><br>
   6m四方の小部屋。西壁にアーチがある。<br>
   部屋の奥に石棚があり、金属製の箱が置かれている。<br>
   箱は空だったが、棚の隅に古い釘が数個落ちていた。`;
 },
 choices:[
  {label:'⬅ 西のアーチへ戻る', go:'SHRINE_P11'},
 ],
 },

 SHRINE_P12:{
 scene:'dungeon',
 txt:()=>{
  return `<span style="color:#f0ece0">崩れた通路</span><br><br>
   東西20mの通路。西端の北壁に扉、東端は崩れた瓦礫で塞がれている。<br>
   壁に沿って古い彫刻が連続して続くが、東端は完全に崩壊している。`;
 },
 choices:[
  {label:'⬆ 北の扉へ戻る', go:'SHRINE_ROOM9'},
 ],
 },

 SHRINE_P4:{
 scene:'dungeon',
 txt:()=>{
  return `<span style="color:#f0ece0">行き止まりの通路</span><br><br>
   東西10mの通路。東は十字路、西端は石壁で行き止まりに見える。<br>
   しかし壁の石材の積み方が他と微妙に異なる部分がある。<br>
   ${PC._shrineN_secret4 ? '<span style="color:#e8e4d8"> 隠し扉の位置は分かっている。</span>' : ''}`;
 },
 choices:()=>{
  const ch = [];
  if(PC._shrineN_secret4){
   ch.push({label:' 西壁の隠し扉を開けて隠し部屋へ', go:'SHRINE_ROOM3'});
  } else {
   ch.push({label:' 西壁を調べる（運 Lv2 能力値テスト）', fn:()=>{
    dungeonTrySR({
     attr:'lk', level:2,
     successTxt:'石材の隙間に指を入れると、壁の一部がゆっくりと回転した。隠し扉を発見した！',
     failTxt:'壁を調べていると、背後から気配が！物音に引き寄せられた何かが迫ってくる！',
     successFn:()=>{ PC._shrineN_secret4 = true; },
     failFn:()=>{
      setTimeout(()=>startCombat({name:'神殿の亡者',enemies:[{name:'神殿の亡者',mr:25,curMR:25,armor:0}],canFlee:true,win:'SHRINE_P4',lose:'SHRINE_ENTRANCE'}),0);
      return true;
     },
     choicesFn:(ok)=>ok?[{label:' 隠し扉へ進む',go:'SHRINE_ROOM3'}]:[{label:'➡ 行き止まりの通路へ戻る',go:'SHRINE_P4'}],
    });
   }});
  }
  ch.push({label:'➡ 東へ戻る', go:'SHRINE_CROSS1'});
  return ch;
 },
 },

 SHRINE_ROOM3:{
 scene:'dungeon',
 txt:()=>{
  return `<span style="color:#f0ece0">隠し部屋</span><br><br>
   6m四方の隠し部屋。東壁に隠し扉、北壁に石造りの扉、<br>
   西壁にアーチがある。<br>
   棚に埃を被った魔法書のような書物が置かれているが、文字は読めない。`;
 },
 choices:[
  {label:'⬆ 北の石扉を開ける', go:'SHRINE_ROOM4'},
  {label:'⬅ 西のアーチへ', go:'SHRINE_P5'},
  {label:'➡ 東の隠し扉へ戻る', go:'SHRINE_P4'},
 ],
 },

 SHRINE_ROOM4:{
 scene:'dungeon',
 txt:()=>{
  const leverPulled = !!PC._shrineN_lever;
  return `<span style="color:#f0ece0">レバーの間</span><br><br>
   3m四方の極めて小さな部屋。南壁に石造りの扉。<br>
   北壁に大きな鉄製のレバーが取り付けられている。<br>
   ${leverPulled
    ? '<span style="color:#e8e4d8"> レバーは引かれた状態だ。中央の広間の東扉は開いている。</span>'
    : 'レバーはまだ押し込まれた状態だ。用途は不明だが、引けば何かが動くだろう。'}`;
 },
 choices:()=>{
  const ch = [];
  if(!PC._shrineN_lever){
   ch.push({label:' レバーを引く', fn:()=>{
    PC._shrineN_lever = true;
    updateHUD();
    showSaveToast('レバーを引いた。どこかで音がした。');
    go('SHRINE_ROOM4');
   }});
  }
  ch.push({label:'⬇ 南の石扉へ戻る', go:'SHRINE_ROOM3'});
  return ch;
 },
 },

 SHRINE_P5:{
 scene:'dungeon',
 txt:()=>{
  return `<span style="color:#f0ece0">深部への通路</span><br><br>
   南北30mの長い通路。南端の東壁にアーチ。<br>
   北へ進むにつれ天井が高くなり、通路が広がっていく。<br>
   北端に幅5mの立派な石段が下へと続いている——地下2階への階段だ。`;
 },
 choices:[
  {label:'⬇ 南のアーチへ', go:'SHRINE_ROOM3'},
  {label:'⬆ 北の階段を降りる', go:'SHRINE_B2F'},
 ],
 },

 SHRINE_B2F:{
 scene:'dungeon',
 txt:()=>{
  return `<span style="color:#f0ece0">地下2階への階段</span><br><br>
   幅5mの立派な石段が深く下へ続いている。<br>
   石段を降りきると、さらに古い石組みの層へと続いているようだ。`;
 },
 choices:[
  {label:'⬇ 石段を降り、地下2階へ進む', fn:()=>initTorch(), go:'SHR2_ENTRANCE'},
  {label:'⬆ 引き返す', go:'SHRINE_P5'},
 ],
 },


 // ══════════════════════════════════════════════════════════
 // イスカルド：古代遺跡 B1F
 // ══════════════════════════════════════════════════════════

 ISKALD_ENTRANCE:{
 scene:'dungeon',
 txt:`<span class="gold" style="font-size:var(--font-base)">古代遺跡 ── 入口</span><br><br>
  イスカルドの外れ、凍土に埋もれた石造りの遺跡。北に延びる10mの下り階段が地下へ続く。<br>
  冷気と埃の臭いが吹き上げてくる。<br><br>
  <span style="color:#c0b098">地下1階へ降りる。</span>`,
 choices:[
  {label:'⬇ 地下1階へ降りる', fn:()=>initTorch(), go:'ISKALD_C1'},
  {label:'← イスカルドへ戻る', go:'TOWN_ISKALD'},
 ],
 },

 ISKALD_DARK_ESCAPE:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0"> 松明が切れた！暗闇の中、壁を手探りで出口を探す……</span>`,
 choices:()=>[{label:' 出口を探す（運 Lv3 能力値テスト）', fn:()=>{
  setupSavingRoll({
   attr:'lk', level:3,
   onSuccess:()=>{
    const s = document.getElementById('story');
    s.innerHTML = `<span style="color:#e8e4d8"> 壁を伝って出口を見つけた！</span>`;
    renderChoices([{label:' 出口へ', go:'ISKALD_ENTRANCE'}]);
    scrollToTop();
   },
   onFail:()=>{
    const s = document.getElementById('story');
    s.innerHTML = `<span class="red"> 暗闇の中で迷い続けた……</span>`;
    renderChoices([{label:' 再度出口を探す（運 Lv3 能力値テスト）', go:'ISKALD_DARK_ESCAPE'}]);
    scrollToTop();
   },
  });
 }}],
 },

 ISKALD_C1:{
 scene:'dungeon',
 txt:`<span style="color:#f0ece0">地下大通路</span><br><br>
  東西35mに延びる幅広い石造りの通路。天井は高く、壁に古代文字の刻印がある。<br>
  西端は通路が南へ折れ曲がっている。西端から15mの南側に地上への階段がある。<br>
  東端は南壁に扉がある。`,
 choices:[
  {label:'⬆ 地上への階段へ', go:'ISKALD_ENTRANCE'},
  {label:'⬅ 西へ', go:'ISKALD_C2'},
  {label:'➡ 東端・南壁の扉へ', go:'ISKALD_ROOM8'},
 ],
 },

 ISKALD_C2:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">折れ曲がった縦通路</span><br><br>
  南北に延びる通路（約15m）。北端は東へ折れて大通路へ続く。<br>
  南端は行き止まりで、南壁に重厚な石積みがある。<br>
  ${PC._iskaldN_c2S?'<span style="color:#e8e4d8"> 南壁に隠し扉を発見している。</span>':''}`,
 choices:()=>{
  const ch=[];
  ch.push({label:'⬆ 北（大通路）へ',go:'ISKALD_C1'});
  if(PC._iskaldN_c2S) ch.push({label:'⬇ 南壁の隠し扉（南の小部屋）へ',go:'ISKALD_ROOM11'});
  else ch.push({label:' 南壁を調べる（INT Lv2 能力値テスト）',fn:()=>{
   dungeonTrySR({attr:'iq',level:2,
    successTxt:'南壁にも巧妙に隠された扉を発見した！',
    failTxt:'南壁を調べたが何も見つからなかった。',
    successFn:()=>{PC._iskaldN_c2S=true;},
    choicesFn:(ok)=>ok?[{label:'⬇ 南壁の隠し扉へ',go:'ISKALD_ROOM11'}]:[{label:'⬇ 通路へ戻る',go:'ISKALD_C2'}],
   });
  }});
  return ch;
 },
 },

 ISKALD_C3:{
 scene:'dungeon',
 txt:`<span style="color:#f0ece0">短い縦通路（階段室）</span><br><br>
  南北約10mの短い通路。北端の北壁に扉、南端の南壁に扉がある。<br>
  南端東側に、幅5mの大きな開口部があり、東へと降りる石段が続いている。`,
 choices:[
  {label:'⬆ 北の扉へ',go:'ISKALD_ROOM8'},
  {label:'⬇ 南の扉へ',go:'ISKALD_ROOM4'},
  {label:'➡ 下り階段へ',go:'ISKALD_B2F'},
 ],
 },

 ISKALD_C4:{
 scene:'dungeon',
 txt:`<span style="color:#f0ece0">縦の通路</span><br><br>
  南北に延びる通路（約25m）。南端は行き止まりで西壁に扉がある。<br>
  北端も行き止まりで東壁に扉がある。`,
 choices:[
  {label:'⬇ 南端・西壁の扉へ',go:'ISKALD_ROOM4'},
  {label:'⬆ 北端・東壁の扉へ',go:'ISKALD_ROOM6'},
 ],
 },

 ISKALD_C5:{
 scene:'dungeon',
 txt:`<span style="color:#f0ece0">南の縦通路</span><br><br>
  南北に延びる通路（約15m）。北端に扉がある。<br>
  南端は東へ折れ曲がっている。`,
 choices:[
  {label:'⬆ 北の扉へ',go:'ISKALD_ROOM6'},
  {label:'➡ 南東の通路へ',go:'ISKALD_C6'},
 ],
 },

 ISKALD_C6:{
 scene:'dungeon',
 txt:`<span style="color:#f0ece0">折れ曲がり横通路（南）</span><br><br>
  東西に延びる通路（約15m）。西端は北へ折れ曲がって縦通路へ。<br>
  東端も北へ折れ曲がって別の縦通路へ続く。`,
 choices:[
  {label:'⬅ 西北（縦通路）へ',go:'ISKALD_C5'},
  {label:'➡ 東北（縦通路）へ',go:'ISKALD_C7'},
 ],
 },

 ISKALD_C7:{
 scene:'dungeon',
 txt:`<span style="color:#f0ece0">南西の縦通路</span><br><br>
  南北に延びる通路（約15m）。南端は西へ折れ曲がって横通路へ。<br>
  北端は東へ折れ曲がって別の横通路へ続く。`,
 choices:[
  {label:'⬇ 南西（折れ曲がり）の通路へ',go:'ISKALD_C6'},
  {label:'⬆ 北東（折れ曲がり）の通路へ',go:'ISKALD_C8'},
 ],
 },

 ISKALD_C8:{
 scene:'dungeon',
 txt:`<span style="color:#f0ece0">折れ曲がり横通路（北）</span><br><br>
  東西に延びる通路（約15m）。西端は南へ折れ曲がって縦通路へ。<br>
  東端も南へ折れ曲がって別の縦通路へ続く。`,
 choices:[
  {label:'⬅ 西南（縦通路）へ',go:'ISKALD_C7'},
  {label:'➡ 東南（縦通路）へ',go:'ISKALD_C9'},
 ],
 },

 ISKALD_C9:{
 scene:'dungeon',
 txt:`<span style="color:#f0ece0">北の縦通路</span><br><br>
  南北に延びる通路（約15m）。北端は西へ折れ曲がっている。<br>
  南端は行き止まりで、東壁に扉がある。`,
 choices:[
  {label:'⬆ 北西の通路へ',go:'ISKALD_C8'},
  {label:'➡ 南端・東壁の扉へ',go:'ISKALD_ROOM5'},
 ],
 },

 ISKALD_C10:{
 scene:'dungeon',
 txt:`<span style="color:#f0ece0">東の長い横通路</span><br><br>
  東西に延びる通路（約25m）。西端の南壁に扉がある。<br>
  東端の北壁にアーチ形の開口部がある。`,
 choices:[
  {label:'⬅ 西端・南壁の扉へ',go:'ISKALD_ROOM5'},
  {label:'➡ 東端・北壁のアーチへ',go:'ISKALD_ROOM7'},
 ],
 },

 ISKALD_C11:{
 scene:'dungeon',
 txt:`<span style="color:#f0ece0">北の短い横通路</span><br><br>
  東西に延びる通路（約15m）。東端に扉がある。<br>
  西端は行き止まりで、南壁に扉がある。`,
 choices:[
  {label:'➡ 東の扉へ',go:'ISKALD_ROOM3'},
  {label:'⬇ 西端・南壁の扉へ',go:'ISKALD_ROOM10'},
 ],
 },

 ISKALD_C12:{
 scene:'dungeon',
 txt:`<span style="color:#f0ece0">短い縦通路</span><br><br>
  南北に延びる通路（約15m）。南端と北端にそれぞれ扉がある。`,
 choices:[
  {label:'⬇ 南の扉へ',go:'ISKALD_ROOM1'},
  {label:'⬆ 北の扉へ',go:'ISKALD_ROOM9'},
 ],
 },

 ISKALD_ROOM1:{
 scene:'dungeon',
 txt:`<span style="color:#f0ece0">五角形の間</span><br><br>
  南北30m、東西35mの部屋。天井は五角形のドームになっている奇妙な形の部屋。天井が独特で、声が反響する。<br>
  東壁北端に扉、北壁西端に扉がある。`,
 choices:[
  {label:'➡ 東壁の扉へ',go:'ISKALD_ROOM7'},
  {label:'⬆ 北壁の扉へ',go:'ISKALD_C12'},
 ],
 },

 ISKALD_ROOM2:{
 scene:'dungeon',
 txt:`<span style="color:#f0ece0">北の大広間</span><br><br>
  南北45m、東西35mの広大な部屋。天井が高く、かつては重要な儀式が行われた場所と思われる。<br>
  東壁北端に扉、南壁西端に扉がある。`,
 choices:[
  {label:'➡ 東壁の扉へ',go:'ISKALD_ROOM9'},
  {label:'⬇ 南壁の扉へ',go:'ISKALD_C2'},
 ],
 },

 ISKALD_ROOM3:{
 scene:'dungeon',
 txt:`<span style="color:#f0ece0">東の大広間</span><br><br>
  35m四方の広い部屋。壁に古代の装飾が施されている。<br>
  南壁東端に扉、西壁北端に扉、西壁南端から10mのところに鉄で補強された扉がある。`,
 choices:[
  {label:'⬇ 南壁の扉へ',go:'ISKALD_ROOM7'},
  {label:'⬅ 西壁北端の扉へ',go:'ISKALD_C11'},
  {label:'⬅ 西壁の鉄扉へ',go:'ISKALD_ROOM10'},
 ],
 },

 ISKALD_ROOM4:{
 scene:'dungeon',
 txt:`<span style="color:#f0ece0">南の大広間</span><br><br>
  35m四方の広間。南側の壁は崩落気味で、瓦礫が散らばっている。<br>
  北壁西端に扉、北壁東端から15mのところに扉、東壁南端に扉がある。`,
 choices:[
  {label:'⬆ 北壁東寄りの扉へ',go:'ISKALD_C3'},
  {label:'⬆ 北壁西端の扉へ',go:'ISKALD_ROOM11'},
  {label:'➡ 東壁南端の扉へ',go:'ISKALD_C4'},
 ],
 },

 ISKALD_ROOM5:{
 scene:'dungeon',
 txt:`<span style="color:#f0ece0">奥の大広間</span><br><br>
  南北35m、東西30mの広間。回廊に囲まれた奥まった場所にある。床に古代の文様が刻まれている。<br>
  西壁の南端に扉、北壁東端から5mに扉がある。`,
 choices:[
  {label:'⬅ 西壁の扉へ',go:'ISKALD_C9'},
  {label:'⬆ 北壁の扉へ',go:'ISKALD_C10'},
 ],
 },

 ISKALD_ROOM6:{
 scene:'dungeon',
 txt:`<span style="color:#f0ece0">小部屋</span><br><br>
  15m四方の小部屋。石棚に割れた器が並んでいる。<br>
  西壁の南端に扉、南壁の西端に扉がある。`,
 choices:[
  {label:'⬅ 西壁の扉へ',go:'ISKALD_C4'},
  {label:'⬇ 南壁の扉へ',go:'ISKALD_C5'},
 ],
 },

 ISKALD_ROOM7:{
 scene:'dungeon',
 txt:`<span style="color:#f0ece0">大きな礼拝室</span><br><br>
  南北25m、東西35mの礼拝の間。石柱が列を成し、正面に祭壇の台座が残っている。<br>
  北壁東端に扉、西壁北端に扉、南壁東端にアーチがある。`,
 choices:[
  {label:'⬇ 南壁のアーチへ',go:'ISKALD_C10'},
  {label:'⬆ 北壁の扉へ',go:'ISKALD_ROOM3'},
  {label:'⬅ 西壁の扉へ',go:'ISKALD_ROOM1'},
 ],
 },

 ISKALD_ROOM8:{
 scene:'dungeon',
 txt:`<span style="color:#f0ece0">扉の小部屋</span><br><br>
  南北10m、東西15mの部屋。北壁と南壁のそれぞれに扉があるだけの殺風景な部屋。<br>
  通路の中継地点のような造りだ。<br>
  北壁東端に扉、南壁西端に扉がある。`,
 choices:[
  {label:'⬆ 北壁の扉へ',go:'ISKALD_C1'},
  {label:'⬇ 南壁の扉へ',go:'ISKALD_C3'},
 ],
 },

 ISKALD_ROOM9:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">縦長の部屋</span><br><br>
  南北25m、東西15mの部屋。壁に等間隔で燭台の台座が並んでいる。<br>
  南壁西端に扉がある。西壁の北端の石積みが…微妙に他と異なる部分がある。<br>
  ${PC._iskaldN_room9W?'<span style="color:#e8e4d8"> 西壁に隠し扉を発見している。</span>':''}`,
 choices:()=>{
  const ch=[];
  ch.push({label:'⬇ 南壁の扉へ',go:'ISKALD_C12'});
  if(PC._iskaldN_room9W) ch.push({label:'⬅ 西壁の隠し扉へ',go:'ISKALD_ROOM2'});
  else ch.push({label:' 西壁を調べる（INT Lv2 能力値テスト）',fn:()=>{
   dungeonTrySR({attr:'iq',level:2,
    successTxt:'石の積み方の違いを手がかりに調べると、西壁に隠し扉を発見した！',
    failTxt:'念入りに調べたが、何も見つからなかった。',
    successFn:()=>{PC._iskaldN_room9W=true;},
    choicesFn:(ok)=>ok?[{label:'⬅ 西壁の隠し扉へ',go:'ISKALD_ROOM2'}]:[{label:'⬆ 縦長の部屋へ',go:'ISKALD_ROOM9'}],
   });
  }});
  return ch;
 },
 },

 ISKALD_ROOM10:{
 scene:'dungeon',
 txt:`<span style="color:#f0ece0">横長の部屋</span><br><br>
  南北25m、東西15mの横に長い部屋。壁に沿って石製の長椅子が並んでいる。<br>
  北壁西端に扉、東壁中央に鉄で補強された扉がある。`,
 choices:[
  {label:'⬆ 北壁の扉へ',go:'ISKALD_C11'},
  {label:'➡ 東壁の鉄扉へ',go:'ISKALD_ROOM3'},
 ],
 },

 ISKALD_ROOM11:{
 scene:'dungeon',
 txt:`<span style="color:#f0ece0">隠し通路の小部屋</span><br><br>
  15m四方の小部屋。南壁西端に扉、北壁西端に隠し扉（こちら側からは見える）。<br>
  ひっそりとした隠し部屋のような雰囲気がある。`,
 choices:[
  {label:'⬇ 南壁の扉へ',go:'ISKALD_ROOM4'},
  {label:'⬆ 北壁の隠し扉へ',go:'ISKALD_C2'},
 ],
 },

 ISKALD_B2F:{
 scene:'dungeon',
 txt:`<span style="color:#f0ece0">地下2階への下り階段</span><br><br>
  通路東壁の大きな開口部から続く石段。地下2階へと延びているが、先は暗闇に沈んでいる。<br>
  <span style="color:#c0b098">……この先はまだ調査されていない。</span>`,
 choices:[
  {label:'⬅ 引き返す',go:'ISKALD_C3'},
 ],
 },


 TEST_MAGIC:{
 scene:'dungeon',
 txt:()=>PC.type==='wizard'?
 `魔法テスト。<br>あなたのST: ${PC.st}<br>好きな呪文を選んでください。`
 :`<span class="red">あなたは戦士なので魔法は使えません。</span>`,
 magic:'呪文テスト中',
 choices:[{label:'▶ 戻る',go:'START'}]
 },

 // ══════════════════════════════════════════
 //  カザーヌ「王城地下牢」
 // 地図: 9部屋 + 通路 a/c/e/i/m/n/r/s/u/v
 // 入口c（北東階段）→ 部屋2 → 部屋7 → 部屋1（ボス）
 //          ↓               ↑
 // 入口a（北）→ 部屋3 → 部屋4 → 部屋8 → 部屋5
 //          ↓               ↓
 //        部屋6           部屋9
 // ══════════════════════════════════════════

 // ── 王城地下牢 B1（改築後） ──────────────────────────────────
 // 移動関数

 CRYPT_ENTRANCE:{
 scene:'dungeon',
 txt:()=>{
  const torches = countTorches();
  const torchMsg = torches > 0
   ? `<span style="color:#e8e4d8"> 松明を ${torches}本 持っている。</span>`
   : `<span class="red"> 松明を持っていない！暗闇の中を進むことになる。</span>`;
  return ` <span class="gold" style="font-size:var(--font-base)">王城地下牢</span><br><br>
   カザーヌ王城の北塔裏手、草に埋もれた石段が地下へ続いている。<br>
   かつては政治犯を収容していたと伝わるが、今は誰も使っていない。<br>
   石扉の鉄環は錆びついているが、力を込めると重く軋んで開く。<br>
   冷たく湿った空気と、かすかな血と黴の匂いが漂ってくる。<br><br>
   ${torchMsg}<br>
   <span style="color:#c0b098">入口脇の石壁に「C棟 − 審問室」と読める古い文字が刻まれている。</span>`;
 },
 choices:[
  {label:' 地下へ降りる', fn:()=>{ initTorch(); cryptMove('CRYPT_P1'); }},
  {label:'← カザーヌへ戻る', go:'TOWN_KHAZAN'},
 ],
 },

 CRYPT_DARK_ESCAPE:{
 scene:'dungeon',
 txt:()=>` <span style="color:#f0ece0">暗闇を手探りで進む</span><br><br>
  <span style="color:var(--white2)">松明が切れた。完全な暗闇の中、冷たい石壁を伝いながら出口を探す……</span>`,
 choices:()=>[{label:' もう一度出口を探す（運 Lv3 能力値テスト）', fn:()=>{
  setupSavingRoll({
   attr:'lk', level:3,
   onSuccess:()=>{
    const s = document.getElementById('story');
    s.innerHTML = ` <span style="color:#f0ece0">暗闇を手探りで進む</span><br><br>
     冷たい石壁を伝いながら出口を探した。足音が上から聞こえる方向を頼りに、なんとか階段口へたどり着いた！`;
    renderChoices([{label:' 光の差す方へ', go:'CRYPT_ENTRANCE'}]);
    scrollToTop();
   },
   onFail:()=>{
    const dmg = 5;
    PC.con = Math.max(0, PC.con - dmg); updateHUD();
    const s = document.getElementById('story');
    if(PC.con <= 0){
     s.innerHTML = `<span class="red">石段で足を踏み外し、深みへ落ちた。動けない……</span>`;
     renderChoices([{label:'…（力尽きた）', go:'DEAD'}]);
    } else {
     s.innerHTML = ` 石壁に頭をぶつけ、よろめいた。まだ出口が見つからない。<br>
      <span class="red">体力-${dmg}（残り${PC.con}）</span>`;
     renderChoices([{label:' もう一度出口を探す（運 Lv3 能力値テスト）', go:'CRYPT_DARK_ESCAPE'}]);
    }
    scrollToTop();
   },
  });
 }}],
 },

 // ── 王城地下牢 B1（改築後） ──────────────────────────────────
 // 移動関数

 

 CRYPT_P1:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">王城地下牢 — 通路</span><br><br>
  南北15mの通路。北から南へ下る階段を降りるとここに出る。
  南端は行き止まりで、東壁に大きなアーチがある。`,
 choices:[
  {label:'↑ 北・地上への階段', go:'CRYPT_ENTRANCE'},
  {label:'→ 東壁のアーチ', fn:()=>cryptMove('CRYPT_ROOM8')},
 ],
 },

 CRYPT_P2:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">王城地下牢 — 通路</span><br><br>
  東西65mの長い通路。西端は行き止まりで、北壁に落とし格子がある。
  西端から20mの位置の南壁に扉がある。東端は北へ折れている。`,
 choices:[
  {label:'↖ 西端・落とし格子（強さ Lv3 能力値テスト）', fn:()=>{
   setupSavingRollWithParty({attr:'st', level:3,
    passTxt:'全力で持ち上げると、錆びた格子がゆっくり上がった！',
    failTxt:'格子はびくともしない。腕が痺れた。',
    onSuccess(){ renderChoices([
     {label:'↑ 北・格子の先（部屋1）', fn:()=>cryptMove('CRYPT_ROOM1')},
     {label:'→ 東端・北へ', fn:()=>cryptMove('CRYPT_P3')},
     {label:'↓ 真ん中・南の扉', fn:()=>cryptMove('CRYPT_ROOM8')},
    ]); },
    onFail(){ renderChoices([
     {label:'→ 東端・北へ', fn:()=>cryptMove('CRYPT_P3')},
     {label:'↓ 真ん中・南の扉', fn:()=>cryptMove('CRYPT_ROOM8')},
    ]); },
   });
  }},
  {label:'↓ 真ん中・南の扉', fn:()=>cryptMove('CRYPT_ROOM8')},
  {label:'↗ 東端・北へ', fn:()=>cryptMove('CRYPT_P3')},
 ],
 },

 CRYPT_P3:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">王城地下牢 — 通路</span><br><br>
  南北15mの短い通路。南端は西へ折れて長い通路へ続く。北端はT字路に合流する。`,
 choices:[
  {label:'↙ 南端・西へ', fn:()=>cryptMove('CRYPT_P2')},
  {label:'↑ 北・T字路', fn:()=>cryptMove('CRYPT_TJUNC1')},
 ],
 },

 CRYPT_TJUNC1:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">王城地下牢 — T字路</span><br><br>
  東西に延びる通路から南へ通路が分岐するT字路。床の中央に古い排水溝がある。
  壁に「審問棟」と刻まれた石板が残っている。`,
 choices:[
  {label:'↓ 南', fn:()=>cryptMove('CRYPT_P3')},
  {label:'← 西', fn:()=>cryptMove('CRYPT_P4')},
  {label:'→ 東', fn:()=>cryptMove('CRYPT_P5')},
 ],
 },

 CRYPT_P4:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">王城地下牢 — 通路</span><br><br>
  東西20mの通路。東はT字路へ続く。西端はB2への下り階段になっている。
  石段の先から冷たい空気が上がってくる。`,
 choices:[
  {label:'→ 東・T字路', fn:()=>cryptMove('CRYPT_TJUNC1')},
  {label:'← 西端・B2への階段', fn:()=>{ initTorch(); cryptMove('CRYPT2_ENTRANCE'); }},
 ],
 },

 CRYPT_P5:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">王城地下牢 — 通路</span><br><br>
  東西30mの通路。西はT字路へ続く。東端は行き止まりで、東壁に扉がある。
  壁に錆びた拘束具が残っている。`,
 choices:[
  {label:'← 西・T字路', fn:()=>cryptMove('CRYPT_TJUNC1')},
  {label:'→ 東端の扉', fn:()=>cryptMove('CRYPT_ROOM2')},
 ],
 },

 CRYPT_P6:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">王城地下牢 — 通路</span><br><br>
  東西15mの通路。東端は部屋へのアーチで終わっている。西端は北へ折れており別の通路へ続く。
  床に古い血の染みが残っている。`,
 choices:[
  {label:'→ 東端のアーチ', fn:()=>cryptMove('CRYPT_ROOM2')},
  {label:'↖ 西端・北へ', fn:()=>cryptMove('CRYPT_P7')},
 ],
 },

 CRYPT_P7:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">王城地下牢 — 通路</span><br><br>
  南北40mの通路。南端は東へ折れて別の通路へ続く。
  北へはまっすぐ続いているが暗くなっており先が見えない。`,
 choices:[
  {label:'↘ 南端・東へ', fn:()=>cryptMove('CRYPT_P6')},
  {label:'↑ 北（暗闇の先へ）', fn:()=>cryptMove('CRYPT_P8')},
 ],
 },

 CRYPT_P8:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">王城地下牢 — 通路</span><br><br>
  南北30mの通路。北端は東へ折れており別の通路へ続く。
  南へは暗くなっており先が見えない。壁に囚人の爪痕が刻まれている。`,
 choices:[
  {label:'↓ 南（暗闇の先へ）', fn:()=>cryptMove('CRYPT_P7')},
  {label:'↗ 北端・東へ', fn:()=>cryptMove('CRYPT_P9')},
 ],
 },

 CRYPT_P9:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">王城地下牢 — 通路</span><br><br>
  東西15mの短い通路。西端は南へ折れて別の通路へ、東端も南へ折れて別の通路へ続く。
  天井が低く、頭をかがめて進む必要がある。`,
 choices:[
  {label:'↙ 西端・南へ', fn:()=>cryptMove('CRYPT_P8')},
  {label:'↘ 東端・南へ', fn:()=>cryptMove('CRYPT_P10')},
 ],
 },

 CRYPT_P10:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">王城地下牢 — 通路</span><br><br>
  南北30mの長い通路。北端は西へ折れて別の通路へ続く。南端は行き止まりで、東壁に扉がある。
  壁に「C棟第4房」と刻まれた古い石板がある。`,
 choices:[
  {label:'↖ 北端・西へ', fn:()=>cryptMove('CRYPT_P9')},
  {label:'→ 南端・東壁の扉', fn:()=>cryptMove('CRYPT_ROOM4')},
 ],
 },

 CRYPT_P11:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">王城地下牢 — 通路</span><br><br>
  東西25mの通路。西端は行き止まりで北壁に大きなアーチがある。
  通路の真ん中あたりの南壁に扉がある。東端は南へ折れている。`,
 choices:[
  {label:'↑ 西端・北壁のアーチ', fn:()=>cryptMove('CRYPT_ROOM6')},
  {label:'↓ 真ん中・南壁の扉', fn:()=>cryptMove('CRYPT_ROOM3')},
  {label:'↘ 東端・南へ', fn:()=>cryptMove('CRYPT_P12')},
 ],
 },

 CRYPT_P12:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">王城地下牢 — 通路</span><br><br>
  南北45mの通路。北端は西へ折れて別の通路へ続く。
  南へはまっすぐ続いているが暗くなっており先が見えない。`,
 choices:[
  {label:'↖ 北端・西へ', fn:()=>cryptMove('CRYPT_P11')},
  {label:'↓ 南（暗闇の先へ）', fn:()=>cryptMove('CRYPT_P13')},
 ],
 },

 CRYPT_P13:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">王城地下牢 — 通路</span><br><br>
  南北45mの通路。南端は東へ折れて別の通路へ続く。
  北へは通路が続いているが暗くなっており先が見えない。`,
 choices:[
  {label:'↑ 北（暗闇の先へ）', fn:()=>cryptMove('CRYPT_P12')},
  {label:'↘ 南端・東へ', fn:()=>cryptMove('CRYPT_P14')},
 ],
 },

 CRYPT_P14:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">王城地下牢 — 通路</span><br><br>
  東西45mの通路。西端は北へ折れて別の通路へ、東端も北へ折れて別の通路へ続く。
  床の石畳が一部崩れており、慎重に歩く必要がある。`,
 choices:[
  {label:'↖ 西端・北へ', fn:()=>cryptMove('CRYPT_P13')},
  {label:'↗ 東端・北へ', fn:()=>cryptMove('CRYPT_P15')},
 ],
 },

 CRYPT_P15:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">王城地下牢 — 通路</span><br><br>
  南北65mの通路。南端は西へ折れて別の通路へ続く。
  北へは通路が続いているが暗くなっており先が見えない。`,
 choices:[
  {label:'↙ 南端・西へ', fn:()=>cryptMove('CRYPT_P14')},
  {label:'↑ 北（暗闇の先へ）', fn:()=>cryptMove('CRYPT_P16')},
 ],
 },

 CRYPT_P16:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">王城地下牢 — 通路</span><br><br>
  南北65mの通路。北端は西へ折れて別の通路へ続く。
  東壁北端から10mの位置に大きなアーチがある。南へは通路が続いているが暗くて先が見えない。`,
 choices:[
  {label:'↓ 南（暗闇の先へ）', fn:()=>cryptMove('CRYPT_P15')},
  {label:'↖ 北端・西へ', fn:()=>cryptMove('CRYPT_P17')},
  {label:'→ 東壁のアーチ', fn:()=>cryptMove('CRYPT_ROOM5')},
 ],
 },

 CRYPT_P17:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">王城地下牢 — 通路</span><br><br>
  東西25mの通路。東端は南へ折れて別の通路へ続く。西端は行き止まりで、西壁に扉がある。
  扉の枠に古い封印の刻印が施されている。`,
 choices:[
  {label:'↘ 東端・南へ', fn:()=>cryptMove('CRYPT_P16')},
  {label:'← 西端・西壁の扉', fn:()=>cryptMove('CRYPT_ROOM6')},
 ],
 },

 CRYPT_ROOM1:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">王城地下牢 — 部屋</span><br><br>
  南北45m、東西35mの縦長の部屋。かつて重要な囚人が収容されていたらしく、
  壁に特別な拘束具の取り付け跡がある。${Math.random()<0.05?'壁の隅に、誰かが刻んだらしい文字が残っている。「この地に眠るは……罪人にあらず……ただ、旅の……途中に……」':''}
  南壁西端から10mの位置に落とし格子、北壁西端に扉がある。`,
 choices:[
  {label:'↓ 南壁・落とし格子', fn:()=>cryptMove('CRYPT_P2')},
  {label:'↑ 北壁の扉', fn:()=>cryptMove('CRYPT_ROOM3')},
 ],
 },

 CRYPT_ROOM2:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">王城地下牢 — 部屋</span><br><br>
  南北45m、東西35mの部屋。壁に古い尋問記録の断片が貼り付けられたままになっている。
  ${Math.random()<0.05?'その中に一枚、毛色の違う記録が紛れている。「――奴は繰り返しこう言っていた。『扉の向こうには、まだ別の場所がある』と。正気を失っていたとしか思えぬ」':''}
  西壁南端に扉、西壁の真ん中あたりにアーチ、南壁西端に向かって何かを引きずったような跡がある。`,
 choices:()=>{
  const ch = [
   {label:'← 西壁南端の扉', fn:()=>cryptMove('CRYPT_P5')},
   {label:'← 西壁・中央のアーチ', fn:()=>cryptMove('CRYPT_P6')},
  ];
  ch.push({label:'↓ 南壁を調べる（知力 Lv2 能力値テスト）', fn:()=>{
   setupSavingRollWithParty({attr:'iq', level:2,
    passTxt:'石材の一部が他と継ぎ目が違う。押すと壁が静かに動いた——隠し扉だ！',
    failTxt:'壁を叩いてみるが異変は感じられない。その時、背後から気配が——',
    onSuccess(){ renderChoices([
     {label:'↓ 隠し扉の先（部屋7）', fn:()=>cryptMove('CRYPT_ROOM7')},
     {label:'← 西壁・南寄りの扉', fn:()=>cryptMove('CRYPT_P5')},
    ]); },
    onFail(){
     cryptCheckEncounter('CRYPT_ROOM2');
     renderChoices([
      {label:'← 西壁・南寄りの扉', fn:()=>cryptMove('CRYPT_P5')},
     ]);
    },
   });
  }});
  return ch;
 },
 },

 CRYPT_ROOM3:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">王城地下牢 — 部屋</span><br><br>
  南北45m、東西35mの部屋。壁に処刑記録と思われる文書が彫り込まれている。
  南壁西端に扉、北壁東端に扉がある。`,
 choices:[
  {label:'↓ 南壁の扉', fn:()=>cryptMove('CRYPT_ROOM1')},
  {label:'↗ 北壁・東寄りの扉', fn:()=>cryptMove('CRYPT_P11')},
 ],
 },

 CRYPT_ROOM4:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">王城地下牢 — 部屋</span><br><br>
  35m四方の部屋。かつて物資の保管庫として使われていたらしく、
  壁に棚の跡が並んでいる。今は空っぽだ。西壁南端に扉がある。`,
 choices:[
  {label:'← 西壁の扉', fn:()=>cryptMove('CRYPT_P10')},
 ],
 },

 CRYPT_ROOM5:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">王城地下牢 — 部屋</span><br><br>
  南北35m、東西45mの部屋。壁に古い紋章が描かれており、ここが特別な場所だったことを示す。
  西壁北端から10mの位置にアーチがある。`,
 choices:[
  {label:'← 西壁のアーチ', fn:()=>cryptMove('CRYPT_P16')},
 ],
 },

 CRYPT_ROOM6:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">王城地下牢 — 部屋</span><br><br>
  南北35m、東西45mの部屋。壁に鉄製の輪が取り付けられており、かつて囚人を繋いでいたらしい。
  ${Math.random()<0.05?'壁には、誰かの手による落書きも残っている。「あの部屋の奥、時々光が違う色に見える。見間違いだと言われたが」':''}
  東壁北端に扉、南壁西端から10mの位置にアーチがある。`,
 choices:[
  {label:'→ 東壁の扉', fn:()=>cryptMove('CRYPT_P17')},
  {label:'↓ 南壁のアーチ', fn:()=>cryptMove('CRYPT_P11')},
 ],
 },

 CRYPT_ROOM7:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">王城地下牢 — 部屋</span><br><br>
  南北35m、東西45mの部屋。隠し扉から入ったこの部屋は、外からは存在を知ることができない。
  北壁に部屋2への隠し扉がある（こちら側からは普通の扉として見える）。`,
 choices:[
  {label:'↑ 北壁の扉', fn:()=>cryptMove('CRYPT_ROOM2')},
 ],
 },

 CRYPT_ROOM8:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">王城地下牢 — 部屋</span><br><br>
  南北35m、東西45mの部屋。壁に古い命令書が貼り付けられたままになっている。
  西壁の北端から10mの位置にアーチ、北壁の中央に扉がある。`,
 choices:[
  {label:'← 西壁のアーチ', fn:()=>cryptMove('CRYPT_P1')},
  {label:'↑ 北壁の扉', fn:()=>cryptMove('CRYPT_P2')},
 ],
 },


 CRYPT2_ENTRANCE:{
 scene:'dungeon',
 txt:()=>{
  const torches = countTorches();
  const torchMsg = torches > 0
   ? `<span style="color:#e8e4d8"> 松明を ${torches}本 持っている。</span>`
   : `<span class="red"> 松明を持っていない！暗闇の中を進むことになる。</span>`;
  return ` <span class="gold" style="font-size:var(--font-base)">王城地下牢 B2F「深牢」</span><br><br>
   B1Fの倉庫跡から続く急な石段を降りると、さらに深い層に出る。<br>
   壁の石積みが古く、B1Fよりも年代が古い構造だ。<br>
   空気は重く、かすかに腐敗の臭いが漂っている。<br>
   北の拱門（a通路）が左右の通路へ分岐している。<br><br>
   ${torchMsg}`;
 },
 choices:[
  {label:' B2へ進む', fn:()=>cryptMove('CRYPT2_P1')},
  {label:'↑ B1への階段', fn:()=>go('CRYPT_P4')},
 ],
 },
 CRYPT2_DARK_ESCAPE:{
 scene:'dungeon',
 txt:()=>` <span style="color:#f0ece0">暗闇の深牢を手探りで進む</span><br><br>
  <span style="color:var(--white2)">松明が切れた。完全な暗闇の中、古い石壁を伝いながら出口を探す……</span>`,
 choices:()=>[{label:' もう一度出口を探す（運 Lv3 能力値テスト）', fn:()=>{
  setupSavingRoll({
   attr:'lk', level:3,
   onSuccess:()=>{
    const s = document.getElementById('story');
    s.innerHTML = ` <span style="color:#f0ece0">暗闇の深牢を手探りで進む</span><br><br>
     古い石壁を伝い、上へ続く空気の流れを頼りに階段を見つけた！`;
    renderChoices([{label:' B1Fの光の方へ', go:'CRYPT2_ENTRANCE'}]);
    scrollToTop();
   },
   onFail:()=>{
    const dmg = 6;
    PC.con = Math.max(0, PC.con - dmg); updateHUD();
    const s = document.getElementById('story');
    if(PC.con <= 0){
     s.innerHTML = `<span class="red">深い穴に落ちた。動けない……</span>`;
     renderChoices([{label:'…（力尽きた）', go:'DEAD'}]);
    } else {
     s.innerHTML = `石壁に激突し、よろめいた。まだ出口が見つからない。<br>
      <span class="red">体力-${dmg}（残り${PC.con}）</span>`;
     renderChoices([{label:' もう一度出口を探す（運 Lv3 能力値テスト）', go:'CRYPT2_DARK_ESCAPE'}]);
    }
    scrollToTop();
   },
  });
 }}],
 },

 // ── B2F 部屋1（北右・旧衛兵待機室）──
 // 接続: a通路(北)入口 / 西(Door→部屋8) / 南(通路→部屋3)

 CRYPT2_P1:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">王城地下牢 B2 — 通路</span><br><br>
  B1からの階段を降りきると東西40mの通路の西端に出る。途中で踊り場があり、階段は西から東へと向きを変えている。
  西端から10mの位置の南壁に扉がある。東端は北へ折れている。`,
 choices:[
  {label:'← 西端・B1への階段', fn:()=>go('CRYPT2_ENTRANCE')},
  {label:'↓ 南壁の扉', fn:()=>cryptMove('CRYPT2_ROOM7')},
  {label:'↗ 東端・北へ', fn:()=>cryptMove('CRYPT2_P2')},
 ],
 },

 CRYPT2_P2:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">王城地下牢 B2 — 通路</span><br><br>
  南北15mの短い通路。南端は西へ折れてB1への階段がある通路へ、北端はT字路に合流する。`,
 choices:[
  {label:'↙ 南端・西へ', fn:()=>cryptMove('CRYPT2_P1')},
  {label:'↑ 北・T字路', fn:()=>cryptMove('CRYPT2_TJUNC1')},
 ],
 },

 CRYPT2_TJUNC1:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">王城地下牢 B2 — T字路</span><br><br>
  東西に走る通路から南に伸びる通路が分岐するT字路。壁に「B棟」と刻まれた石板がある。`,
 choices:[
  {label:'↓ 南', fn:()=>cryptMove('CRYPT2_P2')},
  {label:'← 西', fn:()=>cryptMove('CRYPT2_P3')},
  {label:'→ 東', fn:()=>cryptMove('CRYPT2_P4')},
 ],
 },

 CRYPT2_P3:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">王城地下牢 B2 — 通路</span><br><br>
  東西60mの通路。東はT字路へ続く。西端は南へ折れている。`,
 choices:[
  {label:'→ 東・T字路', fn:()=>cryptMove('CRYPT2_TJUNC1')},
  {label:'↙ 西端・南へ', fn:()=>cryptMove('CRYPT2_P4A')},
 ],
 },

 CRYPT2_P4:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">王城地下牢 B2 — 通路</span><br><br>
  東西20mの通路。西はT字路へ続く。東端にB3への階段があるが、瓦礫で完全に埋もれており通れない。`,
 choices:[
  {label:'← 西・T字路', fn:()=>cryptMove('CRYPT2_TJUNC1')},
 ],
 },

 CRYPT2_P4A:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">王城地下牢 B2 — 通路</span><br><br>
  南北75mの長い通路。北端は東へ折れてT字路から続く通路へ、南端も東へ折れて別の通路へ続く。
  壁に古い水の染みが縦に走っている。`,
 choices:[
  {label:'↗ 北端・東へ', fn:()=>cryptMove('CRYPT2_P3')},
  {label:'↘ 南端・東へ', fn:()=>cryptMove('CRYPT2_P5')},
 ],
 },

 CRYPT2_P5:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">王城地下牢 B2 — 通路</span><br><br>
  東西65mの通路。西端は北へ折れて別の通路へ、東端も北へ折れて別の通路へ続く。
  東端から20mの位置の南壁に落とし格子がある。${PC._crypt2_lever?'格子は開いている。':'格子は固く閉じている。'}`,
 choices:()=>{
  const ch = [
   {label:'↖ 西端・北へ', fn:()=>cryptMove('CRYPT2_P4A')},
   {label:'↗ 東端・北へ', fn:()=>cryptMove('CRYPT2_P6')},
  ];
  if(PC._crypt2_lever){
   ch.splice(1,0,{label:'↓ 南壁の落とし格子（部屋5）', fn:()=>cryptMove('CRYPT2_ROOM5')});
  } else {
   ch.splice(1,0,{label:'↓ 南壁の落とし格子を力ずくで開けようとする', fn:()=>{
    const s=document.getElementById('story');
    s.innerHTML+='<br><br><span style="color:#e8e0d0"> 格子を揺さぶっていると、背後から足音が近づいてきた——</span>';
    renderChoices([{label:'▶ 身構える', fn:()=>cryptB2Guard('CRYPT2_P5')}]);
   }});
  }
  return ch;
 },
 },

 CRYPT2_P6:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">王城地下牢 B2 — 通路</span><br><br>
  南北35mの通路。南端は西へ折れて別の通路へ続く。北端は行き止まりで、東壁に扉がある。`,
 choices:[
  {label:'↙ 南端・西へ', fn:()=>cryptMove('CRYPT2_P5')},
  {label:'→ 北端・東壁の扉', fn:()=>cryptMove('CRYPT2_ROOM2')},
 ],
 },

 CRYPT2_P7:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">王城地下牢 B2 — 通路</span><br><br>
  東西15mの短い通路。東端は南へ折れて別の通路へ続く。西端は行き止まりで、南壁に落とし格子がある。`,
 choices:[
  {label:'↘ 東端・南へ', fn:()=>cryptMove('CRYPT2_P8')},
  {label:'↓ 西端・南壁の落とし格子', fn:()=>{
   setupSavingRollWithParty({attr:'st', level:3,
    passTxt:'全力で持ち上げると格子が動いた！',
    failTxt:'格子はびくともしない。',
    onSuccess(){ renderChoices([
     {label:'↓ 格子の先（部屋2）', fn:()=>cryptMove('CRYPT2_ROOM2')},
     {label:'↘ 東端・南へ', fn:()=>cryptMove('CRYPT2_P8')},
    ]); },
    onFail(){ renderChoices([{label:'↘ 東端・南へ', fn:()=>cryptMove('CRYPT2_P8')}]); },
   });
  }},
 ],
 },

 CRYPT2_P8:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">王城地下牢 B2 — 通路</span><br><br>
  南北50mの通路。北端は西へ折れて別の通路へ続く。南へは暗くなっており先が見えない。`,
 choices:[
  {label:'↖ 北端・西へ', fn:()=>cryptMove('CRYPT2_P7')},
  {label:'↓ 南（暗闇の先へ）', fn:()=>cryptMove('CRYPT2_P9')},
 ],
 },

 CRYPT2_P9:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">王城地下牢 B2 — 通路</span><br><br>
  南北50mの通路。北と南どちらも暗くて先が見えない。`,
 choices:[
  {label:'↑ 北（暗闇の先へ）', fn:()=>cryptMove('CRYPT2_P8')},
  {label:'↓ 南（暗闇の先へ）', fn:()=>cryptMove('CRYPT2_P10')},
 ],
 },

 CRYPT2_P10:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">王城地下牢 B2 — 通路</span><br><br>
  南北50mの通路。北と南どちらも暗くて先が見えない。壁が湿っており、どこかで水が染み出している。`,
 choices:[
  {label:'↑ 北（暗闇の先へ）', fn:()=>cryptMove('CRYPT2_P9')},
  {label:'↓ 南（暗闇の先へ）', fn:()=>cryptMove('CRYPT2_P11')},
 ],
 },

 CRYPT2_P11:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">王城地下牢 B2 — 通路</span><br><br>
  南北50mの通路。南端は西へ折れて別の通路へ続く。北へは暗くなっており先が見えない。`,
 choices:[
  {label:'↑ 北（暗闇の先へ）', fn:()=>cryptMove('CRYPT2_P10')},
  {label:'↙ 南端・西へ', fn:()=>cryptMove('CRYPT2_P12')},
 ],
 },

 CRYPT2_P12:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">王城地下牢 B2 — 通路</span><br><br>
  東西60mの通路。東端は北へ折れて別の通路へ続く。西へは暗くなっており先が見えない。`,
 choices:[
  {label:'↗ 東端・北へ', fn:()=>cryptMove('CRYPT2_P11')},
  {label:'← 西（暗闇の先へ）', fn:()=>cryptMove('CRYPT2_P13')},
 ],
 },

 CRYPT2_P13:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">王城地下牢 B2 — 通路</span><br><br>
  東西50mの通路。東と西どちらも暗くて先が見えない。`,
 choices:[
  {label:'→ 東（暗闇の先へ）', fn:()=>cryptMove('CRYPT2_P12')},
  {label:'← 西（暗闇の先へ）', fn:()=>cryptMove('CRYPT2_P14')},
 ],
 },

 CRYPT2_P14:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">王城地下牢 B2 — 通路</span><br><br>
  東西60mの通路。東へは暗くて先が見えない。西端は北へ折れて別の通路へ続く。`,
 choices:[
  {label:'→ 東（暗闇の先へ）', fn:()=>cryptMove('CRYPT2_P13')},
  {label:'↖ 西端・北へ', fn:()=>cryptMove('CRYPT2_P15')},
 ],
 },

 CRYPT2_P15:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">王城地下牢 B2 — 通路</span><br><br>
  南北50mの通路。南端は東へ折れて別の通路へ続く。北へは暗くなっており先が見えない。`,
 choices:[
  {label:'↘ 南端・東へ', fn:()=>cryptMove('CRYPT2_P14')},
  {label:'↑ 北（暗闇の先へ）', fn:()=>cryptMove('CRYPT2_P16')},
 ],
 },

 CRYPT2_P16:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">王城地下牢 B2 — 通路</span><br><br>
  南北50mの通路。北と南どちらも暗くて先が見えない。`,
 choices:[
  {label:'↓ 南（暗闇の先へ）', fn:()=>cryptMove('CRYPT2_P15')},
  {label:'↑ 北（暗闇の先へ）', fn:()=>cryptMove('CRYPT2_P17')},
 ],
 },

 CRYPT2_P17:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">王城地下牢 B2 — 通路</span><br><br>
  南北35mの通路。南へは暗くなっており先が見えない。北はT字路に合流する。`,
 choices:[
  {label:'↓ 南（暗闇の先へ）', fn:()=>cryptMove('CRYPT2_P16')},
  {label:'↑ 北・T字路', fn:()=>cryptMove('CRYPT2_TJUNC2')},
 ],
 },

 CRYPT2_TJUNC2:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">王城地下牢 B2 — T字路</span><br><br>
  南北に走る通路から東への通路が分岐するT字路。床に古い燭台の台座が残っている。`,
 choices:[
  {label:'↓ 南', fn:()=>cryptMove('CRYPT2_P17')},
  {label:'→ 東', fn:()=>cryptMove('CRYPT2_P18')},
  {label:'↑ 北', fn:()=>cryptMove('CRYPT2_P20')},
 ],
 },

 CRYPT2_P18:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">王城地下牢 B2 — 通路</span><br><br>
  東西40mの通路。西はT字路へ続く。東端は北へ折れて別の通路へ続く。`,
 choices:[
  {label:'← 西・T字路', fn:()=>cryptMove('CRYPT2_TJUNC2')},
  {label:'↗ 東端・北へ', fn:()=>cryptMove('CRYPT2_P19')},
 ],
 },

 CRYPT2_P19:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">王城地下牢 B2 — 通路</span><br><br>
  南北25mの通路。南端は西へ折れて別の通路へ続く。北端は行き止まりで北壁に部屋1へのアーチがある。`,
 choices:[
  {label:'↙ 南端・西へ', fn:()=>cryptMove('CRYPT2_P18')},
  {label:'↑ 北端・アーチ', fn:()=>cryptMove('CRYPT2_ROOM1')},
 ],
 },

 CRYPT2_P20:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">王城地下牢 B2 — 通路</span><br><br>
  南北35mの通路。南はT字路へ続く。北端は行き止まりで、東壁に扉がある。`,
 choices:[
  {label:'↓ 南・T字路', fn:()=>cryptMove('CRYPT2_TJUNC2')},
  {label:'→ 北端・東壁の扉', fn:()=>cryptMove('CRYPT2_ROOM1')},
 ],
 },

 CRYPT2_P21:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">王城地下牢 B2 — 通路</span><br><br>
  東西25mの通路。東端は行き止まりで東壁に扉がある。西端は南へ折れて別の通路へ続く。`,
 choices:[
  {label:'→ 東端の扉', fn:()=>cryptMove('CRYPT2_ROOM5')},
  {label:'↙ 西端・南へ', fn:()=>cryptMove('CRYPT2_P22')},
 ],
 },

 CRYPT2_P22:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">王城地下牢 B2 — 通路</span><br><br>
  南北40mの通路。北端は東へ折れて別の通路へ続く。南端は行き止まりで、南壁に扉がある。`,
 choices:[
  {label:'↗ 北端・東へ', fn:()=>cryptMove('CRYPT2_P21')},
  {label:'↓ 南端の扉', fn:()=>cryptMove('CRYPT2_ROOM3')},
 ],
 },

 CRYPT2_P23:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">王城地下牢 B2 — 通路</span><br><br>
  南北55mの通路。北端は行き止まりで北壁に扉がある。南端は東へ折れて別の通路へ続く。`,
 choices:[
  {label:'↑ 北端の扉', fn:()=>cryptMove('CRYPT2_ROOM5')},
  {label:'↘ 南端・東へ', fn:()=>cryptMove('CRYPT2_P24')},
 ],
 },

 CRYPT2_P24:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">王城地下牢 B2 — 通路</span><br><br>
  東西65mの通路。西端は北へ折れて別の通路へ、東端も北へ折れて別の通路へ続く。
  東端の東壁に扉がある。東端から20mの位置の北壁に落とし格子がある。
  ${PC._crypt2_room3_lever?'格子は開いている。':'格子は固く閉じており、どうすれば開くか分からない。'}`,
 choices:()=>{
  const ch = [
   {label:'↖ 西端・北へ', fn:()=>cryptMove('CRYPT2_P23')},
  ];
  if(PC._crypt2_room3_lever){
   ch.push({label:'↑ 北壁の落とし格子（部屋6）', fn:()=>cryptMove('CRYPT2_ROOM6')});
  } else {
   ch.push({label:'↑ 北壁の落とし格子を力ずくで開けようとする', fn:()=>{
    const s=document.getElementById('story');
    s.innerHTML+='<br><br><span style="color:#e8e0d0"> 格子に手をかけたその瞬間、背後の暗闘から音がした——</span>';
    renderChoices([{label:'▶ 身構える', fn:()=>cryptB2Guard('CRYPT2_P24')}]);
   }});
  }
  ch.push({label:'↗ 東端・北へ', fn:()=>cryptMove('CRYPT2_P25')});
  ch.push({label:'→ 東端・東壁の扉', fn:()=>cryptMove('CRYPT2_ROOM4')});
  return ch;
 },
 },

 CRYPT2_P25:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">王城地下牢 B2 — 通路</span><br><br>
  南北55mの通路。南端は西へ折れて別の通路へ続く。北端は行き止まりで北壁に扉がある。`,
 choices:[
  {label:'↙ 南端・西へ', fn:()=>cryptMove('CRYPT2_P24')},
  {label:'↑ 北端の扉', fn:()=>cryptMove('CRYPT2_ROOM5')},
 ],
 },

 CRYPT2_ROOM1:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">王城地下牢 B2 — 部屋</span><br><br>
  35m四方の部屋。部屋の真ん中に大きなレバーが設置されている。
  ${PC._crypt2_lever?'レバーはすでに引かれた状態になっている。':'引くと何かが動くのだろうか。'}
  南壁東端にアーチ、西壁南端から5mの位置に扉がある。`,
 choices:()=>{
  const ch = [];
  if(!PC._crypt2_lever){
   ch.push({label:' レバーを引く', fn:()=>{
    PC._crypt2_lever=true;
    showSaveToast(' 重いレバーを引いた。遠くで何かが動く音がした。');
    go('CRYPT2_ROOM1');
   }});
  }
  ch.push({label:'↓ 南壁のアーチ', fn:()=>cryptMove('CRYPT2_P19')});
  ch.push({label:'← 西壁の扉', fn:()=>cryptMove('CRYPT2_P20')});
  return ch;
 },
 },

 CRYPT2_ROOM2:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">王城地下牢 B2 — 部屋</span><br><br>
  35m四方の部屋。壁に鎖の跡が残っており、ここに囚人が収容されていたことが分かる。
  西壁南端に扉、北壁東端に落とし格子がある。`,
 choices:[
  {label:'← 西壁南端の扉', fn:()=>cryptMove('CRYPT2_P6')},
  {label:'↑ 北壁・落とし格子', fn:()=>{
   setupSavingRollWithParty({attr:'st', level:3,
    passTxt:'格子が上がった！',
    failTxt:'格子は動かない。',
    onSuccess(){ renderChoices([
     {label:'↑ 格子の先', fn:()=>cryptMove('CRYPT2_P7')},
     {label:'← 西壁の扉', fn:()=>cryptMove('CRYPT2_P6')},
    ]); },
    onFail(){ renderChoices([{label:'← 西壁の扉', fn:()=>cryptMove('CRYPT2_P6')}]); },
   });
  }},
 ],
 },

 CRYPT2_ROOM3:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">王城地下牢 B2 — 部屋</span><br><br>
  35m四方の部屋。部屋の中央に石製のレバーが据えられている。
  ${PC._crypt2_room3_lever?'レバーはすでに引かれた状態になっている。':'これが何を制御しているかは分からない。'}
  北壁中央に扉がある。`,
 choices:()=>{
  const ch=[];
  if(!PC._crypt2_room3_lever){
   ch.push({label:' レバーを引く', fn:()=>{
    PC._crypt2_room3_lever=true;
    showSaveToast(' 重いレバーを引いた。どこかで音がした。');
    go('CRYPT2_ROOM3');
   }});
  }
  ch.push({label:'↑ 北壁の扉', fn:()=>cryptMove('CRYPT2_P22')});
  return ch;
 },
 },

 CRYPT2_ROOM4:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">王城地下牢 B2 — 部屋</span><br><br>
  25m四方の部屋。壁に古い収容記録が彫り込まれており、収容されていた者の名と日付が並んでいる。
  西壁南端に扉がある。`,
 choices:[
  {label:'← 西壁の扉', fn:()=>cryptMove('CRYPT2_P24')},
 ],
 },

 CRYPT2_ROOM5:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">王城地下牢 B2 — 大広間</span><br><br>
  南北50m、東西85mの広大な部屋。かつて処刑場として使われていたらしく、中央に処刑台の跡がある。
  ${!PC._crypt2_boss_cleared?'部屋の中央、処刑台の上に巨大な存在が鎮座している。鎖と鉄で構成された守護者——その目が赤く光った。':'番人を倒した後の広間は静まり返っている。'}
  北壁中央に落とし格子（${PC._crypt2_lever?'開放中':'閉鎖中'}）、西壁南端から5mの位置に扉、南壁西端から10mの位置に扉、南壁東端から10mの位置に扉がある。`,
 choices:()=>{
  const ch = [];
  if(!PC._crypt2_boss_cleared){
   ch.push({label:' 鎖の守護者と戦う', fn:()=>{
    const s = document.getElementById('story');
    s.innerHTML += '<br><br><span style="color:#f0ddd8"> 鎖の守護者が動き出した！鉄の鎖が空気を切り裂く音がした。</span>';
    renderChoices([]);
    drawScene('combat');
    startCombat({
     name:'鎖の守護者', mr:250, armor:5,
     canFlee: true, win:'__noop__', lose:'DEAD',
     onWin(){
      PC._crypt2_boss_cleared = true;
      addLifeEvent('', '王城地下牢B2の鎖の守護者を倒した。');
      document.getElementById('cbt-area').classList.add('hidden');
      document.getElementById('scroll-area').classList.remove('in-combat');
      document.getElementById('text-win').style.display='';
      cbtState = null;
      showSaveToast(' 鎖の守護者を倒した！');
      go('CRYPT2_ROOM5');
     },
    });
   }});
   ch.push({label:'← 退く', fn:()=>cryptMove('CRYPT2_P21')});
   return ch;
  }
  ch.push({label:'← 西壁の扉', fn:()=>cryptMove('CRYPT2_P21')});
  if(PC._crypt2_lever){
   ch.push({label:'↑ 北壁・落とし格子', fn:()=>cryptMove('CRYPT2_P5')});
  }
  ch.push({label:'↙ 南壁・西寄りの扉', fn:()=>cryptMove('CRYPT2_P23')});
  ch.push({label:'↓ 南壁・中央の扉', fn:()=>cryptMove('CRYPT2_P25')});
  return ch;
 },
 },

 CRYPT2_ROOM6:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">王城地下牢 B2 — 宝物庫</span><br><br>
  45m四方の部屋。壁に古代の紋章が刻まれており、この場所が王城の秘密の宝物庫だったことを示す。
  ${PC._crypt2_boss_cleared?'鎖の守護者を倒したことで、収納箱を自由に調べることができる。':'この部屋に入るには守護者を倒さなければならない。'}
  石製の収納箱が${(()=>{ const n=(PC._crypt2_room6_chest_count||(PC._crypt2_room6_chest_count=3+Math.floor(Math.random()*3))); return n; })()}個並んでいる。
  南壁東端から15mの位置に落とし格子がある。`,
 choices:()=>{
  const ch = [];
  if(!PC._crypt2_boss_cleared){
   ch.push({label:'← 引き返す', fn:()=>cryptMove('CRYPT2_P24')});
   return ch;
  }
  // 収納箱ボタン
  const total = PC._crypt2_room6_chest_count || 3;
  for(let i=1; i<=total; i++){
   const key = `_crypt2_room6_chest${i}`;
   if(!PC[key]){
    ch.push({label:` 収納箱${i}を開ける`, fn:()=>{
     PC[key] = true;
     // GPのみ再抽選（CP・SPは振り直し）
     let result = '';
     let attempts = 0;
     do {
      result = generateTreasure(250);
      attempts++;
     } while(attempts < 5 && (result.includes('CP（') || result.includes('SP（')));
     const s = document.getElementById('story');
     s.innerHTML += `<br><br><span style="color:#f0ece0"> 収納箱${i}：${result}</span>`;
     if(tryFindLoreRelic()){
      s.innerHTML += `<br><span style="color:#ffcc88"> 収納箱の隅、他の品とは明らかに毛色の違う${LORE_RELIC_ITEM.icon} ${LORE_RELIC_ITEM.name}が紛れていた。</span>`;
     }
     updateHUD();
     renderChoices(PC._crypt2_room6_choices ? PC._crypt2_room6_choices() : [{label:'▶ OK', fn:()=>go('CRYPT2_ROOM6')}]);
    }});
   } else {
    ch.push({label:` 収納箱${i}（開封済み）`, fn:()=>{}});
   }
  }
  ch.push({label:'↓ 南壁の落とし格子', fn:()=>cryptMove('CRYPT2_P24')});
  return ch;
 },
 },

 CRYPT2_ROOM7:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">王城地下牢 B2 — 部屋</span><br><br>
  45m四方の部屋。石造りの長椅子が残っており、かつて衛兵の待機所として使われていたらしい。
  北壁中央に扉がある。`,
 choices:[
  {label:'↑ 北壁の扉', fn:()=>cryptMove('CRYPT2_P1')},
 ],
 },


 CRYPT3_ENTRANCE:{
 scene:'dungeon',
 txt:()=>{
  const torches = countTorches();
  const tMsg = torches>0
   ? `<span style="color:#e8e4d8"> 松明を ${torches}本 持っている。</span>`
   : `<span class="red"> 松明がない！暗闇の中を進むことになる。</span>`;
  return ` <span class="gold" style="font-size:var(--font-base)">王城地下牢 B3F「忘れられた牢」</span><br><br>
   B2Fの最深部から続く急な石段を降りると、さらに古い石組みの層に出る。<br>
   空気は凍るように冷たく、壁から水がにじんでいる。<br>
   北の扉（a通路）の向こうで低いうなり声が聞こえる——。<br><br>
   ${tMsg}`;
 },
 choices:[
  {label:' 北西（a通路→部屋8）へ進む', fn:()=>initTorch(), go:'CRYPT3_8'},
  {label:' 北東（a通路→部屋1）へ進む', fn:()=>initTorch(), go:'CRYPT3_1'},
  {label:'⬆ B2Fへ戻る', go:'CRYPT2_4'},
 ],
 },

 CRYPT3_DARK_ESCAPE:{
 scene:'dungeon',
 txt:()=>`<span style="color:var(--white2)">松明が切れた。完全な暗闇の中、石壁を這いずりながら出口を探す……</span>`,
 choices:()=>[{label:' もう一度出口を探す（運 Lv3 能力値テスト）', fn:()=>{
  setupSavingRoll({
   attr:'lk', level:3,
   onSuccess:()=>{
    const s = document.getElementById('story');
    s.innerHTML = ` 石壁を這いずりながら上への空気の流れを探した。凍えながらも階段口に辿り着いた！`;
    renderChoices([{label:' B2Fの灯りの方へ', go:'CRYPT3_ENTRANCE'}]);
    scrollToTop();
   },
   onFail:()=>{
    const dmg=7; PC.con=Math.max(0,PC.con-dmg); updateHUD();
    const s = document.getElementById('story');
    if(PC.con<=0){
     s.innerHTML = `<span class="red">深みに落ちた。もう動けない……</span>`;
     renderChoices([{label:'…（力尽きた）',go:'DEAD'}]);
    } else {
     s.innerHTML = `濡れた石に足を滑らせ壁に叩き付けられた。まだ出口が見つからない。<br>
      <span class="red">体力-${dmg}（残り${PC.con}）</span>`;
     renderChoices([{label:' もう一度出口を探す（運 Lv3 能力値テスト）',go:'CRYPT3_DARK_ESCAPE'}]);
    }
    scrollToTop();
   },
  });
 }}],
 },

 // ── B3F 部屋1（北右・旧見張り塔基部）──
 // 接続: a通路(北・Portcullis右上) / 西(Door→部屋9) / 南(通路→部屋3)
 CRYPT3_1:{
 scene:'dungeon',
 txt:` <span style="color:#f0ece0">B3F 部屋1 — 旧見張り塔基部</span><br><br>
  かつて地下牢の見張りが常駐した石室。崩れかけた螺旋階段の基部が残る。<br>
  右上（Portcullis）は封鎖されており、入口からしか来られない。<br>
  西の扉（Door）を抜けると部屋9へ、南の通路は部屋3へ続く。<br><br>
  <span style="color:#c0b098">━ 出口: 北（入口・Portcullis）/ 西（Door→部屋9）/ 南（→部屋3） ━</span>`,
 choices:[
  {label:'⬅ 西（部屋9・Door）へ進む', go:'CRYPT3_DOOR_19'},
  {label:'⬇ 南へ進む', go:'CRYPT3_3'},
  {label:'⬆ 北（入口）へ戻る', go:'CRYPT3_ENTRANCE'},
 ],
 },

 // ── B3F 部屋8（北左大・古代礼拝堂）──
 // 接続: a通路(北) / 右(Door→部屋9) / 左(通路→部屋6)
 CRYPT3_8:{
 scene:'dungeon',
 txt:()=>{
  const cleared=PC._crypt3_8cleared;
  return ` <span style="color:#f0ece0">B3F 部屋8 — 古代礼拝堂</span><br><br>
   巨大な石造りの礼拝堂跡。崩れた石像が床に散乱し、壁には消えかけた古代文字が刻まれている。<br>
   正面に壊れた祭壇があり、その上に何か置かれているようだ。<br>
   ${cleared?'<span style="color:#c0b098">（すでに探索済みだ）</span>':'<span style="color:#d8d0c0">祭壇の石像の目が、ぼんやりと青く光っている……</span>'}<br><br>
   <span style="color:#c0b098">━ 出口: 北（入口）/ 右（Door→部屋9）/ 左（→部屋6） ━</span>`;
 },
 choices:()=>{
  const ch=[];
  if(!PC._crypt3_8cleared){
   ch.push({label:' 祭壇を調べる（知力 Lv2 能力値テスト）', fn:()=>dungeonTrySR({
    attr:'iq', level:2, flagKey:'_crypt3_8cleared',
    successFn:()=>{ const gp=50+Math.floor(Math.random()*51); gainGPAll(gp); gainAPAll(40); updateHUD(); PC._crypt3_8gp=gp; },
    successTxt:()=>`古代文字を解読し、祭壇の隠し格納庫を発見。聖水と金貨が眠っていた。+${PC._crypt3_8gp||0}GP　経験値+40`,
    failTxt:()=>`古代文字は読めなかった。石像の目の光が弱まった気がする。`,
    choicesFn:(ok)=>[
     {label:' 東（部屋9・Door）へ進む',go:'CRYPT3_DOOR_89'},
     {label:' 東（部屋9・Door）へ進む',go:'CRYPT3_DOOR_89'},
    ],
   })});
  }
  ch.push({label:' 東（部屋9・Door）へ進む', go:'CRYPT3_DOOR_89'});
  ch.push({label:'⬅ 西へ進む', go:'CRYPT3_6'});
  ch.push({label:'⬆ 北（入口）へ戻る', go:'CRYPT3_ENTRANCE'});
  return ch;
 },
 },

 // Door（部屋8↔部屋9）
 CRYPT3_DOOR_89:{
 scene:'dungeon',
 txt:` <span style="color:#f0ece0">扉（部屋8 — 部屋9）</span><br><br>
  石造りの重い扉。表面に「B3-C棟」と刻まれている。`,
 choices:[
  {label:' 東へ進む', go:'CRYPT3_9'},
  {label:'⬅ 西へ進む', go:'CRYPT3_8'},
 ],
 },

 // Door（部屋1↔部屋9）
 CRYPT3_DOOR_19:{
 scene:'dungeon',
 txt:` <span style="color:#f0ece0">扉（部屋1 — 部屋9）</span><br><br>
  鉄製の古い扉。蝶番が錆びているが開閉できる。`,
 choices:[
  {label:'⬅ 西へ進む', go:'CRYPT3_9'},
  {label:' 東へ進む', go:'CRYPT3_1'},
 ],
 },

 // ── B3F 部屋6（左大・牢番の間）──
 // 接続: 右(→部屋8) / 右下(→部屋5)
 CRYPT3_6:{
 scene:'dungeon',
 txt:()=>{
  const cleared=PC._crypt3_6cleared;
  return ` <span style="color:#f0ece0">B3F 部屋6 — 牢番の間</span><br><br>
   地下牢の牢番が居住していた広大な石室。腐った家具の残骸と武具の破片が散乱する。<br>
   壁に地図の断片が残っており、B3Fの構造が一部読み取れる。<br>
   ${cleared?'<span style="color:#c0b098">（すでに探索済みだ）</span>':'<span style="color:#f0ddd8">部屋の奥で鎧が一人でに動いている——！</span>'}<br><br>
   <span style="color:#c0b098">━ 出口: 右（→部屋8）/ 右下（→部屋5） ━</span>`;
 },
 choices:()=>{
  const ch=[];
  if(!PC._crypt3_6cleared){
   ch.push({label:' 動く鎧と戦う', fn:()=>{
    startCombat({name:'呪われた鎧兵', mr:80, armor:8, isHuman:false, canFlee:true,
     onWin:()=>{ PC._crypt3_6cleared=true; const gp=40+Math.floor(Math.random()*41); gainGPAll(gp); gainAPAll(60); updateHUD();
      showSaveToast(` 鎧兵を倒した！+${gp}GP　経験値+60`); }
    },'CRYPT3_6');
   }, go:'__travel__'});
  }
  ch.push({label:' 東へ進む', go:'CRYPT3_8'});
  ch.push({label:'↘ 南東へ進む', go:'CRYPT3_5'});
  return ch;
 },
 },

 // ── B3F 部屋9（中央・分岐広間）──
 // 接続: 左(Door→部屋8) / 右(Door→部屋1) / 左下(Door→部屋5) / 右下(Port→部屋3) / 下(Door→部屋2) / 右(Port・i通路→部屋3)
 CRYPT3_9:{
 scene:'dungeon',
 txt:` <span style="color:#f0ece0">B3F 部屋9 — 中央分岐広間</span><br><br>
  B3F最大の分岐点。六方向に出口がある石室。<br>
  床の中央に干からびた死体が倒れており、手に古い鍵を握っている。<br>
  右下（Portcullis）の向こうに部屋3、左下（Door）は部屋5、下（Door）は部屋2へ続く。<br><br>
  <span style="color:#c0b098">━ 出口: 左（Door→8）/ 右（Door→1）/ 左下（Door→5）/ 右下（Port→3）/ 下（Door→2）/ i通路（Port→3） ━</span>`,
 choices:()=>{
  const ch=[];
  // 死体の鍵を調べる（未取得なら）
  if(!PC._crypt3_key9){
   ch.push({label:' 死体の手から鍵を取る', fn:()=>{
    PC._crypt3_key9=true;
    const story=document.getElementById('story');
    story.innerHTML+=`<div style="color:#ffcc44;font-size:calc(var(--font-sm) + 1px);margin-top:8px"> 古い錠前の鍵を手に入れた。どこかの扉を開けられそうだ。</div>`;
    _restoreNodeChoices();
   }});
  }
  ch.push({label:'⬅ 西（部屋8・Door）へ進む', go:'CRYPT3_DOOR_89'});
  ch.push({label:' 東（部屋1・Door）へ進む', go:'CRYPT3_DOOR_19'});
  ch.push({label:'↙ 南西（部屋5・Door）へ進む', go:'CRYPT3_DOOR_95'});
  ch.push({label:'↘ 南東（部屋3・Portcullis）へ進む', go:'CRYPT3_PORT_13'});
  ch.push({label:'⬇ 南（部屋2・Door）へ進む', go:'CRYPT3_DOOR_92'});
  return ch;
 },
 },

 // Door（部屋9↔部屋5）
 CRYPT3_DOOR_95:{
 scene:'dungeon',
 txt:` <span style="color:#f0ece0">扉（部屋9 — 部屋5）</span><br><br>
  木製の古い扉。表面に囚人番号が彫り込まれている。`,
 choices:[
  {label:'↙ 南西へ進む', go:'CRYPT3_5'},
  {label:'↗ 北東へ進む', go:'CRYPT3_9'},
 ],
 },

 // Portcullis（部屋9↔部屋3）
 CRYPT3_PORT_13:{
 scene:'dungeon',
 txt:()=>` <span style="color:#f0ece0">落し格子（部屋9 — 部屋3）</span><br><br>
  重い格子が右下の通路を塞いでいる。${PC._crypt3_port13?'格子は上がっている。':'格子の向こうに広い石室が見える。'}`,
 choices:()=>[
  ...(!PC._crypt3_port13
   ?[{label:' 格子を持ち上げる（強さ Lv3 能力値テスト）', fn:()=>dungeonTrySR({
      attr:'st', level:3, flagKey:'_crypt3_port13',
      successTxt:()=>`渾身の力で格子を引き上げた！部屋3への道が開いた。`,
      failTxt:()=>`格子は重すぎて持ち上がらない。`,
      choicesFn:(ok)=>ok
       ?[{label:'↘ 南東へ進む',go:'CRYPT3_3'},{label:'↗ 北東へ進む',go:'CRYPT3_9'}]
       :[{label:'↗ 北東へ進む',go:'CRYPT3_9'}],
     })}]
   :[{label:'↘ 南東へ進む', go:'CRYPT3_3'}]
  ),
  {label:'↗ 北東へ進む', go:'CRYPT3_9'},
 ],
 },

 // Door（部屋9↔部屋2）
 CRYPT3_DOOR_92:{
 scene:'dungeon',
 txt:` <span style="color:#f0ece0">扉（部屋9 — 部屋2）</span><br><br>
  石造りの扉。通路が下の広間へ続く。`,
 choices:[
  {label:'⬇ 南へ進む', go:'CRYPT3_2'},
  {label:'⬆ 北へ進む', go:'CRYPT3_9'},
 ],
 },

 // ── B3F 部屋5（左中・錬金術師の残滓）──
 // 接続: 右上(Door→部屋9) / 左(→部屋6) / 右(m通路・Locked→r通路→Door→部屋2)
 CRYPT3_5:{
 scene:'dungeon',
 txt:()=>{
  return ` <span style="color:#f0ece0">B3F 部屋5 — 錬金術師の残滓</span><br><br>
   かつて地下牢の錬金術師が使っていた実験室跡。ガラス管の残骸と薬品の染みが床に広がる。<br>
   右（m通路）に頑丈な錠前付き扉がある。${PC._crypt3_key9?'持っている鍵が使えそうだ。':''}<br><br>
   <span style="color:#c0b098">━ 出口: 右上（Door→9）/ 左（→6）/ 右（m通路・Locked→r→部屋2） ━</span>`;
 },
 choices:()=>{
  const ch=[];
  ch.push({label:'⬅ 西へ進む', go:'CRYPT3_6'});
  if(PC._crypt3_key9){
   ch.push({label:' 持っている鍵でm通路を開ける', fn:()=>{
    PC._crypt3_lock_m=true;
    const story=document.getElementById('story');
    story.innerHTML+=`<div style="color:#ffcc44;font-size:calc(var(--font-sm) + 1px);margin-top:8px"> 鍵が合った！扉が開いた。r通路を通って部屋2へ続く。</div>`;
    renderChoices([{label:' 東（r通路→部屋2）へ進む',go:'CRYPT3_LOCK_M'},{label:'↗ 北東へ進む',go:'CRYPT3_DOOR_95'}]);
   }});
  } else if(PC._crypt3_lock_m){
   ch.push({label:' 東（r通路→部屋2）へ進む', go:'CRYPT3_LOCK_M'});
  } else {
   ch.push({label:' m通路の錠前を壊す（器用さ Lv3 能力値テスト）', fn:()=>dungeonTrySR({
    attr:'dex', level:3, flagKey:'_crypt3_lock_m',
    successTxt:()=>`三重の錠前を解除した！r通路を通って部屋2へ続く道が開いた。`,
    failTxt:()=>`精巧な錠前には歯が立たない。鍵か、より高い技術が必要だ。`,
    choicesFn:(ok)=>ok
     ?[{label:' 東（r通路→部屋2）へ進む',go:'CRYPT3_LOCK_M'},{label:'↗ 北東へ進む',go:'CRYPT3_DOOR_95'}]
     :[{label:'↗ 北東へ進む',go:'CRYPT3_DOOR_95'},{label:' 東（部屋9・Door）へ進む',go:'CRYPT3_DOOR_89'}],
   })});
  }
  ch.push({label:'↗ 北東（部屋9・Door）へ進む', go:'CRYPT3_DOOR_95'});
  return ch;
 },
 },

 // m通路・r通路（部屋5→部屋2の隠し経路）
 CRYPT3_LOCK_M:{
 scene:'dungeon',
 txt:` <span style="color:#f0ece0">m通路・r通路（部屋5 — 部屋2）</span><br><br>
  錠前を外した先に続く細い通路。壁沿いに進むと「r」と刻まれた石柱がある。<br>
  通路はさらに南東の部屋2へと続く。`,
 choices:[
  {label:'⬇ 先へ進む', go:'CRYPT3_2'},
  {label:'⬆ 戻るへ', go:'CRYPT3_5'},
 ],
 },

 // ── B3F 部屋3（右中大・呪いの牢）──
 // 接続: 左上(Port→部屋9) / 北(→部屋1) / 左(e通路) / 下(u通路→部屋7)
 CRYPT3_3:{
 scene:'dungeon',
 txt:()=>{
  const cleared=PC._crypt3_3cleared;
  return ` <span style="color:#f0ece0">B3F 部屋3 — 呪いの牢</span><br><br>
   巨大な鉄格子の牢が連なる広間。牢の中に白骨が散乱しており、壁には呪いの文字が彫られている。<br>
   ${cleared?'<span style="color:#c0b098">（すでに探索済みだ）</span>':'<span style="color:#f0ddd8">牢の奥から複数の赤い目が光っている——！</span>'}<br><br>
   <span style="color:#c0b098">━ 出口: 左上（Port→部屋9）/ 北（→部屋1）/ 左（e通路）/ 下（u通路→部屋7） ━</span>`;
 },
 choices:()=>{
  const ch=[];
  if(!PC._crypt3_3cleared){
   ch.push({label:' 牢の怪物と戦う', fn:()=>{
    startCombat({
     enemies:[
      {name:'ウェアウルフ', mr:120, curMR:120, armor:4},
      {name:'ウェアウルフ', mr:120, curMR:120, armor:4},
     ],
     canFlee:true,
     onWin:()=>{ PC._crypt3_3cleared=true; const gp=60+Math.floor(Math.random()*61); gainGPAll(gp); gainAPAll(80); updateHUD();
      showSaveToast(` ウェアウルフを倒した！+${gp}GP　経験値+80`); }
    },'CRYPT3_3');
   }, go:'__travel__'});
  }
  ch.push({label:'↖ 北西（部屋9・Port）へ進む', go:'CRYPT3_PORT_13'});
  ch.push({label:'⬆ 北へ進む', go:'CRYPT3_1'});
  ch.push({label:'⬇ 南（u通路→部屋7）へ進む', go:'CRYPT3_7'});
  if(PC._crypt3_3cleared){
   ch.push({label:' 牢の中を探索（運 Lv2 能力値テスト）', fn:()=>dungeonTrySR({
    attr:'lk', level:2,
    successFn:()=>{ if(!PC._crypt3_3searched){ const gp=40+Math.floor(Math.random()*41); gainGPAll(gp); updateHUD(); PC._crypt3_3gp=gp; PC._crypt3_3searched=true; } },
    successTxt:()=>PC._crypt3_3gp?`牢の床石の下に隠された財布を発見。+${PC._crypt3_3gp}GP`:`すでに探索済みだ。`,
    failTxt:()=>`牢の中には白骨以外何もなかった。`,
    choicesFn:()=>[{label:'⬇ 南（u通路→部屋7）へ進む',go:'CRYPT3_7'},{label:'⬆ 北へ進む',go:'CRYPT3_1'}],
   })});
  }
  return ch;
 },
 },

 // ── B3F 部屋2（中下・旧処刑記録室）──
 // 接続: 上(Door→部屋9) / 左上(r通路→部屋5) / 下(Locked Door→部屋4)
 CRYPT3_2:{
 scene:'dungeon',
 txt:()=>{
  const cleared=PC._crypt3_2cleared;
  return ` <span style="color:#f0ece0">B3F 部屋2 — 旧処刑記録室</span><br><br>
   処刑された囚人の名が刻まれた石碑が壁を埋め尽くす不気味な部屋。<br>
   下（Locked Door）の先が部屋4への最終区画だ。${PC._crypt3_key9?'持っている鍵が使えそうだ。':''}<br>
   ${cleared?'<span style="color:#c0b098">（すでに探索済みだ）</span>':'<span style="color:#e0d8c8">石碑の文字が浮かび上がり、霊体が凝集している……</span>'}<br><br>
   <span style="color:#c0b098">━ 出口: 上（Door→9）/ 左上（r通路→5）/ 下（Locked Door→4） ━</span>`;
 },
 choices:()=>{
  const ch=[];
  if(!PC._crypt3_2cleared){
   ch.push({label:' 霊体と戦う', fn:()=>{
    startCombat({
     enemies:[
      {name:'グール', mr:56, curMR:56, armor:2},
      {name:'グール', mr:56, curMR:56, armor:2},
      {name:'グール', mr:56, curMR:56, armor:2},
     ],
     canFlee:true,
     onWin:()=>{ PC._crypt3_2cleared=true; const gp=45+Math.floor(Math.random()*46); gainGPAll(gp); gainAPAll(70); updateHUD();
      showSaveToast(` グールを倒した！+${gp}GP　経験値+70`); }
    },'CRYPT3_2');
   }, go:'__travel__'});
  }
  // Locked Doorを開ける
  if(PC._crypt3_key9){
   ch.push({label:' 鍵で下の扉を開ける', fn:()=>{
    PC._crypt3_lock24=true;
    const story=document.getElementById('story');
    story.innerHTML+=`<div style="color:#ffcc44;font-size:calc(var(--font-sm) + 1px);margin-top:8px"> 鍵が合った！最奥部への扉が開いた——。</div>`;
    renderChoices([{label:'⬇ 南（部屋4・最奥）へ進む',go:'CRYPT3_4'},{label:'⬆ 北へ進む',go:'CRYPT3_DOOR_92'}]);
   }});
  } else if(PC._crypt3_lock24){
   ch.push({label:'⬇ 南（部屋4・最奥）へ進む', go:'CRYPT3_4'});
  } else {
   ch.push({label:' Locked Doorを壊す（強さ Lv3 能力値テスト）', fn:()=>dungeonTrySR({
    attr:'st', level:3, flagKey:'_crypt3_lock24',
    successTxt:()=>`渾身の力で鍵を叩き壊した！最奥への扉が開いた。`,
    failTxt:()=>`扉はびくともしない。鍵か、より大きな力が必要だ。`,
    choicesFn:(ok)=>ok
     ?[{label:'⬇ 南へ進む',go:'CRYPT3_4'},{label:'⬆ 北へ進む',go:'CRYPT3_DOOR_92'}]
     :[{label:'⬆ 北へ進む',go:'CRYPT3_DOOR_92'}],
   })});
  }
  ch.push({label:'⬆ 北（部屋9・Door）へ進む', go:'CRYPT3_DOOR_92'});
  ch.push({label:'↖ 北西（r通路→部屋5）へ進む', go:'CRYPT3_LOCK_M'});
  return ch;
 },
 },

 // ── B3F 部屋7（右下大・深淵の螺旋廊）──
 // 接続: 上(u通路→部屋3/部屋4) / 螺旋(s→v→x・Arch出口)
 CRYPT3_7:{
 scene:'dungeon',
 txt:()=>{
  const cleared=PC._crypt3_7cleared;
  return ` <span style="color:#f0ece0">B3F 部屋7 — 深淵の螺旋廊</span><br><br>
   右下に向かって螺旋状に下降する巨大な石廊下。s通路→v通路→x通路（Arch）へ続き、<br>
   Archは地上——カザーヌ城外壁近くに繋がる緊急脱出口だ。<br>
   ${cleared?'<span style="color:#c0b098">（螺旋廊の番人は倒されている）</span>':'<span style="color:#f0ddd8">螺旋廊の中央に、巨大な蜘蛛の魔物が待ち構えている……</span>'}<br><br>
   <span style="color:#c0b098">━ 出口: 上（u通路→部屋3/4）/ 螺旋→x（Arch→地上出口） ━</span>`;
 },
 choices:()=>{
  const ch=[];
  if(!PC._crypt3_7cleared){
   ch.push({label:' 螺旋廊の番人と戦う', fn:()=>{
    startCombat({
     enemies:[{name:'巨大蜘蛛（変異体）', mr:160, curMR:160, armor:6}],
     canFlee:true,
     onWin:()=>{ PC._crypt3_7cleared=true; const gp=80+Math.floor(Math.random()*81); gainGPAll(gp); gainAPAll(90); updateHUD();
      showSaveToast(` 番人を倒した！+${gp}GP　経験値+90`); }
    },'CRYPT3_7');
   }, go:'__travel__'});
  }
  ch.push({label:'⬆ 北（u通路→部屋3）へ進む', go:'CRYPT3_3'});
  if(PC._crypt3_7cleared){
   ch.push({label:' 螺旋廊（s→v→x・Arch）から地上へ脱出', fn:()=>dungeonTrySR({
    attr:'iq', level:1,
    successTxt:()=>`螺旋廊を難なく通過。x通路のArchから地上の光が見えた！`,
    failTxt:()=>`廊下で迷ったが、なんとかArchを見つけた。`,
    choicesFn:()=>[{label:' 地上（カザーヌ）へ出る',go:'TOWN_KHAZAN'}],
   })});
  }
  return ch;
 },
 },

 // ── B3F 部屋4（最深部・ボス「深牢の魔王」）──
 // 接続: 上(Locked Door→部屋2) / 右(u通路→部屋7) / 下(w通路→B4F or 地上Arch出口w)
 CRYPT3_4:{
 scene:'dungeon',
 txt:()=>{
  const cleared=PC._crypt3_4cleared;
  if(cleared) return ` <span style="color:#f0ece0">B3F 部屋4 — 最深の大牢（ボス討伐済み）</span><br><br>
   地下牢の最深部。すべての敵を退け、静寂が戻っている。<br>
   右（u通路）は螺旋廊の部屋7へ、下（w通路Arch）はさらに深い階層か地上への出口だ。<br><br>
   <span style="color:#c0b098">━ 出口: 上（Locked→部屋2）/ 右（u→部屋7）/ 下（w・Arch出口） ━</span>`;
  return ` <span style="color:#f0ece0">B3F 部屋4 — 最深の大牢</span><br><br>
   地下牢の最深部にある巨大な石牢。黒い炎が燭台に灯り、空気が歪んでいる。<br>
   中央の玉座に、朽ちた王冠を被った巨大な骸骨の魔王が腰かけている。<br>
   「……また来た者がいる。この牢に来た者は永遠に出られぬ」<br>
   地の底を揺るがすような声が石室に響いた。<br><br>
   <span class="red"> B3F最終ボス「忘れられた牢の魔王」が立ち上がった！</span>`;
 },
 choices:()=>{
  if(PC._crypt3_4cleared){
   return [
    {label:' 玉座を調べる（運 Lv3 能力値テスト）', fn:()=>dungeonTrySR({
     attr:'lk', level:3,
     successFn:()=>{ if(!PC._crypt3_4searched){ const gp=250+Math.floor(Math.random()*251); gainGPAll(gp); gainAPAll(100); updateHUD(); PC._crypt3_4gp=gp; PC._crypt3_4searched=true; } },
     successTxt:()=>PC._crypt3_4gp?`玉座の玉石の下に封印された隠し金庫！古代の宝が眠っていた。+${PC._crypt3_4gp}GP　経験値+100`:`すでに調べ済みだ。`,
     failTxt:()=>`玉座を念入りに調べたが、何も見つからなかった。`,
     choicesFn:()=>[
      {label:'⬆ 北へ進む',go:'CRYPT3_2'},
      {label:' 東（u通路→部屋7）へ進む',go:'CRYPT3_7'},
      {label:' 下（w通路Arch）から地上へ出る',go:'TOWN_KHAZAN'},
     ],
    })},
    {label:'⬆ 北へ進む', go:'CRYPT3_2'},
    {label:' 東（u通路→部屋7）へ進む', go:'CRYPT3_7'},
    {label:' 下（w通路Arch）から地上へ出る', go:'TOWN_KHAZAN'},
   ];
  }
  return [
   {label:' 忘れられた牢の魔王と戦う', fn:()=>{
    startCombat({
     name:'忘れられた牢の魔王', mr:360, armor:14, isHuman:false, canFlee:false,
     onWin:()=>{
      PC._crypt3_4cleared=true;
      const gp=350+Math.floor(Math.random()*351);
      gainGPAll(gp); gainAPAll(180); updateHUD();
      showSaveToast(` 魔王を倒した！+${gp}GP　経験値+180`);
     }
    },'CRYPT3_4');
   }, go:'__travel__'},
   {label:' 逃げる（素早さ Lv3 能力値テスト）', fn:()=>{
    setupSavingRoll({
     attr:'spd', level:3,
     onFail:()=>{ const d=15; PC.con=Math.max(0,PC.con-d); updateHUD(); showSaveToast(`逃げ損ねた！CON-${d}`); go('CRYPT3_2'); },
     onSuccess:()=>{ go('CRYPT3_2'); },
    });
   }},
  ];
 },
 },

 // ══════════════════════════════════════════
 //  封じられた神殿 B2F「古の回廊」
 // 地図: 17部屋 + 通路 a/c/e/i/m/n/r/s/u/v/w/x/z
 // 中央に巨大洞窟を中心とした放射状構造
 // 入口a(北Arch) → 部屋10 → 部屋12 → 部屋16(六角) → 部屋2(大六角)
 // 部屋1(中央洞窟) ← 部屋2/3/4/5/6/7/8/9
 // 部屋11(最南・ Down=B1F帰還)
 // ══════════════════════════════════════════
 // MR基準: B1Fモンスターの約1.5倍

 // ══════════════════════════════════════════
 //  封じられた神殿 B2F（リムホルムのダンジョン レベル2）
 // ══════════════════════════════════════════

 SHR2_ENTRANCE:{
 scene:'dungeon',
 txt:()=>{
  const torches = countTorches();
  const tMsg = torches>0
   ? `<span style="color:#e8e4d8"> 松明を ${torches}本 持っている。</span>`
   : `<span class="red"> 松明がない！暗闇の中を進むことになる。</span>`;
  return ` <span class="gold" style="font-size:var(--font-base)">封じられた神殿 B2F — 通路1</span><br><br>
   祭壇裏から続く急な石段を降りきると、東西25mの通路の東端に出る。<br>
   西端は北へ折れて続いている。<br><br>
   ${tMsg}`;
 },
 choices:[
  {label:'⬆ 東へ戻る', go:'SHRINE_B2F'},
  {label:'⬅ 西へ進む', fn:()=>initTorch(), go:'SHR2_C2'},
 ],
 },

 SHR2_DARK_ESCAPE:{
 scene:'dungeon',
 txt:()=>`<span style="color:var(--white2)">松明が切れた。完全な暗闇の中、壁を伝いながら出口を探す……</span>`,
 choices:()=>[{label:' もう一度出口を探す（運 Lv3 能力値テスト）', fn:()=>{
  setupSavingRoll({
   attr:'lk', level:3,
   onSuccess:()=>{
    const s = document.getElementById('story');
    s.innerHTML = ` 壁を伝い、微かな風を頼りに石段口にたどり着いた！`;
    renderChoices([{label:' B1Fの光の方へ',go:'SHR2_ENTRANCE'}]);
    scrollToTop();
   },
   onFail:()=>{
    const dmg=6; PC.con=Math.max(0,PC.con-dmg); updateHUD();
    const s = document.getElementById('story');
    if(PC.con<=0){
     s.innerHTML = `<span class="red">段差に落ちた。動けない……</span>`;
     renderChoices([{label:'…（力尽きた）',go:'DEAD'}]);
    } else {
     s.innerHTML = `壁に激突しよろめいた。<br><span class="red">体力-${dmg}（残り${PC.con}）</span>`;
     renderChoices([{label:' もう一度出口を探す（運 Lv3 能力値テスト）',go:'SHR2_DARK_ESCAPE'}]);
    }
    scrollToTop();
   },
  });
 }}],
 },

 // ── 通路2（南北15m）── ゴブリンの守衛による通行料イベント ──
 SHR2_C2:{
 scene:'dungeon',
 txt:()=>{
  const base = ` <span style="color:#f0ece0">B2F 通路2</span><br><br>
   南北15mの通路。南端、北端ともに東へ折れている。<br>
   北端の西側の壁に扉がある。`;
  if(PC._shr2GuardsDefeated){
   return `${base}<br><br><span style="color:#b0a080">先ほど倒したゴブリンの守衛の骸が、道の端に転がっている。</span>`;
  }
  return `${base}<br><br>
   <span style="color:#f0ddd8">通路の左右に椅子を置いて、<b>ゴブリンの守衛が2体</b>陣取っている。</span><br>
   <span style="color:#c8b8a0">「ここを通りたければ、一人当たり50GPの通行料を払ってもらおうか」</span>`;
 },
 choices:()=>{
  const normalChoices = [
   {label:'⬇ 南へ進んで東に曲がる', go:'SHR2_ENTRANCE'},
   {label:'⬆ 北へ進んで東に曲がる', go:'SHR2_C3'},
   {label:'⬅ 西の扉へ進む', go:'SHR2_R12'},
  ];
  if(PC._shr2GuardsDefeated) return normalChoices;

  const partySize = 1 + (PC.party||[]).length;
  const toll = partySize * 50;
  return [
   {label:` 通行料${toll}GPを払う（1人50GP×${partySize}人）`, fn:()=>{
    const s = document.getElementById('story');
    if((PC.gold||0) < toll){
     if(s) s.innerHTML += `<br><span class="red">「金が足りないようだな。それなら通すわけにはいかない」</span>`;
     return;
    }
    PC.gold -= toll; updateHUD();
    if(s) s.innerHTML += `<br><span style="color:#e0d8c8">${toll}GPを支払うと、ゴブリンたちは椅子をどけて道を空けた。</span>`;
    renderChoices(normalChoices);
   }},
   {label:' 戦う', fn:()=>{
    startCombatNPC({
     enemies: [generateGoblinGuard(5), generateGoblinGuard(5)],
     win:'SHR2_C2', lose:'DEAD',
     onWin: ()=>{
      PC._shr2GuardsDefeated = true;
      PC.gold = (PC.gold||0) + 400;
      PC._pendingMsg = (PC._pendingMsg||'') + `<div style="color:#e8e4d8;font-size:var(--font-sm);margin-bottom:8px"> ゴブリンたちが腰掛けていた椅子の下に木箱が隠されているのを見つけた。中には合計400GPが入っていた！</div>`;
     },
    });
   }},
  ];
 },
 },

 // ── 通路3（東西35m）──
 SHR2_C3:{
 scene:'dungeon',
 txt:()=>{
  const found = PC._shr2c3Door;
  return ` <span style="color:#f0ece0">B2F 通路3</span><br><br>
   東西に35m延びる通路。西端は行き止まりで南に折れており、西壁に扉がついているのが見える。<br>
   東端も行き止まりだ。${found?'壁の一部が扉になっていることが分かっている。':'よく見ると、何かが隠されていそうな気配がある。'}`;
 },
 choices:()=>{
  const ch=[
   {label:'⬅ 西へ進む', go:'SHR2_C2'},
  ];
  if(PC._shr2c3Door){
   ch.push({label:'➡ 東の隠し扉へ進む', go:'SHR2_R11'});
  } else {
   ch.push({label:' 東端の壁を調べる（知力 Lv2 能力値テスト）', fn:()=>dungeonTrySR({
    attr:'iq', level:2,
    successFn:()=>{ PC._shr2c3Door=true; },
    successTxt:()=>'壁の継ぎ目に指をかけると、隠し扉が見つかった！',
    failTxt:()=>'壁を隅々まで調べたが、何も見つからなかった。',
    choicesFn:()=>{
     const c=[{label:'⬅ 西へ進む', go:'SHR2_C2'}];
     if(PC._shr2c3Door) c.push({label:'➡ 東の隠し扉へ進む', go:'SHR2_R11'});
     else c.push({label:' 東端の壁を調べる（知力 Lv2 能力値テスト）', go:'SHR2_C3'});
     return c;
    }
   })});
  }
  return ch;
 },
 },

 // ── 部屋11（正六角形・1辺15m）──
 SHR2_R11:{
 scene:'dungeon',
 txt:` <span style="color:#f0ece0">B2F 部屋11</span><br><br>
  1辺15mの正六角形の部屋。西壁の扉は通路側からは隠し扉になっているようだ。<br>
  南壁に扉、東壁にも扉がある。<br><br>
  <span style="color:#c0b098">━ 西（→通路3）/ 南（→通路5）/ 東（→部屋1） ━</span>`,
 choices:[
  {label:'⬅ 西へ進む', go:'SHR2_C3'},
  {label:'⬇ 南へ進む', go:'SHR2_C5'},
  {label:'➡ 東へ進む', go:'SHR2_R1'},
 ],
 },

 // ── 通路5（東西35m・罠A）──
 SHR2_C5:{
 scene:'dungeon',
 txt:` <span style="color:#f0ece0">B2F 通路5</span><br><br>
  東西35mに延びる通路。西端は暗く沈んでいて先が見通せない。<br>
  東端は行き止まりで、北壁に扉がある。<br>
  通路の中ほどにうっすらと不自然な段差が見える。`,
 choices:[
  {label:'⬅ 西へ進む', go:'SHR2_C4'},
  {label:'➡ 東へ進む', go:'SHR2_R11'},
  {label:' 怪しい段差を確認する（器用さ Lv2 能力値テスト）', fn:()=>dungeonTrySR({
   attr:'dex', level:2,
   successTxt:()=>'注意深く踏み越え、罠を無傷でやり過ごした。',
   failFn:()=>{ const dmg=Nd6(2); PC.con=Math.max(0,PC.con-dmg); updateHUD(); return dmg; },
   failTxt:()=>{ const dmg=Nd6(2); return `踏み込んだ瞬間、矢が飛び出した！体力-${dmg}`; },
   choicesFn:()=>[
    {label:'⬅ 西へ進む', go:'SHR2_C4'},
    {label:'➡ 東へ進む', go:'SHR2_R11'},
   ]
  })},
 ],
 },

 // ── 通路4（東西50m）──
 SHR2_C4:{
 scene:'dungeon',
 txt:()=>{
  const found = PC._shr2c4Door;
  return ` <span style="color:#f0ece0">B2F 通路4</span><br><br>
   東西50mの延びる通路。西端には落とし格子があり、その先に部屋が見える。<br>
   東端は暗く沈んでいて先が見通せない。<br>
   西端から35mほどの南壁に、奇妙に胴の長い犬をかたどった紋章が刻まれている。${found?'仕組みはすでに解明済みだ。':''}`;
 },
 choices:()=>{
  const ch=[
   {label:'⬅ 西へ進む', go:'SHR2_R2'},
   {label:'➡ 東へ進む', go:'SHR2_C5'},
  ];
  if(PC._shr2c4Door){
   ch.push({label:' 南の隠し扉へ進む', go:'SHR2_R7'});
  } else {
   ch.push({label:' 犬の紋章を調べる（器用さ Lv2 能力値テスト）', fn:()=>dungeonTrySR({
    attr:'dex', level:2,
    successFn:()=>{ PC._shr2c4Door=true; },
    successTxt:()=>'紋章の目を押し込むと、南壁が音を立てて開いた！',
    failTxt:()=>'紋章を色々といじってみたが、何も起こらなかった。',
    choicesFn:()=>{
     const c=[
      {label:'⬅ 西へ進む', go:'SHR2_R2'},
      {label:'➡ 東へ進む', go:'SHR2_C5'},
     ];
     if(PC._shr2c4Door) c.push({label:' 南の隠し扉へ進む', go:'SHR2_R7'});
     else c.push({label:' 犬の紋章を調べる（器用さ Lv2 能力値テスト）', go:'SHR2_C4'});
     return c;
    }
   })});
  }
  return ch;
 },
 },

 // ── 部屋7（南北15m東西35m）──
 SHR2_R7:{
 scene:'dungeon',
 txt:()=>{
  if(!PC._shr2R7ZombiesDefeated){
   return ` <span style="color:#f0ece0">B2F 部屋7</span><br><br>
    <span style="color:#f0ddd8">扉を開けて部屋に足を踏み入れた瞬間、四方の暗がりから<b>ゾンビが5体</b>、一斉に襲いかかってきた！</span>`;
  }
  const lever = PC._shr2LeverPulled;
  const chestOpened = PC._shr2R7ChestOpened;
  return ` <span style="color:#f0ece0">B2F 部屋7</span><br><br>
   南北15m東西35mの部屋。北壁東端から10mのところに扉がある。通路側からは隠し扉になっているようだ。<br>
   南壁に大きなレバーが取り付けられている。${lever?'レバーはすでに引かれている。':'何かの機構につながっているようだ。'}<br>
   西壁の真ん中あたりに、${chestOpened?'開けた後の空の宝箱がある。':'古びた宝箱が置かれている。'}`;
 },
 choices:()=>{
  if(!PC._shr2R7ZombiesDefeated){
   return [{label:' 戦う', fn:()=>{
    startCombat({
     enemies: Array.from({length:5},()=>({name:'ゾンビ', mr:50, armor:0})),
     canFlee:true, win:'SHR2_R7', lose:'DEAD',
     onWin:()=>{ PC._shr2R7ZombiesDefeated = true; },
    });
   }}];
  }
  const ch=[{label:'⬆ 北へ進む', go:'SHR2_C4'}];
  if(PC._shr2LeverPulled){
   ch.push({label:' レバー', fn:()=>showSaveToast('もう引かれている。遠くでガコン、という音が既に響いた後だ。')});
  } else {
   ch.push({label:' 大きなレバーを引く', fn:()=>{
    PC._shr2LeverPulled = true;
    showSaveToast('レバーを引くと、遠くで重い格子が持ち上がる音が響いた！');
   }});
  }
  if(!PC._shr2R7ChestOpened){
   ch.push({label:' 西壁の宝箱を調べる', fn:()=>{
    PC._shr2R7ChestOpened = true;
    PC.gold = (PC.gold||0) + 600;
    updateHUD();
    showSaveToast('宝箱を開けると、600GPが入っていた！');
    renderChoices(NODES.SHR2_R7.choices());
   }});
  }
  return ch;
 },
 },

 // ── 部屋2（南北35m東西15m）──
 SHR2_R2:{
 scene:'dungeon',
 txt:` <span style="color:#f0ece0">B2F 部屋2</span><br><br>
  南北35m東西15mの部屋。東壁の北端から5mのところに扉がある。また東壁南端には落とし格子がある。`,
 choices:[
  {label:'➡ 東の扉へ進む', go:'SHR2_R12'},
  {label:'↘ 東南の落とし格子へ進む', go:'SHR2_C4'},
 ],
 },

 // ── 部屋12（正六角形・1辺15m）──
 SHR2_R12:{
 scene:'dungeon',
 txt:` <span style="color:#f0ece0">B2F 部屋12</span><br><br>
  1辺15mの正六角形の部屋。東壁に扉、西壁にも扉がある。<br><br>
  <span style="color:#c0b098">━ 東（→通路2）/ 西（→部屋2） ━</span>`,
 choices:[
  {label:'➡ 東へ進む', go:'SHR2_C2'},
  {label:'⬅ 西へ進む', go:'SHR2_R2'},
 ],
 },

 // ── 部屋1（南北35m東西15m）──
 SHR2_R1:{
 scene:'dungeon',
 txt:` <span style="color:#f0ece0">B2F 部屋1</span><br><br>
  南北35m東西15mの部屋。西壁南端から10mに扉がある。南壁東端にも扉がある。`,
 choices:[
  {label:'⬅ 西へ進む', go:'SHR2_R11'},
  {label:'⬇ 南へ進む', go:'SHR2_R13'},
 ],
 },

 // ── 部屋13（25m四方）──
 SHR2_R13:{
 scene:'dungeon',
 txt:` <span style="color:#f0ece0">B2F 部屋13</span><br><br>
  南北40m、東西25mの広間。北壁東端に扉がある。また西壁北端から15mのところにも扉がある。西壁の南端にはアーチが口を開けている。`,
 choices:[
  {label:'⬆ 北へ進む', go:'SHR2_R1'},
  {label:'↖ 西の扉へ進む', go:'SHR2_R8'},
  {label:'↙ 西南のアーチへ進む', go:'SHR2_C6'},
 ],
 },

 // ── 部屋8（南北15m東西35m）──
 SHR2_R8:{
 scene:'dungeon',
 txt:` <span style="color:#f0ece0">B2F 部屋8</span><br><br>
  南北15m東西35mの部屋。東壁北端に扉がある。南壁の東端から10mのところにも扉がある。`,
 choices:[
  {label:'➡ 東へ進む', go:'SHR2_R13'},
  {label:'⬇ 南へ進む', go:'SHR2_C6'},
 ],
 },

 // ── 通路6（幅15m東西50m）──
 SHR2_C6:{
 scene:'dungeon',
 txt:()=>{
  const found = PC._shr2c6Door;
  return ` <span style="color:#f0ece0">B2F 通路6</span><br><br>
   幅15m東西50mの通路。東壁北端にアーチがある。西へは暗く沈んでいて先が見通せない。<br>
   通路の途中、東端から10mの北壁に奇妙に胴の長い犬の紋章が刻まれている。${found?'仕組みはすでに解明済みだ。':''}`;
 },
 choices:()=>{
  const ch=[
   {label:'➡ 東のアーチへ進む', go:'SHR2_R13'},
   {label:'⬅ 西へ進む', go:'SHR2_C7'},
  ];
  if(PC._shr2c6Door){
   ch.push({label:' 北の隠し扉へ進む', go:'SHR2_R8'});
  } else {
   ch.push({label:' 犬の紋章を調べる（器用さ Lv2 能力値テスト）', fn:()=>dungeonTrySR({
    attr:'dex', level:2,
    successFn:()=>{ PC._shr2c6Door=true; },
    successTxt:()=>'紋章の目を押し込むと、北壁が音を立てて開いた！',
    failTxt:()=>'紋章を色々といじってみたが、何も起こらなかった。',
    choicesFn:()=>{
     const c=[
      {label:'➡ 東のアーチへ進む', go:'SHR2_R13'},
      {label:'⬅ 西へ進む', go:'SHR2_C7'},
     ];
     if(PC._shr2c6Door) c.push({label:' 北の隠し扉へ進む', go:'SHR2_R8'});
     else c.push({label:' 犬の紋章を調べる（器用さ Lv2 能力値テスト）', go:'SHR2_C6'});
     return c;
    }
   })});
  }
  return ch;
 },
 },

 // ── 通路7（幅15m東西25m）──
 SHR2_C7:{
 scene:'dungeon',
 txt:` <span style="color:#f0ece0">B2F 通路7</span><br><br>
  幅15mの大通路。東西に25m延びている。西壁南端にアーチがある。東へは暗く沈んでいて先が見通せない。`,
 choices:[
  {label:'⬅ 西のアーチへ進む', go:'SHR2_R14'},
  {label:'➡ 東へ進む', go:'SHR2_C6'},
 ],
 },

 // ── 部屋14（25m四方）──
 SHR2_R14:{
 scene:'dungeon',
 txt:()=>{
  const lever = PC._shr2LeverPulled;
  return ` <span style="color:#f0ece0">B2F 部屋14</span><br><br>
   25m四方の部屋。東壁南端にアーチがある。南壁東端には重厚な落とし格子が下りている。<br>
   ${lever?'格子は既に持ち上がっている。':'どこかでレバーを引かない限り開かないようだ。'}`;
 },
 choices:()=>{
  const ch=[{label:'➡ 東のアーチへ進む', go:'SHR2_C7'}];
  if(PC._shr2LeverPulled){
   ch.push({label:'⬇ 南の落とし格子へ進む', go:'SHR2_R16'});
  } else {
   ch.push({label:' 落とし格子を持ち上げようとする', fn:()=>showSaveToast('びくともしない。どこかで機構を作動させる必要がありそうだ。')});
  }
  return ch;
 },
 },

 // ── 部屋16（25m四方）──
 SHR2_R16:{
 scene:'dungeon',
 txt:` <span style="color:#f0ece0">B2F 部屋16</span><br><br>
  25m四方の部屋。北壁東端に落とし格子、南壁西端から5mの位置に扉がある。`,
 choices:[
  {label:'⬆ 北の落とし格子へ進む', go:'SHR2_R14'},
  {label:'⬇ 南へ進む', go:'SHR2_R4'},
 ],
 },

 // ── 部屋4（南北35m東西15m）──
 SHR2_R4:{
 scene:'dungeon',
 txt:` <span style="color:#f0ece0">B2F 部屋4</span><br><br>
  南北35m東西15mの部屋。北壁中央に扉、東壁南端から10mのところにも扉がある。`,
 choices:[
  {label:'⬆ 北へ進む', go:'SHR2_R16'},
  {label:'➡ 東へ進む', go:'SHR2_R10'},
 ],
 },

 // ── 部屋10（正六角形・1辺15m）──
 SHR2_R10:{
 scene:'dungeon',
 txt:` <span style="color:#f0ece0">B2F 部屋10</span><br><br>
  1辺15mの正六角形の部屋。西壁に扉、北壁にも扉がある。`,
 choices:[
  {label:'⬅ 西へ進む', go:'SHR2_R4'},
  {label:'⬆ 北へ進む', go:'SHR2_C8'},
 ],
 },

 // ── 通路8（東西50m）──
 SHR2_C8:{
 scene:'dungeon',
 txt:()=>{
  const base = ` <span style="color:#f0ece0">B2F 通路8</span><br><br>
   東西に50m延びる通路。西端は行き止まりで、南壁に扉がある。<br>
   東は暗く沈んでいて先が見通せない。`;
  if(!PC._shr2C8DwarfDefeated){
   return `${base}<br><br><span style="color:#f0ddd8">東の暗闇の奥から、<b>半裸のドワーフ</b>が絶叫を上げながら走ってきた！正気を失っているのか、目が虚ろだ！</span>`;
  }
  return base;
 },
 choices:()=>{
  const normalChoices = [
   {label:'⬅ 西へ進む', go:'SHR2_R10'},
   {label:'➡ 東へ進む', go:'SHR2_C9'},
  ];
  if(PC._shr2C8DwarfDefeated) return normalChoices;
  return [{label:' 戦う', fn:()=>{
   startCombatNPC({
    enemies: [generateInsaneDwarf(8)],
    win:'SHR2_C8', lose:'DEAD',
    onWin: ()=>{
     PC._shr2C8DwarfDefeated = true;
     PC.gold = (PC.gold||0) + 100;
     PC._pendingMsg = (PC._pendingMsg||'') + `<div style="color:#e8e4d8;font-size:var(--font-sm);margin-bottom:8px"> 息絶えたドワーフの腰から、100GPの入った袋を見つけた。</div>`;
    },
   });
  }}];
 },
 },

 // ── 通路9（東西35m）──
 SHR2_C9:{
 scene:'dungeon',
 txt:()=>{
  const found = PC._shr2c9Door;
  return ` <span style="color:#f0ece0">B2F 通路9</span><br><br>
   東西に35m延びる通路。西端は暗く沈んでいて先が見通せない。<br>
   東端は行き止まりで、東壁に奇妙に胴の長い犬の紋章が刻まれている。${found?'仕組みはすでに解明済みだ。':''}`;
 },
 choices:()=>{
  const ch=[{label:'⬅ 西へ進む', go:'SHR2_C8'}];
  if(PC._shr2c9Door){
   ch.push({label:'➡ 東の隠し扉へ進む', go:'SHR2_R3'});
  } else {
   ch.push({label:' 犬の紋章を調べる（器用さ Lv2 能力値テスト）', fn:()=>dungeonTrySR({
    attr:'dex', level:2,
    successFn:()=>{ PC._shr2c9Door=true; },
    successTxt:()=>'紋章の目を押し込むと、東壁の隠し扉が開いた！',
    failTxt:()=>'紋章を色々といじってみたが、何も起こらなかった。',
    choicesFn:()=>{
     const c=[{label:'⬅ 西へ進む', go:'SHR2_C8'}];
     if(PC._shr2c9Door) c.push({label:'➡ 東の隠し扉へ進む', go:'SHR2_R3'});
     else c.push({label:' 犬の紋章を調べる（器用さ Lv2 能力値テスト）', go:'SHR2_C9'});
     return c;
    }
   })});
  }
  return ch;
 },
 },

 // ── 部屋3（南北35m東西15m）──
 SHR2_R3:{
 scene:'dungeon',
 txt:` <span style="color:#f0ece0">B2F 部屋3</span><br><br>
  南北35m東西15mの部屋。西壁には2つの扉がある。ひとつは西壁北端にある扉（通路側からは隠し扉になっているようだ）、<br>
  もうひとつは南端5mのところにある扉だ。北壁の東端にも扉もある。`,
 choices:[
  {label:'⬅ 西壁北端の扉へ進む', go:'SHR2_C9'},
  {label:'⬅ 西壁南寄りの扉へ進む', go:'SHR2_R9'},
  {label:'⬆ 北の扉へ進む', go:'SHR2_R15'},
 ],
 },

 // ── 部屋9（正六角形・1辺15m）──
 SHR2_R9:{
 scene:'dungeon',
 txt:` <span style="color:#f0ece0">B2F 部屋9</span><br><br>
  1辺15mの正六角形の部屋。東壁に扉、西壁にも扉がある。<br><br>
  <span style="color:#c0b098">━ 東（→部屋3）/ 西（→通路11） ━</span>`,
 choices:[
  {label:'➡ 東へ進む', go:'SHR2_R3'},
  {label:'⬅ 西へ進む', go:'SHR2_C11'},
 ],
 },

 // ── 通路11（東西25m）──
 SHR2_C11:{
 scene:'dungeon',
 txt:` <span style="color:#f0ece0">B2F 通路11</span><br><br>
  東西に25mある通路。東端は行き止まりで東壁に扉がある。西端はT字路に続いている。`,
 choices:[
  {label:'➡ 東へ進む', go:'SHR2_R9'},
  {label:'⬅ 西へ進む', go:'SHR2_TJ1'},
 ],
 },

 // ── T字路1 ──
 SHR2_TJ1:{
 scene:'dungeon',
 txt:` <span style="color:#f0ece0">B2F T字路1</span><br><br>
  南北に伸びる通路から、東へ伸びる通路が分岐している。<br>
  北は10m先で東に折れている。南も10m先で東に折れている。`,
 choices:[
  {label:'➡ 東へ進む', go:'SHR2_C11'},
  {label:'⬆ 北へ進む', go:'SHR2_C12'},
  {label:'⬇ 南へ進む', go:'SHR2_C13'},
 ],
 },

 // ── 通路12（東西25m・偽の紋章＝転送の罠）──
 SHR2_C12:{
 scene:'dungeon',
 txt:` <span style="color:#f0ece0">B2F 通路12</span><br><br>
  東西に25m延びる通路。西端は南に折れている。<br>
  東端は行き止まりで、東壁に奇妙に胴の長い犬の紋章が刻まれている。`,
 choices:[
  {label:'⬅ 西へ進む', go:'SHR2_TJ1'},
  {label:' 犬の紋章を調べる', fn:()=>{
   const targets = ['SHR2_C2','SHR2_C3','SHR2_R11','SHR2_C5','SHR2_C4','SHR2_R7','SHR2_R2','SHR2_R12',
    'SHR2_R1','SHR2_R13','SHR2_R8','SHR2_C6','SHR2_C7','SHR2_R14','SHR2_R16','SHR2_R4','SHR2_R10',
    'SHR2_C8','SHR2_C9','SHR2_R3','SHR2_R9','SHR2_C11','SHR2_TJ1','SHR2_C13','SHR2_R15','SHR2_R6','SHR2_C10','SHR2_R5'];
   const dest = targets[Math.floor(Math.random()*targets.length)];
   showSaveToast('紋章に触れた瞬間、床が消えて体が宙に投げ出された！');
   go(dest);
  }},
 ],
 },

 // ── 通路13（東西25m・崩落した下り階段）──
 SHR2_C13:{
 scene:'dungeon',
 txt:` <span style="color:#f0ece0">B2F 通路13</span><br><br>
  東西25mの通路。西端は北に折れている。<br>
  東端は下り階段だが、天井が崩れ落ちていて使い物にならない。`,
 choices:[
  {label:'⬅ 西へ進む', go:'SHR2_TJ1'},
  {label:' 崩落した階段を調べる', fn:()=>showSaveToast('瓦礫が積み重なっていて、とても通れそうにない。')},
 ],
 },

 // ── 部屋15（25m四方）──
 SHR2_R15:{
 scene:'dungeon',
 txt:` <span style="color:#f0ece0">B2F 部屋15</span><br><br>
  25m四方の部屋。南壁中央に扉、西壁南端にも扉がある。<br>
  汚らしいボロボロのベッドが10台並び、雑多なガラクタが床のあちこちに散乱している。`,
 choices:[
  {label:'⬇ 南へ進む', go:'SHR2_R3'},
  {label:'⬅ 西へ進む', go:'SHR2_R6'},
 ],
 },

 // ── 部屋6（南北15m東西20m）──
 SHR2_R6:{
 scene:'dungeon',
 txt:()=>{
  const base = ` <span style="color:#f0ece0">B2F 部屋6</span><br><br>
   南北15m東西20mの部屋。東壁南端に扉、西壁北端にも扉がある。<br>
   壁沿いには大きなエールの樽が置かれ、その並びの棚には木のジョッキがずらりと並んでいる。`;
  if(PC._shr2R6WarriorsDefeated){
   return `${base}<br><br><span style="color:#b0a080">酒臭さの残る、静まり返った部屋だ。倒れた戦士たちが転がっている。</span>`;
  }
  if(PC._shr2R6WarriorsLeft){
   return `${base}<br><br><span style="color:#b0a080">戦士たちの姿はどこにもない。すっかり静まり返った部屋だ。</span>`;
  }
  if(PC._shr2R6ArmWrestleWon){
   // 今回はまだ戦士がいる最後の訪問。次にこのノードへ来たときから姿を消す
   PC._shr2R6WarriorsLeft = true;
   return `${base}<br><br><span style="color:#b0a080">戦士たちは机を囲んで酒を飲んでいる。西の扉は先ほどの約束通り、道を空けてくれるようだ。</span>`;
  }
  return `${base}<br><br>
   <span style="color:#f0ddd8">部屋の中にはいくつもの机が置かれ、<b>戦士が6人</b>、たまり場のように酒を酌み交わしている。</span><br>
   <span style="color:#c8b8a0">こちらに気づくと、ニヤつきながら絡んできた。「おい、西の扉を通りたきゃ、腕相撲で勝ってみせろよ」</span>`;
 },
 choices:()=>{
  const ch=[{label:'➡ 東へ進む', go:'SHR2_R15'}];
  if(PC._shr2R6WarriorsDefeated || PC._shr2R6ArmWrestleWon){
   ch.push({label:'⬅ 西へ進む', go:'SHR2_C10'});
   return ch;
  }
  ch.push({label:' 腕相撲で勝負する', fn:()=>{
   const s = document.getElementById('story');
   if(s) s.innerHTML += `<br><span style="color:#c8b8a0">戦士の一人がテーブルに肘をつき、挑発するように笑った。</span>`;
   setupSavingRoll({
    attr:'st', level:5,
    onSuccess:()=>{
     PC._shr2R6ArmWrestleWon = true;
     if(s) s.innerHTML += `<br><span style="color:#e8e4d8">戦士たちは驚いた顔をしながらも、約束通り西の扉へ道を空けてくれた。</span>`;
     renderChoices(NODES.SHR2_R6.choices());
    },
    onFail:()=>{
     if(s) s.innerHTML += `<br><span class="red">あっけなく腕を押し倒されてしまった。「残念だったな、西へは通せねぇよ」</span>`;
     renderChoices(NODES.SHR2_R6.choices());
    },
   });
  }});
  ch.push({label:' 戦う', fn:()=>{
   startCombatNPC({
    enemies: Array.from({length:6},()=>generateNPC(5)),
    win:'SHR2_R6', lose:'DEAD',
    onWin:()=>{ PC._shr2R6WarriorsDefeated = true; },
   });
  }});
  return ch;
 },
 },

 // ── 通路10（東西30m）──
 SHR2_C10:{
 scene:'dungeon',
 txt:` <span style="color:#f0ece0">B2F 通路10</span><br><br>
  東西30mの通路。東端の東壁に扉がある。西端の西壁にはアーチがある。`,
 choices:[
  {label:'➡ 東へ進む', go:'SHR2_R6'},
  {label:'⬅ 西へ進む', go:'SHR2_R5'},
 ],
 },

 // ── 部屋5（南北15m東西20m・行き止まり）──
 SHR2_R5:{
 scene:'dungeon',
 txt:` <span style="color:#f0ece0">B2F 部屋5</span><br><br>
  南北15m東西20mの部屋。東壁北端にアーチがある。<br>
  部屋の中央には、天井まで伸びる<b>ハシゴ</b>がかけられている。`,
 choices:[
  {label:'➡ 東へ進む', go:'SHR2_C10'},
  {label:'⬆ ハシゴを登る', go:'SHR1_HIDDEN_R1'},
 ],
 },

 // ── B1F 隠し小部屋（SHR2_R5のハシゴの先。まだ他のエリアとは未接続） ──
 SHR1_HIDDEN_R1:{
 scene:'dungeon',
 txt:` <span style="color:#f0ece0">B1F 隠し小部屋</span><br><br>
  5m四方の小さな部屋。南の壁に扉がある。<br>
  部屋の中央には、B2Fへ続く<b>ハシゴ</b>が下へ伸びている。`,
 choices:[
  {label:' 南の扉へ進む', go:'SHR1_HIDDEN_R2'},
  {label:'⬇ ハシゴを降りて戻る', go:'SHR2_R5'},
 ],
 },

 SHR1_HIDDEN_R2:{
 scene:'dungeon',
 txt:` <span style="color:#f0ece0">B1F 部屋</span><br><br>
  南北20m東西15mの部屋。北壁中央には、B2へのはしごがある部屋への扉がある。<br>
  南壁中央には、木製の両開きの扉がある。`,
 choices:[
  {label:'⬆ 北の扉へ戻る', go:'SHR1_HIDDEN_R1'},
  {label:' 南の両開きの扉へ進む', go:'SHR1_HIDDEN_R3'},
 ],
 },

 SHR1_HIDDEN_R3:{
 scene:'dungeon',
 txt:` <span style="color:#f0ece0">洞穴</span><br><br>
  直径10mほどの洞穴が、南東へ向かって延びている。<br>
  30mほど先に、屋外の光が差し込んでいるのが見える。`,
 choices:[
  {label:'➡ 光の方へ進む（外に出る）', fn:()=>{
   PC._shrHiddenPassageFound = true;
   go('TOWN_RIMHOLM');
  }},
  {label:'⬅ 部屋へ戻る', go:'SHR1_HIDDEN_R2'},
 ],
 },



 // ══════════════════════════════════════════
 //  マレア諸島
 // ══════════════════════════════════════════

 // ── ネリア港（大島①） ──
 TOWN_NERIA:{
  scene:'town_port',
  txt:()=>{
   const t=TOWNS.neria;
   return `<span style="color:#f0ece0;font-size:calc(var(--font-base) + 1px)"> ${t.name}</span>　<span class="dim" style="font-size:calc(var(--font-lg) + 4px)">${t.size}</span>${popTimeOfDayMsg('neria')}<br>
${popWeatherMsg('neria')}
${popDeliveryMsg()}<br>
<span style="color:#c0b098">${t.desc}</span><br>${popHeroMsg()}${popInfamyMsg()}${popRegionHeroMsg()}${popRegionInfamyMsg()}${popRegionEvalMsg()}${popRaidUnitMsg()}<br>${renderTrustBadge(PC.town)}${hasProperty(PC.town)?'　<span style="color:#f0ece0"> 拠点あり</span>':''}`;
  },
  choices:[
   {label:' 武器屋・装備屋', go:'SHOP_NERIA'},
   {label:' 酒場（砦の酒場）', go:'TAVERN_NERIA'},
   {label:' 宿屋（6GP・1日休む）', fn:()=>{ innRest(600); }, go:'TOWN_NERIA'},
   {label:' 旅に出る（移動）', go:'TRAVEL_FROM_NERIA'},
   {label:' その他の行動', fn:()=>goOtherActions('neria')},
  ]
 },
 ISLAND_ROUTE_NERIA:{
  scene:'town_port',
  txt:()=>`<span style="color:#f0ece0">ネリア港</span>　島間航路<br><br><span style="color:#c0b098">物資船に同乗して他の島へ渡る。</span>`,
  choices:()=>makeIslandRouteChoices('neria'),
 },
 TRAVEL_FROM_NERIA:{
  scene:'travel',
  txt:()=>`<span style="color:#f0ece0">ネリア砦</span>からの旅立ち<br><br><span style="color:#c0b098">どこへ向かいますか？</span>`,
  choices:()=>[...makeTravelChoices('neria').filter(c=>c.label!=='← 戻る'), ...makeIslandRouteChoices('neria').filter(c=>c.label!=='← 戻る'), {label:'← 戻る', go:'TOWN_NERIA'}],
 },
 SHOP_NERIA:{
  scene:'town_port',
  txt:()=>` <span style="color:#f0ece0">ネリアの武器屋</span><br><br>
<span style="color:#c0b098">わずかな在庫が棚に並ぶ。品数は少ないが、ここ以外で買える場所はない。</span>`,
  choices:[
   {label:' 買い物をする', fn:()=>showIngameShop('neria'), go:'__travel__'},
   {label:'← 戻る', go:'TOWN_NERIA'},
  ],
 },
 TAVERN_NERIA:{
  scene:'town_port',
  txt:()=>{
   const board=getTavernBoard('neria');
 const _hqOffer = checkHeroQuest('neria');
 const _hqHtml = renderHeroQuestOffer('neria', _hqOffer);
 const _smHtml = checkSpecialMissionMareaBoard();
   const html=renderQuestBoard('neria',board);
   const partyHtml=renderPartyStatus();
   return ` <span style="color:#f0ece0">砦の酒場</span><br><br><span style="color:#c0b098">薄暗い酒場に、数少ない住人と旅人が黙って酒を飲んでいる。賑やかとは言い難い。</span><br><br>${_tavernFlavorHtml}${partyHtml}${_smHtml}${_hqHtml}${html}`;
  },
  choices:()=>[...getQuestBoardChoices('TOWN_NERIA'), {label:' 客に話しかける', fn:()=>talkToPatron('neria')}, ...fcTavernAskChoices('neria'), {label:' 仲間を探す', go:'RECRUIT_NERIA'}],
 },

 // ── ドルアの村（大島②） ──
 TOWN_DORUA:{
  scene:'town_village',
  txt:()=>{
   const t=TOWNS.dorua;
   return `<span style="color:#f0ece0;font-size:calc(var(--font-base) + 1px)"> ${t.name}</span>　<span class="dim" style="font-size:calc(var(--font-lg) + 4px)">${t.size}</span>${popTimeOfDayMsg('dorua')}<br>
${popWeatherMsg('dorua')}
${popDeliveryMsg()}<br>
<span style="color:#c0b098">${t.desc}</span><br>${popHeroMsg()}${popInfamyMsg()}${popRegionHeroMsg()}${popRegionInfamyMsg()}${popRegionEvalMsg()}${popRaidUnitMsg()}<br>${renderTrustBadge(PC.town)}${hasProperty(PC.town)?'　<span style="color:#f0ece0"> 拠点あり</span>':''}`;
  },
  choices:[
   {label:' 道具屋', go:'SHOP_DORUA'},
   {label:' 酒場', go:'TAVERN_DORUA'},
   {label:' 宿屋（4GP・1日休む）', fn:()=>{ innRest(400); }, go:'TOWN_DORUA'},
   {label:' 旅に出る（移動）', go:'TRAVEL_FROM_DORUA'},
   {label:' その他の行動', fn:()=>goOtherActions('dorua')},
  ]
 },
 TRAVEL_FROM_DORUA:{
  scene:'travel',
  txt:()=>`<span style="color:#f0ece0">ドルアの村</span>からの旅立ち<br><br><span style="color:#c0b098">どこへ向かいますか？</span>`,
  choices:()=>[
   ...makeIslandRouteChoices('dorua').filter(c=>c.label!=='← 戻る'),
   {label:' カルヴォ砦へ（奥地の最前線・徒歩15日）', fn:()=>travelTo('kalvo','walk'), go:'__travel__'},
   {label:'← 戻る', go:'TOWN_DORUA'},
  ],
 },
 TRAVEL_FROM_SARPE:{
  scene:'travel',
  txt:()=>`<span style="color:#f0ece0">サルペ</span>からの旅立ち<br><br><span style="color:#c0b098">どこへ向かいますか？</span>`,
  choices:()=>makeIslandRouteChoices('sarpe'),
 },
 TRAVEL_FROM_NEBRA:{
  scene:'travel',
  txt:()=>`<span style="color:#e0d8c8">ネブラ</span>からの旅立ち<br><br><span style="color:#c0b098">霧の晴れ間に船が出る。</span>`,
  choices:()=>makeIslandRouteChoices('nebra'),
 },

 ISLAND_ROUTE_DORUA:{
  scene:'town_village',
  txt:()=>`<span style="color:#f0ece0">ドルアの村</span>　島間航路<br><br><span style="color:#c0b098">物資船に同乗して他の島へ渡る。</span>`,
  choices:()=>makeIslandRouteChoices('dorua'),
 },
 SHOP_DORUA:{
  scene:'town_village',
  txt:()=>` <span style="color:#f0ece0">ドルアの道具屋</span><br><br>
<span style="color:#c0b098">農具や漁具が中心だが、旅に必要な基本的な品は一通り揃っている。</span>`,
  choices:[
   {label:' 買い物をする', fn:()=>showIngameShop('dorua'), go:'__travel__'},
   {label:'← 戻る', go:'TOWN_DORUA'},
  ],
 },
 TAVERN_DORUA:{
  scene:'town_village',
  txt:()=>{
   const board=getTavernBoard('dorua');
 const _hqOffer = checkHeroQuest('dorua');
 const _hqHtml = renderHeroQuestOffer('dorua', _hqOffer);
   const html=renderQuestBoard('dorua',board);
   const partyHtml=renderPartyStatus();
   return ` <span style="color:#f0ece0">ドルアの酒場</span><br><br><span style="color:#c0b098">農漁民が夕暮れ後に集まる静かな酒場。島の古い言い伝えを話してくれる老人がいる。</span><br><br>${_tavernFlavorHtml}${partyHtml}${_hqHtml}${html}`;
  },
  choices:()=>[...getQuestBoardChoices('TOWN_DORUA'), {label:' 客に話しかける', fn:()=>talkToPatron('dorua')}, ...fcTavernAskChoices('dorua'), {label:' 仲間を探す', go:'RECRUIT_DORUA'}],
 },

 // ── サルペ（小島①） ──
 TOWN_SARPE:{
  scene:'town_village',
  txt:()=>{
   const t=TOWNS.sarpe;
   return `<span style="color:#f0ece0;font-size:calc(var(--font-base) + 1px)"> ${t.name}</span>　<span class="dim" style="font-size:calc(var(--font-lg) + 4px)">${t.size}</span>${popTimeOfDayMsg('sarpe')}<br>
${popWeatherMsg('sarpe')}
${popDeliveryMsg()}<br>
<span style="color:#c0b098">${t.desc}</span><br>${popHeroMsg()}${popInfamyMsg()}${popRegionHeroMsg()}${popRegionInfamyMsg()}${popRegionEvalMsg()}${popRaidUnitMsg()}<br>${renderTrustBadge(PC.town)}${hasProperty(PC.town)?'　<span style="color:#f0ece0"> 拠点あり</span>':''}`;
  },
  choices:[
   {label:' 酒場兼宿屋', go:'TAVERN_SARPE'},
   {label:' 旅に出る（移動）', go:'TRAVEL_FROM_SARPE'},
   {label:' その他の行動', fn:()=>goOtherActions('sarpe')},
  ]
 },
 ISLAND_ROUTE_SARPE:{
  scene:'town_village',
  txt:()=>`<span style="color:#f0ece0">サルペ</span>　島間航路<br><br><span style="color:#c0b098">物資船に同乗して他の島へ渡る。</span>`,
  choices:()=>makeIslandRouteChoices('sarpe'),
 },
 TAVERN_SARPE:{
  scene:'town_village',
  txt:()=>{
   const board=getTavernBoard('sarpe');
 const _hqOffer = checkHeroQuest('sarpe');
 const _hqHtml = renderHeroQuestOffer('sarpe', _hqOffer);
   const html=renderQuestBoard('sarpe',board);
   const partyHtml=renderPartyStatus();
   return ` <span style="color:#f0ece0">サルペの漁師宿</span><br><br><span style="color:#c0b098">酒場と宿屋を兼ねた素朴な建物。塩辛い魚料理と地酒が出る。石碑の話を聞けることもある。</span><br><br>${_tavernFlavorHtml}${partyHtml}${_hqHtml}${html}`;
  },
  choices:()=>[
   {label:' 宿に泊まる（3GP・1日休む）', fn:()=>{ innRest(300); }, go:'TOWN_SARPE'},
   ...getQuestBoardChoices('TOWN_SARPE'),
   {label:' 客に話しかける', fn:()=>talkToPatron('sarpe')}, ...fcTavernAskChoices('sarpe'),
  ],
 },

 // ── ネブラ（小島②・霧の島） ──
 TOWN_NEBRA:{
  scene:'town_village',
  txt:()=>{
   const t=TOWNS.nebra;
   return `<span style="color:#e0d8c8;font-size:calc(var(--font-base) + 1px)"> ${t.name}</span>　<span class="dim" style="font-size:calc(var(--font-lg) + 4px)">${t.size}</span>${popTimeOfDayMsg('nebra')}<br>
${popWeatherMsg('nebra')}
${popDeliveryMsg()}<br>
<span style="color:#c0b098">${t.desc}</span><br>${popHeroMsg()}${popInfamyMsg()}${popRegionHeroMsg()}${popRegionInfamyMsg()}${popRegionEvalMsg()}${popRaidUnitMsg()}<br>${renderTrustBadge(PC.town)}${hasProperty(PC.town)?'　<span style="color:#f0ece0"> 拠点あり</span>':''}`;
  },
  choices:[
   {label:' 民宿（酒場兼）', go:'TAVERN_NEBRA'},
   {label:' 旅に出る（移動）', go:'TRAVEL_FROM_NEBRA'},
   {label:' その他の行動', fn:()=>goOtherActions('nebra')},
  ]
 },
 ISLAND_ROUTE_NEBRA:{
  scene:'town_village',
  txt:()=>`<span style="color:#e0d8c8">ネブラ</span>　島間航路<br><br><span style="color:#c0b098">霧の晴れ間を縫って物資船が出る。</span>`,
  choices:()=>makeIslandRouteChoices('nebra'),
 },
 TAVERN_NEBRA:{
  scene:'town_village',
  txt:()=>{
   const board=getTavernBoard('nebra');
 const _hqOffer = checkHeroQuest('nebra');
 const _hqHtml = renderHeroQuestOffer('nebra', _hqOffer);
   const html=renderQuestBoard('nebra',board);
   const partyHtml=renderPartyStatus();
   return ` <span style="color:#e0d8c8">ネブラの民宿</span><br><br><span style="color:#c0b098">霧の中にぼんやり灯りが見える小さな宿。薄暗い室内で島民が静かに酒を飲んでいる。灯台の話を聞けるかもしれない。</span><br><br>${_tavernFlavorHtml}${partyHtml}${_hqHtml}${html}`;
  },
  choices:()=>[
   {label:' 宿に泊まる（3GP・1日休む）', fn:()=>{ innRest(300); }, go:'TOWN_NEBRA'},
   ...getQuestBoardChoices('TOWN_NEBRA'),
   {label:' 客に話しかける', fn:()=>talkToPatron('nebra')}, ...fcTavernAskChoices('nebra'),
  ],
 },

 // ── カルヴォ砦（ドルアの先、マレアの奥地・境界の最前線） ──
 TOWN_KALVO:{
  scene:'town_stone',
  txt:()=>{
   const t=TOWNS.kalvo;
   const gaugeHtml = renderBorderFortGaugeBar();
   return `<span style="color:#e8d0c0;font-size:calc(var(--font-base) + 1px)"> ${t.name}</span>　<span class="dim" style="font-size:calc(var(--font-lg) + 4px)">${t.size}</span>${popTimeOfDayMsg()}<br><br>
<span style="color:#c0b098">${t.desc}</span><br><br>
${gaugeHtml}${popDeliveryMsg()}${popHeroMsg()}${popInfamyMsg()}${popRegionHeroMsg()}${popRegionInfamyMsg()}${popRegionEvalMsg()}${popRaidUnitMsg()}<br>${renderTrustBadge(PC.town)}`;
  },
  choices:[
   {label:' 武具庫', go:'SHOP_KALVO'},
   {label:' 酒場', go:'TAVERN_KALVO'},
   {label:' 野営して休む（1日）', fn:()=>{ innRest(0); }, go:'TOWN_KALVO'},
   {label:' 旅に出る（移動）', go:'TRAVEL_FROM_KALVO'},
   {label:' その他の行動', fn:()=>goOtherActions('kalvo')},
  ]
 },
 KALVO_SORTIE_RETREAT:{
  scene:'town_stone',
  txt:()=>`<span style="color:#c8b8a0"> 部隊を退かせた。今回の出撃に戦果はなし——だが、被害を抑えて生きて戻れたことをよしとしよう。</span><br><br><span style="color:#a89880;font-size:calc(var(--font-sm) - 2px)">（防衛度は変化なし）</span>`,
  choices:[
   {label:'▶ 砦へ戻る', go:'TOWN_KALVO'},
  ],
 },
 TRAVEL_FROM_KALVO:{
  scene:'travel',
  txt:()=>`<span style="color:#e8d0c0">カルヴォ砦</span>からの旅立ち<br><br><span style="color:#c0b098">奥地からここまで来た道を、ドルアへ引き返すしかない。</span>`,
  choices:()=>[
   {label:' ドルアの村へ 徒歩（15日）', fn:()=>travelTo('dorua','walk'), go:'__travel__'},
   {label:'← 戻る', go:'TOWN_KALVO'},
  ],
 },
 SHOP_KALVO:{
  scene:'town_stone',
  txt:()=>` <span style="color:#e8d0c0">カルヴォ砦の武具庫</span><br><br>
<span style="color:#c0b098">実用一辺倒の武具が並ぶ。鹵獲品も混じっているという噂だ。</span>`,
  choices:[
   {label:' 買い物をする', fn:()=>showIngameShop('kalvo'), go:'__travel__'},
   {label:'← 戻る', go:'TOWN_KALVO'},
  ],
 },
 TAVERN_KALVO:{
  scene:'town_stone',
  txt:()=>{
   const board=getTavernBoard('kalvo');
   const _hqOffer = checkHeroQuest('kalvo');
   const _hqHtml = renderHeroQuestOffer('kalvo', _hqOffer);
   const html=renderQuestBoard('kalvo',board);
   const partyHtml=renderPartyStatus();
   const sortieHtml = canBorderFortSortie()
    ? `<div style="border:1px solid #a04030;border-radius:4px;padding:10px;margin:8px 0;background:#1a0a06">
        <div style="color:#e8d0c0;font-size:calc(var(--font-sm) - 1px);margin-bottom:4px"> 出撃部隊、募集中</div>
        <div style="color:#c0b098;font-size:calc(var(--font-sm) - 2px)">奥地の混沌の軍勢へ、自ら打って出る部隊を募っている。</div>
       </div>`
    : `<div style="color:#a89880;font-size:calc(var(--font-sm) - 2px);margin:8px 0">（出撃部隊は先ごろ編成したばかりだ。しばらく休ませる必要がある）</div>`;
   return ` <span style="color:#e8d0c0">砦の酒場</span><br><br><span style="color:#c0b098">殺気立った空気の中、束の間の休息を取る駐留兵たちがいる。賑やかとは程遠い。</span><br><br>${_tavernFlavorHtml}${partyHtml}${_hqHtml}${sortieHtml}${html}`;
  },
  choices:()=>[
   ...(canBorderFortSortie() ? [{label:' 出撃部隊に加わる', fn:()=>startBorderFortSortie()}] : []),
   ...getQuestBoardChoices('TOWN_KALVO'),
   {label:' 客に話しかける', fn:()=>talkToPatron('kalvo')}, ...fcTavernAskChoices('kalvo'),
   {label:' 仲間を探す', go:'RECRUIT_KALVO'},
  ],
 },



 // ══════════════════════════════════════════════════════
 // ザールカノンの墓所 B2F
 // ══════════════════════════════════════════════════════

 // ── B1F階段〜通路1 ──
 SHM2_STAIRS:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">ザールカノンの墓所 B2F — 石段の踊り場</span><br><br>
  急な石段を降りた踊り場だ。B1Fよりも壁の石組みが古く、装飾のない素朴な造りになっている。<br>
  冷たく澱んだ空気が西の通路から流れてくる。<br><br>
  <span style="color:#c0b098">━ 東（B1F）/ 西へ続く ━</span>`,
 choices:[
  {label:'↑ 上層へ', go:'RUIN_F_SOUTH_ROOM'},
  {label:'← 西へ', fn:()=>shm2Move('SHM2_PASSAGE1_A')},
 ],
 },

 // 通路1 ─ 西15m→南折れ
 SHM2_PASSAGE1_A:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">ザールカノンの墓所 B2F</span><br><br>
  石段から西へ15m、石造りの通路が続く。<br>
  壁面には精緻な装飾の痕跡があるが、長い年月で剥落している。<br>
  足元の石畳は磨り減っており、かつて多くの者がここを通った証だ。<br>
  通路は南へ折れている。<br><br>
  <span style="color:#c0b098">━ 東（階段）/ 南へ続く ━</span>`,
 choices:[
  {label:'→ 東へ', fn:()=>shm2Move('SHM2_STAIRS')},
  {label:'↓ 南へ', fn:()=>shm2Move('SHM2_PASSAGE1_B')},
 ],
 },

 // 通路1 ─ 南25m→東折れ
 SHM2_PASSAGE1_B:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">ザールカノンの墓所 B2F</span><br><br>
  南へ25m続く石造りの廊下。天井から地下水が染み出し、床に薄く広がっている。<br>
  壁には規則的に燭台の跡があり、かつては明かりが灯っていたと分かる。<br>
  通路は東へ折れている。<br><br>
  <span style="color:#c0b098">━ 北（西通路）/ 東へ続く ━</span>`,
 choices:[
  {label:'↑ 北へ', fn:()=>shm2Move('SHM2_PASSAGE1_A')},
  {label:'→ 東へ', fn:()=>shm2Move('SHM2_PASSAGE1_C')},
 ],
 },

 // 通路1 ─ 東25m→北折れ（感圧板の罠）
 SHM2_PASSAGE1_C:{
 scene:'dungeon',
 txt:()=>{
  const done = PC._shm2_axe_done;
  if(done){
   return `<span style="color:#f0ece0">ザールカノンの墓所 B2F</span><br><br>
    東へ25m続く通路。北へ折れる角の壁に、深い切り込みが残っている。<br>
    何かが激しく壁に当たった跡だ。`;
  }
  return `<span style="color:#f0ece0">ザールカノンの墓所 B2F</span><br><br>
   東へ25m続く通路の先で、通路が北に折れようとしている。<br>
   通路の突き当たり、北へ折れる手前の石畳が続いている。`;
 },
 choices:()=>{
  const ch = [];
  if(PC.con <= 0){ return [{label:'…（力尽きた）', go:'DEAD'}]; }
  if(!PC._shm2_axe_done){
   ch.push({label:'↑ 北へ', fn:()=>{
    PC._shm2_axe_done = true;
    const s = document.getElementById('story');
    s.innerHTML = `<span style="color:#f0ece0">ザールカノンの墓所 B2F</span><br><br>
     北へ踏み込もうとしている——`;
    document.getElementById('dice-area').classList.remove('hidden');
    setupSavingRoll({
     attr:'dex', level:2, label:'罠への反応',
     onSuccess(){
      document.getElementById('dice-area').classList.add('hidden');
      s.innerHTML = `<span style="color:#f0ece0">ザールカノンの墓所 B2F</span><br><br>
       北へ踏み込もうとした瞬間、足元の床がわずかに沈み込む感覚があった。<br>
       反射的に身を屈めると——壁から巨大な斧が水平に飛び出し、頭上を切り裂いて止まった。<br>
       <span style="color:#e8e4d8"> 間一髪でかわした。</span>`;
      renderChoices([{label:'↑ 北へ', fn:()=>shm2Move('SHM2_ROOM1')}]);
      scrollToTop();
     },
     onFail(){
      document.getElementById('dice-area').classList.add('hidden');
      const dmg = rollNd6(6).total;
      PC.con = Math.max(0, PC.con - dmg); updateHUD();
      if(PC.con <= 0){
       s.innerHTML = `<span class="red"> 北へ踏み出した瞬間、壁から巨大な斧が飛び出し、直撃した。体力-${dmg} → 死亡</span>`;
       renderChoices([{label:'…（力尽きた）', go:'DEAD'}]);
      } else {
       s.innerHTML = `<span style="color:#f0ece0">ザールカノンの墓所 B2F</span><br><br>
        北へ踏み込んだ瞬間、壁から巨大な斧が飛び出した。<br>
        <span class="red"> かわしきれず、脇腹に直撃を受けた。体力-${dmg}（残り${PC.con}）</span>`;
       renderChoices([{label:'↑ 北へ', fn:()=>shm2Move('SHM2_ROOM1')}]);
      }
      scrollToTop();
     },
    });
   }});
  } else {
   ch.push({label:'↑ 北へ', fn:()=>shm2Move('SHM2_ROOM1')});
  }
  ch.push({label:'← 西へ', fn:()=>shm2Move('SHM2_PASSAGE1_B')});
  return ch;
 },
 },

 // ── 部屋1（東西15m・南北25m）──
 SHM2_ROOM1:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">ザールカノンの墓所 B2F</span><br><br>
  東西15m、南北25mの石室。壁は荒削りだが天井は比較的高い。<br>
  室内には崩れた石造りの棚と、砕けた祭具の残骸が散乱している。<br>
  北の重厚な石扉には頑丈な閂がかかっており、${PC._shm2_winch_done ? '閂が外れ、開いている。' : '閂がかかって開かない。'}<br>
  <span style="color:#c0b098">━ 南 / 東の扉 / 北の扉（施錠中）━</span>`,
 choices:()=>{
  const ch = [];
  if(PC._shm2_winch_done){
   ch.push({label:'↑ 北へ', fn:()=>shm2Move('SHM2_ROOM4')});
  } else {
   ch.push({label:'↑ 北の扉', fn:()=>showSaveToast('閂がかかっている。どこかに開ける手段があるはずだ')});
  }
  ch.push({label:'↓ 南へ', fn:()=>shm2Move('SHM2_PASSAGE1_C')});
  ch.push({label:'→ 東へ', fn:()=>shm2Move('SHM2_ROOM3')});
  return ch;
 },
 },

 // ── 部屋3（東西25m・南北15m）──
 SHM2_ROOM3:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">ザールカノンの墓所 B2F</span><br><br>
  東西25m、南北15mの石室。壁面に精巧な浮き彫りが残っており、行列の場面が描かれている。<br>
  床の中央に低い石の台座がある。かつて何かが安置されていたと思われるが、今は空だ。<br><br>
  <span style="color:#c0b098">━ 西 / 南 / 北 ━</span>`,
 choices:[
  {label:'← 西へ', fn:()=>shm2Move('SHM2_ROOM1')},
  {label:'↓ 南へ', fn:()=>shm2Move('SHM2_PASSAGE2_A')},
  {label:'↑ 北へ', fn:()=>shm2Move('SHM2_ROOM5')},
 ],
 },

 // ── 通路2 ─ 部屋3南→東25m→T字路 ──
 SHM2_PASSAGE2_A:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">ザールカノンの墓所 B2F</span><br><br>
  石室の南扉を出ると、通路が東へ25m続く。<br>
  天井が低く、古い支柱の跡が一定間隔で残っている。<br>
  突き当たりでT字路になっており、南北に分かれている。<br><br>
  <span style="color:#c0b098">━ 西の扉 / 南へ続く / 北へ続く ━</span>`,
 choices:[
  {label:'← 西へ', fn:()=>shm2Move('SHM2_ROOM3')},
  {label:'↓ 南へ', fn:()=>shm2Move('SHM2_PASSAGE2_S')},
  {label:'↑ 北へ', fn:()=>shm2Move('SHM2_PASSAGE2_N')},
 ],
 },

 // 通路2 ─ 南20m→東折れ→25m→行き止まり（部屋6への扉）
 SHM2_PASSAGE2_S:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">ザールカノンの墓所 B2F</span><br><br>
  T字路から南へ20m進み、さらに東へ折れて25m続く石造りの通路だ。<br>
  最奥は行き止まりになっており、北側の壁に扉がある。<br>
<br>
  <span style="color:#c0b098">━ 北（T字路）/ 北の扉 ━</span>`,
 choices:[
  {label:'↑ 北の扉へ', fn:()=>shm2Move('SHM2_ROOM6')},
  {label:'← 西へ', fn:()=>shm2Move('SHM2_PASSAGE2_A')},
 ],
 },

 // 通路2 ─ 北30m行き止まり（部屋5への扉）
 SHM2_PASSAGE2_N:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">ザールカノンの墓所 B2F</span><br><br>
  T字路から北へ30m続く通路。最奥は行き止まりで、西側の壁に扉がある。<br>
<br>
  <span style="color:#c0b098">━ 南（T字路）/ 西の扉 ━</span>`,
 choices:[
  {label:'← 西の扉へ', fn:()=>shm2Move('SHM2_ROOM5')},
  {label:'↓ 南へ', fn:()=>shm2Move('SHM2_PASSAGE2_A')},
 ],
 },

 // ── 部屋5（東西25m・南北35m）──
 SHM2_ROOM5:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">ザールカノンの墓所 B2F</span><br><br>
  東西25m、南北35mの広大な石室。天井が高く、声が反響する。<br>
  中央に大型の石造りの祭壇の基部が残っており、かつては儀式に使われていたと思われる。<br>
  各方向に扉や通路が続いており、このフロアの要衝だ。<br><br>
  <span style="color:#c0b098">━ 西 / 南 / 南東の扉 / 北東の扉 ━</span>`,
 choices:[
  {label:'← 西へ', fn:()=>shm2Move('SHM2_ROOM4')},
  {label:'↓ 南へ', fn:()=>shm2Move('SHM2_ROOM3')},
  {label:'↘ 南東の扉へ', fn:()=>shm2Move('SHM2_PASSAGE2_N')},
  {label:'↗ 北東の扉へ', fn:()=>shm2Move('SHM2_PASSAGE4_A')},
 ],
 },

 // ── 通路4 ─ 部屋5北東→東25m→北折れ→北15m行き止まり（部屋2の扉）──
 SHM2_PASSAGE4_A:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">ザールカノンの墓所 B2F</span><br><br>
  石室の北東の扉を出ると、通路が東へ25m続く。<br>
  壁に黒い煤の跡が残っており、かつてここで火事があったことを示している。<br>
  通路は北へ折れている。<br><br>
  <span style="color:#c0b098">━ 西 / 北へ続く ━</span>`,
 choices:[
  {label:'← 西へ', fn:()=>shm2Move('SHM2_ROOM5')},
  {label:'↑ 北へ', fn:()=>shm2Move('SHM2_PASSAGE4_B')},
 ],
 },

 SHM2_PASSAGE4_B:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">ザールカノンの墓所 B2F</span><br><br>
  北へ15m続く短い通路。行き止まりになっており、西側の壁に扉がある。<br>
<br>
  <span style="color:#c0b098">━ 南 / 西の扉 ━</span>`,
 choices:[
  {label:'← 西の扉へ', fn:()=>shm2Move('SHM2_ROOM2')},
  {label:'↓ 南へ', fn:()=>shm2Move('SHM2_PASSAGE4_A')},
 ],
 },

 // ── 部屋2（15m四方）──
 SHM2_ROOM2:{
 scene:'dungeon',
 txt:()=>{
  const w = PC._shm2_winch_count || 0;
  const done = PC._shm2_winch_done;
  return `<span style="color:#f0ece0">ザールカノンの墓所 B2F</span><br><br>
   15m四方の石室。中央に巨大な巻き上げ機が鎮座している。<br>
   錆びた鉄製のドラムに太い鎖が巻かれており、どこかへ繋がっている。<br>
   ${done
    ? '<span style="color:#e8e4d8"> 巻き上げ機は限界まで巻かれている。</span>'
    : `回し続けると鎖がきつく張っていく。途中で力が尽きると鎖が戻ってしまいそうだ。<br>
     <span style="color:#e8e0d0"> 進捗: ${w}/3</span>`}
   <br><br>
   <span style="color:#c0b098">━ 南の扉 ━</span>`;
 },
 choices:()=>{
  const ch = [];
  if(!PC._shm2_winch_done){
   ch.push({label:` 巻き上げ機を回す（強さ Lv2 能力値テスト）`, fn:()=>{
    const s = document.getElementById('story');
    s.innerHTML = `<span style="color:#f0ece0">ザールカノンの墓所 B2F</span><br><br>
     巻き上げ機に全力をかける——`;
    document.getElementById('dice-area').classList.remove('hidden');
    setupSavingRoll({
     attr:'st', level:2, label:'巻き上げ機',
     onSuccess(){
      document.getElementById('dice-area').classList.add('hidden');
      PC._shm2_winch_count = (PC._shm2_winch_count||0) + 1;
      if(PC._shm2_winch_count >= 3){
       PC._shm2_winch_done = true;
       s.innerHTML = `<span style="color:#f0ece0">ザールカノンの墓所 B2F</span><br><br>
        全体重をかけて巻き続けると、ついに鎖がピンと張った。遠くの石の向こうで、ズシンという重い音が響いた。`;
      } else {
       s.innerHTML = `<span style="color:#f0ece0">ザールカノンの墓所 B2F</span><br><br>
        腕が震えながらも巻き続けた。鎖がまた少し巻き取られた。<br>
        <span style="color:#e8e4d8"> 進捗: ${PC._shm2_winch_count}/3</span>`;
      }
      renderChoices([{label:'▶ OK', fn:()=>shm2Move('SHM2_ROOM2')}]);
      scrollToTop();
     },
     onFail(){
      document.getElementById('dice-area').classList.add('hidden');
      PC._shm2_winch_count = 0;
      s.innerHTML = `<span style="color:#f0ece0">ザールカノンの墓所 B2F</span><br><br>
       重さに負けて手が滑り、鎖が逆戻りしてしまった。騒音を聞きつけたのか、暗闇から何かが近づいてくる気配がする……<br>
       <span class="red"> 進捗リセット</span>`;
      renderChoices([{label:' ワンダリングモンスターと戦う', fn:()=>{
       const m = HUNT_MONSTER_TABLE.khazan_region[Math.floor(Math.random()*HUNT_MONSTER_TABLE.khazan_region.length)];
       const mr = Math.round(m.mr * 1.5);
       drawScene('combat');
       startCombat({name:m.name, mr, armor:Math.floor(mr/30), canFlee:true, win:'__noop__', lose:'DEAD',
        onWin:()=>{ document.getElementById('cbt-area').classList.add('hidden'); document.getElementById('scroll-area').classList.remove('in-combat'); cbtState=null; go('SHM2_ROOM2'); }
       });
      }}]);
      scrollToTop();
     },
    });
   }});
  }
  ch.push({label:'↓ 南へ', fn:()=>shm2Move('SHM2_PASSAGE4_B')});
  return ch;
 },
 },

 // ── 部屋4（東西25m・南北35m）──
 SHM2_ROOM4:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">ザールカノンの墓所 B2F</span><br><br>
  東西25m、南北35mの石室。壁の一面に古代文字と方位を示す図が彫り込まれており、この層の構造が記録されている。<br>
  南の重厚な石扉は${PC._shm2_winch_done ? '<span style="color:#e8e4d8">閂が外れ、開いている。</span>' : '重厚な閂がかかって開かない。'}<br>
  西の扉の先には通路がある。<br><br>
  <span style="color:#c0b098">━ 南の扉（施錠中）/ 東の扉 / 西の扉 ━</span>`,
 choices:()=>{
  const ch = [];
  if(PC._shm2_winch_done){
   ch.push({label:'↓ 南へ', fn:()=>shm2Move('SHM2_ROOM1')});
  } else {
   ch.push({label:'⬇ 南の扉（閂がかかって開かない）', fn:()=>showSaveToast('閂がかかっている。どこかに開ける手段があるはずだ')});
  }
  ch.push({label:'→ 東へ', fn:()=>shm2Move('SHM2_ROOM5')});
  ch.push({label:'← 西へ', fn:()=>shm2Move('SHM2_PASSAGE3')});
  return ch;
 },
 },

 // ── 通路3 ─ 部屋4西→北25m→B3F階段 ──
 SHM2_PASSAGE3:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">ザールカノンの墓所 B2F</span><br><br>
  西の扉を開けると、通路が北へ25m続く。<br>
  通路の終端に下り階段がある。地下3Fへ続く急な石段で、下から冷たい風が吹き上がってくる。<br>
  まだ先は調査されていない……<br><br>
  <span style="color:#c0b098">━ 南 / 北（B3F・未踏）━</span>`,
 choices:[
  {label:'↓ 下層へ', fn:()=>{ _consumeDungeonTorch(); if(!shm2CheckEncounter('SHM3_STAIRS')) go('SHM3_STAIRS'); }},
  {label:'→ 東へ', fn:()=>shm2Move('SHM2_ROOM4')},
 ],
 },

 // ── 部屋6（15m四方）──
 SHM2_ROOM6:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">ザールカノンの墓所 B2F</span><br><br>
  15m四方の石室。かつて副葬品が収められていた部屋と思われ、台座の跡が規則正しく並んでいるが今は空だ。<br>
  南の扉は通路2（南ルート）へ続く。<br>
  東の扉は頑丈な鉄扉で、鍵穴がなく閂式になっている。ダンジョンの外に通じているようだ。<br><br>
  <span style="color:#c0b098">━ 南の扉 / 東（外への出口）━</span>`,
 choices:[
  {label:' 東の出口からダンジョンを出る', fn:()=>{ showSaveToast('ザールカノンの墓所B2Fを脱出した'); }, go:'TOWN_STONEHIEM'},
  {label:'↓ 南の扉へ', fn:()=>shm2Move('SHM2_PASSAGE2_S')},
 ],
 },


 // ══════════════════════════════════════════════════════
 // ザールカノンの墓所 B3F
 // ══════════════════════════════════════════════════════

 SHM3_STAIRS:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">ザールカノンの墓所 B3F</span><br><br>
  急な石段を降りた踊り場だ。B2Fよりさらに壁の石組みが古く、彫り込まれた文様が密になっている。<br>
  空気はひどく冷たく、息が白くなる。かすかに香炉の残り香のようなものが漂っている。<br><br>
  <span style="color:#c0b098">━ ↑ 上層へ / ← 西へ続く ━</span>`,
 choices:[
  {label:'↑ 上層へ', go:'SHM2_PASSAGE3'},
  {label:'← 西へ', fn:()=>shm3Move('SHM3_PASSAGE1_A')},
 ],
 },

 // 通路1 ─ 西15m→南折れ
 SHM3_PASSAGE1_A:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">ザールカノンの墓所 B3F</span><br><br>
  石段から西へ15m、装飾が施された石造りの通路が続く。壁面に連続した浮き彫りがあり、葬列の場面が描かれている。<br>
  通路は南へ折れている。`,
 choices:[
  {label:'→ 東へ', fn:()=>shm3Move('SHM3_STAIRS')},
  {label:'↓ 南へ', fn:()=>shm3Move('SHM3_PASSAGE1_B')},
 ],
 },

 // 通路1 ─ 南15m→行き止まり（南・東に扉）
 SHM3_PASSAGE1_B:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">ザールカノンの墓所 B3F</span><br><br>
  南へ15m続く通路。行き止まりの壁の前に立つと、南と東に扉がある。<br>
  南の扉の前には灯明台の残骸が倒れており、東の扉の縁には古い血痕が残っている。`,
 choices:[
  {label:'↑ 北へ', fn:()=>shm3Move('SHM3_PASSAGE1_A')},
  {label:'↓ 南の扉へ', fn:()=>shm3Move('SHM3_ROOM6')},
  {label:'→ 東の扉へ', fn:()=>shm3Move('SHM3_ROOM2')},
 ],
 },

 // 部屋2（15m四方）
 SHM3_ROOM2:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">ザールカノンの墓所 B3F</span><br><br>
  15m四方の石室。中央に低い石の台があり、台の上に陶器の破片が散乱している。<br>
  壁の一面が他より新しい石積みで塞がれている。かつてはここに通路があったのかもしれない。`,
 choices:[
  {label:'← 西の扉へ', fn:()=>shm3Move('SHM3_PASSAGE1_B')},
 ],
 },

 // 部屋6（25m四方）
 SHM3_ROOM6:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">ザールカノンの墓所 B3F</span><br><br>
  25m四方の石室。天井が高く、四隅に柱が立っている。柱の表面に古代文字が刻まれており、繰り返される文様は呪文か戒律のようだ。<br>
  北西と南西の壁にそれぞれ扉がある。`,
 choices:[
  {label:'↑ 北の扉へ', fn:()=>shm3Move('SHM3_PASSAGE1_B')},
  {label:'↖ 北西の扉へ', fn:()=>shm3Move('SHM3_PASSAGE2_A')},
  {label:'↙ 南西の扉へ', fn:()=>shm3Move('SHM3_PASSAGE3')},
 ],
 },

 // 通路2（東西30m、部屋6↔部屋3）
 SHM3_PASSAGE2_A:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">ザールカノンの墓所 B3F</span><br><br>
  東西に30m続く石造りの通路。天井が低く、壁の両側に等間隔で燭台の跡がある。<br>
  西端の北側の壁に扉があり、東端には部屋への扉がある。`,
 choices:[
  {label:'→ 東の扉へ', fn:()=>shm3Move('SHM3_ROOM6')},
  {label:'↑ 西端・北の扉へ', fn:()=>shm3Move('SHM3_ROOM3')},
 ],
 },

 // 部屋3
 SHM3_ROOM3:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">ザールカノンの墓所 B3F</span><br><br>
  石室だ。床の中央に大きな排水溝の跡がある。かつて液体が大量に使われた場所であることを示している。<br>
  壁の下部に暗赤色の染みが広がっており、長年にわたって何かが行われていたことが見て取れる。`,
 choices:[
  {label:'↓ 南の扉へ', fn:()=>shm3Move('SHM3_PASSAGE2_A')},
 ],
 },

 // 通路3（5m、部屋6南西↔部屋1北東）
 SHM3_PASSAGE3:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">ザールカノンの墓所 B3F</span><br><br>
  わずか5mほどの短い通路だ。両端に扉があり、東端は部屋6へ、西端は広い石室へ続いている。<br>
  通路の壁に手形が押されて残っている。複数の者が壁を伝いながら急いでここを通った跡だ。`,
 choices:[
  {label:'→ 東の扉へ', fn:()=>shm3Move('SHM3_ROOM6')},
  {label:'← 西の扉へ', fn:()=>shm3Move('SHM3_ROOM1')},
 ],
 },

 // 部屋1（南北35m・東西25m）
 SHM3_ROOM1:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">ザールカノンの墓所 B3F</span><br><br>
  南北35m、東西25mの広い石室。床の石畳に幾何学模様が刻まれており、中央に向かって収束している。<br>
  北東の扉は短い通路へ、南東の扉は南の広間へ続いている。`,
 choices:[
  {label:'↗ 北東の扉へ', fn:()=>shm3Move('SHM3_PASSAGE3')},
  {label:'↘ 南東の扉へ', fn:()=>shm3Move('SHM3_ROOM4')},
 ],
 },

 // 部屋4（南北35m・東西25m）
 SHM3_ROOM4:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">ザールカノンの墓所 B3F</span><br><br>
  南北35m、東西25mの石室。北西の壁に扉があり、南東の壁は開口部（アーチ）になっている。<br>
  石室の中央に大型の石棺が据えられており、蓋に紋章が刻まれている。蓋はずれており、中は空だ。`,
 choices:[
  {label:'← 西の扉へ', fn:()=>shm3Move('SHM3_ROOM1')},
  {label:'↘ 南東のアーチへ', fn:()=>shm3Move('SHM3_ROOM5')},
 ],
 },

 // 部屋5（南北25m・東西15m）
 SHM3_ROOM5:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">ザールカノンの墓所 B3F</span><br><br>
  南北25m、東西15mの細長い石室。西側の壁にアーチ型の開口部がある。<br>
  室内の壁三面に、人物像の浮き彫りが並んでいる。等身大の彫刻で、それぞれ異なる姿勢で何かを捧げ持っている。<br>
  床の奥に石造りの祭壇がある。`,
 choices:[
  {label:'← 西のアーチへ', fn:()=>shm3Move('SHM3_ROOM4')},
 ],
 },


 // ══════════════════════════════════════════════════════
 // アル・ラシード東方の地下迷宮
 // ══════════════════════════════════════════════════════

 AL_DNG_ENTRANCE:{
 scene:'dungeon',
 txt:()=>{
  const torches = countTorches();
  const torchMsg = torches>0?`<span style="color:#e8e4d8"> 松明を${torches}本持っている。</span>`:`<span class="red"> 松明を持っていない！暗闇の中を進むことになる。</span>`;
  return ` <span style="color:#f0ece0">アル・ラシード東方の地下迷宮</span><br><br>
   アル・ラシードの東郊、砂漠の岩盤に穿たれた石造りの入口だ。<br>
   かつての文明が残した遺構で、その深さは誰も知らない。急な石段が地下へと続いている。<br><br>
   ${torchMsg}`;
 },
 choices:[
  {label:'↓ 地下へ降りる', fn:()=>initTorch(), go:'AL_PASSAGE1'},
  {label:'← アル・ラシードへ戻る', go:'TOWN_AL_RASHID'},
 ],
 },

 AL_PASSAGE1:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">アル・ラシード東方の地下迷宮</span><br><br>
  石段を降りると南へ25mの通路が続く。壁は切り石で丁寧に積まれており、高い建築技術が感じられる。通路の終端に重い石扉がある。`,
 choices:[
  {label:'↑ 地上へ', go:'AL_DNG_ENTRANCE'},
  {label:'↓ 南の石扉へ', fn:()=>alMove('AL_ROOM3')},
 ],
 },

 AL_ROOM3:{
 scene:'dungeon',
 txt:()=>{
  const base = `<span style="color:#f0ece0">アル・ラシード東方の地下迷宮</span><br><br>
  35m四方の広い石室。床の石畳に複雑な文様が刻まれており、中央に向かって収束している。<br>
  北壁西端に扉、北壁東端に扉、南壁東端に扉、西壁中央に扉がある。`;
  if(!PC._alRoom3OrcsDefeated){
   return `${base}<br><br><span style="color:#f0ddd8">入口を見張っていた<b>オークの戦士5体</b>が、こちらの姿に気づくなり襲いかかってきた！</span>`;
  }
  return base;
 },
 choices:()=>{
  if(!PC._alRoom3OrcsDefeated){
   return [{label:' 戦う', fn:()=>{
    startCombatNPC({
     enemies: Array.from({length:5},()=>generateOrcWarrior(1)),
     win:'AL_ROOM3', lose:'DEAD',
     onWin:()=>{
      PC._alRoom3OrcsDefeated = true;
      PC.gold = (PC.gold||0) + 100;
      PC._pendingMsg = (PC._pendingMsg||'') + `<div style="color:#e8e4d8;font-size:var(--font-sm);margin-bottom:8px"> オークたちの持ち物を探ると、合計100GPを見つけた。</div>`;
     },
    });
   }}];
  }
  return [
   {label:'↖ 北西の扉', fn:()=>alMove('AL_PASSAGE1')},
   {label:'↗ 北東の扉', fn:()=>alMove('AL_PASSAGE2')},
   {label:'↓ 南の扉', fn:()=>alMove('AL_PASSAGE9')},
   {label:'← 西の扉', fn:()=>alMove('AL_W_PASSAGE1')},
   {label:' 床の文様を調べる（知力 能力値テスト）', fn:()=>{
    const s = document.getElementById('story');
    const afterCheck = ()=>{
     if(Math.random() < 0.1){
      const m = HUNT_MONSTER_TABLE.zahara_region[Math.floor(Math.random()*HUNT_MONSTER_TABLE.zahara_region.length)];
      const mr = m.mr;
      drawScene('combat');
      startCombat({name:m.name, mr, armor:m.armor||Math.floor(mr/30), canFlee:true, win:'__noop__', lose:'DEAD',
       onWin:()=>{ document.getElementById('cbt-area').classList.add('hidden'); document.getElementById('scroll-area').classList.remove('in-combat'); cbtState=null; go('AL_ROOM3'); }
      });
     } else {
      renderChoices([{label:'▶ OK', fn:()=>go('AL_ROOM3')}]);
     }
    };
    setupSavingRoll({
     attr:'iq', level:1, label:'床の文様',
     onSuccess(){
      document.getElementById('dice-area').classList.add('hidden');
      s.innerHTML += `<br><br><span style="color:#e8e0d0"> 文様をじっくりと観察してみたが、これが何を意味するのかは結局分からなかった。</span>`;
      afterCheck();
     },
     onFail(){
      document.getElementById('dice-area').classList.add('hidden');
      s.innerHTML += `<br><br><span style="color:#e8e0d0"> 文様を読み解こうとしたが、手がかりは掴めなかった。</span>`;
      afterCheck();
     },
    });
   }},
  ];
 },
 },

 AL_PASSAGE2:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">アル・ラシード東方の地下迷宮</span><br><br>
  東西15mの通路。東端は南壁に扉と東壁に鍵のかかった扉。西端の北壁にアーチがある。`,
 choices:()=>{
  const ch=[];
  ch.push({label:'↘ 東端・南の扉', fn:()=>alMove('AL_ROOM3')});
  if(PC._alDng_has_key) ch.push({label:'→ 東端・東の扉（鍵で開ける）', fn:()=>alMove('AL_ROOM2')});
  else ch.push({label:'→ 東端・東の扉（鍵がかかっている）', fn:()=>showSaveToast('鍵がかかっている')});
  ch.push({label:'↖ 西端・北のアーチ', fn:()=>alMove('AL_ROOM16')});
  return ch;
 },
 },

 AL_ROOM16:{
 scene:'dungeon',
 txt:()=>{
  if(!PC._alRoom16KoboldsDefeated){
   return `<span style="color:#f0ece0">アル・ラシード東方の地下迷宮</span><br><br>
   南北20m、東西15mの石室。南壁西端にアーチがある。<br>
   <span style="color:#f0ddd8">部屋の中に<b>コボルドが6体</b>たむろしている！</span>`;
  }
  return `<span style="color:#f0ece0">アル・ラシード東方の地下迷宮</span><br><br>
  南北20m、東西15mの石室。南壁西端にアーチがある。西の壁の北端をよく見ると、他の石とわずかに色の違う箇所がある。<br>
  ${PC._alDng_secret_found?'<span style="color:#e0d8c8"> 隠し扉は開いている。</span>':''}`;
 },
 choices:()=>{
  if(!PC._alRoom16KoboldsDefeated){
   return [{label:' 戦う', fn:()=>{
    startCombat({
     enemies: Array.from({length:6},()=>({name:'コボルド', mr:15, armor:0})),
     canFlee:true, win:'AL_ROOM16', lose:'DEAD',
     onWin:()=>{
      PC._alRoom16KoboldsDefeated = true;
      PC.gold = (PC.gold||0) + 100;
      PC._pendingMsg = (PC._pendingMsg||'') + `<div style="color:#e8e4d8;font-size:var(--font-sm);margin-bottom:8px"> コボルドたちが持っていた所持金、合計100GPを回収した。</div>`;
     },
    });
   }}];
  }
  const ch=[];
  ch.push({label:'↓ 南のアーチ', fn:()=>alMove('AL_PASSAGE2')});
  if(!PC._alDng_secret_found){
   ch.push({label:' 西の壁を調べる（知力 Lv1 能力値テスト）', fn:()=>{
    const s=document.getElementById('story');
    s.innerHTML=`<span style="color:#f0ece0">アル・ラシード東方の地下迷宮</span><br><br>西の壁を押し確かめていく——`;
    document.getElementById('dice-area').classList.remove('hidden');
    setupSavingRoll({attr:'iq',level:1,label:'隠し扉の発見',
     onSuccess(){
      document.getElementById('dice-area').classList.add('hidden');
      PC._alDng_secret_found=true;
      s.innerHTML=`<span style="color:#f0ece0">アル・ラシード東方の地下迷宮</span><br><br>特定の石を押すと、壁が音もなく内側へ滑った。<br><span style="color:#e8e4d8"> 隠し扉を発見した！</span>`;
      renderChoices([{label:'← 隠し扉の先へ',fn:()=>alMove('AL_ROOM16_SECRET')},{label:'↓ 南のアーチ',fn:()=>alMove('AL_PASSAGE2')}]);
      scrollToTop();
     },
     onFail(){
      document.getElementById('dice-area').classList.add('hidden');
      s.innerHTML=`<span style="color:#f0ece0">アル・ラシード東方の地下迷宮</span><br><br>壁を丹念に調べたが、何も見つからなかった。`;
      renderChoices([{label:'↓ 南のアーチ',fn:()=>alMove('AL_PASSAGE2')},{label:' もう一度調べる',go:'AL_ROOM16'}]);
      scrollToTop();
     },
    });
   }});
  } else {
   ch.push({label:'← 西の隠し扉', fn:()=>alMove('AL_ROOM16_SECRET')});
  }
  return ch;
 },
 },

 AL_ROOM16_SECRET:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">アル・ラシード東方の地下迷宮</span><br><br>
  5m四方の極めて小さな石室。壁面に象形文字が隙間なく刻まれている。石台の上に古い鍵束が置かれている。<br>
  ${PC._alDng_has_key?'<span style="color:#e8e4d8"> 鍵束は既に取った。</span>':''}`,
 choices:()=>{
  const ch=[];
  if(!PC._alDng_has_key){
   ch.push({label:' 鍵束を取る', fn:()=>{
    PC._alDng_has_key=true;
    showSaveToast(' 古い鍵束を入手した');
    const s=document.getElementById('story');
    s.innerHTML=`<span style="color:#f0ece0">アル・ラシード東方の地下迷宮</span><br><br>石台の鍵束を手に取った。複数の鍵が付いており、どこかの錠前を開けられるはずだ。<br><span style="color:#e8e4d8"> 古い鍵束を入手した。</span>`;
    renderChoices([{label:'→ 東（隠し扉）',fn:()=>alMove('AL_ROOM16')}]);
    scrollToTop();
   }});
  }
  ch.push({label:'→ 東（隠し扉）', fn:()=>alMove('AL_ROOM16')});
  return ch;
 },
 },

 AL_ROOM1:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">アル・ラシード東方の地下迷宮</span><br><br>
  30m四方の石室。天井はドーム型になっている。今は石で塞がれている。壁に沿って等間隔に柱の跡がある。<br>
  南壁の西端から10mに扉、東壁南端に扉、北壁の東端から10mのところにアーチがある。`,
 choices:[
  {label:'↓ 南の扉', fn:()=>alMove('AL_ROOM5')},
  {label:'→ 東の扉', fn:()=>alMove('AL_ROOM4')},
  {label:'↑ 北のアーチ', fn:()=>alMove('AL_ROOM2')},
 ],
 },

 AL_ROOM2:{
 scene:'dungeon',
 txt:()=>{
  const base = `<span style="color:#f0ece0">アル・ラシード東方の地下迷宮</span><br><br>
  南北30m、東西35mの石室。天井が高く、壁の上部に細長い採光窓の跡が並んでいる。<br>
  西壁南端に鍵のかかった扉、南壁東端から10mの位置にアーチ、東壁北端にアーチがある。`;
  if(!PC._alRoom2SpidersDefeated){
   return `${base}<br><br><span style="color:#f0ddd8">部屋の角に、<b>大グモが5体</b>身を潜めている！</span>`;
  }
  return `${base}<br><br><span style="color:#b0a080">大グモの死骸が部屋の隅に転がっている。</span>`;
 },
 choices:()=>{
  const ch=[];
  if(!PC._alRoom2SpidersDefeated){
   ch.push({label:' 戦う', fn:()=>{
    startCombat({
     enemies: Array.from({length:5},()=>({name:'大グモ', mr:20, armor:0})),
     canFlee:true, win:'AL_ROOM2', lose:'DEAD',
     onWin:()=>{
      PC._alRoom2SpidersDefeated = true;
      PC.gold = (PC.gold||0) + 100;
      PC._pendingMsg = (PC._pendingMsg||'') + `<div style="color:#e8e4d8;font-size:var(--font-sm);margin-bottom:8px"> 部屋の隅に、過去の犠牲者と思しき骸骨があった。持っていた皮のポーチから100GPを見つけた。</div>`;
     },
    });
   }});
   return ch;
  }
  if(PC._alDng_has_key) ch.push({label:'← 西の扉（鍵で開ける）', fn:()=>alMove('AL_PASSAGE2')});
  else ch.push({label:'← 西の扉（鍵がかかっている）', fn:()=>showSaveToast('鍵がかかっている')});
  ch.push({label:'↓ 南のアーチ', fn:()=>alMove('AL_ROOM1')});
  ch.push({label:'→ 東のアーチ', fn:()=>alMove('AL_PASSAGE3')});
  return ch;
 },
 },

 AL_PASSAGE3:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">アル・ラシード東方の地下迷宮</span><br><br>
  L字型の通路。東西15mの通路が南に折れて南北35mの通路につながっている。西端にアーチ、南端に鍵のかかった扉がある。`,
 choices:()=>{
  const ch=[];
  ch.push({label:'← 西のアーチ', fn:()=>alMove('AL_ROOM2')});
  if(PC._alDng_has_key) ch.push({label:'↓ 南の扉（鍵で開ける）', fn:()=>alMove('AL_ROOM4')});
  else ch.push({label:'↓ 南の扉（鍵がかかっている）', fn:()=>showSaveToast('鍵がかかっている')});
  return ch;
 },
 },

 AL_ROOM4:{
 scene:'dungeon',
 txt:()=>{
  const base = `<span style="color:#f0ece0">アル・ラシード東方の地下迷宮</span><br><br>
  35m四方の大きな石室。床の中央に大きな排水口の跡がある。<br>
  北壁西端から10mの位置に扉、西壁南端から10mの位置に扉、東壁南端にアーチ、北壁東端に鍵のかかった扉がある。`;
  if(!PC._alRoom4OrcsDefeated){
   return `${base}<br><br><span style="color:#f0ddd8">ローブを着た<b>オークの魔法使い</b>が、3体の<b>オークの戦士</b>たちを不満そうに叱責している。こちらの姿に気づくなり、全員が一斉に襲いかかってきた！</span>`;
  }
  return base;
 },
 choices:()=>{
  if(!PC._alRoom4OrcsDefeated){
   return [{label:' 戦う', fn:()=>{
    startCombatNPC({
     enemies: [generateOrcMage(5), ...Array.from({length:3},()=>generateOrcWarrior(1))],
     win:'AL_ROOM4', lose:'DEAD',
     onWin:()=>{ PC._alRoom4OrcsDefeated = true; },
    });
   }}];
  }
  const ch=[];
  ch.push({label:'↖ 北西の扉', fn:()=>alMove('AL_PASSAGE3')});
  ch.push({label:'← 西の扉', fn:()=>alMove('AL_ROOM1')});
  ch.push({label:'↘ 南東のアーチ', fn:()=>alMove('AL_ROOM11')});
  if(PC._alDng_has_key) ch.push({label:'↗ 北東の扉（鍵で開ける）', fn:()=>alMove('AL_ROOM17')});
  else ch.push({label:'↗ 北東の扉（鍵がかかっている）', fn:()=>showSaveToast('鍵がかかっている')});
  ch.push({label:' 排水口を覗き込む', fn:()=>{
   const s = document.getElementById('story');
   s.innerHTML += `<br><br><span style="color:#e8e0d0"> 排水口を覗き込むと、思いのほか深く、底が見えないほどだった。</span>`;
   setupSavingRoll({
    attr:'lk', level:1, label:'排水口',
    onSuccess(){
     document.getElementById('dice-area').classList.add('hidden');
     const jewelResult = generateJewel();
     updateHUD();
     s.innerHTML += `<br><br><span style="color:#e8e0d0"> 目を凝らすと、排水口の隙間に小さな宝石が引っかかっているのが見えた。拾い上げる。</span><br><span style="color:#e8e4d8">${jewelResult}</span>`;
     renderChoices([{label:'▶ OK', fn:()=>go('AL_ROOM4')}]);
    },
    onFail(){
     document.getElementById('dice-area').classList.add('hidden');
     s.innerHTML += `<br><br><span style="color:#e0d0d0"> 排水口の奥から、不穏な色をしたガスが立ち上ってきた！</span>`;
     setupSavingRoll({
      attr:'con', level:1, label:'毒ガス',
      onSuccess(){
       document.getElementById('dice-area').classList.add('hidden');
       s.innerHTML += `<br><br><span style="color:#e8e0d0"> とっさに息を止め、ガスの影響を免れた。</span>`;
       renderChoices([{label:'▶ OK', fn:()=>go('AL_ROOM4')}]);
      },
      onFail(){
       document.getElementById('dice-area').classList.add('hidden');
       const dmg = Nd6(1);
       PC.con = Math.max(0, PC.con-dmg);
       updateHUD();
       s.innerHTML += `<br><br><span class="red"> 毒ガスを吸い込んでしまった！体力-${dmg}</span>`;
       if(PC.con<=0){ renderChoices([{label:'…（力尽きた）', go:'DEAD'}]); return; }
       renderChoices([{label:'▶ OK', fn:()=>go('AL_ROOM4')}]);
      },
     });
    },
   });
  }});
  return ch;
 },
 },

 AL_ROOM17:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">アル・ラシード東方の地下迷宮</span><br><br>
  15m四方の石室。四方の壁に武器掛けの跡が残っているが、武器は全て失われている。<br>
  南壁西端に鍵のかかった扉、南壁東端に鍵のかかった扉、東壁北端に扉がある。`,
 choices:()=>{
  const ch=[];
  if(PC._alDng_has_key){
   ch.push({label:'↙ 南西の扉（鍵で開ける）', fn:()=>alMove('AL_ROOM4')});
   ch.push({label:'↘ 南東の扉（鍵で開ける）', fn:()=>alMove('AL_ROOM11')});
  } else {
   ch.push({label:'↙ 南西の扉（鍵がかかっている）', fn:()=>showSaveToast('鍵がかかっている')});
   ch.push({label:'↘ 南東の扉（鍵がかかっている）', fn:()=>showSaveToast('鍵がかかっている')});
  }
  ch.push({label:'↗ 北東の扉', fn:()=>alMove('AL_PASSAGE4')});
  return ch;
 },
 },

 AL_PASSAGE4:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">アル・ラシード東方の地下迷宮</span><br><br>
  南北20mの通路。南端の西壁に扉、北端の西壁に金属製の扉がある。`,
 choices:[
  {label:'↙ 南端・西の扉', fn:()=>alMove('AL_ROOM17')},
  {label:'↖ 北端・西の扉', fn:()=>alMove('AL_ROOM8')},
 ],
 },

 AL_ROOM8:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">アル・ラシード東方の地下迷宮</span><br><br>
  15m四方の石室。床の一角に古い焚き火の跡がある。壁に炭で何かが描かれているが、判読できない。<br>
  東壁中央に金属製の扉がある。`,
 choices:[
  {label:'→ 東の扉', fn:()=>alMove('AL_PASSAGE4')},
 ],
 },

 AL_ROOM11:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">アル・ラシード東方の地下迷宮</span><br><br>
  南北35m、東西15mの細長い石室。壁に沿って石造りの棚の跡が並んでいる。<br>
  北壁西端に扉、西壁南端にアーチ、南壁東端に鉄で補強された扉がある。`,
 choices:[
  {label:'↑ 北の扉', fn:()=>alMove('AL_ROOM17')},
  {label:'↙ 南西のアーチ', fn:()=>alMove('AL_ROOM4')},
  {label:'↘ 南東の扉', fn:()=>alMove('AL_PASSAGE5')},
 ],
 },

 AL_PASSAGE5:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">アル・ラシード東方の地下迷宮</span><br><br>
  L字型の通路。東西40mの通路の西端が南に折れ、南北15mの通路になっている。東端の北壁に鉄で補強された扉、東端の南壁にアーチ、南北通路の南端に金属でできた扉がある。`,
 choices:[
  {label:'↗ 東端・北の扉', fn:()=>alMove('AL_ROOM11')},
  {label:'↘ 東端・南のアーチ', fn:()=>alMove('AL_ROOM9')},
  {label:'↓ 南端の扉', fn:()=>alMove('AL_ROOM15')},
 ],
 },

 AL_ROOM15:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">アル・ラシード東方の地下迷宮</span><br><br>
  南北20m、東西15mの石室。壁に等間隔で燭台の跡が並んでいる。<br>
  北壁東端に扉がある。`,
 choices:[
  {label:'↑ 北の扉', fn:()=>alMove('AL_PASSAGE5')},
 ],
 },

 AL_ROOM5:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">アル・ラシード東方の地下迷宮</span><br><br>
  30m四方の石室。天井に装飾の跡が残っており、かつては色鮮やかだったと思われる。<br>
  南壁西端から10mに扉、北壁西端から10mに扉がある。`,
 choices:[
  {label:'↓ 南の扉', fn:()=>alMove('AL_ROOM12')},
  {label:'↑ 北の扉', fn:()=>alMove('AL_ROOM1')},
 ],
 },

 AL_ROOM12:{
 scene:'dungeon',
 txt:()=>{
  const base = `<span style="color:#f0ece0">アル・ラシード東方の地下迷宮</span><br><br>
  東西30m、南北20mの石室。床に大型の台座の跡が四隅に残っている。<br>
  南壁西端から5mに扉、北壁東端に扉、北壁西端にアーチがある。`;
  if(!PC._alRoom12KoboldsDefeated){
   return `${base}<br><br><span style="color:#f0ddd8">部屋の中に<b>コボルドが6体</b>たむろしている！</span>`;
  }
  return base;
 },
 choices:()=>{
  if(!PC._alRoom12KoboldsDefeated){
   return [{label:' 戦う', fn:()=>{
    startCombat({
     enemies: Array.from({length:6},()=>({name:'コボルド', mr:15, armor:0})),
     canFlee:true, win:'AL_ROOM12', lose:'DEAD',
     onWin:()=>{
      PC._alRoom12KoboldsDefeated = true;
      PC.gold = (PC.gold||0) + 110;
      PC._pendingMsg = (PC._pendingMsg||'') + `<div style="color:#e8e4d8;font-size:var(--font-sm);margin-bottom:8px"> コボルドたちが持っていた所持金、合計110GPを回収した。</div>`;
     },
    });
   }}];
  }
  return [
   {label:'↓ 南の扉', fn:()=>alMove('AL_PASSAGE8')},
   {label:'↖ 北西のアーチ', fn:()=>alMove('AL_PASSAGE9')},
   {label:'↗ 北東の扉', fn:()=>alMove('AL_ROOM5')},
  ];
 },
 },

 AL_PASSAGE8:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">アル・ラシード東方の地下迷宮</span><br><br>
  東西25mの通路。東端に扉、西端の北壁に扉がある。`,
 choices:[
  {label:'→ 東端の扉', fn:()=>alMove('AL_ROOM6')},
  {label:'↖ 西端・北の扉', fn:()=>alMove('AL_ROOM12')},
 ],
 },

 AL_ROOM6:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">アル・ラシード東方の地下迷宮</span><br><br>
  南北20m、東西15mの石室。交差点のような役割を持ち、複数の開口部がある。<br>
  西壁北端に扉、西壁南端から5mのところにアーチ、東壁南端に扉がある。`,
 choices:[
  {label:'⬅ 西壁北端の扉', fn:()=>alMove('AL_PASSAGE8')},
  {label:'⬅ 西壁のアーチ', fn:()=>alMove('AL_PASSAGE7')},
  {label:'➡ 東壁南端の扉', fn:()=>alMove('AL_ROOM15B')},
 ],
 },

 AL_ROOM15B:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">アル・ラシード東方の地下迷宮</span><br><br>
  東西25mの通路。東端の南側に下り階段があるが、石材が崩落して完全に塞がれており降りることができない。<br>
  西端の西壁には扉がある。`,
 choices:[
  {label:'← 西端の扉', fn:()=>alMove('AL_ROOM6')},
  {label:'↘ 東端・南の階段（崩れて通れない）', fn:()=>showSaveToast('石材が崩落して塞がれている')},
 ],
 },

 AL_PASSAGE7:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">アル・ラシード東方の地下迷宮</span><br><br>
  東西40mの長い通路。壁の両側に古い松明ホルダーが等間隔に並んでいる。西端に扉、東端にアーチがある。`,
 choices:[
  {label:'← 西端の扉', fn:()=>alMove('AL_ROOM14')},
  {label:'→ 東端のアーチ', fn:()=>alMove('AL_ROOM6')},
 ],
 },

 AL_ROOM14:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">アル・ラシード東方の地下迷宮</span><br><br>
  南北25m、東西15mの石室。床の石畳が他より新しく、かつて修復が行われた形跡がある。<br>
  東壁南端にアーチ、東壁北端に扉がある。`,
 choices:[
  {label:'↘ 南東のアーチ', fn:()=>alMove('AL_PASSAGE6')},
  {label:'↗ 北東の扉', fn:()=>alMove('AL_PASSAGE7')},
 ],
 },

 AL_PASSAGE6:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">アル・ラシード東方の地下迷宮</span><br><br>
  L字型の長い通路。南北に40m走る通路の南端が東西100mある通路の東端につながっている。この迷宮でも特に古い区画らしく、壁の石組みが異なる。<br>
  南北通路の北端に扉、東西通路の西端にアーチがある。`,
 choices:[
  {label:'↑ 北端の扉', fn:()=>alMove('AL_ROOM9')},
  {label:'← 西端のアーチ', fn:()=>alMove('AL_ROOM14')},
 ],
 },

 AL_ROOM9:{
 scene:'dungeon',
 txt:()=>{
  const base = `<span style="color:#f0ece0">アル・ラシード東方の地下迷宮</span><br><br>
  30m四方の石室。床の中央に放射状の紋様が刻まれており、その中心から幾何学的な線が広がっている。<br>
  北壁東端にアーチ、南壁西端にアーチ、南壁西端から10mに扉がある。`;
  if(!PC._alRoom9OrcsDefeated){
   return `${base}<br><br><span style="color:#f0ddd8">ダンジョン内を巡回していた<b>オークの戦士5体</b>が、こちらの姿を見るなり襲いかかってきた！</span>`;
  }
  return base;
 },
 choices:()=>{
  if(!PC._alRoom9OrcsDefeated){
   return [{label:' 戦う', fn:()=>{
    startCombatNPC({
     enemies: Array.from({length:5},()=>generateOrcWarrior(1)),
     win:'AL_ROOM9', lose:'DEAD',
     onWin:()=>{ PC._alRoom9OrcsDefeated = true; },
    });
   }}];
  }
  return [
   {label:'↑ 北のアーチ', fn:()=>alMove('AL_PASSAGE5')},
   {label:'⬇ 南のアーチ', fn:()=>alMove('AL_ROOM10')},
   {label:'⬇ 南の扉', fn:()=>alMove('AL_PASSAGE6')},
  ];
 },
 },

 AL_ROOM10:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">アル・ラシード東方の地下迷宮</span><br><br>
  南北15m、東西25mの石室。北壁の全面にアーチ状の装飾が施されており、かつては壮麗だったと思われる。<br>
  北にアーチがある。`,
 choices:[
  {label:'↑ 北のアーチ', fn:()=>alMove('AL_ROOM9')},
 ],
 },

 AL_PASSAGE9:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">アル・ラシード東方の地下迷宮</span><br><br>
  南北25mの通路。壁面に細かい刻み文字が並んでおり、祈祷文のようだ。北端に扉、南端にアーチがある。`,
 choices:[
  {label:'↑ 北端の扉', fn:()=>alMove('AL_ROOM3')},
  {label:'↓ 南端のアーチ', fn:()=>alMove('AL_ROOM12')},
 ],
 },

 AL_ROOM7:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">アル・ラシード東方の地下迷宮</span><br><br>
  南北15m、東西30mの横長の石室。東西の壁に古い壁画の跡があるが、ほとんど剥落している。<br>
  南に扉、北にアーチがある。`,
 choices:[
  {label:'↓ 南の扉', fn:()=>alMove('AL_ROOM12')},
  {label:'↑ 北のアーチ', fn:()=>alMove('AL_PASSAGE9')},
 ],
 },



 // ── アル・ラシード東方の地下迷宮 西区画 ──────────────────────
 AL_W_PASSAGE1:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">アル・ラシード東方の地下迷宮 西区画</span><br><br>
  東西15mの通路の西端が南北55mの通路の南端に接続されているL字型通路。壁に沿って古い彫刻が続いている。<br>
  東西通路の東端に扉、南北通路の北端に扉、南端から15mの西壁に扉がある。`,
 choices:[
  {label:'→ 東端の扉', fn:()=>alMove('AL_ROOM3')},
  {label:'↑ 北端の扉', fn:()=>alMove('AL_W_ROOM2')},
  {label:'← 西壁の扉', fn:()=>alMove('AL_W_ROOM9')},
 ],
 },

 AL_W_ROOM9:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">アル・ラシード東方の地下迷宮 西区画</span><br><br>
  南北35m、東西15mの細長い石室。壁龕が等間隔で並んでいる。<br>
  北壁西端に扉、東壁の北端から15mのところに扉、西壁南端に扉がある。`,
 choices:[
  {label:'→ 東壁の扉', fn:()=>alMove('AL_W_PASSAGE1')},
  {label:'↑ 北壁の扉', fn:()=>alMove('AL_W_ROOM8')},
  {label:'← 西壁の扉', fn:()=>alMove('AL_W_PASSAGE4')},
 ],
 },

 AL_W_ROOM2:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">アル・ラシード東方の地下迷宮 西区画</span><br><br>
  35m四方の大石室。天井はドーム型で星図が刻まれており、中央の床石が他と色が違う。<br>
  南壁中央に扉、北壁東端から5mのところに扉、北壁西端に扉、西壁北端から15mのところに扉がついている。
  ${PC._al_w_room2_switch ? '<span style="color:#e8e4d8"> 床石のスイッチは、既に作動させてある。</span>' : ''}`,
 choices:()=>{
  const ch = [
   {label:'↓ 南の扉', fn:()=>alMove('AL_W_PASSAGE1')},
   {label:'↗ 北東の扉', fn:()=>alMove('AL_W_ROOM5')},
   {label:'↖ 北西の扉', fn:()=>alMove('AL_W_ROOM4')},
   {label:'← 西の扉', fn:()=>alMove('AL_W_PASSAGE2')},
  ];
  ch.push({label:' 中央の床石を調べる', fn:()=>{
   const s = document.getElementById('story');
   s.innerHTML += `<br><br><span style="color:#e8e0d0"> 床石をよく調べてみると、体重をかけることで僅かに沈み込む——何かのスイッチになっているようだ。</span>`;
   const opts = [];
   if(!PC._al_w_room2_switch){
    opts.push({label:' スイッチを作動させる', fn:()=>{
     PC._al_w_room2_switch = true;
     s.innerHTML += `<br><br><span style="color:#e8e0d0"> 床石に体重をかけると、重い音とともに、どこかで何かが動いた気配がした。</span>`;
     renderChoices([{label:'▶ OK', fn:()=>go('AL_W_ROOM2')}]);
    }});
   }
   opts.push({label:'▶ 何もせず離れる', fn:()=>go('AL_W_ROOM2')});
   renderChoices(opts);
  }});
  return ch;
 },
 },

 AL_W_ROOM5:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">アル・ラシード東方の地下迷宮 西区画</span><br><br>
  15m四方の石室。床に古代語の銘文が刻まれている。読める者には何かの誓いの言葉と分かるだろう。<br>
  南に扉がある。`,
 choices:[
  {label:'↓ 南の扉', fn:()=>alMove('AL_W_ROOM2')},
 ],
 },

 AL_W_ROOM4:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">アル・ラシード東方の地下迷宮 西区画</span><br><br>
  15m四方の石室。壁の角に古い燭台の残骸が倒れており、かつては照明が灯っていたことが分かる。<br>
  南壁東端に扉、西壁南端に扉がある。`,
 choices:[
  {label:'↓ 南の扉', fn:()=>alMove('AL_W_ROOM2')},
  {label:'← 西の扉', fn:()=>alMove('AL_W_ROOM7')},
 ],
 },

 AL_W_ROOM7:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">アル・ラシード東方の地下迷宮 西区画</span><br><br>
  南北20m、東西35mの横長の石室。東西の壁に古い壁画の跡が残っており、行列の場面が描かれている。<br>
  東壁の南端に扉がある。`,
 choices:[
  {label:'→ 東の扉', fn:()=>alMove('AL_W_ROOM4')},
 ],
 },

 AL_W_PASSAGE2:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">アル・ラシード東方の地下迷宮 西区画</span><br><br>
  東西50mに延びる通路。天井が低く、両側の壁に古い松明ホルダーが残っている。<br>
  東端に扉、西端の南壁に扉がある。`,
 choices:[
  {label:'→ 東端の扉', fn:()=>alMove('AL_W_ROOM2')},
  {label:'↙ 西端・南の扉', fn:()=>alMove('AL_W_ROOM10')},
 ],
 },

 AL_W_ROOM10:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">アル・ラシード東方の地下迷宮 西区画</span><br><br>
  南北15m、東西25mの石室。床に排水溝の跡がある。かつて液体を扱う作業が行われていたのかもしれない。<br>
  北壁西端に扉、西壁南端に扉がある。`,
 choices:[
  {label:'↑ 北の扉', fn:()=>alMove('AL_W_PASSAGE2')},
  {label:'← 西の扉', fn:()=>alMove('AL_W_PASSAGE3')},
 ],
 },

 AL_W_PASSAGE3:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">アル・ラシード東方の地下迷宮 西区画</span><br><br>
  南北65mに延びる通路。石の質が他と異なり、より古い時代に掘られたと思われる。<br>
  南端の東壁に扉があり、北端は${PC._al_w_room2_switch?'開いている':'行き止まりになっている'}。`,
 choices:()=>{
  const ch = [{label:'↘ 南端・東の扉', fn:()=>alMove('AL_W_ROOM10')}];
  if(PC._al_w_room2_switch){
   ch.push({label:'↑ 北端の開口部', fn:()=>alMove('AL_W_ROOM12')});
  }
  return ch;
 },
 },

 AL_W_ROOM12:{
 scene:'dungeon',
 txt:()=>{
  if(PC._al_w_room12_demonDefeated){
   return `<span style="color:#f0ece0">アル・ラシード東方の地下迷宮 西区画</span><br><br>
    東西15m、南北10mの部屋。南壁の中央は開口部になっている。<br>
    部屋の北壁には大きな箱が置いてある。`;
  }
  return `<span style="color:#f0ece0">アル・ラシード東方の地下迷宮 西区画</span><br><br>
   東西15m、南北10mの部屋。南壁の中央は開口部になっている。<br>
   部屋に足を踏み入れた瞬間、奥に潜んでいた太古の炎の悪魔が怒り狂った様子で襲いかかってきた！<br>
   部屋の北壁には大きな箱が置いてある。`;
 },
 choices:()=>{
  if(!PC._al_w_room12_demonDefeated){
   return [{label:'▶ 身構える', fn:()=>{
    drawScene('combat');
    startCombat({name:'太古の炎の悪魔', mr:300, armor:10, canFlee:false, win:'__noop__', lose:'DEAD',
     onWin:()=>{
      document.getElementById('cbt-area').classList.add('hidden');
      document.getElementById('scroll-area').classList.remove('in-combat');
      cbtState=null;
      PC._al_w_room12_demonDefeated = true;
      go('AL_W_ROOM12');
     }
    });
   }}];
  }
  const ch = [];
  if(!PC._al_w_room12_looted){
   ch.push({label:' 大きな箱を開ける', fn:()=>{
    const s = document.getElementById('story');
    const gemLines = [];
    for(let i=0;i<10;i++) gemLines.push(generateJewel());
    const coinAmount = Nd6(3) * 100;
    const coinType = ['GP','SP','CP'][Math.floor(Math.random()*3)];
    if(coinType==='GP') gainGP(coinAmount);
    else if(coinType==='SP') gainSP(coinAmount);
    else gainCP(coinAmount);
    const coinLabel = coinType==='GP'?'金貨':coinType==='SP'?'銀貨':'銅貨';
    PC._al_w_room12_looted = true;
    updateHUD();
    s.innerHTML += `<br><br><span style="color:#e8e0d0"> 箱を開けると、中には宝石が10個と、大量の${coinLabel}が詰まっていた！</span><br>`
     + gemLines.map(g=>`<span style="color:#e8e4d8">${g}</span>`).join('<br>')
     + `<br><span style="color:#ffcc88">${coinLabel}を${coinAmount}枚手に入れた！</span>`;
    renderChoices([{label:'▶ OK', fn:()=>go('AL_W_ROOM12')}]);
   }});
  }
  ch.push({label:'↓ 南の開口部', fn:()=>alMove('AL_W_PASSAGE3')});
  return ch;
 },
 },



 AL_W_PASSAGE4:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">アル・ラシード東方の地下迷宮 西区画</span><br><br>
  南北10mの通路の南端が東西25mの通路の西端に接続されたL字型通路。曲がり角に古い標識の残骸がある。<br>
  北端はT字路へ、東端は扉で行き止まっている。`,
 choices:[
  {label:'→ 東端の扉', fn:()=>alMove('AL_W_ROOM9')},
  {label:'↑ 北端', fn:()=>alMove('AL_W_TJUNC1')},
 ],
 },

 AL_W_TJUNC1:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">アル・ラシード東方の地下迷宮 西区画</span><br><br>
  三方向に分かれるT字路。東西南の通路が延びており、足元の石畳に方位を示す刻み込みがある。
  東の通路は15m先で行き止まり、北壁に扉がある。`,
 choices:[
  {label:'↓ 南', fn:()=>alMove('AL_W_PASSAGE4')},
  {label:'→ 東端北壁の扉', fn:()=>alMove('AL_W_ROOM1')},
  {label:'← 西', fn:()=>alMove('AL_W_PASSAGE5')},
 ],
 },

 AL_W_ROOM1:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">アル・ラシード東方の地下迷宮 西区画</span><br><br>
  15m四方の石室。床の中央に石製の台座の跡がある。何かが長期間置かれていた痕跡だ。<br>
  南壁中央に扉がある。`,
 choices:[
  {label:'↓ 南壁の扉', fn:()=>alMove('AL_W_TJUNC1')},
 ],
 },

 AL_W_PASSAGE5:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">アル・ラシード東方の地下迷宮 西区画</span><br><br>
  南北35mの通路の南端に東西30mの通路の西端が接続されたL字型通路。壁の石組みが入り組んでおり、この区画の構造の複雑さを物語っている。<br>
  南北通路の北端に扉、東西通路の東端はT字路へと続いている。`,
 choices:[
  {label:'→ 東へ', fn:()=>alMove('AL_W_TJUNC1')},
  {label:'↑ 北端の扉', fn:()=>alMove('AL_W_ROOM3')},
 ],
 },

 AL_W_ROOM3:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">アル・ラシード東方の地下迷宮 西区画</span><br><br>
  南北15m、東西35mの横長の石室。天井が高く、壁の上部に細長い採光窓の跡が並んでいる。<br>
  東壁南端に扉、南壁西端に扉、南壁東端から10mのところに扉がある。`,
 choices:[
  {label:'↙ 南壁西端の扉', fn:()=>alMove('AL_W_PASSAGE5')},
  {label:'↓ 南壁東寄りの扉', fn:()=>alMove('AL_W_ROOM11')},
  {label:'→ 東壁南端の扉', fn:()=>alMove('AL_W_ROOM6')},
 ],
 },

 AL_W_ROOM8:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">アル・ラシード東方の地下迷宮 西区画</span><br><br>
  南北15m、東西25mの石室。床に砂が薄く積もっており、足跡がそのまま残る。<br>
  南壁中央に扉、北壁西端にアーチがある。`,
 choices:[
  {label:'↑ 北のアーチ', fn:()=>alMove('AL_W_PASSAGE6')},
  {label:'↓ 南の扉', fn:()=>alMove('AL_W_ROOM9')},
 ],
 },


 AL_W_PASSAGE6:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">アル・ラシード東方の地下迷宮 西区画</span><br><br>
  南北25mに延びる通路。石の表面が滑らかに磨かれており、長年多くの者が行き来した証だ。<br>
  北端の西壁に扉、南端にアーチがある。`,
 choices:[
  {label:'↖ 北端・西の扉', fn:()=>alMove('AL_W_ROOM6')},
  {label:'↓ 南端のアーチ', fn:()=>alMove('AL_W_ROOM8')},
 ],
 },

 AL_W_ROOM6:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">アル・ラシード東方の地下迷宮 西区画</span><br><br>
  南北35mの通路。南北の壁に対称的な装飾が施されている。北端東壁に扉、南端西壁に扉がある。`,
 choices:[
  {label:'↙ 南端西壁の扉', fn:()=>alMove('AL_W_ROOM3')},
  {label:'↗ 北端東壁の扉', fn:()=>alMove('AL_W_PASSAGE6')},
 ],
 },

 AL_W_ROOM11:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">アル・ラシード東方の地下迷宮 西区画</span><br><br>
  25m四方の石室。中央に大きな石製の水盤がある。かつて液体が満たされていたと思われるが、今は干上がって久しい。<br>
  北壁中央に扉がある。
  ${PC._al_w_room11_spiritDefeated ? '<span style="color:#e8e4d8"> 水盤は、静かに乾いたままだ。</span>' : ''}`,
 choices:()=>{
  const ch = [{label:'↑ 北の扉', fn:()=>alMove('AL_W_ROOM3')}];
  if(!PC._al_w_room11_spiritDefeated && !PC._al_w_room11_declined){
   ch.push({label:' 水盤に水を注ぐ', fn:()=>{
    const s = document.getElementById('story');
    s.innerHTML += `<br><br><span style="color:#e8e0d0"> 持っていた水を水盤に注ぐと、水面が揺らぎ、その上に髭面で筋骨隆々の半裸の精霊が姿を現した。手には野太刀を構えている。</span>
     <br><br><span style="color:#e0d8c8">「私を呼び出したということは……力試しがしたい、ということだろう？」</span>`;
    renderChoices([
     {label:' 力試しを認める', fn:()=>{
      s.innerHTML += `<br><br><span style="color:#e8e0d0"> 精霊は満足そうに笑うと、その体を実体化させた。</span>`;
      drawScene('combat');
      startCombatNPC({
       enemies: [{
        name: '実体化した筋骨隆々の肉体派の精霊',
        st: 40, iq: 8, lk: 10, con: 30, maxCon: 30, dex: 20, chr: 8, spd: 12,
        equippedWeapons: [{name:'精霊の野太刀', dice:8, adds:180, stReq:22, dexReq:18, weight:150, twoHand:true}],
        equippedArmors: [],
       }],
       canFlee: true,
       win: '__noop__',
       lose: 'DEAD',
       onWin: ()=>{
        document.getElementById('cbt-area').classList.add('hidden');
        document.getElementById('scroll-area').classList.remove('in-combat');
        cbtState = null;
        PC._al_w_room11_spiritDefeated = true;
        PC.invWeapons = PC.invWeapons || [];
        PC.invWeapons.push({name:'精霊の野太刀', dice:8, adds:30, stReq:22, dexReq:18, weight:150, twoHand:true});
        drawScene('travel');
        const s2 = document.getElementById('story');
        if(s2) s2.innerHTML = `<span style="color:#f0ece0">アル・ラシード東方の地下迷宮 西区画</span><br><br>
         <span style="color:#ffcc88">精霊は満足そうに笑うと、手にしていた野太刀をパーティに差し出し、水盤の中へと消えていった。</span><br>
         <span style="color:#e8e4d8">精霊の野太刀を手に入れた！</span>`;
        renderChoices([{label:'▶ OK', fn:()=>go('AL_W_ROOM11')}]);
       },
      });
     }},
     {label:' 力試しを否定する', fn:()=>{
      PC._al_w_room11_declined = true;
      const stolenGP = PC.gold||0;
      PC.gold = 0;
      updateHUD();
      s.innerHTML += `<br><br><span class="red"> 精霊は激怒し、「臆病者に用はない！」と一喝すると、パーティの財布から${stolenGP}GPを残らず奪い取った。そして次の瞬間、視界が歪み——</span>`;
      renderChoices([{label:'▶ 気づくとアル・ラシードの街にいた', fn:()=>go('TOWN_AL_RASHID')}]);
     }},
    ]);
   }});
  }
  return ch;
 },
 },


 // ── フロストピーク「凍える迷宮」──────────────────────────
 FP_ENTRANCE:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">フロストピーク山麓の迷宮 — 入口</span><br><br>
  霜峰の岩盤を穿って作られた入口。削り出しの石段を下りると、荒削りの石壁が続く広間に出た。
  加工の跡が無骨で、この場所を掘った者たちの実直さが伝わってくる。`,
 choices:[
  {label:'↓ 迷宮へ進む', fn:()=>fpMove('FP_PASSAGE1')},
  {label:'↑ 地上へ戻る', go:'TOWN_FROSTPEAK'},
 ],
 },

 FP_PASSAGE1:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">フロストピーク山麓の迷宮 — 通路</span><br><br>
  東西50mに延びる通路。壁は荒削りの石で、ノミの跡が今も残っている。
  西の壁に頑丈な木製の扉があり、東端は北へ曲がっている。西端南側に地上への階段がある。`,
 choices:[
  {label:'← 西の扉', fn:()=>fpMove('FP_ROOM3')},
  {label:'↑ 東端・北へ', fn:()=>fpMove('FP_PASSAGE2')},
  {label:'↑ 西端南側・地上へ', go:'FP_ENTRANCE'},
 ],
 },

 FP_PASSAGE2:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">フロストピーク山麓の迷宮 — 通路</span><br><br>
  南北40mの通路。北端でT字路に合流し、南端は西へ折れて通路へ続く。
  壁の一面に工具の引き傷が残っており、採掘の歴史を物語っている。`,
 choices:[
  {label:'↑ 北・T字路へ', fn:()=>fpMove('FP_TJUNC')},
  {label:'↙ 南端・西へ', fn:()=>fpMove('FP_PASSAGE1')},
 ],
 },

 FP_TJUNC:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">フロストピーク山麓の迷宮 — T字路</span><br><br>
  南・西・北の三方向に通路が分かれるT字路。角を削った跡が鋭く、作業の丁寧さが見て取れる。
  床には古い松明の灰が積もっており、ここで立ち止まった者が多かったことが分かる。`,
 choices:[
  {label:'↓ 南', fn:()=>fpMove('FP_PASSAGE2')},
  {label:'← 西', fn:()=>fpMove('FP_PASSAGE3')},
  {label:'↑ 北', fn:()=>fpMove('FP_PASSAGE4')},
 ],
 },

 FP_PASSAGE3:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">フロストピーク山麓の迷宮 — 通路</span><br><br>
  東西50mに延びる通路。東端はT字路へ、西端には重厚な扉がある。
  天井が低く、背の高い者は頭をかがめて進む必要がある区間がある。`,
 choices:[
  {label:'→ 東端・T字路', fn:()=>fpMove('FP_TJUNC')},
  {label:'← 西端の扉', fn:()=>fpMove('FP_ROOM3')},
 ],
 },

 FP_PASSAGE4:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">フロストピーク山麓の迷宮 — 通路</span><br><br>
  南北25mの通路。南はT字路へ、北端に扉がある。
  壁に古い落書きがある——数字の羅列で、何かの記録らしい。`,
 choices:[
  {label:'↓ 南・T字路', fn:()=>fpMove('FP_TJUNC')},
  {label:'↑ 北の扉', fn:()=>fpMove('FP_ROOM5')},
 ],
 },

 FP_PASSAGE5:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">フロストピーク山麓の迷宮 — 通路</span><br><br>
  東西15mの短い通路。東端に扉、西端は北へ曲がって通路へ続く。
  岩盤の質が他の箇所と微妙に異なり、この区画だけ後から掘り足したのかもしれない。`,
 choices:[
  {label:'→ 東の扉', fn:()=>fpMove('FP_ROOM2')},
  {label:'↖ 西端・北へ', fn:()=>fpMove('FP_PASSAGE6')},
 ],
 },

 FP_PASSAGE6:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">フロストピーク山麓の迷宮 — 通路</span><br><br>
  南北25mの通路。南端は東へ折れて通路へ、北端は西へ折れて通路へ続く。
  角の石材が他より丁寧に加工されており、要所として意識されていたことが窺える。`,
 choices:[
  {label:'↘ 南端・東へ', fn:()=>fpMove('FP_PASSAGE5')},
  {label:'↖ 北端・西へ', fn:()=>fpMove('FP_PASSAGE7')},
 ],
 },

 FP_PASSAGE7:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">フロストピーク山麓の迷宮 — 通路</span><br><br>
  東西45mに延びる通路。東端は南へ折れて通路へ。
  西端には粗削りのアーチがあり、その奥にB2への下り階段が続いている。
  西端の南壁に木の扉がある。`,
 choices:[
  {label:'↘ 東端・南へ', fn:()=>fpMove('FP_PASSAGE6')},
  {label:'↓ 西端・南の扉', fn:()=>fpMove('FP_ROOM4')},
  {label:'← 西端のアーチ（B2への階段）', fn:()=>fpMove('FP_B2_ENTRANCE')},
 ],
 },

 FP_ROOM1:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">フロストピーク山麓の迷宮 — 部屋</span><br><br>
  南北40m、東西35mの大部屋。天井が高く、上部は暗闇に溶けている。
  床に古い荷台の残骸が散乱しており、物資の集積所として使われていたらしい。
  東壁北端から15mのところに扉がある。`,
 choices:[
  {label:'→ 東の扉', fn:()=>fpMove('FP_ROOM5')},
 ],
 },

 FP_ROOM2:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">フロストピーク山麓の迷宮 — 部屋</span><br><br>
  35m四方の部屋。天井は丸いドーム型になっている。丸く掘られた天井は、鑿で丁寧に均されており技術の高さを感じる。
  中央の床に何かの台座の跡がある。南壁東端から10mに扉、西壁南端から15mに扉がある。`,
 choices:[
  {label:'↓ 南壁の扉', fn:()=>fpMove('FP_ROOM5')},
  {label:'← 西壁の扉', fn:()=>fpMove('FP_PASSAGE5')},
 ],
 },

 FP_ROOM3:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">フロストピーク山麓の迷宮 — 部屋</span><br><br>
  45m四方の広い部屋。かつて何かの作業が行われていたと思われる大型の石製作業台が残っている。
  東壁南端に木の扉、東壁北端に重厚な扉、北壁西端から15mのところに扉がある。`,
 choices:[
  {label:'↗ 東壁北端の重厚な扉', fn:()=>fpMove('FP_PASSAGE3')},
  {label:'↘ 東壁南端の木の扉', fn:()=>fpMove('FP_PASSAGE1')},
  {label:'↑ 北壁の扉', fn:()=>fpMove('FP_ROOM6')},
 ],
 },

 FP_ROOM4:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">フロストピーク山麓の迷宮 — 部屋</span><br><br>
  南北35m、東西40mの部屋。壁の石組みが特に頑丈で、要塞の一室のような雰囲気がある。
  隅に古い武器の残骸が積み上がっており、ここが守りの拠点だったことを示している。
  北壁西端から15mに扉がある。`,
 choices:[
  {label:'↑ 北の扉', fn:()=>fpMove('FP_PASSAGE7')},
 ],
 },

 FP_ROOM5:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">フロストピーク山麓の迷宮 — 部屋</span><br><br>
  35m四方の部屋。四方の壁に彫刻が施されており、山と人とを描いた連作のような構図になっている。
  南壁東端に扉、西壁南端に扉、北壁東端から15mのところに扉がある。`,
 choices:[
  {label:'↓ 南壁の扉', fn:()=>fpMove('FP_PASSAGE4')},
  {label:'← 西壁の扉', fn:()=>fpMove('FP_ROOM1')},
  {label:'↑ 北壁の扉', fn:()=>fpMove('FP_ROOM2')},
 ],
 },

 FP_ROOM6:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">フロストピーク山麓の迷宮 — 部屋</span><br><br>
  南北45m、東西35mの部屋。天井から岩が剥き出しになっており、自然の岩盤と掘削部分の境が見える。
  古い梁の跡が壁に残っており、かつては天井を支える構造があったことが分かる。
  南側西端から15mに扉がある。`,
 choices:[
  {label:'↓ 南の扉', fn:()=>fpMove('FP_ROOM3')},
 ],
 },


 // ── フロストピーク山麓の迷宮 B2 ──────────────────────────
 FP_B2_ENTRANCE:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">フロストピーク山麓の迷宮 B2 — 下り階段</span><br><br>
  粗削りの石段を10mほど下ると、B2の通路に出た。B1より岩盤の質が荒く、天井も低い。
  壁の松明ホルダーは空で、静寂だけが広がっている。`,
 choices:[
  {label:'↑ 登り階段', fn:()=>fpMove('FP_PASSAGE7')},
  {label:'↓ 通路へ進む', fn:()=>fpMove('FP_B2_PASSAGE1')},
 ],
 },

 FP_B2_PASSAGE1:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">フロストピーク山麓の迷宮 B2 — 通路</span><br><br>
  東西25mに延びる通路。東端に登り階段、西端は北へ折れて通路へ続く。
  壁の石が上の階より脆く、所々崩れて砂が積もっている。`,
 choices:[
  {label:'→ 東端の登り階段', fn:()=>fpMove('FP_B2_ENTRANCE')},
  {label:'↖ 西端・北へ', fn:()=>fpMove('FP_B2_PASSAGE2')},
 ],
 },

 FP_B2_PASSAGE2:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">フロストピーク山麓の迷宮 B2 — 通路</span><br><br>
  南北15mの短い通路。南端は東へ折れて通路へ、北端は東へ折れて通路へ続く。
  北端の北の壁に頑丈な扉がある。`,
 choices:[
  {label:'↘ 南端・東へ', fn:()=>fpMove('FP_B2_PASSAGE1')},
  {label:'↗ 北端・東へ', fn:()=>fpMove('FP_B2_PASSAGE3')},
  {label:'↑ 北端・北の扉', fn:()=>fpMove('FP_B2_ROOM3')},
 ],
 },

 FP_B2_PASSAGE3:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">フロストピーク山麓の迷宮 B2 — 通路</span><br><br>
  東西45mに延びる通路。西端は通路へ、東端は南へ折れて通路へ続く。
  長い直線通路で、松明の光が届かない区間がある。足音がよく反響する。`,
 choices:[
  {label:'← 西端', fn:()=>fpMove('FP_B2_PASSAGE2')},
  {label:'↘ 東端・南へ', fn:()=>fpMove('FP_B2_PASSAGE4')},
 ],
 },

 FP_B2_PASSAGE4:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">フロストピーク山麓の迷宮 B2 — 通路</span><br><br>
  北端は通路から南へ折れてきた通路。南端は西へ折れて通路へ続く。
  この区画は他より天井が低く、大柄な者はかがんで進む必要がある。`,
 choices:[
  {label:'↖ 北端・北へ', fn:()=>fpMove('FP_B2_PASSAGE3')},
  {label:'↙ 南端・西へ', fn:()=>fpMove('FP_B2_PASSAGE5_STUB')},
 ],
 },

 // ── 未実装（続きの仕様待ち）
 FP_B2_PASSAGE5_STUB:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">フロストピーク山麓の迷宮 B2 — 通路</span><br><br>
  <span style="color:#c8b8a0">（この先はまだ開かれていない）</span>`,
 choices:[
  {label:'← 戻る', fn:()=>fpMove('FP_B2_PASSAGE4')},
 ],
 },

 FP_B2_ROOM3:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">フロストピーク山麓の迷宮 B2 — 部屋</span><br><br>
  <span style="color:#c8b8a0">（この部屋の仕様はまだ定まっていない）</span>`,
 choices:[
  {label:'↓ 南の扉', fn:()=>fpMove('FP_B2_PASSAGE2')},
 ],
 },


 // ── フロストピーク山麓の迷宮 B2 ─────────────────────────────
 FP_B2_ENTRANCE:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">フロストピーク山麓の迷宮 B2 — 下り階段</span><br><br>
  西端のアーチをくぐると、粗く削られた石段が続く。降りた先は薄暗く、
  B1より空気が重い。石の組み方が古く、この階層の方が歴史が深いことが分かる。`,
 choices:[
  {label:'↓ B2へ進む', fn:()=>fpB2Move('FP_B2_P1')},
  {label:'↑ B1へ戻る', fn:()=>go('FP_PASSAGE7')},
 ],
 },

 FP_B2_P1:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">B2 — 通路</span><br><br>
  東西25mの通路。東端にB1への登り階段がある。西端は北へ折れており通路へ続く。
  床に古い血の染みが幾筋もあり、ここで激しい戦いがあったことを物語っている。`,
 choices:[
  {label:'→ 東端・B1への階段', fn:()=>go('FP_B2_ENTRANCE')},
  {label:'↖ 西端・北へ', fn:()=>fpB2Move('FP_B2_P2')},
 ],
 },

 FP_B2_P2:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">B2 — 通路</span><br><br>
  南北15mの通路。南端は東へ折れ、北端は東へ折れている。
  北端北壁に扉がある。壁に古い紋章が刻まれており、この迷宮を作った者の印らしい。`,
 choices:[
  {label:'↘ 南端・東へ', fn:()=>fpB2Move('FP_B2_P1')},
  {label:'↗ 北端・東へ', fn:()=>fpB2Move('FP_B2_P3')},
  {label:'↑ 北端の扉', fn:()=>fpB2Move('FP_B2_ROOM3')},
 ],
 },

 FP_B2_P3:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">B2 — 通路</span><br><br>
  東西35mの通路。西端は通路へ、東端は南へ折れて通路へ続く。
  天井が低く、岩盤がむき出しになっている区間がある。`,
 choices:[
  {label:'← 西端', fn:()=>fpB2Move('FP_B2_P2')},
  {label:'↘ 東端・南へ', fn:()=>fpB2Move('FP_B2_P4')},
 ],
 },

 FP_B2_P4:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">B2 — 通路</span><br><br>
  南北25mの通路。北端は西へ折れて通路へ、南端は西へ折れて通路へ続く。
  壁の石組みが他の通路より丁寧で、この区画が特別な場所への入口だったことを示す。`,
 choices:[
  {label:'↖ 北端・西へ', fn:()=>fpB2Move('FP_B2_P3')},
  {label:'↙ 南端・西へ', fn:()=>fpB2Move('FP_B2_P5')},
 ],
 },

 FP_B2_P5:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">B2 — 通路</span><br><br>
  東西55mの通路。東端は北へ折れて通路へ、西端はT字路へ続く。
  床に古い轍の跡がある。かつてここを荷台が通っていたらしい。`,
 choices:[
  {label:'↗ 東端・北へ', fn:()=>fpB2Move('FP_B2_P4')},
  {label:'← 西端（T字路）', fn:()=>fpB2Move('FP_B2_TJUNC1')},
 ],
 },

 FP_B2_P6:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">B2 — 通路</span><br><br>
  東西50mの長い通路。東端はT字路へ、西端は北へ折れて通路へ続く。
  通路の途中で壁の材質が変わっており、二つの異なる時代に掘られた部分が合流している。`,
 choices:[
  {label:'→ 東端（T字路）', fn:()=>fpB2Move('FP_B2_TJUNC1')},
  {label:'↖ 西端・北へ', fn:()=>fpB2Move('FP_B2_P8')},
 ],
 },

 FP_B2_P7:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">B2 — 通路</span><br><br>
  南北50mの長い通路。南端はT字路へ、北端は西へ折れて通路へ続く。
  壁に等間隔で燭台の台座がある。かつてはここに灯りが並んでいたのだろう。`,
 choices:[
  {label:'↓ 南端（T字路）', fn:()=>fpB2Move('FP_B2_TJUNC1')},
  {label:'↖ 北端・西へ', fn:()=>fpB2Move('FP_B2_P11')},
 ],
 },

 FP_B2_P8:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">B2 — 通路</span><br><br>
  南北25mの通路。南端は東へ折れて通路へ、北端は行き止まりで東壁に扉がある。
  行き止まりの壁に「これより先、油断するな」と刻まれた警句がある。`,
 choices:[
  {label:'↘ 南端・東へ', fn:()=>fpB2Move('FP_B2_P6')},
  {label:'→ 北端・東壁の扉', fn:()=>fpB2Move('FP_B2_ROOM1')},
 ],
 },

 FP_B2_P9:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">B2 — 通路</span><br><br>
  東西45mの通路。西端の南壁に部屋への扉がある。東端は北へ折れて通路へ続く。
  天井から岩の破片が落ちた跡があり、地盤が不安定な箇所がある。`,
 choices:[
  {label:'↙ 西端・南壁の扉', fn:()=>fpB2Move('FP_B2_ROOM3')},
  {label:'↗ 東端・北へ', fn:()=>fpB2Move('FP_B2_P10')},
 ],
 },

 FP_B2_P10:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">B2 — 通路</span><br><br>
  南北40mの通路。南端は西へ折れて通路へ続く。北端は行き止まりに見えるが……。
  北の壁をよく調べると、石の継ぎ目が他と微妙に違う箇所がある。`,
 choices:[
  {label:'↙ 南端・西へ', fn:()=>fpB2Move('FP_B2_P9')},
  {label:' 北の壁を調べる（知力 Lv2 能力値テスト）', fn:()=>{
   setupSavingRoll({attr:'iq', level:2,
    passTxt:'石の継ぎ目に指をかけると、壁がゆっくり動いた。部屋への隠し扉だ！',
    failTxt:'壁を叩いてみるが、どこが違うのか分からない。',
    onSuccess(){ renderChoices([
     {label:'↑ 北の隠し扉', fn:()=>fpB2Move('FP_B2_ROOM5')},
     {label:'↓ 通路へ戻る', fn:()=>fpB2Move('FP_B2_P9')},
    ]); },
    onFail(){ renderChoices([
     {label:'↓ 通路へ戻る', fn:()=>fpB2Move('FP_B2_P9')},
    ]); },
   });
  }},
 ],
 },

 FP_B2_P11:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">B2 — 通路</span><br><br>
  東西55mの長い通路。東端は南へ折れて通路へ、西端は北へ折れて通路へ続く。
  通路の中ほどで天井が高くなり、自然の空洞と人工の掘削部分が繋がっている。`,
 choices:[
  {label:'↘ 東端・南へ', fn:()=>fpB2Move('FP_B2_P7')},
  {label:'↖ 西端・北へ', fn:()=>fpB2Move('FP_B2_P12')},
 ],
 },

 FP_B2_P12:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">B2 — 通路</span><br><br>
  南北15mの通路。南端は東へ折れて通路へ続く。北端に落とし格子がある。
  格子は頑丈に閉じており、${PC._fp_b2_lever?'先ほどの操作で開放されている。':'びくともしない。'}`,
 choices:()=>{
  const ch = [{label:'↘ 南端・東へ', fn:()=>fpB2Move('FP_B2_P11')}];
  if(PC._fp_b2_lever){
   ch.push({label:'↑ 落とし格子をくぐる', fn:()=>fpB2Move('FP_B2_ROOM6')});
  } else {
   ch.push({label:' 格子を力ずくで開けようとする', fn:()=>{
    const s = document.getElementById('story');
    s.innerHTML += '<br><br><span style="color:#e8e0d0"> 格子を揺さぶり続けていると、背後から重い足音が迫ってきた。</span><br><span style="color:#f0ddd8"> 振り返ると、通路の暗闇から何者かが現れた——</span>';
    renderChoices([{label:'▶ 身構える', fn:()=>fpB2Guard('FP_B2_P12')}]);
   }});
  }
  return ch;
 },
 },

 FP_B2_P13:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">B2 — 通路</span><br><br>
  東西25mの通路。西端の南壁に部屋へのアーチがある。東端は北へ折れて通路へ続く。
  アーチの周囲に古い装飾が施されており、部屋が重要な場所だったことが分かる。`,
 choices:[
  {label:'↙ 西端・南壁のアーチ', fn:()=>fpB2Move('FP_B2_ROOM6')},
  {label:'↗ 東端・北へ', fn:()=>fpB2Move('FP_B2_P14')},
 ],
 },

 FP_B2_P14:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">B2 — 通路</span><br><br>
  南北15mの通路。南端は西へ折れて通路へ続く。北端は行き止まりに見えるが……。
  北の壁の石材が一部だけ色が違う。触れると他の壁より滑らかだ。`,
 choices:[
  {label:'↙ 南端・西へ', fn:()=>fpB2Move('FP_B2_P13')},
  {label:' 北の壁を調べる（知力 Lv2 能力値テスト）', fn:()=>{
   setupSavingRoll({attr:'iq', level:2,
    passTxt:'石の板が内側に倒れるように動いた。隠し扉だ——部屋への入口！',
    failTxt:'壁を押したり引いたりするが、動く気配がない。',
    onSuccess(){ renderChoices([
     {label:'↑ 北の隠し扉', fn:()=>fpB2Move('FP_B2_ROOM4')},
     {label:'↓ 通路へ戻る', fn:()=>fpB2Move('FP_B2_P13')},
    ]); },
    onFail(){ renderChoices([
     {label:'↓ 通路へ戻る', fn:()=>fpB2Move('FP_B2_P13')},
    ]); },
   });
  }},
 ],
 },

 FP_B2_P15:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">B2 — 通路</span><br><br>
  東西25mの通路。西端の南側に部屋への扉がある。東端は北へ折れて通路へ続く。
  通路の壁に古い地図の断片が刻まれているが、大部分が削れて判読できない。`,
 choices:[
  {label:'↙ 西端・南の扉', fn:()=>fpB2Move('FP_B2_ROOM2')},
  {label:'↗ 東端・北へ', fn:()=>fpB2Move('FP_B2_P16')},
 ],
 },

 FP_B2_P16:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">B2 — 通路</span><br><br>
  南北60mの長い通路。南端は西へ折れて通路へ、北端は西へ折れて通路へ続く。
  南端から15mほどの東壁に部屋への扉がある。通路の中ほどで足元が大きく抉れた箇所を跨ぐ。`,
 choices:[
  {label:'↙ 南端・西へ', fn:()=>fpB2Move('FP_B2_P15')},
  {label:'↖ 北端・西へ', fn:()=>fpB2Move('FP_B2_P17')},
  {label:'→ 東壁の扉', fn:()=>fpB2Move('FP_B2_ROOM7')},
 ],
 },

 FP_B2_P17:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">B2 — 通路</span><br><br>
  東西30mの通路。東端は南へ折れて通路へ続く。西端にB3への下り階段がある。
  階段の入口の上部に古い文字で「深処」と刻まれている。`,
 choices:[
  {label:'↘ 東端・南へ', fn:()=>fpB2Move('FP_B2_P16')},
  {label:'← 西端（B3への階段）', fn:()=>fpB3Move('FP_B3_ENTRANCE')},
 ],
 },

 FP_B2_TJUNC1:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">B2 — T字路1</span><br><br>
  東西に走る通路から北へ分岐するT字路。三方向それぞれから異なる臭いが漂ってくる。
  足元の石畳に「←」「→」「↑」の矢印が彫られているが、意味は分からない。`,
 choices:[
  {label:'→ 東', fn:()=>fpB2Move('FP_B2_P5')},
  {label:'← 西', fn:()=>fpB2Move('FP_B2_P6')},
  {label:'↑ 北', fn:()=>fpB2Move('FP_B2_P7')},
 ],
 },

 FP_B2_LEVER:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">B2 — レバーの間</span><br><br>
  東壁南端の扉の奥にある小さな空間。中央に大きな石製のレバーが据えられている。
  ${PC._fp_b2_lever?'レバーはすでに引かれた状態になっている。':'レバーは上を向いており、まだ引かれていない。'}`,
 choices:()=>{
  const ch = [];
  if(!PC._fp_b2_lever){
   ch.push({label:' レバーを引く', fn:()=>{
    PC._fp_b2_lever = true;
    showSaveToast(' 重いレバーを引いた。遠くで格子の外れる音がした。');
    go('FP_B2_LEVER');
   }});
  }
  ch.push({label:'← 部屋に戻る', fn:()=>fpB2Move('FP_B2_ROOM1')});
  return ch;
 },
 },

 FP_B2_ROOM1:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">B2 — 部屋</span><br><br>
  南北35m、東西20mの部屋。西壁南端から15mに扉がある。
  東壁の中央に古い扉がある。東壁の南端にもう一つ扉がある。`,
 choices:[
  {label:'← 西壁の扉', fn:()=>fpB2Move('FP_B2_P8')},
  {label:'→ 東壁・中央の扉を開けようとする', fn:()=>{
   const s = document.getElementById('story');
   s.innerHTML += '<br><br><span style="color:#e8e0d0"> 扉に手をかけて引いてみるが、びくともしない。押してみても同じだ。金具を叩いたり、蝶番を調べたりしているうちに——</span><br><span style="color:#f0ddd8"> 足音が聞こえた。こちらに近づいてくる。</span>';
   renderChoices([{label:'▶ 身構える', fn:()=>fpB2Guard('FP_B2_ROOM1')}]);
  }},
  {label:'→ 東壁・南端の扉', fn:()=>fpB2Move('FP_B2_LEVER')},
 ],
 },

 FP_B2_ROOM2:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">B2 — 部屋</span><br><br>
  30m四方の部屋。円形の天井。声が反響して独特の響きがある。
  東壁北端から10mのところに扉、北壁西端から10mのところに扉、西壁北端から10mのところに扉がある。`,
 choices:[
  {label:'→ 東壁の扉', fn:()=>fpB2Move('FP_B2_ROOM7')},
  {label:'↑ 北壁の扉', fn:()=>fpB2Move('FP_B2_P15')},
  {label:'← 西壁の扉', fn:()=>fpB2Move('FP_B2_ROOM6')},
 ],
 },

 FP_B2_ROOM3:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">B2 — 部屋</span><br><br>
  40m四方の部屋。中央に古い石製の作業台の跡がある。
  南壁西端に扉、北壁西端に扉がある。`,
 choices:[
  {label:'↓ 南壁の扉', fn:()=>fpB2Move('FP_B2_P2')},
  {label:'↑ 北壁の扉', fn:()=>fpB2Move('FP_B2_P9')},
 ],
 },

 FP_B2_ROOM4:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">B2 — 部屋</span><br><br>
  南北40m、東西35mの部屋。他の部屋より石組みが精巧で、重要な部屋だったことが分かる。
  南壁東端に隠し扉があることを知っていなければ、袋小路に見える。`,
 choices:[
  {label:' 南壁東端の隠し扉', fn:()=>fpB2Move('FP_B2_P14')},
 ],
 },

 FP_B2_ROOM5:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">B2 — 部屋</span><br><br>
  南北40m、東西35mの部屋。壁に精巧な彫刻が施されており、この迷宮で最も装飾が豊かだ。
  南壁の真ん中に扉、南壁東端に扉がある。`,
 choices:[
  {label:'↓ 南壁・中央の扉', fn:()=>fpB2Move('FP_B2_ROOM7')},
  {label:'↘ 南壁東端の扉', fn:()=>fpB2Move('FP_B2_P10')},
 ],
 },

 FP_B2_ROOM6:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">B2 — 部屋</span><br><br>
  30m四方の部屋。天井は丸いドーム型になっている。壁に古代の文字が螺旋状に刻まれている。
  東壁北端から15mに扉、北壁西端にアーチ、南壁西端に落とし格子（${PC._fp_b2_lever?'開放中':'閉鎖中'}）がある。`,
 choices:()=>{
  const ch = [
   {label:'→ 東壁の扉', fn:()=>fpB2Move('FP_B2_ROOM2')},
   {label:'↑ 北壁のアーチ', fn:()=>fpB2Move('FP_B2_P13')},
  ];
  if(PC._fp_b2_lever){
   ch.push({label:'↓ 南壁の落とし格子（開放中）', fn:()=>fpB2Move('FP_B2_P12')});
  } else {
   ch.push({label:' 南壁の格子を力ずくで開けようとする', fn:()=>{
    const s = document.getElementById('story');
    s.innerHTML += '<br><br><span style="color:#e8e0d0"> 格子に体当たりし、引っ張り続けていると——部屋の奥から気配が迫ってきた。</span><br><span style="color:#f0ddd8"> 重い足音とともに、何者かがこちらへ向かってくる。</span>';
    renderChoices([{label:'▶ 身構える', fn:()=>fpB2Guard('FP_B2_ROOM6')}]);
   }});
  }
  return ch;
 },
 },

 FP_B2_ROOM7:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">B2 — 部屋</span><br><br>
  30m四方の部屋。石の床に古い地図が刻まれているが、この迷宮とは別の場所のものらしい。
  北壁東端から10mのところに扉、西壁の南端に扉、西壁の北端に扉がある。`,
 choices:[
  {label:'↑ 北壁の扉', fn:()=>fpB2Move('FP_B2_ROOM5')},
  {label:'↙ 西壁・南端の扉', fn:()=>fpB2Move('FP_B2_ROOM2')},
  {label:'↖ 西壁・北端の扉', fn:()=>fpB2Move('FP_B2_P16')},
 ],
 },


 // ── フロストピーク山麓の迷宮 B3（南区画）────────────────────
 FP_B3_ENTRANCE:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">フロストピーク山麓の迷宮 B3 — 下り階段</span><br><br>
  B2西端の階段を下りきると、さらに深い階層に出た。空気が重く、石の表面が黒く変色している。
  この深さまで掘り進んだ者たちの執念が伝わってくる。`,
 choices:[
  {label:'↓ B3へ進む', fn:()=>fpB3Move('FP_B3_P1')},
  {label:'↑ B2へ戻る', fn:()=>go('FP_B2_P17')},
 ],
 },

 FP_B3_P1:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">B3 — 通路</span><br><br>
  東西25mに延びる短い通路。東端の南壁に大きなアーチがあり、その奥に部屋が見える。
  西端は北へ折れており、上の階への階段もここに続いている。`,
 choices:[
  {label:'↘ 東端・南壁のアーチ', fn:()=>fpB3Move('FP_B3_ROOM4')},
  {label:'↖ 西端・北へ', fn:()=>fpB3Move('FP_B3_P2')},
  {label:'↑ B2への階段', fn:()=>go('FP_B3_ENTRANCE')},
 ],
 },

 FP_B3_P2:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">B3 — 通路</span><br><br>
  南北15mの通路。南端は東へ折れてB2への登り階段のある通路へ続き、北端はT字路に合流する。
  壁の石に深い亀裂が走っており、地盤の歪みが激しいことが分かる。`,
 choices:[
  {label:'↘ 南端・東へ', fn:()=>fpB3Move('FP_B3_P1')},
  {label:'↑ 北・T字路へ', fn:()=>fpB3Move('FP_B3_TJUNC1')},
 ],
 },

 FP_B3_TJUNC1:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">B3 — T字路</span><br><br>
  南北に走る通路から東へ通路が分岐するT字路。三方向から異なる風が吹いており、
  複雑な気流が生じている。床に古い血痕が残っている。`,
 choices:[
  {label:'↓ 南', fn:()=>fpB3Move('FP_B3_P2')},
  {label:'→ 東', fn:()=>fpB3Move('FP_B3_P3')},
  {label:'↑ 北', fn:()=>fpB3Move('FP_B3_P4')},
 ],
 },

 FP_B3_P3:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">B3 — 通路</span><br><br>
  東西30mの通路。西端はT字路へ、東端の壁に頑丈な扉がある。
  通路の床が他より滑らかで、頻繁に行き来があった形跡がある。`,
 choices:[
  {label:'← 西端・T字路', fn:()=>fpB3Move('FP_B3_TJUNC1')},
  {label:'→ 東端の扉', fn:()=>fpB3Move('FP_B3_ROOM2')},
 ],
 },

 FP_B3_P4:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">B3 — 通路</span><br><br>
  南北15mの通路。南端はT字路へ続き、北端はさらに奥へと延びている。
  北の暗闇からひやりとした風が吹いてくる。`,
 choices:[
  {label:'↓ 南・T字路', fn:()=>fpB3Move('FP_B3_TJUNC1')},
  {label:'↑ 北', fn:()=>fpB3Move('FP_B3N_P1')},
 ],
 },

 FP_B3_P5:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">B3 — 通路</span><br><br>
  東西55mの長い通路。東端から25mの北壁に扉がある。
  西端は南へ折れて別の通路へ、東端は南へ折れて別の通路へと続く。`,
 choices:[
  {label:'↑ 北壁の扉', fn:()=>fpB3Move('FP_B3_ROOM2')},
  {label:'↙ 西端・南へ', fn:()=>fpB3Move('FP_B3_P6')},
  {label:'↘ 東端・南へ', fn:()=>fpB3Move('FP_B3_P7')},
 ],
 },

 FP_B3_P6:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">B3 — 通路</span><br><br>
  南北30mの通路。北端は東へ折れている。南端は扉で終わっている。
  扉の周囲に古い装飾が施されており、重要な場所への入口だったことが分かる。`,
 choices:[
  {label:'↗ 北端へ', fn:()=>fpB3Move('FP_B3_P5')},
  {label:'↓ 南端の扉', fn:()=>fpB3Move('FP_B3_ROOM3')},
 ],
 },

 FP_B3_P7:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">B3 — 通路</span><br><br>
  南北50mの長い通路。北端は西へ折れて長い通路へ続く。南へはまっすぐ続いており、
  暗闇の奥に別の通路への出口が見える。`,
 choices:[
  {label:'↖ 北端・西へ', fn:()=>fpB3Move('FP_B3_P5')},
  {label:'↓ 南（暗闇の先へ）', fn:()=>fpB3Move('FP_B3_P8')},
 ],
 },

 FP_B3_P8:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">B3 — 通路</span><br><br>
  南北45mの通路。北へはまっすぐ続いており先が見えない。南端は西へ折れており別の通路へと続く。
  壁に古代の文字が刻まれているが、かなり摩耗して読めない。`,
 choices:[
  {label:'↑ 北（暗闇の先へ）', fn:()=>fpB3Move('FP_B3_P7')},
  {label:'↙ 南端・西へ', fn:()=>fpB3Move('FP_B3_P9')},
 ],
 },

 FP_B3_P9:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">B3 — 通路</span><br><br>
  東西60mの長い通路。東端は北へ折れており別の通路へ続く。西端はT字路へ続いている。
  床の石が部分的に新しく、誰かが修繕を施した跡がある。`,
 choices:[
  {label:'↗ 東端・北へ', fn:()=>fpB3Move('FP_B3_P8')},
  {label:'← 西端・T字路', fn:()=>fpB3Move('FP_B3_TJUNC2')},
 ],
 },

 FP_B3_P10:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">B3 — 通路</span><br><br>
  南北50mの通路。南はT字路へ、北は大きなアーチを通って部屋へ続く。
  通路の中ほどで床の石の色が変わっている区間がある。`,
 choices:[
  {label:'↓ 南・T字路', fn:()=>fpB3Move('FP_B3_TJUNC2')},
  {label:'↑ 北・アーチの先へ', fn:()=>{
   fpB3Teleporter();
  }},
 ],
 },

 FP_B3_P11:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">B3 — 通路</span><br><br>
  東西35mの通路。東端はT字路へ続く。西端から20mの北壁に扉がある。
  西端にはB4への下り階段があるが、階段の手前に頑丈な落とし格子がある。格子は固く閉じており、${PC._fp_b3_lever?'どこかで操作されたのか開いている。':'どうすれば開くのか分からない。'}`,
 choices:()=>{
  const ch = [
   {label:'→ 東端・T字路', fn:()=>fpB3Move('FP_B3_TJUNC2')},
   {label:'↑ 途中・北壁の扉', fn:()=>fpB3Move('FP_B3_ROOM1')},
  ];
  if(PC._fp_b3_lever){
   ch.push({label:'← 西端・落とし格子をくぐる（B4への階段）', fn:()=>{ showSaveToast('B4への道は崩落している'); }});
  } else {
   ch.push({label:'← 西端・落とし格子を調べる', fn:()=>{
    const s = document.getElementById('story');
    s.innerHTML += '<br><br><span style="color:#e8e0d0"> 格子は重厚な鉄製で、機械的な仕掛けで閉じられているようだ。力ずくでは開かない。</span>';
    renderChoices([
     {label:'→ 東端・T字路', fn:()=>fpB3Move('FP_B3_TJUNC2')},
     {label:'↑ 途中・北壁の扉', fn:()=>fpB3Move('FP_B3_ROOM1')},
    ]);
   }});
  }
  return ch;
 },
 },

 FP_B3_TJUNC2:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">B3 — T字路</span><br><br>
  東西に走る通路から北へ通路が分岐するT字路。床の石が周囲より磨耗しており、
  この場所が長年にわたって使われてきたことを示している。`,
 choices:[
  {label:'→ 東', fn:()=>fpB3Move('FP_B3_P9')},
  {label:'↑ 北', fn:()=>fpB3Move('FP_B3_P10')},
  {label:'← 西', fn:()=>fpB3Move('FP_B3_P11')},
 ],
 },

 FP_B3_ROOM1:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">B3 — 部屋</span><br><br>
  南北45m、東西35mの縦長の部屋。壁に古いタペストリーの跡が残っており、布は腐って落ちているが
  鉄製の棒だけが壁に刺さったまま残っている。北壁東端から15mのところに扉、南壁東端から15mのところに扉がある。`,
 choices:[
  {label:'↓ 南壁の扉', fn:()=>fpB3Move('FP_B3_P11')},
  {label:'↑ 北壁の扉', fn:()=>fpB3Move('FP_B3_ROOM4')},
 ],
 },

 FP_B3_ROOM2:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">B3 — 部屋</span><br><br>
  南北30m、東西45mの部屋。中央に大きな石製の台が据えられている。
  西壁南端から15mに扉、南壁中央に扉がある。`,
 choices:[
  {label:'← 西壁の扉', fn:()=>fpB3Move('FP_B3_P3')},
  {label:'↓ 南壁の扉', fn:()=>fpB3Move('FP_B3_P5')},
 ],
 },

 FP_B3_ROOM3:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">B3 — 部屋</span><br><br>
  南北40m、東西35mの部屋。四方の壁に整然と棚の跡が並んでおり、かつて何かを
  大量に保管していた倉庫のような場所だったらしい。北壁西端に扉がある。`,
 choices:[
  {label:'↑ 北壁の扉', fn:()=>fpB3Move('FP_B3_P6')},
 ],
 },

 FP_B3_ROOM4:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">B3 — 部屋</span><br><br>
  35m四方の部屋。天井が高く、上部に古代の彫刻が施されている。この深さにしては
  保存状態が良く、何らかの魔法的な保護があった可能性がある。
  北壁東端から10mのところにアーチ、南壁東端にアーチ、南壁西端から15mに扉がある。`,
 choices:[
  {label:'↙ 南壁西寄りの扉', fn:()=>fpB3Move('FP_B3_ROOM1')},
  {label:'↘ 南壁東端のアーチ', fn:()=>fpB3Move('FP_B3_P10')},
  {label:'↑ 北壁のアーチ', fn:()=>fpB3Move('FP_B3_P1')},
 ],
 },


 // ── フロストピーク山麓の迷宮 B3（北区画）────────────────────
 FP_B3N_P1:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">B3北 — 通路</span><br><br>
  南北50mの長い通路。南へはまっすぐ続いており暗闇の先にB3南の通路が見える。
  北へも同様に暗闇が続いており、先が見えない。`,
 choices:[
  {label:'↓ 南（B3南の通路4）', fn:()=>fpB3Move('FP_B3_P4')},
  {label:'↑ 北（暗闇の先へ）', fn:()=>fpB3Move('FP_B3N_P2')},
 ],
 },

 FP_B3N_P2:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">B3北 — 通路</span><br><br>
  南北55mの長い通路。北端は東へ折れて別の通路へ続く。
  南へはまっすぐ続いており先が見えない。壁の岩盤が露出しており、自然の洞窟と掘削部分が入り混じっている。`,
 choices:[
  {label:'↓ 南（暗闇の先へ）', fn:()=>fpB3Move('FP_B3N_P1')},
  {label:'↗ 北端・東へ', fn:()=>fpB3Move('FP_B3N_P3')},
 ],
 },

 FP_B3N_P3:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">B3北 — 通路</span><br><br>
  東西45mの通路。西端は南へ折れて別の通路へ、東端は北へ折れて別の通路へ続く。
  天井から岩の破片が落ちた跡があちこちにある。`,
 choices:[
  {label:'↙ 西端・南へ', fn:()=>fpB3Move('FP_B3N_P2')},
  {label:'↗ 東端・北へ', fn:()=>fpB3Move('FP_B3N_P4')},
 ],
 },

 FP_B3N_P4:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">B3北 — 通路</span><br><br>
  南北30mの通路。南端は西へ折れて別の通路へ、北端はT字路に合流する。
  床の石が部分的に補修されており、かつて使われていた道だったことが分かる。`,
 choices:[
  {label:'↙ 南端・西へ', fn:()=>fpB3Move('FP_B3N_P3')},
  {label:'↑ 北・T字路', fn:()=>fpB3Move('FP_B3N_TJUNC1')},
 ],
 },

 FP_B3N_P5:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">B3北 — 通路</span><br><br>
  東西40mの通路。東はT字路へ続く。西端は行き止まりで、南壁に小さな扉がある。
  扉の周囲の石に古い油の染みがある。かつてここに松明が置かれていたらしい。`,
 choices:[
  {label:'→ 東端・T字路', fn:()=>fpB3Move('FP_B3N_TJUNC1')},
  {label:'↙ 西端・南の扉', fn:()=>fpB3Move('FP_B3N_ROOM5')},
 ],
 },

 FP_B3N_P6:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">B3北 — 通路</span><br><br>
  東西40mの通路。西はT字路へ続く。東端は行き止まりで、南壁に大きなアーチがある。
  アーチの石材が他より精巧に加工されており、重要な場所への入口だったことが分かる。`,
 choices:[
  {label:'← 西端・T字路', fn:()=>fpB3Move('FP_B3N_TJUNC1')},
  {label:'↘ 東端・南のアーチ', fn:()=>fpB3Move('FP_B3N_ROOM3')},
 ],
 },

 FP_B3N_P7:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">B3北 — 通路</span><br><br>
  東西50mの通路。東端は南へ折れて別の通路へ続く。西端は行き止まりで、西壁に扉がある。
  通路の途中で床の質が変わっており、二つの時代の掘削が合流しているのが分かる。`,
 choices:[
  {label:'↘ 東端・南へ', fn:()=>fpB3Move('FP_B3N_P8')},
  {label:'← 西端の扉', fn:()=>fpB3Move('FP_B3N_ROOM4')},
 ],
 },

 FP_B3N_P8:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">B3北 — 通路</span><br><br>
  南北25mの通路。北端は西へ折れて別の通路へ、南端は西へ折れて別の通路へ続く。
  壁に古い梯子の取り付け跡がある。上の階層への別の出入口があったことを示している。`,
 choices:[
  {label:'↖ 北端・西へ', fn:()=>fpB3Move('FP_B3N_P7')},
  {label:'↙ 南端・西へ', fn:()=>fpB3Move('FP_B3N_P9')},
 ],
 },

 FP_B3N_P9:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">B3北 — 通路</span><br><br>
  東西50mの通路。東端は北へ折れて別の通路へ続く。西端は行き止まりで、西壁に扉がある。
  床に砂が薄く積もっており、足跡がそのまま残る。自分以外の足跡もある。`,
 choices:[
  {label:'↗ 東端・北へ', fn:()=>fpB3Move('FP_B3N_P8')},
  {label:'← 西端の扉', fn:()=>fpB3Move('FP_B3N_ROOM4')},
 ],
 },

 FP_B3N_TJUNC1:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">B3北 — T字路</span><br><br>
  東西に走る通路から南へ通路が分岐するT字路。床の中央に古い排水溝の跡がある。
  三方向からそれぞれ異なる臭いが漂っている。`,
 choices:[
  {label:'↓ 南', fn:()=>fpB3Move('FP_B3N_P4')},
  {label:'← 西', fn:()=>fpB3Move('FP_B3N_P5')},
  {label:'→ 東', fn:()=>fpB3Move('FP_B3N_P6')},
 ],
 },

 FP_B3N_ROOM1:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">B3北 — 部屋</span><br><br>
  南北45m、東西35mの縦長の部屋。壁に複数の壁龕があり、かつて何かが安置されていた台座の跡が残る。
  東壁中央にアーチ、南壁東端に扉がある。`,
 choices:[
  {label:'→ 東壁のアーチ', fn:()=>fpB3Move('FP_B3N_ROOM2')},
  {label:'↓ 南壁の扉', fn:()=>fpB3Move('FP_B3N_ROOM4')},
 ],
 },

 FP_B3N_ROOM2:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">B3北 — 部屋</span><br><br>
  直径45mの大きな円形の部屋。天井も丸く削られており、音が独特の反響をする。
  北壁東端から15mに扉、西壁北端から15mにアーチがある。`,
 choices:[
  {label:'↑ 北壁の扉', fn:()=>fpB3Move('FP_B3N_ROOM3')},
  {label:'← 西壁のアーチ', fn:()=>fpB3Move('FP_B3N_ROOM1')},
 ],
 },

 FP_B3N_ROOM3:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">B3北 — 部屋</span><br><br>
  40m四方の部屋。天井に星図のような模様が刻まれているが、この深さで天体観測などできるはずもなく
  その意味は分からない。北壁東端から15mに扉、南壁東端から15mに扉がある。`,
 choices:[
  {label:'↑ 北壁の扉', fn:()=>fpB3Move('FP_B3N_P6')},
  {label:'↓ 南壁の扉', fn:()=>fpB3Move('FP_B3N_ROOM2')},
 ],
 },

 FP_B3N_ROOM4:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">B3北 — 部屋</span><br><br>
  35m四方の部屋。四方の壁に彫刻が施されており、山岳と人物が描かれた連作になっている。
  北壁東端に扉、東壁中央に扉、東壁南端に扉がある。`,
 choices:[
  {label:'↑ 北壁の扉', fn:()=>fpB3Move('FP_B3N_ROOM1')},
  {label:'→ 東壁・中央の扉', fn:()=>fpB3Move('FP_B3N_P7')},
  {label:'↘ 東壁・南端の扉', fn:()=>fpB3Move('FP_B3N_P9')},
 ],
 },

 FP_B3N_ROOM5:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">B3北 — 部屋</span><br><br>
  15m四方の小部屋。部屋の中央に石製のレバーが据えられている。
  ${PC._fp_b3_lever?'レバーはすでに引かれた状態になっている。':'レバーは上を向いており、まだ引かれていない。'}
  北壁中央に扉がある。`,
 choices:()=>{
  const ch = [];
  if(!PC._fp_b3_lever){
   ch.push({label:' レバーを引く', fn:()=>{
    PC._fp_b3_lever = true;
    showSaveToast(' 重いレバーを引いた。遠くで何かが動く音がした。');
    go('FP_B3N_ROOM5');
   }});
  }
  ch.push({label:'↑ 北壁の扉', fn:()=>fpB3Move('FP_B3N_P5')});
  return ch;
 },
 },


 // ── ザールカノンの墓所 B1（新構造）──────────────────────────
 RUIN_P1:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">ザールカノンの墓所 — 通路</span><br><br>
  東西10mの通路。東端北側に地上への上り階段がある。西端はT字路に続く。
  石材の継ぎ目から草が伸びており、長年放置されてきたことが分かる。`,
 choices:[
  {label:'→ 東端・地上へ', go:'RUIN_ENTRANCE'},
  {label:'← 西端・T字路', fn:()=>ruinMove('RUIN_TJUNC1')},
 ],
 },

 RUIN_TJUNC1:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">ザールカノンの墓所 — T字路</span><br><br>
  東西に延びる通路から北へ延びる通路が分岐するT字路。
  床に古い魔法陣の残骸があり、かつて結界が張られていたことを示す。`,
 choices:[
  {label:'→ 東', fn:()=>ruinMove('RUIN_P1')},
  {label:'↑ 北', fn:()=>ruinMove('RUIN_P4')},
  {label:'← 西', fn:()=>ruinMove('RUIN_P2')},
 ],
 },

 RUIN_P2:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">ザールカノンの墓所 — 通路</span><br><br>
  東西35mの通路。東はT字路へ。西へは暗くなっており先が見えない。`,
 choices:[
  {label:'→ 東・T字路', fn:()=>ruinMove('RUIN_TJUNC1')},
  {label:'← 西（暗闇の先へ）', fn:()=>ruinMove('RUIN_P3')},
 ],
 },

 RUIN_P3:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">ザールカノンの墓所 — 通路</span><br><br>
  東西35mの通路。東へは暗くなっており先が見えない。西端は行き止まりで、北の壁に扉がある。`,
 choices:[
  {label:'→ 東（暗闇の先へ）', fn:()=>ruinMove('RUIN_P2')},
  {label:'↑ 西端・北壁の扉', fn:()=>ruinMove('RUIN_ROOM4')},
 ],
 },

 RUIN_P4:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">ザールカノンの墓所 — 通路</span><br><br>
  南北10mの通路。南はT字路へ。北は西へ折れて別の通路へ続く。`,
 choices:[
  {label:'↓ 南・T字路', fn:()=>ruinMove('RUIN_TJUNC1')},
  {label:'↖ 北端・西へ', fn:()=>ruinMove('RUIN_P5')},
 ],
 },

 RUIN_P5:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">ザールカノンの墓所 — 通路</span><br><br>
  東西15mの通路。東端は南へ折れて別の通路へ。西端は行き止まりで、部屋への扉がある。`,
 choices:[
  {label:'↘ 東端・南へ', fn:()=>ruinMove('RUIN_P4')},
  {label:'← 西端の扉', fn:()=>ruinMove('RUIN_ROOM9')},
 ],
 },

 RUIN_P6:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">ザールカノンの墓所 — 通路</span><br><br>
  南北25mの通路。南端は行き止まりで東壁にアーチがある。北は東へ折れて別の通路へ続く。`,
 choices:[
  {label:'→ 南端・東壁の扉', fn:()=>ruinMove('RUIN_ROOM9')},
  {label:'↗ 北端・東へ', fn:()=>ruinMove('RUIN_P7')},
 ],
 },

 RUIN_P7:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">ザールカノンの墓所 — 通路</span><br><br>
  東西25mの通路。西端は南へ折れて別の通路へ。東端は部屋への扉で行き止まり。`,
 choices:[
  {label:'↙ 西端・南へ', fn:()=>ruinMove('RUIN_P6')},
  {label:'→ 東端の扉', fn:()=>ruinMove('RUIN_ROOM5')},
 ],
 },

 RUIN_P8:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">ザールカノンの墓所 — 通路</span><br><br>
  東西25mの通路。東端は部屋への扉で行き止まり。西端は行き止まりで北壁に扉がある。`,
 choices:[
  {label:'→ 東端の扉', fn:()=>ruinMove('RUIN_ROOM11')},
  {label:'↑ 西端・北壁の扉', fn:()=>ruinMove('RUIN_ROOM2')},
 ],
 },

 RUIN_P9:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">ザールカノンの墓所 — 通路</span><br><br>
  東西15mの通路。中程の南にB2への階段がある。
  西側に部屋へ通じる落とし格子、東側に部屋へ通じる落とし格子（${PC._ruin_lever?'開放中':'閉鎖中'}）がある。`,
 choices:()=>{
  const ch=[];
  ch.push({label:'↓ 中程・南のB2への階段', fn:()=>{
   document.getElementById('story').innerHTML += '<br><br><span style="color:#e8e0d0"> 階段の入口は天井が崩落しており、瓦礫で塞がれている。通れない。</span>';
   renderChoices([
    {label:'← 西の落とし格子（部屋6）', fn:()=>ruinMove('RUIN_ROOM6')},
    {label:'← 引き返す', fn:()=>ruinMove('RUIN_ROOM6')},
   ]);
  }});
  ch.push({label:'← 西の落とし格子', fn:()=>ruinMove('RUIN_ROOM6')});
  if(PC._ruin_lever){
   ch.push({label:'→ 東の落とし格子', fn:()=>ruinMove('RUIN_ROOM8')});
  } else {
   ch.push({label:'→ 東の落とし格子（閉鎖中）', fn:()=>{
    document.getElementById('story').innerHTML+='<br><br><span style="color:#e8e0d0"> 格子は固く閉じている。</span>';
    renderChoices([{label:'← 引き返す', fn:()=>ruinMove('RUIN_ROOM6')}]);
   }});
  }
  return ch;
 },
 },

 RUIN_P10:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">ザールカノンの墓所 — 通路</span><br><br>
  南北15mの通路。北端は部屋へのアーチ。南端は東へ折れて別の通路へ続く。`,
 choices:[
  {label:'↑ 北端のアーチ', fn:()=>ruinMove('RUIN_ROOM6')},
  {label:'↘ 南端・東へ', fn:()=>ruinMove('RUIN_P11')},
 ],
 },

 RUIN_P11:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">ザールカノンの墓所 — 通路</span><br><br>
  東西35mの通路。西端は北へ折れて別の通路へ。東端は南へ折れて別の通路へ続く。`,
 choices:[
  {label:'↖ 西端・北へ', fn:()=>ruinMove('RUIN_P10')},
  {label:'↘ 東端・南へ', fn:()=>ruinMove('RUIN_P12')},
 ],
 },

 RUIN_P12:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">ザールカノンの墓所 — 通路</span><br><br>
  南北25mの通路。北端は西へ折れて別の通路へ。南端は東へ折れて別の通路へ続く。`,
 choices:[
  {label:'↖ 北端・西へ', fn:()=>ruinMove('RUIN_P11')},
  {label:'↘ 南端・東へ', fn:()=>ruinMove('RUIN_P13')},
 ],
 },

 RUIN_P13:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">ザールカノンの墓所 — 通路</span><br><br>
  東西25mの通路。西端は北へ折れて別の通路へ。東端はT字路へ続く。`,
 choices:[
  {label:'↖ 西端・北へ', fn:()=>ruinMove('RUIN_P12')},
  {label:'→ 東端・T字路', fn:()=>ruinMove('RUIN_TJUNC2')},
 ],
 },

 RUIN_TJUNC2:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">ザールカノンの墓所 — T字路</span><br><br>
  東西に延びる通路から北へ通路が分岐するT字路。壁に古い蝋燭の台座が残っている。`,
 choices:[
  {label:'← 西', fn:()=>ruinMove('RUIN_P13')},
  {label:'→ 東', fn:()=>ruinMove('RUIN_P14')},
  {label:'↑ 北', fn:()=>ruinMove('RUIN_P16')},
 ],
 },

 RUIN_P14:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">ザールカノンの墓所 — 通路</span><br><br>
  東西20mの通路。西はT字路へ。東端は北へ折れて別の通路へ続く。`,
 choices:[
  {label:'← 西・T字路', fn:()=>ruinMove('RUIN_TJUNC2')},
  {label:'↗ 東端・北へ', fn:()=>ruinMove('RUIN_P15')},
 ],
 },

 RUIN_P15:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">ザールカノンの墓所 — 通路</span><br><br>
  南北25mの通路。南端は西へ折れて別の通路へ。北端は行き止まりで、北壁に扉がある。`,
 choices:[
  {label:'↙ 南端・西へ', fn:()=>ruinMove('RUIN_P14')},
  {label:'↑ 北端の扉', fn:()=>ruinMove('RUIN_ROOM3')},
 ],
 },

 RUIN_P16:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">ザールカノンの墓所 — 通路</span><br><br>
  南北40mの通路。南はT字路へ。北へは暗くなっており先が見えない。`,
 choices:[
  {label:'↓ 南・T字路', fn:()=>ruinMove('RUIN_TJUNC2')},
  {label:'↑ 北（暗闇の先へ）', fn:()=>ruinMove('RUIN_P17')},
 ],
 },

 RUIN_P17:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">ザールカノンの墓所 — 通路</span><br><br>
  南北40mの通路。南北ともに暗くて先が見えない。`,
 choices:[
  {label:'↓ 南（暗闇の先へ）', fn:()=>ruinMove('RUIN_P16')},
  {label:'↑ 北（暗闇の先へ）', fn:()=>ruinMove('RUIN_P18')},
 ],
 },

 RUIN_P18:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">ザールカノンの墓所 — 通路</span><br><br>
  南北40mの通路。南へは暗くなっており先が見えない。北はT字路へ続く。`,
 choices:[
  {label:'↓ 南（暗闇の先へ）', fn:()=>ruinMove('RUIN_P17')},
  {label:'↑ 北・T字路', fn:()=>ruinMove('RUIN_TJUNC3')},
 ],
 },

 RUIN_TJUNC3:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">ザールカノンの墓所 — T字路</span><br><br>
  南北に走る通路から西へ通路が分岐するT字路。壁に「深域への警告」と読める古い碑文がある。`,
 choices:[
  {label:'↓ 南', fn:()=>ruinMove('RUIN_P18')},
  {label:'↑ 北', fn:()=>ruinMove('RUIN_P19')},
  {label:'← 西', fn:()=>ruinMove('RUIN_P22')},
 ],
 },

 RUIN_P19:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">ザールカノンの墓所 — 通路</span><br><br>
  南北40mの通路。南はT字路へ。北端は東へ折れて別の通路へ続く。`,
 choices:[
  {label:'↓ 南・T字路', fn:()=>ruinMove('RUIN_TJUNC3')},
  {label:'↗ 北端・東へ', fn:()=>ruinMove('RUIN_P20')},
 ],
 },

 RUIN_P20:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">ザールカノンの墓所 — 通路</span><br><br>
  東西25mの通路。西端は南へ折れて別の通路へ。東端も南へ折れて別の通路へ続く。`,
 choices:[
  {label:'↙ 西端・南へ', fn:()=>ruinMove('RUIN_P19')},
  {label:'↘ 東端・南へ', fn:()=>ruinMove('RUIN_P21')},
 ],
 },

 RUIN_P21:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">ザールカノンの墓所 — 通路</span><br><br>
  南北25mの通路。北端は西へ折れて別の通路へ。南端は行き止まりで南壁に扉がある。`,
 choices:[
  {label:'↖ 北端・西へ', fn:()=>ruinMove('RUIN_P20')},
  {label:'↓ 南端の扉', fn:()=>ruinMove('RUIN_ROOM1')},
 ],
 },

 RUIN_P22:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">ザールカノンの墓所 — 通路</span><br><br>
  東西10mの短い通路。東はT字路へ。西端は行き止まりで、西壁に扉がある。`,
 choices:[
  {label:'→ 東・T字路', fn:()=>ruinMove('RUIN_TJUNC3')},
  {label:'← 西端の扉', fn:()=>ruinMove('RUIN_ROOM10')},
 ],
 },

 RUIN_ROOM1:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">ザールカノンの墓所 — 部屋</span><br><br>
  15m四方の部屋。部屋の真ん中に古い機械仕掛けのレバーがある。
  ${PC._ruin_lever?'レバーはすでに引かれた状態になっている。':'このレバーが何を制御しているかは定かでない。'}
  北の壁中央に扉がある。`,
 choices:()=>{
  const ch=[];
  if(!PC._ruin_lever){
   ch.push({label:' レバーを引く', fn:()=>{
    PC._ruin_lever=true;
    showSaveToast(' レバーを引いた。どこかで音がした。');
    go('RUIN_ROOM1');
   }});
  }
  ch.push({label:'↑ 北壁の扉', fn:()=>ruinMove('RUIN_P21')});
  return ch;
 },
 },

 RUIN_ROOM2:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">ザールカノンの墓所 — 部屋</span><br><br>
  15m四方の部屋。壁に古代の記号が刻まれている。南壁中央に扉がある。`,
 choices:[
  {label:'↓ 南壁の扉', fn:()=>ruinMove('RUIN_P8')},
 ],
 },

 RUIN_ROOM3:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">ザールカノンの墓所 — 部屋</span><br><br>
  15m四方の部屋。中央に大きな巻き上げ機がある。
  ${(PC._ruin_winch_count||0)>0?`${PC._ruin_winch_count}回操作済み（残り${3-PC._ruin_winch_count}回）。`:'何に役立つのか分からないが、頑丈な造りの巻き上げ機だ。'}
  南の壁中央に扉がある。`,
 choices:()=>{
  const ch=[];
  if((PC._ruin_winch_count||0)<3){
   ch.push({label:' 巻き上げ機を操作する（強さ Lv3 能力値テスト）', fn:()=>{
    setupSavingRoll({attr:'st', level:3,
     passTxt:`渾身の力で巻き上げた！（${(PC._ruin_winch_count||0)+1}/3回成功）`,
     failTxt:'機械は動かなかった。腕が痺れた。',
     onSuccess(){
      PC._ruin_winch_count=(PC._ruin_winch_count||0)+1;
      if(PC._ruin_winch_count>=3){ PC._ruin_portcullis=true; showSaveToast(' 遠くで格子が開く音がした！'); }
      renderChoices([{label:'↓ 南壁の扉', fn:()=>ruinMove('RUIN_P15')},{label:' もう一度操作する', fn:()=>go('RUIN_ROOM3')}]);
     },
     onFail(){ renderChoices([{label:'↓ 南壁の扉', fn:()=>ruinMove('RUIN_P15')},{label:' もう一度試みる', fn:()=>go('RUIN_ROOM3')}]); },
    });
   }});
  }
  ch.push({label:'↓ 南壁の扉', fn:()=>ruinMove('RUIN_P15')});
  return ch;
 },
 },

 RUIN_ROOM4:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">ザールカノンの墓所 — 部屋</span><br><br>
  15m四方の部屋。壁の装飾が他の部屋より丁寧で、かつて重要な用途があったらしい。南壁西端に扉がある。`,
 choices:[
  {label:'↓ 南壁の扉', fn:()=>ruinMove('RUIN_P3')},
 ],
 },

 RUIN_ROOM5:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">ザールカノンの墓所 — 部屋</span><br><br>
  45m四方の広い部屋。墓所の中心的な空間らしく、四方に様々な出口がある。
  西壁の北端にルーン文字の刻まれた扉、西壁の中央に扉、西壁の南端に鉄で補強された扉。南壁の中央にアーチ、東壁の北端にアーチがある。`,
 choices:[
  {label:'↖ 西壁・北端の扉', fn:()=>ruinMove('RUIN_ROOM11')},
  {label:'← 西壁・中央の扉', fn:()=>ruinMove('RUIN_P7')},
  {label:'↙ 西壁・南端の扉', fn:()=>ruinMove('RUIN_ROOM9')},
  {label:'↓ 南壁・中央のアーチ', fn:()=>ruinMove('RUIN_ROOM6')},
  {label:'↗ 東壁・北端のアーチ', fn:()=>ruinMove('RUIN_ROOM10')},
 ],
 },

 RUIN_ROOM6:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">ザールカノンの墓所 — 部屋</span><br><br>
  南北15m、東西25mの部屋。北壁西端に部屋へのアーチ、南壁東端に通路へのアーチがある。
  東壁南端に落とし格子（${PC._ruin_portcullis?'開いている':'固く閉じている'}）がある。`,
 choices:()=>{
  const ch=[
   {label:'↑ 北壁のアーチ', fn:()=>ruinMove('RUIN_ROOM5')},
   {label:'↓ 南壁のアーチ', fn:()=>ruinMove('RUIN_P10')},
  ];
  if(PC._ruin_portcullis){
   ch.push({label:'→ 東壁の落とし格子', fn:()=>ruinMove('RUIN_P9')});
  } else {
   ch.push({label:'→ 東壁の落とし格子（閉鎖中）', fn:()=>{
    document.getElementById('story').innerHTML+='<br><br><span style="color:#e8e0d0"> 格子は固く閉じており、開く気配がない。</span>';
    renderChoices([{label:'← 引き返す', fn:()=>ruinMove('RUIN_ROOM5')}]);
   }});
  }
  return ch;
 },
 },

 RUIN_ROOM7:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">ザールカノンの墓所 — 隔離室</span><br><br>
  出入り口のない南北15m、東西25mの部屋。${PC._ruin_boss_cleared?'番人を倒した後の静かな部屋。北壁にボタンがある。':'部屋8のボタンで転送されてここに来た。怒り狂ったバルログが行く手を塞いでいる。'}`,
 choices:()=>{
  const ch=[];
  if(!PC._ruin_boss_cleared){
   ch.push({label:' バルログと戦う', fn:()=>{
    document.getElementById('story').innerHTML+='<br><br><span style="color:#f0ddd8"> バルログが咆哮した！炎と影が部屋を満たす！</span>';
    renderChoices([{label:' 身構える', fn:()=>{
     renderChoices([]);
     drawScene('combat');
     startCombat({
      enemies:[{name:'バルログ',mr:300,curMR:300,armor:6}],
      canFlee:false, win:'__noop__', lose:'DEAD',
      onWin(){
       PC._ruin_boss_cleared=true;
       let totalGP=0, jewels=[];
       for(let i=0;i<30;i++){
        let r=''; let att=0;
        do { r=generateTreasure(100); att++; }
        while(att<5&&(r.includes('CP（')||r.includes('SP（')));
        const gpM=r.match(/(\d+)GP/); if(gpM) totalGP+=parseInt(gpM[1]);
        const jM=r.match(/宝石[^（]*（([^）]+)）/); if(jM) jewels.push(jM[1]);
       }
       let lootStr=`金貨 ${totalGP}GP`;
       if(jewels.length) lootStr+=`、宝石類×${jewels.length}個（${jewels.slice(0,5).join('・')}${jewels.length>5?'など':''}）`;
       PC._ruin_room7_loot=lootStr;
       addLifeEvent('','バルログを倒し、宝物庫の財宝を手に入れた。');
       document.getElementById('cbt-area').classList.add('hidden');
       document.getElementById('scroll-area').classList.remove('in-combat');
       document.getElementById('text-win').style.display='';
       cbtState=null;
       showSaveToast(' バルログを倒した！');
       go('RUIN_ROOM7');
      },
     });
    }}]);
   }});
  } else {
   if(PC._ruin_room7_loot){
    ch.push({label:' 財宝を受け取る', fn:()=>{
     document.getElementById('story').innerHTML+=`<br><br><span style="color:#f0ece0"> 宝物庫の財宝：${PC._ruin_room7_loot}</span>`;
     PC._ruin_room7_loot='';
     updateHUD();
     renderChoices([{label:'↑ 北壁のボタンを押す', fn:()=>go('RUIN_ROOM5')}]);
    }});
   }
   ch.push({label:'↑ 北壁のボタンを押す（部屋5へテレポート）', fn:()=>go('RUIN_ROOM5')});
  }
  return ch;
 },
 },

 RUIN_ROOM8:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">ザールカノンの墓所 — 部屋</span><br><br>
  南北35m、東西15mの部屋。西壁南端に落とし格子がある。
  北壁に「注意せよ」と刻まれたボタンがある。`,
 choices:[
  {label:'← 西壁の落とし格子', fn:()=>ruinMove('RUIN_P9')},
  {label:'↑ 北壁のボタンを押す', fn:()=>{
   const s=document.getElementById('story');
   s.innerHTML+='<br><br><span style="color:#e8e0d8"> 部屋が激しく明滅し始めた——気づくと全員が別の場所に立っていた。</span>';
   renderChoices([{label:'▶ 目を開く', fn:()=>go('RUIN_ROOM7')}]);
  }},
 ],
 },

 RUIN_ROOM9:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">ザールカノンの墓所 — 部屋</span><br><br>
  南北35m、東西15mの部屋。東壁の南端に扉、東壁の北端に鉄で補強された扉、西壁の北端にアーチがある。`,
 choices:[
  {label:'↘ 東壁・南端の扉', fn:()=>ruinMove('RUIN_P4')},
  {label:'↗ 東壁・北端の扉', fn:()=>ruinMove('RUIN_ROOM5')},
  {label:'↖ 西壁・北端のアーチ', fn:()=>ruinMove('RUIN_P6')},
 ],
 },

 RUIN_ROOM10:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">ザールカノンの墓所 — 部屋</span><br><br>
  南北35m、東西25mの部屋。東壁北端に扉、西壁の南端に部屋へのアーチがある。`,
 choices:[
  {label:'→ 東壁の扉', fn:()=>ruinMove('RUIN_P22')},
  {label:'↙ 西壁・南端のアーチ', fn:()=>ruinMove('RUIN_ROOM5')},
 ],
 },

 RUIN_ROOM11:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">ザールカノンの墓所 — 部屋</span><br><br>
  南北35m、東西15mの部屋。東壁の南端にルーン文字の刻まれた扉、西壁の中央に扉がある。`,
 choices:[
  {label:'↘ 東壁・南端の扉', fn:()=>ruinMove('RUIN_ROOM5')},
  {label:'← 西壁・中央の扉', fn:()=>ruinMove('RUIN_P8')},
 ],
 },

// ══════════════════════════════════════════
// 打ち捨てられた坑道（テーマ付き巣窟ダンジョン／半年周期で住人が入れ替わる）
// ══════════════════════════════════════════
 LAIR_FRONT:{
 scene:'dungeon',
 txt:()=>{
  const lair = PC._lairDungeon;
  const flavor = (lair && lair.themeId)
   ? _lairScenarioAwareTheme(lair.themeId).entryFlavor
   : '坑道の入口はひっそりと静まり返っており、これといった気配は感じられない。';
  return `<span style="color:#f0ece0">打ち捨てられた坑道 ── 入口前</span><br><br>
  街道の途切れた先、山肌にぽっかりと口を開けた坑道の入口が見える。${flavor}`;
 },
 choices:()=>[
  {label:'→ 坑道の中へ入る', fn:()=>enterLairDungeon()},
  {label:'↑ ポートアルゴンへ戻る（3日）', fn:()=>startLairReturnJourney()},
 ],
 },

 PORT_ARGON_ISLAND:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">隆起した島</span><br><br>
  地震によって海底から隆起したばかりの、切り立った岩肌が剥き出しの小島。まだ誰の手も入っていないようで、目立った建造物や道らしきものは見当たらない。<br>
  今はまだ、ただの岩と土の塊にすぎないようだ。`,
 choices:()=>[
  {label:'↑ ポートアルゴンへ戻る（船で3日）', fn:()=>startPortArgonIslandReturnJourney()},
 ],
 },

 LAIR_ENTRANCE:{
 scene:'dungeon',
 area:1,
 txt:()=>`<span style="color:#f0ece0">打ち捨てられた坑道</span><br><br>
  地上から南に延びる、10mほどの下り階段。降りきると、南北25mの通路の北端に出る。<br>
  南端は行き止まりになっており、南壁に扉がある。${PC._lairDoorOpen_LAIR_ROOM2?'<span style="color:#e8e4d8">扉は開いている。</span>':'扉には鍵がかかっている。'}`,
 choices:()=>{
  const ch = [];
  if(PC._lairDoorOpen_LAIR_ROOM2) ch.push({label:'↓ 南の扉へ', fn:()=>go('LAIR_ROOM2')});
  else ch.push({label:'↓ 南の扉（施錠されている）を調べる', fn:()=>lairTryDoor({level:1, dest:'LAIR_ROOM2', from:'LAIR_ENTRANCE'})});
  ch.push({label:'↑ 入口前へ戻る', fn:()=>go('LAIR_FRONT')});
  return ch;
 },
 },

 LAIR_ROOM2:{
 scene:'dungeon',
 area:1,
 txt:()=>{
  const base = `<span style="color:#f0ece0">打ち捨てられた坑道</span><br><br>
  25m四方の部屋。北壁西端に通路への扉、南壁西端には${PC._lairRoom2SecretFound?'隠し扉があるのが分かる':'それらしきものは特に見当たらない'}。`;
  return base + lairRoomStatusText('LAIR_ROOM2');
 },
 choices:()=>{
  const ns = PC._lairDungeon.nodeState.LAIR_ROOM2;
  if(PC._lairDungeon.themeId && !ns.defeated) return [{label:_lairEncounterLabel(ns), fn:()=>startLairEncounter('LAIR_ROOM2')}];
  const ch = [{label:'↑ 北の扉へ（入口）', fn:()=>go('LAIR_ENTRANCE')}];
  if(PC._lairRoom2SecretFound){
   ch.push({label:'↓ 南の隠し扉へ', fn:()=>go('LAIR_PASSAGE2')});
  } else {
   ch.push({label:' 部屋の中を調べる（運Lv1能力値テスト）', fn:()=>{
    setupSavingRoll({
     attr:'lk', level:1,
     onSuccess(){
      PC._lairRoom2SecretFound = true;
      const s=document.getElementById('story');
      s.innerHTML += `<br><span style="color:#f0ece0">南壁の石組みに、わずかな隙間を見つけた。押すと、隠し扉が現れた！</span>`;
      renderChoices([{label:'▶ OK', fn:()=>go('LAIR_ROOM2')}]);
     },
     onFail(){
      const s=document.getElementById('story');
      s.innerHTML += `<br><span style="color:#c8b8a0">特に何も見つからなかった。</span>`;
      renderChoices([{label:'▶ OK', fn:()=>go('LAIR_ROOM2')}]);
     },
    });
   }});
  }
  return ch;
 },
 },

 LAIR_PASSAGE2:{
 scene:'dungeon',
 area:1,
 txt:()=>`<span style="color:#f0ece0">打ち捨てられた坑道</span><br><br>
  南北25mの通路。北端は部屋への扉、南端は東に折れて別の通路へつながっている。`,
 choices:[
  {label:'↑ 北の扉へ', fn:()=>go('LAIR_ROOM2')},
  {label:'↘ 南→東へ', fn:()=>go('LAIR_PASSAGE3')},
 ],
 },

 LAIR_PASSAGE3:{
 scene:'dungeon',
 area:1,
 txt:()=>`<span style="color:#f0ece0">打ち捨てられた坑道</span><br><br>
  東西25mの通路。西端は北に折れ、東端も北に折れて、それぞれ別の通路へつながっている。`,
 choices:[
  {label:'↖ 西→北へ', fn:()=>go('LAIR_PASSAGE2')},
  {label:'↗ 東→北へ', fn:()=>go('LAIR_PASSAGE4')},
 ],
 },

 LAIR_PASSAGE4:{
 scene:'dungeon',
 area:1,
 txt:()=>`<span style="color:#f0ece0">打ち捨てられた坑道</span><br><br>
  南北25mの通路。南端は西に折れ、北端は東に折れて、それぞれ別の通路へつながっている。`,
 choices:[
  {label:'↙ 南→西へ', fn:()=>go('LAIR_PASSAGE3')},
  {label:'↗ 北→東へ', fn:()=>go('LAIR_PASSAGE5')},
 ],
 },

 LAIR_PASSAGE5:{
 scene:'dungeon',
 area:1,
 txt:()=>`<span style="color:#f0ece0">打ち捨てられた坑道</span><br><br>
  東西35mの通路。西端は南に折れて別の通路へつながっている。東端の先は暗くなっていて見通せない。<br>
  西端から25mほどの南壁に扉がある。${PC._lairDoorOpen_LAIR_ROOM1?'<span style="color:#e8e4d8">扉は開いている。</span>':'扉には鍵がかかっている。'}`,
 choices:()=>{
  const ch = [
   {label:'↙ 西→南へ', fn:()=>go('LAIR_PASSAGE4')},
   {label:'→ 東の暗がりへ', fn:()=>go('LAIR_PASSAGE6')},
  ];
  if(PC._lairDoorOpen_LAIR_ROOM1) ch.push({label:'↓ 南の扉へ', fn:()=>go('LAIR_ROOM1')});
  else ch.push({label:'↓ 南の扉（施錠されている）を調べる', fn:()=>lairTryDoor({level:1, dest:'LAIR_ROOM1', from:'LAIR_PASSAGE5'})});
  return ch;
 },
 },

 LAIR_ROOM1:{
 scene:'dungeon',
 area:1,
 txt:()=>`<span style="color:#f0ece0">打ち捨てられた坑道</span><br><br>
  15m四方の部屋。北壁東端に扉がある。` + lairRoomStatusText('LAIR_ROOM1'),
 choices:()=>{
  const ns = PC._lairDungeon.nodeState.LAIR_ROOM1;
  if(PC._lairDungeon.themeId && !ns.defeated) return [{label:_lairEncounterLabel(ns), fn:()=>startLairEncounter('LAIR_ROOM1')}];
  return [{label:'↑ 北の扉へ', fn:()=>go('LAIR_PASSAGE5')}];
 },
 },

 LAIR_PASSAGE6:{
 scene:'dungeon',
 area:2,
 txt:()=>`<span style="color:#f0ece0">打ち捨てられた坑道</span><br><br>
  東西40mの通路。西端の先は暗くなっていて見通せない。東端は北に折れて別の通路へつながっている。<br>
  東端から25mほどの南壁に扉がある。`,
 choices:[
  {label:'← 西の暗がりへ', fn:()=>go('LAIR_PASSAGE5')},
  {label:'↗ 東→北へ', fn:()=>go('LAIR_PASSAGE7')},
  {label:'↓ 南の扉へ', fn:()=>go('LAIR_ROOM6')},
 ],
 },

 LAIR_ROOM6:{
 scene:'dungeon',
 area:2,
 txt:()=>`<span style="color:#f0ece0">打ち捨てられた坑道</span><br><br>
  15m四方の部屋。北壁東端に扉がある。` + lairRoomStatusText('LAIR_ROOM6'),
 choices:()=>{
  const ns = PC._lairDungeon.nodeState.LAIR_ROOM6;
  if(PC._lairDungeon.themeId && !ns.defeated) return [{label:_lairEncounterLabel(ns), fn:()=>startLairEncounter('LAIR_ROOM6')}];
  return [{label:'↑ 北の扉へ', fn:()=>go('LAIR_PASSAGE6')}];
 },
 },

 LAIR_PASSAGE7:{
 scene:'dungeon',
 area:2,
 txt:()=>`<span style="color:#f0ece0">打ち捨てられた坑道</span><br><br>
  南北15mの通路。南端は西へ折れて別の通路へつながっている。北端は行き止まりで、北壁に扉がある。`,
 choices:[
  {label:'↙ 南→西へ', fn:()=>go('LAIR_PASSAGE6')},
  {label:'↑ 北の扉へ', fn:()=>go('LAIR_ROOM4')},
 ],
 },

 LAIR_ROOM4:{
 scene:'dungeon',
 area:2,
 txt:()=>`<span style="color:#f0ece0">打ち捨てられた坑道</span><br><br>
  15m四方の部屋。南壁東端に扉、西壁南端に扉、北壁西端にアーチがある。北のアーチの床には注意が必要そうだ。` + lairRoomStatusText('LAIR_ROOM4'),
 choices:()=>{
  const ns = PC._lairDungeon.nodeState.LAIR_ROOM4;
  if(PC._lairDungeon.themeId && !ns.defeated) return [{label:_lairEncounterLabel(ns), fn:()=>startLairEncounter('LAIR_ROOM4')}];
  return [
   {label:'↓ 南の扉へ', fn:()=>go('LAIR_PASSAGE7')},
   {label:'← 西の扉へ', fn:()=>go('LAIR_PASSAGE8')},
   {label:'↖ 北のアーチへ', fn:()=>lairPitTrap('LAIR_PASSAGE9')},
  ];
 },
 },

 LAIR_PASSAGE8:{
 scene:'dungeon',
 area:2,
 txt:()=>`<span style="color:#f0ece0">打ち捨てられた坑道</span><br><br>
  南北25mの通路。南端は行き止まりで、東壁に扉がある。北端は東に折れて別の通路へつながっている。`,
 choices:[
  {label:'↓ 南の扉へ', fn:()=>go('LAIR_ROOM4')},
  {label:'↗ 北→東へ', fn:()=>go('LAIR_PASSAGE9')},
 ],
 },

 LAIR_PASSAGE9:{
 scene:'dungeon',
 area:2,
 txt:()=>`<span style="color:#f0ece0">打ち捨てられた坑道</span><br><br>
  東西25mの通路。西端は南に折れて別の通路へつながっている。東端は行き止まりで、北壁に扉がある。<br>
  通路の中程、南壁にアーチがある。足元に注意が必要そうだ。`,
 choices:[
  {label:'↙ 西→南へ', fn:()=>go('LAIR_PASSAGE8')},
  {label:'↓ 南のアーチへ', fn:()=>lairPitTrap('LAIR_ROOM4')},
  {label:'→ 東の扉へ', fn:()=>go('LAIR_ROOM5')},
 ],
 },

 LAIR_ROOM5:{
 scene:'dungeon',
 area:3,
 txt:()=>{
  const base = `<span style="color:#f0ece0">打ち捨てられた坑道</span><br><br>
  25m四方の部屋。南壁東端に扉、西壁南端に扉がある。${PC._lairDoorOpen_LAIR_PASSAGE10?'<span style="color:#e8e4d8">西の扉は開いている。</span>':'西の扉には鍵がかかっている。'}`;
  return base + lairRoomStatusText('LAIR_ROOM5');
 },
 choices:()=>{
  const ns = PC._lairDungeon.nodeState.LAIR_ROOM5;
  if(PC._lairDungeon.themeId && !ns.defeated) return [{label:_lairEncounterLabel(ns), fn:()=>startLairEncounter('LAIR_ROOM5')}];
  const ch = [{label:'↓ 南の扉へ', fn:()=>go('LAIR_PASSAGE9')}];
  if(PC._lairDoorOpen_LAIR_PASSAGE10) ch.push({label:'← 西の扉へ', fn:()=>go('LAIR_PASSAGE10')});
  else ch.push({label:'← 西の扉（施錠されている）を調べる', fn:()=>lairTryDoor({level:3, dest:'LAIR_PASSAGE10', from:'LAIR_ROOM5'})});
  return ch;
 },
 },

 LAIR_PASSAGE10:{
 scene:'dungeon',
 area:3,
 txt:()=>`<span style="color:#f0ece0">打ち捨てられた坑道</span><br><br>
  東西35mの通路。東端は行き止まりで、東壁に扉がある。西端も行き止まりで、北壁にアーチがある。`,
 choices:[
  {label:'→ 東の扉へ', fn:()=>go('LAIR_ROOM5')},
  {label:'↑ 北のアーチへ', fn:()=>go('LAIR_ROOM3')},
 ],
 },

 LAIR_ROOM3:{
 scene:'dungeon',
 area:3,
 txt:()=>`<span style="color:#f0ece0">打ち捨てられた坑道</span><br><br>
  南北15m、東西35mの部屋。南壁のアーチから続いている。` + lairRoomStatusText('LAIR_ROOM3'),
 choices:()=>{
  const ns = PC._lairDungeon.nodeState.LAIR_ROOM3;
  if(PC._lairDungeon.themeId && !ns.defeated) return [{label:_lairEncounterLabel(ns), fn:()=>startLairEncounter('LAIR_ROOM3')}];
  return [{label:'↓ 南のアーチへ', fn:()=>go('LAIR_PASSAGE10')}];
 },
 },

// ══════════════════════════════════════════
// 第2の固定ダンジョン「名もなき遺構」（ヴェルダ村から4日）
// ══════════════════════════════════════════
 LAIR2_FRONT:{
 scene:'dungeon',
 txt:()=>{
  const lair = PC._lair2Dungeon;
  const flavor = (lair && lair.themeId)
   ? _lairScenarioAwareTheme(lair.themeId).entryFlavor
   : 'あたりは静まり返っており、これといった気配は感じられない。';
  return `<span style="color:#f0ece0">${LAIR2_NAME} ── 入口前</span><br><br>
  ヴェルダ村から続く道の果て、崩れかけた遺構の入口が口を開けている。${flavor}${PC._lair2AltEntranceFound?'<br>少し離れた場所に朽ちた廃屋も見える。地下へ続く階段があるようだ。':''}`;
 },
 choices:()=>{
  const ch = [
   {label:'→ 遺構の入口から中へ入る', fn:()=>{ initTorch(); go('LAIR2_ROOM_1A'); }},
  ];
  if(PC._lair2AltEntranceFound){
   ch.push({label:'→ 廃屋の階段から中へ入る', fn:()=>{ initTorch(); go('LAIR2_PASSAGE_1N'); }});
  }
  ch.push({label:'↑ ヴェルダ村へ戻る（4日）', fn:()=>startLair2ReturnJourney()});
  return ch;
 },
 },

 LAIR2_ROOM_1A:{
 scene:'dungeon',
 area:1,
 txt:()=>`<span style="color:#f0ece0">${LAIR2_NAME}</span><br><br>
  南北15m、東西25mの部屋。南壁の東端に開口部があり、地上へと続く階段が見える。西壁中央には扉がある。` + lair2RoomStatusText('LAIR2_ROOM_1A'),
 choices:()=>{
  const ns = PC._lair2Dungeon.nodeState.LAIR2_ROOM_1A;
  if(PC._lair2Dungeon.themeId && !ns.defeated) return [{label:_lairEncounterLabel(ns), fn:()=>startLair2Encounter('LAIR2_ROOM_1A')}];
  return [
   {label:'← 西の扉へ', fn:()=>go('LAIR2_ROOM_1B')},
   {label:'↓ 地上へ戻る', fn:()=>go('LAIR2_FRONT')},
  ];
 },
 },

 LAIR2_ROOM_1B:{
 scene:'dungeon',
 area:1,
 txt:()=>`<span style="color:#f0ece0">${LAIR2_NAME}</span><br><br>
  25m四方の部屋。東壁南端に部屋への扉、東壁北端に通路への扉がある。` + lair2RoomStatusText('LAIR2_ROOM_1B'),
 choices:()=>{
  const ns = PC._lair2Dungeon.nodeState.LAIR2_ROOM_1B;
  if(PC._lair2Dungeon.themeId && !ns.defeated) return [{label:_lairEncounterLabel(ns), fn:()=>startLair2Encounter('LAIR2_ROOM_1B')}];
  return [
   {label:'↘ 東南の扉へ', fn:()=>go('LAIR2_ROOM_1A')},
   {label:'↗ 東北の扉へ', fn:()=>go('LAIR2_PASSAGE_1C')},
  ];
 },
 },

 LAIR2_PASSAGE_1C:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">${LAIR2_NAME}</span><br><br>
  南北20mの通路。南端の西壁に扉があり、北端は大柱廊へと続いている。`,
 choices:[
  {label:'↓ 南の扉へ', fn:()=>go('LAIR2_ROOM_1B')},
  {label:'↑ 北の大柱廊へ', fn:()=>go('LAIR2_HALL_1D')},
 ],
 },

 LAIR2_HALL_1D:{
 scene:'dungeon',
 area:1,
 txt:()=>`<span style="color:#f0ece0">${LAIR2_NAME}</span><br><br>
  東西50m、幅20m、高さ20mの大柱廊。10m間隔で左右に太い柱が並んでいる。<br>
  南壁の西端から20mのところに、通路へ続く開口部がある。東西どちらも暗く、先の様子は確認できない。` + lair2RoomStatusText('LAIR2_HALL_1D'),
 choices:()=>{
  const ns = PC._lair2Dungeon.nodeState.LAIR2_HALL_1D;
  if(PC._lair2Dungeon.themeId && !ns.defeated) return [{label:_lairEncounterLabel(ns), fn:()=>startLair2Encounter('LAIR2_HALL_1D')}];
  return [
   {label:'↓ 南の開口部へ', fn:()=>go('LAIR2_PASSAGE_1C')},
   {label:'← 西へ', fn:()=>go('LAIR2_HALL_1E')},
   {label:'→ 東へ', fn:()=>go('LAIR2_HALL_1F')},
  ];
 },
 },

 LAIR2_HALL_1E:{
 scene:'dungeon',
 area:1,
 txt:()=>`<span style="color:#f0ece0">${LAIR2_NAME}</span><br><br>
  東西に延びる幅20m、高さ20mの大柱廊。10m間隔で左右に柱が並んでいる。<br>
  20mほど西へ歩くと天井が崩落しており、それ以上先へは進めない。` + lair2RoomStatusText('LAIR2_HALL_1E'),
 choices:()=>{
  const ns = PC._lair2Dungeon.nodeState.LAIR2_HALL_1E;
  if(PC._lair2Dungeon.themeId && !ns.defeated) return [{label:_lairEncounterLabel(ns), fn:()=>startLair2Encounter('LAIR2_HALL_1E')}];
  return [{label:'→ 東へ戻る', fn:()=>go('LAIR2_HALL_1D')}];
 },
 },

 LAIR2_HALL_1F:{
 scene:'dungeon',
 area:1,
 txt:()=>`<span style="color:#f0ece0">${LAIR2_NAME}</span><br><br>
  東西40m、幅20m、高さ20mの大柱廊。10m間隔で左右に柱が並んでいる。<br>
  南側の西端に扉がある。通路の東端はそれ以上進めないが、東端の南壁に開口部があり別の通路へ続いている。西側は暗く、先の様子は確認できない。` + lair2RoomStatusText('LAIR2_HALL_1F'),
 choices:()=>{
  const ns = PC._lair2Dungeon.nodeState.LAIR2_HALL_1F;
  if(PC._lair2Dungeon.themeId && !ns.defeated) return [{label:_lairEncounterLabel(ns), fn:()=>startLair2Encounter('LAIR2_HALL_1F')}];
  return [
   {label:'← 西へ（大柱廊へ）', fn:()=>go('LAIR2_HALL_1D')},
   {label:'↙ 南西の扉へ', fn:()=>go('LAIR2_ROOM_1G')},
   {label:'↘ 東端南壁の開口部へ', fn:()=>go('LAIR2_PASSAGE_1AC')},
  ];
 },
 },

 LAIR2_PASSAGE_1AC:{
 scene:'dungeon',
 area:2,
 txt:()=>`<span style="color:#f0ece0">${LAIR2_NAME}</span><br><br>
  南北10mの通路。北端は大柱廊へ続いている。南端は行き止まりで、壁にレバーが取り付けられている。` + lair2RoomStatusText('LAIR2_PASSAGE_1AC'),
 choices:()=>{
  const ns = PC._lair2Dungeon.nodeState.LAIR2_PASSAGE_1AC;
  if(PC._lair2Dungeon.themeId && !ns.defeated) return [{label:_lairEncounterLabel(ns), fn:()=>startLair2Encounter('LAIR2_PASSAGE_1AC')}];
  return [
   {label:'↑ 北の大柱廊へ', fn:()=>go('LAIR2_HALL_1F')},
   {label:PC._lair2LeverA?' レバー（すでに動かしてある）':' レバーを動かす', fn:()=>lair2PullLever('A','LAIR2_PASSAGE_1AC')},
  ];
 },
 },

 LAIR2_ROOM_1G:{
 scene:'dungeon',
 area:2,
 txt:()=>`<span style="color:#f0ece0">${LAIR2_NAME}</span><br><br>
  南北25m、東西15mの部屋。北壁中央に大柱廊へ続く扉がある。${PC._lair2SecretG_S?'南壁中央に隠し扉があるのが分かる。':''}${PC._lair2SecretG_E?'東壁中央にも隠し扉があるのが分かる。':''}` + lair2RoomStatusText('LAIR2_ROOM_1G'),
 choices:()=>{
  const ns = PC._lair2Dungeon.nodeState.LAIR2_ROOM_1G;
  if(PC._lair2Dungeon.themeId && !ns.defeated) return [{label:_lairEncounterLabel(ns), fn:()=>startLair2Encounter('LAIR2_ROOM_1G')}];
  const ch = [{label:'↑ 北の扉へ（大柱廊）', fn:()=>go('LAIR2_HALL_1F')}];
  if(PC._lair2SecretG_S) ch.push({label:'↓ 南の隠し扉へ', fn:()=>go('LAIR2_PASSAGE_1H')});
  else ch.push({label:' 南壁を調べる（運or知力Lv1能力値テスト）', fn:()=>lair2SearchWall({
   returnNode:'LAIR2_ROOM_1G', hasSecret:true,
   onFound(){
    PC._lair2SecretG_S = true;
    const s=document.getElementById('story');
    s.innerHTML += `<br><span style="color:#f0ece0">南壁の石組みにわずかな隙間を見つけた。押すと、隠し扉が現れた！</span>`;
    renderChoices([{label:'▶ OK', fn:()=>go('LAIR2_ROOM_1G')}]);
   },
  })});
  if(PC._lair2SecretG_E) ch.push({label:'→ 東の隠し扉へ', fn:()=>go('LAIR2_PASSAGE_1Z')});
  else ch.push({label:' 東壁を調べる（運or知力Lv1能力値テスト）', fn:()=>lair2SearchWall({
   returnNode:'LAIR2_ROOM_1G', hasSecret:true,
   onFound(){
    PC._lair2SecretG_E = true;
    const s=document.getElementById('story');
    s.innerHTML += `<br><span style="color:#f0ece0">東壁の石組みにわずかな隙間を見つけた。押すと、隠し扉が現れた！</span>`;
    renderChoices([{label:'▶ OK', fn:()=>go('LAIR2_ROOM_1G')}]);
   },
  })});
  ch.push({label:' 西壁を調べる（運or知力Lv1能力値テスト）', fn:()=>lair2SearchWall({returnNode:'LAIR2_ROOM_1G', hasSecret:false})});
  return ch;
 },
 },

 LAIR2_PASSAGE_1H:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">${LAIR2_NAME}</span><br><br>
  南北5mほどの短い通路。北端は部屋への扉。南端は崖になっており、底には幅10mほどの川が西から東へ流れている。水面までは20mほどある。<br>
  川を渡れるよう、幅5m、長さ10mの石橋が架かっている。`,
 choices:[
  {label:'↑ 北の扉へ', fn:()=>go('LAIR2_ROOM_1G')},
  {label:'↓ 石橋を渡る', fn:()=>go('LAIR2_PASSAGE_1I')},
 ],
 },

 LAIR2_PASSAGE_1I:{
 scene:'dungeon',
 area:2,
 txt:()=>`<span style="color:#f0ece0">${LAIR2_NAME}</span><br><br>
  南北15mの通路。北端は崖になっており、石橋が架かっている。南端は行き止まりで、西壁に扉がある。` + lair2RoomStatusText('LAIR2_PASSAGE_1I'),
 choices:()=>{
  const ns = PC._lair2Dungeon.nodeState.LAIR2_PASSAGE_1I;
  if(PC._lair2Dungeon.themeId && !ns.defeated) return [{label:_lairEncounterLabel(ns), fn:()=>startLair2Encounter('LAIR2_PASSAGE_1I')}];
  return [
   {label:'↑ 石橋を渡る（北へ）', fn:()=>go('LAIR2_PASSAGE_1H')},
   {label:'← 西の扉へ', fn:()=>go('LAIR2_ROOM_1J')},
  ];
 },
 },

 LAIR2_PASSAGE_1Z:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">${LAIR2_NAME}</span><br><br>
  東西10mの通路。西端は行き止まりで、西壁に扉がある。東端は南へ折れ曲がっており、東端の東壁には別の扉もある。`,
 choices:[
  {label:'← 西の扉へ', fn:()=>go('LAIR2_ROOM_1G')},
  {label:'↘ 南へ折れる', fn:()=>go('LAIR2_PASSAGE_1Y')},
  {label:'→ 東の扉へ', fn:()=>go('LAIR2_ROOM_1AA')},
 ],
 },

 LAIR2_ROOM_1AA:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">${LAIR2_NAME}</span><br><br>
  南北15m、東西10mの部屋。西壁北端に扉がある。`,
 choices:[
  {label:'← 西の扉へ', fn:()=>go('LAIR2_PASSAGE_1Z')},
 ],
 },

 LAIR2_PASSAGE_1Y:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">${LAIR2_NAME}</span><br><br>
  南北20mの通路。北端は先ほどの通路へ続いている。南端は崖になっており、底には幅20mほどの川が西から東へ流れている。水面までは20mほどある。<br>
  川を渡れるよう、幅5m、長さ20mの石橋が架かっている。`,
 choices:[
  {label:'↑ 北へ', fn:()=>go('LAIR2_PASSAGE_1Z')},
  {label:'↓ 石橋を渡る', fn:()=>go('LAIR2_PASSAGE_1X')},
 ],
 },

 LAIR2_PASSAGE_1X:{
 scene:'dungeon',
 area:2,
 txt:()=>`<span style="color:#f0ece0">${LAIR2_NAME}</span><br><br>
  南北30mの通路。北端は崖になっており、石橋が架かっている。南端は行き止まりで、南壁に扉がある。` + lair2RoomStatusText('LAIR2_PASSAGE_1X'),
 choices:()=>{
  const ns = PC._lair2Dungeon.nodeState.LAIR2_PASSAGE_1X;
  if(PC._lair2Dungeon.themeId && !ns.defeated) return [{label:_lairEncounterLabel(ns), fn:()=>startLair2Encounter('LAIR2_PASSAGE_1X')}];
  return [
   {label:'↑ 石橋を渡る（北へ）', fn:()=>go('LAIR2_PASSAGE_1Y')},
   {label:'↓ 南の扉へ', fn:()=>go('LAIR2_PASSAGE_1W')},
  ];
 },
 },

 LAIR2_ROOM_1J:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">${LAIR2_NAME}</span><br><br>
  南北15m、東西25mの部屋。東壁中央に扉がある。西壁中央には広間へ続く落とし格子があり、${lair2PortcullisOpen()?'<span style="color:#e8e4d8">開いている。</span>':'固く閉じている。'}${PC._lair2SecretJ_S?'南壁中央に隠し扉があるのが分かる。':''}`,
 choices:()=>{
  const ch = [{label:'→ 東の扉へ', fn:()=>go('LAIR2_PASSAGE_1I')}];
  if(lair2PortcullisOpen()) ch.push({label:'← 西の落とし格子へ（広間入口）', fn:()=>go('LAIR2_HALLENTRY')});
  if(PC._lair2SecretJ_S) ch.push({label:'↓ 南の隠し扉へ', fn:()=>go('LAIR2_PASSAGE_1K')});
  else ch.push({label:' 南壁を調べる（運or知力Lv1能力値テスト）', fn:()=>lair2SearchWall({
   returnNode:'LAIR2_ROOM_1J', hasSecret:true,
   onFound(){
    PC._lair2SecretJ_S = true;
    const s=document.getElementById('story');
    s.innerHTML += `<br><span style="color:#f0ece0">南壁の石組みにわずかな隙間を見つけた。押すと、隠し扉が現れた！</span>`;
    renderChoices([{label:'▶ OK', fn:()=>go('LAIR2_ROOM_1J')}]);
   },
  })});
  ch.push({label:' 北壁を調べる（運or知力Lv1能力値テスト）', fn:()=>lair2SearchWall({returnNode:'LAIR2_ROOM_1J', hasSecret:false})});
  return ch;
 },
 },

 LAIR2_PASSAGE_1K:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">${LAIR2_NAME}</span><br><br>
  南北10mの通路。北端は行き止まりで、北壁に扉がある。南端も行き止まりで、南壁に扉、東壁にも扉がある。`,
 choices:[
  {label:'↑ 北の扉へ', fn:()=>go('LAIR2_ROOM_1J')},
  {label:'↓ 南の扉へ', fn:()=>go('LAIR2_ROOM_1M')},
  {label:'→ 東の扉へ', fn:()=>go('LAIR2_ROOM_1L')},
 ],
 },

 LAIR2_ROOM_1L:{
 scene:'dungeon',
 area:3,
 txt:()=>`<span style="color:#f0ece0">${LAIR2_NAME}</span><br><br>
  南北10m、東西20mの部屋。西壁南端に扉がある。` + lair2RoomStatusText('LAIR2_ROOM_1L'),
 choices:()=>{
  const ns = PC._lair2Dungeon.nodeState.LAIR2_ROOM_1L;
  if(PC._lair2Dungeon.themeId && !ns.defeated) return [{label:_lairEncounterLabel(ns), fn:()=>startLair2Encounter('LAIR2_ROOM_1L')}];
  return [{label:'← 西の扉へ', fn:()=>go('LAIR2_PASSAGE_1K')}];
 },
 },

 LAIR2_ROOM_1M:{
 scene:'dungeon',
 area:3,
 txt:()=>`<span style="color:#f0ece0">${LAIR2_NAME}</span><br><br>
  15m四方の部屋。東西南北それぞれの壁の中央に扉がある。` + lair2RoomStatusText('LAIR2_ROOM_1M'),
 choices:()=>{
  const ns = PC._lair2Dungeon.nodeState.LAIR2_ROOM_1M;
  if(PC._lair2Dungeon.themeId && !ns.defeated) return [{label:_lairEncounterLabel(ns), fn:()=>startLair2Encounter('LAIR2_ROOM_1M')}];
  return [
   {label:'↑ 北の扉へ', fn:()=>go('LAIR2_PASSAGE_1K')},
   {label:'← 西の扉へ', fn:()=>go('LAIR2_PASSAGE_1N')},
   {label:'↓ 南の扉へ', fn:()=>go('LAIR2_PASSAGE_1O')},
   {label:'→ 東の扉へ', fn:()=>go('LAIR2_PASSAGE_1Q')},
  ];
 },
 },

 LAIR2_PASSAGE_1N:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">${LAIR2_NAME}</span><br><br>
  南北10mの通路。南端の東壁に扉がある。北端には地上へと続く上り階段が見える。`,
 choices:[
  {label:'→ 東の扉へ', fn:()=>go('LAIR2_ROOM_1M')},
  {label:'↑ 階段を上る', fn:()=>{
   PC._lair2AltEntranceFound = true;
   hideDungeonImage();
   go('LAIR2_FRONT');
  }},
 ],
 },

 LAIR2_PASSAGE_1O:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">${LAIR2_NAME}</span><br><br>
  南北20mの通路。北端は部屋への扉。南端は西へ折れ曲がっている。`,
 choices:[
  {label:'↑ 北の扉へ', fn:()=>go('LAIR2_ROOM_1M')},
  {label:'↙ 西へ折れる', fn:()=>go('LAIR2_PASSAGE_1P')},
 ],
 },

 LAIR2_PASSAGE_1P:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">${LAIR2_NAME}</span><br><br>
  東西25mの通路。東端は北へ折れ曲がっている。西端は行き止まりで、壁にレバーが取り付けられている。`,
 choices:()=>[
  {label:'→ 東へ戻る', fn:()=>go('LAIR2_PASSAGE_1O')},
  {label:PC._lair2LeverB?' レバー（すでに動かしてある）':' レバーを動かす', fn:()=>lair2PullLever('B','LAIR2_PASSAGE_1P')},
 ],
 },

 LAIR2_PASSAGE_1Q:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">${LAIR2_NAME}</span><br><br>
  東西10mの通路。西端の西壁に扉がある。東はT字路へ続いている。`,
 choices:[
  {label:'← 西の扉へ', fn:()=>go('LAIR2_ROOM_1M')},
  {label:'→ 東へ（T字路）', fn:()=>go('LAIR2_JUNCTION_1R')},
 ],
 },

 LAIR2_JUNCTION_1R:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">${LAIR2_NAME}</span><br><br>
  東西に走る通路のT字路。南へ向かう通路が接続されている。`,
 choices:[
  {label:'← 西へ', fn:()=>go('LAIR2_PASSAGE_1Q')},
  {label:'→ 東へ', fn:()=>go('LAIR2_PASSAGE_1W')},
  {label:'↓ 南へ', fn:()=>go('LAIR2_PASSAGE_1S')},
 ],
 },

 LAIR2_PASSAGE_1W:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">${LAIR2_NAME}</span><br><br>
  東西15mの通路。西はT字路へ続いている。東は行き止まりで、北壁に扉がある。`,
 choices:[
  {label:'← 西へ（T字路）', fn:()=>go('LAIR2_JUNCTION_1R')},
  {label:'↑ 北の扉へ', fn:()=>go('LAIR2_PASSAGE_1X')},
 ],
 },

 LAIR2_PASSAGE_1S:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">${LAIR2_NAME}</span><br><br>
  南北15mの通路。北はT字路へ続いている。南は西へ折れ曲がっている。`,
 choices:[
  {label:'↑ 北へ（T字路）', fn:()=>go('LAIR2_JUNCTION_1R')},
  {label:'↙ 西へ折れる', fn:()=>go('LAIR2_PASSAGE_1T')},
 ],
 },

 LAIR2_PASSAGE_1T:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">${LAIR2_NAME}</span><br><br>
  東西20mの通路。東端は北へ折れ曲がっている。西端は行き止まりで、南壁に扉がある。`,
 choices:[
  {label:'→ 東へ戻る', fn:()=>go('LAIR2_PASSAGE_1S')},
  {label:'↓ 南の扉へ', fn:()=>go('LAIR2_ROOM_1U')},
 ],
 },

 LAIR2_ROOM_1U:{
 scene:'dungeon',
 area:3,
 txt:()=>`<span style="color:#f0ece0">${LAIR2_NAME}</span><br><br>
  10m四方の部屋。北壁西端に扉、東壁南端に扉がある。` + lair2RoomStatusText('LAIR2_ROOM_1U'),
 choices:()=>{
  const ns = PC._lair2Dungeon.nodeState.LAIR2_ROOM_1U;
  if(PC._lair2Dungeon.themeId && !ns.defeated) return [{label:_lairEncounterLabel(ns), fn:()=>startLair2Encounter('LAIR2_ROOM_1U')}];
  return [
   {label:'↑ 北の扉へ', fn:()=>go('LAIR2_PASSAGE_1T')},
   {label:'→ 東の扉へ', fn:()=>go('LAIR2_PASSAGE_1V')},
  ];
 },
 },

 LAIR2_PASSAGE_1V:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">${LAIR2_NAME}</span><br><br>
  東西30mの通路。西端西壁に扉がある。東端の東壁にはレバーが取り付けられている。`,
 choices:()=>[
  {label:'← 西の扉へ', fn:()=>go('LAIR2_ROOM_1U')},
  {label:PC._lair2LeverC?' レバー（すでに動かしてある）':' レバーを動かす', fn:()=>lair2PullLever('C','LAIR2_PASSAGE_1V')},
 ],
 },

 LAIR2_HALLENTRY:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">${LAIR2_NAME}</span><br><br>
  5m四方の小さな空間。東壁には部屋へのアーチがある。西側には大広間への開口部が開いている。`,
 choices:[
  {label:'→ 東のアーチへ', fn:()=>go('LAIR2_ROOM_1J')},
  {label:'← 西の開口部へ', fn:()=>go('LAIR2_HALL_1AB')},
 ],
 },

 LAIR2_HALL_1AB:{
 scene:'dungeon',
 area:3,
 txt:()=>`<span style="color:#f0ece0">${LAIR2_NAME}</span><br><br>
  南北30m、東西20mの大広間。東壁北端に開口部があり、広間入口へ続いている。南側は別の広間につながっているようだが、薄暗くてよく見えない。` + lair2RoomStatusText('LAIR2_HALL_1AB'),
 choices:()=>{
  const ns = PC._lair2Dungeon.nodeState.LAIR2_HALL_1AB;
  if(PC._lair2Dungeon.themeId && !ns.defeated) return [{label:_lairEncounterLabel(ns), fn:()=>startLair2Encounter('LAIR2_HALL_1AB')}];
  return [
   {label:'→ 東の開口部へ', fn:()=>go('LAIR2_HALLENTRY')},
   {label:'↓ 南へ', fn:()=>go('LAIR2_HALL_1AC')},
  ];
 },
 },

 LAIR2_HALL_1AC:{
 scene:'dungeon',
 area:3,
 txt:()=>`<span style="color:#f0ece0">${LAIR2_NAME}</span><br><br>
  南北30m、東西20mの大広間。北側は先ほどの広間へ続いているが、暗くてよく見えない。南壁の西端から5mのところに下り階段があるが、その先は天井が崩れており進めない。` + lair2RoomStatusText('LAIR2_HALL_1AC'),
 choices:()=>{
  const ns = PC._lair2Dungeon.nodeState.LAIR2_HALL_1AC;
  if(PC._lair2Dungeon.themeId && !ns.defeated) return [{label:_lairEncounterLabel(ns), fn:()=>startLair2Encounter('LAIR2_HALL_1AC')}];
  return [{label:'↑ 北へ戻る', fn:()=>go('LAIR2_HALL_1AB')}];
 },
 },

// ══════════════════════════════════════════
// 第3の固定ダンジョン「忘れられた地下道」（アッシュヴェイルから6日）
// 内部ノードは構造データ共有後に追加する（TODO）
// ══════════════════════════════════════════
 LAIR3_FRONT:{
 scene:'dungeon',
 txt:()=>{
  const lair = PC._lair3Dungeon;
  const flavor = (lair && lair.themeId)
   ? _lairScenarioAwareTheme(lair.themeId).entryFlavor
   : 'あたりは静まり返っており、これといった気配は感じられない。';
  return `<span style="color:#f0ece0">${LAIR3_NAME} ── 入口前</span><br><br>
  アッシュヴェイルから続く道の果て、ダンジョンの入口が見える。${flavor}`;
 },
 choices:()=>[
  {label:'→ 中へ入る', fn:()=>{ initTorch(); go('LAIR3_LANDING'); }},
  {label:'↑ アッシュヴェイルへ戻る（6日）', fn:()=>startLair3ReturnJourney()},
 ],
 },

 LAIR3_LANDING:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">${LAIR3_NAME}</span><br><br>
  地上から南に延びる10mほどの下り階段。降りきると5m四方の踊り場に出る。さらに北へ地下2階へと続く階段が延びている。西には部屋へのアーチがある。`,
 choices:[
  {label:'← 西のアーチへ', fn:()=>go('LAIR3_ROOM_5')},
  {label:'↓ 北の階段（地下2階）へ', fn:()=>go('LAIR3_B2_ROOM_6')},
  {label:'↑ 地上へ戻る', fn:()=>go('LAIR3_FRONT')},
 ],
 },

 LAIR3_ROOM_5:{
 scene:'dungeon',
 area:1,
 txt:()=>`<span style="color:#f0ece0">${LAIR3_NAME}</span><br><br>
  25m四方の部屋。東壁中央に踊り場へのアーチ、北壁中央に扉がある。` + lair3RoomStatusText('LAIR3_ROOM_5'),
 choices:()=>{
  const ns = PC._lair3Dungeon.nodeState.LAIR3_ROOM_5;
  if(PC._lair3Dungeon.themeId && !ns.defeated) return [{label:_lairEncounterLabel(ns), fn:()=>startLair3Encounter('LAIR3_ROOM_5')}];
  return [
   {label:'→ 東のアーチへ', fn:()=>go('LAIR3_LANDING')},
   {label:'↑ 北の扉へ', fn:()=>go('LAIR3_ROOM_3')},
  ];
 },
 },

 LAIR3_ROOM_3:{
 scene:'dungeon',
 area:1,
 txt:()=>`<span style="color:#f0ece0">${LAIR3_NAME}</span><br><br>
  35m四方の部屋。南壁の西端に部屋への扉、西壁の北端から15mのところに部屋へのアーチがある。東壁北端には落とし格子があり、${lair3PortcullisOpen()?'<span style="color:#e8e4d8">開いている。</span>':'固く閉じている。'}北壁には色褪せて破れたタペストリーがかかっている。` + lair3RoomStatusText('LAIR3_ROOM_3'),
 choices:()=>{
  const ns = PC._lair3Dungeon.nodeState.LAIR3_ROOM_3;
  if(PC._lair3Dungeon.themeId && !ns.defeated) return [{label:_lairEncounterLabel(ns), fn:()=>startLair3Encounter('LAIR3_ROOM_3')}];
  const ch = [
   {label:'↓ 南の扉へ', fn:()=>go('LAIR3_ROOM_5')},
   {label:'← 西のアーチへ', fn:()=>go('LAIR3_ROOM_2')},
  ];
  if(lair3PortcullisOpen()) ch.push({label:'→ 東の落とし格子へ', fn:()=>go('LAIR3_ROOM_4')});
  ch.push({label:' タペストリーを調べる', fn:()=>lair3ExamineTapestry('LAIR3_ROOM_3')});
  return ch;
 },
 },

 LAIR3_ROOM_2:{
 scene:'dungeon',
 area:1,
 txt:()=>`<span style="color:#f0ece0">${LAIR3_NAME}</span><br><br>
  25m四方の部屋。東壁中央に部屋へのアーチ、西壁中央にレバーがある。` + lair3RoomStatusText('LAIR3_ROOM_2'),
 choices:()=>{
  const ns = PC._lair3Dungeon.nodeState.LAIR3_ROOM_2;
  if(PC._lair3Dungeon.themeId && !ns.defeated) return [{label:_lairEncounterLabel(ns), fn:()=>startLair3Encounter('LAIR3_ROOM_2')}];
  return [
   {label:'→ 東のアーチへ', fn:()=>go('LAIR3_ROOM_3')},
   {label:PC._lair3LeverPulled?' レバー（すでに動かしてある）':' レバーを動かす', fn:()=>lair3PullLever('LAIR3_ROOM_2')},
  ];
 },
 },

 LAIR3_ROOM_4:{
 scene:'dungeon',
 area:1,
 txt:()=>`<span style="color:#f0ece0">${LAIR3_NAME}</span><br><br>
  南北25m、東西15mの部屋。西壁北端に落とし格子があり、${lair3PortcullisOpen()?'<span style="color:#e8e4d8">開いている。</span>':'固く閉じている。'}南壁中央にボタンがある。` + lair3RoomStatusText('LAIR3_ROOM_4'),
 choices:()=>{
  const ns = PC._lair3Dungeon.nodeState.LAIR3_ROOM_4;
  if(PC._lair3Dungeon.themeId && !ns.defeated) return [{label:_lairEncounterLabel(ns), fn:()=>startLair3Encounter('LAIR3_ROOM_4')}];
  const ch = [];
  if(lair3PortcullisOpen()) ch.push({label:'← 西の落とし格子へ', fn:()=>go('LAIR3_ROOM_3')});
  ch.push({label:' ボタンを押す', fn:()=>lair3PressButton('LAIR3_ROOM_1')});
  return ch;
 },
 },

 LAIR3_ROOM_1:{
 scene:'dungeon',
 area:2,
 txt:()=>`<span style="color:#f0ece0">${LAIR3_NAME}</span><br><br>
  25m四方の部屋。西壁中央にボタンがある。` + lair3RoomStatusText('LAIR3_ROOM_1'),
 choices:()=>{
  const ns = PC._lair3Dungeon.nodeState.LAIR3_ROOM_1;
  if(PC._lair3Dungeon.themeId && !ns.defeated) return [{label:_lairEncounterLabel(ns), fn:()=>startLair3Encounter('LAIR3_ROOM_1')}];
  return [{label:' ボタンを押す', fn:()=>lair3PressButton('LAIR3_ROOM_3')}];
 },
 },

 // ── 地下2階（B2） ──

 LAIR3_B2_ROOM_6:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">${LAIR3_NAME}</span><br><br>
  15m四方の部屋。南壁中央に地下1階への上り階段、西壁北端に扉、北壁東端にアーチがある。東壁北端には扉があり、${PC._lair3DoorOpen_LAIR3_B2_ROOM_7?'<span style="color:#e8e4d8">開いている。</span>':'鍵がかかっている。'}`,
 choices:()=>{
  const ch = [
   {label:'↑ 南の階段（地下1階）へ', fn:()=>go('LAIR3_LANDING')},
   {label:'← 西の扉へ', fn:()=>go('LAIR3_B2_ROOM_5')},
   {label:'↑ 北のアーチへ', fn:()=>go('LAIR3_B2_ROOM_2')},
  ];
  if(PC._lair3DoorOpen_LAIR3_B2_ROOM_7) ch.push({label:'→ 東の扉へ', fn:()=>go('LAIR3_B2_ROOM_7')});
  else ch.push({label:'→ 東の扉（施錠されている）を調べる', fn:()=>lair3TryDoor({level:2, dest:'LAIR3_B2_ROOM_7', from:'LAIR3_B2_ROOM_6', area:2})});
  return ch;
 },
 },

 LAIR3_B2_ROOM_5:{
 scene:'dungeon',
 area:1,
 txt:()=>`<span style="color:#f0ece0">${LAIR3_NAME}</span><br><br>
  南北35m東西15mの部屋。東壁北端に扉、西壁北端に扉、西壁北端から15mのところにもう一つ扉がある。` + lair3RoomStatusText('LAIR3_B2_ROOM_5'),
 choices:()=>{
  const ns = PC._lair3Dungeon.nodeState.LAIR3_B2_ROOM_5;
  if(PC._lair3Dungeon.themeId && !ns.defeated) return [{label:_lairEncounterLabel(ns), fn:()=>startLair3Encounter('LAIR3_B2_ROOM_5')}];
  return [
   {label:'→ 東の扉へ', fn:()=>go('LAIR3_B2_ROOM_6')},
   {label:'← 西の扉（北）へ', fn:()=>go('LAIR3_B2_ROOM_4')},
   {label:'← 西の扉（南）へ', fn:()=>go('LAIR3_B2_PASSAGE_1')},
  ];
 },
 },

 LAIR3_B2_ROOM_4:{
 scene:'dungeon',
 area:2,
 txt:()=>`<span style="color:#f0ece0">${LAIR3_NAME}</span><br><br>
  南北15m東西25mの部屋。南壁中央に扉、東壁南端に扉がある。` + lair3RoomStatusText('LAIR3_B2_ROOM_4'),
 choices:()=>{
  const ns = PC._lair3Dungeon.nodeState.LAIR3_B2_ROOM_4;
  if(PC._lair3Dungeon.themeId && !ns.defeated) return [{label:_lairEncounterLabel(ns), fn:()=>startLair3Encounter('LAIR3_B2_ROOM_4')}];
  return [
   {label:'↓ 南の扉へ', fn:()=>go('LAIR3_B2_PASSAGE_1')},
   {label:'→ 東の扉へ', fn:()=>go('LAIR3_B2_ROOM_5')},
  ];
 },
 },

 LAIR3_B2_PASSAGE_1:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">${LAIR3_NAME}</span><br><br>
  東西15mの通路。東端は行き止まりで、東壁に扉がある。西端の北壁にも扉があり、通路自体はさらに奥、地下3階へと下る階段へ続いている。`,
 choices:[
  {label:'→ 東の扉へ', fn:()=>go('LAIR3_B2_ROOM_5')},
  {label:'↑ 北の扉へ', fn:()=>go('LAIR3_B2_ROOM_4')},
  {label:'↓ 西の階段（地下3階）へ', fn:()=>go('LAIR3_B3_PASSAGE_1')},
 ],
 },

 LAIR3_B2_ROOM_2:{
 scene:'dungeon',
 area:1,
 txt:()=>`<span style="color:#f0ece0">${LAIR3_NAME}</span><br><br>
  南北25m東西35mの部屋。ずっと昔貯蔵庫に使われていたかもしれない部屋。ほとんどすべてのものが略奪されるか、破壊されている。南壁東端に部屋へのアーチ、北壁東端に扉があり、${PC._lair3DoorOpen_LAIR3_B2_PASSAGE_3?'<span style="color:#e8e4d8">開いている。</span>':'鍵がかかっている。'}` + lair3RoomStatusText('LAIR3_B2_ROOM_2'),
 choices:()=>{
  const ns = PC._lair3Dungeon.nodeState.LAIR3_B2_ROOM_2;
  if(PC._lair3Dungeon.themeId && !ns.defeated) return [{label:_lairEncounterLabel(ns), fn:()=>startLair3Encounter('LAIR3_B2_ROOM_2')}];
  const ch = [{label:'↓ 南のアーチへ', fn:()=>go('LAIR3_B2_ROOM_6')}];
  if(PC._lair3DoorOpen_LAIR3_B2_PASSAGE_3) ch.push({label:'↑ 北の扉へ', fn:()=>go('LAIR3_B2_PASSAGE_3')});
  else ch.push({label:'↑ 北の扉（施錠されている）を調べる', fn:()=>lair3TryDoor({level:2, dest:'LAIR3_B2_PASSAGE_3', from:'LAIR3_B2_ROOM_2', area:2})});
  return ch;
 },
 },

 LAIR3_B2_PASSAGE_3:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">${LAIR3_NAME}</span><br><br>
  東西15mの通路。西端は部屋への扉で行き止まりになっている。東端南壁にも扉がある。`,
 choices:[
  {label:'← 西の扉へ', fn:()=>go('LAIR3_B2_ROOM_1')},
  {label:'→ 東の扉へ', fn:()=>go('LAIR3_B2_ROOM_2')},
 ],
 },

 LAIR3_B2_ROOM_1:{
 scene:'dungeon',
 area:2,
 txt:()=>`<span style="color:#f0ece0">${LAIR3_NAME}</span><br><br>
  15m四方の部屋。東壁南端に扉がある。` + lair3RoomStatusText('LAIR3_B2_ROOM_1'),
 choices:()=>{
  const ns = PC._lair3Dungeon.nodeState.LAIR3_B2_ROOM_1;
  if(PC._lair3Dungeon.themeId && !ns.defeated) return [{label:_lairEncounterLabel(ns), fn:()=>startLair3Encounter('LAIR3_B2_ROOM_1')}];
  return [{label:'→ 東の扉へ', fn:()=>go('LAIR3_B2_PASSAGE_3')}];
 },
 },

 LAIR3_B2_ROOM_7:{
 scene:'dungeon',
 area:1,
 txt:()=>`<span style="color:#f0ece0">${LAIR3_NAME}</span><br><br>
  15m四方の部屋。西壁北端に扉、東壁南端に扉がある。` + lair3RoomStatusText('LAIR3_B2_ROOM_7'),
 choices:()=>{
  const ns = PC._lair3Dungeon.nodeState.LAIR3_B2_ROOM_7;
  if(PC._lair3Dungeon.themeId && !ns.defeated) return [{label:_lairEncounterLabel(ns), fn:()=>startLair3Encounter('LAIR3_B2_ROOM_7')}];
  return [
   {label:'← 西の扉へ', fn:()=>go('LAIR3_B2_ROOM_6')},
   {label:'→ 東の扉へ', fn:()=>go('LAIR3_B2_PASSAGE_2')},
  ];
 },
 },

 LAIR3_B2_PASSAGE_2:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">${LAIR3_NAME}</span><br><br>
  南北35mの通路。南端西壁に扉があり、北端西壁にも扉があるが、${PC._lair3DoorOpen_LAIR3_B2_ROOM_3?'<span style="color:#e8e4d8">開いている。</span>':'鍵がかかっている。'}`,
 choices:()=>{
  const ch = [{label:'↓ 南の扉へ', fn:()=>go('LAIR3_B2_ROOM_7')}];
  if(PC._lair3DoorOpen_LAIR3_B2_ROOM_3) ch.push({label:'↑ 北の扉へ', fn:()=>go('LAIR3_B2_ROOM_3')});
  else ch.push({label:'↑ 北の扉（施錠されている）を調べる', fn:()=>lair3TryDoor({level:2, dest:'LAIR3_B2_ROOM_3', from:'LAIR3_B2_PASSAGE_2', area:2})});
  return ch;
 },
 },

 LAIR3_B2_ROOM_3:{
 scene:'dungeon',
 area:2,
 txt:()=>`<span style="color:#f0ece0">${LAIR3_NAME}</span><br><br>
  15m四方の部屋。東壁北端に扉がある。` + lair3RoomStatusText('LAIR3_B2_ROOM_3'),
 choices:()=>{
  const ns = PC._lair3Dungeon.nodeState.LAIR3_B2_ROOM_3;
  if(PC._lair3Dungeon.themeId && !ns.defeated) return [{label:_lairEncounterLabel(ns), fn:()=>startLair3Encounter('LAIR3_B2_ROOM_3')}];
  return [{label:'→ 東の扉へ', fn:()=>go('LAIR3_B2_PASSAGE_2')}];
 },
 },

 // ── 地下3階（B3） ──

 LAIR3_B3_PASSAGE_1:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">${LAIR3_NAME}</span><br><br>
  東西15mの通路。西端は地下2階へと続く上り階段（途中に踊り場があり、向きを変えながら続いている）。東端は行き止まりだが、${PC._lair3B3HiddenDoorFound?'東壁に隠し扉が見つかっている。':'何か仕掛けがありそうな気配がする。'}`,
 choices:()=>{
  const ch = [{label:'↑ 西の階段（地下2階）へ', fn:()=>go('LAIR3_B2_PASSAGE_1')}];
  if(PC._lair3B3HiddenDoorFound) ch.push({label:'→ 東の隠し扉へ', fn:()=>go('LAIR3_B3_ROOM_5')});
  else ch.push({label:' 東壁を調べる', fn:()=>lair3B3SearchWall('LAIR3_B3_PASSAGE_1')});
  return ch;
 },
 },

 LAIR3_B3_ROOM_5:{
 scene:'dungeon',
 area:2,
 txt:()=>`<span style="color:#f0ece0">${LAIR3_NAME}</span><br><br>
  南北25m東西15mの部屋。西壁中央に通路への扉、西壁北端に部屋へのアーチがある。東壁南端には扉があり、${PC._lair3DoorOpen_LAIR3_B3_DOOR_56?'<span style="color:#e8e4d8">開いている。</span>':'鍵がかかっている。'}` + lair3RoomStatusText('LAIR3_B3_ROOM_5'),
 choices:()=>{
  const ns = PC._lair3Dungeon.nodeState.LAIR3_B3_ROOM_5;
  if(PC._lair3Dungeon.themeId && !ns.defeated) return [{label:_lairEncounterLabel(ns), fn:()=>startLair3Encounter('LAIR3_B3_ROOM_5')}];
  const ch = [];
  if(PC._lair3B3HiddenDoorFound) ch.push({label:'← 西の扉へ', fn:()=>go('LAIR3_B3_PASSAGE_1')});
  ch.push({label:'← 西のアーチへ', fn:()=>go('LAIR3_B3_ROOM_2')});
  if(PC._lair3DoorOpen_LAIR3_B3_DOOR_56) ch.push({label:'→ 東の扉へ', fn:()=>go('LAIR3_B3_ROOM_6')});
  else ch.push({label:'→ 東の扉（施錠されている）を調べる', fn:()=>lair3TryDoor({level:3, dest:'LAIR3_B3_ROOM_6', from:'LAIR3_B3_ROOM_5', area:2, key:'LAIR3_B3_DOOR_56'})});
  return ch;
 },
 },

 LAIR3_B3_ROOM_2:{
 scene:'dungeon',
 area:2,
 txt:()=>`<span style="color:#f0ece0">${LAIR3_NAME}</span><br><br>
  25m四方の部屋。床には迷路のような刻み目が広がり、天井はひび割れだらけだ。東壁南端に扉、東壁中央にも扉がある。` + lair3RoomStatusText('LAIR3_B3_ROOM_2'),
 choices:()=>{
  const ns = PC._lair3Dungeon.nodeState.LAIR3_B3_ROOM_2;
  if(PC._lair3Dungeon.themeId && !ns.defeated) return [{label:_lairEncounterLabel(ns), fn:()=>startLair3Encounter('LAIR3_B3_ROOM_2')}];
  return [
   {label:'→ 東の扉（南）へ', fn:()=>go('LAIR3_B3_ROOM_5')},
   {label:'→ 東の扉（中央）へ', fn:()=>go('LAIR3_B3_ROOM_3')},
  ];
 },
 },

 LAIR3_B3_ROOM_3:{
 scene:'dungeon',
 area:3,
 txt:()=>`<span style="color:#f0ece0">${LAIR3_NAME}</span><br><br>
  南北15m東西25mの部屋。西壁南端に扉、東壁南端に扉がある。北壁中央には落とし格子があり、${lair3B3PortcullisOpen()?'<span style="color:#e8e4d8">開いている。</span>':'固く閉じている。'}` + lair3RoomStatusText('LAIR3_B3_ROOM_3'),
 choices:()=>{
  const ns = PC._lair3Dungeon.nodeState.LAIR3_B3_ROOM_3;
  if(PC._lair3Dungeon.themeId && !ns.defeated) return [{label:_lairEncounterLabel(ns), fn:()=>startLair3Encounter('LAIR3_B3_ROOM_3')}];
  const ch = [
   {label:'← 西の扉へ', fn:()=>go('LAIR3_B3_ROOM_2')},
   {label:'→ 東の扉へ', fn:()=>go('LAIR3_B3_ROOM_4')},
  ];
  if(lair3B3PortcullisOpen()) ch.push({label:'↑ 北の落とし格子へ', fn:()=>go('LAIR3_B3_ROOM_1')});
  return ch;
 },
 },

 LAIR3_B3_ROOM_1:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">${LAIR3_NAME}</span><br><br>
  南北15m東西35mの部屋。南壁には落とし格子があり、${lair3B3PortcullisOpen()?'<span style="color:#e8e4d8">開いている。</span>':'固く閉じている。'}北壁中央には石でできた頑丈な箱が置かれている。`,
 choices:()=>{
  const ch = [];
  const boxCount = 5;
  for(let i=1;i<=boxCount;i++){
   const key = `_lair3B3Box${i}`;
   if(!PC[key]){
    ch.push({label:` 石の箱${i}を調べる`, fn:()=>{
     PC[key] = true;
     let result = '';
     let attempts = 0;
     do { result = generateTreasure(60); attempts++; }
     while(attempts < 5 && (result.includes('CP（') || result.includes('SP（')));
     const s = document.getElementById('story');
     s.innerHTML += `<br><br><span style="color:#f0ece0"> 箱${i}：${result}</span>`;
     updateHUD();
     renderChoices(NODES.LAIR3_B3_ROOM_1.choices());
    }});
   } else {
    ch.push({label:` 石の箱${i}（調べ終えた）`, fn:()=>{}});
   }
  }
  if(lair3B3PortcullisOpen()) ch.push({label:'↓ 南の落とし格子へ', fn:()=>go('LAIR3_B3_ROOM_3')});
  return ch;
 },
 },

 LAIR3_B3_ROOM_4:{
 scene:'dungeon',
 area:3,
 txt:()=>`<span style="color:#f0ece0">${LAIR3_NAME}</span><br><br>
  南北35m東西25mの部屋。西壁北端から15mの位置に扉がある。南壁西端には扉があり、${PC._lair3DoorOpen_LAIR3_B3_DOOR_46?'<span style="color:#e8e4d8">開いている。</span>':'鍵がかかっている。'}` + lair3RoomStatusText('LAIR3_B3_ROOM_4'),
 choices:()=>{
  const ns = PC._lair3Dungeon.nodeState.LAIR3_B3_ROOM_4;
  if(PC._lair3Dungeon.themeId && !ns.defeated) return [{label:_lairEncounterLabel(ns), fn:()=>startLair3Encounter('LAIR3_B3_ROOM_4')}];
  const ch = [{label:'← 西の扉へ', fn:()=>go('LAIR3_B3_ROOM_3')}];
  if(PC._lair3DoorOpen_LAIR3_B3_DOOR_46) ch.push({label:'↓ 南の扉へ', fn:()=>go('LAIR3_B3_ROOM_6')});
  else ch.push({label:'↓ 南の扉（施錠されている）を調べる', fn:()=>lair3TryDoor({level:3, dest:'LAIR3_B3_ROOM_6', from:'LAIR3_B3_ROOM_4', area:2, key:'LAIR3_B3_DOOR_46'})});
  return ch;
 },
 },

 LAIR3_B3_ROOM_6:{
 scene:'dungeon',
 area:2,
 txt:()=>`<span style="color:#f0ece0">${LAIR3_NAME}</span><br><br>
  15m四方の部屋。北壁東端に扉があり、${PC._lair3DoorOpen_LAIR3_B3_DOOR_46?'<span style="color:#e8e4d8">開いている。</span>':'鍵がかかっている。'}西壁北端にも扉があり、${PC._lair3DoorOpen_LAIR3_B3_DOOR_56?'<span style="color:#e8e4d8">開いている。</span>':'鍵がかかっている。'}西壁南端にも扉があり、${PC._lair3DoorOpen_LAIR3_B3_DOOR_P2_6?'<span style="color:#e8e4d8">開いている。</span>':'鍵がかかっている。'}` + lair3RoomStatusText('LAIR3_B3_ROOM_6'),
 choices:()=>{
  const ns = PC._lair3Dungeon.nodeState.LAIR3_B3_ROOM_6;
  if(PC._lair3Dungeon.themeId && !ns.defeated) return [{label:_lairEncounterLabel(ns), fn:()=>startLair3Encounter('LAIR3_B3_ROOM_6')}];
  const ch = [];
  if(PC._lair3DoorOpen_LAIR3_B3_DOOR_46) ch.push({label:'↑ 北の扉へ', fn:()=>go('LAIR3_B3_ROOM_4')});
  else ch.push({label:'↑ 北の扉（施錠されている）を調べる', fn:()=>lair3TryDoor({level:3, dest:'LAIR3_B3_ROOM_4', from:'LAIR3_B3_ROOM_6', area:2, key:'LAIR3_B3_DOOR_46'})});
  if(PC._lair3DoorOpen_LAIR3_B3_DOOR_56) ch.push({label:'← 西の扉（北）へ', fn:()=>go('LAIR3_B3_ROOM_5')});
  else ch.push({label:'← 西の扉（北・施錠されている）を調べる', fn:()=>lair3TryDoor({level:3, dest:'LAIR3_B3_ROOM_5', from:'LAIR3_B3_ROOM_6', area:2, key:'LAIR3_B3_DOOR_56'})});
  if(PC._lair3DoorOpen_LAIR3_B3_DOOR_P2_6) ch.push({label:'← 西の扉（南）へ', fn:()=>go('LAIR3_B3_PASSAGE_2')});
  else ch.push({label:'← 西の扉（南・施錠されている）を調べる', fn:()=>lair3TryDoor({level:3, dest:'LAIR3_B3_PASSAGE_2', from:'LAIR3_B3_ROOM_6', area:2, key:'LAIR3_B3_DOOR_P2_6'})});
  return ch;
 },
 },

 LAIR3_B3_PASSAGE_2:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">${LAIR3_NAME}</span><br><br>
  東西15mの通路。東端に扉があり、${PC._lair3DoorOpen_LAIR3_B3_DOOR_P2_6?'<span style="color:#e8e4d8">開いている。</span>':'鍵がかかっている。'}西端の南壁にレバーがある。`,
 choices:()=>{
  const ch = [];
  if(PC._lair3DoorOpen_LAIR3_B3_DOOR_P2_6) ch.push({label:'→ 東の扉へ', fn:()=>go('LAIR3_B3_ROOM_6')});
  else ch.push({label:'→ 東の扉（施錠されている）を調べる', fn:()=>lair3TryDoor({level:3, dest:'LAIR3_B3_ROOM_6', from:'LAIR3_B3_PASSAGE_2', area:2, key:'LAIR3_B3_DOOR_P2_6'})});
  ch.push({label:PC._lair3B3LeverPulled?' レバー（すでに動かしてある）':' レバーを動かす', fn:()=>lair3B3PullLever('LAIR3_B3_PASSAGE_2')});
  return ch;
 },
 },

 // ══════════════════════════════════════════
 // 第4の固定ダンジョン「忘却の螺旋堂」（サルーンから2日）
 // ══════════════════════════════════════════

 LAIR4_FRONT:{
 scene:'dungeon',
 txt:()=>{
  const lair = PC._lair4Dungeon;
  const flavor = (lair && lair.themeId)
   ? _lairScenarioAwareTheme(lair.themeId).entryFlavor
   : 'あたりは静まり返っており、これといった気配は感じられない。';
  return `<span style="color:#f0ece0">${LAIR4_NAME} ── 入口前</span><br><br>
  サルーンから続く道の果て、ダンジョンの入口が見える。${flavor}`;
 },
 choices:()=>[
  {label:'→ 中へ入る', fn:()=>{ initTorch(); go('LAIR4_PASSAGE_1'); }},
  {label:'↑ サルーンへ戻る（2日）', fn:()=>startLair4ReturnJourney()},
 ],
 },

 LAIR4_PASSAGE_1:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">${LAIR4_NAME}</span><br><br>
  東西15mの通路。西端の南壁には開口部があり、地上へと続く上り階段がある。西端の西壁には扉がある。東端の北側には部屋へのアーチがある。`,
 choices:[
  {label:'↑ 地上へ戻る', fn:()=>go('LAIR4_FRONT')},
  {label:'← 西の扉へ', fn:()=>go('LAIR4_ROOM_8')},
  {label:'→ 東のアーチへ', fn:()=>go('LAIR4_ROOM_5')},
 ],
 },

 LAIR4_ROOM_8:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">${LAIR4_NAME}</span><br><br>
  15m四方の部屋。東壁北端に扉がある。`,
 choices:[
  {label:'→ 東の扉へ', fn:()=>go('LAIR4_PASSAGE_1')},
 ],
 },

 LAIR4_ROOM_5:{
 scene:'dungeon',
 area:1,
 txt:()=>`<span style="color:#f0ece0">${LAIR4_NAME}</span><br><br>
  南北35m東西25mの部屋。南壁中央に通路へのアーチ、北壁中央に扉、北壁東端にも扉がある。` + lair4RoomStatusText('LAIR4_ROOM_5'),
 choices:()=>{
  const ns = PC._lair4Dungeon.nodeState.LAIR4_ROOM_5;
  if(PC._lair4Dungeon.themeId && !ns.defeated) return [{label:_lairEncounterLabel(ns), fn:()=>startLair4Encounter('LAIR4_ROOM_5')}];
  return [
   {label:'↓ 南のアーチへ', fn:()=>go('LAIR4_PASSAGE_1')},
   {label:'↑ 北の扉（中央）へ', fn:()=>go('LAIR4_ROOM_2')},
   {label:'↑ 北の扉（東）へ', fn:()=>go('LAIR4_ROOM_3')},
  ];
 },
 },

 LAIR4_ROOM_2:{
 scene:'dungeon',
 area:1,
 txt:()=>`<span style="color:#f0ece0">${LAIR4_NAME}</span><br><br>
  南北25m東西15mの部屋。北壁には終わりのない螺旋が刻み込まれている。南壁東端に扉がある。` + lair4RoomStatusText('LAIR4_ROOM_2'),
 choices:()=>{
  const ns = PC._lair4Dungeon.nodeState.LAIR4_ROOM_2;
  if(PC._lair4Dungeon.themeId && !ns.defeated) return [{label:_lairEncounterLabel(ns), fn:()=>startLair4Encounter('LAIR4_ROOM_2')}];
  return [{label:'↓ 南の扉へ', fn:()=>go('LAIR4_ROOM_5')}];
 },
 },

 LAIR4_ROOM_3:{
 scene:'dungeon',
 area:2,
 txt:()=>`<span style="color:#f0ece0">${LAIR4_NAME}</span><br><br>
  15m四方の部屋。南側の壁に「アルウェンの騎士団がここで5体のトロールを討伐した」と落書きされており、部屋のあちこちにロウの塊が散らばっている。南壁西端に扉、東壁南端にアーチがある。` + lair4RoomStatusText('LAIR4_ROOM_3'),
 choices:()=>{
  const ns = PC._lair4Dungeon.nodeState.LAIR4_ROOM_3;
  if(PC._lair4Dungeon.themeId && !ns.defeated) return [{label:_lairEncounterLabel(ns), fn:()=>startLair4Encounter('LAIR4_ROOM_3')}];
  return [
   {label:'↓ 南の扉へ', fn:()=>go('LAIR4_ROOM_5')},
   {label:'→ 東のアーチへ', fn:()=>go('LAIR4_ROOM_4')},
  ];
 },
 },

 LAIR4_ROOM_4:{
 scene:'dungeon',
 area:2,
 txt:()=>`<span style="color:#f0ece0">${LAIR4_NAME}</span><br><br>
  南北15m東西25mの部屋。西壁南端にアーチ、北壁中央に扉がある。南壁中央には扉があり、${PC._lair4DoorOpen_LAIR4_ROOM_6?'<span style="color:#e8e4d8">開いている。</span>':'鍵がかかっている。'}` + lair4RoomStatusText('LAIR4_ROOM_4'),
 choices:()=>{
  const ns = PC._lair4Dungeon.nodeState.LAIR4_ROOM_4;
  if(PC._lair4Dungeon.themeId && !ns.defeated) return [{label:_lairEncounterLabel(ns), fn:()=>startLair4Encounter('LAIR4_ROOM_4')}];
  const ch = [
   {label:'← 西のアーチへ', fn:()=>go('LAIR4_ROOM_3')},
   {label:'↑ 北の扉へ', fn:()=>go('LAIR4_ROOM_1')},
  ];
  if(PC._lair4DoorOpen_LAIR4_ROOM_6) ch.push({label:'↓ 南の扉へ', fn:()=>go('LAIR4_ROOM_6')});
  else ch.push({label:'↓ 南の扉（施錠されている）を調べる', fn:()=>lair4TryDoor({level:1, dest:'LAIR4_ROOM_6', from:'LAIR4_ROOM_4', area:2})});
  return ch;
 },
 },

 LAIR4_ROOM_1:{
 scene:'dungeon',
 area:2,
 txt:()=>`<span style="color:#f0ece0">${LAIR4_NAME}</span><br><br>
  15m四方の部屋。南壁中央に扉がある。東壁には${PC._lair4AlcoveExamined?'調べ終えた':'魔法使いらしきレプラコーンの彫像が置かれた'}アルコーブがある。` + lair4RoomStatusText('LAIR4_ROOM_1'),
 choices:()=>{
  const ns = PC._lair4Dungeon.nodeState.LAIR4_ROOM_1;
  if(PC._lair4Dungeon.themeId && !ns.defeated) return [{label:_lairEncounterLabel(ns), fn:()=>startLair4Encounter('LAIR4_ROOM_1')}];
  const ch = [{label:'↓ 南の扉へ', fn:()=>go('LAIR4_ROOM_4')}];
  if(!PC._lair4AlcoveExamined){
   ch.push({label:' アルコーブの彫像を調べる', fn:()=>{ PC._lair4AlcoveExamined = true; lair4ExamineAlcove('LAIR4_ROOM_1'); }});
  }
  return ch;
 },
 },

 LAIR4_ROOM_6:{
 scene:'dungeon',
 area:3,
 txt:()=>`<span style="color:#f0ece0">${LAIR4_NAME}</span><br><br>
  25m四方の部屋。北壁東端に扉がある。南壁東端には扉があり、${PC._lair4DoorOpen_LAIR4_ROOM_7?'<span style="color:#e8e4d8">開いている。</span>':'鍵がかかっている。'}` + lair4RoomStatusText('LAIR4_ROOM_6'),
 choices:()=>{
  const ns = PC._lair4Dungeon.nodeState.LAIR4_ROOM_6;
  if(PC._lair4Dungeon.themeId && !ns.defeated) return [{label:_lairEncounterLabel(ns), fn:()=>startLair4Encounter('LAIR4_ROOM_6')}];
  const ch = [{label:'↑ 北の扉へ', fn:()=>go('LAIR4_ROOM_4')}];
  if(PC._lair4DoorOpen_LAIR4_ROOM_7) ch.push({label:'↓ 南の扉へ', fn:()=>go('LAIR4_ROOM_7')});
  else ch.push({label:'↓ 南の扉（施錠されている）を調べる', fn:()=>lair4TryDoor({level:1, dest:'LAIR4_ROOM_7', from:'LAIR4_ROOM_6', area:2})});
  return ch;
 },
 },

 LAIR4_ROOM_7:{
 scene:'dungeon',
 area:3,
 txt:()=>`<span style="color:#f0ece0">${LAIR4_NAME}</span><br><br>
  25m四方の部屋。天井は幾何学模様の壁画で覆われている。北壁西端に扉がある。` + lair4RoomStatusText('LAIR4_ROOM_7'),
 choices:()=>{
  const ns = PC._lair4Dungeon.nodeState.LAIR4_ROOM_7;
  if(PC._lair4Dungeon.themeId && !ns.defeated) return [{label:_lairEncounterLabel(ns), fn:()=>startLair4Encounter('LAIR4_ROOM_7')}];
  return [{label:'↑ 北の扉へ', fn:()=>go('LAIR4_ROOM_6')}];
 },
 },

 LAIR5_FRONT:{
 scene:'dungeon',
 txt:()=>{
  const lair = PC._lair5Dungeon;
  const flavor = (lair && lair.themeId)
   ? _lair5GetTheme(lair.themeId).entryFlavor
   : 'あたりは静まり返っており、これといった気配は感じられない。';
  return `<span style="color:#f0ece0">${LAIR5_NAME} ── 入口前</span><br><br>
  桟橋から続く獣道を抜けると、鬱蒼とした木々の合間に古びたダンジョンの入口が見えてくる。${flavor}`;
 },
 choices:()=>{
  const ch = [{label:'→ 中へ入る', fn:()=>{ initTorch(); go('LAIR5_PASSAGE_1'); }}];
  if(PC._lair5B3ShortcutFound) ch.push({label:'→ 森の中の階段から入る（地下3階）', fn:()=>{ initTorch(); go('LAIR5_B3_PASSAGE_4'); }});
  ch.push({label:'↑ マラカイへ戻る（船で5日）', fn:()=>startLair5ReturnJourney()});
  return ch;
 },
 },

 LAIR5_PASSAGE_1:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">${LAIR5_NAME}</span><br><br>
  南北25mの通路。北端は地上へ続く北向きの階段につながっている。南端は西に折れて通路へ続く。東壁中央に部屋への扉がある。`,
 choices:[
  {label:'↑ 地上へ戻る', fn:()=>go('LAIR5_FRONT')},
  {label:'↓ 南の通路へ', fn:()=>go('LAIR5_PASSAGE_2')},
  {label:'→ 東の扉へ', fn:()=>go('LAIR5_ROOM_1')},
 ],
 },

 LAIR5_PASSAGE_2:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">${LAIR5_NAME}</span><br><br>
  東西15mの通路。東端は北へ折れて通路へ続く。西端も北へ折れて別の通路へ続く。`,
 choices:[
  {label:'→ 東の通路へ', fn:()=>go('LAIR5_PASSAGE_1')},
  {label:'← 西の通路へ', fn:()=>go('LAIR5_PASSAGE_3')},
 ],
 },

 LAIR5_PASSAGE_3:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">${LAIR5_NAME}</span><br><br>
  南北25mの通路。南端は東に折れて通路へ続く。北端は地下2階への下り階段が北へと続いている。`,
 choices:[
  {label:'↓ 南の通路へ', fn:()=>go('LAIR5_PASSAGE_2')},
  {label:'↑ 北の下り階段へ', fn:()=>go('LAIR5_B2_PASSAGE_1')},
 ],
 },

 LAIR5_ROOM_1:{
 scene:'dungeon',
 area:1,
 txt:()=>`<span style="color:#f0ece0">${LAIR5_NAME}</span><br><br>
  南北35m東西15mの部屋。西壁の南端から15mのところに通路への扉がある。東壁の北端に扉がある。東壁南端には扉があり、${PC._lair5DoorOpen_LAIR5_DOOR_1_3?'<span style="color:#e8e4d8">開いている。</span>':'鍵がかかっている。'}南壁と西壁からは正体不明の深緑色の粘液が浸出している。` + lair5RoomStatusText('LAIR5_ROOM_1'),
 choices:()=>{
  const ns = PC._lair5Dungeon.nodeState.LAIR5_ROOM_1;
  if(PC._lair5Dungeon.themeId && !ns.defeated) return [{label:_lair5EncounterLabel(ns), fn:()=>startLair5Encounter('LAIR5_ROOM_1')}];
  const ch = [
   {label:'← 西の扉へ', fn:()=>go('LAIR5_PASSAGE_1')},
   {label:'→ 東の扉（北）へ', fn:()=>go('LAIR5_PASSAGE_4')},
  ];
  if(PC._lair5DoorOpen_LAIR5_DOOR_1_3) ch.push({label:'→ 東の扉（南）へ', fn:()=>go('LAIR5_ROOM_3')});
  else ch.push({label:'→ 東の扉（南・施錠されている）を調べる', fn:()=>lair5TryDoor({level:1, dest:'LAIR5_ROOM_3', from:'LAIR5_ROOM_1', area:1, key:'LAIR5_DOOR_1_3'})});
  if(!PC._lair5OozeExamined) ch.push({label:' 壁の粘液を調べる', fn:()=>{ PC._lair5OozeExamined = true; lair5ExamineOoze('LAIR5_ROOM_1'); }});
  return ch;
 },
 },

 LAIR5_PASSAGE_4:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">${LAIR5_NAME}</span><br><br>
  東西15mの通路。西端は部屋への扉で行き止まりになっている。東端の扉には、${PC._lair5DoorOpen_LAIR5_ROOM_2?'<span style="color:#e8e4d8">開いている。</span>':'鍵がかかっている。'}`,
 choices:()=>{
  const ch = [{label:'← 西の扉へ', fn:()=>go('LAIR5_ROOM_1')}];
  if(PC._lair5DoorOpen_LAIR5_ROOM_2) ch.push({label:'→ 東の扉へ', fn:()=>go('LAIR5_ROOM_2')});
  else ch.push({label:'→ 東の扉（施錠されている）を調べる', fn:()=>lair5TryDoor({level:1, dest:'LAIR5_ROOM_2', from:'LAIR5_PASSAGE_4', area:1})});
  return ch;
 },
 },

 LAIR5_ROOM_2:{
 scene:'dungeon',
 area:1,
 txt:()=>`<span style="color:#f0ece0">${LAIR5_NAME}</span><br><br>
  35m四方の部屋。西壁北端には扉があり、${PC._lair5DoorOpen_LAIR5_ROOM_2?'<span style="color:#e8e4d8">開いている。</span>':'鍵がかかっている。'}南壁東端から15mのところに扉があり、${PC._lair5DoorOpen_LAIR5_DOOR_2_5?'<span style="color:#e8e4d8">開いている。</span>':'鍵がかかっている。'}部屋の北西の角に彫刻が施された戦士の石像が台座の上に立っている。` + lair5RoomStatusText('LAIR5_ROOM_2'),
 choices:()=>{
  const ns = PC._lair5Dungeon.nodeState.LAIR5_ROOM_2;
  if(PC._lair5Dungeon.themeId && !ns.defeated) return [{label:_lair5EncounterLabel(ns), fn:()=>startLair5Encounter('LAIR5_ROOM_2')}];
  const ch = [];
  if(PC._lair5DoorOpen_LAIR5_ROOM_2) ch.push({label:'← 西の扉へ', fn:()=>go('LAIR5_PASSAGE_4')});
  else ch.push({label:'← 西の扉（施錠されている）を調べる', fn:()=>lair5TryDoor({level:1, dest:'LAIR5_PASSAGE_4', from:'LAIR5_ROOM_2', area:1, key:'LAIR5_ROOM_2'})});
  if(PC._lair5DoorOpen_LAIR5_DOOR_2_5) ch.push({label:'↓ 南の扉へ', fn:()=>go('LAIR5_ROOM_5')});
  else ch.push({label:'↓ 南の扉（施錠されている）を調べる', fn:()=>lair5TryDoor({level:1, dest:'LAIR5_ROOM_5', from:'LAIR5_ROOM_2', area:1, key:'LAIR5_DOOR_2_5'})});
  if(!PC._lair5StatueExamined) ch.push({label:' 戦士の石像を調べる', fn:()=>{ PC._lair5StatueExamined = true; lair5ExamineDanger({area:1, returnNode:'LAIR5_ROOM_2', successMsg:'石像を調べてみたが、特に何も発見できなかった。', failMsg:'石像に触れた途端、ガタン、と重い音が響いた！'}); }});
  return ch;
 },
 },

 LAIR5_ROOM_3:{
 scene:'dungeon',
 area:1,
 txt:()=>`<span style="color:#f0ece0">${LAIR5_NAME}</span><br><br>
  南北25m、東西15mの部屋。西壁南端から15mのところに扉があり、${PC._lair5DoorOpen_LAIR5_DOOR_1_3?'<span style="color:#e8e4d8">開いている。</span>':'鍵がかかっている。'}東壁南端に扉がある。北側の壁には不気味な人間の顔がいくつも彫られている。` + lair5RoomStatusText('LAIR5_ROOM_3'),
 choices:()=>{
  const ns = PC._lair5Dungeon.nodeState.LAIR5_ROOM_3;
  if(PC._lair5Dungeon.themeId && !ns.defeated) return [{label:_lair5EncounterLabel(ns), fn:()=>startLair5Encounter('LAIR5_ROOM_3')}];
  const ch = [];
  if(PC._lair5DoorOpen_LAIR5_DOOR_1_3) ch.push({label:'← 西の扉へ', fn:()=>go('LAIR5_ROOM_1')});
  else ch.push({label:'← 西の扉（施錠されている）を調べる', fn:()=>lair5TryDoor({level:1, dest:'LAIR5_ROOM_1', from:'LAIR5_ROOM_3', area:1, key:'LAIR5_DOOR_1_3'})});
  ch.push({label:'→ 東の扉へ', fn:()=>go('LAIR5_ROOM_5')});
  if(!PC._lair5FacesExamined) ch.push({label:' 壁の顔の彫刻を調べる', fn:()=>{ PC._lair5FacesExamined = true; lair5ExamineDanger({area:1, returnNode:'LAIR5_ROOM_3', successMsg:'いくつもの顔がじっとこちらを見返してくるようだったが、特に何も発見できなかった。', failMsg:'彫られた顔の一つと目が合った気がした瞬間、悪寒が走った！'}); }});
  return ch;
 },
 },

 LAIR5_ROOM_4:{
 scene:'dungeon',
 area:2,
 txt:()=>`<span style="color:#f0ece0">${LAIR5_NAME}</span><br><br>
  南北35m東西25mの部屋。南壁中央に鉄製の錆びた扉がある。床は白と黒が交互に並んだ正方形のタイルで覆われており、部屋の中央には黒焦げになった棍棒が横たわっている。` + lair5RoomStatusText('LAIR5_ROOM_4'),
 choices:()=>{
  const ns = PC._lair5Dungeon.nodeState.LAIR5_ROOM_4;
  if(PC._lair5Dungeon.themeId && !ns.defeated) return [{label:_lair5EncounterLabel(ns), fn:()=>startLair5Encounter('LAIR5_ROOM_4')}];
  const ch = [{label:'↓ 南の鉄製の錆びた扉へ', fn:()=>go('LAIR5_ROOM_9')}];
  if(!PC._lair5ClubExamined) ch.push({label:' 黒焦げの棍棒を調べる', fn:()=>{ PC._lair5ClubExamined = true; lair5ExamineDanger({area:2, returnNode:'LAIR5_ROOM_4', successMsg:'棍棒を調べてみたが、何も特殊なものではないようだ。', failMsg:'棍棒を手に取った瞬間、大きな物音を立ててしまった！'}); }});
  return ch;
 },
 },

 LAIR5_ROOM_5:{
 scene:'dungeon',
 area:1,
 txt:()=>`<span style="color:#f0ece0">${LAIR5_NAME}</span><br><br>
  南北15m東西35mの部屋。西壁北端に扉がある。西壁南端には鉄で補強された扉がある。南壁西端から15mのところに扉があり、${PC._lair5DoorOpen_LAIR5_ROOM_8?'<span style="color:#e8e4d8">開いている。</span>':'鍵がかかっている。'}北壁東端から15mのところに扉があり、${PC._lair5DoorOpen_LAIR5_DOOR_2_5?'<span style="color:#e8e4d8">開いている。</span>':'鍵がかかっている。'}` + lair5RoomStatusText('LAIR5_ROOM_5'),
 choices:()=>{
  const ns = PC._lair5Dungeon.nodeState.LAIR5_ROOM_5;
  if(PC._lair5Dungeon.themeId && !ns.defeated) return [{label:_lair5EncounterLabel(ns), fn:()=>startLair5Encounter('LAIR5_ROOM_5')}];
  const ch = [
   {label:'→ 西の扉へ', fn:()=>go('LAIR5_ROOM_3')},
   {label:'→ 西の鉄扉へ', fn:()=>go('LAIR5_PASSAGE_5')},
  ];
  if(PC._lair5DoorOpen_LAIR5_ROOM_8) ch.push({label:'↓ 南の扉へ', fn:()=>go('LAIR5_ROOM_8')});
  else ch.push({label:'↓ 南の扉（施錠されている）を調べる', fn:()=>lair5TryDoor({level:1, dest:'LAIR5_ROOM_8', from:'LAIR5_ROOM_5', area:1})});
  if(PC._lair5DoorOpen_LAIR5_DOOR_2_5) ch.push({label:'↑ 北の扉へ', fn:()=>go('LAIR5_ROOM_2')});
  else ch.push({label:'↑ 北の扉（施錠されている）を調べる', fn:()=>lair5TryDoor({level:1, dest:'LAIR5_ROOM_2', from:'LAIR5_ROOM_5', area:1, key:'LAIR5_DOOR_2_5'})});
  return ch;
 },
 },

 LAIR5_PASSAGE_5:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">${LAIR5_NAME}</span><br><br>
  東西5mの短い通路。東端は鉄で補強された扉で部屋に通じている。西端は部屋へのアーチになっている。`,
 choices:[
  {label:'→ 東の鉄扉へ', fn:()=>go('LAIR5_ROOM_5')},
  {label:'← 西のアーチへ', fn:()=>go('LAIR5_ROOM_6')},
 ],
 },

 LAIR5_ROOM_6:{
 scene:'dungeon',
 area:1,
 txt:()=>`<span style="color:#f0ece0">${LAIR5_NAME}</span><br><br>
  南北25m東西15mの部屋。東壁北端に通路へのアーチがある。南壁西端には扉があり、${PC._lair5DoorOpen_LAIR5_ROOM_9?'<span style="color:#e8e4d8">開いている。</span>':'鍵がかかっている。'}` + lair5RoomStatusText('LAIR5_ROOM_6'),
 choices:()=>{
  const ns = PC._lair5Dungeon.nodeState.LAIR5_ROOM_6;
  if(PC._lair5Dungeon.themeId && !ns.defeated) return [{label:_lair5EncounterLabel(ns), fn:()=>startLair5Encounter('LAIR5_ROOM_6')}];
  const ch = [{label:'→ 東のアーチへ', fn:()=>go('LAIR5_PASSAGE_5')}];
  if(PC._lair5DoorOpen_LAIR5_ROOM_9) ch.push({label:'↓ 南の扉へ', fn:()=>go('LAIR5_ROOM_9')});
  else ch.push({label:'↓ 南の扉（施錠されている）を調べる', fn:()=>lair5TryDoor({level:1, dest:'LAIR5_ROOM_9', from:'LAIR5_ROOM_6', area:1})});
  return ch;
 },
 },

 LAIR5_ROOM_7:{
 scene:'dungeon',
 area:2,
 txt:()=>`<span style="color:#f0ece0">${LAIR5_NAME}</span><br><br>
  南北35m東西15mの部屋。東壁北端から15mのところに鉄製の扉がある。東壁南端にも扉がある。大昔には武器庫だったのかもしれない。壁には何世紀もの間についた刃物の傷が無数に刻まれ、部屋の中央には壊れた石のテーブルが置かれている。` + lair5RoomStatusText('LAIR5_ROOM_7'),
 choices:()=>{
  const ns = PC._lair5Dungeon.nodeState.LAIR5_ROOM_7;
  if(PC._lair5Dungeon.themeId && !ns.defeated) return [{label:_lair5EncounterLabel(ns), fn:()=>startLair5Encounter('LAIR5_ROOM_7')}];
  const ch = [
   {label:'→ 東の鉄製の扉（北）へ', fn:()=>go('LAIR5_ROOM_8')},
   {label:'→ 東の扉（南）へ', fn:()=>go('LAIR5_ROOM_10')},
  ];
  if(!PC._lair5TableExamined) ch.push({label:' 壊れた石のテーブルを調べる', fn:()=>{ PC._lair5TableExamined = true; lair5ExamineDanger({area:2, returnNode:'LAIR5_ROOM_7', successMsg:'テーブルの残骸を調べてみたが、特に何もなかった。', failMsg:'テーブルの残骸をどかした拍子に、大きな物音を立ててしまった！'}); }});
  return ch;
 },
 },

 LAIR5_ROOM_8:{
 scene:'dungeon',
 area:1,
 txt:()=>`<span style="color:#f0ece0">${LAIR5_NAME}</span><br><br>
  15m四方の部屋。北壁西端に扉がある。西壁南端には鉄製の扉があり、${PC._lair5DoorOpen_LAIR5_ROOM_7?'<span style="color:#e8e4d8">開いている。</span>':'鍵がかかっている。'}南壁東端に部屋へのアーチがある。石でできた祭壇が部屋の東側に鎮座している。` + lair5RoomStatusText('LAIR5_ROOM_8'),
 choices:()=>{
  const ns = PC._lair5Dungeon.nodeState.LAIR5_ROOM_8;
  if(PC._lair5Dungeon.themeId && !ns.defeated) return [{label:_lair5EncounterLabel(ns), fn:()=>startLair5Encounter('LAIR5_ROOM_8')}];
  const ch = [
   {label:'↑ 北の扉へ', fn:()=>go('LAIR5_ROOM_5')},
   {label:'↓ 南のアーチへ', fn:()=>go('LAIR5_ROOM_10')},
  ];
  if(PC._lair5DoorOpen_LAIR5_ROOM_7) ch.push({label:'← 西の鉄製の扉へ', fn:()=>go('LAIR5_ROOM_7')});
  else ch.push({label:'← 西の鉄製の扉（施錠されている）を調べる', fn:()=>lair5TryDoor({level:1, dest:'LAIR5_ROOM_7', from:'LAIR5_ROOM_8', area:1})});
  if(!PC._lair5AltarExamined) ch.push({label:' 石の祭壇を調べる', fn:()=>{ PC._lair5AltarExamined = true; lair5ExamineAltar('LAIR5_ROOM_8'); }});
  return ch;
 },
 },

 LAIR5_ROOM_9:{
 scene:'dungeon',
 area:1,
 txt:()=>`<span style="color:#f0ece0">${LAIR5_NAME}</span><br><br>
  南北15m東西25mの部屋。北壁東端に扉がある。北壁西端には鉄製の錆びた扉がある。` + lair5RoomStatusText('LAIR5_ROOM_9'),
 choices:()=>{
  const ns = PC._lair5Dungeon.nodeState.LAIR5_ROOM_9;
  if(PC._lair5Dungeon.themeId && !ns.defeated) return [{label:_lair5EncounterLabel(ns), fn:()=>startLair5Encounter('LAIR5_ROOM_9')}];
  return [
   {label:'↑ 北の扉（東）へ', fn:()=>go('LAIR5_ROOM_6')},
   {label:'↑ 北の鉄製の錆びた扉（西）へ', fn:()=>go('LAIR5_ROOM_4')},
  ];
 },
 },

 LAIR5_ROOM_10:{
 scene:'dungeon',
 area:1,
 txt:()=>`<span style="color:#f0ece0">${LAIR5_NAME}</span><br><br>
  15m四方の部屋。北壁西端に部屋へのアーチがある。西壁南端に扉がある。床は神秘的な模様のタイルモザイクで覆われており、天井はひび割れだらけである。` + lair5RoomStatusText('LAIR5_ROOM_10'),
 choices:()=>{
  const ns = PC._lair5Dungeon.nodeState.LAIR5_ROOM_10;
  if(PC._lair5Dungeon.themeId && !ns.defeated) return [{label:_lair5EncounterLabel(ns), fn:()=>startLair5Encounter('LAIR5_ROOM_10')}];
  return [
   {label:'↑ 北のアーチへ', fn:()=>go('LAIR5_ROOM_8')},
   {label:'← 西の扉へ', fn:()=>go('LAIR5_ROOM_7')},
  ];
 },
 },

 LAIR5_B2_PASSAGE_1:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">${LAIR5_NAME} — 地下2階</span><br><br>
  南北35mの通路。北端は地下1階への上り階段が北へ続いている。途中で踊り場があり南へ向きを変えている。北端東壁に部屋へのアーチがある。南は暗くなっており、先が見えない。`,
 choices:[
  {label:'↑ 北の上り階段（地下1階）へ', fn:()=>go('LAIR5_PASSAGE_3')},
  {label:'→ 東のアーチへ', fn:()=>go('LAIR5_B2_ROOM_1')},
  {label:'↓ 南の暗がりへ', fn:()=>go('LAIR5_B2_PASSAGE_2')},
 ],
 },

 LAIR5_B2_ROOM_1:{
 scene:'dungeon',
 area:2,
 txt:()=>`<span style="color:#f0ece0">${LAIR5_NAME}</span><br><br>
  15m四方の部屋。西壁南端に通路へのアーチがある。` + lair5RoomStatusText('LAIR5_B2_ROOM_1'),
 choices:()=>{
  const ns = PC._lair5Dungeon.nodeState.LAIR5_B2_ROOM_1;
  if(PC._lair5Dungeon.themeId && !ns.defeated) return [{label:_lair5EncounterLabel(ns), fn:()=>startLair5Encounter('LAIR5_B2_ROOM_1')}];
  return [{label:'← 西のアーチへ', fn:()=>go('LAIR5_B2_PASSAGE_1')}];
 },
 },

 LAIR5_B2_PASSAGE_2:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">${LAIR5_NAME}</span><br><br>
  南北40mの通路。北は通路へつながっているが暗くて先が見えない。南端東壁に扉がある。南端南側には地下3階への下り階段が南へと続いている。`,
 choices:[
  {label:'↑ 北の暗がりへ', fn:()=>go('LAIR5_B2_PASSAGE_1')},
  {label:'→ 東の扉へ', fn:()=>go('LAIR5_B2_ROOM_7')},
  {label:'↓ 南の下り階段へ', fn:()=>go('LAIR5_B3_PASSAGE_1')},
 ],
 },


 LAIR5_B2_ROOM_7:{
 scene:'dungeon',
 area:2,
 txt:()=>`<span style="color:#f0ece0">${LAIR5_NAME}</span><br><br>
  南北35m東西25mの部屋。西壁の南端から15mのところに通路への扉がある。北壁中央には落とし格子があり、${lair5B2PortcullisAOpen()?'<span style="color:#e8e4d8">開いている。</span>':'固く閉じている。'}東壁の北端から15mのところに扉があり、${PC._lair5DoorOpen_LAIR5_B2_ROOM_8?'<span style="color:#e8e4d8">開いている。</span>':'鍵がかかっている。'}東壁の南端から15mのところに扉があり、${PC._lair5DoorOpen_LAIR5_B2_DOOR_7_P3?'<span style="color:#e8e4d8">開いている。</span>':'鍵がかかっている。'}` + lair5RoomStatusText('LAIR5_B2_ROOM_7'),
 choices:()=>{
  const ns = PC._lair5Dungeon.nodeState.LAIR5_B2_ROOM_7;
  if(PC._lair5Dungeon.themeId && !ns.defeated) return [{label:_lair5EncounterLabel(ns), fn:()=>startLair5Encounter('LAIR5_B2_ROOM_7')}];
  const ch = [{label:'← 西の扉へ', fn:()=>go('LAIR5_B2_PASSAGE_2')}];
  if(lair5B2PortcullisAOpen()) ch.push({label:'↑ 北の落とし格子へ', fn:()=>go('LAIR5_B2_ROOM_5')});
  if(PC._lair5DoorOpen_LAIR5_B2_ROOM_8) ch.push({label:'→ 東の扉（北）へ', fn:()=>go('LAIR5_B2_ROOM_8')});
  else ch.push({label:'→ 東の扉（北・施錠されている）を調べる', fn:()=>lair5TryDoor({level:2, dest:'LAIR5_B2_ROOM_8', from:'LAIR5_B2_ROOM_7', area:2})});
  if(PC._lair5DoorOpen_LAIR5_B2_DOOR_7_P3) ch.push({label:'→ 東の扉（南）へ', fn:()=>go('LAIR5_B2_PASSAGE_3')});
  else ch.push({label:'→ 東の扉（南・施錠されている）を調べる', fn:()=>lair5TryDoor({level:2, dest:'LAIR5_B2_PASSAGE_3', from:'LAIR5_B2_ROOM_7', area:2, key:'LAIR5_B2_DOOR_7_P3'})});
  return ch;
 },
 },

 LAIR5_B2_ROOM_5:{
 scene:'dungeon',
 area:2,
 txt:()=>`<span style="color:#f0ece0">${LAIR5_NAME}</span><br><br>
  南北15m東西35mの部屋。北壁西端から15mのところに扉がある。南壁西端から15mのところには落とし格子があり、${lair5B2PortcullisAOpen()?'<span style="color:#e8e4d8">開いている。</span>':'固く閉じている。'}` + lair5RoomStatusText('LAIR5_B2_ROOM_5'),
 choices:()=>{
  const ns = PC._lair5Dungeon.nodeState.LAIR5_B2_ROOM_5;
  if(PC._lair5Dungeon.themeId && !ns.defeated) return [{label:_lair5EncounterLabel(ns), fn:()=>startLair5Encounter('LAIR5_B2_ROOM_5')}];
  const ch = [{label:'↑ 北の扉へ', fn:()=>go('LAIR5_B2_PASSAGE_5')}];
  if(lair5B2PortcullisAOpen()) ch.push({label:'↓ 南の落とし格子へ', fn:()=>go('LAIR5_B2_ROOM_7')});
  return ch;
 },
 },

 LAIR5_B2_PASSAGE_5:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">${LAIR5_NAME}</span><br><br>
  南北15mの通路。北端は行き止まりになっている。東壁に扉がある。南端は扉で行き止まりになっている。`,
 choices:[
  {label:'→ 東の扉へ', fn:()=>go('LAIR5_B2_ROOM_2')},
  {label:'↓ 南の扉へ', fn:()=>go('LAIR5_B2_ROOM_5')},
 ],
 },

 LAIR5_B2_ROOM_2:{
 scene:'dungeon',
 area:2,
 txt:()=>`<span style="color:#f0ece0">${LAIR5_NAME}</span><br><br>
  南北35m東西15mの部屋。東壁南端には扉があり、${PC._lair5DoorOpen_LAIR5_B2_DOOR_2_4?'<span style="color:#e8e4d8">開いている。</span>':'鍵がかかっている。'}西壁南端から15mのところに扉がある。` + lair5RoomStatusText('LAIR5_B2_ROOM_2'),
 choices:()=>{
  const ns = PC._lair5Dungeon.nodeState.LAIR5_B2_ROOM_2;
  if(PC._lair5Dungeon.themeId && !ns.defeated) return [{label:_lair5EncounterLabel(ns), fn:()=>startLair5Encounter('LAIR5_B2_ROOM_2')}];
  const ch = [{label:'← 西の扉へ', fn:()=>go('LAIR5_B2_PASSAGE_5')}];
  if(PC._lair5DoorOpen_LAIR5_B2_DOOR_2_4) ch.push({label:'→ 東の扉へ', fn:()=>go('LAIR5_B2_ROOM_4')});
  else ch.push({label:'→ 東の扉（施錠されている）を調べる', fn:()=>lair5TryDoor({level:2, dest:'LAIR5_B2_ROOM_4', from:'LAIR5_B2_ROOM_2', area:2, key:'LAIR5_B2_DOOR_2_4'})});
  return ch;
 },
 },

 LAIR5_B2_ROOM_4:{
 scene:'dungeon',
 area:2,
 txt:()=>`<span style="color:#f0ece0">${LAIR5_NAME}</span><br><br>
  南北35m東西15の部屋。床は浅いお椀のようで、薄暗い隅には厚い泥の層が広がっている。北壁東端に扉がある。西壁北端から15mのところに扉があり、${PC._lair5DoorOpen_LAIR5_B2_DOOR_2_4?'<span style="color:#e8e4d8">開いている。</span>':'鍵がかかっている。'}` + lair5RoomStatusText('LAIR5_B2_ROOM_4'),
 choices:()=>{
  const ns = PC._lair5Dungeon.nodeState.LAIR5_B2_ROOM_4;
  if(PC._lair5Dungeon.themeId && !ns.defeated) return [{label:_lair5EncounterLabel(ns), fn:()=>startLair5Encounter('LAIR5_B2_ROOM_4')}];
  const ch = [{label:'↑ 北の扉へ', fn:()=>go('LAIR5_B2_PASSAGE_4')}];
  if(PC._lair5DoorOpen_LAIR5_B2_DOOR_2_4) ch.push({label:'← 西の扉へ', fn:()=>go('LAIR5_B2_ROOM_2')});
  else ch.push({label:'← 西の扉（施錠されている）を調べる', fn:()=>lair5TryDoor({level:2, dest:'LAIR5_B2_ROOM_2', from:'LAIR5_B2_ROOM_4', area:2, key:'LAIR5_B2_DOOR_2_4'})});
  return ch;
 },
 },

 LAIR5_B2_PASSAGE_4:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">${LAIR5_NAME}</span><br><br>
  南北15mの通路。北端は行き止まりになっている。東壁に扉がある。南端は扉で行き止まりになっている。`,
 choices:[
  {label:'→ 東の扉へ', fn:()=>go('LAIR5_B2_ROOM_3')},
  {label:'↓ 南の扉へ', fn:()=>go('LAIR5_B2_ROOM_4')},
 ],
 },

 LAIR5_B2_ROOM_3:{
 scene:'dungeon',
 area:3,
 txt:()=>`<span style="color:#f0ece0">${LAIR5_NAME}</span><br><br>
  南北35m東西25mの部屋。南壁西端に扉がある。西壁北端に扉がある。` + lair5RoomStatusText('LAIR5_B2_ROOM_3'),
 choices:()=>{
  const ns = PC._lair5Dungeon.nodeState.LAIR5_B2_ROOM_3;
  if(PC._lair5Dungeon.themeId && !ns.defeated) return [{label:_lair5EncounterLabel(ns), fn:()=>startLair5Encounter('LAIR5_B2_ROOM_3')}];
  return [
   {label:'↓ 南の扉へ', fn:()=>go('LAIR5_B2_ROOM_6')},
   {label:'← 西の扉へ', fn:()=>go('LAIR5_B2_PASSAGE_4')},
  ];
 },
 },

 LAIR5_B2_ROOM_6:{
 scene:'dungeon',
 area:2,
 txt:()=>`<span style="color:#f0ece0">${LAIR5_NAME}</span><br><br>
  25m四方の部屋。色あせて破れたタペストリーが東の壁に掛かっており、部屋の北西の隅には塩っぽい匂いのする水たまりができている。北壁西端には扉がある。南壁西端には扉があり、${PC._lair5DoorOpen_LAIR5_B2_DOOR_6_9?'<span style="color:#e8e4d8">開いている。</span>':'鍵がかかっている。'}` + lair5RoomStatusText('LAIR5_B2_ROOM_6'),
 choices:()=>{
  const ns = PC._lair5Dungeon.nodeState.LAIR5_B2_ROOM_6;
  if(PC._lair5Dungeon.themeId && !ns.defeated) return [{label:_lair5EncounterLabel(ns), fn:()=>startLair5Encounter('LAIR5_B2_ROOM_6')}];
  const ch = [{label:'↑ 北の扉へ', fn:()=>go('LAIR5_B2_ROOM_3')}];
  if(PC._lair5DoorOpen_LAIR5_B2_DOOR_6_9) ch.push({label:'↓ 南の扉へ', fn:()=>go('LAIR5_B2_ROOM_9')});
  else ch.push({label:'↓ 南の扉（施錠されている）を調べる', fn:()=>lair5TryDoor({level:2, dest:'LAIR5_B2_ROOM_9', from:'LAIR5_B2_ROOM_6', area:2, key:'LAIR5_B2_DOOR_6_9'})});
  if(!PC._lair5B2TapestryExamined) ch.push({label:' タペストリーを調べる', fn:()=>{ PC._lair5B2TapestryExamined = true; lair5ExamineDanger({area:2, returnNode:'LAIR5_B2_ROOM_6', successMsg:'タペストリーをめくってみたが、特に何もなかった。', failMsg:'タペストリーの陰から急に物音がした！'}); }});
  return ch;
 },
 },

 LAIR5_B2_ROOM_9:{
 scene:'dungeon',
 area:2,
 txt:()=>`<span style="color:#f0ece0">${LAIR5_NAME}</span><br><br>
  南北25m東西15mの部屋。西壁中央には扉があり、${PC._lair5DoorOpen_LAIR5_B2_DOOR_9_P3?'<span style="color:#e8e4d8">開いている。</span>':'鍵がかかっている。'}東壁南端には落とし格子があり、${lair5B2PortcullisBOpen()?'<span style="color:#e8e4d8">開いている。</span>':'固く閉じている。'}北壁東端には扉があり、${PC._lair5DoorOpen_LAIR5_B2_DOOR_6_9?'<span style="color:#e8e4d8">開いている。</span>':'鍵がかかっている。'}` + lair5RoomStatusText('LAIR5_B2_ROOM_9'),
 choices:()=>{
  const ns = PC._lair5Dungeon.nodeState.LAIR5_B2_ROOM_9;
  if(PC._lair5Dungeon.themeId && !ns.defeated) return [{label:_lair5EncounterLabel(ns), fn:()=>startLair5Encounter('LAIR5_B2_ROOM_9')}];
  const ch = [];
  if(PC._lair5DoorOpen_LAIR5_B2_DOOR_9_P3) ch.push({label:'← 西の扉へ', fn:()=>go('LAIR5_B2_PASSAGE_3')});
  else ch.push({label:'← 西の扉（施錠されている）を調べる', fn:()=>lair5TryDoor({level:2, dest:'LAIR5_B2_PASSAGE_3', from:'LAIR5_B2_ROOM_9', area:2, key:'LAIR5_B2_DOOR_9_P3'})});
  if(lair5B2PortcullisBOpen()) ch.push({label:'→ 東の落とし格子へ', fn:()=>go('LAIR5_B2_ROOM_10')});
  if(PC._lair5DoorOpen_LAIR5_B2_DOOR_6_9) ch.push({label:'↑ 北の扉へ', fn:()=>go('LAIR5_B2_ROOM_6')});
  else ch.push({label:'↑ 北の扉（施錠されている）を調べる', fn:()=>lair5TryDoor({level:2, dest:'LAIR5_B2_ROOM_6', from:'LAIR5_B2_ROOM_9', area:2, key:'LAIR5_B2_DOOR_6_9'})});
  return ch;
 },
 },

 LAIR5_B2_ROOM_10:{
 scene:'dungeon',
 area:2,
 txt:()=>`<span style="color:#f0ece0">${LAIR5_NAME}</span><br><br>
  南北25m東西15mの部屋。床にはタイルでできた迷宮が広がり、天井は水滴を垂らす鍾乳石で覆われている。西壁南端には落とし格子があり、${lair5B2PortcullisBOpen()?'<span style="color:#e8e4d8">開いている。</span>':'固く閉じている。'}北壁に大きなレバーがある。` + lair5RoomStatusText('LAIR5_B2_ROOM_10'),
 choices:()=>{
  const ns = PC._lair5Dungeon.nodeState.LAIR5_B2_ROOM_10;
  if(PC._lair5Dungeon.themeId && !ns.defeated) return [{label:_lair5EncounterLabel(ns), fn:()=>startLair5Encounter('LAIR5_B2_ROOM_10')}];
  const ch = [];
  if(lair5B2PortcullisBOpen()) ch.push({label:'← 西の落とし格子へ', fn:()=>go('LAIR5_B2_ROOM_9')});
  ch.push({label:' 大きなレバーを動かす', fn:()=>lair5B2PullLeverA('LAIR5_B2_ROOM_10')});
  return ch;
 },
 },

 LAIR5_B2_ROOM_8:{
 scene:'dungeon',
 area:2,
 txt:()=>`<span style="color:#f0ece0">${LAIR5_NAME}</span><br><br>
  15m四方の部屋。西壁南端に扉がある。東壁に大きなレバーがある。` + lair5RoomStatusText('LAIR5_B2_ROOM_8'),
 choices:()=>{
  const ns = PC._lair5Dungeon.nodeState.LAIR5_B2_ROOM_8;
  if(PC._lair5Dungeon.themeId && !ns.defeated) return [{label:_lair5EncounterLabel(ns), fn:()=>startLair5Encounter('LAIR5_B2_ROOM_8')}];
  return [
   {label:'← 西の扉へ', fn:()=>go('LAIR5_B2_ROOM_7')},
   {label:' 大きなレバーを動かす', fn:()=>lair5B2PullLeverB('LAIR5_B2_ROOM_8')},
  ];
 },
 },

 LAIR5_B2_PASSAGE_3:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">${LAIR5_NAME}</span><br><br>
  東西15mの通路。西端は扉で行き止まりになっており、${PC._lair5DoorOpen_LAIR5_B2_DOOR_7_P3?'<span style="color:#e8e4d8">開いている。</span>':'鍵がかかっている。'}東端も扉で行き止まりになっており、${PC._lair5DoorOpen_LAIR5_B2_DOOR_9_P3?'<span style="color:#e8e4d8">開いている。</span>':'鍵がかかっている。'}`,
 choices:()=>{
  const ch = [];
  if(PC._lair5DoorOpen_LAIR5_B2_DOOR_7_P3) ch.push({label:'← 西の扉へ', fn:()=>go('LAIR5_B2_ROOM_7')});
  else ch.push({label:'← 西の扉（施錠されている）を調べる', fn:()=>lair5TryDoor({level:2, dest:'LAIR5_B2_ROOM_7', from:'LAIR5_B2_PASSAGE_3', area:2, key:'LAIR5_B2_DOOR_7_P3'})});
  if(PC._lair5DoorOpen_LAIR5_B2_DOOR_9_P3) ch.push({label:'→ 東の扉へ', fn:()=>go('LAIR5_B2_ROOM_9')});
  else ch.push({label:'→ 東の扉（施錠されている）を調べる', fn:()=>lair5TryDoor({level:2, dest:'LAIR5_B2_ROOM_9', from:'LAIR5_B2_PASSAGE_3', area:2, key:'LAIR5_B2_DOOR_9_P3'})});
  return ch;
 },
 },

 LAIR5_B3_PASSAGE_1:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">${LAIR5_NAME} — 地下3階</span><br><br>
  東西35mの通路。西端北側には地下2階への上り階段が北へ延びている。西端から5mの北壁には扉があり、${PC._lair5DoorOpen_LAIR5_B3_DOOR_1_8?'<span style="color:#e8e4d8">開いている。</span>':'鍵がかかっている。'}東は暗くなっており、先が見えない。`,
 choices:()=>{
  const ch = [{label:'↑ 西の上り階段（地下2階）へ', fn:()=>go('LAIR5_B2_PASSAGE_2')}];
  if(PC._lair5DoorOpen_LAIR5_B3_DOOR_1_8) ch.push({label:'→ 北の扉へ', fn:()=>go('LAIR5_B3_ROOM_8')});
  else ch.push({label:'→ 北の扉（施錠されている）を調べる', fn:()=>lair5TryDoor({level:3, dest:'LAIR5_B3_ROOM_8', from:'LAIR5_B3_PASSAGE_1', area:3, key:'LAIR5_B3_DOOR_1_8'})});
  ch.push({label:'→ 東の暗がりへ', fn:()=>go('LAIR5_B3_PASSAGE_2')});
  return ch;
 },
 },

 LAIR5_B3_PASSAGE_2:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">${LAIR5_NAME}</span><br><br>
  東西25mの通路。西は通路へ続くが暗くなっていて先が見えない。東端は部屋へのアーチになっている。`,
 choices:[
  {label:'← 西の暗がりへ', fn:()=>go('LAIR5_B3_PASSAGE_1')},
  {label:'→ 東のアーチへ', fn:()=>go('LAIR5_B3_ROOM_10')},
 ],
 },

 LAIR5_B3_ROOM_10:{
 scene:'dungeon',
 area:3,
 txt:()=>`<span style="color:#f0ece0">${LAIR5_NAME}</span><br><br>
  25m四方の部屋。西壁南端に通路へのアーチがある。西壁北端に扉がある。北壁東端には落とし格子があり、${lair5B3PortcullisAOpen()?'<span style="color:#e8e4d8">開いている。</span>':'固く閉じている。'}` + lair5RoomStatusText('LAIR5_B3_ROOM_10'),
 choices:()=>{
  const ns = PC._lair5Dungeon.nodeState.LAIR5_B3_ROOM_10;
  if(PC._lair5Dungeon.themeId && !ns.defeated) return [{label:_lair5EncounterLabel(ns), fn:()=>startLair5Encounter('LAIR5_B3_ROOM_10')}];
  const ch = [
   {label:'← 西のアーチへ', fn:()=>go('LAIR5_B3_PASSAGE_2')},
   {label:'← 西の扉へ', fn:()=>go('LAIR5_B3_ROOM_9')},
  ];
  if(lair5B3PortcullisAOpen()) ch.push({label:'↑ 北の落とし格子へ', fn:()=>go('LAIR5_B3_ROOM_5')});
  return ch;
 },
 },

 LAIR5_B3_ROOM_9:{
 scene:'dungeon',
 area:3,
 txt:()=>`<span style="color:#f0ece0">${LAIR5_NAME}</span><br><br>
  南北15m東西35mの部屋。東壁北端に扉がある。北壁中央に扉がある。西壁北端に扉がある。` + lair5RoomStatusText('LAIR5_B3_ROOM_9'),
 choices:()=>{
  const ns = PC._lair5Dungeon.nodeState.LAIR5_B3_ROOM_9;
  if(PC._lair5Dungeon.themeId && !ns.defeated) return [{label:_lair5EncounterLabel(ns), fn:()=>startLair5Encounter('LAIR5_B3_ROOM_9')}];
  return [
   {label:'→ 東の扉へ', fn:()=>go('LAIR5_B3_ROOM_10')},
   {label:'↑ 北の扉へ', fn:()=>go('LAIR5_B3_ROOM_7')},
   {label:'← 西の扉へ', fn:()=>go('LAIR5_B3_ROOM_8')},
  ];
 },
 },

 LAIR5_B3_ROOM_8:{
 scene:'dungeon',
 area:3,
 txt:()=>`<span style="color:#f0ece0">${LAIR5_NAME}</span><br><br>
  南北15m東西25mの部屋。東壁北端に扉がある。南壁西端には扉があり、${PC._lair5DoorOpen_LAIR5_B3_DOOR_1_8?'<span style="color:#e8e4d8">開いている。</span>':'鍵がかかっている。'}` + lair5RoomStatusText('LAIR5_B3_ROOM_8'),
 choices:()=>{
  const ns = PC._lair5Dungeon.nodeState.LAIR5_B3_ROOM_8;
  if(PC._lair5Dungeon.themeId && !ns.defeated) return [{label:_lair5EncounterLabel(ns), fn:()=>startLair5Encounter('LAIR5_B3_ROOM_8')}];
  const ch = [{label:'→ 東の扉へ', fn:()=>go('LAIR5_B3_ROOM_9')}];
  if(PC._lair5DoorOpen_LAIR5_B3_DOOR_1_8) ch.push({label:'↓ 南の扉へ', fn:()=>go('LAIR5_B3_PASSAGE_1')});
  else ch.push({label:'↓ 南の扉（施錠されている）を調べる', fn:()=>lair5TryDoor({level:3, dest:'LAIR5_B3_PASSAGE_1', from:'LAIR5_B3_ROOM_8', area:3, key:'LAIR5_B3_DOOR_1_8'})});
  return ch;
 },
 },

 LAIR5_B3_ROOM_7:{
 scene:'dungeon',
 area:3,
 txt:()=>`<span style="color:#f0ece0">${LAIR5_NAME}</span><br><br>
  南北25m東西25mの部屋。西側の壁には傷みの激しい古代の伝説的な戦いらしきシーンを描いたタペストリーが掛けられている。南壁東端に扉がある。東壁中央に部屋へのアーチがある。北壁東端に扉がある。西壁南端に扉がある。` + lair5RoomStatusText('LAIR5_B3_ROOM_7'),
 choices:()=>{
  const ns = PC._lair5Dungeon.nodeState.LAIR5_B3_ROOM_7;
  if(PC._lair5Dungeon.themeId && !ns.defeated) return [{label:_lair5EncounterLabel(ns), fn:()=>startLair5Encounter('LAIR5_B3_ROOM_7')}];
  return [
   {label:'↓ 南の扉へ', fn:()=>go('LAIR5_B3_ROOM_9')},
   {label:'→ 東のアーチへ', fn:()=>go('LAIR5_B3_ROOM_4')},
   {label:'↑ 北の扉へ', fn:()=>go('LAIR5_B3_ROOM_1')},
   {label:'← 西の扉へ', fn:()=>go('LAIR5_B3_PASSAGE_3')},
  ];
 },
 },

 LAIR5_B3_PASSAGE_3:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">${LAIR5_NAME}</span><br><br>
  東西15mの通路。東端は部屋への扉で行き止まりになっている。西端は行き止まりになっており、北側に部屋へのアーチがある。`,
 choices:[
  {label:'→ 東の扉へ', fn:()=>go('LAIR5_B3_ROOM_7')},
  {label:'↖ 北のアーチへ', fn:()=>go('LAIR5_B3_ROOM_6')},
 ],
 },

 LAIR5_B3_ROOM_6:{
 scene:'dungeon',
 area:3,
 txt:()=>`<span style="color:#f0ece0">${LAIR5_NAME}</span><br><br>
  南北15m東西25mの部屋。南壁中央に通路へのアーチがある。北壁中央に大きなレバーがある。` + lair5RoomStatusText('LAIR5_B3_ROOM_6'),
 choices:()=>{
  const ns = PC._lair5Dungeon.nodeState.LAIR5_B3_ROOM_6;
  if(PC._lair5Dungeon.themeId && !ns.defeated) return [{label:_lair5EncounterLabel(ns), fn:()=>startLair5Encounter('LAIR5_B3_ROOM_6')}];
  return [
   {label:'↓ 南のアーチへ', fn:()=>go('LAIR5_B3_PASSAGE_3')},
   {label:' 大きなレバーを動かす', fn:()=>lair5B3PullLeverB('LAIR5_B3_ROOM_6')},
  ];
 },
 },

 LAIR5_B3_ROOM_1:{
 scene:'dungeon',
 area:4,
 txt:()=>`<span style="color:#f0ece0">${LAIR5_NAME}</span><br><br>
  35m四方の部屋。北西の角に潮の匂いのする水たまりがある。南壁東端に扉がある。東壁北端から15mのところに扉がある。西壁南端から15mのところに扉がある。` + lair5RoomStatusText('LAIR5_B3_ROOM_1'),
 choices:()=>{
  const ns = PC._lair5Dungeon.nodeState.LAIR5_B3_ROOM_1;
  if(PC._lair5Dungeon.themeId && !ns.defeated) return [{label:_lair5EncounterLabel(ns), fn:()=>startLair5Encounter('LAIR5_B3_ROOM_1')}];
  return [
   {label:'↓ 南の扉へ', fn:()=>go('LAIR5_B3_ROOM_7')},
   {label:'→ 東の扉へ', fn:()=>go('LAIR5_B3_ROOM_2')},
   {label:'← 西の扉へ', fn:()=>go('LAIR5_B3_PASSAGE_4')},
  ];
 },
 },

 LAIR5_B3_PASSAGE_4:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">${LAIR5_NAME}</span><br><br>
  南北15mの通路。南端東壁に扉がある。南端南側には地上の鬱蒼とした森の中に続く上り階段がある。北端は地下4階へ続く下り階段が北向きに続いている（途中踊り場があり南へ向きを変えている）。`,
 choices:[
  {label:'→ 東の扉へ', fn:()=>go('LAIR5_B3_ROOM_1')},
  {label:'↓ 南の上り階段（地上）へ', fn:()=>lair5B3ExitToSurface()},
  {label:'↑ 北の下り階段へ', fn:()=>go('LAIR5_B4_PASSAGE_1')},
 ],
 },

 LAIR5_B3_ROOM_2:{
 scene:'dungeon',
 area:4,
 txt:()=>`<span style="color:#f0ece0">${LAIR5_NAME}</span><br><br>
  25m四方の部屋。西壁中央に扉がある。東壁南端に部屋へのアーチがある。北壁中央に大きなレバーがある。` + lair5RoomStatusText('LAIR5_B3_ROOM_2'),
 choices:()=>{
  const ns = PC._lair5Dungeon.nodeState.LAIR5_B3_ROOM_2;
  if(PC._lair5Dungeon.themeId && !ns.defeated) return [{label:_lair5EncounterLabel(ns), fn:()=>startLair5Encounter('LAIR5_B3_ROOM_2')}];
  return [
   {label:'← 西の扉へ', fn:()=>go('LAIR5_B3_ROOM_1')},
   {label:'→ 東のアーチへ', fn:()=>go('LAIR5_B3_ROOM_3')},
   {label:' 大きなレバーを動かす', fn:()=>lair5B3PullLeverA('LAIR5_B3_ROOM_2')},
  ];
 },
 },

 LAIR5_B3_ROOM_3:{
 scene:'dungeon',
 area:4,
 txt:()=>`<span style="color:#f0ece0">${LAIR5_NAME}</span><br><br>
  南北25m東西15mの部屋。西壁南端に部屋へのアーチがある。北東には上下に延びる螺旋階段がある。` + lair5RoomStatusText('LAIR5_B3_ROOM_3'),
 choices:()=>{
  const ns = PC._lair5Dungeon.nodeState.LAIR5_B3_ROOM_3;
  if(PC._lair5Dungeon.themeId && !ns.defeated) return [{label:_lair5EncounterLabel(ns), fn:()=>startLair5Encounter('LAIR5_B3_ROOM_3')}];
  return [
   {label:'← 西のアーチへ', fn:()=>go('LAIR5_B3_ROOM_2')},
   {label:'↗ 螺旋階段を上る', fn:()=>lair5B3UseSpiralStairs()},
   {label:'↘ 螺旋階段を下る', fn:()=>lair5B3UseSpiralStairs()},
  ];
 },
 },

 LAIR5_B3_ROOM_4:{
 scene:'dungeon',
 area:3,
 txt:()=>`<span style="color:#f0ece0">${LAIR5_NAME}</span><br><br>
  25m四方の部屋。西壁南端に部屋へのアーチがある。東壁北端には落とし格子があり、${lair5B3PortcullisBOpen()?'<span style="color:#e8e4d8">開いている。</span>':'固く閉じている。'}` + lair5RoomStatusText('LAIR5_B3_ROOM_4'),
 choices:()=>{
  const ns = PC._lair5Dungeon.nodeState.LAIR5_B3_ROOM_4;
  if(PC._lair5Dungeon.themeId && !ns.defeated) return [{label:_lair5EncounterLabel(ns), fn:()=>startLair5Encounter('LAIR5_B3_ROOM_4')}];
  const ch = [{label:'← 西のアーチへ', fn:()=>go('LAIR5_B3_ROOM_7')}];
  if(lair5B3PortcullisBOpen()) ch.push({label:'→ 東の落とし格子へ', fn:()=>go('LAIR5_B3_ROOM_5')});
  return ch;
 },
 },

 LAIR5_B3_ROOM_5:{
 scene:'dungeon',
 area:3,
 txt:()=>`<span style="color:#f0ece0">${LAIR5_NAME}</span><br><br>
  南北35m東西15mの部屋。西壁北端には落とし格子があり、${lair5B3PortcullisBOpen()?'<span style="color:#e8e4d8">開いている。</span>':'固く閉じている。'}南壁東端にも落とし格子があり、${lair5B3PortcullisAOpen()?'<span style="color:#e8e4d8">開いている。</span>':'固く閉じている。'}` + lair5RoomStatusText('LAIR5_B3_ROOM_5'),
 choices:()=>{
  const ns = PC._lair5Dungeon.nodeState.LAIR5_B3_ROOM_5;
  if(PC._lair5Dungeon.themeId && !ns.defeated) return [{label:_lair5EncounterLabel(ns), fn:()=>startLair5Encounter('LAIR5_B3_ROOM_5')}];
  const ch = [];
  if(lair5B3PortcullisBOpen()) ch.push({label:'← 西の落とし格子へ', fn:()=>go('LAIR5_B3_ROOM_4')});
  if(lair5B3PortcullisAOpen()) ch.push({label:'↓ 南の落とし格子へ', fn:()=>go('LAIR5_B3_ROOM_10')});
  return ch;
 },
 },

 LAIR5_B4_PASSAGE_1:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">${LAIR5_NAME} — 地下4階</span><br><br>
  南北25mの通路。北端北側には地下3階への上り階段が続いている（途中踊り場で南向きに方向を変えている）。北端東側には扉がある。南端東側には落とし格子があり、${lair5B4PortcullisAOpen()?'<span style="color:#e8e4d8">開いている。</span>':'固く閉じている。'}`,
 choices:()=>{
  const ch = [
   {label:'↑ 北の上り階段（地下3階）へ', fn:()=>go('LAIR5_B3_PASSAGE_4')},
   {label:'→ 東の扉へ', fn:()=>go('LAIR5_B4_ROOM_2')},
  ];
  if(lair5B4PortcullisAOpen()) ch.push({label:'↓ 南の落とし格子へ', fn:()=>go('LAIR5_B4_ROOM_4')});
  return ch;
 },
 },

 LAIR5_B4_ROOM_2:{
 scene:'dungeon',
 area:4,
 txt:()=>`<span style="color:#f0ece0">${LAIR5_NAME}</span><br><br>
  15m四方の部屋。東壁中央に大きなレバーがある。西壁南端に扉がある。` + lair5RoomStatusText('LAIR5_B4_ROOM_2'),
 choices:()=>{
  const ns = PC._lair5Dungeon.nodeState.LAIR5_B4_ROOM_2;
  if(PC._lair5Dungeon.themeId && !ns.defeated) return [{label:_lair5EncounterLabel(ns), fn:()=>startLair5Encounter('LAIR5_B4_ROOM_2')}];
  return [
   {label:'← 西の扉へ', fn:()=>go('LAIR5_B4_PASSAGE_1')},
   {label:' 大きなレバーを動かす', fn:()=>lair5B4PullLeverA('LAIR5_B4_ROOM_2')},
  ];
 },
 },

 LAIR5_B4_ROOM_4:{
 scene:'dungeon',
 area:4,
 txt:()=>`<span style="color:#f0ece0">${LAIR5_NAME}</span><br><br>
  35m四方の部屋。西壁北端から15mのところには落とし格子があり、${lair5B4PortcullisAOpen()?'<span style="color:#e8e4d8">開いている。</span>':'固く閉じている。'}南壁西端から15mのところに扉がある。東壁南端に扉がある。東壁北端から15mのところに扉がある。` + (PC._lair5B4Door1to4Found?'北壁東端から15mのところに、隠し扉が見つかっている。':'') + lair5RoomStatusText('LAIR5_B4_ROOM_4'),
 choices:()=>{
  const ns = PC._lair5Dungeon.nodeState.LAIR5_B4_ROOM_4;
  if(PC._lair5Dungeon.themeId && !ns.defeated) return [{label:_lair5EncounterLabel(ns), fn:()=>startLair5Encounter('LAIR5_B4_ROOM_4')}];
  const ch = [];
  if(lair5B4PortcullisAOpen()) ch.push({label:'← 西の落とし格子へ', fn:()=>go('LAIR5_B4_PASSAGE_1')});
  ch.push({label:'↓ 南の扉へ', fn:()=>go('LAIR5_B4_ROOM_7')});
  ch.push({label:'→ 東の扉（南）へ', fn:()=>go('LAIR5_B4_PASSAGE_2')});
  ch.push({label:'→ 東の扉（北）へ', fn:()=>go('LAIR5_B4_ROOM_5')});
  if(PC._lair5B4Door1to4Found) ch.push({label:'↑ 北の隠し扉へ', fn:()=>go('LAIR5_B4_ROOM_1')});
  return ch;
 },
 },

 LAIR5_B4_ROOM_7:{
 scene:'dungeon',
 area:4,
 txt:()=>`<span style="color:#f0ece0">${LAIR5_NAME}</span><br><br>
  南北15m東西25mの部屋。床には6角形のタイルが整然と敷き詰められている。北壁西端に扉がある。東壁南端に鉄で補強された扉がある。南壁に大きなレバーがある。西壁はなく、部屋自体が大きな地下空間に開放されている。西端は高さ30m前後の崖になっており、崖の下からは激しい水の流れの音が聞こえてくる。` + lair5RoomStatusText('LAIR5_B4_ROOM_7'),
 choices:()=>{
  const ns = PC._lair5Dungeon.nodeState.LAIR5_B4_ROOM_7;
  if(PC._lair5Dungeon.themeId && !ns.defeated) return [{label:_lair5EncounterLabel(ns), fn:()=>startLair5Encounter('LAIR5_B4_ROOM_7')}];
  return [
   {label:'↑ 北の扉へ', fn:()=>go('LAIR5_B4_ROOM_4')},
   {label:'→ 東の扉へ', fn:()=>go('LAIR5_B4_PASSAGE_2')},
   {label:' 大きなレバーを動かす', fn:()=>lair5B4PullLeverB('LAIR5_B4_ROOM_7')},
  ];
 },
 },

 LAIR5_B4_PASSAGE_2:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">${LAIR5_NAME}</span><br><br>
  南北25mの通路。南端西壁に鉄で補強された扉がある。北端西壁に扉がある。北端東壁には落とし格子があり、${lair5B4PortcullisBOpen()?'<span style="color:#e8e4d8">開いている。</span>':'固く閉じている。'}`,
 choices:()=>{
  const ch = [
   {label:'↓ 南の扉へ', fn:()=>go('LAIR5_B4_ROOM_7')},
   {label:'↑ 北の扉へ', fn:()=>go('LAIR5_B4_ROOM_4')},
  ];
  if(lair5B4PortcullisBOpen()) ch.push({label:'→ 東の落とし格子へ', fn:()=>go('LAIR5_B4_ROOM_6')});
  return ch;
 },
 },

 LAIR5_B4_ROOM_6:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">${LAIR5_NAME}</span><br><br>
  15m四方の部屋。西壁北端には落とし格子があり、${lair5B4PortcullisBOpen()?'<span style="color:#e8e4d8">開いている。</span>':'固く閉じている。'}東壁北端に扉がある。`,
 choices:()=>{
  const ch = [];
  if(lair5B4PortcullisBOpen()) ch.push({label:'← 西の落とし格子へ', fn:()=>go('LAIR5_B4_PASSAGE_2')});
  ch.push({label:'→ 東の扉へ', fn:()=>go('LAIR5_B4_PASSAGE_3')});
  return ch;
 },
 },

 LAIR5_B4_PASSAGE_3:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">${LAIR5_NAME}</span><br><br>
  東西15mの通路。西端は部屋への扉で行き止まりになっている。東端は北へ折れ、通路へ続いている。`,
 choices:[
  {label:'← 西の扉へ', fn:()=>go('LAIR5_B4_ROOM_6')},
  {label:'↑ 北の通路へ', fn:()=>go('LAIR5_B4_PASSAGE_4')},
 ],
 },

 LAIR5_B4_PASSAGE_4:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">${LAIR5_NAME}</span><br><br>
  南北35mの通路。南端は東へ折れ、通路へ続いている。北端に鉄の扉がある。`,
 choices:[
  {label:'↓ 南の通路へ', fn:()=>go('LAIR5_B4_PASSAGE_3')},
  {label:'↑ 北の扉へ', fn:()=>go('LAIR5_B4_ROOM_3')},
 ],
 },

 LAIR5_B4_ROOM_3:{
 scene:'dungeon',
 area:5,
 txt:()=>`<span style="color:#f0ece0">${LAIR5_NAME}</span><br><br>
  南北15m東西35mの部屋。南壁東端に鉄の扉がある。南壁東端から15mのところに扉がある。西壁北端には扉があり、${PC._lair5DoorOpen_LAIR5_B4_DOOR_1_3?'<span style="color:#e8e4d8">開いている。</span>':'鍵がかかっている。'}部屋の東壁はなく、大きな地下空間に開放されている。東端は高さ30m前後の崖になっており、崖の下からは激しい水の流れの音が聞こえてくる。` + lair5RoomStatusText('LAIR5_B4_ROOM_3'),
 choices:()=>{
  const ns = PC._lair5Dungeon.nodeState.LAIR5_B4_ROOM_3;
  if(PC._lair5Dungeon.themeId && !ns.defeated) return [{label:_lair5EncounterLabel(ns), fn:()=>startLair5Encounter('LAIR5_B4_ROOM_3')}];
  const ch = [
   {label:'↓ 南の扉（東）へ', fn:()=>go('LAIR5_B4_PASSAGE_4')},
   {label:'↓ 南の扉（西）へ', fn:()=>go('LAIR5_B4_ROOM_5')},
  ];
  if(PC._lair5DoorOpen_LAIR5_B4_DOOR_1_3) ch.push({label:'← 西の扉へ', fn:()=>go('LAIR5_B4_ROOM_1')});
  else ch.push({label:'← 西の扉（施錠されている）を調べる', fn:()=>lair5TryDoor({level:4, dest:'LAIR5_B4_ROOM_1', from:'LAIR5_B4_ROOM_3', area:5, key:'LAIR5_B4_DOOR_1_3'})});
  return ch;
 },
 },

 LAIR5_B4_ROOM_5:{
 scene:'dungeon',
 area:5,
 txt:()=>`<span style="color:#f0ece0">${LAIR5_NAME}</span><br><br>
  南北25m東西35mの部屋。部屋の北東の角には破壊された石造りの水盤が置かれており、そこから鉄の鎖や手枷が引きちぎられた跡が残っている。北壁東端に扉がある。北壁西端に良く磨かれた鋼鉄の扉がある。西壁中央に扉がある。` + lair5RoomStatusText('LAIR5_B4_ROOM_5'),
 choices:()=>{
  const ns = PC._lair5Dungeon.nodeState.LAIR5_B4_ROOM_5;
  if(PC._lair5Dungeon.themeId && !ns.defeated) return [{label:_lair5EncounterLabel(ns), fn:()=>startLair5Encounter('LAIR5_B4_ROOM_5')}];
  return [
   {label:'↑ 北の扉（東）へ', fn:()=>go('LAIR5_B4_ROOM_3')},
   {label:'↑ 北の扉（西）へ', fn:()=>go('LAIR5_B4_ROOM_1')},
   {label:'← 西の扉へ', fn:()=>go('LAIR5_B4_ROOM_4')},
  ];
 },
 },

 LAIR5_B4_ROOM_1:{
 scene:'dungeon',
 area:5,
 txt:()=>`<span style="color:#f0ece0">${LAIR5_NAME}</span><br><br>
  南北35m東西25mの部屋。南壁東端に扉がある。東壁南端から15mのところには施錠された扉があり、${PC._lair5DoorOpen_LAIR5_B4_DOOR_1_3?'<span style="color:#e8e4d8">開いている。</span>':'鍵がかかっている。'}東壁北端から15mのところに、地下5階へと続く下り階段がある。南壁西端に良く磨かれた鋼鉄の扉がある。` + lair5RoomStatusText('LAIR5_B4_ROOM_1'),
 choices:()=>{
  const ns = PC._lair5Dungeon.nodeState.LAIR5_B4_ROOM_1;
  if(PC._lair5Dungeon.themeId && !ns.defeated) return [{label:_lair5EncounterLabel(ns), fn:()=>startLair5Encounter('LAIR5_B4_ROOM_1')}];
  const ch = [{label:'↓ 南の扉（東）へ', fn:()=>go('LAIR5_B4_ROOM_5')}];
  if(PC._lair5DoorOpen_LAIR5_B4_DOOR_1_3) ch.push({label:'→ 東の扉（南）へ', fn:()=>go('LAIR5_B4_ROOM_3')});
  else ch.push({label:'→ 東の扉（南、施錠されている）を調べる', fn:()=>lair5TryDoor({level:4, dest:'LAIR5_B4_ROOM_3', from:'LAIR5_B4_ROOM_1', area:5, key:'LAIR5_B4_DOOR_1_3'})});
  ch.push({label:'→ 東の下り階段（北）へ', fn:()=>go('LAIR5_B5_STUB')});
  ch.push({label:'↓ 南の扉（西）へ', fn:()=>lair5B4UseHiddenDoor('LAIR5_B4_ROOM_4', 'LAIR5_B4_ROOM_1')});
  return ch;
 },
 },

 LAIR5_B5_STUB:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">${LAIR5_NAME} — 地下5階への下り階段</span><br><br>
  部屋の隅から、地下5階へと続く階段が闇の中へ下っている。<br>
  <span style="color:#c0b098">……この先はまだ調査されていない。</span>`,
 choices:[
  {label:'⬅ 引き返す', fn:()=>go('LAIR5_B4_ROOM_1')},
 ],
 },


 // ══════════════════════════════════════════
 // 第6の固定ダンジョン「地中神殿の廃墟」（ニフルヴィクから徒歩5日）
 // ══════════════════════════════════════════
 NIFLAIR_FRONT:{
 scene:'dungeon',
 txt:()=>{
  const lair = PC._niflairDungeon;
  const flavor = (lair && lair.themeId)
   ? _lairScenarioAwareTheme(lair.themeId).entryFlavor
   : '地下への入口はひっそりと静まり返っており、これといった気配は感じられない。';
  return `<span style="color:#f0ece0">${NIFLAIR_NAME} ── 入口前</span><br><br>
  5日にわたる旅の末、地面に大きく口を開けた縦穴にたどり着いた。石段が地下へと続いている。${flavor}`;
 },
 choices:()=>[
  {label:'→ 穴の中へ入る', fn:()=>enterNiflairDungeon()},
  {label:'↑ ニフルヴィクへ戻る（徒歩5日）', fn:()=>startNiflairReturnJourney()},
 ],
 },

 NIFLAIR_ENTRANCE:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">${NIFLAIR_NAME} ── 入口</span><br><br>
  地上から北へ下る階段。降りきると5m四方の空間になっている。北壁には扉がある。`,
 choices:()=>[
  {label:'↑ 北の扉へ', fn:()=>niflairMove('NIFLAIR_ROOM1')},
  {label:'↓ 地上へ戻る', fn:()=>go('NIFLAIR_FRONT')},
 ],
 },

 NIFLAIR_ROOM1:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">${NIFLAIR_NAME}</span><br><br>
  南北15m、東西25mの部屋。東西南北それぞれの壁の中央に扉がついている。`,
 choices:()=>[
  {label:'↓ 南の扉へ（入口）', fn:()=>go('NIFLAIR_ENTRANCE')},
  {label:'↑ 北の扉へ', fn:()=>niflairMove('NIFLAIR_ROOM2')},
  {label:'← 西の扉へ', fn:()=>niflairMove('NIFLAIR_ROOM7')},
  {label:'→ 東の扉へ'+(PC._niflairR1TrapDone?'（罠は解除済み）':''), fn:()=>niflairRoom1EastDoor()},
 ],
 },

 NIFLAIR_ROOM2:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">${NIFLAIR_NAME}</span><br><br>
  15m四方の部屋。南壁中央に扉、北壁中央に扉、東壁北端に扉がある。部屋の中央には、かつて噴水であったらしい泉がある。`,
 choices:()=>[
  {label:'↓ 南の扉へ', fn:()=>go('NIFLAIR_ROOM1')},
  {label:'↑ 北の扉へ', fn:()=>niflairMove('NIFLAIR_ROOM3')},
  {label:'→ 東の扉へ', fn:()=>niflairMove('NIFLAIR_ROOM5')},
  {label:' 泉の水を飲んでみる', fn:()=>{
   const s = document.getElementById('story');
   if(s) s.innerHTML += `<br><br><span style="color:#c8b8a0">泉の水を口に含んでみたが、特に何も起こらなかった。</span>`;
   renderChoices([{label:'▶ OK', fn:()=>go('NIFLAIR_ROOM2')}]);
  }},
 ],
 },

 NIFLAIR_ROOM3:{
 scene:'dungeon',
 area:1,
 txt:()=>`<span style="color:#f0ece0">${NIFLAIR_NAME}</span><br><br>
  南北20m、東西15mの部屋。南壁中央に扉、東壁北端から10mのところに扉がある。西壁に共通語で「ギブスンはここで死んだ、彼の精神は壊れて」と刻まれている。` + _lairRoomStatusTextGeneric('niflair', 'NIFLAIR_ROOM3'),
 choices:()=>{
  const ns = PC._niflairDungeon.nodeState.NIFLAIR_ROOM3;
  if(PC._niflairDungeon.themeId && !ns.defeated) return [{label:_lairEncounterLabel(ns), fn:()=>_lairStartEncounterGeneric('niflair', 'NIFLAIR_ROOM3')}];
  return [
   {label:'↓ 南の扉へ', fn:()=>go('NIFLAIR_ROOM2')},
   {label:'→ 東の扉へ', fn:()=>niflairMove('NIFLAIR_PASSAGE1')},
  ];
 },
 },

 NIFLAIR_ROOM4:{
 scene:'dungeon',
 area:1,
 txt:()=>`<span style="color:#f0ece0">${NIFLAIR_NAME}</span><br><br>
  15m四方の部屋。西壁中央にアーチがあり、通路へつながっている。` + _lairRoomStatusTextGeneric('niflair', 'NIFLAIR_ROOM4'),
 choices:()=>{
  const ns = PC._niflairDungeon.nodeState.NIFLAIR_ROOM4;
  if(PC._niflairDungeon.themeId && !ns.defeated) return [{label:_lairEncounterLabel(ns), fn:()=>_lairStartEncounterGeneric('niflair', 'NIFLAIR_ROOM4')}];
  return [{label:'← 西のアーチへ', fn:()=>niflairMove('NIFLAIR_PASSAGE1')}];
 },
 },

 NIFLAIR_PASSAGE1:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">${NIFLAIR_NAME}</span><br><br>
  東西15mの通路。西端は部屋への扉、東端の東壁にはアーチが、南壁には扉がある。`,
 choices:()=>[
  {label:'← 西の扉へ', fn:()=>go('NIFLAIR_ROOM3')},
  {label:'→ 東のアーチへ', fn:()=>go('NIFLAIR_ROOM4')},
  {label:'↓ 南の扉へ', fn:()=>go('NIFLAIR_ROOM5')},
 ],
 },

 NIFLAIR_ROOM5:{
 scene:'dungeon',
 area:1,
 txt:()=>`<span style="color:#f0ece0">${NIFLAIR_NAME}</span><br><br>
  15m四方の部屋。北壁東端に扉、西壁南端に扉、東壁中央に扉がある。` + _lairRoomStatusTextGeneric('niflair', 'NIFLAIR_ROOM5'),
 choices:()=>{
  const ns = PC._niflairDungeon.nodeState.NIFLAIR_ROOM5;
  if(PC._niflairDungeon.themeId && !ns.defeated) return [{label:_lairEncounterLabel(ns), fn:()=>_lairStartEncounterGeneric('niflair', 'NIFLAIR_ROOM5')}];
  return [
   {label:'↑ 北の扉へ', fn:()=>go('NIFLAIR_PASSAGE1')},
   {label:'← 西の扉へ', fn:()=>go('NIFLAIR_ROOM2')},
   {label:'→ 東の扉へ', fn:()=>go('NIFLAIR_ROOM6')},
  ];
 },
 },

 NIFLAIR_ROOM6:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">${NIFLAIR_NAME}</span><br><br>
  南北25m、東西20mの部屋。西壁北端に扉がある。冷たい錬鉄で作られた円卓が、床に刻まれた魔法陣の中に置かれ、今も部屋の中央に鎮座している。`,
 choices:()=>[
  {label:'← 西の扉へ', fn:()=>go('NIFLAIR_ROOM5')},
 ],
 },

 NIFLAIR_ROOM7:{
 scene:'dungeon',
 area:2,
 txt:()=>`<span style="color:#f0ece0">${NIFLAIR_NAME}</span><br><br>
  南北35m、東西20mの部屋。東壁中央に扉、西壁中央に扉、北壁東端から10mのところに扉がある。` + _lairRoomStatusTextGeneric('niflair', 'NIFLAIR_ROOM7'),
 choices:()=>{
  const ns = PC._niflairDungeon.nodeState.NIFLAIR_ROOM7;
  if(PC._niflairDungeon.themeId && !ns.defeated) return [{label:_lairEncounterLabel(ns), fn:()=>_lairStartEncounterGeneric('niflair', 'NIFLAIR_ROOM7')}];
  return [
   {label:'→ 東の扉へ', fn:()=>go('NIFLAIR_ROOM1')},
   {label:'← 西の扉へ', fn:()=>niflairMove('NIFLAIR_HALL2')},
   {label:'↑ 北の扉へ', fn:()=>niflairMove('NIFLAIR_PASSAGE2')},
  ];
 },
 },

 NIFLAIR_PASSAGE2:{
 scene:'dungeon',
 area:1,
 txt:()=>`<span style="color:#f0ece0">${NIFLAIR_NAME}</span><br><br>
  南北15mの通路。南端は南壁に扉があり、北端は西に折れて別の通路へつながっている。`,
 choices:()=>[
  {label:'↓ 南の扉へ', fn:()=>go('NIFLAIR_ROOM7')},
  {label:'↖ 北→西へ', fn:()=>niflairMove('NIFLAIR_PASSAGE3')},
 ],
 },

 NIFLAIR_PASSAGE3:{
 scene:'dungeon',
 area:1,
 txt:()=>`<span style="color:#f0ece0">${NIFLAIR_NAME}</span><br><br>
  東西15mの通路。東端は南に折れて別の通路へ、西端は西壁の扉へつながっている。`,
 choices:()=>[
  {label:'↘ 東→南へ', fn:()=>niflairMove('NIFLAIR_PASSAGE2')},
  {label:'← 西の扉へ', fn:()=>niflairMove('NIFLAIR_HALL1')},
 ],
 },

 NIFLAIR_HALL1:{
 scene:'dungeon',
 area:2,
 txt:()=>`<span style="color:#f0ece0">${NIFLAIR_NAME}</span><br><br>
  幅10m、高さ20m、南北40mの柱廊。東壁北端から20mのところに通路への扉がある。北端は壁が崩れて行き止まりになっており、南端は柱廊が続いているが暗くなっていてよく見えない。`,
 choices:()=>[
  {label:'→ 東の扉へ', fn:()=>niflairMove('NIFLAIR_PASSAGE3')},
  {label:'↓ 南の柱廊へ', fn:()=>niflairMove('NIFLAIR_HALL2')},
 ],
 },

 NIFLAIR_HALL2:{
 scene:'dungeon',
 area:2,
 txt:()=>`<span style="color:#f0ece0">${NIFLAIR_NAME}</span><br><br>
  幅10m、高さ20m、南北35mの柱廊。北と南、どちらも暗くなっていて先がよく見えない。東壁北端から15mのあたりに部屋への扉がある。`,
 choices:()=>[
  {label:'↑ 北の柱廊へ', fn:()=>niflairMove('NIFLAIR_HALL1')},
  {label:'↓ 南の柱廊へ', fn:()=>niflairMove('NIFLAIR_HALL3')},
  {label:'→ 東の扉へ', fn:()=>niflairMove('NIFLAIR_ROOM7')},
 ],
 },

 NIFLAIR_HALL3:{
 scene:'dungeon',
 area:2,
 txt:()=>`<span style="color:#f0ece0">${NIFLAIR_NAME}</span><br><br>
  幅10m、高さ20m、南北35mの柱廊。北は柱廊が続いているが暗くなっていてよく見えない。南端は東に折れている。東壁北端から15mのところに別の柱廊への扉がある。`,
 choices:()=>[
  {label:'↑ 北の柱廊へ', fn:()=>niflairMove('NIFLAIR_HALL2')},
  {label:'↘ 南→東へ', fn:()=>niflairMove('NIFLAIR_HALL4')},
  {label:'→ 東の扉へ', fn:()=>niflairMove('NIFLAIR_HALL6')},
 ],
 },

 NIFLAIR_HALL4:{
 scene:'dungeon',
 area:2,
 txt:()=>`<span style="color:#f0ece0">${NIFLAIR_NAME}</span><br><br>
  幅10m、高さ20m、南北45mの柱廊。西端は北へ折れている。東端は南北に延びる柱廊とのT字路につながっている。南壁西端から25mのところに通路への扉がある。`,
 choices:()=>[
  {label:'↖ 西→北へ', fn:()=>niflairMove('NIFLAIR_HALL3')},
  {label:'→ 東のT字路へ', fn:()=>niflairMove('NIFLAIR_TJUNC1')},
  {label:'↓ 南の扉へ', fn:()=>niflairMove('NIFLAIR_PASSAGE4')},
 ],
 },

 NIFLAIR_TJUNC1:{
 scene:'dungeon',
 area:2,
 txt:()=>`<span style="color:#f0ece0">${NIFLAIR_NAME}</span><br><br>
  幅10m、高さ20mの柱廊のT字路。南北に延びる柱廊から、西に柱廊が分岐している。`,
 choices:()=>[
  {label:'↑ 北の柱廊へ', fn:()=>niflairMove('NIFLAIR_HALL5')},
  {label:'↓ 南の柱廊へ', fn:()=>niflairMove('NIFLAIR_HALL7')},
  {label:'← 西の柱廊へ', fn:()=>niflairMove('NIFLAIR_HALL4')},
 ],
 },

 NIFLAIR_HALL5:{
 scene:'dungeon',
 area:2,
 txt:()=>`<span style="color:#f0ece0">${NIFLAIR_NAME}</span><br><br>
  幅10m、高さ20m、南北20mの柱廊。南は西に柱廊が分岐するT字路へ、北端は西に折れている。`,
 choices:()=>[
  {label:'↓ 南のT字路へ', fn:()=>niflairMove('NIFLAIR_TJUNC1')},
  {label:'↖ 北→西へ', fn:()=>niflairMove('NIFLAIR_HALL6')},
 ],
 },

 NIFLAIR_HALL6:{
 scene:'dungeon',
 area:2,
 txt:()=>`<span style="color:#f0ece0">${NIFLAIR_NAME}</span><br><br>
  幅10m、高さ20m、東西40mの柱廊。東は南へ折れている。西端は行き止まりで、西壁に扉がある。`,
 choices:()=>[
  {label:'↘ 東→南へ', fn:()=>niflairMove('NIFLAIR_HALL5')},
  {label:'← 西の扉へ', fn:()=>niflairMove('NIFLAIR_HALL3')},
 ],
 },

 NIFLAIR_HALL7:{
 scene:'dungeon',
 area:2,
 txt:()=>`<span style="color:#f0ece0">${NIFLAIR_NAME}</span><br><br>
  幅10m、高さ20m、南北40mの柱廊。北は西に柱廊が分岐するT字路へ、南端は東に折れている。西壁南端から25mのところに通路への扉がある。`,
 choices:()=>[
  {label:'↑ 北のT字路へ', fn:()=>niflairMove('NIFLAIR_TJUNC1')},
  {label:'↘ 南→東へ', fn:()=>niflairMove('NIFLAIR_HALL8')},
  {label:'← 西の扉へ', fn:()=>niflairMove('NIFLAIR_PASSAGE5')},
 ],
 },

 NIFLAIR_HALL8:{
 scene:'dungeon',
 area:2,
 txt:()=>`<span style="color:#f0ece0">${NIFLAIR_NAME}</span><br><br>
  幅10m、高さ20m、東西20mの柱廊。西端は北へ折れている。東端は部屋への大アーチになっている。`,
 choices:()=>[
  {label:'↖ 西→北へ', fn:()=>niflairMove('NIFLAIR_HALL7')},
  {label:'→ 東の大アーチへ', fn:()=>niflairMove('NIFLAIR_ROOM8')},
 ],
 },

 NIFLAIR_ROOM8:{
 scene:'dungeon',
 area:3,
 txt:()=>`<span style="color:#f0ece0">${NIFLAIR_NAME}</span><br><br>
  南北20m、東西30mの部屋。西壁中央に幅10mの大アーチが、北壁中央にも幅10mの大アーチがある。部屋の中央には、雑に鍛造された鉄製の長いテーブルが鎮座しており、その頭上には、ボロボロになり描かれていたものがなんであったか判別のできない旗が掲げられている。` + _lairRoomStatusTextGeneric('niflair', 'NIFLAIR_ROOM8'),
 choices:()=>{
  const ns = PC._niflairDungeon.nodeState.NIFLAIR_ROOM8;
  if(PC._niflairDungeon.themeId && !ns.defeated) return [{label:_lairEncounterLabel(ns), fn:()=>_lairStartEncounterGeneric('niflair', 'NIFLAIR_ROOM8')}];
  return [
   {label:'← 西の大アーチへ', fn:()=>niflairMove('NIFLAIR_HALL8')},
   {label:'↑ 北の大アーチへ', fn:()=>niflairMove('NIFLAIR_HALL9')},
  ];
 },
 },

 NIFLAIR_HALL9:{
 scene:'dungeon',
 area:2,
 txt:()=>`<span style="color:#f0ece0">${NIFLAIR_NAME}</span><br><br>
  幅10m、高さ20m、南北30mの柱廊。南端は部屋への大アーチ、北端も部屋への大アーチになっている。`,
 choices:()=>[
  {label:'↓ 南の大アーチへ', fn:()=>niflairMove('NIFLAIR_ROOM8')},
  {label:'↑ 北の大アーチへ', fn:()=>niflairMove('NIFLAIR_ROOM9')},
 ],
 },

 NIFLAIR_ROOM9:{
 scene:'dungeon',
 area:3,
 txt:()=>`<span style="color:#f0ece0">${NIFLAIR_NAME}</span><br><br>
  南北40m、東西30mの広間。南壁中央に幅10mの大アーチがある。崩落した天井の破片と見上げるほどの巨大な亀裂から、外の光が差し込んでいる。部屋の北端には禍々しい黒い蔦が絡みついた高台の祭壇がある。` + _lairRoomStatusTextGeneric('niflair', 'NIFLAIR_ROOM9'),
 choices:()=>{
  const ns = PC._niflairDungeon.nodeState.NIFLAIR_ROOM9;
  if(PC._niflairDungeon.themeId && !ns.defeated) return [{label:_lairEncounterLabel(ns), fn:()=>_lairStartEncounterGeneric('niflair', 'NIFLAIR_ROOM9')}];
  return [{label:'↓ 南の大アーチへ', fn:()=>niflairMove('NIFLAIR_HALL9')}];
 },
 },

 NIFLAIR_PASSAGE4:{
 scene:'dungeon',
 area:2,
 txt:()=>`<span style="color:#f0ece0">${NIFLAIR_NAME}</span><br><br>
  南北15mの通路。北端は北壁に柱廊への扉があり、南端は東に折れて別の通路へ、南端の南壁には部屋へのアーチがある。`,
 choices:()=>[
  {label:'↑ 北の扉へ', fn:()=>niflairMove('NIFLAIR_HALL4')},
  {label:'↘ 南→東へ', fn:()=>niflairMove('NIFLAIR_PASSAGE5')},
  {label:'↓ 南のアーチへ', fn:()=>niflairMove('NIFLAIR_ROOM10')},
 ],
 },

 NIFLAIR_ROOM10:{
 scene:'dungeon',
 area:2,
 txt:()=>`<span style="color:#f0ece0">${NIFLAIR_NAME}</span><br><br>
  15m四方の部屋。北壁中央に通路へのアーチがある。` + _lairRoomStatusTextGeneric('niflair', 'NIFLAIR_ROOM10'),
 choices:()=>{
  const ns = PC._niflairDungeon.nodeState.NIFLAIR_ROOM10;
  if(PC._niflairDungeon.themeId && !ns.defeated) return [{label:_lairEncounterLabel(ns), fn:()=>_lairStartEncounterGeneric('niflair', 'NIFLAIR_ROOM10')}];
  return [{label:'↑ 北のアーチへ', fn:()=>niflairMove('NIFLAIR_PASSAGE4')}];
 },
 },

 NIFLAIR_PASSAGE5:{
 scene:'dungeon',
 area:2,
 txt:()=>`<span style="color:#f0ece0">${NIFLAIR_NAME}</span><br><br>
  東西15mの通路。西端は北へ折れ曲がって別の通路へ、東端は東壁の扉へつながっている。`,
 choices:()=>[
  {label:'↖ 西→北へ', fn:()=>niflairMove('NIFLAIR_PASSAGE4')},
  {label:'→ 東の扉へ', fn:()=>niflairMove('NIFLAIR_HALL7')},
 ],
 },

 // ══════════════════════════════════════════
 // 第7の固定ダンジョン「古代の祈祷所」（エルマリアから徒歩4日）
 // ══════════════════════════════════════════
 LAIR6_FRONT:{
 scene:'dungeon',
 txt:()=>{
  const lair = PC._lair6Dungeon;
  const flavor = (lair && lair.themeId)
   ? _lairScenarioAwareTheme(lair.themeId).entryFlavor
   : 'あたりは静まり返っており、これといった気配は感じられない。';
  return `<span style="color:#f0ece0">${LAIR6_NAME} ── 入口前</span><br><br>
  4日にわたる旅の末、森の奥で苔むした古い石造りの建物にたどり着いた。かつては祈祷所だったとおぼしき佇まいだ。${flavor}${PC._lair6AltEntranceFound?'<br>裏手に回ると、目立たない扉がもう一つあるのに気づいている。':''}`;
 },
 choices:()=>{
  const ch = [
   {label:'→ 正面の扉から中へ入る', fn:()=>{ initTorch(); go('LAIR6_ROOM_A'); }},
  ];
  if(PC._lair6AltEntranceFound){
   ch.push({label:'→ 裏手の扉から中へ入る', fn:()=>{ initTorch(); go('LAIR6_PASSAGE_6'); }});
  }
  ch.push({label:'↑ エルマリアへ戻る（徒歩4日）', fn:()=>startLair6ReturnJourney()});
  return ch;
 },
 },

 LAIR6_ROOM_A:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">${LAIR6_NAME}</span><br><br>
  南北20m、東西15mの部屋。南壁中央に屋外へと通じる扉（入口）、北壁中央に扉がある。部屋の中央には、首の落ちた巨大なドワーフの石像が置かれている。`,
 choices:()=>[
  {label:'↓ 南の扉へ', fn:()=>go('LAIR6_FRONT')},
  {label:'↑ 北の扉へ', fn:()=>lair6CrossbowTrap('LAIR6_PASSAGE_1')},
 ],
 },

 LAIR6_PASSAGE_1:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">${LAIR6_NAME}</span><br><br>
  南北45mの通路。南壁南端に扉、北端北壁に金属製の扉がある。`,
 choices:()=>[
  {label:'↓ 南の扉へ', fn:()=>lair6CrossbowTrap('LAIR6_ROOM_A')},
  {label:'↑ 北の金属製の扉へ', fn:()=>go('LAIR6_PASSAGE_2')},
 ],
 },

 LAIR6_PASSAGE_2:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">${LAIR6_NAME}</span><br><br>
  東西45mの通路。東端東壁にアーチ、東端から20mの南壁に金属製の扉、東端から40mの南壁に扉がある。西側は暗くなっていて、その先の様子はうかがえない。`,
 choices:()=>[
  {label:'→ 東のアーチへ', fn:()=>lair6Move('LAIR6_ROOM_B')},
  {label:'↓ 南壁の金属製の扉へ', fn:()=>lair6CrossbowTrap('LAIR6_PASSAGE_1')},
  {label:'↓ 東端から40mの南壁の扉へ', fn:()=>lair6Move('LAIR6_ROOM_C')},
  {label:'← 西の暗がりへ', fn:()=>lair6Move('LAIR6_CROSS_1')},
 ],
 },

 LAIR6_ROOM_B:{
 scene:'dungeon',
 area:1,
 txt:()=>`<span style="color:#f0ece0">${LAIR6_NAME}</span><br><br>
  南北35m、東西20mの部屋。西壁真ん中にアーチがある。東壁には奇妙な図形がいくつも刻まれている。` + _lairRoomStatusTextGeneric('lair6', 'LAIR6_ROOM_B'),
 choices:()=>{
  const ns = PC._lair6Dungeon.nodeState.LAIR6_ROOM_B;
  if(PC._lair6Dungeon.themeId && !ns.defeated) return [{label:_lairEncounterLabel(ns), fn:()=>_lairStartEncounterGeneric('lair6', 'LAIR6_ROOM_B')}];
  return [{label:'← 西のアーチへ', fn:()=>go('LAIR6_PASSAGE_2')}];
 },
 },

 LAIR6_ROOM_C:{
 scene:'dungeon',
 area:1,
 txt:()=>`<span style="color:#f0ece0">${LAIR6_NAME}</span><br><br>
  南北20m、東西15mの部屋。北壁西端に扉、南壁中央に扉がある。` + _lairRoomStatusTextGeneric('lair6', 'LAIR6_ROOM_C'),
 choices:()=>{
  const ns = PC._lair6Dungeon.nodeState.LAIR6_ROOM_C;
  if(PC._lair6Dungeon.themeId && !ns.defeated) return [{label:_lairEncounterLabel(ns), fn:()=>_lairStartEncounterGeneric('lair6', 'LAIR6_ROOM_C')}];
  return [
   {label:'↑ 北の扉へ', fn:()=>go('LAIR6_PASSAGE_2')},
   {label:'↓ 南の扉へ', fn:()=>lair6Move('LAIR6_PASSAGE_4')},
  ];
 },
 },

 LAIR6_PASSAGE_3:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">${LAIR6_NAME}</span><br><br>
  南北15mの通路。北は通路が続いている。南端は行き止まりで、南壁に扉がある。`,
 choices:()=>[
  {label:'↑ 北へ', fn:()=>go('LAIR6_TJUNC_1')},
  {label:'↓ 南の扉へ', fn:()=>go('LAIR6_PASSAGE_2')},
 ],
 },

 LAIR6_PASSAGE_4:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">${LAIR6_NAME}</span><br><br>
  南北35mの通路。北端北壁に扉、北端から10mの西壁に扉がある。南端は西へ折れている。`,
 choices:()=>[
  {label:'↑ 北の扉へ', fn:()=>go('LAIR6_ROOM_C')},
  {label:'← 10m地点の扉へ', fn:()=>lair6Move('LAIR6_ROOM_D')},
  {label:'↙ 南西へ', fn:()=>lair6Move('LAIR6_PASSAGE_5')},
 ],
 },

 LAIR6_ROOM_D:{
 scene:'dungeon',
 area:2,
 txt:()=>`<span style="color:#f0ece0">${LAIR6_NAME}</span><br><br>
  南北20m、東西35mの部屋。東壁北端に扉、北壁西端から15mのところに扉がある。かつては水で満たされていたであろう円形の石造りプールが部屋の中央にある。底はひび割れ、いまや不気味な黒い澱みと見覚えのない小動物の骨が転がっている。` + _lairRoomStatusTextGeneric('lair6', 'LAIR6_ROOM_D'),
 choices:()=>{
  const ns = PC._lair6Dungeon.nodeState.LAIR6_ROOM_D;
  if(PC._lair6Dungeon.themeId && !ns.defeated) return [{label:_lairEncounterLabel(ns), fn:()=>_lairStartEncounterGeneric('lair6', 'LAIR6_ROOM_D')}];
  return [
   {label:'→ 東の扉へ', fn:()=>go('LAIR6_PASSAGE_4')},
   {label:'↑ 北の扉へ', fn:()=>lair6Move('LAIR6_ROOM_E')},
  ];
 },
 },

 LAIR6_PASSAGE_5:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">${LAIR6_NAME}</span><br><br>
  東西40mの通路。東端は北へ折れて別の通路へ、西端は南へ折れてさらに別の通路へと続いている。`,
 choices:()=>[
  {label:'→ 東へ', fn:()=>lair6Move('LAIR6_PASSAGE_4')},
  {label:'← 西へ', fn:()=>lair6Move('LAIR6_PASSAGE_6')},
 ],
 },

 LAIR6_PASSAGE_6:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">${LAIR6_NAME}</span><br><br>
  南北15mの通路。北端は東へ折れて別の通路へ続いている。南端に扉がある。`,
 choices:()=>[
  {label:'↑ 北へ', fn:()=>lair6Move('LAIR6_PASSAGE_5')},
  {label:'↓ 南の扉へ', fn:()=>{
   PC._lair6AltEntranceFound = true;
   go('LAIR6_FRONT');
  }},
 ],
 },

 LAIR6_ROOM_E:{
 scene:'dungeon',
 area:2,
 txt:()=>`<span style="color:#f0ece0">${LAIR6_NAME}</span><br><br>
  15m四方の部屋。南壁西端に扉、北壁東端に鉄で補強された扉、北壁西端に扉がある。` + _lairRoomStatusTextGeneric('lair6', 'LAIR6_ROOM_E'),
 choices:()=>{
  const ns = PC._lair6Dungeon.nodeState.LAIR6_ROOM_E;
  if(PC._lair6Dungeon.themeId && !ns.defeated) return [{label:_lairEncounterLabel(ns), fn:()=>_lairStartEncounterGeneric('lair6', 'LAIR6_ROOM_E')}];
  return [
   {label:'↓ 南の扉へ', fn:()=>go('LAIR6_ROOM_D')},
   {label:'↗ 北東の鉄扉へ', fn:()=>lair6Move('LAIR6_PASSAGE_7')},
   {label:'↖ 北西の扉へ', fn:()=>lair6Move('LAIR6_PASSAGE_8')},
  ];
 },
 },

 LAIR6_PASSAGE_7:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">${LAIR6_NAME}</span><br><br>
  南北10mの通路。南端は行き止まりで、南壁に鉄で補強された扉がある。北は通路が続いている。`,
 choices:()=>[
  {label:'↓ 南の扉へ', fn:()=>go('LAIR6_ROOM_E')},
  {label:'↑ 北へ', fn:()=>lair6Move('LAIR6_CROSS_1')},
 ],
 },

 LAIR6_PASSAGE_8:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">${LAIR6_NAME}</span><br><br>
  南北10mの通路。南端は行き止まりで、南壁に扉がある。北は通路が続いている。`,
 choices:()=>[
  {label:'↓ 南の扉へ', fn:()=>go('LAIR6_ROOM_E')},
  {label:'↑ 北へ', fn:()=>lair6Move('LAIR6_CROSS_2')},
 ],
 },

 LAIR6_CROSS_1:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">${LAIR6_NAME}</span><br><br>
  東西南北から通路が延びる交差点。東は先が暗くてよく見えない。南は通路が続いている。西は10mほど先で別の通路に繋がっている。北は通路が続いている。`,
 choices:()=>[
  {label:'→ 東へ', fn:()=>lair6Move('LAIR6_PASSAGE_2')},
  {label:'↓ 南へ', fn:()=>lair6Move('LAIR6_PASSAGE_7')},
  {label:'← 西へ', fn:()=>lair6Move('LAIR6_CROSS_2')},
  {label:'↑ 北へ', fn:()=>lair6Move('LAIR6_PASSAGE_9')},
 ],
 },

 LAIR6_CROSS_2:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">${LAIR6_NAME}</span><br><br>
  東西南北から通路が延びる交差点。東は10mほど先で別の通路に繋がっている。南は通路が続いている。西も北も通路が続いている。`,
 choices:()=>[
  {label:'→ 東へ', fn:()=>lair6Move('LAIR6_CROSS_1')},
  {label:'↓ 南へ', fn:()=>lair6Move('LAIR6_PASSAGE_8')},
  {label:'← 西へ', fn:()=>lair6Move('LAIR6_PASSAGE_10')},
  {label:'↑ 北へ', fn:()=>lair6Move('LAIR6_PASSAGE_11')},
 ],
 },

 LAIR6_PASSAGE_10:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">${LAIR6_NAME}</span><br><br>
  東西15mの通路。東端は通路が続いている。西端は行き止まりで、南壁に扉がある。`,
 choices:()=>[
  {label:'→ 東へ', fn:()=>lair6Move('LAIR6_CROSS_2')},
  {label:'↓ 南の扉へ', fn:()=>lair6Move('LAIR6_ROOM_F')},
 ],
 },

 LAIR6_ROOM_F:{
 scene:'dungeon',
 area:2,
 txt:()=>`<span style="color:#f0ece0">${LAIR6_NAME}</span><br><br>
  10m四方の部屋。北壁西端に扉がある。` + _lairRoomStatusTextGeneric('lair6', 'LAIR6_ROOM_F'),
 choices:()=>{
  const ns = PC._lair6Dungeon.nodeState.LAIR6_ROOM_F;
  if(PC._lair6Dungeon.themeId && !ns.defeated) return [{label:_lairEncounterLabel(ns), fn:()=>_lairStartEncounterGeneric('lair6', 'LAIR6_ROOM_F')}];
  return [{label:'↑ 北の扉へ', fn:()=>go('LAIR6_PASSAGE_10')}];
 },
 },

 LAIR6_PASSAGE_11:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">${LAIR6_NAME}</span><br><br>
  南北50mの通路。南は通路が続いている。北端は西へ折れている。`,
 choices:()=>[
  {label:'↓ 南へ', fn:()=>lair6Move('LAIR6_CROSS_2')},
  {label:'↖ 北西へ', fn:()=>lair6Move('LAIR6_PASSAGE_14')},
 ],
 },

 LAIR6_PASSAGE_14:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">${LAIR6_NAME}</span><br><br>
  東西25mの通路。東端は南へ折れて別の通路へ続いている。西端は行き止まり。西端から10mの北壁に扉がある。`,
 choices:()=>[
  {label:'→ 東へ', fn:()=>lair6Move('LAIR6_PASSAGE_11')},
  {label:'↑ 北の扉へ', fn:()=>lair6Move('LAIR6_PASSAGE_15')},
 ],
 },

 LAIR6_PASSAGE_15:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">${LAIR6_NAME}</span><br><br>
  南北10mの通路。南端南壁に扉がある。北端は行き止まり。`,
 choices:()=>[
  {label:'↓ 南の扉へ', fn:()=>go('LAIR6_PASSAGE_14')},
 ],
 },

 LAIR6_PASSAGE_9:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">${LAIR6_NAME}</span><br><br>
  南北25mの通路。南端は通路が続いている。北端北壁にアーチ、北端東壁に扉がある。`,
 choices:()=>[
  {label:'↓ 南へ', fn:()=>lair6Move('LAIR6_CROSS_1')},
  {label:'↑ 北のアーチへ', fn:()=>lair6Move('LAIR6_HALL_1')},
  {label:'↗ 北東の扉へ', fn:()=>lair6Move('LAIR6_PASSAGE_12')},
 ],
 },

 LAIR6_PASSAGE_12:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">${LAIR6_NAME}</span><br><br>
  東西5mの通路。西端は行き止まりで、西壁に扉がある。東は通路が続いている。`,
 choices:()=>[
  {label:'← 西の扉へ', fn:()=>lair6Move('LAIR6_PASSAGE_9')},
  {label:'→ 東へ', fn:()=>lair6Move('LAIR6_TJUNC_1')},
 ],
 },

 LAIR6_TJUNC_1:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">${LAIR6_NAME}</span><br><br>
  東西に走る通路から、南へ通路が分岐しているT字路。西は通路へ、南は通路へ、東は通路へと続いている。`,
 choices:()=>[
  {label:'← 西へ', fn:()=>lair6Move('LAIR6_PASSAGE_12')},
  {label:'↓ 南へ', fn:()=>lair6Move('LAIR6_PASSAGE_3')},
  {label:'→ 東へ', fn:()=>lair6Move('LAIR6_PASSAGE_13')},
 ],
 },

 LAIR6_PASSAGE_13:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">${LAIR6_NAME}</span><br><br>
  東西10mの通路。西は通路が続いている。東端は行き止まりで、壁龕があり、ドロドロに溶けて固まった大量の蝋燭が残されている。`,
 choices:()=>[
  {label:'← 西へ', fn:()=>go('LAIR6_TJUNC_1')},
 ],
 },

 LAIR6_HALL_1:{
 scene:'dungeon',
 area:3,
 txt:()=>`<span style="color:#f0ece0">${LAIR6_NAME}</span><br><br>
  幅15mで東西に35m延びる柱廊。西端南壁にアーチ、西端北壁にアーチがある。東端は北へ折れている。かつて美しい色彩を描いていたであろう天井の壁画は剥げ落ち、半ば崩落した柱が不気味な影を落としている。風が吹き抜けるたび、細い笛のような音が響く。` + _lairRoomStatusTextGeneric('lair6', 'LAIR6_HALL_1'),
 choices:()=>{
  const ns = PC._lair6Dungeon.nodeState.LAIR6_HALL_1;
  if(PC._lair6Dungeon.themeId && !ns.defeated) return [{label:_lairEncounterLabel(ns), fn:()=>_lairStartEncounterGeneric('lair6', 'LAIR6_HALL_1')}];
  return [
   {label:'↙ 南西のアーチへ', fn:()=>go('LAIR6_PASSAGE_9')},
   {label:'↖ 北西のアーチへ', fn:()=>lair6Move('LAIR6_PASSAGE_16')},
   {label:'→ 東へ', fn:()=>lair6Move('LAIR6_HALL_2')},
  ];
 },
 },

 LAIR6_PASSAGE_16:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">${LAIR6_NAME}</span><br><br>
  南北10mの通路。南端南壁にアーチがある。北端は行き止まり。`,
 choices:()=>[
  {label:'↓ 南のアーチへ', fn:()=>go('LAIR6_HALL_1')},
 ],
 },

 LAIR6_HALL_2:{
 scene:'dungeon',
 area:3,
 txt:()=>`<span style="color:#f0ece0">${LAIR6_NAME}</span><br><br>
  幅15mで南北40mに延びる柱廊。南端は西に折れている。北端は壁が崩落しており、それ以上先へは進めない。` + _lairRoomStatusTextGeneric('lair6', 'LAIR6_HALL_2'),
 choices:()=>{
  const ns = PC._lair6Dungeon.nodeState.LAIR6_HALL_2;
  if(PC._lair6Dungeon.themeId && !ns.defeated) return [{label:_lairEncounterLabel(ns), fn:()=>_lairStartEncounterGeneric('lair6', 'LAIR6_HALL_2')}];
  return [{label:'← 南西へ', fn:()=>go('LAIR6_HALL_1')}];
 },
 },

 // ══════════════════════════════════════════
 // 「ならず者の隠れ家」（第8の固定ダンジョン、デュナから徒歩2日）
 // ══════════════════════════════════════════
 LAIR7_FRONT:{
 scene:'dungeon',
 txt:()=>{
  const lair = PC._lair7Dungeon;
  const flavor = (lair && lair.themeId)
   ? _lairScenarioAwareTheme(lair.themeId).entryFlavor
   : 'あたりは静まり返っており、これといった気配は感じられない。';
  return `<span style="color:#f0ece0">${LAIR7_NAME} ── 入口前</span><br><br>
  デュナから2日、荒涼とした大地を進んだ先に、崩れかけた土壁に穿たれた坑道の入口を見つけた。${flavor}`;
 },
 choices:()=>[
  {label:'→ 坑道の中へ入る', fn:()=>{ initTorch(); go('LAIR7_HALL_1'); }},
  {label:'↑ デュナへ戻る（徒歩2日）', fn:()=>startLair7ReturnJourney()},
 ],
 },

 LAIR7_HALL_1:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">${LAIR7_NAME}</span><br><br>
  幅15mで南北45mに延びる柱廊。東壁南端から20mのところに開口部があり、外へとつながる手掘りの坑道となっている。北端北壁の中央に金属製の立派な両開きの扉がある。掘り崩された土壁の隙間から、優美な意匠が残る古代の柱がのぞいている。`,
 choices:()=>[
  {label:'→ 東の開口部から外へ', fn:()=>go('LAIR7_FRONT')},
  {label:'↑ 北の金属製の扉へ', fn:()=>lair7Move('LAIR7_ROOM_A')},
 ],
 },

 LAIR7_ROOM_A:{
 scene:'dungeon',
 area:1,
 txt:()=>`<span style="color:#f0ece0">${LAIR7_NAME}</span><br><br>
  南北20m東西25mの部屋。南壁中央に金属製の立派な両開きの扉、北壁中央にアーチがある。` + _lairRoomStatusTextGeneric('lair7', 'LAIR7_ROOM_A'),
 choices:()=>{
  const ns = PC._lair7Dungeon.nodeState.LAIR7_ROOM_A;
  if(PC._lair7Dungeon.themeId && !ns.defeated) return [{label:_lairEncounterLabel(ns), fn:()=>_lairStartEncounterGeneric('lair7', 'LAIR7_ROOM_A')}];
  return [
   {label:'↓ 南の扉へ', fn:()=>lair7Move('LAIR7_HALL_1')},
   {label:'↑ 北のアーチへ', fn:()=>lair7Move('LAIR7_ROOM_B')},
  ];
 },
 },

 LAIR7_ROOM_B:{
 scene:'dungeon',
 area:2,
 txt:()=>`<span style="color:#f0ece0">${LAIR7_NAME}</span><br><br>
  20m四方の部屋。南壁西端から10mのところにアーチ、北壁西端から10mのところに扉、西壁南端から10mのところに扉がある。豪奢なレリーフが施された石壁の下、崩れた土砂を押し除けるようにして獣の毛皮が敷かれている。強烈な獣臭と腐臭が立ち込めている。` + _lairRoomStatusTextGeneric('lair7', 'LAIR7_ROOM_B'),
 choices:()=>{
  const ns = PC._lair7Dungeon.nodeState.LAIR7_ROOM_B;
  if(PC._lair7Dungeon.themeId && !ns.defeated) return [{label:_lairEncounterLabel(ns), fn:()=>_lairStartEncounterGeneric('lair7', 'LAIR7_ROOM_B')}];
  return [
   {label:'↓ 南のアーチへ', fn:()=>lair7Move('LAIR7_ROOM_A')},
   {label:'↑ 北の扉へ', fn:()=>lair7Move('LAIR7_ROOM_C')},
   {label:'← 西の扉へ', fn:()=>lair7Move('LAIR7_PASSAGE_1')},
  ];
 },
 },

 LAIR7_ROOM_C:{
 scene:'dungeon',
 area:2,
 txt:()=>`<span style="color:#f0ece0">${LAIR7_NAME}</span><br><br>
  南北20m東西15mの部屋。南壁中央に扉がある。` + _lairRoomStatusTextGeneric('lair7', 'LAIR7_ROOM_C'),
 choices:()=>{
  const ns = PC._lair7Dungeon.nodeState.LAIR7_ROOM_C;
  if(PC._lair7Dungeon.themeId && !ns.defeated) return [{label:_lairEncounterLabel(ns), fn:()=>_lairStartEncounterGeneric('lair7', 'LAIR7_ROOM_C')}];
  return [{label:'↓ 南の扉へ', fn:()=>lair7Move('LAIR7_ROOM_B')}];
 },
 },

 LAIR7_PASSAGE_1:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">${LAIR7_NAME}</span><br><br>
  南北20mの通路。南端東側に扉、北端西側に扉がある。`,
 choices:()=>[
  {label:'↓ 南東の扉へ', fn:()=>lair7Move('LAIR7_ROOM_B')},
  {label:'↑ 北西の扉へ', fn:()=>lair7Move('LAIR7_ROOM_D')},
 ],
 },

 LAIR7_ROOM_D:{
 scene:'dungeon',
 area:2,
 txt:()=>`<span style="color:#f0ece0">${LAIR7_NAME}</span><br><br>
  南北15m東西25mの部屋。東壁中央に扉、西壁中央に扉がある。鮮やかなフレスコ画が残る壁に、粗悪な鉄の燭台が無理やり打ち込まれている。` + _lairRoomStatusTextGeneric('lair7', 'LAIR7_ROOM_D'),
 choices:()=>{
  const ns = PC._lair7Dungeon.nodeState.LAIR7_ROOM_D;
  if(PC._lair7Dungeon.themeId && !ns.defeated) return [{label:_lairEncounterLabel(ns), fn:()=>_lairStartEncounterGeneric('lair7', 'LAIR7_ROOM_D')}];
  return [
   {label:'→ 東の扉へ', fn:()=>lair7Move('LAIR7_PASSAGE_1')},
   {label:'← 西の扉へ', fn:()=>lair7Move('LAIR7_ROOM_E')},
  ];
 },
 },

 LAIR7_ROOM_E:{
 scene:'dungeon',
 area:3,
 txt:()=>`<span style="color:#f0ece0">${LAIR7_NAME}</span><br><br>
  15m四方の部屋。東壁に扉がある。` + _lairRoomStatusTextGeneric('lair7', 'LAIR7_ROOM_E'),
 choices:()=>{
  const ns = PC._lair7Dungeon.nodeState.LAIR7_ROOM_E;
  if(PC._lair7Dungeon.themeId && !ns.defeated) return [{label:_lairEncounterLabel(ns), fn:()=>_lairStartEncounterGeneric('lair7', 'LAIR7_ROOM_E')}];
  return [{label:'→ 東の扉へ', fn:()=>lair7Move('LAIR7_ROOM_D')}];
 },
 },

 // ══════════════════════════════════════════
 // 「地下哨所」（第9の固定ダンジョン、ストーンヘイムから徒歩2日）
 // ══════════════════════════════════════════
 OUTPOST_FRONT:{
 scene:'dungeon',
 txt:()=>{
  const lair = PC._outpostDungeon;
  const flavor = (lair && lair.themeId)
   ? _lairScenarioAwareTheme(lair.themeId).entryFlavor
   : 'あたりは静まり返っており、これといった気配は感じられない。';
  return `<span style="color:#f0ece0">${OUTPOST_NAME} ── 入口前</span><br><br>
  ストーンヘイムから2日、岩がちな鉱山地帯を進んだ先に、かつての哨所と思われる坑道の入口を見つけた。${flavor}`;
 },
 choices:()=>[
  {label:'→ 坑道の中へ入る', fn:()=>{ initTorch(); go('OUTPOST_CORRIDOR_1'); }},
  {label:'↑ ストーンヘイムへ戻る（徒歩2日）', fn:()=>startOutpostReturnJourney()},
 ],
 },

 OUTPOST_CORRIDOR_1:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">${OUTPOST_NAME}</span><br><br>
  南北45mの通路。北端北壁にアーチがある。南端南壁には外へ続く扉がある。` +
  (PC._outpostDoor8to1Found ? '西壁南端から10mのところに、隠し扉が見つかっている。' : ''),
 choices:()=>{
  const ch = [
   {label:'↓ 南の扉から外へ', fn:()=>go('OUTPOST_FRONT')},
   {label:'↑ 北のアーチへ', fn:()=>outpostMove('OUTPOST_COLONNADE_1')},
  ];
  if(PC._outpostDoor8to1Found) ch.push({label:'← 西の隠し扉へ', fn:()=>outpostMove('OUTPOST_CORRIDOR_8')});
  return ch;
 },
 },

 OUTPOST_COLONNADE_1:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">${OUTPOST_NAME}</span><br><br>
  幅15mで南北45mに延びる柱廊。太い石柱が並ぶ威厳ある回廊だが、北側は大量の土砂と落石によって完全に塞がれている。南端南壁中央にアーチがある。西壁北端から20mのところに扉がある。`,
 choices:()=>[
  {label:'↓ 南のアーチへ', fn:()=>outpostMove('OUTPOST_CORRIDOR_1')},
  {label:'← 西の扉へ', fn:()=>outpostMove('OUTPOST_ROOM_A')},
 ],
 },

 OUTPOST_ROOM_A:{
 scene:'dungeon',
 area:1,
 txt:()=>`<span style="color:#f0ece0">${OUTPOST_NAME}</span><br><br>
  南北25m東西20mの部屋。東壁中央に扉、西壁中央に扉がある。壁際に置かれた木製の長椅子はすでに朽ち果て、雑多なゴミが散乱している。` + _lairRoomStatusTextGeneric('outpost', 'OUTPOST_ROOM_A'),
 choices:()=>{
  const ns = PC._outpostDungeon.nodeState.OUTPOST_ROOM_A;
  if(PC._outpostDungeon.themeId && !ns.defeated) return [{label:_lairEncounterLabel(ns), fn:()=>_lairStartEncounterGeneric('outpost', 'OUTPOST_ROOM_A')}];
  return [
   {label:'→ 東の扉へ', fn:()=>outpostMove('OUTPOST_COLONNADE_1')},
   {label:'← 西の扉へ', fn:()=>outpostMove('OUTPOST_ROOM_B')},
  ];
 },
 },

 OUTPOST_ROOM_B:{
 scene:'dungeon',
 area:2,
 txt:()=>`<span style="color:#f0ece0">${OUTPOST_NAME}</span><br><br>
  南北15m東西20mの部屋。東壁中央に扉、南壁西端から10mのところに扉がある。` + _lairRoomStatusTextGeneric('outpost', 'OUTPOST_ROOM_B'),
 choices:()=>{
  const ns = PC._outpostDungeon.nodeState.OUTPOST_ROOM_B;
  if(PC._outpostDungeon.themeId && !ns.defeated) return [{label:_lairEncounterLabel(ns), fn:()=>_lairStartEncounterGeneric('outpost', 'OUTPOST_ROOM_B')}];
  return [
   {label:'→ 東の扉へ', fn:()=>outpostMove('OUTPOST_ROOM_A')},
   {label:'↓ 南の扉へ', fn:()=>outpostMove('OUTPOST_CORRIDOR_2')},
  ];
 },
 },

 OUTPOST_CORRIDOR_2:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">${OUTPOST_NAME}</span><br><br>
  南北10mの通路。北端北壁に扉がある。南端はT字路になっている。`,
 choices:()=>[
  {label:'↑ 北の扉へ', fn:()=>outpostMove('OUTPOST_ROOM_B')},
  {label:'↓ 南のT字路へ', fn:()=>outpostMove('OUTPOST_JUNCTION_1')},
 ],
 },

 OUTPOST_JUNCTION_1:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">${OUTPOST_NAME}</span><br><br>
  南北に延びる通路から、東への通路が分岐しているT字路。`,
 choices:()=>[
  {label:'↑ 北へ', fn:()=>outpostMove('OUTPOST_CORRIDOR_2')},
  {label:'↓ 南へ', fn:()=>outpostMove('OUTPOST_CORRIDOR_4')},
  {label:'→ 東へ', fn:()=>outpostMove('OUTPOST_CORRIDOR_3')},
 ],
 },

 OUTPOST_CORRIDOR_3:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">${OUTPOST_NAME}</span><br><br>
  東西35mの通路。東端は行き止まりになっている。西はT字路に通じている。` +
  (PC._outpostDoorCto3Found ? '東端から10mの南壁に、隠し扉が見つかっている。' : ''),
 choices:()=>{
  const ch = [{label:'← 西のT字路へ', fn:()=>outpostMove('OUTPOST_JUNCTION_1')}];
  if(PC._outpostDoorCto3Found) ch.push({label:' 南の隠し扉へ', fn:()=>outpostMove('OUTPOST_ROOM_C')});
  return ch;
 },
 },

 OUTPOST_JUNCTION_2:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">${OUTPOST_NAME}</span><br><br>
  南北に延びる通路から、東への通路が分岐しているT字路。`,
 choices:()=>[
  {label:'↑ 北へ', fn:()=>outpostMove('OUTPOST_CORRIDOR_4')},
  {label:'→ 東へ', fn:()=>outpostMove('OUTPOST_CORRIDOR_5')},
  {label:'↓ 南へ', fn:()=>outpostMove('OUTPOST_CORRIDOR_6')},
 ],
 },

 OUTPOST_CORRIDOR_4:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">${OUTPOST_NAME}</span><br><br>
  南北20mの通路。北はT字路、南もT字路になっている。`,
 choices:()=>[
  {label:'↑ 北のT字路へ', fn:()=>outpostMove('OUTPOST_JUNCTION_1')},
  {label:'↓ 南のT字路へ', fn:()=>outpostMove('OUTPOST_JUNCTION_2')},
 ],
 },

 OUTPOST_CORRIDOR_5:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">${OUTPOST_NAME}</span><br><br>
  東西15mの通路。東端東壁にアーチがある。西はT字路に通じている。`,
 choices:()=>[
  {label:'← 西のT字路へ', fn:()=>outpostMove('OUTPOST_JUNCTION_2')},
  {label:'→ 東のアーチへ', fn:()=>outpostMove('OUTPOST_ROOM_E')},
 ],
 },

 OUTPOST_ROOM_E:{
 scene:'dungeon',
 area:3,
 txt:()=>`<span style="color:#f0ece0">${OUTPOST_NAME}</span><br><br>
  南北15m東西25mの部屋。北壁東端から10mのところに扉、西壁北端にアーチがある。東壁には煤けた暖炉が残っている。` + _lairRoomStatusTextGeneric('outpost', 'OUTPOST_ROOM_E'),
 choices:()=>{
  const ns = PC._outpostDungeon.nodeState.OUTPOST_ROOM_E;
  if(PC._outpostDungeon.themeId && !ns.defeated) return [{label:_lairEncounterLabel(ns), fn:()=>_lairStartEncounterGeneric('outpost', 'OUTPOST_ROOM_E')}];
  return [
   {label:'← 西のアーチへ', fn:()=>outpostMove('OUTPOST_CORRIDOR_5')},
   {label:'↑ 北の扉へ', fn:()=>outpostMove('OUTPOST_ROOM_C')},
  ];
 },
 },

 OUTPOST_ROOM_C:{
 scene:'dungeon',
 area:2,
 txt:()=>`<span style="color:#f0ece0">${OUTPOST_NAME}</span><br><br>
  南北10m東西15mの部屋。北壁中央に扉、南壁西端に扉、西壁北端に扉がある。` + _lairRoomStatusTextGeneric('outpost', 'OUTPOST_ROOM_C'),
 choices:()=>{
  const ns = PC._outpostDungeon.nodeState.OUTPOST_ROOM_C;
  if(PC._outpostDungeon.themeId && !ns.defeated) return [{label:_lairEncounterLabel(ns), fn:()=>_lairStartEncounterGeneric('outpost', 'OUTPOST_ROOM_C')}];
  return [
   {label:'↑ 北の扉へ', fn:()=>outpostUseHiddenDoor('_outpostDoorCto3Found', 'OUTPOST_CORRIDOR_3')},
   {label:'↓ 南の扉へ', fn:()=>outpostMove('OUTPOST_ROOM_E')},
   {label:'← 西の扉へ', fn:()=>outpostMove('OUTPOST_ROOM_D')},
  ];
 },
 },

 OUTPOST_ROOM_D:{
 scene:'dungeon',
 area:3,
 txt:()=>`<span style="color:#f0ece0">${OUTPOST_NAME}</span><br><br>
  10m四方の部屋。東壁北端に扉がある。足元に壊れた鍵や鎖が転がっている。` + _lairRoomStatusTextGeneric('outpost', 'OUTPOST_ROOM_D'),
 choices:()=>{
  const ns = PC._outpostDungeon.nodeState.OUTPOST_ROOM_D;
  if(PC._outpostDungeon.themeId && !ns.defeated) return [{label:_lairEncounterLabel(ns), fn:()=>_lairStartEncounterGeneric('outpost', 'OUTPOST_ROOM_D')}];
  return [{label:'→ 東の扉へ', fn:()=>outpostMove('OUTPOST_ROOM_C')}];
 },
 },

 OUTPOST_CORRIDOR_6:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">${OUTPOST_NAME}</span><br><br>
  南北30mの通路。北はT字路に通じている。南端は行き止まり、東壁に扉がある。`,
 choices:()=>[
  {label:'↑ 北のT字路へ', fn:()=>outpostMove('OUTPOST_JUNCTION_2')},
  {label:'↓ 南東の扉へ', fn:()=>outpostMove('OUTPOST_CORRIDOR_7')},
 ],
 },

 OUTPOST_CORRIDOR_7:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">${OUTPOST_NAME}</span><br><br>
  南北15mの通路。北端は東に折れている。南端は行き止まり、西壁に扉がある。`,
 choices:()=>[
  {label:'↑ 北へ', fn:()=>outpostMove('OUTPOST_CORRIDOR_8')},
  {label:'↓ 南西の扉へ', fn:()=>outpostMove('OUTPOST_CORRIDOR_6')},
 ],
 },

 OUTPOST_CORRIDOR_8:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0">${OUTPOST_NAME}</span><br><br>
  東西35mの通路。東端は行き止まりになっており、東壁に扉がある。西端は南に折れている。`,
 choices:()=>[
  {label:'→ 東の扉へ', fn:()=>outpostUseHiddenDoor('_outpostDoor8to1Found', 'OUTPOST_CORRIDOR_1')},
  {label:'← 西へ', fn:()=>outpostMove('OUTPOST_CORRIDOR_7')},
 ],
 },

 // ── 巣窟ダンジョン共通：暗闇脱出ノード（各ダンジョンの安全な入口エリアへ戻る） ──────────────
 LAIR_DARK_ESCAPE:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0"></span><br><br>
  <span style="color:var(--white2)">松明が切れた。完全な暗闇の中、壁を手探りで進む。出口まで帰り着けるか……</span>`,
 choices:()=>[{label:' もう一度出口を探す（運 Lv3 能力値テスト）', fn:()=>{
  setupSavingRoll({
   attr:'lk', level:3,
   onSuccess:()=>{
    const s = document.getElementById('story');
    s.innerHTML = `<span style="color:#f0ece0"></span><br><br>壁を手探りで進み、かすかな外光を頼りになんとか入口へ辿り着いた！`;
    renderChoices([{label:' 外の光の方へ', go:'LAIR_ENTRANCE'}]);
    scrollToTop();
   },
   onFail:()=>{
    const s = document.getElementById('story');
    s.innerHTML = `<span class="red"></span><br><br>暗闇の中で方向を失い、壁に何度もぶつかりながら彷徨い続けた。`;
    renderChoices([{label:' もう一度出口を探す（運 Lv3 能力値テスト）', go:'LAIR_DARK_ESCAPE'}]);
    scrollToTop();
   },
  });
 }}],
 },

 LAIR2_DARK_ESCAPE:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0"></span><br><br>
  <span style="color:var(--white2)">松明が切れた。完全な暗闇の中、壁を手探りで進む。出口まで帰り着けるか……</span>`,
 choices:()=>[{label:' もう一度出口を探す（運 Lv3 能力値テスト）', fn:()=>{
  setupSavingRoll({
   attr:'lk', level:3,
   onSuccess:()=>{
    const s = document.getElementById('story');
    s.innerHTML = `<span style="color:#f0ece0"></span><br><br>壁を手探りで進み、かすかな外光を頼りになんとか入口へ辿り着いた！`;
    renderChoices([{label:' 外の光の方へ', go:'LAIR2_ROOM_1A'}]);
    scrollToTop();
   },
   onFail:()=>{
    const s = document.getElementById('story');
    s.innerHTML = `<span class="red"></span><br><br>暗闇の中で方向を失い、壁に何度もぶつかりながら彷徨い続けた。`;
    renderChoices([{label:' もう一度出口を探す（運 Lv3 能力値テスト）', go:'LAIR2_DARK_ESCAPE'}]);
    scrollToTop();
   },
  });
 }}],
 },

 LAIR3_DARK_ESCAPE:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0"></span><br><br>
  <span style="color:var(--white2)">松明が切れた。完全な暗闇の中、壁を手探りで進む。出口まで帰り着けるか……</span>`,
 choices:()=>[{label:' もう一度出口を探す（運 Lv3 能力値テスト）', fn:()=>{
  setupSavingRoll({
   attr:'lk', level:3,
   onSuccess:()=>{
    const s = document.getElementById('story');
    s.innerHTML = `<span style="color:#f0ece0"></span><br><br>壁を手探りで進み、かすかな外光を頼りになんとか入口へ辿り着いた！`;
    renderChoices([{label:' 外の光の方へ', go:'LAIR3_LANDING'}]);
    scrollToTop();
   },
   onFail:()=>{
    const s = document.getElementById('story');
    s.innerHTML = `<span class="red"></span><br><br>暗闇の中で方向を失い、壁に何度もぶつかりながら彷徨い続けた。`;
    renderChoices([{label:' もう一度出口を探す（運 Lv3 能力値テスト）', go:'LAIR3_DARK_ESCAPE'}]);
    scrollToTop();
   },
  });
 }}],
 },

 LAIR3_B2_DARK_ESCAPE:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0"></span><br><br>
  <span style="color:var(--white2)">松明が切れた。完全な暗闇の中、壁を手探りで進む。出口まで帰り着けるか……</span>`,
 choices:()=>[{label:' もう一度出口を探す（運 Lv3 能力値テスト）', fn:()=>{
  setupSavingRoll({
   attr:'lk', level:3,
   onSuccess:()=>{
    const s = document.getElementById('story');
    s.innerHTML = `<span style="color:#f0ece0"></span><br><br>壁を手探りで進み、かすかな外光を頼りになんとか元いた場所へ辿り着いた！`;
    renderChoices([{label:' その場所へ', go:'LAIR3_B2_ROOM_6'}]);
    scrollToTop();
   },
   onFail:()=>{
    const s = document.getElementById('story');
    s.innerHTML = `<span class="red"></span><br><br>暗闇の中で方向を失い、壁に何度もぶつかりながら彷徨い続けた。`;
    renderChoices([{label:' もう一度出口を探す（運 Lv3 能力値テスト）', go:'LAIR3_B2_DARK_ESCAPE'}]);
    scrollToTop();
   },
  });
 }}],
 },

 LAIR3_B3_DARK_ESCAPE:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0"></span><br><br>
  <span style="color:var(--white2)">松明が切れた。完全な暗闇の中、壁を手探りで進む。出口まで帰り着けるか……</span>`,
 choices:()=>[{label:' もう一度出口を探す（運 Lv3 能力値テスト）', fn:()=>{
  setupSavingRoll({
   attr:'lk', level:3,
   onSuccess:()=>{
    const s = document.getElementById('story');
    s.innerHTML = `<span style="color:#f0ece0"></span><br><br>壁を手探りで進み、かすかな外光を頼りになんとか元いた場所へ辿り着いた！`;
    renderChoices([{label:' その場所へ', go:'LAIR3_B3_PASSAGE_1'}]);
    scrollToTop();
   },
   onFail:()=>{
    const s = document.getElementById('story');
    s.innerHTML = `<span class="red"></span><br><br>暗闇の中で方向を失い、壁に何度もぶつかりながら彷徨い続けた。`;
    renderChoices([{label:' もう一度出口を探す（運 Lv3 能力値テスト）', go:'LAIR3_B3_DARK_ESCAPE'}]);
    scrollToTop();
   },
  });
 }}],
 },

 LAIR4_DARK_ESCAPE:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0"></span><br><br>
  <span style="color:var(--white2)">松明が切れた。完全な暗闇の中、壁を手探りで進む。出口まで帰り着けるか……</span>`,
 choices:()=>[{label:' もう一度出口を探す（運 Lv3 能力値テスト）', fn:()=>{
  setupSavingRoll({
   attr:'lk', level:3,
   onSuccess:()=>{
    const s = document.getElementById('story');
    s.innerHTML = `<span style="color:#f0ece0"></span><br><br>壁を手探りで進み、かすかな外光を頼りになんとか入口へ辿り着いた！`;
    renderChoices([{label:' 外の光の方へ', go:'LAIR4_PASSAGE_1'}]);
    scrollToTop();
   },
   onFail:()=>{
    const s = document.getElementById('story');
    s.innerHTML = `<span class="red"></span><br><br>暗闇の中で方向を失い、壁に何度もぶつかりながら彷徨い続けた。`;
    renderChoices([{label:' もう一度出口を探す（運 Lv3 能力値テスト）', go:'LAIR4_DARK_ESCAPE'}]);
    scrollToTop();
   },
  });
 }}],
 },

 LAIR5_DARK_ESCAPE:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0"></span><br><br>
  <span style="color:var(--white2)">松明が切れた。完全な暗闇の中、壁を手探りで進む。出口まで帰り着けるか……</span>`,
 choices:()=>[{label:' もう一度出口を探す（運 Lv3 能力値テスト）', fn:()=>{
  setupSavingRoll({
   attr:'lk', level:3,
   onSuccess:()=>{
    const s = document.getElementById('story');
    s.innerHTML = `<span style="color:#f0ece0"></span><br><br>壁を手探りで進み、かすかな外光を頼りになんとか入口へ辿り着いた！`;
    renderChoices([{label:' 外の光の方へ', go:'LAIR5_PASSAGE_1'}]);
    scrollToTop();
   },
   onFail:()=>{
    const s = document.getElementById('story');
    s.innerHTML = `<span class="red"></span><br><br>暗闇の中で方向を失い、壁に何度もぶつかりながら彷徨い続けた。`;
    renderChoices([{label:' もう一度出口を探す（運 Lv3 能力値テスト）', go:'LAIR5_DARK_ESCAPE'}]);
    scrollToTop();
   },
  });
 }}],
 },

 LAIR5_B2_DARK_ESCAPE:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0"></span><br><br>
  <span style="color:var(--white2)">松明が切れた。完全な暗闇の中、壁を手探りで進む。出口まで帰り着けるか……</span>`,
 choices:()=>[{label:' もう一度出口を探す（運 Lv3 能力値テスト）', fn:()=>{
  setupSavingRoll({
   attr:'lk', level:3,
   onSuccess:()=>{
    const s = document.getElementById('story');
    s.innerHTML = `<span style="color:#f0ece0"></span><br><br>壁を手探りで進み、かすかな外光を頼りになんとか元いた場所へ辿り着いた！`;
    renderChoices([{label:' その場所へ', go:'LAIR5_B2_PASSAGE_1'}]);
    scrollToTop();
   },
   onFail:()=>{
    const s = document.getElementById('story');
    s.innerHTML = `<span class="red"></span><br><br>暗闇の中で方向を失い、壁に何度もぶつかりながら彷徨い続けた。`;
    renderChoices([{label:' もう一度出口を探す（運 Lv3 能力値テスト）', go:'LAIR5_B2_DARK_ESCAPE'}]);
    scrollToTop();
   },
  });
 }}],
 },

 LAIR5_B3_DARK_ESCAPE:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0"></span><br><br>
  <span style="color:var(--white2)">松明が切れた。完全な暗闇の中、壁を手探りで進む。出口まで帰り着けるか……</span>`,
 choices:()=>[{label:' もう一度出口を探す（運 Lv3 能力値テスト）', fn:()=>{
  setupSavingRoll({
   attr:'lk', level:3,
   onSuccess:()=>{
    const s = document.getElementById('story');
    s.innerHTML = `<span style="color:#f0ece0"></span><br><br>壁を手探りで進み、かすかな外光を頼りになんとか元いた場所へ辿り着いた！`;
    renderChoices([{label:' その場所へ', go:'LAIR5_B3_PASSAGE_1'}]);
    scrollToTop();
   },
   onFail:()=>{
    const s = document.getElementById('story');
    s.innerHTML = `<span class="red"></span><br><br>暗闇の中で方向を失い、壁に何度もぶつかりながら彷徨い続けた。`;
    renderChoices([{label:' もう一度出口を探す（運 Lv3 能力値テスト）', go:'LAIR5_B3_DARK_ESCAPE'}]);
    scrollToTop();
   },
  });
 }}],
 },

 LAIR5_B4_DARK_ESCAPE:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0"></span><br><br>
  <span style="color:var(--white2)">松明が切れた。完全な暗闇の中、壁を手探りで進む。出口まで帰り着けるか……</span>`,
 choices:()=>[{label:' もう一度出口を探す（運 Lv3 能力値テスト）', fn:()=>{
  setupSavingRoll({
   attr:'lk', level:3,
   onSuccess:()=>{
    const s = document.getElementById('story');
    s.innerHTML = `<span style="color:#f0ece0"></span><br><br>壁を手探りで進み、かすかな外光を頼りになんとか元いた場所へ辿り着いた！`;
    renderChoices([{label:' その場所へ', go:'LAIR5_B4_PASSAGE_1'}]);
    scrollToTop();
   },
   onFail:()=>{
    const s = document.getElementById('story');
    s.innerHTML = `<span class="red"></span><br><br>暗闇の中で方向を失い、壁に何度もぶつかりながら彷徨い続けた。`;
    renderChoices([{label:' もう一度出口を探す（運 Lv3 能力値テスト）', go:'LAIR5_B4_DARK_ESCAPE'}]);
    scrollToTop();
   },
  });
 }}],
 },

 LAIR6_DARK_ESCAPE:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0"></span><br><br>
  <span style="color:var(--white2)">松明が切れた。完全な暗闇の中、壁を手探りで進む。出口まで帰り着けるか……</span>`,
 choices:()=>[{label:' もう一度出口を探す（運 Lv3 能力値テスト）', fn:()=>{
  setupSavingRoll({
   attr:'lk', level:3,
   onSuccess:()=>{
    const s = document.getElementById('story');
    s.innerHTML = `<span style="color:#f0ece0"></span><br><br>壁を手探りで進み、かすかな外光を頼りになんとか入口へ辿り着いた！`;
    renderChoices([{label:' 外の光の方へ', go:'LAIR6_FRONT'}]);
    scrollToTop();
   },
   onFail:()=>{
    const s = document.getElementById('story');
    s.innerHTML = `<span class="red"></span><br><br>暗闇の中で方向を失い、壁に何度もぶつかりながら彷徨い続けた。`;
    renderChoices([{label:' もう一度出口を探す（運 Lv3 能力値テスト）', go:'LAIR6_DARK_ESCAPE'}]);
    scrollToTop();
   },
  });
 }}],
 },

 LAIR7_DARK_ESCAPE:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0"></span><br><br>
  <span style="color:var(--white2)">松明が切れた。完全な暗闇の中、壁を手探りで進む。出口まで帰り着けるか……</span>`,
 choices:()=>[{label:' もう一度出口を探す（運 Lv3 能力値テスト）', fn:()=>{
  setupSavingRoll({
   attr:'lk', level:3,
   onSuccess:()=>{
    const s = document.getElementById('story');
    s.innerHTML = `<span style="color:#f0ece0"></span><br><br>壁を手探りで進み、かすかな外光を頼りになんとか入口へ辿り着いた！`;
    renderChoices([{label:' 外の光の方へ', go:'LAIR7_FRONT'}]);
    scrollToTop();
   },
   onFail:()=>{
    const s = document.getElementById('story');
    s.innerHTML = `<span class="red"></span><br><br>暗闇の中で方向を失い、壁に何度もぶつかりながら彷徨い続けた。`;
    renderChoices([{label:' もう一度出口を探す（運 Lv3 能力値テスト）', go:'LAIR7_DARK_ESCAPE'}]);
    scrollToTop();
   },
  });
 }}],
 },

 OUTPOST_DARK_ESCAPE:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0"></span><br><br>
  <span style="color:var(--white2)">松明が切れた。完全な暗闇の中、壁を手探りで進む。出口まで帰り着けるか……</span>`,
 choices:()=>[{label:' もう一度出口を探す（運 Lv3 能力値テスト）', fn:()=>{
  setupSavingRoll({
   attr:'lk', level:3,
   onSuccess:()=>{
    const s = document.getElementById('story');
    s.innerHTML = `<span style="color:#f0ece0"></span><br><br>壁を手探りで進み、かすかな外光を頼りになんとか入口へ辿り着いた！`;
    renderChoices([{label:' 外の光の方へ', go:'OUTPOST_FRONT'}]);
    scrollToTop();
   },
   onFail:()=>{
    const s = document.getElementById('story');
    s.innerHTML = `<span class="red"></span><br><br>暗闇の中で方向を失い、壁に何度もぶつかりながら彷徨い続けた。`;
    renderChoices([{label:' もう一度出口を探す（運 Lv3 能力値テスト）', go:'OUTPOST_DARK_ESCAPE'}]);
    scrollToTop();
   },
  });
 }}],
 },

 NIFLAIR_DARK_ESCAPE:{
 scene:'dungeon',
 txt:()=>`<span style="color:#f0ece0"></span><br><br>
  <span style="color:var(--white2)">松明が切れた。完全な暗闇の中、壁を手探りで進む。出口まで帰り着けるか……</span>`,
 choices:()=>[{label:' もう一度出口を探す（運 Lv3 能力値テスト）', fn:()=>{
  setupSavingRoll({
   attr:'lk', level:3,
   onSuccess:()=>{
    const s = document.getElementById('story');
    s.innerHTML = `<span style="color:#f0ece0"></span><br><br>壁を手探りで進み、かすかな外光を頼りになんとか入口へ辿り着いた！`;
    renderChoices([{label:' 外の光の方へ', go:'NIFLAIR_ENTRANCE'}]);
    scrollToTop();
   },
   onFail:()=>{
    const s = document.getElementById('story');
    s.innerHTML = `<span class="red"></span><br><br>暗闇の中で方向を失い、壁に何度もぶつかりながら彷徨い続けた。`;
    renderChoices([{label:' もう一度出口を探す（運 Lv3 能力値テスト）', go:'NIFLAIR_DARK_ESCAPE'}]);
    scrollToTop();
   },
  });
 }}],
 },

}; // NODES

// ══════════════════════════════════════════
// 「丘を掘り抜いた遺跡」（第10の固定ダンジョン／荒野のダンジョン）
// 場所：荒野マップ khazan__yeldun の場所 c。西斜面の北寄り（→部屋J）と南寄り（→柱廊1）の2つの入口から入れる
// 構造の元データ：プロジェクトの「荒野_丘を掘り抜いた遺跡_構造メモ」
// 巣窟ダンジョン共通の仕組み（テーマ抽選・エリア別モンスター・ワンダリング・再湧き）を使う
// ══════════════════════════════════════════
const HRUIN_NAME = '丘を掘り抜いた遺跡';
const HRUIN_WILD_SITE = 'khazan__yeldun:c';    // 荒野マップのキー：場所の記号
// ノードID → エリア番号（1〜3）。モンスター・イベントが配置されるのは部屋ノードのみ
const HRUIN_ROOM_AREAS = {
 HRUIN_ROOM_J:1, HRUIN_ROOM_I:1, HRUIN_ROOM_H:1, HRUIN_ROOM_G:1, HRUIN_ROOM_A:1, HRUIN_ROOM_B:1,
 HRUIN_ROOM_F:2, HRUIN_ROOM_E:2,
 HRUIN_ROOM_D:3, HRUIN_ROOM_C:3,
};
// 通路・柱廊への移動時のワンダリング判定に使うエリア番号。未登録のノードは判定なし
const HRUIN_ENC_AREA = {
 HRUIN_COLONNADE_1:1, HRUIN_COLONNADE_2:1,
 HRUIN_PASSAGE_6:2, HRUIN_PASSAGE_8:2, HRUIN_PASSAGE_11:2,
};
function initHruinDungeon(){
 if(!PC._hruinDungeon){
  PC._hruinDungeon = { themeId:null, lastThemeId:null, spawnDay:null, clearedDay:null, nextRespawnDay:0, nodeState:{}, scenarioSorcererName:null, scenarioNames:null };
 }
 const lair = PC._hruinDungeon;
 if(!lair.nodeState) lair.nodeState = {};
 Object.keys(HRUIN_ROOM_AREAS).forEach(id=>{
  if(!lair.nodeState[id]) lair.nodeState[id] = { defeated:false, monsters:null };
 });
}
function checkHruinRespawn(){ _lairCheckRespawnGeneric('hruin', initHruinDungeon); }
function defeatHruinRoom(nodeId){
 const lair = PC._hruinDungeon;
 lair.nodeState[nodeId].defeated = true;
 const allDefeated = Object.keys(HRUIN_ROOM_AREAS).every(id=>lair.nodeState[id].defeated);
 if(allDefeated){
  lair.lastThemeId = lair.themeId;
  lair.clearedDay = GAME_TIME.totalDays;
  lair.nextRespawnDay = GAME_TIME.totalDays + 180;
  lair.themeId = null;
 }
}
function rollHruinWandering(area){
 const lair = PC._hruinDungeon;
 if(!lair || !lair.themeId) return null;
 if(Math.random() >= 0.16) return null;
 const theme = _lairScenarioAwareTheme(lair.themeId);
 const table = (_lairAreaTableGeneric(theme, area)||[]).filter(e=>typeof e.spawn === 'function');
 if(!table.length) return null;
 const entry = table[Math.floor(Math.random()*table.length)];
 return entry.spawn();
}
function startHruinWanderCombat(monsters, returnNode){
 const isNPCType = monsters.length && monsters[0].st !== undefined;
 const common = {
  win:'__noop__', lose:'DEAD', canFlee:true,
  onWin: ()=>{
   document.getElementById('cbt-area').classList.add('hidden');
   document.getElementById('scroll-area').classList.remove('in-combat');
   document.getElementById('text-win').style.display = '';
   cbtState = null;
   go(returnNode);
  },
 };
 if(isNPCType) startCombatNPC({ enemies: monsters, autoTreasure:true, ...common });
 else startCombat({ enemies: monsters, ...common });
}
LAIR_DUNGEON_REG.hruin = { stateProp:'_hruinDungeon', roomAreas:HRUIN_ROOM_AREAS, defeatFn:(id)=>defeatHruinRoom(id), rescuedNamesProp:'_hruinRescuedNames', wanderFn:(area)=>rollHruinWandering(area), wanderCombatFn:(m,r)=>startHruinWanderCombat(m,r) };

function hruinMove(dest){
 const area = HRUIN_ENC_AREA[dest];
 if(area){
  const wander = rollHruinWandering(area);
  if(wander && wander.length){
   const counts = {};
   wander.forEach(m=>{ counts[m.name] = (counts[m.name]||0)+1; });
   const desc = Object.entries(counts).map(([n,c])=> c>1 ? `${n}×${c}` : n).join('、');
   const s = document.getElementById('story');
   if(s) s.innerHTML += `<br><br><span style="color:#f0ddd8"> ${desc}が現れた！</span>`;
   renderChoices([]);
   drawScene('combat');
   startHruinWanderCombat(wander, dest);
   return;
  }
 }
 go(dest);
}
function hruinMsg(text){
 const s = document.getElementById('story');
 if(s) s.innerHTML += `<br><br><span style="color:#c8b8a0">${text}</span>`;
 scrollToTop();
}
// 荒野から入る（entry：'N'＝西斜面の北寄りの入口→部屋J／'S'＝南寄りの入口→柱廊1）
function hruinEnter(entry){
 checkHruinRespawn();
 initTorch();
 PC._hruinEntry = entry;
 PC._hruinFresh = true;
 drawScene('dungeon');
 go(entry === 'N' ? 'HRUIN_ROOM_J' : 'HRUIN_COLONNADE_1');
}
// 外へ出て荒野の画面へ戻る（助け出した捕虜がいれば、謝礼を支払う）
function hruinExit(){
 PC._hruinFresh = false;
 if(typeof hideDungeonImage === 'function') hideDungeonImage();
 if(PC._wild && typeof WILD_MAPS !== 'undefined' && WILD_MAPS[PC._wild.key]){
  PC._wild.msg = `${HRUIN_NAME}の外へ出た。`;
  go('WILDERNESS');
 } else {
  go('TOWN_' + (PC.town || 'khazan').toUpperCase());
 }
 _lairPayRescueRewardGeneric('hruin');
}
function hruinFlavor(){
 if(!PC._hruinFresh) return '';
 PC._hruinFresh = false;
 const lair = PC._hruinDungeon;
 return '<br><br>' + ((lair && lair.themeId)
  ? _lairScenarioAwareTheme(lair.themeId).entryFlavor
  : 'あたりは静まり返っており、これといった気配は感じられない。');
}

// ノードの定義表。t＝説明文、e＝出口（[ラベル, 行き先のIDの後半] 。'@OUT'＝外へ、'@MSG:文'＝メッセージだけ）、ent＝入口のノード
const HRUIN_DEFS = {
 ROOM_J: { ent:true, t:'15m四方の部屋。北壁中央にアーチがある。西壁中央には屋外への出口がある。',
  e:[['↑ 北のアーチへ','ROOM_I'], ['← 西の出口から外へ','@OUT']] },
 ROOM_I: { t:'25m四方の部屋。北壁中央に扉、南壁西端にアーチがある。部屋の中央には台座があり、頭部が欠損した猛獣の石像が鎮座している。',
  e:[['↑ 北の扉へ','ROOM_H'], ['↓ 南のアーチへ','ROOM_J']] },
 ROOM_H: { t:'15m四方の部屋。東壁北端に扉、南壁中央に扉がある。',
  e:[['→ 東の扉へ','ROOM_G'], ['↓ 南の扉へ','ROOM_I']] },
 ROOM_G: { t:'10m四方の部屋。南壁東端に扉、西壁北端に扉がある。',
  e:[['↓ 南の扉へ','PASSAGE_13'], ['← 西の扉へ','ROOM_H']] },
 PASSAGE_13: { t:'東西45mの通路。西端は行き止まりで、北壁に扉がある。東端は通路へつながっているが、先は暗くなって見えない。',
  e:[['↑ 西端の北の扉へ','ROOM_G'], ['→ 東へ','PASSAGE_12']] },
 PASSAGE_12: { t:'東西40mの通路。東端は行き止まりで、南壁に扉がある。西端は通路へつながっているが、先は暗くなっていてよく見えない。',
  e:[['↓ 東端の南の扉へ','ROOM_F'], ['← 西へ','PASSAGE_13']] },
 ROOM_F: { t:'南北25m東西35mの部屋。北壁中央に扉、西壁中央に扉がある。',
  e:[['↑ 北の扉へ','PASSAGE_12'], ['← 西の扉へ','ROOM_E']] },
 ROOM_E: { t:'25m四方の部屋。東壁の北端と南端に、それぞれ扉がある。',
  e:[['→ 東壁北端の扉へ','ROOM_F'], ['→ 東壁南端の扉へ','ROOM_D']] },
 PASSAGE_11: { t:'南北60mの通路。北端は部屋へのアーチになっている。南端は十字路に通じている。',
  e:[['↑ 北のアーチへ','ROOM_D'], ['↓ 南の十字路へ','CROSS_1']] },
 ROOM_D: { t:'南北20m東西35mの部屋。南壁東端に扉、南壁西端にアーチ、西壁北端に扉がある。床面が一段低くなっており、かつては水が満ちていたと思われる大きなプールがある。',
  e:[['↓ 南壁東端の扉へ','ROOM_C'], ['↓ 南壁西端のアーチへ','PASSAGE_11'], ['← 西壁北端の扉へ','ROOM_E']] },
 ROOM_C: { t:'35m四方の部屋。北壁中央に扉、南壁中央に扉がある。天井の一部が崩落している。',
  e:[['↑ 北の扉へ','ROOM_D'], ['↓ 南の扉へ','PASSAGE_10A']] },
 PASSAGE_10A: { t:'南北10mの通路。北端の北壁に扉がある。南端は西に折れている。',
  e:[['↑ 北の扉へ','ROOM_C'], ['← 南端から西へ','PASSAGE_10']] },
 PASSAGE_10: { t:'東西25mの通路。東端は北に折れ、西端は南に折れている。',
  e:[['→ 東端から北へ','PASSAGE_10A'], ['← 西端から南へ','PASSAGE_9']] },
 PASSAGE_9: { t:'南北20mの通路。北端は東に折れ、南端は西に折れて十字路に通じている。',
  e:[['↑ 北端から東へ','PASSAGE_10'], ['↓ 南端から西の十字路へ','CROSS_1']] },
 CROSS_1: { t:'東西南北に通路が延びる十字路。',
  e:[['↑ 北へ','PASSAGE_11'], ['→ 東へ','PASSAGE_9'], ['↓ 南へ','PASSAGE_6'], ['← 西へ','PASSAGE_5']] },
 PASSAGE_5: { t:'東西45mの通路。東は十字路に通じている。西は通路へ続いているものの、先は暗くなっていて見えない。',
  e:[['→ 東の十字路へ','CROSS_1'], ['← 西へ','PASSAGE_4']] },
 PASSAGE_4: { t:'東西45mの通路。東は通路へ続いているものの、先は暗くなっていて見えない。西はT字路に通じている。',
  e:[['→ 東へ','PASSAGE_5'], ['← 西のT字路へ','TJUNC_1']] },
 TJUNC_1: { t:'南北に延びる通路から、東に通路が分岐しているT字路。',
  e:[['↑ 北へ','PASSAGE_3'], ['→ 東へ','PASSAGE_4'], ['↓ 南へ','PASSAGE_2']] },
 PASSAGE_3: { t:'南北20mの通路。北端は上り階段へ続いているが、天井が崩れていて上ることができない。南はT字路に通じている。',
  e:[['↑ 北の上り階段を調べる','@MSG:上り階段は、崩れた天井の土砂に埋もれている。これ以上は進めそうにない。'], ['↓ 南のT字路へ','TJUNC_1']] },
 PASSAGE_2: { t:'南北40mの通路。北端はT字路に通じている。南端は東に折れている。',
  e:[['↑ 北のT字路へ','TJUNC_1'], ['↓ 南端から東へ','PASSAGE_1']] },
 PASSAGE_1: { t:'東西35mの通路。西端は北に折れ、東端も北に折れている。南壁の西端から15mのところに扉がある。',
  e:[['← 西端から北へ','PASSAGE_2'], ['→ 東端から北へ','PASSAGE_14'], ['↓ 南の扉へ','COLONNADE_1']] },
 COLONNADE_1: { ent:true, t:'幅15m、東西50mに延びる柱廊。西端の中央にアーチがあり、外につながっている。北壁の西端から15mのところに扉があり、西端から50mのところにも扉がある。東は柱廊へ続いているが、暗くなっていてよく見えない。乾いた風が吹き抜けており、壁の隙間から笛のような低いうなり声が響いている。',
  e:[['← 西のアーチから外へ','@OUT'], ['↑ 北の扉（西寄り）へ','PASSAGE_1'], ['↑ 北の扉（東寄り）へ','ROOM_B'], ['→ 東へ','COLONNADE_2']] },
 COLONNADE_2: { t:'幅15m、東西50mに延びる柱廊。東端は行き止まりになっている。西は柱廊へ続いているが、先は暗くなっていてよく見えない。北壁の東端に開口部があり、東端から40mの北壁にも開口部がある。',
  e:[['← 西へ','COLONNADE_1'], ['↑ 北壁東端の開口部へ','PASSAGE_6'], ['↑ 北壁の開口部（東端から40m）へ','PASSAGE_8']] },
 PASSAGE_8: { t:'南北40mの通路。北端は行き止まりになっている。南端は柱廊への開口部になっている。',
  e:[['↓ 南の柱廊へ','COLONNADE_2']] },
 PASSAGE_7: { t:'南北25mの通路。北端の東壁に扉がある。南端の西側には下り階段があるが、天井が崩れていて使えない。',
  e:[['→ 北端の東の扉へ','PASSAGE_6'], ['↓ 南の下り階段を調べる','@MSG:下り階段は、崩れた天井の土砂に埋もれている。降りることはできない。']] },
 PASSAGE_6: { t:'南北45mの通路。北は十字路に通じ、南は柱廊に通じている。西壁の北端から20mのところに扉がある。',
  e:[['↑ 北の十字路へ','CROSS_1'], ['↓ 南の柱廊へ','COLONNADE_2'], ['← 西の扉（北端から20m）へ','PASSAGE_7']] },
 ROOM_B: { t:'南北20m東西15mの部屋。西壁北端に扉、南壁中央に扉がある。水のない乾いた石製の水盤が中央に置かれ、周囲には朽ち果てた木製のベンチが散乱している。',
  e:[['← 西壁北端の扉へ','PASSAGE_14'], ['↓ 南の扉へ','COLONNADE_1']] },
 ROOM_A: { t:'南北10m東西15mの部屋。南壁中央に扉がある。無骨な石のテーブルと、錆びついた武器保管用の棚が置かれている。',
  e:[['↓ 南の扉へ','PASSAGE_14']] },
 PASSAGE_14: { t:'南北20mの通路。北端は行き止まりで、北壁に扉、東壁にも扉がある。南端は東西の通路に通じている。',
  e:[['↑ 北の扉へ','ROOM_A'], ['→ 東の扉へ','ROOM_B'], ['↓ 南へ','PASSAGE_1']] },
};
function _hruinMakeNode(key, d){
 const nid = 'HRUIN_' + key;
 const isRoom = !!HRUIN_ROOM_AREAS[nid];
 const node = {
  scene:'dungeon',
  txt:()=>{
   initHruinDungeon();
   return `<span style="color:#f0ece0">${HRUIN_NAME}</span><br><br>${d.t}`
    + (isRoom ? _lairRoomStatusTextGeneric('hruin', nid) : '')
    + (d.ent ? hruinFlavor() : '');
  },
  choices:()=>{
   initHruinDungeon();
   if(isRoom){
    const lair = PC._hruinDungeon, ns = lair.nodeState[nid];
    if(lair.themeId && !ns.defeated) return [{label:_lairEncounterLabel(ns), fn:()=>_lairStartEncounterGeneric('hruin', nid)}];
   }
   return d.e.map(([label, to])=>{
    if(to === '@OUT') return {label, fn:()=>hruinExit()};
    if(to.startsWith('@MSG:')) return {label, fn:()=>hruinMsg(to.slice(5))};
    return {label, fn:()=>hruinMove('HRUIN_' + to)};
   });
  },
 };
 if(isRoom) node.area = HRUIN_ROOM_AREAS[nid];
 return node;
}
(function(){
 const nodes = {};
 Object.keys(HRUIN_DEFS).forEach(k=>{ nodes['HRUIN_' + k] = _hruinMakeNode(k, HRUIN_DEFS[k]); });
 nodes.HRUIN_DARK_ESCAPE = {
  scene:'dungeon',
  txt:()=>`<span style="color:#f0ece0"></span><br><br><span style="color:var(--white2)">松明が切れた。完全な暗闇の中、壁を手探りで進む。出口まで帰り着けるか……</span>`,
  choices:()=>[{label:' もう一度出口を探す（運 Lv3 能力値テスト）', fn:()=>{
   setupSavingRoll({
    attr:'lk', level:3,
    onSuccess:()=>{
     const s = document.getElementById('story');
     s.innerHTML = `<span style="color:#f0ece0"></span><br><br>壁を手探りで進み、かすかな外光を頼りになんとか入口へ辿り着いた！`;
     renderChoices([{label:' 外の光の方へ', go:(PC._hruinEntry === 'S' ? 'HRUIN_COLONNADE_1' : 'HRUIN_ROOM_J')}]);
     scrollToTop();
    },
    onFail:()=>{
     const s = document.getElementById('story');
     s.innerHTML = `<span class="red"></span><br><br>暗闇の中で方向を失い、壁に何度もぶつかりながら彷徨い続けた。`;
     renderChoices([{label:' もう一度出口を探す（運 Lv3 能力値テスト）', go:'HRUIN_DARK_ESCAPE'}]);
     scrollToTop();
    },
   });
  }}],
 };
 Object.assign(NODES, nodes);
 Object.keys(nodes).forEach(id=>DUNGEON_NODES.add(id));
 DUNGEON_SAFE_NODES.add('HRUIN_DARK_ESCAPE');
})();

// 荒野の場所 c に立っているとき、遺跡の入口を選べる
function hruinWildChoices(){
 const w = PC._wild;
 if(!w || !WILD_MAPS[w.key]) return [];
 const map = WILD_MAPS[w.key];
 const o = map.objects[w.row] && map.objects[w.row][w.col];
 if(!o || (w.key + ':' + o) !== HRUIN_WILD_SITE) return [];
 return [
  {label:` ${HRUIN_NAME}に入る（西斜面・北寄りの入口）`, fn:()=>hruinEnter('N')},
  {label:` ${HRUIN_NAME}に入る（西斜面・南寄りの入口）`, fn:()=>hruinEnter('S')},
 ];
}


try{ arcDInstallGoalRooms(); }catch(e){ console.error('arcD install', e); }
