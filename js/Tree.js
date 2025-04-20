// js/Tree.js

// roundRect ja randomNumber pitää olla Helper.js:ssä – täällä luokka Tree ainoastaan
class Tree {
  constructor(canvas, startX, startY) {
    this.canvas = canvas;
    this.ctx    = canvas.getContext('2d');
    this.startX = startX;
    this.startY = startY;

    this.width  = 80;
    this.height = 120;

    this.trees = [];
    this.treesPossibility = [0, 'left', 'right'];

    // Aloituspituus nyt pidempi
    this.starterTree = 10;

    this.branchLeftImg  = new Image();
    this.branchLeftImg.src  = 'images/branch-left.png';
    this.branchRightImg = new Image();
    this.branchRightImg.src = 'images/branch-right.png';
  }

  init() {
    this.trees = [];
    for (let i = 0; i < this.starterTree; i++) {
      const color = i % 2 ? '#a17438' : '#cc8e35';
      this.trees.push({ value: 0, color });
    }
  }

  createNewTrunk() {
    const lastColor = this.trees[this.trees.length - 1].color;
    const color     = lastColor === '#a17438' ? '#cc8e35' : '#a17438';
    const value     = this.treesPossibility[randomNumber(3)];
    this.trees.push({ value, color });
  }

  draw() {
    const x = this.canvas.width / 2 - this.width / 2;
    this.trees.forEach((seg, i) => {
      const y = this.startY - i * this.height;
      this.ctx.fillStyle = seg.color;
      this.ctx.fillRect(x, y, this.width, this.height);
      if (seg.value === 'left' && this.branchLeftImg.complete) {
        this.ctx.drawImage(this.branchLeftImg,
          x - this.width,
          y + this.height / 2 - 15,
          this.width, 30);
      }
      if (seg.value === 'right' && this.branchRightImg.complete) {
        this.ctx.drawImage(this.branchRightImg,
          x + this.width,
          y + this.height / 2 - 15,
          this.width, 30);
      }
    });

    // Piirrä kivet juureen
    this.ctx.fillStyle = '#95a5a6';
    this.ctx.roundRect(
      x - 10,
      this.startY + this.height - 10,
      this.width + 20,
      30,
      { upperLeft:10, upperRight:10, lowerLeft:10, lowerRight:10 },
      true,
      false
    );
  }
}