import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Form, Input, Message, Icon } from 'semantic-ui-react';
import Nav from './nav'
import Footer from './footer'

const Game = () => {
  const [randomNumber, setRandomNumber] = useState(Math.floor(Math.random() * 100) + 1);
  const [guess, setGuess] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [message, setMessage] = useState('');
  const [gameOver, setGameOver] = useState(false);

  const handleInputChange = (event) => {
    setGuess(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (gameOver) return;

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

  const handleRestart = () => {
    setRandomNumber(Math.floor(Math.random() * 100) + 1);
    setGuess('');
    setAttempts(0);
    setMessage('');
    setGameOver(false);
  };

  return (
    <Container>
      <Nav />
      <BigHeader>Number Guessing Game</BigHeader>
      <SubHeader>Try to win some ETH!</SubHeader>
      <GameContainer>
        <GameContent>
          {!gameOver && (
            <>
              <Instruction>Guess a number between 1 and 100</Instruction>
              <Form onSubmit={handleSubmit}>
                <Input
                  type="number"
                  value={guess}
                  onChange={handleInputChange}
                  min="1"
                  max="100"
                  disabled={gameOver}
                  placeholder="Enter a number"
                  fluid
                  style={{ marginBottom: '10px' }}
                />
                <CustomButton type="submit" fluid>Submit Guess</CustomButton>
              </Form>
              {message && (
                <MessageContainer error={message.includes('Too low') || message.includes('Too high')}>
                  <Message.Header>{message.includes('Too low') || message.includes('Too high') ? <Icon name="warning circle" /> : <Icon name="check circle" />}</Message.Header>
                  <Message.Content>{message}</Message.Content>
                </MessageContainer>
              )}
            </>
          )}

          {gameOver && (
            <>
              <MessageContainer success>
                <Message.Header><Icon name="check circle" /> {message}</Message.Header>
                <Message.Content>We were joking, no ETH for you!</Message.Content>
              </MessageContainer>
              <CustomButton onClick={handleRestart} size="large">Play Again</CustomButton>
            </>
          )}
        </GameContent>
        <CustomLink to='/'>Go To Home</CustomLink>
      </GameContainer>
      <Footer />
    </Container>
  );
};

const Container = styled.div`
`;

const BigHeader = styled.div`
    color: var(--black);
    text-align: center;
    font-family: 'Roboto Slab';
    font-size: 52px;
    font-weight: 700;
    line-height: normal;
    padding-top: 50px;
`;


const SubHeader = styled.div`
    color: var(--black);
    text-align: center;
    font-family: 'Roboto Slab';
    font-size: 42px;
    font-weight: 500;
    line-height: normal;
`;

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: auto;
  height: 90vh;
  padding: 50px;
`;

const GameContent = styled.div`
  width: 400px;
  text-align: center;
  padding: 20px;
  background-color:rgb(196, 196, 196);
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
`;

const Instruction = styled.p`
  font-size: 18px;
  margin-bottom: 20px;
`;

const MessageContainer = styled(Message)`
  margin-top: 20px;
  ${(props) => props.error && `
    background-color: #f8d7da;
    border-color: #f5c6cb;
    color: #721c24;
  `}
  ${(props) => props.success && `
    background-color: #d4edda;
    border-color: #c3e6cb;
    color: #155724;
  `}
`;

const CustomButton = styled.button`
    background: var(--black);
    color: white;
    width: 225px;
    min-height: 50px;
    border: none;
    border-radius: 4px;
    font-weight: bold;
    cursor: pointer;
    padding: 0 1.5em;
    margin-top: 20px;

    &:hover {
        opacity: 0.9;
    }

    @media screen and (max-width: 1178px){
      width: 100%;
    }
`;

const CustomLink = styled(Link)`
  padding: 50px;  
  font-weight: 600;
  font-size: 24px;
  color: #2e607a;

  :hover {
    color: #2e607a;
  }
`;

export default Game;
