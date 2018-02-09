// Declaring variables & constants & objects
var canvas = undefined;
const CANVAS_WIDTH = 480 + 480 ;
const CANVAS_HEIGHT = 504;
const COLS = 20;
const ROWS = 20;
var board = new Array(COLS);
var gridGraphics = undefined;
const GRID_WIDTH = 480;
const GRID_HEIGHT = 480;
var charactersGraphics = undefined;
const CHARACTERS_WIDTH = 480;
const CHARACTERS_HEIGHT = 24;
var characters = 1;
var hold = undefined;
var rollValue = 6;
var currentCharacter = 0;
var gameState = undefined;
const MAJOR_MISC_WIDTH = 480;
const MAJOR_MISC_HEIGHT = 480;
var socket = io.connect("https://cluedo-js-tomkuson.c9users.io");
var clientCharacter = undefined;
var connections = 1;
var readyStatus = "NOT READY";
var readyClients = 0;
var gotClientHoldValue = false;
var clientHand = [];
var movedPeice = false;
var selectingScenario = false;
var scenarioContext = undefined;
var scenario = ["", "", ""];
var suspectCards = ['Colonel Mustard', 'Professor Plum', 'Mr Green', 'Mrs Peacock', 'Miss Scarlet', 'Dr Orchid'];
var weaponCards = ['Knife', 'Candlestick', 'Revolver', 'Rope', 'Lead pipe', 'Spanner'];
var roomCards = ['Hall', 'Lounge', 'Dining room', 'Kitchen', 'Ballroom', 'Conservatory', 'Billiard room', 'Library', 'Study'];
var pickFrom = ["", "", ""];
var pickingCards = false;
const ROOM_CONST = 1;
var rooms = new Array(ROOM_CONST);

