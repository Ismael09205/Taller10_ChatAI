import { AIDataSource } from '../datasources/AIDataSource';
import { GeminiDataSource } from '../datasources/GeminiDataSource';
import { OpenAICompatibleDataSource } from '../datasources/OpenAICompatibleDataSource';

/**
 * Catálogo de IAs. Para agregar una nueva:
 *  1. Agrega su API key en .env (EXPO_PUBLIC_..._API_KEY)
 *  2. Agrega una entrada aquí.
 * Solo se activan las que tengan API key configurada.
 *
 * Nota: Expo solo lee process.env.EXPO_PUBLIC_* escrito literalmente,
 * por eso cada key se referencia explícitamente.
 * Revisa en la web de cada proveedor que el nombre del modelo siga vigente.
 */
export const buildDataSources = (): AIDataSource[] => {
  const geminiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
  const groqKey = process.env.EXPO_PUBLIC_GROQ_API_KEY;

  const sources: AIDataSource[] = [];

  if (geminiKey) {
    sources.push(new GeminiDataSource(
      { id: 'gemini-flash', name: 'Gemini Flash', model: 'gemini-3-flash-preview' },
      geminiKey,
    ));
  }
  if (groqKey) {
    sources.push(new OpenAICompatibleDataSource(
      { id: 'groq-gpt-oss', name: 'Groq GPT-OSS', model: 'openai/gpt-oss-120b' },
      groqKey, 'https://api.groq.com/openai/v1',
      // Razonamiento bajo: respuestas más rápidas y menos tokens consumidos
      { reasoning_effort: 'low' },
    ));
  }

  return sources;
};
