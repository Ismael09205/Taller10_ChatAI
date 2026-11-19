import { Attachment } from './Attachment';

export type MessageRole = 'user' | 'assistant';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  attachments?: Attachment[];
}

export const createId = (): string =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

// FACTORY PATRÓN DE DISEÑO
export const createMessage = (
  role: MessageRole,
  content: string,
  attachments?: Attachment[],
): Message => ({
  id: createId(),
  role,
  content,
  timestamp: new Date(),
  ...(attachments && attachments.length > 0 ? { attachments } : {}),
});
