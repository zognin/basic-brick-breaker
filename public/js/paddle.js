import { KEY_CODE_LEFT_ARROW, KEY_CODE_RIGHT_ARROW } from './contstants.js';
import { COLOR_PRIMARY } from './contstants.js';

function Paddle(x, y, width, height, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
}

Paddle.prototype.draw = function (ctx) {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
};

Paddle.prototype.getPaddleLeft = function () {
    return this.x;
};

Paddle.prototype.getPaddleRight = function () {
    return this.x + this.width;
};

Paddle.prototype.getPaddleTop = function () {
    return this.y;
};

Paddle.prototype.shiftPaddle = function (e, displacement, canvasWidth) {
    if (e.keyCode == KEY_CODE_LEFT_ARROW) {
        this.x -= displacement;
    }

    if (e.keyCode == KEY_CODE_RIGHT_ARROW) {
        this.x += displacement;
    }

    const maxX = canvasWidth - this.width;
    if (this.x > maxX) {
        this.x = maxX;
    }

    const minX = 0;
    if (this.x < minX) {
        this.x = minX;
    }
};

Paddle.prototype.trackMouse = function (e, canvas) {
    var rect = canvas.getBoundingClientRect();
    var mouseX = e.clientX - rect.left;
    this.x = mouseX - this.width / 2;

    const maxX = canvas.clientWidth - this.width;
    if (this.x > maxX) {
        this.x = maxX;
    }

    const minX = 0;
    if (this.x < minX) {
        this.x = minX;
    }
};

function initializePaddle(canvas) {
    var width = 80;
    var height = 12;
    return new Paddle(
        (canvas.clientWidth - width) / 2,
        canvas.clientHeight - height,
        width,
        height,
        COLOR_PRIMARY
    );
}

export { initializePaddle };