function Cell(i, j) 
{
        // Cell position
        this.i = i;
        this.j = j;
        // Pathfinding variables
        this.f = this.g = this.h = 0;
        this.n = [];
        // Not an obstacle by default
        this.obstacle = false;
        // Cell holds nothing by default
        this.hold = -1;
        // Show the cell
        this.show = function() 
        {
                gridGraphics.fill(255);
                gridGraphics.stroke(0);
                if (this.hold == -1) {
                        gridGraphics.strokeWeight(0.5);
                        gridGraphics.rect(this.i * (GRID_WIDTH / COLS), this.j * (GRID_HEIGHT / ROWS), (GRID_WIDTH / COLS) - 1, (GRID_HEIGHT / ROWS) - 1);
                } else {
                        hold[this.hold].show();
                }
        }
        // Reset pathfinding variables
        this.pathInit = function() 
        {
                this.n = [];
                if (this.i < COLS - 1) {
                        this.n.push(board[this.i + 1][j]);
                }
                if (this.i > 0) {
                        this.n.push(board[this.i - 1][j]);
                }
                if (this.j < ROWS - 1) {
                        this.n.push(board[this.i][j + 1]);
                }
                if (this.j > 0) {
                        this.n.push(board[this.i][j - 1]);
                }
                this.f = this.g = this.h = 0;
        }
}
function Item(type, name, red, green, blue, i, j) 
{
        this.type = type;
        this.name = name;
        this.r = red;
        this.g = green;
        this.b = blue;
        this.i = i;
        this.j = j;
        // Show item
        this.show = function() 
        {
                gridGraphics.fill(this.r, this.g, this.b);
                gridGraphics.noStroke;
                gridGraphics.strokeWeight(0);
                gridGraphics.rect(this.i * (GRID_WIDTH / COLS), this.j * (GRID_HEIGHT / ROWS), (GRID_WIDTH / COLS) - 1, (GRID_HEIGHT / ROWS) - 1);
        }
}
function Room(name, index, doors, x1, y1, x2, y2)
{
        this.name = name;
        this.index = index;
        this.characters = [];
        this.doors = doors;
        this.doorOne = [x1, y1];
        this.doorTwo = [x2, y2];
        this.enter = function(character) 
        {
                if (this.characters.indexOf(character) == -1) {
                        this.characters.push(character)
                        console.log("Entered study")
                }
        };
        this.leave = function(character)
        {
                removeFromArray(this.characters, character);
        }
        this.show = function()
        {
                if (this.name == "Study") {
                        if (this.characters.indexOf(currentCharacter) > -1) {
                                console.log("Draw in study");
                                gridGraphics.fill(hold[currentCharacter].r, hold[currentCharacter].g, hold[currentCharacter].b);
                                gridGraphics.stroke(0);
                                gridGraphics.rect(4 * (GRID_WIDTH / COLS), 1 * (GRID_HEIGHT / ROWS), (GRID_WIDTH / COLS) - 1, (GRID_HEIGHT / ROWS) - 1);
                        };
                };
        };
        this.pathFrom = function(i, j, roll)
        {
                if (doors == 1) {
                        console.log("one door");
                        if (path( board[this.doorOne[0]][this.doorOne[1]] , board[i][j]) <= roll -1) {
                                return true;
                        } else {
                                return false;
                        }
                } else if ((path(board[this.doorOne[0]][this.doorOne[1]], board[i][j]) <= roll -1) || (path(board[this.doorTwo[0]][this.doorTwo[1]], board[i][j]) <= roll -1)) {
                        return true;
                } else {
                        return false;
                }
        };
};
// Load game assets
function preload() 
{
        console.log("Fetching assets...");
        socket.on('newState', function(newState)
        {
                gameState = newState;
        });
        socket.emit('gatherGameState');
        console.log("Placing listeners...");
        socket.on('startGame', function(players)
        {
                startGame(players);
                gameState = 'inProgress';
                socket.emit('getClientCharacter');
        });
        socket.on('newClientCharacter', function(holdValue)
        {
                clientCharacter = holdValue;
                console.log('client character ' + clientCharacter);
                gotClientHoldValue = true;
                
        });
        socket.on('clientMoveItem', function(index, x, y)
        {
                // Empty the cell holding bay
                board[hold[index].i][hold[index].j].hold = -1;
                // Set old cell obstacle value to false
                board[hold[index].i][hold[index].j].obstacle = false;
                // Change the x-pos and y-pos of the item
                hold[index].i = x;
                hold[index].j = y;
                // Place the item in the new cell holding bay
                board[x][y].hold = index;
                // Set new cell obstacle value to true
                board[x][y].obstacle = true;
                movedPeice = true;
        });
        socket.on('currentCharacterUpdate', function(update)
        {
                currentCharacter = update;
                movedPeice = false;
                scenario = ["", "", ""];
        });
        socket.on('connectionsUpdate', function(update)
        {
                connections = update;
        });
        socket.on('readyClients', function(update)
        {
                readyClients = update;
        })
        socket.on('rollValue', function(roll)
        {
                rollValue = roll;
                console.log('New roll value from server: ' + rollValue);
        });
        socket.on('newCard', function(card)
        {
                clientHand.push(card);
        });
        socket.on('accusationCorrect', function()
        {
                window.alert(hold[currentCharacter].name + ' wins the game!');
                selectingScenario = false;

        });
        socket.on('accusationIncorrect', function()
        {
                window.alert(hold[currentCharacter].name + ' is out of the game after a false accusation...');
                selectingScenario = false;
        });
        socket.on('noCardsFound', function(name, suspect, weapon, room)
        {
                window.alert(name + " suggested " + suspect + " with " + weapon + " in " + room + " and found no one with those cards");
        });
        socket.on('pickCard', function (name, suspect, weapon, room)
        {
                window.alert(name + " suggested " + suspect + " with " + weapon + " in " + room + ", please pick card to show player");
                pickFrom[0] = suspect;
                pickFrom[1] = weapon;
                pickFrom[2] = room;
                pickingCards = true;
        });
        socket.on('showCard', function(card, index)
        {
                window.alert(hold[index].name + " shows you card " + card);
        })

}

