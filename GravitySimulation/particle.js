import * as helpers from "../Utils/helpers.js";
import Vector2D from "../Utils/Vector2D.js";

export default class Particle {
	constructor(position, velocity, acceleration, radius = 3, mass = 1) {
		if (!(position instanceof Vector2D) || !(velocity instanceof Vector2D) || !(acceleration instanceof Vector2D)) {
			throw new TypeError("Particle constructor received wrong input types.");
		}
		this._position = new Vector2D(position.x, position.y);
		this._velocity = new Vector2D(velocity.x, velocity.y);
		this._acceleration = new Vector2D(acceleration.x, acceleration.y);
		this._radius = radius;
		this._mass = mass;
		if (mass >= 500) {
			this._isHeavyParticle = true;
		} else {
			this._isHeavyParticle = false;
		}
		this._lastMousePos = { x: position.x, y: position.y };
	}

	get position() {
		return this._position;
	}

	set position(newPosVec) {
		this._position = new Vector2D(newPosVec.x, newPosVec.y);
	}

	get velocity() {
		return this._velocity;
	}

	set velocity(newVelocityVec) {
		this._velocity = new Vector2D(newVelocityVec.x, newVelocityVec.y);
	}

	get acceleration() {
		return this._acceleration;
	}

	set acceleration(newAccel) {
		this._acceleration = new Vector2D(newAccel.x, newAccel.y);
	}

	get mass() {
		return this._mass;
	}

	set mass(newMass) {
		this._mass = newMass;
	}

	get radius() {
		return this._radius;
	}

	set radius(newRadius) {
		this._radius = newRadius;
	}

	get isHeavyParticle() {
		return this._isHeavyParticle;
	}

	get lastMousePos() {
		return this._lastMousePos;
	}

	set lastMousePos(newMousePos) {
		this._lastMousePos.x = newMousePos.x;
		this._lastMousePos.y = newMousePos.y;
	}

	Draw(context, strokeStyle, fillStyle) {
		context.beginPath();
		context.fillStyle = fillStyle;
		context.strokeStyle = strokeStyle;
		context.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
		context.stroke();
		context.fill();
	}

	DeepCopy() {
		let particle = new Particle(
			new Vector2D(this.position.x, this.position.y),
			new Vector2D(this.velocity.x, this.velocity.y),
			new Vector2D(this.acceleration.x, this.acceleration.y),
			this.radius,
			this.mass
		);
		return particle;
	}

	static GenerateRandomParticle(
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
	) {
		// normal distributed variables
		let particle = new Particle(
			new Vector2D(
				helpers.GetRandomGaussianNormal_BoxMuller(xmin, xmax, 1),
				helpers.GetRandomGaussianNormal_BoxMuller(ymin, ymax, 1)
			),
			new Vector2D(
				helpers.GetRandomGaussianNormal_BoxMuller(vxMin, vxMax, 1),
				helpers.GetRandomGaussianNormal_BoxMuller(vyMin, vyMax, 1)
			),
			new Vector2D(0, 0),
			helpers.GetRandomGaussianNormal_BoxMuller(radiusMin, radiusMax, 1),
			helpers.GetRandomGaussianNormal_BoxMuller(massMin, massMax, 1)
		);
		//console.log(particle.mass);
		// uniform distributed variables
		// let particle = new Particle(
		// 	new Vector2D(helpers.GetRandomIntFromRange(xmin, xmax), helpers.GetRandomIntFromRange(ymin, ymax)),
		// 	new Vector2D(
		// 		helpers.GetRandomIntFromRange(vxMin, vxMax),
		// 		helpers.GetRandomIntFromRange(vyMin, vyMax)
		// 	),
		//  new Vector2D(0,0),
		// 	helpers.GetRandomIntFromRange(radiusMin, radiusMax),
		// 	helpers.GetRandomIntFromRange(massMin, massMax)
		// );
		return particle;
	}

	Overlaps(otherParticle) {
		return this.position.DistanceTo(otherParticle.position) < this.radius + otherParticle.radius;
	}

	static AddNRandomParticles(
		particleList,
		N,
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
	) {
		let particles = [];
		particles = particles.concat(particleList);
		let i = 0;
		let overlappingCounter = 0;
		while (i < N) {
			let particle = this.GenerateRandomParticle(
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
					overlappingCounter++;
					break;
				}
			}
			if (overlappingCounter > 150000) {
				alert("The radius min/max are probably too large and/or the x/y ranges are too small.");
				break;
			}
			if (!twoParticlesOverlap) {
				particles.push(particle);
				i++;
			}
		}
		//console.log(overlappingCounter);
		return particles;
	}
}
