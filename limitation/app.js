const boardWidth = 7;
const boardHeight = 7;
const board = Array.from(Array(boardHeight), () => Array.from(Array(boardWidth), () => 0));
const cellSize = 50;
const m = cellSize / 2; // margin
const padding = cellSize;
const boardElement = document.getElementById("board");
const ctx = boardElement.getContext("2d");
initBoard();
/**
 * board initializer - resizing, clearBoard()
 */
function initBoard() {
    boardElement.style.width = (boardWidth * cellSize + (padding * 2)).toString();
    boardElement.style.height = (boardHeight * cellSize + (padding * 2)).toString();
    boardElement.width = boardWidth * cellSize + (padding * 2);
    boardElement.height = boardHeight * cellSize + (padding * 2);
    clearBoard();
}
function clearBoard() {
    ctx.clearRect(0, 0, boardElement.width, boardElement.height);
}
function limit(data) {
    const musicData = data;
    if (musicData.length === 0) {
        return;
    }
    else {
        let animation;
        const w = boardElement.width;
        const h = boardElement.height;
        const thisData = musicData.shift();
        const x = thisData[0] * cellSize + padding;
        const y = thisData[1] * cellSize + padding;
        const delay = thisData[2];
        /** Independent variable */
        let p = 0;
        const startTime = new Date().getTime();
        let nowTime = startTime;
        clearBoard();
        animate();
        function animate() {
            nowTime = new Date().getTime();
            p = Math.round((nowTime - startTime) / delay * 1000000) / 1000000;
            if (p >= 1) {
                cancelAnimationFrame(animation);
                showEnd(w, h, x, y);
                return limit(musicData);
            }
            else {
                show(w, h, x, y, calcRate(p));
                animation = requestAnimationFrame(animate);
            }
            /**
             * Cubic function for calculating 'r' in show()
             */
            function calcRate(x) {
                return ((x - 1) * (x - 1) * (x - 1)) + 1;
            }
        }
    }
}
/**
 * render in canvas
 * @param w Width
 * @param h Height
 * @param x Position of X
 * @param y Position of Y
 * @param r Rate
 */
function show(w, h, x, y, r) {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(r * x, 0);
    ctx.lineTo(r * x, r * y - m);
    ctx.lineTo(r * x - m, r * y);
    ctx.lineTo(0, r * y);
    ctx.lineTo(0, 0);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(w, 0);
    ctx.lineTo(w - (w - x) * r, 0);
    ctx.lineTo(w - (w - x) * r, y * r - m);
    ctx.lineTo(w - ((w - x) * r - m), y * r);
    ctx.lineTo(w, y * r);
    ctx.lineTo(w, 0);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, h);
    ctx.lineTo(0, h - (h - y) * r);
    ctx.lineTo(x * r - m, h - (h - y) * r);
    ctx.lineTo(x * r, h - ((h - y) * r - m));
    ctx.lineTo(x * r, h);
    ctx.lineTo(0, h);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(w, h);
    ctx.lineTo(w - (w - x) * r, h);
    ctx.lineTo(w - (w - x) * r, h - ((h - y) * r - m));
    ctx.lineTo(w - ((w - x) * r - m), h - (h - y) * r);
    ctx.lineTo(w, h - (h - y) * r);
    ctx.lineTo(w, h);
    ctx.fill();
    ctx.stroke();
}
function showEnd(w, h, x, y) {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(x, 0);
    ctx.lineTo(x, y - m);
    ctx.lineTo(x - m, y);
    ctx.lineTo(0, y);
    ctx.lineTo(0, 0);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(w, 0);
    ctx.lineTo(w - (w - x), 0);
    ctx.lineTo(w - (w - x), y - m);
    ctx.lineTo(w - ((w - x) - m), y);
    ctx.lineTo(w, y);
    ctx.lineTo(w, 0);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, h);
    ctx.lineTo(0, h - (h - y));
    ctx.lineTo(x - m, h - (h - y));
    ctx.lineTo(x, h - ((h - y) - m));
    ctx.lineTo(x, h);
    ctx.lineTo(0, h);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(w, h);
    ctx.lineTo(w - (w - x), h);
    ctx.lineTo(w - (w - x), h - ((h - y) - m));
    ctx.lineTo(w - ((w - x) - m), h - (h - y));
    ctx.lineTo(w, h - (h - y));
    ctx.lineTo(w, h);
    ctx.fill();
    ctx.stroke();
}
