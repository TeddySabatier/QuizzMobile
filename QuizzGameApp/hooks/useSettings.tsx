import { useState, useEffect } from 'react';
import useGameCore from './useGameCore';
import { useAvoidObstacleGame } from '@/app/games/AvoidObstacle/game';

// Define the types for the custom hook
interface SettingsProps {
  playerEmoji: string;
  obstacleEmoji: string;
  lifeEmoji: string;
  settingsVisible: boolean;
  setSettingsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  saveCustomEmojis: (newFish: string, newShark: string, newHeart: string) => void;
  saveGameChosen: (gameChosen: GameType) => void;
  game: ReturnType<typeof useAvoidObstacleGame> | ReturnType<typeof useGameCore>;
  gameType: GameType;
}

export type GameType = 'avoidObstacle' | 'default';
export type GameHook = (props: any) => ReturnType<typeof useGameCore> | ReturnType<typeof useAvoidObstacleGame>;

const gameHooks: Record<GameType, GameHook> = {
  avoidObstacle: useAvoidObstacleGame,
  default: useGameCore, // A fallback or base game mode
};

const useSettings = (): SettingsProps => {
  const [playerEmoji, setPlayerEmoji] = useState('🐟');
  const [obstacleEmoji, setObstacleEmoji] = useState('🦈');
  const [lifeEmoji, setLifeEmoji] = useState('❤️');
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [gameType, setGameType] = useState<GameType>('avoidObstacle');
  const gameCore = useGameCore({ settingsVisible });
  const game = gameHooks[gameType]({
    gameCore,
    playerEmoji,
    obstacleEmoji,
    settingsVisible,
  });


  const saveCustomEmojis = (newFish: string, newShark: string, newHeart: string) => {
    setPlayerEmoji(newFish);
    setObstacleEmoji(newShark);
    setLifeEmoji(newHeart);
    setSettingsVisible(false);
  };

  const saveGameChosen = (gameChosen: GameType) => {
    setGameType(gameChosen);
  };

  return {
    playerEmoji,
    obstacleEmoji,
    lifeEmoji,
    settingsVisible,
    setSettingsVisible,
    saveCustomEmojis,
    saveGameChosen,
    game,
    gameType,
  };
};

export default useSettings;
