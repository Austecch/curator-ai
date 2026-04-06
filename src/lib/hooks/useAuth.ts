"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/database";
import type { User, Session } from "@supabase/supabase-js";
import type { Profile } from "@/types";

interface AuthState {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  error: Error | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    profile: null,
    loading: true,
    error: null,
  });
  const router = useRouter();

  const fetchProfile = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    return data as Profile | null;
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const initAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Auth session error:", error);
          setState(prev => ({ ...prev, loading: false }));
          return;
        }
        
        if (session?.user) {
          try {
            const profile = await fetchProfile(session.user.id);
            setState({
              user: session.user,
              session,
              profile,
              loading: false,
              error: null,
            });
          } catch (profileError) {
            console.error("Profile fetch error:", profileError);
            setState({
              user: session.user,
              session,
              profile: null,
              loading: false,
              error: null,
            });
          }
        } else {
          setState(prev => ({ ...prev, loading: false }));
        }
      } catch (error) {
        console.error("Auth init error:", error);
        setState(prev => ({ ...prev, loading: false }));
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          try {
            const profile = await fetchProfile(session.user.id);
            setState({
              user: session.user,
              session,
              profile,
              loading: false,
              error: null,
            });
          } catch {
            setState({
              user: session.user,
              session,
              profile: null,
              loading: false,
              error: null,
            });
          }
        } else {
          setState({
            user: null,
            session: null,
            profile: null,
            loading: false,
            error: null,
          });
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  const signIn = async (email: string, password: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setState((prev) => ({ ...prev, loading: false, error: error as Error }));
      return { error };
    }

    if (data.user) {
      const profile = await fetchProfile(data.user.id);
      setState({
        user: data.user,
        session: data.session,
        profile,
        loading: false,
        error: null,
      });
    }

    return { error: null };
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      setState((prev) => ({ ...prev, loading: false, error: error as Error }));
      return { error };
    }

    return { error: null };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      router.push("/login");
    }
    return { error };
  };

  return {
    ...state,
    signIn,
    signUp,
    signOut,
    isAuthenticated: !!state.user,
  };
}
