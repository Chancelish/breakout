/* global Entity */
class Ball extends Entity {
    constructor(_x, _y, _ip = false) {
        super(_x, _y);
        this.setHitBox(14, 14, -7, -7);
        this.timer = 3;
        this.inPlay = _ip;
    }
    update(_dt) {
        if (this.timer > 0 && !this.inPlay) {
            this.timer -= _dt;
            let bat = this.world.findByName("Bat");
            this.x = bat.x + 72 - 7;
            this.y = bat.y - 7;
            if (this.timer <= 0) {
                this.inPlay = true;
                this.setSpeed(4);
                this.setDirection(-Math.PI/3);
            }
        }
        else {
            if (this.y > 600) {
                let bat = this.collideTypes("bat", this.x, this.y);
                if (bat) {
                    this.setDirection(bat.findHitAngle(this.x, this.y));
                }
            }
            else if (this.y < 480) {
                let brick1 = this.collideTypes("brick", this.x, this.y + this.getYSpeed()); 
                if (brick1) {
                    this.setYSpeed(-this.getYSpeed());
                    brick1.onCollision();
                }
                let brick2 = this.collideTypes("brick", this.x + this.getXSpeed(), this.y);
                if (brick2) {
                    this.setXSpeed(-this.getXSpeed());
                    brick2.onCollision();
                }
            }
            if (this.collideTypes("wall", this.x, this.y + this.getYSpeed())) {
                this.setYSpeed(-this.getYSpeed());
            }
            else if (this.collideTypes("wall", this.x + this.getXSpeed(), this.y)) {
                this.setXSpeed(-this.getXSpeed());
            }
            this.moveBy(this.getXSpeed(), this.getYSpeed());
            this.mask.update(this.x, this.y);
        }
    }
    render(_g) {
        _g.circle(this.x, this.y, 7, "#FFFFFF", "fill");
        _g.circle(this.x, this.y, 7, "#CCCCDA", "stroke");
    }
}
