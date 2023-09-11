const gameBoard = document.getElementsByClassName("gameBoard")[0];
const context = gameBoard.getContext("2d");
const scoreText = document.getElementById("scoreVal");
const nickname = document.getElementById("nickname");

const width = gameBoard.width;
const height = gameBoard.height;
const unit = 25;

let eggX;
let eggY;
let xVel = 25;
let yVel = 0;
let score = 0;
let active = true;
let started = false;
let points;

let snake = [
  { x: unit, y: 0 },
  { x: 0, y: 0 },
];

window.addEventListener("keydown", keyPress);
startGame();

function startGame() {
  context.fillStyle = "#ffd51a";
  //fillRect(xindex, yindex, width, height)
  context.fillRect(0, 0, width, height);
  createEgg();
  displayEgg();
  createSnake();
}

function clearBoard() {
  context.fillStyle = "#ffd51a";
  context.fillRect(0, 0, width, height);
}

function createEgg() {
  eggX = Math.floor((Math.random() * width) / unit) * unit;
  eggY = Math.floor((Math.random() * width) / unit) * unit;
}

function displayEgg() {
  context.fillStyle = "white";
  context.fillRect(eggX, eggY, unit, unit);
}

function createSnake() {
  context.fillStyle = "black";
  context.strokeStyle = "#ffd51a";
  const cornerRadius = 5; // Adjust the radius as needed

  snake.forEach((snakePart) => {
    const { x, y } = snakePart;

    context.beginPath();
    context.moveTo(x + cornerRadius, y);
    context.lineTo(x + unit - cornerRadius, y);
    context.arcTo(x + unit, y, x + unit, y + cornerRadius, cornerRadius);
    context.lineTo(x + unit, y + unit - cornerRadius);
    context.arcTo(
      x + unit,
      y + unit,
      x + unit - cornerRadius,
      y + unit,
      cornerRadius
    );
    context.lineTo(x + cornerRadius, y + unit);
    context.arcTo(x, y + unit, x, y + unit - cornerRadius, cornerRadius);
    context.lineTo(x, y + cornerRadius);
    context.arcTo(x, y, x + cornerRadius, y, cornerRadius);

    context.fill();
    context.stroke();
  });
}

function moveSnake() {
  const head = { x: snake[0].x + xVel, y: snake[0].y + yVel };

  if (checkCollision(head, snake)) {
    active = false;
    if (score <= 3) {
      window.location.href = "failure.html";
    } else {
      window.location.href = "win.html";
    }
    return;
  }
  snake.unshift(head); //insert new elements of the snake
  if (snake[0].x == eggX && snake[0].y == eggY) {
    score += 1;
    const eatSound = document.getElementById("eatSound");
    eatSound.play();
    createEgg();
  } else {
    snake.pop();
  }
}

function checkCollision(head, snake) {
  checkGameOver();
  for (let i = 1; i < snake.length; i++) {
    if (head.x == snake[i].x && head.y == snake[i].y) {
      return true;
    }
  }
  return false;
}

function nextMove() {
  if (active) {
    setTimeout(() => {
      clearBoard();
      displayEgg();
      moveSnake();
      createSnake();
      checkGameOver();
      nextMove();
    }, 200);
  } else {
    clearBoard();
  }
}

//use key codes the left = 37, up = 38, right = 39, down = 40.
const up_arrow = document.getElementById("up");
const down_arrow = document.getElementById("down");
const left_arrow = document.getElementById("left");
const right_arrow = document.getElementById("right");

function keyPress(event) {
  if (!started) {
    started = true;
    nextMove();
  }
  const left = 37;
  const up = 38;
  const right = 39;
  const down = 40;
  up_arrow.addEventListener("click", () => {
    xVel = 0;
    yVel = -unit;
  });
  down_arrow.addEventListener("click", () => {
    xVel = 0;
    yVel = unit;
  });
  left_arrow.addEventListener("click", () => {
    xVel = -unit;
    yVel = 0;
  });
  right_arrow.addEventListener("click", () => {
    xVel = unit;
    yVel = 0;
  });
  switch (true) {
    case event.keyCode == left && xVel !== unit:
      xVel = -unit;
      yVel = 0;
      break;
    case event.keyCode == right && xVel !== -unit:
      xVel = unit;
      yVel = 0;
      break;
    case event.keyCode == up && yVel !== unit:
      xVel = 0;
      yVel = -unit;
      break;
    case event.keyCode == down && yVel !== -unit:
      xVel = 0;
      yVel = unit;
      break;
  }
}

function checkGameOver() {
  scoreText.innerText = score;
  switch (true) {
    case snake[0].x < 0:
    case snake[0].x >= width:
    case snake[0].y < 0:
    case snake[0].y >= height:
      active = false;
      localStorage.setItem("score", score);
      if (score <= 3) {
        window.location.href = "failure.html";
      } else {
        window.location.href = "win.html";
      }
      break;
  }
}

function backToHome() {
  window.location = "index.html";
}
