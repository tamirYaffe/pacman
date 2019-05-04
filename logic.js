//-------------------------------------------------------------
// Game configuration data
//-------------------------------------------------------------

// This is a numerical representation of the pacman game.
// It uses numbers to represent walls, coins, empty space, and pacman.
let gameData = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,3,1,3,3,3,1,3,3,3,1,3,1],
    [1,3,1,3,3,3,1,3,3,3,1,3,1],
    [1,3,1,3,3,3,1,3,3,3,1,3,1],
    [1,3,3,3,3,3,3,3,3,3,3,3,1],
    [1,3,3,3,1,1,3,1,1,3,3,3,1],
    [1,1,3,3,3,1,3,1,3,3,3,1,1],
    [1,3,3,3,1,1,3,1,1,3,3,3,1],
    [1,3,3,3,3,3,3,3,3,3,3,3,1],
    [1,3,1,3,3,3,1,3,3,3,1,3,1],
    [1,3,1,3,3,3,1,3,3,3,1,3,1],
    [1,3,1,3,3,3,1,3,3,3,1,3,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1]
];
let gameDataCopy=gameData.map(inner => inner.slice());
let active=false;
let lblTime=document.getElementById('timerTag');
let lblScore=document.getElementById('scoreTag');
let lblLife=document.getElementById('livesCntTag');
let timeToPlay;
let smallCoinColor;
let mediumCoinColor;
let bigCoinColor;
let music;
let numOfCoins;
let numBigCoins;
let numMediumCoins;
let numSmallCoins;
let ghostsDamage;
let score;
let controls={
    up: 38,
    down: 40,
    right: 39,
    left: 37
};
// Specifically, a wall is represented by the number 1,
// a coin is the number 2, empty ground is the number 3,
// and Pacman is the number 5.


// In our code below, we want to be able to refer to names of things,
// and not numbers. To make that possible, we set up a few labels.
const EXTRALIFE   = 0;
const WALL   = 1;
const BONUSITEM   = 2;
const GROUND = 3;
const SMALLCOIN   = 4;
const MEDIUMCOIN   = 5;
const BIGCOIN   = 6;
const PACMAN  =7;
const BONUSCHASER   = 8;
const GHOST   = 9;






// We will use the identifier "map" to refer to the game map.
// We won't assign this until later on, when we generate it
// using the gameData.
let map;
let mainInterval; // Execute as fast as possible
let bonusInterval ;
let bonusItemInterval ;
let ghostsInterval;
// We need to keep track of Pacman's location on the game board.
// That is done through a pair of coordinates.
// And, we will keep track of what direction she is facing.
let pacman = {
    x: 6,
    y: 6,
    direction: 'right'
};

let bonusChaser = {
    x: 4,
    y: 4,
    onTop:GROUND,
    alive: true
};

let bonusClock={
    x:1,
    y:0,
    extraTime:0,
    alive:false
};

let extraLife={
    x:0,
    y:0,
    alive:false
};

let ghosts=[];

let points=[];
// Handle keyboard controls
let keysDown = {};

addEventListener("keydown", function (e) {keysDown[e.keyCode] = true;}, false);

addEventListener("keyup", function (e) {delete keysDown[e.keyCode];}, false);

// var intervalTimer;
var then;

