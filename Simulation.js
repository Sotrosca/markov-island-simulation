// Get element button with id="next"
let nextButton = document.getElementById("next");

// Get element with id="agent-color"
let agentColorElement = document.getElementById("agent-color");

let nodesQuantity = 10;
let agentsQuantity = 10;
let probabilityMatrix = [];
let nodeRadius = 120;
let agentRadius = 20;
let agentCircleReference = 100;
let isColorByIsland = agentColorElement.checked;

let backgroundColor = "rgba(61, 121, 253, 0.87)";
let nodeColor = "rgba(29, 206, 32, 1)";
let nodeTextColor = "black";
let edgeColor = "rgba(102, 110, 101, 0.48)";
let agentColor = "red";
let agentTextColor = "black";
let canvasBorderColor = "black";

let colorsList = ["red", "yellow", "fuchsia", "darkslateblue", "green", "blue", "purple", "orange", "brown", "pink", "grey", "darkgrey", "lightgrey", "white"];

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

    drawCircles(nodesPositions, nodeRadius, nodeColor, nodeTextColor, isColorByIsland, colorsList);

    drawEdges(nodesPositions, nodeRadius, 1, edgeColor);

    let nodesAgentListDict = simulation.getNodesAgentListDict();

    // Draw all agents in their initial positions using drawAgents
    for (var i = 0; i < nodesQuantity; i++) {
        drawAgents(nodesAgentListDict[i], nodesPositions[i][0], nodesPositions[i][1], agentCircleReference, agentRadius, colorsList, agentTextColor, isColorByIsland, simulation.agents);
    }
}

function nextStep() {
    simulation.runOneEpoch();
    drawSimulation();
}

// Add event listener to agent-color element
agentColorElement.addEventListener("change", function (e) {
    isColorByIsland = e.target.checked;
    drawSimulation();
});

// Add event listener to call drawSimulation on click
nextButton.addEventListener("click", nextStep);


drawSimulation();

