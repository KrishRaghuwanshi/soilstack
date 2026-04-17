import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors, Fonts, Spacing, Radius } from '../../lib/theme';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { useBuyerStore } from '../../stores/buyerStore';
import type { SatelliteCheck } from '../../lib/types';

function SatelliteRow({ check }: { check: SatelliteCheck }) {
  const date = new Date(check.date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
  });
  
  const isBurn = check.result === 'burn_detected';

  return (
    <Card style={styles.card}>
      <View style={styles.row}>
        <View style={[styles.iconBox, { backgroundColor: isBurn ? Colors.destructiveBg : Colors.primaryBg }]}>
          <Feather 
            name={isBurn ? 'alert-triangle' : 'check-circle'} 
            size={18} 
            color={isBurn ? Colors.destructive : Colors.primary} 
          />
        </View>
        
        <View style={styles.content}>
          <View style={styles.topRow}>
            <Text style={styles.farmerId}>Farmer ID: {check.farmer_id.split('-')[1]}</Text>
            <Text style={styles.date}>{date}</Text>
          </View>
          
          <Text style={styles.coords}>
            GPS: {check.coordinates.coordinates[1].toFixed(4)}, {check.coordinates.coordinates[0].toFixed(4)}
          </Text>
          
          <View style={styles.badges}>
            <Badge 
              label={isBurn ? 'Stubble Burn Detected' : 'Clear (No Burn)'}
              color={isBurn ? Colors.destructive : Colors.primary}
              bg={isBurn ? Colors.destructiveBg : Colors.primaryBg}
            />
            <Text style={styles.source}>{check.satellite_source} · {check.confidence} conf.</Text>
          </View>
        </View>
      </View>
    </Card>
  );
}

export default function SatelliteScreen() {
  const { satelliteChecks } = useBuyerStore();
  
  const total = satelliteChecks.length;
  const burns = satelliteChecks.filter(c => c.result === 'burn_detected').length;
  const clear = total - burns;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Satellite Checks</Text>
        <Text style={styles.subtitle}>
          Automated continuous monitoring of enrolled farms using Earth observation data.
        </Text>
      </View>

      <View style={styles.statsRow}>
        <Card style={styles.miniStat}>
          <Text style={[styles.statNum, { color: Colors.primary }]}>{clear}</Text>
          <Text style={styles.statLabel}>CLEAR FARMS</Text>
        </Card>
        <Card style={styles.miniStat}>
          <Text style={[styles.statNum, { color: Colors.destructive }]}>{burns}</Text>
          <Text style={styles.statLabel}>BURNS DETECTED</Text>
        </Card>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Observations</Text>
        {satelliteChecks.map(check => (
          <SatelliteRow key={check.id} check={check} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  contentContainer: { paddingTop: 60, paddingBottom: 100, paddingHorizontal: Spacing.xl, gap: Spacing.lg },

  header: { gap: 4 },
  title: { fontFamily: Fonts.display, fontSize: 26, color: Colors.text },
  subtitle: { fontFamily: Fonts.body, fontSize: 13, color: Colors.textSecondary, lineHeight: 20 },

  statsRow: { flexDirection: 'row', gap: Spacing.sm },
  miniStat: { flex: 1, padding: Spacing.lg, alignItems: 'center', gap: 4 },
  statNum: { fontFamily: Fonts.display, fontSize: 24 },
  statLabel: { fontFamily: Fonts.bodyMedium, fontSize: 10, color: Colors.textSecondary, letterSpacing: 0.5 },

  section: { gap: Spacing.md },
  sectionTitle: { fontFamily: Fonts.bodySemiBold, fontSize: 16, color: Colors.text },

  card: { padding: Spacing.lg },
  row: { flexDirection: 'row', gap: Spacing.md },
  iconBox: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  content: { flex: 1, gap: 4 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  farmerId: { fontFamily: Fonts.bodySemiBold, fontSize: 15, color: Colors.text },
  date: { fontFamily: Fonts.mono, fontSize: 12, color: Colors.textSecondary },
  coords: { fontFamily: Fonts.body, fontSize: 13, color: Colors.textSecondary },
  badges: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 },
  source: { fontFamily: Fonts.bodyMedium, fontSize: 11, color: Colors.textTertiary },
});
