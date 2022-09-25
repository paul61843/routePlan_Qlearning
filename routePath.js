// setting
const moveReward = -1;

const map = [
    ['_', '_', 'T', 'B', 'S' ],
    ['_', '_', '_', 'T', 'B' ],
    ['I', 'I', '_', '_', 'T' ],
    ['_', 'I', '_', '_', '_' ],
    ['_', '_', '_', 'I', '_' ],
];

class QLearning {

    route = [];
    currState = null;
    sinkNode = null;

    epsilon = 1;
    minEpsilon = 0.05;

    constructor(nodes) {
        this.nodes = nodes;
        // UAV 初始位置為 sink
        this.currState = this.getSinkNode();
        this.sinkNode = this.currState;
    }

    getSinkNode() {
        const sinkNode = this.nodes.findIndex(node => node.name === 'S');
        return this.getNode(sinkNode);
    }

    buildQtable() {
        const qTable = [];
        const tableLen = this.nodes.length;
        for(let i=0; i< tableLen; i++) {
            qTable.push(Array(tableLen).fill(0));
        }
        return qTable;
    }

    getNode(index) {
        const node = this.nodes[index];
        this.nodes.splice(index, 1);
        return node;
    }

    getNextState() {
        let nextState;

        // 小於 epsilon，則隨機取得下一個 state
        if (Math.random() < epsilon) {
            const nextIndex = getRandom(this.nodes.length);

        } else {

        }

        return nextState;
    }

    run(nodes) {

    }
}

let nodes = []

map.forEach((rows, yAxis) => {
    rows.forEach((cols, xAxis) => {
        const idx = map.length * yAxis + xAxis;
        if(cols !== '_') {
            nodes.push({ xAxis, yAxis, name: cols});
        }
    })
});

nodes = nodes.map((item, index) => ({ ...item, index }));

new QLearning(nodes);


function getRandom(x){
    return Math.floor(Math.random() * x);
};
