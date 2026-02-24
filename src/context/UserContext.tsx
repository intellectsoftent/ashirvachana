import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authApi, getUserToken, setUserToken, clearUserToken } from "@/lib/api";

interface User {
  name: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
}

interface UserContextType {
  user: User | null;
  isLoggedIn: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (data: { name: string; email: string; password: string; phone: string }) => Promise<boolean>;
  logout: () => void;
}

const UserContext = createContext<UserContextType>({} as UserContextType);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // On mount, check if we have a stored token and fetch profile
  useEffect(() => {
    const token = getUserToken();
    if (token) {
      authApi
        .getProfile()
        .then((res) => setUser(res.user ?? res))
        .catch(() => clearUserToken())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await authApi.login({ email, password });
      setUserToken(res.token);
      setUser(res.user);
      return true;
    } catch {
      return false;
    }
  };

  const signup = async (data: { name: string; email: string; password: string; phone: string }): Promise<boolean> => {
    try {
      const res = await authApi.signup(data);
      setUserToken(res.token);
      setUser(res.user);
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    clearUserToken();
  };

  return (
    <UserContext.Provider value={{ user, isLoggedIn: !!user, loading, login, signup, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
