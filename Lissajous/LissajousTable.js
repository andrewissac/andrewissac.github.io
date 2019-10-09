import Lissajous from "./LissajousFigure.js";
import Vector2D from "../Utils/Vector2D.js";

export default class LissajousTable{
    constructor(rows, cols, canvasWidth, canvasHeight, cellMargin){
        this._rows = rows;
        this._cols = cols;
        this._cellMargin = 10;
        this._cellWidth = Math.floor(canvasWidth / cols);
        this._cellHeight = Math.floor(canvasHeight / rows);
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
                let figurePos = new Vector2D(
                    col * this._cellWidth + col+2 * this._cellMargin,
                    row * this._cellHeight + row+2 * this._cellMargin);
                // top left entry
                if(row === 0 && col === 0){
                    // this is actually just a dummy that will not be displayed anyways
                    this.figures[row][col] = new Lissajous(
                        figurePos, Math.floor((this._cellWidth / 2) - (2 * this._cellMargin)) , Math.floor((this._cellHeight / 2) - (2 * this._cellMargin)),
                        0, 0, 0, Math.PI/2);
                }
                // first row
                else if(row === 0 && col > 0){
                    this.figures[row][col] = new Lissajous(
                        figurePos, Math.floor((this._cellWidth / 2) - (2 * this._cellMargin)), Math.floor((this._cellHeight / 2) - (2 * this._cellMargin)),
                        col, col, 0, Math.PI/2, false, true);
                }
                // first column
                else if(col === 0 && row > 0){
                    this.figures[row][col] = new Lissajous(
                        figurePos, Math.floor((this._cellWidth / 2) - (2 * this._cellMargin)), Math.floor((this._cellHeight / 2) - (2 * this._cellMargin)),
                        row, row, 0, Math.PI/2, true, false);
                }
                // rest of table actual lissajous figures
                else{
                    const tempX = figurePos.x;
                    const tempY = figurePos.y;
                    figurePos.x = tempY;
                    figurePos.y = tempX; 
                    // const figurePos_ = new Vector2D(
                    //     row * this._cellHeight +  this._cellMargin,
                    //     col * this._cellWidth +  this._cellMargin );

                    this.figures[row][col] = new Lissajous(
                        figurePos, Math.floor((this._cellWidth / 2) - (2 * this._cellMargin)), Math.floor((this._cellHeight / 2) - (2 * this._cellMargin)),
                        row, col, 0, Math.PI/2);
                }
            }
        }
    }

}