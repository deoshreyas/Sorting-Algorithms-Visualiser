// Load the canvas
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

// Sorting algorithms
var algorithms = ["bubble", "selection", "insertion", "merge", "quick"];

// Current sorting 
var current_sorting = "bubble";

// width of each rectangle
var width = 1;

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
    } else if (current_sorting == "insertion") {
        insertionSort();
    } else if (current_sorting == "merge") {
        mergeSort();
    }
}

// Global variable to keep track of the sorting interval
var sortingIntervalID = null;

// Bubble sort algorithm
function bubbleSort() {
    var n = rectangles.length;
    var i = 0;
    var numSorted = 0;
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
    var n = rectangles.length;
    var i = 0;
    if (sortingIntervalID !== null) {
        clearInterval(sortingIntervalID);
    }
    sortingIntervalID = setInterval(function() {
        if (i < n - 1) { 
            var minIndex = i;
            for (var j = i + 1; j < n; j++) {
                if (rectangles[j].height < rectangles[minIndex].height) {
                    minIndex = j;
                }
            }
            if (minIndex != i) {
                var temp = rectangles[i].height;
                rectangles[i].height = rectangles[minIndex].height;
                rectangles[minIndex].height = temp;
                rectangles[i].y = canvas.height - rectangles[i].height - 10;
                rectangles[minIndex].y = canvas.height - rectangles[minIndex].height - 10;
                triangle.x = rectangles[minIndex].x;
            }
            drawRects();
            triangle.draw();
            i++;
            if (i == n - 1) {
                clearInterval(sortingIntervalID);
            }
        }
    }, delay);
}

// Insertion sort algorithm
function insertionSort() {
    var n = rectangles.length;
    var i, key, j;
    var currentIndex = 1;

    if (sortingIntervalID !== null) {
        clearInterval(sortingIntervalID);
    }
    sortingIntervalID = setInterval(function() {
        if (currentIndex < n) {
            key = rectangles[currentIndex];
            j = currentIndex - 1;
            while (j >= 0 && rectangles[j].height > key.height) {
                rectangles[j + 1] = rectangles[j];
                j = j - 1;
            }
            rectangles[j + 1] = key;
            for (let k = 0; k <= currentIndex; k++) {
                rectangles[k].x = k * width;
            }
            drawRects();
            triangle.x = rectangles[currentIndex].x;
            triangle.draw();

            currentIndex++;
        } else {
            clearInterval(sortingIntervalID);
        }
    }, delay);
}

// Merge sort algorithm visualization
function mergeSort() {
    var n = rectangles.length;
    var width = 1;
    var sorted = []; 
    for (var i = 0; i < n; i++) {
        sorted.push(new Rectangle(i * width, rectangles[i].height));
    }
    var currentSize = 1; 
    if (sortingIntervalID !== null) {
        clearInterval(sortingIntervalID);
    }
    sortingIntervalID = setInterval(function() {
        var leftStart;
        for (leftStart = 0; leftStart < n-1; leftStart += 2*currentSize) {
            var mid = Math.min(leftStart + currentSize - 1, n-1);
            var rightEnd = Math.min(leftStart + 2*currentSize - 1, n-1);
            merge(rectangles, sorted, leftStart, mid, rightEnd);
        }
        drawRects();
        triangle.draw();
        currentSize *= 2;
        if (currentSize >= n) {
            clearInterval(sortingIntervalID);
            rectangles = sorted.slice();
        }
    }, delay);
}
function merge(arr, sorted, left, mid, right) {
    var i = left;
    var j = mid + 1;
    var k = left;
    while (i <= mid && j <= right) {
        if (arr[i].height <= arr[j].height) {
            sorted[k].height = arr[i].height;
            i++;
        } else {
            sorted[k].height = arr[j].height;
            j++;
        }
        k++;
    }
    while (i <= mid) {
        sorted[k].height = arr[i].height;
        i++;
        k++;
    }
    while (j <= right) {
        sorted[k].height = arr[j].height;
        j++;
        k++;
    }
    for (let i = left; i <= right; i++) {
        arr[i].height = sorted[i].height;
        arr[i].y = canvas.height - arr[i].height - 10;
    }
}

// Function to change sorting algorithm
var algoLabel = document.querySelector("#algoLabel");
function changeSorting(new_sorting) {
    // Clear the ongoing sorting process
    if (sortingIntervalID !== null) {
        clearInterval(sortingIntervalID);
        sortingIntervalID = null; // Reset the interval ID
    }
    current_sorting = new_sorting;
    if (current_sorting == "bubble") {
        algoLabel.innerHTML = "Bubble Sort";
    } else if (current_sorting == "selection") {
        algoLabel.innerHTML = "Selection Sort";
    } else if (current_sorting == "insertion") {
        algoLabel.innerHTML = "Insertion Sort";
    } else if (current_sorting == "merge") {
        algoLabel.innerHTML = "Merge Sort";
    } else if (current_sorting == "quick") {
        algoLabel.innerHTML = "Quick Sort";
    }
    rectangles = []; 
    randomizeRectangles();
    drawRects();
    triangle = new Triangle(0, 0);
    triangle.draw(); 
}
