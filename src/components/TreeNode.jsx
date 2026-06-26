import { useState } from 'react';
import {
  ChevronRight, ChevronDown, ChevronUp,
  Folder, FolderOpen, File as FileIcon,
  FolderPlus, FilePlus, Trash2,
} from 'lucide-react';

export default function TreeNode({
  node, depth, parentId, index, siblingCount,
  onToggle, onAddChild, onDeleteNode, onRenameNode, onReorder,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(node.name);

  const isFolder = node.type === 'folder';
  const hasChildren = isFolder && node.children && node.children.length > 0;

  const commitRename = () => {
    if (editName.trim()) {
      onRenameNode(node.id, editName.trim());
    } else {
      setEditName(node.name);
    }
    setIsEditing(false);
  };

  return (
    <div>
      <div
        className="group flex items-center gap-1.5 pr-2 py-1 rounded-md hover:bg-[#161922] transition-colors"
        style={{ paddingLeft: `${depth * 20 + 8}px` }}
      >
        {isFolder ? (
          <button
            onClick={() => onToggle(node.id)}
            className="text-gray-500 hover:text-gray-300 transition-colors"
          >
            {node.expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        ) : (
          <span className="w-4" />
        )}

        {isFolder ? (
          node.expanded
            ? <FolderOpen className="w-4 h-4 text-amber-500 flex-shrink-0" />
            : <Folder className="w-4 h-4 text-amber-500 flex-shrink-0" />
        ) : (
          <FileIcon className="w-4 h-4 text-gray-500 flex-shrink-0" />
        )}

        {isEditing ? (
          <input
            value={editName}
            onChange={e => setEditName(e.target.value)}
            onBlur={commitRename}
            onKeyDown={e => {
              if (e.key === 'Enter') commitRename();
              if (e.key === 'Escape') { setEditName(node.name); setIsEditing(false); }
            }}
            className="bg-[#0F1117] border border-[#CE412B] rounded px-1.5 py-0.5 text-sm font-mono text-gray-200 outline-none flex-1 min-w-0"
            autoFocus
          />
        ) : (
          <span
            className="text-sm font-mono text-gray-300 cursor-pointer select-none flex-1 truncate"
            onDoubleClick={() => { setEditName(node.name); setIsEditing(true); }}
          >
            {node.name}
          </span>
        )}

        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          {index > 0 && (
            <button onClick={() => onReorder(parentId, index, index - 1)} className="p-1 text-gray-500 hover:text-gray-300" title="Move up">
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
          )}
          {index < siblingCount - 1 && (
            <button onClick={() => onReorder(parentId, index, index + 1)} className="p-1 text-gray-500 hover:text-gray-300" title="Move down">
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          )}
          {isFolder && (
            <>
              <button onClick={() => onAddChild(node.id, 'folder')} className="p-1 text-gray-500 hover:text-amber-400" title="Add folder">
                <FolderPlus className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => onAddChild(node.id, 'file')} className="p-1 text-gray-500 hover:text-blue-400" title="Add file">
                <FilePlus className="w-3.5 h-3.5" />
              </button>
            </>
          )}
          {!node.isRoot && (
            <button onClick={() => onDeleteNode(node.id)} className="p-1 text-gray-500 hover:text-red-400" title="Delete">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {isFolder && node.expanded && hasChildren && node.children.map((child, i) => (
        <TreeNode
          key={child.id}
          node={child}
          depth={depth + 1}
          parentId={node.id}
          index={i}
          siblingCount={node.children.length}
          onToggle={onToggle}
          onAddChild={onAddChild}
          onDeleteNode={onDeleteNode}
          onRenameNode={onRenameNode}
          onReorder={onReorder}
        />
      ))}
    </div>
  );
}