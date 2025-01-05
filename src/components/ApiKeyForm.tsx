import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

interface ApiKeyFormProps {
  onApiKeySubmit: (key: string) => void;
}

export function ApiKeyForm({ onApiKeySubmit }: ApiKeyFormProps) {
  const [key, setKey] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (key.trim()) {
      console.log("Submitting API key from form");
      onApiKeySubmit(key.trim());
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Enter Your Together AI API Key</CardTitle>
          <CardDescription>
            You need a Together AI API key to use the chat feature. You can get one from the Together AI website.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="password"
              placeholder="Enter your API key"
              value={key}
              onChange={(e) => setKey(e.target.value)}
            />
            <Button type="submit" className="w-full">
              Submit
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}