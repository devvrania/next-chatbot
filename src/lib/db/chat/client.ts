import { ChatRequestBody, ChatResponseBody } from './types';

export async function sendChatRequest(
  body: ChatRequestBody
): Promise<ChatResponseBody> {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`Chat API error: ${res.status}`);
  }

  return (await res.json()) as ChatResponseBody;
}

export async function loadConversation(
  conversationId: string
): Promise<ChatResponseBody> {
  const res = await fetch(`/api/chat?conversationId=${conversationId}`);
  if (!res.ok) {
    console.error('Failed to load conversation', await res.text());
    throw new Error(`Chat API error: ${res.status}`);
  }

  return (await res.json()) as ChatResponseBody;
}
