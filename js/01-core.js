/* ── コア定数・ユーティリティ・ゲーム時間 ── */

// ══════════════════════════════════════════
// BUILD POLICY（開発ビルド／リリースビルドの方針）
// ══════════════════════════════════════════
// このファイルは開発ビルド（tt5_engine_dev.html）とリリースビルド
// （tt5_engine.html）の2種類として配布される。両者の差分は以下のみ。
//
// ・開発ビルド（dev）:
//     - BUILD_MODE を 'dev' にする
//     - デバッグパネル（画面右上のDBGボタン）を表示し、常時アクセス可能にする
//     - 画像データ（TITLE_IMGS/DUNGEON_IMGS/TRAVEL_IMGS の base64）は
//       含めない（空配列/空オブジェクトのままでよい）。動作確認・実装
//       テストが目的のビルドのため、軽量化と読み込み速度を優先する
//
// ・リリースビルド（release）:
//     - BUILD_MODE を 'release' にする
//     - デバッグパネルのコード自体は削除しない（残したままでよい）。
//       ただし BUILD_MODE が 'dev' でない場合はDBGボタンを非表示にし、
//       プレイヤーがアクセスできないようにする
//     - 画像データ（TITLE_IMGS/DUNGEON_IMGS/TRAVEL_IMGS）は全て含める
//
// 新しい機能を追加する際、このポリシーに反する変更（例：リリース
// ビルドでDBGボタンを常時表示する、開発ビルドから画像を削除し忘れる
// など）をしないよう注意すること。
const BUILD_MODE = 'release'; // 'dev' | 'release' — ビルド生成時にここを切り替える

// リリースビルドではDBGボタンを非表示にしてアクセス不可にする
// （デバッグパネル自体のコードは削除しない）
if(BUILD_MODE !== 'dev'){
 const _dbgOpenBtn = document.getElementById('dbg-open-btn');
 if(_dbgOpenBtn) _dbgOpenBtn.style.display = 'none';
}

// ══════════════════════════════════════════
// RPG RULES ENGINE
// ══════════════════════════════════════════

function addLifeEvent(icon, text){
 PC.lifeEvents = PC.lifeEvents || [];
 const cur = getCurrentDate ? getCurrentDate() : null;
 const dateStr = cur ? formatDate(cur) : `${GAME_TIME.totalDays}日目`;
 PC.lifeEvents.unshift({ date: dateStr, day: GAME_TIME.totalDays, icon, text });
 // 最大100件保持
 if(PC.lifeEvents.length > 100) PC.lifeEvents.length = 100;
}

// ── CHARACTER ──────────────────────────
let PC = {
 name:'',race:'human',type:'warrior',
 st:10,iq:10,lk:10,con:10,dex:10,chr:10,spd:10,
 maxCon:10,maxSt:10,
 gold:0,sp:0,cp:0,ap:0,level:1,
 // インベントリ（購入済み・未装備）
 invWeapons:[], // [{name,dice,adds,twoHand}]
 invArmors:[], // [{name,hits,stReq,isShield}]
 invBoots:false, // 後方互換用（廃止予定）
 invBootsName:null, // 'ブーツ' or 'サンダル'
 _spareFootwear:{}, // 予備の靴の数 {'ブーツ':n,'サンダル':n}
 invEquip:[], // その他所持品
 // 松明
 _torchStock: 0,
 _torchTurns: 0,
 // 装備スロット
 equippedWeapons:[], // 装備中武器（片手×2 or 両手×1）
 equippedArmors:[], // 装備中防具（シールド含む・最大1）
 equippedBoots:false,
 equippedClothing:false,
 spells:[],
 kills:0,
 alignment_ethics:0,  // -100(邪悪)〜+100(善良)
 alignment_order:0,   // -100(混沌)〜+100(秩序)
 // 時間・年齢
 age:20,
 birthYear:0,
 birthMonth:1,
 birthDay:1,
 // 場所
 town:'khazan',
 hasHorse:false,
 // 背景
 background:null,
 // クエスト
 quests:[],
 // パーティ（NPC仲間）
 party:[],
};

// ── DICE ───────────────────────────────
const d6 = () => Math.floor(Math.random()*6)+1;
const Nd6 = n => { let t=0; for(let i=0;i<n;i++) t+=d6(); return t; };
// 出目配列付きロール: {total, dice:[...]}
const rollNd6 = n => { const dice=[]; for(let i=0;i<n;i++) dice.push(d6()); return {total:dice.reduce((s,v)=>s+v,0), dice}; };
const diceStr = dice => `[${dice.join(',')}]`;

// ── CURRENCY SYSTEM ─────────────────────
// 1GP = 10SP = 100CP
// PC.gold(GP整数), PC.sp(SP整数), PC.cp(CP整数) を独立財布として管理
// 支払い時のみ GP→SP→CP の順に崩す（自動両替なし）

