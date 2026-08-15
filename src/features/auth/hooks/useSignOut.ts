import { useCallback, useState } from "react";

import { supabase } from "../../../shared/lib/supabase";

export const useSignOut = () => {
  const [loading, setLoading] = useState(false);

  const signOut = useCallback(async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setLoading(false);
    // onAuthStateChange в useAuthSession поймает событие SIGNED_OUT
    // и обнулит session сам — App.tsx переключит навигацию на LoginScreen
  }, []);

  return { signOut, loading };
};
