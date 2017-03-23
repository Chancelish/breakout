/* global Entity ParticleEmitter */
class Brick extends Entity {
    constructor(_x, _y, image, _c) {
        super(_x, _y, image);
        this.setHitBox(48, 24);
        this.image.setFrame(_c);
        this.timer = 0.75;
        this.setType("brick");
        let colour;
        this.value = 1;
        if (_c === 1) {
            colour = "#FFA62F";
        }
        else if (_c === 2) {
            this.value = 2;
            colour = "#D8E162";
        }
        else if (_c === 3) {
            colour = "#4863A0";
            this.value = 3;
        }
        else if (_c === 4) {
            colour = "#4CC552";
            this.value = 5;
        }
        this.emitter = new ParticleEmitter({
            shape: "circle",
            colour: colour,
            useLocal: true,
            r: 3,
            speedMin: 24,
            speedMax: 34,
            directionMin: Math.PI/3,
            directionMax: 2*Math.PI/3,
            lifeMin: 0.5,
            lifeMax: 0.75,
            scaleMin: 0.5,
            scaleMax: 1.33,
            x: this.x,
            y: this.y
        });
    }
    onCollision() {
        this.setType(null);
        let lb = new HitBox(24, this.y + 1, 672, 22);
        let le= new Entity(24, this.y+1, null, lb);
        this.world.addEntity(le);
        let sb = this.world.findByName("score_board");
        if (!le.collideTypes("brick", le.x, le.y)) {
            sb.scorePoints(25);
        }
        sb.scorePoints(this.value);
        if (this.world.getCollisionGroup("brick").length == 0) {
            sb.didWin = true;
            sb.timer = 3;
        }
        if (this.y <= 96) {
            let bat = this.world.findByName("bat");
            bat.changeSize(0.334);
        }
        this.render = (_g) => {
            this.emitter.render(_g);
        };
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 11; j++) {
                this.emitter.colouredShapeParticle(j * 4, i * 4);
            }
        }
        le.destroy();
    }
    update(_dt) {
        if (!this.getType()) {
            this.timer -= _dt;
            if (this.timer <= 0) {
                this.destroy();
            }
            this.emitter.update(_dt);
        }
        
    }
}