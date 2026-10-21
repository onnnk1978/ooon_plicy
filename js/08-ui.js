/* ── 呪文モーダルシステム ── */

// ══════════════════════════════════════════
//  SPELL MODAL SYSTEM
// ══════════════════════════════════════════

// 非戦闘時の呪文モーダルを開く
// nodeSpellEffects: そのノードでの効果テーブル { spellFnName: {desc, fn} }
function openSpellModal(context, nodeSpellEffects, nodeId){
 const casters = _eligibleOutOfCombatCasters(nodeId != null ? nodeId : currentNodeId);
 if(!casters.length) return;
 if(casters.length === 1){
  _openSpellModalFor(casters[0], context, nodeSpellEffects, nodeId);
  return;
 }
 // 唱える者が複数いる場合は先に選ばせる
 const modal = document.getElementById('spell-modal');
 const ctxEl = document.getElementById('spell-modal-ctx');
 const listEl = document.getElementById('spell-modal-list');
 ctxEl.textContent = '誰が唱えますか？';
 listEl.innerHTML = '';
 casters.forEach(c=>{
  const btn = document.createElement('button');
  btn.className = 'sm-spell-btn';
  const typeJa = {wizard:'魔法使い', rogue:'盗賊'}[c.type] || c.type;
  btn.innerHTML = `
   <span class="sm-name">${c===PC ? `${c.name}（あなた）` : c.name}</span>
   <span class="sm-desc">${typeJa}　ST ${c.st}</span>`;
  btn.addEventListener('click', () => {
   _openSpellModalFor(c, context, nodeSpellEffects, nodeId);
  });
  listEl.appendChild(btn);
 });
 modal.classList.add('open');
}

function _openSpellModalFor(caster, context, nodeSpellEffects, nodeId){
 const modal = document.getElementById('spell-modal');
 const ctxEl = document.getElementById('spell-modal-ctx');
 const listEl = document.getElementById('spell-modal-list');

 ctxEl.textContent = (context || '呪文を選択してください') + (caster!==PC ? `（${caster.name}）` : '');
 listEl.innerHTML = '';

 caster.spells.forEach(sp => {
  const isUnlockTrap = sp.fn === 'knockKnock' && !!_findUnlockableTrapContext(nodeId);
  const canAfford = isUnlockTrap ? caster.st > 2 : caster.st > sp.cost;
  const effect = nodeSpellEffects && nodeSpellEffects[sp.fn];
  const btn = document.createElement('button');
  btn.className = 'sm-spell-btn';
  btn.disabled = !canAfford;

  btn.innerHTML = `
   <span class="sm-name">${sp.name}</span>
   <span class="sm-desc">${isUnlockTrap ? '気づいている罠を解除する（レベルを選択）' : sp.desc}</span>
   <span class="sm-cost">${isUnlockTrap ? 'ST -2×レベル' : `ST -${sp.cost}`}　（現在ST ${caster.st}）</span>`;

  btn.addEventListener('click', () => {
   if(isUnlockTrap){
    _openUnlockLevelSelect(caster, nodeId);
   } else {
    closeSpellModal();
    castSpellOutOfCombat(sp, effect, caster, nodeId);
   }
  });
  listEl.appendChild(btn);
 });

 modal.classList.add('open');
}

function closeSpellModal(){
 document.getElementById('spell-modal').classList.remove('open');
}

// ── Unlockによる罠解除 ──
// 「気づいている」罠のみ対象（notice未了の罠には使えない）。街区探索（room内埋め込み）と
// 旧来のダンジョン独立トラップノード、両方に対応する
function _findUnlockableTrapContext(nodeId){
 const dung = PC._yeldunDungeon;
 if(!dung) return null;
 const floor = dung.currentFloor;
 const node = ydGetNode(floor, nodeId);
 if(!node) return null;
 if(node.type==='room' && node.roomContent==='trap' && node.trapKey){
  const noticed = PC[node.trapKey+'_noticed'];
  const resolved = PC[node.trapKey];
  if(noticed && !resolved) return { kind:'room', node, floor, requiredLevel: node.trapLevel||floor };
 }
 if(node.type==='trap' && node.trapKey && !PC[node.trapKey]){
  return { kind:'classic', node, floor, requiredLevel: node.trapLevel||floor };
 }
 return null;
}

// Unlockのレベル選択画面（罠が対象の場合のみ呼ばれる）
function _openUnlockLevelSelect(caster, nodeId){
 const modal = document.getElementById('spell-modal');
 const ctxEl = document.getElementById('spell-modal-ctx');
 const listEl = document.getElementById('spell-modal-list');
 ctxEl.textContent = '罠の解除に必要な強さでUnlockを唱える' + (caster!==PC?`（${caster.name}）`:'');
 listEl.innerHTML = '';
 const maxLv = caster.type === 'rogue' ? 1 : (caster.level||1);
 for(let lv=1; lv<=maxLv; lv++){
  const cost = 2*lv;
  const dcost = _applyStaffDiscount(caster, cost);
  const canAfford = caster.st > dcost;
  const btn = document.createElement('button');
  btn.className = 'sm-spell-btn';
  btn.disabled = !canAfford;
  btn.innerHTML = `
   <span class="sm-name">Lv${lv}</span>
   <span class="sm-cost">ST -${dcost}${dcost!==cost?`（杖で${cost}→${dcost}）`:''}　（現在ST ${caster.st}）</span>`;
  btn.addEventListener('click', () => {
   closeSpellModal();
   _castUnlockAtLevel(caster, lv, cost, nodeId);
  });
  listEl.appendChild(btn);
 }
 modal.classList.add('open');
}

function _castUnlockAtLevel(caster, lv, cost, nodeId){
 const ctx = _findUnlockableTrapContext(nodeId);
 caster.st = Math.max(0, caster.st - _applyStaffDiscount(caster, cost));
 gainAPAll(cost);
 updateHUD();
 if(!ctx) return; // 罠が既に解決済み等、状況が変わっていた場合は何もしない
 const story = document.getElementById('story');
 const { kind, node, floor, requiredLevel } = ctx;
 const success = lv >= requiredLevel;
 const casterLabel = caster!==PC ? `${caster.name}の詠唱。` : '';

 if(kind === 'room'){
  const trapData = node.trap || ydRollTrap(floor);
  if(success){
   PC[node.trapKey] = true;
   const trapName = node.trap?.label || '罠';
   story.innerHTML += `<br><span style="color:#f0ece0">【${trapName}】がUnlockによって解除された！${casterLabel}</span>`;
   renderChoices([{label:'▶ OK', fn:()=>ydGoNode(node.id, floor)}]);
  } else {
   PC[node.trapKey] = true;
   const res = trapData.result || ydRollTrap(floor).result;
   story.innerHTML += `<br><span style="color:#e0d0d0">呪文の力が及ばず、罠が発動した！${res.msg}</span>`;
   if(!_ydApplyTrapResult(res, node, floor)) return;
   if(PC.con<=0){ renderChoices([{label:'…（力尽きた）', go:'DEAD'}]); return; }
   renderChoices([{label:'▶ OK', fn:()=>ydGoNode(node.id, floor)}]);
  }
 } else if(kind === 'classic'){
  const _tk = node.trapKey;
  if(success){
   PC[_tk] = true;
   story.innerHTML += `<br><b>【${node.trapName}】をUnlockで解除した！</b>${casterLabel}`;
   renderChoices([{label:'▶ OK', fn:()=>ydGoNode(node.id, floor)}]);
  } else {
   PC[_tk] = true;
   const dmg = floor + Math.floor(Math.random()*floor*2+1);
   PC.con = Math.max(0, PC.con-dmg); updateHUD();
   PC[_tk+'_dmg'] = dmg;
   story.innerHTML += `<br><span style="color:#e0d0d0">呪文の力が及ばず、罠が発動した！【${node.trapName}】CON-${dmg}</span>`;
   if(PC.con<=0){ renderChoices([{label:'…（力尽きた）', go:'DEAD'}]); return; }
   renderChoices([{label:'▶ OK', fn:()=>ydGoNode(node.id, floor)}]);
  }
 }
 scrollToTop();
}

