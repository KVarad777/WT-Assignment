import React from 'react';
import { 
  Trash2, 
  ArrowRightLeft, 
  Network, 
  CheckCircle2, 
  GitFork, 
  Boxes, 
  Package, 
  Link2, 
  MoveRight 
} from 'lucide-react';
import { 
  UMLRelationshipData, 
  RelationshipType, 
  RELATIONSHIP_LABELS, 
  UMLClassData 
} from '../../core/types';

interface RelationshipEditorProps {
  relationship: UMLRelationshipData;
  classes: UMLClassData[];
  onChange: (updated: UMLRelationshipData) => void;
  onDelete: (id: string) => void;
}

const TYPE_ICONS: Record<RelationshipType, any> = {
  inheritance: GitFork,
  realization: CheckCircle2,
  composition: Boxes,
  aggregation: Package,
  association: Link2,
  dependency: MoveRight,
};

const COMMON_MULTIPLICITIES = ['1', '0..1', '1..*', '*', '0..*'];

export function RelationshipEditor({
  relationship,
  classes,
  onChange,
  onDelete,
}: RelationshipEditorProps) {
  const sourceClass = classes.find((c) => c.id === relationship.source);
  const targetClass = classes.find((c) => c.id === relationship.target);

  const handleSwapDirection = () => {
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

  const relTypes: RelationshipType[] = [
    'inheritance',
    'realization',
    'composition',
    'aggregation',
    'association',
    'dependency',
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-700/60">
        <div className="flex items-center gap-2">
          <Network className="w-4 h-4 text-indigo-400" />
          <span className="font-mono text-sm font-semibold text-white">
            Relationship Inspector
          </span>
        </div>
        <button
          onClick={() => onDelete(relationship.id)}
          className="flex items-center gap-1 text-xs px-2.5 py-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Delete</span>
        </button>
      </div>

      {/* Connected Nodes Summary */}
      <div className="p-3 rounded-lg bg-dark-900/90 border border-slate-700/60 flex items-center justify-between gap-3 text-xs">
        <div className="flex-1 min-w-0">
          <span className="text-[10px] uppercase font-mono text-indigo-400 block mb-0.5">Source (From)</span>
          <div className="font-mono font-semibold text-white truncate">
            {sourceClass?.name || relationship.source}
          </div>
        </div>

        <button
          onClick={handleSwapDirection}
          title="Swap source and target"
          className="p-1.5 rounded-lg bg-dark-800 hover:bg-indigo-600/30 text-slate-300 hover:text-white border border-slate-700 transition-colors"
        >
          <ArrowRightLeft className="w-3.5 h-3.5" />
        </button>

        <div className="flex-1 min-w-0 text-right">
          <span className="text-[10px] uppercase font-mono text-cyan-400 block mb-0.5">Target (To)</span>
          <div className="font-mono font-semibold text-white truncate">
            {targetClass?.name || relationship.target}
          </div>
        </div>
      </div>

      {/* Relationship Type Picker */}
      <div className="space-y-2">
        <label className="text-xs uppercase font-mono text-slate-400 font-semibold block">
          UML Relationship Type
        </label>
        <div className="grid grid-cols-1 gap-2">
          {relTypes.map((type) => {
            const isSelected = relationship.type === type;
            const meta = RELATIONSHIP_LABELS[type];
            const Icon = TYPE_ICONS[type];

            return (
              <button
                key={type}
                type="button"
                onClick={() => onChange({ ...relationship, type })}
                className={`flex items-start gap-3 p-2.5 rounded-lg text-left transition-all border ${
                  isSelected
                    ? 'bg-indigo-600/15 border-indigo-500 text-white shadow-sm'
                    : 'bg-dark-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-dark-900'
                }`}
              >
                <div
                  className={`p-1.5 rounded-md mt-0.5 ${
                    isSelected ? 'bg-indigo-600 text-white' : 'bg-dark-800 text-slate-400'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold font-mono flex items-center justify-between">
                    <span>{meta.name}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 leading-tight mt-0.5 font-sans">
                    {meta.desc}
                  </div>
                  <div className="text-[10px] text-emerald-400/90 font-mono mt-1">
                    Java: {meta.javaHint}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Label and Roles */}
      <div className="space-y-3 pt-2 border-t border-slate-800">
        <div>
          <label className="text-xs font-mono text-slate-400 block mb-1">Relationship Label / Action</label>
          <input
            type="text"
            value={relationship.label || ''}
            placeholder="e.g. manages, contains, places"
            onChange={(e) => onChange({ ...relationship, label: e.target.value })}
            className="w-full bg-dark-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Multiplicities & Roles */}
        {['composition', 'aggregation', 'association'].includes(relationship.type) && (
          <div className="grid grid-cols-2 gap-3 pt-1">
            {/* Source Multiplicity */}
            <div>
              <label className="text-[11px] font-mono text-indigo-400 block mb-1">Source Multiplicity</label>
              <input
                type="text"
                list="multiplicity-opts"
                value={relationship.sourceMultiplicity || ''}
                placeholder="1, 0..1, *"
                onChange={(e) => onChange({ ...relationship, sourceMultiplicity: e.target.value })}
                className="w-full bg-dark-900 border border-slate-700 rounded px-2.5 py-1 text-xs text-indigo-300 font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Target Multiplicity */}
            <div>
              <label className="text-[11px] font-mono text-cyan-400 block mb-1">Target Multiplicity</label>
              <input
                type="text"
                list="multiplicity-opts"
                value={relationship.targetMultiplicity || ''}
                placeholder="*, 1..*, 1"
                onChange={(e) => onChange({ ...relationship, targetMultiplicity: e.target.value })}
                className="w-full bg-dark-900 border border-slate-700 rounded px-2.5 py-1 text-xs text-cyan-300 font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Target Role Name (Field Name) */}
            <div className="col-span-2">
              <label className="text-[11px] font-mono text-slate-400 block mb-1">
                Target Role Name (Java field name in source)
              </label>
              <input
                type="text"
                value={relationship.targetRole || ''}
                placeholder={`e.g. ${targetClass ? targetClass.name.toLowerCase() + 'List' : 'items'}`}
                onChange={(e) => onChange({ ...relationship, targetRole: e.target.value })}
                className="w-full bg-dark-900 border border-slate-700 rounded px-2.5 py-1 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        )}

        <datalist id="multiplicity-opts">
          {COMMON_MULTIPLICITIES.map((m) => (
            <option key={m} value={m} />
          ))}
        </datalist>
      </div>
    </div>
  );
}
