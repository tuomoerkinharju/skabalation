// Tree.js
class Tree {
  constructor(canvas, startX, startY) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.startX = startX;
    this.startY = startY;
    this.width = 100;
    this.height = 150;
    this.trees = [];
    this.treesPossibility = [0, 'left', 'right'];
    this.trunkColor = 'brown';
    this.stoneColor = 'grey';
    this.stemWidth = 100;
    this.stemHeight = 30;
    this.starterTree = 5;

    // Preload oksakuvat
    this.branchLeftImg = new Image();
    this.branchLeftImg.src = 'images/branch-left.png';
    this.branchRightImg = new Image();
    this.branchRightImg.src = 'images/branch-right.png';
  }

  init() {
    this.trees = [];
    for (let i = 1; i <= this.starterTree; i++) {
      let color = i % 2 ? '#a17438' : '#cc8e35';
      let newTrunk = this.treesPossibility[randomNumber(2)];
      this.trees.push({ value: newTrunk, color });
    }
  }

  createNewTrunk() {
    let lastColor = this.trees[this.trees.length - 1].color;
    let color = lastColor === '#a17438' ? '#cc8e35' : '#a17438';
    let newTrunk = this.treesPossibility[randomNumber(3)];
    this.trees.push({ value: newTrunk, color });
  }

  draw() {
    let x = this.canvas.width / 2 - this.width / 2;

    this.trees.forEach((tree, index) => {
      // Draw trunk
      this.ctx.fillStyle = tree.color;
      this.ctx.fillRect(x, this.startY - index * this.height, this.width, this.height);

      // Draw branch image if exists
      if (tree.value === 'left' && this.branchLeftImg.complete) {
        this.ctx.drawImage(
          this.branchLeftImg,
          x - this.stemWidth,
          this.startY - index * this.height + this.height / 2,
          this.stemWidth,
          this.stemHeight
        );
      }
      if (tree.value === 'right' && this.branchRightImg.complete) {
        this.ctx.drawImage(
          this.branchRightImg,
          x + this.width,
          this.startY - index * this.height + this.height / 2,
          this.stemWidth,
          this.stemHeight
        );
      }
    });

    // Draw stone base
    this.ctx.fillStyle = this.stoneColor;
    this.ctx.roundRect(x - 10, this.startY + this.height - 10, 50, 30, { upperLeft:10, upperRight:10, lowerLeft:10, lowerRight:10 }, true, false);
    this.ctx.fillStyle = '#95a5a6';
    this.ctx.roundRect(x + 20, this.startY + this.height - 10, 80, 30, { upperLeft:10, upperRight:10, lowerLeft:10, lowerRight:10 }, true, false);
  }
}
