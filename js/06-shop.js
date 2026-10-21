/* ── 装備管理・インゲームショップ・生い立ちシステム ── */

// ══════════════════════════════════════════
// EQUIP MANAGEMENT
// ══════════════════════════════════════════

// 武器装備可否チェック
function canEquipWeapon(w, actor){
 actor = actor || PC;
 const eq = actor.equippedWeapons || [];
 const hasShield = (actor.equippedArmors||[]).some(a=>a.isShield);
 if(eq.includes(w)) return {ok:false, reason:'すでに装備中'};
 if(w.twoHand){
 if(eq.length>0) return {ok:false, reason:'他の武器を外してください'};
 if(hasShield) return {ok:false, reason:'盾を外してください（両手武器）'};
 } else {
 const hasTwoHand = eq.some(e=>e.twoHand);
 if(hasTwoHand) return {ok:false, reason:'両手武器を外してください'};
 if(hasShield && eq.length>=1) return {ok:false, reason:'盾装備中は武器1本のみ'};
 if(eq.length>=2) return {ok:false, reason:'武器スロットが満杯（2本まで）'};
 // 2本目の装備は戦士のみ
 if(eq.length===1 && actor.type!=='warrior') return {ok:false, reason:'二刀流は戦士のみ可能'};
 // 2本目装備時：既存武器と合算したST・DEX要求値チェック
 if(eq.length===1){
  const first = eq[0];
  const totalSt  = (first.stReq||0)  + (w.stReq||0);
  const totalDex = (first.dexReq||0) + (w.dexReq||0);
  if(actor.st  < totalSt)  return {ok:false, reason:`ST${totalSt}以上必要（現在${actor.st}）`};
  if(actor.dex < totalDex) return {ok:false, reason:`DEX${totalDex}以上必要（現在${actor.dex}）`};
 }
 }
 return {ok:true};
}

// 防具装備可否チェック
function canEquipArmor(a, actor){
 actor = actor || PC;
 const eq = actor.equippedArmors || [];
 if(eq.includes(a)) return {ok:false, reason:'すでに装備中'};
 if(a.isShield){
 if(eq.find(e=>e.isShield)) return {ok:false, reason:'盾は1つまで'};
 const hasTwoHand = (actor.equippedWeapons||[]).some(w=>w.twoHand);
 if(hasTwoHand) return {ok:false, reason:'両手武器装備中はシールド不可'};
 if((actor.equippedWeapons||[]).length>=2) return {ok:false, reason:'二刀流中は盾を装備できません'};
 } else {
 // 鎧（非シールド）は1つまで
 if(eq.find(e=>!e.isShield)) return {ok:false, reason:'鎧は1つまで'};
 }
 return {ok:true};
}

function equipRanged(idx){
 const w = PC.invWeapons[idx];
 if(!w || !isRangedWeapon(w)) return;
 if(PC.type === 'wizard'){ showSaveToast('魔法使いは遠距離武器を装備できません'); return; }
 if(PC.equippedRanged) PC.invWeapons.push(PC.equippedRanged); // 既存を所持に戻す
 PC.invWeapons.splice(idx, 1); // スロットから削除
 PC.equippedRanged = w;
 checkWeightPenalty(); updateHUD(); renderStatusPanel(); showSaveToast(` ${w.name}を遠距離スロットに装備した`);
}
function unequipRanged(){
 if(!PC.equippedRanged) return;
 const w = PC.equippedRanged;
 PC.equippedRanged = null;
 PC.invWeapons.push(w);
 checkWeightPenalty(); updateHUD(); renderStatusPanel(); showSaveToast(`${w.name}を外した`);
}
function equipWeapon(idx){
 const _sa = _shopActor || PC;
 const w = _sa.invWeapons[idx];
 if(!w) return;
 const check = canEquipWeapon(w);
 if(!check.ok){ showSaveToast(' '+check.reason); return; }
 PC.equippedWeapons.push(w);
 checkWeightPenalty(); updateHUD(); renderStatusPanel(); showSaveToast(` ${w.name}を装備した`);
}
function unequipWeapon(idx){
 const w = PC.equippedWeapons[idx];
 if(!w) return;
 PC.equippedWeapons.splice(idx,1);
 // 通常のPC装備は所持品リストに実体が残っているが、NPC時代に装備した物を引き継いだ場合は
 // 所持品リストから既に取り除かれているため、無ければここで所持品に戻す（消失防止）
 if(!PC.invWeapons.includes(w)) PC.invWeapons.push(w);
 checkWeightPenalty(); updateHUD(); renderStatusPanel(); showSaveToast(`${w.name}を外した`);
}
function equipArmor(idx){
 const _sa2 = _shopActor || PC;
 const a = _sa2.invArmors[idx];
 if(!a) return;
 const check = canEquipArmor(a);
 if(!check.ok){ showSaveToast(' '+check.reason); return; }
 PC.equippedArmors.push(a);
 checkWeightPenalty(); updateHUD(); renderStatusPanel(); showSaveToast(` ${a.name}を装備した`);
}
function unequipArmor(idx){
 const a = PC.equippedArmors[idx];
 if(!a) return;
 PC.equippedArmors.splice(idx,1);
 if(!PC.invArmors.includes(a)) PC.invArmors.push(a);
 checkWeightPenalty(); updateHUD(); renderStatusPanel(); showSaveToast(`${a.name}を外した`);
}
function equipClothing(){
 if(!PC.invClothing) return;
 PC.equippedClothing=true;
 checkWeightPenalty(); updateHUD(); renderStatusPanel(); showSaveToast(' '+( PC.invClothingName||'防寒着と荷物袋')+'を着た');
}
function unequipClothing(){
 PC.equippedClothing=false;
 checkWeightPenalty(); updateHUD(); renderStatusPanel(); showSaveToast(' 衣服を脱いだ');
}
function sellClothing(){
 const _sa = _shopActor||PC;
 const name = _sa.invClothingName||'防寒着と荷物袋';
 const def = EQUIP_TABLE.find(t=>t.name===name)||EQUIP_TABLE.find(t=>t.name==='防寒着と荷物袋');
 if(def) gainPriceCP(sellPriceCP(def.cost), _sa);
 _sa.invClothing=false; _sa.invClothingName=null; _sa.equippedClothing=false;
 updateHUD(); renderStatusPanel(); showSaveToast('衣服を売った');
}
function equipBoots(){
 PC.equippedBoots=true;
 renderStatusPanel(); showSaveToast(' Bootsを履いた');
}
function unequipBoots(){
 PC.equippedBoots=false;
 renderStatusPanel(); showSaveToast('Bootsを脱いだ');
}

// ── 予備の靴（ブーツ・サンダルを種類ごとに独立して数える。履いている／持っている1足は invBoots / invBootsName のまま） ──
const FOOTWEAR_NAMES = ['ブーツ','サンダル'];
let _footwearSwapPending = false; // 旅の途中で靴が壊れ、予備があるため履き替えの選択待ち（保存しない）
function spareFootwearCount(name, pc){ pc = pc || PC; return (pc._spareFootwear && pc._spareFootwear[name]) || 0; }
function spareFootwearTotal(pc){ return FOOTWEAR_NAMES.reduce((s,n)=>s+spareFootwearCount(n, pc), 0); }
function addSpareFootwear(pc, name){
 if(!pc._spareFootwear) pc._spareFootwear = {};
 pc._spareFootwear[name] = (pc._spareFootwear[name]||0) + 1;
}
// 予備の1足を主人公が履く（現在の靴は無い状態が前提）。摩耗日数は新品としてやり直す
function wearSpareFootwear(name){
 if(spareFootwearCount(name) <= 0 || PC.invBoots) return false;
 PC._spareFootwear[name]--;
 PC.invBoots = true; PC.invBootsName = name; PC.equippedBoots = true;
 PC._bootsWearDays = 0; PC._bootsBreakThreshold = null;
 return true;
}
function wearSpareFootwearUI(name){
 if(!wearSpareFootwear(name)) return;
 checkWeightPenalty(); updateHUD(); renderStatusPanel(); showSaveToast(` 予備の${name}を履いた`);
}
function sellSpareFootwear(name){
 if(spareFootwearCount(name) <= 0) return;
 PC._spareFootwear[name]--;
 const def = EQUIP_TABLE.find(t=>t.name===name);
 if(def) gainPriceCP(sellPriceCP(def.cost), PC);
 updateHUD(); checkWeightPenalty(); renderStatusPanel();
 if(typeof renderIngameShop === 'function' && isShopOpen()) renderIngameShop();
 showSaveToast(` 予備の${name}を売った（${sellPriceLabel(def?def.cost:0)}）`);
}

// ブーツ・サンダルの摩耗（移動1日ごとに蓄積し、365日±30日で壊れる）
function tickFootwearWear(){
 if(!PC.equippedBoots) return;
 if(PC._bootsBreakThreshold == null){
  PC._bootsBreakThreshold = 365 + Math.floor((Math.random()-0.5)*60); // 335〜395日
  PC._bootsWearDays = 0;
 }
 PC._bootsWearDays = (PC._bootsWearDays||0) + 1;
 if(PC._bootsWearDays >= PC._bootsBreakThreshold){
  const name = PC.invBootsName || 'ブーツ';
  PC.equippedBoots = false;
  PC.invBoots = false;
  PC.invBootsName = null;
  PC._bootsWearDays = 0;
  PC._bootsBreakThreshold = null;
  if(travelState){
   travelLog(`<span style="color:#c8a870"> 履き潰した${name}が、ついに擦り切れて壊れてしまった……</span>`);
   if(spareFootwearTotal() > 0) _footwearSwapPending = true; // 履き替えるかどうかは、旅の1日の処理の後に本人に選ばせる
  } else {
   showSaveToast(`${name}が擦り切れて壊れてしまった…`);
  }
  updateHUD();
 }
}

// 靴が壊れたときの履き替えの選択（旅を一時停止して選ばせ、選んだら旅を再開する）
function promptFootwearSwap(ts){
 _footwearSwapPending = false;
 const resume = ()=>{ ts._resumeWithoutIncrement = true; setTimeout(_travelTickSched(), ts.interval); };
 const owned = FOOTWEAR_NAMES.filter(n=>spareFootwearCount(n) > 0);
 if(!owned.length || PC.invBoots){ resume(); return; }
 const doSwap = (n)=>{
  if(wearSpareFootwear(n)){
   travelLog(`<span style="color:#c8b8a0"> 予備の${n}に履き替えた。</span>`);
   checkWeightPenalty(); updateHUD();
  }
  resume();
 };
 const keep = {label:'履き替えない（予備は荷物に残す）', fn:()=>{
  travelLog(`<span style="color:#b8a890"> 予備は荷物に入れたまま、旅を続けた。</span>`);
  resume();
 }};
 const spareText = owned.map(n=>`${n}${spareFootwearCount(n)}足`).join('・');
 travelLog(`<span style="color:#e0d8c8"> 予備の靴（${spareText}）を持っている。履き替えますか？</span>`);
 renderChoices([
  {label:'履き替える', fn:()=>{
   if(owned.length === 1){ doSwap(owned[0]); return; }
   renderChoices([
    ...owned.map(n=>({label:`${n}を履く（予備${spareFootwearCount(n)}足）`, fn:()=>doSwap(n)})),
    keep,
   ]);
  }},
  keep,
 ]);
}

// ══════════════════════════════════════════
// IN-GAME SHOP
// ══════════════════════════════════════════

// ── JEWEL SHOP ──────────────────────────────────────────────────
// 各町の店頭在庫（5品）：showIngameShop時に生成、町IDをキーに保持
let _jewelStock = {}; // { townId: [{name, desc, priceGP},...] }

function generateJewelStock(townId){
 if(_jewelStock[townId]) return _jewelStock[townId];
 const stock = [];
 for(let i=0;i<5;i++) stock.push(generateShopJewel());
 _jewelStock[townId] = stock;
 return stock;
}

function generateShopJewel(){
 const f = d6(), s = d6();
 const gem = TREASURE_GEMS.find(g=>g.f===f && g.s.includes(s)) || TREASURE_GEMS[0];
 let sizeRoll = d6();
 if(sizeRoll === 6){
  // Jeweled item
  const itemType = TREASURE_ITEM_TYPES[d6()-1];
  let setting = TREASURE_SETTINGS[d6()-1];
  // 店では武器は出さない（装身具のみ）
  const shopItemType = itemType === '武器' ? '首飾り' : itemType;
  let sr2 = d6(); if(sr2===6) sr2=d6();
  const gemCount = sr2<=1?5 : sr2<=2?4 : sr2<=3?3 : sr2<=4?2 : 1;
  const priceGP = gem.base * 10 * gemCount;
  return {
   name: gem.name+'x'+gemCount+' '+setting+' '+shopItemType,
   desc: setting+' '+shopItemType+' / '+gem.name+' x'+gemCount,
   priceGP,
   icon: ''
  };
 }
 const sizes = [
  {name:'小',mult:5},{name:'並',mult:10},{name:'大',mult:20},
  {name:'特大',mult:50},{name:'巨大',mult:100}
 ];
 const sz = sizes[sizeRoll-1];
 const priceGP = gem.base * sz.mult;
 return {
  name: sz.name+' '+gem.name,
  desc: sz.name+' / '+gem.name+' (base '+gem.base+'GP)',
  priceGP,
  icon: ''
 };
}

function igsBuyJewel(townId, idx){
 const stock = _jewelStock[townId];
 if(!stock || !stock[idx]) return;
 const it = stock[idx];
 if(!payPrice(it.priceGP)){ showSaveToast('所持金が足りない'); return; }
 if(it._isMagicWeapon && it._weaponData){
  PC.invWeapons = PC.invWeapons || [];
  PC.invWeapons.push({...it._weaponData});
  stock.splice(idx, 1);
  updateHUD(); renderIngameShop(townId);
  showSaveToast(`⚔ ${it.name}を入手した（ステータスから装備できます）`);
 } else {
  PC.invJewels = PC.invJewels || [];
  PC.invJewels.push({name: it.name, priceGP: it.priceGP});
  stock.splice(idx, 1);
  updateHUD(); renderIngameShop(townId);
  showSaveToast(' '+it.name+'を購入した（売却タブから売れます）');
 }
}

function sellJewel(idx){
 PC.invJewels = PC.invJewels || [];
 const j = PC.invJewels[idx];
 if(!j) return;
 PC.invJewels.splice(idx,1);
 const priceCP = Math.floor(j.priceGP * 100 * 0.5);
 gainPriceCP(priceCP);
 updateHUD(); renderIngameShop();
 showSaveToast(' '+j.name+'を売った（'+formatItemCost(priceCP/100)+'）');
}
// ── END JEWEL SHOP ──────────────────────────────────────────────
// 現在ショップに入っているキャラ（PC or パーティNPC）
let _shopActor = null;

// キャラ選択画面を表示してからショップへ
function showIngameShop(townId){
 const members = [PC, ...(PC.party||[]).filter(n=>n.con>0)];
 // パーティがいない場合はPC固定で即入店
 if(members.length === 1){
  _shopActor = PC;
  _openIngameShop(townId);
  return;
 }
 // キャラ選択画面を表示（元の内容は退避しておき、選択後に復元する＝旅ログ消失防止）
 const story = document.getElementById('story');
 window._shopSelectPrevStoryHtml = story ? story.innerHTML : null;
 if(story) story.innerHTML = ' 武器屋・装備屋<br><br><span style="color:#d0c8b8">誰が入店しますか？</span>';
 const choices = members.map(m => ({
  label: m === PC
   ? `${m.name}（PC） [${m.gold||0}GP ${m.sp||0}SP ${m.cp||0}CP]`
   : `${m.name}（${({warrior:'戦士',rogue:'盗賊',wizard:'魔法使い'}[m.type]||m.type)}） [${m.gold||0}GP ${m.sp||0}SP ${m.cp||0}CP]`,
  labelHtml: m === PC
   ? `${m.name}（PC） [${formatMoney(m)}]`
   : `${m.name}（${({warrior:'戦士',rogue:'盗賊',wizard:'魔法使い'}[m.type]||m.type)}） [${formatMoney(m)}]`,
  fn: ()=>{
   _shopActor = m;
   _openIngameShop(townId);
  },
 }));
 choices.push({label:'<- 戻る', go:'TOWN_'+(townId||PC.town).toUpperCase()});
 renderChoices(choices);
}

function _openIngameShop(townId){
 // キャラ選択画面表示時に退避しておいたstoryの内容を復元（旅ログ消失防止）
 if(window._shopSelectPrevStoryHtml != null){
  const storyEl = document.getElementById('story');
  if(storyEl) storyEl.innerHTML = window._shopSelectPrevStoryHtml;
  window._shopSelectPrevStoryHtml = null;
 }
 document.getElementById('ingame-shop').classList.remove('hidden');
 document.getElementById('text-win').style.display = 'none';
 // キャラ選択メニューを消す
 const choicesEl = document.getElementById('choices');
 if(choicesEl) choicesEl.innerHTML = '';
 if(window.innerWidth < 860) document.getElementById('inv-panel').classList.add('hidden');
 renderIngameShop(townId || PC.town);
}

function closeIngameShop(){
 document.getElementById('ingame-shop').classList.add('hidden');
 document.getElementById('text-win').style.display = '';
 _shopActor = null;
 // 旅商人ショップを閉じた場合 → 旅を再開
 if(travelState && travelState._merchantOpen){
  travelState._merchantOpen = false;
  const choices = document.getElementById('choices');
  if(choices) choices.innerHTML = '';
  setTimeout(_travelTickSched(), travelState.interval);
  return;
 }
 // チュートリアルの装備購入中なら、買った物に関わらず次のフェーズへ進む（所持金不足等は自己責任）
 if(PC._tutorial && PC._tutorial.step==='intro'){
  go('TUTORIAL_DELIVERY_INTRO');
  return;
 }
 // チュートリアルの討伐前（松明購入等）に立ち寄った場合は、討伐案内画面に戻す
 if(PC._tutorial && PC._tutorial.step==='delivery_done'){
  go('TUTORIAL_HUNT_INTRO');
  return;
 }
 // チュートリアルの帰郷前（食料購入等）に立ち寄った場合は、帰郷案内画面に戻す
 if(PC._tutorial && PC._tutorial.step==='homecoming_ask'){
  go('TUTORIAL_HOMECOMING_ASK');
  return;
 }
 // townIdから正しい街ノードに戻る（カザーヌへの誤帰還を防ぐ）
 const shopTownId = _igsTownId || PC.town;
 const shopNode = 'SHOP_' + shopTownId.toUpperCase();
 const townNode = 'TOWN_' + shopTownId.toUpperCase();
 const target = NODES[shopNode] || NODES[currentNodeId] || NODES[townNode];
 if(target) renderChoices(typeof target.choices==='function' ? target.choices() : target.choices||[]);
}

// ショップが開いているか
function isShopOpen(){ return !document.getElementById('ingame-shop').classList.contains('hidden'); }

// 売値（買値の50%、CP単位）
function sellPriceCP(costGP){ return Math.floor(costGP * 100 * 0.5); }

// CP換算の売値を適切な通貨単位で加算
function gainPriceCP(priceCP, pc=PC){
 if(priceCP <= 0) return;
 if(priceCP % 100 === 0){ gainGP(priceCP/100, pc); }        // GP整数単位
 else if(priceCP % 10 === 0){ gainSP(priceCP/10, pc); }     // SP単位
 else { gainCP(priceCP, pc); }                               // CP単位
}
function sellPriceLabel(costGP){
 const cp = sellPriceCP(costGP);
 if(cp === 0) return '0CP';
 if(cp % 100 === 0) return `${cp/100}GP`;
 if(cp % 10 === 0) return `${cp/10}SP`;
 return `${cp}CP`;
}

// 武器を売る
function renameWeapon(idx){
 const w = (PC.invWeapons||[])[idx];
 if(!w) return;
 const current = w.name;
 const newName = prompt(`武器の名前を変更します。\n現在の名前：${current}\n\n新しい名前を入力してください：`, current);
 if(!newName || newName.trim() === '' || newName === current) return;
 // 初回リネーム時に元の名前を保存
 if(!w._baseName) w._baseName = current;
 w.name = newName.trim();
 // 装備中の同名武器も更新
 PC.equippedWeapons = (PC.equippedWeapons||[]).map(e=>e.name===current ? {...e, name:w.name, _baseName:w._baseName} : e);
 saveGame();
 renderStatusPanel();
 showSaveToast(` 武器名を「${w.name}」に変更した`);
}

function sellWeapon(idx){
 const _sa = _shopActor||PC;
 const w = (_sa.invWeapons||[])[idx];
 if(!w) return;
 _sa.equippedWeapons = (_sa.equippedWeapons||[]).filter(e=>e!==w);
 _sa.invWeapons.splice(idx,1);
 // 魔法武器は_priceGPの半額
 if(w._isMagic && w._priceGP){
  const price = Math.floor(w._priceGP * 0.5 * 100);
  if(price>0) gainPriceCP(price, _sa);
  updateHUD(); checkWeightPenalty(); renderIngameShop();
  showSaveToast(` ${w.name}を売った（${Math.floor(w._priceGP*0.5)}GP）`);
  return;
 }
 const def = [...WEAPONS_TABLE,...WEAPONS_TABLE_KHAZAN,...WEAPONS_TABLE_ELSIA,...WEAPONS_TABLE_AL_RASHID,...WEAPONS_TABLE_YELDUN,...WEAPONS_TABLE_VALDHEIM,...WEAPONS_TABLE_NERIA].find(t=>t.name===(w._baseName||w.name));
 const price = def ? sellPriceCP(def.cost) : 0;
 if(price>0) gainPriceCP(price, _sa);
 updateHUD(); checkWeightPenalty(); renderIngameShop();
 showSaveToast(` ${w.name}を売った（${sellPriceLabel(def?.cost||0)}）`);
}

// 防具を売る
function sellArmor(idx){
 const _sa = _shopActor||PC;
 const a = (_sa.invArmors||[])[idx];
 if(!a) return;
 _sa.equippedArmors = (_sa.equippedArmors||[]).filter(e=>e!==a);
 _sa.invArmors.splice(idx,1);
 const def = [...ARMOR_TABLE,...(ARMOR_TABLE_KHAZAN||[])].find(t=>t.name===a.name);
 const price = def ? sellPriceCP(def.cost) : 0;
 if(price>0) gainPriceCP(price, _sa);
 updateHUD(); checkWeightPenalty(); renderIngameShop();
 showSaveToast(` ${a.name}を売った（${sellPriceLabel(def?.cost||0)}）`);
}

// 未装備の武器を捨てる（対価なし・ショップ外でも使用可）
function discardWeapon(idx){
 const w = PC.invWeapons[idx];
 if(!w) return;
 if(PC.equippedWeapons.includes(w)){ showSaveToast('装備中の武器は先に外してください'); return; }
 PC.invWeapons.splice(idx,1);
 updateHUD(); checkWeightPenalty(); renderStatusPanel();
 if(isShopOpen()) renderIngameShop();
 showSaveToast(`${w.name}を捨てた`);
}

// 未装備の防具を捨てる（対価なし・ショップ外でも使用可）
function discardArmor(idx){
 const a = PC.invArmors[idx];
 if(!a) return;
 if(PC.equippedArmors.includes(a)){ showSaveToast('装備中の防具は先に外してください'); return; }
 PC.invArmors.splice(idx,1);
 updateHUD(); checkWeightPenalty(); renderStatusPanel();
 if(isShopOpen()) renderIngameShop();
 showSaveToast(`${a.name}を捨てた`);
}

