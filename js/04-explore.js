/* ── アルバイト・街区散策システム（カザーヌ・アル＝ラシード・エルマリア） ── */

// ══════════════════════════════════════════
// アルバイト（1週間・10GP・食料支給・16%事件）
// ══════════════════════════════════════════
const PARTTIME_JOBS = {
 khazan: { icon:'', name:'王都カザーヌ',
  jobs:['王城の荷物運び','市場の警備補助','商人ギルドの書類整理','冒険者ギルドの受付補助','酒場の給仕','露店の売り子'],
  incidents:[
   { txt:'市場で火事が発生した。炎の中に取り残された人がいる！', attr:'st', lv:2,
     ok:'力を振り絞って助け出した。市長から感謝状と少しの礼金が出た。', ok_fn:()=>{ gainGPAll(5); },
     ng:'炎に弾かれ、手の甲に火傷を負った。', ng_fn:()=>{ const d=2+Math.floor(Math.random()*3); PC.con=Math.max(0,PC.con-d); return d; } },
   { txt:'酔った冒険者に絡まれ、殴りかかってきた！', attr:'dex', lv:2,
     ok:'身をかわして反撃し、追い払った。周囲から拍手が起きた。', ok_fn:()=>{ gainAPAll(10); },
     ng:'拳をまともにもらってしまった。', ng_fn:()=>{ const d=3+Math.floor(Math.random()*4); PC.con=Math.max(0,PC.con-d); return d; } },
   { txt:'荷物の中に密輸品が混じっており、衛兵に事情聴取された。うまく説明できるか？', attr:'iq', lv:1,
     ok:'状況を冷静に説明し、嫌疑が晴れた。衛兵も納得してくれた。', ok_fn:()=>{ gainAPAll(8); },
     ng:'説明が上手くできず、丸一日拘留された。疲労が蓄積した。', ng_fn:()=>{ const d=2; PC.con=Math.max(0,PC.con-d); return d; } },
   { txt:'同僚が急病で倒れ、仕事を全部肩代わりすることになった。体力が持つか…', attr:'con', lv:1,
     ok:'何とかこなし切った。雇い主に「頼りになる」と褒められた。', ok_fn:()=>{ gainAPAll(10); },
     ng:'無理がたたり、帰り道にへたり込んだ。', ng_fn:()=>{ const d=2+Math.floor(Math.random()*3); PC.con=Math.max(0,PC.con-d); return d; } },
  ]},
 port_argon: { icon:'', name:'ポート・アルゴン',
  jobs:['港の荷揚げ作業','漁船の網修繕','倉庫番','魚の行商手伝い','船の甲板磨き','灯台の燃料運び'],
  incidents:[
   { txt:'突然の嵐で荷が海に落ちかけた。綱を掴んで引き上げられるか？', attr:'st', lv:2,
     ok:'全力で引き上げた。船長が礼を言い、ボーナスをくれた。', ok_fn:()=>{ gainGPAll(4); },
     ng:'波に飲まれ、荷ごと海に落ちた。ずぶ濡れで体が冷えた。', ng_fn:()=>{ const d=2+Math.floor(Math.random()*3); PC.con=Math.max(0,PC.con-d); return d; } },
   { txt:'密輸業者に荷物を間違えて渡してしまい、脅迫された！逃げられるか？', attr:'spd', lv:1,
     ok:'足速に逃げ、衛兵に知らせた。密輸業者は捕まった。', ok_fn:()=>{ gainAPAll(8); },
     ng:'追いつかれ、口止め料を奪われた。', ng_fn:()=>{ const d=2; PC.gold=Math.max(0,PC.gold-d*100); return d; } },
   { txt:'漁師同士の喧嘩が始まった。仲裁に入るか？', attr:'chr', lv:1,
     ok:'うまく仲裁し、両者が握手した。港の顔役に気に入られた。', ok_fn:()=>{ gainAPAll(10); },
     ng:'逆に両方から怒鳴られ、ストレスで体を痛めた。', ng_fn:()=>{ const d=2+Math.floor(Math.random()*2); PC.con=Math.max(0,PC.con-d); return d; } },
   { txt:'足場の悪い波止場で大波が来た。踏みとどまれるか？', attr:'dex', lv:2,
     ok:'踏ん張って難を逃れた。体幹が鍛えられた気がする。', ok_fn:()=>{ gainAPAll(8); },
     ng:'波にさらわれ、岸壁に叩きつけられた。', ng_fn:()=>{ const d=3+Math.floor(Math.random()*4); PC.con=Math.max(0,PC.con-d); return d; } },
  ]},
 stonehiem: { icon:'', name:'ストーンヘイム',
  jobs:['鉱山の荷運び','鉱石の選別作業','鍛冶屋の火起こし','採掘現場の見張り','炭の仕分け','道具の手入れ'],
  incidents:[
   { txt:'坑道で落盤が起きた！仲間が岩の下敷きになっている。引き出せるか？', attr:'st', lv:2,
     ok:'岩を押しのけ仲間を救出した。鉱山長から感謝された。', ok_fn:()=>{ gainAPAll(15); gainGPAll(3); },
     ng:'岩は動かず、自分も落石に当たってしまった。', ng_fn:()=>{ const d=3+Math.floor(Math.random()*4); PC.con=Math.max(0,PC.con-d); return d; } },
   { txt:'鉱山ガスが充満しはじめた。素早く脱出できるか？', attr:'spd', lv:1,
     ok:'素早く坑道を抜け出した。危機一髪だった。', ok_fn:()=>{ gainAPAll(8); },
     ng:'ガスを吸い込んでしまった。頭がひどく痛む。', ng_fn:()=>{ const d=3+Math.floor(Math.random()*3); PC.con=Math.max(0,PC.con-d); return d; } },
   { txt:'鍛冶場の炉が暴発した！爆風を受け流せるか？', attr:'dex', lv:2,
     ok:'咄嗟に身をかわした。衝撃はあったが怪我はない。', ok_fn:()=>{ gainAPAll(10); },
     ng:'爆風をまともに受け、火傷した。', ng_fn:()=>{ const d=3+Math.floor(Math.random()*4); PC.con=Math.max(0,PC.con-d); return d; } },
   { txt:'掘り当てた古い骨が何かの遺体らしく、衛兵と学者が来た。説明できるか？', attr:'iq', lv:1,
     ok:'状況を的確に説明し、学者に感謝された。', ok_fn:()=>{ gainAPAll(8); },
     ng:'説明が曖昧で、現場検証に半日付き合わされた。', ng_fn:()=>{ const d=1; PC.con=Math.max(0,PC.con-d); return d; } },
  ]},
 elsia: { icon:'', name:'エルシア',
  jobs:['森の薬草採取補助','遺跡の草刈り','エルフの工房掃除','木の実の選別','精霊石の磨き','森林の見回り'],
  incidents:[
   { txt:'精霊の怒りに触れ、嵐が起きた。精霊をなだめられるか？', attr:'chr', lv:2,
     ok:'心を込めて語りかけると嵐が収まった。精霊から小さな加護を受けた。', ok_fn:()=>{ gainAPAll(15); },
     ng:'精霊の怒りはさらに激しくなり、雷に打たれた。', ng_fn:()=>{ const d=4+Math.floor(Math.random()*4); PC.con=Math.max(0,PC.con-d); return d; } },
   { txt:'採取中に毒草に触れてしまった。毒に耐えられるか？', attr:'con', lv:2,
     ok:'毒に抗い、症状は軽微だった。エルフの薬師に感謝された。', ok_fn:()=>{ gainAPAll(8); },
     ng:'毒が回り、後遺症が残った。指先の感覚が鈍くなった。', ng_fn:()=>{ const d=3+Math.floor(Math.random()*4); PC.con=Math.max(0,PC.con-d); PC.dex=Math.max(1,PC.dex-1); return d; } },
   { txt:'エルフの神聖な儀式を誤って邪魔してしまった。言い訳できるか？', attr:'iq', lv:2,
     ok:'丁重に詫び、理由を説明した。エルフは最終的に許してくれた。', ok_fn:()=>{ gainAPAll(10); },
     ng:'言葉が足りず、怒ったエルフに罰を与えられた。', ng_fn:()=>{ const d=3+Math.floor(Math.random()*3); PC.con=Math.max(0,PC.con-d); return d; } },
   { txt:'密猟者と鉢合わせした！逃げるか？', attr:'spd', lv:1,
     ok:'素早く逃げ、エルフの守り手に知らせた。密猟者は捕まった。', ok_fn:()=>{ gainAPAll(10); },
     ng:'追い詰められ、一発殴られた。', ng_fn:()=>{ const d=2+Math.floor(Math.random()*4); PC.con=Math.max(0,PC.con-d); return d; } },
  ]},
 verda: { icon:'', name:'ヴェルダ村',
  jobs:['猟師の罠見回り','農作業の手伝い','獣の皮なめし補助','薪割り','干し肉作り補助','猟犬の世話'],
  incidents:[
   { txt:'猟師の罠に足を引っかけてしまった。外せるか？', attr:'dex', lv:1,
     ok:'巧みに罠を外した。猟師に「器用だな」と言われた。', ok_fn:()=>{ gainAPAll(8); },
     ng:'外そうとしてさらに締まり、足を痛めた。', ng_fn:()=>{ const d=2+Math.floor(Math.random()*3); PC.con=Math.max(0,PC.con-d); return d; } },
   { txt:'熊が農場に現れた！追い払えるか？', attr:'st', lv:2,
     ok:'大声と身振りで熊を追い払った。村人から英雄扱いされた。', ok_fn:()=>{ gainAPAll(12); gainGPAll(2); },
     ng:'熊に引っ掻かれた。逃げるのがやっとだった。', ng_fn:()=>{ const d=4+Math.floor(Math.random()*4); PC.con=Math.max(0,PC.con-d); return d; } },
   { txt:'蛇に噛まれた同僚に応急処置が必要だ。知識はあるか？', attr:'iq', lv:1,
     ok:'適切な処置で同僚の命を救った。村中から感謝された。', ok_fn:()=>{ gainAPAll(12); },
     ng:'処置を誤り、自分も少し毒液に触れてしまった。', ng_fn:()=>{ const d=2+Math.floor(Math.random()*2); PC.con=Math.max(0,PC.con-d); return d; } },
   { txt:'嵐が来た。収穫物を倉庫に運び込めるか間に合うか？', attr:'spd', lv:1,
     ok:'素早く運び込み、全部守った。農家に礼を言われた。', ok_fn:()=>{ gainAPAll(8); },
     ng:'間に合わず、ずぶ濡れで体が冷えた。', ng_fn:()=>{ const d=2+Math.floor(Math.random()*2); PC.con=Math.max(0,PC.con-d); return d; } },
  ]},
 rimholm: { icon:'', name:'リムホルム',
  jobs:['遺跡発掘の土運び','古文書の整理補助','探索者への道案内','採掘品の搬出','発掘道具の手入れ','測量の補助'],
  incidents:[
   { txt:'発掘中に遺跡の一部が崩れた！瓦礫に埋まりそうだ。逃げ切れるか？', attr:'spd', lv:2,
     ok:'素早く駆け抜け、難を逃れた。', ok_fn:()=>{ gainAPAll(10); },
     ng:'瓦礫に埋まり、掘り出されるまで時間がかかった。体が痛い。', ng_fn:()=>{ const d=3+Math.floor(Math.random()*4); PC.con=Math.max(0,PC.con-d); return d; } },
   { txt:'古代の罠を誤作動させてしまった。罠の機構を読み解けるか？', attr:'iq', lv:2,
     ok:'仕組みを瞬時に見切り、難なく止めた。学者に称賛された。', ok_fn:()=>{ gainAPAll(15); },
     ng:'罠が完全に作動し、矢を受けた。', ng_fn:()=>{ const d=3+Math.floor(Math.random()*4); PC.con=Math.max(0,PC.con-d); return d; } },
   { txt:'遺物の横流しを目撃した。証言するか？証言台で動揺しないか？', attr:'chr', lv:1,
     ok:'堂々と証言し、犯人は捕まった。調査団から報奨が出た。', ok_fn:()=>{ gainGPAll(4); gainAPAll(8); },
     ng:'証言が曖昧で、逆に疑われた。精神的に消耗した。', ng_fn:()=>{ const d=2; PC.con=Math.max(0,PC.con-d); return d; } },
   { txt:'地底から唸り声がした。地盤の安全を確かめる度胸があるか？', attr:'lk', lv:2,
     ok:'恐る恐る調べると、鉱石の収縮音だとわかった。報告して褒められた。', ok_fn:()=>{ gainAPAll(10); },
     ng:'足元が崩れ、落穴に落ちてしまった。', ng_fn:()=>{ const d=3+Math.floor(Math.random()*3); PC.con=Math.max(0,PC.con-d); return d; } },
  ]},
 marakai: { icon:'', name:'マラカイ',
  jobs:['漁港の網干し','珊瑚礁の清掃補助','潮干狩りの補助','船の塗装補助','波止場の警備','海産物の仕分け'],
  incidents:[
   { txt:'サメが港に迷い込んだ！漁師たちがパニックになっている。誘導できるか？', attr:'chr', lv:1,
     ok:'冷静に指示を出し、サメを沖に追い払うことができた。', ok_fn:()=>{ gainAPAll(12); },
     ng:'パニックに巻き込まれ、桟橋から落ちてしまった。', ng_fn:()=>{ const d=2+Math.floor(Math.random()*3); PC.con=Math.max(0,PC.con-d); return d; } },
   { txt:'嵐で船が流された！綱で繋ぎ止めら繋げるか？', attr:'st', lv:2,
     ok:'綱を力強く引いて船を固定した。', ok_fn:()=>{ gainAPAll(10); },
     ng:'綱に手を焼き、ずぶ濡れになった。体が冷えた。', ng_fn:()=>{ const d=2+Math.floor(Math.random()*3); PC.con=Math.max(0,PC.con-d); return d; } },
   { txt:'密漁者の仲間と間違えられ、衛兵に囲まれた。釈明できるか？', attr:'iq', lv:1,
     ok:'状況を論理的に説明し、すぐに解放された。', ok_fn:()=>{ gainAPAll(8); },
     ng:'説明がもたつき、半日拘束された。疲れ果てた。', ng_fn:()=>{ const d=1; PC.con=Math.max(0,PC.con-d); return d; } },
   { txt:'荷物を盗もうとした男が突然殴りかかってきた！', attr:'dex', lv:2,
     ok:'巧みに躱して取り押さえた。衛兵に引き渡した。', ok_fn:()=>{ gainAPAll(10); gainGPAll(2); },
     ng:'殴り飛ばされた。荷物も一部奪われた。', ng_fn:()=>{ const d=3+Math.floor(Math.random()*3); PC.con=Math.max(0,PC.con-d); return d; } },
  ]},
 al_rashid: { icon:'', name:'アル・ラシード',
  jobs:['隊商の荷物番','香辛料の計量補助','砂漠ガイドの補助','市場の警備','宿の水汲み','商人の通訳補助'],
  incidents:[
   { txt:'砂嵐が急に来た。荷物をまとめて隊商の天幕に避難できるか？', attr:'spd', lv:1,
     ok:'素早く荷をまとめ、隊商を守った。商人に礼を言われた。', ok_fn:()=>{ gainAPAll(8); gainGPAll(2); },
     ng:'砂嵐をまともに受け、砂を大量に吸い込んだ。', ng_fn:()=>{ const d=2+Math.floor(Math.random()*3); PC.con=Math.max(0,PC.con-d); return d; } },
   { txt:'荷物に仕掛けられた罠が作動した。見抜けるか？', attr:'lk', lv:2,
     ok:'罠に気づき、間一髪で回避した。', ok_fn:()=>{ gainAPAll(12); },
     ng:'罠が作動し、鋭利なものが腕を掠めた。', ng_fn:()=>{ const d=3+Math.floor(Math.random()*4); PC.con=Math.max(0,PC.con-d); return d; } },
   { txt:'商人間の口論が激化し、刃傷沙汰になりそうだ。仲裁できるか？', attr:'chr', lv:2,
     ok:'弁舌を振るい、両者を説得した。', ok_fn:()=>{ gainAPAll(12); },
     ng:'仲裁に失敗し、飛んできたものが当たった。', ng_fn:()=>{ const d=2+Math.floor(Math.random()*3); PC.con=Math.max(0,PC.con-d); return d; } },
   { txt:'詐欺師に目をつけられ、偽の契約書にサインさせようとしてきた。見破れるか？', attr:'iq', lv:2,
     ok:'書類の矛盾を見抜き、詐欺師を追い払った。', ok_fn:()=>{ gainAPAll(12); },
     ng:'騙されて偽の代金を払ってしまった。', ng_fn:()=>{ const d=3; PC.gold=Math.max(0,PC.gold-d*100); return d; } },
  ]},
 oasis_fort: { icon:'', name:'オアシス砦',
  jobs:['砦の見張り補助','井戸の水汲み','旅人向けの食事配膳','馬の世話','武器庫の整理','砂嵐対策の土嚢積み'],
  incidents:[
   { txt:'砦への奇襲があった！防衛ラインを守れるか？', attr:'st', lv:2,
     ok:'敵の突入を体を張って防いだ。隊長に認められた。', ok_fn:()=>{ gainAPAll(15); gainGPAll(3); },
     ng:'奇襲の混乱の中で一撃を受けた。', ng_fn:()=>{ const d=4+Math.floor(Math.random()*4); PC.con=Math.max(0,PC.con-d); return d; } },
   { txt:'井戸の中に毒蛇が落ちていた。素早く除けられるか？', attr:'dex', lv:1,
     ok:'棒で器用に追い出した。', ok_fn:()=>{ gainAPAll(8); },
     ng:'蛇に噛まれた。毒の後遺症で手先が震えるようになった。', ng_fn:()=>{ const d=2+Math.floor(Math.random()*3); PC.con=Math.max(0,PC.con-d); PC.dex=Math.max(1,PC.dex-1); return d; } },
   { txt:'砂漠の盗賊が旅人を追ってきた。旅人を庇えるか？', attr:'chr', lv:1,
     ok:'堂々と立ちはだかり、盗賊を退散させた。旅人に感謝された。', ok_fn:()=>{ gainAPAll(10); gainGPAll(2); },
     ng:'盗賊に突き飛ばされた。', ng_fn:()=>{ const d=2+Math.floor(Math.random()*3); PC.con=Math.max(0,PC.con-d); return d; } },
   { txt:'古井戸の縁が崩れた。落下を回避できるか？', attr:'lk', lv:2,
     ok:'崩れる寸前に飛び退いた。冷や汗をかいた。', ok_fn:()=>{ gainAPAll(8); },
     ng:'穴に落ちた。這い上がるのに苦労した。', ng_fn:()=>{ const d=3+Math.floor(Math.random()*4); PC.con=Math.max(0,PC.con-d); return d; } },
  ]},
 saroon: { icon:'', name:'サルーン',
  jobs:['ラクダの世話','砂漠交易品の仕分け','砦の修繕補助','砂除け柵の設置','砂漠ガイドの装備チェック','旅人宿の給仕'],
  incidents:[
   { txt:'ラクダが突然暴走した。制御できるか？', attr:'st', lv:2,
     ok:'体を張って手綱を引き、止めた。商人に絶賛された。', ok_fn:()=>{ gainAPAll(10); gainGPAll(2); },
     ng:'蹴り飛ばされた。あばらが痛い。', ng_fn:()=>{ const d=3+Math.floor(Math.random()*4); PC.con=Math.max(0,PC.con-d); return d; } },
   { txt:'砂漠の幻術師に惑わされた。幻を見破れるか？', attr:'iq', lv:2,
     ok:'惑わされずに見破り、幻術師を追い払った。', ok_fn:()=>{ gainAPAll(12); },
     ng:'幻に翻弄され、砂漠を長時間さまよった。体力を消耗した。', ng_fn:()=>{ const d=3+Math.floor(Math.random()*3); PC.con=Math.max(0,PC.con-d); return d; } },
   { txt:'盗賊に追われた隊商が助けを求めてきた！盗賊を牽制できるか？', attr:'chr', lv:1,
     ok:'毅然と立ち向かい、盗賊を退けた。隊商から礼金が出た。', ok_fn:()=>{ gainAPAll(10); gainGPAll(3); },
     ng:'盗賊に怒鳴り飛ばされ、怖じ気づいてしまった。', ng_fn:()=>{ const d=2+Math.floor(Math.random()*2); PC.con=Math.max(0,PC.con-d); return d; } },
   { txt:'強烈な熱波が来た。耐えられるか？', attr:'con', lv:1,
     ok:'水を飲み、日陰で休んで乗り切った。', ok_fn:()=>{ gainAPAll(6); },
     ng:'熱中症で倒れ、作業ができなくなった。', ng_fn:()=>{ const d=3+Math.floor(Math.random()*3); PC.con=Math.max(0,PC.con-d); return d; } },
  ]},
 duna: { icon:'', name:'デュナ',
  jobs:['古代遺物の洗浄補助','砂漠商人の護衛補助','砂金の篩い作業','廃墟の測量補助','砂嵐後の道路整備','水売りの手伝い'],
  incidents:[
   { txt:'古代の罠が作動した！咄嗟に避けられるか？', attr:'dex', lv:2,
     ok:'反射的に跳び退いた。罠の構造を記録して遺跡学者に報告した。', ok_fn:()=>{ gainAPAll(12); },
     ng:'罠の矢が足を掠めた。痛みで動きが鈍くなった。', ng_fn:()=>{ const d=3+Math.floor(Math.random()*4); PC.con=Math.max(0,PC.con-d); return d; } },
   { txt:'砂嵐の中で重要な遺物を紛失した。見つけ出せるか？', attr:'lk', lv:2,
     ok:'嵐の中で奇跡的に見つけた。依頼主が大喜びした。', ok_fn:()=>{ gainAPAll(12); gainGPAll(3); },
     ng:'見つからず、弁償を求められた。', ng_fn:()=>{ const d=3; PC.gold=Math.max(0,PC.gold-d*100); return d; } },
   { txt:'遺跡に迷い込んだ旅人を発見した。正しい道を教えられるか？', attr:'iq', lv:1,
     ok:'道を示し、旅人を安全に救出した。', ok_fn:()=>{ gainAPAll(10); gainGPAll(2); },
     ng:'道を間違え、二人ともしばらく迷った。消耗した。', ng_fn:()=>{ const d=2+Math.floor(Math.random()*2); PC.con=Math.max(0,PC.con-d); return d; } },
   { txt:'発掘品を巡る業者同士の口論が激化した。仲裁できるか？', attr:'chr', lv:2,
     ok:'うまく調停し、取引をまとめた。両者から礼を受けた。', ok_fn:()=>{ gainAPAll(10); gainGPAll(2); },
     ng:'口論に巻き込まれ、一方から怒鳴り飛ばされた。', ng_fn:()=>{ const d=1; PC.con=Math.max(0,PC.con-d); return d; } },
  ]},
 yeldun: { icon:'', name:'イェルドゥン',
  jobs:['山岳交易品の仕分け','鍛冶場の炭熾こし','山道の整備補助','鉱石の荷運び','商隊の荷物番','市場の荷役'],
  incidents:[
   { txt:'山道で落石が来た！避けられるか？', attr:'dex', lv:2,
     ok:'素早く跳び退き、難を逃れた。', ok_fn:()=>{ gainAPAll(10); },
     ng:'岩の破片が当たった。頭が痛い。', ng_fn:()=>{ const d=3+Math.floor(Math.random()*4); PC.con=Math.max(0,PC.con-d); return d; } },
   { txt:'強盗が商人を襲っている。助けに入れるか？', attr:'st', lv:2,
     ok:'強盗を追い払い、商人を救った。報奨金をもらった。', ok_fn:()=>{ gainAPAll(12); gainGPAll(4); },
     ng:'強盗に殴られた。何とか追い払ったが傷を負った。', ng_fn:()=>{ const d=4+Math.floor(Math.random()*4); PC.con=Math.max(0,PC.con-d); return d; } },
   { txt:'凍った坂で荷車が暴走した。止められるか？', attr:'st', lv:1,
     ok:'荷車に飛びついて止めた。荷主に感謝された。', ok_fn:()=>{ gainAPAll(8); gainGPAll(2); },
     ng:'荷車に弾き飛ばされた。', ng_fn:()=>{ const d=2+Math.floor(Math.random()*3); PC.con=Math.max(0,PC.con-d); return d; } },
   { txt:'山から迷い込んだ大型の獣が市場に現れた。誘導できるか？', attr:'lk', lv:1,
     ok:'運よく獣が大人しくなり、山に帰した。', ok_fn:()=>{ gainAPAll(8); },
     ng:'獣に引っ掻かれた。市場も大混乱になった。', ng_fn:()=>{ const d=3+Math.floor(Math.random()*3); PC.con=Math.max(0,PC.con-d); return d; } },
  ]},
 frostpeak: { icon:'', name:'フロストピーク',
  jobs:['城壁の雪かき','薪の調達と運搬','見張り塔の補助','凍った水路の解氷作業','防寒具の修繕補助','食料倉庫の管理'],
  incidents:[
   { txt:'雪崩の予兆を発見した。住民を素早く避難させられるか？', attr:'spd', lv:2,
     ok:'走り回って全員を避難させた。集落長に称賛された。', ok_fn:()=>{ gainAPAll(15); gainGPAll(3); },
     ng:'雪崩に巻き込まれた。雪の中から這い出るのに必死だった。', ng_fn:()=>{ const d=4+Math.floor(Math.random()*4); PC.con=Math.max(0,PC.con-d); return d; } },
   { txt:'凍った足場で滑った。転倒を免れるか？', attr:'dex', lv:1,
     ok:'咄嗟にバランスを取り、転倒を回避した。', ok_fn:()=>{ gainAPAll(6); },
     ng:'滑落して荷物ごと転倒した。体が痛い。', ng_fn:()=>{ const d=2+Math.floor(Math.random()*3); PC.con=Math.max(0,PC.con-d); return d; } },
   { txt:'吹雪で迷子になった子供を探している。見つけ出せるか？', attr:'lk', lv:2,
     ok:'奇跡的に見つけた。家族が涙を流して礼を言った。', ok_fn:()=>{ gainAPAll(15); gainGPAll(3); },
     ng:'見つからず、自分も体を冷やしてしまった。', ng_fn:()=>{ const d=3+Math.floor(Math.random()*3); PC.con=Math.max(0,PC.con-d); return d; } },
   { txt:'武器庫の錠前が凍り付いた。強引に壊せるか？', attr:'st', lv:1,
     ok:'力任せに叩き、錠を割った。', ok_fn:()=>{ gainAPAll(6); },
     ng:'手が凍えて力が入らず、ひどく時間がかかった。', ng_fn:()=>{ const d=1+Math.floor(Math.random()*2); PC.con=Math.max(0,PC.con-d); return d; } },
  ]},
 ashveil: { icon:'', name:'アッシュヴェイル',
  jobs:['火山灰の片付け','鍛冶師の補助','採掘場の見張り','硫黄の仕分け作業','村の防火準備','黒曜石の荷運び'],
  incidents:[
   { txt:'小規模な噴火が始まった。素早く退避できるか？', attr:'spd', lv:2,
     ok:'誰よりも早く逃げ、周囲を誘導した。村長に礼を言われた。', ok_fn:()=>{ gainAPAll(12); gainGPAll(2); },
     ng:'溶岩の飛沫を受けた。熱い！', ng_fn:()=>{ const d=4+Math.floor(Math.random()*4); PC.con=Math.max(0,PC.con-d); return d; } },
   { txt:'火山ガスが突然濃くなった。息を止めて脱出できるか？', attr:'con', lv:2,
     ok:'息を止め、全速で脱出した。肺が限界だったが助かった。', ok_fn:()=>{ gainAPAll(10); },
     ng:'ガスを吸い込んでしまった。しばらく咳が止まらない。', ng_fn:()=>{ const d=3+Math.floor(Math.random()*4); PC.con=Math.max(0,PC.con-d); return d; } },
   { txt:'溶岩が流れ込んできた。荷物を急いで移せるか？', attr:'dex', lv:2,
     ok:'素早く荷物を移し、全て守った。鍛冶師に感謝された。', ok_fn:()=>{ gainAPAll(10); gainGPAll(2); },
     ng:'熱に怯んで動作が遅れ、荷物の一部が溶けた。弁償させられた。', ng_fn:()=>{ const d=3; PC.gold=Math.max(0,PC.gold-d*100); return d; } },
   { txt:'灰に埋もれた道具を掘り出さなければならない。体力が持つか？', attr:'st', lv:1,
     ok:'根性で掘り切った。職人に「力持ちだ」と言われた。', ok_fn:()=>{ gainAPAll(8); },
     ng:'途中でへたり込んでしまった。残業させられた。', ng_fn:()=>{ const d=2+Math.floor(Math.random()*2); PC.con=Math.max(0,PC.con-d); return d; } },
  ]},
neria: { icon:'', name:'ネリア砦',
  jobs:['港の荷揚げ作業','珊瑚の仕分け作業','倉庫番','商人の通訳補助','船の甲板磨き','市場の荷物運び'],
  incidents:[
   { txt:'荷揚げ中に大波が来て荷が海に落ちかけた！綱を掴んで引き上げられるか？', attr:'st', lv:2,
     ok:'踏ん張って引き上げた。船長がボーナスをくれた。', ok_fn:()=>{ gainGPAll(2); },
     ng:'荷を海に落としてしまった。船長に怒鳴られた。', ng_fn:()=>{ const d=2+Math.floor(Math.random()*2); PC.con=Math.max(0,PC.con-d); return d; } },
   { txt:'言葉が通じない大陸の商人と島民の間でトラブルが起きた。仲介できるか？', attr:'chr', lv:1,
     ok:'うまく仲介し両者が握手した。商人から礼を受けた。', ok_fn:()=>{ gainAPAll(10); },
     ng:'言い争いに巻き込まれ、怒鳴り合いの中心になってしまった。', ng_fn:()=>{ const d=1; PC.con=Math.max(0,PC.con-d); return d; } },
   { txt:'珊瑚の仕分け中、明らかに古代遺物らしき品が紛れていた。どうする？', attr:'iq', lv:1,
     ok:'正直に報告した。商人に信頼され、情報料をもらった。', ok_fn:()=>{ gainAPAll(12); gainGPAll(1); },
     ng:'ポケットに入れようとしたが見つかった。報酬を没収された。', ng_fn:()=>{ PC.gold=Math.max(0,PC.gold-300); return 0; } },
  ]},
 dorua: { icon:'', name:'ドルアの村',
  jobs:['漁船の網修繕','農作業の手伝い','干し魚の加工','村の荷物運び','畑の水やり','収穫物の選別'],
  incidents:[
   { txt:'突然の嵐で漁船が戻れなくなった。助けを呼びに走れるか？', attr:'spd', lv:1,
     ok:'素早く漁師仲間を呼び集め、無事に帰港させた。村人に感謝された。', ok_fn:()=>{ gainAPAll(10); },
     ng:'転んで遅れてしまった。幸い船は自力で戻ったが、足を痛めた。', ng_fn:()=>{ const d=2+Math.floor(Math.random()*3); PC.con=Math.max(0,PC.con-d); return d; } },
   { txt:'農作業中、土の中から彫刻された石片が出てきた。島民は顔色を変えている。', attr:'iq', lv:1,
     ok:'丁重に扱い村長に届けた。信頼を得た。', ok_fn:()=>{ gainAPAll(15); },
     ng:'興味本位で持ち帰ろうとしたら、村人に厳しく咎められた。', ng_fn:()=>{ const d=1; PC.con=Math.max(0,PC.con-d); return d; } },
  ]},
 sarpe: { icon:'', name:'サルペ',
  jobs:['漁の手伝い','網の繕い','魚の塩漬け作業','浜辺の清掃','小舟の修理','干し場の管理'],
  incidents:[
   { txt:'海が荒れ、漁師が岩場に取り残された！泳いで助けに行けるか？', attr:'con', lv:2,
     ok:'荒波を乗り越えて救出した。村中で英雄扱いされた。', ok_fn:()=>{ gainGPAll(2); gainAPAll(15); },
     ng:'波に飲まれ、自分も溺れかけた。漁師は別の者に救われた。', ng_fn:()=>{ const d=4+Math.floor(Math.random()*4); PC.con=Math.max(0,PC.con-d); return d; } },
   { txt:'石碑の近くで作業中、霧が急に濃くなり方向感覚を失った。', attr:'lk', lv:1,
     ok:'勘を頼りに歩いていると霧が晴れた。不思議な体験だった。', ok_fn:()=>{ gainAPAll(8); },
     ng:'しばらく迷い、体力を消耗した。', ng_fn:()=>{ const d=2+Math.floor(Math.random()*2); PC.con=Math.max(0,PC.con-d); return d; } },
  ]},
 nebra: { icon:'', name:'ネブラ',
  jobs:['灯台の油運び','霧の中の見張り番','薬草の採取','小屋の修繕','食料の仕分け','漁の手伝い'],
  incidents:[
   { txt:'霧の中で見知らぬ影が動くのを見た。近づいて確かめるか？', attr:'lk', lv:2,
     ok:'近づくと迷い込んだ羊だった。村人に返したら礼をもらった。', ok_fn:()=>{ gainGPAll(1); gainAPAll(10); },
     ng:'影を追って迷子になった。なんとか村に戻ったが疲弊した。', ng_fn:()=>{ const d=3+Math.floor(Math.random()*3); PC.con=Math.max(0,PC.con-d); return d; } },
   { txt:'灯台の炎が突然青白く変わった。村人は「灯台の精の気まぐれだ」と言う。', attr:'iq', lv:1,
     ok:'冷静に観察し、油の質が変わっただけだと気づいた。村人に伝えた。', ok_fn:()=>{ gainAPAll(12); },
     ng:'驚いて油壺を落とした。補充が大変だった。', ng_fn:()=>{ const d=1; PC.con=Math.max(0,PC.con-d); return d; } },
  ]},
};

