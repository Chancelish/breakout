class GameImage {
    constructor(img) {
        this.image = img;
        this.width = this.image.width;
        this.height = this.image.height;
        this.offsetX = 0;
        this.offsetY = 0;
    }
    getImage() {
        return this.image;
    }
    setOffset(_x, _y) {
        this.offsetX = _x;
        this.offsetY = _y;
    }
    render(_g, oX, oY) {
        _g.image(this.image, 0, 0, this.width, this.height, oX + this.offsetX, oY + this.offsetY);
    }
    stretched(_g, oX, oY, sX, sY) {
        _g.stretchedImage(this.image, 0, 0, this.width, this.height, oX + this.offsetX, oY + this.offsetY, sX, sY);
    }
}
