/* global World GridMask TiledImage Entity Bat GameImage Brick GameSprite Ball ScoreBoard MenuWorld */
class PlayWorld extends World {
    constructor(game, _w, _h, _bfor) {
        super(game);
        this.setSize(_w, _h);
        this.setSize(720, 648 + 120);
        let xmlData = game.requestMapData(_bfor).responseXML;
        let elem = xmlData.getElementsByTagName("border")[0];
        let _wm = new GridMask(0, 0, 24, 30, 27);
        _wm.loadFromString(elem.innerHTML);
        elem = xmlData.getElementsByTagName("border_render")[0];
        let _wr = new TiledImage(game.requestImage("border"), 30, 27, 24);
        _wr.loadFromString(elem.innerHTML);
        let border = new Entity(0, 0, _wr, _wm);
        border.setType("wall");
        this.addEntity(border);
        elem = xmlData.getElementsByTagName("brick");
        for (let i = 0; i < elem.length; i++) {
            let _x = parseInt(elem[i].getAttribute("x"), 10);
            let _y = parseInt(elem[i].getAttribute("y"), 10);
            let _c = parseInt(elem[i].getAttribute("colour"), 10);
            let _spr = new GameSprite(game.requestImage("bricks"), 48, 24);
            this.addEntity(new Brick(_x, _y, _spr, _c));
        }
        this.addEntity(new Bat(240, 564, new GameImage(game.requestImage("bat")), null));
        this.addEntity(new Ball(250, 508));
        let scoreBoard = new ScoreBoard();
        this.addEntity(scoreBoard);
        this.setScoreBoard = (_sb) => {
            if (this.findByName("score_board")) {
                this.entityList.pop();
            }
            scoreBoard = _sb;
            this.addEntity(_sb);
        };
        this.gotoMenu = (_loc) => {
            this.getGame().setWorld(new MenuWorld(this.getGame(), _loc));
        };
    }
    
}