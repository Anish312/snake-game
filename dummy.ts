// const rows = 10;
// const cols = 10;

// class LinkedListNode {
//   value: number;
//   next: LinkedListNode | null;

//   constructor(value: number) {
//     this.value = value;
//     this.next = null;
//   }
// }

// class SinglyLinkedList {
//   head: LinkedListNode |null;
//   tail: LinkedListNode;
//   length: number;

//   constructor(value: number) {
//     const node = new LinkedListNode(value);
//     this.head = node;
//     this.tail = node;
//     this.length = 1;
//   }

//   append(value: number) {
//     const newNode = new LinkedListNode(value);
//     this.tail.next = newNode;
//     this.tail = newNode;
//     this.length++;
//   }

//   removeHead() {
//     if (!this.head) return null;
//     const removedHead = this.head;
//     this.head = this.head.next;
//     this.length--;
//     return removedHead;
//   }
// }

// const game = document.getElementById("game") as HTMLCanvasElement;
// let ctx = game.getContext("2d") as CanvasRenderingContext2D;

// game.width = 800;
// game.height = 800;

// if (!ctx) {
//   throw new Error("No context found!");
// }

// const boardWidth = game.width;
// const boardHeight = game.height;

// ctx.fillStyle = "black";
// ctx.fillRect(0, 0, boardWidth, boardHeight);

// const Direction = {
//   UP: 'UP',
//   RIGHT: 'RIGHT',
//   DOWN: 'DOWN',
//   LEFT: 'LEFT',
// } as const;

// type DirectionType = typeof Direction[keyof typeof Direction];

// let direction: DirectionType = Direction.RIGHT;
// const snake = new SinglyLinkedList(45); // Start with an arbitrary position, e.g., 45
// const snakePostion = new Set<number>();
// snakePostion.add(45);

// addEventListener("keydown", (e) => {
//   handleKeydown(e);
// });

// const handleKeydown = (e: KeyboardEvent) => {
//   const newDirection = getDirectionFromKey(e.key);
//   if (newDirection) {
//     if (!isOppositeDirection(newDirection)) {
//       direction = newDirection;
//     }
//   }
// };

// const getDirectionFromKey = (key: string): DirectionType | '' => {
//   if (key === 'ArrowUp') return Direction.UP;
//   if (key === 'ArrowRight') return Direction.RIGHT;
//   if (key === 'ArrowDown') return Direction.DOWN;
//   if (key === 'ArrowLeft') return Direction.LEFT;
//   return '';
// };

// const isOppositeDirection = (newDirection: DirectionType) => {
//   return (
//     (direction === Direction.UP && newDirection === Direction.DOWN) ||
//     (direction === Direction.DOWN && newDirection === Direction.UP) ||
//     (direction === Direction.LEFT && newDirection === Direction.RIGHT) ||
//     (direction === Direction.RIGHT && newDirection === Direction.LEFT)
//   );
// };

// const getCoordsInDirection = (coords: { row: number; col: number }, direction: DirectionType) => {
//   if (direction === Direction.UP && coords.row > 0) {
//     return {
//       row: coords.row - 1,
//       col: coords.col,
//     };
//   }
//   if (direction === Direction.RIGHT && coords.col < cols - 1) {
//     return {
//       row: coords.row,
//       col: coords.col + 1,
//     };
//   }
//   if (direction === Direction.DOWN && coords.row < rows - 1) {
//     return {
//       row: coords.row + 1,
//       col: coords.col,
//     };
//   }
//   if (direction === Direction.LEFT && coords.col > 0) {
//     return {
//       row: coords.row,
//       col: coords.col - 1,
//     };
//   }
//   return null; // Indicates going out of bounds
// };
 
// function moveSnake() {
//   if (!snake.head) {
//     console.log("Game over: Snake has no head.");
//     return;
//   }

//   const currentHeadCoords = {
   
//     row: Math.floor((snake.head.value - 1) / cols),
//     col: (snake.head.value - 1) % cols,
//   };

//   const nextHeadCoords = getCoordsInDirection(currentHeadCoords, direction);
//   if (!nextHeadCoords) {
//     console.log("Game over: Snake went out of bounds.");
//     return;
//   }

//   const nextHeadValue = nextHeadCoords.row * cols + nextHeadCoords.col + 1;

//   // Remove the tail unless eating food (food logic needed)
//   const removedTail = snake.removeHead();
//   if (removedTail) {
//     snakePostion.delete(removedTail.value);
//   }

//   // Add new head
//   snake.append(nextHeadValue);
//   snakePostion.add(nextHeadValue);
//   drawBoard();
// }

// function drawBlock(i: number, j: number) {
//   const blockSize = 80; // Size of each block
//   const borderColor = "gray"; // Color of the border
//   ctx.fillStyle = "black";
//   ctx.fillRect(j * blockSize, i * blockSize, blockSize, blockSize);
//   ctx.strokeStyle = borderColor;
//   ctx.lineWidth = 2;
//   ctx.strokeRect(j * blockSize, i * blockSize, blockSize, blockSize);
// }

// function drawSnake(i: number, j: number) {
//   ctx.fillStyle = "red";
//   ctx.fillRect(i * 80, j * 80, 80, 80);
// }

// function createMatrix(): number[][] {
//   const matrix: number[][] = [];
//   let value: number = 1;

//   for (let i = 0; i < rows; i++) {
//     matrix.push([]);
//   }

//   for (let j = 0; j < cols; j++) {
//     for (let i = 0; i < rows; i++) {
//       matrix[i][j] = value;
//       value++;
//     }
//   }

//   return matrix;
// }

// function drawBoard() {
//   const matrix = createMatrix();

//   for (let i = 0; i < rows; i++) {
//     for (let j = 0; j < cols; j++) {
//       if (snakePostion.has(matrix[i][j])) {
//         drawSnake(i, j);
//       } else {
//         drawBlock(i, j);
//       }
//     }
//   }
// }

// drawBoard();

// // Example game loop (to be expanded with food logic, game over conditions, etc.)
// setInterval(() => {
//   moveSnake();
// }, 500); // Adjust speed as needed
