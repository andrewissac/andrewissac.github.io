

// #region global variables
var canvasHeight = 500;
var canvasWidth = 500;
// #endregion

// Get canvas and context of canvas
var canvas = document.getElementById("myCanvas");
canvas.width = canvasWidth;
canvas.height = canvasHeight;
var ctx = canvas.getContext('2d');

// #region drawing functions
function drawPoint(point){
    if(typeof(point) === 'undefined' || point === null) { return; }
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = "#FFFF00";
    ctx.fillRect(point.x, point.y, 1, 1);
    ctx.restore();
  }

  function drawCircle(origin, radius, rgbaStroke){
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = rgbaStroke;
    ctx.arc(origin.x, origin.y, radius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.restore();
  }

  function drawFilledCircle(origin, radius, rgbaStroke, rgbaFill){
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = rgbaFill;
    ctx.strokeStyle = rgbaStroke;
    ctx.arc(origin.x, origin.y, radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
// #endregion

// #region animation function
    function draw(){
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        window.requestAnimationFrame(draw);
    }
// #endregion

window.requestAnimationFrame(draw);