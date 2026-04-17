import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors, Fonts, Spacing, Radius } from '../../lib/theme';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useBuyerStore } from '../../stores/buyerStore';
import type { Campaign } from '../../lib/types';

function CampaignCard({ campaign }: { campaign: Campaign }) {
  const progress = Math.min((campaign.collected_tonnes / campaign.max_tonnes) * 100, 100);

  return (
    <Card variant="elevated" style={styles.campaignCard}>
      <View style={styles.campaignHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.campaignName}>{campaign.name}</Text>
          <Text style={styles.campaignRegion}>
            📍 {campaign.region}, {campaign.state} · 🌾 {campaign.crop_type}
          </Text>
        </View>
        <Badge
          label={campaign.status}
          color={campaign.status === 'active' ? Colors.primary : Colors.textSecondary}
          bg={campaign.status === 'active' ? Colors.primaryBg : 'rgba(107,114,128,0.15)'}
        />
      </View>

      <View style={styles.campaignStats}>
        <View style={styles.campaignStat}>
          <Text style={styles.statValue}>${campaign.price_per_tonne_usd}</Text>
          <Text style={styles.statLabel}>per tonne</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.campaignStat}>
          <Text style={styles.statValue}>{campaign.enrolled_farmers}</Text>
          <Text style={styles.statLabel}>farmers</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.campaignStat}>
          <Text style={styles.statValue}>{campaign.collected_tonnes}t</Text>
          <Text style={styles.statLabel}>collected</Text>
        </View>
      </View>

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

export default function CampaignsScreen() {
  const { company, campaigns, loadMockData } = useBuyerStore();
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('65');

  useEffect(() => { loadMockData(); }, []);

  const handleCreate = () => {
    Alert.alert(
      'Campaign Created! 🚀',
      `"${newName || 'New Campaign'}" at $${newPrice}/tonne is now live. Farmers in your region can start enrolling.`,
      [{ text: 'OK', onPress: () => setShowCreate(false) }]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Campaigns</Text>
        <Text style={styles.subtitle}>{company?.company_name || 'Company'}</Text>
      </View>

      <Button
        title={showCreate ? 'Cancel' : '+ Create Campaign'}
        variant={showCreate ? 'ghost' : 'primary'}
        onPress={() => setShowCreate(!showCreate)}
      />

      {showCreate && (
        <Card variant="elevated" style={styles.createCard}>
          <Text style={styles.createTitle}>New Campaign</Text>
          <Input label="Campaign Name" value={newName} onChangeText={setNewName} placeholder="e.g. Punjab Wheat 2026" />
          <Input
            label="Price per tonne (USD)"
            value={newPrice}
            onChangeText={setNewPrice}
            keyboardType="number-pad"
            suffix={<Text style={styles.unit}>$/t</Text>}
          />
          <Button title="Launch Campaign" onPress={handleCreate} disabled={!newName} />
        </Card>
      )}

      {/* Campaign list */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Active Campaigns</Text>
        <Text style={styles.sectionCount}>{campaigns.length}</Text>
      </View>

      {campaigns.map((c) => (
        <CampaignCard key={c.id} campaign={c} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  content: { paddingTop: 60, paddingBottom: 100, paddingHorizontal: Spacing.xl, gap: Spacing.lg },

  header: { },
  title: { fontFamily: Fonts.display, fontSize: 28, color: Colors.text },
  subtitle: { fontFamily: Fonts.body, fontSize: 14, color: Colors.textSecondary, marginTop: 2 },

  // Create
  createCard: { padding: Spacing.xl, gap: Spacing.lg },
  createTitle: { fontFamily: Fonts.display, fontSize: 20, color: Colors.text },
  unit: { fontFamily: Fonts.bodyMedium, fontSize: 14, color: Colors.textSecondary },

  // Section
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontFamily: Fonts.bodySemiBold, fontSize: 16, color: Colors.text },
  sectionCount: { fontFamily: Fonts.mono, fontSize: 13, color: Colors.textTertiary },

  // Campaign Card
  campaignCard: { padding: Spacing.xl, gap: Spacing.lg },
  campaignHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  campaignName: { fontFamily: Fonts.bodySemiBold, fontSize: 17, color: Colors.text },
  campaignRegion: { fontFamily: Fonts.body, fontSize: 13, color: Colors.textSecondary, marginTop: 4 },
  campaignStats: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  campaignStat: { alignItems: 'center', gap: 2, flex: 1 },
  statValue: { fontFamily: Fonts.display, fontSize: 18, color: Colors.text },
  statLabel: { fontFamily: Fonts.body, fontSize: 11, color: Colors.textTertiary },
  divider: { width: 1, height: 24, backgroundColor: Colors.border },
  progressBg: { height: 4, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: Colors.primary, borderRadius: 2 },
  progressLabels: { flexDirection: 'row', justifyContent: 'space-between' },
  progressText: { fontFamily: Fonts.body, fontSize: 11, color: Colors.textTertiary },
});
