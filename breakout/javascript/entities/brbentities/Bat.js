/* global Entity */
class Bat extends Entity {
    constructor(_x, _y, image, mask) {
        super(_x, _y, image, mask);
        this.setHitBox(144, 24);
        this.setType("bat");
        this.name = "Bat";
        this.stretchValue = 1;
    }
    update(_dt) {
        if (this.world.requestInput("ArrowLeft") || this.world.requestInput("Left")) {
            this.moveBy(-720 * _dt, 0, "wall");
        }
        else if (this.world.requestInput("ArrowRight") || this.world.requestInput("Right")) {
            this.moveBy(600 * _dt, 0, "wall");
        }
        this.mask.update(this.x, this.y);
    }
    findHitAngle(_x, _y) {
        let min = 25;
        let max = 155;
        let pos = _x - this.x;
        let scf = pos / (this.stretchValue * 144);
        return -(max - (scf*(max-min)))*Math.PI/180;
    }
}