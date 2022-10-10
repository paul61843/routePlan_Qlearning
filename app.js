const routePlan = require('./route-plan');
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
                nodes.push({ x, y, id: cols});
            }
        })
    });

    return nodes.map((item, index) => ({ ...item, name: index }));
}

nodes = convertMapToNodes(map);
console.table(nodes);
routePlan.init(nodes);
