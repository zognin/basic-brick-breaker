import { getNextPos } from './utils.js';
import { COLOR_PRIMARY } from './contstants.js';

const CHANGE = {
    None: 0,
    X: 1,
    Y: 2,
};

function Ball(canvas, paddle, radius, xChange, yChange, color) {
    this.x = canvas.clientWidth / 2;
    this.y = canvas.clientHeight - radius - paddle.height;
    this.radius = radius;
    this.xChange = xChange;
    this.yChange = yChange;
    this.color = color;
}

Ball.prototype.draw = function (ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
};

Ball.prototype.getBallLeft = function () {
    return this.x - this.radius;
};

Ball.prototype.getBallRight = function () {
    return this.x + this.radius;
};

Ball.prototype.getBallTop = function () {
    return this.y - this.radius;
};

Ball.prototype.getBallBottom = function () {
    return this.y + this.radius;
};

Ball.prototype.willExitLeft = function () {
    return getNextPos(this.getBallLeft(), this.xChange) < 0;
};

Ball.prototype.willExitRight = function (width) {
    return getNextPos(this.getBallRight(), this.xChange) > width;
};

Ball.prototype.willExitTop = function () {
    return getNextPos(this.getBallTop(), this.yChange) < 0;
};

Ball.prototype.willExitBottom = function (height) {
    return getNextPos(this.getBallBottom(), this.yChange) > height;
};

Ball.prototype.willHitPaddle = function (paddle, height) {
    var withinPaddleWidth =
        getNextPos(this.getBallLeft(), this.xChange) <=
            paddle.getPaddleRight() &&
        getNextPos(this.getBallRight(), this.xChange) >= paddle.getPaddleLeft();

    var nextBottomPos = getNextPos(this.getBallBottom(), this.yChange);
    var withinPaddleHeight =
        nextBottomPos > paddle.getPaddleTop() && nextBottomPos < height;

    return withinPaddleWidth && withinPaddleHeight;
};

Ball.prototype.willHitBrickVertically = function (brick) {
    return (
        brick.isShown &&
        this.getBallTop() <= brick.bottom &&
        this.getBallBottom() >= brick.y &&
        getNextPos(this.getBallLeft(), this.xChange) <= brick.right &&
        getNextPos(this.getBallRight(), this.xChange) >= brick.x
    );
};

Ball.prototype.willHitBrickHorizontally = function (brick) {
    return (
        brick.isShown &&
        getNextPos(this.getBallTop(), this.yChange) <= brick.bottom &&
        getNextPos(this.getBallBottom(), this.yChange) >= brick.y &&
        this.getBallLeft() <= brick.right &&
        this.getBallRight() >= brick.x
    );
};

Ball.prototype.willHitAnyBrick = function (bricks) {
    for (const brick of bricks) {
        if (this.willHitBrickHorizontally(brick)) {
            brick.isShown = false;
            return CHANGE.Y;
        }

        if (this.willHitBrickVertically(brick)) {
            brick.isShown = false;
            return CHANGE.X;
        }
    }

    return CHANGE.None;
};

Ball.prototype.shift = function (paddle, bricks, canvas) {
    const canvasWidth = canvas.clientWidth;
    const canvasHeight = canvas.clientHeight;

    if (this.willExitLeft() || this.willExitRight(canvasWidth)) {
        this.xChange = -this.xChange;
    }

    if (this.willExitTop()) {
        this.yChange = -this.yChange;
    }

    if (this.willHitPaddle(paddle, canvasHeight)) {
        this.yChange = -this.yChange;
    } else if (this.willExitBottom(canvasHeight)) {
        return false;
    }

    const change = this.willHitAnyBrick(bricks);
    if (change == CHANGE.X) {
        this.xChange = -this.xChange;
    }
    if (change == CHANGE.Y) {
        this.yChange = -this.yChange;
    }

    this.x = getNextPos(this.x, this.xChange);
    this.y = getNextPos(this.y, this.yChange);
    return true;
};

function initializeBall(canvas, paddle) {
    return new Ball(canvas, paddle, 5, 2, -2, COLOR_PRIMARY);
}

export { initializeBall };
