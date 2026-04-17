import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Colors, Fonts, Spacing, Radius } from '../../lib/theme';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { QualityDots } from '../../components/ui/QualityDots';
import { Badge } from '../../components/ui/Badge';
import { useFarmerStore } from '../../stores/farmerStore';

const STEPS = ['Photo', 'Location', 'Confirm'];

export default function SubmitScreen() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [photoTaken, setPhotoTaken] = useState(false);
  const [depth, setDepth] = useState('15');
  const enrolledCampaign = useFarmerStore((s) => s.enrolledCampaign);

  // Mock AI result
  const aiResult = {
    quality_score: 4,
    carbon_tier: 'premium' as const,
    estimated_carbon_pct: 72,
    color_assessment: 'Dark black with fine porous structure throughout.',
    improvement_tip: 'Slightly longer burn would push to ultra tier.',
    estimated_tonnes: 2.1,
  };

  const pricePerTonne = enrolledCampaign?.price_per_tonne_usd || 60;
  const estimatedEarnings = Math.round(aiResult.estimated_tonnes * pricePerTonne * 84); // USD to INR

  const nextStep = () => {
    if (step < STEPS.length - 1) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleCapture = () => {
    setLoading(true);
    setTimeout(() => {
      setPhotoTaken(true);
      setLoading(false);
      nextStep();
    }, 1500);
  };

  const handleSubmit = () => {
    Alert.alert(
      'Submitted! 🎉',
      `Your biochar has been submitted to ${enrolledCampaign?.company_name || 'the campaign'}. Payment expected in 3–7 days.`,
      [{ text: 'Back to Home', onPress: () => router.back() }]
    );
  };

  return (
    <View style={styles.container}>
      {/* Progress bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressRow}>
          {STEPS.map((s, i) => (
            <View key={i} style={styles.progressStep}>
              <View style={[styles.progressDot, i <= step && styles.progressDotActive]}>
                {i < step ? (
                  <Feather name="check" size={12} color={Colors.textOnPrimary} />
                ) : (
                  <Text style={[styles.progressNum, i <= step && styles.progressNumActive]}>
                    {i + 1}
                  </Text>
                )}
              </View>
              <Text style={[styles.progressLabel, i <= step && styles.progressLabelActive]}>
                {s}
              </Text>
            </View>
          ))}
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${(step / (STEPS.length - 1)) * 100}%` }]} />
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {/* Step 0: Photo Capture */}
        {step === 0 && (
          <View style={styles.stepContent}>
            <View style={styles.cameraPlaceholder}>
              <View style={styles.cameraFrame}>
                <View style={styles.cornerTL} />
                <View style={styles.cornerTR} />
                <View style={styles.cornerBL} />
                <View style={styles.cornerBR} />
                <Feather name="camera" size={48} color={Colors.textTertiary} />
                <Text style={styles.cameraText}>Place biochar in frame</Text>
              </View>
            </View>
            <View style={styles.btnRow}>
              <Button title="📷  Capture Biochar" onPress={handleCapture} loading={loading} />
              <Button title="Choose from gallery" onPress={handleCapture} variant="ghost" loading={loading} />
            </View>
          </View>
        )}

        {/* Step 1: Location */}
        {step === 1 && (
          <View style={styles.stepContent}>
            <Card variant="elevated" style={styles.mapPlaceholder}>
              <View style={styles.mapContent}>
                <Feather name="map-pin" size={40} color={Colors.primary} />
                <Text style={styles.mapText}>Tap to mark burial location</Text>
                <Text style={styles.mapSubtext}>Ludhiana, Punjab</Text>
                <View style={styles.coordBox}>
                  <Text style={styles.coordText}>30.9120°N, 75.8402°E</Text>
                </View>
              </View>
            </Card>

            <Input
              label="Burial depth (cm)"
              value={depth}
              onChangeText={setDepth}
              keyboardType="number-pad"
              placeholder="15"
              suffix={<Text style={styles.unitText}>cm</Text>}
            />

            <Button
              title="Use Current Location"
              onPress={nextStep}
              icon={<Feather name="crosshair" size={18} color={Colors.textOnPrimary} />}
            />
          </View>
        )}

        {/* Step 2: Confirm */}
        {step === 2 && (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Confirm Submission</Text>

            {/* AI Result inline */}
            <Card style={styles.aiCard}>
              <View style={styles.aiRow}>
                <Text style={styles.aiLabel}>Quality</Text>
                <QualityDots score={aiResult.quality_score} size={10} />
              </View>
              <View style={styles.aiRow}>
                <Text style={styles.aiLabel}>Tier</Text>
                <Badge label={aiResult.carbon_tier} color={Colors.primary} bg={Colors.primaryBg} />
              </View>
              <View style={styles.aiRow}>
                <Text style={styles.aiLabel}>Carbon</Text>
                <Text style={styles.aiValue}>{aiResult.estimated_carbon_pct}%</Text>
              </View>
            </Card>

            <Card variant="elevated" style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Campaign</Text>
                <Text style={styles.summaryValue}>{enrolledCampaign?.company_name || '—'}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Location</Text>
                <Text style={styles.summaryValue}>Ludhiana, Punjab</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Depth</Text>
                <Text style={styles.summaryValue}>{depth}cm</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Est. CO₂</Text>
                <Text style={styles.summaryValue}>{aiResult.estimated_tonnes}t</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Est. Earnings</Text>
                <Text style={styles.earningsValue}>₹{estimatedEarnings.toLocaleString('en-IN')}</Text>
              </View>
            </Card>

            <View style={styles.tipBox}>
              <Feather name="zap" size={14} color={Colors.secondary} />
              <Text style={styles.tipText}>{aiResult.improvement_tip}</Text>
            </View>

            <Button title="Submit Biochar" onPress={handleSubmit} />
          </View>
        )}
      </ScrollView>

      {/* Back button */}
      {step > 0 && (
        <TouchableOpacity style={styles.backBtn} onPress={prevStep}>
          <Feather name="arrow-left" size={20} color={Colors.text} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: Spacing.xl, paddingBottom: 100 },
  stepContent: { gap: Spacing.xl, paddingTop: Spacing.lg },

  // Progress
  progressContainer: { paddingTop: 60, paddingHorizontal: Spacing.xl, paddingBottom: Spacing.lg },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.sm },
  progressStep: { alignItems: 'center', gap: 4 },
  progressDot: {
    width: 24, height: 24, borderRadius: 12, backgroundColor: Colors.card,
    borderWidth: 1, borderColor: Colors.border, justifyContent: 'center', alignItems: 'center',
  },
  progressDotActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  progressNum: { fontFamily: Fonts.bodyMedium, fontSize: 11, color: Colors.textTertiary },
  progressNumActive: { color: Colors.textOnPrimary },
  progressLabel: { fontFamily: Fonts.body, fontSize: 10, color: Colors.textTertiary },
  progressLabelActive: { color: Colors.textSecondary },
  progressTrack: { height: 2, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 1 },
  progressFill: { height: '100%', backgroundColor: Colors.primary, borderRadius: 1 },

  // Camera
  cameraPlaceholder: {
    height: 360, backgroundColor: Colors.surface, borderRadius: Radius.lg,
    justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: Colors.border,
  },
  cameraFrame: {
    width: 240, height: 240, justifyContent: 'center', alignItems: 'center', gap: Spacing.md,
  },
  cornerTL: { position: 'absolute', top: 0, left: 0, width: 30, height: 30, borderTopWidth: 2, borderLeftWidth: 2, borderColor: Colors.primary },
  cornerTR: { position: 'absolute', top: 0, right: 0, width: 30, height: 30, borderTopWidth: 2, borderRightWidth: 2, borderColor: Colors.primary },
  cornerBL: { position: 'absolute', bottom: 0, left: 0, width: 30, height: 30, borderBottomWidth: 2, borderLeftWidth: 2, borderColor: Colors.primary },
  cornerBR: { position: 'absolute', bottom: 0, right: 0, width: 30, height: 30, borderBottomWidth: 2, borderRightWidth: 2, borderColor: Colors.primary },
  cameraText: { fontFamily: Fonts.body, fontSize: 14, color: Colors.textTertiary },
  btnRow: { gap: Spacing.sm },

  // Map
  mapPlaceholder: { height: 250, padding: 0 },
  mapContent: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: Spacing.md, backgroundColor: Colors.surface, borderRadius: Radius.lg },
  mapText: { fontFamily: Fonts.bodyMedium, fontSize: 16, color: Colors.text },
  mapSubtext: { fontFamily: Fonts.body, fontSize: 13, color: Colors.textSecondary },
  coordBox: { backgroundColor: Colors.card, paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, borderRadius: Radius.sm },
  coordText: { fontFamily: Fonts.mono, fontSize: 12, color: Colors.textSecondary },
  unitText: { fontFamily: Fonts.bodyMedium, fontSize: 14, color: Colors.textSecondary },

  // Confirm
  stepTitle: { fontFamily: Fonts.display, fontSize: 24, color: Colors.text },

  aiCard: { padding: Spacing.lg, gap: Spacing.sm },
  aiRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  aiLabel: { fontFamily: Fonts.body, fontSize: 14, color: Colors.textSecondary },
  aiValue: { fontFamily: Fonts.display, fontSize: 16, color: Colors.text },

  summaryCard: { padding: Spacing.xl, gap: Spacing.md },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryLabel: { fontFamily: Fonts.body, fontSize: 14, color: Colors.textSecondary },
  summaryValue: { fontFamily: Fonts.bodyMedium, fontSize: 14, color: Colors.text },
  summaryDivider: { height: 1, backgroundColor: Colors.border },
  earningsValue: { fontFamily: Fonts.display, fontSize: 22, color: Colors.primary },

  tipBox: {
    flexDirection: 'row', gap: Spacing.sm, alignItems: 'flex-start',
    backgroundColor: Colors.secondaryBg, padding: Spacing.md, borderRadius: Radius.md,
  },
  tipText: { flex: 1, fontFamily: Fonts.body, fontSize: 13, color: Colors.secondary, lineHeight: 18 },

  backBtn: {
    position: 'absolute', top: 60, left: Spacing.xl,
    width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.card,
    borderWidth: 1, borderColor: Colors.border, justifyContent: 'center', alignItems: 'center',
  },
});
