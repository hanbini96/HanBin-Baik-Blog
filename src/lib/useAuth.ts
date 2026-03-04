import { useEffect, useState } from 'react';
import { supabase } from './supabase';
import type { Session } from '@supabase/supabase-js';

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setSession(session);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to get session');
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setSession(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to logout');
    }
  };

  return { session, loading, error, logout };
}
