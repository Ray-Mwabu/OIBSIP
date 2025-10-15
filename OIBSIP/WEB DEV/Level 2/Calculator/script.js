class Calculator {
    constructor() {
        this.previousOperandElement = document.getElementById('previous-operand');
        this.currentOperandElement = document.getElementById('current-operand');
        this.memoryValueElement = document.getElementById('memory-value');
        this.errorIndicator = document.getElementById('error-indicator');
        
        this.clear();
        this.memory = 0;
        this.setupEventListeners();
        this.updateDisplay();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.shouldResetScreen = false;
        this.clearError();
    }

    clearEntry() {
        this.currentOperand = '0';
        this.clearError();
    }

    clearError() {
        this.errorIndicator.textContent = '';
    }

    setError(message) {
        this.errorIndicator.textContent = message;
    }

    appendNumber(number) {
        if (this.shouldResetScreen) {
            this.currentOperand = '';
            this.shouldResetScreen = false;
        }

        if (number === '.' && this.currentOperand.includes('.')) return;
        
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number;
        } else {
            this.currentOperand += number;
        }
        
        this.clearError();
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        
        if (this.previousOperand !== '') {
            this.calculate();
        }

        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
        this.clearError();
    }

    calculate() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);

        if (isNaN(prev) || isNaN(current)) return;

        try {
            switch (this.operation) {
                case 'add':
                    computation = prev + current;
                    break;
                case 'subtract':
                    computation = prev - current;
                    break;
                case 'multiply':
                    computation = prev * current;
                    break;
                case 'divide':
                    if (current === 0) {
                        throw new Error('Cannot divide by zero');
                    }
                    computation = prev / current;
                    break;
                case 'power':
                    computation = Math.pow(prev, current);
                    break;
                default:
                    return;
            }

            this.currentOperand = computation.toString();
            this.operation = undefined;
            this.previousOperand = '';
            this.shouldResetScreen = true;
            this.clearError();
        } catch (error) {
            this.setError(error.message);
            this.currentOperand = '0';
            this.previousOperand = '';
            this.operation = undefined;
        }
    }

    // Scientific Functions
    square() {
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;
        
        this.currentOperand = (current * current).toString();
        this.shouldResetScreen = true;
        this.clearError();
    }

    squareRoot() {
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;
        
        if (current < 0) {
            this.setError('Cannot calculate square root of negative number');
            return;
        }
        
        this.currentOperand = Math.sqrt(current).toString();
        this.shouldResetScreen = true;
        this.clearError();
    }

    factorial() {
        const current = parseInt(this.currentOperand);
        if (isNaN(current) || current < 0) {
            this.setError('Factorial requires non-negative integer');
            return;
        }

        if (current > 100) {
            this.setError('Number too large for factorial');
            return;
        }

        let result = 1;
        for (let i = 2; i <= current; i++) {
            result *= i;
        }
        
        this.currentOperand = result.toString();
        this.shouldResetScreen = true;
        this.clearError();
    }

    trigonometric(func) {
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;
        
        let result;
        switch (func) {
            case 'sin':
                result = Math.sin(current * Math.PI / 180); // Convert to radians
                break;
            case 'cos':
                result = Math.cos(current * Math.PI / 180);
                break;
            case 'tan':
                if (Math.abs(current % 180) === 90) {
                    this.setError('Tangent undefined for this angle');
                    return;
                }
                result = Math.tan(current * Math.PI / 180);
                break;
        }
        
        this.currentOperand = result.toString();
        this.shouldResetScreen = true;
        this.clearError();
    }

    logarithm() {
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;
        
        if (current <= 0) {
            this.setError('Logarithm requires positive number');
            return;
        }
        
        this.currentOperand = Math.log10(current).toString();
        this.shouldResetScreen = true;
        this.clearError();
    }

    percentage() {
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;
        
        this.currentOperand = (current / 100).toString();
        this.clearError();
    }

    // Memory Functions
    memoryClear() {
        this.memory = 0;
        this.updateMemoryDisplay();
        this.clearError();
    }

    memoryRecall() {
        this.currentOperand = this.memory.toString();
        this.clearError();
    }

    memoryAdd() {
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;
        
        this.memory += current;
        this.updateMemoryDisplay();
        this.clearError();
    }

    memorySubtract() {
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;
        
        this.memory -= current;
        this.updateMemoryDisplay();
        this.clearError();
    }

    updateMemoryDisplay() {
        this.memoryValueElement.textContent = this.memory;
    }

    getDisplayNumber(number) {
        if (number === '') return '';
        
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        
        let integerDisplay;
        
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', {
                maximumFractionDigits: 0
            });
        }
        
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    updateDisplay() {
        this.currentOperandElement.textContent = this.getDisplayNumber(this.currentOperand);
        
        if (this.operation != null) {
            const operatorSymbols = {
                'add': '+',
                'subtract': '-',
                'multiply': '×',
                'divide': '÷',
                'power': '^'
            };
            
            this.previousOperandElement.textContent = 
                `${this.getDisplayNumber(this.previousOperand)} ${operatorSymbols[this.operation]}`;
        } else {
            this.previousOperandElement.textContent = '';
        }

        // Add animation
        this.currentOperandElement.classList.add('display-update');
        setTimeout(() => {
            this.currentOperandElement.classList.remove('display-update');
        }, 300);
    }

    setupEventListeners() {
        // Button clicks
        document.querySelectorAll('.btn').forEach(button => {
            button.addEventListener('click', () => {
                // Number buttons
                if (button.classList.contains('btn-number')) {
                    this.appendNumber(button.getAttribute('data-number'));
                    this.updateDisplay();
                }
                
                // Operator buttons
                else if (button.classList.contains('btn-operator')) {
                    this.chooseOperation(button.getAttribute('data-action'));
                    this.updateDisplay();
                }
                
                // Equals button
                else if (button.classList.contains('btn-equals')) {
                    this.calculate();
                    this.updateDisplay();
                }
                
                // Function buttons
                else if (button.classList.contains('btn-function')) {
                    const action = button.getAttribute('data-action');
                    
                    switch (action) {
                        case 'clear-all':
                            this.clear();
                            break;
                        case 'clear-entry':
                            this.clearEntry();
                            break;
                        case 'percentage':
                            this.percentage();
                            break;
                    }
                    this.updateDisplay();
                }
                
                // Scientific buttons
                else if (button.classList.contains('btn-scientific')) {
                    const action = button.getAttribute('data-action');
                    
                    switch (action) {
                        case 'square':
                            this.square();
                            break;
                        case 'square-root':
                            this.squareRoot();
                            break;
                        case 'power':
                            this.chooseOperation('power');
                            this.updateDisplay();
                            return;
                        case 'factorial':
                            this.factorial();
                            break;
                        case 'sin':
                        case 'cos':
                        case 'tan':
                            this.trigonometric(action);
                            break;
                        case 'log':
                            this.logarithm();
                            break;
                    }
                    this.updateDisplay();
                }
                
                // Memory buttons
                else if (button.classList.contains('btn-memory')) {
                    const action = button.getAttribute('data-action');
                    
                    switch (action) {
                        case 'memory-clear':
                            this.memoryClear();
                            break;
                        case 'memory-recall':
                            this.memoryRecall();
                            break;
                        case 'memory-add':
                            this.memoryAdd();
                            break;
                        case 'memory-subtract':
                            this.memorySubtract();
                            break;
                    }
                    this.updateDisplay();
                }
            });
        });

        // Keyboard support
        document.addEventListener('keydown', (event) => {
            this.handleKeyboardInput(event);
        });
    }

    handleKeyboardInput(event) {
        if (event.key >= '0' && event.key <= '9') {
            this.appendNumber(event.key);
            this.updateDisplay();
        } else if (event.key === '.') {
            this.appendNumber('.');
            this.updateDisplay();
        } else if (event.key === '+') {
            this.chooseOperation('add');
            this.updateDisplay();
        } else if (event.key === '-') {
            this.chooseOperation('subtract');
            this.updateDisplay();
        } else if (event.key === '*') {
            this.chooseOperation('multiply');
            this.updateDisplay();
        } else if (event.key === '/') {
            event.preventDefault();
            this.chooseOperation('divide');
            this.updateDisplay();
        } else if (event.key === 'Enter' || event.key === '=') {
            event.preventDefault();
            this.calculate();
            this.updateDisplay();
        } else if (event.key === 'Escape') {
            this.clear();
            this.updateDisplay();
        } else if (event.key === 'Backspace') {
            this.clearEntry();
            this.updateDisplay();
        } else if (event.key === '%') {
            this.percentage();
            this.updateDisplay();
        }
    }
}

// Initialize calculator when page loads
document.addEventListener('DOMContentLoaded', () => {
    new Calculator();
});

// Additional utility functions
const MathUtils = {
    // Convert between number formats if needed
    toScientificNotation: function(number) {
        return number.toExponential(6);
    },
    
    // Format large numbers
    formatLargeNumber: function(number) {
        if (number > 1e12) {
            return this.toScientificNotation(number);
        }
        return number.toString();
    }
};