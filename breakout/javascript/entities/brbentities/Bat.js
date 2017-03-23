/* global Entity */
class Bat extends Entity {
    constructor(_x, _y, image, mask) {
        super(_x, _y, image, mask);
        this.changeSize(0.667);
        this.setType("bat");
        this.name = "bat";
    }
    update(_dt) {
        if (this.world.requestInput("ArrowLeft") || this.world.requestInput("Left")) {
            this.moveBy(-720 * _dt, 0, "wall");
        }
        else if (this.world.requestInput("ArrowRight") || this.world.requestInput("Right")) {
            this.moveBy(720 * _dt, 0, "wall");
        }
        this.mask.update(this.x, this.y);
    }
    findHitAngle(_x, _y) {
        let min = 30;
        let max = 150;
        let pos = _x - this.x;
        let scf = pos / (this.stretchValue * 144);
        return -(max - (scf*(max-min)))*Math.PI/180;
    }
    render(_g) {
        this.image.stretched(_g, this.x, this.y, this.stretchValue, 1);
    }
    changeSize(_sf) {
        this.stretchValue = _sf;
        this.setHitBox(144*this.stretchValue, 24);
        if (this.collideTypes("wall", this.x, this.y)) {
            this.x -= 48;
        }
    }
}