const PARTTIME_RETURN_NODE = {
 khazan:'TOWN_KHAZAN', port_argon:'TOWN_PORT_ARGON', stonehiem:'TOWN_STONEHIEM',
 elsia:'TOWN_ELSIA', verda:'TOWN_VERDA', rimholm:'TOWN_RIMHOLM', marakai:'TOWN_MARAKAI',
 al_rashid:'TOWN_AL_RASHID', oasis_fort:'TOWN_OASIS_FORT', saroon:'TOWN_SAROON', duna:'TOWN_DUNA',
 yeldun:'TOWN_YELDUN', frostpeak:'TOWN_FROSTPEAK', ashveil:'TOWN_ASHVEIL',
   valdheim:'TOWN_VALDHEIM', nifurvik:'TOWN_NIFURVIK', iskald:'TOWN_ISKALD',
 neria:'TOWN_NERIA', dorua:'TOWN_DORUA', sarpe:'TOWN_SARPE', nebra:'TOWN_NEBRA',
};

function doPartTimeJob(townId){ changeAlignment(0, 2); // アルバイト：秩序+2
 const data = PARTTIME_JOBS[townId];
 if(!data){ return; }
 const job = data.jobs[Math.floor(Math.random()*data.jobs.length)];
 const storyEl = document.getElementById('story');
 const retNode = PARTTIME_RETURN_NODE[townId] || 'TOWN_KHAZAN';
 const attrNames = {st:'強さ',iq:'知力',lk:'運',con:'体力',dex:'器用さ',chr:'魅力',spd:'素早さ'};

 // 7日経過（食料消費なし：事前保存して戻す）
 const prevFood = PC._food || 0;
 advanceDays(7);
 PC._food = prevFood;

 // 報酬付与
 gainGPAll(3);
 updateHUD();

 const baseHtml = `<span class="dim" style="font-size:calc(var(--font-sm) - 1px)">── アルバイト（1週間）──</span><br><br>
<span style="color:#f0ece0">${data.icon} ${data.name}でのアルバイト</span><br><br>
仕事内容：<span style="color:#ece8e0">${job}</span><br>
食事は雇い主から支給された。<br><br>
<span style="color:#e8e4d8"> 報酬 +3GP　（${dateStr()}）</span>`;

 // 16%で事件発生 → SR
 if(Math.random() < 0.20){
  const inc = data.incidents[Math.floor(Math.random()*data.incidents.length)];
  if(storyEl){
   storyEl.innerHTML = baseHtml +
    `<br><br><span class="red"> 事件発生！</span><br><br>
<span style="color:#f0ece0">${inc.txt}</span><br><br>
<span style="color:#c0b098">▸ ${attrNames[inc.attr]} Lv${inc.lv} 能力値テスト</span>`;
  }
  renderChoices([]);
  setupSavingRoll({
   attr: inc.attr,
   level: inc.lv,
   onSuccess: ()=>{
    inc.ok_fn && inc.ok_fn();
    updateHUD();
    if(storyEl){
     storyEl.innerHTML = baseHtml +
      `<br><br><span class="red"> 事件発生！</span><br><br>
<span style="color:#f0ece0">${inc.txt}</span><br><br>
<span style="color:#e8e4d8"> ${attrNames[inc.attr]} Lv${inc.lv} 能力値テスト成功！</span><br><br>
${inc.ok}`;
    }
    renderChoices([{label:'← 街に戻る', go:retNode}]);
   },
   onFail: ()=>{
    const dmg = inc.ng_fn ? inc.ng_fn() : 0;
    updateHUD();
    const penalty = dmg > 0
     ? (inc.ng.includes('所持金') || inc.ng.includes('弁償') ? `<br><span class="red"> 所持金 -${dmg}GP</span>`
      : inc.ng.includes('器用さ') || inc.ng.includes('指先') || inc.ng.includes('手先') ? `<br><span class="red">体力-${dmg}　器用さ -1（後遺症）</span>`
      : `<br><span class="red">体力-${dmg}（残り${PC.con}）</span>`)
     : '';
    if(storyEl){
     storyEl.innerHTML = baseHtml +
      `<br><br><span class="red"> 事件発生！</span><br><br>
<span style="color:#f0ece0">${inc.txt}</span><br><br>
<span class="red"> ${attrNames[inc.attr]} Lv${inc.lv} 能力値テスト失敗…</span><br><br>
${inc.ng}${penalty}`;
    }
    if(PC.con <= 0){
     renderChoices([{label:'…（力尽きた）', go:'DEAD'}]);
    } else {
     renderChoices([{label:'← 街に戻る', go:retNode}]);
    }
   },
  });
 } else {
  // 何事もなかった
  if(storyEl){
   storyEl.innerHTML = baseHtml +
    `<br><br><span style="color:#c0b098">特に大きなトラブルもなく、1週間を過ごした。</span>`;
  }
  renderChoices([{label:'← 街に戻る', go:retNode}]);
 }
}

