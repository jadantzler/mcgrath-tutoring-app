import { Pressable, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { SelectedIndicator } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { AvailabilitySlot, DAYS_OF_WEEK, IntakeFormData, TIME_BLOCKS } from '@/types/intake';

type AvailabilityStepProps = {
  value: IntakeFormData['availability'];
  onChange: (value: IntakeFormData['availability']) => void;
};

/**
 * A minimal Mon–Sun x Morning/Afternoon/Evening grid: tap a cell to toggle it.
 *
 * This is intentionally the simplest version that satisfies "pick some
 * availability" — story "Build structured availability picker" (Feature 1,
 * story 5) is where this gets real design attention (better mobile layout,
 * maybe drag-to-select). Building the full version here would mean
 * re-touching this file again once that story starts; better to ship a
 * working placeholder now and let that story replace it deliberately.
 */
export function AvailabilityStep({ value, onChange }: AvailabilityStepProps) {
  const theme = useTheme();

  function toggleSlot(slot: AvailabilitySlot) {
    const next = new Set(value);
    if (next.has(slot)) {
      next.delete(slot);
    } else {
      next.add(slot);
    }
    onChange(next);
  }

  return (
    <View className="gap-3">
      <ThemedText type="smallBold">When is the student generally available? *</ThemedText>
      <View className="gap-2">
        {DAYS_OF_WEEK.map((day) => (
          <View key={day} className="flex-row items-center gap-2">
            <ThemedText type="small" style={{ width: 36 }}>
              {day}
            </ThemedText>
            <View className="flex-1 flex-row gap-2">
              {TIME_BLOCKS.map((block) => {
                const slot: AvailabilitySlot = `${day}-${block}`;
                const selected = value.has(slot);
                return (
                  <Pressable
                    key={block}
                    onPress={() => toggleSlot(slot)}
                    style={{
                      flex: 1,
                      alignItems: 'center',
                      borderRadius: 8,
                      borderWidth: 1,
                      paddingHorizontal: 8,
                      paddingVertical: 10,
                      borderColor: selected ? SelectedIndicator.background : theme.border,
                      backgroundColor: selected ? SelectedIndicator.background : 'transparent',
                    }}
                  >
                    <ThemedText
                      type="small"
                      style={{ color: selected ? SelectedIndicator.foreground : theme.text }}
                    >
                      {block}
                    </ThemedText>
                  </Pressable>
                );
              })}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

export function isAvailabilityStepValid(value: IntakeFormData['availability']): boolean {
  return value.size > 0;
}
