import { View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

type StepProgressBarProps = {
  stepLabels: readonly string[];
  currentStepIndex: number;
};

export function StepProgressBar({ stepLabels, currentStepIndex }: StepProgressBarProps) {
  return (
    <View className="gap-2">
      <View className="flex-row gap-1.5">
        {stepLabels.map((label, index) => (
          <View
            key={label}
            className={`h-1.5 flex-1 rounded-full ${
              index <= currentStepIndex ? 'bg-gold' : 'bg-charcoal/15'
            }`}
          />
        ))}
      </View>
      <ThemedText type="small" themeColor="textSecondary">
        Step {currentStepIndex + 1} of {stepLabels.length}: {stepLabels[currentStepIndex]}
      </ThemedText>
    </View>
  );
}
