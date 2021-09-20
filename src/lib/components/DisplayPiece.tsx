import React, { useMemo } from 'react';
import { getBlockOffsets } from '../utils/physics';
import { GridPiece, Tetromino } from '../types';
import { GridPieceColour } from '../constants';

interface IDisplayPieceProps {
  className?: string;
  text: string;
  type: GridPiece;
  size?: string;
}

export const DisplayPiece = ({
  className = '',
  text,
  type,
  size = '90px',
}: IDisplayPieceProps) => {
  const offsets = useMemo(
    () => getBlockOffsets({ type, rotation: 0 } as Tetromino),
    [type],
  );

  const grid: GridPiece[][] = useMemo(() => {
    const grid = Array(4)
      .fill(undefined)
      .map(() => Array(4).fill(GridPiece.NONE));

    offsets.forEach(({ x, y }) => {
      grid[x + 1][y + 1] = type;
    });

    return grid;
  }, [offsets, type]);

  return (
    <div className={'display-piece ' + className}>
      <p>{text}</p>
      <div
        className="grid"
        style={{
          width: size,
          height: size,
          display: 'grid',
          background: '#808080',
          boxSizing: 'border-box',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gridTemplateRows: 'repeat(4, 1fr)',
          gridGap: '0',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        {grid.map((column, x) =>
          column.map((piece, y) => (
            <div
              key={`${x}.${y}`}
              style={{
                gridColumnStart: x + 1,
                gridColumnEnd: x + 1,
                gridRowStart: 4 - y,
                gridRowEnd: 4 - y,
                background: GridPieceColour[piece],
                border: '1px solid rgba(128, 128, 128, 0.25)',
              }}
            />
          )),
        )}
      </div>
    </div>
  );
};

export default DisplayPiece;
