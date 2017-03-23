/* global KeyManager Graphics Image FSBuffer */
class MyGame {
    constructor(width = 720, height = 768, scale = 1) {
        MyGame.WIDTH = width;
        MyGame.HEIGHT = height;
        MyGame.SCALE = scale;
        this.muted = false;
        this.imgs = [];
        this.maps = [];
        this.snds = [];
        this.camera = {x: 0, y: 0};
        this.colour = "#000000";
        this.keyManager = new KeyManager();
        this.g = new Graphics(width, height, scale);
        this.state = 1;
        this.imgCount = 0;
        this.imgsToLoad = 0;
        this.lvlCount = 0;
        this.lvlsToLoad = 0;
        this.gameLoop = () => {
            if (this.running) {
                if (!document.hasFocus()) {
                    requestAnimationFrame((this.gameLoop));
                    return;
                }
                this.now = Date.now();
                this.delta = this.now - this.lastTime;
                this.timer += this.delta;
                this.lastTime = this.now;
                while (this.timer >= this.timePerTick) {
                    this.update(this.timePerTick / 1000);
                    this.timer -= this.timePerTick;
                    if (this.timer < this.timePerTick) {
                        this.render();
                    }
                }
            }
            requestAnimationFrame((this.gameLoop));
        };
    }
    start() {
        this.onInit();
        this.timePerTick = 1000 / 60;
        this.running = true;
        this.now = Date.now();
        this.delta = 0;
        this.timer = 0;
        this.lastTime = this.now;
        this.gameLoop();
    }
    /**
     * Override this to set your own world and other variables.
     */
    onInit() {
        this.setWorld(new FSBuffer(this));
    }
    update(_dt) {
        this.keyManager.preUpdate("ArrowUp");
        this.keyManager.preUpdate("ArrowDown");
        this.keyManager.preUpdate("ArrowLeft");
        this.keyManager.preUpdate("ArrowRight");
        this.keyManager.preUpdate("Up");
        this.keyManager.preUpdate("Down");
        this.keyManager.preUpdate("Left");
        this.keyManager.preUpdate("Right");
        this.keyManager.preUpdate("Enter");
        this.keyManager.preUpdate("Escape");
        this.keyManager.preUpdate(" ");
        this.keyManager.preUpdate("m");
        this.keyManager.preUpdate("x");
        this.keyManager.preUpdate("z");
        if (this.world) {
            if (this.requestKeyData("m", "pressed")) {
                if (this.muted) {
                    this.unmute();
                }
                else {
                    this.mute();
                }
            }
            this.world.update(_dt);
            this.world.cleanup();
        }
        this.keyManager.postUpdate("ArrowUp");
        this.keyManager.postUpdate("ArrowDown");
        this.keyManager.postUpdate("ArrowLeft");
        this.keyManager.postUpdate("ArrowRight");
        this.keyManager.postUpdate("Up");
        this.keyManager.postUpdate("Down");
        this.keyManager.postUpdate("Left");
        this.keyManager.postUpdate("Right");
        this.keyManager.postUpdate("Enter");
        this.keyManager.postUpdate("Escape");
        this.keyManager.postUpdate(" ");
        this.keyManager.postUpdate("m");
        this.keyManager.postUpdate("x");
        this.keyManager.postUpdate("z");
    }
    render() {
        this.g.clear();
        this.g.rectangle(0, 0, MyGame.WIDTH, MyGame.HEIGHT, this.colour);
        if (this.world) {
            this.world.render(this.g);
        }
    }
    /**
     * Adds an image to the game and stores it as an html Image element
     * @param _key  The name of the image to reference in game
     * @param _path The relative filepath of the image.
     */
    addImage(_key, _path) {
        this.imgs[_key] = new Image();
        this.imgs[_key].onload = () => this.imageLoaded();
        this.imgs[_key].src = _path;
        this.imgsToLoad++;
    }
    addSound(_key, _path) {
        this.snds[_key] = new Audio();
        this.snds[_key].src = _path;
    }
    /**
     * Adds a level to the game and stores as an xml request
     * @param _key
     * @param _path
     */
    addLevelXML(_key, _path) {
        this.maps[_key] = new XMLHttpRequest();
        this.maps[_key].onreadystatechange = () => this.levelLoaded(_key);
        this.maps[_key].open("GET", _path);
        this.maps[_key].responseType = "document";
        this.maps[_key].send();
        this.lvlsToLoad++;
    }
    /**
     * Override This: Loads in images and levels.
     */
    loadImages() {
        this.addSound("mus1", "./assets/determination.mp3");
        this.addSound("mus2", "./assets/covert_operations.mp3");
        this.addSound("low", "./assets/block_low.mp3");
        this.addSound("mid", "./assets/block_mid.mp3");
        this.addSound("high", "./assets/block_high.mp3");
        this.addImage("border", "./assets/border.png");
        this.addImage("bricks", "./assets/bricks.png");
        this.addImage("bat", "./assets/bat.png");
        this.addImage("robber", "./assets/robber.png");
        this.addImage("title", "./assets/titlelogo.png");
    }
    loadLevels() {
        this.addLevelXML("default", "./assets/default.xml");
    }
    imageLoaded() {
        this.imgCount += 1;
        if (this.imgCount >= this.imgsToLoad && !this.running) {
            this.loadLevels();
        }
    }
    levelLoaded(s) {
        if (this.maps[s].status === 200) {
            this.lvlCount += 1;
            if (this.lvlCount >= this.lvlsToLoad && !this.running) {
                this.start();
            }
        }
        else {
        }
    }
    setWorld(_w) {
        this.world = _w;
        _w.begin();
        this.g.camera = this.camera;
    }
    /* Saves game data to local storage, override to manage own data */
    static saveGame() {
        
    }
    /* loads game from local storage if availible */
    static loadGame() {
        
    }
    static reset() {
        
    }
    requestKeyData(key, mode = "held") {
        return this.keyManager[mode](key);
    }
    requestImage(name) {
        return this.imgs[name];
    }
    requestSound(name) {
        return this.snds[name];
    }
    requestMapData(name) {
        return this.maps[name];
    }
    mute() {
        for (let sound in this.snds) {
            this.snds[sound].volume = 0;
            this.snds[sound].pause();
            this.snds[sound].currentTime = 0;
        }
        this.muted = true;
    }
    unmute() {
        for (let sound in this.snds) {
            this.snds[sound].volume = 1;
        }
        if (this.snds["mus1"].paused && this.snds["mus1"].paused) {
            this.snds["mus1"].play();
        }
        this.muted = false;
    }
}
MyGame.WIDTH = 720;
MyGame.HEIGHT = 768;
MyGame.SCALE = 1;
MyGame.textLanguage = "English";
window.onload = () => {
    var myGame = new MyGame();
    myGame.imgCount = 0;
    myGame.loadImages();
};

