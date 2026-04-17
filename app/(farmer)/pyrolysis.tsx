import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Linking } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors, Fonts, Spacing, Radius } from '../../lib/theme';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useFarmerStore } from '../../stores/farmerStore';
import type { PyrolysisProvider } from '../../lib/types';

function ProviderCard({ provider }: { provider: PyrolysisProvider }) {
  const isSelf = provider.type === 'self';
  const isNgo = provider.type === 'ngo';

  const handleContact = () => {
    if (isSelf) {
      // Could open a YouTube tutorial or guide
      Alert.alert('DIY Guide', 'Opening instructions for Kon Tiki Kiln...');
    } else {
      Linking.openURL(`tel:${provider.contact_phone}`);
    }
  };

  return (
    <Card style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.titleArea}>
          <Text style={styles.name}>{provider.name}</Text>
          <Text style={styles.region}>📍 {provider.region}</Text>
        </View>
        <View 
          style={[
            styles.typeBadge, 
            isNgo && styles.typeNgo,
            isSelf && styles.typeSelf
          ]}
        >
          <Text style={[
            styles.typeText,
            isNgo && { color: Colors.primary },
            isSelf && { color: Colors.textSecondary },
          ]}>
            {provider.type.toUpperCase()}
          </Text>
        </View>
      </View>

      <Text style={styles.description}>{provider.description}</Text>

      <View style={styles.metaRow}>
        <View style={styles.metaBox}>
          <Feather name="dollar-sign" size={14} color={Colors.textSecondary} />
          <Text style={styles.metaText}>{provider.cost_estimate}</Text>
        </View>
        {provider.rating && (
          <View style={styles.metaBox}>
            <Feather name="star" size={14} color={Colors.secondary} />
            <Text style={styles.metaText}>{provider.rating}/5.0</Text>
          </View>
        )}
      </View>

      <Button
        title={isSelf ? 'View Guide' : 'Contact Provider'}
        onPress={handleContact}
        size="sm"
        variant={isSelf ? 'secondary' : 'primary'}
        icon={!isSelf ? <Feather name="phone" size={16} color={Colors.textOnPrimary} /> : undefined}
      />
    </Card>
  );
}

export default function PyrolysisScreen() {
  const { pyrolysisProviders } = useFarmerStore();

  const vendors = pyrolysisProviders.filter(p => p.type === 'vendor');
  const ngos = pyrolysisProviders.filter(p => p.type === 'ngo');
  const self = pyrolysisProviders.filter(p => p.type === 'self');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Pyrolysis Setup</Text>
        <Text style={styles.subtitle}>
          Get help creating biochar. Contact local professional kilns, subsidized NGOs, or learn how to build your own pit.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Free & Subsidized (NGOs)</Text>
        {ngos.map(p => (
           <ProviderCard key={p.id} provider={p} />
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Professional Vendors</Text>
        {vendors.map(p => (
           <ProviderCard key={p.id} provider={p} />
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Do It Yourself</Text>
        {self.map(p => (
           <ProviderCard key={p.id} provider={p} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  contentContainer: { paddingTop: 60, paddingBottom: 100, paddingHorizontal: Spacing.xl, gap: Spacing.xxl },

  header: { gap: 4 },
  title: { fontFamily: Fonts.display, fontSize: 26, color: Colors.text },
  subtitle: { fontFamily: Fonts.body, fontSize: 13, color: Colors.textSecondary, lineHeight: 20 },

  section: { gap: Spacing.md },
  sectionTitle: { fontFamily: Fonts.bodySemiBold, fontSize: 18, color: Colors.text },

  card: { padding: Spacing.lg, gap: Spacing.md },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  titleArea: { flex: 1, gap: 2 },
  name: { fontFamily: Fonts.bodySemiBold, fontSize: 16, color: Colors.text },
  region: { fontFamily: Fonts.bodyMedium, fontSize: 13, color: Colors.textSecondary },

  typeBadge: { 
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: Radius.pill,
    backgroundColor: 'rgba(255,255,255,0.1)' 
  },
  typeNgo: { backgroundColor: Colors.primaryBg },
  typeSelf: { backgroundColor: Colors.surface },
  typeText: { fontFamily: Fonts.mono, fontSize: 10, color: Colors.text, textTransform: 'uppercase' },

  description: { fontFamily: Fonts.body, fontSize: 14, color: Colors.textSecondary, lineHeight: 20 },

  metaRow: { flexDirection: 'row', gap: Spacing.lg },
  metaBox: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { fontFamily: Fonts.bodyMedium, fontSize: 13, color: Colors.textSecondary },
});
