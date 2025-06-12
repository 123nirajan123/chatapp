import { useState, useEffect } from 'react';
import { User as AuthUser } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { User } from '../types/database';
import { jwtDecode } from 'jwt-decode';

interface GoogleJWTPayload {
  sub: string;
  email: string;
  name?: string;
  picture?: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setAuthUser(session.user);
        await fetchUserProfile(session.user.id);
      }
      setIsLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setAuthUser(session.user);
          await fetchUserProfile(session.user.id);
        } else {
          setAuthUser(null);
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user profile:', error);
        return;
      }

      if (data) {
        setUser(data);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const loginWithGoogle = async (credentialResponse: { credential: string }) => {
    try {
      setIsLoading(true);
      
      // Decode the JWT token from Google
      const decoded = jwtDecode<GoogleJWTPayload>(credentialResponse.credential);
      
      // Sign in with Supabase using the Google ID token
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: credentialResponse.credential,
      });

      if (error) {
        console.error('Supabase auth error:', error);
        throw error;
      }

      if (data.user) {
        // Check if user profile exists
        const { data: existingUser } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (!existingUser) {
          // Create user profile if it doesn't exist
          const uniqueId = Math.floor(100000 + Math.random() * 900000).toString();
          
          const newUser = {
            id: data.user.id,
            unique_id: uniqueId,
            name: decoded.name || decoded.email.split('@')[0],
            email: decoded.email,
            avatar: decoded.picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${decoded.email}`,
          };

          const { error: insertError } = await supabase
            .from('users')
            .insert([newUser]);

          if (insertError) {
            console.error('Error creating user profile:', insertError);
            throw insertError;
          }

          setUser(newUser);
        } else {
          setUser(existingUser);
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
      }
      setUser(null);
      setAuthUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating profile:', error);
        throw error;
      }

      if (data) {
        setUser(data);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  return { 
    user, 
    authUser, 
    isLoading, 
    login: loginWithGoogle, 
    logout, 
    updateProfile 
  };
};