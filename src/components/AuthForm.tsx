import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

export function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (isSignUp) {
        await signUp(email, password);
        toast({
          title: "Account created",
          description: "Please check your email to verify your account",
        });
      } else {
        await signIn(email, password);
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in",
        });
      }
    } catch (error: any) {
      // Handle rate limiting error specifically
      if (error.message.includes("over_email_send_rate_limit")) {
        toast({
          title: "Please wait",
          description: "For security purposes, please wait a minute before trying again",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 space-y-4">
      <h2 className="text-2xl font-bold text-center">
        {isSignUp ? "Create an account" : "Sign in"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Please wait..." : (isSignUp ? "Sign up" : "Sign in")}
        </Button>
      </form>
      <Button
        variant="ghost"
        className="w-full"
        onClick={() => setIsSignUp(!isSignUp)}
        disabled={isLoading}
      >
        {isSignUp
          ? "Already have an account? Sign in"
          : "Don't have an account? Sign up"}
      </Button>
    </div>
  );
}