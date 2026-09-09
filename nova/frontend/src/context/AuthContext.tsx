import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { authApi, clearToken, getToken, setToken } from "../api/client";
import type { User } from "../types";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    authApi
      .me()
      .then((res) => setUser(res.user))
      .catch(() => clearToken())
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setError(null);
    try {
      const res = await authApi.login({ email, password });
      setToken(res.token);
      setUser(res.user);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      throw e;
    }
  }, []);

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      setError(null);
      try {
        await authApi.register({ name, email, password });
        await login(email, password);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong");
        throw e;
      }
    },
    [login]
  );

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const value = useMemo(
    () => ({ user, loading, error, login, register, logout, clearError }),
    [user, loading, error, login, register, logout, clearError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