//-------------------------------------------------------------
// Game map creation functions
//-------------------------------------------------------------
// This function converts gameData into DOM elements.
function createTiles(data) {
    // We'll keep the DOM elements in an array.
    let tilesArray = [];

    // Let's take one row at a time...
    for (let row of data) {

        // Then look at each column in that row.
        for (let col of row) {

            // We create a game tile as a div element.
            let tile = document.createElement('div');

            // We assign every tile the class name tile.
            tile.classList.add('tile');

            // Now, depending on the numerical value,
            // we need to add a more specific class.
            if (col === WALL) {
                tile.classList.add('wall');

            } else if (col === PACMAN) {
                tile.classList.add('pacman');
                // For Pacman, we will add yet another
                // class for the direction pacman is facing.
                tile.classList.add(pacman.direction);

            } else if (col === GROUND) {
                tile.classList.add('ground');

            } else if (col === SMALLCOIN) {
                tile.classList.add('smallCoin');
                tile.innerText='5';
                tile.style.backgroundColor=smallCoinColor;

            } else if (col === MEDIUMCOIN) {
                tile.classList.add('mediumCoin');
                tile.innerText='15';
                tile.style.backgroundColor=mediumCoinColor;

            } else if (col === BIGCOIN) {
                tile.classList.add('bigCoin');
                tile.innerText='25';
                tile.style.backgroundColor=bigCoinColor;

            }else if (col === BONUSCHASER) {
                tile.classList.add('bonuschaser');

            }else if (col === GHOST) {
                tile.classList.add('ghost');

            }else if (col === BONUSITEM) {
                tile.classList.add('bonusItem');
            }else if (col === EXTRALIFE) {
                tile.classList.add('extralife');
            }



            // Now that our individual tile is configured,
            // we add it to the tilesArray.
            tilesArray.push(tile);
        }

        // Once we reach the end of a row, we create a br element,
        // which tells the browser to create a line break on the page.
        let brTile = document.createElement('br');

        // We then add that br element to the tilesArray.
        tilesArray.push(brTile);
    }

    // At the end of our function, we return the array
    // of configured tiles.
    return tilesArray;
}

// This function creates a map element, fills it with tiles,
// and adds it to the page.
function drawMap() {
    eraseMap();
    map = document.createElement('div');

    let tiles = createTiles(gameData);
    for (let tile of tiles) {
        map.appendChild(tile);
    }

    document.getElementById("board_div").appendChild(map);
}

// This function removes the map element from the page.
function eraseMap() {
    if(document.getElementById("board_div").childElementCount!==0)
        document.getElementById("board_div").removeChild(map);
}

//-------------------------------------------------------------
// Movement functions
//-------------------------------------------------------------

// Each function does the following:
// - set pacman's direction so that we show the correct image
// - check to see if we hit a wall
// - if we didn't hit a wall, set pacman's old location to empty space
// - update pacman's location
// - draw pacman in the new location

function moveDown() {
    pacman.direction = 'down';
    if (gameData[pacman.y+1][pacman.x] !== WALL) {
        gameData[pacman.y][pacman.x] = GROUND;
        pacman.y = pacman.y + 1 ;
        // gameData[pacman.y][pacman.x] = PACMAN;
    }
}

function moveUp() {
    pacman.direction = 'up';
    if (gameData[pacman.y-1][pacman.x] !== WALL) {
        gameData[pacman.y][pacman.x] = GROUND;
        pacman.y = pacman.y - 1;
        // gameData[pacman.y][pacman.x] = PACMAN;
    }
}

function moveLeft() {
    pacman.direction = 'left';
    if (gameData[pacman.y][pacman.x-1] !== WALL) {
        gameData[pacman.y][pacman.x] = GROUND;
        pacman.x = pacman.x - 1 ;
        // gameData[pacman.y][pacman.x] = PACMAN;
    }
}

function moveRight() {
    pacman.direction = 'right';
    if (gameData[pacman.y][pacman.x+1] !== WALL) {
        gameData[pacman.y][pacman.x] = GROUND;
        pacman.x = pacman.x + 1 ;
        // gameData[pacman.y][pacman.x] = PACMAN;
    }
}

function moveBonusChar() {
    console.log('moveBonusChar');
    let possibleMoves=getPossibleCharMoves(bonusChaser.y,bonusChaser.x);
    if(!bonusChaser.alive || possibleMoves.length===0)
        return;
    let randomTileIndex=Math.floor(Math.random() * possibleMoves.length);
    gameData[bonusChaser.y][bonusChaser.x] = bonusChaser.onTop;
    if(bonusChaser.onTop===PACMAN)
        bonusChaser.onTop=GROUND;
    bonusChaser.y=possibleMoves[randomTileIndex][0];
    bonusChaser.x=possibleMoves[randomTileIndex][1];
    checkBonusCharHit();
    if(bonusChaser.alive) {
        bonusChaser.onTop=gameData[bonusChaser.y][bonusChaser.x];
        gameData[bonusChaser.y][bonusChaser.x] = BONUSCHASER;
    }
}

function moveGhosts() {
    console.log('moveGhosts');
    ghosts.forEach(moveGhost);
}

