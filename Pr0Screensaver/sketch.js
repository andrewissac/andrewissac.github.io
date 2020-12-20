let x;
let y;

let xspeed;
let yspeed;

let lights;
let bbox;

let pepe;
let gifs = [];
let r, g, b;

let relativeGifHeight = 0.28;
let relativeGifPosX = 0.53;
let relativeGifPosY = 0.64;

let pr0plateHeight = 2000;
let pr0plateWidth = 2000;

let scaleFac = 0.15;

let scaledParentHeight = pr0plateHeight * scaleFac;
let scaledParentWidth = pr0plateWidth * scaleFac;
const speed = 2;

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
  gif.size(h, w);
  gifs.push(new Gif(gif, h, w));
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
  return { h, w };
}

function preload() {
  merryXmas = loadImage('assets/gifs/merryXmas.gif');
  pr0Plate = loadImage('assets/onlypr0LogoPlate.png');
  
  for(let i = 1; i <= 20; i++){
    createImg('assets/gifs/' + i.toString() + ".gif", "", "", addScaledGifAndHide);
  }
  lights = createImg('assets/pr0Lights_pattern_full.gif');
  
  for(let i = 1; i <= 20; i++){
    gifs[i].img.hide();
  }
}


function setup() {
  createCanvas(windowWidth, windowHeight);
    
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

var i = 0;

function draw() {
  background('#161618');
  if (h > 360) {
    h = 0;
  }

  if(i > 20){
    i = 0;
  }


  image(merryXmas, 500,200);
  tint(h, 70, 50);
  image(pr0Plate,x,y);
  noTint();
  gifs[i].img.show();
  gifs[i].img.position(x + relativeGifPosX * pr0Plate.width, y + relativeGifPosY * pr0Plate.height - gifs[i].h);

  lights.position(x, y);
  h += 1;
  fill(h, 100, 70);
  // image  lights, x, y);
  x = x + xspeed;
  y = y + yspeed;

  if (x + lights.width >= width) {
    xspeed = -xspeed;
    x = width - lights.width;
    pickColor();
    //gifs[i].img.hide();
    i++;
  } else if (x <= 0) {
    xspeed = -xspeed;
    x = 0;
    pickColor();
    //gifs[i].img.hide();
    i++;
  }

  if (y + lights.height >= height) {
    yspeed = -yspeed;
    y = height -  lights.height;
    pickColor();
    //gifs[i].img.hide();
    i++;
  } else if (y <= 0) {
    yspeed = -yspeed;
    y = 0;
    pickColor();
    //gifs[i].img.hide();
    i++;
  }
}