import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const EmptyRoomMessage = () => {
  const navigate = useNavigate();

  return (
    <Alert className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>No other users in this room</AlertTitle>
      <AlertDescription className="mt-2">
        While waiting for others to join, you might want to try our AI chat assistant.
        <Button
          variant="link"
          className="pl-1 h-auto p-0 text-primary"
          onClick={() => navigate("/chat")}
        >
          Try AI Chat →
        </Button>
      </AlertDescription>
    </Alert>
  );
};