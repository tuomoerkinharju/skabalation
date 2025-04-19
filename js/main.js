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

// Aloita renderöinti heti, jotta näkymä piirtyy (mm. Aloita-painike ja tausta)
game.render();

document.addEventListener('dblclick', function (e) {
  e.preventDefault();
}, { passive: false });
document.getElementById("start-button").addEventListener("click", () => {
  game.start();
  document.getElementById("start-button").classList.add("hidden");
});