import * as helpers from "../Utils/helpers.js";
import Vector2D from "../Utils/Vector2D.js";
import Circle from "./circle.js";

// #region global variables
var canvasHeight = 600;
var canvasWidth = 600;
const whiteLineStrokeStyle = "rgba(255, 255, 255, 1.0)";
var fadeAway = false;
var liveResetCanvas = false;
var showWhiteLines = true;
var showBlackBorderAroundPoints = false;
var fadeAwaySpeed = 0.1;
var resetCanvas = false;
var pointCount = 49;
var velocity = 0.0015;
var deltaCircleRadius = Math.floor(canvasHeight / 2.1 / pointCount);
var pointRadius = 5;
const origin = new Vector2D(Math.floor(canvasHeight / 2), Math.floor(canvasWidth / 2));

let circles = [];
FillArrayOfCircles();

let t = helpers.range(0, 2 * Math.PI, velocity);

// #endregion

// #region functions
function FillArrayOfCircles() {
	while (circles.length > 0) {
		circles.pop();
	}
	for (let i = 0; i < pointCount; i++) {
		circles.push(new Circle(origin, 20 + i * deltaCircleRadius));
	}
}
// #endregion

// #region getting canvas and context of fore- and background
var blackbackgroundCanvas = document.getElementById("blackbackgroundCanvas");
blackbackgroundCanvas.width = canvasWidth;
blackbackgroundCanvas.height = canvasHeight;
var backgroundCanvas = document.getElementById("backgroundCanvas");
backgroundCanvas.width = canvasWidth;
backgroundCanvas.height = canvasHeight;
var bgCtx = backgroundCanvas.getContext("2d");
bgCtx.strokeStyle = whiteLineStrokeStyle;
bgCtx.lineWidth = 2;
var middlegroundCanvas = document.getElementById("middlegroundCanvas");
middlegroundCanvas.width = canvasWidth;
middlegroundCanvas.height = canvasHeight;
var mgCtx = middlegroundCanvas.getContext("2d");
mgCtx.strokeStyle = whiteLineStrokeStyle;
mgCtx.lineWidth = 2;
var foregroundCanvas = document.getElementById("foregroundCanvas");
foregroundCanvas.width = canvasWidth;
foregroundCanvas.height = canvasHeight;
var fgCtx = foregroundCanvas.getContext("2d");
fgCtx.strokeStyle = whiteLineStrokeStyle;
fgCtx.lineWidth = 2;
// #endregion

// #region Inputs
//#region point Count Slider
var pointCountSlider = document.getElementById("pointCountSlider");
pointCountSlider.value = pointCount;
var pointCountValue = document.getElementById("pointCountValue");
pointCountValue.innerHTML = pointCountSlider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
pointCountSlider.oninput = function() {
	pointCountValue.innerHTML = this.value;
	pointCount = this.value;
	deltaCircleRadius = Math.floor(canvasHeight / 2.1 / pointCount);
	FillArrayOfCircles();
	if (liveResetCanvas) {
		resetCanvas = true;
	}
};
//#endregion

//#region speed Slider
var drawingSpeedSlider = document.getElementById("drawingSpeedSlider");
drawingSpeedSlider.value = velocity;
var drawingSpeedValue = document.getElementById("drawingSpeedValue");
drawingSpeedValue.innerHTML = Math.floor(drawingSpeedSlider.value * 10000); // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
drawingSpeedSlider.oninput = function() {
	drawingSpeedValue.innerHTML = Math.floor(this.value * 10000);
	velocity = this.value;
	t = helpers.range(0, 6.28, velocity);
	if (liveResetCanvas) {
		resetCanvas = true;
	}
};
//#endregion

// #region fadeaway slider
var fadeAwaySpeedSlider = document.getElementById("fadeAwaySpeedSlider");
fadeAwaySpeedSlider.value = fadeAwaySpeed;
var fadeAwaySpeedValue = document.getElementById("fadeAwaySpeedValue");
fadeAwaySpeedValue.innerHTML = fadeAwaySpeedSlider.value * 1000; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
fadeAwaySpeedSlider.oninput = function() {
	fadeAwaySpeedValue.innerHTML = this.value * 1000;
	fadeAwaySpeed = this.value;
};
// #endregion

