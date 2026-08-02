# Embedded Coding Agent Runtime

## Idea

The product should embed an existing coding-agent harness instead of rebuilding model orchestration, tool calling, context compaction, and coding tools.

## Core Concept

Pi is the coding-agent runtime inside an active node or integration Sandbox. A product-owned Pi extension connects the generic coding harness to operation drawings, node context, evidence, permissions, and artifact submission.

Pi is not the node, project graph, approval authority, or durable source of truth. It is replaceable execution intelligence behind a stable product adapter.

## Intent

Engineering effort should concentrate on the differentiated system: durable workspace nodes, collaborative graphs, visual human-agent planning, isolated proof, integration, pruning, and analytics.

## Execution Concept

The Worker and NodeAgent start or address a Sandbox for an active run. The Sandbox restores the node checkout and context, starts a headless Pi SDK session, loads the product extension, and streams typed events through the control plane.

The same runtime supports different roles through prompts, tool allowlists, and capabilities. An integration agent receives source and destination snapshots plus candidate-only Git tools. It cannot advance a canonical destination ref.

## Technical Aspects

The extension exposes drawing, node, evidence, and candidate-submission tools. It intercepts shell and file operations for policy enforcement and emits structured lifecycle events for analytics. Session summaries and event checkpoints persist outside the container because Sandbox disk and processes are ephemeral.

Production topology:

```text
Browser
  -> Worker / NodeAgent
      -> Sandbox container
          -> Pi SDK
          -> product extension
          -> repository checkout
```

The local prototype implements the adapter contract with deterministic context generation and simulated streamed runs. This keeps local development credential-free while preserving the interfaces that the container implementation must satisfy.

## Invariants

- Pi never owns canonical graph, Artifact, or approval state.
- The coding agent receives only capabilities scoped to its node and run.
- Canonical Git mutations remain platform operations.
- Agent session recovery does not depend on a surviving container filesystem.

