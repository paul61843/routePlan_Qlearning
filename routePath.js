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
    nodes = [];
    originalNodes = []
    qTable = [];
    currState = null;
    sinkNode = null;

    // epsilon 參數
    epsilon = 1;
    minEpsilon = 0.05;
    subNum = 0.001;

    gamma = 0.9;
    learning_rate = 0.8;
    moveReward = -1;

    constructor(nodes) {
        this.originalNodes = [...nodes];
        this.nodes = [...this.originalNodes];
        // UAV 初始位置為 sink
        this.qTable = this.buildQtable();
        this.init();
    }

    init() {
        this.route = [];
        this.nodes = [...this.originalNodes];
        this.sinkNode =  this.getSinkNode();
        this.currState = this.sinkNode;
        this.route.push(this.currState);
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
        const nodeIndex = this.nodes.findIndex((item) => item.index === index);
        const [node] = this.nodes.splice(nodeIndex, 1);

        return node;
    }

    getNextState() {

        let nextState;

        // 小於 epsilon，則隨機取得下一個 state
        // if (Math.random() < this.epsilon) {
        //     actionIndex = getRandom(this.nodes.length);
        //     console.log('actionIndex random', actionIndex)
        //     nextState = this.getNode(actionIndex);
        // } else {
            const maxReward = this.getReward(this.currState.index);
            const maxRewardIndex = this.getStateQTable(this.currState.index).find(item => item.value === maxReward).index;
            console.log('getNextState')
            console.log(nextState);
            nextState = this.getNode(maxRewardIndex);
            const nextMaxReward = this.getReward(nextState.index)
            console.log('currIndex', this.currState.index, 'nextIndex', nextState.index)
            this.qTable[this.currState.index][nextState.index] = this.updateQTable(this.currState.index, nextState.index, nextMaxReward);
            console.table(this.qTable);
        // }

        return nextState;
    }

    getStateQTable(stateIndex) {
        const nodesIndex = this.nodes.map(item => item.index);
        return this.qTable[stateIndex]
            .map((value, index) => ({ value, index }))
            .filter(item =>  nodesIndex.includes(item.index));
    }

    getReward(stateIndex) {
        const stateQTable = this.getStateQTable(stateIndex);
        return Math.max(...stateQTable.map(item => item.value));
    }

    updateQTable(currStateIndex, nextStateIndex, nextMaxReward) {
        return this.qTable[currStateIndex][nextStateIndex] + this.learning_rate * (
            this.moveReward + this.gamma * nextMaxReward - this.qTable[currStateIndex][nextStateIndex]
        )
    }

    updateLastNodeQTable(currStateIndex, nextStateIndex) {
        return this.qTable[currStateIndex][nextStateIndex] + this.learning_rate * (
            this.moveReward - this.qTable[currStateIndex][nextStateIndex]
        )
    }

    setRoute() {
        const loopNum = this.nodes.length;
        for(let i=0; i<loopNum - 1; i++) {
            this.currState = this.getNextState();
            this.route.push(this.currState);
        }
        // 計算倒數第二個的點獎勵值
        const lastNode = this.nodes[0];
        const maxReward = this.getReward(this.sinkNode.index)
        this.qTable[this.currState.index][lastNode.index] = this.updateQTable(this.currState.index, lastNode.index, maxReward);
        this.currState = lastNode;
        // 計算最後的點的獎勵值
        this.qTable[this.currState.index][this.sinkNode.index] = this.updateLastNodeQTable(this.currState.index, this.sinkNode.index);
        this.updateEpsilon();
        console.table(this.qTable);
    }

    updateEpsilon() {
        if(this.epsilon > this.minEpsilon) {
            this.epsilon -= this.subNum;
        }
    }

    getDistance() {
        let distance = 0;
        console.table(this.route);
        for (let i = 0; i < this.route.length -1; i++) {
            distance = distance + Math.sqrt(
                Math.pow(this.route[i].xAxis - this.route[i+1].xAxis, 2) +
                Math.pow(this.route[i].yAxis - this.route[i+1].yAxis, 2) 
            )
        }
        return distance;
    }

    updateFinishReward(distance) {
        for(let i = 0; i < this.route.length-1; i++) {
            const state = this.route[i].index;
            const nextState = this.route[i+1].index;
            this.qTable[state][nextState] = this.qTable[state][nextState] + distance / 10;
        }
    }

    run() {
        for(let i=0; i<100; i++) {
            // console.log('==========================', i, '==========================');
            this.setRoute()
            // back sink

            console.table(this.route);
            // const distance = this.getDistance();
            // this.updateFinishReward(distance);
            this.init();
            // console.log('==========================', i, 'end', '==========================');

        }
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

const qlearning = new QLearning(nodes);
qlearning.run();

function getRandom(x){
    return Math.floor(Math.random() * x);
};
