import { getBlockPieces, isCollision, findKick } from './physics';
import { createTetrominoBag } from './randomizer';
import {
  GridPiece,
  GameState,
  GameAction,
  GameActionType,
  GameGrid,
  Tetromino,
  ClearType,
} from '../types';
import {
  GRID_WIDTH,
  GRID_HEIGHT,
  INITIAL_INTERVAL,
  DEBUG_MODE,
  LOCK_DELAY,
  CLEAR_SCORE,
} from '../constants';

export const cloneGrid = (grid: GameGrid): GameGrid =>
  grid.map((column) => [...column]);

const cloneState = (state: GameState): GameState => ({
  ...state,
  tetromino: { ...state.tetromino },
  grid: cloneGrid(state.grid),
  clears: { ...state.clears },
});

export const getInitialState = (): GameState => {
  const queue = createTetrominoBag();
  return {
    grid: Array(GRID_WIDTH)
      .fill(undefined)
      .map(() => Array(GRID_HEIGHT).fill(GridPiece.NONE)),
    paused: true,
    interval: INITIAL_INTERVAL,
    tetromino: {
      type: queue.shift() as GridPiece,
      rotation: 0,
      x: 4,
      y: 19,
    },
    lockAfter: Date.now() + LOCK_DELAY,
    gameOver: false,
    holdType: GridPiece.NONE,
    level: 1,
    score: 0,
    clears: {
      [ClearType.MINI_T_SPIN]: 0,
      [ClearType.T_SPIN_SINGLE]: 0,
      [ClearType.T_SPIN_DOUBLE]: 0,
      [ClearType.T_SPIN_TRIPLE]: 0,
      [ClearType.SINGLE]: 0,
      [ClearType.DOUBLE]: 0,
      [ClearType.TRIPLE]: 0,
      [ClearType.QUAD]: 0,
    },
    queue,
  };
};

const resetLock = (state: GameState): GameState => {
  state.lockAfter = Date.now() + LOCK_DELAY;
  return state;
};

const offsetTetromino = (
  tetromino: Tetromino,
  { x = 0, y = 0 }: { x?: number; y?: number },
): Tetromino => ({
  ...tetromino,
  x: tetromino.x + x,
  y: tetromino.y + y,
});

const insertTetrominoToGrid = (
  tetromino: Tetromino,
  grid: GameGrid,
): GameGrid =>
  getBlockPieces(tetromino).reduce((grid, { type, x, y }) => {
    grid[x][y] = type;
    return grid;
  }, grid);

const spawnTetromino = (
  state: GameState,
  overrides: Partial<Tetromino> = {},
): GameState => {
  if (state.queue.length < 7) {
    state.queue = [...state.queue, ...createTetrominoBag()];
  }

  let type = overrides.type;
  if (type === undefined) {
    type = state.queue[0] as GridPiece;
    state.queue = state.queue.slice(1);
  }

  state.tetromino = {
    rotation: 0,
    x: 4,
    y: 19,
    ...overrides,
    type,
  };

  return state;
};

const lockTetromino = (state: GameState): GameState => {
  const isTSpin =
    state.tetromino.type === GridPiece.T &&
    isCollision(offsetTetromino(state.tetromino, { x: -1 }), state.grid) &&
    isCollision(offsetTetromino(state.tetromino, { x: +1 }), state.grid) &&
    isCollision(offsetTetromino(state.tetromino, { y: +1 }), state.grid);

  insertTetrominoToGrid(state.tetromino, state.grid);
  spawnTetromino(state);

  if (isCollision(state.tetromino, state.grid)) {
    state.gameOver = true;
    state.paused = true;
  }

  // check for clears
  let clearCount = 0;
  for (let y = 19; y >= 0; y--) {
    let cleared = true;
    for (let x = 0; x < 10; x++) {
      if (state.grid[x][y] === GridPiece.NONE) {
        cleared = false;
        break;
      }
    }

    if (cleared) {
      state.grid = state.grid.map((column) => [
        ...column.slice(0, y),
        ...column.slice(y + 1),
        GridPiece.NONE,
      ]);
      clearCount++;
    }
  }

  let clearType: ClearType | undefined = undefined;
  switch (clearCount) {
    case 0:
      clearType = isTSpin ? ClearType.MINI_T_SPIN : undefined;
      break;
    case 1:
      clearType = isTSpin ? ClearType.T_SPIN_SINGLE : ClearType.SINGLE;
      break;
    case 2:
      clearType = isTSpin ? ClearType.T_SPIN_DOUBLE : ClearType.DOUBLE;
      break;
    case 3:
      clearType = isTSpin ? ClearType.T_SPIN_TRIPLE : ClearType.TRIPLE;
      break;
    case 4:
      clearType = ClearType.QUAD;
      break;
  }

  if (clearType !== undefined) {
    state.clears[clearType]++;
    state.score += state.level * CLEAR_SCORE[clearType];
  }

  return state;
};

