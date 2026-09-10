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
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  gridType: 'dots' | 'lines' | 'cross';
  onToggleGrid: () => void;
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
  selectedNodeId,
  selectedEdgeId,
  gridType,
  onToggleGrid,
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

  return (
    <div className="relative w-full h-full bg-dark-950 overflow-hidden">
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
          color="#334155"
          className="opacity-30"
        />
        
        <Controls
          showInteractive={false}
          position="bottom-left"
          className="!mb-4 !ml-4"
        />

        <MiniMap
          nodeStrokeWidth={2}
          nodeColor="#6366f1"
          maskColor="rgba(8, 12, 20, 0.75)"
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