// 所持金を捨てる（GP/SP/CP）
function discardCurrency(currency){
 const label = {gold:'GP', sp:'SP', cp:'CP'}[currency];
 const have = PC[currency]||0;
 const input = prompt(`捨てる${label}を入力してください（現在の所持${label}：${have}）`, '');
 if(input === null) return;
 const amount = parseInt(input, 10);
 if(!amount || amount <= 0){ showSaveToast('正しい金額を入力してください'); return; }
 if(have < amount){ showSaveToast(`所持${label}が足りません`); return; }
 PC[currency] -= amount;
 updateHUD(); checkWeightPenalty(); renderStatusPanel();
 showSaveToast(`${amount}${label}を捨てた`);
}

// ブーツを売る
function sellBoots(){
 const _sa = _shopActor||PC;
 const bootsName = _sa.invBootsName || 'ブーツ';
 _sa.invBoots=false; _sa.invBootsName=null; _sa.equippedBoots=false;
 const def = EQUIP_TABLE.find(t=>t.name===bootsName);
 const price = def ? sellPriceCP(def.cost) : 0;
 if(price>0) gainPriceCP(price, _sa);
 updateHUD(); checkWeightPenalty(); renderIngameShop();
 showSaveToast(` ${bootsName}を売った（${sellPriceLabel(def?.cost||0)}）`);
}

// その他所持品を売る（invEquip内）
function sellEquip(idx){
 const _sa = _shopActor||PC;
 const name = (_sa.invEquip||[])[idx];
 if(!name) return;
 _sa.invEquip.splice(idx,1);
 const def = EQUIP_TABLE.find(t=>t.name===name);
 const price = def ? sellPriceCP(def.cost) : 0;
 if(price>0) gainPriceCP(price, _sa);
 updateHUD(); checkWeightPenalty(); renderIngameShop();
 showSaveToast(` ${name}を売った（${sellPriceLabel(def?.cost||0)}）`);
}

// 松明を1本売る
function sellTorch(){
 const total = (PC._torchStock||0) + (PC._torchTurns>0?1:0);
 if(total<=0) return;
 if(PC._torchTurns>0){ PC._torchTurns=0; }
 else { PC._torchStock--; }
 const def = EQUIP_TABLE.find(t=>t.name==='松明');
 const price = def ? sellPriceCP(def.cost) : 0;
 if(price>0) gainPriceCP(price);
 updateHUD(); checkWeightPenalty(); renderIngameShop();
 showSaveToast(` Torchを売った（${sellPriceLabel(def?.cost||0)}）`);
}

// 現在のタブ
let _igsTab = 'weapon';
let _igsTownId = null;

function igsSetTab(tab){
 _igsTab = tab;
 // タブボタンのスタイル更新
 document.querySelectorAll('.igs-tab').forEach(btn=>{
 const active = btn.dataset.tab === tab;
 const isSell = btn.dataset.tab === 'sell';
 if(active && isSell){
 btn.style.background = '#201000';
 btn.style.borderColor = 'var(--gold4)';
 btn.style.color = 'var(--reward)';
 } else if(active){
 btn.style.background = '#2a1a08';
 btn.style.borderColor = 'var(--leather)';
 btn.style.color = 'var(--gold3)';
 } else {
 btn.style.background = 'var(--info-bg)';
 btn.style.borderColor = 'var(--steel)';
 btn.style.color = 'var(--slate)';
 }
 });
 renderIgsList(_igsTownId);
}

function renderIgsList(townId){
 const isKhazan    = (townId||'') === 'khazan';
 const isElsia     = (townId||'') === 'elsia';
 const isAlRashid  = (townId||'') === 'al_rashid';
 const isYeldun    = (townId||'') === 'yeldun';
 const isValdheim  = (townId||'') === 'valdheim';
 const isNeria     = (townId||'') === 'neria' || (townId||'') === 'kalvo';
 const isVillage   = ['verda','rimholm','marakai'].includes(townId||'');
 const wTable = isKhazan   ? WEAPONS_TABLE_KHAZAN
              : isElsia    ? WEAPONS_TABLE_ELSIA
              : isAlRashid ? WEAPONS_TABLE_AL_RASHID
              : isYeldun   ? WEAPONS_TABLE_YELDUN
              : isValdheim ? WEAPONS_TABLE_VALDHEIM
              : isNeria    ? WEAPONS_TABLE_NERIA
              : (()=>{
                 // 旅商人：10%で他地方の傑作品を1つ追加
                 if(townId === '__merchant__' && Math.random() < 0.10){
                  const allMasterpieces = [
                   ...WEAPONS_TABLE_ELSIA,
                   ...WEAPONS_TABLE_AL_RASHID,
                   ...WEAPONS_TABLE_YELDUN,
                   ...WEAPONS_TABLE_VALDHEIM,
                   ...WEAPONS_TABLE_NERIA,
                  ].filter(w=>w._masterpiece);
                  // 現在地の地方と違うものを選ぶ
                  const curRegion = getRegionKey(PC.town);
                  const regionMpMap = {
                   elmaria_region: '名匠の鉈',
                   zahara_region: '名匠の野太刀',
                   draklim_region: '名匠の両刃斧',
                   valdheim_region: '名匠のグレートソード',
                   marea_region: 'Masterpiece Pilum',
                  };
                  const localMp = regionMpMap[curRegion];
                  const candidates = allMasterpieces.filter(w=>w.name !== localMp);
                  if(candidates.length){
                   const pick = candidates[Math.floor(Math.random()*candidates.length)];
                   return [...WEAPONS_TABLE, pick];
                  }
                 }
                 return WEAPONS_TABLE;
                })();
 // ヴァルドヘイム・エルシアはそれぞれの地方の中心都市のみが対象（同地方の他の町では売らない）
 const aTable = isKhazan   ? ARMOR_TABLE_KHAZAN
              : isElsia    ? ARMOR_TABLE_ELSIA
              : (isAlRashid || isYeldun || isValdheim) ? ARMOR_TABLE_WITH_SCALE
              : ARMOR_TABLE;
 // 地方状態システム：物流途絶度の段階に応じて正規ラインを間引く（旅商人は対象外）
 const _logiStage = (townId === '__merchant__') ? 0 : shopRegionLogiStage(townId);
 const wTableShown = shopFilterWeaponsByLogi(wTable, _logiStage);
 const aTableShown = shopFilterArmorByLogi(aTable, _logiStage);
 const el = document.getElementById('igs-list');
 el.innerHTML = '';

 if(_igsTab === 'sell'){
 // ── 売却タブ ──────────────────────────
 let hasAny = false;

 const sec = (label) => {
 const h = document.createElement('div');
 h.style.cssText = 'font-size:calc(var(--font-sm) - 1px);color:#d8d0c0;margin:10px 0 4px;border-bottom:1px solid #443322;padding-bottom:3px';
 h.textContent = label; el.appendChild(h);
 };

 const row = (icon, name, priceCP, onSellFn) => {
  hasAny = true;
  const div = document.createElement('div'); div.className='shop-item';
  const priceLabel = formatItemCost(priceCP/100);
  const sellBtn = document.createElement('button');
  sellBtn.className = 'buy-btn';
  sellBtn.style.cssText = 'border-color:#e8e0d0;color:#f0ece0;background:var(--coal)';
  sellBtn.textContent = 'SELL';
  sellBtn.addEventListener('click', ()=>{ onSellFn(); });
  div.innerHTML = `<h4>${icon} ${name}</h4><span class="price" style="color:#f0ece0">売値: ${priceLabel}</span>`;
  div.appendChild(sellBtn);
  el.appendChild(div);
 };

 // 武器（未装備のみ）
 const _shopA = _shopActor || PC;
 const uninvW = (_shopA.invWeapons||[]).filter(w=>!(_shopA.equippedWeapons||[]).find(e=>e.name===w.name)); // 弓などの飛び道具も売却可（装備中の遠距離武器はinvWeaponsに入っていない）
 if(uninvW.length){
  sec(' 武器');
  uninvW.forEach(w=>{
   const def = [...WEAPONS_TABLE,...WEAPONS_TABLE_KHAZAN,...WEAPONS_TABLE_ELSIA,...WEAPONS_TABLE_AL_RASHID,...WEAPONS_TABLE_YELDUN,...WEAPONS_TABLE_VALDHEIM,...WEAPONS_TABLE_NERIA].find(t=>t.name===(w._baseName||w.name));
   const priceCP = w._isMagic && w._priceGP ? Math.floor(w._priceGP * 0.5 * 100) : (def ? sellPriceCP(def.cost) : 0);
   const _w = w;
   row(w._isMagic ? '⚔' : '', w.name, priceCP, ()=>{ const _idx=(_shopActor||PC).invWeapons.indexOf(_w); if(_idx>=0) sellWeapon(_idx); });
  });
 }

 // 防具（未装備のみ）
 const uninvA = (_shopA.invArmors||[]).filter(a=>!(_shopA.equippedArmors||[]).find(e=>e.name===a.name));
 if(uninvA.length){
  sec(' 防具・盾');
  uninvA.forEach(a=>{
   const def = [...ARMOR_TABLE,...(ARMOR_TABLE_KHAZAN||[])].find(t=>t.name===a.name);
   const _a = a;
   row(a.isShield?'':'', a.name, def ? sellPriceCP(def.cost) : 0, ()=>{ const _idx=(_shopActor||PC).invArmors.indexOf(_a); if(_idx>=0) sellArmor(_idx); });
  });
 }

 // ブーツ（未装備のみ）
 if(_shopA.invBoots && !_shopA.equippedBoots){
  sec(' 装備品');
  const def = EQUIP_TABLE.find(t=>t.name==='ブーツ');
  const bn = _shopA.invBootsName||'ブーツ'; const bdef=EQUIP_TABLE.find(t=>t.name===bn)||def;
  row('', bn, bdef ? sellPriceCP(bdef.cost) : 0, ()=>sellBoots());
 }
 // 予備の靴（主人公のみ）
 if(_shopA === PC){
  let _spareHead = !!(_shopA.invBoots && !_shopA.equippedBoots); // 靴の行で「装備品」見出しが出ていれば重ねない
  FOOTWEAR_NAMES.forEach(n=>{
   const cnt = spareFootwearCount(n);
   if(cnt <= 0) return;
   if(!_spareHead){ sec(' 装備品'); _spareHead = true; }
   const sdef = EQUIP_TABLE.find(t=>t.name===n);
   for(let k=0; k<cnt; k++) row('', `予備の${n}`, sdef ? sellPriceCP(sdef.cost) : 0, ()=>sellSpareFootwear(n));
  });
 }

 // その他所持品
 if(_shopA.invEquip && _shopA.invEquip.length){
  sec(' 消耗品');
  _shopA.invEquip.forEach((name)=>{
   const def = EQUIP_TABLE.find(t=>t.name===name);
   const _name = name;
   row('', name, def ? sellPriceCP(def.cost) : 0, ()=>{ const _i=(_shopActor||PC).invEquip.indexOf(_name); if(_i>=0) sellEquip(_i); });
  });
 }

 // 松明（PC共有）
 const torchTotal = (PC._torchStock||0) + (PC._torchTurns>0?1:0);
 if(torchTotal > 0){
  if(!_shopA.invEquip?.length && !_shopA.invBoots) sec(' 消耗品');
  const def = EQUIP_TABLE.find(t=>t.name==='松明');
  for(let i=0; i<torchTotal; i++){
   row('', '松明', def ? sellPriceCP(def.cost) : 0, ()=>sellTorch());
  }
 }

 // 特産品
 if((PC.invSpecialties||[]).length){
  sec(' 特産品');
  PC.invSpecialties.forEach((sp, idx)=>{
   const sellPrice = calcSpecialtySellPrice(sp, townId||PC.town);
   const fromKey = sp.regionKey;
   const toKey = getRegionKey(townId||PC.town);
   const n = (fromKey&&toKey) ? getRegionDistance(fromKey,toKey) : 0;
   const profitInfo = n===0
    ? '<span style="color:#c8b8a0;font-size:calc(var(--font-sm) - 3px)">（地元：利益少）</span>'
    : `<span style="color:var(--white);font-size:calc(var(--font-sm) - 3px)">（+${n}地方離れ → ×${1+n}倍）</span>`;
   const div = document.createElement('div'); div.className='shop-item';
   const _sp = sp;
   const spBtn = document.createElement('button');
   spBtn.className = 'buy-btn';
   spBtn.style.cssText = 'border-color:#e8e0d0;color:#f0ece0;background:var(--coal)';
   spBtn.textContent = 'SELL';
   spBtn.addEventListener('click', ()=>{ const _i=PC.invSpecialties.indexOf(_sp); if(_i>=0) sellSpecialty(_i); });
   div.innerHTML = `<h4>${sp.icon} ${sp.name} ${profitInfo}</h4><span class="price" style="color:#f0ece0">売値: ${sellPrice}GP</span>`;
   div.appendChild(spBtn);
   el.appendChild(div);
   hasAny = true;
  });
 }

 // 宝飾品
 if((PC.invJewels||[]).length){
  sec(' 宝飾品');
  PC.invJewels.forEach((j)=>{
   const priceCP = Math.floor(j.priceGP*100*0.5);
   const _j = j;
   row('', j.name, priceCP, ()=>{ const _i=PC.invJewels.indexOf(_j); if(_i>=0) sellJewel(_i); });
  });
 }

 if(!hasAny && !(PC.invJewels||[]).length){
  el.innerHTML = '<div style="font-size:var(--font-sm);color:#c8b8a0;padding:12px 0;text-align:center">売れるものがありません</div>';
 }
 return;
 }
 if(_igsTab === 'weapon'){
 if(wTableShown.length < wTable.length || _logiStage >= 3){
  const note = document.createElement('div');
  note.style.cssText = 'font-size:calc(var(--font-sm) - 2px);color:#a89880;margin-bottom:6px';
  note.textContent = _logiStage>=2 ? '仕入れが滞っており、品薄になっている。' : '品揃えがやや乏しくなっている。';
  el.appendChild(note);
 }
 wTableShown.forEach(it=>{
 const _sa = _shopActor||PC;
 const canUse = it.stReq<=_sa.st && it.dexReq<=_sa.dex && (_sa.type==='warrior'||_sa.type==='rogue'||it.dice<=2) && (!(_sa===PC&&PC._noHeavyWeapon)||it.dice<=2);
 const div = document.createElement('div'); div.className='shop-item';
 // 物流途絶度stage3の補充用「棍棒」はそのテーブル自体に存在しない場合があるため、
 // その場合はigsBuyWeaponの町別テーブルに頼らず専用の購入処理を使う
 const _idxInTable = wTable.indexOf(it);
 const _buyCall = _idxInTable >= 0 ? `igsBuyWeapon(${_idxInTable},'${townId}')` : `igsBuyFallbackClub('${townId}')`;
 div.innerHTML = `<h4>${it.name}${it.twoHand?' <span style="color:#e0d8c8;font-size:calc(var(--font-sm) - 3px)">両手</span>':''}${canUse?'':' <span style="color:#e0d0d0;font-size:calc(var(--font-sm) - 3px)">※要件未満</span>'}</h4>
 <p>${it.dice}D${it.adds>=0?'+':''}${it.adds} / 強さ≥${it.stReq} 器用さ≥${it.dexReq}　Wgt:${it.weight}</p>
 <span class="price">${formatItemCost(it.cost)}</span>
 <button class="buy-btn" ${!canUse||totalCP(_shopActor||PC)<it.cost*100?'disabled':''} onclick="${_buyCall}">BUY</button>`;
 el.appendChild(div);
 });
 // 鹵獲品・中古品（治安悪化度による混入。旅商人は対象外）
 if(townId !== '__merchant__'){
  const bmW = _ensureShopBlackMarket(townId).weapon;
  bmW.forEach((it, bmIdx)=>{
   const _sa = _shopActor||PC;
   const canUse = it.stReq<=_sa.st && it.dexReq<=_sa.dex && (_sa.type==='warrior'||_sa.type==='rogue'||it.dice<=2) && (!(_sa===PC&&PC._noHeavyWeapon)||it.dice<=2);
   const div = document.createElement('div'); div.className='shop-item';
   div.style.cssText = 'border-color:#5a4030';
   div.innerHTML = `<h4 style="color:#d8b090">鹵獲品の${it.name}${it.twoHand?' <span style="color:#e0d8c8;font-size:calc(var(--font-sm) - 3px)">両手</span>':''}${canUse?'':' <span style="color:#e0d0d0;font-size:calc(var(--font-sm) - 3px)">※要件未満</span>'}</h4>
   <p style="color:#c8a888">${it.dice}D${it.adds>=0?'+':''}${it.adds} / 強さ≥${it.stReq} 器用さ≥${it.dexReq}　Wgt:${it.weight}　<span style="font-size:calc(var(--font-sm) - 3px)">出所の怪しい品</span></p>
   <span class="price">${formatItemCost(it.cost)}</span>
   <button class="buy-btn" ${!canUse||totalCP(_shopActor||PC)<it.cost*100?'disabled':''} onclick="igsBuyBlackMarketWeapon(${bmIdx},'${townId}')">BUY</button>`;
   el.appendChild(div);
  });
 }
 } else if(_igsTab === 'armor'){
 if(aTableShown.length === 0){
  el.innerHTML = '<div style="font-size:var(--font-sm);color:#c8b8a0;padding:12px 0;text-align:center">現在、防具の取り扱いはない</div>';
 } else if(aTableShown.length < aTable.length){
  const note = document.createElement('div');
  note.style.cssText = 'font-size:calc(var(--font-sm) - 2px);color:#a89880;margin-bottom:6px';
  note.textContent = _logiStage>=2 ? '仕入れが滞っており、品薄になっている。' : '品揃えがやや乏しくなっている。';
  el.appendChild(note);
 }
 aTableShown.forEach(it=>{
 const canUse = it.stReq<=PC.st;
 const div = document.createElement('div'); div.className='shop-item';
 div.innerHTML = `<h4>${it.name}${it.isShield?' <span style="color:var(--white);font-size:calc(var(--font-sm) - 3px)">盾</span>':''}${canUse?'':' <span style="color:#e0d0d0;font-size:calc(var(--font-sm) - 3px)">※強さ不足</span>'}</h4>
 <p>防護:${it.hits}${PC.type==='warrior'?`(×2→${it.hits*2})`:''}　強さ≥${it.stReq}　重量:${it.weight}</p>
 <span class="price">${formatItemCost(it.cost)}</span>
 <button class="buy-btn" ${!canUse||totalCP(_shopActor||PC)<it.cost*100?'disabled':''} onclick="igsBuyArmor(${aTable.indexOf(it)},'${townId}')">BUY</button>`;
 el.appendChild(div);
 });
 // 鹵獲品・中古品（治安悪化度による混入。旅商人は対象外）
 if(townId !== '__merchant__'){
  const bmA = _ensureShopBlackMarket(townId).armor;
  bmA.forEach((it, bmIdx)=>{
   const canUse = it.stReq<=PC.st;
   const div = document.createElement('div'); div.className='shop-item';
   div.style.cssText = 'border-color:#5a4030';
   div.innerHTML = `<h4 style="color:#d8b090">鹵獲品の${it.name}${it.isShield?' <span style="color:var(--white);font-size:calc(var(--font-sm) - 3px)">盾</span>':''}${canUse?'':' <span style="color:#e0d0d0;font-size:calc(var(--font-sm) - 3px)">※強さ不足</span>'}</h4>
   <p style="color:#c8a888">防護:${it.hits}${PC.type==='warrior'?`(×2→${it.hits*2})`:''}　強さ≥${it.stReq}　重量:${it.weight}　<span style="font-size:calc(var(--font-sm) - 3px)">出所の怪しい品</span></p>
   <span class="price">${formatItemCost(it.cost)}</span>
   <button class="buy-btn" ${!canUse||totalCP(_shopActor||PC)<it.cost*100?'disabled':''} onclick="igsBuyBlackMarketArmor(${bmIdx},'${townId}')">BUY</button>`;
   el.appendChild(div);
  });
 }
 } else if(_igsTab === 'specialty'){
 // ── 特産品タブ ──
 if(townId === 'neria'){
  el.innerHTML = '<div style="font-size:var(--font-sm);color:#c8b8a0;padding:12px 0;text-align:center">特産品の取り扱いはない</div>';
  return;
 }
 const regionKey = getRegionKey(townId);
 const items = regionKey ? (REGION_SPECIALTIES[regionKey]||[]) : [];
 if(items.length === 0){
 el.innerHTML = '<div style="font-size:var(--font-sm);color:#c8b8a0;padding:12px 0;text-align:center">この地方の特産品はありません</div>';
 return;
 }
 // 地方状態システム：物流途絶度の段階に応じて品目数を絞る（危機的＝取り扱いなし）
 if(_logiStage >= 3){
  el.innerHTML = '<div style="font-size:var(--font-sm);color:#c8b8a0;padding:12px 0;text-align:center">物流が途絶えており、特産品の仕入れが止まっている</div>';
  return;
 }
 const state = _getTownSpecialtyState(townId);
 const specialtyLimit = _logiStage===2 ? 1 : _logiStage===1 ? 2 : Infinity;
 const stocked = items
  .map((it, idx)=>({it, idx}))
  .filter(({it})=>state.selectedNames.includes(it.name))
  .slice(0, specialtyLimit);
 // ヘッダー
 const hd = document.createElement('div');
 hd.style.cssText = 'font-size:calc(var(--font-sm) - 2px);color:#c8b8a0;margin-bottom:8px;padding:4px;border:1px solid #585858;border-radius:3px;background:var(--ink)';
 hd.innerHTML = ` <b style="color:#f0ece0">地元特産品</b>${_logiStage>=1?'<span style="color:#a89880;font-size:calc(var(--font-sm) - 3px)">　（入荷が滞っている）</span>':''}`;
 el.appendChild(hd);
 stocked.forEach(({it, idx})=>{
 const buyPrice = calcSpecialtyBuyPrice(it);
 const stockCount = state.stocks[it.name] || 0;
 const soldOut = stockCount <= 0;
 const div = document.createElement('div'); div.className='shop-item';
 div.innerHTML = `<h4>${it.icon} ${it.name}${soldOut?' <span style="color:#e0a070;font-size:calc(var(--font-sm) - 3px)">売り切れ</span>':''}</h4>
 <p style="font-size:calc(var(--font-sm) - 2px);color:#c8b8a0">${it.desc}　Wgt:${it.weight}</p>
 <p style="font-size:calc(var(--font-sm) - 2px);color:#a89878">在庫：${stockCount}個（今の仕入れ分）</p>
 <span class="price">${buyPrice}GP</span>
 <button class="buy-btn" ${soldOut||totalCP(_shopActor||PC)<buyPrice*100?'disabled':''} onclick="igsBuySpecialty(${idx},'${townId}',${buyPrice})">BUY</button>`;
 el.appendChild(div);
 });
 } else if(_igsTab === 'exchange'){
 // ── 両替タブ ──
 const exInfo = document.createElement('div');
 exInfo.style.cssText = 'font-size:calc(var(--font-sm) - 1px);color:#c8b8a0;margin-bottom:10px;padding:6px;border:1px solid #585858;border-radius:3px;background:#0a100a';
 exInfo.innerHTML = ' <b style="color:#f0ece0">両替所</b>　CP・SPをより上位の貨幣に両替します';
 el.appendChild(exInfo);

 // 現在の所持金表示
 const moneyDiv = document.createElement('div');
 moneyDiv.style.cssText = 'font-size:calc(var(--font-sm) + 1px);margin-bottom:12px;padding:8px;background:var(--ink);border:1px solid #334;border-radius:3px;text-align:center';
 moneyDiv.innerHTML = `所持金：${formatMoney()}`;
 el.appendChild(moneyDiv);

 // CP→SP両替（10CP = 1SP）
 const cpToSp = document.createElement('div'); cpToSp.className='shop-item';
 const cpAmt = PC.cp||0;
 const cpCanEx = cpAmt >= 10;
 const cpGain = Math.floor(cpAmt/10);
 const cpRem = cpAmt % 10;
 cpToSp.innerHTML = `<h4> CP → SP</h4>
  <p style="font-size:calc(var(--font-sm) - 1px);color:#c8b8a0">10CP = 1SP　所持CP: ${cpAmt}CP</p>
  <span class="price" style="color:#f0ece0">${cpGain}SP 獲得（残${cpRem}CP）</span>
  <button class="buy-btn" ${cpCanEx?'':'disabled'} onclick="exchangeCPtoSP()">両替</button>`;
 el.appendChild(cpToSp);

 // SP→GP両替（10SP = 1GP）
 const spToGp = document.createElement('div'); spToGp.className='shop-item';
 const spAmt = PC.sp||0;
 const spCanEx = spAmt >= 10;
 const spGain = Math.floor(spAmt/10);
 const spRem = spAmt % 10;
 spToGp.innerHTML = `<h4> SP → GP</h4>
  <p style="font-size:calc(var(--font-sm) - 1px);color:#c8b8a0">10SP = 1GP　所持SP: ${spAmt}SP</p>
  <span class="price" style="color:#f0ece0">${spGain}GP 獲得（残${spRem}SP）</span>
  <button class="buy-btn" ${spCanEx?'':'disabled'} onclick="exchangeSPtoGP()">両替</button>`;
 el.appendChild(spToGp);

 } else if(_igsTab === 'jewel'){
 const tid = townId || PC.town;
 const stock = generateJewelStock(tid);
 // 地方状態システム：物流途絶度の段階に応じて表示本数を絞る（在庫自体・インデックスは変更しない）
 const jewelVisible = _logiStage>=3 ? 0 : _logiStage===2 ? 1 : _logiStage===1 ? 3 : stock.length;
 if(stock.length === 0 || jewelVisible === 0){
  el.innerHTML = _logiStage>=3
   ? '<div style="font-size:var(--font-sm);color:#c8b8a0;padding:12px 0;text-align:center">物流が途絶えており、宝飾品の仕入れが止まっている</div>'
   : '<div style="font-size:var(--font-sm);color:#c8b8a0;padding:12px 0;text-align:center">在庫なし</div>';
 } else {
  stock.forEach((it,idx)=>{
   if(idx >= jewelVisible) return;
   const canAfford = totalCP() >= it.priceGP*100;
   const div = document.createElement('div'); div.className='shop-item';
   div.innerHTML = `<h4>${it.icon} ${it.name}</h4>
   <p style="font-size:calc(var(--font-sm) - 2px);color:#c8b8a0">${it.desc}</p>
   <span class="price">${it.priceGP}GP</span>
   <button class="buy-btn" ${canAfford?'':'disabled'} onclick="igsBuyJewel('${tid}',${idx})">BUY</button>`;
   el.appendChild(div);
  });
 }
 } else if(_igsTab === 'forge'){
 renderForgeTab(el, townId);
 } else {
 const mareaNoFood = ['dorua','sarpe','nebra','kalvo'].includes(townId||'');
 const equipTableShown = shopFilterGoodsByLogi(EQUIP_TABLE, _logiStage);
 if(equipTableShown.length < EQUIP_TABLE.length){
  const note = document.createElement('div');
  note.style.cssText = 'font-size:calc(var(--font-sm) - 2px);color:#a89880;margin-bottom:6px';
  note.textContent = _logiStage>=3 ? '最低限の品しか残っていない。' : '仕入れが滞っていて、品数が減っている。';
  el.appendChild(note);
 }
 equipTableShown.forEach(it=>{
 if(it.wizard && PC.type!=='wizard') return;
 if(it._isFood && mareaNoFood) return; // マレア地方の村では食料販売なし
 const dispWeight = it._isFood ? (it._foodAmt||1)*5 : it.weight;
 const effectiveCost = it._isFood ? foodPrice(it.cost) : it.cost;
 const div = document.createElement('div'); div.className='shop-item';
 const priceLabel = it._isFood && effectiveCost !== it.cost
  ? `<span class="price" style="color:${effectiveCost>it.cost?'var(--danger)':'var(--nature2)'}">${formatItemCost(effectiveCost)}</span>`
  : `<span class="price">${formatItemCost(effectiveCost)}</span>`;
 div.innerHTML = `<h4>${it._isFood ? ' '+it.name : it.name}</h4>
 <p>${it._isFood ? `食料ポイント+${it._foodAmt||1}　Wgt:${(it._foodAmt||1)*5}` : `Wgt:${dispWeight}`}</p>
 ${priceLabel}
 <button class="buy-btn" ${totalCP()<effectiveCost*100?'disabled':''} onclick="igsBuyEquip(${EQUIP_TABLE.indexOf(it)})">BUY</button>`;
 el.appendChild(div);
 });
 }
}


