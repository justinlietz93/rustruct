const DEPS = {
  clap:        { line: 'clap = { version = "4", features = ["derive"] }', note: 'parses command-line arguments for you' },
  anyhow:      { line: 'anyhow = "1"', note: 'easy error handling for application code' },
  thiserror:   { line: 'thiserror = "1"', note: 'derive clean custom error types for libraries' },
  serde:       { line: 'serde = { version = "1", features = ["derive"] }', note: 'turn structs into JSON/other formats and back' },
  serde_json:  { line: 'serde_json = "1"', note: 'the JSON format for serde' },
  tokio:       { line: 'tokio = { version = "1", features = ["full"] }', note: 'the async runtime that drives await' },
  axum:        { line: 'axum = "0.7"', note: 'ergonomic async web framework built on tokio' },
  tower:       { line: 'tower = "0.5"', note: 'reusable middleware (timeouts, logging, retries)' },
  sqlx:        { line: 'sqlx = { version = "0.8", features = ["runtime-tokio", "postgres"] }', note: 'compile-time-checked SQL queries' },
  bytes:       { line: 'bytes = "1"', note: 'efficient zero-copy byte buffers for network code' },
  tracing:     { line: 'tracing = "0.1"', note: 'structured logging and diagnostics' },
  ndarray:     { line: 'ndarray = "0.16"', note: 'N-dimensional arrays, the NumPy of Rust' },
  polars:      { line: 'polars = { version = "0.43", features = ["lazy"] }', note: 'fast DataFrames for tabular data' },
  candle:      { line: 'candle-core = "0.7"', note: 'minimalist tensor/ML library' },
  rand:        { line: 'rand = "0.8"', note: 'random number generation' },
  macroquad:   { line: 'macroquad = "0.4"', note: 'tiny cross-platform game/graphics engine' },
  glam:        { line: 'glam = "0.29"', note: 'fast vector/matrix math for games and graphics' },
};

export function renderDeps(keys) {
  if (!keys || keys.length === 0) return '# Add your dependencies here, e.g. serde = "1"\n';
  return keys
    .filter(k => DEPS[k])
    .map(k => `${DEPS[k].line}  # ${DEPS[k].note}`)
    .join('\n') + '\n';
}
