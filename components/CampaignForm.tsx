import React, { useState } from 'react';
import { CampaignInputs, Language } from '../types';
import { Sparkles, ArrowLeft, ArrowRight, Palette } from 'lucide-react';

interface Props {
  onSubmit: (inputs: CampaignInputs) => void;
  isLoading: boolean;
  lang: Language;
}

const CampaignForm: React.FC<Props> = ({ onSubmit, isLoading, lang }) => {
  const [inputs, setInputs] = useState<CampaignInputs>({
    productName: '',
    description: '',
    language: lang === 'ar' ? 'Arabic' : 'English',
    brandVibe: ''
  });

  const [selectedVibeId, setSelectedVibeId] = useState<string>('');
  const [customVibeText, setCustomVibeText] = useState<string>('');

  const vibes = [
    { id: 'neon', en: 'Neon & Dark (Cyberpunk)', ar: 'نيون وداكن (سايبر بانك)' },
    { id: 'minimal', en: 'Minimalist & Clean', ar: 'بسيط ونظيف (مينيماليست)' },
    { id: 'luxury', en: 'Luxury & Gold', ar: 'فاخر وذهبي' },
    { id: 'pastel', en: 'Pastel & Calm', ar: 'ألوان هادئة (باستيل)' },
    { id: 'corporate', en: 'Corporate & Blue', ar: 'رسمي وأزرق (للشركات)' },
    { id: 'bold', en: 'Bold & Energetic', ar: 'جريء وحيوي' },
    { id: 'custom', en: 'Custom...', ar: 'مخصص...' },
  ];

  const handleChange = (field: keyof CampaignInputs, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const handleVibeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedVibeId(value);
    
    if (value !== 'custom') {
      const selected = vibes.find(v => v.id === value);
      if (selected) {
        handleChange('brandVibe', selected.en); 
      }
    } else {
        handleChange('brandVibe', customVibeText);
    }
  };

  const handleCustomVibeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomVibeText(e.target.value);
    handleChange('brandVibe', e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(inputs);
  };

  const t = {
    ar: {
      headerTitle: 'بيانات المنتج',
      headerDesc: (
        <>
          👋 مرحباً! أنا <strong>Nano Marketer</strong>.. مساعدك الشخصي لتسويق المنتجات الرقمية.<br/>
          🚀 <strong>تم تطوير هذا النظام بواسطة: Mostafa JoOo</strong><br/>
          فقط أعطني اسم منتجك ووصفاً له، وسأبني لك حملة كاملة!
        </>
      ),
      lblProduct: 'اسم المنتج',
      plhProduct: 'مثال: باقة احتراف التصوير الفوتوغرافي',
      lblDesc: 'وصف تفصيلي للمنتج',
      plhDesc: 'اكتب كل شيء هنا... ما هو المنتج؟ لمن هو موجه؟ ما المشكلة التي يحلها؟ (مثال: هذا كورس لتعليم التصوير للمبتدئين الذين يعانون من ضعف الإضاءة، نساعدهم لالتقاط صور احترافية بالهاتف...)',
      lblVibe: 'طابع العلامة التجارية والألوان',
      plhSelectVibe: 'اختر طابع الألوان...',
      plhCustomVibe: 'اكتب الألوان والطابع الخاص بك هنا...',
      lblLang: 'لغة النصوص داخل التصاميم',
      btnLoading: 'جاري تحليل المنتج وإنشاء الحملة...',
      btnSubmit: 'تحليل وإنشاء الأصول',
    },
    en: {
      headerTitle: 'Product Details',
      headerDesc: (
         <>
           👋 Hello! I am <strong>Nano Marketer</strong>.. your personal digital marketing assistant.<br/>
           🚀 <strong>Developed by: Mostafa JoOo</strong><br/>
           Just give me your product name and description, and I'll build a complete campaign!
         </>
      ),
      lblProduct: 'Product Name',
      plhProduct: 'e.g. Photography Mastery Bundle',
      lblDesc: 'Detailed Product Description',
      plhDesc: 'Write everything here... What is it? Who is it for? What problem does it solve? (e.g. A course for beginners struggling with lighting, helping them take pro photos with a phone...)',
      lblVibe: 'Brand Vibe & Colors',
      plhSelectVibe: 'Select color vibe...',
      plhCustomVibe: 'Type your custom colors and vibe here...',
      lblLang: 'Language for Design Text',
      btnLoading: 'Analyzing & Generating...',
      btnSubmit: 'Analyze & Generate Assets',
    }
  };

  const txt = t[lang];

  return (
    <div className="max-w-3xl mx-auto w-full p-6 animate-fade-in-up">
      <div className="bg-nano-900 border border-nano-800 rounded-2xl p-8 shadow-2xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-full bg-banana-400 flex items-center justify-center text-nano-950 shrink-0">
            <Sparkles size={20} fill="currentColor" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{txt.headerTitle}</h2>
            <div className="text-gray-400 text-sm mt-1 leading-relaxed max-w-xl">
              {txt.headerDesc}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">{txt.lblProduct}</label>
            <input
              required
              type="text"
              value={inputs.productName}
              onChange={(e) => handleChange('productName', e.target.value)}
              placeholder={txt.plhProduct}
              className="w-full bg-nano-950 border border-nano-800 rounded-lg px-4 py-4 text-white focus:outline-none focus:border-banana-400 focus:ring-1 focus:ring-banana-400 transition-all placeholder:text-gray-700 text-lg"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">{txt.lblDesc}</label>
            <textarea
              required
              rows={6}
              value={inputs.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder={txt.plhDesc}
              className="w-full bg-nano-950 border border-nano-800 rounded-lg px-4 py-4 text-white focus:outline-none focus:border-banana-400 focus:ring-1 focus:ring-banana-400 transition-all resize-none placeholder:text-gray-700 leading-relaxed"
            />
          </div>

           <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-2">
                <Palette size={14} />
                {txt.lblVibe}
            </label>
            <div className="relative">
                <select
                    value={selectedVibeId}
                    onChange={handleVibeChange}
                    className="w-full bg-nano-950 border border-nano-800 rounded-lg px-4 py-4 text-white focus:outline-none focus:border-banana-400 focus:ring-1 focus:ring-banana-400 transition-all appearance-none cursor-pointer"
                >
                    <option value="" disabled>{txt.plhSelectVibe}</option>
                    {vibes.map((v) => (
                        <option key={v.id} value={v.id}>
                            {lang === 'ar' ? v.ar : v.en}
                        </option>
                    ))}
                </select>
                <div className={`absolute top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 ${lang === 'ar' ? 'left-4' : 'right-4'}`}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </div>
            </div>
            
            {/* Custom Vibe Input */}
            {selectedVibeId === 'custom' && (
                 <div className="animate-fade-in mt-2">
                    <input
                        type="text"
                        required
                        value={customVibeText}
                        onChange={handleCustomVibeChange}
                        placeholder={txt.plhCustomVibe}
                        className="w-full bg-nano-900 border border-nano-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-banana-400 transition-all placeholder:text-gray-600 text-sm"
                    />
                 </div>
            )}
          </div>

          <div className="space-y-2 pt-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">{txt.lblLang}</label>
            <div className="flex gap-4 pt-1 justify-end">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="radio" 
                  name="language" 
                  checked={inputs.language === 'English'}
                  onChange={() => handleChange('language', 'English')}
                  className="hidden"
                />
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${inputs.language === 'English' ? 'border-banana-400' : 'border-gray-600'}`}>
                  {inputs.language === 'English' && <div className="w-2.5 h-2.5 rounded-full bg-banana-400" />}
                </div>
                <span className={`text-sm ${inputs.language === 'English' ? 'text-white' : 'text-gray-400'} group-hover:text-white transition-colors`}>English</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="radio" 
                  name="language" 
                  checked={inputs.language === 'Arabic'}
                  onChange={() => handleChange('language', 'Arabic')}
                  className="hidden"
                />
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${inputs.language === 'Arabic' ? 'border-banana-400' : 'border-gray-600'}`}>
                  {inputs.language === 'Arabic' && <div className="w-2.5 h-2.5 rounded-full bg-banana-400" />}
                </div>
                <span className={`text-sm ${inputs.language === 'Arabic' ? 'text-white' : 'text-gray-400'} group-hover:text-white transition-colors`}>العربية</span>
              </label>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-banana-400 hover:bg-banana-300 text-nano-950 font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-nano-950" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {txt.btnLoading}
                </>
              ) : (
                <>
                  {txt.btnSubmit} 
                  {lang === 'ar' ? <ArrowLeft size={20} /> : <ArrowRight size={20} />}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CampaignForm;