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

select.addEventListener('change', event => {
    //console.log(event.target.value);
    fetch(event.target.value)
	.then(content => {
	    content.text().then(text => {
		textarea.value = text;
	    });
	});
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

