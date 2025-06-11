(function () {
  let canvas;
  let context2d;
  let wall = [];
  let num = 250;
  let wallX = 70;
  let wallY = 550;
  let bird = [];
  let birdPixH = 40;
  let birdPixW = 30;
  let gravVelocity = 0;
  let bp = 0;
  let points = 0;
  let pauseGame = true;
  let newGame = true;
  let gameover = " NEW GAME";

  //   randomize number
  function randomH(value) {
    return Math.floor(Math.random() * value);
  }

  //   bird creation
  function makeBird(birdLength) {
    for (let i = 0; i < birdLength; i++) {
      let x = canvas.width / 8;
      let y = canvas.height / 2;
      bird.push({ x: x, y: y });
    }
  }

  function drawBird() {
    bird.forEach(function (el) {
      context2d.fillStyle = "red";
      context2d.fillRect(el.x, el.y, birdPixH, birdPixW);
    });
  }

  //   bird physic
  function birdGrav(mx, my) {
    let birdHeadX = bird[0].x + mx;
    let birdHeadY = bird[0].y + my;
    bird.unshift({ x: birdHeadX, y: birdHeadY });
    bird.pop();
  }

  function grav() {
    gravVelocity--;
    birdGrav(0, -3 - gravVelocity * 0.045);
  }

  //   bird jump
  function birdJump() {
    if (pauseGame == true) pauseGame = false;
    gravVelocity = 0;
    birdGrav(0, 0);
  }

  // walls creation & movement
  // walls creation

  function makeWalls(size) {
    for (let i = 0; i < size; i++) {
      let rand = randomH(450);
      headX = canvas.width + i * num;
      headY = canvas.height - rand;
      wall.push({ x: headX, y: headY });
    }
  }

  // walls drawing
  function drawWalls() {
    wall.forEach(function (el) {
      context2d.fillStyle = "white";
      context2d.fillRect(el.x, el.y, wallX, wallY);
      context2d.fillRect(el.x, el.y - 700, wallX, wallY);
    });
  }

  // walls movement
  function moveWalls(dx, dy) {
    for (let i = 0; i < wall.length; i++) {
      headX = wall[i].x + dx;
      headY = wall[i].y + dy;
    }
    wall.unshift({ x: headX, y: headY });
    wall.pop();
  }

  // walls iteration (recycled walls)
  function wallsRecycle() {
    for (let i = 0; i < wall.length; i++) {
      if (wall[i].x < -wallX) {
        wall[i].x += canvas.width + wallX;
        wall[i].y = canvas.height - randomH(500);
      }
    }
  }

  function wallsCollision() {
    for (let i = 0; i < wall.length; i++) {
      if (wall[i].x + wallX === bird[0].x) {
        points = points + 1;
        console.log(points / 2);
      } else if (
        (wall[i].x < bird[0].x &&
          wall[i].x + wallX > bird[0].x &&
          wall[i].y - 30 < bird[0].y) ||
        (wall[i].x < bird[0].x &&
          wall[i].x + 35 > bird[0].x &&
          wall[i].y - 150 > bird[0].y) ||
        (wall[i].x - birdPixH < bird[0].x &&
          wall[i].x > bird[0].x &&
          wall[i].y - 30 < bird[0].y) ||
        (wall[i].x - birdPixH < bird[0].x &&
          wall[i].x + wallX > bird[0].x &&
          wall[i].y - 150 > bird[0].y) ||
        bird[0].y < 0 ||
        bird[0].y > canvas.height
      ) {
        gameover = "GAME OVER";
        document.getElementById("resBut").style.display = "block";
        pauseGame = true;
        gameOver();
      }
    }
  }

  //   draw actual score
  function drawPoints() {
    context2d.font = "20px Arial";
    context2d.fillStyle = "red";
    if (!pauseGame) context2d.fillText("Points: " + points / 2, 10, 20);
  }

  function bestPoints() {
    if (bp < points) {
      bp = points;
    } else {
      return;
    }
    return bp;
  }

  //   game over
  // function gameOver() {
  //   context2d.font = "40px Arial";
  //   context2d.fillStyle = "white";
  //   context2d.fillText(gameover, canvas.width / 5, canvas.height / 2);
  // }

  function startGame() {
    if (pauseGame) {
      context2d.fillStyle = "blue";
      context2d.fillRect(80, 150, 250, 340);
      context2d.font = "40px Arial";
      context2d.fillStyle = "white";
      context2d.fillText(gameover, canvas.width / 5, canvas.height / 3);
      document.getElementById("startBut").style.display = "block";
    }
    document.getElementById("startBut").addEventListener("mousedown", () => {
      newGame = false;
      document.getElementById("startBut").style.display = "none";
    });
  }

  function gameOver() {
    context2d.fillStyle = "red";
    context2d.fillRect(80, 150, 250, 340);
    context2d.font = "40px Arial";
    context2d.fillStyle = "white";
    context2d.fillText(gameover, canvas.width / 5, canvas.height / 3);

    context2d.fillStyle = "green";
    context2d.fillRect(80, 240, 250, 150);
    context2d.fillStyle = "white";
    context2d.fillRect(80, 240, 100, 150);
    context2d.font = "20px Arial";
    context2d.fillStyle = "black";
    context2d.fillText("MEDAL", 95, 270);

    context2d.font = "20px Arial";
    context2d.fillStyle = "black";
    context2d.fillText("SCORE", 250, 270);

    context2d.font = "20px Arial";
    context2d.fillStyle = "black";
    context2d.fillText(points / 2, 300, 300);

    context2d.font = "20px Arial";
    context2d.fillStyle = "black";
    context2d.fillText("BEST", 270, 340);

    context2d.font = "20px Arial";
    context2d.fillStyle = "black";
    context2d.fillText(bp / 2, 300, 370);
  }

  // game reset & clearing canvas every frame
  function resetGame() {
    wall = [];
    makeWalls(2);
    bird = [];
    makeBird(1);
    pauseGame = true;
    points = 0;
    document.getElementById("resBut").style.display = "none";
    if (pauseGame) gameOver();
  }

  function frame() {
    context2d.fillStyle = "black";
    context2d.fillRect(0, 0, canvas.width, canvas.height);
  }

  // game app
  function startApp() {
    canvas = document.getElementById("canvas");
    context2d = canvas.getContext("2d");

    canvas.addEventListener("mousedown", birdJump);
    document.getElementById("resBut").addEventListener("mousedown", resetGame);

    resetGame();
    setInterval(function () {
      frame();
      drawWalls();
      if (!pauseGame) moveWalls(-2, 0);
      wallsRecycle();
      drawBird();
      bestPoints();
      wallsCollision();
      if (!pauseGame) grav();
      if (newGame) startGame();
      drawPoints();
    }, 5);
  }
  window.onload = startApp;
})();
