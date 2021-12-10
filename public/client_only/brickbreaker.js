var canvas = document.getElementById('gameCanvas');
var ctx = canvas.getContext('2d');
var canvasWidth = canvas.clientWidth;
var canvasHeight = canvas.clientHeight;

const paddle = {
    x: (canvasWidth - 80) / 2,
    y: canvasHeight - 12,
    width: 80,
    height: 12,
};

const ball = {
    radius: 5,
    x: canvasWidth / 2,
    y: canvasHeight - 5 - paddle.height,
    xChange: 2,
    yChange: -2,
};

const COLOR_PRIMARY = '#ffa438';
const COLOR_SECONDARY = '#633208';

const KEY_CODE_LEFT_ARROW = '37';
const KEY_CODE_RIGHT_ARROW = '39';

const CHANGE = {
    None: 0,
    X: 1,
    Y: 2,
};

function drawBall(ball) {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = COLOR_PRIMARY;
    ctx.fill();
    ctx.closePath();
}

function drawPaddle(paddle) {
    ctx.beginPath();
    ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.fillStyle = COLOR_PRIMARY;
    ctx.fill();
    ctx.closePath();
}

document.addEventListener('keydown', (e) => shiftPaddle(e, paddle));

function shiftPaddle(e, paddle) {
    var paddleDisplacement = 40;
    if (e.keyCode == KEY_CODE_LEFT_ARROW) {
        paddle.x -= paddleDisplacement;
    }

    if (e.keyCode == KEY_CODE_RIGHT_ARROW) {
        paddle.x += paddleDisplacement;
    }

    const maxX = canvasWidth - paddle.width;
    if (paddle.x > maxX) {
        paddle.x = maxX;
    }

    const minX = 0;
    if (paddle.x < minX) {
        paddle.x = minX;
    }
}

document.addEventListener('mousemove', (e) => trackMouse(e, paddle));

function trackMouse(e, paddle) {
    var rect = canvas.getBoundingClientRect();
    var mouseX = e.clientX - rect.left;
    paddle.x = mouseX - paddle.width / 2;

    const maxX = canvas.clientWidth - paddle.width;
    if (paddle.x > maxX) {
        paddle.x = maxX;
    }

    const minX = 0;
    if (paddle.x < minX) {
        paddle.x = minX;
    }
}

function getNextPos(curr, change) {
    return curr + change;
}

function getBallLeft(ball) {
    return ball.x - ball.radius;
}

function getBallRight(ball) {
    return ball.x + ball.radius;
}

function getBallTop(ball) {
    return ball.y - ball.radius;
}

function getBallBottom(ball) {
    return ball.y + ball.radius;
}

function willExitLeft(ball) {
    return getNextPos(getBallLeft(ball), ball.xChange) < 0;
}

function willExitRight(ball, width) {
    return getNextPos(getBallRight(ball), ball.xChange) > width;
}

function willExitTop(ball) {
    return getNextPos(getBallTop(ball), ball.yChange) < 0;
}

function willExitBottom(ball, height) {
    return getNextPos(getBallBottom(ball), ball.yChange) > height;
}

function willHitPaddle(ball, paddle, canvasHeight) {
    var withinPaddleWidth =
        getNextPos(getBallLeft(ball), ball.xChange) <=
            paddle.x + paddle.width &&
        getNextPos(getBallRight(ball), ball.xChange) >= paddle.x;

    var nextBottomPos = getNextPos(getBallBottom(ball), ball.yChange);
    var withinPaddleHeight =
        nextBottomPos > paddle.y && nextBottomPos < canvasHeight;

    return withinPaddleWidth && withinPaddleHeight;
}

function drawGameOver() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    drawBall(ball);
    drawPaddle(paddle);
}

