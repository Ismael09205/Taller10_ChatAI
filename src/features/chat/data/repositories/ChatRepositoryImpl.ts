import { Message } from '../../domain/entities/Message';
import { Attachment } from '../../domain/entities/Attachment';
import { AIProvider } from '../../domain/entities/AIProvider';
import { ChatRepository } from '../../domain/repositories/ChatRepository';
import { AIDataSource } from '../datasources/AIDataSource';
import { cleanMarkdown } from '../utils/cleanMarkdown';

/**
 * Recibe las IAs por constructor (inyección de dependencias):
 * no conoce a Gemini ni a OpenAI, solo la interfaz AIDataSource.
 */
export class ChatRepositoryImpl implements ChatRepository {
  private activeId: string;

  constructor(private readonly dataSources: AIDataSource[]) {
    if (dataSources.length === 0) {
      throw new Error('No hay ninguna IA configurada. Agrega una API key en el archivo .env');
    }
    this.activeId = dataSources[0].provider.id;
  }

  async sendMessage(
    userMessage: string,
    history: Message[],
    attachments: Attachment[] = [],
  ): Promise<string> {
    const raw = await this.getActiveSource().generateResponse(userMessage, history, attachments);
    // Se limpia aquí para que aplique a cualquier proveedor
    return cleanMarkdown(raw);
  }

  getProviders(): AIProvider[] {
    return this.dataSources.map(ds => ds.provider);
  }

  getActiveProvider(): AIProvider {
    return this.getActiveSource().provider;
  }

  setActiveProvider(providerId: string): void {
    if (!this.dataSources.some(ds => ds.provider.id === providerId)) {
      throw new Error(`Proveedor no disponible: ${providerId}`);
    }
    this.activeId = providerId;
  }

  private getActiveSource(): AIDataSource {
    return this.dataSources.find(ds => ds.provider.id === this.activeId)!;
  }
}
