class Piece {
    x; // Position of the current position  of the piece on the board
    y; // Position of the piece on the board
    color; // color of the Tetromino
    shape; // 2D array defining the shape of the Tetromino
    context; // 2D drawing context from the canvas
    typeId; // The identifier for the type of Tetromino

    static bag = []; // static bag shared between all pieces
    static nextBag = []; // Add a second bag for looking ahead

    constructor(context) {
        this.context = context;
        this.spawn(); // when Piece is created, it immediately calls spawn(), which initializes its color, shape, and starting position
    }

    // Function to get a new random piece
    static getNewBag() {
        // Create array with pieces 1-7
        const bag = [1, 2, 3, 4, 5, 6, 7];
        
        for (let i = bag.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [bag[i], bag[j]] = [bag[j], bag[i]];
        }
        return bag;
    }

    static nextPieceFromBag() {
        // If current bag is empty, move pieces from next bag
        if (Piece.bag.length === 0) {
            Piece.bag = Piece.nextBag.length > 0 ? Piece.nextBag : Piece.getNewBag();
            Piece.nextBag = Piece.getNewBag();
        }
        return Piece.bag.shift();
    }

    spawn() {
        this.typeId = Piece.nextPieceFromBag();
        this.color = COLORS[this.typeId];
        this.shape = SHAPES[this.typeId];
        this.setStartingPosition();
        this.y = 0;
    }

    // Function to draw entire piece on the board
    draw() {
        this.context.fillStyle = this.color;
        this.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value > 0) {
                    this.context.fillRect(this.x + x, this.y + y, 1, 1);
                    this.context.strokeStyle = 'rgba(0, 0, 0, 0.5)';
                    this.context.lineWidth = 0.02;
                    this.context.strokeRect(
                        this.x + x + 0.05, 
                        this.y + y + 0.05, 
                        0.9,
                        0.9
                    );
                }
            });
        });
    }

    move(p) {
        this.x = p.x; // p: current position of the piece
        this.y = p.y; // example: p = { x: 3, y: 0 }; meaning piece is at column 3, row 0
        this.shape = p.shape; // p.shape is the shape of the piece
    }

    setStartingPosition() {
        if (this.typeId === 1) {
            this.x = 3;  // I piece - centered (columns 3,4,5,6)
        } else if (this.typeId === 2) {
            this.x = 4;  // O piece - centered (columns 4,5)
        } else {
            this.x = 3;  // All other pieces
        }
    }

    getGhostPiece(board) {
        let ghost = {
            x: this.x,
            y: this.y,
            shape: this.shape
        };
        
        while (board.valid(ghost)) {
            ghost.y++;
        }
        ghost.y--;
        
        return ghost;
    }
}