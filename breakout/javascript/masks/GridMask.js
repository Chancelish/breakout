/* global Mask */
class GridMask extends Mask {
    constructor(_x, _y, _s, _w, _h) {
        super(_x, _y);
        this.tileSize = _s;
        this.tiledWidth = _w;
        this.tiledHeight = _h;
        this.tiles = new Array(_w * _h);
    }
    loadFromString(source, columnDelimn = "") {
        this.bitstringData = source;
        var rows;
        rows = source.split(columnDelimn);
        for (var k = 0; k < rows.length; k++) {
            if (!(rows[k] == '1') && !(rows[k] == '0')) {
                rows.splice(k, 1);
            }
        }
        for (var k = 0; k < rows.length; k++) {
            this.tiles[k] = parseInt(rows[k]);
        }
    }
    tileSolid(_x, _y) {
        let xp = Math.floor((_x - this.x) / this.tileSize);
        let yp = Math.floor((_y - this.y) / this.tileSize);
        if (xp < 0 || xp >= this.tiledWidth || yp < 0 || yp >= this.tiledHeight) {
            return 0;
        }
        let k = this.tiledWidth * yp + xp;
        return this.tiles[k];
    }
    rectangluarRegion(_x, _y, _w, _h) {
        let x1 = Math.floor((_x - this.x) / this.tileSize);
        let y1 = Math.floor((_y - this.y) / this.tileSize);
        let x2 = Math.floor((_x + _w - 1 - this.x) / this.tileSize);
        let y2 = Math.floor((_y + _h - 1 - this.y) / this.tileSize);
        for (let i = x1; i <= x2; i++) {
            if (i < 0 || i >= this.tiledWidth) {
                continue;
            }
            for (let j = y1; j <= y2; j++) {
                if (j < 0 || j >= this.tiledHeight) {
                    continue;
                }
                let k = this.tiledWidth * j + i;
                if (this.tiles[k] == 1) {
                    return true;
                }
            }
        }
        return false;
    }
    getTileSize() {
        return this.tileSize;
    }
}