// 散策を実行（1日消費、16%でイベント）
function exploreCity(townId, returnNode){
 // カザーヌは専用の街区散策システムへ
 if(townId === 'khazan'){
  exploreCityKhazan(returnNode);
  return;
 }
 // エルマリアは評議会地区散策システムへ
 if(townId === 'elsia'){
  exploreCityElsia(returnNode);
  return;
 }
 // アル・ラシードは街区散策システムへ
 if(townId === 'al_rashid'){
  exploreCityAlRashid(returnNode);
  return;
 }
 GAME_TIME.totalDays++;
 updateTimebar();
 checkAging();
 if(PC._food > 0) PC._food--; else { PC.con = Math.max(0, PC.con - 1); updateHUD(); if(PC.con <= 0){ go('DEAD'); return; } }
 updateHUD();

 if(townId === 'neria' && checkNeriaChaosSiege()) return;

 const events = EXPLORE_EVENTS[townId] || [];
 if(events.length > 0 && Math.random() < 0.32){
 const ev = events[Math.floor(Math.random() * events.length)];
 fireExploreEvent(ev, returnNode);
 } else {
 const noEvMsgs = {
 al_rashid:['砂埃を浴びながら市場を歩いた。特に何もなかった。','隊商の列を眺めていたが、声はかからなかった。','砂漠の夕日が美しかった。それだけだ。','路地のチャイ屋で一杯飲んで戻った。'],
 elsia: ['密林の小道を歩いた。鳥の声が心地よかった。','エルフたちは気にも留めず、ただ風が吹いた。','木漏れ日の中を歩いた。穏やかな時間だった。','精霊の気配を感じたが、何も起きなかった。'],
 };
 const msgs = noEvMsgs[townId] || ['特に何もなかった。'];
 const storyEl = document.getElementById('story');
 if(storyEl){
 storyEl.innerHTML = `<span class="dim" style="font-size:calc(var(--font-sm) - 1px)">── 街を散策した ──</span><br><br>
 <span style="color:#c0b098">${msgs[Math.floor(Math.random()*msgs.length)]}</span><br><br>
 `;
 }
 renderChoices([{label:'← 街に戻る', go:returnNode}]);
 }
}

