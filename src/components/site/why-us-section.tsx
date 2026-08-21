import { StyleSheet, Text, View } from 'react-native';

import { PILLARS } from '@/constants/site-content';
import { BrandColors, Fonts, MaxContentWidth, Spacing } from '@/constants/theme';
import { useIsDesktop } from '@/hooks/use-is-desktop';

const CARD_BORDER = '#E9E4D8';
const CARD_BODY_COLOR = '#6B6558';

/**
 * "What We Offer" — three pillar cards (test strategy, subject tutoring,
 * one-on-one plans). React Native has no CSS grid, so the 1-column vs.
 * 3-column layout the wireframe gets from `grid sm:grid-cols-3` is done
 * here with `useWindowDimensions()` + flex-wrap instead: each card is 100%
 * wide under the breakpoint, ~31% (three per row, with gaps) at or above it.
 */
export function WhyUsSection() {
  const isDesktop = useIsDesktop();

  return (
    <View style={styles.container}>
      <View style={styles.heading}>
        <Text style={styles.headingText}>What We Offer</Text>
        <View style={styles.underline} />
      </View>

      <View style={styles.grid}>
        {PILLARS.map((pillar) => {
          const Icon = pillar.icon;
          return (
            <View key={pillar.title} style={[styles.card, isDesktop && styles.cardDesktop]}>
              <View style={styles.iconBadge}>
                <Icon size={20} color={BrandColors.white} />
              </View>
              <Text style={styles.cardTitle}>{pillar.title}</Text>
              <Text style={styles.cardBody}>{pillar.body}</Text>
            </View>
          );
        })}
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Spacing.four,
  },
  card: {
    width: '100%',
    backgroundColor: BrandColors.white,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    borderRadius: Spacing.four,
    padding: Spacing.four,
  },
  cardDesktop: {
    width: '31%',
    minWidth: 220,
  },
  iconBadge: {
    width: 44,
    height: 44,
    borderRadius: Spacing.three,
    backgroundColor: BrandColors.navy,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.three,
  },
  cardTitle: {
    fontFamily: Fonts.serif,
    fontSize: 18,
    color: BrandColors.navy,
    marginBottom: Spacing.two,
  },
  cardBody: {
    fontSize: 14,
    lineHeight: 21,
    color: CARD_BODY_COLOR,
  },
});
