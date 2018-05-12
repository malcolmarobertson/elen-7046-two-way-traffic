// the Game engine controls the Enemy timing, Enemy and Player rendering,
// rendering the grid graphics based on configuration
class Engine {

    //constructs object with reference to HTML5 canvas and sets grid size
    constructor(global) {
        this.doc = global.document;
        this.win = global.window;
        this.canvas = this.doc.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.lastTime;
        this.canvas.width = 909;
        this.canvas.height = 606;
        this.doc.body.appendChild(this.canvas);
        global.ctx = this.ctx;
    }

    //controls the intervals of updating and rendering the game objects based on time 
    main() {
        var that = this;
        var now = Date.now(),
            dt = (now - this.lastTime) / 1000.0;

        this.update(dt);
        this.render();

        this.lastTime = now;

        this.win.requestAnimationFrame(function () {
            that.main();
        });
    }

    //initializes object and calls Main function
    init() {
        this.reset();
        this.lastTime = Date.now();
        this.main();
    }

    update(dt) {
        this.updateEntities(dt);
        this.checkCollisions();
    }

    //updates the entities registered to the object 
    updateEntities(dt) {
        allEnemies.enemies.forEach(function (enemy) {
            enemy.update(dt);
        });
    }

    //renders the constant unmoving objects as well as the Enemy objects
    render() {
        var rowImages = [
            'images/grass-block.png',   // Row 1 of 1 of grass
            'images/stone-block.png',   // Row 1 of 2 of stone
            'images/stone-block.png',   // Row 2 of 2 of stone
            'images/grass-block.png'    // Row 1 of 1 of grass
        ],
            numRows = 4,
            numCols = 9,
            row, col;

        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                ctx.drawImage(resources.get(rowImages[row]), col * 101, row * 83);
            }
        }

        this.renderEntities();
    }

    // renders the , enemy, player and score objects
    renderEntities() {
        allEnemies.enemies.forEach(function (enemy) {
            enemy.render();
        });

        player.render();
        score.render();
    }

    //place holder for reset
    reset() {
        // noop
    }

    //checks collisions between player and all enemies by checking if any points within 
    // the player rectangle are within any of the enemies' rectangles
    checkCollisions() {
        var that = this;
        allEnemies.enemies.forEach(function (enemy) {

            var A = [enemy.x, enemy.y + config.enemyRowHeightAdjust];
            var B = [enemy.x + config.maxBlockWidth, enemy.y + config.enemyRowHeightAdjust];
            var C = [enemy.x + config.maxBlockWidth, enemy.y + config.rowHeight + config.enemyRowHeightAdjust];
            var D = [enemy.x, enemy.y + config.rowHeight + config.enemyRowHeightAdjust];

            var W = [player.x, player.y + config.playerRowHeightAdjust1];
            var X = [player.x + config.maxBlockWidth, player.y + config.playerRowHeightAdjust1];
            var Y = [player.x + config.maxBlockWidth, player.y + config.rowHeight + config.playerRowHeightAdjust2];
            var Z = [player.x, player.y + config.rowHeight + config.playerRowHeightAdjust2];

            if (enemy.x > 0 && enemy.x < config.maxCanvasWidth) {
                if (that.checkPointInRectangle(A, B, C, D, W) ||
                that.checkPointInRectangle(A, B, C, D, X) ||
                that.checkPointInRectangle(A, B, C, D, Y) ||
                that.checkPointInRectangle(A, B, C, D, Z)) {
                    enemy.die();
                    player.die();

                };
            }
        });
    }

    //checks whether an [x,y] point exists within a rectangle
    checkPointInRectangle(A, B, C, D, P) {

        //reference: https://martin-thoma.com/how-to-check-if-a-point-is-inside-a-rectangle/
        //
        //area of enemy rectangle, I could have used the simple rectangle aligned with x-y axis formula but
        //this is fun and who knows, maybe I will need it :)
        //           = 0.5           | (yA   - yC  )�(xD   - xB  )  +  (yB   - yD  )�(xA   - xC)|
        var areaRect = 0.5 * Math.abs(((A[1] - C[1]) * (D[0] - B[0])) + ((B[1] - D[1]) * (A[0] - C[0])));

        var ABP = 0.5 * Math.abs(
            A[0] * (B[1] - P[1])
            + B[0] * (P[1] - A[1])
            + P[0] * (A[1] - B[1]));

        var BCP = 0.5 * Math.abs(
            (B[0] * (C[1] - P[1]))
            + (C[0] * (P[1] - B[1]))
            + (P[0] * (B[1] - C[1])));

        var CDP = 0.5 * Math.abs(
            (C[0] * (D[1] - P[1]))
            + (D[0] * (P[1] - C[1]))
            + (P[0] * (C[1] - D[1])));

        var DAP = 0.5 * Math.abs(
            (D[0] * (A[1] - P[1]))
            + (A[0] * (P[1] - D[1]))
            + (P[0] * (D[1] - A[1])));

        var totTri = ABP + BCP + CDP + DAP;

        return areaRect == totTri;

    }
}
