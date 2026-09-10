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
    <div className="absolute top-4 left-6 z-20 flex items-center gap-1.5 bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-lg p-1 shadow-lg text-xs font-sans text-[var(--text-main)]">
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
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-subtle)] transition-colors"
      >
        <LayoutGrid className="w-3.5 h-3.5 text-indigo-500" />
        <span>Auto Layout</span>
      </button>

      <div className="h-4 w-px bg-[var(--border-color)] mx-0.5" />

      {/* Overflow Menu (⋯) */}
      <div className="relative">
        <button
          onClick={() => setMoreMenuOpen(!moreMenuOpen)}
          title="More options"
          className={`p-1.5 rounded-md transition-colors ${
            moreMenuOpen ? 'bg-[var(--bg-subtle)] text-[var(--text-main)]' : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-subtle)]'
          }`}
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>

        {moreMenuOpen && (
          <div
            className="absolute top-full left-0 mt-1 w-48 rounded-lg bg-[var(--bg-panel)] border border-[var(--border-color)] shadow-xl p-1 z-30 space-y-0.5"
            onClick={() => setMoreMenuOpen(false)}
          >
            <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase px-2 py-1">Add other types</div>
            <button
              onClick={() => onAddElement('interface')}
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-[var(--text-main)] hover:bg-[var(--bg-subtle)] text-xs"
            >
              <Layers className="w-3.5 h-3.5 text-cyan-500" />
              <span>Interface</span>
            </button>
            <button
              onClick={() => onAddElement('abstract')}
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-[var(--text-main)] hover:bg-[var(--bg-subtle)] text-xs"
            >
              <FileCode className="w-3.5 h-3.5 text-amber-500" />
              <span>Abstract Class</span>
            </button>
            <button
              onClick={() => onAddElement('enum')}
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-[var(--text-main)] hover:bg-[var(--bg-subtle)] text-xs"
            >
              <Hash className="w-3.5 h-3.5 text-emerald-500" />
              <span>Enum</span>
            </button>
            <button
              onClick={() => onAddElement('record')}
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-[var(--text-main)] hover:bg-[var(--bg-subtle)] text-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-pink-500" />
              <span>Record</span>
            </button>

            <div className="my-1 border-t border-[var(--border-color)]" />

            <button
              onClick={onFitView}
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-[var(--text-main)] hover:bg-[var(--bg-subtle)] text-xs"
            >
              <Maximize2 className="w-3.5 h-3.5 text-[var(--text-muted)]" />
              <span>Fit to Screen</span>
            </button>
            <button
              onClick={onToggleGrid}
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-[var(--text-main)] hover:bg-[var(--bg-subtle)] text-xs"
            >
              <Grid className="w-3.5 h-3.5 text-[var(--text-muted)]" />
              <span>Grid: {gridType}</span>
            </button>

            <div className="my-1 border-t border-[var(--border-color)]" />

            <button
              onClick={onClearAll}
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-rose-500 hover:bg-rose-500/10 text-xs"
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
