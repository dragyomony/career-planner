import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {
  const router = useRouter();
  const [hasSavedResults, setHasSavedResults] = useState(false);

  useEffect(() => {
    const checkResults = async () => {
      const results = await AsyncStorage.getItem('careerResults');
      setHasSavedResults(!!results);
    };
    checkResults();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.middleSection}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/quiz')}
        >
          <Text style={styles.buttonText}>Begin Assessment</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            !hasSavedResults && styles.disabledButton,
          ]}
          onPress={() => hasSavedResults && router.push('/results')}
          disabled={!hasSavedResults}
        >
          <Text style={styles.buttonText}>Check Results</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomRow}>
        <TouchableOpacity onPress={() => router.push('/privacy')}>
          <Text style={styles.linkText}>Privacy Policy</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/terms')}>
          <Text style={styles.linkText}>Terms of Service</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
    backgroundColor: '#f8f8f8',
  },
  middleSection: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 16,
  },
  linkText: {
    fontSize: 16,
    color: '#007AFF',
  },
});