function shiftBall(ball, paddle, bricks) {
    if (willExitLeft(ball) || willExitRight(ball, canvasWidth)) {
        ball.xChange = -ball.xChange;
    }

    if (willExitTop(ball)) {
        ball.yChange = -ball.yChange;
    }

    if (willHitPaddle(ball, paddle, canvasHeight)) {
        ball.yChange = -ball.yChange;
    } else if (willExitBottom(ball, canvasHeight)) {
        return false;
    }

    const change = willHitAnyBrick(ball, bricks);
    if (change == CHANGE.X) {
        ball.xChange = -ball.xChange;
    }
    if (change == CHANGE.Y) {
        ball.yChange = -ball.yChange;
    }

    ball.x = getNextPos(ball.x, ball.xChange);
    ball.y = getNextPos(ball.y, ball.yChange);
    return true;
}

var brickWidth = 60;
var brickHeight = 25;

function drawBrick(x, y, width, height) {
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.fillStyle = COLOR_SECONDARY;
    ctx.fill();
    ctx.closePath();
}

function drawBricks(bricks, brickWidth, brickHeight) {
    var hasBricks = false;
    bricks.forEach((brick) => {
        if (brick.isShown) {
            drawBrick(brick.x, brick.y, brickWidth, brickHeight);
            hasBricks = true;
        }
    });
    return hasBricks;
}

function initializeBricks(brickWidth, brickHeight) {
    var rows = 5;
    var cols = 4;
    var brickGap = 15;

    var brickStartX =
        (canvasWidth - rows * brickWidth - (rows - 1) * brickGap) / 2;
    var brickStartY = 30;
    var brickX = brickStartX;
    var brickY = brickStartY;

    const bricks = [];
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            const brick = {
                x: brickX,
                y: brickY,
                right: brickX + brickWidth,
                bottom: brickY + brickHeight,
                isShown: true,
            };
            bricks.push(brick);
            brickY += brickHeight + brickGap;
        }
        brickX += brickWidth + brickGap;
        brickY = brickStartY;
    }

    return bricks;
}

function willHitBrickVertically(ball, brick) {
    return (
        brick.isShown &&
        getBallTop(ball) <= brick.bottom &&
        getBallBottom(ball) >= brick.y &&
        getNextPos(getBallLeft(ball), ball.xChange) <= brick.right &&
        getNextPos(getBallRight(ball), ball.xChange) >= brick.x
    );
}

function willHitBrickHorizontally(ball, brick) {
    return (
        brick.isShown &&
        getNextPos(getBallTop(ball), ball.yChange) <= brick.bottom &&
        getNextPos(getBallBottom(ball), ball.yChange) >= brick.y &&
        getBallLeft(ball) <= brick.right &&
        getBallRight(ball) >= brick.x
    );
}

function willHitAnyBrick(ball, bricks) {
    for (const brick of bricks) {
        if (willHitBrickHorizontally(ball, brick)) {
            brick.isShown = false;
            return CHANGE.Y;
        }

        if (willHitBrickVertically(ball, brick)) {
            brick.isShown = false;
            return CHANGE.X;
        }
    }

    return CHANGE.None;
}

const successMsg = document.getElementById('successMsg');
const replayButton = document.getElementById('replayButton');
function replay() {
    location.reload();
}
replayButton.onclick = () => replay();

function hideElement(element) {
    element.style.display = 'none';
}

function showInlineBlockElement(element) {
    element.style.display = 'inline-block';
}

function showBlockElement(element) {
    element.style.display = 'block';
}

function drawGame() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    drawBall(ball);
    drawPaddle(paddle);
    const isContinue = shiftBall(ball, paddle, bricks);
    if (!isContinue) {
        endGame();
        return;
    }

    const hasBricks = drawBricks(bricks, brickWidth, brickHeight);
    if (!hasBricks) {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        showBlockElement(successMsg);
        showInlineBlockElement(replayButton);
        clearInterval(intervalId);
    }
}

const failureMsg = document.getElementById('failureMsg');
function endGame() {
    clearInterval(intervalId);
    drawGameOver();
    showBlockElement(failureMsg);
    showInlineBlockElement(replayButton);
}

hideElement(successMsg);
hideElement(replayButton);
hideElement(failureMsg);
var bricks = initializeBricks(brickWidth, brickHeight);
var intervalId = setInterval(drawGame, 10);
