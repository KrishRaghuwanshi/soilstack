import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors, Fonts, Spacing, Radius } from '../../lib/theme';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { useBuyerStore } from '../../stores/buyerStore';
import { useAuthStore } from '../../stores/authStore';

export default function DashboardScreen() {
  const { company, campaigns, credits, loadMockData } = useBuyerStore();
  const profile = useAuthStore((s) => s.profile);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => { loadMockData(); }, []);

  const totalTonnes = credits.reduce((sum, c) => sum + c.tonnes, 0);
  const totalSpent = credits.reduce((sum, c) => sum + (c.price_usd || 0) * c.tonnes, 0);
  const carsEquiv = Math.round(totalTonnes * 0.22);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Dashboard</Text>
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => { logout(); router.replace('/onboarding/role'); }}
        >
          <Feather name="log-out" size={18} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Impact Hero */}
      <Card variant="elevated" style={styles.heroCard}>
        <Text style={styles.heroLabel}>Total Impact</Text>
        <Text style={styles.heroValue}>{totalTonnes.toFixed(1)}t</Text>
        <Text style={styles.heroSub}>CO₂ removed through your campaigns</Text>

        <View style={styles.equivRow}>
          <View style={styles.equiv}>
            <Text style={styles.equivIcon}>🚗</Text>
            <Text style={styles.equivText}>= {carsEquiv} cars off road for 1 year</Text>
          </View>
        </View>
      </Card>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <Card style={styles.stat}>
          <Text style={styles.statValue}>{campaigns.length}</Text>
          <Text style={styles.statLabel}>Campaigns</Text>
        </Card>
        <Card style={styles.stat}>
          <Text style={styles.statValue}>${totalSpent.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Invested</Text>
        </Card>
        <Card style={styles.stat}>
          <Text style={styles.statValue}>{credits.length}</Text>
          <Text style={styles.statLabel}>Credits</Text>
        </Card>
      </View>

      {/* Verified Credits */}
      <Text style={styles.sectionTitle}>Verified Credits</Text>
      {credits.map((credit) => {
        const date = new Date(credit.issued_at).toLocaleDateString('en-US', {
          day: 'numeric', month: 'short', year: 'numeric',
        });

        return (
          <Card key={credit.id} style={styles.creditCard}>
            <View style={styles.creditHeader}>
              <View>
                <Text style={styles.creditDate}>{date}</Text>
                <Text style={styles.creditTonnes}>{credit.tonnes}t CO₂</Text>
              </View>
              <Badge
                label={credit.carbon_tier || 'standard'}
                color={credit.carbon_tier === 'ultra' ? Colors.primary : Colors.tertiary}
                bg={credit.carbon_tier === 'ultra' ? Colors.primaryBg : Colors.tertiaryBg}
              />
            </View>
            <View style={styles.hashRow}>
              <Text style={styles.hashText}>{credit.credit_hash.slice(0, 24)}...</Text>
              <Feather name="copy" size={14} color={Colors.textTertiary} />
            </View>
          </Card>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  content: { paddingTop: 60, paddingBottom: 100, paddingHorizontal: Spacing.xl },

  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.xl },
  title: { fontFamily: Fonts.display, fontSize: 28, color: Colors.text },
  logoutBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, justifyContent: 'center', alignItems: 'center' },

  // Hero
  heroCard: { padding: Spacing.xxl, marginBottom: Spacing.lg, alignItems: 'center' },
  heroLabel: { fontFamily: Fonts.body, fontSize: 13, color: Colors.textSecondary },
  heroValue: { fontFamily: Fonts.display, fontSize: 48, color: Colors.text, letterSpacing: -2, marginVertical: 4 },
  heroSub: { fontFamily: Fonts.body, fontSize: 14, color: Colors.textSecondary, marginBottom: Spacing.lg },
  equivRow: { gap: Spacing.sm, width: '100%' },
  equiv: { flexDirection: 'row', gap: Spacing.sm, alignItems: 'center' },
  equivIcon: { fontSize: 16 },
  equivText: { fontFamily: Fonts.body, fontSize: 13, color: Colors.textSecondary },

  // Stats
  statsRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.xl },
  stat: { flex: 1, alignItems: 'center', gap: 4, paddingVertical: Spacing.lg },
  statValue: { fontFamily: Fonts.display, fontSize: 20, color: Colors.text },
  statLabel: { fontFamily: Fonts.body, fontSize: 11, color: Colors.textSecondary },

  // Section
  sectionTitle: { fontFamily: Fonts.bodySemiBold, fontSize: 16, color: Colors.text, marginBottom: Spacing.md },

  // Credit
  creditCard: { marginBottom: Spacing.sm, padding: Spacing.lg, gap: Spacing.md },
  creditHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  creditDate: { fontFamily: Fonts.bodyMedium, fontSize: 14, color: Colors.text },
  creditTonnes: { fontFamily: Fonts.display, fontSize: 18, color: Colors.primary, marginTop: 2 },
  hashRow: { flexDirection: 'row', gap: Spacing.sm, alignItems: 'center', backgroundColor: Colors.surface, padding: Spacing.sm, borderRadius: Radius.sm },
  hashText: { fontFamily: Fonts.mono, fontSize: 11, color: Colors.textTertiary, flex: 1 },
});
