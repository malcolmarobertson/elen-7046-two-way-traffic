'use strict';

var MAX_BLOCK_WIDTH = 101;
var MAX_CANVAS_WIDTH = 909;
var ROW_HEIGHT = 83;
var ROW_HEIGHT_ADJUST = 23;
var SPEED_ADJUST = 100;
var PLAYER_START_X = 404;
var PLAYER_START_Y = 243;
var MIN_PLAYER_X = 100;
var MIN_PLAYER_Y = 72;
var MAX_PLAYER_X = 400;
var MAX_PLAYER_Y = 400;
var WIN_SCORE = 100;
var ENEMY_ROW_HEIGHT_ADJUST = 71;
var PLAYER_ROW_HEIGHT_ADJUST_1 = 61;
var PLAYER_ROW_HEIGHT_ADJUST_2 = 55;
var DIR_LEFT_RIGHT = "LR";
var DIR_RIGHT_LEFT = "RL";
var LANE_COUNT = 2;
var ENEMY_PER_LANE = 5;
var MIN_ENEMY_DELAY = 2000;
var MAX_ENEMY_DELAY = 5000;

class GameObject {
    constructor(sprite, x, y) {
        this.sprite = sprite;
        this.x = x;
        this.y = y;
    }
}

class Enemy extends GameObject {
    constructor(direction, row) {
        var sprite = direction == DIR_LEFT_RIGHT ? 'images/car-l-r.png' : 'images/car-r-l.png';
        var x = direction == DIR_LEFT_RIGHT ? -MAX_BLOCK_WIDTH : MAX_CANVAS_WIDTH;
        var y = (row * ROW_HEIGHT) - ROW_HEIGHT_ADJUST;
        super(sprite, x, y);
        this.direction = direction;
        this.speed = 1 * SPEED_ADJUST;
        this.running = false;
        //this.speed = this.randomSpeed();
    }

    startRunning() {
        var that = this;
        setTimeout(function () { that.running = true; }, Math.floor(Math.random() * (MAX_ENEMY_DELAY - MIN_ENEMY_DELAY + 1)) + MIN_ENEMY_DELAY);
    }

    stopRunning() {
        this.running = false;
    }

    // Update the enemy's position, required method for game
    // Parameter: dt, a time delta between ticks
    update(dt) {
        if (this.running)
            if (this.direction == DIR_LEFT_RIGHT)
                this.moveRight(dt);
            else
                this.moveLeft(dt);
    }

    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    die() {
        this.stopRunning();
        this.x = this.direction == DIR_LEFT_RIGHT ? -MAX_BLOCK_WIDTH : MAX_CANVAS_WIDTH;
        this.startRunning();
    }

    moveRight(dt) {
        if (this.x > MAX_CANVAS_WIDTH) {
            this.die();
        }
        else {
            this.x = this.x + (this.speed * dt);
        }
    }

    moveLeft(dt) {
        if (this.x < -MAX_BLOCK_WIDTH) {
            this.die();
        }
        else {
            this.x = this.x - (this.speed * dt);
        }
    }
    //return random entry of array
    // randomArrayEntry(inArray) {
    //     return inArray[Math.floor(Math.random() * inArray.length)];
    // }
    // //generate random row for enemy
    // randomRowY() {
    //     var rows = Array(1, 2);
    //     return (this.randomArrayEntry(rows) * ROW_HEIGHT) - ROW_HEIGHT_ADJUST;
    // }
    // //generate random speed for enemy
    // randomSpeed() {
    //     return (Math.random() * (11 - 1) + 1) * SPEED_ADJUST;
    //     //return (Math.random() * (11 - 1) + 1);
    // }
}

class Player extends GameObject {
    constructor() {
        super('images/char-boy.png', PLAYER_START_X, PLAYER_START_Y);
    }
    //TODO area of the player's sprite which is collisionable
    //hotX = this.x + 10;
    //hotY = this.y + 10;
    // Draw the enemy on the screen, required method for game
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    handleInput(dir) {
        switch (dir) {
            case 'up':
                if (this.y > 0) {
                    this.y = this.y - ROW_HEIGHT;
                    if (this.y < MIN_PLAYER_Y) {
                        this.win();
                    }
                }
                break;
            case 'down':
                if (this.y < MAX_PLAYER_Y) {
                    this.y = this.y + ROW_HEIGHT;
                }
                break;
            case 'left':
                if (this.x > MIN_PLAYER_X) {
                    this.x = this.x - MAX_BLOCK_WIDTH;
                }
                break;
            case 'right':
                if (this.x < MAX_PLAYER_X) {
                    this.x = this.x + MAX_BLOCK_WIDTH;
                }
                break;
        }
    }
    die() {
        score.decrease();
        this.x = PLAYER_START_X;
        this.y = PLAYER_START_Y;
    }
    win() {
        score.increase();
        this.x = PLAYER_START_X;
        this.y = PLAYER_START_Y;
    }
}

class Score {
    constructor() {
        this.score = 0;
    }
    render() {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, MAX_CANVAS_WIDTH, 50);
        ctx.font = "32pt arial";
        ctx.fillStyle = "red";
        ctx.strokeStyle = "red";
        ctx.lineWidth = 1;
        ctx.strokeText('Score: ' + this.score, 10, 40);
        ctx.strokeRect(0, 0, MAX_CANVAS_WIDTH, 50);
    }
    decrease() {
        this.score--;
        this.render();
    }
    increase() {
        this.score = +WIN_SCORE;
        this.render();
    }
}

var allEnemies = [];

for (var i = 1; i <= LANE_COUNT; i++) {
    for (var j = 1; j <= ENEMY_PER_LANE; j++) {
        var nme = new Enemy(i % 2 ? DIR_LEFT_RIGHT : DIR_RIGHT_LEFT, i);
        allEnemies.push(nme);
    }
}

allEnemies.forEach(function(enemy) {
    enemy.startRunning();
});

var player = new Player();

var score = new Score();

document.addEventListener('keyup', function (e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