// ══════════════════════════════════════════
// カザーヌ 街区散策システム
// ══════════════════════════════════════════

// ══════════════════════════════════════════
// アル・ラシード 街区散策システム
// ══════════════════════════════════════════

function exploreCityAlRashid(returnNode){
 const today = GAME_TIME.totalDays;
 if(PC._alRashidExploreDay == null || PC._alRashidExploreDay !== today){
  PC._alRashidExploreCount = 0;
 }
 const story = document.getElementById('story');
 story.innerHTML = `<span style="color:#d0c8b8"> アル・ラシード 隊商広場</span><br><br>`
  +`<span style="color:#c0b098">砂埃が舞う広場。隊商の駱駝が並び、各地の商人が声を上げている。</span><br><br>`
  +`<span style="color:#c0b098">本日の散策回数：${PC._alRashidExploreCount||0} / 6回</span>`;
 renderChoices([
  {label:' 隊商広場を散策する', fn:()=>alRashidGoDistrict('caravanSq', returnNode)},
  {label:' バザール地区を散策する', fn:()=>alRashidGoDistrict('bazaar', returnNode)},
  ...troupeFlyerChoices('al_rashid', ()=>exploreCityAlRashid(returnNode)), // 旅芸人の一座のチラシ
  {label:'← 街に戻る', go: returnNode},
 ]);
}

