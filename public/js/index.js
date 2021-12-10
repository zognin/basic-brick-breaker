import { initializeBall } from './ball.js';
import { initializeBricks } from './bricks.js';
import { canvas, ctx } from './canvas.js';
import { drawGame } from './game.js';
import { initializePaddle } from './paddle.js';
import { hideElement } from './utils.js';

const documentElements = {
    successMsg: document.getElementById('successMsg'),
    failureMsg: document.getElementById('failureMsg'),
    replayButton: document.getElementById('replayButton'),
};

hideElement(documentElements.successMsg);
hideElement(documentElements.failureMsg);
hideElement(documentElements.replayButton);

documentElements.replayButton.onclick = () => location.reload();

const bricks = initializeBricks(canvas.clientWidth);
const paddle = initializePaddle(canvas);
const ball = initializeBall(canvas, paddle);

const intervalId = setInterval(
    () => drawGame(ctx, canvas, ball, paddle, bricks, documentElements),
    10
);

document.addEventListener('keydown', (e) =>
    paddle.shiftPaddle(e, 40, canvas.clientWidth)
);
document.addEventListener('mousemove', (e) => paddle.trackMouse(e, canvas));

export { intervalId };
