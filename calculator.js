var display = document.getElementById('display');
var numberElements = document.querySelectorAll('a.number');
var operatorElements = document.querySelectorAll('a.operation');
var fullNumber = '';
var lastResult = 0;
var lastOperation = '';

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

function clear() {
    lastResult = 0;
    lastOperation = '';
    display.innerHTML = '0';
    fullNumber = '';
}

function operation(operator) {
    if (lastOperation !== '') {
        lastResult = Number(lastResult);
        number = Number(fullNumber);
        if (lastOperation === '+') {
            lastResult += number;
        }
        lastOperation = operator;
        display.innerHTML = String(lastResult);
        fullNumber = '';
    } else {
        lastResult = Number(fullNumber);
        fullNumber = '';        
        lastOperation = '+';
    }
}

function keyPress(event) {
    if (event.key === 'c') {
        clear();
    } else if (event.key === ',') {
        displayNumbers('.');
    } else if (event.key === '+') {
        operation(event.key);
    }
    for (let i = 0; i < numberElements.length; i++) {
        if (event.key === numberElements[i].innerHTML) {
            displayNumbers(numberElements[i].innerHTML);
        }
    }  
}

for (let i = 0; i < numberElements.length; i++) {
    numberElements[i].onclick = function () {
        displayNumbers(numberElements[i].innerHTML);
    }
}

for (let i = 0; i < operatorElements.length; i++) {
    operatorElements[i].onclick = function () {
        var operator = operatorElements[i];
        operation(operator.innerHTML);
        if (operator.innerHTML === 'C') {
            clear();
        }
    }
}

document.addEventListener("keypress", keyPress);
