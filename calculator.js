var display = document.getElementById('display');
var els = document.querySelectorAll('a.number');

function displayNumbers(number) {
    var fullNumber = display.innerHTML;

    if (fullNumber.split('.').length > 1 && number === '.') {
        number = '';
    }

    if (fullNumber.length < 17) {
        fullNumber += number;  
    }

    display.innerHTML = fullNumber;
}

for (let i=0, n=els.length; i<n; ++i) {
    els[i].onclick = function () {
        displayNumbers(els[i].innerHTML);
    }
}