// 非戦闘時の呪文発動（casterはPCまたはパーティNPC。未指定ならPC）
function castSpellOutOfCombat(spell, effect, caster, nodeId){
 caster = caster || PC;
 const casterLabel = caster !== PC ? `${caster.name}が` : '';
 const discCost = _applyStaffDiscount(caster, spell.cost);
 caster.st = Math.max(0, caster.st - discCost);
 gainAPAll(spell.cost);
 updateHUD();

 const story = document.getElementById('story');
 let resultHtml = '';

 // ダンジョン専用呪文（fn基準で直接処理）
 if(spell.fn === 'poorBaby'){
  if(caster.con >= caster.maxCon){
   caster.st += spell.cost; // 効果不発のためST返還
   resultHtml = `<div style="margin-top:10px;padding:10px;background:#130e09;border:1px solid #585858;border-radius:4px">
    <div style="color:var(--white);font-size:var(--font-sm);margin-bottom:4px"> ${spell.name}</div>
    <div style="color:var(--white2);font-size:var(--font-sm)">${casterLabel}体力はすでに最大値です。</div>
   </div>`;
   story.innerHTML += resultHtml;
   updateHUD();
   scrollToTop();
   return;
  }
  let healed = 0;
  while(caster.st >= 2 && caster.con < caster.maxCon){
   caster.st -= 2; caster.con++; healed++;
  }
  resultHtml = `<div style="margin-top:10px;padding:10px;background:#130e09;border:1px solid #484848;border-radius:4px">
   <div style="color:#e8e0d0;font-size:var(--font-sm);margin-bottom:4px"> ${spell.name}</div>
   <div style="color:var(--white);font-size:var(--font-sm);line-height:1.7">${casterLabel}体力+${healed}回復！（${caster!==PC?`${caster.name}の`:''}体力 ${caster.con}/${caster.maxCon}）</div>
  </div>`;
  story.innerHTML += resultHtml;
  updateHUD();
  scrollToTop();
  return;
 }
 if(spell.fn === 'blindSpot'){
  if(DUNGEON_NODES && DUNGEON_NODES.has && DUNGEON_NODES.has(currentNodeId)){
   PC._blindSpotRounds = (PC._blindSpotRounds||0) + 3;
   resultHtml = `<div style="margin-top:10px;padding:10px;background:#130e09;border:1px solid #484848;border-radius:4px">
    <div style="color:#e8e0d0;font-size:var(--font-sm);margin-bottom:4px"> ${spell.name}</div>
    <div style="color:var(--white);font-size:var(--font-sm);line-height:1.7">姿が掻き消えた！3ノード分、モンスターに遭遇しなくなる。</div>
    <div style="color:#e0d0d0;font-size:calc(var(--font-sm) - 2px);margin-top:4px">ST -${spell.cost}　経験値+${spell.cost}</div>
   </div>`;
   story.innerHTML += resultHtml;
   scrollToTop();
   renderChoices([{label:'▶ OK', fn:()=>_redrawDungeonNode(currentNodeId)}]);
  } else {
   resultHtml = `<div style="margin-top:10px;padding:10px;background:#130e09;border:1px solid #585858;border-radius:4px">
    <div style="color:var(--white);font-size:var(--font-sm);margin-bottom:4px"> ${spell.name}</div>
    <div style="color:var(--white2);font-size:var(--font-sm)">ダンジョン内でのみ使用可。</div>
    <div style="color:#e0d0d0;font-size:calc(var(--font-sm) - 2px);margin-top:4px">ST -${spell.cost}　経験値+${spell.cost}</div>
   </div>`;
   story.innerHTML += resultHtml;
   scrollToTop();
  }
  return;
 }
 // Enchant Weapon / Fortify Armor：戦闘外でPC自身に恒久バフをかける（ノード固有の反応ではなく常時発動）
 if(spell.fn === 'enchantWeapon' || spell.fn === 'fortifyArmor'){
  const turns = 6 + Math.floor(Math.random()*19); // 6〜24
  if(spell.fn === 'enchantWeapon'){
   caster._enchantWeaponTurns = turns;
  } else {
   caster._fortifyArmorTurns = turns;
  }
  const label = spell.fn === 'enchantWeapon' ? '武器が魔力を帯びて輝いた！' : '防具が魔力で覆われた！';
  const effectDesc = spell.fn === 'enchantWeapon' ? 'ヒットダイスが3倍' : '防護点が3倍';
  resultHtml = `<div style="margin-top:10px;padding:10px;background:#130e09;border:1px solid #484848;border-radius:4px">
   <div style="color:#e8e0d0;font-size:var(--font-sm);margin-bottom:4px"> ${spell.name}${caster!==PC?`（${caster.name}）`:''}</div>
   <div style="color:var(--white);font-size:var(--font-sm);line-height:1.7">${casterLabel}${label}${turns}ターンの間、${effectDesc}になる。</div>
   <div style="color:#e0d0d0;font-size:calc(var(--font-sm) - 2px);margin-top:4px">ST -${spell.cost}　経験値+${spell.cost}</div>
  </div>`;
  story.innerHTML += resultHtml;
  updateHUD();
  scrollToTop();
  return;
 }
 if(spell.fn === 'healingFeeling'){
  const wasAfflicted = caster._poisoned || caster._diseased;
  caster._poisoned = false; caster._diseased = false;
  const msg = wasAfflicted ? '体内の毒・病が浄化された！' : `${casterLabel}特に毒や病を患ってはいなかった。`;
  resultHtml = `<div style="margin-top:10px;padding:10px;background:#130e09;border:1px solid #484848;border-radius:4px">
   <div style="color:#e8e0d0;font-size:var(--font-sm);margin-bottom:4px"> ${spell.name}${caster!==PC?`（${caster.name}）`:''}</div>
   <div style="color:var(--white);font-size:var(--font-sm);line-height:1.7">${msg}</div>
   <div style="color:#e0d0d0;font-size:calc(var(--font-sm) - 2px);margin-top:4px">ST -${spell.cost}　経験値+${spell.cost}</div>
  </div>`;
  story.innerHTML += resultHtml;
  updateHUD();
  scrollToTop();
  renderChoices([{label:'▶ OK', fn:()=>{
   if(PC._yeldunDungeon && _ydState && _ydState.nodeId){
    ydGoNode(_ydState.nodeId, _ydState.floor);
   } else if(window._currentHuntNode){
    _huntGoNode(window._currentHuntNode._idx);
   } else if(_huntState && _huntState.nodeId){
    _huntGoNode(_huntState.nodeId);
   } else {
    go(currentNodeId);
   }
  }}]);
  return;
 }

 if(effect && typeof effect.fn === 'function'){
  const fnResult = effect.fn();
  resultHtml = `<div style="margin-top:10px;padding:10px;background:#130e09;border:1px solid #484848;border-radius:4px">
   <div style="color:#e8e0d0;font-size:var(--font-sm);margin-bottom:4px"> ${spell.name}${caster!==PC?`（${caster.name}）`:''}</div>
   <div style="color:var(--white);font-size:var(--font-sm);line-height:1.7">${typeof fnResult==='string'?fnResult:(effect.desc||'')}</div>
   <div style="color:#e0d0d0;font-size:calc(var(--font-sm) - 2px);margin-top:4px">ST -${spell.cost}　経験値+${spell.cost}</div>
  </div>`;
  story.innerHTML += resultHtml;
  scrollToTop();
  if(fnResult === true) return;
  if(effect.afterChoices){
   const ac = typeof effect.afterChoices === 'function' ? effect.afterChoices() : effect.afterChoices;
   renderChoices(ac);
  } else {
   // 結果を確認できるよう、自動タイムアウトではなく「▶ OK」ボタンを挟んでから再描画する
   // currentNodeIdはダンジョン（yd/ハント）に入る前の街ノードIDが残ったままのことがあるため、
   // ダンジョン系の状態を優先してチェックする
   renderChoices([{label:'▶ OK', fn:()=>{
    if(PC._yeldunDungeon && _ydState && _ydState.nodeId){
     ydGoNode(_ydState.nodeId, _ydState.floor);
    } else if(window._currentHuntNode){
     _huntGoNode(window._currentHuntNode._idx);
    } else if(_huntState && _huntState.nodeId){
     _huntGoNode(_huntState.nodeId);
    } else {
     go(currentNodeId);
    }
   }}]);
  }
  return;
 }

 // 効果なし（ST消費だけ発生）
 const flavors = [
  '呪文は空気に溶けた。ここでは何も起こらない。',
  '魔力は発動したが、この場所には作用しなかった。',
  '呪文の光が瞬いたが、すぐに消えた。',
  '手応えなし。この場所では効果がないようだ。',
 ];
 const flavor = flavors[Math.floor(Math.random()*flavors.length)];
 resultHtml = `<div style="margin-top:10px;padding:10px;background:#130e09;border:1px solid #585858;border-radius:4px">
  <div style="color:var(--white);font-size:var(--font-sm);margin-bottom:4px"> ${spell.name}${caster!==PC?`（${caster.name}）`:''}</div>
  <div style="color:var(--white2);font-size:var(--font-sm)">${flavor}</div>
  <div style="color:#e0d0d0;font-size:calc(var(--font-sm) - 2px);margin-top:4px">ST -${spell.cost}　経験値+${spell.cost}</div>
 </div>`;

 story.innerHTML += resultHtml;
 scrollToTop();

 // 結果を確認できるよう、自動タイムアウトではなく「▶ OK」ボタンを挟んでから再描画する
 // ※currentNodeIdはダンジョン（yd/ハント）に入る前の街ノードIDが残ったままになることがあるため、
 //   ダンジョン系の状態を先にチェックしてから、通常ノード（NODES）にフォールバックする
 const redraw = ()=>{
  if(PC._yeldunDungeon && _ydState && _ydState.nodeId){
   ydGoNode(_ydState.nodeId, _ydState.floor);
  } else if(window._currentHuntNode){
   _huntGoNode(window._currentHuntNode._idx);
  } else if(_huntState && _huntState.nodeId){
   _huntGoNode(_huntState.nodeId);
  } else {
   const node = NODES[currentNodeId];
   if(node){
    const ch = typeof node.choices==='function' ? node.choices() : (node.choices||[]);
    renderChoices(_appendMagicChoice(ch, node, currentNodeId));
   } else {
    go(currentNodeId);
   }
  }
 };
 renderChoices([{label:'▶ OK', fn:redraw}]);
}

// renderChoicesをウィザード対応に拡張するヘルパー
// choices配列に「魔法を使う」ボタンを追加する
function addSpellButtonToChoices(choices, context, nodeSpellEffects){
 if(PC.type !== 'wizard' || !PC.spells.length) return choices;
 // 既に追加済みなら追加しない
 if(choices.some(c=>c._isMagicBtn)) return choices;
 const magicBtn = {
  label: ' 魔法を使う',
  fn: () => openSpellModal(context, nodeSpellEffects),
  _isMagicBtn: true,
 };
 return [...choices, magicBtn];
}

// ── TTYF：レベル選択 → 対象選択 → 効果適用 ──
function _ttyfSelectLevel(spell){
 const maxLv = PC.type === 'rogue' ? 1 : PC.level;
 const lvNote = PC.type === 'rogue' ? `（盗賊は常にLv1固定）` : `（最大Lv${maxLv}）`;

 const title = document.getElementById('npc-action-title');
 const btns  = document.getElementById('npc-action-btns');
 const panel = document.getElementById('npc-action-panel');
 panel.style.display = '';
 title.innerHTML = `<span style="color:#e0d8c8;font-size:var(--font-sm)"> TTYF レベルを選択 ${lvNote}</span>`;
 btns.innerHTML = '';

 for(let lv = 1; lv <= maxLv; lv++){
  const stCost = 6 * lv;
  const discCost = _applyStaffDiscount(PC, stCost);
  if(PC.st <= discCost) continue;
  const btn = document.createElement('button');
  btn.className = 'choice-btn';
  btn.style.cssText = 'border-color:#d8d0c0;color:#e0d8c8';
  btn.innerHTML = `Lv${lv} <span style="color:#e0d0d0;font-size:calc(var(--font-sm) - 1px)">強さ-${discCost}</span>`;
  btn.addEventListener('click', ()=>{ _ttyfSelectTarget(spell, lv, stCost); });
  btns.appendChild(btn);
 }
}

function _ttyfSelectTarget(spell, ttyfLv, stCost){
 const isNPC = cbtState?.isNPC;
 const aliveEn = cbtState.enemies.filter(e=> isNPC ? e.curCon>0 : e.curMR>0);
 if(aliveEn.length === 1){
  _ttyfApply(spell, ttyfLv, stCost, aliveEn[0]);
  return;
 }

 const title = document.getElementById('npc-action-title');
 const btns  = document.getElementById('npc-action-btns');
 title.innerHTML = `<span style="color:#e0d8c8;font-size:var(--font-sm)"> TTYF Lv${ttyfLv} 対象を選択</span>`;
 btns.innerHTML = '';

 aliveEn.forEach(e=>{
  const btn = document.createElement('button');
  btn.className = 'choice-btn';
  btn.style.cssText = 'border-color:#d8d0c0;color:#e0d8c8';
  const hpLabel = isNPC ? `体力${e.curCon}` : `CombatRating${e.curMR}`;
  btn.innerHTML = `${e.name} <span style="color:#e0d0d0;font-size:calc(var(--font-sm) - 1px)">${hpLabel}</span>`;
  btn.addEventListener('click', ()=>{ _ttyfApply(spell, ttyfLv, stCost, e); });
  btns.appendChild(btn);
 });
}

function _ttyfApply(spell, ttyfLv, stCost, target){
 const result = document.getElementById('magic-result');
 const cl = document.getElementById('clog');

 // ST消費（魔法使いの杖があれば軽減）
 const discCost = _applyStaffDiscount(PC, stCost);
 PC.st = Math.max(0, PC.st - discCost);
 gainAPAll(stCost);
 updateHUD();

 const isNPCCbt = cbtState?.isNPC;

 // NPC型戦闘限定：対象の回避判定を先に挟む（回避成功ならダメージ・ショック効果ともになし）
 if(isNPCCbt){
  _npcCombatTtyfDodge(ttyfLv, target, (dodged)=>{
   if(dodged){
    result.innerHTML = ` <span class="wizard-c">Magic Bolt</span> Lv${ttyfLv}<br>
     <span style="color:var(--white)">${_spellFlavor('ttyf_dodge', {target:target.name})}</span><br>
     <span style="color:#e0d0d0;font-size:calc(var(--font-sm) - 2px)">強さ-${discCost}</span>`;
    cbtState._spellCaster = true;
    cbtState._ttyfHit = 0;
    cbtState._ttyfTarget = target;
    cbtState._ttyfPRoll = 0;
    updateCombatUI();
    if(cbtState._magicPhaseNext){
     cbtState._ttyfMagicPhase = true;
     cbtState._magicPhaseNext();
     return;
    }
    const aliveParty = (PC.party||[]).filter(n=>n.con>0);
    if(aliveParty.length > 0){ _cbtNPCActions = []; showNPCActionPhase(0, aliveParty); }
    else { resolveRound(0, []); }
    return;
   }
   _ttyfApplyHit(spell, ttyfLv, stCost, target, discCost, result, isNPCCbt);
  });
  return;
 }

 _ttyfApplyHit(spell, ttyfLv, stCost, target, discCost, result, isNPCCbt);
}

