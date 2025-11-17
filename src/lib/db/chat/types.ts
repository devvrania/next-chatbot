export type Role = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  id: string;
  role: Role;
  content: string;
  createdAt: string; // ISO string
}

export interface ChatRequestBody {
  conversationId?: string;
  content: string;
}

export interface ChatResponseBody {
  conversationId: string;
  messages: ChatMessage[]; // full history
}
