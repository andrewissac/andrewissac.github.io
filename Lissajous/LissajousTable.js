import Lissajous from "./LissajousFigure.js";
import Vector2D from "../Utils/Vector2D.js";

export default class LissajousTable{
    constructor(rows, cols, canvasWidth, canvasHeight, cellMarginX, cellMarginY){
        this._rows = rows;
        this._cols = cols;
        this._cellMarginX = cellMarginX;
        this._cellMarginY = cellMarginY;
        this._cellWidth = Math.floor(canvasWidth / cols);
        this._cellHeight = Math.floor(canvasHeight / cols);
        this.figures = [];
        this.FillTable();
    }

    get rows(){
        return this._rows;
    }

    set rows(newRowCount){
        this._rows = newRowCount;
    }

    get cols(){
        return this._cols;
    }

    set cols(newColCount){
        this._cols = newColCount;
    }

    ClearTable(){
        this.figures = [];
    }

    FillTable(){
        for(let i = 0; i < this.rows ; i++){
            this.figures[i] = [];
            for(let j = 0; j < this.cols; j++){
                const figurePos = new Vector2D(
                    (j + 1) * this._cellWidth + (2 * j + 1) * this._cellMarginX,
                    (i + 1) * this._cellHeight + (2 * i + 1) * this._cellMarginY);
                // top left entry
                if(i === 0 && j === 0){
                    this.figures[i][j] = new Lissajous(
                        figurePos, Math.floor(this._cellWidth / 2 - this._cellMarginX) , Math.floor(this._cellHeight / 2 - this._cellMarginY),
                        i+1, j+1, 0, Math.PI/2);
                }
                // first row
                else if(i === 0 && j > 0){
                    this.figures[i][j] = new Lissajous(
                        figurePos, Math.floor(this._cellWidth / 2 - this._cellMarginX), Math.floor(this._cellHeight / 2 - this._cellMarginY),
                        j, j, 0, Math.PI/2, false, true);
                }
                // first column
                else if(j === 0 && i > 0){
                    this.figures[i][j] = new Lissajous(
                        figurePos, Math.floor(this._cellWidth / 2 - this._cellMarginX), Math.floor(this._cellHeight / 2 - this._cellMarginY),
                        i, i, 0, Math.PI/2, true, false);
                }
                // rest of table actual lissajous figures
                else{
                    this.figures[i][j] = new Lissajous(
                        figurePos, Math.floor(this._cellWidth / 2 - this._cellMarginX), Math.floor(this._cellHeight / 2 - this._cellMarginY),
                        i+1, j+1, 0, Math.PI/2);
                }
            }
        }
    }


}