var display = document.getElementById('display');
var numberElements = document.querySelectorAll('a.number');
var operatorElements = document.querySelectorAll('a.operation');
var allElements = document.querySelectorAll('a.number, a.operation');
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
    eventKey = event.key;
    if (eventKey === 'c') {
        clear();
        eventKey = 'C';
    } else if (eventKey === ',') {
        displayNumbers('.');
    } else if (eventKey === '*') {
        eventKey = 'x';
    } else if (eventKey === '+') {
        operation(eventKey);
    } else if (eventKey === 'Return') {
        console.log('ENTER');
        eventKey = "=";
    }
    for (let i = 0; i < numberElements.length; i++) {
        if (eventKey === numberElements[i].innerHTML) {
            displayNumbers(numberElements[i].innerHTML);
        }
    }
    for (let i = 0; i < allElements.length; i++) {
        if (eventKey === allElements[i].innerHTML) {
            allElements[i].classList.add('triggered');
            setTimeout(function() {
                allElements[i].classList.remove('triggered');
            }, 100);

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
