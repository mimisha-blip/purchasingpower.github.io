import { useState } from 'react';
import { askChat } from './api.js';

const STARTERS = [
  'What does Travel Affordability Score mean?',
  'Why is rent the biggest shock?',
  'What is cheaper in the US than India?',
  'How much should I budget for San Francisco?'
];

export default function ChatAssistant() {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Ask me about prices, affordability scores, or relocation costs.'
    }
  ]);
  const [loading, setLoading] = useState(false);

  async function sendQuestion(text) {
    const clean = text.trim();
    if (!clean || loading) return;

    setQuestion('');
    setMessages((prev) => [...prev, { role: 'user', text: clean }]);
    setLoading(true);

    try {
      const res = await askChat(clean);
      setMessages((prev) => [...prev, { role: 'assistant', text: res.data.message }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: 'assistant', text: err.message }]);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    sendQuestion(question);
  }

  return (
    <div className={`chat-assistant ${open ? 'open' : ''}`}>
      {open && (
        <section className="chat-panel" aria-label="Affordability chat assistant">
          <div className="chat-header">
            <div>
              <span>Ask AI</span>
              <strong>Affordability Assistant</strong>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close chat">×</button>
          </div>

          <div className="chat-messages">
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`chat-message ${message.role}`}>
                {message.text}
              </div>
            ))}
            {loading && <div className="chat-message assistant">Thinking...</div>}
          </div>

          <div className="chat-starters">
            {STARTERS.map((starter) => (
              <button key={starter} type="button" onClick={() => sendQuestion(starter)}>
                {starter}
              </button>
            ))}
          </div>

          <form className="chat-input-row" onSubmit={handleSubmit}>
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask a question..."
              aria-label="Ask a question"
            />
            <button type="submit" disabled={loading || !question.trim()}>Send</button>
          </form>
        </section>
      )}

      <button
        type="button"
        className="chat-fab"
        onClick={() => setOpen((prev) => !prev)}
        aria-label={open ? 'Close affordability assistant' : 'Open affordability assistant'}
      >
        🤖
      </button>
    </div>
  );
}
