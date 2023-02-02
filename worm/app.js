"use strict";
const constants = {
    size: 21,
    length: 2,
    delay: 300,
};
const board = get2DSquareArray(constants.size);
const delay = 300;
let playing;
let score = constants.length;
const FEED = -1;
const BLANK = 0;
var Direction;
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
class Position {
    i;
    j;
    constructor(raw) {
        const index = board.flat().findIndex(x => x === raw);
        this.i = Math.floor(index / constants.size);
        this.j = index % constants.size;
    }
}
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
}
function gameStart() {
    deleteReadyScreen();
    createTable(constants.size);
    generateWorm();
    placeFeed();
    render();
    playing = setInterval(() => {
        go();
        render();
    }, constants.delay);
    function deleteReadyScreen() {
        document.querySelector('body').removeChild(document.querySelector('.wrap'));
    }
}
function gameOver() {
    clearInterval(playing);
    document.querySelector('.score').innerHTML = `${document.querySelector('.score').innerHTML} | Game Over.`;
}
function createTable(size) {
    const wrap = document.createElement('div');
    wrap.className = 'ingame-wrap';
    const newTable = document.createElement('table');
    newTable.id = 'table';
    const caption = document.createElement('caption');
    caption.innerHTML = 'Worm Game';
    caption.className = 'ingame-title';
    const credit = document.createElement('span');
    credit.innerHTML = 'made by molla.';
    credit.className = 'credit';
    const scoreboard = document.createElement('span');
    scoreboard.className = 'score';
    scoreboard.innerHTML = `SCORE | ${constants.length}`;
    newTable.appendChild(caption);
    wrap.appendChild(newTable);
    for (let i = 0; i < size; i++) {
        const tr = document.createElement('tr');
        tr.id = 'row' + i.toString();
        newTable.appendChild(tr);
        for (let j = 0; j < size; j++) {
            const td = document.createElement('td');
            td.className = 'col' + j.toString();
            tr.appendChild(td);
        }
    }
    wrap.appendChild(scoreboard);
    wrap.appendChild(document.createElement('br'));
    wrap.appendChild(credit);
    const body = document.querySelector('body');
    body.appendChild(wrap);
}
window.onkeydown = (e) => {
    switch (e.key) {
        case 'ArrowUp':
            if (worm.direction !== Direction.Down) {
                worm.direction = Direction.Up;
            }
            break;
        case 'ArrowDown':
            if (worm.direction !== Direction.Up) {
                worm.direction = Direction.Down;
            }
            break;
        case 'ArrowLeft':
            if (worm.direction !== Direction.Right) {
                worm.direction = Direction.Left;
            }
            break;
        case 'ArrowRight':
            if (worm.direction !== Direction.Left) {
                worm.direction = Direction.Right;
            }
            break;
        default:
            break;
    }
};
function get2DSquareArray(size) {
    return Array.from(Array(size), () => Array.from(Array(size), () => 0));
}
function generateWorm() {
    const center = Math.floor(constants.size / 2);
    for (let i = 0; i < worm.length; i++) {
        board[center + i][center] = worm.length - i;
    }
    worm.position = new Position(worm.length);
}
function placeFeed() {
    let i = getRandomInt(constants.size);
    let j = getRandomInt(constants.size);
    while (board[i][j] > BLANK) {
        i = getRandomInt(constants.size);
        j = getRandomInt(constants.size);
    }
    board[i][j] = FEED;
}
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
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
    }
    function eatFeed(i, j) {
        score++;
        document.querySelector('.score').innerHTML = `SCORE | ${score}`;
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
    }
}
function getPerimeter(idx) {
    return [
        idx.i - 1 < 0 ? null : board[idx.i - 1][idx.j],
        idx.i + 1 > constants.size - 1 ? null : board[idx.i + 1][idx.j],
        idx.j - 1 < 0 ? null : board[idx.i][idx.j - 1],
        idx.j + 1 > constants.size - 1 ? null : board[idx.i][idx.j + 1]
    ];
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
