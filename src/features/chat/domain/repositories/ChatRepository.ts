import { Message } from '../entities/Message';
import { Attachment } from '../entities/Attachment';
import { AIProvider } from '../entities/AIProvider';

// Contrato del dominio: no sabe qué IA hay detrás.
export interface ChatRepository {
  sendMessage(userMessage: string, history: Message[], attachments?: Attachment[]): Promise<string>;
  getProviders(): AIProvider[];
  getActiveProvider(): AIProvider;
  setActiveProvider(providerId: string): void;
}
