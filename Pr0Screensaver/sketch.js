let x;
let y;

let xspeed;
let yspeed;

let gifs = [];

const relativeGifHeight = 0.28;
const relativeGifPosX = 0.53;
const relativeGifPosY = 0.64;

const pr0plateHeight = 2000;
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
const dbScale = 0.02;

let snow = [];
let wichtel = [];
let badges = [];
let gravity;

let zOff = 0;

const pepeGifCount = 46;
const badgeFileCount = 32;
const snowFlakesOnScreenCount = 113;
const badgesOnScreenCount = 32;
const wichtelOnScreenCount = 12;
let snowFlakeTexture;
let badgeTextures = [];
let wichtelTexture;

// speed of the moving pr0 logo
const speed = 4;

class Gif{
  constructor(img, w, h){
    this.img = img;
    this.w = w;
    this.h = h;
    this.aspectRatio = h / w;
  }
}

function addScaledGifAndHide(gif){
  gif.hide();
  let { h, w } = getScaledImgDimensions(gif, relativeGifHeight, scaledParentHeight);
  gif.size(w, h);
  gifs.push(new Gif(gif, w, h));
}

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
  return { h, w };
}

function preload() {
  merryXmas = loadImage('assets/gifs/merryXmas.gif');
  pr0Plate = loadImage('assets/onlypr0LogoPlate.png');
  db = loadImage('assets/db.png');

  snowFlakeTexture = loadImage('assets/pr0badges/snowflake.png');
  wichtelTexture = loadImage('assets/pr0badges/wichtel.png');
  for(let i = 1; i <= badgeFileCount; i++){
    badgeTextures.push(loadImage('assets/pr0badges/' + i.toString() + ".png"));
  }
  
  for(let i = 1; i <= pepeGifCount; i++){
    createImg('assets/gifs/' + i.toString() + ".gif", "", "", addScaledGifAndHide);
  }
  lights = createImg('assets/gifs/pr0Lights_pattern_Full.gif');
  
  for(let i = 1; i <= pepeGifCount; i++){
    gifs[i].img.hide();
  }
}


function setup() {
  createCanvas(windowWidth, windowHeight);

  db.height = db.height * dbScale;
  db.width = db.width * dbScale;
  dbPosX = random(0, windowWidth - db.width);
  dbPosY = random(0, windowHeight - db.height);

  merryXmasPosX = Math.floor(windowWidth / 2 - merryXmas.width / 2);
  merryXmasPosY =  Math.floor(windowHeight /2 - merryXmas.height / 2);
    
  pr0Plate.height = scaledParentHeight;
  pr0Plate.width = scaledParentWidth;
  lights.size(pr0Plate.width, pr0Plate.height);

  colorMode(HSL, 360, 100, 100)
  pickColor();

  x = random(0, width - lights.width);
  y = random(0, height -  lights.height);
  xspeed = speed;
  yspeed = speed;

  // snow
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
}

function pickColor() {
  h = random(0, 360);
}

function getRandomInt(max){
  return Math.floor(Math.random() * Math.floor(max));
}

let gifIndex = getRandomInt(4);

function OnWallHit(){
  //gifs[gifIndex].img.hide();
  pickColor();
  dbPosX = random(0, windowWidth - db.width);
  dbPosY = random(0, windowHeight - db.height);
  gifIndex++;
}

function draw() {
  background(richtigesGrau);

  if (h > 360) {
    h = 0;
  }

  if(gifIndex >= pepeGifCount){
    gifIndex = 0;
  }

  image(db, dbPosX, dbPosY);
  image(merryXmas, merryXmasPosX, merryXmasPosY);
  tint(h, 70, 50, plateAlpha);
  image(pr0Plate,x,y);
  noTint();
  gifs[gifIndex].img.show();
  gifs[gifIndex].img.position(x + relativeGifPosX * pr0Plate.width, y + relativeGifPosY * pr0Plate.height - gifs[gifIndex].h);

  lights.position(x, y);
  h += 1;
  x = x + xspeed;
  y = y + yspeed;

  if (x + lights.width >= width) {
    xspeed = -xspeed;
    x = width - lights.width;
    OnWallHit();
  } else if (x <= 0) {
    xspeed = -xspeed;
    x = 0;
    OnWallHit();
  }

  if (y + lights.height >= height) {
    yspeed = -yspeed;
    y = height -  lights.height;
    OnWallHit();
  } else if (y <= 0) {
    yspeed = -yspeed;
    y = 0;
    OnWallHit();
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
    flake.applyForce(wind);
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
      mouseForce.x = mouseForce.x * 0.4;
      mouseForce.y = mouseForce.y * 0.4;
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
