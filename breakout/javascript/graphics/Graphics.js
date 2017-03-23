class Graphics {
    constructor(_width, _height, _scale, canvasElementID = "canvas") {
        let camera = {x: 0, y: 0};
        let canvas = document.getElementById(canvasElementID);
        let width = _width;
        let height = _height;
        let gfx = canvas.getContext("2d");
        gfx.msImageSmoothingEnabled = false;
        gfx.imageSmoothingEnagled = false;
        gfx.webkitImageSmoothingEnabled = false;
        gfx.mozImageSmoothingEnabled = false;
        let scale = _scale;
        this.clear = () => {
            gfx.clearRect(0, 0, width * scale, height * scale);
        }
        this.rectangle = (_x, _y, _w, _h, colour = "#000000", mode = "fill", thickness = 1) => {
            gfx.fillStyle = colour;
            gfx.strokeStyle = colour;
            gfx.lineWidth = thickness;
            if (mode == "fill") {
                gfx.fillRect((_x - camera.x) * scale, (_y - camera.y) * scale, _w * scale, _h * scale);
            }
            else {
                gfx.strokeRect((_x - camera.x) * scale, (_y - camera.y) * scale, _w * scale, _h * scale);
            }
        };
        this.circle = (_x, _y, _r, colour = "#000000", mode = "fill", thickness = 1) => {
            gfx.save();
            gfx.fillStyle = colour;
            gfx.strokeStyle = colour;
            gfx.lineWidth = thickness;
            gfx.beginPath();
            gfx.arc((_x - camera.x) * scale, (_y - camera.y) * scale, _r * scale, 0, 2*Math.PI);
            if (mode == "fill") {
                gfx.fill();
            }
            else {
                gfx.stroke();
            }
            gfx.closePath();
            gfx.restore();
        };
        this.setCamera = (_c) => {
            camera = _c;
        };
        /**
         * Draws the image onto the canvase
         * @param _image    - the image to be drawn
         * @param x         - source x coordinate
         * @param y         - source y coordinate
         * @param width     - width of image sample source
         * @param height    - height of image sample source
         * @param oX        - the x offset on the canvas
         * @param oY        - the y offset on the canvas
         */
        this.image = (_image, _x, _y, _w, _h, oX, oY) => {
            let ox = camera.x;
            let oy = camera.y;
            if (oX + _w < ox || oY + _h < oy || ox + width < oX || oy + height < oY) {
                return;
            }
            gfx.drawImage(_image, _x, _y, _w, _h, Math.floor(oX - ox) * scale, Math.floor(oY - oy) * scale, _w * scale, _h * scale);
        };
        this.stretchedImage = (_image, _x, _y, _w, _h, oX, oY, sx, sy) => {
            let ox = camera.x;
            let oy = camera.y;
            if (oX + _w < ox || oY + _h < oy || ox + width < oX || oy + height < oY) {
                return;
            }
            gfx.drawImage(_image, _x, _y, _w, _h, Math.floor(oX - ox) * scale, Math.floor(oY - oy) * scale, _w * scale * sx, _h * scale * sy);
        };
        this.text = (_s, _x, _y, colour = "#FFFFFF", font = "32px Verdana", _w = 0) => {
            gfx.fillStyle = colour;
            gfx.strokeStyle = colour;
            gfx.font = font;
            if (_w === 0) {
                gfx.fillText(_s, _x * scale, _y * scale);
            }
            else {
            gfx.fillText(_s, _x * scale, _y * scale, _w * scale);
            }
        };
    }
}
