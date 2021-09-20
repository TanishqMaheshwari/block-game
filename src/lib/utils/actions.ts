import { GameAction, GameActionType } from '../types';

export const tick = (): GameAction => ({ type: GameActionType.TICK });

export const inputMoveLeft = (): GameAction => ({
  type: GameActionType.INPUT_MOVE_LEFT,
});

export const inputMoveRight = (): GameAction => ({
  type: GameActionType.INPUT_MOVE_RIGHT,
});

export const inputMoveDown = (): GameAction => ({
  type: GameActionType.INPUT_MOVE_DOWN,
});

export const inputDrop = (): GameAction => ({
  type: GameActionType.INPUT_DROP,
});

export const inputRotateLeft = (): GameAction => ({
  type: GameActionType.INPUT_ROTATE_LEFT,
});

export const inputRotateRight = (): GameAction => ({
  type: GameActionType.INPUT_ROTATE_RIGHT,
});

export const inputHold = (): GameAction => ({
  type: GameActionType.INPUT_HOLD,
});

export const inputPause = (): GameAction => ({
  type: GameActionType.INPUT_PAUSE,
});

export const setInterval = (interval: number): GameAction => ({
  type: GameActionType.SET_INTERVAL,
  payload: interval,
});

export const setLevel = (level: number): GameAction => ({
  type: GameActionType.SET_LEVEL,
  payload: level,
});

export const setPause = (paused: boolean): GameAction => ({
  type: GameActionType.SET_PAUSE,
  payload: paused,
});

export const reset = (): GameAction => ({ type: GameActionType.RESET });
