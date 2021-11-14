// Function that draw a circle with a number on the canvas with id 'myCanvas'
function drawCircle(x, y, radius, color, text, textColor) {
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
    // Font size is smaller than radius of the circle
    ctx.font = radius * 0.9 + "px Arial";
    ctx.fillStyle = textColor;
    // Text is centerd on the circle
    ctx.fillText(text, x - radius * 0.3, y + radius * 0.3);
}

function drawLine(x1, y1, x2, y2, lineWidth, color) {
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = color;
    ctx.stroke();
}

function calculateNBorderPointsOfCircle(x, y, radius, n) {
    var points = [];
    var angle = 2 * Math.PI / n;
    for (var i = 0; i < n; i++) {
        points.push([x + radius * Math.cos(i * angle), y + radius * Math.sin(i * angle)]);
    }
    return points;
}

drawCircle(100, 100, 70, "red", "1", "black");
drawLine(100, 100, 200, 200, 2, "blue");

let points = calculateNBorderPointsOfCircle(100, 100, 60, 3);

for (var i = 0; i < points.length; i++) {
    drawCircle(points[i][0], points[i][1], 10, "green", i + 1, "black");
}
