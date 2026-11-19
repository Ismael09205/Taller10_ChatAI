import { buildDataSources } from '../data/config/providers';
import { ChatRepositoryImpl } from '../data/repositories/ChatRepositoryImpl';
import { FileConversationRepository } from '../data/repositories/FileConversationRepository';
import { DeviceAttachmentRepository } from '../data/repositories/DeviceAttachmentRepository';
import { SendMessageUseCase } from '../domain/usecases/SendMessageUseCase';
import { ChangeProviderUseCase } from '../domain/usecases/ChangeProviderUseCase';
import { ManageConversationsUseCase } from '../domain/usecases/ManageConversationsUseCase';
import { PickAttachmentUseCase } from '../domain/usecases/PickAttachmentUseCase';

/**
 * Raíz de composición: el ÚNICO lugar que conoce las clases concretas.
 * Presentación solo recibe casos de uso.
 */
const chatRepository = new ChatRepositoryImpl(buildDataSources());

export const sendMessageUseCase = new SendMessageUseCase(chatRepository);
export const changeProviderUseCase = new ChangeProviderUseCase(chatRepository);
export const manageConversationsUseCase =
  new ManageConversationsUseCase(new FileConversationRepository());
export const pickAttachmentUseCase =
  new PickAttachmentUseCase(new DeviceAttachmentRepository());
