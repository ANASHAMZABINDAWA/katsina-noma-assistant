import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Globe } from 'lucide-react';

// In Assistant.jsx and PestScanner.jsx
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const Assistant = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("en");
  const chatEndRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initial greeting
  useEffect(() => {
    const greeting = language === "ha"
      ? "Sannu! Ni ne Katsina Noma Assistant 🌾\n\nMe kake so ka sani game da noma a Katsina?"
      : "Sannu! I'm your Katsina Noma Assistant 🌾\n\nAsk me anything about farming in Katsina State.";

    setMessages([{ type: "bot", text: greeting }]);
  }, [language]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { type: "user", text: input };
    setMessages(prev => [...prev, userMessage]);
    
    const currentInput = input;
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: currentInput,     // ← This is what the backend expects
          language: language         // Optional: you can use it later if needed
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get response");
      }

      // Add bot reply
      setMessages(prev => [...prev, { type: "bot", text: data.reply }]);

    } catch (error) {
      console.error("Chat Error:", error);

      const errorMsg = language === "ha"
        ? "Yi hakuri, AI yana da yawan aiki yanzu. A jira ka sake tambaya."
        : "Sorry, the AI is busy right now. Please try again in a moment.";

      setMessages(prev => [...prev, { type: "error", text: errorMsg }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === "en" ? "ha" : "en");
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 flex flex-col h-[calc(100vh-140px)]">
      <div className="flex justify-between items-center mb-6 bg-white rounded-3xl px-5 py-3 shadow border border-gray-100">
        <h1 className="text-2xl font-bold text-primary">Noma Assistant</h1>
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-5 py-2 rounded-2xl text-sm font-medium active:scale-95 transition"
        >
          <Globe className="w-5 h-5" />
          {language === "en" ? "Switch to Hausa" : "Canja zuwa Turanci"}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-6 pr-2 mb-6 custom-scroll">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] rounded-3xl px-5 py-4 ${
              msg.type === "user"
                ? "bg-gradient-to-br from-emerald-600 to-green-700 text-white rounded-br-none"
                : msg.type === "error"
                ? "bg-red-50 border border-red-200 text-red-700 rounded-bl-none"
                : "bg-white shadow border border-gray-100 rounded-bl-none"
            }`}>
              <div className="flex items-center gap-2 mb-2">
                {msg.type === "bot" && <Bot className="w-5 h-5 text-emerald-600" />}
                {msg.type === "user" && <User className="w-5 h-5" />}
                {msg.type === "error" && <span className="text-red-500">⚠️</span>}
                <span className="text-xs opacity-70">
                  {msg.type === "bot" ? "Katsina Noma AI" : msg.type === "user" ? "You" : "Error"}
                </span>
              </div>
              <p className="leading-relaxed whitespace-pre-wrap text-[15.5px]">{msg.text}</p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white shadow border border-gray-100 rounded-3xl rounded-bl-none px-5 py-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce delay-150" />
                <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce delay-300" />
                <span className="ml-2 text-sm text-gray-500">Thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="sticky bottom-4 bg-white border border-gray-200 rounded-3xl shadow-xl p-2">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={language === "ha" ? "Tambaya game da noma..." : "Ask about farming in Katsina..."}
            className="flex-1 bg-transparent px-5 py-4 outline-none text-base"
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            className="bg-gradient-to-r from-emerald-600 to-green-700 text-white p-4 rounded-2xl disabled:opacity-50 active:scale-95 transition"
          >
            <Send className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Assistant;