const gridContainer = document.getElementById('grid-container');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');

const ROWS = 15;
const COLS = 20;

let grid = [];
let startNode = null;
let endNode = null;

function createGrid() {
    for (let row = 0; row < ROWS; row++) {
        grid[row] = [];
        for (let col = 0; col < COLS; col++) {
            const node = document.createElement('div');
            node.className = 'node';
            grid[row][col] = node;
            gridContainer.appendChild(node);
        }
    }
}

function initialize() {
    createGrid();
    generateRandomMaze();
    startBtn.addEventListener('click', startPathfinding);
    resetBtn.addEventListener('click', resetGrid);
}

function generateRandomMaze() {
    startNode = grid[0][0];
    endNode = grid[ROWS - 1][COLS - 1];
    
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            const node = grid[row][col];
            if (node !== startNode && node !== endNode && Math.random() < 0.3) {
                node.classList.add('wall-node');
            }
        }
    }

    if (startNode) {
        startNode.classList.remove('wall-node'); // Ensure start point is not a wall
        startNode.classList.add('start-node');
    }

    if (endNode) {
        endNode.classList.remove('wall-node');   // Ensure end point is not a wall
        endNode.classList.add('end-node');
    }
}

async function startPathfinding() {
    resetVisitedNodes();

    const queue = [startNode];
    startNode.isVisited = true;

    while (queue.length > 0) {
        const currentNode = queue.shift();

        if (currentNode === endNode) {
            visualizeFullPath();
            return;
        }

        for (const neighbor of getNeighbors(currentNode)) {
            if (!neighbor.isVisited && !neighbor.isWall) {
                neighbor.isVisited = true;
                neighbor.previousNode = currentNode;
                queue.push(neighbor);

                // Visualize the decision in real time
                await sleep(10); // Adjust the delay time as needed
                neighbor.classList.add('visited-node');
            }
        }
    }

    alert('No path found.');
}

async function visualizeFullPath() {
    let current = endNode;
    while (current.previousNode) {
        current.classList.add('shortest-path-node');
        current = current.previousNode;

        // Visualize the path in real time
        await sleep(50); // Adjust the delay time as needed
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function resetVisitedNodes() {
    for (const row of grid) {
        for (const node of row) {
            node.isVisited = false;
            node.previousNode = null;
        }
    }
}

function getNeighbors(node) {
    const neighbors = [];
    const { row, col } = getNodePosition(node);

    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < ROWS - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < COLS - 1) neighbors.push(grid[row][col + 1]);

    return neighbors.filter(neighbor => !neighbor.classList.contains('wall-node'));
}

function getNodePosition(node) {
    for (let row = 0; row < ROWS; row++) {
        const col = grid[row].indexOf(node);
        if (col !== -1) {
            return { row, col };
        }
    }
    return null;
}

function visualizePath() {
    let current = endNode;
    while (current.previousNode) {
        if (current !== endNode) { // Avoid changing the class of the end node
            current.classList.add('shortest-path-node');
        }
        current = current.previousNode;
    }
}

function resetGrid() {
    gridContainer.innerHTML = '';
    createGrid();
    generateRandomMaze();
}

initialize();
