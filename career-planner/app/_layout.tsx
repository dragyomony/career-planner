import { ExpoRoot } from 'expo-router';
import Constants from 'expo-constants';

export default function AppLayout() {
  const basename = Constants.expoConfig?.extra?.router?.basename ?? '/';

  return <ExpoRoot context={{ basename }} />;
}
