# Node Work Ledger

## Idea

Work in a node is tracked through structured intent, execution, and evidence rather than inferred from chat.

## Core Concept

The hierarchy is:

```text
Objective
└── Completion criteria
    └── Work items
        └── Runs
            └── Actions
                └── Checkpoints and evidence
```

Work items capture planned units and dependencies. Runs capture attempts. Actions capture concrete model, tool, command, edit, wait, and review activity. Checkpoints connect progress to commits, test results, decisions, or artifacts.

## Intent

A user opening a node should immediately know what was planned, what is happening, what is blocked, what actually changed, and what remains. The ledger should support agent autonomy without forcing the user to watch a terminal or transcript.

## Execution Concept

The Work mode presents completion criteria, a plan, active actors, blockers, recent evidence, and pending review. Agents can propose plan changes, but material scope changes require policy or approval. A work item can fail or be retried without losing its identity.

Progress is represented honestly: “4 of 7 work items complete; 2 criteria unverified; 1 blocker,” rather than an unsupported percentage. Stalled-work detection considers last checkpoint, repeated failures, budget use, and lack of observable change.

## Technical Aspects

NodeAgent SQLite stores objectives, criteria, work items, dependencies, runs, actions, checkpoints, and assignments. The Agent maintains a compact operational projection for real-time synchronization.

Events come from the orchestrator, Sandbox command wrapper, file watcher, Artifacts subscriptions, Workflows, and human actions. System-observed evidence is distinguished from agent-declared status.

## Invariants

- A run is an attempt, not the work item itself.
- Completion can cite evidence and reviewer identity.
- Event history is append-only; projections may be rebuilt.
- An agent may not silently remove completion criteria.

