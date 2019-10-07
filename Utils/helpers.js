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



