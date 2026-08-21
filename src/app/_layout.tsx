import { DarkTheme, DefaultTheme, Stack, ThemeProvider, usePathname } from 'expo-router';
import { StyleSheet, useColorScheme, View } from 'react-native';

import { SiteFooter } from '@/components/site/site-footer';
import { SiteHeader } from '@/components/site/site-header';
import { useTheme } from '@/hooks/use-theme';

// Routes that hide the footer — currently just the intake form, so the
// multi-step wizard has nothing competing for attention below the fold.
const HIDE_FOOTER_ON = ['/intake'];

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = useTheme();
  const pathname = usePathname();
  const showFooter = !HIDE_FOOTER_ON.includes(pathname);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <View style={[styles.root, { backgroundColor: theme.background }]}>
        <SiteHeader />
        <View style={styles.content}>
          <Stack screenOptions={{ headerShown: false }} />
        </View>
        {showFooter ? <SiteFooter /> : null}
      </View>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
