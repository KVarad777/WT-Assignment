import React, { useState, useCallback, useEffect } from 'react';
import {
  Node,
  Edge,
  applyNodeChanges,
  applyEdgeChanges,
  NodeChange,
  EdgeChange,
  Connection,
} from '@xyflow/react';
import { Plus, Box } from 'lucide-react';

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

  // UI Panels state
  const [isJavaOpen, setIsJavaOpen] = useState(true);
  const [gridType, setGridType] = useState<'dots' | 'lines' | 'cross'>('dots');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Node & Edge callback handlers
  const handleSelectClass = useCallback((id: string) => {
    setSelectedClassId(id);
    setSelectedRelationshipId(null);
  }, []);

  const handleDeleteClass = useCallback((id: string) => {
    setClasses((prev) => prev.filter((c) => c.id !== id));
    setRelationships((prev) => prev.filter((r) => r.source !== id && r.target !== id));
    setSelectedClassId((prev) => (prev === id ? null : prev));
  }, []);

  const handleSelectRelationship = useCallback((id: string) => {
    setSelectedRelationshipId(id);
    setSelectedClassId(null);
  }, []);

  const handleDeleteRelationship = useCallback((id: string) => {
    setRelationships((prev) => prev.filter((r) => r.id !== id));
    setSelectedRelationshipId((prev) => (prev === id ? null : prev));
  }, []);

  // React Flow Elements Synchronization
  const [nodes, setNodes] = useState<Node<UMLClassData>[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

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

  // Handle New Connections
  const onConnect = useCallback(
    (params: Connection) => {
      if (!params.source || !params.target || params.source === params.target) return;

      const targetClass = classes.find((c) => c.id === params.target);
      if (!targetClass) return;

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
        label: defaultType === 'realization' ? 'implements' : defaultType === 'inheritance' ? 'extends' : 'uses',
        sourceMultiplicity: '1',
        targetMultiplicity: '1',
      };

      setRelationships((prev) => [...prev, newRelationship]);
      setSelectedRelationshipId(newRelId);
      setSelectedClassId(null);
    },
    [classes]
  );

  // Add new Class / Type
  const handleAddElement = (stereotype: Stereotype = 'class') => {
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
                type: 'String',
                visibility: 'private',
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
      enumValues: stereotype === 'enum' ? ['ACTIVE', 'INACTIVE'] : undefined,
    };

    const newPos = {
      x: 180 + (classes.length % 3) * 140,
      y: 120 + Math.floor(classes.length / 3) * 120,
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
  };

  // Auto Layout
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
    showToast('Auto layout applied');
  }, [nodes, edges]);

  // Clear all
  const handleClearAll = () => {
    setClasses([]);
    setRelationships([]);
    setSelectedClassId(null);
    setSelectedRelationshipId(null);
    setProject((prev) => ({ ...prev, classes: [], relationships: [], positions: {} }));
  };

  // Load Preset
  const handleLoadPreset = (preset: DiagramProject) => {
    setProject(preset);
    setClasses(preset.classes);
    setRelationships(preset.relationships);
    setProjectName(preset.name);
    setDefaultPackage(preset.packageName);
    setSelectedClassId(null);
    setSelectedRelationshipId(null);
    showToast(`Loaded "${preset.name}"`);
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
    showToast('Exported diagram JSON');
  };

  // Import JSON
  const handleImportJson = async (file: File) => {
    try {
      const text = await file.text();
      const parsed = validateAndParseDiagramJson(text);
      handleLoadPreset(parsed);
    } catch (err: any) {
      alert(`Failed to import JSON: ${err.message}`);
    }
  };

  // Download ZIP
  const handleDownloadZip = () => {
    downloadProjectZip(classes, relationships, projectName, defaultPackage);
    showToast('Exported Java ZIP');
  };

  const handleUpdateClass = (updated: UMLClassData) => {
    setClasses((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  };

  const handleUpdateRelationship = (updated: UMLRelationshipData) => {
    setRelationships((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
  };

  const selectedClass = classes.find((c) => c.id === selectedClassId) || null;
  const selectedRelationship = relationships.find((r) => r.id === selectedRelationshipId) || null;
  const hasSelection = !!selectedClass || !!selectedRelationship;

  return (
    <div className="flex flex-col h-screen w-screen bg-dark-950 text-slate-100 overflow-hidden font-sans">
      {/* 1. Simplified Top Header */}
      <AppHeader
        projectName={projectName}
        onUpdateProjectName={setProjectName}
        onLoadPreset={handleLoadPreset}
        onExportJson={handleExportJson}
        onImportJson={handleImportJson}
        onDownloadZip={handleDownloadZip}
        onNewDiagram={handleClearAll}
        isJavaOpen={isJavaOpen}
        onToggleJava={() => setIsJavaOpen(!isJavaOpen)}
      />

      {/* 2. Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Dominant Visual Canvas */}
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

          {/* Friendly Empty State if no classes */}
          {classes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
              <div className="text-center p-6 rounded-xl bg-dark-900/80 border border-slate-800 pointer-events-auto shadow-2xl max-w-sm">
                <div className="w-10 h-10 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center mx-auto mb-3">
                  <Box className="w-5 h-5" />
                </div>
                <h2 className="text-sm font-semibold text-white mb-1">
                  Start designing your architecture
                </h2>
                <p className="text-xs text-slate-400 mb-4">
                  Create your first class to begin generating your diagram and Java code.
                </p>
                <button
                  onClick={() => handleAddElement('class')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-sm transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Class</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 3. Contextual Inspector (Visible only when element selected) */}
        {hasSelection && (
          <div className="w-72 lg:w-80 shrink-0 h-full bg-dark-900 z-20 shadow-2xl animate-fade-in border-l border-slate-800">
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

        {/* 4. Collapsible Java Code Panel */}
        {isJavaOpen && (
          <div className="w-96 lg:w-[420px] shrink-0 h-full bg-dark-950 z-10 shadow-xl border-l border-slate-800">
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
              onClose={() => setIsJavaOpen(false)}
            />
          </div>
        )}
      </div>

      {/* Floating subtle toast */}
      {toastMessage && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 px-3 py-1.5 rounded-md bg-dark-800 text-slate-200 font-mono text-xs border border-slate-700 shadow-xl animate-fade-in">
          {toastMessage}
        </div>
      )}
    </div>
  );
}

export default App;
