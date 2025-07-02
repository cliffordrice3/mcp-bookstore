export interface ChatMessage {
  role: string;
  content?: string;
  tool_calls?: any[];
  tool_call_id?: string;
}

export interface ChatResponse {
  message: ChatMessage;
}

export interface ChatProvider {
  chat(messages: ChatMessage[], tools?: any[]): Promise<ChatResponse>;
}
