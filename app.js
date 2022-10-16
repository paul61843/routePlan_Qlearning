const routePlan = require('./route-plan');
const QLearning = require('./qlearning');
const randomPoints = require('./utils/random-point');
const getDistance = require('./utils/calc-distance');

const hopTransmissionDistance = 1;

/**
 * S: sink
 * B: Battery low node
 * N: Normal node
 * I: isolated node
 */
 const map = [
    ['_', '_', 'N', 'B', 'S' ],
    ['_', '_', '_', 'N', 'B' ],
    ['I', 'I', '_', '_', 'N' ],
    ['_', 'I', '_', '_', '_' ],
    ['_', '_', '_', 'I', '_' ],
];

let nodes = []
let sinkNode;

function convertMapToNodes(map) {
    map.forEach((rows, y) => {
        rows.forEach((cols, x) => {
            if(cols !== '_') {
                nodes.push({ x, y, name: cols});
            }
        })
    });

    return nodes.map((item, index) => ({ ...item, index }));
}

function setConnectedNodes(nodes) {
    const sinkNode = nodes.find(node => node.name === 'S');
    return nodes.map(currNode => {
        const connectedNode = nodes.filter(node => {
            console.log(getDistance(currNode.x, currNode.y, node.x, node.y))
            return getDistance(currNode.x, currNode.y, node.x, node.y) <= hopTransmissionDistance
        })

        return { ...currNode, connectedNode }
    })
}


nodes = convertMapToNodes(map);
nodes = setConnectedNodes(nodes);

sinkNode = nodes.find(node => node.name === 'S');


console.table(nodes);

// const routePlaning = routePlan.init(nodes);
// console.log(routePlaning)

// const qlearning = new QLearning(nodes);
// qlearning.run();

// routePlan.init(nodes);
