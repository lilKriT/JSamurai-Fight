// some initial setup
const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;
const spriteSpeed = 5;
const jumpPower = 20;

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./img/background.png",
});

const shop = new Sprite({
  position: {
    x: 600,
    y: 160,
  },
  frames: 6,
  scale: 2.5,
  imageSrc: "./img/shop.png",
});

const player = new Fighter({
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
  imageSrc: "./img/samuraiMack/Idle.png",
  frames: 8,
  scale: 2.5,
  offset: {
    x: 215,
    y: 157,
  },
  sprites: {
    idle: {
      imageSrc: "./img/samuraiMack/Idle.png",
      frames: 8,
    },
    run: {
      imageSrc: "./img/samuraiMack/Run.png",
      frames: 8,
    },
    jump: {
      imageSrc: "./img/samuraiMack/Jump.png",
      frames: 2,
    },
    fall: {
      imageSrc: "./img/samuraiMack/Fall.png",
      frames: 2,
    },
    attack: {
      imageSrc: "./img/samuraiMack/Attack1.png",
      frames: 6,
    },
  },
  attackBox: {
    offset: {
      x: 100,
      y: 50,
    },
    width: 160,
    height: 50,
  },
});

const enemy = new Fighter({
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
  imageSrc: "./img/kenji/Idle.png",
  frames: 4,
  scale: 2.5,
  offset: {
    x: 215,
    y: 167,
  },
  sprites: {
    idle: {
      imageSrc: "./img/kenji/Idle.png",
      frames: 4,
    },
    run: {
      imageSrc: "./img/kenji/Run.png",
      frames: 8,
    },
    jump: {
      imageSrc: "./img/kenji/Jump.png",
      frames: 2,
    },
    fall: {
      imageSrc: "./img/kenji/Fall.png",
      frames: 2,
    },
    attack: {
      imageSrc: "./img/kenji/Attack1.png",
      frames: 4,
    },
  },
  attackBox: {
    offset: {
      x: -170,
      y: 50,
    },
    width: 170,
    height: 50,
  },
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

decreaseTimer();

// main loop
function animate() {
  window.requestAnimationFrame(animate); // this creates and infinte loop
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);

  background.update();
  shop.update();
  player.update();
  enemy.update();

  player.velocity.x = 0;
  enemy.velocity.x = 0;

  // player movement
  if (keys.a.pressed && player.lastKey === "a") {
    player.velocity.x = -spriteSpeed;
    player.switchSprite("run");
  } else if (keys.d.pressed && player.lastKey === "d") {
    player.velocity.x = spriteSpeed;
    player.switchSprite("run");
  } else {
    player.switchSprite("idle");
  }

  if (player.velocity.y < 0) {
    player.switchSprite("jump");
  } else if (player.velocity.y > 0) {
    player.switchSprite("fall");
  }

  // enemy movement
  if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
    enemy.velocity.x = -spriteSpeed;
    enemy.switchSprite("run");
  } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
    enemy.velocity.x = spriteSpeed;
    enemy.switchSprite("run");
  } else {
    enemy.switchSprite("idle");
  }

  if (enemy.velocity.y < 0) {
    enemy.switchSprite("jump");
    enemy.switchSprite("fall");
  }

  // detecting collision - player
  if (
    rectangularCollision({ rectangle1: player, rectangle2: enemy }) &&
    player.isAttacking &&
    player.frame === 4
  ) {
    player.isAttacking = false;
    console.log("enemy hit");

    enemy.health -= 20;
    document.querySelector(".enemy-hp .hp-inner").style.width =
      enemy.health + "%";
  }

  // player whiffed
  if (player.isAttacking && player.frame === 4) {
    player.isAttacking = false;
  }

  // detecting collision - enemy
  if (
    rectangularCollision({ rectangle1: enemy, rectangle2: player }) &&
    enemy.isAttacking &&
    enemy.frame === 2
  ) {
    enemy.isAttacking = false;
    console.log("player hit");

    player.health -= 20;
    document.querySelector(".player-hp .hp-inner").style.width =
      player.health + "%";
  }

  // enemy whiffed
  if (enemy.isAttacking && enemy.frame === 4) {
    enemy.isAttacking = false;
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
