// SHAPES
// Write a program that draws the following shapes on a canvas:
// A trapezoid (a rectangle that is wider on one side)
// A red diamond (a rectangle rotated 45 degrees or ¼π radians)
// A zigzagging line
// A spiral made up of 100 straight line segments
// A yellow star

// When drawing the last two, you may want to refer to the explanation of
// Math.cos and Math.sin in Chapter 14, which describes how to get coordinates
// on a circle using these functions.

// I recommend creating a function for each shape. Pass the position, and
// optionally other properties such as the size or the number of points, as
// parameters. The alternative, which is to hard-code numbers all over your
// code, tends to make the code needlessly hard to read and modify.


// Trapezoid
function trapezoid(center) {
    let cx = document.querySelector("canvas").getContext("2d");
    cx.beginPath();
    cx.moveTo(center.x - 20, center.y - 20);
    cx.lineTo(center.x + 20, center.y - 20);
    cx.lineTo(center.x + 40, center.y + 20);
    cx.lineTo(center.x - 40, center.y + 20);
    cx.closePath();
    cx.stroke();
}

// Red Diamond
function redDiamond(center) {
    let cx = document.querySelector("canvas").getContext("2d");
    cx.beginPath();
    cx.moveTo(center.x, center.y - 25);
    cx.lineTo(center.x + 25, center.y);
    cx.lineTo(center.x, center.y + 25);
    cx.lineTo(center.x - 25, center.y);
    cx.closepath();
    cx.fillStyle = "red";
    cx.fill();
}

// Zigzag
zigzag({ x: 10, y: 10 });

function zigzag(start) {
    let cx = document.querySelector("canvas").getContext("2d");
    cx.moveTo(start.x, start.y);
    let current = start;

    for (let i = 0; i < 12; i++) {
        if (i % 2 === 0) {
            cx.lineTo(current.x = current.x + 80, current.y = current.y + 6);
        } else {
            cx.lineTo(current.x = current.x - 80, current.y = current.y + 6);
        }
    }

    cx.stroke();
}

// Spiral
spiral({ x: 200, y: 100 });

function spiral(start) {
    cx.beginPath();
    cx.moveTo(start.x, start.y);
    diff = 0;
    for (let i = 0; i <= 8 * Math.PI; i += 0.05) {
        diff += 0.1;
        cx.lineTo(Math.cos(i) * diff + start.x, Math.sin(i) * diff + start.y);
    }
    cx.stroke();
}

// Yellow star
yellowStar({ x: 50, y: 50 }, 50);

function yellowStar(center, radius) {
    let point1 = { x: Math.cos(0) * radius + center.x, y: Math.sin(0) * radius + center.y };
    let point2 = { x: Math.cos((1 / 4) * Math.PI) * radius + center.x, y: Math.sin((1 / 4) * Math.PI) * radius + center.y };
    let point3 = { x: Math.cos((2 / 4) * Math.PI) * radius + center.x, y: Math.sin((2 / 4) * Math.PI) * radius + center.y };
    let point4 = { x: Math.cos((3 / 4) * Math.PI) * radius + center.x, y: Math.sin((3 / 4) * Math.PI) * radius + center.y };
    let point5 = { x: Math.cos(Math.PI) * radius + center.x, y: Math.sin(Math.PI) * radius + center.y };
    let point6 = { x: Math.cos((5 / 4) * Math.PI) * radius + center.x, y: Math.sin((5 / 4) * Math.PI) * radius + center.y };
    let point7 = { x: Math.cos((6 / 4) * Math.PI) * radius + center.x, y: Math.sin((6 / 4) * Math.PI) * radius + center.y };
    let point8 = { x: Math.cos((7 / 4) * Math.PI) * radius + center.x, y: Math.sin((7 / 4) * Math.PI) * radius + center.y };
    let point9 = { x: Math.cos((8 / 4) * Math.PI) * radius + center.x, y: Math.sin((8 / 4) * Math.PI) * radius + center.y };

    cx.beginPath();
    cx.moveTo(point1.x, point1.y);
    cx.quadraticCurveTo(50, 50, point2.x, point2.y);
    cx.quadraticCurveTo(50, 50, point3.x, point3.y);
    cx.quadraticCurveTo(50, 50, point4.x, point4.y);
    cx.quadraticCurveTo(50, 50, point5.x, point5.y);
    cx.quadraticCurveTo(50, 50, point6.x, point6.y);
    cx.quadraticCurveTo(50, 50, point7.x, point7.y);
    cx.quadraticCurveTo(50, 50, point8.x, point8.y);
    cx.quadraticCurveTo(50, 50, point9.x, point9.y);

    cx.fillStyle = 'orange';
    cx.fill();
}

// THE PIE CHART

// Earlier in the chapter, we saw an example program that drew a pie
// chart. Modify this program so that the name of each category is
// shown next to the slice that represents it. Try to find a
// pleasing-looking way to automatically position this text that would
// work for other data sets as well. You may assume that categories
// are big enough to leave ample room for their labels.

// You might need Math.sin and Math.cos again, which are described in
// Chapter 14.

//<canvas width="600" height="300"></canvas>
//<script>
let cx = document.querySelector("canvas").getContext("2d");
let total = results
    .reduce((sum, { count }) => sum + count, 0);
let currentAngle = -0.5 * Math.PI;
let centerX = 300, centerY = 150;

// Add code to draw the slice labels in this loop.
for (let result of results) {
    //let sliceAngle = (2*Math.PI / total) * result.count;
    let sliceAngle = (result.count / total) * 2 * Math.PI;
    cx.beginPath();
    cx.arc(centerX, centerY, 100,
        currentAngle, currentAngle + sliceAngle);

    //find middle of angle
    let middleAngle = currentAngle + 0.5 * sliceAngle;
    let textX = Math.cos(middleAngle) * 120 + centerX;
    let textY = Math.sin(middleAngle) * 120 + centerY;
    //put lable there
    cx.font = "18px Georgia";
    cx.fillStyle = result.color;
    cx.textBaseline = "middle";
    cx.textAlign = Math.cos(middleAngle) >= 0 ? "left" : "right";
    cx.fillText("test", textX, textY);

    currentAngle += sliceAngle;
    cx.lineTo(centerX, centerY);
    cx.fillStyle = result.color;
    cx.fill();
}
//</script>



// A BOUNCING BALL

// Use the requestAnimationFrame technique that we saw in Chapter 14 and Chapter
// 16 to draw a box with a bouncing ball in it. The ball moves at a constant
// speed and bounces off the box’s sides when it hits them.

//<canvas width="400" height="400"></canvas>
//<script>
class Vec {
  constructor(x, y) {
    this.x = x; this.y = y;
  }
  plus(other) {
    return new Vec(this.x + other.x, this.y + other.y);
  }
  times(factor) {
    return new Vec(this.x * factor, this.y * factor);
  }
}

class Ball {
    constructor(pos, speed, height) { 
	this.pos = pos;
	this.speed = speed;
	this.height = height;
    }
}

let cx = document.querySelector("canvas").getContext("2d");

cx.strokeRect(1, 1, 300, 300);
let rectSize = 300;

let ball = new Ball(new Vec(100, 100), new Vec(150, 200), 30);
cx.beginPath();
cx.arc(ball.pos.x, ball.pos.y, 30, 0, 7);
cx.fill();
cx.closePath();

let lastTime = null;
function frame(time) {
    if (lastTime != null) {
	updateAnimation(Math.min(100, time - lastTime) / 1000);
    }
    lastTime = time;
    requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

function updateAnimation(step) {
    // compute new pos 
    let newPos = ball.pos.plus(ball.speed.times(step));
    if (newPos.x > 270 || newPos.x < 30)
	ball.speed.x = ball.speed.x * -1; 
    if (newPos.y > 270 || newPos.y < 30)
	ball.speed.y = ball.speed.y * -1; 

    // clear all
    cx.clearRect(0, 0, 400, 400);
    // draw new rect
    cx.strokeRect(1, 1, 301, 301);
    // draw new pos
    ball = new Ball(newPos, ball.speed, 30);
    cx.beginPath();
    cx.arc(ball.pos.x, ball.pos.y, 30, 0, 7);
    cx.fill();
    cx.closePath();
}
//</script>
