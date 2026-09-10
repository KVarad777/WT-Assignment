import React, { useState, useMemo } from 'react';
import { 
  FileCode2, 
  Copy, 
  Check, 
  Download, 
  FolderArchive, 
  ChevronRight, 
  Box, 
  Layers, 
  FileCode, 
  Hash, 
  Sparkles, 
  Layers2,
  Maximize2,
  Minimize2,
  Code
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UMLClassData, UMLRelationshipData } from '../../core/types';
import { generateJavaProject, GeneratedJavaFile } from '../../core/javaGenerator';
import { downloadProjectZip } from '../../core/diagramUtils';

interface JavaViewerPanelProps {
  classes: UMLClassData[];
  relationships: UMLRelationshipData[];
  projectName: string;
  defaultPackage: string;
  selectedClassId: string | null;
  onSelectClass: (classId: string) => void;
}

export function JavaViewerPanel({
  classes,
  relationships,
  projectName,
  defaultPackage,
  selectedClassId,
  onSelectClass,
}: JavaViewerPanelProps) {
  const [copied, setCopied] = useState(false);
  const [activeFileName, setActiveFileName] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'single' | 'consolidated'>('single');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Generate Java files in real-time
  const javaFiles = useMemo(() => {
    return generateJavaProject(classes, relationships, defaultPackage);
  }, [classes, relationships, defaultPackage]);

  // Sync active file with selected node if selected
  const activeFile = useMemo(() => {
    if (selectedClassId) {
      const cls = classes.find((c) => c.id === selectedClassId);
      if (cls) {
        const found = javaFiles.find((f) => f.className === cls.name);
        if (found) return found;
      }
    }
    if (activeFileName) {
      const found = javaFiles.find((f) => f.fileName === activeFileName);
      if (found) return found;
    }
    return javaFiles[0] || null;
  }, [javaFiles, selectedClassId, activeFileName, classes]);

  const displayedCode = useMemo(() => {
    if (viewMode === 'consolidated') {
      return javaFiles
        .map(
          (f) => `// ==========================================\n// FILE: ${f.fileName}\n// PACKAGE: ${f.packageName}\n// ==========================================\n\n${f.code}`
        )
        .join('\n\n\n');
    }
    return activeFile ? activeFile.code : '// No classes created yet.';
  }, [viewMode, javaFiles, activeFile]);

  const handleCopy = async () => {
    if (!displayedCode) return;
    try {
      await navigator.clipboard.writeText(displayedCode);
      setCopied(true);
      confetti({
        particleCount: 25,
        spread: 40,
        origin: { y: 0.9, x: 0.8 },
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleDownloadSingle = () => {
    if (!activeFile) return;
    const blob = new Blob([activeFile.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = activeFile.fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadZip = () => {
    downloadProjectZip(classes, relationships, projectName, defaultPackage);
  };

  // Syntax highlighting line-by-line renderer
  const codeLines = useMemo(() => {
    return displayedCode.split('\n');
  }, [displayedCode]);

  return (
    <div
      className={`h-full flex flex-col bg-dark-950 border-l border-slate-800 transition-all ${
        isFullscreen ? 'fixed inset-4 z-50 rounded-2xl shadow-2xl border-indigo-500/40 ring-2 ring-indigo-500/20' : ''
      }`}
    >
      {/* Top Header & Actions */}
      <div className="p-3 bg-dark-900/90 border-b border-slate-800 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <FileCode2 className="w-4 h-4 text-emerald-400" />
          <span className="font-mono text-xs font-semibold text-white">
            Java Source Generator
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono border border-emerald-500/20">
            Live Sync (Java 17/21)
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* View mode toggle */}
          <div className="flex items-center bg-dark-950 border border-slate-800 rounded-lg p-0.5 text-xs font-mono">
            <button
              onClick={() => setViewMode('single')}
              className={`px-2 py-1 rounded ${
                viewMode === 'single' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Files
            </button>
            <button
              onClick={() => setViewMode('consolidated')}
              className={`px-2 py-1 rounded ${
                viewMode === 'consolidated' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              All Code
            </button>
          </div>

          {/* Copy button */}
          <button
            onClick={handleCopy}
            title="Copy current Java source code"
            className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg bg-dark-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>

          {/* Download Zip */}
          <button
            onClick={handleDownloadZip}
            title="Export complete Java project structure as ZIP archive"
            className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm border border-indigo-400/30 transition-colors"
          >
            <FolderArchive className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export ZIP</span>
          </button>

          {/* Fullscreen toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
            title={isFullscreen ? 'Exit full screen' : 'Expand source viewer'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* File Tabs Bar (when in single file view) */}
      {viewMode === 'single' && (
        <div className="flex items-center gap-1 px-3 py-1.5 bg-dark-900/40 border-b border-slate-800/80 overflow-x-auto">
          {javaFiles.length === 0 ? (
            <span className="text-xs text-slate-500 italic">No files available</span>
          ) : (
            javaFiles.map((file) => {
              const isActive = activeFile?.fileName === file.fileName;
              return (
                <button
                  key={file.fileName}
                  onClick={() => {
                    setActiveFileName(file.fileName);
                    const matchingClass = classes.find((c) => c.name === file.className);
                    if (matchingClass) onSelectClass(matchingClass.id);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono whitespace-nowrap transition-colors border ${
                    isActive
                      ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/40 font-semibold'
                      : 'bg-dark-900/60 text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  {file.isInterface && <Layers className="w-3 h-3 text-cyan-400" />}
                  {file.isAbstract && <FileCode className="w-3 h-3 text-amber-400" />}
                  {file.isEnum && <Hash className="w-3 h-3 text-emerald-400" />}
                  {file.isRecord && <Sparkles className="w-3 h-3 text-pink-400" />}
                  {!file.isInterface && !file.isAbstract && !file.isEnum && !file.isRecord && (
                    <Box className="w-3 h-3 text-indigo-400" />
                  )}
                  <span>{file.fileName}</span>
                </button>
              );
            })
          )}
        </div>
      )}

      {/* Code Display with Line Numbers */}
      <div className="flex-1 overflow-auto bg-dark-950 p-4 font-mono text-xs leading-relaxed">
        <div className="flex select-text">
          {/* Line Numbers */}
          <div className="select-none pr-4 text-right text-slate-600 font-mono space-y-0.5 border-r border-slate-800/60">
            {codeLines.map((_, i) => (
              <div key={i} className="h-5">
                {i + 1}
              </div>
            ))}
          </div>

          {/* Syntax Code Content */}
          <div className="pl-4 flex-1 space-y-0.5 overflow-x-auto">
            {codeLines.map((line, i) => (
              <div key={i} className="h-5 whitespace-pre">
                {highlightJavaSyntax(line)}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Info Bar */}
      <div className="px-4 py-2 bg-dark-900/60 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span>Package: <strong className="text-slate-200">{activeFile?.packageName || defaultPackage}</strong></span>
          <span className="text-slate-600">•</span>
          <span>Lines: <strong className="text-slate-200">{codeLines.length}</strong></span>
        </div>

        {viewMode === 'single' && activeFile && (
          <button
            onClick={handleDownloadSingle}
            className="flex items-center gap-1 text-slate-400 hover:text-indigo-400 transition-colors"
          >
            <Download className="w-3 h-3" />
            <span>Save {activeFile.fileName}</span>
          </button>
        )}
      </div>
    </div>
  );
}

// Lightweight syntax highlight formatter
function highlightJavaSyntax(line: string): React.ReactNode {
  // If comment
  if (line.trim().startsWith('//') || line.trim().startsWith('/*') || line.trim().startsWith('*') || line.trim().startsWith('*/')) {
    return <span className="text-slate-500 italic">{line}</span>;
  }

  // If annotation
  if (line.trim().startsWith('@')) {
    return <span className="text-amber-400 font-semibold">{line}</span>;
  }

  const keywords = [
    'package', 'import', 'public', 'private', 'protected', 'class', 'interface', 'enum',
    'record', 'extends', 'implements', 'return', 'void', 'int', 'boolean', 'double',
    'float', 'long', 'char', 'final', 'static', 'abstract', 'default', 'new', 'this',
    'super', 'null', 'true', 'false', 'throws', 'throw', 'if', 'else', 'for', 'while'
  ];

  const words = line.split(/(\s+|[(){}[\];,.<>:=])/);

  return words.map((token, index) => {
    if (keywords.includes(token)) {
      return (
        <span key={index} className="text-purple-400 font-semibold">
          {token}
        </span>
      );
    }
    if (/^[A-Z][a-zA-Z0-9]*$/.test(token)) {
      return (
        <span key={index} className="text-cyan-300 font-medium">
          {token}
        </span>
      );
    }
    if (token.startsWith('"') && token.endsWith('"')) {
      return (
        <span key={index} className="text-emerald-400">
          {token}
        </span>
      );
    }
    if (/^\d+(\.\d+)?$/.test(token)) {
      return (
        <span key={index} className="text-amber-300">
          {token}
        </span>
      );
    }
    return <span key={index} className="text-slate-200">{token}</span>;
  });
}
