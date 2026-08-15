import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { PrimaryButton } from "../../../shared/components/buttons";
import { TextField } from "../../../shared/components/forms";
import { supabase } from "../../../shared/lib/supabase";
import { theme } from "../../../shared/lib/theme";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const canSubmit = email.length > 0 && password.length > 0;

  const handleSignIn = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);

    if (error) {
      Alert.alert("Sign in failed", error.message);
    }
  };

  const handleSignUp = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);

    if (error) {
      Alert.alert("Sign up failed", error.message);
    } else {
      Alert.alert(
        "Account created",
        "If email confirmation is enabled, check your inbox. Otherwise you can sign in right away.",
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.logoMark}>
            <Text style={styles.logoMarkText}>$</Text>
          </View>
          <Text style={styles.title}>Subscription Tracker</Text>
          <Text style={styles.subtitle}>
            Know exactly where your money goes
          </Text>
        </View>

        <View style={styles.form}>
          <TextField
            placeholder="you@example.com"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <TextField
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <PrimaryButton
            title={isSignUp ? "Sign up" : "Sign in"}
            onPress={isSignUp ? handleSignUp : handleSignIn}
            disabled={!canSubmit}
            loading={loading}
          />

          <Text
            style={styles.switchText}
            onPress={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp ? "Already have an account? " : "Don't have an account? "}
            <Text style={styles.switchTextAccent}>
              {isSignUp ? "Sign in" : "Sign up"}
            </Text>
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: theme.colors.background },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: theme.spacing.xl,
  },
  header: { alignItems: "center", marginBottom: theme.spacing.xxl },
  logoMark: {
    width: 56,
    height: 56,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.accent,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.lg,
  },
  logoMarkText: {
    fontFamily: theme.font.mono,
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: theme.colors.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 6,
  },
  form: { gap: theme.spacing.md },
  switchText: {
    marginTop: theme.spacing.lg,
    textAlign: "center",
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
  switchTextAccent: { color: theme.colors.accent, fontWeight: "600" },
});
