const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#000',
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

let paddle;
let ball;
let bricks;
let cursors;
let score = 0;
let lives = 3;
let scoreText;
let livesText;
let isGameOver = false;

function preload() {
    this.load.image('paddle', 'https://labs.phaser.io/assets/sprites/paddle.png');
    this.load.image('ball', 'https://labs.phaser.io/assets/sprites/balls/ball.png');
    this.load.image('brick', 'https://labs.phaser.io/assets/sprites/50x50.png');
}

function create() {
    paddle = this.physics.add.image(100, 550, 'paddle').setImmovable();
    paddle.body.collideWorldBounds = true;

    ball = this.physics.add.image(400, 520, 'ball');
    ball.setCollideWorldBounds(true);
    ball.setBounce(1);
    ball.setVelocity(150, -150);
    ball.body.allowGravity = false;

    bricks = this.physics.add.staticGroup();
    for (let x = 50; x < 800; x += 70) {
        for (let y = 50; y < 250; y += 35) {
            bricks.create(x, y, 'brick');
        }
    }

    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '20px', fill: '#fff' });
    livesText = this.add.text(700, 16, `Lives: ${lives}`, { fontSize: '20px', fill: '#fff' });

    this.physics.add.collider(ball, bricks, hitBrick, null, this);
    this.physics.add.collider(ball, paddle, hitPaddle, null, this);

    cursors = this.input.keyboard.createCursorKeys();

    // Buttons to control game state
    document.getElementById('start-btn').addEventListener('click', startGame);
    document.getElementById('pause-btn').addEventListener('click', pauseGame);
    document.getElementById('resume-btn').addEventListener('click', resumeGame);
    document.getElementById('new-game-btn').addEventListener('click', newGame);
}

// Hide the Game Over message (DOM manipulation)
function hideGameOverMessage() {
    const gameOverMessage = document.getElementById('game-over-message');
    gameOverMessage.style.display = 'none';  // Hide the message
}
// Hide the Game Over message (DOM manipulation)
function hideGameDead() {
    const gameOverMessage = document.getElementById('Dead');
    gameOverMessage.style.display = 'none';  // Hide the message
}

function update() {
    if (isGameOver) return;

    // Paddle movement
    if (cursors.left.isDown) {
        paddle.setVelocityX(-300);
    } else if (cursors.right.isDown) {
        paddle.setVelocityX(300);
    } else {
        paddle.setVelocityX(0);
    }

    // Check if the ball goes out of bounds
    if (ball.y > 555) {
        loseLife();
    }
}

function hitBrick(ball, brick) {
    brick.disableBody(true, true);
    score += 10;
    scoreText.setText('Score: ' + score);

    if (bricks.countActive() === 0) {
        resetBall();
        resetBricks();
    }
}

function hitPaddle(ball, paddle) {
    ball.setVelocityY(ball.body.velocity.y - 10);
    let newVelocityX = (ball.x - paddle.x) * 5;
    ball.setVelocityX(newVelocityX);
}

function loseLife() {
    lives--;
    livesText.setText(`Lives: ${lives}`);

    const gameOverMessage = document.getElementById('Dead');
    gameOverMessage.style.display = 'block';  // Make the message visible


    if (lives === 0) {
        gameOver();
    } else {
        resetBall();
    }
}

function resetBall() {
       ball.setPosition(400, 520);  // Set the ball's position back to above the paddle
    ball.setVelocity(0);  // Stop the ball
    isBallLaunched = false;  // Ball is now waiting for a click to start
    
    
}

function resetBricks() {
    bricks.children.iterate(function (brick) {
        brick.enableBody(false, 0, 0, true, true);
    });
}

function gameOver() {
    const gameOverMessage = document.getElementById('game-over-message');
    gameOverMessage.style.display = 'block';  // Make the message visible
    isGameOver = true;
    ball.setVelocity(0);
    this.add.text(400, 300, 'Game Over', { fontSize: '40px', fill: '#ad1254' }).setOrigin(0.5);

}

// Game control functions
function startGame() {
    ball.setVelocity(150, -150);
    isGameOver = false;
    hideGameDead(); // hide the message
    hideGameOverMessage(); // hide the game over message
}

function pauseGame() {
    game.scene.pause('default');
}

function resumeGame() {
    game.scene.resume('default');
}

function newGame() {
    score = 0;
    lives = 3;
    scoreText.setText('Score: 0');
    livesText.setText(`Lives: ${lives}`);
    resetBall();
    resetBricks();
    isGameOver = false;
}
