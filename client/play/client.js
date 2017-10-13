var w;
var columns;
var rows;
var board;
var next;
var value;

// Character object
var character = {
  x: 0,
  y: 0,
  c: 100,
}

function setup() {
  createCanvas(480, 480);
  w = 24;
  cursor_x_sel = 0;
  cursor_y_sel = 0;
  columns = floor(width / w);
  rows = floor(height / w);
  // Create game board array
  // 19x19 for game board, 19x20 for player hold
  board = new Array(20);
  for (var i = 0; i < 20; i++) {
    board[i] = new Array(19);
  }
  flush_board(board, 255);
}

function draw() {
  draw_grid(board, 20, 20);
}

function draw_grid(grid_array, grid_rows, grid_columns) {
  for (var i = 0; i < grid_columns; i++) {
    for (var j = 0; j < grid_rows; j++) {
      fill(grid_array[i][j]);
      stroke(0);
      rect(i * w, j * w, w - 1, w - 1);
    }
  }
}

function mousePressed() {
  // check cursor inside board
  if (cursor_inside(0, 0, 480, 480)) {
    board_x = Math.floor(mouseX / 480 * 20);
    board_y = Math.floor(mouseY / 480 * 20);
    move_character(character, board, board_x, board_y);
  }
}

// Replace values in board with value 
function flush_board(board, value) {
  for (var i = 0; i < 20; i++) {
    for (var j = 0; j < 20; j++) {
      board[i][j] = value;
    }
  }
}


function move_character(character, board, x, y) {
  // swap around values
  board[character.x][character.y] = 255;
  board[x][y] = character.c;
  // set new position
  character.x = x
  character.y = y
}

// Returns if cursor inside rect defined by (x1, y1):(x2, y2)
function cursor_inside(x1, y1, x2, y2) {
  if (mouseX >= x1 && mouseY >= y1 && mouseX <= x2 && mouseY <= y2) {
    return true;
  } else {
    return false;
  }
}