import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useDisplayNames = (userIds: string[]) => {
  const [displayNames, setDisplayNames] = useState<Record<string, string>>({});

  const fetchDisplayNames = async (ids: string[]) => {
    try {
      console.log('Fetching display names for users:', ids);
      const { data, error } = await supabase
        .from('member_onboarding')
        .select('user_id, display_name')
        .in('user_id', ids);

      if (error) throw error;
      
      const names = data.reduce((acc, curr) => ({
        ...acc,
        [curr.user_id]: curr.display_name
      }), {});
      
      console.log('Display names fetched:', names);
      setDisplayNames(prev => ({ ...prev, ...names }));
    } catch (error) {
      console.error('Error fetching display names:', error);
    }
  };

  useEffect(() => {
    const missingUserIds = userIds.filter(id => !displayNames[id]);
    if (missingUserIds.length > 0) {
      fetchDisplayNames(missingUserIds);
    }
  }, [userIds]);

  return displayNames;
};