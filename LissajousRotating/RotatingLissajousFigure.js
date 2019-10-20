import Lissajous from "../Lissajous/LissajousFigure.js";
import * as helpers from "../Utils/helpers.js";
import Vector2D from "../Utils/Vector2D.js";

export default class RotatingLissajousFigure extends Lissajous {
	constructor(
		center,
		cellSize,
		omega1,
		omega2,
		phaseshift1,
		phaseshift2,
		showHorizontalLine = false,
		showVerticalLine = false
	) {
		super(center, cellSize, omega1, omega2, phaseshift1, phaseshift2, showHorizontalLine, showVerticalLine);
	}

	DrawWholeFigure(bgContext, fgContext) {
		const t = helpers.range(0, 6.28, 0.01);
		fgContext.beginPath();
		fgContext.save();
		const hue = this.phaseshift2 * 100 > 255 ? (this._phaseshift2 * 100) % 255 : this.phaseshift2 * 100; // makes sure rainbowcolors are repeating
		fgContext.strokeStyle = "hsl(" + hue + ", 100%,  78%)";
		fgContext.lineWidth = 2;
		let pos = new Vector2D(0, 0);
		let newPos = new Vector2D(0, 0);

		for (let i = 0; i < t.length - 1; i++) {
			pos = this.center.Add(this.CalcXY(t[i]));
			newPos = this.center.Add(this.CalcXY(t[i + 1]));
			fgContext.moveTo(pos.x, pos.y);
			fgContext.lineTo(newPos.x, newPos.y);
		}
		fgContext.stroke();
		fgContext.restore();
	}
}
