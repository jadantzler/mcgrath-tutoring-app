import { ArrowRight } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from 'react-native';

import { BrandColors, Spacing } from '@/constants/theme';

type CTAButtonProps = {
  children: string;
  size?: 'md' | 'lg';
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};

/**
 * The wireframe's one recurring call-to-action: a gold, fully-rounded pill
 * with a trailing arrow. It shows up four times (header, hero, final CTA,
 * mobile menu) with only the size changing — pulling it into one component
 * here means those four call sites can't drift out of sync the way four
 * copy-pasted buttons eventually would.
 */
export function CTAButton({ children, size = 'md', onPress, style }: CTAButtonProps) {
  const isLarge = size === 'lg';

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        isLarge ? styles.buttonLarge : styles.buttonMedium,
        pressed && styles.pressed,
        style,
      ]}
    >
      <Text style={[styles.label, isLarge ? styles.labelLarge : styles.labelMedium]}>
        {children}
      </Text>
      <ArrowRight size={isLarge ? 18 : 15} color={BrandColors.white} strokeWidth={2.5} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    borderRadius: 999,
    backgroundColor: BrandColors.gold,
    alignSelf: 'flex-start',
  },
  buttonMedium: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two + 4,
  },
  buttonLarge: {
    paddingHorizontal: Spacing.five,
    paddingVertical: Spacing.three,
  },
  pressed: {
    opacity: 0.85,
  },
  label: {
    fontWeight: '700',
    color: BrandColors.white,
  },
  labelMedium: {
    fontSize: 14,
  },
  labelLarge: {
    fontSize: 16,
  },
});
