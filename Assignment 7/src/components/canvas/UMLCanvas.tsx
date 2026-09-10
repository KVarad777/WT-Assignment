import React, { useMemo, useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Edge,
  Node,
  BackgroundVariant,
  useReactFlow,
  ReactFlowProvider,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { UMLClassNode } from './UMLClassNode';
import { UMLEdge } from './UMLEdge';
import { CanvasToolbar } from './CanvasToolbar';
import { UMLClassData, Stereotype } from '../../core/types';

const nodeTypes = {
  umlClass: UMLClassNode,
};

const edgeTypes = {
  umlEdge: UMLEdge,
};

interface UMLCanvasProps {
  nodes: Node<UMLClassData>[];
  edges: Edge[];
  onNodesChange: OnNodesChange<Node<UMLClassData>>;
  onEdgesChange: OnEdgesChange<Edge>;
  onConnect: OnConnect;
  onAddElement: (stereotype: Stereotype) => void;
  onAutoLayout: () => void;
  onClearAll: () => void;
  onSelectNode: (nodeId: string | null) => void;
  onSelectEdge: (edgeId: string | null) => void;
  onNodeContextMenu: (event: React.MouseEvent, node: Node) => void;
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  gridType: 'dots' | 'lines' | 'cross';
  onToggleGrid: () => void;
  theme: 'dark' | 'light';
}

function FlowContent({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onAddElement,
  onAutoLayout,
  onClearAll,
  onSelectNode,
  onSelectEdge,
  onNodeContextMenu,
  selectedNodeId,
  selectedEdgeId,
  gridType,
  onToggleGrid,
  theme,
}: UMLCanvasProps) {
  const { fitView } = useReactFlow();

  const handleFitView = useCallback(() => {
    fitView({ padding: 0.25, duration: 300 });
  }, [fitView]);

  const onPaneClick = useCallback(() => {
    onSelectNode(null);
    onSelectEdge(null);
  }, [onSelectNode, onSelectEdge]);

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      onSelectNode(node.id);
      onSelectEdge(null);
    },
    [onSelectNode, onSelectEdge]
  );

  const onEdgeClick = useCallback(
    (_: React.MouseEvent, edge: Edge) => {
      onSelectEdge(edge.id);
      onSelectNode(null);
    },
    [onSelectNode, onSelectEdge]
  );

  const bgVariant = useMemo(() => {
    if (gridType === 'lines') return BackgroundVariant.Lines;
    if (gridType === 'cross') return BackgroundVariant.Cross;
    return BackgroundVariant.Dots;
  }, [gridType]);

  const isDark = theme === 'dark';

  return (
    <div className="relative w-full h-full bg-[var(--bg-app)] overflow-hidden transition-colors">
      {/* Canvas Actions Bar */}
      <CanvasToolbar
        onAddElement={onAddElement}
        onAutoLayout={onAutoLayout}
        onFitView={handleFitView}
        onClearAll={onClearAll}
        gridType={gridType}
        onToggleGrid={onToggleGrid}
      />

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        onNodeContextMenu={onNodeContextMenu}
        onPaneClick={onPaneClick}
        fitView
        minZoom={0.2}
        maxZoom={2.0}
        defaultEdgeOptions={{
          type: 'umlEdge',
        }}
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={bgVariant}
          gap={24}
          size={1.2}
          color={isDark ? '#334155' : '#cbd5e1'}
          className={isDark ? 'opacity-35' : 'opacity-60'}
        />
        
        <Controls
          showInteractive={false}
          position="bottom-left"
          className="!mb-4 !ml-4"
        />

        <MiniMap
          nodeStrokeWidth={2}
          nodeColor={isDark ? '#6366f1' : '#4f46e5'}
          maskColor={isDark ? 'rgba(8, 12, 20, 0.75)' : 'rgba(241, 245, 249, 0.75)'}
          position="bottom-right"
          className="!mb-4 !mr-4"
        />
      </ReactFlow>
    </div>
  );
}

export function UMLCanvas(props: UMLCanvasProps) {
  return (
    <ReactFlowProvider>
      <FlowContent {...props} />
    </ReactFlowProvider>
  );
}
