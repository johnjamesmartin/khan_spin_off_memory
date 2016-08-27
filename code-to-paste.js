// Spin-off of "Project: Memory++" by John

/*  Global variables:
**************************************/

var CONFIG,
    FACES,
    startGame,
    TEXT_LABELS,
    Tile,
    UI_STYLES;


/*  CONFIG is used to centralize a
    number of values used throughout
    the game:
**************************************/

CONFIG = {
    hasBegun: false,
    hasEnded: false,

    // Rows and columns that make up grid:

    COLS_LENGTH: 5,
    ROWS_LENGTH: 4,

    // User Interface elements:

    UI: {
        START_TIMER_BUTTON: {
            X: 10,
            Y: 5,
            WIDTH: 100,
            HEIGHT: 30
        },
    },
    stats: {
        highscore: {
            time: 0,
            tries: 0
        },
        timeValues: {
            currentTime: 0,
            startTime: 0
        },
        numberOfTries: 0
    },
    arrays: {
        revealedTiles: [],
        selectedTiles: [],
        tilesArr: []
    },
    initialFrameCount: null,
    potentialFaces: FACES.slice(0),
    foundAllMatches: ''
};


/*  Images used for card faces:
**************************************/

FACES = [
    getImage('avatars/leafers-seed'),
    getImage('avatars/leafers-seedling'),
    getImage('avatars/leafers-sapling'),
    getImage('avatars/leafers-tree'),
    getImage('avatars/leafers-ultimate'),
    getImage('avatars/marcimus'),
    getImage('avatars/mr-pants'),
    getImage('avatars/mr-pink'),
    getImage('avatars/old-spice-man'),
    getImage('avatars/robot_female_1')
];


/*  Text Labels used throughout UI:
**************************************/

TEXT_LABELS = {
    START_TIMER: 'start game',
    NEW_GAME: 'new game',
    CURRENT_TIME: 'time: ',
    NUMBER_OF_TRIES: 'tries: ',
    RECORD_TRIES: 'tries record: ',
    RECORD_TIME: ' time record: ',
    SECONDS_LABEL: 's'
};


/*  UI Styles:
**************************************/

UI_STYLES = {
    BACKGROUND_COLOUR: [40, 40, 40],
    PANEL_COLOUR: [40, 40, 40],
    CARD_FACE_COLOUR: [214, 247, 202],
    TEXT_COLOUR: [255, 255, 255],
    TEXT_SIZE: 13
};


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
    fill(UI_STYLES.CARD_FACE_COLOUR[0],
         UI_STYLES.CARD_FACE_COLOUR[1],
         UI_STYLES.CARD_FACE_COLOUR[2]);
    strokeWeight(2);
    rect(this.x, this.y, this.width, this.width, 10);
    image(getImage('avatars/leaf-green'), 
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
    fill(UI_STYLES.CARD_FACE_COLOUR[0],
         UI_STYLES.CARD_FACE_COLOUR[1],
         UI_STYLES.CARD_FACE_COLOUR[2]);
    strokeWeight(2);
    rect(this.x, this.y, this.width, this.width, 10);
    image(getImage('avatars/leaf-yellow'),
    this.x, this.y, this.width, this.width);
    this.isFaceUp = false;
};


/*  Tile's "drawFaceUp" is used to
    style the face of cards:
**************************************/

