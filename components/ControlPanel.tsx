import React, { useState, useEffect } from 'react';
import { PaperAirplaneIcon, SparklesIcon, AdjustmentsHorizontalIcon, ArrowPathIcon } from '@heroicons/react/24/solid';
import { AppStatus, GenerationConfig } from '../types';

interface ControlPanelProps {
  onGenerate: (prompt: string, config: GenerationConfig) => void;
  onEdit: (prompt: string) => void;
  status: AppStatus;
  hasImage: boolean;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ onGenerate, onEdit, status, hasImage }) => {
  const [inputValue, setInputValue] = useState("");
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [aspectRatio, setAspectRatio] = useState<GenerationConfig['aspectRatio']>('1:1');
  const [isExpanded, setIsExpanded] = useState(false);

  // Auto-switch to edit mode if image exists, create if not
  useEffect(() => {
    if (hasImage) {
      setMode('edit');
      setInputValue(""); // Clear input on successful generation to ready for edit
    } else {
      setMode('create');
    }
  }, [hasImage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    if (mode === 'create') {
      onGenerate(inputValue, { aspectRatio });
    } else {
      onEdit(inputValue);
    }
  };

  const isProcessing = status === AppStatus.GENERATING || status === AppStatus.EDITING;

  return (
    <div className="w-full max-w-3xl mx-auto mt-8 relative z-10">
      <div className="bg-slate-800 rounded-2xl shadow-xl border border-slate-700 p-2 md:p-4">
        
        {/* Mode Tabs (Only visible if image exists) */}
        {hasImage && (
          <div className="flex space-x-2 mb-3 px-2">
             <button 
               onClick={() => setMode('edit')}
               className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all flex items-center space-x-1 ${mode === 'edit' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'}`}
             >
                <AdjustmentsHorizontalIcon className="w-3 h-3" />
                <span>Refine Sketch</span>
             </button>
             <button 
               onClick={() => {
                 setMode('create');
                 setInputValue("");
               }}
               className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all flex items-center space-x-1 ${mode === 'create' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'}`}
             >
                <SparklesIcon className="w-3 h-3" />
                <span>New Sketch</span>
             </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="relative">
          <div className="relative flex items-center">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isProcessing}
              placeholder={mode === 'create' ? "Describe your sketch (e.g., 'A lonely cabin in the woods')..." : "How should I change it? (e.g., 'Add smoke coming from the chimney')"}
              className="w-full bg-slate-900 text-white rounded-xl py-4 pl-4 pr-14 md:pr-32 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 border border-slate-700 placeholder-slate-500 resize-none h-16 md:h-[70px] leading-relaxed scrollbar-hide"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            
            {/* Settings Toggle (Only for create) */}
            {mode === 'create' && (
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="absolute right-14 md:right-16 text-slate-400 hover:text-white p-2"
                title="Settings"
              >
                <AdjustmentsHorizontalIcon className="w-5 h-5" />
              </button>
            )}

            <button
              type="submit"
              disabled={!inputValue.trim() || isProcessing}
              className={`absolute right-2 p-2.5 rounded-lg transition-all transform duration-200 flex items-center justify-center ${
                !inputValue.trim() || isProcessing
                  ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                  : 'bg-white text-slate-900 hover:bg-indigo-50 hover:scale-105 shadow-lg shadow-white/10'
              }`}
            >
              {isProcessing ? (
                <ArrowPathIcon className="w-5 h-5 animate-spin" />
              ) : mode === 'create' ? (
                <SparklesIcon className="w-5 h-5" />
              ) : (
                <PaperAirplaneIcon className="w-5 h-5 -rotate-45 translate-x-px -translate-y-px" />
              )}
            </button>
          </div>

          {/* Expanded Settings for Creation */}
          {mode === 'create' && isExpanded && (
             <div className="mt-3 pt-3 border-t border-slate-700/50 px-2 flex flex-wrap gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex flex-col space-y-1">
                  <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Aspect Ratio</span>
                  <div className="flex bg-slate-900 rounded-lg p-1 space-x-1">
                    {(['1:1', '4:3', '3:4', '16:9', '9:16'] as const).map((ratio) => (
                      <button
                        key={ratio}
                        type="button"
                        onClick={() => setAspectRatio(ratio)}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                          aspectRatio === ratio 
                            ? 'bg-indigo-600 text-white' 
                            : 'text-slate-400 hover:bg-slate-800'
                        }`}
                      >
                        {ratio}
                      </button>
                    ))}
                  </div>
                </div>
             </div>
          )}
        </form>
        
        <p className="text-center mt-3 text-xs text-slate-500 hidden md:block">
          {mode === 'create' ? 'Pro Tip: Be descriptive about lighting and texture.' : 'Pro Tip: Describe specifically what you want to change or add.'}
        </p>
      </div>
    </div>
  );
};