import * as helpers from "../Utils/helpers.js";
import Vector2D from "../Utils/Vector2D.js";
import Line2D from "../Raycaster/Line2D.js";

// #region global variables
var canvasHeight = 500;
var canvasWidth = 500;
const whiteLineStrokeStyle = "rgba(255, 255, 255, 1.0)";
var fadeAway = false;
var liveResetCanvas = false;
var resetCanvas = false;
var numberOfDots = 9;
var shift_angle = (2 * Math.PI) / numberOfDots;
let figureSize = 400;
const origin = new Vector2D(Math.floor(canvasHeight / 2), Math.floor(canvasWidth / 2));
const initialDirectionVec = new Vector2D(0, -Math.floor(figureSize / 2));
let lines = [];
for (let i = 0; i < numberOfDots; i++) {
	lines.push(new Line2D(origin, initialDirectionVec.RotateCCW(i * shift_angle)));
}
let t = helpers.range(0, 6.28, 0.02);

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
// var mySlider = document.getElementById("");
// mySlider.value = myValue;
// var mySliderValue = document.getElementById("");
// mySliderValue.innerHTML = mySlider.value; // Display the default slider value

// // Update the current slider value (each time you drag the slider handle)
// mySlider.oninput = function() {
// 	mySliderValue.innerHTML = this.value;
// 	myValue = this.value;
// 	if (liveResetCanvas) {
// 		resetCanvas = true;
// 	}
// };
// #endregion

// #region Checkbox
// var myCheckbox = document.getElementById("");
// myCheckbox.checked = myBool;

// myCheckbox.onclick = function() {
// 	myBool = this.checked;
// };
// // #endregion

// // #region liveReset Checkbox
// var liveResetCheckbox = document.getElementById("liveResetCheckbox");
// liveResetCheckbox.checked = liveResetCanvas;

// liveResetCheckbox.onclick = function() {
// 	liveResetCanvas = this.checked;
// };
// // #endregion

// // #region reset canvas button
// var resetCanvasButton = document.getElementById("resetCanvasButton");

// resetCanvasButton.onclick = function() {
// 	resetCanvas = true;
// };
// #endregion
// #endregion

bgCtx.strokeStyle = "rgba(255,255,255, 0.5)";
bgCtx.setLineDash([1, 4]);
bgCtx.beginPath();
for (let k = 0; k < lines.length; k++) {
	let temp = new Line2D(lines[k].offset, lines[k].direction);
	temp.Draw(bgCtx);
	temp.direction = temp.direction.Negative();
	temp.Draw(bgCtx);
}
bgCtx.stroke();

let i = 0;
let hue = 0;
const delta_hue = Math.floor(360 / numberOfDots);

function draw() {
	fgCtx.clearRect(0, 0, canvasWidth, canvasHeight);
	if (i >= t.length) {
		i = 0;
	}
	if (hue > 360) {
		hue = 0;
	}

	for (let j = 0; j < lines.length; j++) {
		const pointOrigin = lines[j].GetPointOnLine(Math.sin(t[i] + j * shift_angle));
		//const hueTemp = hue + Math.floor() // makes sure rainbowcolors are repeating
		const strokeStyle = "hsl(" + hue + ", 100%,  70%)";
		fgCtx.beginPath();
		fgCtx.save();
		fgCtx.fillStyle = strokeStyle;
		fgCtx.strokeStyle = strokeStyle;
		helpers.drawFilledCircle(fgCtx, pointOrigin, 5, strokeStyle, strokeStyle);
		fgCtx.fill();
		fgCtx.stroke();
		fgCtx.restore();
	}

	i++;
	hue++;
	window.requestAnimationFrame(draw);
}

draw();
