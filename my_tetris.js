const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');
const canvasNext = document.getElementById('next');
const contextNext = canvasNext.getContext('2d');

let accountValues = {
    score: 0,
    level: 0,
    lines: 0
}

function updateAccount(key, value) { // updates the DOM elements with the latest values from the account object
    let element = document.getElementById(key); // account.score = 100 -> comes from the property name of account that was modified.

    if (element) {
        element.textContent = value;
    }
}

let account = new Proxy(accountValues, { // Proxy is a JavaScript object that allows to define custom behavior for operations performed on another object
    set: (target, key, value) => { // set(target, "score", 500)
        target[key] = value; // account.score = 500;
        updateAccount(key, value); // updateAccount("score", 500)
        return true;
    }
});

let requestId;

const moves = {
    [KEY.LEFT]: p => ({ ...p, x: p.x - 1 }), //values (p => {...}) are functions that..
    [KEY.RIGHT]: p => ({ ...p, x: p.x + 1 }), // return a new position for the piece
    [KEY.DOWN]: p => ({ ...p, y: p.y + 1 }), // { ...p } means copy everything from p (so y stays the same)
    [KEY.SPACE]: p => ({ ...p, y: p.y + 1 }), 
    [KEY.UP]: p => board.rotate(p),
};

let board = new Board(context, contextNext);
addEventListener();
initNext();

play();

function initNext() {
    // Calculate size of canvas from constants
    contextNext.canvas.width = 4 * BLOCK_SIZE;
    contextNext.canvas.height = 4 * BLOCK_SIZE;
    contextNext.scale(BLOCK_SIZE, BLOCK_SIZE);
}

function addEventListener() {
    document.addEventListener('keydown', event => {
        if (event.keyCode === KEY.P) {
            pause();
        }
        if (event.keyCode === KEY.ESC) {
            gameOver();
        } else if (moves[event.keyCode]) {
            event.preventDefault();

            let p = moves[event.keyCode](board.piece);

            if (event.keyCode === KEY.SPACE) {
                // Hard drop
                while (board.valid(p)) {
                    account.score += POINTS.HARD_DROP;
                    board.piece.move(p);
                    p = moves[KEY.DOWN](board.piece);
                }
            } else if (board.valid(p)) {
                board.piece.move(p);
                if (event.keyCode === KEY.DOWN) {
                    account.score += POINTS.SOFT_DROP;
                }
            }
        }
    })
}

function resetGame() {
    account.score = 0;
    account.level = 0;
    account.lines = 0;
    board.reset();
    time = { start: performance.now(), elapsed: 0, level: LEVEL[account.level] };
}

function play() {
    resetGame();
    time.start = performance.now();
    // If we have an old game running a cancel it
    if (requestId) {
        cancelAnimationFrame(requestId); // build in function that cancels the animation frame
    }
    animate();
}

function animate(now = 0) {
    time.elapsed = now - time.start;
    if (time.elapsed > time.level) {
        time.start = now;
        if (!board.drop()) {
            gameOver();
            return;
        }
    }
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    board.draw();
    requestId = requestAnimationFrame(animate);
}

function gameOver() {
    cancelAnimationFrame(requestId);
    context.fillStyle = 'black';
    context.fillRect(1, 3, 8, 1.2);
    context.font = '1px Arial';
    context.fillStyle = 'red';
    context.fillText('GAME OVER', 1.8, 4);
}

function pause() {
    if (!requestId) {
        animate();
        return;
    }
    cancelAnimationFrame(requestId);
    requestId = null;
    context.fillStyle = 'black';
    context.fillRect(1, 3, 8, 1.2);
    context.font = '1px Arial';
    context.fillStyle = 'yellow';
    context.fillText('PAUSED', 3, 4);
}

