import * as helpers from "../Utils/helpers.js";
import Vector2D from "../Utils/Vector2D.js"

var G = 

export default class Blackhole{
    constructor(position, mass){
        this._position = position;
        this._mass = mass;
        this._schwarzschildradius = CalcSchwarzschildRadius();
    }

    Pull(photon){

    }

    CalcSchwarzschildRadius(mass){
        return 2*mass*G / (c**2)
    }
}