const routePlan = require('./route-plan');
const QLearning = require('./qlearning');
const randomPoints = require('./utils/random-point');

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

function convertMapToNodes(map) {
    map.forEach((rows, y) => {
        rows.forEach((cols, x) => {
            const idx = map.length * y + x;
            if(cols !== '_') {
                nodes.push({ x, y, name: cols});
            }
        })
    });

    return nodes.map((item, index) => ({ ...item, index }));
}

nodes = convertMapToNodes(map);
console.table(nodes);

const qlearning = new QLearning(nodes);
qlearning.run();

// routePlan.init(nodes);
