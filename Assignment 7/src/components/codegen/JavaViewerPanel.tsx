import React, { useState, useMemo } from 'react';
import { 
  Copy, 
  Check, 
  Download, 
  FolderArchive, 
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UMLClassData, UMLRelationshipData } from '../../core/types';
import { generateJavaProject } from '../../core/javaGenerator';
import { downloadProjectZip } from '../../core/diagramUtils';

interface JavaViewerPanelProps {
  classes: UMLClassData[];
  relationships: UMLRelationshipData[];
  projectName: string;
  defaultPackage: string;
  selectedClassId: string | null;
  onSelectClass: (classId: string) => void;
  onClose?: () => void;
}

export function JavaViewerPanel({
  classes,
  relationships,
  projectName,
  defaultPackage,
  selectedClassId,
  onSelectClass,
  onClose,
}: JavaViewerPanelProps) {
  const [copied, setCopied] = useState(false);
  const [activeFileName, setActiveFileName] = useState<string | null>(null);

  // Generate Java files
  const javaFiles = useMemo(() => {
    return generateJavaProject(classes, relationships, defaultPackage);
  }, [classes, relationships, defaultPackage]);

  // Sync active file
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

  const displayedCode = activeFile ? activeFile.code : '// Create or select a class to view Java code.';

  const handleCopy = async () => {
    if (!displayedCode) return;
    try {
      await navigator.clipboard.writeText(displayedCode);
      setCopied(true);
      confetti({
        particleCount: 20,
        spread: 35,
        origin: { y: 0.9, x: 0.85 },
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleDownloadZip = () => {
    downloadProjectZip(classes, relationships, projectName, defaultPackage);
  };

  const codeLines = useMemo(() => {
    return displayedCode.split('\n');
  }, [displayedCode]);

  return (
    <div className="h-full flex flex-col bg-[var(--bg-app)] border-l border-[var(--border-color)] text-xs">
      {/* Clean Compact Header */}
      <div className="px-4 py-2.5 bg-[var(--bg-panel)] border-b border-[var(--border-color)] flex items-center justify-between gap-3 select-none">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[var(--text-main)]">Java</span>

          {/* File selector dropdown */}
          {javaFiles.length > 0 && (
            <select
              value={activeFile?.fileName || ''}
              onChange={(e) => {
                setActiveFileName(e.target.value);
                const matchingClass = classes.find((c) => `${c.name}.java` === e.target.value);
                if (matchingClass) onSelectClass(matchingClass.id);
              }}
              className="bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded px-2 py-1 text-[var(--text-main)] font-mono text-xs focus:outline-none focus:border-indigo-500"
            >
              {javaFiles.map((f) => (
                <option key={f.fileName} value={f.fileName}>
                  {f.fileName}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleCopy}
            title="Copy current file"
            className="flex items-center gap-1 px-2 py-1 rounded text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-subtle)] transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={handleDownloadZip}
            title="Download full Java project as ZIP"
            className="flex items-center gap-1 px-2 py-1 rounded text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-subtle)] transition-colors"
          >
            <FolderArchive className="w-3.5 h-3.5" />
            <span>Export Zip</span>
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1 text-[var(--text-muted)] hover:text-[var(--text-main)] rounded hover:bg-[var(--bg-subtle)] ml-1"
              title="Close Java panel"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Code Editor Body */}
      <div className="flex-1 overflow-auto bg-[var(--bg-app)] p-4 font-mono text-xs leading-relaxed select-text">
        <div className="flex">
          {/* Line Numbers */}
          <div className="select-none pr-4 text-right text-[var(--text-muted)] opacity-60 font-mono space-y-0.5 border-r border-[var(--border-color)] shrink-0">
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
    </div>
  );
}

// Clean syntax highlighting supporting both light and dark backgrounds
function highlightJavaSyntax(line: string): React.ReactNode {
  if (line.trim().startsWith('//') || line.trim().startsWith('/*') || line.trim().startsWith('*') || line.trim().startsWith('*/')) {
    return <span className="text-slate-400 dark:text-slate-500 italic">{line}</span>;
  }
  if (line.trim().startsWith('@')) {
    return <span className="text-amber-600 dark:text-amber-400 font-medium">{line}</span>;
  }

  const keywords = [
    'package', 'import', 'public', 'private', 'protected', 'class', 'interface', 'enum',
    'record', 'extends', 'implements', 'return', 'void', 'int', 'boolean', 'double',
    'float', 'long', 'char', 'byte', 'short', 'final', 'static', 'abstract', 'default', 'new', 'this',
    'super', 'null', 'true', 'false', 'throws', 'throw', 'if', 'else', 'for', 'while'
  ];

  const words = line.split(/(\s+|[(){}[\];,.<>:=])/);

  return words.map((token, index) => {
    if (keywords.includes(token)) {
      return (
        <span key={index} className="text-indigo-600 dark:text-indigo-400 font-medium">
          {token}
        </span>
      );
    }
    if (/^[A-Z][a-zA-Z0-9]*$/.test(token)) {
      return (
        <span key={index} className="text-cyan-700 dark:text-cyan-300 font-medium">
          {token}
        </span>
      );
    }
    if (token.startsWith('"') && token.endsWith('"')) {
      return (
        <span key={index} className="text-emerald-600 dark:text-emerald-400">
          {token}
        </span>
      );
    }
    if (/^\d+(\.\d+)?$/.test(token)) {
      return (
        <span key={index} className="text-amber-600 dark:text-amber-300">
          {token}
        </span>
      );
    }
    return <span key={index} className="text-[var(--text-main)]">{token}</span>;
  });
}
