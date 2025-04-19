class Lumberjack {
    constructor(props) {
        this.canvas = props.el;
        this.canvas.width = window.innerWidth > props.maxWidth ? props.maxWidth : window.innerWidth;
        this.canvas.height = props.maxHeight;
        this.background = '#d3f7ff';
        this.ctx = props.el.getContext('2d');
        this.cutSound = props.cutSound;
        this.tree = null;
        this.person = null;
        this.score = 0;
        this.btnLeft = props.btnLeft;
        this.btnRight = props.btnRight;
        this.highScore = localStorage.getItem('highScore') || 0;
        this.isGameOver = true;
        this.isStarted = false;
        this.autoDropInterval = null;
        this.startOnClick = this.startOnClick.bind(this);
        this.listener();
    }

    init() {
        this.person = new Person(this.canvas);
        this.tree = new Tree(this.canvas, this.canvas.width / 2, this.canvas.height - 350);
        this.tree.init();
        this.score = 0;
        this.isGameOver = false;
    }

    drawBackground() {
        this.ctx.fillStyle = this.background;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        let land = new Image();
        land.src = "images/land.png";
        land.onload = () => {
            this.ctx.drawImage(land, 0, this.canvas.height - 300, this.canvas.width, 350);
        };
        if (land.complete) {
            this.ctx.drawImage(land, 0, this.canvas.height - 300, this.canvas.width, 350);
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

    drawStartScreen() {
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = "#fff";
        this.ctx.font = "36px Arial";
        this.ctx.textAlign = "center";
        this.ctx.fillText("Aloita peli", this.canvas.width / 2, this.canvas.height / 2);
    }

    draw() {
        this.drawBackground();
        if (this.tree) this.tree.draw();
        if (this.person) this.person.draw();
        this.drawScore();
        if (!this.isStarted) this.drawStartScreen();
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
            if (!this.isGameOver && this.isStarted) {
                this.tree.trees.shift();
                this.tree.createNewTrunk();
                this.score++;
            }
        }, 1000);
    }

    start = () => {
        this.isStarted = true;
        this.isGameOver = false;
        this.init();
        this.autoDrop();
    }

    startOnClick(e) {
        if (!this.isStarted) {
            this.canvas.removeEventListener('click', this.startOnClick);
            this.start();
        }
    }

    stop() {
        this.isGameOver = true;
        clearInterval(this.autoDropInterval);
        this.isStarted = false;
        this.canvas.addEventListener('click', this.startOnClick);
    }

    move(direction) {
        if (this.isGameOver || !this.isStarted) return;
        this.person.characterPosition = direction;

        let audio = new Audio("audio/cut.wav");
        audio.playbackRate = 2;
        audio.play();

        if ((this.tree.trees[0].value === 'left' && direction === 'left') ||
            (this.tree.trees[0].value === 'right' && direction === 'right')) {
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
        window.addEventListener('keypress', (e) => {
            if (e.key === 'a' || e.key === 'ArrowLeft') this.move('left');
            else if (e.key === 'd' || e.key === 'ArrowRight') this.move('right');
        });
        this.btnLeft.addEventListener('click', () => this.move('left'));
        this.btnRight.addEventListener('click', () => this.move('right'));
        this.canvas.addEventListener('click', this.startOnClick);
    }
}