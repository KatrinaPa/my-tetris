class Board {

    context; // canvas context for drawing the main game board
    contextNext; // will help draw the next piece coming
    grid; // 2D array representing the board
    piece; // The current piece in play
    next; // The next piece to play
    requestId; // Used to cancel the game, to pause it
    time; // Used to keep track of time
    heldPiece = null;
    canHold = true;

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
        this.heldPiece = null; // Reset held piece
        this.canHold = true;   // Reset hold ability
    }

    getNewPiece() {
        this.next = new Piece(this.contextNext);
        this.contextNext.clearRect(0, 0, this.contextNext.canvas.width, this.contextNext.canvas.height);
        
        // Center the piece in the preview
        const originalX = this.next.x;
        const originalY = this.next.y;
        
        // Calculate center position based on piece size
        if (this.next.typeId === 1) { // I piece (4x4)
            this.next.x = 0;
            this.next.y = 0; 
        } else if (this.next.typeId === 2) { // O piece (2x2)
            this.next.x = 1;
            this.next.y = 1;
        } else { // All other pieces (3x3)
            this.next.x = 0.5;
            this.next.y = 0.5;
        }
        
        // Draw the centered piece
        this.next.draw();
        
        // Reset position for when piece enters play
        this.next.x = originalX;
        this.next.y = originalY;
    }

    draw() { // Add ghost piece 
        const ghost = this.piece.getGhostPiece(this);
        this.context.fillStyle = 'rgba(255, 255, 255, 0.05)';
        ghost.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value > 0) {
                    this.context.fillRect(ghost.x + x, ghost.y + y, 1, 1);
                }
            });
        });
        
        this.piece.draw();
        this.drawBoard();
    }

    drop() {
        let p = moves[KEY.DOWN](this.piece);
        if (this.valid(p)) {
            this.piece.move(p);
        } else {
            this.freeze();
            this.clearLines();
            if (this.piece.y === 0) { //If the piece is at the top of the board
                return false // Game over
            }
            this.piece = this.next; //Set current piece to next upcoming piece
            this.piece.context = this.context; // new piece gets the same drawing context as the previous piece
            this.piece.setStartingPosition(); //Set the starting position of the piece
            this.getNewPiece(); //Get new random piece is generated and stored as this.next, waiting for its turn
            this.canHold = true; // Reset hold ability for new piece
        }
        return true; // If no game over happened, return true, meaning the game continues
    }

    clearLines() { 
        let lines = 0;
        
        this.grid.forEach((row, y) => {
            if (row.every(value => value > 0)) {
                // Immediately remove the line
                this.grid.splice(y, 1);
                this.grid.unshift(Array(COLUMNS).fill(0));
                lines++;
                sounds.clearLine.play(); // Play clear line sound
            }
        });

        if (lines > 0) {
            account.score += this.getLinesClearedPoints(lines);
            account.lines += lines;
            
            if (account.lines >= LINES_PER_LEVEL) {
                account.level++;
                account.lines -= LINES_PER_LEVEL;
                time.level = LEVEL[account.level];
                sounds.nextLevel.play(); // Play level up sound
                this.showLevelUp();
            }
        }
    }

    freeze() {
        this.piece.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value > 0) {
                    this.grid[y + this.piece.y][x + this.piece.x] = this.piece.typeId;
                }
            });
        });
    }

    drawBoard() {
        this.grid.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value > 0) {
                    this.context.fillStyle = COLORS[value];
                    this.context.fillRect(x, y, 1, 1);
                    this.context.strokeStyle = 'rgba(0, 0, 0, 0.5)';
                    this.context.lineWidth = 0.02;
                    this.context.strokeRect(
                        x + 0.05, 
                        y + 0.05, 
                        0.9,
                        0.9
                    );
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
        let clone = JSON.parse(JSON.stringify(p));
        
        // Transpose matrix
        for (let y = 0; y < clone.shape.length; ++y) {
            for (let x = 0; x < y; ++x) {
                [clone.shape[x][y], clone.shape[y][x]] = [clone.shape[y][x], clone.shape[x][y]];
            }
        }
        // Reverse the order of columns
        clone.shape.forEach(row => row.reverse());
        
        // If rotation is valid, return it
        if (this.valid(clone)) {
            return clone;
        }
        
        // Try wall kicks - shift left or right if rotation near wall
        const kicks = [-1, 1, -2, 2];
        for (let kick of kicks) {
            const kickedPiece = JSON.parse(JSON.stringify(clone));
            kickedPiece.x = clone.x + kick;
            
            if (this.valid(kickedPiece)) {
                return kickedPiece;
            }
        }
        // If no valid rotation found, return original piece
        return p;
    }

    rotateCCW(p) {
        let clone = JSON.parse(JSON.stringify(p));
        
        // Transpose matrix
        for (let y = 0; y < clone.shape.length; ++y) {
            for (let x = 0; x < y; ++x) {
                [clone.shape[x][y], clone.shape[y][x]] = [clone.shape[y][x], clone.shape[x][y]];
            }
        }
        // Reverse columns
        clone.shape.reverse();
        
        // If rotation is valid, return it
        if (this.valid(clone)) {
            return clone;
        }
        
        // Try wall kicks
        const kicks = [-1, 1, -2, 2];
        for (let kick of kicks) {
            const kickedPiece = JSON.parse(JSON.stringify(clone));
            kickedPiece.x = clone.x + kick;
            
            if (this.valid(kickedPiece)) {
                return kickedPiece;
            }
        }       
        // If no valid rotation found, return original piece
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

    levelUp() {
        account.level++;
        account.lines -= LINES_PER_LEVEL;
        time.level = LEVEL[account.level];
    
        // Pause the game temporarily
        const tempRequestId = requestId;
        cancelAnimationFrame(requestId);
    
        // Save current game state
        const currentBoard = this.context.getImageData(0, 0, this.context.canvas.width, this.context.canvas.height);
    
        let opacity = 0;
        let fadeIn = true;
    
        const animation = setInterval(() => {
            this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
            this.context.putImageData(currentBoard, 0, 0);
    
            this.context.fillStyle = `rgba(0, 0, 0, 0.4)`;
            this.context.fillRect(0, 0, COLUMNS, ROWS);
    
            this.context.font = '1px Press Start 2P';
            this.context.fillStyle = `rgba(255, 215, 0, ${opacity})`;
            this.context.fillText(`LEVEL ${account.level}!`, 2, 5);
    
            if (fadeIn) {
                opacity += 0.1;
                if (opacity >= 1) fadeIn = false;
            } else {
                opacity -= 0.1;
                if (opacity <= 0) {
                    clearInterval(animation);
                    requestId = tempRequestId;
                    animate();
                }
            }
        }, 80);
    }

    showLevelUp() {
        const levelUpMsg = document.getElementById('level-up');
        levelUpMsg.textContent = `You reached Level ${account.level}!`;
        levelUpMsg.classList.remove('show');
        // Force reflow
        void levelUpMsg.offsetWidth;
        levelUpMsg.classList.add('show');
        
        // message is hidden after animation
        setTimeout(() => {
            levelUpMsg.classList.remove('show');
        }, 2000);
    }

    holdPiece() {
        if (!this.canHold) return; // Only once per piece drop

        if (this.heldPiece === null) {
            // First hold
            this.heldPiece = this.piece;
            this.piece = this.next;
            this.piece.context = this.context;
            this.piece.setStartingPosition();
            this.getNewPiece();
        } else {
            // Swap held piece with current piece
            const temp = this.piece;
            this.piece = this.heldPiece;
            this.heldPiece = temp;
            
            this.piece.context = this.context;
            this.piece.setStartingPosition();
        }
        
        this.canHold = false; // Can't hold again until piece is placed
    }
}