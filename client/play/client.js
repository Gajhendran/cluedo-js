var cols = 10;
var rows = 10;
var board = new Array(cols);
var characters = 1;
var hold = new Array(characters);

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
    if (0.4 > random()) {
        this.obstacle = true;
    }
    
    if (this.i == 0 && this.j == 0) {
        this.obstacle = false;
    }
    
    this.hold = -1;
    
    this.show = function() {
        fill(255);
        stroke(0);
        if (this.obstacle == true) {
            fill(0);
        }
        if (this.hold == -1) {
            rect(this.i * (width / cols), this.j * (height / rows), (width / cols) - 1, (height / rows) - 1);
        } else {
            hold[this.hold].show();
        }
    }
    this.pathInit = function() {
        this.n = [];
        if (this.i < cols - 1) {
            this.n.push(board[this.i + 1][j])
        }
        if (this.i > 0) {
            this.n.push(board[this.i - 1][j])
        }
        if (this.j < rows - 1) {
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

function Item(i, j) {
    this.i = i;
    this.j = j;
    
    this.show = function() {
        fill(0, 255, 0);
        stroke(0);
        rect(this.i * (width / cols), this.j * (height / rows), (width / cols) - 1, (height / rows) - 1);
    }
}

function setup() {
    console.log("Starting client.js")
    createCanvas(480, 480);
    // Making a 2D array
    for (var i = 0; i < cols; i++) {
        board[i] = new Array(rows);
    }
    // Creating cell objects
    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            board[i][j] = new Cell(i, j);
        }
    }
    
    hold[0] = new Item(0, 0);
    board[0][0].hold = 0;
    console.log(hold);
    console.log("Setup complete")
}

function draw() {
    // Tell each cell to show itself
    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            board[i][j].show();
        }
    }
}

function path(start, end) {
    // Initialise pathfinding variables
    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
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
            console.log("Shortest path found from (" + start.i + ", " + start.j + ") to (" + end.i + ", " + end.j + "), length " + openSet[lowestIndex].f);
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
    console.log("No path found.")
    return 100;
}

function removeFromArray (array, item) {
    for (var i = array.length - 1; i >= 0; i--) {
        if (array[i] == item) {
            array.splice(i, 1);
        }
    }
}

function heuristic (a, b) {
    return abs(a.i-b.i) + abs(a.j-a.j);
}

function mousePressed() {
    if (mouseX < 480 && mouseY < 480) {
        var x = Math.floor(mouseX / 480 * cols);
        var y = Math.floor(mouseY / 480 * rows);
        if ( path(board[hold[0].i][hold[0].j] , board[x][y]) <= 6 && board[x][y].obstacle == false) {
            moveItem(0, x, y);
        }
    }   
}

function moveItem(index, x, y) {
    board[hold[index].i][hold[index].j].hold = -1;
    hold[index].i = x;
    hold[index].j = y;
    board[x][y].hold = index;
}