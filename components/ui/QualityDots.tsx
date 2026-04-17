import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../../lib/theme';

interface QualityDotsProps {
  score: number; // 1-5
  size?: number;
}

export function QualityDots({ score, size = 10 }: QualityDotsProps) {
  return (
    <View style={styles.container}>
      {[1, 2, 3, 4, 5].map((i) => (
        <View
          key={i}
          style={[
            styles.dot,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: i <= score ? Colors.primary : 'rgba(255,255,255,0.15)',
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  dot: {},
});
