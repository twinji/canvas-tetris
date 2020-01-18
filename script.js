// window dimensions
const WIDTH = window.innerWidth, 
      HEIGHT = window.innerHeight;

// grid dimensions and values
var gridCellSize = 50;
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
    gridWidth = Math.floor(WIDTH / gridCellSize);
    gridHeight = Math.floor(HEIGHT / gridCellSize);
    grid = new Array(gridWidth);
    for (var i = 0; i < grid.length; i++) {
        grid[i] = new Array(gridHeight);
    }

}

function update() {}

function render(c) {

    // draw grid
    c.strokeStyle = "white";
    for (var i = 0; i <= grid[0].length; i++) {
        drawLine(c, 0, i * gridCellSize, gridWidth * gridCellSize, i * gridCellSize, 1);
    }
    for (var j = 0; j <= grid.length; j++) {
        drawLine(c, j * gridCellSize, 0, j * gridCellSize, grid[0].length * gridCellSize, 1);
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
