import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, getCurrentUser, getUserProfile } from '../lib/supabase';
import { useToast } from './ToastContext';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    // Initial auth check
    checkUser();
    
    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          const user = session.user;
          setUser(user);
          try {
            const profile = await getUserProfile(user.id);
            setProfile(profile);
          } catch (error) {
            console.error('Error fetching user profile:', error);
          }
        } else {
          setUser(null);
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  const checkUser = async () => {
    try {
      const user = await getCurrentUser();
      setUser(user);
      
      if (user) {
        const profile = await getUserProfile(user.id);
        setProfile(profile);
      }
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const { user } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (user) {
        const profile = await getUserProfile(user.id);
        setProfile(profile);
        showToast('Login successful!', 'success');
        return { user, profile };
      }
    } catch (error) {
      showToast(error.message || 'Failed to log in', 'error');
      throw error;
    }
  };

  const register = async (email, password, userData) => {
    try {
      const { user } = await supabase.auth.signUp({
        email,
        password
      });
      
      if (user) {
        // Add the user's profile data to the profiles table
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            { 
              id: user.id,
              ...userData
            }
          ]);
        
        if (profileError) throw profileError;
        
        const profile = await getUserProfile(user.id);
        setProfile(profile);
        showToast('Registration successful!', 'success');
        return { user, profile };
      }
    } catch (error) {
      showToast(error.message || 'Failed to register', 'error');
      throw error;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      showToast('Logged out successfully', 'success');
    } catch (error) {
      showToast(error.message || 'Failed to log out', 'error');
      throw error;
    }
  };

  const updateProfile = async (profileData) => {
    try {
      if (!user) throw new Error('No user logged in');
      
      const { error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', user.id);
      
      if (error) throw error;
      
      const updatedProfile = await getUserProfile(user.id);
      setProfile(updatedProfile);
      showToast('Profile updated successfully', 'success');
      return updatedProfile;
    } catch (error) {
      showToast(error.message || 'Failed to update profile', 'error');
      throw error;
    }
  };

  const value = {
    user,
    profile,
    loading,
    login,
    register,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};