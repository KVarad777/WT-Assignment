import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Trash2, Edit3 } from 'lucide-react';
import { UMLClassData, Visibility } from '../../core/types';

interface UMLClassNodeProps extends NodeProps {
  data: UMLClassData & {
    onSelectClass?: (classId: string) => void;
    onDeleteClass?: (classId: string) => void;
  };
}

const VISIBILITY_SYMBOLS: Record<Visibility, string> = {
  public: '+',
  private: '−',
  protected: '#',
  package: '~',
};

export const UMLClassNode = memo(({ id, data, selected }: UMLClassNodeProps) => {
  const isInterface = data.stereotype === 'interface';
  const isAbstract = data.stereotype === 'abstract';
  const isEnum = data.stereotype === 'enum';
  const isRecord = data.stereotype === 'record';

  const handleNodeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    data.onSelectClass?.(id);
  };

  return (
    <div
      onClick={handleNodeClick}
      className={`relative min-w-[220px] max-w-[320px] rounded-lg bg-[var(--bg-panel)] text-[var(--text-main)] transition-all shadow-md font-mono text-xs group cursor-pointer border ${
        selected
          ? 'ring-2 ring-indigo-500 border-indigo-500 shadow-indigo-500/20'
          : 'border-[var(--border-color)] hover:border-indigo-400/60'
      }`}
    >
      {/* 4 Multi-directional Connection Handles */}
      <Handle
        type="target"
        position={Position.Top}
        id="top-target"
        className="!w-2 !h-2 !bg-indigo-500 !border !border-[var(--bg-panel)]"
      />
      <Handle
        type="source"
        position={Position.Top}
        id="top-source"
        className="!w-2 !h-2 !bg-indigo-500 !border !border-[var(--bg-panel)] !opacity-0"
      />

      <Handle
        type="target"
        position={Position.Right}
        id="right-target"
        className="!w-2 !h-2 !bg-indigo-500 !border !border-[var(--bg-panel)]"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right-source"
        className="!w-2 !h-2 !bg-indigo-500 !border !border-[var(--bg-panel)] !opacity-0"
      />

      <Handle
        type="target"
        position={Position.Bottom}
        id="bottom-target"
        className="!w-2 !h-2 !bg-indigo-500 !border !border-[var(--bg-panel)]"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom-source"
        className="!w-2 !h-2 !bg-indigo-500 !border !border-[var(--bg-panel)] !opacity-0"
      />

      <Handle
        type="target"
        position={Position.Left}
        id="left-target"
        className="!w-2 !h-2 !bg-indigo-500 !border !border-[var(--bg-panel)]"
      />
      <Handle
        type="source"
        position={Position.Left}
        id="left-source"
        className="!w-2 !h-2 !bg-indigo-500 !border !border-[var(--bg-panel)] !opacity-0"
      />

      {/* 1. Header: Stereotype + Class Name */}
      <div className="px-3 py-2 bg-[var(--bg-subtle)] border-b border-[var(--border-color)] rounded-t-lg relative">
        {/* Quick actions on hover */}
        <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              data.onSelectClass?.(id);
            }}
            title="Edit class"
            className="p-1 rounded hover:bg-slate-700/20 text-[var(--text-muted)] hover:text-[var(--text-main)]"
          >
            <Edit3 className="w-3 h-3" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              data.onDeleteClass?.(id);
            }}
            title="Delete class"
            className="p-1 rounded hover:bg-rose-500/20 text-rose-500"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>

        {/* Stereotype Tag if not standard class */}
        {(isInterface || isAbstract || isEnum || isRecord) && (
          <div className="text-[10px] text-[var(--text-muted)] text-center mb-0.5 font-sans">
            «{data.stereotype}»
          </div>
        )}

        {/* Class Name */}
        <div className={`font-semibold text-center text-xs ${isAbstract ? 'italic' : ''}`}>
          {data.name || 'UnnamedClass'}
        </div>
      </div>

      {/* 2. Attributes Section */}
      {!isEnum && (
        <div className="px-3 py-1.5 border-b border-[var(--border-color)] space-y-0.5 min-h-[22px]">
          {data.attributes && data.attributes.length > 0 ? (
            data.attributes.map((attr) => {
              const symbol = VISIBILITY_SYMBOLS[attr.visibility || 'private'];
              return (
                <div key={attr.id} className="text-[11px] leading-tight truncate">
                  <span className="text-[var(--text-muted)] inline-block w-3">{symbol}</span>
                  <span className={attr.isStatic ? 'underline' : ''}>{attr.name}</span>
                  <span className="text-[var(--text-muted)]"> : </span>
                  <span className="font-medium text-indigo-500 dark:text-indigo-300">{attr.type}</span>
                </div>
              );
            })
          ) : (
            <div className="text-[10px] text-[var(--text-muted)] italic">No attributes</div>
          )}
        </div>
      )}

      {/* Enum Constants Section (if enum) */}
      {isEnum && (
        <div className="px-3 py-1.5 border-b border-[var(--border-color)] space-y-0.5">
          {data.enumValues && data.enumValues.length > 0 ? (
            data.enumValues.map((val, idx) => (
              <div key={idx} className="text-[11px] text-emerald-500 dark:text-emerald-400 leading-tight">
                {val}
              </div>
            ))
          ) : (
            <div className="text-[10px] text-[var(--text-muted)] italic">No constants</div>
          )}
        </div>
      )}

      {/* 3. Methods Section */}
      <div className="px-3 py-1.5 space-y-0.5 min-h-[22px] rounded-b-lg">
        {data.methods && data.methods.length > 0 ? (
          data.methods.map((m) => {
            const symbol = VISIBILITY_SYMBOLS[m.visibility || 'public'];
            const paramsStr = m.parameters
              ? m.parameters.map((p) => `${p.name}: ${p.type}`).join(', ')
              : '';
            return (
              <div key={m.id} className="text-[11px] leading-tight truncate">
                <span className="text-[var(--text-muted)] inline-block w-3">{symbol}</span>
                <span className={`${m.isAbstract ? 'italic' : ''} ${m.isStatic ? 'underline' : ''}`}>
                  {m.name}({paramsStr})
                </span>
                <span className="text-[var(--text-muted)]"> : </span>
                <span className="font-medium text-cyan-600 dark:text-cyan-300">{m.returnType}</span>
              </div>
            );
          })
        ) : (
          <div className="text-[10px] text-[var(--text-muted)] italic">No methods</div>
        )}
      </div>
    </div>
  );
});

UMLClassNode.displayName = 'UMLClassNode';
