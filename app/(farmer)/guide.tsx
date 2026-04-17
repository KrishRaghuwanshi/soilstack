import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors, Fonts, Spacing, Radius } from '../../lib/theme';
import { Card } from '../../components/ui/Card';

const STEPS = [
  {
    num: 1,
    title: 'Gather Materials',
    desc: 'Collect your crop leftovers — rice straw, wheat straw, or corn stalks. Get some clay or mud for the kiln, water for cooling, and a shovel.',
    emoji: '📦',
  },
  {
    num: 2,
    title: 'Build a Kiln',
    desc: 'Shape wet clay into a dome about 2 feet wide. Leave a small hole at the bottom for air and one at the top for smoke. Let it dry in the sun for 2–3 days.',
    emoji: '🏗️',
  },
  {
    num: 3,
    title: 'Load & Light',
    desc: 'Pack the dried crop leftovers tightly into the kiln (fill it 80%). Light from the bottom hole. After 5–10 minutes of good fire, partially close both holes to reduce air.',
    emoji: '🔥',
  },
  {
    num: 4,
    title: 'Watch the Smoke',
    desc: 'White/gray smoke → water is leaving (keep going).\nYellow smoke → biochar is forming (almost there).\nThin blue smoke → perfect! This is when to seal it.',
    emoji: '👁️',
  },
  {
    num: 5,
    title: 'Cool & Check',
    desc: 'Seal the kiln completely and wait 12–24 hours to cool. DO NOT pour water — it ruins the biochar. Good biochar is jet black, lightweight, and crunches when broken.',
    emoji: '❄️',
  },
  {
    num: 6,
    title: 'Bury & Submit',
    desc: 'Crush biochar into small pieces (2–5cm). Dig a trench about 15cm deep. Bury the biochar and cover with soil. Then open SoilStack, take a photo, and submit!',
    emoji: '📸',
  },
];

const QUALITY_TIERS = [
  { stars: '⭐⭐⭐⭐⭐', tier: 'Ultra', desc: 'Jet black, light, crunchy', color: Colors.primary },
  { stars: '⭐⭐⭐', tier: 'Premium', desc: 'Dark brown, some gray', color: Colors.secondary },
  { stars: '⭐', tier: 'Standard', desc: 'Mostly gray ash — try again', color: Colors.textTertiary },
];

