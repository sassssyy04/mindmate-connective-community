import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Activity, ChartBar } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Dashboard = () => {
  const { user } = useAuth();

  const { data: sentimentData, isLoading: isSentimentLoading, error: sentimentError } = useQuery({
    queryKey: ['sentiment-data', user?.id],
    queryFn: async () => {
      console.log('Fetching sentiment data for user:', user?.id);
      const { data, error } = await supabase
        .from('sentiment_tracking')
        .select(`
          id,
          sentiment,
          confidence_score,
          created_at,
          messages (
            content
          )
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: true });
      
      if (error) {
        console.error('Error fetching sentiment data:', error);
        throw error;
      }
      console.log('Sentiment data fetched:', data);
      return data;
    },
    enabled: !!user,
  });

  const { data: activityData, isLoading: isActivityLoading, error: activityError } = useQuery({
    queryKey: ['activity-data', user?.id],
    queryFn: async () => {
      console.log('Fetching activity data for user:', user?.id);
      const { data, error } = await supabase
        .from('activity_tracking')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: true });
      
      if (error) {
        console.error('Error fetching activity data:', error);
        throw error;
      }
      console.log('Activity data fetched:', data);
      return data;
    },
    enabled: !!user,
  });

  const formatSentimentData = (data: any[]) => {
    if (!data) return [];
    
    return data.map(item => ({
      date: new Date(item.created_at).toLocaleDateString(),
      sentiment: item.sentiment === 'positive' ? 1 : item.sentiment === 'neutral' ? 0 : -1,
      confidence: item.confidence_score,
      sentimentType: item.sentiment,
    }));
  };

  const formatActivityData = (data: any[]) => {
    if (!data) return [];
    
    return data.map(item => ({
      date: new Date(item.created_at).toLocaleDateString(),
      activity: item.duration_minutes,
      type: item.activity_type
    }));
  };

  const combineData = (sentimentData: any[], activityData: any[]) => {
    const combinedMap = new Map();
    
    sentimentData.forEach(item => {
      combinedMap.set(item.date, { 
        date: item.date,
        sentiment: item.sentiment,
        sentimentType: item.sentimentType
      });
    });

    activityData.forEach(item => {
      const existing = combinedMap.get(item.date) || { date: item.date };
      combinedMap.set(item.date, {
        ...existing,
        activity: item.activity
      });
    });

    return Array.from(combinedMap.values());
  };

  const renderContent = (
    sentimentRawData: any[],
    activityRawData: any[],
    isSentimentLoading: boolean,
    isActivityLoading: boolean,
    sentimentError: any,
    activityError: any
  ) => {
    if (isSentimentLoading || isActivityLoading) {
      return (
        <div className="flex items-center justify-center h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tribe-blue" />
        </div>
      );
    }

    if (sentimentError || activityError) {
      return (
        <Alert variant="destructive">
          <AlertDescription>
            Error loading data: {(sentimentError || activityError)?.message}
          </AlertDescription>
        </Alert>
      );
    }

    if (!sentimentRawData?.length && !activityRawData?.length) {
      return (
        <Alert>
          <AlertDescription className="text-[#8E9196]">
            No data available yet. Start using the app to see your analytics!
          </AlertDescription>
        </Alert>
      );
    }

    const formattedSentimentData = formatSentimentData(sentimentRawData);
    const formattedActivityData = formatActivityData(activityRawData);
    const combinedData = combineData(formattedSentimentData, formattedActivityData);

    return (
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart 
            data={combinedData} 
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis 
              dataKey="date" 
              stroke="#8E9196"
              tick={{ fill: '#8E9196' }}
              tickLine={{ stroke: '#8E9196' }}
            />
            <YAxis 
              yAxisId="sentiment"
              stroke="#FF1493"
              tick={{ fill: '#FF1493' }}
              tickLine={{ stroke: '#FF1493' }}
              domain={[-1, 1]}
              label={{ value: 'Sentiment', angle: -90, position: 'insideLeft', fill: '#FF1493' }}
            />
            <YAxis 
              yAxisId="activity"
              orientation="right"
              stroke="#FF6B00"
              tick={{ fill: '#FF6B00' }}
              tickLine={{ stroke: '#FF6B00' }}
              label={{ value: 'Activity (minutes)', angle: 90, position: 'insideRight', fill: '#FF6B00' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend />
            <Line
              yAxisId="sentiment"
              type="monotone"
              dataKey="sentiment"
              name="Sentiment"
              stroke="#FF1493"
              strokeWidth={2}
              dot={{
                stroke: '#FF1493',
                strokeWidth: 2,
                r: 4,
                fill: '#FFFFFF'
              }}
              activeDot={{ r: 6, strokeWidth: 2 }}
            />
            <Line
              yAxisId="activity"
              type="monotone"
              dataKey="activity"
              name="Activity"
              stroke="#FF6B00"
              strokeWidth={2}
              dot={{
                stroke: '#FF6B00',
                strokeWidth: 2,
                r: 4,
                fill: '#FFFFFF'
              }}
              activeDot={{ r: 6, strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-6 pt-24 bg-gradient-to-b from-[#fdfcfb] to-[#e2d1c3] min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-[#221F26]">Dashboard</h1>
      
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-[#221F26]">Activity & Sentiment Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          {renderContent(
            sentimentData,
            activityData,
            isSentimentLoading,
            isActivityLoading,
            sentimentError,
            activityError
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;