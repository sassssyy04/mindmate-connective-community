import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { AuthForm } from "@/components/AuthForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Send } from "lucide-react";
import { ChatMessage } from "@/components/ChatMessage";

const Community = () => {
  const { user, supabase } = useAuth();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      // Fetch initial messages
      fetchMessages();

      // Subscribe to new messages
      const channel = supabase
        .channel('messages')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages'
          },
          (payload) => {
            console.log('New message received:', payload);
            setMessages(prev => [...prev, payload.new]);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user, supabase]);

  const fetchMessages = async () => {
    try {
      console.log('Fetching messages...');
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        throw error;
      }

      console.log('Messages fetched:', data);
      setMessages(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      console.log('Sending message:', message);
      const { error } = await supabase
        .from("messages")
        .insert([{ content: message, user_id: user?.id }]);

      if (error) throw error;

      setMessage("");
      toast({
        title: "Message sent",
        description: "Your message has been sent successfully",
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-cream-50 pt-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Join Our Community
            </h1>
            <p className="text-xl text-gray-600">
              Sign in to access peer support and chat with others
            </p>
          </motion.div>
          <AuthForm />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50 pt-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Peer Support Chat
          </h1>
          <p className="text-xl text-gray-600">
            Connect with others in a safe, supportive environment
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6">
          <div className="h-96 overflow-y-auto mb-4 space-y-4">
            {messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                content={msg.content}
                sender={msg.user_id === user.id ? "user" : "ai"}
                timestamp={new Date(msg.created_at)}
              />
            ))}
          </div>

          <form onSubmit={sendMessage} className="flex gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
            />
            <Button type="submit">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Community;