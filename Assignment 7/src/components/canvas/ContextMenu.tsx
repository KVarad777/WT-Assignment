import React, { useEffect, useRef } from 'react';
import { 
  Edit3, 
  Plus, 
  Copy, 
  Trash2, 
  Layers, 
  FileCode, 
  Hash, 
  Sparkles, 
  Box,
  ChevronRight
} from 'lucide-react';
import { Stereotype, UMLClassData } from '../../core/types';

export interface ContextMenuPosition {
  x: number;
  y: number;
  classId: string;
}

interface ContextMenuProps {
  position: ContextMenuPosition;
  classData: UMLClassData | undefined;
  onClose: () => void;
  onEdit: (classId: string) => void;
  onAddAttribute: (classId: string) => void;
  onAddMethod: (classId: string) => void;
  onDuplicate: (classId: string) => void;
  onChangeStereotype: (classId: string, stereotype: Stereotype) => void;
  onDelete: (classId: string) => void;
}

export function ContextMenu({
  position,
  classData,
  onClose,
  onEdit,
  onAddAttribute,
  onAddMethod,
  onDuplicate,
  onChangeStereotype,
  onDelete,
}: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [kindSubmenuOpen, setKindSubmenuOpen] = React.useState(false);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('mousedown', handleOutsideClick);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('mousedown', handleOutsideClick);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  if (!classData) return null;

  return (
    <div
      ref={menuRef}
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 100,
      }}
      className="w-52 rounded-lg bg-[var(--bg-panel)] border border-[var(--border-color)] shadow-2xl p-1 text-xs text-[var(--text-main)] font-sans animate-fade-in select-none"
    >
      {/* Header Info */}
      <div className="px-2.5 py-1.5 border-b border-[var(--border-color)] mb-1">
        <div className="font-semibold text-xs truncate text-[var(--text-main)]">{classData.name}</div>
        <div className="text-[10px] text-[var(--text-muted)] capitalize">«{classData.stereotype}»</div>
      </div>

      {/* Action Items */}
      <button
        onClick={() => {
          onEdit(position.classId);
          onClose();
        }}
        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded hover:bg-[var(--bg-subtle)] text-left transition-colors"
      >
        <Edit3 className="w-3.5 h-3.5 text-indigo-500" />
        <span>Edit Properties</span>
      </button>

      <button
        onClick={() => {
          onAddAttribute(position.classId);
          onClose();
        }}
        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded hover:bg-[var(--bg-subtle)] text-left transition-colors"
      >
        <Plus className="w-3.5 h-3.5 text-emerald-500" />
        <span>Add Attribute</span>
      </button>

      <button
        onClick={() => {
          onAddMethod(position.classId);
          onClose();
        }}
        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded hover:bg-[var(--bg-subtle)] text-left transition-colors"
      >
        <Plus className="w-3.5 h-3.5 text-cyan-500" />
        <span>Add Method</span>
      </button>

      <button
        onClick={() => {
          onDuplicate(position.classId);
          onClose();
        }}
        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded hover:bg-[var(--bg-subtle)] text-left transition-colors"
      >
        <Copy className="w-3.5 h-3.5 text-slate-400" />
        <span>Duplicate Class</span>
      </button>

      {/* Change Type Submenu Trigger */}
      <div 
        className="relative"
        onMouseEnter={() => setKindSubmenuOpen(true)}
        onMouseLeave={() => setKindSubmenuOpen(false)}
      >
        <button
          className="w-full flex items-center justify-between px-2.5 py-1.5 rounded hover:bg-[var(--bg-subtle)] text-left transition-colors"
        >
          <div className="flex items-center gap-2">
            <Box className="w-3.5 h-3.5 text-amber-500" />
            <span>Change Kind</span>
          </div>
          <ChevronRight className="w-3 h-3 text-[var(--text-muted)]" />
        </button>

        {kindSubmenuOpen && (
          <div 
            style={{ position: 'absolute', left: '100%', top: '-4px' }}
            className="w-40 rounded-lg bg-[var(--bg-panel)] border border-[var(--border-color)] shadow-xl p-1 ml-1"
          >
            {(['class', 'interface', 'abstract', 'enum', 'record'] as Stereotype[]).map((kind) => (
              <button
                key={kind}
                onClick={() => {
                  onChangeStereotype(position.classId, kind);
                  onClose();
                }}
                className={`w-full flex items-center gap-2 px-2 py-1 rounded text-left capitalize ${
                  classData.stereotype === kind 
                    ? 'bg-indigo-600/20 text-indigo-500 font-semibold' 
                    : 'hover:bg-[var(--bg-subtle)] text-[var(--text-main)]'
                }`}
              >
                {kind === 'interface' && <Layers className="w-3 h-3 text-cyan-500" />}
                {kind === 'abstract' && <FileCode className="w-3 h-3 text-amber-500" />}
                {kind === 'enum' && <Hash className="w-3 h-3 text-emerald-500" />}
                {kind === 'record' && <Sparkles className="w-3 h-3 text-pink-500" />}
                {kind === 'class' && <Box className="w-3 h-3 text-indigo-500" />}
                <span>{kind}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="my-1 border-t border-[var(--border-color)]" />

      {/* Delete Item */}
      <button
        onClick={() => {
          onDelete(position.classId);
          onClose();
        }}
        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded text-rose-500 hover:bg-rose-500/10 text-left transition-colors"
      >
        <Trash2 className="w-3.5 h-3.5" />
        <span>Delete Class</span>
      </button>
    </div>
  );
}
