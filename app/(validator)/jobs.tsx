import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors, Fonts, Spacing, Radius } from '../../lib/theme';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { useValidatorStore } from '../../stores/validatorStore';
import type { Campaign } from '../../lib/types';

/* ── Campaign Oversight Card ───────────────────────────────── */
function CampaignOverviewCard({ campaign }: { campaign: Campaign }) {
  const progress = Math.min((campaign.collected_tonnes / campaign.max_tonnes) * 100, 100);

  return (
    <Card style={styles.campaignCard}>
      <View style={styles.campaignTop}>
        <View style={{ flex: 1 }}>
          <Text style={styles.campaignCompany}>ORGANIZATION: {campaign.company_name.toUpperCase()}</Text>
          <Text style={styles.campaignName}>{campaign.name}</Text>
        </View>
        <Badge
          label={campaign.status}
          color={campaign.status === 'active' ? Colors.primary : Colors.textSecondary}
          bg={campaign.status === 'active' ? Colors.primaryBg : 'rgba(107,114,128,0.15)'}
        />
      </View>

      <View style={styles.campaignMeta}>
        <Text style={styles.metaText}>📍 {campaign.region}, {campaign.state}</Text>
        <Text style={styles.metaText}>🌾 {campaign.crop_type}</Text>
      </View>

      {/* Key numbers — no graphs, just clear data */}
      <View style={styles.numbersRow}>
        <View style={styles.numberItem}>
          <Text style={styles.numberValue}>{campaign.enrolled_farmers}</Text>
          <Text style={styles.numberLabel}>FARMERS</Text>
        </View>
        <View style={styles.numberDivider} />
        <View style={styles.numberItem}>
          <Text style={styles.numberValue}>{campaign.collected_tonnes}t</Text>
          <Text style={styles.numberLabel}>COLLECTED</Text>
        </View>
        <View style={styles.numberDivider} />
        <View style={styles.numberItem}>
          <Text style={styles.numberValue}>${campaign.price_per_tonne_usd}</Text>
          <Text style={styles.numberLabel}>PER TONNE</Text>
        </View>
      </View>

      {/* Progress */}
      <View style={styles.progressBg}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>
      <View style={styles.progressLabels}>
        <Text style={styles.progressText}>{Math.round(progress)}% of {campaign.max_tonnes}t goal</Text>
        <Text style={styles.progressText}>{campaign.season}</Text>
      </View>
    </Card>
  );
}

/* ── Main Screen ───────────────────────────────────────────── */
export default function AuthorityOverviewScreen() {
  const { allCampaigns, totalCampaigns, totalFarmers, totalTonnesVerified, loadMockData } = useValidatorStore();

  useEffect(() => { loadMockData(); }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Authority Overview</Text>
        <Text style={styles.subtitle}>Monitoring all active campaigns</Text>
      </View>

      {/* Summary Stats */}
      <View style={styles.statsRow}>
        <Card style={styles.stat}>
          <Text style={styles.statValue}>{totalCampaigns}</Text>
          <Text style={styles.statLabel}>CAMPAIGNS</Text>
        </Card>
        <Card style={styles.stat}>
          <Text style={styles.statValue}>{totalFarmers}</Text>
          <Text style={styles.statLabel}>FARMERS</Text>
        </Card>
        <Card style={styles.stat}>
          <Text style={styles.statValue}>{totalTonnesVerified.toFixed(1)}t</Text>
          <Text style={styles.statLabel}>VERIFIED</Text>
        </Card>
      </View>

      {/* All Campaigns */}
      <Text style={styles.sectionTitle}>All Campaigns ({allCampaigns.length})</Text>
      {allCampaigns.map((campaign) => (
        <CampaignOverviewCard key={campaign.id} campaign={campaign} />
      ))}

      {allCampaigns.length === 0 && (
        <Card style={styles.emptyCard}>
          <Feather name="inbox" size={32} color={Colors.textTertiary} />
          <Text style={styles.emptyText}>No campaigns registered</Text>
        </Card>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  content: { paddingTop: 60, paddingBottom: 100, paddingHorizontal: Spacing.xl },

  header: { marginBottom: Spacing.xl },
  title: { fontFamily: Fonts.display, fontSize: 26, color: Colors.text },
  subtitle: { fontFamily: Fonts.body, fontSize: 13, color: Colors.textSecondary, marginTop: 2 },

  // Stats
  statsRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.xl },
  stat: { flex: 1, alignItems: 'center', gap: 4, paddingVertical: Spacing.lg },
  statValue: { fontFamily: Fonts.display, fontSize: 22, color: Colors.text },
  statLabel: { fontFamily: Fonts.body, fontSize: 11, color: Colors.textSecondary, letterSpacing: 1 },

  // Section
  sectionTitle: { fontFamily: Fonts.bodySemiBold, fontSize: 16, color: Colors.text, marginBottom: Spacing.md },

  // Campaign Card
  campaignCard: { padding: Spacing.lg, gap: Spacing.md, marginBottom: Spacing.md },
  campaignTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  campaignCompany: { fontFamily: Fonts.bodyMedium, fontSize: 11, color: Colors.primary, letterSpacing: 1 },
  campaignName: { fontFamily: Fonts.display, fontSize: 18, color: Colors.text, marginTop: 4 },
  campaignMeta: { flexDirection: 'row', gap: Spacing.lg },
  metaText: { fontFamily: Fonts.body, fontSize: 12, color: Colors.textTertiary },

  numbersRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  numberItem: { alignItems: 'center', gap: 2, flex: 1 },
  numberValue: { fontFamily: Fonts.display, fontSize: 18, color: Colors.text },
  numberLabel: { fontFamily: Fonts.body, fontSize: 10, color: Colors.textTertiary, letterSpacing: 1 },
  numberDivider: { width: 1, height: 24, backgroundColor: Colors.border },

  progressBg: { height: 4, backgroundColor: 'rgba(255,255,255,0.08)', overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: Colors.primary },
  progressLabels: { flexDirection: 'row', justifyContent: 'space-between' },
  progressText: { fontFamily: Fonts.body, fontSize: 11, color: Colors.textTertiary },

  // Empty
  emptyCard: { alignItems: 'center', gap: Spacing.md, padding: Spacing.xxxl },
  emptyText: { fontFamily: Fonts.bodySemiBold, fontSize: 16, color: Colors.text },
});
