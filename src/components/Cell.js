import React from 'react';
import styled, { keyframes } from 'styled-components';

const flip = keyframes`
  0% { transform: rotateY(180deg); }
  100% { transform: rotateY(0); }
`;

const CellContainer = styled.span`
  display: inline-block;
  width: 40px;
  height: 40px;
  margin: 5px;
  line-height: 40px;
  text-align: center;
  border: 2px solid #ccc;
  border-radius: 8px;
  font-size: 20px;
  background-color: ${props => props.correct ? '#6aaa64' : props.present ? '#c9b458' : '#787c7e'};
  color: white;
  animation: ${props => props.animated ? flip : 'none'} 0.5s ease-out;
`;

const EmptyCellContainer = styled(CellContainer)`
  background-color: #3b3b3b;
  border-color: #ccc;
`;

const Cell = ({ correct, present, animated, children }) => {
  return (
    <CellContainer correct={correct} present={present} animated={animated}>
      {children}
    </CellContainer>
  );
};

const EmptyCell = () => <EmptyCellContainer />;

export { Cell as default, EmptyCell };