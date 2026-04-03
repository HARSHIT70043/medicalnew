import { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import Markdown from 'react-markdown';

let ai: any = null;
try {
  const apiKey = process.env.GEMINI_API_KEY || import.meta.env.VITE_GEMINI_API_KEY;
  if (apiKey) {
    ai = new GoogleGenAI({ apiKey });
  }
} catch (e) {
  console.error("Failed to initialize GoogleGenAI", e);
}

interface Message {
  role: 'user' | 'model';
  content: string;
}

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      content: 'Hello! I am your HealthConnect AI Assistant. How can I help you today? You can ask me about medicines, symptoms, or hospital helplines.',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<any>(null);

  useEffect(() => {
    const initChat = async () => {
      if (chatRef.current || !ai) return;

      let userProfileContext = '';
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const res = await fetch('/api/profile', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            if (data.profile) {
              userProfileContext = `\n\nUser Medical Profile Context:\nBlood Type: ${data.profile.bloodType || 'Unknown'}\nAllergies: ${data.profile.allergies || 'None reported'}\nChronic Conditions: ${data.profile.chronicConditions || 'None reported'}\nAge: ${data.profile.age || 'Unknown'}\n\nPlease use this medical profile context to provide more personalized and relevant advice.`;
            }
          }
        }
      } catch (e) {
        console.error("Failed to fetch profile context", e);
      }

      chatRef.current = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction: 'You are a helpful medical assistant for a hospital website. Provide general information about medicines used to cure diseases, and if asked for a helpline number, provide a generic emergency number (like 112 or 911) or a mock hospital reception number (e.g., 1-800-HOSPITAL). Always advise users to consult a real doctor for serious medical advice.' + userProfileContext,
        },
      });
    };

    initChat();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !chatRef.current) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await chatRef.current.sendMessage({ message: userMessage });
      
      setMessages((prev) => [...prev, { role: 'model', content: response.text || 'Sorry, I could not process that request.' }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        { role: 'model', content: 'Sorry, I encountered an error while processing your request.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] md:h-[calc(100vh-6rem)] bg-white rounded-3xl border border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
      <div className="bg-emerald-600 p-5 text-white flex items-center gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full mix-blend-overlay filter blur-2xl opacity-20 -mr-10 -mt-10" />
        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-inner relative z-10">
          <Bot className="w-6 h-6" />
        </div>
        <div className="relative z-10">
          <h2 className="font-bold text-xl font-display tracking-tight">HealthConnect AI</h2>
          <p className="text-emerald-100 text-sm font-medium flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
            Online | Medical Assistant
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-neutral-50/50">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                msg.role === 'user' ? 'bg-emerald-100 text-emerald-700' : 'bg-white border border-neutral-100 text-neutral-600'
              }`}
            >
              {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
            </div>
            <div
              className={`max-w-[80%] p-4 rounded-3xl shadow-sm ${
                msg.role === 'user'
                  ? 'bg-emerald-600 text-white rounded-tr-sm'
                  : 'bg-white border border-neutral-100 text-neutral-800 rounded-tl-sm'
              }`}
            >
              {msg.role === 'model' ? (
                <div className="prose prose-sm max-w-none prose-p:leading-relaxed prose-a:text-emerald-600 font-medium">
                  <Markdown>{msg.content}</Markdown>
                </div>
              ) : (
                <p className="text-sm font-medium">{msg.content}</p>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-white border border-neutral-100 text-neutral-600 flex items-center justify-center shrink-0 shadow-sm">
              <Bot className="w-5 h-5" />
            </div>
            <div className="bg-white border border-neutral-100 p-4 rounded-3xl rounded-tl-sm shadow-sm flex items-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
              <span className="text-sm font-bold text-neutral-500 tracking-wide">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-5 bg-white border-t border-neutral-100">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-3"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about medicines, symptoms, or helplines..."
            className="flex-1 border border-neutral-200 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm font-medium bg-neutral-50/50 transition-all"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="w-12 h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0 shadow-lg shadow-emerald-600/20 active:scale-95"
          >
            <Send className="w-5 h-5 ml-0.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
