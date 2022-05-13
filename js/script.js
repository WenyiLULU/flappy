const canvas = document.getElementById("my-canvas"); // first things to do : get the elements from html file what we will work on
const ctx = canvas.getContext("2d");
const startBtn = document.getElementById("start-button");

const bgImg = new Image();
bgImg.src = "../images/bg.png";

const playerImg = new Image();
playerImg.src = "../images/flappy.png";

const obstTop = new Image();
obstTop.src = "../images/obstacle_top.png";

const obstBottom = new Image();
obstBottom.src = "../images/obstacle_bottom.png";

let playerX = 20;
let playerY = 20;
const playerWidth = 40;
const playerHeight = 30;
const gravitySpeed = 3;
let gravity = gravitySpeed;

let gameOver = false;

// Obstacles variables
const obstW = 50;
const obstSpace = 75;
let obstSpeed = -3;

/* let obstX = 300;

let obstTopY = 0;
const obstTopH = 100;

let obstBottomY = obstTopH + obstSpace;
const obstBottomH = canvas.height - (obstTopH + obstSpace); */

class Obstacle {
  constructor() {
    this.width = obstW;
    this.space = obstSpace;
    this.speed = obstSpeed;
    this.xPos = 400;
    this.topY = 0;

    this.topH = 50 + Math.floor(Math.random() * (canvas.height - 100)); // to get a random height between (0 - canvas.height -100)
    this.bottomY = this.topH + this.space;
    this.bottomH = canvas.height - (this.topH + this.space);
  }

  move() {
    this.xPos += this.speed;
  }

  getSpacePosition() {
    const currentX = this.posX;
    const currentY = canvas.height - this.bottomH - this.space;

    return { x: currentX, y: currentY };
  } // to return the space position in a objet
}
// array which will stock our obstacles
let obstacles = [];

function drawBg() {
  ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
}

function drawFlappy() {
  ctx.drawImage(playerImg, playerX, playerY, playerWidth, playerHeight);
}

function drawObstacle(obstacle) {
  const { bottomH, bottomY, topH, topY, width, xPos } = obstacle; // get properties from our obstacle

  obstacle.move();

  ctx.drawImage(obstTop, xPos, topY, width, topH);
  ctx.drawImage(obstBottom, xPos, bottomY, width, bottomH);
}

let animationId;

function animate() {
  playerY += gravity;

  drawBg();
  drawFlappy();

  const nextObstacles = [];
  obstacles.forEach(obstacle => {
    const currentSpace = obstacle.getSpacePosition();
    if (
      playerX < obstacle.xPos + obstacle.width &&
      playerX + playerWidth > obstacle.xPos &&
      !(playerY < currentSpace.y + obstacle.space && playerHeight + playerY > currentSpace.y)
    ) {
      gameOver = true;
    } else if (
      playerX < currentSpace.x + obstacle.width &&
      playerX + playerWidth > currentSpace.x &&
      playerY < currentSpace.y + obstacle.space &&
      playerHeight + playerY > currentSpace.y
    ) {
      // collision detected!
      console.log("Space");
    } else {
      // no collision
      console.log("ok");
    }

    drawObstacle(obstacle);
    if (obstacle.xPos > -obstacle.width) {
      nextObstacles.push(obstacle);
    }
  }); // if the current obstacle is still in the screen we push a new one in (-obstacle.width to make sure that all width of obstcale is out)

  obstacles = nextObstacles;

  // Do not try to copy classe instances this way
  //obstacles = JSON.parse(JSON.stringify(currentObstacles)); // deep copy of array of obstacles to make sure not to change the origin one

  if (animationId % 100 === 0) {
    obstacles.push(new Obstacle());
  } // every 100 times we creat a new obstacle and put it in obstacle array
  if (gameOver) {
    cancelAnimationFrame(animationId);
  } else {
    animationId = requestAnimationFrame(animate); // a new id every time animate is called
  }
}

function startGame() {
  animate();
}

window.addEventListener("keydown", event => {
  if (event.code === "Space") {
    gravity = -gravitySpeed;
  }
});

window.addEventListener("keyup", event => {
  if (event.code === "Space") {
    gravity = gravitySpeed;
  }
});

// event when we refresh the page
window.addEventListener("load", () => {
  startBtn.addEventListener("click", () => {
    startGame();
  });
});
