// Spin-off of "Project: Memory++" by John

/*  Global variables:
**************************************/

var CONFIG,
    FACES,
    startGame,
    Tile;

/*  CONFIG is used to centralize a
    number of values used throughout
    the app:
**************************************/

CONFIG = {
    hasBegun: false,
    hasEnded: false,

    COLS_LENGTH: 5,
    ROWS_LENGTH: 4,
    
    UI: {
        START_TIMER_BUTTON: {
            X: 150,
            Y: 5,
            WIDTH: 100,
            HEIGHT: 30
        }
    },
    stats: {
        highscore: {
            time: 0,
            tries: 0
        },
        timeValues: {
            currentTime: 0,
            startTime: 0
            
        }
    },
    arrays: {
        revealedTiles: [],
        selectedTiles: [],
        tilesArr: []
    }
};



var delayStartFC = null;
var numTries = 0;
// Make an array which has 2 of each, then randomize it
var possibleFaces = FACES.slice(0);



/*  Images used for card faces:
**************************************/

FACES = [
    getImage("avatars/leafers-seed"),
    getImage("avatars/leafers-seedling"),
    getImage("avatars/leafers-sapling"),
    getImage("avatars/leafers-tree"),
    getImage("avatars/leafers-ultimate"),
    getImage("avatars/marcimus"),
    getImage("avatars/mr-pants"),
    getImage("avatars/mr-pink"),
    getImage("avatars/old-spice-man"),
    getImage("avatars/robot_female_1")
];

/*  Tile constructor function:
**************************************/

Tile = function(x, y, face) {
    this.x = x;
    this.y = y;
    this.face = face;
    this.width = 70;
};

/*  Tile's "drawFaceDown" is used to
    style the back face of cards. By
    default, I've set it to use a 
    green leaf image:
**************************************/

Tile.prototype.drawFaceDown = function() {
    fill(214, 247, 202);
    strokeWeight(2);
    rect(this.x, this.y, this.width, this.width, 10);
    image(getImage("avatars/leaf-green"), 
    this.x, this.y, this.width, this.width);
    this.isFaceUp = false;
};

/*  Tile's "drawFaceDownHover" is used
    to style the back face of cards
    when the user hovers over the card.
    By default, I've set it to use a 
    yellow leaf image:
**************************************/

Tile.prototype.drawFaceDownHover = function() {
    fill(214, 247, 202);
    strokeWeight(2);
    rect(this.x, this.y, this.width, this.width, 10);
    image(getImage("avatars/leaf-yellow"),
    this.x, this.y, this.width, this.width);
    this.isFaceUp = false;
};

/*  Tile's "drawFaceUp" is used to
    style the face of cards:
**************************************/

Tile.prototype.drawFaceUp = function() {
    fill(214, 247, 202);
    strokeWeight(2);
    rect(this.x, this.y, this.width, this.width, 10);
    image(this.face, this.x, this.y, this.width, this.width);
    this.isFaceUp = true;
};

/*  Tile's "isUnderMouse" is used to
    determine whether a card is under
    the current mouse position:
**************************************/

Tile.prototype.isUnderMouse = function(x, y) {
    return x >= this.x && x <= this.x + this.width  &&
        y >= this.y && y <= this.y + this.width;
};










