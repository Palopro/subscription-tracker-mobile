import { useCallback, useEffect, useState } from "react";

import { supabase } from "../../../shared/lib/supabase";
import { querySummary } from "../api/subscriptions.api";
import { SubscriptionsSummary } from "../types";

export const useSummary = (currency: string = "USD") => {
  const [summary, setSummary] = useState<SubscriptionsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const applySummaryResult = useCallback(
    (data: SubscriptionsSummary | null, fetchError: Error | null) => {
      if (fetchError) {
        setError(fetchError.message);
      } else if (data) {
        setSummary(data);
      }
      setLoading(false);
    },
    [],
  );

  const fetchSummary = useCallback(
    async (showLoading = false) => {
      if (showLoading) {
        setLoading(true);
        setError(null);
      }

      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) throw new Error("No active session");

        const data = await querySummary(currency, session.access_token);
        applySummaryResult(data, null);
      } catch (err) {
        applySummaryResult(
          null,
          err instanceof Error ? err : new Error("Unknown error"),
        );
      }
    },
    [applySummaryResult, currency],
  );

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) throw new Error("No active session");

        const data = await querySummary(currency, session.access_token);

        if (!cancelled) {
          applySummaryResult(data, null);
        }
      } catch (err) {
        if (!cancelled) {
          applySummaryResult(
            null,
            err instanceof Error ? err : new Error("Unknown error"),
          );
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [applySummaryResult, currency]);

  return { summary, loading, error, refetch: () => fetchSummary(true) };
};
