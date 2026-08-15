import Constants from "expo-constants";

import { supabase } from "../../../shared/lib/supabase";
import { NewSubscription, Subscription, SubscriptionsSummary } from "../types";

const API_URL = Constants.expoConfig?.extra?.apiUrl as string;

/**
 * Чистый слой доступа к данным подписок — только запросы к Supabase
 * и backend API, без React-состояния. Хуки вызывают эти функции
 * и управляют состоянием поверх них.
 */

export function querySubscriptions() {
  return supabase
    .from("subscriptions")
    .select("*")
    .eq("is_active", true)
    .order("next_billing_date", { ascending: true });
}

export async function insertSubscription(
  newSub: NewSubscription,
  userId: string,
): Promise<void> {
  const { error } = await supabase
    .from("subscriptions")
    .insert({ ...newSub, user_id: userId });

  if (error) throw error;
}

export async function deleteSubscriptionById(id: string): Promise<void> {
  const { error } = await supabase.from("subscriptions").delete().eq("id", id);

  if (error) throw error;
}

export async function querySummary(
  currency: string,
  accessToken: string,
): Promise<SubscriptionsSummary> {
  const response = await fetch(
    `${API_URL}/subscriptions/summary?currency=${currency}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Server error: ${response.status}`);
  }

  return response.json() as Promise<SubscriptionsSummary>;
}

export async function fetchSubscriptionById(id: string): Promise<Subscription> {
  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as Subscription;
}

export async function updateSubscription(
  id: string,
  updates: NewSubscription,
): Promise<void> {
  const { error } = await supabase
    .from("subscriptions")
    .update(updates)
    .eq("id", id);

  if (error) throw error;
}
