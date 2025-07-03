import { useState } from 'react';

interface Entry { role: string; content: string }

export default function Chat() {
  const [input, setInput] = useState('');
  const [log, setLog] = useState<Entry[]>([]);

  const send = async () => {
    if (!input.trim()) return;
    const message = input.trim();
    setLog(l => [...l, { role: 'You', content: message }]);
    setInput('');
    const res = await fetch('/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });
    const data = await res.json();
    setLog(l => [...l, { role: 'Assistant', content: data.reply }]);
  };

  return (
    <div className="chat">
      <div className="log">
        {log.map((e, i) => (
          <div key={i}><strong>{e.role}:</strong> {e.content}</div>
        ))}
      </div>
      <div className="input-row">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') send(); }}
        />
        <button onClick={send}>Send</button>
      </div>
    </div>
  );
}
