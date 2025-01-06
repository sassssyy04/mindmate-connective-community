import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { AuthForm } from "@/components/AuthForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Send, Plus } from "lucide-react";
import { ChatMessage } from "@/components/ChatMessage";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Community = () => {
  const { user, supabase } = useAuth();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [currentRoom, setCurrentRoom] = useState<any>(null);
  const [newRoomName, setNewRoomName] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchRooms();
      const roomChannel = supabase
        .channel('rooms')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'rooms'
          },
          () => {
            console.log('Rooms updated, fetching rooms...');
            fetchRooms();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(roomChannel);
      };
    }
  }, [user, supabase]);

  useEffect(() => {
    if (user && currentRoom) {
      console.log('Setting up message subscription for room:', currentRoom.id);
      fetchMessages(currentRoom.id);

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
          (payload) => {
            console.log('New message received:', payload);
            setMessages(prev => [...prev, payload.new]);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(messageChannel);
      };
    }
  }, [user, currentRoom, supabase]);

  const fetchRooms = async () => {
    try {
      console.log('Fetching rooms...');
      const { data: roomsData, error: roomsError } = await supabase
        .from('rooms')
        .select('*')
        .order('created_at', { ascending: false });

      if (roomsError) throw roomsError;
      console.log('Rooms fetched:', roomsData);
      setRooms(roomsData || []);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive",
      });
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
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  const createRoom = async () => {
    if (!newRoomName.trim()) return;

    try {
      console.log('Creating new room:', newRoomName);
      const { data: room, error: roomError } = await supabase
        .from('rooms')
        .insert([{ name: newRoomName, created_by: user?.id }])
        .select()
        .single();

      if (roomError) throw roomError;

      // Join the room after creating it
      const { error: joinError } = await supabase
        .from('room_members')
        .insert([{ room_id: room.id, user_id: user?.id }]);

      if (joinError) throw joinError;

      setNewRoomName("");
      toast({
        title: "Success",
        description: "Room created successfully",
      });
    } catch (error) {
      console.error('Error creating room:', error);
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  const joinRoom = async (room: any) => {
    try {
      console.log('Joining room:', room.id);
      const { error } = await supabase
        .from('room_members')
        .insert([{ room_id: room.id, user_id: user?.id }]);

      if (error) throw error;

      setCurrentRoom(room);
      toast({
        title: "Success",
        description: `Joined room: ${room.name}`,
      });
    } catch (error) {
      console.error('Error joining room:', error);
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !currentRoom) return;

    try {
      console.log('Sending message:', message);
      const { error } = await supabase
        .from("messages")
        .insert([{ 
          content: message, 
          user_id: user?.id,
          room_id: currentRoom.id 
        }]);

      if (error) throw error;

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
            Chat Rooms
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            Join a room or create a new one
          </p>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="mb-4">
                <Plus className="h-4 w-4 mr-2" />
                Create New Room
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create a New Room</DialogTitle>
              </DialogHeader>
              <div className="flex gap-2">
                <Input
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  placeholder="Enter room name..."
                />
                <Button onClick={createRoom}>Create</Button>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>

        <div className="grid md:grid-cols-[300px,1fr] gap-6">
          {/* Rooms List */}
          <div className="bg-white rounded-lg shadow-lg p-4">
            <h2 className="font-semibold mb-4">Available Rooms</h2>
            <div className="space-y-2">
              {rooms.map((room) => (
                <div
                  key={room.id}
                  className="p-3 rounded-lg border cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => joinRoom(room)}
                >
                  <h3 className="font-medium">{room.name}</h3>
                  <p className="text-sm text-gray-500">
                    Expires: {new Date(room.expires_at).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          {currentRoom ? (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="font-semibold mb-4">{currentRoom.name}</h2>
              <div className="h-[500px] overflow-y-auto mb-4 space-y-4">
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
          ) : (
            <div className="bg-white rounded-lg shadow-lg p-6 flex items-center justify-center">
              <p className="text-gray-500">Select a room to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Community;