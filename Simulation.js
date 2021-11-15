let nodesQuantity = 5;
let agentsQuantity = 10;
let probabilityMatrix = [];
let nodeRadius = 70;
let agentRadius = 20;
let agentCircleReference = 55;

let backgroundColor = "rgba(66, 199, 58, 1)";
let nodeColor = "rgba(182, 109, 27, 1)";
let nodeTextColor = "black";
let edgeColor = "rgba(170, 57, 58, 1)";
let agentColor = "blue";
let agentTextColor = "black";
let canvasBorderColor = "black";

// Get canvas size
let canvas = document.getElementById("myCanvas");
let canvasWidth = canvas.width;
let canvasHeight = canvas.height;

// Assign a random position to each node without overlapping with others nodes and fit in the canvas
let nodesPositions = [];
for (var i = 0; i < nodesQuantity; i++) {

    let x = Math.floor(Math.random() * (canvasWidth - nodeRadius * 2)) + nodeRadius;
    let y = Math.floor(Math.random() * (canvasHeight - nodeRadius * 2)) + nodeRadius;
    // Check if the node is overlapping with other nodes using nodeRadius
    while (nodesPositions.some(node => getDistance(node[0], node[1], x, y) < nodeRadius * 2)) {
        x = Math.floor(Math.random() * (canvasWidth - nodeRadius * 2)) + nodeRadius;
        y = Math.floor(Math.random() * (canvasHeight - nodeRadius * 2)) + nodeRadius;
    }
    nodesPositions.push([x, y]);
}

// Build probability matrix
for (var i = 0; i < nodesQuantity; i++) {
    probabilityMatrix[i] = [];
    for (var j = 0; j < nodesQuantity; j++) {
        probabilityMatrix[i][j] = 1 / nodesQuantity;
    }
}

for (var i = 0; i < nodesQuantity; i++) {
    probabilityMatrix[0][i] = 0;
}

probabilityMatrix[0][nodesQuantity - 1] = 1;

let simulation = new Simulation(nodesQuantity, agentsQuantity, probabilityMatrix);


function drawSimulation() {
    clearCanvas();
    fillBackground(backgroundColor)
    drawCanvasBorder(canvasWidth, canvasHeight, 5, canvasBorderColor);

    drawCircles(nodesPositions, nodeRadius, nodeColor, nodeTextColor);

    drawEdges(nodesPositions, nodeRadius, 1, edgeColor);

    let nodesAgentListDict = simulation.getNodesAgentListDict();

    // Draw all agents in their initial positions using drawAgents
    for (var i = 0; i < nodesQuantity; i++) {
        drawAgents(nodesAgentListDict[i], nodesPositions[i][0], nodesPositions[i][1], agentCircleReference, agentRadius, agentColor, agentTextColor);
    }
}

function nextStep() {
    simulation.runOneEpoch();
    drawSimulation();
}

// Get element button with id="next"
let nextButton = document.getElementById("next");

// Add event listener to call drawSimulation on click
nextButton.addEventListener("click", nextStep);

drawSimulation();