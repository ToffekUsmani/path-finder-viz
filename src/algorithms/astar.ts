import { Cell } from '../types/pathfinding';

export function aStar(grid: Cell[][], startCell: Cell, endCell: Cell) {
  const visitedCells: Cell[] = [];
  const openSet: Cell[] = [];
  const rows = grid.length;
  const cols = grid[0].length;

  // Reset all cells
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cell = grid[row][col];
      cell.gCost = Infinity;
      cell.hCost = 0;
      cell.fCost = Infinity;
      cell.isVisited = false;
      cell.previousCell = null;
    }
  }

  startCell.gCost = 0;
  startCell.hCost = getHeuristic(startCell, endCell);
  startCell.fCost = startCell.gCost + startCell.hCost;
  openSet.push(startCell);

  while (openSet.length > 0) {
    sortCellsByFCost(openSet);
    const currentCell = openSet.shift()!;

    if (currentCell.type === 'wall') continue;

    currentCell.isVisited = true;
    visitedCells.push(currentCell);

    if (currentCell === endCell) break;

    const neighbors = getNeighbors(currentCell, grid);
    for (const neighbor of neighbors) {
      if (neighbor.isVisited || neighbor.type === 'wall') continue;

      const tentativeGCost = currentCell.gCost + 1;

      if (tentativeGCost < neighbor.gCost) {
        neighbor.previousCell = currentCell;
        neighbor.gCost = tentativeGCost;
        neighbor.hCost = getHeuristic(neighbor, endCell);
        neighbor.fCost = neighbor.gCost + neighbor.hCost;

        if (!openSet.includes(neighbor)) {
          openSet.push(neighbor);
        }
      }
    }
  }

  const pathCells = getPath(endCell);
  return { visitedCells, pathCells };
}

function getHeuristic(cellA: Cell, cellB: Cell): number {
  // Manhattan distance
  return Math.abs(cellA.row - cellB.row) + Math.abs(cellA.col - cellB.col);
}

function sortCellsByFCost(cells: Cell[]): void {
  cells.sort((a, b) => a.fCost - b.fCost);
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