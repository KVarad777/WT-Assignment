import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { 
  Box, 
  Layers, 
  FileCode, 
  Plus, 
  Trash2, 
  Edit3, 
  Sparkles,
  KeyRound,
  Lock,
  Globe,
  ShieldAlert,
  Hash
} from 'lucide-react';
import { UMLClassData, Stereotype, Visibility } from '../../core/types';

interface UMLClassNodeProps extends NodeProps {
  data: UMLClassData & {
    onSelectClass?: (classId: string) => void;
    onDeleteClass?: (classId: string) => void;
    onQuickAddAttribute?: (classId: string) => void;
    onQuickAddMethod?: (classId: string) => void;
  };
}

const STEREOTYPE_THEMES: Record<Stereotype, {
  label: string;
  badgeBg: string;
  badgeText: string;
  borderTop: string;
  icon: any;
}> = {
  class: {
    label: 'class',
    badgeBg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    badgeText: 'text-indigo-400',
    borderTop: 'from-indigo-500 to-indigo-600',
    icon: Box,
  },
  interface: {
    label: '«interface»',
    badgeBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    badgeText: 'text-cyan-400',
    borderTop: 'from-cyan-500 to-blue-500',
    icon: Layers,
  },
  abstract: {
    label: '«abstract»',
    badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    badgeText: 'text-amber-400',
    borderTop: 'from-amber-500 to-orange-500',
    icon: FileCode,
  },
  enum: {
    label: '«enum»',
    badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    badgeText: 'text-emerald-400',
    borderTop: 'from-emerald-500 to-teal-500',
    icon: Hash,
  },
  record: {
    label: '«record»',
    badgeBg: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
    badgeText: 'text-pink-400',
    borderTop: 'from-pink-500 to-rose-500',
    icon: Sparkles,
  },
};

const VISIBILITY_CONFIG: Record<Visibility, { symbol: string; color: string; icon: any }> = {
  public: { symbol: '+', color: 'text-emerald-400 font-bold', icon: Globe },
  private: { symbol: '−', color: 'text-rose-400 font-bold', icon: Lock },
  protected: { symbol: '#', color: 'text-amber-400 font-bold', icon: ShieldAlert },
  package: { symbol: '~', color: 'text-sky-400 font-bold', icon: KeyRound },
};

