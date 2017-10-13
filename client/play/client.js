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
  // first dimension - x, second dimension - y, third dimension - meta and prime
  board = new Array(20);
  for (var i = 0; i < 20; i++) {
    board[i] = new Array(19);
  }
  for (var i = 0; i < 20; i++) {
    for (var j = 0; j < 20; j++) {
      board[i][j] = new Array(2);
    }
  }
  flush_board(board, 255);
}

function draw() {
  draw_grid(board, 20, 20);
}

function draw_grid(grid_array, grid_rows, grid_columns) {
  for (var i = 0; i < grid_columns; i++) {
    for (var j = 0; j < grid_rows; j++) {
      fill(grid_array[i][j][1]);
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
      board[i][j][0] = 0;
      board[i][j][1] = value;
    }
  }
}


function move_character(character, board, x, y) {
  vacate(board, character);
  board[x][y][0] = 3;
  board[x][y][1] = character.c;
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

function vacate(board, character) {
  board[character.x][character.y][0] = 0;
  board[character.x][character.y][1] = 255;
}