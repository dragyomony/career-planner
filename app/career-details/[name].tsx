import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function CareerDetails() {
  const router = useRouter();
  const { name } = useLocalSearchParams(); // this is the career ID passed in URL
  const [career, setCareer] = useState<any>(null);

  useEffect(() => {
    // Placeholder data for now — replace with AI-generated result later
    const mockData = {
      title: formatCareerTitle(name?.toString() || ''),
      description:
        'This is a sample career description. In production, Gemini Flash will provide this based on quiz results.',
      salary: '$65,000/year (estimated average)',
      education: 'Bachelor’s Degree in a related field',
      medical: 'Low physical strain, flexible schedule available',
      growth: 'High demand with remote options',
    };
    setCareer(mockData);
  }, [name]);

  const formatCareerTitle = (slug: string) => {
    return slug
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  if (!career) return null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backLink}>Back</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>{career.title}</Text>

        <Text style={styles.label}>Description:</Text>
        <Text style={styles.text}>{career.description}</Text>

        <Text style={styles.label}>Average Salary:</Text>
        <Text style={styles.text}>{career.salary}</Text>

        <Text style={styles.label}>Education Required:</Text>
        <Text style={styles.text}>{career.education}</Text>

        <Text style={styles.label}>Medical Concerns:</Text>
        <Text style={styles.text}>{career.medical}</Text>

        <Text style={styles.label}>Career Progression:</Text>
        <Text style={styles.text}>{career.growth}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scroll: { padding: 16, paddingBottom: 100 },
  headerRow: { alignItems: 'flex-start' },
  backLink: { color: '#007AFF', fontSize: 16, fontWeight: '600' },
  title: { fontSize: 24, fontWeight: 'bold', marginVertical: 20 },
  label: { fontSize: 18, fontWeight: '600', marginTop: 16 },
  text: { fontSize: 16, marginTop: 4 },
});
