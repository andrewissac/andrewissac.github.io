import * as helpers from "../Utils/helpers.js";

export default class Vector2D{
    constructor(x, y){
        this._x = x;
        this._y = y;
        this.length = this.GetLength();
    }

    get x (){
        return this._x;
    }

    set x (value){
        this._x = value;
    }

    get y (){
        return this._y;
    }

    set y (value){
        this._y = value;
    }

    GetLength(){
        return Math.sqrt(this.x**2 + this.y**2);
    }

    UpdateLength(){
        this.length = this.GetLength();
    }

    UpdatePosition(x, y){
        this.x = x;
        this.y = y;
        this.length = this.GetLength();
    }

    Negative(){
        return new Vector2D(this.x * -1, this.y * -1);
    }


    Add(otherVector){
        return new Vector2D(this.x + otherVector.x, this.y + otherVector.y);
    }

    Multiply(scalar){
        return new Vector2D(this.x * scalar, this.y * scalar);
    }

    DotProduct(otherVector){
        return this.x * otherVector.x + this.y * otherVector.y;
    }

    GetAngleInRadian(otherVector){
        if(this.length > 0 && otherVector.length > 0){
            return Math.acos(this.DotProduct(otherVector) / (this.length * otherVector.length));
        }
        else{
            return null;
        }
    }

    GetAngleInDegree(otherVector){
        var alpha_radian = this.GetAngleInRadian(otherVector);
        if(alpha_radian != null){
            return helpers.RadianToDegree(alpha_radian);
        }
    }

    Normalize(){
        if(this.length > 0){
            return new Vector2D(this.x / this.length, this.y / this.length);
        }
    }

    CrossProduct(otherVector){
        return new Vector2D(this.x * otherVector.y, -(this.y * otherVector.x));
    }
    
    IsCollinear(otherVector){
        return (Math.abs(0 - this.GetAngleInDegree(otherVector)) < helpers.epsilon || Math.abs(180 -this.GetAngleInDegree(otherVector)) < helpers.epsilon) ? true : false;
    }

    IsOrthogonal(otherVector){
        return (Math.abs(0 - this.DotProduct(otherVector)) < helpers.epsilon) ? true : false;
    }

    _RotateCCW(alpha_radian){
        const tempX = this.x * Math.cos(alpha_radian) - this.y * Math.sin(alpha_radian);
        const tempY = this.x * Math.sin(alpha_radian) + this.y * Math.cos(alpha_radian);
        this.x = tempX;
        this.y = tempY;
        this.UpdateLength();
    }

    RotateCCW(alpha_radian){
        const tempX = this.x * Math.cos(alpha_radian) - this.y * Math.sin(alpha_radian);
        const tempY = this.x * Math.sin(alpha_radian) + this.y * Math.cos(alpha_radian);
        return new Vector2D(tempX, tempY);
    }

    _RotateCW(alpha_radian){
        const tempX = this.x * Math.cos(alpha_radian) + this.y * Math.sin(alpha_radian);
        const tempY = -(this.x * Math.sin(alpha_radian)) + this.y * Math.cos(alpha_radian);
        this.x = tempX;
        this.y = tempY;
        this.UpdateLength();
    }

    RotateCW(alpha_radian){
        const tempX = this.x * Math.cos(alpha_radian) + this.y * Math.sin(alpha_radian);
        const tempY = -(this.x * Math.sin(alpha_radian)) + this.y * Math.cos(alpha_radian);
        return new Vector2D(tempX, tempY);
    }

    Clone(){
        return new Vector2D(this.x, this.y);
    }

    Equals(otherVector){
        return (Math.abs(this.x - otherVector.x) < helpers.epsilon) && (Math.abs(this.y - otherVector.y) < helpers.epsilon);
    }

    DistanceTo(otherVec){
        const temp = new Vector2D(otherVec.x - this.x, otherVec.y - this.y);
        return temp.GetLength();
    }
    
    static GetRandomVector(xmin, xmax, ymin, ymax){
        return new Vector2D(helpers.GetRandomIntFromRange(xmin, xmax), helpers.GetRandomIntFromRange(ymin, ymax));
    }

    static GetVectorBetween(v1, v2){
        return new Vector2D(v2.x - v1.x, v2.y - v1.y);
    }
}