export const UMLClassNode = memo(({ id, data, selected }: UMLClassNodeProps) => {
  const theme = STEREOTYPE_THEMES[data.stereotype || 'class'];
  const IconComponent = theme.icon;

  const handleNodeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (data.onSelectClass) {
      data.onSelectClass(id);
    }
  };

  const isInterface = data.stereotype === 'interface';
  const isEnum = data.stereotype === 'enum';
  const isAbstract = data.stereotype === 'abstract';

  return (
    <div
      onClick={handleNodeClick}
      className={`relative min-w-[270px] max-w-[360px] rounded-xl bg-dark-900/95 backdrop-blur-md text-slate-200 transition-all duration-200 shadow-2xl group ${
        selected
          ? 'ring-2 ring-indigo-500 shadow-glow-indigo border-indigo-500/40'
          : 'border border-slate-700/60 hover:border-slate-500/80 hover:shadow-xl'
      }`}
    >
      {/* 4 Multi-directional Connection Handles */}
      <Handle
        type="target"
        position={Position.Top}
        id="top-target"
        className="!w-2.5 !h-2.5 !bg-indigo-400 !border-2 !border-dark-950"
      />
      <Handle
        type="source"
        position={Position.Top}
        id="top-source"
        className="!w-2.5 !h-2.5 !bg-indigo-400 !border-2 !border-dark-950 !opacity-0"
      />

      <Handle
        type="target"
        position={Position.Right}
        id="right-target"
        className="!w-2.5 !h-2.5 !bg-indigo-400 !border-2 !border-dark-950"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right-source"
        className="!w-2.5 !h-2.5 !bg-indigo-400 !border-2 !border-dark-950 !opacity-0"
      />

      <Handle
        type="target"
        position={Position.Bottom}
        id="bottom-target"
        className="!w-2.5 !h-2.5 !bg-indigo-400 !border-2 !border-dark-950"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom-source"
        className="!w-2.5 !h-2.5 !bg-indigo-400 !border-2 !border-dark-950 !opacity-0"
      />

      <Handle
        type="target"
        position={Position.Left}
        id="left-target"
        className="!w-2.5 !h-2.5 !bg-indigo-400 !border-2 !border-dark-950"
      />
      <Handle
        type="source"
        position={Position.Left}
        id="left-source"
        className="!w-2.5 !h-2.5 !bg-indigo-400 !border-2 !border-dark-950 !opacity-0"
      />

      {/* Decorative top accent gradient bar */}
      <div className={`h-1.5 w-full rounded-t-xl bg-gradient-to-r ${theme.borderTop}`} />

      {/* 1. Header Section */}
      <div className="px-3.5 py-2.5 bg-dark-850/90 border-b border-slate-700/50 rounded-t-lg">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span
              className={`text-[10px] uppercase font-mono tracking-wider px-1.5 py-0.5 rounded border ${theme.badgeBg}`}
            >
              {theme.label}
            </span>
            {data.packageName && (
              <span className="text-[10px] text-slate-400 truncate max-w-[110px]" title={data.packageName}>
                {data.packageName}
              </span>
            )}
          </div>

          {/* Quick Node Actions */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                data.onSelectClass?.(id);
              }}
              title="Edit class"
              className="p-1 rounded hover:bg-slate-700/60 text-slate-300 hover:text-white"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                data.onDeleteClass?.(id);
              }}
              title="Delete class"
              className="p-1 rounded hover:bg-rose-500/20 text-rose-400 hover:text-rose-300"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Class Name */}
        <div className="mt-1.5 flex items-center gap-2">
          <IconComponent className={`w-4 h-4 ${theme.badgeText} shrink-0`} />
          <h3 className={`font-mono text-sm font-semibold tracking-tight text-white truncate ${isAbstract ? 'italic' : ''}`}>
            {data.name || 'UnnamedClass'}
          </h3>
        </div>

        {data.docComment && (
          <p className="text-[11px] text-slate-400 font-sans italic mt-1 line-clamp-1">
            {data.docComment}
          </p>
        )}
      </div>

      {/* 2. Enum Values Section (if enum) */}
      {isEnum && (
        <div className="px-3 py-2 bg-dark-900/60 border-b border-slate-700/50">
          <div className="text-[10px] uppercase tracking-wider text-emerald-400/80 font-mono mb-1">
            Constants
          </div>
          <div className="flex flex-wrap gap-1">
            {data.enumValues && data.enumValues.length > 0 ? (
              data.enumValues.map((val, idx) => (
                <span
                  key={idx}
                  className="text-xs font-mono font-medium px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                >
                  {val}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-500 italic">No enum constants</span>
            )}
          </div>
        </div>
      )}

      {/* 3. Attributes Section */}
      {!isEnum && (
        <div className="px-3 py-2 bg-dark-900/50 border-b border-slate-700/40">
          <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-slate-400 font-mono mb-1">
            <span>Attributes ({data.attributes?.length || 0})</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                data.onQuickAddAttribute?.(id);
              }}
              className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 text-indigo-400 hover:text-indigo-300 transition-opacity"
            >
              <Plus className="w-3 h-3" />
              <span>Add</span>
            </button>
          </div>

          <div className="space-y-1">
            {data.attributes && data.attributes.length > 0 ? (
              data.attributes.map((attr) => {
                const vis = VISIBILITY_CONFIG[attr.visibility || 'private'];
                return (
                  <div
                    key={attr.id}
                    className="flex items-baseline justify-between gap-1 text-[12px] font-mono leading-tight group/attr hover:bg-slate-800/40 px-1 py-0.5 rounded"
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <span className={`${vis.color} w-2.5 text-center shrink-0`}>{vis.symbol}</span>
                      <span className={`text-slate-200 truncate ${attr.isStatic ? 'underline' : ''} ${attr.isFinal ? 'font-medium' : ''}`}>
                        {attr.name}
                      </span>
                      {attr.isFinal && <span className="text-[9px] text-amber-400/80 px-1 rounded bg-amber-500/10">final</span>}
                    </div>
                    <span className="text-slate-400 text-[11px] shrink-0 font-medium">
                      : <span className="text-sky-400">{attr.type}</span>
                      {attr.defaultValue && (
                        <span className="text-slate-500 text-[10px]"> = {attr.defaultValue}</span>
                      )}
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="text-[11px] text-slate-500 italic py-0.5">
                {isInterface ? 'No static constants' : 'No attributes defined'}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. Methods Section */}
      <div className="px-3 py-2 bg-dark-900/40 rounded-b-xl">
        <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-slate-400 font-mono mb-1">
          <span>Methods ({data.methods?.length || 0})</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              data.onQuickAddMethod?.(id);
            }}
            className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 text-cyan-400 hover:text-cyan-300 transition-opacity"
          >
            <Plus className="w-3 h-3" />
            <span>Add</span>
          </button>
        </div>

        <div className="space-y-1">
          {data.methods && data.methods.length > 0 ? (
            data.methods.map((method) => {
              const vis = VISIBILITY_CONFIG[method.visibility || 'public'];
              const paramsStr = method.parameters
                ? method.parameters.map((p) => `${p.name}: ${p.type}`).join(', ')
                : '';

              return (
                <div
                  key={method.id}
                  className="flex items-baseline justify-between gap-1 text-[12px] font-mono leading-tight hover:bg-slate-800/40 px-1 py-0.5 rounded"
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <span className={`${vis.color} w-2.5 text-center shrink-0`}>{vis.symbol}</span>
                    <span className={`text-slate-200 truncate ${method.isAbstract ? 'italic' : ''} ${method.isStatic ? 'underline' : ''}`}>
                      {method.name}({paramsStr})
                    </span>
                  </div>
                  <span className="text-slate-400 text-[11px] shrink-0 font-medium">
                    : <span className="text-emerald-400">{method.returnType}</span>
                  </span>
                </div>
              );
            })
          ) : (
            <div className="text-[11px] text-slate-500 italic py-0.5">
              No methods defined
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

UMLClassNode.displayName = 'UMLClassNode';
