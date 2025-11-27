import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { SketchDisplay } from './components/SketchDisplay';
import { ControlPanel } from './components/ControlPanel';
import { generateSketch, editSketch } from './services/geminiService';
import { AppStatus, GenerationConfig } from './types';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

function App() {
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);

  const handleGenerate = useCallback(async (prompt: string, config: GenerationConfig) => {
    setStatus(AppStatus.GENERATING);
    setErrorMsg(null);
    try {
      const imageUrl = await generateSketch(prompt, config);
      setHistory(prev => (currentImage ? [...prev, currentImage] : prev));
      setCurrentImage(imageUrl);
      setStatus(AppStatus.SUCCESS);
    } catch (err: any) {
      console.error(err);
      setStatus(AppStatus.ERROR);
      setErrorMsg(err.message || "Failed to generate sketch. Please try again.");
    }
  }, [currentImage]);

  const handleEdit = useCallback(async (instruction: string) => {
    if (!currentImage) return;
    
    setStatus(AppStatus.EDITING);
    setErrorMsg(null);
    try {
      // Save current to history before editing
      setHistory(prev => [...prev, currentImage]);
      
      const newImageUrl = await editSketch(currentImage, instruction);
      setCurrentImage(newImageUrl);
      setStatus(AppStatus.SUCCESS);
    } catch (err: any) {
      console.error(err);
      setStatus(AppStatus.ERROR);
      setErrorMsg(err.message || "Failed to edit sketch. Try a different instruction.");
    }
  }, [currentImage]);

  const handleUndo = () => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setCurrentImage(previous);
    setHistory(prev => prev.slice(0, prev.length - 1));
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans selection:bg-indigo-500/30">
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none" 
           style={{
             backgroundImage: 'radial-gradient(circle at 50% 50%, #1e293b 1px, transparent 1px)',
             backgroundSize: '24px 24px'
           }}>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />

        <main className="flex-grow flex flex-col items-center px-4 pb-12 w-full max-w-7xl mx-auto">
          
          {/* Error Banner */}
          {status === AppStatus.ERROR && (
            <div className="w-full max-w-3xl mb-6 bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center text-red-400 animate-in slide-in-from-top-2">
              <ExclamationTriangleIcon className="w-5 h-5 mr-2 flex-shrink-0" />
              <span className="text-sm font-medium">{errorMsg}</span>
              <button 
                onClick={() => setStatus(AppStatus.IDLE)} 
                className="ml-auto text-xs hover:underline"
              >
                Dismiss
              </button>
            </div>
          )}

          <div className="w-full max-w-5xl flex flex-col items-center">
            
            {/* Toolbar for History (Undo) */}
            {history.length > 0 && status !== AppStatus.GENERATING && status !== AppStatus.EDITING && (
              <div className="w-full flex justify-start mb-2 px-2">
                <button 
                  onClick={handleUndo}
                  className="text-xs flex items-center text-slate-400 hover:text-white transition-colors space-x-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
                  <span>Undo ({history.length})</span>
                </button>
              </div>
            )}

            {/* Main Canvas Area */}
            <div className="w-full">
              <SketchDisplay imageUrl={currentImage} status={status} />
            </div>

            {/* Controls */}
            <div className="w-full mt-4">
              <ControlPanel 
                onGenerate={handleGenerate} 
                onEdit={handleEdit}
                status={status}
                hasImage={!!currentImage}
              />
            </div>

          </div>
        </main>

        <footer className="py-6 text-center text-slate-600 text-xs">
          <p>© {new Date().getFullYear()} SketchGenius. Powered by Google Gemini.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;