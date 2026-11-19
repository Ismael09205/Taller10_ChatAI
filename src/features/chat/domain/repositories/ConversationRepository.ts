import { Conversation } from '../entities/Conversation';

// Contrato del historial: no sabe si se guarda en archivo, BD o nube.
export interface ConversationRepository {
  getAll(): Promise<Conversation[]>;
  save(conversation: Conversation): Promise<void>;
  delete(id: string): Promise<void>;
  clear(): Promise<void>;
}
