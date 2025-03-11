class Piece {
    constructor(context) {
        this.context = context;
        this.color = 'blue';
        this.shape = [
            [2, 0, 0],
            [2, 2, 2],
            [0, 0, 0]
        ];
        this.x = 3;
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