const canvas = document.getElementById('canvas');
let btnLeft = document.getElementById('move-left');
let btnRight = document.getElementById('move-right');

let safeHeight = window.innerHeight;
if (safeHeight < 500) {
    safeHeight = 600; // Aseta minimiarvo varmuuden vuoksi
}

const game = new Lumberjack({
    el: canvas,
    maxWidth: 600,
    maxHeight: safeHeight - 150, // Käytetään turvallista korkeutta
    btnLeft, btnRight
});
game.init()
game.render();