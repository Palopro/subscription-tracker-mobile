import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  ListRenderItemInfo,
  Pressable,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSubscriptions } from "../../hooks/useSubscriptions";
import { useSummary } from "../../hooks/useSummary";
import { useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { SubscriptionListItem } from "./components/SubscriptionListRow";
import { Subscription } from "../../lib/types";
import { RootStackParamList } from "../../lib/navigation.types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export default function SubscriptionsListScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { subscriptions, loading: subsLoading, refetch } = useSubscriptions();
  const {
    summary,
    loading: summaryLoading,
    refetch: refetchSummary,
  } = useSummary("USD");

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={() => navigation.navigate("AddSubscription")}>
          <MaterialIcons name="add" size={24} color="black" />
        </Pressable>
      ),
    });
  }, [navigation]);

  if (subsLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const handleRefresh = () => {
    refetch();
    refetchSummary();
  };

  const renderItem = ({ item }: ListRenderItemInfo<Subscription>) => (
    <SubscriptionListItem subscription={item} />
  );

  return (
    <View style={styles.container}>
      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>Per month</Text>
        <Text style={styles.summaryValue}>
          {summaryLoading ? "..." : `$${summary?.monthlyTotal ?? 0}`}
        </Text>
      </View>

      <FlatList
        data={subscriptions}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={subsLoading} onRefresh={handleRefresh} />
        }
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.empty}>
            No subscriptions yet — add your first one
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  summaryCard: {
    backgroundColor: "#f2f2f7",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  summaryLabel: { color: "#666", fontSize: 14 },
  summaryValue: { fontSize: 28, fontWeight: "700", marginTop: 4 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#ddd",
  },
  name: { fontSize: 16, fontWeight: "500" },
  date: { fontSize: 13, color: "#888", marginTop: 2 },
  price: { fontSize: 16, fontWeight: "600" },
  empty: { textAlign: "center", marginTop: 40, color: "#999" },
});
