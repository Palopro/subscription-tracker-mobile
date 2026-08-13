import { Session } from "@supabase/supabase-js";

import { supabase } from "../lib/supabase";

import { useEffect, useState } from "react";

export const useAuth = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
      },
    );

    return () => listener.subscription.unsubscribe();
  }, []);
  return { session, loading };
};