function moveGhost(ghost) {
    gameData[ghost.y][ghost.x] = ghost.onTop;
    let nextMove;
    if(Math.random()<0.7)
        nextMove=getNextSmartMove(ghost);
    else
        nextMove=getNextRandomMove(ghost);
    ghost.y=nextMove[0];
    ghost.x=nextMove[1];
    if(gameData[ghost.y][ghost.x]===GHOST){
        ghosts.forEach(function (ghostI) {
            if(ghostI.y===ghost.y && ghostI.x===ghost.x)
                ghost.onTop=ghostI.onTop;
        })
    }else if(gameData[ghost.y][ghost.x]===PACMAN){
        ghost.onTop=GROUND;
        hitPacman();
    }else
        ghost.onTop=gameData[ghost.y][ghost.x];
    gameData[ghost.y][ghost.x] = GHOST;
}

function getNextSmartMove(ghost) {
    let possibleMoves=getPossibleGhostMoves(ghost.y,ghost.x);
    let minDistance=100;
    let minDistanceMove=[ghost.y,ghost.x];
    possibleMoves.forEach(function (possibleMove) {
        var a = possibleMove[1] - pacman.x;
        var b = possibleMove[0] - pacman.y;
        var c = Math.sqrt(a * a + b * b);
        if(c<minDistance){
            minDistance=c;
            minDistanceMove=possibleMove;
        }
    });
    return minDistanceMove;
}

function getNextRandomMove(ghost) {
    let possibleMoves=getPossibleGhostMoves(ghost.y,ghost.x);
    if(possibleMoves.length===0)
        return [ghost.y,ghost.x];
    let randomTileIndex=Math.floor(Math.random() * possibleMoves.length);
    return[possibleMoves[randomTileIndex][0],possibleMoves[randomTileIndex][1]]
}

function updatePositions() {
    if(active===false)
        return;
    //update position
    if ((controls.up in keysDown) ) { // Player holding up
        moveUp();
    }
    if ((controls.down in keysDown) ) { // Player holding down
        moveDown();
    }
    if (controls.left in keysDown) { // Player holding left
        moveLeft();
    }
    if (controls.right in keysDown) { // Player holding right
        moveRight();
    }
    checkCollisions();
    gameData[pacman.y][pacman.x] = PACMAN;
}

function checkCollisions(){
    addPoints();
    checkBonusCharHit();
    checkBonusItemHit();
    checkExtraLifeHit();
    ghosts.forEach(function (ghost) {
        if(pacman.y===ghost.y && pacman.x===ghost.x){
            hitPacman();
        }
    });
}

function getNumOfCoins() {
    let counter=0;
    for (let i = 0; i < gameData.length; i++) {
        for (let j = 0; j < gameData[0].length; j++) {
            let tile = gameData[i][j];
            if(tile<7 && tile>3){
                counter++;
            }
        }
    }
    return counter;
}

function checkBonusItemHit() {
    // let tile = gameData[pacman.y][pacman.x];
    if(pacman.x===bonusClock.x && pacman.y===bonusClock.y && bonusClock.alive){
        bonusClock.extraTime+=20;
        bonusClock.alive=false;
        let audio=new Audio('sounds/pacman_extraTime.wav');
        audio.play();
    }
}

function checkExtraLifeHit() {
    // let tile = gameData[pacman.y][pacman.x];
    if(pacman.x===extraLife.x && pacman.y===extraLife.y && extraLife.alive){
        lblLife.innerText=String(parseInt(lblLife.innerText)+1);
        extraLife.alive=false;
        let audio=new Audio('sounds/pacman_extraTime.wav');
        audio.play();
    }
}

function checkBonusCharHit() {
    if (pacman.y === bonusChaser.y && pacman.x === bonusChaser.x && bonusChaser.alive === true) {
        bonusChaser.alive = false;
        lblScore.innerText = parseInt(lblScore.innerText) + 50;
        gameData[bonusChaser.y][bonusChaser.x] = bonusChaser.onTop;
    }
}

