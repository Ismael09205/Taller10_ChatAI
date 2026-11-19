import { Conversation, createConversation } from '../entities/Conversation';
import { Message } from '../entities/Message';
import { ConversationRepository } from '../repositories/ConversationRepository';

export class ManageConversationsUseCase {
  constructor(private readonly repository: ConversationRepository) {}

  async list(): Promise<Conversation[]> {
    const all = await this.repository.getAll();
    return all.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }

  /** Crea o actualiza la conversación con los mensajes actuales. */
  async save(messages: Message[], existing?: Conversation): Promise<Conversation> {
    const conversation = createConversation(messages, existing?.id, existing?.createdAt);
    await this.repository.save(conversation);
    return conversation;
  }

  delete(id: string): Promise<void> {
    return this.repository.delete(id);
  }

  clear(): Promise<void> {
    return this.repository.clear();
  }
}
