import { useCallback, useState } from "react";
import { GameCanvas } from "./components/GameCanvas";
import { GameOverScreen } from "./components/GameOverScreen";
import { StartScreen } from "./components/StartScreen";
import type { GameScreen } from "./game/types";

const HS_KEY = "void_striker_high_score";

function loadHighScore(): number {
  try {
    return Number.parseInt(localStorage.getItem(HS_KEY) || "0", 10);
  } catch {
    return 0;
  }
}

function saveHighScore(score: number) {
  try {
    localStorage.setItem(HS_KEY, score.toString());
  } catch {
    // ignore
  }
}

export default function App() {
  const [screen, setScreen] = useState<GameScreen>("start");
  const [score, setScore] = useState(0);
  const [wave, setWave] = useState(1);
  const [lives, setLives] = useState(3);
  const [finalScore, setFinalScore] = useState(0);
  const [highScore, setHighScore] = useState(loadHighScore);

  const handlePlay = useCallback(() => {
    setScore(0);
    setWave(1);
    setLives(3);
    setScreen("playing");
  }, []);

  const handleGameOver = useCallback(
    (s: number) => {
      setFinalScore(s);
      if (s > highScore) {
        setHighScore(s);
        saveHighScore(s);
      }
      setScreen("gameover");
    },
    [highScore],
  );

  const handleHudUpdate = useCallback((s: number, wv: number, lv: number) => {
    setScore(s);
    setWave(wv);
    setLives(lv);
  }, []);

  const handlePlayAgain = useCallback(() => {
    setScreen("start");
  }, []);

  return (
    <div
      className="w-screen h-screen overflow-hidden"
      style={{ background: "#0B0D10" }}
    >
      {screen === "start" && (
        <StartScreen onPlay={handlePlay} highScore={highScore} />
      )}
      {screen === "playing" && (
        <GameCanvas
          onGameOver={handleGameOver}
          onHudUpdate={handleHudUpdate}
          score={score}
          wave={wave}
          lives={lives}
          highScore={highScore}
        />
      )}
      {screen === "gameover" && (
        <GameOverScreen
          score={finalScore}
          highScore={highScore}
          onPlayAgain={handlePlayAgain}
        />
      )}
    </div>
  );
}