function hitPacman() {
    let audio=new Audio('sounds/pacman_death.wav');
    audio.play();
    lblLife.innerText = parseInt(lblLife.innerText)-1;
    ghostsDamage+=10;
    if(parseInt(lblLife.innerText)===0){
        endGame('noLife');
        return;
    }
    addPacman();
    ghosts.forEach(function (ghost) {
        if(gameData[ghost.y][ghost.x]!==PACMAN)
            gameData[ghost.y][ghost.x] = ghost.onTop;
    });
    ghosts.forEach(function (ghost) {
        let possibleCornerTiles=getPossibleCornerTiles();
        let randomTileIndex=Math.floor(Math.random() * possibleCornerTiles.length);
        let y=possibleCornerTiles[randomTileIndex][0];
        let x=possibleCornerTiles[randomTileIndex][1];
        ghost.y=y;
        ghost.x=x;
        ghost.onTop=gameData[ghost.y][ghost.x];
        gameData[ghost.y][ghost.x] = GHOST;
    });
    //alert('You Have Been Hit!')
}

//-------------------------------------------------------------
// useful functions
//-------------------------------------------------------------
function addPoints() {
    numOfCoins=getNumOfCoins();
    let numOfSmallCoins=0;
    let numOfMediumCoins=0;
    let numOfBigCoins=0;
    score=0;
    for (let i = 0; i < gameData.length; i++) {
        for (let j = 0; j < gameData[0].length; j++) {
            let tile = gameData[i][j];
            if(tile===BONUSCHASER){
                tile=bonusChaser.onTop;
            }
            if(tile===SMALLCOIN){
                numOfSmallCoins++;
            }
            if(tile===MEDIUMCOIN){
                numOfMediumCoins++;
            }
            if(tile===BIGCOIN){
                numOfBigCoins++;
            }
        }
    }
    ghosts.forEach(function (ghost) {
        let tile = ghost.onTop;
        if(tile===SMALLCOIN){
            numOfSmallCoins++;
        }
        if(tile===MEDIUMCOIN){
            numOfMediumCoins++;
        }
        if(tile===BIGCOIN){
            numOfBigCoins++;
        }
    });
    score=(numBigCoins-numOfBigCoins)*25+(numMediumCoins-numOfMediumCoins)*15+(numSmallCoins-numOfSmallCoins)*5;
    score-=ghostsDamage;
    if(bonusChaser.alive===false)
        score+=50;
    lblScore.innerText=score;
    if(numOfCoins===0){
        console.log('noCoins');
        endGame('noCoins');
    }
}

function addCoins(numOfCoins) {
    numBigCoins=Math.floor(numOfCoins*10/100);
    numMediumCoins=Math.floor(numOfCoins*30/100);
    numSmallCoins=Math.floor(numOfCoins*60/100);
    console.log(numBigCoins*25+numMediumCoins*15+numSmallCoins*5+50);
    let numOfGround=90-numOfCoins;
    let coinPool= [];
    for (let i = 0; i < numOfGround; i++)
        coinPool.push(3);
    for (let i = 0; i < numSmallCoins; i++)
        coinPool.push(4);
    for (let i = 0; i < numMediumCoins; i++)
        coinPool.push(5);
    for (let i = 0; i < numBigCoins; i++)
        coinPool.push(6);
    coinPool=shuffle(coinPool);
    let counter=0;
    for (let i = 0; i < gameData.length; i++) {
        for (let j = 0; j < gameData[0].length; j++) {
            if (gameData[i][j] === GROUND) {
                let coin=coinPool.pop();
                if(coin!==3){
                    points.push([i,j]);
                    counter++;
                }
                gameData[i][j]=coin;
            }
        }
    }
    console.log(counter);
}

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function getPossibleTiles() {
    let possibleTiles = [];
    for (let i = 0; i < gameData.length; i++) {
        for (let j = 0; j < gameData[0].length; j++) {
            let temp = gameData[i][j];
            if ((temp === GROUND) && getPossibleCornerTiles().indexOf([i,j])===-1) {
                possibleTiles.push([i, j]);
            }
        }
    }
    return possibleTiles;
}

function getPossibleCharMoves(y, x) {
    let possibleMoves=[];
    if(gameData[y+1][x]>BONUSITEM && gameData[y+1][x]<7)
        possibleMoves.push([y+1,x]);
    if(gameData[y-1][x]>BONUSITEM && gameData[y-1][x]<7)
        possibleMoves.push([y-1,x]);
    if(gameData[y][x+1]>BONUSITEM && gameData[y][x+1]<7)
        possibleMoves.push([y,x+1]);
    if(gameData[y][x-1]>BONUSITEM && gameData[y][x-1]<7)
        possibleMoves.push([y,x-1]);
    return possibleMoves;
}

