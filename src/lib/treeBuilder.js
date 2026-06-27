import { folder, file } from '@/lib/treeUtils';

export function buildTree(a) {
  const kids = [];

  // Root config files. Cargo.toml template depends on project shape.
  if (a.configFiles.includes('cargo_toml')) {
    const t = a.projectType === 'workspace' ? 'cargo_workspace' : 'cargo_single';
    kids.push(file('Cargo.toml', t, a.deps));
  }
  if (a.configFiles.includes('gitignore'))     kids.push(file('.gitignore', 'gitignore'));
  if (a.configFiles.includes('readme'))        kids.push(file('README.md', 'readme'));
  if (a.configFiles.includes('rust_toolchain'))kids.push(file('rust-toolchain.toml', 'toolchain'));

  if (a.projectType === 'binary' || a.projectType === 'library') {
    const src = [];
    if (a.projectType === 'binary') {
      src.push(file('main.rs', a.mainTemplate || 'main_plain', a.deps));
    } else {
      src.push(file('lib.rs', 'lib_root'));
    }
    // Root-level src files from a submodule preset (e.g. error.rs).
    (a.srcRootFiles || []).forEach(name => {
      if (name === 'error') src.push(file('error.rs', 'error_rs'));
    });
    // Submodule directories, each with an explanatory mod.rs (preset-aware).
    a.customSrcDirs.forEach(dir => {
      let tmpl = 'mod_generic';
      if (a.srcPreset === 'web_handlers' && dir === 'routes')   tmpl = 'routes_rs';
      if (a.srcPreset === 'web_handlers' && dir === 'handlers') tmpl = 'handlers_rs';
      src.push(folder(dir, [file('mod.rs', tmpl === 'mod_generic' ? 'mod_generic' : tmpl)]));
    });
    kids.push(folder('src', src));
  }

  if (a.projectType === 'workspace') {
    const crates = a.crates.map(cr => {
      const entry = cr.type === 'bin'
        ? file('main.rs', cr.template || 'main_plain', cr.deps)
        : file('lib.rs', cr.template || 'lib_root', cr.deps);
      return folder(cr.name, [
        file('Cargo.toml', 'cargo_member', cr.deps),
        folder('src', [entry]),
      ]);
    });
    kids.push(folder('crates', crates));
  }

  if (a.folders.includes('docs'))     kids.push(folder('docs', []));
  if (a.folders.includes('examples')) kids.push(folder('examples', []));
  if (a.folders.includes('tests'))    kids.push(folder('tests', []));
  if (a.folders.includes('benches'))  kids.push(folder('benches', []));
  if (a.folders.includes('github'))   kids.push(folder('.github', [folder('workflows', [file('ci.yml', 'ci_yml')])]));

  const root = folder(a.projectName, kids);
  root.isRoot = true;
  return root;
}
