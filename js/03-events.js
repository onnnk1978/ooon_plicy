/* ── 街散策イベントテーブル・カザーヌ街区イベント ── */

// ══════════════════════════════════════════
//  街散策イベント
// ══════════════════════════════════════════
// ──────────────────────────────────────
//  街散策イベント（SR変動型）
// ──────────────────────────────────────
// 各イベントは { title, intro, sr:{attr,level}, onSuccess, onFail } の形式
// intro: SRを振る前に表示するフレーバーテキスト
// onSuccess/onFail: SR結果に応じた処理＋返却テキスト

// ══════════════════════════════════════════
// カザーヌ 街区イベントテーブル
// ══════════════════════════════════════════
const KHAZAN_DISTRICT_EVENTS = {
 royal: [
  // 1: 衛兵の検問
  { id:'r01', fn:(ret)=>{
   const story = document.getElementById('story');
   story.innerHTML = `<span style="color:#f0ece0"> 王宮地区</span><br><br>`
    +`<b> 衛兵の厳格な検問</b><br><br>`
    +`突然、鎧姿の衛兵が行く手を阻んだ。厳しい目が身分を問うている。`;
   dungeonTrySR({ attr:'chr', level:2,
    successTxt:()=>`弁舌さわやかに身分を説明し、難なく通過した。`,
    successFn:()=>{},
    failFn:()=>{
     GAME_TIME.totalDays++; updateTimebar(); checkAging(); updateHUD();
     story.innerHTML = `<span style="color:#f0ece0"> 王宮地区</span><br><br>`
      +`<div style="border:2px solid #c05040;border-radius:4px;padding:12px;background:#180808;margin:8px 0">`
      +`<div style="color:#f0ddd8;font-size:calc(var(--font-sm) + 1px);margin-bottom:8px"> 留置所に収監</div>`
      +`<div style="color:#f0ece0">説明が不十分と判断され、衛兵に連行された。</div><br>`
      +`<div style="color:#f0ece0">薄暗い留置所で一夜を過ごした。翌朝になってようやく釈放される。</div><br>`
      +`<div style="color:#e0d0d0">期間：<b>1日</b>　（1日が経過した）</div>`
      +`</div>`;
     renderChoices([{label:'▶ OK（翌朝、釈放される）', fn:()=>{
      renderChoices([
       {label:'← 中央広場に戻る', fn:()=>exploreCityKhazan(ret)},
       {label:'← 街に戻る', go:'TOWN_KHAZAN'},
      ]);
     }}]);
     return true;
    },
    failTxt:()=>``,
    choicesFn:(ok)=> ok ? [
     {label:'← 中央広場に戻る', fn:()=>exploreCityKhazan(ret)},
     {label:'← 街に戻る', go:'TOWN_KHAZAN'},
    ] : [],
   });
  }},
  // 2: 貴族の行列
  { id:'r02', fn:(ret)=>{
   const story = document.getElementById('story');
   story.innerHTML = `<span style="color:#f0ece0"> 王宮地区</span><br><br>`
    +`<b> 貴族の行列</b><br><br>`
    +`豪奢な馬車を連ねた貴族の行列が通りを埋め尽くしている。道を譲らないと無礼と見なされる。`;
   renderChoices([
    {label:' 道を譲る', fn:()=>{
     story.innerHTML += `<br><br><span style="color:#c0b098">静かに脇に退いた。行列はゆっくりと通り過ぎた。</span>`;
     renderChoices([
      {label:' 散策を続ける', fn:()=>khazanGoDistrict('royal', ret)},
      {label:'← 街に戻る', go:'TOWN_KHAZAN'},
     ]);
    }},
    {label:' 無視して歩く', fn:()=>{
     if((PC.gold||0) >= 10){
      PC.gold -= 10; updateHUD();
      story.innerHTML += `<br><br><span class="red">無礼者として罰金10GPを徴収された。</span>`;
     } else {
      const dmg = 5; PC.con = Math.max(1, PC.con - dmg); updateHUD();
      story.innerHTML += `<br><br><span class="red">支払えず、従者たちにタコ殴りにされた。体力-${dmg}（残り${PC.con}）</span>`;
     }
     renderChoices([
      {label:' 散策を続ける', fn:()=>khazanGoDistrict('royal', ret)},
      {label:'← 街に戻る', go:'TOWN_KHAZAN'},
     ]);
    }},
   ]);
  }},
  // 3: 書記官に呼び止め
  { id:'r03', fn:(ret)=>{
   const story = document.getElementById('story');
   story.innerHTML = `<span style="color:#f0ece0"> 王宮地区</span><br><br>`
    +`<b> 書記官の調査</b><br><br>`
    +`王城の書記官が小走りに近づいてきた。わけのわからない書類について執拗に尋問される。結局、今日の散策はここで終わりだ。`;
   PC._khazanExploreCount = 6;
   renderChoices([{label:'← 街に戻る', go:'TOWN_KHAZAN'}]);
  }},
  // 5: 迷子の貴族子弟
  { id:'r05', fn:(ret)=>{
   const story = document.getElementById('story');
   story.innerHTML = `<span style="color:#f0ece0"> 王宮地区</span><br><br>`
    +`<b> 迷子の貴族子弟</b><br><br>`
    +`大通りの隅で泣いている子供を見つけた。高価な衣服を着た貴族の子弟のようだ。`;
   renderChoices([
    {label:' 屋敷まで連れて帰る', fn:()=>{
     const result = generateTreasure(40); updateHUD();
     story.innerHTML += `<br><br><span style="color:#e8e4d8">感謝した親から報酬を受け取った！</span><br><span style="color:#f0ece0">${result}</span>`;
     renderChoices([
      {label:' 散策を続ける', fn:()=>khazanGoDistrict('royal', ret)},
      {label:'← 街に戻る', go:'TOWN_KHAZAN'},
     ]);
    }},
    {label:' 無視して通り過ぎる', fn:()=>{
     story.innerHTML += `<br><br><span style="color:#c0b098">見て見ぬ振りをして通り過ぎた。</span>`;
     renderChoices([
      {label:' 散策を続ける', fn:()=>khazanGoDistrict('royal', ret)},
      {label:'← 街に戻る', go:'TOWN_KHAZAN'},
     ]);
    }},
   ]);
  }},
  // 6: 無意味な儀式
  { id:'r06', fn:(ret)=>{
   const story = document.getElementById('story');
   story.innerHTML = `<span style="color:#f0ece0"> 王宮地区</span><br><br>`
    +`<b> 謎の儀式</b><br><br>`
    +`広場で行われていた宮廷の儀式に巻き込まれた。長々と続く詠唱に付き合わされ、気づけば日が暮れていた。散策はこれで終わりだ。`;
   PC._khazanExploreCount = 6;
   renderChoices([{label:'← 街に戻る', go:'TOWN_KHAZAN'}]);
  }},
  // 7: 貴族の依頼（宅配）
  { id:'r07', fn:(ret)=>{
   // 宛先はカザーヌ以外からランダム
   const regionTowns = Object.keys(TOWNS).filter(t=>t!=='khazan');
   const dest = regionTowns[Math.floor(Math.random()*regionTowns.length)];
   const destName = TOWNS[dest]?.name || dest;
   const destType = DELIVERY_DEST_TYPES[Math.floor(Math.random()*DELIVERY_DEST_TYPES.length)];
   // 宛先の受取人：密書なので肩書き付きの架空人物
   const receiverTitles = ['宰相代理','商人ギルドの長','地方領主','砦の司令官','神殿の大司祭','港湾管理官','国境守備隊長'];
   const receiverTitle = receiverTitles[Math.floor(Math.random()*receiverTitles.length)];
   const receiverName = pickNPC();
   const clientName = '王宮の使者';
   const deadlineDays = calcQuestDeadline('khazan', dest);
   const reward = 20 + Math.floor(Math.random()*11)*10; // 20〜120GP
   const story = document.getElementById('story');
   story.innerHTML = `<span style="color:#f0ece0"> 王宮地区</span><br><br>`
    +`<b> 貴族の密書依頼</b><br><br>`
    +`王宮の使者風の人物が声をひそめて話しかけてきた。<br><br>`
    +`「急ぎの密書を<b>${destName}</b>の${destType.icon}${destType.label}まで届けてほしい。`
    +`<b>${receiverTitle}の${receiverName}</b>という人物に手渡しで頼む。報酬は<b>${reward}GP</b>。`
    +`期限は<b>${deadlineDays}日以内</b>だ。中身には触れるな。」`;
   renderChoices([
    {label:' 引き受ける', fn:()=>{
     if(!PC.quests) PC.quests=[];
     PC.quests.push({
      id:'del_royal_'+Date.now(), type:'delivery', status:'active',
      fromTownId:'khazan', toTownId:dest,
      destType:destType.key, destLabel:destType.label, destIcon:destType.icon,
      item:'王宮の密書', clientName,
      receiverName:`${receiverTitle}の${receiverName}`,
      reward, deadlineDays,
      issuedDay: GAME_TIME.totalDays,
     });
     showSaveToast(` 密書配達を受けた：${destName}へ　${reward}GP`);
     story.innerHTML += `<br><br><span style="color:#e8e4d8">依頼を受けた。${destName}の${receiverTitle}・${receiverName}に確実に届けよう。</span>`;
     renderChoices([
      {label:' 散策を続ける', fn:()=>khazanGoDistrict('royal', ret)},
      {label:'← 街に戻る', go:'TOWN_KHAZAN'},
     ]);
    }},
    {label:' 断る', fn:()=>{
     story.innerHTML += `<br><br><span style="color:#c0b098">断ると、使者はするりと人混みに消えた。</span>`;
     renderChoices([
      {label:' 散策を続ける', fn:()=>khazanGoDistrict('royal', ret)},
      {label:'← 街に戻る', go:'TOWN_KHAZAN'},
     ]);
    }},
   ]);
  }},
  // 9: サクラ
  { id:'r09', fn:(ret)=>{
   const story = document.getElementById('story');
   story.innerHTML = `<span style="color:#f0ece0"> 王宮地区</span><br><br>`
    +`<b> 宴会のサクラ</b><br><br>`
    +`宮廷の宴会に「にぎやかし要員」として招待された。貴族社会の作法で振る舞えるかどうか…`;
   dungeonTrySR({ attr:'chr', level:2,
    successTxt:()=>`見事に場の雰囲気に溶け込み、上手く切り抜けた。`,
    failTxt:()=>{
     changeTrust('khazan', -10, 'scandal');
     updateHUD();
     return `ボロが出て笑い者になった。<br><span class="red">カザーヌの信頼度 -10</span>`;
    },
    choicesFn:()=>[
     {label:' 散策を続ける', fn:()=>khazanGoDistrict('royal', ret)},
     {label:'← 街に戻る', go:'TOWN_KHAZAN'},
    ],
   });
  }},
  // 11: 宮廷魔術師の情報
  { id:'r11', fn:(ret)=>{
   const infos = [
    '「星の配置が不吉だ。この季節、王宮地区を夜間に歩くのは避けたほうがよい」',
    '「王城の地下には三層の封印が施された部屋がある。何が封じられているかは私も知らぬ」',
    '「最近、魔力の乱れを感じる。おそらく誰かが禁断の術を試みているのだろう」',
    '「東の山脈に異変が起きている。精霊たちが怯えているのを感じる」',
    '「月が欠けるとき、古い魔法は力を増す。気をつけよ」',
   ];
   const info = infos[Math.floor(Math.random()*infos.length)];
   const story = document.getElementById('story');
   story.innerHTML = `<span style="color:#f0ece0"> 王宮地区</span><br><br>`
    +`<b> 宮廷魔術師との遭遇</b><br><br>`
    +`長い白衣を纏った老魔術師がぼそりと話しかけてきた。<br><br><i>${info}</i><br><br>`
    +`意味があるのかないのかわからないが、何か含みのある口ぶりだった。`;
   renderChoices([
    {label:' 散策を続ける', fn:()=>khazanGoDistrict('royal', ret)},
    {label:'← 街に戻る', go:'TOWN_KHAZAN'},
   ]);
  }},
  // 12: 怪しい密談
  { id:'r12', fn:(ret)=>{
   const story = document.getElementById('story');
   story.innerHTML = `<span style="color:#f0ece0"> 王宮地区</span><br><br>`
    +`<b> 怪しい密談</b><br><br>`
    +`路地の奥で何者かが密かに言葉を交わしているのを目撃した。追跡するか？`;
   renderChoices([
    {label:' 追跡する（運 能力値テスト）', fn:()=>{
     dungeonTrySR({ attr:'lk', level:2,
      successTxt:()=>`うまく隠れながら追ったが、相手は迷路のような路地に消えた。尾行には失敗したが、発見されずに済んだ。`,
      failFn:()=>{},
      failTxt:()=>`護衛に見つかってしまった！`,
      choicesFn:(ok)=>{
       if(ok) return [
        {label:' 散策を続ける', fn:()=>khazanGoDistrict('royal', ret)},
        {label:'← 街に戻る', go:'TOWN_KHAZAN'},
       ];
       return [
        {label:' 護衛と戦う', fn:()=>{
         startCombat({
          enemies:[{name:'密談の護衛', mr:50, curMR:50, armor:3}],
          canFlee:true, win:'__explore_win__', lose:'DEAD',
         });
         window._exploreReturnNode = ret;
         window._exploreCombatWin = null;
        }},
        {label:' 逃げる', fn:()=>{
         setupSavingRoll({ attr:'spd', level:1,
          onSuccess:()=>{ story.innerHTML+=`<br><span style="color:#e8e4d8">間一髪で逃げ切った！</span>`;
           renderChoices([{label:'← 街に戻る', go:'TOWN_KHAZAN'}]); },
          onFail:()=>{ const d=1+Math.floor(Math.random()*6); PC.con=Math.max(1,PC.con-d); updateHUD();
           story.innerHTML+=`<br><span class="red">背中に一撃を受けた。CON-${d}（残り${PC.con}）</span>`;
           renderChoices([{label:'← 街に戻る', go:'TOWN_KHAZAN'}]); },
         });
        }},
       ];
      },
     });
    }},
    {label:' 無視して通り過ぎる', fn:()=>{
     story.innerHTML += `<br><br><span style="color:#c0b098">見なかったことにした。</span>`;
     renderChoices([
      {label:' 散策を続ける', fn:()=>khazanGoDistrict('royal', ret)},
      {label:'← 街に戻る', go:'TOWN_KHAZAN'},
     ]);
    }},
   ]);
  }},
  // 13: 冤罪拘束
  { id:'r13', fn:(ret)=>{
   const story = document.getElementById('story');
   story.innerHTML = `<span style="color:#f0ece0"> 王宮地区</span><br><br>`
    +`<b> 冤罪による拘束</b><br><br>`
    +`突然、衛兵に「貴様が怪しい」と身柄を拘束された。身に覚えのない罪だ。CHRで弁明できるか？`;
   dungeonTrySR({ attr:'chr', level:3,
    successTxt:()=>`粘り強く弁明した結果、衛兵も折れて釈放された。理不尽だったが、無事だ。`,
    failFn:()=>{
     const months = 1 + Math.floor(Math.random()*3);
     const stLoss = months;
     GAME_TIME.totalDays += months * 30; updateTimebar(); checkAging(); updateHUD();
     PC.st = Math.max(1, PC.st - stLoss);
     PC.maxSt = Math.max(1, (PC.maxSt||PC.st) - stLoss);
     updateHUD();
     story.innerHTML = `<span style="color:#f0ece0"> 王宮地区</span><br><br>`
      +`<div style="border:2px solid #c05040;border-radius:4px;padding:12px;background:#180808;margin:8px 0">`
      +`<div style="color:#f0ddd8;font-size:calc(var(--font-sm) + 1px);margin-bottom:8px"> 冤罪による収監</div>`
      +`<div style="color:#f0ece0">弁明は通じず、身に覚えのない罪で牢に入れられた。</div><br>`
      +`<div style="color:#f0ece0">劣悪な環境の中、無実を証明するための手続きが続いた。</div><br>`
      +`<div style="color:#e0d0d0">収監期間：<b>${months}ヶ月</b>（${months*30}日が経過した）</div><br>`
      +`<div style="color:#e0d0d0">劣悪な扱いの影響：<b>強さ が恒久的に -${stLoss}</b></div>`
      +`</div>`;
     renderChoices([{label:`▶ OK（${months}ヶ月後、釈放される）`, fn:()=>{
      renderChoices([{label:'← 街に戻る', go:'TOWN_KHAZAN'}]);
     }}]);
     return true;
    },
    failTxt:()=>``,
    choicesFn:(ok)=> ok ? [
     {label:' 散策を続ける', fn:()=>khazanGoDistrict('royal', ret)},
     {label:'← 街に戻る', go:'TOWN_KHAZAN'},
    ] : [],
   });
  }},
  // 17: 馬車の襲撃
  { id:'r17', fn:(ret)=>{
   const story = document.getElementById('story');
   story.innerHTML = `<span style="color:#f0ece0"> 王宮地区</span><br><br>`
    +`<b> 馬車の襲撃</b><br><br>`
    +`突然、護衛付きの馬車が武装した一団に囲まれた！貴族が乗っているようだ。対抗するか？`;
   renderChoices([
    {label:' 襲撃者に立ち向かう', fn:()=>{
     startCombat({
      enemies:[{name:'馬車の襲撃者', mr:80, curMR:80, armor:4}],
      canFlee:true, win:'__explore_win__', lose:'DEAD',
      _exploreWin: ()=>{
       const gp = 30 + Math.floor(Math.random()*151/10)*10;
       gainGPAll(gp); updateHUD();
       const storyEl = document.getElementById('story');
       if(storyEl) storyEl.innerHTML += `<br><span style="color:#e8e4d8">馬車の貴族から礼金を受け取った！ +${gp}GP</span>`;
       renderChoices([
        {label:' 散策を続ける', fn:()=>khazanGoDistrict('royal', ret)},
        {label:'← 街に戻る', go:'TOWN_KHAZAN'},
       ]);
      },
     });
     window._exploreReturnNode = ret;
    }},
    {label:' 見て見ぬ振りをする', fn:()=>{
     story.innerHTML += `<br><br><span style="color:#c0b098">騒ぎを避けて素早くその場を立ち去った。</span>`;
     renderChoices([
      {label:' 散策を続ける', fn:()=>khazanGoDistrict('royal', ret)},
      {label:'← 街に戻る', go:'TOWN_KHAZAN'},
     ]);
    }},
   ]);
  }},
  // 22: 有力者との接触
  { id:'r22', fn:(ret)=>{
   const story = document.getElementById('story');
   story.innerHTML = `<span style="color:#f0ece0"> 王宮地区</span><br><br>`
    +`<b> 有力者との偶然の出会い</b><br><br>`
    +`宮廷に出入りしていると思われる有力者と目が合った。CHRの高さで印象が決まる。`;
   dungeonTrySR({ attr:'chr', level:2,
    successFn:()=>{ changeTrust('khazan', 10); updateHUD(); },
    successTxt:()=>`話が弾み、推薦の言葉をいただけた。<br><span style="color:#e8e4d8">カザーヌの信頼度 +10</span>`,
    failFn:()=>{ changeTrust('khazan', -10); updateHUD(); },
    failTxt:()=>`態度が悪いと思われたらしく、冷たくあしらわれた。<br><span class="red">カザーヌの信頼度 -10</span>`,
    choicesFn:()=>[
     {label:' 散策を続ける', fn:()=>khazanGoDistrict('royal', ret)},
     {label:'← 街に戻る', go:'TOWN_KHAZAN'},
    ],
   });
  }},
  // 25: 王命による強制任務
  { id:'r25', fn:(ret)=>{
   const story = document.getElementById('story');
   story.innerHTML = `<span style="color:#f0ece0"> 王宮地区</span><br><br>`
    +`<b> 王命による徴発</b><br><br>`
    +`衛兵に「王命により剣の腕が立つ者を徴発する」と呼び止められた。断れない雰囲気だ。<br><br>`
    +`強制的に討伐依頼を引き受けることになった。`;
   // 強制的に討伐依頼を生成してキューに入れる
   const q = generateHuntQuest('khazan');
   if(q){
    q.clientName = '王命（衛兵より伝達）';
    q.forced = true;
    PC.quests = PC.quests||[];
    PC.quests.push(q);
    showSaveToast(` 強制討伐依頼：${q.caveName}の${q.monsterName}`);
    story.innerHTML += `<br><br><span class="red"> 討伐依頼「${q.caveName}の${q.monsterName}」が依頼リストに追加された。</span>`;
   }
   renderChoices([{label:'← 街に戻る', go:'TOWN_KHAZAN'}]);
  }},
  // 27: 魔術師の事故
  { id:'r27', fn:(ret)=>{
   const monsters = [
    {name:'暴走したゴーレム', mr:55, armor:6},
    {name:'召喚された悪魔', mr:65, armor:3},
    {name:'制御を失った魔法生物', mr:45, armor:2},
    {name:'異界から来た怪物', mr:70, armor:4},
   ];
   const m = monsters[Math.floor(Math.random()*monsters.length)];
   const story = document.getElementById('story');
   story.innerHTML = `<span style="color:#f0ece0"> 王宮地区</span><br><br>`
    +`<b> 宮廷魔術師の実験事故</b><br><br>`
    +`突然、王宮の塔から爆発音が響いた。<b>${m.name}</b>が街に解き放たれた！`;
   renderChoices([
    {label:` ${m.name}と戦う`, fn:()=>{
     startCombat({
      enemies:[{name:m.name, mr:m.mr, curMR:m.mr, armor:m.armor}],
      canFlee:true, win:'__explore_win__', lose:'DEAD',
      _exploreWin: ()=>{
       const gp = 30 + Math.floor(Math.random()*151/10)*10;
       gainGPAll(gp); changeTrust('khazan', 10); updateHUD();
       const storyEl = document.getElementById('story');
       if(storyEl) storyEl.innerHTML += `<br><span style="color:#e8e4d8">市民を救った英雄として讃えられた！ +${gp}GP　信頼度+10</span>`;
       renderChoices([
        {label:' 散策を続ける', fn:()=>khazanGoDistrict('royal', ret)},
        {label:'← 街に戻る', go:'TOWN_KHAZAN'},
       ]);
      },
     });
     window._exploreReturnNode = ret;
    }},
    {label:' 逃げる（素早さ 能力値テスト）', fn:()=>{
     setupSavingRoll({ attr:'spd', level:1,
      onSuccess:()=>{ story.innerHTML+=`<br><span style="color:#e8e4d8">間一髪で逃げ切った！</span>`;
       renderChoices([
        {label:' 散策を続ける', fn:()=>khazanGoDistrict('royal', ret)},
        {label:'← 街に戻る', go:'TOWN_KHAZAN'},
       ]); },
      onFail:()=>{ const d=2+Math.floor(Math.random()*8); PC.con=Math.max(1,PC.con-d); updateHUD();
       story.innerHTML+=`<br><span class="red">逃げる途中に怪我をした。CON-${d}（残り${PC.con}）</span>`;
       renderChoices([{label:'← 街に戻る', go:'TOWN_KHAZAN'}]); },
     });
    }},
   ]);
  }},
  // 32: 王族との接触
  { id:'r32', fn:(ret)=>{
   const royals = ['王子','王女','側近の貴族','宮廷顧問'];
   const royal = royals[Math.floor(Math.random()*royals.length)];
   changeTrust('khazan', 10); updateHUD();
   const story = document.getElementById('story');
   story.innerHTML = `<span style="color:#f0ece0"> 王宮地区</span><br><br>`
    +`<b> 王族との直接接触</b><br><br>`
    +`なんと、${royal}と偶然にも言葉を交わす機会を得た。短い会話だったが、確かな印象を残すことができた。<br><br>`
    +`<span style="color:#e8e4d8">カザーヌの信頼度 +10</span>`;
   renderChoices([
    {label:' 散策を続ける', fn:()=>khazanGoDistrict('royal', ret)},
    {label:'← 街に戻る', go:'TOWN_KHAZAN'},
   ]);
  }},
  // 34: 都市封鎖
  { id:'r34', fn:(ret)=>{
   const story = document.getElementById('story');
   story.innerHTML = `<span style="color:#f0ece0"> 王宮地区</span><br><br>`
    +`<b> 政変！都市封鎖</b><br><br>`
    +`突然、王宮から緊急の布告が出た。政変の恐れにより、カザーヌは1ヶ月間の完全封鎖となる。`;
   GAME_TIME.totalDays += 30; updateTimebar(); checkAging();
   if(PC._food >= 30){ PC._food -= 30; }
   else {
    const lacking = 30 - (PC._food||0);
    PC._food = 0;
    PC.con = Math.max(1, PC.con - Math.floor(lacking/5));
   }
   updateHUD();
   story.innerHTML += `<br><br><span class="red">1ヶ月が経過した。食料が30日分消費された。</span>`;
   renderChoices([{label:'← 街に戻る', go:'TOWN_KHAZAN'}]);
  }},
 ],
 // ══ 市場地区 ══
 market: [
  // m02: 格安偽物武器
  { id:'m02', fn:(ret)=>{
   const w = WEAPONS_TABLE[Math.floor(Math.random()*WEAPONS_TABLE.length)];
   const price = Math.floor(w.cost / 10);
   const story = document.getElementById('story');
   story.innerHTML = `<span style="color:#f0ece0"> 市場地区</span><br><br>`
    +`<b> 格安武器の発見</b><br><br>`
    +`露店の隅に目を引く武器が置いてある。<b>${w.name}</b>が通常価格の1/10、わずか<b>${price}GP</b>で売られている。安すぎる……`;
   renderChoices([
    {label:` 購入する（${price}GP）`, fn:()=>{
     if((PC.gold||0) < price){ showSaveToast('所持金が足りない'); return; }
     PC.gold -= price; updateHUD();
     const fake = {...w, name:`粗悪な${w.name}`, adds:Math.min(w.adds, 0), dice:Math.max(1,w.dice-2), _fake:true};
     PC.invWeapons = PC.invWeapons||[];
     PC.invWeapons.push(fake);
     story.innerHTML += `<br><br><span class="red">購入した。しかし帰って確かめると作りが粗悪で、実戦には到底使えない代物だった。</span>`;
     renderChoices([
      {label:' 散策を続ける', fn:()=>khazanGoDistrict('market', ret)},
      {label:'← 街に戻る', go:'TOWN_KHAZAN'},
     ]);
    }},
    {label:' 無視して通り過ぎる', fn:()=>{
     story.innerHTML += `<br><br><span style="color:#c0b098">怪しいと思い、立ち去った。</span>`;
     renderChoices([
      {label:' 散策を続ける', fn:()=>khazanGoDistrict('market', ret)},
      {label:'← 街に戻る', go:'TOWN_KHAZAN'},
     ]);
    }},
   ]);
  }},
  // m03: 掘り出し物（宝石以上）
  { id:'m03', fn:(ret)=>{
   const story = document.getElementById('story');
   // 1〜2個の宝石・装飾品を生成
   const count = Math.random() < 0.3 ? 2 : 1;
   const results = [];
   for(let i=0;i<count;i++) results.push(generateJewel());
   updateHUD();
   story.innerHTML = `<span style="color:#f0ece0"> 市場地区</span><br><br>`
    +`<b> 掘り出し物発見</b><br><br>`
    +`市場の片隅で目を引く品を見つけた。値踏みする間もなく手に入れた。<br><br>`
    +results.map(r=>`<span style="color:#f0ece0">${r}</span>`).join('<br>');
   renderChoices([
    {label:' 散策を続ける', fn:()=>khazanGoDistrict('market', ret)},
    {label:'← 街に戻る', go:'TOWN_KHAZAN'},
   ]);
  }},
  // m05: 屋台で小銭消費
  { id:'m05', fn:(ret)=>{
   const cost = 1 + Math.floor(Math.random()*5);
   const items = ['焼き串','香辛料入りスープ','果物の盛り合わせ','揚げパン','干し肉の詰め合わせ'];
   const item = items[Math.floor(Math.random()*items.length)];
   const story = document.getElementById('story');
   story.innerHTML = `<span style="color:#f0ece0"> 市場地区</span><br><br>`
    +`<b> 屋台の誘惑</b><br><br>`
    +`いい匂いに釣られて屋台で${item}を買った（${cost}GP）。`;
   if((PC.gold||0) >= cost){ PC.gold -= cost; } else { PC.cp = Math.max(0,(PC.cp||0)-cost*100); }
   updateHUD();
   renderChoices([
    {label:' 散策を続ける', fn:()=>khazanGoDistrict('market', ret)},
    {label:'← 街に戻る', go:'TOWN_KHAZAN'},
   ]);
  }},
  // m06: しつこい客引き
  { id:'m06', fn:(ret)=>{
   const story = document.getElementById('story');
   story.innerHTML = `<span style="color:#f0ece0"> 市場地区</span><br><br>`
    +`<b> しつこい客引き</b><br><br>`
    +`露店の客引きに捕まった。巧みな話術でなかなか逃げられず、気づけば時間を大幅に消耗してしまった。<br><br>`
    +`<span class="red">散策回数を2回消費した。</span>`;
   PC._khazanExploreCount = (PC._khazanExploreCount||0) + 1;
   renderChoices([
    {label:' 散策を続ける', fn:()=>khazanGoDistrict('market', ret)},
    {label:'← 街に戻る', go:'TOWN_KHAZAN'},
   ]);
  }},
  // m07: 闇商人
  { id:'m07', fn:(ret)=>{
   const story = document.getElementById('story');
   story.innerHTML = `<span style="color:#f0ece0"> 市場地区</span><br><br>`
    +`<b> 闇商人の接触</b><br><br>`
    +`人混みの中で、フードを被った人物がそっと声をかけてきた。「市価より安く売れるものがある。興味はあるか？」`;
   renderChoices([
    {label:' 取引する（市場価格の2/3）', fn:()=>{
     // 旅商人と同じ品目を2/3価格で表示
     const darkItems = WEAPONS_TABLE.map(w=>({...w, cost:Math.floor(w.cost*2/3)}));
     let html = `<span style="color:#f0ece0"> 闇取引</span><br><br><span style="color:#c0b098">所持金：${PC.gold||0}GP</span><br><br>`;
     darkItems.forEach((w,i)=>{
      const can = (PC.gold||0) >= w.cost;
      html += `<span style="color:${can?'#d4c4a0':'var(--dim2)'}">${w.name}　${w.dice}D+${w.adds}　${w.cost}GP</span><br>`;
     });
     story.innerHTML = html;
     const choices = darkItems.map((w,i)=>({
      label:`${w.name}（${w.cost}GP）`,
      fn:()=>{
       if((PC.gold||0)<w.cost){showSaveToast('所持金が足りない');return;}
       PC.gold-=w.cost; PC.invWeapons=PC.invWeapons||[]; PC.invWeapons.push({...w,cost:w.cost});
       updateHUD(); showSaveToast(`${w.name}を購入した`);
       renderChoices([
        {label:' 散策を続ける', fn:()=>khazanGoDistrict('market', ret)},
        {label:'← 街に戻る', go:'TOWN_KHAZAN'},
       ]);
      },
     }));
     choices.push({label:'← 断る', fn:()=>{ renderChoices([
      {label:' 散策を続ける', fn:()=>khazanGoDistrict('market', ret)},
      {label:'← 街に戻る', go:'TOWN_KHAZAN'},
     ]);}});
     renderChoices(choices);
    }},
    {label:' 断って立ち去る', fn:()=>{
     story.innerHTML += `<br><br><span style="color:#c0b098">怪しいと思い、立ち去った。</span>`;
     renderChoices([
      {label:' 散策を続ける', fn:()=>khazanGoDistrict('market', ret)},
      {label:'← 街に戻る', go:'TOWN_KHAZAN'},
     ]);
    }},
   ]);
  }},
  // m11: 外国商人との交渉
  { id:'m11', fn:(ret)=>{
   const story = document.getElementById('story');
   // 他地方特産品を1.2倍で
   const specials = getRegionSpecialties ? getRegionSpecialties() : [];
   story.innerHTML = `<span style="color:#f0ece0"> 市場地区</span><br><br>`
    +`<b> 外国商人との取引</b><br><br>`
    +`異国の衣装をまとった商人が声をかけてきた。他地方の特産品を販売しているが、値は張る。`;
   renderChoices([
    {label:' 品物を見る', fn:()=>{ showIngameShop('khazan'); }},
    {label:' 立ち去る', fn:()=>{
     renderChoices([
      {label:' 散策を続ける', fn:()=>khazanGoDistrict('market', ret)},
      {label:'← 街に戻る', go:'TOWN_KHAZAN'},
     ]);
    }},
   ]);
  }},
  // m14: スリ
  { id:'m14', fn:(ret)=>{
   const story = document.getElementById('story');
   story.innerHTML = `<span style="color:#f0ece0"> 市場地区</span><br><br>`
    +`<b> スリ！</b><br><br>`
    +`人混みの中で誰かが財布に手を伸ばした気配がした。DEXで気づけるか？`;
   dungeonTrySR({ attr:'dex', level:2,
    successTxt:()=>`咄嗟に手を抑えた。スリは舌打ちして逃げ去った。無事だ。`,
    failFn:()=>{ const lost=PC.gold||0; PC.gold=0; PC.sp=0; PC.cp=0; updateHUD();
     story.innerHTML=`<span style="color:#f0ece0"> 市場地区</span><br><br>`
      +`<div style="border:2px solid #c05040;border-radius:4px;padding:12px;background:#180808;margin:8px 0">`
      +`<div style="color:#f0ddd8;font-size:calc(var(--font-sm) + 1px);margin-bottom:8px"> スリ被害</div>`
      +`<div style="color:#f0ece0">気づいたときには財布が消えていた。</div><br>`
      +`<div style="color:#e0d0d0">所持金をすべて失った（-${lost}GP）</div></div>`;
     renderChoices([{label:'▶ OK', fn:()=>renderChoices([
      {label:' 散策を続ける', fn:()=>khazanGoDistrict('market', ret)},
      {label:'← 街に戻る', go:'TOWN_KHAZAN'},
     ])}]);
     return true;
    },
    failTxt:()=>``,
    choicesFn:(ok)=> ok ? [
     {label:' 散策を続ける', fn:()=>khazanGoDistrict('market', ret)},
     {label:'← 街に戻る', go:'TOWN_KHAZAN'},
    ] : [],
   });
  }},
  // m15a/m16b: 相場師（低確率版）
  { id:'m15a', fn:(ret)=>{
   _khazanSpeculator(ret, false);
  }},
  // m15b: 相場師（超低確率版）
  { id:'m15b', fn:(ret)=>{
   _khazanSpeculator(ret, true);
  }},
  // m17: 衛兵の取り締まり
  { id:'m17', fn:(ret)=>{
   const story = document.getElementById('story');
   story.innerHTML = `<span style="color:#f0ece0"> 市場地区</span><br><br>`
    +`<b> 衛兵の取り締まり</b><br><br>`
    +`衛兵が市場を巡回しながら「徴税」と称して金を徴収している。CHRで言い逃れできるか？`;
   dungeonTrySR({ attr:'chr', level:2,
    successTxt:()=>`うまく言いくるめ、徴税を免れた。`,
    failFn:()=>{
     const lost = Math.floor((PC.gold||0)*2/3);
     PC.gold = Math.max(0,(PC.gold||0)-lost); updateHUD();
     story.innerHTML=`<span style="color:#f0ece0"> 市場地区</span><br><br>`
      +`<div style="border:2px solid #c05040;border-radius:4px;padding:12px;background:#180808;margin:8px 0">`
      +`<div style="color:#f0ddd8;font-size:calc(var(--font-sm) + 1px);margin-bottom:8px"> 強制徴税</div>`
      +`<div style="color:#f0ece0">言い逃れに失敗した。衛兵に所持金の2/3を徴収された。</div><br>`
      +`<div style="color:#e0d0d0">没収額：${lost}GP</div></div>`;
     renderChoices([{label:'▶ OK', fn:()=>renderChoices([
      {label:' 散策を続ける', fn:()=>khazanGoDistrict('market', ret)},
      {label:'← 街に戻る', go:'TOWN_KHAZAN'},
     ])}]);
     return true;
    },
    failTxt:()=>``,
    choicesFn:(ok)=> ok ? [
     {label:' 散策を続ける', fn:()=>khazanGoDistrict('market', ret)},
     {label:'← 街に戻る', go:'TOWN_KHAZAN'},
    ] : [],
   });
  }},
  // m18: 荷崩れ事故
  { id:'m18', fn:(ret)=>{
   const story = document.getElementById('story');
   story.innerHTML = `<span style="color:#f0ece0"> 市場地区</span><br><br>`
    +`<b> 荷崩れ事故</b><br><br>`
    +`脇に積まれた荷物が突然崩れ落ちてきた！DEXで回避できるか？`;
   dungeonTrySR({ attr:'dex', level:1,
    successTxt:()=>`咄嗟に飛び退いて難を逃れた。`,
    failFn:()=>{
     const dmg=1+Math.floor(Math.random()*6); PC.con=Math.max(1,PC.con-dmg); updateHUD();
    },
    failTxt:()=>`下敷きになってしまった。<span class="red">CON-${1}（残り${PC.con}）</span>`,
    choicesFn:()=>[
     {label:' 散策を続ける', fn:()=>khazanGoDistrict('market', ret)},
     {label:'← 街に戻る', go:'TOWN_KHAZAN'},
    ],
   });
  }},
  // m19: 自称借金取り
  { id:'m19', fn:(ret)=>{
   const debt = (1+Math.floor(Math.random()*3))*100;
   const story = document.getElementById('story');
   story.innerHTML = `<span style="color:#f0ece0"> 市場地区</span><br><br>`
    +`<b> 自称借金取り</b><br><br>`
    +`強面の男が「お前に${debt}GPの借りがあるはずだ」と迫ってきた。身に覚えがない。`;
   renderChoices([
    {label:` 払う（${debt}GP）`, fn:()=>{
     if((PC.gold||0) >= debt){ PC.gold -= debt; updateHUD(); showSaveToast(`${debt}GPを支払った`); }
     else { const all=PC.gold||0; PC.gold=0; updateHUD(); showSaveToast(`所持金全額（${all}GP）を奪われた`); }
     story.innerHTML += `<br><br><span style="color:#c0b098">金を渡すと男は立ち去った。</span>`;
     renderChoices([
      {label:' 散策を続ける', fn:()=>khazanGoDistrict('market', ret)},
      {label:'← 街に戻る', go:'TOWN_KHAZAN'},
     ]);
    }},
    {label:' 戦う', fn:()=>{
     startCombat({
      enemies:[{name:'自称借金取り', mr:50, curMR:50, armor:2}],
      canFlee:true, win:'__explore_win__', lose:'DEAD',
      _exploreWin:()=>{
       gainAPAll(25); updateHUD();
       const storyEl=document.getElementById('story');
       if(storyEl) storyEl.innerHTML+=`<br><span style="color:#e8e4d8">借金取りを撃退した！経験値+25</span>`;
       renderChoices([
        {label:' 散策を続ける', fn:()=>khazanGoDistrict('market', ret)},
        {label:'← 街に戻る', go:'TOWN_KHAZAN'},
       ]);
      },
     });
     window._exploreReturnNode = ret;
    }},
   ]);
  }},
  // m20: 突然の検問
  { id:'m20', fn:(ret)=>{
   const story = document.getElementById('story');
   story.innerHTML = `<span style="color:#f0ece0"> 市場地区</span><br><br>`
    +`<b> 突然の検問</b><br><br>`
    +`衛兵が市場の出口を封鎖して検問を始めた。CHRで怪しまれずに通過できるか？`;
   dungeonTrySR({ attr:'chr', level:2,
    successTxt:()=>`問題なく通過できた。`,
    failFn:()=>{
     const days=1+Math.floor(Math.random()*6);
     GAME_TIME.totalDays+=days; updateTimebar(); checkAging(); updateHUD();
     story.innerHTML=`<span style="color:#f0ece0"> 市場地区</span><br><br>`
      +`<div style="border:2px solid #c05040;border-radius:4px;padding:12px;background:#180808;margin:8px 0">`
      +`<div style="color:#f0ddd8;font-size:calc(var(--font-sm) + 1px);margin-bottom:8px"> 留置所に収監</div>`
      +`<div style="color:#f0ece0">あらぬ疑いをかけられ、連行された。</div><br>`
      +`<div style="color:#e0d0d0">収監期間：<b>${days}日間</b>（${days}日が経過した）</div></div>`;
     renderChoices([{label:`▶ OK（${days}日後、釈放される）`, fn:()=>renderChoices([
      {label:'← 街に戻る', go:'TOWN_KHAZAN'},
     ])}]);
     return true;
    },
    failTxt:()=>``,
    choicesFn:(ok)=> ok ? [
     {label:' 散策を続ける', fn:()=>khazanGoDistrict('market', ret)},
     {label:'← 街に戻る', go:'TOWN_KHAZAN'},
    ] : [],
   });
  }},
  // m21: 乱闘
  { id:'m21', fn:(ret)=>{
   const story = document.getElementById('story');
   story.innerHTML = `<span style="color:#f0ece0"> 市場地区</span><br><br>`
    +`<b> 市場で乱闘</b><br><br>`
    +`突然、商人同士の言い争いが乱闘に発展した。LKで巻き込まれずに済むか？`;
   dungeonTrySR({ attr:'lk', level:1,
    successTxt:()=>`うまく距離を取り、乱闘に巻き込まれずに済んだ。`,
    failFn:()=>{ const dmg=1+Math.floor(Math.random()*10); PC.con=Math.max(1,PC.con-dmg); updateHUD(); },
    failTxt:()=>`乱闘に巻き込まれ、怪我をした。<span class="red">CON-${1}（残り${PC.con}）</span>`,
    choicesFn:()=>[
     {label:' 散策を続ける', fn:()=>khazanGoDistrict('market', ret)},
     {label:'← 街に戻る', go:'TOWN_KHAZAN'},
    ],
   });
  }},
  // m22: 火事
  { id:'m22', fn:(ret)=>{
   const story = document.getElementById('story');
   story.innerHTML = `<span style="color:#f0ece0"> 市場地区</span><br><br>`
    +`<b> 火事発生！</b><br><br>`
    +`市場の一角から突然火の手が上がった！LKで逃げ切れるか？`;
   dungeonTrySR({ attr:'lk', level:1,
    successTxt:()=>`人混みをかき分けて逃げ出した。無事だった。`,
    failFn:()=>{ const dmg=1+Math.floor(Math.random()*10); PC.con=Math.max(1,PC.con-dmg); updateHUD(); },
    failTxt:()=>`逃げ遅れ、火傷を負った。<span class="red">CON-${1}（残り${PC.con}）</span>`,
    choicesFn:()=>[
     {label:' 散策を続ける', fn:()=>khazanGoDistrict('market', ret)},
     {label:'← 街に戻る', go:'TOWN_KHAZAN'},
    ],
   });
  }},
  // m25: モンスター出現
  { id:'m25', fn:(ret)=>{
   const monsters = [
    {name:'野犬の群れ', mr:18, armor:0},
    {name:'ゴブリン', mr:18, armor:0},
    {name:'スケルトン', mr:20, armor:2},
    {name:'ウルフ', mr:22, armor:0},
   ];
   const m = monsters[Math.floor(Math.random()*monsters.length)];
   const story = document.getElementById('story');
   story.innerHTML = `<span style="color:#f0ece0"> 市場地区</span><br><br>`
    +`<b> モンスター出現！</b><br><br>`
    +`市場の路地から<b>${m.name}</b>が現れた！`;
   renderChoices([
    {label:` 戦う（${m.name}）`, fn:()=>{
     startCombat({
      enemies:[{name:m.name, mr:m.mr, curMR:m.mr, armor:m.armor}],
      canFlee:true, win:'__explore_win__', lose:'DEAD',
      _exploreWin:()=>{
       gainAPAll(Math.floor(m.mr/2)); updateHUD();
       const storyEl=document.getElementById('story');
       if(storyEl) storyEl.innerHTML+=`<br><span style="color:#e8e4d8">撃退した！経験値+${Math.floor(m.mr/2)}</span>`;
       renderChoices([
        {label:' 散策を続ける', fn:()=>khazanGoDistrict('market', ret)},
        {label:'← 街に戻る', go:'TOWN_KHAZAN'},
       ]);
      },
     });
     window._exploreReturnNode = ret;
    }},
    {label:' 逃げる（魅力-1）', fn:()=>{
     PC.chr = Math.max(1,(PC.chr||5)-1); updateHUD();
     story.innerHTML += `<br><br><span class="red">人々の目の前で逃げ去った。魅力 -1</span>`;
     renderChoices([
      {label:' 散策を続ける', fn:()=>khazanGoDistrict('market', ret)},
      {label:'← 街に戻る', go:'TOWN_KHAZAN'},
     ]);
    }},
   ]);
  }},
  // m31: 高品質武器
  { id:'m31', fn:(ret)=>{
   const w = WEAPONS_TABLE[Math.floor(Math.random()*WEAPONS_TABLE.length)];
   const price = w.cost * 3;
   const story = document.getElementById('story');
   story.innerHTML = `<span style="color:#f0ece0"> 市場地区</span><br><br>`
    +`<b> 高品質武器の販売</b><br><br>`
    +`熟練の職人が打ったという<b>${w.name}（強化版）</b>が売りに出されている。<br>`
    +`戦闘時の修正が+10される逸品だが、価格は通常の3倍の<b>${price}GP</b>だ。`;
   renderChoices([
    {label:` 購入する（${price}GP）`, fn:()=>{
     if((PC.gold||0)<price){ showSaveToast('所持金が足りない'); return; }
     PC.gold-=price; updateHUD();
     const enhanced={...w, name:`${w.name}（上質）`, adds:w.adds+10};
     PC.invWeapons=PC.invWeapons||[]; PC.invWeapons.push(enhanced);
     showSaveToast(` ${enhanced.name}を購入した`);
     story.innerHTML+=`<br><br><span style="color:#e8e4d8">${enhanced.name}を手に入れた。+${enhanced.adds}の修正が付いている。</span>`;
     renderChoices([
      {label:' 散策を続ける', fn:()=>khazanGoDistrict('market', ret)},
      {label:'← 街に戻る', go:'TOWN_KHAZAN'},
     ]);
    }},
    {label:' 見送る', fn:()=>{
     story.innerHTML+=`<br><br><span style="color:#c0b098">今回は見送った。</span>`;
     renderChoices([
      {label:' 散策を続ける', fn:()=>khazanGoDistrict('market', ret)},
      {label:'← 街に戻る', go:'TOWN_KHAZAN'},
     ]);
    }},
   ]);
  }},
  // m_legend: 伝説級アイテム
  { id:'m_legend', fn:(ret)=>{
   const w = WEAPONS_TABLE[Math.floor(Math.random()*WEAPONS_TABLE.length)];
   const price = w.cost * 10;
   const story = document.getElementById('story');
   story.innerHTML = `<span style="color:#f0ece0"> 市場地区</span><br><br>`
    +`<b> 伝説級アイテム</b><br><br>`
    +`「一代の名工が最後に打った剣」と囁かれる<b>${w.name}（伝説）</b>が売りに出されている。<br>`
    +`修正が+30されたまさに一品、価格は<b>${price}GP</b>。`;
   renderChoices([
    {label:` 購入する（${price}GP）`, fn:()=>{
     if((PC.gold||0)<price){ showSaveToast('所持金が足りない'); return; }
     PC.gold-=price; updateHUD();
     const legend={...w, name:`${w.name}（伝説）`, adds:w.adds+30};
     PC.invWeapons=PC.invWeapons||[]; PC.invWeapons.push(legend);
     showSaveToast(` ${legend.name}を購入した！`);
     story.innerHTML+=`<br><br><span style="color:#f0ece0"> ${legend.name}を手に入れた！修正+${legend.adds}の至宝だ。</span>`;
     renderChoices([
      {label:' 散策を続ける', fn:()=>khazanGoDistrict('market', ret)},
      {label:'← 街に戻る', go:'TOWN_KHAZAN'},
     ]);
    }},
    {label:' 見送る', fn:()=>{
     story.innerHTML+=`<br><br><span style="color:#c0b098">手が出なかった。</span>`;
     renderChoices([
      {label:' 散策を続ける', fn:()=>khazanGoDistrict('market', ret)},
      {label:'← 街に戻る', go:'TOWN_KHAZAN'},
     ]);
    }},
   ]);
  }},
 ],
 slum: [
  // 1: 物乞い
  { id:'s01', fn:(ret)=>{
   const story = document.getElementById('story');
   story.innerHTML = `<span style="color:#d0c8b8"> 貧民地区</span><br><br>`
    +`<b> 物乞い</b><br><br>`
    +`ぼろをまとった老人が手を差し伸べながら近づいてきた。`;
   renderChoices([
    {label:' 施しをする（1GP）', fn:()=>{
     if((PC.gold||0) >= 1){ PC.gold--; updateHUD(); }
     story.innerHTML += `<br><br><span style="color:#e8e4d8">老人はうなずき、静かに立ち去った。</span>`;
     renderChoices([{label:' 散策を続ける',fn:()=>khazanGoDistrict('slum',ret)},{label:'← 街に戻る',go:'TOWN_KHAZAN'}]);
    }},
    {label:' 断る', fn:()=>{
     dungeonTrySR({attr:'lk',level:1,
      successTxt:()=>`老人は肩を落として去っていった。`,
      failFn:()=>{ const lost=1+Math.floor(Math.random()*6); PC.gold=Math.max(0,(PC.gold||0)-lost); updateHUD();
       const s=document.getElementById('story'); s.innerHTML+=`<br><span class="red">去り際に巧みに財布を抜かれた！-${lost}GP</span>`; return true; },
      failTxt:()=>``,
      choicesFn:()=>[{label:' 散策を続ける',fn:()=>khazanGoDistrict('slum',ret)},{label:'← 街に戻る',go:'TOWN_KHAZAN'}],
     });
    }},
   ]);
  }},
  // 3: 子どものスリ
  { id:'s03', fn:(ret)=>{
   const story = document.getElementById('story');
   story.innerHTML = `<span style="color:#d0c8b8"> 貧民地区</span><br><br>`
    +`<b> 子どものスリ</b><br><br>`
    +`裸足の子どもたちが笑いながら駆け回っている。あっという間に通り過ぎていったが…`;
   dungeonTrySR({attr:'lk',level:1,
    successTxt:()=>`財布に手が触れる感触があったが、寸前で気づいた。子どもは走り去った。`,
    failFn:()=>{ const lost=10+Math.floor(Math.random()*11); PC.gold=Math.max(0,(PC.gold||0)-lost); updateHUD();
     document.getElementById('story').innerHTML+=`<br><span class="red">気づいたときには財布が軽くなっていた。-${lost}GP</span>`; return true; },
    failTxt:()=>``,
    choicesFn:()=>[{label:' 散策を続ける',fn:()=>khazanGoDistrict('slum',ret)},{label:'← 街に戻る',go:'TOWN_KHAZAN'}],
   });
  }},
  // 4: 不衛生環境
  { id:'s04', fn:(ret)=>{
   dungeonTrySR({attr:'con',level:1,
    successTxt:()=>`劣悪な環境だったが、なんとか踏みとどまった。`,
    failFn:()=>{ const dmg=1+Math.floor(Math.random()*6); PC.con=Math.max(1,PC.con-dmg); updateHUD();
     document.getElementById('story').innerHTML+=`<br><span class="red">汚水にやられた。体力-${dmg}（残り${PC.con}）</span>`; return true; },
    failTxt:()=>`汚水が溢れた路地に踏み込んでしまった。`,
    choicesFn:()=>[{label:' 散策を続ける',fn:()=>khazanGoDistrict('slum',ret)},{label:'← 街に戻る',go:'TOWN_KHAZAN'}],
   });
  }},
  // 6: 路地迷い
  { id:'s06', fn:(ret)=>{
   const story = document.getElementById('story');
   story.innerHTML = `<span style="color:#d0c8b8"> 貧民地区</span><br><br>`
    +`<b> 路地で迷う</b><br><br>`
    +`入り組んだ路地を歩いていると、完全に方向感覚を失った。日が暮れるまで迷い続けた。`;
   PC._khazanExploreCount = 99;
   renderChoices([{label:'← 街に戻る',go:'TOWN_KHAZAN'}]);
  }},
  // 9: 密輸人
  { id:'s09', fn:(ret)=>{
   const story = document.getElementById('story');
   const slumItems = ['謎の薬瓶','封蝋された革袋','黒布に包まれた小箱','異国の石板','血の染みた地図'];
   const slumItem = slumItems[Math.floor(Math.random()*slumItems.length)];
   const slumPeople = ['影の商人ゴルス','闇の仲介人タルク','黒市場のロージャ','地下室のミルク'];
   const slumPerson = slumPeople[Math.floor(Math.random()*slumPeople.length)];
   const townKeys = Object.keys(TOWNS).filter(t=>t!=='khazan');
   const slumDestId = townKeys[Math.floor(Math.random()*townKeys.length)]||'port_argon';
   const slumDest = TOWNS[slumDestId]||{name:'港町'};
   const slumReward = 40 + Math.floor(Math.random()*81);
   const slumDL = 30 + Math.floor(Math.random()*31);
   story.innerHTML = `<span style="color:#d0c8b8"> 貧民地区</span><br><br>`
    +`<b> 密輸人との接触</b><br><br>`
    +`路地の陰から人影が手招きした。目深に帽子を被った男が声を潜めて言った。<br><br>`
    +`「頼みがある。${slumDest.name}の${slumPerson}に<b>「${slumItem}」</b>を届けてくれ。報酬は${slumReward}GPだ。${slumDL}日以内に頼む」`;
   renderChoices([
    {label:' 引き受ける', fn:()=>{
     PC.quests=PC.quests||[];
     PC.quests.push({id:Date.now()+Math.random(),type:'delivery',status:'active',
      clientName:'謎の密輸人',receiverName:slumPerson,item:slumItem,toTownId:slumDestId,
      destIcon:'',destLabel:'闇の取引',reward:slumReward,deadlineDays:slumDL,issuedDay:GAME_TIME.totalDays,
      crossRegion:getRegionKey('khazan')!==getRegionKey(slumDestId)});
     story.innerHTML+=`<br><br><span style="color:#e8e4d8">荷物を懐に隠した。</span>`;
     renderChoices([{label:' 散策を続ける',fn:()=>khazanGoDistrict('slum',ret)},{label:'← 街に戻る',go:'TOWN_KHAZAN'}]);
    }},
    {label:' 断る', fn:()=>{
     story.innerHTML+=`<br><br><span style="color:#c0b098">男は舌打ちして消えた。</span>`;
     renderChoices([{label:' 散策を続ける',fn:()=>khazanGoDistrict('slum',ret)},{label:'← 街に戻る',go:'TOWN_KHAZAN'}]);
    }},
   ]);
  }},
  // 12: 闇医者
  { id:'s12', fn:(ret)=>{
   const story = document.getElementById('story');
   const surgAttrs = ['st','iq','lk','con','dex','chr','spd'];
   const surgNames = {st:'強さ',iq:'知力',lk:'運',con:'体力',dex:'器用さ',chr:'魅力',spd:'素早さ'};
   const hasGold = (PC.gold||0)>=3000;
   story.innerHTML = `<span style="color:#d0c8b8"> 貧民地区</span><br><br>`
    +`<b> 闇医者の診療所</b><br><br>`
    +`廃屋の地下に怪しげな看板がある。「身体改造——3000GP——成功率50%——失敗で半減」`
    +(!hasGold?`<br><br><span style="color:#e0d0d0">（所持金が3000GP必要。現在${PC.gold||0}GP）</span>`:'');
   renderChoices([
    ...(hasGold?[{label:' 手術を受ける（3000GP）',fn:()=>{
     story.innerHTML+=`<br><br>手術台に横になる。どの能力値を強化するか？`;
     renderChoices(surgAttrs.map(a=>({label:`${surgNames[a]}（現在 ${PC[a]}）`,fn:()=>{
      PC.gold-=3000; updateHUD();
      if(Math.random()<0.5){
       PC[a]=(PC[a]||0)+10;
       if(a==='maxCon'||a==='con') PC.maxCon=Math.max(PC.maxCon||0,PC.con);
       if(a==='st') PC.maxSt=Math.max(PC.maxSt||0,PC.st);
       updateHUD();
       story.innerHTML=`<span style="color:#d0c8b8"> 貧民地区</span><br><br><span style="color:#e8e4d8"> 手術成功！${surgNames[a]} +10</span>`;
      } else {
       const old=PC[a]||1; PC[a]=Math.max(1,Math.floor(old/2));
       if(a==='con'){PC.maxCon=Math.max(1,Math.floor((PC.maxCon||old)/2));PC.con=Math.min(PC.con,PC.maxCon);}
       if(a==='st'){PC.maxSt=Math.max(1,Math.floor((PC.maxSt||old)/2));}
       updateHUD();
       story.innerHTML=`<span style="color:#d0c8b8"> 貧民地区</span><br><br><span class="red"> 手術失敗…${surgNames[a]} 半減（${old}→${PC[a]}）</span>`;
      }
      addLifeEvent('',`闇医者の手術を受けた（${surgNames[a]}）`);
      renderChoices([{label:' 散策を続ける',fn:()=>khazanGoDistrict('slum',ret)},{label:'← 街に戻る',go:'TOWN_KHAZAN'}]);
     }})));
    }}]:[]),
    {label:' 立ち去る',fn:()=>{
     story.innerHTML+=`<br><br><span style="color:#c0b098">立ち去った。</span>`;
     renderChoices([{label:' 散策を続ける',fn:()=>khazanGoDistrict('slum',ret)},{label:'← 街に戻る',go:'TOWN_KHAZAN'}]);
    }},
   ]);
  }},
  // 13: スリ集団
  { id:'s13', fn:(ret)=>{
   const story = document.getElementById('story');
   story.innerHTML = `<span style="color:#d0c8b8"> 貧民地区</span><br><br>`
    +`<b> スリ集団</b><br><br>`
    +`人だかりに紛れ込んだと思ったら四方を囲まれていた。`;
   dungeonTrySR({attr:'dex',level:2,
    successTxt:()=>`素早く動いて財布を守りきった。`,
    failFn:()=>{ const lost=PC.gold||0; PC.gold=0; PC.sp=0; PC.cp=0; updateHUD();
     document.getElementById('story').innerHTML+=`<br><span class="red">所持金全額（${lost}GP相当）を失った！</span>`; return true; },
    failTxt:()=>``,
    choicesFn:()=>[{label:' 散策を続ける',fn:()=>khazanGoDistrict('slum',ret)},{label:'← 街に戻る',go:'TOWN_KHAZAN'}],
   });
  }},
  // 14: 強盗
  { id:'s14', fn:(ret)=>{
   const story = document.getElementById('story');
   story.innerHTML = `<span style="color:#d0c8b8"> 貧民地区</span><br><br>`
    +`<b> 強盗襲撃</b><br><br>`
    +`路地から剣を抜いた男が飛び出してきた。「有り金を出せ！」`;
   renderChoices([{label:' 戦う',fn:()=>startCombat({enemies:[{name:'強盗',mr:50,curMR:50,armor:0}],canFlee:true,
    onWin:()=>{ document.getElementById('story').innerHTML=`<span style="color:#d0c8b8"> 貧民地区</span><br><br><span style="color:#e8e4d8">強盗を撃退した。</span>`;
     renderChoices([{label:' 散策を続ける',fn:()=>khazanGoDistrict('slum',ret)},{label:'← 街に戻る',go:'TOWN_KHAZAN'}]); },
    win:'__noop__',lose:'DEAD'})}]);
  }},
  // 15: 暗殺者
  { id:'s15', fn:(ret)=>{
   const story = document.getElementById('story');
   story.innerHTML = `<span style="color:#d0c8b8"> 貧民地区</span><br><br>`
    +`<b> 暗殺者</b><br><br>`
    +`全身黒ずくめの人影が無言で近づいてくる。その目に感情はない。`;
   renderChoices([{label:' 戦う',fn:()=>startCombat({enemies:[{name:'暗殺者',mr:100,curMR:100,armor:5}],canFlee:true,
    onWin:()=>{ document.getElementById('story').innerHTML=`<span style="color:#d0c8b8"> 貧民地区</span><br><br><span style="color:#e8e4d8">暗殺者を退けた。</span>`;
     renderChoices([{label:' 散策を続ける',fn:()=>khazanGoDistrict('slum',ret)},{label:'← 街に戻る',go:'TOWN_KHAZAN'}]); },
    win:'__noop__',lose:'DEAD'})}]);
  }},
  // 16: 病気
  { id:'s16', fn:(ret)=>{
   PC.con=Math.max(1,PC.con-5); updateHUD();
   const story=document.getElementById('story');
   story.innerHTML=`<span style="color:#d0c8b8"> 貧民地区</span><br><br><span class="red"> 病気感染<br><br>劣悪な空気で体調を崩した。CON-5（残り${PC.con}）</span>`;
   renderChoices([{label:' 散策を続ける',fn:()=>khazanGoDistrict('slum',ret)},{label:'← 街に戻る',go:'TOWN_KHAZAN'}]);
  }},
  // 19: 隠し財産
  { id:'s19', fn:(ret)=>{
   const story=document.getElementById('story');
   story.innerHTML=`<span style="color:#d0c8b8"> 貧民地区</span><br><br>`
    +`<b> 盗賊の隠し財産</b><br><br>`
    +`廃屋の壁裏に隠し入口を発見。守り手がいるが財宝が眠っているようだ。`;
   renderChoices([
    {label:' 踏み込む',fn:()=>startCombat({enemies:[{name:'財宝の守り手',mr:100,curMR:100,armor:3}],canFlee:true,
     onWin:()=>{ const gp=30+Math.floor(Math.random()*151); gainGPAll(gp); updateHUD();
      document.getElementById('story').innerHTML+=`<br><span style="color:#e8e4d8">金貨の袋を発見！+${gp}GP</span>`;
      renderChoices([{label:' 散策を続ける',fn:()=>khazanGoDistrict('slum',ret)},{label:'← 街に戻る',go:'TOWN_KHAZAN'}]); },
     win:'__noop__',lose:'DEAD'})},
    {label:' 立ち去る',fn:()=>{ story.innerHTML+=`<br><br><span style="color:#c0b098">立ち去った。</span>`;
     renderChoices([{label:' 散策を続ける',fn:()=>khazanGoDistrict('slum',ret)},{label:'← 街に戻る',go:'TOWN_KHAZAN'}]); }},
   ]);
  }},
  // 22: 密輸品
  { id:'s22', fn:(ret)=>{
   PC.invSpecialties=PC.invSpecialties||[];
   const allSpecs=[];
   Object.entries(REGION_SPECIALTIES).forEach(([rk,items])=>{
    if(rk!=='khazan_region') items.forEach(it=>allSpecs.push({...it,regionKey:rk}));
   });
   const picks=[]; const pool=[...allSpecs];
   for(let i=0;i<3&&pool.length;i++){ const idx=Math.floor(Math.random()*pool.length); picks.push(pool.splice(idx,1)[0]); }
   picks.forEach(it=>PC.invSpecialties.push({...it})); updateHUD();
   const story=document.getElementById('story');
   story.innerHTML=`<span style="color:#d0c8b8"> 貧民地区</span><br><br>`
    +`<span style="color:#e8e4d8"> 遠方の密輸品<br><br>廃屋の隅に打ち捨てられた荷物を発見。他地方の特産品だ。</span><br><br>`
    +picks.map(it=>`${it.icon} <b>${it.name}</b>`).join('<br>');
   renderChoices([{label:' 散策を続ける',fn:()=>khazanGoDistrict('slum',ret)},{label:'← 街に戻る',go:'TOWN_KHAZAN'}]);
  }},
  // 23: 盗賊アジト
  { id:'s23', fn:(ret)=>{
   const story=document.getElementById('story');
   story.innerHTML=`<span style="color:#d0c8b8"> 貧民地区</span><br><br>`
    +`<b> 盗賊団のアジト</b><br><br>`
    +`廃屋の扉の向こうから武装した盗賊たちの声が聞こえる。財宝があるかもしれない。`;
   renderChoices([
    {label:' 踏み込む（盗賊×5）',fn:()=>startCombat({enemies:Array(5).fill({}).map(()=>({name:'盗賊',mr:30,curMR:30,armor:0})),canFlee:true,
     onWin:()=>{ const gp=10+Math.floor(Math.random()*21); gainGPAll(gp); updateHUD();
      document.getElementById('story').innerHTML+=`<br><span style="color:#e8e4d8">アジト制圧！+${gp}GP</span>`;
      renderChoices([{label:' 散策を続ける',fn:()=>khazanGoDistrict('slum',ret)},{label:'← 街に戻る',go:'TOWN_KHAZAN'}]); },
     win:'__noop__',lose:'DEAD'})},
    {label:' 立ち去る',fn:()=>{ story.innerHTML+=`<br><br><span style="color:#c0b098">静かに離れた。</span>`;
     renderChoices([{label:' 散策を続ける',fn:()=>khazanGoDistrict('slum',ret)},{label:'← 街に戻る',go:'TOWN_KHAZAN'}]); }},
   ]);
  }},
  // 25: 暴動
  { id:'s25', fn:(ret)=>{
   const story=document.getElementById('story');
   story.innerHTML=`<span style="color:#d0c8b8"> 貧民地区</span><br><br>`
    +`<b> 暴動発生</b><br><br>`
    +`衛兵隊と暴徒が激突している。どう動くか。`;
   renderChoices([
    {label:' 暴徒に加担する',fn:()=>{
     let r25r=0; const r25go=()=>{
      if(r25r>=3){
       dungeonTrySR({attr:'lk',level:2,
        successFn:()=>{ changeTrust('khazan',10); addLifeEvent('','暴動加担・逮捕免れ。信頼度+10'); },
        successTxt:()=>`逃げ切った！貧民地区の民から感謝される。信頼度+10`,
        failFn:()=>{ const sl=1+Math.floor(Math.random()*6);
         GAME_TIME.totalDays+=180; updateTimebar(); checkAging();
         PC.st=Math.max(1,PC.st-sl); PC.maxSt=Math.max(1,(PC.maxSt||PC.st)-sl); updateHUD();
         addLifeEvent('','暴動加担で逮捕。6カ月勾留。ST恒久減少。'); return true; },
        failTxt:()=>`逮捕された。6カ月の勾留でSTが減少した…`,
        choicesFn:()=>[{label:'← 街に戻る',go:'TOWN_KHAZAN'}],
       }); return;
      }
      r25r++;
      startCombat({enemies:Array(4).fill({}).map(()=>({name:'衛兵',mr:50,curMR:50,armor:3})),canFlee:false,onWin:()=>r25go(),win:'__noop__',lose:'DEAD'});
     }; r25go();
    }},
    {label:' 関与しない',fn:()=>{ story.innerHTML+=`<br><br><span style="color:#c0b098">身を潜めて嵐をやり過ごした。</span>`;
     renderChoices([{label:' 散策を続ける',fn:()=>khazanGoDistrict('slum',ret)},{label:'← 街に戻る',go:'TOWN_KHAZAN'}]); }},
    {label:' 鎮圧に協力する',fn:()=>{
     let r25rc=0; const r25goc=()=>{
      if(r25rc>=3){
       story.innerHTML=`<span style="color:#d0c8b8"> 貧民地区</span><br><br><span style="color:#e8e4d8"> 鎮圧完了！衛兵隊から感謝された。</span>`;
       changeTrust('khazan',5); addLifeEvent('','暴動鎮圧に協力。');
       renderChoices([{label:'← 街に戻る',go:'TOWN_KHAZAN'}]); return;
      }
      r25rc++;
      startCombat({enemies:Array(20).fill({}).map(()=>({name:'暴徒',mr:10,curMR:10,armor:0})),canFlee:false,onWin:()=>r25goc(),win:'__noop__',lose:'DEAD'});
     }; r25goc();
    }},
   ]);
  }},
  // 26: 火災
  { id:'s26', fn:(ret)=>{
   const story=document.getElementById('story');
   story.innerHTML=`<span style="color:#d0c8b8"> 貧民地区</span><br><br>`
    +`<b> 火災発生</b><br><br>`
    +`路地の向こうで炎が上がった。煙が充満してくる。`;
   dungeonTrySR({attr:'lk',level:2,
    successTxt:()=>`煙の中を駆け抜け、間一髪で逃げ出した。`,
    failFn:()=>{ const dmg=3+Math.floor(Math.random()*16); PC.con=Math.max(1,PC.con-dmg); updateHUD();
     document.getElementById('story').innerHTML+=`<br><span class="red">炎に巻き込まれた！体力-${dmg}（残り${PC.con}）</span>`; return true; },
    failTxt:()=>``,
    choicesFn:()=>[{label:' 散策を続ける',fn:()=>khazanGoDistrict('slum',ret)},{label:'← 街に戻る',go:'TOWN_KHAZAN'}],
   });
  }},
  // 27: モンスター
  { id:'s27', fn:(ret)=>{
   const story=document.getElementById('story');
   const slumMons=[{name:'大ネズミ',mr:15},{name:'スカベンジャー',mr:20},{name:'ゴブリン',mr:20}];
   const sm=slumMons[Math.floor(Math.random()*slumMons.length)];
   story.innerHTML=`<span style="color:#d0c8b8"> 貧民地区</span><br><br>`
    +`<b> モンスター出没</b><br><br>`
    +`路地から${sm.name}が現れた！住民たちが逃げ惑っている。`;
   renderChoices([{label:` ${sm.name}を討伐する`,fn:()=>startCombat({enemies:[{name:sm.name,mr:sm.mr,curMR:sm.mr,armor:0}],canFlee:true,
    onWin:()=>{ document.getElementById('story').innerHTML=`<span style="color:#d0c8b8"> 貧民地区</span><br><br><span style="color:#e8e4d8">${sm.name}を討伐した。住民たちが安堵している。</span>`;
     renderChoices([{label:' 散策を続ける',fn:()=>khazanGoDistrict('slum',ret)},{label:'← 街に戻る',go:'TOWN_KHAZAN'}]); },
    win:'__noop__',lose:'DEAD'})}]);
  }},
  // 28: 衛兵突入
  { id:'s28', fn:(ret)=>{
   const story=document.getElementById('story');
   story.innerHTML=`<span style="color:#d0c8b8"> 貧民地区</span><br><br>`
    +`<b> 衛兵の突入</b><br><br>`
    +`衛兵隊が貧民地区に突入してきた。混乱の中、剣先があなたに向く。`;
   dungeonTrySR({attr:'lk',level:2,
    successTxt:()=>`「無関係だ！」素早く叫ぶと、衛兵は別方向へ走り去った。`,
    failFn:()=>{ return true; },
    failTxt:()=>``,
    choicesFn:(ok)=>ok
     ?[{label:' 散策を続ける',fn:()=>khazanGoDistrict('slum',ret)},{label:'← 街に戻る',go:'TOWN_KHAZAN'}]
     :[{label:' 戦う（衛兵MR30）',fn:()=>startCombat({enemies:[{name:'衛兵',mr:30,curMR:30,armor:3}],canFlee:true,
    onWin:()=>{ document.getElementById('story').innerHTML=`<span style="color:#d0c8b8"> 貧民地区</span><br><br><span style="color:#e8e4d8">衛兵を撃退した。急いでその場を離れた。</span>`;
     renderChoices([{label:' 散策を続ける',fn:()=>khazanGoDistrict('slum',ret)},{label:'← 街に戻る',go:'TOWN_KHAZAN'}]); },
    win:'__noop__',lose:'DEAD'})}],
   });
  }},
  // 30: 建物崩壊
  { id:'s30', fn:(ret)=>{
   const story=document.getElementById('story');
   story.innerHTML=`<span style="color:#d0c8b8"> 貧民地区</span><br><br>`
    +`<b> 建物崩壊</b><br><br>`
    +`老朽化した建物が突然崩れ始めた。瓦礫が降り注ぐ！`;
   dungeonTrySR({attr:'lk',level:2,
    successTxt:()=>`間一髪で飛び退いた。瓦礫がすぐ脇に落ちた。`,
    failFn:()=>{ const dmg=6+Math.floor(Math.random()*31); PC.con=Math.max(1,PC.con-dmg); updateHUD();
     document.getElementById('story').innerHTML+=`<br><span class="red">瓦礫の下敷きに！体力-${dmg}（残り${PC.con}）</span>`; return true; },
    failTxt:()=>``,
    choicesFn:()=>[{label:' 散策を続ける',fn:()=>khazanGoDistrict('slum',ret)},{label:'← 街に戻る',go:'TOWN_KHAZAN'}],
   });
  }},
  // 33: 疫病
  { id:'s33', fn:(ret)=>{
   const story=document.getElementById('story');
   story.innerHTML=`<span style="color:#d0c8b8"> 貧民地区</span><br><br>`
    +`<b> 大規模疫病</b><br><br>`
    +`路地のそこかしこで人が倒れている。この地区に疫病が蔓延しているようだ。`;
   dungeonTrySR({attr:'con',level:2,
    successTxt:()=>`なんとか感染を免れた。急いでその場を離れた。`,
    failFn:()=>{ const old=PC.st; PC.st=Math.max(1,Math.floor(old/2)); PC.maxSt=Math.max(1,Math.floor((PC.maxSt||old)/2)); updateHUD();
     addLifeEvent('','疫病感染。ST恒久的に半減。'); return true; },
    failTxt:()=>`疫病に感染した。後遺症でSTが半減した…`,
    choicesFn:()=>[{label:' 散策を続ける',fn:()=>khazanGoDistrict('slum',ret)},{label:'← 街に戻る',go:'TOWN_KHAZAN'}],
   });
  }},
  // 35: 反乱
  { id:'s35', fn:(ret)=>{
   const story=document.getElementById('story');
   story.innerHTML=`<span style="color:#d0c8b8"> 貧民地区</span><br><br>`
    +`<b> 大規模反乱</b><br><br>`
    +`貧民地区全体が戦場と化している。衛兵隊と反乱軍の大規模衝突だ。`;
   renderChoices([
    {label:' 反乱に加担する',fn:()=>{
     let s35r=0; const s35go=()=>{
      if(s35r>=10){
       dungeonTrySR({attr:'lk',level:2,
        successFn:()=>{ changeTrust('khazan',50); addLifeEvent('','反乱加担・英雄となる。信頼度+50'); },
        successTxt:()=>`反乱軍が勝利した！英雄として讃えられる。信頼度+50`,
        failFn:()=>{ const sl=3+Math.floor(Math.random()*16);
         GAME_TIME.totalDays+=3600; updateTimebar(); checkAging();
         PC.st=Math.max(1,PC.st-sl); PC.maxSt=Math.max(1,(PC.maxSt||PC.st)-sl); updateHUD();
         addLifeEvent('','反乱加担で逮捕。10年勾留。ST恒久大幅減少。'); return true; },
        failTxt:()=>`捕らえられた。10年の勾留でSTが大きく失われた…`,
        choicesFn:()=>[{label:'← 街に戻る',go:'TOWN_KHAZAN'}],
       }); return;
      }
      s35r++;
      startCombat({enemies:Array(10).fill({}).map(()=>({name:'衛兵',mr:50,curMR:50,armor:3})),canFlee:false,onWin:()=>s35go(),win:'__noop__',lose:'DEAD'});
     }; s35go();
    }},
    {label:' 関与しない',fn:()=>{ story.innerHTML+=`<br><br><span style="color:#c0b098">静かに立ち去った。</span>`;
     renderChoices([{label:'← 街に戻る',go:'TOWN_KHAZAN'}]); }},
    {label:' 鎮圧に協力する',fn:()=>{
     let s35rc=0; const s35goc=()=>{
      if(s35rc>=5){
       story.innerHTML=`<span style="color:#d0c8b8"> 貧民地区</span><br><br><span style="color:#e8e4d8"> 反乱鎮圧。衛兵隊から報奨を受けた。</span>`;
       changeTrust('khazan',10); addLifeEvent('','反乱鎮圧に協力。');
       renderChoices([{label:'← 街に戻る',go:'TOWN_KHAZAN'}]); return;
      }
      s35rc++;
      startCombat({enemies:Array(30).fill({}).map(()=>({name:'反乱者',mr:10,curMR:10,armor:0})),canFlee:false,onWin:()=>s35goc(),win:'__noop__',lose:'DEAD'});
     }; s35goc();
    }},
   ]);
  }},
 ]

};

