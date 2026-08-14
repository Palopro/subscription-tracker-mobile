import { memo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Subscription } from "../../../lib/types";
import { theme } from "../../../lib/theme";

interface SubscriptionListItemProps {
  subscription: Subscription;
  isLast?: boolean;
}

function formatDayMonth(dateStr: string): { day: string; month: string } {
  const date = new Date(dateStr);
  return {
    day: date.getDate().toString().padStart(2, "0"),
    month: date.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
  };
}

function isWithinDays(dateStr: string, days: number): boolean {
  const target = new Date(dateStr).getTime();
  const now = Date.now();
  const diff = target - now;
  return diff >= 0 && diff <= days * 24 * 60 * 60 * 1000;
}

function SubscriptionListItemComponent({
  subscription,
  isLast,
}: SubscriptionListItemProps) {
  const { day, month } = formatDayMonth(subscription.next_billing_date);
  const soon = isWithinDays(subscription.next_billing_date, 3);

  return (
    <View style={styles.row}>
      <View style={styles.timelineColumn}>
        <View style={[styles.dateBadge, soon && styles.dateBadgeSoon]}>
          <Text style={[styles.dateDay, soon && styles.dateDaySoon]}>
            {day}
          </Text>
          <Text style={[styles.dateMonth, soon && styles.dateMonthSoon]}>
            {month}
          </Text>
        </View>
        {!isLast && <View style={styles.connector} />}
      </View>

      <View style={styles.card}>
        <View style={styles.cardInfo}>
          <Text style={styles.name} numberOfLines={1}>
            {subscription.name}
          </Text>
          {subscription.category ? (
            <Text style={styles.category}>{subscription.category}</Text>
          ) : null}
        </View>
        <Text style={styles.price}>
          {subscription.price.toFixed(2)}
          <Text style={styles.currency}> {subscription.currency}</Text>
        </Text>
      </View>
    </View>
  );
}

export const SubscriptionListRow = memo(SubscriptionListItemComponent);

const styles = StyleSheet.create({
  row: { flexDirection: "row" },

  timelineColumn: { alignItems: "center", width: 52 },
  dateBadge: {
    width: 44,
    height: 44,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  dateBadgeSoon: { backgroundColor: theme.colors.upcomingMuted },
  dateDay: {
    fontFamily: theme.font.mono,
    fontSize: 15,
    fontWeight: "700",
    color: theme.colors.textPrimary,
    lineHeight: 17,
  },
  dateDaySoon: { color: theme.colors.upcoming },
  dateMonth: {
    fontSize: 9,
    fontWeight: "600",
    color: theme.colors.textSecondary,
    letterSpacing: 0.3,
  },
  dateMonthSoon: { color: theme.colors.upcoming },
  connector: {
    width: 1,
    flex: 1,
    minHeight: 12,
    backgroundColor: theme.colors.border,
    marginVertical: 4,
  },

  card: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginLeft: 10,
    marginBottom: 12,
  },
  cardInfo: { flex: 1, marginRight: 8 },
  name: {
    fontSize: 15,
    fontWeight: "600",
    color: theme.colors.textPrimary,
  },
  category: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  price: {
    fontFamily: theme.font.mono,
    fontSize: 15,
    fontWeight: "600",
    color: theme.colors.textPrimary,
  },
  currency: {
    fontFamily: theme.font.mono,
    fontSize: 12,
    fontWeight: "400",
    color: theme.colors.textSecondary,
  },
});
