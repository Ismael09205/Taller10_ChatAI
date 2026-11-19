import { File, Paths } from 'expo-file-system';
import { Conversation } from '../../domain/entities/Conversation';
import { Message } from '../../domain/entities/Message';
import { ConversationRepository } from '../../domain/repositories/ConversationRepository';

const FILE_NAME = 'conversations.json';

type StoredMessage = Omit<Message, 'timestamp'> & { timestamp: string };
type StoredConversation = Omit<Conversation, 'messages' | 'createdAt' | 'updatedAt'> & {
  messages: StoredMessage[];
  createdAt: string;
  updatedAt: string;
};

/**
 * Guarda el historial en un archivo JSON dentro del almacenamiento privado de la app
 * (expo-file-system, ya incluido en Expo). El contenido de los adjuntos no se guarda,
 * solo su nombre y tipo.
 */
export class FileConversationRepository implements ConversationRepository {
  private readonly file = new File(Paths.document, FILE_NAME);

  async getAll(): Promise<Conversation[]> {
    try {
      if (!this.file.exists) return [];
      const stored = JSON.parse(await this.file.text()) as StoredConversation[];
      return stored.map(this.fromStored);
    } catch {
      return []; // archivo corrupto: se empieza de cero
    }
  }

  async save(conversation: Conversation): Promise<void> {
    const all = await this.getAll();
    const rest = all.filter(c => c.id !== conversation.id);
    this.write([conversation, ...rest]);
  }

  async delete(id: string): Promise<void> {
    const all = await this.getAll();
    this.write(all.filter(c => c.id !== id));
  }

  async clear(): Promise<void> {
    if (this.file.exists) this.file.delete();
  }

  private write(conversations: Conversation[]): void {
    if (!this.file.exists) this.file.create();
    this.file.write(JSON.stringify(conversations.map(this.toStored)));
  }

  private toStored = (c: Conversation): StoredConversation => ({
    ...c,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
    messages: c.messages.map(m => ({
      ...m,
      timestamp: m.timestamp.toISOString(),
      attachments: m.attachments?.map(({ base64: _b, text: _t, ...meta }) => meta),
    })),
  });

  private fromStored = (c: StoredConversation): Conversation => ({
    ...c,
    createdAt: new Date(c.createdAt),
    updatedAt: new Date(c.updatedAt),
    messages: c.messages.map(m => ({ ...m, timestamp: new Date(m.timestamp) })),
  });
}
