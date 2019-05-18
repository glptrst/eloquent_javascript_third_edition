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

const {readFileSync, statSync, readdirSync} = require("fs");

let regexp = new RegExp(process.argv[2], 'g');
let paths = process.argv.slice(3);

search(regexp, paths);

// Take regexp and array of paths
function search(regexp, arr) {
    for (let i = 0; i < arr.length; i++) {
	let path = arr[i];
	let stats = statSync(path);

	if (stats.isDirectory()) {
	    let dirContent = readdirSync(path).map((el) => {
		return path + '/' + el;
	    });
	    search(regexp, dirContent);
	} else {
	    let content = readFileSync(path, 'utf8');
	    console.log(path + ': ' + regexp.test(content));
	}  
    }
}

// promises version
const {readFile, stat, readdir} = require("fs").promises;

let regexp = new RegExp(process.argv[2], 'g');
let paths = process.argv.slice(3);

search(regexp, paths);

// Take regexp and array of paths
async function search(regexp, arr) {
    for (let i = 0; i < arr.length; i++) {
	let path = arr[i];
	try {
	    let stats = await stat(path);
	    if (stats.isDirectory()) {
		let dirContent = await readdir(path);

		dirContent = dirContent.map((el) => {
		    return path + '/' + el;
		});;

		search(regexp, dirContent);
	    } else {
		let content = await readFile(path, 'utf8');
		console.log(path + ': ' + regexp.test(content));
	    }
	} catch (e) {
	    console.log(e);
	}
    }  
}
