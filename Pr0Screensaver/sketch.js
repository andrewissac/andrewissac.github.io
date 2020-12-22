let x;
let y;

let xspeed;
let yspeed;

let hue;
let clr;

let gifs = [];

const relativeGifHeight = 0.28;
const relativeGifPosX = 0.53;
const relativeGifPosY = 0.64;

const pr0plateHeight = 2000; // hardcoded, sucks but fuck p5 async loading mess
const pr0plateWidth = 2000;

const scaleFac = 0.125;
const scaledParentHeight = Math.floor(pr0plateHeight * scaleFac);
const scaledParentWidth = Math.floor(pr0plateWidth * scaleFac);

const plateAlpha = 1.0;
let richtigesGrau = "#161618"
let colorRotation = ["#ee4d2e", "#1db992", "#bfbc06", "#008fff", "#ff0082",]

let merryXmasPosX;
let merryXmasPosY;
let dbPosX;
let dbPosY;
let tempdbPosX;
let tempdbPosY;
const dbScale = 0.015;

let snow = [];
let wichtel = [];
let badges = [];
let gravity;
let zOff = 0;

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
let resetPeepoTimer = null;
let resetPeepoTimerIsRunning = false;
const resetPeepoCountdownStart = 10;
let resetPeepoCountdown;

function getScaledImgDimensions(img, relativeHeight, scaledParentHeight_){
  let aspectRatio = 0;
  if (img.width >= img.height){
    aspectRatio = img.height / img.width;
  }
  else{
    aspectRatio = img.width / img.height;
  }
  let h = relativeHeight * scaledParentHeight_;
  let w = h / aspectRatio;
  let relativeWidth = w / scaledParentWidth;
  if(relativeWidth > 0.28){
    w = 0.28 * scaledParentWidth;
  }
  return { w, h };
}

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
    img.position(dbPosX, dbPosY);
  });

  merryXmas = createImg('assets/gifs/merryXmas.gif', 'sadge :(', 'anonymous', img => {
    img.position(width / 2 - img.width / 2, height /2 - img.height / 2)
  });

  pr0Plate = createImg('assets/Pr0gramm_Logo_transp.png', 'sadge :(', 'anonymous', img => {
    img.size(scaledParentWidth , scaledParentHeight);
  });

  snowFlakeTexture = createImg('assets/pr0badges/snowflake.png', 'sadge :(', 'anonymous').hide();
  wichtelTexture = createImg('assets/pr0badges/wichtel.png', 'sadge :(', 'anonymous').hide();
  for(let i = 1; i <= badgeFileCount; i++){
    badgeTextures.push(createImg('assets/pr0badges/' + i.toString() + ".png", 'sadge :(', 'anonymous').hide());
  }
  
  for(let i = 1; i <= pepeGifCount; i++){
    gifs.push(createImg('assets/gifs/' + i.toString() + ".gif", 'sadge :(', 'anonymous', gif => {
      gif.hide();
      let { w, h } = getScaledImgDimensions(gif, relativeGifHeight, scaledParentHeight);
      gif.size(w, h);
    }));
  }
  lights = createImg('assets/gifs/pr0Lights_pattern_Full.gif', 'sadge :(', 'anonymous', img => {
    img.size(scaledParentWidth, scaledParentHeight);
  });
}


function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(60);

  textFont('Helvetica');

  colorMode(HSL, 360, 100, 100)
  pickColor();
  clr = color(hue, 70, 50);

  x = random(0, width - scaledParentWidth - 30);
  y = random(0, height - scaledParentHeight - 30);
  xspeed = speed * getRandomSign();
  yspeed = speed * getRandomSign();

  // initialize snow
  gravity = createVector(0, 0.3);
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
  // randomize 
  gifIndex = getRandomInt(pepeGifCount-1);
}

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
  dbPosX = random(0, windowWidth - db.width);
  dbPosY = random(0, windowHeight - db.height);
}

function onWallHit(){
  pickColor();
  randomDbPos();
  gifIndex++;
}

