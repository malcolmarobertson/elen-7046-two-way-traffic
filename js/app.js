
// GameObject is the superclass of a moving character in the game
// Requires 3 parameters:
// x: x position
// y: y position
// avatar: png graphic representing the character
class GameObject {
    constructor(avatar, x, y) {
        if (new.target === GameObject) 
            throw TypeError("Cannot call new on abstract class GameObject");
        this.avatar = avatar;
        this.x = x;
        this.y = y;
    }

    //force virtual function to be implemented in sub-class
    render() {
        throw new Error('You have to implement the method render()!');
    }
}

//Enemy object is a sub-class of GameObject
// Requires 2 parameters:
// direction: "LR" for left to right, or "RL" for right to left
// row: the row of the game grid the Enemy must be created on
class Enemy extends GameObject {
    constructor(direction, row) {

        //decides on avatar and start position based on direction
        var avatar = direction == config.dirLeftRight ? 'images/car-l-r.png' : 'images/car-r-l.png';
        var x = direction == config.dirLeftRight ? -config.maxBlockWidth : config.maxCanvasWidth;
        var y = (row * config.rowHeight) - config.rowHeightAdjust;
        super(avatar, x, y);

        this.direction = direction;
        this.speed = 1 * config.speedAdjust;

        //initially sets Enemy to not running
        var running = false;
    }

    //function to start the Enemy object running based on a random delay, set by a range in the configuration.
    startRunning() {
        var that = this;
        setTimeout(function () { 
            that.running = true; 
        }, Math.floor(Math.random() * (config.maxEnemyDelay - config.minEnemyDelay + 1)) + config.minEnemyDelay);
    }

    //function to stop Enemy running
    stopRunning() {
        this.running = false;
    }

    //the main application calls this function at time-based intervals to move the enemy
    update(dt) {
        if (this.running)
            if (this.direction == config.dirLeftRight)
                this.moveRight(dt);
            else
                this.moveLeft(dt);
    }

    //renders the Enemy png on the HTML5 canvas, based on x, y position
    render() {
        ctx.drawImage(resources.get(this.avatar), this.x, this.y);
    }

    //called when a collision with the Player character occurs, resets position
    die() {
        this.stopRunning();
        this.x = this.direction == config.dirLeftRight ? -config.maxBlockWidth : config.maxCanvasWidth;
        this.startRunning();
    }

    //moves the Enemy right, based on time interval calculation
    //if moves over the edge of game grid, then reset position
    moveRight(dt) {
        if (this.x > config.maxCanvasWidth) {
            this.die();
        }
        else {
            this.x = this.x + (this.speed * dt);
        }
    }

    //moves the Enemy left, based on time interval calculation
    //if moves over the edge of game grid, then reset position
    moveLeft(dt) {
        if (this.x < -config.maxBlockWidth) {
            this.die();
        }
        else {
            this.x = this.x - (this.speed * dt);
        }
    }
}

//Player object is a sub-class of GameObject
class Player extends GameObject {
    constructor() {
        super('images/char-boy.png', config.playerStartX, config.playerStartY);
    }

    //renders the Enemy png on the HTML5 canvas, based on x, y position
    render() {
        ctx.drawImage(resources.get(this.avatar), this.x, this.y);
    }

    // function to examine input from keyboard and move player using x-y calculations
    handleInput(dir) {
        switch (dir) {
            case 'up':
                if (this.y > 0) {
                    this.y = this.y - config.rowHeight;
                    if (this.y < config.minPlayerY) {
                        this.win();
                    }
                }
                break;
            case 'down':
                if (this.y < config.maxPlayerY) {
                    this.y = this.y + config.rowHeight;
                }
                break;
            case 'left':
                if (this.x > config.minPlayerX) {
                    this.x = this.x - config.maxBlockWidth;
                }
                break;
            case 'right':
                if (this.x < config.maxPlayerX) {
                    this.x = this.x + config.maxBlockWidth;
                }
                break;
        }
    }

    //function called when player dies, decreases score and resets to start position
    die() {
        score.decrease();
        this.x = config.playerStartX;
        this.y = config.playerStartY;
    }

    //function called when player dies, increases score and resets to start position
    win() {
        score.increase();
        this.x = config.playerStartX;
        this.y = config.playerStartY;
    }
}

class Enemies {
    constructor() {
        this.enemies = [];
    }

    //creates enemy objects based on configuration, using lane count and enemy per lane count
    //pushes the enemies onto an array
    createEnemies() {
        for (var i = 1; i <= config.laneCount; i++) {
            for (var j = 1; j <= config.enemyPerLane; j++) {
                var nme = new Enemy(i % 2 ? config.dirLeftRight : config.dirRightLeft, i);
                this.enemies.push(nme);
            }
        }
    }

    //starts all Enemy objects
    startEnemies(){
        this.enemies.forEach(function (enemy) {
            enemy.startRunning();
        });
    }
}

// MAIN CODE
var config = new Config();
var allEnemies = new Enemies();

var score = new Score();
var player = new Player();
var resources = new Resources();
var engine = new Engine(this);

resources.onReady(function () {
    allEnemies.createEnemies();
    allEnemies.startEnemies();
    engine.init();
});

//JS code to enable listener for keys and send to player object if meets criteria
document.addEventListener('keyup', function (e) {
    player.handleInput(config.allowedKeys[e.keyCode]);
});
