import { Brick } from './brick.js';
import { COLOR_SECONDARY } from './contstants.js';

function drawBricks(ctx, bricks) {
    var hasBricks = false;
    bricks.forEach((brick) => {
        if (brick.isShown) {
            brick.draw(ctx);
            hasBricks = true;
        }
    });
    return hasBricks;
}

function initializeBricks(
    canvasWidth,
    rows = 4,
    cols = 5,
    gap = 15,
    brickWidth = 60,
    brickHeight = 25,
    brickStartY = 30
) {
    var brickStartX = (canvasWidth - rows * brickWidth - (rows - 1) * gap) / 2;
    var brickX = brickStartX;
    var brickY = brickStartY;

    const bricks = [];
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            const brick = new Brick(
                brickX,
                brickY,
                COLOR_SECONDARY,
                brickWidth,
                brickHeight,
                true
            );
            bricks.push(brick);
            brickY += brickHeight + gap;
        }
        brickX += brickWidth + gap;
        brickY = brickStartY;
    }

    return bricks;
}

export { initializeBricks, drawBricks };
