import { makeFolder, makeFile } from './treeUtils';

export function buildTree(answers) {
  const { projectName, projectType, crates, folders, configFiles, customSrcDirs } = answers;

  const rootChildren = [];

  if (configFiles.includes('cargo_toml')) rootChildren.push(makeFile('Cargo.toml'));
  if (configFiles.includes('gitignore')) rootChildren.push(makeFile('.gitignore'));
  if (configFiles.includes('readme')) rootChildren.push(makeFile('README.md'));
  if (configFiles.includes('rust_toolchain')) rootChildren.push(makeFile('rust-toolchain.toml'));

  if (projectType === 'binary' || projectType === 'library') {
    const srcChildren = [];
    if (projectType === 'binary') {
      srcChildren.push(makeFile('main.rs'));
    } else {
      srcChildren.push(makeFile('lib.rs'));
    }
    customSrcDirs.forEach(dir => {
      srcChildren.push(makeFolder(dir, [makeFile('mod.rs')]));
    });
    rootChildren.push(makeFolder('src', srcChildren));
  }

  if (projectType === 'workspace') {
    const cratesChildren = crates.map(crate => {
      const crateSrcChildren = crate.type === 'bin'
        ? [makeFile('main.rs')]
        : [makeFile('lib.rs')];
      return makeFolder(crate.name, [
        makeFile('Cargo.toml'),
        makeFolder('src', crateSrcChildren)
      ]);
    });
    rootChildren.push(makeFolder('crates', cratesChildren));
  }

  if (folders.includes('docs')) rootChildren.push(makeFolder('docs', []));
  if (folders.includes('examples')) rootChildren.push(makeFolder('examples', []));
  if (folders.includes('tests')) rootChildren.push(makeFolder('tests', []));
  if (folders.includes('benches')) rootChildren.push(makeFolder('benches', []));
  if (folders.includes('github')) {
    rootChildren.push(makeFolder('.github', [makeFolder('workflows', [makeFile('ci.yml')])]));
  }

  const root = makeFolder(projectName, rootChildren);
  root.isRoot = true;
  return root;
}