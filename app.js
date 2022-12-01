const routePlan = require('./route-plan');
const QLearning = require('./qlearning');
const randomPoints = require('./utils/random-point');
const getDistance = require('./utils/calc-distance');

const hopTransmissionDistance = 1;

// TODO: 尚未實作隨機產生節點方法

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
    { index: 0, estimatedTime: 5, actualTime: 2, dataNum: 5, battery: 50 },
    { index: 1, estimatedTime: 4, actualTime: 3, dataNum: 2, battery: 50 },
    { index: 2, estimatedTime: 3, actualTime: 2, dataNum: 1, battery: 50 },
    { index: 3, estimatedTime: 2, actualTime: 2, dataNum: 4, battery: 50 },
    { index: 4, estimatedTime: 2, actualTime: 2, dataNum: 0, battery: 50 },
    { index: 5, estimatedTime: 2, actualTime: 2, dataNum: 0, battery: 50 },
    { index: 6, estimatedTime: 2, actualTime: 2, dataNum: 0, battery: 50 },
    { index: 7, estimatedTime: 2, actualTime: 2, dataNum: 0, battery: 50 },
    { index: 8, estimatedTime: 2, actualTime: 2, dataNum: 0, battery: 50 },
    { index: 9, estimatedTime: 2, actualTime: 2, dataNum: 0, battery: 50 },
]

function convertMapToNodes(map) {
    let index = 0;
    map.forEach((rows, y) => {
        rows.forEach((cols, x) => {
            index++;
            if(cols !== '_') {
                nodes.push({ x, y, name: cols + index});
            }
        })
    });
    return nodes.map((item, index) => ({ ...item, ...mapInfo[index], index }));
}

function setConnectedNodes(nodes) {
    return nodes.map(currNode => {
        const connectedNode = nodes.filter(node => {
            return getDistance(currNode.x, currNode.y, node.x, node.y) <= hopTransmissionDistance
        })

        return { ...currNode, connectedNode }
    })
}

let totalNodes = [];
let nodes = [];
let loadBalanceNodes = [];
let sinkNode;


totalNodes = convertMapToNodes(map);
console.log(totalNodes.map(item => ({ name: item.name, index: item.index })))

const isolatedNode = totalNodes
        .filter(item => item.name.includes('I'));

const batterylowNode = totalNodes
        .filter(item => item.name.includes('B'));    
        
nodes = [...isolatedNode, ...batterylowNode].map((item, index) => ({ ...item, index }));        

console.table(nodes);

// 設定各個節點彼此互相連通
nodes = setConnectedNodes(nodes);

// loadBalance 為 電量低的節點
loadBalanceNodes = totalNodes.filter(item => item.name.includes('B'));


sinkNode = nodes.find(node => node.name.includes('S'));


const { path, distance } = routePlan.init(nodes);
// 修正 經過基因演算法 index 不同的問題
nodes = path.map(
    pathNode => ({ ...pathNode, index: totalNodes.findIndex((node) => node.name === pathNode.name) })
);
console.log('app nodes', nodes.map(item => ({ name: item.name, index: item.index })));


const sinkIndex = nodes.findIndex(node => node.name.includes('S'));
// 調整路徑起點改為 Sink node
nodes = nodes
    .slice(sinkIndex)
    .concat(nodes.slice(0, sinkIndex));
    
let uavBattery = 30;
let uavRemainingBattery = Math.floor(uavBattery - distance - nodes.map(item => item.estimatedTime).reduce((sum, num) => sum + num, 0));

const qlearning = new QLearning(nodes, loadBalanceNodes, totalNodes, uavRemainingBattery);
qlearning.run();
