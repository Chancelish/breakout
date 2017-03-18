/* global GameImage */
class GameSprite extends GameImage {
    constructor(img, sprWidth, sprHeight) {
        super(img);
        this.frameWidth = sprWidth;
        this.frameHeight = sprHeight;
        this.numberFrames = this.width / sprWidth;
        this.currentFrame = 0;
        this.animationFrame = 0;
        this.animations = [];
        this.currentAnimationName = null;
    }
    render(g, oX, oY) {
        g.image(this.image, this.currentFrame * this.frameWidth, 0, this.frameWidth, this.frameHeight, oX + this.offsetX, oY + this.offsetY);
    }
    setFrame(f) {
        this.currentFrame = f;
        this.frameRate = 0;
    }
    getFrame() {
        return this.currentFrame;
    }
    add(name, array) {
        this.animations[name] = array;
    }
    play(name, rate = 0, loop = true, sFrame = 0) {
        if (this.currentAnimationName === name) {
            this.looping = loop;
            return false;
        }
        if (name in this.animations) {
            this.animationFrame = sFrame;
            this.frameRate = rate;
            this.timeStamp = 0;
            this.looping = loop;
            this.currentAnimationName = name;
            this.currentAnimation = this.animations[name];
            this.currentFrame = this.animations[name][this.animationFrame];
            return true;
        }
        return false;
    }
    stop() {
        this.frameRate = 0;
        this.timeStamp = 0;
        this.currentAnimationName = null;
    }
    update(deltaT) {
        if (this.frameRate <= 0) {
            return;
        }
        this.timeStamp += deltaT;
        if (this.timeStamp >= 1 / this.frameRate) {
            this.animationFrame += 1;
            this.timeStamp -= 1 / this.frameRate;
            if (this.animationFrame >= this.currentAnimation.length) {
                this.animationFrame = 0;
                if (!this.looping) {
                    this.stop();
                }
            }
            this.currentFrame = this.currentAnimation[this.animationFrame];
        }
    }
}
