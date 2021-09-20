import React, { memo } from 'react';
import { GameGrid, GridPiece, Tetromino } from '../types';
import { GridPieceColour } from '../constants';
import { getBlockPieces } from '../utils/physics';
import { cloneGrid } from '../utils/reducer';

const MAX_HEIGHT: number = 20;
const GRID_WIDTH: number = 10;

export const mergeTetrominoGrid = (
  baseGrid: GameGrid,
  tetromino: Tetromino,
): GameGrid =>
  getBlockPieces(tetromino).reduce((grid, { x, y, type }) => {
    grid[x][y] = type;
    return grid;
  }, cloneGrid(baseGrid));

interface IRendererProps {
  grid: GameGrid;
  height?: number;
}

const GridCell = memo(
  ({ piece, x, y }: { piece: GridPiece; x: number; y: number }) => (
    <div
      style={{
        gridColumnStart: x + 1,
        gridColumnEnd: x + 1,
        gridRowStart: 20 - y,
        gridRowEnd: 20 - y,
        background: GridPieceColour[piece],
        border: '1px solid rgba(128, 128, 128, 0.25)',
      }}
    />
  ),
);

const GridColumn = memo(({ column, x }: { column: GridPiece[]; x: number }) => (
  <>
    {column.map((piece, y) => (
      <GridCell piece={piece} x={x} y={y} key={y} />
    ))}
  </>
));

const Renderer = ({ grid, height = 600 }: IRendererProps) => (
  <div
    className="renderer"
    style={{
      width: `${height / 2}px`,
      height: `${height}px`,
      background: '#808080',
      boxSizing: 'border-box',
      display: 'grid',
      gridTemplateColumns: 'repeat(10, 1fr)',
      gridTemplateRows: 'repeat(20, 1fr)',
      gridGap: '0',
    }}
  >
    {grid.slice(0, GRID_WIDTH).map((column, x) => (
      <GridColumn column={column.slice(0, MAX_HEIGHT)} x={x} key={x} />
    ))}
  </div>
);

export default memo(Renderer);
