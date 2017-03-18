/* global HitBox*/
class Entity {
    /**
     * Creates and entity and places it in the world.
     * @param x     - x coordinate
     * @param y     - y coordinate
     * @param image - graphic to render in the render function
     * @param mask  - collision mask used for collison detection.
     */
    constructor(_x, _y, image = null, mask = null) {
        let removed = false;
        let type = null;
        this.x = _x;
        this.y = _y;
        this.image = image;
        this.mask = mask;
        this.visible = true;
        this.speed = 0;
        this.direction = 0;
        this.xSpeed = 0;
        this.ySpeed = 0;
        this.destroy = () => {
            removed = true;
        };
        this.shouldRemove = () => {
            return removed;
        };
        this.getType = () => {
            return type;
        };
        this.setType = (t) => {
            if (this.world) {
                let oldType = this.getType();
                type = t;
                this.world.updateCollisionGroups(this, oldType);
                return;
            }
            type = t;
        };
    }
    /**
     * Override this: Updates the entity at each availible tick. Call super() to maintain mask information.
     * _dt: the time differential since the last update.
     */
    update(_dt) {
        if (this.mask) {
            this.mask.update(this.x, this.y);
        }
    }
    render(g) {
        if (!this.visible) {
            return;
        }
        if (this.image != null) {
            this.image.render(g, this.x, this.y);
        }
    }
    moveBy(_x, _y, solid = null, sweep = false) {
        if (this.world && solid && this.mask) {
            sweep = false; //To-do remove this when sweeping is implemented
            if (sweep) {
            }
            else {
                let e = this.collideTypes(solid, this.x + _x, this.y + _y);
                if (e) {
                    _x = this.moveCollideX(_x, e);
                    this.x += _x;
                    _y = this.moveCollideY(_y, e);
                    this.y += _y;
                    return;
                }
            }
        }
        this.x += _x;
        this.y += _y;
    }
    getName() {
        return this.name;
    }
    
    /**
     *  Checks whether the entity is colliding with another entity
     * @param other    - the other entity
     * @param x        - the virtual x coordinate to place this entity
     * @param y        - the virtual y coordinate
     */
    collideEntity(other, x, y) {
        if (!this.mask || !other.mask) {
            return false;
        }
        return this.mask.collide(x, y, other.mask);
    }
    /**
     * Checks for collsions with entities of a specific type or types
     * @param t - a string or array of strings of the types you which to check collsions against
     * @param x - the virtual x coordinate to place this entity
     * @param y - the virtual y coordinate
     */
    collideTypes(t, x, y) {
        if (!this.world) {
            return false;
        }
        var others = this.world.getCollisionGroup(t);
        for (var i = 0; i < others.length; i++) {
            if (this === others[i]) {
                continue;
            }
            if (this.mask.collide(x, y, others[i].mask)) {
                return others[i];
            }
        }
        return false;
    }
    collideAll(x, y) {
        //Requres a more efficient algorithm than collide types
        if (!this.world) {
            return false;
        }
    }
    /**
     * Override this: called when this entity is added to a world.
     */
    added() {
    }
    /**
     * Sets the world that this entity exists in.
     * @param _w    - the would this entity should belong in.
     */
    setWorld(_w) {
        this.world = _w;
    }
    moveCollideX(_x, other) {
        if (_x >= 0) {
            let x_p = Math.ceil(_x);
            for (let i = 1; i <= x_p; i++) {
                if (this.collideEntity(other, this.x + i, this.y)) {
                    return i - 1;
                }
            }
        }
        else if (_x < 0) {
            let x_p = Math.floor(_x);
            for (let i = -1; i >= x_p; i--) {
                if (this.collideEntity(other, this.x + i, this.y)) {
                    return i + 1;
                }
            }
        }
        return _x;
    }
    moveCollideY(_y, other) {
        if (_y > 0) {
            let y_p = Math.ceil(_y);
            for (let i = 1; i <= y_p; i++) {
                if (this.collideEntity(other, this.x, this.y + i)) {
                    return i - 1;
                }
            }
        }
        else if (_y < 0) {
            let y_p = Math.floor(_y);
            for (let i = -1; i >= y_p; i--) {
                if (this.collideEntity(other, this.x, this.y + i)) {
                    return i + 1;
                }
            }
        }
        return _y;
    }
    /**
     * Sets the width, height and offsets and creates a hitbox to assign as the mask
     * _w   the width
     * _h   the height
     * _x   the x offset
     * _y   the y offset
     */
    setHitBox(_w, _h, _x = 0, _y = 0) {
        this.width = _w;
        this.height = _h;
        this.mask = new HitBox(this.x, this.y, _w, _h);
        this.mask.setOffset(_x, _y);
        this.mask.update(this.x, this.y);
    }
    setSpeed(_s) {
        this.ySpeed = _s * Math.sin(this.direction);
        this.xSpeed = _s * Math.cos(this.direction);
        if (_s < 0) {
            this.direction -= Math.PI / 2;
        }
        this.speed = Math.abs(_s);
    }
    setDirection(_d) {
        while (_d < 0) {
            _d += 2 * Math.PI;
        }
        while (_d >= (2 * Math.PI)) {
            _d -= 2 * Math.PI;
        }
        this.direction = _d;
        this.ySpeed = this.speed * Math.sin(this.direction);
        this.xSpeed = this.speed * Math.cos(this.direction);
    }
    setXSpeed(_xs) {
        this.xSpeed = _xs;
        this.speed = Math.sqrt(Math.pow(this.xSpeed, 2) + Math.pow(this.ySpeed, 2));
        let d = Math.atan2(this.ySpeed, this.xSpeed);
        if (d != undefined) {
            this.direction = d;
        }
    }
    setYSpeed(_ys) {
        this.ySpeed = _ys;
        this.speed = Math.sqrt(Math.pow(this.xSpeed, 2) + Math.pow(this.ySpeed, 2));
        let d = Math.atan2(this.ySpeed, this.xSpeed);
        if (d != undefined) {
            this.direction = d;
        }
    }
    getSpeed() {
        return this.speed;
    }
    getDirection() {
        return this.direction;
    }
    getXSpeed() {
        return this.xSpeed;
    }
    getYSpeed() {
        return this.ySpeed;
    }
    setSize(_w, _h) {
        this.width = _w;
        this.height = _h;
    }
}
