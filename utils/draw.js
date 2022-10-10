
function draw(path) {
    const offsetX = 20;
    const offsetY = 20;
    
    let pointContent = '';
    let lineContent = ''
    path.forEach(item => {
      pointContent = pointContent + 
        `<circle 
          cx="${item.x + offsetX}" cy="${item.y + offsetY}" 
          r="2" 
          fill="cornflowerblue" />
          <text 
            x="${item.x + offsetX}" 
            y="${item.y + offsetY}"
          >${item.name}</text>`
    })
    
    for(let i = 0; i<path.length -1; i++) {
      lineContent = lineContent +
        `<line + 1 
          x1="${path[i].x + offsetX}" y1="${path[i].y + offsetY}" 
          x2="${path[i + 1].x + offsetX}" y2="${path[i + 1].y + offsetY}"
          stroke="red"; stroke-width:1" />`
    }
    
    lineContent = lineContent +
        `<line + 1 
          x1="${path[path.length - 1].x + offsetX}" y1="${path[path.length - 1].y + offsetY}" 
          x2="${path[0].x + offsetX}" y2="${path[0].y + offsetY}"
          stroke="red"; stroke-width:1" />`
    
    document.getElementById('draw').innerHTML = `
      <svg width="1100" height="1100">
        <rect x="${offsetX}" y="${offsetY}" 
          width="1000" height="1000" stroke="grey" fill="white" />
          ${pointContent}
          ${lineContent}
      </svg>
    `;
  }

draw(gResult[0].path);
