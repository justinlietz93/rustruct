import { useState } from 'react';
import { C } from '@/data/theme';

export default function Btn({ children, onClick, variant = 'ghost', disabled, style, title }) {
  const [h, setH] = useState(false);
  const base = { transition: 'all .15s', cursor: disabled ? 'not-allowed' : 'pointer' };
  const styles = {
    primary: { background: disabled ? C.border : (h ? C.rustDk : C.rust), color: disabled ? C.dim : '#fff' },
    ghost:   { background: h ? C.card : 'transparent', color: h ? C.text : C.sub, border: `1px solid ${C.border}` },
    plain:   { background: 'transparent', color: h ? C.text : C.sub },
  };
  return (
    <button
      title={title}
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg"
      style={{ ...base, ...styles[variant], ...style }}
    >
      {children}
    </button>
  );
}
