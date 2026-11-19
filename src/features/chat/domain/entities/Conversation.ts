import { Message, createId } from './Message';

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

const TITLE_MAX = 40;

export const buildTitle = (messages: Message[]): string => {
  const first = messages.find(m => m.role === 'user');
  const raw = first?.content.trim()
    || first?.attachments?.[0]?.name
    || 'Nueva conversación';
  return raw.length > TITLE_MAX ? `${raw.slice(0, TITLE_MAX).trimEnd()}...` : raw;
};

export const createConversation = (messages: Message[], id?: string, createdAt?: Date): Conversation => {
  const now = new Date();
  return {
    id: id ?? createId(),
    title: buildTitle(messages),
    messages,
    createdAt: createdAt ?? now,
    updatedAt: now,
  };
};
