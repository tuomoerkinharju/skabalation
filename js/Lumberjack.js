// js/Lumberjack.js

class Lumberjack {
  constructor(props) {
    this.canvas       = props.el;
    this.ctx          = this.canvas.getContext('2d');
    this.canvas.width  = Math.min(window.innerWidth, props.maxWidth);
    this.canvas.height = props.maxHeight;

    this.background = '#d3f7ff';
    this.landImage  = new Image();
    this.landImage.src = 'images/land.png';

    this.person = new Person(this.canvas);
    this.tree   = new Tree(this.canvas,
      this.canvas.width/2,
      this.canvas.height - 250
    );

    this.btnLeft  = props.btnLeft;
    this.btnRight = props.btnRight;
    this.listener();

    this.score     = 0;
    this.highScore = parseInt(localStorage.getItem('highScore')) || 0;

    this.baseInterval     = 2000;
    this.minInterval      = 500;
    this.decrementPerDrop = 50;
    this.dropInterval     = this.baseInterval;
    this.elapsed          = 0;
    this.yOffset          = 0;
    this.lastTime         = null;
    this.dropCount        = 0;
    this.collisionChecked = false;

    this.isStarted  = false;
    this.isGameOver = false;
  }

  init() {
    this.tree.init();
    this.score            = 0;
    this.dropInterval     = this.baseInterval;
    this.elapsed          = 0;
    this.yOffset          = 0;
    this.lastTime         = null;
    this.dropCount        = 0;
    this.collisionChecked = false;
    this.isGameOver       = false;
  }

  drawBackground() {
    this.ctx.fillStyle = this.background;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawTree() { this.tree.draw(); }

  draw() {
    // 1) Taivas
    this.drawBackground();

    // 2) Rajaa puun yläosa ennen maata
    const landTop = this.canvas.height - 250;
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.rect(0, 0, this.canvas.width, landTop);
    this.ctx.clip();
    this.drawTree();
    this.ctx.restore();

    // 3) Pelaaja
    this.person.draw();

    // 4) Maa ja kivet peittää alapään
    if (this.landImage.complete) {
      this.ctx.drawImage(
        this.landImage,
        0,
        landTop,
        this.canvas.width,
        250
      );
    }

    // 5) Pisteet
    this.ctx.fillStyle = '#333';
    this.ctx.font = '24px Arial';
    this.ctx.fillText('Score', 30, 30);
    this.ctx.font = '32px Arial';
    this.ctx.fillText(this.score, 30, 70);
    this.ctx.font = '24px Arial';
    this.ctx.fillText('Highscore', 30, 120);
    this.ctx.font = '32px Arial';
    this.ctx.fillText(this.highScore, 30, 170);
  }

  update(timestamp) {
    if (!this.isStarted || this.isGameOver) return;
    if (this.lastTime === null) this.lastTime = timestamp;
    const delta = timestamp - this.lastTime;
    this.lastTime = timestamp;

    this.elapsed += delta;
    this.yOffset = (this.elapsed / this.dropInterval) * this.tree.height;

    // Early collision once when yli 50%
    const first = this.tree.trees[0];
    const ratio = this.elapsed / this.dropInterval;
    if (!this.collisionChecked && first.value !== 0 && ratio >= 0.5 && ratio < 1) {
      this.collisionChecked = true;
      const branchMidY  = this.tree.startY + this.yOffset + this.tree.height/2;
      const p = this.person.characterPositions[this.person.characterPosition];
      const playerMidY  = p.y + this.person.characterHeight/2;
      if (first.value === this.person.characterPosition && branchMidY >= playerMidY) {
        return this.gameOver();
      }
    }

    // Kun aika täyttyy, shiftataan ja nopeutetaan
    if (this.elapsed >= this.dropInterval) {
      this.elapsed -= this.dropInterval;
      this.dropCount++;
      this.yOffset = 0;
      this.collisionChecked = false;

      this.tree.trees.shift();
      this.tree.createNewTrunk();
      this.score++;

      // Nopeuta
      this.dropInterval = Math.max(
        this.minInterval,
        this.baseInterval - this.decrementPerDrop * this.dropCount
      );
    }

    this.draw();
    requestAnimationFrame(ts => this.update(ts));
  }

  start() {
    if (this.isStarted) return;
    this.isStarted = true;
    this.init();
    requestAnimationFrame(ts => this.update(ts));
  }

  move(dir) {
    if (!this.isStarted || this.isGameOver) return;
    this.person.characterPosition = dir;
    const audio = new Audio('audio/cut.wav');
    audio.playbackRate = 2;
    audio.play();
  }

  gameOver() {
    this.isGameOver = true;
    if (this.score > this.highScore) {
      localStorage.setItem('highScore', this.score);
      this.highScore = this.score;
    }
    alert(`You lose. Your Highscore: ${this.highScore}`);
  }

  listener() {
    window.addEventListener('keypress', e => {
      if (e.key==='a'||e.key==='ArrowLeft')  this.move('left');
      if (e.key==='d'||e.key==='ArrowRight') this.move('right');
    });
    this.btnLeft.addEventListener('click',  ()=>this.move('left'));
    this.btnRight.addEventListener('click', ()=>this.move('right'));
  }
}