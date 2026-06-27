import { useState } from 'react';
import { Terminal, Package, Layers, Boxes, Check, Plus, X, Sparkles, ChevronRight, ChevronLeft, Folder, FileCode } from 'lucide-react';
import { C } from '@/data/theme';
import { CRATE_PRESETS, SRC_PRESETS } from '@/data/presets';
import Btn from '@/components/ui/Btn';
import Tip from '@/components/ui/Tip';
import PresetCard from '@/components/ui/PresetCard';
import SrcPresetPreview from '@/components/ui/SrcPresetPreview';

const FOLDER_OPTIONS = [
  { id: 'docs',     label: 'docs/',     desc: 'Long-form documentation and design notes', tip: 'For prose docs. API docs are generated separately by `cargo doc`.' },
  { id: 'examples', label: 'examples/', desc: 'Runnable example programs',                tip: 'Each .rs here is buildable with `cargo run --example name`. Great for libraries.' },
  { id: 'tests',    label: 'tests/',    desc: 'Integration tests',                        tip: 'Tests here use your crate like a real user would, from the outside.' },
  { id: 'benches',  label: 'benches/',  desc: 'Performance benchmarks',                   tip: 'Measure speed over time so you notice regressions.' },
  { id: 'github',   label: '.github/',  desc: 'CI workflow (fmt, clippy, test)',          tip: 'Runs checks automatically on every push. Catches mistakes before they merge.' },
];

const CONFIG_OPTIONS = [
  { id: 'cargo_toml',     label: 'Cargo.toml',          desc: 'Package manifest',     tip: 'Required. Names your crate and lists dependencies. Cargo reads this first.', locked: true },
  { id: 'gitignore',      label: '.gitignore',          desc: 'Keep build junk out',  tip: 'Stops target/ from bloating your repo. Strongly recommended.' },
  { id: 'readme',         label: 'README.md',           desc: 'Front page',           tip: 'The first thing anyone reads. Even a few lines helps future-you.' },
  { id: 'rust_toolchain', label: 'rust-toolchain.toml', desc: 'Pin the Rust version', tip: 'Makes builds reproducible across machines. Useful for teams and CI.' },
];

const PROJECT_TYPES = [
  { id: 'binary',    label: 'Binary',    desc: 'A program you run',  icon: Terminal, tip: 'Produces an executable from src/main.rs. Pick this for CLI tools, servers, apps.' },
  { id: 'library',   label: 'Library',   desc: 'Code others import', icon: Package,  tip: 'Produces a reusable crate from src/lib.rs. No main(); other code calls into it.' },
  { id: 'workspace', label: 'Workspace', desc: 'Many crates, one repo', icon: Layers, tip: 'Groups several binaries/libraries that build together. Reach for this once one crate gets crowded.' },
];

