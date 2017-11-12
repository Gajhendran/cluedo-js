// Variables that must persist throught program

var canvas = undefined;
const CANVAS_WIDTH = 480;
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

var characters = 4;
var hold = new Array(characters);
var rollValue = 6;
var currentCharacter = 0;

// Cell object
function Cell(i, j) {
    // Cell position
    this.i = i;
    this.j = j;
    // Pathfinding variables
    this.f = 0;
    this.g = 0;
    this.h = 0;
    this.n = [];
    // Not an obstacle be default
    this.obstacle = false;
    
    // Random obstacles for testing
    //if (0.1 > random()) {
    //    this.obstacle = true;
    //}
    
       this.hold = -1;
    
    this.show = function() {
        gridGraphics.fill(255);
        gridGraphics.stroke(0);
        if (this.obstacle == true) {
            gridGraphics.fill(0);
        }
        if (this.hold == -1) {
            gridGraphics.strokeWeight(0.5);
            gridGraphics.rect(this.i * (GRID_WIDTH / COLS), this.j * (GRID_HEIGHT / ROWS), (GRID_WIDTH / COLS) - 1, (GRID_HEIGHT / ROWS) - 1);
        } else {
            hold[this.hold].show();
        }
    }
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

function setup() {
    
    console.log("Starting client.js")
    
    // Init graphic canvas and buffers
    canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    gridGraphics = createGraphics(GRID_WIDTH, GRID_HEIGHT);
    charactersGraphics = createGraphics(CHARACTERS_WIDTH, CHARACTERS_HEIGHT);
    
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
    
    hold[0] = new Item("character", "Reverend Green", 0, 255, 0, 1, 1);
    board[1][1].hold = 0;
    board[1][1].obstacle = true;
    
    
    hold[1] = new Item("character", "Prof. Plum", 160, 32, 240, 18, 1);
    board[18][1].hold = 1;
    board[18][1].obstacle = true;
    
    hold[2] = new Item("character", "Miss Scarlet", 255, 36, 0, 1, 18);
    board[1][18].hold = 2;
    board[18][1].obstacle = true;
    
    hold[3] = new Item("character", "Mrs. Peacock", 0, 0, 255, 18, 18);
    board[18][18].hold = 3;
    board[18][18].obstacle = true;
    
    
    console.log("Setup complete")
}

function draw() {
    
    charactersGraphics.clear();
    
    // Tell each cell to show itself
    for (var i = 0; i < COLS; i++) {
        for (var j = 0; j < ROWS; j++) {
            board[i][j].show();
        }
    }
    
    // Highlight where the player can go
    if (mouseX < 480 && mouseY < 480) {
        var x = Math.floor(mouseX / 480 * COLS);
        var y = Math.floor(mouseY / 480 * ROWS);
        if (path(board[hold[currentCharacter].i][hold[currentCharacter].j] , board[x][y]) <= rollValue && board[x][y].obstacle == false) {
            gridGraphics.fill(hold[currentCharacter].r, hold[currentCharacter].g, hold[currentCharacter].b, 72);
            gridGraphics.stroke(0);
            gridGraphics.rect(x * (GRID_WIDTH / COLS), y * (GRID_HEIGHT / ROWS), (GRID_WIDTH / COLS) - 1, (GRID_HEIGHT / ROWS) - 1);
        }
    }  
    
    // Character graphics
    for (var i = 0; i < characters; i++) {
        ellipseMode(CENTER);
        charactersGraphics.fill(255)
        charactersGraphics.ellipse(12 + 24 * i, 12, 20);
        if (i == currentCharacter) {
            charactersGraphics.fill(hold[i].r, hold[i].g, hold[i].b);
        } else {
            charactersGraphics.fill(hold[i].r, hold[i].g, hold[i].b, 72);
        }
        charactersGraphics.stroke(0);
        charactersGraphics.ellipse((12 + 24 * i), 12, 20);
    }
    
    
    image(gridGraphics, 0, 0);
    image(charactersGraphics, 0, 480);
    
}

function path(start, end) {
    // Initialise pathfinding variables
    for (var i = 0; i < COLS; i++) {
        for (var j = 0; j < ROWS; j++) {
            board[i][j].pathInit();
        }
    }
    var openSet = [];
    var closedSet = [];
    openSet.push(start);
    while (openSet.length > 0) {
        var lowestIndex = 0;
        for (var i = 0; i < openSet.length; i++) {
            if (openSet[i].f < openSet[lowestIndex].f) {
                lowestIndex = i;
            }
        }
        var current = openSet[lowestIndex];
        if (openSet[lowestIndex] == end) {
            // console.log("Shortest path found from (" + start.i + ", " + start.j + ") to (" + end.i + ", " + end.j + "), length " + openSet[lowestIndex].f);
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
    // No solution
    // console.log("No path found.")
    return 100;
}

function removeFromArray (array, item) {
    // Go backwards through array, remove any items that are the same of the item passed
    for (var i = array.length - 1; i >= 0; i--) {
        if (array[i] == item) {
            array.splice(i, 1);
        }
    }
}

function heuristic (a, b) {
    // Manhattan heuristic
    return abs(a.i-b.i) + abs(a.j-a.j);
}

function mousePressed() {
    if (mouseX < 480 && mouseY < 480) {
        // Calculate the x-pos and y-pos of the mouse with respect to the grid
        var x = Math.floor(mouseX / 480 * COLS);
        var y = Math.floor(mouseY / 480 * ROWS);
        // If path short enough with respect to roll value and destination not an obstacle, move item
        if ( path(board[hold[currentCharacter].i][hold[currentCharacter].j] , board[x][y]) <= rollValue && board[x][y].obstacle == false) {
            moveItem(currentCharacter, x, y);
        }
    } 
}

function moveItem(index, x, y) {
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
    
    if (currentCharacter < characters - 1) {
        currentCharacter++
    } else {
        currentCharacter = 0
    }
    
}