function alRashidGoDistrict(district, returnNode){
 const story = document.getElementById('story');
 const names = { caravanSq:' 隊商広場', bazaar:' バザール地区' };
 const descs = {
  caravanSq:'大商人や隊商長が集まる広場。砂金・香辛料・情報が飛び交う。',
  bazaar:'色鮮やかな露店が立ち並ぶ賑やかな市場。スリにも注意が必要だ。',
 };
 story.innerHTML = `<span style="color:#d0c8b8">${names[district]||district}</span><br><br>`
  +`<span style="color:#c0b098">${descs[district]||''}</span><br><br>`
  +`<span style="color:#c0b098">本日の散策回数：${PC._alRashidExploreCount||0} / 6回</span>`;
 renderChoices([
  {label:' 散策する', fn:()=>alRashidExploreDistrict(district, returnNode)},
  {label:'← 広場に戻る', fn:()=>exploreCityAlRashid(returnNode)},
 ]);
}

function alRashidExploreDistrict(district, returnNode){
 if(PC._alRashidExploreCount == null) PC._alRashidExploreCount = 0;

 if(PC._alRashidExploreCount === 0){
  GAME_TIME.totalDays++;
  PC._alRashidExploreDay = GAME_TIME.totalDays;
  updateTimebar(); checkAging();
  if(PC._food > 0) PC._food--; else { PC.con = Math.max(0, PC.con - 1); updateHUD(); if(PC.con <= 0){ go('DEAD'); return; } }
  updateHUD();
 }

 PC._alRashidExploreCount = (PC._alRashidExploreCount||0) + 1;

 if(PC._alRashidExploreCount > 6){
  const story = document.getElementById('story');
  story.innerHTML = `<span style="color:#d0c8b8"> アル・ラシード</span><br><br>`
   +`<span style="color:#c0b098">砂漠の日が沈んだ。今日はもう宿に戻る時間だ。</span>`;
  renderChoices([{label:' 宿に戻る', go: returnNode}]);
  return;
 }

 const evKey = district === 'caravanSq' ? 'al_rashid_caravanSq' : 'al_rashid_bazaar';
 const evTable = EXPLORE_EVENTS[evKey] || [];
 const districtLabel = district === 'caravanSq' ? ' 隊商広場' : ' バザール地区';
 const districtColor = 'var(--copper)';

 // イベント発生（16%）
 if(evTable.length && Math.random() < 0.16){
  const ev = evTable[Math.floor(Math.random()*evTable.length)];

  // カスタムイベント（戦闘・選択肢型）
  if(ev._combat || ev._custom){
   ev.fn(returnNode);
   return;
  }

  // SR型イベント
  const storyEl = document.getElementById('story');
  storyEl.innerHTML = `<span style="color:${districtColor}">${districtLabel}を散策した</span><br><br>`
   +`<span style="color:#f0ece0">${ev.title}</span><br><br>`
   +`${ev.intro}<br><br>`
   +`<span style="color:#c0b098">散策回数：${PC._alRashidExploreCount} / 6回</span>`;
  const attrNames = {st:'強さ',iq:'知力',lk:'運',con:'体力',dex:'器用さ',chr:'魅力',spd:'素早さ'};
  setupSavingRoll({
   attr: ev.sr.attr, level: ev.sr.level,
   onSuccess:()=>{
    const result = ev.onSuccess();
    storyEl.innerHTML = `<span style="color:${districtColor}">${districtLabel}を散策した</span><br><br>`
     +`<span style="color:#f0ece0">${ev.title}</span><br><br>`
     +`${ev.intro}<br><br>`
     +`<span style="color:#e8e4d8"> ${attrNames[ev.sr.attr]} Lv${ev.sr.level} 能力値テスト成功！</span><br><br>`
     +`${result}`;
    renderChoices([
     {label:' 続けて散策する', fn:()=>alRashidGoDistrict(district, returnNode)},
     {label:'← 街に戻る', go: returnNode},
    ]);
   },
   onFail:()=>{
    const result = ev.onFail();
    storyEl.innerHTML = `<span style="color:${districtColor}">${districtLabel}を散策した</span><br><br>`
     +`<span style="color:#f0ece0">${ev.title}</span><br><br>`
     +`${ev.intro}<br><br>`
     +`<span class="red"> ${attrNames[ev.sr.attr]} Lv${ev.sr.level} 能力値テスト失敗…</span><br><br>`
     +`${result}`;
    renderChoices([
     {label:' 続けて散策する', fn:()=>alRashidGoDistrict(district, returnNode)},
     {label:'← 街に戻る', go: returnNode},
    ]);
   },
  });
  return;
 }

 // 無イベント
 const noEvMsgs = {
  caravanSq:[
   '砂埃を浴びながら隊商広場を歩いた。駱駝の鈴の音が響いている。',
   '隊商長たちが熱心に交渉している脇を通り過ぎた。声はかからなかった。',
   '砂漠の夕日が広場を橙色に染めていた。それだけだ。',
   '広場のチャイ屋で一杯飲んで戻った。砂漠の風が心地よかった。',
  ],
  bazaar:[
   '色鮮やかな露店を眺めながらバザールを歩いた。特に何もなかった。',
   '香辛料の香りが漂う一角を通り過ぎた。呼び込みの声が飛び交っている。',
   '人混みをかき分けながら歩いた。財布に手を添えながら進んだ。',
   '織物や装飾品を眺めながら歩いた。珍しいものが多いが、今日は縁がなかった。',
  ],
 };
 const msgs = noEvMsgs[district] || ['特に何も起きなかった。'];
 const story = document.getElementById('story');
 story.innerHTML = `<span style="color:${districtColor}">${districtLabel}を散策した</span><br><br>`
  +`<span style="color:#c0b098">${msgs[Math.floor(Math.random()*msgs.length)]}</span><br><br>`
  +`<span style="color:#c0b098">散策回数：${PC._alRashidExploreCount} / 6回</span>`;
 renderChoices([
  {label:' 続けて散策する', fn:()=>alRashidGoDistrict(district, returnNode)},
  {label:'← 街に戻る', go: returnNode},
 ]);
}

