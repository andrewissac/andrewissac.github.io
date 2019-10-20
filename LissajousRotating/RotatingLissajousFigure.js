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
		bgContext.beginPath();
		bgContext.save();
		const hue = this.phaseshift2 * 100 > 360 ? (this._phaseshift2 * 100) % 360 : this.phaseshift2 * 100; // makes sure rainbowcolors are repeating
		bgContext.strokeStyle = "hsl(" + hue + ", 100%,  78%)";
		bgContext.lineWidth = 2;
		let pos = new Vector2D(0, 0);
		let newPos = new Vector2D(0, 0);

		for (let i = 0; i < t.length - 1; i++) {
			pos = this.center.Add(this.CalcXY(t[i]));
			newPos = this.center.Add(this.CalcXY(t[i + 1]));
			bgContext.moveTo(pos.x, pos.y);
			bgContext.lineTo(newPos.x, newPos.y);
		}
		bgContext.stroke();
		bgContext.restore();
	}
}
