// Sprite class
class Sprite {
  // these curly brackets make it an object. now the order doesn't matter and they are optional
  constructor({
    position,
    imageSrc,
    scale = 1,
    frames = 1,
    framesHold = 10,
    offset = { x: 0, y: 0 },
  }) {
    this.position = position;
    this.image = new Image();
    this.image.src = imageSrc;
    this.scale = scale;
    this.frames = frames;
    this.frame = 0;
    this.framesElapsed = 0;
    this.framesHold = framesHold;
    this.offset = offset;
  }

  draw() {
    c.drawImage(
      this.image,
      (this.image.width / this.frames) * this.frame,
      0,
      this.image.width / this.frames,
      this.image.height,
      this.position.x - this.offset.x,
      this.position.y - this.offset.y,
      (this.image.width / this.frames) * this.scale,
      this.image.height * this.scale
    );
  }

  animateFrames() {
    this.framesElapsed++;

    if (this.framesElapsed >= this.framesHold) {
      this.framesElapsed %= this.framesHold;
      this.frame++;
      this.frame %= this.frames;
    }
  }

  update() {
    this.draw();
    this.animateFrames();
  }
}

// fighter class
class Fighter extends Sprite {
  // these curly brackets make it an object. now the order doesn't matter and they are optional
  constructor({
    position,
    velocity,
    color = "red",
    imageSrc,
    scale = 1,
    frames = 1,
    framesHold = 10,
    offset = { x: 0, y: 0 },
  }) {
    super({ position, imageSrc, scale, frames, framesHold, offset });

    this.frame = 0;
    this.framesElapsed = 0;
    this.framesHold = framesHold;

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

  attack() {
    this.isAttacking = true;
    setTimeout(() => {
      this.isAttacking = false;
    }, 100);
  }

  update() {
    this.draw();
    this.animateFrames();

    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y;

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.position.y + this.height + this.velocity.y >= canvas.height - 97) {
      this.velocity.y = 0;
    } else {
      this.velocity.y += gravity;
    }
  }
}
