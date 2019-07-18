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


//Trapezoid
let cx = document.querySelector("canvas").getContext("2d");
cx.beginPath();
cx.moveTo(20, 10);
cx.lineTo(70, 10);
cx.lineTo(80, 50);
cx.lineTo(10, 50);
cx.closePath();
cx.stroke();
