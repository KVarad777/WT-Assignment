import React, { useRef, useState } from 'react';
import { 
  Box, 
  Download, 
  Upload, 
  ChevronDown, 
  FolderArchive, 
  FileJson, 
  Columns2,
  PanelLeftClose,
  PanelRightClose,
  Sun,
  Moon
} from 'lucide-react';
import { DiagramProject } from '../../core/types';
import { ECOMMERCE_PRESET, OBSERVER_PRESET } from '../../core/initialData';

interface AppHeaderProps {
  projectName: string;
  onUpdateProjectName: (name: string) => void;
  onLoadPreset: (preset: DiagramProject) => void;
  onExportJson: () => void;
  onImportJson: (file: File) => void;
  onDownloadZip: () => void;
  onNewDiagram: () => void;
  splitViewRatio: 'split' | 'canvas-focus' | 'code-focus';
  onChangeSplitViewRatio: (ratio: 'split' | 'canvas-focus' | 'code-focus') => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export function AppHeader({
  projectName,
  onUpdateProjectName,
  onLoadPreset,
  onExportJson,
  onImportJson,
  onDownloadZip,
  onNewDiagram,
  splitViewRatio,
  onChangeSplitViewRatio,
  theme,
  onToggleTheme,
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

  const isDark = theme === 'dark';

  return (
    <header className={`h-12 px-4 flex items-center justify-between gap-4 select-none shrink-0 z-30 transition-colors ${
      isDark ? 'bg-dark-900 border-b border-slate-800/80 text-white' : 'bg-white border-b border-slate-200 text-slate-900'
    }`}>
      {/* Brand & Project Title */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-indigo-600/20 text-indigo-500 border border-indigo-500/30 flex items-center justify-center">
            <Box className="w-3.5 h-3.5" />
          </div>
          <span className="font-semibold text-sm tracking-tight">
            UMLForge
          </span>
        </div>

        <span className={`${isDark ? 'text-slate-700' : 'text-slate-300'} text-xs`}>/</span>

        <input
          type="text"
          value={projectName}
          onChange={(e) => onUpdateProjectName(e.target.value)}
          placeholder="Untitled Diagram"
          className={`bg-transparent px-2 py-0.5 rounded text-xs transition-colors max-w-[200px] truncate outline-none border border-transparent font-medium ${
            isDark 
              ? 'text-slate-300 hover:bg-slate-800/60 focus:bg-slate-800/90 focus:text-white focus:border-slate-700' 
              : 'text-slate-700 hover:bg-slate-100 focus:bg-slate-100 focus:text-slate-900 focus:border-slate-300'
          }`}
        />
      </div>

      {/* Right Actions: Presets, New, Import, Export, Theme, Layout focus */}
      <div className="flex items-center gap-1.5 sm:gap-2 text-xs">
        {/* Presets */}
        <div className="relative">
          <button
            onClick={() => {
              setPresetsMenuOpen(!presetsMenuOpen);
              setExportMenuOpen(false);
            }}
            className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${
              isDark ? 'text-slate-300 hover:text-white hover:bg-slate-800/80' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span>Presets</span>
            <ChevronDown className={`w-3 h-3 transition-transform ${presetsMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {presetsMenuOpen && (
            <div
              className={`absolute top-full right-0 mt-1 w-44 rounded-lg shadow-xl p-1 z-40 border ${
                isDark ? 'bg-dark-900 border-slate-800' : 'bg-white border-slate-200'
              }`}
              onClick={() => setPresetsMenuOpen(false)}
            >
              <button
                onClick={() => onLoadPreset(ECOMMERCE_PRESET)}
                className={`w-full text-left px-2.5 py-1.5 rounded text-xs transition-colors ${
                  isDark ? 'text-slate-300 hover:bg-slate-800 hover:text-white' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                E-Commerce Domain
              </button>
              <button
                onClick={() => onLoadPreset(OBSERVER_PRESET)}
                className={`w-full text-left px-2.5 py-1.5 rounded text-xs transition-colors ${
                  isDark ? 'text-slate-300 hover:bg-slate-800 hover:text-white' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                Observer Pattern
              </button>
            </div>
          )}
        </div>

        {/* New Diagram */}
        <button
          onClick={onNewDiagram}
          className={`px-2 py-1 rounded transition-colors ${
            isDark ? 'text-slate-300 hover:text-white hover:bg-slate-800/80' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          New
        </button>

        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          accept=".json"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Import */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${
            isDark ? 'text-slate-300 hover:text-white hover:bg-slate-800/80' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
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
            className={`flex items-center gap-1 px-2.5 py-1 rounded transition-colors border ${
              isDark 
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border-slate-700/60' 
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border-slate-200'
            }`}
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export</span>
            <ChevronDown className={`w-3 h-3 transition-transform ${exportMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {exportMenuOpen && (
            <div
              className={`absolute top-full right-0 mt-1 w-48 rounded-lg shadow-xl p-1 z-40 border ${
                isDark ? 'bg-dark-900 border-slate-800' : 'bg-white border-slate-200'
              }`}
              onClick={() => setExportMenuOpen(false)}
            >
              <button
                onClick={onExportJson}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded text-xs transition-colors ${
                  isDark ? 'text-slate-300 hover:bg-slate-800 hover:text-white' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <FileJson className="w-3.5 h-3.5 text-amber-500" />
                <span>Save Diagram JSON</span>
              </button>
              <button
                onClick={onDownloadZip}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded text-xs transition-colors ${
                  isDark ? 'text-slate-300 hover:bg-slate-800 hover:text-white' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <FolderArchive className="w-3.5 h-3.5 text-indigo-500" />
                <span>Download Java (.zip)</span>
              </button>
            </div>
          )}
        </div>

        <div className={`h-4 w-px mx-0.5 ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />

        {/* Theme Toggle (Sun / Moon) */}
        <button
          onClick={onToggleTheme}
          title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          className={`p-1.5 rounded transition-colors ${
            isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-600" />}
        </button>

        <div className={`h-4 w-px mx-0.5 ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />

        {/* Layout Focus Switcher */}
        <div className={`flex items-center border rounded p-0.5 ${
          isDark ? 'bg-dark-950 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <button
            onClick={() => onChangeSplitViewRatio('canvas-focus')}
            title="Diagram Focus (Expand Canvas)"
            className={`p-1 rounded ${
              splitViewRatio === 'canvas-focus' 
                ? (isDark ? 'bg-slate-800 text-white' : 'bg-white text-slate-900 shadow-xs') 
                : (isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900')
            }`}
          >
            <PanelRightClose className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onChangeSplitViewRatio('split')}
            title="Split View (Diagram & Java Code)"
            className={`p-1 rounded ${
              splitViewRatio === 'split' 
                ? (isDark ? 'bg-slate-800 text-white' : 'bg-white text-slate-900 shadow-xs') 
                : (isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900')
            }`}
          >
            <Columns2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onChangeSplitViewRatio('code-focus')}
            title="Code Focus (Expand Java)"
            className={`p-1 rounded ${
              splitViewRatio === 'code-focus' 
                ? (isDark ? 'bg-slate-800 text-white' : 'bg-white text-slate-900 shadow-xs') 
                : (isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900')
            }`}
          >
            <PanelLeftClose className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
}
