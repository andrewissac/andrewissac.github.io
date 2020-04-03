import * as helpers from "../Utils/helpers.js";
import * as RungeKutta from "../Utils/RungeKutta.js";
import Particle from "./particle.js";
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

var dt = 0.1;
var t = 0;

var particles = [];
// particles.push(new Particle(new Vector2D(50, 150), new Vector2D(0, 0), 500));
// particles.push(new Particle(new Vector2D(400, 400), new Vector2D(0, 0), 700));
// particles.push(new Particle(new Vector2D(250, 300), new Vector2D(0, 0), 1000));
// particles.push(new Particle(new Vector2D(300, 200), new Vector2D(0, 0), 400));
// particles.push(new Particle(new Vector2D(300, 250), new Vector2D(0, 0), 400));

for (let i = 0; i < 100; i++) {
	particles.push(Particle.GenerateRandomParticle(1, canvasWidth, 1, canvasHeight, -10, 10, -10, 10, 1, 1));
}

// sun
particles.push(
	new Particle(new Vector2D(Math.floor(canvasWidth / 2), Math.floor(canvasHeight / 2)), new Vector2D(0, 0), 1000)
);

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
// #region reset canvas button
var resetCanvasButton = document.getElementById("resetCanvasButton");

resetCanvasButton.onclick = function() {
	resetCanvas = true;
};
// #endregion
// #endregion

let i = 0;

function draw() {
	fgCtx.clearRect(0, 0, canvasWidth, canvasHeight);
	if (resetCanvas) {
		particles = [];
		for (let i = 0; i < 100; i++) {
			particles.push(Particle.GenerateRandomParticle(1, canvasWidth, 1, canvasHeight, -10, 10, -10, 10, 1, 1));
		}
		particles.push(
			new Particle(
				new Vector2D(Math.floor(canvasWidth / 2), Math.floor(canvasHeight / 2)),
				new Vector2D(0, 0),
				1000
			)
		);
		resetCanvas = false;
	}
	if (t < 10) {
		let tempParticles = [];
		for (let k = 0; k < particles.length; k++) {
			tempParticles.push(RungeKutta.RK4_ParticlesInGravField(k, particles, dt));
		}

		for (let j = 0; j < particles.length; j++) {
			particles[j] = tempParticles[j];
		}

		// particle = new Particle(new Vector2D(0, 0), new Vector2D(20, 30), 1);
		// particle = RungeKutta.RK4_ParticlesInGravField(particle1, particles, dt);

		particles.forEach(particle => {
			fgCtx.beginPath();
			helpers.drawFilledCircle(fgCtx, particle.position, 3, whiteLineStrokeStyle, whiteLineStrokeStyle);
			fgCtx.fill();
		});
		fgCtx.beginPath();
		helpers.drawFilledCircle(
			fgCtx,
			particles[particles.length - 1].position,
			10,
			"rgba(255, 255, 0, 1.0)",
			"rgba(255, 255, 0, 1.0)"
		);
		fgCtx.fill();
		// fgCtx.stroke();
	} else {
		t = 0;
	}
	t += dt;
	window.requestAnimationFrame(draw);
}

draw();
