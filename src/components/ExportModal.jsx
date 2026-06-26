import { useState } from 'react';
import { X, Copy, Check, Download } from 'lucide-react';

const COMMANDS = ['mkdir', 'touch', 'cat', 'cd', 'echo', 'set', 'export'];

function renderLine(line) {
  if (line.trim().startsWith('#')) {
    return <span className="text-emerald-700">{line || '\u00A0'}</span>;
  }
  if (line.trim() === 'EOF') {
    return <span className="text-amber-400">{line}</span>;
  }
  const parts = line.split(/(\s+)/);
  return parts.map((part, j) => {
    const trimmed = part.trim();
    if (COMMANDS.includes(trimmed)) {
      return <span key={j} className="text-violet-400">{part}</span>;
    }
    if (part.startsWith('"') || part.startsWith("'")) {
      return <span key={j} className="text-amber-400">{part}</span>;
    }
    if (part.includes('$')) {
      return <span key={j} className="text-cyan-400">{part}</span>;
    }
    return <span key={j} className="text-gray-300">{part}</span>;
  });
}

export default function ExportModal({ script, projectName, onClose }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(script);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = script;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([script], { type: 'text/x-shellscript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `setup_${projectName}.sh`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-[#161922] border border-[#1E2130] rounded-xl max-w-3xl w-full max-h-[80vh] flex flex-col shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E2130]">
          <div>
            <h2 className="text-lg font-semibold text-gray-200">Scaffold Script</h2>
            <p className="text-xs text-gray-500 font-mono">setup_{projectName}.sh</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-300 hover:bg-[#1E2130] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-auto px-6 py-4">
          <pre className="text-xs font-mono leading-relaxed">
            <code>
              {script.split('\n').map((line, i) => (
                <div key={i}>{renderLine(line)}</div>
              ))}
            </code>
          </pre>
        </div>

        <div className="flex items-center gap-3 px-6 py-4 border-t border-[#1E2130]">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 text-sm border border-[#1E2130] rounded-lg hover:bg-[#1E2130] text-gray-300 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-[#CE412B] hover:bg-[#B33820] text-white rounded-lg transition-colors font-medium"
          >
            <Download className="w-4 h-4" />
            Download .sh
          </button>
        </div>
      </div>
    </div>
  );
}