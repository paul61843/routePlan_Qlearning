function random(range, offset = 0) {
  return Math.floor(Math.random() * (range - offset)) + offset;
}

function getMultiPoint(num) {
    const points = [];
    for(let i = 0; i <num; i++) {
      const x = random(1000);
      const y = random(1000);
      points.push({ name: i, x, y });
    }
    return points;
}



module.exports = getMultiPoint