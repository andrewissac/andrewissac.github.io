import Vector2D from "../Utils/Vector2D.js";
import * as helpers from "../Utils/helpers.js";

export default class Lissajous{
    constructor(
        figurePosition, 
        Ax, 
        Ay, 
        omega1, 
        omega2, 
        phaseshift1,
        phaseshift2,
        showHorizontalLine = false,
        showVerticalLine = false){
        if(!(figurePosition instanceof Vector2D)) { 
            console.log("position vector has wrong type.");
            return;
        }
        this._figurePosition = figurePosition;
        this._Ax = Ax; // half the size of the figuresize
        this._Ay = Ay; // half the size of the figuresize
        this._omega1 = omega1;
        this._omega2 = omega2;
        this._phaseshift1 = phaseshift1;
        this._phaseshift2 = phaseshift2;
        this._showHorizontalLine = showHorizontalLine;
        this._showVerticalLine = showVerticalLine;
        this._coordinateOrigin = new Vector2D(
            Math.floor(figurePosition.x + Ax),
            Math.floor(figurePosition.y + Ay));
    }

    get figurePosition(){
        return this._figurePosition;
    }

    set figurePosition(newPosVec){
        this._figurePosition.UpdatePositon(newPosVec.x, newPosVec.y);
        this._coordinateOrigin.UpdatePosition(
            Math.floor(this.newPosVec.x + this._Ax / 2),
            Math.floor(this.newPosVec.y + this._Ay / 2)
            );
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

    get phaseshift1(){
        return this._phaseshift1;
    }

    set phaseshift1(newPhaseshift){
        this._phaseshift1 = newPhaseshift;
    }

    get phaseshift2(){
        return this._phaseshift2;
    }

    set phaseshift2(newPhaseshift){
        this._phaseshift2 = newPhaseshift;
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

    CalcXY(t){
        return new Vector2D(
            this.Ax * Math.sin(this.omega1 * t + this.phaseshift1), 
            this.Ay * Math.sin(this.omega2 * t + this.phaseshift2));
    }

    Clone(){
        return new Lissajous(
            this.figurePosition, this.Ax, this.Ay, 
            this.omega1, this.omega2, this.phaseshift1, this.phaseshift2);
    }

    Draw(context, tOld, t){
        const oldPos = this._coordinateOrigin.Add(this.CalcXY(tOld));
        const newPos = this._coordinateOrigin.Add(this.CalcXY(t));
        context.beginPath();
        context.moveTo(oldPos.x, oldPos.y);
        context.lineTo(newPos.x, newPos.y);
        context.stroke();
    }

}