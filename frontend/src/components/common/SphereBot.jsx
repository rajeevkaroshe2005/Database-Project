import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, Compass, ArrowRight, MessageSquare } from 'lucide-react';

export default function SphereBot({ onSelectService, services = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Hello! I am SphereBot, your AI Concierge for BookSphere. How can I help you discover or book today?'
    }
  ]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);

  const suggestionChips = [
    '⚽ Football turf in Mumbai',
    '🎬 IMAX 4K Movies',
    '🏖️ Ocean Villa in Goa',
    '🎟️ Available promo coupons',
    '💎 How do reward points work?'
  ];

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = (userText) => {
    const query = (userText || input).trim();
    if (!query) return;

    const newMessages = [...messages, { sender: 'user', text: query }];
    setMessages(newMessages);
    if (!userText) setInput('');

    // Process bot reply with smart matching
    setTimeout(() => {
      const q = query.toLowerCase();
      let reply = '';
      let recommendedService = null;

      if (q.includes('turf') || q.includes('football') || q.includes('sports')) {
        recommendedService = services.find(s => s.category_slug === 'turf') || services[4];
        reply = `I found a top-rated venue for you! "${recommendedService?.title || 'KickOff Pro 7v7'}" in Mumbai has 50mm FIFA AstroTurf with floodlights.`;
      } else if (q.includes('movie') || q.includes('imax') || q.includes('oppenheimer') || q.includes('cinema')) {
        recommendedService = services.find(s => s.category_slug === 'movie') || services[2];
        reply = `Looking for cinema mastery? Check out "${recommendedService?.title || 'PVR INOX IMAX'}" with dual laser projection and electric leather recliners.`;
      } else if (q.includes('villa') || q.includes('goa') || q.includes('hotel') || q.includes('stay')) {
        recommendedService = services.find(s => s.city.toLowerCase() === 'goa') || services[5];
        reply = `For luxury stays, I recommend "${recommendedService?.title || 'The Azure Bay Villa'}" in North Goa with a private cliffside plunge pool and butler.`;
      } else if (q.includes('coupon') || q.includes('discount') || q.includes('promo')) {
        reply = `Here are active promo codes you can apply at checkout:\n• WELCOME10 — 10% off any vertical\n• SPORTS20 — 20% off turfs and courts\n• FIRSTBOOK — Flat ₹200 off\n• MOVIE50 — 50% off movie tickets!`;
      } else if (q.includes('reward') || q.includes('point') || q.includes('tier') || q.includes('perk')) {
        reply = `BookSphere Rewards: You earn 1 point for every ₹100 spent! 1 Point = ₹1 discount on any future reservation. As you climb from Basic -> Silver -> Gold -> Platinum, your multiplier increases up to 2.0x!`;
      } else {
        reply = `We offer 15 booking verticals including Flights, High-Speed Trains, Cinema, AstroTurf, and Rooftop Lounges. Try searching a city or category!`;
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: reply,
          service: recommendedService
        }
      ]);
    }, 600);
  };

  return (
    <>
      {/* Floating Glowing Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 p-3.5 rounded-full bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 text-white shadow-glow-cyan hover:scale-110 transition-transform duration-300 flex items-center justify-center group"
        title="Chat with SphereBot AI Concierge"
      >
        <Bot className="w-6 h-6 group-hover:rotate-12 transition-transform" />
        <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-cyan-300 animate-ping" />
      </button>

      {/* Floating Glass Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 sm:right-6 z-50 w-[92vw] sm:w-96 glass-panel rounded-3xl border border-cyan-500/40 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-cyan-950/80 to-purple-950/80 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  SphereBot Concierge
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </h4>
                <span className="text-[10px] text-slate-400">Powered by BookSphere AI</span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Feed */}
          <div className="p-4 h-72 overflow-y-auto space-y-3 text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`p-3 rounded-2xl max-w-[85%] leading-relaxed whitespace-pre-line ${
                    m.sender === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-tr-none shadow-glow-cyan'
                      : 'bg-white/10 border border-white/10 text-slate-200 rounded-tl-none'
                  }`}
                >
                  {m.text}
                </div>

                {/* Direct Action Recommendation Card */}
                {m.service && (
                  <div
                    onClick={() => {
                      onSelectService(m.service);
                      setIsOpen(false);
                    }}
                    className="mt-2 glass-panel p-2.5 rounded-xl border border-cyan-500/40 hover:border-cyan-300 cursor-pointer flex items-center gap-2.5 text-left max-w-[85%]"
                  >
                    <img
                      src={m.service.cover_image}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-white text-xs truncate">
                        {m.service.title}
                      </div>
                      <div className="text-[10px] text-cyan-300">
                        ₹{m.service.base_price.toLocaleString('en-IN')} • Tap to Book
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  </div>
                )}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Suggestion Chips */}
          <div className="px-3 py-2 bg-space-950/60 border-t border-white/5 flex gap-1.5 overflow-x-auto scrollbar-none">
            {suggestionChips.map((chip, i) => (
              <button
                key={i}
                onClick={() => handleSend(chip)}
                className="px-2.5 py-1 rounded-full text-[10px] whitespace-nowrap bg-white/5 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-white/5 hover:border-cyan-500/30 transition-colors"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-3 border-t border-white/10 flex gap-2">
            <input
              type="text"
              placeholder="Ask SphereBot anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 glass-input rounded-xl px-3 py-2 text-xs outline-none"
            />
            <button
              onClick={() => handleSend()}
              className="p-2.5 rounded-xl bg-cyan-500 text-space-950 font-bold hover:bg-cyan-400 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
