// js/Lumberjack.js
class Lumberjack {
  constructor(props) {
    this.canvas       = props.el;
    this.ctx          = this.canvas.getContext('2d');
    this.canvas.width  = Math.min(window.innerWidth, props.maxWidth);
    this.canvas.height = props.maxHeight;

    // Background and land image
    this.background = '#d3f7ff';
    this.landImage  = new Image();
    this.landImage.src = 'images/land.png';

    // Game entities
    this.person = new Person(this.canvas);
    this.tree   = new Tree(
      this.canvas,
      this.canvas.width / 2,
      this.canvas.height - 250
    );

    // Controls
    this.btnLeft  = props.btnLeft;
    this.btnRight = props.btnRight;
    this.listener();

    // Score
    this.score     = 0;
    this.highScore = parseInt(localStorage.getItem('highScore')) || 0;

    // Drop timing for smooth animation
    this.baseInterval     = 2000;
    this.minInterval      = 500;
    this.decrementPerDrop = 50;
    this.dropInterval     = this.baseInterval;
    this.elapsed          = 0;
    this.yOffset          = 0;
    this.lastTime         = null;
    this.dropCount        = 0;

    // Collision flag for current segment
    this.collisionChecked = false;

    // Game state
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

  drawTree() {
    const x = this.canvas.width / 2 - this.tree.width / 2;
    this.tree.trees.forEach((seg, idx) => {
      const baseY = this.tree.startY - idx * this.tree.height;
      const y = baseY + this.yOffset;
      // Draw trunk segment
      this.ctx.fillStyle = seg.color;
      this.ctx.fillRect(x, y, this.tree.width, this.tree.height);
      // Draw branch images
      if (seg.value === 'left' && this.tree.branchLeftImg.complete) {
        this.ctx.drawImage(
          this.tree.branchLeftImg,
          x - this.tree.width,
          y + this.tree.height / 2 - 15,
          this.tree.width,
          30
        );
      }
      if (seg.value === 'right' && this.tree.branchRightImg.complete) {
        this.ctx.drawImage(
          this.tree.branchRightImg,
          x + this.tree.width,
          y + this.tree.height / 2 - 15,
          this.tree.width,
          30
        );
      }
    });
  }

  draw() {
    // Sky background
    this.drawBackground();

    // Land parameters
    const landHeight = 250;
    const landY = this.canvas.height - landHeight;

    // Clip tree drawing to above landY
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.rect(0, 0, this.canvas.width, landY);
    this.ctx.clip();

    // Draw tree segments
    this.drawTree();

    this.ctx.restore();

    // Draw player
    this.person.draw();

    // Draw land covering lower part of tree
    if (this.landImage.complete) {
      this.ctx.drawImage(
        this.landImage,
        0,
        landY,
        this.canvas.width,
        landHeight
      );
    }

    // Draw score
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

    // Update elapsed and calculate yOffset
    this.elapsed += delta;
    this.yOffset = (this.elapsed / this.dropInterval) * this.tree.height;

    // Collision check at mid-drop only once
    const seg = this.tree.trees[0];
    const ratio = this.elapsed / this.dropInterval;
    if (!this.collisionChecked && seg.value !== 0 && ratio >= 0.5 && ratio < 1) {
      this.collisionChecked = true;
      const xCenter = this.canvas.width / 2;
      const branchMidY = this.tree.startY + this.yOffset;
      const playerPos = this.person.characterPositions[this.person.characterPosition];
      const playerMidY = playerPos.y + this.person.characterHeight / 2;
      if (seg.value === this.person.characterPosition && branchMidY >= playerMidY) {
        this.gameOver();
        return;
      }
    }

    // When drop interval reached, shift the segment
    if (this.elapsed >= this.dropInterval) {
      this.elapsed -= this.dropInterval;
      this.dropCount++;
      this.yOffset = 0;
      this.collisionChecked = false;

      const removed = this.tree.trees.shift();
      this.tree.createNewTrunk();
      this.score++;

      // Speed up next drop
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

  move(direction) {
    if (!this.isStarted || this.isGameOver) return;
    this.person.characterPosition = direction;
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
      if (e.key === 'a' || e.key === 'ArrowLeft') this.move('left');
      if (e.key === 'd' || e.key === 'ArrowRight') this.move('right');
    });
    this.btnLeft.addEventListener('click',  () => this.move('left'));
    this.btnRight.addEventListener('click', () => this.move('right'));
  }
}
