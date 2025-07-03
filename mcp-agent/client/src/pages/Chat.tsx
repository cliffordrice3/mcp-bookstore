import { useState, useRef, useEffect } from 'react';
import { marked } from 'marked';

interface Entry { role: string; content: string }

export default function Chat() {
  const [input, setInput] = useState('');
  const [log, setLog] = useState<Entry[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = Math.min(el.scrollHeight, 150) + 'px';
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [input]);

  const send = async () => {
    if (!input.trim()) return;
    const message = input.trim();
    setLog(l => [...l, { role: 'You', content: message }]);
    setInput('');
    adjustHeight();
    const res = await fetch('/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });
    const data = await res.json();
    setLog(l => [...l, { role: 'Assistant', content: data.reply }]);
    textareaRef.current?.focus();
  };

  return (
    <div className="chat">
      <div className="log">
        {log.map((e, i) => (
          <div key={i} className={`entry ${e.role === 'You' ? 'user' : 'assistant'}`}>
            <div
              className="bubble"
              dangerouslySetInnerHTML={{ __html: marked.parse(e.content) }}
            />
          </div>
        ))}
      </div>
      <div className="input-row">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onInput={adjustHeight}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          rows={1}
        />
        <button onClick={send}>Send</button>
      </div>
    </div>
  );
}
