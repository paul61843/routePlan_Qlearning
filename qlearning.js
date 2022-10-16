// setting

const loopNum = 1000; // 迴圈執行次數

let minRoute = [];
let minDistance = Infinity;


// TODO: 尚未實作隨機產生節點方法

// ============= utils =============
function convertDecimalTwo(num) {
    return Number(num.toFixed(2));
}

function negativeToZero(num) {
    return num >= 0 ? num : 0;
}

function setMinDistance(distance, route) {
    
    console.log('19', minDistance, distance)
    if (minDistance > distance) {
        minDistance = distance;
        minRoute = route;
    }
}

function getRandom(x){
    return Math.floor(Math.random() * x);
};

// ============= utils =============

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
    moveReward = 0;

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
        if (Math.random() < this.epsilon) {
            const actionIndex = getRandom(this.nodes.length);
            nextState = this.getNode(actionIndex);
        } else {
            const maxReward = this.getReward(this.currState.index);
            const maxRewardIndex = this.getStateQTable(this.currState.index).find(item => item.value === maxReward).index;
            nextState = this.getNode(maxRewardIndex);
            const nextMaxReward = this.getReward(nextState.index)
            this.qTable[this.currState.index][nextState.index] = this.updateQTable(this.currState.index, nextState.index, nextMaxReward);
        }

        return nextState;
    }

    getStateQTable(stateIndex) {
        return this.qTable[stateIndex]
            .map((value, index) => ({ value, index }))
    }

    getReward(stateIndex) {
        const stateQTable = this.getStateQTable(stateIndex);
        return Math.max(...stateQTable.map(item => item.value));
    }

    updateQTable(currStateIndex, nextStateIndex, nextMaxReward) {
        return negativeToZero(convertDecimalTwo(this.qTable[currStateIndex][nextStateIndex] + this.learning_rate * (
            this.moveReward + this.gamma * nextMaxReward - this.qTable[currStateIndex][nextStateIndex]
        )))
    }

    updateLastNodeQTable(currStateIndex, nextStateIndex) {
        return negativeToZero(convertDecimalTwo(this.qTable[currStateIndex][nextStateIndex] + this.learning_rate * (
            this.moveReward - this.qTable[currStateIndex][nextStateIndex]
        )))
    }

    setRoute() {
        const nodeLen = this.nodes.length;
        for(let i=0; i<nodeLen - 1; i++) {
            this.currState = this.getNextState();
            this.route.push(this.currState);
        }
        // 計算倒數第二個的點獎勵值
        const lastNode = this.nodes[0];
        const maxReward = this.getReward(this.sinkNode.index);
        this.qTable[this.currState.index][lastNode.index] = this.updateQTable(this.currState.index, lastNode.index, maxReward);
        console.log('141', this.qTable[this.currState.index][lastNode.index])
        this.currState = lastNode;
        this.route.push(lastNode);

        // 計算最後的點的獎勵值
        this.qTable[this.currState.index][this.sinkNode.index] = this.updateLastNodeQTable(this.currState.index, this.sinkNode.index);
        this.updateEpsilon();
        this.route.push(this.sinkNode);
    }

    updateEpsilon() {
        if (this.epsilon > this.minEpsilon) {
            this.epsilon -= this.subNum;
        }
    }

    getDistance() {
        let distance = 0;
        for (let i = 0; i < this.route.length -1; i++) {
            distance = distance + Math.sqrt(
                Math.pow(this.route[i].x - this.route[i+1].x, 2) +
                Math.pow(this.route[i].y - this.route[i+1].y, 2) 
            )
        }
        return distance;
    }

    updateDistanceReward(distance) {
        for(let i = 0; i < this.route.length - 1; i++) {
            const state = this.route[i].index;
            const nextState = this.route[i+1].index;
            const reward = minDistance === Infinity ? ( 1 / distance * 10) : 1 / (minDistance - distance) * 10 ;
            const qValue = this.qTable[state][nextState] + reward;
            this.qTable[state][nextState] = negativeToZero(convertDecimalTwo(qValue));
        }
        console.log(distance, minDistance);
    }

    run() {
        console.time();
        for(let i=0; i<= loopNum; i++) {
            this.setRoute()
            // back sink
            
            const distance = this.getDistance();
            this.updateDistanceReward(distance);
            
            setMinDistance(distance, this.route);
            this.init();

            console.log('==========================', i, '==========================');
            console.table(this.qTable);
            console.log('distance', distance);
            console.log('==========================', i, 'end', '==========================');
        }
        console.timeEnd();
    }
}


module.exports = QLearning;