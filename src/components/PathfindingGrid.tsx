import { memo } from 'react';
import { Cell } from '../types/pathfinding';
import { cn } from '../lib/utils';

interface GridCellProps {
  cell: Cell;
  onCellClick: (row: number, col: number) => void;
  onCellMouseDown: (row: number, col: number) => void;
  onCellMouseEnter: (row: number, col: number) => void;
  isMousePressed: boolean;
}

const GridCell = memo(({ cell, onCellClick, onCellMouseDown, onCellMouseEnter, isMousePressed }: GridCellProps) => {
  const getCellStyle = () => {
    switch (cell.type) {
      case 'start':
        return 'bg-algo-start border-algo-start shadow-[0_0_10px_hsl(var(--algo-start)/0.5)]';
      case 'end':
        return 'bg-algo-end border-algo-end shadow-[0_0_10px_hsl(var(--algo-end)/0.5)]';
      case 'wall':
        return 'bg-algo-wall border-algo-wall';
      case 'visited':
        return 'bg-algo-visited border-algo-visited animate-pulse';
      case 'path':
        return 'bg-algo-path border-algo-path shadow-[0_0_8px_hsl(var(--algo-path)/0.6)] animate-pulse';
      case 'current':
        return 'bg-algo-current border-algo-current shadow-[0_0_12px_hsl(var(--algo-current)/0.7)]';
      default:
        return 'bg-algo-empty border-algo-grid hover:bg-algo-grid transition-colors duration-150';
    }
  };

  return (
    <div
      className={cn(
        'w-6 h-6 border cursor-pointer transition-all duration-200',
        getCellStyle()
      )}
      onClick={() => onCellClick(cell.row, cell.col)}
      onMouseDown={() => onCellMouseDown(cell.row, cell.col)}
      onMouseEnter={() => isMousePressed && onCellMouseEnter(cell.row, cell.col)}
    />
  );
});

GridCell.displayName = 'GridCell';

interface PathfindingGridProps {
  grid: Cell[][];
  onCellUpdate: (row: number, col: number) => void;
}

export const PathfindingGrid = ({ grid, onCellUpdate }: PathfindingGridProps) => {
  let isMousePressed = false;

  const handleMouseDown = (row: number, col: number) => {
    isMousePressed = true;
    onCellUpdate(row, col);
  };

  const handleMouseEnter = (row: number, col: number) => {
    if (isMousePressed) {
      onCellUpdate(row, col);
    }
  };

  const handleMouseUp = () => {
    isMousePressed = false;
  };

  return (
    <div 
      className="inline-block border-2 border-algo-grid rounded-lg overflow-hidden shadow-2xl"
      onMouseLeave={handleMouseUp}
      onMouseUp={handleMouseUp}
    >
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} className="flex">
          {row.map((cell, colIndex) => (
            <GridCell
              key={`${rowIndex}-${colIndex}`}
              cell={cell}
              onCellClick={onCellUpdate}
              onCellMouseDown={handleMouseDown}
              onCellMouseEnter={handleMouseEnter}
              isMousePressed={isMousePressed}
            />
          ))}
        </div>
      ))}
    </div>
  );
};