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
        [1, 2, 1]
    ],
    [
        [1, 2, 1, 1]
    ],
    [
        [1, 1],
        [1, 1]
    ],
    [
        [1, 0, 0],
        [1, 2, 1]
    ],
    [
        [1, 1, 0],
        [0, 2, 1]
    ]
];

// game variables
var currentPiece;
var piecePosition;
var nextPiece;

// update stuff
var frameNumber = 0;
var controlFrameNumber = 0;
var framesUntilUpdate = 60;

// keyboard controls
var up = 38, 
    down = 40, 
    right = 39, 
    left = 37,
    z = 90,
    x = 88;
    space = 32;

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

    frameNumber++;
    controlFrameNumber++;

    // set next piece if required
    if (nextPiece == null) {

         // randomly select an available piece
        nextPiece = pieces[Math.round(Math.random() * (pieces.length - 1))];
        console.log(nextPiece);

        // randomly rotate and mirror several times
        for (var i = 0; i < 3; i++) {
            if (Math.random() >= 0.5) nextPiece = rotate(nextPiece, Math.round(Math.random() * 2 - 1));
            if (Math.random() >= 0.5) nextPiece = mirror(nextPiece, new Vector2(Math.round(Math.random()), Math.round(Math.random())));
        }
    }

    // set current piece if required
    if (currentPiece == null) {
        currentPiece = nextPiece;
        nextPiece = null;
        piecePosition = new Vector2(Math.round(Math.random() * (grid[0].length - 1 - currentPiece[0].length)), 0);
    }

    // updates that only occur every 60 fromes
    if (frameNumber >= framesUntilUpdate) {

        // reset frame number
        frameNumber = 0;

        // move delta
        var delta = new Vector2(0, 1);

        // place piece on grid if required
        if (isOverlapping(delta)) {
            for (var i = 0; i < currentPiece.length; i++) {
                for (var j = 0; j < currentPiece[i].length; j++) {
                    if (currentPiece[i][j] >= 1) {
                        grid[piecePosition.y + i][piecePosition.x + j] = 1;
                    }
                }
            }
            currentPiece = null;
            collapse();
        } else {
            piecePosition.x += delta.x;
            piecePosition.y += delta.y;
        }
    }

    // updates that only occur every 20 fromes
    if (controlFrameNumber >= framesUntilUpdate / 20) {

        // reset frame number
        controlFrameNumber = 0;

        // check if piece currently in play
        if (piecePosition != null && currentPiece != null) {

            // change in position
            var delta = new Vector2(0, 0);

            // updates that only occur every 60 fromes
            if (key[right]) delta.x++;
            if (key[left]) delta.x--;
            if (key[down]) delta.y++;
            if (key[up]) {}

            if (currentPiece != null) {
                if (key[z]) currentPiece = rotate(currentPiece, -1);
                if (key[x]) currentPiece = rotate(currentPiece, 1);
                
            }

            if (!isOverlapping(delta)) {
                piecePosition.x += delta.x;
                piecePosition.y += delta.y;
            }
        }
    }
}

// function for checking collisions
function isOverlapping(delta) {

    // check bounds of grid
    if (
        piecePosition.x + delta.x < 0 
        || piecePosition.x + currentPiece[0].length + delta.x > grid[0].length
        || piecePosition.y + currentPiece.length + delta.y > grid.length
    ) {
        return true;
    }

    // check surrounding blocks
    for (var i = 0; i < currentPiece.length; i++) {
        for (var j = 0; j < currentPiece[i].length; j++) {
            if (currentPiece[i][j] >= 1) {
                if (grid[piecePosition.y + i + delta.y][piecePosition.x + j + delta.x] == 1) {
                    return true;
                }
            }
        }
    }

    // no collisions
    return false;
}

// function to rotate current piece
function rotate(piece, direction) {

    var pivot;
    var rotatedPiece;

    if (piece == null) return null;

    // find pivot origin
    for (var i = 0; i < piece.length; i++) {
        var pivotIndex = piece[i].indexOf(2);
        if (pivotIndex != -1) {
            pivot = new Vector2(pivotIndex, i);
            break;
        }
    }

    // leave if no pivot is found
    if (pivot == null) {
        return;
    }

    // determine new 2D array dimensions
    rotatedPiece = new Array(piece[0].length);
    for (var i = 0; i < rotatedPiece.length; i++) {
        rotatedPiece[i] = new Array(piece.length);
    }

    // populated new 2D array
    for (var i = 0; i < piece.length; i++) {
        for(var j = piece[i].length - 1; j >= 0; j--) {
            rotatedPiece[j][i] = piece[i][piece[i].length - 1 - j];
        }
    }

    if (direction > 0) {
        rotatedPiece = mirror(rotatedPiece, new Vector2(1, 1));
    }

    return rotatedPiece;
}

// function to mirror a piece
function mirror(piece, direction) {

    if (piece == null) return null;

    // reverse along y axis
    if (direction.y != 0) {
        piece.reverse();
    }

    // reverse along x axis
    if (direction.x != 0) {
        for (var i = 0; i < piece.length; i++) {
            piece[i].reverse();
        }
    }

    return piece;
}

// function to collapse complete rows
function collapse() {

    // iterate over rows and determine rows to remove
    var rowsToRemove = new Array();
    for (var i = 0; i < grid.length; i++) {

        // check if row is filled
        var filled = true;
        for (var j = 0; j < grid[i].length; j++) {
            if (grid[i][j] != 1) {
                filled = false;
                break;
            }
        }
        
        if (filled) {
            rowsToRemove.push(i);
        }
    }

    // remove determined rows and add rows new to top
    for (var i = 0; i < rowsToRemove.length; i++) {
        grid[rowsToRemove[i]] = null;
    }
    for (var i = 0; i < grid.length; i++) {
        if (grid[i] == null) {
            grid.splice(i, 1);
            grid.unshift(new Array(gridColumns));
        }
    }
}

function render(c) {

    // screen fade effect
    c.fillStyle = "black";
    c.globalAlpha = 0.3;
    c.fillRect(0, 0, WIDTH, HEIGHT);
    c.globalAlpha = 1;
    
    // draw placed pieces
    for (var i = 0; i < grid.length; i++) {
        for (var j = 0; j < grid[i].length; j++) {
            drawBlock(c, j, i, grid[i][j] >= 1 ? "grey" : "transparent");
        }
    }

    // draw current piece
    if (currentPiece != null) {
        for (var i = 0; i < currentPiece.length; i++) {
            for (var j = 0; j < currentPiece[i].length; j++) {
                if (currentPiece[i][j] >= 1) {
                    drawBlock(c, piecePosition.x + j, piecePosition.y + i, rgb(200, 200, 200));
                }
            }
        }
    }

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
