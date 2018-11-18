let clicks = 1;

function Point(x, y) {
    this.position = function(n) {
        let canvas = document.getElementById('triangle');
        let rect = canvas.getBoundingClientRect();
        return n == x ? x - rect.left : y - rect.top;
    };
    this.window_x = x;
    this.window_y = y;
    this.canvas_x = Math.trunc(this.position(x));
    this.canvas_y = Math.trunc(this.position(y));
}

function Line(PointA, PointB) {
    this.canvas_x1 = PointA.canvas_x;
    this.canvas_x2 = PointB.canvas_x;
    this.canvas_y1 = PointA.canvas_y;
    this.canvas_y2 = PointB.canvas_y;
    this.window_x1 = PointA.window_x;
    this.window_x2 = PointB.window_x;
    this.window_y1 = PointA.window_y;
    this.window_y2 = PointB.window_y;

    this.distance = function() {
        let dist_x = Math.pow(this.canvas_x2 - this.canvas_x1, 2);
        let dist_y = Math.pow(this.canvas_y2 - this.canvas_y1, 2);
        return Math.sqrt(dist_x + dist_y);
    };
}

let Points = {
    point1: undefined,
    point2: undefined,
    point3: undefined,

    clear: function() {
        for (let key in this) {
            if (typeof this[key] != 'function') {
                this[key] = undefined;
            }
        }
    },
    store: function(point) {
        for (let key in this) {
            if (typeof this[key] == 'undefined') {
                this[key] = point;
                break;
            }
        }
    }
}

let Triangle = {
    sideA: undefined,
    sideB: undefined,
    sideC: undefined,

    area: function () {
        let s = 0;
        for (let side in this) {
            if (typeof this[side] == 'Line') {
                s += this[side].distance() * 0.5;
            }
            let s_a = s-this.sideA.distance();
            let s_b = s-this.sideB.distance();
            let s_c = s-this.sideC.distance();

            let a = Math.sqrt(s*s_a*s_b*s_c);
            return Math.trunc(a);
        }

    },
    store: function(line) {
        for (let key in this) {
            if (typeof this[key] == 'undefined') {
                this[key] = line;
            }
        }
    },
    clear: function() {
        keys = 0;
        for (let key in this) {
            if (typeof this[key] != 'function') {
                console.log(`Reset ${keys} key[s] from Triangle object`);
                this[key] = undefined;
            }
        }
    }
}

let recentPoint = new Point(undefined, undefined);
let triangleDrawn = false;

