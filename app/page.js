'use client';

import { useRef, useEffect } from 'react';
import { paint, drawSnake, createFood } from './utility/game';

export default function Home() {

  let snakeSize = 10;
  let w = 700;
  let h = 600;
  let score = 0;
  let snake;
  let food;
  let drawModule;
  let direction = 'right';
  let running = true;

  const determineKeyPress = (ev) => {
    console.log(`pressed: ${ev.code}`);
    // console.log(`pressed - type: ${typeof(ev.code)}`)

    switch (ev.code) {
      case 'ArrowLeft':
        if (direction != 'right') {
          direction = 'left';
        }
        break;

      case 'ArrowRight':
        if (direction != 'left') {
          direction = 'right';
        }
        break;

      case 'ArrowUp':
        if (direction != 'down') {
          direction = 'up';
        }
        break;

      case 'ArrowDown':
        if (direction != 'up') {
          direction = 'down';
        }
        break;
    }
  }

  const canvasRef = useRef(null);
  useEffect(() => {
    document.addEventListener("keydown", (e) => {determineKeyPress(e)});
  }, []);

  function init(context) {
    let snake = drawSnake();
    let food = createFood(snake);
    let gameloop = setInterval(() => { paint(context, true, snake, food, score, direction, w, h, snakeSize, gameloop) }, 70);
  }


  return (
    <main>
      <h1>TEST</h1>

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
      <button id="pause">Pause</button>
    </main>
  );
}