// turn in this into a function so we can do it later when we click new game
startGame = function() {
    // set our variables to their defaults, some may be redundant 
    CONFIG.stats.timeValues.currentTime = 0;
    CONFIG.arrays.revealedTiles = [];
    delayStartFC = null;
    numTries = 0;
    CONFIG.hasBegun = false;
    CONFIG.stats.timeValues.startTime = 0;
    CONFIG.hasEnded = false;
    possibleFaces = FACES.slice(0);
    CONFIG.arrays.selectedTiles = [];
    CONFIG.arrays.tilesArr = [];

    for (var i = 0; i < (CONFIG.COLS_LENGTH * CONFIG.ROWS_LENGTH) / 2; i++) {
        // Randomly pick one from the array of remaining faces
        var randomInd = floor(random(possibleFaces.length));
        var face = possibleFaces[randomInd];
        // Push twice onto array
        CONFIG.arrays.selectedTiles.push(face);
        CONFIG.arrays.selectedTiles.push(face);
        // Remove from array
        possibleFaces.splice(randomInd, 1);
    }
    
    // Now we need to randomize the array
    CONFIG.arrays.selectedTiles.sort(function() {
        return 0.5 - Math.random();
    });
    
    // Create the CONFIG.arrays.tilesArr
    for (var i = 0; i < CONFIG.COLS_LENGTH; i++) {
        for (var j = 0; j < CONFIG.ROWS_LENGTH; j++) {
            CONFIG.arrays.tilesArr.push(new Tile(i * 78 + 10, j * 78 + 40, CONFIG.arrays.selectedTiles.pop()));
        }
    }
    
    background(255, 255, 255);
    
    // Now draw them face up
    for (var i = 0; i < CONFIG.arrays.tilesArr.length; i++) {
        CONFIG.arrays.tilesArr[i].drawFaceDown();
    }
};

// start our game for the first time
startGame();



mouseClicked = function() {
    // check if start/new game button is clicked, and we're not in the middle of a game
    if(mouseX > CONFIG.UI.START_TIMER_BUTTON.X && mouseX < CONFIG.UI.START_TIMER_BUTTON.X + CONFIG.UI.START_TIMER_BUTTON.WIDTH && mouseY > CONFIG.UI.START_TIMER_BUTTON.Y && mouseY < CONFIG.UI.START_TIMER_BUTTON.Y + CONFIG.UI.START_TIMER_BUTTON.HEIGHT && !CONFIG.hasBegun){
        
    // if the game is over we're showing the new game button and should restart
    if(CONFIG.hasEnded){
        startGame();
    // otherwise we let the program know were in the middle of a game and get a start time
    } else {
        CONFIG.hasBegun = true;
        CONFIG.stats.timeValues.startTime = millis();
    }
    
    }
    for (var i = 0; i < CONFIG.arrays.tilesArr.length; i++) {
        // make this statement check if start button has been pressed
        if (CONFIG.arrays.tilesArr[i].isUnderMouse(mouseX, mouseY) && CONFIG.hasBegun) {
            if (CONFIG.arrays.revealedTiles.length < 2 && !CONFIG.arrays.tilesArr[i].isFaceUp) {
                CONFIG.arrays.tilesArr[i].drawFaceUp();
                CONFIG.arrays.revealedTiles.push(CONFIG.arrays.tilesArr[i]);
                if (CONFIG.arrays.revealedTiles.length === 2) {
                    numTries++;
                    if (CONFIG.arrays.revealedTiles[0].face === CONFIG.arrays.revealedTiles[1].face) {
                        CONFIG.arrays.revealedTiles[0].isMatch = true;
                        CONFIG.arrays.revealedTiles[1].isMatch = true;
                    }
                    delayStartFC = frameCount;
                    loop();
                }
            } 
        }
    }
    var foundAllMatches = true;
    for (var i = 0; i < CONFIG.arrays.tilesArr.length; i++) {
        foundAllMatches = foundAllMatches && CONFIG.arrays.tilesArr[i].isMatch;
    }
    if (foundAllMatches) {
        // if our current time is better than our best time and if it's not 0 (default time)
        if(CONFIG.stats.timeValues.currentTime < CONFIG.stats.highscore.time || CONFIG.stats.highscore.time === 0){
            // set our new best time as the current time
            CONFIG.stats.highscore.time = CONFIG.stats.timeValues.currentTime;
        }
        
        // same goes for number of tries
        if(numTries < CONFIG.stats.highscore.tries || CONFIG.stats.highscore.tries === 0){
            CONFIG.stats.highscore.tries = numTries;
        }
        
        // we are currently not in a game
        CONFIG.hasBegun = false;
        // and the game is over
        CONFIG.hasEnded = true;

        // we are done!
    }
};

