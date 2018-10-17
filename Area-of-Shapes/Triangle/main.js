let clicks = 1;

let positions = {
    coordinate1: undefined,
    coordinate2: undefined,
    coordinate3: undefined
}

let LinePositions = {
    coordinate1_2: undefined,
    coordinate2_3: undefined
}

let recentPos = undefined;

function clearStorage() {
    positions.coordinate1 = undefined;
    positions.coordinate2 = undefined;
    positions.coordinate3 = undefined;

    LinePositions.coordinate1_2 = undefined;
    LinePositions.coordinate2_3 = undefined;

    recentPos = undefined;
}

function clearCanvas() {
    let canvas = document.getElementById('triangle');
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function addToStorage(x, y) {
    if (typeof positions.coordinate1 == 'undefined') {
        positions.coordinate1 = getPos(x, y);
    } else if (typeof positions.coordinate2 == 'undefined') {
        positions.coordinate2 = getPos(x, y);
    } else if (typeof positions.coordinate3 == 'undefined') {
        positions.coordinate3 = getPos(x, y);
    }
}

function addToLineStorage(x1, y1, x2, y2) {
    if (typeof LinePositions.coordinate1_2 == 'undefined') {
        console.log("adding to LinePositions.coordinate1_2");
        LinePositions.coordinate1_2 = [x1, y1, x2, y2];
        console.log(`new line stored: ${LinePositions.coordinate1_2}`);
    } else if (typeof LinePositions.coordinate2_3 == 'undefined') {
        LinePositions.coordinate2_3 = [x1, y1, x2, y2];
    }
}

function canvasActive(event) {
    if (clicks == 4) { //When the 3 points are created, don't clear anything on the screen
        return;
    }
    clearCanvas();

    drawAllDots();
    drawAllLines();

    showCoordinates(event);
    showLine(event, recentPos);
}

function showCoordinates(event) {
    let x = event.clientX;
    let y = event.clientY;
    let xy = getPos(x, y);
    let coordinates = `Coordinates ${clicks}: (${xy[0]}, ${xy[1]})`;
    document.getElementById(`coordinates-${clicks}`).innerHTML = coordinates;

}

function setCoordinate(event) {
    let x = event.clientX;
    let y = event.clientY;
    let xy = getPos(x, y);
    let coordinates = `Coordinates ${clicks}: (${xy[0]}, ${xy[1]})`;
    document.getElementById(`coordinates-${clicks}`).innerHTML = coordinates;

    drawDot(xy[0], xy[1]);
    addToStorage(x, y);

    clicks++;
    if (clicks > 2) {
        addToLineStorage(recentPos[0], recentPos[1], xy[0], xy[1]);
        drawAllLines();
    }

    document.getElementById(`coordinates-${clicks}`).innerHTML = `Coordinates ${clicks}: `;
    recentPos = xy;
}

function getPos(x, y) {
    let canvas = document.getElementById('triangle');
    let rect = canvas.getBoundingClientRect();
    let cx = x - rect.left;
    let cy = y - rect.top;

    return [cx, cy];
}

function drawDot(x, y) {
   let pointSize = 5;
   let ctx = document.getElementById('triangle').getContext("2d");
   ctx.fillStyle = "#ff2626";

   ctx.beginPath();
   ctx.arc(x, y, pointSize, 0, Math.PI * 2, true);
   ctx.fill();

}

function drawAllDots() {
    if (typeof positions.coordinate1 != 'undefined') {
        drawDot(positions.coordinate1[0], positions.coordinate1[1]);
    }
    if (typeof positions.coordinate2 != 'undefined') {
        drawDot(positions.coordinate2[0], positions.coordinate2[1]);
    }
    if (typeof positions.coordinate3 != 'undefined') {
        drawDot(positions.coordinate3[0], positions.coordinate3[1]);
    }

}

function drawAllLines() {
    if (typeof LinePositions.coordinate1_2 != 'undefined') {
        let line = LinePositions.coordinate1_2;
        drawLine(line[0], line[1], line[2], line[3]);
    }
    if (typeof LinePositions.coordinate2_3 != 'undefined') {
        let line = LinePositions.coordinate2_3;
        drawLine(line[0], line[1], line[2], line[3]);
    }
    if (typeof LinePositions.coordinate2_3 != 'undefined' && positions.coordinate3 != 'undefined') {
        let x1y1 = positions.coordinate1;
        let x2y2 = positions.coordinate3;
        drawLine(x1y1[0], x1y1[1], x2y2[0], x2y2[1]);
    }
}

function showLine(mouse, xy) {
    if (clicks == 1 || clicks == 4) {
        return;
    }

    let x = mouse.clientX;
    let y = mouse.clientY;
    let mouse_xy = getPos(x, y);

    let canvas = document.getElementById('triangle');
    let ctx = canvas.getContext('2d');
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(xy[0], xy[1]);
    ctx.lineTo(mouse_xy[0], mouse_xy[1]);
    ctx.stroke();
}

function drawLine(x1, y1, x2, y2) {
    let canvas = document.getElementById('triangle');
    let ctx = canvas.getContext('2d');
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2 ,y2);
    ctx.stroke();
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