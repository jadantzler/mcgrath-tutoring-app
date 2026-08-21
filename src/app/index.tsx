import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';

import { FinalCtaSection } from '@/components/site/final-cta-section';
import { HeroSection } from '@/components/site/hero-section';
import { StatsSection } from '@/components/site/stats-section';
import { SuccessStoriesSection } from '@/components/site/success-stories-section';
import { WhyUsSection } from '@/components/site/why-us-section';
import { ThemedView } from '@/components/themed-view';

/**
 * The homepage, rebuilt to port the approved wireframe section-for-section:
 * hero → "What We Offer" → stats strip → "Success Stories" → final CTA.
 * Each section is its own component (see `src/components/site/`) — this
 * file's job is just composing them in order and wiring the two CTAs to
 * `/intake` instead of the wireframe's demo toast.
 *
 * Content lives inside a `ScrollView`, same as `intake.tsx` — Expo's web
 * build sets `body { overflow: hidden }` (it expects every screen to
 * manage its own scrolling internally, the way a native screen would,
 * rather than relying on normal document scroll), so a page this much
 * taller than the viewport needs its own scroll container or everything
 * past the first screenful is simply unreachable.
 *
 * `nativeID` on the "Why Us"/"Success Stories"/final-CTA wrappers is what
 * the header's anchor links scroll to — react-native-web turns `nativeID`
 * into the DOM `id` attribute, which is exactly what `scrollToSection`
 * (see `src/lib/scroll-to-section.ts`) looks up.
 */
export default function HomeScreen() {
  const router = useRouter();

  function goToIntake() {
    router.push('/intake');
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <HeroSection onGetStarted={goToIntake} />

        <View nativeID="why-us">
          <WhyUsSection />
        </View>

        <StatsSection />

        <View nativeID="success-stories">
          <SuccessStoriesSection />
        </View>

        <View nativeID="contact">
          <FinalCtaSection onGetStarted={goToIntake} />
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
