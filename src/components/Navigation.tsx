import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, UserRound } from "lucide-react";
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

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [displayName, setDisplayName] = useState<string>("");
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "AI Chat", path: "/chat" },
    { name: "Resources", path: "/resources" },
    { name: "Community", path: "/community" },
  ];

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
        .single();

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

  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-tribe-mint/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img
                src="/lovable-uploads/c7e0dc4a-5759-4b76-9276-bce3c18ee062.png"
                alt="Hytribe Logo"
                className="h-16 w-auto"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="text-tribe-grey hover:text-tribe-blue transition-colors duration-200 font-medium"
              >
                {item.name}
              </Link>
            ))}

            {user && (
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
                  <DropdownMenuItem onClick={handleSignOut}>
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Mobile Navigation Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-tribe-grey hover:text-tribe-blue focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="md:hidden">
            <div className="pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="block px-3 py-2 text-tribe-grey hover:text-tribe-blue hover:bg-blue-50 transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
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
                    onClick={handleSignOut}
                    className="block w-full text-left px-3 py-2 text-tribe-grey hover:text-tribe-blue hover:bg-blue-50 transition-colors duration-200"
                  >
                    Sign Out
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;