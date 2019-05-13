// SEARCH TOOL

// On Unix systems, there is a command line tool called grep that can be used to
// quickly search files for a regular expression.

// Write a Node script that can be run from the command line and acts somewhat like
// grep. It treats its first command line argument as a regular expression and
// treats any further arguments as files to search. It should output the names of
// any file whose content matches the regular expression.

// When that works, extend it so that when one of the arguments is a directory, it
// searches through all files in that directory and its subdirectories.

// Use asynchronous or synchronous file system functions as you see fit. Setting
// things up so that multiple asynchronous actions are requested at the same time
// might speed things up a little, but not a huge amount, since most file systems
// can read only one thing at a time.

let {readFileSync} = require('fs');

let regexp = new RegExp(process.argv[2], 'g');

for (let i = 3; i < process.argv.length; i++) {
    let file = process.argv[i];
    let content = readFileSync(file, 'utf8');
    console.log(file + ': ' + regexp.test(content));
}

// printing in order using await
// (async function () {
//     let {readFile} = require('fs').promises;

//     let toFind = process.argv[2];

//     for (let i = 3; i < process.argv.length; i++) {
// 	let file = process.argv[i];
// 	try{
// 	    let text = await readFile(file, 'utf8');
// 	    let regexp = new RegExp(toFind, 'g');
// 	    console.log(file + ': ' + regexp.test(text));
// 	}
// 	catch(e) {
// 	    console.log(e);
// 	}
//     }
// })();
