import { Attachment, AttachmentKind } from '../entities/Attachment';
import { AttachmentRepository } from '../repositories/AttachmentRepository';

export const MAX_ATTACHMENTS = 3;

export class PickAttachmentUseCase {
  constructor(private readonly repository: AttachmentRepository) {}

  async execute(kind: AttachmentKind, current: Attachment[]): Promise<Attachment | null> {
    if (current.length >= MAX_ATTACHMENTS) {
      throw new Error(`Puedes adjuntar hasta ${MAX_ATTACHMENTS} archivos por mensaje.`);
    }
    return this.repository.pick(kind);
  }
}
