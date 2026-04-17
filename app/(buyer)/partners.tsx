import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Linking } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors, Fonts, Spacing, Radius } from '../../lib/theme';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useBuyerStore } from '../../stores/buyerStore';
import type { ValidatingAuthority } from '../../lib/types';

function AuthorityCard({
  authority,
  onPartner,
}: {
  authority: ValidatingAuthority;
  onPartner: () => void;
}) {
  return (
    <Card style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.titleArea}>
          <Text style={styles.name}>{authority.name}</Text>
          <Text style={styles.region}>📍 {authority.region}</Text>
        </View>
        <Badge
          label={authority.partnered ? 'Partner' : 'Available'}
          color={authority.partnered ? Colors.primary : Colors.textSecondary}
          bg={authority.partnered ? Colors.primaryBg : 'rgba(107,114,128,0.15)'}
        />
      </View>

      <View style={styles.accBadge}>
        <Feather name="shield" size={14} color={Colors.primary} />
        <Text style={styles.accText}>{authority.accreditation}</Text>
      </View>

      <View style={styles.tagsContainer}>
        {authority.specializations.map((spec) => (
          <View key={spec} style={styles.tag}>
            <Text style={styles.tagText}>{spec}</Text>
          </View>
        ))}
      </View>

      {!authority.partnered ? (
        <Button title="Request Partnership" onPress={onPartner} size="sm" />
      ) : (
        <View style={styles.partneredControls}>
          <Button
            title="View Active Jobs"
            variant="secondary"
            size="sm"
            style={{ flex: 1 }}
            onPress={() => {}}
          />
          <Button
            title="Message"
            variant="secondary"
            size="sm"
            icon={<Feather name="message-circle" size={16} color={Colors.primary} />}
            onPress={() => {}}
          />
        </View>
      )}
    </Card>
  );
}

export default function PartnersScreen() {
  const { authorities, partnerWithAuthority } = useBuyerStore();

  const handlePartner = (authority: ValidatingAuthority) => {
    Alert.alert(
      'Partnership Request Sent',
      `We have notified ${authority.name}. Once they accept, they will handle field verification for your campaigns.`,
      [{ text: 'OK', onPress: () => partnerWithAuthority(authority.id) }]
    );
  };

  const partnered = authorities.filter((a) => a.partnered);
  const available = authorities.filter((a) => !a.partnered);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Partners</Text>
        <Text style={styles.subtitle}>
          Connect with approved Validating Authorities to verify your carbon credits on the ground.
        </Text>
      </View>

      {partnered.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Partners</Text>
          {partnered.map((a) => (
            <AuthorityCard key={a.id} authority={a} onPartner={() => {}} />
          ))}
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Available Authorities</Text>
        {available.map((a) => (
          <AuthorityCard key={a.id} authority={a} onPartner={() => handlePartner(a)} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  content: { paddingTop: 60, paddingBottom: 100, paddingHorizontal: Spacing.xl, gap: Spacing.lg },

  header: { marginBottom: Spacing.sm },
  title: { fontFamily: Fonts.display, fontSize: 28, color: Colors.text },
  subtitle: {
    fontFamily: Fonts.body,
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 6,
    lineHeight: 20,
  },

  section: { gap: Spacing.md },
  sectionTitle: { fontFamily: Fonts.bodySemiBold, fontSize: 16, color: Colors.text },

  card: { padding: Spacing.lg, gap: Spacing.md },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  titleArea: { flex: 1, gap: 2 },
  name: { fontFamily: Fonts.bodySemiBold, fontSize: 16, color: Colors.text },
  region: { fontFamily: Fonts.bodyMedium, fontSize: 13, color: Colors.textSecondary },

  accBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(74,222,128,0.08)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radius.sm,
    alignSelf: 'flex-start',
  },
  accText: { fontFamily: Fonts.mono, fontSize: 12, color: Colors.primary },

  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tag: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tagText: { fontFamily: Fonts.body, fontSize: 11, color: Colors.textSecondary },

  partneredControls: { flexDirection: 'row', gap: Spacing.sm },
});
