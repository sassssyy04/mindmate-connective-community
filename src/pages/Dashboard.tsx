import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, ChartBar } from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();

  const { data: sentimentData } = useQuery({
    queryKey: ['sentiment-data', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sentiment_tracking')
        .select('*')
        .eq('user_id', user?.id);
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: activityData } = useQuery({
    queryKey: ['activity-data', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('activity_tracking')
        .select('*')
        .eq('user_id', user?.id);
      
      if (error) throw error;
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
              <div className="h-[400px]">
                <ChartContainer config={{}}>
                  <BarChart data={sentimentChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Activity Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ChartContainer config={{}}>
                  <BarChart data={activityChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#82ca9d" />
                  </BarChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;