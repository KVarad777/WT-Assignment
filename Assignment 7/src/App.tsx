import React, { useState, useCallback, useEffect } from 'react';
import {
  Node,
  Edge,
  applyNodeChanges,
  applyEdgeChanges,
  NodeChange,
  EdgeChange,
  Connection,
  addEdge,
} from '@xyflow/react';

import { AppHeader } from './components/layout/AppHeader';
import { UMLCanvas } from './components/canvas/UMLCanvas';
import { InspectorPanel } from './components/inspector/InspectorPanel';
import { JavaViewerPanel } from './components/codegen/JavaViewerPanel';
import { 
  UMLClassData, 
  UMLRelationshipData, 
  Stereotype, 
  DiagramProject, 
  RelationshipType 
} from './core/types';
import { ECOMMERCE_PRESET } from './core/initialData';
import { 
  classesAndRelsToFlowElements, 
  createFlowEdge, 
  getLayoutedElements, 
  exportDiagramAsJson, 
  validateAndParseDiagramJson, 
  downloadProjectZip 
} from './core/diagramUtils';

export function App() {
  // Master Project State
  const [project, setProject] = useState<DiagramProject>(ECOMMERCE_PRESET);
  const [classes, setClasses] = useState<UMLClassData[]>(ECOMMERCE_PRESET.classes);
  const [relationships, setRelationships] = useState<UMLRelationshipData[]>(ECOMMERCE_PRESET.relationships);
  const [projectName, setProjectName] = useState<string>(ECOMMERCE_PRESET.name);
  const [defaultPackage, setDefaultPackage] = useState<string>(ECOMMERCE_PRESET.packageName);

  // Selection state
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [selectedRelationshipId, setSelectedRelationshipId] = useState<string | null>(null);

  // Layout & View settings
  const [layoutMode, setLayoutMode] = useState<'split' | 'canvas' | 'code'>('split');
  const [gridType, setGridType] = useState<'dots' | 'lines' | 'cross'>('dots');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Node & Edge callback handlers injected into node data
  const handleSelectClass = useCallback((id: string) => {
    setSelectedClassId(id);
    setSelectedRelationshipId(null);
  }, []);

  const handleDeleteClass = useCallback((id: string) => {
    setClasses((prev) => prev.filter((c) => c.id !== id));
    setRelationships((prev) => prev.filter((r) => r.source !== id && r.target !== id));
    setSelectedClassId((prev) => (prev === id ? null : prev));
    showToast('Class removed');
  }, []);

  const handleQuickAddAttribute = useCallback((id: string) => {
    setClasses((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const newAttr = {
            id: `attr-${Date.now()}-${Math.random().toString(36).substr(2, 3)}`,
            name: `field${(c.attributes?.length || 0) + 1}`,
            type: 'String',
            visibility: 'private' as const,
          };
          return { ...c, attributes: [...(c.attributes || []), newAttr] };
        }
        return c;
      })
    );
    setSelectedClassId(id);
  }, []);

  const handleQuickAddMethod = useCallback((id: string) => {
    setClasses((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const newMethod = {
            id: `m-${Date.now()}-${Math.random().toString(36).substr(2, 3)}`,
            name: `method${(c.methods?.length || 0) + 1}`,
            returnType: 'void',
            visibility: 'public' as const,
            parameters: [],
          };
          return { ...c, methods: [...(c.methods || []), newMethod] };
        }
        return c;
      })
    );
    setSelectedClassId(id);
  }, []);

  const handleSelectRelationship = useCallback((id: string) => {
    setSelectedRelationshipId(id);
    setSelectedClassId(null);
  }, []);

  const handleDeleteRelationship = useCallback((id: string) => {
    setRelationships((prev) => prev.filter((r) => r.id !== id));
    setSelectedRelationshipId((prev) => (prev === id ? null : prev));
    showToast('Relationship removed');
  }, []);

  // React Flow Elements Synchronization
  const [nodes, setNodes] = useState<Node<UMLClassData>[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  // Re-sync nodes and edges when classes or relationships change
  useEffect(() => {
    const { nodes: flowNodes, edges: flowEdges } = classesAndRelsToFlowElements(
      classes,
      relationships,
      project.positions
    );

    // Attach callbacks to nodes
    const enrichedNodes = flowNodes.map((n) => ({
      ...n,
      selected: n.id === selectedClassId,
      data: {
        ...n.data,
        onSelectClass: handleSelectClass,
        onDeleteClass: handleDeleteClass,
        onQuickAddAttribute: handleQuickAddAttribute,
        onQuickAddMethod: handleQuickAddMethod,
      },
    }));

    // Attach callbacks to edges
    const enrichedEdges = flowEdges.map((e) => ({
      ...e,
      selected: e.id === selectedRelationshipId,
      data: {
        ...(e.data as any),
        onSelectRelationship: handleSelectRelationship,
        onDeleteRelationship: handleDeleteRelationship,
      },
    }));

    setNodes(enrichedNodes);
    setEdges(enrichedEdges);
  }, [
    classes,
    relationships,
    selectedClassId,
    selectedRelationshipId,
    handleSelectClass,
    handleDeleteClass,
    handleQuickAddAttribute,
    handleQuickAddMethod,
    handleSelectRelationship,
    handleDeleteRelationship,
    project.positions,
  ]);

  // Handle Node Drag & Changes
  const onNodesChange = useCallback(
    (changes: NodeChange<Node<UMLClassData>>[]) => {
      setNodes((nds) => applyNodeChanges(changes, nds));
    },
    []
  );

  // Handle Edge Changes
  const onEdgesChange = useCallback(
    (changes: EdgeChange<Edge>[]) => {
      setEdges((eds) => applyEdgeChanges(changes, eds));
    },
    []
  );

  // Handle New Connections (Dragging arrow between ports)
  const onConnect = useCallback(
    (params: Connection) => {
      if (!params.source || !params.target || params.source === params.target) return;

      const sourceClass = classes.find((c) => c.id === params.source);
      const targetClass = classes.find((c) => c.id === params.target);

      if (!sourceClass || !targetClass) return;

      // Smart default relationship type:
      // If target is interface -> 'realization'
      // If target is class / abstract -> 'inheritance' or 'association'
      let defaultType: RelationshipType = 'association';
      if (targetClass.stereotype === 'interface') {
        defaultType = 'realization';
      } else if (targetClass.stereotype === 'abstract') {
        defaultType = 'inheritance';
      }

      const newRelId = `rel-${Date.now()}`;
      const newRelationship: UMLRelationshipData = {
        id: newRelId,
        source: params.source,
        target: params.target,
        type: defaultType,
        label: defaultType === 'realization' ? 'implements' : defaultType === 'inheritance' ? 'extends' : 'references',
        sourceMultiplicity: '1',
        targetMultiplicity: '1',
      };

      setRelationships((prev) => [...prev, newRelationship]);
      setSelectedRelationshipId(newRelId);
      setSelectedClassId(null);
      showToast(`Connected ${sourceClass.name} → ${targetClass.name}`);
    },
    [classes]
  );

  // Add new Class / Interface / Enum
  const handleAddElement = (stereotype: Stereotype) => {
    const nextNum = classes.length + 1;
    let baseName = 'NewClass';
    if (stereotype === 'interface') baseName = 'NewInterface';
    else if (stereotype === 'abstract') baseName = 'AbstractService';
    else if (stereotype === 'enum') baseName = 'TypeStatus';
    else if (stereotype === 'record') baseName = 'DataRecord';

    const newClass: UMLClassData = {
      id: `class-${Date.now()}`,
      name: `${baseName}${nextNum}`,
      stereotype,
      packageName: defaultPackage,
      attributes:
        stereotype === 'enum'
          ? []
          : [
              {
                id: `attr-${Date.now()}`,
                name: 'id',
                type: 'UUID',
                visibility: 'private',
                isFinal: true,
              },
            ],
      methods:
        stereotype === 'enum'
          ? []
          : [
              {
                id: `m-${Date.now()}`,
                name: 'execute',
                returnType: 'void',
                visibility: 'public',
                parameters: [],
              },
            ],
      enumValues: stereotype === 'enum' ? ['ACTIVE', 'INACTIVE', 'PENDING'] : undefined,
    };

    // Place near center
    const newPos = {
      x: 200 + (classes.length % 3) * 120,
      y: 150 + Math.floor(classes.length / 3) * 100,
    };

    setClasses((prev) => [...prev, newClass]);
    setProject((prev) => ({
      ...prev,
      positions: {
        ...(prev.positions || {}),
        [newClass.id]: newPos,
      },
    }));
    setSelectedClassId(newClass.id);
    setSelectedRelationshipId(null);
    showToast(`Created new ${stereotype}: ${newClass.name}`);
  };

  // Auto Layout with Dagre
  const handleAutoLayout = useCallback(() => {
    const layouted = getLayoutedElements(nodes, edges);
    setNodes([...layouted.nodes]);
    setEdges([...layouted.edges]);

    const newPositions: Record<string, { x: number; y: number }> = {};
    layouted.nodes.forEach((n) => {
      newPositions[n.id] = n.position;
    });

    setProject((prev) => ({
      ...prev,
      positions: newPositions,
    }));
    showToast('Diagram auto-aligned with hierarchical layout');
  }, [nodes, edges]);

  // Clear all
  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear the entire diagram?')) {
      setClasses([]);
      setRelationships([]);
      setSelectedClassId(null);
      setSelectedRelationshipId(null);
      setProject((prev) => ({ ...prev, classes: [], relationships: [], positions: {} }));
      showToast('Canvas cleared');
    }
  };

  // Load Preset Architecture
  const handleLoadPreset = (preset: DiagramProject) => {
    setProject(preset);
    setClasses(preset.classes);
    setRelationships(preset.relationships);
    setProjectName(preset.name);
    setDefaultPackage(preset.packageName);
    setSelectedClassId(null);
    setSelectedRelationshipId(null);
    showToast(`Loaded preset: "${preset.name}"`);
  };

  // Export JSON
  const handleExportJson = () => {
    const fullProject: DiagramProject = {
      id: project.id,
      name: projectName,
      packageName: defaultPackage,
      classes,
      relationships,
      positions: nodes.reduce((acc, n) => ({ ...acc, [n.id]: n.position }), {}),
    };
    exportDiagramAsJson(fullProject);
    showToast('Diagram exported to JSON');
  };

  // Import JSON
  const handleImportJson = async (file: File) => {
    try {
      const text = await file.text();
      const parsed = validateAndParseDiagramJson(text);
      handleLoadPreset(parsed);
      showToast('Diagram loaded successfully');
    } catch (err: any) {
      alert(`Failed to import JSON: ${err.message}`);
    }
  };

  // Download ZIP
  const handleDownloadZip = () => {
    downloadProjectZip(classes, relationships, projectName, defaultPackage);
    showToast('Java project zip archive generated');
  };

  // Update selected class
  const handleUpdateClass = (updated: UMLClassData) => {
    setClasses((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  };

  // Update selected relationship
  const handleUpdateRelationship = (updated: UMLRelationshipData) => {
    setRelationships((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
  };

  const selectedClass = classes.find((c) => c.id === selectedClassId) || null;
  const selectedRelationship = relationships.find((r) => r.id === selectedRelationshipId) || null;

  return (
    <div className="flex flex-col h-screen w-screen bg-dark-950 text-slate-100 overflow-hidden font-sans">
      {/* Top Application Header */}
      <AppHeader
        projectName={projectName}
        onUpdateProjectName={setProjectName}
        onLoadPreset={handleLoadPreset}
        onExportJson={handleExportJson}
        onImportJson={handleImportJson}
        onDownloadZip={handleDownloadZip}
        layoutMode={layoutMode}
        onChangeLayoutMode={setLayoutMode}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left/Center Visual Canvas */}
        {(layoutMode === 'split' || layoutMode === 'canvas') && (
          <div className="flex-1 h-full relative">
            <UMLCanvas
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onAddElement={handleAddElement}
              onAutoLayout={handleAutoLayout}
              onClearAll={handleClearAll}
              onSelectNode={(nodeId) => {
                setSelectedClassId(nodeId);
                setSelectedRelationshipId(null);
              }}
              onSelectEdge={(edgeId) => {
                setSelectedRelationshipId(edgeId);
                setSelectedClassId(null);
              }}
              selectedNodeId={selectedClassId}
              selectedEdgeId={selectedRelationshipId}
              gridType={gridType}
              onToggleGrid={() => {
                setGridType((g) => (g === 'dots' ? 'lines' : g === 'lines' ? 'cross' : 'dots'));
              }}
            />
          </div>
        )}

        {/* Collapsible/Slide-in Property Inspector Panel */}
        {(layoutMode === 'split' || layoutMode === 'canvas') && (
          <div className="w-80 lg:w-96 shrink-0 h-full border-l border-slate-800/80 bg-dark-950 z-10 shadow-2xl">
            <InspectorPanel
              selectedClass={selectedClass}
              selectedRelationship={selectedRelationship}
              allClasses={classes}
              relationships={relationships}
              onUpdateClass={handleUpdateClass}
              onDeleteClass={handleDeleteClass}
              onUpdateRelationship={handleUpdateRelationship}
              onDeleteRelationship={handleDeleteRelationship}
              defaultPackage={defaultPackage}
              onUpdateDefaultPackage={setDefaultPackage}
              onClose={() => {
                setSelectedClassId(null);
                setSelectedRelationshipId(null);
              }}
            />
          </div>
        )}

        {/* Right Java Source Code Generator Panel (Split or Code only) */}
        {(layoutMode === 'split' || layoutMode === 'code') && (
          <div
            className={`shrink-0 h-full bg-dark-950 transition-all ${
              layoutMode === 'code' ? 'flex-1' : 'w-[440px] xl:w-[500px] border-l border-slate-800/80'
            }`}
          >
            <JavaViewerPanel
              classes={classes}
              relationships={relationships}
              projectName={projectName}
              defaultPackage={defaultPackage}
              selectedClassId={selectedClassId}
              onSelectClass={(id) => {
                setSelectedClassId(id);
                setSelectedRelationshipId(null);
              }}
            />
          </div>
        )}
      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-indigo-600/90 text-white font-mono text-xs shadow-xl shadow-indigo-600/30 border border-indigo-400/40 backdrop-blur-md animate-fade-in flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export default App;
