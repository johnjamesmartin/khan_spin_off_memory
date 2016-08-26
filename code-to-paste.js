var Tile = function(x, y, face) {
    this.x = x;
    this.y = y;
    this.face = face;
    this.width = 70;
};

Tile.prototype.drawFaceDown = function() {
    fill(214, 247, 202);
    strokeWeight(2);
    rect(this.x, this.y, this.width, this.width, 10);
    image(getImage("avatars/leaf-green"), this.x, this.y, this.width, this.width);
    this.isFaceUp = false;
};

// Hover Face Down
Tile.prototype.drawFaceDownHover = function() {
    fill(30, 112, 0);
    strokeWeight(2);
    rect(this.x, this.y, this.width, this.width, 10);
    image(getImage("avatars/orange-juice-squid"), this.x, this.y, this.width, this.width);
    this.isFaceUp = false;
};

Tile.prototype.drawFaceUp = function() {
    fill(214, 247, 202);
    strokeWeight(2);
    rect(this.x, this.y, this.width, this.width, 10);
    image(this.face, this.x, this.y, this.width, this.width);
    this.isFaceUp = true;
};

Tile.prototype.isUnderMouse = function(x, y) {
    return x >= this.x && x <= this.x + this.width  &&
        y >= this.y && y <= this.y + this.width;
};

// Global config
var NUM_COLS = 5;
var NUM_ROWS = 4;

// Declare an array of all possible faces
var faces = [
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

// Global Variables

// variables to keep track of best time and best # of tries
var bestTime = 0;
var bestTries = 0;

// keep track of time taken
var curTime = 0;

var flippedTiles = [];
var delayStartFC = null;
var numTries = 0;

// check if start timer has been clicked
var isStart = false;

// start time
var startTime = 0;

// check if game is over
var isOver = false;

// Make an array which has 2 of each, then randomize it
var possibleFaces = faces.slice(0);
var selected = [];

// our tiles
var tiles = [];

// turn in this into a function so we can do it later when we click new game
var startGame = function() {

    // set our variables to their defaults, some may be redundant 
    curTime = 0;
    flippedTiles = [];
    delayStartFC = null;
    numTries = 0;
    isStart = false;
    startTime = 0;
    isOver = false;
    
    possibleFaces = faces.slice(0);
    selected = [];
    tiles = [];

    for (var i = 0; i < (NUM_COLS * NUM_ROWS) / 2; i++) {
        // Randomly pick one from the array of remaining faces
        var randomInd = floor(random(possibleFaces.length));
        var face = possibleFaces[randomInd];
        // Push twice onto array
        selected.push(face);
        selected.push(face);
        // Remove from array
        possibleFaces.splice(randomInd, 1);
    }
    
    // Now we need to randomize the array
    selected.sort(function() {
        return 0.5 - Math.random();
    });
    
    // Create the tiles
    for (var i = 0; i < NUM_COLS; i++) {
        for (var j = 0; j < NUM_ROWS; j++) {
            tiles.push(new Tile(i * 78 + 10, j * 78 + 40, selected.pop()));
        }
    }
    
    background(255, 255, 255);
    
    // Now draw them face up
    for (var i = 0; i < tiles.length; i++) {
        tiles[i].drawFaceDown();
    }
};

// start our game for the first time
startGame();

// position and dimensions of start button
var startButtonX = 150;
var startButtonY = 5;
var startButtonWidth = 100;
var startButtonHeight = 30;

mouseClicked = function() {
    // check if start/new game button is clicked, and we're not in the middle of a game
    if(mouseX > startButtonX && mouseX < startButtonX + startButtonWidth && mouseY > startButtonY && mouseY < startButtonY + startButtonHeight && !isStart){
        
    // if the game is over we're showing the new game button and should restart
    if(isOver){
        startGame();
    // otherwise we let the program know were in the middle of a game and get a start time
    } else {
        isStart = true;
        startTime = millis();
    }
    
    }
    for (var i = 0; i < tiles.length; i++) {
        // make this statement check if start button has been pressed
        if (tiles[i].isUnderMouse(mouseX, mouseY) && isStart) {
            if (flippedTiles.length < 2 && !tiles[i].isFaceUp) {
                tiles[i].drawFaceUp();
                flippedTiles.push(tiles[i]);
                if (flippedTiles.length === 2) {
                    numTries++;
                    if (flippedTiles[0].face === flippedTiles[1].face) {
                        flippedTiles[0].isMatch = true;
                        flippedTiles[1].isMatch = true;
                    }
                    delayStartFC = frameCount;
                    loop();
                }
            } 
        }
    }
    var foundAllMatches = true;
    for (var i = 0; i < tiles.length; i++) {
        foundAllMatches = foundAllMatches && tiles[i].isMatch;
    }
    if (foundAllMatches) {
        // if our current time is better than our best time and if it's not 0 (default time)
        if(curTime < bestTime || bestTime === 0){
            // set our new best time as the current time
            bestTime = curTime;
        }
        
        // same goes for number of tries
        if(numTries < bestTries || bestTries === 0){
            bestTries = numTries;
        }
        
        // we are currently not in a game
        isStart = false;
        // and the game is over
        isOver = true;

        // we are done!
    }
};

// main draw function    
draw = function() {
    if (delayStartFC && (frameCount - delayStartFC) > 30) {
        for (var i = 0; i < tiles.length; i++) {
            if (!tiles[i].isMatch) {
                tiles[i].drawFaceDown();
            }
        }
        flippedTiles = [];
        delayStartFC = null;
    }
    
    // mouse hover
    for(var j = 0; j < tiles.length; j++){
        // if the mouse is over and tile and it is not face up
        if(tiles[j].isUnderMouse(mouseX, mouseY) && !tiles[j].isFaceUp){
            // we draw the face down hover tile
            tiles[j].drawFaceDownHover();
        // else if the tile we are over is face up
        } else if (tiles[j].isFaceUp){
            // we draw a normal face up tile
            tiles[j].drawFaceUp();
        // else we are not over the tile and it is not face up
        } else {
            // we draw a noraml face down tile
            tiles[j].drawFaceDown();
        }
    }
    
    // clear the top and bottom bar so we dont overlap on redraws
    noStroke();
    fill(255,255,255);
    rect(0,0,400,38);
    rect(0,350,400,50);
    stroke(0,0,0);
    
    // start timer button when pressed
    if(isStart){
        fill (30, 112, 0);
        rect(startButtonX,startButtonY, startButtonWidth, startButtonHeight);
        fill(0,0,0);
        textSize(19);
        text ("Start Timer", startButtonX + 3, startButtonY + 21);
    // changes into a new game button if the game is over
    } else if (isOver){
        fill (214, 247, 202);
        rect(startButtonX,startButtonY, startButtonWidth, startButtonHeight);
        fill(0,0,0);
        textSize(19);
        text ("New Game", startButtonX + 3, startButtonY + 21);
    // otherwise we show the default start timer button
    } else {
        fill (214, 247, 202);
        rect(startButtonX,startButtonY, startButtonWidth, startButtonHeight);
        fill(0,0,0);
        textSize(19);
        text ("Start Timer", startButtonX + 3, startButtonY + 21);
    }
            
    // show timer
    fill(0,0,0);
    // if we clicked the start button start counting
    if(isStart){
        curTime = round((millis() - startTime)/1000);
    }
    // print the time
    text ("time: " + curTime + "s", 300, 30);
    
    // display number of tries
    text("# of tries: " + numTries, 20,30);
    
    // display best time and number of tries
    fill(0, 0, 0);
    textSize(20);
    text("best # of tries: " + bestTime + " best time: " + bestTries, 20, 375);
};
