import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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
      value: item.sentiment === 'positive' ? 1 : item.sentiment === 'neutral' ? 0 : -1,
      confidence: item.confidence_score,
      sentiment: item.sentiment
    }));
  };

  const formatActivityData = (data: any[]) => {
    if (!data) return [];
    
    return data.map(item => ({
      date: new Date(item.created_at).toLocaleDateString(),
      duration: item.duration_minutes,
      type: item.activity_type
    }));
  };

  const getSentimentColor = (dataPoint: any) => {
    if (!dataPoint) return '#049DD3'; // Default tribe-blue
    switch (dataPoint.sentiment) {
      case 'positive':
        return '#019640'; // tribe-green
      case 'neutral':
        return '#77C5BE'; // tribe-mint
      case 'negative':
        return '#6A1B9A'; // tribe-purple
      default:
        return '#049DD3'; // tribe-blue
    }
  };

  const renderContent = (
    rawData: any[], 
    isLoading: boolean, 
    error: any, 
    emptyMessage: string,
    formatFn: (data: any[]) => any[],
    renderProps: {
      dataKey: string;
      stroke?: string;
      name: string;
    }
  ) => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tribe-blue" />
        </div>
      );
    }

    if (error) {
      return (
        <Alert variant="destructive">
          <AlertDescription>
            Error loading data: {error.message}
          </AlertDescription>
        </Alert>
      );
    }

    if (!rawData?.length) {
      return (
        <Alert>
          <AlertDescription className="text-[#8E9196]">
            {emptyMessage}
          </AlertDescription>
        </Alert>
      );
    }

    const chartData = formatFn(rawData);

    return (
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis 
              dataKey="date" 
              stroke="#8E9196"
              tick={{ fill: '#8E9196' }}
              tickLine={{ stroke: '#8E9196' }}
            />
            <YAxis 
              stroke="#8E9196"
              tick={{ fill: '#8E9196' }}
              tickLine={{ stroke: '#8E9196' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Line 
              type="monotone"
              dataKey={renderProps.dataKey}
              stroke={renderProps.stroke || '#049DD3'}
              name={renderProps.name}
              strokeWidth={2}
              dot={renderProps.dataKey === 'value' ? {
                stroke: (dataPoint) => getSentimentColor(dataPoint),
                fill: (dataPoint) => getSentimentColor(dataPoint),
                r: 4
              } : { 
                stroke: renderProps.stroke || '#049DD3',
                strokeWidth: 2,
                r: 4
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
      
      <Tabs defaultValue="sentiment" className="space-y-4">
        <TabsList className="bg-white/80 backdrop-blur-sm">
          <TabsTrigger value="sentiment" className="flex items-center gap-2 data-[state=active]:bg-tribe-blue data-[state=active]:text-white">
            <ChartBar className="h-4 w-4" />
            Sentiment Analysis
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center gap-2 data-[state=active]:bg-tribe-blue data-[state=active]:text-white">
            <Activity className="h-4 w-4" />
            Activity Tracking
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sentiment">
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-[#221F26]">Sentiment Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              {renderContent(
                sentimentData,
                isSentimentLoading,
                sentimentError,
                "No sentiment data available yet. Start chatting to see your sentiment analysis!",
                formatSentimentData,
                {
                  dataKey: "value",
                  name: "Sentiment"
                }
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-[#221F26]">Activity Duration Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              {renderContent(
                activityData,
                isActivityLoading,
                activityError,
                "No activity data available yet. Your activities will be tracked as you use the app!",
                formatActivityData,
                {
                  dataKey: "duration",
                  stroke: "#77C5BE",
                  name: "Duration (minutes)"
                }
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;