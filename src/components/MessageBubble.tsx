import { ChatMessage } from "@/lib/db/chat/types";
import clsx from "clsx";

interface MessageBubbleProps {
  message: ChatMessage;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div className={clsx('flex', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={clsx(
          'max-w-[75%] rounded-2xl px-3 py-2 text-sm shadow-sm',
          isUser
            ? 'bg-blue-600 text-white rounded-br-sm'
            : 'bg-slate-200 text-slate-900 rounded-bl-sm'
        )}
      >
        <p className="whitespace-pre-wrap break-words">{message.content}</p>
        <span className="block mt-1 text-[10px] opacity-70 text-right">
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>
    </div>
  );
}
