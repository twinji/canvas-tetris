// window dimensions
const WIDTH = window.innerWidth, 
      HEIGHT = window.innerHeight;

// grid dimensions and values
var gridCellSize = 50;
var gridRows;
var gridColumns;
var gridWidth;
var gridHeight;
var grid;

// game pieces
var pieces = [
    [
        [0, 1, 0],
        [1, 1, 1]
    ],
    [
        [1, 1, 1, 1]
    ],
    [
        [1, 1],
        [1, 1]
    ],
    [
        [1, 0, 0],
        [1, 1, 1]
    ],
    [
        [1, 1, 0],
        [0, 1, 1]
    ]
];

// game variables
var currentPiece;
var piecePosition;
var nextPiece;

// update stuff
var frameNumber = 0;
var framesUntilUpdate = 10;

// keyboard controls
var up = 38, 
    down = 40, 
    right = 39, 
    left = 37;

var key = new Array();
document.addEventListener("keydown", function(e) {key[e.keyCode] = true;});
document.addEventListener("keyup", function(e) {key[e.keyCode] = false;});

// point data type
var Vector2 = function(x, y) {
    this.x = x;
    this.y = y;
  }

window.onload = function(e) {

    // canvas setup
    var canvas = document.getElementById("canvas");
    var c = canvas.getContext("2d");
    canvas.width = WIDTH;
    canvas.height = HEIGHT;

    // initial setup
    init(c);
    
    // main logic loop
    var loop = function() {
        update();
        render(c);
        window.requestAnimationFrame(loop, canvas);
    }
    window.requestAnimationFrame(loop, canvas);
}

function init(c) {

    // initialize grid
    gridWidth = WIDTH * 3 / 4;
    gridHeight = HEIGHT;
    gridRows = Math.floor(gridHeight / gridCellSize);
    gridColumns = Math.floor(gridWidth / gridCellSize);
    grid = new Array(gridRows);
    for (var i = 0; i < grid.length; i++) {
        grid[i] = new Array(gridColumns);
    }

    // initialize game variables
    piecePosition = new Vector2(0, 0);

}

function update() {

    console.log(grid);

    frameNumber++;

    // set next piece if required
    if (nextPiece == null) {
        nextPiece = pieces[Math.round(Math.random() * (pieces.length - 1))];
    }

    // set current piece if required
    if (currentPiece == null) {
        currentPiece = nextPiece;
        nextPiece = null;
        piecePosition = new Vector2(Math.round(Math.random() * (grid[0].length - 1 - currentPiece[0].length)), 0);
    }

    if (frameNumber >= framesUntilUpdate) {
        frameNumber = 0;

        // move logic
        piecePosition.y++;
        
        // flag on whether to place piece
        var placeOnGrid = false;

        // check bottom of grid
        if (piecePosition.y + currentPiece.length > grid.length) {
            placeOnGrid = true;
        }

        // place piece on grid if required
        if (placeOnGrid) {
            piecePosition.y--;
            for (var i = 0; i < currentPiece.length; i++) {
                for (var j = 0; j < currentPiece[i].length; j++) {
                    if (currentPiece[i][j] == 1) {
                        grid[piecePosition.y + i][piecePosition.x + j] = 1;
                    }
                }
            }
            currentPiece = null;
        }
    }
}

function render(c) {

    c.clearRect(0, 0, WIDTH, HEIGHT);
    
    // draw placed pieces
    for (var i = 0; i < grid.length; i++) {
        for (var j = 0; j < grid[i].length; j++) {
            drawBlock(c, j, i, grid[i][j] == 1 ? "grey" : "black");
        }
    }

    // draw current piece
    if (currentPiece != null) {
        for (var i = 0; i < currentPiece.length; i++) {
            for (var j = 0; j < currentPiece[i].length; j++) {
                if (currentPiece[i][j] == 1) {
                    drawBlock(c, piecePosition.x + j, piecePosition.y + i, rgb(200, 200, 200));
                }
            }
        }
    }
    // drawBlock(c, piecePosition.x, piecePosition.y, rgb(200, 200, 200));

    // draw grid
    c.strokeStyle = rgb(16, 16, 16);
    for (var i = 0; i <= grid.length; i++) {
        drawLine(c, 0, i * gridCellSize, grid[0].length * gridCellSize, i * gridCellSize, 1);
    }
    for (var i = 0; i <= grid[0].length; i++) {
        drawLine(c, i * gridCellSize, 0, i * gridCellSize, grid.length * gridCellSize, 1);
    }
}

// helper for drawing lines
function drawLine(c, x1, y1, x2, y2, width) {
    c.lineWidth = width;
    c.beginPath();
    c.moveTo(x1, y1);
    c.lineTo(x2, y2);
    c.stroke();
    c.closePath();
}

function drawBlock(c, x, y, color) {
    var previousColor = c.fillStyle;
    c.fillStyle = color;
    c.fillRect(x * gridCellSize, y * gridCellSize, gridCellSize, gridCellSize);
    c.fillStyle = previousColor;
}

// function for generating rgba() string
function rgb(r, g, b) {
    return "rgba(" + [r, g, b].join(",") + ",1)";
}
