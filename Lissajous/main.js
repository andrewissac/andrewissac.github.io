import Vector2D from "../Utils/Vector2D.js"
import * as helpers from "../Utils/helpers.js"
import Lissajous from "./LissajousFigure.js";
import LissajousTable from "./LissajousTable.js";

// #region global variables
var canvasHeight = 800;
var canvasWidth = 800;
var canvasMiddle = new Vector2D(Math.floor(canvasWidth/2 + 0.5), Math.floor(canvasHeight/2 + 0.5));
// #endregion

// Get canvas and context of canvas
var backgroundCanvas = document.getElementById("backgroundCanvas");
backgroundCanvas.width = canvasWidth;
backgroundCanvas.height = canvasHeight;
var bgCtx = backgroundCanvas.getContext('2d');
var foregroundCanvas = document.getElementById("foregroundCanvas");
foregroundCanvas.width = canvasWidth;
foregroundCanvas.height = canvasHeight;
var fgCtx = foregroundCanvas.getContext('2d');
//ctx.lineWidth = 1;

// #region drawing functions
function drawPoint(point){
    if(typeof(point) === 'undefined' || point === null) { return; }
    bgCtx.save();
    bgCtx.beginPath();
    bgCtx.fillStyle = "#FFFF00";
    bgCtx.fillRect(point.x, point.y, 1, 1);
    bgCtx.restore();
  }

  function drawCircle(origin, radius, rgbaStroke){
    bgCtx.save();
    bgCtx.beginPath();
    bgCtx.strokeStyle = rgbaStroke;
    bgCtx.arc(origin.x, origin.y, radius, 0, 2 * Math.PI);
    bgCtx.stroke();
    bgCtx.restore();
  }

  function drawFilledCircle(origin, radius, rgbaStroke, rgbaFill){
    bgCtx.save();
    bgCtx.beginPath();
    bgCtx.fillStyle = rgbaFill;
    bgCtx.strokeStyle = rgbaStroke;
    bgCtx.arc(origin.x, origin.y, radius, 0, 2 * Math.PI);
    bgCtx.fill();
    bgCtx.stroke();
    bgCtx.restore();
  }
// #endregion

const radius = Math.floor(canvasWidth/2);

const delta_t = 0.02;
var t = helpers.range(0, 200, delta_t);

const whiteLineStrokeStyle = "rgba(255, 255, 255, 1.0)";
bgCtx.strokeStyle = whiteLineStrokeStyle;
bgCtx.lineWidth = 2;
fgCtx.strokeStyle = whiteLineStrokeStyle;
fgCtx.lineWidth = 2;
var i = 0;
var rows = 4;
var cols = 4;

var lissajousTable = new LissajousTable(rows+1, cols+1, canvasWidth, canvasHeight, 5);

// #region animation function
    function draw(){
      fgCtx.clearRect(0,0, canvasWidth, canvasHeight);
      if(i >= 629){
        i = 0;
        bgCtx.clearRect(0, 0, canvasWidth, canvasHeight);
      }
      for(let row = 0; row < rows+1; row++){
        for(let col = 0; col < cols+1; col++){
          if(row === 0 & col === 0) { continue; } // skip the very first figure
          lissajousTable.figures[row][col].Draw(bgCtx, fgCtx, t[i], t[i+1]);
        }
      }
      
      i++;
      window.requestAnimationFrame(draw);
    }
// #endregion

window.requestAnimationFrame(draw);