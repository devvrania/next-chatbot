import { ChatMessage } from './types';

const DEFAULT_MODEL = process.env.OPENAI_MODEL ?? 'gpt-4.1-mini';

function buildOpenAIMessages(history: ChatMessage[]) {
  const systemMessage = {
    role: 'system' as const,
    content:
      'You are a helpful, concise chatbot assistant. Respond in clear, friendly English and keep answers short unless the user asks for detail.',
  };

  // keep only last 20 messages for context
  const recent = history.slice(-20).map(m => ({
    role: m.role,
    content: m.content,
  }));

  return [systemMessage, ...recent];
}

export async function generateLLMReply(
  history: ChatMessage[]
): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error('Missing OPENAI_API_KEY');
    throw new Error('LLM not configured');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: DEFAULT_MODEL,
      messages: buildOpenAIMessages(history),
      temperature: 0.5,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error('OpenAI error:', response.status, errText);
    throw new Error('LLM API error');
  }

  const data = await response.json();
  const reply =
    data.choices?.[0]?.message?.content?.trim() ??
    "I'm sorry, I couldn’t generate a response.";

  return reply;
}
