function getRandomSize() {
    let r = pow(random(0, 1), 2);
    return constrain(r * Snowflake.maxSize, Snowflake.minSize, Snowflake.maxSize);
}
  
class Snowflake {
    static minVel = 0.2;
    static maxVel = 1.6;
    static minSize = 2;
    static maxSize = 32;
    static mouseFollowSpeedFac = 0.00033;
    constructor(sx, sy, img) {
        let x = sx || random(width);
        let y = sy || random(-100, -10);
        this.img = img;
        this.pos = createVector(x, y);
        this.lastMousePos = createVector(x, y);
        this.vel = createVector(0, 0);
        this.acc = createVector();
        this.angle = random(TWO_PI);
        this.perlinYangle = random(TWO_PI);
        this.dir = random(1) > 0.5 ? 1 : -1;
        this.xOff = 0;
        this.yOff = 0;
        this.r = getRandomSize();
    }

    applyForce(force) {
        // Parallax Effect, far away particles move slower
        let f = force.copy();
        f.mult(this.r);

        this.acc.add(f);
    }

    randomizeState() {
        let x = random(width);
        let y = random(-100, -10);
        this.pos = createVector(x, y);
        this.lastMousePos = createVector(x, y);
        this.vel = createVector(0, 0);
        this.acc = createVector();
        this.r = getRandomSize();
    }

    update(mouseIsPressed, mouseButton = null, mousePos = null, mouseInsideResetPeepoRegion = false, newImg = null) {
        this.xOff = sin(this.angle * 2) * 2 * this.r;
        this.yOff = sin(this.perlinYangle * 2) * 2 * 15;

        this.vel.add(this.acc);
        this.vel.limit(this.r * 0.06);

        // prevent very small snowflakes standing still
        if (this.vel.mag() < Snowflake.minVel) {
            this.vel.normalize().mult(Snowflake.minVel);
        }
        // avoid large snowfalkes moving too fast.
        else if(this.vel.mag() >Snowflake.maxVel){
            this.vel.normalize().mult(Snowflake.maxVel);
        }

        this.pos.add(this.vel);
        this.acc.mult(0);

        if (this.pos.y > height + this.r) {
            this.randomizeState();
            if(newImg !== null){
                this.img = newImg;
            }
        }

        // Wrapping Left and Right
        if (this.pos.x < -this.r) {
            this.pos.x = width + this.r;
        }
        if (this.pos.x > width + this.r) {
            this.pos.x = -this.r;
        }

        this.angle += (this.dir * this.vel.mag()) / 200;

        if(mouseIsPressed){
            this.perlinYangle += (this.dir * this.vel.mag()) / 200;
            // simulate drag to the mouse once the particles get nearer to the mouse
            // it just works™
            if(mousePos !== null & mouseButton === LEFT){
                this.lastMousePos.x += (mousePos.x - this.lastMousePos.x) * Snowflake.mouseFollowSpeedFac * this.r;
                this.lastMousePos.y += (mousePos.y - this.lastMousePos.y) * Snowflake.mouseFollowSpeedFac * this.r;
                this.pos.x = this.lastMousePos.x;
                this.pos.y = this.lastMousePos.y;
            }
        }
        else{
            this.lastMousePos.x = this.pos.x;
            this.lastMousePos.y = this.pos.y;
        }
    }

    render() {
        push();
        translate(this.pos.x + this.xOff, this.pos.y + this.yOff);
        rotate(this.angle);
        imageMode(CENTER);
        image(this.img, 0, 0, this.r, this.r);
        pop();
    }
}