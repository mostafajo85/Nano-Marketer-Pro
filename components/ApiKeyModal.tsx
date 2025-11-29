
import React, { useState, useEffect } from 'react';
import { Key, Check, ShieldCheck, ExternalLink, Cpu, Zap } from 'lucide-react';
import { Language, ApiKeyConfig } from '../types';
import { SUPPORTED_MODELS, detectBestModel } from '../services/geminiService';

interface Props {
  isOpen: boolean;
  onSave: (config: ApiKeyConfig) => void;
  onClose: () => void;
  lang: Language;
  existingKey?: string;
}

const ApiKeyModal: React.FC<Props> = ({ isOpen, onSave, onClose, lang, existingKey }) => {
  const [key, setKey] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [customModel, setCustomModel] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [checkStatus, setCheckStatus] = useState<string>('');

  useEffect(() => {
    if (isOpen && existingKey) {
      setKey(existingKey);
      // Try to recover saved model from localStorage if available
      const savedModel = localStorage.getItem('nano_model');
      if (savedModel) {
        if (SUPPORTED_MODELS.some(m => m.id === savedModel)) {
          setSelectedModel(savedModel);
        } else {
          setSelectedModel('custom');
          setCustomModel(savedModel);
        }
      }
    }
  }, [isOpen, existingKey]);

  if (!isOpen) return null;

  const handleSmartConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!key.trim()) return;

    setIsChecking(true);
    setCheckStatus(lang === 'ar' ? 'جاري فحص وتحديد أفضل موديل مناسب لمفتاحك...' : 'Auto-detecting best model for your key...');

    try {
      // 1. Auto detect best model
      const bestModel = await detectBestModel(key.trim());
      
      setCheckStatus(lang === 'ar' ? `تم الاتصال بنجاح بـ: ${bestModel}` : `Connected to: ${bestModel}`);
      
      // 2. Save
      setTimeout(() => {
        onSave({ key: key.trim(), provider: 'gemini', model: bestModel });
        localStorage.setItem('nano_model', bestModel);
        onClose();
        setIsChecking(false);
        setCheckStatus('');
      }, 1000);

    } catch (error: any) {
      setIsChecking(false);
      setCheckStatus('');
      alert(error.message);
    }
  };

  const handleManualSave = () => {
    if (key.trim()) {
       // Changed fallback from gemini-1.5-flash to gemini-2.0-flash-exp
       const finalModel = selectedModel === 'custom' ? customModel.trim() : selectedModel || 'gemini-2.0-flash-exp';
       onSave({ key: key.trim(), provider: 'gemini', model: finalModel });
       localStorage.setItem('nano_model', finalModel);
       onClose();
    }
  }

  const t = {
    ar: {
      title: 'إعدادات الذكاء الاصطناعي',
      desc: 'للاستمرار، يجب عليك إضافة مفتاح API. يمكنك أيضاً اختيار النموذج المناسب لمفتاحك.',
      label: 'مفتاح API',
      placeholder: 'ألصق المفتاح هنا...',
      smartConnect: 'اتصال ذكي (اختيار تلقائي)',
      manual: 'أو اختر يدوياً:',
      save: 'حفظ',
      getHelper: 'احصل على مفتاح مجاني من هنا',
      modelLabel: 'نموذج الذكاء الاصطناعي',
      customModelPlaceholder: 'اكتب اسم النموذج (مثال: gemini-1.0-pro)',
      security: 'آمن ومشفر محلياً'
    },
    en: {
      title: 'AI Settings',
      desc: 'To continue, you must add your API Key. You can also select the specific model for your key.',
      label: 'API Key',
      placeholder: 'Paste key here...',
      smartConnect: 'Smart Connect (Auto-Detect)',
      manual: 'Or select manually:',
      save: 'Save',
      getHelper: 'Get a free key here',
      modelLabel: 'AI Model',
      customModelPlaceholder: 'Enter model name (e.g., gemini-1.0-pro)',
      security: 'Securely stored locally'
    }
  };

  const txt = t[lang];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-nano-900 border border-nano-800 rounded-2xl w-full max-w-md shadow-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-32 h-32 bg-banana-400/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-nano-800 flex items-center justify-center text-banana-400 border border-nano-700">
            <Key size={20} />
          </div>
          <h2 className="text-xl font-bold text-white">{txt.title}</h2>
        </div>

        <form onSubmit={handleSmartConnect} className="space-y-5">
          
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">{txt.label}</label>
            <input
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder={txt.placeholder}
              className="w-full bg-nano-950 border border-nano-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-banana-400 focus:ring-1 focus:ring-banana-400 transition-all font-mono text-sm"
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
          
          {/* Smart Connect Button */}
          <button
            type="submit"
            disabled={!key.trim() || isChecking}
            className="w-full bg-banana-400 hover:bg-banana-300 text-nano-950 font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_-5px_rgba(255,215,0,0.3)] hover:shadow-[0_0_25px_-5px_rgba(255,215,0,0.5)]"
          >
            {isChecking ? (
               <div className="flex items-center gap-2">
                   <div className="w-4 h-4 border-2 border-nano-950 border-t-transparent rounded-full animate-spin"></div>
                   <span>{checkStatus}</span>
               </div>
            ) : (
                <>
                    <Zap size={18} fill="currentColor" />
                    {txt.smartConnect}
                </>
            )}
          </button>

          {/* Manual Divider */}
          <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-nano-800"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-nano-900 px-2 text-gray-500">{txt.manual}</span>
              </div>
          </div>

          {/* Manual Model Selection */}
          <div className="space-y-2 opacity-80 hover:opacity-100 transition-opacity">
            <div className="flex gap-2">
                <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="flex-grow bg-nano-950 border border-nano-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-banana-400 transition-all text-xs"
                >
                <option value="" disabled>{txt.modelLabel}</option>
                {SUPPORTED_MODELS.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                ))}
                <option value="custom">Custom Model...</option>
                </select>
                
                <button 
                    type="button"
                    onClick={handleManualSave}
                    disabled={!key.trim()}
                    className="px-4 py-2 bg-nano-800 hover:bg-nano-700 text-white rounded-lg text-xs font-bold transition-colors"
                >
                    {txt.save}
                </button>
            </div>
            
            {selectedModel === 'custom' && (
              <input
                type="text"
                required
                value={customModel}
                onChange={(e) => setCustomModel(e.target.value)}
                placeholder={txt.customModelPlaceholder}
                className="w-full bg-nano-900 border border-nano-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-banana-400 text-sm mt-2"
              />
            )}
          </div>
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
