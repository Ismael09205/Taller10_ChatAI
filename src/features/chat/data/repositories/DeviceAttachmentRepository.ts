import { File } from 'expo-file-system';
import { Attachment, AttachmentKind } from '../../domain/entities/Attachment';
import { createId } from '../../domain/entities/Message';
import { AttachmentRepository } from '../../domain/repositories/AttachmentRepository';

const MAX_BYTES = 4 * 1024 * 1024; // 4 MB por archivo

const IMAGE_TYPES = ['image/*'];
const DOCUMENT_TYPES = ['application/pdf', 'text/*', 'application/json'];

const EXTENSION_MIME: Record<string, string> = {
  jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp',
  heic: 'image/heic', pdf: 'application/pdf', txt: 'text/plain', md: 'text/markdown',
  csv: 'text/csv', json: 'application/json',
};

const guessMime = (file: File): string => {
  if (file.type) return file.type;
  const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
  return EXTENSION_MIME[ext] ?? 'application/octet-stream';
};

const isTextual = (mime: string) => mime.startsWith('text/') || mime === 'application/json';

/** Usa el selector de archivos del sistema (expo-file-system) y lee el contenido. */
export class DeviceAttachmentRepository implements AttachmentRepository {
  async pick(kind: AttachmentKind): Promise<Attachment | null> {
    const picked = await File.pickFileAsync({
      mimeTypes: kind === 'image' ? IMAGE_TYPES : DOCUMENT_TYPES,
    });
    if (picked.canceled) return null;

    const file = picked.result;
    const size = file.size ?? 0;
    if (size > MAX_BYTES) {
      throw new Error('El archivo supera los 4 MB permitidos.');
    }

    const mimeType = guessMime(file);
    const base = { id: createId(), kind, name: file.name, mimeType, uri: file.uri };

    if (mimeType.startsWith('image/') || mimeType === 'application/pdf') {
      return { ...base, base64: await file.base64() };
    }
    if (isTextual(mimeType)) {
      return { ...base, text: await file.text() };
    }
    throw new Error('Tipo de archivo no compatible. Usa imágenes, PDF o archivos de texto.');
  }
}
