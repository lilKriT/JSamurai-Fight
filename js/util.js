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