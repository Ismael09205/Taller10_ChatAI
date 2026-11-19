import { Message, createMessage } from '../entities/Message';
import { Attachment } from '../entities/Attachment';
import { ChatRepository } from '../repositories/ChatRepository';

const DEFAULT_ATTACHMENT_PROMPT = 'Analiza el archivo adjunto.';

export class SendMessageUseCase {
  constructor(private readonly chatRepository: ChatRepository) {}

  async execute(
    userInput: string,
    history: Message[],
    attachments: Attachment[] = [],
  ): Promise<{ userMessage: Message; assistantMessage: Message }> {
    const text = userInput.trim();
    if (!text && attachments.length === 0) {
      throw new Error('El mensaje no puede estar vacío');
    }

    const prompt = text || DEFAULT_ATTACHMENT_PROMPT;
    const userMessage = createMessage('user', text, attachments);
    const responseText = await this.chatRepository.sendMessage(prompt, history, attachments);
    const assistantMessage = createMessage('assistant', responseText);

    return { userMessage, assistantMessage };
  }
}
