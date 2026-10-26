import React, { useState } from 'react';
import {
  MessageSquareText,
  Send,
  Sparkles,
  Bot,
  User,
  ShieldAlert,
  Sprout,
  HelpCircle,
  PhoneCall
} from 'lucide-react';
import { queryAssistant } from '../api';
import { WeatherPayload } from '../types';
import { AgroAiLogo } from '../components/AgroAiLogo';

interface AssistantPageProps {
  lang: 'en' | 'ta';
  weather: WeatherPayload | null;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  tamilText?: string;
  remedy?: string;
  caution?: string;
  timestamp: string;
}

export const AssistantPage: React.FC<AssistantPageProps> = ({ lang, weather }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      text: 'வணக்கம்! நான் உங்கள் அக்ரோசென்ஸ் (AgroSense) வேளாண் AI உதவியாளர். உங்கள் பயிரில் உள்ள நோய்கள், இலை மஞ்சள் ஆகுதல், பூச்சி தாக்குதல் மற்றும் இயற்கை மருந்துகள் (பஞ்சகாவ்யா, வேப்பெண்ணெய்) பற்றி தமிழில் அல்லது Tanglish-ல் கேட்கலாம்.',
      tamilText: 'Hello! I am your AgroSense AI agricultural advisor. Ask me in Tamil, Tanglish, or English about crop symptoms, weather-driven disease risk, and organic remedies.',
      remedy: 'Available remedies: Panchagavya 3%, Pseudomonas fluorescens, Neem Oil 5ml/L',
      timestamp: 'Just now'
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentCrop, setCurrentCrop] = useState('Tomato');

  const quickChips = [
    { label: 'En tomato chediyoda ilai yen manjal aagudhu?', crop: 'Tomato' },
    { label: 'Indha weather-la disease spread aaguma?', crop: 'Tomato' },
    { label: 'Ippo naan enna precautions edukkanum?', crop: 'Tomato' },
    { label: 'தக்காளி இலை கருகல் நோய்க்கு மருந்து என்ன?', crop: 'Tomato' },
    { label: 'How to prepare Panchagavya organic spray?', crop: 'Tomato' },
    { label: 'Paddy blast symptoms and cure', crop: 'Rice' }
  ];

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    try {
      const response = await queryAssistant(textToSend, currentCrop, {
        weather: weather?.current
      });

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: response.answer_english,
        tamilText: response.answer_tamil,
        remedy: response.suggested_remedy,
        caution: response.safety_precaution,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          sender: 'assistant',
          text: 'Unable to connect to assistant service. Please check backend connection.',
          timestamp: 'Now'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Header with Creative Logo */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <AgroAiLogo size="lg" lang={lang} />

        {/* Crop Selector */}
        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-[#718355]">Crop Focus:</span>
          <select
            value={currentCrop}
            onChange={(e) => setCurrentCrop(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-white border border-[#CFE1B9] text-xs font-bold text-[#202820] shadow-xs cursor-pointer focus:outline-none"
          >
            <option value="Tomato">Tomato (தக்காளி)</option>
            <option value="Potato">Potato (உருளை)</option>
            <option value="Rice">Rice (நெல்)</option>
            <option value="Corn">Corn (சோளம்)</option>
            <option value="Bell Pepper">Bell Pepper (மிளகாய்)</option>
          </select>
        </div>
      </div>

      {/* Suggested Prompt Chips */}
      <div>
        <p className="text-xs font-bold text-[#718355] mb-2 flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-[#4A5D23]" />
          <span>{lang === 'ta' ? 'அடிக்கடி கேட்கப்படும் கேள்விகள் (Quick Questions):' : 'Common Farmer Questions (Click to Ask):'}</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {quickChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCurrentCrop(chip.crop);
                handleSend(chip.label);
              }}
              className="text-xs font-medium px-3.5 py-1.5 rounded-full bg-white border border-[#CFE1B9] text-[#202820] hover:bg-[#CFE1B9]/30 hover:border-[#4A5D23] transition-all cursor-pointer shadow-xs"
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Conversation Box */}
      <div className="bg-white rounded-3xl border border-[#CFE1B9]/80 shadow-xs flex flex-col h-[520px] overflow-hidden">
        {/* Messages Scroll Area */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((m) => {
            const isUser = m.sender === 'user';
            return (
              <div
                key={m.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-full bg-[#4A5D23] text-white flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-3xl p-4 text-xs leading-relaxed shadow-xs ${
                    isUser
                      ? 'bg-[#4A5D23] text-white rounded-tr-xs'
                      : 'bg-[#F4F9F4] text-[#202820] border border-[#CFE1B9]/80 rounded-tl-xs'
                  }`}
                >
                  {/* Tamil Answer Block */}
                  {m.tamilText && (
                    <div className="mb-2.5 pb-2.5 border-b border-[#CFE1B9]/60">
                      <span className="text-[10px] font-bold text-[#4A5D23] block mb-1">
                        தமிழ் விளக்கம் (Tamil Advisory):
                      </span>
                      <p className="font-medium text-[#202820] leading-relaxed">{m.tamilText}</p>
                    </div>
                  )}

                  {/* English Text */}
                  <p className="whitespace-pre-line">{m.text}</p>

                  {/* Organic Remedy Box */}
                  {m.remedy && (
                    <div className="mt-3 p-2.5 rounded-xl bg-[#CFE1B9]/30 border border-[#718355]/30">
                      <span className="font-bold text-[#4A5D23] block text-[11px]">
                        🌿 பரிந்துரைக்கப்பட்ட சிகிச்சை / மருந்து (Remedy):
                      </span>
                      <p className="text-[#202820] mt-0.5">{m.remedy}</p>
                    </div>
                  )}

                  {/* Safety / Caution */}
                  {m.caution && (
                    <div className="mt-2 text-[11px] text-amber-900 bg-amber-50 p-2 rounded-lg border border-amber-200">
                      ⚠️ <strong>பாதுகாப்பு எச்சரிக்கை:</strong> {m.caution}
                    </div>
                  )}

                  <span className={`text-[10px] block text-right mt-2 ${isUser ? 'text-white/70' : 'text-gray-400'}`}>
                    {m.timestamp}
                  </span>
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-full bg-[#718355] text-white flex items-center justify-center shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3 items-center text-xs text-[#718355] pl-2">
              <Bot className="w-4 h-4 text-[#4A5D23] animate-bounce" />
              <span>AgroSense Assistant is consulting agronomic rules & climate data...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-[#F4F9F4] border-t border-[#CFE1B9]/60">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder={lang === 'ta' ? 'கேள்வியை தமிழில் அல்லது Tanglish-ல் தட்டச்சு செய்க...' : 'Type your question in Tamil, Tanglish, or English...'}
              className="flex-1 px-4 py-3 rounded-2xl bg-white border border-[#CFE1B9] text-xs text-[#202820] placeholder-[#718355] focus:outline-none focus:ring-2 focus:ring-[#4A5D23]"
            />
            <button
              type="submit"
              disabled={loading || !inputQuery.trim()}
              className="px-5 py-3 rounded-2xl bg-[#4A5D23] hover:bg-[#364419] text-white text-xs font-bold transition-all disabled:opacity-50 cursor-pointer shadow-xs flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{lang === 'ta' ? 'அனுப்புக' : 'Send'}</span>
            </button>
          </form>

          {/* Referral Notice */}
          <div className="flex items-center justify-between text-[11px] text-[#718355] mt-2 px-1">
            <span>Supported: தமிழ், English, Tanglish</span>
            <span className="flex items-center gap-1 text-[#4A5D23] font-semibold">
              <PhoneCall className="w-3 h-3" />
              TNAU Kisan Helpline: 1800-425-1660
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
