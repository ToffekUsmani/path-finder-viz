export type CellType = 'empty' | 'start' | 'end' | 'wall' | 'visited' | 'path' | 'current';

export interface Cell {
  row: number;
  col: number;
  type: CellType;
  isVisited: boolean;
  distance: number;
  previousCell: Cell | null;
  gCost: number;
  hCost: number;
  fCost: number;
}

export type Algorithm = 'bfs' | 'dijkstra' | 'astar';

export interface GridState {
  grid: Cell[][];
  startCell: { row: number; col: number } | null;
  endCell: { row: number; col: number } | null;
  isRunning: boolean;
  isComplete: boolean;
  selectedAlgorithm: Algorithm;
  animationSpeed: number;
}

export interface AnimationStep {
  cell: Cell;
  type: 'visiting' | 'visited' | 'path' | 'current';
}