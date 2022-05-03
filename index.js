// some initial setup
const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;
const spriteSpeed = 5;
const jumpPower = 20;

// Sprite class
class Sprite {
  // these curly brackets make it an object. now the order doesn't matter and they are optional
  constructor({ position, velocity, color = "red", offset }) {
    this.position = position;
    this.velocity = velocity;
    this.width = 50;
    this.height = 150;
    this.lastKey;

    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      offset,
      width: 100,
      height: 50,
    };
    this.color = color;
    this.isAttacking = false;
    this.health = 100;
  }

  draw() {
    c.fillStyle = this.color;
    c.fillRect(this.position.x, this.position.y, this.width, this.height);

    // attack box drawing
    if (this.isAttacking) {
      c.fillStyle = "green";
      c.fillRect(
        this.attackBox.position.x,
        this.attackBox.position.y,
        this.attackBox.width,
        this.attackBox.height
      );
    }
  }

  attack() {
    this.isAttacking = true;
    setTimeout(() => {
      this.isAttacking = false;
    }, 100);
  }

  update() {
    this.draw();
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y;

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.position.y + this.height + this.velocity.y >= canvas.height) {
      this.velocity.y = 0;
    } else {
      this.velocity.y += gravity;
    }
  }
}

const player = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: 0,
    y: 0,
  },
});

const enemy = new Sprite({
  position: {
    x: 400,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 10,
  },
  offset: {
    x: -50,
    y: 0,
  },
  color: "blue",
});

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
};

function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
      rectangle2.position.x &&
    rectangle1.attackBox.position.x <=
      rectangle2.position.x + rectangle2.width &&
    rectangle1.attackBox.position.y <=
      rectangle2.position.y + rectangle2.height &&
    rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
      rectangle2.position.y
  );
}

function whoWins({ player, enemy, timerID }) {
  document.querySelector(".game-wrapper .scoreboard-wrapper").style =
    "display: flex";

  if (player.health > enemy.health) {
    document.querySelector(".game-wrapper .scoreboard").innerHTML = "Left wins";
  } else if (player.health < enemy.health) {
    document.querySelector(".game-wrapper .scoreboard").innerHTML =
      "Right wins";
  } else {
    document.querySelector(".game-wrapper .scoreboard").innerHTML =
      "It's a tie";
  }

  clearTimeout(timerID);
}

let timeLeft = 45;
let timerID;

function decreaseTimer() {
  if (timeLeft > 0) {
    timerID = setTimeout(decreaseTimer, 1000);
    timeLeft--;
    document.querySelector(".game-wrapper .timer").innerHTML = timeLeft;
  }

  if (timeLeft <= 0) {
    whoWins({ player, enemy, timerID });
  }
}
decreaseTimer();

// main loop
function animate() {
  window.requestAnimationFrame(animate); // this creates and infinte loop
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.update();
  enemy.update();

  player.velocity.x = 0;
  enemy.velocity.x = 0;

  // player movement
  if (keys.a.pressed && player.lastKey === "a") {
    player.velocity.x = -spriteSpeed;
  } else if (keys.d.pressed && player.lastKey === "d") {
    player.velocity.x = spriteSpeed;
  }

  // enemy movement
  if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
    enemy.velocity.x = -spriteSpeed;
  } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
    enemy.velocity.x = spriteSpeed;
  }

  // detecting collision - player
  if (
    rectangularCollision({ rectangle1: player, rectangle2: enemy }) &&
    player.isAttacking
  ) {
    player.isAttacking = false;
    console.log("enemy hit");

    enemy.health -= 20;
    document.querySelector(".enemy-hp .hp-inner").style.width =
      enemy.health + "%";
  }

  // detecting collision - enemy
  if (
    rectangularCollision({ rectangle1: enemy, rectangle2: player }) &&
    enemy.isAttacking
  ) {
    enemy.isAttacking = false;
    console.log("player hit");

    player.health -= 20;
    document.querySelector(".player-hp .hp-inner").style.width =
      player.health + "%";
  }

  if (player.health <= 0 || enemy.health <= 0) {
    whoWins({ player, enemy, timerID });
  }
}
animate();

window.addEventListener("keydown", (e) => {
  switch (e.key) {
    // player controls
    case "d":
      keys.d.pressed = true;
      player.lastKey = "d";
      break;
    case "a":
      keys.a.pressed = true;
      player.lastKey = "a";
      break;
    case "w":
      player.velocity.y = -jumpPower;
      break;
    case " ":
      player.attack();
      break;

    // enemy controls
    case "ArrowRight":
      keys.ArrowRight.pressed = true;
      enemy.lastKey = "ArrowRight";
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = true;
      enemy.lastKey = "ArrowLeft";
      break;
    case "ArrowUp":
      enemy.velocity.y = -jumpPower;
      break;
    case "ArrowDown":
      enemy.attack();
      break;

    default:
      break;
  }
});

window.addEventListener("keyup", (e) => {
  switch (e.key) {
    // player controls
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
    case "w":
      keys.w.pressed = false;
      break;

    // enemy controls
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
    case "ArrowUp":
      keys.ArrowUp.pressed = false;
      break;

    default:
      break;
  }
});
