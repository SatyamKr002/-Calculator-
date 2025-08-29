let history = [];
let historyIndex = -1;

const box = document.getElementById('history');

const operators = ['+', '-', '*', '/', '%'];
const exprAtEnd = /-?\d+(?:\.\d+)?[+\-*/%]-?\d+(?:\.\d+)?$/;
const inputView = document.getElementById('res');

function Solve(val) {
    const lastChar = inputView.value.slice(-1);
    if(val==='.' && lastChar==="."){
        return;
    }
    if (operators.includes(val)) {
        if (operators.includes(lastChar)) {
            inputView.value = inputView.value.slice(0, -1) + val;
            box.textContent = inputView.value;
            return;
        }

        if (exprAtEnd.test(inputView.value)) {
            percentageExpr = inputView.value + val;
            if (val === '%') {
                const match = percentageExpr.match(/\d+(\.\d+)?(?=\s*%)/);
                console.log("match", match);
                val = eval(match[0] / 100);
                let exp = inputView.value.replace(/([+\-*/])\s*\d+(\.\d+)?/, "$1");
                inputView.value = exp + val;
                console.log("inout viw", inputView.value)
                box.textContent = inputView.value;
                // history.push(`${startingExp}  = ${inputView.value}`);
                // historyIndex = -1;
            }
            else {
                exp = inputView.value;
                let result = eval(exp);
                console.log("result: " + result);
                box.textContent = result;
                history.push(`${exp}  = ${result}`);
                historyIndex = -1;
                
                console.log("history on every input: " + history);
                console.log(result)
                // console.log(typeof(result))
                // if (!isFinite(result) || isNaN(result)) {
                //     result = 0;
                // }
                inputView.value = result + val;
            }
            return;
        }

        // if (exprAtEnd.test(inputView.value)) {
        //     let exp = inputView.value;
        //     let result = eval(exp);
        //     console.log("result: " + result);
        //     box.textContent = result;
        //     history.push(`${exp}  = ${result}`);
        //     historyIndex = -1;
        //     console.log("history on every input: " + history);
        //     console.log(result)
        //     // console.log(typeof(result))
        //     if (!isFinite(result) || isNaN(result)) {
        //         result = 0;
        //     }
        //     inputView.value = result + val;
        //     return;
        // }
    }

    if (val === '%') {
        const expr = inputView.value;
        console.log("% expre", expr)
        let result = eval(expr) / 100;
        console.log("% result: ", result)
        history.push(`${expr}% = ${result}`);
        historyIndex = -1;

        if (!isFinite(result) || isNaN(result)) {
            result = 0;
        }
        box.textContent = result;
        inputView.value = result;
        // box.textContent = inputView.value;
    }



    else {
        if (inputView.value === Infinity || inputView.value === NaN || inputView.value === -Infinity) {
            inputView.value = 0;
        }
        inputView.value += val;
        box.textContent = inputView.value;
    }
    // console.log(history)
}

function Result() {
    const input = inputView.value;
    let result;

    if (exprAtEnd.test(input)) {
        try {
            result = eval(input);
            box.textContent = result;
            // console.log(result)
            // console.log("result on enter " + result)
        } catch (e) {
            console.log(e);
            return;
        }
    }
    if (!isFinite(result) || isNaN(result)) {
        result = 0;
    }
    else {
        inputView.value = result;

        history.push(`${input}  = ${result}`);
        // console.log(history)
        // console.log("history on enter" + history);
        historyIndex = -1;
        return;
    }
}

function Clear() {
    inputView.value = '';
    history = [];
    historyIndex = -1;
    box.textContent = 'History empty';
}

function Back() {
    if (historyIndex === -1 && inputView.value === "") {
        box.textContent = 'History empty';
    }
    else {
        inputView.value = inputView.value.slice(0, -1);
        box.textContent = inputView.value;
    }
}

function PreviousHistory() {
    if (history.length === 0) {
        box.textContent = 'History empty';
        return;
    }

    if (historyIndex === -1) {
        historyIndex = history.length - 1;
    }
    else if (historyIndex > 0) {
        historyIndex--;
    }
    else {
        return;
    }

    box.textContent = history[historyIndex];
    // console.log(historyIndex);
}

function forwardHistory() {
    if (history.length === 0) {
        box.textContent = 'History empty';
        return;
    }

    if (historyIndex === -1 || historyIndex >= history.length - 1) {
        return;
    } else {
        historyIndex++;
    }

    box.textContent = history[historyIndex];
    // console.log(historyIndex);
}

function EditHistory() {
    if (historyIndex !== -1 && history.length > 0) {
        let expression = box.textContent.split('=')[0].trim();
        inputView.value = expression;

        history = history.slice(0, historyIndex);
        // history.slice(historyIndex);
        historyIndex = -1;

        console.log("History after modification:", history);

    }
}

document.addEventListener('keydown', function (e) {
    const key = e.key;
    const validKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '+', '-', '*', '/', '%', '.'];
    if (validKeys.includes(key)) {
        Solve(key);
    } else if (key === 'Enter') {
        e.preventDefault();
        Result();
    } else if (key === 'Backspace') {
        Back();
    } else if (key === 'Escape') {
        Clear();
    }
    else if (key === 'ArrowLeft') {
        PreviousHistory();
    }
    else if (key === 'ArrowRight') {
        forwardHistory();
    }
    else if (key === 'ArrowDown') {
        EditHistory();
    }
});