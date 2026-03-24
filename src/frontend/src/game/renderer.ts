import {
  BULLET_COLOR,
  CANVAS_BG,
  ENEMY_COLORS,
  PLAYER_COLOR,
  PLAYER_GLOW,
  PLAYER_RADIUS,
} from "./constants";
import type { GameState } from "./types";

function drawTriangle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  angle: number,
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.beginPath();
  ctx.moveTo(radius, 0);
  ctx.lineTo(-radius * 0.7, radius * 0.7);
  ctx.lineTo(-radius * 0.7, -radius * 0.7);
  ctx.closePath();
  ctx.restore();
}

function drawSquare(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  angle: number,
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.beginPath();
  ctx.rect(-radius, -radius, radius * 2, radius * 2);
  ctx.restore();
}

function drawDiamond(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  angle: number,
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle + Math.PI / 4);
  ctx.beginPath();
  ctx.rect(-radius * 0.85, -radius * 0.85, radius * 1.7, radius * 1.7);
  ctx.restore();
}

function drawHexagon(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  angle: number,
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i;
    if (i === 0) ctx.moveTo(Math.cos(a) * radius, Math.sin(a) * radius);
    else ctx.lineTo(Math.cos(a) * radius, Math.sin(a) * radius);
  }
  ctx.closePath();
  ctx.restore();
}

export function render(
  ctx: CanvasRenderingContext2D,
  state: GameState,
  width: number,
  height: number,
  time: number,
) {
  // Background
  ctx.fillStyle = CANVAS_BG;
  ctx.fillRect(0, 0, width, height);

  // Subtle grid
  ctx.strokeStyle = "rgba(34,182,255,0.04)";
  ctx.lineWidth = 1;
  const gridSize = 60;
  for (let x = 0; x < width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y < height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // Particles
  for (const p of state.particles) {
    const alpha = p.life / p.maxLife;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.pos.x, p.pos.y, p.radius * alpha, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // Bullets
  ctx.fillStyle = BULLET_COLOR;
  ctx.shadowColor = BULLET_COLOR;
  ctx.shadowBlur = 8;
  for (const b of state.bullets) {
    ctx.beginPath();
    ctx.arc(b.pos.x, b.pos.y, b.radius, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.shadowBlur = 0;

  // Enemies
  for (const e of state.enemies) {
    const color = ENEMY_COLORS[e.type] ?? "#fff";
    const angle = Math.atan2(
      state.player.pos.y - e.pos.y,
      state.player.pos.x - e.pos.x,
    );
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.shadowColor = color;
    ctx.shadowBlur = 12;
    ctx.fillStyle = `${color}22`;

    if (e.type === "square") {
      drawSquare(ctx, e.pos.x, e.pos.y, e.radius, angle);
    } else if (e.type === "diamond") {
      drawDiamond(ctx, e.pos.x, e.pos.y, e.radius, angle);
    } else {
      drawHexagon(ctx, e.pos.x, e.pos.y, e.radius, angle);
    }
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  // Player
  const player = state.player;
  const blinking = player.invincible > 0 && Math.floor(time * 8) % 2 === 0;
  if (!blinking) {
    const playerAngle = Math.atan2(
      state.mousePos.y - player.pos.y,
      state.mousePos.x - player.pos.x,
    );

    // Glow
    ctx.shadowColor = PLAYER_GLOW;
    ctx.shadowBlur = 20;
    ctx.strokeStyle = PLAYER_GLOW;
    ctx.lineWidth = 1;
    drawTriangle(
      ctx,
      player.pos.x,
      player.pos.y,
      PLAYER_RADIUS + 4,
      playerAngle,
    );
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Fill
    ctx.fillStyle = PLAYER_COLOR;
    ctx.shadowColor = PLAYER_GLOW;
    ctx.shadowBlur = 10;
    drawTriangle(ctx, player.pos.x, player.pos.y, PLAYER_RADIUS, playerAngle);
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}
