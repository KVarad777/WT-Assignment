import React, { useState } from 'react';
import {
  Plus,
  Box,
  Layers,
  FileCode,
  Hash,
  Sparkles,
  LayoutGrid,
  Maximize2,
  Trash,
  ChevronDown,
  Info,
} from 'lucide-react';
import { Stereotype } from '../../core/types';

interface CanvasToolbarProps {
  onAddElement: (stereotype: Stereotype) => void;
  onAutoLayout: () => void;
  onFitView: () => void;
  onClearAll: () => void;
  gridType: 'dots' | 'lines' | 'cross';
  onToggleGrid: () => void;
  nodeCount: number;
  edgeCount: number;
}

export function CanvasToolbar({
  onAddElement,
  onAutoLayout,
  onFitView,
  onClearAll,
  gridType,
  onToggleGrid,
  nodeCount,
  edgeCount,
}: CanvasToolbarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const addOptions: { label: string; stereotype: Stereotype; icon: any; color: string }[] = [
    { label: 'Class', stereotype: 'class', icon: Box, color: 'text-indigo-400' },
    { label: 'Interface', stereotype: 'interface', icon: Layers, color: 'text-cyan-400' },
    { label: 'Abstract Class', stereotype: 'abstract', icon: FileCode, color: 'text-amber-400' },
    { label: 'Enum', stereotype: 'enum', icon: Hash, color: 'text-emerald-400' },
    { label: 'Record', stereotype: 'record', icon: Sparkles, color: 'text-pink-400' },
  ];

  return (
    <div className="absolute top-4 left-6 z-20 flex items-center gap-2">
      {/* Primary Add Element Dropdown */}
      <div className="relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-lg shadow-indigo-600/30 transition-all border border-indigo-400/30 active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Type</span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {dropdownOpen && (
          <div
            className="absolute top-full left-0 mt-1.5 w-48 rounded-xl bg-dark-900/95 backdrop-blur-md border border-slate-700/80 shadow-2xl p-1.5 z-30 animate-fade-in"
            onClick={() => setDropdownOpen(false)}
          >
            <div className="text-[10px] uppercase font-mono px-2.5 py-1 text-slate-400">Add to Diagram</div>
            {addOptions.map((opt) => {
              const Icon = opt.icon;
              return (
                <button
                  key={opt.stereotype}
                  onClick={() => onAddElement(opt.stereotype)}
                  className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs text-slate-200 hover:bg-slate-800/80 hover:text-white transition-colors"
                >
                  <Icon className={`w-4 h-4 ${opt.color}`} />
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating Toolbar Group */}
      <div className="flex items-center bg-dark-900/90 backdrop-blur-md border border-slate-700/70 rounded-lg p-1 shadow-xl text-slate-300">
        <button
          onClick={onAutoLayout}
          title="Auto-organize architecture diagram (Dagre layout)"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md hover:bg-slate-800 hover:text-white text-xs transition-colors"
        >
          <LayoutGrid className="w-3.5 h-3.5 text-indigo-400" />
          <span>Auto Layout</span>
        </button>

        <div className="h-4 w-px bg-slate-700 mx-1" />

        <button
          onClick={onFitView}
          title="Fit diagram to screen"
          className="p-1.5 rounded-md hover:bg-slate-800 hover:text-white transition-colors"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={onToggleGrid}
          title={`Canvas background: ${gridType}`}
          className="px-2 py-1 rounded-md hover:bg-slate-800 hover:text-white text-xs font-mono transition-colors"
        >
          Grid: {gridType}
        </button>

        <div className="h-4 w-px bg-slate-700 mx-1" />

        <button
          onClick={onClearAll}
          title="Clear all classes & connections"
          className="p-1.5 rounded-md hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
        >
          <Trash className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Stats & Quick Tip Badge */}
      <div className="hidden lg:flex items-center gap-2 bg-dark-900/80 backdrop-blur-sm border border-slate-700/50 rounded-lg px-3 py-1.5 text-[11px] text-slate-400">
        <span>
          <strong className="text-white">{nodeCount}</strong> types
        </span>
        <span className="text-slate-600">•</span>
        <span>
          <strong className="text-white">{edgeCount}</strong> relations
        </span>
        <span className="text-slate-600">•</span>
        <div className="flex items-center gap-1 text-slate-400">
          <Info className="w-3 h-3 text-indigo-400" />
          <span>Drag between node ports to connect</span>
        </div>
      </div>
    </div>
  );
}
