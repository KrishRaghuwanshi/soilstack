import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors, Fonts, Spacing, Radius } from '../../lib/theme';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { useValidatorStore } from '../../stores/validatorStore';
import type { Submission, Campaign } from '../../lib/types';

/* ── Submission Audit Card ─────────────────────────────────── */
function SubmissionAuditCard({ sub, campaigns }: { sub: Submission, campaigns: Campaign[] }) {
  const date = new Date(sub.created_at).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
  const verifiedDate = sub.validator_verified_at
    ? new Date(sub.validator_verified_at).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'short',
      })
    : null;

  const campaign = campaigns.find(c => c.id === sub.campaign_id);
  const companyName = campaign ? campaign.company_name : 'Unknown Company';
  const campaignName = campaign ? campaign.name : '';

  const showDetails = () => {
    Alert.alert(
      `Farmer #${sub.farmer_id.slice(-4)} Details`,
      `Submitted To: ${companyName} (${campaignName})\nDate Submitted: ${date}\n\nLocation: ${sub.burial_gps?.coordinates[1].toFixed(5)}, ${sub.burial_gps?.coordinates[0].toFixed(5)}\nBurial Depth: ${sub.burial_depth_cm} cm\nEstimated Weight: ${sub.estimated_weight_kg} kg\n\nBiochar Quality: ${sub.quality_score}/5 (${sub.carbon_tier})\nAI Assessment: ${sub.color_assessment}\n\nStatus: ${sub.status.replace('_', ' ').toUpperCase()}`
    );
  };

  return (
    <TouchableOpacity onPress={showDetails} activeOpacity={0.8}>
      <Card style={styles.auditCard}>
      {/* Top: farmer + date */}
      <View style={styles.auditTop}>
        <View style={{ flex: 1 }}>
          <Text style={styles.auditFarmer}>Farmer #{sub.farmer_id.slice(-4)} ➡️ {companyName}</Text>
          <Text style={styles.auditDate}>Submitted {date}</Text>
        </View>
        <Badge
          label={sub.carbon_tier || 'standard'}
          color={sub.carbon_tier === 'ultra' ? Colors.primary : Colors.tertiary}
          bg={sub.carbon_tier === 'ultra' ? Colors.primaryBg : Colors.tertiaryBg}
        />
      </View>

      {/* Data points */}
      <View style={styles.dataRow}>
        <View style={styles.dataItem}>
          <Feather name="layers" size={14} color={Colors.textSecondary} />
          <Text style={styles.dataText}>{sub.estimated_tonnes?.toFixed(1)}t CO₂</Text>
        </View>
        <View style={styles.dataItem}>
          <Feather name="star" size={14} color={Colors.textSecondary} />
          <Text style={styles.dataText}>Quality: {sub.quality_score}/5</Text>
        </View>
        <View style={styles.dataItem}>
          <Feather name="percent" size={14} color={Colors.textSecondary} />
          <Text style={styles.dataText}>Carbon: {sub.estimated_carbon_pct}%</Text>
        </View>
      </View>

      {/* Verification info */}
      <View style={styles.verifyRow}>
        <View style={styles.verifyBadge}>
          <Feather name="check-circle" size={12} color={Colors.primary} />
          <Text style={styles.verifyText}>
            Verified by company{verifiedDate ? ` · ${verifiedDate}` : ''}
          </Text>
        </View>
        {sub.credit_hash && (
          <View style={styles.hashRow}>
            <Text style={styles.hashText}>{sub.credit_hash.slice(0, 16)}...</Text>
            <Feather name="copy" size={12} color={Colors.textTertiary} />
          </View>
        )}
      </View>

      {/* Location */}
      {sub.burial_gps && (
        <View style={styles.locationRow}>
          <Feather name="map-pin" size={12} color={Colors.textTertiary} />
          <Text style={styles.locationText}>
            {sub.burial_gps.coordinates[1].toFixed(4)}, {sub.burial_gps.coordinates[0].toFixed(4)} · {sub.burial_depth_cm}cm depth
          </Text>
        </View>
      )}
      </Card>
    </TouchableOpacity>
  );
}

/* ── Main Screen ───────────────────────────────────────────── */
export default function SubmissionsAuditScreen() {
  const { verifiedSubmissions, allCampaigns, loadMockData } = useValidatorStore();

  useEffect(() => { loadMockData(); }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Verified Submissions</Text>
        <Text style={styles.subtitle}>
          {verifiedSubmissions.length} submissions verified by companies
        </Text>
      </View>

      {verifiedSubmissions.map((sub) => (
        <SubmissionAuditCard key={sub.id} sub={sub} campaigns={allCampaigns} />
      ))}

      {verifiedSubmissions.length === 0 && (
        <Card style={styles.emptyCard}>
          <Feather name="file-text" size={32} color={Colors.textTertiary} />
          <Text style={styles.emptyText}>No verified submissions yet</Text>
          <Text style={styles.emptySub}>Submissions will appear here once verified by companies</Text>
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

  // Audit Card
  auditCard: { padding: Spacing.lg, gap: Spacing.md, marginBottom: Spacing.md },
  auditTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  auditFarmer: { fontFamily: Fonts.bodySemiBold, fontSize: 15, color: Colors.text },
  auditDate: { fontFamily: Fonts.body, fontSize: 12, color: Colors.textSecondary, marginTop: 2 },

  dataRow: { flexDirection: 'row', gap: Spacing.lg },
  dataItem: { flexDirection: 'row', gap: 4, alignItems: 'center' },
  dataText: { fontFamily: Fonts.body, fontSize: 13, color: Colors.textSecondary },

  verifyRow: { gap: Spacing.sm },
  verifyBadge: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  verifyText: { fontFamily: Fonts.bodyMedium, fontSize: 12, color: Colors.primary },
  hashRow: {
    flexDirection: 'row', gap: Spacing.sm, alignItems: 'center',
    backgroundColor: Colors.surface, padding: Spacing.sm, borderRadius: Radius.sm,
  },
  hashText: { fontFamily: Fonts.mono, fontSize: 11, color: Colors.textTertiary },

  locationRow: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  locationText: { fontFamily: Fonts.body, fontSize: 12, color: Colors.textTertiary },

  // Empty
  emptyCard: { alignItems: 'center', gap: Spacing.md, padding: Spacing.xxxl },
  emptyText: { fontFamily: Fonts.bodySemiBold, fontSize: 16, color: Colors.text },
  emptySub: { fontFamily: Fonts.body, fontSize: 13, color: Colors.textTertiary, textAlign: 'center' },
});
