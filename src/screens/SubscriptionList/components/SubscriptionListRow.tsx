import { memo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Subscription } from "../../../lib/types";

interface SubscriptionListItemProps {
  subscription: Subscription;
}

function SubscriptionListRow({ subscription }: SubscriptionListItemProps) {
  return (
    <View style={styles.row}>
      <View>
        <Text style={styles.name}>{subscription.name}</Text>
        <Text style={styles.date}>
          Next billing: {subscription.next_billing_date}
        </Text>
      </View>
      <Text style={styles.price}>
        {subscription.price} {subscription.currency}
      </Text>
    </View>
  );
}

export const SubscriptionListItem = memo(SubscriptionListRow);

const styles = StyleSheet.create({
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
});
