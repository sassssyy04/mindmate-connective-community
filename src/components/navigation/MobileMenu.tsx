import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

interface MobileMenuProps {
  navItems: Array<{ name: string; path: string }>;
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu = ({ navItems, isOpen, onClose }: MobileMenuProps) => {
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
      const { data, error } = await supabase
        .from("member_onboarding")
        .select("display_name")
        .eq("user_id", user?.id)
        .maybeSingle();

      if (error) throw error;
      setDisplayName(data?.display_name || "");
    } catch (error) {
      console.error("Error fetching display name:", error);
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

  if (!isOpen) return null;

  return (
    <div className="md:hidden">
      <div className="pt-2 pb-3 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className="block px-3 py-2 text-tribe-grey hover:text-tribe-blue hover:bg-blue-50 transition-colors duration-200"
            onClick={onClose}
          >
            {item.name}
          </Link>
        ))}
        {user && (
          <>
            <div className="px-3 py-2 text-tribe-grey font-medium border-t">
              {displayName}
            </div>
            <button
              onClick={() => {
                const newName = prompt("Enter new display name:", displayName);
                if (newName && newName.trim() !== "") {
                  updateDisplayName(newName.trim());
                }
              }}
              className="block w-full text-left px-3 py-2 text-tribe-grey hover:text-tribe-blue hover:bg-blue-50 transition-colors duration-200"
            >
              Change Display Name
            </button>
            <button
              onClick={async () => {
                try {
                  await signOut();
                  onClose();
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
              }}
              className="block w-full text-left px-3 py-2 text-tribe-grey hover:text-tribe-blue hover:bg-blue-50 transition-colors duration-200"
            >
              Sign Out
            </button>
          </>
        )}
      </div>
    </div>
  );
};