// #region fadeAway Checkbox
var fadeAwayCheckbox = document.getElementById("fadeAwayCheckbox");
fadeAwayCheckbox.checked = fadeAway;

fadeAwayCheckbox.onclick = function() {
	fadeAway = this.checked;
};
// #endregion

// #region liveReset Checkbox
var liveResetCheckbox = document.getElementById("liveResetCheckbox");
liveResetCheckbox.checked = liveResetCanvas;

liveResetCheckbox.onclick = function() {
	liveResetCanvas = this.checked;
};
// #endregion

// #region show white Lines Checkbox
var showWhiteLinesCheckbox = document.getElementById("showWhiteLinesCheckbox");
showWhiteLinesCheckbox.checked = showWhiteLines;

showWhiteLinesCheckbox.onclick = function() {
	showWhiteLines = this.checked;
};
// #endregion

// #region show white Lines Checkbox
var showBlackBorderAroundPointsCheckbox = document.getElementById("showBlackBorderAroundPointsCheckbox");
showBlackBorderAroundPointsCheckbox.checked = showBlackBorderAroundPoints;

showBlackBorderAroundPointsCheckbox.onclick = function() {
	showBlackBorderAroundPoints = this.checked;
};
// #endregion

// #region reset canvas button
var resetCanvasButton = document.getElementById("resetCanvasButton");

resetCanvasButton.onclick = function() {
	resetCanvas = true;
};
// #endregion
// #endregion

let i = 0;

function draw() {
	bgCtx.clearRect(0, 0, canvasWidth, canvasHeight);
	fgCtx.clearRect(0, 0, canvasWidth, canvasHeight);

	if (fadeAway) {
		mgCtx.save();
		mgCtx.fillStyle = "rgba(0, 0, 0," + fadeAwaySpeed + ")";
		mgCtx.fillRect(0, 0, canvasWidth, canvasHeight);
		mgCtx.restore();
	} else {
		mgCtx.clearRect(0, 0, canvasWidth, canvasHeight);
	}

	if (i >= t.length || resetCanvas == true) {
		i = 0;
		resetCanvas = false;
		bgCtx.clearRect(0, 0, canvasWidth, canvasHeight);
		mgCtx.clearRect(0, 0, canvasWidth, canvasHeight);
		fgCtx.clearRect(0, 0, canvasWidth, canvasHeight);
	}

	bgCtx.beginPath();

	for (let j = 0; j < circles.length; j++) {
		const rainbowColorStyle = "hsl(" + helpers.RadianToDegree((circles.length - j) * t[i]) + ", 100%,  70%)";
		mgCtx.beginPath();
		mgCtx.save();
		const angle = (circles.length - j) * t[i];
		circles[j].DrawPointOnCircle(mgCtx, angle, pointRadius, rainbowColorStyle, rainbowColorStyle);
		mgCtx.fill();
		mgCtx.stroke();
		mgCtx.restore();

		fgCtx.beginPath();
		fgCtx.save();
		let borderStrokeStyle = rainbowColorStyle;
		if (showBlackBorderAroundPoints) {
			borderStrokeStyle = "rgba(0, 0, 0, 1.0)";
		}
		circles[j].DrawPointOnCircle(fgCtx, angle, pointRadius, borderStrokeStyle, rainbowColorStyle);
		fgCtx.fill();
		fgCtx.stroke();
		fgCtx.restore();

		if (showWhiteLines && j < circles.length) {
			// - 1 da letzte linie zu keinem anderen punkt führen kann
			const tempPoint1 = circles[j].GetPointOnCircle(angle);
			bgCtx.lineTo(tempPoint1.x, tempPoint1.y);
		}
	}

	bgCtx.stroke();
	bgCtx.restore();

	i++;
	window.requestAnimationFrame(draw);
}

draw();
