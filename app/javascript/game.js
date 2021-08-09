// グローバル変数
let cards = [];
let myCards = [];
let comCards = [];
let isGameOver = false;

// イベントハンドラの割り当て
window.addEventListener("load", loadHandler);
document.addEventListener('DOMContentLoaded', function(){
  document.querySelector("#hit").addEventListener("click", clickHitHandler);
  document.querySelector("#stand").addEventListener("click", clickStandHandler);
  document.querySelector("#double").addEventListener("click", clickDoubleHandler);
  document.querySelector("#surrender").addEventListener("click", clickSurrenderHandler);
  document.querySelector("#start").addEventListener("click", clickStartHandler);
});

// イベントハンドラ
// ページの読み込みが完了したとき実行する関数
function loadHandler() {
  const hitButton = document.getElementById("hit");
  const standButton = document.getElementById("stand");
  const doubleButton = document.getElementById("double");
  const surrenderButton = document.getElementById("surrender");
  hitButton.disabled = true;
  standButton.disabled = true;
  doubleButton.disabled = true;
  surrenderButton.disabled = true;
  shuffle();
}

// 「Hit」ボタンを押したとき実行する関数
function clickHitHandler() {
  const startButton = document.getElementById("start");
  const doubleButton = document.getElementById("double");
  const surrenderButton = document.getElementById("surrender");
  if (isGameOver == false) {
    pickMyCard();
    pickComCard();
    updateView();
    if (getTotal(myCards) > 21) {
      clickStandHandler();
      startButton.disabled = false;
    }
  }
  doubleButton.disabled = true;
  surrenderButton.disabled = true;
}

// 「Stand」ボタンを押したとき実行する関数
function clickStandHandler() {
  let result = "";
  const startButton = document.getElementById("start");
  if (isGameOver == false) {
    updateView(true);
    result = judge();
    setTimeout(showResult, 1000, result);
    isGameOver = true;
    startButton.disabled = false;
  }
}

// 「Double」ボタンを押したときに実行する関数
function clickDoubleHandler() {
  let result = "";
  const startButton = document.getElementById("start");
  pickMyCard();
  pickComCard();
  updateView(true);
  result = doubleDown();
  setTimeout(showResult, 1000, result);
  isGameOver = true;
  startButton.disabled = false;
}

// 「Surrender」ボタンを押したときに実行する関数
function clickSurrenderHandler() {
  let myCoinSurrender = $('.current_user_coin').val();
  let betCoinSurrender = document.getElementById("betCoin").value;
  let numMyCoinSurrender = parseInt(myCoinSurrender)
  let numBetCoinSurrender = parseInt(betCoinSurrender)
  let newCoinSurrender = numMyCoinSurrender - numBetCoinSurrender / 2;
  $.ajax({
    url: '/users/update_coin',  
    type: 'GET',
    dataType: 'html',
    async: true,
    data: {
      coin: newCoinSurrender,
    },
  });
  location.reload();
  isGameOver = true;
  location.reload();
  location.reload();
  location.reload();
  location.reload();
}

// 「Start」ボタンを押したとき実行する関数
function clickStartHandler() {
  let result = "";
  const startButton = document.getElementById("start");
  const hitButton = document.getElementById("hit");
  const standButton = document.getElementById("stand");
  const doubleButton = document.getElementById("double");
  const surrenderButton = document.getElementById("surrender");
  let myCoin = $('.current_user_coin').val();
  let betCoin = document.getElementById("betCoin").value;
  let numMyCoin = parseInt(myCoin)
  let numBetCoin = parseInt(betCoin)
  let newCoin = numMyCoin - numBetCoin;
  $.ajax({
    url: '/users/update_coin',  
    type: 'GET',
    dataType: 'html',
    async: true,
    data: {
      coin: newCoin,
    },
  });
  startButton.disabled = true;
  cards = [];
  myCards = [];
  comCards = [];
  isGameOver = false;
  document.querySelector("#comTotal").innerText =[];
  loadHandler();
  pickMyCard();
  pickMyCard();
  pickComCard();
  updateView();
  result = blackjack();
  if (getTotal(myCards) == 21) {
    setTimeout(showResult, 1000, result);
    isGameOver = true;
    startButton.disabled = false;
  }
  hitButton.disabled = false;
  standButton.disabled = false;
  doubleButton.disabled = false;
  surrenderButton.disabled = false;
}

