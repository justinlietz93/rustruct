import { Terminal, Package, Globe, Cpu, Network, Gamepad2 } from 'lucide-react';
import { C } from '@/data/theme';

export const CRATE_PRESETS = [
  {
    id: 'web_app', name: 'Web Service / App', icon: Globe, accent: C.blue,
    blurb: 'A backend split into an HTTP layer, a pure domain layer, and a data layer. The classic shape that keeps business rules independent of the framework.',
    folders: ['tests', 'github'], config: ['cargo_toml', 'gitignore', 'readme'],
    crates: [
      { name: 'api',    type: 'bin', template: 'main_server', deps: ['axum', 'tokio', 'tracing'] },
      { name: 'domain', type: 'lib', template: 'lib_root',    deps: ['serde'] },
      { name: 'db',     type: 'lib', template: 'lib_root',    deps: ['sqlx', 'tokio'] },
      { name: 'shared', type: 'lib', template: 'lib_root',    deps: ['thiserror'] },
    ],
  },
  {
    id: 'ml', name: 'ML Pipeline', icon: Cpu, accent: C.purple,
    blurb: 'Data loading, model definition, and training/inference binaries kept apart so you can swap models without touching your data code.',
    folders: ['examples', 'tests'], config: ['cargo_toml', 'gitignore', 'readme'],
    crates: [
      { name: 'data',      type: 'lib', template: 'lib_root', deps: ['polars', 'serde'] },
      { name: 'model',     type: 'lib', template: 'lib_root', deps: ['ndarray', 'candle'] },
      { name: 'training',  type: 'bin', template: 'main_ml',  deps: ['ndarray', 'rand', 'anyhow'] },
      { name: 'inference', type: 'bin', template: 'main_plain', deps: ['ndarray', 'anyhow'] },
    ],
  },
  {
    id: 'net', name: 'Networking', icon: Network, accent: C.green,
    blurb: 'A server, a client, and a shared protocol crate. The protocol lives in its own library so both ends speak exactly the same language.',
    folders: ['examples', 'tests'], config: ['cargo_toml', 'gitignore', 'readme'],
    crates: [
      { name: 'protocol', type: 'lib', template: 'lib_root',    deps: ['serde', 'bytes'] },
      { name: 'server',   type: 'bin', template: 'main_server', deps: ['tokio', 'bytes', 'tracing'] },
      { name: 'client',   type: 'bin', template: 'main_plain',  deps: ['tokio', 'bytes', 'anyhow'] },
    ],
  },
  {
    id: 'cli_suite', name: 'CLI Suite', icon: Terminal, accent: C.amber,
    blurb: 'A thin command-line front end over a reusable core library, plus shared config. Lets you add a GUI or server later without rewriting logic.',
    folders: ['tests', 'github'], config: ['cargo_toml', 'gitignore', 'readme'],
    crates: [
      { name: 'cli',    type: 'bin', template: 'main_cli', deps: ['clap', 'anyhow'] },
      { name: 'core',   type: 'lib', template: 'lib_root', deps: ['thiserror'] },
      { name: 'config', type: 'lib', template: 'lib_root', deps: ['serde'] },
    ],
  },
  {
    id: 'game', name: 'Game', icon: Gamepad2, accent: C.rust,
    blurb: 'An engine library holding reusable systems and a thin game binary that drives the loop. Standard separation for any interactive project.',
    folders: ['examples'], config: ['cargo_toml', 'gitignore', 'readme'],
    crates: [
      { name: 'engine', type: 'lib', template: 'lib_root',   deps: ['glam'] },
      { name: 'game',   type: 'bin', template: 'main_plain', deps: ['macroquad', 'glam'] },
    ],
  },
];

export const SRC_PRESETS = [
  {
    id: 'web_handlers', name: 'Web handler layout', icon: Globe, accent: C.blue,
    blurb: 'The standard shape of an axum service: routing, handlers, models, and a shared error type.',
    mainTemplate: 'main_server',
    deps: ['axum', 'tokio', 'serde', 'thiserror'],
    dirs: ['routes', 'handlers', 'models'],
    rootFiles: ['error'],
  },
  {
    id: 'cli_layout', name: 'CLI app layout', icon: Terminal, accent: C.amber,
    blurb: 'Commands separated from config and a central error type. Scales cleanly as you add subcommands.',
    mainTemplate: 'main_cli',
    deps: ['clap', 'anyhow', 'thiserror'],
    dirs: ['commands', 'config'],
    rootFiles: ['error'],
  },
  {
    id: 'lib_layout', name: 'Library layout', icon: Package, accent: C.green,
    blurb: 'A clean public-API library: core types, helpers, and one error enum. The submodules stay private behind lib.rs.',
    mainTemplate: 'lib_root',
    deps: ['thiserror'],
    dirs: ['core', 'types', 'utils'],
    rootFiles: ['error'],
  },
  {
    id: 'ml_layout', name: 'ML layout', icon: Cpu, accent: C.purple,
    blurb: 'Stages of a model pipeline as modules: data, model, training, evaluation.',
    mainTemplate: 'main_ml',
    deps: ['ndarray', 'rand', 'anyhow'],
    dirs: ['data', 'model', 'train', 'eval'],
    rootFiles: [],
  },
  {
    id: 'net_layout', name: 'Networking layout', icon: Network, accent: C.rust,
    blurb: 'Protocol, transport, and session split apart so wire-format changes stay contained.',
    mainTemplate: 'main_server',
    deps: ['tokio', 'bytes', 'serde'],
    dirs: ['protocol', 'transport', 'session'],
    rootFiles: ['error'],
  },
];
