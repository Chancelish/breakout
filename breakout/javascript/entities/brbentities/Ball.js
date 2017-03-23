/* global Entity */
class Ball extends Entity {
    constructor(_x, _y, _ip = false) {
        super(_x, _y);
        this.setHitBox(14, 14, -7, -7);
        this.timer = 3;
        if (_ip) {
            this.timer = 0;
        }
        this.inPlay = _ip;
        this.bricksBroke = 0;
        this.setType("ball");
    }
    added() {
        this.s_low = this.world.requestSound("low");
        this.s_mid = this.world.requestSound("mid");
        this.s_high = this.world.requestSound("high");
    }
    update(_dt) {
        if (this.timer > 0 && !this.inPlay) {
            this.timer -= _dt;
            let bat = this.world.findByName("bat");
            this.x = bat.x + 72 - 7;
            this.y = bat.y - 7;
            if (this.timer <= 0) {
                this.inPlay = true;
                this.setSpeed(5);
                this.setDirection(-Math.PI/3);
            }
        }
        else {
            if (this.y > 500) {
                let bat = this.collideTypes("bat", this.x, this.y);
                if (bat) {
                    this.setDirection(bat.findHitAngle(this.x, this.y));
                    if (this.s_low.paused) {
                        this.s_low.currentTime = 0;
                        this.s_low.play();
                    }
                }
                if (this.y > 600) {
                    this.setType(null);
                    this.destroy();
                    if (this.world.getCollisionGroup("ball").length == 0) {
                        let sb = this.world.findByName("score_board");
                        sb.loseLive();
                    }
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
                if (brick2 || brick1) {
                    this.bricksBroke += 1;
                    if (this.s_high.paused) {
                        this.s_high.currentTime = 0;
                        this.s_high.play();
                    }
                    if (this.bricksBroke === 4) {
                        this.setSpeed(6);
                    }
                    else if (this.bricksBroke === 12) {
                        this.setSpeed(7.5);
                    }
                    else if (this.bricksBroke === 36) {
                        this.setSpeed(9);
                    }
                    else if (this.bricksBroke === 62) {
                        this.setSpeed(11);
                    }
                }
            }
            if (this.collideTypes("wall", this.x, this.y + this.getYSpeed())) {
                this.setYSpeed(-this.getYSpeed());
                if (this.s_mid.paused) {
                    this.s_mid.currentTime = 0;
                    this.s_mid.play();
                }
            }
            if (this.collideTypes("wall", this.x + this.getXSpeed(), this.y)) {
                this.setXSpeed(-this.getXSpeed());
                if (this.s_mid.paused) {
                    this.s_mid.currentTime = 0;
                    this.s_mid.play();
                }
            }
            this.moveBy(this.getXSpeed(), this.getYSpeed());
            this.mask.update(this.x, this.y);
        }
    }
    render(_g) {
        _g.circle(this.x, this.y, 7, "#FFFFFF", "fill");
        _g.circle(this.x, this.y, 7, "#CCCCDA", "stroke");
        if (this.timer > 0) {
            _g.text(Math.ceil(this.timer).toString(), 340, 340);
        }
    }
}
