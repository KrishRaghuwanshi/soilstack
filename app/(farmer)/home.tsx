import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Animated, RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Colors, Fonts, Spacing, Radius } from '../../lib/theme';
import { Card } from '../../components/ui/Card';
import { StatusBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useFarmerStore } from '../../stores/farmerStore';
import { useAuthStore } from '../../stores/authStore';
import type { Submission, Campaign } from '../../lib/types';

/* ── Enrolled Campaign Card ─────────────────────────────── */
function EnrolledCampaignCard({ campaign }: { campaign: Campaign }) {
  const progress = Math.min((campaign.collected_tonnes / campaign.max_tonnes) * 100, 100);

  return (
    <Card variant="elevated" style={styles.campaignCard}>
      <View style={styles.campaignHeader}>
        <View>
          <Text style={styles.campaignCompany}>{campaign.company_name}</Text>
          <Text style={styles.campaignName}>{campaign.name}</Text>
        </View>
        <View style={styles.enrolledBadge}>
          <Feather name="check-circle" size={12} color={Colors.primary} />
          <Text style={styles.enrolledText}>Enrolled</Text>
        </View>
      </View>

      <View style={styles.campaignStats}>
        <View style={styles.campaignStat}>
          <Text style={styles.campaignStatValue}>${campaign.price_per_tonne_usd}</Text>
          <Text style={styles.campaignStatLabel}>per tonne</Text>
        </View>
        <View style={styles.campaignDivider} />
        <View style={styles.campaignStat}>
          <Text style={styles.campaignStatValue}>{campaign.crop_type}</Text>
          <Text style={styles.campaignStatLabel}>crop type</Text>
        </View>
        <View style={styles.campaignDivider} />
        <View style={styles.campaignStat}>
          <Text style={styles.campaignStatValue}>{campaign.enrolled_farmers}</Text>
          <Text style={styles.campaignStatLabel}>farmers</Text>
        </View>
      </View>

      <View style={styles.progressBg}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>
      <View style={styles.progressLabels}>
        <Text style={styles.progressText}>{campaign.collected_tonnes}t collected</Text>
        <Text style={styles.progressText}>{campaign.max_tonnes}t goal</Text>
      </View>
    </Card>
  );
}

/* ── Available Campaign Card ───────────────────────────── */
function AvailableCampaignCard({ campaign, onJoin }: { campaign: Campaign; onJoin: () => void }) {
  return (
    <Card style={styles.availCard}>
      <View style={styles.availHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.availCompany}>{campaign.company_name}</Text>
          <Text style={styles.availName}>{campaign.name}</Text>
        </View>
        <Text style={styles.availPrice}>${campaign.price_per_tonne_usd}/t</Text>
      </View>
      <View style={styles.availMeta}>
        <Text style={styles.availMetaText}>📍 {campaign.region}, {campaign.state}</Text>
        <Text style={styles.availMetaText}>🌾 {campaign.crop_type}</Text>
      </View>
      <Button title="Participate" onPress={onJoin} size="sm" />
    </Card>
  );
}

/* ── Submission Row ─────────────────────────────────────── */
function SubmissionRow({ item }: { item: Submission }) {
  const date = new Date(item.created_at).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short',
  });

  return (
    <Card style={styles.subCard}>
      <View style={styles.subRow}>
        <View style={styles.subLeft}>
          <Text style={styles.subDate}>{date}</Text>
          <Text style={styles.subTonnes}>
            {item.estimated_tonnes?.toFixed(1)}t CO₂ · {item.carbon_tier}
          </Text>
        </View>
        <View style={styles.subRight}>
          <StatusBadge status={item.status} />
          {item.payment_amount_inr && (
            <Text style={styles.subAmount}>
              ₹{item.payment_amount_inr.toLocaleString('en-IN')}
            </Text>
          )}
          {!item.payment_amount_inr && item.estimated_payment_inr && (
            <Text style={styles.subAmountPending}>
              ~₹{item.estimated_payment_inr.toLocaleString('en-IN')}
            </Text>
          )}
        </View>
      </View>
    </Card>
  );
}

