'use strict';

const ROWS = 20;
const COLUMNS = 10;
const BLOCK_SIZE = 30;
const LINES_PER_LEVEL = 10;
const COLORS = [
    "none",
    "cyan",
    "yellow",
    "purple",
    "green",
    "red",
    "blue",    
    "orange",
];
Object.freeze(COLORS);

const SHAPES = [
    [],
    [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ],
    [
        [2, 2],
        [2, 2],
    ],
    [
        [0, 3, 0],
        [3, 3, 3],
        [0, 0, 0],
    ],
    [
        [0, 4, 4],
        [4, 4, 0],
        [0, 0, 0],
    ],
    [
        [5, 5, 0],
        [0, 5, 5],
        [0, 0, 0],
    ],
    [
        [6, 0, 0],
        [6, 6, 6],
        [0, 0, 0],
    ],
    [
        [0, 0, 7],
        [7, 7, 7],
        [0, 0, 0],
    ],
]
Object.freeze(SHAPES);

const KEY = {
    SPACE: 32,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    ESC: 27,
    P: 80,
};
Object.freeze(KEY);

const POINTS = {
    SINGLE: 100,
    DOUBLE: 300,
    TRIPLE: 500,
    TETRIS: 800,
    SOFT_DROP: 1,
    HARD_DROP: 2,
};
Object.freeze(POINTS);