// 相場師イベント共通処理
function _khazanSpeculator(ret, hardMode){
 const story = document.getElementById('story');
 story.innerHTML = `<span style="color:#f0ece0"> 市場地区</span><br><br>`
  +`<b> 相場師の接触</b><br><br>`
  +`怪しげな男が近づいてきた。「100GPを出資してくれれば、大きなリターンが期待できる。どうだ？」`;
 renderChoices([
  {label:' 100GPを出資する', fn:()=>{
   if((PC.gold||0)<100){ showSaveToast('所持金が足りない'); return; }
   PC.gold-=100; updateHUD();
   const roll=d6();
   const threshold = hardMode ? 6 : 5; // hardMode:6以上のみ成功
   if(roll>=threshold){
    const bonus=hardMode?(200+Math.floor(Math.random()*1001/100)*100):(100+Math.floor(Math.random()*501/100)*100);
    const total=100+bonus;
    gainGPAll(total); updateHUD();
    story.innerHTML+=`<br><br><span style="color:#e8e4d8">投資が当たった！${total}GPが返ってきた！（+${bonus}GP）</span>`;
   } else {
    story.innerHTML+=`<br><br><span class="red">詐欺だった。100GPは戻らない……</span>`;
   }
   renderChoices([
    {label:' 散策を続ける', fn:()=>khazanGoDistrict('market', ret)},
    {label:'← 街に戻る', go:'TOWN_KHAZAN'},
   ]);
  }},
  {label:' 断る', fn:()=>{
   story.innerHTML+=`<br><br><span style="color:#c0b098">怪しいと思い断った。男は舌打ちして立ち去った。</span>`;
   renderChoices([
    {label:' 散策を続ける', fn:()=>khazanGoDistrict('market', ret)},
    {label:'← 街に戻る', go:'TOWN_KHAZAN'},
   ]);
  }},
 ]);
}

