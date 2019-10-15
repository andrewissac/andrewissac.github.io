import * as helpers from "../Utils/helpers.js";


export default class Photon{
    constructor(position, direction, energy){
        this._direction = direction;
        this._energy = energy;
        this._momentum = CalcMomentum;
    }
}