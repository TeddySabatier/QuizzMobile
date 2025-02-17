import { useState } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

interface GameSettingsProps {
  targetEmoji: string;
  lifeEmoji: string;
  saveCustomEmojis: (newTarget: string, newHeart: string) => void;
}

const useGameSettings = (): GameSettingsProps => {
  const [targetEmoji, setTargetEmoji] = useState('🎯');
  const [lifeEmoji, setLifeEmoji] = useState('❤️');

  const saveCustomEmojis = (newTarget: string, newHeart: string) => {
    setTargetEmoji(newTarget);
    setLifeEmoji(newHeart);
  };

  return {
    targetEmoji,
    lifeEmoji,
    saveCustomEmojis,
  };
};

interface SettingsDialogProps {
  visible: boolean;
  onClose: () => void;
  saveCustomEmojis: (target: string, heart: string) => void;
  targetEmoji: string;
  lifeEmoji: string;
}

const SettingsDialog: React.FC<SettingsDialogProps> = ({ 
  visible, 
  onClose, 
  saveCustomEmojis, 
  targetEmoji: defaultTargetEmoji, 
  lifeEmoji: defaultLifeEmoji 
}) => {
  const [targetEmoji, setTargetEmoji] = useState(defaultTargetEmoji);
  const [lifeEmoji, setLifeEmoji] = useState(defaultLifeEmoji);

  const handleSave = () => {
    saveCustomEmojis(targetEmoji, lifeEmoji);
    onClose();
  }

  return (
    <Modal animationType="slide" transparent visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          <Text style={styles.title}>Customize Emojis</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Target Emoji:</Text>
            <TextInput 
              style={styles.input} 
              value={targetEmoji} 
              onChangeText={setTargetEmoji} 
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Heart Emoji:</Text>
            <TextInput 
              style={styles.input} 
              value={lifeEmoji} 
              onChangeText={setLifeEmoji} 
            />
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  dialog: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  inputGroup: {
    width: '100%',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 5,
    fontSize: 18,
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: 'black',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  saveText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    marginTop: 10,
  },
  closeText: {
    color: 'red',
    fontSize: 16,
  },
});

export default SettingsDialog;
export { useGameSettings, SettingsDialog };