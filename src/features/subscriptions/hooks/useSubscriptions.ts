import { useCallback, useEffect, useState } from "react";

import { supabase } from "../../../shared/lib/supabase";
import {
  deleteSubscriptionById,
  insertSubscription,
  querySubscriptions,
  updateSubscription as apiUpdateSubscription,
} from "../api/subscriptions.api";
import { NewSubscription, Subscription } from "../types";

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

      if (!user) throw new Error("Not authenticated");

      await insertSubscription(newSub, user.id);
      await fetchSubscriptions(true);
    },
    [fetchSubscriptions],
  );

  const deleteSubscription = useCallback(
    async (id: string) => {
      await deleteSubscriptionById(id);
      await fetchSubscriptions(true);
    },
    [fetchSubscriptions],
  );

  const updateSubscription = useCallback(
    async (id: string, updates: NewSubscription) => {
      await apiUpdateSubscription(id, updates);
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
    updateSubscription,
    deleteSubscription,
  };
}
