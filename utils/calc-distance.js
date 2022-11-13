function getDistance(x1, y1, x2, y2) {
    x = x1 - x2;
    y = y1 - y2;
    return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
}

module.exports = getDistance