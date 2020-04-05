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

var particleCount = 100;
var particles = [];
var dt = 0.01;

const WallBehaviorEnum = Object.freeze({ none: 1, infinite: 2, collision: 3 });
let wallBehavior = WallBehaviorEnum.collision;
let particleCollisionsEnabled = true;

// #region random particle parameters
let xPosMin = 1;
let xPosMax = canvasWidth;
let yPosMin = 1;
let yPosMax = canvasHeight;
let vxMin = -10;
let vxMax = 10;
let vyMin = -10;
let vyMax = 10;
let radiusMin = 1;
let radiusMax = 5;
let massMin = 1;
let massMax = 10;
// #endregion

function GenerateRandomizedParticles(N) {
	particles = Particle.GenerateNRandomParticles(
		particleCount,
		xPosMin,
		xPosMax,
		yPosMin,
		yPosMax,
		vxMin,
		vxMax,
		vyMin,
		vyMax,
		radiusMin,
		radiusMax,
		massMin,
		massMax
	);

	// sun
	particles.push(
		new Particle(
			new Vector2D(Math.floor(canvasWidth / 2), Math.floor(canvasHeight / 2)),
			new Vector2D(0, 0),
			10,
			10000
		)
	);
}

GenerateRandomizedParticles(particleCount);

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

// #region no walls radio button
var noWallsRadiobutton = document.getElementById("noWallsRadiobutton");
noWallsRadiobutton.checked = false;

noWallsRadiobutton.onclick = function() {
	if (this.checked) {
		wallBehavior = WallBehaviorEnum.none;
	}
};

// #region infinite walls radio button
var infiniteWallsRadiobutton = document.getElementById("infiniteWallsRadiobutton");
infiniteWallsRadiobutton.checked = false;

infiniteWallsRadiobutton.onclick = function() {
	if (this.checked) {
		wallBehavior = WallBehaviorEnum.infinite;
	}
};
// #endregion

// #region infinite walls radio button
var collisionWallsRadiobutton = document.getElementById("collisionWallsRadiobutton");
collisionWallsRadiobutton.checked = true;

collisionWallsRadiobutton.onclick = function() {
	if (this.checked) {
		wallBehavior = WallBehaviorEnum.collision;
	}
};
// #endregion

// #region particle collision checkbox
var particleCollisionCheckbox = document.getElementById("particleCollisionCheckbox");
particleCollisionCheckbox.checked = particleCollisionsEnabled;

particleCollisionCheckbox.onclick = function() {
	particleCollisionsEnabled = this.checked;
};
// #endregion

// #region particle count slider
var particleCountSlider = document.getElementById("particleCountSlider");
particleCountSlider.value = particleCount;
var particleCountValue = document.getElementById("particleCountValue");
particleCountValue.innerHTML = particleCountSlider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
particleCountSlider.oninput = function() {
	particleCountValue.innerHTML = this.value;
	while (particleCount != this.value) {
		if (particleCount > this.value) {
			particles.shift();
			particleCount--;
		} else if (particleCount < this.value) {
			let particle = Particle.GenerateRandomParticle(
				xPosMin,
				xPosMax,
				yPosMin,
				yPosMax,
				vxMin,
				vxMax,
				vyMin,
				vyMax,
				radiusMin,
				radiusMax,
				massMin,
				massMax
			);
			// check if no other particle overlap with the to be added particle
			let twoParticlesOverlap = false;
			for (let j = 0; j < particles.length; j++) {
				if (particle.Overlaps(particles[j])) {
					twoParticlesOverlap = true;
					break;
				}
			}
			if (!twoParticlesOverlap) {
				particles.unshift(particle);
				particleCount++;
			}
		}
	}
};
// #endregion

// #region timestep slider
var timeStepSlider = document.getElementById("timeStepSlider");
timeStepSlider.value = dt;
var timeStepValue = document.getElementById("timeStepValue");
timeStepValue.innerHTML = timeStepSlider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
timeStepSlider.oninput = function() {
	timeStepValue.innerHTML = this.value;
	dt = this.value;
};
// #endregion
// #endregion

function draw() {
	fgCtx.clearRect(0, 0, canvasWidth, canvasHeight);
	if (resetCanvas) {
		GenerateRandomizedParticles(particleCount);
		resetCanvas = false;
	}
	let tempParticles = [];
	for (let k = 0; k < particles.length; k++) {
		tempParticles.push(RungeKutta.RK4_ParticlesInGravField(k, particles, dt));
	}

	// Collision handling
	if (particleCollisionsEnabled) {
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
	}

	for (let j = 0; j < particles.length; j++) {
		particles[j] = tempParticles[j].DeepCopy();
	}

	// Wall behavior handling
	switch (wallBehavior) {
		case WallBehaviorEnum.none: {
			break;
		}
		case WallBehaviorEnum.infinite: {
			particles.forEach(particle => {
				if (particle.position.x < 0) {
					particle.position.x = canvasWidth;
				}
				if (particle.position.x > canvasWidth) {
					particle.position.x = 0;
				}
				if (particle.position.y < 0) {
					particle.position.y = canvasHeight;
				}
				if (particle.position.y > canvasHeight) {
					particle.position.y = 0;
				}
			});
			break;
		}
		case WallBehaviorEnum.collision: {
			particles.forEach(particle => {
				if (particle.position.x <= particle.radius) {
					particle.position.x = particle.radius;
					particle.velocity.x *= -1;
				} else if (particle.position.x >= canvasWidth - particle.radius) {
					particle.position.x = canvasWidth - particle.radius;
					particle.velocity.x *= -1;
				}

				if (particle.position.y <= particle.radius) {
					particle.position.y = particle.radius;
					particle.velocity.y *= -1;
				} else if (particle.position.y >= canvasHeight - particle.radius) {
					particle.velocity.y = canvasHeight - particle.radius;
					particle.velocity.y *= -1;
				}
			});
			break;
		}
	}

	particles.forEach(particle => {
		particle.Draw(fgCtx, whiteLineStrokeStyle, whiteLineStrokeStyle);
	});
	particles[particles.length - 1].Draw(fgCtx, "rgba(255, 255, 0, 1.0)", "rgba(255, 255, 0, 1.0)");
	window.requestAnimationFrame(draw);
}

draw();
