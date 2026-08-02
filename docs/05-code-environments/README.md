# Code Environments

## Idea

Each coding node has durable, forkable code and isolated, on-demand compute.

## Core Concept

Artifacts is the durable Git source of truth; Sandbox is the disposable working environment; R2 preserves large outputs and optional runtime continuity.

Documents:

- [Artifacts repository model](./artifacts.md)
- [Sandbox execution model](./sandboxes.md)
- [Forking and inheritance](./forking-and-inheritance.md)
- [Persistence and checkpoints](./persistence-and-checkpoints.md)
- [Code integration](./code-integration.md)

## Intent

Humans and agents should explore independently, resume efficiently, and integrate selectively without confusing container lifetime with durable project state.

## Execution Concept

Node creation forks code, activation materializes it in a Sandbox, checkpoints push commits and optionally save runtime state, and reconciliation applies selected commits to a destination.

## Technical Aspects

Every code operation records source and destination commits. Tokens are short-lived and repo-scoped. Sandbox inactivity is normal and never treated as code loss when durable checkpoints exist.

