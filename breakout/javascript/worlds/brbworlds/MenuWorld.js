/* global World localStorage GameImage */
class MenuWorld extends World {
    constructor(_g, _m = "main") {
        super(_g);
        this.area = _m;
        this.choice = 0;
        this.options = [];
        this.highScores = [];
        this.title = new GameImage(this.requestImage("title"));
        this.bat = new GameImage(this.requestImage("bat"));
        if (localStorage.getItem("hs1")) {
            this.highScores[0] = parseInt(localStorage.getItem("hs1"), 10);
            this.highScores[1] = parseInt(localStorage.getItem("hs2"), 10);
            this.highScores[2] = parseInt(localStorage.getItem("hs3"), 10);
            this.highScores[3] = parseInt(localStorage.getItem("hs4"), 10);
            this.highScores[4] = parseInt(localStorage.getItem("hs5"), 10);
        }
        else {
            for (let i = 0; i < 5; i++) {
                this.highScores[i] = 0;
            }
        }
        if (_m === "main") {
            this.loadMain();
        }
        else if (_m === "high_scores") {
            this.loadHighScore();
        }
        let mus1 = _g.requestSound("mus1");
        let mus2 = _g.requestSound("mus2");
        mus1.addEventListener("ended", function() {
            mus1.currentTime = 0;
            mus2.play();
        });
        mus2.addEventListener("ended", function() {
            mus2.currentTime = 0;
            mus1.play();
        });
        if (mus1.paused && mus2.paused) {
            mus1.play();
        }
    }
    loadMain() {
        this.area = "main";
        this.choiceMax = 2;
        this.options.length = this.choiceMax;
        this.options[0] = "Play";
        this.options[1] = "High Scores";
        this.options[2] = "Credits";
    }
    loadHighScore() {
        this.area = "high_scores";
        this.options[0] = "Back";
        this.options[1] = "Reset High Scores";
        this.choiceMax = 1;
        this.choice = 0;
    }
    loadCredits() {
        this.area = "credits";
        this.options[0] = "Game and Art By";
        this.options[1] = "Chance Gallegos";
        this.options[2] = "Press Enter or Space to go Back";
        
    }
    update(_dt) {
        if (this.requestInput("ArrowUp", "pressed") || this.requestInput("Up", "pressed") || this.requestInput("ArrowLeft", "pressed") || this.requestInput("Left", "pressed")) {
            this.choice--;
            if (this.choice < 0) {
                this.choice = this.choiceMax;
            }
        }
        else if (this.requestInput("ArrowDown", "pressed") || this.requestInput("Down", "pressed") || this.requestInput("ArrowRight", "pressed") || this.requestInput("Right", "pressed")) {
            this.choice++;
            if (this.choice > this.choiceMax) {
                this.choice = 0;
            }
        }
        else if (this.requestInput(" ", "pressed") || this.requestInput("Enter", "pressed")) {
            if (this.area === "main") {
                if (this.choice === 0) {
                    this.getGame().setWorld(new PlayWorld(this.getGame(), 720, 768, "default"));
                }
                else if (this.choice === 1) {
                    this.loadHighScore();
                }
                else if (this.choice === 2) {
                    this.loadCredits();
                }
            }
            else if (this.area === "high_scores") {
                if (this.choice === 0) {
                    this.loadMain();
                }
                else if (this.choice === 1) {
                    for (let i = 0; i < 5; i++) {
                        this.highScores[i] = 0;
                        localStorage.setItem("hs" + i.toString(), 0);
                    }
                    this.loadMain();
                }
            }
            else if (this.area === "credits") {
                this.loadMain();
            }
        }
    }
    render(_g) {
        _g.rectangle(10, 10, 700, 700, "#343635", "stroke", 10);
        if (this.area === "main") {
            _g.rectangle(220, 278, 234, 184, "#343635", "stroke", 10);
            _g.rectangle(232, 290 + 60* this.choice, 210, 40, "#EDDA74", "stroke", 10);
            //this.bat.render(_g, 260, 300 + 60*this.choice);
            _g.text(this.options[0], 312, 320);
            _g.text(this.options[1], 240, 380);
            _g.text(this.options[2], 288, 440);
            _g.text("Press Arrows to Move, Enter to Select, M to mute/unmute sounds", 50, 560, "#FFFFFF", "18px Verdana");
        }
        else if (this.area === "high_scores") {
            _g.rectangle(240, 268, 230, 256, "#343635", "stroke", 10);
            _g.text("High Scores", 264, 300);
            _g.rectangle(75 + 300 * this.choice, 548, 100 + 210 * this.choice, 40, "#EDDA74", "stroke", 10);
            for (let i = 0; i < 5; i++) {
                _g.text(i.toString() + ". " + this.highScores[i].toString(), 320, 350 + 40*i, "#FFFFFF", "24px Verdana");
            }
            for (let i = 0; i < 2; i++) {
                _g.text(this.options[i], 80 + 300 * i, 580);
            }
        }
        else if (this.area === "credits") {
            _g.text("Game and Art by", 240, 300);
            _g.text("Chance Gallegos", 240, 350);
            _g.text("Music By", 300, 400);
            _g.text("ArtisticDude on opengameart.org", 100, 450);
            _g.text("Press Enter or Space to go back", 200, 560, "#FFFFFF", "24px Verdana");
        }
        this.title.render(_g, 0, 0);
    }
}