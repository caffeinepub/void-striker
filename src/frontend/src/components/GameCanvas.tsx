import { useCallback, useEffect, useRef, useState } from "react";
import { useGame } from "../game/useGame";

interface Props {
  onGameOver: (score: number) => void;
  score: number;
  wave: number;
  lives: number;
  onHudUpdate: (score: number, wave: number, lives: number) => void;
  highScore: number;
}

export function GameCanvas({
  onGameOver,
  onHudUpdate,
  score,
  wave,
  lives,
  highScore,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({
    w: window.innerWidth,
    h: window.innerHeight,
  });

  const stableOnGameOver = useCallback(
    (s: number) => onGameOver(s),
    [onGameOver],
  );
  const stableOnHud = useCallback(
    (s: number, wv: number, lv: number) => onHudUpdate(s, wv, lv),
    [onHudUpdate],
  );

  const { start, stop } = useGame(canvasRef, {
    onGameOver: stableOnGameOver,
    onScoreUpdate: stableOnHud,
  });

  useEffect(() => {
    const resize = () => {
      setSize({ w: window.innerWidth, h: window.innerHeight });
    };
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: restart game on resize
  useEffect(() => {
    const timer = setTimeout(() => {
      start();
    }, 50);
    return () => {
      clearTimeout(timer);
      stop();
    };
  }, [start, stop, size]);

  const HEART_KEYS = ["heart-1", "heart-2", "heart-3"];
  const hearts = [lives > 0, lives > 1, lives > 2];

  return (
    <div
      ref={containerRef}
      className="relative w-screen h-screen overflow-hidden"
    >
      <canvas
        ref={canvasRef}
        width={size.w}
        height={size.h}
        className="block"
        style={{ cursor: "crosshair", display: "block" }}
      />

      {/* HUD */}
      <div
        className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-4 pointer-events-none"
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
      >
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <span
              className="text-xs tracking-widest uppercase"
              style={{ color: "#22B6FF", opacity: 0.7 }}
            >
              Score
            </span>
            <span className="text-2xl font-bold text-white tracking-wider">
              {score.toString().padStart(6, "0")}
            </span>
          </div>
          <div className="flex flex-col">
            <span
              className="text-xs tracking-widest uppercase"
              style={{ color: "#22B6FF", opacity: 0.7 }}
            >
              Wave
            </span>
            <span className="text-2xl font-bold text-white tracking-wider">
              {wave.toString().padStart(2, "0")}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <span
            className="text-xs tracking-widest uppercase mb-1"
            style={{ color: "#22B6FF", opacity: 0.7 }}
          >
            Lives
          </span>
          <div className="flex gap-2">
            {hearts.map((alive, i) => (
              <div
                key={HEART_KEYS[i]}
                className="w-3 h-3 rounded-full"
                style={{
                  background: alive ? "#22B6FF" : "#2A313A",
                  boxShadow: alive ? "0 0 8px #22B6FF" : "none",
                }}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col items-end">
          <span
            className="text-xs tracking-widest uppercase"
            style={{ color: "#22B6FF", opacity: 0.7 }}
          >
            Best
          </span>
          <span
            className="text-2xl font-bold tracking-wider"
            style={{ color: "#22B6FF" }}
          >
            {highScore.toString().padStart(6, "0")}
          </span>
        </div>
      </div>

      {/* Corner decoration */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none">
        <span
          className="text-xs tracking-widest uppercase"
          style={{
            color: "#22B6FF",
            opacity: 0.3,
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          WASD · MOUSE AIM · CLICK/SPACE SHOOT
        </span>
      </div>
    </div>
  );
}
