import {
  BASE_ENEMY_SPEED,
  BASE_SPAWN_RATE,
  BULLET_LIFE,
  BULLET_RADIUS,
  BULLET_SPEED,
  ENEMY_COLORS,
  ENEMY_SPEED_INCREMENT,
  INVINCIBLE_DURATION,
  MIN_SPAWN_RATE,
  PLAYER_RADIUS,
  PLAYER_SPEED,
  SHOOT_COOLDOWN,
  SPAWN_RATE_DECREMENT,
  WAVE_KILL_THRESHOLD,
  WAVE_TIME_THRESHOLD,
} from "./constants";
import {
  type Enemy,
  type EnemyType,
  type GameState,
  Particle,
  type Vector2,
} from "./types";

function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val));
}

function dist(a: Vector2, b: Vector2) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function spawnEnemy(state: GameState, width: number, height: number): Enemy {
  const types: EnemyType[] = ["square", "diamond", "hexagon"];
  // unlock hexagons at wave 3
  const available = state.wave < 3 ? types.slice(0, 2) : types;
  const type = available[Math.floor(Math.random() * available.length)];

  // Spawn from edges
  const side = Math.floor(Math.random() * 4);
  let x: number;
  let y: number;
  if (side === 0) {
    x = Math.random() * width;
    y = -30;
  } else if (side === 1) {
    x = width + 30;
    y = Math.random() * height;
  } else if (side === 2) {
    x = Math.random() * width;
    y = height + 30;
  } else {
    x = -30;
    y = Math.random() * height;
  }

  const speed = BASE_ENEMY_SPEED + ENEMY_SPEED_INCREMENT * (state.wave - 1);
  const dx = state.player.pos.x - x;
  const dy = state.player.pos.y - y;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;

  const radius = type === "hexagon" ? 18 : type === "diamond" ? 14 : 12;
  const hp = type === "hexagon" ? 3 : type === "diamond" ? 2 : 1;

  return {
    id: state.nextId++,
    pos: { x, y },
    vel: { x: (dx / len) * speed, y: (dy / len) * speed },
    type,
    radius,
    hp,
    maxHp: hp,
  };
}

function spawnParticles(
  state: GameState,
  pos: Vector2,
  color: string,
  count = 8,
) {
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4;
    const speed = 60 + Math.random() * 120;
    state.particles.push({
      id: state.nextId++,
      pos: { x: pos.x, y: pos.y },
      vel: { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed },
      life: 0.5 + Math.random() * 0.3,
      maxLife: 0.8,
      color,
      radius: 2 + Math.random() * 3,
    });
  }
}

export function createInitialState(width: number, height: number): GameState {
  return {
    player: {
      pos: { x: width / 2, y: height / 2 },
      vel: { x: 0, y: 0 },
      angle: 0,
      radius: PLAYER_RADIUS,
      invincible: 0,
    },
    enemies: [],
    bullets: [],
    particles: [],
    score: 0,
    wave: 1,
    lives: 3,
    kills: 0,
    waveKills: 0,
    waveTimer: 0,
    nextId: 1,
    shootCooldown: 0,
    spawnTimer: 0,
    mousePos: { x: width / 2, y: height / 2 },
    keys: new Set(),
    mouseDown: false,
  };
}

