/* global Entity GameSprite GameImage Ball localStorage */
class ScoreBoard extends Entity {
    constructor() {
        super(0, 600);
        this.name = "score_board";
        let emote = 0;
        let score = 0;
        let hundredPointCount = 0;
        let lives = 3;
        this.timer = 0;
        this.ballLost = false;
        this.didWin = false;
        this.getScore = () => {
            return score;
        };
        this.scorePoints = (_p) => {
            score += _p;
            hundredPointCount += _p;
            if (this.pointsToNewBall() <= 0) {
                hundredPointCount -= 100;
                let bat = this.world.findByName("bat");
                let ball = new Ball(bat.x + bat.width/2, bat.y - 8, true);
                ball.setSpeed(5);
                ball.setDirection(-Math.PI/3);
                ball.bricksBrock = 4;
                this.world.addEntity(ball);
                this.setEmote(2);
                this.timer = 2;
                this.face.setFrame(this.getEmote());
            }
        };
        this.pointsToNewBall = () => {
            return 100 - hundredPointCount;
        };
        this.setScore = (_s) => {
            if (_s > 0) {
                score = _s;
            }
            else {
                _s = 0;
            }
        };
        this.getLives = () => {
            return lives;
        };
        this.loseLive = () => {
            lives -= 1;
            this.setEmote(1);
            this.timer = 3;
            this.ballLost = true;
            this.world.findByName("bat").changeSize(0.667);
            this.face.setFrame(this.getEmote());
        };
        this.setEmote = (_e) => {
            if (_e >= 0 && _e <= 2) {
                emote = _e;
            }
        };
        this.getEmote = () => {
            return emote;
        };
        this.setType("score_board");
    }
    added() {
        this.face = new GameSprite(this.world.requestImage("robber"), 106, 106);
        this.face.setFrame(this.getEmote());
        this.bat = new GameImage(this.world.requestImage("bat"));
    }
    render(_g) {
        _g.rectangle(this.x, this.y, 720, 120, "#363F43", "fill");
        _g.rectangle(this.x+110, this.y+7, 106, 106, "#463F93", "fill");
        this.face.render(_g, this.x+110, this.y+7);
        _g.text("Score: " + this.getScore().toString(), this.x+240, this.y + 52);
        _g.text("Bats:  ", this.x+240, this.y + 92);
        for (let i = 0; i < this.getLives(); i++) {
            this.bat.stretched(_g, this.x+330+50*i, this.y+80, 0.333, 0.5);
        }
    }
    get score() {
        return this.getScore();
    }
    set score(_s) {
        this.setScore(_s);
    }
    update(_dt) {
        if (this.didWin) {
            this.setEmote(2);
            this.face.setFrame(this.getEmote());
            this.timer -= _dt;
            if (this.timer <= 0) {
                this.accessHighScores();
            }
            return;
        }
        if (this.timer > 0) {
            this.timer -= _dt;
            if (this.timer <= 0) {
                if (this.world.getCollisionGroup("ball").length == 0) {
                    if (this.getLives() <= 0) {
                        this.accessHighScores();
                        return;
                    }
                    else if (this.ballLost) {
                        let ball = new Ball(this.world.width/2, 600);
                        this.world.addEntity(ball);
                        this.ballLost = false;
                    }
                }
                this.setEmote(0);
                this.face.setFrame(this.getEmote());
            }
        }
    }
    accessHighScores() {
        let highScores = [];
        if (localStorage.getItem("hs1")) {
            highScores[0] = parseInt(localStorage.getItem("hs1"), 10);
            highScores[1] = parseInt(localStorage.getItem("hs2"), 10);
            highScores[2] = parseInt(localStorage.getItem("hs3"), 10);
            highScores[3] = parseInt(localStorage.getItem("hs4"), 10);
            highScores[4] = parseInt(localStorage.getItem("hs5"), 10);
        }
        else {
            for (let i = 0; i < 5; i++) {
                highScores[i] = 0;
            }
        }
        for (let i = 4; i >= 0; i--) {
            if (this.getScore() > highScores[i]) {
                highScores[i+1] = highScores[i];
                    highScores[i] = this.getScore();
                }
            }
        for (let i = 0; i < 5; i++) {
            localStorage.setItem("hs"+(i+1).toString(), highScores[i].toString());
        }
        this.world.gotoMenu("high_scores");
    }
}