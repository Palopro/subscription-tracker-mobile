import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { NewSubscription, Subscription } from "../lib/types";

async function querySubscriptions() {
  return supabase
    .from("subscriptions")
    .select("*")
    .eq("is_active", true)
    .order("next_billing_date", { ascending: true });
}

export function useSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const applySubscriptionsResult = useCallback(
    ({
      data,
      error: fetchError,
    }: Awaited<ReturnType<typeof querySubscriptions>>) => {
      if (fetchError) {
        setError(fetchError.message);
      } else {
        setSubscriptions(data as Subscription[]);
      }
      setLoading(false);
    },
    [],
  );

  const fetchSubscriptions = useCallback(
    async (showLoading = false) => {
      if (showLoading) {
        setLoading(true);
        setError(null);
      }

      const result = await querySubscriptions();
      applySubscriptionsResult(result);
    },
    [applySubscriptionsResult],
  );

  const addSubscription = useCallback(
    async (newSub: NewSubscription) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("Пользователь не авторизован");

      const { error: insertError } = await supabase
        .from("subscriptions")
        .insert({ ...newSub, user_id: user.id });

      if (insertError) throw insertError;

      await fetchSubscriptions(true);
    },
    [fetchSubscriptions],
  );

  const deleteSubscription = useCallback(
    async (id: string) => {
      const { error: deleteError } = await supabase
        .from("subscriptions")
        .delete()
        .eq("id", id);

      if (deleteError) throw deleteError;

      await fetchSubscriptions(true);
    },
    [fetchSubscriptions],
  );

  useEffect(() => {
    let cancelled = false;

    querySubscriptions().then((result) => {
      if (!cancelled) {
        applySubscriptionsResult(result);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [applySubscriptionsResult]);

  return {
    subscriptions,
    loading,
    error,
    refetch: () => fetchSubscriptions(true),
    addSubscription,
    deleteSubscription,
  };
}
