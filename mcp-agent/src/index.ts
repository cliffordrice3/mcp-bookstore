import OpenAI from 'openai';
import fetch from 'node-fetch';
import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const apiUrl = process.env.MCP_API_URL || 'http://localhost:3000';
const username = process.env.MCP_USER || 'demo';
const password = process.env.MCP_PASS || 'demo';
const port = Number(process.env.PORT || 3001);

const openai = new OpenAI();

async function login(): Promise<string> {
  const res = await fetch(`${apiUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  const data = await res.json() as { access_token: string; message?: string };
  if (!res.ok) throw new Error(data.message || 'Login failed');
  return data.access_token;
}

async function callRpc(token: string, method: string, params: Record<string, unknown> = {}): Promise<any> {
  const payload = { jsonrpc: '2.0', id: Date.now(), method, params };
  const res = await fetch(`${apiUrl}/mcp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });
  const data = await res.json() as ({ result?: any; error?: { message: string } });
  if (data.error) throw new Error(data.error.message);
  return data.result;
}

async function loadTools(token: string) {
  const res = await fetch(`${apiUrl}/mcp/tools`, {
    headers: {
      'Authorization': `Bearer ${token}`
    },
  });
  if (!res.ok) throw new Error('Failed to load MCP schema');
  const schema = await res.json() as any;
  const definitions: any[] = [];
  for (const [name, spec] of Object.entries(schema.tools || {})) {
    const params = (spec as any).params || {};
    const properties: Record<string, any> = {};
    for (const [p, t] of Object.entries(params)) {
      properties[p] = { type: t === 'number' ? 'integer' : t };
    }
    definitions.push({
      type: 'function',
      function: {
        name,
        description: `Call ${name}`,
        parameters: { type: 'object', properties }
      }
    });
  }
  return definitions;
}

async function main() {
  const token = await login();
  const tools = await loadTools(token);

  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const app = express();
  app.use(express.json());
  // serve the built client files from ../public relative to this file
  app.use(express.static(path.join(__dirname, '../public')));

  const messages: any[] = [
    { role: 'system', content: 'You are a helpful bookstore assistant with access to a bookstore API. Use the bookstore API and internal chat state to answer any user questions about books or authors.' }
  ];

  app.post('/chat', async (req: Request, res: Response) => {
    const userInput = (req.body.message || '').toString();
    if (!userInput) return res.status(400).json({ error: 'message required' });
    messages.push({ role: 'user', content: userInput });

    let response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo-1106',
      messages,
      tools,
      tool_choice: 'auto'
    });
    let message = response.choices[0].message;
    messages.push(message);

    while (message.tool_calls) {
      for (const call of message.tool_calls) {
        const args = JSON.parse(call.function.arguments || '{}');
        let result;
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
      response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo-1106',
        messages
      });
      message = response.choices[0].message;
      messages.push(message);
    }

    res.json({ reply: message.content.trim() });
  });

  app.listen(port, () => {
    console.log(`Agent running at http://localhost:${port}`);
  });
}

main().catch((err) => console.error(err));
