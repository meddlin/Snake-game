import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

/*
*	CREDIT: http://www.competa.com/blog/how-to-build-a-snake-game-using-javascript-and-html5-canvas/
* 	Maria's Snake code on Github: https://github.com/Mariacristina88/Snake-game
*	Original author: Maria Di Termine
*/


var mycanvas;
var ctx;
var snakeSize = 10; 
var w = 700;
var h = 600;
var score = 0;
var snake;
var food;
var drawModule;
var direction;
var running = true;

var determineKeyPress = function(keyCode) {
	switch (keyCode) {
        case 37:
            if (direction != 'right') {
                direction = 'left';
            }
            break;

        case 39:
            if (direction != 'left') {
                direction = 'right';
            }
            break;

        case 38:
            if (direction != 'down') {
                direction = 'up';
            }
            break;

        case 40:
            if (direction != 'up') {
                direction = 'down';
            }
            break;
        }
};


Template.game.onCreated(function () {
	/*
	* NOTE : hacked out event listener because the 'keydown' event wasn't working
	*			in the 'events' Template helper.
	*/
	document.addEventListener('keydown', (event) => {
		determineKeyPress(event.keyCode);
	});
} );

Template.game.onRendered(function() {

	mycanvas = document.getElementById('canvas');
	ctx = mycanvas.getContext('2d');
	var btn = document.getElementById('btn');

	drawModule = (function() {
		var bodySnake = function(x, y) {
			// This is the single square
			ctx.fillStyle = "green";
			ctx.fillRect(x * snakeSize, y * snakeSize, snakeSize, snakeSize);

			// This is the border of the square
			ctx.strokeStyle = "darkgreen";
			ctx.strokeRect(x * snakeSize, y * snakeSize, snakeSize, snakeSize);

		}

		// TODO : The pizza being drawn with these dimensions appears to throw off
		//			the collision detection. The graphic seems to be bigger than
		//			the 'hit area'.
		var pizza = function(x, y) {
		    // This is the border of the pizza
		    ctx.fillStyle = 'yellow';
		    //ctx.fillRect(x*snakeSize, y*snakeSize, snakeSize, snakeSize);
		    ctx.beginPath();
		    ctx.arc(x * snakeSize, y * snakeSize, 3, 0, 2 * Math.PI, false);
		    ctx.fill();

		    // This is the single square 
		    ctx.fillStyle = 'red';
		    //ctx.fillRect(x*snakeSize+1, y*snakeSize+1, snakeSize-2, snakeSize-2);
		    ctx.beginPath();
		    ctx.arc(x * snakeSize + 1, y * snakeSize + 1, 5, 0, 2 * Math.PI, false);
		    ctx.stroke();
		}

		var scoreText = function() {
		    // How many pizzas did the snake eat
		    var score_text = "Score: " + score;
		    ctx.fillStyle = 'blue';
		    ctx.fillText(score_text, 145, h-5);
		}

		var drawSnake = function() {
		    // Initially the body of the snake will be formed by 5 squares.
		    var length = 4;
		    snake = [];
		    
		    // Using a for loop we push the 5 elements inside the array(squares).
		    // Every element will have x = 0 and the y will take the value of the index.
		    for (var i = length; i >= 0; i--) {
		        snake.push({x:i, y:0});
		    }  
		}

		var createFood = function() {
			food = {
				x: Math.floor((Math.random() * 30) + 1),
				y: Math.floor((Math.random() * 30) + 1),
			}

			// Look at the position of the snake's body.
			for (var i = 0; i > snake.length; i++) {
				var snakeX = snake[i].x;
				var snakeY = snake[i].y;

				if (food.x === snakeX || food.y === snakeY || food.y === snakeY && food.x === snakeX) {
					food.x = Math.floor((Math.random() * 30) + 1);
					food.y = Math.floor((Math.random() * 30) + 1);
				}
			}
		}

		var checkCollision = function(x, y, array) {
	        for(var i = 0; i < array.length; i++) {
	            if(array[i].x === x && array[i].y === y)
	            return true;
	        } 
	        return false;
	    }

	    var paint = function() {

	    	if (running) {
	    		//Let's draw the space in which the snake will move.
		    	ctx.fillStyle = "lightgray";
		    	ctx.fillRect(0, 0, w, h);

		    	//Give it a border.
		    	ctx.strokeStyle = "black";
		    	ctx.strokeRect(0, 0, w, h);

		    	//Disable the button _start_ while you're playing.
	    		btn.setAttribute('disabled', true);

	    		var snakeX = snake[0].x;
	    		var snakeY = snake[0].y;

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
			    if (snakeX == -1 || snakeX == w / snakeSize || snakeY == -1 || snakeY == h / snakeSize || checkCollision(snakeX, snakeY, snake)) {
			        //Stop the game.

			        //Make the start button enabled again.
			        btn.removeAttribute('disabled', true);

			        //Clean up the canvas.
			        ctx.clearRect(0, 0, w, h);
			        gameloop = clearInterval(gameloop);
			        return;
			    }

			    // If the snake eats food it becomes longer and this means that, in this case, you shouldn't pop out the last element of the array.
			    if (snakeX == food.x && snakeY == food.y) {
			        // Create a new square instead of moving the tail.
			        var tail = {
			            x: snakeX,
			            y: snakeY
			        };
			        score++;

			        //Create new food.
			        createFood();
			    } else {

			        //Pop out the last cell.
			        var tail = snake.pop();
			        tail.x = snakeX;
			        tail.y = snakeY;
			    }

			    //Puts the tail as the first cell.
			    snake.unshift(tail);

			    //For each element of the array create a square using the bodySnake function we created before.
			    for (var i = 0; i < snake.length; i++) {
			        bodySnake(snake[i].x, snake[i].y);
			    }

			    //Create food using the _pizza_ function.
			    pizza(food.x, food.y);

			    //Put the score text.
			    scoreText();
	    	}

	    	
	    }

	    var init = function() {
	    	score = 0;
	    	direction = "down";
	    	drawSnake();
	    	createFood();
	    	gameloop = setInterval(paint, 80);
	    }

	    return {
	    	init: init
	    };

	}());
});

Template.game.helpers({
  counter() {
    return Template.instance().counter.get();
  },
});

Template.game.events({
	'click #btn'(event, instance) {
		drawModule.init();
	},
	'click #btn-end'(event, instance) {
		//Make the start button enabled again.
		var btn = document.getElementById('btn');
        btn.removeAttribute('disabled', true);

        //Clean up the canvas.
        ctx.clearRect(0, 0, w, h);
        gameloop = clearInterval(gameloop);
	},
	'click #btn-pause'(event, instance) {
		running = !running;
		let btn = document.getElementById('btn-pause');
		if (running) btn.textContent = 'Pause';
		if (!running) btn.textContent = 'Resume';
	}
});
