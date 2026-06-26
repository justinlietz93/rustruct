function getFileContent(filename, projectName, projectType, crateName, path) {
  if (filename === 'Cargo.toml') {
    if (projectType === 'workspace' && !crateName) {
      return `[workspace]\nresolver = "2"\nmembers = [\n  "crates/*",\n]\n\n[workspace.package]\nedition = "2021"\nversion = "0.1.0"\n`;
    }
    const name = crateName || projectName;
    return `[package]\nname = "${name}"\nedition = "2021"\nversion = "0.1.0"\n\n[dependencies]\n`;
  }

  const map = {
    '.gitignore': `/target\nCargo.lock\n`,
    'README.md': `# ${projectName}\n\nA Rust project.\n`,
    'rust-toolchain.toml': `[toolchain]\nchannel = "stable"\n`,
    'main.rs': `fn main() {\n    println!("Hello from ${crateName || projectName}!");\n}\n`,
    'lib.rs': `//! ${crateName || projectName} library\n`,
    'ci.yml': `name: CI\n\non:\n  push:\n    branches: [main]\n  pull_request:\n\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: dtolnay/rust-toolchain@stable\n      - run: cargo fmt --all -- --check\n      - run: cargo clippy -- -D warnings\n      - run: cargo test\n`,
  };

  if (filename === 'mod.rs') {
    const parts = path.split('/');
    const parent = parts[parts.length - 2] || 'module';
    return `//! ${parent} module\n`;
  }

  return map[filename] || null;
}

export function generateScript(tree, projectName, projectType) {
  const lines = [
    '#!/usr/bin/env bash',
    'set -euo pipefail',
    '',
    '# Rustruct - Rust project scaffold',
    `# Project: ${projectName}`,
    `# Type: ${projectType}`,
    '',
    `PROJECT_NAME="${projectName}"`,
    '',
    '# Create root directory',
    `mkdir -p "$PROJECT_NAME"`,
    `cd "$PROJECT_NAME"`,
    '',
  ];

  const folders = [];
  const files = [];

  function walk(node, path, crateName) {
    if (!node.children) return;
    for (const child of node.children) {
      const childPath = path ? `${path}/${child.name}` : child.name;
      let childCrateName = crateName;

      if (child.type === 'folder') {
        folders.push(childPath);
        if (path === 'crates') {
          childCrateName = child.name;
        }
        walk(child, childPath, childCrateName);
      } else {
        const content = getFileContent(child.name, projectName, projectType, crateName, childPath);
        files.push({ path: childPath, content });
      }
    }
  }

  walk(tree, '', null);

  if (folders.length > 0) {
    lines.push('# Create directories');
    folders.forEach(f => lines.push(`mkdir -p "${f}"`));
    lines.push('');
  }

  if (files.length > 0) {
    lines.push('# Create files');
    files.forEach(f => {
      if (f.content !== null && f.content !== undefined) {
        lines.push(`cat << 'EOF' > "${f.path}"`);
        lines.push(f.content.replace(/\n$/, ''));
        lines.push('EOF');
      } else {
        lines.push(`touch "${f.path}"`);
      }
    });
  }

  lines.push('');
  lines.push('echo "✓ Project structure created successfully!"');
  lines.push(`echo "Run 'cargo build' to verify the setup."`);

  return lines.join('\n');
}