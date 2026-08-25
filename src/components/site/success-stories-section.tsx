import { Quote } from 'lucide-react-native';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { STORIES } from '@/constants/site-content';
import { BrandColors, Fonts, MaxContentWidth, Spacing } from '@/constants/theme';

const CARD_BORDER = '#E9E4D8';
const QUOTE_COLOR = '#EFEBE0';
const DISCLAIMER_COLOR = '#9B9588';

const CARD_WIDTH = 320;
const CARD_GAP = Spacing.four;

// One full pass through the story list, cards plus the gaps between them —
// the exact distance the row has to travel before the second (duplicate)
// copy lines up where the first copy started, so the loop can snap back to
// 0 with no visible seam. See the file-level comment below for why this can
// be computed instead of measured.
const SET_WIDTH = STORIES.length * (CARD_WIDTH + CARD_GAP);

// Scroll speed, in pixels per second — the duration of one loop is derived
// from this rather than hardcoded, so the animation covers the same visual
// speed no matter how many cards end up in the list.
const PIXELS_PER_SECOND = 40;
const LOOP_DURATION_MS = (SET_WIDTH / PIXELS_PER_SECOND) * 1000;

/**
 * "Success Stories" — a continuous marquee. The row renders the story list
 * twice back to back and animates it leftward by exactly one copy's width,
 * on an infinite loop; because the second copy is identical to the first,
 * the instant one pass finishes the layout is indistinguishable from where
 * it started, so the loop can restart with no visible jump. This is the
 * standard trick behind marquee/ticker UI generally — duplicate the
 * content, scroll by one copy's width, snap, repeat.
 *
 * The animation itself runs via `react-native-reanimated`'s shared values,
 * which update on the UI thread rather than through React state/re-renders
 * — necessary here since the position changes every frame, indefinitely,
 * for as long as the section is on screen.
 *
 * Card size is fixed (`CARD_WIDTH`) rather than responsive, which is what
 * lets `SET_WIDTH` be computed up front from constants instead of measured
 * from a live layout via `onLayout` — simpler, and avoids a brief
 * "unmeasured" frame before the animation can start. A variable-width
 * version would need the `onLayout` approach instead.
 */
export function SuccessStoriesSection() {
  const translateX = useSharedValue(0);

  useEffect(() => {
    translateX.value = withRepeat(
      withTiming(-SET_WIDTH, { duration: LOOP_DURATION_MS, easing: Easing.linear }),
      -1, // repeat forever
      false, // don't reverse — snap back to the start and go again
    );
  }, [translateX]);

  const rowStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  // Rendered twice, back to back — see the component doc comment above.
  const loopedStories = [...STORIES, ...STORIES];

  return (
    <View style={styles.container}>
      <View style={styles.heading}>
        <Text style={styles.headingText}>Success Stories</Text>
        <View style={styles.underline} />
      </View>

      <View style={styles.marqueeViewport}>
        <Animated.View style={[styles.marqueeRow, rowStyle]}>
          {loopedStories.map((story, i) => (
            <View key={`${story.name}-${i}`} style={styles.card}>
              <Quote size={22} color={BrandColors.gold} style={styles.quoteIcon} />
              <Text style={styles.quote}>&quot;{story.quote}&quot;</Text>
              <View style={styles.cardFooter}>
                <Text style={styles.name}>{story.name}</Text>
                <Text style={styles.detail}>{story.detail}</Text>
              </View>
            </View>
          ))}
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.six,
  },
  heading: {
    alignItems: 'center',
    marginBottom: Spacing.five,
  },
  headingText: {
    fontFamily: Fonts.serif,
    fontSize: 28,
    color: BrandColors.navy,
    marginBottom: Spacing.two,
  },
  underline: {
    width: 56,
    height: 3,
    backgroundColor: BrandColors.gold,
  },
  // `overflow: 'hidden'` is what makes this a "viewport" — the row inside
  // it is much wider than the screen, but only what fits here is visible;
  // everything else is clipped rather than causing horizontal page scroll.
  marqueeViewport: {
    width: '100%',
    overflow: 'hidden',
  },
  marqueeRow: {
    flexDirection: 'row',
    gap: CARD_GAP,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: BrandColors.white,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    borderRadius: Spacing.four,
    padding: Spacing.four,
  },
  quoteIcon: {
    marginBottom: Spacing.two,
  },
  quote: {
    fontSize: 14,
    lineHeight: 21,
    fontStyle: 'italic',
    color: BrandColors.charcoal,
    marginBottom: Spacing.three,
  },
  cardFooter: {
    paddingTop: Spacing.three,
    borderTopWidth: 1,
    borderTopColor: QUOTE_COLOR,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: BrandColors.navy,
  },
  detail: {
    fontSize: 12,
    fontWeight: '600',
    color: BrandColors.deepGreen,
    marginTop: 2,
  },
  disclaimer: {
    fontSize: 11,
    textAlign: 'center',
    color: DISCLAIMER_COLOR,
    marginTop: Spacing.four,
  },
});
