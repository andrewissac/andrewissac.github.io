let x;
let y;

let xspeed;
let yspeed;

let gifs = [];

let relativeGifHeight = 0.28;
let relativeGifPosX = 0.53;
let relativeGifPosY = 0.64;

let pr0plateHeight = 2000;
let pr0plateWidth = 2000;

let scaleFac = 0.125;
let scaledParentHeight = Math.floor(pr0plateHeight * scaleFac);
let scaledParentWidth = Math.floor(pr0plateWidth * scaleFac);

let plateAlpha = 1.0;
let richtigesGrau = "#161618"
let colorRotation = ["#ee4d2e", "#1db992", "#bfbc06", "#008fff", "#ff0082",]

let merryXmasPosX;
let merryXmasPosY;
let dbPosX;
let dbPosY;
let dbScale = 0.02;

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
  
  for(let i = 1; i <= 20; i++){
    createImg('assets/gifs/' + i.toString() + ".gif", "", "", addScaledGifAndHide);
  }
  lights = createImg('assets/gifs/pr0Lights_pattern_Full.gif');
  
  for(let i = 1; i <= 20; i++){
    gifs[i].img.hide();
  }
}


function setup() {
  createCanvas(windowWidth, windowHeight);

  db.height = db.height * dbScale;
  db.width = db.width * dbScale;
  dbPosX = random(0, windowWidth - db.width);
  dbPosY = random(0, windowHeight - db.height);
  console.log()

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

  if(gifIndex >= 20){
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
}