// ══════════════════════════════════════════
// エルマリア 評議会地区散策システム
// ══════════════════════════════════════════

function exploreCityElsia(returnNode){
 const today = GAME_TIME.totalDays;
 if(PC._elsiaExploreDay == null || PC._elsiaExploreDay !== today){
  PC._elsiaExploreCount = 0;
 }

 const story = document.getElementById('story');
 story.innerHTML = `<span style="color:#e8e4d8"> エルマリア 評議会広場</span><br><br>`
  +`<span style="color:#c0b098">古代の石柱が立ち並ぶ広場。エルフたちが静かに行き交う。木漏れ日が石畳に模様を作っている。</span><br><br>`
  +`<span style="color:#c0b098">本日の散策回数：${PC._elsiaExploreCount||0} / 6回</span>`;

 renderChoices([
  {label:' 評議会地区を散策する', fn:()=>elsiaGoDistrict('council', returnNode)},
  ...troupeFlyerChoices('elsia', ()=>exploreCityElsia(returnNode)), // 旅芸人の一座のチラシ
  {label:'← 街に戻る', go: returnNode},
 ]);
}

function elsiaGoDistrict(district, returnNode){
 const story = document.getElementById('story');
 story.innerHTML = `<span style="color:#e8e4d8"> 評議会地区</span><br><br>`
  +`<span style="color:#c0b098">評議会の塔を中心に広がる厳かな地区。遺跡の石柱が蔦に覆われ、長老たちの気配が漂う。</span><br><br>`
  +`<span style="color:#c0b098">本日の散策回数：${PC._elsiaExploreCount||0} / 6回</span>`;
 renderChoices([
  {label:' 散策する', fn:()=>elsiaExploreDistrict(district, returnNode)},
  {label:'← 広場に戻る', fn:()=>exploreCityElsia(returnNode)},
 ]);
}

