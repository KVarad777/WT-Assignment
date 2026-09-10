import React, { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { UMLMethod, UMLParameter, Visibility, COMMON_TYPES, Stereotype } from '../../core/types';

interface MethodEditorProps {
  methods: UMLMethod[];
  availableClassNames: string[];
  stereotype: Stereotype;
  onChange: (methods: UMLMethod[]) => void;
}

export function MethodEditor({
  methods,
  availableClassNames,
  stereotype,
  onChange,
}: MethodEditorProps) {
  const [expandedMethodId, setExpandedMethodId] = useState<string | null>(null);

  const customClassArrays = availableClassNames.map((c) => `${c}[]`);
  const customClassLists = availableClassNames.map((c) => `List<${c}>`);
  const allReturnTypes = Array.from(new Set([...COMMON_TYPES, ...availableClassNames, ...customClassArrays, ...customClassLists]));
  const isInterface = stereotype === 'interface';

  const handleAddMethod = () => {
    const newMethod: UMLMethod = {
      id: `m-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: `method${methods.length + 1}`,
      returnType: 'void',
      visibility: 'public',
      parameters: [],
    };
    onChange([...methods, newMethod]);
  };

  const handleUpdate = (id: string, updates: Partial<UMLMethod>) => {
    onChange(
      methods.map((m) => (m.id === id ? { ...m, ...updates } : m))
    );
  };

  const handleDelete = (id: string) => {
    onChange(methods.filter((m) => m.id !== id));
  };

  const handleAddParam = (methodId: string) => {
    const method = methods.find((m) => m.id === methodId);
    if (!method) return;
    const newParam: UMLParameter = {
      id: `p-${Date.now()}-${Math.random().toString(36).substr(2, 3)}`,
      name: `param${(method.parameters?.length || 0) + 1}`,
      type: 'String',
    };
    handleUpdate(methodId, {
      parameters: [...(method.parameters || []), newParam],
    });
  };

  const handleUpdateParam = (
    methodId: string,
    paramId: string,
    updates: Partial<UMLParameter>
  ) => {
    const method = methods.find((m) => m.id === methodId);
    if (!method) return;
    const updatedParams = (method.parameters || []).map((p) =>
      p.id === paramId ? { ...p, ...updates } : p
    );
    handleUpdate(methodId, { parameters: updatedParams });
  };

  const handleDeleteParam = (methodId: string, paramId: string) => {
    const method = methods.find((m) => m.id === methodId);
    if (!method) return;
    handleUpdate(methodId, {
      parameters: (method.parameters || []).filter((p) => p.id !== paramId),
    });
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-[var(--text-main)]">Methods</span>
        <button
          onClick={handleAddMethod}
          className="flex items-center gap-1 text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 dark:hover:text-indigo-300 text-xs font-medium"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Method</span>
        </button>
      </div>

      {methods.length === 0 ? (
        <div className="text-xs text-[var(--text-muted)] italic py-2 text-center">
          No methods yet.
        </div>
      ) : (
        <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-0.5">
          {methods.map((method) => {
            const isExpanded = expandedMethodId === method.id;
            return (
              <div
                key={method.id}
                className="bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-md p-2 space-y-2 text-xs font-mono"
              >
                {/* Main Row */}
                <div className="flex items-center gap-1.5">
                  <select
                    value={method.visibility}
                    onChange={(e) => handleUpdate(method.id, { visibility: e.target.value as Visibility })}
                    className="bg-[var(--bg-panel)] border border-[var(--border-color)] rounded px-1 py-0.5 text-[var(--text-main)] text-xs focus:outline-none focus:border-indigo-500"
                    title="Visibility"
                  >
                    <option value="public">+ Public</option>
                    <option value="private">− Private</option>
                    <option value="protected"># Protected</option>
                    <option value="package">~ Package</option>
                  </select>

                  <input
                    type="text"
                    value={method.name}
                    placeholder="name"
                    onChange={(e) => handleUpdate(method.id, { name: e.target.value })}
                    className="flex-1 min-w-0 bg-[var(--bg-panel)] border border-[var(--border-color)] rounded px-1.5 py-0.5 text-[var(--text-main)] text-xs focus:outline-none focus:border-indigo-500 font-medium"
                  />

                  <span className="text-[var(--text-muted)]">:</span>

                  <input
                    type="text"
                    list={`retTypes-${method.id}`}
                    value={method.returnType}
                    placeholder="Return Type / Array"
                    onChange={(e) => handleUpdate(method.id, { returnType: e.target.value })}
                    className="w-24 bg-[var(--bg-panel)] border border-[var(--border-color)] rounded px-1.5 py-0.5 text-cyan-600 dark:text-cyan-300 text-xs focus:outline-none focus:border-indigo-500 font-medium"
                  />
                  <datalist id={`retTypes-${method.id}`}>
                    {allReturnTypes.map((t) => (
                      <option key={t} value={t} />
                    ))}
                  </datalist>

                  <button
                    onClick={() => setExpandedMethodId(isExpanded ? null : method.id)}
                    className="p-1 text-[var(--text-muted)] hover:text-[var(--text-main)] rounded"
                    title="Parameters & body"
                  >
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => handleDelete(method.id)}
                    className="p-1 text-[var(--text-muted)] hover:text-rose-500 rounded"
                    title="Remove"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Parameters & Advanced Section */}
                {isExpanded && (
                  <div className="pt-2 border-t border-[var(--border-color)] space-y-2 text-xs font-sans">
                    {/* Parameters Header */}
                    <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)]">
                      <span>Parameters ({method.parameters?.length || 0})</span>
                      <button
                        onClick={() => handleAddParam(method.id)}
                        className="text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 dark:hover:text-indigo-300 flex items-center gap-0.5 font-medium"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Param</span>
                      </button>
                    </div>

                    {/* Parameters List */}
                    {method.parameters && method.parameters.length > 0 && (
                      <div className="space-y-1 font-mono">
                        {method.parameters.map((param) => (
                          <div key={param.id} className="flex items-center gap-1.5">
                            <input
                              type="text"
                              value={param.name}
                              placeholder="param"
                              onChange={(e) =>
                                handleUpdateParam(method.id, param.id, { name: e.target.value })
                              }
                              className="w-20 bg-[var(--bg-panel)] border border-[var(--border-color)] rounded px-1.5 py-0.5 text-[var(--text-main)] text-[11px]"
                            />
                            <span className="text-[var(--text-muted)]">:</span>
                            <input
                              type="text"
                              list={`paramTypes-${param.id}`}
                              value={param.type}
                              placeholder="Type"
                              onChange={(e) =>
                                handleUpdateParam(method.id, param.id, { type: e.target.value })
                              }
                              className="flex-1 bg-[var(--bg-panel)] border border-[var(--border-color)] rounded px-1.5 py-0.5 text-indigo-500 dark:text-indigo-300 text-[11px]"
                            />
                            <datalist id={`paramTypes-${param.id}`}>
                              {allReturnTypes.map((t) => (
                                <option key={t} value={t} />
                              ))}
                            </datalist>
                            <button
                              onClick={() => handleDeleteParam(method.id, param.id)}
                              className="p-0.5 text-[var(--text-muted)] hover:text-rose-500"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Modifiers */}
                    <div className="flex items-center gap-3 pt-1 text-[11px] text-[var(--text-muted)]">
                      <label className="flex items-center gap-1 cursor-pointer hover:text-[var(--text-main)]">
                        <input
                          type="checkbox"
                          checked={!!method.isStatic}
                          onChange={(e) => handleUpdate(method.id, { isStatic: e.target.checked })}
                          className="rounded border-slate-600 bg-[var(--bg-panel)] text-indigo-500 focus:ring-0 w-3 h-3"
                        />
                        <span>static</span>
                      </label>
                      {!isInterface && (
                        <label className="flex items-center gap-1 cursor-pointer hover:text-[var(--text-main)]">
                          <input
                            type="checkbox"
                            checked={!!method.isAbstract}
                            onChange={(e) => handleUpdate(method.id, { isAbstract: e.target.checked })}
                            className="rounded border-slate-600 bg-[var(--bg-panel)] text-indigo-500 focus:ring-0 w-3 h-3"
                          />
                          <span>abstract</span>
                        </label>
                      )}
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
