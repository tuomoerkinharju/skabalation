const canvas = document.getElementById('canvas');
let btnLeft = document.getElementById('move-left');
let btnRight = document.getElementById('move-right');

let safeHeight = window.innerHeight;
if (safeHeight < 500) {
    safeHeight = 600;
}

const game = new Lumberjack({
    el: canvas,
    maxWidth: 600,
    maxHeight: safeHeight - 150,
    btnLeft, btnRight
});

// Estetään tuplanapista zoom
document.addEventListener('dblclick', function (e) {
  e.preventDefault();
}, { passive: false });

// Aloitusnapin logiikka
const startButton = document.getElementById("start-button");
startButton.addEventListener("click", () => {
    game.start(); // käynnistää pelin
    startButton.classList.add("hidden"); // piilottaa napin
});