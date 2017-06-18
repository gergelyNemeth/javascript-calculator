var display = document.getElementById('display');
var numberButtons = document.querySelectorAll('a.number');
var operatorButtons = document.querySelectorAll('a.operation');
var baseOperatorButtons = document.querySelectorAll('a#minus, a#plus, a#multiply, a#division');
var allButtons = document.querySelectorAll('a.number, a.operation');
var clearButton = document.getElementById('clear');
var fullNumber = '';
var previousNumber = '';
var newNumber = false;
var result = 0;
var previousResult = 0;
var previousOperation = '';
var enterPressed = false;
var afterClear = true;
var numberCleared = false;
var percentage = 1;

display.innerHTML = "0";

function displayNumbers(number) {
    if (enterPressed) {
        clearAll();
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
    clearButton.innerHTML = 'C';
    numberCleared = false;
}

function clearAll() {
    result = 0;
    previousOperation = '';
    display.innerHTML = '0';
    fullNumber = '';
    previousNumber = '';
    enterPressed = false;
    newNumber = false;
    afterClear = true;
    numberCleared = false;
    clearButton.innerHTML = 'AC';
}

function clearNumber() {
    if (!fullNumber) {
        previousNumber = false;
    } else {
        fullNumber = '';
    }
    display.innerHTML = '0';
    numberCleared = true;
    enterPressed = false;
    clearButton.innerHTML = 'AC';
}

function roundNumber(number, precision) {
    var factor = Math.pow(10, precision);
    var tempNumber = number * factor;
    var roundedTempNumber = Math.round(tempNumber);
    return roundedTempNumber / factor;
}

function precisionOfNumbers(result) {
    var preciseNumber;
    var intLength = String(Math.floor(result)).length;
    if ((result > 1 || result < -1) && String(result).length <= 17) {
        preciseNumber = String(result);
    } else if (result > (10**15) || result < - (10**15)) {
        preciseNumber = String(Number(result).toExponential(10));
    } else if (result < 0.00001 && result > 0 || result < 0 && result > -0.00001) {
        preciseNumber = String(Number(result).toExponential(10));
    } else {
        preciseNumber = String(roundNumber(Number(result), 16-intLength));
    }
    return preciseNumber;
}

function operation(operator) {
    if (previousOperation && (!enterPressed || operator === '=') && operator !== '%' && operator !== '+/-') {
        afterClear = false;
        // Equal sign pressed after another operator
        if (!fullNumber) {
            fullNumber = previousNumber;
        }
        // Change operand to last result when operator pressed after equal sign
        if (!newNumber && (enterPressed || operator === '=')) {
            fullNumber = result;
            newNumber = true;
        }
        // Operation
        if (newNumber) {
            result = Number(result); 
            number = Number(fullNumber);
            // Addition
            if (!previousResult && previousOperation === '+' && (operator !== 'x' && operator !== '/')) {
                result += number;
            } else if (!previousResult && previousOperation === '+' && (operator === 'x' || operator === '/')) {
                previousResult = result;
                result = 0;
                result += number;
            // Subtraction
            } else if (!previousResult && previousOperation ==='-' && (operator !== 'x' && operator !== '/')) {
                result -= number;
            } else if (!previousResult && previousOperation === '-' && (operator === 'x' || operator === '/')) {
                previousResult = result;
                result = 0;
                result -= number;
            // Multiply
            } else if (!previousResult && previousOperation ==='x') {
                result *= number;
            } else if (previousResult && previousOperation === 'x' && (operator === '+' || operator === '-'|| operator === '=')) {
                result *= number;
                result += previousResult;
                previousResult = 0;
            // Division
            } else if (previousOperation ==='/'){
                if (number !== 0) {
                    if (!previousResult) {
                        result /= number;
                    } else if (previousResult && (operator === '+' || operator === '-'|| operator === '=')) {
                        result /= number;
                        result += previousResult;
                        previousResult = 0;
                    }
                    if (Math.floor(result) !== result) {
                        result = Number(result).toPrecision(15);
                    }
                } else {
                    display.innerHTML = 'Division by zero';
                    setTimeout(function() {
                        display.innerHTML = '0';
                        clearAll()
                    }, 1000);
                    return;
                }
            }
            if (operator !== '=') {
                newNumber = false;
            }
            // Prevent displaying too long number
            displayResult = precisionOfNumbers(result);
            display.innerHTML = displayResult;
        }
    } else if (!enterPressed && operator !== '=' && operator !== '%' && operator !== '+/-') {
        result = Number(fullNumber);
        if (afterClear) {
            newNumber = false;
        }
    }
    // Change a positive number to negative and vice versa
    if (operator === '+/-') {
        if (newNumber) {
            if (!enterPressed) {
                fullNumber = Number(fullNumber) * -1;
            } else {
                result *= -1;
            }
            if (display.innerHTML.startsWith('-')) {
                display.innerHTML = display.innerHTML.slice(1);
            } else  {
                display.innerHTML = '-' + display.innerHTML;
            }
            return;
        }
    }
    // Percentage of numbers
    if (operator === '%') {
        if (!enterPressed) {
            percentage = Number(fullNumber) / 100;
        } else {
            percentage = result / 100;
        } 
        // Percentage of the previous number after addition or subtraction
        if ((previousOperation === '+' || previousOperation === '-') && !enterPressed) {
            fullNumber = Number(result) * percentage;
        // Percentage of the actual number after other operation
        } else {
            fullNumber = percentage;
        }
        displayFullNumber = precisionOfNumbers(fullNumber);
        display.innerHTML = displayFullNumber;
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

// Handle key press
function keyPress(event) {
    var activeOperation;
    eventKey = event.key;
    if (eventKey === ',') {
        displayNumbers('.');
    } else if (eventKey === '*') {
        eventKey = 'x';
    } else if (eventKey === 'Enter') {
        eventKey = '=';
    } else if (eventKey === 'm') {
        eventKey = '+/-';
    }
    activeOperation = eventKey;
    if (eventKey === '+' || eventKey === '-' || eventKey === 'x' || eventKey === '/' 
        || eventKey === '=' || eventKey === '+/-' || eventKey === '%') {
        operation(eventKey);
    }
    if (eventKey === 'c' && !numberCleared && !enterPressed) {
        clearNumber();
        eventKey = 'AC';
        activeOperation = previousOperation;
    } else if (eventKey === 'c' && (numberCleared || enterPressed)) {
        clearAll();
        eventKey = 'AC';
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
            if (activeOperation === baseOperatorButtons[i].innerHTML) {
                baseOperatorButtons[i].classList.add('active-operation');
            } else {
                baseOperatorButtons[i].classList.remove('active-operation')
            }
        }
    }
}

// Prevent focus on button elements to make possible to use enter properly
for (let i = 0; i < allButtons.length; i++) {
    allButtons[i].onfocus = function () {
        allButtons[i].blur();
    }
}
// Event handlers of the number buttons
for (let i = 0; i < numberButtons.length; i++) {
    numberButtons[i].onclick = function () {
        displayNumbers(numberButtons[i].innerHTML);
        for (let i = 0; i < baseOperatorButtons.length; i++) {
            baseOperatorButtons[i].classList.remove('active-operation')
        }
    }
}
// Event handlers of the operator buttons
for (let i = 0; i < operatorButtons.length; i++) {
    operatorButtons[i].onclick = function () {
        var operatorButton = operatorButtons[i];
        operation(operatorButton.innerHTML);
        if (operatorButton.innerHTML === 'C' || operatorButton.innerHTML === 'AC') {
            clearAll();
            // operatorButton.innerHTML = 'AC';
        }
        for (let i = 0; i < baseOperatorButtons.length; i++) {
            if (operatorButton.innerHTML === baseOperatorButtons[i].innerHTML) {
                baseOperatorButtons[i].classList.add('active-operation');
            }
        }
    }
}

document.addEventListener("keypress", keyPress);
