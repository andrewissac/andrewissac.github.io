import Vector2D from "../Utils/Vector2D.js";
import * as helpers from "../Utils/helpers.js";

export default class Circle {
	constructor(origin, radius) {
		this._origin = new Vector2D(origin.x, origin.y);
		this._radius = radius;
	}

	get origin() {
		return this._origin;
	}

	set origin(newOrigin) {
		this._origin = new Vector2D(newOrigin.x, newOrigin.y);
	}

	get radius() {
		return this._radius;
	}

	set radius(newRadius) {
		this._radius = newRadius;
	}

	DrawPointOnCircle(ctx, angle, pointRadius, strokeStyle, fillStyle) {
		const position = new Vector2D(
			this.origin.x + this.radius * Math.cos(angle),
			this.origin.y + this.radius * Math.sin(angle)
		);
		helpers.drawFilledCircle(ctx, position, pointRadius, strokeStyle, fillStyle);
	}

	GetPointOnCircle(angle) {
		return new Vector2D(
			this.origin.x + this.radius * Math.cos(angle),
			this.origin.y + this.radius * Math.sin(angle)
		);
	}
}
