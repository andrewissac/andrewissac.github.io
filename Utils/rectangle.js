export class Rectangle {
	constructor(x, y, w, h) {
		this._x = x;
		this._y = y;
		this._w = w;
		this._h = h;
	}

	get x() {
		return this._x;
	}

	set x(newX) {
		this._x = newX;
	}

	get y() {
		return this._y;
	}

	set y(newY) {
		this._y = newY;
	}

	get w() {
		return this._w;
	}

	set w(newW) {
		this._w = newW;
	}

	get h() {
		return this._h;
	}

	set h(newH) {
		this._h = newH;
	}

	containsPoint(point) {
		return point.x >= this.x && point.x <= this.x + this.w && point.y >= this.y && point.y <= this.y + this.h;
	}

	intersects(otherRectangle) {
		// these conditions actually check if they DON'T intersect, hence the ! operator is needed for checking intersection
		return !(
			otherRectangle.x > this.x + this.w ||
			this.x > otherRectangle.x + otherRectangle.w ||
			this.y > otherRectangle.y + otherRectangle.h ||
			otherRectangle.y > this.y + this.h
		);
	}
}
