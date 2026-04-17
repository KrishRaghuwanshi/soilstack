import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Fonts, Radius, Spacing, StatusConfig } from '../../lib/theme';

interface BadgeProps {
  label: string;
  color?: string;
  bg?: string;
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
}

export function Badge({ label, color, bg, size = 'sm', icon }: BadgeProps) {
  return (
    <View
      style={[
        styles.base,
        size === 'md' && styles.sizeMd,
        { backgroundColor: bg || Colors.primaryBg },
      ]}
    >
      {icon}
      <Text
        style={[
          styles.text,
          size === 'md' && styles.textMd,
          { color: color || Colors.primary },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const config = StatusConfig[status] || StatusConfig.draft;
  return <Badge label={config.label} color={config.color} bg={config.bg} />;
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.pill,
    alignSelf: 'flex-start',
    gap: 4,
  },
  sizeMd: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
  },
  text: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 11,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  textMd: {
    fontSize: 12,
  },
});
