import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import styled, { keyframes } from 'styled-components';
import CustomModal from './components/Modal';
import Board from './components/Board';
import Keyboard from './components/Keyboard';

const COUNTDOWN = 1;
const PLAYER_1_STARTS = true;
const PLAYER_1_TIME = 120;
const PLAYER_2_TIME = 120;
const BACKEND_URL = 'http://localhost:3001';

const Background = styled.div`
    background-color: #3b3b3b;
    color: white;
    height: 100vh;
    width: 100vw;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 50vw;
  color: white;
  font-family: Arial, sans-serif;
`;

const PlayerContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 20px;
`;

const Input = styled.input`
  padding: 10px;
  font-size: 16px;
  margin-top: 20px;
  text-transform: uppercase;
  background-color: #3b3b3b;
  color: white;
  border: 1px solid #ccc;
`;

const Button = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  margin-top: 10px;
  cursor: pointer;
  background-color: #6aaa64;
  color: white;
  border: none;
  border-radius: 8px;
`;

const StartButton = styled(Button)`
  background-color: #4CAF50;
`;

const CountdownContainer = styled.div`
  font-size: 48px;
  color: white;
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const CountdownNumber = styled.div`
  animation: ${fadeIn} 1s ease-in-out infinite;
`;

function App() {
  const [lock, setLock] = useState(false);
  const [guess, setGuess] = useState("");
  const [attempts, setAttempts] = useState([[], []]);
  const [keyColors, setKeyColors] = useState({});
  const [message, setMessage] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [activePlayer, setActivePlayer] = useState(+!PLAYER_1_STARTS);
  const [timers, setTimers] = useState([PLAYER_1_TIME, PLAYER_2_TIME]);
  const [gameStarted, setGameStarted] = useState(false);
  const [countdown, setCountdown] = useState(COUNTDOWN);
  const [showCountdown, setShowCountdown] = useState(false);
  const timerRefs = [useRef(null), useRef(null)];

  useEffect(() => {
    return () => {
      clearInterval(timerRefs[0].current);
      clearInterval(timerRefs[1].current);
    };
  }, []);

  useEffect(() => {
    if (timers[0] === 0 || timers[1] === 0) {
      const winner = timers[0] === 0 ? 2 : 1;
      setMessage(`Jogador ${winner} venceu!`);
      setModalIsOpen(true);
      clearInterval(timerRefs[0].current);
      clearInterval(timerRefs[1].current);
    }
  }, [timers]);

  useEffect(() => {
    if (showCountdown && countdown > 0) {
      const countdownInterval = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
      return () => clearInterval(countdownInterval);
    } else if (countdown === 0) {
      setShowCountdown(false);
      setGameStarted(true);
      startTimer(0);
    }
  }, [showCountdown, countdown]);

  const startGame = () => {
    axios.get(BACKEND_URL + '/new')
      .then(() => setShowCountdown(true));
  };

  const startTimer = (player) => {
    clearInterval(timerRefs[0].current);
    clearInterval(timerRefs[1].current);

    timerRefs[player].current = setInterval(() => {
      setTimers(prevTimers => {
        const newTimers = [...prevTimers];
        newTimers[player]--;
        return newTimers;
      });
    }, 1000);
  };

  const handleGuess = () => {
    if (lock) return;
    setLock(true);

    if (guess.length !== 5 || attempts[activePlayer].length >= 6) return;
    if (attempts[0].includes(guess) || attempts[1].includes(guess)) return;

    axios.get(BACKEND_URL + '/try', { params: { guess } })
      .then(response => {

        if (response.data.invalid) { setLock(false); return; }

        const newAttempts = [...attempts];
        newAttempts[activePlayer] = [...newAttempts[activePlayer], { guess: response.data.word,
          present: response.data.correct ? ['green','green','green','green','green'] : response.data.present
        }];

        setAttempts(newAttempts);
        updateKeyColors(response.data.present);

        if (attempts[0].length === 6 && attempts[1].length === 6) return checkWinOrLoss(false);
        if (response.data.correct) return checkWinOrLoss(true);

        setGuess("");

        const nextPlayer = activePlayer === 0 ? 1 : 0;
        setActivePlayer(nextPlayer);
        startTimer(nextPlayer);

        setLock(false);
      });
  };

  const checkWinOrLoss = (winned) => {
    if (winned) {
      setMessage(`Jogador ${activePlayer + 1} venceu!`);
      setModalIsOpen(true);
      clearInterval(timerRefs[0].current);
      clearInterval(timerRefs[1].current);
      return;
    }
    setMessage("Empate!");
    setModalIsOpen(true);
    clearInterval(timerRefs[0].current);
    clearInterval(timerRefs[1].current);
  };

  const handleChange = (e) => {
    const value = e.target.value.toUpperCase();
    if (/^[A-Z]*$/.test(value)) {
      setGuess(value);
    }
  };

  const updateKeyColors = (present) => {
    const newKeyColors = {...keyColors};
    const usedLetters = {};

    for (const index in present)
    {
      const value = present[index], letter = guess[index];
      if (value === 'green' && !usedLetters[letter]) {
        newKeyColors[letter] = '#6aaa64';
        usedLetters[letter] = true;
      } else if (value === 'yellow' && !usedLetters[letter]) {
        newKeyColors[letter] = '#c9b458';
        usedLetters[letter] = true;
      } else if (!usedLetters[letter]) {
        newKeyColors[letter] = '#787c7e';
      }
    }

    setKeyColors(newKeyColors);
  };

  const resetGame = () => {
    setLock(false);
    setAttempts([[], []]);
    setKeyColors({});
    setMessage("");
    setGuess("");
    setModalIsOpen(false);
    setActivePlayer(+!PLAYER_1_STARTS);
    setTimers([PLAYER_1_TIME, PLAYER_2_TIME]);
    setGameStarted(false);
    setCountdown(COUNTDOWN);
    clearInterval(timerRefs[0].current);
    clearInterval(timerRefs[1].current);
  };

  const handleKeydownEvent = (e) => {
    const key = e.key.toUpperCase();
    if (key === 'ENTER')
      for (const element of document.querySelectorAll('button')) element.click();
  };

  if (!window.keydownEventAdded) {
    document.addEventListener('keydown', handleKeydownEvent);
    window.keydownEventAdded = true;
  }

  return (
    <Background>
        <Container>
        <h1>Termo Quarteto</h1>
        {!gameStarted && !showCountdown && <StartButton onClick={startGame}>Start</StartButton>}
        {showCountdown && (
            <CountdownContainer>
            <CountdownNumber>{countdown}</CountdownNumber>
            </CountdownContainer>
        )}
        {gameStarted && (
            <>
            <PlayerContainer>
                <Board player={0} attempts={attempts[0]} timer={timers[0]} />
                <Board player={1} attempts={attempts[1]} timer={timers[1]} />
            </PlayerContainer>
            <Input value={guess} onChange={handleChange} maxLength={5} />
            <Button onClick={handleGuess}>Enter</Button>
            <Keyboard keyColors={keyColors} onKeyPress={handleChange} onEnter={handleGuess} />
            </>
        )}
        <CustomModal isOpen={modalIsOpen} onRequestClose={resetGame} message={message} onClose={resetGame} />
        </Container>
    </Background>
  );
}

export default App;
