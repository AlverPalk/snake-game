import { c, GameState, GC } from "./main.js";

/**
 * @class Snake
 * @classdesc Collection of snake properties and methods needed to manipulate set snakes appearance and behaviour.
 * @field { x: number, y: number }[] parts - Array containing snake body part objects. Set objects have x and y
 * properties that describe the x and y coordinates on the canvas.
 * @field { x: number, y: number } velocity - Object containing x and y properties that describe the current velocity
 * on corresponding axis.
 * @field { x: number, y: number } foodCoords - Object containing x and y properties that describe the current
 * coordinates of the food.
 * @field ({ x: number, y: number } | null) - Object containing x and y properties that describe the x and y coordinates
 * of the last body part during last render cycle.
 * @field { number } initialSize - Initial size of the snake.
 * @field { boolean } grow - Indicates if snake should grow during this render cycle.
 */
export default class Snake {
    private parts: { x: number, y: number }[];
    private velocity: { x: number, y: number };
    private foodCoords: { x: number, y: number };
    private lastPartCoords: { x: number, y: number} | null;
    private initialSize: number;
    private grow: boolean;

    constructor() {
        this.initialSize = 4;
        const coords = this.generateRandomCoords();
        this.parts = [
            {
                x: coords.x,
                y: coords.y
            }
        ]
        this.generateInitialParts();
        this.velocity = {
            x: 1,
            y: 0
        }
        this.foodCoords = this.generateFoodCoords();
        this.lastPartCoords = null;
        this.grow = false;
    }

    /**
     * @public
     * @method move
     * Assignees appropriate velocity parameters (x, y) based on provided character that indicated which direction
     * key was pressed.
     * @param {string} dir - Character based on keyboard input.
     */
    move(dir: string) {
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
    }

    /**
     * @public
     * @method draw
     * Handles all the aspects that are needed for drawing.
     */
    draw() {
        // Render food
        this.renderFood();

        // Add body part after eating
        if (this.grow) {
            this.addBodyPart();
            this.grow = false;
        }

        // Render the parts
        this.renderBodyParts();

        // Animate snake
        this.animateSnake();

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

    }

    /**
     * @private
     * @method addBodyPart
     * Adds another body part to parts array, based on coordinates saved during last render iteration.
     */
    private addBodyPart() {
        this.parts.push(
            {
                x: this.lastPartCoords!.x,
                y: this.lastPartCoords!.y
            }
        );
    }

    /**
     * @private
     * @mehod animateSnake
     * Starting from the end of the parts (snake body parts) array, assigns the coordinates of the part that comes
     * before them to them self. First part of the array is excluded from this iteration. After the loop finishes,
     * first part (snake head) is assigned new coordinates based on appropriate velocity * scale.
     */
    private animateSnake() {
        for (let i = this.parts.length - 1; i > 0; i--) {
            this.parts[i].x = this.parts[i - 1].x;
            this.parts[i].y = this.parts[i - 1].y;
        }

        this.parts[0].x += GC.scale * this.velocity.x;
        this.parts[0].y += GC.scale * this.velocity.y;
    }

    /**
     * @private
     * @method checkSelfCollision
     * Takes all the body parts and checks if their coordinates overlap with first body parts (snake head).
     * Second body part will be excluded, because of the way parts are rendered, second parts coordinates will always
     * overlap with the first ones (snake heads) for a brief moment.
     * @returns { boolean } True if self collision was detected, otherwise false.
     */
    private checkSelfCollision() {
        for (let i = 1; i < this.parts.length; i++) {
            if (this.parts[0].x === this.parts[i].x && this.parts[0].y === this.parts[i].y) {
                return true;
            }
        }
        return false;
    }

    /**
     * @private
     * @method checkFoodCollision
     * Checks if food coordinates overlap with first parts (snake head) coordinates.
     * @returns { boolean } True if first parts (snake head) coordinates overlap with foods coordinates, false otherwise.
     */
    private checkFoodCollision() {
        if (this.parts[0].x === this.foodCoords.x &&
            this.parts[0].y === this.foodCoords.y) {
            this.foodCoords = this.generateFoodCoords();
            this.saveLastPartsCoordinates();
            return true;
        }
        return false;
    }

    /**
     * @private
     * @method saveLastPartsCoordinatesAfterEating
     * Sets lastPartCoords field of the class. Usually called when @function checkFoodCollision returns true.
     * @see checkFoodCollision
     */
    private saveLastPartsCoordinates() {
        this.lastPartCoords = {
            x: this.parts[this.parts.length - 1].x,
            y: this.parts[this.parts.length - 1].y
        }
    }