// ── 鍛錬タブ ──────────────────────────────────────────
const FORGE_TOWNS = {
 elsia:     { label:'エルマリアの名匠', table: WEAPONS_TABLE_ELSIA },
 al_rashid: { label:'アル・ラシードの名匠', table: WEAPONS_TABLE_AL_RASHID },
 yeldun:    { label:'イェルドゥンの名匠', table: WEAPONS_TABLE_YELDUN },
 valdheim:  { label:'ヴァルドヘイムの名匠', table: WEAPONS_TABLE_VALDHEIM },
 neria:     { label:'ネリア砦の鍛冶師', table: WEAPONS_TABLE_NERIA },
 kalvo:     { label:'カルヴォ砦の鍛冶師', table: WEAPONS_TABLE_NERIA },
};
const FORGE_COSTS = [100, 200, 400, 800, 1600, 3200];
function _getForgeLevel(w){ const base = w._baseAdds != null ? w._baseAdds : w.adds; return w.adds - base; }

function renderForgeTab(el, townId){
 const forge = FORGE_TOWNS[townId];
 if(!forge){ el.innerHTML = '<div style="font-size:var(--font-sm);color:#c8b8a0;padding:12px 0;text-align:center">この店では鍛錬サービスを行っていない。</div>'; return; }
 const sa = _shopActor || PC;
 const tableNames = new Set(forge.table.map(t=>t.name));
 const targets = (sa.invWeapons||[]).filter(w=>{ if(w._isMagic) return false; const lookupName = w._baseName||w.name; return tableNames.has(lookupName); });
 if(targets.length === 0){
  el.innerHTML = `<div style="font-size:var(--font-sm);color:#c8b8a0;padding:12px 0;text-align:center">${forge.label}が言う。<br>「この店で扱う武器を持ってきな。鍛え直してやろう」</div>`;
  return;
 }
 const header = document.createElement('div');
 header.style.cssText = 'font-size:calc(var(--font-sm) - 1px);color:#e0d8c8;margin-bottom:10px;line-height:1.8';
 header.innerHTML = ` ${forge.label}<br><span style="color:#c8b8a0">修正値を+1するごとに費用が倍増。最大+6まで。</span>`;
 el.appendChild(header);
 targets.forEach(w=>{
  const idx = sa.invWeapons.indexOf(w);
  const level = _getForgeLevel(w);
  const maxed = level >= 6;
  const cost = maxed ? null : FORGE_COSTS[level];
  const canAfford = cost != null && totalCP(sa) >= cost * 100;
  const baseAdds = w._baseAdds != null ? w._baseAdds : w.adds;
  const div = document.createElement('div'); div.className='shop-item';
  div.innerHTML = `<h4> ${w.name}</h4>
   <p>${w.dice}D${w.adds>=0?'+':''}${w.adds}　（元: ${w.dice}D${baseAdds>=0?'+':''}${baseAdds}　強化: +${level}/+6）</p>
   <span class="price">${maxed ? '最大強化済み' : cost+'GP'}</span>
   ${maxed ? '' : `<button class="buy-btn" ${canAfford?'':'disabled'} onclick="igsForgeWeapon(${idx})">鍛錬</button>`}`;
  el.appendChild(div);
 });
}

function igsForgeWeapon(idx){
 const sa = _shopActor || PC;
 const w = (sa.invWeapons||[])[idx];
 if(!w || w._isMagic) return;
 if(w._baseAdds == null) w._baseAdds = w.adds;
 const level = _getForgeLevel(w);
 if(level >= 6){ showSaveToast('これ以上強化できない'); return; }
 const cost = FORGE_COSTS[level];
 if(totalCP(sa) < cost * 100){ showSaveToast('所持金が足りない'); return; }
 payPrice(cost, sa);
 w.adds += 1;
 sa.equippedWeapons = (sa.equippedWeapons||[]).map(e=>{ if((e._baseName||e.name)===(w._baseName||w.name)) return {...e, adds:w.adds, _baseAdds:w._baseAdds}; return e; });
 updateHUD();
 renderIgsList(_igsTownId);
 showSaveToast(` 鍛錬完了！${w.name} → ${w.dice}D+${w.adds}（+${_getForgeLevel(w)}/+6）`);
}

function renderIngameShop(townId){
 townId = townId || PC.town;
 _igsTownId = townId;
 const isKhazan = townId === 'khazan';
 const isElsia2 = townId === 'elsia';
 const villageTitles = {verda:' ヴェルダ村の道具屋',rimholm:' リムホルムの武具屋',marakai:' マラカイの武器商',oasis_fort:' オアシス砦の道具屋',saroon:' サルーンの道具屋',duna:' デュナの道具屋',neria:' ネリアの武器屋',dorua:' ドルアの道具屋',kalvo:' カルヴォ砦の武具庫'};
 const shopTitle = townId==='__merchant__' ? ' 旅商人の荷台' : isKhazan ? ' カザーヌ武器屋（全品揃え）' : townId==='al_rashid' ? ' アル・ラシードの武器屋' : isElsia2 ? ' エルマリアの道具屋' : villageTitles[townId] || ' 装備屋';

 const {cur, max} = checkWeightPenalty();
 const regionFlavor = townId === '__merchant__' ? '' : shopRegionConditionFlavor(townId);
 document.getElementById('igs-title').innerHTML = shopTitle + (_shopActor && _shopActor !== PC ? ` [${_shopActor.name}]` : '') + regionFlavor;
 const _sa = _shopActor || PC;
 document.getElementById('igs-gp').innerHTML = formatMoney(_sa);
 document.getElementById('igs-wt').textContent = cur;
 document.getElementById('igs-maxwt').textContent = max;

 // タブ状態をリセットして武器タブから表示
 igsSetTab(_igsTab);
}

function exchangeCPtoSP(){
 const _sa = _shopActor || PC;
 const cp = _sa.cp||0;
 if(cp < 10){ showSaveToast('CP が10枚未満です'); return; }
 const gain = Math.floor(cp/10);
 _sa.cp = cp % 10;
 _sa.sp = (_sa.sp||0) + gain;
 updateHUD(); renderIngameShop();
 showSaveToast(' '+gain+'SP に両替した');
}

function exchangeSPtoGP(){
 const _sa = _shopActor || PC;
 const sp = _sa.sp||0;
 if(sp < 10){ showSaveToast('SP が10枚未満です'); return; }
 const gain = Math.floor(sp/10);
 _sa.sp = sp % 10;
 _sa.gold = (_sa.gold||0) + gain;
 updateHUD(); renderIngameShop();
 showSaveToast(' '+gain+'GP に両替した');
}

function igsBuyWeapon(i, townId){
 const _sa = _shopActor || PC;
 const _t1=townId||PC.town; const tbl = _t1==='khazan'?WEAPONS_TABLE_KHAZAN:_t1==='elsia'?WEAPONS_TABLE_ELSIA:_t1==='al_rashid'?WEAPONS_TABLE_AL_RASHID:_t1==='yeldun'?WEAPONS_TABLE_YELDUN:_t1==='valdheim'?WEAPONS_TABLE_VALDHEIM:(_t1==='neria'||_t1==='kalvo')?WEAPONS_TABLE_NERIA:WEAPONS_TABLE;
 const it=tbl[i];
 if(!it||totalCP(_sa)<it.cost*100)return;
 if(it.wizard && _sa.type!=='wizard'){ showSaveToast('魔法使い専用の品です'); return; }
 payPrice(it.cost, _sa);
 if(!_sa.invWeapons) _sa.invWeapons=[];
 _sa.invWeapons.push({name:it.name,dice:it.dice,adds:it.adds,twoHand:it.twoHand,stReq:it.stReq||0,dexReq:it.dexReq||0,weight:it.weight||0,...(it._masterpiece?{_masterpiece:true}:{}),...(it.isRanged?{isRanged:true}:{}),...(it.rangedOk?{rangedOk:true}:{}),...(it.isWizardStaff?{isWizardStaff:true}:{})});
 updateHUD(); renderIngameShop(townId||PC.town);
 showSaveToast(` ${_sa.name}: ${it.name}を購入`);
}
// 物流途絶度stage3で「棍棒」を補充した町（その町のテーブルに元々棍棒が無い場合）専用の購入処理
function igsBuyFallbackClub(townId){
 const _sa = _shopActor || PC;
 const it = WEAPONS_TABLE.find(w=>w.name==='棍棒');
 if(!it || totalCP(_sa) < it.cost*100) return;
 payPrice(it.cost, _sa);
 if(!_sa.invWeapons) _sa.invWeapons=[];
 _sa.invWeapons.push({name:it.name, dice:it.dice, adds:it.adds, twoHand:it.twoHand, stReq:it.stReq||0, dexReq:it.dexReq||0, weight:it.weight||0});
 updateHUD(); renderIngameShop(townId||PC.town);
 showSaveToast(` ${_sa.name}: ${it.name}を購入`);
}
function igsBuyArmor(i, townId){
 const _sa = _shopActor || PC;
 const _t2=townId||PC.town; const tbl = _t2==='khazan' ? ARMOR_TABLE_KHAZAN : _t2==='elsia' ? ARMOR_TABLE_ELSIA : (_t2==='al_rashid'||_t2==='yeldun'||_t2==='valdheim') ? ARMOR_TABLE_WITH_SCALE : ARMOR_TABLE; // 表示側（renderIngameShop の aTable）と同じ表を引く
 const it=tbl[i];
 if(!it||totalCP(_sa)<it.cost*100)return;
 payPrice(it.cost, _sa);
 if(!_sa.invArmors) _sa.invArmors=[];
 _sa.invArmors.push({name:it.name,hits:it.hits,stReq:it.stReq,isShield:it.isShield||false,weight:it.weight||0});
 updateHUD(); renderIngameShop(townId||PC.town);
 showSaveToast(` ${_sa.name}: ${it.name}を購入`);
}
function igsBuyEquip(i){
 const _sa = _shopActor || PC;
 const it=EQUIP_TABLE[i];
 const effectiveCost = it._isFood ? foodPrice(it.cost) : it.cost;
 if(totalCP(_sa)<effectiveCost*100)return;
 payPrice(effectiveCost, _sa);
 // 消耗品はPC（パーティ共有）に加算
 if(it._isArrows){
  if(_sa === PC){
   PC.arrows=(PC.arrows||0)+it._arrowAmt;
   updateHUD(); showSaveToast(` 矢+${it._arrowAmt}（残り${PC.arrows}本）`);
  } else {
   _sa.arrows=(_sa.arrows||0)+it._arrowAmt;
   updateHUD(); showSaveToast(` ${_sa.name}: 矢+${it._arrowAmt}（残り${_sa.arrows}本）`);
  }
  return;
 }
 if(it._isFood){ const amt=it._foodAmt||1; PC._food=(PC._food||0)+amt; showSaveToast(` 食料+${amt}（残り${PC._food}日分）`); }
 else if(it.name==='ブーツ'||it.name==='サンダル'){
  if(_sa === PC && _sa.invBoots){ addSpareFootwear(_sa, it.name); } // すでに1足持っている場合は予備にする（仲間は従来どおり）
  else { _sa.invBoots=true; _sa.invBootsName=it.name; _sa._bootsWearDays=0; _sa._bootsBreakThreshold=null; }
 }
 else if(it.name==='松明'){ PC._torchStock=(PC._torchStock||0)+1; }
 else if(it.name==='防寒着と荷物袋'){ _sa.invClothing=true; _sa.invClothingName=it.name; }
 else { if(!_sa.invEquip) _sa.invEquip=[]; _sa.invEquip.push(it.name); }
 updateHUD(); renderIngameShop();
 if(!it._isFood) showSaveToast(` ${_sa.name}: ${it.name}を購入`);
}

// 特産品の在庫を取得する（町×アイテム名ごとに管理）。
// 初回、または月が変わった場合は2D6（2〜12個）で再補充する。
// 町の特産品の品揃えと在庫をまとめて取得する。
// 3ヶ月ごとの周期が変わった時点で、地方の特産品リストから1〜3種類をランダムに選び直し、
// それぞれ在庫を2D6（2〜12個）で再抽選する。
function _getTownSpecialtyState(townId){
 PC._specialtyStock = PC._specialtyStock || {};
 const regionKey = getRegionKey(townId);
 const allItems = regionKey ? (REGION_SPECIALTIES[regionKey]||[]) : [];
 const d = daysToDate(GAME_TIME.totalDays);
 const periodKey = Math.floor((d.year*12 + d.month) / 3); // 3ヶ月ごとの周期
 let state = PC._specialtyStock[townId];
 if(!state || state.periodKey !== periodKey){
  const shuffled = [...allItems].sort(()=>Math.random()-0.5);
  const count = Math.min(allItems.length, 1 + Math.floor(Math.random()*3)); // 1〜3種類
  const selected = shuffled.slice(0, count);
  const stocks = {};
  selected.forEach(it=>{ stocks[it.name] = Nd6(2); });
  state = { periodKey, selectedNames: selected.map(it=>it.name), stocks };
  PC._specialtyStock[townId] = state;
 }
 return state;
}

function igsBuySpecialty(idx, townId, buyPrice){
 const regionKey = getRegionKey(townId);
 const items = regionKey ? (REGION_SPECIALTIES[regionKey]||[]) : [];
 const it = items[idx];
 if(!it || totalCP()<buyPrice*100) return;
 const state = _getTownSpecialtyState(townId);
 const stockCount = state.stocks[it.name] || 0;
 if(stockCount <= 0){ showSaveToast(`${it.icon} ${it.name}は今の仕入れ分の在庫を売り切れている`); return; }
 payPrice(buyPrice);
 state.stocks[it.name] = stockCount - 1;
 PC.invSpecialties = PC.invSpecialties||[];
 PC.invSpecialties.push({name:it.name, icon:it.icon, regionKey, baseCost:it.baseCost, weight:it.weight, boughtAt:buyPrice});
 updateHUD(); renderIngameShop(townId||PC.town);
 showSaveToast(`${it.icon} ${it.name}を購入した（${buyPrice}GP）`);
}

function sellSpecialty(idx){
 const spec = (PC.invSpecialties||[])[idx];
 if(!spec) return;
 const sellPrice = calcSpecialtySellPrice(spec, PC.town);
 PC.invSpecialties.splice(idx,1);
 gainGP(sellPrice);
 updateHUD(); renderIngameShop();
 showSaveToast(`${spec.icon} ${spec.name}を売った（${sellPrice}GP）`);
}

function finishShopping(){
 document.getElementById('shop-area').classList.add('hidden');
 const g=document.getElementById('game');
 g.classList.remove('hidden');g.style.display='flex';
 updateHUD();
 updateTimebar();
 chooseBackgroundMode();
}

// 生い立ち・動機を「運命に任せる」か「自分で選ぶ」か選択させる
// ══════════════════════════════════════════
// チュートリアル：同行系システムの学習
// ══════════════════════════════════════════
// 全町ID → 武器屋・装備屋ノードIDの対応表（命名規則が町ごとに不統一なため明示的に定義する）
// sarpe/nebraには専用の店がないため、マレア地方の中心地neriaの店を代わりに案内する
const TUTORIAL_SHOP_MAP = {
 khazan:'SHOP_KHAZAN', port_argon:'SHOP_PORT', stonehiem:'SHOP_STONE',
 elsia:'SHOP_ELSIA', verda:'SHOP_VERDA', rimholm:'SHOP_RIMHOLM', marakai:'SHOP_MARAKAI',
 al_rashid:'SHOP_AL_RASHID', oasis_fort:'SHOP_OASIS', saroon:'SHOP_SAROON', duna:'SHOP_DUNA',
 neria:'SHOP_NERIA', dorua:'SHOP_DORUA', sarpe:'SHOP_NERIA', nebra:'SHOP_NERIA', kalvo:'SHOP_KALVO',
 yeldun:'SHOP_YELDUN', frostpeak:'SHOP_FROSTPEAK', ashveil:'SHOP_ASHVEIL',
 valdheim:'SHOP_VALDHEIM', nifurvik:'SHOP_NIFURVIK', iskald:'SHOP_ISKALD',
};

function startTutorial(){
 const oldNPC = generateNPC(5);
 oldNPC.type = 'wizard';
 oldNPC.name = pickNPC();
 oldNPC.equippedWeapons = [];
 oldNPC.race = 'human'; // 寿命を人間基準（80歳）に固定し、老NPCとして扱えるようにする
 // 老NPCらしく70〜79歳に設定する（80歳ちょうどだと即座に天寿を全うしてしまうため80未満に収める）
 const oldAge = 70 + Math.floor(Math.random()*10);
 oldNPC.birthDay = GAME_TIME.totalDays - oldAge*365;
 // 老化による能力値低下が道中で一気に発生しないよう、既に経過したはずの低下回数を先に記録しておく
 oldNPC._declineCount = Math.floor((oldAge - 40) / 5);
 const personality = COMPANION_HUNT_LEADER_PERSONALITIES.find(p=>p.name==='熱血') || COMPANION_HUNT_LEADER_PERSONALITIES[0];
 // 同地方内の「隣町」を1つ選ぶ（自分の出発地以外の同地方の町からランダム）
 const myRegion = getRegionKey(PC._startTown);
 const sameRegionTowns = (HERO_REGIONS[myRegion]?.towns||[]).filter(t=>t!==PC._startTown);
 const nearTownId = sameRegionTowns[Math.floor(Math.random()*sameRegionTowns.length)] || PC._startTown;
 // 最も近い「別地方」の町を、findTownRouteの距離で全町から検索
 const allTowns = Object.keys(TOWNS).filter(t=>getRegionKey(t)!==myRegion && getRegionKey(t));
 let bestTown = null, bestDist = Infinity;
 allTowns.forEach(t=>{
  const route = findTownRoute(PC._startTown, t);
  if(!route) return;
  // 経路の合計日数を概算（区間ごとにgetRouteで積算）
  let days = 0;
  for(let i=0;i<route.length-1;i++){
   const r = getRoute(route[i], route[i+1]);
   if(!r) return;
   days += (r.days.walk!=null ? r.days.walk : r.days.coach) || 9999;
  }
  if(days < bestDist){ bestDist = days; bestTown = t; }
 });

 PC._tutorial = {
  step: 'intro',
  oldNPC, oldNPCPersonality: personality,
  nearTownId, homeRegionTownId: bestTown,
 };
 go('TUTORIAL_INTRO');
}

// チュートリアル中の装備チェック（防寒着と荷物袋・ブーツ・食料30日分以上・武器1つ以上・防具1つ以上）
function _tutorialCheckEquip(){
 const hasClothingBag = PC.invClothing || PC.equippedClothing; // 「防寒着と荷物袋」は衣服枠として扱われる想定
 const hasBoots = PC.invBoots;
 const hasFood = (PC._food||0) >= 30;
 const hasWeapon = (PC.equippedWeapons||[]).length > 0;
 const hasArmor = (PC.equippedArmors||[]).length > 0;
 return { ok: hasClothingBag && hasBoots && hasFood && hasWeapon && hasArmor, hasClothingBag, hasBoots, hasFood, hasWeapon, hasArmor };
}

