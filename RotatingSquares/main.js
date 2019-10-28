import Square from "../Utils/square.js";
import Vector2D from "../Utils/Vector2D.js";

let square = new Square(new Vector2D(200, 200), 100, Math.PI / 6);

console.log(square);
square.alpha = 0;

console.log(square);
