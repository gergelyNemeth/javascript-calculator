var display = document.getElementById('display');
var numberButtons = document.querySelectorAll('a.number');
var operatorButtons = document.querySelectorAll('a.operation');
var allButtons = document.querySelectorAll('a.number, a.operation');
var fullNumber = '';
var previousNumber = '';
var newNumber = false;
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
    newNumber = true;
}

function clear() {
    result = 0;
    previousOperation = '';
    display.innerHTML = '0';
    fullNumber = '';
    previousNumber = '';
    enterPressed = false;
}

function precisionOfNumbers(result) {
    if ((result > 1 || result < -1) && String(result).length <= 17) {
        display.innerHTML = String(result);
    } else if (result > 1 || result < -1) {
        display.innerHTML = String(result.toExponential(10));
    } else if (result > 0.000001) {
        display.innerHTML = String(result).slice(0, 17);
    } else {
        display.innerHTML = parseFloat(Number(result).toPrecision(10))
    }
}

function operation(operator) {
    if (previousOperation && (!enterPressed || operator === '=')) {
        if (!fullNumber) {
            fullNumber = previousNumber;
        }
        // Change operand to last result when operator entered after equal sign
        if (!newNumber && (enterPressed || operator === '=')) {
            fullNumber = result;
            newNumber = true;
        }
        if (newNumber) {
            result = Number(result);
            number = Number(fullNumber);
            if (previousOperation === '+') {
                result += number;
            } else if (previousOperation ==='-') {
                result -= number;
            } else if (previousOperation ==='x') {
                result *= number;
            } else if (previousOperation ==='/') {
                result /= number;
                if (Math.floor(result) !== result) {
                    result = Number(result).toPrecision(15);
                }
            }
            if (operator !== '=') {
                newNumber = false;
            }
            // Prevent displaying too long number
            precisionOfNumbers(result);
        }
    } else if (!enterPressed && operator !== '=') {
        result = Number(fullNumber);
    }
    if (operator !== '=') {
        previousNumber = fullNumber;
        fullNumber = '';
        previousOperation = operator;
        if (enterPressed) {
            newNumber = false;
        }
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
