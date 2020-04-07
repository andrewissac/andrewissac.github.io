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

var stop = false;
var frameCount = 0;
var fps, fpsInterval, startTime, now, then, elapsed;

var particleCount = 100;
var particles = [];
var dt = 0.01;
var gravitationalConst = 1;

const WallBehaviorEnum = Object.freeze({ none: 1, infinite: 2, collision: 3 });
let wallBehavior = WallBehaviorEnum.collision;
var wallFrictionFactor = 0.8;
let particleCollisionsEnabled = true;

let sunMass = 10000;
let sunRadius = 15;

// #region random particle parameters
let xmin = 10;
let xmax = canvasWidth - 10;
let ymin = 10;
let ymax = canvasHeight - 10;
let vxMin = 0;
let vxMax = 10;
let vyMin = 0;
let vyMax = 10;
let radiusMin = 1;
let radiusMax = 10;
let massMin = 1;
let massMax = 1;
// #endregion

function GenerateRandomizedParticles(N) {
	// sun
	particles = [];
	particles.push(
		new Particle(
			new Vector2D(Math.floor(canvasWidth / 2), Math.floor(canvasHeight / 2)),
			new Vector2D(0, 0),
			sunRadius,
			sunMass
		)
	);
	particles = Particle.AddNRandomParticles(
		particles,
		particleCount - 1,
		xmin,
		xmax,
		ymin,
		ymax,
		vxMin,
		vxMax,
		vyMin,
		vyMax,
		radiusMin,
		radiusMax,
		massMin,
		massMax
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

resetCanvasButton.onclick = function () {
	resetCanvas = true;
};
// #endregion

// #region no walls radio button
var noWallsRadiobutton = document.getElementById("noWallsRadiobutton");
noWallsRadiobutton.checked = false;

noWallsRadiobutton.onclick = function () {
	if (this.checked) {
		wallBehavior = WallBehaviorEnum.none;
	}
};
// #endregion

// #region infinite walls radio button
var infiniteWallsRadiobutton = document.getElementById("infiniteWallsRadiobutton");
infiniteWallsRadiobutton.checked = false;

infiniteWallsRadiobutton.onclick = function () {
	if (this.checked) {
		wallBehavior = WallBehaviorEnum.infinite;
	}
};
// #endregion

// #region infinite walls radio button
var collisionWallsRadiobutton = document.getElementById("collisionWallsRadiobutton");
collisionWallsRadiobutton.checked = true;

collisionWallsRadiobutton.onclick = function () {
	if (this.checked) {
		wallBehavior = WallBehaviorEnum.collision;
	}
};
// #endregion

// #region particle collision checkbox
var particleCollisionCheckbox = document.getElementById("particleCollisionCheckbox");
particleCollisionCheckbox.checked = particleCollisionsEnabled;

particleCollisionCheckbox.onclick = function () {
	particleCollisionsEnabled = this.checked;
};
// #endregion

// #region particle count slider
var particleCountSlider = document.getElementById("particleCountSlider");
particleCountSlider.value = particleCount;
var particleCountValue = document.getElementById("particleCountValue");
particleCountValue.innerHTML = particleCountSlider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
particleCountSlider.oninput = function () {
	particleCountValue.innerHTML = this.value;
	while (particleCount != this.value) {
		if (particleCount > this.value) {
			particles.pop();
			particleCount--;
		} else if (particleCount < this.value) {
			let particle = Particle.GenerateRandomParticle(
				xmin,
				xmax,
				ymin,
				ymax,
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
				particles.push(particle);
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
timeStepSlider.oninput = function () {
	timeStepValue.innerHTML = this.value;
	dt = this.value;
};
// #endregion

// #region fps value
var fpsValue = document.getElementById("fpsValue");
fpsValue.innerHTML = fps; // Display the default slider value
// #endregion

// #region gravitational constant slider
var gravConstSlider = document.getElementById("gravConstSlider");
gravConstSlider.value = gravitationalConst;
var gravConstValue = document.getElementById("gravConstValue");
gravConstValue.innerHTML = gravConstSlider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
gravConstSlider.oninput = function () {
	gravConstValue.innerHTML = this.value;
	gravitationalConst = this.value;
};
// #endregion

// #region mass of sun slider
var sunMassSlider = document.getElementById("sunMassSlider");
sunMassSlider.value = sunMass;
var sunMassValue = document.getElementById("sunMassValue");
sunMassValue.innerHTML = sunMassSlider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
sunMassSlider.oninput = function () {
	sunMassValue.innerHTML = this.value;
	sunMass = this.value;
	particles[0].mass = this.value;
};
// #endregion

// #region radius of sun slider
var sunRadiusSlider = document.getElementById("sunRadiusSlider");
sunRadiusSlider.value = sunRadius;
var sunRadiusValue = document.getElementById("sunRadiusValue");
sunRadiusValue.innerHTML = sunRadiusSlider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
sunRadiusSlider.oninput = function () {
	sunRadiusValue.innerHTML = this.value;
	sunRadius = this.value;
	particles[0].radius = this.value;
};
// #endregion

// #region xmin slider
var xminSlider = document.getElementById("xminSlider");
xminSlider.value = xmin;
var xminValue = document.getElementById("xminValue");
xminValue.innerHTML = xminSlider.value + "%"; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
xminSlider.oninput = function () {
	xminValue.innerHTML = this.value + "%";
	xmin = Math.floor((this.value / 100) * canvasWidth);
};
// #endregion

// #region xmax slider
var xmaxSlider = document.getElementById("xmaxSlider");
xmaxSlider.value = xmax;
var xmaxValue = document.getElementById("xmaxValue");
xmaxValue.innerHTML = xmaxSlider.value + "%"; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
xmaxSlider.oninput = function () {
	xmaxValue.innerHTML = this.value + "%";
	xmax = Math.floor((this.value / 100) * canvasWidth);
};
// #endregion

// #region ymin slider
var yminSlider = document.getElementById("yminSlider");
yminSlider.value = ymin;
var yminValue = document.getElementById("yminValue");
yminValue.innerHTML = yminSlider.value + "%"; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
yminSlider.oninput = function () {
	yminValue.innerHTML = this.value + "%";
	ymin = Math.floor((this.value / 100) * canvasHeight);
};
// #endregion

// #region ymax slider
var ymaxSlider = document.getElementById("ymaxSlider");
ymaxSlider.value = ymax;
var ymaxValue = document.getElementById("ymaxValue");
ymaxValue.innerHTML = ymaxSlider.value + "%"; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
ymaxSlider.oninput = function () {
	ymaxValue.innerHTML = this.value + "%";
	ymax = Math.floor((this.value / 100) * canvasHeight);
};
// #endregion

// #region vx-min slider
var vxminSlider = document.getElementById("vxminSlider");
vxminSlider.value = vxMin;
var vxminValue = document.getElementById("vxminValue");
vxminValue.innerHTML = vxminSlider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
vxminSlider.oninput = function () {
	vxminValue.innerHTML = this.value;
	vxMin = this.value;
};
// #endregion

// #region vx-max slider
var vxmaxSlider = document.getElementById("vxmaxSlider");
vxmaxSlider.value = vxMax;
var vxmaxValue = document.getElementById("vxmaxValue");
vxmaxValue.innerHTML = vxmaxSlider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
vxmaxSlider.oninput = function () {
	vxmaxValue.innerHTML = this.value;
	vxMax = this.value;
};
// #endregion

// #region vy-min slider
var vyminSlider = document.getElementById("vyminSlider");
vyminSlider.value = vyMin;
var vyminValue = document.getElementById("vyminValue");
vyminValue.innerHTML = vyminSlider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
vyminSlider.oninput = function () {
	vyminValue.innerHTML = this.value;
	vyMin = this.value;
};
// #endregion

// #region vy-max slider
var vymaxSlider = document.getElementById("vymaxSlider");
vymaxSlider.value = vyMax;
var vymaxValue = document.getElementById("vymaxValue");
vymaxValue.innerHTML = vymaxSlider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
vymaxSlider.oninput = function () {
	vymaxValue.innerHTML = this.value;
	vyMax = this.value;
};
// #endregion

// #region radius-min slider
var radiusMinSlider = document.getElementById("radiusMinSlider");
radiusMinSlider.value = radiusMin;
var radiusMinValue = document.getElementById("radiusMinValue");
radiusMinValue.innerHTML = radiusMinSlider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
radiusMinSlider.oninput = function () {
	radiusMinValue.innerHTML = this.value;
	radiusMin = this.value;
};
// #endregion

// #region radius-max slider
var radiusMaxSlider = document.getElementById("radiusMaxSlider");
radiusMaxSlider.value = radiusMax;
var radiusMaxValue = document.getElementById("radiusMaxValue");
radiusMaxValue.innerHTML = radiusMaxSlider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
radiusMaxSlider.oninput = function () {
	radiusMaxValue.innerHTML = this.value;
	radiusMax = this.value;
};
// #endregion

// #region mass-min slider
var massMinSlider = document.getElementById("massMinSlider");
massMinSlider.value = massMin;
var massMinValue = document.getElementById("massMinValue");
massMinValue.innerHTML = massMinSlider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
massMinSlider.oninput = function () {
	massMinValue.innerHTML = this.value;
	massMin = this.value;
};
// #endregion

// #region mass-max slider
var massMaxSlider = document.getElementById("massMaxSlider");
massMaxSlider.value = massMax;
var massMaxValue = document.getElementById("massMaxValue");
massMaxValue.innerHTML = massMaxSlider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
massMaxSlider.oninput = function () {
	massMaxValue.innerHTML = this.value;
	massMax = this.value;
};
// #endregion
// #endregion

function startAnimating(fps) {
	fpsInterval = 1000 / fps;
	then = Date.now();
	startTime = then;
	draw();
}

function draw() {
	// stop
	if (stop) {
		return;
	}

	// request another frame
	window.requestAnimationFrame(draw);

	if (resetCanvas) {
		GenerateRandomizedParticles(particleCount);
		then = Date.now();
		startTime = then;
		frameCount = 0;
		resetCanvas = false;
	}

	let tempParticles = [];
	// use Runge-Kutta-Integration to update position / velocity of particles
	for (let k = 0; k < particles.length; k++) {
		tempParticles.push(RungeKutta.RK4_ParticlesInGravField(k, particles, dt, gravitationalConst));
	}

	// Collision handling
	if (particleCollisionsEnabled) {
		for (let i = 0; i < tempParticles.length; i++) {
			for (let k = 0; k < tempParticles.length; k++) {
				if (i != k) {
					if (tempParticles[i].Overlaps(tempParticles[k])) {
						// resolve the issue when particles overlap by pushing them away from eachother sothat they don't overlap
						let distance = tempParticles[i].position.DistanceTo(tempParticles[k].position);
						let overlap = (tempParticles[i].radius + tempParticles[k].radius - distance) / 2;
						tempParticles[i].position.x +=
							(overlap * (tempParticles[i].position.x - tempParticles[k].position.x)) / distance;
						tempParticles[i].position.y +=
							(overlap * (tempParticles[i].position.y - tempParticles[k].position.y)) / distance;

						tempParticles[k].position.x -=
							(overlap * (tempParticles[i].position.x - tempParticles[k].position.x)) / distance;
						tempParticles[k].position.y -=
							(overlap * (tempParticles[i].position.y - tempParticles[k].position.y)) / distance;

						// elastic scattering
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
			particles.forEach((particle) => {
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
			particles.forEach((particle) => {
				if (particle.position.x <= particle.radius) {
					particle.position.x = particle.radius;
					particle.velocity.x *= -1 * wallFrictionFactor;
				} else if (particle.position.x >= canvasWidth - particle.radius) {
					particle.position.x = canvasWidth - particle.radius;
					particle.velocity.x *= -1 * wallFrictionFactor;
				}

				if (particle.position.y <= particle.radius) {
					particle.position.y = particle.radius;
					particle.velocity.y *= -1 * wallFrictionFactor;
				} else if (particle.position.y >= canvasHeight - particle.radius) {
					particle.position.y = canvasHeight - particle.radius;
					particle.velocity.y *= -1 * wallFrictionFactor;
				}
			});
			break;
		}
	}

	// calc elapsed time since last loop
	now = Date.now();
	elapsed = now - then;

	// if enough time has elapsed, draw the next frame
	if (elapsed > fpsInterval) {
		// Get ready for next frame by setting then=now, but...
		// Also, adjust for fpsInterval not being multiple of 16.67
		then = now - (elapsed % fpsInterval);

		fgCtx.clearRect(0, 0, canvasWidth, canvasHeight);
		// draw stuff here
		particles.forEach((particle) => {
			if (!particle.isHeavyParticle) {
				particle.Draw(fgCtx, whiteLineStrokeStyle, whiteLineStrokeStyle);
			} else {
				particle.Draw(fgCtx, "rgba(255, 255, 0, 1.0)", "rgba(255, 255, 0, 1.0)");
			}
		});

		// TESTING...Report #seconds since start and achieved fps.
		var sinceStart = now - startTime;
		var currentFps = Math.round(Math.round((1000 / (sinceStart / ++frameCount)) * 100) / 100);
		fpsValue.innerHTML =
			"Elapsed time= " +
			Math.round(Math.round((sinceStart / 1000) * 100) / 100) +
			" s with " +
			currentFps +
			" fps.";
	}
}

startAnimating(60);
