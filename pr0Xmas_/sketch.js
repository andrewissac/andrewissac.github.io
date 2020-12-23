let cnv;
let x;
let y;

let xspeed;
let yspeed;
let gravity;

let hue;
let clr;

let gifs = [];
const relativeGif = {x: 0.53, y: 0.64, h: 0.28}

const pr0plateHeight = 2000; // hardcoded, sucks but fuck p5 async loading mess. Maybe possible to get by using pr0Plate.elt.h ?
const pr0plateWidth = 2000;

const scaleFac = 0.125;
const scaledPlate = {h:  Math.floor(pr0plateHeight * scaleFac), w:  Math.floor(pr0plateWidth * scaleFac)};
const plateAlpha = 1.0;

let richtigesGrau = "#161618"
let colorRotation = ["#ee4d2e", "#1db992", "#bfbc06", "#008fff", "#ff0082"];

let ricardoNope = 0;
let dbPos = {x, y};
let tempdbPos = {x, y};
const dbScale = 0.015;

let snow = [];
let wichtel = [];
let badges = [];

let gifIndex;
const pepeGifCount = 46;
const badgeFileCount = 32;

const snowFlakesOnScreenCount = 113;
const badgesOnScreenCount = 32;
const wichtelOnScreenCount = 12;

let snowFlakeTexture;
let badgeTextures = [];
let wichtelTexture;

// speed of the moving pr0 logo
const speed = 1.5;

// reset Peepos
let resetPeepoTimer = null;
let resetPeepoTimerIsRunning = false;
const resetPeepoCountdownStart = 10;
let resetPeepoCountdown;
let mouseInsideResetPeepoRegion = false;
let resetRegion = {x: 0, y: 0, h: 0, w: 0};

// circumvent Wallpaper Engine keyboard/mouse input restrictions
let movePr0PlateRegion = {x: 0, y: 0, h: 0, w: 0};
let mouseInsideMovePr0PlateRegion = false;
let movingPr0Plate = false;

let mousePos = {x, y};
// if set > 0  pr0-sign will no longer spawn peepos when user moves mouse to the edge of the canvas while holding center mouseButton
const borderThreshold = 0;

//#region non-p5 functions
function pickColor() {
  hue = random(0, 360);
}

function getRandomSign(){
  return Math.random() < 0.5 ? -1 : 1;
}

function getRandomInt(max){
  return Math.floor(Math.random() * Math.floor(max));
}

function randomDbPos(){
  dbPos.x = random(0, windowWidth - db.width);
  dbPos.y = random(0, windowHeight - db.height);
}

function onWallHit(){
  pickColor();
  randomDbPos();
  gifIndex++;
}

function startResetPeepoTimer(){
  if(resetPeepoTimer !== null || resetPeepoTimerIsRunning === true) return;
  resetPeepoCountdown = resetPeepoCountdownStart;
  resetPeepoTimerIsRunning = true;
  resetPeepoTimer = setInterval(resetPeepoTick, 1000);
}

function resetPeepoTick(){
  if(resetPeepoCountdown > 0){
    resetPeepoCountdown--;
    if(resetPeepoCountdown <= 5){
      monkaS.show();
    }
  }
  else{
    clearInterval(resetPeepoTimer);
    resetPeepoTimer = null;
    sadge.show();
  }
}

function stopResetPeepoTimer(){
  clearInterval(resetPeepoTimer);
  resetPeepoTimer = null;
}

function getScaledImgDimensions(img, relativeHeight, scaledParent){
  let aspectRatio = 0;
  if (img.width >= img.height){
    aspectRatio = img.height / img.width;
  }
  else{
    aspectRatio = img.width / img.height;
  }
  let h = relativeHeight * scaledParent.h;
  let w = h / aspectRatio;
  let relativeWidth = w / scaledParent.w;
  if(relativeWidth > 0.28){
    w = 0.28 * scaledParent.w;
  }
  return {w, h};
}

function mouseInRegion(mouse, region){
  if(mouse.x > 0 & mouse.y > 0 & mouse.x < width & mouse.y < height){
    if(mouse.x > region.x & mouse.x < (region.x + region.w)){
      if(mouse.y > region.y & mouse.y < (region.y + region.h)){
        return true;
      }
    }
  }
  return false;
}
//#endregion

