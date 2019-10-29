import * as helpers from "../Utils/helpers.js";
import Square from "../Utils/square.js";
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
var squareOrigin = new Vector2D(Math.floor(canvasWidth / 2), Math.floor(canvasHeight / 2));
var enclosingSquareLength = 400;
var delta_angle = 0.001;
var angles = helpers.range(0, Math.PI / 2, delta_angle);
var rotationFactor = 1.1;
var squareCount = 10;
let squares = [];
// #endregion

ClearAndAddSquaresToArray();

function ClearAndAddSquaresToArray() {
	while (squares.length > 0) {
		squares.pop();
	}
	for (let i = 0; i < squareCount; i++) {
		squares.push(new Square(squareOrigin, enclosingSquareLength, 0));
	}
}

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

// // #region Inputs
// // #region slider
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
// // #endregion

// // #region Checkbox
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
// // #endregion
// // #endregion

let i = 0;

function draw() {
	bgCtx.clearRect(0, 0, canvasWidth, canvasHeight);

	// enclosing Square
	bgCtx.beginPath();
	squares[0].Draw(bgCtx);
	bgCtx.stroke();

	if (i > angles.length) {
		i = 0;
	}

	// for (let j = 1; j < squares.length; j++) {
	// 	bgCtx.beginPath();
	// 	squares[j].RotateInsideSquare(squares[j - 1].edgeLength, squares[j - 1].alpha + j * angles[i]);
	// 	//squares[j].RotateInsideSquare(squares[j - 1].edgeLength, angles[i] * j * rotationFactor);
	// 	squares[j].Draw(bgCtx);
	// 	bgCtx.stroke();
	// }
	bgCtx.beginPath();
	squares[1].RotateInsideSquare(squares[0].edgeLength, squares[0].alpha + angles[i]);
	squares[1].Draw(bgCtx);
	bgCtx.stroke();
	bgCtx.beginPath();
	squares[2].RotateInsideSquare(squares[1].edgeLength, squares[1].alpha + angles[i]);
	squares[2].Draw(bgCtx);
	bgCtx.stroke();

	i++;
	window.requestAnimationFrame(draw);
}

draw();
