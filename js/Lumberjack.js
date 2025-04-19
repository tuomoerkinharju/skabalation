// Lumberjack.js
class Lumberjack {
  constructor(props) {
    this.canvas    = props.el;
    this.ctx       = this.canvas.getContext('2d');
    this.canvas.width  = Math.min(window.innerWidth, props.maxWidth);
    this.canvas.height = props.maxHeight;

    this.background = '#d3f7ff';

    // Preloadataan land-kuva
    this.landImage = new Image();
    this.landImage.src = 'images/land.png';

    this.tree    = null;
    this.person  = null;
    this.score   = 0;
    this.highScore = parseInt(localStorage.getItem('highScore')) || 0;
    this.btnLeft  = props.btnLeft;
    this.btnRight = props.btnRight;

    this.isStarted       = false;
    this.isGameOver      = false;
    this.autoDropInterval = null;

    this.listener();
  }

  init() {
    // Luodaan uusi puu-olio ja henkilö-olio
    this.person = new Person(this.canvas);
    this.tree   = new Tree(
      this.canvas,
      this.canvas.width / 2,
      this.canvas.height - 350
    );
    this.tree.init();

    this.score      = 0;
    this.isGameOver = false;
  }

  drawBackground() {
    // Sky
    this.ctx.fillStyle = this.background;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Land (piirretään vasta kun kuvat ladattu)
    if (this.landImage.complete) {
      this.ctx.drawImage(
        this.landImage,
        0,
        this.canvas.height - 300,
        this.canvas.width,
        350
      );
    }
  }

  drawScore() {
    this.ctx.fillStyle = "#333";
    this.ctx.font = "24px Arial";
    this.ctx.fillText("Score", 30, 30);
    this.ctx.font = "32px Arial";
    this.ctx.fillText(this.score, 30, 70);

    this.ctx.font = "24px Arial";
    this.ctx.fillText("Highscore", 30, 120);
    this.ctx.font = "32px Arial";
    this.ctx.fillText(this.highScore, 30, 170);
  }

  draw() {
    this.drawBackground();
    if (this.tree)   this.tree.draw();
    if (this.person) this.person.draw();
    this.drawScore();
  }

  update() {
    this.draw();
  }

  render() {
    this.update();
    requestAnimationFrame(() => this.render());
  }

  autoDrop() {
    this.autoDropInterval = setInterval(() => {
      if (this.isStarted && !this.isGameOver) {
        this.tree.trees.shift();
        this.tree.createNewTrunk();
        this.score++;
      }
    }, 1000);
  }

  start() {
    if (this.isStarted) return;
    this.isStarted = true;
    this.init();
    this.autoDrop();
    this.render();
  }

  stop() {
    this.isGameOver = true;
    clearInterval(this.autoDropInterval);
    this.isStarted = false;
  }

  move(direction) {
    if (!this.isStarted || this.isGameOver) return;

    this.person.characterPosition = direction;

    // Leikkaus-ääni
    const audio = new Audio("audio/cut.wav");
    audio.playbackRate = 2;
    audio.play();

    // Tarkistus, osuuko oksaan
    const next = this.tree.trees[0].value;
    if ((next === 'left' && direction === 'left') ||
        (next === 'right' && direction === 'right')) {
      setTimeout(() => {
        if (this.score > this.highScore) {
          localStorage.setItem('highScore', this.score);
          this.highScore = this.score;
        }
        alert(`You lose. Your Highscore: ${this.highScore}`);
        this.stop();
      }, 100);
    }
  }

  listener() {
    // Näppäimet
    window.addEventListener('keypress', e => {
      if (e.key === 'a' || e.key === 'ArrowLeft')  this.move('left');
      if (e.key === 'd' || e.key === 'ArrowRight') this.move('right');
    });
    // Näppäin‑napit
    this.btnLeft.addEventListener('click',  () => this.move('left'));
    this.btnRight.addEventListener('click', () => this.move('right'));
  }
}