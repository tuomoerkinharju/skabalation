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
    this.tree   = new Tree(
      this.canvas,
      this.canvas.width / 2,
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

    this.isStarted  = false;
    this.isGameOver = false;
  }

  init() {
    this.tree.init();
    this.score       = 0;
    this.dropInterval = this.baseInterval;
    this.elapsed      = 0;
    this.yOffset      = 0;
    this.lastTime     = null;
    this.dropCount    = 0;
    this.isGameOver   = false;
  }

  drawBackground() {
    this.ctx.fillStyle = this.background;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawTree() {
    const x = this.canvas.width / 2 - this.tree.width / 2;
    this.tree.trees.forEach((segment, idx) => {
      const baseY = this.tree.startY - idx * this.tree.height;
      const y = baseY + this.yOffset;
      // Draw trunk
      this.ctx.fillStyle = segment.color;
      this.ctx.fillRect(x, y, this.tree.width, this.tree.height);
      // Draw branch
      if (segment.value === 'left' && this.tree.branchLeftImg.complete) {
        this.ctx.drawImage(
          this.tree.branchLeftImg,
          x - this.tree.width,
          y + this.tree.height / 2 - 15,
          this.tree.width,
          30
        );
      } else if (segment.value === 'right' && this.tree.branchRightImg.complete) {
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
    // Sky
    this.drawBackground();

    // Tree
    this.drawTree();

    // Player
    this.person.draw();

    // Hide tree under land with solid fill
    const landHeight = 250;
    const landY = this.canvas.height - landHeight;
    this.ctx.fillStyle = this.background;
    this.ctx.fillRect(0, landY, this.canvas.width, landHeight);

    // Land image on top
    if (this.landImage.complete) {
      this.ctx.drawImage(
        this.landImage,
        0,
        landY,
        this.canvas.width,
        landHeight
      );
    }

    // Scores
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

    // Update elapsed and offset
    this.elapsed += delta;
    this.yOffset = (this.elapsed / this.dropInterval) * this.tree.height;

    // Early collision detection
    const firstSeg = this.tree.trees[0];
    if (firstSeg.value !== 0) {
      const branchBaseY = this.tree.startY;
      const branchY = branchBaseY + this.yOffset;
      const branchCenter = branchY + this.tree.height / 2;
      const playerPos = this.person.characterPositions[this.person.characterPosition];
      const playerCenterY = playerPos.y + this.person.characterHeight / 2;
      const landTopY = branchBaseY;
      if (
        branchCenter >= playerCenterY &&
        branchCenter < landTopY &&
        firstSeg.value === this.person.characterPosition
      ) {
        this.gameOver();
        return;
      }
    }

    // Perform drop when interval passed
    if (this.elapsed >= this.dropInterval) {
      this.elapsed -= this.dropInterval;
      this.dropCount++;
      this.yOffset = 0;

      const next = this.tree.trees.shift();
      this.tree.createNewTrunk();
      this.score++;

      // Safe drop collision
      if (
        (next.value === 'left' && this.person.characterPosition === 'left') ||
        (next.value === 'right' && this.person.characterPosition === 'right')
      ) {
        this.gameOver();
        return;
      }

      // Speed up
      this.dropInterval = Math.max(
        this.minInterval,
        this.baseInterval - this.decrementPerDrop * this.dropCount
      );
    }

    // Render next frame
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
    this.btnLeft.addEventListener('click', () => this.move('left'));
    this.btnRight.addEventListener('click', () => this.move('right'));
  }
}
