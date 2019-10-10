import Lissajous from "../Lissajous/LissajousFigure.js";
import * as helpers from "../Utils/helpers.js";
import Vector2D from "../Utils/Vector2D.js";


// #region global variables
var canvasHeight = 800;
var canvasWidth = 800;
// #endregion

// Get canvas and context of canvas
var backgroundCanvas = document.getElementById("backgroundCanvas");
backgroundCanvas.width = canvasWidth;
backgroundCanvas.height = canvasHeight;
var bgCtx = backgroundCanvas.getContext('2d');
var foregroundCanvas = document.getElementById("foregroundCanvas");
foregroundCanvas.width = canvasWidth;
foregroundCanvas.height = canvasHeight;
var fgCtx = foregroundCanvas.getContext('2d');
//ctx.lineWidth = 1;

let center = new Vector2D(Math.floor(canvasWidth/2), Math.floor(canvasHeight/2));

var lissajous = new Lissajous(center, 400, 3, 8, 0, Math.PI/2);

let t = helpers.range(0, 13, 0.01);
let i = 0;
function draw(){
    if(i > 1300){
        i = 0;
    }
    lissajous._omega1 = t[i];
    fgCtx.clearRect(0, 0, canvasWidth, canvasHeight);
    lissajous.DrawWholeFigure(bgCtx, fgCtx,t[i]);
    i++;
    window.requestAnimationFrame(draw);
}

draw();