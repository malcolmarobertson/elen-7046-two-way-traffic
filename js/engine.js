'use strict';

var Engine = (function(global) {
	  'use strict';
	  
	  
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime;

    canvas.width = 909;
    canvas.height = 606;
    doc.body.appendChild(canvas);

    function main() {
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        update(dt);
        render();

        lastTime = now;

        win.requestAnimationFrame(main);
    }

    function init() {
        reset();
        lastTime = Date.now();
        main();
    }

    function update(dt) {
        updateEntities(dt);
        checkCollisions();
    }

    function updateEntities(dt) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
        //score.render();
        //player.update();
    }

    function render() {
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
                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
            }
        }

        renderEntities();
    }

    function renderEntities() {
        allEnemies.forEach(function(enemy) {
            enemy.render();
        });

        player.render();
        score.render();
    }

    function reset() {
        // noop
    }

    Resources.load([
        'images/stone-block.png',
        'images/grass-block.png',
        'images/car-l-r.png',
        'images/car-r-l.png',
        'images/char-boy.png'
    ]);
    Resources.onReady(init);

    global.ctx = ctx;
    
    function checkCollisions() {
        allEnemies.forEach(function(enemy) {
    
            var A = [enemy.x, enemy.y + ENEMY_ROW_HEIGHT_ADJUST];
            var B = [enemy.x + MAX_BLOCK_WIDTH, enemy.y + ENEMY_ROW_HEIGHT_ADJUST];
            var C = [enemy.x + MAX_BLOCK_WIDTH, enemy.y + ROW_HEIGHT + ENEMY_ROW_HEIGHT_ADJUST];
            var D = [enemy.x, enemy.y + ROW_HEIGHT + ENEMY_ROW_HEIGHT_ADJUST];
    
            var W = [player.x, player.y + PLAYER_ROW_HEIGHT_ADJUST_1];
            var X = [player.x + MAX_BLOCK_WIDTH, player.y + PLAYER_ROW_HEIGHT_ADJUST_1];
            var Y = [player.x + MAX_BLOCK_WIDTH, player.y + ROW_HEIGHT + PLAYER_ROW_HEIGHT_ADJUST_2];
            var Z = [player.x, player.y + ROW_HEIGHT + PLAYER_ROW_HEIGHT_ADJUST_2];
    
            if (enemy.x > 0 && enemy.x < MAX_CANVAS_WIDTH) {
                if (checkPointInRectangle(A, B, C, D, W) ||
                    checkPointInRectangle(A, B, C, D, X) ||
                    checkPointInRectangle(A, B, C, D, Y) ||
                    checkPointInRectangle(A, B, C, D, Z)) {
                    enemy.die();
                    player.die();
    
                };
            }
        });
    };
    function checkPointInRectangle(A, B, C, D, P){
    
        //reference: https://martin-thoma.com/how-to-check-if-a-point-is-inside-a-rectangle/
        //
        //area of enemy rectangle, I could have used the simple rectangle aligned with x-y axis formula but
        //this is fun and who knows, maybe I will need it :)
        //           = 0.5           | (yA   - yC  )�(xD   - xB  )  +  (yB   - yD  )�(xA   - xC)|
        var areaRect = 0.5 * Math.abs(((A[1] - C[1])*(D[0] - B[0])) + ((B[1] - D[1])*(A[0] - C[0])));
    
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
    
        var totTri = ABP+BCP+CDP+DAP;
    
        return areaRect == totTri;
    
    }
})(this);