export default function LearnScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>How to Make Biochar</Text>
        <Text style={styles.subtitle}>Your complete field guide</Text>
        <View style={styles.offlineBadge}>
          <Feather name="wifi-off" size={12} color={Colors.primary} />
          <Text style={styles.offlineText}>Works offline</Text>
        </View>
      </View>

      {/* Visual Timeline */}
      <View style={styles.timeline}>
        {STEPS.map((step, index) => (
          <View key={step.num} style={styles.timelineStep}>
            {/* Left: line + circle */}
            <View style={styles.timelineLeft}>
              <View style={styles.stepCircle}>
                <Text style={styles.stepNum}>{step.num}</Text>
              </View>
              {index < STEPS.length - 1 && <View style={styles.timelineLine} />}
            </View>

            {/* Right: content */}
            <View style={styles.stepContent}>
              <View style={styles.stepHeader}>
                <Text style={styles.stepTitle}>{step.title}</Text>
                <Text style={styles.stepEmoji}>{step.emoji}</Text>
              </View>
              <Text style={styles.stepDesc}>{step.desc}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Quality Card */}
      <Card style={styles.qualityCard}>
        <Text style={styles.qualityTitle}>Quick Quality Check</Text>
        {QUALITY_TIERS.map((tier, i) => (
          <View key={i} style={styles.qualityRow}>
            <Text style={styles.qualityStars}>{tier.stars}</Text>
            <View style={styles.qualityInfo}>
              <Text style={[styles.qualityTier, { color: tier.color }]}>{tier.tier}</Text>
              <Text style={styles.qualityDesc}>{tier.desc}</Text>
            </View>
          </View>
        ))}
      </Card>

      {/* Pro Tips */}
      <Card style={styles.tipsCard}>
        <View style={styles.tipsHeader}>
          <Feather name="zap" size={16} color={Colors.secondary} />
          <Text style={styles.tipsTitle}>Pro Tips</Text>
        </View>
        <View style={styles.tipItem}>
          <Text style={styles.tipBullet}>•</Text>
          <Text style={styles.tipText}>Drier material = better biochar. Air-dry for 2–3 days before burning.</Text>
        </View>
        <View style={styles.tipItem}>
          <Text style={styles.tipBullet}>•</Text>
          <Text style={styles.tipText}>Pack tightly! Loose material burns to ash instead of charring.</Text>
        </View>
        <View style={styles.tipItem}>
          <Text style={styles.tipBullet}>•</Text>
          <Text style={styles.tipText}>Best time to bury: just before planting season. The carbon enriches your soil!</Text>
        </View>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  content: { paddingTop: 60, paddingBottom: 100, paddingHorizontal: Spacing.xl },

  // Header
  header: { marginBottom: Spacing.xxl },
  title: { fontFamily: Fonts.display, fontSize: 26, color: Colors.text },
  subtitle: { fontFamily: Fonts.body, fontSize: 14, color: Colors.textSecondary, marginTop: 2 },
  offlineBadge: {
    flexDirection: 'row', gap: 6, alignItems: 'center', backgroundColor: Colors.primaryBg,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, borderRadius: Radius.pill,
    alignSelf: 'flex-start', marginTop: Spacing.sm,
  },
  offlineText: { fontFamily: Fonts.bodyMedium, fontSize: 12, color: Colors.primary },

  // Timeline
  timeline: { marginBottom: Spacing.xxl },
  timelineStep: { flexDirection: 'row', gap: Spacing.lg },
  timelineLeft: { alignItems: 'center', width: 36 },
  stepCircle: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.primary,
    justifyContent: 'center', alignItems: 'center', zIndex: 1,
  },
  stepNum: { fontFamily: Fonts.display, fontSize: 16, color: Colors.textOnPrimary },
  timelineLine: {
    width: 2, flex: 1, backgroundColor: Colors.primaryMuted,
    marginTop: -2, marginBottom: -2,
  },
  stepContent: {
    flex: 1, paddingBottom: Spacing.xxl,
  },
  stepHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 6,
  },
  stepTitle: { fontFamily: Fonts.bodySemiBold, fontSize: 16, color: Colors.text },
  stepEmoji: { fontSize: 20 },
  stepDesc: { fontFamily: Fonts.body, fontSize: 13, color: Colors.textSecondary, lineHeight: 20 },

  // Quality
  qualityCard: { padding: Spacing.lg, gap: Spacing.md, marginBottom: Spacing.lg },
  qualityTitle: { fontFamily: Fonts.bodySemiBold, fontSize: 16, color: Colors.text },
  qualityRow: { flexDirection: 'row', gap: Spacing.md, alignItems: 'center' },
  qualityStars: { fontSize: 12, width: 70 },
  qualityInfo: { flex: 1, gap: 1 },
  qualityTier: { fontFamily: Fonts.bodyMedium, fontSize: 14 },
  qualityDesc: { fontFamily: Fonts.body, fontSize: 12, color: Colors.textSecondary },

  // Tips
  tipsCard: { padding: Spacing.lg, gap: Spacing.md },
  tipsHeader: { flexDirection: 'row', gap: Spacing.sm, alignItems: 'center' },
  tipsTitle: { fontFamily: Fonts.bodySemiBold, fontSize: 16, color: Colors.text },
  tipItem: { flexDirection: 'row', gap: Spacing.sm },
  tipBullet: { fontFamily: Fonts.body, fontSize: 14, color: Colors.primary },
  tipText: { fontFamily: Fonts.body, fontSize: 13, color: Colors.textSecondary, flex: 1, lineHeight: 20 },
});
