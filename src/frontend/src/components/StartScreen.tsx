import { motion } from "motion/react";

interface Props {
  onPlay: () => void;
  highScore: number;
}

export function StartScreen({ onPlay, highScore }: Props) {
  return (
    <div
      className="w-screen h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: "#0B0D10" }}
    >
      {/* Background grid */}
      <svg
        aria-hidden="true"
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ opacity: 0.06 }}
      >
        <defs>
          <pattern
            id="grid"
            width="60"
            height="60"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 60 0 L 0 0 0 60"
              fill="none"
              stroke="#22B6FF"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Decorative shapes */}
      <motion.div
        className="absolute"
        style={{ top: "15%", right: "12%", opacity: 0.15 }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 20,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      >
        <svg aria-hidden="true" width="80" height="80" viewBox="0 0 80 80">
          <rect
            x="10"
            y="10"
            width="60"
            height="60"
            fill="none"
            stroke="#E34B4B"
            strokeWidth="2"
          />
        </svg>
      </motion.div>

      <motion.div
        className="absolute"
        style={{ bottom: "20%", left: "10%", opacity: 0.15 }}
        animate={{ rotate: -360 }}
        transition={{
          duration: 15,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      >
        <svg aria-hidden="true" width="70" height="70" viewBox="0 0 70 70">
          <polygon
            points="35,5 65,60 5,60"
            fill="none"
            stroke="#F2A23A"
            strokeWidth="2"
          />
        </svg>
      </motion.div>

      <motion.div
        className="absolute"
        style={{ top: "25%", left: "8%", opacity: 0.12 }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 25,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      >
        <svg aria-hidden="true" width="60" height="60" viewBox="0 0 60 60">
          <polygon
            points="30,5 55,17.5 55,42.5 30,55 5,42.5 5,17.5"
            fill="none"
            stroke="#8B4DEB"
            strokeWidth="2"
          />
        </svg>
      </motion.div>

      <motion.div
        className="absolute"
        style={{ bottom: "15%", right: "8%", opacity: 0.1 }}
        animate={{ rotate: -360 }}
        transition={{
          duration: 30,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      >
        <svg aria-hidden="true" width="100" height="100" viewBox="0 0 100 100">
          <polygon
            points="50,10 90,30 90,70 50,90 10,70 10,30"
            fill="none"
            stroke="#22B6FF"
            strokeWidth="1.5"
          />
        </svg>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-8">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          {/* Logo triangle */}
          <div className="flex justify-center mb-6">
            <svg aria-hidden="true" width="48" height="48" viewBox="0 0 48 48">
              <polygon
                points="24,4 44,40 4,40"
                fill="white"
                style={{
                  filter:
                    "drop-shadow(0 0 12px #22B6FF) drop-shadow(0 0 24px #22B6FF44)",
                }}
              />
            </svg>
          </div>

          <h1
            className="text-6xl md:text-8xl font-black tracking-widest uppercase mb-3"
            style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              color: "#FFFFFF",
              textShadow:
                "0 0 30px rgba(34,182,255,0.6), 0 0 60px rgba(34,182,255,0.3)",
              letterSpacing: "0.2em",
            }}
          >
            APEX
          </h1>
          <h1
            className="text-6xl md:text-8xl font-black tracking-widest uppercase mb-8"
            style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              color: "#22B6FF",
              textShadow:
                "0 0 30px rgba(34,182,255,0.8), 0 0 60px rgba(34,182,255,0.4)",
              letterSpacing: "0.2em",
            }}
          >
            STRIKE
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-sm tracking-[0.3em] uppercase mb-12"
          style={{
            color: "#B7BDC6",
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          SURVIVE THE GEOMETRIC ONSLAUGHT
        </motion.p>

        {highScore > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            className="mb-8 px-6 py-2 rounded"
            style={{ border: "1px solid #2A313A", background: "#1A1F2688" }}
          >
            <span
              className="text-xs tracking-widest uppercase"
              style={{
                color: "#22B6FF",
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              Best Score: {highScore.toString().padStart(6, "0")}
            </span>
          </motion.div>
        )}

        <motion.button
          data-ocid="start.primary_button"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={onPlay}
          className="px-16 py-4 text-lg font-black tracking-[0.2em] uppercase rounded transition-all duration-200"
          style={{
            background: "#22B6FF",
            color: "#0B0D10",
            fontFamily: "'Bricolage Grotesque', sans-serif",
            boxShadow:
              "0 0 24px rgba(34,182,255,0.5), 0 0 48px rgba(34,182,255,0.2)",
          }}
        >
          PLAY
        </motion.button>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="mt-12 flex flex-col gap-2"
          style={{
            color: "#B7BDC6",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.75rem",
          }}
        >
          <div className="flex gap-8 justify-center">
            <span>WASD · ARROW KEYS — Move</span>
            <span>MOUSE — Aim</span>
            <span>CLICK · SPACE — Shoot</span>
          </div>
          <div
            className="flex gap-8 justify-center"
            style={{ color: "#B7BDC640" }}
          >
            <span>◆ Squares +10pts</span>
            <span>◆ Diamonds +20pts</span>
            <span>◆ Hexagons +30pts</span>
          </div>
        </motion.div>
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
