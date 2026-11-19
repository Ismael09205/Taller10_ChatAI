// Errores de dominio: la capa de datos traduce los errores de cada API
// (Gemini, OpenAI, Groq...) a estos, y la UI solo conoce estos.

export type ChatErrorKind = 'QUOTA_EXCEEDED' | 'INVALID_API_KEY' | 'PROVIDER_ERROR';

export class ChatError extends Error {
  constructor(
    public readonly kind: ChatErrorKind,
    public readonly providerId: string,
    message: string,
  ) {
    super(message);
    this.name = 'ChatError';
    Object.setPrototypeOf(this, ChatError.prototype);
  }
}

export const isChatError = (err: unknown): err is ChatError =>
  typeof err === 'object' && err !== null && (err as ChatError).name === 'ChatError';

export const isQuotaExceeded = (err: unknown): err is ChatError =>
  isChatError(err) && err.kind === 'QUOTA_EXCEEDED';