function elsiaExploreDistrict(district, returnNode){
 if(PC._elsiaExploreCount == null) PC._elsiaExploreCount = 0;

 if(PC._elsiaExploreCount === 0){
  GAME_TIME.totalDays++;
  PC._elsiaExploreDay = GAME_TIME.totalDays;
  updateTimebar(); checkAging();
  if(PC._food > 0) PC._food--; else { PC.con = Math.max(0, PC.con - 1); updateHUD(); if(PC.con <= 0){ go('DEAD'); return; } }
  updateHUD();
 }

 PC._elsiaExploreCount = (PC._elsiaExploreCount||0) + 1;

 if(PC._elsiaExploreCount > 6){
  const story = document.getElementById('story');
  story.innerHTML = `<span style="color:#e8e4d8"> エルマリア</span><br><br>`
   +`<span style="color:#c0b098">日が暮れた。今日はもう宿に戻る時間だ。</span>`;
  renderChoices([{label:' 宿に戻る', go: returnNode}]);
  return;
 }

 // イベント発生（10%）
 if(Math.random() < 0.10){
  const evTable = EXPLORE_EVENTS['elsia'] || [];
  if(evTable.length){
   const ev = evTable[Math.floor(Math.random()*evTable.length)];
   const storyEl = document.getElementById('story');
   storyEl.innerHTML = `<span style="color:#e8e4d8"> 評議会地区を散策した</span><br><br>`
    +`<span style="color:#f0ece0">${ev.title}</span><br><br>`
    +`${ev.intro}<br><br>`
    +`<span style="color:#c0b098">散策回数：${PC._elsiaExploreCount} / 6回</span>`;
   const attrNames = {st:'強さ',iq:'知力',lk:'運',con:'体力',dex:'器用さ',chr:'魅力',spd:'素早さ'};
   setupSavingRoll({
    attr: ev.sr.attr, level: ev.sr.level,
    onSuccess:()=>{
     const result = ev.onSuccess();
     storyEl.innerHTML = `<span style="color:#e8e4d8"> 評議会地区を散策した</span><br><br>`
      +`<span style="color:#f0ece0">${ev.title}</span><br><br>`
      +`${ev.intro}<br><br>`
      +`<span style="color:#e8e4d8"> ${attrNames[ev.sr.attr]} Lv${ev.sr.level} 能力値テスト成功！</span><br><br>`
      +`${result}`;
     renderChoices([
      {label:' 続けて散策する', fn:()=>elsiaGoDistrict(district, returnNode)},
      {label:'← 街に戻る', go: returnNode},
     ]);
    },
    onFail:()=>{
     const result = ev.onFail();
     storyEl.innerHTML = `<span style="color:#e8e4d8"> 評議会地区を散策した</span><br><br>`
      +`<span style="color:#f0ece0">${ev.title}</span><br><br>`
      +`${ev.intro}<br><br>`
      +`<span class="red"> ${attrNames[ev.sr.attr]} Lv${ev.sr.level} 能力値テスト失敗…</span><br><br>`
      +`${result}`;
     renderChoices([
      {label:' 続けて散策する', fn:()=>elsiaGoDistrict(district, returnNode)},
      {label:'← 街に戻る', go: returnNode},
     ]);
    },
   });
   return;
  }
 }

 // 無イベント
 const noEvMsgs = [
  '古代の石柱の間を歩いた。風が葉を揺らし、遠くでエルフの歌声が聞こえた。',
  '評議会の塔の影を歩いた。衛兵に目を向けられたが、何も言われなかった。',
  '蔦に覆われた回廊を通り抜けた。精霊の気配を感じたが、何も起きなかった。',
  '遺跡の石畳を歩いた。エルフたちが静かにこちらを見ていた。',
 ];
 const story = document.getElementById('story');
 story.innerHTML = `<span style="color:#e8e4d8"> 評議会地区を散策した</span><br><br>`
  +`<span style="color:#c0b098">${noEvMsgs[Math.floor(Math.random()*noEvMsgs.length)]}</span><br><br>`
  +`<span style="color:#c0b098">散策回数：${PC._elsiaExploreCount} / 6回</span>`;
 renderChoices([
  {label:' 続けて散策する', fn:()=>elsiaGoDistrict(district, returnNode)},
  {label:'← 街に戻る', go: returnNode},
 ]);
}

function exploreCityKhazan(returnNode){
 // 散策回数リセット：前回の散策日付と現在の日付が異なる場合のみリセット
 // （_khazanExploreDayは散策開始後に更新されるため、開始前の日付と比較）
 const today = GAME_TIME.totalDays;
 if(PC._khazanExploreDay == null || PC._khazanExploreDay !== today){
  PC._khazanExploreCount = 0;
  // dayは散策開始時に設定するのでここでは更新しない
 }

 const story = document.getElementById('story');
 story.innerHTML = `<span style="color:#f0ece0"> カザーヌ中央広場</span><br><br>`
  +`<span style="color:#c0b098">王都の中心に広がる広場。四方に伸びる大通りが各街区へと繋がっている。</span><br><br>`
  +`<span style="color:#c0b098">本日の散策回数：${PC._khazanExploreCount||0} / 6回</span>`;

 renderChoices([
  {label:' 王宮地区へ', fn:()=>khazanGoDistrict('royal', returnNode)},
  {label:' 市場地区へ', fn:()=>khazanGoDistrict('market', returnNode)},
  {label:' 貧民地区へ', fn:()=>khazanGoDistrict('slum', returnNode)},
  ...troupeFlyerChoices('khazan', ()=>exploreCityKhazan(returnNode)), // 旅芸人の一座のチラシ
  {label:'← 街に戻る', go: returnNode},
 ]);
}

