function Brick(x, y, color, width = 60, height = 25, isShown = true) {
    this.x = x;
    this.y = y;
    this.right = x + width;
    this.bottom = y + height;
    this.width = width;
    this.height = height;
    this.isShown = isShown;
    this.color = color;
}

Brick.prototype.draw = function (ctx) {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
};

export { Brick };
