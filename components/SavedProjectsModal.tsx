
import React from 'react';
import { SavedProject, Language } from '../types';
import { Trash2, FolderOpen, Calendar, X, HardDriveDownload } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  projects: SavedProject[];
  onLoad: (project: SavedProject) => void;
  onDelete: (id: string) => void;
  lang: Language;
}

const SavedProjectsModal: React.FC<Props> = ({ isOpen, onClose, projects, onLoad, onDelete, lang }) => {
  if (!isOpen) return null;

  const t = {
    ar: {
      title: 'المشاريع المحفوظة',
      empty: 'لا توجد مشاريع محفوظة حتى الآن.',
      load: 'فتح',
      delete: 'حذف',
      date: 'تاريخ الإنشاء:',
      close: 'إغلاق',
      product: 'المنتج:',
      lang: 'اللغة:'
    },
    en: {
      title: 'Saved Projects',
      empty: 'No saved projects found yet.',
      load: 'Open',
      delete: 'Delete',
      date: 'Created:',
      close: 'Close',
      product: 'Product:',
      lang: 'Language:'
    }
  };

  const txt = t[lang];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fade-in">
      <div className="bg-nano-900 border border-nano-800 rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-nano-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-nano-800 flex items-center justify-center text-banana-400 border border-nano-700">
              <FolderOpen size={20} />
            </div>
            <h2 className="text-xl font-bold text-white">{txt.title}</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-nano-800 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-grow overflow-y-auto p-6 space-y-4 custom-scrollbar">
          {projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500 gap-4">
              <HardDriveDownload size={48} strokeWidth={1} className="opacity-50" />
              <p>{txt.empty}</p>
            </div>
          ) : (
            projects.map((project) => (
              <div 
                key={project.id} 
                className="bg-nano-950 border border-nano-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-banana-400/30 transition-all group"
              >
                <div className="flex-grow space-y-2">
                   <h3 className="text-lg font-bold text-white group-hover:text-banana-400 transition-colors">
                      {project.inputs.productName}
                   </h3>
                   <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
                      <span className="flex items-center gap-1.5">
                         <Calendar size={12} />
                         {new Date(project.createdAt).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US')}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-nano-800 border border-nano-700">
                         {project.inputs.language}
                      </span>
                   </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => onDelete(project.id)}
                    className="p-2.5 text-red-400 hover:bg-red-900/20 hover:text-red-300 rounded-lg transition-colors border border-transparent hover:border-red-900/50"
                    title={txt.delete}
                  >
                    <Trash2 size={18} />
                  </button>
                  <button
                    onClick={() => onLoad(project)}
                    className="px-5 py-2.5 bg-banana-400 hover:bg-banana-300 text-nano-950 font-bold rounded-lg flex items-center gap-2 transition-transform active:scale-95 shadow-lg shadow-banana-400/10"
                  >
                    <FolderOpen size={18} />
                    {txt.load}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SavedProjectsModal;