function khazanGoDistrict(district, returnNode){
 const story = document.getElementById('story');

 const districtNames = { royal:' 王宮地区', market:' 市場地区', slum:' 貧民地区' };
 const dname = districtNames[district]||district;

 const districtDesc = {
  royal:'王宮を中心に整然と区画された地区。衛兵の目が光っている。',
  market:'商人たちの活気が溢れる賑やかな地区。様々な出会いがある。',
  slum:'薄暗い路地が続く貧しい地区。',
 };
 story.innerHTML = `<span style="color:#f0ece0">${dname}</span><br><br>`
  +`<span style="color:#c0b098">${districtDesc[district]||''}</span><br><br>`
  +`<span style="color:#c0b098">本日の散策回数：${PC._khazanExploreCount||0} / 6回</span>`;

 renderChoices([
  {label:' 散策する', fn:()=>khazanExploreDistrict(district, returnNode)},
  {label:'← 中央広場に戻る', fn:()=>exploreCityKhazan(returnNode)},
 ]);
}

function khazanExploreDistrict(district, returnNode){
 // カウントが未初期化なら初期化（日付ベースではなくセッション管理に変更）
 if(PC._khazanExploreCount == null) PC._khazanExploreCount = 0;

 // 最初の散策時のみ1日経過・食料消費
 if(PC._khazanExploreCount === 0){
  GAME_TIME.totalDays++;
  // 日付進行後にdayキーを更新
  PC._khazanExploreDay = GAME_TIME.totalDays;
  updateTimebar();
  checkAging();
  if(PC._food > 0) PC._food--; else { PC.con = Math.max(0, PC.con - 1); updateHUD(); if(PC.con <= 0){ go('DEAD'); return; } }
  updateHUD();
 }

 PC._khazanExploreCount = (PC._khazanExploreCount||0) + 1;

 // 6回超えたら宿に戻される
 if(PC._khazanExploreCount > 6){
  const story = document.getElementById('story');
  story.innerHTML = `<span style="color:#f0ece0"> カザーヌ</span><br><br>`
   +`<span style="color:#c0b098">日が暮れた。今日はもう宿に戻る時間だ。</span>`;
  renderChoices([{label:' 宿に戻る', go: returnNode}]);
  return;
 }

 // イベント発生（16%）
 if(Math.random() < 0.16){
  khazanFireDistrictEvent(district, returnNode);
 } else {
  const noEvMsgs = {
   royal:[
    '衛兵の行列を眺めながら、石畳の上をゆっくり歩いた。',
    '壮麗な王宮の外壁に沿って歩いた。近衛兵が無言で目で追ってくる。',
    '広場の噴水のそばで休んだ。貴族らしき人々が通り過ぎていった。',
    '王宮の正門前を通った。衛兵に一瞥されたが、特に何も言われなかった。',
   ],
   market:[
    '活気ある市場を歩いた。様々な品物が並び、呼び込みの声が飛び交っている。',
    '香辛料の香りが漂う一角を通り過ぎた。異国の商人たちが交渉を続けている。',
    '武器屋の前で立ち止まったが、特に変わったものはなかった。',
    '露店をのぞきながら歩いた。人混みで足元に気をつけながら進んだ。',
   ],
  };
  const slumNoEvMsgs = [
   '薄暗い路地を歩いた。壁には落書きが並び、どこからか子どもの笑い声が聞こえる。',
   '廃屋の前を通り過ぎた。洗濯物が窓から垂れ下がり、老人が路地にしゃがんでいた。',
   '狭い路地を抜けると小さな広場に出た。人々が焚き火を囲んで黙って座っている。',
   '鼻をつく臭いの路地を歩いた。こちらを見る目はあるが、誰も声をかけてこない。',
  ];
  if(!noEvMsgs.slum) noEvMsgs.slum = slumNoEvMsgs;
  const msgs = (noEvMsgs[district])||['特に何も起きなかった。'];
  const story = document.getElementById('story');
  const districtTitles = { royal:' 王宮地区を散策した', market:' 市場地区を散策した', slum:' 貧民地区を散策した' };
  story.innerHTML = `<span style="color:#f0ece0">${districtTitles[district]||'散策した'}</span><br><br>`
   +`<span style="color:#c0b098">${msgs[Math.floor(Math.random()*msgs.length)]}</span><br><br>`
   +`<span style="color:#c0b098">散策回数：${PC._khazanExploreCount} / 6回</span>`;
  renderChoices([
   {label:' 続けて散策する', fn:()=>khazanGoDistrict(district, returnNode)},
   {label:'← 中央広場に戻る', fn:()=>exploreCityKhazan(returnNode)},
   {label:'← 街に戻る', go: returnNode},
  ]);
 }
}

function khazanFireDistrictEvent(district, returnNode){
 const evTable = KHAZAN_DISTRICT_EVENTS[district]||[];
 if(!evTable.length){ khazanGoDistrict(district, returnNode); return; }
 const ev = evTable[Math.floor(Math.random()*evTable.length)];
 ev.fn(returnNode);
}

// 購入価格（地元）：baseCost ± 10% のランダム
function calcSpecialtyBuyPrice(item){
 const variance = Math.round(item.baseCost * 0.1);
 return item.baseCost + Math.floor(Math.random()*(variance*2+1)) - variance;
}

// 売値：地方間距離nで 同地方=1.0倍、距離1=1.25倍、距離2以上=1.5倍 ± 15%
function calcSpecialtySellPrice(item, sellTownId){
 const fromKey = item.regionKey;
 const toKey = getRegionKey(sellTownId);
 const n = (fromKey && toKey) ? getRegionDistance(fromKey, toKey) : 1;
 const mult = n === 0 ? 1.0 : n === 1 ? 1.25 : 1.5;
 const base = Math.round(item.baseCost * mult);
 const variance = Math.round(base * 0.15);
 return base + Math.floor(Math.random()*(variance*2+1)) - variance;
}

// 町IDからその地方のメンバーリストを返す
function getRegionTowns(townId){
 for(const members of Object.values(REGIONS)){
 if(members.includes(townId)) return members;
 }
 return Object.keys(TOWNS); // 未分類は全町
}

// 最短徒歩日数をBFSで計算（直接ルートがない場合も対応）
function calcMinWalkDays(fromId, toId){
 if(fromId === toId) return 0;
 const visited = new Set([fromId]);
 const queue = [{id:fromId, days:0}];
 while(queue.length){
 const {id, days} = queue.shift();
 const neighbors = Object.keys(TOWNS).filter(t=>{
 const r = getRoute(id, t);
 return r && r.days.walk != null;
 });
 for(const next of neighbors){
 const r = getRoute(id, next);
 const d = days + r.days.walk;
 if(next === toId) return d;
 if(!visited.has(next)){ visited.add(next); queue.push({id:next, days:d}); }
 }
 }
 return null; // 到達不能
}

// 最短移動日数（徒歩＋船）— マレア諸島など船のみルート対応
function calcMinTravelDays(fromId, toId){
 if(fromId === toId) return 0;
 const visited = new Set([fromId]);
 const queue = [{id:fromId, days:0}];
 while(queue.length){
  const {id, days} = queue.shift();
  const neighbors = Object.keys(TOWNS).filter(t=>{
   const r = getRoute(id, t);
   return r && (r.days.walk != null || r.days.ship != null);
  });
  for(const next of neighbors){
   const r = getRoute(id, next);
   const d = days + (r.days.walk ?? r.days.ship ?? 999);
   if(next === toId) return d;
   if(!visited.has(next)){ visited.add(next); queue.push({id:next, days:d}); }
  }
 }
 return null;
}

// 報酬計算（距離・届け先で変動）
