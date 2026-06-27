import { Lightbulb, Info, BookOpen } from 'lucide-react';
import { C } from '@/data/theme';

export default function Tip({ children, tone = 'info' }) {
  const map = {
    info:   { c: C.blue,  Icon: Info },
    idea:   { c: C.amber, Icon: Lightbulb },
    teach:  { c: C.green, Icon: BookOpen },
  }[tone];
  return (
    <div className="flex gap-2.5 p-3 rounded-lg text-sm leading-relaxed"
         style={{ background: C.card, border: `1px solid ${C.border}` }}>
      <map.Icon className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: map.c }} />
      <div style={{ color: C.sub }}>{children}</div>
    </div>
  );
}
