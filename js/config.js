// basic class for configuration
// TODO: refactor into JSON config file to be read in on program start
class Config {
    constructor() {
        this.maxBlockWidth = 101,
        this.maxCanvasHeight = 606,
        this.maxCanvasWidth = 909,
        this.rowHeight = 83,
        this.rowHeightAdjust = 23,
        this.speedAdjust = 100,
        this.playerStartX = 404,
        this.playerStartY = 243,
        this.minPlayerX = 100,
        this.minPlayerY = 72,
        this.maxPlayerX = 800,
        this.maxPlayerY = 200,
        this.winScore = 5,
        this.enemyRowHeightAdjust = 71,
        this.playerRowHeightAdjust1 = 61,
        this.playerRowHeightAdjust2 = 55,
        this.dirLeftRight = "LR",
        this.dirRightLeft = "RL",
        this.laneCount = 2,
        this.enemyPerLane = 5,
        this.minEnemyDelay = 2000,
        this.maxEnemyDelay = 5000
    }
}