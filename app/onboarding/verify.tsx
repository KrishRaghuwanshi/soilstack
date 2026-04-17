import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Colors, Fonts, Spacing, Radius } from '../../lib/theme';
import { useAuthStore } from '../../stores/authStore';

export default function VerifyScreen() {
  const { phone, role } = useLocalSearchParams<{ phone: string; role: string }>();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(30);
  const [error, setError] = useState('');
  const inputs = useRef<(TextInput | null)[]>([]);
  const { loginAsFarmer, loginAsValidator, loginAsBuyer } = useAuthStore();

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleChange = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);
    setError('');

    if (text && index < 5) {
      inputs.current[index + 1]?.focus();
    }

    // Auto-submit on 6th digit
    if (index === 5 && text) {
      const fullCode = newCode.join('');
      handleVerify(fullCode);
    }
  };

  const handleVerify = async (fullCode: string) => {
    // In production: supabase.auth.verifyOtp({ phone, token: fullCode, type: 'sms' })
    // For demo: accept any 6-digit code
    if (fullCode.length === 6) {
      if (role === 'farmer') {
        loginAsFarmer();
        router.replace('/(farmer)/home' as any);
      } else if (role === 'validator') {
        loginAsValidator();
        router.replace('/(validator)/jobs' as any);
      } else {
        loginAsBuyer();
        router.replace('/(buyer)/market' as any);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Verify OTP</Text>
          <Text style={styles.subtitle}>
            Enter the 6-digit code sent to {phone}
          </Text>
        </View>

        <View style={styles.codeRow}>
          {code.map((digit, i) => (
            <TextInput
              key={i}
              ref={(ref) => { inputs.current[i] = ref; }}
              style={[
                styles.digitBox,
                digit ? styles.digitBoxFilled : null,
                error ? styles.digitBoxError : null,
              ]}
              value={digit}
              onChangeText={(t) => handleChange(t, i)}
              keyboardType="number-pad"
              maxLength={1}
              selectionColor={Colors.primary}
              autoFocus={i === 0}
            />
          ))}
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Text style={styles.resend}>
          {countdown > 0
            ? `Resend code in ${countdown}s`
            : 'Resend code'}
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
  codeRow: { flexDirection: 'row', gap: Spacing.sm, justifyContent: 'center' },
  digitBox: {
    width: 48, height: 56, backgroundColor: Colors.card, borderWidth: 1,
    borderColor: Colors.border, borderRadius: Radius.md,
    textAlign: 'center', fontFamily: Fonts.display, fontSize: 22,
    color: Colors.text,
  },
  digitBoxFilled: { borderColor: Colors.primary, backgroundColor: Colors.surface },
  digitBoxError: { borderColor: Colors.destructive },
  error: { fontFamily: Fonts.body, fontSize: 13, color: Colors.destructive, textAlign: 'center' },
  resend: { fontFamily: Fonts.bodyMedium, fontSize: 14, color: Colors.textSecondary, textAlign: 'center' },
});
