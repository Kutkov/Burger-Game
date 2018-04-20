
var checkbox = document.getElementById('checkbox');



checkbox.onchange = function() {
	var userName = document.getElementById('inputName').value;
	if (userName === '') {
		alert('Лучше введи свое имя.');
		checkbox.checked = false;
	}else {
		
		localStorage.setItem('name', JSON.stringify(userName));
		document.location.href = "level-1.html";
		
	}
};

// alert(JSON.parse(localStorage.getItem('name')));