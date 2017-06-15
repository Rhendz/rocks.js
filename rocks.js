/* --------------------------
/* Author : Ankush Patel
/* Github : github.com/rhendz
/* ------------------------*/

// Parameters for programming the rocks

var rparams = {
    number: 10,

    color: ["#4f5b66"], // Type in hex values

    size: {
        min: 20,
        max: 30
    },

    speed: {
        x: 5,
        y: 0
    },

    acc: 0.1,

    bounce: 0.95,

    friction: 0.8


}

var rJS; // rock canvas
var c; // context for rJS

// Container for Rock Objects
var rArr;

// Restrictions for spawn zones
var leftZone;
var rightZone;
var topZone;
var bottomZone;

function init() {
    rJS = document.querySelector('#rocks-js');
    c = rJS.getContext('2d');
    rArr = [];

    rJS.width = window.innerWidth;
    rJS.height = window.innerHeight;

    leftZone = -rparams.size.max;
    rightZone = rparams.size.max + window.innerWidth;
    topZone = window.innerHeight * 3 / 4;
    bottomZone = window.innerHeight * 1 / 4;
    window.addEventListener('resize', function() { resizeCanvas(); });

    // Initialize rArr
    createRock(); // The first rock

    for (var i = 0; i < rparams.number - 1; i++) {
        setTimeout(function() {
            createRock();
        }, Math.random() * 60000 + 1000);
    }
}

function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, innerWidth, innerHeight);
    var destroyIndexArr = -1; // For spawned rocks
    var destroyIndexSpriteArr = -1; // For sprites that come off rocks

    for (var i = 0; i < rArr.length; i++) {
        rArr[i].update();
        if (Math.abs(rArr[i].getDX()) <= 0.001 && Math.abs(rArr[i].getDY()) <= 0.001) {
            destroyIndexArr = i;
        }
    }

    for (var i = 0; i < rSpritesArr.length; i++) {
        rSpritesArr[i].update();
        if (Math.abs(rSpritesArr[i].getDX()) <= 0.001 && Math.abs(rSpritesArr[i].getDY()) <= 0.001) {
            destroyIndexSpriteArr = i;
        }
    }

    if (destroyIndexArr != -1) {
        rArr.splice(destroyIndexArr, 1);
        createRock();
    }

    if (destroyIndexSpriteArr != -1) {
        rSpritesArr.splice(destroyIndexSpriteArr, 1);
    }
}

function createRock() {
    // Random values for Rock
    var parity = Math.floor(Math.random() * 2);
    var x, y, r, dx, dy, color;
    parity == 0 ? x = leftZone : x = rightZone;
    y = Math.floor(Math.random() * (topZone - bottomZone + 1)) + bottomZone;
    r = Math.floor(Math.random() *  (rparams.size.max - rparams.size.min + 1)) + rparams.size.min;
    parity == 0 ? dx = rparams.speed.x : dx =  rparams.speed.x;
    dy = rparams.speed.y;
    color = randColor();

    rArr.push(new Rock(x, y, r, dx, dy, parity, color));
}

function resizeCanvas() {
    rJS.width = window.innerWidth;
    rJS.height = window.innerHeight;
    // Left side remains the same
    rightZone = rparams.size.max * 2 + window.innerWidth;
    topZone = window.innerHeight * 3 / 4;
    bottomZone = window.innerHeight * 1 / 4;
}

function randColor() {
    var rand = Math.floor(Math.random() * rparams.color.length);
    return rparams.color[rand];
}

// This creates the rock

// For offshoot sprites
var rSpritesArr = [];

function Rock(x, y, r, dx, dy, p, color) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.dx = dx;
    this.dy = dy;
    this.p = p; // p is for parity - determines spawn zone
    this.color = color; // c is for the fill color

    this.gravitySpeed = 0;

    this.draw = function() {
        c.beginPath();
        c.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
        c.fillStyle = this.color;
        c.fill();
    }

    this.update = function() {

        this.gravitySpeed -= rparams.acc;

        if (this.isIn() && (this.isLeft() || this.isRight())) {
            this.hit();
            this.dx = -this.dx;
        }

        this.x += this.dx;

        this.y += (this.dy - this.gravitySpeed);

        this.hitBottom();
        // Returns call to draw so that position is updated
        this.draw();
    }

    this.hitBottom = function() {
        var bot = rJS.height - this.r;
        if (this.y > bot) {
            this.y = bot;
            this.dx *= rparams.friction;
            this.gravitySpeed = -(this.gravitySpeed * rparams.bounce);
            this.hit();
        }
    }

    this.hit = function() {
        // Sprites that bounce off main drop
        if (this.r > 6) {
            if (this.r > 10) this.r -= Math.floor(Math.random()*10)+1;
            this.r--;

            // Parameters for new sprite

            for (var i = 0; i < 5; i++) {
                var nx = this.x + ((Math.random() * (2 * this.r)) + this.r)*((Math.random() < 0.5 ? -1 : 1));
                var ny = this.y + ((Math.random() * (2 * this.r)) + this.r)*((Math.random() < 0.5 ? -1 : 1));
                var nr = 3;
                var ndx = (Math.random() * 5 + 3) * (Math.random() - 0.5);
                var ndy = 0;

                var ncolor = randColor();
                rSpritesArr.push(new Rock(nx, ny, nr, ndx, ndy, 0, ncolor));
            }
        }
    }

    this.isIn = function() {
        return (this.x + this.r < rightZone && this.x - this.r > leftZone);
    }

    this.isLeft = function() {
        return (this.x - this.r <= 0 && this.dx < 0);
    }

    this.isRight = function() {
        return (this.x + this.r >= window.innerWidth && this.dx > 0);
    }

    this.getDX = function() {
        return this.dx;
    }

    this.getDY = function() {
        return this.dy;
    }

    this.toString = function() {
        console.log("x: " + this.x + " y: " + this.y + " r: " + this.r + " dx: " + this.dx + " dy: " + this.dy);
    }
}

init();
animate();
