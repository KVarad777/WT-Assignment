import React from 'react';
import {
  EdgeProps,
  getSmoothStepPath,
  EdgeLabelRenderer,
  BaseEdge,
} from '@xyflow/react';
import { Trash2, Settings } from 'lucide-react';
import { UMLRelationshipData } from '../../core/types';

export function UMLEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  markerStart,
  data,
  selected,
}: EdgeProps) {
  const relData = data as (UMLRelationshipData & {
    onSelectRelationship?: (relId: string) => void;
    onDeleteRelationship?: (relId: string) => void;
  }) | undefined;

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 16,
  });

  const sourceLabelX = sourceX + (labelX - sourceX) * 0.25;
  const sourceLabelY = sourceY + (labelY - sourceY) * 0.25 - 12;

  const targetLabelX = targetX + (labelX - targetX) * 0.25;
  const targetLabelY = targetY + (labelY - targetY) * 0.25 - 12;

  const edgeStyle: React.CSSProperties = {
    ...style,
    stroke: selected ? '#6366f1' : '#64748b',
    strokeWidth: selected ? 2.5 : 2,
  };

  if (relData?.type === 'realization' || relData?.type === 'dependency') {
    edgeStyle.strokeDasharray = '6 4';
  }

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        markerStart={markerStart}
        style={edgeStyle}
      />

      <EdgeLabelRenderer>
        {/* Center label & quick actions */}
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
          className="group flex items-center gap-1 bg-[var(--bg-panel)] border border-[var(--border-color)] px-2.5 py-0.5 rounded-full shadow-md text-[11px] font-mono text-[var(--text-main)] hover:border-indigo-500 transition-all cursor-pointer select-none"
          onClick={(e) => {
            e.stopPropagation();
            relData?.onSelectRelationship?.(id);
          }}
        >
          <span>{relData?.label || relData?.type || 'rel'}</span>
          
          <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 ml-1 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                relData?.onSelectRelationship?.(id);
              }}
              className="hover:text-indigo-500 p-0.5 rounded"
              title="Edit relationship"
            >
              <Settings className="w-3 h-3" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                relData?.onDeleteRelationship?.(id);
              }}
              className="hover:text-rose-500 p-0.5 rounded"
              title="Delete relationship"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Source Multiplicity */}
        {relData?.sourceMultiplicity && (
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${sourceLabelX}px,${sourceLabelY}px)`,
              pointerEvents: 'none',
            }}
            className="text-[11px] font-mono font-semibold px-1.5 py-0.2 rounded bg-[var(--bg-panel)] border border-[var(--border-color)] text-indigo-500 dark:text-indigo-300 shadow-sm"
          >
            {relData.sourceMultiplicity}
          </div>
        )}

        {/* Target Multiplicity */}
        {relData?.targetMultiplicity && (
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${targetLabelX}px,${targetLabelY}px)`,
              pointerEvents: 'none',
            }}
            className="text-[11px] font-mono font-semibold px-1.5 py-0.2 rounded bg-[var(--bg-panel)] border border-[var(--border-color)] text-cyan-600 dark:text-cyan-300 shadow-sm"
          >
            {relData.targetMultiplicity}
          </div>
        )}
      </EdgeLabelRenderer>
    </>
  );
}
