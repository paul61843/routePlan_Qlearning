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

const mapInfo = [
    { index: 0, estimatedTime: 5, actualTime: 2 },
    { index: 1, estimatedTime: 4, actualTime: 3 },
    { index: 2, estimatedTime: 3, actualTime: 2 },
    { index: 3, estimatedTime: 2, actualTime: 2 },
    { index: 4, estimatedTime: 2, actualTime: 2 },
    { index: 5, estimatedTime: 2, actualTime: 2 },
    { index: 6, estimatedTime: 2, actualTime: 2 },
    { index: 7, estimatedTime: 2, actualTime: 2 },
    { index: 8, estimatedTime: 2, actualTime: 2 },
    { index: 9, estimatedTime: 2, actualTime: 2 },
]

function convertMapToNodes(map) {
    map.forEach((rows, y) => {
        rows.forEach((cols, x) => {
            if(cols !== '_') {
                nodes.push({ x, y, name: cols});
            }
        })
    });
    return nodes.map((item, index) => ({ ...item, ...mapInfo[index], index }));
}

function setConnectedNodes(nodes) {
    return nodes.map(currNode => {
        const connectedNode = nodes.filter(node => {
            console.log(getDistance(currNode.x, currNode.y, node.x, node.y))
            return getDistance(currNode.x, currNode.y, node.x, node.y) <= hopTransmissionDistance
        })

        return { ...currNode, connectedNode }
    })
}

let totalNodes = [];
let nodes = [];
let sinkNode;


totalNodes = convertMapToNodes(map);
// 移除一般節點，只拜訪隔離和電量低的節點
nodes = totalNodes.filter(item => item.name !== 'N').map((item, index) => ({ ...item, index }));
nodes = setConnectedNodes(nodes);

sinkNode = nodes.find(node => node.name === 'S');


const { path, distance } = routePlan.init(nodes);
nodes = path;
const sinkIndex = nodes.findIndex(node => node.name === 'S');

// 調整路徑起點改為 Sink node
nodes = nodes
    .slice(sinkIndex)
    .concat(nodes.slice(0, sinkIndex));

    
let uavBattery = 30;
let uavRemainingBattery = uavBattery - distance - nodes.map(item => item.estimatedTime).reduce((sum, num) => sum + num, 0);

const qlearning = new QLearning(nodes, totalNodes, uavRemainingBattery);
qlearning.run();
