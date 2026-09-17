import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { authApi } from "../api/authApi";
import { userApi } from "../api/userApi";
import { tokenStorage } from "../api/tokenStorage";
import type { LoginRequest, RegisterRequest } from "../types/auth";
import type { User } from "../types/user";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const accessToken = tokenStorage.getAccessToken();
    if (!accessToken) {
      setIsLoading(false);
      return;
    }
    userApi
      .getCurrentUser()
      .then(setUser)
      .catch(() => tokenStorage.clearTokens())
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (data: LoginRequest) => {
    const authResponse = await authApi.login(data);
    tokenStorage.setTokens(authResponse.accessToken, authResponse.refreshToken);
    setUser(await userApi.getCurrentUser());
  }, []);

  const register = useCallback(async (data: RegisterRequest) => {
    const authResponse = await authApi.register(data);
    tokenStorage.setTokens(authResponse.accessToken, authResponse.refreshToken);
    setUser(await userApi.getCurrentUser());
  }, []);

  const logout = useCallback(async () => {
    const refreshToken = tokenStorage.getRefreshToken();
    tokenStorage.clearTokens();
    setUser(null);
    if (refreshToken) {
      await authApi.logout(refreshToken).catch(() => undefined);
    }
  }, []);

  const value = useMemo(
    () => ({ user, isLoading, login, register, logout }),
    [user, isLoading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
