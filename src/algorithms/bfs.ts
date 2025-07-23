import { Cell } from '../types/pathfinding';

export function bfs(grid: Cell[][], startCell: Cell, endCell: Cell) {
  const visitedCells: Cell[] = [];
  const queue: Cell[] = [];
  const rows = grid.length;
  const cols = grid[0].length;

  // Reset all cells
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      grid[row][col].isVisited = false;
      grid[row][col].previousCell = null;
    }
  }

  startCell.isVisited = true;
  queue.push(startCell);

  while (queue.length > 0) {
    const currentCell = queue.shift()!;
    visitedCells.push(currentCell);

    if (currentCell === endCell) {
      break;
    }

    const neighbors = getNeighbors(currentCell, grid);
    for (const neighbor of neighbors) {
      if (!neighbor.isVisited && neighbor.type !== 'wall') {
        neighbor.isVisited = true;
        neighbor.previousCell = currentCell;
        queue.push(neighbor);
      }
    }
  }

  const pathCells = getPath(endCell);
  return { visitedCells, pathCells };
}

function getNeighbors(cell: Cell, grid: Cell[][]): Cell[] {
  const neighbors: Cell[] = [];
  const { row, col } = cell;
  const rows = grid.length;
  const cols = grid[0].length;

  // Up
  if (row > 0) neighbors.push(grid[row - 1][col]);
  // Down
  if (row < rows - 1) neighbors.push(grid[row + 1][col]);
  // Left
  if (col > 0) neighbors.push(grid[row][col - 1]);
  // Right
  if (col < cols - 1) neighbors.push(grid[row][col + 1]);

  return neighbors;
}

function getPath(endCell: Cell): Cell[] {
  const path: Cell[] = [];
  let currentCell: Cell | null = endCell;

  while (currentCell) {
    path.unshift(currentCell);
    currentCell = currentCell.previousCell;
  }

  return path.slice(1, -1); // Remove start and end cells from path
}