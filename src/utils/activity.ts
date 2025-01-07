import { supabase } from "@/integrations/supabase/client";

export const trackActivity = async (
  userId: string, 
  activityType: string,
  options?: {
    duration?: number;
    steps?: number;
    sleep?: number;
    roomId?: string;
  }
) => {
  try {
    const { error } = await supabase
      .from('activity_tracking')
      .insert([{
        user_id: userId,
        activity_type: activityType,
        duration_minutes: options?.duration,
        steps_count: options?.steps,
        sleep_hours: options?.sleep,
        room_id: options?.roomId
      }]);

    if (error) throw error;
    console.log('Activity tracked:', activityType);
  } catch (error) {
    console.error('Error tracking activity:', error);
    throw error;
  }
};