function clearStorage() {
    Triangle.clear();
    Points.clear();
    recentPoint = new Point(undefined, undefined);
    clicks = 1;
}
// - - - - - - - - - - - - - - - - - - - -  CANVAS FACING FUNCTIONS - - - - - - - - - - - - - - - - - - - - 
function clearCanvas() {
    let canvas = document.getElementById('triangle');
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function canvasActive(event) {
    if (clicks < 4) { 
        clearCanvas();
        drawAllPoints();
        drawAllLines(1, "gray");
        showPoint(event);
        showLine(event, recentPoint);
    } else {
        triangleDrawn = true;
    }
}

function resetCanvas() {
    triangleDrawn = false;
    clearStorage();
    clearCanvas();

    for (i=1; i<4; i++) {
        document.getElementById(`coordinates-${i}`).innerHTML = "";
    }
    document.getElementById('resetButton').innerHTML = "";
    document.getElementById('area').innerHTML = "";

}

function canvasInactive() {
    if (clicks == 4) {
        return;
    }
    resetCanvas();
}
// - - - - - - - - - - - - - - - - - - - - CANVAS FACING FUNCTIONS - - - - - - - - - - - - - - - - - - - - 

// - - - - - - - - - - - - - - - - - - - -  COORDINATE FUNCTIONS - - - - - - - - - - - - - - - - - - - -  
function setCoordinate(event) {
    let pointClicked = new Point(event.clientX, event.clientY);
    if (clicks < 3) {
        let point = `Coordinate ${clicks}: (${pointClicked.canvas_x}, ${pointClicked.canvas_y})`;
        document.getElementById(`coordinates-${clicks}`).innerHTML = point;
        document.getElementById(`coordinates-${clicks+1}`).innerHTML = `Coordinate ${clicks+1}: `;
    }

    Points.store(pointClicked);
    drawAllPoints();
    clicks++;

    if (clicks > 2) {
        //addToStorage([recentPoint.x, recentPoint.y, xy[0], xy[1]], Triangle);
        let line = new Line(recentPoint, pointClicked);
        Triangle.store(line);
        console.log(Triangle);
            if (clicks == 4) {
                //addToStorage([Points.point1[0], Points.point1[1], xy[0], xy[1]], Triangle);
                let line2 = new Line(Points.point1, pointClicked);
                Triangle.store(line2);
                console.log(Triangle);
                drawTriangle("black", "lightblue", 5);
                document.getElementById('resetButton').innerHTML = "<button class='btn btn-primary' onclick='resetCanvas()'>Reset?</button>";
                document.getElementById('area').innerHTML = `<h5>${Triangle.area()}</h5>`;
                return;
            }
        drawAllLines(1, "gray");
    }

    recentPoint = new Point(pointClicked.window_x, pointClicked.window_y);
}



// - - - - - - - - - - - - - - - - - - - -  COORDINATE FUNCTIONS - - - - - - - - - - - - - - - - - - - - 

// - - - - - - - - - - - - - - - - - - - -  MOUSEOVER FUNCTIONS - - - - - - - - - - - - - - - - - - - - 
function showPoint(event) {
    let cursor = new Point(event.clientX, event.clientY);
    let point = `Coordinate ${clicks}: (${cursor.canvas_x}, ${cursor.canvas_y})`;
    document.getElementById(`coordinates-${clicks}`).innerHTML = point;
}

function showLine(event, xy) {
    let cursor = new Point(event.clientX, event.clientY);
    if (clicks == 1 || clicks == 4) {
        return;
    }
    let line = new Line(cursor, xy);
    drawLine(line, 1, "gray");

    if (clicks == 3) { //showing line that completes triangle, not setting it yet.
        let line2 = new Line(cursor, Points.point1);
        drawLine(line2, 1, "gray");
    }
}
// - - - - - - - - - - - - - - - - - - - -  MOUSEOVER FUNCTIONS - - - - - - - - - - - - - - - - - - - - 

// - - - - - - - - - - - - - - - - - - - -  DRAWING FUNCTIONS - - - - - - - - - - - - - - - - - - - - 
function drawDot(point) {
   let pointSize = 5;
   let ctx = document.getElementById('triangle').getContext("2d");
   ctx.fillStyle = "#ff2626";

   ctx.beginPath();
   ctx.arc(point.canvas_x, point.canvas_y, pointSize, 0, Math.PI * 2, true);
   ctx.fill();

}

function drawLine(line, width, style) {
    let canvas = document.getElementById('triangle');
    let ctx = canvas.getContext('2d');
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(line.canvas_x1, line.canvas_y1);
    ctx.lineTo(line.canvas_x2, line.canvas_y2);
    ctx.strokeStyle = style;
    ctx.stroke();
}

function drawAllPoints() {
    for (let key in Points) {
        if (typeof Points[key] != 'undefined' && typeof Points[key] != 'function') {
            drawDot(Points[key]);
        }
    }
}

function drawAllLines(width, style) {
    for (let key in Triangle) {
        if (typeof Triangle[key] != 'undefined' && typeof Triangle[key] != 'function') {
            drawLine(Triangle[key], width, style);
        }
    }
}

function drawTriangle(stroke, fill, strokeWidth) {
    let canvas = document.getElementById('triangle');
    let ctx = canvas.getContext('2d');

    ctx.beginPath();
    ctx.moveTo(Points.point1.canvas_x, Points.point1.canvas_y);
    ctx.lineTo(Points.point2.canvas_x, Points.point2.canvas_y);
    ctx.lineTo(Points.point3.canvas_x, Points.point3.canvas_y);
    ctx.closePath();

    ctx.lineWidth = strokeWidth;
    ctx.strokeStyle = stroke;
    ctx.stroke();

    ctx.fillStyle = fill;
    ctx.fill();
}

// - - - - - - - - - - - - - - - - - - - - DRAWING FUNCTIONS - - - - - - - - - - - - - - - - - - - - 
