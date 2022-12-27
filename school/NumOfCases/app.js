const HTML = {
    sum1stEvent: document.getElementById('sum-1st-event'),
    sum2ndEvent: document.getElementById('sum-2nd-event'),
    mul1stEvent: document.getElementById('mul-1st-event'),
    mul2ndEvent: document.getElementById('mul-2nd-event'),
    perN: document.getElementById('permutation-n'),
    perR: document.getElementById('permutation-r'),
    comN: document.getElementById('combination-n'),
    comR: document.getElementById('combination-r'),
    sumResult: document.getElementById('sum-result'),
    mulResult: document.getElementById('mul-result'),
    perResult: document.getElementById('permutation-result'),
    comResult: document.getElementById('combination-result'),
};
setEventListener();
function setEventListener() {
    for (const prop in HTML) {
        if (prop === 'sumResult') {
            break;
        }
        const element = HTML[prop];
        if (prop === 'sum1stEvent' || prop === 'sum2ndEvent') {
            element.addEventListener('input', () => {
                sum();
            });
        }
        else if (prop === 'mul1stEvent' || prop === 'mul2ndEvent') {
            element.addEventListener('input', () => {
                mul();
            });
        }
        else if (prop === 'perN' || prop === 'perR') {
            element.addEventListener('input', () => {
                per();
            });
        }
        else {
            element.addEventListener('input', () => {
                com();
            });
        }
    }
    function sum() {
        setInput();
        HTML.sumResult.innerHTML = (BigInt(HTML.sum1stEvent.value) + BigInt(HTML.sum2ndEvent.value)).toString();
    }
    function mul() {
        setInput();
        HTML.mulResult.innerHTML = (BigInt(HTML.mul1stEvent.value) * BigInt(HTML.mul2ndEvent.value)).toString();
    }
    function per() {
        setInput();
        HTML.perResult.innerHTML = permutation(BigInt(HTML.perN.value), BigInt(HTML.perR.value));
        function permutation(n, r) {
            if (n < r) {
                window.alert('n ≥ r 이어야 합니다.');
                HTML.perR.value = '0';
                return 1n.toString();
            }
            else {
                return (factorial(n) / factorial(n - r)).toString();
            }
        }
    }
    function com() {
        setInput();
        HTML.comResult.innerHTML = combination(BigInt(HTML.comN.value), BigInt(HTML.comR.value));
        function combination(n, r) {
            if (n < r) {
                window.alert('n ≥ r 이어야 합니다.');
                HTML.comR.value = '0';
                return 1n.toString();
            }
            else {
                return (factorial(n) / (factorial(n - r) * factorial(r))).toString();
            }
        }
    }
    function factorial(n) {
        if (n <= 1n) {
            return 1n;
        }
        else {
            return n * factorial(n - 1n);
        }
    }
    function setInput() {
        for (const prop in HTML) {
            if (prop === 'sumResult') {
                break;
            }
            const element = HTML[prop];
            if (element.value === '') {
                element.value = '0';
            }
            else if (parseInt(element.value) < 0) {
                window.alert('0 이상의 수를 입력하세요.');
                element.value = '0';
            }
            else if (parseInt(element.value) > 100) {
                window.alert('100 이하의 수를 입력하세요.');
                element.value = '100';
            }
            else if (!(Number.isInteger(parseInt(element.value)))) {
                window.alert('정수를 입력하세요.');
                element.value = '0';
            }
        }
    }
}
