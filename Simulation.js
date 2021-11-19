// Get element button with id="next"
let nextButton = document.getElementById("next");

// Get element with id="agent-color"
let agentColorElement = document.getElementById("agent-color");

let nodesQuantity = 4;
let agentsQuantity = 20;
let probabilityMatrix = [];
let nodeRadius = 70;
let agentRadius = 12;
let agentCircleReference = 50;
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

// Function that generate html with the probability matrix input
function generateProbabilityMatrixInput() {
    let html = "";
    // Generate header with the nodes names
    html += "<tr>";
    for (var i = -1; i < nodesQuantity; i++) {
        if (i === -1) {
            html += "<th></th>";
        } else {
            html += "<th>" + (i + 1) + "</th>";
        }
    }
    html += "</tr>";

    // Generate rows with the probability matrix
    for (var i = 0; i < nodesQuantity; i++) {
        html += "<tr>";
        for (var j = -1; j < nodesQuantity; j++) {
            if (j == -1) {
                html += "<td>" + (i+1) + "</td>";
            } else {
                html += "<td><input type='number' class='matrix-input' onClick='this.select()' onkeypress='validateInput(event)' id='" + i + "-" + j + "' value='" + simulation.probabilityMatrix[i][j] + "' min='0' max='1' step='0.01'></td>";
            }
        }
        html += "</tr>";
    }

    return html;

}

function validateInput(e){
    if (e.key.match(/[^0-9,]/g)) {
        e.preventDefault();
    }
}

function changeProbabilityMatrix(e) {
    let matrixInputs = document.getElementsByClassName("matrix-input");
    let newProbabilityMatrix = [];
    for (var i = 0; i < nodesQuantity; i++) {
        newProbabilityMatrix[i] = [];
        for (var j = 0; j < nodesQuantity; j++) {
            newProbabilityMatrix[i][j] = parseFloat(matrixInputs[i * nodesQuantity + j].value);
        }
        if (!validateSumOfProbabilityMatrixRow(newProbabilityMatrix[i], i)){
            // Show error-matrix-message id remove hidden
            document.getElementById("error-matrix-message").removeAttribute("hidden");
            return;
        }
    }

    simulation.probabilityMatrix = newProbabilityMatrix;
    drawSimulation();
    $('#exampleModal').modal('hide');
}



function resetSimulationAgents() {
    simulation.resetAgents();
    drawSimulation();
}

function validateSumOfProbabilityMatrixRow(row, rowNumber) {
    let sum = 0;
    for (var i = 0; i < nodesQuantity; i++) {
        sum += row[i];
    }
    if (sum !== 1) {
        return false;
    }
    return true;

}

function setProbabilityMatrix() {
    document.getElementById("probability-matrix").innerHTML = generateProbabilityMatrixInput();
}


setProbabilityMatrix();

document.getElementById("save-matrix").addEventListener("click", changeProbabilityMatrix);

document.getElementById("reset").addEventListener("click", resetSimulationAgents);

$('#exampleModal').modal('handleUpdate');


$('#exampleModal').on('hidden.bs.modal', function (e) {
    console.log(e);
    document.getElementById("error-matrix-message").setAttribute("hidden", "true");
    setProbabilityMatrix();
});

drawSimulation();

