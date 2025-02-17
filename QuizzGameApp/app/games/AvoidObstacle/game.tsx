import { useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity, Text, Animated, StyleSheet, Dimensions } from 'react-native';

import useGameCore, { GameCore } from '@/hooks/useGameCore';

interface useGameProps {
  playerEmoji: string;
  obstacleEmoji: string;
  settingsVisible: boolean;
  gameCore: GameCore;
}

const { width } = Dimensions.get('window');
const movingPlayerX = width / 4;

const useGame = ({ playerEmoji, obstacleEmoji, settingsVisible, gameCore }: useGameProps) => {
  const [countdown, setCountdown] = useState(5); // Timer state for countdown
  const [isTouching, setIsTouching] = useState(false);
  const [obstacles, setObstacles] = useState<{ id: number; left: Animated.Value; hasHit: boolean }[]>([]);
  const [obstacleSpeed, setObstacleSpeed] = useState(4000);
  const touchTimer = useRef<NodeJS.Timeout | null>(null);

  const { isQuizToAnswer } = gameCore;
  useEffect(() => {
    // Handle obstacle generation and movement logic
    if (!isQuizToAnswer && !settingsVisible) {
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
  }, [isQuizToAnswer, obstacleSpeed]);

  useEffect(() => {
    // Speed up obstacles every 30 seconds
    const speedInterval = setInterval(() => {
      if (!isQuizToAnswer && !settingsVisible) {
        setObstacleSpeed((prevSpeed) => Math.max(prevSpeed - 500, 1500));
      }
    }, 30000);

    return () => clearInterval(speedInterval);
  }, [isQuizToAnswer]);

  useEffect(() => {
    // Countdown timer logic
    if (!isQuizToAnswer && !settingsVisible) {
      if (countdown > 0) {
        const timerInterval = setInterval(() => {
          gameCore.earnPoint(0.05);
          setCountdown((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timerInterval);
      } else {
        // When the timer reaches 0, show the quiz
        gameCore.showQuiz();
        setCountdown(20); // Reset the timer for the next round
      }
    }
  }, [countdown, isQuizToAnswer, settingsVisible]);

  useEffect(() => {
    // Collision detection and losing lives logic
    const checkCollision = setInterval(() => {
      if (isQuizToAnswer) return;  // Don't check for collisions when the quiz is visible
      setObstacles((prevObstacles) =>
        prevObstacles.map((obstacle) => {
          const obsX = obstacle.left._value;

          if (Math.abs(movingPlayerX - obsX) < 20 && !isTouching && !obstacle.hasHit) {
            gameCore.loseLife();
            return { ...obstacle, hasHit: true };
          }
          return obstacle;
        })
      );
    }, 100);

    return () => clearInterval(checkCollision);
  }, [obstacles, isTouching, isQuizToAnswer]);

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
  const restartGameCallBack = () => {
    setObstacles([]);
    setObstacleSpeed(4000);
    setCountdown(20);  // Reset the timer
  };

  const restartGame = () => {
    gameCore.restartGame({ callback: restartGameCallBack });
  }
  const sharedAnswerLogic = () => {
    setCountdown(20);  // Reset the timer after the quiz
  }
  const onCorrectAnswer = () => {
    sharedAnswerLogic();
    gameCore.earnLife(1);
    gameCore.earnPoint(1);
  }
  const onWrongAnswer = () => {
    sharedAnswerLogic();
  }

  return {
    movingPlayerX,
    onCorrectAnswer,
    onWrongAnswer,
    isTouching,
    isQuizToAnswer,
    obstacles,
    playerEmoji,
    obstacleEmoji,
    countdown,
    handleTouchStart,
    handleTouchEnd,
    restartGame,
    gameCore
  };
};


const CustomIcon = ({ lifeEmoji }: { lifeEmoji: string }) => {
  return (
    <View style={styles.viewIcon}>
      <Text style={styles.textIcon}>{lifeEmoji}</Text>
    </View>
  );
};

const Game = ({
  movingPlayerX,
  isTouching,
  obstacles,
  countdown,
  handleTouchStart,
  handleTouchEnd,
  gameCore,
  setSettingsVisible,
  gameSettings
}: {
  movingPlayerX: number;
  isTouching: boolean;
  isQuizToAnswer: boolean;
  obstacles: { id: number; left: Animated.Value; hasHit: boolean; }[];
  countdown: number;
  handleTouchStart: () => void;
  handleTouchEnd: () => void;
  gameCore: ReturnType<typeof useGameCore>;
  setSettingsVisible: (visible: boolean) => void;
  gameSettings: any;
}) => {

  return (
    <TouchableOpacity
      onPressIn={handleTouchStart}
      onPressOut={handleTouchEnd}
      style={styles.container}
      activeOpacity={1}
    >
      <TouchableOpacity style={styles.settingsButton} onPress={() => setSettingsVisible(true)}>
        <Text style={styles.settingsIcon}>⚙️</Text>
      </TouchableOpacity>

      <Text style={styles.statusText}>{`Points: ${gameCore.points}`}</Text>

      <View style={styles.livesContainer}>
        {!gameCore.isGameOver && Array.from({ length: Number(gameCore.lives) }).map((_, index) => <CustomIcon key={index} lifeEmoji={gameSettings.lifeEmoji} />)}
      </View>

      {!gameCore.isGameOver && <Text style={[styles.movingPlayer, { left: movingPlayerX, transform: [{ scaleX: isTouching ? 1 : -1 }] }]}>{gameSettings.playerEmoji}</Text>}

      {obstacles.map((obstacle) => (
        <Animated.View key={obstacle.id} style={[styles.obstacle, { left: obstacle.left }]}>
          <Text style={styles.obstacleEmoji}>{gameSettings.obstacleEmoji}</Text>
        </Animated.View>
      ))}
      <Text style={styles.timerText}>{`Time Left: ${countdown}s`}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  movingPlayer: {
    fontSize: 40,
    position: 'absolute',
    top: 100,
  },
  settingsButton: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  settingsIcon: {
    fontSize: 30,
  },
  statusText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  gameOverText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'red',
    fontFamily: 'Creepster', // Use Gothic font for Game Over text
  },
  timerText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
  },
  obstacle: {
    position: 'absolute',
    top: 100,
  },
  obstacleEmoji: {
    fontSize: 40,
  },
  livesContainer: {
    position: 'absolute',
    top: 20,
    flexDirection: 'row',
  },
  viewIcon: {
    width: 30,
    height: 30,
    marginRight: 5,
  },
  textIcon: {
    fontSize: 24,
  },
});

export { useGame, Game };