// ── チュートリアル：配達フェーズ ──
// お守り役NPCを生成し、隣町への同行配達を開始する
// NPC紹介（お守り役を生成し、TUTORIAL_DELIVERY_MEETノードで顔合わせさせる）
function tutorialIntroduceEscort(){
 const t = PC._tutorial;
 const escort = generateNPC(2 + Math.floor(Math.random()*3));
 escort.name = pickNPC();
 t.escortNPC = escort;
 go('TUTORIAL_DELIVERY_MEET');
}

// 顔合わせ後、実際に出発する
function tutorialStartDelivery(){
 const t = PC._tutorial;
 const escort = t.escortNPC;
 t.deliveryLeg = 'outbound'; // outbound（往路）/ paused（隣町で足止め中）/ return（復路）
 escort._isTemporaryCompanion = true;
 PC.party = [escort];
 updateHUD();
 t.step = 'delivery';
 tutorialDeliveryTravel();
}

// 現在のdeliveryLegに応じて、区間の旅を開始する（往路・復路共通）
function tutorialDeliveryTravel(){
 const t = PC._tutorial;
 const isOutbound = t.deliveryLeg === 'outbound';
 const fromId = isOutbound ? PC._startTown : t.nearTownId;
 const toId = isOutbound ? t.nearTownId : PC._startTown;
 const route = getRoute(fromId, toId);
 if(!route){ go('TUTORIAL_DELIVERY_INTRO'); return; } // 到達不能なら（ありえないはずだが）安全に戻す
 const days = route.days.walk!=null ? route.days.walk : route.days.coach;
 const from = TOWNS[fromId], to = TOWNS[toId];
 PC.town = toId;
 updateHUD();
 drawScene('travel');
 showTravelImage('walk', fromId, toId);
 const storyEl = document.getElementById('story');
 if(storyEl) storyEl.innerHTML = '';
 const tpw = document.getElementById('travel-progress-wrap');
 if(tpw){
  tpw.style.display = '';
  document.getElementById('travel-progress-bar').style.width = '0%';
  document.getElementById('travel-progress-dot').style.left = '0%';
  document.getElementById('travel-latest').textContent = '';
  document.getElementById('travel-progress-label').innerHTML =
   ` 徒歩　<span style="color:#f0ece0">${from.name}</span> → <span style="color:#f0ece0">${to.name}</span>　<span id="travel-day-count" style="color:#e0d8c8">0/${days}日</span>`;
 }
 renderChoices([]);
 advanceDaysAnimated(days, ()=>{
  if(isOutbound){
   t.deliveryLeg = 'paused';
   PC.party = [];
   updateHUD();
   GAME_TIME.totalDays++;
   GAME_TIME.hour = 6;
   updateTimebar();
   checkAging();
   const recipientName = pickNPC();
   PC._pendingMsg = (PC._pendingMsg||'') + `<div style="border:1px solid #345a6a;border-radius:4px;padding:10px;background:#080a0d;margin-bottom:10px">
    <span style="color:#a8d0e0">${to.name}に到着した。荷物の届け先を訪ねると、依頼主の${recipientName}が出迎えた。</span><br>
    <span style="color:#c8b8a0">${recipientName}「ああ、待っていたよ！　これで助かる。ここまで運んでくれてありがとう」</span><br><br>
    <span style="color:#a8d0e0">用件を終えると、${t.escortNPC.name}は宿を取り、一晩休むことにしたようだ。</span><br>
    <span style="color:#c8b8a0;font-size:calc(var(--font-sm) - 1px)">明日以降、この町の酒場に行けば旅を再開できる。</span>
   </div>`;
   const townNode = 'TOWN_' + toId.toUpperCase();
   go(NODES[townNode] ? townNode : 'TOWN_KHAZAN');
  } else {
   PC.party = [];
   updateHUD();
   t.step = 'delivery_done';
   PC._pendingMsg = (PC._pendingMsg||'') + `<div style="border:1px solid #345a6a;border-radius:4px;padding:10px;background:#080a0d;margin-bottom:10px">
    <span style="color:#a8d0e0">${to.name}に帰着した。${t.escortNPC.name}が礼を言う。</span><br>
    <span style="color:#c8b8a0">「送り届けてくれてありがとう。おかげで助かったよ」</span>
   </div>`;
   const townNode = 'TOWN_' + toId.toUpperCase();
   go(NODES[townNode] ? townNode : 'TOWN_KHAZAN');
   setTimeout(()=>{ go('TUTORIAL_HUNT_INTRO'); }, 50);
  }
 });
}

// 経由町の酒場で「旅を再開する」選択肢を返す（getQuestBoardChoicesから呼ぶ）
function getTutorialDeliveryResumeChoice(townId){
 const t = PC._tutorial;
 if(!t || t.step!=='delivery' || t.deliveryLeg!=='paused' || t.nearTownId!==townId) return [];
 return [{
  label:` ${t.escortNPC.name}と共に帰路につく（${(TOWNS[PC._startTown]||{}).name}へ）`,
  fn:()=>{
   t.deliveryLeg = 'return';
   t.escortNPC._isTemporaryCompanion = true;
   PC.party = [t.escortNPC];
   updateHUD();
   // 食料が心許なければ、同行NPCが分けてくれる（旅立つ前に一言添える）
   if((PC._food||0) < 30){
    PC._food = (PC._food||0) + 30;
    updateHUD();
    const story = document.getElementById('story');
    if(story){
     story.innerHTML = `<div style="border:1px solid #345a6a;border-radius:4px;padding:12px;background:#080a0d">
      <span style="color:#a8d0e0">${t.escortNPC.name}「食料が心許ないようだね。私の分から少し分けてあげるよ」</span><br>
      <span style="color:#c8b8a0;font-size:calc(var(--font-sm) - 1px)">食料を30日分受け取った。</span>
     </div>`;
    }
    renderChoices([{label:'▶ 出発する', fn:()=>{ tutorialDeliveryTravel(); }}]);
    return;
   }
   tutorialDeliveryTravel();
  },
 }];
}

// ── チュートリアル：討伐フェーズ ──
// ゴブリン3体固定の同行討伐クエストを生成する（老NPC＋新規同行者）
function tutorialStartHunt(){
 const t = PC._tutorial;

 const quest = {
  id: 'tutorial_hunt', type: 'hunt', isCompanionHunt: true, isTutorial: true,
  fromTownId: PC._startTown,
  monsterName: 'ゴブリン', monsterMR: 18, monsterArmor: 0,
  isEliteHunt: false, eliteSpecies: null, eliteLevel: null, eliteRank: null,
  rooms: [{ count: 3, mr: 18, roomMR: 54 }],
  totalMR: 54,
  caveName: '郊外の洞穴',
  clientName: t.oldNPC.name,
  reward: 40,
  deadlineDays: 30,
  issuedDay: GAME_TIME.totalDays,
  status: 'active',
  crossRegion: false,
  leader: t.oldNPC, leaderPersonality: t.oldNPCPersonality, companion: null,
  _started: true,
 };
 if(!PC.quests) PC.quests = [];
 PC.quests.push(quest);
 t.step = 'hunt';
 t.huntQuestId = quest.id;
 t.oldNPC._isTemporaryCompanion = true;
 PC.party = [t.oldNPC];
 updateHUD();
 initTorch(); // 松明を持っていれば入場時に点火する
 go('TUTORIAL_HUNT_1');
}

// チュートリアル討伐ダンジョン：固定5ノードの一本道。ノード2にゴブリン1体、ノード4に2体
function _tutorialHuntQuest(){
 return (PC.quests||[]).find(q=>q.id===PC._tutorial?.huntQuestId);
}
function _tutorialHuntEnemies(count){
 const q = _tutorialHuntQuest();
 return Array.from({length:count},(_,i)=>({
  name: count>1 ? `${q.monsterName} #${i+1}` : q.monsterName,
  mr: q.monsterMR, curMR: q.monsterMR, armor: q.monsterArmor||0,
 }));
}

// ── チュートリアル：帰郷フェーズ（地方またぎ移動）──
function tutorialStartHomecoming(){
 const t = PC._tutorial;
 if(!t.homeRegionTownId){
  // 万一、到達可能な他地方が見つからなかった場合の保険（起こらないはずだが、安全に終了する）
  tutorialFinishWithoutHomecoming();
  return;
 }
 const route = findTownRoute(PC._startTown, t.homeRegionTownId);
 if(!route || route.length < 2){
  tutorialFinishWithoutHomecoming();
  return;
 }
 t.homeRoute = route;
 t.homeLegIndex = 0;
 t.step = 'homecoming';
 t.oldNPC._isTemporaryCompanion = true;
 PC.party = [t.oldNPC];
 updateHUD();
 tutorialHomecomingTravel();
}

// 帰郷ルートの現在区間を旅する（複数区間、最終到着でTUTORIAL_FAREWELLへ）
function tutorialHomecomingTravel(){
 const t = PC._tutorial;
 const fromId = t.homeRoute[t.homeLegIndex];
 const toId = t.homeRoute[t.homeLegIndex+1];
 const route = getRoute(fromId, toId);
 if(!route){ go('TUTORIAL_HOMECOMING_ASK'); return; }
 const days = route.days.walk!=null ? route.days.walk : route.days.coach;
 const isFinalLeg = (t.homeLegIndex+1) === t.homeRoute.length-1;
 const from = TOWNS[fromId], to = TOWNS[toId];
 PC.town = toId;
 updateHUD();
 drawScene('travel');
 showTravelImage('walk', fromId, toId);
 const storyEl = document.getElementById('story');
 if(storyEl) storyEl.innerHTML = '';
 const tpw = document.getElementById('travel-progress-wrap');
 if(tpw){
  tpw.style.display = '';
  document.getElementById('travel-progress-bar').style.width = '0%';
  document.getElementById('travel-progress-dot').style.left = '0%';
  document.getElementById('travel-latest').textContent = '';
  document.getElementById('travel-progress-label').innerHTML =
   ` 徒歩　<span style="color:#f0ece0">${from.name}</span> → <span style="color:#f0ece0">${to.name}</span>　<span id="travel-day-count" style="color:#e0d8c8">0/${days}日</span>`;
 }
 renderChoices([]);
 advanceDaysAnimated(days, ()=>{
  if(travelState) travelState.crossRegion = getRegionKey(fromId) !== getRegionKey(toId);
  if(isFinalLeg){
   t.step = 'farewell';
   go('TUTORIAL_FAREWELL');
  } else {
   t.homeLegIndex++;
   // 経由町では同行配達と同じく一泊し、自由行動をはさんでから次の区間へ進む
   t.homecomingPausedAt = toId;
   PC.party = [];
   updateHUD();
   GAME_TIME.totalDays++;
   GAME_TIME.hour = 6;
   updateTimebar();
   checkAging();
   PC._pendingMsg = (PC._pendingMsg||'') + `<div style="border:1px solid #345a6a;border-radius:4px;padding:10px;background:#080a0d;margin-bottom:10px">
    <span style="color:#a8d0e0">${to.name}に到着した。${t.oldNPC.name}は宿を取り、一晩休むことにしたようだ。</span><br>
    <span style="color:#c8b8a0;font-size:calc(var(--font-sm) - 1px)">明日以降、この町の酒場に行けば旅を再開できる。</span>
   </div>`;
   const townNode = 'TOWN_' + toId.toUpperCase();
   go(NODES[townNode] ? townNode : 'TOWN_KHAZAN');
  }
 });
}

// 帰郷ルートの経由町の酒場で「旅を再開する」選択肢を返す（getQuestBoardChoicesから呼ぶ）
function getTutorialHomecomingResumeChoice(townId){
 const t = PC._tutorial;
 if(!t || t.step!=='homecoming' || t.homecomingPausedAt!==townId) return [];
 const nextTownId = t.homeRoute[t.homeLegIndex+1];
 const nextName = (TOWNS[nextTownId]||{}).name || nextTownId;
 return [{
  label:` ${t.oldNPC.name}と共に旅を再開する（次は${nextName}）`,
  fn:()=>{
   t.homecomingPausedAt = null;
   t.oldNPC._isTemporaryCompanion = true;
   PC.party = [t.oldNPC];
   updateHUD();
   tutorialHomecomingTravel();
  },
 }];
}

// 到達可能な他地方が見つからなかった場合の保険的終了
function tutorialFinishWithoutHomecoming(){
 const t = PC._tutorial;
 t.step = 'farewell';
 PC.party = [];
 updateHUD();
 go('TUTORIAL_FAREWELL_NO_HOMECOMING');
}

// チュートリアル全体の終了処理：パーティ解散、老NPCの死亡タイマー設定、通常の冒険開始地点へ
function tutorialFinish(){
 const t = PC._tutorial;
 PC.party = [];
 // 老NPCは6ヶ月後（30日×6=180日）に老衰で死ぬ。噂として後で耳にする
 if(!PC._tutorialDeaths) PC._tutorialDeaths = [];
 PC._tutorialDeaths.push({ name: t.oldNPC.name, dueDay: GAME_TIME.totalDays + 180, told: false });
 t.step = 'done';
 updateHUD();
 const nodeMap = {khazan:'TOWN_KHAZAN',port_argon:'TOWN_PORT_ARGON',stonehiem:'TOWN_STONEHIEM',elsia:'TOWN_ELSIA',verda:'TOWN_VERDA',rimholm:'TOWN_RIMHOLM',marakai:'TOWN_MARAKAI',al_rashid:'TOWN_AL_RASHID',oasis_fort:'TOWN_OASIS_FORT',saroon:'TOWN_SAROON',duna:'TOWN_DUNA',neria:'TOWN_NERIA',dorua:'TOWN_DORUA',sarpe:'TOWN_SARPE',nebra:'TOWN_NEBRA',yeldun:'TOWN_YELDUN',frostpeak:'TOWN_FROSTPEAK',ashveil:'TOWN_ASHVEIL'};
 go(nodeMap[PC.town] || 'TOWN_KHAZAN');
}

// 町ノードに入るたびに呼び、噂として伝えるべき死亡イベントがあれば_pendingMsgに積む
function checkTutorialDeathRumors(){
 if(!PC._tutorialDeaths || !PC._tutorialDeaths.length) return;
 PC._tutorialDeaths.forEach(d=>{
  if(!d.told && GAME_TIME.totalDays >= d.dueDay){
   d.told = true;
   addLifeEvent('', `風の噂で、かつての恩人 ${d.name} が老衰で亡くなったと聞いた。`);
   PC._pendingMsg = (PC._pendingMsg||'') + `<div style="border:1px solid #585858;border-radius:4px;padding:10px;background:#0a0c0a;margin-bottom:10px">
    <span style="color:#c8b8a0">酒場で交わされる噂話が、ふと耳に入った。</span><br>
    <span style="color:#e0d8c8">「そういえば、かつて名が知られていた冒険者だった<b>${d.name}</b>が、老衰で死んだらしい」</span>
   </div>`;
  }
 });
}

function chooseBackgroundMode(){
 if(window.innerWidth < 860) document.getElementById('inv-panel')?.classList.add('hidden'); // モバイルでステータスパネルが開いたままにならないようにする
 const story = document.getElementById('story');
 story.innerHTML = `<span class="gold" style="font-size:calc(var(--font-base) + 1px)">── 生い立ちを決める ──</span><br><br>
  <span style="color:#c0b098">あなたの生まれと、冒険に出た理由を決めましょう。運命に任せますか？　それとも自分で選びますか？</span>`;
 renderChoices([
  {label:' 運命に任せる（ランダムに決定）', fn:()=>{
   PC.background = rollBackground(PC.race, PC.type);
   go('BACKGROUND_REVEAL');
  }},
  {label:' 自分で選ぶ', fn:()=>chooseBackgroundFamily()},
 ]);
}

// 自分で選ぶ場合：まず家族・身分を選ばせる
function chooseBackgroundFamily(){
 if(window.innerWidth < 860) document.getElementById('inv-panel')?.classList.add('hidden');
 const story = document.getElementById('story');
 const options = BG_FAMILY[PC.race] || BG_FAMILY.human;
 story.innerHTML = `<span class="gold" style="font-size:calc(var(--font-base) + 1px)">── 家族・身分を選ぶ ──</span><br><br>
  <span style="color:#c0b098">あなたの生まれはどれですか？</span>`;
 renderChoices(options.map(text=>({
  label:' '+text,
  fn:()=>{ PC._bgFamilyChoice = text; chooseBackgroundMotive(); },
 })));
}

// 続けて、冒険に出た理由を選ばせる
function chooseBackgroundMotive(){
 if(window.innerWidth < 860) document.getElementById('inv-panel')?.classList.add('hidden');
 const story = document.getElementById('story');
 const options = BG_MOTIVE[PC.type] || BG_MOTIVE.warrior;
 story.innerHTML = `<span class="gold" style="font-size:calc(var(--font-base) + 1px)">── 冒険に出た理由を選ぶ ──</span><br><br>
  <span style="color:#c0b098">あなたが冒険に出た理由は？</span>`;
 renderChoices(options.map(m=>({
  label:' '+m.text,
  fn:()=>{
   PC.background = {
    family: PC._bgFamilyChoice,
    motive: m.text,
    motiveTag: m.tag || null,
    motiveClue: m.clue || null,
    motiveTarget: m.target || null,
    motiveSubject: m.subject || null,
    motiveWrongdoing: m.wrongdoing || null,
    motiveWhoJudges: m.whoJudges || null,
    motiveIsDebt: m.isDebt || false,
   };
   _initMotiveExtras(PC.background, m);
   delete PC._bgFamilyChoice;
   go('BACKGROUND_REVEAL');
  },
 })));
}

// ══════════════════════════════════════════
// BACKGROUND SYSTEM
// ══════════════════════════════════════════
function pick(arr){ return arr[Math.floor(Math.random()*arr.length)]; }

const BG_FAMILY = {
 human: [
 '農村の貧しい農家の出身。幼い頃から畑仕事に追われた。',
 '街の商人の家に生まれたが、店は父の借金で潰れた。',
 '元兵士の父を持つ。戦場で戦う背中を見て育った。',
 '孤児院で育った。自分の本当の名前すら知らない。',
 '地方の小領主の末っ子。家督は長兄が継いだ。',
 '港町の漁師一家の出身。海の匂いとともに育った。',
 '旅芸人の一座で育った。定住したことは一度もない。',
 '神殿に仕える神官の家系。信仰と共に育った。',
 ],
 elf: [
 '森の古い一族の血を引く。人間の時の流れとは違う時間を生きてきた。',
 '滅んだエルフの集落の唯一の生き残り。故郷は灰になった。',
 '都市に溶け込もうとした混血の家系に生まれた。',
 '長老評議会に仕える家の出身。儀礼と慣習の中で育った。',
 ],
 dwarf: [
 '地下鉱山都市の採掘師の家系。岩と金属の臭いを纏って育った。',
 '鍛冶師の名門の出身だが、自分には才能がなかった。',
 '山岳の要塞都市で育った。外の世界を見たことがなかった。',
 '一族は人間との交易で栄えた。人の言葉は流暢に話せる。',
 ],
 halfling: [
 '牧歌的な村の農家の出身。村を出たことは一度もなかった。',
 '行商人の家に生まれ、幼い頃から旅慣れている。',
 '小さな村の村長の家系。責任と期待の中で育った。',
 '気ままな一人旅の好きな変わり者の家系の出身。',
 ],
 fairy: [
 '花の森の奥深くに住む一族の出身。人間の世界に好奇心を持った。',
 '妖精の輪の踊り手として育ったが、外の世界に憧れた。',
 '魔法の泉の守り手の家系。古い魔法の知識を持って生まれた。',
 '嵐で故郷の森を追われ、地上の世界に降り立った。',
 ],
 leprechaun: [
 '金貨の隠し場所を守る一族の出身。財宝への執着は誰より強い。',
 '幸運の靴職人の家系。人間に捕まった経験が冒険心に火をつけた。',
 '虹の麓に住む一族。夢と幻術を操る術を学んで育った。',
 '悪戯好きな家系の出身。ある悪戯が過ぎて村を追われた。',
 ],
 troll: [
 '一族の掟に背き、仲間を手にかけることを拒んで山を追われた。二度と戻れない。',
 '混沌の軍勢に一族の集落を焼かれた、数少ない生き残り。行く当てもなく人里へ流れ着いた。',
 '幼い頃、人間の集落に迷い込んで拾われた。育ての親は既にいないが、共通語だけは達者だ。',
 '同族の誰よりも小柄で非力だと蔑まれ続けた。証明するために故郷を出た。',
 ],
 ogre: [
 '群れの頭を継ぐ座を賭けた戦いに敗れ、生き延びる道として放浪を選んだ。',
 '人間の傭兵隊に囚われ、戦働きと引き換えに命を拾った。今も足枷の跡が残る。',
 '一族の誰も知らない「外の世界」への好奇心を抑えられず、自ら群れを離れた。',
 '混沌に住処を奪われた流民の一団の生き残り。仲間はもう誰も残っていない。',
 ],
 orc: [
 '略奪を是とする一族の因習に嫌気が差し、剣を置いて出奔した。',
 '人間との交易を担う数少ない一族の生まれで、共通語も交渉ごとも心得ている。',
 '戦で捕虜となり、労役の末に自由を買い戻した。今も鎖の重さを覚えている。',
 '一族の中では変わり者と呼ばれた。同族の荒々しさより、遠い土地の話に惹かれた。',
 ],
 goblin: [
 '群れの中の序列争いに疲れ、単身で外の世界に飛び出した。',
 '盗品の目利きとして人間の裏社会に拾われ、そのまま居着いた。',
 '一族の縄張りが人間の開拓で奪われ、住処を失った末の放浪。',
 '好奇心旺盛な性分が災いし、余所者扱いされて群れを追い出された。',
 ],
};

// 動機データ：text（表示文）に加え、tag（テーマ）・clue/target（revengeタグ等で使う固有情報）を持たせる。
// tagは今後のイベント連動用の内部データであり、プレイヤーには見せない。
const BG_MOTIVE = {
 warrior: [
  { text:'借金を返すために剣を取った。剣一本が唯一の資産だ。', tag:'wealth', isDebt:true },
  { text:'幼馴染の仇を探している。手がかりは古い紋章だけ。', tag:'revenge', clue:'古い紋章', target:'幼馴染を手にかけた者' },
  { text:'強さへの純粋な渇望。世界で一番強い者と戦ってみたい。', tag:'combat' },
  { text:'家族を養うために冒険者になった。故郷には母と妹がいる。', tag:'family' },
  { text:'軍を追放された。汚名を雪ぐ方法を探している。', tag:'redemption', wrongdoing:'軍からの追放', whoJudges:'かつての戦友たち' },
  { text:'戦いの中にしか生きている実感を得られない。', tag:'combat' },
  { text:'財宝を手に入れて楽な生活を送りたい。ただそれだけだ。', tag:'wealth', isDebt:false },
  { text:'ある古代の遺跡の噂を聞いた。その秘密を暴きたい。', tag:'exploration', subject:'古代遺跡の秘密' },
 ],
 wizard: [
  { text:'師匠が残した謎の書物を解読するための資金が必要だ。', tag:'knowledge', subject:'師匠が残した謎の書物' },
  { text:'禁断の魔法を研究するために追放された。今は独り立ちしている。', tag:'redemption', wrongdoing:'禁断の魔法研究による追放', whoJudges:'かつての師や同門' },
  { text:'魔法の才に恵まれながらも神殿に入れず、野に出た。', tag:'redemption', wrongdoing:'神殿からの拒絶', whoJudges:'神殿の権威者たち' },
  { text:'伝説の魔法書を探している。それがあれば全てが分かるはずだ。', tag:'knowledge', subject:'伝説の魔法書' },
  { text:'魔法の実験で故郷の村を焼いてしまった。償いの旅をしている。', tag:'redemption', wrongdoing:'故郷の村を焼いたこと', whoJudges:'故郷の生き残りたち' },
  { text:'知識への飽くなき欲求。この世の全ての秘密を知りたい。', tag:'knowledge', subject:'この世の全ての秘密' },
  { text:'師匠の死の謎を追っている。手がかりは古い呪文の断片だ。', tag:'revenge', clue:'古い呪文の断片', target:'師匠の死の真相' },
  { text:'魔法で稼げると思ったが、思ったより世間は厳しかった。', tag:'wealth', isDebt:false },
 ],
};

