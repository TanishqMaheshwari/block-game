import React from 'react';
import logo from '../logo.png';
import '../styles/NewGame.css';

interface INewGameProps {
  onClick: () => void;
}

const NewGame = ({ onClick }: INewGameProps) => {
  return (
    <div className="wrapper">
      <img className="logo" src={logo} alt="Mappedin Logo" />
      <h1 className="title">BLOCK GAME</h1>
      <button className="new" onClick={onClick}>
        NEW GAME
      </button>
    </div>
  );
};

export default NewGame;
