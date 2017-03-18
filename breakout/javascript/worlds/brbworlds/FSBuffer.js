/* global World PlayWorld */
class FSBuffer extends World {
    constructor(game) {
        super(game);
        this.timer = 180;
    }
    update(_dt) {
        this.timer -= 1;
        if (this.timer <= 0) {
            this.getGame().setWorld(new PlayWorld(this.getGame(), 720, 768, "default"));
        }
    }
}