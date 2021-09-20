import {
  Tetromino,
  TetrominoPiece,
  GridPiece,
  GameGrid,
  KickTable,
  KickTableLookup,
  RotationNumber,
  KickList,
} from '../types';

const blockOffsets = {
  [GridPiece.NONE]: [[], [], [], []],
  [GridPiece.T]: [
    [
      { x: -1, y: +0 },
      { x: +0, y: +0 },
      { x: +0, y: +1 },
      { x: +1, y: +0 },
    ],
    [
      { x: +0, y: +1 },
      { x: +0, y: +0 },
      { x: +0, y: -1 },
      { x: +1, y: +0 },
    ],
    [
      { x: -1, y: +0 },
      { x: +0, y: +0 },
      { x: +1, y: +0 },
      { x: +0, y: -1 },
    ],
    [
      { x: -1, y: +0 },
      { x: +0, y: +1 },
      { x: +0, y: +0 },
      { x: +0, y: -1 },
    ],
  ],
  [GridPiece.S]: [
    [
      { x: -1, y: +0 },
      { x: +0, y: +0 },
      { x: +0, y: +1 },
      { x: +1, y: +1 },
    ],
    [
      { x: +0, y: +1 },
      { x: +0, y: +0 },
      { x: +1, y: +0 },
      { x: +1, y: -1 },
    ],
    [
      { x: -1, y: -1 },
      { x: +0, y: -1 },
      { x: +0, y: +0 },
      { x: +1, y: +0 },
    ],
    [
      { x: -1, y: +1 },
      { x: -1, y: +0 },
      { x: +0, y: +0 },
      { x: +0, y: -1 },
    ],
  ],
  [GridPiece.Z]: [
    [
      { x: -1, y: +1 },
      { x: +0, y: +1 },
      { x: +0, y: +0 },
      { x: +1, y: +0 },
    ],
    [
      { x: +0, y: -1 },
      { x: +0, y: +0 },
      { x: +1, y: +0 },
      { x: +1, y: +1 },
    ],
    [
      { x: -1, y: +0 },
      { x: +0, y: +0 },
      { x: +0, y: -1 },
      { x: +1, y: -1 },
    ],
    [
      { x: -1, y: -1 },
      { x: -1, y: +0 },
      { x: +0, y: +0 },
      { x: +0, y: +1 },
    ],
  ],
  [GridPiece.J]: [
    [
      { x: -1, y: +1 },
      { x: -1, y: +0 },
      { x: +0, y: +0 },
      { x: +1, y: +0 },
    ],
    [
      { x: +0, y: +1 },
      { x: +1, y: +1 },
      { x: +0, y: +0 },
      { x: +0, y: -1 },
    ],
    [
      { x: -1, y: +0 },
      { x: +0, y: +0 },
      { x: +1, y: +0 },
      { x: +1, y: -1 },
    ],
    [
      { x: +0, y: +1 },
      { x: +0, y: +0 },
      { x: +0, y: -1 },
      { x: -1, y: -1 },
    ],
  ],
  [GridPiece.L]: [
    [
      { x: -1, y: +0 },
      { x: +0, y: +0 },
      { x: +1, y: +0 },
      { x: +1, y: +1 },
    ],
    [
      { x: +0, y: +1 },
      { x: +0, y: +0 },
      { x: +0, y: -1 },
      { x: +1, y: -1 },
    ],
    [
      { x: -1, y: -1 },
      { x: -1, y: +0 },
      { x: +0, y: +0 },
      { x: +1, y: +0 },
    ],
    [
      { x: -1, y: +1 },
      { x: +0, y: +1 },
      { x: +0, y: +0 },
      { x: +0, y: -1 },
    ],
  ],
  [GridPiece.I]: [
    [
      { x: -1, y: +0 },
      { x: +0, y: +0 },
      { x: +1, y: +0 },
      { x: +2, y: +0 },
    ],
    [
      { x: +1, y: +1 },
      { x: +1, y: +0 },
      { x: +1, y: -1 },
      { x: +1, y: -2 },
    ],
    [
      { x: -1, y: -1 },
      { x: +0, y: -1 },
      { x: +1, y: -1 },
      { x: +2, y: -1 },
    ],
    [
      { x: +0, y: +1 },
      { x: +0, y: +0 },
      { x: +0, y: -1 },
      { x: +0, y: -2 },
    ],
  ],
  [GridPiece.O]: [
    [
      { x: +0, y: +1 },
      { x: +0, y: +0 },
      { x: +1, y: +1 },
      { x: +1, y: +0 },
    ],
    [
      { x: +0, y: +1 },
      { x: +0, y: +0 },
      { x: +1, y: +1 },
      { x: +1, y: +0 },
    ],
    [
      { x: +0, y: +1 },
      { x: +0, y: +0 },
      { x: +1, y: +1 },
      { x: +1, y: +0 },
    ],
    [
      { x: +0, y: +1 },
      { x: +0, y: +0 },
      { x: +1, y: +1 },
      { x: +1, y: +0 },
    ],
  ],
};

