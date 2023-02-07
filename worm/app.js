"use strict";
const constants = {
    size: 21,
    length: 2,
    delay: 300,
};
ready();
function ready() {
    const head = document.querySelector('head');
    const linkCss = document.createElement('link');
    linkCss.rel = 'stylesheet';
    linkCss.href = 'style.css';
    head.appendChild(linkCss);
    const title = document.querySelector('title');
    title.innerHTML = 'Worm Game';
    const body = document.querySelector('body');
    const wrap = document.createElement('div');
    wrap.className = 'wrap';
    const gameTitle = document.createElement('h1');
    gameTitle.innerHTML = 'Worm Game';
    gameTitle.className = 'game-title';
    const startButton = document.createElement('button');
    startButton.innerHTML = 'Start';
    startButton.className = 'start-button';
    startButton.type = 'button';
    startButton.addEventListener('click', () => gameStart());
    const help = document.createElement('div');
    help.className = 'help';
    help.innerHTML = 'Use arrow key';
    wrap.appendChild(gameTitle);
    wrap.appendChild(startButton);
    wrap.appendChild(help);
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
            },
        };
        const FEED = -1;
        const BLANK = 0;
        let score = constants.length;
        let isPlaying = false;
        const startTime = new Date().getTime();
        const board = get2DSquareArray(constants.size);
        deleteReadyScreen();
        createTable(constants.size);
        generateWorm();
        placeFeed();
        render();
        isPlaying = true;
        let playing = setInterval(() => {
            if (Math.min(...board.reduce((acc, cur) => { return acc.concat(cur); })) > 0) {
                success();
                return;
            }
            go();
            render();
        }, constants.delay);
        window.onkeydown = (e) => {
            console.log(e);
            switch (e.key) {
                case 'ArrowUp':
                    if (judgeDirection(Direction.Up)) {
                        worm.direction = Direction.Up;
                    }
                    break;
                case 'ArrowDown':
                    if (judgeDirection(Direction.Down)) {
                        worm.direction = Direction.Down;
                    }
                    break;
                case 'ArrowLeft':
                    if (judgeDirection(Direction.Left)) {
                        worm.direction = Direction.Left;
                    }
                    break;
                case 'ArrowRight':
                    if (judgeDirection(Direction.Right)) {
                        worm.direction = Direction.Right;
                    }
                    break;
                case ' ':
                    togglePause();
                default:
                    break;
            }
            function judgeDirection(dir) {
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
        };
        function togglePause() {
            const helpPause = document.getElementById('help-pause');
            let word = 'Pause';
            if (isPlaying) {
                word = 'Restart';
                isPlaying = false;
                clearInterval(playing);
                helpPause.innerHTML = `${word} to press space bar.`;
            }
            else {
                word = 'Pause';
                isPlaying = true;
                playing = setInterval(() => {
                    if (Math.min(...board.reduce((acc, cur) => { return acc.concat(cur); })) > 0) {
                        success();
                        return;
                    }
                    go();
                    render();
                }, constants.delay);
                helpPause.innerHTML = `${word} to press space bar.`;
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
            const miniWrap = document.createElement('div');
            miniWrap.className = 'mini-wrap';
            const scoreboard = document.createElement('div');
            scoreboard.className = 'scoreboard';
            scoreboard.innerHTML = `SCORE - ${constants.length}`;
            const helpPause = document.createElement('div');
            helpPause.innerHTML = `Pause to press space bar.`;
            helpPause.id = 'help-pause';
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
            wrap.appendChild(miniWrap);
            const body = document.querySelector('body');
            body.appendChild(wrap);
            body.appendChild(credit);
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
                const tr = document.getElementById('row' + i.toString());
                for (const j in board[0]) {
                    const raw = board[i][j];
                    const element = tr.children[j];
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
        function success() {
            clearInterval(playing);
            document.querySelector('.scoreboard').innerHTML =
                `${document.querySelector('.scoreboard').innerHTML} | Success. (${(new Date().getTime() - startTime) / 1000}s)`;
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
                function gameOver() {
                    clearInterval(playing);
                    document.querySelector('.scoreboard').innerHTML =
                        `${document.querySelector('.scoreboard').innerHTML} | Game Over. (${(new Date().getTime() - startTime) / 1000}s)`;
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
    }
}
