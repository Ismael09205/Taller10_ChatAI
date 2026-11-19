import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory, Part }
  from '@google/generative-ai';
import { Message } from '../../domain/entities/Message';
import { Attachment } from '../../domain/entities/Attachment';
import { AIProvider } from '../../domain/entities/AIProvider';
import { ChatError } from '../../domain/errors/ChatErrors';
import {
  AIDataSource, SYSTEM_PROMPT, MAX_OUTPUT_TOKENS, documentsAsText,
} from './AIDataSource';

export class GeminiDataSource implements AIDataSource {
  private genAI: GoogleGenerativeAI;

  constructor(public readonly provider: AIProvider, apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async generateResponse(
    userMessage: string,
    history: Message[],
    attachments: Attachment[] = [],
  ): Promise<string> {
    const model = this.genAI.getGenerativeModel({
      model: this.provider.model,
      systemInstruction: SYSTEM_PROMPT,
      safetySettings: [{
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      }],
    });

    // Convertir nuestras entidades al formato que Gemini entiende
    const geminiHistory = history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    try {
      const chat = model.startChat({
        history: geminiHistory,
        generationConfig: { maxOutputTokens: MAX_OUTPUT_TOKENS },
      });
      // Gemini es multimodal: imágenes y PDF van como inlineData, texto como texto
      const parts: Part[] = [{ text: userMessage + documentsAsText(attachments) }];
      for (const a of attachments) {
        if (a.base64) parts.push({ inlineData: { mimeType: a.mimeType, data: a.base64 } });
      }
      const result = await chat.sendMessage(parts);
      return result.response.text();
    } catch (err) {
      throw this.mapError(err);
    }
  }

  // Traduce errores del SDK de Google a errores de dominio
  private mapError(err: unknown): ChatError {
    const status = (err as { status?: number })?.status;
    const msg = err instanceof Error ? err.message : String(err);
    const { id, name } = this.provider;

    if (status === 429 || /429|RESOURCE_EXHAUSTED|quota/i.test(msg)) {
      return new ChatError('QUOTA_EXCEEDED', id, `${name} se quedó sin tokens/cuota.`);
    }
    if (status === 401 || status === 403 || /API key not valid|API_KEY_INVALID/i.test(msg)) {
      return new ChatError('INVALID_API_KEY', id, `La API key de ${name} no es válida.`);
    }
    return new ChatError('PROVIDER_ERROR', id, `Error en ${name}: ${msg}`);
  }
}
