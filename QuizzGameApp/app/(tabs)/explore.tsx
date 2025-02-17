import React from 'react';
import useSettings from '../../hooks/useSettings';
import QuizzDialog from '../../components/QuizzDialog';
import SettingsDialog from '../../components/SettingsDialog';

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
    saveGameNameAndQuizCategory,
  } = useSettings();



  return (
    <>
      <SettingsDialog
        visible={settingsVisible}
        onSave={saveGameNameAndQuizCategory}
        onClose={() => setSettingsVisible(false)}
        SettingsGameDialog={SettingsGameDialog}
        defaultGameName={gameType}
        gameSettings={gameSettings}
      />
      <QuizzDialog
        visible={game.gameCore.isQuizToAnswer}
        isGameOver={game.gameCore.isGameOver}
        onAnswer={game.gameCore.onAnswer({ ...game })}
        quizCategory={quizCategory}
      />
      <Game
        {...game}
        gameSettings={gameSettings}
        settingsVisible={settingsVisible}
        setSettingsVisible={setSettingsVisible}
      />
    </>

  );
};


export default GameScreen;
