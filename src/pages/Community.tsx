import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { AuthForm } from "@/components/AuthForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Send } from "lucide-react";

const Community = () => {
  const { user, supabase } = useAuth();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const { toast } = useToast();

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      const { error } = await supabase
        .from("messages")
        .insert([{ content: message, user_id: user?.id || "anonymous" }]);

      if (error) throw error;

      setMessage("");
      toast({
        title: "Message sent",
        description: "Your message has been sent successfully",
      });
    } catch (error) {
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
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg ${
                  msg.user_id === user.id
                    ? "bg-sage-300 ml-auto"
                    : "bg-gray-100"
                } max-w-[80%]`}
              >
                <p className="text-sm">{msg.content}</p>
              </div>
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