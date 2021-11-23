// Get element button with id="next"
let nextButton = document.getElementById("next");

// Get element with id="agent-color"
let agentColorElement = document.getElementById("agent-color");
let nodesQuantityInput = document.getElementById("nodes-quantity");
let agentsQuantityInput = document.getElementById("agents-quantity");
// Get canvas size
let canvas = document.getElementById("myCanvas");
let canvasWidth = canvas.width;
let canvasHeight = canvas.height;

// Define inti values
let initialNodesQuantity = 4;
let initialAgentsQuantity = 10;
let probabilityMatrix = setUniformProbabilityMatrix(initialNodesQuantity);
let nodeRadius = estimateOptimalNodeRadiusForDraw(initialNodesQuantity);
let agentRadius = 10;
let agentCircleReference = nodeRadius - 10;
let isColorByIsland = agentColorElement.checked;

nodesQuantityInput.value = initialNodesQuantity;
agentsQuantityInput.value = initialAgentsQuantity;

let simulation = new Simulation(initialNodesQuantity, initialAgentsQuantity, probabilityMatrix);


let backgroundColor = "rgba(61, 121, 253, 0.87)";
let nodeColor = "rgba(29, 206, 32, 1)";
let nodeTextColor = "black";
let edgeColor = "rgba(102, 110, 101, 0.48)";
let agentColor = "red";
let agentTextColor = "black";
let canvasBorderColor = "black";

let colorsList = ["red", "yellow", "fuchsia", "darkslateblue", "green", "blue", "purple", "orange", "brown", "pink", "grey", "darkgrey", "lightgrey", "white"];


// Assign a random position to each node without overlapping with others nodes and fit in the canvas
let nodesPositions = calculateNodePositions(simulation.nodesQuantity);

function estimateOptimalNodeRadiusForDraw(nodesQuantity) {
    let a = Math.log(nodesQuantity * 10000) ;
    console.log(a)
    let estimatedNodeRadius = parseInt(canvasWidth / a);
    return estimatedNodeRadius;
}

function adjustVariablesSize(nodesQuantity) {
    nodeRadius = estimateOptimalNodeRadiusForDraw(nodesQuantity);
    agentCircleReference = nodeRadius - 10;
    agentRadius = parseInt(nodeRadius / 8);
}

function calculateNodePositions(nodesQuantity) {
    estimateOptimalNodeRadiusForDraw(nodesQuantity);
    adjustVariablesSize(nodesQuantity);
    let trys = 1000;
    let newNodesPositions = [];
    for (var i = 0; i < nodesQuantity; i++) {

        let x = Math.floor(Math.random() * (canvasWidth - nodeRadius * 2)) + nodeRadius;
        let y = Math.floor(Math.random() * (canvasHeight - nodeRadius * 2)) + nodeRadius;
        // Check if the node is overlapping with other nodes using nodeRadius
        while (newNodesPositions.some(node => getDistance(node[0], node[1], x, y) < nodeRadius * 2) && trys > 0) {
            x = Math.floor(Math.random() * (canvasWidth - nodeRadius * 2)) + nodeRadius;
            y = Math.floor(Math.random() * (canvasHeight - nodeRadius * 2)) + nodeRadius;
            trys -= 1;
        }
        if (trys <= 0) {
            return null;
        }
        newNodesPositions.push([x, y]);
    }

    return newNodesPositions;
}

function setUniformProbabilityMatrix(nodesQuantity) {
    let probabilityMatrix = [];
    for (var i = 0; i < nodesQuantity; i++) {
        probabilityMatrix[i] = [];
        for (var j = 0; j < nodesQuantity; j++) {
            probabilityMatrix[i][j] = 1 / nodesQuantity;
        }
    }
    return probabilityMatrix;
}

function drawSimulation() {
    clearCanvas();
    fillBackground(backgroundColor)
    drawCanvasBorder(canvasWidth, canvasHeight, 5, canvasBorderColor);

    drawCircles(nodesPositions, nodeRadius, nodeColor, nodeTextColor, isColorByIsland, colorsList);

    drawEdges(nodesPositions, nodeRadius, 1, edgeColor);

    let nodesAgentListDict = simulation.getNodesAgentListDict();

    // Draw all agents in their initial positions using drawAgents
    for (var i = 0; i < simulation.nodesQuantity; i++) {
        drawAgents(nodesAgentListDict[i], nodesPositions[i][0], nodesPositions[i][1], agentCircleReference, agentRadius, colorsList, agentTextColor, isColorByIsland, simulation.agents);
    }
}

function nextStep() {
    simulation.runOneEpoch();
    drawSimulation();
    updateAgentsQuantityByIslandList();
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
    for (var i = -1; i < simulation.nodesQuantity; i++) {
        if (i === -1) {
            html += "<th></th>";
        } else {
            html += "<th>" + (i + 1) + "</th>";
        }
    }
    html += "</tr>";

    // Generate rows with the probability matrix
    for (var i = 0; i < simulation.nodesQuantity; i++) {
        html += "<tr>";
        for (var j = -1; j < simulation.nodesQuantity; j++) {
            if (j == -1) {
                html += "<td>" + (i+1) + "</td>";
            } else {
                html += "<td><input type='number' class='matrix-input' onClick='this.select()' onkeypress='validateMatrixInput(event)' id='" + i + "-" + j + "' value='" + parseFloat(simulation.probabilityMatrix[i][j] * 100) + "' min='0' max='1' step='0.01'></td>";
            }
        }
        html += "</tr>";
    }

    return html;

}

