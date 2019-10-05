import Vector2D from "./Vector2D.js";
import Line2D from "./Line2D.js";
import Raycaster from "./Raycaster.js";
import { GetRandomIntFromRange } from "./helpers.js";

var canvas_width = 800;
var canvas_height = 500;

// convention: underscore => in place methods

var canvas = document.getElementById("myCanvas");
canvas.width = canvas_width;
canvas.height = canvas_height;
var ctx = canvas.getContext('2d');


var numberOfRandomLines = 6;
var randomLines = [];
const walls = Line2D.GetWallLines2D(canvas_width, canvas_height);

var wallCountSlider = document.getElementById("wallCountSlider");
wallCountSlider.value = numberOfRandomLines;
var wallCountValue = document.getElementById("wallCountValue");
wallCountValue.innerHTML = wallCountSlider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
wallCountSlider.oninput = function() {
  wallCountValue.innerHTML = this.value;
  numberOfRandomLines = this.value;
  GetNewRandomLines();
}

function GetAndSetRandomLinesAndWalls(){
  randomLines = Line2D.GetRandomLines2D(numberOfRandomLines, 100,canvas_width-100, 100,canvas_height-100);
  for(let wall of walls){
    randomLines.push(wall);
  }
}

function ClearRandomLinesAndWalls(){
  while(randomLines.length > 0) { randomLines.pop(); }
}

GetAndSetRandomLinesAndWalls();

var raycount = 80;
var rayCountSlider = document.getElementById("rayCountSlider");
rayCountSlider.value = raycount;
var rayCountVal = document.getElementById("rayCountValue");
rayCountVal.innerHTML = rayCountSlider.value; // Display the default slider value

var initialRaycasterPosition = new Vector2D(Math.floor(canvas_width/2), Math.floor(canvas_height/2));
var rayCaster = new Raycaster(initialRaycasterPosition, raycount);

// Update the current slider value (each time you drag the slider handle)
rayCountSlider.oninput = function() {
  rayCountVal.innerHTML = this.value;
  rayCaster.rayCount = this.value;
}

function drawPoints(points){
  if(typeof(points) === "undefined") { return; }
  for(let i=0; i < points.length; i++){
    drawPoint(points[i]);
  }
}

function drawPoint(point){
  if(typeof(point) === 'undefined' || point === null) { return; }
  ctx.save();
  ctx.globalAlpha = 1.0;
  ctx.beginPath();
  ctx.fillStyle = "#FFFF00";
  ctx.fillRect(point.x, point.y, 1, 1);
  ctx.restore();
}

function drawLine(line){
  ctx.moveTo(line.offset.x, line.offset.y);
  ctx.lineTo(line.offset.x + line.direction.x, line.offset.y + line.direction.y);
  ctx.stroke();
}

function drawRandomLines(randomLines){
  ctx.beginPath();
  ctx.save();
  ctx.strokeStyle = "rgba(255, 255, 255, 1.0)";
  for(let i = 0; i < randomLines.length; i++){
    drawLine(randomLines[i]);
  }
  ctx.restore();
}

function drawRaycasterRays(Raycaster){
  ctx.save();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
  ctx.beginPath(); // somehow causes flickering INSIDE the loop, disappears outside
  for(let i = 0; i < Raycaster.rays.length; i++){
    //ctx.beginPath();
    drawLine(rayCaster.rays[i]);
  }
  ctx.restore();
}

var pointerOnCanvas = false;

function SetPointerOnCanvas(myBool){
  if (pointerOnCanvas === !myBool){
    pointerOnCanvas = myBool;
  }
}

if (canvas.PointerEvent){
  // handle all entering pointer scenarios
  canvas.addEventListener('pointerover', SetPointerOnCanvas(true));
  canvas.addEventListener('pointerenter', SetPointerOnCanvas(true));
  canvas.addEventListener('pointerdown', SetPointerOnCanvas(true));
  // handle all leaving pointer scenarios
  canvas.addEventListener('pointerup', SetPointerOnCanvas(false));
  canvas.addEventListener('pointerleave', SetPointerOnCanvas(false));
  canvas.addEventListener('pointerout', SetPointerOnCanvas(false));
  canvas.addEventListener('pointercancel', SetPointerOnCanvas(false));
  // handle pointer move scenario
  canvas.addEventListener('pointermove', 
  function(event){
    rayCaster.position.x = event.x;
    rayCaster.position.y = event.y;
  });
} else{
  canvas.addEventListener('mousemove', 
  function(event){
    rayCaster.position.x = event.x;
    rayCaster.position.y = event.y;
});

canvas.addEventListener('mouseenter',
  function(){
    if(pointerOnCanvas === false) { 
      pointerOnCanvas = true;
    }
});

canvas.addEventListener('mouseleave',
function(event){
  if(pointerOnCanvas === true) { 
    pointerOnCanvas = false;
  }
});
}


window.setInterval(GetNewRandomLines, 5000);

function GetNewRandomLines(){
  ClearRandomLinesAndWalls();
  GetAndSetRandomLinesAndWalls();
}

var xoff = 0;
var yoff = 500;
function draw(){
  let tempx = rayCaster.position.x + noise.perlin2(xoff,yoff)*200;
  let tempy = rayCaster.position.y + noise.perlin2(yoff,xoff)*200;
  xoff += 0.002;
  yoff += 0.002;
  if(tempx < 0 || tempx > canvas_width || tempy < 0 || tempy > canvas_height){
    rayCaster.position.x = Math.floor(canvas_width / 2);
    rayCaster.position.y = Math.floor(canvas_height / 2);
  }
  if(pointerOnCanvas === false){
    // if mouse leaves => set it back to mid
    rayCaster.position.x = Math.floor(canvas_width / 2);
    rayCaster.position.y = Math.floor(canvas_height / 2);


    if(tempx < 0 || tempx > canvas_width || tempy < 0 || tempy > canvas_height){
      rayCaster.position.x = Math.floor(canvas_width / 2);
      rayCaster.position.y = Math.floor(canvas_height / 2);
    }
    else{
      rayCaster.position.x = tempx;
      rayCaster.position.y = tempy;
    }
  }
  ctx.clearRect(0, 0, canvas_width, canvas_height);

  drawRandomLines(randomLines);
  ctx.save();
  ctx.beginPath();
  ctx.fillStyle = "#FFFFFF";
  ctx.arc(rayCaster.position.x, rayCaster.position.y, 5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  // radial gradient to cast a glow around the raycaster
  // ctx.beginPath();
  // let gradient = ctx.createRadialGradient(rayCaster.position.x, rayCaster.position.y, 1, rayCaster.position.x,rayCaster.position.y,60);
  // gradient.addColorStop(0, "rgba(255, 255, 255, 0.3)");
  // gradient.addColorStop(1, "rgba(255, 255, 255, 0.0)");
  // ctx.arc(rayCaster.position.x, rayCaster.position.y, 60, 0, 2 * Math.PI);
  // ctx.fillStyle = gradient;
  // ctx.fill();

  // update raycaster position(setter updates rays too)
  rayCaster.UpdateRays();
  const intersectionPoints = rayCaster.FindAllClosestIntersectionPoints(randomLines);
  rayCaster.CutRaysAtClosestIntersectionPoint(intersectionPoints);
  drawRaycasterRays(rayCaster);
  drawPoints(intersectionPoints);


  window.requestAnimationFrame(draw);
}



window.requestAnimationFrame(draw);

