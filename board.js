class Board {
    reset() {
        this.grid = this.getEmptyBoard(); //Resets the board by making it empty
    }

    getEmptyBoard() { //Creates an empty 2D array (a grid) for the Tetris board
        let board = [];
        for (let i = 0; i < ROWS; i++) {
            board.push(new Array(COLUMNS).fill(0));
        }
        return board;
    }
    //!!! Shorter: Array.from({ length: ROWS }).map(() => { return Array(COLUMNS).fill(0);});

    valid(p) {
        return p.shape.every((row, dy) => { // "d" Stands for "Delta" meaning "change in value
            return row.every((value, dx) => { 
                let x = p.x + dx; // dx is the column index
                let y = p.y + dy; // dy is the row index
                return (
                    this.insideWalls(x) && this.aboveFloor(y)
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
        return clone_p;
    }

}