import { Quote } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import { STORIES } from '@/constants/site-content';
import { BrandColors, Fonts, MaxContentWidth, Spacing } from '@/constants/theme';
import { useIsDesktop } from '@/hooks/use-is-desktop';

const CARD_BORDER = '#E9E4D8';
const QUOTE_COLOR = '#EFEBE0';
const DISCLAIMER_COLOR = '#9B9588';

/**
 * "Success Stories" — three testimonial cards, same 1-column/3-column
 * responsive approach as `WhyUsSection`. Each card: a quote icon, italic
 * quote, then a divider line above the name and result detail.
 */
export function SuccessStoriesSection() {
  const isDesktop = useIsDesktop();

  return (
    <View style={styles.container}>
      <View style={styles.heading}>
        <Text style={styles.headingText}>Success Stories</Text>
        <View style={styles.underline} />
      </View>

      <View style={styles.grid}>
        {STORIES.map((story) => (
          <View key={story.name} style={[styles.card, isDesktop && styles.cardDesktop]}>
            <Quote size={22} color={BrandColors.gold} style={styles.quoteIcon} />
            <Text style={styles.quote}>&quot;{story.quote}&quot;</Text>
            <View style={styles.cardFooter}>
              <Text style={styles.name}>{story.name}</Text>
              <Text style={styles.detail}>{story.detail}</Text>
            </View>
          </View>
        ))}
      </View>

      <Text style={styles.disclaimer}>
        Sample stories for wireframe purposes — swap in real, permissioned testimonials before
        launch.
      </Text>
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
  quoteIcon: {
    marginBottom: Spacing.two,
  },
  quote: {
    fontSize: 14,
    lineHeight: 21,
    fontStyle: 'italic',
    color: BrandColors.charcoal,
    marginBottom: Spacing.three,
    flexGrow: 1,
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
