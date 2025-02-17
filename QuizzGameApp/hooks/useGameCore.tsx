import { useState } from 'react';

export interface GameCore {
  lives: Number;
  points: Number;
  isGameOver: boolean;
  isQuizToAnswer: boolean;
  loseLife: () => void;
  earnLife: (lives: Number | undefined) => void;
  earnPoint: (points: Number | undefined) => void;
  showQuiz: () => void;
  restartGame: ({ callback }: { callback: () => void }) => void;
  onAnswer: ({ onWrongAnswer, onCorrectAnswer, restartGame }: { onWrongAnswer: () => void, onCorrectAnswer: () => void, restartGame: () => void }) => (isCorrect: Boolean) => void;
}

const useGameCore = ({ settingsVisible }: { settingsVisible: boolean }): GameCore => {
  const [lives, setLives] = useState(3);
  const [points, setPoints] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [quizVisible, setQuizVisible] = useState(false); // New state for quiz visibility
  const isQuizToAnswer = quizVisible || isGameOver;

  const loseLife = () => {
    // Never loose life when the quiz or settings is visible
    if (isQuizToAnswer || settingsVisible) return;

    if (lives > 1) {
      setLives((prevLives) => prevLives - 1);
    } else {
      setIsGameOver(true);
    }
  };
  const earnLife = (lives: Number | undefined) => setLives((prevLives) => prevLives + (Number(lives || 1)));
  const earnPoint = (points: Number | undefined) => setPoints((prevPoints) => prevPoints + (Number(points || 1)));


  const restartGame = ({ callback }: { callback: () => void }) => {
    setLives(3);
    setIsGameOver(false);
    setPoints(0);
    setQuizVisible(false);  // Hide quiz when restarting the game
    callback();
  };

  const onAnswer = ({ onWrongAnswer, onCorrectAnswer, restartGame }: { onWrongAnswer: () => void, onCorrectAnswer: () => void, restartGame: () => void }) => (isCorrect: Boolean) => {
    if (isCorrect) {
      onCorrectAnswer();
    } else if (lives > 0 && !isCorrect) {
      onWrongAnswer();
    } else if (lives === 1 && isGameOver && !isCorrect) {
      return restartGame();
    }

    setIsGameOver(false);
    setQuizVisible(false);  // Hide quiz after answering correctly
  };

  const showQuiz = () => setQuizVisible(true);

  return {
    lives,
    points,
    isGameOver,
    isQuizToAnswer,
    showQuiz,
    loseLife,
    earnLife,
    earnPoint,
    restartGame,
    onAnswer,
  }
}

export default useGameCore;
