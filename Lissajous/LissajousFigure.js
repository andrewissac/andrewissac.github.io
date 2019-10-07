import Vector2D from "../Utils/Vector2D.js";
import * as helpers from "../Utils/helpers.js";

export default class Lissajous{
    constructor(
        positionVec, 
        Ax, 
        Ay, 
        omega1, 
        omega2, 
        phaseshift,
        showHorizontalLine = false,
        showVerticalLine = false){
        if(!(positionVec instanceof Vector2D)) { 
            console.log("position vector has wrong type.");
            return;
        }
        this._positionVec = positionVec;
        this._Ax = Ax;
        this._Ay = Ay;
        this._omega1 = omega1;
        this._omega2 = omega2;
        this._phaseshift = phaseshift;
        this._showHorizontalLine = showHorizontalLine;
        this._showVerticalLine = showVerticalLine;
    }

    get positionVec(){
        return this._positionVec;
    }

    set positionVec(newPosVec){
        this._positionVec.UpdatePositon(newPosVec.x, newPosVec.y);
    }

    get Ax(){
        return this._Ax;
    }

    set Ax(newAx){
        this._Ax = newAx;
    }

    get Ay(){
        return this._Ay;
    }

    set Ay(newAy){
        this._Ay = newAy;
    }

    get omega1(){
        return this._omega1;
    }

    set omega1(newOmega1){
        this._omega1 = newOmega1;
    }

    get omega2(){
        return this._omega2;
    }

    set omega2(newOmega2){
        this._omega2 = newOmega2;
    }

    get phaseshift(){
        return this._phaseshift;
    }

    set phaseshift(newPhaseshift){
        this._phaseshift = newPhaseshift;
    }

    get showHorizontalLine(){
        return this._showHorizontalLine;
    }

    set showHorizontalLine(val){
        this._showHorizontalLine = val;
    }

    get showVerticalLine(){
        return this._showVerticalLine;
    }

    set showVerticalLine(val){
        this._showVerticalLine = val;
    }

    Update(positionVec, Ax, Ay, omega1, omega2, phaseshift){
        this._positionVec = positionVec;
        this.Ax = Ax;
        this.Ay = Ay;
        this.omega1 = omega1;
        this.omega2 = omega2;
        this.phaseshift = phaseshift;
    }

    Clone(){
        return new Lissajous(this.positionVec, this.Ax, this.Ay, this.omega1, this.omega2, this.phaseshift);
    }

    Draw(context, t){

    }

}