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

// Proxy is used to automatically update the DOM when these values change, ensuring that the user interface is synchronized with the current game state.
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

// At the top of my_tetris.js, after your const declarations
sounds.music.load(); // Preload the music

function initNext() {
    // Calculate size of canvas from constants
    contextNext.canvas.width = 4 * BLOCK_SIZE;
    contextNext.canvas.height = 4 * BLOCK_SIZE;
    contextNext.scale(BLOCK_SIZE, BLOCK_SIZE);
}

function addEventListener() {
    document.addEventListener('keydown', event => {
        // Add Enter key to start game
        if (event.keyCode === KEY.ENTER) {
            event.preventDefault();
            play();
            return;
        }
        
        // Update pause controls
        if (event.keyCode === KEY.P) {
            event.preventDefault();
            pause();
        } else if (event.keyCode === KEY.ESC) {
            event.preventDefault();
            gameOver();
        } else if (event.keyCode === KEY.C) {
            // Hold piece
            board.holdPiece();
        } else if (event.keyCode === KEY.Z) {  
            event.preventDefault();
            let p = board.rotateCCW(board.piece);
            if (board.valid(p)) {
                board.piece.move(p);
            }
        } else if (event.keyCode === KEY.X) {  
            event.preventDefault();
            let p = board.rotate(board.piece);
            if (board.valid(p)) {
                board.piece.move(p);
            }
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
    });

    // Add this after your other event listeners
    document.querySelector('.close-button').addEventListener('click', function() {
        const notice = document.querySelector('.copyright-notice');
        notice.classList.add('hidden');
    });

    // Add this after your other event listeners in addEventListener()
    const soundToggle = document.querySelector('.sound-toggle');
    let isMuted = false;

    soundToggle.addEventListener('click', function() {
        isMuted = !isMuted;
        
        // No need to change the icon text, just toggle the muted class
        this.classList.toggle('muted');
        
        // Mute/unmute all sounds
        sounds.music.muted = isMuted;
        sounds.gameover.muted = isMuted;
        sounds.clearLine.muted = isMuted;
        sounds.nextLevel.muted = isMuted;
    });

    // Add touch controls for mobile
    document.querySelectorAll('.controls-guide kbd').forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            const key = button.textContent;
            
            // Map button text to key codes
            const keyMap = {
                '↑': KEY.UP,
                '←': KEY.LEFT,
                '→': KEY.RIGHT,
                '↓': KEY.DOWN,
                'Space': KEY.SPACE,
                'Z': KEY.Z,
                'X': KEY.X,
                'C': KEY.C,
                'P': KEY.P,
                'Esc': KEY.ESC
            };

            if (keyMap[key]) {
                // Create and dispatch keyboard event
                const keyEvent = new KeyboardEvent('keydown', {
                    keyCode: keyMap[key]
                });
                document.dispatchEvent(keyEvent);
            }
        });
    });
}

function resetGame() {
    account.score = 0;
    account.level = 0;
    account.lines = 0;
    board.reset();
    time = { start: performance.now(), elapsed: 0, level: LEVEL[account.level] };
}

function play() {
    // Remove game over message if it exists
    const gameOverMsg = document.querySelector('.game-over-message');
    if (gameOverMsg) {
        gameOverMsg.remove();
    }
    
    resetGame();
    time.start = performance.now();
    
    // If we have an old game running a cancel it
    if (requestId) {
        cancelAnimationFrame(requestId);
    }
    
    // Start music from beginning with lower volume
    sounds.music.currentTime = 0;
    sounds.music.volume = 0.06; // Set volume to 2% here
    sounds.music.play();
    
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
    
    // Stop background music and play game over sound
    sounds.music.pause();
    sounds.gameover.play();
    
    context.fillStyle = 'rgba(0, 0, 0, 0.5)';
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    
    const gameOverDiv = document.createElement('div');
    gameOverDiv.className = 'game-over-message';
    gameOverDiv.textContent = 'GAME OVER';
    document.body.appendChild(gameOverDiv);
}

function pause() {
    if (!requestId) {
        animate();
        // Remove pause message if exists
        const pauseMsg = document.querySelector('.pause-message');
        if (pauseMsg) pauseMsg.remove();
        sounds.music.play(); // Resume music
        return;
    }
    
    cancelAnimationFrame(requestId);
    requestId = null;
    sounds.music.pause(); // Pause music
    
    const pauseDiv = document.createElement('div');
    pauseDiv.className = 'pause-message';
    pauseDiv.textContent = 'PAUSED';
    document.body.appendChild(pauseDiv);
}

