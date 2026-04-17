import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Colors, Fonts, Spacing, Radius } from '../../lib/theme';
import { useAuthStore } from '../../stores/authStore';

const roles = [
  {
    key: 'farmer' as const,
    icon: 'sun',
    title: 'Farmer',
    description: 'Make biochar. Join campaigns. Earn carbon credit payments.',
    color: Colors.primary,
  },
  {
    key: 'buyer' as const,
    icon: 'briefcase',
    title: 'Company',
    description: 'Launch carbon insetting campaigns. Verify and fund farmers.',
    color: Colors.tertiary,
  },
  {
    key: 'validator' as const,
    icon: 'eye',
    title: 'Authority',
    description: 'Oversee all campaigns. Audit verified submissions. Full transparency.',
    color: Colors.secondary,
  },
];

export default function RoleScreen() {
  const { loginAsFarmer, loginAsValidator, loginAsBuyer } = useAuthStore();

  const handleRoleSelect = (role: 'farmer' | 'validator' | 'buyer') => {
    if (role === 'farmer') {
      loginAsFarmer();
      router.replace('/(farmer)/home' as any);
    } else if (role === 'buyer') {
      loginAsBuyer();
      router.replace('/(buyer)/market' as any);
    } else {
      loginAsValidator();
      router.replace('/(validator)/jobs' as any);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.logoText}>SoilStack</Text>
          <Text style={styles.subtitle}>Select your role to continue</Text>
        </View>

        <View style={styles.cards}>
          {roles.map((role) => (
            <TouchableOpacity
              key={role.key}
              style={styles.card}
              onPress={() => handleRoleSelect(role.key)}
              activeOpacity={0.85}
            >
              <View style={[styles.iconContainer, { backgroundColor: `${role.color}15` }]}>
                <Feather name={role.icon as any} size={24} color={role.color} />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{role.title}</Text>
                <Text style={styles.cardDesc}>{role.description}</Text>
              </View>
              <Feather name="chevron-right" size={20} color={Colors.textTertiary} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By continuing, you agree to our Terms of Service
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  content: { flex: 1, paddingHorizontal: Spacing.xl, justifyContent: 'center' },
  header: { marginBottom: Spacing.xxxl + 8 },
  logoText: {
    fontFamily: Fonts.display, fontSize: 32, color: Colors.text,
    letterSpacing: -0.5, marginBottom: Spacing.sm,
  },
  subtitle: { fontFamily: Fonts.body, fontSize: 16, color: Colors.textSecondary },
  cards: { gap: Spacing.md },
  card: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.card,
    borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.lg,
    padding: Spacing.xl, gap: Spacing.lg,
  },
  iconContainer: {
    width: 48, height: 48, borderRadius: Radius.md,
    justifyContent: 'center', alignItems: 'center',
  },
  cardContent: { flex: 1, gap: 4 },
  cardTitle: { fontFamily: Fonts.bodySemiBold, fontSize: 18, color: Colors.text },
  cardDesc: { fontFamily: Fonts.body, fontSize: 13, color: Colors.textSecondary, lineHeight: 18 },
  footer: { marginTop: Spacing.xxxl + 16, alignItems: 'center' },
  footerText: { fontFamily: Fonts.body, fontSize: 12, color: Colors.textTertiary, textAlign: 'center' },
});
