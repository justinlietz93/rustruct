import { useState } from 'react';
import { GripVertical, Trash2, ChevronRight, ChevronDown, Folder, FolderOpen, FolderPlus, FilePlus, File as FileIcon } from 'lucide-react';
import { C } from '@/data/theme';

export default function TreeNode({ node, depth, parentId, index, siblingCount, drag, sel,
  onToggle, onAdd, onDelete, onRename, onSelect }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(node.name);
  const [hover, setHover] = useState(false);

  const isFolder = node.type === 'folder';
  const isDragging = drag.dragId === node.id;
  const isDropTarget = drag.drop && drag.drop.id === node.id;
  const dropPos = isDropTarget ? drag.drop.position : null;
  const isSelected = sel === node.id;

  const commit = () => { onRename(node.id, name.trim() || node.name); setEditing(false); };

  // Decide before / inside / after from cursor position within the row.
  const onDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (drag.dragId === node.id) return;
    const r = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - r.top;
    let position;
    if (isFolder) {
      if (y < r.height * 0.3) position = 'before';
      else if (y > r.height * 0.7) position = 'after';
      else position = 'inside';
    } else {
      position = y < r.height * 0.5 ? 'before' : 'after';
    }
    drag.setDrop({ id: node.id, position });
  };

  const rowBg = isSelected ? C.cardHi : (hover ? C.card : 'transparent');
  const ring = dropPos === 'inside' ? `1px solid ${C.rust}` : '1px solid transparent';

  return (
    <div style={{ opacity: isDragging ? 0.4 : 1 }}>
      {/* insertion indicator above */}
      {dropPos === 'before' && <div style={{ height: 2, background: C.rust, marginLeft: depth * 20 + 8, borderRadius: 2 }} />}
      <div
        draggable={!node.isRoot && !editing}
        onDragStart={e => { e.stopPropagation(); drag.setDragId(node.id); e.dataTransfer.effectAllowed = 'move'; }}
        onDragEnd={() => { drag.setDragId(null); drag.setDrop(null); }}
        onDragOver={onDragOver}
        onDragLeave={e => { e.stopPropagation(); }}
        onDrop={e => { e.preventDefault(); e.stopPropagation(); drag.commitMove(); }}
        onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        onClick={() => !isFolder && onSelect(node.id)}
        className="group flex items-center gap-1.5 pr-2 py-1 rounded-md"
        style={{ paddingLeft: depth * 20 + 8, background: rowBg, border: ring, transition: 'background .1s', cursor: node.isRoot ? 'default' : 'grab' }}>

        {!node.isRoot && (
          <GripVertical style={{ width: 13, height: 13, color: C.dim, opacity: hover ? 0.7 : 0, flexShrink: 0 }} />
        )}

        {isFolder ? (
          <button onClick={e => { e.stopPropagation(); onToggle(node.id); }} style={{ color: C.dim }}>
            {node.expanded ? <ChevronDown style={{ width: 15, height: 15 }} /> : <ChevronRight style={{ width: 15, height: 15 }} />}
          </button>
        ) : <span style={{ width: 15 }} />}

        {isFolder
          ? (node.expanded ? <FolderOpen style={{ width: 15, height: 15, color: C.amber, flexShrink: 0 }} /> : <Folder style={{ width: 15, height: 15, color: C.amber, flexShrink: 0 }} />)
          : <FileIcon style={{ width: 15, height: 15, color: node.template ? C.blue : C.dim, flexShrink: 0 }} />}

        {editing ? (
          <input value={name} autoFocus onChange={e => setName(e.target.value)} onBlur={commit}
            onKeyDown={e => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') { setName(node.name); setEditing(false); } }}
            className="px-1.5 py-0.5 rounded text-sm font-mono outline-none flex-1 min-w-0"
            style={{ background: C.panel, border: `1px solid ${C.rust}`, color: C.text }} />
        ) : (
          <span className="text-sm font-mono select-none flex-1 truncate"
            style={{ color: C.sub }}
            onDoubleClick={e => { e.stopPropagation(); setName(node.name); setEditing(true); }}>
            {node.name}
            {node.template && !isFolder && <span className="ml-2 text-xs" style={{ color: C.dim }}>has starter</span>}
          </span>
        )}

        <div className="flex items-center gap-0.5" style={{ opacity: hover ? 1 : 0, transition: 'opacity .1s' }}>
          {isFolder && (
            <>
              <button onClick={e => { e.stopPropagation(); onAdd(node.id, 'folder'); }} style={{ color: C.dim, padding: 4 }} title="Add folder"><FolderPlus style={{ width: 14, height: 14 }} /></button>
              <button onClick={e => { e.stopPropagation(); onAdd(node.id, 'file'); }} style={{ color: C.dim, padding: 4 }} title="Add file"><FilePlus style={{ width: 14, height: 14 }} /></button>
            </>
          )}
          {!node.isRoot && (
            <button onClick={e => { e.stopPropagation(); onDelete(node.id); }} style={{ color: C.dim, padding: 4 }} title="Delete"><Trash2 style={{ width: 14, height: 14 }} /></button>
          )}
        </div>
      </div>
      {/* insertion indicator below */}
      {dropPos === 'after' && <div style={{ height: 2, background: C.rust, marginLeft: depth * 20 + 8, borderRadius: 2 }} />}

      {isFolder && node.expanded && node.children && node.children.map((child, i) => (
        <TreeNode key={child.id} node={child} depth={depth + 1} parentId={node.id} index={i}
          siblingCount={node.children.length} drag={drag} sel={sel}
          onToggle={onToggle} onAdd={onAdd} onDelete={onDelete} onRename={onRename} onSelect={onSelect} />
      ))}
    </div>
  );
}
