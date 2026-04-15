import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { UserProfile } from "@/interfaces/auth.interface";
import { clearStoredSession, getSession, saveSession } from "@/utils/authStorage";
import { normalizeRole } from '@/utils/authHelpers';

type Session = {
  token: string;
  userId: number;
  email: string;
  role: string;
};

type AuthContextType = {
  session: Session | null;
  profile: UserProfile | null;
  isBooting: boolean;
  setAuthSession: (session: Session) => Promise<void>;
  clearSession: () => Promise<void>;
  setProfile: (profile: UserProfile | null) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfileState] = useState<UserProfile | null>(null);
  const [isBooting, setIsBooting] = useState(true);

  useEffect(() => {
    (async () => {
      const stored = await getSession();
      if (stored) {
        setSession({ ...stored, role: normalizeRole(stored.role) });
      }
      setIsBooting(false);
    })();
  }, []);

  const value = useMemo(
    () => ({
      session,
      profile,
      isBooting,
      setAuthSession: async (nextSession: Session) => {
        const normalizedSession = { ...nextSession, role: normalizeRole(nextSession.role) };
        setSession(normalizedSession);
        await saveSession(normalizedSession);
      },
      clearSession: async () => {
        setSession(null);
        setProfileState(null);
        await clearStoredSession();
      },
      setProfile: (nextProfile: UserProfile | null) => {
        setProfileState(nextProfile ? { ...nextProfile, role: normalizeRole(nextProfile.role) } : null);
      },
    }),
    [session, profile, isBooting]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
};
