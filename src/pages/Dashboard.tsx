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

    if (!data?.length) {
      return (
        <Alert>
          <AlertDescription className="text-[#8E9196]">
            {emptyMessage}
          </AlertDescription>
        </Alert>
      );
    }

    return (
      <div className="h-[400px]">
        <ChartContainer config={{}}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis dataKey="name" stroke="#8E9196" />
            <YAxis stroke="#8E9196" />
            <Tooltip />
            <Bar dataKey="count" fill={chartColor} />
          </BarChart>
        </ChartContainer>
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
              <CardTitle className="text-[#221F26]">Sentiment Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              {renderContent(
                sentimentData,
                isSentimentLoading,
                sentimentError,
                "No sentiment data available yet. Start chatting to see your sentiment analysis!",
                "#049DD3"
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-[#221F26]">Activity Summary</CardTitle>
            </CardHeader>
            <CardContent>
              {renderContent(
                activityData,
                isActivityLoading,
                activityError,
                "No activity data available yet. Your activities will be tracked as you use the app!",
                "#049DD3"
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;