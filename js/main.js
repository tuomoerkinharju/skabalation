const canvas   = document.getElementById('canvas');
const btnLeft  = document.getElementById('move-left');
const btnRight = document.getElementById('move-right');

// Varmista näkyvät mittasuhteet
let safeHeight = window.innerHeight;
if (safeHeight < 500) safeHeight = 600;

const game = new Lumberjack({
  el: canvas,
  maxWidth: 600,
  maxHeight: safeHeight - 150,
  btnLeft,
  btnRight
});

// Estetään tuplanapista zoom
document.addEventListener('dblclick', e => e.preventDefault(), { passive: false });

// Aloita‑peli‑napin logiikka
const startButton = document.getElementById('start-button');
function startGame() {
  game.start();
  startButton.classList.add('hidden');
}
['click','touchstart','pointerdown'].forEach(evt =>
  startButton.addEventListener(evt, e => {
    e.preventDefault();
    startGame();
  })
);

// Piirretään tausta + nappi ruudulle heti
game.render();