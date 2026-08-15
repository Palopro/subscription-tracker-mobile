import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { PrimaryButton } from "../../../shared/components/buttons";
import { Field, TextField } from "../../../shared/components/forms";
import { RootStackParamList } from "../../../shared/lib/navigation.types";
import { theme } from "../../../shared/lib/theme";
import { fetchSubscriptionById } from "../api/subscriptions.api";
import { useSubscriptions } from "../hooks/useSubscriptions";
import { BillingCycle } from "../types";

const BILLING_CYCLES: { label: string; value: BillingCycle }[] = [
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
  { label: "Yearly", value: "yearly" },
];

type AddSubscriptionRouteProp = RouteProp<
  RootStackParamList,
  "AddSubscription"
>;

export default function AddSubscriptionScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<AddSubscriptionRouteProp>();
  const subscriptionId = route.params?.subscriptionId;
  const isEditMode = !!subscriptionId;

  const { addSubscription, updateSubscription } = useSubscriptions();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
  const [nextBillingDate, setNextBillingDate] = useState("");
  const [category, setCategory] = useState("");
  const [saving, setSaving] = useState(false);
  const [loadingExisting, setLoadingExisting] = useState(isEditMode);

  useEffect(() => {
    navigation.setOptions({
      title: isEditMode ? "Edit Subscription" : "New Subscription",
    });
  }, [navigation, isEditMode]);

  useEffect(() => {
    if (!subscriptionId) return;

    let cancelled = false;

    (async () => {
      try {
        const existing = await fetchSubscriptionById(subscriptionId);
        if (cancelled) return;

        setName(existing.name);
        setPrice(String(existing.price));
        setCurrency(existing.currency);
        setBillingCycle(existing.billing_cycle);
        setNextBillingDate(existing.next_billing_date);
        setCategory(existing.category ?? "");
      } catch (err) {
        if (!cancelled) {
          Alert.alert(
            "Error",
            err instanceof Error ? err.message : "Could not load subscription",
          );
          navigation.goBack();
        }
      } finally {
        if (!cancelled) setLoadingExisting(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [subscriptionId, navigation]);

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
      const payload = {
        name: name.trim(),
        price: Number(price),
        currency: currency.trim().toUpperCase(),
        billing_cycle: billingCycle,
        next_billing_date: nextBillingDate,
        category: category.trim() || undefined,
      };

      if (isEditMode && subscriptionId) {
        await updateSubscription(subscriptionId, payload);
      } else {
        await addSubscription(payload);
      }

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

  if (loadingExisting) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.accent} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Field label="Name">
        <TextField placeholder="Netflix" value={name} onChangeText={setName} />
      </Field>

      <View style={styles.row}>
        <View style={styles.rowItem}>
          <Field label="Price">
            <TextField
              placeholder="15.99"
              keyboardType="decimal-pad"
              value={price}
              onChangeText={setPrice}
            />
          </Field>
        </View>
        <View style={styles.rowItemSmall}>
          <Field label="Currency">
            <TextField
              placeholder="USD"
              autoCapitalize="characters"
              maxLength={3}
              value={currency}
              onChangeText={setCurrency}
            />
          </Field>
        </View>
      </View>

      <Field label="Billing cycle">
        <View style={styles.cycleRow}>
          {BILLING_CYCLES.map((cycle) => {
            const active = billingCycle === cycle.value;
            return (
              <Pressable
                key={cycle.value}
                style={[styles.cycleButton, active && styles.cycleButtonActive]}
                onPress={() => setBillingCycle(cycle.value)}
              >
                <Text
                  style={[
                    styles.cycleButtonText,
                    active && styles.cycleButtonTextActive,
                  ]}
                >
                  {cycle.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </Field>

      <Field label="Next billing date">
        <TextField
          placeholder="2026-08-15"
          value={nextBillingDate}
          onChangeText={setNextBillingDate}
        />
      </Field>

      <Field label="Category (optional)">
        <TextField
          placeholder="Entertainment"
          value={category}
          onChangeText={setCategory}
        />
      </Field>

      <View style={styles.saveButtonWrap}>
        <PrimaryButton
          title={isEditMode ? "Save changes" : "Save subscription"}
          onPress={handleSave}
          disabled={!isValid}
          loading={saving}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: theme.colors.background },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
  },
  container: { padding: theme.spacing.lg, paddingBottom: 60 },

  row: { flexDirection: "row", gap: theme.spacing.md },
  rowItem: { flex: 2 },
  rowItemSmall: { flex: 1 },

  cycleRow: { flexDirection: "row", gap: theme.spacing.sm },
  cycleButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    alignItems: "center",
  },
  cycleButtonActive: {
    backgroundColor: theme.colors.accent,
    borderColor: theme.colors.accent,
  },
  cycleButtonText: {
    color: theme.colors.textSecondary,
    fontSize: 13,
    fontWeight: "500",
  },
  cycleButtonTextActive: { color: "#FFFFFF", fontWeight: "600" },

  saveButtonWrap: { marginTop: theme.spacing.md },
});