// タグごとに必要な固有の進行データを初期化する（動機確定時に一度だけ呼ぶ）
function _initMotiveExtras(bg, motiveObj){
 if(!bg) return;
 if(motiveObj.tag === 'family'){
  bg.familySisterMarryYear = 5 + Math.floor(Math.random()*6); // 5〜10年後
  bg.familyMotherDeathYear = 10 + Math.floor(Math.random()*6); // 10〜15年後
  bg.familyTotalSent = 0;
  bg.familyMotherAlive = true;
  bg.familySisterMarried = false;
 }
 if(motiveObj.tag === 'wealth'){
  bg.wealthResolved = false;
 }
 if(motiveObj.tag === 'revenge'){
  bg.revengeResolved = false;
 }
}

function rollBackground(race, type){
 const family = pick(BG_FAMILY[race] || BG_FAMILY.human);
 const motiveObj = pick(BG_MOTIVE[type] || BG_MOTIVE.warrior);
 const bg = {
  family,
  motive: motiveObj.text,
  motiveTag: motiveObj.tag || null,
  motiveClue: motiveObj.clue || null,
  motiveTarget: motiveObj.target || null,
  motiveSubject: motiveObj.subject || null,
  motiveWrongdoing: motiveObj.wrongdoing || null,
  motiveWhoJudges: motiveObj.whoJudges || null,
  motiveIsDebt: motiveObj.isDebt || false,
 };
 _initMotiveExtras(bg, motiveObj);
 return bg;
}
const MONSTER_LANGUAGES = ['トロール語', 'オーク語', 'ゴブリン語'];
function rollLanguages(pc){
 pc.languages = ['共通語'];
 const chances = Math.max(0, (pc.iq||0) - 12);
 for(let i=0; i<chances; i++){
  if(Math.random() < 0.1){
   const lang = MONSTER_LANGUAGES[Math.floor(Math.random()*MONSTER_LANGUAGES.length)];
   if(!pc.languages.includes(lang)) pc.languages.push(lang);
  }
 }
}

// 知力を増加させる共通関数。増えた分だけ、10%の確率で混合語（モンスター語）を1つ習得するチャンスがある
function gainIQ(amount, pc=PC){
 amount = Math.floor(amount||0);
 if(amount <= 0) return;
 pc.iq = (pc.iq||0) + amount;
 if(!pc.languages) pc.languages = ['共通語'];
 for(let i=0; i<amount; i++){
  if(Math.random() < 0.1){
   const lang = MONSTER_LANGUAGES[Math.floor(Math.random()*MONSTER_LANGUAGES.length)];
   if(!pc.languages.includes(lang)){
    pc.languages.push(lang);
    if(pc===PC) showSaveToast(`知力が高まり、${lang}を理解できるようになった！`);
   }
  }
 }
}

// ──────────────────────────────────────
// HUD
// ──────────────────────────────────────
function updateHUD(){
 // Overdrive未リセット救済：戦闘が終了しているのに能力値が倍のままなら元に戻す
 if(!cbtState){
  [PC, ...(PC.party||[])].forEach(a=>{
   if(a._overdrivePending){
    a[a._overdrivePending.key] = a._overdrivePending.orig;
    a._overdrivePending = null;
   }
  });
  // 戦闘が終了しているのに召喚された悪魔が残っていたら取り除く
  if((PC.party||[]).some(n=>n._isSummonedDemon)){
   PC.party = PC.party.filter(n=>!n._isSummonedDemon);
  }
  // 戦闘が終了しているのにPC自身がShapeshiftしたままなら元に戻す
  if(PC._shapeshiftOriginal || (PC.party||[]).some(n=>n._shapeshiftOriginal)){ _restoreShapeshiftIfNeeded(); }
 }
 const adds=calcAdds();
 const armor=effectiveArmor();
 const {cur, max, over} = checkWeightPenalty();
 document.getElementById('d-st').textContent=PC.st;
 document.getElementById('d-con').textContent=PC.con+'/'+PC.maxCon;
 document.getElementById('d-lk').textContent=PC.lk;
 document.getElementById('d-dex').textContent=PC.dex;
 document.getElementById('d-adds').textContent=(adds>=0?'+':'')+adds;
 document.getElementById('d-armor').textContent=armor;
 document.getElementById('d-wt').textContent=cur+'/'+max;
 document.getElementById('d-gp').innerHTML=formatMoney();
 document.getElementById('d-lv').textContent=PC.level;
 document.getElementById('d-ap').textContent=PC.ap;
 document.getElementById('hdr-char').textContent=(PC._nobilityTitle?PC._nobilityTitle+' ':'')+(PC.epithet?PC.epithet+' ':'')+PC.name+' '+(PC.type==='warrior'?'[W]':PC.type==='wizard'?'[M]':PC.type==='rogue'?'[R]':'');

 // 食料ポイント
 const food = PC._food || 0;
 const foodEl = document.getElementById('d-food');
 const foodCell = document.getElementById('sc-food');
 if(foodEl){
 foodEl.textContent = food;
 foodEl.style.color = food > 15 ? 'var(--white)' : food > 5 ? 'var(--grn)' : food > 0 ? 'var(--yel)' : 'var(--red)';
 }
 if(foodCell) foodCell.className = 'stat-cell' + (food === 0 ? ' critical' : food <= 5 ? 'danger' : food <= 15 ? ' warn' : '');

 // 重量警告
 const wtCell = document.getElementById('sc-wt');
 if(over){
 wtCell.className='stat-cell critical';
 document.getElementById('d-wt').style.color='var(--red)';
 } else if(cur > max*0.8){
 wtCell.className='stat-cell warn';
 document.getElementById('d-wt').style.color='var(--yel)';
 } else {
 wtCell.className='stat-cell';
 document.getElementById('d-wt').style.color='var(--white)';
 }

 // Danger indicators
 const conPct=PC.con/PC.maxCon;
 const stCell=document.getElementById('sc-st');
 const conCell=document.getElementById('sc-con');
 stCell.className='stat-cell'+(PC.st<=0?' critical':PC.st<=Math.floor(PC.maxSt*0.25)?' danger':PC.st<=Math.floor(PC.maxSt*0.5)?' warn':'');
 conCell.className='stat-cell'+(PC.con<=0?' critical':conPct<=0.25?' danger':conPct<=0.5?' warn':'');

 // デスクトップ：ミニHUD＋左ペインの詳細ステータスを自動更新
 if(window.innerWidth >= 860){
 initDesktopLeftPane();
 updateMiniHUD();
 renderStatusPanel();
 }
}

// デスクトップ用：左ペインにinv-panelを配置して常時表示
function initDesktopLeftPane(){
 if(window.innerWidth < 860) return;
 const inv = document.getElementById('inv-panel');
 const leftScroll = document.getElementById('left-scroll');
 if(!inv || !leftScroll) return;
 // モバイルでscroll-areaに移動されていた場合はleft-scrollへ戻す
 if(inv.parentElement !== leftScroll) leftScroll.insertBefore(inv, leftScroll.firstChild);
 // CSSの #left-scroll #inv-panel { display:block!important } で表示制御されるため
 // ここでは hidden クラスの除去だけ行う
 inv.classList.remove('hidden');
}

// デスクトップ用：ミニHUDを更新
function updateMiniHUD(){
 if(window.innerWidth < 860) return;
 // 名前
 const nameEl = document.getElementById('mh-name');
 if(nameEl){
 const typeIcon = PC.type === 'warrior' ? '' : '';
 nameEl.textContent = `${PC._nobilityTitle?PC._nobilityTitle+' ':''}${PC.epithet?PC.epithet+' ':''}${PC.name} ${typeIcon} Lv${PC.level}`;
 }
 // 日付・年齢
 const dateEl = document.getElementById('mh-date');
 if(dateEl){
 const age = calcAge ? calcAge() : (PC.age||0);
 const params = AGING_PARAMS[PC.race] || AGING_PARAMS.human;
 const lifespan = PC.lifespan || params.lifespan;
 const timebarEl = document.getElementById('timebar');
 const dateStr = timebarEl ? timebarEl.textContent.trim() : '';
 dateEl.textContent = dateStr + ` ${age}歳`;
 }
 // バー（主要ステータスを5マスで表示）
 const barsEl = document.getElementById('mh-bars');
 if(!barsEl) return;
 const food = PC._food || 0;
 const foodColor = food > 15 ? 'var(--white)' : food > 5 ? 'var(--grn)' : food > 0 ? 'var(--yel)' : 'var(--red)';
 const conPct = PC.maxCon > 0 ? PC.con / PC.maxCon : 1;
 const conClass = conPct <= 0 ? 'critical' : conPct <= 0.25 ? 'danger' : conPct <= 0.5 ? 'warn' : '';
 const {cur: wtCur, max: wtMax, over: wtOver} = checkWeightPenalty();
 const wtClass = wtOver ? 'danger' : wtCur > wtMax * 0.8 ? 'warn' : '';
 const gpLabel = PC.gold ? PC.gold+'GP' : PC.sp ? PC.sp+'SP' : (PC.cp||0)+'CP';
 const torch = (PC._torchStock||0) + (PC._torchTurns > 0 ? 1 : 0);

 barsEl.innerHTML = [
 {l:'体力', v:`${PC.con}/${PC.maxCon}`, cls: conClass},
 {l:'強さ', v:PC.st, cls: PC.st <= 0 ? 'critical' : PC.st <= Math.floor(PC.maxSt*0.25) ? 'danger' : PC.st <= Math.floor(PC.maxSt*0.5) ? 'warn' : ''},
 {l:'ADDS',v:(calcAdds()>=0?'+':'')+calcAdds(), cls:''},
 {l:'GP', v:gpLabel, cls:''},
 {l:'', v:food+'日', cls: food<=0?'danger':food<=3?'warn':''},
 {l:'WT', v:wtCur, cls: wtClass},
 {l:'経験値', v:PC.ap, cls:''},
 {l:'防護値',v:effectiveArmor()+'H', cls:''},
 {l:'', v:torch+'本', cls: torch===0 && (currentNodeId||'').includes('TOMB') && !['TOMB_ENTRANCE','TOMB_EXIT'].includes(currentNodeId) ? 'warn' : ''},
 {l:'毒', v:PC._poisoned?'あり':'なし', cls: PC._poisoned?'danger':''},
 ].map(c=>`<div class="mh-cell ${c.cls}"><span class="lbl">${c.l}</span><span class="val">${c.v}</span></div>`).join('');
}

// ──────────────────────────────────────
// INVENTORY
// ──────────────────────────────────────
function switchStatTab(tab){
 ['status','equip','party','log'].forEach(t=>{
 document.getElementById('stpanel-'+t).style.display = t===tab ? '' : 'none';
 const btn = document.getElementById('tab-'+t);
 if(btn){
 btn.style.borderColor = t===tab ? 'var(--gold)' : 'var(--bark)';
 btn.style.color = t===tab ? 'var(--gold)' : 'var(--dim)';
 }
 });
 if(tab==='party') renderPartyTab();
}

let _partyDetailIdx = null; // null=一覧, 0〜=個別

function renderPartyTab(){
 const el = document.getElementById('sp-party-content');
 const party = PC.party||[];
 if(!party.length){
 _partyDetailIdx = null;
 el.innerHTML = '<div style="font-size:var(--font-sm);color:#c8b8a0;text-align:center;padding:20px">仲間がいません。<br>酒場で仲間を探しましょう。</div>' + fcRosterHtml();
 return;
 }
 if(_partyDetailIdx !== null && party[_partyDetailIdx]){
 renderNPCDetail(el, party[_partyDetailIdx], _partyDetailIdx);
 } else {
 _partyDetailIdx = null;
 renderPartyList(el, party);
 el.innerHTML += fcRosterHtml(); // かつての仲間の名簿
 }
}

function renderPartyList(el, party){
 const typeJa = t=>({warrior:'戦士',rogue:'盗賊',wizard:'魔法使い'}[t]||t);
 const raceJa = r=>({human:'人間',elf:'エルフ',dwarf:'ドワーフ',halfling:'ハーフリング',fairy:'フェアリー',leprechaun:'レプラコーン',troll:'トロール',ogre:'オーガ',orc:'オーク',goblin:'ゴブリン'}[r]||r);
 el.innerHTML = party.map((n,i)=>{
 const alive = n.con>0;
 const barW = alive ? Math.round(n.con/n.maxCon*100) : 0;
 const col = barW>50?'var(--nature2)':barW>25?'#ffcc00':'var(--danger)';
 const trust = n.trust??0;
 const trustCol = trust>=75?'#f0ece0':trust>=40?'#d0c8b8':'#a0a0a0';
 const trustLabel = trust>=90?'篤い信頼':trust>=70?'信頼':trust>=50?'友好':trust>=30?'普通':trust>=10?'様子見':'不信';
 const isCurrentSpouse = n.married && (PC.spouse||[]).some(s=>s.name===n.name);
 const mb = isCurrentSpouse?`<span style="font-size:calc(var(--font-sm) - 2px);color:#f0ece0;border:1px solid #c8a44a;border-radius:3px;padding:1px 5px;margin-left:6px"> 配偶者</span>`:'';
 return `<div onclick="viewNPCDetail(${i})" style="background:var(--panel);border:1px solid ${alive?'var(--bark)':'#221122'};border-radius:4px;padding:10px;margin-bottom:8px;cursor:pointer">
 <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
 <div>
 <span style="font-size:calc(var(--font-sm) + 1px);color:${alive?'var(--gold3)':'#555'}">${alive?'':''} ${n.epithet?'<span style="font-size:calc(var(--font-sm) - 2px);color:#f0ece0">'+n.epithet+'</span> ':''}${n.name}</span>${mb}
 <span style="font-size:calc(var(--font-sm) - 2px);color:#e8e0d0;margin-left:6px">${raceJa(n.race)}の${typeJa(n.type)} Lv${n.level||1}　${Math.floor((GAME_TIME.totalDays-(n.birthDay||(-(400-380)*365)))/365)}歳</span>
 </div>
 <span style="font-size:calc(var(--font-sm) - 2px);color:#d8d0c0">詳細 ▶</span>
 </div>
 <div style="font-size:calc(var(--font-sm) - 1px);color:#e8e0d0">体力 ${n.con}/${n.maxCon}</div>
 ${alive?`<div style="height:3px;background:#050505;border-radius:2px;margin-top:4px"><div style="width:${barW}%;height:100%;background:${col};border-radius:2px"></div></div>`:''}
 ${alive?`<div style="display:flex;align-items:center;gap:5px;margin-top:5px">
  <div style="flex:1;height:3px;background:#050505;border-radius:2px"><div style="width:${trust}%;height:100%;background:${trustCol};border-radius:2px"></div></div>
  <span style="font-size:calc(var(--font-sm) - 3px);color:${trustCol};white-space:nowrap">信頼 ${trust} ${trustLabel}</span>
 </div>`:''}
 </div>`;
 }).join('');
}

function viewNPCDetail(idx){
 _partyDetailIdx = idx;
 renderPartyTab();
}

