import * as helpers from "../Utils/helpers.js";
import Vector2D from "../Utils/Vector2D.js";
import { Rectangle } from "../Utils/rectangle.js";
import { Quadtree } from "./Quadtree.js";

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
bgCtx.lineWidth = 1;
var foregroundCanvas = document.getElementById("foregroundCanvas");
foregroundCanvas.width = canvasWidth;
foregroundCanvas.height = canvasHeight;
var fgCtx = foregroundCanvas.getContext("2d");
fgCtx.strokeStyle = whiteLineStrokeStyle;
fgCtx.lineWidth = 1;
// #endregion

// #region Inputs
// #region slider
// var mySlider = document.getElementById("");
// mySlider.value = myValue;
// var mySliderValue = document.getElementById("");
// mySliderValue.innerHTML = mySlider.value; // Display the default slider value

// // Update the current slider value (each time you drag the slider handle)
// mySlider.oninput = function () {
// 	mySliderValue.innerHTML = this.value;
// 	myValue = this.value;
// 	if (liveResetCanvas) {
// 		resetCanvas = true;
// 	}
// };
// #endregion
// #region reset canvas button
var resetCanvasButton = document.getElementById("resetCanvasButton");

resetCanvasButton.onclick = function () {
	resetCanvas = true;
};
// #endregion

// #region Handle mouse events
let pointerOnCanvas = false;
let isLeftMouseDown = false; // button 0
let isMiddleMouseDown = false; // button 1
let isRightMouseDown = false; // button 2
let mouse = new Vector2D(0, 0);

function SetPointerOnCanvas(myBool) {
	if (pointerOnCanvas === !myBool) {
		pointerOnCanvas = myBool;
	}
}

foregroundCanvas.addEventListener("touchstart", function (event) {
	SetPointerOnCanvas(true);
	event.preventDefault();
});

foregroundCanvas.addEventListener("touchend", function (event) {
	SetPointerOnCanvas(false);
	event.preventDefault();
});

foregroundCanvas.addEventListener("touchmove", function (event) {
	let touchobj = event.changedTouches[0];
	particles[0].position.x = touchobj.clientX;
	particles[0].position.y = touchobj.clientY;
	event.preventDefault();
});

foregroundCanvas.addEventListener("mouseenter", function (event) {
	SetPointerOnCanvas(true);
});

foregroundCanvas.addEventListener("mouseleave", function (event) {
	SetPointerOnCanvas(false);
});

foregroundCanvas.addEventListener("mousedown", function (event) {
	switch (event.button) {
		case 0: {
			isLeftMouseDown = true;
			break;
		}
		case 1: {
			isMiddleMouseDown = true;
			break;
		}
		case 2: {
			isRightMouseDown = true;
			break;
		}
	}
});

foregroundCanvas.addEventListener("mouseup", function (event) {
	switch (event.button) {
		case 0: {
			isLeftMouseDown = false;
			break;
		}
		case 1: {
			isMiddleMouseDown = false;
			break;
		}
		case 2: {
			isRightMouseDown = false;
			break;
		}
	}
});

foregroundCanvas.addEventListener("mousemove", function (event) {
	mouse = helpers.GetMousePos(foregroundCanvas, event);
});
//#endregion

// #endregion

let boundary = new Rectangle(0, 0, canvasWidth, canvasHeight);
let quadtree = new Quadtree(boundary, 4);
let area = new Rectangle(75, 190, 350, 200);

for (let i = 0; i < 10; i++) {
	let p = new helpers.Point2D(helpers.GetRandomInt(canvasWidth), helpers.GetRandomInt(canvasHeight));
	quadtree.insert(p);
}

function draw() {
	fgCtx.clearRect(0, 0, canvasWidth, canvasHeight);

	if (resetCanvas) {
		quadtree = new Quadtree(boundary, 4);
		resetCanvas = false;
	}

	if (isLeftMouseDown) {
		quadtree.insert(new helpers.Point2D(mouse.x, mouse.y));
	}

	if (isMiddleMouseDown) {
		area.x = mouse.x - area.w / 2;
		area.y = mouse.y - area.h / 2;
	}

	let querried = quadtree.queryArea(area);
	quadtree.draw(fgCtx, whiteLineStrokeStyle);

	fgCtx.beginPath();
	helpers.drawRectangle(fgCtx, area, "rgba(0,255,0,1.0)");
	fgCtx.stroke();

	querried.forEach((p) => {
		fgCtx.beginPath();
		helpers.drawFilledCircle(fgCtx, p, 2, "rgba(0,255,0,1.0)", "rgba(0,255,0,1.0)");
		fgCtx.stroke();
	});

	window.requestAnimationFrame(draw);
}

draw();
