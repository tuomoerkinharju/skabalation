// js/main.js

// Varmista, että HTML on latautunut ennen koodin suorittamista
window.addEventListener('DOMContentLoaded', () => {
  const canvas      = document.getElementById('canvas');
  const btnLeft     = document.getElementById('move-left');
  const btnRight    = document.getElementById('move-right');
  const startButton = document.getElementById('start-button');

  // Tarkista, että nappi löytyy
  if (!startButton) {
    console.error('main.js: start-button ei löytynyt');
    return;
  }

  // Luo peli–olio, mutta älä piirrä mitään
  let safeHeight = window.innerHeight < 500 ? 600 : window.innerHeight;
  const game = new Lumberjack({
    el: canvas,
    maxWidth: 600,
    maxHeight: safeHeight - 150,
    btnLeft,
    btnRight
  });

  // Estä tuplanäppäin‑zoom
  document.addEventListener('dblclick', e => e.preventDefault(), { passive: false });

  // Yksi selkeä käynnistys­funktio
  function startGame(e) {
    e.preventDefault();
    console.log('startGame kutsuttu');
    startButton.classList.add('hidden');
    game.start();
    window.scrollTo(0, 0);
  }

  // Liitä sama handler eri tapahtumiin
  ['click', 'touchstart', 'pointerdown'].forEach(evt =>
    startButton.addEventListener(evt, startGame)
  );
});