function renderNPCDetail(el, n, idx){
 // 所持金フィールドが未初期化のNPCに初期値を設定
 if(n.gold === undefined){ n.gold = Nd6(2) * (n.level||1) * 5; }
 if(n.sp   === undefined){ n.sp   = d6() * (n.level||1); }
 if(n.cp   === undefined){ n.cp   = d6(); }
 // 身長・体重が未設定のNPCは、詳細を開いたこの瞬間に決めてしまう
 if(n.height==null || n.weight==null){ Object.assign(n, rollBodySize(n.race)); }
 // APからレベルを再計算（旧データの補正）
 const correctLv = calcLevelFromAP(n.ap||0);
 if(correctLv !== n.level) n.level = correctLv;
 const typeJa = {warrior:'戦士',rogue:'盗賊',wizard:'魔法使い'}[n.type]||n.type;
 const raceJa = {human:'人間',elf:'エルフ',dwarf:'ドワーフ',halfling:'ハーフリング',fairy:'フェアリー',leprechaun:'レプラコーン',troll:'トロール',ogre:'オーガ',orc:'オーク',goblin:'ゴブリン'}[n.race]||n.race;
 const alive = n.con > 0;
 const conPct = alive ? Math.round(n.con/n.maxCon*100) : 0;
 const conCol = conPct>50?'var(--nature2)':conPct>25?'#ffcc00':'var(--danger)';
 const marriedBadge = (n.married && (PC.spouse||[]).some(s=>s.name===n.name)) ? `<span style="font-size:calc(var(--font-sm) - 2px);color:#f0ece0;border:1px solid #c8a44a;border-radius:3px;padding:1px 5px;margin-left:6px"> 配偶者</span>` : '';
 const adds = calcAdds(n);
 const armor = calcNPCArmor(n);
 const npcAP = n.ap || 0;
 const npcLv = n.level || 1;
 const npcNextThresh = LEVEL_THRESHOLDS[npcLv] || null;
 const npcToNext = npcNextThresh ? npcNextThresh - npcAP : null;
 const npcFromPrev = LEVEL_THRESHOLDS[npcLv-1] || 0;
 const npcApPct = npcNextThresh ? Math.min(100, Math.round((npcAP - npcFromPrev) / (npcNextThresh - npcFromPrev) * 100)) : 100;
 // 信頼度
 const trust = n.trust??0;
 const trustCol = trust>=75?'#f0ece0':trust>=40?'#d0c8b8':'#a0a0a0';
 const trustLabel = trust>=90?'篤い信頼':trust>=70?'信頼':trust>=50?'友好':trust>=30?'普通':trust>=10?'様子見':'不信';
 const trustHtml = '<div style="background:var(--panel);border:1px solid var(--panel2);border-radius:3px;padding:8px;margin-bottom:12px">'
  + '<div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:5px">'
  + `<span style="font-size:calc(var(--font-sm) - 1px);color:#e8e0d0"> あなたへの信頼度</span>`
  + `<span style="font-size:calc(var(--font-sm) + 1px);color:${trustCol}">${trust}/100　${trustLabel}</span>`
  + '</div>'
  + `<div style="height:5px;background:#050505;border-radius:2px">`
  + `<div style="width:${trust}%;height:100%;background:${trustCol};border-radius:2px;transition:width 0.3s"></div>`
  + '</div>'
  + '</div>';

 const npcApHtml = '<div style="background:var(--panel);border:1px solid var(--void);border-radius:3px;padding:8px;margin-bottom:12px">'
  + '<div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:4px">'
  + '<span style="font-size:calc(var(--font-sm) - 1px);color:#e8e0d8">⭐ 経験値（経験値）</span>'
  + '<span style="font-size:calc(var(--font-sm) + 1px);color:#f4ede0">' + npcAP.toLocaleString() + '</span>'
  + '</div>'
  + '<div style="height:4px;background:var(--ink);border-radius:2px;margin-bottom:4px">'
  + '<div style="width:' + npcApPct + '%;height:100%;background:linear-gradient(90deg,#d8d0c0,#ffcc33);border-radius:2px"></div>'
  + '</div>'
  + '<div style="font-size:calc(var(--font-sm) - 2px);color:#d8d0c0">' + (npcToNext !== null ? '次のLvまで ' + npcToNext.toLocaleString() + ' 経験値' : 'MAX LEVEL') + '</div>'
  + '</div>';

 // 能力値グリッド
 const attrRows = [
 ['強さ', n.st, n.maxSt||n.st],
 ['知力', n.iq, null],
 ['運', n.lk, null],
 ['体力', n.con, n.maxCon],
 ['器用さ', n.dex, null],
 ['魅力', n.chr, null],
 ['素早さ', n.spd, null],
 ].map(([label,val,max])=>{
 const pct = max ? Math.max(0,val/max*100) : null;
 const color = max ? (pct>50?'var(--white)':pct>25?'var(--grn)':pct>0?'var(--yel)':'var(--red)') : 'var(--white)';
 return `<div style="background:var(--panel);border:1px solid var(--panel2);border-radius:3px;padding:6px 8px">
 <div style="font-size:calc(var(--font-sm) - 1px);color:#c8b8a0;margin-bottom:3px">${label}</div>
 <div style="font-size:calc(var(--font-base) + 1px);color:${color}">${val}${max?`<span style="font-size:calc(var(--font-sm) - 1px);color:#c8b8a0">/${max}</span>`:''}</div>
 </div>`;
 }).join('');

 // 武器
 const wpRows = (n.equippedWeapons||[]).map((w,wi)=>`
 <div style="background:var(--ink);border:1px solid #440044;border-radius:3px;padding:8px;margin-bottom:5px;display:flex;justify-content:space-between;align-items:center">
 <div>
 <div style="font-size:var(--font-sm);color:#f0ece0"> ${w.name}</div>
 <div style="font-size:calc(var(--font-sm) - 2px);color:#c8b8a0">${w.dice}D+${w.adds||0}　${w.twoHand?'両手':'片手'}</div>
 </div>
 <button onclick="npcUnequipWeapon(${idx},${wi})" style="font-size:calc(var(--font-sm) - 3px);padding:4px 8px;background:#200000;border:1px solid #550000;color:#e0d8c8;font-family:system-ui,sans-serif;cursor:pointer;border-radius:2px">外す</button>
 </div>`).join('');

 const invWpRows = (n.invWeapons||[]).filter(w=>!w.isRanged).map((w,wi)=>{
 const canUse = (w.stReq||0)<=n.st && (w.dexReq||0)<=n.dex && (n.type!=='wizard' || (w.dice||0)<=2);
 return `<div style="background:var(--panel);border:1px solid var(--void);border-radius:3px;padding:8px;margin-bottom:5px;display:flex;justify-content:space-between;align-items:center">
 <div>
 <div style="font-size:var(--font-sm);color:#c8b8a0"> ${w.name}${canUse?'':' <span style="color:#e0d0d0;font-size:calc(var(--font-sm) - 3px)">※要件未満</span>'}</div>
 <div style="font-size:calc(var(--font-sm) - 2px);color:#d8d0c0">${w.dice}D+${w.adds||0}　${w.twoHand?'両手':'片手'}</div>
 </div>
 <button onclick="npcEquipWeapon(${idx},${wi})" ${canUse?'':'disabled'} style="font-size:calc(var(--font-sm) - 3px);padding:4px 8px;background:#0e1006;border:1px solid var(--rust);color:#f0ece0;font-family:system-ui,sans-serif;cursor:pointer;border-radius:2px${canUse?'':';opacity:0.4'}">装備</button>
 </div>`;
 }).join('');

 // 防具
 const arRows = (n.equippedArmors||[]).map((a,ai)=>`
 <div style="background:var(--info-bg);border:1px solid #004444;border-radius:3px;padding:8px;margin-bottom:5px;display:flex;justify-content:space-between;align-items:center">
 <div>
 <div style="font-size:var(--font-sm);color:#ece8e0">${a.isShield?'':''} ${a.name}</div>
 <div style="font-size:calc(var(--font-sm) - 2px);color:#c8b8a0">防護 ${a.hits}hits${n.type==='warrior'?` (×2→${a.hits*2})`:''}</div>
 </div>
 <button onclick="npcUnequipArmor(${idx},${ai})" style="font-size:calc(var(--font-sm) - 3px);padding:4px 8px;background:#200000;border:1px solid #550000;color:#e0d8c8;font-family:system-ui,sans-serif;cursor:pointer;border-radius:2px">外す</button>
 </div>`).join('');

 const invArRows = (n.invArmors||[]).map((a,ai)=>{
 const canUse = a.stReq<=n.st;
 return `<div style="background:var(--panel);border:1px solid var(--deep);border-radius:3px;padding:8px;margin-bottom:5px;display:flex;justify-content:space-between;align-items:center">
 <div>
 <div style="font-size:var(--font-sm);color:#c8b8a0">${a.isShield?'':''} ${a.name}${canUse?'':' <span style="color:#e0d0d0;font-size:calc(var(--font-sm) - 3px)">※強さ不足</span>'}</div>
 <div style="font-size:calc(var(--font-sm) - 2px);color:#c8b8a0">防護 ${a.hits}hits</div>
 </div>
 <button onclick="npcEquipArmor(${idx},${ai})" ${canUse?'':'disabled'} style="font-size:calc(var(--font-sm) - 3px);padding:4px 8px;background:#0e1006;border:1px solid var(--rust);color:#f0ece0;font-family:system-ui,sans-serif;cursor:pointer;border-radius:2px${canUse?'':';opacity:0.4'}">装備</button>
 </div>`;
 }).join('');

 // 呪文（使うボタン付き）
 const spellRows = (n.spells||[]).length
 ? (n.spells||[]).map((s,si)=>{
  const canCast = (n.st||0) >= (s.cost||0);
  const inCombat = !!cbtState;
  const useBtn = !inCombat ? `<button onclick="npcCastSpellOutside(${idx},${si})"
   style="font-size:calc(var(--font-sm) - 3px);padding:4px 8px;background:var(--ink);border:1px solid ${canCast?'var(--white2)':'var(--void)'};color:${canCast?'var(--info2)':'var(--info-border)'};font-family:system-ui,sans-serif;cursor:pointer;border-radius:2px${canCast?'':';opacity:0.5'}"
   ${canCast?'':'disabled'}> 使う</button>` : '';
  return `<div style="background:#100c06;border:1px solid #585858;border-radius:3px;padding:8px;margin-bottom:5px;display:flex;justify-content:space-between;align-items:center">
  <div>
   <div style="font-size:var(--font-sm);color:#f0ece0"> ${s.name} <span style="color:#e0d0d0;font-size:calc(var(--font-sm) - 1px)">強さ-${s.cost}</span></div>
   <div style="font-size:calc(var(--font-sm) - 1px);color:#e8e0d0">${s.desc}</div>
  </div>
  ${useBtn}
  </div>`;
 }).join('')
 : '<div style="font-size:var(--font-sm);color:#c8b8a0">呪文なし</div>';

 el.innerHTML = `
 <!-- 戻るボタン -->
 <button onclick="_partyDetailIdx=null;renderPartyTab()" style="font-size:calc(var(--font-sm) - 3px);padding:6px 12px;background:var(--panel);border:1px solid var(--bark);color:#f0ece0;font-family:system-ui,sans-serif;cursor:pointer;border-radius:2px;margin-bottom:10px">◀ 一覧に戻る</button>

 <!-- 名前・基本情報 -->
 <div style="text-align:center;margin-bottom:10px;padding-bottom:8px;border-bottom:1px solid var(--earth)">
 <div style="font-size:calc(var(--font-lg) + 2px);color:#f0ece0;margin-bottom:4px">${alive?'':' '}${n.name}</div>
 ${(()=>{ const birthDay=n.birthDay||(-(400-380)*365); const ageYears=Math.floor((GAME_TIME.totalDays-birthDay)/365); return `<div style="font-size:calc(var(--font-sm) - 2px);color:#c8b8a0">${ageYears}歳</div>`; })()}
 <div style="font-size:calc(var(--font-sm) - 2px);color:#c8b8a0">${raceJa.toUpperCase()}　${typeJa.toUpperCase()}　Lv${n.level||1}</div>
 <div style="font-size:calc(var(--font-sm) - 2px);color:#c8b8a0;margin-top:2px">身長 ${n.height!=null ? n.height+'cm' : '-'}　体重 ${n.weight!=null ? n.weight+'kg' : '-'}</div>
 </div>

 <!-- CONバー -->
 <div style="margin-bottom:10px">
 <div style="font-size:calc(var(--font-sm) - 1px);color:#c8b8a0;margin-bottom:3px">体力　${n.con} / ${n.maxCon}</div>
 <div style="height:8px;background:#1a1a1a;border-radius:4px">
 <div style="width:${conPct}%;height:100%;background:${conCol};border-radius:4px;transition:width 0.3s"></div>
 </div>
 </div>

 <!-- 能力値 -->
 <div style="font-size:calc(var(--font-sm) - 2px);color:#e8e0d8;margin-bottom:6px;border-bottom:1px solid var(--shadow);padding-bottom:3px"> 能力値</div>
 <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:4px;margin-bottom:12px">${attrRows}</div>

 <!-- 性格 -->
 ${renderAlignmentWidget(n.alignment_ethics, n.alignment_order)}

 <!-- 戦闘値 -->
 <div style="font-size:calc(var(--font-sm) - 2px);color:#e8e0d8;margin-bottom:6px;border-bottom:1px solid var(--shadow);padding-bottom:3px"> 戦闘値</div>
 <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:4px;margin-bottom:8px">
 <div style="background:var(--panel);border:1px solid var(--panel2);border-radius:3px;padding:6px 8px;text-align:center">
 <div style="font-size:calc(var(--font-sm) - 1px);color:#c8b8a0;margin-bottom:3px">戦闘力修正</div>
 <div style="font-size:var(--font-base);color:#f0ece0">${adds>=0?'+':''}${adds}</div>
 </div>
 <div style="background:var(--panel);border:1px solid var(--panel2);border-radius:3px;padding:6px 8px;text-align:center">
 <div style="font-size:calc(var(--font-sm) - 1px);color:#c8b8a0;margin-bottom:3px">防護値</div>
 <div style="font-size:var(--font-base);color:#ece8e0">${armor}hits</div>
 </div>
 <div style="background:var(--panel);border:1px solid var(--panel2);border-radius:3px;padding:6px 8px;text-align:center">
 <div style="font-size:calc(var(--font-sm) - 1px);color:#c8b8a0;margin-bottom:3px">LEVEL</div>
 <div style="font-size:var(--font-base);color:#f4ede0">${n.level||1}</div>
 </div>
 </div>
 <!-- 信頼度 -->
 ${trustHtml}
 <!-- 経験値 -->
 ${npcApHtml}

 <!-- 所持金 -->
 <div style="font-size:calc(var(--font-sm) - 2px);color:#e8e0d8;margin-bottom:6px;border-bottom:1px solid var(--shadow);padding-bottom:3px"> 所持金</div>
 <div style="background:#0a0810;border:1px solid var(--void);border-radius:3px;padding:8px;margin-bottom:6px;font-size:calc(var(--font-sm) + 1px)">
  ${(n.gold||0)>0?`<span style="color:#f0ece0">${n.gold}GP</span> `:''}
  ${(n.sp||0)>0?`<span style="color:#f0ece0">${n.sp}SP</span> `:''}
  ${(n.cp||0)>0?`<span style="color:#e0d8cc">${n.cp}CP</span>`:''}
  ${!(n.gold||0)&&!(n.sp||0)&&!(n.cp||0)?'<span style="color:#c8b8a0">なし</span>':''}
 </div>
 <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:4px;margin-bottom:12px">
  <button onclick="giveCurrencyToNPC(${idx},'gold')" style="background:var(--info-bg);border:1px solid #484848;color:#e0d8c8;font-family:system-ui,sans-serif;font-size:calc(var(--font-sm) - 2px);padding:7px 2px;cursor:pointer;border-radius:3px">GPを渡す</button>
  <button onclick="giveCurrencyToNPC(${idx},'sp')" style="background:var(--info-bg);border:1px solid #484848;color:#e0d8c8;font-family:system-ui,sans-serif;font-size:calc(var(--font-sm) - 2px);padding:7px 2px;cursor:pointer;border-radius:3px">SPを渡す</button>
  <button onclick="giveCurrencyToNPC(${idx},'cp')" style="background:var(--info-bg);border:1px solid #484848;color:#e0d8c8;font-family:system-ui,sans-serif;font-size:calc(var(--font-sm) - 2px);padding:7px 2px;cursor:pointer;border-radius:3px">CPを渡す</button>
 </div>
 ${(()=>{
  const bankEntries = Object.entries(n.bankAccounts||{}).filter(([t,a])=>a.gold||a.sp||a.cp);
  if(!bankEntries.length) return '';
  const rows = bankEntries.map(([t,a])=>`${EXCHANGE_BANK_NAMES[t]||t}：${a.gold||0}GP ${a.sp||0}SP ${a.cp||0}CP`).join('<br>');
  return `<div style="font-size:calc(var(--font-sm) - 2px);color:#a8c8a0;margin-bottom:12px">${rows}</div>`;
 })()}

 <!-- 武器 -->
 <div style="font-size:calc(var(--font-sm) - 2px);color:#e8e0d8;margin-bottom:6px;border-bottom:1px solid var(--shadow);padding-bottom:3px"> 武器</div>
 <div style="margin-bottom:4px">${wpRows || '<div style="font-size:var(--font-sm);color:#c8b8a0">装備なし</div>'}</div>
 ${invWpRows ? `<div style="font-size:calc(var(--font-sm) - 2px);color:#d8d0c0;margin-bottom:4px">── 所持（未装備）──</div><div style="margin-bottom:12px">${invWpRows}</div>` : '<div style="margin-bottom:12px"></div>'}

 <!-- 遠距離武器スロット -->
 <div style="font-size:calc(var(--font-sm) - 2px);color:#e0d8c8;margin-bottom:6px;border-bottom:1px solid var(--info-border);padding-bottom:3px"> 遠距離武器スロット</div>
 ${(()=>{
  const rw = n.equippedRanged;
  let rHtml = '';
  if(rw){
   rHtml += `<div style="background:var(--ink);border:1px solid #484848;border-radius:3px;padding:8px;margin-bottom:5px;display:flex;justify-content:space-between;align-items:center">
   <div>
    <div style="font-size:var(--font-sm);color:#e0d8c8"> ${rw.name}</div>
    <div style="font-size:calc(var(--font-sm) - 2px);color:#c8b8a0">${rw.dice}D+${rw.adds||0}　${rw.isRanged?'弓':'投擲'}</div>
   </div>
   <button onclick="npcUnequipRanged(${idx})" style="font-size:calc(var(--font-sm) - 3px);padding:4px 8px;background:#200000;border:1px solid #550000;color:#e0d8c8;font-family:system-ui,sans-serif;cursor:pointer;border-radius:2px">外す</button>
   </div>`;
  } else {
   rHtml += `<div style="font-size:calc(var(--font-sm) - 2px);color:var(--white2);padding:6px;margin-bottom:4px">（なし）</div>`;
  }
  const candidates = (n.invWeapons||[]).filter(w=>isRangedWeapon(w) && !(rw && rw.name===w.name));
  candidates.forEach((w,wi)=>{
   const widx = (n.invWeapons||[]).indexOf(w);
   rHtml += `<div style="background:var(--panel);border:1px solid #224;border-radius:3px;padding:6px;margin-bottom:4px;display:flex;justify-content:space-between;align-items:center">
   <div style="font-size:var(--font-sm);color:#c8b8a0"> ${w.name} <span style="color:var(--white2);font-size:calc(var(--font-sm) - 2px)">${w.dice}D+${w.adds||0}</span></div>
   <button onclick="npcEquipRanged(${idx},${widx})" style="font-size:calc(var(--font-sm) - 3px);padding:4px 8px;background:var(--info-bg);border:1px solid #484848;color:var(--white2);font-family:system-ui,sans-serif;cursor:pointer;border-radius:2px">遠距離装備</button>
   </div>`;
  });
  return rHtml;
 })()}
 <div style="margin-bottom:12px"></div>

 <!-- 防具 -->
 <div style="font-size:calc(var(--font-sm) - 2px);color:#e8e0d8;margin-bottom:6px;border-bottom:1px solid var(--shadow);padding-bottom:3px"> 防具</div>
 <div style="margin-bottom:4px">${arRows || '<div style="font-size:var(--font-sm);color:#c8b8a0">装備なし</div>'}</div>
 ${invArRows ? `<div style="font-size:calc(var(--font-sm) - 2px);color:#d8d0c0;margin-bottom:4px">── 所持（未装備）──</div><div style="margin-bottom:12px">${invArRows}</div>` : '<div style="margin-bottom:12px"></div>'}

 <!-- 所持品 -->
 ${(()=>{
  const items = [];
  // その他装備品
  (n.invEquip||[]).forEach(name=>{ items.push(`<div style="background:var(--panel);border:1px solid var(--deep);border-radius:3px;padding:7px 8px;margin-bottom:4px;font-size:var(--font-sm);color:var(--text)"> ${name}</div>`); });
  // 松明
  const torches = (n._torchStock||0);
  if(torches > 0) items.push(`<div style="background:var(--panel);border:1px solid var(--deep);border-radius:3px;padding:7px 8px;margin-bottom:4px;font-size:var(--font-sm);color:var(--text)"> 松明 ×${torches}本</div>`);
  // 食料
  const food = (n._food||0);
  if(food > 0) items.push(`<div style="background:var(--panel);border:1px solid var(--deep);border-radius:3px;padding:7px 8px;margin-bottom:4px;font-size:var(--font-sm);color:var(--text)"> 食料 ${food}日分</div>`);
  // 宝飾品
  (n.invJewels||[]).forEach(j=>{ items.push(`<div style="background:var(--panel);border:1px solid var(--void);border-radius:3px;padding:7px 8px;margin-bottom:4px"><div style="font-size:var(--font-sm);color:#f0ece0"> ${j.name}</div><div style="font-size:calc(var(--font-sm) - 2px);color:#c8b8a0">売値 ${Math.floor(j.priceGP*0.5)}GP</div></div>`); });
  // 特産品
  (n.invSpecialties||[]).forEach(sp=>{ items.push(`<div style="background:var(--panel);border:1px solid #505050;border-radius:3px;padding:7px 8px;margin-bottom:4px"><div style="font-size:var(--font-sm);color:var(--white)">${sp.icon||''} ${sp.name}</div><div style="font-size:calc(var(--font-sm) - 2px);color:#c8b8a0">仕入 ${sp.boughtAt}GP</div></div>`); });
  if(!items.length) return '';
  return '<div style="font-size:calc(var(--font-sm) - 2px);color:#e8e0d8;margin-bottom:6px;border-bottom:1px solid var(--shadow);padding-bottom:3px"> 所持品</div><div style="margin-bottom:12px">' + items.join('') + '</div>';
 })()}

 <!-- 呪文（ウィザードのみ） -->
 ${n.type==='wizard'?`
 <div style="font-size:calc(var(--font-sm) - 2px);color:#e8e0d8;margin-bottom:6px;border-bottom:1px solid var(--shadow);padding-bottom:3px"> 呪文</div>
 <div style="margin-bottom:12px">${spellRows}</div>`:''}

 <!-- 背景 -->
 ${(n.background?.family||n.background?.motive) ? `
 <div style="font-size:calc(var(--font-sm) - 2px);color:#e8e0d8;margin-bottom:6px;border-bottom:1px solid var(--shadow);padding-bottom:3px"> 背景</div>
 <div style="background:var(--panel);border:1px solid var(--panel2);border-radius:3px;padding:10px;margin-bottom:6px">
 <div style="font-size:calc(var(--font-sm) - 2px);color:#e8e0d8;margin-bottom:5px"> 出自</div>
 <div style="font-size:var(--font-sm);color:var(--text);line-height:2">${n.background.family||'不明'}</div>
 </div>
 <div style="background:var(--panel);border:1px solid var(--panel2);border-radius:3px;padding:10px;margin-bottom:12px">
 <div style="font-size:calc(var(--font-sm) - 2px);color:#e8e0d8;margin-bottom:5px"> 動機</div>
 <div style="font-size:var(--font-sm);color:var(--text);line-height:2">${n.background.motive||'不明'}</div>
 </div>` : ''}

 <!-- アイテム受け渡しボタン -->
 <button onclick="showItemTransfer(${idx})" style="width:100%;font-size:calc(var(--font-sm) - 2px);padding:10px;background:var(--ink);border:1px solid #505050;color:#f0ece0;font-family:system-ui,sans-serif;cursor:pointer;border-radius:3px;margin-top:4px"> アイテムを受け渡す</button>

 <!-- 解散ボタン -->
 <button onclick="dismissNPC(${idx})" style="width:100%;font-size:calc(var(--font-sm) - 2px);padding:10px;background:#1a0e06;border:1px solid #550022;color:#e0d0d0;font-family:system-ui,sans-serif;cursor:pointer;border-radius:3px;margin-top:6px"> ${n.name}を解散させる</button>

 <!-- 話しかけるボタン -->
 ${alive ? `<button onclick="talkToNPC(${idx})" style="width:100%;font-size:calc(var(--font-sm) - 2px);padding:10px;background:var(--ink);border:1px solid var(--bark);color:#f0ece0;font-family:system-ui,sans-serif;cursor:pointer;border-radius:3px;margin-top:6px"> ${n.name}に話しかける</button>` : ''}
 `;
}

function showInventory(){
 if(window.innerWidth >= 860){
 // デスクトップ：左ペインに常時表示済み。タブを status に切り替えるだけ
 switchStatTab('status');
 renderStatusPanel();
 return;
 }
 // モバイル：従来通りオーバーレイ表示
 const inv = document.getElementById('inv-panel');
 const scrollArea = document.getElementById('scroll-area');
 if(inv.parentElement !== scrollArea) scrollArea.insertBefore(inv, scrollArea.firstChild);
 inv.classList.remove('hidden');
 switchStatTab('status');
 renderStatusPanel();
}

