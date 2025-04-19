// js/main.js

const canvas      = document.getElementById('canvas');
const btnLeft     = document.getElementById('move-left');
const btnRight    = document.getElementById('move-right');
const startButton = document.getElementById('start-button');

// Luo peli-olio (ilman etukäteispiirtoa)
let safeHeight = window.innerHeight < 500 ? 600 : window.innerHeight;
const game = new Lumberjack({
  el: canvas,
  maxWidth: 600,
  maxHeight: safeHeight - 150,
  btnLeft,
  btnRight
});

// Estetään tuplanäppäin-zoom (Telegram WebView)
document.addEventListener('dblclick', e => e.preventDefault(), { passive: false });

// Kun käyttäjä painaa Aloita-peli, käynnistetään koko peli:
function startGame(e) {
  e.preventDefault();
  startButton.classList.add('hidden');
  game.start();
  // varmistetaan, että näkymä skrollaa ylös Telegramissa
  window.scrollTo(0, 0);
}

// Liitetään sama handler click, touchend ja pointerdown -tapahtumiin
['click', 'touchend', 'pointerdown'].forEach(evt =>
  startButton.addEventListener(evt, startGame)
);