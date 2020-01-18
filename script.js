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
        [1, 1]
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
]

// game variables
var currentPiece;
var piecePosition;
var nextPiece;

// update stuff
var frameNumber = 0;
var framesUntilUpdate = 60;

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

}

function update() {

    frameNumber++;

    // set next piece if required
    if (!nextPiece) {
        nextPiece = pieces[Math.round(Math.random() * (pieces.length - 1))];
    }

    // set current piece if required
    if (!currentPiece) {
        currentPiece = nextPiece;
        nextPiece = null;
        piecePosition = new Vector2(Math.round(Math.random() * (grid[0].length - 1 - currentPiece[0].length)), 0);
    }

    if (frameNumber >= framesUntilUpdate) {
        frameNumber = 0;

        // move logic
        piecePosition.y++;
        
        if (piecePosition.y + currentPiece.length > gridRows) {
            
        }

    }

}

function render(c) {

    c.clearRect(0, 0, WIDTH, HEIGHT);

    // draw grid
    c.strokeStyle = rgb(16, 16, 16);
    for (var i = 0; i <= grid.length; i++) {
        drawLine(c, 0, i * gridCellSize, grid[0].length * gridCellSize, i * gridCellSize, 1);
    }
    for (var j = 0; j <= grid[0].length; j++) {
        drawLine(c, j * gridCellSize, 0, j * gridCellSize, grid.length * gridCellSize, 1);
    }

    // draw current piece
    c.fillStyle = rgb(200, 200, 200);
    

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

function drawBlock(c, x, y) {
    c.fillRect(x * gridCellSize, y * gridCellSize, gridCellSize, gridCellSize);
}

// function for generating rgba() string
function rgb(r, g, b) {
    return "rgba(" + [r, g, b].join(",") + ",1)";
  }
