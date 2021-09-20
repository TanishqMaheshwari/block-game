import { Dispatch } from 'react';
import { useLayoutEffect, useCallback } from 'react';
import { Keybindings, GameAction } from '../types';
import {
  inputDrop,
  inputHold,
  inputMoveDown,
  inputMoveLeft,
  inputMoveRight,
  inputPause,
  inputRotateLeft,
  inputRotateRight,
} from '../utils/actions';

const useController = (
  dispatch: Dispatch<GameAction>,
  keybindings: Keybindings,
): void => {
  const onKeydown = useCallback(
    ({ key }: KeyboardEvent) => {
      if (!key || !keybindings) return;

      switch (key) {
        case keybindings.moveLeft:
          return dispatch(inputMoveLeft());
        case keybindings.moveDown:
          return dispatch(inputMoveDown());
        case keybindings.moveRight:
          return dispatch(inputMoveRight());
        case keybindings.drop:
          return dispatch(inputDrop());
        case keybindings.rotateLeft:
          return dispatch(inputRotateLeft());
        case keybindings.rotateRight:
          return dispatch(inputRotateRight());
        case keybindings.hold:
          return dispatch(inputHold());
        case keybindings.pause:
          return dispatch(inputPause());
        default:
          return;
      }
    },
    [dispatch, keybindings],
  );

  useLayoutEffect(() => {
    window.addEventListener('keydown', onKeydown);
    return () => window.removeEventListener('keydown', onKeydown);
  }, [onKeydown]);
};

export default useController;
