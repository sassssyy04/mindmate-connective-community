import { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ChatMessage } from "@/components/ChatMessage";
import { supabase } from "@/integrations/supabase/client";
import { EmptyRoomMessage } from "./EmptyRoomMessage";

interface Message {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
  room_id: string;
}

interface ChatContainerProps {
  currentRoom: any;
  currentUserId: string;
}

export const ChatContainer = ({ currentRoom, currentUserId }: ChatContainerProps) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [roomMembers, setRoomMembers] = useState<any[]>([]);
  const [userDisplayNames, setUserDisplayNames] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const channelRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!currentRoom?.id) return;

    console.log('Setting up message subscription for room:', currentRoom.id);
    fetchMessages(currentRoom.id);
    fetchRoomMembers(currentRoom.id);

    if (channelRef.current) {
      console.log('Cleaning up previous subscription');
      supabase.removeChannel(channelRef.current);
    }

    channelRef.current = supabase
      .channel(`room:${currentRoom.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `room_id=eq.${currentRoom.id}`
        },
        async (payload: { new: Message }) => {
          console.log('New message received:', payload.new);
          // Fetch display name for new message if not already cached
          if (!userDisplayNames[payload.new.user_id]) {
            await fetchDisplayName(payload.new.user_id);
          }
          setMessages(prevMessages => [...prevMessages, payload.new]);
          scrollToBottom();
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });

    return () => {
      if (channelRef.current) {
        console.log('Cleaning up subscription');
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [currentRoom?.id]);

  const fetchDisplayName = async (userId: string) => {
    try {
      console.log('Fetching display name for user:', userId);
      const { data, error } = await supabase
        .from('member_onboarding')
        .select('display_name')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      
      if (data) {
        console.log('Display name fetched:', data.display_name, 'for user:', userId);
        setUserDisplayNames(prev => ({
          ...prev,
          [userId]: data.display_name
        }));
      }
    } catch (error) {
      console.error('Error fetching display name:', error);
    }
  };

  const fetchMessages = async (roomId: string) => {
    try {
      console.log('Fetching messages for room:', roomId);
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('room_id', roomId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      console.log('Messages fetched:', data);
      setMessages(data || []);

      // Fetch display names for all unique users
      const uniqueUserIds = [...new Set(data?.map(msg => msg.user_id) || [])];
      uniqueUserIds.forEach(userId => {
        if (!userDisplayNames[userId]) {
          fetchDisplayName(userId);
        }
      });

      scrollToBottom();
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  const fetchRoomMembers = async (roomId: string) => {
    try {
      const { data, error } = await supabase
        .from('room_members')
        .select('*')
        .eq('room_id', roomId);

      if (error) throw error;
      setRoomMembers(data || []);
    } catch (error) {
      console.error('Error fetching room members:', error);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !currentRoom) return;

    try {
      console.log('Sending message to room:', currentRoom.id);
      const { error } = await supabase
        .from("messages")
        .insert([{ 
          content: message.trim(), 
          user_id: currentUserId,
          room_id: currentRoom.id 
        }]);

      if (error) throw error;

      setMessage("");
      scrollToBottom();
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  const isUserAlone = roomMembers.length <= 1;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="font-semibold mb-4">{currentRoom.name}</h2>
      
      {isUserAlone && <EmptyRoomMessage />}

      <div className="h-[500px] overflow-y-auto mb-4 space-y-4">
        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            content={msg.content}
            sender={msg.user_id === currentUserId ? "user" : "ai"}
            timestamp={new Date(msg.created_at)}
            displayName={userDisplayNames[msg.user_id]}
          />
        ))}
        <div ref={messagesEndRef} />
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
  );
};