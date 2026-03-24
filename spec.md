# Void Striker

## Current State
New project. Empty backend and frontend scaffolding only.

## Requested Changes (Diff)

### Add
- Minimalist singleplayer action game (top-down shooter / wave survival)
- Canvas-based game: player controls a geometric shape, shoots enemies
- Wave-based enemy spawning with increasing difficulty
- High score tracking stored in the backend
- Game UI: score, wave number, lives, high score HUD
- Start screen, game-over screen with final score
- Keyboard controls (WASD/arrow keys to move, mouse or spacebar to shoot)

### Modify
- Nothing (new project)

### Remove
- Nothing (new project)

## Implementation Plan
1. Backend: store and retrieve high scores (top scores list)
2. Frontend: full Canvas game loop using requestAnimationFrame
   - Player ship (triangle geometric shape)
   - Enemy spawner (squares/diamonds approaching player)
   - Bullet system
   - Collision detection
   - Wave progression system
   - HUD overlay (score, wave, lives, high score)
   - Start screen and game over screen
   - Submit score to backend on game over
3. Minimalist dark aesthetic: near-black background, white/cyan geometric shapes, clean sans-serif typography
