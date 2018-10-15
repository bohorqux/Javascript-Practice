let clicks = 1;

function showCoordinates(event) {
    x = event.clientX;
    y = event.clientY;
    coordinates = `Coordinates ${clicks}: (${x}, ${y})`;
    document.getElementById(`coordinates-${clicks}`).innerHTML = coordinates;

}

function setCoordinate(event) {
    let x = event.clientX;
    let y = event.clientY;
    coordinates = `Coordinates ${clicks}: (${x}, ${y})`;
    document.getElementById(`coordinates-${clicks}`).innerHTML = coordinates;
    drawCoordinates(x, y);

    clicks++;
    document.getElementById(`coordinates-${clicks}`).innerHTML = `Coordinates ${clicks}: `;
}

function getPos(x, y) {
    let canvas = document.getElementById('triangle');
    let rect = canvas.getBoundingClientRect();
    let cx = x - rect.left;
    let cy = y - rect.top;

    return {x: cx, y: cy};
}

function drawCoordinates(x, y) {
   let pointSize = 3;
   let pos = getPos(x, y);
   let ctx = document.getElementById('triangle').getContext("2d");
   ctx.fillStyle = "#ff2626";

   ctx.beginPath();
   ctx.arc(pos.x, pos.y, pointSize, 0, Math.PI * 2, true);
   ctx.fill();

}

function clearCoordinates() {
    if (clicks == 4) {
        return;
    }
    for (i=1; i<4; i++) {
        document.getElementById(`coordinates-${i}`).innerHTML = "";
    }
    clicks = 1;
    let ctx = document.getElementById('triangle').getContext("2d");
    ctx.clearRect(0, 0, document.getElementById('triangle').width, document.getElementById('triangle').height);

}