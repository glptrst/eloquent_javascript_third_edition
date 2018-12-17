// A VECTOR TYPE
//
// Write a class Vec that represents a vector in two-dimensional space. It takes
// x and y parameters (numbers), which it should save to properties of the same
// name.
//
// Give the Vec prototype two methods, plus and minus, that take another vector
// as a parameter and return a new vector that has the sum or difference of the
// two vectors’ (this and the parameter) x and y values.
//
// Add a getter property length to the prototype that computes the length of the
// vector—that is, the distance of the point (x, y) from the origin (0, 0).

class Vec {
    constructor(x, y){
	this.x = x;
	this.y = y;
    }
    plus(other) {
	return { x: this.x + other.x, y: this.y + other.y };
    }
    minus(other) {
	return { x: this.x - other.x, y: this.y - other.y };
    }
    get length(){
	return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }
}
// console.log(new Vec(1, 2).plus(new Vec(2, 3)));
// // → Vec{x: 3, y: 5}
// console.log(new Vec(1, 2).minus(new Vec(2, 3)));
// // → Vec{x: -1, y: -1}
// console.log(new Vec(3, 4).length);
// // → 5


// GROUPS
//
// The standard JavaScript environment provides another data structure called
// Set. Like an instance of Map, a set holds a collection of values. Unlike Map,
// it does not associate other values with those—it just tracks which values are
// part of the set. A value can be part of a set only once—adding it again
// doesn’t have any effect.
//
// Write a class called Group (since Set is already taken). Like Set, it has
// add, delete, and has methods. Its constructor creates an empty group, add
// adds a value to the group (but only if it isn’t already a member), delete
// removes its argument from the group (if it was a member), and has returns a
// Boolean value indicating whether its argument is a member of the group.
//
// Use the === operator, or something equivalent such as indexOf, to determine
// whether two values are the same.
//
// Give the class a static from method that takes an iterable object as argument
// and creates a group that contains all the values produced by iterating over
// it.

class Group {
    constructor() {
	this.members = [];
    }
    add(el) {
	if (! this.has(el)) this.members.push(el);
    }
    delete(el) {
	this.members = this.members.filter( a => a !== el );
    }
    has(el) {
	return this.members.includes(el);
    }
    static from(iterable) {
	let group = new Group();
	for (let el of iterable) {
	    group.add(el);
	}
	return group;
    }
}
// let group = Group.from([10, 20]);
// console.log(group.has(10));
// // → true
// console.log(group.has(30));
// // → false
// group.add(10);
// group.delete(10);
// console.log(group.has(10));
// // → false


// Iterable groups
//
// Make the Group class from the previous exercise iterable. Refer to the
// section about the iterator interface earlier in the chapter if you aren’t
// clear on the exact form of the interface anymore.
//
// If you used an array to represent the group’s members, don’t just return the
// iterator created by calling the Symbol.iterator method on the array. That
// would work, but it defeats the purpose of this exercise.
//
// It is okay if your iterator behaves strangely when the group is modified
// during iteration.

class GroupIterator {
    constructor(group) {
	this.members = group.members;
	this.index = 0;
	this.current = this.members[this.index] || null;
    }
    next() {
	if (this.index === this.members.length)
	    return {done: true};
	this.current = this.members[this.index++];
	return {value: this.current, done: false};
    }
}

Group.prototype[Symbol.iterator] = function() {
    return new GroupIterator(this);
};

// for (let value of Group.from(["a", "b", "c"])) {
//   console.log(value);
// }
// // → a
// // → b
// // → c
