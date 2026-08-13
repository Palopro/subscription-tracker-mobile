import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  Alert,
  Pressable,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSubscriptions } from "../../hooks/useSubscriptions";
import { BillingCycle } from "../../lib/types";
import { RootStackParamList } from "../../lib/navigation.types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

const BILLING_CYCLES: { label: string; value: BillingCycle }[] = [
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
  { label: "Yearly", value: "yearly" },
];

export default function AddSubscriptionScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { addSubscription } = useSubscriptions();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
  const [nextBillingDate, setNextBillingDate] = useState("");
  const [category, setCategory] = useState("");
  const [saving, setSaving] = useState(false);

  const isValid =
    name.trim().length > 0 &&
    Number(price) > 0 &&
    /^\d{4}-\d{2}-\d{2}$/.test(nextBillingDate);

  const handleSave = async () => {
    if (!isValid) {
      Alert.alert(
        "Check the fields",
        "Fill in name, price, and date as YYYY-MM-DD",
      );
      return;
    }

    setSaving(true);
    try {
      await addSubscription({
        name: name.trim(),
        price: Number(price),
        currency: currency.trim().toUpperCase(),
        billing_cycle: billingCycle,
        next_billing_date: nextBillingDate,
        category: category.trim() || undefined,
      });
      navigation.goBack();
    } catch (err) {
      Alert.alert(
        "Error",
        err instanceof Error ? err.message : "Could not save subscription",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Netflix"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Price</Text>
      <TextInput
        style={styles.input}
        placeholder="15.99"
        keyboardType="decimal-pad"
        value={price}
        onChangeText={setPrice}
      />

      <Text style={styles.label}>Currency</Text>
      <TextInput
        style={styles.input}
        placeholder="USD"
        autoCapitalize="characters"
        maxLength={3}
        value={currency}
        onChangeText={setCurrency}
      />

      <Text style={styles.label}>Billing cycle</Text>
      <View style={styles.cycleRow}>
        {BILLING_CYCLES.map((cycle) => (
          <Pressable
            key={cycle.value}
            style={[
              styles.cycleButton,
              billingCycle === cycle.value && styles.cycleButtonActive,
            ]}
            onPress={() => setBillingCycle(cycle.value)}
          >
            <Text
              style={[
                styles.cycleButtonText,
                billingCycle === cycle.value && styles.cycleButtonTextActive,
              ]}
            >
              {cycle.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.label}>Next billing date</Text>
      <TextInput
        style={styles.input}
        placeholder="2026-08-15"
        value={nextBillingDate}
        onChangeText={setNextBillingDate}
      />

      <Text style={styles.label}>Category (optional)</Text>
      <TextInput
        style={styles.input}
        placeholder="Entertainment"
        value={category}
        onChangeText={setCategory}
      />

      <View style={styles.saveButton}>
        <Button
          title={saving ? "Saving..." : "Save"}
          onPress={handleSave}
          disabled={saving || !isValid}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 60 },
  label: { fontSize: 14, color: "#666", marginBottom: 6, marginTop: 16 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  cycleRow: { flexDirection: "row", gap: 8 },
  cycleButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
  },
  cycleButtonActive: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  cycleButtonText: { color: "#333", fontSize: 13 },
  cycleButtonTextActive: { color: "#fff", fontWeight: "600" },
  saveButton: { marginTop: 32 },
});
