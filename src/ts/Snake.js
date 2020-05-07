import { c, GameState, GC } from "./main.js";
var Snake = /** @class */ (function () {
    function Snake() {
        this.initialSize = 4;
        var coords = this.generateRandomCoords();
        this.parts = [
            {
                x: coords.x,
                y: coords.y
            }
        ];
        this.generateInitialParts();
        this.velocity = {
            x: 1,
            y: 0
        };
        this.foodCoords = this.generateFoodCoords();
        this.lastPartCoords = null;
        this.grow = false;
    }
    Snake.prototype.move = function (dir) {
        switch (dir) {
            case 'w':
                if (this.velocity.y !== 1) {
                    this.velocity.x = 0;
                    this.velocity.y = -1;
                }
                break;
            case 'a':
                if (this.velocity.x !== 1) {
                    this.velocity.x = -1;
                    this.velocity.y = 0;
                }
                break;
            case 's':
                if (this.velocity.y !== -1) {
                    this.velocity.x = 0;
                    this.velocity.y = 1;
                }
                break;
            case 'd':
                if (this.velocity.x !== -1) {
                    this.velocity.x = 1;
                    this.velocity.y = 0;
                }
                break;
            default:
                break;
        }
    };
    Snake.prototype.draw = function () {
        // Render food
        this.renderFood();
        // Render body part after eating
        if (this.grow) {
            this.parts.push({
                x: this.lastPartCoords.x,
                y: this.lastPartCoords.y
            });
            // Reset grow
            this.grow = false;
        }
        // Render the parts
        this.renderBodyParts();
        // Move
        for (var i = this.parts.length - 1; i > 0; i--) {
            this.parts[i].x = this.parts[i - 1].x;
            this.parts[i].y = this.parts[i - 1].y;
        }
        this.parts[0].x += GC.scale * this.velocity.x;
        this.parts[0].y += GC.scale * this.velocity.y;
        // Check for self and wall collision
        if (this.checkWallCollision() || this.checkSelfCollision()) {
            GC.gameState = GameState.GAME_OVER;
        }
        // Check for food collision
        if (this.checkFoodCollision()) {
            this.grow = true;
            GC.score++;
        }
        // Save last part coords
        this.saveLastPartsCoordinates();
    };
    /**
     * @private
     * @method checkSelfCollision
     * Takes all the body parts and checks if their coordinates overlap with first body parts (snake head).
     * Second body part will be excluded, because of the way parts are rendered, second parts coordinates will always
     * overlap with the first ones (snake heads) for a brief moment.
     * @returns { boolean } True if self collision was detected, otherwise false.
     */
    Snake.prototype.checkSelfCollision = function () {
        for (var i = 1; i < this.parts.length; i++) {
            if (this.parts[0].x === this.parts[i].x && this.parts[0].y === this.parts[i].y) {
                return true;
            }
        }
        return false;
    };
    /**
     * @private
     * @method checkFoodCollision
     * Checks if food coordinates overlap with first parts (snake head) coordinates.
     * @returns { boolean } True if first parts (snake head) coordinates overlap with foods coordinates, false otherwise.
     */
    Snake.prototype.checkFoodCollision = function () {
        if (this.parts[0].x === this.foodCoords.x &&
            this.parts[0].y === this.foodCoords.y) {
            this.foodCoords = this.generateFoodCoords();
            this.saveLastPartsCoordinates();
            return true;
        }
        return false;
    };
    /**
     * @private
     * @method saveLastPartsCoordinatesAfterEating
     * Sets lastPartCoords field of the class. Usually called when @function checkFoodCollision returns true.
     * @see checkFoodCollision
     */
    Snake.prototype.saveLastPartsCoordinates = function () {
        this.lastPartCoords = {
            x: this.parts[this.parts.length - 1].x,
            y: this.parts[this.parts.length - 1].y
        };
    };
    /**
     * @private
     * @method checkWallCollision
     * Checks if first parts (snake head) coordinates are outside the perimeters of the canvas.
     * @returns { boolean } True if first part (snake head) is out of the canvas perimeters, false otherwise.
     */
    Snake.prototype.checkWallCollision = function () {
        return this.parts[0].x < 0 || this.parts[0].x >= GC.canvasWidth ||
            this.parts[0].y < 0 || this.parts[0].y >= GC.canvasHeight;
    };
    Snake.prototype.renderBodyParts = function () {
        this.parts.forEach(function (el) {
            c.beginPath();
            c.rect(el.x, el.y, GC.scale, GC.scale);
            c.fillStyle = 'rgb(231,231,231)';
            c.stroke();
            c.fill();
        });
    };
    Snake.prototype.renderFood = function () {
        // Render food
        c.beginPath();
        c.rect(this.foodCoords.x, this.foodCoords.y, GC.scale, GC.scale);
        c.fillStyle = 'rgba(100, 255, 100, .8)';
        c.fill();
        // Render food glow
        c.beginPath();
        c.rect(this.foodCoords.x - GC.scale, this.foodCoords.y, GC.scale, GC.scale);
        c.fillStyle = 'rgba(100, 255, 100, .04)';
        c.fill();
        c.beginPath();
        c.rect(this.foodCoords.x + GC.scale, this.foodCoords.y, GC.scale, GC.scale);
        c.fill();
        c.beginPath();
        c.rect(this.foodCoords.x, this.foodCoords.y - GC.scale, GC.scale, GC.scale);
        c.fill();
        c.beginPath();
        c.rect(this.foodCoords.x, this.foodCoords.y + GC.scale, GC.scale, GC.scale);
        c.fill();
        // Render secondary glow
        c.beginPath();
        c.rect(this.foodCoords.x - GC.scale, this.foodCoords.y - GC.scale, GC.scale, GC.scale);
        c.fillStyle = 'rgba(100, 255, 100, .015)';
        c.fill();
        c.beginPath();
        c.rect(this.foodCoords.x - GC.scale, this.foodCoords.y + GC.scale, GC.scale, GC.scale);
        c.fill();
        c.beginPath();
        c.rect(this.foodCoords.x + GC.scale, this.foodCoords.y - GC.scale, GC.scale, GC.scale);
        c.fill();
        c.beginPath();
        c.rect(this.foodCoords.x + GC.scale, this.foodCoords.y + GC.scale, GC.scale, GC.scale);
        c.fill();
    };
    Snake.prototype.generateInitialParts = function () {
        for (var i = 1; i < this.initialSize; i++) {
            this.parts.push({
                x: this.parts[0].x - GC.scale * i,
                y: this.parts[0].y
            });
        }
    };
    Snake.prototype.generateRandomIntInRange = function (min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    };
    Snake.prototype.generateRandomCoords = function () {
        var _x = [];
        var _y = [];
        for (var i = this.initialSize * GC.scale; i < GC.canvasWidth - (GC.scale * this.initialSize); i += GC.scale) {
            _x.push(i);
        }
        for (var i = this.initialSize * GC.scale; i < GC.canvasHeight - (GC.scale * this.initialSize); i += GC.scale) {
            _y.push(i);
        }
        return {
            x: _x[this.generateRandomIntInRange(0, _x.length)],
            y: _y[this.generateRandomIntInRange(0, _y.length)]
        };
    };
    Snake.prototype.generateFoodCoords = function () {
        var coords = this.generateRandomCoords();
        for (var i = 0; i < this.parts.length; i++) {
            if (coords.x === this.parts[i].x && coords.y === this.parts[i].y) {
                coords = this.generateRandomCoords();
                i = -1;
            }
        }
        return coords;
    };
    Snake.prototype.reset = function () {
        this.initialSize = 4;
        var coords = this.generateRandomCoords();
        this.parts = [
            {
                x: coords.x,
                y: coords.y
            }
        ];
        this.generateInitialParts();
        this.velocity = {
            x: 1,
            y: 0
        };
        this.foodCoords = this.generateFoodCoords();
        this.lastPartCoords = null;
        this.grow = false;
    };
    return Snake;
}());
export default Snake;
