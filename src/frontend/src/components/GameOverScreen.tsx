import { motion } from "motion/react";

interface Props {
  score: number;
  highScore: number;
  onPlayAgain: () => void;
}

export function GameOverScreen({ score, highScore, onPlayAgain }: Props) {
  const isNewRecord = score >= highScore && score > 0;

  return (
    <div
      className="w-screen h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: "#0B0D10" }}
    >
      {/* Background grid */}
      <svg
        aria-hidden="true"
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ opacity: 0.04 }}
      >
        <defs>
          <pattern
            id="grid2"
            width="60"
            height="60"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 60 0 L 0 0 0 60"
              fill="none"
              stroke="#E34B4B"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid2)" />
      </svg>

      <div className="relative z-10 flex flex-col items-center text-center px-8">
        <motion.div
          initial={{ opacity: 0, scale: 1.3 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <h1
            className="text-6xl md:text-8xl font-black tracking-widest uppercase mb-2"
            style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              color: "#E34B4B",
              textShadow:
                "0 0 30px rgba(227,75,75,0.6), 0 0 60px rgba(227,75,75,0.3)",
              letterSpacing: "0.15em",
            }}
          >
            GAME
          </h1>
          <h1
            className="text-6xl md:text-8xl font-black tracking-widest uppercase mb-12"
            style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              color: "#E34B4B",
              textShadow:
                "0 0 30px rgba(227,75,75,0.6), 0 0 60px rgba(227,75,75,0.3)",
              letterSpacing: "0.15em",
            }}
          >
            OVER
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex flex-col items-center gap-4 mb-12"
        >
          <div
            className="px-12 py-6 rounded"
            style={{ border: "1px solid #2A313A", background: "#1A1F2688" }}
          >
            <div
              className="text-xs tracking-widest uppercase mb-2"
              style={{
                color: "#B7BDC6",
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              Final Score
            </div>
            <div
              className="text-5xl font-black tracking-wider"
              style={{
                color: "#FFFFFF",
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              {score.toString().padStart(6, "0")}
            </div>
          </div>

          {isNewRecord && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.4, type: "spring" }}
              className="px-6 py-2 rounded"
              style={{
                border: "1px solid #22B6FF",
                background: "rgba(34,182,255,0.1)",
              }}
            >
              <span
                className="text-sm tracking-widest uppercase font-bold"
                style={{
                  color: "#22B6FF",
                  fontFamily: "'JetBrains Mono', monospace",
                  textShadow: "0 0 10px #22B6FF",
                }}
              >
                ★ NEW HIGH SCORE ★
              </span>
            </motion.div>
          )}

          {!isNewRecord && highScore > 0 && (
            <div
              className="text-sm"
              style={{
                color: "#B7BDC6",
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              Best: {highScore.toString().padStart(6, "0")}
            </div>
          )}
        </motion.div>

        <motion.button
          data-ocid="gameover.primary_button"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={onPlayAgain}
          className="px-16 py-4 text-lg font-black tracking-[0.2em] uppercase rounded transition-all duration-200"
          style={{
            background: "#22B6FF",
            color: "#0B0D10",
            fontFamily: "'Bricolage Grotesque', sans-serif",
            boxShadow:
              "0 0 24px rgba(34,182,255,0.5), 0 0 48px rgba(34,182,255,0.2)",
          }}
        >
          PLAY AGAIN
        </motion.button>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
        <span
          className="text-xs"
          style={{
            color: "#B7BDC640",
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          © {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#22B6FF", textDecoration: "none" }}
          >
            caffeine.ai
          </a>
        </span>
      </div>
    </div>
  );
}
