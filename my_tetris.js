const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');
const canvasNext = document.getElementById('next');
const contextNext = canvasNext.getContext('2d');

let board = new Board(context, contextNext);

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