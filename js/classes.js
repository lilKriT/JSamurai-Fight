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
    sprites,
    attackBox = { offset: {}, width: undefined, height: undefined },
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
      offset: attackBox.offset,
      width: attackBox.width,
      height: attackBox.height,
    };
    this.color = color;
    this.isAttacking = false;
    this.health = 100;

    this.sprites = sprites;
    for (const sprite in sprites) {
      sprites[sprite].image = new Image();
      sprites[sprite].image.src = sprites[sprite].imageSrc;
    }
  }

  attack() {
    this.isAttacking = true;
    this.switchSprite("attack");
  }

  switchSprite(sprite) {
    if (
      this.image === this.sprites.attack.image &&
      this.frame < this.sprites.attack.frames - 1
    ) {
      return;
    }

    switch (sprite) {
      case "idle":
        if (this.image !== this.sprites.idle.image) {
          this.image = this.sprites.idle.image;
          this.frames = this.sprites.idle.frames;
          this.frame = 0;
        }

        break;
      case "run":
        if (this.image !== this.sprites.run.image) {
          this.image = this.sprites.run.image;
          this.frames = this.sprites.run.frames;
          this.frame = 0;
        }
        break;
      case "jump":
        if (this.image !== this.sprites.jump.image) {
          this.image = this.sprites.jump.image;
          this.frames = this.sprites.jump.frames;
          this.frame = 0;
        }
        break;
      case "fall":
        if (this.image !== this.sprites.fall.image) {
          this.image = this.sprites.fall.image;
          this.frames = this.sprites.fall.frames;
          this.frame = 0;
        }
        break;
      case "attack":
        if (this.image !== this.sprites.attack.image) {
          this.image = this.sprites.attack.image;
          this.frames = this.sprites.attack.frames;
          this.frame = 0;
        }
        break;

      default:
        break;
    }
  }

  update() {
    this.draw();
    this.animateFrames();

    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

    // drawing attack collider
    // c.fillRect(
    //   this.attackBox.position.x,
    //   this.attackBox.position.y,
    //   this.attackBox.width,
    //   this.attackBox.height
    // );

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    // gravity
    if (this.position.y + this.height + this.velocity.y >= canvas.height - 97) {
      this.velocity.y = 0;
      this.position.y = 330;
    } else {
      this.velocity.y += gravity;
    }
  }
}
