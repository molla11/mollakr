function makeCanvas(length) {
    const parent = document.getElementById("wrap-canvas");
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = length;
    tempCanvas.height = length;
    tempCanvas.style.width = length.toString();
    tempCanvas.style.height = length.toString();
    tempCanvas.id = "canvas";
    parent.appendChild(tempCanvas);
}
let canvas;
let context;
function getCanvas() {
    try {
        canvas = document.getElementById("canvas");
        context = canvas.getContext("2d");
    }
    catch (err) {
        alert("An error occured. This page will be refreshed.\n" + err);
        location.reload();
    }
}
let sideLength = 200;
let numberOfDot = 300;
let dotted = 0;
let interval;
let inCircle = 0;
let outCircle = 0;
let delay = 100;
let accuracy = 3; // 0.xxx
let tenToTheAccuracy = 1000;
let isOptimize = false;
let isRunning = false;
const positions = [];
const inputSize = document.getElementById("size");
inputSize.addEventListener("input", processInputs);
const inputNumberOfDot = document.getElementById("number-of-dot");
inputNumberOfDot.addEventListener("input", processInputs);
const inputDelay = document.getElementById("delay");
inputDelay.addEventListener("input", processInputs);
const inputAccuracy = document.getElementById("accuracy");
inputAccuracy.addEventListener("input", () => {
    changeAccuracy(parseInt(inputAccuracy.value));
    document.getElementById("show-accuracy").innerHTML = "accuracy = " + inputAccuracy.value;
});
const btnGenerateDots = document.getElementById("generate-dots");
btnGenerateDots.addEventListener("click", () => {
    if (!isRunning) {
        generateDots();
    }
});
document.addEventListener("keypress", (e) => {
    if (e.key === "" && e.ctrlKey) { // Ctrl + Shift + U
        toggleIsOptimize();
    }
});
function toggleIsOptimize() {
    if (isOptimize) {
        isOptimize = false;
        say("visualized.");
    }
    else {
        isOptimize = true;
        say("optimized (show progress in console).");
        console.log("When you click generating button, I will show you progress.");
    }
}
function changeAccuracy(value) {
    if (value > 20) {
        say("Too accurate. Accuracy should be no more than 20.");
        accuracy = 3;
        tenToTheAccuracy = 1000;
    }
    else if (value < 0) {
        say("Strange accuracy.");
        accuracy = 0;
        tenToTheAccuracy = 1;
    }
    else {
        accuracy = value;
        tenToTheAccuracy = 10 ** value;
    }
    showData();
}
initialize();
function initialize() {
    clearInterval(interval);
    makeCanvas(sideLength);
    getCanvas();
    drawCircle();
}
function processInputs() {
    judgeInputs();
    initialize();
    showData();
}
function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}
function judgeInputs() {
    if (inputSize.value === "") {
        sideLength = 200;
    }
    else {
        if (parseInt(inputSize.value) < 0) {
            say("size should be no less than 0.");
            inputSize.value = "";
        }
        else {
            sideLength = parseInt(inputSize.value);
        }
    }
    if (inputNumberOfDot.value === "") {
        numberOfDot = 300;
    }
    else {
        if (parseInt(inputNumberOfDot.value) < 0) {
            say("number of dot should be no less than 0.");
            inputNumberOfDot.value = "";
        }
        else {
            numberOfDot = parseInt(inputNumberOfDot.value);
        }
    }
    if (inputDelay.value === "") {
        delay = 100;
    }
    else {
        if (parseInt(inputDelay.value) < 0) {
            say("Delay should be no less than 0.");
            inputDelay.value = "";
        }
        else {
            delay = parseInt(inputDelay.value);
        }
    }
}
function showData() {
    document.getElementById("values").innerHTML = `size = ${sideLength}(px)<br>dot = ${numberOfDot}<br>delay = ${delay}(ms)<br>r<sub>n</sub> = ${inCircle}<br>n = ${dotted}<br>π ≒ 4 × r<sub>n</sub> / n = ${dotted === 0 ? "Not defined" : Math.round(4 * inCircle / dotted * tenToTheAccuracy) / tenToTheAccuracy}<br>deviation = ${dotted === 0 ? "π" : Math.abs(Math.round((Math.PI - (4 * inCircle / dotted)) * tenToTheAccuracy) / tenToTheAccuracy)}`;
}
function drawCircle() {
    context.beginPath();
    context.arc(sideLength / 2, sideLength / 2, sideLength / 2, 0, Math.PI * 2);
    context.stroke();
}
function generateDots() {
    initialize();
    dotted = 0;
    inCircle = 0;
    outCircle = 0;
    isRunning = true;
    if (isOptimize) {
        optimizedDot();
    }
    else {
        interval = setInterval(dot, delay);
    }
}
function dot() {
    const positionOfDot = [Math.random(), Math.random()];
    positions.push(positionOfDot);
    context.beginPath();
    context.arc(positionOfDot[0] * sideLength, positionOfDot[1] * sideLength, 0.5, 0, Math.PI * 2);
    context.stroke();
    dotted++;
    if (positionOfDot[0] ** 2 + positionOfDot[1] ** 2 < 1) {
        inCircle++;
    }
    else {
        outCircle++;
    }
    showData();
    if (dotted >= numberOfDot) {
        isRunning = false;
        clearInterval(interval);
    }
}
function optimizedDot() {
    for (let i = 0; i < Math.floor(numberOfDot / 1000000); i++) {
        for (let j = 0; j < 1000000; j++) {
            const x = Math.random();
            const y = Math.random();
            dotted++;
            if (x * x + y * y < 1) {
                inCircle++;
            }
            else {
                outCircle++;
            }
        }
        console.log("Repeated " + dotted + " times.");
    }
    if (numberOfDot % 1000000 > 0) {
        for (let i = 0; i < numberOfDot % 1000000; i++) {
            const x = Math.random();
            const y = Math.random();
            dotted++;
            if (x * x + y * y < 1) {
                inCircle++;
            }
            else {
                outCircle++;
            }
        }
        console.log("Repeated " + dotted + " times.");
    }
    showData();
    isRunning = false;
}
let saveTimeout;
function say(ment) {
    clearTimeout(saveTimeout);
    const sayElement = document.getElementById("say");
    sayElement.innerHTML = ment;
    sayElement.style.zIndex = "100";
    sayElement.style.opacity = "1";
    saveTimeout = setTimeout(() => {
        sayElement.style.opacity = "0";
        sayElement.style.zIndex = "-1";
    }, 2500);
}
