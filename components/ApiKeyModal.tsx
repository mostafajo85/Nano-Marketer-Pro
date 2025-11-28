import React, { useState, useEffect } from 'react';
import { Key, Check, ShieldCheck, ExternalLink } from 'lucide-react';
import { Language, ApiKeyConfig } from '../types';

interface Props {
  isOpen: boolean;
  onSave: (config: ApiKeyConfig) => void;
  onClose: () => void;
  lang: Language;
  existingKey?: string;
}

const ApiKeyModal: React.FC<Props> = ({ isOpen, onSave, onClose, lang, existingKey }) => {
  const [key, setKey] = useState('');
  const [provider, setProvider] = useState<'gemini' | 'openai'>('gemini');

  useEffect(() => {
    if (isOpen && existingKey) {
      setKey(existingKey);
    }
  }, [isOpen, existingKey]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (key.trim()) {
      onSave({ key: key.trim(), provider });
      onClose();
    }
  };

  const t = {
    ar: {
      title: 'إعدادات مفتاح API',
      desc: 'للاستمرار، يجب عليك إضافة مفتاح API الخاص بك. يتم حفظ المفتاح محلياً في متصفحك ولا يتم مشاركته.',
      label: 'مفتاح API',
      placeholder: 'ألصق المفتاح هنا...',
      save: 'حفظ ومتابعة',
      getHelper: 'احصل على مفتاح مجاني من هنا',
      providerLabel: 'مقدم الخدمة',
      security: 'آمن ومشفر محلياً'
    },
    en: {
      title: 'API Key Settings',
      desc: 'To continue, you must add your own API Key. Your key is stored locally in your browser and never shared.',
      label: 'Your API Key',
      placeholder: 'Paste key here...',
      save: 'Save & Continue',
      getHelper: 'Get a free key here',
      providerLabel: 'Provider',
      security: 'Securely stored locally'
    }
  };

  const txt = t[lang];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-nano-900 border border-nano-800 rounded-2xl w-full max-w-md shadow-2xl p-6 relative overflow-hidden">
        {/* Glow Effect */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-32 h-32 bg-banana-400/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-nano-800 flex items-center justify-center text-banana-400 border border-nano-700">
            <Key size={20} />
          </div>
          <h2 className="text-xl font-bold text-white">{txt.title}</h2>
        </div>

        <p className="text-gray-400 text-sm mb-6 leading-relaxed">
          {txt.desc}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">{txt.providerLabel}</label>
            <div className="grid grid-cols-2 gap-3">
                <button
                    type="button"
                    onClick={() => setProvider('gemini')}
                    className={`flex items-center justify-center gap-2 py-3 rounded-lg border transition-all ${provider === 'gemini' ? 'bg-banana-400/10 border-banana-400 text-banana-400' : 'bg-nano-950 border-nano-800 text-gray-500 hover:border-gray-600'}`}
                >
                    <span className="font-bold">Gemini</span>
                </button>
                <button
                    type="button"
                    onClick={() => setProvider('openai')}
                    disabled
                    className="flex flex-col items-center justify-center py-3 rounded-lg border bg-nano-950 border-nano-800 text-gray-600 opacity-50 cursor-not-allowed"
                >
                    <span className="font-bold">OpenAI</span>
                    <span className="text-[9px] uppercase">Coming Soon</span>
                </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">{txt.label}</label>
            <input
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder={txt.placeholder}
              className="w-full bg-nano-950 border border-nano-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-banana-400 focus:ring-1 focus:ring-banana-400 transition-all font-mono text-sm"
              autoFocus
            />
          </div>

          <a 
            href="https://aistudio.google.com/app/apikey" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-banana-400 hover:underline"
          >
            {txt.getHelper} <ExternalLink size={10} />
          </a>

          <button
            type="submit"
            disabled={!key.trim()}
            className="w-full bg-banana-400 hover:bg-banana-300 text-nano-950 font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Check size={18} />
            {txt.save}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500">
            <ShieldCheck size={12} />
            {txt.security}
        </div>
      </div>
    </div>
  );
};

export default ApiKeyModal;