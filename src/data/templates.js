import { renderDeps } from '@/data/deps';

const TEMPLATES = {
  // ---- Cargo manifests ----
  cargo_workspace: () =>
`# Workspace root manifest.
# A workspace groups several crates that share one target/ folder and one
# Cargo.lock. You build them all together with a single \`cargo build\`.
[workspace]
resolver = "2"            # the modern dependency resolver; always use "2"
members = [
    "crates/*",           # every folder under crates/ is a member crate
]

# Settings here are inherited by member crates that opt in with
# \`edition.workspace = true\` etc. Define versions once, reuse everywhere.
[workspace.package]
edition = "2021"
version = "0.1.0"

[workspace.dependencies]
# Declare shared dependency versions once. A member crate then writes
# \`serde = { workspace = true }\` to use the pinned version.
`,

  cargo_member: (ctx) =>
`# Manifest for the \`${ctx.crateName}\` crate.
[package]
name = "${ctx.crateName}"
edition = "2021"
version = "0.1.0"

[dependencies]
${renderDeps(ctx.deps)}`,

  cargo_single: (ctx) =>
`[package]
name = "${ctx.projectName}"
edition = "2021"        # the Rust edition; 2021 is the current stable default
version = "0.1.0"

[dependencies]
${renderDeps(ctx.deps)}`,

  // ---- Entry points ----
  main_plain: (ctx) =>
`// Entry point. \`cargo run\` compiles the crate and calls main().
// Return type is () (nothing), so this program can't fail in a reported way yet.
fn main() {
    println!("Hello from ${ctx.crateName || ctx.projectName}!");
}
`,

  main_cli: (ctx) =>
`// Command-line entry point for ${ctx.crateName || ctx.projectName}.
//
// Flow: parse args -> do work -> report success or a friendly error.
// \`anyhow::Result\` lets us use the ? operator and print readable errors.

use anyhow::Result;
use clap::Parser;

/// Your program's arguments. clap turns each field into a flag/argument
/// and generates --help automatically from these doc comments.
#[derive(Parser, Debug)]
#[command(version, about = "Describe what ${ctx.crateName || ctx.projectName} does")]
struct Args {
    /// Example flag. Replace with your real inputs.
    #[arg(short, long, default_value = "world")]
    name: String,
}

fn main() -> Result<()> {
    // parse() reads the real command line and validates it.
    let args = Args::parse();

    println!("Hello, {}!", args.name);

    // Ok(()) means "finished with no error". Any Err(...) returned here
    // is printed for the user and sets a non-zero exit code.
    Ok(())
}
`,

  main_server: (ctx) =>
`// Async web server entry point for ${ctx.crateName || ctx.projectName}.
//
// #[tokio::main] starts the async runtime and lets main() use .await.

use axum::{routing::get, Router};
use std::net::SocketAddr;

#[tokio::main]
async fn main() {
    // A Router maps URL paths to handler functions.
    let app = Router::new().route("/", get(root));

    // Bind a TCP socket and serve requests until the process is stopped.
    let addr = SocketAddr::from(([127, 0, 0, 1], 3000));
    println!("listening on http://{addr}");

    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

/// Handler for GET /. Returning a &str sends it as the response body.
async fn root() -> &'static str {
    "Hello from ${ctx.crateName || ctx.projectName}"
}
`,

  main_ml: (ctx) =>
`// Pipeline entry point for ${ctx.crateName || ctx.projectName}.
//
// A typical ML run is a sequence of stages. Keep main() thin: it should
// only wire stages together, not contain the logic itself.

use anyhow::Result;

fn main() -> Result<()> {
    println!("[1/3] loading data");
    // let data = data_loader::load("data/train.csv")?;

    println!("[2/3] training");
    // let model = training::fit(&data)?;

    println!("[3/3] evaluating");
    // let score = training::evaluate(&model, &data)?;
    // println!("score = {score:.4}");

    Ok(())
}
`,

  // ---- Library roots ----
  lib_root: (ctx) =>
`//! ${ctx.crateName || ctx.projectName} library crate.
//!
//! lib.rs is the front door of a library. Declare your modules here and
//! re-export the types you want callers to use. Anything not \`pub\` stays private.

// Bring a submodule into the crate. \`mod error;\` looks for error.rs (or
// error/mod.rs) in this same directory.
// mod error;

// Re-export so callers write \`${ctx.crateName || 'mycrate'}::Thing\` instead of
// \`${ctx.crateName || 'mycrate'}::inner::Thing\`.
// pub use error::Error;

/// A starter function so the crate compiles. Replace with your real API.
pub fn version() -> &'static str {
    env!("CARGO_PKG_VERSION")
}
`,

  // ---- Submodule files ----
  mod_generic: (ctx) =>
`//! ${ctx.dirName} module.
//!
//! This file is the entry point for everything under ${ctx.dirName}/.
//! Add child files with \`mod child;\` and expose items with \`pub\`.
`,

  error_rs: () =>
`//! Central error type.
//!
//! One error enum per crate keeps error handling consistent. \`thiserror\`
//! writes the boilerplate Display/Error impls from these annotations.

use thiserror::Error;

#[derive(Debug, Error)]
pub enum Error {
    #[error("not found: {0}")]
    NotFound(String),

    // \`#[from]\` lets the ? operator convert std::io::Error into this variant
    // automatically.
    #[error("io error")]
    Io(#[from] std::io::Error),
}

/// Crate-wide Result alias so you write \`Result<T>\` instead of
/// \`Result<T, Error>\` everywhere.
pub type Result<T> = std::result::Result<T, Error>;
`,

  routes_rs: () =>
`//! HTTP route table.
//!
//! Keep routing separate from handler logic. This file answers one question:
//! which URL maps to which handler.

use axum::{routing::get, Router};

pub fn router() -> Router {
    Router::new().route("/health", get(crate::handlers::health))
}
`,

  handlers_rs: () =>
`//! Request handlers.
//!
//! A handler is just an async function. It takes extracted inputs and returns
//! something that can become an HTTP response.

pub async fn health() -> &'static str {
    "ok"
}
`,

  // ---- Config files ----
  gitignore: () =>
`# Compiled output and build cache. Never commit these.
/target

# Cargo.lock: commit it for binaries/apps, ignore it for libraries.
# Uncomment the next line only if this is a published library.
# Cargo.lock
`,

  readme: (ctx) =>
`# ${ctx.projectName}

> One sentence describing what this project does.

## Build

\`\`\`bash
cargo build
\`\`\`

## Run

\`\`\`bash
cargo run
\`\`\`

## Test

\`\`\`bash
cargo test
\`\`\`
`,

  toolchain: () =>
`# Pins the Rust version for everyone who builds this project, so "works on
# my machine" stops being a problem. Cargo reads this automatically.
[toolchain]
channel = "stable"
`,

  ci_yml: () =>
`name: CI

on:
  push:
    branches: [main]
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: dtolnay/rust-toolchain@stable
      # fmt and clippy catch style and common mistakes before tests run.
      - run: cargo fmt --all -- --check
      - run: cargo clippy -- -D warnings
      - run: cargo test
`,
};

export function renderTemplate(template, ctx) {
  const fn = TEMPLATES[template];
  return fn ? fn(ctx) : null;
}
