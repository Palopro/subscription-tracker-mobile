import { useCallback, useEffect, useState } from "react";
import Constants from "expo-constants";
import { supabase } from "../lib/supabase";

interface CategoryBreakdown {
  category: string;
  monthlyTotal: number;
}

interface SubscriptionsSummary {
  currency: string;
  monthlyTotal: number;
  yearlyTotal: number;
  activeCount: number;
  byCategory: CategoryBreakdown[];
  upcoming: {
    id: string;
    name: string;
    price: number;
    nextBillingDate: string;
  }[];
}

const API_URL = Constants.expoConfig?.extra?.apiUrl as string;

async function querySummary(currency: string, accessToken: string) {
  const response = await fetch(
    `${API_URL}/subscriptions/summary?currency=${currency}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Ошибка сервера: ${response.status}`);
  }

  return response.json() as Promise<SubscriptionsSummary>;
}

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

        if (!session) throw new Error("Нет активной сессии");

        const data = await querySummary(currency, session.access_token);
        applySummaryResult(data, null);
      } catch (err) {
        applySummaryResult(
          null,
          err instanceof Error ? err : new Error("Неизвестная ошибка"),
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

        if (!session) throw new Error("Нет активной сессии");

        const data = await querySummary(currency, session.access_token);

        if (!cancelled) {
          applySummaryResult(data, null);
        }
      } catch (err) {
        if (!cancelled) {
          applySummaryResult(
            null,
            err instanceof Error ? err : new Error("Неизвестная ошибка"),
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
