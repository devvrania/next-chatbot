'use client';

import { useEffect, useState } from 'react';
import { ChatMessage } from '@/lib/db/chat/types';
import ChatWindow from '@/components/ChatWindow';
import ChatInput from '@/components/ChatInput';
import { loadConversation, sendChatRequest } from '@/lib/db/chat/client';

const STORAGE_KEY = 'chatbot_conversation_id';

export default function HomePage() {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const storedId =
      typeof window !== 'undefined'
        ? window.localStorage.getItem(STORAGE_KEY)
        : null;

    if (!storedId) return;

    (async () => {
      try {
        const res = await loadConversation(storedId);
        setConversationId(res.conversationId);
        setMessages(res.messages);
      } catch (error) {
        console.error(error);
        window.localStorage.removeItem(STORAGE_KEY);
      }
    })();
  }, []);

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;

    try {
      setIsLoading(true);

      console.log('Sending message:', text);

      const res = await sendChatRequest({
        conversationId: conversationId ?? undefined,
        content: text,
      });

      setConversationId(res.conversationId);
      setMessages(res.messages);

      console.log('ConversationId is now:', res.conversationId);
      console.log('Messages:', res.messages);

      if (typeof window !== 'undefined') {
        window.localStorage.setItem(STORAGE_KEY, res.conversationId);
      }
    } catch (error) {
      console.error(error);
      // Optional: show UI error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-xl flex flex-col h-[80vh]">
        <header className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-slate-800">
            LLM Chatbot 🤖
          </h1>
          {isLoading && (
            <span className="text-xs text-slate-500">Thinking...</span>
          )}
        </header>

        <ChatWindow messages={messages} />

        <ChatInput onSend={handleSend} disabled={isLoading} />
      </div>
    </main>
  );
}
