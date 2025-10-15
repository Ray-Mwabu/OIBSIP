class TemperatureConverter {
    constructor() {
        this.initializeElements();
        this.bindEvents();
    }

    initializeElements() {
        // Input elements
        this.temperatureInput = document.getElementById('temperature-input');
        this.inputError = document.getElementById('input-error');
        this.convertBtn = document.getElementById('convert-btn');
        
        // Unit selection
        this.unitRadios = document.querySelectorAll('input[name="from-unit"]');
        
        // Result elements
        this.celsiusResult = document.getElementById('celsius-result').querySelector('.result-value');
        this.fahrenheitResult = document.getElementById('fahrenheit-result').querySelector('.result-value');
        this.kelvinResult = document.getElementById('kelvin-result').querySelector('.result-value');
    }

    bindEvents() {
        this.convertBtn.addEventListener('click', () => this.convertTemperature());
        
        // Allow conversion on Enter key
        this.temperatureInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.convertTemperature();
            }
        });

        // Real-time input validation
        this.temperatureInput.addEventListener('input', () => {
            this.validateInput();
        });
    }

    validateInput() {
        const value = this.temperatureInput.value.trim();
        
        if (value === '') {
            this.inputError.textContent = '';
            return true;
        }

        if (isNaN(value)) {
            this.inputError.textContent = 'Please enter a valid number';
            return false;
        }

        if (!isFinite(value)) {
            this.inputError.textContent = 'Please enter a finite number';
            return false;
        }

        this.inputError.textContent = '';
        return true;
    }

    getSelectedUnit() {
        for (const radio of this.unitRadios) {
            if (radio.checked) {
                return radio.value;
            }
        }
        return 'celsius'; // default
    }

    convertTemperature() {
        // Validate input
        if (!this.validateInput()) {
            return;
        }

        const inputValue = parseFloat(this.temperatureInput.value);
        const fromUnit = this.getSelectedUnit();

        if (isNaN(inputValue)) {
            this.inputError.textContent = 'Please enter a temperature value';
            return;
        }

        // Perform conversions
        let celsius, fahrenheit, kelvin;

        switch (fromUnit) {
            case 'celsius':
                celsius = inputValue;
                fahrenheit = this.celsiusToFahrenheit(celsius);
                kelvin = this.celsiusToKelvin(celsius);
                break;
            case 'fahrenheit':
                fahrenheit = inputValue;
                celsius = this.fahrenheitToCelsius(fahrenheit);
                kelvin = this.celsiusToKelvin(celsius);
                break;
            case 'kelvin':
                kelvin = inputValue;
                celsius = this.kelvinToCelsius(kelvin);
                fahrenheit = this.celsiusToFahrenheit(celsius);
                break;
        }

        // Update results
        this.displayResults(celsius, fahrenheit, kelvin);
    }

    // Conversion formulas
    celsiusToFahrenheit(celsius) {
        return (celsius * 9/5) + 32;
    }

    fahrenheitToCelsius(fahrenheit) {
        return (fahrenheit - 32) * 5/9;
    }

    celsiusToKelvin(celsius) {
        return celsius + 273.15;
    }

    kelvinToCelsius(kelvin) {
        return kelvin - 273.15;
    }

    displayResults(celsius, fahrenheit, kelvin) {
        // Format numbers to 2 decimal places
        this.celsiusResult.textContent = celsius.toFixed(2);
        this.fahrenheitResult.textContent = fahrenheit.toFixed(2);
        this.kelvinResult.textContent = kelvin.toFixed(2);

        // Add animation effect
        this.animateResults();
    }

    animateResults() {
        const resultCards = document.querySelectorAll('.result-card');
        
        resultCards.forEach((card, index) => {
            card.style.transform = 'scale(0.95)';
            setTimeout(() => {
                card.style.transform = 'scale(1)';
            }, 150 * index);
        });
    }
}

// Formulas reference (commented for educational purposes)
/*
Conversion Formulas:
- Celsius to Fahrenheit: (°C × 9/5) + 32
- Fahrenheit to Celsius: (°F - 32) × 5/9
- Celsius to Kelvin: °C + 273.15
- Kelvin to Celsius: K - 273.15

Absolute Zero:
- Celsius: -273.15°C
- Fahrenheit: -459.67°F
- Kelvin: 0K
*/

// Initialize the converter when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new TemperatureConverter();
});

// Additional utility function for extreme temperature warnings
function checkExtremeTemperatures(celsius) {
    if (celsius < -273.15) {
        return "⚠️ Below absolute zero! This temperature is theoretically impossible.";
    } else if (celsius < -100) {
        return "❄️ Extremely cold temperature";
    } else if (celsius > 100) {
        return "🔥 Very hot temperature";
    }
    return null;
}