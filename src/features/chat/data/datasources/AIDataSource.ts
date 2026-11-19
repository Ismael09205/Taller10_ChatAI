import { Message } from '../../domain/entities/Message';
import { Attachment } from '../../domain/entities/Attachment';
import { AIProvider } from '../../domain/entities/AIProvider';

// Instrucción mínima compartida por todos los proveedores (~10 tokens)
export const SYSTEM_PROMPT = 'Responde en texto plano, sin Markdown.';
export const MAX_OUTPUT_TOKENS = 1000;

/**
 * Contrato que cumple cualquier IA (Gemini, Groq...).
 * Para agregar una nueva IA basta con crear una clase que implemente esto.
 * Debe lanzar ChatError (dominio) en vez de los errores propios de cada SDK.
 */
export interface AIDataSource {
  readonly provider: AIProvider;
  generateResponse(
    userMessage: string,
    history: Message[],
    attachments?: Attachment[],
  ): Promise<string>;
}

/** Texto de documentos adjuntos para modelos que solo aceptan texto. */
export const documentsAsText = (attachments: Attachment[]): string =>
  attachments
    .filter(a => a.text !== undefined)
    .map(a => `\n\n[Archivo: ${a.name}]\n${a.text}`)
    .join('');
