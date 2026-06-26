import { Folder, File as FileIcon } from 'lucide-react';

const CONFIG_LABELS = {
  cargo_toml: 'Cargo.toml',
  gitignore: '.gitignore',
  readme: 'README.md',
  rust_toolchain: 'rust-toolchain.toml',
};

const FOLDER_LABELS = {
  docs: 'docs/',
  examples: 'examples/',
  tests: 'tests/',
  benches: 'benches/',
  github: '.github/',
};

function countNodes(node) {
  let folders = 0, files = 0;
  if (node.type === 'folder') {
    folders = 1;
    (node.children || []).forEach(c => {
      const sub = countNodes(c);
      folders += sub.folders;
      files += sub.files;
    });
  } else {
    files = 1;
  }
  return { folders, files };
}

export default function SummaryPanel({ projectData, tree }) {
  const typeLabel = {
    binary: 'Binary (CLI/App)',
    library: 'Library (Crate)',
    workspace: 'Workspace',
  }[projectData.projectType];

  const counts = countNodes(tree);

  return (
    <aside className="w-72 border-l border-[#1E2130] p-6 space-y-6 hidden lg:block flex-shrink-0">
      <div>
        <h3 className="text-xs uppercase tracking-wider text-gray-600 mb-3">Project Summary</h3>
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Type</span>
            <span className="text-gray-300">{typeLabel}</span>
          </div>
          {projectData.projectType === 'workspace' && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Crates</span>
              <span className="text-gray-300">{projectData.crates.length}</span>
            </div>
          )}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Folders</span>
            <span className="text-gray-300">{counts.folders}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Files</span>
            <span className="text-gray-300">{counts.files}</span>
          </div>
        </div>
      </div>

      {projectData.configFiles.length > 0 && (
        <div>
          <h3 className="text-xs uppercase tracking-wider text-gray-600 mb-3">Config Files</h3>
          <div className="space-y-1.5">
            {projectData.configFiles.map(cf => (
              <div key={cf} className="flex items-center gap-2 text-sm text-gray-400">
                <FileIcon className="w-3.5 h-3.5 text-gray-600 flex-shrink-0" />
                <span className="font-mono">{CONFIG_LABELS[cf]}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {projectData.folders.length > 0 && (
        <div>
          <h3 className="text-xs uppercase tracking-wider text-gray-600 mb-3">Top-level Folders</h3>
          <div className="space-y-1.5">
            {projectData.folders.map(f => (
              <div key={f} className="flex items-center gap-2 text-sm text-gray-400">
                <Folder className="w-3.5 h-3.5 text-gray-600 flex-shrink-0" />
                <span className="font-mono">{FOLDER_LABELS[f]}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {projectData.customSrcDirs.length > 0 && (
        <div>
          <h3 className="text-xs uppercase tracking-wider text-gray-600 mb-3">Custom src/ Modules</h3>
          <div className="space-y-1.5">
            {projectData.customSrcDirs.map(d => (
              <div key={d} className="flex items-center gap-2 text-sm text-gray-400">
                <Folder className="w-3.5 h-3.5 text-gray-600 flex-shrink-0" />
                <span className="font-mono">src/{d}/</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {projectData.projectType === 'workspace' && projectData.crates.length > 0 && (
        <div>
          <h3 className="text-xs uppercase tracking-wider text-gray-600 mb-3">Workspace Crates</h3>
          <div className="space-y-1.5">
            {projectData.crates.map((c, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-gray-400">
                <Folder className="w-3.5 h-3.5 text-gray-600 flex-shrink-0" />
                <span className="font-mono">crates/{c.name}/</span>
                <span className="text-xs text-gray-600 ml-auto">{c.type === 'bin' ? 'bin' : 'lib'}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}