function getPossibleGhostMoves(y, x) {
    let possibleMoves=[];
    if(gameData[y+1][x]>BONUSITEM && gameData[y+1][x]<8)
        possibleMoves.push([y+1,x]);
    if(gameData[y-1][x]>BONUSITEM && gameData[y-1][x]<8)
        possibleMoves.push([y-1,x]);
    if(gameData[y][x+1]>BONUSITEM && gameData[y][x+1]<8)
        possibleMoves.push([y,x+1]);
    if(gameData[y][x-1]>BONUSITEM && gameData[y][x-1]<8)
        possibleMoves.push([y,x-1]);
    return possibleMoves;
}

function getPossibleCornerTiles() {
    let possibleCornerTiles=[];
    if(gameData[1][1]<PACMAN)
        possibleCornerTiles.push([1,1]);
    if(gameData[1][11]<PACMAN)
        possibleCornerTiles.push([1,11]);
    if(gameData[11][1]<PACMAN)
        possibleCornerTiles.push([11,1]);
    if(gameData[11][11]<PACMAN)
        possibleCornerTiles.push([11,11]);
    return possibleCornerTiles;
}

function addPacman() {
    gameData[pacman.y][pacman.x] = GROUND;
    let possibleTiles = getPossibleTiles();
    if(possibleTiles.length===0){
        gameData[pacman.y][pacman.x] = PACMAN;
        return;
    }
    let randomTileIndex=Math.floor(Math.random() * possibleTiles.length);
    let y=possibleTiles[randomTileIndex][0];
    let x=possibleTiles[randomTileIndex][1];
    pacman.x=x;
    pacman.y=y;
    gameData[pacman.y][pacman.x] = PACMAN;
}

function addBonusChar() {
    let possibleCornerTiles=getPossibleCornerTiles();
    let randomTileIndex=Math.floor(Math.random() * possibleCornerTiles.length);
    let y=possibleCornerTiles[randomTileIndex][0];
    let x=possibleCornerTiles[randomTileIndex][1];
    bonusChaser.x=x;
    bonusChaser.y=y;
    bonusChaser.alive=true;
    bonusChaser.onTop=gameData[bonusChaser.y][bonusChaser.x];
    gameData[bonusChaser.y][bonusChaser.x] = BONUSCHASER;
}

function addGhosts(numOfGhosts) {
    for (let i = 0; i <numOfGhosts; i++) {
        let ghost={};
        let possibleCornerTiles=getPossibleCornerTiles();
        let randomTileIndex=Math.floor(Math.random() * possibleCornerTiles.length);
        let y=possibleCornerTiles[randomTileIndex][0];
        let x=possibleCornerTiles[randomTileIndex][1];
        ghost.x=x;
        ghost.y=y;
        ghost.onTop=gameData[ghost.y][ghost.x];
        gameData[ghost.y][ghost.x] = GHOST;
        ghosts.push(ghost);
    }
}

function addBonusItem() {
    console.log('addBonusItem');
    if(bonusClock.alive)
        gameData[bonusClock.y][bonusClock.x] = GROUND;
    bonusClock.alive=true;
    let possibleTiles = getPossibleTiles();
    if(possibleTiles.length===0)
        return;
    let randomTileIndex=Math.floor(Math.random() * possibleTiles.length);
    let y=possibleTiles[randomTileIndex][0];
    let x=possibleTiles[randomTileIndex][1];
    bonusClock.x=x;
    bonusClock.y=y;
    gameData[y][x]=BONUSITEM;
}

function addExtraLife() {
    console.log('addExtraLife');
    if(extraLife.alive)
        gameData[extraLife.y][extraLife.x] = GROUND;
    extraLife.alive=true;
    let possibleTiles = getPossibleTiles();
    if(possibleTiles.length===0)
        return;
    let randomTileIndex=Math.floor(Math.random() * possibleTiles.length);
    let y=possibleTiles[randomTileIndex][0];
    let x=possibleTiles[randomTileIndex][1];
    extraLife.x=x;
    extraLife.y=y;
    gameData[y][x]=EXTRALIFE;
}


//-------------------------------------------------------------
// Main game setup function

