var w;
var columns;
var rows;
var board;
var next;
var cursor_x_pos;
var cursor_y_pos;

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
  draw_grid(board, 20, 20);
}

function draw_grid(grid_array, grid_rows, grid_columns) {
  for (var i = 0; i < grid_columns; i++) {
    for (var j = 0; j < grid_rows; j++) {
      if ((grid_array[i][j] == 1)) fill(0);
      else fill(255);
      stroke(0);
      rect(i * w, j * w, w - 1, w - 1);
    }
  }
}

function mousePressed() {
  cursor_x_pos = mouseX;
  cursor_y_pos = mouseY;
  board_x_sel = Math.floor(cursor_x_pos / 480 * 20);
  board_y_sel = Math.floor(cursor_y_pos / 480 * 20);
  board[board_x_sel][board_y_sel] = 1;
}
