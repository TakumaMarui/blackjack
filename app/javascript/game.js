/***********************************************
  グローバル変数
************************************************/

// カードの山（配列）
let cards = [];
// 自分のカード（配列）
let myCards = [];
// 相手のカード（配列）
let comCards = [];
// 勝敗決定フラグ（論理型）
let isGameOver = false;

/***********************************************
  イベントハンドラの割り当て
************************************************/

// ページの読み込みが完了したとき実行する関数を登録
window.addEventListener("load", loadHandler);
document.addEventListener('DOMContentLoaded', function(){

  // 「カードを引く」ボタンを押したとき実行する関数を登録
  document.querySelector("#pick").addEventListener("click", clickPickHandler);

  // 「勝負する！」ボタンを押したとき実行する関数を登録
  document.querySelector("#judge").addEventListener("click", clickJudgeHandler);

  // 「もう1回遊ぶ」ボタンを押したとき実行する関数を登録
  document.querySelector("#reset").addEventListener("click", clickResetHandler);
});
/***********************************************
  イベントハンドラ
************************************************/

// ページの読み込みが完了したとき実行する関数
function loadHandler() {
  // シャッフル
  shuffle();
  // 自分がカードを引く
  pickMyCard();
  // 相手がカードを引く
  pickComCard();
  // 画面を更新する
  updateView();
  // デバッグ
  // debug();
}

// 「カードを引く」ボタンを押したとき実行する関数
function clickPickHandler() {
  // 勝敗が未決定の場合
  if (isGameOver == false) {
    // 自分がカードを引く
    pickMyCard();
    // 相手がカードを引く
    pickComCard();
    // 画面を更新する
    updateView();
    // 自分の合計が21を越えた場合、勝敗判定に移る
    if (getTotal(myCards) > 21) {
      clickJudgeHandler();
    }
  }
}

// 「勝負する！」ボタンを押したとき実行する関数
function clickJudgeHandler() {
  let result = "";
  // 勝敗が未決定の場合
  if (isGameOver == false) {
    // 画面を更新する（相手のカードを表示する）
    updateView(true);
    // 勝敗を判定する
    result = judge();
    // 1秒後に勝敗を画面に表示する
    setTimeout(showResult, 1000, result);
    // 勝敗決定フラグを「決定」に変更
    isGameOver = true;
  }
}

// 「もう1回遊ぶ」ボタンを押したとき実行する関数
function clickResetHandler() {
  // 画面を初期表示に戻す
  // reloadメソッドでページを再読み込みする
  location.reload();
}

/***********************************************
  ゲーム関数
************************************************/

// カードの山をシャッフルする関数
function shuffle() {
  // カードの初期化
  for (let i = 1; i <= 52; i++) {
    cards.push(i);
  }
  // 100回繰り返す
  for (let i = 0; i < 100; i++) {
    // カードの山からランダムに選んだ2枚を入れ替える
    let j = Math.floor(Math.random() * 52);
    let k = Math.floor(Math.random() * 52);
    let temp = cards[j];
    cards[j] = cards[k];
    cards[k] = temp;
  }
}

// 自分がカードを引く関数
function pickMyCard() {
  // 自分のカードの枚数が4枚以下の場合
  if ( myCards.length <= 4 ) {
    // カードの山（配列）から1枚取り出す
    let card = cards.pop();
    // 取り出した1枚を相手のカード（配列）に追加する
    myCards.push(card);
  }
}

// 相手がカードを引く関数
function pickComCard() {
  // 相手のカードの枚数が4枚以下の場合
  if ( comCards.length <= 4 ) {
    // カードを引くかどうか考える
    while ( pickAI(comCards) && comCards.length <= 4) {
      // カードの山（配列）から1枚取り出す
      let card = cards.pop();
      // 取り出した1枚を自分のカード（配列）に追加する
      comCards.push(card);
    }
  }
}

// カードを引くかどうか考える関数
function pickAI(handCards) {
  // 現在のカードの合計を求める
  let total = getTotal(handCards);
  // カードを引くかどうか
  let isPick = false;
  // 合計が16以下なら引く
  if (total <= 16) {
    isPick = true;
  }
  // 合計が17以上なら引かない
  else if (total >= 17) {
    isPick = false;
  }
  // 引くか引かないかを戻り値で返す
  return isPick;
}

