// setting

const loopNum = 1; // 執行次數

let minDistance = Infinity;
let minRoute = [];

// ============= utils =============
function convertDecimalTwo(num) {
    return Number(num.toFixed(2));
}

function saveMinDistance(distance, route) {
    if (distance < minDistance) {
        minDistance = distance;
        minRoute = route;
    }
}

function negativeToZero(num) {
    return num >= 0 ? num : 0;
}

function setMinDistance(distance, route) {
    
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
    vistedNode = []
    qTable = [];
    qTableCols = [];
    totalNodes = [];
    remainNodes = [];
    originalRemainNodes = []
    qTableColLen = 0
    currState = null;
    sinkNode = null;


    // epsilon 參數
    epsilon = 1;
    minEpsilon = 0.05;
    subNum = 0.001;

    gamma = 0.9;
    learning_rate = 0.8;
    moveReward = 0;

    /**
     * nodes UAV拜訪節點
     * remainNodes 剩餘節點
     * totalNodes 全部節點
     * uavRemainingBattery 無人跡剩餘電量
     */
    constructor(nodes, remainNodes, totalNodes, uavRemainingBattery) {
        // console.log('constructor', nodes, remainNodes, totalNodes, uavRemainingBattery)
        // 1 是選擇前往下一個節點的情況
        this.remainNodes = [...remainNodes];
        this.originalRemainNodes = [...remainNodes];
        // +1 代表選擇不增加節點，繼續走原本的拜訪路徑
        this.qTableColLen = this.remainNodes.length + 1;
        this.vistedNode = [...nodes]; // 未加入 load balance 的拜訪路徑
        this.nodes = [...this.vistedNode];
        this.totalNodes = totalNodes;
        // UAV 初始位置為 sink
        this.qTable = this.buildQtable();
        this.init();
    }

    init() {
        this.route = [];
        this.nodes = [...this.vistedNode];
        this.remainNodes = [...this.originalRemainNodes];
        this.sinkNode =  this.nodes.shift();
        this.currState = this.sinkNode;
        this.route.push(this.currState);
    }

    getSinkNode() {
        const sinkNode = this.nodes.findIndex(node => node.name.includes('S'));
        return this.getNode(sinkNode);
    }

    buildQtable() {
        const qTable = [];
        const tableLen = this.totalNodes.length;
        for (let i=0; i< tableLen; i++) {
            qTable.push(Array(this.qTableColLen).fill(0));
        }
        return qTable;
    }

    getNode(index) {
        const nodeIndex = this.totalNodes.findIndex((item) => item.index === index);
        // const [node] = this.totalNodes.splice(nodeIndex, 1);

        return node;
    }


    getRemainNode(index) {
    }

    getNextState() {

        let action;

        // 小於 epsilon，則隨機取得下一個 state
        // if (Math.random() < this.epsilon) {
            const remainNodeLen = this.remainNodes.length + 1
            let actionIndex = getRandom(remainNodeLen);
        // } else {
        //     const maxReward = this.getMaxReward(this.currState.index);
        //     const maxRewardIndex = this.getStateQTable(this.currState.index).find(item => item.value === maxReward).index;
        //     action = this.getNode(maxRewardIndex);
        // }
        // 不選擇繼續拜訪下一個節點，而選擇拜訪剩餘節點
        if (actionIndex !== this.remainNodes.length) {
            action = this.getRemainNode(actionIndex);
            actionIndex = this.originalRemainNodes.findIndex(item => item.name === action.name);
        } else {
            action = this.nodes.shift();
            actionIndex = this.originalRemainNodes.length;
        }

        this.qTable[this.currState.index][actionIndex] = this.updateQTable(this.currState.index, actionIndex);            
        console.log(this.currState.name);
        console.log(this.currState.index)
        return action;
    }

    getStateQTable(stateIndex) {
        return this.qTable[stateIndex]
            .map((value, index) => ({ value, index }))
    }

    getMaxReward(stateIndex) {
        const stateQTable = this.getStateQTable(stateIndex);
        return Math.max(...stateQTable.map(item => item.value));
    }

    getRemainNode(index) {
        const [node] = this.remainNodes.splice(index, 1);
        return node;
    }

    getActionReward(state, action) {

        return 10;
    }

    updateQTable(state, action) {
        const actionReward = this.getActionReward(state, action);
        const maxReard = this.getMaxReward(state);

        return negativeToZero(convertDecimalTwo(this.qTable[state][action] + this.learning_rate * (
            actionReward + this.gamma * maxReard - this.qTable[state][action]
        )))
    }

    updateLastNodeQTable(state, action) {
        return negativeToZero(convertDecimalTwo(this.qTable[state][action] + this.learning_rate * (
            this.moveReward - this.qTable[state][action]
        )))
    }

    setRoute() {
        while(this.nodes.length > 0) {
            this.currState = this.getNextState();
            this.route.push(this.currState);
        }

        // 計算倒數第二個的點獎勵值
        // const lastNode = this.nodes[0];
        // const maxReward = this.getMaxReward(this.sinkNode.index);
        // this.qTable[this.currState.index][lastNode.index] = this.updateQTable(this.currState.index, lastNode.index, maxReward);
        // console.log('141', this.qTable[this.currState.index][lastNode.index])
        // this.currState = lastNode;
        // this.route.push(lastNode);

        // 計算最後的點的獎勵值
        // this.qTable[this.currState.index][this.sinkNode.index] = this.updateLastNodeQTable(this.currState.index, this.sinkNode.index);
        // this.updateEpsilon();
        // this.route.push(this.sinkNode);
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
        saveMinDistance(distance, this.route);
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
    }

    run() {
        console.time();
        for(let i=0; i< loopNum; i++) {
            this.setRoute()
            // back sink
            
            const distance = this.getDistance();
            // this.updateDistanceReward(distance);
            
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