import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Colors, Fonts, Spacing, Radius } from '../../lib/theme';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useValidatorStore } from '../../stores/validatorStore';
import { useAuthStore } from '../../stores/authStore';

export default function AuthorityProfileScreen() {
  const { totalCampaigns, totalFarmers, totalTonnesVerified, loadMockData } = useValidatorStore();
  const profile = useAuthStore((s) => s.profile);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => { loadMockData(); }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Profile</Text>

      {/* Avatar + Name */}
      <Card variant="elevated" style={styles.profileCard}>
        <View style={styles.avatar}>
          <Feather name="shield" size={28} color={Colors.secondary} />
        </View>
        <Text style={styles.profileName}>{profile?.name || 'Authority'}</Text>
        <Text style={styles.profileRole}>Validating Authority</Text>
      </Card>

      {/* Oversight Stats */}
      <View style={styles.statsGrid}>
        <Card style={styles.stat}>
          <Text style={styles.statValue}>{totalCampaigns}</Text>
          <Text style={styles.statLabel}>Campaigns</Text>
        </Card>
        <Card style={styles.stat}>
          <Text style={styles.statValue}>{totalFarmers}</Text>
          <Text style={styles.statLabel}>Farmers</Text>
        </Card>
        <Card style={styles.stat}>
          <Text style={styles.statValue}>{totalTonnesVerified.toFixed(1)}t</Text>
          <Text style={styles.statLabel}>Verified</Text>
        </Card>
      </View>

      {/* Settings */}
      <Card style={styles.settingsCard}>
        <SettingRow icon="globe" label="Language" value="English" />
        <View style={styles.divider} />
        <SettingRow icon="bell" label="Notifications" value="On" />
        <View style={styles.divider} />
        <SettingRow icon="shield" label="Access Level" value="Full" />
      </Card>

      <Button title="Logout" variant="destructive" onPress={() => { logout(); router.replace('/onboarding/role'); }} />
    </ScrollView>
  );
}

function SettingRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={styles.settingRow}>
      <View style={styles.settingLeft}>
        <Feather name={icon as any} size={18} color={Colors.textSecondary} />
        <Text style={styles.settingLabel}>{label}</Text>
      </View>
      <Text style={styles.settingValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  content: { paddingTop: 60, paddingBottom: 100, paddingHorizontal: Spacing.xl, gap: Spacing.lg },
  title: { fontFamily: Fonts.display, fontSize: 28, color: Colors.text },

  profileCard: { alignItems: 'center', padding: Spacing.xxl, gap: Spacing.md },
  avatar: { width: 64, height: 64, borderRadius: 20, backgroundColor: Colors.secondaryBg, justifyContent: 'center', alignItems: 'center' },
  profileName: { fontFamily: Fonts.display, fontSize: 22, color: Colors.text },
  profileRole: { fontFamily: Fonts.body, fontSize: 14, color: Colors.textSecondary },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  stat: { width: '48%', flex: 1, minWidth: 100, alignItems: 'center', gap: 4, paddingVertical: Spacing.lg },
  statValue: { fontFamily: Fonts.display, fontSize: 22, color: Colors.text },
  statLabel: { fontFamily: Fonts.body, fontSize: 12, color: Colors.textSecondary },

  settingsCard: { padding: Spacing.lg },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: Spacing.md },
  settingLeft: { flexDirection: 'row', gap: Spacing.md, alignItems: 'center' },
  settingLabel: { fontFamily: Fonts.body, fontSize: 15, color: Colors.text },
  settingValue: { fontFamily: Fonts.bodyMedium, fontSize: 14, color: Colors.textSecondary },
  divider: { height: 1, backgroundColor: Colors.border },
});
