// window dimensions
const WIDTH = window.innerWidth, 
      HEIGHT = window.innerHeight;

// grid dimensions
var gridWidth = 20;
var gridHeight = 15;
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
    var grid = new Array(gridWidth);
    for (var i = 0; i < gridWidth; i++) {
        grid[i] = new Array(gridHeight);
    }

}

function update() {}

function render(c) {}
