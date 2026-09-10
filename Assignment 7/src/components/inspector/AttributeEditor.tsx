import React from 'react';
import { Plus, Trash2, Shield, Lock, Globe, KeyRound } from 'lucide-react';
import { UMLAttribute, Visibility, COMMON_TYPES } from '../../core/types';

interface AttributeEditorProps {
  attributes: UMLAttribute[];
  availableClassNames: string[];
  onChange: (attributes: UMLAttribute[]) => void;
}

export function AttributeEditor({
  attributes,
  availableClassNames,
  onChange,
}: AttributeEditorProps) {
  const allTypes = Array.from(new Set([...COMMON_TYPES, ...availableClassNames]));

  const handleAddAttribute = () => {
    const newAttr: UMLAttribute = {
      id: `attr-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: `field${attributes.length + 1}`,
      type: 'String',
      visibility: 'private',
    };
    onChange([...attributes, newAttr]);
  };

  const handleUpdate = (id: string, updates: Partial<UMLAttribute>) => {
    onChange(
      attributes.map((attr) => (attr.id === id ? { ...attr, ...updates } : attr))
    );
  };

  const handleDelete = (id: string) => {
    onChange(attributes.filter((attr) => attr.id !== id));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
          Fields & Properties ({attributes.length})
        </span>
        <button
          onClick={handleAddAttribute}
          className="flex items-center gap-1 text-xs px-2.5 py-1 rounded bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 hover:text-white border border-indigo-500/30 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Field</span>
        </button>
      </div>

      {attributes.length === 0 ? (
        <div className="text-xs text-slate-500 italic p-3 text-center border border-dashed border-slate-700/60 rounded-lg bg-dark-900/40">
          No fields defined yet. Click "Add Field" to create one.
        </div>
      ) : (
        <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
          {attributes.map((attr, index) => (
            <div
              key={attr.id}
              className="p-2.5 rounded-lg bg-dark-900/90 border border-slate-700/60 hover:border-slate-600 space-y-2 text-xs transition-colors"
            >
              {/* Row 1: Visibility, Name, Type, Delete */}
              <div className="flex items-center gap-2">
                {/* Visibility selector */}
                <select
                  value={attr.visibility}
                  onChange={(e) => handleUpdate(attr.id, { visibility: e.target.value as Visibility })}
                  className="bg-dark-800 border border-slate-700 rounded px-1.5 py-1 text-slate-200 text-xs font-mono focus:outline-none focus:border-indigo-500"
                  title="Visibility modifier"
                >
                  <option value="private">private (-)</option>
                  <option value="public">public (+)</option>
                  <option value="protected">protected (#)</option>
                  <option value="package">package (~)</option>
                </select>

                {/* Name */}
                <input
                  type="text"
                  value={attr.name}
                  placeholder="name"
                  onChange={(e) => handleUpdate(attr.id, { name: e.target.value })}
                  className="flex-1 min-w-0 bg-dark-800 border border-slate-700 rounded px-2 py-1 text-white font-mono text-xs focus:outline-none focus:border-indigo-500"
                />

                <span className="text-slate-500 font-mono">:</span>

                {/* Type Combobox */}
                <input
                  type="text"
                  list={`types-${attr.id}`}
                  value={attr.type}
                  placeholder="Type"
                  onChange={(e) => handleUpdate(attr.id, { type: e.target.value })}
                  className="w-28 bg-dark-800 border border-slate-700 rounded px-2 py-1 text-sky-300 font-mono text-xs focus:outline-none focus:border-indigo-500"
                />
                <datalist id={`types-${attr.id}`}>
                  {allTypes.map((t) => (
                    <option key={t} value={t} />
                  ))}
                </datalist>

                {/* Delete button */}
                <button
                  onClick={() => handleDelete(attr.id)}
                  title="Remove attribute"
                  className="p-1 rounded hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Row 2: Flags and Default Value */}
              <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800 text-[11px]">
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1 text-slate-400 hover:text-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!attr.isFinal}
                      onChange={(e) => handleUpdate(attr.id, { isFinal: e.target.checked })}
                      className="rounded border-slate-700 bg-dark-800 text-indigo-500 focus:ring-0 w-3 h-3"
                    />
                    <span>final</span>
                  </label>
                  <label className="flex items-center gap-1 text-slate-400 hover:text-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!attr.isStatic}
                      onChange={(e) => handleUpdate(attr.id, { isStatic: e.target.checked })}
                      className="rounded border-slate-700 bg-dark-800 text-indigo-500 focus:ring-0 w-3 h-3"
                    />
                    <span>static</span>
                  </label>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500 font-mono">=</span>
                  <input
                    type="text"
                    value={attr.defaultValue || ''}
                    placeholder="default value"
                    onChange={(e) => handleUpdate(attr.id, { defaultValue: e.target.value })}
                    className="w-24 bg-dark-800 border border-slate-800 rounded px-1.5 py-0.5 text-slate-300 font-mono text-[11px] focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
