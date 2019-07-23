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
    diff = 0;
    for (let i = 0; i <= 8 * Math.PI; i += 0.05) {
        diff += 0.1;
        cx.fillRect(Math.cos(i) * diff + start.x, Math.sin(i) * diff + start.y, 1, 1);
    }
}
