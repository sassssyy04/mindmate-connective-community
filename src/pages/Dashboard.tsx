import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
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
        .select('*')
        .eq('user_id', user?.id);
      
      if (error) throw error;
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
        .eq('user_id', user?.id);
      
      if (error) throw error;
      console.log('Activity data fetched:', data);
      return data;
    },
    enabled: !!user,
  });

  // Transform data for visualization
  const sentimentStats = sentimentData?.reduce((acc: any, curr) => {
    acc[curr.sentiment] = (acc[curr.sentiment] || 0) + 1;
    return acc;
  }, {});

  const sentimentChartData = sentimentStats ? Object.keys(sentimentStats).map(key => ({
    name: key,
    count: sentimentStats[key]
  })) : [];

  const activityStats = activityData?.reduce((acc: any, curr) => {
    acc[curr.activity_type] = (acc[curr.activity_type] || 0) + 1;
    return acc;
  }, {});

  const activityChartData = activityStats ? Object.keys(activityStats).map(key => ({
    name: key,
    count: activityStats[key]
  })) : [];

  const renderContent = (
    data: any[], 
    isLoading: boolean, 
    error: any, 
    emptyMessage: string,
    chartColor: string
  ) => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
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

    if (!data?.length) {
      return (
        <Alert>
          <AlertDescription>
            {emptyMessage}
          </AlertDescription>
        </Alert>
      );
    }

    return (
      <div className="h-[400px]">
        <ChartContainer config={{}}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill={chartColor} />
          </BarChart>
        </ChartContainer>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-6 pt-24">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <Tabs defaultValue="sentiment" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sentiment" className="flex items-center gap-2">
            <ChartBar className="h-4 w-4" />
            Sentiment Analysis
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Activity Tracking
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sentiment">
          <Card>
            <CardHeader>
              <CardTitle>Sentiment Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              {renderContent(
                sentimentChartData,
                isSentimentLoading,
                sentimentError,
                "No sentiment data available yet. Start chatting to see your sentiment analysis!",
                "#8884d8"
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Activity Summary</CardTitle>
            </CardHeader>
            <CardContent>
              {renderContent(
                activityChartData,
                isActivityLoading,
                activityError,
                "No activity data available yet. Your activities will be tracked as you use the app!",
                "#82ca9d"
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;