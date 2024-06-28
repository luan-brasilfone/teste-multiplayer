import React from 'react';
import styled from 'styled-components';
import Cell, { EmptyCell } from './Cell';

const BoardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Row = styled.div`
  display: flex;
`;

const Timer = styled.div`
  font-size: 24px;
  margin: 10px;
`;

const Board = ({ player, attempts, timer }) => {
  const renderRows = () => {
    const rows = [];
    for (let i = 0; i < 6; i++) {
      if (i < attempts.length) {
        const attempt = attempts[i];
        rows.push(
          <Row key={i}>
            {attempt.guess.split("").map((letter, j) => (
              <Cell
                key={j}
                correct={attempt.present[j] === 'green'}
                present={attempt.present[j] === 'yellow'}
                animated={true}
              >
                {letter}
              </Cell>
            ))}
          </Row>
        );
      } else {
        rows.push(
          <Row key={i}>
            {Array(5).fill("").map((_, j) => (
              <EmptyCell key={j} />
            ))}
          </Row>
        );
      }
    }
    return rows;
  };

  return (
    <BoardContainer>
      <h2>Jogador {player + 1}</h2>
      <Timer>Tempo: {timer}s</Timer>
      {renderRows()}
    </BoardContainer>
  );
};

export default Board;