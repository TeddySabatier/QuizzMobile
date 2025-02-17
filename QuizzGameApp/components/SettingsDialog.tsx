import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Picker } from 'react-native';

interface SettingsDialogProps {
  visible: boolean;
  onClose: () => void;
  onSave: (gameType: 'avoidObstacle' | 'default') => void;
  defaultGameType: 'avoidObstacle' | 'default';
  SettingsGameDialog: React.FC;
  gameSettings: any;
}

const SettingsDialog: React.FC<SettingsDialogProps> = ({ visible, onClose, onSave, defaultGameType, SettingsGameDialog, gameSettings }) => {
  const [gameType, setGameType] = useState<'avoidObstacle' | 'default'>(defaultGameType);

  // State to handle sub-menu visibility for customizing the emoji
  const [isEmojiSubMenuVisible, setIsEmojiSubMenuVisible] = useState(false);

  // Function to handle game type change
  const handleGameTypeChange = (selectedGameType: 'avoidObstacle' | 'default') => {
    setGameType(selectedGameType);

    // Close sub-menu when game type changes
    setIsEmojiSubMenuVisible(false);
  };

  return (
    <Modal animationType="slide" transparent visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          <Text style={styles.title}>Customize Game Settings</Text>

          {/* Game Type Selection */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Select Game Type:</Text>
            <Picker
              selectedValue={gameType}
              style={styles.picker}
              onValueChange={handleGameTypeChange}
            >
              <Picker.Item label="Avoid Obstacle" value="avoidObstacle" />
              <Picker.Item label="Default Game" value="default" />
            </Picker>
          </View>

          {/* Show Sub-menu for Emoji Customization */}
          <TouchableOpacity
            style={styles.subMenuButton}
            onPress={() => setIsEmojiSubMenuVisible(true)}
          >
            <Text style={styles.subMenuText}>Game menu</Text>
          </TouchableOpacity>

          {isEmojiSubMenuVisible && 
            <SettingsGameDialog 
              {...gameSettings}
              visible={isEmojiSubMenuVisible}
              onClose={() => setIsEmojiSubMenuVisible(false)}
            />
          }

          {/* Save Game Type Selection */}
          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => {
              onSave(gameType); // Save the selected game type
              onClose(); // Close the main dialog
            }}
          >
            <Text style={styles.saveText}>Save Game Type and Categories</Text>
          </TouchableOpacity>

          {/* Close Main Dialog */}
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
  picker: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
  },
  subMenuButton: {
    marginTop: 15,
    backgroundColor: 'lightblue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  subMenuText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  subMenu: {
    marginTop: 20,
    backgroundColor: '#f7f7f7',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  subMenuTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
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
