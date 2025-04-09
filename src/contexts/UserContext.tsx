
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types/user';

interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  signIn: (user: User) => void;
  signOut: () => void;
  updateUser: (user: User) => void;
}

const defaultUser: User = {
  id: '1',
  name: 'John Doe',
  phone: '1234567890',
  email: 'john.doe@example.com',
  rating: 4.9,
  bookingCount: 24,
  memberSince: 'April 2025'
};

const UserContext = createContext<UserContextType>({
  user: null,
  isAuthenticated: false,
  signIn: () => {},
  signOut: () => {},
  updateUser: () => {}
});

export const useUser = () => useContext(UserContext);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Check if user is already logged in from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const signIn = (userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const signOut = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <UserContext.Provider value={{ user, isAuthenticated, signIn, signOut, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};
