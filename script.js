const currentValueOnScreen = document.querySelector(".currentValueOnScreen");
const buttonsContainer = document.querySelector(".buttons-container");

const numbersArr = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."];
const operationsArr = ["+", "-", "*", "/", "%"];

buttonsContainer.addEventListener("click", handlerClick);
document.addEventListener("keydown", handlerKeyDown);

function handlerClick(EO) {
    EO = EO || window.event;
    if (EO.target.tagName.toLowerCase() !== "button") return;
    let value = EO.target.name;
    findWhichButtonPressed(value);
};

function handlerKeyDown(EO) {
    EO = EO || window.event;
    EO.preventDefault();
    let value = "";

    if (numbersArr.includes(EO.key) || operationsArr.includes(EO.key)) {
        value = EO.key;
        findWhichButtonPressed(value);
    }

    switch (EO.key) {
        case "Enter":
            value = "=";
            findWhichButtonPressed(value);
            break;

        case "Backspace":
            value = "deleteLast";
            findWhichButtonPressed(value);
            break;

        case "Delete":
            value = "cleanAll";
            findWhichButtonPressed(value);
            break;

        case ",":
            value = ".";
            findWhichButtonPressed(value);
            break;

        default:
            break;
    }

}

function findWhichButtonPressed(value) {
    if (numbersArr.includes(value)) {
        calculator.addNumber(value);
        calculator.render();
    }

    if (operationsArr.includes(value)) {
        calculator.addOperation(value);
        calculator.render();
    }

    switch (value) {
        case "=":
            calculator.count();
            calculator.render();
            break;

        case "cleanAll":
            calculator.cleanAll();
            calculator.render();
            break;

        case "deleteLast":
            calculator.deleteLast();
            calculator.render();
            break;
        default:
    }
};


class Calculator {
    constructor(currentValueOnScreen) {
        this.currentValueOnScreen = currentValueOnScreen;
        this.error = false;
        this.cleanAll();
    }


    addNumber(number) {
        if (number === "." && this.currentValue.includes(".")) return;
        if (this.currentValue.toString().includes(".") && this.currentValue.length >= 9 + 1 ||
            !this.currentValue.toString().includes(".") && this.currentValue.length >= 9) {
            return
        }
        this.currentValue += number;
    }


    addOperation(operation) {
        if (this.currentValue === "") return;
        if (this.previousValue !== "") {
            this.count();
        };
        this.operation = operation;
        this.previousValue = this.currentValue;
        this.currentValue = "";
    }


    count() {
        let result;
        if (this.currentValue === "") {
            this.currentValue = this.previousValue;
        }

        const previousNumber = parseFloat(this.previousValue);
        const currentNumber = parseFloat(this.currentValue);
        if (isNaN(previousNumber) || isNaN(currentNumber)) return;
        switch (this.operation) {
            case "+":
                result = previousNumber + currentNumber;
                break;

            case "-":
                result = previousNumber - currentNumber;
                break;

            case "*":
                result = previousNumber * currentNumber;
                break;

            case "/":
                if (currentNumber === 0) {
                    this.error = true;
                    this.cleanAll();
                    return;
                }
                result = previousNumber / currentNumber;
                break;

            case "%":
                result = currentNumber / 100;
                break;
            default:
                return;
        }

        this.currentValue = (result.toFixed(8) * 100) / 100;
        this.observer();
        this.operation = "";
        this.previousValue = "";
    }


    deleteLast() {
        if (this.currentValue) {
            this.currentValue = this.currentValue.toString().slice(0, -1);
        } else if (this.operation) {
            this.operation = this.operation.toString().slice(0, -1);
        }
    }


    cleanAll() {
        this.currentValue = "";
        this.previousValue = "";
        this.operation = "";
    }

    howToShowNumbersOnScreen(number) {
        const stringNumber = number.toString();
        const integerNumber = parseFloat(stringNumber.split(".")[0]); 
        const decimalNumber = stringNumber.split(".")[1]; 
        let integerDisplay;
        if (isNaN(integerNumber)) {
            integerDisplay = "";
        } else {
            integerDisplay = integerNumber;
        }
        if (decimalNumber != null) {
            return `${integerDisplay}.${decimalNumber}`;
        } else {
            return integerDisplay;
        }
    }

    render() {
        this.currentValueOnScreen.innerText = this.howToShowNumbersOnScreen(this.currentValue);

        if (this.error) {
            this.currentValueOnScreen.innerText = "Error!"
            this.error = false;
            return;
        } else if (this.operation != null && this.currentValue === "") {
            this.currentValueOnScreen.innerText = this.operation;
        }
    }

    observer() {
        let currentValue = this.currentValue;
        let currentValueOnScreen = this.currentValueOnScreen;
        let scoreboardWidth = 350;
        const observer = new MutationObserver(
            function (mutations) {
                if (currentValue.toString().length > 10) {
                    currentValueOnScreen.style.fontSize = scoreboardWidth / currentValue.toString().length +
                        "px";
                } else {
                    currentValueOnScreen.style.fontSize = "39px";
                }
            }
        );
        observer.observe(currentValueOnScreen, {
            childList: true
        });
    }
}

const calculator = new Calculator(currentValueOnScreen);




