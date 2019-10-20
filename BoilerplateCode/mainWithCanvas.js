import RotatingLissajousFigure from "./RotatingLissajousFigure.js";
import * as helpers from "../Utils/helpers.js";
import Vector2D from "../Utils/Vector2D.js";

// #region global variables
var canvasHeight = 800;
var canvasWidth = 800;
const whiteLineStrokeStyle = "rgba(255, 255, 255, 1.0)";
var fadeAway = false;
var liveResetCanvas = false;
var resetCanvas = false;
var fadeAwaySpeed = 0.01;
var myValue = 0;
// #endregion

// #region getting canvas and context of fore- and background
var backgroundCanvas = document.getElementById("backgroundCanvas");
backgroundCanvas.width = canvasWidth;
backgroundCanvas.height = canvasHeight;
var bgCtx = backgroundCanvas.getContext("2d");
bgCtx.strokeStyle = whiteLineStrokeStyle;
bgCtx.lineWidth = 2;
var foregroundCanvas = document.getElementById("foregroundCanvas");
foregroundCanvas.width = canvasWidth;
foregroundCanvas.height = canvasHeight;
var fgCtx = foregroundCanvas.getContext("2d");
fgCtx.strokeStyle = whiteLineStrokeStyle;
fgCtx.lineWidth = 2;
// #endregion

// #region Inputs
// #region slider
var mySlider = document.getElementById("");
mySlider.value = myValue;
var mySliderValue = document.getElementById("");
mySliderValue.innerHTML = mySlider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
mySlider.oninput = function() {
	mySliderValue.innerHTML = this.value;
	myValue = this.value;
	if (liveResetCanvas) {
		resetCanvas = true;
	}
};
// #endregion

// #region Checkbox
var myCheckbox = document.getElementById("");
myCheckbox.checked = myBool;

myCheckbox.onclick = function() {
	myBool = this.checked;
};
// #endregion

// #region liveReset Checkbox
var liveResetCheckbox = document.getElementById("liveResetCheckbox");
liveResetCheckbox.checked = liveResetCanvas;

liveResetCheckbox.onclick = function() {
	liveResetCanvas = this.checked;
};
// #endregion

// #region reset canvas button
var resetCanvasButton = document.getElementById("resetCanvasButton");

resetCanvasButton.onclick = function() {
	resetCanvas = true;
};
// #endregion
// #endregion

function draw() {
	window.requestAnimationFrame(draw);
}

draw();
