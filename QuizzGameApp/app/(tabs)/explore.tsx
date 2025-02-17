import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import useSettings from '../../hooks/useSettings';
import useGame from '../../hooks/useGame';
import QuizzDialog from '../../components/QuizzDialog';
import SettingsDialog from '../../components/SettingsDialog';

const CustomIcon = ({ lifeEmoji }: { lifeEmoji: string }) => {
  return (
    <View style={styles.viewIcon}>
      <Text style={styles.textIcon}>{lifeEmoji}</Text>
    </View>
  );
};

const GameScreen: React.FC = () => {
  const {
    playerEmoji,
    obstacleEmoji,
    lifeEmoji,
    settingsVisible,
    setSettingsVisible,
    saveCustomEmojis,
  } = useSettings();

  const onCorrectAnswer = () => {
    console.log('Correct answer!'); // Handle correct answer logic here
  };

  const {
    movingPlayerX,
    lives,
    points,
    isTouching,
    displayQuiz,
    isGameOver,
    obstacles,
    countdown,
    handleTouchStart,
    handleTouchEnd,
    onWrongAnswer,
    onCorrectAnswerHandler,
  } = useGame({
    onCorrectAnswer, 
    playerEmoji, 
    obstacleEmoji, 
    settingsVisible
  });

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

      <SettingsDialog
        visible={settingsVisible}
        onClose={() => setSettingsVisible(false)}
        onSave={saveCustomEmojis}
        defaultPlayerEmoji={playerEmoji}
        defaultObstacleEmoji={obstacleEmoji}
        defaultLifeEmoji={lifeEmoji}
      />

      <QuizzDialog visible={displayQuiz} isGameOver={isGameOver} onWrongAnswer={onWrongAnswer} onCorrectAnswer={onCorrectAnswerHandler} />

      <Text style={styles.statusText}>{`Points: ${points}`}</Text>

      <View style={styles.livesContainer}>
        {!isGameOver && Array.from({ length: lives }).map((_, index) => <CustomIcon key={index} lifeEmoji={lifeEmoji} />)}
      </View>

      {!isGameOver && <Text style={[styles.movingPlayer, { left: movingPlayerX, transform: [{ scaleX: isTouching ? 1 : -1 }] }]}>{playerEmoji}</Text>}

      {obstacles.map((obstacle) => (
        <Animated.View key={obstacle.id} style={[styles.obstacle, { left: obstacle.left }]}>
          <Text style={styles.obstacleEmoji}>{obstacleEmoji}</Text>
        </Animated.View>
      ))}
            <Text style={styles.timerText}>{`Time Left: ${countdown}s`}</Text>
    </TouchableOpacity>
  );
};

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

export default GameScreen;
