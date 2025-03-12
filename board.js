class Board {

    context;
    contextNext; // will help us draw the next piece coming
    grid; // 2D array representing the board
    piece; // The current piece in play
    next; // The next piece to play
    requestId; // Used to cancel the game, to pause it
    time; // Used to keep track of time

    constructor(context, contextNext) {
        this.context = context;
        this.contextNext = contextNext;
        this.init(); // Initializes the board
    }

    init() {
        // Set canvas size
        this.context.canvas.width = COLUMNS * BLOCK_SIZE; // 10 * 30 = 300px
        this.context.canvas.height = ROWS * BLOCK_SIZE; // 20 * 30 = 600px
        this.context.scale(BLOCK_SIZE, BLOCK_SIZE); //context.scale(30, 30) means that each unit in the drawing functions (1) is now 30 pixels on the screen
    }

    reset() {
        this.grid = this.getEmptyGrid(); //Resets the board by making it empty
        this.piece = new Piece(this.context); //Creates a new piece
        this.piece.setStartingPosition(); //Sets the starting position of the piece
        this.getNewPiece(); //Gets a new piece
    }

    getNewPiece() {
        this.next = new Piece(this.contextNext); //Creates a new piece
        this.contextNext.clearRect(0, 0, this.contextNext.canvas.width, this.contextNext.canvas.height); //Clears the contextNext canvas
        this.next.draw(); //Draws the next piece
    }

    draw() {
        this.piece.draw(); //Draws the current piece
        this.drawBoard(); //draws the game board (grid) onto the canvas
    }

    drop() {
        let p = moves[KEY.DOWN](this.piece); //Moves the piece down
        if (this.valid(p)) { //If the move is valid
            this.piece.move(p); //Move the piece
        } else {
            this.freeze(); //Freeze the piece
            this.clearLines(); //Clears lines - removing full rows from the Tetris board
            if (this.piece.y === 0) { //If the piece is at the top of the board
                return false // Game over
            }
            this.piece = this.next; //Set current piece to next upcoming piece
            this.piece.context = this.context; // new piece gets the same drawing context as the previous piece
            this.piece.setStartingPosition(); //Set the starting position of the piece
            this.getNewPiece(); //Get new random piece is generated and stored as this.next, waiting for its turn
        }
        return true; // If no game over happened, return true, meaning the game continues
    }

    clearLines() { 
        let lines = 0; //initialized to count how many full rows are cleared
        this.grid.forEach((row, y) => { //Iterates over each row in the grid
            if (row.every(value => value > 0)) { //If all the values in the row are greater than 0
                this.grid.splice(y, 1); // removes one row (1) at index y from the grid
                this.grid.unshift(Array(COLUMNS).fill(0)); //Add a new row at the top
                lines++; //Increase the number of lines if line is cleared
            }
        });
        if (lines > 0) { //This runs only if at least one row was cleared
            account.score += this.getLinesClearedPoints(lines); //Increase the score, points earned for clearing lines
            account.lines += lines; //Updates the total number of cleared lines
            
            if (account.lines >= LINES_PER_LEVEL) { //If the number of lines is greater than or equal to LINES_PER_LEVEL
                account.level++; //Increase the level
                account.lines -= LINES_PER_LEVEL; //Decrease the number of lines
                time.level = LEVEL[account.level]; //Set the level time, speed is updated based on the level
            } // 'account' Tracks score, lines, and level. 'time' Controls game speed
        }
    }

    freeze() {
        this.piece.shape.forEach((row, y) => { //Iterates over each row each piece's shape
            row.forEach((value, x) => { //Iterates over value in the row
                if (value > 0) {
                    this.grid[y + this.piece.y][x + this.piece.x] = this.piece.typeId; //Add the piece to the grid
                }
            });
        });
    }

    drawBoard() {
        this.grid.forEach((row, y) => { //Iterates over each row in the grid
            row.forEach((value, x) => { //Iterates over each value in the row
                if (value > 0) { // If the cell is occupied (not empty)
                    this.context.fillStyle = COLORS[value]; //Set the color of the block
                    this.context.fillRect(x, y, 1, 1); //Draw the block
                }
            });
        });
    }

    getEmptyGrid() { //Creates an empty 2D array (a grid) for the Tetris board
        let board = [];
        for (let i = 0; i < ROWS; i++) {
            board.push(new Array(COLUMNS).fill(0));
        }
        return board;
    }

    valid(p) {
        return p.shape.every((row, dy) => { // "d" Stands for "Delta" meaning "change in value
            return row.every((value, dx) => { 
                let x = p.x + dx; // dx is the column index
                let y = p.y + dy; // dy is the row index
                return (
                    value === 0 || (this.insideWalls(x) && this.aboveFloor(y) && this.notOccupied(x, y))
                );
            });
        });
    }   

    insideWalls(x) {
        return x >= 0 && x < COLUMNS;
    }

    aboveFloor(y) {
        return y <= ROWS;
    }

    notOccupied(x, y) {
        return this.grid[y] && this.grid[y][x] === 0;
    }

    rotate(p) {
        let clone_p = JSON.parse(JSON.stringify(p)); // Deep copy; creates a new object with the same structure and values as p.
        // Transpose matrix
        for (let y = 0; y < p.shape.length; ++y) {
            for (let x = 0; x < y; ++x) {
                [p.shape[x][y], p.shape[y][x]] = [p.shape[y][x], p.shape[x][y]]; // Swaps elements to turn rows into columns
            }
        }
        // Reverse the order of the columns
        p.shape.forEach(row => row.reverse()); // Flips each row horizontally, so the shape is rotated 90° clockwise
        return p;
    }

    getLinesClearedPoints(lines, level) { // Calculates the points a player earns for clearing lines
        let lineClearPoints = 0;
        switch (lines) {
            case 1:
                lineClearPoints = POINTS.SINGLE;
                break;
            case 2:
                lineClearPoints = POINTS.DOUBLE;
                break;
            case 3:
                lineClearPoints = POINTS.TRIPLE;
                break;
            case 4:
                lineClearPoints = POINTS.TETRIS;
                break;
            default:
                lineClearPoints = 0;
        }  
        return (account.level + 1) * lineClearPoints; // Points are calculated based on the level and the number of lines cleared
    }
}