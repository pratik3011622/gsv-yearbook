import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../lib/api';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing token and validate it
    const token = localStorage.getItem('token');
    if (token) {
      validateToken();
    } else {
      setLoading(false);
    }
  }, []);

  const validateToken = async () => {
    try {
      const userData = await api.getCurrentUser();
      setUser(userData.user);
      // Get full profile data
      const profileData = await api.getProfile(userData.user.id);
      setProfile(profileData);
    } catch (error) {
      console.error('Token validation failed:', error);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (userData) => {
    const result = await api.register(userData);
    if (result.user) {
      setUser(result.user);
      // Get full profile data
      const profileData = await api.getProfile(result.user.id);
      setProfile(profileData);
    }
    return result;
  };

  const signIn = async (email, password) => {
    const result = await api.login({ email, password });
    if (!result.user) {
      throw new Error(result.message || 'Login failed');
    }
    // Clear previous user data before setting new one
    setUser(null);
    setProfile(null);
    setUser(result.user);
    // Get full profile data
    try {
      const profileData = await api.getProfile(result.user.id);
      setProfile(profileData);
    } catch (error) {
      console.error('Error fetching profile after login:', error);
      // Set basic profile from login response as fallback
      setProfile({
        id: result.user.id,
        email: result.user.email,
        fullName: result.user.fullName,
        role: result.user.role,
      });
    }
    return result;
  };

  const googleSignIn = async (idToken) => {
    const result = await api.googleLogin(idToken);
    if (!result.user) {
      throw new Error(result.message || 'Google login failed');
    }
    // Clear previous user data before setting new one
    setUser(null);
    setProfile(null);
    setUser(result.user);
    // Get full profile data
    try {
      const profileData = await api.getProfile(result.user.id);
      setProfile(profileData);
    } catch (error) {
      console.error('Error fetching profile after Google login:', error);
      // Set basic profile from login response as fallback
      setProfile({
        id: result.user.id,
        email: result.user.email,
        fullName: result.user.fullName,
        role: result.user.role,
        avatarUrl: result.user.avatarUrl,
      });
    }
    return result;
  };

  const signOut = async () => {
    localStorage.removeItem('token');
    setUser(null);
    setProfile(null);
  };

  const updateProfile = async (updatedData) => {
    const result = await api.updateProfile(updatedData);
    setProfile(prev => ({ ...prev, ...result }));
    return result;
  };

  const value = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    googleSignIn,
    signOut,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};