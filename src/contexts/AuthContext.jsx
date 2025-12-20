import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

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
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      (async () => {
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
          setLoading(false);
        }
      })();
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles') // Ensure your table in Supabase is named 'profiles' (lowercase)
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email, password, userData) => {
    // 1. Create the user in Supabase Auth (Secure)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    // 2. Create the public profile (Do NOT send password here)
    if (data.user) {
      const { error: profileError } = await supabase.from('profiles').insert([
        {
          id: data.user.id,
          email: data.user.email,
          // Explicitly map fields to avoid sending 'password' or 'confirmPassword'
          full_name: userData.full_name,
          batch_year: userData.batch_year,
          department: userData.department,
          current_company: userData.current_company,
          location: userData.location,
          user_type: userData.user_type,
          // Set roles/status
          role: userData.user_type, // or 'student'/'alumni' based on your logic
          approval_status: 'pending',
        },
      ]);

      if (profileError) throw profileError;
    }

    return data;
  };

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    if (data.user) {
      // Check if user is approved before letting them fully in
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('approval_status')
        .eq('id', data.user.id)
        .maybeSingle();

      if (profileError) throw profileError;

      if (profile && profile.approval_status === 'pending') {
        await supabase.auth.signOut();
        throw new Error('Your account is pending approval. Please wait for an administrator to approve your registration.');
      }

      if (profile && profile.approval_status === 'rejected') {
        await supabase.auth.signOut();
        throw new Error('Your account registration was rejected. Please contact support for more information.');
      }
    }

    return data;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const updateProfile = async (updatedData) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updatedData)
        .eq('id', user.id);

      if (error) throw error;

      setProfile(prev => ({ ...prev, ...updatedData }));
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const value = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};