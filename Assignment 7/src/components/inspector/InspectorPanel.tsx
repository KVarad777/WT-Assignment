import React, { useState } from 'react';
import { 
  Box, 
  Layers, 
  FileCode, 
  Hash, 
  Sparkles, 
  Trash2, 
  Sliders, 
  Layers2, 
  Plus, 
  X,
  FileText,
  Workflow
} from 'lucide-react';
import { UMLClassData, UMLRelationshipData, Stereotype } from '../../core/types';
import { AttributeEditor } from './AttributeEditor';
import { MethodEditor } from './MethodEditor';
import { RelationshipEditor } from './RelationshipEditor';

interface InspectorPanelProps {
  selectedClass: UMLClassData | null;
  selectedRelationship: UMLRelationshipData | null;
  allClasses: UMLClassData[];
  relationships: UMLRelationshipData[];
  onUpdateClass: (updated: UMLClassData) => void;
  onDeleteClass: (id: string) => void;
  onUpdateRelationship: (updated: UMLRelationshipData) => void;
  onDeleteRelationship: (id: string) => void;
  defaultPackage: string;
  onUpdateDefaultPackage: (pkg: string) => void;
  onClose: () => void;
}

export function InspectorPanel({
  selectedClass,
  selectedRelationship,
  allClasses,
  relationships,
  onUpdateClass,
  onDeleteClass,
  onUpdateRelationship,
  onDeleteRelationship,
  defaultPackage,
  onUpdateDefaultPackage,
  onClose,
}: InspectorPanelProps) {
  const [activeTab, setActiveTab] = useState<'attributes' | 'methods' | 'general'>('attributes');
  const [newEnumConstant, setNewEnumConstant] = useState('');

  const availableClassNames = allClasses.map((c) => c.name);

  // If a relationship is selected
  if (selectedRelationship) {
    return (
      <div className="h-full flex flex-col bg-dark-950/90 border-l border-slate-800 p-4 overflow-y-auto">
        <RelationshipEditor
          relationship={selectedRelationship}
          classes={allClasses}
          onChange={onUpdateRelationship}
          onDelete={onDeleteRelationship}
        />
      </div>
    );
  }

  // If a class is selected
  if (selectedClass) {
    const isEnum = selectedClass.stereotype === 'enum';

    const handleAddEnumConstant = () => {
      if (!newEnumConstant.trim()) return;
      const formatted = newEnumConstant.trim().toUpperCase().replace(/\s+/g, '_');
      const current = selectedClass.enumValues || [];
      if (!current.includes(formatted)) {
        onUpdateClass({
          ...selectedClass,
          enumValues: [...current, formatted],
        });
      }
      setNewEnumConstant('');
    };

    const handleRemoveEnumConstant = (val: string) => {
      onUpdateClass({
        ...selectedClass,
        enumValues: (selectedClass.enumValues || []).filter((v) => v !== val),
      });
    };

    return (
      <div className="h-full flex flex-col bg-dark-950/90 border-l border-slate-800">
        {/* Panel Header */}
        <div className="p-4 border-b border-slate-800 bg-dark-900/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-400" />
            <span className="font-mono text-xs uppercase tracking-wider text-slate-300 font-semibold">
              Type Inspector
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onDeleteClass(selectedClass.id)}
              className="p-1.5 rounded-lg hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
              title="Delete class"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              title="Close panel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Basic Configuration */}
        <div className="p-4 space-y-3.5 border-b border-slate-800/80">
          <div className="grid grid-cols-2 gap-3">
            {/* Stereotype Selector */}
            <div>
              <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">
                Type Kind
              </label>
              <select
                value={selectedClass.stereotype}
                onChange={(e) => onUpdateClass({ ...selectedClass, stereotype: e.target.value as Stereotype })}
                className="w-full bg-dark-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
              >
                <option value="class">Class</option>
                <option value="interface">Interface</option>
                <option value="abstract">Abstract Class</option>
                <option value="enum">Enum</option>
                <option value="record">Record</option>
              </select>
            </div>

            {/* Type Name */}
            <div>
              <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">
                Identifier Name
              </label>
              <input
                type="text"
                value={selectedClass.name}
                placeholder="ClassName"
                onChange={(e) => onUpdateClass({ ...selectedClass, name: e.target.value })}
                className="w-full bg-dark-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono font-semibold focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Package and Documentation */}
          <div className="space-y-2">
            <div>
              <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">
                Package Name
              </label>
              <input
                type="text"
                value={selectedClass.packageName || ''}
                placeholder={defaultPackage}
                onChange={(e) => onUpdateClass({ ...selectedClass, packageName: e.target.value })}
                className="w-full bg-dark-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">
                Javadoc Summary
              </label>
              <input
                type="text"
                value={selectedClass.docComment || ''}
                placeholder="Summary description for generated Javadoc..."
                onChange={(e) => onUpdateClass({ ...selectedClass, docComment: e.target.value })}
                className="w-full bg-dark-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 font-sans focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Enum Constants Manager (if enum) */}
          {isEnum && (
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <label className="text-xs font-mono uppercase text-emerald-400 font-semibold block">
                Enum Constants
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newEnumConstant}
                  placeholder="NEW_CONSTANT"
                  onChange={(e) => setNewEnumConstant(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddEnumConstant()}
                  className="flex-1 bg-dark-900 border border-slate-700 rounded px-2 py-1 text-xs font-mono text-emerald-300 focus:outline-none focus:border-emerald-500"
                />
                <button
                  onClick={handleAddEnumConstant}
                  className="px-2.5 py-1 bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 rounded text-xs font-mono border border-emerald-500/30"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {(selectedClass.enumValues || []).map((val) => (
                  <span
                    key={val}
                    className="flex items-center gap-1 text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                  >
                    <span>{val}</span>
                    <button
                      onClick={() => handleRemoveEnumConstant(val)}
                      className="hover:text-rose-400 p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Tab Headers */}
        {!isEnum && (
          <>
            <div className="flex border-b border-slate-800 bg-dark-900/40 text-xs font-mono">
              <button
                onClick={() => setActiveTab('attributes')}
                className={`flex-1 py-2.5 text-center border-b-2 font-medium transition-colors ${
                  activeTab === 'attributes'
                    ? 'border-indigo-500 text-white bg-indigo-500/5'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Attributes ({selectedClass.attributes?.length || 0})
              </button>
              <button
                onClick={() => setActiveTab('methods')}
                className={`flex-1 py-2.5 text-center border-b-2 font-medium transition-colors ${
                  activeTab === 'methods'
                    ? 'border-cyan-500 text-white bg-cyan-500/5'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Methods ({selectedClass.methods?.length || 0})
              </button>
            </div>

            {/* Tab Contents */}
            <div className="p-4 flex-1 overflow-y-auto">
              {activeTab === 'attributes' && (
                <AttributeEditor
                  attributes={selectedClass.attributes || []}
                  availableClassNames={availableClassNames}
                  onChange={(attrs) => onUpdateClass({ ...selectedClass, attributes: attrs })}
                />
              )}

              {activeTab === 'methods' && (
                <MethodEditor
                  methods={selectedClass.methods || []}
                  availableClassNames={availableClassNames}
                  stereotype={selectedClass.stereotype}
                  onChange={(methods) => onUpdateClass({ ...selectedClass, methods })}
                />
              )}
            </div>
          </>
        )}
      </div>
    );
  }

  // Default Overview State (when no element is selected)
  return (
    <div className="h-full flex flex-col bg-dark-950/90 border-l border-slate-800 p-5 space-y-6 overflow-y-auto">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Workflow className="w-5 h-5 text-indigo-400" />
          <h3 className="font-mono text-sm font-semibold text-white">
            Architecture Blueprint
          </h3>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Select any UML class node or relationship edge on the canvas to inspect and edit its fields, methods, visibilities, and types.
        </p>
      </div>

      {/* Global Project Package */}
      <div className="p-3.5 rounded-xl bg-dark-900/80 border border-slate-700/60 space-y-2">
        <label className="text-[11px] font-mono uppercase text-slate-400 block">
          Root Java Package
        </label>
        <input
          type="text"
          value={defaultPackage}
          onChange={(e) => onUpdateDefaultPackage(e.target.value)}
          className="w-full bg-dark-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
        />
        <div className="text-[10px] text-slate-500">
          Classes without custom package will inherit this namespace.
        </div>
      </div>

      {/* Quick Architecture Summary */}
      <div className="space-y-2">
        <span className="text-xs uppercase font-mono text-slate-400 tracking-wider font-semibold">
          Diagram Inventory
        </span>
        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div className="p-3 rounded-lg bg-dark-900/60 border border-slate-800">
            <span className="text-slate-400 block text-[10px]">CLASSES / TYPES</span>
            <span className="text-lg font-bold text-indigo-400">{allClasses.length}</span>
          </div>
          <div className="p-3 rounded-lg bg-dark-900/60 border border-slate-800">
            <span className="text-slate-400 block text-[10px]">RELATIONSHIPS</span>
            <span className="text-lg font-bold text-cyan-400">{relationships.length}</span>
          </div>
        </div>
      </div>

      {/* UML Notation Quick Reference */}
      <div className="space-y-2 pt-2 border-t border-slate-800">
        <span className="text-xs uppercase font-mono text-slate-400 tracking-wider font-semibold">
          UML Visibility Symbols
        </span>
        <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
          <div className="flex items-center gap-2 p-2 rounded bg-dark-900/60 border border-slate-800">
            <span className="text-emerald-400 font-bold text-sm">+</span>
            <span className="text-slate-300">public</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded bg-dark-900/60 border border-slate-800">
            <span className="text-rose-400 font-bold text-sm">−</span>
            <span className="text-slate-300">private</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded bg-dark-900/60 border border-slate-800">
            <span className="text-amber-400 font-bold text-sm">#</span>
            <span className="text-slate-300">protected</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded bg-dark-900/60 border border-slate-800">
            <span className="text-sky-400 font-bold text-sm">~</span>
            <span className="text-slate-300">package</span>
          </div>
        </div>
      </div>
    </div>
  );
}
