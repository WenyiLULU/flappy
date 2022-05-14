// first things to do : get the elements from html file what we will work with later
const canvas = document.getElementById("my-canvas"); 
const ctx = canvas.getContext("2d");
const startBtn = document.getElementById("start-button");

// declare variables to stock the images that we will draw on the canvas. ".src" method is to give the source of image to the image variable
const bgImg = new Image();
bgImg.src = "../images/bg.png";

const playerImg = new Image();
playerImg.src = "../images/flappy.png";

const obstTop = new Image();
obstTop.src = "../images/obstacle_top.png";

const obstBottom = new Image();
obstBottom.src = "../images/obstacle_bottom.png";

// variables for bird 
let playerX = 20;
let playerY = 20;
const playerWidth = 40;
const playerHeight = 30;
const gravitySpeed = 3; // speed of the bird to fall down if no command given to it
let gravity = gravitySpeed; 

// variable for chacking if the game over condition is completed 
let gameOver = false;

// Obstacles variables
const obstW = 50;
const obstSpace = 75;
let obstSpeed = -3;

/* let obstX = 300;

let obstTopY = 0;
const obstTopH = 100;

let obstBottomY = obstTopH + obstSpace;
const obstBottomH = canvas.height - (obstTopH + obstSpace); */ // variables which we used to initialize obstacle but we don't need anymore. Because we use the class Obstacle to create obstacles

// creat a obstacle class containing all properties so we can create new obstacles easier
class Obstacle {
  constructor() {
    this.width = obstW;
    this.space = obstSpace;
    this.speed = obstSpeed;
    this.xPos = 400; // at the right side of canvas
    this.topY = 0;

    this.topH = 50 + Math.floor(Math.random() * (canvas.height - 100)); // to get a random height between (0 to anvas.height -100)
    this.bottomY = this.topH + this.space; 
    this.bottomH = canvas.height - (this.topH + this.space);
  } // hint the position of a element in canvas is it's top-left point

  move() {
    this.xPos += this.speed; // method to make obstacle move 3 units to the left (since this.speed = obstSpeed = -3) 
  }

  getSpacePosition() {
    const currentX = this.posX;
    const currentY = canvas.height - this.bottomH - this.space;

    return { x: currentX, y: currentY };
  } // to return the space position (top-left point of the space) of the obstacle 
}
// array which will stock our obstacles to be draw
let obstacles = [];

// function to draw the background image (bgImg) on canvas at position (0, 0) with canvas width and height to cover all surface of the canvas
function drawBg() {
  ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
}
// function to draw the bird (playerImg) on the position and size we defined above (line 20-23)
function drawFlappy() {
  ctx.drawImage(playerImg, playerX, playerY, playerWidth, playerHeight);
}
//function to draw obstacles which takes a obstacle object as argument (a obstacle that we will create and stock in array "obstacles" in animate)
function drawObstacle(obstacle) {
  const { bottomH, bottomY, topH, topY, width, xPos } = obstacle; // (Destructuring assignment) get properties from our obstacle and use them as distinct variables

  obstacle.move(); // call the move method of the obstacle to make it move

  ctx.drawImage(obstTop, xPos, topY, width, topH);
  ctx.drawImage(obstBottom, xPos, bottomY, width, bottomH);
}

let animationId; // prepare a variable to take current animationId, which is like a counter of the number of times the function "animate" was called

// create animate loop: every elements supposed to move / change need to be called inside
function animate() {
  playerY += gravity; // make the bird fall down with a speed we seted above (line 24-25)

  drawBg(); // draw the background every time animate is called (attention for the order, )
  drawFlappy(); // draw the bird with its current position every time animate is called

  const nextObstacles = []; // prepare a array to stock obstacles which is still in the canvas and give them to the array we defined above (line 69) for the next animate 
  obstacles.forEach(obstacle => {
    const currentSpace = obstacle.getSpacePosition();

    // collision detect conditions
    if (
      playerX < obstacle.xPos + obstacle.width &&
      playerX + playerWidth > obstacle.xPos &&
      !(playerY < currentSpace.y + obstacle.space && playerHeight + playerY > currentSpace.y)
    ) {
      gameOver = true;
      console.log("gameOver")
      // if bird's left-top is behind obstacle right side & bird's right side is on the right of obstacle left side & (bird's top under space bottom & bird's bottom above space top) is not true
    } else if (
      playerX < currentSpace.x + obstacle.width &&
      playerX + playerWidth > currentSpace.x &&
      playerY < currentSpace.y + obstacle.space &&
      playerHeight + playerY > currentSpace.y
    ) {
      // pass through space!
      console.log("Space");
    } else {
      // no collision
      console.log("ok");
    }

    drawObstacle(obstacle);
    if (obstacle.xPos > -obstacle.width) {
      nextObstacles.push(obstacle);
    } // if the current obstacle is still in the screen we push the current obstacle in nextObstacles (< -obstacle.width is to check if all width of obstcale is out)
  }); 

  obstacles = nextObstacles; // so the array "obstacles" will contain only the ones which are still in the canvas. 

  // Do not try to copy classe instances this way the method will not be copied
  //obstacles = JSON.parse(JSON.stringify(currentObstacles)); // deep copy the currentObstacles to make sure not to change the origin one

  if (animationId % 100 === 0) {
    obstacles.push(new Obstacle());
  } // every 100 times the animate is called we creat a new obstacle and put it in obstacles array (so in the array "obstacles" we will have the old ones which is still in the screen and a new one)
  if (gameOver) {
    cancelAnimationFrame(animationId); 
  } else {
    animationId = requestAnimationFrame(animate); // a new id every time animate is called
  }
}

// call "animate" function when "startGame" function is called
function startGame() {
  animate();
} 

window.addEventListener("keydown", event => {
  if (event.code === "Space") {
    gravity = -gravitySpeed;
  }
}); // when key "Space" is pressed make the bird move up

window.addEventListener("keyup", event => {
  if (event.code === "Space") {
    gravity = gravitySpeed;
  }
});// when key "Space" is released let the bird move down

// event when we refresh the page do the callback function
window.addEventListener("load", () => {
  startBtn.addEventListener("click", () => {
    startGame();
  }); // if the starBtn is clicked call startGame function
});
