var display = document.getElementById('display');
var numberButtons = document.querySelectorAll('a.number');
var operatorButtons = document.querySelectorAll('a.operation');
var allButtons = document.querySelectorAll('a.number, a.operation');
var fullNumber = '';
var result = 0;
var previousOperation = '';

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
    result = 0;
    previousOperation = '';
    display.innerHTML = '0';
    fullNumber = '';
}

function operation(operator) {
    if (previousOperation !== '') {
        result = Number(result);
        number = Number(fullNumber);
        if (previousOperation === '+') {
            result += number;
        }
        if (previousOperation ==='-') {
            result -= number;
        }
        previousOperation = operator;
        display.innerHTML = String(result);
        fullNumber = '';
    } else {
        result = Number(fullNumber);
        fullNumber = '';      
        previousOperation = operator;
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
    } else if (eventKey === '+' || eventKey === '-') {
        operation(eventKey);
    } else if (eventKey === 'Return') {
        console.log('ENTER');
        eventKey = "=";
    }
    for (let i = 0; i < numberButtons.length; i++) {
        if (eventKey === numberButtons[i].innerHTML) {
            displayNumbers(numberButtons[i].innerHTML);
        }
    }
    for (let i = 0; i < allButtons.length; i++) {
        if (eventKey === allButtons[i].innerHTML) {
            allButtons[i].classList.add('triggered');
            setTimeout(function() {
                allButtons[i].classList.remove('triggered');
            }, 100);

        }
    }
}

for (let i = 0; i < numberButtons.length; i++) {
    numberButtons[i].onclick = function () {
        displayNumbers(numberButtons[i].innerHTML);
    }
}

for (let i = 0; i < operatorButtons.length; i++) {
    operatorButtons[i].onclick = function () {
        var operator = operatorButtons[i];
        operation(operator.innerHTML);
        if (operator.innerHTML === 'C') {
            clear();
        }
    }
}

document.addEventListener("keypress", keyPress);
