(function () {
  let canvas;
  let context2d;
  let bird = [];
  const birdPixH = 40;
  const birdPixW = 30;
  let gravVelocity = 0;
  let wall = [];
  const num = 300;
  const wallX = 70;
  const wallY = 550;
  let bp = 0;
  let points = 0;
  let pauseGame = true;
  let newGame = true;
  let gameover = "NEW GAME";
  let instructions = false;
  let birdFly = false;
  let deathPoint = false;
  let noMove = false;
  let birdImage = new Image();
  let birdImage2 = new Image();
  let wallImage = new Image();
  let backgroundImage = new Image();
  let flappyLogo = new Image();
  let getReady = new Image();
  let gameOverImg = new Image();
  let medal = new Image();
  let bronze = new Image();
  let silver = new Image();
  let gold = new Image();
  let platinum = new Image();
  let isKeyDown = false;

  // load all images
  function loadImages() {
    birdImage.src = "images/bird.png";
    birdImage2.src = "images/bird2.png";
    wallImage.src = "images/wall.png";
    backgroundImage.src = "images/background.png";
    flappyLogo.src = "images/flappyLogo.png";
    getReady.src = "images/getReady.png";
    gameOverImg.src = "images/gameOverImg.png";
    medal.src = "images/medal.png";
    bronze.src = "images/bronze.png";
    silver.src = "images/silver.png";
    gold.src = "images/gold.png";
    platinum.src = "images/platinum.png";
  }

  // random number generator with variable max value
  function randomH(value) {
    return Math.floor(Math.random() * value);
  }

  // BIRD
  // bird creation
  function makeBird(birdLength) {
    for (let i = 0; i < birdLength; i++) {
      let x = canvas.width / 8;
      let y = canvas.height / 2;
      bird.push({ x: x, y: y });
    }
  }

  // bird draw on canvas
  function drawBird() {
    bird.forEach(function (el) {
      birdWingsAnimation(el.x, el.y);
    });
  }

  // game grav
  function birdGrav(mx, my) {
    let birdHeadX = bird[0].x + mx;
    let birdHeadY = bird[0].y + my;
    bird.unshift({ x: birdHeadX, y: birdHeadY });
    bird.pop();
  }

  // game grav implemented to the bird
  function grav() {
    gravVelocity--;
    birdGrav(0, -3 - gravVelocity * 0.045);
  }

  // bird jump & grav reset
  function birdJump() {
    if (gameover === "GAME OVER") return;
    if (pauseGame && instructions) {
      pauseGame = false;
      instructions = false;
    }
    if (pauseGame) {
      if (instructions) {
        instructions = false;
        pauseGame = false;
      }
      return;
    }
    gravVelocity = 0;
    birdGrav(0, 0);
    flySound();
  }

  // bird wings animation
  function birdWingsAnimation(h, w) {
    if (!birdImage.complete || !birdImage2.complete) return;
    if (!birdFly) {
      context2d.drawImage(birdImage, h, w, birdPixH, birdPixW);
    } else {
      context2d.drawImage(birdImage2, h, w, birdPixH, birdPixW);
    }
  }

  // WALLS
  // walls creation
  function makeWalls(size) {
    for (let i = 0; i < size; i++) {
      let rand = randomH(450);
      let headX = canvas.width + i * num;
      let headY = canvas.height - rand;
      wall.push({ x: headX, y: headY, counted: false });
    }
  }

  // walls draw on canvas
  function drawWalls() {
    wall.forEach(function (el) {
      context2d.drawImage(wallImage, el.x, el.y, wallX, wallY);
      context2d.drawImage(wallImage, el.x, el.y - 700, wallX, wallY);
    });
  }

  // walls movement
  function moveWalls(dx, dy) {
    for (let i = 0; i < wall.length; i++) {
      wall[i].x += dx;
      wall[i].y += dy;
    }
  }

  // walls iteration (recycled walls)
  function wallsRecycle() {
    for (let i = 0; i < wall.length; i++) {
      if (wall[i].x < -wallX) {
        wall[i].counted = false;
        wall[i].x += canvas.width + wallX + 150;
        wall[i].y = canvas.height - randomH(450);
      }
    }
  }

  // adding points when bird goes through the gap && game over after bird collision with walls
  function wallsCollision() {
    for (let i = 0; i < wall.length; i++) {
      if (!wall[i].counted && wall[i].x + wallX < bird[0].x) {
        points += 1;
        wall[i].counted = true;
        pointSound();
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
        bird[0].y > canvas.height - 35
      ) {
        gameover = "GAME OVER";
        document.getElementById("resBut").style.display = "block";
        deathPoint = true;

        if (deathPoint && !pauseGame) {
          deathSound();
          deathPoint = false;
        }
        gameOver();
      }
    }
  }

  //UI
  // drawing current points on canvas
  function drawPoints() {
    context2d.font = "20px Pixelify Sans";
    context2d.strokeStyle = "black";
    context2d.lineWidth = 3;
    context2d.strokeText("Points: " + points, 150, 20);
    context2d.fillStyle = "white";
    context2d.fillText("Points: " + points, 150, 20);
  }

  // best score holder
  function loadBestPoints() {
    const storeBestScore = localStorage.getItem("bestScore");
    if (storeBestScore !== null) {
      bp = parseInt(storeBestScore);
    }
  }

  function updateBestPoints() {
    if (points > bp) {
      bp = points;
      localStorage.setItem("bestScore", bp);
    }
  }

  // new game screen
  function startGame() {
    if (pauseGame) {
      context2d.drawImage(flappyLogo, canvas.width / 8, canvas.height / 3, flappyLogo.width / 15, flappyLogo.height / 15);
      birdWingsAnimation(canvas.width - 85, canvas.height / 2.8);
      document.getElementById("startBut").style.display = "block";
    }
    document.getElementById("startBut").addEventListener("mousedown", () => {
      newGame = false;
      instructions = true;
      pauseGame = true;
      document.getElementById("startBut").style.display = "none";
    });

    canvas.addEventListener("mousedown", () => {
      if (gameover === "GAME OVER") return;
      if (newGame) return;
      if (pauseGame && !instructions) {
        instructions = true;
        newGame = false;
        document.getElementById("startBut").style.display = "none";
      } else if (pauseGame && instructions) {
        pauseGame = false;
        instructions = false;
      }
    });
  }

  // how to play instruction screen
  function instructionsScreen() {
    flyingEnabled();
    context2d.drawImage(getReady, canvas.width / 4, canvas.height / 3);
  }

  // score reward system on 10/20/50/100 points
  function medals() {
    if (points < 10) {
      context2d.drawImage(medal, 120, 285, medal.height / 2, medal.width / 2);
    } else if (points >= 10 && points <= 19) {
      context2d.drawImage(bronze, 120, 285, bronze.height / 2, bronze.width / 2);
    } else if (points >= 20 && points <= 49) {
      context2d.drawImage(silver, 120, 285, silver.height, silver.width);
    } else if (points >= 50 && points <= 99) {
      context2d.drawImage(gold, 120, 285, gold.height / 2, gold.width / 2);
    } else if (points >= 100) {
      context2d.drawImage(platinum, 120, 285, platinum.height, platinum.width);
    }
  }

  //game over screen
  function gameOver() {
    updateBestPoints();
    pauseGame = true;
    deathPoint = false;
    flyingDisabled();
    instructions = false;

    context2d.drawImage(gameOverImg, canvas.height / 10, canvas.width / 2.5);

    context2d.beginPath();
    context2d.roundRect(80, 240, 250, 125, 10);
    context2d.fillStyle = "rgb(179, 133, 20)";
    context2d.lineWidth = 5;
    context2d.stroke();
    context2d.fill();

    context2d.font = "20px Pixelify Sans";
    context2d.fillStyle = "black";
    context2d.fillText("MEDAL", 120, 270);

    context2d.font = "20px Pixelify Sans";
    context2d.fillStyle = "black";
    context2d.fillText("SCORE", 250, 270);

    context2d.font = "20px Pixelify Sans";
    context2d.fillStyle = "black";
    context2d.fillText(points, 300, 295);

    context2d.font = "20px Pixelify Sans";
    context2d.fillStyle = "black";
    context2d.fillText("BEST", 270, 320);

    context2d.font = "20px Pixelify Sans";
    context2d.fillStyle = "black";
    context2d.fillText(Math.floor(bp), 300, 345);

    medals();
    gameover = "GAME OVER";
  }

  // pause game function
  function paused() {
    if (gameover === "GAME OVER") return;
    if (!pauseGame) {
      pauseGame = true;
      noMove = true;
      document.getElementById("pauseButton").classList.add("play");
    } else {
      pauseGame = false;
      noMove = false;
      document.getElementById("pauseButton").classList.remove("play");
    }
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
    gameover = "NEW GAME";
    instructions = false;
    deathPoint = false;
  }

  // game frames
  function frame() {
    context2d.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
  }

  //SFX
  // sound after scoring a point
  function pointSound() {
    const point = new Audio("SFX/point.mp3");
    point.play();
  }

  // sound after bird & walls collistion
  function deathSound() {
    const death = new Audio("SFX/death.mp3");
    death.loop = false;
    death.autoplay = true;
    death.play();
  }

  // bird movement sound
  function flySound() {
    const fly = new Audio("SFX/fly.mp3");
    fly.play();
  }

  //flying mechanics
  //adding event listener for flying
  function onKeyDown(e) {
    if (e.code === "Space" && !isKeyDown && gameOver !== "GAME OVER") {
      birdJump();
      isKeyDown = true;
      instructions = false;
    }
  }

  function onKeyUp(e) {
    if (e.code === "Space") {
      isKeyDown = false;
    }
  }

  function flyingEnabled() {
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);
    canvas.addEventListener("mousedown", onMouseClick);
  }

  function onMouseClick() {
    if (gameover !== "GAME OVER") {
      birdJump();
    }
  }

  //removing event listener for flying
  function flyingDisabled() {
    canvas.removeEventListener("mousedown", birdJump);
    document.removeEventListener("keydown", (e) => {
      if (e.code === "space") birdJump();
    });
  }

  // APP
  // whole app invocation
  function startApp() {
    canvas = document.getElementById("canvas");
    context2d = canvas.getContext("2d");
    loadBestPoints();
    loadImages();
    setInterval(() => {
      birdFly = !birdFly;
    }, 150);

    flyingEnabled();
    document.getElementById("resBut").addEventListener("mousedown", resetGame);
    document.getElementById("resBut").addEventListener("mousedown", () => {
      instructions = true;
    });
    document
      .getElementById("pauseButton")
      .addEventListener("mousedown", paused);

    resetGame();
    setInterval(() => {
      frame();
      drawWalls();
      if (!pauseGame) moveWalls(-1, 0);
      wallsRecycle();
      drawBird();
      wallsCollision();
      if (!pauseGame) grav();
      if (newGame) startGame();
      drawPoints();
      if (instructions) instructionsScreen();
    }, 5);
  }
  window.onload = startApp;
})();
