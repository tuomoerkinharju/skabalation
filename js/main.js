const canvas   = document.getElementById('canvas');
const btnLeft  = document.getElementById('move-left');
const btnRight = document.getElementById('move-right');

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

// Aloitusnapin logiikka
const startButton = document.getElementById('start-button');
function startGame() {
  game.start();                    // käynnistää pelin
  startButton.classList.add('hidden'); // piilottaa napin
}
startButton.addEventListener('click', startGame);
startButton.addEventListener('touchstart', startGame);

// Piirretään aloitusruutu (tausta + napit) heti
game.render();