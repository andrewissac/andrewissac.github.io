import Vector2D from "../Utils/Vector2D.js"
import * as helpers from "../Utils/helpers.js"
import Lissajous from "./LissajousFigure.js";
import LissajousTable from "./LissajousTable.js";

// #region global variables
var canvasHeight = 800;
var canvasWidth = 800;
const whiteLineStrokeStyle = "rgba(255, 255, 255, 1.0)";
var delta_t = 0.015; // determines the speed of the animation
var t = helpers.range(0, 200, delta_t);
var lissFigureSize = 100;
var fadeAway = false;
var lissajousTable = new LissajousTable(canvasWidth, canvasHeight, lissFigureSize);
var liveResetCanvas = true;
var resetCanvas = false;
var i = 0;
// #endregion

// #region getting canvas and context of fore- and background
var backgroundCanvas = document.getElementById("backgroundCanvas");
backgroundCanvas.width = canvasWidth;
backgroundCanvas.height = canvasHeight;
var bgCtx = backgroundCanvas.getContext('2d');
bgCtx.strokeStyle = whiteLineStrokeStyle;
bgCtx.lineWidth = 2;
var foregroundCanvas = document.getElementById("foregroundCanvas");
foregroundCanvas.width = canvasWidth;
foregroundCanvas.height = canvasHeight;
var fgCtx = foregroundCanvas.getContext('2d');
fgCtx.strokeStyle = whiteLineStrokeStyle;
fgCtx.lineWidth = 2;
// #endregion

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

// #region Inputs
  // #region figureSize slider
  var figureSizeSlider = document.getElementById("figureSizeSlider");
  figureSizeSlider.value = lissFigureSize;
  var figureSizeValue = document.getElementById("figureSizeValue");
  figureSizeValue.innerHTML = figureSizeSlider.value; // Display the default slider value

  // Update the current slider value (each time you drag the slider handle)
  figureSizeSlider.oninput = function() {
    figureSizeValue.innerHTML = this.value;
    lissFigureSize = this.value;
    lissajousTable = new LissajousTable(canvasWidth, canvasHeight, lissFigureSize);
    if(liveResetCanvas){
      resetCanvas = true;
    }
  }
  // #endregion

  // #region figureSize slider
  var drawingSpeedSlider = document.getElementById("drawingSpeedSlider");
  drawingSpeedSlider.value = delta_t;
  var drawingSpeedValue = document.getElementById("drawingSpeedValue");
  drawingSpeedValue.innerHTML = drawingSpeedSlider.value * 1000; // Display the default slider value

  // Update the current slider value (each time you drag the slider handle)
  drawingSpeedSlider.oninput = function() {
    drawingSpeedValue.innerHTML = this.value * 1000;
    delta_t = this.value;
    t = helpers.range(0, 200, delta_t);
    if(liveResetCanvas){
      resetCanvas = true;
    }
  }
  // #endregion

  // #region fadeAway Checkbox
  var fadeAwayCheckbox = document.getElementById("fadeAwayCheckbox");
  fadeAwayCheckbox.checked = fadeAway;

  fadeAwayCheckbox.onclick = function() {
    fadeAway = this.checked;
  }
  // #endregion

  // #region liveReset Checkbox
  var liveResetCheckbox = document.getElementById("liveResetCheckbox");
  liveResetCheckbox.checked = liveResetCanvas;

  liveResetCheckbox.onclick = function() {
    liveResetCanvas = this.checked;
  }
  // #endregion

  // #region reset canvas button
  var resetCanvasButton = document.getElementById("resetCanvasButton");

  resetCanvasButton.onclick = function() {
    resetCanvas = true;
  }
  // #endregion
// #endregion

// #region animation function
  function draw(){
    fgCtx.clearRect(0,0, canvasWidth, canvasHeight);
    if(fadeAway){
      bgCtx.save();
      bgCtx.fillStyle = "rgba(0, 0, 0, 0.01)";
      bgCtx.fillRect(0,0, canvasWidth, canvasHeight);
      bgCtx.restore();
    }
    // make sure 
    if(i >= 629 || resetCanvas == true){
      i = 0;
      resetCanvas = false;
      bgCtx.clearRect(0, 0, canvasWidth, canvasHeight);
    }

    for(let row = 0; row < lissajousTable.rows; row++){
      for(let col = 0; col < lissajousTable.cols; col++){
        if(row === 0 & col === 0) { continue; } // skip the very first figure
        lissajousTable.figures[row][col].Draw(bgCtx, fgCtx, t[i], t[i+1]);
      }
    }
    i++;
    window.requestAnimationFrame(draw);
  }
// #endregion

window.requestAnimationFrame(draw);