// カードの合計を計算する関数
function getTotal(handCards) {
  let total = 0;   // 計算した合計を入れる変数
  let number = 0;  // カードの数字を入れる変数
  for (let i = 0; i < handCards.length; i++) {
    // 13で割った余りを求める
    number = handCards[i] % 13;
    // J,Q,K (余りが11,12,0) のカードは10と数える
    if (number == 11 || number == 12 || number == 0) {
      total += 10;
    } else {
      total += number;
    }
  }
  // 「A」のカードを含んでいる場合
  if (handCards.includes(1) || handCards.includes(14) || handCards.includes(27) || handCards.includes(40)) {
    // 「A」を11と数えても合計が21を越えなければ11と数える
    if (total + 10 <= 21) {
      total += 10;
    }
  }
  // 合計を返す
  return total;
}

// 画面を更新する関数
function updateView(showComCards = false) {
  // 自分のカードを表示する
  let myfields = document.querySelectorAll(".myCard");
  for (let i = 0; i < myfields.length; i++) {
    // 自分のカードの枚数がiより大きい場合
    if (i < myCards.length) {
      // 表面の画像を表示する
      myfields[i].setAttribute('src', getCardPath(myCards[i]));
    } else {
      // 裏面の画像を表示する
      myfields[i].setAttribute('src', "assets/blue.png");
    }
  }
  // 相手のカードを表示する
  let comfields = document.querySelectorAll(".comCard");
  for (let i = 0; i < comfields.length; i++) {
    // 相手のカードの枚数がiより大きい場合
    if (i == 0 || (i < comCards.length && showComCards == true)) {
      // 表面の画像を表示する
      comfields[i].setAttribute('src', getCardPath(comCards[i]));
    } else {
      // 裏面の画像を表示する
      comfields[i].setAttribute('src', "assets/red.png");
    }
  }
  // カードの合計を再計算する
  document.querySelector("#myTotal").innerText = getTotal(myCards);
  if (showComCards == true) {
    document.querySelector("#comTotal").innerText = getTotal(comCards);
  }
}

// カードの画像パスを求める関数
function getCardPath(card) {
  // カードのパスを入れる変数
  let path = "";
  // カードの数字が1桁なら先頭に0をつける
  if (card <= 9) {
    path = "assets/0" + card + ".png";
  } else {
    path = "assets/" + card + ".png";
  }
  // カードのパスを返す
  return path;
}

// 勝敗を判定する関数
function judge() {
  // 勝敗を表す変数
  let result = "";
  // 自分のカードの合計を求める
  let myTotal = getTotal(myCards);
  // 相手のカードの合計を求める
  let comTotal = getTotal(comCards);
  // 勝敗のパターン表に当てはめて勝敗を決める
  if (myTotal > 21) {
    // 自分の合計が21を越えていれば負け
    result = "loose"
  }
  else if (myTotal < 21 && comTotal > 21) {
    // 相手の合計が21を越えていれば勝ち
    result = "win"
  }
  else {
    // 自分も相手も21を越えていない場合
    if (myTotal > comTotal) {
      // 自分の合計が相手の合計より大きければ勝ち
      result = "win";
    } else if (myTotal < comTotal) {
      // 自分の合計が相手の合計より小さければ負け
      result = "loose";
    } else {
      // 自分の合計が相手の合計と同じなら引き分け
      result = "draw";
    }
  }
  // 勝敗を呼び出し元に返す
  return result;
}

// 勝敗を画面に表示する関数
function showResult(result) {
  // メッセージを入れる変数
  let message = "";
  // 勝敗に応じてメッセージを決める
  switch (result) {
    case "win":
      message = "あなたの勝ちです！";
      break;
    case "loose":
      message = "あなたの負けです！";
      break;
    case "draw":
      message = "引き分けです！";
      break;
  }
  // メッセージを表示する
  alert(message);
}
/***********************************************
  デバッグ関数
************************************************/

function debug() {
  console.log("カードの山", cards);
  console.log("自分のカード", myCards, "合計" + getTotal(myCards));
  console.log("相手のカード", comCards, "合計" + getTotal(comCards));
  console.log("勝敗決定フラグ", isGameOver);
}
