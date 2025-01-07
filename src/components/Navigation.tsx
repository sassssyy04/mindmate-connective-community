import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { UserMenu } from "./navigation/UserMenu";
import { MobileMenu } from "./navigation/MobileMenu";
import { useAuth } from "@/contexts/AuthContext";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "AI Chat", path: "/chat" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Resources", path: "/resources" },
    { name: "Community", path: "/community" },
  ];

  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-tribe-mint/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img
                src="/lovable-uploads/1bf2282b-be2f-4745-9685-586e3ad56eb4.png"
                alt="Hytribe Logo"
                className="h-12 w-auto"
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
            {user && <UserMenu />}
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
        <MobileMenu
          navItems={navItems}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      </div>
    </nav>
  );
};

export default Navigation;