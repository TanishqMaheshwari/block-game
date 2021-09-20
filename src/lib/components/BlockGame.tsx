import React, {
  useReducer,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import Renderer, { mergeTetrominoGrid } from './Renderer';
import NewGame from './NewGame';
import StartButton from './StartButton';
import InfoButton from './InfoButton';
import DisplayPiece from './DisplayPiece';
import useController from '../hooks/useController';
import useInterval from '../hooks/useInterval';
import { reducer, getInitialState } from '../utils/reducer';
import { Keybindings, ClearType } from '../types';
import {
  DEBUG_MODE,
  LINES_PER_LEVEL,
  keybindings as defaultKeybindings,
  INITIAL_INTERVAL,
} from '../constants';
import { tick, setLevel, setInterval, setPause, reset } from '../utils/actions';
import '../styles/BlockGame.css';

interface IBlockGameProps {
  className?: string;
  id?: string;
  keybindings?: Keybindings;
}

const BlockGame = ({
  className = '',
  id = 'mappedin-block-game',
  keybindings = defaultKeybindings,
}: IBlockGameProps) => {
  useEffect(() => {
    console.log(`Loading MappedIn Blocks (debug=${DEBUG_MODE})...`);
  }, []);

  const [
    {
      grid,
      paused,
      interval,
      tetromino,
      level,
      clears,
      score,
      holdType,
      queue,
      gameOver,
    },
    dispatch,
  ] = useReducer(reducer, undefined, getInitialState);

  useController(dispatch, keybindings);

  useInterval(
    useCallback(() => {
      dispatch(tick());
    }, []),
    paused ? undefined : interval,
  );

  const renderGrid = useMemo(
    () => mergeTetrominoGrid(grid, tetromino),
    [grid, tetromino],
  );

  const linesCleared = useMemo(
    () =>
      clears[ClearType.T_SPIN_SINGLE] +
      clears[ClearType.SINGLE] +
      (clears[ClearType.T_SPIN_DOUBLE] + clears[ClearType.DOUBLE]) * 2 +
      (clears[ClearType.T_SPIN_TRIPLE] + clears[ClearType.TRIPLE]) * 3 +
      clears[ClearType.QUAD] * 4,
    [clears],
  );

  useEffect(() => {
    if (level < linesCleared / LINES_PER_LEVEL) {
      dispatch(setLevel(level + 1));
    }
  }, [level, linesCleared]);

  useEffect(() => {
    // interval is halfed for each level played
    dispatch(setInterval(INITIAL_INTERVAL / 2 ** (level - 1)));
  }, [level]);

  const [isFresh, setFresh] = useState(true);

  useEffect(() => {
    if (!paused && isFresh) {
      setFresh(false);
    }
  }, [isFresh, setFresh, paused]);

  const onNewGame = useCallback(() => {
    if (!isFresh) {
      dispatch(reset());
    }

    dispatch(setPause(false));
  }, [isFresh]);

  return (
    <div className={'mappedin-block-game ' + className} id={id}>
      <aside>
        <DisplayPiece className="hold" text="HOLD" type={holdType} />
      </aside>
      <div className="game-grid">
        <Renderer grid={renderGrid} />
      </div>
      {(gameOver || isFresh) && <NewGame onClick={onNewGame} />}
      <aside>
        <DisplayPiece className="next" text="UP NEXT" type={queue[0]} />
        <div className="buttons">
          <InfoButton text="Score" value={score} />
          <InfoButton text="Rows cleared" value={linesCleared} />
          <InfoButton text="Level" value={level} />
          <StartButton
            text={paused ? 'Resume Game' : 'Pause Game'}
            onClick={() => dispatch(setPause(!paused))}
            disabled={gameOver || isFresh}
          />
        </div>
      </aside>
    </div>
  );
};

export default BlockGame;