function renderStatusPanel(){
 const params = AGING_PARAMS[PC.race] || AGING_PARAMS.human;
 const lifespan = PC.lifespan || params.lifespan;
 const age = calcAge();
 const lifePct = Math.min(100, age / lifespan * 100);
 const lifeColor = lifePct<50?'var(--nature2)':lifePct<75?'#ffcc33':'var(--danger)';
 const townName = TOWNS[PC.town]?.name || PC.town;

 // ── ステータスタブ ──
 document.getElementById('sp-name').textContent = (PC._nobilityTitle?PC._nobilityTitle+' ':'')+PC.name;
 document.getElementById('sp-epithet').textContent = PC._isRaidUnit ? ' 独立遊撃小隊' : '';
 document.getElementById('sp-subtitle').textContent =
 `${PC.race.toUpperCase()} ${PC.type==='warrior'?' WARRIOR':PC.type==='rogue'?' ROGUE':' WIZARD'} Lv${PC.level}`;

 document.getElementById('sp-age').textContent = `${age}歳`;
 document.getElementById('sp-birthday').textContent =
 `誕生: ${PC.birthYear}年 ${MONTHS_JP[PC.birthMonth-1]} ${PC.birthDay}日`;
 // 身長・体重（既存キャラで未設定ならハイフン表示）
 const spSizeEl = document.getElementById('sp-size');
 if(spSizeEl){
  spSizeEl.textContent = `身長 ${PC.height!=null ? PC.height+'cm' : '-'}　体重 ${PC.weight!=null ? PC.weight+'kg' : '-'}`;
 }
 document.getElementById('sp-lifespan-lbl').textContent =
 `寿命 ${lifespan}歳（余命 ${Math.max(0,lifespan-age)}年）`;
 const bar = document.getElementById('sp-life-bar');
 bar.style.width = lifePct+'%';
 bar.style.background = `linear-gradient(90deg,var(--nature2),${lifeColor})`;

 // 能力値
 const attrEl = document.getElementById('sp-attrs');
 attrEl.innerHTML = '';
 [
 ['強さ', PC.st, PC.maxSt],
 ['知力', PC.iq, null],
 ['運', PC.lk, null],
 ['体力', PC.con, PC.maxCon],
 ['器用さ', PC.dex, null],
 ['魅力', PC.chr, null],
 ['素早さ', PC.spd, null],
 ].forEach(([label, val, max])=>{
 const pct = max ? Math.max(0, val/max*100) : null;
 const color = max ? (pct>50?'var(--white)':pct>25?'var(--grn)':pct>0?'var(--yel)':'var(--red)') : 'var(--white)';
 const d = document.createElement('div');
 d.style.cssText = 'background:var(--panel);border:1px solid var(--panel2);border-radius:3px;padding:6px 8px';
 d.innerHTML = `<div style="font-size:calc(var(--font-sm) - 1px);color:#c8b8a0;margin-bottom:3px">${label}</div>
 <div style="font-size:calc(var(--font-base) + 1px);color:${color}">${val}${max?`<span style="font-size:calc(var(--font-sm) - 1px);color:#c8b8a0">/${max}</span>`:''}</div>`;
 attrEl.appendChild(d);
 });

 // 戦闘値
 const adds = calcAdds();
 const {cur: wtCur, max: wtMax, over: wtOver} = checkWeightPenalty();
 const cbtEl = document.getElementById('sp-combat');
 cbtEl.innerHTML = '';
 [
 ['戦闘力修正', (adds>=0?'+':'')+adds, 'var(--white)'],
 ['防護値', effectiveArmor()+'hits','var(--white)'],
 ['積載量', wtMax+'wu', 'var(--white)'],
 ].forEach(([l,v,c])=>{
 const d = document.createElement('div');
 d.style.cssText = 'background:var(--panel);border:1px solid var(--panel2);border-radius:3px;padding:6px 8px;text-align:center';
 d.innerHTML = `<div style="font-size:calc(var(--font-sm) - 1px);color:#c8b8a0;margin-bottom:3px">${l}</div><div style="font-size:var(--font-base);color:${c}">${v}</div>`;
 cbtEl.appendChild(d);
 });

 // 重量状況
 const wtColor = wtOver?'var(--red)':wtCur>wtMax*0.8?'var(--ora)':'var(--grn)';
 const wtMsg = wtOver
 ? `<span style="color:#e0d0d0"> 過積載！ SPD ${PC.spdBase}→${PC.spd}（半減）</span>`
 : '';
 const wtDiv = document.createElement('div');
 wtDiv.style.cssText = 'grid-column:1/-1;background:var(--panel);border:1px solid var(--panel2);border-radius:3px;padding:6px 8px;margin-top:2px';
 wtDiv.innerHTML = `<div style="font-size:calc(var(--font-sm) - 1px);color:#c8b8a0;margin-bottom:3px">所持重量</div>
 <div style="font-size:calc(var(--font-sm) + 1px);color:${wtColor}">${wtCur} / ${wtMax} wu${wtOver?' ':''}</div>
 ${wtMsg?`<div style="font-size:calc(var(--font-sm) - 2px);margin-top:3px">${wtMsg}</div>`:''}`;
 cbtEl.appendChild(wtDiv);

 // 冒険
 const advEl = document.getElementById('sp-adv');
 advEl.innerHTML = '';
 const foodPt = PC._food || 0;
 const foodColor = foodPt > 15 ? 'var(--white)' : foodPt > 5 ? 'var(--grn)' : foodPt > 0 ? 'var(--yel)' : 'var(--red)';
 [
 ['所持金', `${PC.gold?PC.gold+'GP ':''} ${PC.sp?PC.sp+'SP ':''} ${PC.cp?PC.cp+'CP':''}`.trim()||'0CP', 'var(--gold)'],
 ['経験値', PC.ap, 'var(--white)'],
 ['LV', PC.level, 'var(--gold)'],
 ['食料', `${foodPt}日分`, foodColor],
 ].forEach(([l,v,c])=>{
 const d = document.createElement('div');
 d.style.cssText = 'background:var(--panel);border:1px solid var(--panel2);border-radius:3px;padding:6px 8px;text-align:center';
 d.innerHTML = `<div style="font-size:calc(var(--font-sm) - 1px);color:#c8b8a0;margin-bottom:3px">${l}</div><div style="font-size:var(--font-base);color:${c}">${v}</div>`;
 advEl.appendChild(d);
 });

 // ── 装備中アイテム（指輪など） ──
 const wornEl = document.getElementById('sp-worn-items');
 if(wornEl){
 let wornHtml = '';
 if(PC._magicRing){
 wornHtml += `<div style="background:var(--panel);border:1px solid #484848;border-radius:3px;padding:8px;margin-bottom:6px;display:flex;justify-content:space-between;align-items:center">
 <div>
 <span style="font-size:var(--font-sm);color:#f0ece0"> 魔法の指輪</span>
 <span style="font-size:calc(var(--font-sm) - 2px);color:#e0d8c8;margin-left:6px">装備中　LK +10</span>
 </div>
 <button onclick="removeRing()" style="font-size:calc(var(--font-sm) - 3px);padding:4px 8px;background:#1a0e06;border:1px solid #550022;color:#e0d8c8;font-family:system-ui,sans-serif;cursor:pointer;border-radius:2px">外す</button>
 </div>`;
 }
 if(wornHtml){
 wornEl.innerHTML = `<div style="font-size:calc(var(--font-sm) - 1px);color:#c8b8a0;margin-bottom:6px">── 装備中アイテム ──</div>${wornHtml}`;
 } else {
 wornEl.innerHTML = '';
 }
 }

 // ── 背景 ──
 const bgEl = document.getElementById('sp-background');
 if(bgEl){
 const bg = PC.background || {};
 bgEl.innerHTML = bg.family || bg.motive
 ? `<div style="background:var(--panel);border:1px solid var(--panel2);border-radius:3px;padding:10px;margin-bottom:6px">
 <div style="font-size:calc(var(--font-sm) - 2px);color:#e8e0d8;margin-bottom:5px"> 出自</div>
 <div style="font-size:var(--font-sm);color:var(--text);line-height:2">${bg.family||'不明'}</div>
 </div>
 <div style="background:var(--panel);border:1px solid var(--panel2);border-radius:3px;padding:10px">
 <div style="font-size:calc(var(--font-sm) - 2px);color:#e8e0d8;margin-bottom:5px"> 動機</div>
 <div style="font-size:var(--font-sm);color:var(--text);line-height:2">${bg.motive||'不明'}</div>
 </div>`
 : '<div style="font-size:var(--font-sm);color:#c8b8a0">背景は設定されていません。</div>';
 }

 // ── 言語 ──
 const langEl = document.getElementById('sp-languages');
 if(langEl){
 const langs = PC.languages && PC.languages.length ? PC.languages : ['共通語'];
 langEl.innerHTML = `<div style="font-size:calc(var(--font-sm) - 1px);color:#c8b8a0;margin-bottom:6px;margin-top:10px">── 言語 ──</div>
 <div style="background:var(--panel);border:1px solid var(--panel2);border-radius:3px;padding:10px;font-size:var(--font-sm);color:var(--text)">${langs.join('、')}</div>`;
 }

 // ── 装備タブ ──
 const btnStyle = (color,bg,border) =>
 `style="background:${bg};border:1px solid ${border};color:${color};font-family:system-ui,sans-serif;font-size:calc(var(--font-sm) - 3px);padding:4px 8px;cursor:pointer;border-radius:2px;margin-left:6px"`;

 // 武器
 const wpEl = document.getElementById('sp-weapons');
 let wpHtml = '';
 // 装備中
 if(PC.equippedWeapons.length){
 wpHtml += `<div style="font-size:calc(var(--font-sm) - 2px);color:#c8b8a0;margin-bottom:4px">── 装備中 ──</div>`;
 PC.equippedWeapons.forEach((w,i)=>{
 wpHtml += `<div style="background:var(--ink);border:1px solid #550055;border-radius:3px;padding:8px;margin-bottom:5px;display:flex;justify-content:space-between;align-items:center">
 <div>
 <div style="font-size:var(--font-sm);color:#f0ece0"> ${w.name}</div>
 <div style="font-size:calc(var(--font-sm) - 2px);color:#c8b8a0">${w.dice}D+${w.adds}　${w.twoHand?'両手':'片手'}</div>
 </div>
 <button onclick="unequipWeapon(${i})" ${btnStyle('#e0d8c8','#1a1a1a','#484848')}>外す</button>
 </div>`;
 });
 }
 // 所持（未装備）
 const uninvW = PC.invWeapons.filter(w=>!PC.equippedWeapons.includes(w) && !w.isRanged);
 if(uninvW.length){
 wpHtml += `<div style="font-size:calc(var(--font-sm) - 2px);color:#c8b8a0;margin:6px 0 4px">── 所持（未装備）──</div>`;
 uninvW.forEach(w=>{
 const idx = PC.invWeapons.indexOf(w);
 const check = canEquipWeapon(w);
 const lookupName = w._baseName || w.name;
 const def = [...WEAPONS_TABLE,...WEAPONS_TABLE_KHAZAN,...WEAPONS_TABLE_ELSIA,...WEAPONS_TABLE_AL_RASHID,...WEAPONS_TABLE_YELDUN,...WEAPONS_TABLE_VALDHEIM,...WEAPONS_TABLE_NERIA].find(t=>t.name===lookupName);
 const sellBtn = isShopOpen() && (def || w._isMagic)
 ? (w._isMagic && w._priceGP
   ? `<button onclick="sellWeapon(${idx})" ${btnStyle('var(--gold4)','var(--coal)','var(--mud)')}>売 ${Math.floor(w._priceGP*0.5)}GP</button>`
   : def ? `<button onclick="sellWeapon(${idx})" ${btnStyle('var(--gold4)','var(--coal)','var(--mud)')}>売 ${sellPriceLabel(def.cost)}</button>` : '')
 : '';
 const displayName = w.name;
 const baseLabel = w._baseName ? `<span style="font-size:calc(var(--font-sm) - 3px);color:#d8d0c0">（${w._baseName}）</span>` : '';
 wpHtml += `<div style="background:var(--panel);border:1px solid var(--void);border-radius:3px;padding:8px;margin-bottom:5px">
 <div style="display:flex;justify-content:space-between;align-items:center">
 <div>
 <div style="font-size:var(--font-sm);color:#c8b8a0"> ${displayName} ${baseLabel}</div>
 <div style="font-size:calc(var(--font-sm) - 2px);color:#d8d0c0">${w.dice}D+${w.adds}　${w.twoHand?'両手':'片手'}</div>
 </div>
 <div style="display:flex;gap:4px">
 <button onclick="equipWeapon(${idx})" ${check.ok?btnStyle('var(--nature2)','#0e1006','var(--rust)'):`disabled ${btnStyle('#444','#111','#a0a0a0')}`}>${check.ok?'装備':'不可'}</button>
 ${sellBtn}
 <button onclick="discardWeapon(${idx})" ${btnStyle('#c89090','#150808','#5a3030')}>捨てる</button>
 </div>
 </div>
 <button onclick="renameWeapon(${idx})" style="margin-top:6px;width:100%;background:none;border:1px solid #334;color:#c0b098;font-family:system-ui,sans-serif;font-size:calc(var(--font-sm) - 2px);padding:4px;cursor:pointer;border-radius:3px"> 名前を変更</button>
 </div>`;
 });
 }
 // 遠距離武器スロット
 const rngEl = document.getElementById('sp-weapons');
 let rngHtml = '';
 const rngW = PC.equippedRanged || null;
 rngHtml += `<div style="font-size:calc(var(--font-sm) - 2px);color:#e0d8c8;margin-bottom:4px;margin-top:8px">── 遠距離武器スロット ──</div>`;
 if(rngW){
  rngHtml += `<div style="background:var(--ink);border:1px solid #484848;border-radius:3px;padding:8px;margin-bottom:5px;display:flex;justify-content:space-between;align-items:center">
  <div>
  <div style="font-size:var(--font-sm);color:#e0d8c8"> ${rngW.name}</div>
  <div style="font-size:calc(var(--font-sm) - 2px);color:#c8b8a0">${rngW.dice}D+${rngW.adds}　${rngW.isRanged?'弓':'投擲'}</div>
  </div>
  <button onclick="unequipRanged()" ${btnStyle('#e0d8c8','#1a1a1a','#484848')}>外す</button>
  </div>`;
 } else {
  rngHtml += `<div style="font-size:calc(var(--font-sm) - 2px);color:var(--white2);padding:6px">（なし）</div>`;
 }
 // 遠距離装備可能な所持武器を表示
 const rangedCandidates = PC.type === 'wizard' ? [] : PC.invWeapons.filter(w=>isRangedWeapon(w) && !(PC.equippedRanged && PC.equippedRanged.name===w.name));
 rangedCandidates.forEach(w=>{
  const idx = PC.invWeapons.indexOf(w);
  rngHtml += `<div style="background:var(--panel);border:1px solid #224;border-radius:3px;padding:6px;margin-bottom:4px;display:flex;justify-content:space-between;align-items:center">
  <div style="font-size:var(--font-sm);color:#c8b8a0"> ${w.name} <span style="color:var(--white2);font-size:calc(var(--font-sm) - 2px)">${w.dice}D+${w.adds}</span></div>
  <button onclick="equipRanged(${idx})" ${btnStyle('var(--white2)','var(--info-bg)','var(--info-border)')}>遠距離装備</button>
  </div>`;
 });

 wpEl.innerHTML = wpHtml || '<div style="font-size:var(--font-sm);color:#c8b8a0">武器なし（素手 1D）</div>';
 wpEl.innerHTML += rngHtml;

 // 防具
 const arEl = document.getElementById('sp-armor');
 const isWarrior = PC.type==='warrior';
 let arHtml = '';
 // 装備中
 if(PC.equippedArmors.length){
 arHtml += `<div style="font-size:calc(var(--font-sm) - 2px);color:#c8b8a0;margin-bottom:4px">── 装備中 ──</div>`;
 PC.equippedArmors.forEach((a,i)=>{
 const eff = isWarrior ? a.hits*2 : a.hits;
 arHtml += `<div style="background:var(--ink);border:1px solid #585858;border-radius:3px;padding:8px;margin-bottom:5px;display:flex;justify-content:space-between;align-items:center">
 <div>
 <div style="font-size:var(--font-sm);color:#ece8e0">${a.isShield?'':''} ${a.name}</div>
 <div style="font-size:calc(var(--font-sm) - 2px);color:#c8b8a0">${a.hits}hits${isWarrior?` →${eff}hits(×2)`:''}${a.isShield?' [シールド]':''}</div>
 </div>
 <button onclick="unequipArmor(${i})" ${btnStyle('#e0d8c8','#1a1a1a','#484848')}>外す</button>
 </div>`;
 });
 arHtml += `<div style="font-size:calc(var(--font-sm) - 1px);color:#ece8e0;padding:4px 0">合計防護: ${effectiveArmor()}hits</div>`;
 }
 // 所持（未装備）
 const uninvA = PC.invArmors.filter(a=>!PC.equippedArmors.includes(a));
 if(uninvA.length){
 arHtml += `<div style="font-size:calc(var(--font-sm) - 2px);color:#c8b8a0;margin:6px 0 4px">── 所持（未装備）──</div>`;
 uninvA.forEach(a=>{
 const idx = PC.invArmors.indexOf(a);
 const check = canEquipArmor(a);
 const def = [...ARMOR_TABLE,...(ARMOR_TABLE_KHAZAN||[])].find(t=>t.name===a.name);
 const sellBtn = isShopOpen() && def
 ? `<button onclick="sellArmor(${idx})" ${btnStyle('var(--gold4)','var(--coal)','var(--mud)')}>売 ${sellPriceLabel(def.cost)}</button>`
 : '';
 arHtml += `<div style="background:var(--panel);border:1px solid var(--deep);border-radius:3px;padding:8px;margin-bottom:5px;display:flex;justify-content:space-between;align-items:center">
 <div>
 <div style="font-size:var(--font-sm);color:#c8b8a0">${a.isShield?'':''} ${a.name}</div>
 <div style="font-size:calc(var(--font-sm) - 2px);color:#c8b8a0">${a.hits}hits${a.isShield?' [シールド]':''}</div>
 </div>
 <div style="display:flex;gap:4px">
 <button onclick="equipArmor(${idx})" ${check.ok?btnStyle('var(--nature2)','#0e1006','var(--rust)'):`disabled ${btnStyle('#444','#111','#a0a0a0')}`}>${check.ok?'装備':check.reason.length>6?'不可':check.reason}</button>
 ${sellBtn}
 <button onclick="discardArmor(${idx})" ${btnStyle('#c89090','#150808','#5a3030')}>捨てる</button>
 </div>
 </div>`;
 });
 }
 arEl.innerHTML = arHtml || '<div style="font-size:var(--font-sm);color:#c8b8a0">防具なし（0hits）</div>';

 // 衣服スロット
 const eqEl = document.getElementById('sp-equip');
 let eqHtml = '';
 if(PC.invClothing || PC.equippedClothing){
  const cName = PC.invClothingName||'防寒着と荷物袋';
  const equipped = PC.equippedClothing;
  const cDef = EQUIP_TABLE.find(t=>t.name===cName)||EQUIP_TABLE.find(t=>t.name==='防寒着と荷物袋');
  const sellBtn = isShopOpen() && cDef && !equipped
   ? `<button onclick="sellClothing()" ${btnStyle('var(--gold4)','var(--coal)','var(--mud)')}>売 ${sellPriceLabel(cDef.cost)}</button>` : '';
  eqHtml += `<div style="background:${equipped?'var(--info-bg)':'var(--panel)'};border:1px solid ${equipped?'var(--info-border)':'var(--deep)'};border-radius:3px;padding:8px;margin-bottom:5px;display:flex;justify-content:space-between;align-items:center">
  <div>
  <div style="font-size:var(--font-sm);color:${equipped?'var(--cyn)':'var(--dim)'}"> ${cName}${equipped?' [装備中]':''}</div>
  </div>
  <div style="display:flex;gap:4px">
  ${equipped
   ? `<button onclick="unequipClothing()" ${btnStyle('#e0d8c8','#1a1a1a','#484848')}>外す</button>`
   : `<button onclick="equipClothing()" ${btnStyle('var(--nature2)','#0e1006','var(--rust)')}>装備</button>`
  }
  ${sellBtn}
  </div>
  </div>`;
 }
 // 靴
 if(PC.invBoots || PC.equippedBoots){
 const bootsDisplayName = PC.invBootsName || 'ブーツ';
 const equipped = PC.equippedBoots;
 const bootsDef = EQUIP_TABLE.find(t=>t.name===bootsDisplayName) || EQUIP_TABLE.find(t=>t.name==='ブーツ');
 const sellBtn = isShopOpen() && bootsDef && !equipped
 ? `<button onclick="sellBoots()" ${btnStyle('var(--gold4)','var(--coal)','var(--mud)')}>売 ${sellPriceLabel(bootsDef.cost)}</button>`
 : '';
 eqHtml += `<div style="background:${equipped?'var(--info-bg)':'var(--panel)'};border:1px solid ${equipped?'#004444':'var(--deep)'};border-radius:3px;padding:8px;margin-bottom:5px;display:flex;justify-content:space-between;align-items:center">
 <div>
 <div style="font-size:var(--font-sm);color:${equipped?'var(--cyn)':'var(--dim)'}"> ${bootsDisplayName}${equipped?' [装備中]':''}</div>
 </div>
 <div style="display:flex;gap:4px">
 ${equipped
 ? `<button onclick="unequipBoots()" ${btnStyle('#e0d8c8','#1a1a1a','#484848')}>外す</button>`
 : `<button onclick="equipBoots()" ${btnStyle('var(--nature2)','#0e1006','var(--rust)')}>装備</button>`
 }
 ${sellBtn}
 </div>
 </div>`;
 }
 // 予備の靴（ブーツとサンダルは別々に数える）
 FOOTWEAR_NAMES.forEach(n=>{
  const cnt = spareFootwearCount(n);
  if(cnt <= 0) return;
  const sDef = EQUIP_TABLE.find(t=>t.name===n);
  const wearBtn = !PC.invBoots ? `<button onclick="wearSpareFootwearUI('${n}')" ${btnStyle('var(--nature2)','#0e1006','var(--rust)')}>履く</button>` : '';
  const sSell = isShopOpen() && sDef ? `<button onclick="sellSpareFootwear('${n}')" ${btnStyle('var(--gold4)','var(--coal)','var(--mud)')}>売 ${sellPriceLabel(sDef.cost)}</button>` : '';
  eqHtml += `<div style="background:var(--panel);border:1px solid var(--deep);border-radius:3px;padding:8px;margin-bottom:5px;display:flex;justify-content:space-between;align-items:center">
  <div><div style="font-size:var(--font-sm);color:var(--dim)"> 予備の${n} ×${cnt}</div></div>
  <div style="display:flex;gap:4px">${wearBtn}${sSell}</div>
  </div>`;
 });
 // その他所持品
 if(PC.invEquip && PC.invEquip.length){
 PC.invEquip.forEach((e, idx)=>{
 const def = EQUIP_TABLE.find(t=>t.name===e);
 const sellBtn = isShopOpen() && def
 ? `<button onclick="sellEquip(${idx})" ${btnStyle('var(--gold4)','var(--coal)','var(--mud)')}>売 ${sellPriceLabel(def.cost)}</button>`
 : '';
 eqHtml += `<div style="background:var(--panel);border:1px solid var(--deep);border-radius:3px;padding:8px;margin-bottom:5px;display:flex;justify-content:space-between;align-items:center">
 <div style="font-size:var(--font-sm);color:var(--text)"> ${e}</div>
 ${sellBtn}
 </div>`;
 });
 }
 // 松明
 if((PC._torchStock || 0) > 0 || PC._torchTurns > 0){
 const total = (PC._torchStock || 0) + (PC._torchTurns > 0 ? 1 : 0);
 const torchDef = EQUIP_TABLE.find(t=>t.name==='松明');
 const sellBtn = isShopOpen() && torchDef
 ? `<button onclick="sellTorch()" ${btnStyle('var(--gold4)','var(--coal)','var(--mud)')}>売 ${sellPriceLabel(torchDef.cost)}</button>`
 : '';
 eqHtml += `<div style="background:var(--panel);border:1px solid var(--deep);border-radius:3px;padding:8px;margin-bottom:5px;display:flex;justify-content:space-between;align-items:center">
 <div style="font-size:var(--font-sm);color:var(--text)"> 松明 ×${total}本</div>
 ${sellBtn}
 </div>`;
 }
 eqEl.innerHTML = eqHtml || '<div style="font-size:var(--font-sm);color:#c8b8a0">なし</div>';

 // 所持金を捨てる
 const eqMoneyEl = document.getElementById('sp-equip-money');
 if(eqMoneyEl){
  eqMoneyEl.innerHTML = `<div style="font-size:calc(var(--font-sm) - 1px);color:#c8b8a0;margin-bottom:6px;margin-top:10px">── 所持金 ──</div>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:4px">
   <button onclick="discardCurrency('gold')" style="background:#150808;border:1px solid #5a3030;color:#c89090;font-family:system-ui,sans-serif;font-size:calc(var(--font-sm) - 2px);padding:7px 2px;cursor:pointer;border-radius:3px">GPを捨てる</button>
   <button onclick="discardCurrency('sp')" style="background:#150808;border:1px solid #5a3030;color:#c89090;font-family:system-ui,sans-serif;font-size:calc(var(--font-sm) - 2px);padding:7px 2px;cursor:pointer;border-radius:3px">SPを捨てる</button>
   <button onclick="discardCurrency('cp')" style="background:#150808;border:1px solid #5a3030;color:#c89090;font-family:system-ui,sans-serif;font-size:calc(var(--font-sm) - 2px);padding:7px 2px;cursor:pointer;border-radius:3px">CPを捨てる</button>
  </div>`;
 }

 // 宝飾品
 const jewelsWrap = document.getElementById('sp-jewels-wrap');
 const jewelsEl   = document.getElementById('sp-jewels');
 const jewels = PC.invJewels || [];
 if(jewelsWrap){
  if(jewels.length){
   jewelsWrap.style.display = '';
   jewelsEl.innerHTML = jewels.map((j,i)=>{
    const sellVal = Math.floor(j.priceGP * 0.5);
    const sellBtn = isShopOpen()
     ? `<button onclick="sellJewel(${i})" ${btnStyle('var(--gold4)','var(--coal)','var(--mud)')}>売 ${sellVal}GP</button>`
     : '';
    return `<div style="background:var(--panel);border:1px solid var(--void);border-radius:3px;padding:8px;margin-bottom:5px;display:flex;justify-content:space-between;align-items:center">
    <div>
     <div style="font-size:var(--font-sm);color:#f0ece0"> ${j.name}</div>
     <div style="font-size:calc(var(--font-sm) - 2px);color:#c8b8a0">売値 ${sellVal}GP</div>
    </div>
    ${sellBtn}
    </div>`;
   }).join('');
  } else {
   jewelsWrap.style.display = 'none';
  }
 }

 // 特産品
 const specialsWrap = document.getElementById('sp-specials-wrap');
 const specialsEl   = document.getElementById('sp-specials');
 const specs = PC.invSpecialties || [];
 if(specialsWrap){
  if(specs.length){
   specialsWrap.style.display = '';
   specialsEl.innerHTML = specs.map((sp,i)=>{
    return `<div style="background:var(--panel);border:1px solid #505050;border-radius:3px;padding:8px;margin-bottom:5px;display:flex;justify-content:space-between;align-items:center">
    <div>
     <div style="font-size:var(--font-sm);color:var(--white)">${sp.icon||''} ${sp.name}</div>
     <div style="font-size:calc(var(--font-sm) - 2px);color:#c8b8a0">仕入 ${sp.boughtAt}GP　重 ${sp.weight}wu</div>
    </div>
    </div>`;
   }).join('');
  } else {
   specialsWrap.style.display = 'none';
  }
 }

 // 呪文
 const spWrap = document.getElementById('sp-spells-wrap');
 if(PC.spells.length){
 spWrap.style.display = '';
 document.getElementById('sp-spells').innerHTML = PC.spells.map(s=>
 `<div style="background:#100c06;border:1px solid #585858;border-radius:3px;padding:8px;margin-bottom:5px">
 <div style="font-size:var(--font-sm);color:#f0ece0;margin-bottom:3px"> ${s.name} <span style="color:#e0d0d0;font-size:calc(var(--font-sm) - 1px)">強さ-${s.cost}</span></div>
 <div style="font-size:calc(var(--font-sm) - 1px);color:#e8e0d0">${s.desc}</div>
 </div>`
 ).join('');
 } else {
 spWrap.style.display = 'none';
 }

 // ── ライフイベント記録 ──

// ── 記録タブ ──
 document.getElementById('sp-location').innerHTML =
 `<div style="font-size:calc(var(--font-sm) + 1px);color:#f0ece0"> ${townName}</div>`;

 const cur = getCurrentDate();
 document.getElementById('sp-date').innerHTML =
 `<div style="font-size:calc(var(--font-sm) + 1px);color:#ece8e0">${formatDate(cur)}</div>
 <div style="font-size:calc(var(--font-sm) - 1px);color:#c8b8a0;margin-top:5px">経過日数: ${GAME_TIME.totalDays}日</div>`;

 // 受注中の依頼
 const activeQuests = (PC.quests||[]).filter(q=>q.status==='active');
 const qEl = document.getElementById('sp-quests');
 if(activeQuests.length){
 qEl.innerHTML = activeQuests.map(q=>{
 const remain = q.deadlineDays - (GAME_TIME.totalDays - q.issuedDay);
 const urgColor = remain<=5?'var(--red)':remain<=10?'var(--ora)':'var(--grn)';
 if(q.type==='hunt'){
  const totalCount = (q.rooms||[]).reduce((s,r)=>s+r.count,0);
  return `<div style="background:#0a0800;border:1px solid var(--mud);border-radius:3px;padding:9px;margin-bottom:6px">
  <div style="font-size:var(--font-sm);color:#e8e0d0;margin-bottom:4px"> 討伐：${q.caveName||'洞穴'}</div>
  <div style="font-size:calc(var(--font-sm) - 1px);color:#c8b8a0;margin-bottom:2px">${q.monsterName} ×${totalCount}体</div>
  <div style="font-size:calc(var(--font-sm) - 1px)">報酬: <span style="color:#f0ece0">${q.reward}GP</span>　残り: <span style="color:${urgColor}">${remain}日</span></div>
  </div>`;
 }
 if(q.type==='purchase'){
  const regionName = {khazan_region:'カザーヌ',elmaria_region:'エルマリア',zahara_region:'ザハラ',draklim_region:'ドラクリム'}[q.targetRegion]||q.targetRegion;
  return `<div style="background:var(--info-bg);border:1px solid #484848;border-radius:3px;padding:9px;margin-bottom:6px">
  <div style="font-size:var(--font-sm);color:#f0ece0;margin-bottom:4px">${q.specIcon||''} ${regionName}の買い付け</div>
  <div style="font-size:calc(var(--font-sm) - 1px);color:#c8b8a0;margin-bottom:2px">「${q.specName}」を購入して持ち帰る</div>
  <div style="font-size:calc(var(--font-sm) - 1px)">報酬: <span style="color:#f0ece0">${q.reward}GP</span>　残り: <span style="color:${urgColor}">${remain}日</span></div>
  </div>`;
 }
 const destTown = TOWNS[q.toTownId]||{name:q.toTownId||'?'};
 if(q.type==='escort'){
  return `<div style="background:var(--ink);border:1px solid #484848;border-radius:3px;padding:9px;margin-bottom:6px">
  <div style="font-size:var(--font-sm);color:#e0d8c8;margin-bottom:4px"> 護衛依頼</div>
  <div style="font-size:calc(var(--font-sm) - 1px);color:#c8b8a0;margin-bottom:2px">${q.escortName}を${destTown.name}へ護衛する</div>
  <div style="font-size:calc(var(--font-sm) - 1px)">報酬: <span style="color:#f0ece0">${q.reward}GP</span>　残り: <span style="color:${urgColor}">${remain}日</span></div>
  </div>`;
 }
 if(q.type==='bounty' || q.type==='assassination' || q.type==='kidnapping'){
  const titleLabel = {bounty:' 賞金首討伐', assassination:' 暗殺依頼', kidnapping:' 誘拐依頼'}[q.type];
  const actionLabel = {bounty:'討伐する', assassination:'始末する', kidnapping:'連れ去る'}[q.type];
  const targetTownName = (TOWNS[q.targetTownId]||{name:q.targetTownId||q.fromTownId}).name;
  return `<div style="background:var(--info-bg);border:1px solid #484848;border-radius:3px;padding:9px;margin-bottom:6px">
  <div style="font-size:var(--font-sm);color:#f0ece0;margin-bottom:4px">${titleLabel}：${q.targetTitle||q.targetName||'対象'}</div>
  <div style="font-size:calc(var(--font-sm) - 1px);color:#c8b8a0;margin-bottom:2px">${targetTownName}にいる${q.targetNPC?.name||q.targetName||'?'}を${actionLabel}</div>
  <div style="font-size:calc(var(--font-sm) - 1px)">報酬: <span style="color:#f0ece0">${q.reward}GP</span>　残り: <span style="color:${urgColor}">${remain}日</span></div>
  </div>`;
 }
 return `<div style="background:var(--info-bg);border:1px solid #484848;border-radius:3px;padding:9px;margin-bottom:6px">
 <div style="font-size:var(--font-sm);color:#f0ece0;margin-bottom:4px">${q.destIcon||''} ${destTown.name}の${q.destLabel||'配達'}</div>
 <div style="font-size:calc(var(--font-sm) - 1px);color:#c8b8a0;margin-bottom:2px">${q.receiverName||'?'}に「${q.item||'荷物'}」</div>
 <div style="font-size:calc(var(--font-sm) - 1px)">報酬: <span style="color:#f0ece0">${q.reward}GP</span>　残り: <span style="color:${urgColor}">${remain}日</span></div>
 </div>`;
 }).join('');
 } else {
 qEl.innerHTML = `<div style="font-size:var(--font-sm);color:#c8b8a0">受注中の依頼なし</div>`;
 }

 // 地方ごとの評価
 const evEl = document.getElementById('sp-region-eval');
 if(evEl){
  const rows = Object.entries(HERO_REGIONS).map(([regionKey, region])=>{
   const top = getRegionTopQuestType(regionKey);
   if(!top) return null;
   return `<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #2a1e10">
    <span style="font-size:calc(var(--font-sm) - 1px);color:#c8b8a0">${region.name}</span>
    <span style="font-size:calc(var(--font-sm) - 1px);color:#f0ece0">${top.label}<span style="color:#a89880">（${top.count}件）</span></span>
   </div>`;
  }).filter(Boolean);
  evEl.innerHTML = rows.length ? rows.join('') : `<div style="font-size:var(--font-sm);color:#c8b8a0">まだ評価はない</div>`;
 }

 // ライフイベント
 const leEl = document.getElementById('sp-life-events');
 if(leEl){
  const events = PC.lifeEvents||[];
  if(events.length){
   leEl.innerHTML = events.map(e=>`
    <div style="display:flex;gap:6px;align-items:flex-start;padding:6px 0;border-bottom:1px solid #2a1e10">
     <span style="font-size:var(--font-base);line-height:1.2">${e.icon}</span>
     <div>
      <div style="font-size:calc(var(--font-sm) - 1px);color:#f4ede0">${e.text}</div>
      <div style="font-size:calc(var(--font-sm) - 3px);color:#c8b8a0;margin-top:2px">${e.date}</div>
     </div>
    </div>`).join('');
  } else {
   leEl.innerHTML = `<div style="font-size:var(--font-sm);color:#c8b8a0">まだ記録はない</div>`;
  }
 }

 const raceInfoMap = {
 human: '全能力値 ×1（補正なし）。寿命80年前後。',
 elf: '知力・器用さ ×3/2、体力 ×2/3。寿命800年前後。',
 dwarf: '強さ・体力 ×2、魅力 ×2/3。寿命200年前後。',
 halfling: '強さ ×1/2、体力 ×2、器用さ ×3/2。寿命100年前後。',
 fairy: '強さ・体力 ×1/4、運・器用さ ×3/2、魅力 ×2。寿命200年前後。',
 leprechaun: 'ST ×1/2、IQ・LK・DEX ×3/2。寿命300年前後。',
 };
 const alEl = document.getElementById('sp-alignment');
 if(alEl) alEl.innerHTML = renderAlignmentWidget(PC.alignment_ethics, PC.alignment_order);
 document.getElementById('sp-race-info').innerHTML =
 `<div style="font-size:var(--font-sm);color:var(--text);line-height:2.2">${raceInfoMap[PC.race]||''}</div>
 <div style="font-size:calc(var(--font-sm) - 1px);color:#c8b8a0;margin-top:6px">衰え開始: ${params.declineStart}歳〜（5年毎に全能力値-1）</div>`;
}