function doubleClicked(){
  x = mouseX > width - scaledParentWidth ? width - scaledParentWidth - 5 : mouseX;
  y = mouseY > height - scaledParentHeight ? height - scaledParentHeight -5 : mouseY;
  xspeed = speed * getRandomSign();
  yspeed = speed * getRandomSign();
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

function startresetPeepoTimer(){
  if(resetPeepoTimer !== null) return;
  resetPeepoCountdown = resetPeepoCountdownStart;
  resetPeepoTimerIsRunning = true;
  resetPeepoTimer = setInterval(resetPeepoTick, 1000);
}


function mousePressed(event){
  if(event.ctrlKey){
    startresetPeepoTimer();
  }
}

function mouseReleased(event){
  if(event.ctrlKey){
    if(resetPeepoCountdown <= 0){
      // reset peepos (ಥ﹏ಥ)
      for(let i = 0; i < pepeGifCount; i++){
        if(i !== gifIndex){
          gifs[i].hide();
        }
      }
    }
  }
  resetPeepoTimerIsRunning = false;
  monkaS.hide();
  sadge.hide();
}

let nope = 0;

function draw() {
  background(richtigesGrau);

  fill(40);
  text(int(getFrameRate()), width - 20, 15); 
  if(resetPeepoTimerIsRunning){
    text(`Reset peepos in     ${resetPeepoCountdown}`, width - 160, 35 );
  }
  
  if (hue > 360) {
    hue = 0;
  }

  if(gifIndex >= pepeGifCount){
    gifIndex = 0;
  }

  let dbMouseDist = sqrt(pow((dbPosX - mouseX),2) + pow((dbPosY - mouseY), 2))
  if(dbMouseDist < db.elt.height + 12){
    tempdbPosX = dbPosX;
    tempdbPosY = dbPosY;
    nope = 210;
    randomDbPos();
  }
  if(nope > 0){
    ricardo.position(tempdbPosX, tempdbPosY);
    ricardo.show();
    nope--;
  }
  else{
    ricardo.hide();
  }

  db.position(dbPosX, dbPosY);
  merryXmas.position(merryXmas.position.x, merryXmas.position.y);
  pr0Plate.position(x,y);
  gifs[gifIndex].show();
  gifs[gifIndex].position(x + relativeGifPosX * pr0Plate.width, y + relativeGifPosY * pr0Plate.height - gifs[gifIndex].elt.height);
  lights.position(x, y);

  hue += 1;
  clr = color(hue, 70, 50);

  x = x + xspeed;
  y = y + yspeed;
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
  zOff += 0.1;
  mouseVec = createVector(mouseX - width/2, mouseY - height/2).normalize();
  mouseVec.x = mouseVec.x * 0.2;
  mouseVec.y = mouseVec.y * 0.2;

  for (flake of snow) {
    let xOff = flake.pos.x / width;
    let yOff = flake.pos.y / height;
    let wAngle = noise(xOff, yOff, zOff) * TWO_PI;
    let wind = p5.Vector.fromAngle(wAngle);
    wind.mult(0.1);

    flake.applyForce(gravity);
    //flake.applyForce(wind);
    flake.update();
    flake.render();
  }

  for (badge of badges) {
    let xOff = badge.pos.x / width;
    let yOff = badge.pos.y / height;
    let wAngle = noise(xOff, yOff, zOff) * TWO_PI;
    let wind = p5.Vector.fromAngle(wAngle);
    wind.mult(0.1);

    badge.applyForce(gravity);
    badge.applyForce(wind);
    if(mouseIsPressed){
      let mouseForce = createVector(mouseX - badge.pos.x, mouseY - badge.pos.y).normalize()
      mouseForce.mult(0.4);
      badge.applyForce(mouseForce);
    }
    badge.update(random(badgeTextures));
    badge.render();
  }

  for (box of wichtel) {
    let xOff = box.pos.x / width;
    let yOff = box.pos.y / height;
    let wAngle = noise(xOff, yOff, zOff) * TWO_PI;
    let wind = p5.Vector.fromAngle(wAngle);
    wind.mult(0.1);

    box.applyForce(gravity);
    box.applyForce(wind);
    if(mouseIsPressed){
      let mouseForce = createVector(mouseX - box.pos.x, mouseY - box.pos.y).normalize()
      mouseForce.x = mouseForce.x * 0.4;
      mouseForce.y = mouseForce.y * 0.4;
      box.applyForce(mouseForce);
    }
    box.update();
    box.render();
  }
}
