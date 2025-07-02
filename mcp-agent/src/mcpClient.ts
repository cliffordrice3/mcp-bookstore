import fetch from 'node-fetch';

const apiUrl = process.env.MCP_API_URL || 'http://localhost:3000';
const username = process.env.MCP_USER || 'demo';
const password = process.env.MCP_PASS || 'demo';

export async function login(): Promise<string> {
  const res = await fetch(`${apiUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Login failed');
  return data.access_token;
}

export async function callRpc(token: string, method: string, params: Record<string, unknown> = {}): Promise<any> {
  const payload = { jsonrpc: '2.0', id: Date.now(), method, params };
  const res = await fetch(`${apiUrl}/mcp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return data.result;
}

export async function loadTools(token: string): Promise<any[]> {
  const res = await fetch(`${apiUrl}/mcp/tools`, {
    headers: {
      'Authorization': `Bearer ${token}`
    },
  });
  if (!res.ok) throw new Error('Failed to load MCP schema');
  const schema = await res.json();
  const definitions: any[] = [];
  for (const [name, spec] of Object.entries<any>(schema.tools || {})) {
    const params = spec.params || {};
    const properties: Record<string, any> = {};
    for (const [p, t] of Object.entries<any>(params)) {
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
