import fetch from 'node-fetch';
import { ChatMessage, ChatProvider, ChatResponse } from './index.js';

export function createOllamaProvider(model = process.env.OLLAMA_MODEL || 'llama2'):
  ChatProvider {
  const baseUrl = process.env.OLLAMA_URL || 'http://localhost:11434';

  return {
    async chat(messages: ChatMessage[]): Promise<ChatResponse> {
      const res = await fetch(`${baseUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model, messages })
      });
      const data = await res.json();
      return { message: data.message as ChatMessage };
    }
  };
}
