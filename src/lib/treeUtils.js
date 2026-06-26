export function genId() {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `node_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

export function makeFolder(name, children = [], expanded = true) {
  return { id: genId(), name, type: 'folder', expanded, children };
}

export function makeFile(name) {
  return { id: genId(), name, type: 'file' };
}

export function addNode(root, parentId, newNode) {
  if (root.id === parentId) {
    return { ...root, expanded: true, children: [...(root.children || []), newNode] };
  }
  if (!root.children) return root;
  return { ...root, children: root.children.map(c => addNode(c, parentId, newNode)) };
}

export function deleteNode(root, id) {
  if (root.id === id) return null;
  if (!root.children) return root;
  const newChildren = root.children.map(c => deleteNode(c, id)).filter(Boolean);
  return { ...root, children: newChildren };
}

export function renameNode(root, id, newName) {
  if (root.id === id) return { ...root, name: newName };
  if (!root.children) return root;
  return { ...root, children: root.children.map(c => renameNode(c, id, newName)) };
}

export function toggleExpand(root, id) {
  if (root.id === id) return { ...root, expanded: !root.expanded };
  if (!root.children) return root;
  return { ...root, children: root.children.map(c => toggleExpand(c, id)) };
}

export function reorderSiblings(root, parentId, fromIndex, toIndex) {
  if (root.id === parentId && root.children) {
    const newChildren = [...root.children];
    const [moved] = newChildren.splice(fromIndex, 1);
    newChildren.splice(toIndex, 0, moved);
    return { ...root, children: newChildren };
  }
  if (!root.children) return root;
  return { ...root, children: root.children.map(c => reorderSiblings(c, parentId, fromIndex, toIndex)) };
}