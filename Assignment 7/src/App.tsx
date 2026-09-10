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
import { ContextMenu, ContextMenuPosition } from './components/canvas/ContextMenu';
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

  // Context menu state (Right-click)
  const [contextMenu, setContextMenu] = useState<ContextMenuPosition | null>(null);

  // Layout View Modes (Split, Diagram Focus, Code Focus)
  const [splitViewRatio, setSplitViewRatio] = useState<'split' | 'canvas-focus' | 'code-focus'>('split');
  const [gridType, setGridType] = useState<'dots' | 'lines' | 'cross'>('dots');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Synchronize HTML theme class
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [theme]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Node & Edge callback handlers
  const handleSelectClass = useCallback((id: string) => {
    setSelectedClassId(id);
    setSelectedRelationshipId(null);
    setContextMenu(null);
  }, []);

  const handleDeleteClass = useCallback((id: string) => {
    setClasses((prev) => prev.filter((c) => c.id !== id));
    setRelationships((prev) => prev.filter((r) => r.source !== id && r.target !== id));
    setSelectedClassId((prev) => (prev === id ? null : prev));
    setContextMenu(null);
    showToast('Class removed');
  }, []);

  const handleSelectRelationship = useCallback((id: string) => {
    setSelectedRelationshipId(id);
    setSelectedClassId(null);
    setContextMenu(null);
  }, []);

  const handleDeleteRelationship = useCallback((id: string) => {
    setRelationships((prev) => prev.filter((r) => r.id !== id));
    setSelectedRelationshipId((prev) => (prev === id ? null : prev));
    showToast('Relationship removed');
  }, []);

  // Quick action helpers for Context Menu
  const handleAddAttribute = useCallback((id: string) => {
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
    showToast('Attribute added');
  }, []);

  const handleAddMethod = useCallback((id: string) => {
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
    showToast('Method added');
  }, []);

  const handleDuplicateClass = useCallback((id: string) => {
    const target = classes.find((c) => c.id === id);
    if (!target) return;

    const newId = `class-${Date.now()}`;
    const duplicated: UMLClassData = {
      ...target,
      id: newId,
      name: `${target.name}Copy`,
      attributes: target.attributes?.map((a) => ({ ...a, id: `attr-${Date.now()}-${Math.random().toString(36).substr(2, 3)}` })) || [],
      methods: target.methods?.map((m) => ({ ...m, id: `m-${Date.now()}-${Math.random().toString(36).substr(2, 3)}` })) || [],
    };

    setClasses((prev) => [...prev, duplicated]);
    setSelectedClassId(newId);
    showToast(`Duplicated ${target.name}`);
  }, [classes]);

  const handleChangeStereotype = useCallback((id: string, stereotype: Stereotype) => {
    setClasses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, stereotype } : c))
    );
    showToast(`Changed kind to ${stereotype}`);
  }, []);

  // Handle Right-click Context Menu on Node
  const onNodeContextMenu = useCallback(
    (event: React.MouseEvent, node: Node) => {
      event.preventDefault();
      event.stopPropagation();
      setContextMenu({
        x: event.clientX,
        y: event.clientY,
        classId: node.id,
      });
      setSelectedClassId(node.id);
      setSelectedRelationshipId(null);
    },
    []
  );

  // React Flow Elements Synchronization
  const [nodes, setNodes] = useState<Node<UMLClassData>[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  useEffect(() => {
    const { nodes: flowNodes, edges: flowEdges } = classesAndRelsToFlowElements(
      classes,
      relationships,
      project.positions
    );

    const enrichedNodes = flowNodes.map((n) => ({
      ...n,
      selected: n.id === selectedClassId,
      data: {
        ...n.data,
        onSelectClass: handleSelectClass,
        onDeleteClass: handleDeleteClass,
      },
    }));

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

  const onNodesChange = useCallback(
    (changes: NodeChange<Node<UMLClassData>>[]) => {
      setNodes((nds) => applyNodeChanges(changes, nds));
    },
    []
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange<Edge>[]) => {
      setEdges((eds) => applyEdgeChanges(changes, eds));
    },
    []
  );

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
      x: 140 + (classes.length % 3) * 120,
      y: 100 + Math.floor(classes.length / 3) * 120,
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

  const handleClearAll = () => {
    setClasses([]);
    setRelationships([]);
    setSelectedClassId(null);
    setSelectedRelationshipId(null);
    setProject((prev) => ({ ...prev, classes: [], relationships: [], positions: {} }));
  };

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
    showToast('Saved diagram JSON');
  };

  const handleImportJson = async (file: File) => {
    try {
      const text = await file.text();
      const parsed = validateAndParseDiagramJson(text);
      handleLoadPreset(parsed);
    } catch (err: any) {
      alert(`Failed to import JSON: ${err.message}`);
    }
  };

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
  const contextClass = classes.find((c) => c.id === contextMenu?.classId);

  const canvasWidthClass = 
    splitViewRatio === 'canvas-focus' 
      ? 'w-full lg:w-[75%]' 
      : splitViewRatio === 'code-focus' 
      ? 'w-full lg:w-[40%]' 
      : 'w-full lg:w-[58%]';

  const javaWidthClass = 
    splitViewRatio === 'canvas-focus' 
      ? 'w-full lg:w-[25%]' 
      : splitViewRatio === 'code-focus' 
      ? 'w-full lg:w-[60%]' 
      : 'w-full lg:w-[42%]';

  return (
    <div className="flex flex-col h-screen w-screen bg-[var(--bg-app)] text-[var(--text-main)] overflow-hidden font-sans transition-colors">
      {/* 1. Header */}
      <AppHeader
        projectName={projectName}
        onUpdateProjectName={setProjectName}
        onLoadPreset={handleLoadPreset}
        onExportJson={handleExportJson}
        onImportJson={handleImportJson}
        onDownloadZip={handleDownloadZip}
        onNewDiagram={handleClearAll}
        splitViewRatio={splitViewRatio}
        onChangeSplitViewRatio={setSplitViewRatio}
        theme={theme}
        onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      />

      {/* 2. Side-by-Side Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left: Movable UML Canvas */}
        <div className={`${canvasWidthClass} h-full relative transition-all duration-200 border-r border-[var(--border-color)]`}>
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
              setContextMenu(null);
            }}
            onSelectEdge={(edgeId) => {
              setSelectedRelationshipId(edgeId);
              setSelectedClassId(null);
              setContextMenu(null);
            }}
            onNodeContextMenu={onNodeContextMenu}
            selectedNodeId={selectedClassId}
            selectedEdgeId={selectedRelationshipId}
            gridType={gridType}
            onToggleGrid={() => {
              setGridType((g) => (g === 'dots' ? 'lines' : g === 'lines' ? 'cross' : 'dots'));
            }}
            theme={theme}
          />

          {/* Empty state prompt */}
          {classes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
              <div className="text-center p-6 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-color)] pointer-events-auto shadow-2xl max-w-xs">
                <div className="w-9 h-9 rounded bg-indigo-600/20 text-indigo-500 border border-indigo-500/30 flex items-center justify-center mx-auto mb-2.5">
                  <Box className="w-4 h-4" />
                </div>
                <h2 className="text-xs font-semibold text-[var(--text-main)] mb-1">
                  Start designing your architecture
                </h2>
                <p className="text-[11px] text-[var(--text-muted)] mb-3">
                  Create a class or load a preset to generate live Java code.
                </p>
                <button
                  onClick={() => handleAddElement('class')}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-sm transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Class</span>
                </button>
              </div>
            </div>
          )}

          {/* Right-click Context Menu */}
          {contextMenu && (
            <ContextMenu
              position={contextMenu}
              classData={contextClass}
              onClose={() => setContextMenu(null)}
              onEdit={(id) => setSelectedClassId(id)}
              onAddAttribute={handleAddAttribute}
              onAddMethod={handleAddMethod}
              onDuplicate={handleDuplicateClass}
              onChangeStereotype={handleChangeStereotype}
              onDelete={handleDeleteClass}
            />
          )}

          {/* Contextual Slide-over Inspector */}
          {hasSelection && (
            <div className="absolute top-3 right-3 bottom-3 w-72 lg:w-80 bg-[var(--bg-panel)] rounded-xl border border-[var(--border-color)] z-30 shadow-2xl overflow-hidden animate-fade-in flex flex-col">
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
        </div>

        {/* Right: Generated Java Source Output */}
        <div className={`${javaWidthClass} h-full bg-[var(--bg-app)] transition-all duration-200`}>
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
      </div>

      {/* Floating subtle toast */}
      {toastMessage && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 px-3 py-1 rounded bg-[var(--bg-panel)] text-[var(--text-main)] font-mono text-xs border border-[var(--border-color)] shadow-xl animate-fade-in">
          {toastMessage}
        </div>
      )}
    </div>
  );
}

export default App;
