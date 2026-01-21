const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Load player image
const playerImg = new Image();
playerImg.src = "player.png";

// VERY SLOW & FORGIVING PHYSICS
let gravity = 0.15;      // much slower fall
let lift = -6;          // softer jump
let velocity = 0;
let maxFallSpeed = 4;   // cap falling speed

let player = {
  x: 60,
  y: 250,
  width: 50,
  height: 50
};

let pipes = [];
let frame = 0;
let score = 0;
let gameOver = false;

// Controls
document.addEventListener("keydown", (e) => {
  if (e.key === "r" && gameOver) {
    resetGame();
  } else if (!gameOver) {
    velocity = lift;
  }
});

document.addEventListener("click", () => {
  if (!gameOver) velocity = lift;
  else resetGame();
});

// Pipe class
class Pipe {
  constructor() {
    this.top = Math.random() * 180 + 100;
    this.bottom = canvas.height - this.top - 340;
    this.x = canvas.width;
    this.width = 60;
    this.speed = 1.2;   // slower pipes
    this.passed = false; // scoring flag
  }

  draw() {
    ctx.fillStyle = "#2ecc71";
    ctx.fillRect(this.x, 0, this.width, this.top);
    ctx.fillRect(
      this.x,
      canvas.height - this.bottom,
      this.width,
      this.bottom
    );
  }

  update() {
    this.x -= this.speed;
  }
}

// Collision detection
function collision(pipe) {
  return (
    player.x < pipe.x + pipe.width &&
    player.x + player.width > pipe.x &&
    (player.y < pipe.top ||
      player.y + player.height > canvas.height - pipe.bottom)
  );
}

// Reset game
function resetGame() {
  player.y = 250;
  velocity = 0;
  pipes = [];
  frame = 0;
  score = 0;
  gameOver = false;
  animate();
}

// Main loop
function animate() {
  if (gameOver) {
    ctx.fillStyle = "black";
    ctx.font = "30px Arial";
    ctx.fillText("Game Over", 115, 260);
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 155, 300);
    ctx.fillText("Click or Press R to Restart", 60, 340);
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Player physics
  velocity += gravity;
  if (velocity > maxFallSpeed) velocity = maxFallSpeed;
  player.y += velocity;

  // Draw player
  ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);

  // Pipes
  if (frame % 150 === 0) {
    pipes.push(new Pipe());
  }

  pipes.forEach((pipe, index) => {
    pipe.update();
    pipe.draw();

    // Score logic (FIXED)
    if (!pipe.passed && pipe.x + pipe.width < player.x) {
      pipe.passed = true;
      score++;
    }

    if (collision(pipe)) {
      gameOver = true;
    }

    if (pipe.x + pipe.width < 0) {
      pipes.splice(index, 1);
    }
  });

  // Ground / ceiling
  if (player.y + player.height > canvas.height || player.y < 0) {
    gameOver = true;
  }

  // Score display
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 20, 40);

  frame++;
  requestAnimationFrame(animate);
}

// Start
animate();
