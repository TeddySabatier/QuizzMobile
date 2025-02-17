import { useState, useEffect, useRef } from 'react';
import { Animated, Dimensions } from 'react-native';

interface UseGameProps {
  onCorrectAnswer: () => void;
  playerEmoji: string;
  obstacleEmoji: string;
  settingsVisible: boolean;
}

const { width } = Dimensions.get('window');
const movingPlayerX = width / 4;

const useGame = ({ onCorrectAnswer, playerEmoji, obstacleEmoji, settingsVisible }: UseGameProps) => {
  const [lives, setLives] = useState(3);
  const [points, setPoints] = useState(0);
  const [isTouching, setIsTouching] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [obstacles, setObstacles] = useState<{ id: number; left: Animated.Value; hasHit: boolean }[]>([]);
  const [obstacleSpeed, setObstacleSpeed] = useState(4000);
  const [quizVisible, setQuizVisible] = useState(false); // New state for quiz visibility
  const [countdown, setCountdown] = useState(5); // Timer state for countdown
  const touchTimer = useRef<NodeJS.Timeout | null>(null);

  const displayQuiz = quizVisible || isGameOver;
  useEffect(() => {
    // Handle obstacle generation and movement logic
    if (!displayQuiz && !settingsVisible) {
      const interval = setInterval(() => {
        const newObstacle = {
          id: Math.random(),
          left: new Animated.Value(width),
          hasHit: false,
        };

        setObstacles((prevObstacles) => [...prevObstacles, newObstacle]);

        Animated.timing(newObstacle.left, {
          toValue: -50,
          duration: obstacleSpeed,
          useNativeDriver: false,
        }).start(() => {
          setObstacles((prevObstacles) =>
            prevObstacles.filter((obs) => obs.id !== newObstacle.id)
          );
        });
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [displayQuiz, obstacleSpeed]);

  useEffect(() => {
    // Speed up obstacles every 30 seconds
    const speedInterval = setInterval(() => {
      if (!displayQuiz && !settingsVisible) {
        setObstacleSpeed((prevSpeed) => Math.max(prevSpeed - 500, 1500));
      }
    }, 30000);

    return () => clearInterval(speedInterval);
  }, [displayQuiz]);

  useEffect(() => {
    // Countdown timer logic
    if (!displayQuiz && !settingsVisible) {
      if (countdown > 0) {
        const timerInterval = setInterval(() => {
          setPoints((prev) => Math.round((prev + 0.05)*100)/100);
          setCountdown((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timerInterval);
      } else {
        // When the timer reaches 0, show the quiz
        setQuizVisible(true);
        setCountdown(20); // Reset the timer for the next round
      }
    }
  }, [countdown, displayQuiz, settingsVisible]);

  useEffect(() => {
    // Collision detection and losing lives logic
    const checkCollision = setInterval(() => {
      if(displayQuiz) return;  // Don't check for collisions when the quiz is visible
      setObstacles((prevObstacles) =>
        prevObstacles.map((obstacle) => {
          const obsX = obstacle.left._value;

          if (Math.abs(movingPlayerX - obsX) < 20 && !isTouching && !obstacle.hasHit) {
            loseLife();
            return { ...obstacle, hasHit: true };
          }
          return obstacle;
        })
      );
    }, 100);

    return () => clearInterval(checkCollision);
  }, [obstacles, isTouching, displayQuiz]);

  const handleTouchStart = () => {
    setIsTouching(true);
    if (touchTimer.current) clearTimeout(touchTimer.current);
    touchTimer.current = setTimeout(() => {
      setIsTouching(false);
    }, 500);
  };

  const handleTouchEnd = () => {
    setIsTouching(false);
  };

  const loseLife = () => {
    if (lives > 1) {
      setLives((prevLives) => prevLives - 1);
    } else {
      setIsGameOver(true);
    }
  };

  const restartGame = () => {
    setLives(3);
    setIsGameOver(false);
    setObstacles([]);
    setPoints(0);
    setObstacleSpeed(4000);
    setQuizVisible(false);  // Hide quiz when restarting the game
    setCountdown(20);  // Reset the timer
  };
  const onAnswer = () => {
    if (lives > 0) {
      setIsGameOver(false);
      setQuizVisible(false);  // Hide quiz after answering correctly
      setCountdown(20);  // Reset the timer after the quiz
      onCorrectAnswer();
    }
  };

  const onCorrectAnswerHandler = () => {
    setLives((prev) => prev + 1);
    setPoints((prev) => prev + 1);
    onAnswer();
  };

  const onWrongAnswer = () => {
    onAnswer();
    if(lives < 0) {
      restartGame();
    }
  };

  return {
    movingPlayerX,
    lives,
    points,
    isTouching,
    displayQuiz,
    isGameOver,
    obstacles,
    playerEmoji,
    obstacleEmoji,
    countdown,
    handleTouchStart,
    handleTouchEnd,
    onWrongAnswer,
    onCorrectAnswerHandler,
  };
};

export default useGame;
