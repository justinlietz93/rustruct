import { useState, useRef, useMemo } from 'react';
import { Boxes, Code2, RotateCcw } from 'lucide-react';
import { C } from '@/data/theme';
import { folder, file, addNode, deleteNode, renameNode, toggleExpand, moveNode } from '@/lib/treeUtils';
import { buildTree } from '@/lib/treeBuilder';
import { generateScript } from '@/lib/scriptGenerator';
import TreeNode from '@/components/TreeNode';
import RightPanel from '@/components/RightPanel';
import ExportModal from '@/components/ExportModal';
import Btn from '@/components/ui/Btn';

export default function TreeEditor({ projectData, onReset }) {
  const [tree, setTree] = useState(() => buildTree(projectData));
  const [showExport, setShowExport] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [dragId, setDragId] = useState(null);
  const [drop, setDrop] = useState(null);
  const dropRef = useRef(null);
  dropRef.current = drop;

  const commitMove = () => {
    const d = dropRef.current;
    if (dragId && d && dragId !== d.id) setTree(t => moveNode(t, dragId, d.id, d.position));
    setDragId(null); setDrop(null);
  };
  const drag = { dragId, setDragId, drop, setDrop, commitMove };

  const script = useMemo(() => generateScript(tree, projectData.projectName, projectData.projectType), [tree, projectData]);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: C.bg }}>
      <header className="flex items-center justify-between px-6 py-4" style={{ borderBottom: `1px solid ${C.border}` }}>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2"><Boxes style={{ width: 20, height: 20, color: C.rust }} /><span className="font-bold text-lg" style={{ color: C.rust }}>Rustruct</span></div>
          <span style={{ color: C.dim }}>/</span>
          <span className="font-mono text-sm" style={{ color: C.sub }}>{projectData.projectName}</span>
        </div>
        <div className="flex items-center gap-2">
          <Btn variant="ghost" onClick={onReset}><RotateCcw style={{ width: 14, height: 14 }} />Start over</Btn>
          <Btn variant="primary" onClick={() => setShowExport(true)}><Code2 style={{ width: 15, height: 15 }} />Generate script</Btn>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-auto p-5" onDragOver={e => e.preventDefault()}>
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-sm font-medium" style={{ color: C.sub }}>Project structure</h2>
            <span className="text-xs" style={{ color: C.dim }}>drag to rearrange · double-click to rename · hover for actions · click a file to preview</span>
          </div>
          <TreeNode node={tree} depth={0} parentId={null} index={0} siblingCount={1} drag={drag} sel={selectedId}
            onToggle={id => setTree(t => toggleExpand(t, id))}
            onAdd={(pid, type) => setTree(t => addNode(t, pid, type === 'folder' ? folder('new_folder', []) : file('new_file.rs')))}
            onDelete={id => { setTree(t => deleteNode(t, id)); if (selectedId === id) setSelectedId(null); }}
            onRename={(id, n) => setTree(t => renameNode(t, id, n))}
            onSelect={setSelectedId} />
        </div>
        <RightPanel tree={tree} projectData={projectData} selectedId={selectedId} />
      </div>

      {showExport && <ExportModal script={script} projectName={projectData.projectName} onClose={() => setShowExport(false)} />}
    </div>
  );
}
