import React, { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
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
  const [expandedAttrId, setExpandedAttrId] = useState<string | null>(null);
  
  // Combine primitive types, arrays, common types, and custom diagram class names
  const customClassArrays = availableClassNames.map((c) => `${c}[]`);
  const customClassLists = availableClassNames.map((c) => `List<${c}>`);
  const allTypes = Array.from(new Set([...COMMON_TYPES, ...availableClassNames, ...customClassArrays, ...customClassLists]));

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
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-[var(--text-main)]">Attributes</span>
        <button
          onClick={handleAddAttribute}
          className="flex items-center gap-1 text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 dark:hover:text-indigo-300 text-xs font-medium"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Attribute</span>
        </button>
      </div>

      {attributes.length === 0 ? (
        <div className="text-xs text-[var(--text-muted)] italic py-2 text-center">
          No attributes yet.
        </div>
      ) : (
        <div className="space-y-1.5 max-h-[280px] overflow-y-auto pr-0.5">
          {attributes.map((attr) => {
            const isExpanded = expandedAttrId === attr.id;
            return (
              <div
                key={attr.id}
                className="bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-md p-2 space-y-1.5 text-xs font-mono"
              >
                {/* Main Row: Visibility, Name, Type, Actions */}
                <div className="flex items-center gap-1.5">
                  <select
                    value={attr.visibility}
                    onChange={(e) => handleUpdate(attr.id, { visibility: e.target.value as Visibility })}
                    className="bg-[var(--bg-panel)] border border-[var(--border-color)] rounded px-1 py-0.5 text-[var(--text-main)] text-xs focus:outline-none focus:border-indigo-500"
                    title="Visibility"
                  >
                    <option value="private">− Private</option>
                    <option value="public">+ Public</option>
                    <option value="protected"># Protected</option>
                    <option value="package">~ Package</option>
                  </select>

                  <input
                    type="text"
                    value={attr.name}
                    placeholder="name"
                    onChange={(e) => handleUpdate(attr.id, { name: e.target.value })}
                    className="flex-1 min-w-0 bg-[var(--bg-panel)] border border-[var(--border-color)] rounded px-1.5 py-0.5 text-[var(--text-main)] text-xs focus:outline-none focus:border-indigo-500 font-medium"
                  />

                  <span className="text-[var(--text-muted)]">:</span>

                  <input
                    type="text"
                    list={`types-${attr.id}`}
                    value={attr.type}
                    placeholder="Type / Array"
                    onChange={(e) => handleUpdate(attr.id, { type: e.target.value })}
                    className="w-28 bg-[var(--bg-panel)] border border-[var(--border-color)] rounded px-1.5 py-0.5 text-indigo-500 dark:text-indigo-300 text-xs focus:outline-none focus:border-indigo-500 font-medium"
                  />
                  <datalist id={`types-${attr.id}`}>
                    {allTypes.map((t) => (
                      <option key={t} value={t} />
                    ))}
                  </datalist>

                  <button
                    onClick={() => setExpandedAttrId(isExpanded ? null : attr.id)}
                    className="p-1 text-[var(--text-muted)] hover:text-[var(--text-main)] rounded"
                    title="Advanced options"
                  >
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => handleDelete(attr.id)}
                    className="p-1 text-[var(--text-muted)] hover:text-rose-500 rounded"
                    title="Remove"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Secondary/Advanced Options */}
                {isExpanded && (
                  <div className="pt-1.5 border-t border-[var(--border-color)] flex items-center justify-between gap-3 text-[11px] text-[var(--text-muted)] font-sans">
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-1 cursor-pointer hover:text-[var(--text-main)]">
                        <input
                          type="checkbox"
                          checked={!!attr.isFinal}
                          onChange={(e) => handleUpdate(attr.id, { isFinal: e.target.checked })}
                          className="rounded border-slate-600 bg-[var(--bg-panel)] text-indigo-500 focus:ring-0 w-3 h-3"
                        />
                        <span>final</span>
                      </label>
                      <label className="flex items-center gap-1 cursor-pointer hover:text-[var(--text-main)]">
                        <input
                          type="checkbox"
                          checked={!!attr.isStatic}
                          onChange={(e) => handleUpdate(attr.id, { isStatic: e.target.checked })}
                          className="rounded border-slate-600 bg-[var(--bg-panel)] text-indigo-500 focus:ring-0 w-3 h-3"
                        />
                        <span>static</span>
                      </label>
                    </div>

                    <div className="flex items-center gap-1">
                      <span>default:</span>
                      <input
                        type="text"
                        value={attr.defaultValue || ''}
                        placeholder="val"
                        onChange={(e) => handleUpdate(attr.id, { defaultValue: e.target.value })}
                        className="w-16 bg-[var(--bg-panel)] border border-[var(--border-color)] rounded px-1 py-0.5 text-[var(--text-main)] font-mono text-[11px]"
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
