import RotatingLissajousFigure from "./RotatingLissajousFigure.js";
import * as helpers from "../Utils/helpers.js";
import Vector2D from "../Utils/Vector2D.js";

// #region global variables
var canvasHeight = 800;
var canvasWidth = 800;
const whiteLineStrokeStyle = "rgba(255, 255, 255, 1.0)";
var fadeAway = true;
var liveResetCanvas = false;
var resetCanvas = false;
var fadeAwaySpeed = 0.3;
var lissFigureSize = 400;
var delta_phaseshift = 0.015;
var omega1 = 1;
var omega2 = 1;

let t = helpers.range(0, 6.28, delta_phaseshift);
let i = 0;

let center = new Vector2D(Math.floor(canvasWidth / 2), Math.floor(canvasHeight / 2));
var lissajous = new RotatingLissajousFigure(center, lissFigureSize, 1, 4, 0, Math.PI / 2);
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
// #region omega 1 slider
var omega1Slider = document.getElementById("omega1Slider");
omega1Slider.value = omega1;
var omega1Value = document.getElementById("omega1Value");
omega1Value.innerHTML = omega1Slider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
omega1Slider.oninput = function() {
	omega1Value.innerHTML = this.value;
	omega1 = this.value;
	if (liveResetCanvas) {
		resetCanvas = true;
	}
};
// #endregion

// #region omega 2 slider
var omega2Slider = document.getElementById("omega2Slider");
omega2Slider.value = omega2;
var omega2Value = document.getElementById("omega2Value");
omega2Value.innerHTML = omega2Slider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
omega2Slider.oninput = function() {
	omega2Value.innerHTML = this.value;
	omega2 = this.value;
	if (liveResetCanvas) {
		resetCanvas = true;
	}
};
// #endregion

// #region phaseshift slider
var phaseshiftSlider = document.getElementById("phaseshiftSlider");
phaseshiftSlider.value = delta_phaseshift;
var phaseshiftValue = document.getElementById("phaseshiftValue");
phaseshiftValue.innerHTML = phaseshiftSlider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
phaseshiftSlider.oninput = function() {
	phaseshiftValue.innerHTML = this.value;
	delta_phaseshift = this.value;
	t = helpers.range(0, 6.28, delta_phaseshift);
	if (liveResetCanvas) {
		resetCanvas = true;
	}
};
// #endregion

// #region fadeaway slider
var fadeAwaySpeedSlider = document.getElementById("fadeAwaySpeedSlider");
fadeAwaySpeedSlider.value = fadeAwaySpeed;
var fadeAwaySpeedValue = document.getElementById("fadeAwaySpeedValue");
fadeAwaySpeedValue.innerHTML = fadeAwaySpeedSlider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
fadeAwaySpeedSlider.oninput = function() {
	fadeAwaySpeedValue.innerHTML = this.value;
	fadeAwaySpeed = this.value;
	if (liveResetCanvas) {
		resetCanvas = true;
	}
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

// #region reset canvas button
var resetCanvasButton = document.getElementById("resetCanvasButton");
resetCanvasButton.onclick = function() {
	resetCanvas = true;
};
// #endregion
// #endregion

function draw() {
	if (fadeAway) {
		bgCtx.save();
		bgCtx.fillStyle = "rgba(0, 0, 0," + fadeAwaySpeed + ")";
		bgCtx.fillRect(0, 0, canvasWidth, canvasHeight);
		bgCtx.restore();
	}
	if (i * delta_phaseshift > 6.28 || resetCanvas == true) {
		i = 0;
		resetCanvas = false;
		bgCtx.clearRect(0, 0, canvasWidth, canvasHeight);
	}

	lissajous.Update(lissFigureSize, omega1, omega2, 0, t[i]);
	lissajous.DrawWholeFigure(bgCtx, fgCtx);
	i++;
	window.requestAnimationFrame(draw);
}

draw();
