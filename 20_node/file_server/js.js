
let textarea = document.querySelector('textarea');
// show content of page.html into textarea
fetch("page.html").then(response => {
    response.text()
	.then(content => {
	    textarea.value = content;
	});
});
