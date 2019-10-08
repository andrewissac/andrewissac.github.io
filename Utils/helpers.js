export var epsilon = 0.001;

// #region trigonometry
export function RadianToDegree(alpha){
    return alpha * 180 / Math.PI;
}

export function DegreeToRadian(alpha){
    return alpha * Math.PI / 180;
}

export function Sin(alpha, radian = true){
    return radian === true ? Math.sin(alpha) : Math.sin(DegreeToRadian(alpha));
}

export function Cos(alpha, radian = true){
    return radian === true ? Math.sin(alpha) : Math.sin(DegreeToRadian(alpha));
}
// #endregion

// #region generate random entities
export function GetRandomInt(max){
    return Math.floor(Math.random() * Math.floor(max));
}

export function GetRandomIntFromRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
  
export function GetRandomColor(colors) {
    return colors[Math.floor(Math.random() * colors.length)];
}
// #endregion
  
export function Distance(x1, y1, x2, y2) {
    const xDist = x2 - x1
    const yDist = y2 - y1
    return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
}

// #region drawing functions
export function drawHorizontalLine(context, posY, canvasWidth, rgbaStroke){
    context.save();
    context.strokeStyle = rgbaStroke;
    context.moveTo(0, posY);
    context.lineTo(canvasWidth, posY);
    context.restore();
  }

 export function drawVerticalLine(context, posX, canvasHeigth, rgbaStroke){
    context.save();
    context.strokeStyle = rgbaStroke;
    context.moveTo(posX, 0);
    context.lineTo(posX, canvasHeigth);
    context.restore();
  }

  export function drawCircle(context, origin, radius, rgbaStroke){
    context.save();
    context.strokeStyle = rgbaStroke;
    context.arc(origin.x, origin.y, radius, 0, 2 * Math.PI);
    context.restore();
  }

  export function drawFilledCircle(context, origin, radius, rgbaStroke, rgbaFill){
    context.save();
    context.fillStyle = rgbaFill;
    context.strokeStyle = rgbaStroke;
    context.arc(origin.x, origin.y, radius, 0, 2 * Math.PI);
    context.restore();
  }

  export function range(start, end, step = 1) {
    const allNumbers = [start, end, step].every(Number.isFinite);
  
    if (!allNumbers) {
      throw new TypeError('range() expects only finite numbers as arguments.');
    }
    
    if (step <= 0) {
      throw new Error('step must be a number greater than 0.');
    }
    
    if (start > end) {
      step = -step;
    }

    const length = Math.floor(Math.abs((end - start) / step));
    return Array.from(Array(length), (x, index) => start + index * step);
    
  }
// #endregion


