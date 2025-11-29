import React from 'react';
import { GeneratedAsset, Language, CampaignInputs } from '../types';
import AssetCard from './AssetCard';
import { RefreshCcw, Lightbulb, AlertTriangle, ExternalLink, Star, Save } from 'lucide-react';

interface Props {
  assets: GeneratedAsset[];
  consistencyGuide: string;
  onReset: () => void;
  inputs: CampaignInputs;
  onUpdateAsset: (asset: GeneratedAsset) => void;
  onSaveProject: () => void;
  lang: Language;
  apiKey: string;
}

const AssetList: React.FC<Props> = ({ assets, consistencyGuide, onReset, inputs, onUpdateAsset, onSaveProject, lang, apiKey }) => {
  const platforms = [
    { name: 'Felo Ai', url: 'https://felo.ai', recommended: true },
    { name: 'LMArena', url: 'https://lmarena.ai' },
    { name: 'Lovart Ai', url: 'https://lovart.ai' },
    { name: 'Trickle', url: 'https://trickle.so' },
    { name: 'Muset Ai', url: 'https://muset.ai' },
    { name: 'ListenHub', url: 'https://listenhub.ai' },
    { name: 'ZenMux Ai', url: 'https://zenmux.ai' },
    { name: 'YouMind', url: 'https://youmind.com' },
    { name: 'Dreamina', url: 'https://dreaminicapcut.com' },
  ];

  const t = {
    ar: {
      title: 'أصول الحملة التسويقية',
      subtitle: '14 توجيهات عالية الجودة مصممة خصيصاً لمنتجك (تشمل البريد الإلكتروني وشهادات الإتمام).',
      newCampaign: 'حملة جديدة',
      saveProject: 'حفظ المشروع',
      proTipTitle: 'سر الاحتراف: كيف توحد الهوية؟',
      headers: {
        foundation: '🏁 الخطوة التمهيدية: تصميم هوية المنتج',
        phase1: '🔷 المرحلة الأولى: أصول المنتج',
        phase2: '🔶 المرحلة الثانية: أدوات الإقناع',
        phase3: '🚀 المرحلة الثالثة: السوشيال ميديا',
        phase4: '📧 المرحلة الرابعة: ما بعد البيع',
      },
      warning: {
        title: '⚠️ تنبيه هام جداً (خطوة إجبارية)',
        step1: 'انسخ كود اللوجو (في الأعلى) ونفذه في Nano Banana أولاً.',
        step2: 'احفظ صورة اللوجو الناتجة على جهازك.',
        step3: 'اضغط علامة (+) في Nano Banana وارفع الصورة كمرجع (Reference Image).',
        whyTitle: 'لماذا؟',
        whyDesc: 'لكي يفهم الذكاء الاصطناعي شعارك ويضعه بدقة على العلبة والداشبورد وباقي التصاميم!',
      },
      platforms: {
        title: 'أين يمكنك تنفيذ هذه الأوامر مجاناً؟',
        desc: 'هذه المنصات توفر نموذج Nano Banana Pro (Gemini 3) للاستخدام المجاني:',
        recommended: 'موصى به',
      }
    },
    en: {
      title: 'Campaign Marketing Assets',
      subtitle: '14 High-quality prompts tailored to your product (Including Email & Certificates).',
      newCampaign: 'New Campaign',
      saveProject: 'Save Project',
      proTipTitle: 'Pro Tip: How to maintain consistency?',
      headers: {
        foundation: '🏁 The Foundation: Brand Identity',
        phase1: '🔷 Phase 1: Product Assets',
        phase2: '🔶 Phase 2: Persuasion Tools',
        phase3: '🚀 Phase 3: Social Media',
        phase4: '📧 Phase 4: Post-Purchase Experience',
      },
      warning: {
        title: '⚠️ Very Important Step (Mandatory)',
        step1: 'Copy the Logo prompt (above) and run it in Nano Banana first.',
        step2: 'Save the generated Logo image to your device.',
        step3: 'Click the (+) button in Nano Banana and upload it as a Reference Image.',
        whyTitle: 'Why?',
        whyDesc: 'So the AI understands your logo and places it accurately on the box, dashboard, and other designs!',
      },
      platforms: {
        title: 'Where can you run these prompts for free?',
        desc: 'These platforms offer Nano Banana Pro (Gemini 3) for free usage:',
        recommended: 'Recommended',
      }
    }
  };

  const txt = t[lang];

  // Grouping Logic
  const getAsset = (id: number) => assets.find(a => a.id === id);
  const getAssets = (ids: number[]) => ids.map(id => getAsset(id)).filter((a): a is GeneratedAsset => !!a);

  const foundationAssets = getAssets([0]);
  const phase1Assets = getAssets([1, 2, 3]);
  const phase2Assets = getAssets([4, 11, 5]);
  const phase3Assets = getAssets([6, 7, 8, 9, 10]);
  const phase4Assets = getAssets([12, 13]);

  if (assets.length === 0) return null;

  const renderSection = (title: string, items: GeneratedAsset[], cols: number = 3) => {
    if (items.length === 0) return null;
    return (
      <div className="mb-12 animate-fade-in">
        <h3 className={`text-xl md:text-2xl font-bold text-white mb-6 border-b border-nano-800 pb-3 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
          {title}
        </h3>
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${cols} xl:grid-cols-${cols === 1 ? '1' : '4'} gap-6`}>
          {items.map((asset) => (
             <AssetCard 
                key={asset.id} 
                asset={asset} 
                index={asset.id} 
                lang={lang}
                inputs={inputs}
                onUpdate={onUpdateAsset}
                apiKey={apiKey}
              />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-6 pb-20 animate-fade-in">
      
      {/* 4. PLATFORMS GUIDE (Moved to Top) */}
      <div className="mb-10 pb-10 border-b border-nano-800 animate-fade-in">
         <div className={`mb-6 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
            <h3 className="text-xl font-bold text-white mb-2">{txt.platforms.title}</h3>
            <p className="text-gray-400 text-sm">{txt.platforms.desc}</p>
         </div>
         
         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {platforms.map(p => (
                <a 
                  key={p.name} 
                  href={p.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`block p-4 rounded-xl border transition-all duration-200 relative group overflow-hidden ${p.recommended ? 'bg-banana-400/5 border-banana-400/50 hover:bg-banana-400 hover:text-black hover:border-banana-400 text-banana-400 shadow-[0_0_15px_-5px_rgba(255,215,0,0.2)]' : 'bg-nano-900 border-nano-800 text-gray-300 hover:border-gray-600 hover:text-white hover:bg-nano-800'}`}
                >
                   {p.recommended && (
                      <div className={`absolute top-0 ${lang === 'ar' ? 'left-0' : 'right-0'}`}>
                          <div className={`bg-banana-400 text-black text-[10px] font-bold px-2 py-0.5 ${lang === 'ar' ? 'rounded-br-lg' : 'rounded-bl-lg'}`}>
                            {txt.platforms.recommended}
                          </div>
                      </div>
                   )}
                   <div className="flex flex-col items-center justify-center gap-2 text-center h-full py-2">
                      <div className="flex items-center gap-1.5 font-bold text-sm truncate w-full justify-center">
                        {p.recommended && <Star size={12} fill="currentColor" />}
                        {p.name}
                      </div>
                      <span className="text-[10px] opacity-60 flex items-center gap-1">
                        {p.url.replace('https://', '')} <ExternalLink size={10} />
                      </span>
                   </div>
                </a>
            ))}
         </div>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <div className={`w-full md:w-auto ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
          <h2 className="text-3xl font-bold text-white mb-2">{txt.title}</h2>
          <p className="text-gray-400">{txt.subtitle}</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
             <button 
              onClick={onSaveProject}
              className="flex-1 md:flex-none px-4 py-2.5 bg-nano-900 hover:bg-nano-800 text-banana-400 border border-nano-700 hover:border-banana-400 rounded-lg flex items-center justify-center gap-2 transition-all font-bold"
            >
              <Save size={18} />
              {txt.saveProject}
            </button>
            <button 
              onClick={onReset}
              className="flex-1 md:flex-none px-4 py-2.5 bg-nano-800 hover:bg-nano-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors border border-nano-700"
            >
              <RefreshCcw size={16} />
              {txt.newCampaign}
            </button>
        </div>
      </div>

      {/* 1. FOUNDATION (Logo) */}
      {renderSection(txt.headers.foundation, foundationAssets, 1)}

      {/* 2. CONSISTENCY WARNING BOX */}
      <div className="max-w-4xl mx-auto mb-16 animate-fade-in-up">
        <div className="bg-yellow-900/20 border border-yellow-500/50 rounded-2xl p-6 md:p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-yellow-500/10 rounded-full blur-xl pointer-events-none"></div>
          
          <div className={`flex flex-col md:flex-row gap-6 ${lang === 'ar' ? 'md:text-right' : 'md:text-left'}`}>
             <div className="shrink-0 flex justify-center md:block">
                <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-400 border border-yellow-500/30">
                   <AlertTriangle size={32} strokeWidth={1.5} />
                </div>
             </div>
             
             <div className="flex-grow space-y-4">
                <h3 className="text-xl font-bold text-yellow-400">{txt.warning.title}</h3>
                
                <div className="space-y-3">
                   <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-yellow-500/20 text-yellow-500 flex items-center justify-center text-xs font-bold mt-0.5">1</span>
                      <p className="text-gray-200">{txt.warning.step1}</p>
                   </div>
                   <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-yellow-500/20 text-yellow-500 flex items-center justify-center text-xs font-bold mt-0.5">2</span>
                      <p className="text-gray-200">{txt.warning.step2}</p>
                   </div>
                   <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-yellow-500/20 text-yellow-500 flex items-center justify-center text-xs font-bold mt-0.5">3</span>
                      <p className="text-gray-200 font-semibold">{txt.warning.step3}</p>
                   </div>
                </div>

                <div className="mt-4 pt-4 border-t border-yellow-500/20 flex flex-col sm:flex-row items-start sm:items-center gap-2 text-sm text-yellow-200/80">
                   <span className="font-bold text-yellow-400 bg-yellow-500/10 px-2 py-0.5 rounded">{txt.warning.whyTitle}</span>
                   <span>{txt.warning.whyDesc}</span>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* 3. REMAINING PHASES */}
      {renderSection(txt.headers.phase1, phase1Assets)}
      {renderSection(txt.headers.phase2, phase2Assets)}
      {renderSection(txt.headers.phase3, phase3Assets)}
      {renderSection(txt.headers.phase4, phase4Assets)}

      {/* Footer Consistency Tip */}
      {consistencyGuide && (
        <div className="max-w-3xl mx-auto mt-16 p-1 rounded-2xl bg-gradient-to-r from-nano-800 via-nano-800 to-transparent opacity-60 hover:opacity-100 transition-opacity">
          <div className="bg-nano-900/90 backdrop-blur rounded-xl p-6 border border-nano-700">
            <div className={`flex items-start gap-4 ${lang === 'ar' ? 'flex-row' : 'flex-row-reverse'}`}>
              <div className="shrink-0 w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-gray-300">
                <Lightbulb size={18} />
              </div>
              <div className={`flex-grow ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                <h3 className="text-lg font-bold text-gray-300 mb-2">{txt.proTipTitle}</h3>
                <div className="text-gray-400 text-sm leading-relaxed whitespace-pre-line">
                  {consistencyGuide}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetList;