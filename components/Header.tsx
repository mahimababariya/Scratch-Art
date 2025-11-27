import React from 'react';
import { PencilSquareIcon } from '@heroicons/react/24/outline';

export const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between py-6 px-4 md:px-8 max-w-7xl mx-auto w-full">
      <div className="flex items-center space-x-3 select-none">
        <div className="bg-white p-2 rounded-lg shadow-lg shadow-white/10">
          <PencilSquareIcon className="w-8 h-8 text-slate-900" />
        </div>
        <div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 font-sans tracking-tight">
            SketchGenius
          </h1>
          <p className="text-xs text-slate-400 font-medium tracking-wider uppercase">AI Art Studio</p>
        </div>
      </div>
      <a 
        href="#" 
        onClick={(e) => e.preventDefault()} // Placeholder link
        className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
      >
        v1.0
      </a>
    </header>
  );
};