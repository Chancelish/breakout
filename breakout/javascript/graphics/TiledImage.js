/* global GameImage MyGame */
class TiledImage extends GameImage {
    /**
     * Constructor
     * @param img       - the tilemap that the tiled image draws from
     * @param mapWidth  - the width of the tiled image in tiles
     * @param mapHeight - the height of the tiled image in tiles
     * @param tileSize  - the size of the tiles in pixels.
     */
    constructor(img, mapWidth, mapHeight, tileSize) {
        super(img);
        this.tileSize = tileSize;
        this.tilesWide = mapWidth;
        this.tilesHigh = mapHeight;
        this.imageTilesWide = this.width / tileSize;
        this.imageTilesHigh = this.height / tileSize;
        this.tiles = new Array(mapWidth * mapHeight);
        /*
        this.buffer = document.createElement("canvas");
        this.buffer.width = mapWidth * tileSize * MyGame.scale;
        this.buffer.height = mapHeight * tileSize * MyGame.scale;
        this.bufferCTX = this.buffer.getContext("2d");
        */
    }
    loadFromString(source, columnDelimn = ",") {
        var rows;
        rows = source.split(columnDelimn);
        for (let k = 0; k < rows.length; k++) {
            this.tiles[k] = parseInt(rows[k]);
        }
    }
    render(g, oX, oY) {
        /*
        if (this.bufferedImage) {
            g.transferBufferedImage(this.bufferedImage);
        }
        */
        for (var i = 0; i < this.tiles.length; i++) {
            if (this.tiles[i] == -1) {
                continue;
            }
            let _sx = this.tileSize * (this.tiles[i] % this.imageTilesWide);
            let _sy = this.tileSize * Math.floor(this.tiles[i] / this.imageTilesWide);
            g.image(this.image, _sx, _sy, this.tileSize, this.tileSize, this.tileSize * (i % this.tilesWide) + oX + this.offsetX, this.tileSize * Math.floor(i / this.tilesWide) + oY + this.offsetY);
        }
    }
}
