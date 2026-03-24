import { useCallback, useEffect, useRef } from "react";
import { createInitialState, updateGame } from "./logic";
import { render } from "./renderer";
import type { GameState } from "./types";

interface UseGameOptions {
  onGameOver: (score: number) => void;
  onScoreUpdate: (score: number, wave: number, lives: number) => void;
}

export function useGame(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  options: UseGameOptions,
) {
  const stateRef = useRef<GameState | null>(null);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const runningRef = useRef(false);
  const timeRef = useRef(0);

  const stop = useCallback(() => {
    runningRef.current = false;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, []);

  const start = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const width = canvas.width;
    const height = canvas.height;

    stateRef.current = createInitialState(width, height);
    runningRef.current = true;
    lastTimeRef.current = 0;
    timeRef.current = 0;

    const loop = (timestamp: number) => {
      if (!runningRef.current) return;
      if (lastTimeRef.current === 0) lastTimeRef.current = timestamp;
      const dt = Math.min((timestamp - lastTimeRef.current) / 1000, 0.05);
      lastTimeRef.current = timestamp;
      timeRef.current += dt;

      const state = stateRef.current!;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const result = updateGame(state, dt, width, height);
      render(ctx, state, width, height, timeRef.current);

      // Update React UI every frame for score
      options.onScoreUpdate(state.score, state.wave, state.lives);

      if (result.died) {
        stop();
        options.onGameOver(state.score);
        return;
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
  }, [canvasRef, options, stop]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const state = stateRef.current;
    if (!state) return;
    state.keys.add(e.key);
    if (
      [" ", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)
    ) {
      e.preventDefault();
    }
  }, []);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    const state = stateRef.current;
    if (!state) return;
    state.keys.delete(e.key);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const state = stateRef.current;
      if (!state) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      state.mousePos.x = e.clientX - rect.left;
      state.mousePos.y = e.clientY - rect.top;
    },
    [canvasRef],
  );

  const handleMouseDown = useCallback(() => {
    const state = stateRef.current;
    if (!state) return;
    state.mouseDown = true;
  }, []);

  const handleMouseUp = useCallback(() => {
    const state = stateRef.current;
    if (!state) return;
    state.mouseDown = false;
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      stop();
    };
  }, [
    handleKeyDown,
    handleKeyUp,
    handleMouseMove,
    handleMouseDown,
    handleMouseUp,
    stop,
  ]);

  return { start, stop };
}
