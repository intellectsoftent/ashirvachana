import { createContext, useContext, useState, ReactNode } from "react";

interface User {
  name: string;
  email: string;
  phone: string;
}

interface UserContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const UserContext = createContext<UserContextType>({} as UserContextType);

const DUMMY_USER: User = {
  name: "Rahul Sharma",
  email: "user@test.com",
  phone: "+91 98765-43210",
};

const DUMMY_PASSWORD = "password123";

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("user_auth");
    return stored ? JSON.parse(stored) : null;
  });

  const login = (email: string, password: string): boolean => {
    if (email === DUMMY_USER.email && password === DUMMY_PASSWORD) {
      setUser(DUMMY_USER);
      localStorage.setItem("user_auth", JSON.stringify(DUMMY_USER));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user_auth");
  };

  return (
    <UserContext.Provider value={{ user, isLoggedIn: !!user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
