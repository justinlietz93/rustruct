# Rustruct

Interactive Rust project scaffolding tool. Answer a few questions, learn the
reasoning behind each choice, start from a domain preset, rearrange the file
tree by hand, and walk away with a single bash script that builds the whole
structure with commented starter files.

Built for people learning Rust: the goal is to make the thought process behind
designing a new project visible, and to cut the friction of going from idea to
a working `cargo build`.

## Run

```bash
npm install
npm run dev
```

Then open the URL Vite prints. Production build is `npm run build`, preview with
`npm run preview`.

No backend, no accounts, no network calls. Everything runs in the browser.

## What it does

1. **Explanatory questionnaire.** Every step carries a tip explaining *why* the
   choice matters, not just what it is. Per-option help on every folder and
   config file.
2. **Domain presets.** On the workspace step, one click lays out a whole crate
   split (Web Service, ML Pipeline, Networking, CLI Suite, Game), wires the
   right dependencies, and picks the matching entry-point template per crate.
3. **Previewable layout presets.** On the `src/` step, preview the exact module
   tree and dependencies a layout adds before applying it.
4. **Drag-and-drop tree.** Reorder and reparent files by dragging. Drop on the
   top/bottom edge of a row to place before/after it, drop on the middle of a
   folder to move inside. A folder cannot be dropped into its own descendant.
5. **Commented boilerplate.** Files marked "has starter" carry real, compilable
   Rust where comments explain each line. Click any file to preview it. The
   exported script writes all of it.

## Project structure

```
src/
  main.jsx                 entry point
  App.jsx                  root state machine: start -> questionnaire -> editor
  index.css                Tailwind directives + base page styling

  data/                    the knowledge the tool encodes
    theme.js               color palette (applied via inline style)
    deps.js                dependency registry: key -> Cargo line + explanation
    templates.js           boilerplate file templates (the commented Rust)
    presets.js             crate presets + src layout presets

  lib/                     pure logic, no UI
    treeUtils.js           tree model + operations (incl. moveNode for drag/drop)
    treeBuilder.js         answers -> file tree
    scriptGenerator.js     file tree -> bash script + per-file content resolution

  components/
    StartScreen.jsx
    Questionnaire.jsx      the multi-step form with tips and stage presets
    TreeEditor.jsx         drag-and-drop orchestration + export
    TreeNode.jsx           one recursive, draggable tree row
    RightPanel.jsx         file preview + project summary
    ExportModal.jsx        script view, copy, download
    ui/
      Btn.jsx
      Tip.jsx
      PresetCard.jsx
      SrcPresetPreview.jsx
```

The split is deliberate: `data/` is *what the tool knows* (presets, templates,
deps), `lib/` is *how it transforms that into output*, and `components/` is
*how a user drives it*. To change behavior you usually touch only `data/`.

## Extending it

**Add a dependency** in `src/data/deps.js`:

```js
reqwest: { line: 'reqwest = "0.12"', note: 'HTTP client' },
```

**Add a boilerplate template** in `src/data/templates.js`. A template is a
function of context returning the file string. Reference it by key from a
preset or attach it to a file node in `treeBuilder.js`.

**Add a crate preset** in `src/data/presets.js` under `CRATE_PRESETS`. Name the
crates, give each a `type`, an entry-point `template`, and a list of `deps`
keys. The questionnaire and tree pick it up automatically.

**Add a src layout preset** under `SRC_PRESETS`: list the `dirs`, the `deps`,
the `mainTemplate`, and any root-level files. It becomes previewable with no
other changes.

## Output

The generated script is idempotent (`mkdir -p`, quoted heredocs) and safe to
read before running. The quoted `'RUSTRUCT_EOF'` terminator keeps `$` and
backticks in the embedded Rust literal, so file contents are written exactly.
