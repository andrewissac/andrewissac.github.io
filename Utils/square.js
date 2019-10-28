import Vector2D from "./Vector2D.js";

export default class Square {
	constructor(center, length, alphaRadian) {
		this._center = new Vector2D(center.x, center.y);
		this._length = length;
		this._alpha = alphaRadian;
		this._cornerPoints = [];
		this.CalcAndSetCornerPoints();
	}

	get center() {
		return this._center;
	}

	set center(newCenter) {
		this._center = new Vector2D(newCenter.x, newCenter.y);
	}

	get cornerPoints() {
		return this._cornerPoints;
	}

	get length() {
		return this._length;
	}

	set length(newLength) {
		this._length = newLength;
		this.CalcAndSetCornerPoints();
	}

	get alpha() {
		return this._alpha;
	}

	set alpha(newAlpha) {
		this._alpha = newAlpha;
		this.CalcAndSetCornerPoints();
	}

	CalcAndSetCornerPoints() {
		while (this._cornerPoints.length > 0) {
			this._cornerPoints.pop();
		}
		this._cornerPoints.push(
			new Vector2D(Math.floor(this.center.x - this.length / 2), Math.floor(this.center.y - this.length / 2))
		);
		this._cornerPoints.push(
			new Vector2D(Math.floor(this.center.x + this.length / 2), Math.floor(this.center.y - this.length / 2))
		);
		this._cornerPoints.push(
			new Vector2D(Math.floor(this.center.x - this.length / 2), Math.floor(this.center.y + this.length / 2))
		);
		this._cornerPoints.push(
			new Vector2D(Math.floor(this.center.x + this.length / 2), Math.floor(this.center.y + this.length / 2))
		);
		for (let point of this._cornerPoints) {
			point._RotateCW(this.alpha);
			// point.x = Math.floor(point.x);
			// point.y = Math.floor(point.y);
		}
	}

	Draw(ctx) {}
}
