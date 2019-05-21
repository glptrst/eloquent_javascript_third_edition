let textarea = document.querySelector('textarea');
// show content of page.html into textarea
fetch("page.html").then(response => {
    response.text()
	.then(content => {
	    textarea.value = content;
	});
});

let form = document.querySelector("form");
form.addEventListener("submit", event => {
    console.log(form.text.value);
    event.preventDefault();

    fetch("page.html", {method: "PUT", body: form.text.value}).then(resp => {
	console.log(resp.status);
    });
});


