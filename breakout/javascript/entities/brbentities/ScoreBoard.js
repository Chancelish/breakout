/* global Entity GameSprite */
class ScoreBoard extends Entity {
    constructor() {
        super(0, 648);
        this.name = "score_board";
        let score = 0;
        this.getScore = () => {
            return score;
        };
        this.scorePoints = (_p) => {
            score += _p;
        };
        this.setScore = (_s) => {
            if (_s > 0) {
                score = _s;
            }
            else {
                _s = 0;
            }
        };
    }
    added() {
        this.face = new GameSprite(this.world.requestImage("robber"), 106, 106);
    }
    render(_g) {
        _g.rectangle(this.x + this.world.getCamera().x, this.y + this.world.getCamera().y, 720, 120, "#363F43", "fill");
        if (this.face) {
            
        }
        
    }
    get score() {
        return this.getScore();
    }
    set score(_s) {
        this.setScore(_s);
    }
}