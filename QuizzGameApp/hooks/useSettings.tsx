import { useState } from 'react';
import useGameCore, { GameCore } from './useGameCore';
import * as avoidObstacle from '@/app/games/AvoidObstacle';

// Define the types for the custom hook
interface SettingsProps {
  settingsVisible: boolean;
  setSettingsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  saveGameChosen: (gameChosen: GameType) => void;
  game: ReturnType<typeof avoidObstacle.useGame> | ReturnType<typeof useGameCore>;
  gameSettings: ReturnType<typeof avoidObstacle.useGameSettings>;
  SettingsGameDialog: React.FC;
  gameType: GameType;
}

export type GameType = 'avoidObstacle' | 'default';
export type GameHook = (props: any) => {
  gameLogic: ReturnType<typeof useGameCore> | ReturnType<typeof avoidObstacle.useGame>;
  gameSettings: ReturnType<typeof avoidObstacle.useGameSettings>;
  SettingsGameDialog?: React.FC;
};

interface GameHookProps {
  gameCore: GameCore;
  settingsVisible: boolean;
}

const gameHooks: Record<GameType, GameHook> = {
  avoidObstacle: ({ gameCore, settingsVisible }: GameHookProps) => {
    // Game logic for avoidObstacle
    const gameSettings = avoidObstacle.useGameSettings(); // Use settings specific to AvoidObstacle
    const gameLogic = avoidObstacle.useGame({ gameCore, settingsVisible, ...gameSettings });
    return { gameLogic, gameSettings, SettingsGameDialog: avoidObstacle.SettingsDialog };
  },
  default: ({ gameCore }: GameHookProps) => {
    // Game logic for default
    const gameSettings = avoidObstacle.useGameSettings(); // Use default game settings
    return { gameLogic: gameCore, gameSettings };
  },
};

const useSettings = (): SettingsProps => {
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [gameType, setGameType] = useState<GameType>('avoidObstacle');
  // Dynamically choose the game-specific settings and logic
  const gameCore = useGameCore({ settingsVisible });
  const { gameLogic, gameSettings, SettingsGameDialog } = gameHooks[gameType]({
    settingsVisible, setSettingsVisible,
    gameCore
  });

  // Handle game selection change
  const saveGameChosen = (gameChosen: GameType) => {
    setGameType(gameChosen);
  };

  return {
    settingsVisible,
    setSettingsVisible,
    saveGameChosen,
    game: gameLogic,
    gameSettings,
    SettingsGameDialog,
    gameType,
  };
};

export default useSettings;
