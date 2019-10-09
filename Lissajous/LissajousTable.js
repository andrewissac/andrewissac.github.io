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
        for(let row = 0; row < this.rows ; row++){
            this.figures[row] = [];
            for(let col = 0; col < this.cols; col++){
                const figurePos = new Vector2D(
                    col * this._cellWidth + (2 * col + 1) * this._cellMarginX,
                    row * this._cellHeight + (2 * row + 1) * this._cellMarginY);
                // top left entry
                if(row === 0 && col === 0){
                    // this is actually just a dummy that will not be displayed anyways
                    this.figures[row][col] = new Lissajous(
                        figurePos, Math.floor(this._cellWidth / 2 - 2 * this._cellMarginX) , Math.floor(this._cellHeight / 2 -  2 * this._cellMarginY),
                        0, 0, 0, Math.PI/2);
                }
                // first row
                else if(row === 0 && col > 0){
                    this.figures[row][col] = new Lissajous(
                        figurePos, Math.floor(this._cellWidth / 2 - 2 * this._cellMarginX), Math.floor(this._cellHeight / 2 - 2 * this._cellMarginY),
                        col, col, 0, Math.PI/2, false, true);
                }
                // first column
                else if(col === 0 && row > 0){
                    this.figures[row][col] = new Lissajous(
                        figurePos, Math.floor(this._cellWidth / 2 - 2 * this._cellMarginX), Math.floor(this._cellHeight / 2 - 2 * this._cellMarginY),
                        row, row, 0, Math.PI/2, true, false);
                }
                // rest of table actual lissajous figures
                else{
                    const tempX = figurePos.x;
                    const tempY = figurePos.y;
                    figurePos.x = tempY;
                    figurePos.y = tempX;
                    this.figures[row][col] = new Lissajous(
                        figurePos, Math.floor(this._cellWidth / 2 - 2 * this._cellMarginX), Math.floor(this._cellHeight / 2 - 2 * this._cellMarginY),
                        row, col, 0, Math.PI/2);
                }
            }
        }
    }

}