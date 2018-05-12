// Score object handles overall score for the game, 
// starting at zero when the game starts
class Score {
    constructor() {
        this.score = 0;
    }

    //renders score on the HTML5 canvas
    render() {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, config.maxCanvasWidth, 50);
        ctx.font = "32pt arial";
        ctx.fillStyle = "red";
        ctx.strokeStyle = "red";
        ctx.lineWidth = 1;
        ctx.strokeText('Score: ' + this.score, 10, 40);
        ctx.strokeRect(0, 0, config.maxCanvasWidth, 50);
    }

    //decreases score by 1
    decrease() {
        this.score--;
        this.render();
    }

    //increases score by winning cofiguration score
    increase() {
        this.score += config.winScore;
        this.render();
    }
}
