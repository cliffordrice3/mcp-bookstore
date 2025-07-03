import OpenAI from 'openai';
import fetch from 'node-fetch';
import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import os from 'os';

const apiUrl = process.env.MCP_API_URL || 'http://localhost:3000';
const username = process.env.MCP_USER || 'demo';
const password = process.env.MCP_PASS || 'demo';
const port = Number(process.env.PORT || 3001);

const openai = new OpenAI();

const historyPath = path.join(path.dirname(fileURLToPath(import.meta.url)), '../history.jsonl');

function loadHistory(): any[] {
  if (!fs.existsSync(historyPath)) return [];
  const lines = fs.readFileSync(historyPath, 'utf8').split(/\n+/).filter(Boolean);
  const entries: any[] = [];
  for (const line of lines) {
    try { entries.push(JSON.parse(line)); } catch {}
  }
  return entries;
}

function appendHistory(entry: any) {
  fs.appendFileSync(historyPath, JSON.stringify(entry) + os.EOL);
}

function tokenize(text: string): string[] {
  return text.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
}

function jaccard(a: string[], b: string[]): number {
  const setA = new Set(a);
  const setB = new Set(b);
  let inter = 0;
  for (const t of setA) if (setB.has(t)) inter++;
  const union = new Set([...setA, ...setB]).size;
  return union ? inter / union : 0;
}

function retrieveRelevantHistory(query: string, records: any[], limit = 3): any[] {
  const qTokens = tokenize(query);
  const scored = records
    .filter(r => r.role !== 'tool' && !(r.role === 'assistant' && r.tool_calls))
    .map(r => ({ r, score: jaccard(qTokens, tokenize(r.content || '')) }));
  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(s => s.r);
}

function recentMessages(messages: any[], limit: number): any[] {
  let start = Math.max(messages.length - limit, 1);
  while (start > 1 && messages[start].role === 'tool') {
    start -= 1;
  }
  return messages.slice(start);
}

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
  messages.push(...loadHistory());

  const maxHistory = 10;

  app.post('/chat', async (req: Request, res: Response) => {
    const userInput = (req.body.message || '').toString();
    if (!userInput) return res.status(400).json({ error: 'message required' });
    const userMsg = { role: 'user', content: userInput } as any;
    messages.push(userMsg);
    appendHistory(userMsg);

    const recent = recentMessages(messages, maxHistory);
    const older = messages.slice(1, messages.length - recent.length);
    const retrieved = retrieveRelevantHistory(userInput, older);
    const sendMessages = [messages[0], ...retrieved, ...recent.slice(1)];

    let response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo-1106',
      messages: sendMessages,
      tools,
      tool_choice: 'auto'
    });
    let message = response.choices[0].message;
    messages.push(message);
    appendHistory(message);

    while (message.tool_calls) {
      for (const call of message.tool_calls) {
        const args = JSON.parse(call.function.arguments || '{}');
        let result;
        try {
          result = await callRpc(token, call.function.name, args);
        } catch (e: any) {
          result = { error: e.message };
        }
        const toolMsg = { role: 'tool', tool_call_id: call.id, content: JSON.stringify(result) };
        messages.push(toolMsg);
        appendHistory(toolMsg);
      }
      const recent2 = recentMessages(messages, maxHistory);
      const older2 = messages.slice(1, messages.length - recent2.length);
      const retrieved2 = retrieveRelevantHistory(userInput, older2);
      const sendMessages2 = [messages[0], ...retrieved2, ...recent2.slice(1)];

      response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo-1106',
        messages: sendMessages2
      });
      message = response.choices[0].message;
      messages.push(message);
      appendHistory(message);
    }

    res.json({ reply: message.content.trim() });
  });

  app.listen(port, () => {
    console.log(`Agent running at http://localhost:${port}`);
  });
}

main().catch((err) => console.error(err));
