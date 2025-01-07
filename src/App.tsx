import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "react-hot-toast";
import Navigation from "@/components/Navigation";
import Index from "@/pages/Index";
import Chat from "@/pages/Chat";
import Dashboard from "@/pages/Dashboard";
import Resources from "@/pages/Resources";
import Community from "@/pages/Community";

const queryClient = new QueryClient();

function App() {
  return (
    <Router>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <Navigation />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/community" element={<Community />} />
          </Routes>
          <Toaster />
        </QueryClientProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