Tile.prototype.drawFaceUp = function() {
    fill(UI_STYLES.CARD_FACE_COLOUR[0],
         UI_STYLES.CARD_FACE_COLOUR[1],
         UI_STYLES.CARD_FACE_COLOUR[2]);
    strokeWeight(2);
    rect(this.x, this.y, this.width, this.width, 10);
    image(this.face, this.x + 5, this.y + 5, this.width - 10, this.width - 10);
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


/*  "startGame" assigns initial values:
**************************************/

startGame = function() {

    // Assign default values to CONFIG properties:

    CONFIG.stats.timeValues.currentTime = 0;
    CONFIG.arrays.revealedTiles = [];
    CONFIG.initialFrameCount = null;
    CONFIG.stats.numberOfTries = 0;
    CONFIG.hasBegun = false;
    CONFIG.stats.timeValues.startTime = 0;
    CONFIG.hasEnded = false;
    CONFIG.potentialFaces = FACES.slice(0);
    CONFIG.arrays.selectedTiles = [];
    CONFIG.arrays.tilesArr = [];


    // For loop that picks a remaining face at random:

    for (var i = 0; i < (CONFIG.COLS_LENGTH * CONFIG.ROWS_LENGTH) / 2; i++) {
        
        // Push faces twice onto array:
        
        var face, randomIndex;
        randomIndex = floor(random(CONFIG.potentialFaces.length));
        face = CONFIG.potentialFaces[randomIndex];
        CONFIG.arrays.selectedTiles.push(face);
        CONFIG.arrays.selectedTiles.push(face);
        CONFIG.potentialFaces.splice(randomIndex, 1);
    }
    

    // Shuffle the array (set a random order):

    CONFIG.arrays.selectedTiles.sort(function() {
        return 0.5 - Math.random();
    });
    

    // Populate the tiles array:

    for (var i = 0; i < CONFIG.COLS_LENGTH; i++) {
        for (var j = 0; j < CONFIG.ROWS_LENGTH; j++) {
            CONFIG.arrays.tilesArr.push(new Tile(i * 78 + 10, j * 78 + 40, CONFIG.arrays.selectedTiles.pop()));
        }
    }
    

    // Set a background colour for game:

    background(UI_STYLES.BACKGROUND_COLOUR[0],
               UI_STYLES.BACKGROUND_COLOUR[1],
               UI_STYLES.BACKGROUND_COLOUR[2]);
    

    // Set tiles in the array to be face up:

    for (var i = 0; i < CONFIG.arrays.tilesArr.length; i++) {
        CONFIG.arrays.tilesArr[i].drawFaceDown();
    }
};


/*  Launch "startGame" function:
**************************************/

startGame();


/*  When user clicks the mouse:
**************************************/

mouseClicked = function() {

    // When clicked, check the game has begun.
    // Present new button to restart if game ended:

    if (mouseX > CONFIG.UI.START_TIMER_BUTTON.X && mouseX < CONFIG.UI.START_TIMER_BUTTON.X + CONFIG.UI.START_TIMER_BUTTON.WIDTH && mouseY > CONFIG.UI.START_TIMER_BUTTON.Y && mouseY < CONFIG.UI.START_TIMER_BUTTON.Y + CONFIG.UI.START_TIMER_BUTTON.HEIGHT && !CONFIG.hasBegun){
        if (CONFIG.hasEnded){
            startGame();
        } else {
            CONFIG.hasBegun = true;
            CONFIG.stats.timeValues.startTime = millis();
        }
    }

    // Loop over tiles and and determine user interactions:

    for (var i = 0; i < CONFIG.arrays.tilesArr.length; i++) {
        if (CONFIG.arrays.tilesArr[i].isUnderMouse(mouseX, mouseY) && CONFIG.hasBegun) {
            if (CONFIG.arrays.revealedTiles.length < 2 && !CONFIG.arrays.tilesArr[i].isFaceUp) {
                CONFIG.arrays.tilesArr[i].drawFaceUp();
                CONFIG.arrays.revealedTiles.push(CONFIG.arrays.tilesArr[i]);
                if (CONFIG.arrays.revealedTiles.length === 2) {
                    CONFIG.stats.numberOfTries++;
                    if (CONFIG.arrays.revealedTiles[0].face === CONFIG.arrays.revealedTiles[1].face) {
                        CONFIG.arrays.revealedTiles[0].isMatch = true;
                        CONFIG.arrays.revealedTiles[1].isMatch = true;
                    }
                    CONFIG.initialFrameCount = frameCount;
                    loop();
                }
            } 
        }
    }

    // :

    CONFIG.foundAllMatches = true;


    // :

    for (var i = 0; i < CONFIG.arrays.tilesArr.length; i++) {
        CONFIG.foundAllMatches = CONFIG.foundAllMatches && CONFIG.arrays.tilesArr[i].isMatch;
    }


    // If all matches found, determine if stats are high scores:

    if (CONFIG.foundAllMatches) {
        if (CONFIG.stats.timeValues.currentTime < CONFIG.stats.highscore.time || CONFIG.stats.highscore.time === 0){
            CONFIG.stats.highscore.time = CONFIG.stats.timeValues.currentTime;
        }
        if (CONFIG.stats.numberOfTries < CONFIG.stats.highscore.tries || CONFIG.stats.highscore.tries === 0){
            CONFIG.stats.highscore.tries = CONFIG.stats.numberOfTries;
        }
        CONFIG.hasBegun = false;
        CONFIG.hasEnded = true;
    }
};


/*  Looping draw function:
**************************************/

draw = function() {
    if (CONFIG.initialFrameCount && (frameCount - CONFIG.initialFrameCount) > 30) {
        for (var i = 0; i < CONFIG.arrays.tilesArr.length; i++) {
            if (!CONFIG.arrays.tilesArr[i].isMatch) {
                CONFIG.arrays.tilesArr[i].drawFaceDown();
            }
        }
        CONFIG.arrays.revealedTiles = [];
        CONFIG.initialFrameCount = null;
    }
    

    // Check for mouse hover and style appropriately:

    for (var j = 0; j < CONFIG.arrays.tilesArr.length; j++) {
        if (CONFIG.arrays.tilesArr[j].isUnderMouse(mouseX, mouseY) && !CONFIG.arrays.tilesArr[j].isFaceUp){
            CONFIG.arrays.tilesArr[j].drawFaceDownHover();
        } else if (CONFIG.arrays.tilesArr[j].isFaceUp){
            CONFIG.arrays.tilesArr[j].drawFaceUp();
        } else {
            CONFIG.arrays.tilesArr[j].drawFaceDown();
        }
    }


    // Clear styles for clean redraw:

    noStroke();
    fill(UI_STYLES.PANEL_COLOUR[0],
         UI_STYLES.PANEL_COLOUR[1],
         UI_STYLES.PANEL_COLOUR[2]);
    rect(0, 0, 400, 38);
    rect(0, 350, 400, 50);
    stroke(0, 0, 0);


    // Check game has begun / ended and update start button appropriately:

    if (CONFIG.hasBegun) {
        fill (30, 112, 0);
        rect(CONFIG.UI.START_TIMER_BUTTON.X, CONFIG.UI.START_TIMER_BUTTON.Y, CONFIG.UI.START_TIMER_BUTTON.WIDTH, CONFIG.UI.START_TIMER_BUTTON.HEIGHT);
        fill(0,0,0);
        textSize(19);
        text(TEXT_LABELS.START_TIMER, CONFIG.UI.START_TIMER_BUTTON.X + 5, CONFIG.UI.START_TIMER_BUTTON.Y + 21);
    } else if (CONFIG.hasEnded){
        fill(UI_STYLES.CARD_FACE_COLOUR[0],
             UI_STYLES.CARD_FACE_COLOUR[1],
             UI_STYLES.CARD_FACE_COLOUR[2]);
        rect(CONFIG.UI.START_TIMER_BUTTON.X, CONFIG.UI.START_TIMER_BUTTON.Y, CONFIG.UI.START_TIMER_BUTTON.WIDTH, CONFIG.UI.START_TIMER_BUTTON.HEIGHT);
        fill(0, 0, 0);
        textSize(19);
        text (TEXT_LABELS.NEW_GAME, CONFIG.UI.START_TIMER_BUTTON.X + 5, CONFIG.UI.START_TIMER_BUTTON.Y + 21);
    } else {
        fill(UI_STYLES.CARD_FACE_COLOUR[0],
             UI_STYLES.CARD_FACE_COLOUR[1],
             UI_STYLES.CARD_FACE_COLOUR[2]);
        rect(CONFIG.UI.START_TIMER_BUTTON.X,CONFIG.UI.START_TIMER_BUTTON.Y, CONFIG.UI.START_TIMER_BUTTON.WIDTH, CONFIG.UI.START_TIMER_BUTTON.HEIGHT);
        fill(0,0,0);
        textSize(19);
        text(TEXT_LABELS.START_TIMER, CONFIG.UI.START_TIMER_BUTTON.X + 5, CONFIG.UI.START_TIMER_BUTTON.Y + 21);
    }
    

    // Update current fill colour:

    fill(0, 0, 0);


    // if we clicked the start button start counting

    if (CONFIG.hasBegun) {
        CONFIG.stats.timeValues.currentTime = round((millis() - CONFIG.stats.timeValues.startTime) / 1000);
    }


    // Print time elapsed:

    text(TEXT_LABELS.CURRENT_TIME + CONFIG.stats.timeValues.currentTime + TEXT_LABELS.SECONDS_LABEL, 300, 30);
    

    // Print number of tries:

    text(TEXT_LABELS.NUMBER_OF_TRIES + CONFIG.stats.numberOfTries, 20, 30);
    

    // Print high scores:

    fill(UI_STYLES.TEXT_COLOUR[0],
         UI_STYLES.TEXT_COLOUR[1],
         UI_STYLES.TEXT_COLOUR[2]);
         
    textSize(UI_STYLES.TEXT_SIZE);
    text(TEXT_LABELS.RECORD_TRIES + CONFIG.stats.highscore.time + '       |       ' + TEXT_LABELS.RECORD_TIME + CONFIG.stats.highscore.tries, width/2/2/2, 375);
};