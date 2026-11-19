import React, {
  createContext, useCallback, useContext, useEffect, useRef, useState,
} from 'react';
import { Message, createMessage } from '../../domain/entities/Message';
import { Attachment, AttachmentKind } from '../../domain/entities/Attachment';
import { AIProvider } from '../../domain/entities/AIProvider';
import { Conversation } from '../../domain/entities/Conversation';
import { isQuotaExceeded } from '../../domain/errors/ChatErrors';
import {
  sendMessageUseCase, changeProviderUseCase,
  manageConversationsUseCase, pickAttachmentUseCase,
} from '../../di/container';
import { useSpeech } from './useSpeech';

interface PendingSend { text: string; attachments: Attachment[] }

const errorMessage = (err: unknown) =>
  err instanceof Error || (typeof err === 'object' && err !== null && 'message' in err)
    ? String((err as Error).message)
    : 'Error desconocido';

const useChatState = () => {
  // Conversación actual
  const [messages, setMessages] = useState<Message[]>([]);
  const [current, setCurrent] = useState<Conversation | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  // Historial
  const [conversations, setConversations] = useState<Conversation[]>([]);

  // Proveedores de IA
  const [providers] = useState<AIProvider[]>(() => changeProviderUseCase.getProviders());
  const [activeProvider, setActiveProvider] =
    useState<AIProvider>(() => changeProviderUseCase.getActive());
  const [exhaustedIds, setExhaustedIds] = useState<string[]>([]);
  const [needsProviderChange, setNeedsProviderChange] = useState(false);
  const pendingRef = useRef<PendingSend | null>(null);

  // Voz de la IA
  const speech = useSpeech();
  const { speak, stopSpeaking, voiceEnabled } = speech;

  const refreshHistory = useCallback(async () => {
    setConversations(await manageConversationsUseCase.list());
  }, []);

  useEffect(() => { refreshHistory(); }, [refreshHistory]);

  // Mensaje del usuario mostrado mientras la IA responde
  const [pendingMessage, setPendingMessage] = useState<Message | null>(null);

  /** Envía sobre una base explícita de mensajes (evita usar un historial desactualizado). */
  const send = useCallback(async (
    text: string,
    files: Attachment[],
    base: Message[],
    baseConversation: Conversation | undefined,
  ) => {
    setIsLoading(true);
    setError(null);
    setAttachments([]);
    setPendingMessage(createMessage('user', text.trim(), files));
    try {
      const { userMessage, assistantMessage } =
        await sendMessageUseCase.execute(text, base, files);
      const updated = [...base, userMessage, assistantMessage];
      setMessages(updated);
      pendingRef.current = null;
      if (voiceEnabled) speak(assistantMessage.content);

      const saved = await manageConversationsUseCase.save(updated, baseConversation);
      setCurrent(saved);
      await refreshHistory();
    } catch (err) {
      if (isQuotaExceeded(err)) {
        pendingRef.current = { text, attachments: files };
        setExhaustedIds(prev => (prev.includes(err.providerId) ? prev : [...prev, err.providerId]));
        setNeedsProviderChange(true);
      } else {
        setAttachments(files); // devolver los adjuntos para reintentar
      }
      setError(errorMessage(err));
    } finally {
      setPendingMessage(null);
      setIsLoading(false);
    }
  }, [voiceEnabled, speak, refreshHistory]);

  const sendMessage = useCallback(
    (text: string, files: Attachment[] = attachments) => send(text, files, messages, current),
    [send, attachments, messages, current],
  );

  const changeProvider = useCallback(async (providerId: string) => {
    setActiveProvider(changeProviderUseCase.execute(providerId));
    setNeedsProviderChange(false);
    setError(null);
    const pending = pendingRef.current;
    if (pending) {
      pendingRef.current = null;
      await sendMessage(pending.text, pending.attachments);
    }
  }, [sendMessage]);

  const dismissProviderChange = useCallback(() => setNeedsProviderChange(false), []);

  const newConversation = useCallback(() => {
    stopSpeaking();
    setMessages([]);
    setCurrent(undefined);
    setAttachments([]);
    setError(null);
    pendingRef.current = null;
  }, [stopSpeaking]);

  /** Empieza una conversación nueva enviando directamente un mensaje. */
  const startConversation = useCallback(async (prompt: string) => {
    newConversation();
    await send(prompt, [], [], undefined);
  }, [newConversation, send]);

  const openConversation = useCallback((conversation: Conversation) => {
    stopSpeaking();
    setMessages(conversation.messages);
    setCurrent(conversation);
    setAttachments([]);
    setError(null);
  }, [stopSpeaking]);

  const deleteConversation = useCallback(async (id: string) => {
    await manageConversationsUseCase.delete(id);
    if (current?.id === id) newConversation();
    await refreshHistory();
  }, [current, newConversation, refreshHistory]);

  const clearHistory = useCallback(async () => {
    await manageConversationsUseCase.clear();
    newConversation();
    await refreshHistory();
  }, [newConversation, refreshHistory]);

  const pickAttachment = useCallback(async (kind: AttachmentKind) => {
    setError(null);
    try {
      const file = await pickAttachmentUseCase.execute(kind, attachments);
      if (file) setAttachments(prev => [...prev, file]);
    } catch (err) {
      setError(errorMessage(err));
    }
  }, [attachments]);

  const removeAttachment = useCallback((id: string) => {
    setAttachments(prev => prev.filter(a => a.id !== id));
  }, []);

  const dismissError = useCallback(() => setError(null), []);

  return {
    // conversación
    messages, pendingMessage, current, isLoading, error, attachments,
    sendMessage, newConversation, startConversation, openConversation, dismissError,
    pickAttachment, removeAttachment,
    // historial
    conversations, deleteConversation, clearHistory,
    // proveedores
    providers, activeProvider, exhaustedIds,
    needsProviderChange, changeProvider, dismissProviderChange,
    // voz
    ...speech,
  };
};

type ChatState = ReturnType<typeof useChatState>;

const ChatContext = createContext<ChatState | null>(null);

/** Comparte la conversación, el historial y la configuración entre pantallas. */
export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const state = useChatState();
  return <ChatContext.Provider value={state}>{children}</ChatContext.Provider>;
};

export const useChat = (): ChatState => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat debe usarse dentro de <ChatProvider>');
  return ctx;
};
