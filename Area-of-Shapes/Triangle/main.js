let clicks = 1;

let Positions = {
    coordinate1: undefined,
    coordinate2: undefined,
    coordinate3: undefined,
}

let LinePositions = {
    coordinate1_2: undefined,
    coordinate2_3: undefined,
    coordinate1_3: undefined
}

let recentPos = undefined;

// - - - - - - - - - - - - - - - - - - - - OBJECT MEMORY FUNCTIONS  - - - - - - - - - - - - - - - - - - - - 
function clearStorage() {
    for (let key in Positions) {
        Positions[key] = undefined;
    }

    for (let key in LinePositions) {
        LinePositions[key] = undefined;
    }

    recentPos = undefined;
}

function addToStorage(coordinates, o) {
    for (let key in o) {
        if (typeof o[key] == 'undefined') {
            o[key] = coordinates;
            break;
        }
    }
}
// - - - - - - - - - - - - - - - - - - - -  OBJECT MEMORY FUNCTIONS - - - - - - - - - - - - - - - - - - - - 

// - - - - - - - - - - - - - - - - - - - -  CANVAS FACING FUNCTIONS - - - - - - - - - - - - - - - - - - - - 
function clearCanvas() {
    let canvas = document.getElementById('triangle');
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function canvasActive(event) {
    if (clicks == 4) { //When the 3 points are created, don't clear anything on the screen
        return;
    }
    clearCanvas();

    drawAllDots();
    drawAllLines(1, "gray");

    showCoordinates(event);
    showLine(event, recentPos);
}

function canvasInactive() {
    if (clicks == 4) {
        return;
    }

    for (i=1; i<4; i++) {
        document.getElementById(`coordinates-${i}`).innerHTML = "";
    }
    clicks = 1;
    clearStorage();
    clearCanvas();
}
// - - - - - - - - - - - - - - - - - - - - CANVAS FACING FUNCTIONS - - - - - - - - - - - - - - - - - - - - 

// - - - - - - - - - - - - - - - - - - - -  COORDINATE FUNCTIONS - - - - - - - - - - - - - - - - - - - -  
function setCoordinate(event) {
    let xy = getPos(event.clientX, event.clientY);

    if (clicks < 3) {
        let coordinates = `Coordinates ${clicks}: (${xy[0]}, ${Math.trunc(xy[1])})`;
        document.getElementById(`coordinates-${clicks}`).innerHTML = coordinates;
        document.getElementById(`coordinates-${clicks+1}`).innerHTML = `Coordinates ${clicks+1}: `;
    }

    addToStorage(xy, Positions);
    drawAllDots();
    clicks++;

    if (clicks > 2) {
        addToStorage([recentPos[0], recentPos[1], xy[0], xy[1]], LinePositions);
            if (clicks == 4) {
                addToStorage([Positions.coordinate1[0], Positions.coordinate1[1], xy[0], xy[1]], LinePositions);
                drawTriangle();
                return;
            }
        drawAllLines("gray");
    }

    recentPos = xy;
}

function getPos(x, y) {
    let canvas = document.getElementById('triangle');
    let rect = canvas.getBoundingClientRect();
    let cx = x - rect.left;
    let cy = y - rect.top;

    return [cx, cy];
}
// - - - - - - - - - - - - - - - - - - - -  COORDINATE FUNCTIONS - - - - - - - - - - - - - - - - - - - - 

// - - - - - - - - - - - - - - - - - - - -  MOUSEOVER FUNCTIONS - - - - - - - - - - - - - - - - - - - - 
function showCoordinates(event) {
    let xy = getPos(event.clientX, event.clientY);
    let coordinates = `Coordinates ${clicks}: (${xy[0]}, ${Math.trunc(xy[1])})`;
    document.getElementById(`coordinates-${clicks}`).innerHTML = coordinates;
}

function showLine(cursor, xy) {
    if (clicks == 1 || clicks == 4) {
        return;
    }

    let x = cursor.clientX;
    let y = cursor.clientY;
    let cursor_xy = getPos(x, y);

    drawLine(cursor_xy[0], cursor_xy[1], xy[0], xy[1], 1, "gray");

    if (clicks == 3) {
        drawLine(cursor_xy[0], cursor_xy[1], Positions.coordinate1[0], Positions.coordinate1[1]);
    }
}
// - - - - - - - - - - - - - - - - - - - -  MOUSEOVER FUNCTIONS - - - - - - - - - - - - - - - - - - - - 

// - - - - - - - - - - - - - - - - - - - -  DRAWING FUNCTIONS - - - - - - - - - - - - - - - - - - - - 
function drawDot(x, y) {
   let pointSize = 5;
   let ctx = document.getElementById('triangle').getContext("2d");
   ctx.fillStyle = "#ff2626";

   ctx.beginPath();
   ctx.arc(x, y, pointSize, 0, Math.PI * 2, true);
   ctx.fill();

}

function drawLine(x1, y1, x2, y2, width, style) {
    let canvas = document.getElementById('triangle');
    let ctx = canvas.getContext('2d');
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2 ,y2);
    ctx.strokeStyle = style;
    ctx.stroke();
}

function drawAllDots() {
    for (let key in Positions) {
        if (typeof Positions[key] != 'undefined') {
            drawDot(Positions[key][0], Positions[key][1]);
        }
    }
}

function drawAllLines(width, style) {
    for (let key in LinePositions) {
        if (typeof LinePositions[key] != 'undefined') {
            let line = LinePositions[key];
            drawLine(line[0], line[1], line[2], line[3], width, style);
        }
    }
}

function drawTriangle() {
    let canvas = document.getElementById('triangle');
    let ctx = canvas.getContext('2d');

    ctx.beginPath();
    ctx.moveTo(Positions.coordinate1[0], Positions.coordinate1[1]);
    ctx.lineTo(Positions.coordinate2[0], Positions.coordinate2[1]);
    ctx.lineTo(Positions.coordinate3[0], Positions.coordinate3[1]);
    ctx.closePath();

    ctx.lineWidth = 5;
    ctx.strokeStyle = "black";
    ctx.stroke();

    ctx.fillStyle = "lightblue";
    ctx.fill();
}
// - - - - - - - - - - - - - - - - - - - - DRAWING FUNCTIONS - - - - - - - - - - - - - - - - - - - - 
