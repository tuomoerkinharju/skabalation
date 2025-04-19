// js/main.js

const canvas   = document.getElementById('canvas');
const btnLeft  = document.getElementById('move-left');
const btnRight = document.getElementById('move-right');
const startButton = document.getElementById('start-button');

// Luo peli‑olio
let safeHeight = window.innerHeight < 500 ? 600 : window.innerHeight;
const game = new Lumberjack({
  el: canvas,
  maxWidth: 600,
  maxHeight: safeHeight - 150,
  btnLeft, btnRight
});

// Piirrä alku‑tausta (pelilaudan alaosa) heti kerran
game.drawBackground();

// Estä tuplanäppäin‑zoom
document.addEventListener('dblclick', e => e.preventDefault(), { passive: false });

// Start‑napin kuuntelijat (täsmällisesti Telegram WebViewissä)
function onStart(e) {
  e.preventDefault();
  startButton.classList.add('hidden');
  game.start();
}
['click','touchend','pointerup'].forEach(evt =>
  startButton.addEventListener(evt, onStart)
);

function startGame(e) {
  e.preventDefault();
  startButton.classList.add('hidden');
  game.start();
  window.scrollTo(0, 0);    // varmistaa, että canvasin yläosa tulee näkyviin
}
['click','touchend','pointerup'].forEach(evt =>
  startButton.addEventListener(evt, startGame)
);