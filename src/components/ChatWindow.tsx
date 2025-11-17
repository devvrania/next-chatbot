
import { ChatMessage } from '@/lib/db/chat/types';
import MessageBubble from './MessageBubble';

interface ChatWindowProps {
  messages: ChatMessage[];
}

export default function ChatWindow({ messages }: ChatWindowProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
      {messages.length === 0 && (
        <div className="text-center text-sm text-slate-400 mt-10">
          Start the conversation by typing a message below 👇
        </div>
      )}

      {messages.map(message => (
        <MessageBubble key={message.id} message={message} />
      ))}
    </div>
  );
}
