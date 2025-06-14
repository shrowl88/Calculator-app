//Acces DOM elements of the calculator
const inputBox = document.getElementById("input");
const expressionDiv = document.getElementById("expression");
const resultDiv = document.getElementById("result");

//Menentukan expression and result variable
let expression = "";
let result = "";

//Menentukan event handler untuk button clicks
function buttonClick(event) {
    // Get the value of the clicked button
    const target = event.target;
    const action = target.dataset.action;
    const value = target.dataset.value;
    // console.log(target, action, value);

    // Ganti case untuk mengontrol logika kalkulator
    switch (action) {
        case 'number':
            addValue(value);
            break;
        case 'clear':
            clear();
            break;
        case 'backspace':
            backspace();
            break;
    // Menambah result ke expression sebagai titik awal jika expression kosong
        case 'addition':
        case 'subtraction':
        case 'multiplication':
        case 'division':
            if (expression === '' && result !== ''){
                startFromResult(value);
            } else if (expression !== '' && !isLastCharOperator()) {
                addValue(value);
            }
            break;
        case 'submit':
            submit();
            break;
        case 'negate':
            negate();
            break;
        case 'mod':
            percentage();
            break;
        case 'decimal':
            decimal(value);
            break;
    }
    // Update the display
    updateDisplay(expression, result);
}

inputBox.addEventListener("click", buttonClick);

// Function untuk menambah value ke expression
function addValue(value) {
    if (value === '.') {
        // Mencari index of the last operator dalam expression
        const lastOperatorIndex = expression.search(/[+\-*/]/);
        // Mencari index of the last decimal dalam the expression
        const lastDecimalIndex = expression.lastIndexOf('.');
        // Mencari index of the last number dalam the expression
        const lastNumberIndex = Math.max(
            expression.lastIndexOf('+'),
            expression.lastIndexOf('-'),
            expression.lastIndexOf('*'),
            expression.lastIndexOf('/'),
        );
        // Cek apakah ini adalah desimal pertama pada angka saat ini atau jika expression kosong
        if (
            (lastDecimalIndex < lastOperatorIndex ||
            lastDecimalIndex < lastNumberIndex ||
            lastDecimalIndex === -1) &&
            (expression === '' || 
                expression.slice(lastNumberIndex +1).indexOf('.') === -1)
        ) {
            expression += value;
        }
    }
    else {
        expression += value;
    }
}

function updateDisplay(expression, result) {
    expressionDiv.textContent = expression;
    resultDiv.textContent = result;
}

function clear() {
    expression = '';
    result = '';
}

function backspace() {
    expression = expression.slice(0, -1);
}

function isLastCharOperator() {
    return isNaN(parseInt(expression.slice(-1)));
}

function startFromResult(value) {
    expression = result + value;
}

function submit() {
    result = evaluateExpression();
    expression = '';
}

function evaluateExpression() {
    const evalResult = eval(expression);
    // Memeriksa apakah evalResult adalah NaN atau tak terbatas. Jika ya, kembalikan karakter spasi ' '
    return isNaN(evalResult) || !isFinite(evalResult)
        ? ' '
        : evalResult < 1
        ? parseFloat(evalResult.toFixed(10))
        : parseFloat(evalResult.toFixed(2));
}

function negate() {
    //Hasil Negate jika expression kosong dan hasilnya ada
    if (expression === '' && result !== '') {
        result = -result;
        //Mengalihkan tanda expression jika belum negate dan tidak kosong
    } else if (!expression.startsWith('-') && expression !== '') {
        expression = '-' + expression;
        //Menghapus tanda negatif dari expression jika sudah negatif
    } else if (expression.startsWith('-')) {
        expression = expression.slice(1);
    }
}

function percentage() {
    //Evaluasi expression, jika tidak makan akan mengambil presentase hanya angka pertama
    if (expression !== '') {
        result = evaluateExpression();
        expression = '';
        if (!isNaN(result) && isFinite(result)) {
            result = result / 100;
        } else {
            result = ' ';
        }
    } else if (result !== '') {
        // Jika expression kosong, ambil presentase dari hasil
        result = parseFloat(result) / 100;
    }
}

function decimal(value) {
    if (!expression.endsWith('.') && !isNaN(expression.slice(-1))){
        addValue(value);
    }
}