const EXPLORE_EVENTS = {
 khazan: [
 //  路地裏で財布
 { title:' 路地裏で財布を拾った',
 intro:`石畳の隙間に落ちた財布を見つけた。ずっしり重い。落とした主を探すべきか…`,
 sr:{attr:'lk', level:1},
 onSuccess:()=>{ const gp=20+Math.floor(Math.random()*11); gainGPAll(gp); updateHUD();
 return `財布を届け出ようとしたら、ちょうど持ち主の商人が血相を変えて走ってきた。礼金をたっぷり受け取った。<br><span style="color:#e8e4d8">+${gp}GP　経験値+${Math.round(gp*0.5)}</span>`; },
 onFail:()=>{ const gp=5+Math.floor(Math.random()*6); gainGPAll(gp); updateHUD();
 return `持ち主は見つからなかったが、財布の中身は少し頂いた。<br><span style="color:#e8e4d8">+${gp}GP</span>`; }
 },
 //  老剣士
 { title:' 老剣士に話しかけられた',
 intro:`酒場の前で元兵士風の老人が話しかけてきた。剣の極意を語り始めたが、難解な話だ…`,
 sr:{attr:'iq', level:1},
 onSuccess:()=>{ const ap=20+Math.floor(Math.random()*11); gainAPAll(ap); updateHUD();
 return `難解な話の核心を掴んだ。老剣士は目を細めて「才がある」と呟いた。<br><span style="color:#e8e4d8">経験値+${ap}</span>`; },
 onFail:()=>{ const ap=5+Math.floor(Math.random()*6); gainAPAll(ap); updateHUD();
 return `難しい話で半分も理解できなかったが、それでも少し学ぶことがあった。<br><span style="color:#e8e4d8">経験値+${ap}</span>`; }
 },
 //  スリ
 { title:' スリに遭った',
 intro:`市場の人混みで誰かが肩にぶつかってきた。財布を抜こうとしている！`,
 sr:{attr:'dex', level:2},
 onSuccess:()=>{ const gp=15+Math.floor(Math.random()*11); const ap=20+Math.floor(Math.random()*11);
 gainGPAll(gp); gainAPAll(ap); updateHUD();
 return `咄嗟に手首を掴んだ。衛兵に引き渡すと、懸賞金が出た。身のこなしが褒められた。<br><span style="color:#e8e4d8">+${gp}GP　経験値+${ap}</span>`; },
 onFail:()=>{ const dmg=1+Math.floor(Math.random()*4); PC.con=Math.max(1,PC.con-dmg); updateHUD();
 return `払いのけたが揉み合いになり怪我をした。財布は辛うじて守った。<br><span class="red">体力-${dmg}（残り${PC.con}）</span>`; }
 },
 //  噂
 { title:' 市場で噂を耳にした',
 intro:`野菜売りのおばさんが声をかけてきた。何やら面白い話を持っているようだ。`,
 sr:{attr:'iq', level:1},
 onSuccess:()=>{ const ap=8+Math.floor(Math.random()*8); gainAPAll(ap); updateHUD();
 const info=pick(['「南の砂漠の向こうに、月の砂金が採れる谷があるらしい。」','「ストーンヘイムの古鉱山に、先人が隠した武器庫があると聞いた。」','「港の倉庫番が言うには、先週の夜光る船を見たそうだ。」','「王城の地下に封印された何かがある。古い文書に書いてあった。」']);
 return `話の行間を読み、重要な情報を引き出せた。<br><br>「${info}」<br><span style="color:#e8e4d8">経験値+${ap}</span>`; },
 onFail:()=>{
 const info=pick(['「砂漠の南に眠る宝の話を聞いたことがあるか？」','「最近、街道に盗賊が増えているらしい。気をつけな。」','「港では珍しい船が入ってくるらしいぞ。」','「ストーンヘイムの鉱山で変なものが出たそうだ。」']);
 return `世間話程度の噂話で終わった。<br><br>「${info}」`; }
 },
 //  屋台の食料
 { title:' 屋台のおじさんに声をかけられた',
 intro:`閉店間際の屋台主人が「余ったから持ってくか？」と声をかけてきた。`,
 sr:{attr:'chr', level:1},
 onSuccess:()=>{ const food=5+Math.floor(Math.random()*4); PC._food=(PC._food||0)+food; updateHUD();
 const ap=5+Math.floor(Math.random()*6); gainAPAll(ap);
 return `気さくに話が弾み、たくさん分けてもらった。「また来いよ」と言われた。<br><span style="color:#e8e4d8">食料+${food}日分　経験値+${ap}</span>`; },
 onFail:()=>{ const food=2+Math.floor(Math.random()*2); PC._food=(PC._food||0)+food; updateHUD();
 return `少し分けてもらった。<br><span style="color:#e8e4d8">食料+${food}日分</span>`; }
 },
 //  賭け試合
 { title:' 広場で賭け試合を見かけた',
 intro:`広場で腕相撲大会が開かれている。賭け金を積んで参加するか？`,
 sr:{attr:'lk', level:2},
 onSuccess:()=>{ const gp=30+Math.floor(Math.random()*21); gainGPAll(gp); updateHUD();
 return `勝ち進んで賞金を掻っ攫った。観衆から歓声が上がった。<br><span style="color:#e8e4d8">+${gp}GP</span>`; },
 onFail:()=>{ const gp=10+Math.floor(Math.random()*11); PC.gold=Math.max(0,PC.gold-gp); updateHUD();
 return `あっさり負けた。賭け金を持っていかれた。<br><span class="red">-${gp}GP</span>`; }
 },
 //  図書館
 { title:' 王都の図書館に立ち寄った',
 intro:`通りがかりに図書館が開いていた。分厚い写本を手に取ると、難解な古代語が並んでいる。`,
 sr:{attr:'iq', level:2},
 onSuccess:()=>{ const ap=20+Math.floor(Math.random()*11); gainAPAll(ap); updateHUD();
 return `古代語を読み解き、冒険者として重要な知見を得た。<br><span style="color:#e8e4d8">経験値+${ap}</span>`; },
 onFail:()=>{ const ap=5+Math.floor(Math.random()*6); gainAPAll(ap); updateHUD();
 return `難しくてほとんど読めなかったが、挿絵から少し学べた。<br><span style="color:#e8e4d8">経験値+${ap}</span>`; }
 },
 //  薬師
 { title:' 市場の薬師に声をかけられた',
 intro:`「顔色が悪い」と旅の薬師が声をかけてきた。薬を処方してもらえそうだ。`,
 sr:{attr:'con', level:1},
 onSuccess:()=>{ const heal=3; PC.con=Math.min(PC.maxCon||99,PC.con+heal); const ap=8+Math.floor(Math.random()*8); gainAPAll(ap); updateHUD();
 return `体が薬に良く反応した。みるみる回復し、薬師も驚いた。<br><span style="color:#e8e4d8">体力+${heal}　経験値+${ap}</span>`; },
 onFail:()=>{ const heal=1; PC.con=Math.min(PC.maxCon||99,PC.con+heal); updateHUD();
 return `薬の効きは弱かったが、少し楽になった。<br><span style="color:#e8e4d8">体力+${heal}</span>`; }
 },
 //  路地の暗殺者
 { title:' 路地裏で暗殺者に狙われた',
 intro:`暗い路地を歩いていると、背後から気配を感じた。振り向くと覆面の男が短剣を構えている。`,
 combat:{
 name:'暗殺者', mr:30, armor:2, isHuman:true, canFlee:true,
 _exploreWin:()=>{ const gp=15+Math.floor(Math.random()*16); const ap=25+Math.floor(Math.random()*16);
 gainGPAll(gp); gainAPAll(ap); updateHUD();
 return `暗殺者を返り討ちにした。懐から依頼書と金貨が出てきた。誰に狙われたのかは不明だ。<br><span style="color:#e8e4d8">+${gp}GP　経験値+${ap}</span>`; }
 }
 },
 //  酔っ払いの喧嘩
 { title:' 酔っ払いに絡まれた',
 intro:`酒場前で酔った男が因縁をつけてきた。「俺の縄張りを歩くなよ！」拳を振り上げてきた。`,
 combat:{
 name:'酔っ払いの荒くれ', mr:18, armor:0, isHuman:true, canFlee:true,
 _exploreWin:()=>{ const gp=8+Math.floor(Math.random()*8); const ap=15+Math.floor(Math.random()*11);
 gainGPAll(gp); gainAPAll(ap); updateHUD();
 return `打ち倒すと野次馬から歓声が上がった。見ていた酒場の主人が「ありがとう」と小金をくれた。<br><span style="color:#e8e4d8">+${gp}GP　経験値+${ap}</span>`; }
 }
 },
 //  衛兵の誤認逮捕
 { title:' 衛兵に犯罪者と間違われた',
 intro:`「そこの冒険者！止まれ！」突然衛兵が二人、剣を抜いて迫ってきた。人違いだと叫んでも聞く耳を持たない。`,
 combat:{
 enemies:[{name:'衛兵A',mr:25,armor:3},{name:'衛兵B',mr:25,armor:3}], isHuman:true, canFlee:true,
 _exploreWin:()=>{ const ap=30+Math.floor(Math.random()*16); gainAPAll(ap); updateHUD();
 return `二人を倒すと上官が現れ、誤認と分かり謝罪された。この経験が戦闘技術を高めた。<br><span style="color:#e8e4d8">経験値+${ap}</span>`; }
 }
 },
 //  市場の用心棒
 { title:' 市場の用心棒に難癖をつけられた',
 intro:`市場で見ていた商品を「触るなら買え」と用心棒が凄んできた。周囲が息をのんで見ている。`,
 combat:{
 name:'悪徳用心棒', mr:28, armor:2, isHuman:true, canFlee:true,
 _exploreWin:()=>{ const gp=20+Math.floor(Math.random()*11); const ap=20+Math.floor(Math.random()*11);
 gainGPAll(gp); gainAPAll(ap); updateHUD();
 return `用心棒を倒すと商人たちが拍手した。「いつも困っていた」と感謝されて謝礼をもらった。<br><span style="color:#e8e4d8">+${gp}GP　経験値+${ap}</span>`; }
 }
 },
 //  闇ギルドの刺客
 { title:' 闇ギルドの刺客が現れた',
 intro:`人気のない路地に引き込まれた。「お前の噂は聞いた。ここで消えてもらう」と仮面の男が現れた。`,
 combat:{
 name:'闇ギルドの刺客', mr:45, armor:3, isHuman:true, canFlee:false,
 _exploreWin:()=>{ const gp=30+Math.floor(Math.random()*21); const ap=40+Math.floor(Math.random()*21);
 gainGPAll(gp); gainAPAll(ap); updateHUD();
 return `刺客を返り討ちにした。懐から報酬金と暗号の書状が見つかった。只者ではなかったようだ。<br><span style="color:#e8e4d8">+${gp}GP　経験値+${ap}</span>`; }
 }
 },
 ],

 al_rashid: [
 //  荷運び
 { title:' 隊商の荷運びを手伝った',
 intro:`荷物を抱えて困っている商人に声をかけた。「一緒に運んでくれるか？」と頼まれた。`,
 sr:{attr:'st', level:1},
 onSuccess:()=>{ const gp=20+Math.floor(Math.random()*16); const ap=10+Math.floor(Math.random()*11); gainGPAll(gp); gainAPAll(ap); updateHUD();
 return `重い荷を軽々と運んだ。商人は感心して報酬を弾んでくれた。「また頼みたい」と名前を聞かれた。<br><span style="color:#e8e4d8">+${gp}GP　経験値+${ap}</span>`; },
 onFail:()=>{ const gp=8+Math.floor(Math.random()*8); gainGPAll(gp); updateHUD();
 return `何とか運び終えたが、へとへとになった。商人は最低限の礼を渡した。<br><span style="color:#e8e4d8">+${gp}GP</span>`; }
 },
 //  占い師
 { title:' 砂漠の占い師に会った',
 intro:`天幕の中の老婆が手招きした。砂に描かれた紋様を見て、何か語ろうとしている。`,
 sr:{attr:'iq', level:1},
 onSuccess:()=>{ const ap=15+Math.floor(Math.random()*11); gainAPAll(ap); PC.lk=Math.min(30,(PC.lk||10)+1); updateHUD();
 return `占い師の言葉の深意を理解した。砂漠の摂理を学び、運が開けた気がする。<br><span style="color:#e8e4d8">経験値+${ap}　LK+1</span>`; },
 onFail:()=>{ const ap=5+Math.floor(Math.random()*6); gainAPAll(ap); updateHUD();
 return `難解な言葉で半分も理解できなかったが、何となく教訓を得た。<br><span style="color:#e8e4d8">経験値+${ap}</span>`; }
 },
 //  騙し商人
 { title:' 香辛料商人に声をかけられた',
 intro:`「最上級品だ、破格で売る」と商人が近づいてきた。目が泳いでいる気がするが…`,
 sr:{attr:'lk', level:2},
 onSuccess:()=>{ const gp=10+Math.floor(Math.random()*11); const ap=15+Math.floor(Math.random()*11); gainGPAll(gp); gainAPAll(ap); updateHUD();
 return `色をつけた砂だと見破った。衛兵を呼ぶと脅したら商人は詫び金を置いて逃げた。<br><span style="color:#e8e4d8">+${gp}GP　経験値+${ap}</span>`; },
 onFail:()=>{ const gp=15+Math.floor(Math.random()*16); PC.gold=Math.max(0,PC.gold-gp); updateHUD();
 return `買ってみたら砂だった。返金を求めたが商人はすでに姿を消していた。<br><span class="red">-${gp}GP</span>`; }
 },
 //  隊商の宴
 { title:' 隊商が宴を開いていた',
 intro:`長旅を終えた隊商が広場で宴を開いている。輪に加えてもらえるだろうか。`,
 sr:{attr:'chr', level:1},
 onSuccess:()=>{ const food=6+Math.floor(Math.random()*5); PC._food=(PC._food||0)+food; const ap=8+Math.floor(Math.random()*8); gainAPAll(ap); updateHUD();
 return `座の中心になり、歌を一曲披露した。大いに盛り上がり、土産の食料まで持たせてもらった。<br><span style="color:#e8e4d8">食料+${food}日分　経験値+${ap}</span>`; },
 onFail:()=>{ const food=2+Math.floor(Math.random()*3); PC._food=(PC._food||0)+food; updateHUD();
 return `端の席に座らせてもらい、少し食事にありつけた。<br><span style="color:#e8e4d8">食料+${food}日分</span>`; }
 },
 //  旅人の情報
 { title:' 遠方からの旅人に出会った',
 intro:`異国の風貌の旅人が話しかけてきた。砂漠の向こうから来たらしい。`,
 sr:{attr:'iq', level:1},
 onSuccess:()=>{ const ap=10+Math.floor(Math.random()*11); gainAPAll(ap); updateHUD();
 const info=pick(['「砂漠の東の岩山の下に、古代王朝の財宝が眠るという伝説がある。」','「北の大陸では魔法使いが街を支配し始めているらしい。」','「砂漠の深部には人が住む地下都市があると、祖父から聞いた。」','「月が赤くなる夜、オアシスに精霊が現れると遊牧民は言う。」']);
 return `言葉の壁を超えて深い話ができた。得難い情報を引き出した。<br><br>「${info}」<br><span style="color:#e8e4d8">経験値+${ap}</span>`; },
 onFail:()=>{
 const info=pick(['「砂漠の東には古代文明の遺跡が埋まっているという。」','「デュナの遊牧民は砂嵐を三日前に予知できるらしい。」','「オアシス砦の水が最近濁っているそうだ。」','「砂金はサルーンよりも南の岩場に多く眠っているという話だ。」']);
 return `言葉が上手く通じず、断片的な情報しか得られなかった。<br><br>「${info}」`; }
 },
 //  神殿
 { title:' 砂漠の神殿で祈りを捧げた',
 intro:`路地の奥に砂漠の神の祠を見つけた。静かな場所だ。真剣に祈りを捧げてみよう。`,
 sr:{attr:'lk', level:1},
 onSuccess:()=>{ PC.lk=Math.min(30,(PC.lk||10)+1); const ap=10+Math.floor(Math.random()*11); gainAPAll(ap); updateHUD();
 return `祈りが届いた気がした。心が澄み渡り、砂漠の神の加護を感じる。<br><span style="color:#e8e4d8">LK+1　経験値+${ap}</span>`; },
 onFail:()=>{ PC.lk=Math.min(30,(PC.lk||10)+1); updateHUD();
 return `神の意思は測りかねるが、それでも祈りを捧げた意味はあるだろう。<br><span style="color:#e8e4d8">LK+1</span>`; }
 },
 //  熱波
 { title:' 砂漠の熱気に晒された',
 intro:`突然、強烈な熱波が来た。日陰もない。この灼熱を耐え抜けるか？`,
 sr:{attr:'con', level:2},
 onSuccess:()=>{ const ap=12+Math.floor(Math.random()*11); gainAPAll(ap); updateHUD();
 return `歯を食いしばって耐えた。倒れそうになったが踏みとどまった。この経験が体を鍛えた。<br><span style="color:#e8e4d8">経験値+${ap}（鍛錬）</span>`; },
 onFail:()=>{ const dmg=1+Math.floor(Math.random()*3); PC.con=Math.max(1,PC.con-dmg); updateHUD();
 return `日差しを侮っていた。強烈な熱波に倒れそうになり、しばらく動けなかった。<br><span class="red">体力-${dmg}（残り${PC.con}）</span>`; }
 },
 //  大道芸人
 { title:' 大道芸人の帽子が飛んだ',
 intro:`風で大道芸人の帽子が飛び、人混みの中に消えた。追いかければ礼をもらえそうだが。`,
 sr:{attr:'dex', level:1},
 onSuccess:()=>{ const gp=15+Math.floor(Math.random()*11); const ap=8+Math.floor(Math.random()*8); gainGPAll(gp); gainAPAll(ap); updateHUD();
 return `人混みを縫って帽子を華麗にキャッチ。芸人は大喜びで報酬を弾み、技を少し教えてくれた。<br><span style="color:#e8e4d8">+${gp}GP　経験値+${ap}</span>`; },
 onFail:()=>{ const gp=3+Math.floor(Math.random()*6); gainGPAll(gp); updateHUD();
 return `何とか帽子を拾って渡した。芸人は少しだけ礼をくれた。<br><span style="color:#e8e4d8">+${gp}GP</span>`; }
 },
 //  砂漠の略奪者
 { title:' 砂漠の略奪者に襲われた',
 intro:`市場の外れを歩いていると、砂漠からやってきた荒くれ者が財布を狙って飛び出してきた。`,
 combat:{
 name:'砂漠の略奪者', mr:28, armor:1, isHuman:true, canFlee:true,
 _exploreWin:()=>{ const gp=18+Math.floor(Math.random()*13); const ap=22+Math.floor(Math.random()*13);
 gainGPAll(gp); gainAPAll(ap); updateHUD();
 return `略奪者を倒すと、奪われた旅人の荷物が出てきた。礼として分け前をもらった。<br><span style="color:#e8e4d8">+${gp}GP　経験値+${ap}</span>`; }
 }
 },
 //  砂嵐の中の盗賊団
 { title:' 砂嵐に紛れた盗賊団に囲まれた',
 intro:`突然の砂嵐で視界が遮られた。嵐に乗じた盗賊団が周囲から現れた。逃げ道がない。`,
 combat:{
 enemies:[{name:'砂漠の盗賊A',mr:22,armor:1},{name:'砂漠の盗賊B',mr:22,armor:1}], isHuman:true, canFlee:false,
 _exploreWin:()=>{ const gp=25+Math.floor(Math.random()*16); const ap=30+Math.floor(Math.random()*16);
 gainGPAll(gp); gainAPAll(ap); updateHUD();
 return `砂嵐の中で二人を退けた。盗賊のアジトの鍵と略奪品が見つかった。<br><span style="color:#e8e4d8">+${gp}GP　経験値+${ap}</span>`; }
 }
 },
 //  砂漠のオーク
 { title:' 砂漠のオークが路地に迷い込んだ',
 intro:`裏通りで砂漠から迷い込んだ凶暴なオークと鉢合わせした。目が血走っている。逃げ場はない。`,
 combat:{
 name:'砂漠のオーク', mr:45, armor:4, isHuman:false, canFlee:true,
 _exploreWin:()=>{ const ap=40+Math.floor(Math.random()*21); gainAPAll(ap); updateHUD();
 return `オークを倒すと衛兵が駆けつけた。「助かった！」と称えられ、英雄扱いされた。<br><span style="color:#e8e4d8">経験値+${ap}</span>`; }
 }
 },
 //  砂金目当ての追い剥ぎ
 { title:' 砂金目当ての追い剥ぎに狙われた',
 intro:`「その砂金袋を置いていけ！」荷物を狙った追い剥ぎが短剣を抜いて立ちはだかった。`,
 combat:{
 name:'砂金追い剥ぎ', mr:22, armor:1, isHuman:true, canFlee:true,
 _exploreWin:()=>{ const gp=20+Math.floor(Math.random()*16); const ap=18+Math.floor(Math.random()*11);
 gainGPAll(gp); gainAPAll(ap); updateHUD();
 return `追い剥ぎを返り討ちにした。奴の財布には他の旅人から奪った金が入っていた。<br><span style="color:#e8e4d8">+${gp}GP　経験値+${ap}</span>`; }
 }
 },
 //  ラクダ荒らしの山賊
 { title:' 隊商を荒らす山賊に出くわした',
 intro:`隊商のラクダを解こうとしている山賊たちを目撃した。「邪魔するな！」と刃を向けてきた。`,
 combat:{
 enemies:[{name:'山賊の頭',mr:35,armor:2},{name:'山賊の手下',mr:20,armor:1}], isHuman:true, canFlee:true,
 _exploreWin:()=>{ const gp=35+Math.floor(Math.random()*16); const ap=35+Math.floor(Math.random()*16);
 gainGPAll(gp); gainAPAll(ap); updateHUD();
 return `山賊を追い払った。隊商の主が「命の恩人だ」と報酬を弾んでくれた。<br><span style="color:#e8e4d8">+${gp}GP　経験値+${ap}</span>`; }
 }
 },
 ],

 elsia: [
 //  古老エルフ
 { title:' 古老のエルフに導かれた',
 intro:`樹齢千年の大樹の根元に座るエルフの老人。目が合うと静かに立ち上がり、密林の奥へ手招きした。`,
 sr:{attr:'iq', level:2},
 onSuccess:()=>{ const ap=25+Math.floor(Math.random()*16); gainAPAll(ap); updateHUD();
 return `密林の法則、精霊との対話の方法、古代の知恵。老エルフの教えを深く理解した。<br><span style="color:#e8e4d8">経験値+${ap}</span>`; },
 onFail:()=>{ const ap=10+Math.floor(Math.random()*6); gainAPAll(ap); updateHUD();
 return `言葉の多くは理解できなかったが、それでも何かを受け取った気がする。<br><span style="color:#e8e4d8">経験値+${ap}</span>`; }
 },
 //  密林の薬師
 { title:' 密林のエルフ薬師に出会った',
 intro:`エルフの薬師が葉を煎じている。「顔を見せて」と優しく声をかけてきた。`,
 sr:{attr:'con', level:1},
 onSuccess:()=>{ const heal=5; PC.con=Math.min(PC.maxCon||99,PC.con+heal); const ap=10+Math.floor(Math.random()*11); gainAPAll(ap); updateHUD();
 return `体が薬を完全に吸収した。傷も疲れも嘘のように消えた。薬師は微笑んで「丈夫な体だ」と言った。<br><span style="color:#e8e4d8">体力+${heal}　経験値+${ap}</span>`; },
 onFail:()=>{ const heal=2; PC.con=Math.min(PC.maxCon||99,PC.con+heal); updateHUD();
 return `薬を飲むと少し楽になった。エルフの薬師は「もう少し休みなさい」と言った。<br><span style="color:#e8e4d8">体力+${heal}</span>`; }
 },
 //  蜜蜂の巣
 { title:' 蜜蜂の巣を見つけた',
 intro:`木のうろに大きな蜂の巣を発見した。エルフの子どもたちが欲しそうに見ている。`,
 sr:{attr:'lk', level:1},
 onSuccess:()=>{ const gp=20+Math.floor(Math.random()*16); const ap=8+Math.floor(Math.random()*8); gainGPAll(gp); gainAPAll(ap); updateHUD();
 return `蜂に刺されずに巣を取れた。子どもたちは大喜びで、親が蜂蜜を高値で引き取ってくれた。<br><span style="color:#e8e4d8">+${gp}GP　経験値+${ap}</span>`; },
 onFail:()=>{ const gp=5+Math.floor(Math.random()*11); gainGPAll(gp); updateHUD();
 return `少し蜂に刺されたが、なんとか蜂蜜を少量得た。エルフの子どもが買ってくれた。<br><span style="color:#e8e4d8">+${gp}GP</span>`; }
 },
 //  エルフの弓手
 { title:' エルフの弓手に出会った',
 intro:`木の上で弓の練習をしているエルフがいる。見よう見まねで弓を借りて射てみようとしたが…`,
 sr:{attr:'dex', level:2},
 onSuccess:()=>{ PC.dex=Math.min(30,(PC.dex||10)+1); const ap=15+Math.floor(Math.random()*11); gainAPAll(ap); updateHUD();
 return `矢は見事に的に命中した。エルフは驚いて称え、弓法の秘伝を授けてくれた。<br><span style="color:#e8e4d8">DEX+1　経験値+${ap}</span>`; },
 onFail:()=>{ const ap=5+Math.floor(Math.random()*6); gainAPAll(ap); updateHUD();
 return `矢はあらぬ方向へ飛んだ。エルフは苦笑いしながら基礎だけ教えてくれた。<br><span style="color:#e8e4d8">経験値+${ap}</span>`; }
 },
 //  語り部
 { title:' エルフの語り部から伝承を聞いた',
 intro:`焚き火を囲むエルフたちの輪がある。語り部が古の物語を始めようとしている。`,
 sr:{attr:'iq', level:1},
 onSuccess:()=>{ const ap=10+Math.floor(Math.random()*11); gainAPAll(ap); updateHUD();
 const info=pick(['「精霊の泉は、心が清い者だけが見つけられると言い伝えられている。」','「大樹の根は地の果てまで伸び、世界の記憶を蓄えているという。」','「古代の魔法使いたちは、密林の木々と対話できたと言われている。」','「夜に三つの星が並ぶとき、密林に隠された扉が開くと伝えられる。」']);
 return `伝承の深意を理解し、古代の知恵の一端に触れた。<br><br>「${info}」<br><span style="color:#e8e4d8">経験値+${ap}</span>`; },
 onFail:()=>{
 const info=pick(['「密林の深部には精霊が宿る泉があると言い伝えられている。」','「夜に聞こえる歌は精霊の声。恐れることはない。」','「古代遺跡は密林に飲まれているが、地図を持つ者がいる。」','「エルフの蜂蜜酒は人間の三倍の力があるから飲みすぎるな。」']);
 return `古い言葉が多くて難解だったが、物語は美しかった。<br><br>「${info}」`; }
 },
 //  木の実
 { title:' 密林で木の実を採取した',
 intro:`エルフが食べられる木の実の場所を教えてくれた。ただし、似た毒実もあるという。`,
 sr:{attr:'lk', level:1},
 onSuccess:()=>{ const food=6+Math.floor(Math.random()*5); PC._food=(PC._food||0)+food; const ap=6+Math.floor(Math.random()*6); gainAPAll(ap); updateHUD();
 return `毒実を完璧に避けて豊かな収穫を得た。エルフが驚いて採取の極意を教えてくれた。<br><span style="color:#e8e4d8">食料+${food}日分　経験値+${ap}</span>`; },
 onFail:()=>{ const food=2+Math.floor(Math.random()*4); PC._food=(PC._food||0)+food; updateHUD();
 return `慎重に選んだので量は少なかったが、安全な実だけ持ち帰った。<br><span style="color:#e8e4d8">食料+${food}日分</span>`; }
 },
 //  蛇
 { title:' 密林の蛇に遭遇した',
 intro:`足元の草むらで何かが動いた。蛇だ。向こうもこちらに気づいている。`,
 sr:{attr:'spd', level:1},
 onSuccess:()=>{ const ap=12+Math.floor(Math.random()*11); gainAPAll(ap); updateHUD();
 return `素早く飛び退いて難を逃れた。咄嗟の判断と俊敏さが自信になった。<br><span style="color:#e8e4d8">経験値+${ap}</span>`; },
 onFail:()=>{ const dmg=1+Math.floor(Math.random()*3); PC.con=Math.max(1,PC.con-dmg); updateHUD();
 return `間に合わず手を噛まれた。毒は薄かったが、しばらく腫れた。<br><span class="red">体力-${dmg}（残り${PC.con}）</span>`; }
 },
 //  エルフ図書館
 { title:' エルフの図書館に迷い込んだ',
 intro:`大樹の中をくり抜いた不思議な図書館。エルフの司書が古代語の本を差し出してきた。`,
 sr:{attr:'iq', level:2},
 onSuccess:()=>{ PC.iq=Math.min(30,(PC.iq||10)+1); const ap=15+Math.floor(Math.random()*11); gainAPAll(ap); updateHUD();
 return `古代語を読み解き、世界の理の一端に触れた。司書は驚いて「また来なさい」と言った。<br><span style="color:#e8e4d8">IQ+1　経験値+${ap}</span>`; },
 onFail:()=>{ const ap=10+Math.floor(Math.random()*11); gainAPAll(ap); updateHUD();
 return `古代語は難解だったが、挿絵と推測で何とか内容を汲み取った。<br><span style="color:#e8e4d8">経験値+${ap}</span>`; }
 },
 //  密林のゴブリン
 { title:' 密林のゴブリンが飛び出してきた',
 intro:`木々の間から奇声を上げたゴブリンが跳び出してきた。密林に紛れ込んだ個体のようだ。`,
 combat:{
 name:'密林のゴブリン', mr:20, armor:0, isHuman:false, canFlee:true,
 _exploreWin:()=>{ const ap=18+Math.floor(Math.random()*13); gainAPAll(ap); updateHUD();
 return `ゴブリンを倒すとエルフたちが「久しぶりに見かけた。助かった」と礼を言った。<br><span style="color:#e8e4d8">経験値+${ap}</span>`; }
 }
 },
 //  狂化した密林の番人
 { title:' 狂化した密林の番人に遭遇した',
 intro:`突然、鎧姿のスケルトンが木陰から現れた。かつてエルマリアを守っていた番人が、魔力で狂化した姿だという。`,
 combat:{
 name:'狂化した番人', mr:35, armor:4, isHuman:false, canFlee:true,
 _exploreWin:()=>{ const gp=10+Math.floor(Math.random()*11); const ap=30+Math.floor(Math.random()*16);
 gainGPAll(gp); gainAPAll(ap); updateHUD();
 return `番人を倒すと、その鎧の一部が崩れて古いコインが転がり出た。エルフたちが深く頭を下げた。<br><span style="color:#e8e4d8">+${gp}GP　経験値+${ap}</span>`; }
 }
 },
 //  遺跡の番兵
 { title:' 古代遺跡の番兵が目を覚ました',
 intro:`密林の奥へ踏み込んだとき、石壁の模様だと思っていたものが動いた。古代遺跡の守護者だ！`,
 combat:{
 name:'石の番兵', mr:40, armor:5, isHuman:false, canFlee:false,
 _exploreWin:()=>{ const gp=15+Math.floor(Math.random()*16); const ap=40+Math.floor(Math.random()*21);
 gainGPAll(gp); gainAPAll(ap); updateHUD();
 return `番兵を砕くと、胸部から光る宝石が転がり出た。エルフの賢者が「数百年ぶりの勇者だ」と称えた。<br><span style="color:#e8e4d8">+${gp}GP　経験値+${ap}</span>`; }
 }
 },
 //  巨大蜘蛛
 { title:' 密林の巨大蜘蛛に絡まれた',
 intro:`木々の間に張られた巨大な蜘蛛の巣に気づかず踏み込んでしまった。巣の主が牙を剥いて飛びかかってきた。`,
 combat:{
 name:'密林の大蜘蛛', mr:30, armor:2, isHuman:false, canFlee:true,
 _exploreWin:()=>{ const ap=25+Math.floor(Math.random()*13); gainAPAll(ap); updateHUD();
 return `巨大蜘蛛を退治するとエルフの子どもたちが歓声を上げた。密林での戦い方を体得した。<br><span style="color:#e8e4d8">経験値+${ap}</span>`; }
 }
 },
 //  エルフの試練
 { title:' エルフの試練に挑まれた',
 intro:`エルフの若者が「人間よ、貴様の力を見せよ」と挑んできた。断れば侮られる。受けて立つか？`,
 combat:{
 name:'エルフの試練士', mr:38, armor:2, isHuman:true, canFlee:true,
 _exploreWin:()=>{ const ap=35+Math.floor(Math.random()*21); PC.dex=Math.min(30,(PC.dex||10)+1); updateHUD();
 gainAPAll(ap);
 return `エルフを打ち負かすと、周囲のエルフたちが尊敬の眼差しを向けた。試練士は笑顔で「合格だ」と言い、秘伝を教えてくれた。<br><span style="color:#e8e4d8">DEX+1　経験値+${ap}</span>`; }
 }
 },
 ],
 // ────────────────────────────
 // ドラクリム山脈地方
 // ────────────────────────────
 yeldun: [
 { title:' 鉱石商人から高値取引の話',
   intro:`山から降りてきた鉱石商人が「この石、鑑定できるか？」と差し出してきた。黒光りする塊だ。`,
   sr:{attr:'iq', level:1},
   onSuccess:()=>{ const gp=25+Math.floor(Math.random()*16); gainGPAll(gp); updateHUD();
     return `希少な磁鉄鉱と見抜き、相場の3倍で仲介してやった。商人は驚いて礼金をくれた。<br><span style="color:#e8e4d8">+${gp}GP　経験値+${Math.round(gp*0.5)}</span>`; },
   onFail:()=>{ const gp=5; gainGPAll(gp); updateHUD();
     return `普通の鉄鉱石だったが、商人は取引してくれた。少額の礼を受けた。<br><span style="color:#e8e4d8">+${gp}GP</span>`; }
 },
 { title:' 崩落する山道を助けた旅人',
   intro:`山道で土砂崩れに巻き込まれた旅人を発見した。岩の下敷きになっている。引っ張り出せるか？`,
   sr:{attr:'st', level:2},
   onSuccess:()=>{ const ap=30+Math.floor(Math.random()*16); gainAPAll(ap); updateHUD();
     return `力を振り絞って旅人を救出した。礼に山岳の地図を受け取り、経験を積んだ。<br><span style="color:#e8e4d8">経験値+${ap}</span>`; },
   onFail:()=>{ const dmg=Math.floor(Math.random()*4)+1; PC.con=Math.max(1,PC.con-dmg); updateHUD();
     return `岩は動かせず、旅人は自力で這い出た。無理に力んで体を痛めた。<br><span class="red">体力-${dmg}</span>`; }
 },
 { title:' 山賊の先遣隊に絡まれた',
   intro:`石畳の市場で粗野な男たちが「通行税を払え」と囲んできた。山賊崩れだ。`,
   combat:{
     name:'山賊の用心棒', mr:38, armor:3, isHuman:true, canFlee:true,
     _exploreWin:()=>{ const gp=18+Math.floor(Math.random()*13); const ap=28+Math.floor(Math.random()*16);
       gainGPAll(gp); gainAPAll(ap); updateHUD();
       return `山賊を追い払うと、周囲の商人たちが拍手した。巻き上げられていた金を分けてもらった。<br><span style="color:#e8e4d8">+${gp}GP　経験値+${ap}</span>`; }
   }
 },
 { title:' 暴れるコウモリの大群',
   intro:`市場の倉庫からコウモリの大群が飛び出してきた。血を吸う山岳コウモリだ！`,
   combat:{
     name:'山岳コウモリの群れ', mr:22, armor:0, isHuman:false, canFlee:true,
     _exploreWin:()=>{ const ap=20+Math.floor(Math.random()*11); gainAPAll(ap); updateHUD();
       return `群れを蹴散らすと、倉庫主が礼を言った。山での勘が鋭くなった気がする。<br><span style="color:#e8e4d8">経験値+${ap}</span>`; }
   }
 },
 ],
 frostpeak: [
 { title:' 猛吹雪の中の道迷い旅人',
   intro:`城門近くで凍えた旅人が倒れていた。吹雪で道に迷ったらしい。正しい道を教えられるか？`,
   sr:{attr:'iq', level:1},
   onSuccess:()=>{ const gp=15+Math.floor(Math.random()*11); gainGPAll(gp); updateHUD();
     return `山道を正確に教え、旅人は感謝して持ち物を分けてくれた。<br><span style="color:#e8e4d8">+${gp}GP　経験値+${Math.round(gp*0.4)}</span>`; },
   onFail:()=>{ return `誤った道を教えてしまい、旅人は首を振って去った。この山の地理はまだ把握しきれていない。`; }
 },
 { title:' 元傭兵の老人に試された',
   intro:`宿屋の前で隻眼の老人が「お前の腕前を見せろ」と木剣を投げてきた。断るか、受けて立つか。`,
   sr:{attr:'dex', level:2},
   onSuccess:()=>{ const ap=35+Math.floor(Math.random()*21); PC.st=Math.min(30,(PC.st||10)+1); gainAPAll(ap); updateHUD();
     return `老人の技を受け流し、一本取った。老人は「まだまだだが筋はある」と山岳流の一撃を教えてくれた。<br><span style="color:#e8e4d8">ST+1　経験値+${ap}</span>`; },
   onFail:()=>{ const dmg=2+Math.floor(Math.random()*3); PC.con=Math.max(1,PC.con-dmg); updateHUD();
     return `老人の素早い一撃をもらった。「もっと鍛えろ」と言われ、体が痛む。<br><span class="red">体力-${dmg}</span>`; }
 },
 { title:' 霧の中の雪豹',
   intro:`城壁の外で霧に紛れた雪豹が迷い込んでいた。住民が逃げ惑っている。追い払えるか？`,
   combat:{
     name:'雪豹', mr:45, armor:4, isHuman:false, canFlee:true,
     _exploreWin:()=>{ const gp=20+Math.floor(Math.random()*16); const ap=40+Math.floor(Math.random()*21);
       gainGPAll(gp); gainAPAll(ap); updateHUD();
       return `雪豹を追い払うと、住民たちが安堵した。毛並みの美しい爪を記念にもらった。<br><span style="color:#e8e4d8">+${gp}GP　経験値+${ap}</span>`; }
   }
 },
 { title:' 雪崩を引き起こす山の巨人',
   intro:`外れの岩場で見張りが叫んだ。山の巨人が雪崩を起こしながら集落に近づいている！`,
   combat:{
     name:'山の巨人', mr:55, armor:6, isHuman:false, canFlee:false,
     _exploreWin:()=>{ const gp=30+Math.floor(Math.random()*21); const ap=50+Math.floor(Math.random()*26);
       gainGPAll(gp); gainAPAll(ap); updateHUD();
       return `巨人を退けると、集落の長老が宝を持ってきた。この地での英雄譚が始まった。<br><span style="color:#e8e4d8">+${gp}GP　経験値+${ap}</span>`; }
   }
 },
 ],
 ashveil: [
 { title:' 火山灰の調合を頼まれた',
   intro:`鍛冶師が「あの火口近くの特別な灰を取ってこい」と頼んできた。熱気と有毒ガスが漂う危険な場所だ。`,
   sr:{attr:'lk', level:2},
   onSuccess:()=>{ const gp=30+Math.floor(Math.random()*21); gainGPAll(gp); updateHUD();
     return `うまく採取できた。鍛冶師は約束通りの報酬と、上質な刃の手入れをしてくれた。<br><span style="color:#e8e4d8">+${gp}GP　経験値+${Math.round(gp*0.5)}</span>`; },
   onFail:()=>{ const dmg=3+Math.floor(Math.random()*4); PC.con=Math.max(1,PC.con-dmg); updateHUD();
     return `火山ガスを吸って体調を崩した。ろくな灰も取れず、鍛冶師にも呆れられた。<br><span class="red">体力-${dmg}</span>`; }
 },
 { title:' 黒曜石の鑑定を任された',
   intro:`村の加工職人が大量の黒曜石を前に唸っている。「どれが武器に向く？」と聞いてきた。`,
   sr:{attr:'iq', level:1},
   onSuccess:()=>{ const gp=20+Math.floor(Math.random()*11); gainGPAll(gp); updateHUD();
     return `質の良い石を見分けてやると、職人は喜んで完成品を一つくれた。<br><span style="color:#e8e4d8">+${gp}GP</span>`; },
   onFail:()=>{ return `見分けがつかず、職人に笑われた。「また修行し直してこい」と言われた。`; }
 },
 { title:' 硫黄の番をする溶岩亀',
   intro:`村はずれの硫黄採掘場で溶岩亀が暴れていた。甲羅が熱く、触れたら火傷する。`,
   combat:{
     name:'溶岩亀', mr:42, armor:8, isHuman:false, canFlee:true,
     _exploreWin:()=>{ const ap=35+Math.floor(Math.random()*16); gainAPAll(ap); updateHUD();
       return `溶岩亀を追い払うと採掘場の人夫が礼を言った。この山の怪物に慣れてきた気がする。<br><span style="color:#e8e4d8">経験値+${ap}</span>`; }
   }
 },
 { title:' 火山のデーモン',
   intro:`火口近くで炎に包まれた姿が動いた。火山のデーモンだ。村に近づかせるわけにはいかない！`,
   combat:{
     name:'火山のデーモン', mr:52, armor:5, isHuman:false, canFlee:false,
     _exploreWin:()=>{ const gp=25+Math.floor(Math.random()*21); const ap=45+Math.floor(Math.random()*26);
       gainGPAll(gp); gainAPAll(ap); updateHUD();
       return `デーモンを倒すと炎が収まり、村人たちが歓呼した。燃え残った魔石が手元に残った。<br><span style="color:#e8e4d8">+${gp}GP　経験値+${ap}</span>`; }
   }
 },
 ],
 elsia: [
  // e_r01: 長老評議会の招集
  { title:' 長老評議会の招集',
   intro:`見知らぬエルフが静かに近づき、「評議会があなたを召喚している」と告げた。断るべきか、従うべきか。`,
   sr:{attr:'chr', level:2},
   onSuccess:()=>{ const ap=25+Math.floor(Math.random()*16); gainAPAll(ap); changeTrust('elsia',3); updateHUD();
    return `評議会の長老たちは厳しい目でこちらを見ていたが、やがて静かに頷いた。「我々の森を尊重する者と認めよう」<br><span style="color:#e8e4d8">信頼度+3　経験値+${ap}</span>`; },
   onFail:()=>{ GAME_TIME.totalDays++; updateTimebar(); checkAging(); updateHUD();
    return `言葉が足りなかったのか、衛兵に丁重に外へ連れ出された。扉が閉まる音が響いた。<br><span class="red">1日経過</span>`; }
  },
  // e_r02: 古代語の碑文
  { title:' 古代語の碑文',
   intro:`蔦に絡まれた石碑に複雑な文字が刻まれている。古代エルフ語のようだが、読めるか？`,
   sr:{attr:'iq', level:2},
   onSuccess:()=>{ PC.lk = Math.min(99,(PC.lk||1)+1); const ap=20+Math.floor(Math.random()*11); gainAPAll(ap); updateHUD();
    const texts = ['「精霊の眠る地には、三つの試練がある」','「古の王は西の密林に剣を眠らせた」','「月が満ちる夜、隠し扉は口を開く」'];
    return `碑文を読み解いた。古代の言葉が脳裏に刻まれた気がする。<br><br><i>「${texts[Math.floor(Math.random()*texts.length)]}」</i><br><span style="color:#e8e4d8">LK+1　経験値+${ap}</span>`; },
   onFail:()=>{ const ap=5+Math.floor(Math.random()*6); gainAPAll(ap); updateHUD();
    return `古代語は難解すぎた。うっすらと意味が掴めただけだ。<br><span style="color:#e8e4d8">経験値+${ap}</span>`; }
  },
  // e_r03: 精霊の通路
  { title:' 精霊の通路',
   intro:`光る蔦が絡む細い通路。精霊が宿るとエルフたちが噂する場所だ。進んでみるか？`,
   sr:{attr:'lk', level:1},
   onSuccess:()=>{ const ap=30+Math.floor(Math.random()*21); gainAPAll(ap); updateHUD();
    return `通路を歩くと淡い光に包まれた。心が静まり、視界が澄んでいく感覚があった。<br><span style="color:#e8e4d8">経験値+${ap}</span>`; },
   onFail:()=>{ const dmg=1+Math.floor(Math.random()*3); PC.con=Math.max(1,PC.con-dmg); updateHUD();
    return `通路の途中で突然、体が重くなった。精霊の気に当てられたのか。<br><span class="red">体力-${dmg}（残り${PC.con}）</span>`; }
  },
  // e_r04: 遺跡発掘調査団
  { title:' 遺跡発掘調査団',
   intro:`遺跡の前でエルフたちが発掘作業を行っている。「手伝ってくれないか」と声がかかった。`,
   sr:{attr:'st', level:1},
   onSuccess:()=>{ const j=generateJewel(); const ap=15+Math.floor(Math.random()*11); gainAPAll(ap); updateHUD();
    return `重い石材を動かすと、その下から小さな宝石が顔を出した。調査団のエルフが礼として分けてくれた。<br><span style="color:#e8e4d8">宝石取得　経験値+${ap}</span>`; },
   onFail:()=>{ const dmg=1+Math.floor(Math.random()*3); PC.con=Math.max(1,PC.con-dmg); updateHUD();
    return `力を入れすぎて石材が崩れ、破片が体をかすめた。<br><span class="red">体力-${dmg}（残り${PC.con}）</span>`; }
  },
  // e_r05: エルフの弓師の試練
  { title:' エルフの弓師の試練',
   intro:`広場でエルフの弓師が的を射ている。「外来者よ、試してみるか？」と挑んできた。`,
   sr:{attr:'dex', level:2},
   onSuccess:()=>{ const ap=25+Math.floor(Math.random()*16); gainAPAll(ap); changeTrust('elsia',5); updateHUD();
    return `矢は見事に的の中心を捉えた。弓師は目を細めて「なかなかやる」と認めた。<br><span style="color:#e8e4d8">信頼度+5　経験値+${ap}</span>`; },
   onFail:()=>{ const ap=8+Math.floor(Math.random()*6); gainAPAll(ap); updateHUD();
    return `矢は大きく外れた。エルフたちの忍び笑いが聞こえた。<br><span style="color:#e8e4d8">経験値+${ap}</span>`; }
  },
  // e_r06: 古代遺物の競売
  { title:' 古代遺物の競売',
   intro:`評議会広場の一角で、発掘された古代遺物の競売が行われている。謎めいた品が並んでいる。`,
   sr:{attr:'lk', level:1},
   onSuccess:()=>{
    const cost=50+Math.floor(Math.random()*101);
    if((PC.gold||0)>=cost){ PC.gold-=cost; const j=generateJewel(); updateHUD();
     return `落札した品を持ち帰ると、宝石のような輝きを放っていた。掘り出し物だ。<br><span style="color:#e8e4d8">宝石取得（-${cost}GP）</span>`; }
    return `入札したが、他の者に競り負けた。財布を見ると資金が足りなかった。`; },
   onFail:()=>{ return `欲しい品に手を挙げたが、競り負けた。次の機会にしよう。`; }
  },
  // e_r07: 密林の迷い子
  { title:' 密林の迷い子',
   intro:`評議会地区の裏路地で、若いエルフが「道がわからなくなってしまった」と途方に暮れている。`,
   sr:{attr:'iq', level:1},
   onSuccess:()=>{ const ap=20+Math.floor(Math.random()*11); gainAPAll(ap); changeTrust('elsia',3); updateHUD();
    return `密林の地形を読んで道案内した。若いエルフは深々と礼をして走り去った。<br><span style="color:#e8e4d8">信頼度+3　経験値+${ap}</span>`; },
   onFail:()=>{
    return `道案内しようとしたが、自分まで方向感覚を失ってしまった。気づけば散策時間が尽きていた。`; }
  },
  // e_r08: 秘伝の薬草の配達
  { title:' 秘伝の薬草の配達',
   intro:`薬草師のエルフが声をかけてきた。「この薬草を届けてほしい。エルマリアの外の人間にしか頼めないのだ」`,
   sr:{attr:'chr', level:1},
   onSuccess:()=>{
    const herbs = ['月光草の乾燥束','精霊樹の樹液','霧宿りの苔','暁露の花弁','星詠みの根'];
    const herb = herbs[Math.floor(Math.random()*herbs.length)];
    const destTowns = Object.keys(TOWNS).filter(t=>getRegionKey(t)!=='elmaria_region');
    const destId = destTowns[Math.floor(Math.random()*destTowns.length)]||'khazan';
    const destTown = TOWNS[destId]||{name:'カザーヌ'};
    const destPeople = ['薬師のアーマン','薬商ロデリック','治療師のエリス','錬金術師バルド'];
    const destPerson = destPeople[Math.floor(Math.random()*destPeople.length)];
    const reward = Math.floor((30+Math.floor(Math.random()*41))*1.5);
    const deadline = 40+Math.floor(Math.random()*21);
    PC.quests=PC.quests||[];
    PC.quests.push({id:Date.now()+Math.random(),type:'delivery',status:'active',
     clientName:'エルマリアの薬草師',receiverName:destPerson,item:herb,toTownId:destId,
     destIcon:'',destLabel:'薬草の配達',reward,deadlineDays:deadline,issuedDay:GAME_TIME.totalDays,
     crossRegion:true});
    updateHUD();
    return `「${herb}」を受け取った。${destTown.name}の${destPerson}まで届けてほしいという。<br><span style="color:#e8e4d8">宅配依頼取得（報酬${reward}GP　期限${deadline}日）</span>`; },
   onFail:()=>{ return `薬草師は少し考えてから「やはり外来者には任せられない」と首を振った。`; }
  },
  // e_r09: 評議会の審問
  { title:' 評議会の審問',
   intro:`評議会の衛兵に呼び止められた。「外来者よ、ここで何をしている？」`,
   sr:{attr:'chr', level:2},
   onSuccess:()=>{ const ap=15+Math.floor(Math.random()*11); gainAPAll(ap); changeTrust('elsia',2); updateHUD();
    return `誠実に答えると、衛兵は頷いて通してくれた。「この地を敬う者は歓迎する」<br><span style="color:#e8e4d8">信頼度+2　経験値+${ap}</span>`; },
   onFail:()=>{ GAME_TIME.totalDays++; updateTimebar(); checkAging(); updateHUD();
    return `答えが不審に映ったのか、別室で1日事情聴取を受けた。<br><span class="red">1日経過</span>`; }
  },
  // e_r10: 精霊木の番人
  { title:' 精霊木の番人',
   intro:`聖域とされる精霊木の前に番人が立っている。内部に入るには許可が必要らしい。`,
   sr:{attr:'chr', level:2},
   onSuccess:()=>{
    if(Math.random()<0.5){ PC.lk=Math.min(99,(PC.lk||1)+1); updateHUD();
     return `番人は長い沈黙の後、扉を開けた。木の根元に触れると、温かい光が体を包んだ。<br><span style="color:#e8e4d8">LK+1</span>`; }
    else { const j=generateJewel(); updateHUD();
     return `番人に認められ、中に入ると精霊の贈り物が置かれていた。<br><span style="color:#e8e4d8">宝石取得</span>`; } },
   onFail:()=>{ return `番人は首を振った。「あなたはまだ精霊に認められていない」`; }
  },
  // e_r11: 古代魔法の暴走
  { title:' 古代魔法の暴走',
   intro:`遺跡の近くを歩いていると、突然地面の魔法陣が光り始めた。`,
   sr:{attr:'lk', level:2},
   onSuccess:()=>{ const ap=30+Math.floor(Math.random()*21); gainAPAll(ap); updateHUD();
    return `光の渦の中心で、古代の記憶のような映像が流れ込んだ。稀有な体験だ。<br><span style="color:#e8e4d8">経験値+${ap}</span>`; },
   onFail:()=>{ const dmg=1+Math.floor(Math.random()*6); PC.st=Math.max(1,(PC.st||1)-dmg); updateHUD();
    return `魔法の奔流が体を貫いた。しばらく動けなかった。<br><span class="red">強さ-${dmg}（残り${PC.st}）</span>`; }
  },
  // e_r12: エルフ衛兵の検問
  { title:' エルフ衛兵の検問',
   intro:`評議会地区の正門前でエルフ衛兵に止められた。「身元を証明せよ」`,
   sr:{attr:'chr', level:1},
   onSuccess:()=>{ const ap=10+Math.floor(Math.random()*6); gainAPAll(ap); updateHUD();
    return `身元を明かすと衛兵は敬礼した。「通られよ」<br><span style="color:#e8e4d8">経験値+${ap}</span>`; },
   onFail:()=>{ GAME_TIME.totalDays+=2; updateTimebar(); checkAging(); updateHUD();
    return `疑われてしまい、身元確認のため2日間の入域制限を受けた。外壁の外で待たされた。<br><span class="red">2日経過</span>`; }
  },
  // e_r13: 長老への謁見（信頼度70以上のみ）
  { title:' 長老への謁見',
   intro:`エルフの使者が「長老があなたを呼んでいる」と告げた。これは稀な名誉だ。`,
   sr:{attr:'chr', level:1},
   onSuccess:()=>{
    if(getTrust('elsia') < 70) return `長老の部屋に通されたが、「まだ早い」と短く告げられ退室を促された。`;
    PC.lk=Math.min(99,(PC.lk||1)+1); changeTrust('elsia',10); const ap=40+Math.floor(Math.random()*21); gainAPAll(ap); updateHUD();
    return `長老は静かに語りかけた。「森を愛する者よ、この地の友として認めよう」その言葉は体の奥に響いた。<br><span style="color:#e8e4d8">LK+1　信頼度+10　経験値+${ap}</span>`; },
   onFail:()=>{ const ap=15+Math.floor(Math.random()*11); gainAPAll(ap); updateHUD();
    return `長老の前で緊張してしまい、言葉が出なかった。それでも静かに話を聞いてくれた。<br><span style="color:#e8e4d8">経験値+${ap}</span>`; }
  },
  // e_r14: 禁書庫の誘惑
  { title:' 禁書庫の誘惑',
   intro:`封印された書庫の前を通ると、扉が僅かに開いていた。中に禁書が並んでいる。`,
   sr:{attr:'iq', level:2},
   onSuccess:()=>{ const ap=30+Math.floor(Math.random()*21); gainAPAll(ap); updateHUD();
    const titles = ['「精霊召喚の原典」','「古代王朝の秘密の年代記」','「忘れられた魔法陣の解説書」'];
    return `素早く${titles[Math.floor(Math.random()*titles.length)]}を立ち読みした。貴重な知識が頭に入った。<br><span style="color:#e8e4d8">経験値+${ap}</span>`; },
   onFail:()=>{ PC.chr=Math.max(1,(PC.chr||1)-1); updateHUD();
    return `番人に見つかってしまった。「禁書庫は立入禁止だ！」と叱責され、評議会地区での評判が落ちた。<br><span class="red">CHR-1</span>`; }
  },
  // e_r15: 暗殺者の影
  { title:' 暗殺者の影',
   intro:`評議会の塔の陰に不審な人影を見た。長老を狙う暗殺者のようだ。追跡するか？`,
   sr:{attr:'spd', level:2},
   onSuccess:()=>{ const ap=30+Math.floor(Math.random()*21); gainAPAll(ap); changeTrust('elsia',5); updateHUD();
    return `暗殺者を追い詰め、衛兵と協力して捕らえた。評議会から正式に感謝された。<br><span style="color:#e8e4d8">信頼度+5　経験値+${ap}</span>`; },
   onFail:()=>{ const dmg=1+Math.floor(Math.random()*6); PC.con=Math.max(1,PC.con-dmg); updateHUD();
    return `追跡中に返り討ちに遭った。暗殺者は闇に消えた。<br><span class="red">体力-${dmg}（残り${PC.con}）</span>`; }
  },
  // e_r16: 森の祭儀
  { title:' 森の祭儀',
   intro:`評議会地区の奥で、エルフたちが輪になって古い歌を歌っている。祭儀のようだ。加わることを求められた。`,
   sr:{attr:'chr', level:2},
   onSuccess:()=>{ PC.lk=Math.min(99,(PC.lk||1)+2); changeTrust('elsia',3); const ap=25+Math.floor(Math.random()*16); gainAPAll(ap); updateHUD();
    return `輪の中に加わり、古い歌に合わせて動いた。エルフたちが微笑み、祭儀が終わると体が軽くなった。<br><span style="color:#e8e4d8">LK+2　信頼度+3　経験値+${ap}</span>`; },
   onFail:()=>{ return `動きが合わず、エルフたちに穏やかに「外来者は遠慮してほしい」と追い払われた。`; }
  },
 ],
 al_rashid_caravanSq: [
  // a_r01: 隊商長との交渉
  { title:' 隊商長との交渉',
   intro:`豪華な天幕の前に大隊商の長が立っている。じっとこちらを見て、「話がある」と手招きした。`,
   sr:{attr:'chr', level:2},
   onSuccess:()=>{ const ap=25+Math.floor(Math.random()*16); gainAPAll(ap); changeTrust('al_rashid',3); updateHUD();
    return `隊商長は砂漠の交易路の秘密を打ち明けてくれた。「あなたは信頼できる」と言い残して去った。<br><span style="color:#e8e4d8">信頼度+3　経験値+${ap}</span>`; },
   onFail:()=>{ const ap=8+Math.floor(Math.random()*6); gainAPAll(ap); updateHUD();
    return `言葉に詰まってしまった。隊商長は興味をなくし、天幕の中に消えた。<br><span style="color:#e8e4d8">経験値+${ap}</span>`; }
  },
  // a_r02: 砂漠の占い師
  { title:' 砂漠の占い師',
   intro:`天幕の入口で老婆が砂に紋様を描いている。「運命を見てやろう」と手を引かれた。`,
   sr:{attr:'iq', level:1},
   onSuccess:()=>{ PC.lk=Math.min(99,(PC.lk||1)+1); const ap=20+Math.floor(Math.random()*11); gainAPAll(ap); updateHUD();
    return `老婆の言葉の深意を理解した。「砂漠は嘘をつかない」——その言葉が心に刻まれた。<br><span style="color:#e8e4d8">LK+1　経験値+${ap}</span>`; },
   onFail:()=>{ const ap=5+Math.floor(Math.random()*6); gainAPAll(ap); updateHUD();
    return `難解な言葉で半分も理解できなかった。老婆は肩をすくめて砂を払った。<br><span style="color:#e8e4d8">経験値+${ap}</span>`; }
  },
  // a_r03: 隊商護衛
  { title:' 隊商護衛の依頼',
   intro:`商人が血相を変えて近づいてきた。「街の外れまで荷を運ぶのだが、盗賊が出る。護衛を頼めないか？」`,
   sr:null,
   _combat:true,
   fn:(ret)=>{
    const story=document.getElementById('story');
    story.innerHTML=`<span style="color:#d0c8b8"> 隊商広場</span><br><br>`
     +`<span style="color:#f0ece0"> 隊商護衛の依頼</span><br><br>`
     +`商人が血相を変えて近づいてきた。「街の外れまで荷を運ぶのだが、盗賊が出る。護衛を頼めないか？」`;
    renderChoices([
     {label:' 護衛を引き受ける', fn:()=>startCombat({
      enemies:[{name:'砂漠の盗賊',mr:40,curMR:40,armor:0},{name:'砂漠の盗賊',mr:40,curMR:40,armor:0}],
      canFlee:true,
      onWin:()=>{
       const gp=15+Math.floor(Math.random()*16);
       gainGPAll(gp); updateHUD();
       document.getElementById('story').innerHTML=`<span style="color:#d0c8b8"> 隊商広場</span><br><br>`
        +`<span style="color:#e8e4d8">盗賊を撃退した！商人は深く礼をして報酬を渡してくれた。</span><br><span style="color:#e8e4d8">+${gp}GP</span>`;
       renderChoices([
        {label:' 続けて散策する', fn:()=>alRashidGoDistrict('caravanSq',ret)},
        {label:'← 街に戻る', go:'TOWN_AL_RASHID'},
       ]);
      },
      win:'__noop__', lose:'DEAD'
     })},
     {label:' 断る', fn:()=>{
      story.innerHTML+=`<br><br><span style="color:#c0b098">商人は残念そうに立ち去った。</span>`;
      renderChoices([
       {label:' 続けて散策する', fn:()=>alRashidGoDistrict('caravanSq',ret)},
       {label:'← 街に戻る', go:'TOWN_AL_RASHID'},
      ]);
     }},
    ]);
   }
  },
  // a_r04: 砂金の目利き
  { title:' 砂金の目利き',
   intro:`「この砂金が本物かどうか見てほしい」と商人が小袋を差し出した。怪しい光沢がある。`,
   sr:{attr:'iq', level:2},
   onSuccess:()=>{ const gp=10+Math.floor(Math.random()*11); gainGPAll(gp); const ap=15+Math.floor(Math.random()*11); gainAPAll(ap); updateHUD();
    return `本物だと見抜いた。商人は「さすが目が利く」と鑑定料を払ってくれた。<br><span style="color:#e8e4d8">+${gp}GP　経験値+${ap}</span>`; },
   onFail:()=>{ PC.gold=Math.max(0,(PC.gold||0)-10); updateHUD();
    return `本物と判断して手付金を払ったが、後で偽物だとわかった。-10GP<br><span class="red">-10GP</span>`; }
  },
  // a_r05: 遊牧民の長老
  { title:' 遊牧民の長老',
   intro:`砂漠の民の装束をまとった老人が広場の隅に座っている。話しかけると穏やかに目を開けた。`,
   sr:{attr:'chr', level:1},
   onSuccess:()=>{ const ap=20+Math.floor(Math.random()*11); gainAPAll(ap); updateHUD();
    const ruins=['「西の砂丘の三つ目の影に、古代王国の門が埋まっている」','「満月の夜、砂漠の中央で地面が光ることがある。そこに眠るものは計り知れない」','「北の岩山に刻まれた印を辿れば、忘れられた泉にたどり着ける」'];
    return `長老は砂漠の秘密を語ってくれた。<br><br><i>「${ruins[Math.floor(Math.random()*ruins.length)]}」</i><br><span style="color:#e8e4d8">経験値+${ap}</span>`; },
   onFail:()=>{ return `長老は目を閉じて黙ってしまった。砂漠の民には独自の作法があるようだ。`; }
  },
  // a_r06: 砂嵐の予兆
  { title:' 砂嵐の予兆',
   intro:`空が赤みを帯びてきた。遠くの砂丘の輪郭が霞んでいる。砂嵐が来るかもしれない。`,
   sr:{attr:'lk', level:1},
   onSuccess:()=>{ const ap=15+Math.floor(Math.random()*11); gainAPAll(ap); updateHUD();
    return `素早く近くの天幕に飛び込んだ。砂嵐はすぐ過ぎ去った。<br><span style="color:#e8e4d8">経験値+${ap}</span>`; },
   onFail:()=>{ const dmg=1+Math.floor(Math.random()*6); PC.con=Math.max(1,PC.con-dmg); PC._alRashidExploreCount=99; updateHUD();
    return `避難が遅れ、砂嵐に巻き込まれた。砂が目と口に入り、体力を削られた。<br><span class="red">体力-${dmg}（残り${PC.con}）　散策終了</span>`; }
  },
  // a_r07: 遺跡の地図
  { title:' 遺跡の地図売り',
   intro:`「古代遺跡の地図だ、30GPで売ってやろう」と怪しげな男が近づいてきた。`,
   sr:null,
   _custom:true,
   fn:(ret)=>{
    const story=document.getElementById('story');
    story.innerHTML=`<span style="color:#d0c8b8"> 隊商広場</span><br><br>`
     +`<span style="color:#f0ece0"> 遺跡の地図売り</span><br><br>`
     +`「古代遺跡の地図だ、30GPで売ってやろう」と怪しげな男が近づいてきた。`;
    const cost=30;
    renderChoices([
     ...((PC.gold||0)>=cost?[{label:` 地図を買う（${cost}GP）`, fn:()=>{
      PC.gold-=cost; updateHUD();
      story.innerHTML+=`<br><br>地図を手に入れ、遺跡へ向かった。`;
      dungeonTrySR({attr:'lk',level:2,
       successTxt:()=>`遺跡の奥深くで財宝の間を発見した！`,
       successFn:()=>{ const gp=30+Math.floor(Math.random()*61); gainGPAll(gp); updateHUD(); PC._ar07gp=gp; },
       failTxt:()=>`罠にかかってしまった。`,
       failFn:()=>{ const dmg=1+Math.floor(Math.random()*6); PC.con=Math.max(1,PC.con-dmg); updateHUD(); PC._ar07dmg=dmg; return true; },
       choicesFn:(ok)=>{
        if(ok){
         const gp=PC._ar07gp||0;
         document.getElementById('story').innerHTML+=`<br><span style="color:#e8e4d8">+${gp}GP</span>`;
        } else {
         const dmg=PC._ar07dmg||0;
         document.getElementById('story').innerHTML+=`<br><span class="red">体力-${dmg}（残り${PC.con}）</span>`;
        }
        return [{label:' 続けて散策する',fn:()=>alRashidGoDistrict('caravanSq',ret)},{label:'← 街に戻る',go:'TOWN_AL_RASHID'}];
       },
      });
     }}]:[]),
     {label:' 断る', fn:()=>{
      story.innerHTML+=`<br><br><span style="color:#c0b098">男は舌打ちして立ち去った。</span>`;
      renderChoices([{label:' 続けて散策する',fn:()=>alRashidGoDistrict('caravanSq',ret)},{label:'← 街に戻る',go:'TOWN_AL_RASHID'}]);
     }},
    ]);
   }
  },
  // a_r08: 砂漠の薬草師の配達依頼
  { title:' 砂漠の薬草師の依頼',
   intro:`薬草を並べた老人が声をかけてきた。「この薬草を砂漠の外の町に届けてほしい。砂漠の者には行けない場所なんだ」`,
   sr:{attr:'chr', level:1},
   onSuccess:()=>{
    const herbs=['砂漠のサフラン','熱砂の乾燥薬草','砂岩草の粉末','灼熱の根茎','砂漠の蜜蝋'];
    const herb=herbs[Math.floor(Math.random()*herbs.length)];
    const destTowns=Object.keys(TOWNS).filter(t=>getRegionKey(t)!=='zahara_region');
    const destId=destTowns[Math.floor(Math.random()*destTowns.length)]||'khazan';
    const destTown=TOWNS[destId]||{name:'カザーヌ'};
    const destPeople=['薬師のエルダン','錬金術師バルド','治療師のエリス','薬商ロデリック'];
    const destPerson=destPeople[Math.floor(Math.random()*destPeople.length)];
    const reward=Math.floor((25+Math.floor(Math.random()*31))*1.5);
    const deadline=35+Math.floor(Math.random()*21);
    PC.quests=PC.quests||[];
    PC.quests.push({id:Date.now()+Math.random(),type:'delivery',status:'active',
     clientName:'砂漠の薬草師',receiverName:destPerson,item:herb,toTownId:destId,
     destIcon:'',destLabel:'薬草の配達',reward,deadlineDays:deadline,issuedDay:GAME_TIME.totalDays,
     crossRegion:true});
    updateHUD();
    return `「${herb}」を受け取った。${destTown.name}の${destPerson}まで届けてほしいという。<br><span style="color:#e8e4d8">宅配依頼取得（報酬${reward}GP　期限${deadline}日）</span>`; },
   onFail:()=>{ return `「あなたには任せられない」と老人は首を振った。`; }
  },
  // a_r09: 隊商の競売
  { title:' 隊商の競売',
   intro:`広場の中央で砂金や香辛料の競売が始まった。目玉は砂漠の奥地から持ち込まれた古代の品だ。`,
   sr:{attr:'lk', level:2},
   onSuccess:()=>{ const j=generateJewel(); const ap=15+Math.floor(Math.random()*11); gainAPAll(ap); updateHUD();
    return `競り落とすことに成功した！包みを開けると価値ある品が入っていた。<br><span style="color:#e8e4d8">宝石取得　経験値+${ap}</span>`; },
   onFail:()=>{ const ap=8+Math.floor(Math.random()*6); gainAPAll(ap); updateHUD();
    return `競り負けた。他の商人が高い値をつけてさらっていった。<br><span style="color:#e8e4d8">経験値+${ap}</span>`; }
  },
  // a_r10: 砂漠の剣士の挑戦
  { title:' 砂漠の剣士の挑戦',
   intro:`「腕試しをしよう」と砂漠の剣客が剣の柄に手をかけながら近づいてきた。`,
   sr:{attr:'dex', level:2},
   onSuccess:()=>{ const ap=25+Math.floor(Math.random()*16); gainAPAll(ap); changeTrust('al_rashid',3); updateHUD();
    return `剣士の攻撃を見切り、一本取った。「見事」と剣士は頭を下げた。<br><span style="color:#e8e4d8">信頼度+3　経験値+${ap}</span>`; },
   onFail:()=>{ const dmg=1+Math.floor(Math.random()*6); PC.con=Math.max(1,PC.con-dmg); updateHUD();
    return `打ち負かされた。砂漠の剣技は速く鋭かった。<br><span class="red">体力-${dmg}（残り${PC.con}）</span>`; }
  },
  // a_r11: 密偵との接触
  { title:' 密偵との接触',
   intro:`人混みの中でフードをかぶった人物がすれ違いざまに囁いた。「情報を売ろう」`,
   sr:{attr:'chr', level:2},
   onSuccess:()=>{ const ap=20+Math.floor(Math.random()*16); gainAPAll(ap); updateHUD();
    const info=['「砂漠の南東に、地図に載っていない隊商路がある。盗賊が使っているものだ」','「アル・ラシードの市場に偽物の砂金が出回っている。仕込んでいるのは北の商人組合だ」','「砂漠の封印廟の守り手が最近活発になっている。何かが目覚めつつある」'];
    return `情報は信頼できるものだった。<br><br><i>「${info[Math.floor(Math.random()*info.length)]}」</i><br><span style="color:#e8e4d8">経験値+${ap}</span>`; },
   onFail:()=>{ PC.gold=Math.max(0,(PC.gold||0)-10); updateHUD();
    return `前払いしたが、情報は全くの偽物だった。<br><span class="red">-10GP</span>`; }
  },
  // a_r12: 隊商の検問
  { title:' 隊商警備隊の検問',
   intro:`隊商の私兵が前を塞いだ。「身元を証明しろ」`,
   sr:{attr:'chr', level:1},
   onSuccess:()=>{ const ap=10+Math.floor(Math.random()*6); gainAPAll(ap); updateHUD();
    return `落ち着いて答えると、警備兵は道を開けた。<br><span style="color:#e8e4d8">経験値+${ap}</span>`; },
   onFail:()=>{ GAME_TIME.totalDays++; updateTimebar(); checkAging(); updateHUD();
    return `不審人物と判断され、詰め所で一日事情聴取を受けた。<br><span class="red">1日経過</span>`; }
  },
  // a_r13: 砂漠の英雄譚
  { title:' 砂漠の英雄譚',
   intro:`古老が子どもたちを囲んで砂漠の英雄の話を語っている。聞き入ってしまった。`,
   sr:{attr:'iq', level:1},
   onSuccess:()=>{ PC.lk=Math.min(99,(PC.lk||1)+1); const ap=25+Math.floor(Math.random()*16); gainAPAll(ap); updateHUD();
    return `物語の核心——英雄が砂漠を制した知恵——を理解した。心に刻まれた。<br><span style="color:#e8e4d8">LK+1　経験値+${ap}</span>`; },
   onFail:()=>{ const ap=8+Math.floor(Math.random()*6); gainAPAll(ap); updateHUD();
    return `楽しい話だったが、教訓は掴みきれなかった。<br><span style="color:#e8e4d8">経験値+${ap}</span>`; }
  },
  // a_r14: 水売りとの交渉
  { title:' 水売りとの交渉',
   intro:`「砂漠の水だ、高いが命の値段だ」と水売りが迫ってくる。`,
   sr:{attr:'chr', level:1},
   onSuccess:()=>{ PC._food=(PC._food||0)+5; updateHUD();
    return `巧みに値切った。適正価格で水と食料を入手できた。<br><span style="color:#e8e4d8">食料+5日分</span>`; },
   onFail:()=>{ PC.gold=Math.max(0,(PC.gold||0)-15); updateHUD();
    return `言いくるめられて高値で買ってしまった。<br><span class="red">-15GP</span>`; }
  },
  // a_r15: 砂漠の賭博師
  { title:' 砂漠の賭博師',
   intro:`「一勝負どうだ」とサイコロを持った男が笑いかけてきた。`,
   sr:{attr:'lk', level:2},
   onSuccess:()=>{ const gp=20+Math.floor(Math.random()*21); gainGPAll(gp); updateHUD();
    return `運が味方した。賭博師は悔しそうに金貨を差し出した。<br><span style="color:#e8e4d8">+${gp}GP</span>`; },
   onFail:()=>{ const gp=15+Math.floor(Math.random()*16); PC.gold=Math.max(0,(PC.gold||0)-gp); updateHUD();
    return `運が向かなかった。有り金を少し削られた。<br><span class="red">-${gp}GP</span>`; }
  },
  // a_r16: 砂漠議会の招集
  { title:' 砂漠議会の招集',
   intro:`「砂漠の長老会議が外来者にも門戸を開いている」と聞いた。参加してみるか？`,
   sr:{attr:'chr', level:2},
   onSuccess:()=>{
    const trust=getTrust('al_rashid');
    if(trust>=70){
     PC.lk=Math.min(99,(PC.lk||1)+1); changeTrust('al_rashid',10); const ap=40+Math.floor(Math.random()*21); gainAPAll(ap); updateHUD();
     return `長老たちは真剣な眼差しでこちらを見つめ、やがて静かに頷いた。「砂漠はあなたを認める」その言葉が体に響いた。<br><span style="color:#e8e4d8">LK+1　信頼度+10　経験値+${ap}</span>`;
    }
    const ap=15+Math.floor(Math.random()*11); gainAPAll(ap); updateHUD();
    return `議会の末席に座ることを許されたが、長老たちはまだこちらを値踏みしているようだった。<br><span style="color:#e8e4d8">経験値+${ap}</span>`; },
   onFail:()=>{ const ap=8+Math.floor(Math.random()*6); gainAPAll(ap); updateHUD();
    return `門前払いを受けた。「砂漠の者でもない外来者には早い」と告げられた。<br><span style="color:#e8e4d8">経験値+${ap}</span>`; }
  },
 ],
 al_rashid_bazaar: [
  // a_m01: 香辛料の値切り
  { title:' 香辛料の値切り',
   intro:`色鮮やかな香辛料が山積みになった露店。店主が「最高品質だ」と自慢している。`,
   sr:{attr:'chr', level:1},
   onSuccess:()=>{ PC._food=(PC._food||0)+6; const ap=10+Math.floor(Math.random()*6); gainAPAll(ap); updateHUD();
    return `巧みに値切って食料と香辛料を格安で手に入れた。<br><span style="color:#e8e4d8">食料+6日分　経験値+${ap}</span>`; },
   onFail:()=>{ PC.gold=Math.max(0,(PC.gold||0)-10); updateHUD();
    return `定価で買わされた。店主はにやにや笑っている。<br><span class="red">-10GP</span>`; }
  },
  // a_m02: 砂の中の宝石
  { title:' 砂の中の宝石',
   intro:`バザールの砂地を歩いていると、足元で何かが光った。`,
   sr:{attr:'lk', level:1},
   onSuccess:()=>{ const j=generateJewel(); updateHUD();
    return `砂の中に宝石が埋もれていた！誰かが落としたのかもしれない。<br><span style="color:#e8e4d8">宝石取得</span>`; },
   onFail:()=>{ return `ただの石ころだった。がっかりして立ち去った。`; }
  },
  // a_m03: 香辛料の贋物
  { title:' 香辛料の贋物',
   intro:`「高級サフランだ」と商人が小袋を差し出した。色が妙に均一すぎる気がするが……`,
   sr:{attr:'iq', level:2},
   onSuccess:()=>{ const ap=15+Math.floor(Math.random()*11); gainAPAll(ap); changeTrust('al_rashid',2); updateHUD();
    return `染料で色付けした偽物だと見抜いた。商人は慌てて逃げ出した。<br><span style="color:#e8e4d8">信頼度+2　経験値+${ap}</span>`; },
   onFail:()=>{ PC.gold=Math.max(0,(PC.gold||0)-15); updateHUD();
    return `本物だと信じて買ってしまった。後で偽物とわかった。<br><span class="red">-15GP</span>`; }
  },
  // a_m04: スリ集団
  { title:' スリ集団',
   intro:`バザールの人混みで気づくと四方を囲まれていた。`,
   sr:{attr:'dex', level:2},
   onSuccess:()=>{ const ap=15+Math.floor(Math.random()*11); gainAPAll(ap); updateHUD();
    return `素早く動いて財布を守りきった。集団は人混みに消えた。<br><span style="color:#e8e4d8">経験値+${ap}</span>`; },
   onFail:()=>{ const lost=PC.gold||0; PC.gold=0; PC.sp=0; PC.cp=0; updateHUD();
    return `気づいたときには空になっていた。所持金を全て失った。<br><span class="red">所持金全額消失（${lost}GP相当）</span>`; }
  },
  // a_m05: 絨毯商人の依頼
  { title:' 絨毯商人の依頼',
   intro:`「倉庫まで絨毯を運んでほしい」と商人が頼んできた。かなり重そうだが……`,
   sr:{attr:'st', level:1},
   onSuccess:()=>{ const gp=10+Math.floor(Math.random()*11); const ap=10+Math.floor(Math.random()*11); gainGPAll(gp); gainAPAll(ap); updateHUD();
    return `重い絨毯を難なく運んだ。商人は感心して報酬を弾んでくれた。<br><span style="color:#e8e4d8">+${gp}GP　経験値+${ap}</span>`; },
   onFail:()=>{ const dmg=1+Math.floor(Math.random()*3); PC.con=Math.max(1,PC.con-dmg); updateHUD();
    return `重さに耐えきれず絨毯を落としてしまった。腰を痛めた。<br><span class="red">体力-${dmg}（残り${PC.con}）</span>`; }
  },
  // a_m06: 他地方の商人
  { title:' 他地方からの商人',
   intro:`見慣れない装束の商人が荷を広げている。「砂漠にはない品だ」と言っている。`,
   sr:{attr:'chr', level:2},
   onSuccess:()=>{
    PC.invSpecialties=PC.invSpecialties||[];
    const allSpecs=[];
    Object.entries(REGION_SPECIALTIES).forEach(([rk,items])=>{
     if(rk!=='zahara_region') items.forEach(it=>allSpecs.push({...it,regionKey:rk}));
    });
    if(allSpecs.length){
     const it=allSpecs[Math.floor(Math.random()*allSpecs.length)];
     PC.invSpecialties.push({...it}); updateHUD();
     return `商人と話が弾んだ。お返しに他地方の特産品を一つ分けてくれた。<br><span style="color:#e8e4d8">${it.icon} ${it.name}取得</span>`;
    }
    return `商人と話が弾んだが、特に入手できるものはなかった。`; },
   onFail:()=>{ const gp=10+Math.floor(Math.random()*11); PC.gold=Math.max(0,(PC.gold||0)-gp); updateHUD();
    return `言いくるめられて必要でないものを買わされた。<br><span class="red">-${gp}GP</span>`; }
  },
  // a_m07: 砂漠の薬
  { title:' 砂漠の万能薬',
   intro:`「砂漠の秘薬だ、なんでも治る」と老人が小瓶を差し出した。液体の色が怪しい。`,
   sr:{attr:'iq', level:1},
   onSuccess:()=>{ const ap=10+Math.floor(Math.random()*6); gainAPAll(ap); updateHUD();
    return `怪しい色と匂いで偽物だと見抜いた。老人は舌打ちして引っ込んだ。<br><span style="color:#e8e4d8">経験値+${ap}</span>`; },
   onFail:()=>{ const dmg=1+Math.floor(Math.random()*6); PC.con=Math.max(1,PC.con-dmg); updateHUD();
    return `信じて飲んでしまった。腹が痛くなり体力が削られた。<br><span class="red">体力-${dmg}（残り${PC.con}）</span>`; }
  },
  // a_m08: バザールのスリ
  { title:' バザールのスリ',
   intro:`人混みを歩いていると、誰かが肩にぶつかってきた。財布に手が伸びている！`,
   sr:{attr:'dex', level:1},
   onSuccess:()=>{ const ap=10+Math.floor(Math.random()*6); gainAPAll(ap); updateHUD();
    return `瞬時に手首を掴んだ。スリは逃げ去り、財布は守られた。<br><span style="color:#e8e4d8">経験値+${ap}</span>`; },
   onFail:()=>{ const lost=5+Math.floor(Math.random()*11); PC.gold=Math.max(0,(PC.gold||0)-lost); updateHUD();
    return `気づいたときには財布が軽くなっていた。<br><span class="red">-${lost}GP</span>`; }
  },
  // a_m09: 隠し市場の噂
  { title:' 隠し市場の噂',
   intro:`「バザールの地下に闇市場がある」と誰かが耳打ちした。行ってみるか？`,
   sr:{attr:'iq', level:2},
   onSuccess:()=>{
    PC.invSpecialties=PC.invSpecialties||[];
    const allSpecs=[];
    Object.entries(REGION_SPECIALTIES).forEach(([rk,items])=>{
     if(rk!=='zahara_region') items.forEach(it=>allSpecs.push({...it,regionKey:rk}));
    });
    const picks=[]; const pool=[...allSpecs];
    for(let i=0;i<2&&pool.length;i++){ const idx=Math.floor(Math.random()*pool.length); picks.push(pool.splice(idx,1)[0]); }
    picks.forEach(it=>PC.invSpecialties.push({...it})); updateHUD();
    return `地下市場を見つけた。他地方の品が安く並んでいた。<br><span style="color:#e8e4d8">${picks.map(it=>it.icon+' '+it.name).join('　')}取得</span>`; },
   onFail:()=>{ PC.gold=Math.max(0,(PC.gold||0)-10); updateHUD();
    return `案内人に前金を払ったら逃げられた。罠だった。<br><span class="red">-10GP</span>`; }
  },
  // a_m10: 砂金鑑定師
  { title:' 砂金鑑定師',
   intro:`「砂金の真贋を見てほしい」と商人が頼んできた。報酬を払うと言っている。`,
   sr:{attr:'iq', level:1},
   onSuccess:()=>{ const gp=10+Math.floor(Math.random()*11); const ap=15+Math.floor(Math.random()*11); gainGPAll(gp); gainAPAll(ap); updateHUD();
    return `本物と偽物を正確に見分けた。商人は満足して報酬を払ってくれた。<br><span style="color:#e8e4d8">+${gp}GP　経験値+${ap}</span>`; },
   onFail:()=>{ PC.chr=Math.max(1,(PC.chr||1)-1); updateHUD();
    return `判断を誤ってしまった。商人は失望し、悪い噂が広まった。<br><span class="red">CHR-1</span>`; }
  },
  // a_m11: 遊牧民の織物
  { title:' 遊牧民の織物',
   intro:`砂漠の遊牧民が独特の文様が入った織物を広げている。珍しい品だ。`,
   sr:{attr:'chr', level:1},
   onSuccess:()=>{
    const cost=20;
    if((PC.gold||0)>=cost){
     PC.gold-=cost;
     PC.invSpecialties=PC.invSpecialties||[];
     const weaveItem={name:'遊牧民の織物',icon:'',baseCost:35,regionKey:'zahara_region',weight:20};
     PC.invSpecialties.push({...weaveItem}); updateHUD();
     return `遊牧民と話が弾んだ。特別に譲ってもらえた。他の地方では高値で売れそうだ。<br><span style="color:#e8e4d8">遊牧民の織物取得（-${cost}GP）</span>`;
    }
    return `話は弾んだが、手持ちが足りなかった。`;
   },
   onFail:()=>{ return `遊牧民はこちらを一瞥して目をそらした。気難しい人のようだ。`; }
  },
  // a_m12: 砂漠の薬草師
  { title:' 砂漠の薬草師の診療',
   intro:`「顔色が悪い、診てやろう」と薬草師の老婆が声をかけてきた。`,
   sr:{attr:'con', level:1},
   onSuccess:()=>{ const heal=2+Math.floor(Math.random()*5); PC.con=Math.min(PC.maxCon,PC.con+heal); updateHUD();
    return `体に薬草を貼り、砂漠の薬を飲んだ。じわじわと体力が戻ってきた。<br><span style="color:#e8e4d8">体力+${heal}回復（現在${PC.con}）</span>`; },
   onFail:()=>{ const ap=8+Math.floor(Math.random()*6); gainAPAll(ap); updateHUD();
    return `体が薬草を受け付けなかった。効果はなかったが、老婆の心遣いは嬉しかった。<br><span style="color:#e8e4d8">経験値+${ap}</span>`; }
  },
  // a_m13: 古代硬貨の発見
  { title:' 古代硬貨の発見',
   intro:`バザールの砂地に足を取られたとき、何かが足の下でぴかりと光った。`,
   sr:{attr:'lk', level:2},
   onSuccess:()=>{ PC.lk=Math.min(99,(PC.lk||1)+1); const j=generateJewel(); updateHUD();
    return `掘り返すと古代王国の金貨が出てきた。しかも複数。価値ある発見だ。<br><span style="color:#e8e4d8">LK+1　宝石取得</span>`; },
   onFail:()=>{ const ap=8+Math.floor(Math.random()*6); gainAPAll(ap); updateHUD();
    return `掘り返したが、ただの石だった。砂漠は気まぐれだ。<br><span style="color:#e8e4d8">経験値+${ap}</span>`; }
  },
  // a_m14: 荷物持ちの依頼
  { title:' 荷物持ちの依頼',
   intro:`商人が山積みの荷物の前で途方に暮れている。「倉庫まで運んでくれないか」`,
   sr:{attr:'st', level:1},
   onSuccess:()=>{ const gp=5+Math.floor(Math.random()*11); const ap=15+Math.floor(Math.random()*11); gainGPAll(gp); gainAPAll(ap); updateHUD();
    return `荷物を難なく運んだ。商人はほっとした顔で報酬を渡した。<br><span style="color:#e8e4d8">+${gp}GP　経験値+${ap}</span>`; },
   onFail:()=>{ const dmg=1+Math.floor(Math.random()*3); PC.con=Math.max(1,PC.con-dmg); updateHUD();
    return `途中で荷崩れを起こし、重いものが体に当たった。<br><span class="red">体力-${dmg}（残り${PC.con}）</span>`; }
  },
  // a_m15: 砂漠の地図商
  { title:' 砂漠の地図商',
   intro:`色あせた地図を広げた男が「遺跡の場所がわかる地図だ」と近づいてきた。`,
   sr:{attr:'iq', level:1},
   onSuccess:()=>{ PC.lk=Math.min(99,(PC.lk||1)+1); const ap=15+Math.floor(Math.random()*11); gainAPAll(ap); updateHUD();
    return `地図の記号を読み解き、本物だと確信した。古代遺跡への道が頭に刻まれた。<br><span style="color:#e8e4d8">LK+1　経験値+${ap}</span>`; },
   onFail:()=>{ PC.gold=Math.max(0,(PC.gold||0)-10); updateHUD();
    return `買ってみたが、白紙同然の偽物だった。<br><span class="red">-10GP</span>`; }
  },
  // a_m16: 隊商長の買い物
  { title:' 隊商長の品定め',
   intro:`大商人が品物を一つ一つ丁寧に確かめている。思い切って話しかけてみた。`,
   sr:{attr:'chr', level:2},
   onSuccess:()=>{ const ap=20+Math.floor(Math.random()*11); gainAPAll(ap); changeTrust('al_rashid',5); updateHUD();
    return `隊商長は目を細めた。「あなたは砂漠を理解している」信頼度が上がった。<br><span style="color:#e8e4d8">信頼度+5　経験値+${ap}</span>`; },
   onFail:()=>{ const ap=5+Math.floor(Math.random()*6); gainAPAll(ap); updateHUD();
    return `隊商長は一瞥しただけで品物に戻った。相手にされなかった。<br><span style="color:#e8e4d8">経験値+${ap}</span>`; }
  },
 ],
};