function _ttyfApplyHit(spell, ttyfLv, stCost, target, discCost, result, isNPCCbt){
 // ダメージ計算：IQ × ttyfLv
 const dmg = PC.iq * ttyfLv;
 const prevHp = isNPCCbt ? target.curCon : target.curMR;
 if(isNPCCbt){
  target.curCon = Math.max(0, target.curCon - dmg);
 } else {
  target.curMR = Math.max(0, target.curMR - dmg);
 }
 const afterHp = isNPCCbt ? target.curCon : target.curMR;
 const hpLabel = isNPCCbt ? '体力' : 'CombatRating';

 // cbtStateにttyf情報を記録（resolveRoundで参照）
 cbtState._spellCaster = true;
 cbtState._ttyfHit = dmg;
 cbtState._ttyfTarget = target;
 cbtState._ttyfPRoll = dmg;

 result.innerHTML = ` <span class="wizard-c">Magic Bolt</span> Lv${ttyfLv}<br>
  <span style="color:#e0d8c8;font-size:calc(var(--font-sm) - 1px)">${_spellFlavor('ttyf_hit', {caster:PC.name, target:target.name})}</span><br>
  <span style="color:var(--white)">${target.name}に ${dmg}ダメージ！（IQ${PC.iq} × Lv${ttyfLv}）</span><br>
  <span style="color:#e0d0d0;font-size:calc(var(--font-sm) - 2px)">${hpLabel}: ${prevHp} → ${afterHp}　強さ-${discCost}</span><br>
  <span style="color:#e0d8c8;font-size:calc(var(--font-sm) - 2px)">近接戦闘では詠唱者の攻撃ヒット＝${dmg}として処理</span>`;

 // 魔法フェーズ中（_magicPhaseNextがある）なら先に処理
 if(cbtState._magicPhaseNext){
  cbtState._spellCaster = true;
  // ヒット比較には加算、差分ダメージからは除算するためdmgを保持
  cbtState._ttyfHit = dmg;
  cbtState._ttyfMagicPhase = true; // 魔法フェーズで適用済みフラグ
  cbtState._ttyfTarget = target;
  cbtState._ttyfPRoll = dmg;
  const allDeadMagic = isNPCCbt
   ? cbtState.enemies.every(e=>e.curCon<=0)
   : cbtState.enemies.every(e=>e.curMR<=0);
  updateCombatUI();
  if(!allDeadMagic){
   cbtState._magicPhaseNext();
   return;
  }
 }

 updateCombatUI();

 // 即死判定（ttyf時点で全滅）
 const allDeadCheck = isNPCCbt
  ? cbtState.enemies.every(e=>e.curCon<=0)
  : cbtState.enemies.every(e=>e.curMR<=0);
 if(allDeadCheck){
  if(cbtState.isNPC){ gainAPCombatNPC(cbtState.enemies); }
  else { gainAPAll(cbtState.totalMR); }
  const cs = cbtState; // onWin側でcbtStateがnullになっても参照がずれないようスナップショットを保持
  showCombatOK(()=>{
   if(cs.win === '__noop__'){
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

 // パーティがいれば次はNPCの行動へ、単独なら即resolveRound
 const aliveParty = (PC.party||[]).filter(n=>n.con>0);
 if(aliveParty.length > 0){
  _cbtNPCActions = [];
  showNPCActionPhase(0, aliveParty);
 } else {
  // 単独：PC近接なし（_spellCaster=true）でresolveRound
  resolveRound(0, []);
 }
}

function hideMagicArea(){
 const ma = document.getElementById('magic-area');
 if(ma){ ma.classList.add('hidden'); ma.style.display = 'none'; }
 const sa = document.getElementById('scroll-area');
 if(sa) sa.style.overflowY = '';
}

function showMagic(context){
 if(PC.type!=='wizard'&&PC.type!=='rogue')return;
 if(!PC.spells.length)return;
 const ma = document.getElementById('magic-area');
 ma.classList.remove('hidden');
 ma.style.display = '';
 document.getElementById('spell-info').textContent=context||'呪文を選択してください';
 renderSpellList(null);
 // 戦闘中のscroll-areaのoverflow解除
 const sa = document.getElementById('scroll-area');
 if(sa) sa.style.overflowY = 'auto';
}
function toggleMagicPanel(){
 // 呪文は下部の選択肢パネルに統合済み
}

function showMagicInCombat(){
 // 呪文は下部の選択肢パネルに統合済み
}
function renderSpellList(ctx){
 const el=document.getElementById('spell-list');el.innerHTML='';
 const inCombat = !!cbtState;
 PC.spells.forEach(sp=>{
 // 戦闘中は使えない呪文（戦闘外専用）は、そもそも選択肢に出さない
 if(inCombat && (sp.fn==='enchantWeapon' || sp.fn==='fortifyArmor')) return;
 const canAfford=PC.st>sp.cost;
 const btn=document.createElement('button');btn.className='spell-btn';
 btn.innerHTML=`${sp.name} <span class="sp-cost">強さ-${sp.cost}</span><br><span style="color:var(--white2);font-size:calc(var(--font-lg) + 4px)">${sp.desc}</span>`;
 btn.disabled=!canAfford;
 btn.onclick=()=>castSpell(sp,ctx);
 el.appendChild(btn);
 });
}
// 魔法使いの杖：装備していれば呪文の強さ消費をキャラクターのレベル分だけ軽減する（0未満にはならない）
function _staffSTDiscount(caster){
 if(!caster) return 0;
 if(caster.type!=='wizard' && caster.type!=='rogue') return 0;
 const hasStaff = (caster.equippedWeapons||[]).some(w=>w.isWizardStaff);
 if(!hasStaff) return 0;
 return caster.level||1;
}
function _applyStaffDiscount(caster, cost){
 return Math.max(1, cost - _staffSTDiscount(caster));
}

function castSpell(spell,ctx){
 // ttyf はレベル確定後にSTを消費するため、ここでは先引きしない
 if(spell.fn !== 'ttyf'){
  const discCost = _applyStaffDiscount(PC, Math.max(1,spell.cost));
  PC.st-=discCost;gainAPAll(spell.cost);
  updateHUD();
 }
 // 結果表示先：戦闘中はclog、それ以外はmagic-result
 const inCombat = !!cbtState;
 const result = inCombat
  ? { innerHTML: '', set innerHTML(v){ const clog=document.getElementById('clog'); if(clog){ const div=document.createElement('div'); div.style.cssText='color:#e8e0d8;font-size:calc(var(--font-sm) - 1px);padding:2px 0;border-bottom:1px solid var(--ink)'; div.innerHTML=v; clog.appendChild(div); clog.scrollTop=clog.scrollHeight; } } }
  : document.getElementById('magic-result');

 switch(spell.fn){
 case 'ttyf':
 if(cbtState){
  // レベル選択UIを表示（STはまだ消費しない）
  _ttyfSelectLevel(spell);
 } else {result.textContent='戦闘中のみ使用可';}break;
 case 'vorpal':
 if(cbtState){
  const aliveParty = (PC.party||[]).filter(n=>n.con>0);
  if(!aliveParty.length){
   // ソロ：PCに適用
   cbtState.vorpalActive=true;
   result.innerHTML=' <span class="wizard-c">Keen Blade</span>: 次のラウンド武器ダイス2倍！';
  } else {
   // パーティあり：対象を選ぶ
   result.innerHTML=' <span class="wizard-c">Keen Blade</span>: 誰にかけますか？';
   const targets = [PC, ...aliveParty];
   const oldChoices = document.getElementById('choices').innerHTML;
   const choicesEl = document.getElementById('choices');
   choicesEl.innerHTML = '';
   targets.forEach(actor=>{
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.textContent = actor === PC ? `${PC.name}（あなた）` : actor.name;
    btn.onclick = ()=>{
     if(actor === PC){
      cbtState.vorpalActive = true;
     } else {
      actor._vorpalNext = true;
     }
     result.innerHTML=` <span class="wizard-c">Keen Blade</span>: ${actor===PC?PC.name:actor.name}の次のラウンド武器ダイス2倍！`;
     choicesEl.innerHTML = '';
     // 魔法フェーズ継続
     if(cbtState._magicPhaseNext){ cbtState._magicPhaseNext(); }
    };
    choicesEl.appendChild(btn);
   });
   return; // 選択完了までbreakしない
  }
 } else result.textContent='戦闘中のみ使用可';break;
 case 'wisp':
 if((DUNGEON_NODES && DUNGEON_NODES.has && DUNGEON_NODES.has(currentNodeId)) || PC._yeldunDungeon){
 // ダンジョン内：松明1ターン分として処理
 PC._torchTurns = Math.max(PC._torchTurns||0, 1);
 result.innerHTML=' <span class="wizard-c">Candle Light</span>: 指先が明るく輝いた！ダンジョンを1ターン照らす。';
 // 暗闇状態だった場合はノードを再描画（討伐依頼等のYD系ダンジョンはydGoNodeで再描画する）
 const _storyTxt = document.getElementById('story').textContent;
 if(_storyTxt.includes('暗闇') || _storyTxt.includes('松明が切れた')){
 if(PC._yeldunDungeon && _ydState){
 ydGoNode(_ydState.nodeId, _ydState.floor);
 } else {
 go(currentNodeId);
 }
 return;
 }
 } else {
 result.innerHTML=' <span class="wizard-c">Candle Light</span>: 指先が明るく輝いた！（1ターン）';
 }
 break;
 case 'knockKnock':result.innerHTML=' <span class="wizard-c">Unlock</span>: 錠前が開いた！';break;
 case 'ohGoAway':
 if(cbtState){
 const power=PC.iq+PC.lk+PC.chr;
 const totalCurMR=cbtState.enemies.reduce((s,e)=>s+e.curMR,0);
 if(power>totalCurMR){
 result.innerHTML=` <span class="wizard-c">退散</span><br>知力+運+魅力 = ${power} ＞ 合計MR ${totalCurMR}<br><span style="color:#e8e4d8"> 魔法が効いた！全ての敵が恐怖で逃げ出した！</span>`;
 const cs = cbtState; // onWin側でcbtStateがnullになっても参照がずれないようスナップショットを保持
 showCombatOK(()=>{
  if(cs.win === '__noop__'){
   document.getElementById('cbt-area').classList.add('hidden'); document.getElementById('scroll-area').classList.remove('in-combat');
   document.getElementById('text-win').style.display = '';
   cbtState = null;
   if(cs.onWin) cs.onWin();
  } else {
   if(cs.onWin) cs.onWin();
   go(cs.win||currentNodeId);
  }
 });
 } else {
 result.innerHTML=` <span class="wizard-c">退散</span><br>知力+運+魅力 = ${power} ≤ 合計MR ${totalCurMR}<br><span class="red"> 魔法が効かなかった！敵はひるまない。</span>`;
 updateCombatUI();
 }
 }break;

 // ── Level 2 ──────────────────────────
 case 'cateyes':
 // Wispと同様にダンジョン照明として機能、3ターン
 if(DUNGEON_NODES.has(currentNodeId)){
 PC._torchTurns = Math.max(PC._torchTurns||0, 3);
 result.innerHTML=' <span class="wizard-c">暗視</span>: 目が暗闇に慣れた！3ターン暗視が使える。';
 if(PC._torchTurns > 0) go(currentNodeId);
 return;
 } else {
 result.innerHTML=' <span class="wizard-c">暗視</span>: 暗視が有効になった（3ターン）';
 }
 break;
 case 'poorBaby':{
 // 2STで1CON回復（すでにSTを消費済みなので追加2ST消費）
 if(PC.con >= PC.maxCon){
 // STを返還して失敗
 PC.st += spell.cost;
 result.innerHTML=' <span class="wizard-c">鎮痛剤</span>: 体力はすでに最大値です。';
 updateHUD(); break;
 }
 // 追加2ST消費で1CON回復を繰り返す
 let healed = 0;
 while(PC.st >= 2 && PC.con < PC.maxCon){
 PC.st -= 2; PC.con++; healed++;
 }
 result.innerHTML=` <span class="wizard-c">鎮痛剤</span>: 体力+${healed}回復！（体力 ${PC.con}/${PC.maxCon}）`;
 updateHUD(); break;
 }
 case 'overdrive':
 if(cbtState){
  const aliveParty = (PC.party||[]).filter(n=>n.con>0);
  const targets = [PC, ...aliveParty];
  const choicesEl = document.getElementById('choices');
  const showAttrChoice = (actor) => {
   const attrNames = [
    {key:'st', label:'強さ', val:actor.st},
    {key:'iq', label:'知力', val:actor.iq},
    {key:'lk', label:'運', val:actor.lk},
    {key:'dex', label:'器用さ', val:actor.dex},
    {key:'chr', label:'魅力', val:actor.chr},
    {key:'spd', label:'素早さ', val:actor.spd},
   ];
   result.innerHTML=` <span class="wizard-c">Overdrive</span>: ${actor===PC?'自分':actor.name}のどの能力値を2倍にしますか？`;
   choicesEl.innerHTML = '';
   attrNames.forEach(a=>{
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.textContent = `${a.label}（現在 ${a.val}）→ ${a.val*2}`;
    btn.onclick = ()=>{
     cbtState._overdriveList = cbtState._overdriveList || [];
     cbtState._overdriveList.push({actor, key: a.key, orig: actor[a.key]});
     actor._overdrivePending = {key: a.key, orig: actor[a.key]};
     actor[a.key] = actor[a.key] * 2;
     result.innerHTML=` <span class="wizard-c">Overdrive</span>: ${actor===PC?'自分':actor.name}の${a.label}が${a.val*2}に跳ね上がった！（1ラウンド）`;
     choicesEl.innerHTML = '';
     updateHUD();
     if(cbtState._magicPhaseNext){ cbtState._magicPhaseNext(); }
    };
    choicesEl.appendChild(btn);
   });
  };
  if(targets.length === 1){
   showAttrChoice(PC);
  } else {
   result.innerHTML=' <span class="wizard-c">Overdrive</span>: 誰にかけますか？';
   choicesEl.innerHTML = '';
   targets.forEach(actor=>{
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.textContent = actor === PC ? `${PC.name}（あなた）` : actor.name;
    btn.onclick = ()=>{ showAttrChoice(actor); };
    choicesEl.appendChild(btn);
   });
  }
  return; // 選択完了までbreakしない（castSpell末尾のUI上書きを防止）
 } else result.textContent='戦闘中のみ使用可';
 break;
 case 'blindSpot':
 if(!cbtState && DUNGEON_NODES && DUNGEON_NODES.has && DUNGEON_NODES.has(currentNodeId)){
 PC._blindSpotRounds = (PC._blindSpotRounds||0) + 3;
 result.innerHTML=' <span class="wizard-c">Blind Spot</span>: 姿が掻き消えた！3ノード分、モンスターに遭遇しなくなる。';
 } else if(cbtState){
 result.textContent='戦闘中は使用できない';
 } else {
 result.textContent='ダンジョン内でのみ使用可';
 }
 break;
 case 'whammy':
 if(cbtState){ cbtState.whammyActive=true; result.innerHTML=' <span class="wizard-c">打撃増加</span>: 武器が魔力で輝いた！次のラウンド武器ダイス3倍！'; }
 else result.textContent='戦闘中のみ使用可';
 break;
 case 'littleFeets':
 if(cbtState){ cbtState.littleFeetsRounds=(cbtState.littleFeetsRounds||0)+2; result.innerHTML=' <span class="wizard-c">速度倍加</span>: 足が素早く動く！このターン2ラウンド分行動できる！'; }
 else result.textContent='戦闘中のみ使用可';
 break;

 // ── Level 3 ──────────────────────────
 case 'rockABye':
 if(cbtState){
 const power = PC.st+PC.iq+PC.chr;
 const enemyMR = cbtState.enemies ? cbtState.enemies.reduce((s,e)=>s+(e.curMR||0),0) : cbtState.curMR;
 if(power > enemyMR){
 const sleepTurns = Nd6(1);
 cbtState.sleeping = sleepTurns;
 cbtState._spellCaster = true;
 result.innerHTML=` <span class="wizard-c">Deep Sleep</span><br>強さ+知力+魅力 = ${power} ＞ CombatRating ${enemyMR}<br><span style="color:#e8e4d8"> 魔法が効いた！敵が${sleepTurns}ターン眠り込んだ！</span>`;
 updateCombatUI();
 } else {
 result.innerHTML=` <span class="wizard-c">Deep Sleep</span><br>強さ+知力+魅力 = ${power} ≤ CombatRating ${enemyMR}<br><span class="red"> 魔法が効かなかった！敵は眠らない。</span>`;
 updateCombatUI();
 }
 } else result.textContent='戦闘中のみ使用可';
 break;
 case 'blastingPower':{
 if(cbtState){
 const dice = PC.level;
 const adds = Math.max(0, calcAdds()); const dmg = Nd6(dice) + adds;
 cbtState._spellHitBonus = (cbtState._spellHitBonus||0) + dmg;
 cbtState._spellCaster = true; // 詠唱済み→近接戦闘スキップ
 result.innerHTML=` <span class="wizard-c">Detonate</span>: ${dice}Dの火炎！${dmg}ヒット追加！<br><span style="color:#e0d8c8;font-size:calc(var(--font-sm) - 2px)">近接戦闘のヒットに加算されます</span>`;
 updateCombatUI();
 } else result.textContent='戦闘中のみ使用可';
 break;
 }
 case 'freezePleeze':{
 if(cbtState){
 const dice = PC.level;
 const adds = Math.max(0, calcAdds()); const dmg = Nd6(dice) + adds;
 cbtState._spellHitBonus = (cbtState._spellHitBonus||0) + dmg;
 cbtState._spellCaster = true; // 詠唱済み→近接戦闘スキップ
 result.innerHTML=` <span class="wizard-c">Ice Bind</span>: ${dice}Dの氷結！${dmg}ヒット追加！<br><span style="color:#e0d8c8;font-size:calc(var(--font-sm) - 2px)">近接戦闘のヒットに加算されます</span>`;
 updateCombatUI();
 } else result.textContent='戦闘中のみ使用可';
 break;
 }
 case 'healingFeeling':
 result.innerHTML=' <span class="wizard-c">Purify</span>: 体内の毒・病が浄化された！';
 PC._poisoned = false; PC._diseased = false;
 break;

 // ── Level 4 ──────────────────────────
 case 'enchantWeapon':
 if(!cbtState){
  const turns = 6 + Math.floor(Math.random()*19); // 6〜24
  PC._enchantWeaponTurns = turns;
  result.innerHTML = ` <span class="wizard-c">Enchant Weapon</span>: 武器が魔力を帯びて輝いた！${turns}ターンの間、ヒットダイスが3倍になる。`;
 } else {
  PC.st += spell.cost; // ST返還
  result.textContent = '戦闘中は使用できない';
  updateHUD();
 }
 break;

 // ── Level 5 ──────────────────────────
 case 'summon':
 if(cbtState){
  const cr = (PC.iq||0) + (PC.lk||0) + (PC.chr||0);
  const demon = {
   name: '召喚された悪魔', type: 'warrior', race: 'demon',
   st: cr, iq: 8, lk: cr, con: cr, dex: cr, chr: 8, spd: 8,
   maxCon: cr, curCon: cr, maxSt: cr, level: PC.level||1,
   epithet: '', ap: 0, gold: 0, sp: 0, cp: 0,
   equippedWeapons: [{name:'鉤爪', dice:2, adds:0, twoHand:false}],
   equippedArmors: [], equippedBoots:false, equippedClothing:false,
   invWeapons: [], invArmors: [], spells: [],
   alignment_ethics:0, alignment_order:0,
   _isSummonedDemon: true, // 戦闘終了時に取り除く目印
  };
  PC.party = [...(PC.party||[]), demon];
  result.innerHTML = ` <span class="wizard-c">Summon</span>: ${_spellFlavor('summon_cast', {caster:PC.name})}（CombatRating ${cr}）パーティの一員として戦闘に参加する。戦闘が終わるまで共に戦う。`;
  updateCombatUI();
 } else {
  PC.st += spell.cost;
  result.textContent = '戦闘中のみ使用可';
  updateHUD();
 }
 break;
 case 'fortifyArmor':
 if(!cbtState){
  const turns = 6 + Math.floor(Math.random()*19);
  PC._fortifyArmorTurns = turns;
  result.innerHTML = ` <span class="wizard-c">Fortify Armor</span>: 防具が魔力で覆われた！${turns}ターンの間、防御点が3倍になる。`;
 } else {
  PC.st += spell.cost;
  result.textContent = '戦闘中は使用できない';
  updateHUD();
 }
 break;

 // ── Level 6 ──────────────────────────
 case 'shapeshift':
 if(cbtState){
  const cr = (PC.st||0)+(PC.iq||0)+(PC.lk||0)+(PC.con||0)+(PC.dex||0)+(PC.chr||0)+(PC.spd||0);
  const origName = PC.name;
  PC._shapeshiftOriginal = { name:PC.name };
  PC.name = `悪魔と化した${origName}`;
  PC._shapeshiftCR = cr; // 戦闘が終わるまで、近接判定は毎ラウンドこの値そのものを使う
  PC._shapeshifted = true; // 変身後は魔法を使えない（変身中かどうかの判定にも流用）
  result.innerHTML = ` <span class="wizard-c">Shapeshift</span>: ${_spellFlavor('shapeshift_cast', {caster:origName})}（CombatRating ${cr}）戦闘が終わるまでCR${cr}の悪魔としてこの姿で戦う。変身が解けるまで魔法は使えない。`;
  updateCombatUI();
 } else {
  PC.st += spell.cost;
  result.textContent = '戦闘中のみ使用可';
  updateHUD();
 }
 break;
 case 'turnToStone':
 if(cbtState){
  const isNPCCbt = cbtState.isNPC;
  const alive = cbtState.enemies.filter(e=>(isNPCCbt?e.curCon:e.curMR)>0);
  const applyStone = (target)=>{
   _npcCombatTtyfDodge(6, target, (dodged)=>{
    if(dodged){
     result.innerHTML = ` <span class="wizard-c">Turn to Stone</span>: ${_spellFlavor('turnToStone_dodge', {target:target.name})}`;
    } else {
     if(isNPCCbt) target.curCon = 0; else target.curMR = 0;
     result.innerHTML = ` <span class="wizard-c">Turn to Stone</span>: ${_spellFlavor('turnToStone_hit', {target:target.name})}`;
    }
    cbtState._spellCaster = true;
    updateCombatUI();
    if(cbtState._magicPhaseNext){ const n=cbtState._magicPhaseNext; cbtState._magicPhaseNext=null; n(); }
   });
  };
  if(alive.length<=1){
   applyStone(alive[0]);
  } else {
   const choicesEl = document.getElementById('choices');
   result.innerHTML = ' <span class="wizard-c">Turn to Stone</span>: 誰を石化しますか？';
   choicesEl.innerHTML = '';
   alive.forEach(e=>{
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.textContent = `${e.name}（${isNPCCbt?`体力${e.curCon}`:`CombatRating${e.curMR}`}）`;
    btn.onclick = ()=>{ choicesEl.innerHTML=''; applyStone(e); };
    choicesEl.appendChild(btn);
   });
   return;
  }
 } else {
  PC.st += spell.cost;
  result.textContent = '戦闘中のみ使用可';
  updateHUD();
 }
 break;

 // ── Level 7 ──────────────────────────
 case 'atomization':
 if(cbtState){
  const isNPCCbt = cbtState.isNPC;
  const alive = cbtState.enemies.filter(e=>(isNPCCbt?e.curCon:e.curMR)>0);
  const applyAtomize = (target)=>{
   _npcCombatTtyfDodge(7, target, (dodged)=>{
    const dice = PC.level||1;
    const adds = Math.max(0, calcAdds());
    const heatDmg = Nd6(dice) + adds;
    cbtState._spellHitBonus = (cbtState._spellHitBonus||0) + heatDmg;
    if(dodged){
     result.innerHTML = ` <span class="wizard-c">Atomization</span>: ${_spellFlavor('atomization_dodge', {target:target.name})}（発生した熱で近接戦闘に${heatDmg}ヒット追加！）<br><span style="color:#e0d8c8;font-size:calc(var(--font-sm) - 2px)">近接戦闘のヒットに加算されます</span>`;
    } else {
     if(isNPCCbt) target.curCon = 0; else target.curMR = 0;
     result.innerHTML = ` <span class="wizard-c">Atomization</span>: ${_spellFlavor('atomization_hit', {target:target.name})}<br>発生した熱で近接戦闘に${heatDmg}ヒット追加！<br><span style="color:#e0d8c8;font-size:calc(var(--font-sm) - 2px)">近接戦闘のヒットに加算されます</span>`;
    }
    cbtState._spellCaster = true;
    updateCombatUI();
    if(cbtState._magicPhaseNext){ const n=cbtState._magicPhaseNext; cbtState._magicPhaseNext=null; n(); }
   });
  };
  if(alive.length<=1){
   applyAtomize(alive[0]);
  } else {
   const choicesEl = document.getElementById('choices');
   result.innerHTML = ' <span class="wizard-c">Atomization</span>: 誰を消滅させますか？';
   choicesEl.innerHTML = '';
   alive.forEach(e=>{
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.textContent = `${e.name}（${isNPCCbt?`体力${e.curCon}`:`CombatRating${e.curMR}`}）`;
    btn.onclick = ()=>{ choicesEl.innerHTML=''; applyAtomize(e); };
    choicesEl.appendChild(btn);
   });
   return;
  }
 } else {
  PC.st += spell.cost;
  result.textContent = '戦闘中のみ使用可';
  updateHUD();
 }
 break;

 default:result.innerHTML=` ${spell.name} 使用。`;
 }
 renderSpellList(ctx);
 // 魔法フェーズ中かつTTYF以外（TTYFは_ttyfApplyで継続）は次フェーズへ進める
 if(cbtState && cbtState._magicPhaseNext && spell.fn !== 'ttyf'){
  updateCombatUI();
  const next = cbtState._magicPhaseNext;
  cbtState._magicPhaseNext = null;
  next();
 }
}

// ──────────────────────────────────────
// 更新履歴
// ──────────────────────────────────────
// 新しいバージョンを出す際は配列の先頭に追加していく（新しい順）
// 各エントリは items（フラットな箇条書き）か sections（見出し付きグループ）のどちらかを持つ
const CHANGELOG = [
 { version:'ver.2026101201', sections:[
  { heading:'新規実装項目', items:[
   '荒野の冒険を追加。地方間の移動中に「荒野へ足を踏み入れる」を選ぶと街道を外れ、1マス5日・8方向で探索できる。',
   '旅芸人の一座を追加。各地方の一座が独自に巡業し、酒場の宣伝やチラシから公演を鑑賞できる。',
   '酒場の依頼掲示板をタブ表示に変更（受注中／配送系／討伐・戦闘系／裏の依頼）。',
   'ブーツとサンダルを別々に所持できるようにし、旅で履き潰したときに履き替えを選べるように変更。',
  ]},
  { heading:'バグ修正', items:[
   '装備屋でスケイルアーマーとナイトシールドが購入できない不具合を修正',
  ]},
 ]},
 { version:'ver.2026101001', items:[
  '各地方の治安等のステータスを調整',
  'ストーンヘイムに新ダンジョン「地下哨所」を追加',
  '酒場で、パーティから離れたNPCの消息を確認できる機能を追加',
  '休養中に発生するイベントの確率を変更',
  'その他の微調整',
 ]},
 { version:'ver.2026100201', items:[
  '町メニューで、天候にまつわる一言を他の情報より先に表示するよう順序を変更',
  '地方ごとに治安等の内部パラメータを設置し、それに応じた状態が設定されるようになりました',
  'PCの働きで地方を危機的な状況から救うと、その功績が世界の記録として残り、酒場の噂で聞けるようになりました',
  '仲間との会話中、「旅を続ける」などの選択肢ボタンを連打すると、まれに旅の進行が二重に進んでしまう不具合を修正',
 ]},
 { version:'ver.2026092202', items:[
  '世界のどこかでまれに大地震が起こるようになりました（噂で気づくことがあります）',
 ]},
 { version:'ver.2026092201', items:[
  '巣窟ダンジョンに新しい「シナリオ」を追加',
  '巣窟ダンジョンで逃走に成功した場合、1つ前の場所に戻るように変更',
  'カザーヌの闘技場に、中規模闘技場での5連勝後に試合参加できる機能を追加',
 ]},
 { version:'ver.2026092107', items:[
  '巣窟ダンジョン（孤島の深淵）の各部屋の描写を修正。扉の位置の誤りを修正、扉の向こう側を示唆する描写を削除、一部の扉の素材（鉄・鋼鉄）を追記、螺旋階段の描写を簡略化、一部通路の広さを修正',
 ]},
 { version:'ver.2026092106', sections:[
  { heading:'新規実装項目', items:[
   '巣窟ダンジョンの実装',
   '　- ポートアルゴン',
   '　- ヴェルダ村',
   '　- マラカイ',
   '　- アッシュヴェイル',
   '　- サルーン',
   '設定パネルの「OOONの世界」から閲覧できる世界地図を追加',
   '仲間が両替所のある街に到着すると、GPは手元に強さ×50だけを残して超過分を、SP・CPは全額を自分の判断で口座（仲間専用）に預け入れるように変更',
   '仲間がウィザードギルド・盗賊ギルドで呪文を習得する際、手持ちの所持金（自分自身の分）で支払うように変更。手持ちが足りない場合は、現在いる街の口座残高から自動的に補填されるように追加',
   '装備屋の「鍛錬」タブで仲間の武器も強化できるように修正',
  ]},
  { heading:'バグ修正', items:[
   '過積載中にレベルアップすると素早さが恒久的に半減するバグを修正',
   'ダンジョン内の「拘束の罠（鎖）」の器用さ半減が実際には機能していなかったバグを修正',
   '「通路をふさぐ腐臭」の体力減少が永続化していたバグを修正',
   '「幻覚・神経の緊張」の強さ・強さの最大値減少も同様に永続化していたバグを修正',
  ]},
 ]},
];

function showChangelogModal(){
 const list = document.getElementById('changelog-list');
 list.innerHTML = '';
 CHANGELOG.forEach(entry=>{
  const block = document.createElement('div');
  block.style.cssText = 'margin-bottom:18px;padding-bottom:14px;border-bottom:1px solid #3a2f1a';
  const renderItems = items => items.map(t=>`<li style="margin-bottom:4px">${t}</li>`).join('');
  let body;
  if(entry.sections){
   body = entry.sections.map(sec=>
    `<div style="color:#c8b8a0;font-family:system-ui,sans-serif;font-size:calc(var(--font-sm) - 1px);margin:8px 0 4px">${sec.heading}</div>
     <ul style="margin:0;padding-left:1.2em;color:#e8e0d0;font-size:calc(var(--font-sm) - 1px);line-height:1.6">${renderItems(sec.items)}</ul>`
   ).join('');
  } else {
   body = `<ul style="margin:0;padding-left:1.2em;color:#e8e0d0;font-size:calc(var(--font-sm) - 1px);line-height:1.6">${renderItems(entry.items)}</ul>`;
  }
  block.innerHTML = `<div style="color:#e0c88a;font-family:system-ui,sans-serif;font-size:var(--font-sm);letter-spacing:1px;margin-bottom:6px">${entry.version}</div>${body}`;
  list.appendChild(block);
 });
 document.getElementById('changelog-modal').classList.remove('hidden');
}

function hideChangelogModal(){
 document.getElementById('changelog-modal').classList.add('hidden');
}

// ──────────────────────────────────────
// 世界地図
// ──────────────────────────────────────
function showWorldMapModal(){
 const img = document.getElementById('world-map-img');
 if(img && !img.getAttribute('src')) img.src = WORLD_MAP_IMG;
 document.getElementById('world-map-modal').classList.remove('hidden');
}

function hideWorldMapModal(){
 document.getElementById('world-map-modal').classList.add('hidden');
}

// 世界地図画像を新しいタブで開く（data URIをBlobに変換してから開く：
// ブラウザによってはdata URIへの直接ナビゲーションがブロックされるため）
function openWorldMapFullView(){
 if(!WORLD_MAP_IMG) return;
 try{
  if(WORLD_MAP_IMG.indexOf('data:') !== 0){ window.open(WORLD_MAP_IMG, '_blank'); return; }
  const parts = WORLD_MAP_IMG.split(',');
  const mimeMatch = parts[0].match(/data:(.*?);base64/);
  const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
  const binary = atob(parts[1]);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for(let i=0;i<len;i++) bytes[i] = binary.charCodeAt(i);
  const blob = new Blob([bytes], {type: mime});
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank');
 }catch(e){
  // 変換に失敗した場合はdata URIを直接開くフォールバック
  window.open(WORLD_MAP_IMG, '_blank');
 }
}

// ──────────────────────────────────────
// CHARGEN INIT
// ──────────────────────────────────────
function showCharGen(){
 document.getElementById('title-screen').classList.add('hidden');
 document.getElementById('chargen').classList.remove('hidden');
 updateAddsPreview();
}

// ──────────────────────────────────────
// DEAD NODE
// ──────────────────────────────────────
function dbg(fn){
 try{ fn(); } catch(e){ showSaveToast('ERR:'+e.message); } }

function dbgFireEvent(ev){
 const story = document.getElementById('story');
 story.innerHTML =
  `<div style="border:1px solid #484848;border-radius:4px;padding:12px;margin-bottom:8px">` +
  `<div style="color:#e0d8c8;font-size:var(--font-sm);margin-bottom:6px">[DBG] ${ev.icon||''} ${ev.title}</div>` +
  `<div style="color:#d0c8b8;font-size:calc(var(--font-sm) - 1px)">${ev.desc}</div></div>`;
 const choices = typeof ev.choices==='function' ? ev.choices(ev) : ev.choices;
 renderChoices(choices.map(ec=>({
  label: ec.label,
  fn: ()=>{
   if(ec.fn) ec.fn();
   setTimeout(()=>{
    const ch = document.getElementById('choices');
    if(!ch || ch.children.length===0)
     renderChoices([{label:'▶ OK（テスト終了）', fn:()=>{}}]);
   }, 80);
  },
 })));
}

function dbgSR(){
 const attr = document.getElementById('dbg-sr-attr').value;
 const lv   = parseInt(document.getElementById('dbg-sr-lv').value);
 const res  = savingRoll(attr, lv);
 const col  = res.success ? 'var(--nature2)' : '#ff6644';
 const txt  = `${attr.toUpperCase()} Lv${lv}：${res.total} ${res.success?'≥':'＜'} ${res.target} → ` +
              `<span style="color:${col}">${res.success?'成功':'失敗'}</span>　経験値+${res.ap}`;
 document.getElementById('dbg-sr-result').innerHTML = txt;
 gainAPAll(res.ap); updateHUD();
}

function dbgStartCombat(){
 const name  = document.getElementById('dbg-enemy-name').value || 'テスト敵';
 const mr    = parseInt(document.getElementById('dbg-enemy-mr').value) || 30;
 const armor = parseInt(document.getElementById('dbg-enemy-armor').value) || 0; startCombat({ name, mr, armor, isHuman:false, canFlee:true,
  win:'__noop__', lose:'DEAD',
  onWin:()=>{
   document.getElementById('cbt-area').classList.add('hidden'); document.getElementById('scroll-area').classList.remove('in-combat');
   document.getElementById('text-win').style.display='';
   cbtState=null;
   document.getElementById('story').innerHTML =
    `<span style="color:#f0ece0"> ${name}を倒した！（テスト戦闘）</span>`;
   renderChoices([{label:'▶ OK', fn:()=>{}}]);
  }
 });
}

function dungeonTrySR(cfg){
 const attrNames={st:'強さ',iq:'知力',lk:'運',con:'体力',dex:'器用さ',chr:'魅力',spd:'素早さ'};
 const aliveParty = (PC.party||[]).filter(n=>n.con>0);
 const story = document.getElementById('story');

 // ダイスを振った後の結果表示・分岐処理（成功／失敗共通）
 const resolve = (actor, success)=>{
  if(cfg.flagKey) PC[cfg.flagKey] = PC[cfg.flagKey] || success;
  let handled = false; // failFn/successFnが独自にUI制御した場合はtrue
  if(success){
   if(typeof cfg.successFn==='function'){ const r=cfg.successFn(actor); if(r===true) handled=true; }
  } else {
   if(typeof cfg.failFn==='function'){ const r=cfg.failFn(actor); if(r===true) handled=true; }
  }
  if(handled) return; // 独自UI制御済みの場合はここで終了
  const bodyHtml = success
   ? (typeof cfg.successTxt==='function' ? cfg.successTxt() : (cfg.successTxt||''))
   : (typeof cfg.failTxt==='function' ? cfg.failTxt() : (cfg.failTxt||''));
  const storyEl = document.getElementById('story');
  if(storyEl) storyEl.innerHTML = `<div style="padding:8px 0">${bodyHtml}</div>`;
  updateHUD();
  if(PC.con <= 0){
   renderChoices([{label:'…（力尽きた）', go:'DEAD'}]);
   scrollToTop();
   return;
  }
  if(typeof cfg.choicesFn==='function'){
   renderChoices(cfg.choicesFn(success));
  } else {
   _restoreNodeChoices();
  }
  scrollToTop();
 };

 // 共有のダイス画面（setupSavingRoll／setupSavingRollFor）でロールさせる
 const runFor = (actor)=>{
  const sr = { attr: cfg.attr, level: cfg.level,
   onSuccess: ()=>resolve(actor, true),
   onFail: ()=>resolve(actor, false),
  };
  if(actor === PC) setupSavingRoll(sr);
  else setupSavingRollFor(actor, sr);
 };

 // パーティがいなければ即PCで実行
 if(!aliveParty.length){ runFor(PC); return; }

 // アクター選択UIを表示（choices要素に追加してstoryは保持）
 const attrLabel = attrNames[cfg.attr]||cfg.attr;
 // storyに選択プロンプトを追記
 story.innerHTML += `<div style="margin-top:10px;padding:8px;background:var(--info-bg);border:1px solid #484848;border-radius:4px"><div style="font-size:var(--font-sm);color:#e0d8c8;margin-bottom:8px"> <b>${attrLabel} 能力値テスト Lv${cfg.level}</b>　誰が挑みますか？</div></div>`;
 const promptDiv = story.lastElementChild;
 const actors = [PC, ...(PC.party||[]).filter(n=>n.con>0)];
 // 選択肢をchoices要素に生成
 const choicesEl = document.getElementById('choices');
 choicesEl.innerHTML = '';
 actors.forEach(actor=>{
  const isPC = actor===PC;
  const name = isPC ? PC.name : actor.name;
  const typeIcon = actor.type==='warrior'?'':actor.type==='wizard'?'':'';
  const attrVal = actor[cfg.attr]||0;
  const target = cfg.level*5+15;
  const btn = document.createElement('button');
  btn.className = 'choice-btn';
  btn.style.marginBottom = '4px';
  btn.innerHTML = `${typeIcon} ${name}　<span style="color:var(--white)">${attrLabel.split(' ')[0]} ${attrVal}</span>　<span style="color:#c8b8a0;font-size:calc(var(--font-sm) - 2px)">目標値 ${target}</span>`;
  btn.addEventListener('click',()=>{ promptDiv.remove(); choicesEl.innerHTML = ''; runFor(actor); });
  choicesEl.appendChild(btn);
 });
 scrollToTop();
}

function selectActorForSR(attr, level, callback){
 const attrNames={st:'強さ',iq:'知力',lk:'運',con:'体力',dex:'器用さ',chr:'魅力',spd:'素早さ'};
 const attrLabel = attrNames[attr] || attr;
 const aliveParty = (PC.party||[]).filter(n=>n.con>0);

 // パーティがいなければ即PCで実行
 if(!aliveParty.length){ callback(PC); return; }

 // 討伐同行者募集ダンジョンでは、リーダーが最も適任な者へ指示する（プレイヤーには選ばせない）
 const _dung = PC._yeldunDungeon;
 const _companionQuest = _dung?.isHuntDungeon ? (PC.quests||[]).find(qq=>qq.id===_dung.huntQuestId) : null;
 if(_companionQuest?.isCompanionHunt){
  const actors = [PC, ...aliveParty];
  const best = actors.reduce((a,b)=> (b[attr]||0) > (a[attr]||0) ? b : a);
  const leaderName = _companionQuest.leader ? _companionQuest.leader.name : 'リーダー';
  const bestName = best===PC ? PC.name : best.name;
  const story = document.getElementById('story');
  if(story) story.innerHTML += `<br><span style="color:#c8e0a8">${leaderName}が${bestName}に指示した。「お前が適任だ、頼む」</span>`;
  callback(best);
  return;
 }

 // 選択UIを表示
 const story = document.getElementById('story');
 const panel = document.createElement('div');
 panel.style.cssText = 'border:2px solid #484848;border-radius:4px;padding:12px;margin-top:10px;background:var(--info-bg)';
 panel.innerHTML = `<div style="font-size:var(--font-sm);color:#e0d8c8;margin-bottom:8px"> <b>${attrLabel} 能力値テスト Lv${level}</b> ── 誰が挑みますか？</div>`;

 const actors = [PC, ...aliveParty];
 actors.forEach(actor=>{
  const isPC = actor === PC;
  const name = isPC ? PC.name : actor.name;
  const typeIcon = (actor.type==='warrior'?'':actor.type==='wizard'?'':'');
  const attrVal = actor[attr] || 0;
  const target = level*5+15;
  const btn = document.createElement('button');
  btn.className = 'choice-btn';
  btn.style.marginBottom = '4px';
  btn.innerHTML = `${typeIcon} ${name}　<span style="color:var(--white)">${attrLabel.split(' ')[0]} ${attrVal}</span>　<span style="color:#c8b8a0;font-size:calc(var(--font-sm) - 2px)">目標 ${target}</span>`;
  btn.onclick = ()=>{
   panel.remove();
   callback(actor);
  };
  panel.appendChild(btn);
 });

 story.appendChild(panel);
 panel.scrollIntoView({behavior:'smooth', block:'nearest'});
 renderChoices([]); // 通常選択肢を一時的にクリア
}

const DEAD_NODE = {
 scene:'dungeon',
 txt:()=>{
 archiveCurrentPC('dead');
 return `<span class="red" style="font-size:calc(var(--font-lg) + 4px)"> GAME OVER </span><br><br>
 ${PC.name}は力尽きた…<br><br>
 <span style="color:#c0b098">最終レベル: ${PC.level}<br>
 獲得AP: ${PC.ap}<br>
 最終CON: ${PC.con}/${PC.maxCon}</span>
 ${buildContinueHtml('dead')}`;
 },
 choices: buildEndChoices,
};

// 投獄などで進行中の依頼を強制的に期限切れにする（既存の期限切れ処理をそのまま流用）
function _forceExpireAllQuests(){
 if(!PC.quests) return;
 PC.quests.forEach(q=>{
  if(q.status==='active') q.issuedDay = GAME_TIME.totalDays - q.deadlineDays - 1;
 });
 checkQuestDeadlines();
}

const WANTED_ARREST_NODE = {
 scene:'dungeon',
 txt:()=>{
  const ctx = window._wantedArrestContext || {};
  const townId = ctx.townId || PC.town;
  const townName = (TOWNS[townId]||{}).name || townId;
  const tier = ctx.tier || wantedTier(townId);
  const wantedAtArrest = getWanted(townId);
  // 投獄期間：手配度中→手配度/10年、手配度高→手配度/10×2年
  const years = (wantedAtArrest/10) * (tier==='high' ? 2 : 1);
  const months = Math.max(1, Math.round(years*12));
  GAME_TIME.totalDays += months*30;
  updateTimebar(); checkAging();

  // PC本人：ST減少・所持金と装備を没収（両替所の預金は対象外）
  const stLoss = 1 + Math.floor(Math.random()*3);
  PC.st = Math.max(1, PC.st - stLoss);
  PC.maxSt = Math.max(1, (PC.maxSt||PC.st) - stLoss);
  PC.gold = 0; PC.sp = 0; PC.cp = 0;
  PC.equippedWeapons = []; PC.equippedArmors = [];
  PC.equippedBoots = false; PC.equippedClothing = false;
  PC.invWeapons = []; PC.invArmors = [];

  // パーティメンバーも全員、同様の処理
  const partyLines = [];
  (PC.party||[]).filter(n=>n.con>0).forEach(npc=>{
   const npcStLoss = 1 + Math.floor(Math.random()*3);
   npc.st = Math.max(1, npc.st - npcStLoss);
   npc.maxSt = Math.max(1, (npc.maxSt||npc.st) - npcStLoss);
   npc.gold = 0; npc.sp = 0; npc.cp = 0;
   npc.equippedWeapons = []; npc.equippedArmors = [];
   npc.equippedBoots = false; npc.equippedClothing = false;
   npc.invWeapons = []; npc.invArmors = [];
   partyLines.push(`${npc.name}（ST-${npcStLoss}）`);
  });

  // 服役した町の手配度は大きく下がる（刑期を終えた扱い）
  changeWanted(townId, -60);

  // 進行中の依頼は全て失効
  _forceExpireAllQuests();

  updateHUD();
  addLifeEvent('', `${townName}で捕縛され、${months}ヶ月投獄された。ST-${stLoss}、所持金・装備没収。`);
  const partyTxt = partyLines.length ? `<br>仲間も共に投獄された：${partyLines.join('、')}` : '';
  return `<span style="color:#e0d0d0">${townName}・牢獄</span><br><br>`
   +`<b> 捕縛・投獄</b><br><br>`
   +`<span style="color:#e8e4d8">一味もろとも取り押さえられ、${months}ヶ月の間、牢に繋がれた。所持金・装備は身包み剥がされ、出所した時には体が鈍っていた。ST-${stLoss}。${partyTxt}</span><br><br>`
   +`<span style="color:#c0b098">進行中の依頼は全て失効した。両替所に預けていた財産だけは無事だった。</span>`;
 },
 choices:()=>[{label:'▶ 出所する', go:'TOWN_'+((window._wantedArrestContext||{}).townId||PC.town).toUpperCase()}],
};

// ──────────────────────────────────────
// ADVENTURE NODES (PLACEHOLDER)
// → シナリオPDFを読み込んで差し替える
// ──────────────────────────────────────
const ENTRY_NODE = 'TOWN_KHAZAN';

// ══════════════════════════════════════
// DEBUG PANEL
// ══════════════════════════════════════
function dbg(fn){
 try{ fn(); } catch(e){ showSaveToast('ERR:'+e.message); } }

// デバッグ用：適当な仲間NPCに「独立志向」の離脱会話を強制発生させる（2026年10月2日追加）
// checkPartyDepartureCandidate()は条件を満たす全NPC・全理由からランダムに1件選ぶため、
// 既存の「仲間の離脱イベント強制発生」ボタンでは独立志向以外の理由が選ばれることもある。
// このボタンは理由を「independence」に固定し、runPartyDepartureEvent()へ直接渡すことで確実に再現する。
function dbgForceIndependenceDeparture(){
 document.getElementById('debug-panel').style.display = 'none';
 const candidates = (PC.party||[]).filter(npc => npc.con > 0 && !npc._isTemporaryCompanion && !isNpcPcSpouse(npc));
 if(!candidates.length){ showSaveToast('独立を相談できる仲間NPCがいません'); return; }
 const npc = candidates[Math.floor(Math.random()*candidates.length)];
 npc.level = Math.max(npc.level||1, 5); // 独立志向の条件（Lv5以上）を満たす
 drawScene('travel');
 showSaveToast('独立志向の離脱会話を強制発生：' + npc.name);
 runPartyDepartureEvent({daysDone:1, interval:1000}, npc, {type:'independence'});
}

// デバッグ用：世界的大地震を即座に発生させる（発生予定日を現在日に前倒しして通常の抽選ロジックを実行）
function dbgForceWorldEarthquake(){
 if(!PC._worldEarthquake) initWorldEarthquake();
 PC._worldEarthquake.nextDueDay = GAME_TIME.totalDays;
 checkWorldEarthquake();
 const cur = PC._worldEarthquake.current;
 if(!cur || !cur.townId){ showSaveToast('[DBG] 大地震の発生に失敗しました（地方候補なし）'); return; }
 const regionName = (HERO_REGIONS[cur.regionKey]||{}).name || cur.regionKey;
 const townName = (TOWNS[cur.townId]||{}).name || cur.townId;
 showSaveToast(`[DBG] 大地震発生：${regionName}／震源地：${townName}（${dateStr()}）`);
}

// デバッグ用：「墓地の唸り声」専用イベントを、途中の各段階から直接テストする
// stage: 'choices'（3択の入口）／'scene'（深夜の墓地シーン）／'combat'（塚の中の戦闘）
function dbgTestGraveyardMoan(stage){
 const panel = document.getElementById('debug-panel');
 if(panel) panel.style.display = 'none';
 const dung = { villageId: PC.town || 'stonehiem' };
 const node = { id:'_dbg_graveyard_moan', miniResolveKey:'_dbg_graveyard_moan_'+Date.now(), miniSubtype:'rumor', rumorId:'graveyard_moan' };
 const reward = 8;
 if(stage === 'choices'){
  const s = document.getElementById('story');
  if(s) s.innerHTML = `<span style="color:#e0d0d0">[DEBUG] 墓地の唸り声：3択テスト</span>`;
  renderChoices(_graveyardMoanInvestigateChoices(node, 1, dung, reward));
 } else if(stage === 'scene'){
  _graveyardMoanScene(node, 1, dung, reward);
 } else if(stage === 'tomb'){
  _graveyardMoanEnterTomb(node, 1, dung, reward);
 } else if(stage === 'combat'){
  _graveyardMoanTombCombat(node, 1, dung, reward);
 }
}

// デバッグ用：「商家の密輸」専用イベントを、途中の各段階から直接テストする
// stage: 'choices'（3択の入口）／'merchant'（商家ノード）／'threaten'（商人を脅す）／'buy'（密輸品を買う）
function dbgTestSmuggling(stage){
 const panel = document.getElementById('debug-panel');
 if(panel) panel.style.display = 'none';
 const dung = { villageId: PC.town || 'stonehiem' };
 const node = { id:'_dbg_smuggling', miniResolveKey:'_dbg_smuggling_'+Date.now(), miniSubtype:'rumor', rumorId:'smuggling' };
 const reward = 8;
 const dbgMerchantName = 'テスト商人';
 if(stage === 'choices'){
  const s = document.getElementById('story');
  if(s) s.innerHTML = `<span style="color:#e0d0d0">[DEBUG] 商家の密輸：3択テスト</span>`;
  renderChoices(_smugglingInvestigateChoices(node, 1, dung, reward));
 } else if(stage === 'merchant'){
  _smugglingMerchantNode(node, 1, dung, reward, dbgMerchantName);
 } else if(stage === 'threaten'){
  const s = document.getElementById('story');
  if(s) s.innerHTML = `<span style="color:#e0d0d0">[DEBUG] 商人を脅す：テスト</span>`;
  _smugglingThreatenMerchant(node, 1, dung, dbgMerchantName);
 } else if(stage === 'buy'){
  const s = document.getElementById('story');
  if(s) s.innerHTML = `<span style="color:#e0d0d0">[DEBUG] 密輸品を買う：テスト</span>`;
  _smugglingBuyGoods(node, 1, dung, dbgMerchantName);
 }
}

// デバッグ用：「先代の英雄のお宝」専用イベントを、途中の各段階から直接テストする
// stage: 'choices'（3択の入口）／'scene'（塚を発見するシーン）／'tomb'（塚の中の描写ノード）／'combat'（塚の中の戦闘だけ直接開始）
function dbgTestHeroTreasure(stage){
 const panel = document.getElementById('debug-panel');
 if(panel) panel.style.display = 'none';
 const dung = { villageId: PC.town || 'stonehiem' };
 const node = { id:'_dbg_hero_treasure', miniResolveKey:'_dbg_hero_treasure_'+Date.now(), miniSubtype:'rumor', rumorId:'hero_treasure' };
 const reward = 8;
 if(stage === 'choices'){
  const s = document.getElementById('story');
  if(s) s.innerHTML = `<span style="color:#e0d0d0">[DEBUG] 先代の英雄のお宝：3択テスト</span>`;
  renderChoices(_heroTreasureInvestigateChoices(node, 1, dung, reward));
 } else if(stage === 'scene'){
  _heroTreasureTombScene(node, 1, dung, reward);
 } else if(stage === 'tomb'){
  _heroTreasureEnterTomb(node, 1, dung, reward);
 } else if(stage === 'combat'){
  _heroTreasureTombCombat(node, 1, dung, reward);
 }
}

// デバッグ用：「町外れの奇妙な光」専用イベントを、途中の各段階から直接テストする
// stage: 'choices'（3択の入口）／'scene'（廃屋を発見するシーン）／'house'（廃屋の中の描写ノード）／'combat'（戦闘だけ直接開始）
function dbgTestStrangeLight(stage){
 const panel = document.getElementById('debug-panel');
 if(panel) panel.style.display = 'none';
 const dung = { villageId: PC.town || 'stonehiem' };
 const node = { id:'_dbg_strange_light', miniResolveKey:'_dbg_strange_light_'+Date.now(), miniSubtype:'rumor', rumorId:'strange_light' };
 const reward = 8;
 if(stage === 'choices'){
  const s = document.getElementById('story');
  if(s) s.innerHTML = `<span style="color:#e0d0d0">[DEBUG] 町外れの奇妙な光：3択テスト</span>`;
  renderChoices(_strangeLightInvestigateChoices(node, 1, dung, reward));
 } else if(stage === 'scene'){
  _strangeLightHouseScene(node, 1, dung, reward);
 } else if(stage === 'house'){
  _strangeLightEnterHouse(node, 1, dung, reward);
 } else if(stage === 'combat'){
  _strangeLightCombat(node, 1, dung, reward);
 }
}

function dbgShowWorldState(){
 const ws = loadWorldState();
 const story = document.getElementById('story');
 if(!ws){ story.innerHTML = '<span style="color:#e0d0d0">worldState: null（未保存）</span>'; return; }
 let html = '<span style="color:#e0d8c8;font-size:calc(var(--font-sm) - 1px)">── worldState ──</span><br><br>';
 html += `<b>key:</b> ${typeof WORLD_KEY !== 'undefined' ? WORLD_KEY : 'UNDEFINED'}<br>`;
 html += `<b>totalDays:</b> ${ws.totalDays}<br>`;
 html += `<b>lastPCName:</b> ${ws.lastPCName}<br>`;
 html += `<b>lastReason:</b> ${ws.lastReason}<br>`;
 html += `<b>knownNPCs:</b> ${(ws.knownNPCs||[]).map(n=>n.name).join(', ') || 'なし'}<br>`;
 html += `<b>chaosNest:</b> ${ws.chaosNest ? JSON.stringify(ws.chaosNest).slice(0,60)+'...' : 'なし'}<br>`;
 if(ws.properties){
  html += '<br><b>properties:</b><br>';
  Object.keys(ws.properties).forEach(tid=>{
   const p = ws.properties[tid];
   html += `&nbsp;&nbsp;<b>${tid}</b>: tier=${p.tier||0}`;
   html += ` graves=${( p.graves||[]).length} graveyard=${(p.graveyard||[]).length}`;
   html += ` residents=${JSON.stringify((p.residents||[]).map(r=>r.name))}<br>`;
  });
 } else {
  html += '<b>properties:</b> なし<br>';
 }
 story.innerHTML = html;
}

function dbgShowPCProperties(){
 const story = document.getElementById('story');
 let html = '<span style="color:#e0d8c8;font-size:calc(var(--font-sm) - 1px)">── PC.properties ──</span><br><br>';
 if(!PC.properties || Object.keys(PC.properties).length===0){
  html += 'なし';
 } else {
  Object.keys(PC.properties).forEach(tid=>{
   const p = PC.properties[tid];
   html += `<b>${tid}</b>: tier=${p.tier||0}`;
   html += ` graves=${(p.graves||[]).length} graveyard=${(p.graveyard||[]).length}`;
   html += ` residents=${JSON.stringify((p.residents||[]).map(r=>r.name))}<br>`;
  });
 }
 story.innerHTML = html;
}

// ── デバッグ：地方状態システム（物流途絶度／治安悪化度／住民流出度） ──
function dbgShowRegionCondition(){
 ensureRegionCondition();
 ensureRegionConditionAmbient();
 ensureRegionConditionHero();
 ensureRegionConditionCrisisRecord();
 const story = document.getElementById('story');
 let html = '<span style="color:#e0d8c8;font-size:calc(var(--font-sm) - 1px)">── 地方状態システム ──</span><br><br>';
 REGION_CONDITION_SCOPE.forEach(regionKey=>{
  const c = PC._regionCondition[regionKey];
  const regionName = (HERO_REGIONS[regionKey]||{}).name || regionKey;
  const stageOf = (m)=>REGION_CONDITION_STAGE_LABEL[regionConditionStageIndex(c[m])];
  const ext = getRegionConditionExternalDelta(regionKey);
  const hero = PC._regionConditionHero[regionKey];
  html += `<b>${regionName}</b>（${regionKey}）<br>`;
  html += `&nbsp;&nbsp;物流途絶度: ${c.logi.toFixed(1)}（${stageOf('logi')}）<br>`;
  html += `&nbsp;&nbsp;治安悪化度: ${c.unrest.toFixed(1)}（${stageOf('unrest')}）<br>`;
  html += `&nbsp;&nbsp;住民流出度: ${c.exodus.toFixed(1)}（${stageOf('exodus')}）<br>`;
  html += `&nbsp;&nbsp;<span style="color:#a89880">アンビエント圧力: ${PC._regionConditionAmbient[regionKey].toFixed(2)}（治安へ毎月加算）</span><br>`;
  html += `&nbsp;&nbsp;<span style="color:#a89880">外的要因（現在値）: 物流+${ext.logi.toFixed(1)} 治安+${ext.unrest.toFixed(1)} 流出+${ext.exodus.toFixed(1)}</span><br>`;
  html += `&nbsp;&nbsp;<span style="color:#a89880">NPC英雄介入: 悪化streak=${hero.streak}ヶ月 cooldown=${hero.cooldown}ヶ月`
   + (hero.lastEvent ? ` / 直近介入者=${hero.lastEvent.npcName}（噂残り${3-(hero.rumorShown||0)}回）` : '') + `</span><br>`;
  const crisisRec = PC._regionCrisisRecord[regionKey];
  html += `&nbsp;&nbsp;<span style="color:#a89880">危機的到達フラグ: ${PC._regionWasCrisis[regionKey]?'あり（未回復）':'なし'}`
   + (crisisRec ? ` / 救済者=${crisisRec.pcName}（${crisisRec.year}年、噂残り${3-(crisisRec.rumorShown||0)}回）` : '') + `</span><br><br>`;
 });
 html += `<span style="color:#a89880;font-size:calc(var(--font-sm) - 2px)">lastKey: ${PC._regionConditionLastKey==null?'未設定':PC._regionConditionLastKey}（現在: ${(()=>{const d=getCurrentDate();return d.year*12+d.month;})()}）</span>`;
 story.innerHTML = html;
}

// 指定地方・指定項目にスコアを設定（プロンプト入力）
function dbgSetRegionCondition(){
 ensureRegionCondition();
 const regionKey = prompt('地方キー（' + REGION_CONDITION_SCOPE.join(' / ') + '）', REGION_CONDITION_SCOPE[0]);
 if(!regionKey || !REGION_CONDITION_SCOPE.includes(regionKey)){ showSaveToast('不正な地方キー'); return; }
 const metric = prompt('項目（logi / unrest / exodus）', 'unrest');
 if(!['logi','unrest','exodus'].includes(metric)){ showSaveToast('不正な項目名'); return; }
 const val = parseInt(prompt(`${regionKey} の ${metric} に設定する値（0〜100）`, '80'), 10);
 if(isNaN(val)){ showSaveToast('不正な数値'); return; }
 PC._regionCondition[regionKey][metric] = Math.max(0, Math.min(100, val));
 showSaveToast(`${regionKey} の ${metric} を ${PC._regionCondition[regionKey][metric]} に設定`);
 dbgShowRegionCondition();
}

// 月次ティックを指定回数分だけ強制的に進める（checkRegionConditionTickと同じ計算：アンビエント圧力＋外的要因＋相互作用式）
function dbgAdvanceRegionConditionTick(){
 ensureRegionCondition();
 ensureRegionConditionAmbient();
 ensureRegionConditionHero();
 ensureRegionConditionCrisisRecord();
 const n = parseInt(prompt('何ヶ月分進めますか？', '1'), 10);
 if(isNaN(n) || n <= 0){ showSaveToast('不正な数値'); return; }
 const clamp = v => Math.max(0, Math.min(100, v));
 for(let i=0;i<n;i++){
  REGION_CONDITION_SCOPE.forEach(regionKey=>{
   const ambient = stepRegionConditionAmbient(PC._regionConditionAmbient[regionKey]);
   PC._regionConditionAmbient[regionKey] = ambient;
   const ext = getRegionConditionExternalDelta(regionKey);
   const c = PC._regionCondition[regionKey];
   c.logi   = clamp(c.logi   + ext.logi);
   c.unrest = clamp(c.unrest + ext.unrest + ambient);
   c.exodus = clamp(c.exodus + ext.exodus);
   PC._regionCondition[regionKey] = stepRegionCondition(c);
   markRegionConditionCrisisIfNeeded(regionKey);
   stepRegionConditionHero(regionKey);
  });
 }
 const d = getCurrentDate();
 PC._regionConditionLastKey = d.year*12 + d.month; // 現在月を最終計算済みとしてマークし直す
 showSaveToast(`地方状態を${n}ヶ月分進めた`);
 dbgShowRegionCondition();
}

// 全地方のスコアとアンビエント圧力を0にリセット
function dbgResetRegionCondition(){
 PC._regionCondition = {};
 PC._regionConditionAmbient = {};
 PC._regionConditionHero = {};
 PC._regionWasCrisis = {};
 PC._regionCrisisRecord = {};
 ensureRegionCondition();
 ensureRegionConditionAmbient();
 ensureRegionConditionHero();
 ensureRegionConditionCrisisRecord();
 showSaveToast('地方状態を全地方0にリセットした');
 dbgShowRegionCondition();
}

function showDebugPanel(){
 // worldState/PC確認ボタンを追加（初回のみ）
 const panel = document.getElementById('debug-panel');
 if(panel && !panel.dataset.wsAdded){
  panel.dataset.wsAdded = '1';
  const wsBtn = document.createElement('button');
  wsBtn.className='dbg-btn'; wsBtn.textContent='worldState確認';
  wsBtn.onclick=()=>dbgShowWorldState();
  panel.insertBefore(wsBtn, panel.firstChild);
  const pcBtn = document.createElement('button');
  pcBtn.className='dbg-btn'; pcBtn.textContent='PC.properties確認';
  pcBtn.onclick=()=>dbgShowPCProperties();
  panel.insertBefore(pcBtn, panel.firstChild);
  const tenYrBtn = document.createElement('button');
  tenYrBtn.className='dbg-btn'; tenYrBtn.textContent='10年経過';
  tenYrBtn.onclick=()=>{
   GAME_TIME.totalDays += 365*10;
   updateHUD(); updateTimebar();
   showSaveToast(' 10年経過した（テスト用）');
  };
  panel.insertBefore(tenYrBtn, panel.firstChild);
 }
 // イベントリスト生成
 const list = document.getElementById('dbg-event-list');
 if(list && !list.children.length){
  const names = {
   spring:'泉', sandwriting:'砂の文字', urn:'壺', ring:'指輪',
   torch_flicker:'松明の揺らぎ', rolling_coin:'転がるコイン',
   falling_stones:'落石', presence:'気配', corpse:'死体',
   stench:'悪臭', wound:'傷跡', wall_knock:'壁の音',
   prayer:'祈り', gold_pile:'金の山', black_spring:'黒い泉',
  };
  (typeof DUNGEON_EVENTS !== 'undefined' ? DUNGEON_EVENTS : []).forEach(ev=>{
   const b = document.createElement('button');
   b.className = 'dbg-btn';
   b.textContent = (ev.icon||'') + ' ' + (names[ev.id]||ev.id);
   b.onclick = ()=>{ document.getElementById('debug-panel').style.display='none'; dbgFireEvent(ev); };
   list.appendChild(b);
  });
 }
 // トラップリスト生成（全ダンジョン共通のTRAP_TABLE）
 const trapList = document.getElementById('dbg-trap-list');
 if(trapList && !trapList.children.length){
  (typeof TRAP_TABLE !== 'undefined' ? TRAP_TABLE : []).forEach(trap=>{
   const b = document.createElement('button');
   b.className = 'dbg-btn';
   b.textContent = (trap.icon||'') + ' ' + trap.name;
   b.onclick = ()=>{ document.getElementById('debug-panel').style.display='none'; dbgFireTrap(trap); };
   trapList.appendChild(b);
  });
 }
 document.getElementById('debug-panel').style.display='block';
}

// デバッグ用：指定したトラップを強制発動する（確率判定をスキップし、SR以降の実処理は本番と同一の関数を通す）
function dbgFireTrap(trap){
 startTrap(trap);
}

function dbgFireEvent(ev){
 const story = document.getElementById('story');
 story.innerHTML =
  `<div style="border:1px solid #484848;border-radius:4px;padding:12px;margin-bottom:8px">` +
  `<div style="color:#e0d8c8;font-size:var(--font-sm);margin-bottom:6px">[DBG] ${ev.icon||''} ${ev.title}</div>` +
  `<div style="color:#d0c8b8;font-size:calc(var(--font-sm) - 1px)">${ev.desc}</div></div>`;
 const choices = typeof ev.choices==='function' ? ev.choices(ev) : ev.choices;
 renderChoices(choices.map(ec=>({
  label: ec.label,
  fn: ()=>{
   if(ec.fn) ec.fn();
   setTimeout(()=>{
    const ch = document.getElementById('choices');
    if(!ch || ch.children.length===0)
     renderChoices([{label:'▶ OK（テスト終了）', fn:()=>{}}]);
   }, 80);
  },
 })));
}

function dbgSR(){
 const attr = document.getElementById('dbg-sr-attr').value;
 const lv   = parseInt(document.getElementById('dbg-sr-lv').value);
 const res  = savingRoll(attr, lv);
 const col  = res.success ? 'var(--nature2)' : '#ff6644';
 const txt  = `${attr.toUpperCase()} Lv${lv}：${res.total} ${res.success?'≥':'＜'} ${res.target} → ` +
              `<span style="color:${col}">${res.success?'成功':'失敗'}</span>　経験値+${res.ap}`;
 document.getElementById('dbg-sr-result').innerHTML = txt;
 gainAPAll(res.ap); updateHUD();
}

function dbgHeroQuest(tmplIdx){ if(!PC._heroTowns) PC._heroTowns = {};
 PC._heroTowns[PC.town] = true;
 if(!PC._heroQuestCooldown) PC._heroQuestCooldown = {};
 PC._heroQuestCooldown[PC.town] = 0;
 const tmpl = HERO_QUEST_TEMPLATES[tmplIdx];
 if(!tmpl){ showSaveToast('テンプレート不明'); return; }
 const client = HERO_QUEST_CLIENTS[Math.floor(Math.random()*HERO_QUEST_CLIENTS.length)];
 const bossLv = 6 + Math.floor(Math.random()*5);
 const q = {
  id: Date.now()+Math.random(),
  type:'heroquest', status:'active',
  fromTownId: PC.town, tmplId: tmpl.id,
  clientName: client.name, title: tmpl.title,
  bossLv, minionCount: 1+Math.floor(Math.random()*2),
  minionLvRange:[2,4],
  reward: bossLv*(50+Math.floor(Math.random()*51)),
  issuedDay: GAME_TIME.totalDays,
 };
 if(!PC.quests) PC.quests=[];
 PC.quests.push(q);
 startHeroQuest(q.id);
}

function dbgStartCombat(){
 const name  = document.getElementById('dbg-enemy-name').value || 'テスト敵';
 const mr    = parseInt(document.getElementById('dbg-enemy-mr').value) || 30;
 const armor = parseInt(document.getElementById('dbg-enemy-armor').value) || 0; startCombat({ name, mr, armor, isHuman:false, canFlee:true,
  win:'__noop__', lose:'DEAD',
  onWin:()=>{
   document.getElementById('cbt-area').classList.add('hidden'); document.getElementById('scroll-area').classList.remove('in-combat');
   document.getElementById('text-win').style.display='';
   cbtState=null;
   document.getElementById('story').innerHTML =
    `<span style="color:#f0ece0"> ${name}を倒した！（テスト戦闘）</span>`;
   renderChoices([{label:'▶ OK', fn:()=>{}}]);
  }
 });
}


// ── ザールカノン墓所 B2F ランダムエンカウント ──
const CRYPT_MONSTER_TABLE = [
 {name:'牢獄の亡者',     mr:30, armor:1, minApp:1, maxApp:3},
 {name:'腐敗した衛兵',   mr:45, armor:2, minApp:1, maxApp:2},
 {name:'地下牢の死霊',   mr:60, armor:1, minApp:1, maxApp:2},
 {name:'拷問者の幽鬼',   mr:80, armor:2, minApp:1, maxApp:1},
 {name:'鎖の亡者',       mr:55, armor:1, minApp:1, maxApp:3},
 {name:'地下の番人',     mr:100,armor:3, minApp:1, maxApp:1},
];

function cryptMove(dest){ if(!cryptCheckEncounter(dest)) go(dest); }


function cryptB2Guard(returnNode){
 const guards = [
  {name:'牢獄の衛兵', mr:90, armor:3},
  {name:'地下牢の番人', mr:120, armor:4},
 ];
 const g = guards[Math.floor(Math.random()*guards.length)];
 const s = document.getElementById('story');
 s.innerHTML += `<br><span style="color:#f0ddd8"> ${g.name}が現れた！</span>`;
 renderChoices([]);
 drawScene('combat');
 startCombat({
  name: g.name, mr: g.mr, armor: g.armor,
  canFlee: true, win:'__noop__', lose:'DEAD',
  onWin(){ document.getElementById('cbt-area').classList.add('hidden'); document.getElementById('scroll-area').classList.remove('in-combat'); document.getElementById('text-win').style.display=''; cbtState=null; go(returnNode); },
 });
}

function cryptCheckEncounter(returnNode){
 if(Math.random() >= 0.15) return false;
 const m = CRYPT_MONSTER_TABLE[Math.floor(Math.random()*CRYPT_MONSTER_TABLE.length)];
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

const SHM2_MONSTER_TABLE = [
 {name:'墓所の番人骸骨',  mr:35, minApp:2, maxApp:5, armor:2},
 {name:'呪われた衛兵',    mr:50, minApp:2, maxApp:4, armor:3},
 {name:'古代の死霊',      mr:65, minApp:1, maxApp:3, armor:2},
 {name:'石化した守護者',  mr:90, minApp:1, maxApp:2, armor:5},
 {name:'墓守の亡霊',      mr:80, minApp:1, maxApp:2, armor:1},
 {name:'深層の魔獣',      mr:120,minApp:1, maxApp:1, armor:6},
];

function _consumeDungeonTorch(){
 const _n = checkWeightPenalty().over ? 2 : 1;
 for(let _tc=0; _tc<_n; _tc++){
  if((PC._torchTurns||0) > 0){
   PC._torchTurns--;
   if(PC._torchTurns <= 0 && (PC._torchStock||0) > 0){
    PC._torchStock--;
    PC._torchTurns = 10;
   }
   updateHUD();
  } else break;
 }
 // Enchant Weapon/Fortify Armorの残りターンは、松明の有無に関わらずノード移動1回につき1回だけ減らす
 _decrementWizardBuffTurns();
 _decrementChainedTurns();
}

const RUIN_MONSTER_TABLE = [
 {name:'封印廟の亡霊',   mr:35, armor:1, minApp:1, maxApp:3},
 {name:'石の守護像',     mr:55, armor:3, minApp:1, maxApp:2},
 {name:'墓所の番兵骨',   mr:40, armor:1, minApp:1, maxApp:4},
 {name:'呪われた僧侶',   mr:70, armor:2, minApp:1, maxApp:2},
 {name:'封印の霊体',     mr:90, armor:1, minApp:1, maxApp:1},
 {name:'古代の守護者',   mr:120,armor:4, minApp:1, maxApp:1},
];

function ruinMove(dest){ if(!ruinCheckEncounter(dest)) go(dest); }

function ruinCheckEncounter(returnNode){
 if(Math.random() >= 0.15) return false;
 const m = RUIN_MONSTER_TABLE[Math.floor(Math.random()*RUIN_MONSTER_TABLE.length)];
 const count = m.minApp + Math.floor(Math.random()*(m.maxApp - m.minApp + 1));
 const FLAVORS = [
  '暗闇の奥で何かが動く気配がした。松明の光が届いた先に——',
  '足音が止まった。静寂の中、背後から息遣いが聞こえた。振り返ると——',
  '通路の角を曲がった瞬間、松明の炎が大きく揺れた。その光の中に——',
  '壁の向こうから引っ掻く音がした。気づけばすぐそこに——',
  '石畳の上に影が伸びた。光源はこちらにしかない。振り向くと——',
 ];
 const flavor = FLAVORS[Math.floor(Math.random()*FLAVORS.length)];
 const label = count > 1 ? `${count}体の${m.name}` : m.name;
 const s = document.getElementById('story');
 s.innerHTML += `<br><br><span style="color:#b8a890">${flavor}</span><br><span style="color:#f0ddd8"> ${label}が現れた！</span>`;
 const enemies = Array.from({length: count}, (_,i) => ({
  name: count > 1 ? `${m.name} #${i+1}` : m.name,
  mr: m.mr, curMR: m.mr, armor: m.armor||0,
 }));
 renderChoices([{label:' 身構える', fn:()=>{
  renderChoices([]);
  drawScene('combat');
  startCombat({
   enemies,
   canFlee: true, win:'__noop__', lose:'DEAD',
   onWin(){
    document.getElementById('cbt-area').classList.add('hidden');
    document.getElementById('scroll-area').classList.remove('in-combat');
    document.getElementById('text-win').style.display='';
    cbtState=null;
    go(returnNode);
   },
  });
 }}]);
 return true;
}

function shm2Move(dest){
 _consumeDungeonTorch();
 if(!shm2CheckEncounter(dest)) go(dest);
}
function shm3Move(dest){
 _consumeDungeonTorch();
 if(!shm3CheckEncounter(dest)) go(dest);
}

function shm2CheckEncounter(returnNode){
 if(Math.random() >= 0.16) return false;
 const m = SHM2_MONSTER_TABLE[Math.floor(Math.random()*SHM2_MONSTER_TABLE.length)];
 const count = m.minApp + Math.floor(Math.random()*(m.maxApp - m.minApp + 1));
 const totalMR = m.mr * count;
 const s = document.getElementById('story');
 s.innerHTML += `<br><br><span style="color:#f0ddd8"> ${m.name}が${count}体、暗闇から現れた！</span>`;
 renderChoices([]);
 drawScene('combat');
 startCombat({
  name: m.name, mr: totalMR, armor: m.armor,
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

// ── ザールカノン墓所 B3F ランダムエンカウント ──────────────
const SHM3_MONSTER_TABLE = [
 {name:'死霊の騎士',      mr:100, minApp:2, maxApp:4, armor:4},
 {name:'古代の番人',      mr:150, minApp:1, maxApp:3, armor:5},
 {name:'石棺の死者',      mr:200, minApp:1, maxApp:2, armor:4},
 {name:'呪縛の精霊',      mr:250, minApp:1, maxApp:2, armor:3},
 {name:'墓所の支配者',    mr:300, minApp:1, maxApp:1, armor:7},
 {name:'ザール・カノンの守護者', mr:400, minApp:1, maxApp:1, armor:10},
];

function shm3CheckEncounter(returnNode){
 if(Math.random() >= 0.16) return false;
 const m = SHM3_MONSTER_TABLE[Math.floor(Math.random()*SHM3_MONSTER_TABLE.length)];
 const count = m.minApp + Math.floor(Math.random()*(m.maxApp - m.minApp + 1));
 const totalMR = m.mr * count;
 const s = document.getElementById('story');
 s.innerHTML += `<br><br><span style="color:#f0ddd8"> ${m.name}が${count}体、暗闇から現れた！</span>`;
 renderChoices([]);
 drawScene('combat');
 startCombat({
  name: m.name, mr: totalMR, armor: m.armor,
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



