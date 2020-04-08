import * as helpers from "../Utils/helpers.js";
import Vector2D from "../Utils/Vector2D.js";

export default class Particle {
	constructor(position, velocity, radius = 3, mass = 1) {
		this._position = new Vector2D(position.x, position.y);
		this._velocity = new Vector2D(velocity.x, velocity.y);
		this._radius = radius;
		this._mass = mass;
		if (mass >= 500) {
			this._isHeavyParticle = true;
		} else {
			this._isHeavyParticle = false;
		}
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
		let plusOrMinus1 = Math.random() < 0.5 ? -1 : 1;
		let plusOrMinus2 = Math.random() < 0.5 ? -1 : 1;
		// normal distributed variables
		let particle = new Particle(
			new Vector2D(
				helpers.GetRandomGaussianNormal_BoxMuller(xmin, xmax, 1),
				helpers.GetRandomGaussianNormal_BoxMuller(ymin, ymax, 1)
			),
			new Vector2D(
				helpers.GetRandomGaussianNormal_BoxMuller(vxMin, vxMax, 1) * plusOrMinus1,
				helpers.GetRandomGaussianNormal_BoxMuller(vyMin, vyMax, 1) * plusOrMinus2
			),
			helpers.GetRandomGaussianNormal_BoxMuller(radiusMin, radiusMax, 1),
			helpers.GetRandomGaussianNormal_BoxMuller(massMin, massMax, 1)
		);
		// uniform distributed variables
		// let particle = new Particle(
		// 	new Vector2D(helpers.GetRandomIntFromRange(xmin, xmax), helpers.GetRandomIntFromRange(ymin, ymax)),
		// 	new Vector2D(
		// 		helpers.GetRandomIntFromRange(vxMin, vxMax) * plusOrMinus1,
		// 		helpers.GetRandomIntFromRange(vyMin, vyMax) * plusOrMinus2
		// 	),
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
