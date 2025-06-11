import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';

const mbtiQuestions = [
  // E/I Q1–10
  'I feel energized when meeting new people.',
  'I enjoy starting conversations with strangers.',
  'Being around lots of people energizes me.',
  'I prefer working in a bustling, active environment.',
  'I find it easy to talk to strangers.',
  'I enjoy attending big social gatherings.',
  'I get excited about trying new group activities.',
  'I feel bored when spending too much time alone.',
  'I prefer speaking up in group discussions.',
  'I would enjoy being the center of attention at a party.',
  // N/S Q11–20
  'I enjoy thinking about possibilities for the future.',
  'I prefer exploring complex theories over simple facts.',
  'I trust my gut feelings about situations.',
  'I am drawn to abstract ideas and concepts.',
  'I like questioning traditional ways of doing things.',
  'I enjoy philosophical discussions about life.',
  'I focus more on what could happen than what is happening.',
  'I prefer imagining creative solutions over following proven ones.',
  'I appreciate art, poetry, and creative expression.',
  'I often come up with new ideas during routine tasks.',
  // T/F Q21–30
  'I make decisions based on logic more than feelings.',
  'I value being fair and just, even over kindness.',
  'I prefer to focus on tasks rather than people.',
  'I feel comfortable giving critical feedback.',
  'I believe truth is more important than tact.',
  'I value competence more than empathy.',
  'I find emotional situations uncomfortable.',
  'I enjoy debating different points of view.',
  'I focus on what’s right rather than what feels good.',
  'I often notice flaws in arguments or systems.',
  // J/P Q31–40
  'I like having a clear schedule or plan.',
  'I make decisions quickly and stick to them.',
  'I feel more comfortable when things are settled.',
  'I enjoy setting goals and completing them.',
  'I like routines and predictability.',
  'I feel stressed when plans change unexpectedly.',
  'I often prepare well in advance.',
  'I prefer organized spaces over messy ones.',
  'I like having closure in decisions.',
  'I enjoy making to-do lists and checking them off.',
  // Tie-breakers Q41–60
  'I am energized by social interactions.',
  'I dislike long periods of solitude.',
  'I enjoy interpreting metaphors and symbols.',
  'I prefer using imagination over observing facts.',
  'I prioritize efficiency over harmony.',
  'I tend to analyze rather than empathize.',
  'I get satisfaction from closure.',
  'I prefer certainty over spontaneity.',
  'I organize tasks before jumping in.',
  'I enjoy finalizing things early.',
  'I initiate conversations in social settings.',
  'I prefer engaging groups over quiet settings.',
  'I look for patterns more than details.',
  'I tend to ask “what if” often.',
  'I question emotional reactions.',
  'I analyze motives more than sympathize.',
  'I find peace in order and planning.',
  'I’m not easily swayed by emotions.',
  'I enjoy performing for others.',
  'I prefer future-focused thinking.',
];

const learningStyleQuestions = [
  'I remember best by drawing or visualizing information.',
  'I use diagrams, charts, and maps to understand ideas.',
  'I understand best when I hear explanations or instructions.',
  'I prefer listening to lectures or discussions.',
  'I learn best when I read and write about a topic.',
  'I prefer to take notes and review written materials.',
  'I need to physically engage with tasks to learn well.',
  'I understand things best when I can try them out myself.',
];

export default function QuizScreen() {
  const router = useRouter();
  const totalQuestions = mbtiQuestions.length + learningStyleQuestions.length;
  const [answers, setAnswers] = useState<number[]>(Array(totalQuestions).fill(0));

  const handleSelect = (index: number, value: number) => {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  };

  const isComplete = answers.every((a) => a > 0);

  const submitQuiz = () => {
    if (!isComplete) {
      Alert.alert('Please answer all questions before submitting.');
      return;
    }

    // scoring logic here — simplified for now
    const results = {
      mbtiAnswers: answers.slice(0, 60),
      learningAnswers: answers.slice(60),
    };

    // store results locally to simulate saved state
    import('@react-native-async-storage/async-storage').then(({ default: AsyncStorage }) => {
      AsyncStorage.setItem('quizAnswers', JSON.stringify(answers));
      AsyncStorage.setItem('careerResults', JSON.stringify(results));
      router.push('/results');
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.push('/')}>
            <Text style={styles.homeLink}>Home</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>MBTI & Learning Style Quiz</Text>

        {mbtiQuestions.map((q, i) => (
          <View key={`q${i}`} style={styles.questionBlock}>
            <Text style={styles.question}>{`Q${i + 1}. ${q}`}</Text>
            <View style={styles.optionsRow}>
              {[1, 2, 3, 4, 5].map((val) => (
                <TouchableOpacity
                  key={val}
                  style={[
                    styles.option,
                    answers[i] === val && styles.selectedOption,
                  ]}
                  onPress={() => handleSelect(i, val)}
                >
                  <Text style={styles.optionText}>{val}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        <Text style={styles.title}>Learning Style Questions</Text>

        {learningStyleQuestions.map((q, i) => (
          <View key={`lq${i}`} style={styles.questionBlock}>
            <Text style={styles.question}>{`Q${60 + i + 1}. ${q}`}</Text>
            <View style={styles.optionsRow}>
              {[1, 2, 3, 4, 5].map((val) => (
                <TouchableOpacity
                  key={val}
                  style={[
                    styles.option,
                    answers[60 + i] === val && styles.selectedOption,
                  ]}
                  onPress={() => handleSelect(60 + i, val)}
                >
                  <Text style={styles.optionText}>{val}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.submitButton} onPress={submitQuiz}>
          <Text style={styles.submitText}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scroll: { padding: 16, paddingBottom: 100 },
  headerRow: {
