const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 600;
canvas.height = 600;
canvas.style.border = "2px solid white";
// document.body.appendChild(canvas);

let bgReady, playerReady, projectileReady, additionalReady;
let bgImage, playerImage, projectileImage, additionalImage;

let playerX = canvas.width / 2 - 16;
let playerY = canvas.height / 2 - 16;

let initialSpeed = 2;
let ballThickness = 16;
let balls = [
  {
    ballX: Math.random() * (canvas.width - ballThickness),
    ballY: 0,
    dx: initialSpeed,
    dy: initialSpeed,
  },
];

function createNewBall() {
  initialSpeed += 1;
  let ball = {
    ballX: 0,
    ballY: Math.random() * (canvas.height - ballThickness),
    dx: initialSpeed,
    dy: initialSpeed,
  };
  balls.push(ball);
  // if (balls.push(ball)) {
  //   ball.dx += 1;
  //   ball.dy += 1;
  // }
}

let timerId = setInterval(createNewBall, 5000);

let startTime = Date.now();
let elapsedTime = 0;

let keysPressed = {};

function loadImages() {
  // background image
  bgImage = new Image();
  bgImage.onload = function () {
    bgReady = true;
  };
  bgImage.src = "images/background1.jpeg";
  //player image
  playerImage = new Image();
  playerImage.onload = function () {
    playerReady = true;
  };
  playerImage.src = "images/player.png";
  // projectile image
  projectileImage = new Image();
  projectileImage.onload = function () {
    projectileReady = true;
  };
  projectileImage.src = "images/projectile.png";
}

function setupControlKey() {
  document.addEventListener("keydown", function (e) {
    keysPressed[e.key] = true;
  });

  document.addEventListener("keyup", function (e) {
    keysPressed[e.key] = false;
  });
}

function update() {
  elapsedTime = Math.floor((Date.now() - startTime) / 1000);
  //player movement
  if (keysPressed["ArrowUp"]) {
    playerY -= 5;
  }
  if (keysPressed["ArrowDown"]) {
    playerY += 5;
  }
  if (keysPressed["ArrowLeft"]) {
    playerX -= 5;
  }
  if (keysPressed["ArrowRight"]) {
    playerX += 5;
  }
  //player boundaries
  if (playerX >= canvas.width - 32) {
    playerX = canvas.width - 32;
  }
  if (playerY >= canvas.height - 32) {
    playerY = canvas.height - 32;
  }
  if (playerX <= 0) {
    playerX = 0;
  }
  if (playerY <= 0) {
    playerY = 0;
  }

  //projectile border bounce
  //monster movement
  for (let index = 0; index < balls.length; index++) {
    const ball = balls[index];
    ball.ballX += ball.dx;
    ball.ballY += ball.dy;

    if (ball.ballX >= canvas.width - ballThickness || ball.ballX <= 0) {
      ball.dx = -ball.dx;
    }
    if (ball.ballY >= canvas.height - ballThickness || ball.ballY <= 0) {
      ball.dy = -ball.dy;
    }
  }
}

function render() {
  if (bgReady) {
    ctx.drawImage(bgImage, 0, 0);
  }
  if (playerReady) {
    ctx.drawImage(playerImage, playerX, playerY);
  }
  if (projectileReady) {
    for (let index = 0; index < balls.length; index++) {
      const ball = balls[index];
      ctx.drawImage(projectileImage, ball.ballX, ball.ballY);
    }
  }
  // if (monsterCaught >= 2 && monsterCaught <= 20) {
  //   ctx.drawImage(anotherImage, anotherX, anotherY);
  // }
  ctx.font = "15px Georgia";
  ctx.fillText(`Seconds Elapsed: ${elapsedTime}`, 20, 100);
  ctx.fillStyle = "white";
  // ctx.fillText(`Monsters Caught: ${monsterCaught}`, 20, 150);
}
function replayGame() {
  clearInterval(timerId);
  playerX = canvas.width / 2 - 16;
  playerY = canvas.height / 2 - 16;
  balls = [{ ballX: Math.random() * canvas.width, ballY: 0, dx: 2, dy: 2 }];
  startTime = Date.now();
  elapsedTime = 0;
  timerId = setInterval(createNewBall, 5000);
  requestAnimationFrame(main);
  initialSpeed = 2;
  document
    .getElementsByClassName("retryButton")[0]
    .setAttribute("disabled", "disabled");
}
function main() {
  update();
  render();
  document
    .getElementsByClassName("startButton")[0]
    .setAttribute("disabled", "disabled");
  //player and projectile collision hitbox
  for (let index = 0; index < balls.length; index++) {
    const ball = balls[index];
    if (
      playerX <= ball.ballX + 16 &&
      ball.ballX <= playerX + 32 &&
      playerY <= ball.ballY + 16 &&
      ball.ballY <= playerY + 32
    ) {
      ctx.font = "40px Georgia";
      ctx.fillText(
        "GAMEOVER",
        canvas.width / 2 - 115,
        canvas.height / 2 + 23.5
      );
      ctx.font = "20px Georgia";
      ctx.fillText(
        `Your Score: ${elapsedTime}`,
        canvas.width / 2 - 55,
        canvas.height / 2 + 47
      );
      document
        .getElementsByClassName("retryButton")[0]
        .removeAttribute("disabled");
      clearInterval(timerId);
      return;
    }
  }
  requestAnimationFrame(main);
}
loadImages();
setupControlKey();
// main();

//todo: lives. sound effect. body margin. canvas size. style
