var w;
var columns;
var rows;
var board;
var next;
var cursor_x_pos;
var cursor_y_pos;

// Character object
var character = {
  x_position: 0,
  y_position: 0,
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
}

function draw() {
  board[0][0] = 0;
  populate_board(board)
  draw_grid(board, 20, 20);
}

// Flush the board 
//function flush_board(board) {
//  for (var i = 0; i < 20; i++) {
//    for (var j = 0; j < 20; i++) {
//      board[i][j] = 0;
//    }
//  }
//  window.alert("ping")
//}

// Populate board
function populate_board(board, character) {
  board[character.x_position][character.y_position] = character.c
}

// Draw the grid
function draw_grid(grid_array, grid_rows, grid_columns) {
  for (var i = 0; i < grid_columns; i++) {
    for (var j = 0; j < grid_rows; j++) {
      if ((grid_array[i][j] == 0)) fill(200);
      else fill(grid_array[i][j);
      stroke(0);
      rect(i * w, j * w, w - 1, w - 1);
    }
  }
  window.alert("ping")
}

// What to do when clicked
function mousePressed() {
  cursor_x_pos = mouseX;
  cursor_y_pos = mouseY;
  x = Math.floor(cursor_x_pos / 480 * 20);
  y = Math.floor(cursor_y_pos / 480 * 20);
  move_character(character, x, y);
}

// What to do when input to move character
function move_character(character, x, y) {
  character.x_position = x
  character.y_position = y
}
