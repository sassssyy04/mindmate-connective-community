import { cn } from "@/lib/utils";

interface ChatMessageProps {
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  displayName?: string;
}

export function ChatMessage({ content, sender, timestamp, displayName }: ChatMessageProps) {
  return (
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
        {displayName && (
          <p className="text-xs font-medium mb-1 opacity-70">{displayName}</p>
        )}
        <p className="text-sm">{content}</p>
        <span className="text-xs opacity-70 mt-1 block">
          {timestamp.toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
}