function genId() {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `n_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

export const folder = (name, children = [], expanded = true) => ({ id: genId(), name, type: 'folder', expanded, children });

export const file = (name, template = null, deps = null) => ({ id: genId(), name, type: 'file', template, deps });

export function findNode(node, id) {
  if (node.id === id) return node;
  if (!node.children) return null;
  for (const c of node.children) {
    const f = findNode(c, id);
    if (f) return f;
  }
  return null;
}

export function containsId(node, id) {
  if (!node.children) return false;
  return node.children.some(c => c.id === id || containsId(c, id));
}

export function addNode(root, parentId, newNode) {
  if (root.id === parentId) return { ...root, expanded: true, children: [...(root.children || []), newNode] };
  if (!root.children) return root;
  return { ...root, children: root.children.map(c => addNode(c, parentId, newNode)) };
}

export function deleteNode(root, id) {
  if (root.id === id) return null;
  if (!root.children) return root;
  return { ...root, children: root.children.map(c => deleteNode(c, id)).filter(Boolean) };
}

export function renameNode(root, id, name) {
  if (root.id === id) return { ...root, name };
  if (!root.children) return root;
  return { ...root, children: root.children.map(c => renameNode(c, id, name)) };
}

export function toggleExpand(root, id) {
  if (root.id === id) return { ...root, expanded: !root.expanded };
  if (!root.children) return root;
  return { ...root, children: root.children.map(c => toggleExpand(c, id)) };
}

// Remove a node anywhere in the tree, returning [newTree, removedNode].

function pruneNode(node, id) {
  if (!node.children) return [node, null];
  let removed = null;
  const children = [];
  for (const c of node.children) {
    if (c.id === id) { removed = c; continue; }
    const [nc, r] = pruneNode(c, id);
    if (r) removed = r;
    children.push(nc);
  }
  return [{ ...node, children }, removed];
}
// Insert payload relative to targetId. position: 'inside' | 'before' | 'after'.

function insertRelative(node, targetId, position, payload) {
  if (!node.children) return node;
  const idx = node.children.findIndex(c => c.id === targetId);
  if (idx !== -1) {
    if (position === 'inside') {
      return {
        ...node,
        children: node.children.map(c =>
          c.id === targetId && c.type === 'folder'
            ? { ...c, expanded: true, children: [...(c.children || []), payload] }
            : c
        ),
      };
    }
    const at = position === 'before' ? idx : idx + 1;
    const next = [...node.children];
    next.splice(at, 0, payload);
    return { ...node, children: next };
  }
  return { ...node, children: node.children.map(c => insertRelative(c, targetId, position, payload)) };
}
// The drag-and-drop core. Guards against dropping a folder into its own subtree.

export function moveNode(tree, dragId, targetId, position) {
  if (dragId === targetId) return tree;
  const dragged = findNode(tree, dragId);
  if (!dragged) return tree;
  if (dragged.type === 'folder' && containsId(dragged, targetId)) return tree; // cycle guard
  const target = findNode(tree, targetId);
  let pos = position;
  // The root has no parent, so before/after it is meaningless. Land inside.
  if (target && target.isRoot) pos = 'inside';
  if (pos === 'inside' && (!target || target.type !== 'folder')) pos = 'after';
  const [pruned, removed] = pruneNode(tree, dragId);
  if (!removed) return tree;
  return insertRelative(pruned, targetId, pos, removed);
}