// CP換算した総所持金
function totalCP(pc=PC){ return (pc.gold||0)*100 + (pc.sp||0)*10 + (pc.cp||0); }

// CP → {gold,sp,cp} に正規化（内部互換用・gainCP系のみ使用）
function cpToCoins(cp){
 cp = Math.max(0, Math.floor(cp));
 const gold = Math.floor(cp/100); cp %= 100;
 const sp = Math.floor(cp/10); cp %= 10;
 return {gold, sp, cp};
}

// CP分を支払う。GP→SP→CP の順に崩す。足りなければfalse
function payCP(amount, pc=PC){
 amount = Math.floor(amount);
 if(totalCP(pc) < amount) return false;
 // CPから引く
 let rem = amount;
 let cp = pc.cp||0, sp = pc.sp||0, gold = pc.gold||0;
 if(cp >= rem){ cp -= rem; rem = 0; }
 else { rem -= cp; cp = 0; }
 if(rem > 0){
  if(sp >= Math.ceil(rem/10)){
   const spUsed = Math.ceil(rem/10);
   cp += spUsed*10 - rem; // お釣り
   sp -= spUsed; rem = 0;
  } else { rem -= sp*10; cp += sp*10; sp = 0; }
 }
 if(rem > 0){
  const gpUsed = Math.ceil(rem/100);
  cp += gpUsed*100 - rem;
  gold -= gpUsed; rem = 0;
 }
 pc.gold=gold; pc.sp=sp; pc.cp=cp;
 return true;
}

// CP分を受け取る（完全独立・繰り上げなし）
function gainCP(amount, pc=PC){ pc.cp = (pc.cp||0) + Math.floor(amount); }

// SP分を受け取る（完全独立・繰り上げなし）
function gainSP(amount, pc=PC){ pc.sp = (pc.sp||0) + Math.floor(amount); }

// GP分を受け取る（完全独立）
function gainGP(gp, pc=PC){ pc.gold = (pc.gold||0) + Math.floor(gp); }

// GP分を支払う（GPから直接引く。不足時はSP→CPの順に崩す）
function payGP(gp, pc=PC){
 gp = Math.floor(gp);
 if((pc.gold||0) + (pc.sp||0)/10 + (pc.cp||0)/100 < gp) return false;
 // GP支払い → パーティNPCの信頼度-1（PCが支払う場合のみ）
 if(pc===PC && gp>0 && (PC.party||[]).length>0) changeNPCTrust(-1);
 let rem = gp;
 let gold = pc.gold||0, sp = pc.sp||0, cp = pc.cp||0;
 if(gold >= rem){ gold -= rem; rem = 0; }
 else { rem -= gold; gold = 0; }
 if(rem > 0){
  // SPで補う（10SP=1GP）
  const spNeed = rem * 10;
  if(sp >= spNeed){ sp -= spNeed; rem = 0; }
  else { rem -= Math.floor(sp/10); sp %= 10; }
 }
 if(rem > 0){
  // CPで補う（100CP=1GP）
  const cpNeed = rem * 100;
  if(cp >= cpNeed){ cp -= cpNeed; rem = 0; }
 }
 pc.gold=gold; pc.sp=sp; pc.cp=cp;
 return rem === 0;
}

