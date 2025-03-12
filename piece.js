class Piece {
    x; // Position of the piece on the board
    y; // Position of the piece on the board
    color; // color of the Tetromino
    shape; // 2D array defining the shape of the Tetromino
    context; // 2D drawing context from the canvas
    typeId; // The identifier for the type of Tetromino

    constructor(context) {
        this.context = context;
        this.spawn(); // when Piece is created, it immediately calls spawn(), which initializes its color, shape, and starting position
    }

    spawn() {
        this.typeId = this.randomizeTetrominoType(COLORS.length - 1); // COLORS.length - 1 = 7 (since COLORS.length = 8).

        this.color = COLORS[this.typeId];
        this.shape = SHAPES[this.typeId];
        // Starting position.
        this.x = 0;
        this.y = 0;
    }

    // Function to draw entire piece on the board
    draw() {
        this.context.fillStyle = this.color;
        this.shape.forEach((row, y) => { // iterates over each row in array (row represents one row, y is its index).
            row.forEach((value, x) => { // iterates over each cell in row (value is number, x is its index)
                if (value > 0) {
                    this.context.fillRect(this.x + x, this.y + y, 1, 1); // this.context.fillRect((this.x + x) * BLOCK_SIZE, (this.y + y) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                }
            });
        });
    }

    move(p) {
        this.x = p.x; // p: current position of the piece
        this.y = p.y; // example: p = { x: 3, y: 0 }; meaning piece is at column 3, row 0
        this.shape = p.shape; // p.shape is the shape of the piece
    }

    randomizeTetrominoType(nbrOfTypes) { // in our case - 7 types, because we have 7 different colors
        return Math.floor(Math.random() * nbrOfTypes + 1); // + 1 because Math.floor() rounds it down
    }

    setStartingPosition() {
        this.x = this.typeId === 4 ? 4 : 3; // if the piece is a square (typeId = 4), it starts at column 4, otherwise it starts at column 3
    }




    // UNUSEFUL just examples Function to draw some pieces at
    drawSquare(x, y, color) {
        this.context.beginPath();
        this.context.arc(5, 12, 5, 0, Math.PI * 2);  // (x, y, radius, startAngle, endAngle)
        this.context.fill();  // Fill the circle


        this.context.fillStyle = color;
        this.context.fillRect(x, y, 1, 1);  // Fill with color
        this.context.strokeStyle = "red";
        this.context.lineWidth = 0.03;  // Set stroke width to 1px
        this.context.strokeRect(x, y, 1, 1);  // Stroke with thinner width
    }
}