"use strict";
var _a;
const rows = 10;
const columns = 10;
let gameInterval = null;
const Direction = {
    UP: "UP",
    RIGHT: "RIGHT",
    DOWN: "DOWN",
    LEFT: "LEFT",
};
class LinkedListNode {
    constructor(value) {
        this.value = value;
        this.next = null;
    }
}
class SinglyLinkedList {
    constructor(value) {
        const node = new LinkedListNode(value);
        this.head = node;
        this.tail = node;
        this.length = 1;
    }
    append(value) {
        const newNode = new LinkedListNode(value);
        this.tail.next = newNode;
        this.tail = newNode;
        this.length++;
    }
    removeHead() {
        if (!this.head)
            return null;
        const removedHead = this.head;
        this.head = this.head.next;
        this.length--;
        return removedHead;
    }
}
const game = document.getElementById("game");
let ctx = game.getContext("2d");
game.width = 800;
game.height = 800;
if (!ctx) {
    throw new Error("No context found!");
}
const boardWidth = game.width;
const boardHeight = game.height;
ctx.fillStyle = "blue";
ctx.fillRect(0, 0, boardWidth, boardHeight);
document.addEventListener("keydown", handleKeyPress);
function handleKeyPress(event) {
    switch (event.key) {
        case "w":
        case "ArrowUp":
            if (direction !== Direction.DOWN)
                direction = Direction.UP;
            break;
        case "d":
        case "ArrowRight":
            if (direction !== Direction.LEFT)
                direction = Direction.RIGHT;
            break;
        case "s":
        case "ArrowDown":
            if (direction !== Direction.UP)
                direction = Direction.DOWN;
            break;
        case "a":
        case "ArrowLeft":
            if (direction !== Direction.RIGHT)
                direction = Direction.LEFT;
            break;
    }
}
//============== decare states =============================
const startingPosition = {
    row: 5,
    col: 5,
    cell: 56,
};
const snake = new SinglyLinkedList(startingPosition);
const snakePostion = new Set(((_a = snake.head) === null || _a === void 0 ? void 0 : _a.value.cell) !== undefined ? [snake.head.value.cell] : []);
//============== decare states ends=============================
const getCoordsInDirection = (coords, direction) => {
    if (direction === Direction.UP) {
        if (coords.row === 0) {
            return {
                row: 9,
                col: coords.col,
            };
        }
        else {
            return {
                row: coords.row - 1,
                col: coords.col,
            };
        }
    }
    if (direction === Direction.RIGHT) {
        if (coords.col === 10) {
            return {
                row: coords.row,
                col: 0,
            };
        }
        else {
            return {
                row: coords.row,
                col: coords.col + 1,
            };
        }
    }
    if (direction === Direction.DOWN) {
        if (coords.row === 9) {
            return {
                row: 0,
                col: coords.col,
            };
        }
        else {
            return {
                row: coords.row + 1,
                col: coords.col,
            };
        }
    }
    if (direction === Direction.LEFT) {
        if (coords.col === 0) {
            return {
                row: coords.row,
                col: 10,
            };
        }
        else {
            return {
                row: coords.row,
                col: coords.col - 1,
            };
        }
    }
};
let direction = Direction.LEFT;
let foodConsumed = true;
let foodPosition = null;
function generateFoodPosition() {
    const matrix = createMatrix(rows, columns);
    let row = Math.floor(Math.random() * rows);
    let col = Math.floor(Math.random() * columns);
    let cell = matrix[row][col];
    // Ensure food is not placed on the snake
    while (snakePostion.has(cell)) {
        row = Math.floor(Math.random() * rows);
        col = Math.floor(Math.random() * columns);
        cell = matrix[row][col];
    }
    foodPosition = { row, col, cell };
}
function drawFood() {
    if (foodPosition) {
        ctx.fillStyle = "green";
        ctx.fillRect(foodPosition.col * 80, foodPosition.row * 80, 80, 80);
    }
}
function stopGame() {
    if (gameInterval !== null) {
        clearInterval(gameInterval); // Stop the game loop
        alert("Game Over! The snake hit itself."); // Notify the player
    }
}
gameInterval = setInterval(() => {
    moveSnake();
}, 300);
function moveSnake() {
    var _a, _b, _c, _d, _e, _f;
    const currentHeadCoords = {
        row: (_b = (_a = snake.head) === null || _a === void 0 ? void 0 : _a.value.row) !== null && _b !== void 0 ? _b : 0,
        col: (_d = (_c = snake.head) === null || _c === void 0 ? void 0 : _c.value.col) !== null && _d !== void 0 ? _d : 0,
        cell: (_f = (_e = snake.head) === null || _e === void 0 ? void 0 : _e.value.cell) !== null && _f !== void 0 ? _f : 0,
    };
    const matrix = createMatrix(rows, columns);
    const nextHeadCoords = getCoordsInDirection(currentHeadCoords, direction);
    if (!nextHeadCoords) {
        return;
    }
    const nextHeadCell = matrix[nextHeadCoords.row][nextHeadCoords.col];
    if (snakePostion.has(nextHeadCell)) {
        stopGame(); // Stop the game if the snake hits itself
        return;
    }
    if (foodPosition && nextHeadCoords.row === foodPosition.row && nextHeadCoords.col === foodPosition.col) {
        foodConsumed = true; // Snake eats food
        generateFoodPosition(); // Generate new food position
    }
    const newHead = new LinkedListNode({
        row: nextHeadCoords.row,
        col: nextHeadCoords.col,
        cell: nextHeadCell,
    });
    const currentHead = snake.head;
    snake.head = newHead;
    if (currentHead)
        currentHead.next = newHead;
    const newSnakeCells = new Set(snakePostion);
    // Remove the tail from the snake
    newSnakeCells.delete(snake.tail.value.cell);
    // Add the new head cell
    newSnakeCells.add(nextHeadCell);
    // Move the tail forward
    if (snake.tail.next) {
        snake.tail = snake.tail.next;
    }
    else {
        // If there's no next node, reset the tail to the new head
        snake.tail = snake.head;
    }
    if (foodConsumed) {
        growSnake(newSnakeCells);
    }
    snakePostion.clear();
    newSnakeCells.forEach((cell) => {
        snakePostion.add(cell);
    });
    drawBoard(snakePostion);
    drawFood();
}
function growSnake(newSnakeCells) {
    const growthNodeCoords = getGrowthNodeCoords(snake.tail, direction);
    const matrix = createMatrix(rows, columns);
    if (!growthNodeCoords) {
        return;
    }
    const newTailCell = matrix[growthNodeCoords.row][growthNodeCoords.col];
    const newTail = new LinkedListNode({
        row: growthNodeCoords.row,
        col: growthNodeCoords.col,
        cell: newTailCell,
    });
    const currentTail = snake.tail;
    snake.tail = newTail;
    snake.tail.next = currentTail;
    newSnakeCells.add(newTailCell);
    foodConsumed = false;
}
function getGrowthNodeCoords(snakeTail, currentDirection) {
    const tailNextNodeDirection = getNextNodeDirection(snakeTail, currentDirection);
    const growthDirection = getOppositeDirection(tailNextNodeDirection);
    const currentTailCoords = {
        row: snakeTail.value.row,
        col: snakeTail.value.col,
    };
    const growthNodeCoords = getCoordsInDirection(currentTailCoords, growthDirection);
    return growthNodeCoords;
}
const getOppositeDirection = (direction) => {
    if (direction === Direction.UP)
        return Direction.DOWN;
    if (direction === Direction.RIGHT)
        return Direction.LEFT;
    if (direction === Direction.DOWN)
        return Direction.UP;
    if (direction === Direction.LEFT)
        return Direction.RIGHT;
};
function getNextNodeDirection(node, currentDirection) {
    if (node.next === null)
        return currentDirection;
    const { row: currentRow, col: currentCol } = node.value;
    const { row: nextRow, col: nextCol } = node.next.value;
    if (nextRow === currentRow && nextCol === currentCol + 1) {
        return Direction.RIGHT;
    }
    if (nextRow === currentRow && nextCol === currentCol - 1) {
        return Direction.LEFT;
    }
    if (nextCol === currentCol && nextRow === currentRow + 1) {
        return Direction.DOWN;
    }
    if (nextCol === currentCol && nextRow === currentRow - 1) {
        return Direction.UP;
    }
    return '';
}
function createMatrix(rows, columns) {
    const matrix = [];
    let value = 1;
    for (let i = 0; i < rows; i++) {
        const row = []; // Create a new row
        for (let j = 0; j < columns; j++) {
            row.push(value); // Add the current value to the row
            value++; // Increment value for next element
        }
        matrix.push(row); // Add the row to the matrix
    }
    return matrix;
}
function drawBlock(i, j) {
    const blockSize = 80; // Size of each block
    const borderColor = "gray"; // Color of the border
    ctx.fillStyle = "black";
    ctx.fillRect(j * blockSize, i * blockSize, blockSize, blockSize);
}
function drawSnake(i, j) {
    console.log("drawSnake");
    ctx.fillStyle = "red";
    ctx.fillRect(i * 80, j * 80, 80, 80);
}
function drawBoard(snakePostion) {
    const matrix = createMatrix(rows, columns);
    // Clear the canvas before redrawing
    // ctx.clearRect(0, 0, game.width, game.height);
    ctx.reset();
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            const cellValue = matrix[i][j];
            if (!snakePostion.has(cellValue)) {
                drawBlock(i, j);
            }
        }
    }
}
generateFoodPosition();
drawBoard(snakePostion);