export function updateGame(
  state: GameState,
  dt: number,
  width: number,
  height: number,
): { died: boolean } {
  const { player, keys } = state;

  // Move player
  let dx = 0;
  let dy = 0;
  if (keys.has("ArrowLeft") || keys.has("a") || keys.has("A")) dx -= 1;
  if (keys.has("ArrowRight") || keys.has("d") || keys.has("D")) dx += 1;
  if (keys.has("ArrowUp") || keys.has("w") || keys.has("W")) dy -= 1;
  if (keys.has("ArrowDown") || keys.has("s") || keys.has("S")) dy += 1;

  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  if (dx !== 0 || dy !== 0) {
    player.vel.x = (dx / len) * PLAYER_SPEED;
    player.vel.y = (dy / len) * PLAYER_SPEED;
  } else {
    player.vel.x = 0;
    player.vel.y = 0;
  }

  player.pos.x = clamp(
    player.pos.x + player.vel.x * dt,
    PLAYER_RADIUS,
    width - PLAYER_RADIUS,
  );
  player.pos.y = clamp(
    player.pos.y + player.vel.y * dt,
    PLAYER_RADIUS,
    height - PLAYER_RADIUS,
  );

  // Invincibility
  if (player.invincible > 0) player.invincible -= dt;

  // Shooting
  state.shootCooldown -= dt;
  const shooting = state.mouseDown || keys.has(" ");
  if (shooting && state.shootCooldown <= 0) {
    state.shootCooldown = SHOOT_COOLDOWN;
    const mx = state.mousePos.x - player.pos.x;
    const my = state.mousePos.y - player.pos.y;
    const mlen = Math.sqrt(mx * mx + my * my) || 1;
    state.bullets.push({
      id: state.nextId++,
      pos: { x: player.pos.x, y: player.pos.y },
      vel: { x: (mx / mlen) * BULLET_SPEED, y: (my / mlen) * BULLET_SPEED },
      radius: BULLET_RADIUS,
      life: BULLET_LIFE,
    });
  }

  // Update bullets
  state.bullets = state.bullets.filter((b) => {
    b.pos.x += b.vel.x * dt;
    b.pos.y += b.vel.y * dt;
    b.life -= dt;
    return (
      b.life > 0 &&
      b.pos.x > -20 &&
      b.pos.x < width + 20 &&
      b.pos.y > -20 &&
      b.pos.y < height + 20
    );
  });

  // Update particles
  state.particles = state.particles.filter((p) => {
    p.pos.x += p.vel.x * dt;
    p.pos.y += p.vel.y * dt;
    p.vel.x *= 0.92;
    p.vel.y *= 0.92;
    p.life -= dt;
    return p.life > 0;
  });

  // Wave progression
  state.waveTimer += dt;
  if (
    state.waveKills >= WAVE_KILL_THRESHOLD ||
    state.waveTimer >= WAVE_TIME_THRESHOLD
  ) {
    state.wave++;
    state.waveKills = 0;
    state.waveTimer = 0;
  }

  // Spawn enemies
  const spawnRate = Math.max(
    MIN_SPAWN_RATE,
    BASE_SPAWN_RATE - SPAWN_RATE_DECREMENT * (state.wave - 1),
  );
  // More enemies per spawn at higher waves
  state.spawnTimer += dt;
  if (state.spawnTimer >= spawnRate) {
    state.spawnTimer = 0;
    const toSpawn = 1 + Math.floor((state.wave - 1) / 2);
    for (let i = 0; i < toSpawn; i++) {
      state.enemies.push(spawnEnemy(state, width, height));
    }
  }

  // Update enemies
  for (const e of state.enemies) {
    // Steer toward player
    const ex = player.pos.x - e.pos.x;
    const ey = player.pos.y - e.pos.y;
    const elen = Math.sqrt(ex * ex + ey * ey) || 1;
    const speed = BASE_ENEMY_SPEED + ENEMY_SPEED_INCREMENT * (state.wave - 1);
    e.vel.x = (ex / elen) * speed;
    e.vel.y = (ey / elen) * speed;
    e.pos.x += e.vel.x * dt;
    e.pos.y += e.vel.y * dt;
  }

  // Bullet-enemy collisions
  const hitEnemyIds = new Set<number>();
  const hitBulletIds = new Set<number>();

  for (const b of state.bullets) {
    for (const e of state.enemies) {
      if (hitEnemyIds.has(e.id)) continue;
      if (dist(b.pos, e.pos) < b.radius + e.radius) {
        hitBulletIds.add(b.id);
        e.hp--;
        if (e.hp <= 0) {
          hitEnemyIds.add(e.id);
          spawnParticles(state, e.pos, ENEMY_COLORS[e.type], 10);
          state.score +=
            e.type === "hexagon" ? 30 : e.type === "diamond" ? 20 : 10;
          state.kills++;
          state.waveKills++;
        } else {
          // Flash particle
          spawnParticles(state, e.pos, ENEMY_COLORS[e.type], 3);
        }
        break;
      }
    }
  }

  state.bullets = state.bullets.filter((b) => !hitBulletIds.has(b.id));
  state.enemies = state.enemies.filter((e) => !hitEnemyIds.has(e.id));

  // Player-enemy collisions
  let died = false;
  if (player.invincible <= 0) {
    for (const e of state.enemies) {
      if (dist(player.pos, e.pos) < PLAYER_RADIUS + e.radius * 0.75) {
        state.lives--;
        player.invincible = INVINCIBLE_DURATION;
        // Push enemy away
        const ex2 = e.pos.x - player.pos.x;
        const ey2 = e.pos.y - player.pos.y;
        const elen2 = Math.sqrt(ex2 * ex2 + ey2 * ey2) || 1;
        e.pos.x += (ex2 / elen2) * 60;
        e.pos.y += (ey2 / elen2) * 60;
        spawnParticles(state, player.pos, "#22B6FF", 12);
        if (state.lives <= 0) {
          died = true;
        }
        break;
      }
    }
  }

  return { died };
}
