import React, { useState } from 'react';

const Game = () => {
  // Set a random number between 1 and 100
  const [randomNumber, setRandomNumber] = useState(Math.floor(Math.random() * 100) + 1);
  const [guess, setGuess] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [message, setMessage] = useState('');
  const [gameOver, setGameOver] = useState(false);

  // Handle user input
  const handleInputChange = (event) => {
    setGuess(event.target.value);
  };

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    if (gameOver) return; // Prevent further guesses after game over

    const userGuess = parseInt(guess, 10);

    if (isNaN(userGuess)) {
      setMessage('Please enter a valid number.');
      return;
    }

    setAttempts(attempts + 1);

    if (userGuess < randomNumber) {
      setMessage('Too low! Try again.');
    } else if (userGuess > randomNumber) {
      setMessage('Too high! Try again.');
    } else {
      setMessage(`Congratulations! You've guessed the number in ${attempts + 1} attempts.`);
      setGameOver(true);
    }
  };

  // Restart the game
  const handleRestart = () => {
    setRandomNumber(Math.floor(Math.random() * 100) + 1);
    setGuess('');
    setAttempts(0);
    setMessage('');
    setGameOver(false);
  };

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>Number Guessing Game</h1>
      {!gameOver && (
        <div>
          <p>Guess a number between 1 and 100</p>
          <form onSubmit={handleSubmit}>
            <input
              type="number"
              value={guess}
              onChange={handleInputChange}
              min="1"
              max="100"
              disabled={gameOver}
              style={{ padding: '10px', fontSize: '16px' }}
            />
            <button type="submit" style={{ padding: '10px 20px', fontSize: '16px' }}>Submit Guess</button>
          </form>
          <p>{message}</p>
        </div>
      )}
      {gameOver && (
        <div>
          <p>{message}</p>
          <button onClick={handleRestart} style={{ padding: '10px 20px', fontSize: '16px' }}>Play Again</button>
        </div>
      )}
    </div>
  );
};

export default Game;
