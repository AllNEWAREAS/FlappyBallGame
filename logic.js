const DEFAULT_SPEED = 30;
const SPEED_FACTOR = 300;
const MAX_BALL_Y = 385;
const MS = 1000;
const TEXT_X_START = 240;
const TEXT_Y_START = 200;
const HAZARD_X_START = 600;
const HAZARD_X_END = -100;
const COIN_R = 5;
const COIN_X_END = -10;
const HAZARD_MIN = 10;
const COIN_MAX = 700;
const COIN_MIN = 600;
const COUNT_X = 10;
const COUNT_Y = 30;

var coinX = 650;
var coinY = 200;
var hazardWidth = 70;
var hazardHeight = 100;
var speed = DEFAULT_SPEED;
var ballX = 300;
var ballY = 385;
var ballR = 15;
var hazardX = 600;
var hazardY = 0;
var coinStatus = false;
var coinCount = 0;
var gameStatus = true;
var canvas, context;
var startTime, timePassed;
var animationHazard, animationCoin;

window.onload = function() {
    document.onkeydown = function() {
        if (gameStatus) {
            startTime = Date.now();
            speed = DEFAULT_SPEED;
            ballY -= speed;
            drawBall();
            drawHazard();
            drawCoin();
        } else {
            gameStatus = true;
            coinX = 650;
            coinY = 200;
            hazardWidth = 70;
            hazardHeight = 100;
            speed = DEFAULT_SPEED;
            ballX = 300;
            ballY = 385;
            ballR = 15;
            hazardX = 600;
            hazardY = 0;
            coinStatus = false;
            coinCount = 0;
            gameStatus = true;
        }
    }

    document.ontouchstart = function() {
        if (gameStatus) {
            startTime = Date.now();
            speed = DEFAULT_SPEED;
            ballY -= speed;
            drawBall();
            drawHazard();
            drawCoin();
        } else {
            gameStatus = true;
            coinX = 650;
            coinY = 200;
            hazardWidth = 70;
            hazardHeight = 100;
            speed = DEFAULT_SPEED;
            ballX = 300;
            ballY = 385;
            ballR = 15;
            hazardX = 600;
            hazardY = 0;
            coinStatus = false;
            coinCount = 0;
            gameStatus = true;
        }
    }

    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");

    context.fillStyle = "white";
    context.arc(ballX, ballY, ballR, 0, 2 * Math.PI);
    context.fill();

    context.font = "25px Arial";
    context.fillStyle = "white";
    context.fillText("Tap to play", TEXT_X_START, TEXT_Y_START);
};

function drawBall() {
    if (gameStatus) {
        context.clearRect(0, 0, canvas.width, canvas.height);

        context.beginPath();
        context.fillStyle = "white";
        context.arc(ballX, ballY, ballR, 0, 2 * Math.PI);
        context.fill();
    
        window.requestAnimationFrame(drawBall);
    
        timePassed = (Date.now() - startTime) / MS;
        startTime = Date.now();
    
        if (ballY <= MAX_BALL_Y) {
            speed += (SPEED_FACTOR * timePassed);
            ballY += speed*timePassed;
        } else {
            context.beginPath();
            context.font = "25px Arial";
            context.fillStyle = "red";
            context.fillText("Tap to play", TEXT_X_START, TEXT_Y_START);
        }
    
        if ((ballX + ballR >= hazardX && ballX - ballR <= hazardX + hazardWidth && ballY - ballR <= hazardHeight)
            || (ballX + ballR >= hazardX && ballX - ballR <= hazardX + hazardWidth && ballY + ballR >= canvas.height - hazardHeight)) {
            gameStatus = false;
        }
    } else {
        drawGameOver();
    }
}

function drawHazard() {
    if (gameStatus) {
        if (animationHazard) {
            window.cancelAnimationFrame(animationHazard);
        }
        
        context.beginPath();
        context.fillStyle = "green";
        context.rect(hazardX, hazardY, hazardWidth, hazardHeight);
        context.rect(hazardX, canvas.height - hazardHeight, hazardWidth, hazardHeight);
        context.fill();
    
        hazardX -= (1 + coinCount * 0.07);

        if (hazardX <= HAZARD_X_END) {
            hazardX = HAZARD_X_START;
            hazardHeight = Math.random() * (canvas.height/2 - ballR*3 - HAZARD_MIN) + HAZARD_MIN;
        }

        while ((coinX + COIN_R >= hazardX && coinX - COIN_R <= hazardX + hazardWidth && coinY - COIN_R <= hazardHeight)
                    || (coinX + COIN_R >= hazardX && coinX - COIN_R <= hazardX + hazardWidth && coinY + COIN_R >= canvas.height - hazardHeight)) {
                coinX = Math.random() * (COIN_MAX - COIN_MIN) + COIN_MIN;
                coinY = Math.random() * ((canvas.height - hazardHeight - ballR) - (hazardHeight + ballR)) + (hazardHeight + ballR);
        }
    
        animationHazard = window.requestAnimationFrame(drawHazard);
    } else {
        drawGameOver();
    }
}

function drawCoin() {
    if (gameStatus) {
        if (animationCoin) {
            window.cancelAnimationFrame(animationCoin);
        }
    
        if (!coinStatus) {
            if (coinX <= ballX + ballR && coinX >= ballX - ballR && coinY <= ballY + ballR && coinY >= ballY - ballR) {
                coinCount++;
                coinStatus = true;
                context.beginPath();
                context.fillStyle = "black";
                context.arc(coinX, coinY, 0, 0, 2 * Math.PI);
                context.fill();
            } else {
                context.beginPath();
                context.fillStyle = "yellow";
                context.arc(coinX, coinY, COIN_R, 0, 2 * Math.PI);
                context.fill();
            }
        } else {
            context.beginPath();
            context.fillStyle = "black";
            context.arc(coinX, coinY, 0, 0, 2 * Math.PI);
            context.fill();
        }
    
        coinX -= (1 + coinCount * 0.07);

        if (coinX <= COIN_X_END || coinStatus) {
            coinStatus = false;
            coinX = Math.random() * (COIN_MAX - COIN_MIN) + COIN_MIN;
            coinY = Math.random() * ((canvas.height - hazardHeight - ballR) - (hazardHeight + ballR)) + (hazardHeight + ballR);
            while ((coinX + COIN_R >= hazardX && coinX - COIN_R <= hazardX + hazardWidth && coinY - COIN_R <= hazardHeight)
                    || (coinX + COIN_R >= hazardX && coinX - COIN_R <= hazardX + hazardWidth && coinY + COIN_R >= canvas.height - hazardHeight)) {
                coinX = Math.random() * (COIN_MAX - COIN_MIN) + COIN_MIN;
                coinY = Math.random() * ((canvas.height - hazardHeight - ballR) - (hazardHeight + ballR)) + (hazardHeight + ballR);
            }
        }
    
        animationCoin = window.requestAnimationFrame(drawCoin);
    
        context.beginPath();
        context.font = "25px Arial";
        context.fillStyle = "yellow";
        context.fillText("Coins: " + coinCount, COUNT_X, COUNT_Y);
    } else {
        drawGameOver();
    }
}

function drawGameOver() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    context.beginPath();
    context.font = "80px Arial";
    context.fillStyle = "red";
    context.fillText("Game Over", 95, 200);

    context.beginPath();
    context.font = "30px Arial";
    context.fillStyle = "white";
    context.fillText("Double tap to try again", 148, 250);

    window.requestAnimationFrame(drawGameOver);
}
