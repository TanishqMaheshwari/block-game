import React from 'react';

interface IInfoButtonProps {
  text: string;
  value: string | number;
}

const InfoButton = ({ text, value }: IInfoButtonProps) => (
  <div className="info-button">
    {text}
    <span className="info-button-value">{value}</span>
  </div>
);

export default InfoButton;