function toggleLifeNarrative(){
 const panel = document.getElementById('sp-life-narrative');
 const btn = document.getElementById('life-narrative-btn');
 if(panel.style.display !== 'none'){
  panel.style.display = 'none';
  btn.innerHTML = ' 人生を振り返る';
  return;
 }
 panel.innerHTML = generateLifeNarrative();
 panel.style.display = '';
 btn.innerHTML = '▲ 閉じる';
}

function generateLifeNarrative(){
 const DAYS_PER_YEAR = 365;
 const events = (PC.lifeEvents||[]).slice().reverse(); // 古い順
 if(!events.length) return '<span style="color:#c8b8a0">まだ語るべき物語はない。</span>';

 const name = PC.name || '冒険者';
 const raceMap = {human:'人間',elf:'エルフ',dwarf:'ドワーフ',halfling:'ハーフリング',fairy:'フェアリー',leprechaun:'レプラコーン',troll:'トロール',ogre:'オーガ',orc:'オーク',goblin:'ゴブリン'};
 const typeMap = {warrior:'戦士',rogue:'盗賊',wizard:'魔法使い'};
 const race = raceMap[PC.race]||PC.race;
 const type = typeMap[PC.type]||PC.type;

 // イベントカテゴリ分類
 // personal=個別記述, aggregate=集約カウント
 function categorize(text){
  if(/結婚/.test(text))                          return {cat:'marriage',   mode:'personal'};
  if(/生まれた/.test(text))                       return {cat:'birth',      mode:'personal'};
  if(/パーティ.*加わ|パーティに加わ/.test(text))  return {cat:'join',       mode:'personal'};
  if(/パーティを離れ|去った/.test(text))          return {cat:'leave',      mode:'personal'};
  if(/亡くな|老衰/.test(text))                    return {cat:'death',      mode:'personal'};
  if(/埋葬/.test(text))                           return {cat:'burial',     mode:'personal'};
  if(/英雄|祝福|認められ/.test(text))             return {cat:'hero',       mode:'personal'};
  if(/大飢饉/.test(text))                         return {cat:'famine',     mode:'personal'};
  if(/壊疽|疫病|感染/.test(text))                 return {cat:'injury',     mode:'personal'};
  if(/逮捕|勾留|労働|罰金/.test(text))            return {cat:'crime',      mode:'personal'};
  if(/賞金首/.test(text))                         return {cat:'bounty',     mode:'aggregate'};
  if(/討伐完了|討伐.*依頼|討伐した/.test(text))   return {cat:'hunt',       mode:'aggregate'};
  if(/依頼.*達成|英雄依頼/.test(text))            return {cat:'quest',      mode:'aggregate'};
  if(/購入|拡張|拠点/.test(text))                 return {cat:'property',   mode:'aggregate'};
  if(/離れ|去っていった/.test(text))              return {cat:'farewell',   mode:'personal'};
  return {cat:'other', mode:'personal'};
 }

 // 集約カウントから文章生成
 function aggregateToText(counts){
  const parts = [];
  if(counts.bounty > 0)   parts.push(counts.bounty+'人の賞金首を討伐した');
  if(counts.hunt > 0)     parts.push(counts.hunt+'件の討伐依頼を達成した');
  if(counts.quest > 0)    parts.push(counts.quest+'件の英雄依頼を果たした');
  if(counts.property > 0) parts.push(counts.property+'件の拠点整備を行った');
  if(!parts.length) return '';
  return parts.join('。')+'。';
 }

 // 個別イベントのテンプレート（各3種類）
 const T = {
  marriage: [
   '{t}。運命の出会いが、その後の人生を変えた。',
   '{t}——新たな絆が結ばれた。',
   'やがて{t}。共に歩む者を得た。',
  ],
  birth: [
   '{t}。新しい命が、その人生に彩りを添えた。',
   '{t}——喜びの知らせだった。',
   '{t}。この世界に、また一つの物語が始まった。',
  ],
  join: [
   '新たな旅の仲間を得た。{t}',
   '{t}——心強い同行者だった。',
   '{t}。以来、その背中を隣で見てきた。',
  ],
  leave: [
   '{t}。別れは常に突然にやってくる。',
   '{t}——そうして道は分かれた。',
   '{t}。その後の消息は、風のうわさでしか聞かなかった。',
  ],
  death: [
   '{t}。悲しみの中、前へと進むほかなかった。',
   '{t}——その喪失は深い傷を残した。',
   '{t}。その死を、長く心に抱えて歩き続けた。',
  ],
  burial: [
   '{t}。',
   '{t}——せめてもの弔いだった。',
   '{t}。土に還るその日まで、忘れることはないだろう。',
  ],
  hero: [
   '{t}——長い旅の果てに掴んだ栄誉だった。',
   '{t}。この功績は各地で語られることになる。',
   '{t}——冒険者として一つの頂に辿り着いた。',
   '{t}。その名は酒場でも噂されるようになった。',
   '{t}。人々はその勇気を称えた。',
  ],
  famine: [
   '大地が荒れた年があった。{t}',
   '{t}——過酷な時代だった。',
   '{t}。飢えと渇きの中で、それでも前へ歩んだ。',
  ],
  injury: [
   'だが、{t}。それでも歩みを止めなかった。',
   '苦境に立たされた。{t}',
   '{t}——傷を抱えながら、旅は続いた。',
  ],
  crime: [
   'しかし、{t}。試練の日々が続いた。',
   '苦難の時が訪れた。{t}',
   '{t}。その代償は、決して小さくなかった。',
  ],
  farewell: [
   '{t}。',
   '{t}——そうして道は分かれた。',
   '{t}。去りゆく背中を、しばらく見送った。',
  ],
  other: [
   '{year}年、{t}',
   '{year}年、{t}',
   '{year}年、{t}',
  ],
 };
 function pick(arr){ return arr[Math.floor(Math.random()*arr.length)]; }

 // 年文字列を抽出（「408年 12月 5日」→「408」）
 function extractYear(dateStr){
  const m = (dateStr||'').match(/(\d+)年/);
  return m ? m[1] : '';
 }

 // 重複するotherイベントをまとめ、年付き表現でbuild
 function buildPersonalSentences(evList){
  // otherカテゴリの連続重複をまとめる
  const merged = [];
  evList.forEach(ev=>{
   if(ev.cat === 'other'){
    const last = merged[merged.length-1];
    if(last && last.cat === 'other' && last.text === ev.text){
     last.count = (last.count||1) + 1;
    } else {
     merged.push({...ev, count:1});
    }
   } else {
    merged.push({...ev, count:1});
   }
  });

  const result = [];
  merged.forEach(ev=>{
   const tmpl = T[ev.cat];
   if(!tmpl){ result.push(ev.text+'。'); return; }
   const year = extractYear(ev.date||'');
   if(ev.cat === 'other'){
    const base = ev.count > 1 ? `${ev.count}回、${ev.text}` : ev.text;
    result.push(pick(tmpl).replace('{year}', year||'').replace('{t}', base));
   } else {
    result.push(pick(tmpl).replace('{t}', ev.text));
   }
  });
  return result.join('');
 }

 // 冒険開始日・現在日から章幅を計算
 const startDay = events[0].day;
 const endDay   = events[events.length-1].day;
 const totalYears = Math.max(1, Math.ceil((endDay - startDay) / DAYS_PER_YEAR));
 const periodYears = Math.max(1, Math.round(totalYears / 5));

 // イベントを章ごとにグループ化
 function getChapterIdx(day){
  const yr = Math.floor((day - startDay) / DAYS_PER_YEAR);
  return Math.floor(yr / periodYears);
 }
 const chapters = [];
 events.forEach(ev=>{
  const idx = getChapterIdx(ev.day);
  if(!chapters[idx]) chapters[idx] = {events:[], counts:{bounty:0,hunt:0,quest:0,property:0}};
  const {cat, mode} = categorize(ev.text);
  if(mode === 'personal'){
   chapters[idx].events.push({cat, text:ev.text, date:ev.date});
  } else {
   if(chapters[idx].counts[cat] !== undefined) chapters[idx].counts[cat]++;
  }
 });

 // 出力構築
 const html = [];
 // 冒頭
 const openings = [
  name+'は'+race+'の'+type+'だった。',
  'これは'+race+'の'+type+'、'+name+'の物語である。',
  race+'の'+type+'——'+name+'の歩んだ道のりを、ここに記す。',
 ];
 html.push('<p style="margin:0 0 12px 0;color:#f0ece0">'+pick(openings)+'</p>');

 chapters.forEach((ch, idx)=>{
  if(!ch) return;
  const chapStartYr = idx * periodYears + 1;
  const chapEndYr   = chapStartYr + periodYears - 1;
  const label = chapStartYr === chapEndYr
   ? '出立後'+chapStartYr+'年'
   : '出立後'+chapStartYr+'〜'+chapEndYr+'年';
  let body = '';

  // 集約テキスト
  const agg = aggregateToText(ch.counts);
  if(agg) body += agg;

  // 個別イベント（連続「ある時」処理込み）
  body += buildPersonalSentences(ch.events);

  if(!body) return;
  html.push(
   '<div style="margin:0 0 14px 0">'
   +'<div style="font-size:calc(var(--font-sm) - 2px);color:#e8e0d0;margin-bottom:4px;letter-spacing:1px">── '+label+' ──</div>'
   +'<p style="margin:0;line-height:2">'+body+'</p>'
   +'</div>'
  );
 });

 // 締め
 const closings = [
  'そして今も、'+name+'の旅は続いている。',
  'この物語に、まだ終わりはない。',
  name+'の歩みは、まだ止まっていない。',
 ];
 html.push('<p style="margin:8px 0 12px 0;color:#e8e0d0;font-style:italic">'+pick(closings)+'</p>');

 // まとめパネル
 const totalBounty = (PC.lifeEvents||[]).filter(e=>/賞金首/.test(e.text)&&/討伐/.test(e.text)).length;
 const totalHeroQ  = (PC.lifeEvents||[]).filter(e=>/英雄依頼/.test(e.text)&&/達成/.test(e.text)).length;
 const totalChildren = Object.values(PC.properties||{}).reduce((s,p)=>s+(p.children||[]).length, 0);
 const currentAge = PC.age || 0;
 const summaryRows = [];
 summaryRows.push(['名前', name]);
 summaryRows.push(['年齢', currentAge+'歳']);
 summaryRows.push([type+' Lv', PC.level||1]);
 if(totalBounty > 0)    summaryRows.push(['討伐した賞金首', totalBounty+'人']);
 if(totalHeroQ > 0)     summaryRows.push(['達成した英雄依頼', totalHeroQ+'件']);
 if(totalChildren > 0)  summaryRows.push(['子ども', totalChildren+'人']);
 html.push(
  '<div style="margin-top:4px;padding:10px;background:var(--ink);border:1px solid #484848;border-radius:4px">'
  +'<div style="font-size:calc(var(--font-sm) - 2px);color:#e8e0d0;margin-bottom:6px;letter-spacing:1px">── 記録 ──</div>'
  +summaryRows.map(([k,v])=>
   '<div style="display:flex;justify-content:space-between;padding:2px 0;border-bottom:1px solid #221a0e">'
   +'<span style="color:#e8e0d0;font-size:calc(var(--font-sm) - 1px)">'+k+'</span>'
   +'<span style="color:#f0ece0;font-size:calc(var(--font-sm) - 1px)">'+v+'</span>'
   +'</div>'
  ).join('')
  +'</div>'
 );

 return html.join('');
}


function closeInventory(){
 if(window.innerWidth >= 860) return; // デスクトップは常時表示
 const inv = document.getElementById('inv-panel');
 inv.classList.add('hidden');
 // left-scrollに戻しておく
 const leftScroll = document.getElementById('left-scroll');
 if(leftScroll && inv.parentElement !== leftScroll) leftScroll.appendChild(inv);
}

// ──────────────────────────────────────
// NAVIGATION ENGINE
// ──────────────────────────────────────
let rollPending=null, cbtState=null, multiRollState=null;

// ══════════════════════════════════════════
//  MONSTER TABLE
// NU = Not Used（そのレベルでは出現しない）
// 各エントリ: [name, [lv1,lv2,lv3,lv4,lv5,lv6], minApp, maxApp]
// ══════════════════════════════════════════
const MONSTER_TABLE = [

 {name:'黒ゴブリン', mr:[12, 24, 36,null,null,null],minApp:3, maxApp:20},
 {name:'ケンタウロス', mr:[29, 49,106,null,null,null],minApp:1, maxApp:3 },
 {name:'レッドドラゴン',mr:[110,220,330,null,null,null],minApp:1,maxApp:1},
 {name:'グリーンドラゴン',mr:[60,120,240,null,null,null],minApp:1,maxApp:1},
 {name:'炎の悪魔', mr:[45, 90,135,180,235,270], minApp:1, maxApp:5 },
 {name:'グール', mr:[28, 42, 56, 64, 74, 87], minApp:1, maxApp:10},
 {name:'ゴブリン', mr:[30, 45, 60, 75, 90,106], minApp:1, maxApp:10},
 {name:'大蜘蛛', mr:[16, 32, 64,null,null,null],minApp:1, maxApp:10},
 {name:'ハーフオーク', mr:[74,112,150,165,204,234], minApp:1, maxApp:10},
 {name:'ヒョウ', mr:[34, 68,102,136,170,204], minApp:1, maxApp:6 },
 {name:'オーガ', mr:[26, 52,104,208,416,832], minApp:1, maxApp:6 },
 {name:'オーク', mr:[40, 60, 80,100,120,140], minApp:1, maxApp:10},
 {name:'ネズミ', mr:[8, 16, 32,null,null,null],minApp:1, maxApp:14},
 {name:'トラ', mr:[44, 88,176,null,null,null],minApp:1, maxApp:1 },
 {name:'トロル', mr:[50,100,200,400,650,1000],minApp:1, maxApp:3 },
 {name:'混沌のユニコーン', mr:[40, 80,120,null,null,null],minApp:1, maxApp:1 },
 {name:'ウェアウルフ', mr:[30, 60,120,240,480,960], minApp:1, maxApp:6 },
];

// 指定レベルで出現可能なモンスターをランダムに1種選ぶ
function pickMonster(dungeonLevel){
 const lv = Math.max(1, Math.min(6, dungeonLevel)) - 1; // 0-indexed
 const available = MONSTER_TABLE.filter(m => m.mr[lv] !== null);
 return available[Math.floor(Math.random() * available.length)];
}

// モンスター遭遇処理（go()から呼ぶ）
// 戻り値: 遭遇したら {label, enemies:[{name,mr,curMR,armor}]}、しなければ null
function rollEncounter(dungeonLevel){
 if(PC._blindSpotRounds > 0) return null; // 姿隠し中はエンカウントなし
 if(Math.random() >= 0.16) return null; // 16%
 const lv = Math.max(1, Math.min(6, dungeonLevel)) - 1;
 // 合計MR上限：レベル×50（Lv1なら50）
 const mrCap = dungeonLevel * 50;

 // 上限以内に収まるモンスターを選ぶ（単体MRが上限超えなら除外）
 const m = pickMonster(dungeonLevel);
 const baseMR = m.mr[lv];
 if(baseMR > mrCap){
 // 単体でも上限超えなら1体だけ出す（上限外の強敵は出現させず再抽選はしない→単体で出す）
 const enemies = [{ name: m.name, mr: baseMR, curMR: baseMR, armor: 0 }];
 return { label: m.name, enemies };
 }

 // 合計MRがmrCapを超えない範囲で体数を決定
 const maxByMR = Math.floor(mrCap / baseMR);
 const maxCount = Math.min(m.maxApp, maxByMR);
 const minCount = Math.min(m.minApp, maxCount);
 const count = minCount + Math.floor(Math.random() * (maxCount - minCount + 1));

 const enemies = Array.from({length: count}, (_,i) => ({
 name: count > 1 ? `${m.name} #${i+1}` : m.name,
 mr: baseMR,
 curMR: baseMR,
 armor: 0,
 }));
 const label = count > 1 ? `${m.name} ×${count}` : m.name;
 return { label, enemies };
}

