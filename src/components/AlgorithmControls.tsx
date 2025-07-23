import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Play, RotateCcw, Eraser, MapPin, Target, Square } from 'lucide-react';
import { Algorithm } from '../types/pathfinding';

interface AlgorithmControlsProps {
  selectedAlgorithm: Algorithm;
  isRunning: boolean;
  isComplete: boolean;
  hasStartAndEnd: boolean;
  animationSpeed: number;
  onAlgorithmChange: (algorithm: Algorithm) => void;
  onRunAlgorithm: () => void;
  onResetGrid: () => void;
  onClearPath: () => void;
  onSetStartNode: () => void;
  onSetEndNode: () => void;
  onSpeedChange: (speed: number) => void;
}

export const AlgorithmControls = ({
  selectedAlgorithm,
  isRunning,
  isComplete,
  hasStartAndEnd,
  animationSpeed,
  onAlgorithmChange,
  onRunAlgorithm,
  onResetGrid,
  onClearPath,
  onSetStartNode,
  onSetEndNode,
  onSpeedChange,
}: AlgorithmControlsProps) => {
  const getAlgorithmDescription = (algorithm: Algorithm) => {
    switch (algorithm) {
      case 'bfs':
        return 'Breadth-First Search explores all neighbors at the present depth before moving to nodes at the next depth level.';
      case 'dijkstra':
        return "Dijkstra's algorithm finds the shortest path between nodes in a graph with non-negative edge weights.";
      case 'astar':
        return 'A* uses heuristics to find the optimal path more efficiently than Dijkstra by prioritizing promising directions.';
      default:
        return '';
    }
  };

  const getAlgorithmComplexity = (algorithm: Algorithm) => {
    switch (algorithm) {
      case 'bfs':
        return 'O(V + E)';
      case 'dijkstra':
        return 'O((V + E) log V)';
      case 'astar':
        return 'O(b^d)';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            Algorithm Selection
            <Badge variant="outline" className="text-xs">
              {getAlgorithmComplexity(selectedAlgorithm)}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={selectedAlgorithm} onValueChange={onAlgorithmChange} disabled={isRunning}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bfs">Breadth-First Search (BFS)</SelectItem>
              <SelectItem value="dijkstra">Dijkstra's Algorithm</SelectItem>
              <SelectItem value="astar">A* Search</SelectItem>
            </SelectContent>
          </Select>
          
          <p className="text-sm text-muted-foreground leading-relaxed">
            {getAlgorithmDescription(selectedAlgorithm)}
          </p>
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg">Setup</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={onSetStartNode}
              disabled={isRunning}
              className="gap-2"
            >
              <MapPin className="w-4 h-4" />
              Set Start
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onSetEndNode}
              disabled={isRunning}
              className="gap-2"
            >
              <Target className="w-4 h-4" />
              Set End
            </Button>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Square className="w-3 h-3" />
            Click and drag to draw walls
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg">Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={onRunAlgorithm}
            disabled={!hasStartAndEnd || isRunning}
            className="w-full gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
            size="lg"
          >
            <Play className="w-4 h-4" />
            {isRunning ? 'Running...' : 'Start Pathfinding'}
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={onClearPath}
              disabled={isRunning}
              className="gap-2"
            >
              <Eraser className="w-4 h-4" />
              Clear Path
            </Button>
            <Button
              variant="outline"
              onClick={onResetGrid}
              disabled={isRunning}
              className="gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset Grid
            </Button>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Animation Speed</label>
            <Slider
              value={[animationSpeed]}
              onValueChange={(value) => onSpeedChange(value[0])}
              max={100}
              min={1}
              step={1}
              className="w-full"
              disabled={isRunning}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Slow</span>
              <span>Fast</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg">Legend</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-algo-start rounded border" />
              <span>Start</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-algo-end rounded border" />
              <span>End</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-algo-wall rounded border" />
              <span>Wall</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-algo-visited rounded border" />
              <span>Visited</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-algo-path rounded border" />
              <span>Path</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-algo-empty rounded border" />
              <span>Empty</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};