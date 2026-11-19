import { Message } from '../../domain/entities/Message';
import { Attachment } from '../../domain/entities/Attachment';
import { AIProvider } from '../../domain/entities/AIProvider';
import { ChatError } from '../../domain/errors/ChatErrors';
import {
  AIDataSource, SYSTEM_PROMPT, MAX_OUTPUT_TOKENS, documentsAsText,
} from './AIDataSource';

/**
 * Sirve para cualquier API con el formato de OpenAI (/chat/completions):
 * Groq (y otras como DeepSeek, Mistral, Together...)
 * Solo cambian baseUrl, apiKey y modelo. Usa fetch: no requiere instalar SDKs.
 */
export class OpenAICompatibleDataSource implements AIDataSource {
  constructor(
    public readonly provider: AIProvider,
    private readonly apiKey: string,
    private readonly baseUrl: string,
    // Parámetros propios de cada proveedor (ej. reasoning_effort en Groq)
    private readonly extraParams: Record<string, unknown> = {},
  ) {}

  async generateResponse(
    userMessage: string,
    history: Message[],
    attachments: Attachment[] = [],
  ): Promise<string> {
    // Estos modelos son de solo texto: imágenes y PDF no se pueden enviar
    if (attachments.some(a => a.base64)) {
      throw new ChatError('PROVIDER_ERROR', this.provider.id,
        `${this.provider.name} solo acepta texto. Para imágenes o PDF cambia a Gemini.`);
    }

    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history.map(m => ({ role: m.role, content: m.content })),
      { role: 'user', content: userMessage + documentsAsText(attachments) },
    ];

    let response: Response;
    try {
      response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.provider.model,
          messages,
          max_tokens: MAX_OUTPUT_TOKENS,
          ...this.extraParams,
        }),
      });
    } catch {
      throw new ChatError('PROVIDER_ERROR', this.provider.id,
        `No se pudo conectar con ${this.provider.name}. Revisa tu internet.`);
    }

    if (!response.ok) {
      const body = await response.text().catch(() => '');
      throw this.mapError(response.status, body);
    }

    const data = await response.json();
    return data?.choices?.[0]?.message?.content ?? '';
  }

  private mapError(status: number, body: string): ChatError {
    const { id, name } = this.provider;
    if (status === 429 || status === 402 || /quota|insufficient|rate.?limit/i.test(body)) {
      return new ChatError('QUOTA_EXCEEDED', id, `${name} se quedó sin tokens/cuota.`);
    }
    if (status === 401 || status === 403) {
      return new ChatError('INVALID_API_KEY', id, `La API key de ${name} no es válida.`);
    }
    if (status === 404) {
      return new ChatError('PROVIDER_ERROR', id,
        `El modelo ${this.provider.model} ya no está disponible en ${name}. Actualízalo en providers.ts.`);
    }
    return new ChatError('PROVIDER_ERROR', id, `Error en ${name} (${status}).`);
  }
}
