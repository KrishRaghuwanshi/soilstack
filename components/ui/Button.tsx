import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import { Colors, Fonts, Radius, Sizes, Spacing } from '../../lib/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'destructive' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'lg',
  loading = false,
  disabled = false,
  icon,
  style,
  textStyle,
  fullWidth = true,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const containerStyles: ViewStyle[] = [
    styles.base,
    styles[`size_${size}`],
    styles[`variant_${variant}`],
    fullWidth && styles.fullWidth,
    isDisabled && styles.disabled,
    style as ViewStyle,
  ].filter(Boolean) as ViewStyle[];

  const textStyles: TextStyle[] = [
    styles.text,
    styles[`text_${size}`],
    styles[`textVariant_${variant}`],
    isDisabled && styles.textDisabled,
    textStyle as TextStyle,
  ].filter(Boolean) as TextStyle[];

  return (
    <TouchableOpacity
      style={containerStyles}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? Colors.textOnPrimary : Colors.primary}
          size="small"
        />
      ) : (
        <>
          {icon}
          <Text style={textStyles}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.md,
    gap: Spacing.sm,
  },
  fullWidth: {
    width: '100%',
  },

  // Sizes
  size_sm: {
    height: 36,
    paddingHorizontal: Spacing.lg,
  },
  size_md: {
    height: 44,
    paddingHorizontal: Spacing.xl,
  },
  size_lg: {
    height: Sizes.buttonHeight,
    paddingHorizontal: Spacing.xxl,
  },

  // Variants
  variant_primary: {
    backgroundColor: Colors.primary,
  },
  variant_secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  variant_destructive: {
    backgroundColor: Colors.destructive,
  },
  variant_ghost: {
    backgroundColor: 'transparent',
  },

  disabled: {
    opacity: 0.5,
  },

  // Text
  text: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 16,
    letterSpacing: 0.2,
  },
  text_sm: {
    fontSize: 13,
  },
  text_md: {
    fontSize: 14,
  },
  text_lg: {
    fontSize: 16,
  },
  textVariant_primary: {
    color: Colors.textOnPrimary,
  },
  textVariant_secondary: {
    color: Colors.primary,
  },
  textVariant_destructive: {
    color: '#fff',
  },
  textVariant_ghost: {
    color: Colors.primary,
  },
  textDisabled: {
    opacity: 0.7,
  },
});
