import OpenAI from 'openai';
import { ChatMessage, ChatProvider, ChatResponse } from './index.js';

export function createOpenAIProvider(): ChatProvider {
  const openai = new OpenAI();

  return {
    async chat(messages: ChatMessage[], tools?: any[]): Promise<ChatResponse> {
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo-1106',
        messages,
        tools,
        tool_choice: tools ? 'auto' : undefined
      });
      return { message: response.choices[0].message as ChatMessage };
    }
  };
}
