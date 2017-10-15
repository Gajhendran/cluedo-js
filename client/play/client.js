//
// GLOBAL VARIABLES
var cols = 20;
var rows = 20;
var board = new Array(cols);
var chars = 2;
var characters = new Array(chars);
var current_char;
var open_set = [];
var closed_set = [];
var start;
var end;
var w, h;
var path = [];
var no_solution = false;


// 
// OBJECTS
function space(i, j) {
  this.i = i;
  this.j = j;
  this.hold = [];
  this.h = 0;
  this.g = 0;
  this.f = 0;
  this.neighbours = [];
  
  this.add_neighbours = function(board) {
    var i = this.i;
    var j = this.j;
    console.log();
    if (i < cols - 1) {
      this.neighbours.push(board[i + 1][j]);
    }
    if (i > 0) {
      this.neighbours.push(board[i - 1][j]);
    }
    if (j < rows - 1) {
      this.neighbours.push(board[i][j + 1]);
    }
    if (j > 0) {
      this.neighbours.push(board[i][j - 1])
    }
  }
}

function character(i, j, r, g, b) {
  
  this.i = i;
  this.j = j;
  this.r = r;
  this.g = g;
  this.b = b;
  this.visible = 1;
  
  this.paint = function() {
    if (this.visible == 1) {
     fill(color(r, g, b));
     noStroke;
     ellipse(this.i * w + 12, this.j * h + 12, w * 0.8, h * 0.8);
    }
  }
  
}


//
// SETUP
function setup() {
  
  console.log('Cluedo JS start');
  
  createCanvas(480, 480);

  
  w = width / cols;
  h = height / rows;
  for (var i = 0; i < cols; i++) {
    board[i] = new Array(rows);
  }
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      board[i][j] = new space(i, j);
    }
  }
  
  characters[0] = new character(0, 0, 255, 0, 0)
  characters[1] = new character(19, 19, 0, 0, 255)
  
  board[19][19].hold = 1;
  board[0][0].hold = 0;
  
  current_char = 0;
  
}

//
// DRAW
function draw() {
  
  // Draw grid
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      fill(255);
      rect(i * w, j * h, w-1, h-1);
    }
  }
  
  // Draw characters
  for (var i = 0; i < chars; i++) {
    characters[i].paint();
  }
}

//
// LISTENERS

function mousePressed() {
  // check cursor inside board
  if (cursor_inside(0, 0, 480, 480)) {
    var board_x = Math.floor(mouseX / 480 * 20);
    var board_y = Math.floor(mouseY / 480 * 20);
    move_character(board, board_x, board_y);
  }
}

//
// FUNCTIONS

function cursor_inside(x1, y1, x2, y2) {
  if (mouseX >= x1 && mouseY >= y1 && mouseX <= x2 && mouseY <= y2) {
    return true;
  } else {
    return false;
  }
}

function move_character(board, x, y) {
  var char = characters[current_char];
  if (pathfind(board, char, x, y)) {
    board[char.i][char.j] = [];
    char.i = x;
    char.j = y;
    board[x][y].hold = char;
    console.log(characters[0].i)
    console.log(characters[0].i)
  }
}

function pathfind(board, char, x, y) {
  
  start = board[char.i][char.j];
  end = board[x][y];
  open_set = [];
  closed_set = [];
  
  for (var i = 0; i < 20; i++) {
    for (var j = 0; j < 20; j++) {
      board[i][j].neighbours = [];
      board[i][j].add_neighbours(board);
    }
  }
  
  open_set.push(start);
  console.log(start)
  var over = false;
  
  while (open_set.length > 0 && over == false) {
    var best = 0;
    for (var i = 0; i < open_set.length; i++) {
      if (open_set[i].f < open_set[best].f) {
        best = i;
      }
    }
    
    var current = open_set[best];
    
    if (current == end) {
      // Find the path
      console.log('FIND PATH')
      if (!no_solution) {
        path = [];
        var temp = current;
        path.push(temp);
        while (temp.previous) {
          path.push(temp.previous);
          temp = temp.previous;
        }
        console.log("DONE!");
        console.log(current.f);
        over = false;
        return true;
      }
    }
    
    removeFromArray(open_set, current);
    closed_set.push(current);
    
    var neighbours = current.neighbours;
    for (var i = 0; i < neighbours.length; i++) {
      var neighbour = neighbours[i];
      if (!closed_set.includes(neighbour) && !neighbour.avoid) {
        var temp_g = current.g + 1;
        if (open_set.includes(neighbour)) {
          if (temp_g < neighbour.g) {
            neighbour.g = temp_g;
          }
        } else {
        neighbour.g = temp_g;
        open_set.push(neighbour);
        }
        
      neighbour.h = heuristic(neighbour, end);
      neighbour.f = neighbour.g + neighbour.h;
      neighbour.previous = current;
      
      }
    }
  }
  console.log("No solution");
}

function removeFromArray(arr, elt) {
  for (var i = arr.length - 1; i >= 0; i--) {
    if (arr[i] == elt) {
      arr.splice(i, 1);
    }
  }
}

function heuristic(a, b) {
  //var d = dist(a.i, a.j, b.i, b.j);
  var d = abs(a.i-b.i) + abs(a.j-b.j);
  return d;
}