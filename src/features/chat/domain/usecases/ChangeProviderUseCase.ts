import { AIProvider } from '../entities/AIProvider';
import { ChatRepository } from '../repositories/ChatRepository';

export class ChangeProviderUseCase {
  constructor(private readonly chatRepository: ChatRepository) {}

  getProviders(): AIProvider[] {
    return this.chatRepository.getProviders();
  }

  getActive(): AIProvider {
    return this.chatRepository.getActiveProvider();
  }

  execute(providerId: string): AIProvider {
    const exists = this.chatRepository.getProviders().some(p => p.id === providerId);
    if (!exists) throw new Error(`Proveedor no disponible: ${providerId}`);
    this.chatRepository.setActiveProvider(providerId);
    return this.chatRepository.getActiveProvider();
  }
}