// ── 価格単位に応じた支払い関数 ──
// GP整数単位 → GPから直接引く（不足時のみSP/CPを両替してGPに繰り上げ）
// SP単位(0.1GP) → SPから直接引く（不足時のみGPを崩す）
// CP単位(0.01GP) → CPから直接引く（不足時SP/GP崩し）
function payPrice(costGP, pc=PC){
 const cp_total = Math.round(costGP * 100);
 if(totalCP(pc) < cp_total) return false;
 // GP支払い → パーティNPCの信頼度-1（PCが支払う場合のみ）
 if(pc===PC && costGP>0 && (PC.party||[]).length>0) changeNPCTrust(-1);

 if(cp_total % 100 === 0){
  // GP整数単位：GPから直接引く
  const gp = cp_total / 100;
  let gold = pc.gold||0, sp = pc.sp||0, cpv = pc.cp||0;
  if(gold >= gp){ gold -= gp; }
  else {
   const shortage = gp - gold; gold = 0;
   // 不足分をSP→CPの順で両替してGPに繰り上げ
   const spToGP = Math.floor(sp / 10);
   const cpToGP = Math.floor(cpv / 100);
   let need = shortage;
   const useSpGP = Math.min(spToGP, need);
   sp -= useSpGP * 10; need -= useSpGP;
   if(need > 0){
    const useCpGP = Math.min(cpToGP, need);
    cpv -= useCpGP * 100; need -= useCpGP;
   }
   if(need > 0) return false;
  }
  pc.gold=gold; pc.sp=sp; pc.cp=cpv;
 } else if(cp_total % 10 === 0){
  // SP単位：SPから直接引く（不足時GPを崩す）
  const sp_need = cp_total / 10;
  let gold = pc.gold||0, sp = pc.sp||0, cpv = pc.cp||0;
  if(sp >= sp_need){ sp -= sp_need; }
  else {
   const shortage = sp_need - sp; sp = 0;
   // GPを崩してSPに両替
   const gpNeeded = Math.ceil(shortage / 10);
   if(gold < gpNeeded) return false;
   gold -= gpNeeded;
   sp += gpNeeded * 10 - shortage;
  }
  pc.gold=gold; pc.sp=sp; pc.cp=cpv;
 } else {
  // CP単位：CPから直接引く（不足時SP→GP崩し）
  let rem = cp_total;
  let gold = pc.gold||0, sp = pc.sp||0, cpv = pc.cp||0;
  if(cpv >= rem){ cpv -= rem; rem = 0; }
  else { rem -= cpv; cpv = 0; }
  if(rem > 0){
   const spUsed = Math.ceil(rem / 10);
   if(sp >= spUsed){ cpv += spUsed*10 - rem; sp -= spUsed; rem = 0; }
   else { cpv += sp*10; rem -= sp*10; sp = 0; }
  }
  if(rem > 0){
   const gpUsed = Math.ceil(rem / 100);
   if(gold >= gpUsed){ cpv += gpUsed*100 - rem; gold -= gpUsed; rem = 0; }
   else return false;
  }
  pc.gold=gold; pc.sp=sp; pc.cp=cpv;
 }
 return true;
}

// コイン種別ごとの直接加算（宝物生成用）
function gainCoins(amount, type, pc=PC){
 if(type==='GP') gainGP(amount, pc);
 else if(type==='SP') gainSP(amount, pc);
 else gainCP(amount, pc);
}

// パーティ全員にGPを等分配（端数はPCが受け取る）
// ── パーティNPCの信頼度 ──────────────────────────
function npcTrust(npc){ return npc.trust ?? 0; }

function changeNPCTrust(delta, reason=''){
 (PC.party||[]).forEach(npc=>{
  npc.trust = Math.max(0, Math.min(100, (npc.trust??0) + delta));
 });
}

// PCから特定の仲間NPCに通貨を渡す（贈与。渡した相手の信頼度がわずかに上がる）
function giveCurrencyToNPC(npcIdx, currency){
 const n = PC.party[npcIdx];
 if(!n) return;
 const label = {gold:'GP', sp:'SP', cp:'CP'}[currency];
 const have = PC[currency]||0;
 const input = prompt(`${n.name}に渡す${label}を入力してください（あなたの所持${label}：${have}）`, '');
 if(input === null) return;
 const amount = parseInt(input, 10);
 if(!amount || amount <= 0){ showSaveToast('正しい金額を入力してください'); return; }
 if(have < amount){ showSaveToast(`所持${label}が足りません`); return; }
 PC[currency] -= amount;
 n[currency] = (n[currency]||0) + amount;
 n.trust = Math.max(0, Math.min(100, (n.trust??0) + 2));
 updateHUD();
 const el = document.getElementById('sp-party-content');
 if(el) renderNPCDetail(el, n, npcIdx);
 showSaveToast(`${n.name}に${amount}${label}渡した`);
}

function gainGPAll(totalGP){
 totalGP = Math.floor(totalGP);
 if(totalGP <= 0) return 0;
 // GP増加 → パーティNPCの信頼度+1
 if((PC.party||[]).length > 0) changeNPCTrust(+1);
 const members = [PC, ...(PC.party||[]).filter(n=>n.con>0)];
 const count = members.length;
 const share = Math.floor(totalGP / count);
 const rem = totalGP - share * count;
 members.forEach(m => gainGP(share, m));
 if(rem > 0) gainGP(rem, PC);
 return share;
}

function gainSPAll(totalSP){
 totalSP = Math.floor(totalSP);
 if(totalSP <= 0) return 0;
 const members = [PC, ...(PC.party||[]).filter(n=>n.con>0)];
 const count = members.length;
 const share = Math.floor(totalSP / count);
 const rem = totalSP - share * count;
 members.forEach(m => gainSP(share, m));
 if(rem > 0) gainSP(rem, PC);
 return share;
}

function gainCPAll(totalCP_){
 totalCP_ = Math.floor(totalCP_);
 if(totalCP_ <= 0) return 0;
 const members = [PC, ...(PC.party||[]).filter(n=>n.con>0)];
 const count = members.length;
 const share = Math.floor(totalCP_ / count);
 const rem = totalCP_ - share * count;
 members.forEach(m => gainCP(share, m));
 if(rem > 0) gainCP(rem, PC);
 return share;
}

