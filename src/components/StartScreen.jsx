import { Boxes, GripVertical, Sparkles, ArrowRight, FileCode } from 'lucide-react';
import { C } from '@/data/theme';
import Btn from '@/components/ui/Btn';

export default function StartScreen({ onStart }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: C.bg }}>
      <div className="max-w-lg text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6" style={{ background: C.rustGlow, border: `1px solid ${C.rust}33` }}>
          <Boxes style={{ width: 32, height: 32, color: C.rust }} />
        </div>
        <h1 className="text-3xl font-bold mb-3" style={{ color: C.text }}>Rustruct</h1>
        <p className="mb-2 leading-relaxed" style={{ color: C.sub }}>
          Scaffold a Rust project by answering a few questions. Learn the reasoning behind each choice, start from a preset, then shape the tree by hand.
        </p>
        <p className="mb-8 text-sm" style={{ color: C.dim }}>
          You leave with a single bash script that builds the whole structure, commented starter files included.
        </p>
        <Btn variant="primary" onClick={onStart} style={{ padding: '12px 24px', fontSize: 15 }}>
          Start <ArrowRight style={{ width: 17, height: 17 }} />
        </Btn>
        <div className="flex items-center justify-center gap-5 mt-8 text-xs" style={{ color: C.dim }}>
          <span className="flex items-center gap-1.5"><Sparkles style={{ width: 13, height: 13 }} /> Domain presets</span>
          <span className="flex items-center gap-1.5"><GripVertical style={{ width: 13, height: 13 }} /> Drag-and-drop tree</span>
          <span className="flex items-center gap-1.5"><FileCode style={{ width: 13, height: 13 }} /> Commented boilerplate</span>
        </div>
      </div>
    </div>
  );
}
