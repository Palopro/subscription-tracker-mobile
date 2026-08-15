import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useCallback, useLayoutEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { IconButton } from "../../../shared/components/buttons";
import { RootStackParamList } from "../../../shared/lib/navigation.types";
import { theme } from "../../../shared/lib/theme";
import { useSignOut } from "../../auth/hooks/useSignOut";
import { SubscriptionListRow } from "../components/SubscriptionListRow";
import { useSubscriptions } from "../hooks/useSubscriptions";
import { useSummary } from "../hooks/useSummary";
import { Subscription } from "../types";

export default function SubscriptionsListScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {
    subscriptions,
    loading: subsLoading,
    deleteSubscription,
    refetch,
  } = useSubscriptions();
  const {
    summary,
    loading: summaryLoading,
    refetch: refetchSummary,
  } = useSummary("USD");

  const { signOut } = useSignOut();

  const handleSignOutPress = useCallback(() => {
    Alert.alert("Sign out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign out", style: "destructive", onPress: signOut },
    ]);
  }, [signOut]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <IconButton
          name="log-out-outline"
          color={theme.colors.textSecondary}
          backgroundColor={theme.colors.surfaceMuted}
          onPress={handleSignOutPress}
        />
      ),
      headerRight: () => (
        <IconButton
          name="add"
          onPress={() => navigation.navigate("AddSubscription")}
        />
      ),
    });
  }, [navigation, handleSignOutPress]);

  const handleRefresh = () => {
    refetch();
    refetchSummary();
  };

  const handleEdit = useCallback(
    (subscription: Subscription) => {
      navigation.navigate("AddSubscription", {
        subscriptionId: subscription.id,
      });
    },
    [navigation],
  );

  const handleDelete = useCallback(
    (subscription: Subscription) => {
      Alert.alert(
        "Delete subscription",
        `Are you sure you want to delete "${subscription.name}"?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              try {
                await deleteSubscription(subscription.id);
              } catch (err) {
                Alert.alert(
                  "Error",
                  err instanceof Error
                    ? err.message
                    : "Could not delete subscription",
                );
              }
            },
          },
        ],
      );
    },
    [deleteSubscription],
  );

  if (subsLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.accent} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.summaryCard}>
        <View style={styles.summaryPrimary}>
          <Text style={styles.summaryLabel}>Monthly spend</Text>
          <Text style={styles.summaryValue}>
            {summaryLoading ? "—" : `$${summary?.monthlyTotal ?? 0}`}
          </Text>
        </View>

        <View style={styles.summaryDivider} />

        <View style={styles.summarySecondary}>
          <Text style={styles.summarySecondaryLabel}>Yearly</Text>
          <Text style={styles.summarySecondaryValue}>
            {summaryLoading ? "—" : `$${summary?.yearlyTotal ?? 0}`}
          </Text>
        </View>

        <View style={styles.summarySecondary}>
          <Text style={styles.summarySecondaryLabel}>Active</Text>
          <Text style={styles.summarySecondaryValue}>
            {summaryLoading ? "—" : (summary?.activeCount ?? 0)}
          </Text>
        </View>
      </View>

      <Text style={styles.sectionLabel}>Upcoming</Text>

      <FlatList
        data={subscriptions}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={subsLoading}
            onRefresh={handleRefresh}
            tintColor={theme.colors.accent}
          />
        }
        renderItem={({ item, index }) => (
          <SubscriptionListRow
            subscription={item}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isLast={index === subscriptions.length - 1}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <View style={styles.emptyIconWrap}>
              <Ionicons
                name="wallet-outline"
                size={28}
                color={theme.colors.textMuted}
              />
            </View>
            <Text style={styles.empty}>No subscriptions yet</Text>
            <Text style={styles.emptySubtext}>
              Tap the + button to add your first one
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
  },

  summaryCard: {
    flexDirection: "row",
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.lg,
    margin: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  summaryPrimary: { flex: 1.4 },
  summaryLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: theme.colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  summaryValue: {
    fontFamily: theme.font.mono,
    fontSize: 30,
    fontWeight: "600",
    color: theme.colors.textPrimary,
    marginTop: 6,
  },
  summaryDivider: {
    width: 1,
    backgroundColor: theme.colors.border,
    marginHorizontal: theme.spacing.md,
  },
  summarySecondary: { flex: 1, justifyContent: "center" },
  summarySecondaryLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  summarySecondaryValue: {
    fontFamily: theme.font.mono,
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.textPrimary,
    marginTop: 4,
  },

  sectionLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.4,
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },

  listContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },

  emptyState: { alignItems: "center", marginTop: 72, gap: 6 },
  emptyIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.sm,
  },
  empty: {
    fontSize: 15,
    fontWeight: "600",
    color: theme.colors.textPrimary,
  },
  emptySubtext: { fontSize: 13, color: theme.colors.textSecondary },
});
