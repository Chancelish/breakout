/* global Mask */
class CircleMask extends Mask {
    constructor(_x, _y, _r) {
        super(_x, _y);
        this.radius = _r;
    }
}