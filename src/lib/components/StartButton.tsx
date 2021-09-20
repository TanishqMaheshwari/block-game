import React from 'react';

interface IStartButtonProps {
  onClick: () => void;
  text: string;
  disabled?: boolean;
}

const StartButton = ({
  onClick,
  text,
  disabled = false,
}: IStartButtonProps) => (
  <button className="start-button" onClick={onClick} disabled={disabled}>
    {text}
  </button>
);

export default StartButton;