function preload() {
  monkaS = createImg('assets/gifs/monkaS.gif', 'sadge :(', 'anonymous', img => {
    img.size(30, 30);
    img.position(width - 200 , 15);
    img.hide();
  });

  sadge = createImg('assets/gifs/sadge.gif', 'sadge :(', 'anonymous', img => {
    img.size(45, 45);
    img.position(width - 70, 15);
    img.hide();
  });

  ricardo = createImg('assets/gifs/ricardo.gif', 'sadge :(', 'anonymous', img => {
    img.size(30, 30);
    img.position(width - 150, 150);
    img.hide();
  });

  db = createImg('assets/db.png', 'sadge :(', 'anonymous', img => {
    img.size(img.width * dbScale, img.height * dbScale);
    randomDbPos();
    img.position(dbPos.x, dbPos.y);
  });

  merryXmas = createImg('assets/gifs/merryXmas.gif', 'sadge :(', 'anonymous', img => {
    img.position(width / 2 - img.width / 2, height /2 - img.height / 2)
  });

  pr0Plate = createImg('assets/Pr0gramm_Logo_transp.png', 'sadge :(', 'anonymous', img => {
    img.size(scaledPlate.w , scaledPlate.h);
  });

  snowFlakeTexture = createImg('assets/pr0badges/snowflake.png', 'sadge :(', 'anonymous').hide();
  wichtelTexture = createImg('assets/pr0badges/wichtel.png', 'sadge :(', 'anonymous').hide();
  for(let i = 1; i <= badgeFileCount; i++){
    badgeTextures.push(createImg('assets/pr0badges/' + i.toString() + ".png", 'sadge :(', 'anonymous').hide());
  }
  
  for(let i = 1; i <= pepeGifCount; i++){
    gifs.push(createImg('assets/gifs/' + i.toString() + ".gif", 'sadge :(', 'anonymous', gif => {
      gif.hide();
      let { w, h } = getScaledImgDimensions(gif, relativeGif.h, scaledPlate);
      gif.size(w, h);
    }));
  }
  lights = createImg('assets/gifs/pr0Lights_pattern_Full.gif', 'sadge :(', 'anonymous', img => {
    img.size(scaledPlate.w, scaledPlate.h);
  });
}


function setup() {
  cnv = createCanvas(windowWidth, windowHeight);

  frameRate(60);
  textFont('Helvetica');
  colorMode(HSL, 360, 100, 100)
  pickColor();
  clr = color(hue, 70, 50);

  // set reset peepo region
  rectWidth= 150;
  resetRegion = {x: width-rectWidth, y: 0, h: 150, w: rectWidth};

  // set moving pr0 sign region
  movePr0PlateRegion = {x: 0, y: 0, h:25, w: 25};

  // initialize pr0-sign position and direction
  x = random(0, width - scaledPlate.w - 30);
  y = random(0, height - scaledPlate.h - 30);
  xspeed = speed * getRandomSign();
  yspeed = speed * getRandomSign();

  // initialize snow
  gravity = createVector(0, 0.2);
  for (let i = 0; i < snowFlakesOnScreenCount; i++) {
    let x = random(width);
    let y = random(height);
    snow.push(new Snowflake(x, y, snowFlakeTexture));
  }
  for (let i = 0; i < wichtelOnScreenCount; i++) {
    let x = random(width);
    let y = random(height);
    wichtel.push(new Snowflake(x, y, wichtelTexture));
  }
  for (let i = 0; i < badgesOnScreenCount; i++) {
    let x = random(width);
    let y = random(height);
    badges.push(new Snowflake(x, y, random(badgeTextures)));
  }
  // randomize which pepe to begin with
  gifIndex = getRandomInt(pepeGifCount-1);
}