// betCoinに入力できる値の制限
$(function(){
  $('input[type="number"]').focusout(function() {
    if(typeof $(this).attr('min') !== "undefined" && parseInt($(this).val()) < parseInt($(this).attr('min')))
        $(this).val($(this).attr('min'));
    else if(typeof $(this).attr('max') !== "undefined" && parseInt($(this).val()) > parseInt($(this).attr('max')))
        $(this).val($(this).attr('max'));
    else if(typeof $(this).attr('min') !== "undefined" && $(this).val() === '')
        $(this).val($(this).attr('min'));
  });
});

// ゲーム関数
// カードの山をシャッフルする関数
function shuffle() {
  for (let i = 1; i <= 52; i++) {
    cards.push(i);
  }
  for (let i = 0; i < 100; i++) {
    let j = Math.floor(Math.random() * 52);
    let k = Math.floor(Math.random() * 52);
    let temp = cards[j];
    cards[j] = cards[k];
    cards[k] = temp;
  }
}

// 自分がカードを引く関数
function pickMyCard() {
  if ( myCards.length <= 6 ) {
    let card = cards.pop();
    myCards.push(card);
  }
}

// 相手がカードを引く関数
function pickComCard() {
  if ( comCards.length <= 6 ) {
    while ( pickAI(comCards) && comCards.length <= 6) {
      let card = cards.pop();
      comCards.push(card);
    }
  }
}

// 相手がカードを引くかどうか決定する関数
function pickAI(handCards) {
  let total = getTotal(handCards);
  let isPick = false;
  if (total <= 16) {
    isPick = true;
  }
  else if (total >= 17) {
    isPick = false;
  }
  return isPick;
}

// カードの合計を計算する関数
function getTotal(handCards) {
  let total = 0;
  let number = 0;
  for (let i = 0; i < handCards.length; i++) {
    number = handCards[i] % 13;
    if (number == 11 || number == 12 || number == 0) {
      total += 10;
    } else {
      total += number;
    }
  }
  if (handCards.includes(1) || handCards.includes(14) || handCards.includes(27) || handCards.includes(40)) {
    if (total + 10 <= 21) {
      total += 10;
    }
  }
  return total;
}

// 画面を更新する関数
function updateView(showComCards = false) {
  let myfields = document.querySelectorAll(".myCard");
  for (let i = 0; i < myfields.length; i++) {
    if (i < myCards.length) {
      myfields[i].setAttribute('src', getCardPath(myCards[i]));
    } else {
      myfields[i].setAttribute('src', "assets/red.png");
    }
  }
  let comfields = document.querySelectorAll(".comCard");
  for (let i = 0; i < comfields.length; i++) {
    if (i == 0 || (i < comCards.length && showComCards == true)) {
      comfields[i].setAttribute('src', getCardPath(comCards[i]));
    } else {
      comfields[i].setAttribute('src', "assets/red.png");
    }
  }
  document.querySelector("#myTotal").innerText = getTotal(myCards);
  if (showComCards == true) {
    document.querySelector("#comTotal").innerText = getTotal(comCards);
  }
}

// カードの画像パスを求める関数
function getCardPath(card) {
  let path = "";
  if (card <= 9) {
    path = "assets/0" + card + ".png";
  } else {
    path = "assets/" + card + ".png";
  }
  return path;
}

// ブラックジャックかどうか判定する関数
function blackjack() {
  let result = "";
  let myTotal = getTotal(myCards);
  if (myTotal == 21){
    result = "blackjack"
  }
  return result;
}

