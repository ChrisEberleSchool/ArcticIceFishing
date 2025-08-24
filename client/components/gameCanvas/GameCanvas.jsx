import { useEffect, useRef } from "react";
import { startGame } from "../../main.js";

import "./GameCanvas.css";

export default function GameCanvas() {
  const containerRef = useRef(null);
  const gameRef = useRef(null); // <-- guard to prevent duplicate instances

  useEffect(() => {
    if (!gameRef.current && containerRef.current) {
      gameRef.current = startGame(containerRef.current);
    }

    // Cleanup on unmount
    return () => {
      if (gameRef.current) {
        gameRef.current.destroy();
        gameRef.current = null;
      }
    };
  }, []);

  return <div ref={containerRef} id="gameCanvasContainer" />;
}
