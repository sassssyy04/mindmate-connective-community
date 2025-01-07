import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { AuthForm } from "@/components/AuthForm";
import { useToast } from "@/hooks/use-toast";
import { RoomList } from "@/components/RoomList";
import { ChatContainer } from "@/components/chat/ChatContainer";

const Community = () => {
  const { user, supabase } = useAuth();
  const [rooms, setRooms] = useState<any[]>([]);
  const [currentRoom, setCurrentRoom] = useState<any>(null);
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

  const createRoom = async (name: string) => {
    try {
      console.log('Creating new room:', name);
      const { data: room, error: roomError } = await supabase
        .from('rooms')
        .insert([{ name, created_by: user?.id }])
        .select()
        .single();

      if (roomError) throw roomError;
      await joinRoom(room);

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
      
      // Changed from .single() to .maybeSingle() to handle no results case
      const { data: existingMember, error: memberError } = await supabase
        .from('room_members')
        .select('id')
        .eq('room_id', room.id)
        .eq('user_id', user?.id)
        .maybeSingle();

      if (memberError) throw memberError;

      if (existingMember) {
        console.log('User is already a member of this room');
        setCurrentRoom(room);
        toast({
          title: "Info",
          description: `Switched to room: ${room.name}`,
        });
        return;
      }

      const { error: joinError } = await supabase
        .from('room_members')
        .insert([{ room_id: room.id, user_id: user?.id }]);

      if (joinError) throw joinError;

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
        </motion.div>

        <div className="grid md:grid-cols-[300px,1fr] gap-6">
          <RoomList 
            rooms={rooms}
            onJoinRoom={joinRoom}
            onCreateRoom={createRoom}
            currentRoomId={currentRoom?.id}
          />

          {currentRoom ? (
            <ChatContainer 
              currentRoom={currentRoom}
              currentUserId={user.id}
            />
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