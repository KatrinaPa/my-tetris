# My Tetris

A modern, responsive Tetris game built with vanilla JavaScript, HTML, and CSS.  
The game includes sound effects, keyboard controls, and adapts to both desktop and mobile screen sizes.

![Tetris Game Screenshot](/assets/images/tetris_screenshot.png)

## Features

- Classic Tetris gameplay mechanics
- Responsive design for both desktop and mobile
- Modern visual effects and animations
- Score tracking and level progression
- Next piece preview
- Piece holding system
- Ghost piece preview
- "Game Over" screen with the ability to restart the game
- Sound effects and background music
- Touch controls for mobile devices

## 📸 Screenshots

Example:
<img src="/assets/images/tetris_screenshot.png" width="600">  
<img src="/assets/images/tetris_screenshot_mob.png" width="300">

## How to Play

- Click **Play** to start a new game.
- Use arrow keys to move and rotate blocks:
  - **⬅️ Left Arrow** — Move left
  - **➡️ Right Arrow** — Move right
  - **⬇️ Down Arrow** — Soft drop
  - **⬆️ Up Arrow** — Rotate
  - **Spacebar** — Quick drop
- When the stack reaches the top — game over!

## Controls

### Desktop Controls

- ↑: Rotate clockwise
- ←: Move left
- →: Move right
- ↓: Move down (soft drop)
- Space: Hard drop
- Z: Rotate counter-clockwise
- X: Rotate clockwise
- C: Hold piece
- P: Pause game
- Esc: Game over
- Enter: Start game

### Mobile Controls

- Touch controls with on-screen buttons
- Arrow buttons for movement
- Space for hard drop
- P for pause
- Esc for game over

## Game Rules

- Clear lines by filling them with blocks
- Score points by clearing lines and dropping pieces
- Game speeds up as you progress through levels
- Clear 10 lines to advance to the next level
- Game ends if pieces stack up to the top

## Scoring System

- Single line: 100 × level
- Double line: 300 × level
- Triple line: 500 × level
- Tetris (4 lines): 800 × level
- Soft drop: 1 point per cell
- Hard drop: 2 points per cell

## Technical Details

### Technologies Used

- HTML5 Canvas for game rendering
- JavaScript for game logic
- CSS3 for styling and animations
- Web Audio API for sound effects

### Project Structure

## Installation

# How to Run Locally

1. Clone the repository:

```bash
git clone https://github.com/yourusername/my-tetris.git
```

2. Install Node.js (if not already installed)

3. Start the local server:

```bash
node html_server.js
```

4. Open your browser and navigate to:

```bash
http://localhost:8080
```

## Usage

TODO - How does it work?

```
./my_project argument1 argument2
```

## License

This project is for educational and personal use as part of Qwasar School projects.
Tetris® is a registered trademark of The Tetris Company.
All copyright information is included in the game and visible on the main screen before the game starts.

### The Core Team

# Author

Katrina Pastore Ozolina
Qwasar Project: My Tetris Game

<span><i>Made at <a href='https://qwasar.io'>Qwasar SV -- Software Engineering School</a></i></span>
<span><img alt='Qwasar SV -- Software Engineering School's Logo' src='https://storage.googleapis.com/qwasar-public/qwasar-logo_50x50.png' width='20px' /></span>
