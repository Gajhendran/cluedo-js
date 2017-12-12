// Server bedrock
var express = require('express');
var sio  = require('socket.io');
var app = express();
app.use(express.static('client'));

// Setup function
var server = app.listen(process.env.PORT, function(){
    console.log('Started serving');
    generateBoard();
    //console.log("Generated board");
    hold[0] = new Item("character", "Reverend Green", 0, 255, 0, 6, 0);
    board[6][0].hold = 0;
    board[6][0].obstacle = true;
    //console.log("Placed characters");
});

// Start listening
var io = sio.listen(server);
var socketConnections = 0;

// On new connection/disconnection
io.sockets.on('connection', function(socket){
    console.log('New connection: ' + socket.id);
    socketConnections++;
    console.log('Number of connections: ' + socketConnections);
    socket.on('disconnect', function(){
        console.log('User disconnected: ' + socket.id);
        socketConnections--;
        console.log('Number of connections: ' + socketConnections);
    });
});


// Global board variables
const COLS = 20;
const ROWS = 20;
var board = undefined;
var characters = 1;
var hold = new Array(characters);
// Objects
function Cell(i, j) {
    this.i = i;
    this.j = j;
    // Pathfinding variables
    this.f = 0;
    this.g = 0;
    this.h = 0;
    this.n = [];
    // Because cells by default hold nothing
    this.hold = -1;
    // Drqw cell
    this.show = function() {
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
    this.pathInit = function() {
        this.n = [];
        if (this.i < COLS - 1) {
            this.n.push(board[this.i + 1][j])
        }
        if (this.i > 0) {
            this.n.push(board[this.i - 1][j])
        }
        if (this.j < ROWS - 1) {
            this.n.push(board[this.i][j + 1])
        }
        if (this.j > 0) {
            this.n.push(board[this.i][j - 1])
        }
        this.f = 0;
        this.g = 0;
        this.h = 0;
    }
}
function Item(type, name, red, green, blue, i, j) {
    this.type = type;
    this.name = name;
    this.r = red;
    this.g = green;
    this.b = blue;
    this.i = i;
    this.j = j;
    this.show = function() {
        gridGraphics.fill(this.r, this.g, this.b);
        gridGraphics.stroke(0);
        gridGraphics.rect(this.i * (GRID_WIDTH / COLS), this.j * (GRID_HEIGHT / ROWS), (GRID_WIDTH / COLS) - 1, (GRID_HEIGHT / ROWS) - 1);
    }
}
// Return fresh board
function generateBoard() {
    // Wipe board and create array
    board = undefined;
    board = new Array(COLS);
     // Making a 2D array
    for (var i = 0; i < COLS; i++) { board[i] = new Array(ROWS); }
    // Creating cell objects
    for (var i = 0; i < COLS; i++) {
        for (var j = 0; j < ROWS; j++) { board[i][j] = new Cell(i, j); }
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
    return board;
}
function horizontalObstacleLine(start, end) {
    var length = end.i - start.i
    for (var i = 0; i <= length; i++) {
        board[start.i + i][start.j].obstacle = true;
    }
}
function verticalObstacleLine(start, end) {
    var length = end.j - start.j
    for (var i = 0; i <= length; i++) {
        board[start.i][start.j + i].obstacle = true;
    }
}