var display = document.getElementById('display');
var numberButtons = document.querySelectorAll('a.number');
var operatorButtons = document.querySelectorAll('a.operation');
var allButtons = document.querySelectorAll('a.number, a.operation');
var fullNumber = '';
var result = 0;
var previousOperation = '';
var enterPressed = false;

display.innerHTML = "0";

function displayNumbers(number) {
    if (enterPressed) {
        clear();
    }
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
    enterPressed = false;
}

function operation(operator) {
    if (previousOperation !== '' && !enterPressed || operator === '=') {
        result = Number(result);
        number = Number(fullNumber);
        console.log(result, number);
        if (fullNumber) {
            if (previousOperation === '+') {
                result += number;
            }
            if (previousOperation ==='-') {
                result -= number;
            }
            if (previousOperation ==='x') {
                result *= number;
            }
            if (previousOperation ==='/') {
                result /= number;
            }
            display.innerHTML = String(result);
        }
    } else if (!enterPressed) {
        result = Number(fullNumber);
    }
    if (operator !== '=') {
        fullNumber = '';
        previousOperation = operator;
        enterPressed = false;
    } else {
        enterPressed = true;
    }
}

function keyPress(event) {
    eventKey = event.key;
    console.log(eventKey);
    if (eventKey === 'c') {
        clear();
        eventKey = 'C';
    } else if (eventKey === ',') {
        displayNumbers('.');
    } else if (eventKey === '*') {
        eventKey = 'x';
    } else if (eventKey === 'Enter') {
        eventKey = "=";
    }
    if (eventKey === '+' || eventKey === '-' || eventKey === 'x' || eventKey === '/' || eventKey === '=') {
        operation(eventKey);
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
