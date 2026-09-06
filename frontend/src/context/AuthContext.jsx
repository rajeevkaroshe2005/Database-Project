import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: 2,
    fullName: 'Priya Nair',
    email: 'priya.nair@example.com',
    phone: '+91 98450 67890',
    role: 'user',
    rewardPoints: 890,
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    membership: {
      tierName: 'Gold Elite',
      discountPct: 10,
      multiplier: 1.5,
      perks: '10% discount, 1.5x pts, priority support'
    }
  });

  const [isLoading, setIsLoading] = useState(false);

  const refreshProfile = async () => {
    if (!user?.id) return;
    try {
      const res = await api.getProfile(user.id);
      if (res.success && res.user) {
        setUser(res.user);
      }
    } catch (e) {
      console.warn('Profile refresh fallback', e);
    }
  };

  const switchRole = async (targetRole) => {
    setIsLoading(true);
    try {
      const res = await api.switchDemoRole(targetRole);
      if (res.success && res.user) {
        setUser(res.user);
      }
    } catch (e) {
      console.error('Role switch failed', e);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const res = await api.login(email, password);
      if (res.success && res.user) {
        setUser(res.user);
        return { success: true };
      }
    } catch (e) {
      return { success: false, message: e.message };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (formData) => {
    setIsLoading(true);
    try {
      const res = await api.register(formData);
      if (res.success && res.user) {
        setUser(res.user);
        return { success: true };
      }
    } catch (e) {
      return { success: false, message: e.message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, switchRole, login, register, logout, refreshProfile, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