    /**
     * @private
     * @method checkWallCollision
     * Checks if first parts (snake head) coordinates are outside the perimeters of the canvas.
     * @returns { boolean } True if first part (snake head) is out of the canvas perimeters, false otherwise.
     */
    private checkWallCollision() {
        return this.parts[0].x < 0 || this.parts[0].x >= GC.canvasWidth ||
            this.parts[0].y < 0 || this.parts[0].y >= GC.canvasHeight;

    }

    /**
     * @private
     * @method renderBodyParts
     * Iterates over each body part in parts array and creates a canvas element, based on that elements properties.
     */
    private renderBodyParts() {
        this.parts.forEach((el) => {
            c.beginPath();
            c.rect(el.x, el.y, GC.scale, GC.scale);
            c.fillStyle = 'rgb(231,231,231)';
            c.stroke();
            c.fill();
        })
    }

    /**
     * @private
     * @method renderFood
     * Creates canvas food element and its glow elements based on food coordinates found in class field (foodCoordinates).
     */
    private renderFood() {
        // Render food
        c.beginPath();
        c.rect(this.foodCoords.x, this.foodCoords.y, GC.scale, GC.scale);
        c.fillStyle = 'rgba(100, 255, 100, .8)'
        c.fill();

        // Render food glow
        c.beginPath();
        c.rect(this.foodCoords.x - GC.scale, this.foodCoords.y, GC.scale, GC.scale);
        c.fillStyle = 'rgba(100, 255, 100, .04)'
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
        c.fillStyle = 'rgba(100, 255, 100, .015)'
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

    }

    /**
     * @private
     * @method generateInitialParts
     * Creates new part objects and assigns appropriate coordinates to them. Coordinates are based on last parts
     * coordinates - 1 part, so basically parts are generated after one another on the X axis. After that parts are
     * pushed into the parts array.
     */
    private generateInitialParts() {
        for (let i = 1; i < this.initialSize; i++) {
            this.parts.push(
                {
                    x: this.parts[0].x - GC.scale * i,
                    y: this.parts[0].y
                }
            )
        }
    }

    /**
     * @private
     * @method generateRandomIntInRange
     * Util method for generating random whole number between a given range..
     * @param {number} min - Minimum number to be generated.
     * @param {number} max - Maximum number to be generated.
     * @returns {number} Calculated random number between given range.
     */
    private generateRandomIntInRange(min: number, max: number) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    /**
     * @private
     * @method generateRandomCoords
     * Generates random x and y coordinates that are within the canvas perimeters and adds them into corresponding
     * arrays. After that random x and y coordinates that were added the the corresponding arrays are selected and
     * returned as part of a new object.
     * @returns {{x: number; y: number}} Random coordinates withing the canvas perimeters.
     */
    private generateRandomCoords() {
        let _x: number[] = [];
        let _y: number[] = [];

        for (let i = this.initialSize * GC.scale; i < GC.canvasWidth - (GC.scale * this.initialSize); i += GC.scale) {
            _x.push(i);
        }

        for (let i = this.initialSize * GC.scale; i < GC.canvasHeight - (GC.scale * this.initialSize); i += GC.scale) {
            _y.push(i)
        }

        return {
            x: _x[this.generateRandomIntInRange(0, _x.length)],
            y: _y[this.generateRandomIntInRange(0, _y.length)]
        }
    }

    /**
     * @private generateFoodCoords
     * Using method generateRandomCoords, generates random coordinates within the canvas perimeters. After that the
     * coordinates are checked if they overlap with any of the parts array (snake body parts) coordinates. If they do,
     * new coordinates are generated. This process is repeated until appropriate coordinates are generated.
     * @see generateRandomCoords
     * @returns {{x: number; y: number}} Random food coordinates withing the canvas perimeters.
     */
    private generateFoodCoords() {
        let coords = this.generateRandomCoords();
        for (let i = 0; i < this.parts.length; i++) {
            if (coords.x === this.parts[i].x && coords.y === this.parts[i].y) {
                coords = this.generateRandomCoords();
                i = -1;
            }
        }

        return coords;
    }

    /**
     * @private
     * @method
     * Resets all the fields of the class
     */
    reset() {
        this.initialSize = 4;
        const coords = this.generateRandomCoords();
        this.parts = [
            {
                x: coords.x,
                y: coords.y
            }
        ]
        this.generateInitialParts();
        this.velocity = {
            x: 1,
            y: 0
        }
        this.foodCoords = this.generateFoodCoords();
        this.lastPartCoords = null;
        this.grow = false;
    }
}