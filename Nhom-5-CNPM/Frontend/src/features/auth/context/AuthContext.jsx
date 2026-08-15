import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authApi } from "../api.js";
import { HOMES } from "../config/roles.js";

const AuthContext = createContext(null);
const TOKEN_KEY = "swr-act-tokens";

const readTokens = () => {
  try {
    return JSON.parse(localStorage.getItem(TOKEN_KEY));
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [tokens, setTokens] = useState(readTokens);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tokens?.access_token) {
      setLoading(false);
      return;
    }
    authApi
      .me(tokens.access_token)
      .then(setUser)
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        setTokens(null);
      })
      .finally(() => setLoading(false));
  }, [tokens?.access_token]);

  const login = async (email, password) => {
    const nextTokens = await authApi.login(email, password);
    const nextUser = await authApi.me(nextTokens.access_token);
    localStorage.setItem(TOKEN_KEY, JSON.stringify(nextTokens));
    setTokens(nextTokens);
    setUser(nextUser);
    return HOMES[nextUser.role];
  };

  const register = (data) => authApi.register(data);

  const logout = async () => {
    if (tokens?.access_token)
      await authApi.logout(tokens.access_token).catch(() => {});
    localStorage.removeItem(TOKEN_KEY);
    setTokens(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, login, register, logout, loading, isAuthenticated: !!user }),
    [user, loading, tokens],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