const jlstzKicks: KickTable = {
  0: {
    1: [
      [0, 0],
      [-1, 0],
      [-1, 1],
      [0, -2],
      [-1, -2],
    ],
    3: [
      [0, 0],
      [1, 0],
      [1, 1],
      [0, -2],
      [1, -2],
    ],
  },
  1: {
    0: [
      [0, 0],
      [1, 0],
      [1, -1],
      [0, 2],
      [1, 2],
    ],
    2: [
      [0, 0],
      [1, 0],
      [1, -1],
      [0, 2],
      [1, 2],
    ],
  },
  2: {
    1: [
      [0, 0],
      [-1, 0],
      [-1, 1],
      [0, -2],
      [-1, -2],
    ],
    3: [
      [0, 0],
      [1, 0],
      [1, 1],
      [0, -2],
      [1, -2],
    ],
  },
  3: {
    2: [
      [0, 0],
      [-1, 0],
      [-1, -1],
      [0, 2],
      [-1, 2],
    ],
    0: [
      [0, 0],
      [-1, 0],
      [-1, -1],
      [0, 2],
      [-1, 2],
    ],
  },
};
const iKicks: KickTable = {
  0: {
    1: [
      [0, 0],
      [-2, 0],
      [1, 0],
      [-2, -1],
      [1, 2],
    ],
    3: [
      [0, 0],
      [-1, 0],
      [2, 0],
      [-1, 2],
      [2, -1],
    ],
  },
  1: {
    0: [
      [0, 0],
      [2, 0],
      [-1, 0],
      [2, 1],
      [-1, -2],
    ],
    2: [
      [0, 0],
      [-1, 0],
      [2, 0],
      [-1, 2],
      [2, -1],
    ],
  },
  2: {
    1: [
      [0, 0],
      [1, 0],
      [-2, 0],
      [1, -2],
      [-2, 1],
    ],
    3: [
      [0, 0],
      [2, 0],
      [-1, 0],
      [2, 1],
      [-1, -2],
    ],
  },
  3: {
    0: [
      [0, 0],
      [1, 0],
      [-2, 0],
      [1, -2],
      [-2, 1],
    ],
    2: [
      [0, 0],
      [-2, 0],
      [1, 0],
      [-2, -1],
      [1, 2],
    ],
  },
};
const oKicks: KickTable = {
  0: { 1: [[0, 0]], 3: [[0, 0]] },
  1: { 0: [[0, 0]], 2: [[0, 0]] },
  2: { 1: [[0, 0]], 3: [[0, 0]] },
  3: { 0: [[0, 0]], 2: [[0, 0]] },
};
const kicks: KickTableLookup = {
  [GridPiece.NONE]: oKicks,
  [GridPiece.I]: iKicks,
  [GridPiece.O]: oKicks,
  [GridPiece.T]: jlstzKicks,
  [GridPiece.J]: jlstzKicks,
  [GridPiece.L]: jlstzKicks,
  [GridPiece.S]: jlstzKicks,
  [GridPiece.Z]: jlstzKicks,
};

const mod = (n: number, m: number): number => ((n % m) + m) % m;

const toRotation = (rotation: number): RotationNumber =>
  mod(rotation, 4) as RotationNumber;

export const getKicks = (
  { type, rotation }: Tetromino,
  newRotation: number,
): KickList | undefined =>
  (kicks[type][toRotation(rotation)] as any)[toRotation(newRotation)];

export const findKick = (
  grid: GameGrid,
  tetromino: Tetromino,
  newRotation: number,
): number[] | undefined =>
  getKicks(tetromino, newRotation)?.find(
    ([x, y]) =>
      !isCollision(
        {
          ...tetromino,
          x: tetromino.x + x,
          y: tetromino.y + y,
          rotation: newRotation,
        },
        grid,
      ),
  ) ?? undefined;

export const getBlockOffsets = ({
  type,
  rotation,
}: Tetromino): Array<{ x: number; y: number }> =>
  blockOffsets[type][toRotation(rotation)];

export const getBlockPieces = (tetromino: Tetromino): Array<TetrominoPiece> =>
  getBlockOffsets(tetromino).map(({ x, y }) => ({
    type: tetromino.type,
    x: x + tetromino.x,
    y: y + tetromino.y,
  }));

// here we can check upper bounds for collision of placed pieces, if there is one then its game over

export const isCollision = (tetromino: Tetromino, grid?: GameGrid): boolean =>
  getBlockPieces(tetromino).some(
    ({ x, y }) =>
      x < 0 || x > 9 || y < 0 || (grid && grid[x][y] !== GridPiece.NONE),
  );
