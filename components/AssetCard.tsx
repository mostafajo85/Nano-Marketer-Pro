import React, { useState } from 'react';
import { GeneratedAsset, Language, AssetPhase, AspectRatio, CampaignInputs } from '../types';
import { Copy, Check, RefreshCw, Smartphone, Monitor, Square, Columns } from 'lucide-react';
import { regenerateAsset } from '../services/geminiService';

interface Props {
  asset: GeneratedAsset;
  index: number;
  lang: Language;
  inputs: CampaignInputs;
  onUpdate: (asset: GeneratedAsset) => void;
}

const AssetCard: React.FC<Props> = ({ asset, index, lang, inputs, onUpdate }) => {
  const [copied, setCopied] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [currentRatio, setCurrentRatio] = useState<AspectRatio>(asset.aspectRatio || '1:1');

  const handleCopy = () => {
    navigator.clipboard.writeText(asset.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerate = async (newRatio?: AspectRatio) => {
    const ratioToUse = newRatio || currentRatio;
    setIsRegenerating(true);
    try {
      const updated = await regenerateAsset(asset, inputs, ratioToUse, lang);
      setCurrentRatio(ratioToUse);
      onUpdate(updated);
    } catch (e) {
      console.error(e);
      alert(lang === 'ar' ? "فشل التحديث" : "Update failed");
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleRatioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRatio = e.target.value as AspectRatio;
    setCurrentRatio(newRatio);
    handleRegenerate(newRatio); // Auto trigger generation on change
  };

  const t = {
    ar: {
      identity: 'الهوية البصرية',
      product: 'المنتج',
      social: 'تواصل اجتماعي',
      copy: 'نسخ النص',
      regen: 'إعادة إنشاء',
      ratio: 'المقاس',
      ratios: {
        '1:1': 'مربع (1:1)',
        '16:9': 'عريض (16:9)',
        '9:16': 'طولي (9:16)',
        '4:5': 'بورتريه (4:5)',
        '3:2': 'قياسي (3:2)',
        '4:3': 'شهادة (4:3)',
        '3:1': 'بانر (3:1)'
      }
    },
    en: {
      identity: 'Brand Identity',
      product: 'Product',
      social: 'Social Media',
      copy: 'Copy Prompt',
      regen: 'Regenerate',
      ratio: 'Size',
      ratios: {
        '1:1': 'Square (1:1)',
        '16:9': 'Wide (16:9)',
        '9:16': 'Story (9:16)',
        '4:5': 'Portrait (4:5)',
        '3:2': 'Standard (3:2)',
        '4:3': 'Certificate (4:3)',
        '3:1': 'Banner (3:1)'
      }
    }
  };

  const txt = t[lang];

  // Map the neutral phase key to localized display text
  const phaseLabel = txt[asset.phase] || txt.product;

  // Infer default ratio from prompt string if not present in object (backward compatibility)
  const inferredRatio = asset.prompt.includes('Aspect Ratio: 16:9') ? '16:9' : 
                        asset.prompt.includes('Aspect Ratio: 9:16') ? '9:16' : 
                        asset.prompt.includes('Aspect Ratio: 4:5') ? '4:5' : 
                        asset.prompt.includes('Aspect Ratio: 3:2') ? '3:2' : 
                        asset.prompt.includes('Aspect Ratio: 4:3') ? '4:3' :
                        asset.prompt.includes('Aspect Ratio: 3:1') ? '3:1' : '1:1';
  
  // Use state if set, otherwise inferred
  const displayRatio = asset.aspectRatio || inferredRatio;

  return (
    <div 
      className="bg-nano-900 border border-nano-800 rounded-xl overflow-hidden hover:border-banana-500/40 transition-all duration-300 group flex flex-col h-full shadow-lg relative"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {isRegenerating && (
        <div className="absolute inset-0 bg-nano-950/80 z-20 flex items-center justify-center backdrop-blur-sm">
             <RefreshCw className="animate-spin text-banana-400" size={32} />
        </div>
      )}

      {/* Header - High Visual Weight */}
      <div className="p-4 border-b border-nano-800 bg-gradient-to-r from-nano-900 to-nano-950 flex justify-between items-start gap-3">
        <div className="flex items-start gap-3 overflow-hidden w-full">
            {/* Index: Visual Anchor (Color Pop) */}
            <span className="shrink-0 w-8 h-8 rounded-lg bg-banana-400 text-nano-950 flex items-center justify-center text-sm font-bold shadow-md mt-0.5">
                {String(index).padStart(2, '0')}
            </span>
            
            <div className="flex flex-col min-w-0 flex-grow">
                {/* Title: Primary Info (Large & Bold) */}
                <h3 className={`font-bold text-white text-lg leading-tight truncate ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                  {asset.title}
                </h3>
                {/* Phase: Secondary Info (Small & Muted) */}
                <span className={`text-[10px] uppercase tracking-wider text-gray-500 font-medium mt-1 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                  {phaseLabel}
                </span>
            </div>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-5 flex-grow flex flex-col gap-4">
        {/* Description: Tertiary Info (Context) */}
        <p className={`text-gray-400 text-sm leading-relaxed min-h-[40px] ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
          {asset.description}
        </p>

        {/* Prompt Box: Core Value (Code Block Style) */}
        <div className="relative group/prompt bg-black rounded-lg border border-nano-700 flex-grow flex flex-col transition-colors hover:border-nano-600" dir="ltr">
           <div className="p-3.5 h-full">
              <p className="text-xs font-mono text-gray-300 group-hover/prompt:text-gray-100 transition-colors leading-relaxed whitespace-pre-wrap">
                {asset.prompt}
              </p>
           </div>
           <button 
             onClick={handleCopy}
             className="absolute top-2 right-2 p-1.5 rounded-md bg-nano-800/90 border border-nano-700 hover:bg-banana-400 hover:text-black hover:border-banana-400 text-gray-400 transition-all z-10 opacity-0 group-hover/prompt:opacity-100 focus:opacity-100 shadow-sm"
             title={txt.copy}
           >
             {copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
           </button>
        </div>
      </div>

      {/* Footer Controls: Tools & Actions */}
      <div className="p-3 bg-nano-950 border-t border-nano-800 flex items-center gap-3">
         {/* Ratio Selector */}
         <div className="relative flex-grow min-w-0 group/select">
            <select 
                value={displayRatio} 
                onChange={handleRatioChange}
                disabled={isRegenerating}
                className="w-full bg-nano-900 border border-nano-800 text-xs text-gray-300 font-medium rounded-lg px-3 py-2.5 appearance-none focus:outline-none focus:border-banana-400 focus:ring-1 focus:ring-banana-400/20 cursor-pointer disabled:opacity-50 truncate transition-all hover:bg-nano-800"
            >
                <option value="1:1">{txt.ratios['1:1']}</option>
                <option value="16:9">{txt.ratios['16:9']}</option>
                <option value="9:16">{txt.ratios['9:16']}</option>
                <option value="4:5">{txt.ratios['4:5']}</option>
                <option value="3:2">{txt.ratios['3:2']}</option>
                <option value="4:3">{txt.ratios['4:3']}</option>
                <option value="3:1">{txt.ratios['3:1']}</option>
            </select>
            <div className={`absolute top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 ${lang === 'ar' ? 'left-3' : 'right-3'}`}>
                <Square size={12} strokeWidth={2.5} />
            </div>
         </div>

         {/* Regenerate Button */}
         <button 
            onClick={() => handleRegenerate()}
            disabled={isRegenerating}
            className="shrink-0 px-4 py-2.5 bg-nano-900 border border-nano-800 text-banana-400 rounded-lg hover:bg-banana-400 hover:text-black transition-all disabled:opacity-50 flex items-center gap-2 text-xs font-bold shadow-sm"
            title={txt.regen}
         >
            <RefreshCw size={14} className={isRegenerating ? 'animate-spin' : ''} strokeWidth={2.5} />
            <span>{txt.regen}</span>
         </button>
      </div>
    </div>
  );
};

export default AssetCard;