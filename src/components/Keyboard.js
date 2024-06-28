import React from 'react';
import styled from 'styled-components';

const KeyboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
`;

const KeyRow = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 5px;
`;

const Key = styled.button`
  width: ${props => props.wide ? '85px' : '40px'};
  height: 40px;
  margin: 2px;
  font-size: 16px;
  background-color: ${props => props.color};
  cursor: pointer;
  color: white;
  border: 2px solid #ccc;
  border-radius: 8px;
`;

const keys = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M", "ENTER"]
];

const Keyboard = ({ keyColors, onKeyPress, onEnter }) => {
  return (
    <KeyboardContainer>
      {keys.map((row, rowIndex) => (
        <KeyRow key={rowIndex}>
          {row.map(key => (
            <Key
              key={key}
              color={keyColors[key] || '#3b3b3b'}
              onClick={() => {
                if (key === 'ENTER') {
                  onEnter();
                } else {
                  onKeyPress({ target: { value: key } });
                }
              }}
              wide={key === 'ENTER'}
            >
              {key}
            </Key>
          ))}
        </KeyRow>
      ))}
    </KeyboardContainer>
  );
};

export default Keyboard;