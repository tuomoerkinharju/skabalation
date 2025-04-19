// Person.js
//moi testi
class Person {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx    = canvas.getContext('2d');

    // Ladataan hahmokuva kertaalleen
    this.character = new Image();
    this.character.src = 'images/character-kalle.png';

    // Aloituspuoli
    this.characterPosition = 'right';
    this.characterPositions = {
      left:  {
        x: canvas.width/2 - 160,
        y: canvas.height - 320,
      },
      right: {
        x: canvas.width/2 +  80,
        y: canvas.height - 320,
      }
    };

    this.characterWidth  = 75;
    this.characterHeight = 150;
  }

  draw() {
    // Odotetaan että kuva on ladattu
    if (!this.character.complete) return;

    const pos = this.characterPositions[this.characterPosition];

    if (this.characterPosition === 'right') {
      // Käännetään vaakatasoon
      this.ctx.save();
      this.ctx.translate(pos.x + this.characterWidth/2, pos.y + this.characterWidth/2);
      this.ctx.scale(-1, 1);
      this.ctx.translate(-pos.x - this.characterWidth/2, -pos.y - this.characterWidth/2);
    }

    // Lähde- ja kohdealue piirtoon
    // Lähde leveys = character.naturalWidth / 6
    this.ctx.drawImage(
      this.character,
      0, 0,
      this.character.naturalWidth / 6,
      this.character.naturalHeight,
      pos.x, pos.y,
      this.characterWidth, this.characterHeight
    );

    if (this.characterPosition === 'right') {
      this.ctx.restore();
    }
  }
}