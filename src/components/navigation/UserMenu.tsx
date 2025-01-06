import { useState, useEffect } from "react";
import { UserRound } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

export const UserMenu = () => {
  const [displayName, setDisplayName] = useState<string>("");
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchDisplayName();
    }
  }, [user]);

  const fetchDisplayName = async () => {
    try {
      console.log("Fetching display name for user:", user?.id);
      const { data, error } = await supabase
        .from("member_onboarding")
        .select("display_name")
        .eq("user_id", user?.id)
        .maybeSingle(); // Using maybeSingle instead of single

      if (error) throw error;
      console.log("Fetched display name:", data?.display_name);
      setDisplayName(data?.display_name || "");
    } catch (error) {
      console.error("Error fetching display name:", error);
      toast({
        title: "Error",
        description: "Failed to fetch display name",
        variant: "destructive",
      });
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Success",
        description: "Signed out successfully",
      });
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    }
  };

  const updateDisplayName = async (newName: string) => {
    try {
      const { error } = await supabase
        .from("member_onboarding")
        .update({ display_name: newName })
        .eq("user_id", user?.id);

      if (error) throw error;

      setDisplayName(newName);
      toast({
        title: "Success",
        description: "Display name updated successfully",
      });
    } catch (error) {
      console.error("Error updating display name:", error);
      toast({
        title: "Error",
        description: "Failed to update display name",
        variant: "destructive",
      });
    }
  };

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none">
        <Avatar className="h-8 w-8 bg-tribe-blue/10">
          <AvatarFallback className="bg-tribe-blue/10 text-tribe-blue">
            <UserRound className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>{displayName}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            const newName = prompt("Enter new display name:", displayName);
            if (newName && newName.trim() !== "") {
              updateDisplayName(newName.trim());
            }
          }}
        >
          Change Display Name
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSignOut}>Sign Out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};