import { Pressable, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';

type MultiEntryListProps = {
  label: string;
  placeholder?: string;
  values: string[];
  onChange: (values: string[]) => void;
  addLabel?: string;
};

/**
 * A growable list of free-text rows — "add another school," "add another
 * tutor," anything shaped like "zero or more short text answers" rather
 * than one fixed field. Nothing else in the intake form needed this before
 * (every existing field is a single value), so unlike `FormField` and
 * `PillSelect` this doesn't yet have a second caller — it's built as its
 * own reusable component anyway, on the assumption that "list of colleges"
 * won't be the last place this shape is needed (a list of prior tutors
 * needs the exact same UI, right after this one).
 *
 * Always renders at least one row, even when `values` is empty, so there's
 * somewhere to type immediately — the caller doesn't have to seed an
 * initial `['']` itself. The remove ("×") button is hidden on a lone last
 * row rather than letting the list collapse to zero rows, since an empty
 * text input reads more clearly as "nothing entered yet" than an entirely
 * missing field would.
 */
export function MultiEntryList({
  label,
  placeholder,
  values,
  onChange,
  addLabel = '+ Add another',
}: MultiEntryListProps) {
  const theme = useTheme();
  const rows = values.length > 0 ? values : [''];

  function updateRow(index: number, text: string) {
    const next = [...rows];
    next[index] = text;
    onChange(next);
  }

  function removeRow(index: number) {
    onChange(rows.filter((_, rowIndex) => rowIndex !== index));
  }

  function addRow() {
    onChange([...rows, '']);
  }

  return (
    <View className="gap-1.5">
      <ThemedText type="smallBold">{label}</ThemedText>

      <View className="gap-2">
        {rows.map((row, index) => (
          // Index as key is safe here specifically because rows are only
          // ever appended or removed by the user, never reordered or
          // filtered based on content — the same tradeoffs that would make
          // index keys risky elsewhere don't apply to this list.
          <View key={index} className="flex-row items-center gap-2">
            <TextInput
              value={row}
              onChangeText={(text) => updateRow(index, text)}
              placeholder={placeholder}
              placeholderTextColor={theme.textSecondary}
              style={{
                flex: 1,
                borderRadius: 8,
                borderWidth: 1,
                paddingHorizontal: 12,
                paddingVertical: 10,
                fontSize: 16,
                backgroundColor: theme.backgroundElement,
                color: theme.text,
                borderColor: theme.border,
              }}
            />
            {rows.length > 1 ? (
              <Pressable
                onPress={() => removeRow(index)}
                hitSlop={8}
                accessibilityLabel={`Remove ${row || 'this entry'}`}
              >
                <ThemedText type="default" themeColor="textSecondary">
                  ×
                </ThemedText>
              </Pressable>
            ) : null}
          </View>
        ))}
      </View>

      <Pressable onPress={addRow} hitSlop={8} style={{ alignSelf: 'flex-start' }}>
        <ThemedText type="small" themeColor="primary">
          {addLabel}
        </ThemedText>
      </Pressable>
    </View>
  );
}
