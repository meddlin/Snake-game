'use client';

import { useRef, useEffect } from 'react';
import { paint, drawSnake, createFood } from './utility/game';
import determineKeyPress from './utility/controls';

export default function Home() {

  let snakeSize = 10;
  let w = 700;
  let h = 600;
  let score = 0;
  
  const canvasRef = useRef(null);

  useEffect(() => {
    document.addEventListener("keydown", (e) => {determineKeyPress(e)});
  }, []);

  function init(context) {
    let snake = drawSnake();
    localStorage.setItem("snake", JSON.stringify(snake));

    let food = createFood(snake);
    localStorage.setItem("food", JSON.stringify(food));

    localStorage.setItem("direction", 'down');

    let gameloop = setInterval(() => { 
        paint(context, snake, score, w, h, snakeSize, gameloop);
    }, 70);
  }

  return (
    <main>
      <h1>SNAKE GAME</h1>

      <canvas
        className="border-solid border-2 border-gray-400"
        ref={canvasRef}
        width="700"
        height="600"
        onClick={(e) => {
          const canvas = canvasRef.current;
          const ctx = canvas.getContext('2d');

          init(ctx);
        }}
      />

      <button id="start">Start</button>
      <button id="end">End</button>
    </main>
  );
}
