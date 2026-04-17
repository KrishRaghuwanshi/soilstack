import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, type ViewStyle, type KeyboardTypeOptions } from 'react-native';
import { Colors, Fonts, Radius, Sizes, Spacing } from '../../lib/theme';

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: KeyboardTypeOptions;
  secureTextEntry?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  maxLength?: number;
  error?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  style?: ViewStyle;
  editable?: boolean;
}

export function Input({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType = 'default',
  secureTextEntry = false,
  multiline = false,
  numberOfLines = 1,
  maxLength,
  error,
  prefix,
  suffix,
  style,
  editable = true,
}: InputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.wrapper, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.container,
          focused && styles.focused,
          error && styles.error,
          multiline && styles.multiline,
        ]}
      >
        {prefix}
        <TextInput
          style={[
            styles.input,
            multiline && { height: numberOfLines * 24, textAlignVertical: 'top' },
          ]}
          placeholder={placeholder}
          placeholderTextColor={Colors.textTertiary}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          multiline={multiline}
          numberOfLines={numberOfLines}
          maxLength={maxLength}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          editable={editable}
          selectionColor={Colors.primary}
        />
        {suffix}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: Spacing.xs + 2,
  },
  label: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 13,
    color: Colors.textSecondary,
    letterSpacing: 0.2,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: Radius.md,
    height: Sizes.inputHeight,
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  focused: {
    borderColor: Colors.primary,
    backgroundColor: Colors.surface,
  },
  error: {
    borderColor: Colors.destructive,
  },
  multiline: {
    height: 'auto',
    minHeight: Sizes.inputHeight,
    paddingVertical: Spacing.md,
    alignItems: 'flex-start',
  },
  input: {
    flex: 1,
    fontFamily: Fonts.body,
    fontSize: 16,
    color: Colors.text,
    height: '100%',
  },
  errorText: {
    fontFamily: Fonts.body,
    fontSize: 12,
    color: Colors.destructive,
  },
});
