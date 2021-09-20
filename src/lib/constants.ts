import { GridPiece, Keybindings, ClearType } from './types';

/** Controls whether debug output should be printed. */
export const DEBUG_MODE: boolean = false;

export const GridPieceColour = {
  [GridPiece.NONE]: 'black',
  [GridPiece.I]: '#29F0F0',
  [GridPiece.O]: '#F0EE34',
  [GridPiece.T]: '#9F23ED',
  [GridPiece.J]: '#0A22ED',
  [GridPiece.L]: '#ED9F26',
  [GridPiece.S]: '#26EE2B',
  [GridPiece.Z]: '#ED0C19',
};

export const GRID_WIDTH: number = 10;
export const GRID_HEIGHT: number = 40;

// get a listener for each type of move in a button that they can set in a settings page

export const keybindings: Keybindings = {
  moveLeft: 'ArrowLeft',
  moveDown: 'ArrowDown',
  moveRight: 'ArrowRight',
  drop: 'ArrowUp',
  rotateLeft: 'a',
  rotateRight: 's',
  hold: 'd',
  pause: 'p',
};

export const CLEAR_SCORE = {
  [ClearType.MINI_T_SPIN]: 100,
  [ClearType.T_SPIN_SINGLE]: 800,
  [ClearType.T_SPIN_DOUBLE]: 1200,
  [ClearType.T_SPIN_TRIPLE]: 1600,
  [ClearType.SINGLE]: 100,
  [ClearType.DOUBLE]: 300,
  [ClearType.TRIPLE]: 500,
  [ClearType.QUAD]: 800,
};

export const INITIAL_INTERVAL: number = 1000;

export const LOCK_DELAY: number = 500;

export const LINES_PER_LEVEL: number = 10;
