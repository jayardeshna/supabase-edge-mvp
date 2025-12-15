import { useState, useCallback } from 'react';
import { supabase } from '@/utils/supabase';
import { Experience } from '@/types';
import { Alert } from 'react-native';

export function useExperiences(sessionToken: string | undefined) {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchExperiences = useCallback(async () => {
    if (!sessionToken) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('get-experiences', {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      });

      if (error) throw error;

      setExperiences(data?.data || []);
    } catch (err: any) {
      console.error(err);
      const msg = err.message?.includes("Network request failed")
        ? "Network error. Check connection."
        : err.message || "Failed to fetch.";
      Alert.alert("Error", msg);
    } finally {
      setLoading(false);
    }
  }, [sessionToken]);

  return { experiences, loading, fetchExperiences };
}
