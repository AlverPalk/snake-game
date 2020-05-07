// @ts-ignore
import('../scss/main.scss');
import Snake from "./Snake.js";
var canvas = document.getElementById('canvas');
var c = canvas.getContext('2d');
var GameState;
(function (GameState) {
    GameState[GameState["MENU"] = 0] = "MENU";
    GameState[GameState["GAME_RUNNING"] = 1] = "GAME_RUNNING";
    GameState[GameState["GAME_OVER"] = 2] = "GAME_OVER";
})(GameState || (GameState = {}));
var Difficulty;
(function (Difficulty) {
    Difficulty[Difficulty["easy"] = 0] = "easy";
    Difficulty[Difficulty["medium"] = 20] = "medium";
    Difficulty[Difficulty["hard"] = 30] = "hard";
})(Difficulty || (Difficulty = {}));
export var GC = {
    scale: 40,
    canvasWidth: 1600,
    canvasHeight: 800,
    gameState: GameState.MENU,
    directionKey: '',
    score: 0
};
var snake = new Snake();
document.addEventListener('keypress', function (e) {
    switch (e.key.toLowerCase()) {
        case 'w':
            GC.directionKey = 'w';
            break;
        case 'a':
            GC.directionKey = 'a';
            break;
        case 's':
            GC.directionKey = 's';
            break;
        case 'd':
            GC.directionKey = 'd';
            break;
        default:
            break;
    }
});
document.getElementById('start-game').addEventListener('click', function () {
    document.getElementById('start-screen').style.display = 'none';
    var difficulty = document.getElementById('game-difficulty').value.toLowerCase();
    resetData();
    GC.scale -= Difficulty[difficulty];
    GC.gameState = GameState.GAME_RUNNING;
});
document.getElementById('start-menu').addEventListener('click', function () {
    GC.gameState = GameState.MENU;
    document.getElementById('game-over').style.display = 'none';
});
document.getElementById('play-again').addEventListener('click', function () {
    GC.score = 0;
    GC.directionKey = '';
    document.getElementById('game-over').style.display = 'none';
    GC.gameState = GameState.GAME_RUNNING;
    snake.reset();
});
function init() {
    canvas.height = GC.canvasHeight;
    canvas.width = GC.canvasWidth;
    resetData();
    update();
}
function resetData() {
    GC.score = 0;
    GC.directionKey = '';
    GC.scale = 40;
    snake.reset();
}
function update() {
    clear();
    // drawWireFrame();
    // Starting screen
    if (GC.gameState === GameState.MENU) {
        requestAnimationFrame(update);
        renderStartMenu();
        document.getElementById('start-screen').style.display = 'block';
    }
    // Game over screen
    if (GC.gameState === GameState.GAME_OVER) {
        requestAnimationFrame(update);
        document.getElementById('game-over').style.display = 'block';
        document.getElementById('score').textContent = GC.score.toString();
    }
    // Game in progress
    if (GC.gameState === GameState.GAME_RUNNING) {
        snake.move(GC.directionKey);
        snake.draw();
        renderScore();
        setTimeout(function () {
            update();
        }, 100);
    }
}
function renderStartMenu() {
    // CUBE
    c.beginPath();
    c.moveTo(900, 300);
    c.lineTo(1000, 350);
    c.lineTo(1000, 450);
    c.lineTo(900, 400);
    c.closePath();
    c.fillStyle = 'rgba(100, 255, 100, .65)';
    c.fill();
    c.beginPath();
    c.moveTo(900, 300);
    c.lineTo(1000, 250);
    c.lineTo(1100, 300);
    c.lineTo(1000, 350);
    c.closePath();
    c.fillStyle = 'rgba(100, 255, 100, .8)';
    c.fill();
    c.beginPath();
    c.moveTo(1000, 350);
    c.lineTo(1100, 300);
    c.lineTo(1100, 400);
    c.lineTo(1000, 450);
    c.fillStyle = 'rgba(100, 255, 100, .5)';
    c.fill();
    // CUBE GLOW
    c.beginPath();
    c.moveTo(1000, 450);
    c.lineTo(1100, 500);
    c.lineTo(1200, 450);
    c.lineTo(1100, 400);
    c.closePath();
    c.fillStyle = 'rgba(100, 255, 100, .04)';
    c.fill();
    c.beginPath();
    c.moveTo(1000, 450);
    c.lineTo(900, 500);
    c.lineTo(800, 450);
    c.lineTo(900, 400);
    c.closePath();
    c.fill();
    c.beginPath();
    c.moveTo(900, 400);
    c.lineTo(800, 350);
    c.lineTo(900, 300);
    c.closePath();
    c.fill();
    c.beginPath();
    c.moveTo(1100, 400);
    c.lineTo(1200, 350);
    c.lineTo(1100, 300);
    c.closePath();
    c.fill();
    // SECONDARY GLOW
    c.beginPath();
    c.moveTo(1100, 400);
    c.lineTo(1200, 450);
    c.lineTo(1300, 400);
    c.lineTo(1200, 350);
    c.closePath();
    c.fillStyle = 'rgba(100, 255, 100, .014)';
    c.fill();
    c.beginPath();
    c.moveTo(1000, 450);
    c.lineTo(1100, 500);
    c.lineTo(1000, 550);
    c.lineTo(900, 500);
    c.closePath();
    c.fill();
    c.beginPath();
    c.moveTo(900, 400);
    c.lineTo(800, 450);
    c.lineTo(700, 400);
    c.lineTo(800, 350);
    c.closePath();
    c.fill();
    // Render menu box
    c.beginPath();
    c.moveTo(100, 120);
    c.lineTo(520, 120);
    c.lineTo(520, 340);
    c.lineTo(220, 340);
    c.strokeStyle = '#1d1d1d';
    c.stroke();
    c.beginPath();
    c.moveTo(280, 100);
    c.lineTo(540, 100);
    c.lineTo(540, 640);
    c.lineTo(1400, 640);
    c.lineTo(1500, 580);
    c.strokeStyle = '#1d1d1d';
    c.stroke();
}
function renderScore() {
    c.beginPath();
    c.fillStyle = 'white';
    c.font = '20px Arial';
    c.fillText("Score: " + GC.score, 50, 50);
}
function clear() {
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.beginPath();
    c.rect(0, 0, canvas.width, canvas.height);
    c.fillStyle = '#111111';
    c.fill();
}
// Testing
function drawWireFrame() {
    // Draw vertical wireframe
    for (var i = 0; i < canvas.width; i += GC.scale) {
        c.beginPath();
        c.moveTo(GC.scale * i / GC.scale, 0);
        c.lineTo(GC.scale * i / GC.scale, canvas.height);
        c.strokeStyle = '#212121';
        c.stroke();
    }
    // Draw horizontal wireframe
    for (var i = 0; i < canvas.height; i += GC.scale) {
        c.beginPath();
        c.moveTo(0, GC.scale * i / GC.scale);
        c.lineTo(canvas.width, GC.scale * i / GC.scale);
        c.stroke();
    }
}
init();
export { c, GameState };