export default function Questionnaire({ onComplete, onBack }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({
    projectName: '', projectType: 'binary',
    crates: [{ name: 'app', type: 'bin', template: 'main_plain', deps: [] }],
    cratePreset: null,
    folders: ['tests'], configFiles: ['cargo_toml', 'gitignore', 'readme'],
    customSrcDirs: [], srcPreset: null, srcRootFiles: [], mainTemplate: 'main_plain', deps: [],
  });
  const [srcInput, setSrcInput] = useState('');
  const [preview, setPreview] = useState(null);
  const update = (k, v) => setAnswers(p => ({ ...p, [k]: v }));

  const isWs = answers.projectType === 'workspace';
  const steps = [
    { key: 'name',   title: 'Name your project', sub: 'This becomes your crate name and the root folder.' },
    { key: 'type',   title: 'What are you building?', sub: 'This decides the skeleton: an executable, a library, or a multi-crate workspace.' },
  ];
  if (isWs) steps.push({ key: 'crates', title: 'Lay out your crates', sub: 'Split the work into focused crates. Start from a preset or build the list by hand.' });
  steps.push({ key: 'config',  title: 'Project files', sub: 'The small files at the repo root that configure tooling.' });
  if (!isWs) steps.push({ key: 'src', title: 'Shape your src/', sub: 'How you split modules now sets the grain of the whole codebase. Pick a layout or add modules yourself.' });
  steps.push({ key: 'folders', title: 'Extra top-level folders', sub: 'Optional directories most projects grow into eventually.' });

  const cur = steps[step];
  const isLast = step === steps.length - 1;
  const nameOk = /^[a-z][a-z0-9_]*$/.test(answers.projectName);
  const canProceed =
    cur.key === 'name' ? nameOk
    : cur.key === 'crates' ? answers.crates.length > 0 && answers.crates.every(c => /^[a-z][a-z0-9_]*$/.test(c.name))
    : true;

  const next = () => { if (isLast) onComplete(answers); else { setStep(step + 1); setPreview(null); } };
  const back = () => { if (step === 0) onBack(); else { setStep(step - 1); setPreview(null); } };
  const toggle = (key, id) => {
    const arr = answers[key];
    update(key, arr.includes(id) ? arr.filter(x => x !== id) : [...arr, id]);
  };

  const applyCratePreset = (p) => {
    setAnswers(prev => ({
      ...prev,
      cratePreset: p.id,
      crates: p.crates.map(c => ({ ...c })),
      folders: Array.from(new Set([...prev.folders, ...p.folders])),
      configFiles: Array.from(new Set([...prev.configFiles, ...p.config])),
    }));
  };
  const applySrcPreset = (p) => {
    setAnswers(prev => ({
      ...prev,
      srcPreset: p.id,
      customSrcDirs: [...p.dirs],
      srcRootFiles: [...(p.rootFiles || [])],
      mainTemplate: p.mainTemplate,
      deps: Array.from(new Set([...prev.deps, ...p.deps])),
    }));
    setPreview(null);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: C.bg }}>
      <header className="px-6 py-4" style={{ borderBottom: `1px solid ${C.border}` }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Boxes style={{ width: 20, height: 20, color: C.rust }} />
            <span className="font-bold text-lg" style={{ color: C.rust }}>Rustruct</span>
          </div>
          <span className="text-sm" style={{ color: C.dim }}>Step {step + 1} of {steps.length}</span>
        </div>
        <div className="h-1 rounded-full overflow-hidden" style={{ background: C.border }}>
          <div className="h-full" style={{ width: `${((step + 1) / steps.length) * 100}%`, background: C.rust, transition: 'width .3s' }} />
        </div>
      </header>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-2xl w-full mx-auto">
          <h2 className="text-2xl font-semibold mb-1.5" style={{ color: C.text }}>{cur.title}</h2>
          <p className="mb-5" style={{ color: C.dim }}>{cur.sub}</p>

          {/* NAME */}
          {cur.key === 'name' && (
            <div className="space-y-4">
              <input
                value={answers.projectName} autoFocus
                onChange={e => update('projectName', e.target.value)}
                onKeyDown={e => e.key === 'Enter' && nameOk && next()}
                placeholder="my_awesome_project"
                className="w-full px-4 py-3 rounded-lg font-mono text-lg outline-none"
                style={{ background: C.panel, border: `1px solid ${answers.projectName && !nameOk ? '#ef4444' : C.border}`, color: C.text }}
              />
              {answers.projectName && !nameOk && (
                <p className="text-sm" style={{ color: '#f87171' }}>
                  Must be snake_case: start with a lowercase letter, then lowercase letters, numbers, or underscores.
                </p>
              )}
              <Tip tone="teach">
                Rust crate names use <span className="font-mono">snake_case</span>. The convention exists so crate names map cleanly to import paths: a crate named <span className="font-mono">image_loader</span> is imported as <span className="font-mono">image_loader</span>, no surprises. Avoid hyphens in the code name; you can still publish under a hyphenated alias later.
              </Tip>
            </div>
          )}

          {/* TYPE */}
          {cur.key === 'type' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {PROJECT_TYPES.map(t => {
                  const on = answers.projectType === t.id;
                  return (
                    <button key={t.id} onClick={() => update('projectType', t.id)}
                      className="p-5 rounded-xl text-left"
                      style={{ background: on ? C.rustGlow : C.card, border: `1px solid ${on ? C.rust : C.border}`, transition: 'all .15s' }}>
                      <t.icon style={{ width: 28, height: 28, color: on ? C.rust : C.dim, marginBottom: 10 }} />
                      <div className="font-semibold mb-0.5" style={{ color: C.text }}>{t.label}</div>
                      <div className="text-sm" style={{ color: C.dim }}>{t.desc}</div>
                    </button>
                  );
                })}
              </div>
              <Tip tone="idea">
                {PROJECT_TYPES.find(t => t.id === answers.projectType).tip}
              </Tip>
              <Tip tone="teach">
                Not sure? Most projects start as a <strong style={{ color: C.text }}>Binary</strong>. You can extract a library out of it later when something becomes reusable, and promote to a <strong style={{ color: C.text }}>Workspace</strong> only when a single crate feels crowded. Structure should follow pressure, not precede it.
              </Tip>
            </div>
          )}

          {/* CRATES (workspace) */}
          {cur.key === 'crates' && (
            <div className="space-y-5">
              <div>
                <div className="flex items-center gap-1.5 mb-2 text-sm font-medium" style={{ color: C.sub }}>
                  <Sparkles style={{ width: 15, height: 15, color: C.rust }} /> Presets
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {CRATE_PRESETS.map(p => (
                    <PresetCard key={p.id} preset={p} active={answers.cratePreset === p.id} onApply={applyCratePreset} />
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium" style={{ color: C.sub }}>Crates ({answers.crates.length})</span>
                  {answers.cratePreset && <span className="text-xs" style={{ color: C.dim }}>from “{CRATE_PRESETS.find(p => p.id === answers.cratePreset)?.name}” — edit freely</span>}
                </div>
                <div className="space-y-2">
                  {answers.crates.map((cr, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <FileCode style={{ width: 15, height: 15, color: cr.type === 'bin' ? C.amber : C.blue, flexShrink: 0 }} />
                      <input value={cr.name}
                        onChange={e => { const n = [...answers.crates]; n[i] = { ...cr, name: e.target.value }; update('crates', n); }}
                        className="flex-1 px-3 py-2 rounded-lg font-mono text-sm outline-none"
                        style={{ background: C.panel, border: `1px solid ${C.border}`, color: C.text }} />
                      <select value={cr.type}
                        onChange={e => { const n = [...answers.crates]; const ty = e.target.value; n[i] = { ...cr, type: ty, template: ty === 'bin' ? 'main_plain' : 'lib_root' }; update('crates', n); }}
                        className="px-3 py-2 rounded-lg text-sm outline-none"
                        style={{ background: C.panel, border: `1px solid ${C.border}`, color: C.text }}>
                        <option value="bin">Binary</option>
                        <option value="lib">Library</option>
                      </select>
                      <button onClick={() => update('crates', answers.crates.filter((_, j) => j !== i))}
                        className="p-2" style={{ color: C.dim }} title="Remove crate">
                        <X style={{ width: 15, height: 15 }} />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => update('crates', [...answers.crates, { name: `crate_${answers.crates.length + 1}`, type: 'lib', template: 'lib_root', deps: [] }])}
                    className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg"
                    style={{ color: C.sub, border: `1px dashed ${C.border}` }}>
                    <Plus style={{ width: 15, height: 15 }} /> Add crate
                  </button>
                </div>
              </div>
              <Tip tone="teach">
                A good split has one clear job per crate. The common pattern is a thin binary (wiring, I/O) sitting on top of pure library crates (the actual logic). That keeps your core testable and reusable, and lets you add a second front end later without rewriting anything.
              </Tip>
            </div>
          )}

          {/* CONFIG */}
          {cur.key === 'config' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {CONFIG_OPTIONS.map(cfg => {
                  const on = answers.configFiles.includes(cfg.id);
                  return (
                    <button key={cfg.id}
                      onClick={() => !cfg.locked && toggle('configFiles', cfg.id)}
                      className="flex items-start gap-3 p-4 rounded-lg text-left"
                      style={{ background: on ? C.rustGlow : C.card, border: `1px solid ${on ? C.rust : C.border}`, cursor: cfg.locked ? 'default' : 'pointer', opacity: cfg.locked ? 0.95 : 1 }}>
                      <div className="w-5 h-5 rounded flex items-center justify-center mt-0.5 flex-shrink-0"
                           style={{ background: on ? C.rust : 'transparent', border: `1px solid ${on ? C.rust : C.borderHi}` }}>
                        {on && <Check style={{ width: 13, height: 13, color: '#fff' }} />}
                      </div>
                      <div>
                        <div className="font-mono text-sm flex items-center gap-1.5" style={{ color: C.text }}>
                          {cfg.label}{cfg.locked && <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: C.border, color: C.dim }}>required</span>}
                        </div>
                        <div className="text-xs mt-0.5" style={{ color: C.dim }}>{cfg.tip}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* SRC (binary/library) */}
          {cur.key === 'src' && (
            <div className="space-y-5">
              <div>
                <div className="flex items-center gap-1.5 mb-2 text-sm font-medium" style={{ color: C.sub }}>
                  <Sparkles style={{ width: 15, height: 15, color: C.rust }} /> Layout presets
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {SRC_PRESETS.map(p => (
                    <div key={p.id}>
                      <PresetCard preset={p} active={answers.srcPreset === p.id}
                        onApply={applySrcPreset} onPreview={setPreview} previewing={preview === p.id} />
                      {preview === p.id && <SrcPresetPreview preset={p} />}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium" style={{ color: C.sub }}>Modules in src/</span>
                  {answers.srcPreset && <span className="text-xs" style={{ color: C.dim }}>from “{SRC_PRESETS.find(p => p.id === answers.srcPreset)?.name}”</span>}
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {answers.customSrcDirs.length === 0 && <p className="text-sm" style={{ color: C.dim }}>No modules yet. Apply a preset or add one below.</p>}
                  {answers.customSrcDirs.map((d, i) => (
                    <span key={i} className="flex items-center gap-1.5 px-2.5 py-1 rounded text-sm font-mono"
                          style={{ background: C.card, border: `1px solid ${C.border}`, color: C.sub }}>
                      <Folder style={{ width: 13, height: 13, color: C.amber }} />{d}/
                      <button onClick={() => update('customSrcDirs', answers.customSrcDirs.filter((_, j) => j !== i))} style={{ color: C.dim }}>
                        <X style={{ width: 12, height: 12 }} />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input value={srcInput} onChange={e => setSrcInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && srcInput.trim()) { update('customSrcDirs', [...answers.customSrcDirs, srcInput.trim()]); setSrcInput(''); } }}
                    placeholder="module_name"
                    className="flex-1 px-3 py-2 rounded-lg font-mono text-sm outline-none"
                    style={{ background: C.panel, border: `1px solid ${C.border}`, color: C.text }} />
                  <Btn variant="ghost" onClick={() => { if (srcInput.trim()) { update('customSrcDirs', [...answers.customSrcDirs, srcInput.trim()]); setSrcInput(''); } }}>Add</Btn>
                </div>
              </div>
              <Tip tone="teach">
                Each module directory gets a <span className="font-mono">mod.rs</span> that acts as its front door. The point of splitting early is not tidiness, it is dependency control: code in <span className="font-mono">handlers/</span> can lean on <span className="font-mono">models/</span> without <span className="font-mono">models/</span> ever knowing handlers exist. That one-directional flow is what keeps a codebase from turning into a knot.
              </Tip>
            </div>
          )}

          {/* FOLDERS */}
          {cur.key === 'folders' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {FOLDER_OPTIONS.map(f => {
                  const on = answers.folders.includes(f.id);
                  return (
                    <button key={f.id} onClick={() => toggle('folders', f.id)}
                      className="flex items-start gap-3 p-4 rounded-lg text-left"
                      style={{ background: on ? C.rustGlow : C.card, border: `1px solid ${on ? C.rust : C.border}` }}>
                      <div className="w-5 h-5 rounded flex items-center justify-center mt-0.5 flex-shrink-0"
                           style={{ background: on ? C.rust : 'transparent', border: `1px solid ${on ? C.rust : C.borderHi}` }}>
                        {on && <Check style={{ width: 13, height: 13, color: '#fff' }} />}
                      </div>
                      <div>
                        <div className="font-mono text-sm" style={{ color: C.text }}>{f.label}</div>
                        <div className="text-xs mt-0.5" style={{ color: C.dim }}>{f.tip}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
              <Tip tone="idea">
                Add these lazily. An empty <span className="font-mono">benches/</span> you never fill is just noise. The two with the best payoff early are <span className="font-mono">tests/</span> and <span className="font-mono">.github/</span>: they catch breakage the moment it happens.
              </Tip>
            </div>
          )}
        </div>
      </div>

      <footer className="px-6 py-4 flex items-center justify-between" style={{ borderTop: `1px solid ${C.border}` }}>
        <Btn variant="plain" onClick={back}><ChevronLeft style={{ width: 16, height: 16 }} />{step === 0 ? 'Cancel' : 'Back'}</Btn>
        <Btn variant="primary" onClick={next} disabled={!canProceed}>
          {isLast ? 'Build structure' : 'Next'} <ChevronRight style={{ width: 16, height: 16 }} />
        </Btn>
      </footer>
    </div>
  );
}
