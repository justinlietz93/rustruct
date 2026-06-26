import { useState } from 'react';
import { Code2, RotateCcw } from 'lucide-react';
import TreeNode from './TreeNode';
import SummaryPanel from './SummaryPanel';
import ExportModal from './ExportModal';
import { buildTree } from '@/lib/treeBuilder';
import { makeFolder, makeFile, addNode, deleteNode, renameNode, toggleExpand, reorderSiblings } from '@/lib/treeUtils';
import { generateScript } from '@/lib/scriptGenerator';

export default function TreeEditor({ projectData, onReset }) {
  const [tree, setTree] = useState(() => buildTree(projectData));
  const [showExport, setShowExport] = useState(false);

  const handleToggle = id => setTree(t => toggleExpand(t, id));

  const handleAddChild = (parentId, type) => {
    const name = type === 'folder' ? 'new_folder' : 'new_file.rs';
    const newNode = type === 'folder' ? makeFolder(name, []) : makeFile(name);
    setTree(t => addNode(t, parentId, newNode));
  };

  const handleDelete = id => setTree(t => deleteNode(t, id));
  const handleRename = (id, name) => setTree(t => renameNode(t, id, name));
  const handleReorder = (parentId, from, to) => setTree(t => reorderSiblings(t, parentId, from, to));

  const script = generateScript(tree, projectData.projectName, projectData.projectType);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center justify-between px-6 py-4 border-b border-[#1E2130]">
        <div className="flex items-center gap-3">
          <span className="text-[#CE412B] font-bold text-lg">Rustruct</span>
          <span className="text-gray-600">/</span>
          <span className="font-mono text-sm text-gray-400">{projectData.projectName}</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-400 hover:text-gray-200 border border-[#1E2130] rounded-lg hover:bg-[#161922] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Start Over
          </button>
          <button
            onClick={() => setShowExport(true)}
            className="flex items-center gap-1.5 px-4 py-1.5 text-sm text-white bg-[#CE412B] hover:bg-[#B33820] rounded-lg transition-colors font-medium"
          >
            <Code2 className="w-4 h-4" />
            Generate Script
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 p-6 overflow-auto">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-sm font-medium text-gray-400">Project Structure</h2>
            <span className="text-xs text-gray-600">· Double-click to rename · Hover for actions</span>
          </div>
          <TreeNode
            node={tree}
            depth={0}
            parentId={null}
            index={0}
            siblingCount={1}
            onToggle={handleToggle}
            onAddChild={handleAddChild}
            onDeleteNode={handleDelete}
            onRenameNode={handleRename}
            onReorder={handleReorder}
          />
        </div>

        <SummaryPanel projectData={projectData} tree={tree} />
      </div>

      {showExport && (
        <ExportModal
          script={script}
          projectName={projectData.projectName}
          onClose={() => setShowExport(false)}
        />
      )}
    </div>
  );
}