// 勝敗を判定する関数
function judge() {
  let result = "";
  let myTotal = getTotal(myCards);
  let comTotal = getTotal(comCards);
  if (myTotal > 21) {
    result = "loose"
  }
  else if (myTotal <= 21 && comTotal > 21) {
    result = "win"
  }
  else {
    if (myTotal > comTotal) {
      result = "win";
    } else if (myTotal < comTotal) {
      result = "loose";
    } else {
      result = "draw";
    }
  }
  return result;
}

// DoubleDownしたときに勝敗を判定する関数
function doubleDown() {
  let result = "";
  let myTotal = getTotal(myCards);
  let comTotal = getTotal(comCards);
  if (myTotal > 21) {
    result = "doubleLoose"
  }
  else if (myTotal <= 21 && comTotal > 21) {
    result = "doubleWin"
  }
  else {
    if (myTotal > comTotal) {
      result = "doubleWin";
    } else if (myTotal < comTotal) {
      result = "doubleLoose";
    } else {
      result = "draw";
    }
  }
  return result;
}

// 勝敗を画面に表示する関数
function showResult(result) {
  let message = "";
  switch (result) {
    case "win":
      message = "WIN!";
      let myCoinWin = $('.current_user_coin').val();
      let betCoinWin = document.getElementById("betCoin").value;
      let numMyCoinWin = parseInt(myCoinWin)
      let numBetCoinWin = parseInt(betCoinWin)
      let newCoinWin = numMyCoinWin + numBetCoinWin;
      $.ajax({
        url: '/users/update_coin',  
        type: 'GET',
        dataType: 'html',
        async: true,
        data: {
          coin: newCoinWin,
        },
      });
      location.reload();
      location.reload();
      break;
    case "loose":
      message = "LOOSE!";
      location.reload();
      break;
    case "draw":
      message = "DRAW!";
      let myCoinDraw = $('.current_user_coin').val();
      let newCoinDraw = myCoinDraw;
      $.ajax({
        url: '/users/update_coin',  
        type: 'GET',
        dataType: 'html',
        async: true,
        data: {
          coin: newCoinDraw,
        },
      });
      location.reload();
      location.reload();
      break;
    case "blackjack":
      message = "BLACKJACK!";
      let myCoinBlackjack = $('.current_user_coin').val();
      let betCoinBlackjack = document.getElementById("betCoin").value;
      let numMyCoinBlackjack = parseInt(myCoinBlackjack)
      let numBetCoinBlackjack = parseInt(betCoinBlackjack)
      let newCoinBlackjack = numMyCoinBlackjack + numBetCoinBlackjack * 1.5;
      $.ajax({
        url: '/users/update_coin',  
        type: 'GET',
        dataType: 'html',
        async: true,
        data: {
          coin: newCoinBlackjack,
        },
      });
      location.reload();
      location.reload();
      location.reload();
      break;
    case "doubleWin":
      message = "WIN!";
      let myCoinDoubleWin = $('.current_user_coin').val();
      let betCoinDoubleWin = document.getElementById("betCoin").value;
      let numMyCoinDoubleWin = parseInt(myCoinDoubleWin)
      let numBetCoinDoubleWin = parseInt(betCoinDoubleWin)
      let newCoinDoubleWin = numMyCoinDoubleWin + numBetCoinDoubleWin * 2;
      $.ajax({
        url: '/users/update_coin',  
        type: 'GET',
        dataType: 'html',
        async: true,
        data: {
          coin: newCoinDoubleWin,
        },
      });
      location.reload();
      location.reload();
      break;
    case "doubleLoose":
      message = "LOOSE!";
      let myCoinDoubleLoose = $('.current_user_coin').val();
      let betCoinDoubleLoose = document.getElementById("betCoin").value;
      let numMyCoinDoubleLoose = parseInt(myCoinDoubleLoose)
      let numBetCoinDoubleLoose = parseInt(betCoinDoubleLoose)
      let newCoinDoubleLoose = numMyCoinDoubleLoose - numBetCoinDoubleLoose * 2;
      $.ajax({
        url: '/users/update_coin',  
        type: 'GET',
        dataType: 'html',
        async: true,
        data: {
          coin: newCoinDoubleLoose,
        },
      });
      location.reload();
      location.reload();
      break;
  }
  alert(message);
}