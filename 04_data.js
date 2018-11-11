// The introduction of this book alluded to the following as a nice
// way to compute the sum of a range of numbers:
//
// 1 console.log(sum(range(1, 10)));
//
// Write a range function that takes two arguments, start and end, and
// returns an array containing all the numbers from start up to (and
// including) end.
//
// Next, write a sum function that takes an array of numbers and
// returns the sum of these numbers. Run the example program and see
// whether it does indeed return 55.
//
// As a bonus assignment, modify your range function to take an
// optional third argument that indicates the “step” value used when
// building the array. If no step is given, the elements go up by
// increments of one, corresponding to the old behavior. The function
// call range(1, 10, 2) should return [1, 3, 5, 7, 9]. Make sure it
// also works with negative step values so that range(5, 2, -1)
// produces [5, 4, 3, 2].

function range (start, end) {
    let result = [];
    for (let i = start; i <= end; i++)
	result.push(i);
    return result;
}

function sum(numbers) {
    //obviously we could use reduce
    //but higher order functions haven't been introduced yet
    let result = 0; 
    for (number of numbers)
	result += number;
    return result;
}

function range(start, end, step) {
    if (step === 0) return 'eh?';
    if (!step) step = 1;

    let result = [];
    if (step > 0) 
	for (let i = start; i <= end; i+=step)
	    result.push(i);
    else
	for (let i = start; i >= end; i+=step)
	    result.push(i);

    return result;
}


// Reversing an array
//
// Arrays have a reverse method that changes the
// array by inverting the order in which its elements appear. For this
// exercise, write two functions, reverseArray and
// reverseArrayInPlace. The first, reverseArray, takes an array as
// argument and produces a new array that has the same elements in the
// inverse order. The second, reverseArrayInPlace, does what the
// reverse method does: it modifies the array given as argument by
// reversing its elements. Neither may use the standard reverse
// method.
//
// Thinking back to the notes about side effects and pure functions in
// the previous chapter, which variant do you expect to be useful in
// more situations? Which one runs faster
    ?
function reverseArray(arr) {
    let result = [];
    for (let i = arr.length-1; i >= 0; i--) {
	result.push(arr[i]);
    }
    return result;
}

function reverseArrayInPlace(arr) {
    let reversed = reverseArray(arr);
    for (let i = 0; i < arr.length; i++)
	arr[i] = reversed[i];
}

