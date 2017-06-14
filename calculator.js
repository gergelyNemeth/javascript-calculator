var display = document.getElementById('display');
var numberButtons = document.querySelectorAll('a.number');
var operatorButtons = document.querySelectorAll('a.operation');
var allButtons = document.querySelectorAll('a.number, a.operation');
var fullNumber = '';
var previousNumber = '';
var result = 0;
var previousOperation = '';
var enterPressed = false;

display.innerHTML = "0";

function displayNumbers(number) {
    if (enterPressed) {
        clear();
    }
    // Prevent adding more than one decimal point
    if (fullNumber.split('.').length >= 2 && number === '.') {
        number = '';
    }
    // Prevent adding more than one zeros
    if (!fullNumber || fullNumber.startsWith('0') && !fullNumber.includes('.')) {
        fullNumber = fullNumber.slice(1);
    }
    // Add a zero before the decimal point when it is entered very first time
    if (!fullNumber && number === '.') {
        number = '0.'
    }
    // Prevent adding too long numbers
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
    previousNumber = '';
    enterPressed = false;
}

function operation(operator) {
    if (previousOperation && (!enterPressed || operator === '=')) {
        if (!fullNumber) {
            fullNumber = previousNumber;
        }
        result = Number(result);
        number = Number(fullNumber);
        if (fullNumber) {
            if (previousOperation === '+') {
                result += number;
            } else if (previousOperation ==='-') {
                result -= number;
            } else if (previousOperation ==='x') {
                result *= number;
            } else if (previousOperation ==='/') {
                result /= number;
            }
            // Prevent displaying too long number
            if (String(result).length < 17) {
                display.innerHTML = String(result);
            } else {
                display.innerHTML = 'TOO LONG NUMBER';
                setTimeout(function() {
                    clear();
                }, 1000);
            }
        }
    } else if (!enterPressed && operator !== '=') {
        result = Number(fullNumber);
    }
    if (operator !== '=') {
        previousNumber = fullNumber;
        fullNumber = '';
        previousOperation = operator;
        enterPressed = false;
    } else {
        enterPressed = true;
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
