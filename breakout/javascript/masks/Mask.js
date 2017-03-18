/* global HitBox GridMask */
class Mask {
    constructor(_x, _y) {
        this.x = _x;
        this.y = _y;
        this.offsetX = 0;
        this.offsetY = 0;
    }
    collideCurrent(mask) {
        return this.collide(this.x, this.y, mask);
    }
    collide(x, y, mask) {
        x = Math.floor(x) + this.offsetX;
        y = Math.floor(y) + this.offsetY;
        console.log(x, y);
        var xx = Math.floor(mask.x);
        var yy = Math.floor(mask.y);
        if (mask instanceof GridMask) {
            return (mask.tileSolid(x, y) != 0);
        }
        else if (mask instanceof HitBox) {
            return (x >= xx && y >= yy && x <= xx + mask.width && y <= yy + mask.height);
        }
        return (x == mask.x && y == mask.y);
    }
    update(_x, _y) {
        this.x = _x + this.offsetX;
        this.y = _y + this.offsetY;
    }
    setOffset(_x, _y) {
        this.offsetX = _x;
        this.offsetY = _y;
    }
}