/* ── Main Screen ────────────────────────────────────────── */
export default function FarmerHome() {
  const profile = useAuthStore((s) => s.profile);
  const { submissions, enrolledCampaign, availableCampaigns, earnings, loadMockData, enrollInCampaign } = useFarmerStore();
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => { loadMockData(); }, []);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
        }
      >
        {/* Greeting + Earnings */}
        <View style={styles.greetSection}>
          <View>
            <Text style={styles.greetText}>{greeting()}, {profile?.name?.split(' ')[0] || 'Farmer'}</Text>
            <Text style={styles.earningsText}>
              Total earned: <Text style={styles.earningsHighlight}>₹{earnings.total_inr.toLocaleString('en-IN')}</Text>
              {'  '}·{'  '}Pending: <Text style={{ color: Colors.secondary }}>₹{earnings.pending_inr.toLocaleString('en-IN')}</Text>
            </Text>
          </View>
          <TouchableOpacity style={styles.profileBtn} onPress={() => router.push('/onboarding/role')}>
            <Feather name="user" size={20} color={Colors.text} />
          </TouchableOpacity>
        </View>

        {/* Active Campaign */}
        {enrolledCampaign && (
          <>
            <Text style={styles.sectionTitle}>Your Campaign</Text>
            <EnrolledCampaignCard campaign={enrolledCampaign} />
          </>
        )}

        {/* Available Campaigns */}
        {availableCampaigns.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Available Campaigns</Text>
              <Text style={styles.sectionCount}>{availableCampaigns.length}</Text>
            </View>
            {availableCampaigns.map((c) => (
              <AvailableCampaignCard
                key={c.id}
                campaign={c}
                onJoin={() => enrollInCampaign(c.id)}
              />
            ))}
          </>
        )}

        {/* Recent Submissions */}
        {submissions.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Submissions</Text>
              <Text style={styles.sectionCount}>{submissions.length}</Text>
            </View>
            {submissions.map((sub) => (
              <SubmissionRow key={sub.id} item={sub} />
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: Spacing.xl, paddingTop: 60, paddingBottom: 100 },

  // Greeting
  greetSection: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.xxl },
  greetText: { fontFamily: Fonts.display, fontSize: 24, color: Colors.text },
  earningsText: { fontFamily: Fonts.body, fontSize: 13, color: Colors.textSecondary, marginTop: 4, lineHeight: 18 },
  earningsHighlight: { fontFamily: Fonts.bodySemiBold, color: Colors.primary },
  profileBtn: {
    width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.card,
    borderWidth: 1, borderColor: Colors.border, justifyContent: 'center', alignItems: 'center',
  },

  // Campaign
  campaignCard: { marginBottom: Spacing.lg, padding: Spacing.xl },
  campaignHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.lg },
  campaignCompany: { fontFamily: Fonts.bodyMedium, fontSize: 13, color: Colors.textSecondary },
  campaignName: { fontFamily: Fonts.display, fontSize: 20, color: Colors.text, marginTop: 2 },
  enrolledBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.primaryBg,
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.pill,
  },
  enrolledText: { fontFamily: Fonts.bodyMedium, fontSize: 12, color: Colors.primary },
  campaignStats: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.lg },
  campaignStat: { alignItems: 'center', gap: 2, flex: 1 },
  campaignStatValue: { fontFamily: Fonts.display, fontSize: 16, color: Colors.text },
  campaignStatLabel: { fontFamily: Fonts.body, fontSize: 10, color: Colors.textTertiary },
  campaignDivider: { width: 1, height: 24, backgroundColor: Colors.border },
  progressBg: { height: 4, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: Colors.primary, borderRadius: 2 },
  progressLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  progressText: { fontFamily: Fonts.body, fontSize: 11, color: Colors.textTertiary },

  // Available Campaign
  availCard: { marginBottom: Spacing.md, padding: Spacing.lg, gap: Spacing.md },
  availHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  availCompany: { fontFamily: Fonts.body, fontSize: 12, color: Colors.textSecondary },
  availName: { fontFamily: Fonts.bodyMedium, fontSize: 15, color: Colors.text, marginTop: 2 },
  availPrice: { fontFamily: Fonts.display, fontSize: 18, color: Colors.primary },
  availMeta: { flexDirection: 'row', gap: Spacing.lg },
  availMetaText: { fontFamily: Fonts.body, fontSize: 12, color: Colors.textTertiary },

  // Section
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md, marginTop: Spacing.md },
  sectionTitle: { fontFamily: Fonts.bodySemiBold, fontSize: 16, color: Colors.text, marginBottom: Spacing.sm },
  sectionCount: { fontFamily: Fonts.mono, fontSize: 13, color: Colors.textTertiary },

  // Submission
  subCard: { marginBottom: Spacing.sm, padding: Spacing.lg },
  subRow: { flexDirection: 'row', justifyContent: 'space-between' },
  subLeft: { gap: 4 },
  subRight: { alignItems: 'flex-end', gap: 6 },
  subDate: { fontFamily: Fonts.bodyMedium, fontSize: 14, color: Colors.text },
  subTonnes: { fontFamily: Fonts.body, fontSize: 12, color: Colors.textSecondary },
  subAmount: { fontFamily: Fonts.display, fontSize: 16, color: Colors.primary },
  subAmountPending: { fontFamily: Fonts.display, fontSize: 16, color: Colors.secondary },
});
