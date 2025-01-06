import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface Room {
  id: string;
  name: string;
  created_by: string;
  created_at: string;
  expires_at: string;
}

interface RoomListProps {
  rooms: Room[];
  onJoinRoom: (room: Room) => void;
  onCreateRoom: (name: string) => void;
}

export const RoomList = ({ rooms, onJoinRoom, onCreateRoom }: RoomListProps) => {
  const [newRoomName, setNewRoomName] = useState("");
  const { toast } = useToast();
  const { user } = useAuth();

  const handleCreateRoom = () => {
    if (!newRoomName.trim()) {
      toast({
        title: "Error",
        description: "Room name cannot be empty",
        variant: "destructive",
      });
      return;
    }
    onCreateRoom(newRoomName);
    setNewRoomName("");
  };

  const handleDeleteRoom = async (roomId: string) => {
    try {
      console.log('Deleting room:', roomId);
      const { error } = await supabase
        .from('rooms')
        .delete()
        .eq('id', roomId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Room deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting room:', error);
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <h2 className="font-semibold mb-4">Available Rooms</h2>
      
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
            <Button onClick={handleCreateRoom}>Create</Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="space-y-2">
        {rooms.map((room) => (
          <div
            key={room.id}
            className="p-3 rounded-lg border hover:bg-gray-50 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div 
                className="cursor-pointer flex-grow"
                onClick={() => onJoinRoom(room)}
              >
                <h3 className="font-medium">{room.name}</h3>
                <p className="text-sm text-gray-500">
                  Expires: {new Date(room.expires_at).toLocaleString()}
                </p>
              </div>
              {user?.id === room.created_by && (
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDeleteRoom(room.id)}
                  className="ml-2"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};