var display = document.getElementById('display');
var els = document.querySelectorAll('a.number');
var fullNumber = display.innerHTML;

display.innerHTML = "0";

function displayNumbers(number) {
    if (fullNumber.split('.').length > 1 && number === '.') {
        number = '';
    }
    if (fullNumber.length < 17) {
        fullNumber += number;  
    }
    display.innerHTML = fullNumber;
}

function keyPress(event) {
    if (event.key === 'c') {
        display.innerHTML = '0';
        fullNumber = '';
    }
    if (event.key === ',') {
        displayNumbers('.');
    }
    for (let i=0, n=els.length; i<n; ++i) {
        if (event.key === els[i].innerHTML) {
            displayNumbers(els[i].innerHTML);
        }
    }  
}

for (let i=0, n=els.length; i<n; ++i) {
    els[i].onclick = function () {
        displayNumbers(els[i].innerHTML);
    }
}

document.addEventListener("keypress", keyPress);