// Setup game    
function setup()
{
        console.log("Setting up...")
        // Init graphic canvas and buffers
        canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
        gridGraphics = createGraphics(GRID_WIDTH, GRID_HEIGHT);
        charactersGraphics = createGraphics(CHARACTERS_WIDTH, CHARACTERS_HEIGHT);
        majorMiscGraphics = createGraphics(MAJOR_MISC_WIDTH, MAJOR_MISC_HEIGHT);
        // Generate board
        generateBoard();
        console.log("Setup complete")
}
function startGame(players)
{
        characters = players;
        hold = new Array(characters);
        if (players > 0) {
                hold[0] = new Item("character", "Reverend Green", 0, 255, 0, 6, 0);
                board[6][0].hold = 0;
                board[6][0].obstacle = true;    
        } if (players > 1) {
                hold[1] = new Item("character", "Miss Scarlet", 255, 36, 0, 12, 0);
                board[12][0].hold = 1;
                board[12][0].obstacle = true;
        } if (players > 2) {
                hold[2] = new Item("character", "Mrs Peacock", 9, 84, 190, 6, 19);
                board[6][19].hold = 2;
                board[6][19].obstacle = true;
        }
        rooms[0] = new Room("Study", 0, 1, 5, 3);
}
function generateBoard() 
{
        // Making a 2D array
        for (var i = 0; i < COLS; i++) {
                board[i] = new Array(ROWS);
        }
        // Creating cell objects
        for (var i = 0; i < COLS; i++) {
                for (var j = 0; j < ROWS; j++) {
                        board[i][j] = new Cell(i, j);
                }
        }
        // Outline the map
        horizontalObstacleLine(board[0][2], board[5][2]);
        verticalObstacleLine(board[5][0], board[5][2]);
        verticalObstacleLine(board[8][0], board[8][5]);
        horizontalObstacleLine(board[8][5], board[11][5]);
        verticalObstacleLine(board[11][0], board[11][5]);
        verticalObstacleLine(board[14][0], board[14][4]);
        horizontalObstacleLine(board[14][4], board[19][4]);
        horizontalObstacleLine(board[0][5], board[4][5]);
        verticalObstacleLine(board[5][6], board[5][8]);
        horizontalObstacleLine(board[0][9], board[4][9]);
        verticalObstacleLine(board[8][7], board[8][11]);
        horizontalObstacleLine(board[8][7], board[11][7]);
        verticalObstacleLine(board[11][7], board[11][11]);
        horizontalObstacleLine(board[8][11], board[11][11]);
        verticalObstacleLine(board[14][8], board[14][11]);
        horizontalObstacleLine(board[14][8], board[19][8]);
        horizontalObstacleLine(board[14][11], board[19][11]);
        horizontalObstacleLine(board[0][11], board[5][11]);
        verticalObstacleLine(board[5][11], board[5][14]);
        horizontalObstacleLine(board[0][14], board[5][14]);
        horizontalObstacleLine(board[0][17], board[4][17]);
        verticalObstacleLine(board[5][18], board[5][19]);
        horizontalObstacleLine(board[8][14], board[13][14]);
        verticalObstacleLine(board[8][14], board[8][19]);
        verticalObstacleLine(board[13][14], board[13][19]);
        horizontalObstacleLine(board[16][15], board[19][15]);
        verticalObstacleLine(board[16][15], board[16][19]);
}
function horizontalObstacleLine(start, end) 
{
        var length = end.i - start.i
        for (i = 0; i <= length; i++) {
                board[start.i + i][start.j].obstacle = true;
        }
}
function verticalObstacleLine(start, end) 
{
        var length = end.j - start.j
        for (i = 0; i <= length; i++) {
                board[start.i][start.j + i].obstacle = true;
        }
}

