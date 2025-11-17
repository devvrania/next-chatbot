import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '@/lib/db';
import { Conversation } from '@/lib/db/entities/Conversation';
import { Message } from '@/lib/db/entities/Message';
import { ChatMessage, ChatRequestBody, ChatResponseBody } from './types';
import { generateLLMReply } from './llmProvider';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function entityToDTO(message: Message): ChatMessage {
  return {
    id: message.id,
    role: message.role,
    content: message.content,
    createdAt: message.createdAt.toISOString(),
  };
}

// GET /api/chat?conversationId=...
export async function GET(req: NextRequest) {
  try {
    const conversationId = req.nextUrl.searchParams.get('conversationId');

    if (!conversationId) {
      return NextResponse.json(
        { error: 'conversationId is required' },
        { status: 400 }
      );
    }

    const ds = await getDataSource();
    const msgRepo = ds.getRepository(Message);

    const messages = await msgRepo.find({
      where: { conversation: { id: conversationId } },
      order: { createdAt: 'ASC' },
      relations: ['conversation'],
    });

    const dtoMessages = messages.map(entityToDTO);

    const responseBody: ChatResponseBody = {
      conversationId,
      messages: dtoMessages,
    };

    return NextResponse.json(responseBody, { status: 200 });
  } catch (error) {
    console.error('[CHAT_GET_ERROR]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/chat
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ChatRequestBody;

    if (!body.content || typeof body.content !== 'string') {
      return NextResponse.json(
        { error: 'content is required' },
        { status: 400 }
      );
    }

    const ds = await getDataSource();
    const conversationRepo = ds.getRepository(Conversation);
    const messageRepo = ds.getRepository(Message);

    let conversation: Conversation;

    // Create or load conversation
    if (body.conversationId) {
      const existing = await conversationRepo.findOne({
        where: { id: body.conversationId },
      });

      if (!existing) {
        return NextResponse.json(
          { error: 'Conversation not found' },
          { status: 404 }
        );
      }

      conversation = existing;
    } else {
      const newConversation = conversationRepo.create({ title: null });
      conversation = await conversationRepo.save(newConversation);
    }

    // Save user message
    const userMessageEntity = messageRepo.create({
      role: 'user',
      content: body.content,
      conversation,
    });
    await messageRepo.save(userMessageEntity);

    // Load full history
    const historyEntities = await messageRepo.find({
      where: { conversation: { id: conversation.id } },
      order: { createdAt: 'ASC' },
      relations: ['conversation'],
    });
    const historyDTO: ChatMessage[] = historyEntities.map(entityToDTO);

    // Call LLM with history
    const llmReplyText = await generateLLMReply(historyDTO);

    // Save assistant message
    const botMessageEntity = messageRepo.create({
      role: 'assistant',
      content: llmReplyText,
      conversation,
    });
    await messageRepo.save(botMessageEntity);

    const allMessages = [
      ...historyDTO,
      {
        id: botMessageEntity.id,
        role: 'assistant' as const,
        content: botMessageEntity.content,
        createdAt: botMessageEntity.createdAt.toISOString(),
      },
    ];

    const responseBody: ChatResponseBody = {
      conversationId: conversation.id,
      messages: allMessages,
    };

    return NextResponse.json(responseBody, { status: 200 });
  } catch (error) {
    console.error('[CHAT_POST_ERROR]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
