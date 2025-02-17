import { useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import useGameCore, { GameCore } from '@/hooks/useGameCore';

interface useTapperGameProps {
  settingsVisible: boolean;
  gameCore: GameCore;
}

const { width, height } = Dimensions.get('window');
const COUNT_DOWN_QUESTION = 4;

const useTapperGame = ({ settingsVisible, gameCore }: useTapperGameProps) => {
  const [countdown, setCountdown] = useState(COUNT_DOWN_QUESTION);
  const [targets, setTargets] = useState<Array<{ id: number; top: number; left: number; tapped: boolean }>>([]);

  const { isQuizToAnswer } = gameCore;

  const settingsVisibleRef = useRef(settingsVisible); // Store latest value in a ref
  const isQuizToAnswerRef = useRef(gameCore.isQuizToAnswer)
  ;
  useEffect(() => {
    settingsVisibleRef.current = settingsVisible; // Update ref whenever it changes
  }, [settingsVisible]);
  
  useEffect(() => {
    isQuizToAnswerRef.current = isQuizToAnswer; // Update ref whenever it changes
  }, [isQuizToAnswer]);
  
  useEffect(() => {
    // Generate new targets periodically
    if (!isQuizToAnswer && !settingsVisible) {
      const interval = setInterval(() => {
        const newTarget = {
          id: Math.random(),
          top: Math.random() * (height - 200) + 100,
          left: Math.random() * (width - 100),
          tapped: false
        };
        setTargets(prev => [...prev, newTarget]);

        // Remove target after 2 seconds if not tapped
        setTimeout(() => {
          if (!newTarget.tapped) {
            setTargets(prev => {
              const updatedTargets = prev.filter(target => target.id !== newTarget.id);

              // Lose life when a target is missed
              if (updatedTargets.length < prev.length && !settingsVisibleRef.current && !isQuizToAnswerRef) {
                gameCore.loseLife();
              }

              return updatedTargets;
            });
          }
        }, 2000);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isQuizToAnswer, settingsVisible]);

  useEffect(() => {
    // Countdown timer logic
    if (!isQuizToAnswer && !settingsVisible) {
      if (countdown > 0) {
        const timerInterval = setInterval(() => {
          setCountdown(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timerInterval);
      } else {
        gameCore.showQuiz();
        setCountdown(COUNT_DOWN_QUESTION);
      }
    }
  }, [countdown, isQuizToAnswer, settingsVisible]);

  const handleTap = (id: number) => {
    if (isQuizToAnswer || settingsVisible) return;

    setTargets(prev => prev.map(target =>
      target.id === id ? { ...target, tapped: true } : target
    ));

    gameCore.earnPoint(0.05);
    setTimeout(() => {
      setTargets(prev => prev.filter(target => target.id !== id));
    }, 100);
  };

  const restartGameCallback = () => {
    setTargets([]);
    setCountdown(COUNT_DOWN_QUESTION);
  };

  const restartGame = () => gameCore.restartGame({ callback: restartGameCallback });

  const sharedAnswerLogic = () => {
    setCountdown(COUNT_DOWN_QUESTION);
  };

  const onCorrectAnswer = () => {
    sharedAnswerLogic();
    gameCore.earnLife(1);
    gameCore.earnPoint(1);
  };

  const onWrongAnswer = () => {
    sharedAnswerLogic();
  };

  return {
    targets,
    countdown,
    isQuizToAnswer,
    handleTap,
    onCorrectAnswer,
    onWrongAnswer,
    restartGame,
    gameCore
  };
};

const TapperGame = ({
  targets,
  countdown,
  handleTap,
  gameCore,
  setSettingsVisible,
  gameSettings
}: {
  targets: Array<{ id: number; top: number; left: number; tapped: boolean }>;
  countdown: number;
  handleTap: (id: number) => void;
  gameCore: ReturnType<typeof useGameCore>;
  setSettingsVisible: (visible: boolean) => void;
  gameSettings: any;
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.settingsButton} onPress={() => setSettingsVisible(true)}>
        <Text style={styles.settingsIcon}>⚙️</Text>
      </TouchableOpacity>

      <Text style={styles.statusText}>{`Points: ${gameCore.points}`}</Text>

      <View style={styles.livesContainer}>
        {!gameCore.isGameOver && Array.from({ length: Number(gameCore.lives) }).map((_, index) => (
          <View key={index} style={styles.viewIcon}>
            <Text style={styles.textIcon}>{gameSettings.lifeEmoji}</Text>
          </View>
        ))}
      </View>

      {targets.map(target => (
        <TouchableOpacity
          key={target.id}
          style={[styles.target, { top: target.top, left: target.left }]}
          onPress={() => handleTap(target.id)}
        >
          <Text style={styles.targetEmoji}>{gameSettings.targetEmoji}</Text>
        </TouchableOpacity>
      ))}

      <Text style={styles.timerText}>{`Time Left: ${countdown}s`}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  settingsButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
  },
  settingsIcon: {
    fontSize: 30,
  },
  statusText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 60,
  },
  timerText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
  target: {
    position: 'absolute',
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  targetEmoji: {
    fontSize: 40,
  },
  livesContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
    flexDirection: 'row',
  },
  viewIcon: {
    width: 30,
    height: 30,
    marginRight: 5,
  },
  textIcon: {
    fontSize: 24,
  }
});

export { useTapperGame, TapperGame };