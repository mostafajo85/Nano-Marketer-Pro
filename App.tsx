import React, { useState, useEffect } from 'react';
import { CampaignInputs, GeneratedAsset, Language, SavedProject, ApiKeyConfig } from './types';
import { generateCampaignPrompts } from './services/geminiService';
import CampaignForm from './components/CampaignForm';
import AssetList from './components/AssetList';
import SavedProjectsModal from './components/SavedProjectsModal';
import ApiKeyModal from './components/ApiKeyModal';
import { Zap, Globe, FolderOpen, Settings } from 'lucide-react';

const App: React.FC = () => {
  const [step, setStep] = useState<'input' | 'results'>('input');
  const [isLoading, setIsLoading] = useState(false);
  const [inputs, setInputs] = useState<CampaignInputs | null>(null);
  const [assets, setAssets] = useState<GeneratedAsset[]>([]);
  const [consistencyGuide, setConsistencyGuide] = useState<string>('');
  const [lang, setLang] = useState<Language>('ar');
  
  // API Key State
  const [apiKey, setApiKey] = useState<string>('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Project Management State
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>([]);
  const [isProjectsModalOpen, setIsProjectsModalOpen] = useState(false);

  useEffect(() => {
    // Update HTML attributes for accessibility and proper rendering
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  // Load API Key and Projects from local storage on mount
  useEffect(() => {
    const savedKey = localStorage.getItem('nano_api_key');
    if (savedKey) {
      setApiKey(savedKey);
    } else {
      // If no key found, open settings automatically
      setTimeout(() => setIsSettingsOpen(true), 1000);
    }

    const savedProjectsData = localStorage.getItem('nano_projects');
    if (savedProjectsData) {
      try {
        setSavedProjects(JSON.parse(savedProjectsData));
      } catch (e) {
        console.error("Failed to parse saved projects", e);
      }
    }
  }, []);

  const handleSaveApiKey = (config: ApiKeyConfig) => {
    setApiKey(config.key);
    localStorage.setItem('nano_api_key', config.key);
    setIsSettingsOpen(false);
  };

  const handleFormSubmit = async (formInputs: CampaignInputs) => {
    if (!apiKey) {
      setIsSettingsOpen(true);
      return;
    }

    setInputs(formInputs);
    setIsLoading(true);
    try {
      const result = await generateCampaignPrompts(formInputs, lang, apiKey);
      setAssets(result.assets);
      setConsistencyGuide(result.consistencyGuide || '');
      setStep('results');
    } catch (error) {
      alert(lang === 'ar' ? "فشل في إنشاء الحملة. تأكد من مفتاح API وحاول مرة أخرى." : "Failed to create campaign. Check your API Key and try again.");
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

  // --- Project Management Functions ---

  const handleSaveProject = () => {
    if (!inputs || assets.length === 0) return;

    const newProject: SavedProject = {
      id: Date.now().toString(),
      createdAt: Date.now(),
      inputs: inputs,
      assets: assets,
      consistencyGuide: consistencyGuide,
      lang: lang
    };

    const updatedProjects = [newProject, ...savedProjects];
    setSavedProjects(updatedProjects);
    localStorage.setItem('nano_projects', JSON.stringify(updatedProjects));
    
    alert(lang === 'ar' ? "تم حفظ المشروع بنجاح!" : "Project saved successfully!");
  };

  const handleLoadProject = (project: SavedProject) => {
    setInputs(project.inputs);
    setAssets(project.assets);
    setConsistencyGuide(project.consistencyGuide);
    setLang(project.lang || 'ar'); // Fallback if old data
    setStep('results');
    setIsProjectsModalOpen(false);
  };

  const handleDeleteProject = (id: string) => {
    if (confirm(lang === 'ar' ? "هل أنت متأكد من حذف هذا المشروع؟" : "Are you sure you want to delete this project?")) {
      const updatedProjects = savedProjects.filter(p => p.id !== id);
      setSavedProjects(updatedProjects);
      localStorage.setItem('nano_projects', JSON.stringify(updatedProjects));
    }
  };

  const texts = {
    ar: {
      title: 'Nano',
      titleHighlight: 'Marketer',
      subtitle: 'Pro (Beta v1.0)',
      saved: 'المشاريع',
      settings: 'الإعدادات',
      heroTitle: 'صمّم إطلاقك',
      heroTitleHighlight: 'المثالي',
      heroDesc: 'أدخل فقط اسم ووصف منتجك. سنقوم تلقائياً بتحليل الفكرة واستنتاج الجمهور والألوان وإنشاء 11 أصل تسويقي متكامل.',
      footer: 'Designed & Engineered by Mostafa JoOo © 2025'
    },
    en: {
      title: 'Nano',
      titleHighlight: 'Marketer',
      subtitle: 'Pro (Beta v1.0)',
      saved: 'Projects',
      settings: 'Settings',
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
          <div className="flex items-center gap-2 cursor-pointer" onClick={handleReset}>
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
          
          <div className="flex items-center gap-3">
            <button 
                onClick={() => setIsProjectsModalOpen(true)}
                className="flex items-center gap-2 text-xs font-bold text-gray-300 hover:text-white transition-colors hover:bg-nano-900 px-3 py-2 rounded-lg"
            >
                <FolderOpen size={16} className="text-banana-400" />
                <span className="hidden md:inline">{t.saved}</span>
            </button>

            <button 
                onClick={() => setIsSettingsOpen(true)}
                className="flex items-center gap-2 text-xs font-bold text-gray-300 hover:text-white transition-colors hover:bg-nano-900 px-3 py-2 rounded-lg"
            >
                <Settings size={16} className={!apiKey ? "text-red-500 animate-pulse" : "text-gray-400"} />
                <span className="hidden md:inline">{t.settings}</span>
            </button>

            <button 
                onClick={toggleLanguage}
                className="flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors border border-nano-800 px-3 py-1.5 rounded-full hover:border-banana-400"
            >
                <Globe size={14} />
                {lang === 'ar' ? 'English' : 'العربية'}
            </button>
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
            onSaveProject={handleSaveProject}
            lang={lang}
            apiKey={apiKey}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-nano-800 py-8 bg-nano-950 mt-auto">
         <div className="max-w-7xl mx-auto px-6 text-center text-gray-500 text-xs font-mono tracking-wider">
            <p>{t.footer}</p>
         </div>
      </footer>

      {/* Modals */}
      <SavedProjectsModal 
        isOpen={isProjectsModalOpen} 
        onClose={() => setIsProjectsModalOpen(false)}
        projects={savedProjects}
        onLoad={handleLoadProject}
        onDelete={handleDeleteProject}
        lang={lang}
      />

      <ApiKeyModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={handleSaveApiKey}
        lang={lang}
        existingKey={apiKey}
      />
    </div>
  );
};

export default App;