for (let i = 1; i < 8; i++) {
    let toPrint = '';
    for (let j = 0; j < i; j++)
	toPrint = toPrint + '#';
    console.log(toPrint);
}

for (let i = 1; i <= 100; i++) {
    if (i % 3 === 0) {
	if (i % 5 === 0)
	    console.log('FizzBuzz');
        else
	    console.log('Fizz');
    } else if (i % 5 === 0)
	console.log('Buzz');
    else
	console.log(i);
}

let size = 8;
for (let i = 0; i < size; i++) {
    let toPrint = '';
    if (i % 2 === 0) {
	for (let j = 0; j < size; j++) {
	    if (j % 2 === 0) toPrint = toPrint + ' ';
	    else toPrint = toPrint + '#';
	}
	console.log(toPrint);
    } else {
	for (let j = 0; j < size; j++) {
	    if (j % 2 === 0) toPrint = toPrint + '#';
	    else toPrint = toPrint + ' ';
	}
	console.log(toPrint);
    }
}
