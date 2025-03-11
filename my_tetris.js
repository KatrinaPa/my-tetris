const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');

// Set canvas size
canvas.width = COLUMNS * BLOCK_SIZE; // 10 * 30 = 300px
canvas.height = ROWS * BLOCK_SIZE; // 20 * 30 = 600px

// Scale blocks if no BLOCK_SIZE into draw():
context.scale(BLOCK_SIZE, BLOCK_SIZE); //context.scale(30, 30) means that each unit in the drawing functions (1) is now 30 pixels on the screen

let board = new Board();

function play() {
    board.reset();
    let piece = new Piece(context);

    // Draw the piece (whatever it is called):
    piece.draw();
    board.piece = piece;
    
    // Draw a square:
    //piece.drawSquare(4, 5, "yellow");
}

const moves = {
    [KEY.LEFT]: p => ({ ...p, x: p.x - 1 }), //values (p => {...}) are functions that..
    [KEY.RIGHT]: p => ({ ...p, x: p.x + 1 }), // return a new position for the piece
    [KEY.DOWN]: p => ({ ...p, y: p.y + 1 }), // { ...p } means copy everything from p (so y stays the same)
    [KEY.SPACE]: p => ({ ...p, y: p.y + 1 }), 
    [KEY.UP]: p => board.rotate(p),
};

document.addEventListener('keydown', event => {
    if (moves[event.keyCode]) {
        event.preventDefault();

        let p = moves[event.keyCode](board.piece);

        if (event.keyCode === KEY.SPACE) {
            // Hard drop
            while (board.valid(p)) {
                board.piece.move(p);
                p = moves[KEY.DOWN](board.piece);
            }
        } else if (board.valid(p)) {
            board.piece.move(p);
        }

        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        board.piece.draw();
    }
})