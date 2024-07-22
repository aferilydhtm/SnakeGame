import React, { useState, useEffect } from "react";

const CELL_SIZE = 18; // Ukuran sel dalam piksel

const BOARD_SIZE = 19; // Ukuran papan (20x20 sel)

const generateFood = (snake) => {
  let food;

  do {
    food = {
      x: Math.floor(Math.random() * BOARD_SIZE),
      y: Math.floor(Math.random() * BOARD_SIZE),
    };
  } while (snake.some((segment) => segment.x === food.x && segment.y === food.y));

  return food;
};

const SnakeGame = () => {
  const [snake, setSnake] = useState([{ x: 5, y: 5 }]);
  const [food, setFood] = useState(() => generateFood([{ x: 5, y: 5 }])); // Initial snake state
  const [direction, setDirection] = useState("RIGHT");
  const [gameOver, setGameOver] = useState(false);
   const [velocity, setVelocity] = useState({ x: 0, y: 0 }); // Add velocity state

  useEffect(() => {
    if (gameOver) return;

    const handleKeyPress = (e) => {
      switch (e.key) {
        case "ArrowUp":
          setDirection("UP");

          setVelocity({ x: 0, y: -1 });

          break;

        case "ArrowDown":
          setDirection("DOWN");

          setVelocity({ x: 0, y: 1 });

          break;

        case "ArrowLeft":
          setDirection("LEFT");

          setVelocity({ x: -1, y: 0 });

          break;

        case "ArrowRight":
          setDirection("RIGHT");

          setVelocity({ x: 1, y: 0 });

          break;

        default:
          break;
      }
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [gameOver]);

  useEffect(() => {
    if (gameOver) return;

    const animationFrame = requestAnimationFrame(() => {
      moveSnake();
    });

    return () => cancelAnimationFrame(animationFrame);
  }, [snake, direction, gameOver, velocity]);

  const moveSnake = () => {
    const newSnake = [...snake];

    const head = { ...newSnake[0] };

    head.x += velocity.x;

    head.y += velocity.y;

    newSnake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      setFood(generateFood(newSnake));
    } else {
      newSnake.pop();
    }

    if (isCollision(head)) {
      setGameOver(true);

      return;
    }

    setSnake(newSnake);
  };

  const isCollision = (head) => {
    return head.x < 0 || head.x >= BOARD_SIZE || head.y < 0 || head.y >= BOARD_SIZE || snake.some((segment) => segment.x === head.x && segment.y === head.y);
  };

  return (
    <div className="relative bg-gray-800 p-4 max-w-sm mx-auto my-8 rounded-md border border-gray-600">
      <div
        className="relative"
        style={{
          display: "grid",

          gridTemplateColumns: `repeat(${BOARD_SIZE}, ${CELL_SIZE}px)`,

          gridTemplateRows: `repeat(${BOARD_SIZE}, ${CELL_SIZE}px)`,

          gap: "0",

          border: "1px solid #4a5568",

          maxWidth: `${BOARD_SIZE * CELL_SIZE}px`, // Add this line

          maxHeight: `${BOARD_SIZE * CELL_SIZE}px`, // Add this line
        }}
      >
        {Array.from({ length: BOARD_SIZE * BOARD_SIZE }).map((_, index) => {
          const x = index % BOARD_SIZE;
          const y = Math.floor(index / BOARD_SIZE);
          const isSnake = snake.some((segment) => segment.x === x && segment.y === y);
          const isFood = food.x === x && food.y === y;

          return (
            <div
              key={index}
              style={{
                width: `${CELL_SIZE}px`,
                height: `${CELL_SIZE}px`,
                backgroundColor: isSnake ? "green" : isFood ? "red" : "#4a5568",
              }}
            />
          );
        })}
      </div>
      {gameOver && <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 text-white text-xl font-bold">Game Over</div>}
      <div className="mt-4 items-center text-center">
        <button className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700 px-4" onClick={() => setDirection("UP")}>
          Up <i class="fa-solid fa-arrow-up"></i>
        </button>
        <div class="flex justify-center mt-3 mb-3">
          <button className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700 mr-3 px-3" onClick={() => setDirection("LEFT")}>
            <i class="fa-solid fa-arrow-left"></i> Left
          </button>
          <br />
          <button className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700" onClick={() => setDirection("RIGHT")}>
            Right <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>
        <button className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700" onClick={() => setDirection("DOWN")}>
          Down <i class="fa-solid fa-arrow-down"></i>
        </button>
      </div>
    </div>
  );
};

export default SnakeGame;
