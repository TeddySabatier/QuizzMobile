import { useState } from 'react';

// Define the types for the custom hook
interface SettingsProps {
  playerEmoji: string;
  obstacleEmoji: string;
  lifeEmoji: string;
  settingsVisible: boolean;
  setSettingsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  saveCustomEmojis: (newFish: string, newShark: string, newHeart: string) => void;
}

const useSettings = (): SettingsProps => {
  const [playerEmoji, setplayerEmoji] = useState('🐟');
  const [obstacleEmoji, setobstacleEmoji] = useState('🦈');
  const [lifeEmoji, setlifeEmoji] = useState('❤️');
  const [settingsVisible, setSettingsVisible] = useState(false);

  const saveCustomEmojis = (newFish: string, newShark: string, newHeart: string) => {
    setplayerEmoji(newFish);
    setobstacleEmoji(newShark);
    setlifeEmoji(newHeart);
    setSettingsVisible(false);
  };

  return {
    playerEmoji,
    obstacleEmoji,
    lifeEmoji,
    settingsVisible,
    setSettingsVisible,
    saveCustomEmojis,
  };
};

export default useSettings;
