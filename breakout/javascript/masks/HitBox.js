/* global Mask GridMask*/
class HitBox extends Mask {
    constructor(_x, _y, _width, _height) {
        super(_x, _y);
        this.width = _width;
        this.height = _height;
    }
    setSize(_w, _h) {
        this.width = _w;
        this.height = _h;
    }
    collideCurrent(mask) {
        return this.collide(this.x, this.y, mask);
    }
    collide(x, y, mask) {
        x = Math.floor(x) + this.offsetX;
        y = Math.floor(y) + this.offsetY;
        var xx = Math.floor(mask.x);
        var yy = Math.floor(mask.y);
        if (mask instanceof GridMask) {
            return mask.rectangluarRegion(x, y, this.width, this.height);
        }
        else if (mask instanceof HitBox) {
            return !(x >= xx + mask.width || x + this.width <= xx || y >= yy + mask.height || y + this.height <= yy);
        }
        return (xx >= x && xx <= x + this.width && yy >= y && yy <= y + this.height);
    }
}
