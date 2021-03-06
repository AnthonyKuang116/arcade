$('#board').append($('#grid'))

let snakeBody = [{x: 11, y: 7}, {x: 10, y: 7}, {x:9, y: 7},]//starting snake body
let foods = [{x: Math.floor(Math.random() * 20) + 1, y: Math.floor(Math.random() * 20) + 1}]//random food cords between 1 and 20
let newPart = 0;//new body part count from eating food
let nextDir = "right";//default direction when game starts
let score = 0;//default score. Each food is worth 100
let snakeLength = 3;//records snake length score
let snakeCollision = false;


//displays the "start" screen
function startingGame(){
    $('#grid').append($('<div class="start"></div>'))
    const startButton = $('<button class="startButton">Start</button>')
    const intro = $('<p class="intro">Press START to play!</p>')
    const instructions = $('<p class="instructions">Hint: Use your arrow keys to move</p>')
    $('.start').append(intro.css({'color': 'blue', 'font-size': '40px', 'font-weight': 'bold'}))
    $('.start').append(instructions.css({'color': 'blue', 'font-size': '20px'}))
    $('.start').append(startButton)

    $('.start button').click(function(){
        $('.start').fadeOut(1200);//cool fadeout effect when game starts :)
        setTimeout(()=>{
            snakeMovement()
            update()
        }, 1000)
    })
}
startingGame()

//When game ends, display this screen...if "Play Again" button is clicked, resets game
function endGame(){
    $('#grid').append($('<div class="end"></div>'))
    const gameOver = ($('<p class="gameOver">GAME OVER!</p>'))
    const playAgain = $('<button class="playAgainButton">Play Again?</button>')
    $('.end').append(gameOver.css({'color': 'red', 'font-size': '90px', 'font-weight': 'bold'}))
    $('.end').append(playAgain.css({}))

    $('.end button').click(function(){
        $('.end').fadeOut(1200);
        snakeBody = [{x: 11, y: 7}, {x: 10, y: 7}, {x:9, y: 7},]//starting snake body
        foods = [{x: Math.floor(Math.random() * 20) + 1, y: Math.floor(Math.random() * 20) + 1}]//random food cords between 1 and 20
        nextDir = "right";//resets snake direction to default
        score = 0;
        setTimeout(()=>{
            snakeMovement()
            update()
        }, 1000)
    })
}

//renders snake on board
function renderSnake(){
    $('#grid').empty()
    snakeBody.forEach(body =>{
        const snake = document.createElement("div")
        snake.style.gridRowStart = body.y
        snake.style.gridColumnStart = body.x
        snake.classList.add("snake")
        $('#grid').append(snake)
    })
    renderFood()
}

//renders food on board
function renderFood(){
    foods.forEach(cord => {
        const food = document.createElement("div")
        food.style.gridRowStart = cord.y
        food.style.gridColumnStart = cord.x
        food.classList.add("food")
        $('#grid').append(food)
    })
    //events that happen after snake "eats" food
    if((snakeBody[0].x == foods[0].x) && (snakeBody[0].y == foods[0].y)){
        $('.food').remove();
        foods = [{x: Math.floor(Math.random() * 20) + 1, y: Math.floor(Math.random() * 20) + 1}]
        foodCheck()//checks if food spawns ontop of snake
        newPart = newPart + 1//when food is eaten, 1 segment is added to snake
        for(let i = 0; i < newPart; i++){
            snakeBody.push({...snakeBody[snakeBody.length - 1]}) 
        }
        newPart = 0;//reset segment count to keep snake from expanding
        score = score + 100;//adding score per food that is eaten
        snakeLength = snakeLength + 1;
    }
}

//update snake movements
function snakeMovement(){
    // making the snake body follow the head of the snake...snake body takes over the next position of the body when moved
    for(let i = snakeBody.length - 2; i >= 0; i--){//i equals the second to last element
        snakeBody[i + 1] = { ...snakeBody[i] }//i+1 equals last element...take the last element and set it equal to current element position
    }
    
}

//Snake head moves in the direction of the arrow key when pressed
//If snake tries to move backwards, it can't and follows the previous direction
function snakeDirection(){
    $(document).keydown(function(event){
        if(event.which === 38 && nextDir != 'bottom'){
            nextDir = 'top';
        }
        else if(event.which === 37 && nextDir != 'right'){
            nextDir = 'left';
        }
        else if(event.which === 40 && nextDir != 'top'){
            nextDir = 'bottom';
        }
        else if(event.which === 39 && nextDir != 'left'){
            nextDir = 'right';
        }
    })
    if(nextDir === "right"){
        snakeBody[0].x += 1
        snakeBody[0].y += 0
    }
    else if(nextDir === "left"){
        snakeBody[0].x += -1
        snakeBody[0].y += 0
    }
    else if(nextDir === "top"){
        snakeBody[0].x += 0
        snakeBody[0].y += -1
    }
    else if(nextDir === "bottom"){
        snakeBody[0].x += 0
        snakeBody[0].y += 1
    }
}

//updating scoreboard
function updateScoreboard(){
    $('#score').html(`Score: ${score}`)
    $('#length').html(`Snake Length: ${snakeLength}`)
}

//checks if head of snake hits snake body...if it does, game ends
// function selfCollisionCheck(){
//     for(let i = 0; i < snakeBody.length - 1; i++){
//         if((snakeBody[0].x == snakeBody[i].x) && (snakeBody[0].y == snakeBody[i].y)){
//             // endGame()
//             snakeCollision = true;
//         }
//     }
//     console.log(snakeCollision)
// }

//When food spawns ontop of snake, remove food and randomize food spawn location again
function foodCheck(){
    for(let i = 0; i < snakeBody.length - 1; i++){
        if(((snakeBody[i].x == foods[0].x) && (snakeBody[i].y == foods[0].y)) || ((snakeBody[0].x == foods[0].x) && (snakeBody[0].y == foods[0].y))){
            $('.food').remove();
            foods = [{x: Math.floor(Math.random() * 20) + 1, y: Math.floor(Math.random() * 20) + 1}]
        }
    }
}

//updates the entire game every 300 milliseconds
function update(){
    let gameInterval = setInterval(()=>{
        //keeps snake on the board and ends game if it hits a wall.
        if((snakeBody[0].x === 1 && nextDir === "left") 
        || (snakeBody[0].x === 20 && nextDir === "right") 
        || (snakeBody[0].y === 1 && nextDir === "top") 
        || (snakeBody[0].y === 20 && nextDir === "bottom")){
            clearInterval(gameInterval)
            endGame()
        }
        else{
            snakeDirection()
            renderFood()
            foodCheck()
            updateScoreboard()
            renderSnake()
            snakeMovement()
            // selfCollisionCheck()
        }
    },300)
}