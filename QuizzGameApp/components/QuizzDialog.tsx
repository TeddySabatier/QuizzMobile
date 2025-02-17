import React, { useState, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native';

interface QuizzDialogProps {
  visible: boolean;
  isGameOver: boolean;
  onWrongAnswer: () => void;
  onCorrectAnswer: () => void;
}

interface TriviaQuestion {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

const QuizzDialog: React.FC<QuizzDialogProps> = ({ visible, isGameOver, onWrongAnswer, onCorrectAnswer }) => {
  const [question, setQuestion] = useState<string | null>(null);
  const [answers, setAnswers] = useState<string[]>([]);
  const [correctAnswer, setCorrectAnswer] = useState<string>('');

  useEffect(() => {
    if (visible) {
      fetch('https://opentdb.com/api.php?amount=1&type=multiple')
        .then((response) => response.json())
        .then((data) => {
          if (data.results.length > 0) {
            const q: TriviaQuestion = data.results[0];
            const allAnswers = [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5);
            setQuestion(q.question);
            setAnswers(allAnswers);
            setCorrectAnswer(q.correct_answer);
          }
        })
        .catch((error) => console.error('Error fetching trivia question:', error));
    }
  }, [visible]);

  const handleAnswer = (answer: string) => {
    if (answer === correctAnswer) {
      onCorrectAnswer(); // Give an extra life
    } else {
      onWrongAnswer(); // Restart the game
    }
  };

  return (
    <Modal animationType="slide" transparent visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          {isGameOver &&<Text style={styles.gameOverText}>Game Over</Text>}
            {question && (
              <View>
                <Text style={styles.questionText}>{decodeHtmlEntities(question)}</Text>
                {answers.map((answer, index) => (
                  <TouchableOpacity key={index} style={styles.answerButton} onPress={() => handleAnswer(answer)}>
                    <Text style={styles.answerText}>{answer}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>
      </Modal>
    );
  };
  
const decodeHtmlEntities = (text: string): string => {
  return text
    .replace(/&quot;/g, '"')  // Double quotes
    .replace(/&amp;/g, '&')  // Ampersand
    .replace(/&lt;/g, '<')   // Less than
    .replace(/&gt;/g, '>')   // Greater than
    .replace(/&#039;/g, "'") // Apostrophe (single quote)
    .replace(/&rsquo;/g, "'") // Right single quote
    .replace(/&lsquo;/g, "'") // Left single quote
    .replace(/&ldquo;/g, '"') // Left double quote
    .replace(/&rdquo;/g, '"'); // Right double quote
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  gameOverText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'red',
    marginBottom: 20,
  },
  questionText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  answerButton: {
    backgroundColor: '#000',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  answerText: {
    color: 'white',
    fontSize: 16,
  },
  
});

export default QuizzDialog;
