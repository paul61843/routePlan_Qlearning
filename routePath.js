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

    gamma = 0.95;
    learning_rate = 0.8;
    moveReward = -1;

    constructor(nodes) {
        this.originalNodes = [...nodes];
        this.nodes = [...this.originalNodes];
        // UAV 初始位置為 sink
        this.qTable = this.buildQtable();
        this.sinkNode =  this.getSinkNode();
        this.init();
    }

    init() {
        this.route = [];
        this.nodes = [...this.originalNodes];
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
        console.log(this.currState)

        // 小於 epsilon，則隨機取得下一個 state
        // if (Math.random() < this.epsilon) {
        //     actionIndex = getRandom(this.nodes.length);
        //     console.log('actionIndex random', actionIndex)
        //     nextState = this.getNode(actionIndex);
        // } else {
            const nodesIndex = this.nodes.map(item => item.index);
            const currStateQTable = this.qTable[this.currState.index]
                .map((value, index) => ({ value, index }))
                .filter(item => nodesIndex.includes(item.index));

            // console.log('==========currStateQTable==============')
            // console.table(currStateQTable)
            // console.log('==========currStateQTable end==========')

            const maxReward = Math.max(...currStateQTable.map(item => item.value));
            const maxRewardIndex = currStateQTable.find(item => item.value === maxReward).index;

            nextState = this.getNode(maxRewardIndex);
            const nextStateQTable = this.qTable[nextState.index]
                .map((value, index) => ({ value, index }))
                .filter(item => nodesIndex.includes(item.index));

            const nextReward = Math.max(...nextStateQTable.map(item => item.value));

            this.qTable[this.currState.index][nextState.index] = this.qTable[this.currState.index][nextState.index] + this.learning_rate * (
                this.moveReward + this.gamma * nextReward - this.qTable[this.currState.index][nextState.index]
            )
            console.table(this.qTable)
        // }

        return nextState;
    }

    updateEpsilon() {
        if(this.epsilon > this.minEpsilon) {
            this.epsilon -= this.subNum;
        }
    }

    setRoute() {
        const loopNum = this.nodes.length;
        console.log(loopNum);
        for(let i=0; i<loopNum; i++) {
            this.currState = this.getNextState();
            this.updateEpsilon();
            this.route.push(this.currState);
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
            this.route.push(this.sinkNode);
            // console.table(this.route);
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
