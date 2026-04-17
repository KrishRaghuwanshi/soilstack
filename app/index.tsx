import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { Colors, Fonts, Spacing } from '../lib/theme';
import { useAuthStore } from '../stores/authStore';

const { width } = Dimensions.get('window');

export default function SplashIndex() {
  const logoScale = useRef(new Animated.Value(0.3)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const taglineTranslateY = useRef(new Animated.Value(20)).current;
  const particleOpacity = useRef(new Animated.Value(0)).current;
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const role = useAuthStore((s) => s.role);

  useEffect(() => {
    // Staggered entrance animation
    Animated.sequence([
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(taglineOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(taglineTranslateY, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(particleOpacity, {
        toValue: 0.6,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate after splash
    const timer = setTimeout(() => {
      if (isAuthenticated && role) {
        router.replace(`/(${role})/home` as any);
      } else {
        router.replace('/onboarding/role');
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [isAuthenticated, role]);

  return (
    <View style={styles.container}>
      {/* Background particles */}
      <Animated.View style={[styles.particles, { opacity: particleOpacity }]}>
        {Array.from({ length: 12 }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.particle,
              {
                left: (width / 12) * i + Math.random() * 20,
                bottom: 40 + Math.random() * 200,
                width: 3 + Math.random() * 4,
                height: 3 + Math.random() * 4,
                opacity: 0.2 + Math.random() * 0.4,
              },
            ]}
          />
        ))}
      </Animated.View>

      {/* Logo */}
      <Animated.View
        style={[
          styles.logoContainer,
          {
            transform: [{ scale: logoScale }],
            opacity: logoOpacity,
          },
        ]}
      >
        <View style={styles.logoIcon}>
          <Text style={styles.logoLeaf}>🌱</Text>
          <View style={styles.soilLayers}>
            <View style={[styles.soilLayer, { backgroundColor: '#4ADE80', opacity: 0.3 }]} />
            <View style={[styles.soilLayer, { backgroundColor: '#4ADE80', opacity: 0.5 }]} />
            <View style={[styles.soilLayer, { backgroundColor: '#4ADE80', opacity: 0.8 }]} />
          </View>
        </View>
        <Text style={styles.logoText}>SoilStack</Text>
      </Animated.View>

      {/* Tagline */}
      <Animated.View
        style={{
          opacity: taglineOpacity,
          transform: [{ translateY: taglineTranslateY }],
        }}
      >
        <Text style={styles.tagline}>Turn residue into revenue</Text>
      </Animated.View>

      {/* Bottom gradient line */}
      <View style={styles.bottomLine} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  particles: {
    ...StyleSheet.absoluteFillObject,
  },
  particle: {
    position: 'absolute',
    backgroundColor: Colors.primary,
    borderRadius: 10,
  },
  logoContainer: {
    alignItems: 'center',
    gap: Spacing.lg,
  },
  logoIcon: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoLeaf: {
    fontSize: 40,
    marginBottom: -8,
  },
  soilLayers: {
    width: 56,
    gap: 3,
    marginTop: 4,
  },
  soilLayer: {
    height: 4,
    borderRadius: 2,
    width: '100%',
  },
  logoText: {
    fontFamily: Fonts.display,
    fontSize: 38,
    color: Colors.text,
    letterSpacing: -1,
  },
  tagline: {
    fontFamily: Fonts.body,
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
    letterSpacing: 0.5,
  },
  bottomLine: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: Colors.primary,
    opacity: 0.3,
  },
});
