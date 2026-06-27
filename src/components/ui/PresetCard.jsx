import { useState } from 'react';
import { Eye, Wand2 } from 'lucide-react';
import { C } from '@/data/theme';
import Btn from '@/components/ui/Btn';

export default function PresetCard({ preset, active, onApply, onPreview, previewing }) {
  const [h, setH] = useState(false);
  const Icon = preset.icon;
  return (
    <div
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      className="rounded-xl p-4 flex flex-col gap-2"
      style={{
        background: active ? C.rustGlow : C.card,
        border: `1px solid ${active ? C.rust : (h ? C.borderHi : C.border)}`,
        transition: 'all .15s',
      }}>
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
             style={{ background: `${preset.accent}1A`, border: `1px solid ${preset.accent}33` }}>
          <Icon style={{ color: preset.accent, width: 18, height: 18 }} />
        </div>
        <div className="font-semibold text-sm" style={{ color: C.text }}>{preset.name}</div>
      </div>
      <p className="text-xs leading-relaxed" style={{ color: C.dim }}>{preset.blurb}</p>
      <div className="flex items-center gap-2 mt-1">
        <Btn variant="primary" onClick={() => onApply(preset)}
             style={{ padding: '5px 12px', fontSize: 12 }}>
          <Wand2 style={{ width: 13, height: 13 }} /> Apply
        </Btn>
        {onPreview && (
          <Btn variant="ghost" onClick={() => onPreview(previewing ? null : preset.id)}
               style={{ padding: '5px 12px', fontSize: 12 }}>
            <Eye style={{ width: 13, height: 13 }} /> {previewing ? 'Hide' : 'Preview'}
          </Btn>
        )}
      </div>
    </div>
  );
}

// Lightweight preview tree for a src preset (no full node objects needed).
