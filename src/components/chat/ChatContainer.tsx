import { useState, useEffect } from "react";
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
  const { toast } = useToast();

  useEffect(() => {
    if (currentRoom) {
      console.log('Setting up message subscription for room:', currentRoom.id);
      fetchMessages(currentRoom.id);
      fetchRoomMembers(currentRoom.id);

      const messageChannel = supabase
        .channel(`messages:${currentRoom.id}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `room_id=eq.${currentRoom.id}`
          },
          (payload: any) => {
            console.log('New message received:', payload);
            setMessages(prevMessages => {
              const newMessage = payload.new;
              // Check if message already exists
              if (prevMessages.some(msg => msg.id === newMessage.id)) {
                console.log('Message already exists, skipping:', newMessage.id);
                return prevMessages;
              }
              console.log('Adding new message to state:', newMessage);
              return [...prevMessages, newMessage];
            });
          }
        )
        .subscribe((status) => {
          console.log(`Message subscription status: ${status}`);
        });

      return () => {
        console.log('Cleaning up message subscription');
        supabase.removeChannel(messageChannel);
      };
    }
  }, [currentRoom]);

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
          content: message, 
          user_id: currentUserId,
          room_id: currentRoom.id 
        }]);

      if (error) {
        console.error('Error details:', error);
        throw error;
      }

      setMessage("");
      toast({
        title: "Success",
        description: "Message sent successfully",
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

  // Show recommendation if user is alone in the room
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
  );
};