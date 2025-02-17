import { gamesConfig } from '@/hooks/useSettings';
import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Picker, ActivityIndicator } from 'react-native';

interface SettingsDialogProps {
  visible: boolean;
  onClose: () => void;
  onSave: (gameType: 'AvoidObstacle' | 'default', categoryId: number | null) => void;
  defaultGameName: 'AvoidObstacle' | 'default';
  defaultCategory: number | null;
  SettingsGameDialog: React.FC<{ visible: boolean; onClose: () => void }>;
  gameSettings: any;
}

const TRIVIA_CATEGORIES_URL = 'https://opentdb.com/api_category.php';

const SettingsDialog: React.FC<SettingsDialogProps> = ({
  visible,
  onClose,
  onSave,
  defaultGameName,
  defaultCategory,
  SettingsGameDialog,
  gameSettings,
}) => {
  const [gameType, setGameName] = useState<'AvoidObstacle' | 'default'>(defaultGameName);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(defaultCategory);
  const [loadingCategories, setLoadingCategories] = useState<boolean>(true);
  const [isGameSettingsVisible, setIsGameSettingsVisible] = useState(false);

  // Fetch trivia categories from Open Trivia API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(TRIVIA_CATEGORIES_URL);
        const data = await response.json();
        setCategories(data.trivia_categories || []);
      } catch (error) {
        console.error('Error fetching trivia categories:', error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <Modal animationType="slide" transparent visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          <Text style={styles.title}>Customize Game Settings</Text>

          {/* Game Type Selection */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Select Game Type:</Text>
            <Picker selectedValue={gameType} style={styles.picker} onValueChange={setGameName}>
            {Object.values(gamesConfig).map(({ gameId, name }: {gameId: string, name: string}) => (
              <Picker.Item  key={gameId} label={name} value={gameId} />
            ))}
            </Picker>
          </View>

          {/* Trivia Category Selection */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Select Trivia Category:</Text>
            {loadingCategories ? (
              <ActivityIndicator size="small" color="blue" />
            ) : (
              <Picker selectedValue={selectedCategory} style={styles.picker} onValueChange={setSelectedCategory}>
                <Picker.Item label="Any Category" value={null} />
                {categories.map((category) => (
                  <Picker.Item key={category.id} label={category.name} value={category.id} />
                ))}
              </Picker>
            )}
          </View>

          {/* Open Sub-Modal for Game Settings */}
          <TouchableOpacity style={styles.subMenuButton} onPress={() => setIsGameSettingsVisible(true)}>
            <Text style={styles.subMenuText}>Open Game Settings</Text>
          </TouchableOpacity>

          {/* Sub-Modal for Game Settings */}
          {isGameSettingsVisible && (
            <SettingsGameDialog visible={isGameSettingsVisible} onClose={() => setIsGameSettingsVisible(false)} {...gameSettings} />
          )}

          {/* Save Button */}
          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => {
              onSave(gameType, selectedCategory);
              onClose();
            }}
          >
            <Text style={styles.saveText}>Save Game Settings</Text>
          </TouchableOpacity>

          {/* Close Button */}
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
