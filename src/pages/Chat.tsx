import { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { generateAIResponse, setApiKey } from "@/services/togetherAI";
import { ChatMessage } from "@/components/ChatMessage";
import { ApiKeyForm } from "@/components/ApiKeyForm";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your AI therapy assistant. How are you feeling today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKeyState] = useState<string | null>(null);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]); // Scroll whenever messages change

  const handleApiKeySubmit = (key: string) => {
    console.log("API key submitted in Chat component");
    setApiKey(key);
    setApiKeyState(key);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      console.log("Attempting to generate AI response");
      const aiResponseContent = await generateAIResponse(inputMessage);
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponseContent,
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error("Error generating AI response:", error);
      toast({
        title: "Error",
        description: "Failed to generate AI response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!apiKey) {
    return <ApiKeyForm onApiKeySubmit={handleApiKeySubmit} />;
  }

  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto px-4 pt-20 pb-4 bg-gradient-to-b from-[#fdfcfb] to-[#e2d1c3]">
      <div className="flex-1 space-y-4 mb-4">
        <ScrollArea ref={scrollAreaRef} className="h-[calc(100vh-180px)] pr-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                content={message.content}
                sender={message.sender}
                timestamp={message.timestamp}
              />
            ))}
          </div>
        </ScrollArea>
      </div>

      <form onSubmit={handleSendMessage} className="flex gap-2">
        <Input
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 bg-white/80 backdrop-blur-sm border-[#9b87f5]/20 focus:border-[#9b87f5]"
          disabled={isLoading}
        />
        <Button 
          type="submit" 
          size="icon" 
          disabled={isLoading}
          className="bg-[#9b87f5] hover:bg-[#7E69AB]"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}