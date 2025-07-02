import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { login, callRpc, loadTools } from './mcpClient.js';
import { ChatMessage, ChatProvider } from './providers/index.js';
import { createOpenAIProvider } from './providers/openai.js';
import { createOllamaProvider } from './providers/ollama.js';

const port = process.env.PORT || 3001;
const providerName = (process.env.LLM_PROVIDER || 'openai').toLowerCase();

function getProvider(): ChatProvider {
  if (providerName === 'ollama') return createOllamaProvider();
  return createOpenAIProvider();
}

async function main() {
  const provider = getProvider();
  const token = await login();
  const tools = await loadTools(token);

  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const app = express();
  app.use(express.json());
  app.use(express.static(path.join(__dirname, '..', 'public')));

  const messages: ChatMessage[] = [
    { role: 'system', content: 'You are a helpful bookstore assistant.' }
  ];

  app.post('/chat', async (req, res) => {
    const userInput = (req.body.message || '').toString();
    if (!userInput) return res.status(400).json({ error: 'message required' });
    messages.push({ role: 'user', content: userInput });

    let { message } = await provider.chat(messages, tools);
    messages.push(message);

    while (message.tool_calls) {
      for (const call of message.tool_calls) {
        const args = JSON.parse(call.function.arguments || '{}');
        let result: any;
        try {
          result = await callRpc(token, call.function.name, args);
        } catch (e: any) {
          result = { error: e.message };
        }
        messages.push({
          role: 'tool',
          tool_call_id: call.id,
          content: JSON.stringify(result)
        });
      }
      ({ message } = await provider.chat(messages));
      messages.push(message);
    }

    res.json({ reply: message.content?.trim() });
  });

  app.listen(port, () => {
    console.log(`Agent running at http://localhost:${port}`);
  });
}

main().catch((err) => console.error(err));
