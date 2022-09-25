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
        this.nodes = [...nodes];
        // UAV 初始位置為 sink
        this.qTable = this.buildQtable();
        this.sinkNode =  this.getSinkNode();
        this.init();
    }

    init() {
        // this.route = [];
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
        const node = this.nodes[index];
        this.nodes.splice(index, 1);
        return node;
    }

    getNextState() {
        let nextState;
        let action;

        // 小於 epsilon，則隨機取得下一個 state
        if (Math.random() < this.epsilon) {
            action = getRandom(this.nodes.length);
            nextState = this.getNode(action);
        } else {
            const maxReward = Math.max(...this.qTable[this.currState]);
            const action = this.qTable[this.currState].findIndex(reward => reward === maxReward);
            nextState = action;
            const nextReward = Math.max(...this.qTable[nextState]);
            this.qTable[this.currState][action] = this.qTable[this.currState][action] + learning_rate * (
                moveReward + gamma * nextReward - this.qTable[this.currState][action]
            )
        }

        return nextState;
    }

    updateEpsilon() {
        if(this.epsilon > this.minEpsilon) {
            this.epsilon -= this.subNum;
        }
    }

    getRoute() {
        const route = []
        const loopNum = this.nodes.length;
        for(let i=0; i<loopNum; i++) {
            this.currState = this.getNextState();
            this.updateEpsilon();
            route.push(this.currState);
        }
        return route;
    }

    getDistance() {
        console.log('route', this.route)
        let distance = 0;
        for(let i =0; i < this.route.length-2; i++) {
            distance = distance + Math.sqrt(
                Math.pow(this.route[i].xAxis - this.route[i+1].xAxis, 2) +
                Math.pow(this.route[i].yAxis - this.route[i+1].yAxis, 2) 
            )
        }
        return distance;
    }

    updateFinishReward(distance) {
        for(let i =0; i < this.route.length-2; i++) {
            const state = this.route[i].index;
            const nextState = this.route[i+1].index;
            this.qTable[state][nextState] = this.qTable[state][nextState] + distance / 10;
        }
    }

    run() {
        for(let i=0; i<100; i++) {
            console.log('loop', i);
            this.route.push(...this.getRoute());
            // back sink
            this.route.push(this.sinkNode);
            const distance = this.getDistance();
            this.updateFinishReward(distance);
            console.log(this.route);
            this.init();
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
