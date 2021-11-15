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

function getClosestPointsBetweenTwoCircles(x1, y1, x2, y2, radius1, radius2) {
    // Get the point of the border of the first circle that intersect with the line between the two circles without using calculateNBorderPointsOfCircle
    var angle = Math.atan2(y2 - y1, x2 - x1);
    var x1b = x1 + radius1 * Math.cos(angle);
    var y1b = y1 + radius1 * Math.sin(angle);
    var x2b = x2 - radius2 * Math.cos(angle);
    var y2b = y2 - radius2 * Math.sin(angle);
    var points = [
        [x1b, y1b],
        [x2b, y2b]
    ];
    return points;
}

function drawLineConnectingTwoCircles(x1, y1, x2, y2, radius1, radius2, lineWidth, color) {
    var points = getClosestPointsBetweenTwoCircles(x1, y1, x2, y2, radius1, radius2);
    drawLine(points[0][0], points[0][1], points[1][0], points[1][1], lineWidth, color);
}

function drawCircles(positionList, radius, color, textColor){
    for (var i = 0; i < positionList.length; i++) {
        drawCircle(positionList[i][0], positionList[i][1], radius, color, i + 1, textColor);
    }
}

function getDistance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function drawCanvasBorder(canvasWidth, canvasHeight, lineWidth, color) {
    drawLine(0, 0, canvasWidth, 0, lineWidth, color);
    drawLine(canvasWidth, 0, canvasWidth, canvasHeight, lineWidth, color);
    drawLine(canvasWidth, canvasHeight, 0, canvasHeight, lineWidth, color);
    drawLine(0, canvasHeight, 0, 0, lineWidth, color);
}

function clearCanvas(){
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawEdges(positionList, radius, lineWidth, color) {
    for (var i = 0; i < positionList.length; i++) {
        for (var j = 0; j < positionList.length; j++) {
            if (i != j) {
                drawLineConnectingTwoCircles(positionList[i][0], positionList[i][1], positionList[j][0], positionList[j][1], radius, radius, lineWidth, color);
            }
        }
    }
}


function drawAgents(agentsIdList, x, y, radiusCircle, radiusAgent, agentColorsList, textColor) {
    if (agentsIdList != null) {
        let coloursQuantity = agentColorsList.length;
        // Draw agents using calculateNBorderPointsOfCircle
        var points = calculateNBorderPointsOfCircle(x, y, radiusCircle, agentsIdList.length);
        for (var i = 0; i < agentsIdList.length; i++) {
            let colorPositionList = agentsIdList[i] % coloursQuantity;
            drawCircle(points[i][0], points[i][1], radiusAgent, agentColorsList[colorPositionList], agentsIdList[i], textColor);
        }
    }
}

function fillBackground(color) {
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawCircleTransitionMove(x1, y1, x2, y2, radius, color, text, textColor) {
    // Draw circle and clear to draw circle next step until draw the circle at the final position
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    let numberOfSteps = 10;
    let step = 0;
    let x = x1;
    let y = y1;
    let xStep = (x2 - x1) / numberOfSteps;
    let yStep = (y2 - y1) / numberOfSteps;
    let interval = setInterval(function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawCircle(x, y, radius, color, text, textColor);
        x += xStep;
        y += yStep;
        step++;
        if (step == numberOfSteps) {
            clearInterval(interval);
        }
    }
    , 50);
}


drawCircle(100, 100, 70, "red", "1", "black");
drawCircle(300, 300, 70, "red", "2", "black");
drawLineConnectingTwoCircles(100, 100, 300, 300, 70, 70, 5, "black");

let points = calculateNBorderPointsOfCircle(100, 100, 60, 3);

for (var i = 0; i < points.length; i++) {
    drawCircle(points[i][0], points[i][1], 10, "green", i + 1, "black");
}