// Draw graphics
function draw() 
{
        // Draw board
        for (var i = 0; i < COLS; i++) {
                for (var j = 0; j < ROWS; j++) { 
                        board[i][j].show(); 
                }
        }
        drawBoardDetails();
        // Draw game details
        if (gameState == "inProgress") {
                // Highlight where the player can go
                if (mouseX < 480 && mouseY < 480 && currentCharacter == clientCharacter && !movedPeice) {
                        var x = Math.floor(mouseX / 480 * COLS);
                        var y = Math.floor(mouseY / 480 * ROWS);
                        if (path(board[hold[currentCharacter].i][hold[currentCharacter].j] , board[x][y]) <= rollValue && board[x][y].obstacle == false) {
                                gridGraphics.fill(hold[currentCharacter].r, hold[currentCharacter].g, hold[currentCharacter].b, 72);
                                gridGraphics.rect(x * (GRID_WIDTH / COLS), y * (GRID_HEIGHT / ROWS), (GRID_WIDTH / COLS) - 1, (GRID_HEIGHT / ROWS) - 1);
                        }
                }
                // Character ticker
                charactersGraphics.background(255);
                for (var i = 0; i < characters; i++) {
                        ellipseMode(CENTER);
                        if (i == currentCharacter) {
                                charactersGraphics.fill(hold[i].r, hold[i].g, hold[i].b);
                        } else {
                                charactersGraphics.fill(hold[i].r, hold[i].g, hold[i].b, 72);
                        }
                        charactersGraphics.ellipse((12 + 24 * i), 12, 20);
                }
                // Ticker text
                charactersGraphics.fill(0, 0, 0, 255);
                charactersGraphics.text(hold[currentCharacter].name + "'s turn", 12 + 24 * characters, 18);
                // Next turn
                if (currentCharacter == clientCharacter) {
                        charactersGraphics.text("End turn", 400, 18);
                }
        }
        // Draw major misc
        majorMiscGraphics.background(255);
        if (gameState == "notReady") {
                majorMiscGraphics.text(readyClients + ' out of ' + connections + ' clients are ready', 30, 30);
                majorMiscGraphics.text('Game will start when all players are ready', 30, 50);
                majorMiscGraphics.text('Click READY when you are ready to play', 30, 70);
                majorMiscGraphics.text('Your client status: ' + readyStatus, 30, 90);
                if (readyStatus == "NOT READY") {
                        majorMiscGraphics.text('Click here say you are ready!', 60, 130);
                }
        }
        if (gameState == "inProgress" && gotClientHoldValue) {
                if (selectingScenario) {
                        majorMiscGraphics.text('MAKING ACCUSATION', 30, 30);
                        majorMiscGraphics.text('Selection ONE card from each category', 30, 50);
                        if (scenario[0].length < 1) {
                                // List suspects
                                for (var i = 0; i < suspectCards.length; i++) {
                                        majorMiscGraphics.text(suspectCards[i], 60, 70 + 20*i);
                                }
                        } else if (scenario[1].length < 1) {
                                // List weapons
                                for (var i = 0; i < weaponCards.length; i++) {
                                        majorMiscGraphics.text(weaponCards[i], 60, 70 + 20*i);
                                }
                        } else if (scenario[2].length < 1) {
                                // List rooms
                                for (var i = 0; i < roomCards.length; i++) {
                                        majorMiscGraphics.text(roomCards[i], 60, 70 + 20*i);
                                }
                        } else {
                                // Error, all cards already chosen
                                majorMiscGraphics.text('All scenario cards chosen, please wait...', 30, 70);
                        }
                } else if (pickingCards) {
                        majorMiscGraphics.text('Pick a card to privately show to ' + hold[currentCharacter].name, 30, 30);
                        for (var i = 0; i < pickFrom.length; i++) {
                                majorMiscGraphics.text(pickFrom[i], 50, 50 + 20 * i);
                        }
                        
                } else {
                        majorMiscGraphics.text('Game started with ' + characters + ' number of players', 30, 30);
                        majorMiscGraphics.text('Your character is ' + hold[clientCharacter].name, 30, 50);
                        if (clientCharacter == currentCharacter) {
                                majorMiscGraphics.text('You rolled a ' + rollValue, 30, 70);
                        } else {
                                majorMiscGraphics.text(hold[currentCharacter].name + ' rolled a ' + rollValue, 30, 70);
                        }
                        majorMiscGraphics.text('The cards in your (private) hand are:', 30, 90);
                        for (var i = 0; i < clientHand.length; i++) {
                                majorMiscGraphics.text(clientHand[i], 50, 110 + i*20);
                        }
                        majorMiscGraphics.text('Click here to MAKE AN SUGGESTION (one per turn)', 30, 110 + clientHand.length * 20 + 20);
                        majorMiscGraphics.text('Click here to MAKE A ACCUSATION (may end game)', 30, 110 + clientHand.length * 20 + 40);
                }
        }
        // Draw rooms
        if (gameState == "inProgress") {
                for (var i = 0; i < ROOM_CONST; i++) {
                        rooms[i].show();
                }
        };
        image(gridGraphics, 0, 0);
        image(charactersGraphics, 0, 480);
        image(majorMiscGraphics, 480, 0);
}
function drawBoardDetails() 
{
        // Study
        gridGraphics.fill(0, 0, 0);
        gridGraphics.strokeWeight(1);
        gridGraphics.line(144 -1, 0 -1, 144 -1, 72 -1);
        gridGraphics.line(0 -1, 72 -1, 144 -1, 72 -1);
        gridGraphics.fill(255);
        gridGraphics.rect(0 -1, 0 -1, 144 -1, 72 -1);
        // Hall
        gridGraphics.fill(0, 0, 0);
        gridGraphics.line(192 , 0 , 192 , 144 - 1);
        gridGraphics.line(288-1, 0 , 288-1, 144 - 1);
        gridGraphics.line(192 - 1, 144 - 2, 288 - 1, 144 - 2);
        gridGraphics.fill(255);
        gridGraphics.rect( 192  , 0 - 1, 96 - 2, 144 - 1);
        // Lounge
        gridGraphics.fill(0, 0, 0);
        gridGraphics.line(336, 0, 336, 120 -1);
        gridGraphics.line(336, 120-1, 480, 120-1);
        gridGraphics.fill(255);
        gridGraphics.rect(336, 0 -1, 144 -1, 120-1);
        // Envolope
        gridGraphics.fill(85,107,47);
        gridGraphics.rect(192 -1, 168-1, 96, 120);
        gridGraphics.strokeWeight(1);
        // Library
        gridGraphics.fill(0,0,0);
        gridGraphics.line(0, 120, 120 - 1, 120);
        gridGraphics.line(120 -2, 120, 120 -2, 144);
        gridGraphics.line(120 -1, 144, 144-1, 144);
        gridGraphics.line(144-2, 144, 144-2, 216 -1);
        gridGraphics.line(144 -2, 216-2, 120-2, 216-2);
        gridGraphics.line(120-2, 216-2, 120-2, 240-2);
        gridGraphics.line(0 -1, 240-2, 120-1, 240-2);
        gridGraphics.fill(255);
        gridGraphics.rect(-1, 120, 120-1, 120 -2);
        gridGraphics.stroke(255);
        gridGraphics.rect(120-3, 144+1, 24, 72-4);
        // Dining room
        gridGraphics.fill(0);
        gridGraphics.stroke(0);
        gridGraphics.line(336, 192, 480, 192);
        gridGraphics.line(336, 192, 336, 288 -1);
        gridGraphics.line(336, 288 -2, 480, 288 -2);
        gridGraphics.fill(255);
        gridGraphics.rect(336, 192, 144 -1, 96 -2);
        // Billiard room
        gridGraphics.fill(0);
        gridGraphics.line(0, 264, 144 -1, 264);
        gridGraphics.line(144 -2, 264, 144-2, 360 -1);
        gridGraphics.line(0, 360 -2, 144 -2, 360 -2);
        gridGraphics.fill(255);
        gridGraphics.rect(0 -1, 264, 144 -1, 96 -2);
        // Conservatory
        gridGraphics.fill(0);
        gridGraphics.line(0, 408, 120, 408);
        gridGraphics.line(120, 408, 120, 432);
        gridGraphics.line(120, 432, 144 -1, 432);
        gridGraphics.line(144 -2, 432, 144 -2, 480);
        gridGraphics.fill(255);
        gridGraphics.stroke(255);
        gridGraphics.rect(0, 408+1, 120 -2, 72 -3);
        gridGraphics.rect(120 -2, 432 +1 , 24 -1, 48 -3);
        // Ballroom
        gridGraphics.fill(0);
        gridGraphics.stroke(0);
        gridGraphics.line(192, 360, 312 -1, 360);
        gridGraphics.line(312 -2, 360, 312 -2, 480);
        gridGraphics.line(192, 360, 192, 480);
        gridGraphics.fill(255);
        gridGraphics.rect(192, 336, 144 -2, 144 -1);
        // Kitchen
        gridGraphics.fill(0);
        gridGraphics.line(384, 360, 480, 360);
        gridGraphics.line(384, 360, 384, 480);
        gridGraphics.fill(255);
        gridGraphics.rect(384, 360, 96 -1, 120 -1);
        // Text
        gridGraphics.noFill();
        gridGraphics.noStroke();
        gridGraphics.textSize(12);
        gridGraphics.stroke(0);
        gridGraphics.text("Study", 10, 20);
        gridGraphics.text("Hall", 200, 20);
        gridGraphics.text("Lounge", 420, 20);
        gridGraphics.text("Library", 10, 140);
        gridGraphics.text("Dining room", 400, 210);
        gridGraphics.text("Billiard room", 10, 280);
        gridGraphics.text("Conservatory", 10, 425);
        gridGraphics.text("Ballroom", 200, 360);
        gridGraphics.text("Kitchen", 400, 380);
        // Doors
        gridGraphics.stroke(255, 255, 255);
        gridGraphics.strokeWeight(4);
        gridGraphics.line(120 +2, 72 -1, 144 -2, 72 -1);
        gridGraphics.line(216, 144 -1, 240, 144 -1);
        gridGraphics.line(288 -1, 96, 288 -1, 120);
        gridGraphics.line(336, 120, 360, 120);
        gridGraphics.line(384, 192, 408, 192);
        gridGraphics.line(336, 216, 336, 240);
        gridGraphics.line(144, 168, 144, 192);
        gridGraphics.line(24, 240, 48, 240);
        gridGraphics.line(48, 264, 72, 264);
        gridGraphics.line(144, 312, 144, 336);
        gridGraphics.line(120, 432, 144, 432);
        gridGraphics.line(264, 336, 288, 336);
        gridGraphics.line(336, 360, 336, 384);
        gridGraphics.line(408, 360, 432, 360);
}
function mousePressed() 
{
        if (mouseX < 480 && mouseY < 480) {
                // Calculate the x-pos and y-pos of the mouse with respect to the grid
                var x = Math.floor(mouseX / 480 * COLS);
                var y = Math.floor(mouseY / 480 * ROWS);
                // If path short enough with respect to roll value and destination not an obstacle, move item
                if ( path(board[hold[currentCharacter].i][hold[currentCharacter].j] , board[x][y]) <= rollValue && board[x][y].obstacle == false && currentCharacter == clientCharacter && !movedPeice) {
                        socket.emit('moveItem',currentCharacter, x, y);
                } else if (( x == 5 && y == 2) && path(board[hold[currentCharacter].i][hold[currentCharacter].j] , board[5][3]) <= rollValue - 1) { // Study
                        //socket.emit('enterRoom', currentCharacter, 'Study', 0);
                        console.log(rooms[0].pathFrom(6, 0, 6));
                }
        }
        // Ready game
        if (gameState == "notReady") {
                if (mouseX > 480 + 55 && mouseX < 480 + 55 + 200 && mouseY > 110 && mouseY < 135) {
                        socket.emit('readyGame');
                        readyStatus = "READY";
                }
        }
        // Next turn
        if (mouseX > 390 && mouseX < 460 && mouseY > 480 && clientCharacter == currentCharacter && gameState == 'inProgress') {
                socket.emit('nextTurn');
        }
        // Major Misc
        if (!selectingScenario && !pickingCards) {
                if (mouseX > 480 + 30 && mouseX < 480 + 30 + 300 && mouseY > 110 + clientHand.length * 20 + 20 && mouseY < 110 + clientHand.length * 20 + 40 && currentCharacter == clientCharacter) {
                        // Make an accusation
                        scenarioContext = "accusation";
                        selectingScenario = true;
                }
                if (mouseX > 480 + 30 && mouseX < 480 + 30 + 300 && mouseY > 110 + clientHand.length * 20 && mouseY < 110 + clientHand.length * 20 + 20 && currentCharacter == clientCharacter) {
                        // Make a mere suggestion
                        scenarioContext = "suggestion";
                        selectingScenario = true;
                }
        } else if (pickingCards) {
                if (mouseX > 540 && mouseX < 700 && mouseY > 30 && mouseY < pickFrom.length * 20 + 35) {
                        var index = Math.floor((mouseY - 35)/20);
                        if (isInArray(clientHand, pickFrom[index])) {
                                socket.emit('pickedCard', pickFrom[index]);
                                pickingCards = false;
                                pickFrom = ["", "", ""];
                        }
                }
        } else {
                // Chose cards
                if (scenario[0].length < 1) {
                        // Chosing a suspect
                        if (mouseX > 540 && mouseX < 700 && mouseY > 50 && mouseY < suspectCards.length * 20 + 55) {
                                var index = Math.floor((mouseY - 55)/20);
                                scenario[0] = suspectCards[index];
                        }
                } else if (scenario[1].length < 1) {
                        // Chosing a weapon
                        if (mouseX > 540 && mouseX < 700 && mouseY > 50 && mouseY < weaponCards.length * 20 + 55) {
                                var index = Math.floor((mouseY - 55)/20);
                                scenario[1] = weaponCards[index];
                        }
                } else if (scenario[2].length < 2) {
                        // Chosing a room
                        if (mouseX > 540 && mouseX < 700 && mouseY > 50 && mouseY < roomCards.length * 20 + 55) {
                                var index = Math.floor((mouseY - 55)/20);
                                scenario[2] = roomCards[index];
                                if (scenarioContext == "accusation") {
                                        socket.emit('makeAccusation', scenario[0], scenario[1], scenario[2]);
                                } else if (scenarioContext == "suggestion") {
                                        socket.emit("makeSuggestion", scenario[0], scenario[1], scenario[2]);
                                        selectingScenario = false;
                                }
                        }
                }
        }
}
function isInArray(array, elt) 
{
        return array.indexOf(elt) > -1;
}

