import React, { useState } from 'react';

interface LogItem { role: string; text: string; }

export default function App() {
  const [log, setLog] = useState<LogItem[]>([]);
  const [input, setInput] = useState('');

  const send = async () => {
    const text = input.trim();
    if (!text) return;
    setLog(l => [...l, { role: 'You', text }]);
    setInput('');
    const res = await fetch('/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text })
    });
    const data = await res.json();
    setLog(l => [...l, { role: 'Assistant', text: data.reply }]);
  };

  return (
    <div>
      <h1>MCP Agent Chat</h1>
      <div id="log" style={{ border: '1px solid #ccc', padding: 10, height: 300, overflowY: 'auto' }}>
        {log.map((item, i) => <div key={i}>{item.role}: {item.text}</div>)}
      </div>
      <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') send(); }} style={{ width: '80%' }} />
      <button onClick={send}>Send</button>
    </div>
  );
}
