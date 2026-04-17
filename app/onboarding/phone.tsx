import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Colors, Fonts, Spacing, Radius, Sizes } from '../../lib/theme';
import { Button } from '../../components/ui/Button';

export default function PhoneScreen() {
  const { role } = useLocalSearchParams<{ role: string }>();
  const [phone, setPhone] = useState('');
  const [countryCode] = useState('+91');
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    if (phone.length < 10) return;
    setLoading(true);
    // In production: supabase.auth.signInWithOtp({ phone: countryCode + phone })
    setTimeout(() => {
      setLoading(false);
      router.push({ pathname: '/onboarding/verify', params: { phone: countryCode + phone, role } });
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Enter phone number</Text>
          <Text style={styles.subtitle}>We'll send you a verification code</Text>
        </View>

        <View style={styles.inputRow}>
          <View style={styles.codeBox}>
            <Text style={styles.codeText}>{countryCode}</Text>
          </View>
          <View style={styles.phoneInput}>
            <TextInput
              style={styles.input}
              placeholder="98765 43210"
              placeholderTextColor={Colors.textTertiary}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              maxLength={10}
              selectionColor={Colors.primary}
              autoFocus
            />
          </View>
        </View>

        <Button
          title="Send OTP"
          onPress={handleSendOTP}
          loading={loading}
          disabled={phone.length < 10}
        />

        <Text style={styles.terms}>
          By continuing you agree to our Terms of Service and Privacy Policy
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  content: { flex: 1, paddingHorizontal: Spacing.xl, justifyContent: 'center', gap: Spacing.xxl },
  header: { gap: Spacing.xs },
  title: { fontFamily: Fonts.display, fontSize: 28, color: Colors.text },
  subtitle: { fontFamily: Fonts.body, fontSize: 15, color: Colors.textSecondary },
  inputRow: { flexDirection: 'row', gap: Spacing.md },
  codeBox: {
    backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border,
    borderRadius: Radius.md, height: Sizes.inputHeight, paddingHorizontal: Spacing.lg,
    justifyContent: 'center',
  },
  codeText: { fontFamily: Fonts.bodyMedium, fontSize: 16, color: Colors.text },
  phoneInput: {
    flex: 1, backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border,
    borderRadius: Radius.md, height: Sizes.inputHeight, paddingHorizontal: Spacing.lg,
    justifyContent: 'center',
  },
  input: { fontFamily: Fonts.body, fontSize: 18, color: Colors.text, letterSpacing: 1 },
  terms: { fontFamily: Fonts.body, fontSize: 12, color: Colors.textTertiary, textAlign: 'center' },
});