// ── 散策イベントのSR処理 ──
// イベント発火後にSRUIを出し、結果に応じてonSuccess/onFailを呼ぶ
function fireExploreEvent(ev, returnNode){
 const storyEl = document.getElementById('story');
 if(storyEl){
 storyEl.innerHTML = `<span class="dim" style="font-size:calc(var(--font-sm) - 1px)">── 街を散策した ──</span><br><br>
 <span style="color:#f0ece0">${ev.title}</span><br><br>
 ${ev.intro}<br><br>
 `;
 }

 // ── 戦闘型イベント ──
 if(ev.combat){
 const c = ev.combat;
 renderChoices([
 { label:` 戦う`, fn:()=>{
 startCombat({...c, win:'__explore_win__', lose:'DEAD',
 _exploreWin: c._exploreWin, _returnNode: returnNode });
 }, go:'__travel__' },
 { label:` 逃げる（素早さ Lv1 能力値テスト）`, fn:()=>{
 setupSavingRoll({
 attr:'spd', level:1,
 onSuccess:()=>{
 if(storyEl) storyEl.innerHTML = `<span class="dim" style="font-size:calc(var(--font-sm) - 1px)">── 街を散策した ──</span><br><br>
 <span style="color:#f0ece0">${ev.title}</span><br><br>
 <span style="color:#f0ece0"> 逃走成功！</span><br><br>
 ${ev.intro}<br>辛くも逃げ切った。息が上がったが無事だ。<br><br>
 `;
 renderChoices([{label:'← 街に戻る', go:returnNode}]);
 },
 onFail:()=>{
 const dmg = 1 + Math.floor(Math.random()*4);
 PC.con = Math.max(1, PC.con - dmg); updateHUD();
 if(storyEl) storyEl.innerHTML = `<span class="dim" style="font-size:calc(var(--font-sm) - 1px)">── 街を散策した ──</span><br><br>
 <span style="color:#f0ece0">${ev.title}</span><br><br>
 <span style="color:#e0d0d0"> 逃走失敗…</span><br><br>
 ${ev.intro}<br>逃げようとしたが追いつかれ、一撃を食らった。<br>
 <span class="red">体力-${dmg}（残り${PC.con}）</span><br><br>
 `;
 renderChoices([{label:'← 街に戻る', go:returnNode}]);
 },
 });
 }, go:'__travel__' },
 ]);

 // 戦闘勝利後の処理をcbtStateに仕込む（戦闘エンジンのwin遷移をhookする）
 // __explore_win__ は go() が呼ばれたとき専用ハンドラで処理
 if(!window._exploreReturnNode) window._exploreReturnNode = null;
 window._exploreReturnNode = returnNode;
 window._exploreCombatWin = c._exploreWin || null;
 return;
 }

 // ── SR型イベント ──
 const attrNames = {st:'強さ',iq:'知力',lk:'運',con:'体力',dex:'器用さ',chr:'魅力',spd:'素早さ'};
 setupSavingRoll({
 attr: ev.sr.attr,
 level: ev.sr.level,
 onSuccess: ()=>{
 const result = ev.onSuccess();
 if(storyEl){
 storyEl.innerHTML = `<span class="dim" style="font-size:calc(var(--font-sm) - 1px)">── 街を散策した ──</span><br><br>
 <span style="color:#f0ece0">${ev.title}</span><br><br>
 ${ev.intro}<br><br>
 <span style="color:#f0ece0"> ${attrNames[ev.sr.attr]} Lv${ev.sr.level} 能力値テスト成功！</span><br><br>
 ${result}<br><br>
 `;
 }
 renderChoices([{label:'← 街に戻る', go:returnNode}]);
 },
 onFail: ()=>{
 const result = ev.onFail();
 if(storyEl){
 storyEl.innerHTML = `<span class="dim" style="font-size:calc(var(--font-sm) - 1px)">── 街を散策した ──</span><br><br>
 <span style="color:#f0ece0">${ev.title}</span><br><br>
 ${ev.intro}<br><br>
 <span style="color:#e0d0d0"> ${attrNames[ev.sr.attr]} Lv${ev.sr.level} 能力値テスト失敗…</span><br><br>
 ${result}<br><br>
 `;
 }
 renderChoices([{label:'← 街に戻る', go:returnNode}]);
 },
 });
}


