"use client";

import { useEffect, useState } from "react";

interface TypingTextProps {
  text: string;
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseAfterTyping?: number;
  restartInterval?: number;
  className?: string;
}

export function TypingText({
  text,
  typingSpeed = 300,
  deletingSpeed = 300,
  pauseAfterTyping = 4000,
  restartInterval = 1000,
  className,
}: TypingTextProps) {
  const [displayed, setDisplayed] = useState("");
  const [phase, setPhase] = useState<"typing" | "pausing" | "deleting" | "waiting">(
    "typing"
  );

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (phase === "typing") {
      if (displayed.length < text.length) {
        timeout = setTimeout(() => {
          setDisplayed(text.slice(0, displayed.length + 1));
        }, typingSpeed);
      } else {
        timeout = setTimeout(() => setPhase("pausing"), pauseAfterTyping);
      }
    }

    if (phase === "pausing") {
      timeout = setTimeout(() => setPhase("deleting"), 0);
    }

    if (phase === "deleting") {
      if (displayed.length > 0) {
        timeout = setTimeout(() => {
          setDisplayed(text.slice(0, displayed.length - 1));
        }, deletingSpeed);
      } else {
        timeout = setTimeout(() => setPhase("waiting"), restartInterval - pauseAfterTyping - text.length * typingSpeed - text.length * deletingSpeed);
      }
    }

    if (phase === "waiting") {
      timeout = setTimeout(() => {
        setPhase("typing");
      }, 300);
    }

    return () => clearTimeout(timeout);
  }, [displayed, phase, text, typingSpeed, deletingSpeed, pauseAfterTyping, restartInterval]);

  return (
    <span className={className}>
      {displayed}
      <span
        aria-hidden="true"
        className="ml-0.5 inline-block h-[0.8em] w-[2px] bg-current align-baseline opacity-90"
        style={{
          animation: "blink-cursor 0.7s step-end infinite",
        }}
      />
    </span>
  );
}
