import React, { useState } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

interface SettingsDialogProps {
  visible: boolean;
  onClose: () => void;
  onSave: (fish: string, shark: string, heart: string) => void;
  defaultPlayerEmoji: string;
  defaultObstacleEmoji: string;
  defaultLifeEmoji: string;
}

const SettingsDialog: React.FC<SettingsDialogProps> = ({ visible, onClose, onSave, defaultPlayerEmoji, defaultObstacleEmoji, defaultLifeEmoji }) => {
  const [playerEmoji, setplayerEmoji] = useState(defaultPlayerEmoji);
  const [obstacleEmoji, setobstacleEmoji] = useState(defaultObstacleEmoji);
  const [lifeEmoji, setlifeEmoji] = useState(defaultLifeEmoji);

  return (
    <Modal animationType="slide" transparent visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          <Text style={styles.title}>Customize Emojis</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Fish Emoji:</Text>
            <TextInput style={styles.input} value={playerEmoji} onChangeText={setplayerEmoji} />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Shark Emoji:</Text>
            <TextInput style={styles.input} value={obstacleEmoji} onChangeText={setobstacleEmoji} />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Heart Emoji:</Text>
            <TextInput style={styles.input} value={lifeEmoji} onChangeText={setlifeEmoji} />
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={() => onSave(playerEmoji, obstacleEmoji, lifeEmoji)}>
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
