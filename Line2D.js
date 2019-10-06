import Vector2D from "./Vector2D.js";
import { epsilon } from "./helpers.js";

export default class Line2D{
    constructor(tempOffsetVec, tempDirectionVec){
        // objects are passed by REFERENCE in javascript (just as in C#)! => new Vector2D
        if(!tempOffsetVec instanceof Vector2D || !(tempDirectionVec instanceof Vector2D)){
            console.log("Input parameter for Line is not a Vector!: " + typeof(tempDirectionVec));
            console.log(tempDirectionVec);
        }
        this._offset = new Vector2D(tempOffsetVec.x, tempOffsetVec.y);
        this._direction = new Vector2D(tempDirectionVec.x, tempDirectionVec.y);
    }

    static CreateLineFromTwoPoints(x1, x2, y1, y2){
        return new Line2D(new Vector2D(x1,y2), new Vector2D(x2,y2));
    }

    get offset (){
        return this._offset;
    }

    set offset (newOffset){
        this._offset = new Vector2D(newOffset.x, newOffset.y);
    }

    get direction (){
        return this._direction;
    }

    set direction (newDirection){
        this._direction = new Vector2D(newDirection.x, newDirection.y);
    }

    GetIntersectionPointWith(otherLine){
        const x1 = this.offset.x;
        const y1 = this.offset.y;

        const x2 = this.offset.x + this.direction.x;
        const y2 = this.offset.y + this.direction.y;

        const x3 = otherLine.offset.x;
        const y3 = otherLine.offset.y;

        const x4 = otherLine.offset.x + otherLine.direction.x;
        const y4 = otherLine.offset.y + otherLine.direction.y;

        const denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
        // check if denominator is almost or equal to zero while avoiding floating point errors
        if(Math.abs(denominator) < epsilon){
            return;
        }
        else{
            const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denominator;
            const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denominator;
            return this.GetPointOnLine(t, u);
        }
    }

    GetPointOnLine(t, u){
        // t and u must be between 0.0 and 1.0
        if(0.0 <= t && t <= 1.0 && 0.0 <= u && u <= 1.0){
            return new Vector2D(this.offset.x + t * this.direction.x, this.offset.y + t * this.direction.y);
        }
    }

    static GetRandomLine2D(xmin, xmax, ymin, ymax){
        const offset = Vector2D.GetRandomVector(xmin, xmax, ymin, ymax);
        const endPoint = Vector2D.GetRandomVector(xmin, xmax, ymin, ymax);
        const direction = Vector2D.GetVectorBetween(offset, endPoint);
        return new Line2D(offset, direction);
    }

    static GetRandomLines2D(numberOfLines, xmin, xmax, ymin, ymax){
        let lines = [];
        // add random lines inside canvas
        for(let i = 0; i < numberOfLines; i++){
            lines.push(this.GetRandomLine2D(xmin, xmax, ymin, ymax));
        }
        return lines;
    }

    static GetWallLines2D(canvasWidth, canvasHeight){
        let lines = [];
        const origin = new Vector2D(0,0);
        const right = new Vector2D(canvasWidth, 0);
        const down = new Vector2D(0, canvasHeight);
        lines.push(new Line2D(origin, right));
        lines.push(new Line2D(origin, down));
        lines.push(new Line2D(right, down));
        lines.push(new Line2D(down, right));
        return lines;
    }

    Draw(context){
        context.moveTo(this.offset.x, this.offset.y);
        context.lineTo(this.offset.x + this.direction.x, this.offset.y + this.direction.y);
        context.stroke();
    }
}