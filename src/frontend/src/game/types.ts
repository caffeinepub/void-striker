export type GameScreen = "start" | "playing" | "gameover";

export interface Vector2 {
  x: number;
  y: number;
}

export interface Player {
  pos: Vector2;
  vel: Vector2;
  angle: number;
  radius: number;
  invincible: number; // invincibility frames after hit
}

export type EnemyType = "square" | "diamond" | "hexagon";

export interface Enemy {
  id: number;
  pos: Vector2;
  vel: Vector2;
  type: EnemyType;
  radius: number;
  hp: number;
  maxHp: number;
}

export interface Bullet {
  id: number;
  pos: Vector2;
  vel: Vector2;
  radius: number;
  life: number;
}

export interface Particle {
  id: number;
  pos: Vector2;
  vel: Vector2;
  life: number;
  maxLife: number;
  color: string;
  radius: number;
}

export interface GameState {
  player: Player;
  enemies: Enemy[];
  bullets: Bullet[];
  particles: Particle[];
  score: number;
  wave: number;
  lives: number;
  kills: number;
  waveKills: number;
  waveTimer: number;
  nextId: number;
  shootCooldown: number;
  spawnTimer: number;
  mousePos: Vector2;
  keys: Set<string>;
  mouseDown: boolean;
}
