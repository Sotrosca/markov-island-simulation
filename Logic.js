class Simulation {

    constructor(nodesQuantity, agentsQuantity, probabilityMatrix) {
        this.nodesQuantity = nodesQuantity;
        this.agentsQuantity = agentsQuantity;
        this.agents = this.initAgents(agentsQuantity);
        this.probabilityMatrix = probabilityMatrix;
    }

    initAgents(agentsQuantity) {
        let agents = [];
        for (var i = 0; i < agentsQuantity; i++) {
            agents.push(new Agent(i, this.getRandomNode()));
        }

        return agents;
    }

    getRandomNode() {
        // Get random node
        return Math.floor(Math.random() * this.nodesQuantity);
    }

    getWeigthedRandomNode(weights) {
        // Get random node with probability
        let random = Math.random();
        let sum = 0;
        for (var i = 0; i < this.nodesQuantity; i++) {
            sum += weights[i];
            if (random < sum) {
                return i;
            }
        }
    }

    runOneEpoch(){
        // Run one epoch
        for (var i = 0; i < this.agentsQuantity; i++) {
            this.agents[i].move(this.getWeigthedRandomNode(this.probabilityMatrix[this.agents[i].node]));
        }
    }

    getNodesAgentListDict() {
        let nodesAgentListDict = {};
        for (var i = 0; i < this.agentsQuantity; i++) {
            if (nodesAgentListDict[this.agents[i].node] == undefined) {
                nodesAgentListDict[this.agents[i].node] = [];
            }
            nodesAgentListDict[this.agents[i].node].push(this.agents[i].id);
        }
        return nodesAgentListDict;
    }
}

class Agent {
    constructor(id, initNode) {
        this.id = id;
        this.node = initNode;
        this.initNode = initNode;
    }

    move(newNode) {
        this.node = newNode;
    }
}

