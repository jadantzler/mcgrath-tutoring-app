import { StyleSheet, Text, View } from 'react-native';

import { STATS } from '@/constants/site-content';
import { BrandColors, Fonts, MaxContentWidth, Spacing } from '@/constants/theme';
import { useIsDesktop } from '@/hooks/use-is-desktop';

const STAT_LABEL_COLOR = '#C9BE9E';
const DISCLAIMER_COLOR = '#7C87A0';
const DIVIDER_COLOR = 'rgba(255,255,255,0.15)';

/**
 * The navy stats strip — 4 numbers in a row on desktop, 2x2 on mobile, with
 * a vertical divider between columns (skipped on the first item/column of
 * each row) and a small disclaimer underneath, exactly as in the wireframe.
 */
export function StatsSection() {
  const isDesktop = useIsDesktop();
  const columns = isDesktop ? 4 : 2;

  return (
    <View style={styles.bar}>
      <View style={styles.inner}>
        <View style={styles.grid}>
          {STATS.map((stat, index) => {
            const isFirstInRow = index % columns === 0;
            return (
              <View
                key={stat.label}
                style={[
                  styles.stat,
                  { width: `${100 / columns}%` },
                  !isFirstInRow && styles.statDivider,
                ]}
              >
                <Text style={styles.value}>{stat.value}</Text>
                <Text style={styles.label}>{stat.label}</Text>
              </View>
            );
          })}
        </View>
        <Text style={styles.disclaimer}>
          Illustrative figures — replace with McGrath Tutoring&apos;s actual track record.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: BrandColors.navy,
    paddingVertical: Spacing.five,
  },
  inner: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.four,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  stat: {
    alignItems: 'center',
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.three,
  },
  statDivider: {
    borderLeftWidth: 1,
    borderLeftColor: DIVIDER_COLOR,
  },
  value: {
    fontFamily: Fonts.serif,
    fontSize: 32,
    color: BrandColors.gold,
    marginBottom: Spacing.half,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: STAT_LABEL_COLOR,
    textAlign: 'center',
  },
  disclaimer: {
    fontSize: 11,
    textAlign: 'center',
    color: DISCLAIMER_COLOR,
    marginTop: Spacing.four,
  },
});
