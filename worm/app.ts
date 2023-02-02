const constants = {
	size: 21,
	length: 2,
	delay: 300,
}
const board = get2DSquareArray(constants.size);
const delay = 300;

let playing: number;
let score = constants.length;

const FEED = -1;
const BLANK = 0;

enum Direction {
	Up,
	Down,
	Left,
	Right,
}

const worm: {
	direction: Direction,
	length: number,
	position: Position,
} = {
	direction: 0,
	length: constants.length,
	position: {
		i: 0,
		j: 0,
	},
}

class Position {
	i: number;
	j: number;
	constructor(raw: number) {
		const index = board.flat().findIndex(x => x === raw);
		this.i = Math.floor(index / constants.size);
		this.j = index % constants.size;
	}
}

type SeqUnion<End extends number, Arr extends Array<never> = [never], Result extends number = 1> =
	Arr['length'] extends End ? 0 | Result | Arr['length'] : SeqUnion<End, [...Arr, never], Result | Arr['length']>;
type Hex = SeqUnion<9> | 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
type AbbrHexCode = `#${Hex}${Hex}${Hex}`;

type NumOrNull = null | number;
type Perimeter = [NumOrNull, NumOrNull, NumOrNull, NumOrNull];


ready();
function ready() {
    const head = document.querySelector('head') as HTMLHeadElement;
    const linkCss = document.createElement('link');
    linkCss.rel = 'stylesheet';
    linkCss.href = 'style.css';
    head.appendChild(linkCss);

    const title = document.querySelector('title') as HTMLTitleElement;
    title.innerHTML = 'Worm Game';

    const body = document.querySelector('body') as HTMLBodyElement;

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
    help.innerHTML = 'Use arrow key'

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
        const body = document.querySelector('body') as HTMLBodyElement;
        body.removeChild(document.querySelector('.wrap') as HTMLDivElement);
	}
}

function gameOver() {
	clearInterval(playing);
}

function createTable(size: number): void {
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

    const body = document.querySelector('body') as HTMLBodyElement;
    body.appendChild(wrap);
}

window.onkeydown = (e: KeyboardEvent) => {
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
}

function get2DSquareArray(size: number): number[][] {
    return Array.from(Array(size), () => Array.from(Array(size), () => 0));
}

function generateWorm() {
    const center = Math.floor(constants.size / 2);
    for (let i = 0; i < worm.length; i++) {
        board[center + i][center] = worm.length - i;
    }

    worm.position = new Position(worm.length);
}


function placeFeed(): void {
    let i = getRandomInt(constants.size);
    let j = getRandomInt(constants.size);
    while (board[i][j] > BLANK) {
        i = getRandomInt(constants.size);
        j = getRandomInt(constants.size);
    }
    board[i][j] = FEED;
}

function getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
}

function go() {
    lead(new Position(worm.length));

    function lead(pos: Position) {
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

    function judge(x: -1 | 0 | 1, y: -1 | 0 | 1, pos:Position) {
        const i = pos.i + x;
        const j = pos.j + y;
        if (i < 0 || i > constants.size - 1 || j < 0 || j > constants.size - 1) {
            gameOver();
        } else {
            const raw = board[i][j];
            if (raw > BLANK) { 
                gameOver();
            } else if (raw === FEED) {
				eatFeed(i, j);
            } else {
                board[i][j] = worm.length;
                follow();
            }
        }
    }

	function eatFeed(i: number, j: number) {
        score++;
        (document.querySelector('.score') as HTMLSpanElement).innerHTML = `SCORE | ${score}`;
		board[i][j] = ++worm.length;
		replaceHead(worm.direction);
		placeFeed();
	}

    function replaceHead(dir:Direction) {
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

function getPerimeter(idx: Position): Perimeter {
    return [
        idx.i - 1 < 0 ? null : board[idx.i - 1][idx.j],
        idx.i + 1 > constants.size - 1 ? null : board[idx.i + 1][idx.j],
        idx.j - 1 < 0 ? null : board[idx.i][idx.j - 1],
        idx.j + 1 > constants.size - 1 ? null : board[idx.i][idx.j + 1]
    ];
}

function render() {
    for (const i in board) {
        const tr = document.getElementById('row' + i.toString()) as HTMLTableRowElement;
        for (const j in board[0]) {
            const raw = board[i][j]
            const element = tr.children[j] as HTMLTableCellElement
            let color: AbbrHexCode;
            
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

                default:           // body
                    color = '#8D4';
                    break;
                    
            }

            element.style.backgroundColor = color;
        }
    }
}