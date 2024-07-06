const calculator = {
    displayValue: '',
    firstOperand: null,
    waitingForSecondOperand: false,
    operator: null,
    resultShown: false,
};

function inputDigit(digit) {
    if (calculator.resultShown) {
        calculator.displayValue = digit;
        calculator.resultShown = false;
    } else {
        calculator.displayValue += digit;
    }
}

function inputDecimal(dot) {
    if (calculator.waitingForSecondOperand) return;

    if (!calculator.displayValue.includes(dot)) {
        calculator.displayValue += dot;
    }
}

function handleOperator(nextOperator) {
    const { firstOperand, displayValue, operator } = calculator;
    const inputValue = parseFloat(displayValue);

    if (operator && calculator.waitingForSecondOperand) {
        calculator.operator = nextOperator;
        calculator.displayValue = displayValue.slice(0, -1) + nextOperator;
        return;
    }

    if (firstOperand == null && !isNaN(inputValue)) {
        calculator.firstOperand = inputValue;
        calculator.displayValue += nextOperator;
    } else if (operator) {
        const secondOperand = parseFloat(displayValue.split(operator)[1]);
        if (!isNaN(secondOperand)) {
            const result = calculate(firstOperand, secondOperand, operator);
            calculator.displayValue = `${parseFloat(result.toFixed(7))}${nextOperator}`;
            calculator.firstOperand = result;
        }
    }

    calculator.waitingForSecondOperand = true;
    calculator.operator = nextOperator;
}

function calculate(firstOperand, secondOperand, operator) {
    if (operator === '+') {
        return firstOperand + secondOperand;
    } else if (operator === '-') {
        return firstOperand - secondOperand;
    } else if (operator === '*') {
        return firstOperand * secondOperand;
    } else if (operator === '/') {
        return firstOperand / secondOperand;
    }

    return secondOperand;
}

function resetCalculator() {
    calculator.displayValue = '';
    calculator.firstOperand = null;
    calculator.waitingForSecondOperand = false;
    calculator.operator = null;
    calculator.resultShown = false;
}

function updateDisplay() {
    const display = document.querySelector('.calculator-screen');
    display.value = calculator.displayValue;
}

const calculatorContainer = document.querySelector('.calculator-c');
const keys = document.querySelector('.calculator-keys');
keys.addEventListener('click', (event) => {
    const { target } = event;

    if (!target.matches('button')) {
        return;
    }

    if (target.classList.contains('operator')) {
        handleOperator(target.value);
        updateDisplay();
        return;
    }

    if (target.classList.contains('equal-sign')) {
        const { firstOperand, displayValue, operator } = calculator;
        const secondOperand = parseFloat(displayValue.split(operator)[1]);
        if (firstOperand != null && operator != null && !isNaN(secondOperand)) {
            const result = calculate(firstOperand, secondOperand, operator);
            calculator.displayValue = `${parseFloat(result.toFixed(7))}`;
            calculator.firstOperand = result;
            calculator.waitingForSecondOperand = false;
            calculator.operator = null;
            calculator.resultShown = true;
        }
        updateDisplay();
        return;
    }

    if (target.classList.contains('all-clear')) {
        resetCalculator();
        updateDisplay();
        return;
    }

    inputDigit(target.value);
    updateDisplay();
});

// Add event listener for the all-clear button within calculator-c
const allClearButton = document.querySelector('.all-clear');
allClearButton.addEventListener('click', () => {
    resetCalculator();
    updateDisplay();
});
