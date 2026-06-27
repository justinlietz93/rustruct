import { useState } from 'react';
import { Copy, Download, Check, X, Code2 } from 'lucide-react';
import { C } from '@/data/theme';
import Btn from '@/components/ui/Btn';

export default function ExportModal({ script, projectName, onClose }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(script); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch (e) {}
  };
  const download = () => {
    const blob = new Blob([script], { type: 'text/x-shellscript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `scaffold_${projectName}.sh`; a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center p-6 z-50" style={{ background: 'rgba(0,0,0,0.6)' }} onClick={onClose}>
      <div className="w-full max-w-3xl rounded-xl flex flex-col" style={{ background: C.panel, border: `1px solid ${C.border}`, maxHeight: '85vh' }} onClick={e => e.stopPropagation()}>
        <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: `1px solid ${C.border}` }}>
          <div className="flex items-center gap-2"><Code2 style={{ width: 17, height: 17, color: C.rust }} /><span className="font-semibold" style={{ color: C.text }}>scaffold_{projectName}.sh</span></div>
          <button onClick={onClose} style={{ color: C.dim }}><X style={{ width: 18, height: 18 }} /></button>
        </div>
        <div className="flex-1 overflow-auto p-4" style={{ background: C.bg }}>
          <pre className="text-xs font-mono leading-relaxed whitespace-pre" style={{ color: C.sub }}>{script}</pre>
        </div>
        <div className="px-5 py-3 flex items-center justify-between" style={{ borderTop: `1px solid ${C.border}` }}>
          <span className="text-xs" style={{ color: C.dim }}>Run with: <span className="font-mono" style={{ color: C.sub }}>bash scaffold_{projectName}.sh</span></span>
          <div className="flex gap-2">
            <Btn variant="ghost" onClick={copy}>{copied ? <Check style={{ width: 15, height: 15, color: C.green }} /> : <Copy style={{ width: 15, height: 15 }} />}{copied ? 'Copied' : 'Copy'}</Btn>
            <Btn variant="primary" onClick={download}><Download style={{ width: 15, height: 15 }} />Download</Btn>
          </div>
        </div>
      </div>
    </div>
  );
}
