import React, { useRef, useState, useEffect } from 'react';
import { ArrowDownTrayIcon, ArrowsPointingOutIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { AppStatus } from '../types';

interface SketchDisplayProps {
  imageUrl: string | null;
  status: AppStatus;
}

export const SketchDisplay: React.FC<SketchDisplayProps> = ({ imageUrl, status }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    if (!imageUrl) return;
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `sketch-genius-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Close fullscreen on Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsFullscreen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const isLoading = status === AppStatus.GENERATING || status === AppStatus.EDITING;

  if (!imageUrl && !isLoading) {
    return (
      <div className="w-full h-[400px] md:h-[600px] bg-slate-800/50 rounded-2xl border-2 border-dashed border-slate-700 flex flex-col items-center justify-center text-slate-500 animate-pulse">
        <div className="w-24 h-24 bg-slate-800 rounded-full mb-4 flex items-center justify-center">
           <svg className="w-10 h-10 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
        </div>
        <p className="font-medium text-lg">Your canvas is empty</p>
        <p className="text-sm opacity-60">Enter a prompt below to start sketching</p>
      </div>
    );
  }

  return (
    <>
      <div 
        ref={containerRef}
        className="relative group w-full bg-white rounded-xl shadow-2xl overflow-hidden flex items-center justify-center transition-all duration-300 min-h-[400px] md:min-h-[600px]"
      >
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 z-20 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center text-white">
            <div className="relative w-20 h-20">
               <div className="absolute top-0 left-0 w-full h-full border-4 border-slate-700 rounded-full"></div>
               <div className="absolute top-0 left-0 w-full h-full border-4 border-t-white rounded-full animate-spin"></div>
            </div>
            <p className="mt-4 font-medium animate-pulse">
              {status === AppStatus.GENERATING ? 'Artist is sketching...' : 'Applying adjustments...'}
            </p>
          </div>
        )}

        {/* Image */}
        {imageUrl && (
          <div className="relative w-full h-full flex items-center justify-center bg-[#fdfdfd] pattern-paper"> 
            {/* Pattern-paper is a placeholder class, using plain bg for now but simulating paper color */}
            <img 
              src={imageUrl} 
              alt="Generated Sketch" 
              className="max-w-full max-h-[80vh] object-contain shadow-inner"
            />
            
            {/* Overlay Controls */}
            <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
               <button 
                onClick={toggleFullscreen}
                className="p-2 bg-slate-900/80 hover:bg-black text-white rounded-lg backdrop-blur-md transition-all shadow-lg"
                title="Fullscreen"
              >
                <ArrowsPointingOutIcon className="w-5 h-5" />
              </button>
              <button 
                onClick={handleDownload}
                className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all shadow-lg"
                title="Download Sketch"
              >
                <ArrowDownTrayIcon className="w-5 h-5" />
              </button>
            </div>
            
            {/* Paper Texture Overlay (Subtle noise) */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-multiply" 
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
              }}
            ></div>
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && imageUrl && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
          <button 
            onClick={toggleFullscreen}
            className="absolute top-6 right-6 p-3 text-white/70 hover:text-white transition-colors"
          >
            <XMarkIcon className="w-8 h-8" />
          </button>
          <img 
            src={imageUrl} 
            alt="Fullscreen Sketch" 
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}
    </>
  );
};