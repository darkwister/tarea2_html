let runningTotal = 0;
let buffer = "0";
let previusOperator;
let previousBuffer;

const pantalla = document.querySelector('.pantalla');

function buttonClick(value){
    if(isNaN(value)){
        handleSymbol(value);
    }else{
        handleNumber(value);
    }
    pantalla.innerText = buffer;
}

function updateHistory(){
    const historyList = document.getElementById('lastests');

    let history = JSON.parse(localStorage.getItem('calcHistory')) || [];
    historyList.innerHTML = '';

    history.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        historyList.appendChild(li);
    });
}

function saveHistorial(operation,result){
    let history = JSON.parse(localStorage.getItem('calcHistory')) || [];

    history.push(`${operation} = ${result}`);

    if (history.length > 10) {
        history.shift();
    }

    localStorage.setItem('calcHistory', JSON.stringify(history));
    updateHistory();
}

document.addEventListener('DOMContentLoaded', () => {
    updateHistory(); 
});

function handleSymbol(symbol){
    switch(symbol){
        case 'C':
            buffer = '0';
            runningTotal = 0;
            break;
        case '=':
            if(previusOperator === null){
                return
            }
            flushOperation(parseFloat(buffer));

            const operacionCompleta = `${previousBuffer} ${previusOperator} ${buffer}`;
            saveHistorial(operacionCompleta, runningTotal);

            previusOperator = null;
            buffer = runningTotal;
            runningTotal = 0;
            break;
        case '←':
            if(buffer.length === 1){
                buffer = '0';
            }else{
                buffer = buffer.substring(0, buffer.length - 1)
            }
            break;
        case '+':
        case '−':
        case '×':
        case '÷':
            handleMath(symbol);
            break;
        case '.':
            if(!buffer.includes('.')){
                buffer += '.';
            }
            break;
    }
}

function handleMath(symbol){
    if(buffer === '0'){
        return;
    }

    const intBuffer = parseFloat(buffer);

    if(runningTotal === 0){
        runningTotal = intBuffer;
    }else{
        flushOperation(intBuffer);
    }

    previousBuffer = buffer;
    previusOperator = symbol;
    buffer = '0';
}

function flushOperation(intBuffer){
    if(previusOperator === '+'){
        runningTotal += intBuffer;
    }else if(previusOperator === '−'){
        runningTotal -= intBuffer;
    }else if(previusOperator === '×'){
        runningTotal *= intBuffer;
    }else if(previusOperator === '÷'){
        runningTotal /= intBuffer;
    }
}

function handleNumber(numberString){
    if(buffer === '0'){
        buffer = numberString;
    }else{
        buffer += numberString;
    }
}

function init(){
    document.querySelector('.calc-botones').addEventListener('click', function(event){
        buttonClick(event.target.innerText);
    })
}

document.addEventListener('DOMContentLoaded', () => {
    const history = JSON.parse(localStorage.getItem('calcHistory')) || [];
    updateHistory(history);
});

document.getElementById('clearHistory').addEventListener('click', function(){
    localStorage.clear();
    updateHistory();
});

init();

