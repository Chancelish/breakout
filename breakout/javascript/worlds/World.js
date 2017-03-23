class World {
    /**
     * World, holds and ubdates objects for a given subset of the game
     * game     - the game
     */
    constructor(game) {
        this.entityList = new Array();
        this.collisionGroups = [];
        this.collisionRegions = [];
        this.camera = {x: 0, y: 0};
        this.setSize(0, 0);
        this.requestInput = (key, mode = "held") => {
            return game.requestKeyData(key, mode);
        };
        this.requestImage = (key) => {
            return game.requestImage(key);
        };
        this.requestSound = (key) => {
            return game.requestSound(key);
        };
        this.getGame = () => {
            return game;
        };
    }
    update(_dt) {
        for (var i = 0; i < this.entityList.length; i++) {
            this.entityList[i].update(_dt);
        }
    }
    render(_g) {
        for (var i = 0; i < this.entityList.length; i++) {
            this.entityList[i].render(_g);
        }
    }
    cleanup() {
        for (var i = 0; i < this.entityList.length; i++) {
            if (this.entityList[i].shouldRemove()) {
                let e = this.entityList.splice(i, 1);
                i--;
                let t = e[0].getType();
                if (t) {
                    let k = this.collisionGroups[t].indexOf(e[0]);
                    this.collisionGroups[t].splice(k, 1);
                }
            }
        }
    }
    setSize(_w, _h) {
        this.width = _w;
        this.height = _h;
    }
    begin() {
        this.getGame().camera = this.camera;
    }
    addEntity(e) {
        this.entityList.push(e);
        e.setWorld(this);
        e.added();
        this.updateCollisionGroups(e);
    }
    updateCollisionGroups(e, ot = null) {
        var t = e.getType();
        if (ot) {
            let k = this.collisionGroups[ot].indexOf(e);
            this.collisionGroups[ot].splice(k, 1);
        }
        if (t) {
            if (!this.collisionGroups[t]) {
                this.collisionGroups[t] = new Array();
            }
            this.collisionGroups[t].push(e);
        }
    }
    getCollisionGroup(t) {
        var entities;
        if (t instanceof Array) {
            if (!(t[0] in this.collisionGroups)) {
                this.collisionGroups[t[0]] = new Array();
            }
            entities = this.collisionGroups[t[0]].slice();
            for (var i = 1; i < t.length; i++) {
                if (!(t[i] in this.collisionGroups)) {
                    this.collisionGroups[t[i]] = new Array();
                }
                entities = entities.concat(this.collisionGroups[t[i]]);
            }
        }
        else {
            if (!(t in this.collisionGroups)) {
                this.collisionGroups[t] = new Array();
            }
            entities = this.collisionGroups[t].slice();
        }
        return entities;
    }
    getCamera() {
        return this.camera;
    }
    removeAll() {
        for (let i = 0; i < this.entityList.length; i++) {
            this.entityList[i].destroy();
        }
    }
    findByName(_n) {
        for (let i = 0; i < this.entityList.length; i++) {
            if (_n === this.entityList[i].getName()) {
                return this.entityList[i];
            }
        }
    }
}
