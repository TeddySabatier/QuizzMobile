import { useState } from 'react';
import useGameCore, { GameCore } from './useGameCore';
import * as avoidObstacle from '@/app/games/AvoidObstacle';
import * as Tapper from '@/app/games/Tapper';

export const games = {
  avoidObstacle,
  Tapper,
} as const; // Ensures strict typing

export const gamesConfig = Object.values(games).reduce((acc, game) => ({ ...acc, [game.config.name]: game.config }), {});

type GameLogic =
  | ReturnType<typeof useGameCore>
  | {
    [K in keyof typeof games]: ReturnType<typeof games[K]['useGame']>;
  }[keyof typeof games]; // This ensures a union of all return types

type GameSettings = ReturnType<typeof avoidObstacle.useGameSettings> | ReturnType<typeof Tapper.useGameSettings>;

export type GameName = keyof typeof games;

type SettingsGameDialog = {
  [K in keyof typeof games]:
  typeof games[K] extends { SettingsGameDialog: React.FC<infer P> } ? React.FC<P> : never;
}[keyof typeof games];


type Game = {
  [K in keyof typeof games]: ReturnType<typeof games[K]['Game']>;
}[keyof typeof games];

// Define the types for the custom hook
interface SettingsProps {
  settingsVisible: boolean;
  setSettingsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  saveGameChosen: (gameChosen: GameName) => void;
  game: GameLogic;
  gameSettings: GameSettings;
  SettingsGameDialog?: React.FC<SettingsGameDialog>; // Allow `undefined`
  Game: React.FC<Game>;
  gameType: GameName;
  quizCategory: number | null;
  saveGameNameAndQuizCategory: (gameType: GameName, categoryId: number | null) => void;
}

export type GameHook = (props: { gameCore: GameCore; settingsVisible: boolean }) => {
  gameLogic: GameLogic;
  gameSettings: GameSettings;
  SettingsGameDialog?: React.FC<SettingsGameDialog>; // Allow `undefined`
  Game: React.FC<Game>;
};
export interface GameHookReturn {
  gameLogic: GameLogic;
  gameSettings: GameSettings;
  SettingsGameDialog?: React.FC<SettingsGameDialog>; // Allow `undefined`
  Game: React.FC<Game>;
};

const useGameLogic = (gameName: GameName, settingsVisible: boolean): GameHookReturn | undefined => {

  // Call all hooks but conditionally use only the relevant one
  const avoidObstacleGameSettings = avoidObstacle.useGameSettings();
  const avoidObstacleGame = avoidObstacle.useGame({ gameCore: useGameCore({ settingsVisible }), settingsVisible, ...avoidObstacleGameSettings });
  console.log('[useGameLogic] settingsVisible', settingsVisible);
  const tapperGameSettings = Tapper.useGameSettings();
  const tapperGame = Tapper.useGame({ gameCore: useGameCore({ settingsVisible }), settingsVisible, ...tapperGameSettings });

  if (gameName === 'Tapper') {
    return {
      gameLogic: tapperGame,
      gameSettings: tapperGameSettings,
      SettingsGameDialog: Tapper.SettingsDialog,
      Game: Tapper.Game,
    };
  }
  if (gameName === 'AvoidObstacle') {
    return {
      gameLogic: avoidObstacleGame,
      gameSettings: avoidObstacleGameSettings,
      SettingsGameDialog: avoidObstacle.SettingsDialog,
      Game: avoidObstacle.Game,
    };
  }

};

const useSettings = (): SettingsProps => {
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [gameType, setGameName] = useState<GameName>('Tapper');
  const [quizCategory, setQuizCategory] = useState<number | null>(null);

  const gameLogicHook = useGameLogic(gameType, settingsVisible);
  if (!gameLogicHook) {
    throw new Error(`Game logic not found for ${gameType}`);
  }
  // Dynamically choose the game-specific settings and logic
  const { gameLogic, gameSettings, SettingsGameDialog, Game } = gameLogicHook;

  const saveGameNameAndQuizCategory = (gameType: GameName, categoryId: number | null) => {
    setGameName(gameType);
    setQuizCategory(categoryId);
    gameLogic.gameCore.restartGame({ callback: () => { } });
  };

  return {
    settingsVisible,
    setSettingsVisible,
    game: gameLogic,
    gameSettings,
    SettingsGameDialog,
    Game,
    gameType,
    quizCategory,
    saveGameNameAndQuizCategory,
  };
};

export default useSettings;