function updateTimer() {
    let currentTime = new Date();
    let newTime = Math.floor(parseInt(timeToPlay)+ bonusClock.extraTime - (currentTime - start_time) / 1000);
    lblTime.innerText =String(newTime+1);
    if(parseInt(lblTime.innerText)===0){
        let audio=new Audio('sounds/pacman_death.wav');
        audio.play();
        endGame('noTime');

    }
}

//-------------------------------------------------------------
function main() {
    console.log('main');
    drawMap();
    updateTimer();
    updatePositions();
}

// Finally, after we define all of our functions, we need to start
// the game.
//time to play must be greater then 60 sec.
//number of ghosts must be 1-3.

function addDirectionKeys(directionKeys) {
    controls.up=directionKeys['up'];
    controls.down=directionKeys['down'];
    controls.right=directionKeys['right'];
    controls.left=directionKeys['left'];
}

function setBallsColor(ball1_color, ball2_color, ball3_color) {
    smallCoinColor=ball1_color;
    mediumCoinColor=ball2_color;
    bigCoinColor=ball3_color;
}

function reset(controls,numberOfBalls,ball1_color,ball2_color,ball3_color,gameTime,monstersNumber) {
    addPacman();
    numOfCoins=numberOfBalls;
    addCoins(numOfCoins);
    timeToPlay=gameTime;
    lblLife.innerText='3';
    lblScore.innerText='0';
    addBonusChar();
    ghostsDamage=0;
    addGhosts(monstersNumber);
    addDirectionKeys(controls);
    setBallsColor(ball1_color,ball2_color,ball3_color);
    map = document.createElement('div');
    document.getElementById("board_div").appendChild(map);
}

function newGame(controls,numberOfBalls,ball1_color,ball2_color,ball3_color,gameTime,monstersNumber){
    active=true;
    start_time = new Date();
    reset(controls,numberOfBalls,ball1_color,ball2_color,ball3_color,gameTime,monstersNumber);
    mainInterval = setInterval(main, 100); // Execute as fast as possible
    bonusInterval =setInterval(moveBonusChar,500);
    ghostsInterval =setInterval(moveGhosts,500);
    bonusItemInterval =setInterval(addBonusItem,25000);
    extraLifeInterval =setInterval(addExtraLife,35000);
    let audio=new Audio('sounds/pacman_beginning.wav');
    audio.play();
    music = new Audio('sounds/nightmare.mp3');
    music.play();
    // main();
}

function showEndGameAlert(trigger) {
    if(trigger==='noLife'){
        alert('END GAME: You Lost!')
    }
    if(trigger==='noTime'){
        if(score<150)
            alert('END GAME: You can do better')
        else
            alert('END GAME: We have a Winner!!!')
    }
    if(trigger==='noCoins')
        alert('END GAME: You got them All!')
    if(trigger==='startOver')
        alert('END GAME: starting new game..')
}

function endGame(trigger) {
    active=false;
    clearInterval(mainInterval);
    clearInterval(bonusInterval);
    clearInterval(ghostsInterval);
    clearInterval(bonusItemInterval);
    clearInterval(extraLifeInterval);
    eraseMap();
    if(bonusClock.alive)
        gameData[bonusClock.y][bonusClock.x] = GROUND;
    bonusClock.extraTime=0;
    bonusClock.alive=false;
    if(extraLife.alive)
        gameData[extraLife.y][extraLife.x] = GROUND;
    extraLife.alive=false;
    if(bonusChaser.alive)
        gameData[bonusChaser.y][bonusChaser.x] = bonusChaser.onTop;
    ghosts.forEach(function (ghost) {
        gameData[ghost.y][ghost.x] = ghost.onTop;
    });
    points.forEach(function (point) {
        gameData[point[0]][point[1]]=GROUND;
    });
    ghosts=[];
    gameData=gameDataCopy;
    music.pause();
    showEndGameAlert(trigger);
}

function startNewGame(controls,numberOfBalls,ball1_color,ball2_color,ball3_color,gameTime,monstersNumber) {
    if(active===true){
        endGame('startOver');
        newGame(controls,numberOfBalls,ball1_color,ball2_color,ball3_color,gameTime,monstersNumber);
    }
    else {
        eraseMap();
        newGame(controls,numberOfBalls,ball1_color,ball2_color,ball3_color,gameTime,monstersNumber);
    }
}
