import React, { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp, Code2 } from 'lucide-react';
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
  const [expandedBodyId, setExpandedBodyId] = useState<string | null>(null);
  const allReturnTypes = Array.from(new Set([...COMMON_TYPES, ...availableClassNames]));
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

  // Parameter helpers
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
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
          Operations & Methods ({methods.length})
        </span>
        <button
          onClick={handleAddMethod}
          className="flex items-center gap-1 text-xs px-2.5 py-1 rounded bg-cyan-600/20 hover:bg-cyan-600/40 text-cyan-300 hover:text-white border border-cyan-500/30 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Method</span>
        </button>
      </div>

      {methods.length === 0 ? (
        <div className="text-xs text-slate-500 italic p-3 text-center border border-dashed border-slate-700/60 rounded-lg bg-dark-900/40">
          No methods defined yet. Click "Add Method" to create one.
        </div>
      ) : (
        <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
          {methods.map((method) => {
            const isBodyOpen = expandedBodyId === method.id;
            return (
              <div
                key={method.id}
                className="p-2.5 rounded-lg bg-dark-900/90 border border-slate-700/60 hover:border-slate-600 space-y-2 text-xs transition-colors"
              >
                {/* Row 1: Visibility, Name, Return Type, Actions */}
                <div className="flex items-center gap-2">
                  <select
                    value={method.visibility}
                    onChange={(e) => handleUpdate(method.id, { visibility: e.target.value as Visibility })}
                    className="bg-dark-800 border border-slate-700 rounded px-1.5 py-1 text-slate-200 text-xs font-mono focus:outline-none focus:border-cyan-500"
                    title="Visibility modifier"
                  >
                    <option value="public">public (+)</option>
                    <option value="private">private (-)</option>
                    <option value="protected">protected (#)</option>
                    <option value="package">package (~)</option>
                  </select>

                  <input
                    type="text"
                    value={method.name}
                    placeholder="methodName"
                    onChange={(e) => handleUpdate(method.id, { name: e.target.value })}
                    className="flex-1 min-w-0 bg-dark-800 border border-slate-700 rounded px-2 py-1 text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                  />

                  <span className="text-slate-500 font-mono">:</span>

                  <input
                    type="text"
                    list={`retTypes-${method.id}`}
                    value={method.returnType}
                    placeholder="Return Type"
                    onChange={(e) => handleUpdate(method.id, { returnType: e.target.value })}
                    className="w-24 bg-dark-800 border border-slate-700 rounded px-2 py-1 text-emerald-300 font-mono text-xs focus:outline-none focus:border-cyan-500"
                  />
                  <datalist id={`retTypes-${method.id}`}>
                    {allReturnTypes.map((t) => (
                      <option key={t} value={t} />
                    ))}
                  </datalist>

                  <button
                    onClick={() => handleDelete(method.id)}
                    title="Remove method"
                    className="p-1 rounded hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Row 2: Parameters List */}
                <div className="pt-1 border-t border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Parameters ({method.parameters?.length || 0})</span>
                    <button
                      onClick={() => handleAddParam(method.id)}
                      className="text-cyan-400 hover:text-cyan-300 flex items-center gap-0.5 text-[11px]"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Param</span>
                    </button>
                  </div>

                  {method.parameters && method.parameters.length > 0 && (
                    <div className="space-y-1 pl-1">
                      {method.parameters.map((param) => (
                        <div key={param.id} className="flex items-center gap-1.5">
                          <input
                            type="text"
                            value={param.name}
                            placeholder="paramName"
                            onChange={(e) =>
                              handleUpdateParam(method.id, param.id, { name: e.target.value })
                            }
                            className="w-24 bg-dark-800 border border-slate-800 rounded px-1.5 py-0.5 text-white font-mono text-[11px] focus:outline-none focus:border-cyan-500"
                          />
                          <span className="text-slate-500 font-mono">:</span>
                          <input
                            type="text"
                            value={param.type}
                            placeholder="Type"
                            onChange={(e) =>
                              handleUpdateParam(method.id, param.id, { type: e.target.value })
                            }
                            className="flex-1 bg-dark-800 border border-slate-800 rounded px-1.5 py-0.5 text-sky-300 font-mono text-[11px] focus:outline-none focus:border-cyan-500"
                          />
                          <button
                            onClick={() => handleDeleteParam(method.id, param.id)}
                            className="p-0.5 text-slate-500 hover:text-rose-400"
                            title="Remove parameter"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Row 3: Modifiers and Custom Body Drawer */}
                <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800 text-[11px]">
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1 text-slate-400 hover:text-slate-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!method.isStatic}
                        onChange={(e) => handleUpdate(method.id, { isStatic: e.target.checked })}
                        className="rounded border-slate-700 bg-dark-800 text-cyan-500 focus:ring-0 w-3 h-3"
                      />
                      <span>static</span>
                    </label>

                    {!isInterface && (
                      <label className="flex items-center gap-1 text-slate-400 hover:text-slate-200 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!!method.isAbstract}
                          onChange={(e) => handleUpdate(method.id, { isAbstract: e.target.checked })}
                          className="rounded border-slate-700 bg-dark-800 text-cyan-500 focus:ring-0 w-3 h-3"
                        />
                        <span>abstract</span>
                      </label>
                    )}

                    {isInterface && (
                      <label className="flex items-center gap-1 text-slate-400 hover:text-slate-200 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!!method.isDefault}
                          onChange={(e) => handleUpdate(method.id, { isDefault: e.target.checked })}
                          className="rounded border-slate-700 bg-dark-800 text-cyan-500 focus:ring-0 w-3 h-3"
                        />
                        <span>default</span>
                      </label>
                    )}
                  </div>

                  {/* Body toggle button */}
                  {(!method.isAbstract || (isInterface && method.isDefault)) && (
                    <button
                      onClick={() => setExpandedBodyId(isBodyOpen ? null : method.id)}
                      className="flex items-center gap-1 text-slate-400 hover:text-slate-200 text-[11px]"
                    >
                      <Code2 className="w-3 h-3 text-cyan-400" />
                      <span>{isBodyOpen ? 'Hide Body' : 'Custom Body'}</span>
                    </button>
                  )}
                </div>

                {/* Custom Body Editor */}
                {isBodyOpen && (
                  <div className="pt-2">
                    <div className="text-[10px] text-slate-400 mb-1 font-mono">Custom Method Body (Java):</div>
                    <textarea
                      value={method.customBody || ''}
                      placeholder="// write Java statements here..."
                      rows={3}
                      onChange={(e) => handleUpdate(method.id, { customBody: e.target.value })}
                      className="w-full bg-dark-950 border border-slate-700/80 rounded p-2 text-xs font-mono text-emerald-300 focus:outline-none focus:border-cyan-500"
                    />
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
