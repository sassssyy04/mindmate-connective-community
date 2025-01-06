import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChatMessage } from "@/components/ChatMessage";
import { EmptyRoomMessage } from "./EmptyRoomMessage";
import { useMessages } from "@/hooks/useMessages";
import { useDisplayNames } from "@/hooks/useDisplayNames";
import { supabase } from "@/integrations/supabase/client";

interface ChatContainerProps {
  currentRoom: any;
  currentUserId: string;
}

export const ChatContainer = ({ currentRoom, currentUserId }: ChatContainerProps) => {
  const [message, setMessage] = useState("");
  const [roomMembers, setRoomMembers] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const channelRef = useRef<any>(null);
  
  const { messages, sendMessage, fetchMessages } = useMessages(currentRoom?.id);
  const userIds = [...new Set(messages.map(msg => msg.user_id))];
  const displayNames = useDisplayNames(userIds);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Set up real-time subscription
  useEffect(() => {
    if (!currentRoom?.id) return;

    console.log('Setting up message subscription for room:', currentRoom.id);
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
        (payload) => {
          console.log('New message received:', payload);
          fetchMessages();
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
  }, [currentRoom?.id, fetchMessages]);

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

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !currentRoom) return;

    await sendMessage(message, currentUserId);
    setMessage("");
    scrollToBottom();
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
            displayName={displayNames[msg.user_id]}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="flex gap-2">
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