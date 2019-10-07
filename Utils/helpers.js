export function RadianToDegree(alpha){
    return alpha * 180 / Math.PI;
}

export function DegreeToRadian(alpha){
    return alpha * Math.PI / 180;
}

export var epsilon = 0.001;

export function GetRandomInt(max){
    return Math.floor(Math.random() * Math.floor(max));
}

export function GetRandomIntFromRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
  
export function GetRandomColor(colors) {
    return colors[Math.floor(Math.random() * colors.length)];
}
  
export function Distance(x1, y1, x2, y2) {
    const xDist = x2 - x1
    const yDist = y2 - y1
    return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
}

