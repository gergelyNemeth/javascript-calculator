var display = document.getElementById('display');
var numberButtons = document.querySelectorAll('a.number');
var operatorButtons = document.querySelectorAll('a.operation');
var baseOperatorButtons = document.querySelectorAll('a#minus, a#plus, a#multiply, a#division');
var allButtons = document.querySelectorAll('a.number, a.operation');
var fullNumber = '';
var previousNumber = '';
var newNumber = false;
var result = 0;
var previousOperation = '';
var enterPressed = false;
var percentage = 1;

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
    newNumber = false;
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
    if (previousOperation && (!enterPressed || operator === '=') && operator !== '%') {
        // Equal sign pressed after another operator
        if (!fullNumber) {
            fullNumber = previousNumber;
        }
        // Change operand to last result when operator entered after equal sign
        if (!newNumber && (enterPressed || operator === '=')) {
            fullNumber = result;
            newNumber = true;
        }
        // Operation
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
    } else if (!enterPressed && operator !== '=' && operator !== '%') {
        result = Number(fullNumber);
    }
    // Plus-minus change
    if (operator === '+/-') {
        result *= -1;
        if (display.innerHTML.startsWith('-')) {
            display.innerHTML = display.innerHTML.slice(1);
        } else  {
            display.innerHTML = "-" + display.innerHTML;
        }
    }
    // Percentage of numbers
    if (operator === '%') {
        percentage = Number(fullNumber) / 100;
        if (previousOperation === '+' || previousOperation === '-') {
            fullNumber = Number(result) * percentage;
        } else if (previousOperation === 'x' || previousOperation === '/') {
            fullNumber = percentage;
        } else {
            if (result) {
                fullNumber = percentage;
            } else {
                fullNumber = percentage;
            }
        }
        display.innerHTML = fullNumber;
    }
    // Data preparation after operation
    if (operator !== '=' && operator !== '%') {
        previousNumber = fullNumber;
        fullNumber = '';
        previousOperation = operator;
        if (enterPressed) {
            newNumber = false;
        }
        enterPressed = false;
    } else if (operator === '='){
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
        eventKey = '=';
    } else if (eventKey === 'm') {
        eventKey = '+/-';
    }
    if (eventKey === '+' || eventKey === '-' || eventKey === 'x' || eventKey === '/' 
        || eventKey === '=' || eventKey === '+/-' || eventKey === '%') {
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
        for (let i = 0; i < baseOperatorButtons.length; i++) {
            if (eventKey === baseOperatorButtons[i].innerHTML) {
                baseOperatorButtons[i].classList.add('active-operation');
            } else {
                baseOperatorButtons[i].classList.remove('active-operation')
            }
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
