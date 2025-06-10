import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

export interface User {
  id: number;
  username: string;
  email: string;
  photo?: string;
  role: string;
  name?: string; // Добавляем для совместимости с ProfilePage
  description?: string; // Добавляем для совместимости с ProfilePage
}

interface AuthContextType {
  user: User | null;
  login: (userData: User | string) => Promise<void>; // Изменяем сигнатуру
  logout: () => void;
  updateProfile: (updatedUser: User) => void;
  token?: string; // Добавляем токен в контекст
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }
  }, []);

  const login = async (credentials: User | string) => {
    // Если переданы данные пользователя напрямую (старый вариант)
    if (typeof credentials !== 'string') {
      setUser(credentials);
      localStorage.setItem('user', JSON.stringify(credentials));
      return;
    }
    
    // Новый вариант - принимаем только токен
    try {
      const token = credentials;
      const response = await fetch('http://localhost:3000/users/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const userData = await response.json();
      setUser(userData);
      setToken(token);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const updateProfile = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      updateProfile,
      token: token || undefined 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};