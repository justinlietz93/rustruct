import { Eye, Folder, File as FileIcon } from 'lucide-react';
import { C } from '@/data/theme';

export default function SrcPresetPreview({ preset }) {
  const rows = [];
  rows.push({ depth: 0, name: 'src/', kind: 'folder' });
  rows.push({ depth: 1, name: preset.mainTemplate === 'lib_root' ? 'lib.rs' : 'main.rs', kind: 'file' });
  (preset.rootFiles || []).forEach(f => rows.push({ depth: 1, name: `${f}.rs`, kind: 'file' }));
  preset.dirs.forEach(d => {
    rows.push({ depth: 1, name: `${d}/`, kind: 'folder' });
    rows.push({ depth: 2, name: 'mod.rs', kind: 'file' });
  });
  return (
    <div className="rounded-lg p-3 mt-1" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
      <div className="text-xs mb-2 flex items-center gap-1.5" style={{ color: C.dim }}>
        <Eye style={{ width: 12, height: 12 }} /> creates {preset.dirs.length} module(s) + {preset.deps.length} dependency line(s)
      </div>
      {rows.map((r, i) => (
        <div key={i} className="flex items-center gap-1.5 text-xs font-mono py-0.5"
             style={{ paddingLeft: r.depth * 16, color: r.kind === 'folder' ? C.amber : C.sub }}>
          {r.kind === 'folder'
            ? <Folder style={{ width: 13, height: 13 }} />
            : <FileIcon style={{ width: 13, height: 13, color: C.dim }} />}
          {r.name}
        </div>
      ))}
      <div className="flex flex-wrap gap-1.5 mt-2 pt-2" style={{ borderTop: `1px solid ${C.border}` }}>
        {preset.deps.map(d => (
          <span key={d} className="text-xs px-2 py-0.5 rounded font-mono"
                style={{ background: C.card, color: C.green, border: `1px solid ${C.border}` }}>{d}</span>
        ))}
      </div>
    </div>
  );
}
