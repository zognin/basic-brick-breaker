import { showInlineBlockElement, showBlockElement } from './utils.js';
import { intervalId } from './index.js';
import { drawBricks } from './bricks.js';

function drawGame(ctx, canvas, ball, paddle, bricks, documentElements) {
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    ball.draw(ctx);
    paddle.draw(ctx);

    const isContinue = ball.shift(paddle, bricks, canvas);
    if (!isContinue) {
        endGame(ctx, canvas, ball, paddle, documentElements);
        return;
    }

    const hasBricks = drawBricks(ctx, bricks);
    if (!hasBricks) {
        showGameSuccess(ctx, canvas, documentElements);
    }
}

function showGameSuccess(ctx, canvas, documentElements) {
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    showBlockElement(documentElements.successMsg);
    showInlineBlockElement(documentElements.replayButton);
    clearInterval(intervalId);
}

function drawGameOver(ctx, canvas, ball, paddle) {
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    ball.draw(ctx);
    paddle.draw(ctx);
}

function endGame(ctx, canvas, ball, paddle, documentElements) {
    clearInterval(intervalId);
    drawGameOver(ctx, canvas, ball, paddle);
    showBlockElement(documentElements.failureMsg);
    showInlineBlockElement(documentElements.replayButton);
}

export { drawGame };