function draw() {
  background(richtigesGrau);
  fill(40);
  // display framerate
  // text(int(getFrameRate()), width - 20, 15); 

  mousePos.x = mouseX;
  mousePos.y = mouseY;
  mouseInsideResetPeepoRegion = mouseInRegion(mousePos, resetRegion);
  mouseInsideMovePr0PlateRegion = mouseInRegion(mousePos, movePr0PlateRegion);
  if(mouseInsideMovePr0PlateRegion === true){
    movingPr0Plate = true;
  }

  // handle reset peepos since wallpaper engine does not allow keyboard input...
  if(mouseIsPressed & mouseButton === LEFT){
    if(mouseInsideResetPeepoRegion){
      startResetPeepoTimer();
    }
    if(resetPeepoTimerIsRunning){
      text(`Reset peepos in     ${resetPeepoCountdown}`, width - 160, 35 );
    }
  }
  else{
    stopResetPeepoTimer();
    // reset peepos (ಥ﹏ಥ)
    if(resetPeepoTimerIsRunning & resetPeepoCountdown <= 0){
      for(let i = 0; i < pepeGifCount; i++){
        if(i !== gifIndex){
          gifs[i].hide();
        }
      }
    }
    resetPeepoTimerIsRunning = false;
    monkaS.hide();
    sadge.hide();
  }
  
  if (hue > 360) {
    hue = 0;
  }

  if(gifIndex >= pepeGifCount){
    gifIndex = 0;
  }

   // handle if mouse gets too close to db
   // TODO: use timer instead of counting frames...
  let dbMouseDist = sqrt(pow((dbPos.x - mousePos.x),2) + pow((dbPos.y - mousePos.y), 2))
  if(dbMouseDist < db.elt.height + 12){
    tempdbPos.x = dbPos.x;
    tempdbPos.y = dbPos.y;
    ricardoNope = 210;
    randomDbPos();
  }
  if(ricardoNope > 0){
    ricardo.position(tempdbPos.x, tempdbPos.y);
    ricardo.show();
    ricardoNope--;
  }
  else{
    ricardo.hide();
  }

  // handle user moving pr0-sign with boundary checks
  // (movingPr0Plate & !mouseIsPressed) <- implemented because of Wallpaper Engine restrictions to mouse input (does not allow to bubble up mouseButton)
  if((mouseIsPressed & mouseButton === RIGHT) || (movingPr0Plate & !mouseIsPressed)){
    if(mousePos.x > width - scaledPlate.w/2 - borderThreshold){
      x = width - scaledPlate.w - borderThreshold;
    }
    else if (mousePos.x < scaledPlate.w/2 + borderThreshold){
      x = borderThreshold;
    }
    else{
      x = mousePos.x - scaledPlate.w/2;
    }
    if(mousePos.y > height - scaledPlate.h/2 - borderThreshold){
      y = height - scaledPlate.h - borderThreshold;
    }
    else if (mousePos.y < scaledPlate.h/2 + borderThreshold){
      y = borderThreshold;
    }
    else{
      y = mousePos.y - scaledPlate.h/2;
    }
    xspeed = speed * getRandomSign();
    yspeed = speed * getRandomSign();
  }
  else if(movingPr0Plate & mouseIsPressed){
    movingPr0Plate = false;
  }

  // move bouncing objects
  db.position(dbPos.x, dbPos.y);
  pr0Plate.position(x,y);
  gifs[gifIndex].show();
  gifs[gifIndex].position(x + relativeGif.x * pr0Plate.width, y + relativeGif.y * pr0Plate.height - gifs[gifIndex].elt.height);
  lights.position(x, y);

  hue += 1;
  clr = color(hue, 70, 50);

  // update position of pr0-sign
  x = x + xspeed;
  y = y + yspeed;
  // wall collision checks
  if (x + lights.width >= width) {
    xspeed = -xspeed;
    x = width - lights.width;
    onWallHit();
  } else if (x <= 0) {
    xspeed = -xspeed;
    x = 0;
    onWallHit();
  }
  if (y + lights.height >= height) {
    yspeed = -yspeed;
    y = height -  lights.height;
    onWallHit();
  } else if (y <= 0) {
    yspeed = -yspeed;
    y = 0;
    onWallHit();
  }

  // snow
  for (flake of snow) {
    flake.applyForce(gravity);
    flake.update();
    flake.render();
  }

  for (badge of badges) {

    if(mouseIsPressed & !mouseInsideResetPeepoRegion){
      if(mouseButton === LEFT){
        // let mouseForce = createVector(mousePos.x - badge.pos.x, mousePos.y - badge.pos.y);
        let mouseForce = createVector(mousePos.x - badge.pos.x, mousePos.y - badge.pos.y);
        badge.applyForce(mouseForce, mousePos);
      }
    }
    else{
      badge.applyForce(gravity);
    }
    badge.update(mouseIsPressed, mouseButton, mousePos, random(badgeTextures));
    badge.render();
  }

  for (box of wichtel) {

    if(mouseIsPressed & !mouseInsideResetPeepoRegion){
      if(mouseButton === LEFT){
        // let mouseForce = createVector(mousePos.x - box.pos.x, mousePos.y - box.pos.y);
        let mouseForce = createVector(mousePos.x - box.pos.x, mousePos.y - box.pos.y);
        box.applyForce(mouseForce,);
      }
    }
    else{
      box.applyForce(gravity);
    }
    box.update(mouseIsPressed, mouseButton, mousePos);
    box.render();
  }
}
