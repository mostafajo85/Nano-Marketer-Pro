import React, { useState, useEffect } from 'react';
import { CampaignInputs, GeneratedAsset, Language } from './types';
import { generateCampaignPrompts } from './services/geminiService';
import CampaignForm from './components/CampaignForm';
import AssetList from './components/AssetList';
import { Zap, Globe } from 'lucide-react';

const App: React.FC = () => {
  const [step, setStep] = useState<'input' | 'results'>('input');
  const [isLoading, setIsLoading] = useState(false);
  const [inputs, setInputs] = useState<CampaignInputs | null>(null);
  const [assets, setAssets] = useState<GeneratedAsset[]>([]);
  const [consistencyGuide, setConsistencyGuide] = useState<string>('');
  const [hasApiKey, setHasApiKey] = useState(false);
  const [lang, setLang] = useState<Language>('ar');

  useEffect(() => {
    // Update HTML attributes for accessibility and proper rendering
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  // Check for API Key on mount (Optional for text only, but good for Pro check)
  useEffect(() => {
    const checkKey = async () => {
        if (window.aistudio) {
            const selected = await window.aistudio.hasSelectedApiKey();
            setHasApiKey(selected);
        }
    };
    checkKey();
  }, []);

  const handleKeySelection = async () => {
    if (window.aistudio) {
        await window.aistudio.openSelectKey();
        setHasApiKey(true);
    }
  };

  const handleFormSubmit = async (formInputs: CampaignInputs) => {
    setInputs(formInputs);
    setIsLoading(true);
    try {
      const result = await generateCampaignPrompts(formInputs, lang);
      setAssets(result.assets);
      setConsistencyGuide(result.consistencyGuide || '');
      setStep('results');
    } catch (error) {
      alert(lang === 'ar' ? "فشل في إنشاء الحملة. يرجى المحاولة مرة أخرى." : "Failed to create campaign. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssetUpdate = (updatedAsset: GeneratedAsset) => {
    setAssets(prev => prev.map(a => a.id === updatedAsset.id ? updatedAsset : a));
  };

  const handleReset = () => {
    setStep('input');
    setAssets([]);
    setConsistencyGuide('');
    setInputs(null);
  };

  const toggleLanguage = () => {
    setLang(prev => prev === 'ar' ? 'en' : 'ar');
  };

  const texts = {
    ar: {
      title: 'Nano',
      titleHighlight: 'Marketer',
      subtitle: 'Pro',
      selectKey: 'اختر مفتاح API',
      heroTitle: 'صمّم إطلاقك',
      heroTitleHighlight: 'المثالي',
      heroDesc: 'أدخل فقط اسم ووصف منتجك. سنقوم تلقائياً بتحليل الفكرة واستنتاج الجمهور والألوان وإنشاء 11 أصل تسويقي متكامل.',
      footer: 'Designed & Engineered by Mostafa JoOo © 2025'
    },
    en: {
      title: 'Nano',
      titleHighlight: 'Marketer',
      subtitle: 'Pro',
      selectKey: 'Select API Key',
      heroTitle: 'Design Your Perfect',
      heroTitleHighlight: 'Launch',
      heroDesc: 'Just enter your product name and description. We will automatically analyze the idea, infer audience & colors, and generate 11 complete marketing assets.',
      footer: 'Designed & Engineered by Mostafa JoOo © 2025'
    }
  };

  const t = texts[lang];

  return (
    <div className="min-h-screen bg-black flex flex-col font-sans selection:bg-banana-500 selection:text-black">
      {/* Navbar */}
      <header className="border-b border-nano-800 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="text-banana-400" fill="currentColor" />
            <span className="font-bold text-lg tracking-tight">
              {lang === 'ar' ? (
                <>
                  {t.title} <span className="text-banana-400">{t.titleHighlight}</span> {t.subtitle}
                </>
              ) : (
                <>
                  {t.title} <span className="text-banana-400">{t.titleHighlight}</span> {t.subtitle}
                </>
              )}
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
                onClick={toggleLanguage}
                className="flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors border border-nano-800 px-3 py-1.5 rounded-full hover:border-banana-400"
            >
                <Globe size={14} />
                {lang === 'ar' ? 'English' : 'العربية'}
            </button>
            
            {!hasApiKey && window.aistudio && (
               <button 
                  onClick={handleKeySelection}
                  className="text-xs text-gray-400 hover:text-white transition-colors border border-nano-800 px-3 py-1.5 rounded-full"
               >
                  {t.selectKey}
               </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-10">
        {step === 'input' ? (
          <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
             <div className="text-center mb-10 space-y-4 max-w-2xl animate-fade-in-up">
                <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500 tracking-tight leading-tight">
                   {t.heroTitle} <span className="text-banana-400">{t.heroTitleHighlight}</span>
                </h1>
                <p className="text-gray-400 text-lg">
                   {t.heroDesc}
                </p>
             </div>
             <CampaignForm onSubmit={handleFormSubmit} isLoading={isLoading} lang={lang} />
          </div>
        ) : (
          <AssetList 
            assets={assets} 
            consistencyGuide={consistencyGuide}
            onReset={handleReset}
            inputs={inputs!}
            onUpdateAsset={handleAssetUpdate}
            lang={lang}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-nano-800 py-8 bg-nano-950 mt-auto">
         <div className="max-w-7xl mx-auto px-6 text-center text-gray-500 text-xs font-mono tracking-wider">
            <p>{t.footer}</p>
         </div>
      </footer>
    </div>
  );
};

export default App;