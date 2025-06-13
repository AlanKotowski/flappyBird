(function () {
  let canvas;
    let context2d;
    let wall = [];
    const num = 250;
    const wallX = 70;
    const wallY = 550;
    let bird = [];
    const birdPixH = 40;
    const birdPixW = 30;
    let gravVelocity = 0;
    let bp = 0;
    let points = 0;
    let pauseGame = true;
    let newGame = true;
    let gameover = ' NEW GAME'
    let instructions = false
    let birdFly = false;
    let deathPoint = false;
    let noMove = false;

  //   randomize number
  function randomH(value){
        return Math.floor(Math.random() * value)
    }

  //   bird creation
 function makeBird(birdLength){
        for(let i = 0; i < birdLength; i++){
            let x = canvas.width / 8;
            let y = canvas.height / 2;
            bird.push({x:x, y:y})
        }
    }

   function drawBird(){
        bird.forEach(function(el){
            if(!birdFly) {
            const birdImage = new Image();
            birdImage.src = 'images/bird.png';
            context2d.drawImage( birdImage, el.x, el.y, birdPixH, birdPixW)
            setTimeout(() => {
                birdFly = true;
            }, 150)
            } else {
                const birdImage2 = new Image();
            birdImage2.src = 'images/bird2.png';
            context2d.drawImage( birdImage2, el.x, el.y, birdPixH, birdPixW)
            setTimeout(() => {
                birdFly = false;
            }, 150)
            }
        })
    }

  //   bird physic
   function birdGrav(mx, my){
        let birdHeadX = bird[0].x + mx;
        let birdHeadY = bird[0].y + my;
        bird.unshift({x:birdHeadX, y:birdHeadY});
        bird.pop()
    }

  function grav(){
        gravVelocity--;
        birdGrav(0, -3 - (gravVelocity * 0.045))
    }

  //   bird jump
  function birdJump(){
        if(pauseGame == true && !noMove) pauseGame = false
        gravVelocity = 0;
        birdGrav(0, 0)
        instructions = false;
        if(!noMove)flySound()
    }

  // walls creation & movement
  // walls creation

  function makeWalls(size){
    for(let i = 0; i < size; i++){
     let rand = randomH(450);
      headX = canvas.width  + i * num;
      headY = canvas.height - rand
      wall.push({x:headX, y:headY})
  }
}

  // walls drawing
  function drawWalls(){
        wall.forEach(function(el){
        // context2d.fillStyle = 'white'
        const wallImage = new Image();
        wallImage.src = 'images/wall.png';
        context2d.drawImage(wallImage, el.x, el.y , wallX, wallY)
        context2d.drawImage(wallImage, el.x, el.y - 700, wallX, wallY)
        })
    }

  // walls movement
   function moveWalls(dx, dy){
    for (let i = 0; i < wall.length; i++){            
        headX = wall[i].x + dx
        headY = wall[i].y + dy
    }
    wall.unshift({x:headX, y:headY})
    wall.pop()
    }

  // walls iteration (recycled walls)
  function wallsRecycle(){
        for (let i = 0; i < wall.length; i++){
            if(wall[i].x < -wallX) {
                wall[i].x += canvas.width + wallX
                wall[i].y = canvas.height - randomH(450)
            }
        }
    }

function wallsCollision(){
        for(let i = 0; i < wall.length; i++){
            if(wall[i].x + wallX === bird[0].x){
                points = points + 1
                console.log(points / 2)
                pointSound()
                
            } else if (wall[i].x < bird[0].x && wall[i].x + wallX > bird[0].x && wall[i].y - 30 < bird[0].y 
                || wall[i].x < bird[0].x && wall[i].x + 35 > bird[0].x && wall[i].y - 150 > bird[0].y
                || wall[i].x - birdPixH < bird[0].x && wall[i].x  > bird[0].x  && wall[i].y - 30 < bird[0].y
                || wall[i].x - birdPixH < bird[0].x && wall[i].x + wallX > bird[0].x && wall[i].y - 150 > bird[0].y
                || bird[0].y < 20
                || bird[0].y > canvas.height){
                    gameover = 'GAME OVER';
                    document.getElementById('resBut').style.display  = 'block'
                    // pauseGame = true;
                    deathPoint = true;

                    if(deathPoint && !pauseGame){
                        deathSound()
                        deathPoint = false}
                    gameOver()   
                } 
            }
        }


  //   draw actual score
  function drawPoints(){
            context2d.font = '20px Pixelify Sans'
            context2d.strokeStyle = 'black'
            context2d.lineWidth = 3;
            context2d.strokeText('Points: ' + points / 2, 150, 20)
            context2d.fillStyle = 'white'
            context2d.fillText('Points: ' + points / 2, 150, 20)
            
        }

 function bestPoints(){
            bp < points ? bp = points : bp = bp;
            return bp;
        }


     function startGame(){
            if(pauseGame){
                const flappyLogo = new Image();
                flappyLogo.src = 'images/flappyLogo.png';
                context2d.drawImage(flappyLogo, canvas.width / 8, canvas.height / 3, flappyLogo.width / 15, flappyLogo.height / 15)
                
                if(!birdFly) {
                    const birdImage = new Image();
                    birdImage.src = 'images/bird.png';
                    context2d.drawImage( birdImage, canvas.width - 85, canvas.height / 2.8, birdPixH, birdPixW)
                    setTimeout(() => {
                        birdFly = true;
                    }, 150)
                } else {
                    const birdImage2 = new Image();
                    birdImage2.src = 'images/bird2.png';
                    context2d.drawImage( birdImage2, canvas.width - 85, canvas.height / 2.8, birdPixH, birdPixW)
                    setTimeout(() => {
                        birdFly = false;
                    }, 150)
                }
                document.getElementById('startBut').style.display  = 'block'
            }
            
            document.getElementById('startBut').addEventListener('mousedown', () => {
                instructions = true;
                newGame = false
                document.getElementById('startBut').style.display  = 'none'
            })
            canvas.addEventListener('mousedown', () => {
                newGame = false
                document.getElementById('startBut').style.display  = 'none'
            }) 
        }
           
                // medals
     function medals(){
            if (points / 2 < 10){
                const medal = new Image();
                medal.src = 'images/medal.png';
                context2d.drawImage(medal, 120, 285, medal.height / 2, medal.width / 2)
            } else if(points / 2 >= 10 && points / 2 <= 19){
                const bronze = new Image();
                bronze.src = 'images/bronze.png';
                context2d.drawImage(bronze, 120, 285, bronze.height / 2, bronze.width / 2)
            } else if(points / 2 >= 20 && points / 2 <= 49){
                const silver = new Image();
                silver.src = 'images/silver.png';
                context2d.drawImage(silver, 120, 285, silver.height, silver.width)
            } else if(points / 2 >= 50 && points / 2 <= 99){
                const gold = new Image();
                gold.src = 'images/gold.png';
                context2d.drawImage(gold, 120, 285, gold.height / 2, gold.width / 2)
            } else if(points / 2 >= 100){
                const platinum = new Image();
                platinum.src = 'images/platinum.png';
                context2d.drawImage(platinum, 120, 285, platinum.height, platinum.width)
            }


        }
  function gameOver(){  

            pauseGame = true;
            deathPoint = false;
            
            const gameOverImg = new Image();
            gameOverImg.src = 'images/gameOverImg.png';
            context2d.drawImage(gameOverImg, canvas.height / 10, canvas.width / 2.5)
            
            context2d.beginPath()
            context2d.roundRect(80, 240, 250, 125, 10)
            context2d.fillStyle = 'rgb(179, 133, 20)';
            context2d.lineWidth = 5;
            context2d.stroke();
            context2d.fill()
            
            context2d.font = '20px Pixelify Sans'
            context2d.fillStyle = 'black'
            context2d.fillText('MEDAL', 120, 270)
            
            context2d.font = '20px Pixelify Sans'
            context2d.fillStyle = 'black'
            context2d.fillText('SCORE', 250, 270)
            
            context2d.font = '20px Pixelify Sans'
            context2d.fillStyle = 'black'
            context2d.fillText(points / 2, 300, 295)
            
            context2d.font = '20px Pixelify Sans'
            context2d.fillStyle = 'black'
            context2d.fillText('BEST', 270, 320)
            
            context2d.font = '20px Pixelify Sans'
            context2d.fillStyle = 'black'
            context2d.fillText(bp / 2, 300, 345)      
            
            medals()
            
        }

        // game instructions
        function instructionsScreen(){
            const getReady = new Image();
            getReady.src = 'images/getReady.png';
            context2d.drawImage(getReady, canvas.width / 4, canvas.height / 3)
        }
        

  // game reset & clearing canvas every frame
   function resetGame(){
            wall = [];
            makeWalls(2);
            bird = [];
            makeBird(1)
            pauseGame = true;
            points = 0;
            document.getElementById('resBut').style.display  = 'none';
            
        }

  function frame(){
            const backgroundImage = new Image();
            backgroundImage.src = 'images/background.png';
            context2d.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height)
        }

        // SFX
        function pointSound(){
            const point = new Audio('SFX/point.mp3')
                    point.play()
        }

         function deathSound(){
            const death = new Audio('SFX/death.mp3')
                    death.loop = false;
                    death.autoplay=true;
                    death.play()
                                
                }

                 function flySound(){
            const fly = new Audio('SFX/fly.mp3')
                    fly.play()
        }

        // pause game
         function paused(){
            if(!pauseGame){
                console.log('pauza')
                pauseGame = true;
                noMove = true;
                document.getElementById('pauseButton').classList.add('play');
            } else {
                console.log('niepauza');
                pauseGame = false;
                noMove = false;
                document.getElementById('pauseButton').classList.remove('play');
            }
        }

  // game app
  function startApp(){
            canvas = document.getElementById('canvas')
            context2d = canvas.getContext('2d')
            
            canvas.addEventListener('mousedown', birdJump) 
            document.getElementById('resBut').addEventListener('mousedown', resetGame)
            document.getElementById('resBut').addEventListener('mousedown', () =>{
                instructions = true;
            })
            document.getElementById('pauseButton').addEventListener('mousedown', paused)
            
            resetGame()
            setInterval(function(){
                frame()
                drawWalls()
                if(!pauseGame)moveWalls(-2, 0)
                wallsRecycle()
            drawBird()
            bestPoints()
            wallsCollision()
            if(!pauseGame)grav()
            if(newGame) startGame()
            drawPoints()
        if(instructions) instructionsScreen();
    }, 5)
}
window.onload = startApp
})()
