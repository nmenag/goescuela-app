import React, { createContext, useContext, useState } from "react";

export interface AuthContextType {
  isAuthenticated: boolean;
  user: { email: string; name: string } | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ email: string; name: string } | null>(
    null,
  );

  const login = async (email: string, password: string) => {
    // Simulate API call delay
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        // Simple validation
        if (email && password && password.length >= 6) {
          setIsAuthenticated(true);
          setUser({ email, name: "Sarah Chen" });
          resolve();
        } else {
          throw new Error("Invalid email or password");
        }
      }, 800);
    });
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
