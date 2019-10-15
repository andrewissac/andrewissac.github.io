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
var lissFigureSize = 400;
var delta_phaseshift1 = 0.015;
var delta_phaseshift2 = 0.015;
var omega1 = 1;
var omega2 = 1;
let t1 = helpers.range(0, 13, delta_phaseshift1);
let t2 = helpers.range(0, 13, delta_phaseshift2);
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

// #region phaseshift 1 slider
var phaseshift1IncrementSlider = document.getElementById("phaseshift1IncrementSlider");
phaseshift1IncrementSlider.value = delta_phaseshift1;
var phaseshift1IncrementValue = document.getElementById("phaseshift1IncrementValue");
phaseshift1IncrementSlider.innerHTML = phaseshift1IncrementSlider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
phaseshift1IncrementSlider.oninput = function() {
	phaseshift1IncrementValue.innerHTML = this.value;
	delta_phaseshift1 = this.value;
	t1 = helpers.range(0, 13, delta_phaseshift1);
	t2 = helpers.range(0, 13, delta_phaseshift2);
	if (liveResetCanvas) {
		resetCanvas = true;
	}
};
// #endregion

// #region phaseshift 2 slider
var phaseshift2IncrementSlider = document.getElementById("phaseshift2IncrementSlider");
phaseshift2IncrementSlider.value = delta_phaseshift2;
var phaseshift2IncrementValue = document.getElementById("phaseshift2IncrementValue");
phaseshift2IncrementValue.innerHTML = phaseshift2IncrementSlider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
phaseshift2IncrementSlider.oninput = function() {
	phaseshift2IncrementValue.innerHTML = this.value;
	delta_phaseshift2 = this.value;
	t1 = helpers.range(0, 13, delta_phaseshift1);
	t2 = helpers.range(0, 13, delta_phaseshift2);
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
	if (i > 1300) {
		i = 0;
	}

	lissajous.Update(lissFigureSize, omega1, omega2, t1[i], t2[i]);
	//lissajous.Update(lissFigureSize);
	//lissajous._omega1 = t[i];
	//fgCtx.clearRect(0, 0, canvasWidth, canvasHeight);
	lissajous.DrawWholeFigure(bgCtx, fgCtx);
	i++;
	window.requestAnimationFrame(draw);
}

draw();
