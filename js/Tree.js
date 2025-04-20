// js/Tree.js

class Tree {
  constructor(canvas, startX, startY) {
    this.canvas = canvas;
    this.ctx    = canvas.getContext('2d');

    this.startX = startX;
    this.startY = startY;
    this.width  = 100;
    this.height = 150;

    this.trees = [];
    this.treesPossibility = [0, 'left', 'right'];

    // Kuvakoot (samanlaiset kuin aiemmin stemWidth, stemHeight)
    this.branchWidth  = 100;
    this.branchHeight = 30;

    // Aloitusrunkojen määrä
    this.starterTree = 5;

    // Lataa oksakuvat kerran konstruktorissa
    this.branchLeftImg  = new Image();
    this.branchLeftImg.src  = 'images/branch-left.png';

    this.branchRightImg = new Image();
    this.branchRightImg.src = 'images/branch-right.png';
  }

  init() {
    this.trees = [];
    for (let i = 0; i < this.starterTree; i++) {
      // Random 0 (ei oksaa), left tai right
      const value = this.treesPossibility[Math.floor(Math.random() * 3)];
      // Vuorottelevat rungon värit
      const color = i % 2 ? '#a17438' : '#cc8e35';
      this.trees.push({ value, color });
    }
  }

  createNewTrunk() {
    // Vuorottelu viimeisen rungon värin perusteella
    const lastColor = this.trees[this.trees.length - 1].color;
    const color = lastColor === '#a17438' ? '#cc8e35' : '#a17438';
    const value = this.treesPossibility[Math.floor(Math.random() * 3)];
    this.trees.push({ value, color });
  }

  draw() {
    const x = this.canvas.width / 2 - this.width / 2;

    this.trees.forEach((tree, i) => {
      // Piirrä runko
      this.ctx.fillStyle = tree.color;
      this.ctx.fillRect(x, this.startY - i * this.height, this.width, this.height);

      // Jos oksa vasemmalle
      if (tree.value === 'left' && this.branchLeftImg.complete) {
        this.ctx.drawImage(
          this.branchLeftImg,
          x - this.branchWidth,
          this.startY - i * this.height + this.height / 2,
          this.branchWidth,
          this.branchHeight
        );
      }
      // Jos oksa oikealle
      if (tree.value === 'right' && this.branchRightImg.complete) {
        this.ctx.drawImage(
          this.branchRightImg,
          x + this.width,
          this.startY - i * this.height + this.height / 2,
          this.branchWidth,
          this.branchHeight
        );
      }
    });

    // Piirrä kivi pohjalle (sama kuin aiemmin)
    this.ctx.fillStyle = '#808080';
    this.ctx.roundRect(
      x - 10,
      this.startY + this.height - 10,
      50, 30,
      { upperLeft:10, upperRight:10, lowerLeft:10, lowerRight:10 },
      true,
      false
    );
    this.ctx.fillStyle = '#95a5a6';
    this.ctx.roundRect(
      x + 20,
      this.startY + this.height - 10,
      80, 30,
      { upperLeft:10, upperRight:10, lowerLeft:10, lowerRight:10 },
      true,
      false
    );
  }
}