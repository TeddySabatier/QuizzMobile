import React from 'react';
import { Animated } from 'react-native';
import useSettings from '../../hooks/useSettings';
import QuizzDialog from '../../components/QuizzDialog';
import SettingsDialog from '../../components/SettingsDialog';
import useGameCore from '../../hooks/useGameCore';

const GameScreen: React.FC = () => {
  const {
    settingsVisible,
    setSettingsVisible,
    game,
    gameSettings,
    SettingsGameDialog,
    Game,
    gameType,
    quizCategory,
    saveGameTypeAndQuizCategory,
  } = useSettings();

  const gameProps = game as {
    movingPlayerX: number;
    onCorrectAnswer: () => void;
    onWrongAnswer: () => void;
    isTouching: boolean;
    isQuizToAnswer: boolean;
    obstacles: { id: number; left: Animated.Value; hasHit: boolean; }[];
    countdown: number;
    handleTouchStart: () => void;
    handleTouchEnd: () => void;
    restartGame: () => void;
    gameCore: ReturnType<typeof useGameCore>;
  };



  return (
    <>
      <SettingsDialog
        visible={settingsVisible}
        onSave={saveGameTypeAndQuizCategory}
        onClose={() => setSettingsVisible(false)}
        SettingsGameDialog={SettingsGameDialog}
        defaultGameType={gameType}
        gameSettings={gameSettings}
      />
      <QuizzDialog
        visible={gameProps.gameCore.isQuizToAnswer}
        isGameOver={gameProps.gameCore.isGameOver}
        onAnswer={gameProps.gameCore.onAnswer({ ...gameProps })}
        quizCategory={quizCategory}
      />
      <Game
        {...gameProps}
        gameSettings={gameSettings}
        settingsVisible={settingsVisible}
        setSettingsVisible={setSettingsVisible}
      />
    </>

  );
};


export default GameScreen;
