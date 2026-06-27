import { useMemo } from 'react';
import { FileCode } from 'lucide-react';
import { C } from '@/data/theme';
import Tip from '@/components/ui/Tip';
import { findNode, containsId } from '@/lib/treeUtils';
import { contentFor } from '@/lib/scriptGenerator';

function countNodes(node, acc = { files: 0, folders: 0 }) {
  if (node.type === 'file') acc.files++;
  else { if (!node.isRoot) acc.folders++; (node.children || []).forEach(c => countNodes(c, acc)); }
  return acc;
}

function resolveCrateName(tree, targetId) {
  // find the crate name (folder directly under crates/) that contains targetId
  let found = null;
  function walk(node, path) {
    if (!node.children) return;
    for (const c of node.children) {
      const p = path ? `${path}/${c.name}` : c.name;
      if (c.type === 'folder' && path === 'crates' && (c.id === targetId || containsId(c, targetId))) found = c.name;
      walk(c, p);
    }
  }
  walk(tree, '');
  return found;
}

export default function RightPanel({ tree, projectData, selectedId }) {
  const counts = useMemo(() => countNodes(tree), [tree]);
  const selected = selectedId ? findNode(tree, selectedId) : null;
  const crateName = selected ? resolveCrateName(tree, selectedId) : null;
  const content = selected
    ? contentFor(selected, { projectName: projectData.projectName, projectType: projectData.projectType, crateName, deps: selected.deps })
    : null;

  return (
    <div className="w-96 flex-shrink-0 flex flex-col" style={{ borderLeft: `1px solid ${C.border}`, background: C.panel }}>
      {selected ? (
        <>
          <div className="px-4 py-3 flex items-center gap-2" style={{ borderBottom: `1px solid ${C.border}` }}>
            <FileCode style={{ width: 15, height: 15, color: C.blue }} />
            <span className="font-mono text-sm" style={{ color: C.text }}>{selected.name}</span>
          </div>
          <div className="flex-1 overflow-auto p-4">
            {content ? (
              <pre className="text-xs font-mono leading-relaxed whitespace-pre-wrap" style={{ color: C.sub }}>{content}</pre>
            ) : (
              <div className="text-sm" style={{ color: C.dim }}>This file is created empty. Rename it or add a starter by choosing a preset. Files showing “has starter” come with commented boilerplate.</div>
            )}
          </div>
        </>
      ) : (
        <div className="p-5 space-y-5 overflow-auto">
          <div>
            <div className="text-sm font-medium mb-3" style={{ color: C.sub }}>Summary</div>
            <div className="grid grid-cols-2 gap-3">
              <Stat label="Folders" value={counts.folders} color={C.amber} />
              <Stat label="Files" value={counts.files} color={C.blue} />
            </div>
          </div>
          <div className="space-y-1.5 text-sm">
            <Row k="Name" v={projectData.projectName} />
            <Row k="Type" v={projectData.projectType} />
            {projectData.projectType === 'workspace' && <Row k="Crates" v={projectData.crates.length} />}
            {projectData.deps?.length > 0 && <Row k="Dependencies" v={projectData.deps.length} />}
          </div>
          <Tip tone="info">Click any file in the tree to preview its commented starter content. Drag rows to rearrange. Double-click a name to rename.</Tip>
        </div>
      )}
    </div>
  );
}

const Stat = ({ label, value, color }) => (
  <div className="rounded-lg p-3" style={{ background: C.card, border: `1px solid ${C.border}` }}>
    <div className="text-2xl font-semibold" style={{ color }}>{value}</div>
    <div className="text-xs" style={{ color: C.dim }}>{label}</div>
  </div>
);

const Row = ({ k, v }) => (
  <div className="flex items-center justify-between py-1.5" style={{ borderBottom: `1px solid ${C.border}` }}>
    <span style={{ color: C.dim }}>{k}</span>
    <span className="font-mono" style={{ color: C.text }}>{v}</span>
  </div>
);
