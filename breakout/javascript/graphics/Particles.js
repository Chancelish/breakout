class ParticleEmitter {
    constructor(spec) {
        this.particles = [];
        this.x = spec.x;
        this.y = spec.y;
        this.delay = 0;
        this.repeat = false;
        this.getImage = () => {
            return spec.image;
        };
        this.getShape = () => {
            return spec.shape;
        };
        this.getColour = () => {
            return spec.colour;
        };
        this.getRadius = () => {
            return spec.r;
        };
        this.getSize = () => {
            return spec.size;
        };
        this.useLocalPosition = () => {
            return spec.useLocal;
        };
        this.setUseLocal = (yes) => {
            spec.useLocal = yes;
        };
        this.setLocalPosition = (_x, _y) => {
            this.x = _x;
            this.y = _y;
        };
        this.setMotion = (speedMin = 0, directionMin = 0, speedMax = 0, directionMax = 0) => {
            spec.speedMin = speedMin;
            spec.speedMax = speedMax;
            spec.directionMin = directionMin;
            spec.directionMax = directionMax;
        };
        this.setScale = (scaleMin = 1, scaleMax = 0) => {
            spec.scaleMin = scaleMin;
            spec.scaleMax = scaleMax;
        };
        this.setLife = (lifeMin = 1, lifeMax = 0)  =>{
            spec.lifeMin = lifeMin;
            spec.lifeMax = lifeMax;
        };
        this.selectSpeed = () => {
            if (spec.hasOwnProperty("speedMin") && spec.hasOwnProperty("speedMax")) {
                let f = spec.speedMin + Math.random() * (spec.speedMax - spec.speedMin);
                if (!isNaN(f)) {
                    return f;
                }
            }
            if (spec.speedMin) {
                return spec.speedMin;
            }
            if (spec.speedMax) {
                return spec.speedMax;
            }
            return 0;
        };
        this.selectDirection = () => {
            if (spec.hasOwnProperty("directionMin") && spec.hasOwnProperty("directionMax")) {
                let f = spec.directionMin + Math.random() * (spec.directionMax - spec.directionMin);
                if (!isNaN(f)) {
                    return f;
                }
            }
            if (spec.directionMin) {
                return spec.directionMin;
            }
            if (spec.directionMax) {
                return spec.directionMax;
            }
            return 0;
        };
        this.selectScale = () => {
            if (spec.scaleMin && spec.scaleMax) {
                let f = spec.scaleMin+ Math.random() * (spec.scaleMax - spec.scaleMin);
                if (!isNaN(f)) {
                    return f;
                }
            }
            if (spec.scaleMin) {
                return spec.scaleMin;
            }
            if (spec.scaleMax) {
                return spec.scaleMax;
            }
            return 1;
        };
        this.selectLife = () => {
            if (spec.lifeMin && spec.lifeMax) {
                let f = spec.lifeMin+ Math.random() * (spec.lifeMax - spec.lifeMin);
                if (!isNaN(f)) {
                    return f;
                }
            }
            if (spec.lifeMin) {
                return spec.lifeMin;
            }
            if (spec.lifeMax) {
                return spec.lifeMax;
            }
            return 1;
        };
    }
    imageParticle(_x, _y) {
        if (!this.getImage()) {
            return;
        }
        let ptcl = {};
        ptcl.x = _x;
        ptcl.y = _y;
        if (this.useLocalPosition()) {
            ptcl.x += this.x;
            ptcl.y += this.y;
        }
        ptcl.life = this.selectLife();
        ptcl.speed = this.selectSpeed();
        ptcl.direction = this.selectDirection();
        ptcl.scale = this.selectScale();
        ptcl.render = function(_g) {
            let image = this.getImage();
            _g.stretchedImage(image, 0, 0, image.width, image.height, ptcl.x, ptcl.y, ptcl.scale, ptcl.scale);
        }
        ptcl.update = function(_dt) {
            ptcl.life -= _dt;
            ptcl.x += ptcl.xSpeed * _dt;
            ptcl.y += ptcl.ySpeed * _dt;
        };
        this.particles.push(ptcl);
    }
    colouredShapeParticle(_x, _y) {
        if (!this.getShape()) {
            return;
        }
        let ptcl = {};
        ptcl.colour = this.getColour();
        ptcl.x = _x;
        ptcl.y = _y;
        if (this.useLocalPosition()) {
            ptcl.x += this.x;
            ptcl.y += this.y;
        }
        ptcl.life = this.selectLife();
        ptcl.speed = this.selectSpeed();
        ptcl.direction = this.selectDirection();
        ptcl.scale = this.selectScale();
        ptcl.xSpeed = ptcl.speed * Math.cos(ptcl.direction);
        ptcl.ySpeed = ptcl.speed * Math.sin(ptcl.direction);
        if (this.getShape() == "rectangle") {
            let w = this.getSize().w * ptcl.scale;
            let h = this.getSize().h * ptcl.scale;
            ptcl.render = function(_g) {
                _g.rectangle(ptcl.x, ptcl.y, w, h, ptcl.colour, "fill");
            };
        }
        else if (this.getShape() == "circle") {
            let r = this.getRadius() * ptcl.scale;
            ptcl.render = function(_g) {
                _g.circle(ptcl.x, ptcl.y, r, ptcl.colour, "fill");
            };
        }
        else {
            ptcl.render = function(_g) {
               
            };
        }
        ptcl.update = function(_dt) {
            ptcl.life -= _dt;
            ptcl.x += ptcl.xSpeed * _dt;
            ptcl.y += ptcl.ySpeed * _dt;
        };
        this.particles.push(ptcl);
    }
    update(_dt) {
        for (let i = 0; i < this.particles.length; i++) {
            this.particles[i].update(_dt);
            if (this.particles[i].life <= 0) {
                this.particles.splice(i, 1);
                i--;
            }
        }
    }
    render(_g) {
        for (let i = 0; i < this.particles.length; i++) {
            this.particles[i].render(_g);
        }
    }
}
