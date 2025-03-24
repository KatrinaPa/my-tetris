'use strict';

const ROWS = 20;
const COLUMNS = 10;
const BLOCK_SIZE = 30;
const LINES_PER_LEVEL = 10;
const COLORS = [
    "none",
    "#87eaed",  // Pastel cyan (I piece)
    "#FFE083",  // Pastel yellow (O piece)
    "#B19CD9",  // Pastel purple (T piece)
    "#98E2A1",  // Pastel green (S piece)
    "#FF9B9B",  // Pastel red (Z piece)
    "#82C3F5",  // Pastel blue (J piece)
    "#FFB677"   // Pastel orange (L piece)
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
    ESC: 27,
    SPACE: 32,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    P: 80,
    Z: 90,
    X: 88,
    C: 67,
    ENTER: 13
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

const LEVEL = {
    0: 800,
    1: 720,
    2: 630,
    3: 550,
    4: 470,
    5: 380,
    6: 300,
    7: 220,
    8: 130,
    9: 100,
    10: 80,
    11: 80,
    12: 80,
    13: 70,
    14: 70,
    15: 70,
    16: 50,
    17: 50,
    18: 50,
    19: 30,
    20: 30,
};
Object.freeze(LEVEL);