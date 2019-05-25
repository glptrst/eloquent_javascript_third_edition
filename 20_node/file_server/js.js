let select = document.querySelector('select');
let textarea = document.querySelector('textarea');

showContent(textarea.value);

// show options in the select menu
fetch('/').then(response => {
    response.text()
	.then(content => {
	    let files = content.split('\n');
	    for (let file of files) {
		let option = document.createElement('option');
		let optionText = document.createTextNode(file);
		option.appendChild(optionText);
		select.appendChild(option);
	    }
	});
});

// Change content of textarea with changing option in the select menu
select.addEventListener('change', event => {
    showContent(event.target.value);
});

// Get name of page. Get its content and show it in the textarea
function showContent (page) {
    fetch(page)
	.then(content => {
	    content.text().then(text => {
		textarea.value = text;
	    });
	});
}

let form = document.querySelector("form");
form.addEventListener("submit", event => {
    event.preventDefault();
        fetch(select.value, {method: "PUT", body: textarea.value}).then(resp => {
    	console.log(resp.status);
    });
});
