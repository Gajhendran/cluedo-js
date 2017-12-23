//
// data.js
//
// Declaring variables & constants & objects

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

var characters = 1;
var hold = new Array(characters);
var rollValue = 6;
var currentCharacter = 0;

var socket = io.connect("https://cluedo-js-tomkuson.c9users.io");

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
                gridGraphics.stroke(0);
                gridGraphics.rect(this.i * (GRID_WIDTH / COLS), this.j * (GRID_HEIGHT / ROWS), (GRID_WIDTH / COLS) - 1, (GRID_HEIGHT / ROWS) - 1);
        }
}