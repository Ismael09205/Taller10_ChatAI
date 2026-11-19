import { Attachment, AttachmentKind } from '../entities/Attachment';

// Contrato para seleccionar y leer archivos del dispositivo.
export interface AttachmentRepository {
  /** Devuelve null si el usuario cancela. */
  pick(kind: AttachmentKind): Promise<Attachment | null>;
}
