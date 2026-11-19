export type AttachmentKind = 'image' | 'document';

// Archivo adjunto a un mensaje. base64/text solo existen en memoria
// (no se guardan en el historial para no ocupar espacio).
export interface Attachment {
  id: string;
  kind: AttachmentKind;
  name: string;
  mimeType: string;
  uri: string;
  base64?: string; // imágenes y PDF
  text?: string;   // documentos de texto
}
