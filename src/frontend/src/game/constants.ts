export const CANVAS_BG = "#0B0D10";
export const PLAYER_COLOR = "#FFFFFF";
export const PLAYER_GLOW = "#22B6FF";
export const BULLET_COLOR = "#22B6FF";

export const ENEMY_COLORS: Record<string, string> = {
  square: "#E34B4B",
  diamond: "#F2A23A",
  hexagon: "#8B4DEB",
};

export const PLAYER_SPEED = 220;
export const PLAYER_RADIUS = 14;
export const BULLET_SPEED = 520;
export const BULLET_LIFE = 1.4; // seconds
export const BULLET_RADIUS = 4;
export const SHOOT_COOLDOWN = 0.18; // seconds between shots

export const BASE_ENEMY_SPEED = 80;
export const ENEMY_SPEED_INCREMENT = 12;
export const BASE_SPAWN_RATE = 1.8; // seconds
export const SPAWN_RATE_DECREMENT = 0.1;
export const MIN_SPAWN_RATE = 0.4;
export const WAVE_KILL_THRESHOLD = 10;
export const WAVE_TIME_THRESHOLD = 15; // seconds

export const INITIAL_LIVES = 3;
export const INVINCIBLE_DURATION = 1.5; // seconds after hit
