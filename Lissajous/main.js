import Vector2D from "../Utils/Vector2D.js"
import * as helpers from "../Utils/helpers.js"
import Lissajous from "./LissajousFigure.js";

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
//ctx.lineWidth = 1;

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

const delta_t = 0.02;
var t = helpers.range(0, 200, delta_t);

const whiteLineStrokeStyle = "rgba(255, 255, 255, 1.0)";
ctx.strokeStyle = whiteLineStrokeStyle;
ctx.lineWidth = 2;
var i = 0;
const tempFigPos = new Vector2D(0,0);
const Ax = Math.floor(canvasWidth/2);
const Ay = Math.floor(canvasHeight/2);
let lissajous = new Lissajous(tempFigPos, Ax, Ay,
  1, 1, 0, Math.PI/2);
// #region animation function
    function draw(){
        // if(i >= t.length){
        //   i = 0;
        //   ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        // }
        if(i >= 629){
          i = 0;
          ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        }
        lissajous.Draw(ctx, t[i], t[i+1]);
        
        i++;
        window.requestAnimationFrame(draw);
    }
// #endregion

window.requestAnimationFrame(draw);