// Pathfinding algorithms
function path(start, end) 
{
        // Initialise pathfinding variables
        for (var i = 0; i < COLS; i++) { 
                for (var j = 0; j < ROWS; j++) { 
                        board[i][j].pathInit(); 
                } 
        }
        var openSet = [];
        var closedSet = [];
        openSet.push(start);
        // Keep searching until no more left
        while (openSet.length > 0) {
                var lowestIndex = 0;
                for (var i = 0; i < openSet.length; i++) {
                        if (openSet[i].f < openSet[lowestIndex].f) {
                                lowestIndex = i;
                        }
                }
                var current = openSet[lowestIndex];
                if (openSet[lowestIndex] == end) {
                        // Shortest path found, return length
                        return openSet[lowestIndex].f;
                }
                removeFromArray(openSet, current);
                closedSet.push(current);
                var neighbours = current.n;
                for (var i = 0; i < neighbours.length; i++) {
                        var neighbour = neighbours[i];
                        if (!closedSet.includes(neighbour) && !neighbour.obstacle) {
                                var tentative_g = current.g + 1;
                                if (openSet.includes(neighbour)) {
                                        if (tentative_g < neighbour.g) {
                                                neighbour.g = tentative_g;
                                        }
                                } else {
                                        neighbour.g = tentative_g;
                                        openSet.push(neighbour);
                                }
                        neighbour.h = heuristic(neighbour, end);
                        neighbour.f = neighbour.g + neighbour.h;
                        }
                }
        }
        // No path found, return extreme length
        return 100;
}
function heuristic (a, b)
{
        // Manhattan heuristic
        return abs(a.i-b.i) + abs(a.j-a.j);
}
function removeFromArray (array, item) 
{
        // Go backwards through array, remove any items that are the same of the item passed
        for (var i = array.length - 1; i >= 0; i--) {
                if (array[i] == item) {
                        array.splice(i, 1);
                }
        }
}