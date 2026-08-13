import { useCallback, useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import { supabase } from "../lib/supabase";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = useCallback(async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log("Login request sent:", { email, error });
    } catch (error) {
      console.error("Error logging in:", error);
    } finally {
      setLoading(false);
    }
  }, [email, password]);

  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <Text>Subscription Tracker</Text>

      <TextInput
        placeholder="email@email.com"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <View style={{ marginVertical: 12 }}>
        <Button
          title={loading ? "Logging in..." : "Sign In"}
          onPress={handleLogin}
          disabled={loading || !email}
        />
      </View>
    </View>
  );
}
