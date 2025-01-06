import { cn } from "@/lib/utils";

interface ChatMessageProps {
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  displayName?: string;
}

export function ChatMessage({ content, sender, timestamp, displayName }: ChatMessageProps) {
  return (
    <div className="mb-4">
      {displayName && (
        <p 
          className={cn(
            "text-xs font-medium mb-1",
            sender === "user" ? "text-right" : "text-left",
            "text-tribe-grey"
          )}
        >
          {displayName}
        </p>
      )}
      <div
        className={cn(
          "flex",
          sender === "user" ? "justify-end" : "justify-start"
        )}
      >
        <div
          className={cn(
            "max-w-[80%] rounded-lg p-4",
            sender === "user"
              ? "bg-primary text-primary-foreground"
              : "bg-muted"
          )}
        >
          <p className="text-sm">{content}</p>
          <span className="text-xs opacity-70 mt-1 block">
            {timestamp.toLocaleTimeString()}
          </span>
        </div>
      </div>
    </div>
  );
}