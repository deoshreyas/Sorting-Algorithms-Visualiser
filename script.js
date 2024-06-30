// Load the canvas
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

// Sorting algorithms
var algorithms = ["bubble", "selection", "insertion", "merge", "quick"];

// Current sorting 
var current_sorting = "bubble";

// width of each rectangle
var width = 5;

// Delay in visualising
var delay = 10;

// Get number of rectangles to draw based on width of canvas 
var numRectangles = Math.floor(canvas.width / width);

// Rectangle class 
class Rectangle {
    constructor(x, height) {
        this.x = x;
        this.height = height;
        this.y = canvas.height-this.height-10;
        this.width = width;
        this.color = "#f49f1c";
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

// Triangle class (drawn below rectangles to show sorting)
class Triangle {
    constructor(x, y) {
        this.x = x;
        this.y = canvas.height-5;
        this.color = "#000000";
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + 5, this.y);
        ctx.lineTo(this.x + 2.5, this.y - 5);
        ctx.fill();
    }
}

// Create a triangle
var triangle = new Triangle(0, 0);

// Rectangles
var rectangles = [];

function randomizeRectangles() {    
    for (var i = 0; i < numRectangles; i++) {
        rectangles.push(new Rectangle(i * width, Math.random() * 100));
    }
}

// Draw the rectangles
randomizeRectangles();
function drawRects() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < rectangles.length; i++) {
        rectangles[i].draw();
    }
}

drawRects();
triangle.draw();

// Play function 
function play() {
    if (current_sorting == "bubble") {
        bubbleSort();
    } else if (current_sorting == "selection") {
        selectionSort();
    }
}

// Global variable to keep track of the sorting interval
var sortingIntervalID = null;

// Bubble sort algorithm
function bubbleSort() {
    var n = rectangles.length;
    var i = 0;
    var numSorted = 0;
    // Clear any existing sorting interval
    if (sortingIntervalID !== null) {
        clearInterval(sortingIntervalID);
    }
    sortingIntervalID = setInterval(function() {
        if (i < n - 1) {
            var first = rectangles[i];
            var second = rectangles[i + 1];
            triangle.x = first.x;
            drawRects();
            triangle.draw();
            setTimeout(function() {
                if (first.height > second.height) {
                    var temp = first.height;
                    first.height = second.height;
                    second.height = temp;
                    first.y = canvas.height - first.height - 10;
                    second.y = canvas.height - second.height - 10;
                    triangle.x = second.x;
                    numSorted = 0;
                } else {
                    numSorted += 1;
                }
                drawRects();
                triangle.draw();
                i++; 
                if (i == n) {
                    i = 0;
                    if (numSorted >= n-1) {
                        clearInterval(sortingIntervalID);
                    }
                }
            }, 100);
        }
    }, delay);
}

// Selection sort algorithm
function selectionSort() {

}

// Function to change sorting algorithm
function changeSorting(new_sorting) {
    // Clear the ongoing sorting process
    if (sortingIntervalID !== null) {
        clearInterval(sortingIntervalID);
        sortingIntervalID = null; // Reset the interval ID
    }
    current_sorting = new_sorting;
    rectangles = []; 
    randomizeRectangles();
    drawRects();
    triangle = new Triangle(0, 0);
    triangle.draw(); 
}