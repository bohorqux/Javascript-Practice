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
    recent: {point: undefined, key: undefined},

    clear: function() {
        for (let key in this) {
            if (typeof this[key] != 'function') {
                this[key] = undefined;
            }
        }
        this.recent = {point: undefined, key: undefined};
    },
    store: function(point) {
        for (let key in this) {
            if (typeof this[key] == 'undefined' && key != 'recent') {
                this[key] = point;
                this.recent.point = point; //NO IDEA WHY THIS IS HAS TO BE REFERENCED DIFFERENTLY
                this.recent.key = key;
                break;
            }
        }
    }
}

let Triangle = {
    sideA: undefined,
    sideB: undefined,
    sideC: undefined,

    isDrawn: function() {
        for (let side in this) {
            if (typeof this[side] == 'undefined') {
                return false;
            }
        }
        return true;
    },
    area: function () {
        let s = 0;
        for (let side in this) {
            if (this[side].constructor.name == 'Line') {
                s += this[side].distance() * 0.5;
            }
        }
        let s_a = s-this.sideA.distance();
        let s_b = s-this.sideB.distance();
        let s_c = s-this.sideC.distance();

        let a = Math.sqrt(s*s_a*s_b*s_c);
        return Math.trunc(a);
    },
    store: function(line) {
        for (let key in this) {
            if (typeof this[key] == 'undefined') {
                this[key] = line;
                break;
            }
        }
    },
    clear: function() {
        keys = 0;
        for (let key in this) {
            if (typeof this[key] != 'function') {
                keys++;
                this[key] = undefined;
            }
        }
    }
}

let recentPoint = new Point(undefined, undefined);

function clearStorage() {
    Triangle.clear();
    Points.clear();
    recentPoint = new Point(undefined, undefined);
    clicks = 1;
    for (let i = 1; i < 4; i++) {
        document.getElementById(`coordinates-${i}`).innerHTML = "";
    }
}
// - - - - - - - - - - - - - - - - - - - -  EVENT LISTENERS - - - - - - - - - - - - - - - - - - - - - - - - 
document.getElementById('triangle').addEventListener('mousemove', function(event) {
    if (!Triangle.isDrawn()) {
        clearCanvas()
        showPoint(event);
        showLine(event, recentPoint);
        drawAllPoints();
        drawAllLines(1, "gray");
    }
});

document.getElementById('triangle').addEventListener('mouseout', function() {
    if (!Triangle.isDrawn()) {
        clearStorage();
        clearCanvas();
        document.getElementById('resetButton').innerHTML = "";
        document.getElementById('area').innerHTML = "";
    }
});

document.getElementById('triangle').addEventListener('click', function(event) {
    let pointClicked = new Point(event.clientX, event.clientY);
    Points.store(pointClicked);
    if (clicks < 3) {
        let point = `Coordinate ${clicks}: (${pointClicked.canvas_x}, ${pointClicked.canvas_y})`;
        document.getElementById(`coordinates-${clicks}`).innerHTML = point;
        document.getElementById(`coordinates-${clicks+1}`).innerHTML = `Coordinate ${clicks+1}: `;
    }
    drawAllPoints();
    clicks++;

    if (clicks > 2) {
        let line = new Line(recentPoint, pointClicked);
        Triangle.store(line);
            if (clicks == 4) {
                let line2 = new Line(Points.point1, pointClicked);
                Triangle.store(line2);
                drawTriangle("black", "lightblue", 5);
                document.getElementById('resetButton').innerHTML = "<button class='btn btn-primary' onclick='clearCanvas(); clearStorage();'>Reset?</button>";
                document.getElementById('area').innerHTML = `<h5>${Triangle.area()}</h5>`;
                return;
            }
        drawAllLines(1, "gray");
    }

    recentPoint = new Point(pointClicked.window_x, pointClicked.window_y);
});
// - - - - - - - - - - - - - - - - - - - -  EVENT LISTENERS - - - - - - - - - - - - - - - - - - - - - - - - 


// - - - - - - - - - - - - - - - - - - - -  CANVAS FACING FUNCTIONS - - - - - - - - - - - - - - - - - - - - 
function clearCanvas() {
    let canvas = document.getElementById('triangle');
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}
// - - - - - - - - - - - - - - - - - - - - CANVAS FACING FUNCTIONS - - - - - - - - - - - - - - - - - - - - 

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
