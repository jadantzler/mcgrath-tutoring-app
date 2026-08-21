import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';

/**
 * Placeholder so the consent step's link has somewhere real to go. The
 * actual policy text is its own story ("Build Privacy Policy page", plus
 * attorney review before launch) — this just holds the route.
 */
export default function PrivacyPolicyScreen() {
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedText type="title" style={styles.title}>
          Privacy Policy
        </ThemedText>
        <ThemedText type="default" themeColor="textSecondary" style={styles.body}>
          This page is a placeholder. The full Privacy Policy — covering what information we collect
          about students and guardians, how it&apos;s stored, and how it&apos;s used — is being
          drafted and will be reviewed by an attorney before launch.
        </ThemedText>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.six,
    gap: Spacing.three,
    maxWidth: MaxContentWidth,
  },
  title: {
    fontFamily: 'serif',
  },
  body: {
    lineHeight: 24,
  },
});
