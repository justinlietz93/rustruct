import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Check, Plus, X, Terminal, Package, Layers } from 'lucide-react';

const FOLDER_OPTIONS = [
  { id: 'docs', label: 'docs/', desc: 'Documentation' },
  { id: 'examples', label: 'examples/', desc: 'Usage examples' },
  { id: 'tests', label: 'tests/', desc: 'Integration tests' },
  { id: 'benches', label: 'benches/', desc: 'Benchmarks' },
  { id: 'github', label: '.github/', desc: 'CI/CD workflows' },
];

const CONFIG_OPTIONS = [
  { id: 'cargo_toml', label: 'Cargo.toml', desc: 'Package manifest' },
  { id: 'gitignore', label: '.gitignore', desc: 'Git ignore rules' },
  { id: 'readme', label: 'README.md', desc: 'Project readme' },
  { id: 'rust_toolchain', label: 'rust-toolchain.toml', desc: 'Pin Rust version' },
];

const PROJECT_TYPES = [
  { id: 'binary', label: 'Binary', desc: 'CLI tool or application', icon: Terminal },
  { id: 'library', label: 'Library', desc: 'Reusable crate', icon: Package },
  { id: 'workspace', label: 'Workspace', desc: 'Multiple crates', icon: Layers },
];

export default function Questionnaire({ onComplete, onBack }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({
    projectName: '',
    projectType: 'binary',
    crates: [{ name: 'core', type: 'lib' }],
    folders: ['docs', 'tests'],
    configFiles: ['cargo_toml', 'gitignore', 'readme'],
    customSrcDirs: [],
  });
  const [srcDirInput, setSrcDirInput] = useState('');

  const isWorkspace = answers.projectType === 'workspace';
  const steps = [
    { key: 'name', title: 'What is your project name?', subtitle: 'Use snake_case — lowercase letters, numbers, and underscores.' },
    { key: 'type', title: 'What type of Rust project?', subtitle: 'Choose the structure that fits your needs.' },
  ];
  if (isWorkspace) {
    steps.push({ key: 'crates', title: 'Define your workspace crates', subtitle: 'Add each crate and choose if it is a binary or library.' });
  }
  steps.push({ key: 'folders', title: 'Which top-level folders do you need?', subtitle: 'Select the directories to include in your project root.' });
  steps.push({ key: 'config', title: 'Which config files should be included?', subtitle: 'Common Rust project configuration files.' });
  steps.push({ key: 'src', title: 'Any custom src/ subdirectories?', subtitle: 'Add module directories inside src/. Each gets a mod.rs file.' });

  const currentStep = steps[step];
  const isLastStep = step === steps.length - 1;
  const canProceed = currentStep.key === 'name'
    ? /^[a-z][a-z0-9_]*$/.test(answers.projectName)
    : currentStep.key === 'crates'
      ? answers.crates.length > 0 && answers.crates.every(c => /^[a-z][a-z0-9_]*$/.test(c.name))
      : true;

  const update = (key, value) => setAnswers(prev => ({ ...prev, [key]: value }));

  const handleNext = () => {
    if (isLastStep) onComplete(answers);
    else setStep(step + 1);
  };

  const handleBack = () => {
    if (step === 0) onBack();
    else setStep(step - 1);
  };

  const toggleArrayItem = (key, id) => {
    const arr = answers[key];
    update(key, arr.includes(id) ? arr.filter(x => x !== id) : [...arr, id]);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-6 py-4 border-b border-[#1E2130]">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[#CE412B] font-bold text-lg">Rustruct</span>
          <span className="text-sm text-gray-500">Step {step + 1} of {steps.length}</span>
        </div>
        <div className="h-1 bg-[#1E2130] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#CE412B] transition-all duration-300"
            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
          />
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-6 overflow-auto">
        <div className="max-w-2xl w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-2xl font-semibold text-gray-100 mb-2">{currentStep.title}</h2>
              <p className="text-gray-500 mb-8">{currentStep.subtitle}</p>

              {currentStep.key === 'name' && (
                <div>
                  <input
                    type="text"
                    value={answers.projectName}
                    onChange={e => update('projectName', e.target.value)}
                    placeholder="my_awesome_project"
                    autoFocus
                    className="w-full px-4 py-3 bg-[#0F1117] border border-[#1E2130] rounded-lg text-gray-200 font-mono text-lg outline-none focus:border-[#CE412B] transition-colors"
                  />
                  {answers.projectName && !/^[a-z][a-z0-9_]*$/.test(answers.projectName) && (
                    <p className="mt-2 text-sm text-red-400">
                      Use lowercase letters, numbers, and underscores. Must start with a letter.
                    </p>
                  )}
                </div>
              )}

              {currentStep.key === 'type' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {PROJECT_TYPES.map(type => (
                    <button
                      key={type.id}
                      onClick={() => update('projectType', type.id)}
                      className={`p-6 rounded-xl border text-left transition-all ${
                        answers.projectType === type.id
                          ? 'border-[#CE412B] bg-[#CE412B]/10'
                          : 'border-[#1E2130] bg-[#161922] hover:border-[#2A2D3A]'
                      }`}
                    >
                      <type.icon className={`w-8 h-8 mb-3 ${answers.projectType === type.id ? 'text-[#CE412B]' : 'text-gray-500'}`} />
                      <h3 className="font-semibold text-gray-200 mb-1">{type.label}</h3>
                      <p className="text-sm text-gray-500">{type.desc}</p>
                    </button>
                  ))}
                </div>
              )}

              {currentStep.key === 'crates' && (
                <div className="space-y-3">
                  {answers.crates.map((crate, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <input
                        type="text"
                        value={crate.name}
                        onChange={e => {
                          const next = [...answers.crates];
                          next[i] = { ...crate, name: e.target.value };
                          update('crates', next);
                        }}
                        className="flex-1 px-3 py-2 bg-[#0F1117] border border-[#1E2130] rounded-lg text-gray-200 font-mono outline-none focus:border-[#CE412B]"
                      />
                      <select
                        value={crate.type}
                        onChange={e => {
                          const next = [...answers.crates];
                          next[i] = { ...crate, type: e.target.value };
                          update('crates', next);
                        }}
                        className="px-3 py-2 bg-[#0F1117] border border-[#1E2130] rounded-lg text-gray-200 outline-none focus:border-[#CE412B]"
                      >
                        <option value="bin">Binary</option>
                        <option value="lib">Library</option>
                      </select>
                      <button
                        onClick={() => update('crates', answers.crates.filter((_, j) => j !== i))}
                        className="p-2 text-gray-500 hover:text-red-400"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => update('crates', [...answers.crates, { name: `crate_${answers.crates.length + 1}`, type: 'lib' }])}
                    className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-400 hover:text-gray-200 border border-dashed border-[#1E2130] rounded-lg hover:border-[#2A2D3A] transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Crate
                  </button>
                </div>
              )}

              {currentStep.key === 'folders' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {FOLDER_OPTIONS.map(folder => {
                    const checked = answers.folders.includes(folder.id);
                    return (
                      <button
                        key={folder.id}
                        onClick={() => toggleArrayItem('folders', folder.id)}
                        className={`flex items-start gap-3 p-4 rounded-lg border text-left transition-all ${
                          checked ? 'border-[#CE412B] bg-[#CE412B]/10' : 'border-[#1E2130] bg-[#161922] hover:border-[#2A2D3A]'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded border flex items-center justify-center mt-0.5 ${
                          checked ? 'bg-[#CE412B] border-[#CE412B]' : 'border-[#2A2D3A]'
                        }`}>
                          {checked && <Check className="w-3.5 h-3.5 text-white" />}
                        </div>
                        <div>
                          <div className="font-mono text-sm text-gray-200">{folder.label}</div>
                          <div className="text-xs text-gray-500">{folder.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {currentStep.key === 'config' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {CONFIG_OPTIONS.map(cfg => {
                    const checked = answers.configFiles.includes(cfg.id);
                    return (
                      <button
                        key={cfg.id}
                        onClick={() => toggleArrayItem('configFiles', cfg.id)}
                        className={`flex items-start gap-3 p-4 rounded-lg border text-left transition-all ${
                          checked ? 'border-[#CE412B] bg-[#CE412B]/10' : 'border-[#1E2130] bg-[#161922] hover:border-[#2A2D3A]'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded border flex items-center justify-center mt-0.5 ${
                          checked ? 'bg-[#CE412B] border-[#CE412B]' : 'border-[#2A2D3A]'
                        }`}>
                          {checked && <Check className="w-3.5 h-3.5 text-white" />}
                        </div>
                        <div>
                          <div className="font-mono text-sm text-gray-200">{cfg.label}</div>
                          <div className="text-xs text-gray-500">{cfg.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {currentStep.key === 'src' && (
                <div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {answers.customSrcDirs.length === 0 && (
                      <p className="text-sm text-gray-600">No custom directories. Add one below or skip this step.</p>
                    )}
                    {answers.customSrcDirs.map((dir, i) => (
                      <span key={i} className="flex items-center gap-1.5 px-2.5 py-1 bg-[#161922] border border-[#1E2130] rounded text-sm font-mono text-gray-300">
                        {dir}/
                        <button onClick={() => update('customSrcDirs', answers.customSrcDirs.filter((_, j) => j !== i))} className="text-gray-500 hover:text-red-400">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={srcDirInput}
                      onChange={e => setSrcDirInput(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && srcDirInput.trim()) {
                          update('customSrcDirs', [...answers.customSrcDirs, srcDirInput.trim()]);
                          setSrcDirInput('');
                        }
                      }}
                      placeholder="module_name"
                      className="flex-1 px-3 py-2 bg-[#0F1117] border border-[#1E2130] rounded-lg text-gray-200 font-mono outline-none focus:border-[#CE412B]"
                    />
                    <button
                      onClick={() => {
                        if (srcDirInput.trim()) {
                          update('customSrcDirs', [...answers.customSrcDirs, srcDirInput.trim()]);
                          setSrcDirInput('');
                        }
                      }}
                      className="px-4 py-2 border border-[#1E2130] rounded-lg text-gray-300 hover:bg-[#161922] transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <footer className="px-6 py-4 border-t border-[#1E2130] flex items-center justify-between">
        <button
          onClick={handleBack}
          className="flex items-center gap-1.5 px-4 py-2 text-sm text-gray-400 hover:text-gray-200 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          {step === 0 ? 'Cancel' : 'Back'}
        </button>
        <button
          onClick={handleNext}
          disabled={!canProceed}
          className={`flex items-center gap-1.5 px-5 py-2 text-sm font-medium rounded-lg transition-colors ${
            canProceed
              ? 'bg-[#CE412B] hover:bg-[#B33820] text-white'
              : 'bg-[#1E2130] text-gray-600 cursor-not-allowed'
          }`}
        >
          {isLastStep ? 'Build Tree' : 'Next'}
          <ChevronRight className="w-4 h-4" />
        </button>
      </footer>
    </div>
  );
}