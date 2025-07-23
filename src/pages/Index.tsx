import { useState } from 'react';
import { PathfindingGrid } from '../components/PathfindingGrid';
import { AlgorithmControls } from '../components/AlgorithmControls';
import { usePathfinding } from '../hooks/usePathfinding';
import { toast } from 'sonner';

type Mode = 'wall' | 'start' | 'end';

const Index = () => {
  const {
    gridState,
    updateCell,
    runAlgorithm,
    resetGrid,
    clearPath,
    setAlgorithm,
    setSpeed,
  } = usePathfinding();

  const [mode, setMode] = useState<Mode>('wall');

  const handleCellUpdate = (row: number, col: number) => {
    const cell = gridState.grid[row][col];
    
    if (cell.type === 'start' || cell.type === 'end') return;
    if (cell.type === 'visited' || cell.type === 'path') return;

    if (mode === 'wall') {
      updateCell(row, col);
    } else {
      updateCell(row, col, mode);
      if (mode === 'start') {
        toast.success('Start node placed! Now place the end node.', {
          duration: 2000,
        });
      } else if (mode === 'end') {
        toast.success('End node placed! Draw walls and start pathfinding.', {
          duration: 2000,
        });
      }
      setMode('wall');
    }
  };

  const handleRunAlgorithm = () => {
    if (!gridState.startCell || !gridState.endCell) {
      toast.error('Please place both start and end nodes before running the algorithm.');
      return;
    }
    
    toast.info(`Running ${gridState.selectedAlgorithm.toUpperCase()} algorithm...`);
    runAlgorithm();
  };

  const handleSetStartNode = () => {
    setMode('start');
    toast.info('Click on the grid to place the start node.');
  };

  const handleSetEndNode = () => {
    setMode('end');
    toast.info('Click on the grid to place the end node.');
  };

  const hasStartAndEnd = gridState.startCell !== null && gridState.endCell !== null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/20 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-6">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Pathfinding Algorithm Visualizer
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Watch algorithms find the shortest path in real-time. A powerful demonstration of core computer science concepts.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col xl:flex-row gap-8 items-start justify-center">
          {/* Grid */}
          <div className="flex-1 flex justify-center">
            <div className="space-y-4">
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-2">
                  {mode === 'start' && 'Click to place START node'}
                  {mode === 'end' && 'Click to place END node'}
                  {mode === 'wall' && 'Click and drag to draw walls'}
                </h2>
                <div className="text-sm text-muted-foreground">
                  Grid: 20 × 50 cells
                </div>
              </div>
              
              <PathfindingGrid
                grid={gridState.grid}
                onCellUpdate={handleCellUpdate}
              />

              {gridState.isComplete && (
                <div className="text-center p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <p className="text-primary font-medium">
                    🎉 Algorithm completed! Path found using {gridState.selectedAlgorithm.toUpperCase()}.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="w-full xl:w-80 shrink-0">
            <AlgorithmControls
              selectedAlgorithm={gridState.selectedAlgorithm}
              isRunning={gridState.isRunning}
              isComplete={gridState.isComplete}
              hasStartAndEnd={hasStartAndEnd}
              animationSpeed={gridState.animationSpeed}
              onAlgorithmChange={setAlgorithm}
              onRunAlgorithm={handleRunAlgorithm}
              onResetGrid={resetGrid}
              onClearPath={clearPath}
              onSetStartNode={handleSetStartNode}
              onSetEndNode={handleSetEndNode}
              onSpeedChange={setSpeed}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border/50 bg-card/20 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-6 py-6 text-center text-sm text-muted-foreground">
          Built with React, TypeScript, and Tailwind CSS • Showcasing Data Structures & Algorithms
        </div>
      </div>
    </div>
  );
};

export default Index;