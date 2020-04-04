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
// particles.push(new Particle(new Vector2D(50, 150), new Vector2D(0, 0), 10, 500));

for (let i = 0; i < 100; i++) {
	particles.push(Particle.GenerateRandomParticle(1, canvasWidth, 1, canvasHeight, -10, 10, -10, 10, 1, 6, 1, 10));
}

// sun
particles.push(
	new Particle(new Vector2D(Math.floor(canvasWidth / 2), Math.floor(canvasHeight / 2)), new Vector2D(0, 0), 10, 1000)
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

function draw() {
	fgCtx.clearRect(0, 0, canvasWidth, canvasHeight);
	if (resetCanvas) {
		particles = [];
		for (let i = 0; i < 100; i++) {
			particles.push(
				Particle.GenerateRandomParticle(1, canvasWidth, 1, canvasHeight, -10, 10, -10, 10, 1, 6, 1, 10)
			);
		}
		particles.push(
			new Particle(
				new Vector2D(Math.floor(canvasWidth / 2), Math.floor(canvasHeight / 2)),
				new Vector2D(0, 0),
				10,
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

		for (let i = 0; i < tempParticles.length; i++) {
			for (let k = 0; k < tempParticles.length; k++) {
				if (i != k) {
					if (tempParticles[i].CollidedWith(tempParticles[k])) {
						const massFac1 = (2 * tempParticles[k].mass) / (tempParticles[i].mass + tempParticles[k].mass);
						const normalFac1 =
							(massFac1 *
								tempParticles[i].velocity
									.Add(tempParticles[k].velocity.Negative())
									.DotProduct(tempParticles[i].position.Add(tempParticles[k].position.Negative()))) /
							tempParticles[i].position.DistanceTo(tempParticles[k].position) ** 2;
						tempParticles[i].velocity = tempParticles[i].velocity.Add(
							tempParticles[i].position
								.Add(tempParticles[k].position.Negative())
								.Multiply(-1 * normalFac1)
						);

						const massFac2 = (2 * tempParticles[i].mass) / (tempParticles[i].mass + tempParticles[k].mass);
						const normalFac2 =
							(massFac2 *
								tempParticles[k].velocity
									.Add(tempParticles[i].velocity.Negative())
									.DotProduct(tempParticles[k].position.Add(tempParticles[i].position.Negative()))) /
							tempParticles[k].position.DistanceTo(tempParticles[i].position) ** 2;
						tempParticles[k].velocity = tempParticles[k].velocity.Add(
							tempParticles[k].position
								.Add(tempParticles[i].position.Negative())
								.Multiply(-1 * normalFac2)
						);
					}
				}
			}
		}

		for (let j = 0; j < particles.length; j++) {
			particles[j] = tempParticles[j].DeepCopy();
		}

		// particles.forEach(particle => {
		// 	if (particle.position.x < 0 && particle.mass > 8) {
		// 		particle.position.x = canvasWidth;
		// 	}
		// 	if (particle.position.x > canvasWidth && particle.mass > 5) {
		// 		particle.position.x = 0;
		// 	}
		// 	if (particle.position.y < 0 && particle.mass > 5) {
		// 		particle.position.y = canvasHeight;
		// 	}
		// 	if (particle.position.y > canvasHeight && particle.mass > 5) {
		// 		particle.position.y = 0;
		// 	}
		// });

		// particle = new Particle(new Vector2D(0, 0), new Vector2D(20, 30), 1);
		// particle = RungeKutta.RK4_ParticlesInGravField(particle1, particles, dt);

		particles.forEach(particle => {
			particle.Draw(fgCtx, whiteLineStrokeStyle, whiteLineStrokeStyle);
		});
		particles[particles.length - 1].Draw(fgCtx, "rgba(255, 255, 0, 1.0)", "rgba(255, 255, 0, 1.0)");
	} else {
		t = 0;
	}
	t += dt;
	window.requestAnimationFrame(draw);
}

draw();
