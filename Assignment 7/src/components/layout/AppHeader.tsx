import React, { useRef, useState } from 'react';
import { 
  Box, 
  Download, 
  Upload, 
  ChevronDown, 
  Code2, 
  FolderArchive,
  FileJson,
  FileCode2,
  Sparkles,
  Plus
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
  onNewDiagram: () => void;
  isJavaOpen: boolean;
  onToggleJava: () => void;
}

export function AppHeader({
  projectName,
  onUpdateProjectName,
  onLoadPreset,
  onExportJson,
  onImportJson,
  onDownloadZip,
  onNewDiagram,
  isJavaOpen,
  onToggleJava,
}: AppHeaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [presetsMenuOpen, setPresetsMenuOpen] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportJson(file);
      e.target.value = '';
    }
  };

  return (
    <header className="h-13 bg-dark-900 border-b border-slate-800/80 px-4 flex items-center justify-between gap-4 select-none shrink-0 z-30">
      {/* Brand & Project Title */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
            <Box className="w-4 h-4" />
          </div>
          <span className="font-semibold text-sm tracking-tight text-white">
            UMLForge
          </span>
        </div>

        <span className="text-slate-600 text-xs">/</span>

        {/* Project Name */}
        <input
          type="text"
          value={projectName}
          onChange={(e) => onUpdateProjectName(e.target.value)}
          placeholder="Untitled Diagram"
          className="bg-transparent hover:bg-slate-800/60 focus:bg-slate-800/90 px-2 py-1 rounded text-xs text-slate-300 hover:text-white focus:text-white transition-colors max-w-[200px] truncate outline-none border border-transparent focus:border-slate-700 font-medium"
        />
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 text-xs">
        {/* Presets Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setPresetsMenuOpen(!presetsMenuOpen);
              setExportMenuOpen(false);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
          >
            <span>Presets</span>
            <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${presetsMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {presetsMenuOpen && (
            <div
              className="absolute top-full right-0 mt-1 w-44 rounded-lg bg-dark-900 border border-slate-800 shadow-xl p-1 z-40"
              onClick={() => setPresetsMenuOpen(false)}
            >
              <button
                onClick={() => onLoadPreset(ECOMMERCE_PRESET)}
                className="w-full text-left px-2.5 py-1.5 rounded text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
              >
                E-Commerce Domain
              </button>
              <button
                onClick={() => onLoadPreset(OBSERVER_PRESET)}
                className="w-full text-left px-2.5 py-1.5 rounded text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
              >
                Observer Pattern
              </button>
              <div className="my-1 border-t border-slate-800" />
              <button
                onClick={onNewDiagram}
                className="w-full text-left px-2.5 py-1.5 rounded text-xs text-slate-400 hover:bg-slate-800 hover:text-white transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Blank Canvas</span>
              </button>
            </div>
          )}
        </div>

        {/* Hidden File Input */}
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
          title="Import diagram from JSON"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
        >
          <Upload className="w-3.5 h-3.5 text-slate-400" />
          <span>Import</span>
        </button>

        {/* Export Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setExportMenuOpen(!exportMenuOpen);
              setPresetsMenuOpen(false);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export</span>
            <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${exportMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {exportMenuOpen && (
            <div
              className="absolute top-full right-0 mt-1 w-48 rounded-lg bg-dark-900 border border-slate-800 shadow-xl p-1 z-40"
              onClick={() => setExportMenuOpen(false)}
            >
              <button
                onClick={onExportJson}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
              >
                <FileJson className="w-3.5 h-3.5 text-amber-400" />
                <span>Diagram JSON</span>
              </button>
              <button
                onClick={onDownloadZip}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
              >
                <FolderArchive className="w-3.5 h-3.5 text-indigo-400" />
                <span>Java Project (.zip)</span>
              </button>
            </div>
          )}
        </div>

        <div className="h-4 w-px bg-slate-800 mx-1" />

        {/* Java Code View Toggle Button */}
        <button
          onClick={onToggleJava}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
            isJavaOpen
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-dark-800 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>Java Code</span>
        </button>
      </div>
    </header>
  );
}
