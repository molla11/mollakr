"use strict";
const constants = {
    size: Mobile() ? 15 : 21,
    length: 2,
    delay: 300,
    faster: 4,
};
ready();
function ready() {
    const html = document.querySelector('html');
    html.translate = false;
    const head = document.querySelector('head');
    const linkCss = document.createElement('link');
    linkCss.rel = 'stylesheet';
    linkCss.href = 'style.css';
    const notranslate = document.createElement('meta');
    notranslate.name = 'google';
    notranslate.content = 'notranslate';
    head.appendChild(notranslate);
    head.appendChild(linkCss);
    const title = document.querySelector('title');
    title.innerHTML = 'Worm Game';
    const body = document.querySelector('body');
    const wrap = document.createElement('div');
    wrap.className = 'wrap';
    const gameTitle = document.createElement('h1');
    gameTitle.innerHTML = 'Worm Game';
    gameTitle.className = 'game-title';
    let isStarted = false;
    const startButton = document.createElement('button');
    startButton.innerHTML = 'Start';
    startButton.className = 'start-button';
    startButton.type = 'button';
    startButton.addEventListener('click', isCanStart);
    window.onkeydown = (e) => {
        if (e.code === 'Enter') {
            isCanStart();
        }
    };
    function isCanStart() {
        if (constants.size <= 1) {
            alert('board is too small!\nThis page will be refrashed.');
            location.reload();
        }
        else if (constants.length > Math.ceil(constants.size + 1 / 2)) {
            alert('Your greed is too much.\nThis page will be refrashed.');
            location.reload();
        }
        else if (constants.delay <= 0 || constants.size > 100 || constants.length < 2) {
            alert('One or more property of the constants are strange.\nThis page will be refrashed.');
            location.reload();
        }
        else {
            if (isStarted === false) {
                gameStart();
            }
        }
    }
    wrap.appendChild(gameTitle);
    wrap.appendChild(startButton);
    if (!Mobile()) {
        const help = document.createElement('div');
        help.className = 'help';
        help.innerHTML = 'Use arrow key';
        wrap.appendChild(help);
    }
    // wrap.appendChild(document.createElement("br"));
    // wrap.appendChild(document.createElement("hr"));
    else {
        const help2 = document.createElement('div');
        help2.className = 'help';
        help2.innerHTML = 'Pause and boost functions are not supported on mobile.';
        wrap.appendChild(help2);
    }
    body.appendChild(wrap);
    function gameStart() {
        class Position {
            i;
            j;
            constructor(raw) {
                const index = board.flat().findIndex(x => x === raw);
                this.i = Math.floor(index / constants.size);
                this.j = index % constants.size;
            }
        }
        let Direction;
        (function (Direction) {
            Direction[Direction["Up"] = 0] = "Up";
            Direction[Direction["Down"] = 1] = "Down";
            Direction[Direction["Left"] = 2] = "Left";
            Direction[Direction["Right"] = 3] = "Right";
        })(Direction || (Direction = {}));
        const worm = {
            direction: 0,
            length: constants.length,
            position: {
                i: 0,
                j: 0,
            }
        };
        const FEED = -1;
        const BLANK = 0;
        let score = constants.length;
        isStarted = true;
        let isPlaying = false;
        let isEnd = false;
        let playing;
        let isPaused;
        const startTime = new Date().getTime();
        const board = get2DSquareArray(constants.size);
        deleteReadyScreen();
        createTable(constants.size);
        generateWorm();
        placeFeed();
        render();
        setTimeout(startGame, 500);
        let booster;
        let isBoosting = false;
        window.onkeydown = (e) => {
            if (!isEnd) {
                switch (e.code) {
                    case 'ArrowUp':
                        if (isAvailableToChange(Direction.Up)) {
                            worm.direction = Direction.Up;
                        }
                        break;
                    case 'ArrowDown':
                        if (isAvailableToChange(Direction.Down)) {
                            worm.direction = Direction.Down;
                        }
                        break;
                    case 'ArrowLeft':
                        if (isAvailableToChange(Direction.Left)) {
                            worm.direction = Direction.Left;
                        }
                        break;
                    case 'ArrowRight':
                        if (isAvailableToChange(Direction.Right)) {
                            worm.direction = Direction.Right;
                        }
                        break;
                    case 'Space':
                        togglePause();
                        break;
                    case 'ShiftLeft':
                        if (!isBoosting && !isPaused) {
                            go();
                            render();
                            boost();
                        }
                        break;
                    default:
                        break;
                }
            }
        };
        window.onkeyup = (e) => {
            if (isBoosting) {
                switch (e.code) {
                    case 'ShiftLeft':
                        unBoost();
                        if (!isEnd && !isPaused) {
                            startGame();
                        }
                        break;
                    default:
                        break;
                }
            }
        };
        function isAvailableToChange(dir) {
            const pos = new Position(worm.length);
            switch (dir) {
                case Direction.Up:
                    return (pos.i === 0) || !(board[pos.i - 1][pos.j] === worm.length - 1);
                case Direction.Down:
                    return (pos.i === constants.size - 1) || !(board[pos.i + 1][pos.j] === worm.length - 1);
                case Direction.Left:
                    return (pos.j === 0) || !(board[pos.i][pos.j - 1] === worm.length - 1);
                case Direction.Right:
                    return (pos.j === constants.size - 1) || !(board[pos.i][pos.j + 1] === worm.length - 1);
            }
        }
        function togglePause() {
            if (!isEnd && !Mobile()) {
                const helpPause = document.getElementById('help-pause');
                let word = 'Pause';
                if (isPlaying) {
                    word = 'Restart';
                    isPlaying = false;
                    isPaused = true;
                    stopGame();
                    unBoost();
                    helpPause.innerHTML = `${word} | Spacebar`;
                    helpPause.style.color = '#000';
                }
                else {
                    word = 'Pause';
                    isPlaying = true;
                    isPaused = false;
                    startGame();
                    unBoost();
                    helpPause.innerHTML = `${word} | Spacebar`;
                    helpPause.style.color = '#777';
                }
            }
        }
        function get2DSquareArray(size) {
            return Array.from(Array(size), () => Array.from(Array(size), () => 0));
        }
        function deleteReadyScreen() {
            document.querySelector('body').removeChild(document.querySelector('.wrap'));
        }
        function createTable(size) {
            const wrap = document.createElement('div');
            wrap.className = 'ingame-wrap';
            const table = document.createElement('table');
            table.id = 'table';
            const TD_WIDTH = 17;
            table.style.width = `${(TD_WIDTH + 2) * constants.size + 2 * (constants.size + 1)}`;
            const caption = document.createElement('div');
            caption.innerHTML = 'Worm Game';
            caption.className = 'ingame-title';
            const credit = document.createElement('div');
            credit.innerHTML = 'made by molla.';
            credit.className = 'credit';
            const credit2 = document.createElement('div');
            credit2.innerHTML = 'made by 잌';
            credit2.className = 'credit2';
            const miniWrap = document.createElement('div');
            miniWrap.className = 'mini-wrap';
            const scoreboard = document.createElement('div');
            scoreboard.className = 'scoreboard';
            scoreboard.innerHTML = `Score | ${constants.length}`;
            const helpPause = document.createElement('div');
            helpPause.innerHTML = `Pause | Spacebar`;
            helpPause.id = 'help-pause';
            const helpBoost = document.createElement('div');
            helpBoost.innerHTML = `Boost | Left Shift key`;
            helpBoost.id = 'help-boost';
            if (Mobile()) {
                helpPause.style.display = 'none';
                helpBoost.style.display = 'none';
            }
            for (let i = 0; i < size; i++) {
                const tr = document.createElement('tr');
                tr.id = 'row' + i.toString();
                table.appendChild(tr);
                for (let j = 0; j < size; j++) {
                    const td = document.createElement('td');
                    td.className = 'col' + j.toString();
                    td.style.width = `${TD_WIDTH}px`;
                    td.style.height = td.style.width;
                    tr.appendChild(td);
                }
            }
            miniWrap.appendChild(caption);
            miniWrap.appendChild(table);
            miniWrap.appendChild(scoreboard);
            miniWrap.appendChild(helpPause);
            miniWrap.appendChild(helpBoost);
            wrap.appendChild(miniWrap);
            const body = document.querySelector('body');
            body.appendChild(wrap);
            body.appendChild(credit);
            body.appendChild(credit2);
            let element;
            function getDirectionId(str) {
                if (str === "up") {
                    return 0;
                }
                else if (str === "down") {
                    return 1;
                }
                else if (str === "left") {
                    return 2;
                }
                else {
                    return 3;
                }
            }
            if (Mobile()) {
                makeTouchPad();
            }
            function makeTouchPad() {
                const wrapOfTouchPad = document.createElement("div");
                wrapOfTouchPad.id = "wrap-touchpad";
                body.appendChild(wrapOfTouchPad);
                const directions = ["up", "down", "left", "right"];
                for (const dir of directions) {
                    const childElement = document.createElement("div");
                    childElement.id = "touchpad-" + dir;
                    childElement.className = "touchpad";
                    childElement.innerHTML = dir;
                    document.getElementById("wrap-touchpad").appendChild(childElement);
                }
                const touchpad = {
                    up: document.getElementById("touchpad-up"),
                    down: document.getElementById("touchpad-down"),
                    left: document.getElementById("touchpad-left"),
                    right: document.getElementById("touchpad-right")
                };
                for (element in touchpad) {
                    const directionId = getDirectionId(element);
                    const thisElement = touchpad[element];
                    thisElement.addEventListener("click", () => {
                        if (isAvailableToChange(directionId)) {
                            worm.direction = directionId;
                            let timeout = 0;
                            clearInterval(timeout);
                            thisElement.style.backgroundColor = "#888";
                            timeout = setTimeout(() => {
                                thisElement.style.backgroundColor = "#333";
                            }, 200);
                        }
                    });
                }
            }
        }
        function generateWorm() {
            const center = Math.floor((constants.size - 1) / 2);
            for (let i = 0; i < worm.length; i++) {
                board[center + i][center] = worm.length - i;
            }
            worm.position = new Position(worm.length);
        }
        function placeFeed() {
            if (constants.size ** 2 === score) {
                return;
            }
            let i = getRandomInt(constants.size);
            let j = getRandomInt(constants.size);
            while (board[i][j] > BLANK) {
                i = getRandomInt(constants.size);
                j = getRandomInt(constants.size);
            }
            board[i][j] = FEED;
            function getRandomInt(max) {
                return Math.floor(Math.random() * max);
            }
        }
        function render() {
            for (const i in board) {
                const tr = document.getElementById('row' + i);
                for (const j in board[0]) {
                    const raw = board[i][j];
                    const element = tr.children[parseInt(j)];
                    let color;
                    switch (raw) {
                        case BLANK:
                            color = '#CCC';
                            break;
                        case FEED:
                            color = '#E00';
                            break;
                        case worm.length: // head
                            color = '#5A1';
                            break;
                        default: // body
                            color = '#8D4';
                            break;
                    }
                    element.style.backgroundColor = color;
                }
            }
        }
        function go() {
            lead(new Position(worm.length));
            function lead(pos) {
                switch (worm.direction) {
                    case Direction.Up:
                        judge(-1, 0, pos);
                        break;
                    case Direction.Down:
                        judge(1, 0, pos);
                        break;
                    case Direction.Left:
                        judge(0, -1, pos);
                        break;
                    case Direction.Right:
                        judge(0, 1, pos);
                        break;
                }
            }
            function judge(x, y, pos) {
                if (isSuccess()) {
                    success();
                }
                else {
                    const i = pos.i + x;
                    const j = pos.j + y;
                    if (i < 0 || i > constants.size - 1 || j < 0 || j > constants.size - 1) {
                        gameOver();
                    }
                    else {
                        const raw = board[i][j];
                        if (raw > BLANK) {
                            gameOver();
                        }
                        else if (raw === FEED) {
                            eatFeed(i, j);
                        }
                        else {
                            board[i][j] = worm.length;
                            follow();
                        }
                    }
                }
                function isSuccess() {
                    if (Math.min(...board.reduce((acc, cur) => { return acc.concat(cur); })) > 0) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                function success() {
                    document.querySelector('.scoreboard').innerHTML =
                        `${document.querySelector('.scoreboard').innerHTML} | Success. (${(new Date().getTime() - startTime) / 1000}s)`;
                    end();
                }
                function gameOver() {
                    document.querySelector('.scoreboard').innerHTML =
                        `${document.querySelector('.scoreboard').innerHTML} | Game Over. (${(new Date().getTime() - startTime) / 1000}s)`;
                    end();
                }
                function end() {
                    isEnd = true;
                    isPlaying = false;
                    stopGame();
                    unBoost();
                    const helpPause = document.getElementById('help-pause');
                    helpPause.innerHTML = 'Refresh this page to retry';
                    const helpBoost = document.getElementById('help-boost');
                    helpBoost.innerHTML = '';
                }
            }
            function eatFeed(i, j) {
                score++;
                document.querySelector('.scoreboard').innerHTML = `Score | ${score}`;
                board[i][j] = ++worm.length;
                replaceHead(worm.direction);
                placeFeed();
            }
            function replaceHead(dir) {
                switch (dir) {
                    case Direction.Up:
                        worm.position.i--;
                        break;
                    case Direction.Down:
                        worm.position.i++;
                        break;
                    case Direction.Left:
                        worm.position.j--;
                        break;
                    case Direction.Right:
                        worm.position.j++;
                        break;
                }
            }
            function follow(i = new Position(1).i, j = new Position(1).j, now = 1) {
                if (worm.length === 1) {
                    return;
                }
                const per = getPerimeter({ i: i, j: j });
                switch (now + 1) {
                    case per[Direction.Up]:
                        board[i][j]--;
                        follow(i - 1, j, now + 1);
                        break;
                    case per[Direction.Down]:
                        board[i][j]--;
                        follow(i + 1, j, now + 1);
                        break;
                    case per[Direction.Left]:
                        board[i][j]--;
                        follow(i, j - 1, now + 1);
                        break;
                    case per[Direction.Right]:
                        board[i][j]--;
                        follow(i, j + 1, now + 1);
                        break;
                    default:
                        board[i][j]--;
                        return;
                }
                function getPerimeter(idx) {
                    return [
                        idx.i - 1 < 0 ? null : board[idx.i - 1][idx.j],
                        idx.i + 1 > constants.size - 1 ? null : board[idx.i + 1][idx.j],
                        idx.j - 1 < 0 ? null : board[idx.i][idx.j - 1],
                        idx.j + 1 > constants.size - 1 ? null : board[idx.i][idx.j + 1]
                    ];
                }
            }
        }
        function boost() {
            isBoosting = true;
            booster = setInterval(() => {
                go();
                render();
            }, Math.floor(constants.delay / constants.faster));
            stopGame();
            const helpBoost = document.getElementById('help-boost');
            helpBoost.style.color = '#E00';
            helpBoost.innerHTML = 'Boosting...';
        }
        function unBoost() {
            isBoosting = false;
            clearInterval(booster);
            const helpBoost = document.getElementById('help-boost');
            helpBoost.style.color = '#A7A';
            helpBoost.innerHTML = 'Boost | Left Shift key';
        }
        function startGame() {
            isPlaying = true;
            playing = setInterval(() => {
                go();
                render();
            }, constants.delay);
        }
        function stopGame() {
            clearInterval(playing);
        }
    }
}
function Mobile() { return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent); }
