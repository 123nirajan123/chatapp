import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { MessageWithUser, User } from '../types/database';
import { RealtimeChannel } from '@supabase/supabase-js';

export const useChat = (user: User | null) => {
  const [messages, setMessages] = useState<MessageWithUser[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  // Load initial messages
  useEffect(() => {
    if (!user) return;

    const loadMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select(`
            *,
            users (
              id,
              unique_id,
              name,
              email,
              avatar
            )
          `)
          .order('created_at', { ascending: true })
          .limit(100);

        if (error) {
          console.error('Error loading messages:', error);
          return;
        }

        if (data) {
          setMessages(data as MessageWithUser[]);
        }
      } catch (error) {
        console.error('Error loading messages:', error);
      }
    };

    loadMessages();
  }, [user]);

  // Set up real-time subscription
  useEffect(() => {
    if (!user) return;

    const setupRealtimeSubscription = () => {
      const newChannel = supabase
        .channel('messages')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages'
          },
          async (payload) => {
            // Fetch the complete message with user data
            const { data, error } = await supabase
              .from('messages')
              .select(`
                *,
                users (
                  id,
                  unique_id,
                  name,
                  email,
                  avatar
                )
              `)
              .eq('id', payload.new.id)
              .single();

            if (!error && data) {
              setMessages(prev => [...prev, data as MessageWithUser]);
            }
          }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            setIsConnected(true);
          } else if (status === 'CLOSED') {
            setIsConnected(false);
          }
        });

      setChannel(newChannel);
    };

    setupRealtimeSubscription();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [user]);

  const sendMessage = useCallback(async (content: string) => {
    if (!user || !content.trim()) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert([
          {
            user_id: user.id,
            content: content.trim(),
          }
        ]);

      if (error) {
        console.error('Error sending message:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }, [user]);

  return { messages, sendMessage, isConnected };
};