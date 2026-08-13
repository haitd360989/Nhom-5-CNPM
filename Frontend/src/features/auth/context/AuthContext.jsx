import { createContext, useContext, useMemo, useState } from "react";
import { HOMES, LABELS, ROLES } from "../config/roles.js";

const AuthContext = createContext(null);
const STORAGE_KEY = "swr-act-user";

const getInitialUser = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY));
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getInitialUser);
  const login = (role) => {
    if (!Object.values(ROLES).includes(role)) throw Error("Invalid role");
    const authenticatedUser = { id: `mock-${role}`, name: LABELS[role], role };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(authenticatedUser));
    setUser(authenticatedUser);
    return HOMES[role];
  };
  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };
  const value = useMemo(
    () => ({ user, login, logout, isAuthenticated: !!user }),
    [user],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
