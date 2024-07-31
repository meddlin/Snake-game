

export const bodySnake = (context, x, y, snakeSize) => {
    context.fillStyle = "green";
    context.fillRect(x * snakeSize, y * snakeSize, snakeSize, snakeSize);

    // This is the border of the square
    context.strokeStyle = "darkgreen";
    context.strokeRect(x * snakeSize, y * snakeSize, snakeSize, snakeSize);
};

export const drawSnake = () => {
    // Initially the body of the snake will be formed by 5 squares.
    let length = 4;
    let snake = [];

    // Using a for loop we push the 5 elements inside the array(squares).
    // Every element will have x = 0 and the y will take the value of the index.
    for (let i = length; i >= 0; i--) {
        snake.push({ x: i, y: 0 });
    }

    return snake;
}

export const pizza = (context, x, y, snakeSize) => {
    /* This is the border of the pizza */
    context.fillStyle = "yellow";
    context.beginPath();
    context.arc(x * snakeSize, y * snakeSize, 3, 0, 2 * Math.PI, false);
    context.fill();

    /* This is the single square */
    context.fillStyle = "red";
    context.beginPath();
    context.arc(x * snakeSize + 1, y * snakeSize + 1, 5, 0, 2 * Math.PI, false);
    context.stroke();
};

export const scoreText = (context, score, height) => {
    let text = "Score: " + score;
    context.fillStyle = "blue";
    context.fillText(text, 145, height - 5);
};

export const createFood = (snake) => {
    let food = {
        x: Math.floor((Math.random() * 30) + 1),
        y: Math.floor((Math.random() * 30) + 1),
    }

    // Look at the position of the snake's body.
    for (let i = 0; i > snake.length; i++) {
        let snakeX = snake[i].x;
        let snakeY = snake[i].y;

        if (food.x === snakeX || food.y === snakeY || food.y === snakeY && food.x === snakeX) {
            food.x = Math.floor((Math.random() * 30) + 1);
            food.y = Math.floor((Math.random() * 30) + 1);
        }
    }

    return food;
};

const checkCollision = (x, y, array) => {
    for (let i = 0; i < array.length; i++) {
        if (array[i].x === x && array[i].y === y)
            return true;
    }

    return false;
};

export const paint = (context, snake, score, width, height, snakeSize, gameloop) => {

    let direction = localStorage.getItem("direction");


    //Let's draw the space in which the snake will move.
    context.fillStyle = "lightgray";
    context.fillRect(0, 0, width, height);

    //Give it a border.
    context.strokeStyle = "black";
    context.strokeRect(0, 0, width, height);

    // //Disable the button _start_ while you're playing.
    // btn.setAttribute('disabled', true);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    /*
        Make the snake move.
        Use a variable ('direction') to control the movement.
        To move the snake, pop out the last element of the array and shift it on the top as first element.
    */
    if (direction == 'right') {
        snakeX++;
    } else if (direction == 'left') {
        snakeX--;
    } else if (direction == 'up') {
        snakeY--;
    } else if (direction == 'down') {
        snakeY++;
    }

    /*
        If the snake touches the canvas path or itself, it will die!
        Therefore if x or y of an element of the snake, don't fit inside the canvas, the game will be stopped.
        If the check_collision is true, it means the the snake has crashed on its body itself, then the game will be stopped again. 
    */
    if (snakeX == -1 || snakeX == width / snakeSize || snakeY == -1 || snakeY == height / snakeSize || checkCollision(snakeX, snakeY, snake)) {
        //Stop the game.

        // //Make the start button enabled again.
        // btn.removeAttribute('disabled', true);

        //Clean up the canvas.
        context.clearRect(0, 0, width, height);
        gameloop = clearInterval(gameloop);
        return;
    }

    // If the snake eats food it becomes longer and this means that, in this case, you shouldn't pop out the last element of the array.
    let tail = {};
    let food = JSON.parse(localStorage.getItem("food"));
    if (snakeX == food.x && snakeY == food.y) {
        // Create a new square instead of moving the tail.
        tail = {
            x: snakeX,
            y: snakeY
        };
        score = score + 1;

        //Create new food.
        // food = createFood(snake);
        localStorage.setItem("food", JSON.stringify(createFood(snake)));
    } else {
        //Pop out the last cell.
        tail = snake.pop();
        tail.x = snakeX;
        tail.y = snakeY;
    }

    //Puts the tail as the first cell.
    snake.unshift(tail)

    //For each element of the array create a square using the bodySnake function we created before.
    for (var i = 0; i < snake.length; i++) {
        bodySnake(context, snake[i].x, snake[i].y, snakeSize);
    }

    //Create food using the _pizza_ function.
    food = JSON.parse(localStorage.getItem("food"));
    pizza(context, food.x, food.y, snakeSize);

    //Put the score text.
    scoreText(context, score, height);

};