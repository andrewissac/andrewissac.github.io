export var epsilon = 0.001;

// #region trigonometry
export function RadianToDegree(alpha) {
	return (alpha * 180) / Math.PI;
}

export function DegreeToRadian(alpha) {
	return (alpha * Math.PI) / 180;
}

export function Sin(alpha, radian = true) {
	return radian === true ? Math.sin(alpha) : Math.sin(DegreeToRadian(alpha));
}

export function Cos(alpha, radian = true) {
	return radian === true ? Math.sin(alpha) : Math.sin(DegreeToRadian(alpha));
}
// #endregion

// #region generate random entities
export function GetRandomInt(max) {
	return Math.floor(Math.random() * Math.floor(max));
}

export function GetRandomIntFromRange(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

export function GetRandomColor(colors) {
	return colors[Math.floor(Math.random() * colors.length)];
}

export function GetRandomGaussianNormal_BoxMuller(min, max, skew = 1) {
	let u = 0,
		v = 0;
	while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
	while (v === 0) v = Math.random();
	let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);

	num = num / 10.0 + 0.5; // Translate to 0 -> 1
	if (num > 1 || num < 0) num = GetRandomGaussianNormal_BoxMueller(min, max, skew); // resample between 0 and 1 if out of range
	num = Math.pow(num, skew); // Skew
	num *= max - min; // Stretch to fill range
	num += min; // offset to min
	return num;
}
// #endregion

export function Distance(x1, y1, x2, y2) {
	const xDist = x2 - x1;
	const yDist = y2 - y1;
	return Math.sqrt(xDist * xDist + yDist * yDist);
}

// #region drawing functions
export function drawHorizontalLine(context, posY, canvasWidth, rgbaStroke) {
	context.strokeStyle = rgbaStroke;
	context.moveTo(0, posY);
	context.lineTo(canvasWidth, posY);
}

export function drawVerticalLine(context, posX, canvasHeigth, rgbaStroke) {
	context.strokeStyle = rgbaStroke;
	context.moveTo(posX, 0);
	context.lineTo(posX, canvasHeigth);
}

export function drawCircle(context, origin, radius, rgbaStroke) {
	context.strokeStyle = rgbaStroke;
	context.arc(origin.x, origin.y, radius, 0, 2 * Math.PI);
}

export function drawFilledCircle(context, origin, radius, rgbaStroke, rgbaFill) {
	context.fillStyle = rgbaFill;
	context.strokeStyle = rgbaStroke;
	context.arc(origin.x, origin.y, radius, 0, 2 * Math.PI);
}

export function range(start, end, step = 1) {
	const allNumbers = [start, end, step].every(Number.isFinite);

	// if (!allNumbers) {
	//   throw new TypeError('range() expects only finite numbers as arguments.');
	// }

	if (step <= 0) {
		throw new Error("step must be a number greater than 0.");
	}

	if (start > end) {
		step = -step;
	}

	const length = Math.floor(Math.abs((end - start) / step));
	return Array.from(Array(length), (x, index) => start + index * step);
}

export function make2DArray(rows, cols) {
	var arr = new Array(rows);
	for (var i = 0; i < arr.length; i++) {
		arr[i] = new Array(cols);
	}
	return arr;
}

export class ColorRGBA {
	constructor(R, G, B, A) {
		this._R = parseInt(R);
		this._G = parseInt(G);
		this._B = parseInt(B);
		this._A = parseFloat(A);
		this._RGBA = "rgba(" + this._R + "," + this._G + "," + this._B + "," + this._A + ")";
	}

	get R() {
		return this._R;
	}

	set R(newR) {
		this._R = parseInt(newR);
		this._RGBA = "rgba(" + this._R + "," + this._G + "," + this._B + "," + this._A + ")";
	}

	get G() {
		return this._G;
	}

	set G(newG) {
		this._G = parseInt(newG);
		this._RGBA = "rgba(" + this._R + "," + this._G + "," + this._B + "," + this._A + ")";
	}

	get B() {
		return this._B;
	}

	set B(newB) {
		this._B = parseInt(newB);
		this._RGBA = "rgba(" + this._R + "," + this._G + "," + this._B + "," + this._A + ")";
	}

	get A() {
		return this._A;
	}

	set A(newA) {
		this._A = parseFloat(newA);
		this._RGBA = "rgba(" + this._R + "," + this._G + "," + this._B + "," + this._A + ")";
	}

	get RGBA() {
		return this._RGBA;
	}

	static LinearInterpolateColors(colors, percentage) {
		let percentage_ = parseFloat(percentage);
		if (colors.length < 2) {
			throw new Error("LinearInterpolateColors: need at least 2 colors to interpolate.");
		}
		colors.forEach((color) => {
			if (!(color instanceof ColorRGBA)) {
				throw new TypeError("LinearInterpolateColors: colors have wrong type");
			} else if (percentage_ < 0 || percentage_ > 1) {
				throw new Error("LinearInterpolateColors: Percentage out of range. Expected a value between 0 and 1.");
			}
		});
		let intervalCount = colors.length - 1;
		let intervalSize = 1 / intervalCount;
		let intervalNumber = Math.floor(percentage_ / intervalSize);
		let scaledPercentage = percentage_ / intervalSize - intervalNumber;

		if (percentage_ === 1) {
			return colors[colors.length - 1];
		} else {
			return new ColorRGBA(
				colors[intervalNumber].R + scaledPercentage * (colors[intervalNumber + 1].R - colors[intervalNumber].R),
				colors[intervalNumber].G + scaledPercentage * (colors[intervalNumber + 1].G - colors[intervalNumber].G),
				colors[intervalNumber].B + scaledPercentage * (colors[intervalNumber + 1].B - colors[intervalNumber].B),
				colors[intervalNumber].A + scaledPercentage * (colors[intervalNumber + 1].A - colors[intervalNumber].A)
			);
		}
	}
}

function ComponentToHex(c) {
	var hex = c.toString(16);
	return hex.length == 1 ? "0" + hex : hex;
}

export function RgbaToHex(color) {
	if (color instanceof ColorRGBA) {
		throw new TypeError("RgbaToHex: input parameter has wrong type.");
	}
	return "#" + ComponentToHex(color.R) + ComponentToHex(color.G) + ComponentToHex(color.B);
}

export function HexToRGBA(hex) {
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result
		? new ColorRGBA(parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16), 1.0)
		: null;
}

// #endregion
