import Vector2D from "../Utils/Vector2D.js"
import * as helpers from "../Utils/helpers.js"

// #region global variables
var canvasHeight = 500;
var canvasWidth = 500;
var canvasMiddle = new Vector2D(Math.floor(canvasWidth/2 + 0.5), Math.floor(canvasHeight/2 + 0.5));
// #endregion

// Get canvas and context of canvas
var canvas = document.getElementById("myCanvas");
canvas.width = canvasWidth;
canvas.height = canvasHeight;
var ctx = canvas.getContext('2d');

// #region drawing functions
function drawPoint(point){
    if(typeof(point) === 'undefined' || point === null) { return; }
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = "#FFFF00";
    ctx.fillRect(point.x, point.y, 1, 1);
    ctx.restore();
  }

  function drawCircle(origin, radius, rgbaStroke){
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = rgbaStroke;
    ctx.arc(origin.x, origin.y, radius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.restore();
  }

  function drawFilledCircle(origin, radius, rgbaStroke, rgbaFill){
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = rgbaFill;
    ctx.strokeStyle = rgbaStroke;
    ctx.arc(origin.x, origin.y, radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
// #endregion

const radius = Math.floor(canvasWidth/2);
let alpha = 0;
let smallCirclePos = new Vector2D(0, 0);
// #region animation function
    function draw(){
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        const x = canvasMiddle.x + radius * helpers.Cos(alpha, false);
        const y = canvasMiddle.y + radius * helpers.Sin(alpha+90, false);
        smallCirclePos.UpdatePosition(x, y);

        drawCircle(canvasMiddle, radius, "rgba(255, 255, 255, 1.0)");
        drawFilledCircle(smallCirclePos, 5, "rgba(255, 110, 180, 1.0)", "rgba(255, 110, 180, 1.0)");
        
        alpha++;
        window.requestAnimationFrame(draw);
    }
// #endregion

window.requestAnimationFrame(draw);