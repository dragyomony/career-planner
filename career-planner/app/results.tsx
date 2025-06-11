import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ResultsScreen() {
  const router = useRouter();
  const [mbtiType, setMbtiType] = useState('');
  const [learningStyles, setLearningStyles] = useState<string[]>([]);
  const [careers, setCareers] = useState<any[]>([]);

  useEffect(() => {
    const processResults = async () => {
      const raw = await AsyncStorage.getItem('quizAnswers');
      if (!raw) {
        Alert.alert('No results found.');
        return;
      }

      const answers: number[] = JSON.parse(raw);

      // MBTI calculation
      const dichotomies = [
        { A: [0,1,2,3,4,5,6,7,8,9,40,41,50,51,56], label: ['E', 'I'] },
        { A: [10,11,12,13,14,15,16,17,18,19,42,43,52,53,59], label: ['N', 'S'] },
        { A: [20,21,22,23,24,25,26,27,28,29,44,45,54,55,58], label: ['T', 'F'] },
        { A: [30,31,32,33,34,35,36,37,38,39,46,47,48,49,57], label: ['J', 'P'] },
      ];

      let type = '';
      for (const pair of dichotomies) {
        const sum = pair.A.map(i => answers[i] || 0).reduce((a, b) => a + b, 0);
        type += sum > (pair.A.length * 3) ? pair.label[0] : pair.label[1];
      }
      setMbtiType(type);

      // Learning style scoring
      const scores = {
        Visual: answers[60] + answers[61],
        Auditory: answers[62] + answers[63],
        'Reading/Writing': answers[64] + answers[65],
        Kinesthetic: answers[66] + answers[67],
      };

      const sortedStyles = Object.entries(scores)
        .sort((a, b) => b[1] - a[1])
        .map(([style]) => style);

      setLearningStyles(sortedStyles);

      // Webhook call to Gemini
      const payload = {
        MBTI: type,
        LearningStyles: sortedStyles,
        Interests: [], // add if available
        WorkPreferences: [], // add if available
        Demographics: {}, // optional
      };

      try {
        const response = await fetch('https://chaotic-careers.loca.lt/webhook/generate-careers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': 'chaotic-careers-1234',
          },
          body: JSON.stringify(payload),
        });

        const data = await response.json();
        setCareers(data.careers || []);
      } catch (err) {
        console.error('Failed to fetch careers:', err);
        Alert.alert('Unable to fetch career matches.');
      }
    };

    processResults();
  }, []);

  const saveResults = async () => {
    const data = { mbtiType, learningStyles, careers };
    await AsyncStorage.setItem('careerResults', JSON.stringify(data));
    Alert.alert('Results saved!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.push('/')}>
            <Text style={styles.homeLink}>Home</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>Your MBTI Type: {mbtiType}</Text>

        <Text style={styles.title}>Top Learning Styles:</Text>
        {learningStyles.map((style, index) => (
          <Text key={style} style={styles.text}>{index + 1}. {style}</Text>
        ))}

        <Text style={styles.title}>Recommended Careers:</Text>
        {careers.map((career, index) => (
          <View key={career.id} style={styles.careerRow}>
            <Text style={styles.text}>{index + 1}. {career.title}</Text>
            <TouchableOpacity
              style={styles.detailsButton}
              onPress={() => router.push(`/career-details/${career.id}`)}
            >
              <Text style={styles.detailsText}>Details</Text>
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity style={styles.saveButton} onPress={saveResults}>
          <Text style={styles.saveText}>Save Results</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scroll: { padding: 16, paddingBottom: 100 },
  headerRow: { alignItems: 'flex-end' },
  homeLink: { color: '#007AFF', fontSize: 16, fontWeight: '600' },
  title: { fontSize: 20, fontWeight: 'bold', marginTop: 20 },
  text: { fontSize: 16, marginVertical: 4 },
  careerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 6,
  },
  detailsButton: {
    backgroundColor: '#eee',
    padding: 8,
    borderRadius: 8,
  },
  detailsText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 32,
  },
  saveText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
