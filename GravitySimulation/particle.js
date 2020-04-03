import * as helpers from "../Utils/helpers.js";
import Vector2D from "../Utils/Vector2D.js";

export default class Particle {
	constructor(position, velocity, mass = 1) {
		this._position = new Vector2D(position.x, position.y);
		this._velocity = new Vector2D(velocity.x, velocity.y);
		this._mass = mass;
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

	DeepCopy() {
		let particle = new Particle(
			new Vector2D(this.position.x, this.position.y),
			new Vector2D(this.velocity.x, this.velocity.y),
			this.mass
		);
		return particle;
	}

	static GenerateRandomParticle(xPosMin, xPosMax, yPosMin, yPosMax, vxMin, vxMax, vyMin, vyMax, massMin, massMax) {
		return new Particle(
			new Vector2D(
				helpers.GetRandomGaussianNormal_BoxMuller(xPosMin, xPosMax, 1),
				helpers.GetRandomGaussianNormal_BoxMuller(yPosMin, yPosMax, 1)
			),
			new Vector2D(
				helpers.GetRandomGaussianNormal_BoxMuller(vxMin, vxMax, 1),
				helpers.GetRandomGaussianNormal_BoxMuller(vyMin, vyMax, 1)
			),
			helpers.GetRandomGaussianNormal_BoxMuller(massMin, massMax, 1)
		);
	}
}