// main draw function    
draw = function() {
    if (delayStartFC && (frameCount - delayStartFC) > 30) {
        for (var i = 0; i < CONFIG.arrays.tilesArr.length; i++) {
            if (!CONFIG.arrays.tilesArr[i].isMatch) {
                CONFIG.arrays.tilesArr[i].drawFaceDown();
            }
        }
        CONFIG.arrays.revealedTiles = [];
        delayStartFC = null;
    }
    
    // mouse hover
    for(var j = 0; j < CONFIG.arrays.tilesArr.length; j++){
        // if the mouse is over and tile and it is not face up
        if(CONFIG.arrays.tilesArr[j].isUnderMouse(mouseX, mouseY) && !CONFIG.arrays.tilesArr[j].isFaceUp){
            // we draw the face down hover tile
            CONFIG.arrays.tilesArr[j].drawFaceDownHover();
        // else if the tile we are over is face up
        } else if (CONFIG.arrays.tilesArr[j].isFaceUp){
            // we draw a normal face up tile
            CONFIG.arrays.tilesArr[j].drawFaceUp();
        // else we are not over the tile and it is not face up
        } else {
            // we draw a noraml face down tile
            CONFIG.arrays.tilesArr[j].drawFaceDown();
        }
    }
    
    // clear the top and bottom bar so we dont overlap on redraws
    noStroke();
    fill(255,255,255);
    rect(0,0,400,38);
    rect(0,350,400,50);
    stroke(0,0,0);
    
    // start timer button when pressed
    if(CONFIG.hasBegun){
        fill (30, 112, 0);
        rect(CONFIG.UI.START_TIMER_BUTTON.X, CONFIG.UI.START_TIMER_BUTTON.Y, CONFIG.UI.START_TIMER_BUTTON.WIDTH, CONFIG.UI.START_TIMER_BUTTON.HEIGHT);
        fill(0,0,0);
        textSize(19);
        text ("Start Timer", CONFIG.UI.START_TIMER_BUTTON.X + 3, CONFIG.UI.START_TIMER_BUTTON.Y + 21);
    // changes into a new game button if the game is over
    } else if (CONFIG.hasEnded){
        fill (214, 247, 202);
        rect(CONFIG.UI.START_TIMER_BUTTON.X, CONFIG.UI.START_TIMER_BUTTON.Y, CONFIG.UI.START_TIMER_BUTTON.WIDTH, CONFIG.UI.START_TIMER_BUTTON.HEIGHT);
        fill(0,0,0);
        textSize(19);
        text ("New Game", CONFIG.UI.START_TIMER_BUTTON.X + 3, CONFIG.UI.START_TIMER_BUTTON.Y + 21);
    // otherwise we show the default start timer button
    } else {
        fill (214, 247, 202);
        rect(CONFIG.UI.START_TIMER_BUTTON.X,CONFIG.UI.START_TIMER_BUTTON.Y, CONFIG.UI.START_TIMER_BUTTON.WIDTH, CONFIG.UI.START_TIMER_BUTTON.HEIGHT);
        fill(0,0,0);
        textSize(19);
        text ("Start Timer", CONFIG.UI.START_TIMER_BUTTON.X + 3, CONFIG.UI.START_TIMER_BUTTON.Y + 21);
    }
            
    // show timer
    fill(0,0,0);
    // if we clicked the start button start counting
    if(CONFIG.hasBegun){
        CONFIG.stats.timeValues.currentTime = round((millis() - CONFIG.stats.timeValues.startTime)/1000);
    }
    // print the time
    text ("time: " + CONFIG.stats.timeValues.currentTime + "s", 300, 30);
    
    // display number of tries
    text("# of tries: " + numTries, 20,30);
    
    // display best time and number of tries
    fill(0, 0, 0);
    textSize(20);
    text("best # of tries: " + CONFIG.stats.highscore.time + " best time: " + CONFIG.stats.highscore.tries, 20, 375);
};