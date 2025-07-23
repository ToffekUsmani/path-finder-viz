import { useState, useCallback, useRef } from 'react';
import { Cell, GridState, Algorithm, AnimationStep } from '../types/pathfinding';
import { bfs } from '../algorithms/bfs';
import { dijkstra } from '../algorithms/dijkstra';
import { aStar } from '../algorithms/astar';

const GRID_ROWS = 20;
const GRID_COLS = 50;

export const usePathfinding = () => {
  const [gridState, setGridState] = useState<GridState>(() => ({
    grid: createInitialGrid(),
    startCell: null,
    endCell: null,
    isRunning: false,
    isComplete: false,
    selectedAlgorithm: 'bfs',
    animationSpeed: 50,
  }));

  const animationRef = useRef<NodeJS.Timeout>();

  function createInitialGrid(): Cell[][] {
    const grid: Cell[][] = [];
    for (let row = 0; row < GRID_ROWS; row++) {
      const currentRow: Cell[] = [];
      for (let col = 0; col < GRID_COLS; col++) {
        currentRow.push({
          row,
          col,
          type: 'empty',
          isVisited: false,
          distance: Infinity,
          previousCell: null,
          gCost: Infinity,
          hCost: 0,
          fCost: Infinity,
        });
      }
      grid.push(currentRow);
    }
    return grid;
  }

  const resetGrid = useCallback(() => {
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }
    setGridState(prev => ({
      ...prev,
      grid: createInitialGrid(),
      startCell: null,
      endCell: null,
      isRunning: false,
      isComplete: false,
    }));
  }, []);

  const clearPath = useCallback(() => {
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }
    setGridState(prev => ({
      ...prev,
      grid: prev.grid.map(row =>
        row.map(cell => ({
          ...cell,
          type: cell.type === 'visited' || cell.type === 'path' || cell.type === 'current' 
            ? 'empty' 
            : cell.type,
          isVisited: false,
          distance: Infinity,
          previousCell: null,
          gCost: Infinity,
          hCost: 0,
          fCost: Infinity,
        }))
      ),
      isRunning: false,
      isComplete: false,
    }));
  }, []);

  const updateCell = useCallback((row: number, col: number, newType?: 'start' | 'end' | 'wall') => {
    if (gridState.isRunning) return;

    setGridState(prev => {
      const newGrid = prev.grid.map(r => r.map(c => ({ ...c })));
      const cell = newGrid[row][col];
      
      if (!newType) {
        // Toggle wall
        if (cell.type === 'empty') {
          cell.type = 'wall';
        } else if (cell.type === 'wall') {
          cell.type = 'empty';
        }
      } else if (newType === 'start') {
        // Remove previous start
        for (let r = 0; r < GRID_ROWS; r++) {
          for (let c = 0; c < GRID_COLS; c++) {
            if (newGrid[r][c].type === 'start') {
              newGrid[r][c].type = 'empty';
            }
          }
        }
        cell.type = 'start';
        return {
          ...prev,
          grid: newGrid,
          startCell: { row, col },
        };
      } else if (newType === 'end') {
        // Remove previous end
        for (let r = 0; r < GRID_ROWS; r++) {
          for (let c = 0; c < GRID_COLS; c++) {
            if (newGrid[r][c].type === 'end') {
              newGrid[r][c].type = 'empty';
            }
          }
        }
        cell.type = 'end';
        return {
          ...prev,
          grid: newGrid,
          endCell: { row, col },
        };
      }

      return { ...prev, grid: newGrid };
    });
  }, [gridState.isRunning]);

  const runAlgorithm = useCallback(() => {
    if (!gridState.startCell || !gridState.endCell || gridState.isRunning) return;

    const startCell = gridState.grid[gridState.startCell.row][gridState.startCell.col];
    const endCell = gridState.grid[gridState.endCell.row][gridState.endCell.col];

    let algorithm;
    switch (gridState.selectedAlgorithm) {
      case 'bfs':
        algorithm = bfs;
        break;
      case 'dijkstra':
        algorithm = dijkstra;
        break;
      case 'astar':
        algorithm = aStar;
        break;
      default:
        algorithm = bfs;
    }

    const { visitedCells, pathCells } = algorithm(gridState.grid, startCell, endCell);
    
    setGridState(prev => ({ ...prev, isRunning: true }));
    animateAlgorithm(visitedCells, pathCells);
  }, [gridState]);

  const animateAlgorithm = (visitedCells: Cell[], pathCells: Cell[]) => {
    let currentIndex = 0;

    const animate = () => {
      if (currentIndex < visitedCells.length) {
        const cell = visitedCells[currentIndex];
        setGridState(prev => ({
          ...prev,
          grid: prev.grid.map(row =>
            row.map(c =>
              c.row === cell.row && c.col === cell.col && c.type !== 'start' && c.type !== 'end'
                ? { ...c, type: 'visited' }
                : c
            )
          ),
        }));
        currentIndex++;
        animationRef.current = setTimeout(animate, 101 - gridState.animationSpeed);
      } else {
        // Animate path
        animatePath(pathCells);
      }
    };

    animate();
  };

  const animatePath = (pathCells: Cell[]) => {
    let currentIndex = 0;

    const animate = () => {
      if (currentIndex < pathCells.length) {
        const cell = pathCells[currentIndex];
        setGridState(prev => ({
          ...prev,
          grid: prev.grid.map(row =>
            row.map(c =>
              c.row === cell.row && c.col === cell.col && c.type !== 'start' && c.type !== 'end'
                ? { ...c, type: 'path' }
                : c
            )
          ),
        }));
        currentIndex++;
        animationRef.current = setTimeout(animate, 50);
      } else {
        setGridState(prev => ({ ...prev, isRunning: false, isComplete: true }));
      }
    };

    animate();
  };

  const setAlgorithm = useCallback((algorithm: Algorithm) => {
    if (gridState.isRunning) return;
    setGridState(prev => ({ ...prev, selectedAlgorithm: algorithm }));
  }, [gridState.isRunning]);

  const setSpeed = useCallback((speed: number) => {
    setGridState(prev => ({ ...prev, animationSpeed: speed }));
  }, []);

  return {
    gridState,
    updateCell,
    runAlgorithm,
    resetGrid,
    clearPath,
    setAlgorithm,
    setSpeed,
  };
};