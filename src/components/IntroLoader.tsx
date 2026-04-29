import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface IntroLoaderProps {
  onComplete: () => void;
}

export function IntroLoader({ onComplete }: IntroLoaderProps) {
  const [phase, setPhase] = useState<"video" | "logo" | "done">("video");
  const [showSkip, setShowSkip] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const skipTimer = setTimeout(() => setShowSkip(true), 1500);
    const autoComplete = setTimeout(() => setPhase("logo"), 4000);
    return () => {
      clearTimeout(skipTimer);
      clearTimeout(autoComplete);
    };
  }, []);

  useEffect(() => {
    if (phase === "logo") {
      const t = setTimeout(() => {
        setPhase("done");
        setTimeout(onComplete, 600);
      }, 1500);
      return () => clearTimeout(t);
    }
  }, [phase, onComplete]);

  const handleSkip = () => {
    setPhase("done");
    setTimeout(onComplete, 300);
  };

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] bg-astragard-dark flex items-center justify-center transition-opacity duration-700",
        phase === "done" && "opacity-0 pointer-events-none"
      )}
    >
      {/* Dragon Video */}
      <video
        ref={videoRef}
        src="/videos/dragon-intro.mp4"
        autoPlay
        muted
        playsInline
        className={cn(
          "absolute inset-0 w-full h-full object-cover transition-opacity duration-1000",
          phase !== "video" && "opacity-0"
        )}
        onEnded={() => setPhase("logo")}
      />

      {/* Logo Reveal */}
      <div
        className={cn(
          "relative z-10 flex flex-col items-center transition-all duration-1000",
          phase === "logo" ? "opacity-100 scale-100" : "opacity-0 scale-90"
        )}
      >
        <div className="relative">
          <img
            src="/images/astragard-logo.png"
            alt="Astragard"
            className="h-24 md:h-32 w-auto ember-glow rounded-full"
          />
          {/* Fire particles */}
          {phase === "logo" && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 rounded-full bg-secondary"
                  style={{
                    left: `${50 + Math.cos((i * Math.PI * 2) / 8) * 60}%`,
                    top: `${50 + Math.sin((i * Math.PI * 2) / 8) * 60}%`,
                    animation: `fireParticle${i % 3} ${1 + i * 0.2}s ease-out forwards`,
                    opacity: 0,
                  }}
                />
              ))}
            </div>
          )}
        </div>
        <p className="mt-6 font-heading text-lg md:text-xl text-primary-foreground/80 tracking-[0.2em] animate-fade-in-slow">
          Where Creativity Becomes Limitless
        </p>
      </div>

      {/* Skip Button */}
      {showSkip && phase !== "done" && (
        <button
          onClick={handleSkip}
          className="absolute bottom-8 right-8 text-primary-foreground/40 hover:text-primary-foreground/70 text-sm font-ui transition-colors"
        >
          Skip →
        </button>
      )}

      <style>{`
        @keyframes fireParticle0 {
          0% { opacity: 0.8; transform: translate(0, 0) scale(1); }
          100% { opacity: 0; transform: translate(-20px, -40px) scale(0); }
        }
        @keyframes fireParticle1 {
          0% { opacity: 0.7; transform: translate(0, 0) scale(1.2); }
          100% { opacity: 0; transform: translate(15px, -50px) scale(0); }
        }
        @keyframes fireParticle2 {
          0% { opacity: 0.9; transform: translate(0, 0) scale(0.8); }
          100% { opacity: 0; transform: translate(-10px, -35px) scale(0); }
        }
      `}</style>
    </div>
  );
}
