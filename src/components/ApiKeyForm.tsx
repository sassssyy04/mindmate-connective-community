import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface ApiKeyFormProps {
  onApiKeySubmit: (apiKey: string) => void;
}

export function ApiKeyForm({ onApiKeySubmit }: ApiKeyFormProps) {
  const [apiKey, setApiKey] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter your Together AI API key",
        variant: "destructive",
      });
      return;
    }

    onApiKeySubmit(apiKey);
    toast({
      title: "Success",
      description: "API key has been saved",
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-md mx-auto px-4">
      <h2 className="text-2xl font-semibold mb-6">Enter Your Together AI API Key</h2>
      <p className="text-muted-foreground mb-8 text-center">
        To use the chat feature, please enter your Together AI API key. You can get one from the Together AI platform.
      </p>
      <form onSubmit={handleSubmit} className="w-full space-y-4">
        <Input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Enter your API key"
          className="w-full"
        />
        <Button type="submit" className="w-full">
          Save API Key
        </Button>
      </form>
    </div>
  );
}