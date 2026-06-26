import { Package, ListChecks, GitBranch, ArrowRight } from 'lucide-react';

export default function StartScreen({ onStart }) {
  const steps = [
    { icon: ListChecks, title: 'Plan', desc: 'Answer a guided questionnaire about your Rust project' },
    { icon: Package, title: 'Visualize', desc: 'Inspect and edit the folder tree in real time' },
    { icon: GitBranch, title: 'Export', desc: 'Generate a bash script that scaffolds everything' },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-16">
      <div className="max-w-2xl w-full text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#1E2130] bg-[#161922] text-xs text-gray-400 mb-8">
          <span className="w-2 h-2 rounded-full bg-[#CE412B]" />
          Rust project scaffolding tool
        </div>
        <h1 className="text-6xl font-bold tracking-tight mb-4">
          <span className="text-[#CE412B]">R</span>ustruct
        </h1>
        <p className="text-lg text-gray-400 mb-12">
          Plan, visualize, and scaffold your Rust project structure in three simple steps.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {steps.map((step, i) => (
            <div key={i} className="p-5 rounded-xl border border-[#1E2130] bg-[#161922] text-left">
              <step.icon className="w-6 h-6 text-[#CE412B] mb-3" />
              <div className="text-sm text-gray-500 mb-1">Step {i + 1}</div>
              <h3 className="font-semibold text-gray-200 mb-1">{step.title}</h3>
              <p className="text-sm text-gray-500">{step.desc}</p>
            </div>
          ))}
        </div>
        <button
          onClick={onStart}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#CE412B] hover:bg-[#B33820] text-white font-medium transition-colors"
        >
          New Project
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}