function updateAgentsQuantityByIslandList() {
    let html = "";
    let nodesAgentListDict = simulation.getNodesAgentListDict();
    for (var i = 0; i < simulation.nodesQuantity; i++) {
        html += "<li>";
        // island id bold
        html += "<b>" + (i + 1) + ": </b>";
        // check if exists i key on dict
        if (nodesAgentListDict.hasOwnProperty(i)) {
            html += nodesAgentListDict[i].length;
        } else {
            html += 0;
        }
        html += "</li>";
    }

    document.getElementById("agents-by-island-quantity-list").innerHTML = html;
}

function validateMatrixInput(e){
    if (e.key.match(/[^0-9,]/g)) {
        e.preventDefault();
    }
}

function validatePositiveIntegerInput(e) {
    // Validate positive integer input and allows press enter key
    if (e.key.match(/[^0-9,]/g) && e.key !== "Enter") {
        e.preventDefault();
    }
}

function changeProbabilityMatrix(e) {
    let matrixInputs = document.getElementsByClassName("matrix-input");
    let newProbabilityMatrix = [];
    for (var i = 0; i < simulation.nodesQuantity; i++) {
        newProbabilityMatrix[i] = [];
        for (var j = 0; j < simulation.nodesQuantity; j++) {
            newProbabilityMatrix[i][j] = parseFloat(matrixInputs[i * simulation.nodesQuantity + j].value) / 100;
        }
        if (!validateSumOfProbabilityMatrixRow(newProbabilityMatrix[i], i)){
            // Show error-matrix-message id remove hidden
            document.getElementById("error-matrix-message").innerHTML = "La suma de la fila <b>"  + (i + 1) + "</b> no es igual a 100 !!!";
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
    for (var i = 0; i < simulation.nodesQuantity; i++) {
        sum += row[i];
    }
    // Check if the sum of the row is 1 with a tolerance of 0.01
    return sum <= 1.0001 && sum >= 0.9999;
}

function setProbabilityMatrix() {
    document.getElementById("probability-matrix").innerHTML = generateProbabilityMatrixInput();
}


setProbabilityMatrix();

document.getElementById("save-matrix").addEventListener("click", changeProbabilityMatrix);

document.getElementById("reset").addEventListener("click", resetSimulationAgents);

$('#exampleModal').modal('handleUpdate');


$('#exampleModal').on('hidden.bs.modal', function (e) {
    document.getElementById("error-matrix-message").setAttribute("hidden", "true");
    setProbabilityMatrix();
});

let nodesQuantityExcededCounter = 0;

nodesQuantityInput.addEventListener('change', function (e) {
    newNodesQuantity = parseInt(e.target.value);
    newNodesPositions = calculateNodePositions(newNodesQuantity);
    if (newNodesPositions === null) {
        // set input value to the previous value
        nodesQuantityInput.value = simulation.nodesQuantity;
        // Show error modal
        if (nodesQuantityExcededCounter === 0) {
            document.getElementById("error-message").innerHTML = "Nadie puede tener tantas islas.<br><br>Cuando seas menos codicioso vuelve y pídeme una cantidad de islas razonable.<br><br>O vuelve a probar suerte, como quieras. <br><br> Gracias por su comprensión :)";
        }
        else if (nodesQuantityExcededCounter === 1) {
            document.getElementById("error-message").innerHTML = "Al parecer tu suerte no ha cambiado. <br><br> Insisto que tu codicia debe ser el problema. <br><br> Evita caer al lado oscuro. <br><br> Pídeme menos islas por favor !!!"
        }
        else {
            // Change error message
            document.getElementById("error-message").innerHTML = "Usted no aprende verdad !! <br><br> Y pensar que me caías bien :(";
        }
        $('#errorModal').modal('show');
        nodesQuantityExcededCounter++;
    } else {
        nodesPositions = newNodesPositions;
        probabilityMatrix = setUniformProbabilityMatrix(newNodesQuantity);
        simulation = new Simulation(newNodesQuantity, simulation.agentsQuantity, probabilityMatrix);
        setProbabilityMatrix();
        drawSimulation();
        updateAgentsQuantityByIslandList();
    }

});

let agentsQuantityExcededCounter = 0;
agentsQuantityInput.addEventListener('change', function (e) {
    agentsQuantity = parseInt(e.target.value);
    if (agentsQuantity > 500) {
        agentsQuantityInput.value = simulation.agentsQuantity;
        if (agentsQuantityExcededCounter === 0) {
            document.getElementById("error-message").innerHTML = "Esto no es una fiesta en la playa. <br><br> No puede haber tanta gente junta. <br><br> Seguimos en pandemia !!";
        } else {
            document.getElementById("error-message").innerHTML = "Alguien puede pensar en los niños !!";
        }
        $('#errorModal').modal('show');
        agentsQuantityExcededCounter++;
    } else {
        simulation.changeAgentsQuantity(agentsQuantity);
        setProbabilityMatrix();
        drawSimulation();
        updateAgentsQuantityByIslandList();
    }

});



drawSimulation();
updateAgentsQuantityByIslandList();

