import React from 'react';
import { Trash2, ArrowRightLeft } from 'lucide-react';
import { 
  UMLRelationshipData, 
  RelationshipType, 
  UMLClassData 
} from '../../core/types';

interface RelationshipEditorProps {
  relationship: UMLRelationshipData;
  classes: UMLClassData[];
  onChange: (updated: UMLRelationshipData) => void;
  onDelete: (id: string) => void;
}

const RELATIONSHIP_OPTIONS: { type: RelationshipType; label: string; java: string }[] = [
  { type: 'association', label: 'Association (uses/has)', java: 'field reference' },
  { type: 'inheritance', label: 'Inheritance (extends)', java: 'extends SuperClass' },
  { type: 'realization', label: 'Realization (implements)', java: 'implements Interface' },
  { type: 'composition', label: 'Composition (owns parts)', java: 'child instance' },
  { type: 'aggregation', label: 'Aggregation (has parts)', java: 'shared reference' },
  { type: 'dependency', label: 'Dependency (transient)', java: 'method param/return' },
];

export function RelationshipEditor({
  relationship,
  classes,
  onChange,
  onDelete,
}: RelationshipEditorProps) {
  const sourceClass = classes.find((c) => c.id === relationship.source);
  const targetClass = classes.find((c) => c.id === relationship.target);

  const handleSwap = () => {
    onChange({
      ...relationship,
      source: relationship.target,
      target: relationship.source,
      sourceMultiplicity: relationship.targetMultiplicity,
      targetMultiplicity: relationship.sourceMultiplicity,
      sourceRole: relationship.targetRole,
      targetRole: relationship.sourceRole,
    });
  };

  return (
    <div className="space-y-4 text-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <span className="font-semibold text-white">Edit Relationship</span>
        <button
          onClick={() => onDelete(relationship.id)}
          className="text-rose-400 hover:text-rose-300 flex items-center gap-1 p-1 rounded hover:bg-rose-500/10"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Delete</span>
        </button>
      </div>

      {/* Nodes Summary */}
      <div className="flex items-center justify-between bg-dark-900 border border-slate-800 rounded-md p-2">
        <span className="font-mono text-white font-medium truncate max-w-[90px]">
          {sourceClass?.name || 'Source'}
        </span>
        <button
          onClick={handleSwap}
          className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800"
          title="Swap direction"
        >
          <ArrowRightLeft className="w-3.5 h-3.5" />
        </button>
        <span className="font-mono text-white font-medium truncate max-w-[90px]">
          {targetClass?.name || 'Target'}
        </span>
      </div>

      {/* Relationship Type */}
      <div className="space-y-1">
        <label className="text-slate-400 font-medium">Relationship Type</label>
        <select
          value={relationship.type}
          onChange={(e) => onChange({ ...relationship, type: e.target.value as RelationshipType })}
          className="w-full bg-dark-900 border border-slate-800 rounded-md px-2.5 py-1.5 text-white font-mono focus:outline-none focus:border-indigo-500"
        >
          {RELATIONSHIP_OPTIONS.map((opt) => (
            <option key={opt.type} value={opt.type}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Label */}
      <div className="space-y-1">
        <label className="text-slate-400 font-medium">Label</label>
        <input
          type="text"
          value={relationship.label || ''}
          placeholder="e.g. contains, manages"
          onChange={(e) => onChange({ ...relationship, label: e.target.value })}
          className="w-full bg-dark-900 border border-slate-800 rounded-md px-2.5 py-1.5 text-white focus:outline-none focus:border-indigo-500 font-mono"
        />
      </div>

      {/* Multiplicities */}
      {['composition', 'aggregation', 'association'].includes(relationship.type) && (
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div>
            <label className="text-slate-400 text-[11px]">Source Multiplicity</label>
            <input
              type="text"
              value={relationship.sourceMultiplicity || ''}
              placeholder="1"
              onChange={(e) => onChange({ ...relationship, sourceMultiplicity: e.target.value })}
              className="w-full bg-dark-900 border border-slate-800 rounded px-2 py-1 text-white font-mono text-xs"
            />
          </div>
          <div>
            <label className="text-slate-400 text-[11px]">Target Multiplicity</label>
            <input
              type="text"
              value={relationship.targetMultiplicity || ''}
              placeholder="*"
              onChange={(e) => onChange({ ...relationship, targetMultiplicity: e.target.value })}
              className="w-full bg-dark-900 border border-slate-800 rounded px-2 py-1 text-white font-mono text-xs"
            />
          </div>
        </div>
      )}
    </div>
  );
}
