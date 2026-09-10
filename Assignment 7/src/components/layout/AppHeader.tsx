import React, { useRef } from 'react';
import { 
  Boxes, 
  FolderArchive, 
  Download, 
  Upload, 
  Sparkles, 
  BookOpen, 
  Split, 
  Maximize2, 
  Code2, 
  Layers,
  ChevronDown
} from 'lucide-react';
import { DiagramProject } from '../../core/types';
import { ECOMMERCE_PRESET, OBSERVER_PRESET, BLANK_PROJECT } from '../../core/initialData';

interface AppHeaderProps {
  projectName: string;
  onUpdateProjectName: (name: string) => void;
  onLoadPreset: (preset: DiagramProject) => void;
  onExportJson: () => void;
  onImportJson: (file: File) => void;
  onDownloadZip: () => void;
  layoutMode: 'split' | 'canvas' | 'code';
  onChangeLayoutMode: (mode: 'split' | 'canvas' | 'code') => void;
}

export function AppHeader({
  projectName,
  onUpdateProjectName,
  onLoadPreset,
  onExportJson,
  onImportJson,
  onDownloadZip,
  layoutMode,
  onChangeLayoutMode,
}: AppHeaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportJson(file);
      e.target.value = '';
    }
  };

  return (
    <header className="h-14 bg-dark-900/90 border-b border-slate-800/80 px-4 flex items-center justify-between gap-4 select-none shrink-0 z-30">
      {/* Brand & Project Name */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-cyan-400 p-0.5 flex items-center justify-center shadow-lg shadow-indigo-600/30">
            <div className="w-full h-full bg-dark-950 rounded-[7px] flex items-center justify-center">
              <Boxes className="w-4 h-4 text-indigo-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-mono font-bold text-sm bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
                UMLForge
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                v1.0
              </span>
            </div>
          </div>
        </div>

        <div className="h-5 w-px bg-slate-800 mx-1 hidden sm:block" />

        {/* Project Name Editable */}
        <input
          type="text"
          value={projectName}
          onChange={(e) => onUpdateProjectName(e.target.value)}
          placeholder="Project Name"
          className="bg-transparent hover:bg-dark-800/60 focus:bg-dark-800 px-2 py-1 rounded text-xs font-medium text-slate-200 focus:text-white border border-transparent focus:border-slate-700 transition-colors max-w-[200px] sm:max-w-xs truncate"
        />
      </div>

      {/* Center Architecture Presets Selector */}
      <div className="hidden md:flex items-center gap-1.5 bg-dark-950/80 border border-slate-800/80 rounded-lg p-1">
        <span className="text-[11px] font-mono text-slate-400 px-2 flex items-center gap-1">
          <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
          <span>Presets:</span>
        </span>
        <button
          onClick={() => onLoadPreset(ECOMMERCE_PRESET)}
          className="text-xs px-2.5 py-1 rounded-md text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
        >
          E-Commerce
        </button>
        <button
          onClick={() => onLoadPreset(OBSERVER_PRESET)}
          className="text-xs px-2.5 py-1 rounded-md text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
        >
          Observer Pattern
        </button>
        <button
          onClick={() => onLoadPreset(BLANK_PROJECT)}
          className="text-xs px-2.5 py-1 rounded-md text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
        >
          Blank Canvas
        </button>
      </div>

      {/* Right Controls: Layout & Exports */}
      <div className="flex items-center gap-2">
        {/* Layout Switcher */}
        <div className="flex items-center bg-dark-950 border border-slate-800 rounded-lg p-0.5 text-xs font-mono">
          <button
            onClick={() => onChangeLayoutMode('canvas')}
            title="Diagram Canvas Only"
            className={`p-1.5 rounded ${
              layoutMode === 'canvas' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onChangeLayoutMode('split')}
            title="Split: Canvas & Java Code"
            className={`p-1.5 rounded ${
              layoutMode === 'split' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Split className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onChangeLayoutMode('code')}
            title="Java Code Viewer Only"
            className={`p-1.5 rounded ${
              layoutMode === 'code' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="h-5 w-px bg-slate-800 hidden sm:block" />

        {/* Hidden File Input for Import */}
        <input
          type="file"
          ref={fileInputRef}
          accept=".json"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Import JSON */}
        <button
          onClick={() => fileInputRef.current?.click()}
          title="Import diagram from JSON file"
          className="p-1.5 rounded-lg bg-dark-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors hidden sm:flex items-center gap-1.5 text-xs"
        >
          <Upload className="w-3.5 h-3.5 text-slate-400" />
          <span>Import</span>
        </button>

        {/* Export JSON */}
        <button
          onClick={onExportJson}
          title="Export diagram architecture as JSON"
          className="p-1.5 rounded-lg bg-dark-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors hidden sm:flex items-center gap-1.5 text-xs"
        >
          <Download className="w-3.5 h-3.5 text-slate-400" />
          <span>Save JSON</span>
        </button>

        {/* Primary Export ZIP Button */}
        <button
          onClick={onDownloadZip}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-medium text-xs shadow-lg shadow-indigo-600/25 border border-indigo-400/30 active:scale-95 transition-all"
        >
          <FolderArchive className="w-3.5 h-3.5" />
          <span>Download Java Zip</span>
        </button>
      </div>
    </header>
  );
}
