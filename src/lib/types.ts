export interface GameState {
  grid: GameGrid;
  paused: boolean;
  interval: number;
  tetromino: Tetromino;
  lockAfter: number;
  gameOver: boolean;
  holdType: GridPiece;
  level: number;
  score: number;
  clears: Record<ClearType, number>;
  queue: GridPiece[];
}

export interface Tetromino {
  type: GridPiece;
  rotation: number;
  x: number;
  y: number;
}

export interface TetrominoPiece {
  type: GridPiece;
  x: number;
  y: number;
}

export enum GridPiece {
  NONE,
  I,
  O,
  T,
  J,
  L,
  S,
  Z,
}

export type GameGrid = GridPiece[][];

export type KickList = number[][];

export type RotationNumber = 0 | 1 | 2 | 3;

export interface KickTable {
  0: { 1: KickList; 3: KickList };
  1: { 0: KickList; 2: KickList };
  2: { 1: KickList; 3: KickList };
  3: { 2: KickList; 0: KickList };
}

export type KickTableLookup = Record<GridPiece, KickTable>;

export type BagRandomizer = Generator<GridPiece, GridPiece, void>;

export enum GameActionType {
  TICK,
  SET_INTERVAL,
  SET_LEVEL,
  SET_PAUSE,
  INPUT_MOVE_LEFT,
  INPUT_MOVE_RIGHT,
  INPUT_MOVE_DOWN,
  INPUT_DROP,
  INPUT_ROTATE_LEFT,
  INPUT_ROTATE_RIGHT,
  INPUT_HOLD,
  INPUT_PAUSE,
  RESET,
}

export interface GameAction {
  type: GameActionType;
  payload?: any;
}

export interface Keybindings {
  moveLeft: string;
  moveDown: string;
  moveRight: string;
  drop: string;
  rotateLeft: string;
  rotateRight: string;
  hold: string;
  pause: string;
}

export enum ClearType {
  MINI_T_SPIN,
  T_SPIN_SINGLE,
  T_SPIN_DOUBLE,
  T_SPIN_TRIPLE,
  SINGLE,
  DOUBLE,
  TRIPLE,
  QUAD,
}
