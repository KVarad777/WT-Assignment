import React, { useState } from 'react';
import {
  Plus,
  LayoutGrid,
  MoreHorizontal,
  Maximize2,
  Trash2,
  Layers,
  FileCode,
  Hash,
  Sparkles,
  Box,
  Grid
} from 'lucide-react';
import { Stereotype } from '../../core/types';

interface CanvasToolbarProps {
  onAddElement: (stereotype: Stereotype) => void;
  onAutoLayout: () => void;
  onFitView: () => void;
  onClearAll: () => void;
  gridType: 'dots' | 'lines' | 'cross';
  onToggleGrid: () => void;
}

export function CanvasToolbar({
  onAddElement,
  onAutoLayout,
  onFitView,
  onClearAll,
  gridType,
  onToggleGrid,
}: CanvasToolbarProps) {
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  return (
    <div className="absolute top-4 left-6 z-20 flex items-center gap-1.5 bg-dark-900/90 backdrop-blur-md border border-slate-800 rounded-lg p-1 shadow-xl text-xs font-sans">
      {/* Primary: + Add Class */}
      <button
        onClick={() => onAddElement('class')}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors active:scale-95 shadow-sm"
      >
        <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
        <span>Add Class</span>
      </button>

      {/* Primary: Auto Layout */}
      <button
        onClick={onAutoLayout}
        title="Automatically organize diagram layout"
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
      >
        <LayoutGrid className="w-3.5 h-3.5 text-indigo-400" />
        <span>Auto Layout</span>
      </button>

      <div className="h-4 w-px bg-slate-800 mx-0.5" />

      {/* Overflow Menu (⋯) */}
      <div className="relative">
        <button
          onClick={() => setMoreMenuOpen(!moreMenuOpen)}
          title="More options"
          className={`p-1.5 rounded-md transition-colors ${
            moreMenuOpen ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>

        {moreMenuOpen && (
          <div
            className="absolute top-full left-0 mt-1 w-48 rounded-lg bg-dark-900 border border-slate-800 shadow-xl p-1 z-30 space-y-0.5"
            onClick={() => setMoreMenuOpen(false)}
          >
            <div className="text-[10px] font-mono text-slate-500 uppercase px-2 py-1">Add other types</div>
            <button
              onClick={() => onAddElement('interface')}
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-slate-300 hover:bg-slate-800 hover:text-white text-xs"
            >
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>Interface</span>
            </button>
            <button
              onClick={() => onAddElement('abstract')}
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-slate-300 hover:bg-slate-800 hover:text-white text-xs"
            >
              <FileCode className="w-3.5 h-3.5 text-amber-400" />
              <span>Abstract Class</span>
            </button>
            <button
              onClick={() => onAddElement('enum')}
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-slate-300 hover:bg-slate-800 hover:text-white text-xs"
            >
              <Hash className="w-3.5 h-3.5 text-emerald-400" />
              <span>Enum</span>
            </button>
            <button
              onClick={() => onAddElement('record')}
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-slate-300 hover:bg-slate-800 hover:text-white text-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              <span>Record</span>
            </button>

            <div className="my-1 border-t border-slate-800" />

            <button
              onClick={onFitView}
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-slate-300 hover:bg-slate-800 hover:text-white text-xs"
            >
              <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
              <span>Fit to Screen</span>
            </button>
            <button
              onClick={onToggleGrid}
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-slate-300 hover:bg-slate-800 hover:text-white text-xs"
            >
              <Grid className="w-3.5 h-3.5 text-slate-400" />
              <span>Grid: {gridType}</span>
            </button>

            <div className="my-1 border-t border-slate-800" />

            <button
              onClick={onClearAll}
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-rose-400 hover:bg-rose-500/10 text-xs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Canvas</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