export const reducer = (oldState: GameState, action: GameAction) => {
  if (DEBUG_MODE) {
    console.log({
      actionType: GameActionType[action.type],
      action,
      state: oldState,
    });
  }

  const state: GameState = cloneState(oldState);

  switch (action.type) {
    case GameActionType.TICK:
      const fallingMino = offsetTetromino(state.tetromino, { y: -1 });
      if (!isCollision(fallingMino, state.grid)) {
        state.tetromino = fallingMino;
        resetLock(state);
      } else if (state.lockAfter < Date.now()) {
        lockTetromino(state);
      }
      return state;
    case GameActionType.SET_INTERVAL:
      state.interval = action.payload ?? state.interval;
      return state;
    case GameActionType.SET_LEVEL:
      state.level = action.payload ?? state.level;
      return state;
    case GameActionType.SET_PAUSE:
      state.paused = action.payload;
      return state;
    case GameActionType.INPUT_MOVE_LEFT:
      if (state.paused) return state;

      const leftMino = offsetTetromino(state.tetromino, { x: -1 });
      if (!isCollision(leftMino, state.grid)) {
        state.tetromino = leftMino;
        resetLock(state);
      }
      return state;
    case GameActionType.INPUT_MOVE_RIGHT:
      if (state.paused) return state;

      const rightMino = offsetTetromino(state.tetromino, { x: +1 });
      if (!isCollision(rightMino, state.grid)) {
        state.tetromino = rightMino;
        resetLock(state);
      }
      return state;
    case GameActionType.INPUT_MOVE_DOWN:
      if (state.paused) return state;

      const downMino = offsetTetromino(state.tetromino, { y: -1 });
      if (!isCollision(downMino, state.grid)) {
        state.tetromino = downMino;
        resetLock(state);
      }
      return state;
    case GameActionType.INPUT_DROP:
      if (state.paused) return state;

      do {
        state.tetromino.y--;
      } while (!isCollision(state.tetromino, state.grid));
      state.tetromino.y++;
      lockTetromino(state);
      return state;
    case GameActionType.INPUT_ROTATE_LEFT:
      if (state.paused) return state;

      const leftRotation = state.tetromino.rotation - 1;
      const leftKick = findKick(state.grid, state.tetromino, leftRotation);
      if (leftKick) {
        state.tetromino.rotation = leftRotation;
        state.tetromino.x += leftKick[0];
        state.tetromino.y += leftKick[1];
        resetLock(state);
      }
      return state;
    case GameActionType.INPUT_ROTATE_RIGHT:
      if (state.paused) return state;

      const rightRotation = state.tetromino.rotation + 1;
      const rightKick = findKick(state.grid, state.tetromino, rightRotation);
      if (rightKick) {
        state.tetromino.rotation = rightRotation;
        state.tetromino.x += rightKick[0];
        state.tetromino.y += rightKick[1];
        resetLock(state);
      }
      return state;
    case GameActionType.INPUT_HOLD:
      if (state.paused) return state;

      const type = state.holdType;
      state.holdType = state.tetromino.type;
      if (type === GridPiece.NONE) {
        spawnTetromino(state);
      } else {
        spawnTetromino(state, { type });
      }
      return state;
    case GameActionType.INPUT_PAUSE:
      if (!state.gameOver) {
        state.paused = !state.paused;
      }
      return state;
    case GameActionType.RESET:
      return getInitialState();
    default:
      return state;
  }
};
