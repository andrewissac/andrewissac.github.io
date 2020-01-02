import * as helpers from "../Utils/helpers.js";
import Square from "../Utils/square.js";
import Vector2D from "../Utils/Vector2D.js";

// #region global variables
var canvasHeight = 800;
var canvasWidth = 800;
const whiteLineStrokeStyle = "rgba(255, 255, 255, 1.0)";
var resetCanvas = false;
var rainbowColorsEnabled = true;
var hue = 0;
var squareOrigin = new Vector2D(Math.floor(canvasWidth / 2), Math.floor(canvasHeight / 2));
var enclosingSquareLength = 400;
var delta_angle = 0.005;
var angles = helpers.range(0, Math.PI / 2, delta_angle);
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
// #endregion

// // #region Inputs
// // #region slider
var rotationSpeedSlider = document.getElementById("rotationSpeedSlider");
rotationSpeedSlider.value = delta_angle;
var rotationSpeedValue = document.getElementById("rotationSpeedValue");
rotationSpeedValue.innerHTML = Math.floor(rotationSpeedSlider.value * 10000); // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
rotationSpeedSlider.oninput = function() {
	rotationSpeedValue.innerHTML = Math.floor(this.value * 10000);
	delta_angle = this.value;
	angles = helpers.range(0, Math.PI / 2, delta_angle);
};

var squareCountSlider = document.getElementById("squareCountSlider");
squareCountSlider.value = squareCount;
var squareCountValue = document.getElementById("squareCountValue");
squareCountValue.innerHTML = squareCountSlider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
squareCountSlider.oninput = function() {
	squareCountValue.innerHTML = this.value;
	squareCount = this.value;
	ClearAndAddSquaresToArray();
};

var baseColorSlider = document.getElementById("baseColorSlider");
baseColorSlider.value = hue;
var baseColorValue = document.getElementById("baseColorValue");
baseColorValue.innerHTML = baseColorSlider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
baseColorSlider.oninput = function() {
	baseColorValue.innerHTML = this.value;
	hue = this.value;
	const rainbowColorStyle = "hsl(" + helpers.RadianToDegree(helpers.DegreeToRadian(hue)) + ", 100%,  70%)";
	bgCtx.strokeStyle = rainbowColorStyle;
};
// // #endregion

// #region Checkbox
var rainbowColorCheckbox = document.getElementById("rainbowColorCheckbox");
rainbowColorCheckbox.checked = rainbowColorsEnabled;

rainbowColorCheckbox.onclick = function() {
	rainbowColorsEnabled = this.checked;
};
// #endregion

// // #region liveReset Checkbox
// var liveResetCheckbox = document.getElementById("liveResetCheckbox");
// liveResetCheckbox.checked = liveResetCanvas;

// liveResetCheckbox.onclick = function() {
// 	liveResetCanvas = this.checked;
// };
// // #endregion

// #region reset canvas button
var resetCanvasButton = document.getElementById("resetCanvasButton");

resetCanvasButton.onclick = function() {
	resetCanvas = true;
};
// #endregion
// // #endregion

let i = 0;

function draw() {
	bgCtx.clearRect(0, 0, canvasWidth, canvasHeight);

	if (i > angles.length || resetCanvas) {
		i = 0;
		resetCanvas = false;
	}

	for (let j = 1; j < squares.length; j++) {
		bgCtx.beginPath();
		squares[j].RotateInsideSquare(squares[j - 1], squares[j - 1].alpha + angles[i]);
		bgCtx.save();
		if (rainbowColorsEnabled) {
			const rainbowColorStyle =
				"hsl(" + helpers.RadianToDegree(squares[j].alpha / 2 + helpers.DegreeToRadian(hue)) + ", 100%,  70%)";
			bgCtx.strokeStyle = rainbowColorStyle;
		}

		squares[j].Draw(bgCtx);
		bgCtx.stroke();
		bgCtx.restore();
	}

	// enclosing Square
	bgCtx.beginPath();
	bgCtx.save();
	if (rainbowColorsEnabled) {
		const rainbowColorStyle =
			"hsl(" + helpers.RadianToDegree(squares[1].alpha / 2 + helpers.DegreeToRadian(hue)) + ", 100%,  70%)";
		bgCtx.strokeStyle = rainbowColorStyle;
	}
	squares[0].Draw(bgCtx);
	bgCtx.stroke();
	bgCtx.restore();

	i++;
	window.requestAnimationFrame(draw);
}

draw();
