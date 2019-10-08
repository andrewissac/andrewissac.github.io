import Vector2D from "../Utils/Vector2D.js";
import Line2D from "./Line2D.js";
import Raycaster from "./Raycaster.js";
import "../Utils/simplexNoise.js";

// #region global variables
  var canvas_width = 800;
  var canvas_height = 500;

  var numberOfRandomWalls = 6;
  var raycount = 80;
  var walls = [];
  const canvasWalls = Line2D.GetWallLines2D(canvas_width, canvas_height);
  var initialRaycasterPosition = new Vector2D(Math.floor(canvas_width/2), Math.floor(canvas_height/2));
  var rayCaster = new Raycaster(initialRaycasterPosition, raycount);

  var simplex = new SimplexNoise(Date.now());
  // set arbitrary initial values for the simplexNoise
  var simplexOffsetX = 0;
  var simplexOffsetY = 500;
  var pointerOnCanvas = false;
  // automatic wall creation every 5 seconds
  window.setInterval(GetNewRandomLines, 5000);
  GetAndSetRandomLinesAndWalls();
// #endregion

// Get canvas and context of canvas
var canvas = document.getElementById("myCanvas");
canvas.width = canvas_width;
canvas.height = canvas_height;
var ctx = canvas.getContext('2d');

// #region method to get/set new RANDOM walls or clear them
  function GetAndSetRandomLinesAndWalls(){
    walls = Line2D.GetRandomLines2D(numberOfRandomWalls, 100,canvas_width-100, 100,canvas_height-100);
    for(let wall of canvasWalls){
      walls.push(wall);
    }
  }

  function ClearRandomLinesAndWalls(){
    while(walls.length > 0) { walls.pop(); }
  }

  function GetNewRandomLines(){
    ClearRandomLinesAndWalls();
    GetAndSetRandomLinesAndWalls();
  }
// #endregion


// #region Sliders
  // #region WallCount slider
  var wallCountSlider = document.getElementById("wallCountSlider");
  wallCountSlider.value = numberOfRandomWalls;
  var wallCountValue = document.getElementById("wallCountValue");
  wallCountValue.innerHTML = wallCountSlider.value; // Display the default slider value

  // Update the current slider value (each time you drag the slider handle)
  wallCountSlider.oninput = function() {
    wallCountValue.innerHTML = this.value;
    numberOfRandomWalls = this.value;
    GetNewRandomLines();
  }
  // #endregion

  // #region RayCount slider
  var rayCountSlider = document.getElementById("rayCountSlider");
  rayCountSlider.value = raycount;
  var rayCountVal = document.getElementById("rayCountValue");
  rayCountVal.innerHTML = rayCountSlider.value; // Display the default slider value

  // Update the current slider value (each time you drag the slider handle)
  rayCountSlider.oninput = function() {
    rayCountVal.innerHTML = this.value;
    rayCaster.rayCount = this.value;
  }
  // #endregion
// #endregion

// #region Draw functions
  function drawPoints(points){
    if(typeof(points) === "undefined") { return; }
    ctx.beginPath();
    for(let i=0; i < points.length; i++){
      drawPoint(points[i]);
    }
  }

  function drawPoint(point){
    if(typeof(point) === 'undefined' || point === null) { return; }
    ctx.save();
    ctx.fillStyle = "#FFFF00";
    ctx.fillRect(point.x, point.y, 1, 1);
    ctx.restore();
  }

  function drawCircle(origin, radius, rgba){
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = rgba;
    ctx.arc(origin.x, origin.y, radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  function drawLines(lines){
    ctx.save();
    ctx.strokeStyle = "rgba(255, 255, 255, 1.0)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    for(let i = 0; i < lines.length; i++){
      lines[i].Draw(ctx);
    }
    ctx.stroke();
    ctx.restore();
  }

  function drawRays(Raycaster){
    ctx.save();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
    ctx.lineWidth = 1;
    ctx.beginPath()
    Raycaster.Draw(ctx);
    ctx.stroke();
    ctx.restore();
  }
// #endregion

// #region Handle mouse events
  function SetPointerOnCanvas(myBool){
    if (pointerOnCanvas === !myBool){
      pointerOnCanvas = myBool;
    }
  }

  canvas.addEventListener('touchstart',  
  function(event){
    SetPointerOnCanvas(true);
    event.preventDefault();
  });

  canvas.addEventListener('touchend',  
  function(event){
    SetPointerOnCanvas(false);
    event.preventDefault();
  });

  canvas.addEventListener('touchmove', 
  function(event){
    let touchobj = event.changedTouches[0];
    rayCaster.position.x = touchobj.clientX;
    rayCaster.position.y = touchobj.clientY;
    event.preventDefault();
  });

  canvas.addEventListener('mouseenter',
  function(event){
    SetPointerOnCanvas(true);
  });

  canvas.addEventListener('mouseleave',  
  function(event){
    SetPointerOnCanvas(false);
  });

  canvas.addEventListener('mousemove', 
  function(event){
      rayCaster.position.x = event.x;
      rayCaster.position.y = event.y;
  });
//#endregion

// #region animation function
  function draw(){
    // handle random motion with simplexNoise when no pointer on the canvas
    if(pointerOnCanvas === false){
      // if mouse leaves => set it back to mid
      rayCaster.position.x = Math.floor(canvas_width / 2);
      rayCaster.position.y = Math.floor(canvas_height / 2);

      // perlin noise creates random but smooth movement
      let tempx = rayCaster.position.x + simplex.noise2D(simplexOffsetX, simplexOffsetY)*200;
      let tempy = rayCaster.position.y + simplex.noise2D(simplexOffsetY, simplexOffsetX)*200;
      // change variables to get new point on next draw
      simplexOffsetX += 0.0015;
      simplexOffsetY += 0.0015;
      
      // out of bounds checks
      if(tempx < 0 || tempx > canvas_width || tempy < 0 || tempy > canvas_height){
        rayCaster.position.x = Math.floor(canvas_width / 2);
        rayCaster.position.y = Math.floor(canvas_height / 2);
      }
      else{
        rayCaster.position.x = tempx;
        rayCaster.position.y = tempy;
      }
    }
    //clear the whole canvas
    ctx.clearRect(0, 0, canvas_width, canvas_height);
    drawLines(walls);
    // Draw white dot at the center of the rays
    drawCircle(rayCaster.position, 2, "rgba(255, 255, 255, 1.0)");

    // update raycaster position
    rayCaster.UpdateRays();
    const intersectionPoints = rayCaster.FindAllClosestIntersectionPoints(walls);
    rayCaster.CutRaysAtClosestIntersectionPoint(intersectionPoints);
    drawRays(rayCaster);
    drawPoints(intersectionPoints);

    window.requestAnimationFrame(draw);
  }
// #endregion

window.requestAnimationFrame(draw);

