function makeCanvas(length: number) {
    const parent = document.getElementById("wrap-canvas") as HTMLDivElement;
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

let canvas: HTMLCanvasElement;
let context: CanvasRenderingContext2D;

function getCanvas() {
    try {
        canvas = document.getElementById("canvas") as HTMLCanvasElement;
        context = canvas.getContext("2d");
    } catch (err) {
        alert("canvas를 불러오는 중 에러가 발생하였습니다.\n페이지를 새로 고칩니다.\n" + err);
        location.reload();
    }
}

let sideLength: number = 200;
let numberOfDot: number = 300;
let dotted: number = 0;
let interval: number;
let inCircle: number = 0;
let outCircle: number = 0;
let delay: number = 100;
let isOptimize: boolean = false;
let isRunning: boolean = false;

type Position = [number, number];

const positions: Array<Position> = [];

const inputSize = document.getElementById("size") as HTMLInputElement;
inputSize.addEventListener("input", processInputs);
const inputNumberOfDot = document.getElementById("number-of-dot") as HTMLInputElement;
inputNumberOfDot.addEventListener("input", processInputs);
const inputDelay = document.getElementById("delay") as HTMLInputElement;
inputDelay.addEventListener("input", processInputs);
const btnGenerateDots = document.getElementById("generate-dots") as HTMLButtonElement;
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
    } else {
        if (parseInt(inputSize.value) < 0) {
            say("size should be no less than 0.");
            inputSize.value = "";
        } else {
            sideLength = parseInt(inputSize.value);
        }    }
    
    if (inputNumberOfDot.value === "") {
        numberOfDot = 300;
    } else {
        if (parseInt(inputNumberOfDot.value) < 0) {
            say("number of dot should be no less than 0.");
            inputNumberOfDot.value = "";
        } else {
            numberOfDot = parseInt(inputNumberOfDot.value);
        }
    }

    if (inputDelay.value === "") {
        delay = 100;
    } else {
        if (parseInt(inputDelay.value) < 0) {
            say("Delay should be no less than 0.");
            inputDelay.value = "";
        } else {
            delay = parseInt(inputDelay.value);
        }
    }
}

function showData() {
    document.getElementById("values").innerHTML = `size = ${sideLength}(px)<br>dot = ${numberOfDot}<br>delay = ${delay}(ms)<br>r<sub>n</sub> = ${inCircle}<br>n = ${dotted}<br>π ≒ 4 × r<sub>n</sub> / n = ${dotted === 0 ? "Not defined" : Math.round(4 * inCircle / dotted * 1000) / 1000}`;
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
        isRunning = false;
    } else {
        interval = setInterval(dot, delay);
    }
}

function dot() {
    const positionOfDot: Position = [Math.random(), Math.random()];
    positions.push(positionOfDot);
    context.beginPath();
    context.arc(positionOfDot[0] * sideLength, positionOfDot[1] * sideLength, 0.5, 0, Math.PI * 2);
    context.stroke();
    dotted++;
    if (positionOfDot[0] ** 2 + positionOfDot[1] ** 2 < 1) {
        inCircle++;
    } else {
        outCircle++;
    }
    showData();
    if (dotted >= numberOfDot) {
        isRunning = false;
        clearInterval(interval);
    }
}

function optimizedDot() { // call only one
    for (let i = 0; i < Math.floor(numberOfDot / 1000000); i++) {
        for (let j = 0; j < 1000000; j++) {
            const x = Math.random();
            const y = Math.random();
            dotted++;
            if (x * x + y * y < 1) {
                inCircle++;
            } else {
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
            } else {
                outCircle++;
            }
        }
        showData();
        console.log("Repeated " + dotted + " times.");
    }
}

let saveTimeout: number;
function say(ment: string) {
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