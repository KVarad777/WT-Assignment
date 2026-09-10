import React, { useState } from 'react';
import { 
  Trash2, 
  X,
  ChevronDown,
  ChevronUp
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
  onClose,
}: InspectorPanelProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [newEnumConstant, setNewEnumConstant] = useState('');

  const availableClassNames = allClasses.map((c) => c.name);

  // If a relationship is selected
  if (selectedRelationship) {
    return (
      <div className="h-full flex flex-col bg-[var(--bg-panel)] text-[var(--text-main)] p-4 overflow-y-auto">
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
      <div className="h-full flex flex-col bg-[var(--bg-panel)] text-[var(--text-main)] text-xs select-none">
        {/* Header: Title & Actions */}
        <div className="px-4 py-3 border-b border-[var(--border-color)] flex items-center justify-between">
          <span className="font-semibold text-[var(--text-main)]">Edit Type</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onDeleteClass(selectedClass.id)}
              className="p-1 text-[var(--text-muted)] hover:text-rose-500 rounded hover:bg-rose-500/10"
              title="Delete class"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onClose}
              className="p-1 text-[var(--text-muted)] hover:text-[var(--text-main)] rounded hover:bg-[var(--bg-subtle)]"
              title="Close panel"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Class Basic Form */}
          <div className="space-y-2.5">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-[var(--text-muted)] block mb-1">Kind</label>
                <select
                  value={selectedClass.stereotype}
                  onChange={(e) => onUpdateClass({ ...selectedClass, stereotype: e.target.value as Stereotype })}
                  className="w-full bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded px-2 py-1.5 text-[var(--text-main)] font-mono text-xs focus:outline-none focus:border-indigo-500"
                >
                  <option value="class">Class</option>
                  <option value="interface">Interface</option>
                  <option value="abstract">Abstract</option>
                  <option value="enum">Enum</option>
                  <option value="record">Record</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-[var(--text-muted)] block mb-1">Name</label>
                <input
                  type="text"
                  value={selectedClass.name}
                  onChange={(e) => onUpdateClass({ ...selectedClass, name: e.target.value })}
                  placeholder="ClassName"
                  className="w-full bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded px-2 py-1.5 text-[var(--text-main)] font-mono font-medium text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Collapsible Advanced Settings (Package, Javadoc) */}
            <div>
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-[11px] text-[var(--text-muted)] hover:text-[var(--text-main)] flex items-center gap-1 mt-1"
              >
                <span>{showAdvanced ? 'Hide advanced settings' : 'Show advanced settings'}</span>
                {showAdvanced ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>

              {showAdvanced && (
                <div className="pt-2 space-y-2 text-xs">
                  <div>
                    <label className="text-[11px] text-[var(--text-muted)] block mb-1">Package</label>
                    <input
                      type="text"
                      value={selectedClass.packageName || ''}
                      placeholder={defaultPackage}
                      onChange={(e) => onUpdateClass({ ...selectedClass, packageName: e.target.value })}
                      className="w-full bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded px-2 py-1 text-[var(--text-main)] font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-[var(--text-muted)] block mb-1">Javadoc Summary</label>
                    <input
                      type="text"
                      value={selectedClass.docComment || ''}
                      placeholder="Brief documentation comment..."
                      onChange={(e) => onUpdateClass({ ...selectedClass, docComment: e.target.value })}
                      className="w-full bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded px-2 py-1 text-[var(--text-main)] text-xs"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Enum Constants Manager (if enum) */}
          {isEnum ? (
            <div className="pt-2 border-t border-[var(--border-color)] space-y-2">
              <span className="font-medium text-[var(--text-main)] block">Enum Constants</span>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={newEnumConstant}
                  placeholder="NEW_CONSTANT"
                  onChange={(e) => setNewEnumConstant(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddEnumConstant()}
                  className="flex-1 bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded px-2 py-1 font-mono text-xs text-[var(--text-main)]"
                />
                <button
                  onClick={handleAddEnumConstant}
                  className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-medium"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-1 pt-1">
                {(selectedClass.enumValues || []).map((val) => (
                  <span
                    key={val}
                    className="flex items-center gap-1 font-mono text-[11px] px-2 py-0.5 rounded bg-[var(--bg-subtle)] border border-[var(--border-color)] text-[var(--text-main)]"
                  >
                    <span>{val}</span>
                    <button
                      onClick={() => handleRemoveEnumConstant(val)}
                      className="hover:text-rose-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Attributes Section */}
              <div className="pt-2 border-t border-[var(--border-color)]">
                <AttributeEditor
                  attributes={selectedClass.attributes || []}
                  availableClassNames={availableClassNames}
                  onChange={(attrs) => onUpdateClass({ ...selectedClass, attributes: attrs })}
                />
              </div>

              {/* Methods Section */}
              <div className="pt-2 border-t border-[var(--border-color)]">
                <MethodEditor
                  methods={selectedClass.methods || []}
                  availableClassNames={availableClassNames}
                  stereotype={selectedClass.stereotype}
                  onChange={(methods) => onUpdateClass({ ...selectedClass, methods })}
                />
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return null;
}
